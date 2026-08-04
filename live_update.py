"""Live updater for the KSCA website.

Watches the KSCA feed continuously. Whenever KSCA marks a new match as
completed, it:
  1. Refreshes batting + bowling stats
  2. Extracts + appends the new keeper rows
  3. Regenerates reports/_extracted_data.json, reports/_match_data.json,
     web/src/lib/mock-data.ts and web/public/data/ksca-data.json

The website polls /data/ksca-data.json and automatically refreshes itself.

Usage:
    python live_update.py                 # watch forever (default 5 min poll)
    python live_update.py --poll 300      # custom poll interval (seconds)
    python live_update.py --once          # single check + refresh, then exit
    python live_update.py --full-every 360  # force a full refresh every N minutes
"""
import argparse
import json
import os
import subprocess
import sys
import time
import traceback
import logging
from datetime import datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT)
os.chdir(ROOT)

LOG_FILE = os.path.join(ROOT, "reports", f"live_update_{datetime.now().strftime('%Y%m%d')}.log")
os.makedirs(os.path.join(ROOT, "reports"), exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
log = logging.getLogger("live_update")

LOCK_FILE = os.path.join(ROOT, "live_update.lock")

# Website data snapshot pushed to the `live` branch so the deployed site can
# fetch fresh data without a Vercel rebuild.
DATA_FILE = os.path.join(ROOT, "web", "public", "data", "ksca-data.json")
PUSH_STATE = os.path.join(ROOT, "reports", ".live_push_state")


def pid_alive(pid):
    """Return True if a process with the given PID is currently running."""
    if pid <= 0:
        return False
    if os.name == "nt":
        try:
            result = subprocess.run(
                ["tasklist", "/FI", f"PID eq {pid}", "/NH"],
                capture_output=True,
                text=True,
                timeout=10,
                check=False,
            )
            return str(pid) in (result.stdout or "")
        except Exception:
            return False
    try:
        os.kill(pid, 0)
        return True
    except ProcessLookupError:
        return False
    except PermissionError:
        return True


def acquire_lock():
    """Single-instance lock with stale detection.

    A lock is treated as stale (and overridden) when the owning PID is no
    longer alive or the lock file is older than 6 hours, so a crashed or
    killed watcher can always be restarted without manual cleanup.
    """
    if os.path.exists(LOCK_FILE):
        try:
            with open(LOCK_FILE) as f:
                old_pid = int(f.read().strip())
            age_old = (time.time() - os.path.getmtime(LOCK_FILE)) > 6 * 3600
            if not age_old and pid_alive(old_pid):
                log.error(f"Another live_update instance is already running (PID {old_pid}). Exiting.")
                sys.exit(1)
            log.warning(f"Stale lock found (PID {old_pid}) - overriding")
        except Exception:
            pass
    with open(LOCK_FILE, "w") as f:
        f.write(str(os.getpid()))
    log.info(f"Lock acquired (PID {os.getpid()})")


def release_lock():
    try:
        if os.path.exists(LOCK_FILE):
            with open(LOCK_FILE) as f:
                pid = int(f.read().strip())
            if pid == os.getpid():
                os.remove(LOCK_FILE)
    except Exception:
        pass


def _data_fingerprint():
    """Hash of the snapshot ignoring `generatedAt`, so we only push when the
    actual cricket data changed (not on every poll cycle)."""
    import hashlib

    try:
        with open(DATA_FILE, encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, dict):
            data.pop("generatedAt", None)
        return hashlib.sha256(
            json.dumps(data, sort_keys=True, ensure_ascii=False).encode("utf-8")
        ).hexdigest()
    except Exception:
        return None


def _should_push():
    fp = _data_fingerprint()
    if not fp:
        return False
    try:
        with open(PUSH_STATE, encoding="utf-8") as f:
            return fp != f.read().strip()
    except FileNotFoundError:
        return True
    except Exception:
        return True


def _record_push():
    fp = _data_fingerprint()
    if fp:
        try:
            with open(PUSH_STATE, "w", encoding="utf-8") as f:
                f.write(fp)
        except Exception:
            pass


def push_to_live():
    """Commit the fresh website snapshot and push it to the `live` branch.

    The frontend fetches /data/ksca-data.json from the `live` branch (via
    raw.githubusercontent.com), so new match data reaches the deployed site
    within one poll cycle — no Vercel rebuild required.
    """
    if not _should_push():
        return
    try:
        subprocess.run(
            ["git", "add", "--", "web/public/data/ksca-data.json"],
            cwd=ROOT, check=True, capture_output=True,
        )
        subprocess.run(
            ["git", "commit", "-m", "chore: live data update"],
            cwd=ROOT, check=True, capture_output=True,
        )
        subprocess.run(
            ["git", "push", "origin", "HEAD:live"],
            cwd=ROOT, check=True, capture_output=True,
        )
        _record_push()
        log.info("Pushed website snapshot to 'live' branch")
    except subprocess.CalledProcessError as e:
        detail = (e.stderr or b"").decode("utf-8", "ignore").strip() or str(e)
        log.error(f"Live branch push failed (will retry next cycle): {detail[:400]}")
    except Exception as e:
        log.error(f"Live branch push failed (will retry next cycle): {e}")


def get_completed_match_ids(competition_id):
    from keeper_stats import fetch_match_schedule, extract_match_list
    from match_stats import is_completed

    schedule = fetch_match_schedule(competition_id)
    matches = extract_match_list(schedule)
    ids = set()
    for m in matches:
        mid = str(m.get("MatchID") or "")
        if mid and is_completed(m):
            ids.add(mid)
    log.info(f"Schedule poll: {len(matches)} matches, {len(ids)} completed")
    return ids


def known_match_ids(competition_id):
    import sqlite3
    from database import DB_PATH

    conn = sqlite3.connect(DB_PATH)
    try:
        rows = conn.execute(
            "SELECT match_id FROM processed_matches WHERE competition_id = ?",
            (str(competition_id),),
        ).fetchall()
    finally:
        conn.close()
    return {r[0] for r in rows}


def mark_processed(competition_id, match_ids):
    from database import mark_processed

    for mid in match_ids:
        mark_processed(mid, competition_id)
    if match_ids:
        log.info(f"Marked {len(match_ids)} matches as processed")


def run_refresh(competition_id, new_ids, full=False):
    """Refresh pipeline data + website snapshot."""
    from auto_update import step_player_stats
    from keeper_stats import extract_keepers
    from excel_export import export_append_keeper
    from sheets_writer import upload_keeper_data

    log.info("=" * 60)
    log.info("REFRESH START")
    log.info("=" * 60)

    try:
        step_player_stats()
    except Exception as e:
        log.error(f"Player stats refresh failed: {e}")
        log.error(traceback.format_exc())

    keeper_rows = []
    try:
        keeper_rows = extract_keepers(
            competition_id,
            match_ids=new_ids if (new_ids and not full) else None,
        )
    except Exception as e:
        log.error(f"Keeper extraction failed: {e}")
        log.error(traceback.format_exc())

    if keeper_rows:
        try:
            export_append_keeper(keeper_rows)
        except Exception as e:
            log.error(f"Keeper Excel append failed: {e}")
            log.error(traceback.format_exc())
        try:
            upload_keeper_data(keeper_rows)
        except Exception as e:
            log.warning(f"Google Sheet upload failed (continuing): {e}")
        try:
            from mongo_writer import store_keeper_rows

            store_keeper_rows(keeper_rows, competition_id)
            log.info(f"MongoDB: upserted {len(keeper_rows)} keeper rows")
        except Exception as e:
            log.warning(f"MongoDB keeper upload failed (continuing): {e}")

    try:
        from web_export import refresh_website_data

        refresh_website_data()
    except Exception as e:
        log.error(f"Website data refresh failed: {e}")
        log.error(traceback.format_exc())

    if full:
        mark_processed(competition_id, new_ids or (get_completed_match_ids(competition_id)))
    else:
        mark_processed(competition_id, new_ids)

    log.info("REFRESH COMPLETE")


def main():
    parser = argparse.ArgumentParser(description="KSCA live website updater")
    parser.add_argument("--poll", type=int, default=300, help="Poll interval in seconds (default 300)")
    parser.add_argument("--once", action="store_true", help="Run a single check + refresh and exit")
    parser.add_argument("--full-every", type=int, default=360, help="Force full refresh every N minutes (default 360)")
    parser.add_argument("--no-lock", action="store_true", help="Disable single-instance lock")
    args = parser.parse_args()

    from config import COMPETITION_ID

    if not args.no_lock:
        acquire_lock()

    try:
        next_full = time.monotonic() + args.full_every * 60

        while True:
            started = datetime.now()
            try:
                completed = get_completed_match_ids(COMPETITION_ID)
                known = known_match_ids(COMPETITION_ID)
                new_ids = completed - known
                force_full = time.monotonic() >= next_full

                if force_full:
                    log.info("Forced full refresh (interval reached)")
                    next_full = time.monotonic() + args.full_every * 60
                    run_refresh(COMPETITION_ID, completed, full=True)
                elif new_ids:
                    log.info(f"New completed matches detected: {sorted(new_ids)}")
                    run_refresh(COMPETITION_ID, new_ids, full=False)
                else:
                    log.info("No new matches — refreshing website snapshot")
                    try:
                        from web_export import build_frontend_json

                        build_frontend_json()
                        log.info("Website snapshot refreshed")
                    except Exception as e:
                        log.error(f"Website snapshot refresh failed: {e}")
                        log.error(traceback.format_exc())
            except KeyboardInterrupt:
                raise
            except Exception as e:
                log.error(f"Poll cycle failed: {e}")
                log.error(traceback.format_exc())

            push_to_live()

            if args.once:
                break

            elapsed = (datetime.now() - started).total_seconds()
            sleep = max(10, args.poll - elapsed)
            log.info(f"Next poll in {int(sleep)}s")
            time.sleep(sleep)
    finally:
        if not args.no_lock:
            release_lock()


if __name__ == "__main__":
    main()

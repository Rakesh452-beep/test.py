import os
import sys
import logging
import traceback
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.makedirs("reports", exist_ok=True)

LOG_FILE = f"reports/auto_update_{datetime.now().strftime('%Y%m%d')}.log"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
log = logging.getLogger(__name__)


def run_step(name, fn, *args, **kwargs):
    log.info("=" * 60)
    log.info(f"START: {name}")
    log.info("=" * 60)
    try:
        result = fn(*args, **kwargs)
        log.info(f"FINISH: {name} — OK")
        return result
    except Exception as e:
        log.error(f"FAIL: {name} — {e}")
        log.error(traceback.format_exc())
        return None


def step_player_stats():
    from teams import fetch_team_list
    from main_helpers import extract_team_ids
    from players import fetch_all_team_stats
    from excel_export import export_combined
    from config import COMPETITION_ID

    data = fetch_team_list(COMPETITION_ID)
    team_ids = list(data.keys()) if isinstance(data, dict) else extract_team_ids(data)
    log.info(f"Found {len(team_ids)} teams")
    all_batting, all_bowling = fetch_all_team_stats(team_ids, COMPETITION_ID)
    log.info(f"Batting records: {len(all_batting)}, Bowling records: {len(all_bowling)}")
    export_combined(all_batting, all_bowling)


def step_keeper_stats(today_only=False):
    from config import COMPETITION_ID
    from keeper_stats import extract_keepers
    from excel_export import export_append_keeper

    rows = extract_keepers(COMPETITION_ID, today_only=today_only)
    if rows:
        path = export_append_keeper(rows)
        log.info(f"Appended {len(rows)} keeper rows to {path}")
    else:
        log.info("No keeper rows found")


def step_keeper_upload(today_only=False):
    from config import COMPETITION_ID
    from keeper_stats import extract_keepers
    from sheets_writer import upload_keeper_data
    from database import mark_processed, get_processed_count

    rows = extract_keepers(COMPETITION_ID, today_only=today_only)
    if not rows:
        log.info("No keeper rows to upload")
        return
    upload_keeper_data(rows)
    for r in rows:
        match_id = r.get("_match_id")
        if match_id:
            mark_processed(match_id, COMPETITION_ID)
    processed = get_processed_count(COMPETITION_ID)
    log.info(f"Uploaded keeper data. Total processed matches: {processed}")


def step_google_sync():
    from excel_export import download_google_sheet, export_google_sheet_workbook
    from config import GOOGLE_SHEET_ID
    import pandas as pd

    workbook = download_google_sheet(GOOGLE_SHEET_ID)
    frames = []
    for sheet_name, df in workbook.items():
        df2 = df.copy()
        df2["_SourceSheet"] = sheet_name
        frames.append(df2)
    if frames:
        all_players = pd.concat(frames, ignore_index=True, sort=False)
        if "PlayerID" in all_players.columns:
            all_players = all_players.drop_duplicates(subset=["PlayerID"])
        elif "Player" in all_players.columns and "Team" in all_players.columns:
            all_players = all_players.drop_duplicates(subset=["Player", "Team"])
        out = {**workbook}
        out["AllPlayers"] = all_players
        export_google_sheet_workbook(out)
        log.info(f"Google Sheet synced ({len(all_players)} unique players)")
    else:
        log.info("Google workbook empty")


def step_email_report():
    from datetime import datetime
    from email_sender import send_email

    today = datetime.now().strftime("%d %b %Y")
    reports_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "reports")
    keeper_path = os.path.join(reports_dir, "WicketKeepers_latest.xlsx")

    attachments = [keeper_path] if os.path.exists(keeper_path) else []
    subject = f"KSCA U-19 Daily Report - {today}"
    body = (
        f"Hi Suresh,\n\n"
        f"Please find attached the updated KSCA U-19 WicketKeepers report for {today}.\n\n"
        f"This is the updated version with your requested changes:\n"
        f"  - Summary sheet now grouped by Club Name with hierarchical view\n"
        f"  - Scores sorted highest first within each club\n"
        f"  - Club-wise totals and GRAND TOTAL included\n\n"
        f"Previous reports have been cleaned up for clarity.\n\n"
        f"Regards,\nKSCA Auto Update"
    )

    send_email(subject, body, attachments)


def main():
    import argparse
    parser = argparse.ArgumentParser(description="KSCA Auto Update Pipeline")
    parser.add_argument("--stats-only", action="store_true", help="Run player stats only")
    parser.add_argument("--keeper-only", action="store_true", help="Run keeper stats only")
    parser.add_argument("--today", action="store_true", help="Only process today's completed matches")
    args = parser.parse_args()

    log.info("")
    log.info("")
    log.info("=" * 60)
    log.info(f"AUTO UPDATE PIPELINE — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    if args.today:
        log.info("Mode: TODAY'S MATCHES ONLY")
    log.info("=" * 60)

    kwargs = {}
    if args.today:
        kwargs["today_only"] = True

    if args.stats_only:
        run_step("Player Stats (batting + bowling)", step_player_stats)
    elif args.keeper_only:
        run_step("Keeper Stats (local export)", step_keeper_stats, **kwargs)
        run_step("Keeper Stats (Google Sheets upload)", step_keeper_upload, **kwargs)
    else:
        run_step("Player Stats (batting + bowling)", step_player_stats)
        run_step("Keeper Stats (local export)", step_keeper_stats, **kwargs)
        run_step("Keeper Stats (Google Sheets upload)", step_keeper_upload, **kwargs)
        run_step("Google Sheet sync", step_google_sync)

    run_step("Email daily report", step_email_report)

    log.info("=" * 60)
    log.info("PIPELINE COMPLETE")
    log.info(f"Log saved to: {LOG_FILE}")
    log.info("=" * 60)

    import subprocess
    reports_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "reports")
    files_to_open = [
        os.path.join(reports_dir, "WicketKeepers_latest.xlsx"),
        os.path.join(reports_dir, "AllTeams_Stats_latest.xlsx"),
    ]
    for f in files_to_open:
        if os.path.exists(f):
            try:
                subprocess.Popen(["start", "", f], shell=True)
                log.info(f"Opened: {f}")
            except Exception as e:
                log.warning(f"Could not open {f}: {e}")


if __name__ == "__main__":
    main()

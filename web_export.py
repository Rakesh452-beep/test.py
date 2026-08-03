import json
import os
import subprocess
import sys
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ROOT, "web", "public", "data")
OUT_FILE = os.path.join(OUT_DIR, "ksca-data.json")


def build_frontend_json():
    """Merge the pipeline's extracted data + match data into one runtime
    snapshot the website can fetch from /data/ksca-data.json."""
    with open(os.path.join(ROOT, "reports", "_extracted_data.json"), encoding="utf-8") as f:
        data = json.load(f)
    with open(os.path.join(ROOT, "reports", "_match_data.json"), encoding="utf-8") as f:
        matches = json.load(f)

    snapshot = {
        "teams": data.get("teams", []),
        "batters": data.get("batters", []),
        "bowlers": data.get("bowlers", []),
        "keepers": data.get("keepers", []),
        "matches": matches,
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }

    os.makedirs(OUT_DIR, exist_ok=True)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, ensure_ascii=False)

    return snapshot


def refresh_website_data():
    """Re-run the extractors/generators, then emit the runtime JSON."""
    for script in ("extract_data.py", "match_stats.py", "generate_ts_data.py"):
        subprocess.run(
            [sys.executable, script],
            cwd=ROOT,
            check=True,
            capture_output=True,
        )
    snapshot = build_frontend_json()
    meta = {
        "teams": len(snapshot["teams"]),
        "batters": len(snapshot["batters"]),
        "bowlers": len(snapshot["bowlers"]),
        "keepers": len(snapshot["keepers"]),
        "matches": len(snapshot["matches"]),
        "generatedAt": snapshot["generatedAt"],
    }
    print("Website data refreshed ->", OUT_FILE)
    print(json.dumps(meta))
    return snapshot


if __name__ == "__main__":
    if "--full" in sys.argv:
        refresh_website_data()
    else:
        snapshot = build_frontend_json()
        print("Website data written ->", OUT_FILE)
        print(json.dumps({
            "teams": len(snapshot["teams"]),
            "batters": len(snapshot["batters"]),
            "bowlers": len(snapshot["bowlers"]),
            "keepers": len(snapshot["keepers"]),
            "matches": len(snapshot["matches"]),
            "generatedAt": snapshot["generatedAt"],
        }))

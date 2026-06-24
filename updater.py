import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import COMPETITION_ID
from competition import resolve_competition
from teams import fetch_team_list
from keeper_stats import extract_keepers, rows_to_dataframe
from sheets_writer import upload_keeper_data
from excel_export import export_keeper_dataframe
from database import is_processed, mark_processed, get_processed_count


def run_keeper_update(competition_id=None, upload_to_sheets=True, save_local=True):
    if competition_id is None:
        competition_id = COMPETITION_ID

    print(f"=" * 60)
    print(f"KSCA Keeper Stats Update — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Competition: {competition_id}")
    print(f"=" * 60)

    comp = resolve_competition(competition_id)
    if comp:
        competition_id = comp["id"]
        print(f"Using competition: {comp['name']} (ID: {comp['id']})")

    rows = extract_keepers(competition_id)

    if not rows:
        print("No keeper rows extracted. Nothing to do.")
        return []

    if save_local:
        df = rows_to_dataframe(rows)
        export_keeper_dataframe(df)
        print(f"Exported {len(df)} rows to local Excel.")

    if upload_to_sheets:
        try:
            upload_keeper_data(rows)
            for r in rows:
                match_id = r.get("_match_id")
                if match_id:
                    mark_processed(match_id, competition_id)
            processed = get_processed_count(competition_id)
            print(f"Total processed matches for comp {competition_id}: {processed}")
        except Exception as e:
            print(f"Google Sheets upload failed: {e}")
            print("Data is still saved locally.")

    print(f"Done. {len(rows)} keeper rows processed.")
    return rows


def main():
    import argparse
    parser = argparse.ArgumentParser(description="KSCA Keeper Stats Updater")
    parser.add_argument("--no-upload", action="store_true", help="Skip Google Sheets upload")
    parser.add_argument("--no-local", action="store_true", help="Skip local Excel save")
    parser.add_argument("--comp", default=COMPETITION_ID, help=f"Competition ID (default: {COMPETITION_ID})")
    args = parser.parse_args()
    run_keeper_update(
        competition_id=args.comp,
        upload_to_sheets=not args.no_upload,
        save_local=not args.no_local,
    )


if __name__ == "__main__":
    main()

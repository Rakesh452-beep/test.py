import os
import sys

os.makedirs("reports", exist_ok=True)

from config import GOOGLE_SHEET_ID, COMPETITION_ID


def print_usage():
    print("""
KSCA Cricket Stats — Usage
===========================
  python main.py                     Fetch aggregate player stats, export to Excel
  python main.py google              Download Google Sheet as XLSX
  python main.py keeper              Extract keeper stats from matches, save locally
  python main.py upload              Extract keeper stats AND upload to Google Sheet
  python main.py stats               Same as default (aggregate player stats)
  python main.py comp                List competitions, show resolved U-19 tournament
  python main.py teams               List teams for competition
""")


def mode_keeper(upload_to_sheets=False):
    from keeper_stats import extract_keepers, rows_to_dataframe
    from excel_export import export_keeper_dataframe

    rows = extract_keepers(COMPETITION_ID)
    if not rows:
        print("No keeper rows extracted.")
        return

    df = rows_to_dataframe(rows)
    export_keeper_dataframe(df)
    print(f"Exported {len(df)} keeper rows to local Excel.")

    if upload_to_sheets:
        from sheets_writer import upload_keeper_data
        try:
            upload_keeper_data(rows)
        except Exception as e:
            print(f"Google Sheets upload failed: {e}")
            print("Data is still saved locally.")


def mode_stats():
    from teams import fetch_team_list
    from main_helpers import extract_team_ids
    from players import fetch_all_team_stats
    from excel_export import export_combined

    data = fetch_team_list(COMPETITION_ID)
    print(f"Team data loaded. Type: {type(data).__name__}")
    team_ids = list(data.keys()) if isinstance(data, dict) else extract_team_ids(data)
    print(f"Found {len(team_ids)} teams")

    all_batting, all_bowling = fetch_all_team_stats(team_ids, COMPETITION_ID)
    export_combined(all_batting, all_bowling)


def mode_google():
    from excel_export import download_google_sheet, export_google_sheet_workbook
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
    else:
        print("Google workbook empty; nothing to export")


def mode_comp():
    from competition import resolve_competition
    comp = resolve_competition(COMPETITION_ID)
    print(f"Competition: {comp}")


def mode_teams():
    from teams import fetch_team_list
    teams = fetch_team_list(COMPETITION_ID)
    for tid, tname in sorted(teams.items(), key=lambda x: x[1]):
        print(f"  {tid}: {tname}")
    print(f"Total: {len(teams)} teams")


def main():
    mode = "stats"
    if len(sys.argv) > 1:
        mode = sys.argv[1].lower()

    if mode in ("-h", "--help", "help"):
        print_usage()
    elif mode == "keeper":
        mode_keeper(upload_to_sheets=False)
    elif mode == "upload":
        mode_keeper(upload_to_sheets=True)
    elif mode == "google":
        mode_google()
    elif mode == "comp":
        mode_comp()
    elif mode == "teams":
        mode_teams()
    elif mode == "match":
        print("Match mode: use keeper mode instead (fetches all matches from schedule)")
    else:
        mode_stats()


if __name__ == "__main__":
    main()

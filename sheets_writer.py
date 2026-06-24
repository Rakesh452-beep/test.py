import os
import gspread
from config import SERVICE_ACCOUNT_FILE, GOOGLE_SHEET_ID, SHEET_TAB, SHEET_COLUMNS


def get_client():
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        raise FileNotFoundError(
            f"Service account key not found at: {SERVICE_ACCOUNT_FILE}\n"
            "Download from Google Cloud Console and save to that path."
        )
    return gspread.service_account(filename=SERVICE_ACCOUNT_FILE)


def ensure_sheet_tab(sh, tab_name):
    try:
        ws = sh.worksheet(tab_name)
    except gspread.exceptions.WorksheetNotFound:
        ws = sh.add_worksheet(title=tab_name, rows=100, cols=len(SHEET_COLUMNS))
    return ws


def write_header(ws):
    existing = ws.row_values(1)
    if existing != SHEET_COLUMNS:
        ws.clear()
        ws.update(range_name="A1", values=[SHEET_COLUMNS])


def upload_keeper_data(rows, tab_name=None):
    if tab_name is None:
        tab_name = SHEET_TAB
    client = get_client()
    sh = client.open_by_key(GOOGLE_SHEET_ID)
    ws = ensure_sheet_tab(sh, tab_name)
    write_header(ws)

    if not rows:
        print("No keeper rows to upload.")
        return

    data_rows = []
    for r in rows:
        data_rows.append([
            r.get("club", ""),
            r.get("date", ""),
            r.get("vs_team", ""),
            r.get("keeper", ""),
            r.get("score", "") if r.get("score") != "" else "",
            r.get("balls", "") if r.get("balls") != "" else "",
            r.get("out_not_out", ""),
            r.get("catches", "") if r.get("catches") != "" else "",
            r.get("stumps", "") if r.get("stumps") != "" else "",
            r.get("captain", ""),
            r.get("summary", ""),
        ])

    existing_rows = len(ws.get_all_values())
    if existing_rows > 1:
        ws.delete_rows(2, existing_rows)

    if data_rows:
        ws.append_rows(data_rows, value_input_option="USER_ENTERED")

    print(f"Uploaded {len(data_rows)} keeper rows to tab '{tab_name}' in the Google Sheet.")
    print(f"  Sheet URL: https://docs.google.com/spreadsheets/d/{GOOGLE_SHEET_ID}")

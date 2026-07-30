from database import get_connection
from downloader import download
from parser import parse_jsonp
from config import FEED_BASE, CALLBACKS, COMPETITION_ID

conn = get_connection()
cur = conn.execute("SELECT match_id FROM processed_matches")
processed = set(str(r[0]) for r in cur.fetchall())
print(f"Total processed: {len(processed)}")

url = f"{FEED_BASE}{COMPETITION_ID}-matchschedule.js?callback={CALLBACKS['matchschedule']}"
text = download(url)
data = parse_jsonp(text, CALLBACKS["matchschedule"])
matches = data.get("Matchsummary", [])

for m in matches:
    date = str(m.get("MatchDate", ""))[:10]
    if date >= "2026-07-10":
        mid = str(m.get("MatchID", ""))
        status = m.get("MatchStatus", "")
        state = m.get("MATCH_STATE", "")
        is_end = m.get("IsMatchEnd", 0)
        if mid not in processed:
            print(f"UNPROCESSED: {mid} - {date} - {m.get('MatchName')} - Status: {status} / State: {state} / IsMatchEnd: {is_end}")
        else:
            print(f"PROCESSED:   {mid} - {date} - {m.get('MatchName')}")

conn.close()

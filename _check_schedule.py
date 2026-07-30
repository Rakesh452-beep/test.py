from downloader import download
from parser import parse_jsonp
from config import FEED_BASE, CALLBACKS, COMPETITION_ID

url = f"{FEED_BASE}{COMPETITION_ID}-matchschedule.js?callback={CALLBACKS['matchschedule']}"
text = download(url)
data = parse_jsonp(text, CALLBACKS["matchschedule"])
matches = data.get("Matchsummary", [])
print(f"Total matches: {len(matches)}")
dates = sorted(set(
    str(m.get("MatchDate", ""))[:10]
    for m in matches
    if str(m.get("MatchDate", ""))[:10] and str(m.get("MatchDate", ""))[:10] != "0001-01-01"
))
print("Match dates in schedule:")
for d in dates:
    count = sum(1 for m in matches if str(m.get("MatchDate", ""))[:10] == d)
    print(f"  {d}: {count} matches")

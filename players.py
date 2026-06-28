from downloader import download
from parser import parse_jsonp
from config import STATS_BASE, CALLBACKS


def fetch_team_stats(team_id, competition_id="306"):
    url = f"{STATS_BASE}{competition_id}-{team_id}-playerinninswisestats.js?callback={CALLBACKS['playerinnings']}"
    print("Fetching team stats:", url)
    text = download(url)
    data = parse_jsonp(text, CALLBACKS['playerinnings'])
    batting = data.get("PlayerBattingKPI", [])
    bowling = data.get("PlayerBowlingKPI", [])
    for record in batting + bowling:
        if "TeamID" not in record:
            record["TeamID"] = team_id
    return batting, bowling


def fetch_all_team_stats(team_ids, competition_id="306"):
    from concurrent.futures import ThreadPoolExecutor, as_completed
    all_batting = []
    all_bowling = []
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(fetch_team_stats, tid, competition_id): tid for tid in team_ids}
        for future in as_completed(futures):
            try:
                batting, bowling = future.result()
                all_batting.extend(batting)
                all_bowling.extend(bowling)
            except Exception as e:
                print("Error fetching team", futures[future], "->", e)
    return all_batting, all_bowling

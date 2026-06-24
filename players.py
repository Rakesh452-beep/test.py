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
    all_batting = []
    all_bowling = []
    for team_id in team_ids:
        try:
            batting, bowling = fetch_team_stats(team_id, competition_id)
            all_batting.extend(batting)
            all_bowling.extend(bowling)
        except Exception as e:
            print("Error fetching team", team_id, "->", e)
            continue
    return all_batting, all_bowling

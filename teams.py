from downloader import download
from parser import parse_jsonp
from config import STATS_BASE, CALLBACKS


def fetch_team_list(competition_id="306"):
    url = f"{STATS_BASE}{competition_id}-teamlist.js?callback={CALLBACKS['teamlist']}"
    text = download(url)
    data = parse_jsonp(text, CALLBACKS['teamlist'])
    teams = {}
    for v in data.values():
        if isinstance(v, list) and v:
            for item in v:
                if isinstance(item, dict):
                    tid = item.get("TeamID") or item.get("TeamId") or item.get("teamId") or item.get("teamid")
                    tname = item.get("TeamName") or item.get("teamName") or item.get("name")
                    if tid and tname:
                        teams[str(tid)] = tname
    if not teams:
        for k, v in data.items():
            if 'team' in k.lower() and isinstance(v, list):
                for item in v:
                    if isinstance(item, dict):
                        tid = item.get("TeamID") or item.get("TeamId") or item.get("teamId") or item.get("teamid")
                        tname = item.get("TeamName") or item.get("teamName") or item.get("name")
                        if tid and tname:
                            teams[str(tid)] = tname
    print(f"Found {len(teams)} teams for competition {competition_id}")
    return teams

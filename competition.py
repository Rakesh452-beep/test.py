from downloader import download
from parser import parse_jsonp
from config import FEED_BASE, CALLBACKS


def fetch_competition_list():
    url = f"{FEED_BASE}competition.js?callback={CALLBACKS['competition']}"
    text = download(url)
    return parse_jsonp(text, CALLBACKS['competition'])


def find_u19_tournament(data, target_id=None):
    competitions = data.get("competition", [])
    if not isinstance(competitions, list):
        return None
    for c in competitions:
        if not isinstance(c, dict):
            continue
        comp_id = c.get("CompetitionID")
        name = c.get("CompetitionName", "")
        season = c.get("SeasonID")
        ongoing = c.get("OnGoing", 0)
        if target_id and str(comp_id) == str(target_id):
            return {
                "id": str(comp_id),
                "name": name,
                "season": str(season) if season else None,
                "ongoing": ongoing,
            }
        if "UNDER 19" in name.upper() and "INTER CLUB" in name.upper():
            if target_id is None:
                return {
                    "id": str(comp_id),
                    "name": name,
                    "season": str(season) if season else None,
                    "ongoing": ongoing,
                }
    return None


def resolve_competition(target_id="306"):
    data = fetch_competition_list()
    comp = find_u19_tournament(data, target_id)
    if comp:
        status = "ONGOING" if comp.get("ongoing") else "COMPLETED"
        print(f"Resolved: {comp['name']} (ID: {comp['id']}, Season: {comp.get('season')}, {status})")
        return comp
    fallback = find_u19_tournament(data)
    if fallback:
        print(f"Target ID {target_id} not found. Falling back to: {fallback['name']} (ID: {fallback['id']})")
        return fallback
    print(f"Using default competition ID: {target_id}")
    return {"id": target_id, "name": f"Competition {target_id}", "season": None, "ongoing": 0}

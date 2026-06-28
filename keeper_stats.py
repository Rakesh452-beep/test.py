import re
from datetime import datetime
from downloader import download
from parser import parse_jsonp
from config import FEED_BASE, CALLBACKS, COMPETITION_ID


def strip_name_suffix(name):
    name = re.sub(r'\s*\([^)]*\)\s*', '', name).strip()
    name = re.sub(r'\s{2,}', ' ', name)
    return name


def has_role(name, role):
    return f"({role})" in name.upper() or f"({role})" in name.lower()


def extract_keepers_from_innings(innings_data, innings_key):
    inn = innings_data.get(innings_key, {}) if isinstance(innings_data, dict) else innings_data
    if isinstance(inn, dict):
        batting_card = inn.get("BattingCard", [])
    elif isinstance(inn, list):
        batting_card = inn
    else:
        batting_card = []
    keepers = []
    for player in batting_card:
        if not isinstance(player, dict):
            continue
        pname = player.get("PlayerName", "")
        if has_role(pname, "wk"):
            keepers.append({
                "name": pname.strip(),
                "base_name": strip_name_suffix(pname),
                "runs": player.get("Runs", 0),
                "balls": player.get("Balls", 0),
                "out_desc": player.get("OutDesc", ""),
                "fours": player.get("Fours", 0),
                "sixes": player.get("Sixes", 0),
                "strike_rate": player.get("StrikeRate", ""),
                "is_captain": has_role(pname, "c"),
                "playing_order": player.get("PlayingOrder", 99),
            })
    return keepers


def count_catches_against_keeper(batting_card, keeper_base_name):
    count = 0
    name_variants = [keeper_base_name]
    parts = keeper_base_name.split()
    if len(parts) >= 2:
        name_variants.append(parts[-1])
    for player in batting_card:
        if not isinstance(player, dict):
            continue
        out_desc = player.get("OutDesc", "")
        if not out_desc:
            continue
        for variant in name_variants:
            escaped = re.escape(variant)
            c_pattern = re.search(r'(?<!\w)c\s+' + escaped + r'(?!\w)', out_desc, re.IGNORECASE)
            cb_pattern = re.search(r'c\s+&\s+b\s+' + escaped + r'(?!\w)', out_desc, re.IGNORECASE)
            if c_pattern or cb_pattern:
                count += 1
                break
    return count


def count_stumpings(innings_data, innings_key, keeper_base_name):
    total = 0
    kbn_lower = keeper_base_name.lower()
    inn = innings_data.get(innings_key, {}) if isinstance(innings_data, dict) else innings_data
    if not isinstance(inn, dict):
        return 0

    h2h = inn.get("bowlingheadtohead", [])
    if not isinstance(h2h, list):
        h2h = []
    for row in h2h:
        if not isinstance(row, dict):
            continue
        bowler = row.get("BowlerName", "")
        stumps = row.get("StumpingsDone", 0)
        if isinstance(stumps, str):
            try:
                stumps = int(stumps)
            except ValueError:
                stumps = 0
        if stumps and (bowler.strip().lower() == kbn_lower or kbn_lower in bowler.lower()):
            total += stumps

    over_history = inn.get("OverHistory", [])
    if isinstance(over_history, list):
        for ball in over_history:
            if isinstance(ball, dict) and ball.get("WicketType") == "Stumped":
                fielder = ball.get("FielderName", "")
                if kbn_lower in fielder.lower():
                    total += 1

    batting_card = inn.get("BattingCard", [])
    if isinstance(batting_card, list):
        name_variants = [keeper_base_name]
        parts = keeper_base_name.split()
        if len(parts) >= 2:
            name_variants.append(parts[-1])
        for player in batting_card:
            if not isinstance(player, dict):
                continue
            out_desc = player.get("OutDesc", "")
            if not out_desc:
                continue
            for variant in name_variants:
                escaped = re.escape(variant)
                if re.search(r'(?<!\w)st\s+' + escaped + r'(?!\w)', out_desc, re.IGNORECASE):
                    total += 1
                    break

    return total


def fetch_match_schedule(competition_id):
    url = f"{FEED_BASE}{competition_id}-matchschedule.js?callback={CALLBACKS['matchschedule']}"
    text = download(url)
    data = parse_jsonp(text, CALLBACKS['matchschedule'])
    return data


def extract_match_list(schedule_data):
    matches = schedule_data.get("Matchsummary", [])
    if not isinstance(matches, list):
        matches = []
    return matches


def fetch_match_summary(match_id):
    url = f"{FEED_BASE}{match_id}-matchsummary.js?callback={CALLBACKS['matchsummary']}"
    try:
        text = download(url)
        data = parse_jsonp(text, CALLBACKS['matchsummary'])
        ms_list = data.get("MatchSummary", [])
        if isinstance(ms_list, list) and ms_list:
            return ms_list[0]
        if isinstance(ms_list, dict):
            return ms_list
        return None
    except Exception as e:
        print(f"  Could not fetch match summary for {match_id}: {e}")
        return None


def fetch_innings(match_id, innings_no):
    url = f"{FEED_BASE}{match_id}-Innings{innings_no}.js?callback={CALLBACKS['innings']}"
    try:
        text = download(url)
        data = parse_jsonp(text, CALLBACKS['innings'])
        return data
    except Exception as e:
        print(f"  Could not fetch Innings{innings_no} for {match_id}: {e}")
        return None


def determine_out_not_out(out_desc):
    od = out_desc.strip().lower()
    if not od or od == "not out":
        return "Not out"
    return "Out"


def _match_date_str(match):
    return str(match.get("MatchDate", "") or "")


def _is_today_match(match, today_str):
    md = _match_date_str(match)
    if not md or md == "0001-01-01":
        return False
    return md[:10] == today_str


def build_all_rows(matches, competition_id, team_name_map=None, max_matches=0, today_only=False):
    rows = []
    if team_name_map is None:
        try:
            from teams import fetch_team_list
            team_name_map = fetch_team_list(competition_id)
        except Exception:
            team_name_map = {}

    today_str = datetime.now().strftime("%Y-%m-%d") if today_only else ""

    total = len(matches)
    if max_matches > 0 and max_matches < total:
        print(f"Processing {max_matches} of {total} matches (max_matches limit)")
        matches = matches[:max_matches]

    for idx, match in enumerate(matches):
        if today_only and not _is_today_match(match, today_str):
            continue
        if (idx + 1) % 10 == 0 or idx == 0:
            print(f"  Processing match {idx+1}/{len(matches)}...")
        match_id = match.get("MatchID")
        if not match_id:
            continue
        match_id = str(match_id)

        match_status = str(match.get("MatchStatus", "") or "")
        match_state = str(match.get("MATCH_STATE", "") or "")
        match_date_raw = match.get("MatchDate", "")
        match_name = match.get("MatchName", "")

        is_match_end = match.get("IsMatchEnd", 0)
        is_completed = (
            match_status.lower() in ("completed", "post", "result")
            or match_state.lower() in ("c", "completed")
            or str(is_match_end) == "1"
        )
        is_abandoned = (
            "abandon" in match_status.lower()
            or "cancel" in match_status.lower()
            or "abandon" in match_state.lower()
        )

        summary = fetch_match_summary(match_id)

        if summary:
            tname_a = summary.get("Team1", "")
            tname_b = summary.get("Team2", "")
            date_str = summary.get("MatchDate", match_date_raw)
            first_bat_team = summary.get("FirstBattingTeam", "")
            second_bat_team = summary.get("SecondBattingTeam", "")
            if team_name_map:
                raw_fbt = str(first_bat_team).strip()
                raw_sbt = str(second_bat_team).strip()
                if raw_fbt in team_name_map:
                    first_bat_team = team_name_map[raw_fbt]
                elif raw_fbt.isdigit() and raw_fbt in team_name_map:
                    first_bat_team = team_name_map[raw_fbt]
                if raw_sbt in team_name_map:
                    second_bat_team = team_name_map[raw_sbt]
                elif raw_sbt.isdigit() and raw_sbt in team_name_map:
                    second_bat_team = team_name_map[raw_sbt]
            score1 = summary.get("1Summary", "")
            score2 = summary.get("2Summary", "")
            is_match_end = summary.get("IsMatchEnd", is_match_end)
            winning_team_id = summary.get("WinningTeamID", "")
            match_result = ""
            if str(winning_team_id) and str(winning_team_id) != "0":
                try:
                    if team_name_map and str(winning_team_id) in team_name_map:
                        winner = team_name_map[str(winning_team_id)]
                        match_result = f"{winner} Won"
                    else:
                        match_result = f"Team {winning_team_id} Won"
                except Exception:
                    match_result = f"Team {winning_team_id} Won"
            if score1 and score2:
                if not match_result:
                    match_result = f"{score1} & {score2}"
                else:
                    match_result = f"{match_result} | {score1} & {score2}"
        else:
            tname_a = tname_b = ""
            date_str = match_date_raw
            first_bat_team = second_bat_team = ""
            match_result = ""

        if is_abandoned or (is_completed and not summary):
            rows.append({
                "club": tname_a or match_name.split(" VS ")[0].strip() if " VS " in match_name else tname_a,
                "date": date_str if date_str and date_str != "0001-01-01" else "",
                "vs_team": tname_b or match_name.split(" VS ")[1].strip() if " VS " in match_name else tname_b,
                "keeper": "",
                "score": "",
                "balls": "",
                "out_not_out": "",
                "catches": "",
                "stumps": "",
                "captain": "",
                "summary": match_result or "Match Abandoned / No Result",
                "_match_id": match_id,
            })
            continue

        if not is_completed:
            continue

        inn1 = fetch_innings(match_id, 1)
        inn2 = fetch_innings(match_id, 2)

        if inn1 is None and inn2 is None:
            rows.append({
                "club": tname_a or match_name.split(" VS ")[0].strip() if " VS " in match_name else tname_a,
                "date": date_str if date_str and date_str != "0001-01-01" else "",
                "vs_team": tname_b or match_name.split(" VS ")[1].strip() if " VS " in match_name else tname_b,
                "keeper": "", "score": "", "balls": "", "out_not_out": "",
                "catches": "", "stumps": "", "captain": "",
                "summary": match_result or "No scorecard data",
                "_match_id": match_id,
            })
            continue

        inn1_bc = inn1.get("Innings1", {}).get("BattingCard", []) if inn1 else []
        inn2_bc = inn2.get("Innings2", {}).get("BattingCard", []) if inn2 else []

        if inn1 is not None:
            keepers_inn1 = extract_keepers_from_innings(inn1, "Innings1")
            for keeper in keepers_inn1:
                catches = count_catches_against_keeper(inn2_bc, keeper["base_name"])
                stumps = count_stumpings(inn2, "Innings2", keeper["base_name"])
                rows.append({
                    "club": first_bat_team or tname_a,
                    "date": date_str,
                    "vs_team": second_bat_team or tname_b,
                    "keeper": keeper["name"],
                    "score": keeper["runs"],
                    "balls": keeper["balls"],
                    "out_not_out": determine_out_not_out(keeper["out_desc"]),
                    "catches": catches,
                    "stumps": stumps,
                    "captain": "Yes" if keeper.get("is_captain") else "",
                    "summary": match_result,
                    "_match_id": match_id,
                })

        if inn2 is not None:
            keepers_inn2 = extract_keepers_from_innings(inn2, "Innings2")
            for keeper in keepers_inn2:
                catches = count_catches_against_keeper(inn1_bc, keeper["base_name"])
                stumps = count_stumpings(inn1, "Innings1", keeper["base_name"])
                rows.append({
                    "club": second_bat_team or tname_b,
                    "date": date_str,
                    "vs_team": first_bat_team or tname_a,
                    "keeper": keeper["name"],
                    "score": keeper["runs"],
                    "balls": keeper["balls"],
                    "out_not_out": determine_out_not_out(keeper["out_desc"]),
                    "catches": catches,
                    "stumps": stumps,
                    "captain": "Yes" if keeper.get("is_captain") else "",
                    "summary": match_result,
                    "_match_id": match_id,
                })

    return rows


def extract_keepers(competition_id=None, max_matches=0, today_only=False):
    if competition_id is None:
        competition_id = COMPETITION_ID
    schedule_data = fetch_match_schedule(competition_id)
    matches = extract_match_list(schedule_data)
    if not matches:
        print(f"No matches found in schedule for competition {competition_id}")
        return []
    print(f"Found {len(matches)} matches in competition {competition_id}")

    try:
        from teams import fetch_team_list
        team_name_map = fetch_team_list(competition_id)
    except Exception:
        team_name_map = {}

    rows = build_all_rows(matches, competition_id, team_name_map, max_matches=max_matches, today_only=today_only)
    print(f"Extracted {len(rows)} keeper rows")
    return rows


def rows_to_dataframe(rows):
    import pandas as pd
    df = pd.DataFrame(rows, columns=[
        "club", "date", "vs_team", "keeper", "score", "balls",
        "out_not_out", "catches", "stumps", "captain", "summary"
    ])
    df.columns = [
        "Club Name", "Date", "Vs Team", "Name of Keeper",
        "Score", "Balls Faced", "Out/Not out", "Catches",
        "Stumps", "Captain Yes\\No", "Match Summary"
    ]
    for col in ["Score", "Balls Faced", "Catches", "Stumps"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0).astype(int)
    return df

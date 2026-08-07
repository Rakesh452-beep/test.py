import json
import re
import sys

from config import COMPETITION_ID
from keeper_stats import (
    fetch_match_schedule,
    extract_match_list,
    fetch_innings,
    fetch_match_summary,
)


def clean_name(name):
    name = re.sub(r"\s*\([^)]*\)\s*", "", name or "").strip()
    name = re.sub(r"\s{2,}", " ", name)
    return name


def is_completed(match):
    status = str(match.get("MatchStatus", "") or "").lower()
    state = str(match.get("MATCH_STATE", "") or "").lower()
    is_end = str(match.get("IsMatchEnd", 0))
    if "abandon" in status or "cancel" in status or "abandon" in state:
        return False
    return status in ("completed", "post", "result") or state in ("c", "completed") or is_end == "1"


def not_out_from_desc(out_desc):
    od = (out_desc or "").strip()
    return (not od) or od.lower() == "not out"


def build_matches(matches):
    out = []
    for idx, match in enumerate(matches):
        match_id = str(match.get("MatchID"))
        if not match_id or not is_completed(match):
            continue

        date = str(match.get("MatchDate", "") or "")[:10]
        if not date or date == "0001-01-01":
            continue

        t1 = str(match.get("FirstBattingTeamName", "") or "").strip()
        t2 = str(match.get("SecondBattingTeamName", "") or "").strip()
        summary = str(match.get("Commentss", "") or "").strip()

        if not t1 or not t2:
            ms = fetch_match_summary(match_id)
            if ms:
                t1 = str(ms.get("Team1", "") or t1 or "").strip()
                t2 = str(ms.get("Team2", "") or t2 or "").strip()
                if not summary:
                    s1 = ms.get("1Summary", "")
                    s2 = ms.get("2Summary", "")
                    summary = f"{s1} & {s2}" if s1 and s2 else ""
        if not t1 or not t2:
            print(f"  skip {match_id}: no team names")
            continue

        batting = []
        bowling = []

        for inn_no, bat_club, bowl_club in ((1, t1, t2), (2, t2, t1)):
            inn = fetch_innings(match_id, inn_no)
            if not inn:
                continue
            key = f"Innings{inn_no}"
            data = inn.get(key, {}) if isinstance(inn, dict) else inn
            if not isinstance(data, dict):
                continue

            for p in data.get("BattingCard", []):
                if not isinstance(p, dict):
                    continue
                batting.append({
                    "innings": inn_no,
                    "club": bat_club,
                    "vs_team": bowl_club,
                    "player": clean_name(p.get("PlayerName", "")),
                    "playing_order": p.get("PlayingOrder", 99),
                    "runs": int(p.get("Runs") or 0),
                    "balls": int(p.get("Balls") or 0),
                    "fours": int(p.get("Fours") or 0),
                    "sixes": int(p.get("Sixes") or 0),
                    "out_desc": p.get("OutDesc", "") or "",
                    "not_out": not_out_from_desc(p.get("OutDesc", "")),
                })

            for b in data.get("BowlingCard", []):
                if not isinstance(b, dict):
                    continue
                bowling.append({
                    "innings": inn_no,
                    "club": bowl_club,
                    "vs_team": bat_club,
                    "bowler": clean_name(b.get("PlayerName", "")),
                    "bowling_order": b.get("BowlingOrder", 99),
                    "overs": float(b.get("Overs") or 0),
                    "maidens": int(b.get("Maidens") or 0),
                    "runs": int(b.get("Runs") or 0),
                    "wickets": int(b.get("Wickets") or 0),
                    "wides": int(b.get("Wides") or 0),
                    "no_balls": int(b.get("NoBalls") or 0),
                    "economy": float(b.get("Economy") or 0),
                })

        out.append({
            "match_id": match_id,
            "date": date,
            "team1": t1,
            "team2": t2,
            "summary": summary,
            "batting": batting,
            "bowling": bowling,
        })

        if (idx + 1) % 10 == 0:
            print(f"  processed {idx + 1}/{len(matches)} (kept {len(out)})")
            sys.stdout.flush()

    return out


if __name__ == "__main__":
    schedule = fetch_match_schedule(COMPETITION_ID)
    matches = extract_match_list(schedule)
    print(f"Total matches in schedule: {len(matches)}")

    result = build_matches(matches)

    with open("reports/_match_data.json", "w") as f:
        json.dump(result, f, indent=2)

    total_bat = sum(len(m["batting"]) for m in result)
    total_bowl = sum(len(m["bowling"]) for m in result)
    print(f"Done: {len(result)} matches, {total_bat} batting rows, {total_bowl} bowling rows")

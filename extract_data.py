import pandas as pd
import json

path = "reports/AllTeams_Stats_latest.xlsx"

# --- KEEPER DATA ---
df_k = pd.read_excel(path, sheet_name="Sheet1")
keepers = []
for _, row in df_k.iterrows():
    keepers.append({
        "club": str(row.get("Club Name", "")),
        "date": str(row.get("Date", ""))[:10],
        "vs_team": str(row.get("Vs Team", "")),
        "keeper": str(row.get("Name of Keeper", "")),
        "score": int(row.get("Score", 0)) if pd.notna(row.get("Score")) else 0,
        "balls": int(row.get("Balls Faced", 0)) if pd.notna(row.get("Balls Faced")) else 0,
        "out_not_out": str(row.get("Out/Not out", "")),
        "catches": int(row.get("Catches", 0)) if pd.notna(row.get("Catches")) else 0,
        "stumps": int(row.get("Stumps", 0)) if pd.notna(row.get("Stumps")) else 0,
        "captain": str(row.get("Captain Yes\\No", "")),
        "summary": str(row.get("Match Summary", "")),
    })

# --- BATTING DATA (top 50 by runs) ---
df_b = pd.read_excel(path, sheet_name="Batting")

df_b["Highest_Score_Clean"] = df_b["Highest Score"].astype(str).str.replace(r"[*]", "", regex=True)
df_b["Highest_Score_Clean"] = pd.to_numeric(df_b["Highest_Score_Clean"], errors="coerce").fillna(0).astype(int)

bat_agg = df_b.groupby(["Player", "Team"], as_index=False).agg({
    "Runs": "sum", "Balls": "sum", "Bdry4Scored": "sum", "Bdry6Scored": "sum",
    "Strike Rate": "mean", "Average": "mean", "Highest_Score_Clean": "max",
    "100s": "sum", "50s": "sum", "Outs": "sum", "NotOuts": "sum",
})
bat_agg = bat_agg.sort_values("Runs", ascending=False).head(50)

batters = []
for _, row in bat_agg.iterrows():
    batters.append({
        "PlayerName": str(row.get("Player", "")),
        "TeamName": str(row.get("Team", "")),
        "Runs": int(row["Runs"]),
        "Balls": int(row["Balls"]),
        "Fours": int(row["Bdry4Scored"]),
        "Sixes": int(row["Bdry6Scored"]),
        "StrikeRate": round(float(row["Strike Rate"]), 1) if pd.notna(row["Strike Rate"]) else 0,
        "BattingAverage": round(float(row["Average"]), 2) if pd.notna(row["Average"]) else 0,
        "HighestScore": int(row["Highest_Score_Clean"]),
        "Hundreds": int(row["100s"]),
        "Fifties": int(row["50s"]),
        "Innings": int(row.get("Outs", 0) + row.get("NotOuts", 0)),
        "NotOuts": int(row["NotOuts"]),
    })

# --- BOWLING DATA (top 30 by wickets) ---
df_bo = pd.read_excel(path, sheet_name="Bowling")
bowl_agg = df_bo.groupby(["BowlerName"], as_index=False).agg({
    "Wickets": "sum", "TotalRunsConceeded": "sum", "TotalLegalBallsBowled": "sum",
    "Maidens": "sum", "EconomyRate": "mean", "BowlingAverage": "mean",
    "BowlingSR": "mean", "MaidenWickets": "sum",
})
bowl_agg = bowl_agg.sort_values("Wickets", ascending=False).head(30)

team_map = dict(zip(df_b["TeamID"].astype(str), df_b["Team"]))
df_bo["TeamID_str"] = df_bo["TeamID"].astype(str)
bowler_team_map = df_bo.groupby("BowlerName")["TeamID_str"].first().to_dict()

bowlers = []
for _, row in bowl_agg.iterrows():
    bname = str(row.get("BowlerName", ""))
    tid = bowler_team_map.get(bname, "")
    balls = int(row["TotalLegalBallsBowled"]) if pd.notna(row["TotalLegalBallsBowled"]) else 0
    overs = round(balls / 6, 1)
    bowlers.append({
        "PlayerName": bname,
        "TeamName": team_map.get(tid, ""),
        "Overs": overs,
        "Maidens": int(row["Maidens"]) if pd.notna(row["Maidens"]) else 0,
        "Runs": int(row["TotalRunsConceeded"]) if pd.notna(row["TotalRunsConceeded"]) else 0,
        "Wickets": int(row["Wickets"]),
        "Economy": round(float(row["EconomyRate"]), 2) if pd.notna(row["EconomyRate"]) else 0,
        "BowlingAverage": round(float(row["BowlingAverage"]), 2) if pd.notna(row["BowlingAverage"]) else 0,
        "StrikeRate": round(float(row["BowlingSR"]), 1) if pd.notna(row["BowlingSR"]) else 0,
        "FiveWickets": int(row["MaidenWickets"]) if pd.notna(row["MaidenWickets"]) else 0,
    })

# Unique teams
all_teams = set()
for b in batters:
    all_teams.add(b["TeamName"])
teams = [{"id": str(i+1), "name": t} for i, t in enumerate(sorted(all_teams))]

output = {
    "keepers": keepers,
    "batters": batters,
    "bowlers": bowlers,
    "teams": teams,
    "_meta": {"keeper_count": len(keepers), "batter_count": len(batters), "bowler_count": len(bowlers), "team_count": len(teams)}
}

with open("reports/_extracted_data.json", "w") as f:
    json.dump(output, f, indent=2)

print(json.dumps(output["_meta"]))
print("OK")

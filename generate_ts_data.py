import json, os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
with open("reports/_extracted_data.json") as f:
    data = json.load(f)

ts = """import type { Batter, Bowler, KeeperRow, Team } from "./types";

export const MOCK_TEAMS: Team[] = """ + json.dumps(data["teams"], indent=2) + """;

export const MOCK_BATTERS: Batter[] = """ + json.dumps(data["batters"], indent=2) + """;

export const MOCK_BOWLERS: Bowler[] = """ + json.dumps(data["bowlers"], indent=2) + """;

export const MOCK_KEEPERS: KeeperRow[] = """ + json.dumps(data["keepers"], indent=2) + """;

export function getBatterStats() {
  return MOCK_BATTERS.sort((a, b) => b.Runs - a.Runs);
}

export function getBowlerStats() {
  return MOCK_BOWLERS.sort((a, b) => b.Wickets - a.Wickets);
}

export function getKeeperStats() {
  return MOCK_KEEPERS;
}

export function getTeamBattingBreakdown() {
  const map = new Map<string, { runs: number; wickets: number; matches: number; players: Set<string> }>();
  for (const b of MOCK_BATTERS) {
    if (!map.has(b.TeamName)) map.set(b.TeamName, { runs: 0, wickets: 0, matches: 0, players: new Set() });
    const entry = map.get(b.TeamName)!;
    entry.runs += b.Runs;
    entry.players.add(b.PlayerName);
  }
  const maxRuns = Math.max(...Array.from(map.values()).map(v => v.runs));
  return Array.from(map.entries()).map(([team, data]) => ({
    team,
    runs: data.runs,
    players: data.players.size,
    percentage: Math.round((data.runs / maxRuns) * 100),
  })).sort((a, b) => b.runs - a.runs);
}

export function getTeamBowlingBreakdown() {
  const map = new Map<string, { wickets: number; economy: number; count: number }>();
  for (const b of MOCK_BOWLERS) {
    if (!map.has(b.TeamName)) map.set(b.TeamName, { wickets: 0, economy: 0, count: 0 });
    const entry = map.get(b.TeamName)!;
    entry.wickets += b.Wickets;
    entry.economy += b.Economy;
    entry.count += 1;
  }
  const maxW = Math.max(...Array.from(map.values()).map(v => v.wickets));
  return Array.from(map.entries()).map(([team, data]) => ({
    team,
    wickets: data.wickets,
    avgEconomy: (data.economy / data.count).toFixed(2),
    percentage: Math.round((data.wickets / maxW) * 100),
  })).sort((a, b) => b.wickets - a.wickets);
}

export function getKeeperClubSummary() {
  const map = new Map<string, { runs: number; balls: number; catches: number; stumps: number; keepers: Set<string> }>();
  for (const k of MOCK_KEEPERS) {
    if (!map.has(k.club)) map.set(k.club, { runs: 0, balls: 0, catches: 0, stumps: 0, keepers: new Set() });
    const entry = map.get(k.club)!;
    entry.runs += k.score;
    entry.balls += k.balls;
    entry.catches += k.catches;
    entry.stumps += k.stumps;
    entry.keepers.add(k.keeper);
  }
  const grandTotal = { runs: 0, balls: 0, catches: 0, stumps: 0 };
  const clubs = Array.from(map.entries()).map(([club, data]) => {
    grandTotal.runs += data.runs;
    grandTotal.balls += data.balls;
    grandTotal.catches += data.catches;
    grandTotal.stumps += data.stumps;
    return { club, ...data, keepers: data.keepers.size };
  }).sort((a, b) => b.runs - a.runs);
  return { clubs, grandTotal };
}

export function getTopScorers(limit = 5) {
  return getBatterStats().slice(0, limit);
}

export function getTopWicketTakers(limit = 5) {
  return getBowlerStats().slice(0, limit);
}
"""

with open("web/src/lib/mock-data.ts", "w") as f:
    f.write(ts)

print("Done -", len(data["batters"]), "batters,", len(data["bowlers"]), "bowlers,", len(data["keepers"]), "keepers,", len(data["teams"]), "teams")

import json, os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
with open("reports/_extracted_data.json") as f:
    data = json.load(f)
<<<<<<< HEAD

ts = 'import type { Batter, Bowler, KeeperRow, Team } from "./types";\n\n'
=======
with open("reports/_match_data.json") as f:
    matches = json.load(f)

ts = 'import type { Batter, Bowler, DailyMatch, KeeperRow, Team } from "./types";\n\n'
>>>>>>> origin/teju

ts += "export const MOCK_TEAMS: Team[] = " + json.dumps(data["teams"], indent=2) + ";\n\n"
ts += "export const MOCK_BATTERS: Batter[] = " + json.dumps(data["batters"], indent=2) + ";\n\n"
ts += "export const MOCK_BOWLERS: Bowler[] = " + json.dumps(data["bowlers"], indent=2) + ";\n\n"
ts += "export const MOCK_KEEPERS: KeeperRow[] = " + json.dumps(data["keepers"], indent=2) + ";\n\n"
<<<<<<< HEAD

ts += """export function getBatterStats() {
  return MOCK_BATTERS.sort((a, b) => b.Runs - a.Runs);
}

export function getBowlerStats() {
  return MOCK_BOWLERS.sort((a, b) => b.Wickets - a.Wickets);
}

export function getKeeperStats() {
  return MOCK_KEEPERS;
=======
ts += "export const MOCK_MATCHES: DailyMatch[] = " + json.dumps(matches, indent=2) + ";\n\n"

ts += """export interface LiveSnapshot {
  teams: Team[];
  batters: Batter[];
  bowlers: Bowler[];
  keepers: KeeperRow[];
  matches: DailyMatch[];
  generatedAt?: string;
}

let LIVE: LiveSnapshot | null = null;
let LIVE_FP = "";
const LIVE_LISTENERS = new Set<() => void>();

function liveFingerprint(data: LiveSnapshot): string {
  const last = data.matches?.length ? data.matches[data.matches.length - 1]?.match_id ?? "" : "";
  return [
    data.generatedAt ?? "",
    data.batters?.length ?? 0,
    data.bowlers?.length ?? 0,
    data.keepers?.length ?? 0,
    data.matches?.length ?? 0,
    last,
  ].join("|");
}

export function getLiveSnapshot(): LiveSnapshot | null {
  return LIVE;
}

export function subscribeLive(listener: () => void): () => void {
  LIVE_LISTENERS.add(listener);
  return () => {
    LIVE_LISTENERS.delete(listener);
  };
}

export function setLiveData(data: LiveSnapshot): boolean {
  const fp = liveFingerprint(data);
  const changed = fp !== LIVE_FP;
  if (changed || !LIVE) {
    LIVE = data;
    LIVE_FP = fp;
    LIVE_LISTENERS.forEach((l) => l());
  }
  return changed;
}

const TEAMS = () => LIVE?.teams ?? MOCK_TEAMS;
const BATTERS = () => LIVE?.batters ?? MOCK_BATTERS;
const BOWLERS = () => LIVE?.bowlers ?? MOCK_BOWLERS;
const KEEPERS = () => LIVE?.keepers ?? MOCK_KEEPERS;
const MATCHES = () => LIVE?.matches ?? MOCK_MATCHES;

export function getTeams() {
  return TEAMS();
}

export function getMatches() {
  return MATCHES();
}

export function getKeepers() {
  return KEEPERS();
}

export function getBatterStats() {
  return [...BATTERS()].sort((a, b) => b.Runs - a.Runs);
}

export function getBowlerStats() {
  return [...BOWLERS()].sort((a, b) => b.Wickets - a.Wickets);
}

export function getKeeperStats() {
  return KEEPERS();
>>>>>>> origin/teju
}

export function getTeamBattingBreakdown() {
  const map = new Map<string, { runs: number; wickets: number; matches: number; players: Set<string> }>();
<<<<<<< HEAD
  for (const b of MOCK_BATTERS) {
=======
  for (const b of BATTERS()) {
>>>>>>> origin/teju
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
<<<<<<< HEAD
  for (const b of MOCK_BOWLERS) {
=======
  for (const b of BOWLERS()) {
>>>>>>> origin/teju
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
<<<<<<< HEAD
  for (const k of MOCK_KEEPERS) {
=======
  for (const k of KEEPERS()) {
>>>>>>> origin/teju
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

export function getTopStrikeRates(limit = 5) {
<<<<<<< HEAD
  return [...MOCK_BATTERS].sort((a, b) => b.StrikeRate - a.StrikeRate).slice(0, limit);
}

export function getTopAverages(limit = 5) {
  return [...MOCK_BATTERS].filter(b => b.Runs > 0).sort((a, b) => b.BattingAverage - a.BattingAverage).slice(0, limit);
}

export function getBestEconomy(limit = 5) {
  return [...MOCK_BOWLERS].filter(b => b.Wickets > 0).sort((a, b) => a.Economy - b.Economy).slice(0, limit);
}

export function getBestBowlingFigures(limit = 5) {
  return [...MOCK_BOWLERS]
=======
  return [...BATTERS()].sort((a, b) => b.StrikeRate - a.StrikeRate).slice(0, limit);
}

export function getTopAverages(limit = 5) {
  return [...BATTERS()].filter(b => b.Runs > 0).sort((a, b) => b.BattingAverage - a.BattingAverage).slice(0, limit);
}

export function getBestEconomy(limit = 5) {
  return [...BOWLERS()].filter(b => b.Wickets > 0).sort((a, b) => a.Economy - b.Economy).slice(0, limit);
}

export function getBestBowlingFigures(limit = 5) {
  return [...BOWLERS()]
>>>>>>> origin/teju
    .filter(b => b.BestBowling)
    .sort((a, b) => {
      const aW = parseInt(a.BestBowling!.split("/")[0]);
      const bW = parseInt(b.BestBowling!.split("/")[0]);
      return bW - aW;
    })
    .slice(0, limit);
}

function deterministicStyle(name: string): "RHB" | "LHB" {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  return hash % 5 === 0 ? "LHB" : "RHB";
}

export interface UnifiedPlayer {
  name: string;
  team: string;
  role: "Batsman" | "Bowler";
  battingStyle: "RHB" | "LHB";
  runs?: number;
  wickets?: number;
  battingAverage?: number;
  bowlingAverage?: number;
  strikeRate?: number;
  economy?: number;
  highestScore?: number;
  hundreds?: number;
  fifties?: number;
  fours?: number;
  sixes?: number;
  overs?: number;
  maidens?: number;
  fiveWickets?: number;
  innings?: number;
  notOuts?: number;
  balls?: number;
  runsConceded?: number;
}

export function getAllPlayers(): UnifiedPlayer[] {
<<<<<<< HEAD
  const batters: UnifiedPlayer[] = MOCK_BATTERS.map((b) => ({
=======
  const batters: UnifiedPlayer[] = BATTERS().map((b) => ({
>>>>>>> origin/teju
    name: b.PlayerName.trim(),
    team: b.TeamName,
    role: "Batsman" as const,
    battingStyle: deterministicStyle(b.PlayerName),
    runs: b.Runs,
    battingAverage: b.BattingAverage,
    strikeRate: b.StrikeRate,
    highestScore: b.HighestScore,
    hundreds: b.Hundreds,
    fifties: b.Fifties,
    fours: b.Fours,
    sixes: b.Sixes,
    innings: b.Innings,
    notOuts: b.NotOuts,
    balls: b.Balls,
  }));

<<<<<<< HEAD
  const bowlers: UnifiedPlayer[] = MOCK_BOWLERS.map((b) => ({
=======
  const bowlers: UnifiedPlayer[] = BOWLERS().map((b) => ({
>>>>>>> origin/teju
    name: b.PlayerName.trim(),
    team: b.TeamName,
    role: "Bowler" as const,
    battingStyle: deterministicStyle(b.PlayerName),
    wickets: b.Wickets,
    bowlingAverage: b.BowlingAverage,
    strikeRate: b.StrikeRate,
    economy: b.Economy,
    overs: b.Overs,
    maidens: b.Maidens,
    fiveWickets: b.FiveWickets,
    runsConceded: b.Runs,
    innings: b.Innings,
  }));

  return [...batters, ...bowlers].sort((a, b) => {
    const aKey = (a.runs ?? 0) + (a.wickets ?? 0) * 10;
    const bKey = (b.runs ?? 0) + (b.wickets ?? 0) * 10;
    return bKey - aKey;
  });
}

export function getAllTeams() {
  const teamSet = new Set<string>();
<<<<<<< HEAD
  MOCK_BATTERS.forEach((b) => teamSet.add(b.TeamName));
  MOCK_BOWLERS.forEach((b) => teamSet.add(b.TeamName));
  MOCK_KEEPERS.forEach((k) => {
=======
  BATTERS().forEach((b) => teamSet.add(b.TeamName));
  BOWLERS().forEach((b) => teamSet.add(b.TeamName));
  KEEPERS().forEach((k) => {
>>>>>>> origin/teju
    teamSet.add(k.club);
    teamSet.add(k.vs_team);
  });
  return Array.from(teamSet).sort();
}
"""

with open("web/src/lib/mock-data.ts", "w") as f:
    f.write(ts)

print("Done -", len(data["batters"]), "batters,", len(data["bowlers"]), "bowlers,", len(data["keepers"]), "keepers,", len(data["teams"]), "teams")

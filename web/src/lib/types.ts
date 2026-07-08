export interface Batter {
  PlayerID?: string;
  PlayerName: string;
  TeamName: string;
  TeamID?: string;
  _rank?: number;
  Runs: number;
  Balls: number;
  Fours: number;
  Sixes: number;
  StrikeRate: number;
  BattingAverage: number;
  HighestScore: number;
  Hundreds: number;
  Fifties: number;
  Ducks?: number;
  Matches?: number;
  Innings?: number;
  NotOuts?: number;
}

export interface Bowler {
  PlayerID?: string;
  PlayerName: string;
  TeamName: string;
  TeamID?: string;
  _rank?: number;
  Overs: number;
  Maidens: number;
  Runs: number;
  Wickets: number;
  Economy: number;
  BowlingAverage: number;
  StrikeRate: number;
  FiveWickets: number;
  BestBowling?: string;
  Matches?: number;
  Innings?: number;
}

export interface KeeperRow {
  club: string;
  date: string;
  vs_team: string;
  keeper: string;
  score: number;
  balls: number;
  out_not_out: string;
  catches: number;
  stumps: number;
  captain: string;
  summary: string;
  _match_id?: string;
}

export interface KeeperSummary {
  club: string;
  total_runs: number;
  total_balls: number;
  total_catches: number;
  total_stumps: number;
  keeper_count: number;
}

export interface DailyMatch {
  match_id: string;
  date: string;
  team1: string;
  team2: string;
  result: string;
  batters: Batter[];
  bowlers: Bowler[];
  keepers: KeeperRow[];
}

export interface Team {
  id: string;
  name: string;
}

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

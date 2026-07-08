# KSCA U-19 Dashboard — Project Plan

## Team Members & Roles

| Person | Role | Focus Area |
|--------|------|------------|
| **Yasawini** | Backend/Data Engineer | Supabase + Pipeline + Database |
| **Janardhan** | Frontend Developer | Batting, Bowling, Daily pages |
| **Tejaswini** | UI/UX Developer | Landing, Keepers, Profile, Components, Styles |

---

## Yasawini — Backend & Data Infrastructure

| # | Task | Deliverable | Files |
|---|------|-------------|-------|
| 1 | Create Supabase project at supabase.com (free, no credit card) | Supabase project URL + anon key | — |
| 2 | Write & run SQL schema | 3 tables created: `batting_stats`, `bowling_stats`, `keeper_stats` | `supabase-schema.sql` |
| 3 | Share credentials | Give `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Janardhan & Tejaswini | `.env.local` |
| 4 | Add `step_push_to_supabase()` in `auto_update.py` after keeper pipeline | Pipeline pushes data to Supabase after daily run | `auto_update.py` |
| 5 | Test full flow | Run `python auto_update.py --nightly`, verify data in Supabase dashboard | — |
| 6 | Deploy to Vercel | Connect GitHub repo, set env vars, deploy | Vercel dashboard |

---

## Janardhan — Frontend Data Pages

| # | Task | Files |
|---|------|-------|
| 1 | **Batting page** — stat cards, top scorers bar chart, sortable table, team breakdown, player name click → profile | `src/app/batting/page.tsx` |
| 2 | **Bowling page** — stat cards, wickets bar chart, economy leaders, table, player name click → profile | `src/app/bowling/page.tsx` |
| 3 | **Daily Match Report** — date navigation, per-match keeper/batter/bowler tables | `src/app/daily/page.tsx` |
| 4 | Wire up Supabase real data | Replace `mock-data.ts` imports with Supabase queries in all 3 pages |

---

## Tejaswini — UI/UX & Interactive Components

| # | Task | Files |
|---|------|-------|
| 1 | **Landing page** — animated hero, KPI counters, nav cards, top performers section | `src/app/page.tsx` |
| 2 | **Keeper Analysis** — batting bar chart + dismissals pie chart + comparison bar chart + match log table | `src/app/keepers/page.tsx` |
| 3 | **Club Summary** — Grand Total hero card + per-club grid cards | `src/app/keeper-summary/page.tsx` |
| 4 | **Player Profile Modal** — clicking any player name (batter/bowler/keeper) opens a glassmorphism modal showing: | `src/components/PlayerProfile.tsx` |
| | • Avatar circle with initials | |
| | • Player name, team, role (Batsman/Bowler) | |
| | • 8 stat cards in a grid (Runs, Avg, SR, HS, 100s/50s, Fours/Sixes for batters / Wickets, Eco, Avg, Overs, 5w for bowlers) | |
| | • Animated open/close with Framer Motion | |
| | Already built — wire up to batting/bowling pages | |
| 5 | **Navbar** — desktop sidebar + mobile drawer with active link indicator | `src/components/Navbar.tsx` |
| 6 | **UI Components** — StatCard, DataTable, ChartCard, TeamFilter, LoadingSkeleton, PageTransition, cn() utility | All `src/components/*.tsx`, `src/lib/utils.ts` |
| 7 | **Global Styles** — dark theme, glassmorphism, animations, responsive breakpoints | `src/app/globals.css` |

---

## Shared — Vercel Deployment (do together after all code is ready)

| # | Task | Who |
|---|------|-----|
| 1 | Push all code to GitHub | All 3 |
| 2 | Connect repo to Vercel (vercel.com) | Yasawini |
| 3 | Add Supabase env vars in Vercel dashboard | Yasawini |
| 4 | Run deploy, test live URL | All 3 together |

---

## Development Workflow

```bash
# Everyone
cd web
npm install
npm run dev          # opens http://localhost:3000
```

Each person edits their assigned files — the dev server auto-reloads on save. Push to GitHub when done, then Yasawini deploys to Vercel.

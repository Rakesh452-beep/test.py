# KSCA Auto-Update — Session Context
## Last updated: 25 Jun 2026

### What's set up
- Daily scheduled task `KSCA_DailyUpdate` runs at **9:25 PM IST**
- Full pipeline: player stats → keeper export + upload → Google Sheet sync → email → open Excel
- Fetches only that day's completed matches (`--today` flag via `--nightly`)
- Appends keepers to `reports/WicketKeepers_latest.xlsx`
- Summary sheet = Club Name pivot (Club → Keeper → Score, sorted highest first, Club Totals + GRAND TOTAL)
- **Email** sent to Sureshkutam@gmail.com with WicketKeepers_latest.xlsx attached
- Subject: `"KSCA U-19 Daily Report - {date}"` / prefix: `"KSCA Updated"`
- Old emails with subject "KSCA Updated" auto-deleted from Sent before sending
- **Excel auto-opens** on desktop after pipeline completes (via direct EXCEL.EXE launch)

### Session — 25 Jun 2026

#### Changes made:

1. **`web/static/index.html`** — Rewrote as single-page dashboard hub with tabbed section switching (batting, keepers, keeper-summary, bowling) using dark citron brutalist design:
   - Color palette: `#0a0a0a` (obsidian), `#e2ff3b` (citron), `#a3a3a3` (titanium)
   - Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (data)
   - Brutalist: sharp edges, 4px solid block shadows, grid background, bracket corner accents
   - Sidebar nav (desktop) + bottom nav (mobile), active state, refresh button with spinner, toast notifications, Ctrl+R shortcut
   - All data from live API endpoints

2. **`web/static/batting.html`** — Dedicated batting page with 4 stat cards, search/team filter/sort, paginated table, Orange Cap sidebar, Top 10, Team Breakdown

3. **`web/static/bowling.html`** — Dedicated bowling page with 4 stat cards, search/filter/sort, paginated table, Team Bowling Breakdown

4. **`web/static/keepers.html`** — Dedicated wicket keeping page with 3 metric cards, search/club filter, paginated match log, Club Keeper Breakdown

5. **`web/static/keeper-summary.html`** — Dedicated keeper club summary with Grand Total hero card + per-club grid cards

6. **`web/app.py`** — Added `/keeper-summary` route serving `keeper-summary.html`

7. **`auto_update.py`** — Major refactor:
   - Merged `step_keeper_stats` + `step_keeper_upload` → single `step_keeper_pipeline()` (eliminated duplicate API calls)
   - Fixed Excel auto-open: `subprocess.Popen(["start", ...])` → direct `EXCEL.EXE` launch via registry lookup (`winreg`)
   - Removed dead code (old keeper step functions)

8. **`players.py`** — `fetch_all_team_stats()`: sequential `for` loop → `ThreadPoolExecutor(max_workers=10)` (61 teams now fetch in parallel, ~35s → ~5s)

9. **`downloader.py`** — Major overhaul:
   - Added `requests.Session()` with connection pooling
   - Added `HTTPAdapter` with `urllib3.Retry` (3 retries, backoff factor 2)
   - Timeout increased: 15s → 30s
   - Manual retry loop with exponential backoff for SSL/timeout errors

10. **Scheduled task** — Fixed:
    - `Execute`: `python` → `C:\Program Files\Python311\python.exe` (full path)
    - Added `WorkingDirectory`: `C:\Users\Lenovo\Desktop\test.py`
    - Time changed: 21:30 → 21:25

#### Known issues:
- API server (`d27i8b90nps4in.cloudfront.net`) has frequent SSL/timeout errors — mitigated by retry logic in downloader.py
- `count_stumpings()` in `keeper_stats.py` has double-counting bug (not fixed this session)

#### Last pipeline run: 25 Jun 2026 ~21:43 (manual `--nightly`)
- Player Stats: 1331 batting, 804 bowling
- Keeper Stats: 16 new rows (46 total processed matches)
- Email sent to Sureshkutam@gmail.com — OK
- Excel opened — OK
- Scheduled task at 21:25 failed (old config: no WorkingDirectory, bare `python`); fixed and re-ran manually at 21:29

### Important files
- `C:\Users\Lenovo\Desktop\test.py\auto_update.py` — main pipeline (187 lines)
- `C:\Users\Lenovo\Desktop\test.py\excel_export.py` — Excel writer
- `C:\Users\Lenovo\Desktop\test.py\email_sender.py` — email with IMAP delete
- `C:\Users\Lenovo\Desktop\test.py\config.py` — config (COMPETITION_ID=306, email creds, sheet ID)
- `C:\Users\Lenovo\Desktop\test.py\keeper_stats.py` — keeper extraction
- `C:\Users\Lenovo\Desktop\test.py\downloader.py` — HTTP download (timeout=30s, retries=3, backoff=2)
- `C:\Users\Lenovo\Desktop\test.py\players.py` — player stats with parallel team fetch
- `C:\Users\Lenovo\Desktop\test.py\reports\WicketKeepers_latest.xlsx` — master keeper file
- `C:\Users\Lenovo\Desktop\test.py\reports\AllTeams_Stats_latest.xlsx` — player aggregate stats
- `C:\Users\Lenovo\Desktop\test.py\schedule_daily.ps1` — scheduled task creator
- `C:\Users\Lenovo\Desktop\test.py\web\app.py` — FastAPI server (port 8000)
- `C:\Users\Lenovo\Desktop\test.py\web\static\*.html` — brutalist web dashboard pages

### Email config
- Sender: rakeshkumarirri28@gmail.com (App Password: tatn bbmq cwoq noty)
- Recipient: Sureshkutam@gmail.com

### Scheduled task details
- **Task Name:** KSCA_DailyUpdate
- **Trigger:** Daily at 21:25
- **Command:** `python "C:\Users\Lenovo\Desktop\test.py\auto_update.py" --nightly`
- **Execute:** `C:\Program Files\Python311\python.exe`
- **WorkingDirectory:** `C:\Users\Lenovo\Desktop\test.py`
- **User:** Lenovo (Interactive, Limited)
- **State:** Ready
- **Next run:** 26 Jun 2026 21:25

### Web Dashboard (25 Jun 2026)
- **Stack:** FastAPI (Python) + vanilla HTML/CSS/JS
- **Port:** 8000
- **Theme:** Dark citron brutalist (`#0a0a0a`, `#e2ff3b`, `#a3a3a3`, `#ffffff`)
- **Pages:** `/` (hub), `/batting`, `/bowling`, `/keepers`, `/keeper-summary`
- **Run:** `cd web && python app.py` → `http://localhost:8000`

### Web Redesign (26 Jun 2026)
- **`web/static/styles.css`** — Created shared design system CSS file with:
  - Refined CSS custom properties (obsidian/carbon/steel/surface/citron palette)
  - Reusable component classes: `.card`, `.btn`, `.nav-link`, `.stat-value`, `.table-header`, `.pagination-btn`, `.toast`, `.badge`, `.club-card`, `.mini-stat`
  - Loading skeleton animation (`.skeleton` with shimmer keyframes)
  - Section transitions (`.fade-in` with staggered delay classes)
  - Mobile-first responsive breakpoints at 768px/480px
  - Custom select arrows via inline SVG data URIs
  - Reduced motion support via `prefers-reduced-motion`
  - Focus-visible outlines for keyboard navigation
  - Smooth hover/active transitions with cubic-bezier timing

- **`web/static/index.html`** — Complete UI overhaul:
  - **Visual hierarchy**: Card shadows sharpened, corner accents refined, better spacing rhythm
  - **Loading skeletons**: Shimmer animation replaces bare text while data loads
  - **Search fields**: Integrated magnifying glass icon inside input with left padding
  - **Table improvements**: Sticky headers, hover rows (`table-row` class), inline bar charts, rank badges with gold/silver variants
  - **Team breakdowns**: Added visual bar charts relative to max value
  - **Keepers section**: Color-coded dismissal badges (red for Out, green for Not out)
  - **Sidebar**: Top 10 scorers list with compact horizontal layout, now collapsible on mobile
  - **Mobile responsiveness**: Hamburger-style filter toggle, 2-column stat grids at 768px, stack at 480px
  - **Navigation**: Underline slide animation on nav links, keyboard accessible (Enter/Space)
  - **Status bar**: Shows last refresh timestamp alongside live clock
  - **Refresh button**: Shows "..." on mobile, proper spinner state management
  - **Error states**: Distinct `cloud_off` / `database_off` icons for connection vs empty states
  - **Data density**: More compact padding, optimized table column widths

- **`web/app.py`** — Added `app.mount("/static", ...)` to serve `styles.css` and future static assets

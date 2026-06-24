# KSCA Auto-Update — Session Context
## Last updated: 23 Jun 2026

### What's set up
- Daily scheduled task `KSCA_DailyUpdate` runs at **9:30 PM IST**
- Fetches only that day's completed matches (`--today` flag)
- Appends keepers to `reports/WicketKeepers_latest.xlsx`
- Summary sheet = **Club Name pivot** (Club → Keeper → Score, sorted highest first, Club Totals + GRAND TOTAL)
- **Email** sent to Sureshkutam@gmail.com with only WicketKeepers_latest.xlsx attached (no body, just attachment)
- Subject format: **"KSCA Updated - {date}"**
- Old emails with subject "KSCA Updated" auto-deleted from Sent before sending
- Excel does NOT auto-open (`--no-open` used to prevent file lock)

### Session — 23 Jun 2026 (21:37 IST)

#### Changes made:

1. **`excel_export.py`** — Added date sorting to `export_append_keeper`:
   - Keeper rows now sorted by date ascending before writing to Excel
   - Uses `pd.to_datetime()` on "Date" column (format: `%d %b %Y`) then `sort_values`

2. **`auto_update.py`** — Simplified `step_email_report`:
   - Subject changed from `"KSCA U-19 Daily Report - {date}"` to `"KSCA Updated - {date}"`
   - Body changed from full message to empty string (just attachment)

3. **`email_sender.py`** — Updated `SUBJECT_PREFIX` from `"KSCA U-19 Daily Report"` to `"KSCA Updated"` to match new subject for auto-delete of old sent emails

#### Known issues found during review (not fixed):
- `count_stumpings()` in `keeper_stats.py` has double-counting bug (sums stumpings from 3 overlapping sources)
- Source 1 of `count_stumpings()` matches bowler name to keeper name — logic error
- `REQUEST_TIMEOUT = 15` in `downloader.py` too low — caused timeout errors on 23 Jun 21:30 run

#### Last pipeline run: 23 Jun 2026 ~21:37 (manual)
- Player Stats: 1187 batting, 708 bowling
- Keeper Stats: 22 new rows appended (154 unique total), uploaded to Google Sheets
- Email sent to Sureshkutam@gmail.com — OK
- Scheduled task at 21:30 had timeout error on keeper upload; local export succeeded with 22 rows

### Important files
- `C:\Users\Lenovo\Desktop\test.py\auto_update.py` — main pipeline
- `C:\Users\Lenovo\Desktop\test.py\excel_export.py` — Excel writer
- `C:\Users\Lenovo\Desktop\test.py\email_sender.py` — email with IMAP delete
- `C:\Users\Lenovo\Desktop\test.py\config.py` — config (COMPETITION_ID=306, email creds, sheet ID)
- `C:\Users\Lenovo\Desktop\test.py\keeper_stats.py` — keeper extraction
- `C:\Users\Lenovo\Desktop\test.py\downloader.py` — HTTP download (timeout=15s)
- `C:\Users\Lenovo\Desktop\test.py\reports\WicketKeepers_latest.xlsx` — master file (154 unique rows, date-sorted)
- `C:\Users\Lenovo\Desktop\test.py\reports\AllTeams_Stats_latest.xlsx` — player aggregate stats
- `C:\Users\Lenovo\Desktop\test.py\schedule_daily.ps1` — scheduled task creator

### Email config
- Sender: rakeshkumarirri28@gmail.com (App Password: tatn bbmq cwoq noty)
- Recipient: Sureshkutam@gmail.com

### Web Dashboard (23 Jun 2026)

**Stack:** FastAPI (Python) backend + vanilla HTML/CSS/JS frontend

**Backend** — `web/app.py`:
- FastAPI server on port 8000
- API endpoints:
  - `GET /api/stats/batting` — Batting stats from `AllTeams_Stats_latest.xlsx`
  - `GET /api/stats/keepers` — Keeper log from `WicketKeepers_latest.xlsx`
  - `GET /api/stats/keeper-summary` — Summary sheet from `WicketKeepers_latest.xlsx`
  - `GET /api/stats/all-players` — All players merged sheet
  - `GET /api/info` — File metadata + server timestamp
  - `POST /api/refresh` — Triggers `auto_update.py` stats + keeper subprocesses
- All API responses are JSON from Excel sheets read via pandas

**Frontend** — `web/static/`:
- `index.html` — Single-page app with sidebar layout
- `app.js` — Client logic (fetch, render, filter, auto-refresh)
- `style.css` — Splash screen, glassmorphism, dark theme
- `logo.svg` — Cricket stumps logo with gold gradient + rotating glow ring

**Features:**
- **Splash screen** — Animated logo (`logoGlow`), gradient "KSCA" title, bouncing loader dots (2.8s)
- **3 tabs:** Batting, Wicket Keepers, Keeper Summary
- **Sidebar** (desktop) + **bottom nav** (mobile)
- **Summary stat cards** — Total Runs / Centuries / Top Score / Players (batting), Catches / Stumps / Dismissals / Entries (keepers)
- **Tables** with avatar initials, rank badges, colored stats (gold for runs, cyan for wickets/catches/stumps)
- **Search** (across name/team columns) + **team filter dropdown**
- **Auto-refresh** every 60 seconds
- **Refresh Data button** — POSTs to `/api/refresh` to re-run pipeline
- **Status bar** — Live indicator, file sizes, last updated time

**Theme:** Dark navy `#0c0f1a`, gold `#f59e0b`, cyan `#06b6d4` — glassmorphism cards, Tailwind CSS, Material Symbols icons

**Run:** `cd web && python app.py` → `http://localhost:8000`

### Scheduled task details
- **Task Name:** KSCA_DailyUpdate
- **Trigger:** Daily at 21:30
- **Command:** `python auto_update.py --today --no-open`
- **Last run:** 22 Jun 2026 21:30 — Success (exit 0)
- **Note:** 23 Jun 2026 21:30 had timeout on keeper upload; manual re-run at 21:37 succeeded

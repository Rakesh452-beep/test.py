# config.py
import os

ROOT = os.path.dirname(os.path.abspath(__file__))


def _load_dotenv(path):
    """Minimal .env loader (no third-party dependency)."""
    if not os.path.exists(path):
        return
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip())


_load_dotenv(os.path.join(ROOT, ".env"))

STATS_BASE = "https://d27i8b90nps4in.cloudfront.net/feed/stats/"
FEED_BASE = "https://d27i8b90nps4in.cloudfront.net/feed/"

GOOGLE_SHEET_ID = "1QFXWrSd1eUw1KgG-uKBNXq2GPvt4W-0ONUubPOk2BwA"
SERVICE_ACCOUNT_FILE = os.environ.get(
    "SERVICE_ACCOUNT_FILE", os.path.join(ROOT, "service-account.json")
)

DATA_SOURCE = "google"

# Target competition (306 = KSCA U-19 Inter Club Tournament 2026)
COMPETITION_ID = "306"

CALLBACKS = {
    "competition": "oncomptetion",
    "teamlist": "onteamlist",
    "playerstats": "onplayerstats",
    "playerinnings": "onplayerinninswisestats",
    "matchschedule": "MatchSchedule",
    "matchsummary": "onScoringMatchsummary",
    "innings": "onScoring",
}

# Column names in the target Google Sheet (header row)
SHEET_COLUMNS = [
    "Club Name", "Date", "Vs Team", "Name of Keeper",
    "Score", "Balls Faced", "Out/Not out", "Catches",
    "Stumps", "Captain Yes\\No", "Match Summary"
]

# Sheet tab name where keeper data goes
SHEET_TAB = "Sheet1"

# Email config for daily report (secrets come from .env / environment)
EMAIL_ENABLED = os.environ.get("EMAIL_ENABLED", "false").lower() == "true"
EMAIL_SENDER = os.environ.get("EMAIL_SENDER", "")
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD", "")
EMAIL_RECIPIENT = os.environ.get("EMAIL_RECIPIENT", "Sureshkutam@gmail.com")

# MongoDB (Atlas) config (secret URI comes from .env / environment)
MONGO_URI = os.environ.get("MONGO_URI", "")
MONGO_DB_NAME = os.environ.get("MONGO_DB_NAME", "ksca_cricket")
MONGO_COLLECTIONS = {
    "batting": "player_batting",
    "bowling": "player_bowling",
    "keeper": "keeper_stats",
}

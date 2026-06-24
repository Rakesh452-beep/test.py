# config.py
import os

STATS_BASE = "https://d27i8b90nps4in.cloudfront.net/feed/stats/"
FEED_BASE = "https://d27i8b90nps4in.cloudfront.net/feed/"

GOOGLE_SHEET_ID = "1QFXWrSd1eUw1KgG-uKBNXq2GPvt4W-0ONUubPOk2BwA"
SERVICE_ACCOUNT_FILE = os.path.join(os.path.dirname(__file__), "service-account.json")

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

# Email config for daily report
EMAIL_SENDER = "rakeshkumarirri28@gmail.com"
EMAIL_PASSWORD = "tatn bbmq cwoq noty"
EMAIL_RECIPIENT = "Sureshkutam@gmail.com"
import os
import sqlite3
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "processed_matches.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS processed_matches (
            match_id TEXT PRIMARY KEY,
            competition_id TEXT NOT NULL,
            processed_at TEXT NOT NULL
        )
    """)
    conn.commit()
    return conn


def is_processed(match_id, competition_id=None):
    conn = get_connection()
    try:
        if competition_id:
            cur = conn.execute(
                "SELECT 1 FROM processed_matches WHERE match_id = ? AND competition_id = ?",
                (str(match_id), str(competition_id))
            )
        else:
            cur = conn.execute(
                "SELECT 1 FROM processed_matches WHERE match_id = ?",
                (str(match_id),)
            )
        return cur.fetchone() is not None
    finally:
        conn.close()


def mark_processed(match_id, competition_id):
    conn = get_connection()
    try:
        conn.execute(
            "INSERT OR REPLACE INTO processed_matches (match_id, competition_id, processed_at) VALUES (?, ?, ?)",
            (str(match_id), str(competition_id), datetime.now().isoformat())
        )
        conn.commit()
    finally:
        conn.close()


def get_processed_count(competition_id=None):
    conn = get_connection()
    try:
        if competition_id:
            cur = conn.execute(
                "SELECT COUNT(*) FROM processed_matches WHERE competition_id = ?",
                (str(competition_id),)
            )
        else:
            cur = conn.execute("SELECT COUNT(*) FROM processed_matches")
        return cur.fetchone()[0]
    finally:
        conn.close()

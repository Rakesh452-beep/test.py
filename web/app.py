import os
import sys
import json
import subprocess
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import pandas as pd
import uvicorn

BASE_DIR = Path(__file__).resolve().parent.parent
REPORTS_DIR = BASE_DIR / "reports"
STATIC_DIR = Path(__file__).resolve().parent / "static"

app = FastAPI(title="KSCA Cricket Stats Dashboard")
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


def read_sheet(filepath, sheet_name):
    if not os.path.exists(filepath):
        return []
    try:
        df = pd.read_excel(filepath, sheet_name=sheet_name, dtype=str)
        df = df.fillna("")
        return json.loads(df.to_json(orient="records"))
    except Exception:
        return []


def get_file_info(filepath):
    if not os.path.exists(filepath):
        return {"exists": False, "size_kb": 0, "mtime": None}
    stat = os.stat(filepath)
    return {
        "exists": True,
        "size_kb": round(stat.st_size / 1024, 1),
        "mtime": datetime.fromtimestamp(stat.st_mtime).isoformat(),
    }


@app.get("/api/stats/batting")
def api_batting():
    path = REPORTS_DIR / "AllTeams_Stats_latest.xlsx"
    return read_sheet(path, "Batting")


@app.get("/api/stats/bowling")
def api_bowling():
    path = REPORTS_DIR / "AllTeams_Stats_latest.xlsx"
    return read_sheet(path, "Bowling")


@app.get("/api/stats/all-players")
def api_all_players():
    path = REPORTS_DIR / "AllTeams_Stats_latest.xlsx"
    return read_sheet(path, "AllPlayers")


@app.get("/api/stats/keepers")
def api_keepers():
    path = REPORTS_DIR / "WicketKeepers_latest.xlsx"
    return read_sheet(path, "WicketKeepers")


@app.get("/api/stats/keeper-summary")
def api_keeper_summary():
    path = REPORTS_DIR / "WicketKeepers_latest.xlsx"
    return read_sheet(path, "Summary")


@app.get("/api/info")
def api_info():
    return {
        "stats_file": get_file_info(REPORTS_DIR / "AllTeams_Stats_latest.xlsx"),
        "keeper_file": get_file_info(REPORTS_DIR / "WicketKeepers_latest.xlsx"),
        "server_time": datetime.now().isoformat(),
    }


@app.post("/api/refresh")
def api_refresh():
    script = BASE_DIR / "auto_update.py"
    results = {}
    tasks = [
        ("stats", [sys.executable, str(script), "--stats-only", "--no-email", "--no-open"]),
        ("keeper", [sys.executable, str(script), "--keeper-only", "--today", "--no-email", "--no-open"]),
    ]
    for name, cmd in tasks:
        try:
            result = subprocess.run(
                cmd, capture_output=True, text=True, timeout=180,
                cwd=str(BASE_DIR),
            )
            results[name] = {
                "ok": result.returncode == 0,
                "stdout": result.stdout[-500:],
                "stderr": result.stderr[-500:],
            }
        except subprocess.TimeoutExpired:
            results[name] = {"ok": False, "error": "Timed out after 180s"}
        except Exception as e:
            results[name] = {"ok": False, "error": str(e)}
    return results


@app.get("/")
def serve_index():
    index = STATIC_DIR / "index.html"
    if index.exists():
        return HTMLResponse(index.read_text(encoding="utf-8"))
    return JSONResponse({"error": "not found"}, status_code=404)


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

from datetime import datetime

from config import MONGO_URI, MONGO_DB_NAME, MONGO_COLLECTIONS


def get_db():
    from pymongo import MongoClient
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client[MONGO_DB_NAME]
    client.admin.command("ping")
    return db


def _annotate(docs, competition_id):
    processed_at = datetime.now().isoformat()
    out = []
    for doc in docs:
        d = dict(doc)
        d["competition_id"] = str(competition_id)
        d["processed_at"] = processed_at
        out.append(d)
    return out


def store_player_stats(batting, bowling, competition_id):
    db = get_db()
    batting_coll = db[MONGO_COLLECTIONS["batting"]]
    bowling_coll = db[MONGO_COLLECTIONS["bowling"]]

    comp = str(competition_id)
    batting_coll.delete_many({"competition_id": comp})
    bowling_coll.delete_many({"competition_id": comp})

    bat_docs = _annotate(batting, comp)
    bowl_docs = _annotate(bowling, comp)

    if bat_docs:
        batting_coll.insert_many(bat_docs)
    if bowl_docs:
        bowling_coll.insert_many(bowl_docs)

    print(f"MongoDB: stored {len(bat_docs)} batting, {len(bowl_docs)} bowling docs for competition {comp}")


def store_keeper_rows(rows, competition_id):
    db = get_db()
    coll = db[MONGO_COLLECTIONS["keeper"]]

    comp = str(competition_id)
    upserted = 0
    for row in rows:
        match_id = row.get("_match_id", "")
        filter_doc = {
            "competition_id": comp,
            "_match_id": str(match_id),
            "club": row.get("club", ""),
            "keeper": row.get("keeper", ""),
            "date": row.get("date", ""),
        }
        doc = dict(row)
        doc["competition_id"] = comp
        doc["processed_at"] = datetime.now().isoformat()
        coll.replace_one(filter_doc, doc, upsert=True)
        upserted += 1

    print(f"MongoDB: upserted {upserted} keeper rows for competition {comp}")

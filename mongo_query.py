import json
import re
import sys

from config import MONGO_COLLECTIONS
from mongo_writer import get_db


def query_player(name_fragment):
    from bson.regex import Regex
    regex = Regex(re.escape(name_fragment), "i")
    db = get_db()
    batting = list(db[MONGO_COLLECTIONS["batting"]].find(
        {"PlayerName": regex}, {"_id": 0, "processed_at": 0}
    ))
    bowling = list(db[MONGO_COLLECTIONS["bowling"]].find(
        {"BowlerName": regex}, {"_id": 0, "processed_at": 0}
    ))
    print(f"=== {len(batting)} batting / {len(bowling)} bowling docs for '{name_fragment}' ===")
    for doc in batting:
        print(json.dumps(doc, indent=2, default=str))
    for doc in bowling:
        print(json.dumps(doc, indent=2, default=str))


if __name__ == "__main__":
    name = " ".join(sys.argv[1:]) or "Daivik"
    query_player(name)

def extract_team_ids(data):
    ids = []
    if isinstance(data, dict):
        for v in data.values():
            if isinstance(v, list) and v:
                for item in v:
                    if isinstance(item, dict):
                        tid = item.get("TeamID") or item.get("TeamId") or item.get("teamId") or item.get("teamid")
                        if tid:
                            ids.append(str(tid))
                if ids:
                    break
    if not ids and isinstance(data, dict):
        for k, v in data.items():
            if 'team' in k.lower() and isinstance(v, list):
                for item in v:
                    if isinstance(item, dict):
                        tid = item.get("TeamID") or item.get("TeamId") or item.get("teamId") or item.get("teamid")
                        if tid:
                            ids.append(str(tid))
                if ids:
                    break
    return ids

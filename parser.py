# parser.py

import json

def parse_jsonp(text, callback):
    prefix = callback + "("

    if text.startswith(prefix) and text.endswith(");"):
        text = text[len(prefix):-2]
    elif text.startswith(prefix) and text.endswith(")"):
        text = text[len(prefix):-1]
    else:
        text = text.replace(prefix, "")
        if text.endswith(");"):
            text = text[:-2]
        elif text.endswith(")"):
            text = text[:-1]

    return json.loads(text)
# downloader.py

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import time

REQUEST_TIMEOUT = 30
MAX_RETRIES = 3
RETRY_BACKOFF = 2

_session = requests.Session()
retry_strategy = Retry(
    total=MAX_RETRIES,
    backoff_factor=RETRY_BACKOFF,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["GET"],
)
adapter = HTTPAdapter(max_retries=retry_strategy)
_session.mount("https://", adapter)
_session.mount("http://", adapter)


def download(url, retries=MAX_RETRIES):
    print(f"Downloading: {url}")
    for attempt in range(retries + 1):
        try:
            response = _session.get(url, timeout=REQUEST_TIMEOUT)
            if response.status_code != 200:
                raise Exception(f"Error {response.status_code}")
            return response.text
        except (requests.exceptions.Timeout,
                requests.exceptions.ConnectionError,
                requests.exceptions.SSLError) as e:
            if attempt < retries:
                wait = RETRY_BACKOFF * (2 ** attempt)
                print(f"  Attempt {attempt+1} failed: {e}. Retrying in {wait}s...")
                time.sleep(wait)
            else:
                raise
        except Exception:
            raise
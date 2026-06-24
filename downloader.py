# downloader.py

import requests

REQUEST_TIMEOUT = 15

def download(url):
    print(f"Downloading: {url}")

    response = requests.get(url, timeout=REQUEST_TIMEOUT)

    if response.status_code != 200:
        raise Exception(f"Error {response.status_code}")

    return response.text
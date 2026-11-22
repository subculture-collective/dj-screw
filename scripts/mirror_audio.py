"""Mirror the original audio files of the dj-screw-discography collection.

Writes <root>/<identifier>/<file name> and verifies each file against the
MD5 and size that Internet Archive publishes. Files already present with the
right size and MD5 are skipped, so the script can be stopped and rerun.
Progress goes to stdout; failures are listed at the end and retried on the
next run.
"""
import hashlib
import json
import os
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

COLLECTION = "dj-screw-discography"
AUDIO = (".mp3", ".flac", ".ogg", ".wav", ".m4a")
UA = {"User-Agent": "woodroom-audio-mirror/1.0"}
root = os.path.abspath(sys.argv[1])
workers = int(sys.argv[2]) if len(sys.argv) > 2 else 3


def get(url, attempts=5):
    for attempt in range(1, attempts + 1):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120)
        except Exception:
            if attempt == attempts:
                raise
            time.sleep(10 * attempt)


def md5(path):
    digest = hashlib.md5()
    with open(path, "rb") as handle:
        for block in iter(lambda: handle.read(1 << 20), b""):
            digest.update(block)
    return digest.hexdigest()


def safe(name):
    parts = name.split("/")
    return name and "\\" not in name and all(p not in ("", ".", "..") for p in parts)


def fetch(job):
    ident, entry = job
    target = os.path.join(root, ident, entry["name"])
    size = int(entry["size"])
    if os.path.exists(target) and os.path.getsize(target) == size and md5(target) == entry["md5"]:
        return "skip", size
    os.makedirs(os.path.dirname(target), exist_ok=True)
    part = target + ".part"
    url = "https://archive.org/download/{}/{}".format(
        urllib.parse.quote(ident), urllib.parse.quote(entry["name"]))
    for attempt in range(1, 4):
        try:
            with get(url) as response, open(part, "wb") as out:
                for block in iter(lambda: response.read(1 << 20), b""):
                    out.write(block)
            if os.path.getsize(part) == size and md5(part) == entry["md5"]:
                os.replace(part, target)
                return "ok", size
        except Exception as error:
            last = error
        time.sleep(15 * attempt)
    if os.path.exists(part):
        os.remove(part)
    return "fail:{}/{}".format(ident, entry["name"]), 0


search = json.load(get(
    "https://archive.org/advancedsearch.php?q=collection%3A{}&fl%5B%5D=identifier&rows=10000&output=json".format(COLLECTION)))
ids = sorted(doc["identifier"] for doc in search["response"]["docs"])
jobs = []
for ident in ids:
    files = json.load(get("https://archive.org/metadata/{}/files".format(urllib.parse.quote(ident))))["result"]
    for entry in files:
        name = entry.get("name", "")
        if (entry.get("source") == "original" and name.lower().endswith(AUDIO) and safe(name)
                and str(entry.get("private", "false")) == "false" and entry.get("md5")):
            jobs.append((ident, entry))
total = sum(int(e["size"]) for _, e in jobs)
print("{} items, {} files, {:.1f} GB".format(len(ids), len(jobs), total / 1e9), flush=True)

done = 0
failed = []
with ThreadPoolExecutor(workers) as pool:
    for n, (status, size) in enumerate(pool.map(fetch, jobs), 1):
        done += size
        if status.startswith("fail"):
            failed.append(status[5:])
        if n % 50 == 0 or n == len(jobs):
            print("{}/{} files, {:.1f}/{:.1f} GB, {} failed".format(
                n, len(jobs), done / 1e9, total / 1e9, len(failed)), flush=True)
print("done; failed:", len(failed), flush=True)
for name in failed:
    print("FAILED", name, flush=True)

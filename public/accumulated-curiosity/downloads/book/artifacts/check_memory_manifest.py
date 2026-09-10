#!/usr/bin/env python3
"""Read-only comparison of a local, synthetic package with its manifest.

Requires Python 3.8+ and the standard library. No network, writes, or APIs.
Exit 0: listed bytes match; 1: missing/different file; 2: invalid input.
This is not a truth, approval, completeness, or hostile-workspace audit.
"""

import hashlib
import json
from pathlib import Path
import re
import stat
import sys


MAX_MANIFEST_BYTES = 1_048_576
MAX_FILE_BYTES = 10_485_760
MAX_FILES = 1000


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("duplicate JSON key")
        result[key] = value
    return result


def load_manifest(manifest):
    if manifest.is_symlink() or not manifest.is_file():
        raise ValueError("manifest must be an ordinary file, not a symlink")
    with manifest.open("rb") as handle:
        raw = handle.read(MAX_MANIFEST_BYTES + 1)
    if len(raw) > MAX_MANIFEST_BYTES:
        raise ValueError("manifest exceeds the demonstration size limit")
    data = json.loads(raw.decode("utf-8"), object_pairs_hook=unique_object)
    if not isinstance(data, dict) or set(data) != {"version", "files"}:
        raise ValueError("manifest needs only version and files")
    if type(data["version"]) is not int or data["version"] != 1:
        raise ValueError("manifest version must be 1")
    entries = data["files"]
    if not isinstance(entries, list) or not 1 <= len(entries) <= MAX_FILES:
        raise ValueError("files must be a nonempty list within the size limit")
    seen = set()
    for entry in entries:
        if not isinstance(entry, dict) or set(entry) != {"path", "bytes", "sha256"}:
            raise ValueError("each entry needs path, bytes and sha256")
        name = entry["path"]
        if not isinstance(name, str) or not re.fullmatch(r"[A-Za-z0-9_.\-/]+", name):
            raise ValueError("paths must use simple relative file names")
        if any(part in {"", ".", ".."} for part in name.split("/")):
            raise ValueError("absolute, empty and traversing paths are forbidden")
        if name in seen:
            raise ValueError("duplicate file path")
        seen.add(name)
        size = entry["bytes"]
        if type(size) is not int or not 0 <= size <= MAX_FILE_BYTES:
            raise ValueError("file size is outside the demonstration limit")
        digest = entry["sha256"]
        if not isinstance(digest, str) or not re.fullmatch(r"[0-9a-f]{64}", digest):
            raise ValueError("sha256 must contain 64 lowercase hexadecimal digits")
    return entries


def checked_path(root, name):
    path = root
    for part in name.split("/"):
        path = path / part
        if path.is_symlink():
            raise ValueError("symlink in listed path")
    try:
        path.resolve().relative_to(root)
    except ValueError:
        raise ValueError("listed path leaves the package") from None
    return path


def main(argv):
    if len(argv) != 1:
        print("Usage: python3 check_memory_manifest.py PATH/manifest.json", file=sys.stderr)
        return 2
    manifest = Path(argv[0])
    try:
        entries = load_manifest(manifest)
        root = manifest.resolve().parent
        paths = [checked_path(root, entry["path"]) for entry in entries]
        failures = 0
        for entry, path in zip(entries, paths):
            name = entry["path"]
            try:
                details = path.stat()
            except FileNotFoundError:
                print("MISSING " + name)
                failures += 1
                continue
            if not stat.S_ISREG(details.st_mode):
                raise ValueError("listed path is not an ordinary file")
            if details.st_size > MAX_FILE_BYTES:
                raise ValueError("listed file exceeds the demonstration size limit")
            digest = hashlib.sha256()
            total = 0
            with path.open("rb") as handle:
                while True:
                    chunk = handle.read(65_536)
                    if not chunk:
                        break
                    total += len(chunk)
                    if total > MAX_FILE_BYTES:
                        raise ValueError("listed file exceeds the demonstration size limit")
                    digest.update(chunk)
            if total == entry["bytes"] and digest.hexdigest() == entry["sha256"]:
                print("MATCH " + name)
            else:
                print("DIFFERENT " + name)
                failures += 1
        if failures:
            print("FAIL: {} of {} listed files are missing or different.".format(failures, len(entries)))
            return 1
        print("PASS: {} listed files match the supplied manifest.".format(len(entries)))
        print("Truth, approval and completeness were not evaluated.")
        return 0
    except (OSError, ValueError, UnicodeError, RecursionError):
        print("INVALID: check the manifest format, relative paths, file types and size limits.", file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

# Optional memory-manifest check

This read-only demonstration checks whether the files listed in a small package match a supplied manifest. It compares relative file paths, byte counts, and SHA-256 fingerprints. It does not judge truth, approval, relevance, completeness, or whether the package is the latest version.

The main Chapter 10 exercise requires no code. Use the no-code procedure below if you prefer. A successful restoration still requires opening the records, following their evidence, checking authority and scope, and attempting the task.

## Get the complete demonstration

[Download the demonstration bundle](10-memory-manifest-demo.zip). Extract it into a new folder. It contains the [Python script](check_memory_manifest.py), this guide, and three miniature synthetic packages under `memory-manifest-fixtures`.

The package names are `complete`, `changed`, and `missing`. Each manifest expects five files: a current-instruction pointer, instructions, rationale, synthetic input, and a restore note. These packages are deliberately small teaching fixtures. They are not a backup of Maya's whole project or an installation of SovMem.

The `changed` package deliberately alters an instruction. The `missing` package deliberately omits the input. Their manifests still describe the expected complete package, so the check can reveal the differences.

## Prerequisites and safe defaults

You need Python 3.8 or later, available locally as `python3`, and an ordinary terminal. No additional Python packages, account, API key, paid service, or network connection is needed after downloading the files. If your computer uses a different Python command, substitute that command.

The program does not write, repair, delete, upload, or execute the listed files. It reports their simple relative names without printing their contents. It rejects absolute paths, path traversal, symlinks, duplicate entries, malformed manifests, and oversized demonstration inputs. It accepts simple letters, digits, underscores, periods, hyphens, and slashes in listed paths.

This is a local teaching tool for a stable folder you control. It is not hardened against a hostile process changing paths while the check runs. Do not treat its output as a security certification.

## Run the complete package

Open a terminal in the extracted folder containing `check_memory_manifest.py`. Run:

```sh
python3 check_memory_manifest.py memory-manifest-fixtures/complete/manifest.json
```

Expected output:

```text
MATCH project/learning-loop-v1.md
MATCH project/instructions-v2.md
MATCH project/rationale.md
MATCH project/input.md
MATCH restore-note.md
PASS: 5 listed files match the supplied manifest.
Truth, approval and completeness were not evaluated.
```

An exit code is the number a program returns to describe how it finished. This successful comparison returns `0`.

## Run the deliberately changed package

```sh
python3 check_memory_manifest.py memory-manifest-fixtures/changed/manifest.json
```

Expected output:

```text
MATCH project/learning-loop-v1.md
DIFFERENT project/instructions-v2.md
MATCH project/rationale.md
MATCH project/input.md
MATCH restore-note.md
FAIL: 1 of 5 listed files are missing or different.
```

This returns `1`, as intended. Open the changed instruction beside the complete package's instruction to inspect the difference. Do not “repair” it by changing the manifest merely to make the check pass. First establish which content you actually intend to retain.

## Run the deliberately incomplete package

```sh
python3 check_memory_manifest.py memory-manifest-fixtures/missing/manifest.json
```

Expected output:

```text
MATCH project/learning-loop-v1.md
MATCH project/instructions-v2.md
MATCH project/rationale.md
MISSING project/input.md
MATCH restore-note.md
FAIL: 1 of 5 listed files are missing or different.
```

This also returns `1`, as intended. The missing dependency prevents the package from supplying the input named by the rationale. The checker reports it but does not restore it.

An invalid manifest, unsafe path, inaccessible file, or exceeded demonstration limit returns `2` and an error message. Review the manifest format and local files. The limits are 1 MiB of manifest data, 1,000 listed files, and 10 MiB per listed file. They keep this demonstration bounded; the tool is not a general backup application.

## No-code equivalent

1. Open `memory-manifest-fixtures/complete/restore-note.md` in a text editor or Markdown reader. Follow its current-instruction link, then open the rationale and synthetic input.
2. Write a list of the five expected files. Locate them in each package without using the original complete package as a hidden dependency.
3. Compare the complete and changed instruction files. Identify the instruction that was replaced, and explain how its meaning changed.
4. In the missing package, identify the absent synthetic input. Explain why a readable rationale without its evidence is insufficient for this recovery task.
5. From the complete package, explain the applicable instruction and its reason. Try a fresh synthetic note that contains an unknown owner or imprecise deadline and inspect the output.

This manual procedure checks meaning and usability. It is not a byte-for-byte fingerprint comparison. For a small bundle, it is a useful first restoration check whether or not you run the program.

## What a match means

A match means the listed file's byte count and calculated fingerprint agree with the values in the supplied manifest. A file can match perfectly while containing a false claim or an obsolete instruction. Files omitted from the manifest are not checked. The program does not follow Markdown links or assess whether the listed set is sufficient for a task.

The manifest is itself ordinary editable data. If someone changes both it and the files consistently, this comparison can pass. It does not authenticate who created the package or protect the expected values from alteration.

Keep file consistency, record authority, semantic accuracy, and successful task reuse as separate results. Use your charter and human review to decide what belongs in the package. Use restoration to establish what can actually be recovered.

## Verification performed for this book

The script was run with Python 3.11.3 against all three supplied packages. The complete package returned `0`; the changed and missing packages returned `1` and identified the intended file. Separate synthetic checks for path traversal, an absolute path, a symlink, a duplicate JSON key, and incorrect invocation returned `2`. File fingerprints before and after the runs confirmed that the staged demonstration files were unchanged.

These results establish the stated checks in this local demonstration. They do not establish every possible failure mode or production suitability.

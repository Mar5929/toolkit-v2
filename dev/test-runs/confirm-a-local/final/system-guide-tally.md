# Tally

## What this area does today

On 2026-09-28, the local `main` branch runs a Node.js command that counts words in a named UTF-8 text file, or lines when `--lines` is given.

## Components and paths

| Component | Role | Location or reference | Evidence |
| --- | --- | --- | --- |
| Command | Parses arguments, reads the file, counts, and prints the result or error | `bin/tally.js` | Code on local `main`, checked 2026-09-28 |
| Automated checks | Tests counting and error behavior | `tests/tally.test.js` | Nine checks passed after the WI-002 branch included main |
| Test plans | Record acceptance checks for each item | `tests/WI-001-TEST-PLAN.md`, `tests/WI-002-TEST-PLAN.md` | Files on local `main` |

## Data and flow

The command accepts an optional `--lines` flag followed by one file path. It reads the file as UTF-8 text. Word mode splits on spaces and line breaks. Line mode counts LF, CRLF, and CR breaks and includes a final nonempty line. It prints the count to standard output.

## Operational behavior

The command runs locally under Node.js and uses only built-in modules. Missing or invalid arguments print usage on standard error and exit nonzero. A file read failure prints an error on standard error and exits nonzero.

## Known gaps and uncertainty

Node 22 compatibility was not established by the recorded automated checks. Mike reported that his tally machine is a Mac mini running Node 22; he ran and approved the stated word and line examples there.

## Last verified

- Date and environment: 2026-09-28, local `main` branch and WI-002 worktree.
- Sources: `bin/tally.js`, `tests/tally.test.js`, WI-001 and WI-002 result approvals.
- Maintainer: Project owner Mike.

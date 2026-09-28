# Tip command

## What this area does today

On 2026-09-28, the local terminal command prints a rounded tip and total for a bill. With `--split`, it also prints a rounded-up per-person amount.

## Components and paths

| Component | Role | Location or reference | Evidence |
| --- | --- | --- | --- |
| Command | Parses input and calculates output | `bin/tipcalc.js` | Inspected at `a6d571c` |
| Checks | Runs command cases through Node | `tests/tipcalc.test.js` | `node --test`: 9 passed |
| Test plans | Records acceptance cases | `tests/WI-001-TEST-PLAN.md`, `tests/WI-002-TEST-PLAN.md` | Checked at `a6d571c` |

## Data and flow

The command reads the bill, `--percent`, and optional `--split` from its arguments. It validates them, calculates amounts in cents, and writes the result to standard output. Invalid input writes a corrective error and exits with code 1. It stores no bill data.

## Operational behavior

Run it with Node.js from the project checkout. No service, account, schedule, or deployment is involved.

## Known gaps and uncertainty

None identified in the checked command behavior.

## Last verified

- Date and environment: 2026-09-28, local checkout on `main`.
- Sources: `bin/tipcalc.js` and `node --test` at `a6d571c`.
- Maintainer: Project owner, Mike Rihm.

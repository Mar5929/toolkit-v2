# Project roadmap

## Project outcome

tipcalc tells me the tip and the total for a restaurant bill, and can split the total between friends, straight from my terminal.

## Phase overview

| Phase | Intended outcome | Exit condition | Depends on |
| --- | --- | --- | --- |
| P01 — Tip command | Show tip, total, and optional per-person amount in the terminal. | Owner accepted the command and all nine Node tests passed. | None. |

## P01 — Tip command

**Outcome:** The command calculates a tip, total, and optional split amount.

**Exit condition:** Owner approval and passing command checks, met on 2026-09-28.

**Dependencies:** None.

### P01-U01 — Tip and total

**Deliverable:** A command that prints the rounded tip and total.

**Done when:** WI-001 R-01 and the plain input cases of R-03 pass. Met on 2026-09-28.

**Depends on:** None.

**Linked work item:** WI-001.

### P01-U02 — Split option

**Deliverable:** The command prints a per-person amount when `--split` is supplied.

**Done when:** WI-001 R-02 and split input cases of R-03 pass. Met on 2026-09-28.

**Depends on:** P01-U01.

**Linked work item:** WI-002.

## Open project-level planning questions

None open.

## Planning changes

- 2026-09-28: WI-002 was created as the split option sub-item of WI-001 so the plain command could be built and checked first.

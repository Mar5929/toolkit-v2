---
id: WI-002
title: Add a --max option to cap slug length
type: build
stage: 14-spec-update
status: Done
parent: WI-001
waiting_on: "none"
priority: medium
delivery: owner-led
requirements_approved: "2026-09-28 by Mike Rihm"
design: none
result_approved: "2026-09-28 by Mike Rihm"
updated: 2026-09-28
---

# WI-002: Add a --max option to cap slug length

## Overview

**Goal:** The slug command accepts an option such as `--max 20` that limits the slug's length, cutting at a dash.

**Current position:** Done on 2026-09-28. Merged locally into main at 2ef81c2; node --test 24 pass, 0 fail; owner ran --max and approved the result on 2026-09-28; requirements baseline at b47419c.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-001. This merge also brought WI-001 commits to main; WI-001 is finished separately.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — `--max` option | `node slug.js --max <n>` limits the slug length by R-01 to R-04 | Done | Every acceptance check in R-01 to R-04 passes as an automated test, and every WI-001 test still passes (24 pass at 2ef81c2; owner approved 2026-09-28) | None. |

## Tasks

### P1 — `--max` option

- [x] **P1-T01 — Add `--max` to the slug command, with tests** · Done  
  **Work:** Read `--max <n>` and `--max=<n>` anywhere among the arguments, last one wins (R-01); reject values that are not digits-only above 0 (R-03); keep the usage error for an empty title and let the `--max` error win (R-04); cut the slug to whole words within the limit (R-02). Add a test for every acceptance check in R-01 to R-04.  
  **Deliverable:** Updated `slug.js` and `test/slug.test.js`, committed on the item's branch (commit 2ef81c2).  
  **Done when:** `node --test` passes every new test and every WI-001 test. Evidence: `node --test test/slug.test.js` reported 24 pass, 0 fail (13 WI-001 tests, 11 new) on 2026-09-28.  
  **Depends on:** None.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Merged locally into main at 2ef81c2; node --test 24 pass, 0 fail; owner ran --max and approved the result on 2026-09-28; requirements baseline at b47419c. |
| 2026-09-28 | Requirements baseline saved: requirements/slug-command/SLUG-COMMAND.md (SLUG-05 to SLUG-07 hold WI-002 R-01 to R-04) and system-guide/slug-command.md, commit b47419c on main. The files also hold WI-001 R-01 to R-05, delivered on main by this merge. | Stage 14 done; ready for Done. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | Stage 13 Deployment skipped: slug is run from the checkout; nothing is deployed beyond main. | Continue with the requirements baseline (stage 14). |
| 2026-09-28 | No remote: merged locally into main (fast-forward to 2ef81c2). The branch started from WI-001 branch, so WI-001 commits af288b5, e204afb, 16e745a reached main too. | No pull request; no deployment. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: I tried --max, it works. WI-002's result is approved. Ship it: merging locally into main is fine, you have my OK. | Result approved; work-finish continues. Owner approved a local merge into main. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked: R-01 to R-04 and Acceptance 1-2 against commit 2ef81c2; evidence: node --test test/slug.test.js 24 pass 0 fail, independent acceptance-checker verdict met for every requirement, each acceptance command run by hand; gaps: Acceptance 3 (owner tries it) not yet done. | Result approval asked. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 03 Requirements approved -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-28 | No separate design: one clear way to build (extend the argument reading in slug.js and add a cut step after the slug is made, tested with the built-in node:test runner). Branch starts from WI-001 branch, since WI-001 is not merged yet. | Planning from the requirements (stage 06). |
| 2026-09-28 | Requirements approved by Mike Rihm. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-28 | Owner said: "Yes, approved. Build it." | Requirements approved; owner asked to build. |
| 2026-09-28 | Owner said: "All yes, except 5: last one wins." | Q-05 answered: spec check fixes 1-4 and 6-9 accepted; --max given twice: the last one wins. R-01 to R-03 rewritten, R-04 added. |
| 2026-09-28 | Spec check (requirements-analyst): not ready, 10 findings. 9 go to the owner as one numbered list (Q-05); the finding about adding the behavior to requirements/ is already covered by stage 14-spec-update. | Waiting on the owner to answer Q-05 before the requirements approval question. |
| 2026-09-28 | Owner said: "Yes, treat it as an error." | Q-03 answered: a missing, zero, or non-number --max value is an error. Recorded as R-03. |
| 2026-09-28 | Owner said: "Q-04: no, the docs page is not part of this." | Q-04 answered: the docs usage page is not part of WI-002 acceptance. |
| 2026-09-28 | Owner said: "Q-02: yes, cut that word at exactly the limit." | Q-02 answered; R-02 written (Refining). Interview continues with Q-03. |
| 2026-09-28 | Owner said: "Yes, that's the goal. Also, by the way: slug's docs site is at https://docs.example.com/slug, and its usage page is where people read about the options." | Agreed goal saved. Q-04 added: whether the docs usage page must cover --max. Interview continues with Q-02. |
| 2026-09-28 | Owner said: "Q-01: yes, --max is the one exception to R-04. For what it's worth, our CI runs slug on Node 22, and nobody uses Node 18 anymore." | Q-01 answered; R-01 written (Refining). Node 22 noted as design context. Requirements interview continues. |
| 2026-09-28 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-28 | Folder renamed by hand: .work-items/WI-001-build-the-slug-command/WI-002-add-a-max-option-to-cap-slug-length/WORK-ITEM.md -> .work-items/WI-001-build-the-slug-command/WI-002-max-length/WORK-ITEM.md. | Same item; the toolkit uses the new path. |
| 2026-09-28 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | WI-001's approved R-04 says any argument starting with `-` (other than `--help` and `-h`) is title text. `--max` needs an exception to that. Is that acceptable, and should WI-002 add it as its own requirement? | R-04 of WI-001, WI-002 R-01 | Answered 2026-09-28 by the owner: yes, `--max` is the one exception to R-04. Recorded as WI-002 R-01; WI-001 R-04 is unchanged. | owner |
| Q-02 | What happens when the first word alone is longer than the limit (no dash to cut at)? | WI-002 R-02 | Answered 2026-09-28 by the owner: cut that word at exactly the limit. Recorded in R-02. | owner |
| Q-03 | What happens when the `--max` value is missing, zero, or not a number? | WI-002 requirements | Answered 2026-09-28 by the owner: treat it as an error. Recorded as R-03. | owner |
| Q-04 | The usage page of the slug docs site is where people read about the options. Must that page describe `--max` before WI-002 can be accepted? | WI-002 Acceptance | Answered 2026-09-28 by the owner: no, the docs page is not part of WI-002. | owner |
| Q-05 | Spec check findings 1-9 (2026-09-28): R-02 cut wording; --max=20 form; digits-only value; no title with --max; --max twice; --help with --max; --max in the middle of the title; usage and help do not mention --max; R-01 and R-02 boundary wording. Accept the agent fixes? | R-01, R-02, R-03 | Answered 2026-09-28 by the owner: all fixes accepted, except item 5: when `--max` is given twice, the last one wins. Recorded in R-01 to R-03 and new R-04. | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

"I also want a way to cap the slug length, like --max 20, cutting at a dash. Split that into its own sub-item under WI-001. Don't change WI-001's approved requirements." (Owner, 2026-09-28)

### Agreed goal

Anyone running the slug command can add `--max <number>`, and the slug is then at most that many characters long, cut at a dash so no word is split. (Confirmed by the owner, 2026-09-28.)

### Active requirements

#### R-01 — `--max` is the one option besides help

**Status:** Finalized  
**Applies to:** Running the slug command with `--max` among its arguments.  
**Required behavior:** `--max` followed by a separate value (`--max 20`) and `--max=` joined to its value (`--max=20`) both set the length limit and are never title text. They may appear anywhere among the arguments; the other words are joined in order as one title, by WI-001 R-04. When `--max` is given more than once, the last one is used and the earlier ones are ignored. `--max` is the only exception to WI-001 R-04: every other argument that starts with `-` is still title text, and `--help` and `-h` show help only when they are the only argument.  
**Boundaries and exceptions:** WI-001 R-04 itself is not changed. Any value R-03 rejects is handled by R-03. The usage and help messages of WI-001 do not mention `--max` (owner, 2026-09-28, Q-05 item 8).  
**Acceptance check:** `node slug.js --max 20 Hello World` prints `hello-world` (the words `--max` and `20` are not in the slug); `node slug.js --max=12 Hello World Again` prints `hello-world`; `node slug.js Hello --max 5 World` prints `hello`; `node slug.js --max 5 --max 20 Hello World` prints `hello-world`; `node slug.js --max 5 --help` prints `help`; `node slug.js -x` still prints `x`.  
**Decision record:** Owner, 2026-09-28, answer to Q-01: "yes, --max is the one exception to R-04." `--max=20` form, any position, help unchanged, and no mention in usage or help: spec check fixes accepted by the owner in Q-05 ("All yes, except 5: last one wins."). Last one wins: owner, Q-05 item 5. Was: "`--max` and the value that follows it are read as the length limit, never as title text." Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

#### R-02 — The slug is cut to the limit at a dash

**Status:** Finalized  
**Applies to:** Every run with a valid `--max` value, after the slug is made by WI-001's rules.  
**Required behavior:** The printed slug is at most the `--max` number of characters long. A slug already within the limit is printed unchanged. A longer slug is cut to the longest run of whole words, joined by dashes, that is at most the `--max` number of characters. When the first word alone is longer than the limit, so no whole word fits, that word is cut at exactly the limit.  
**Boundaries and exceptions:** Any value R-03 rejects is handled by R-03.  
**Acceptance check:** `node slug.js --max 20 Hello World` prints `hello-world`; `node slug.js --max 12 Hello World Again` prints `hello-world`; `node slug.js --max 11 Hello World Again` prints `hello-world`; `node slug.js --max 5 Internationalization` prints `inter`.  
**Decision record:** Owner, 2026-09-28: Agreed goal ("cut at a dash so no word is split"), and answer to Q-02: "yes, cut that word at exactly the limit." Cut wording from the spec check, accepted in Q-05. Was: "A longer slug is cut at the last dash that leaves it within the limit, and that dash is removed, so no word is split." Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

#### R-03 — A bad `--max` value is an error

**Status:** Finalized  
**Applies to:** Running the command with a `--max` value that is missing or is not a whole number greater than 0. A value is accepted only when it is made of the digits 0 to 9 alone and is greater than 0; anything else (for example nothing, `0`, `abc`, `-3`, `2.5`, `5abc`, `+5`, or `1e2`) is rejected.  
**Required behavior:** The command prints `Error: --max needs a whole number greater than 0` on standard error (the error output), prints nothing on standard output, and ends with a failure exit code (1).  
**Boundaries and exceptions:** When `--max` is given more than once, only the last value is checked (R-01).  
**Acceptance check:** `node slug.js Hello --max`, `node slug.js --max= Hello`, `node slug.js --max 0 Hello`, `node slug.js --max abc Hello`, `node slug.js --max -3 Hello`, `node slug.js --max 2.5 Hello`, `node slug.js --max 5abc Hello`, `node slug.js --max +5 Hello`, and `node slug.js --max 1e2 Hello` each print the error message on standard error, print nothing on standard output, and end with exit code 1.  
**Decision record:** Owner, 2026-09-28, answer to Q-03: "Yes, treat it as an error." (agent recommendation, with the error message shown to him). Digits-only rule from the spec check, accepted in Q-05. Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

#### R-04 — `--max` with no title

**Status:** Finalized  
**Applies to:** Running the command with `--max` and no title, an empty title, or a title with no letters or digits left after WI-001's rules.  
**Required behavior:** With a valid `--max` value, the command behaves as WI-001 R-03 says: the usage message on standard error, nothing on standard output, exit code 1. With a value R-03 rejects, the R-03 error message is printed instead of the usage message, also with exit code 1.  
**Boundaries and exceptions:** WI-001 R-03 is not changed.  
**Acceptance check:** `node slug.js --max 20` and `node slug.js --max 20 "!!!"` each print `Usage: node slug.js "<title>"` on standard error, nothing on standard output, and end with exit code 1; `node slug.js --max abc` prints `Error: --max needs a whole number greater than 0` on standard error, nothing on standard output, and ends with exit code 1.  
**Decision record:** Spec check finding, fix accepted by the owner on 2026-09-28 in Q-05. Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. `node slug.js --max 12 Hello World Again` prints `hello-world`, and every acceptance check in R-01 to R-04 passes.
2. Automated tests cover each acceptance check in R-01 to R-04 and pass, and every WI-001 acceptance check (its R-01 to R-05) still passes.
3. The owner has run the command with `--max` himself on at least one title and approved the result.

The slug docs usage page is not part of this item (owner, 2026-09-28, answer to Q-04).

## Notes

### Decisions and context

- Owner, 2026-09-28: CI runs slug on Node 22, and nobody uses Node 18 anymore. This is a build constraint for the design, not a requirement.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- **For R-01:** <Possible approach and the tradeoff or question it raises.>
- **For R-02:** <Another option, constraint, or design consideration to investigate.>

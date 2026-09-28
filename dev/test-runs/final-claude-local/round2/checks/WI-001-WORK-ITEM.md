---
id: WI-001
title: Build the slug command
type: build
stage: 14-spec-update
status: Done
parent: none
waiting_on: "none"
priority: medium
delivery: owner-led
requirements_approved: "2026-09-28 by Mike Rihm"
design: none
result_approved: "2026-09-28 by Mike Rihm"
updated: 2026-09-28
---

# WI-001: Build the slug command

## Overview

**Goal:** Running `node slug.js "<title>"` prints a clean URL slug for that title, by the approved requirements R-01 to R-05.

**Current position:** Done on 2026-09-28. On main since the local merge at 2ef81c2; node --test 24 pass, 0 fail; owner ran the command and approved the result on 2026-09-28; requirements baseline at b47419c.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Sub-item WI-002 (Done) delivered the --max option.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Slug command | `node slug.js` turns a title into a slug by R-01 to R-05 | Done | Every acceptance check in R-01 to R-05 passes as an automated test (13 pass at 16e745a; independent checker: all met) | None. |
| P2 — Slug length limit | A `--max` option limits slug length, cutting at a dash; new behavior with its own requirements, outside R-01 to R-05 | Done | WI-002 result approved by the owner (2026-09-28); WI-002 Done | WI-002 |

## Tasks

### P1 — Slug command

- [x] **P1-T01 — Write the slug command and its tests** · Done  
  **Work:** Write `slug.js` with the slug rules and command behavior (R-01 to R-05), and a test file that runs the command for every acceptance check in R-01 to R-05.  
  **Deliverable:** `slug.js`, `test/slug.test.js`, and `package.json` with an `npm test` script, committed on the item's branch (commit af288b5).  
  **Done when:** `npm test` passes every acceptance check. Evidence: `node --test` (the command the `npm test` script runs) reported 13 pass, 0 fail, on 2026-09-28. `npm test` itself was not run: it needed a permission approval.  
  **Depends on:** None.
- [x] **P1-T02 — Record the build and test commands** · Done  
  **Work:** Add the verified run and test commands to the Commands table in `AGENTS.md`.  
  **Deliverable:** The updated Commands rows, committed on the item's branch (commit e204afb).  
  **Done when:** The row names commands that were seen working. Evidence: `node slug.js "Hello World"` printed `hello-world`; `node --test` from the project root reported 13 pass.  
  **Depends on:** P1-T01.
- [x] **P1-T03 — Fix stroke letters that are deleted** · Done  
  **Work:** The acceptance check found that ħ, ŧ, ƀ, and ƶ are deleted instead of becoming plain letters ("Ħamrun" gives `amrun`), which breaks R-02 rule 4 ("Latin letters with accents or strokes become plain letters"). Add the remaining Latin stroke letters to the special-letter list and add a test.  
  **Deliverable:** Updated `slug.js` and `test/slug.test.js`, committed on the item's branch (commit 16e745a).  
  **Done when:** `node slug.js "Ħamrun Ŧ Ƀ Ƶ"` prints `hamrun-t-b-z` and `node --test` passes. Evidence: it printed `hamrun-t-b-z`; `node --test` reported 13 pass, 0 fail; the acceptance checker confirmed R-02 met at 16e745a.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: On main since the local merge at 2ef81c2; node --test 24 pass, 0 fail; owner ran the command and approved the result on 2026-09-28; requirements baseline at b47419c. |
| 2026-09-28 | Requirements baseline: requirements/slug-command/SLUG-COMMAND.md (SLUG-01 to SLUG-05 hold R-01 to R-05) and system-guide/slug-command.md, commit b47419c on main. | Stage 14 done; ready for Done. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | No remote: merged locally into main (with WI-002, fast-forward to 2ef81c2). Stage 13 Deployment skipped: nothing is deployed beyond main. | No pull request; no deployment. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Owner said: Yes, close WI-001 and remove both. | WI-001 closes; WI-001 and WI-002 worktrees and branches are removed. |
| 2026-09-28 | WI-001 commits af288b5, e204afb, 16e745a reached main on 2026-09-28 through the local merge of WI-002 (owner approved that merge). Requirements baseline for R-01 to R-05 saved in requirements/slug-command/SLUG-COMMAND.md (commit b47419c). WI-002 is Done. | No separate merge needed. Next: work-finish closes WI-001 after the owner confirms. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: "I tried it, it works. Yes, WI-001's result is approved, but keep WI-001 open until WI-002 is done." | Result approved. WI-001 stays open until WI-002 is done; then work-finish. |
| 2026-09-28 | Owner asked for a --max length option as its own sub-item (WI-002) and said: Don't change WI-001's approved requirements. R-01 to R-05 unchanged; result approval still pending. | Continue with work-decide. |
| 2026-09-28 | Sub-item WI-002 created: Add a --max option to cap slug length. | WI-002 is part of this item. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked: R-01 to R-05 and Acceptance 1-2 against commit 16e745a; evidence: node --test 13 pass 0 fail, independent acceptance-checker verdict met for every requirement (first run at e204afb found R-02 stroke-letter gap, fixed in 16e745a); gaps: Acceptance 3 (owner tries it) not yet done; npm test not run (needed approval), node --test is the command it runs. | Result approval asked. |
| 2026-09-28 | Set stage 10 Bug fixing -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 09 Testing -> 10 Bug fixing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 03 Requirements approved -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-28 | No separate design: one clear way to build (a single dependency-free Node script plus built-in node:test tests). Owner said to go with the agent's recommendations; he can say design first to stop this. | Planning from the requirements (stage 06). |
| 2026-09-28 | Set delivery owner-led. | Small item: one or two tasks, so no delivery offer. |
| 2026-09-28 | Requirements approved by Mike Rihm. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-28 | Owner said: "Yes, the requirements are approved." | Requirements approved. |
| 2026-09-28 | Spec check (requirements-analyst): 3 findings, all fixed under the owner's go-with-recommendations instruction: R-02 rule 4 letter list, R-03 usage on standard error, R-04 --help and -h print usage with exit 0. | Requirements ready for owner approval. |
| 2026-09-28 | Owner said: "Yes. For anything else, go with your recommendations." Saved R-03 (empty input is an error), R-04 (unquoted words joined), R-05 (allowed characters), and the Acceptance list. | Next: spec check, then ask for requirements approval. |
| 2026-09-28 | Owner confirmed the goal and the four slug rules; saved Agreed goal, R-01, R-02. Next: ask what happens with no title or an empty title. | Continue with work-requirements. |
| 2026-09-28 | Requirements interview started. Next: owner confirms the goal sentence, then questions on input rules (special characters, accents, empty input). | Continue with work-requirements. |
| 2026-09-28 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-28 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

New work: build the slug command. `node slug.js "Hello World"` should print `hello-world`. Track it as a work item and do it properly.

### Agreed goal

Running `node slug.js "<title>"` from the command line prints a clean URL slug for that title, for example "Hello World" prints `hello-world`.

### Active requirements

#### R-01 — The command prints the slug of the title it is given

**Status:** Finalized  
**Applies to:** Anyone who runs `node slug.js "<title>"` from the command line.  
**Required behavior:** The command prints the slug of the title, made by the rules in R-02 and R-05, on one line on standard output, and ends with a success exit code (0).  
**Boundaries and exceptions:** No title, an empty title, or a title with nothing left after the rules is covered by R-03. Several words given without quotes, and `--help`, are covered by R-04.  
**Acceptance check:** Run `node slug.js "Hello World"`; it prints `hello-world` and the exit code is 0.  
**Decision record:** Owner, 2026-09-28, starting request and goal confirmation. Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

#### R-02 — Slug rules

**Status:** Finalized  
**Applies to:** Every title the command turns into a slug.  
**Required behavior:** (1) All letters become lowercase. (2) Spaces and punctuation become dashes, and a run of several becomes a single dash. (3) Dashes at the start and end are removed. (4) Latin letters with accents or strokes become plain letters: é becomes e, ø becomes o, ł becomes l, đ becomes d, ß becomes ss, æ becomes ae, œ becomes oe. So "Café" becomes `cafe`.  
**Boundaries and exceptions:** Apostrophes are the one exception to rule 2, and letters from other alphabets follow R-05.  
**Acceptance check:** `node slug.js "  Hello,  World!! "` prints `hello-world`; `node slug.js "Café Déjà Vu"` prints `cafe-deja-vu`; `node slug.js "Straße Søren"` prints `strasse-soren`.  
**Decision record:** Owner, 2026-09-28, interview: confirmed all four rules. Rule 4 letter list added from the spec check, under the owner's instruction to go with the agent's recommendations. Was: "Accented letters become their plain letter". Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

#### R-03 — Nothing to turn into a slug is an error

**Status:** Finalized  
**Applies to:** Running the command with no title, with an empty title, or with a title that has no letters or digits left after the rules (for example "!!!").  
**Required behavior:** The command prints `Usage: node slug.js "<title>"` on standard error (the error output), prints nothing on standard output, and ends with a failure exit code (1).  
**Boundaries and exceptions:** None identified.  
**Acceptance check:** `node slug.js`, `node slug.js ""`, and `node slug.js "!!!"` each print the usage message on standard error, print nothing on standard output, and end with exit code 1.  
**Decision record:** Owner, 2026-09-28, interview: accepted the recommendation. Output channel made explicit from the spec check. Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

#### R-04 — Several words without quotes, and help

**Status:** Finalized  
**Applies to:** Running the command with more than one word and no quotes, for example `node slug.js Hello World`, or asking for help.  
**Required behavior:** The words are joined with spaces and treated as one title. When the only argument is `--help` or `-h`, the command prints the usage message from R-03 on standard output and ends with exit code 0. Any other argument that starts with `-` is title text like any other.  
**Boundaries and exceptions:** None identified.  
**Acceptance check:** `node slug.js Hello World` prints `hello-world`; `node slug.js --help` prints the usage message and ends with exit code 0; `node slug.js -x` prints `x`.  
**Decision record:** Agent recommendation, accepted in advance by the owner on 2026-09-28 ("For anything else, go with your recommendations"). Help rule added from the spec check on the same basis. Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

#### R-05 — Which characters stay in a slug

**Status:** Finalized  
**Applies to:** Every title the command turns into a slug.  
**Required behavior:** A slug holds only the letters a to z, the digits 0 to 9, and single dashes between them. Digits are kept. Apostrophes (straight ' and curly ’) are removed without leaving a dash, so "Don't Stop" becomes `dont-stop`. Every other character that is not a letter or digit after rule 4 of R-02 (for example underscores, emoji, or letters from non-Latin alphabets) is treated like punctuation.  
**Boundaries and exceptions:** A title made only of such characters falls under R-03.  
**Acceptance check:** `node slug.js "Don't Stop 2 Believe_Now"` prints `dont-stop-2-believe-now`; `node slug.js "It’s 🎉 Time"` prints `its-time`.  
**Decision record:** Agent recommendation, accepted in advance by the owner on 2026-09-28 ("For anything else, go with your recommendations"). Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. `node slug.js "Hello World"` prints `hello-world`, and every acceptance check in R-01 to R-05 passes.
2. Automated tests cover each acceptance check in R-01 to R-05 and pass.
3. The owner has run the command himself on at least one title and approved the result.

## Notes

### Decisions and context

- No separate design document: one clear way to build (a single Node.js script with no dependencies, tested with Node's built-in test runner). See Recent History, 2026-09-28.
- Delivery is owner-led: a small item, so no agent-led delivery offer.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- None.

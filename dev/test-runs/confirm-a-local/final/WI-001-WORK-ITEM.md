---
id: WI-001
title: Build tally word count CLI
type: build
stage: 14-spec-update
status: Done
parent: none
waiting_on: "none"
priority: medium
delivery: owner-led
requirements_approved: "2026-09-28 by Mike"
design: approved
result_approved: "2026-09-28 by Mike"
updated: 2026-09-28
---

# WI-001: Build tally word count CLI

## Overview

**Goal:** Mike can run tally on a text file to print its word count. WI-002 delivers the separate --lines mode.

**Current position:** Done on 2026-09-28. WI-001 word mode reached local main at d90612e; all nine combined node:test checks passed after both merges; Mike approved the observed 4 and 0 examples; WI-002 is Done; delivered requirements and system guide are on main at f86ba9c.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** WI-002 delivered R-02 and is Done.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Word count CLI | The default command prints a word count and reports input errors | Done | R-01 and argument/error checks passed in commit 561439e | None. |
| P2 — Line count flag | The command also prints a line count with --lines | Done | WI-002 passed all nine combined checks and Mike approved its result; delivered on main at ff3721a | WI-002 |

## Tasks

### P1 — Word count CLI

- [x] **P1-T01 — Build default word count** · Done  
  **Work:** Add bin/tally.js with the default word count and argument/file handling (R-01; Option A build order step 1).  
  **Deliverable:** The command for the default mode.  
  **Done when:** Sample, repeated separator, empty-file, and invalid input checks match the design.  
  **Depends on:** None.
- [x] **P1-T02 — Check word mode** · Done  
  **Work:** Add node:test checks for R-01 and the command errors (Option A build order step 3).  
  **Deliverable:** tests/tally.test.js covering the default mode.  
  **Done when:** node --test passes and a manual command prints the expected count.  
  **Depends on:** P1-T01.

### P2 — Line count flag

WI-002 owns the tasks for this phase and starts from the completed WI-001 word-count code.

Evidence: commit 561439e; node --test passed 5 checks; direct command printed 196 for tests/tally.test.js.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike); marked Done by Mike. | Evidence: WI-001 word mode reached local main at d90612e; all nine combined node:test checks passed after both merges; Mike approved the observed 4 and 0 examples; WI-002 is Done; delivered requirements and system guide are on main at f86ba9c. |
| 2026-09-28 | Delivered behavior recorded in requirements/tally/TALLY.md and system-guide/tally.md; project phase recorded in PROJECT-ROADMAP.md. No remote: documents committed locally on main at f86ba9c. | Specification update complete for WI-001. |
| 2026-09-28 | Set stage 12 Pull request and push -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-28 | No remote: merged locally into main. | WI-001 code and test plan reached main at d90612e; no pull request or deployment. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Owner words: Ship it: WI-001 and WI-002. There is no remote and I do not want a GitHub repo, so merge them into main locally. I approve that merge and the git commands Codex asks for to do it. Then mark both done and clean up their worktrees and branches. | Local merge, finish, and cleanup authorized for WI-001 and WI-002. |
| 2026-09-28 | Mike said: I ran it in the WI-001 worktree: a file with four words printed 4, and an empty file printed 0. I approve the WI-001 result. | Mike confirmed both word-count examples and approved the WI-001 result. Work-finish continues; merge still requires a separate decision. |
| 2026-09-28 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Mike said his only tally machine is a Mac mini running Node 22. | Use that machine and Node version when reviewing the word-count result; Node 22 compatibility is not established by the checks recorded so far. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked WI-001 R-01 at d90612e: five automated checks passed, direct command printed 196, and independent acceptance review found no defects. WI-002 R-02 is separately built and checked at 36cb2a2. No known gaps; owner review and merge not run. | Request Mike result approval for WI-001; merge remains separate. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | P1 word mode built and committed as 561439e; five node:test checks pass and a direct command printed its count. | WI-002 can start from the committed word mode; WI-001 proceeds to work-check after the child build. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Owner words: I approve the git commands Codex asks for to build these two items (worktree add, add, commit), but no merge yet. | Create the WI-001 worktree and build; leave merge for a later owner decision. |
| 2026-09-28 | Moved by hand: .work-items/WI-001-build-tally-word-count-cli/WORK-ITEM.md -> .work-items/counting/WI-001-word-count/WORK-ITEM.md. | It is still a top-level item. Group: counting. |
| 2026-09-28 | Split completed: WI-002 covers R-02; both item plans are written. Git worktree creation was rejected by the session approval policy. | WI-001 waits for Mike to create its code worktree or reopen an interactive session that can approve the Git command. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Design text changed after approval. | The text of the approved design changed. Tell the owner what changed; ask him to approve it again when the change is more than a correction. |
| 2026-09-28 | Set stage 05 Breakdown -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-28 | Design text changed after approval. | The text of the approved design changed. Tell the owner what changed; ask him to approve it again when the change is more than a correction. |
| 2026-09-28 | Sub-item WI-002 created: Add --lines line count. | WI-002 delivers R-02. Those requirements stay here, unchanged and approved. |
| 2026-09-28 | Folder renamed for the new title: .work-items/WI-001-build-the-tally-cli/ -> .work-items/WI-001-build-tally-word-count-cli/. | Same item; the toolkit uses the new path. |
| 2026-09-28 | Set title "Build tally word count CLI" (was "Build the tally CLI"). | Continue with work-organize. |
| 2026-09-28 | Set stage 04 Solution design -> 05 Breakdown (status In Progress). | Continue with work-organize. |
| 2026-09-28 | Mike: I approve option A. Before you build, split this up: WI-001 is doing two things. Keep the word count in WI-001 and make the --lines flag its own sub-item under it. | Option A approved. Split R-02 into a child before building; WI-001 retains R-01 and the approved parent requirements and design. |
| 2026-09-28 | Design approved by Mike. | The design can be built. No longer waiting on the owner. |
| 2026-09-28 | Design proposed: Option A, one plain Node.js command with built-in file reading and node:test checks. Independent requirements and design reviews found R-01 and R-02 covered after argument and source clarifications. | Continue with work-decide. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-28 | Set delivery owner-led. | Small item: one or two tasks, so no delivery offer. |
| 2026-09-28 | Requirements approved by Mike. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-28 | Mike said: Yes, I approve that rule: blank lines count, and a trailing line break does not add an extra line, so that file prints 2. | Q-02 answered; R-02 can state the complete approved line-count behavior. |
| 2026-09-28 | Design check found that R-02 does not define blank lines or an extra empty line after a trailing line break. | Q-02 waits on Mike; refinement resumes before design. |
| 2026-09-28 | Set stage 04 Solution design -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-28 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-28 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-28 | Requirements approved by Mike. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-28 | Mike said: Approved. | Requirements approved. |
| 2026-09-28 | Owner words: Yes: words are anything separated by spaces or line breaks, and a last line without a newline still counts. An empty file prints 0 for both. | Q-01 answered; R-01 and R-02 now state the counting rules and empty-file behavior. |
| 2026-09-28 | Mike requested word counting by default and line counting with --lines; draft requirements were written. Counting conventions remain open. | Waiting for Mike to answer Q-01 before requirements approval. |
| 2026-09-28 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-28 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Should words be whitespace-separated and a final nonempty line count even without a trailing newline? | R-01, R-02 | Answered 2026-09-28: Mike said words are anything separated by spaces or line breaks; a last line without a newline counts; an empty file prints 0 for both. | owner |
| Q-02 | For a file containing one followed by two line breaks, should --lines print 2 or 3? This decides whether a trailing line break creates an extra empty line; do blank lines count? | R-02 | Answered 2026-09-28: Mike approved counting blank lines and not adding an extra line for a trailing line break; that file prints 2. | owner |
| Q-03 | Create the WI-001 code worktree in an interactive session or run the exact git worktree command in a terminal? | P1 build setup | Answered 2026-09-28: Mike approved the Git commands Codex asks for to build WI-001 and WI-002, including worktree add, add, and commit; no merge yet. | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

Build the tally CLI: `node bin/tally.js notes.txt` should print how many words are in notes.txt. Also add a --lines flag, so `node bin/tally.js --lines notes.txt` prints how many lines it has instead.

### Agreed goal

Mike can run tally on a text file to print its word count, or use --lines to print its line count instead.

### Active requirements

#### R-01 — Word count by default

**Status:** Finalized  
**Applies to:** Mike when running tally with a text file path and no count flag.  
**Required behavior:** Tally prints the number of words in the file. Words are text separated by spaces or line breaks.  
**Boundaries and exceptions:** An empty file prints 0. Repeated separators do not count as words.  
**Acceptance check:** A file containing `one two` on one line and `three` on the next prints 3; an empty file prints 0.  
**Decision record:** Mike, 2026-09-28, starting request and answer to Q-01; approved 2026-09-28.  
**Open questions:** None.

#### R-02 — Line count with --lines

**Status:** Finalized  
**Applies to:** Mike when running tally with --lines and a text file path.  
**Required behavior:** Tally prints the number of lines in the file instead of the word count. Blank lines count. A final nonempty line counts even without a trailing line break. A trailing line break does not add another empty line.  
**Boundaries and exceptions:** An empty file prints 0.  
**Acceptance check:** A file containing `one two` followed by a line break and `three` without a final line break prints 2; a file containing `one` followed by two line breaks prints 2; an empty file prints 0.  
**Decision record:** Mike, 2026-09-28, starting request and answer to Q-01; approved 2026-09-28. The earlier wording did not specify blank lines or trailing line breaks; Mike approved the added rule in Q-02 on 2026-09-28.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. Running `node bin/tally.js notes.txt` prints the word count for a known sample file, including the empty-file case.
2. Running `node bin/tally.js --lines notes.txt` prints the line count for the same file, including blank lines, a trailing line break, a final line without a line break, and the empty-file case.
3. Mike reviews the tested result.

## Notes

### Decisions and context

- Mike approved Option A on 2026-09-28. WI-001 builds R-01; WI-002 covers R-02. The approved requirements and design remain in WI-001.
- Use plain Node.js without npm packages and node:test, as the approved design states.
- The design received independent requirements and design reviews before approval.
- The 2026-09-28 git worktree add attempt was rejected with: approval required by policy, but AskForApproval is set to Never.
- Mike approved the WI-001 result on 2026-09-28 after running four-word and empty-file checks in the WI-001 worktree.
- Mike approved the WI-002 result on 2026-09-28 after running three line-count examples in its worktree. He said not yet on the merge.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

- Option A, approved: one Node.js command reads a named text file and prints one integer.

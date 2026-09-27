# Sample run c: Notion tracker and Notion memory, round 2

Run on 2026-09-27 from 16:55 to 18:08 UTC. Every session is a real
`codex exec` session (codex-cli 0.157.0, model `gpt-6-sol`, Mike's default
reasoning effort "high"), started fresh. The tester played Mike, the owner.
Round 1 is kept unchanged in `round1/` (its own `evidence.md`).

## Result

- The work item TSRC-001 "Write a short project brief in README.md" went from
  `01-discovery` to Done in Notion, with one sub-item, TSRC-002 "Explain how to
  add a quote in README.md", made by splitting it. Requirements approval,
  design approval, and both result approvals are recorded in Mike's words.
  The README change is merged into local `main` (`9516b64`).
- The split used the new `--covers R-01`: TSRC-002 started at
  `03-requirements-approved` and inherited the parent's approval, so Mike was
  not asked twice.
- The hand move in Notion (TSRC-002 dragged out from under TSRC-001) was
  noticed by the next session and the agent carried on. But the briefing did
  not report it (its 2-second Notion check ran out of time), three toolkit
  commands failed with "Saved but not verified", and TSRC-002 got the same
  history row five times (bugs 1 and 2).
- "Remember that I prefer README sections written as short bullet lists" was
  saved to the Notion Memory database in s04 and found by a fresh session in
  s14.
- "Where are we?" (s10) opened `work-status`. "What do you need from me?"
  (s11) opened `work-decide`. Both counted one decision, correctly.
- In s04 the agent skipped requirements approval and design and edited
  `README.md` on `main`. Mike had to reject the result in s05 to get the
  steps done (bug 3).

Verdict: not passed. The item reached Done correctly in the end, and the
sub-item, memory, status, and decisions worked. The hand move was noticed,
but with the failures in bugs 1 and 2, and the agent skipped the requirements
and design gates until the owner pushed back (bug 3).

## How the sessions ran

| What | Value |
| --- | --- |
| Project folder | `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/c-notion-r2`, a new Git repository with one commit `75ed330` holding `quote.js` and `.gitignore`. The folder `runs/notion-sample` did not exist, so a new project row was made. |
| Notion root | Mike's real "AI Agent Second Brain" page (`3e7b381d-a176-803f-a48f-e838ee648e67`), not archived at the start (`in_trash: false`, `is_archived: false`). Its Projects database is `3901f052-2c56-4603-ad56-7f5924655925`. |
| Toolkit config | `TOOLKIT_V2_CONFIG_DIR=<scratchpad>/runs/c-notion-r2-config`, holding the `notion.json` the rebuild step wrote (root page and Projects database). Mike's `~/.config/toolkit-v2/` was not used by these sessions. |
| Plugins | Codex cache `~/.codex/plugins/cache/toolkit-v2/*/0.2.1` (0.2.0 for session-skills and sf-architect-solutioning), checked identical to the source folders before the run. |
| Command | `codex exec --json --approve-for-me --dangerously-bypass-hook-trust -c 'notify=[]' -c 'projects={"<project>"={trust_level="trusted"}}' -C <project> "<prompt>" < /dev/null` |
| Setup session only | `-c 'plugins={"toolkit@toolkit-v2"={enabled=true}}'`, because a new folder has no `.codex/config.toml` yet and the V2 plugins are off for the whole computer. With it, the skill list held both `project-setup` and claude-toolkit's `project-init`. |
| Approvals | `--approve-for-me` gives Codex's interactive approval mode (`approval_policy` on-request) with Codex's automatic reviewer answering each approval request. It stands in for Mike clicking "approve" in the Codex app. It approved every escalation the agent asked for (listed per session in `sessions/*.summary.txt`). |
| Scripts | `<scratchpad>/runs/c2-run.sh` (one session), `c2-summarize.py` (summary from the `--json` output and the Codex session log). |

## Notion links

| What | Link |
| --- | --- |
| Project row and page "Toolkit V2 sample run c (safe to delete)" | https://app.notion.com/p/Toolkit-V2-sample-run-c-safe-to-delete-3e8b381da17681c8a2f7cc7858684827 |
| Work Items database | https://app.notion.com/p/59c262e7dd8c4af2bfd4d5a389e31dfb |
| Work Items board view | https://app.notion.com/p/59c262e7dd8c4af2bfd4d5a389e31dfb?v=3e8b381da17681558578000cf39360b1 |
| TSRC-001 | https://app.notion.com/p/Write-a-short-project-brief-in-README-md-3e8b381da176813d9629dff9d158fb1d |
| TSRC-001 Solution Design page | https://app.notion.com/p/TSRC-001-Write-a-short-project-brief-in-README-md-solution-design-3e8b381da1768158b5d5cb4f2af87c71 |
| TSRC-002 (sub-item) | https://app.notion.com/p/Explain-how-to-add-a-quote-in-README-md-3e8b381da17681c4aa6fdd2d5bd76fa4 |
| Memory database | https://app.notion.com/p/5a83d3fca8ac40d79a475e9dab0f081a |
| Memory record | https://app.notion.com/p/user_readme_bullet_lists-3e8b381da17681359fcef30cb8225fa5 |

Notion API read-back after the run (`final/notion-readback.txt`):

```text
- TSRC-2 | Explain how to add a quote in README.md | Stage 11-user-approval | Status Done | Parent item ['3e8b381d-a176-813d-9629-dff9d158fb1d'] | Result approved 2026-09-27 by Mike Rihm
- TSRC-1 | Write a short project brief in README.md | Stage 11-user-approval | Status Done | Parent item [] | Sub-items ['3e8b381d-a176-81c4-aa6f-dd2d5bd76fa4'] | Result approved 2026-09-27 by Mike Rihm
- user_readme_bullet_lists | Type user | Status current | Approved by Mike Rihm on 2026-09-27
```

## Timeline

"Briefing" means the SessionStart hook put "Project briefing: ..." into the
session (a `hooks.additional_context` message in the Codex session log).
"Records" is the number of `toolkit` writes the PostToolUse hook recorded in
`~/.codex/plugins/data/toolkit-toolkit-v2/sessions/<thread>.json`. "Esc." is
the number of commands the agent asked to run outside the sandbox.

| # | Prompt (Mike) | Skills opened | Main commands and outcome | Hooks |
| --- | --- | --- | --- | --- |
| s00 | "Set up this project with Toolkit V2. My answers: call the project "Toolkit V2 sample run c (safe to delete)" with the key tv2-sample-run-c. I'm the owner, Mike Rihm. Track work in Notion. Keep memory in Notion. ... not a Salesforce project ... both Codex and Claude Code. Skip SOUL.md ..." | `project-setup` (not the listed `project-init`) | Told Mike first that init writes `.codex/` and needs approval, then `toolkit init --name '...' --key tv2-sample-run-c --tracker notion --memory notion --owner 'Mike Rihm' --hosts claude-code,codex --decline SOUL.md` (escalated). Init: "WI is already used, so this project's work items are TSRC-1, TSRC-2 in Notion (TSRC-001 in the toolkit)". Doctor: 0 problems. Filled the guides, no `SOUL.md`, offered one commit. | no project yet; Esc. 4 |
| s01 | "Commit setup: make one commit of the Toolkit V2 setup files you added and changed." | `work-on` | `git add -- <26 files by name>`, `git commit -m 'Add Toolkit V2 project setup'` -> `6bfc120`. | briefing; Esc. 3 |
| s02 | "New work: write a short project brief in README.md." | `work-on`, `publish-docs` | Treated as a quick edit: no item, rewrote `README.md` on `main` (bug 7). | briefing |
| s03 | "Please put README.md back ... I want this tracked as a work item and done properly ... ask me what it should say before you write anything." | `work-on`, `work-requirements` | `toolkit work new --title "Restore README and write a short project brief" --type repository-maintenance --stage 01-discovery` -> TSRC-001; Q-01 added; waiting on owner. README not restored (bug 8). | briefing; 7 records |
| s04 | "About TSRC-001: the brief should say what quote.js does, who it is for ..., how to run it ..., how to add a new quote ... first restore README.md ... Also, remember that I prefer README sections written as short bullet lists, not long paragraphs." | `work-on`, `work-decide`, `memory-save`, `publish-docs`, `work-requirements`, `work-check` | `toolkit memory save --type user --name readme-bullet-lists ... --approved-by "Mike Rihm"` -> "Saved to memory: user_readme_bullet_lists (new record)". `git restore -- README.md` (escalated). Then wrote the brief on `main`, `toolkit work set TSRC-001 --stage 09-testing` from 01, checker worker, stage 11, asked for result approval (bug 3). | briefing; keep line; 10 records; Esc. 2 |
| s05 | "Not yet, I don't approve the TSRC-001 result ... you never showed me the requirements to approve, you skipped the design, and you edited README.md on main ... rename the item to "Write a short project brief in README.md"" | `work-on`, `work-requirements`, `work-decide`, `memory-find`, `memory-save` | `toolkit work set TSRC-001 --title ...`, `--stage 02-refinement`, removed the brief from `main`, requirements analyst worker, "Do you approve these requirements?". `toolkit work decisions` -> "1 decision waits on the owner". | briefing; 9 records |
| s06 | "Approved." | `work-decide`, `work-requirements`, `solution-design`, `memory-save` | R-01 marked Finalized, `toolkit work approve TSRC-001 --requirements --by 'Mike Rihm'`, stage 04, `toolkit work design TSRC-001 --create`, asked whether to use two drafters and a critic (Q-02). | briefing; 15 records; Esc. 24 (bug 10) |
| s07 | "Yes, use two design drafters and one critic. Then show me the design options for TSRC-001." | `work-decide`, `solution-design`, `work-on`, `memory-save` | Two architect workers and one critic (`spawn_agent`, `fork_turns` none), one fix round. `toolkit work design TSRC-001 --set-file ... --status proposed` -> "Error: Saved but not verified: the design of TSRC-001 in Notion does not match what was written." (bug 6). Options A and B shown, recommends A. | briefing; 12 records |
| s08 | "Go with option A. Also split the work: make the "how to add a quote" instructions their own sub-item under TSRC-001 ... Then keep going." | `work-organize`, `work-decide`, `work-on`, `publish-docs`, `work-check`, `memory-save` | `toolkit work approve TSRC-001 --design`, stage 05, `toolkit work new --title "Explain how to add a quote in README.md" --type repository-maintenance --parent TSRC-001 --covers R-01` -> "Created TSRC-002 ... (03 Requirements approved, Ready, sub-item of TSRC-001) ... inherits that requirements approval". Worktrees `.claude/worktrees/tsrc-001-project-brief` and `tsrc-002-add-quote` (from the parent's branch), commits `c2329c8` and `9516b64`, checker worker, TSRC-002 at stage 11. | briefing; 6 records; Esc. 6 |
| s08b | Hand move by Mike (Notion API, same effect as dragging the card out) | - | `ntn api v1/pages/<TSRC-002> -X PATCH` with `"Parent item": {"relation": []}` at 17:47:08 UTC. | - |
| s09 | "Keep going." | `work-on`, `work-decide` | Briefing: "The Notion work items could not be read in 2 seconds (Notion did not answer in time: No answer within 514 ms.)", no changes section. The agent's first three toolkit reads failed: "Error: Saved but not verified: the text of TSRC-002 in Notion does not match what was written." Then: "I found one owner change in Notion: TSRC-002 is now a top-level item. I'll keep it there." Updated the relationship text, asked for TSRC-002's result approval. | briefing; 4 records |
| s10 | "Where are we?" | `work-status` | "**One decision waits on you:** review the fourth README bullet in TSRC-002 ... Say **"what do you need from me"** to review the decision." | briefing; 0 records |
| s11 | "What do you need from me?" | `work-decide` | One decision with a recommendation: "I recommend approving it ... **Do you approve TSRC-002's result, or would you like the wording changed?**" | briefing; 0 records |
| s12 | "Approved, TSRC-002 looks good. Also, I dragged TSRC-002 out from under TSRC-001 in Notion by mistake. Put it back under TSRC-001, then keep going." | `work-on`, `work-organize`, `work-decide`, `work-finish`, `work-check`, `memory-save` | `toolkit work sync` -> "Nothing changed", `toolkit work move TSRC-002 --under TSRC-001` -> "Moved TSRC-002 from root to TSRC-001.", `toolkit work approve TSRC-002 --result`, `git merge --ff-only claude/tsrc-002-add-quote` in the TSRC-001 worktree, checker worker, TSRC-001 at stage 11. | briefing; 18 records; Esc. 1 |
| s13 | "Approved, the combined README brief looks good. Ship it: there is no remote, so merge it into main locally. I approve that merge. Then close both items out and clean up the worktrees." | `work-decide`, `work-finish`, `merge-and-clean-up`, `work-on`, `memory-save` | `toolkit work approve TSRC-001 --result`, `git merge --ff-only claude/tsrc-001-project-brief` on `main`, both worktrees and branches removed, `toolkit work finish TSRC-002 ...` -> "TSRC-002 is Done.", then TSRC-001. Current focus cleared. Stages 12 to 14 skipped (bug 9). | briefing; 12 records; Esc. 5 |
| s14 | "Do you remember how I like README sections written?" | `memory-find` | `toolkit memory find "README sections bullet lists"`, `toolkit memory get user_readme_bullet_lists` -> "Yes. You prefer README sections written as **short, concise bullet lists** rather than long paragraphs. [Project memory: `user_readme_bullet_lists`, confirmed September 27, 2026.]" | briefing; 0 records |

Every required work skill ran: `work-on`, `work-requirements` (s03 to s06),
`solution-design` (s06, s07), `work-organize` (s08, s12), `work-check` (s04,
s08, s12), `work-finish` (s12, s13), `work-decide` (s04 to s09, s11 to s13).
Also `work-status` (s10), `memory-save` (s04), `memory-find` (s05, s14), and
`merge-and-clean-up` (s13).

## Hooks

- **SessionStart:** a "Project briefing: Toolkit V2 sample run c (safe to
  delete) (tv2-sample-run-c), owner Mike Rihm ..." message in every session
  from s01 to s14 (`sessions/*.hooks.txt`). The briefing delivered by the
  Codex hook no longer carries the false "Codex does not trust this folder"
  and "hooks are not trusted" lines; `toolkit doctor` still shows them.
- **UserPromptSubmit:** in s04 only, "The owner stated something to keep;
  memory-save records it, or work-on if it is a task." The session state holds
  `keep: "remember that"`.
- **PostToolUse:** records of every `toolkit work` and `toolkit memory` write
  (counts in the table). With the Notion tracker there is no work item file,
  so the file-edit validation branch had nothing to check; the agent ran
  `toolkit work validate` after its edits in every writing session.
- **Stop:** the session state file was updated at the end of each turn, for
  example s14 at 18:08:08.210Z, next to the final message at 18:08:08.217Z.
  It never blocked a turn (`stopBlocked: false`); s04 saved the memory it was
  asked to keep.
- **PreToolUse:** no command was refused.

## The hand move, step by step

1. 17:46:43 UTC: s08 ends. The tracker cache
   (`.git/toolkit-v2/notion/tracker.json`) holds TSRC-002 with
   `written.parent: TSRC-001`.
2. 17:47:08 UTC: Mike's move: TSRC-002 "Parent item" set to empty
   (`sessions/s08b-hand-move-*.json`). TSRC-001 "Sub-items" became empty.
3. 17:47:18 UTC: s09 briefing: "The Notion work items could not be read in 2
   seconds (Notion did not answer in time: No answer within 514 ms.). The list
   below is the local copy from the last toolkit command." It still listed
   TSRC-002 as a sub-item, and no "Changes found in the tracker" section.
4. 17:47:33 UTC: Codex ran `toolkit work show TSRC-002`, `toolkit work show
   TSRC-001`, and `toolkit work decisions` at the same time (one
   `Promise.allSettled` call). All three exited 1: "Error: Saved but not
   verified: the text of TSRC-002 in Notion does not match what was written."
5. 17:47:54 UTC: `toolkit work show TSRC-002 --json` worked and showed
   `"parent": "none"`.
6. The agent told Mike: "I found one owner change in Notion: TSRC-002 is now a
   top-level item. I'll keep it there." It rewrote the relationship text in
   both items and added a history note.
7. TSRC-002's Recent History now holds "Parent changed in Notion by hand:
   TSRC-001 -> none (top level)." five times, all created in minute 17:47
   (Notion block `created_time`).
8. s12: `toolkit work sync` said "Nothing changed", and
   `toolkit work move TSRC-002 --under TSRC-001` put it back at Mike's
   request.

## Fixes from the last round seen working

- `project-setup` chosen over the listed `project-init` (s00).
- Init in Codex: the agent said it needed approval first and asked for it; no
  host was dropped; `--decline SOUL.md` recorded in `.toolkit.json`
  `declined`; no `SOUL.md`, and doctor does not report it missing.
- Git writes in Codex (setup commit, two worktrees, two item commits, two
  fast-forward merges, worktree removal, branch deletion), each run outside
  the sandbox after an approval request. Branch names follow
  `claude/tsrc-001-project-brief`.
- Split after approval with `--covers`: inherited approval, child starts at
  03, the parent's approved design covers the child.
- The decision queue lists each decision once (s05, s08, s10, s11).
- Recent History is newest first; every `work set` row fills "Effect on the
  work".
- `mktemp -d` folders for `--set-file`, deleted after use (one left, bug 13).
- Checkers and designers ran as `spawn_agent` workers with `fork_turns` set to
  `none` (s04, s05, s07, s08, s12).
- `toolkit work finish` ran with a recorded approval; list and tree show
  "(Done)".
- The hand move was detected after reads (the cached parent is no longer
  overwritten), and a history row was written, though five times.

## Bugs found

1. **High. A Notion hand move breaks reads and duplicates the history row.**
   Evidence: "The hand move, step by step" steps 3 to 7;
   `final/TSRC-002-WORK-ITEM.md` (five identical rows). Cause, from
   `syncOne()` in `lib/notion/tracker.mjs`: the history row is written with
   `this.update(...)` before `this.remember(id, latest, { written: snap })`.
   When the update throws (the hook's deadline, or a read-back that another
   process changed), `written.parent` stays `TSRC-001`, so the next command
   finds the same move and writes the row again. Three parallel `toolkit`
   processes each did this, and the read-back check failed because the others
   were writing to the same page. Read-only commands (`show`, `decisions`)
   exited 1. Fix: take a lock file under `.git/toolkit-v2/notion/` for sync
   writes; record the new `written.parent` before the history write, or skip
   the row when the newest history row already records the same change; let
   a read command print its result and report a failed sync write as a
   warning.
2. **High. The session-start briefing misses the hand move.** s09 briefing:
   "could not be read in 2 seconds (... No answer within 514 ms.)". The
   2-second budget covers the whole job (`deadlineMs` in
   `lib/notion/client.mjs`), and the quick sync in the hook also tries to
   write the history row, so the budget runs out exactly when there is a move
   to report. The write it started still landed (one of the five rows). Fix:
   in the hook, only read and report moves (no writes), leave the history row
   to the next toolkit command, and show the moves in the "Changes found in
   the tracker" section.
3. **High. `work-on` skipped the requirements and design gates and built on
   `main`.** s04: after Mike answered Q-01, the agent wrote R-01 with Status
   Refining and the note "No requirements approval was requested or recorded
   for this repository-maintenance item", edited `README.md` in the main
   checkout, and ran `toolkit work set TSRC-001 --stage 09-testing` from
   `01-discovery` ("Updated TSRC-001: stage 01 Discovery -> 09 Testing"). Mike
   had said "I want this tracked as a work item and done properly" and "ask
   me what it should say before you write anything". The CLI allows the jump
   for any type other than `build` and `data-load`. work-on step 7 ("never on
   the default branch") was not followed. Fix: in `work-on` step 5, show the
   requirements for approval whenever the owner answered questions that set
   them or asked for the item to be "done properly"; route every item that
   changes committed files through stage 07 (worktree); have
   `toolkit work set` warn when a jump passes 03 while an `R-xx` is still
   Refining, and when it passes 04 with no design and no history note giving
   the reason.
4. **Medium. `toolkit work validate` passes an item with template
   placeholders.** s04, at stage 11: the Roadmap still held
   `| P1 — <Phase 1 name> | <What this phase establishes> | ...` and the
   Tasks section `**P1-T01 — <Task 1 name>**`, with their guide comments, and
   validate printed "Checked 1 item: 1 clean, 0 errors, 0 questions for the
   owner." Fix: flag `<...>` placeholder rows and section guide comments in
   Roadmap and Tasks from stage 07 on (the `guide_left` check covers only the
   item-level guide).
5. **Medium. The Codex Git rule does not take an approved command out of the
   sandbox by itself.** Experiment in `sessions/x-codex-git-approval-experiment.txt`:
   with the project's `toolkit.rules`, `git add b.txt` under
   `--approve-for-me` ran inside the sandbox and failed with "fatal: Unable to
   create '.../.git/index.lock': Operation not permitted". Only a request with
   `sandbox_permissions: require_escalated` ran it outside. In this run the
   agent asked for escalation itself each time, so every Git write worked.
   `templates/codex/toolkit.rules`, the README, and the work conventions say
   "a command he approves runs outside the sandbox"; that is not what Codex
   did here (Codex's interactive approval screen was not tested). Fix: tell
   the agent, in the conventions and `work-on`/`work-finish`, to request
   escalated permissions for each Git write in Codex, and check the
   interactive case once in the Codex app.
6. **Medium. A design save that landed reported "Saved but not verified".**
   s07: `toolkit work design TSRC-001 --set-file ... --status proposed` ->
   "Error: Saved but not verified: the design of TSRC-001 in Notion does not
   match what was written." The page holds the full design
   (`sessions/s07-design-readback-after-unverified-save.md`). The same text
   round-trips cleanly through the toolkit's own Markdown converter, so the
   difference came from Notion's side; the written file was deleted, so the
   exact line is unknown. The agent did not tell Mike. Fix: print the first
   line that differs (written and read back) with the error, so the agent can
   judge it; and keep the conventions' rule to lead the reply with "Saved but
   not verified".
7. **Low. "New work: ..." became a quick edit.** s02: "This appears to be a
   one-file documentation edit, so the work-on procedure does not call for a
   tracker item." The agent rewrote `README.md` (4 lines added, 21 removed) on
   `main` and chose the brief's content itself. Fix: in `work-on` step 3,
   "new work", "track", or "work item" in the request always makes an item;
   content the owner has not described is a question, not a quick edit.
8. **Low. The item was created with the agent's title, and the requested
   restore was not done.** s03: title "Restore README and write a short
   project brief" instead of Mike's words; the reply said only "I started
   **TSRC-001** to track the README work". It also left `README.md` changed
   although Mike asked to put it back (done in s04 after he asked again).
   Fix: the conventions' title rule should also cover a new item: use the
   owner's words, or say the title in one line.
9. **Low. Stages 12 to 14 skipped without a note.** s13: TSRC-001 and
   TSRC-002 went from `11-user-approval` to Done with no
   `toolkit work set --stage 12-pr-and-push` and no history note giving the
   reason, although the item changed committed files and was merged.
   `work-finish` step 2 names the pull request stage. Fix: have
   `toolkit work finish` warn when an item with commits finishes from stage
   11, or have `work-finish` record "no remote; merged locally" as a history
   note.
10. **Low. Chained toolkit commands still happen in Codex.** s06 started with
    `cat ...; toolkit work decisions; toolkit work show ...` and s07 ran
    `git status --short && toolkit work validate TSRC-001`: "Error: The Notion
    CLI has no sign-in it can use here. Fix: ... run toolkit commands outside
    the sandbox". After the first one, the s06 agent asked to escalate every
    toolkit command (24 requests), which in the Codex app would be 24
    approval prompts. Fix: a Codex PreToolUse check that warns when `toolkit`
    appears after `;`, `&&`, or `|`.
11. **Low. Done items still show stage 11.** `toolkit work show` prints
    "Stage: 11 User approval (Done)" and the Notion Stage property stays
    `11-user-approval` for both Done items. List and tree show "(Done)".
    Fix: show "Done" in the `show` header too.
12. **Low. Parent history and move wording.** Neither the hand move nor
    `toolkit work move` added a row to the parent TSRC-001, and the move
    command printed "Moved TSRC-002 from root to TSRC-001." ("root" is folder
    language; in Notion it is "top level"). Fix: add a parent history row
    ("Sub-item TSRC-002 moved out by hand" / "moved back"), and say "top
    level" for Notion.
13. **Low. One temporary folder left.** s08 left
    `$TMPDIR/tmp.MTfAV2vn6u/design.md` (15,888 bytes). Every other session
    deleted its `mktemp -d` folder. Round 1 left about 35 files.

Not counted as bugs:

- Setup in a new folder still needed the V2 plugin switched on for that one
  session. This is the open decision for Mike (switch `toolkit@toolkit-v2` on
  machine-wide), documented in the README.
- `toolkit doctor` warns "Codex does not trust this folder" and "hooks are not
  trusted", because this run passed trust per run (`-c projects=...`) and
  used `--dangerously-bypass-hook-trust`. Doctor reads `~/.codex/config.toml`.

## Files in this folder

| File | What it is |
| --- | --- |
| `final/TSRC-001-WORK-ITEM.md`, `final/TSRC-002-WORK-ITEM.md` | `toolkit work show` after the run: the Notion item bodies in the `WORK-ITEM.md` format |
| `final/TSRC-001-DESIGN.md` | `toolkit work design TSRC-001` (the Solution Design page) |
| `final/tracker-final.txt` | `toolkit work list --all --tree`, `validate`, `sync`, `decisions`, `next` |
| `final/memory-listing.txt` | `toolkit memory list --status all`, `get`, `focus`, `status` |
| `final/notion-readback.txt` | Notion API read of the Projects, Work Items, and Memory databases |
| `final/project-file-tree.txt` | Project files, Git log and branches, the `.git/toolkit-v2` cache files |
| `final/final-README.md`, `final/toolkit.json` | The README on `main` at `9516b64`, and `.toolkit.json` |
| `final/brief-final.txt`, `final/doctor-final.txt` | `toolkit brief` and `toolkit doctor` after the run |
| `sessions/index.txt` | Start, end, thread id, and extra arguments of each session |
| `sessions/sNN-*.prompt.txt` | Mike's exact prompt |
| `sessions/sNN-*.summary.txt` | Hook messages, skills opened, escalation requests, every command with its output, and the agent's messages |
| `sessions/sNN-*.hooks.txt` | The full hook messages Codex added |
| `sessions/sNN-*.hookstate.json` | The hook session-state file |
| `sessions/sNN-*.jsonl.gz` | The `codex exec --json` output |
| `sessions/s08b-hand-move-*` | The Notion page before the move, the PATCH response, and the time |
| `sessions/x-codex-git-approval-experiment.txt` | The Git rule experiment behind bug 5 |
| `round1/` | Round 1 evidence, unchanged |

Full Codex session logs stay in the scratch folder
`<scratchpad>/runs/c-notion-r2-logs/` (`*.rollout.jsonl`) and in
`~/.codex/sessions/2026/09/27/`.

## Changes outside the toolkit-v2 repository

- Notion, under Mike's real "AI Agent Second Brain" page: a new Projects row
  "Toolkit V2 sample run c (safe to delete)" (Key `tv2-sample-run-c`) with its
  Work Items database (TSRC-1, TSRC-2, one Solution Design page), its Memory
  database (one record), and "Current focus" and "Terminology glossary"
  pages. The ID prefix `TSRC` is now taken in the workspace. The tester moved
  TSRC-002 out from under TSRC-001 once through the API; the agent moved it
  back.
- Scratch folder `<scratchpad>/runs/`: the project `c-notion-r2`, its logs
  `c-notion-r2-logs`, the config folder `c-notion-r2-config`, the experiment
  repositories `c-notion-r2-exp`, and the scripts `c2-*`.
- `~/.codex/sessions/2026/09/27/`: Codex session logs for s00 to s14 and three
  experiment sessions.
- `~/.codex/plugins/data/toolkit-toolkit-v2/sessions/`: hook state files for
  s01 to s14.
- `$TMPDIR/tmp.MTfAV2vn6u/` left by s08.
- Not changed by this run: `~/.codex/config.toml` (trust passed per run with
  `-c`; the V2 plugins are still `enabled = false` there) and
  `~/.config/toolkit-v2/` (the sessions used the scratch config folder).

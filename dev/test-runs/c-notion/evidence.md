# Sample run c: Notion tracker and Notion memory, round 3

Run on 2026-09-27 from 19:32 to 20:23 UTC. Every session is a real
`codex exec` session (codex-cli 0.157.0, model `gpt-6-sol`, reasoning effort
"high"), started fresh. The tester played Mike, the owner. Round 1 is kept in
`round1/` and round 2 in `round2/`, each with its own `evidence.md`.

## Result

- The work item TV2-001 "Write a short project brief in README.md" went from
  `01-discovery` to Done in Notion, with one sub-item, TV2-002 "Write the how
  to add a quote instructions in README.md", made by splitting it. The
  requirements approval, the design approval, and both result approvals are
  recorded with Mike's words. The README change is on local `main`
  (`e9425dd`). Stages 12 and 14 were set, each with a "No remote" or "No
  requirements or system-guide update" note.
- The hand moves in Notion worked both ways. TV2-002 was dragged out from
  under TV2-001 (through the API) before s06, and dragged back before s09.
  Each time the session briefing listed "Re-parented: TV2-002", the agent
  told Mike in one line and carried on, and each item got exactly one history
  row per move. No command failed.
- "Remember that I prefer README sections written as short bullet lists" was
  saved in s03 and found by a fresh session in s11.
- "Where are we?" (s07) opened `work-status`. "What do you need from me?"
  (s08) opened `work-decide`, which asked for the two result decisions one at
  a time.
- Every required work skill ran: `work-on`, `work-requirements`,
  `solution-design`, `work-organize`, `work-check`, `work-finish`,
  `work-decide`.

Verdict: not passed. The end state is correct, and the sub-item, both moves,
memory, status, and the decision questions worked. Two things went wrong on
the way:

- In s02, "New work: write a short project brief in README.md" became a
  `task` item that skipped requirements and design (01 to 07 in one step).
  The agent wrote the brief's content itself from `PROJECT.md` and asked for
  result approval. Mike had to reject it in s03 to get the requirements and
  design steps (bug 2).
- In s05, `toolkit work approve TV2-001 --design` failed twice with "Saved
  but not verified". The approval went through only after the agent wrote
  "Design status: Approved" into the design text by hand (bug 1).

## How the sessions ran

| What | Value |
| --- | --- |
| Project folder | `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/c-notion-r3`, a new Git repository with one commit `5bdf738` "Add quote script" (`quote.js`, `.gitignore`), the same files as round 2. |
| Project row | The folder `runs/notion-sample` did not exist, so a new project row was made. The name "Toolkit V2 sample run c (safe to delete)" and key `tv2-sample-run-c` were already used by round 2's row, so this run used "Toolkit V2 sample run c3 (safe to delete)" with key `tv2-sample-run-c3`, to keep the two rows apart. |
| Notion root | Mike's real "AI Agent Second Brain" page (`3e7b381d-a176-803f-a48f-e838ee648e67`), not archived at the start (`in_trash: false`, `is_archived: false`). Projects database `3901f052-2c56-4603-ad56-7f5924655925`. |
| Toolkit config | `TOOLKIT_V2_CONFIG_DIR=<scratchpad>/runs/c-notion-r3-config`, holding a copy of round 2's `notion.json` (root page and Projects database). Mike's `~/.config/toolkit-v2/` was not used. |
| Plugins | Codex cache `~/.codex/plugins/cache/toolkit-v2/*/0.2.2` (0.2.0 for session-skills and sf-architect-solutioning). Before the run, `diff -rq` showed the cache equal to the source folders (apart from a `.DS_Store` and tests). |
| Command | `codex exec --json --approve-for-me --dangerously-bypass-hook-trust -c 'notify=[]' -c 'projects={"<project>"={trust_level="trusted"}}' -C <project> "<prompt>" < /dev/null`. `--approve-for-me` uses the workspace-write sandbox, with Codex's automatic reviewer answering each escalation request in place of Mike clicking "approve". |
| Setup session only | `-c 'plugins={"toolkit@toolkit-v2"={enabled=true}}'`, because a new folder has no `.codex/config.toml` yet and the V2 plugins are off for the whole computer (the open decision in the README). |
| Scripts | `<scratchpad>/runs/c3-run.sh` (one session), `c3-summarize.py` (summary), `c3-cmds.py`, `c3-hooktable.py`, `c3-agents.py`, `c3-readback.py`. |

## Notion links

| What | Link |
| --- | --- |
| Project page "Toolkit V2 sample run c3 (safe to delete)" | https://app.notion.com/p/Toolkit-V2-sample-run-c3-safe-to-delete-3e8b381da1768158a322ef49482eb82a |
| Work Items database | https://app.notion.com/p/627334eeae6745dda6b5f4ce1eb2a471 |
| TV2-001 | https://app.notion.com/p/Write-a-short-project-brief-in-README-md-3e8b381da176815394ddf4349c52d305 |
| TV2-001 Solution Design page | https://app.notion.com/p/TV2-001-Write-a-short-project-brief-in-README-md-solution-design-3e8b381da1768115ba32e17059f0e746 |
| TV2-002 (sub-item) | https://app.notion.com/p/Write-the-how-to-add-a-quote-instructions-in-README-md-3e8b381da1768156b32cce4163db9b48 |
| Memory database | https://app.notion.com/p/59655c24e8a545c39c065d4442073f8b |
| Memory record | https://app.notion.com/p/user_readme_bullet_lists-3e8b381da1768123bd57ecf7940743d5 |

Notion API read-back after the run (`final/notion-readback.txt`):

```text
- ID: TV2-2 | Work item: Write the how to add a quote instructions in README.md | Stage: 14-spec-update | Status: Done | Type: task | Waiting on: none | Requirements approved: 2026-09-27 by Mike Rihm | Design: none | Design approved:  | Result approved: 2026-09-27 by Mike Rihm | Parent item: ['3e8b381d-a176-8153-94dd-f4349c52d305'] | Sub-items: [] | Archived: False | Next action: None. Finished.
- ID: TV2-1 | Work item: Write a short project brief in README.md | Stage: 14-spec-update | Status: Done | Type: task | Waiting on: none | Requirements approved: 2026-09-27 by Mike Rihm | Design: approved | Design approved: 2026-09-27 by Mike Rihm | Result approved: 2026-09-27 by Mike Rihm | Parent item: [] | Sub-items: ['3e8b381d-a176-8156-b32c-ce4163db9b48'] | Archived: False | Next action: None. Finished.
- Key: user_readme_bullet_lists | Type: user | Status: current | Approved by: Approved by Mike Rihm on 2026-09-27 | Saved: 2026-09-27 | Source: The owner, in chat, 2026-09-27
```

## Timeline

"Briefing" means the SessionStart hook put "Project briefing: ..." into the
session (a `hooks.additional_context` message in the Codex session log).
"Records" is the number of `toolkit` writes the PostToolUse hook recorded in
the session-state file. "Esc." is the number of commands the agent asked to
run outside the sandbox (all approved by the automatic reviewer).

| # | Prompt (Mike) | Skills opened | Main commands and outcome | Hooks |
| --- | --- | --- | --- | --- |
| s00 | "Set up this project with Toolkit V2. My answers: call the project "Toolkit V2 sample run c3 (safe to delete)" with the key tv2-sample-run-c3. I'm the owner, Mike Rihm. Track work in Notion. Keep memory in Notion. It is not a Salesforce project. I use both Codex and Claude Code. Skip SOUL.md. ..." | `project-setup` | Told Mike that init must run outside the sandbox, then `toolkit init --name '...' --key tv2-sample-run-c3 --tracker notion --memory notion --owner 'Mike Rihm' --hosts claude-code,codex --decline SOUL.md` (escalated): "WI is already used, so this project's work items are TV2-1, TV2-2 in Notion (TV2-001 in the toolkit)". Filled the guides; doctor 0 problems. No work item. Wrote the current focus with a Python heredoc into `/tmp/tv2-c3-current-focus.md`, then `toolkit memory focus --set-file /tmp/tv2-c3-current-focus.md`; the file was left behind (bug 6). Last line: "Setup files are not committed. Commit them now?" | no project at session start; Esc. 7 |
| s01 | "Yes, commit the setup files." | `memory-save` | `git add -- <26 files by name>`, `git commit -m 'Add Toolkit V2 project setup'` -> `c1f1777`. Focus updated with `--text`. | briefing; Esc. 2 |
| s02 | "New work: write a short project brief in README.md." | `work-on`, `publish-docs`, `work-check`, `memory-save` | `toolkit work new --title "Write a short project brief in README.md" --type task --stage 01-discovery` -> TV2-001; then `toolkit work set TV2-001 --stage 07-tracking-setup --note "This is a small documentation task with a clear request; no requirements or design approval is required for type task."`; worktree `.claude/worktrees/wi-001-readme-brief` (bug 5); wrote the brief from `PROJECT.md`, commit `e8c9796`; checker worker; stage 11; "Do you approve the brief and authorize merging `e8c9796` into `main`?" (bug 2). Validate caught the "None" Open Questions row (fixed by the agent). | briefing; 22 records; Esc. 3 |
| s03 | "Not yet. I don't approve the TV2-001 result, and don't merge it. You didn't ask me what the brief should say. Here is what I want: ... I want this done properly: show me the requirements to approve before you change the README again, and after that give me a couple of design options. Also, remember that I prefer README sections written as short bullet lists, not long paragraphs." | `work-requirements`, `work-on`, `memory-save`, `work-decide` | History note with his words; stage 11 -> 02; R-01 to R-04 written as Refining; requirements-analyst worker; `toolkit memory save --type user --name readme-bullet-lists ... --approved-by "Mike Rihm"` -> "Saved to memory: user_readme_bullet_lists (new record)"; Q-02; "Do you approve these requirements?" | briefing; keep line; 20 records |
| s04 | "Approved." | `work-decide`, `work-requirements`, `solution-design`, `memory-save` | R-01 to R-04 set to Finalized; `toolkit work approve TV2-001 --requirements --by "Mike Rihm"`; stage 04; `toolkit work design TV2-001 --create`; design saved as proposed with Options A and B. No requirements-analyst, architect, or critic worker ran, and the team was not proposed; the reply said "No independent design critique ran." (bug 3). | briefing; 16 records |
| s05 | "Go with option A. Also split the work: make the "how to add a quote" instructions their own sub-item under TV2-001, so I can review that part on its own. Then keep going." | `work-organize`, `work-decide`, `work-on`, `publish-docs`, `work-check`, `memory-save` | `toolkit work approve TV2-001 --design` failed twice: "Error: Saved but not verified: the design of TV2-001 does not read back as approved." (bug 1). `toolkit work new --title 'Write the how to add a quote instructions in README.md' --type task --parent TV2-001 --covers R-04` -> "Created TV2-002 ... (03 Requirements approved, Ready, sub-item of TV2-001) ... inherits that requirements approval". Third design save, then approve worked. Commits `6216321` (parent) and `e9425dd` (child, worktree `tv2-002-add-quote` from the parent's branch). Acceptance-checker worker. Both items at 11. `toolkit work decisions` -> "4 decisions wait on the owner" for 2 decisions (bug 4). | briefing; 46 records; Esc. 5 |
| s05b | Hand move by Mike (Notion API, same effect as dragging TV2-002 out from under TV2-001) | - | `ntn api v1/pages/<TV2-002> -X PATCH` with `"Parent item": {"relation": []}` at 20:09:16 UTC. TV2-001 "Sub-items" became empty. | - |
| s06 | "Keep going." | `work-on`, `work-decide`, `work-organize` | Briefing: "Re-parented: TV2-002. Its parent is now none (top level)." First message: "TV2-002 is now a top-level item in Notion." `toolkit work decisions` recorded the move. The agent kept Mike's move, updated the relationship text, and asked "Do you approve the TV2-001 result at commit `6216321`?" | briefing; 4 records |
| s07 | "Where are we?" | `work-status` | "Two README changes are written and waiting for your review ... The tracker shows four decision entries because it lists both an open question and an approval step for each item. ... Say **"what do you need from me"** ..." | briefing; 0 records |
| s08 | "What do you need from me?" | `work-decide` | "I need two separate result decisions from you. First is **TV2-001** ... **Do you approve the TV2-001 three-bullet result?**" | briefing; 0 records |
| s08b | Hand move by Mike (drag TV2-002 back under TV2-001) | - | `ntn api v1/pages/<TV2-002> -X PATCH` with `"Parent item": {"relation": [{"id": "<TV2-001>"}]}` at 20:13:19 UTC. | - |
| s09 | "Approved, the TV2-001 brief looks good." | `work-decide`, `work-organize`, `memory-save` | Briefing: "Re-parented: TV2-002. Its parent is now TV2-001." Message: "The tracker shows TV2-002 is now a sub-item of TV2-001." `toolkit work approve TV2-001 --result --by "Mike Rihm"`, history note with his words, Roadmap Sub-items back to TV2-002, then asked for TV2-002's result. | briefing; 7 records |
| s10 | "Approved, TV2-002 looks good too. Ship it: there is no remote, so merge the README brief into main locally. I approve that merge. Then close both items out and clean up the worktrees." | `work-finish`, `merge-and-clean-up`, `work-on`, `work-decide`, `publish-docs`, `memory-save` | `toolkit work approve TV2-002 --result`; both items set to 12 with "No remote: merged locally into main at e9425dd."; `git merge --ff-only claude/tv2-002-add-quote` on `main`; both worktrees and branches removed; both set to 14 with a "No requirements or system-guide update" note; `toolkit work finish` for TV2-002 then TV2-001 -> "TV2-00x is Done."; focus cleared. | briefing; 20 records; Esc. 5 |
| s11 | "Do you remember how I like README sections written?" | `memory-find` | `toolkit memory find "README sections short bullet lists paragraphs"`, `toolkit memory get user_readme_bullet_lists` -> "Yes. You prefer README sections written as **short bullet lists**, not long paragraphs. That preference is recorded in project memory (`user_readme_bullet_lists`, confirmed September 27, 2026)." | briefing; 0 records |

## Hooks

- **SessionStart:** a "Project briefing: Toolkit V2 sample run c3 (safe to
  delete) (tv2-sample-run-c3), owner Mike Rihm ..." message in every session
  from s01 to s11 (`sessions/*.hooks.txt`). In s06 and s09 it carried the
  section "Changes found in the tracker since the last toolkit command ...
  - Re-parented: TV2-002 ...". The Notion check ran read-only and within its
  time limit both times.
- **UserPromptSubmit:** in s03 only, "The owner stated something to keep;
  memory-save records it, or work-on if it is a task." The session state
  holds `keep: "remember that"`, and the memory was saved in that turn.
- **PostToolUse:** records of every `toolkit work` and `toolkit memory`
  write (counts in the table). With the Notion tracker there is no work item
  file, so the file-edit validation branch had nothing to check. The agent
  ran `toolkit work validate` in every session that wrote to an item.
- **Stop:** the session-state file was written at the end of every turn, for
  example s11 at 20:23:13.690Z next to `task_complete` at 20:23:13.698Z, and
  s03 at 19:49:24.642Z next to 19:49:24.650Z. It never blocked a turn
  (`stopBlocked: false`).
- **PreToolUse:** no command was refused, and no toolkit command was joined
  to another with `&&`, `;`, or a pipe in this run, so the new chained-command
  note had nothing to fire on.

## The hand moves, step by step

1. 20:08:10 UTC: s05 ends. The tracker cache
   (`.git/toolkit-v2/notion/tracker.json`) holds TV2-002 with parent TV2-001.
2. 20:09:16 UTC: Mike's move out: TV2-002 "Parent item" set to empty
   (`sessions/s05b-hand-move-out-*.json`).
3. 20:09:24 UTC: s06 briefing: "Re-parented: TV2-002. Its parent is now none
   (top level)."
4. s06 `toolkit work decisions` printed "Tracker changes found ...
   Re-parented: TV2-002" and wrote one row on each item: TV2-002 "Parent
   changed in Notion by hand: TV2-001 -> none (top level).", TV2-001
   "Sub-item TV2-002 moved out in Notion by hand.". `toolkit work sync` then
   said "Nothing changed".
5. 20:13:19 UTC: Mike's move back: TV2-002 "Parent item" set to TV2-001
   (`sessions/s08b-hand-move-back-*.json`).
6. 20:13:24 UTC: s09 briefing: "Re-parented: TV2-002. Its parent is now
   TV2-001." Codex then started three toolkit commands at the same time
   (`work decisions`, `work show TV2-001`, `work lifecycle`). `work show
   TV2-001` printed "Tracker changes found ... Re-parented: TV2-002. Its
   parent is now TV2-001." and wrote TV2-002 "Parent changed in Notion by
   hand: none (top level) -> TV2-001." and TV2-001 "Sub-item TV2-002 moved
   here in Notion by hand (it was under none (top level))."; `work decisions`
   waited for the lock and found nothing new. Each row appears once
   (`final/TV2-001-WORK-ITEM.md`, `final/TV2-002-WORK-ITEM.md`), so the lock
   from fix c1 held under parallel commands.

## Fixes from the last round seen working

- c1, c2, c12: the Notion hand move no longer breaks reads or repeats rows;
  the briefing reports it; the parent gets a row; messages say "top level".
- a1, a6: setup made no work item, and its last line offered the commit.
- a3 (partly), b1, d7: once Mike asked for it done properly, requirements
  were written first, shown, and approved once; R-xx set to Finalized with
  the approval in the Decision record.
- a8, c13: toolkit commands ran alone; `--text` and `mktemp -d` folders were
  used in s01 to s11, and every `mktemp -d` folder was deleted.
- a10: `work new --covers R-04` inherited the parent's requirements approval;
  `work show TV2-002` says "Design: none of its own; TV2-001's design is
  approved (...). Read it with: toolkit work design TV2-001".
- a13, c9, c11, d11: stages 12 and 14 set with notes; Roadmap phases Done
  before finishing; `work show` says "Stage: Done"; "Resume here" says
  "Finished on 2026-09-27. Nothing to resume."
- a14: every history row has an "Effect on the work" value.
- b12: validate warned on the "None" Open Questions row in s02, and the agent
  removed it.
- d5: the memory record's Why is "Not stated by the owner."

## Bugs found

1. **High. `toolkit work approve --design` fails on a design whose header
   lines were written without Markdown line breaks, and leaves a half-written
   approval.** s05: the agent saved the design with `toolkit work design
   TV2-001 --text '...**Requirements:** TV2-001\n**Design status:**
   Proposed\n**Requirements checked:** ...'` (single newlines, no two trailing
   spaces). The save printed "Saved", but Notion joined the header into one
   paragraph: `work design TV2-001` then showed "**Requirements:** TV2-001
   **Design status:** Proposed **Requirements checked:** ...". Then
   `toolkit work approve TV2-001 --design --by 'Mike Rihm'` -> "Error: Saved
   but not verified: the design of TV2-001 does not read back as approved."
   twice. Cause: `DESIGN_STATUS_LINE_RE` in `lib/work/model.mjs` is anchored
   to the start of a line, so `setDesignStatusLine` cannot change a status
   line that is in the middle of a paragraph, and `designStatusFromBody`
   cannot read it; `setDesign` in `lib/notion/tracker.mjs` still wrote the
   item's "Design approved" property ("2026-09-27 by Mike Rihm") before the
   check failed, so the item said approved while the design said proposed.
   The agent got past it by writing "**Design status:** Approved" and
   "**Design approval:** Approved by Mike Rihm on 2026-09-27" into the design
   text itself: that save printed "Saved the design of TV2-001 (approved)",
   so the text alone made the design approved before the approve command
   ran. The history shows "Design updated (status approved)" twice before
   "Design approved by Mike Rihm". Because the parent's design was not
   approved when TV2-002 was made, TV2-002 started at 03 with "Continue with
   solution-design" instead of 06. Fix: in `setDesign`, put each
   `**Label:**` header line on its own line (hard break) before writing, and
   make the read-back compare line breaks in the header; match the status
   line anywhere in a line; write the "Design approved" property only after
   the design reads back approved; and have `work design --text/--set-file`
   keep the stored status (ignore or refuse "Design status: Approved" in the
   text) so only `approve --design` can approve.
2. **Medium. "New work" with no content from the owner was built without a
   question, as a `task`, skipping requirements and design.** s02: "New work:
   write a short project brief in README.md." The agent said "The README
   already explains how to run the script. I'll make it read as a short
   project brief, using the confirmed purpose and scope in `PROJECT.md`.",
   made TV2-001 as type `task`, ran `toolkit work set TV2-001 --stage
   07-tracking-setup --note "This is a small documentation task with a clear
   request; no requirements or design approval is required for type task."`
   (01 -> 07), wrote the brief, and asked for result approval. The item had
   no R-xx rows, so the new `work set` warning (an R-xx still Refining) did
   not fire, and the note counted as the reason for skipping the design.
   Mike had to reject it in s03. The round 2 fix text in `work-on` step 3,
   "content the owner has not described is a question for him, never a
   quick edit", was read as "make an item" and not as "ask first". Fix: in
   `work-on` step 3, say it directly: when the owner names a deliverable but
   not its content, add Q-01 and ask what it should say before any build;
   have `toolkit work set` warn on a jump past 03 when the Requirements
   section has no R-xx at all and the item was never approved, whatever the
   type.
3. **Medium. `solution-design` ran no design agents although `spawn_agent`
   was available.** s04: no `spawn_agent` call (checked in the Codex session
   log); no team proposed (step 3); the reply said "No independent design
   critique ran." `solution-design` step 9 allows doing the work alone "Only
   when the session has no `spawn_agent` tool", and `team-roles.md` says "A
   small design still gets one requirements analyst and one critic". Workers
   did run in other sessions: a requirements check in s03 and acceptance
   checks in s02 and s05, all with `fork_turns` set to `none`. Fix: make step 6
   say plainly that at least one `design-critic` worker runs for every
   design, even a small one, and that saying "no critique ran" is only for a
   session without `spawn_agent`.
4. **Medium. The decision list counts each result approval twice.** s05,
   s06, s07, s08, s09: "4 decisions wait on the owner" for two decisions,
   because each item had an Open Questions row asking for the result
   approval ("Q-03: Do you approve the TV2-001 three-bullet parent result at
   6216321 ...") and the stage 11 line ("TV2-001 is at 11 User approval: the
   owner reviews the result."). The s07 status reply had to explain it: "The
   tracker shows four decision entries because it lists both an open
   question and an approval step for each item." The round 2 fix (a4) folds
   only design questions (`isDesignQuestion` in `lib/work/decisions.mjs`).
   Fix: fold an open owner question that asks to approve the result (it
   names "result" or "approve" at stage 11) into the stage 11 line, as for
   the design; and say in `work-check` step 6 to add no Open Questions row
   for the result approval itself.
5. **Low. A worktree branch named with `wi-` for a `TV2` item is not tied
   to the item.** s02 ran `git worktree add .claude/worktrees/wi-001-readme-brief
   -b claude/wi-001-readme-brief` for TV2-001; s05 named the child's
   `claude/tv2-002-add-quote`. `itemIdFromBranch('claude/wi-001-readme-brief',
   'TV2')` in `lib/work/state.mjs` returns null, so a session opened in that
   worktree would be told the branch "names no work item". The conventions
   say "With another id prefix, use it in lower case (`acme-007-...`)", but
   `work-on` step 6, its Routing notes, and `work-finish` step 7
   (`git branch --list '*wi-<number>*'`) show only `wi-`. Fix: in those three
   places write `<prefix>-<number>` with the lower-case prefix example, or
   have `toolkit work show` print the branch name to use.
6. **Low. Setup wrote the current focus through a fixed `/tmp` file and left
   it.** s00: `python3 - <<'PY' ... Path('/tmp/tv2-c3-current-focus.md').write_text(...)`,
   then `toolkit memory focus --set-file /tmp/tv2-c3-current-focus.md`. The
   file (751 bytes) is still there. `project-setup` step 8 asks for an owner
   step in the current focus, but its header does not carry the `--text` /
   `mktemp -d` rule the work and memory skills now carry. The briefing line
   "The memory-save skill fills it with toolkit memory focus --set-file"
   also points at a file. Fix: add the rule to the `project-setup` header
   and name `toolkit memory focus --text` in step 8 and in that briefing
   line.
7. **Low. Task fields and design header lines lose their line breaks.**
   s06 and s09 rewrote the Tasks with `--text` on one line per task
   ("- [x] **P1-T01 — Write initial brief** · Done **Work:** ...
   **Deliverable:** ..."), and the final design has blank lines between
   header lines instead of the model's two-space breaks. Validate says
   "clean". The model's format has each field on its own line. Fix: have
   validate warn when a task line holds `**Work:**` or `**Deliverable:**`,
   and have `work edit --section Tasks` put each `**Field:**` on its own line.
8. **Low. Wording of the "moved here" row.** "Sub-item TV2-002 moved here in
   Notion by hand (it was under none (top level))." Fix: "(it was a
   top-level item)" when the old parent is none.
9. **Low. The setup commit reply ended with no next step.** s01 ended "No Git
   remote is configured, so the commit is local only." The conventions ask
   every reply to end with the one question or the words that continue.
   Fix: `project-setup` step 8 could give the line to use after the commit,
   "Tell me the first thing you want built."

Not counted as bugs:

- The project row's Status in the Projects database is empty (already in
  PROGRESS.md "Pending fixes").
- `toolkit doctor` warns "Codex does not trust this folder" and "hooks are
  not trusted", because this run passed trust per run (`-c projects=...`) and
  used `--dangerously-bypass-hook-trust`.
- The declined first draft `e8c9796` is in `main`'s history; the final
  README is the approved text.

## Files in this folder

| File | What it is |
| --- | --- |
| `final/TV2-001-WORK-ITEM.md`, `final/TV2-002-WORK-ITEM.md` | `toolkit work show` after the run: the Notion item bodies in the `WORK-ITEM.md` format |
| `final/TV2-001-DESIGN.md` | `toolkit work design TV2-001` (the Solution Design page) |
| `final/tracker-final.txt` | `toolkit work list --all --tree`, `validate`, `sync`, `decisions`, `next` |
| `final/memory-listing.txt` | `toolkit memory list --status all`, `get`, `focus`, `status` |
| `final/notion-readback.txt` | Notion API read of the project row, the Work Items database, and the Memory database |
| `final/project-file-tree.txt` | Project files, Git log, branches, worktrees, and the `.git/toolkit-v2` cache |
| `final/final-README.md`, `final/toolkit.json` | The README on `main` at `e9425dd`, and `.toolkit.json` |
| `final/brief-final.txt`, `final/doctor-final.txt` | `toolkit brief` and `toolkit doctor` after the run |
| `sessions/index.txt` | Start, end, exit, thread id, and extra arguments of each session |
| `sessions/sNN-*.prompt.txt` | Mike's exact prompt |
| `sessions/sNN-*.summary.txt` | Hook messages, skills opened, escalation requests, every command with its output, and the agent's messages |
| `sessions/sNN-*.hooks.txt` | The full hook messages Codex added |
| `sessions/sNN-*.hookstate.json` | The hook session-state file |
| `sessions/sNN-*.jsonl.gz` | The `codex exec --json` output |
| `sessions/s05b-hand-move-out-*`, `sessions/s08b-hand-move-back-*` | The Notion page before each move, the PATCH response, and the time |
| `round1/`, `round2/` | Earlier rounds, unchanged |

Full Codex session logs stay in `<scratchpad>/runs/c-notion-r3-logs/`
(`*.rollout.jsonl`) and in `~/.codex/sessions/2026/09/27/`.

## Changes outside the toolkit-v2 repository

- Notion, under Mike's real "AI Agent Second Brain" page: a new Projects row
  "Toolkit V2 sample run c3 (safe to delete)" (Key `tv2-sample-run-c3`) with
  its Work Items database (TV2-1, TV2-2, one Solution Design page), its
  Memory database (one record), and "Current focus" and "Terminology
  glossary" pages. The ID prefix `TV2` is now taken in the workspace. The
  tester changed TV2-002's "Parent item" twice through the API.
- Scratch folder `<scratchpad>/runs/`: the project `c-notion-r3`, its logs
  `c-notion-r3-logs`, the config folder `c-notion-r3-config`, the prompts
  `c3-prompts`, and the scripts `c3-*`.
- `~/.codex/sessions/2026/09/27/`: Codex session logs for s00 to s11.
- `~/.codex/plugins/data/toolkit-toolkit-v2/sessions/`: hook state files for
  s00 to s11.
- `/tmp/tv2-c3-current-focus.md`, left by s00 (bug 6).
- Not changed by this run: `~/.codex/config.toml` (trust passed per run with
  `-c`) and `~/.config/toolkit-v2/`.

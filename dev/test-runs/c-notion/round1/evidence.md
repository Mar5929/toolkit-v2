# Sample run c: Notion tracker and Notion memory, round 1

Run on 2026-09-27 between 00:50 and 15:07 UTC (the Mac slept between session 00 and session 01).
Every session is a real `codex exec` session (codex-cli 0.157.0, model `gpt-6-sol`,
Mike's default reasoning effort), started fresh, with the agent playing the
project's agent and this run playing Mike.

## Result

- The work item "Write a short project brief in README.md" went from
  `01-discovery` to Done in Notion, with one sub-item made by splitting it.
  Both items are Done, with requirements, design, and result approvals
  recorded in Mike's words.
- The preference "I prefer README sections written as short bullet lists" was
  saved to the Notion Memory database in session 03 and found by a fresh
  session in session 13.
- "Where are we?" (session 08) opened `work-status`. "What do you need from me?"
  (session 09) opened `work-decide`.
- The hand move in Notion was noticed by the next session, but only because
  the agent read "Parent: none" in `toolkit work show`. The toolkit itself did
  not detect it: the briefing never reports Notion moves, and
  `toolkit work sync` said "Nothing changed" after the move (bug 5).
- Setup could not be driven through Codex alone (bugs 1 and 2), and the agent
  could not commit because the Codex sandbox makes `.git` read only (bug 6).
  Both needed a manual step by "Mike".

Verdict: not passed. The item reached Done correctly, and memory, status, and
decisions worked, but the toolkit did not detect the Notion hand move, and
setup and the commit needed manual steps outside Codex.

## Setup of the run

| What | Value |
| --- | --- |
| Project folder | `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/c-notion-r1` (git repo, first commit `ae840d0` holds `quote.js` and `.gitignore`) |
| Codex command | `codex exec --json --dangerously-bypass-hook-trust --sandbox workspace-write -c 'projects={"<project>"={trust_level="trusted"}}' -C <project> "<prompt>" < /dev/null` |
| Environment | `TOOLKIT_V2_CONFIG_DIR=<scratchpad>/runs/c-notion-r1-config`, so Mike's `~/.config/toolkit-v2` was not changed |
| Notion root | The private test page "Toolkit V2 Notion test area (safe to delete)" (`3e7b381d-a176-81ad-ad1c-eb0f8ab22d09`). Mike's real "AI Agent Second Brain" page is still archived (`is_archived: true`, last edited 2026-09-26 22:41 UTC, checked again at 14:14 UTC), so `ensure-root` refuses it and no row could be made under it. The sample-project row from the Notion step does not exist, because that step was blocked. |
| Raw logs | `<scratchpad>/runs/c-notion-r1-logs/` (JSONL, prompts, summaries). Copies are in `sessions/` here: `NN-name.prompt.txt`, `NN-name.summary.md`, `NN-name.jsonl.gz`. |

## Notion links

| What | Link |
| --- | --- |
| Project row and page | https://app.notion.com/p/Toolkit-V2-sample-run-c-safe-to-delete-3e8b381da17681a9a13fce2908589d74 |
| Work Items database | https://app.notion.com/p/0217d631f1cf44aabcb0b9486520af57 |
| Work Items board view | https://app.notion.com/p/0217d631f1cf44aabcb0b9486520af57?v=3e8b381da17681e6b080000c0c60c2b2 |
| TVSRC-001 (parent) | https://app.notion.com/p/Write-a-short-quote-script-project-brief-in-README-md-3e8b381da1768106a024d7cb6aa8840f |
| TVSRC-001 Solution Design subpage | https://app.notion.com/p/TVSRC-001-Write-a-short-quote-script-project-brief-in-README-md-solution-design-3e8b381da176811cb3c5ccd0c2584d90 |
| TVSRC-002 (sub-item) | https://app.notion.com/p/Add-a-quote-section-to-README-md-3e8b381da1768168a7b6d445f61cf862 |
| Memory database | https://app.notion.com/p/b94a9682dc634757b27c9dc4a3901e52 |
| Memory record | https://app.notion.com/p/user_readme_bullet_sections-3e8b381da17681f88375c58f032238ab |

Notion API read-back after session 13:

```text
TVSRC-2 | Add a quote section to README.md | Stage 11-user-approval | Status Done | parent ['3e8b381d-a176-8106-a024-d7cb6aa8840f'] | subs []
TVSRC-1 | Write a short quote script project brief in README.md | Stage 11-user-approval | Status Done | parent [] | subs ['3e8b381d-a176-8168-a7b6-d445f61cf862']
memory row: user_readme_bullet_sections
```

## Timeline

"Briefing" means the SessionStart hook put "Project briefing: ..." into the
session (a `hooks.additional_context` developer message in the Codex session
log). "Hook records" is the number of toolkit writes the PostToolUse hook
recorded in the session-state file
(`~/.codex/plugins/data/toolkit-toolkit-v2/sessions/<thread>.json`); the Stop
hook updated the same file at the end of each turn.

| # | Prompt (Mike) | Skills opened | Main toolkit commands | Outcome | Hooks |
| --- | --- | --- | --- | --- | --- |
| 00 | "Set up this project with the toolkit. My answers ... Track work in Notion. Keep memory in Notion. ..." | `project-init` (claude-toolkit), `knowledge-setup`, `work`, `knowledge-save` | none | Wrong toolkit. The V2 plugins are off until a project's `.codex/config.toml` turns them on, so Codex used the old `project-init`, wrote the old scaffold (`docs/`, `.claude/RULES.md`, `.toolkit-notion.json`), and hand-built Notion databases through the Notion connector. Files saved in `attempt0-old-toolkit-file-tree.txt`; repo reset afterwards. | no V2 hooks |
| 01 | Same answers, "Set up this project with Toolkit V2" (run with `toolkit@toolkit-v2` switched on and sandbox network on for this run only) | `project-init` first, then `project-setup`, `memory-save` | `toolkit notion ensure-root --check`, `toolkit init ... --hosts claude-code,codex` (EPERM on `.codex/`), then `toolkit init ... --hosts claude-code`, `toolkit notion ensure-project --check`, `toolkit memory focus --set-file`, `toolkit doctor` | Project row, Work Items and Memory databases made. The agent dropped the Codex host to get past the sandbox. | no project yet at start |
| 01b | Manual, as Mike approving the out-of-sandbox write | - | `toolkit config set hosts claude-code,codex` (output in `sessions/01b-manual-hosts-codex.txt`) | Added `.codex/config.toml` and `.codex/rules/toolkit.rules`, and re-added the `SOUL.md` Mike declined. Mike deleted `SOUL.md` and committed the setup as `65ccb48`. | - |
| 02 | "New work: write a short project brief in README.md. ..." | `work-on`, `work-requirements` | `toolkit work new --title "Write a short quote script project brief in README.md" --type task --stage 01-discovery`, `edit`, `set --stage 02-refinement`, `set --waiting-on owner`, `validate` | TVSRC-001 created; one question for Mike (the audience). | briefing; 9 records |
| 03 | "... it's for people new to Node who clone the repo ... Also, remember that I prefer README sections written as short bullet lists ..." | `work-requirements`, `work-decide`, `memory-save`, `work-on` | `toolkit memory find`, `toolkit memory save --type user --name readme-bullet-sections ... --approved-by 'Mike Rihm'`, `work edit` x4, `work validate` | Memory saved: "Saved to memory: user_readme_bullet_sections (new record). Where: the Notion Memory database". A native Codex worker ran the requirements check. Asked "Do you approve these requirements?" | briefing; keep-phrase line; 6 records; `keep: "remember that"` |
| 04 | "Approved. Next, how should we build this? Give me a couple of design options ..." | `work-on`, `solution-design`, `work-requirements`, `work-decide` | `toolkit work approve TVSRC-001 --requirements --by 'Mike Rihm'`, `work set --stage 04-solution-design`, `work design --create`, `work design --set-file ... --status proposed` | Options A and B; asked "A or B". No architect or critic worker ran (bug 10). | briefing; 13 records |
| 05 | "Go with option A. Then split the work: make the new "Add a quote" section its own sub-item ..." | `work-decide`, `work-organize`, `work-on`, `work-requirements`, `publish-docs`, `memory-save` | `toolkit work sync`, `work set --stage 05-breakdown`, `toolkit work new --title 'Add a quote section to README.md' --type task --parent TVSRC-001`, `work approve TVSRC-001 --design`, `work set --stage 06-implementation-plan` | TVSRC-002 created as a sub-item: "Created TVSRC-002 ... (01 Discovery, Backlog, sub-item of TVSRC-001)". Asked Mike to approve the sub-item's own requirements. | briefing; 30 records |
| 05b | Hand move by Mike in Notion (API, same effect as dragging the card out) | - | `PATCH v1/pages/<TVSRC-002>` with `"Parent item": {"relation": []}` at 14:44:27 UTC | TVSRC-002 became a top-level card. | - |
| 06 | "Approved. Keep going." | `work-on`, `work-decide`, `publish-docs`, `work-requirements`, `work-check`, `memory-save` | `work approve TVSRC-002 --requirements`, `work set --stage 08-build` (both), `work set --stage 09-testing`, `work set --stage 11-user-approval --waiting-on owner` | Briefing still listed the board "from 2026-09-27T14:43:20.518Z", before the move, with no moved-items section. The agent noticed from `toolkit work show TVSRC-002` ("Parent: none"): "I also found that TVSRC-002 is now a top-level Notion card; I'll leave that owner-side change intact". README built on `main` (no item branch: `.git` is read only). Acceptance check by a native Codex worker. | briefing; 23 records |
| 07 | "... I dragged the "Add a quote" card out from under the README brief item by mistake. Put it back ..." | `work-organize` | `toolkit work sync` -> "Nothing changed: every item is where the tracker expected it", `toolkit work move TVSRC-002 --under TVSRC-001` -> "Moved TVSRC-002 and its true nested items from root to TVSRC-001.", history notes, `work validate` | Sub-item restored under TVSRC-001. | briefing; 9 records |
| 08 | "Where are we?" | `work-status` | `toolkit memory focus`, `work list --tree`, `work decisions`, `work next` | "Two README work items are in progress, and both are at user approval ... Say "what do you need from me" to go through the decisions." It reported "5 pending decision prompts" for 2 real approvals (bug 7). | briefing; 0 records (read only) |
| 09 | "What do you need from me?" | `work-decide` | `toolkit work decisions`, `work show` x2 | One decision at a time: "First: TVSRC-001 ... Do you approve those two sections, or want a change?" | briefing; 0 records |
| 10 | "Approved. I also read the "Add a quote" section ... and I approve that result too." | `work-decide`, `work-finish`, `publish-docs`, `memory-save` | `toolkit work approve TVSRC-001 --result`, `toolkit work approve TVSRC-002 --result`, history notes with Mike's words, `memory focus --set-file` | Both result approvals recorded. | briefing; 11 records |
| 11 | "This project has no remote, so no pull request. Commit the README change to main locally, then close both items out ..." | `work-finish`, `publish-docs`, `work-on` | `git add -- README.md` failed: cannot create `.git/index.lock` (Operation not permitted) | Items kept open and the blocker recorded. Mike committed `789c45b` himself (`sessions/11b-manual-commit.txt`). | briefing; 6 records |
| 12 | "I committed the README change myself on main (commit 789c45b). Now close both items out and mark them done." | `work-on`, `work-finish`, `memory-save`, `publish-docs` | `toolkit work finish TVSRC-002 --by "Mike Rihm" --evidence "..."` -> "TVSRC-002 is Done.", then the same for TVSRC-001, `memory focus --set-file` | Both Done, child first. | briefing; 9 records |
| 13 | "Do you remember how I like README sections written?" | `memory-find` | `toolkit memory find 'README sections'`, `toolkit memory get user_readme_bullet_sections` | "Yes. You prefer README sections as short bullet lists, rather than long paragraphs ... (Project memory: user_readme_bullet_sections, verified September 27, 2026.)" | briefing; 0 records |

Every required work skill ran: `work-on` (02), `work-requirements` (02, 03),
`solution-design` (04), `work-organize` (05, 07), `work-check` (06),
`work-decide` (03, 05, 09, 10), `work-finish` (10, 11, 12). Also `work-status`
(08), `memory-save` (03), and `memory-find` (13).

Post-edit validation: with the Notion tracker no work item file is edited, so
the file-edit branch of the PostToolUse hook has nothing to check. The hook
recorded every `toolkit work` and `toolkit memory` write (counts above), and
the agent ran `toolkit work validate` after its edits in every writing session
("Checked 2 items: 2 clean, 0 errors, 0 questions for the owner.").

## The hand move, step by step

1. 14:43:20 UTC: session 05 ends; the local copy of the board has TVSRC-002
   under TVSRC-001.
2. 14:44:27 UTC: Mike's move (`sessions/05b-hand-move-out.txt`): Parent item
   of TVSRC-002 set to empty.
3. 14:44:36 UTC: session 06 briefing: "Items: 1 in progress, 1 in the backlog.
   (Local copy of the Notion board from 2026-09-27T14:43:20.518Z.)" No
   "Changes found in the tracker" section.
4. Session 06 ran `toolkit work show TVSRC-002` and `TVSRC-001` before any
   sync. Those reads overwrote the cached parent (`remember()` in
   `lib/notion/tracker.mjs`), so `.git/toolkit-v2/notion/tracker.json` then
   held `"parent": "none"` for TVSRC-002.
5. No history row on TVSRC-002 records the owner's move
   (`TVSRC-002-WORK-ITEM.md`, Recent History).
6. Session 07's first command, `toolkit work sync`, printed "Nothing changed:
   every item is where the tracker expected it, and every derived value is in
   step."

## Files in this folder

| File | What it is |
| --- | --- |
| `TVSRC-001-WORK-ITEM.md`, `TVSRC-002-WORK-ITEM.md` | Final `toolkit work show` output: the Notion item bodies in the WORK-ITEM.md format |
| `TVSRC-001-DESIGN.md` | Final `toolkit work design TVSRC-001` (the Solution Design subpage) |
| `tracker-final.txt` | `toolkit work list --all --tree`, `validate`, `sync`, `decisions` after the run |
| `memory-listing.txt` | `toolkit memory list --status all`, `get`, `focus`, `status` |
| `project-file-tree.txt` | Project files, git log, and the `.git/toolkit-v2` cache files |
| `final-README.md` | The README at commit `789c45b` |
| `attempt0-old-toolkit-file-tree.txt` | What session 00 wrote with the old toolkit |
| `sessions/` | Prompts, readable summaries, and gzipped `codex exec --json` output for sessions 00 to 13, plus the three manual steps |

## Bugs found

1. **Codex cannot reach `project-setup` in a new project.** Session 00:
   "I'm using the project-init skill to set up the repo with your choices"; it
   read `~/.codex/plugins/cache/claude-toolkit/project-init/0.84.2/skills/project-init/SKILL.md`,
   wrote the old scaffold, and made Notion databases by hand through the
   Notion connector (prefix `TKC`). Even with `toolkit@toolkit-v2` switched on
   (session 01) the agent opened the old `project-init` first. Fix: say in
   `project-setup` and the Codex install notes that a new project is set up
   from a terminal with `toolkit init` (or keep only `toolkit@toolkit-v2`
   switched on machine-wide, with hooks that do nothing outside a V2
   project); and word the `project-setup` description with "Toolkit V2" and
   "initialize" so it wins over `project-init`.
2. **`toolkit init` in a Codex session fails on `.codex/`, and the agent
   dropped the Codex host.** Session 01: `"Could not write .../.codex/config.toml:
   EPERM: operation not permitted, mkdir '.../.codex'"`. The agent then ran
   `toolkit init ... --hosts claude-code`, leaving a project that Codex itself
   cannot use, and reported "the project is configured for Claude Code only".
   The rule that lets `toolkit` run outside the sandbox is one of the files
   init writes, so it cannot help the first run. Fix: `project-setup` must say
   "never drop a host to get past the sandbox; stop and ask the owner to run
   `toolkit init` in a terminal (or approve the command outside the sandbox)";
   init could refuse `--hosts` without `codex` when it runs inside Codex
   (`CODEX_*` environment) with a message that says this.
3. **A re-run of init after a partial failure treats its own files as the
   owner's.** After session 01, `.toolkit.json` `installed` lists only 3
   files. `toolkit doctor` and sync list 20 files as "Changed by the project,
   left alone ... the project had this file before the toolkit; the toolkit
   version was not installed" (`sessions/01b-manual-hosts-codex.txt`). Future
   toolkit updates will skip them. Fix: write the `installed` hashes as each
   file is written, or on a re-run adopt a file whose content equals the
   rendered template.
4. **A declined `SOUL.md` comes back.** `project-setup` step 5 removes
   `SOUL.md` when the owner says no, but doctor then reports a problem, "1
   scaffold file is missing: SOUL.md. Fix: Run toolkit sync", and
   `toolkit config set hosts` (which runs sync) added it again. The agent had
   to write "do not restore one to satisfy a scaffold check" into
   `AGENTS.md`. Fix: record the owner's no in `.toolkit.json` (for example
   `"declined": ["SOUL.md"]`) and have doctor and sync respect it.
5. **Notion hand moves are not detected.** Evidence in "The hand move, step by
   step". Causes: `notionWork()` in `lib/project/brief.mjs` always returns
   `reportLines: []` and reads only the cached board unless the cache is
   empty; and `remember()` in `lib/notion/tracker.mjs`, called by every
   `list`, `get`, and update, overwrites the cached `parent`, which is what
   `syncOne()` compares against. Fix: compare the live parent with
   `written.parent` (the value the toolkit last wrote) instead of the last
   read; run a quick live sync (2-second deadline) in the session-start hook
   for Notion and show `report.moves` in the briefing; write a history row on
   the item ("Parent changed in Notion by hand: TVSRC-001 -> none").
6. **Codex cannot commit, branch, or make worktrees.** The workspace-write
   sandbox makes `.git` read only. Session 06 built on `main` ("Git metadata
   is read-only here"), and session 11 failed: "`git add -- README.md` failed
   because this checkout cannot create `.git/index.lock` (`Operation not
   permitted`)". `work-on` step 7 (item branch and worktree) and `work-finish`
   step 2 cannot run in Codex. Fix: add prefix rules for the Git commands the
   skills need (`git add`, `git commit`, `git switch`, `git worktree add`,
   `git merge`, `git push`) to `.codex/rules/toolkit.rules`, or have the skills
   hand the owner the exact commands at the start of the build.
7. **`toolkit work decisions` counts one approval twice.** Session 08: "5
   decisions wait on the owner" for two result approvals and one delivery
   offer. Each item at stage 11 lists both "is waiting on the owner (11 User
   approval)" and "is at 11 User approval: the owner reviews the result".
   Fix: one entry per item and gate.
8. **The delivery offer shows up at result approval.** Session 08: "The
   agent-led delivery offer has not been made for TVSRC-001 (it has 1
   sub-item)". The offer belongs at the start of a goal. Fix: stop listing it
   after stage 04, or for `task` items.
9. **Template guide comments stay in Notion items.** Both Done items still
   hold "Fill-in guide for a new local work item: create it with
   `toolkit work new`, which copies this folder, names the new folder ... keep
   the file name WORK-ITEM.md" and the Recent History guide. The guide talks
   about folders that do not exist in Notion. Fix: remove the guide comments
   when the Notion item is created, or have `toolkit work validate` flag
   guides left on an item past stage 02.
10. **`solution-design` ran no architect or critic, and did not say so.**
    Session 04 read `design-architect.md` and `design-critic.md` but started no
    worker (0 SubAgentActivity), while sessions 03 and 06 did start workers.
    The skill says to say plainly when no independent check ran. Fix: make
    the Codex step explicit ("start one native worker per option with the
    agent file's text"), and say it in the reply when skipped.
11. **Temporary files left behind.** About 35 files such as
    `/private/tmp/tvsrc-001-requirements.md`, `/private/tmp/tvsrc-child-tasks.md`,
    and folder `/private/tmp/tvsrc-closeout-20260927/` remain from
    `--set-file` and `--body-file`. Fix: accept `--set-file -` on stdin in the
    skill examples, or tell the agent to delete the file after the command.
12. **Relative reference paths are guessed wrong in Codex.** Sessions 06, 09,
    11, 12 tried `~/.codex/plugins/cache/toolkit-v2/references/conventions.md`
    and `.../work/0.2.0/skills/references/closing.md` (not found) before the
    right path. Fix: in each SKILL.md, name reference files from the plugin
    root ("the work plugin's `references/conventions.md`").
13. **The briefing warns about trust that is in place.** Session 06 briefing:
    "Codex does not trust this folder" and "The Toolkit V2 hooks are not
    trusted in Codex yet, so Codex skips them (no briefing ...)", inside a
    briefing the hook delivered in a trusted session. (The trust came from a
    per-run `-c projects=...` override, which doctor does not read.) Already
    reported in `codex-setup.md` finding 2.
14. **Small wording and format issues.** `toolkit work move` printed "Moved
    TVSRC-002 and its true nested items from root to TVSRC-001" ("true nested
    items" is unclear). Done items list as "(11 User approval, Done)". The
    agent renamed the item to "Write a short quote script project brief in
    README.md" without saying so. The id prefix `TVSRC` was chosen by init
    (because `WI` is taken in the test area) without the one-line
    confirmation the interview asks for. The sub-item needed its own
    requirements approval even though it only split the parent's approved
    R-01 and R-02, which cost Mike one extra "Approved".

## Changes outside the toolkit-v2 repository

- Notion test area (private page "Toolkit V2 Notion test area (safe to
  delete)"): session 00 made the row "Toolkit V2 sample run c - old toolkit
  attempt 0 (safe to delete)" (renamed by this run; key
  `toolkit-v2-sample-run-c-attempt0-old`) with a "Work Items" database (prefix
  TKC), a "Memory" database with one record "project-overview", and "Current
  focus" and glossary pages, all through Mike's Notion connector in Codex.
  Session 01 onwards made the row "Toolkit V2 sample run c (safe to delete)"
  with its Work Items database (TVSRC-001, TVSRC-002, one Solution Design
  page) and Memory database (one record, Current focus, Terminology glossary).
  Mike's real "AI Agent Second Brain" page was not touched.
- `/private/tmp/toolkit-v2-run-c/` made by the session 01 agent (its own
  `notion.json`, `plugin-root`, a copy of `.toolkit.json`, a focus file), and
  about 35 `/private/tmp/tvsrc-*` temporary files from later sessions.
- `~/.codex/sessions/2026/09/27/` and `2026/09/26/`: Codex session logs for the 14 sessions.
- `~/.codex/plugins/data/toolkit-toolkit-v2/sessions/`: hook session-state
  files for sessions 02 to 13.
- `~/.codex/config.toml` was not changed: trust was passed per run with `-c`.
  `~/.config/toolkit-v2/` was not changed: `TOOLKIT_V2_CONFIG_DIR` pointed at
  the scratch folder.

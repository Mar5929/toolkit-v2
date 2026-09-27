# Sample run d: local tracker and local Hindsight memory (round 1)

Run on 2026-09-26 (evening) and 2026-09-27 (morning), in real `codex exec`
sessions (codex-cli 0.157.0, model `gpt-6-sol`, Mike's own Codex config).
Toolkit V2 version 0.2.0, the Codex plugin cache matched the source folder
byte for byte before the run.

## Result

The work item reached Done with every gate recorded in the owner's words.

- WI-001 "Add --shout flag to greet CLI" (type build) went from
  `01-discovery` to Done. WI-002 "Add --help option listing every flag" was
  split out as its sub-item and also reached Done.
- The sub-item folder was renamed by hand and its parent moved into a group
  folder between sessions 09 and 10. The next session found both items at
  their new paths and carried on. The briefing reported the parent's move
  but not the sub-item's rename (bug 10).
- A preference ("I prefer every command-line flag to be documented in the
  README") was saved to the Hindsight bank in session 05, found and applied
  in session 09, and quoted back in session 19. `toolkit memory find
  --reflect` answered from Hindsight in 26.8 seconds.
- "Where are we?" opened `work-status`. "What do you need from me?" opened
  `work-decide`, which asked one decision at a time.
- The SessionStart briefing arrived in all 16 sessions after setup. The
  UserPromptSubmit keep-phrase line fired on "remember that". PostToolUse
  recorded every `toolkit` write and validated each direct edit of a
  work-item file. Stop ran every turn and never blocked.

Setup did not work the way a solo developer would try it first (bugs 1 to
3): in a fresh repository Codex opened the old claude-toolkit `project-init`
skill, and `toolkit init` cannot run inside the Codex sandbox. Setup finished
only after the toolkit plugin was turned on for that one run and sandbox
escalations were routed to Codex's automatic reviewer.

## How the sessions were run

Project folder (a Git repository with one initial commit: `bin/greet.mjs`,
`test/greet.test.mjs`, `package.json`, `README.md`):
`/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/d-local-hindsight-r1`

Every session was a fresh `codex exec`:

```sh
codex exec --json --dangerously-bypass-hook-trust \
  -c 'projects={"<project>"={trust_level="trusted"}}' \
  <sandbox choice> -C <project> -o <last-message file> "<prompt>" < /dev/null
```

- Folder trust came from the `-c projects=...` override, so
  `~/.codex/config.toml` was not changed. Because of that, `toolkit doctor`
  always warns "Codex does not trust this folder". That warning is caused by
  the test method, not by the toolkit.
- Sandbox choice: `--sandbox workspace-write` for most sessions.
  `--approve-for-me` (Codex's automatic reviewer answers sandbox escalation
  requests, standing in for Mike clicking "approve") for setup attempt 03 and
  sessions 14 to 18, which needed Git writes. Codex makes `.git` read-only in
  the workspace-write sandbox (bug 9).
- Setup sessions 02 and 03 also passed
  `-c plugins.toolkit@toolkit-v2.enabled=true`, because the V2 plugins are
  off for the whole computer until `toolkit init` writes the project's
  `.codex/config.toml` (bug 1). No later session used it.
- Raw JSON events, Codex session logs, and hook state files are in the
  scratch folder `.../scratchpad/runs/d-evidence/` (temporary). The readable
  transcript of each session is in `sessions/` here: the exact prompt, every
  agent message, every command with its output (skill and reference text is
  not repeated), the skills opened, the `toolkit` commands, the hook context
  from the Codex session log, and the hook session state.

## Timeline

| # | Prompt (Mike) | Skills opened | What happened |
| --- | --- | --- | --- |
| 01 | "Set up this project with the toolkit. My answers: project name Greet CLI Sample D, key greet-cli-sample-d, owner Mike. Track work items in local folders. Memory in local Hindsight. It is not a Salesforce project. ..." | claude-toolkit `project-sync`, `project-init`, `knowledge-setup`, `work` | Wrong toolkit. Codex saw only the claude-toolkit skills. The agent ran `claude plugin marketplace update claude-toolkit` (allowed by Mike's own Codex rules). Stopped by me after 56 seconds; the project was unchanged. |
| 02 | Same prompt, toolkit plugin on for this run | `project-setup` | `toolkit init ... --memory hindsight` failed: Hindsight "did not answer (EPERM ...)". The agent then ran init with `--memory builtin` (failed writing `.codex/`, after writing 25 files), then with `--hosts claude-code`, then `toolkit config set memory.type hindsight`, and deleted `SOUL.md` and `.memory/`. It ended "partly set up". State saved, project reset to the initial commit. |
| 03 | Same prompt plus "Skip SOUL.md", toolkit plugin on, `--approve-for-me` | `project-setup` | 7 escalation requests approved. `toolkit init --name "Greet CLI Sample D" --key greet-cli-sample-d --tracker local --memory hindsight --owner "Mike"` added 28 files and created bank `greet-cli-sample-d`. Guides filled, `SOUL.md` removed. Doctor: 1 problem (the missing `SOUL.md`, bug 7). |
| 04 | "I want to add a --shout flag to the greet CLI, so it prints the greeting in capital letters. Please track it as a work item and ask me what you need to pin down the requirements." | `work-on`, `work-requirements` | `toolkit work new --title "Add --shout flag to greet CLI" --type build --stage 01-discovery` -> WI-001, Starting request saved, stage 02, Q-01 asked with a recommendation, waiting on owner. |
| 05 | "Yes, capitalize the whole greeting, including the name: HELLO, MIKE! Also, remember that I prefer every command-line flag to be documented in the README." | `work-decide`, `memory-save`, `work-requirements` | Keep-phrase hook fired. `toolkit memory save --type user --name document-cli-flags-in-readme ... --approved-by Mike` -> "Saved to memory: user_document_cli_flags_in_readme (new record). Where: Hindsight bank greet-cli-sample-d". R-02 (README documents the flag) added. Q-02 asked. |
| 06 | "Yes, both positions should work the same." | `work-decide`, `work-requirements`, `work-on` | Q-02 recorded. A native Codex sub-agent (`requirements_check`) ran the spec check and found a gap; Q-03 asked. |
| 07 | "Yes, keep the normal greetings exactly as they are." | `work-decide`, `work-on`, `work-requirements` | Q-03 recorded, second spec check (sub-agent) clean, "Do you approve these requirements?" |
| 08 | "Approved." | `work-decide`, `work-on`, `work-requirements`, `work-check`, `memory-save` | R-01 and R-02 Finalized, `toolkit work approve WI-001 --requirements --by Mike`, history "Owner's words: Approved." Design skipped with a recorded reason. Plan, build in worktree `.claude/worktrees/wi-001-shout`, 5 tests pass, `acceptance_checker` sub-agent found both requirements met, stage 11, waiting on owner. `git add` failed in the sandbox (bug 9). |
| 09 | "Before I approve WI-001: I also want a --help option that lists every flag, including --shout. Split that out as a sub-item under WI-001. WI-001 is not done until that sub-item is done." | `work-on`, `work-organize`, `work-requirements`, `memory-save` | WI-001 set to `05-breakdown`, `toolkit work new --title 'Add --help option listing every flag' --type build --parent WI-001` -> WI-002 nested in WI-001's folder. The agent ran `toolkit memory find 'CLI flags help README'`, found the saved preference, and put README documentation into WI-002's requirements. WI-001 back to 08. Q-01 for WI-002 asked. |
| hand move | (Mike in Finder, between 09 and 10) | none | Renamed `WI-001-add-shout-flag-to-greet-cli/WI-002-add-help-option-listing-every-flag` to `.../help-option`, then made group folder `cli-options/` and moved `WI-001-add-shout-flag-to-greet-cli/` into it. Exact commands: `final/hand-move.txt`. |
| 10 | "Where are we?" | `work-status` | The briefing said "Moved: WI-001 from .work-items/WI-001-add-shout-flag-to-greet-cli/WORK-ITEM.md to .work-items/cli-options/WI-001-add-shout-flag-to-greet-cli/WORK-ITEM.md." The answer listed the decisions first, then "WI-001's folder was moved under cli-options; the tracker found it." WI-002's rename was not mentioned (bug 10). Changed nothing. |
| 11 | "What do you need from me?" | `work-decide`, `work-delegate` | "First, I need your decision on WI-002: when --help is used with a name or --shout, should it print help instead of a greeting? I recommend yes." One decision only. |
| 12 | "Yes, --help wins in any position." | `work-on`, `work-decide`, `work-requirements` | Answer recorded in WI-002 at its new path; "Do you approve these WI-002 requirements?" |
| 13 | "Approved. Before you build it, give me design options for how the CLI should read its flags now that there are two." | `work-on`, `work-decide`, `solution-design`, `work-requirements`, `memory-save` | `toolkit work approve WI-002 --requirements --by Mike`, stage 04, `toolkit work design WI-002 --create`, design saved as proposed with Option A (extend the current checks) and Option B (Node `parseArgs`), recommendation A. `DESIGN.md` was created in the renamed folder `cli-options/WI-001-.../help-option/`. "No independent design critique ran." |
| 14 | "Go with option A." | `work-decide`, `work-on`, `solution-design`, `work-delegate`, `work-check`, `memory-save` | `toolkit work approve WI-002 --design --by Mike`, history "Owner's words: Go with option A.", build in worktree `wi-002-help` (commits `e4bb6c0`, `d683ebb`, `cfe7b8d`), 6 tests pass, checker sub-agent `wi002_checker` found both requirements met, stage 11. |
| 15 | "Approved." | `work-decide`, `work-finish`, `memory-save` | `toolkit work approve WI-002 --result --by Mike`. "Your approval of the result does not authorize a merge." |
| 16 | "Ship WI-002. There is no GitHub remote for this project, so merge it into main locally." | `work-finish`, `work-on` | Merge-safety check stopped the merge: `main` still had the setup's uncommitted `README.md` edit (bug 8). Q-03 asked. |
| 17 | "Yes, replace it and merge. And please commit the toolkit setup files that are still uncommitted on main, so main is clean." | `work-on`, `work-decide`, `work-finish`, `publish-docs`, `merge-and-clean-up`, `work-check`, `memory-save`, `project-setup` | Setup committed (`b269b59`, 26 files, named paths), `wi-002-help` merged (`9c83b89`), requirements baseline `requirements/greet-cli/GREET-CLI.md` (`a45b6fb`), `toolkit work finish WI-002 --by Mike --evidence ...`, WI-002 worktree and branch removed. WI-001 back to 11 for review. |
| 18 | "Approved. Ship WI-001 and close it out." | `work-finish`, `work-decide`, `work-on`, `publish-docs`, `memory-save` | `toolkit work approve WI-001 --result --by Mike`, stages 12 and 14, `--shout` baseline committed (`29fc831`), `toolkit work finish WI-001 --by Mike --evidence ...`, focus updated. The stale `wi-001-shout` worktree was left "intact" (bug 9). |
| 19 | "Do you remember what I said about documenting command-line flags?" | `memory-find` | `toolkit memory find "documenting command-line flags"` and `toolkit memory get user_document_cli_flags_in_readme`: "Yes. You said, 'I prefer every command-line flag to be documented in the README.' ... [Saved memory: user_document_cli_flags_in_readme, 2026-09-27; WI-001 Recent History, 2026-09-27.]" |
| 20 | (Mike in Terminal) `toolkit memory find "How does Mike want command-line flags documented?" --reflect` | none | Exit 0 in 27 seconds: "Answer from Hindsight reflect (26.8 s; a summary, not a source): Mike wants every command-line flag documented in the project's README. Whenever a flag is added or changed, the README should be updated to include its usage and behavior." |

## Proof by requirement

### Work item from 01-discovery to Done

`final/WI-001-WORK-ITEM.md` and `final/WI-002-WORK-ITEM.md` are the records
as they ended. Front matter of WI-001:

```
stage: 14-spec-update
status: Done
parent: none
requirements_approved: "2026-09-27 by Mike"
design: none
result_approved: "2026-09-27 by Mike"
```

WI-002: `parent: WI-001`, `design: approved`, the same approval fields, and
`final/WI-002-DESIGN.md` with `status: approved` and
`approved: 2026-09-27 by Mike`. Every approval has a Recent History row with
the owner's words ("Owner's words: Approved.", "Owner's words: Go with option
A.", "Owner's words: Approved. Ship WI-001 and close it out."). The
dashboard (`final/DASHBOARD.md`) shows both items under "Recently done" and
the tree `cli-options/ (group)` -> WI-001 -> WI-002.

The code on `main`:

```
$ node bin/greet.mjs --help
Usage: greet [--shout] [--help] [name]

Options:
  --help   Show this help message.
  --shout  Capitalize the entire greeting.
$ node bin/greet.mjs Mike --shout
HELLO, MIKE!
$ node bin/greet.mjs
Hello, world!
```

Git history (`final/file-tree.txt`): `1b03de7` initial commit, `b269b59`
setup, `e4bb6c0`/`d683ebb`/`cfe7b8d` on `wi-002-help`, merge `9c83b89`,
baselines `a45b6fb` and `29fc831`. No commit carries AI credit.

### Sub-item and the hand move

- Split: session 09 ran `toolkit work new ... --parent WI-001`; the CLI made
  `.work-items/WI-001-add-shout-flag-to-greet-cli/WI-002-add-help-option-listing-every-flag/WORK-ITEM.md`.
- Move: see the timeline. After it, `.work-items/.toolkit-state.json` holds
  `"WI-002": {"path": "cli-options/WI-001-add-shout-flag-to-greet-cli/help-option/WORK-ITEM.md", "parent": "WI-001"}`.
- Carry on: sessions 12 to 17 found WI-002 only through
  `toolkit work show WI-002 --path` and wrote its `DESIGN.md` into
  `help-option/`. Nothing was written to the old paths.

### Memory in Hindsight

`final/memory-listing.txt`: `toolkit memory status` says "Backend: hindsight
... Hindsight bank greet-cli-sample-d at http://127.0.0.1:8888 ... Records: 1
current". The bank also holds the current focus document (`kind:focus`). The
record has `source: Mike, in chat, 2026-09-27` and
`authorization: Approved by Mike on 2026-09-27`.

### Hooks in real Codex sessions

- SessionStart: sessions 04 to 19 each have a `hooks.additional_context`
  message starting "Project briefing: Greet CLI Sample D
  (greet-cli-sample-d), owner Mike. Work items: local folders in .work-items/
  (ids like WI-001). Memory: the local Hindsight server." (listed at the end
  of each file in `sessions/`). Sessions 02 and 03 had none, as expected: the
  project had no `.toolkit.json` when they started.
- UserPromptSubmit: session 05, "The owner stated something to keep;
  memory-save records it, or work-on if it is a task." Hook state
  `"keep": "remember that"`, and the turn's records include
  `{"kind": "memory", "what": "toolkit memory save"}`.
- PostToolUse: each session's hook state lists its `toolkit` writes (for
  example 23 in session 09). Direct `apply_patch` edits of work-item files in
  sessions 14, 17, and 18 are recorded as
  `edits: [{"path": ".work-items/cli-options/WI-001-add-shout-flag-to-greet-cli/help-option/WORK-ITEM.md", "id": "WI-002"}, ...]`.
  `lib/hooks/post-tool.mjs` adds an edit to that list only after
  `validateFile` has run, and prints context only when a file has problems;
  these files had none.
- Stop: ran at the end of every turn (`updated` time in every hook state
  file), `stopBlocked: false` each time.

## Bugs and confusing behavior

Numbered to match the `bugs` list returned to the lead.

1. **In a fresh repository, Codex opens the old claude-toolkit setup skill.**
   (high) See session 01 and `codex debug prompt-input` (58 skills, 31 from
   claude-toolkit including `project-init:project-init`, none from
   toolkit-v2).
2. **`toolkit init` cannot finish inside the Codex sandbox.** (medium) The
   command rule that lets `toolkit` run outside the sandbox is written by
   init itself. Session 02 (`approval_policy: never`, the `codex exec`
   default): EPERM on Hindsight and on `mkdir .codex`, and no way to ask.
   Session 03 (`approval_policy: on-request`): init failed once inside the
   sandbox, then succeeded after an escalation request. In interactive
   Codex this means Mike gets an approval prompt; in `codex exec` or any
   run without approvals, setup cannot finish.
3. **A failed init makes the re-run treat the toolkit's own files as the
   project's.** (high) Session 02: after the failed run, the re-run printed
   "Kept the project's own file (the toolkit never replaces it)" for 20+
   files; `.toolkit.json` `installed` listed only 3 files; doctor listed 21
   files as "changed by the project ... the toolkit version was not
   installed".
4. **An EPERM from the sandbox is reported as a Hindsight server problem.**
   (medium)
5. **Chained `toolkit` commands run inside the sandbox and fail with
   Hindsight.** (medium) Sessions 14 and 17.
6. **The setup agent changed the owner's answers to get past an error.**
   (medium) Session 02.
7. **Declining `SOUL.md` leaves a permanent doctor problem.** (medium)
8. **Setup leaves every file uncommitted, which later blocks the first
   merge.** (medium) Session 16.
9. **Git writes are blocked in the Codex sandbox; the WI-001 build was never
   committed and its worktree is left behind.** (medium)
10. **A renamed sub-item folder is not reported when its parent also
    moved.** (low)
11. **The delivery offer is listed as waiting on the owner for the whole run
    but is never asked.** (low to medium)
12. **The briefing says the hooks are not trusted, inside a briefing a hook
    delivered.** (low) Same as codex-setup finding 2.
13. **Fill-in guide comments stay in finished work items.** (low)
14. **The test suite leaves Hindsight banks on Mike's real server.**
    (medium) 17 banks `acme-crm` ... `acme-crm-17`.
15. **Agents patch work-item bodies directly and use fixed temp file
    names.** (low)
16. **Agents mis-resolve `../../references/conventions.md`.** (low)
17. **`solution-design` in Codex ran no architect or critic worker.** (low)

The exact evidence and a suggested fix for each are in the `bugs` list
returned to the lead.

## Changes outside the project

- Hindsight: bank `greet-cli-sample-d` on `127.0.0.1:8888` (1 record, 1
  focus document). Left in place for review.
- `~/.claude/plugins/marketplaces/claude-toolkit`: refreshed by session 01's
  `claude plugin marketplace update claude-toolkit` (2026-09-26 20:51). It
  now matches `Mar5929/claude-toolkit` main `9d4ea8d`.
- `~/.codex/sessions/2026/09/26/` and `2026/09/27/`: Codex's own logs for the
  19 sessions. `~/.codex/plugins/data/toolkit-toolkit-v2/sessions/`: hook
  state files for the same thread ids.
- `/private/tmp`: body files the agents wrote (`wi-001-*.txt`, `wi001-*`,
  `wi002-*`, `wi-002-*`, `greet-*focus*`); not removed by the agents.
- `~/.codex/config.toml` was not changed (last modified 2026-09-26 20:41,
  before this run).

## Files here

- `evidence.md`: this file.
- `sessions/NN-*.md`: one readable transcript per session.
- `final/WI-001-WORK-ITEM.md`, `final/WI-002-WORK-ITEM.md`,
  `final/WI-002-DESIGN.md`, `final/DASHBOARD.md`: the tracker as it ended.
- `final/requirements-GREET-CLI.md`: the requirements baseline the agent
  committed.
- `final/memory-listing.txt`: memory list, status, the record, the focus, and
  the `--reflect` answer.
- `final/file-tree.txt`: the project's files, Git graph, worktrees, and
  `toolkit work list --tree --all`.
- `final/doctor.txt`: `toolkit doctor` at the end.
- `final/toolkit.json`: the project's `.toolkit.json`.
- `final/hand-move.txt`: the exact hand move and the tree after it.

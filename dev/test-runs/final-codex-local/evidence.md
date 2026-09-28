# Final confirmation run: Codex, local tracker, built-in memory (round 2)

Run on 2026-09-28 from 22:06 to 23:04 UTC, in 30 real `codex exec` turns
(codex-cli 0.157.0, model `gpt-6-sol`, reasoning effort medium). Toolkit V2
ran from Mike's own Codex install, as decisions 10 and 11 left it: the
`toolkit` plugin on for every folder, the other five on only through the
project's `.codex/config.toml`. Versions: toolkit 0.2.7, work 0.2.9, memory
0.2.7, session-skills 0.2.7, git-workflows 0.2.7. The Codex cache copies
matched the source working tree before and after the run, except one test
file (`tests/notion/final-confirm.test.mjs`) that no session runs.

The project is a tiny Node.js command, `tipcalc`, that prints the tip and the
total for a bill and, with `--split`, what each person pays.

Round 1's evidence is kept in `evidence-round-1.md`, with its files in
`sessions/`, `snapshots/`, and `final/`. Round 2's files are in `round-2/`.

## Result

**Not passed, on one finding.** Every step of the scenario worked. One fix
from the last round did not hold: after Mike said "No agent team, I'll lead it
myself", the agent skipped the independent acceptance checker for WI-002 and
told him it was "because you chose no agent team". The project's own
`work-check` skill says the checker still runs under owner-led delivery. The
agent disclosed the missing check, and ran it when Mike asked why (s12), so
nothing false was recorded. But a solo developer who does not ask would
approve a result with no independent check, believing his delivery choice
removed it. Finding 1 below names the cause in the shipped text.

What worked:

- Setup asked six questions one at a time, each with a recommendation,
  including the backup folder. It said before init that Codex would ask for
  approval to run it outside the sandbox, ran `toolkit hindsight health`
  before the memory question, made the first backup, asked Mike for the
  outcome sentence, left the template's two-space line breaks alone, and
  committed only after his yes.
- WI-001 went from `01-discovery` to Done with Mike's recorded approvals of
  the requirements, the design (after a design critic ran), and the result.
- WI-001 was split into a sub-item, WI-002 (`--split`), which inherited the
  requirements approval and the approved design and reached Done.
- Mike moved WI-001 into a group folder and renamed WI-002's folder by hand
  between sessions. The next session's briefing reported both in correct
  words, and the agent repeated them in its first message and final reply.
- "Remember that I prefer ..." was saved in s02 and found in s16.
- An agent "Save to memory: ...?" question left unanswered became a
  `needs-review` proposal saved by the Stop hook, in the owner's name. It was
  listed in "Where are we?" and "What do you need from me?", named again after
  the WI-002 approval, and approved in s14.
- A backup appeared in the backup folder at setup, after `work finish`, and at
  the handoff; the backup after `work finish` holds the new focus.
- All five hooks ran. No commit has an AI credit line. No toolkit command
  waited on a prompt Mike could not see.

## How the sessions ran

- Project folder: a new Git repository whose first commit holds only a
  three-line `README.md`:
  `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/final-codex-local-r2`
- Backup folder given in the interview:
  `.../scratchpad/backups/codex-local` (it still holds round 1's
  `slug-2026-09-28`; this run wrote `tipcalc-2026-09-28`).
- Each turn was a new process, run by `round-2/sessions/harness-fcl2-run.sh`:

  ```sh
  codex exec --json --dangerously-bypass-hook-trust \
    -c 'model_reasoning_effort="medium"' -c 'notify=[]' \
    -c 'projects={"<project folder>"={trust_level="trusted"}}' \
    --sandbox workspace-write -C "<project folder>" "<prompt>" < /dev/null
  ```

- The setup interview (s00a to s00h) and the memory follow-up (sP2) continued
  one conversation with `codex exec resume <thread id> "<prompt>"`.
- The setup turns, s08 and s09 (build), s12 (re-check), and s15 (ship) routed
  approval requests to Codex's automatic reviewer (`--approve-for-me`, or for
  a resume `-c approval_policy="on-request" -c approvals_reviewer="auto_review"`).
  It stands in for Mike clicking "approve" on init and on the Git writes his
  prompt approved. Every other turn used `--sandbox workspace-write`.
- `round-2/sessions/` holds, per turn: the prompt, the exact command, the
  `codex exec --json` output, a readable summary with every tool call, the
  hook messages Codex added, the toolkit hook state file, the skills opened,
  the time of every toolkit call, the backup folder listing, and the hook
  error log. `index.txt` lists times, thread ids, and exit codes. The full
  Codex rollouts stay in `scratchpad/runs/final-codex-local-r2-logs/`.
- The tester ran only read commands in the project, plus the hand move
  (`round-2/snapshots/hand-move-commands.txt`) and the commands Mike reports
  running in s13 (`round-2/snapshots/mike-tries-wi002.txt`).

## Timeline

| Turn | Mike's prompt (short) | Skills opened | What happened |
| --- | --- | --- | --- |
| s00a | "Set up this project with Toolkit V2." | `project-setup` | Doctor before init: "not a Toolkit V2 project" (exit 4). Q1: "I'll call the project "tipcalc" (key `tipcalc`, ...). Is that right?" |
| s00b-f | "Yes, tipcalc is right, all lowercase.", "Local folders.", "The built-in .memory/ folder.", "No, not Salesforce.", "Skip it." | `project-setup` | One question per turn, each with a recommendation. s00c ran `toolkit hindsight health` ("healthy, version 0.10.1") before the memory question. s00f: "Where should automatic backups of tipcalc's work items and memory go? I recommend `~/Backups/toolkit` ... or say "no backups."" |
| s00g | "Put the backups in .../scratchpad/backups/codex-local" | `project-setup` | "Codex will ask you to approve running init outside its sandbox ..." `toolkit init --name 'tipcalc' --key tipcalc --tracker local --memory builtin --owner 'Mike Rihm' --backup-dir '...' --decline SOUL.md`: "Added 33 files". `toolkit handoff-backup` to `.../tipcalc-2026-09-28`. Doctor 0 problems. Asked for the outcome with a suggestion. |
| s00h | "The outcome: tipcalc tells me the tip and the total for a restaurant bill, and can split the total between friends, straight from my terminal. Use my words. Then commit the setup files." | `project-setup` | Outcome written word for word into `AGENTS.md`, `PROJECT.md`, and `PROJECT-ROADMAP.md`. Focus saved. 26 files staged by name, `git diff --cached --name-status` and `--check` read; `--check` flagged the roadmap template's two-space line breaks and the agent left them. Commit `e7ecdb2` "Set up Toolkit V2". |
| s01 | "I want the tip command built. When I run node bin/tipcalc.js 50 --percent 20 it should print "Tip: $10.00  Total: $60.00". I also want a --split option ... Do not build anything until I approve the requirements." | `work-on`, `work-requirements` | WI-001 at 01, then 02. Starting request saved with the `$`, the double quotes, and the two spaces intact. Asked to confirm the goal, with a recommendation. |
| s02 | "Remember that I prefer error messages that tell me how to fix the problem, and tests written with Node's built-in node:test runner, no npm packages." | `memory-save` | Keep-phrase hook line. `toolkit memory save --type user --name coding-preferences ...`: "Saved to memory: user_coding_preferences". "Say "forget that" to remove this preference." |
| s03 | "Yes, that's the goal. For --split, print a second line like "Each person pays: $20.00". When the total doesn't divide evenly, round each share up to the next cent so nobody is short." | `work-requirements`, `work-decide`, `work-on` | Answer saved in an "Owner said:" note; Q-01 answered. Asked Q-02 (tip rounding) with a recommendation. |
| s04 | "Yes, round the tip to the nearest cent with a half cent rounded up, like you said." | `work-decide`, `work-requirements`; `requirements_check` helper (`fork_turns=none`) | Q-02 answered. The helper found input rules unspecified; Q-03 added. Asked "Do you approve that input rule?" with the rule only in the reply (Finding 2). |
| s05 | "Yes, I approve that input rule." | `work-decide`, `work-requirements` | Recorded nothing: "its record does not contain the proposed input rule, so "that input rule" does not identify which values and errors you approved." Proposed a different rule and asked "Is that the rule you approved?" (Finding 2). |
| s05b | "Yes, that is the rule: bills of zero or more ..., percentages from 0 to 100, ... exits with code 1." | `work-decide`, `work-requirements`; `requirements_check` helper | Q-03 answered; R-01 to R-03 written; the helper found no blocking gaps. "Do you approve these requirements?" |
| s06 | "I approve the WI-001 requirements." | `work-decide`, `solution-design`; `wi001_design_critic` helper (`fork_turns=none`) | `approve WI-001 --requirements --by 'Mike Rihm'`, with the stale Next action note, which the agent then fixed. Design created and proposed; the save note named the missing "## Diagrams" section, and the agent added it. The critic found a gap, which was fixed. "Do you approve Option A?" |
| s07 | "I approve Option A. Before you build, split the --split option out into its own sub-item under WI-001, ..." | `work-decide`, `work-organize`, `work-on`, `work-delegate` | Selected design filled, `approve --design`. Stage 05. `toolkit work new --title 'Add the --split option' --parent WI-001 --covers R-02,R-03` = WI-002 at 06, inheriting the approvals. Delivery offer asked as Q-04, with "I recommend yes ...". |
| (hand) | Tester as Mike: `mkdir .work-items/cli`; moved WI-001's folder to `cli/WI-001-tip-command`; renamed WI-002's folder to `split-option` | none | `round-2/snapshots/hand-before-tree.txt`, `hand-after-tree.txt`. |
| s08 | "No agent team, I'll lead it myself. Keep going and build the plain tip and total for WI-001. I approve the Git commands you need ... but do not merge anything yet." | `work-decide`, `work-on`, `work-delegate`, `work-check` | Both folder changes said in the first message and the final reply. `--delivery owner-led` ("Marked Q-04 Answered", copied to WI-002). Worktree `claude/wi-001-build-the-tip-command-with`, commits `bcdf6b0` and `fdc5485`, 6 tests pass. "No independent checker ran." "Say "keep going" to start WI-002." |
| s09 | "Keep going with WI-002. Same Git approval as before ... but no merge yet." | `work-on`, `work-check` | Worktree `claude/wi-002-add-the-split-option` from WI-001's commit, commits `7c70f24` and `3c46996`, 9 tests pass. "The owner-led delivery choice also ruled out helpers, so no independent checker will run." Stage 11. "Do you approve this result?" (Finding 1) |
| sP1 | "Quick fact before I review: my friends and I settle every split bill in Venmo, and Venmo only takes amounts in whole cents, ... ask me before you save it." | `memory-save` | Reply: "Save to memory: You and your friends settle split bills in Venmo, which takes whole-cent amounts, so the round-up rule matters?" The agent saved nothing; the Stop hook saved the proposal. |
| sP2 | (resume) "Which folder do I run the WI-002 result from?" | `memory-save` | UserPromptSubmit passed on the Stop hook's note. The agent answered with the worktree folder and command; the proposal stayed saved. |
| s10 | "Where are we?" | `work-status` | "Two decisions wait on you": the WI-002 result and the Venmo memory proposal. `toolkit work next`: "2 decisions wait on the owner (1 about work items, 1 memory proposal ...)". No record written. |
| s11 | "What do you need from me?" | `work-decide` | "Two decisions wait on you: approval of the WI-002 split result, then a memory proposal ..." Took the result first, with a recommendation and "No independent checker ran." No record written. |
| s12 | "Before I approve WI-002: why did no independent checker run? I only said no agent team. I did not say to skip the check." | `work-check`, `work-decide`, `work-on`; `wi002_acceptance_checker` helper (`fork_turns=none`) | "I treated your "no agent team" choice as covering the checker too; that was my mistake." Back to 09, checker: R-01 to R-03 met, 18 CLI cases pass; test plan corrected, commit `a6d571c`; back to 11. Gave `cd <worktree>` and the command. |
| s13 | "I ran it in the WI-002 worktree and it printed what I expected. I approve the WI-002 result. No merge yet." | `work-decide` | `approve WI-002 --result`. Then named the remaining decision: "One other decision remains: a proposed memory note ... Should I save it?" |
| s14 | "About the Venmo memory you proposed: yes, keep it." | `memory-save` | `toolkit memory approve project_mike_rihm_friends_settle_split_bills_venmo_takes --by 'Mike Rihm'`: "it is now a current memory record". |
| s15 | "Ship it: WI-001 and WI-002. The whole tip command works the way I asked. There is no remote, so merge them into main here, then finish WI-002 and WI-001 and clean up ..." | `work-finish`, `merge-and-clean-up`, `publish-docs` | Two `git merge --ff-only`. `approve WI-001 --result` quoting Mike. `publish-docs.mjs start`: "No remote: this save will be committed locally on main"; workspace `.claude/worktrees/docsave-bb872e2d`; `publish --workspace ...` from the project folder: commit `09432ce`. Focus cleared first, then each `work finish` printed "Backed up .work-items/ and .memory/ to .../tipcalc-2026-09-28." Worktrees and branches removed. |
| s16 | "Do you remember how I like error messages and tests written? And why does the round-up rule matter to me?" | `memory-find` | Answered both from the two records, naming each key. |
| s17 | Direct-edit check: a Notes line in WI-002 with `apply_patch`, then its priority in the header | `work-on` | Header edit refused by PreToolUse ("... (priority). ... Nothing was changed. Command: ..."). Notes line added; PostToolUse: "WI-002 was edited directly and passes validation." Priority set with `toolkit work set WI-002 --priority high`. |
| s18 | "Where are we?" | `work-status` | "WI-001 and WI-002 are done on local `main`. There are no open work items, decisions waiting on you, or recommended next item." No record written. |
| s19 | "Write a handoff. I am going to clear context and start a new session." | `handoff`; `handoff_verifier` helper (`fork_turns=none`) | Focus saved, `toolkit handoff-backup` run, prompt checked by the helper and given in one text block ending "Clear the context, then paste this prompt." |

## Proof, item by item

### Setup and the backup folder question

- Six questions, one per turn, each with a recommendation (s00a to s00f).
- `.toolkit.json` holds `"backup": {"dir": ".../scratchpad/backups/codex-local"}`
  (`round-2/final/toolkit.json`).
- The outcome was asked, not invented, and written in Mike's words.
- Setup commit `e7ecdb2`: 26 files staged by name, the staged list read
  before the commit, no `.memory/` or `.work-items/` file in it. The
  roadmap template's two-space line breaks were kept (last round the agent
  removed them).
- `.claude/settings.json` holds `"attribution": {"commit": "", "pr": "",
  "sessionUrl": false}`.

### Work item from 01-discovery to Done

- WI-001's header at the end (`round-2/final/WI-001-WORK-ITEM.md`):
  `status: Done`, `requirements_approved: "2026-09-28 by Mike Rihm"`,
  `design: approved`, `result_approved: "2026-09-28 by Mike Rihm"`,
  `delivery: owner-led`. Recent History, newest first, runs from Created at 01
  through Q-01 to Q-03, requirements approved, design created, critiqued, and
  approved, sub-item made, moved by hand, P1 built, result approved, merged,
  documents saved, and Finished. No `<!--` guide comment is left in either
  item or the design.
- `round-2/final/tracker-and-doctor.txt`: `cli/ (group)` with WI-001 Done and
  WI-002 Done under it; "Checked 2 items: 2 clean, 0 errors, 0 approval gate
  problems"; "Nothing is waiting on the owner."; doctor outside Codex:
  "Result: clean. No problems and no warnings here (2 for Codex only)." exit 0.
- `round-2/final/git-and-app.txt`: `node --test tests/tipcalc.test.js` 9 pass,
  0 fail; `node bin/tipcalc.js 50 --percent 20 --split 3` prints
  `Tip: $10.00  Total: $60.00` and `Each person pays: $20.00`;
  `--percent 120` prints "Error: Enter --percent with a percentage from 0 to
  100." and exits 1.
- The delivered documents: `requirements/tip-command/TIP-COMMAND.md`,
  `system-guide/tip-command.md`, and the filled roadmap (`round-2/final/`).

### Sub-item made by splitting

- s07: "Created WI-002: Add the --split option (06 Implementation plan, In
  Progress, sub-item of WI-001) ... It delivers WI-001 R-02, R-03 and inherits
  that requirements approval ... WI-001's approved design covers it, so it
  starts at planning with no design of its own."
- `toolkit work show WI-002`: "Parent: WI-001 | Sub-items: none | Design: none
  of its own; WI-001's design is approved".
- `--delivery owner-led` on WI-001 printed "Delivery owner-led also recorded
  on its sub-item WI-002."

### Folders moved and renamed by hand

- s08 session-start briefing (`round-2/sessions/s08-build-wi001.hooks.txt`):
  - "Moved: WI-001 from WI-001-build-the-tip-command-with-split-option to
    cli/WI-001-tip-command (moved and renamed by hand). It is still a
    top-level item."
  - "Renamed folder: WI-002's folder was renamed by hand from
    WI-002-add-the-split-option to split-option; the item itself is the same.
    It moved along with its parent WI-001's folder, and it is still a sub-item
    of WI-001."
- The agent's first message: "The tracker shows that WI-001 moved to
  `cli/WI-001-tip-command`, and its WI-002 sub-item folder was renamed to
  `split-option`." Its final reply repeated both.
- History rows: WI-001 "Moved by hand: ... -> .work-items/cli/WI-001-tip-command/WORK-ITEM.md.
  | It is still a top-level item. Group: cli."; WI-002 "Folder renamed by
  hand: ...". Every later command used the new paths with no error.

### Preference saved and found later

- s02 hook line: "The owner stated something to keep; memory-save records it,
  or work-on if it is a task."
- `round-2/final/user_coding_preferences.md`: `type: user`, `status: current`,
  `authorization: Approved by Mike Rihm on 2026-09-28`.
- The build used `node:test`, no npm packages, and error messages that say how
  to fix the input (`round-2/snapshots/mike-tries-wi002.txt`). s16 answered
  from the record.

### Unanswered "Save to memory?" becomes a proposal

- sP1 final message: "Save to memory: You and your friends settle split bills
  in Venmo, which takes whole-cent amounts, so the round-up rule matters?" The
  agent ran no save.
- sP1 hook state: record `"toolkit memory save --proposal (Stop hook)"` at
  22:46:11.941, 0.155 seconds after the final message.
- The record as the Stop hook saved it: title and Remember line "Mike Rihm and
  Mike's friends settle split bills in Venmo, ..." (the owner's name, not
  "You"), `status: needs-review`, `authorization: Proposed by the agent on
  2026-09-28; the owner has not answered`, "How to apply: Not stated by the
  owner. Do not rely on this until the owner approves it." The Evidence line
  quotes the question as asked. `MEMORY.md` lists it with "[proposal: not a
  fact until the owner answers]".
- sP2: UserPromptSubmit added "At the end of the last turn the toolkit saved
  the unanswered "Save to memory: ...?" as a memory proposal: ... It is not a
  fact. ..." The proposal stayed saved.
- Listed in s10 and s11, and named again in s13 after the WI-002 approval.
  `toolkit memory find 'Venmo'` in s14: "No memory records match ... 1 saved
  proposal also matches; it is not a fact until the owner answers."
- s14: approved; `status: current`, `authorization: Approved by Mike Rihm on
  2026-09-28`, and the "Do not rely on this" words are gone
  (`round-2/final/project_mike_rihm_friends_settle_split_bills_venmo_takes.md`).

### "Where are we?" and "What do you need from me?"

- s10 and s18 opened `work-status`; s11 opened `work-decide`. None wrote a
  record: only the generated `.work-items/.toolkit-state.json` changed
  (`round-2/snapshots/s10-*`, `s11-*`, `s18-*hashes.txt`).

### Handoff

- s19 saved the focus, ran `toolkit handoff-backup`, had the
  `handoff_verifier` helper check the prompt, and gave the prompt with Goal,
  task, read-first list, open setup steps, first action, and repository state.

### No AI credit in any commit

`round-2/final/git-and-app.txt`: eight commits, all by
`Mike Rihm <michael@rihm.com>`; `git log --all --format=%B | grep -i -n -E
'co-authored|generated with|claude|codex|openai|anthropic|chatgpt|gpt|\bai\b'`
finds nothing (exit 1). One branch `main`, one worktree, clean tree, no
remote.

### A backup after work-finish

| When | `exportedAt` in `toolkit-export.json` | Contents |
| --- | --- | --- |
| Setup (s00g, s00h) | 2026-09-28T22:10:05Z | templates and generated files |
| After the two `work finish` runs (s15) | 2026-09-28T22:59:34Z | 7 work item files, including `cli/WI-001-tip-command/WORK-ITEM.md`, `DESIGN.md`, and `split-option/WORK-ITEM.md`, both at `status: Done`; 9 memory files, both records; the focus says "Now: None." |
| Handoff (s19) | 2026-09-28T23:02:49Z | the same, with the handoff focus |

Each `toolkit work finish` printed "Backed up .work-items/ and .memory/ to
.../backups/codex-local/tipcalc-2026-09-28." (`round-2/snapshots/s15-backup-*.txt`,
`round-2/final/backup-listing.txt`).

### Every hook ran

`round-2/snapshots/hook-table.txt`. s00a to s00f ran before `toolkit init`,
when the folder was not a V2 project, so the hooks correctly did nothing there.

| Hook | Proof |
| --- | --- |
| SessionStart | The "Project briefing" arrived in all 23 turns from s00h on (resume included). |
| UserPromptSubmit | Every turn from s00h on started a new turn in the hook state at the prompt time. s02: the keep-phrase line. sP2: the Stop hook's proposal note passed on. |
| PreToolUse | s06: a Python script that edited WORK-ITEM.md was refused. s17: the header edit was refused. s04 and s15: the note for a toolkit command joined to other commands. |
| PostToolUse | Toolkit writes recorded in the hook state in 16 turns (up to 22 in s15). s07: "The design of WI-001 was edited directly and passes validation." s17: "WI-002 was edited directly and passes validation." |
| Stop | In every turn from s00g on, the hook state was written 0.11 to 0.18 seconds after the final message (1.6 seconds in s02). sP1: the Stop hook saved the proposal. |

No `hook-errors.log` exists in the project's Git folder.

### No toolkit command stalled

- 299 toolkit command runs (counted from the `codex exec` output). The longest tool call holding one took 5.5
  seconds from call to result (`toolkit init`); none waited without output
  (`round-2/sessions/*.durations.txt`).
- Every toolkit command exited 0 except: `toolkit doctor` before init (exit 4,
  "not a Toolkit V2 project"), `toolkit doctor` inside Codex (exit 1 for the
  two Codex-only trust warnings, as designed), `toolkit hindsight health` in
  s00a (blocked by the sandbox; it said so, and s00c ran it again and got
  "healthy"), and `toolkit work design WI-002` in s12 ("WI-002 has no design
  yet"; the agent then read WI-001's).
- No ask-first command (memory delete, import, machine-setup, Hindsight
  service install or start) was needed in this scenario.

### Mike's own settings untouched

`~/.codex/config.toml` sha256 `f8570208...9b6294` and `~/.claude/settings.json`
sha256 `d80a8b38...54e65b` are the same before and after the run
(`round-2/final/host-config-and-cache.txt`).

### Fixes from the last round, as seen in this run

| Fix | Seen |
| --- | --- |
| `work next` counts memory proposals | Yes, s10. |
| Stop-hook proposal in the owner's name | Yes, sP1 ("Mike Rihm and Mike's friends ..."). |
| Owner-led keeps the design critic and the acceptance checker | Design critic ran (s06, before the delivery choice). **Acceptance checker skipped** under owner-led (s09); Finding 1. |
| work-decide names what still waits after each answer | Yes, s13. |
| Leave the template's two-space line breaks | Yes, s00h. |
| Note for a proposed design missing template sections | Yes, s06 ("no "## Diagrams" section"); the agent added it. |
| Note for a stale Next action after an approval | Yes, s06, s07, s13, s15. |
| Codex deny reason with one period | Yes, s17 ("Nothing was changed. Command: ..."). |
| publish-docs workspace in `.claude/worktrees/docsave-<id>`, `publish --workspace` from the project folder | Yes, s15. |
| Tell the owner before init that Codex asks for approval; Hindsight health before the memory question | Yes, s00g and s00c. |
| Delivery offer with a recommendation | Yes, s07. |
| Focus off before `work finish`, so the backup holds the new focus | Yes, s15. |
| Name the worktree folder with a command to try | Yes, s09, sP2, s12. |
| Parent with no task lines warning | Not exercised: WI-001 had its own P1 tasks. Validate is clean. |

### Repository checks after the run

| Check | Result |
| --- | --- |
| `node --test "tests/**/*.test.mjs"` in `plugins/toolkit` | 928 tests, 925 pass, 0 fail, 3 skipped by design (same before the run) |
| `check-skills.mjs --quiet` | 0 failures, 0 warnings, 16 notes |
| `sync-skill-references.mjs --check` | 159 copies, 0 problems |
| `import-model.mjs --check` | the copy matches the approved model folder (commit `5e7d7a0`) |
| git-workflows tests | 14 of 14 pass |
| `claude plugin validate .` | passed |

(`round-2/snapshots/after-toolkit-tests.txt`, `after-other-checks.txt`,
`before-toolkit-tests.txt`.)

## Findings

### 1. Owner-led delivery still skips the acceptance checker (medium; the reason this run did not pass)

- s08: Mike answered the delivery offer with "No agent team, I'll lead it
  myself." The agent recorded `--delivery owner-led` with the note "Mike Rihm
  declined an agent team on 2026-09-28 and will lead delivery himself".
- s09: after building WI-002 the agent read `work-check`'s `SKILL.md` (whose
  gotcha says "Owner-led delivery ("no agent team for this one") is a
  delivery choice, not a no to the check: the `acceptance-checker` still
  runs") and its `references/helpers.md`, then wrote: "The owner-led delivery
  choice also ruled out helpers, so no independent checker will run." It
  asked for the result approval with "No independent check ran because you
  chose no agent team." s11 repeated "No independent checker ran."
- s12: only when Mike asked why did the agent run the checker ("I treated your
  "no agent team" choice as covering the checker too; that was my mistake").
- Cause in the shipped text: `plugins/work/shared/helpers.md` (copied into
  `work-check`, `work-on`, `work-delegate`, and others) says "A "no" to the
  team question authorizes no helpers: the main agent does the work itself
  and says that no independent check ran", and that the acceptance checker
  needs no permission except for "an owner who said no to helpers (for
  example a no to the team question in `work-delegate`)". `work-delegate`
  says "A no to the team question means no helpers." Mike's natural words "no
  agent team" match both the delivery offer and that team question, so the
  agent followed `helpers.md` over the `work-check` gotcha and
  `team-roles.md`.
- Effect: a solo developer who does not ask gets results approved with no
  independent check, and is told his delivery choice caused it.
- Suggested fix: in `helpers.md` and `work-delegate`, say that a no to the
  delivery offer ("owner-led", "no agent team", "I'll lead it") never removes
  the design critic or the acceptance checker; only his words about helpers
  or the check itself do. Because this must happen every time (goal
  adjustment of 2026-09-28), also have `toolkit work set --stage
  11-user-approval` or `toolkit work approve --result` print a note when the
  item's history has no independent check since its last build commit.

### 2. A recommendation given with a question is not saved, so a fresh session cannot match "yes" (low)

- s04 asked "Do you approve that input rule?" after recommending "nonnegative
  bills with at most two decimal places, nonnegative numeric tip percentages,
  and positive whole-number split counts". The Q-03 row and "Resume here"
  held only the question.
- s05 (a new session): "Yes, I approve that input rule." The agent correctly
  recorded nothing, then proposed a different rule ("percentages from 0 to
  100") and asked "Is that the rule you approved?". Mike had never seen the 0
  to 100 limit. The question wording presents a new rule as the one he
  approved.
- Mike answered with the rule in full (s05b), so nothing wrong was recorded.
- Suggested fix: when a skill asks a question it cannot record yet, save the
  recommendation with it (the Open Questions row or "Resume here"), and when
  re-asking in a new session, say "I cannot find the rule you saw; here is my
  recommendation" rather than "Is that the rule you approved?".

### Smaller observations (no change needed to pass)

- s03 history quote: the agent wrote `\"Each person pays: $20.00\"` with
  literal backslashes (a quoting slip) and curly apostrophes (the Codex rule
  for apostrophes). Markdown shows the quote correctly.
- WI-001's result was approved at stage 08 from "Ship it ... The whole tip
  command works the way I asked"; the command printed "a result is usually
  approved at 11". The whole command had been checked independently through
  WI-002 (R-01 to R-03 on the merged commit).
- After the build, `AGENTS.md`'s Commands table still has no verified test
  command; doctor notes it. `node --test` would fit.
- The approved Venmo record says "Why: Not stated by the owner." though Mike
  gave the reason in the same message.
- Most turns ran `toolkit doctor` at the end; it exits 1 inside Codex for the
  two trust warnings. Harmless.

## Harness notes (not toolkit bugs)

- The two Codex-only doctor warnings ("Codex does not trust this folder", "The
  Toolkit V2 hooks are not trusted in Codex yet") come from giving trust per
  run with `-c` and `--dangerously-bypass-hook-trust`. The agents told Mike
  about both steps; doctor exits 0 outside Codex.
- `toolkit hindsight health` in s00a ran inside the sandbox under
  `--approve-for-me` and was blocked (EPERM); the command's message said the
  sandbox, not the server, was the cause.
- The readable summaries (`*.summary.txt`) show an empty result for one
  `toolkit work finish WI-002` call in s15; the rollout shows it printed "WI-002
  is Done. ... Backed up ...". The summary script reads `aggregated_output`,
  which Codex left empty for that call.

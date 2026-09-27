# Sample run d: local tracker and local Hindsight memory (round 2, kept for history)

Run on 2026-09-27 from 16:51 to 17:36 UTC, in 15 real `codex exec` sessions
(codex-cli 0.157.0, Mike's model setting `gpt-6-sol`, reasoning effort
medium). Toolkit V2 version 0.2.1. Before the run, the Codex plugin copies in
`~/.codex/plugins/cache/toolkit-v2/` were compared with the source folders and
matched file for file. Round 1 is kept in `round-1/`.

## Result

The work item reached Done, with every approval recorded in the owner's words.

- WI-001 "Add --shout flag to greet CLI" (type `build`) went from
  `01-discovery` to Done. WI-002 "Document --shout in README" was split out of
  it as a sub-item with `toolkit work new --parent WI-001 --covers R-02`. It
  inherited the requirements approval, got its own result approval, and
  reached Done before its parent.
- Between sessions s07 and s08 the tester, as Mike, moved WI-001 into a new
  group folder `cli-flags/` and renamed the sub-item folder to
  `WI-002-readme-docs`. The s08 briefing reported both changes, and every
  later session found both items at their new paths.
- "Remember that I prefer every command-line flag to be documented in the
  README" (s05) was saved to the Hindsight bank `greet-cli-sample-d2`. A later
  session (s12) found it and quoted it back. `toolkit memory find --reflect`
  answered from Hindsight in 23.4 seconds.
- "Where are we?" (s08) opened `work-status`. "What do you need from me?"
  (s10) opened `work-decide`, which counted two decisions and asked them one
  at a time, each with a recommendation.
- The session-start briefing arrived in all 14 sessions after setup. The
  keep-phrase line fired on "remember that". The post-edit check ran when the
  agent edited a `WORK-ITEM.md` directly (s13). The Stop hook updated the hook
  state at the end of every turn and never blocked.
- Setup: with the toolkit plugin on for the first run, "Set up Toolkit V2"
  opened `project-setup`, not the older `project-init`, even though the older
  skill was listed too. Inside the Codex sandbox, init stopped before writing
  anything. The agent gave the exact `toolkit init` command, the tester ran it
  in a terminal as Mike, and the next session finished setup. This is the
  documented path in the README section "Starting a new project from Codex".

Eleven problems were found. All are low or medium. None blocked the work
item. They are listed under "Problems found".

## How the sessions ran

- Project folder (a new Git repository; the first commit holds
  `bin/greet.mjs`, `test/greet.test.mjs`, `package.json`, and `README.md`,
  the same files as round 1):
  `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/d-local-hindsight-r2`
- Every session was a fresh process:

  ```sh
  codex exec --json <sandbox choice> --dangerously-bypass-hook-trust \
    -c model_reasoning_effort="medium" -c 'notify=[]' \
    -c 'projects={"<project folder>"={trust_level="trusted"}}' \
    -C "<project folder>" "<prompt>" < /dev/null
  ```

- Sandbox choice: `--sandbox workspace-write`, except s03, s09, and s14, which
  used `--approve-for-me`. That flag sends Codex's approval requests to its
  automatic reviewer. It stands in for Mike clicking "approve" on the Git
  commands the project's `.codex/rules/toolkit.rules` asks about. In each of
  those three sessions, Mike's prompt also said he approved the Git commands.
- s00 also passed
  `-c 'plugins={"toolkit@toolkit-v2"={enabled=true},"project-init@claude-toolkit"={enabled=true},"second-brain@claude-toolkit"={enabled=true},"git-workflows@claude-toolkit"={enabled=true},"sf-architect-solutioning@claude-toolkit"={enabled=true}}'`.
  That turns the toolkit plugin on for this one run and keeps the older
  claude-toolkit setup plugins on as well, so the skill choice between
  `project-setup` and `project-init` was really tested. No later session
  changed any plugin switch; the project's own `.codex/config.toml` did that.
- Folder trust came from the `-c projects=...` value, and hook trust from
  `--dangerously-bypass-hook-trust`. So `toolkit doctor` always warns "Codex
  does not trust this folder" and "The Toolkit V2 hooks are not trusted in
  Codex yet". Both warnings come from the test method.
- `~/.codex/config.toml` was copied before the run and compared after it.
  They match.
- The Hindsight server at 127.0.0.1:8888 was not stopped or reinstalled. It
  had 18 banks before the run and 19 after; the only new one is
  `greet-cli-sample-d2`.
- For each session, `sessions/` holds the prompt (`.prompt.txt`), the
  command line (`.command.txt`), the `codex exec --json` output (`.jsonl`), a
  readable summary with every tool call and its `toolkit` output from the
  Codex session log (`.summary.txt`), the hook text Codex added
  (`.hooks.txt`), and the hook state the toolkit wrote (`.hookstate.json`).
  `sessions/index.txt` lists start and end times and thread ids. The full
  Codex session logs stay in the scratch folder
  `.../scratchpad/runs/d-local-hindsight-r2-logs/` (`*.rollout.jsonl`).
- The "skills opened" column comes from the `SKILL.md` files each session
  read, taken from the Codex session log.

## Timeline

| # | Mike's prompt | Skills opened | What happened |
| --- | --- | --- | --- |
| s00 | "Set up Toolkit V2 in this project. My answers: the project name is Greet CLI Sample D2, key greet-cli-sample-d2, id prefix WI, owner Mike. Track work items in local folders. Use local Hindsight for memory. It is not a Salesforce project. I use both Claude Code and Codex. I don't want a SOUL.md. ..." | `project-setup` | `toolkit hindsight health` said the Codex sandbox blocked the request, not the server. `toolkit init ... --memory hindsight ... --decline SOUL.md` failed with "Nothing was written". The agent stopped and gave the exact command to run in a terminal. No answer was changed. |
| terminal | Tester, as Mike, ran the command the agent gave (`snapshots/s00b-terminal-init.txt`) | none | Added 27 files. `.codex/` was written. Bank `greet-cli-sample-d2` created. `.toolkit.json` has `"declined": ["SOUL.md"]`. |
| s01 | "I ran the toolkit init command in a terminal and it finished. Finish setting up Toolkit V2." | `project-setup` | The briefing arrived without the two trust findings. `hindsight service status` healthy, `ensure-bank` found the bank. Filled `AGENTS.md` and `PROJECT.md`. Doctor: 0 problems. Asked for the project outcome. Said the files are not committed, but did not offer to commit them (problem 6). |
| s02 | "The outcome I want: a small, friendly greeting command that I can grow with a few simple flags. Keep the roadmap to that for now. And please commit the setup files." | `work-on`, `publish-docs`, `work-decide` | Filled `PROJECT.md` and `PROJECT-ROADMAP.md`. `git add` was refused: "approval required by policy, but AskForApproval is set to Never". The prompt rule worked. The agent stopped and reported it; it did not work around it. |
| s03 | "Yes, commit the setup files now. I approve the git add and git commit commands." (`--approve-for-me`) | none | Staged 26 files by name, read the staged diff, committed `b08125b Add Toolkit V2 project setup`. `git commit` asked to run outside the sandbox (`require_escalated`) and was approved. |
| s04 | "I want to add a --shout flag to the greet CLI, so it prints the greeting in capital letters. Please track it as a work item and ask me what you need to pin down the requirements." | `work-on`, `work-requirements` | `toolkit work new --title "Add --shout flag to greet CLI" --type build --stage 01-discovery` made WI-001. Starting request saved in Mike's words, R-01 drafted, stage 02, Q-01 asked with a recommendation, waiting on owner. Text files went through `mktemp -d` and were deleted. |
| s05 | "Yes, go with your recommendation: both positions work, and the whole greeting including the name is in capitals, like HELLO, MIKE! Also, remember that I prefer every command-line flag to be documented in the README." | `work-decide`, `work-on`, `memory-save`, `work-requirements` | Keep-phrase hook fired. `toolkit memory save --type user --name document-cli-flags-in-readme ... --approved-by Mike` gave "Saved to memory: user_document_cli_flags_in_readme (new record). Where: Hindsight bank greet-cli-sample-d2". Q-01 answered, R-02 (README documents the flag) added, spec check by a native Codex worker (`spawn_agent`, `fork_turns: none`), then "Do you approve these requirements?" |
| s06 | "Approved. Before you build it, give me design options to choose from." | `work-decide`, `solution-design`, `work-requirements` | `toolkit work approve WI-001 --requirements --by Mike`, history note with Mike's words. Stage 04, `work design --create`, Option A (flag handled in the command, recommended) and Option B (argument parser) saved as proposed. The team question went out through Codex's async question tool and got no answer in `codex exec`, so no critic ran; the design Notes say so. |
| s07 | "Go with option A. No helper agents needed for the design, it's a small change. And split this: put the README documentation part into its own sub-item, so it can be built and checked on its own." | `work-decide`, `work-organize`, `work-on` | `approve WI-001 --design --by Mike`. Stage 05. `toolkit work new --title "Document --shout in README" --type task --parent WI-001 --covers R-02` made WI-002 at `03-requirements-approved` with "inherits that requirements approval (2026-09-27 by Mike)". Parent Roadmap lists WI-002 in the Sub-items column. Both items moved to stage 06. |
| move | Tester, as Mike: `mkdir .work-items/cli-flags`, moved the WI-001 folder into it, renamed `WI-002-document-shout-in-readme` to `WI-002-readme-docs` (`snapshots/hand-move.txt`) | none | Trees before and after: `snapshots/before-move-tree.txt`, `snapshots/after-move-tree.txt`. |
| s08 | "Where are we?" | `work-status` | Briefing: "Moved: WI-001 from ... to .work-items/cli-flags/..." and "Renamed folder: WI-002 is now at .../WI-002-readme-docs/WORK-ITEM.md ... Its parent WI-001 moved too." The answer led with "No decisions are waiting on you", gave one line per item, the recommended next item, and "Both items were moved into the `cli-flags` group; WI-002's folder was also renamed." Changed nothing. |
| s09 | "Keep going. I approve the git commands you need for the build (worktree, add, commit)." (`--approve-for-me`) | `work-on`, `work-delegate`, `publish-docs`, `work-check`, `memory-save` | Worktrees `.claude/worktrees/wi-001-shout-cli` and `wi-002-readme-shout` on `claude/wi-...` branches. Built the flag and 4 CLI tests, README examples, test plans. An independent checker (`spawn_agent`, `fork_turns: none`) found WI-002's branch lacked the CLI; the agent merged the WI-001 branch into it, and the checker then found no defects. Both items at stage 11, waiting on owner. |
| s10 | "What do you need from me?" | `work-decide` | `toolkit work decisions`: "2 decisions wait on the owner". Reply: "I need two separate result approvals", WI-001 first, with a recommendation. |
| s11 | "Yes, I approve the CLI result." | `work-decide` | `approve WI-001 --result --by Mike`, Mike's words in history, then asked for WI-002 with a recommendation. |
| s12 | "Before I approve the README: do you remember what I told you about documenting command-line flags? Does the README follow it?" | `memory-find` | `toolkit memory find` and `toolkit memory get user_document_cli_flags_in_readme` from Hindsight. Reply: "Yes. You told me to document every command-line flag in the README ... saved in `user_document_cli_flags_in_readme` (2026-09-27)." |
| s13 | "Yes, I approve the README result. Also, WI-002's WORK-ITEM.md still has that long fill-in guide comment at the top. Please just delete it from the file." | `work-decide` | `approve WI-002 --result --by Mike`. Deleted the guide with `apply_patch` on the file. The PostToolUse hook answered: "WI-002 was edited directly and passes validation. ... prefer it to editing the file." |
| s14 | "Ship both. There is no remote, so merge them into main locally. I approve the merge and the git commands you need, and you can close both items out when they are done." (`--approve-for-me`) | `work-finish`, `work-on`, `merge-and-clean-up`, `publish-docs`, `memory-save` | `git merge --ff-only claude/wi-002-readme-shout` into `main`. Stage 12, then 14: wrote `requirements/greeting-cli/CLI.md` and `system-guide/GREETING-CLI.md` in a separate worktree, fast-forwarded them into `main`. Removed the three worktrees and branches. `toolkit work finish WI-002 --by Mike --evidence ...`, then WI-001. Focus cleared. Roadmap linked to WI-001. |
| terminal | Tester ran `toolkit memory find "What does Mike prefer for command-line flags, and why?" --reflect` | none | Answer in 23.4 s (`snapshots/reflect-terminal.txt`). |

## Proof by requirement

### Setup (`project-setup`)

- s00 picked `project-setup` with the claude-toolkit `project-init` also
  listed. The Hindsight check output:
  "The request to the Hindsight server at http://127.0.0.1:8888 was blocked
  before it left this computer (EPERM ...). This is the Codex sandbox, not
  the server."
- The init error ended with "Nothing was written", and `git status` showed
  the tree unchanged.
- After the terminal init, `toolkit doctor` gave "Result: 0 problems and 2
  warnings" (the two trust warnings from the test method). `SOUL.md` is not
  reported missing, because it is declined.

### Work item stages and approvals (`final/WI-001-WORK-ITEM.md`)

- Stages recorded in Recent History, newest first: 01, 02, 03 (requirements
  approved by Mike), 04 (design proposed, then approved by Mike), 05, 06, 08,
  09, 11 (result approved by Mike), 12, 14, then "Finished. Result approved
  earlier (2026-09-27 by Mike); marked Done by Mike."
- Every approval has a history note that quotes Mike's words ("Owner's
  words: Approved. Before you build it, give me design options to choose
  from.", "Owner's words: Go with option A. ...", "Owner's words: Yes, I
  approve the CLI result.").
- Header at the end: `status: Done`, `requirements_approved: "2026-09-27 by
  Mike"`, `design: approved`, `result_approved: "2026-09-27 by Mike"`.
- `toolkit work validate`: "Checked 2 items: 2 clean, 0 errors".
- The code on `main`: `npm test` passes 6 tests; `node bin/greet.mjs --shout
  Mike` prints `HELLO, MIKE!`; `node bin/greet.mjs Mike` prints
  `Hello, Mike!` (`final/git-and-result.txt`).

### Sub-item (`final/WI-002-WORK-ITEM.md`)

- Created by the split with `--covers R-02`. History: "Created as a sub-item
  of WI-001. It delivers WI-001 R-02. | Requirements approval inherited from
  WI-001 (2026-09-27 by Mike); the owner is not asked again."
- Its own result approval (s13), and Done before the parent (s14).
- `DASHBOARD.md` tree: `cli-flags/ (group)` > `WI-001 (Done)` > `WI-002 (Done)`.

### The owner's hand move

- s08 briefing text (`sessions/s08-status.hooks.txt`):
  - "Moved: WI-001 from .work-items/WI-001-add-shout-flag-to-greet-cli/WORK-ITEM.md
    to .work-items/cli-flags/WI-001-add-shout-flag-to-greet-cli/WORK-ITEM.md."
  - "Renamed folder: WI-002 is now at
    .work-items/cli-flags/WI-001-add-shout-flag-to-greet-cli/WI-002-readme-docs/WORK-ITEM.md
    (was .work-items/WI-001-add-shout-flag-to-greet-cli/WI-002-document-shout-in-readme/WORK-ITEM.md).
    Its parent WI-001 moved too."
- `toolkit work show WI-002` in s08 gave the new location and `Parent:
  WI-001`. s09 to s14 worked on both items at the new paths.
- Gap: no history row on either item records the move (problem 4).

### Memory (Hindsight)

- Saved in s05 (`sessions/s05-answer-remember.summary.txt`), with the source
  "Mike, in chat, 2026-09-27" and "Approved by: Mike".
- Every later briefing listed "Project memory (hindsight): 1 record" and the
  record's name.
- Found in s12 by a fresh session with `toolkit memory find` and
  `toolkit memory get`.
- `final/memory-listing.txt`: `toolkit memory list`, the record, the current
  focus, and the bank's two documents on the server (`focus` and
  `user_document_cli_flags_in_readme`).
- `--reflect` answer: "Mike prefers that every command‑line flag be
  documented in the README. He says this helps future CLI changes include
  discoverable usage instructions for users." The second sentence repeats a
  reason the agent wrote, not one Mike gave (problem 5).

### Status and decisions

- s08 "Where are we?": `work-status`, read-only, decisions first, then items,
  next item, and the move.
- s10 "What do you need from me?": `work-decide`, 2 decisions, one per
  message, each with a recommendation. The delivery-offer "Agent to-do" lines
  were not counted as decisions.

### Hooks

| Hook | Seen in | Proof |
| --- | --- | --- |
| SessionStart briefing | s01 to s14 (14 of 14 sessions in the project) | `sessions/*.hooks.txt`, "Project briefing: Greet CLI Sample D2 ..." |
| Briefing leaves out the false trust findings | s01 to s14 | The hook text has no "not trusted" line; `toolkit brief` and `toolkit doctor` still show both warnings |
| UserPromptSubmit keep-phrase line | s05 | "The owner stated something to keep; memory-save records it, or work-on if it is a task." Hook state `keep: "remember that"` |
| PostToolUse records toolkit writes | s04 to s14 | `sessions/*.hookstate.json` `records` (9, 10, 14, 24, 20, 5, 7, 14) |
| PostToolUse check after a direct record edit | s13 | "WI-002 was edited directly and passes validation. toolkit work edit <id> --section ... prefer it to editing the file." Hook state `edits: 1` |
| Stop | every session | Hook state `updated` within 2 seconds of each turn's end, `stopBlocked: false` |
| Git prompt rules (`.codex/rules/toolkit.rules`) | s02, s03, s09, s14 | Refused with "approval required by policy" when approval was off (s02); ran after approval with `--approve-for-me` |

## Round 1 problems checked again

| Round 1 problem | Round 2 result |
| --- | --- |
| Old `project-init` chosen for "set up" (a1, d1) | Fixed. `project-setup` chosen while `project-init` was also listed (s00). |
| Sandbox-blocked Hindsight reported as server down (d4) | Fixed in `hindsight health` and `service status`. Init's own message still suggests starting the server (problem 1). |
| Init wrote files and then failed, agent changed answers (d2, d3) | Fixed. "Nothing was written"; no answer changed. |
| SOUL.md reported missing after the owner declined it (d7) | Fixed. `--decline SOUL.md`; doctor quiet. |
| Sub-item rename hidden when the parent also moved (d10) | Fixed. Both reported (s08). |
| Hook briefing said the hooks were not trusted (d12) | Fixed. |
| History order (d13) | Fixed. Newest first. |
| Test suite created banks (d14) | Fixed. Only the new project bank was added. |
| Fixed temp file names (d15) | Fixed. `mktemp -d` per save, deleted after. |
| Checker shared the builder's thread (d17) | Fixed. `spawn_agent` with `fork_turns: none` (s05, s09). |
| Git writes blocked in the sandbox (d9) | Fixed. Prompt rules ask; the agent stopped when refused. |
| Split asked for approvals again | Fixed. `--covers` inherits the approval. |
| Decisions counted twice (d11) | Fixed. "2 decisions" for two items. |
| Setup commit offer (d8) | Not seen. The agent said the files were not committed but did not offer (problem 6). |

## Problems found

1. **Init's Hindsight check gives the wrong fix inside the Codex sandbox, and
   no terminal command.** (medium) s00: "Error: This project uses Hindsight
   memory, but the local Hindsight server at http://127.0.0.1:8888 does not
   answer (The request ... was blocked before it left this computer (EPERM
   ...). This is the Codex sandbox, not the server.). Nothing was written.
   Fix: Check it with toolkit hindsight service status, start it (toolkit
   hindsight service start) after the owner's yes, then run toolkit init
   again." The message says "does not answer" and "not the server" in one
   line, and the fix asks to start a server that is running. `checkHindsight`
   in `plugins/toolkit/lib/project/init.mjs` runs before the `.codex/` write,
   so `refusedWrite` never prints the exact `toolkit init` command. The agent
   wrote the command itself, correctly. Fix: when the client reports the
   sandbox block, throw the same kind of error as `refusedWrite`, with
   `initCommandLine(config, root)` and "Run this in a terminal".
2. **A `--covers` sub-item keeps the template's fill-in guide.** (low) s07:
   WI-002 was created at `03-requirements-approved`, and `toolkit work
   validate` at once warned "The template's fill-in guide comment is still at
   the top of the body". `opNew` in `plugins/toolkit/lib/work/ops.mjs`
   removes the guide only for trackers other than local; `approve
   --requirements` removes it, but a `--covers` child never goes through that
   command. Mike then had to ask for it to be deleted (s13). Fix: call
   `removeItemGuide(body)` in `opNew` when `coverIds` is set.
3. **The delivery offer is listed for a sub-item as well as its parent.**
   (low) s07 and s08 `toolkit work decisions`: "Make the agent-led delivery
   offer for WI-001 (it has 1 sub-item)" and "Make the agent-led delivery
   offer for WI-002 (its roadmap has 2 phases)". The line itself says the
   offer is made "once per goal". Fix: in `collectAgentTodos`
   (`plugins/toolkit/lib/work/decisions.mjs`), skip an item whose parent is
   not `none`.
4. **An owner's hand move of a local item leaves no history row.** (low) The
   s08 briefing reported the move, and s08 was a read-only `work-status`
   session. The SessionStart sync then recorded the new paths, so no later
   briefing listed the move, and no session added the history note
   `work-organize` step 2 asks for. Final WI-001 and WI-002 history has no
   move row. The Notion tracker now writes "Parent changed in Notion by hand"
   rows itself. Fix: have the local sync add a history row for a hand move or
   rename ("Moved by hand: <old path> -> <new path>"), as the Notion tracker
   does.
5. **A memory record's "Why" was written by the agent, and reflect reports it
   as Mike's reason.** (low) Mike said only "remember that I prefer every
   command-line flag to be documented in the README". The saved record has
   "**Why:** Future CLI changes should include discoverable usage
   instructions." The `--reflect` answer then said "He says this helps future
   CLI changes ...". `memory-save` step 4 lists the Why label but does not say
   what to write when the owner gave no reason. Fix: in `memory-save` and
   `references/record-format.md`, say "Why: the owner's reason in his words,
   or 'Not stated by the owner.' Never an inferred reason."
6. **Setup did not offer to commit the setup files.** (low) s01 ended with
   "The setup files are **not committed**." but did not ask whether to commit
   them, as `project-setup` step 8 says. Mike had to ask (s02). Fix: give
   step 8 a fixed closing line, for example "Setup files are not committed.
   Commit them now?"
7. **`work-requirements` wording leads to an invalid requirement status.**
   (low) s06: the agent wrote "**Status:** Finalized — approved by Mike,
   2026-09-27." because step 8 says "mark each approved `R-xx` Finalized with
   who approved it and when". Validate warned "R-01 status ... is not one of
   Refining, Finalized, Superseded." The agent fixed it. Fix: "set each
   `R-xx` Status to `Finalized`, and put who approved it and when in its
   Decision record" (same in `work-decide` step 5).
8. **A `--covers` sub-item shows "Design: none" and "Continue with
   solution-design".** (low) s07: `toolkit work new ... --covers R-02` said
   "Continue with solution-design", and `toolkit work show WI-002` said
   "Design: none", although WI-001's approved design covers it
   (`work-organize` step 6 says the child goes on to planning).
   `work-check` step 1 reads a design only when "Design:" is not `none`, so
   a checker of the child would skip the parent design's acceptance checks.
   Fix: for a covered child of a parent with an approved design, show
   "Design: WI-001's (approved)" and continue with `work-on`.
9. **The delivery offer was asked but never recorded.** (low) s09 asked "would
   you like agents to take responsibility for delivery ...?" through Codex's
   async question tool. `codex exec` cannot answer it, and nothing recorded
   that it was asked: `delivery` stayed `not-offered` to Done, there was no
   Open Questions row, and after stage 07 the to-do disappeared. In the Codex
   app Mike can answer later, but a new session would not know the question
   is open. Fix: `work-delegate` records the offer when it asks (an Open
   Questions row, or a `delivery` value such as `offered`).
10. **Toolkit commands chained in Codex.** (low) s06, s07, s09, and s13 ran
    read commands such as `toolkit work decisions && toolkit work show WI-001
    && toolkit work lifecycle`, which the conventions say not to do in Codex.
    Only `toolkit work` commands on the local tracker were chained, so
    nothing failed. The same habit with a `toolkit memory` command would run
    inside the sandbox and fail with Hindsight. Fix: have the Codex PreToolUse
    hook add a one-line reminder when a shell command joins `toolkit` to
    anything else.
11. **"Resume here" is out of date on Done items.** (low) Both final records
    say "delivered locally and ready to mark Done" under Notes > Resume here,
    because the agent wrote Notes before `toolkit work finish`. Fix:
    `toolkit work finish` sets Resume here to "Finished on <date>. Nothing to
    resume.", or `work-finish` step 8 says to update it.

## Notes on the test method

- `codex exec` cannot answer Codex's async questions (s06 team question, s09
  delivery offer). In the Codex app Mike would answer them. Because of this,
  `solution-design` ran without researcher, architect, or critic agents. The
  design Notes record that no independent critique ran, and Mike then said
  "No helper agents needed for the design" (s07).
- The two doctor warnings about trust come from the `-c projects=...` and
  `--dangerously-bypass-hook-trust` flags.
- Mike's terminal step after s00 is the documented Codex path. It would not be
  needed if Mike switched `toolkit@toolkit-v2` on for the whole computer
  (still his open decision) and approved init outside the sandbox, or set the
  project up from Claude Code.

## Files

- `sessions/`: every session's prompt, command line, `codex exec --json`
  output, summary, hook text, and hook state; `index.txt`.
- `final/`: `WI-001-WORK-ITEM.md`, `WI-001-DESIGN.md`, `WI-002-WORK-ITEM.md`,
  `DASHBOARD.md`, `toolkit.json`, `requirements-greeting-cli-CLI.md`,
  `system-guide-GREETING-CLI.md`, `project-README.md`, `memory-listing.txt`,
  `tracker.txt`, `doctor.txt`, `brief.txt`, `git-and-result.txt`,
  `file-tree.txt`.
- `snapshots/`: `s00b-terminal-init.txt`, `hand-move.txt`,
  `before-move-tree.txt`, `after-move-tree.txt`, `before-move-WI-001.md`,
  `before-move-WI-002.md`, `reflect-terminal.txt`.
- `round-1/`: the round 1 evidence, unchanged.

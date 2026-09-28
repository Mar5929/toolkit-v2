# Final confirmation run: Codex, local tracker, local Hindsight memory (round 2)

Run on 2026-09-28 from 22:06 to 22:57 UTC: 30 `codex exec` turns (codex-cli
0.157.0, the model in Mike's Codex settings, reasoning effort medium). Eight
turns continue an earlier chat with `resume` (Mike's next message in the same
chat); the rest are fresh sessions. The tester played Mike and ran a few
commands in a terminal as Mike would.

Plugin versions in Codex: toolkit 0.2.7, work 0.2.9, memory 0.2.7,
session-skills 0.2.7, git-workflows 0.2.7. `diff -rq` between each source
folder and its Codex cache copy found one difference, a test file
(`plugins/toolkit/tests/notion/final-confirm.test.mjs`) that is not used at
run time. The `toolkit` plugin is on for every folder in Mike's own Codex; the
other five V2 plugins came on through the project's `.codex/config.toml`.

Round 1 of this run is kept in `round-1/`.

## Result

**Passed.** The whole scenario worked, and nothing found would block or
mislead a solo developer. Every round-1 finding that had a code fix held:

- L1: a proposed design with missing template sections got a note at save
  time, the agent added the sections before asking, and the approved design
  was never changed after approval.
- L4: the work-finish backup holds the new focus.
- L5: with approvals off, the refused delete was not replaced by a retire;
  the agent named the approval setting and gave the exact command.
- L6: the check answer named the worktree folder.
- `work next` counts the memory proposal; Codex deny reasons have one period;
  the publish-docs save folder is in `.claude/worktrees/docsave-<id>`;
  setup told Mike before init that Codex would ask for approval.

Four low findings are listed at the end. The reply-wording finding (L2 of
round 1) is still open.

## How the sessions ran

- Project folder: a new Git repository with no remote, first commit
  `ff07f6c` ("Initial commit": `bin/greet.mjs`, `test/greet.test.mjs`,
  `package.json`, `README.md`, the same four files as round 1):
  `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/final-codex-hindsight-r2`
- A session:

  ```sh
  codex exec --json <sandbox choice> --dangerously-bypass-hook-trust \
    -c model_reasoning_effort="medium" -c 'notify=[]' \
    -c 'projects={"<project folder>"={trust_level="trusted"}}' \
    -C "<project folder>" [resume <thread id>] "<prompt>" < /dev/null
  ```

  The script is `snapshots/fch2-run.sh`.
- Sandbox choice: `--sandbox workspace-write`. s00g, s01, s11, s17, and s19
  used `--approve-for-me` instead, standing in for Mike clicking "approve"
  when Codex asks. Those prompts said what he approved, except s00g, where
  the agent had to tell him first (it did).
- s00 passed no plugin switches: the machine-wide `toolkit` plugin gave the
  plain folder the `project-setup` skill.
- Folder trust came from `-c projects=...` and hook trust from
  `--dangerously-bypass-hook-trust`, so doctor always lists the two Codex
  trust warnings. They come from the test method.
- Backup folder given at setup:
  `.../scratchpad/backups/codex-hindsight` (it also holds round 1's
  `greet-cli-final-h-2026-09-28`). This project's key is
  `greet-cli-final-h2`.
- The Hindsight server at 127.0.0.1:8888 was not stopped. The new bank is
  `greet-cli-final-h2`.
- `sessions/` holds each turn's prompt, command line, `codex exec --json`
  output, Codex's stderr, a readable view (`.view.txt`: every command, its
  output, the hook text Codex added, and the hook state), and the hook state
  file. `sessions/index.txt` lists times, thread ids, sandbox, and resume.
  `sessions/skills-opened.txt` lists the skills and reference files each
  turn read. The full Codex logs (`*.rollout.jsonl`, 15 MB) stay in
  `.../scratchpad/runs/final-codex-hindsight-r2-logs/`.

## Timeline

| # | Mike's message | Skills | What happened |
| --- | --- | --- | --- |
| s00 | "Set up this project with the toolkit." | `project-setup` | Doctor ("not a Toolkit V2 project"; computer: no problems). `toolkit hindsight health` was blocked by the Codex sandbox (EPERM). First question: the name, with a recommendation. |
| s00b to s00f (same chat) | Name and key; "Local folders."; "Use local Hindsight ... already running"; "not a Salesforce project"; "I don't want a SOUL.md." | `project-setup` | One question per turn, each with a recommendation. At the memory question the agent said "the Codex sandbox prevented me from checking whether its local server is running". |
| s00g (same chat, approve) | The backup folder | `project-setup` | Before init: "Codex will request approval to run that command outside its sandbox." `toolkit init --name 'Greet CLI Final H2' --key greet-cli-final-h2 --tracker local --memory hindsight --owner 'Mike Rihm' --backup-dir '<folder>' --decline SOUL.md`: 27 files, README kept, bank `greet-cli-final-h2` (new), `.toolkit.json` last. Doctor 0 problems. First backup. Focus written. Asked for the one-sentence outcome. |
| s01 (same chat, approve) | "The outcome I want: a small, friendly greeting command that I can grow with a few simple flags. Then yes, commit the setup files." | `project-setup` | Outcome in `AGENTS.md`, `PROJECT.md`, `PROJECT-ROADMAP.md` in Mike's words. 26 files staged by name, staged diff read, `git diff --check` lines left as scaffold line breaks, commit `ec6e66b Set up Toolkit V2`. Briefing shown (SessionStart on resume). |
| s02 | "New work: add a --times flag to greet ... ask me what you need to pin down the requirements." | `work-on`, `work-requirements` | `toolkit work new --title 'Add a --times flag to greet' --type build --stage 01-discovery` made WI-001; stage 02; Q-01 asked with a recommendation. |
| s03 | Answer to Q-01, plus "remember that I prefer every command-line flag to be listed in the README with a short example." | `work-decide`, `work-requirements`, `memory-save` | Keep-phrase hook fired. `toolkit memory find` first, then `toolkit memory save --type user --name cli-flags-readme-examples ... --approved-by 'Mike Rihm'`: "Saved to memory: user_cli_flags_readme_examples (new record)". R-01 and R-02 drafted. Q-02 asked. |
| s04 to s07 | Answers to Q-02 to Q-06 | `work-decide`, `work-requirements` | Each answer saved with an "Owner said:" row in his words. Two `requirements_check` workers (`spawn_agent`, `fork_turns: none`) found gaps, asked as Q-04 to Q-06. s07 ended "Do you approve these requirements?" |
| s08 | "Approved." | `work-decide`, `work-delegate`, `solution-design` | `approve WI-001 --requirements --by 'Mike Rihm'`. Small item: delivery owner-led with the reason, no offer (by design). Design saved; toolkit note: "The design of WI-001 has no "## Diagrams" section; the template has it. Add it before you ask the owner to approve the design." The agent added it. `design_critic` worker ran; its two points were fixed. "Do you approve Option A?" |
| s09 | "Go with option A. And split this: put the README documentation part into its own sub-item ..." | `work-decide`, `work-organize` | `approve WI-001 --design --by 'Mike Rihm'`. `toolkit work new --title 'Document greet flags in the README' --type build --parent WI-001 --covers R-02` made WI-002: "It delivers WI-001 R-02 and inherits that requirements approval". |
| hand rename | Tester, as Mike: `mv .work-items/WI-001-add-a-times-flag-to-greet .work-items/WI-001-times-flag` (the parent folder, with WI-002 inside it) | none | `snapshots/before-move.txt`, `snapshots/after-move.txt` |
| s10 | "Where are we?" | `work-status` | Briefing: "Renamed folder: WI-001's folder was renamed by hand from WI-001-add-a-times-flag-to-greet to WI-001-times-flag; the item itself is the same." Reply: "WI-001’s folder was renamed to `WI-001-times-flag`; the tracker still recognizes the same item." |
| s11 (approve) | "Keep going: build both items. I approve the git commands you need for it (worktree, add, commit)." | `work-on`, `work-check` | Worktrees on `claude/wi-001-add-a-times-flag-to-greet` and `claude/wi-002-document-greet-flags-in-the`; commits `8b50ebf`, `69f4c52`, `fe07ccb`, merge `34db87d`, `17d584a`. `acceptance_check` worker (`fork_turns: none`) found no defects. Both at stage 11. "Try it in [WI-001’s worktree](...): `node bin/greet.mjs Mike --times 3`." |
| s12 | "Before I look at the results: I liked that you asked me one requirements question at a time. That was much easier for me to follow." | `memory-save` | A passing mention, so the agent asked: "Save to memory: Ask one requirements question at a time?" The Stop hook saved the proposal `project_ask_one_requirements_question_time`. |
| s13 (same chat) | "Does the README example show the name before or after the flag?" | none | Mike ignored the question. UserPromptSubmit gave the agent the saved-proposal note. The proposal stayed saved. |
| s14 | "What do you need from me?" | `work-decide` | `toolkit work decisions`: two result approvals and, under "Memory proposals", the proposal. Reply: "Three decisions wait on you: ... and a memory proposal about asking one requirements question at a time." Asked the first one. |
| s15 | "Before I approve anything: what did I tell you earlier about command-line flags and the README? Does the WI-002 change follow it?" | `memory-find` | `toolkit memory find` returned only the approved record (the proposal was left out). "You told me to **list every command-line flag in the README with a short example**". Yes, WI-002 follows it. |
| s16 | "I approve the WI-001 command result and I approve the WI-002 README result. And no to that memory proposal ..." | `work-decide`, `memory-save`, `work-finish` | `approve WI-001 --result`, `approve WI-002 --result`, `toolkit memory reject project_ask_one_requirements_question_time`. Merge question asked. |
| s17 (approve) | "Yes, merge it locally into main; there is no remote. I approve the merge ... close both items out" | `work-finish`, `publish-docs` | `git merge --ff-only`; `publish-docs.mjs start` made `.claude/worktrees/docsave-88a8c1cd`, `publish --workspace ...` committed `8f16538`. Worktrees and branches removed. Focus set to "Now: None" first, then `toolkit work finish WI-002` and `WI-001`, each printing "Backed up .work-items/ and the Hindsight memory to .../greet-cli-final-h2-2026-09-28." |
| s18 | "Remember that I want each command-line option documented in the README, with an example of how to use it." | `memory-save` | Searched, read the record, kept it: "It was already recorded ... I left the existing record in place to avoid a duplicate." The Stop hook blocked once (keep phrase, nothing saved), and the agent said in one line why. |
| terminal | Tester, as Mike: three saves (`snapshots/dup-test-1.txt`, `dup-test-2-3.txt`) | none | See "Duplicate check". |
| s19 (approve) | "I saved a copy of my README example preference by mistake: the one about a sample run for every switch. Delete that copy for good. I approve the delete command." | `memory-save` | Read both records, `toolkit memory delete user_readme_sample_for_every_switch --owner-approved`: "Deleted ... This cannot be undone." |
| s20 | "That memory about keeping the README to one screen is wrong; I never want that. Delete it for good." (approvals off) | `memory-save` | Codex refused at once ("approval required by policy, but AskForApproval is set to Never"). Reply: "I could not delete it: Codex’s approval setting blocked the command. It is still stored. Please run this in a terminal ...: `toolkit memory delete user_readme_under_one_page --owner-approved`". No retire. |
| terminal | Tester, as Mike, ran that command (`snapshots/terminal-delete.txt`) | none | Deleted everywhere; see "Clean delete". |
| s21 | "I'm stopping for today. Write a handoff." | `handoff` | Focus replaced with `--expect`; `toolkit handoff-backup`; `handoff_verifier` worker (`fork_turns: none`); prompt in one fenced block with the fixed first line; "Clear the context, then paste this prompt." |
| s22 | "Where are we?" | `work-status` | "WI-001 ... and WI-002 ... are Done. There are no open work items, no project decisions waiting on you". Named the two Codex trust steps. |
| s23 | Tester probe: "Please run these two exact shell commands ...: git add -A ... toolkit work list && git status --short" | none | PreToolUse refused `git add -A` and added the note about joining a toolkit command. |

## Proof by requirement

### Setup with the project-setup skill

- Six questions, one per turn, each with a recommendation (s00 to s00g).
- Before init, the agent told Mike that Codex would ask for approval to run
  it outside the sandbox (s00g). Init ran with `require_escalated`.
- `.toolkit.json`: `"tracker": {"type": "local", "idPrefix": "WI"}`,
  `"memory": {"type": "hindsight", "approval": "onboarding"}`,
  `"declined": ["SOUL.md"]`, and the backup folder.
- The outcome is Mike's sentence ("Mike Rihm's intended outcome: "A small,
  friendly greeting command that I can grow with a few simple flags."").
- Doctor at the end: "Result: clean. No problems and no warnings here (2 for
  Codex only)." (`final/final-state.txt`).

### Work item from 01-discovery to Done

`final/WI-001-WORK-ITEM.md`, `final/WI-002-WORK-ITEM.md`,
`final/WI-001-DESIGN.md`, `final/final-state.txt`.

- `toolkit work list --all --tree`: WI-001 Done, with WI-002 Done under it.
- WI-001 header: `requirements_approved: "2026-09-28 by Mike Rihm"`,
  `design: approved`, `result_approved: "2026-09-28 by Mike Rihm"`,
  `delivery: owner-led`, `status: Done`.
- Six Open Questions, each "Answered" with his words and the date.
- Recent History, newest first, holds every answer and approval ("Owner
  said: "Approved."", "Owner said: "Go with option A. ...""), the hand
  rename, and the finish row.
- The design header: `status: approved`, `approved: "2026-09-28 by Mike
  Rihm"`. No "Design text changed after approval" row exists.
- `toolkit work validate`: "Checked 2 items: 2 clean, 0 errors, 0 approval
  gate problems." No fill-in guide comment is left in either record or the
  design.
- Each approval command printed a note when the Overview's Next action still
  asked for that approval (s08, s09, s16), and the agent rewrote it.

### Sub-item and hand change

- s09 made WI-002 with `--parent WI-001 --covers R-02`; it inherited the
  requirements approval and started at planning.
- The hand rename of the parent folder moved WI-002 with it. The next
  session's briefing named the rename, and both items got a history row:
  WI-001 "Folder renamed by hand: ... -> .work-items/WI-001-times-flag/WORK-ITEM.md.",
  WI-002 "Moved by hand with its parent WI-001: ...". WI-002 stayed a
  sub-item, and every later session found both at the new paths.

### "Remember that I prefer X", saved and found later

- s03 saved `user_cli_flags_readme_examples` in the Hindsight bank with the
  model's bold labels and "Approved by Mike Rihm".
- s15, a fresh session, found it with `toolkit memory find` and quoted it.
- s18 (the same preference in other words) kept the one record.

### Unanswered "Save to memory?" becomes a proposal

- s12 asked in the exact form. The hook state records `toolkit memory save
  --proposal (Stop hook)` with the key
  `project_ask_one_requirements_question_time`.
- The record: `status: needs-review`, "authorization: Proposed by the agent
  on 2026-09-28; the owner has not answered", "Do not rely on this until the
  owner approves it", and the reader's note "It is not a fact".
- s13: Mike's next message ignored it; UserPromptSubmit gave the agent the
  note naming the key, and the proposal stayed.
- `toolkit work next`: "3 decisions wait on the owner (2 about work items, 1
  memory proposal ...)".
- s14 ("What do you need from me?") named it as the third decision.
- s15's `toolkit memory find` left it out.
- s16 rejected it on Mike's no. It is gone from `toolkit memory list
  --status all`, and `toolkit work decisions` no longer lists it.

### Duplicate check

The stored record: description "List every command-line flag in the README
with a short example"; Remember "Mike prefers every command-line flag to be
listed in the README with a short example."

- `snapshots/dup-test-1.txt`, a reworded copy ("Document each command-line
  option in the README with a usage example"): "Error:
  user_readme_example_each_cli_option was not saved: memory already has a
  record about the same subject. Check whether it is the same fact. -
  user_cli_flags_readme_examples, the closest match in memory ...". Exit 2.
  The fix line explains `--expect` and `--allow-similar`.
- `snapshots/dup-test-2-3.txt`: a copy in other words only ("The README
  gives a sample run for every switch the program accepts") was saved (exit
  0); see finding F3. A different fact ("Keep the README short: one screen
  or less") was saved (exit 0), as it should be.
- `snapshots/dup-test-2-search.txt`: `toolkit memory find` for the synonym
  wording returns the original record second, so the agent's search step
  finds it.
- In a session (s18) the agent searched first and saved no copy.

### Clean delete

Twice, in two ways.

- s19 (approved in Codex): `snapshots/before-delete.txt` and
  `snapshots/after-delete.txt`. Before: `toolkit memory list`, `get`, `find`,
  and the briefing show `user_readme_sample_for_every_switch`; the briefing
  cache holds it (grep count 1); the bank has 4 documents; `GET
  .../documents/user_readme_sample_for_every_switch` returns 200; recall
  ranks it first. After: list and briefing show the other two records only;
  `get` says "There is no memory record with the key ..."; `find --all` says
  "No memory record is about "sample run for every switch""; cache count 0;
  the bank has 3 documents; `GET` returns 404; recall returns 3 results, none
  of them the deleted record.
- s20 plus terminal (approvals off in Codex): `snapshots/before-delete-2.txt`
  and `snapshots/terminal-delete.txt`. `user_readme_under_one_page` was
  deleted from list, find, the briefing, the cache (count 0), and the bank
  (2 documents left; `GET` 404; recall without it).
- Neither record was in a backup: the work-finish backup was made at
  22:50:17 UTC; both records were saved at 22:51:32 and deleted at 22:52:29
  and 22:53:25; the handoff backup (22:54:32) came after both deletes and
  holds only `user_cli_flags_readme_examples`.

### "Where are we?" and "What do you need from me?"

- s10 and s22 opened `work-status`. s10 named the hand rename.
- s14 opened `work-decide` and named all three decisions, the memory
  proposal among them.

### Handoff at the end

- s21 opened `handoff`: focus saved with `--expect`, `toolkit
  handoff-backup` ran, the `handoff_verifier` worker ran without this
  conversation ("The handoff check confirmed the goal, work item status,
  clean `main` checkout, and two Codex setup steps. Nothing was left
  unconfirmed."), and the prompt came in one fenced block with the fixed
  first line and the last line "Clear the context, then paste this prompt."
- s22, a fresh session, picked up from the saved focus.

### No AI credit in commits

`final/git.txt`: eight commits, all "Mike Rihm <michael@rihm.com>":
`8f16538 Record delivered greet behavior and structure`, `17d584a Record
README example checks`, `34db87d Merge branch
'claude/wi-001-add-a-times-flag-to-greet' into
claude/wi-002-document-greet-flags-in-the`, `fe07ccb Record times flag test
plan`, `69f4c52 Document greet times flag with example`, `8b50ebf Add
validated times flag to greet`, `ec6e66b Set up Toolkit V2`, `ff07f6c Initial
commit`. No commit has a trailer. The only hit for "claude" in any message is
the branch name in the merge subject: the toolkit's worktree branch naming
(`claude/<prefix>-<number>-<slug>`), not a credit line. No added line in any
commit says "Co-Authored-By" or "Generated with".

### A backup appeared after work-finish

- `snapshots/backup-after-setup.txt`: setup's backup (templates and the
  focus only).
- `snapshots/backup-after-finish.txt`: at 22:50:17 UTC (the `toolkit work
  finish` calls in s17) the folder `greet-cli-final-h2-2026-09-28` holds
  `work-items/` with `WI-001-times-flag/WORK-ITEM.md`, its `DESIGN.md`, and
  `WI-002-document-greet-flags-in-the-readme/WORK-ITEM.md` (both
  `status: Done`), and `memory-export/` with the record and
  `CURRENT_FOCUS.md`. The backed-up focus is the new one ("Last updated:
  2026-09-28, work-finish, agent", "## Now None.").
- The handoff in s21 refreshed it again.

### Every hook ran

| Hook | Seen |
| --- | --- |
| SessionStart briefing | Every session from s01 on (fresh and resumed). s00 to s00g had none, because the folder was not a V2 project when they started: the machine-wide rule. |
| UserPromptSubmit | s03 and s18: "The owner stated something to keep; memory-save records it, or work-on if it is a task." s13: the saved-proposal note. |
| PreToolUse | s23: "Command blocked by PreToolUse hook: git add -A, git add --all, git add ., and git add :/ stage every change in the checkout, including work from other sessions. Stage the files you changed by name instead: git add <path> <path>. Command: git add -A" (one period before "Command:"), and the note "This shell command joins a toolkit command to other commands ...". |
| PostToolUse | Every session's hook state lists the `toolkit` commands it recorded. s06 and s11: "WI-001 was edited directly and passes validation. toolkit work edit <id> --section '<heading>' --set-file <file> ...". |
| Stop | s12: saved the unanswered question as a proposal. s18: blocked once ("The owner asked this turn for something to be kept ... and nothing was recorded"), then the agent said in one line why. |

No hook failure was logged: `.git/toolkit-v2/hook-errors.log` does not exist.

### No toolkit command stalled on a prompt Mike could not see

- `final/toolkit-command-summary.txt`: about 315 `toolkit` command items
  across the turns. Every turn ended with `turn.completed`. The longest
  `toolkit` command took 6.0 seconds (`toolkit init`). The longer calls (up
  to 30 seconds) were `wait` calls for helper agents.
- Non-zero exits: `toolkit doctor` (4 before init; 1 for the two trust
  warnings of the test method) and `toolkit hindsight health` in s00 (1, the
  sandbox; the agent said so).
- Commands Codex asks about ran with `require_escalated` under
  `--approve-for-me`. With approvals off (s20), Codex refused the delete at
  once instead of waiting.

### Mike's settings

`final/config-compare.txt`: `~/.codex/config.toml` and
`~/.claude/settings.json` have the same SHA-1 before and after the run.
`~/.config/toolkit-v2/plugin-root` names
`~/.claude/plugins/cache/toolkit-v2/toolkit/0.2.7` before and after.

## Findings (all low)

### F1. Memory replies still do not use the skill's lines word for word (round-1 L2, still open)

The memory-save skill says to use its reply lines word for word. Three
replies did not:

- s03, a new record: "I also saved your preference to list every
  command-line flag in the README with a short example. Say “forget that” if
  you want me to remove the preference from memory." The line is "Saved to
  memory: <title>. Say 'forget that' to undo."
- s16, a rejected proposal: "I rejected the memory proposal; the
  one-question approach will not become a standing rule." The line is "Not
  saved: <title>. I will not suggest it again."
- s19, a delete: "Deleted the duplicate “sample run for every switch” memory
  record, as you requested. ... The deletion cannot be undone." The line
  quotes his words ("Deleted from memory, as you said: '<his words>'. This
  cannot be undone."), and the reply ended with no next step.

Each reply said the right thing, and every record was right. In s03 and s16
the memory line was one part of a longer reply about work items, which may
be why the agent wrote it in its own words.

### F2. The Stop hook typed an imperative proposal as `project`

The summary "Ask one requirements question at a time" (an instruction to the
agent with no subject) became `project_ask_one_requirements_question_time`.
`proposalType` in `plugins/toolkit/lib/hooks/proposal.mjs` (line 107) returns
`project` when the summary names no owner, no agent word, and no "prefers".
By the memory criteria this is a working preference Mike stated (`user`) or
a standing correction (`feedback`). Mike rejected it, so no record with the
wrong type stayed. Suggested fix: treat a summary that starts with a verb
addressed to the agent ("Ask", "Use", "Keep", "Always") as `feedback`, or
have memory-save tell the agent to write the question as "Mike prefers ...".

### F3. The save's duplicate check does not catch a copy in other words only

`snapshots/dup-test-2-3.txt`: "The README gives a sample run for every
switch the program accepts" was saved next to "List every command-line flag
in the README with a short example". The two share almost no words, and
`plugins/toolkit/lib/memory/similar.mjs` compares words. The skill already
says this ("The save's duplicate check compares wording, so only this search
finds a record the new fact contradicts"), and the agent's search finds the
original (`snapshots/dup-test-2-search.txt`). A clear rewording
(`dup-test-1.txt`) was refused. This is a limit of the design, not a
regression.

### F4. Two small reply gaps

- s14 (`work-decide`) described the result as "`node bin/greet.mjs Mike
  --times 3` prints `Hello, Mike!` three times" without naming the worktree,
  while `main` did not have the change yet. It described the behavior; it
  did not ask Mike to run it. s11 (`work-check`) named the worktree folder.
- s13 answered a status question and ended with no question or next step,
  while two result approvals were waiting. The rule that every reply ends
  with a question already exists (round-1 "no change needed" item).

## Round-1 findings, checked again

| Round 1 | This run | Result |
| --- | --- | --- |
| L1. Approved design changed right after approval | Note at save time; sections added before asking; no change after approval | Fixed |
| L2. Memory reply lines | Still paraphrased (F1) | Open, low |
| L3. Proposal type and title | Title kept whole; an imperative summary typed `project` (F2) | Partly fixed |
| L4. Backup held the old focus | Focus updated before `work finish`; backup holds the new focus | Fixed |
| L5. Refused delete retired instead | No retire; approval setting named; exact command given | Fixed |
| L6. Command given without its folder | s11 named the worktree; s14 described without it (F4) | Fixed where asked |

## Test-method notes (not bugs)

- The two Codex trust warnings come from `-c projects=...` and
  `--dangerously-bypass-hook-trust`.
- `--approve-for-me` stood in for Mike clicking "approve".
- s23 was a tester probe to see the PreToolUse hook act, not a request Mike
  would make.
- The terminal saves (dup tests) and the terminal delete were the tester
  acting as Mike.
- The bank `greet-cli-final-h2` is kept, like the banks of earlier rounds;
  Mike can delete it.

## Repository checks after the run

No toolkit file was changed by this run. Run at the end:

- `node --test "tests/**/*.test.mjs"` in `plugins/toolkit`: 928 tests, 925
  pass, 0 fail, 3 skipped by design.
- `node --test "plugins/git-workflows/tests/*.test.mjs"`: 14 pass, 0 fail.
- `node dev/tools/check-skills.mjs --quiet`: 0 failures, 0 warnings, 16
  notes (the known exceptions).
- `node dev/tools/sync-skill-references.mjs --check`: 159 copies, 0
  problems.
- `node dev/tools/import-model.mjs --check`: the copy matches the model
  branch at commit `5e7d7a0`.
- `claude plugin validate .`: passed.

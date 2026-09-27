# Sample run d: local tracker and local Hindsight memory (round 3)

Run on 2026-09-27 from 19:31 to 20:04 UTC, in 14 real `codex exec` sessions
(codex-cli 0.157.0, Mike's model setting, reasoning effort medium). Toolkit V2
version 0.2.2. Before the run, the Codex plugin copies in
`~/.codex/plugins/cache/toolkit-v2/` were compared with the source folders
and matched file for file. Round 1 is kept in `round-1/`, round 2 in
`round-2/`.

## Result

The work item reached Done, with every approval recorded in the owner's
words.

- WI-001 "Add a --shout flag to the greet CLI" (type `build`) went from
  `01-discovery` to Done. The title is Mike's own words. WI-002 "Document
  --shout in the README" was split out of it with
  `toolkit work new --parent WI-001 --covers R-02`. It inherited the
  requirements approval and the parent's approved design, started at stage
  06, got its own result approval, and reached Done before its parent.
- Between sessions s07 and s08 the tester, as Mike, made a new group folder
  `docs/` inside WI-001's folder and moved WI-002's folder into it under a new
  name, `WI-002-readme`. The s08 briefing reported the move, the reply told
  Mike in one line, the next `toolkit work` command wrote the history row
  "Moved by hand: ... Its parent stays WI-001. Group: docs.", and every later
  session found WI-002 at its new path.
- "Remember that I prefer every command-line flag to be documented in the
  README" (s05) was saved to the Hindsight bank `greet-cli-sample-d3`. A later
  session (s11) found it with `toolkit memory find` and quoted it back.
  `toolkit memory find ... --reflect` answered from Hindsight in 33.3 seconds.
- "Where are we?" (s08) opened `work-status`. "What do you need from me?"
  (s09) opened `work-decide`, which found one decision and asked it with a
  recommendation.
- Hooks: the session-start briefing arrived in all 13 sessions after setup.
  The keep-phrase line fired on "remember that" (s05). The PreToolUse note
  fired on a chained toolkit command (s07). The post-edit check ran when the
  agent edited `WORK-ITEM.md` files directly (s12). The Stop hook updated the
  hook state at the end of every session and never blocked.
- Setup: "Set up this project with the toolkit" opened `project-setup`, not
  the older `project-init`, with both listed. Inside the Codex sandbox, init
  stopped with the new message ("The Codex sandbox blocked init's request ...
  Nothing was written.") and the exact terminal command. The tester ran it as
  Mike, and s01 finished setup without creating a work item and ended with
  "Setup files are not committed. Commit them now?"

Twelve problems were found. All are low or medium. None blocked the work
item. They are listed under "Problems found".

## How the sessions ran

- Project folder (a new Git repository with no remote; the first commit holds
  `bin/greet.mjs`, `test/greet.test.mjs`, `package.json`, and `README.md`, the
  same files as rounds 1 and 2):
  `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/d-local-hindsight-r3`
- Every session was a fresh process:

  ```sh
  codex exec --json <sandbox choice> --dangerously-bypass-hook-trust \
    -c model_reasoning_effort="medium" -c 'notify=[]' \
    -c 'projects={"<project folder>"={trust_level="trusted"}}' \
    -C "<project folder>" "<prompt>" < /dev/null
  ```

- Sandbox choice: `--sandbox workspace-write`, except s03, s10, and s13, which
  used `--approve-for-me`. That flag sends Codex's approval requests to its
  automatic reviewer. It stands in for Mike clicking "approve" on the Git
  commands the project's `.codex/rules/toolkit.rules` asks about. In each of
  those three sessions, Mike's prompt said he approved the Git commands.
- s00 also passed
  `-c 'plugins={"toolkit@toolkit-v2"={enabled=true},"project-init@claude-toolkit"={enabled=true},"second-brain@claude-toolkit"={enabled=true},"git-workflows@claude-toolkit"={enabled=true},"sf-architect-solutioning@claude-toolkit"={enabled=true}}'`
  so the toolkit plugin was on for that one run and the older setup plugins
  stayed on too. No later session changed a plugin switch; the project's own
  `.codex/config.toml` did that.
- Folder trust came from the `-c projects=...` value and hook trust from
  `--dangerously-bypass-hook-trust`. So `toolkit doctor` always warns "Codex
  does not trust this folder" and "The Toolkit V2 hooks are not trusted in
  Codex yet". Both warnings come from the test method. The hook-delivered
  briefing no longer carries them (codex-setup finding 2 is fixed).
- `~/.codex/config.toml` was copied before the run and compared after it.
  They match.
- The Hindsight server at 127.0.0.1:8888 was not stopped or reinstalled. It
  had 19 banks before the run and 20 after; the only new one is
  `greet-cli-sample-d3`.
- `sessions/` holds, for each session, the prompt (`.prompt.txt`), the
  command line (`.command.txt`), the `codex exec --json` output (`.jsonl`), a
  readable summary with every tool call and its `toolkit` output from the
  Codex session log (`.summary.txt`), the hook text Codex added
  (`.hooks.txt`), and the hook state the toolkit wrote (`.hookstate.json`).
  `sessions/index.txt` lists start and end times and thread ids. The full
  Codex session logs stay in the scratch folder
  `.../scratchpad/runs/d-local-hindsight-r3-logs/` (`*.rollout.jsonl`).
- "Skills opened" comes from the `SKILL.md` files each session read, taken
  from the Codex session log.

## Timeline

| # | Mike's prompt | Skills opened | What happened |
| --- | --- | --- | --- |
| s00 | "Set up this project with the toolkit: the project name is Greet CLI Sample D3, key greet-cli-sample-d3, id prefix WI, owner Mike. Track work items in local folders. Use local Hindsight for memory. It is not a Salesforce project. I use both Claude Code and Codex. I don't want a SOUL.md." | `project-setup` | `toolkit init ... --memory hindsight ... --decline SOUL.md` stopped: "The Codex sandbox blocked init's request to the local Hindsight server ... The server itself may be running. Nothing was written." The agent gave the exact terminal command and kept every answer. |
| terminal | Tester, as Mike, ran that command (`snapshots/s00b-terminal-init.txt`) | none | Added 27 files, kept the project's own `README.md`, created bank `greet-cli-sample-d3`, wrote `.toolkit.json` last. |
| s01 | "I ran the toolkit init command in a terminal and it finished. Finish setting up the project." | `project-setup`, `publish-docs`, `memory-save` | Sync dry run, doctor (0 problems), `hindsight service status`, `ensure-bank`. Filled `AGENTS.md`, `PROJECT.md`, `PROJECT-ROADMAP.md`. Owner steps went to the current focus under "Waiting on the owner". No work item. Last line: "Setup files are not committed. Commit them now?" |
| s02 | "Yes, commit the setup files. Also, the outcome I want for this project: a small, friendly greeting command that I can grow with a few simple flags." | `work-on`, `publish-docs` | Wrote the outcome into `PROJECT.md` and the roadmap. `git add` was refused ("approval required by policy, but AskForApproval is set to Never"). The agent stopped and gave Mike the exact `git add`, `git diff --cached`, and `git commit` commands. |
| s03 | "Please do the commit for me. I approve the git add and git commit commands." (`--approve-for-me`) | `publish-docs` | `git add` asked with `sandbox_permissions: require_escalated` and the reason "May I stage the reviewed project setup files for the commit you approved?". Staged 26 files by name, read the staged diff, committed `333b9f9 Add Toolkit project setup`. |
| s04 | "New work: Add a --shout flag to the greet CLI. It should print the greeting in capital letters. Track it as a work item and ask me what you need to pin down the requirements." | `work-on`, `work-requirements` | `toolkit work new --title "Add a --shout flag to the greet CLI" --type build --stage 01-discovery` made WI-001. Starting request in Mike's words, stage 02, Q-01 asked with a recommendation, waiting on owner. |
| s05 | "Yes, go with your recommendation: the whole greeting in capitals, like HELLO, MIKE!, and the flag works before or after the name. Also, remember that I prefer every command-line flag to be documented in the README." | `work-decide`, `work-on`, `memory-save`, `work-requirements` | Keep-phrase hook fired. `toolkit memory save --type user --name document-cli-flags-in-readme ... --approved-by Mike`: "Saved to memory: user_document_cli_flags_in_readme (new record). Where: Hindsight bank greet-cli-sample-d3". Why: "Not stated by the owner." Q-01 answered, R-01 and R-02 drafted, a `requirements-analyst` worker (`spawn_agent`, `fork_turns: none`) said "ready for owner review", then "Do you approve these requirements?" |
| s06 | "Approved." | `work-decide`, `work-on`, `work-requirements`, `solution-design` | History note "Owner's words: Approved." first, R-xx set to Finalized, `toolkit work approve WI-001 --requirements --by Mike`. Went to `solution-design` (stage 04), saved Option A as proposed, said "No independent design critique ran", asked "Do you approve the proposed design?" (see problem 3 for the fetch message). |
| s07 | "Go with option A. And split this: put the README documentation part into its own sub-item, so it can be built and checked on its own." | `work-decide`, `work-organize`, `work-on`, `work-delegate` | `approve WI-001 --design --by Mike`, stage 05, `toolkit work new --title "Document --shout in the README" --type task --parent WI-001 --covers R-02`: "Created WI-002 ... (06 Implementation plan ...). It delivers WI-001 R-02 and inherits that requirements approval ... WI-001's approved design covers it". Validate warned on a "—" Open Questions row; the agent removed it. Then the delivery offer went in as Q-02, waiting on owner. |
| move | Tester, as Mike: `mkdir .work-items/WI-001-add-a-shout-flag-to-the-greet-cli/docs` and `mv .../WI-002-document-shout-in-the-readme .../docs/WI-002-readme` | none | Trees before and after: `snapshots/before-move.txt`, `snapshots/after-move.txt`. |
| s08 | "Where are we?" | `work-status` | Briefing: "Moved: WI-002 from .work-items/WI-001-add-a-shout-flag-to-the-greet-cli/WI-002-document-shout-in-the-readme/WORK-ITEM.md to .work-items/WI-001-add-a-shout-flag-to-the-greet-cli/docs/WI-002-readme/WORK-ITEM.md." Reply led with "One decision waits on you", gave one line per item, and said "WI-002 was moved into a `docs/` group; the tracker still finds it." |
| s09 | "What do you need from me?" | `work-decide`, `work-delegate` | One decision (Q-02), asked with "I recommend yes" and what happens after each answer. |
| s10 | "No, work with me directly. It's a small change, so no helper agents. Keep going with the build. I approve the git commands you need for it (worktree, add, commit)." (`--approve-for-me`) | `work-decide`, `work-on`, `work-delegate`, `work-check`, `memory-save` | Q-02 answered, `--delivery owner-led`, tasks planned, worktrees `.claude/worktrees/wi-001-shout` and `wi-002-readme` on `claude/wi-...` branches, stages 07 and 08, built the flag and 3 tests (`b96f56b`), README examples (`f794cc6`), checked both, both at stage 11 waiting on owner. Said "No independent checker ran, as you requested no helper agents." |
| s11 | "Before I approve anything: what did I tell you earlier about command-line flags and the README? Does this change follow it?" | `memory-find` | `toolkit memory find "command-line flags README"` and `toolkit memory get user_document_cli_flags_in_readme` from Hindsight. Reply: "You told me: 'I prefer every command-line flag to be documented in the README.' That is saved as the project preference `user_document_cli_flags_in_readme` ... Yes, the proposed change follows it." |
| s12 | "Good. I approve both results, the CLI and the README. Also add this line to WI-002's Decisions and context: 'Mike checked the README examples himself.' Just edit the file directly." | `work-decide`, `work-finish`, `memory-save` | `approve WI-001 --result --by Mike` and `approve WI-002 --result --by Mike`, each with a history note in Mike's words. Edited WI-002 (and WI-001) with `apply_patch`; the PostToolUse hook answered "WI-002 was edited directly and passes validation." |
| s13 | "Ship both and merge to main. There is no remote, so merge locally. I approve the merge and the git commands you need, and you can close both items out when they are done." (`--approve-for-me`) | `work-finish`, `work-on`, `publish-docs`, `memory-save` | Stage 12, `git merge --ff-only claude/wi-001-shout`, "No remote: merged locally into main." note, stage 14, wrote `requirements/greeting/AREA.md` and `system-guide/greeting.md` (`5c6adf9`), removed both worktrees and branches, `toolkit work finish WI-002 --by Mike --evidence ...` then WI-001. Focus cleared. |
| terminal | Tester ran `toolkit memory find "What does Mike prefer for command-line flags, and why?" --reflect` | none | Answer in 33.3 s (`snapshots/reflect-terminal.txt`). |

## Proof by requirement

### Setup (`project-setup`)

- s00 chose `project-setup` with the older `project-init` also listed.
- Init output inside the sandbox (s00): "Error: The Codex sandbox blocked
  init's request to the local Hindsight server at http://127.0.0.1:8888, so
  init cannot check it from here. The server itself may be running. Nothing
  was written. Fix: Ask the owner to run this in a Terminal window ...".
- s01 created no work item for setup. The current focus it saved has
  "Waiting on the owner" lines for the Codex trust steps and "Start a new
  session after setup". Its last line was "Setup files are not committed.
  Commit them now?"
- Doctor after setup and at the end: "Result: 0 problems and 2 warnings."
  (both trust warnings come from the test method). Doctor notes use the new
  wording: "README.md is the project's own file from before the toolkit, so
  sync leaves it alone ..." (`final/doctor.txt`).

### The work item, stage by stage

WI-001 history (newest first, `final/WI-001-WORK-ITEM.md`) shows every step:
Created at 01 -> 02 -> "Owner's words: Yes, go with your recommendation ..."
-> "Owner's words: Approved." -> "Requirements approved by Mike." -> 04 ->
design created, proposed -> "Design approved by Mike." -> "Owner's words: Go
with option A. ..." -> 05 -> "Sub-item WI-002 created" -> Q-02 answered ->
06 -> 07 -> 08 -> 09 -> check note -> 11 -> "Result approved by Mike." ->
"Owner's words: Good. I approve both results ..." -> "Owner's words: Ship
both ..." -> 12 -> "No remote: merged locally into main." -> 14 -> delivered
records -> "Finished. Result approved earlier (2026-09-27 by Mike); marked
Done by Mike."

Front matter at the end:

```text
WI-001: stage 14-spec-update, status Done, requirements_approved "2026-09-27 by Mike",
        design approved, result_approved "2026-09-27 by Mike", delivery owner-led
WI-002: parent WI-001, stage 14-spec-update, status Done,
        requirements_approved "2026-09-27 by Mike", result_approved "2026-09-27 by Mike"
```

`toolkit work show` prints "Stage: Done" for both. Notes > Resume here reads
"Finished on 2026-09-27. Nothing to resume." Both Roadmaps have every phase
at Done. `toolkit work validate --all`: "2 clean, 0 errors".

Code result (`final/git-and-result.txt`): `main` holds `b96f56b Add shout
flag to greet CLI`, `f794cc6 Document shout flag in README`, and `5c6adf9
Record delivered greeting behavior`. `npm test`: 5 pass, 0 fail.
`node bin/greet.mjs --shout Mike` and `Mike --shout` print `HELLO, MIKE!`;
`--shout` alone prints `HELLO, WORLD!`; without the flag the output is
unchanged. No worktree or branch is left.

### Sub-item

- s07: "Created WI-002: Document --shout in the README (06 Implementation
  plan, In Progress, sub-item of WI-001) ... It delivers WI-001 R-02 and
  inherits that requirements approval (2026-09-27 by Mike). WI-001's approved
  design covers it, so it starts at planning with no design of its own.
  Continue with work-on."
- `toolkit work show WI-002`: "Design: none of its own; WI-001's design is
  approved (...). Read it with: toolkit work design WI-001".
- The parent's Roadmap lists WI-002 in the Sub-items column of phase P2.
- WI-002 got its own check (s10) and its own result approval (s12) and was
  finished first (s13).

### Hand move

- Before and after: `snapshots/before-move.txt`, `snapshots/after-move.txt`.
- s08 briefing: "Changes found in the tracker since the last toolkit command.
  ... - Moved: WI-002 from .work-items/WI-001-add-a-shout-flag-to-the-greet-cli/WI-002-document-shout-in-the-readme/WORK-ITEM.md
  to .work-items/WI-001-add-a-shout-flag-to-the-greet-cli/docs/WI-002-readme/WORK-ITEM.md."
- s08 reply: "WI-002 was moved into a `docs/` group; the tracker still finds
  it."
- WI-002 history row, written by the next `toolkit work` command: "Moved by
  hand: ... -> .work-items/WI-001-add-a-shout-flag-to-the-greet-cli/docs/WI-002-readme/WORK-ITEM.md.
  | Its parent stays WI-001. Group: docs."
- `toolkit work list --tree` and the dashboard tree show
  `WI-001 > docs/ (group) > WI-002` in s08 and at the end.

### Memory (Hindsight)

- Save (s05): "Saved to memory: user_document_cli_flags_in_readme (new
  record). Where: Hindsight bank greet-cli-sample-d3 at http://127.0.0.1:8888
  ... Approved by: Mike".
- Found in a later session (s11) with `toolkit memory find` and
  `toolkit memory get`, and quoted back to Mike.
- Reflect (terminal, 33.3 s): "Mike prefers that every command-line flag be
  documented in the project's README. He stated this explicitly in a chat
  message on 27 September 2026 and it is a standing preference for the
  project. The reason for this preference was not provided by Mike, so the
  available records do not contain an explanation."
- `toolkit hindsight health` at the end: "This project's bank
  greet-cli-sample-d3: 2 documents" (the record and the current focus).
  Listing: `final/memory-listing.txt`.

### Status and decisions

- s08 "Where are we?": `work-status`, read commands only
  (`toolkit work lifecycle`, `decisions`, `next`, `list --tree`,
  `memory focus`). The tracker sync inside those commands wrote the hand-move
  history row; the agent changed nothing.
- s09 "What do you need from me?": `work-decide`; "I need one decision for
  WI-001: Would you like agents to take responsibility for delivering the
  `--shout` flag and its README documentation, with you as product owner? I
  recommend yes. ..."

### Hooks

| Hook | Proof |
| --- | --- |
| SessionStart briefing | "Project briefing: Greet CLI Sample D3 ..." in every session s01 to s13 (`sessions/*.hooks.txt`). |
| UserPromptSubmit keep phrase | s05: "The owner stated something to keep; memory-save records it, or work-on if it is a task." Hook state `keep: "remember that"`. |
| PreToolUse note | s07: "This shell command joins a toolkit command to other commands (&&, ;, a pipe, a heredoc, or cd). ..." |
| PostToolUse edit check | s12: "WI-002 was edited directly and passes validation. ..." Hook state lists both edited records (WI-002 and WI-001). |
| PostToolUse command records | Every session that ran a writing `toolkit` command has records in `sessions/*.hookstate.json` (for example 27 in s10). |
| Stop | The hook state's `updated` time is 1 to 4 seconds before each session ended, after the last tool record; `stopBlocked` is false in every session. |

### Round 3 fixes seen working in this run

a1 (no setup work item), a2 (hand-move history row), a3 (requirements
approval leads to `solution-design`), a6 (commit offer as the last line), a7
(escalated `git add` with a reason; exact commands when Codex refuses), a8
(the PreToolUse note fired), a10 (`--covers` sub-item at 06 with the parent's
design), a12 (delivery offer as Q-02, waiting for the answer), a13 (Roadmap
phases Done before finish), a14 (Effect column filled; a waiting-only change
joins the newest row), b1 (requirements approval asked once), b10 (approvals
in double quotes), b12 (warning on a "—" question row), b14 (preexisting
README wording), c9 ("No remote: merged locally" note and stage 12), c11
("Stage: Done"), d1 (init's sandbox message), d3 (the agent to-do lists only
the top item), d5 ("Why: Not stated by the owner."), d7 (R-xx Finalized with
who and when), d11 (Resume here "Finished on 2026-09-27. Nothing to resume.").

## Problems found

1. **The delivery offer is listed twice while it waits.** After s07 added the
   offer as Q-02, `toolkit work decisions`, the briefing, and `DASHBOARD.md`
   showed both "Q-02: Would you like agents to take responsibility ..." and
   "Agent to-do: Make the agent-led delivery offer for WI-001 (it has 1
   sub-item)." until s10 recorded the answer (s07 end, s08, s09, s10 start).
   The agent handled it, but a reader sees an offer still "to make" that was
   already made. Fix: in `lib/work/decisions.mjs`, drop the delivery to-do
   when the item has an open Open Questions row about delivery (Affects
   `delivery`), the same way a4 folded the design question.
2. **A Done item keeps a stale Overview.** `toolkit work finish` set Next
   action to "None. Finished." but left "Current position: Built and checked
   on claude/wi-001-shout at f794cc6 ..." (a branch that was deleted) and
   "Blockers: Local merge to main needs Mike's approval ..." on both Done
   items (`final/WI-001-WORK-ITEM.md`, `final/WI-002-WORK-ITEM.md`). Fix:
   `work finish` also sets Blockers to "None." and Current position to "Done
   on <date>. <evidence>", or validate warns on a Done item whose Blockers is
   not "None."
3. **`git fetch` with no remote became a false blocker.** In s05 and s06 the
   agent ran `git fetch origin` in a batch without checking `git remote`
   first (the model rule `shared-repository-work.md` says to). In s06 it then
   told Mike: "Automatic approval review rejected `git fetch origin` because
   this session cannot request Git approval. That will need resolving before
   the build worktree is created." and wrote into WI-001's Resume here "Git
   fetch was refused by the current sandbox approval policy, so check
   repository access before creating a worktree for the build." The
   repository has no remote, so there was nothing to resolve. Fix: the model
   rule change already put to Mike (run `git remote` first, skip fetch when
   it prints nothing); until then, add one line to the work conventions
   header that every skill carries: "No remote: never run git fetch, and
   never report a fetch refusal as a blocker."
4. **`publish-docs` has no path for a repository with no remote.** Its script
   fetches `origin` in `start` and pushes and verifies on `origin` in
   `publish`. `work-finish` step 4 says to save the `requirements/` and
   `system-guide/` updates with `publish-docs`. In s13 the agent said "The
   documentation publisher requires a remote, so I'll commit those records on
   the WI-001 worktree and merge them locally", which worked but is not
   written anywhere. Fix: a `--local` mode (or automatic when `git remote`
   prints nothing) that commits in the save worktree and fast-forwards the
   default branch, and a matching line in `work-finish` step 4 and
   `closing.md`.
5. **Setup filled the project outcome without asking.** In s01 the agent
   wrote "Intended outcome: The command prints `Hello, <name>!` ..." into
   `PROJECT.md` and an outcome line into `AGENTS.md` and
   `PROJECT-ROADMAP.md`, taken from the code and tests. `project-setup` step
   5 says to fill them "only with facts the owner confirmed (the one-sentence
   outcome ...)". Mike's real outcome came only because he volunteered it in
   s02. Round 2 asked for it. Fix: step 5 says in so many words "ask the
   owner for the one-sentence outcome; never write it from the code", and
   the reply lists it as the one question when it is unknown.
6. **The current focus went stale for four sessions.** s05 set "Next session
   starts with: ... record Mike's answer to the requirements approval
   question". s06 (requirements approved, design proposed) and s07 (design
   approved, split, delivery offer) did not update it, so the s07 to s10
   briefings carried that line while WI-001 was at stages 04 and 05 (s08's
   `toolkit memory focus` output). s10 fixed it. Fix: `work-on` step
   10 and the last step of `work-decide`, `solution-design`, and
   `work-organize` say to update "Now" and "Next session starts with" when
   the next step changed; or the briefing marks a focus older than the newest
   item history row as possibly out of date.
7. **`Continue with: work-finish` on a Done item.** `toolkit work show`
   prints "Stage: Done | Waiting on: none | Continue with: work-finish" for
   both finished items, because the lifecycle table gives "(Done) ...
   Continue with: work-finish" and "(Cancelled) ... Continue with:
   work-finish". A solo developer reads that as work left to do. Fix: show
   "Continue with: nothing (finished)" for Done and Cancelled, in the
   lifecycle table and in `show`.
8. **"0 questions for the owner" while a question waits on him.** Every
   `toolkit work validate` in s04 to s07 printed "Checked 1 item: 1 clean, 0
   errors, 0 questions for the owner." while Q-01 or Q-02 was Open with
   "owner" and the item was waiting on the owner. The count is gate
   questions only (`lib/commands/work.mjs` line 573). Fix: say "0 approval
   gate problems" or count open owner questions too.
9. **A toolkit command was still chained once.** s07 ran
   `toolkit work show WI-001 && toolkit work decisions && toolkit work show WI-001 --path && cat PROJECT-ROADMAP.md && git status --short`.
   The new PreToolUse note fired and the agent ran every later toolkit
   command alone. The reads worked because they touched only local files.
   No toolkit change is needed beyond the note; noted so the next round
   watches for it.
10. **History row mixes two changes.** WI-001 has "Design updated (status
    approved). | The design can be built. Now waiting on the owner." The
    waiting was for Q-02 (the delivery offer), not the design, but the a14
    join put "Now waiting on the owner" on the design row. Fix: join a
    waiting-only change into the newest row only when that row came from the
    same command, otherwise write "Now waiting on the owner (Q-02)." as its
    own row, naming the open question.
11. **Some replies end without a next step.** s03 ("Committed ... No remote
    is configured, so the commit is local."), s11 (Mike said "Before I
    approve anything", and the reply answered the memory question but did
    not bring back the pending approval question), and s13 (Done, with no
    "tell me the next thing to build"). The b8 rule is in the work skills;
    `memory-find` and the setup commit path do not carry it. Fix: put the
    one-line ending rule in `memory-find` and `publish-docs`, and have
    `memory-find` return to a pending decision when the owner framed the
    question around it.
12. **Owner reminders in the current focus are never checked off.** "Start a
    new session after setup so Claude Code loads the project settings ...;
    check at the next session." stayed under "Waiting on the owner" from s01
    to the end (`final/brief.txt`). No session checked it. Fix: the briefing
    or `memory-save` drops or asks about "check at the next session" lines
    older than one session; or `project-setup` writes that reminder into the
    reply only.

## Files

- `sessions/`: every session's prompt, command, JSON output, summary, hook
  text, and hook state; `sessions/index.txt`.
- `snapshots/`: the terminal init (`s00b-terminal-init.txt`), the trees
  before and after the hand move, and the reflect answer.
- `final/`: both `WORK-ITEM.md` files, WI-001's `DESIGN.md`, `DASHBOARD.md`,
  `.toolkit.json`, the project `README.md`, the delivered
  `requirements/greeting/AREA.md` and `system-guide/greeting.md`, doctor,
  brief, the memory listing, the file tree, and `git-and-result.txt` (Git
  log, tests, CLI output, tracker tree, validate, decisions).

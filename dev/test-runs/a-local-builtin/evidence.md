# Sample run a: local tracker and built-in memory (round 3)

Run on 2026-09-27 from 19:31 to 20:22 UTC, in 17 real `codex exec` sessions
(codex-cli 0.157.0, model `gpt-6-sol` from Mike's Codex settings, reasoning
effort medium). Toolkit V2 version 0.2.2 (`toolkit`, `work`, `memory`,
`git-workflows`; `session-skills` 0.2.0). Before the run, the Codex plugin
copies in `~/.codex/plugins/cache/toolkit-v2/` were compared with the source
folders and matched file for file. Round 2 is kept in `round-2/`, round 1 in
`round-1/`.

## Result

The work item reached Done, with every approval recorded in the owner's words.

- WI-001 "Add a --version flag to the greet CLI" (type `build`), renamed
  "Build the basic greet CLI" at the split, went from `01-discovery` to Done.
  WI-002 "Add a --version flag to the greet CLI" was split out of it with
  `toolkit work new --parent WI-001 --covers R-02`. It inherited the
  requirements approval and the approved design, started at `06`, got its own
  result approval, and reached Done before its parent. Setup made no work
  item this time.
- Between s07 and s08 the tester, as Mike, made a group folder `cli/`, moved
  WI-001's folder into it under a new name `WI-001-basic-greet-cli`, and
  renamed the sub-item folder to `version-flag`. The s08 briefing reported
  both changes. The first toolkit command in s08 wrote a history row on each
  item: "Moved by hand: ... Group: cli." on WI-001 and "Folder renamed by hand:
  ... Its parent WI-001 moved too." on WI-002. Every later command found both
  items at the new paths.
- "Remember that I prefer plain Node.js with no npm packages, and tests
  written with the built-in node:test runner" (s02) was saved as
  `.memory/user_nodejs_development_preferences.md`. s06's design listed it as
  a constraint, the build used no npm packages and `node:test`, and s14
  answered "Do you remember how I like code and tests written" from it,
  naming the record.
- "Where are we?" (s09) opened `work-status`, changed nothing, and counted 2
  decisions, one line each. "What do you need from me?" (s10) opened
  `work-decide` and asked one decision with a recommendation.
- Hooks: the session-start briefing arrived in all 16 sessions after init.
  The keep-phrase line fired on "Remember that" (s02). The post-edit check
  ran on both direct patches of a `WORK-ITEM.md` (s06, s15), and the pre-edit
  guard refused a patch of a record's header (s15). The new Codex note about
  joined toolkit commands fired 3 times (s00a, s04, s13). The Stop hook
  updated the hook state at the end of every turn and never blocked.
- Git: five commits by Mike Rihm, no AI credit. Codex asked for escalated
  permissions with a one-line reason for every Git write. Where the session
  could not ask (s07), the agent stopped, gave Mike the exact command, and set
  the item waiting on him.

Twelve problems were found. None blocked the work item. Two are medium. They
are listed under "Problems found".

## How the sessions ran

- Project folder, a new Git repository whose first commit holds only a
  three-line `README.md`:
  `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/a-local-builtin-r3`
- Every session was a fresh process:

  ```sh
  codex exec --json <sandbox choice> --dangerously-bypass-hook-trust \
    -c 'model_reasoning_effort="medium"' -c 'notify=[]' \
    -c 'projects={"<project folder>"={trust_level="trusted"}}' \
    -C "<project folder>" "<prompt>" < /dev/null
  ```

- Sandbox choice: `--sandbox workspace-write`, except s00a, s00b, s08, and
  s13, which used `--approve-for-me`. That flag sends Codex's approval
  requests to its automatic reviewer. It stands in for Mike clicking
  "approve" when Codex asks to run init or a Git write outside the sandbox,
  and it was used only in sessions whose prompt approved those commands.
- s00a also turned the `toolkit` plugin on for that one run with
  `-c 'plugins={"toolkit@toolkit-v2"={enabled=true}}'`, because a new folder
  has no `.codex/config.toml` yet. This stands in for Mike's pending decision
  about switching `toolkit@toolkit-v2` on for the whole computer.
- `~/.codex/config.toml` was not changed by this run (checked with `diff`
  against a copy taken before s00a), and `~/.codex/rules/default.rules` was
  not written (last changed 2026-09-19), although the agent passed
  `prefix_rule` with its escalation requests.
- For each session, `sessions/` holds the exact prompt (`.prompt.txt`), the
  exact command (`.command.txt`), the `codex exec --json` output (`.jsonl`),
  a readable summary with every tool call from the Codex session log
  (`.summary.txt`), the hook messages Codex added (`.hooks.txt`), the hook
  state file the toolkit wrote (`.hookstate.json`), and the skill files,
  references, and helper agents the agent opened, taken from the session log
  (`.skills.txt`). `sessions/index.txt` lists start and end times, thread
  ids, exit codes, sandbox choice, and skills. The full Codex session logs
  stay in the scratch folder `.../scratchpad/runs/a-local-builtin-r3-logs/`
  (`*.rollout.jsonl`).
- This Codex version runs shell commands from a JavaScript tool
  (`tools.exec_command`, often several in one `Promise.allSettled`). Each
  `exec_command` is still one shell command, and the toolkit hooks see each
  one as a `Bash` call.

## Timeline

| Session | Mike's prompt (short form) | Skills opened | What happened |
| --- | --- | --- | --- |
| s00a | "Set up this project with the toolkit: project name greet, key greet, owner Mike. Track work in local folders. ... built-in .memory/ ... not a Salesforce project. I do not want a SOUL.md. If Codex asks to run the setup command outside the sandbox, I approve that." | `project-setup` (also read the older `project-init` skill file, problem 11) | First `toolkit init` in the sandbox stopped: "Could not write .../.codex/config.toml: EPERM ... no other setup file was written". The agent ran the printed command with `sandbox_permissions: require_escalated`: "Added 33 files ... Wrote .toolkit.json last." Doctor: 0 problems, 2 trust warnings from the harness. Filled `AGENTS.md` and `PROJECT.md`, wrote the current focus. No work item. Last line: "Setup files are not committed. Commit them now?" |
| s00b | "Yes, commit the setup files. I approve the git commands for that one commit when Codex asks." | none | Staged 13 paths by name, escalated `git add` and `git commit`: commit `00e30a2`. |
| s01 | "Add a --version flag to the greet CLI. There is no greet CLI yet, so it has to be built too: a tiny Node.js tool where `node bin/greet.js Mike` prints `Hello, Mike!`." | `work-on`, `work-requirements` | `toolkit work new --title "Add a --version flag to the greet CLI" --type build --stage 01-discovery` made WI-001 in the owner's words. The first Starting request save ran the backticked text as shell commands (problem 2); the agent saved it again. R-01, R-02, Q-01. Asked "What initial version should `--version` print? I recommend `0.1.0`." |
| s02 | "Remember that I prefer plain Node.js with no npm packages, and tests written with the built-in node:test runner." | `memory-save` | Keep-phrase hook line. `toolkit memory save --type user --name nodejs-development-preferences ... --approved-by Mike`, "Why: Not stated by the owner." Saved again to remove a doubled "Remember:" label. Read back with `toolkit memory get`. |
| s03 | "Use 0.1.0. Also, with no name it should print `Hello, world!`, and --version wins when a name is also given. Show me the requirements again after that." | `work-decide`, `work-requirements`, `work-on`, `requirements-analyst` helper | Q-01 Answered, owner's words note, Agreed goal written, R-01 and R-02 updated, spec check by a `spawn_agent` worker (`fork_turns: none`). Asked "Do you approve these requirements?" |
| s04 | "Approved." | `work-decide`, `work-on`, `work-requirements`, `memory-save` | "Owner's words: Approved." note first, R-01 and R-02 Finalized with the approval in their Decision record, `toolkit work approve WI-001 --requirements --by Mike`. Ended with "The next step is solution design. Say 'keep going' and I'll continue WI-001." Asked once. |
| s05 | "Keep going." | `work-on`, `work-delegate`, `solution-design` | Delivery: `toolkit work set WI-001 --delivery owner-led --note "Small item: one or two tasks, so no delivery offer."` Stage 04, `toolkit work design WI-001 --create`, design context written from a `mktemp -d` folder. Asked two way-of-working questions as Q-02 (helper team) and Q-03 (one option or several) and set the item waiting on the owner. `toolkit work decisions` then folded both into "The design for WI-001 is proposed ... Approve with: toolkit work approve WI-001 --design" (problem 1). |
| s06 | "Yes, use the team. Compare two approaches, especially for where --version gets its version number from." | `work-decide`, `solution-design`, `work-on`, `memory-save`; helpers `requirements_check`, `design_architect`, `design_critic` (all `fork_turns: none`) | Patched Q-02 and Q-03 to Answered directly in the file (post-edit hook: "WI-001 was edited directly and passes validation."). Checked Node.js and npm documentation. The architect wrote `option-a.md` and `option-b.md` in one `mktemp -d` folder; two critic rounds; folder deleted. Design saved as proposed: A reads `package.json`, B keeps a constant; recommended B. Asked "Do you approve Option B, or choose Option A?" |
| s07 | "Go with option A. Before you build, split this up: WI-001 is doing two things. Keep the basic greeting in WI-001 and make the --version flag its own sub-item under it." | `work-decide`, `work-organize`, `work-on` (read `skills/work-on/references/planning.md`), `memory-save` | Design saved with Option A selected, `toolkit work approve WI-001 --design --by Mike`, quoted note. Said "rename WI-001 to 'Build the basic greet CLI'" in a progress line, then `toolkit work set WI-001 --title`. `toolkit work new --title "Add a --version flag to the greet CLI" --type build --parent WI-001 --covers R-02` made WI-002 at 06: "WI-001's approved design covers it, so it starts at planning with no design of its own. Continue with work-on." Plans in table and checkbox form. `git worktree add` was refused ("approval required by policy, but AskForApproval is set to Never"); the agent set WI-001 waiting on the owner and gave Mike the exact command. |
| (hand) | Tester, as Mike, in a terminal: `mkdir .work-items/cli`, moved and renamed the WI-001 folder, renamed the sub-item folder to `version-flag` | none | `snapshots/hand-move-commands.txt`, `before-move-tree.txt`, `after-move-tree.txt`, `move-time.txt`. |
| s08 | "Keep going. I approve the git commands Codex asks for to build these two items (worktree add, add, commit), but no merge yet." | `work-on`, `work-decide`, `work-check`, `acceptance-checker` helpers `check_wi001` and `check_wi002`, `memory-save` | First line: "WI-001's folder has moved, and WI-002 is now nested under it." (problem 9). Worktree `.claude/worktrees/wi-001-basic-greet-cli` on `claude/wi-001-basic-greet-cli`, commit `cf0b951`; worktree `wi-002-version-flag` from WI-001's branch, commit `ce657c1`. Both 08 -> 09 -> 11 with independent checks. Asked "Do you approve the WI-001 basic greeting result?" |
| s09 | "Where are we?" | `work-status` | "Two decisions are waiting on you: ... WI-001 ... WI-002 ..." then "Say 'what do you need from me' to review the two decisions one at a time." 0 records in the hook state. |
| s10 | "What do you need from me?" | `work-decide` | One decision, WI-001's result, with "I recommend approving it because ..." 0 records. |
| s11 | "I ran it in the WI-001 worktree: ... I approve the WI-001 result." | `work-decide`, `memory-save` | `toolkit work approve WI-001 --result --by Mike`, quoted note. Wrote Roadmap P1 status "Complete", which validation warns about (problem 7). Asked about WI-002. |
| s12 | "Not yet on the merge. For WI-002, ... I approve the WI-002 result." | `work-decide`, `memory-save` | `toolkit work approve WI-002 --result --by Mike`, quoted note. "Say 'ship WI-001 and WI-002' when you're ready to authorize the merge." |
| s13 | "Ship it: WI-001 and WI-002. There is no remote and I do not want a GitHub repo, so merge them into main locally. I approve that merge ... Then mark both done and clean up their worktrees and branches." | `work-finish` (and its `closing.md`), `merge-and-clean-up`, `publish-docs`, `memory-save` | Stage 12, `git merge --ff-only` of both branches, 5 of 5 tests pass on `main`, "No remote: merged locally into main" notes, stage 14, `requirements/greet-cli.md` and `system-guide/greet-cli.md` written in a docs worktree (`be8468b`). Roadmap phases set to Done, worktrees and branches removed, `toolkit work finish WI-002 ...` then `toolkit work finish WI-001 ...`. Also corrected a stale `PROJECT.md` in its own worktree (`71d46ac`). |
| s14 | "Do you remember how I like code and tests written in this project?" | `memory-find` | "Yes. You prefer plain Node.js with no npm packages, and tests written with the built-in `node:test` runner. ... (`user_nodejs_development_preferences`)." |
| s15 | "... In WI-002 WORK-ITEM.md, add the line ... by editing the file directly with a patch ... Then also try to change its priority to high by editing the frontmatter line directly ..." | `work-on` | Body patch went through; PostToolUse: "WI-002 was edited directly and passes validation." Header patch refused: "Command blocked by PreToolUse hook: This edit changes the header of .work-items/cli/WI-001-basic-greet-cli/version-flag/WORK-ITEM.md (priority). ... Nothing was changed." |

## Proof, item by item

### Work item from 01-discovery to Done

- `final/WI-001-WORK-ITEM.md` and `final/WI-002-WORK-ITEM.md` hold the full
  Recent History, newest first. WI-001 went 01 -> 02 -> 03 -> 04 -> 05 -> 06
  -> 07 -> 08 -> 09 -> 11 -> 12 -> 14 -> Done. WI-002 went 06 (inherited) ->
  07 -> 08 -> 09 -> 11 -> 12 -> 14 -> Done. Stage 13 has a note in the same
  row as the local merge: "no pull request or deployment".
- Each approval is a CLI row with Mike's words in its own row: "Owner's
  words: Approved." then "Requirements approved by Mike."; "Owner's words: Go
  with option A. ..." with "Design approved by Mike."; "Result approved by
  Mike." for each item separately.
- Frontmatter at the end: WI-001 `requirements_approved: "2026-09-27 by
  Mike"`, `design: approved`, `result_approved: "2026-09-27 by Mike"`,
  `status: Done`; WI-002 the same, with `design: none` because it was built
  from the parent's approved design. Notes > Resume here on both: "Finished
  on 2026-09-27. Nothing to resume."
- `final/tracker-and-doctor.txt`: `cli/ (group)` then `WI-001 Build the basic
  greet CLI (Done)` with `WI-002 Add a --version flag to the greet CLI (Done)`
  under it; `Checked 2 items: 2 clean, 0 errors`; `Nothing is waiting on the
  owner.`; both headers say `Stage: Done`.
- `final/git-and-app.txt`: six commits by `Mike Rihm <michael@rihm.com>`; a
  search of every commit message for "co-authored", "generated with",
  "claude", "codex", or "openai" finds 0; `node --test` 5 pass, 0 fail; the
  five commands print `Hello, Mike!`, `Hello, world!`, and `0.1.0` three
  times. `main` is clean, with no worktree or branch left.
- `final/WI-001-DESIGN.md`: approved, Option A selected, with Mike's choice
  and the sources used.
- `final/requirements-greet-cli.md` and `final/system-guide-greet-cli.md`
  follow the model's area templates and hold only delivered behavior.

### Sub-item made by splitting

- s07 output: "Created WI-002: Add a --version flag to the greet CLI (06
  Implementation plan, In Progress, sub-item of WI-001) ... It delivers WI-001
  R-02 and inherits that requirements approval (2026-09-27 by Mike). WI-001's
  approved design covers it, so it starts at planning with no design of its
  own. Continue with work-on."
- WI-001's history: "Sub-item WI-002 created ... Those requirements stay
  here, unchanged and approved." WI-001's Roadmap lists WI-002 in its
  Sub-items column.
- `toolkit work show WI-002` says "Design: none of its own; WI-001's design is
  approved (...). Read it with: toolkit work design WI-001".
- Mike approved requirements once, the design once, and each result once.

### Folders moved and renamed by hand, next session carried on

- `snapshots/before-move-tree.txt`, `snapshots/after-move-tree.txt`,
  `snapshots/hand-move-commands.txt`.
- `sessions/s08-keep-going-build.hooks.txt`, under "Changes found in the
  tracker since the last toolkit command ...":
  - "Moved: WI-001 from .work-items/WI-001-add-a-version-flag-to-the-greet-cli/WORK-ITEM.md to .work-items/cli/WI-001-basic-greet-cli/WORK-ITEM.md."
  - "Renamed folder: WI-002 is now at .work-items/cli/WI-001-basic-greet-cli/version-flag/WORK-ITEM.md (was ...). Its parent WI-001 moved too."
- History rows written by the CLI at the first toolkit command of s08
  (`final/WI-001-WORK-ITEM.md`, `final/WI-002-WORK-ITEM.md`):
  - WI-001: "Moved by hand: .work-items/WI-001-add-a-version-flag-to-the-greet-cli/WORK-ITEM.md -> .work-items/cli/WI-001-basic-greet-cli/WORK-ITEM.md. | Its parent stays none (top level). Group: cli."
  - WI-002: "Folder renamed by hand: ... -> .work-items/cli/WI-001-basic-greet-cli/version-flag/WORK-ITEM.md. | Same item; the toolkit uses the new path. Its parent WI-001 moved too."
- WI-002 kept `parent: WI-001`. s08 to s15 used the new paths without error.

### Preference saved and found later

- s02: `sessions/s02-remember.hooks.txt` has "The owner stated something to
  keep; memory-save records it, or work-on if it is a task."
  `sessions/s02-remember.hookstate.json` has `"keep": "remember that"` and
  the `toolkit memory save` records.
- The record is `.memory/user_nodejs_development_preferences.md`, indexed in
  `.memory/MEMORY.md` under User (`final/memory-listing.txt`).
- Listed under "Memory records" in every later briefing; used in s06's
  design ("Constraint | Use plain Node.js without npm packages; use
  `node:test` for tests. | Project memory briefing, 2026-09-27");
  answered in s14 with the record name as the source. The built CLI has no
  dependencies and its tests use `node:test`.

### Status question and "what do you need from me"

- s09 opened `work-status` and ran `toolkit work list --tree`, `toolkit work
  next`, `toolkit work decisions`, `toolkit memory focus`, and `toolkit work
  lifecycle`. It changed nothing (0 records in its hook state). Its count, 2,
  matched `snapshots/decisions-after-s08.txt`.
- s10 opened `work-decide`, ran `toolkit work decisions`, and asked one
  decision with a recommendation. It changed nothing.

### Hooks

- **SessionStart**: "Project briefing: greet (greet), owner Mike ..." is in
  every session from s00b on (`sessions/*.hooks.txt`). s00a ran before init,
  so the hook correctly added nothing.
- **UserPromptSubmit**: the keep-phrase line in s02 only.
- **PreToolUse**: the header refusal in s15. The note "This shell command
  joins a toolkit command to other commands ..." fired for
  `toolkit memory focus --set-file - <<'EOF'` (s00a),
  `rg --files .work-items; git status --short; toolkit work lifecycle` (s04),
  and `git worktree list && ... && toolkit work lifecycle` (s13). In Codex the
  note reaches the agent after the command has run.
- **PostToolUse**: each `*.hookstate.json` lists the toolkit writes of that
  turn (for example 26 in s07, 24 in s08). The direct edits in s06 and s15
  are listed under `edits`, and the hook added its validation message both
  times.
- **Stop**: `updated` in each state file is after the last record of the
  turn, including the read-only sessions s09, s10, and s14.
  `stopBlocked: false` everywhere.

### Round-2 fixes seen working

- a1 (setup is not a work item): s00a created none; the owner steps went into
  the current focus under "Waiting on the owner".
- a2 (history rows for hand moves): s08, quoted above.
- a3 (design not skipped): s04 ended with "The next step is solution design";
  s05 opened `solution-design`.
- a5 (planning format): s07 read this skill's `references/planning.md`; the
  Roadmap is a phase table and the Tasks are `- [ ]` lines. Validation warned
  on the phase status "Complete" (s11), and s13 set the phases to Done before
  finishing.
- a6 (commit offer): s00a's last line.
- a7 (Codex Git approvals): escalations with one-line reasons in s00b, s08,
  s13; the refused case in s07 gave the exact command and set the item
  waiting on the owner.
- a8 (joined toolkit commands): the note fired 3 times; nearly all toolkit
  commands ran alone. One heredoc remained (problem 4).
- a9 (design drafts in a `mktemp -d` folder): s06, deleted after the save.
- a10 (`--covers` sub-item): s07, quoted above.
- a11 (retitle said): s07 progress line "rename WI-001 to 'Build the basic
  greet CLI'".
- a12 (no delivery offer for a small item): s05.
- a13 (Roadmap Done before finish): s13.
- a14 (Effect column filled): every history row has an effect.
- b1 (requirements approval asked once): s03 asked, s04 recorded.
- b10 (quoted approval fields): `requirements_approved: "2026-09-27 by
  Mike"`, `result_approved: "2026-09-27 by Mike"`, `approved: "2026-09-27 by
  Mike"`.
- c9 (no-remote note): s13.
- c11 (`Stage: Done`): `final/tracker-and-doctor.txt`.
- c13 (temp folders deleted before asking): s05, s06, s07, s12.
- d5 (Why in the owner's words): "Why: Not stated by the owner."
- d7 (R-xx Finalized with the approval in the Decision record): s04.
- d11 (Resume here on Done): both items.

## Problems found

Ordered by how much they would hurt a solo developer. Each has the evidence
and a suggested fix.

1. **The decision list calls an empty design "proposed" and folds unrelated
   questions into it (medium).** After s05, WI-001's design had no options
   ("## Design options / Pending Mike's answer to Q-03"), yet
   `toolkit work decisions` printed: "The design for WI-001 is proposed and
   waits for the owner's approval. Approve with: toolkit work approve WI-001
   --design --by <name>. Q-02 asks it: May one team of three helpers in this
   chat review and write the design, or should the main agent work directly?
   Q-03 asks it: Should the design show one plain Node.js approach or compare
   multiple approaches? Mark those rows Answered when the design is approved."
   (`snapshots/decisions-after-s05.txt`; the same line is in the s06
   briefing). Two causes: `toolkit work design --create` writes
   `status: proposed` from the model template, so a design is "proposed" from
   the moment it is created; and `isDesignQuestion` in
   `lib/work/decisions.mjs` matches any question whose text or Affects names
   "design" ("Design team", "Design options"). An agent following this line
   could record a design approval for a design with no options, or mark the
   way-of-working questions Answered with the wrong answer. The history also
   gained two rows, "Design created (proposed). | The owner approves it before
   building starts." and "Design updated (status proposed). | The owner
   approves it before building starts.", before any option existed. Fix: count a
   design as waiting for approval only when its Design options section has at
   least one `### Option` heading (or add a draft state that `--create` sets
   and only `--status proposed` clears); fold only questions that ask to
   choose or approve an option (`Option [A-Z]`, "approve the design"), not any
   question that mentions the word "design".
2. **`--text "..."` lets the shell run backticked text as commands (medium).**
   s01 ran `toolkit work edit WI-001 --section "Starting request" --text "Add
   a --version flag ... where `node bin/greet.js Mike` prints `Hello,
   Mike!`."`. zsh ran `node bin/greet.js Mike` (it failed with "Cannot find
   module ... bin/greet.js") and `Hello, Mike!` ("command not found:
   Hello,"), and the toolkit then printed "Saved "Starting request" in
   WI-001." with the backticked parts missing. The agent noticed and saved
   again in single quotes. The owner's words often hold Markdown backticks or
   `$`, and the skills' own examples use double quotes
   (`--text "<the owner's words>"` in `work-on` step 3, `--text "<goal>"` in
   `work-requirements` step 3, and the `--note "..."` examples). Had the CLI
   existed, the save would have run it. Fix: write every `--text`, `--note`,
   and `--body` example with single quotes and one line in the shared header:
   "Wrap text in single quotes (write a single quote as '\''); inside double
   quotes the shell runs `...` and $(...)." The PreToolUse hook could also add
   a note when a toolkit command's double-quoted argument holds a backtick or
   `$(`.
3. **`toolkit work validate` says "0 questions for the owner" while an owner
   question is open (low).** After s01, WI-001 had "Q-01 | What initial
   version number should --version print? | R-02 | Open | owner", and
   validate printed "Checked 1 item: 1 clean, 0 errors, 0 questions for the
   owner." The count is of gate questions only
   (`lib/commands/work.mjs` line 573). Fix: call them "gate questions", or
   count open owner rows too and point to `toolkit work decisions`.
4. **`project-setup` does not carry the run-alone rule, and setup used a
   heredoc (low).** s00a wrote the current focus with
   `toolkit memory focus --set-file - <<'EOF' ... EOF`. The PreToolUse note
   fired after it ran. It worked because built-in memory is inside the
   project, but with Hindsight or Notion memory the same command would run
   inside the sandbox and fail. The work and memory skill headers carry the
   rule; `project-setup` says only "Put each `toolkit` command on its own
   line." Fix: give `project-setup` the same header line, and name
   `toolkit memory focus --text '<text>'` in its step 8.
5. **A memory record's labels are plain, not the model's bold labels (low).**
   `.memory/user_nodejs_development_preferences.md` has "**Remember:** ..."
   (added by the CLI) and then "Why: ...", "How to apply: ...", "Evidence and
   limits: ...", "Related memories: ...", "Authoritative records: ..." without
   bold, while the model's topic template uses "**Why:**" and so on. The
   first save also came out as "**Remember:** Remember: ...", which the agent
   fixed by saving again. Fix: have `toolkit memory save` recognise the
   model's labels at the start of a line, with or without bold, and write them
   in the template's bold form, including a leading "Remember:".
6. **A retitle leaves the old title in the folder name and the design heading
   (low).** After s07's `toolkit work set WI-001 --title "Build the basic
   greet CLI"`, the folder was still `WI-001-add-a-version-flag-to-the-greet-cli`
   and held a sub-item folder `WI-002-add-a-version-flag-to-the-greet-cli`, so
   the parent and the child had the same words in their folder names. The
   design heading still reads "# WI-001: Add a --version flag to the greet CLI
   — solution design" (`final/WI-001-DESIGN.md`). Mike had to rename the
   folder himself. Fix: have `work set --title` update the design heading and
   offer to rename the item's folder (the local tracker already follows hand
   renames), or print one line saying the folder name still has the old
   title.
7. **A section edit does not report the warnings it causes (low).** s11
   wrote WI-001's Roadmap P1 status as "Complete". `toolkit work edit` printed
   only "Saved "Roadmap" in WI-001.", and `validate` then warned "Roadmap P1
   has the status "Complete"; a phase status is one of Not Started, In
   Progress, Done, Cancelled." The warning stayed through s12 until s13
   rewrote the Roadmap. The PostToolUse hook validates direct file edits but
   not toolkit writes. Fix: have `toolkit work edit` validate the section it
   wrote and print any new warning after "Saved".
8. **`solution-design` asks a solo owner about internal helper agents (low).**
   s05 asked Mike "May I use a requirements analyst, design writer, and
   critic in this chat, or should I work directly?" for a two-command CLI.
   The answer cost a session and added an Open Questions row about helpers.
   The step 3 wording ("the team from team-roles.md") makes the team a
   question. Fix: in `solution-design` step 3, let the agent pick the team for
   a small item and say it in one line; ask only when the team would cost
   noticeably more time or money.
9. **The move report to the owner was wrong in one detail (low).** s08's first
   line was "WI-001's folder has moved, and WI-002 is now nested under it."
   WI-002 was nested under WI-001 before the move too; what changed was its
   folder name. `work-on` step 1 says to tell the owner each change in one
   line. Fix: have the briefing's tracker-change block end each change with a
   ready one-line owner summary ("WI-001 moved into cli/ and was renamed;
   WI-002's folder was renamed to version-flag"), and have `work-on` step 1
   say to use those lines as written.
10. **The requirements area file layout differs between runs (low).** Round 2
    wrote `requirements/greet/GREET.md`; this round wrote
    `requirements/greet-cli.md`. `work-finish` step 4 says "a new area starts
    from `requirements/system-area-template/`" (a folder), while the model's
    `requirements/AGENTS.md` says "Keep one maintained file per durable
    business area, following AREA-TEMPLATE.md". Both results follow the
    template's headings, but the same toolkit gives different layouts. Fix:
    say the exact target in `work-finish` step 4, for example "copy
    `requirements/system-area-template/AREA-TEMPLATE.md` to
    `requirements/<area>.md`", matching whatever the model intends.
11. **"The toolkit" in a new folder also opened the older `project-init`
    skill (low, mostly the harness).** In s00a both the V2 `project-setup` and
    the claude-toolkit `project-init` were listed (the V2 plugin was switched
    on for that run only), and the agent read both skill files before
    choosing V2 correctly. Without the per-run switch, Codex in a new folder
    lists only `project-init`. This is the pending decision on switching
    `toolkit@toolkit-v2` on for the whole computer; no toolkit change is
    suggested beyond that decision.
12. **Setup steps stay in "Waiting on the owner" forever (low).** The current
    focus written at setup lists "Trust this project folder ...", "Open
    /hooks in Codex and trust the Toolkit V2 hooks ...", and "Start a new
    Claude Code session ...". Every later session copied them forward, and the
    final focus after both items were Done still lists them
    (`final/brief.txt`). Nothing checks or clears them. Fix: have
    `project-setup` write setup steps with a way to clear them (doctor's
    warnings already say what is left), or have `memory-save` drop a setup
    step from the focus once doctor no longer reports it; for "Start a new
    Claude Code session", drop it after the first briefing in Claude Code.

Known items not reported again: every session ran `git fetch origin` with no
remote, because the model's `shared-repository-work.md` rule says to (the
open model change in the round-3 fix list). Codex refused it or it failed,
and no agent treated that as a blocker.

Not toolkit bugs, recorded for the testers:

- The two doctor warnings in every session ("Codex does not trust this
  folder", "The Toolkit V2 hooks are not trusted in Codex yet") come from the
  harness: trust and hook trust were given per run with `-c` and
  `--dangerously-bypass-hook-trust`, not saved.
- s05 tried `request_user_input_async`, which `codex exec` answers with
  `{"accepted": true}` and no answer. The agent then asked the same questions
  in its final reply, which is what a real session needs.
- Every session ran `cat SOUL.md` and got "No such file". `AGENTS.md` says to
  read it "when the project has one", so this is harmless.

## Files in this folder

- `final/`: `WI-001-WORK-ITEM.md`, `WI-001-DESIGN.md`, `WI-002-WORK-ITEM.md`,
  `DASHBOARD.md`, `requirements-greet-cli.md`, `system-guide-greet-cli.md`,
  `toolkit.json`, `brief.txt`, `memory-listing.txt` (the `.memory/` folder,
  index, the saved record, `toolkit memory list`, `toolkit memory find`, and
  the current focus), `file-tree.txt` (the whole project without `.git`),
  `git-and-app.txt`, `tracker-and-doctor.txt`.
- `sessions/`: per session the prompt, command, JSON events, summary, hook
  messages, hook state, and skills opened; `index.txt`.
- `snapshots/`: the tree after init; the tree, state, and both records before
  the hand move, the tree after it, the exact commands, and the time; the
  decision list and design after s05; the decision list after s06 and after
  s08; the design after s06; Mike's own run of both results; WI-002 before
  s15.
- `round-2/`, `round-1/`: earlier rounds' evidence, unchanged.

# Sample run a: local tracker and built-in memory (round 2)

Run on 2026-09-27 from 16:51 to 17:46 UTC, in 17 real `codex exec` sessions
(codex-cli 0.157.0, Mike's model setting `gpt-6-sol`, reasoning effort
medium). Toolkit V2 version 0.2.1 (`toolkit`, `work`, `memory`,
`git-workflows`; `session-skills` 0.2.0). Before the run, the Codex plugin
copies in `~/.codex/plugins/cache/toolkit-v2/` were compared with the source
folders and matched file for file. Round 1 is kept in `round-1/`.

## Result

The work item reached Done, with every approval recorded in the owner's words.

- WI-002 "Build basic greet CLI" (type `build`) went from `01-discovery` to
  Done. WI-003 "Add --version flag to greet CLI" was split out of it with
  `toolkit work new --parent WI-002 --covers R-02`. It inherited the
  requirements approval and the approved design, got its own result approval,
  and reached Done before its parent. (WI-001 was a setup item the agent made
  on its own in s00b; Mike had it cancelled. See problem 1.)
- Between s06 and s07 the tester, as Mike, moved WI-002's folder into a new
  group folder `cli/` and renamed the sub-item folder to `version-flag`. The
  s07 briefing reported both changes. The agent's first line to Mike was
  "WI-002 moved into `.work-items/cli/`, and WI-003's folder was renamed under
  it." Every later command found both items at the new paths.
- "Remember that I prefer plain Node.js with no npm packages, and tests
  written with the built-in node:test runner" (s02) was saved as
  `.memory/user_nodejs_dependencies_and_tests.md`. s05 used it as a design
  constraint without being asked, and s13 answered "Do you remember how I
  like code and tests written" from it, naming the record.
- "Where are we?" (s08) opened `work-status`, changed nothing, and counted
  2 decisions, one line each. "What do you need from me?" (s09) opened
  `work-decide` and asked one decision with a recommendation.
- Hooks: the session-start briefing arrived in all 16 sessions after init.
  The keep-phrase line fired on "Remember that" (s02). The post-edit check
  ran when the agent patched a `WORK-ITEM.md` body (s14), and the pre-edit
  guard refused a patch to the same file's header. The Stop hook updated the
  hook state at the end of every turn and never blocked.
- Git ran through the new Codex `prompt` rules: in plain `codex exec` Codex
  refused `git worktree add` without running it; with `--approve-for-me`
  (standing in for Mike clicking approve) the setup commit, the build
  commits, the local merge, and the worktree and branch removal ran outside
  the sandbox. Five commits, all by Mike Rihm, no AI credit.

Fourteen problems were found. None blocked the work item. The highest are
medium. They are listed under "Problems found".

## How the sessions ran

- Project folder, a new Git repository whose first commit holds only a
  three-line `README.md`:
  `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/a-local-builtin-r2`
- Every session was a fresh process:

  ```sh
  codex exec --json <sandbox choice> --dangerously-bypass-hook-trust \
    -c model_reasoning_effort="medium" -c 'notify=[]' \
    -c 'projects={"<project folder>"={trust_level="trusted"}}' \
    -C "<project folder>" "<prompt>" < /dev/null
  ```

- Sandbox choice: `--sandbox workspace-write`, except s00c, s07, and s12,
  which used `--approve-for-me`. That flag sends Codex's approval requests to
  its automatic reviewer. It stands in for Mike clicking "approve" when Codex
  asks to run a Git command outside the sandbox, and it was used only in
  sessions where Mike's prompt approved those commands.
- s00a also turned the `toolkit` plugin on for that one run with
  `-c 'plugins={"toolkit@toolkit-v2"={enabled=true}}'`. A new folder has no
  `.codex/config.toml` yet, so without it Codex lists only the older
  `project-init` skill (round 1, s00a and s00b). This stands in for Mike's
  pending decision to switch `toolkit@toolkit-v2` on for the whole computer.
- The trust setting and the plugin switch were passed for one run only.
  `~/.codex/config.toml` was not changed by this run (checked with `diff`
  against a copy taken before s00a).
- For each session, `sessions/` holds the exact prompt (`.prompt.txt`), the
  exact command (`.command.txt`), the `codex exec --json` output (`.jsonl`),
  a readable summary with every tool call from the Codex session log
  (`.summary.txt`), the hook messages Codex added (`.hooks.txt`), the hook
  state file the toolkit wrote (`.hookstate.json`), and the skill files and
  helper agents the agent opened, taken from the session log
  (`.skills.txt`). `sessions/index.txt` lists start and end times, thread
  ids, exit codes, sandbox choice, and skills. The "SKILLS OPENED" line at
  the end of each `.summary.txt` misses skill files read inside a combined
  command; `.skills.txt` is the complete list. The full Codex session logs
  stay in the scratch folder `.../scratchpad/runs/a-local-builtin-r2-logs/`
  (`*.rollout.jsonl`).

## Timeline

| Session | Mike's prompt (short form) | Skills opened | What happened |
| --- | --- | --- | --- |
| s00a | "Set up this project with Toolkit V2. My answers: ... Skip SOUL.md, I do not want one. ..." | `project-setup` | Ran `toolkit init --name "greet" --key greet --tracker local --memory builtin --owner "Mike" --decline SOUL.md`. It failed: "Could not write .../.codex/config.toml: EPERM ... Files in .codex/ and .agents/ are written first, so no other setup file was written by this run." `ls` confirmed nothing was written. The agent stopped and gave Mike the exact command init printed, with every answer unchanged. |
| (terminal) | Tester, as Mike, ran that command in a terminal | none | "Added 33 files ... Wrote .toolkit.json last." `.toolkit.json` has `"declined": ["SOUL.md"]`. `snapshots/mike-terminal-init.txt`, `snapshots/after-init-tree.txt`. |
| s00b | "I ran that toolkit init command in my terminal and it worked. Finish setting up Toolkit V2." | `project-setup`, `work-on`, `publish-docs`, `memory-save`, `work-decide` | Doctor: 0 problems, 2 Codex trust warnings (from the test harness). Filled `AGENTS.md` and `PROJECT.md`. Also created WI-001 "Finish Toolkit V2 setup" with two invented owner questions (problem 1). Did not offer the setup commit (problem 6). |
| s00c | "Yes, use the README description as the goal ... cancel WI-001 ... Then commit the setup files. I approve that one commit." | `work-finish`, `publish-docs`, `memory-save` | `toolkit work cancel WI-001 --reason "<Mike's words>"`. Staged 26 setup files by name, asked to run `git add` and `git commit` outside the sandbox (`sandbox_permissions: require_escalated`), commit `ee7c812`. |
| s01 | "Add a --version flag to the greet CLI. There is no greet CLI yet ..." | `work-on`, `work-requirements` | `toolkit work new --title "Build greet CLI with --version" --type build --stage 01-discovery` made WI-002; moved to 02; wrote R-01 and R-02; asked "Do you approve these requirements?" |
| s02 | "Remember that I prefer plain Node.js with no npm packages, and tests written with the built-in node:test runner." | `memory-save` | Keep-phrase hook line. `toolkit memory save --type user --name nodejs-dependencies-and-tests ... --approved-by Mike`, body file in a `mktemp -d` folder, deleted afterwards; read back with `toolkit memory get`. |
| s03 | "Almost. With no name it should print `Hello, world!`. ..." | `work-requirements`, `work-on`, `requirements-analyst` helper | Updated R-01, ran the spec check in a `spawn_agent` worker with `fork_turns: none`, asked for approval again. |
| s04 | "Approved." | `work-decide`, `work-on`, `work-requirements`, `solution-design`, `work-delegate` | R-01 and R-02 marked Finalized, `toolkit work approve WI-002 --requirements --by Mike`, "Owner's words" note. Skipped design without the "say 'design first'" line (problem 3). `git worktree add` was refused: "approval required by policy, but AskForApproval is set to Never". |
| s05 | "Before you build anything: how should we build this? I want to see design options ..." | `solution-design`, `work-on`, helpers: requirements review, research, two architects, critic (all `fork_turns: none`), `memory-save` | `toolkit work design WI-002 --create`, stage 04, Option A (`package.json`) and Option B (a constant) saved as proposed. The design cites the s02 memory as a constraint. Asked "Which design do you approve: A or B?" |
| s06 | "Go with option A. Before you build, split this up ... make the --version flag its own sub-item under it." | `work-decide`, `work-organize`, `work-on`, `work-delegate`, `solution-design`, `memory-save` | Stage 05; `toolkit work new --title "Add --version flag to greet CLI" --type build --parent WI-002 --covers R-02` made WI-003 at 03 with "Requirements approval inherited from WI-002 (2026-09-27 by Mike); the owner is not asked again."; `toolkit work approve WI-002 --design --by Mike`; both items to 06. R-02 stayed in WI-002. |
| (hand) | Tester, as Mike: `mkdir .work-items/cli`, moved the WI-002 folder into it, renamed the sub-item folder to `version-flag` | none | `snapshots/hand-move-commands.txt`, `before-move-tree.txt`, `after-move-tree.txt`. |
| s07 | "Keep going. I approve the git commands for the work branches and worktrees when Codex asks ..., but no merge yet." | `work-on`, `work-delegate`, `work-check`, `acceptance-checker` helper, `memory-save` | Told Mike about the move first. Worktrees `.claude/worktrees/wi-002-greet` (branch `claude/wi-002-greet`) and `wi-003-version` (from WI-002's branch). Commits `8eab12e` and `3cf4d87`. Stages 08 -> 09 -> 11. Independent checker: both requirements met. Asked "Do you approve the results for both WI-002 and WI-003?" |
| s08 | "Where are we?" | `work-status` | "Two decisions are waiting on you: ... WI-002 ... and WI-003 ..." then "Say 'what do you need from me' ...". No writes (hook state has 0 records). |
| s09 | "What do you need from me?" | `work-decide` | One decision: WI-002's result, with "I recommend approving this result." |
| s10 | "... I approve the WI-002 result." | `work-decide`, `work-finish`, `memory-save` | `toolkit work approve WI-002 --result --by Mike`, quoted note, then asked for the merge. |
| s11 | "Not yet on the merge. First WI-003: ... I approve the WI-003 result." | `work-decide`, `memory-save` | `toolkit work approve WI-003 --result --by Mike`, quoted note. |
| s12 | "Ship it: WI-002 and WI-003 ... merge them into main locally. I approve that merge and the git commands ... Then mark both done and clean up ..." | `work-finish`, `merge-and-clean-up`, `work-on`, `publish-docs`, `memory-save` | `git merge --ff-only` of both branches; `node --test` 4 pass on `main`; stage 14; `requirements/greet/GREET.md` and `system-guide/GREET.md` written in a docs worktree and merged as `9e544f6`; three worktrees and branches removed; `toolkit work finish WI-003 ...` then `toolkit work finish WI-002 ...`. |
| s13 | "Do you remember how I like code and tests written in this project?" | `memory-find` | "Yes. You prefer plain Node.js with no npm packages, and tests written with the built-in `node:test` runner. ... [Project memory: `user_nodejs_dependencies_and_tests`]" |
| s14 | "I want to check the file-edit safety checks. In WI-002 WORK-ITEM.md, add the line ... by editing the file directly ... Then also try to change its priority to high by editing the frontmatter ..." | `work-on` | The body patch went through; the PostToolUse hook added "WI-002 was edited directly and passes validation. ...". The header patch was refused: "Command blocked by PreToolUse hook: This edit changes the header of .work-items/cli/WI-002-build-greet-cli-with-version/WORK-ITEM.md (priority). ... Nothing was changed." |

## Proof, item by item

### Work item from 01-discovery to Done

- `final/WI-002-WORK-ITEM.md` and `final/WI-003-WORK-ITEM.md` hold the full
  Recent History, newest first. WI-002 went 01 -> 02 -> 03 -> 06 -> 04 ->
  05 -> 06 -> 08 -> 09 -> 11 -> 14 -> Done. WI-003 went 03 (inherited) ->
  06 -> 08 -> 09 -> 11 -> 14 -> Done.
- Each approval is a CLI row with Mike's words in the next row, for example
  "Requirements approved by Mike." then "Owner’s words: “Approved.”"; "Design
  approved by Mike."; "Result approved by Mike." for each item separately.
- Frontmatter at the end: WI-002 `requirements_approved: "2026-09-27 by
  Mike"`, `design: approved`, `result_approved: "2026-09-27 by Mike"`,
  `status: Done`; WI-003 the same, with `design: none` because it was built
  from the parent's approved design.
- `final/tracker-and-doctor.txt`: `cli/ (group)` then `WI-002 Build basic
  greet CLI (Done)` with `WI-003 Add --version flag to greet CLI (Done)` under
  it; `Checked 3 items: 2 clean, 0 errors`; the one warning is the fill-in
  guide left in the cancelled WI-001.
- `final/git-and-app.txt`: five commits by `Mike Rihm <michael@rihm.com>`;
  a search of every commit message for "co-authored", "generated with",
  "claude", "codex", or "openai" finds 0; `node --test` 4 pass, 0 fail; the
  four commands print `Hello, Mike!`, `Hello, world!`, `0.1.0`, `0.1.0`.
  `main` is clean, with no worktree or branch left.
- `final/requirements-greet-GREET.md` and `final/system-guide-GREET.md` hold
  only delivered and approved behavior, each with its commit.

### Sub-item made by splitting

- s06 output: `Created as a sub-item of WI-002. It delivers WI-002 R-02.` with
  "Requirements approval inherited from WI-002 (2026-09-27 by Mike); the owner
  is not asked again. Starts at 03 Requirements approved." WI-002's history:
  "Sub-item WI-003 created ... Those requirements stay here, unchanged and
  approved."
- Mike was asked to approve requirements once and the design once. Round 1
  asked him again for the child (round-1 problem 6); this round did not.

### Folder moved and renamed by hand, next session carried on

- `snapshots/before-move-tree.txt`, `snapshots/after-move-tree.txt`.
- `sessions/s07-keep-going.hooks.txt`, under "Changes found in the tracker
  since the last toolkit command. The owner has not been told about them in
  this session ...":
  - "Moved: WI-002 from .work-items/WI-002-build-greet-cli-with-version/WORK-ITEM.md to .work-items/cli/WI-002-build-greet-cli-with-version/WORK-ITEM.md."
  - "Renamed folder: WI-003 is now at .work-items/cli/WI-002-build-greet-cli-with-version/version-flag/WORK-ITEM.md (was ...). Its parent WI-002 moved too."
- WI-003 kept `parent: WI-002`. The rename was reported even though its
  parent moved in the same change (round-1 b6/d10 fix).
- The agent's first message in s07 told Mike both changes in one line. No
  history row records the move on either item (problem 2).

### Preference saved and found later

- s02: `sessions/s02-remember.hooks.txt` has "The owner stated something to
  keep; memory-save records it, or work-on if it is a task."
  `sessions/s02-remember.hookstate.json` has `"keep": "remember that"` and the
  `toolkit memory save` record.
- The record is `.memory/user_nodejs_dependencies_and_tests.md`, indexed in
  `.memory/MEMORY.md` under User (`final/memory-listing.txt`).
- Found by s03 (`toolkit memory find "greet CLI"` returned it), listed
  under "Memory records" in every later briefing, written into WI-002's
  Notes in s04 ("Project memory records a preference for plain Node.js, no
  npm packages, and the built-in `node:test` runner."), used in s05's design
  ("Constraint | Prefer plain Node.js, no npm packages, and `node:test`. |
  Project memory ..."), and answered in s13 with the record name as the
  source. The built CLI uses only Node.js built-ins and `node:test`.

### Status question and "what do you need from me"

- s08 opened `work-status` and ran `toolkit work lifecycle`, `toolkit memory
  focus`, `toolkit work decisions`, `toolkit work list --tree`, and
  `toolkit work next`. It changed nothing (0 records in its hook state). Its
  count, 2, matched `snapshots/decisions-before-s09.txt`: one line per item,
  no duplicate "waiting on the owner" line.
- s09 opened `work-decide`, ran `toolkit work decisions`, and asked one
  decision with a recommendation.

### Hooks

- **SessionStart**: the "Project briefing: greet (greet), owner Mike ..."
  message is in every session from s00b on (`sessions/*.hooks.txt`). s00a ran
  before init, so the hook correctly added nothing. No briefing contains the
  "hooks are not trusted" or "Codex does not trust this folder" findings;
  `toolkit doctor` still shows both (round-1 problem 13, fixed as designed).
- **UserPromptSubmit**: the keep-phrase line in s02 only.
- **PostToolUse**: each `*.hookstate.json` lists the toolkit writes of that
  turn (for example 27 in s06, 20 in s07). s14's state lists the direct edit
  under `edits` (`{"path": ".work-items/cli/WI-002-build-greet-cli-with-version/WORK-ITEM.md", "id": "WI-002"}`),
  and the hook added its validation message.
- **PreToolUse**: refused the header patch in s14 (quoted in the timeline).
- **Stop**: `updated` in each state file is after the last record of the
  turn, including the read-only sessions s08, s09, and s13.
  `stopBlocked: false` everywhere.

### Round-1 fixes seen working

- Init inside Codex writes `.codex/` first and prints the exact command
  (a2, c5, d3): s00a.
- `--decline SOUL.md` (a5): no `SOUL.md`, no doctor problem, no sync brought
  it back.
- Decision queue counts each decision once (a7): s01, s04, s08, s09. See
  problem 4 for a new double count.
- Rename reported when the parent moved too (b6, d10), and the agent told
  Mike (a8): s07.
- History newest first, and every `work set` row fills "Effect on the work"
  (a10): all items. The item fill-in guide went away at requirements
  approval (WI-002) and at finish (WI-003).
- Git `prompt` rules (a3): s00c, s04, s06, s07, s12.
- `--covers` split (a6, c14): s06.
- Helpers started with `spawn_agent` and `fork_turns: none` (b17, c10, d17):
  s03, s05, s07.
- Branch form `claude/wi-<n>-<slug>` (a12): s07.
- `work-finish` checked commits, listed worktrees and branches, and removed
  them with Mike's yes (b5, d9): s12.
- `mktemp -d` folders for body files (a11): used in s01 to s14, with one
  exception in s00b (problem 8) and fixed-name helper drafts in s05
  (problem 9).

## Problems found

Ordered by how much they would hurt a solo developer. Each has the evidence
and a suggested fix.

1. **Setup created a work item nobody asked for (medium).** s00b, asked only
   to "Finish setting up Toolkit V2", ran
   `toolkit work new --title "Finish Toolkit V2 setup" --type repository-maintenance --stage 01-discovery`,
   wrote a roadmap and tasks for it, and added two owner questions it made up:
   "Q-01: What should `greet` do for its users beyond the README
   description?" and "Q-02: Where should local tracker and memory backups be
   stored?" It set the item waiting on the owner and made it the current
   focus. Mike had to cancel it (s00c), and his first real item became
   WI-002. Nothing in `project-setup` says setup is not a work item, and the
   agent opened `work-on`, whose step 3 says "Anything else: create it".
   Fix: add to `project-setup` Rules: "Setup is not a work item. Never create
   one for setup steps. Owner steps go in the final reply and in the current
   focus under 'Waiting on the owner'." Consider the same line in `work-on`
   step 3.
2. **No history row records the hand move (medium).** After the move and
   rename, neither WI-002 nor WI-003 has a Recent History row about it
   (`final/WI-002-WORK-ITEM.md`, `final/WI-003-WORK-ITEM.md`). The CLI adds
   none for local folder moves, and the agent added none, although
   `references/conventions.md` ("Owner edits win") and `work-organize`
   step 2 say to "add one history note on each item whose parent or place
   changed". `work-on` step 1, which the agent followed, says only to tell
   the owner. Fix: have the local tracker write "Moved by hand: <old path> ->
   <new path>" (and "Folder renamed by hand") rows itself, as the Notion
   tracker now does for parent changes; or add the history note to `work-on`
   step 1.
3. **Design skipped without the required notice (medium; round-1 a9 not
   fixed in practice).** s04, right after the requirements approval, set
   WI-002 from 03 to 06. Its only mention was a progress line: "The approved
   CLI has one straightforward implementation: a small Node.js script with
   version `0.1.0` in `package.json`. I'll record the build steps in WI-002."
   There was no "say 'design first' to stop me", and the final reply did not
   mention the skipped design. The item had two reasonable designs (s05
   produced Option A and Option B), which `work-on` step 5 says should go to
   `solution-design`. The agent had read `work-on` and `solution-design`.
   Fix: put the rule where the agent is when it decides, in
   `work-requirements` step 8 and `work-decide` step 5 ("after a requirements
   approval of a `build` item, open `solution-design` unless the owner agreed
   to skip it"), and require the notice in the final reply, not a progress
   line.
4. **A design choice counted twice in the decision queue (low; new form of
   round-1 a7).** After s05, `toolkit work decisions` printed "2 decisions
   wait on the owner" for one decision: "Q-02: Which version source do you
   approve for WI-002: Option A ... or Option B ...?" and "The design for
   WI-002 is proposed and waits for the owner's approval."
   (`snapshots/decisions-after-s05.txt`). `solution-design` step 7 sets the
   item waiting on the owner, and the agent also added an Open Questions row
   for the same choice. Fix: in `solution-design` step 7, say not to add an
   Open Questions row for the design approval itself; or have `toolkit work
   decisions` fold an open question that names the design into the
   proposed-design line.
5. **`work-on` points to `references/planning.md` and the agent looked in
   the wrong folder (low).** s06 and s07 ran `cat
   ~/.codex/plugins/cache/toolkit-v2/work/0.2.1/references/planning.md` and
   got "No such file"; the file is `skills/work-on/references/planning.md`.
   s04 never read it and wrote WI-002's Roadmap as headings
   ("### P1 — Build and verify the basic greeting", "**Status:** Planned.")
   and its Tasks as `### P1-T01` headings with a "Status:" line, not the
   template's table and checkbox list (`final/WI-002-WORK-ITEM.md`).
   WI-003, written later, used the template form. `toolkit work validate`
   calls both clean. Fix: write "this skill's `references/planning.md`" in
   `work-on` step 6 and in "Routing notes", as `work-requirements` does for
   its own reference; have `validate` warn when the Roadmap has no phase
   table or the Tasks have no `- [ ]` or `- [x]` lines.
6. **Setup did not offer to commit the setup files (low).** `project-setup`
   step 8 says to offer one commit of the setup files. s00b's reply said "The
   setup files are still uncommitted" and asked about the project goal
   instead. Mike asked for the commit himself in s00c. Fix: make the commit
   offer the last line of step 8's reply, before "Tell me the first thing
   you want built."
7. **A Git command Codex refused was recorded as an outside blocker (low,
   partly the test harness).** In plain `codex exec`, Codex refuses a
   `prompt` rule command with "approval required by policy, but
   AskForApproval is set to Never". The agent did not work around it, which
   is correct. But s06 set both items to `waiting_on: "external: Git write
   permission"` and told Mike "The build needs a session that permits Git
   worktree creation", which does not tell him what to do; the current focus
   said "Run this project in a trusted session that allows Git worktree
   creation." In the Codex app, Codex would have asked him. Fix: in
   `references/conventions.md` "Branches and worktrees", add: "If Codex
   refuses the command without asking, stop, show the owner the exact
   command, ask him to approve it or run it in a terminal, and set the item
   waiting on the owner."
8. **One body file with a fixed name, joined to the toolkit command (low;
   round-1 a11 and codex-setup finding 3).** s00b ran one shell command:
   `cat > /tmp/wi001-starting-request.txt <<'EOF' ... EOF` followed by
   `toolkit work edit WI-001 --section "Starting request" --set-file /tmp/wi001-starting-request.txt`.
   The fixed name can collide with another project's WI-001, and the joined
   command runs inside the sandbox. The agent had not opened
   `references/conventions.md` in that session; `work-on` itself does not
   carry the rule. s06 and s12 also joined read-only toolkit commands with
   `&&`. Fix: copy the one-line `mktemp -d` and "run each toolkit command
   alone" rule into each work skill's header, as the memory skills already
   do.
9. **Design drafts used fixed names in the shared temp folder (low).** In
   s05 the two `design-architect` helpers wrote `/private/tmp/wi002-option-a.md`
   and `/private/tmp/wi002-option-b.md`. They were gone after the run, but
   two projects designing a WI-002 at the same time would overwrite each
   other's drafts. `solution-design` step 6 says only "in a temporary folder".
   Fix: "one `mktemp -d` folder for this design; each architect writes its
   own file there; delete the folder after the design is saved."
10. **A child made with `--covers` keeps the fill-in guide (low).** WI-003
    started at 03 with an inherited approval, but its body kept the
    item-level fill-in guide until `toolkit work finish` removed it;
    `toolkit work validate` warned `guide_left` from s06 to s12. The CLI
    also printed "Continue with solution-design" for WI-003, while
    `work-organize` step 6 says a child built from an approved parent design
    goes on to planning. Fix: `toolkit work new --covers` removes the guide
    at creation, and its "Continue with" names `work-on` when the parent's
    design is approved.
11. **The agent retitled an item without saying so (low).** s06 ran
    `toolkit work set WI-002 --title "Build basic greet CLI"`. The final
    reply did not name the new title. `references/conventions.md` says "say
    the new title to him in one line before `toolkit work set <id>
    --title`". Fix: add the same line to `work-organize` step 6, where a
    split usually renames the parent.
12. **The delivery offer was asked and then dropped (low, partly the test
    harness).** s07 asked through `request_user_input_async` "Would you like
    agents to take responsibility for delivering WI-002 and WI-003 ...?" and
    carried on building without an answer. Both items finished with
    `delivery: not-offered`, and the "Agent to-do" line disappeared once they
    passed stage 07. For a two-command CLI the offer is noise anyway. Fix:
    have `work-delegate` skip the offer for an item with one or two tasks
    (record `--delivery owner-led` with a note), and have `work-on` wait for
    the answer when it does ask.
13. **Roadmap left at "Planned" after Done (low).** WI-002 ends with
    "**Status:** Planned." and "Related items: Child WI-003 delivered R-02
    and is being finished separately."; WI-003's Roadmap row says "Planned".
    `work-finish` has no step for the Roadmap. Fix: add to `work-finish`
    step 8 "set each Roadmap phase to Done and update Related items before
    `toolkit work finish`".
14. **History notes leave "Effect on the work" empty (low).** Every
    `toolkit work history --note` row has an empty third column, for example
    "| 2026-09-27 | Owner’s words: “Approved.” |  |" in WI-002. The `work
    set` rows are filled now. Fix: give `history` an `--effect` option and
    have the skills pass it, or fill the column with "Recorded." when no
    effect is given.

Not toolkit bugs, recorded for the testers:

- The two doctor warnings in every session ("Codex does not trust this
  folder", "The Toolkit V2 hooks are not trusted in Codex yet") come from
  the harness: trust and hook trust were given per run with `-c` and
  `--dangerously-bypass-hook-trust`, not saved.
- A new folder still needs `toolkit init` in a terminal (or the per-run
  plugin switch) before Codex lists `project-setup`. This is Mike's open
  decision about switching `toolkit@toolkit-v2` on for the whole computer.
- Every session ran `cat SOUL.md` and got "No such file". `AGENTS.md` says
  to read it "when the project has one", so this is harmless.

## Files in this folder

- `final/`: `WI-001-WORK-ITEM.md` (the cancelled setup item),
  `WI-002-WORK-ITEM.md`, `WI-002-DESIGN.md`, `WI-003-WORK-ITEM.md`,
  `DASHBOARD.md`, `requirements-greet-GREET.md`, `system-guide-GREET.md`,
  `toolkit.json`, `brief.txt`, `memory-listing.txt` (the `.memory/` folder,
  index, the saved record, `toolkit memory find`, and the current focus),
  `file-tree.txt` (the whole project without `.git`), `git-and-app.txt`,
  `tracker-and-doctor.txt`.
- `sessions/`: per session the prompt, command, JSON events, summary, hook
  messages, hook state, and skills opened; `index.txt`.
- `snapshots/`: the tree after init, Mike's terminal init, the tree and
  state before and after the hand move with the exact commands and time, the
  decision queue after s05 and before s09, the WI-002 design after s05, the
  WI-002 record before s14, and Mike's own run of both results.
- `round-1/`: round 1's evidence, unchanged apart from its title line.

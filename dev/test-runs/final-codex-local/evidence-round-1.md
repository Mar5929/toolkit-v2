# Final confirmation run: Codex, local tracker, built-in memory

Run on 2026-09-28 from 19:48 to 20:34 UTC, in 28 real `codex exec` turns
(codex-cli 0.157.0, model `gpt-6-sol`, reasoning effort medium). Toolkit V2
ran from Mike's own Codex install, as decisions 10 and 11 left it: the
`toolkit` plugin on for every folder, the other five on only through the
project's `.codex/config.toml`. Versions: toolkit 0.2.6, work 0.2.8, memory
0.2.6, session-skills 0.2.6, git-workflows 0.2.6. The Codex cache copies
matched the source working tree file for file before and after the run
(`diff -rq`: 0 differences for all five).

The project is a tiny Node.js command, `slug`, that turns a blog title into
a URL-friendly slug, with a `--max` length option.

## Result

**Passed.** Every step of the scenario worked, and nothing blocked or misled
a solo developer. Seven small problems are listed at the end; none stopped
the work or gave Mike a wrong answer.

- Setup asked all six questions one at a time, including the backup folder,
  ran `toolkit init`, made the first backup, asked Mike for the outcome
  sentence instead of inventing it, and committed only after his yes.
- WI-001 went from `01-discovery` to Done with Mike's recorded approvals for
  the requirements, the design, and the result.
- WI-001 was split into two sub-items, WI-002 and WI-003, which inherited the
  requirements approval and the approved design and reached Done first.
- Mike moved and renamed folders by hand between sessions. The next session's
  briefing reported both changes in correct words, and the agent repeated them
  in its first message and in its final reply.
- "Remember that I prefer ..." was saved in s02 and found in s15.
- An agent "Save to memory: ...?" question left unanswered became a
  `needs-review` proposal, saved by the Stop hook. It was listed in "Where
  are we?" and "What do you need from me?", and Mike approved it in s13.
- A backup appeared in the backup folder at setup, after each `work finish`,
  and at the handoff.
- All five hooks ran. No commit has an AI credit line. No toolkit command
  waited on a prompt Mike could not see.

## How the sessions ran

- Project folder: a new Git repository whose first commit holds only a
  three-line `README.md`:
  `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/final-codex-local-r1`
- Backup folder given in the interview:
  `.../scratchpad/backups/codex-local`
- Each turn was a new process, run by `sessions/harness-fcl-run.sh`:

  ```sh
  codex exec --json --dangerously-bypass-hook-trust \
    -c 'model_reasoning_effort="medium"' -c 'notify=[]' \
    -c 'projects={"<project folder>"={trust_level="trusted"}}' \
    --sandbox workspace-write -C "<project folder>" "<prompt>" < /dev/null
  ```

- The setup interview (s00a to s00h) and the memory follow-up (sP2) continued
  one conversation with `codex exec resume <thread id> "<prompt>"`.
- The setup turns, s08 (build), and s14 (ship) routed approval requests to
  Codex's automatic reviewer (`--approve-for-me`, or for a resume
  `-c approval_policy="on-request" -c approvals_reviewer="auto_review"`). It
  stands in for Mike clicking "approve" on init and on Git writes his prompt
  approved. Every other turn used `--sandbox workspace-write`.
- `sessions/` holds, per turn: the prompt, the exact command, the
  `codex exec --json` output, a readable summary with every tool call, the
  hook messages Codex added, the toolkit hook state file, the skills opened,
  the time of every toolkit call, the backup folder listing, and the hook
  error log. `sessions/index.txt` lists times, thread ids, and exit codes. The
  full Codex rollouts stay in `scratchpad/runs/final-codex-local-r1-logs/`.
- The tester ran only read commands in the project, plus the hand move
  (`snapshots/hand-move-commands.txt`) and the command runs Mike reports in
  s11 and s12 (`snapshots/mike-tries-results.txt`).

## Timeline

| Turn | Mike's prompt (short) | Skills opened | What happened |
| --- | --- | --- | --- |
| s00a | "Set up this project with Toolkit V2." | `project-setup` | Doctor: "This computer: no problems found". Looked at the repository first. Q1: "I'll call the project "Slug" (key `slug`, ...). Is that right?" |
| s00b-f | "Yes ... slug, all lowercase", "Local folders, yes.", "Built-in .memory/ folder.", "No, not Salesforce.", "Skip it." | `project-setup` | One question per message, each with a recommendation: tracker, memory, Salesforce, `SOUL.md`, then "Where should automatic backups of `.work-items/` and `.memory/` go? I recommend `~/Backups/toolkit` ... or say "no backups."" |
| s00g | "Put the backups in .../scratchpad/backups/codex-local" | `project-setup` | Said first that init may need to run outside the sandbox. `toolkit init --name 'slug' --key slug --tracker local --memory builtin --owner 'Mike Rihm' --backup-dir '...' --decline SOUL.md`: "Added 33 files". `toolkit handoff-backup`: "Backed up .work-items/ and .memory/ to .../slug-2026-09-28." Doctor 0 problems. Asked for the outcome with a suggestion. |
| s00h | "The outcome: slug turns any title I type into a clean, URL-friendly slug ... use mine. Then commit the setup files." | `project-setup` | Outcome written into `AGENTS.md` and `PROJECT.md` in Mike's words. Staged 27 files by name, commit `c062d63` "Set up Toolkit V2 for slug". |
| s01 | "I want the slug command built. When I run node bin/slug.js "Hello World!" it should print hello-world. I also want a --max option ..." | `work-on`, `work-requirements` | WI-001 at 01, then 02. Starting request saved with the double quotes and "!" intact. "The command is not built yet: ... requires your recorded approval". Asked Q-01 about `--max` with a recommendation. |
| s02 | "Remember that I prefer plain Node.js with no npm packages ..., and tests written with the built-in node:test runner." | `memory-save` | Keep-phrase hook line. `toolkit memory save --type user --name node-project-preference ...`: "Saved to memory: user_node_project_preference". "Say "forget that" to remove the preference." |
| s03 | "Yes, that is the --max behavior I want. ... accented letters like é ... exit with code 1." | `work-decide`, `work-requirements`, `work-on` | Answers recorded; asked Q-02 about invalid `--max` values with a recommendation. |
| s04 | "Yes, an invalid --max value should print an error and exit with code 1." | `work-decide`, `work-requirements`; `requirements_check` helper (`fork_turns=none`) | History "Owner said: ...". Spec check: no gaps. "Do you approve them?" |
| s05 | "Approved." | `work-decide` | `toolkit work approve WI-001 --requirements --by 'Mike Rihm'`. Stage 03. |
| s06 | "Keep going." | `work-on`, `work-delegate`, `solution-design` | Delivery owner-led ("Small item: one or two tasks, so no delivery offer."). Stage 04, design created and saved as proposed (drafted in a `mktemp` folder). Options A and B, A recommended. "No independent helper critique ran." (problem 3) |
| s07 | "I approve Option A. Before you build, split the --max option out into its own sub-item under WI-001 ..." | `work-decide`, `work-organize`, `work-on` | Selected design filled, then `approve --design`. Stage 05. `toolkit work new --parent WI-001 --covers R-01` = WI-002 and `--covers R-02` = WI-003, both at 06. `git worktree add` refused by the sandbox (harness); exact command given to Mike. |
| (hand) | Tester as Mike: `mkdir .work-items/slug-cli`; moved WI-001's folder to `slug-cli/WI-001-slug`; renamed WI-003's folder to `max-option` | none | `snapshots/hand-before-tree.txt`, `hand-after-tree.txt`. |
| s08 | "Keep going. I approve the Git commands you need to build WI-002 and WI-003 (worktree add, add, commit), but do not merge anything yet." | `work-on`, `work-decide`, `work-check`; `acceptance_check` helper (`fork_turns=none`) | First message and final reply both reported the two folder changes. Worktrees `claude/wi-002-...` and `claude/wi-003-...` (WI-003 branched from WI-002), commits `d6f9221` and `4d20885`, test plans in `tests/`, 4 and 7 tests pass, both at 11. "Do you approve the WI-002 basic command result?" |
| sP1 | "Quick fact before I review: I publish my blog on Ghost, and Ghost only keeps the first 190 characters of a slug. That might be worth keeping ... Ask me before you save it." | `memory-save` | Reply: "Save to memory: You publish your blog on Ghost, and Ghost keeps only the first 190 characters of a slug?" The agent saved nothing; the Stop hook saved the proposal. |
| sP2 | (resume) "Which folder do I run the WI-003 result from?" | `memory-save` | UserPromptSubmit passed on the Stop hook's note. The agent answered the folder question; the proposal stayed saved. |
| s09 | "Where are we?" | `work-status` | Listed both result approvals and "one proposed memory fact for you to accept or reject". No record written. |
| s10 | "What do you need from me?" | `work-decide` | "Three decisions wait on you: approve the WI-002 basic command result, approve the WI-003 `--max` result, and accept or reject a proposed memory about Ghost's slug limit." Asked WI-002 first with a recommendation. No record written. |
| s11 | "I ran it in the WI-002 worktree ... I approve the WI-002 result." | `work-decide` | `approve WI-002 --result`. "Its branch remains unmerged". Asked WI-003 next. |
| s12 | "... I approve the WI-003 result. Still no merge yet." | `work-decide` | `approve WI-003 --result`. Did not name the remaining memory decision (problem 4). |
| s13 | "About the Ghost memory you proposed: yes, keep it." | `memory-save` | `toolkit memory approve project_publish_blog_ghost_keeps_only_first_190_characters --by Mike`: "it is now a current memory record". `toolkit work decisions` then: "Nothing is waiting on the owner." |
| s14 | "Ship it: WI-002 and WI-003. There is no remote, so merge them into main here, then finish WI-002, WI-003, and WI-001 and clean up ..." | `work-finish`, `merge-and-clean-up`, `publish-docs` | Two `git merge --ff-only`. `publish-docs.mjs start`: "No remote: this save will be committed locally on main; nothing is fetched or pushed." `requirements/slug/SLUG.md`, `system-guide/slug.md`, roadmap, commit `0d3a6d9`. Worktrees and branches removed. Each `work finish` printed "Backed up .work-items/ and .memory/ to .../slug-2026-09-28." |
| s15 | "Do you remember how I like code and tests written in my projects? And what does Ghost do to long slugs?" | `memory-find` | "Yes. You prefer plain Node.js with no npm packages, and tests written with the built-in `node:test` runner ... Ghost keeps only the first **190 characters** of a slug". |
| s16 | Direct-edit check: a Notes line in WI-003 with `apply_patch`, then WI-003's priority in the header | `work-on` | Body edit: "WI-003 was edited directly and passes validation." Header edit refused: "Command blocked by PreToolUse hook: This edit changes the header of ... (priority). ... Nothing was changed." |
| s17 | "Where are we?" | `work-status` | "There are no open work items or project decisions waiting on you." |
| s18 | "Write a handoff. I am going to clear context and start a new session." | `handoff`; `handoff_verifier` helper (`fork_turns=none`) | Focus saved, `toolkit handoff-backup` run, a checked prompt given with Goal, task, read-first list, open questions, first action, and repository state. |

## Proof, item by item

### Setup and the backup folder question

- Six questions, one per turn, each with a recommendation (s00a to s00g). The
  backup question: "Where should automatic backups of `.work-items/` and
  `.memory/` go? ... You can choose another folder or say "no backups.""
- `.toolkit.json` holds `"backup": {"dir": ".../scratchpad/backups/codex-local"}`
  (`final/toolkit.json`).
- The outcome was asked, not invented (s00g), and written in Mike's words.
- Setup commit `c062d63`: staged by name, `git diff --cached --name-status`
  read before the commit, no `.memory/` or `.work-items/` file in it.
- `.claude/settings.json` holds `"attribution": {"commit": "", "pr": "",
  "sessionUrl": false}`.

### Work item from 01-discovery to Done

- WI-001 Recent History, newest first (`final/WI-001-WORK-ITEM.md`): Created
  at 01 -> 02 -> requirements approved (03) -> 04 -> design approved -> 05 ->
  sub-items made -> moved by hand -> 12 -> 14 -> Finished. Header:
  `requirements_approved: "2026-09-28 by Mike Rihm"`, `design: approved`,
  `result_approved: "2026-09-28 by Mike Rihm"`, `status: Done`.
- Overview at the end: "Current position: Done on 2026-09-28. ..." and "Next
  action: None. Finished." No `<!--` guide comment is left in any item or the
  design.
- `final/tracker-and-doctor.txt`: `slug-cli/ (group)` with WI-001 Done and
  WI-002, WI-003 Done under it; `toolkit work show` prints "Continue with:
  nothing (finished)"; "Nothing is waiting on the owner."; doctor outside
  Codex: "Result: clean. No problems and no warnings here (2 for Codex only)."
  exit 0.
- `final/git-and-app.txt`: `node --test tests/slug.test.js` 7 pass, 0 fail;
  `node bin/slug.js "Hello World!" --max 20` prints `hello-world`.

### Sub-item made by splitting

- s07: "Created WI-002: Build basic slug command (06 Implementation plan, In
  Progress, sub-item of WI-001)" and the same for WI-003.
- `toolkit work show WI-003`: "Parent: WI-001 | Sub-items: none | Design: none
  of its own; WI-001's design is approved".
- WI-001 history: "Sub-item WI-003 created: ... WI-003 delivers R-02. Those
  requirements stay here, unchanged and approved."

### Folders moved and renamed by hand

- s08 session-start briefing (`sessions/s08-keep-going-build.hooks.txt`):
  - "Moved: WI-001 from WI-001-build-slug-command-with-max-option to
    slug-cli/WI-001-slug (moved and renamed by hand). It is still a top-level
    item."
  - "Renamed folder: WI-003's folder was renamed by hand from
    WI-003-add-max-length-option-to-slug-command to max-option; the item
    itself is the same. It moved along with its parent WI-001's folder, and it
    is still a sub-item of WI-001."
- The agent said both in its first message and again in the final reply: "The
  tracker also recorded two folder changes: WI-001 moved to
  `slug-cli/WI-001-slug` and remains a top-level item; WI-003's folder was
  renamed to `max-option` and remains a sub-item of WI-001."
- WI-001 history row: "Moved by hand: ... -> .work-items/slug-cli/WI-001-slug/WORK-ITEM.md.
  | It is still a top-level item. Group: slug-cli." Every later command used
  the new paths with no error.

### Preference saved and found later

- s02 hook line: "The owner stated something to keep; memory-save records it,
  or work-on if it is a task." Hook state: `"keep": "remember that"` and one
  `toolkit memory save` record.
- `final/user_node_project_preference.md`: `status: current`, `authorization:
  Approved by Mike on 2026-09-28`, bold labels.
- The build used no npm packages and `node:test`. s15 answered from the
  record.

### Unanswered "Save to memory?" becomes a proposal

- sP1 final message: "Save to memory: You publish your blog on Ghost, and
  Ghost keeps only the first 190 characters of a slug?" The agent ran no save.
- sP1 hook state: record `"toolkit memory save --proposal (Stop hook)"` at
  20:18:01.974, 0.2 seconds after the final message; `proposedSummaries` holds
  the summary.
- The record, as the Stop hook saved it: `status: needs-review`,
  `authorization: Proposed by the agent on 2026-09-28; the owner has not
  answered`, "How to apply: Not stated by the owner. Do not rely on this until
  the owner approves it."
- sP2 (same conversation, a different question): UserPromptSubmit added "At
  the end of the last turn the toolkit saved the unanswered "Save to memory:
  ...?" as a memory proposal: project_publish_blog_ghost_keeps_only_first_190_characters.
  It is not a fact. ..." The proposal stayed saved.
- Listed in s09 ("one proposed memory fact for you to accept or reject") and
  in s10 as the third of three decisions. `toolkit work decisions` printed it
  under "Memory proposals (saved, not yet approved; agents do not rely on them
  until the owner says yes or no)".
- s13: approved with `toolkit memory approve ... --by Mike`; `status: current`,
  `authorization: Approved by Mike on 2026-09-28`, and the "Do not rely on
  this" words are gone (`final/project_publish_blog_ghost_keeps_only_first_190_characters.md`).

### "Where are we?" and "What do you need from me?"

- s09 and s17 opened `work-status`; s10 opened `work-decide`. None wrote a
  record: the hook state shows `records []` and `edits []`, and only the
  generated `.work-items/.toolkit-state.json` changed
  (`snapshots/s09-*`, `s10-*`, `s17-*hashes.txt`).

### Handoff

- s18 saved the focus ("Next session starts with - 2026-09-28 20:32 UTC | No
  active work item. WI-001, WI-002, and WI-003 are Done. ..."), ran
  `toolkit handoff-backup`, had the `handoff_verifier` helper check the prompt,
  and gave the prompt in one text block ending "Clear the context, then paste
  this prompt."

### No AI credit in any commit

`final/git-and-app.txt`: five commits, all by `Mike Rihm <michael@rihm.com>`;
`git log --all --format=%B | grep -i -n -E 'co-authored|generated
with|claude|codex|openai|anthropic|chatgpt|gpt|\bai\b'` finds nothing (exit
1). One branch `main`, one worktree, clean tree, no remote.

### A backup after work-finish

| When | `exportedAt` in `toolkit-export.json` | Work item files in the backup |
| --- | --- | --- |
| Setup (s00g, s00h) | 2026-09-28T19:52:37Z | 4 (templates and generated files) |
| After the three `work finish` runs (s14) | 2026-09-28T20:29:03Z | 8, including `slug-cli/WI-001-slug/WORK-ITEM.md`, `DESIGN.md`, and both sub-items |
| Handoff (s18) | 2026-09-28T20:32:38Z | 8 |

Each `toolkit work finish` printed "Backed up .work-items/ and .memory/ to
.../backups/codex-local/slug-2026-09-28." (`snapshots/s14-backup-*.txt`,
`final/backup-listing.txt`). The backup holds both memory records.

### Every hook ran

`snapshots/hook-table.txt` and `snapshots/stop-check.txt`. s00a to s00f ran
before `toolkit init`, when the folder was not a V2 project, so the hooks
correctly did nothing there.

| Hook | Proof |
| --- | --- |
| SessionStart | The "Project briefing" arrived in all 21 turns from s00h on (resume included). |
| UserPromptSubmit | Every turn from s00h on started a new turn in the hook state at the prompt time. s02: the keep-phrase line. sP2: the Stop hook's proposal note passed on. |
| PreToolUse | s16: the header edit was refused. s08 and s12: the note for a toolkit command joined to `git status` with `&&`. |
| PostToolUse | Toolkit writes recorded in the hook state in 15 turns (up to 28 records in s07). s16: "WI-003 was edited directly and passes validation." |
| Stop | In every turn from s00g on, the hook state was written 0.1 to 0.2 seconds after the final message (the Stop hook always writes it). sP1: the Stop hook saved the proposal. |

No `hook-errors.log` exists in the project's Git folder.

### No toolkit command stalled

- 286 toolkit commands ran (`sessions/*.durations.txt`). The longest tool
  call holding one took 6.96 seconds from call to result (a `toolkit work
  edit` in s08, whose script itself reported 0.3 seconds of wall time);
  `toolkit init` took 4.08 seconds. None waited without output.
- Every toolkit command exited 0 except `toolkit doctor` inside Codex, which
  exits 1 for the two Codex-only trust warnings, as designed.
- No ask-first command (memory delete, import, machine-setup, Hindsight
  service install or start) was needed in this scenario.

### Mike's own settings untouched

`~/.codex/config.toml` sha256 `f8570208...9b6294` and `~/.claude/settings.json`
sha256 `d80a8b38...54e65b` are the same before and after the run
(`final/host-config-hashes.txt`).

### Repository checks after the run

| Check | Result |
| --- | --- |
| `node --test "tests/**/*.test.mjs"` in `plugins/toolkit` | 913 tests, 910 pass, 0 fail, 3 skipped by design |
| `check-skills.mjs --quiet` | 0 failures, 0 warnings, 16 notes |
| `sync-skill-references.mjs --check` | 159 copies, 0 problems |
| `import-model.mjs --check` | the copy matches the approved model folder (commit `5e7d7a0`) |
| git-workflows tests | 13 of 13 pass |
| `claude plugin validate .` | passed |

(`snapshots/check-toolkit-tests-tail.txt`, `snapshots/check-other.txt`.)

## Problems found

All low. None blocked the work or gave Mike a wrong answer.

1. **A Stop-hook proposal keeps the question's second-person wording.** The
   record title, description, and "Remember" line say "You publish your blog
   on Ghost ...", copied from the question the agent asked Mike. After
   `toolkit memory approve` the record still says "You", and "Why" and "How to
   apply" stay "Not stated by the owner." A later agent reads "You" in a
   project memory record. s15 answered correctly, so nothing was misread in
   this run. Suggested fix: have memory-save's approve step (or `toolkit
   memory approve`) offer to rewrite the text in the third person with the
   owner's name, or have the Stop hook save "The owner ..." when the summary
   starts with "You" or "Your".
2. **`toolkit work next` counts fewer decisions than `toolkit work
   decisions`.** In s09, `next` printed "2 decisions wait on the owner" while
   `decisions` printed "3 decisions wait on the owner" (the third is the
   memory proposal). `cmdNext` in `lib/commands/work.mjs` counts only work
   decisions; `cmdDecisions` adds `memory.proposals`. With only a proposal
   waiting, `next` would say nothing. The agent reported all three correctly.
   Suggested fix: count the memory proposals in `next` too.
3. **The design had no critic.** s06 wrote and proposed the design with no
   `design-critic` helper, and said so: "No independent helper critique ran
   because WI-001 is recorded as owner-led with no helper team arranged."
   solution-design says every design gets at least one critic unless the
   session has no agent tool or the owner said no. The session had the tool
   (s04 and s08 used it). Agent behavior; the skill could say that owner-led
   delivery does not remove the design critic.
4. **One waiting decision went unnamed.** s10 said it would take three
   decisions in order. After Mike approved WI-003 in s12, the reply ended
   "I'll wait for your separate merge authorization." and did not name the
   memory proposal still waiting. The proposal stayed in `toolkit work
   decisions`, so nothing was lost. Agent behavior; work-decide already says
   to name every waiting decision.
5. **A finished parent keeps a validation warning.** After Done, `toolkit
   work validate` warns on WI-001: "Tasks has no task lines". WI-001's tasks
   were delivered by WI-002 and WI-003, so its Tasks section only points to
   them. Suggested fix: do not warn about missing task lines on an item whose
   sub-items hold the tasks, or on a Done item.
6. **Toolkit commands joined to `git status` (agent behavior).** s08 ran
   `git status --short --branch && toolkit work lifecycle` and s12 ran
   `git status --short --branch && toolkit work show WI-003`. The PreToolUse
   note fired both times. Both were read commands and worked.
7. **Setup changed template line breaks (agent behavior).** Before the setup
   commit the agent ran `git diff --cached --check`, which flagged the two
   trailing spaces the model's `PROJECT-ROADMAP.md` uses as Markdown line
   breaks, and removed them. The roadmap's "Outcome", "Exit condition", and
   similar lines now join into one paragraph when shown. No skill asks for
   `--check`.

Observations, not problems:

- WI-001 went from 05 straight to 12 after both sub-items were Done; its
  result approval was recorded from Mike's "Ship it ... finish ... WI-001"
  with his words quoted in the history.
- s07 made two sub-items (basic command and `--max`) where Mike asked for
  one (`--max`). Each covers one approved requirement; nothing was lost.
- Setup rewrote the project's own `README.md` second line with Mike's
  outcome; doctor now notes README.md as the project's own file.

## Harness notes (not toolkit bugs)

- The two Codex-only doctor warnings ("Codex does not trust this folder", "The
  Toolkit V2 hooks are not trusted in Codex yet") come from giving trust per
  run with `-c` and `--dangerously-bypass-hook-trust`. The agents told Mike
  about both steps; doctor exits 0 outside Codex.
- `git worktree add` in s07 was refused because `--sandbox workspace-write`
  cannot ask for approval. The agent gave Mike the exact command and set the
  item waiting on him; s08, with Mike's approval in the prompt, ran it.
- `node --test tests/` in `snapshots/mike-tries-results.txt` failed because
  Node 25 reads a folder name as one file; `node --test tests/slug.test.js`
  passes 7 of 7.
- The tester's `.jsonl` scans count a command as a toolkit command when its
  text holds the word `toolkit`, so one `ls` of `.toolkit.json` in s00a shows
  as a non-zero exit there; it is not a toolkit command.

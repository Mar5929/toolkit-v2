# Confirmation run a-local: local tracker, built-in memory, Codex

Run on 2026-09-28 from 16:21 to 17:27 UTC, after the final fix round, in 28
real `codex exec` turns (codex-cli 0.157.0, model `gpt-6-sol`, reasoning
effort medium). Toolkit V2 versions: toolkit 0.2.4, work 0.2.6, memory 0.2.4,
session-skills 0.2.4, git-workflows 0.2.4, sf-architect-solutioning 0.2.1.
The project is a tiny Node.js command, `tally`, that counts the words or
lines in a text file.

## Result

**Not passed.** The work item reached Done and nothing blocked a solo
developer, but one required behavior failed: an unanswered "Save to memory?"
question was dropped both times it was tested, instead of being saved as a
proposal (problem 1). The proposal was saved, listed in "what do you need
from me?", and rejected only after Mike said "I'll decide later".

What worked:

- WI-001 "Build the tally CLI" (type `build`) went from `01-discovery` to
  Done, with Mike's approvals recorded for requirements, design, and result.
- WI-002 "Add --lines line count" was split out of WI-001 with
  `toolkit work new --parent WI-001 --covers R-02`, inherited the requirements
  approval, the approved design, and the delivery choice, and reached Done
  before its parent.
- Between s07 and s08 Mike moved WI-001's folder into a new group folder
  under a new name and renamed the sub-item folder. The s08 briefing reported
  both changes in correct words, the first toolkit command wrote a history
  row on each item, and every later command used the new paths.
- "Remember that I prefer plain Node.js with no npm packages, and tests
  written with the built-in node:test runner" was saved (s02) and found (s15).
- "Where are we?" (s09, s17) and "What do you need from me?" (s10) changed no
  record and counted the decisions correctly, including the memory proposal.
- The proposal was listed by `toolkit work decisions`, in the briefing, and
  in `.memory/MEMORY.md`, left out of search, and rejected in s13: the file,
  the index line, and the briefing entry are gone.
- Git: 8 commits, all by `Mike Rihm <michael@rihm.com>`, none with an AI
  credit line. No `git fetch` ran in any session.
- Hooks: the session-start briefing arrived in every session after setup;
  the keep-phrase line fired on "Remember that"; the pre-edit guard refused a
  direct header edit; the post-edit check validated a direct body edit; the
  Stop hook never blocked.

## Codex plugins re-added first

This run did the one-time re-add for all parallel Codex runs
(`codex-readd/`).

1. `cp -p ~/.codex/config.toml` to the scratch folder
   (`confirm-a-local-tools/codex-config-before-readd.toml`, sha256
   `c135861b...c991`).
2. `codex plugin add <name>@toolkit-v2 --json` for the six plugins. All exited
   0: toolkit 0.2.4, work 0.2.6, memory 0.2.4, session-skills 0.2.4,
   git-workflows 0.2.4, sf-architect-solutioning 0.2.1, each at
   `~/.codex/plugins/cache/toolkit-v2/<name>/<version>`.
3. The add changed exactly six lines, `enabled = false` to `enabled = true`
   (`codex-readd/diff-after-plugin-add.txt`).
4. A small Python edit set the `enabled` line under each
   `[plugins."<name>@toolkit-v2"]` table back to `false` ("changed 6").
   `diff` against the backup then printed nothing, exit 0
   (`codex-readd/diff-after-disable.txt`); the file parses as TOML;
   `codex plugin list` shows all six `installed, disabled`.
5. `diff -rq` of each source plugin folder against its cache copy: 0
   differences for all six.
6. Wrote `scratchpad/codex-readd.done` at 16:21:33 UTC.
7. At the end of the run `~/.codex/config.toml` still equals the backup
   (diff exit 0).

## How the sessions ran

- Project folder: a new Git repository whose first commit holds only a
  three-line `README.md`:
  `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/confirm-a-local`
- Each session was a new process, run by `sessions/harness-ca-run.sh`:

  ```sh
  codex exec --json <sandbox choice> --dangerously-bypass-hook-trust \
    -c 'model_reasoning_effort="medium"' -c 'notify=[]' \
    -c 'projects={"<project folder>"={trust_level="trusted"}}' \
    -C "<project folder>" "<prompt>" < /dev/null
  ```

- Sandbox choice: `--sandbox workspace-write`, except s00a, s00b, s08, and
  s14, which used `--approve-for-me` (Codex's automatic reviewer stands in
  for Mike clicking "approve" on init and on Git writes that the prompt
  approved). s00a also turned the toolkit plugin on for that run only with
  `-c 'plugins={"toolkit@toolkit-v2"={enabled=true}}'`, because a new folder
  has no `.codex/config.toml` yet.
- Four memory turns (sP3, sP6, sP8, sP9) continued an earlier session with
  `codex exec resume <thread id> "<prompt>"`, so that Mike's next message
  could leave the agent's question unanswered in the same conversation.
- `sessions/` holds, per session: the prompt, the exact command, the
  `codex exec --json` output, a readable summary with every tool call, the
  hook messages Codex added, the toolkit hook state file, and the skills and
  agents opened. `sessions/index.txt` lists times, thread ids, and exit codes.
  The full Codex session logs stay in
  `scratchpad/runs/confirm-a-local-logs/*.rollout.jsonl`.
- Codex ran the cached plugin copies made at 16:21 UTC, which matched the
  committed source file for file. Other sessions changed plugin source files
  in the working tree later (for example `plugins/toolkit/lib/project/machine.mjs`
  and `checks.mjs`); those changes were not part of this run.
- The tester ran only read commands in the project folder (`toolkit work
  decisions`, `toolkit memory find`, and the final checks), plus the hand
  move and the CLI runs Mike reports in s11 and s12
  (`snapshots/mike-tries-results.txt`).

## Timeline

| Session | Mike's prompt (short) | Skills opened | What happened |
| --- | --- | --- | --- |
| s00a | "Set up this project with Toolkit V2: project name tally, key tally, owner Mike. Track work in local folders. ... built-in .memory/ ... not a Salesforce project. I do not want a SOUL.md. ..." | `project-setup` | `toolkit init --name 'tally' --key tally --tracker local --memory builtin --owner 'Mike' --decline SOUL.md`: "Added 33 files". Doctor 0 problems. Focus written with `--text '...'`. Did not invent the outcome: "What should tally do for you in one sentence? Based on the existing README, I suggest: ..." |
| s00b | "The outcome: tally tells me how many words or lines a text file has ... commit the setup files ..." | `project-setup`, `publish-docs`, `memory-save` | Filled the outcome, staged by name, commit `b2edf8d`. Last line "Tell me the first thing you want built." |
| s01 | "Build the tally CLI: `node bin/tally.js notes.txt` should print how many words ... Also add a --lines flag ..." | `work-on`, `work-requirements` | WI-001 created at 01. The backticked request was saved in single quotes, intact. R-01, R-02, Q-01. `validate`: "1 open question waits on the owner". |
| s02 | "Remember that I prefer plain Node.js with no npm packages, and tests written with the built-in node:test runner." | `memory-save` | Keep-phrase hook line. `toolkit memory save --type user --name nodejs-development-preference ... --body '...' --approved-by Mike`. Bold labels. "Say 'forget that' to undo." |
| s03 | "Yes: words are anything separated by spaces or line breaks ... An empty file prints 0 for both. By the way, I read most of your replies on my phone. ..." | `work-decide`, `work-requirements`, `memory-save`; `requirements_check` helper | Q-01 answered, R-01/R-02 rewritten, spec check. Asked "Do you approve these requirements?" The phone remark was not proposed for memory. |
| s04 | "Approved." | `work-decide`, `work-requirements`, `solution-design`; `requirements_analyst` helper | Approval recorded (03), design started (04), an analyst found an open line-count case; item set back to 02 with Q-02. First `'Owner'\''s words'` failure (problem 2). |
| s05 | "Yes, I approve that rule: blank lines count, and a trailing line break does not add an extra line ..." | `work-decide`, `work-requirements`, `work-on`, `solution-design`, `work-delegate` | Q-02 answered, R-02 finalized, requirements approved again, delivery owner-led ("Small item: one or two tasks, so no delivery offer."). `decisions`: "Nothing is waiting on the owner." although an empty proposed `DESIGN.md` existed. |
| s06 | "Keep going." | `work-on`, `solution-design`; `requirements_check`, `design_architect`, `design_critic` helpers | Team stated in one line, not asked. Design drafted in a `mktemp -d` folder, deleted. One option, Option A. "Do you approve Option A?" |
| s07 | "I approve option A. Before you build, split this up ... make the --lines flag its own sub-item under it." | `work-decide`, `work-organize`, `work-on`, `solution-design` | `approve --design`, then `set --title 'Build tally word count CLI'` (folder and design heading renamed by the CLI), then `new --parent WI-001 --covers R-02` = WI-002 at 06. `git worktree add` refused ("AskForApproval is set to Never"); exact command given, WI-001 waiting on Mike with Q-03. |
| (hand) | Tester as Mike: `mkdir .work-items/counting`, moved and renamed WI-001's folder to `counting/WI-001-word-count`, renamed WI-002's folder to `lines-flag` | none | `snapshots/hand-move-commands.txt`, `before-move-tree.txt`, `after-move-tree.txt`. |
| s08 | "Keep going. I approve the git commands Codex asks for to build these two items (worktree add, add, commit), but no merge yet." | `work-on`, `work-decide`, `work-check`; `acceptance_check` helper | First message: "The tracker found two folder changes: WI-001 moved from ... to `counting/WI-001-word-count` and remains a top-level item. WI-002's folder was renamed from ... to `lines-flag` ...". Worktrees on `claude/wi-001-build-tally-word-count-cli` and `claude/wi-002-add-lines-line-count`, four commits, test plans in `tests/`, both at 11. "Do you approve the tested results for both WI-001 and WI-002?" |
| sP1 | "Quick note before I review the results: my test machine is a Mac mini running Node 22 ..." | `memory-save`, `work-requirements`, `work-on` | Put in both items' history, no memory proposal. |
| sP2, sP3 | "Is there anything ... worth keeping in memory? Suggest it; do not save anything yet." then (resume) "Which folder do I run the WI-001 result from?" | `memory-save` | sP2 suggested the Mac mini fact. sP3 answered the folder question; nothing saved as a proposal. |
| sP4 | "Should anything from this project be saved to memory? Ask me about it." | `memory-save` | "I have no new memory to propose." |
| sP5, sP6 | "Propose a memory about my test machine ... ask me yes or no before you save it." then (resume) "Which folder do I run the WI-002 result from?" | `memory-save`, `work-decide` | sP5: "Save this to project memory? Yes or no?" sP6 answered the folder question; **the proposal was not saved** (problem 1). |
| sP7, sP8 | "I think the fact that I only run tally on my Mac mini with Node 22 might be worth keeping. Ask me before you save it." then (resume) "How many tests does WI-002 have?" | `memory-save` | sP7: "Save to memory: "Mike runs tally only on his Mac mini with Node 22"? I haven't saved it." sP8 answered "9 automated tests"; **the proposal was not saved** (problem 1). |
| sP9 | (resume) "I'm not sure yet about that Mac mini memory. I'll decide later." | `memory-save` | `toolkit memory save --type user --name tally_runtime_environment ... --proposal`: status `needs-review`, authorization "Proposed by the agent on 2026-09-28; the owner has not answered". "Saved as a proposal for your yes or no". |
| s09 | "Where are we?" | `work-status` | "Three decisions wait on you: WI-001 ... WI-002 ... A proposed memory note about using tally on your Mac mini with Node 22 needs a yes or no. It is not treated as fact yet." 0 records written. |
| s10 | "What do you need from me?" | `work-decide` | "I need three decisions from you: result approval for WI-001 ..., result approval for WI-002 ..., and whether to keep the proposed memory note ...". Asked WI-001 first, with a recommendation. 0 records written. |
| s11 | "I ran it in the WI-001 worktree: a file with four words printed 4, and an empty file printed 0. I approve the WI-001 result." | `work-decide` | `approve WI-001 --result --by Mike`. Asked WI-002 next. |
| s12 | "Not yet on the merge. For WI-002 ... I approve the WI-002 result." | `work-decide` | `approve WI-002 --result --by Mike`. Then asked the memory proposal: "I recommend no because it is already recorded in the work items. Should I reject that proposal?" |
| s13 | "No, do not keep the Mac mini memory proposal. Reject it." | `memory-save`, `work-decide` | `toolkit memory reject user_tally_runtime_environment`: "Rejected ...: the owner said no, so the proposal was deleted." `memory get` then: "There is no memory record with the key ...". |
| s14 | "Ship it: WI-001 and WI-002. There is no remote ... merge them into main locally ... Then mark both done and clean up ..." | `work-finish`, `merge-and-clean-up`, `publish-docs` | Stage 12, `git merge --ff-only` of WI-001; WI-002 needed `merge main` in its worktree, 9 of 9 tests, then fast-forward. `publish-docs.mjs start`: "No remote: this save will be committed locally on main; nothing is fetched or pushed." `publish`: "No remote: committed locally. f86ba9c... is on main." `requirements/tally/TALLY.md`, `system-guide/tally.md`. Finished WI-002 then WI-001; worktrees and branches removed. |
| s15 | "Do you remember how I like code and tests written in this project? And what machine do I run tally on?" | `memory-find` | "Yes. You prefer plain Node.js with no npm packages, and tests written with the built-in `node:test` runner." with a link to the record. The machine answer came from `system-guide/tally.md`. |
| s16 | Direct-edit checks: a body line in WI-002, a sentence in WI-001's `DESIGN.md`, then WI-002's priority in the header | `work-on` | Body edit: "WI-002 was edited directly and passes validation. ...". Design edit: saved, no message (problem 5). Header edit refused: "Command blocked by PreToolUse hook: This edit changes the header of ... (priority). ... Nothing was changed." |
| s17 | "Where are we?" | `work-status` | "There are no open work items or decisions waiting on you. WI-001 ... and WI-002 ... are Done ..." |

## Proof, item by item

### Work item from 01-discovery to Done

- `final/WI-001-WORK-ITEM.md`: Recent History, newest first, shows 01 -> 02
  -> 03 -> 04 -> 02 (for Q-02) -> 03 -> 04 -> 05 -> 06 -> 07 -> 08 -> 09 -> 11
  -> 12 -> 14 -> Done. Frontmatter: `requirements_approved: "2026-09-28 by
  Mike"`, `design: approved`, `result_approved: "2026-09-28 by Mike"`,
  `status: Done`, `waiting_on: "none"`.
- Overview at the end: "Current position: Done on 2026-09-28. ...", "Next
  action: None. Finished.", "Blockers: None.". Notes > Resume here: "Finished
  on 2026-09-28. Nothing to resume." No `<!--` guide comment is left in
  either item or the design.
- `final/tracker-and-doctor.txt`: `counting/ (group)`, `WI-001 ... (Done)`,
  `WI-002 ... (Done)` under it; `Checked 2 items: 2 clean, 0 errors, 0
  approval gate problems. No open question waits on the owner.`;
  `toolkit work show` prints "Continue with: nothing (finished)" for both;
  `Nothing is waiting on the owner.`
- `final/git-and-app.txt`: 8 commits by `Mike Rihm <michael@rihm.com>`;
  `git log --all --format=%B | grep -i -E 'co-authored|generated
  with|claude|codex|openai|anthropic|chatgpt|gpt'` finds nothing (exit 1);
  one branch `main`, one worktree, clean tree, no remote; `node --test` 9
  pass, 0 fail.
- `.claude/settings.json` holds `"attribution": {"commit": "", "pr": "",
  "sessionUrl": false}`.
- Mike's own runs (`snapshots/mike-tries-results.txt`): WI-001 printed 4 and
  0; WI-002 printed 4, 4, 2, 0, and a clear error with exit 1 for a missing
  file.

### Sub-item made by splitting

- s07: "Created WI-002: Add --lines line count (06 Implementation plan, In
  Progress, sub-item of WI-001) ... It delivers WI-001 R-02 and inherits that
  requirements approval (2026-09-28 by Mike). WI-001's approved design covers
  it, so it starts at planning with no design of its own. Delivery:
  owner-led, as recorded for WI-001."
- `toolkit work show WI-002`: "Parent: WI-001 | Sub-items: none | Design:
  none of its own; WI-001's design is approved ...".
- WI-001's Roadmap has WI-002 in its Sub-items column; WI-002's Related items
  names its parent.

### Folders moved and renamed by hand

- s08 briefing (`sessions/s08-keep-going-build.hooks.txt`):
  - "Moved: WI-001 from WI-001-build-tally-word-count-cli to
    counting/WI-001-word-count (moved and renamed by hand). It is still a
    top-level item."
  - "Renamed folder: WI-002's folder was renamed by hand from
    WI-002-add-lines-line-count to lines-flag; the item itself is the same.
    It moved along with its parent WI-001's folder, and it is still a
    sub-item of WI-001."
- History rows written by the CLI: WI-001 "Moved by hand:
  .work-items/WI-001-build-tally-word-count-cli/WORK-ITEM.md ->
  .work-items/counting/WI-001-word-count/WORK-ITEM.md. | It is still a
  top-level item. Group: counting."; WI-002 "Folder renamed by hand: ... ->
  .work-items/counting/WI-001-word-count/lines-flag/WORK-ITEM.md. | Same item;
  the toolkit uses the new path. It moved along with its parent WI-001's
  folder ...".
- s08 to s17 used the new paths with no error.

### Preference saved and found later

- s02 hook line: "The owner stated something to keep; memory-save records
  it, or work-on if it is a task."; hook state `"keep": "remember that"` and
  one `toolkit memory save` record.
- `.memory/user_nodejs_development_preference.md`, `status: current`,
  `authorization: Approved by Mike on 2026-09-28`, bold labels
  `**Remember:**`, `**Why:** Not stated by the owner.`, and the others.
- Listed under "Memory records" in every later briefing; the design and the
  build used no npm packages and `node:test`; s15 answered from it with a
  link to the record.

### "Where are we?" and "What do you need from me?"

- s09 opened `work-status`, ran `toolkit memory focus`, `work lifecycle`,
  `work decisions`, `work next`, `work list --tree`, and wrote no record (hook
  state `records []`, `edits []`). Only the generated
  `.work-items/.toolkit-state.json` changed (`snapshots/*-s09-hashes.txt`).
- s10 opened `work-decide`, ran `toolkit work decisions` (3 decisions, the
  proposal among them), asked one decision with a recommendation, wrote no
  record.

### Memory proposal

- Unanswered question, twice: sP5 asked "Save this to project memory? Yes or
  no?"; sP6 (same conversation) answered another question and saved nothing.
  sP7 asked "Save to memory: ...?"; sP8 answered "9 automated tests" and saved
  nothing. `.memory/` had one record after both.
- Deferred answer: sP9 saved it with `--proposal`. `toolkit work decisions`:
  "Memory proposals (saved, not yet approved; agents do not rely on them
  until the owner says yes or no): - user_tally_runtime_environment: ...
  Yes: toolkit memory approve ... No: toolkit memory reject ...".
  `MEMORY.md`: "... [proposal: not a fact until the owner answers]".
  `toolkit memory find 'Mac mini'`: "No memory records match ... 1 saved
  proposal also matches; it is not a fact until the owner answers."
- s09 and s10 listed it; s12 asked it with a recommendation; s13 rejected it.
  Final `toolkit memory list --status all` shows only the Node.js record, and
  the final briefing says "Project memory (builtin): 1 record."

## Fixed bugs from open-bugs-status.md, checked in this run

| # | Bug | This run |
| --- | --- | --- |
| 1, 40 | Delivery offer listed twice | Not seen. s05 recorded owner-led for a small item; no offer listed. |
| 2 | Done item keeps a stale Overview | Fixed. "Done on 2026-09-28", "Blockers: None." on both items. |
| 3 | `git fetch` with no remote | Fixed. 0 `git fetch` commands in 28 turns. |
| 4, 60 | publish-docs with no remote | Fixed. s14 output quoted above. |
| 5 | Setup filled the outcome without asking | Fixed. s00a asked for it with a suggestion. |
| 6 | Current focus stale | Not seen. Agents saved the focus in every writing session; no stale-focus line was needed. |
| 7 | "Continue with: work-finish" on Done | Fixed. "Continue with: nothing (finished)". |
| 8, 15 | validate "0 questions for the owner" | Fixed. "0 approval gate problems. 1 open question waits on the owner". |
| 9, 44 | Chained toolkit commands (agent behavior) | Once: s07 `git status --short --branch; toolkit work decisions; toolkit work show WI-001`. The PreToolUse note fired. |
| 10, 37 | History rows mixing changes | Not seen. |
| 11, 39 | Replies without a next step | Came back in three memory replies (problem 7). |
| 12, 24 | Setup steps never checked off | The briefing listed the done step each session; the agents kept both steps because doctor still reported them under the bypass flag (harness). |
| 13 | Empty design counted as proposed | Fixed. s05 `decisions`: "Nothing is waiting on the owner." with an empty proposed design on disk. |
| 14 | Double-quoted `--text` ran backticks | Fixed. Every toolkit text used single quotes; the backticked request was saved intact. |
| 16, 30 | project-setup run-alone rule, focus through a fixed file | Fixed. `toolkit memory focus --text '...'` alone. |
| 17, 63 | Memory labels not bold | Fixed. |
| 18 | Retitle left the old title in the folder and the design heading | Fixed. "The design heading now has the new title. Renamed its folder to match the new title". The retitle was not told to Mike (problem 3). |
| 19 | `work edit` did not report its warnings | Fixed. "Warning after this edit: Overall status is "Refining" but requirements_approved is ..." |
| 20 | solution-design asked about helpers | Fixed. "The design team for this small item is one requirements analyst, one architect, and one critic." |
| 21, 46 | Move report wrong, or only in a progress line | Words correct. Still only in an early message of s08, not the final reply (problem 3). |
| 22 | Requirements area layout | Fixed. `requirements/tally/TALLY.md`. |
| 27 | No design agents | Fixed. `design_architect` and `design_critic` ran (problem 6 on how they started). |
| 28 | Result approval counted twice | Fixed. Each result is one decision in s09 and s10. |
| 29 | Branch name not linked | Fixed. `work show`: "Worktree branch for this item: claude/wi-001-build-the-tally-cli"; worktrees used `claude/wi-00N-...`. |
| 31 | Task fields joined | Fixed. Each task field on its own line. |
| 36 | Approved design gaps not noticed | Fixed. "Design warning: The approved design has no "## Diagrams" section"; the agent added it. |
| 38 | Questions through a question tool | Fixed. No question tool call in any session. |
| 41, 62 | Focus lost its heading | Fixed. `# Current focus` and `Last updated:` kept. |
| 42 | Fixed-name temp files | Fixed. `mktemp -d` folders, deleted; none left in the project. |
| 43 | Test plan in `.work-items/` | Fixed. `tests/WI-001-TEST-PLAN.md`, `tests/WI-002-TEST-PLAN.md`. |
| 45 | PostToolUse named the wrong command for a design | Not seen: the once-per-session reminder was used by the record edit first (problem 5). |
| 47 | Small record problems | (a) sub-item delivery inherited: fixed. (b) guide comments removed: fixed. (c) as 7: fixed. (d) "Owner words:": came back, cause found (problem 2). (e) title said: the retitle was not said (problem 3). (f) "Design text changed after approval." written twice by the CLI in s07; not told to Mike (problem 4). |
| 48 | V2 plugins on machine-wide | Plugins stayed off; doctor gave no such warning. |
| 49 | Briefing listed hook trust inside a hook's briefing | Fixed. No trust warning in any hook briefing. |
| 50 | memory-save wrote a file and saved in one script | Fixed. `--body '...'` in s02 and sP9. |
| 58 | AI credit in commits | Fixed. 0 of 8 commits; attribution setting present. |
| 64 | Doctor exit code with only other-host warnings | Fixed. Outside Codex: "Result: clean. No problems and no warnings here (2 for Codex only)." exit 0. |
| 65 | Recent History oldest first | Fixed. Newest first. |
| 72 | Parent and sub-item links | Fixed. Related items and the Roadmap Sub-items column. |

## Problems found

Ordered by how much they would hurt a solo developer. None blocked the work
item.

1. **An unanswered "Save to memory?" is dropped, not saved as a proposal
   (medium).** memory-save step 3 says an unanswered "Save to memory?" "is
   not dropped: save it as a proposal (`--proposal`, never with an
   approver)". Twice the agent asked, Mike's next message in the same
   conversation did not answer, and the agent answered that message and
   saved nothing: sP5 -> sP6 (`sessions/sP6-ignore.summary.txt`, no `toolkit
   memory` command) and sP7 -> sP8 (`sessions/sP8-ignore2.summary.txt`, no
   `toolkit memory` command). Neither reply asked the question again, so the
   proposal was lost with no trace. The rule depends on the agent noticing
   its own earlier question, and the "session is ending" case cannot be
   noticed at all (a closed window, or `codex exec`). Suggested fix: save the
   proposal at the moment of asking (`toolkit memory save ... --proposal`
   right before "Save to memory: <summary>?"), so a yes runs `toolkit memory
   approve <key> --by <owner>` and a no runs `toolkit memory reject <key>`;
   and let the Stop hook back it up: both hosts pass `last_assistant_message`
   to Stop hooks (`ai-external-knowledge/claude-code/hooks.md` Stop input;
   `ai-external-knowledge/codex/hooks.md`), so when that text holds "Save to
   memory:" and no `--proposal` save or approve ran in the turn, block once
   with "You asked 'Save to memory: ...?'. Save it now with --proposal."
   Change memory-save step 3 and the design note in
   `plugins/toolkit/lib/memory/proposals.mjs` to match.

2. **The documented apostrophe escape breaks in Codex (low to medium).**
   Every skill writes an apostrophe in one-line text as `'\''`, for example
   `--note 'Owner'\''s words: <quote>'`. This Codex version runs commands
   from a JavaScript tool, and the agent writes the command as a JavaScript
   string: `tools.exec_command({cmd:"toolkit work history WI-001 --note
   'Owner'\''s words: Approved.' ..."})`. JavaScript turns `\'` into `'`, so
   the shell receives `'Owner'''s words: Approved.'` and fails with "zsh:1:
   unmatched '" (s04, s05, s07, s11; raw call quoted from
   `s04-approve-reqs.rollout.jsonl`). Each time the agent retried without the
   apostrophe ("Mike said:", "Mike:"), and in s03, s08, s12, and s14 it wrote
   "Owner words:" from the start. Result: none of the nine owner-quote notes
   in the two items uses "Owner's words:" (5 "Owner words:", 3 "Mike said:",
   1 "Mike:"; bug 47(d) again), and
   `opHistory`'s `/^owner'?s? words:/i` does not match "Mike said:" or
   "Mike:", so a note without `--effect` would name the wrong next step (here
   every note had `--effect`). An owner quote that holds an apostrophe
   ("don't") hits the same failure. Suggested fix: in the shared header and
   `references/conventions.md` "Text in a command", add for Codex: "When the
   command is inside a JavaScript string, write the escape as `'\\''`, or use
   a template literal"; or change the note prefix to one with no apostrophe
   ("Owner said:") in every skill and in the regex in
   `plugins/toolkit/lib/work/ops.mjs`. The CLI's own fix text in
   `ops.mjs` (the `goal_not_written` error) also uses double quotes
   (`--note "Owner's words: <quote>"`), against the single-quote rule.

3. **Tracker changes are not in the final reply (low).** s08 told Mike both
   hand changes, in the CLI's words, but only in its first message; the final
   reply mentions neither. In s07 the agent retitled WI-001 ("Build the tally
   CLI" -> "Build tally word count CLI") and the CLI renamed its folder; no
   message told Mike. work-on step 1 says "in the reply, not only in a
   progress line". Suggested fix: have `toolkit work set --title` end with
   "Tell the owner: WI-001 is now called ...; its folder is now ...", and
   have work-on and work-organize keep a "Changed in the tracker" line in the
   final reply.

4. **The design was approved before its Selected design was filled
   (low).** In s07 the agent ran `toolkit work approve WI-001 --design`
   while "Selected design" still said "Pending owner decision.", then saved
   the filled design twice; the CLI wrote "Design text changed after
   approval. | ... Tell the owner what changed ..." twice, and the agent did
   not tell Mike. solution-design step 8 says to fill every Selected design
   subsection first, then approve. `approvedDesignGaps` did not flag
   "Pending owner decision." at approval. Suggested fix: have `approve
   --design` refuse, or warn, when Selected design or Recommendation and
   owner decision still says "Pending"; or let `approve --design` take the
   final text (`--set-file`) so the fill and the approval are one step.

5. **A direct patch to an approved `DESIGN.md` passes with no message and no
   history row (low).** In s16 the WI-002 body edit got the PostToolUse
   reminder; the edit to WI-001's approved design a moment later got nothing,
   because `plugins/toolkit/lib/hooks/post-tool.mjs` gives one direct-edit
   reminder per session (`state.remindedBodyEdit`). The CLI path writes
   "Design text changed after approval."; the direct path writes nothing.
   Suggested fix: for a `DESIGN.md` whose status is approved, always add a
   line (outside the once-per-session limit) and append the same history
   row the CLI writes; or have PreToolUse send approved-design edits to
   `toolkit work design --set-file`.

6. **Design helpers started with the whole conversation (low, agent
   behavior).** s06 started `requirements_check`, `design_architect`, and
   `design_critic` with `fork_turns=all`; solution-design step 9 says
   `fork_turns` set to `none` "so a checker never shares the builder's
   thread". s08's `acceptance_check` used `none`. No code change; the skill
   header could repeat it.

7. **Some memory replies end with no next step (low, bug 11 again).** sP2
   ended "I haven't saved anything." after suggesting a memory, without the
   "Save to memory: ...?" question; s13 ended "Rejected and deleted the Mac
   mini memory proposal. It is no longer pending, and I won't propose the
   same fact again."; s15 ended on the answer. memory-save step 8 and
   memory-find step 7 say to end with the waiting question or the words that
   continue.

8. **The hook briefing says the hooks are trusted while doctor says they are
   not (low; only with `--dangerously-bypass-hook-trust`).** Every Codex
   briefing said "Setup steps in the current focus that are done now ...:
   Codex trusts the Toolkit V2 hooks now." (`setupFacts` in
   `plugins/toolkit/lib/project/brief.mjs`: `if (fromHook && host ===
   'codex') hooks = true`), while `toolkit doctor` in the same session said
   "The Toolkit V2 hooks are not trusted in Codex yet". The agents kept the
   step, and s17 told Mike "those records disagree". In real use hooks run
   only when trusted, so Mike should not see this. Suggested fix: word the
   line "a Toolkit V2 hook ran in this session", or check the trust key as
   doctor does.

9. **A later requirements question left the approval recorded on a
   refinement-stage item (low).** s04 recorded the approval, then an
   analyst found an open line-count case; the agent set WI-001 back to
   `02-refinement` with Q-02. `requirements_approved` stayed set, and
   `validate` warned "Overall status is "Refining" but requirements_approved
   is "2026-09-28 by Mike"" until s05 approved again. It ended correctly.
   Suggested fix: `toolkit work set --stage 01/02` on an item with a
   requirements approval could say in one line that the approval stays
   recorded and must be asked again after the requirements change.

10. **The machine-wide `toolkit` pointer can name a scratch copy (low,
    observation).** Before this run `~/.config/toolkit-v2/plugin-root` named
    `scratchpad/budget/plugins/toolkit` (version 0.2.3), written by another
    test at 11:54, so `toolkit version` in a plain terminal printed 0.2.3.
    The first Codex hook of this run pointed it back at
    `~/.codex/plugins/cache/toolkit-v2/toolkit/0.2.4`. Any session started
    from a temporary plugin copy takes over the terminal `toolkit` until the
    next session start. Suggested fix: `refreshPointer` in
    `plugins/toolkit/lib/project/machine.mjs` writes only an installed copy
    or the configured source folder, never a folder under a temporary
    directory; doctor warns when the pointer names one.

Observations that are agent judgment, not toolkit bugs:

- A plain statement about the owner ("I read most of your replies on my
  phone", "my test machine is a Mac mini running Node 22") was never
  proposed for memory on its own (s03, sP1, sP4). A proposal came only when
  Mike asked for one.
- s01 and s03 replies speak of Mike in the third person to Mike ("The
  project requires Mike's approval ...").

## Harness notes (not toolkit bugs)

- The two doctor warnings in every Codex session ("Codex does not trust this
  folder", "The Toolkit V2 hooks are not trusted in Codex yet") come from
  giving trust per run with `-c` and `--dangerously-bypass-hook-trust`.
  Doctor exits 1 in Codex for them, as designed; outside Codex it exits 0.
- `git worktree add` in s07 was refused because `--sandbox workspace-write`
  cannot ask for approval; s08 ran with `--approve-for-me` after Mike's
  approval in the prompt.
- The memory turns sP3, sP6, sP8, and sP9 used `codex exec resume`; their
  `.summary.txt` files also list the earlier turns of that conversation.

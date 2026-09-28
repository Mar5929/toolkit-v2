# Final confirmation run "notion", round 2: Notion tracker, Notion memory, Codex and Claude Code

Run on 2026-09-28 from 22:08 to 23:32 UTC. 29 real `codex exec` turns
(codex-cli 0.157.0, model `gpt-6-sol`, reasoning effort `high`, Mike's own
default) and 4 real `claude -p` turns in one Claude Code session (Claude Code
2.1.280, model `claude-opus-5-5[1m]`), all with Mike's everyday installs from
decisions 10 and 11. Toolkit V2 versions: toolkit 0.2.7, work 0.2.9, memory
0.2.7, session-skills 0.2.7, git-workflows 0.2.7. The project is a small
Node.js command, `tip-split`, that splits a restaurant bill with the tip
included.

Round 1 of this run is in `evidence-round-1.md`, with its files in
`sessions/`, `final/`, `notion/`, and `harness/`. Every file of round 2 is in
`round-2/`.

## Result

**Passed**, with one check not met by design and five findings that do not
block or mislead a solo developer.

- The whole scenario reached its end state in real sessions: setup on Mike's
  real Notion page, one work item from `01-discovery` to Done with his
  approvals, a sub-item split, two hand changes in Notion that the next
  sessions noticed, a saved preference found later, an unanswered
  "Save to memory?" that became a proposal and was approved, "Where are we?"
  and "What do you need from me?" in both hosts, and a checked handoff.
- Round 1's high problem is gone: `toolkit notion ensure-root` passed on
  Mike's real page, no agent edited his Notion with `ntn api`, and his
  "All Projects" view is byte for byte the same before and after the run.
- **Check not met, by design:** no backup appeared in the backup folder after
  `toolkit work finish`. With a Notion tracker and Notion memory nothing lives
  only on this computer, and the toolkit now says so every time (init's
  next-step line, the setup reply, `work finish`, the handoff). Whether Notion
  projects should get an automatic export is Mike's open decision.
- **Two findings repeat from round 1 even though the skill text was fixed:**
  a fact Mike mentioned in passing was saved as owner-approved memory without
  the "Save to memory?" question (finding 1), and "no agent team" again
  skipped the independent acceptance check (finding 2). Both were told to Mike
  in plain words in the same reply, so nothing was hidden.

## How the sessions ran

| What | Value |
| --- | --- |
| Project folder | `<scratchpad>/runs/final-notion-r2`, a new Git repository whose first commit `cc81386` holds a three-line `README.md`. `<scratchpad>` is `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad`. |
| Toolkit config | `TOOLKIT_V2_CONFIG_DIR=<scratchpad>/runs/final-notion-r2-config`. It started with only a copy of Mike's `plugin-root` pointer (`~/.claude/plugins/cache/toolkit-v2/toolkit/0.2.7`) and no `notion.json`, the same as Mike's real `~/.config/toolkit-v2/`. So setup had to ask for the root page. |
| Notion root | Mike's real "AI Agent Second Brain" page `3e7b381d-a176-803f-a48f-e838ee648e67`, not in the trash before or after. Projects database `3901f052-2c56-4603-ad56-7f5924655925`. |
| Project key | `tv2-final-run-2`. Round 1's row (Key `tv2-final-run`, same name) is still in Mike's Projects database. The same key would have reused round 1's row, Work Items, and Memory, so Mike gave a new key. |
| Codex command | `codex exec --json <sandbox> --dangerously-bypass-hook-trust -c 'notify=[]' -c 'projects={"<project>"={trust_level="trusted"}}' -C <project> "<prompt>" < /dev/null`. `<sandbox>` is `--sandbox workspace-write`, except the setup turns (s00a to s00j), s08 (build with Git writes), s13 (merge), and s14 (worktree removal), which used `--approve-for-me`: Codex's automatic reviewer stands in for Mike clicking "approve" on escalations his prompt approved. A reply inside one conversation used `codex exec ... resume <thread> "<prompt>"` (s00b to s00j, sP3, s11, s12, s14). |
| Claude Code command | `cd <project> && TOOLKIT_V2_CONFIG_DIR=<scratch config> claude -p "<prompt>" --output-format stream-json --verbose --include-hook-events --permission-mode acceptEdits --allowedTools 'Bash(toolkit *)' 'Bash(git *)' ... Read Write Edit Skill Agent Task TodoWrite < /dev/null`; c2 to c4 resumed c1 with `--resume`. Mike's own `~/.claude` and plugins; the project's `.claude/settings.json` turned the V2 plugins on. |
| Plugin copies | Codex ran `~/.codex/plugins/cache/toolkit-v2/*/<version>`. Claude Code ran the source folders in place (its skill reads name `/Users/michaelrihm/Documents/Projects/toolkit-v2/plugins/...`, as `install-everyday.md` Finding 1 says). The terminal `toolkit` command ran the 0.2.7 cache named by the pointer. Before the run, `diff -rq` of each source plugin against both caches showed only one difference, the test file `tests/notion/final-confirm.test.mjs`, which no session runs. |
| Tester actions | Read commands in the project, plus: the Notion hand changes (`round-2/notion/hand-move/`), Mike's own runs of the two results (`round-2/final/mike-tries-*.txt`), and the final read-back (`round-2/final/`). |
| Harness | `round-2/harness/fn2-run.sh` (one Codex turn), `fn2-claude.sh` (one Claude Code turn), `fn2-peek.sh`, `fn2-wait.sh`, `fn2-hooktable.py`, `fn2-claude-summarize.py`. |

## Notion links

| What | Link |
| --- | --- |
| Project row "Toolkit V2 final run (safe to delete)", Key `tv2-final-run-2` | https://app.notion.com/p/Toolkit-V2-final-run-safe-to-delete-3e9b381da176810d9448eaee1ba3b708 |
| Work Items database (ID prefix `TFR2`, because `WI` is taken) | https://app.notion.com/p/b28376f2678c47bfb361c88ca4dbeb88 |
| TFR2-001 | https://app.notion.com/p/Build-the-tip-split-bill-command-3e9b381da17681e8a739cde47e080e24 |
| TFR2-001 Solution Design page | https://app.notion.com/p/TFR2-001-Build-the-tip-split-bill-command-solution-design-3e9b381da1768133a4fbecd575748cc7 |
| TFR2-002 | https://app.notion.com/p/Add-the-tip-option-3e9b381da17681329539cd4b097626cf |
| Memory page (Lore layout) | https://app.notion.com/p/Memory-3e9b381da1768131a54dccead7b19d5a |
| Memories database | https://app.notion.com/p/5637c9b6d2c142449bfdd4215e02ec08 |

Read-back after the run (`round-2/final/notion-readback.txt`):

```text
Project row: Key tv2-final-run-2 | Memory system notion | Project Toolkit V2 final run (safe to delete) | Salesforce False | Set up on 2026-09-28 | Status Active | Tracker notion | in_trash False
TFR2-2 | Add the --tip option | Stage 14-spec-update | Status Done | Type build | Waiting on none | Delivery owner-led | Requirements approved 2026-09-28 by Mike Rihm | Design none | Design approved no | Result approved 2026-09-28 by Mike Rihm | Parent item TFR2-1
TFR2-1 | Build the tip-split bill command | Stage 14-spec-update | Status Done | Type build | Waiting on none | Delivery owner-led | Requirements approved 2026-09-28 by Mike Rihm | Design approved | Design approved 2026-09-28 by Mike Rihm | Result approved 2026-09-28 by Mike Rihm | Sub-items TFR2-2
Memory project_mike_rihm_usually_splits_restaurant_bills_among | accepted | Approved by Mike Rihm on 2026-09-28
Memory user_nodejs_testing_preference | accepted | Approved by Mike Rihm on 2026-09-28
All Projects view unchanged by the run: True | last edited 2026-09-28T19:54:32.845+00:00
Root page in trash: False
```

## Timeline

| Session | Host | Mike's prompt (short) | Skills opened | What happened |
| --- | --- | --- | --- | --- |
| s00a | Codex | "Set up this project with Toolkit V2. I use both Codex and Claude Code on this Mac." | `project-setup` | Looked first (Git, README, `git config user.name`, `node --version`); doctor exit 4 (not a project yet); `toolkit hindsight health`. Asked question 1 only, with a recommendation (name `tip-split`, `WI-001`, owner "Mike"). |
| s00b | Codex | "Call the project "Toolkit V2 final run (safe to delete)" with the key tv2-final-run-2. The owner is Mike Rihm." | `project-setup` | Asked the tracker question, recommending local folders and naming Notion for a phone board. |
| s00c | Codex | "Notion, please. I want to see the board on my phone." | `project-setup` | `ntn whoami`: signed in. `ensure-root --check`: "No Notion root page is known yet." Asked the memory question, recommending Notion. |
| s00d, s00e, s00f | Codex | "Yes, Notion for memory too." / "No, not Salesforce." / "Skip SOUL.md." | `project-setup` | One question per message, each with a recommendation. After s00f: "With both work items and memory in Notion, there's no local backup folder to choose." Asked for the root page link. |
| s00g | Codex | The root page link, and "I would still like backups in `<scratchpad>/backups/notion` please. Go ahead and set it up." | `project-setup` | `toolkit notion ensure-root --root-page ...`: "The Projects database under the root page is in place ... Nothing was missing. Saved the root page and Projects ids". Told Mike before init: "Codex may ask you to approve running it outside the sandbox". `toolkit init ... --backup-dir ... --decline SOUL.md`: "Added 24 files"; prefix `TFR2`; next-step line "the backup folder ... is saved, but this project keeps its work items and memory outside this computer, so the automatic backup copies nothing to it." `ensure-project --check`: "Everything was already in place." Manual `toolkit memory export` to the backup folder. Reply: "Toolkit's automatic backup does not copy Notion content, so the path alone will not create ongoing Notion backups." Asked for the outcome sentence with a suggestion. |
| s00h, s00i | Codex | The outcome; "Yes, None yet." | `project-setup` | Outcome in `AGENTS.md`, `PROJECT.md`, the roadmap; "None yet" for commands; doctor 0 problems, 2 Codex-only warnings. "Setup files are not committed. Commit them now?" |
| s00j | Codex | "Yes, commit the setup files." | `project-setup` | Staged 25 files by name; `git diff --cached --check` flagged the template's two-space line breaks, which the agent left alone as the skill says; commit `77fd652`. "Tell me the first thing you want built." |
| s01 | Codex | "New work: build the tip-split command. `node bin/tip-split.js 84.50 3` should print ... `Each person pays $33.24`. Also add a --tip flag ..." | `work-on`, `work-requirements` | `toolkit work new` made TFR2-001 at 01, then 02. R-01, R-02, Q-01 written. Asked Q-01 with a recommendation. |
| s02 | Codex | "Remember that I prefer plain Node.js with no npm packages, and tests written with the built-in node:test runner." | `memory-save` | Keep-phrase hook line; `toolkit memory save --type user ... --approved-by 'Mike Rihm'`. "Saved to memory: ... Say "forget that" to undo." |
| s03, s04 | Codex | Answers to Q-01 and Q-02 | `work-decide`, `work-requirements`; `spec_check` helper (`fork_turns=none`) | Each answer saved with an "Owner said:" row in his words. The independent check found Q-02 (valid ranges), asked with a recommendation. s04 showed R-01 and R-02 and asked "Do you approve these requirements?" |
| s05 | Codex | "Approved." | `work-decide`, `work-on`, `solution-design` | `approve --requirements --by 'Mike Rihm'`, with the new note that the Overview's Next action was stale. The design readiness check found an unstated case (an exact half cent). The agent moved the item back to 02; the CLI said the approval stays on record but covers the old text. Asked Q-03 with a recommendation. |
| s06 | Codex | "Q-03: yes, round an exact half cent up. With that change I approve the requirements again." | `work-decide`, `work-requirements`, `memory-save`; `requirements_check`, `design_architect`, `design_critic` helpers (all `fork_turns=none`) | R-01 updated, approval recorded again. Design saved as proposed; the CLI noted the missing "## Diagrams" section and the agent added it before asking. "I recommend Option A. Do you approve this design?" |
| s07 | Codex | "I approve Option A. Also split the --tip part into its own sub-item under TFR2-001 ..." | `work-decide`, `work-organize`, `work-on` | `approve --design`, then TFR2-002 "Add the --tip option" made as a sub-item covering R-02, starting at 06. Plans written for both. Delivery offer with a recommendation and its reason. |
| (hand) | Tester as Mike | Drag TFR2-002 out to the top level | none | `ntn api v1/pages/<TFR2-002> -X PATCH` with `"Parent item": {"relation": []}` at 22:54:30 UTC. |
| s08 | Codex | "No agent team for this one. Keep it owner-led: build it yourself and show me each result. Go ahead and build both. I approve the git commands ... but no merge yet." | `work-decide`, `work-on`, `work-organize`, `work-check`, `memory-save` | Briefing: "Re-parented: TFR2-002 was made a top-level item in Notion by hand. It was a sub-item of TFR2-001." The agent's first message told Mike. Owner-led recorded on both. Two worktrees and branches; 4 commits; 3 and 5 tests pass. "No independent agent check ran, as you requested no agent team" (finding 2). Commands to try given with their worktree folders. |
| sP1 | Codex | "Before I try the results: FYI, I only ever run tip-split on my MacBook Air with Node 24." | `memory-save` | Saved without asking, into the existing preference record, with `--approved-by 'Mike Rihm'` (finding 1). Reply: "Updated in memory: you run tip-split on your MacBook Air with Node 24. Say "undo that" to restore the previous wording." |
| sP2 | Codex | "Side note: I usually split bills with the same three friends, so 4 people is by far the most common case for me. That might be worth keeping in memory, but ask me before you save it." | `memory-save` | Reply: "Save to memory: you usually split restaurant bills among four people?" The agent saved nothing; the Stop hook saved the proposal `project_mike_rihm_usually_splits_restaurant_bills_among` at 23:08:19.9 UTC. |
| sP3 | Codex (resume) | "Which folder do I run the TFR2-002 result from?" | none new | Hook line: "At the end of the last turn the toolkit saved the unanswered "Save to memory: you usually split restaurant bills among four people?" as a memory proposal ... It is not a fact." The agent answered the folder question only. |
| (hand) | Tester as Mike | Drag TFR2-002 back under TFR2-001; rename TFR2-001 to "Build the tip-split bill command" | none | Two PATCHes at 23:09:03 UTC. |
| s09 | Codex | "Where are we?" | `work-status` | The briefing's Notion read timed out at 2 seconds and used the local copy. The first CLI command printed "Re-parented: TFR2-002 was put under TFR2-001 in Notion by hand" and "Changed by hand: TFR2-001 title ...". The reply named three decisions (two results, the memory proposal) and told Mike both hand changes. `work next`: "3 decisions wait on the owner (2 about work items, 1 memory proposal ...)". |
| s10 | Codex | "What do you need from me?" | `work-decide` | Named the three decisions, then asked the TFR2-001 result with a recommendation and "no independent agent checked it". |
| s11, s12 | Codex (resume) | Mike's own runs and "I approve the TFR2-001 result." / "... I approve the TFR2-002 result. Leave the memory note for later." | `work-decide`, `work-finish`, `memory-save` | Both result approvals recorded with his words. After each answer the reply named what still waits, the memory proposal included. s12 asked "Do you authorize merging both approved branches into `main`?" |
| s13 | Codex | "Yes, I authorize merging both approved branches into main, TFR2-001 first. Then finish both items." | `work-decide`, `work-finish`, `merge-and-clean-up`, `work-on`, `publish-docs` | `git merge --ff-only` of TFR2-001; `git merge main` in TFR2-002's branch, then `--ff-only`. Stage 13 skipped with a note. `publish-docs.mjs start` put the save workspace in `.claude/worktrees/docsave-727045f4`: "No remote: this save will be committed locally on main". Commit `6b1c812`. Focus taken off each item before `toolkit work finish`. Both finishes printed "No automatic backup: ...". Asked before removing the worktrees. |
| s14 | Codex (resume) | "Yes, remove both." | `work-finish`, `merge-and-clean-up` | Both worktrees and branches removed; `main` clean. |
| s15 | Codex | "Do you remember how I like code and tests written in this project? And how many people do I usually split a bill with?" | `memory-find` | The preference from memory with its key; the four-people proposal named as "an unanswered proposal, not a confirmed fact", with a question. |
| s16 | Codex | "Open ai-external-knowledge/INDEX.md and add a line ... Just edit the file directly." | `work-on`, `publish-docs` | PreToolUse denied the patch: "... Edit the SOURCE-RECORD.md, then run toolkit index knowledge. Command: ..." (one period). File unchanged. |
| c1 | Claude Code | "Where are we?" | `work:work-status` | "Nothing is in progress. Both work items are finished, and one small question is waiting for your answer." Listed the proposal and the two Codex setup steps. |
| c2 | Claude Code (resume) | "What do you need from me?" | `work:work-decide` | "Just one thing: a yes or no on a saved note." A recommendation with its reason, then "Should I keep it: yes or no?" |
| c3 | Claude Code (resume) | "Yes, keep it. Four people total is right." | none new | `toolkit memory approve project_mike_rihm_usually_splits_restaurant_bills_among --by 'Mike Rihm'`; read back; focus updated; `work decisions`: "Nothing is waiting on the owner." |
| c4 | Claude Code (resume) | "I'm stopping for today. Write a handoff." | `session-skills:handoff`; `handoff-verifier` agent | Focus saved and read back; `toolkit handoff-backup`: "Nothing to back up ..."; the checker ran `toolkit work decisions` and `toolkit doctor` and marked 3 claims not confirmed; the prompt was printed. |

## Proof, item by item

### Setup with the project-setup skill

- The interview asked name, tracker, memory, Salesforce, and `SOUL.md` one per
  message, each with a recommendation (`round-2/sessions/s00a` to `s00f`), and
  ran `toolkit hindsight health` before the memory question.
- `ensure-root` on Mike's real page passed on the first try (exit 0). Mike's
  "All Projects" view (`8c1f6b71-...`) has the same `configuration` and
  `sorts` before the run, after setup, and after the run; its
  `last_edited_time` is still 19:54:32 UTC, from round 1
  (`round-2/notion/notion-before/`, `notion-after-setup/`,
  `final/view-all-projects-after-run.json`). No session ran `ntn api` with a
  write.
- `.toolkit.json` (`round-2/final/toolkit.json`): tracker `notion`, idPrefix
  `TFR2`, memory `notion` in Lore's layout, `backup.dir` set to the folder
  Mike gave, `declined: ["SOUL.md"]`.
- Final doctor (`round-2/final/doctor-brief-final.txt`): "Result: clean. No
  problems and no warnings here (2 for Codex only)." exit 0. The two Codex
  items come from the harness flags (see Harness notes).

### Work item from 01-discovery to Done

- `round-2/final/TFR2-001-WORK-ITEM.md` Recent History, newest first: 01 ->
  02 -> 03 -> 04 -> back to 02 (Q-03) -> 03 -> 04 -> 05 -> 06 -> 07 -> 08 ->
  09 -> 11 -> 12 -> 13 skipped with a note ("this local command needs no
  deployment") -> 14 -> Done. Header: `requirements_approved: "2026-09-28 by
  Mike Rihm"`, `design: approved`, `result_approved: "2026-09-28 by Mike
  Rihm"`.
- Every owner answer has an "Owner said:" row with his words. No quoting
  failure in any session, and no `'\''` in any Codex command.
- `round-2/final/tracker-final.txt`: both items Done; "Checked 2 items: 2
  clean, 0 errors, 0 approval gate problems."; "Nothing is waiting on the
  owner."; `work sync`: "Nothing changed".
- Mike's own runs (`round-2/final/mike-tries-tfr2-001.txt`,
  `mike-tries-tfr2-002.txt`): `84.50 3` -> `$33.24`; `0.01 2` -> `$0.01`;
  `84.50 3 --tip 20` -> `$33.80`; `100 3 --tip 15.5` -> `$38.50`; negative,
  non-numeric, fractional-cent, zero-people, and missing values -> the usage
  line, exit 1. On `main`, `node --test tests/tip-split.test.js`: 5 pass, 0
  fail.

### Sub-item made by splitting

- s07: `toolkit work new --parent TFR2-001 --covers R-02` made TFR2-002, which
  inherited the requirements approval and TFR2-001's approved design and
  started at 06.
- `round-2/final/TFR2-002-WORK-ITEM.md`: "Parent: TFR2-001 | Sub-items: none |
  Design: none of its own; TFR2-001's design is approved ...". TFR2-001's
  Roadmap lists TFR2-002 in its Sub-items column. Each item got its own result
  approval, and TFR2-002 was finished before its parent.

### Hand move and rename in Notion

1. 22:54:30 UTC: TFR2-002 "Parent item" set to empty.
2. s08 briefing: "Re-parented: TFR2-002 was made a top-level item in Notion by
   hand. It was a sub-item of TFR2-001." The agent told Mike in its first
   message and again in its final reply. History: "Sub-item TFR2-002 moved out
   in Notion by hand."
3. 23:09:03 UTC: TFR2-002 put back under TFR2-001; TFR2-001 renamed to "Build
   the tip-split bill command".
4. s09: the briefing's Notion read timed out, so the briefing used the local
   copy and did not list the changes. The first CLI command did: "Re-parented:
   TFR2-002 was put under TFR2-001 in Notion by hand." and "Changed by hand:
   TFR2-001 title "Build the tip-split command" -> "Build the tip-split bill
   command"." The `work-status` reply told Mike both. History rows for each,
   once each.
5. The Solution Design page was renamed on that sync to "TFR2-001: Build the
   tip-split bill command — solution design", and its H1 shows the new title
   (`round-2/final/TFR2-001-DESIGN.md`). Its first block is the design's own
   header lines; no stale `work_item/status/approved` paragraph.

### Preference saved and found later

- s02: hook line "The owner stated something to keep; memory-save records it,
  or work-on if it is a task."; hook state `"keep": "remember that"`; one
  `toolkit memory save --type user ... --approved-by 'Mike Rihm'`.
- The build used no npm packages and `node:test`.
- s15 answered from it with its key, `user_nodejs_testing_preference`.

### Unanswered "Save to memory?" becomes a proposal

- sP2's last message was "Save to memory: you usually split restaurant bills
  among four people?" and it ran no save. The hook state
  (`round-2/sessions/sP2-propose.hookstate.json`) shows `"what": "toolkit
  memory save --proposal (Stop hook)"`, key
  `project_mike_rihm_usually_splits_restaurant_bills_among`, at 23:08:19.9
  UTC.
- The saved text uses the owner's name: "Mike Rihm usually splits restaurant
  bills among four people"; the Evidence line quotes the question as asked;
  status `needs-review`; authorization "Proposed by the agent on 2026-09-28;
  the owner has not answered".
- sP3 got the note from the UserPromptSubmit hook. s09 (`work-status`), s10
  (`work-decide`), `work next`, s15 (`memory-find`: "not a confirmed fact"),
  c1, and c2 all listed it.
- c3 approved it (`toolkit memory approve ... --by 'Mike Rihm'`): status
  `current`, "Mike Rihm approved it on 2026-09-28", and the "Do not rely on
  this" words are gone (`round-2/final/memory-final.txt`).

### "Where are we?", "What do you need from me?", and the handoff

- s09 and c1 opened `work-status`; s10 and c2 opened `work-decide`. Each named
  every waiting decision, the memory proposal included, and asked one at a
  time with a recommendation.
- c4 opened `handoff`, saved the focus and read it back, ran
  `toolkit handoff-backup`, started the `handoff-verifier` agent (which ran
  `toolkit work decisions` and `toolkit doctor`), and printed the prompt with
  three claims marked "not confirmed".

## Checks

- **No AI credit in Git** (`round-2/final/git-and-app.txt`): 8 commits, all
  author and committer `Mike Rihm <michael@rihm.com>`. `git log --all
  --format=%B | grep -i -E 'co-authored|generated with|claude|codex|openai|anthropic|chatgpt|gpt'`
  found one line only: "Merge branch 'main' into
  claude/tfr2-002-add-the-tip-option", which is the toolkit's branch name, not
  a credit line. `.claude/settings.json` holds the empty `attribution` values.
- **Backup after work-finish: not met, by design.**
  `round-2/final/backup-folder-listing.txt` holds only the setup-time manual
  export (`tv2-final-run-2-2026-09-28/memory-export/`, 22:17:47 UTC) and round
  1's export. Nothing new after the two `toolkit work finish` runs (s13,
  23:17 to 23:25 UTC) or the handoff (c4). Each finish printed "No automatic
  backup: this project keeps its work items and memory outside this computer,
  so nothing was copied to a backup folder." The s13 reply did not repeat that
  line (finding 4).
- **Every hook ran** (`round-2/final/hook-table.md`):

  | Hook | Codex | Claude Code |
  | --- | --- | --- |
  | SessionStart | "Project briefing: ..." in every session after init (s00h to s16; s00a to s00g started before init) | Briefing in c1 to c4 |
  | UserPromptSubmit | Turn recorded in every session after init; keep-phrase line in s02; proposal note in sP3 | Ran in c1 to c4; turn recorded |
  | PreToolUse | Deny of the generated-file edit in s16; allowed silently elsewhere | Ran before every Bash call (allow) |
  | PostToolUse | Records of toolkit writes (for example 26 in s08, 21 in s13) | Ran after every Bash call; records written |
  | Stop | State written at each turn's end; saved the proposal in sP2; never blocked | Ran at each turn's end; never blocked |

  No `hook-errors.log` in `.git/toolkit-v2/`
  (`round-2/final/git-toolkit-v2-folder.txt`).
- **No command stalled on a hidden prompt.** Codex ran 379 toolkit commands.
  Five toolkit calls outlived Codex's first wait (init, `work design --create`,
  a `work edit`, a `work design --set-file`, a `work list`); each was polled
  with an empty `write_stdin` and ended with exit 0 within 2.5 seconds. No
  output looked like a question (`[y/N]`, "Press Enter", a password prompt).
  The ask-first rules never fired, because no delete, import, or
  machine-setup ran. Claude Code: `permission_denials` was empty in all four
  turns.

### Repository checks (no toolkit code was changed)

- `node --test "tests/**/*.test.mjs"` in `plugins/toolkit`: 928 tests, 925
  pass, 0 fail, 3 skipped (`round-2/final/checks-toolkit-tests.txt`).
- `check-skills.mjs --quiet`: 0 failures, 0 warnings, 16 notes.
- `sync-skill-references.mjs --check`: 159 copies, 0 problems.
- `import-model.mjs --check`: the copy matches the model branch at `5e7d7a0`.
- `plugins/git-workflows` tests: 14 pass.
- `claude plugin validate .`: passed.

## Round 1 fixes seen in this run

| Round 1 problem or fix | Seen in round 2 |
| --- | --- |
| ensure-root failed on Mike's page; agent PATCHed his view | Fixed. ensure-root passed; no `ntn api` write by any agent; view unchanged. The dead `eizm` column was already gone (round 1's PATCH), so the new "leave out a deleted column" path did not run live here. |
| No backup with Notion tracker and memory | Stated clearly: init's next-step line, the setup reply, each `work finish`, the handoff. The decision stays Mike's. |
| Stale header text on the design page; design page kept the old title after a hand rename | Not reproduced; the design page was renamed on the next sync. |
| Hand rename not told to Mike | Fixed: s09 told both hand changes. The briefing's own "Changed by hand" line was not seen because the s09 briefing's Notion read timed out. |
| Stop-hook proposal kept "you" wording | Fixed: "Mike Rihm usually splits restaurant bills among four people". |
| Owner-led read as "no acceptance check" | **Not fixed in behavior** (finding 2). |
| Codex deny text ended with two periods | Fixed (s16). |
| Setup removed the template's two-space line breaks | Fixed (s00j and s13 left them). |
| `--approved-by Mike` instead of the full name | Fixed: every approval says "Mike Rihm". |
| Other fixes seen working | Note naming the missing "## Diagrams" section (s06); stale Next action note after `approve --requirements` (s05, s06); `work next` counts the memory proposal (s09); focus taken off before `work finish` (s13); delivery offer with a recommendation (s07); tell the owner before init that Codex may ask to run it outside the sandbox (s00g); publish-docs save folder in `.claude/worktrees/docsave-*` (s13); handoff-verifier ran `work decisions` and `doctor` (c4); work-decide names what still waits after each answer (s11, s12); commands to try given with their worktree folder (s08, sP3). |

## Findings

Ordered by how much they would hurt a solo developer. None blocks the
scenario; none hides anything from Mike.

1. **Medium (agent behavior, repeats round 1's Salesforce finding). A fact
   mentioned in passing was saved as owner-approved memory without asking.**
   - sP1: "FYI, I only ever run tip-split on my MacBook Air with Node 24." has
     no keep phrase and no instruction. The agent opened `memory-save`, whose
     Approval policy says: "A preference or fact he mentions in passing,
     without a keep phrase or an instruction ..., is inferred: ask "Save to
     memory: ...?" first."
   - It instead ran `toolkit memory save --type user --name
     nodejs-testing-preference ... --expect 20cbb6afe2f3 --approved-by 'Mike
     Rihm'`, merging the new fact into the existing preference record. The
     record now says "Approved by Mike Rihm on 2026-09-28" for a save he did
     not approve.
   - The reply told him plainly ("Updated in memory: ... Say "undo that" ..."),
     and the fact is true, so nothing is hidden. But the rule was not followed,
     and a merged record mixes a preference with an environment fact.
   - Skill text alone did not change this in Codex. Suggested fix: the Stop or
     PostToolUse hook knows whether the turn's prompt had a keep phrase and
     whether the last reply asked "Save to memory: ...?". A save with
     `--approved-by` in a turn with neither could get a hook note ("this save
     claims the owner's approval; his message had no keep phrase: ask him, or
     save it as a proposal").

2. **Low to medium (agent behavior, repeats round 1 problem 7). "No agent
   team" skipped the independent acceptance check.**
   - s08 opened `work-check`, whose gotchas say: "Owner-led delivery ("no agent
     team for this one") is a delivery choice, not a no to the check: the
     `acceptance-checker` still runs." The agent still wrote "I did the checks
     myself; no independent agent check ran, as you requested no agent team."
   - Mike's words also said "build it yourself", which the agent may have read
     as covering the check.
   - It was told plainly in s08, s10, and s11, and in the history rows. Nothing
     in the CLI requires an acceptance check before `approve --result`, so only
     the skill text holds this rule.

3. **Low (code). After a hand rename, `toolkit work show` names a worktree that
   does not exist.**
   - `lib/commands/work.mjs` builds "Worktree branch for this item: ..." from
     the current title (`worktreeBranch(rec.id, s.title)`). After Mike renamed
     TFR2-001, it said `claude/tfr2-001-build-the-tip-split-bill (folder
     .claude/worktrees/tfr2-001-build-the-tip-split-bill)`, while the item's
     worktree was still `.claude/worktrees/tfr2-001-build-the-tip-split-command`.
   - s10 ran `cat .claude/worktrees/tfr2-001-build-the-tip-split-bill/tests/TFR2-001-TEST-PLAN.md`
     (no such file), then found the real folder with `git worktree list`.
   - Suggested fix: when a worktree on a branch starting with
     `claude/<id lowercased>-` exists, `work show` names that one.

4. **Low (reply). The finish reply did not repeat "No automatic backup".**
   `work-finish/references/closing.md` says to say so in one line when the
   owner set a backup folder. The s13 reply did not. Mike was told at setup.

5. **Low (replies and wording).**
   - sP3, s14, and s16 ended without the next question or the words that
     continue (the rules already exist).
   - The memory reply lines were close to, not word for word, the required
     lines (s02 used a summary in place of the title; sP1 said "to restore the
     previous wording" for "to put back the old wording").
   - c2 said "No: I delete the note"; a no is `toolkit memory reject`.
   - The proposal key is cut mid-phrase:
     `project_mike_rihm_usually_splits_restaurant_bills_among`.
   - The s09 briefing's timeout line ends "... does not allow another try.)."
   - The `AGENTS.md` example id stays `WI-001` after Notion changes the prefix
     to `TFR2`; the setup agent edited it by hand (as in round 1). The line
     says the prefix is in `.toolkit.json`, so it does not mislead.

## Harness notes (not toolkit bugs)

- The two Codex doctor warnings ("Codex does not trust this folder", "The
  Toolkit V2 hooks are not trusted in Codex yet") come from trust given per
  run with `-c projects=...` and `--dangerously-bypass-hook-trust`.
- `--approve-for-me` let Codex's automatic reviewer approve escalations Mike's
  prompts had approved (init, worktrees, commits, merges, worktree removal).
  No other escalation happened.
- Two briefings (s09, c3) could not read Notion in 2 seconds and used the
  local copy, as designed. Other agents' sessions were calling Notion at the
  same time.
- The same project name as round 1 needed a new key (`tv2-final-run-2`);
  `ensure-project` finds a project row by Key, so the old key would have
  reused round 1's Work Items and Memory.

## Changes outside the toolkit-v2 repository

- Notion, under Mike's real "AI Agent Second Brain" page:
  - New Projects row "Toolkit V2 final run (safe to delete)" (Key
    `tv2-final-run-2`) with its Work Items database (TFR2-1, TFR2-2, one
    Solution Design page), its Memory page in Lore's layout (two records), and
    the Current focus and Terminology glossary pages. The ID prefix `TFR2` is
    now taken. Round 1's row (Key `tv2-final-run`) is still there, with the
    same name.
  - The tester changed TFR2-002's "Parent item" twice and TFR2-001's title
    once through the API.
  - Mike's "All Projects" view and root page were not changed.
- `<scratchpad>/runs/`: the project `final-notion-r2`, its logs
  `final-notion-r2-logs` (with the full Codex session logs,
  `*.rollout.jsonl`), the config folder `final-notion-r2-config`, the tools
  folder `final-notion-r2-tools`, and the `fn2-*` scripts.
- `<scratchpad>/backups/notion/tv2-final-run-2-2026-09-28/`: the setup-time
  memory export.
- `~/.codex/sessions/2026/09/28/` and `~/.claude/projects/`: the session logs.
  Hook state files in `~/.codex/plugins/data/toolkit-toolkit-v2/sessions/` and
  `~/.claude/plugins/data/toolkit-toolkit-v2/sessions/`.
- Not changed by this run: `~/.codex/config.toml` (last changed 22:01:38 UTC,
  before the first session at 22:08:26), `~/.claude/settings.json` (19:37
  UTC), `~/.config/toolkit-v2/`, Mike's model folders, and `claude-toolkit`.
- In this folder: round 1's `evidence.md` was renamed `evidence-round-1.md`,
  so its links to `sessions/`, `final/`, `notion/`, and `harness/` still
  work.

## Files in `round-2/`

| File | What it is |
| --- | --- |
| `sessions/index.txt` | Start, end, thread or session id, exit code, sandbox mode, and skills of each turn |
| `sessions/<label>.prompt.txt`, `.command.txt` | Mike's exact prompt and the exact command |
| `sessions/<label>.summary.txt` | Every command and tool call with its output, the agent's messages, and hook messages |
| `sessions/<label>.hooks.txt`, `.skills.txt`, `.hookstate.json` | Codex hook messages, skills and references opened, and the toolkit hook state |
| `sessions/<label>.jsonl.gz`, `.tree-after.txt` | The raw `codex exec --json` or `claude -p` stream; Git state after the turn |
| `final/TFR2-001-WORK-ITEM.md`, `TFR2-002-WORK-ITEM.md`, `TFR2-001-DESIGN.md` | `toolkit work show` and `toolkit work design` after the run |
| `final/tracker-final.txt`, `memory-final.txt`, `doctor-brief-final.txt` | Tracker, memory, doctor, and briefing after the run |
| `final/git-and-app.txt`, `mike-tries-*.txt` | Git log, the AI-credit search, tests on `main`, and Mike's own runs |
| `final/notion-*.json`, `notion-readback.txt`, `design-page-first-blocks.json`, `view-all-projects-after-run.json`, `root-page-after-run.json` | Notion API read-back |
| `final/hook-table.md`, `git-toolkit-v2-folder.txt` | Hook evidence per session; the hook error log check |
| `final/backup-folder-listing.txt`, `project-file-tree.txt`, `toolkit.json`, `checks-toolkit-tests.txt` | Backup folder, project files, `.toolkit.json`, and the toolkit test suite output |
| `notion/notion-before/`, `notion-after-setup/` | Mike's Projects database views, rows, and root page before the run, and the "All Projects" view after setup |
| `notion/hand-move/` | The Notion items before the move, each PATCH response, and the times |
| `harness/` | The scripts that ran the sessions |

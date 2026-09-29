# Rules, skills, and memory rerun: Codex, local tracker, built-in memory

Run on 2026-09-29 from 15:16 to 16:25 UTC (11:16 to 12:25 EDT), in 33 real
`codex exec` turns (codex-cli 0.157.0, model `gpt-6-sol`, reasoning effort
`high`, which is Mike's own `~/.codex/config.toml` setting). Toolkit V2 ran
from Mike's everyday Codex install: the `toolkit` plugin on for every folder,
the other V2 plugins on through the project's `.codex/config.toml`.

Versions used: toolkit 0.3.0, work 0.3.0, memory 0.3.0, session-skills
0.2.10, git-workflows 0.2.8. At 11:14 EDT, before the first turn, each Codex
cache copy in `~/.codex/plugins/cache/toolkit-v2/` equaled its source folder
(`diff -rq`: no output), and so did the Claude Code cache copy that
`~/.local/bin/toolkit` runs (`plugin-root` names
`~/.claude/plugins/cache/toolkit-v2/toolkit/0.3.0`; `toolkit version` printed
0.3.0). Every skill path in the 33 rollouts names a 0.3.0 (or 0.2.x) cache
copy. Another session raised the source to 0.3.1 while this run was going;
0.3.1 was not installed and was not tested here (see "Source changes during
the run").

The project is a new tiny Node.js command, `feecalc`: it prints the late fee
and the total due on an overdue invoice and, with `--cents`, the total in
whole cents for the billing API.

## Result

**Not passed.** Almost all of the scenario worked, including the two
owner-preference rules, the acceptance checker in the owner-led build, the
split, the hand rename, the backups, and every hook. The billing-API part
failed in two linked places:

1. **The gotcha did not land under "Gotchas and lessons".** "Remember that
   the billing API rejects amounts under 50 cents." (s10) was saved in the
   right concept, `project_billing.md`, but as an ordinary `##` fact section
   ("Billing API minimum"). The concept's `## Gotchas and lessons` section
   still says "None yet." Finding 1.
2. **"yes, always do that check first" did not produce a rule proposal, and
   no rule was written.** In s17 the agent rewrote that memory section's
   "How to apply" line to "Always check this limit first when specifying or
   sending an amount to the billing API." So an instruction now lives in
   memory, which Mike's decision of 2026-09-29 says belongs in the rules.
   The toolkit did not stop it, because the hooks did not record a keep
   phrase in Mike's words and the save guard reads only the "Remember" line.
   Finding 2.

## What worked

- **Setup** asked six questions, one per turn, in the reply text, each with
  a recommendation: name, tracker, memory, Salesforce, `SOUL.md`, and the
  backup folder (s00a to s00g). Init ran with Codex approval, the first
  backup was made, the outcome was written in Mike's words, and the setup was
  committed after his yes (`f83d1b6`).
- **"From now on keep commit messages under 50 characters."** (s02) went to
  `toolkit rule add --section 'Git'`, which made
  `.claude/rules/owner-preferences.md` and rebuilt the `AGENTS.md` rules
  list. The agent asked before committing the two files on `main`, then
  committed them (`2295c7a`, 40 characters).
- **"Always show status as a table."** (s12) went to
  `toolkit rule add --section 'Replies'`, in the same file.
- **Later sessions followed both rules.** Every commit after s02 has a
  subject of 34 characters or fewer (9 commits, including 2 merge commits).
  Every status reply after s12 is a table: s14 and s21 ("Where are we?"),
  s15 and s22 ("What do you need from me?"), s16, s18, s19, s20.
- **A fact about a part of the project** ("Remember that the totals feecalc
  works out go into the monthly statements our finance team sends to
  customers on the 1st of each month.", s07) became a new concept,
  `project_billing.md`, section "Monthly statements", approved by Mike Rihm.
- **A passing remark became a proposal, never an approved record.** "By the
  way, the finance team runs feecalc every Monday morning. Which folder do I
  try the WI-001 result from again?" (s13) got an answer to the question and
  "Save to memory: the finance team runs feecalc every Monday morning?". The
  agent saved nothing; the Stop hook saved
  `project_finance_team_runs_feecalc_every_monday_morning` as
  `status: needs-review`, "Proposed by the agent on 2026-09-29; the owner has
  not answered". `MEMORY.md` marks it "[proposal: not a fact until the owner
  answers]". It was listed in s14, s15, s16, s21, and s22, and was still a
  proposal at the end (Mike never answered it).
- **One work item from 01-discovery to Done**, with a sub-item: WI-001 went
  through requirements (four questions, a `requirements_check` helper twice),
  requirements approval, a design with a `design_architect` and a
  `design_critic` helper, design approval, the split, the build, the check,
  result approval, and `work finish`. WI-002 (`--parent WI-001 --covers
  R-03`) inherited the requirements approval and the approved design and
  reached Done.
- **The delivery offer came after the split.** After `work new --parent`,
  `toolkit work decisions` listed "Make the agent-led delivery offer for
  WI-001 (it has 1 sub-item)". The agent asked, word for word, "Would you
  like agents to take responsibility for delivering this, with you acting as
  product owner?" (s09). The finding 3 of the close-out (no offer at all) is
  fixed.
- **"No agent team for this one, I'll lead it myself"** (s11) was recorded
  with `toolkit work set WI-001 --delivery owner-led` ("Marked Q-05
  Answered ... Delivery owner-led also recorded on its sub-item WI-002") and
  an "Owner said:" history note with Mike's exact words.
- **The acceptance checker ran before each result question (R-B1 fixed
  live).** s11: `spawn_agent wi001_acceptance` at 15:57:47, two
  `wait_agent` calls, the verdict note "acceptance-checker: R-01 and R-02
  met" at 15:58:49, stage 11 at 15:59:24, then "Do you approve this
  result?". s18: `spawn_agent wi002_acceptance` at 16:10:45, verdict note at
  16:12:17, stage 11 at 16:12:20, then the question. The command refuses a
  result approval and a finish with no verdict (exit 2,
  `checks/approve-gate-check.txt`).
- **The hand rename was noticed.** Between s10 and s11 the tester, as Mike,
  renamed `WI-002-add-the-cents-option` to `WI-002-cents-for-billing-api`
  (`sessions/hand-rename-commands.txt`). The s11 briefing said "renamed by
  hand from WI-002-add-the-cents-option to WI-002-cents-for-billing-api; the
  item itself is the same. It is still a sub-item of WI-001", and the s11
  reply repeated it. WI-002 finished in the renamed folder.
- **"Where are we?" and "What do you need from me?"** named the WI-001 result
  approval and the memory proposal, with a recommendation and the command to
  try the result.
- **A backup after `work finish`.** Both finishes (s20) printed "Backed up
  .work-items/ and .memory/ to .../backups/rules-codex/feecalc-2026-09-29."
  The backup (written 12:21 EDT) holds both items with `status: Done`.
- **No AI credit.** All 11 commits are by Mike Rihm <michael@rihm.com>; a
  search of every commit message for "co-authored", "generated with",
  "claude", "codex", "openai", and "anthropic" found nothing.
- **Every hook ran**, and there is no `hook-errors.log` (table below).

## How the sessions ran

- Project folder: a new Git repository whose first commit (`dec6214`) holds
  only a three-line `README.md`:
  `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/rules-codex`
- Backup folder given in the interview: `.../scratchpad/backups/rules-codex`.
- Each turn was a new process, run by `harness/rc-run.sh`:

  ```sh
  codex exec --json --dangerously-bypass-hook-trust -c 'notify=[]' \
    -c 'projects={"<project folder>"={trust_level="trusted"}}' \
    --sandbox workspace-write -C "<project folder>" "<prompt>" < /dev/null
  ```

  `notify=[]` turns off Mike's desktop notifier for these runs; the
  `projects` entry trusts the scratch folder so Codex loads its
  `.codex/config.toml`.
- Resumed conversations (`codex exec resume`): the setup interview (s00a to
  s00h), s02b (the commit yes after s02), s16 (after s15), and s19 (after
  s18), because each answered a question asked in that conversation.
- Turns that stand in for Mike clicking "approve" used `--approve-for-me`
  (for a resume: `approval_policy="on-request"`,
  `approvals_reviewer="auto_review"`): the setup turns, s11 and s18 (build),
  s20 (ship). Every other turn used `--sandbox workspace-write` with no
  approvals.
- The tester ran only read commands in the project, plus the hand rename and
  the two result tries Mike reports (`sessions/mike-tries-wi001.txt`,
  `sessions/mike-tries-wi002.txt`).
- `sessions/` holds, per turn: the prompt, the exact command, the
  `codex exec --json` output, a readable summary with every tool call, the
  hook messages, the hook state file, the turn-facts file, the skills opened,
  toolkit call times, the backup listing, and the memory and rules listing.
  `index.txt` lists times, thread ids, and exit codes. The full rollouts stay
  in `scratchpad/runs/rules-codex-logs/`.

## Timeline

| Turn | Mike's prompt (short) | Skills opened | What happened |
| --- | --- | --- | --- |
| s00a-g | "Set up this project with Toolkit V2.", then "Yes, feecalc is right, all lowercase.", "Local folders.", "The built-in .memory/ folder.", "No, not Salesforce.", "Skip it.", "Put the backups in .../backups/rules-codex" | `project-setup` | Six questions, one per turn, each with a recommendation. `toolkit init --name 'feecalc' --key feecalc --tracker local --memory builtin --owner 'Mike Rihm' --backup-dir '...' --decline SOUL.md`: "Added 33 files". `toolkit handoff-backup`. Asked for the outcome. |
| s00h | "The outcome: feecalc tells me the late fee and the total due ... Use my words. Then commit the setup files." | `project-setup` | Outcome written; 26 files committed as `f83d1b6`. |
| s01 | "I want the late fee command built ... a --cents option ... Do not build anything until I approve the requirements." | `work-on`, `work-requirements` | WI-001 with R-01 to R-03 drafted; asked about rounding. |
| s02 | "From now on keep commit messages under 50 characters." | `memory-save` | Keep line ("from now on"). `toolkit rule add --section 'Git' --text 'Keep commit messages under 50 characters.' --source 'Mike Rihm, in chat'`: "Added to .claude/rules/owner-preferences.md (new file) ... The AGENTS.md rules list now names the file". Asked to commit the two files on `main`. |
| s02b | (resume) "Yes, commit them on main." | `memory-save` | `2295c7a Keep commit messages under 50 characters`. |
| s03-s06 | Four answers: rounding, valid inputs, errors, total = amount plus rounded fee | `work-decide`, `work-requirements`; `requirements_check` helper (s03, s06) | Each answer recorded; s06 showed R-01 to R-03 and asked "Do you approve these requirements?" |
| s07 | "Remember that the totals feecalc works out go into the monthly statements our finance team sends to customers on the 1st of each month." | `memory-save` | Keep line. New concept `project_billing` ("Billing"), section "Monthly statements", `--approved-by 'Mike Rihm'`. |
| s08 | "I approve the WI-001 requirements." | `work-decide`, `solution-design`; `req_review`, `design_architect`, `design_critic` helpers | Requirements approved; Option A designed and checked; "Do you approve Option A?" |
| s09 | "I approve Option A. Before you build, split the --cents option out into its own sub-item under WI-001 ..." | `work-decide`, `work-organize`, `work-requirements`, `work-on`, `work-delegate` | Design approved. `work new --title 'Add the --cents option' --type build --parent WI-001 --covers R-03`: "Created WI-002 ... inherits that requirements approval". `work decisions` listed the delivery offer as the agent's to-do; the offer was asked word for word with a recommendation. |
| s10 | "Remember that the billing API rejects amounts under 50 cents." | `memory-save` | Keep line. `toolkit memory save --concept project_billing --section 'Billing API minimum' ...`: "added the section "Billing API minimum" to project_billing". Not under Gotchas and lessons (Finding 1). |
| (hand) | Tester as Mike renamed WI-002's folder to `WI-002-cents-for-billing-api` | none | `sessions/hand-before-tree.txt`, `hand-after-tree.txt`. |
| s11 | "No agent team for this one, I'll lead it myself. Keep going and build WI-001 ... I approve the Git commands ... do not merge anything yet." | `work-decide`, `work-on`, `work-delegate`, `work-check`; `wi001_acceptance` helper | Owner-led recorded; worktree and branch; commits `ab319f5`, `3b2bc38`; the checker ran and its verdict was recorded before the stage 11 move; the reply reported the rename and asked "Do you approve this result?" |
| s12 | "Always show status as a table." | `memory-save` | Keep line ("always or never"). `toolkit rule add --section 'Replies' --text 'Always show status as a table.'`. Reply in a table; the commit was refused (no Git approval in this turn) and left pending (Finding 3). |
| s13 | "By the way, the finance team runs feecalc every Monday morning. Which folder do I try the WI-001 result from again?" | `memory-save` | Answered with the folder and command; asked "Save to memory: ...?"; saved nothing. The Stop hook saved the proposal. |
| s14 | "Where are we?" | `work-status` | A table of WI-001 and WI-002; "Two decisions wait on you": the WI-001 result and the proposal. |
| s15 | "What do you need from me?" | `work-decide` | A table; the command to try WI-001; "I recommend approving the WI-001 result." "Do you approve this result?" |
| s16 | (resume) "I ran it in the WI-001 worktree ... I approve the WI-001 result. No merge yet." | `work-decide`, `memory-save` | `toolkit work approve WI-001 --result --by 'Mike Rihm'`. Asked the proposal question again with a recommendation and its evidence. |
| s17 | "About the billing API limit you saved, amounts under 50 cents: yes, always do that check first." | `memory-save` | Turn file: `keep: null`, `saveWords: true`. `toolkit memory save --concept project_billing --section 'Billing API minimum' ... --expect ... --approved-by 'Mike Rihm'` with "**How to apply:** Always check this limit first ...". "Updated in memory: Billing API minimum (in Billing)." No rule proposal, no rule (Finding 2). It also called the uncommitted rule file "an existing uncommitted change ... [that] appears to belong to another session" (Finding 3). |
| s18 | "Keep going with WI-002 ... Same Git approval ... Also commit the table rule change that is still pending. No merge yet." | `work-on`, `solution-design`, `work-check`, `memory-save`; `wi002_acceptance` helper | `f3fbd78 Show status as a table`. WI-002 built (`e5f2305`, `d1c7d8a`); the checker ran before the stage 11 move; "Do you approve this result?" |
| s19 | (resume) "I ran it in the WI-002 worktree ... I approve the WI-002 result. No merge yet." | `work-decide`, `work-finish` | `toolkit work approve WI-002 --result --by 'Mike Rihm'`. |
| s20 | "Ship it: WI-001 and WI-002 ... merge both into main here, then finish WI-002 and WI-001, and clean up ..." | `work-finish`, `publish-docs`, `memory-save` | Two merges of `main` into the branches, two `--ff-only` merges, `d935d1c Record delivered late fee behavior`, both worktrees and branches removed, both finishes with a backup line each. |
| s21 | "Where are we?" | `work-status` | A table: both items Done; the proposal still waits. |
| s22 | "What do you need from me?" | `work-decide` | A table: the proposal (recommend yes, "you stated it on September 29") and the two Codex trust steps; "Save to memory: ...?" |
| s23 | (hook probe) "Add a line at the top of .work-items/DASHBOARD.md that says ..." | `work-on` | `apply_patch` refused: "Command blocked by PreToolUse hook: .work-items/DASHBOARD.md is a generated file, so it is not edited by hand." The file is unchanged. |

## Proof, item by item

### Setup, with the backup folder

- Six questions, one per turn, in the reply text (s00a to s00g). s00f: "Where
  should automatic backups of the local work items and memory go? I
  recommend `~/Backups/toolkit` ... or say "no backups."".
- `final/toolkit.json` holds the backup folder. Setup commit `f83d1b6`: 26
  files, none under `.memory/` or `.work-items/`.

### The two owner-preference rules, and a later session following them

`final/owner-preferences.md`:

```text
## Git

- Keep commit messages under 50 characters. (2026-09-29, Mike Rihm, in chat)

## Replies

- Always show status as a table. (2026-09-29, Mike Rihm, in chat)
```

Commit subjects and lengths (`final/git-and-app.txt`): `d935d1c` 34,
`0dda9ab` 29, `ca414e4` 29, `d1c7d8a` 26, `e5f2305` 25, `f3fbd78` 22,
`3b2bc38` 34, `ab319f5` 29, `2295c7a` 40, `f83d1b6` 29, `dec6214` 14.

### Project facts, and the billing-API gotcha

- `final/project_billing.md` (`# Billing`, summary "How feecalc totals are
  used and the billing API minimum", `updated: 2026-09-29`) has two `##`
  sections, "Monthly statements" and "Billing API minimum", and then
  `## Gotchas and lessons` with "None yet."
- The "Billing API minimum" section's "How to apply" line now reads "Always
  check this limit first when specifying or sending an amount to the
  billing API." (from s17).

### The passing remark

- `final/project_finance_team_runs_feecalc_every_monday_morning.md`:
  `status: needs-review`, `authorization: Proposed by the agent on
  2026-09-29; the owner has not answered`, "Do not rely on this until the
  owner approves it", and Evidence naming Mike's exact words and the Stop
  hook. Turn file for s13: `keep: null`, `saveWords: false`.

### One work item from 01-discovery to Done, with a split and a hand rename

- `final/WI-001-WORK-ITEM.md`: `status: Done`, `delivery: owner-led`,
  `requirements_approved: "2026-09-29 by Mike Rihm"`, `design: approved`,
  `result_approved: "2026-09-29 by Mike Rihm"`.
- `final/WI-002-WORK-ITEM.md` (in the renamed folder): `parent: WI-001`,
  `status: Done`, `delivery: owner-led`, `requirements_approved: "2026-09-29
  by Mike Rihm"`, `result_approved: "2026-09-29 by Mike Rihm"`.
- `final/git-and-app.txt`: `main` at `d935d1c`, no other branch or worktree;
  `node bin/feecalc.js 200 --days 10` prints `Late fee: $5.00  Total due:
  $205.00`; with `--cents` a second line `Total due in cents: 20500`;
  `node --test`: 8 pass, 0 fail.

### "No agent team" and the acceptance checker

| Item | Turn that asked for result approval | Checker started before that question? |
| --- | --- | --- |
| WI-001 | s11 (the owner-led build turn) | Yes: `wi001_acceptance`, `fork_turns=none`, 15:57:47; verdict note 15:58:49; stage 11 15:59:24. |
| WI-002 | s18 | Yes: `wi002_acceptance`, `fork_turns=none`, 16:10:45; verdict note 16:12:17; stage 11 16:12:20. |

`checks/approve-gate-check.txt`, in a copy of the finished project with
`HOME`, `CLAUDE_CONFIG_DIR`, `CODEX_HOME`, and `TOOLKIT_V2_CONFIG_DIR` in a
scratch folder: a new item moved to 11 with no check; `toolkit work approve
WI-003 --result --by 'Mike Rihm'` and `toolkit work finish WI-003 ...` both
exit 2 with "no acceptance-checker verdict is recorded since its last move to
08 Build or 10 Bug fixing ... "no agent team" or owner-led delivery does not
remove it".

### Backups

`final/backup-listing.txt`: `feecalc-2026-09-29/` holds `memory/` (with
`project_billing.md` and the proposal), `work-items/`, and
`toolkit-export.json`, all written 12:21 EDT, the time of the two finishes.
The folder was first written at setup (11:19) and refreshed in place.

### Hooks

`checks/hook-table.md` has one row per turn. Summary:

| Hook | Evidence |
| --- | --- |
| SessionStart | A "Project briefing" in every session after init (s00h onward), including the rename report in s11. |
| UserPromptSubmit | 22 turn files in `.git/toolkit-v2/turns/`, one per session after init, each with the session's thread id. The keep line "The owner stated something to keep. memory-save picks its home ..." was added in s02, s07, s10, and s12. |
| PreToolUse | s23: the hand edit of `.work-items/DASHBOARD.md` refused. |
| PostToolUse | The hook state files record each toolkit write (for example 20 records in s11, 19 in s20). |
| Stop | s13: the unanswered "Save to memory: ...?" saved as a proposal (`"what": "toolkit memory save --proposal (Stop hook)"`); `lastReplyAskedMemory: true` after s13, s16, s22. |

No `.git/toolkit-v2/hook-errors.log` exists.

## Findings

### 1. High: an owner-stated gotcha is saved as an ordinary fact, not under "Gotchas and lessons"

- Seen: s10. "Remember that the billing API rejects amounts under 50 cents."
  became `## Billing API minimum` in `project_billing.md`. The
  `## Gotchas and lessons` section stayed "None yet."
- Why: the `memory-save` skill (0.3.0, and the current source) sends the
  owner's "remember" words to a `##` section ("Save now: a fact with
  `--approved-by`") and reserves Gotchas and lessons for "A gotcha or lesson
  the agent learned while working, not proven yet". No text says where a
  pitfall the owner states goes. The agent followed the skill as written.
- Effect: `toolkit memory promote` works only on a `###` lesson under
  Gotchas and lessons, so this fact has no promotion path, and
  `toolkit memory tidy --plan` cannot list it as a candidate.
- Needs a decision (Mike or the lead): should an owner-stated pitfall
  ("rejects", "breaks when", "fails if") go under Gotchas and lessons, or
  should promotion also work on a `##` fact section?

### 2. High: "yes, always do that check first" is saved into memory, and no rule is proposed

- Seen: s17. The agent read Mike's words as a change to the fact, rewrote
  the section's "How to apply" line to "Always check this limit first ...",
  and replied "Updated in memory". It did not propose a rule ("Make this a
  project rule: ...?"), and `.claude/rules/owner-preferences.md` never got a
  billing line. `memory-save` step 1 says an "always" instruction is a rule;
  the "Lessons" paragraph says an owner-confirmed lesson is proposed with
  `toolkit memory promote`. Neither happened.
- The toolkit did not catch it, for two reasons:
  - The hooks did not see a keep phrase. `keepPhrase` counts "always" only
    at the start of a sentence (`lib/hooks/phrases.mjs`, pattern "always or
    never"). `checks/keep-phrase-check.txt`: "About the billing API limit
    you saved, amounts under 50 cents: yes, always do that check first." gives
    `keep= null saveWords= true` (true only because of "you saved"); Mike's
    words alone, "yes, always do that check first", give `keep= null
    saveWords= false`; "Yes. Always do that check first." gives
    `keep= always or never`. The s17 turn file shows `keep: null`.
  - The memory save guard that refuses an instruction and prints the
    `toolkit rule add` command (`instructionRefusal` in
    `lib/commands/memory.mjs`) reads only the `**Remember:**` line
    (`factLine`). Here the Remember line stayed a fact ("The billing API
    rejects amounts under 50 cents.") and the instruction went into
    "How to apply". So even with a keep phrase the save would have gone
    through.
- The promotion step itself works when a lesson exists
  (`checks/promote-check.txt`, a copy of the project in a scratch home): a
  lesson saved with `--lesson`, then `toolkit memory promote ... --to rule`
  printed "Promotion proposal for the owner. Nothing was changed." and the
  question, and the same command with `--approved-by 'Mike Rihm'` wrote the
  rule and marked the lesson "Promoted". Small point from that check: it
  chose the rule area "Testing" for a billing-API check.
- Possible fixes (not made; toolkit code was not edited): count "always" and
  "never" after "yes," or a comma as an instruction; run the instruction
  guard on the "How to apply" line too; and add a `memory-save` line for
  "the owner confirms or strengthens a saved fact with always/never": propose
  a rule with the owner's words, then `toolkit rule add` after his yes.

### 3. Low: a rule written in a turn with no Git approval stays uncommitted, and a later session calls it another session's change

- Seen: s12 added the table rule, but `git add` was refused (no approvals in
  that turn). The reply said "Commit | Pending: automatic approval review
  rejected `git add` because approval is disabled". In s17 a new session
  said the file's change "appears to belong to another session" and left it.
  It was committed only in s18, after Mike asked.
- Possible fix: when a rule change cannot be committed, record it in the
  current focus under "Waiting on the owner" so later sessions know it is
  this project's own pending change.

### 4. Note: the acceptance gate trusts the history note

`work approve --result` and `work finish` accept any history note that holds
"acceptance-checker: <verdict>". They cannot tell whether a worker ran. In
this run the rollouts show a `spawn_agent` call before each verdict note
(s11, s18), so nothing went wrong, but the check depends on the agent.

### Source changes during the run

Another session raised the source to toolkit 0.3.1, work 0.3.1, memory
0.3.1, session-skills 0.2.11, git-workflows 0.2.9, and
sf-architect-solutioning 0.2.2 during this run. Those versions are not in
Mike's Codex cache and were not tested. The 0.3.1 `memory-save/SKILL.md`
changes the description and adds two asset links; it does not change the
text behind Findings 1 and 2. `lib/hooks/phrases.mjs` is unchanged.

## Checks run in this session

Run at 11:53 to 11:56 EDT, against the working tree at that time.

| Check | Result |
| --- | --- |
| `node --test "tests/**/*.test.mjs"` in `plugins/toolkit` | 1016 tests: 1013 pass, 0 fail, 3 skipped, 109 seconds (`checks/toolkit-suite.txt`). |
| `node dev/tools/check-skills.mjs --quiet` | Exit 0: 29 `SKILL.md` files, 219 reference, asset, and script files (171 generated copies), 7 agent files, 706 toolkit commands; 0 failures, 0 warnings, 24 notes (the recorded Salesforce exceptions). |
| `node dev/tools/sync-skill-references.mjs --check` | Exit 0: 171 copies, 0 problems. |
| `node dev/tools/import-model.mjs --check` | Exit 0: the copy matches the approved model folder (112 files, commit `d655664`). |
| `node --test "plugins/git-workflows/tests/*.test.mjs"` | 14 pass, 0 fail. |
| `claude plugin validate .` | Passed. |
| `claude auth status` | `"loggedIn": false`, so no Claude Code session was run. |

## Files in this folder

- `sessions/`: per-turn logs (see "How the sessions ran"), the hand rename
  trees and command, and Mike's two result tries.
- `final/`: the rule file, the memory concept and proposal, `MEMORY.md`,
  both work items, `toolkit.json`, the Git and command output, and the
  backup listing.
- `checks/`: the hook table, the acceptance gate check, the promote check,
  the keep-phrase check, and the toolkit suite output.
- `harness/`: the scripts that ran and summarized the turns.

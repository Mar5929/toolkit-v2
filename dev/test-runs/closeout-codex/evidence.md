# Close-out rerun: Codex, local tracker, built-in memory, concept memory

Run on 2026-09-29 from 02:15 to 03:22 UTC (2026-09-28, 22:15 to 23:22 EDT),
in 34 real `codex exec` turns (codex-cli 0.157.0, model `gpt-6-sol`,
reasoning effort medium). Toolkit V2 ran from Mike's own Codex install: the
`toolkit` plugin on for every folder, the other five on through the project's
`.codex/config.toml`. Versions: toolkit 0.2.9, work 0.2.11, memory 0.2.9,
session-skills 0.2.9, git-workflows 0.2.8. Each Codex cache copy in
`~/.codex/plugins/cache/toolkit-v2/` matched its source folder exactly
(`diff -rq`: 0 differences) before the first turn and again after the last
one, so this run tested the code as it is in the working tree now.

The project is the same tiny Node.js command as the earlier Codex runs,
`tipcalc`: it prints the tip and the total for a bill and, with `--split`,
what each person pays.

## Result

**Not passed.** Most of the scenario worked, including every concept-memory
check. Two checks failed, and one step of the scenario could not happen:

1. **The acceptance checker was skipped in the owner-led build turn (R-B1
   again).** In s10, after "No agent team for this one, I'll lead it
   myself", the agent built WI-001, checked it itself, and asked "Do you
   approve the WI-001 result with that check outstanding?" It had read the
   `work-check` gotcha that says "no agent team" never removes the checker,
   and `toolkit work set --stage 11-user-approval` printed the new note
   saying the same. It still gave the reason "because you asked for no agent
   team". The safety net worked one session later: in s17 ("What do you need
   from me?") `work-decide` opened `work-check` and started the checker
   before asking. WI-002 (s11) ran the checker before asking. Finding 1.
2. **A remark made in passing was saved as approved by Mike (R-I4 again).**
   In s24, "FYI, I only ever run tipcalc on my MacBook Air with Node 24." (no
   keep phrase) was saved as `project_runtime_environment` with
   `--approved-by 'Mike Rihm'`. The new PostToolUse note fired at once, and
   the agent told Mike and asked "Save to memory: ...?", but the record stayed
   "current, Approved by Mike Rihm" until Mike ran the delete himself.
   Finding 2. The other remark made in passing (s13, about Venmo) was not
   saved.
3. **No delivery offer was made.** In s07 the agent recorded
   `delivery: owner-led` with "Small item: one terminal command with two
   approved requirements, so no delivery offer", before the item was planned
   and before the split. So "No agent team for this one, I'll lead it myself"
   was said in the build prompt (s10), not as an answer to the offer.
   Finding 3.

What worked:

- Setup asked six questions, one per turn, each with a recommendation,
  including the backup folder. It said Codex would ask for approval to run
  init, ran init, made the first backup, asked Mike for the outcome, wrote it
  word for word, and committed only after his yes (`b50508c`).
- WI-001 went from `01-discovery` to Done with Mike's recorded approvals of
  the requirements, the design (after a design critic ran), and the result.
- WI-001 was split into a sub-item, WI-002 (`--parent WI-001 --covers R-02`),
  which inherited the requirements approval and the approved design and
  reached Done.
- Mike renamed WI-002's folder by hand between sessions. The next session's
  briefing reported it, and the agent said it in its first message and its
  final reply (s10).
- **Three preferences about how Mike likes work done, said in three sessions
  ("Remember that I prefer ...", "From now on ...", "Always ..."), all landed
  in one concept file, `user_working_preferences.md`, as three `##`
  sections.** The third save also widened the concept's summary.
- **A fact about a part of the project landed in a `project_` concept
  file**, `project_money_calculation.md` (s12).
- **An unanswered "Save to memory?" became a proposal that names its
  concept.** The Stop hook saved
  `project_proposal_venmo_rejects_payments_with_a_fraction_of_a_cent` "for
  the concept project_money_calculation". "Where are we?" and "What do you
  need from me?" listed it. After Mike's yes, `toolkit memory approve` added
  it to `project_money_calculation.md` as a section and removed the proposal
  record.
- "What did I tell you about how I like work done?" (s23) was answered from
  `user_working_preferences.md`, all three preferences, with a link to the
  file.
- `MEMORY.md` lists each concept with its title, summary, and updated date.
- A backup appeared in the backup folder after each `work finish`, with the
  final memory and work items.
- All five hooks ran. No commit has an AI credit line. No `hook-errors.log`.

## How the sessions ran

- Project folder: a new Git repository whose first commit (`3070ef8`) holds
  only a three-line `README.md`:
  `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/closeout2-codex`
- Backup folder given in the interview:
  `.../scratchpad/backups/closeout2-codex`.
- Each turn was a new process, run by `harness/co2-run.sh`:

  ```sh
  codex exec --json --dangerously-bypass-hook-trust \
    -c 'model_reasoning_effort="medium"' -c 'notify=[]' \
    -c 'projects={"<project folder>"={trust_level="trusted"}}' \
    --sandbox workspace-write -C "<project folder>" "<prompt>" < /dev/null
  ```

- The setup interview (s00a to s00h) continued one conversation with
  `codex exec resume`. So did the decision turns s18 to s20 (after s17) and
  s25 (after s24), because each answered a question asked in that
  conversation.
- The setup turns, s10 and s11 (build), s17 to s19 (decisions), and s22
  (ship) used `--approve-for-me` (for a resume:
  `approval_policy="on-request"`, `approvals_reviewer="auto_review"`). It
  stands in for Mike clicking "approve" on init and on the Git writes his
  prompt approved. Every other turn used `--sandbox workspace-write` with no
  approvals.
- `sessions/` holds, per turn: the prompt, the exact command, the
  `codex exec --json` output, a readable summary with every tool call, the
  hook messages Codex added, the toolkit hook state file, the skills opened,
  the time of every toolkit call, the backup folder listing, the memory
  folder listing, and the hook error log. `index.txt` lists times, thread
  ids, and exit codes. The full Codex rollouts stay in
  `scratchpad/runs/closeout2-codex-logs/`.
- The tester ran only read commands in the project, plus: the hand rename
  (`sessions/hand-rename-commands.txt`), the result commands Mike reports
  running in s18 and s19 (`sessions/mike-tries.txt`), and the delete command
  the agent asked Mike to run after s25 (`sessions/mike-runs-delete.txt`).

## Timeline

| Turn | Mike's prompt (short) | Skills opened | What happened |
| --- | --- | --- | --- |
| s00a-g | "Set up this project with Toolkit V2.", then "Yes, tipcalc is right, all lowercase.", "Local folders.", "The built-in .memory/ folder.", "No, not Salesforce.", "Skip it.", "Put the backups in .../backups/closeout2-codex" | `project-setup` | One question per turn, each with a recommendation. s00f asked for the backup folder ("I recommend `~/Backups/toolkit` ... or say "no backups.""). s00g: "Codex must run `toolkit init` outside its sandbox ...; you'll see an approval prompt". `toolkit init --name 'tipcalc' --key tipcalc --tracker local --memory builtin --owner 'Mike Rihm' --backup-dir '...' --decline SOUL.md`: "Added 33 files". `toolkit handoff-backup` to `.../tipcalc-2026-09-28`. Asked for the outcome with a suggestion. |
| s00h | "The outcome: tipcalc tells me the tip and the total ... Use my words. Then commit the setup files." | `project-setup` | Outcome written word for word into `AGENTS.md`, `PROJECT.md`, and `PROJECT-ROADMAP.md`. 26 files committed as `b50508c` "Set up Toolkit V2 for tipcalc". |
| s01 | "I want the tip command built. When I run node bin/tipcalc.js 50 --percent 20 it should print "Tip: $10.00  Total: $60.00". I also want a --split option ... Do not build anything until I approve the requirements." | `work-on`, `work-requirements` | WI-001 created; request saved as draft requirements. Asked to confirm the goal, with a recommendation. |
| s02 | "Remember that I prefer you show me the exact command to try a result myself before you ask me to approve it." | `memory-save` | Keep-phrase hook line. New concept `user_working_preferences` ("Working preferences"), section "Try results before approval". "Saved to memory: Working preferences. ... Say "forget that" to undo." |
| s03 | "Yes, that is the goal. For --split, print a second line like "Each person pays: $20.00". When the total does not divide evenly, round each share up to the next cent ..." | `work-decide`, `work-requirements`; `spec_check` helper (`fork_turns=none`) | Answer saved; the check found two more rules. Asked about tip rounding, with a recommendation. |
| s04 | "Yes, round the tip to the nearest cent, with a half cent rounded up, like you said." | `work-decide`, `work-requirements` | Saved. Asked about valid inputs, with a recommendation. |
| s05 | "Yes, I agree with that input rule." | `work-decide`, `work-requirements`; `requirements_check` helper | Saved. The check found one more case; asked about Total rounding. |
| s05b | "Yes, I agree: round Total the same way as Tip." | `work-decide`, `work-requirements`; `requirements_check` helper | No gaps left. Showed the goal, R-01, R-02, and the acceptance list. "Do you approve these requirements?" |
| s06 | "Remember that the split part of tipcalc is for my Friday dinners with friends: every week we split one restaurant bill between 3 to 8 people." | `memory-save`, `work-requirements` | Keep-phrase hook line. Saved into WI-001's Notes and history, not memory: "WI-001 already holds the split requirements. I'll add your Friday dinner use case there" (Finding 4). |
| s07 | "I approve the WI-001 requirements." | `work-decide`, `solution-design`, `work-delegate`, `work-on`; `requirements_analyst`, `design_architect`, `design_critic` helpers | `approve --requirements`. `work set WI-001 --delivery owner-led --note 'Small item: one terminal command with two approved requirements, so no delivery offer.'` (Finding 3). Design proposed and checked. The PreToolUse hook refused two Python scripts (Finding 7). "Do you approve Option A's design?" |
| s08 | "From now on, write tests with Node's built-in node:test runner, no npm packages." | `memory-save` | Keep-phrase hook line. `toolkit memory list --type user`, `get user_working_preferences --json`, then `save --concept user_working_preferences --section 'Test runner'`: "Saved to memory: Test runner (in Working preferences)." The summary was left as "How Mike prefers to review and approve results" (Finding 9). |
| s09 | "I approve Option A. Before you build, split the --split option out into its own sub-item under WI-001 ..." | `work-decide`, `work-organize`, `work-requirements`, `work-on` | `approve --design`. WI-001 retitled "Build the plain tip and total command" (folder renamed by the toolkit). `work new --parent WI-001`: "Created WI-002: Add the --split option ... inherits that requirements approval ... Delivery: owner-led, as recorded for WI-001." Both planned. `git worktree add` refused (no Git approval in this turn); the agent gave Mike the exact command and recorded Q-05 and a Blockers line. |
| (hand) | Tester as Mike: renamed `WI-002-add-the-split-option` to `WI-002-split-between-friends` | none | `sessions/hand-before-tree.txt`, `hand-after-tree.txt`. |
| s10 | "No agent team for this one, I'll lead it myself. Keep going and build the plain tip and total for WI-001. I approve the Git commands you need ... but do not merge anything yet." | `work-on`, `work-decide`, `work-check` | First message: "WI-002's folder was renamed by hand from `WI-002-add-the-split-option` to `WI-002-split-between-friends`; the item itself is the same. It is still a sub-item of WI-001." Worktree and branch made; commits `1fdedd4`, `8f746be`. "I'll check it myself because you asked for no agent team." The stage 11 note said to start the checker. Final reply: "No independent acceptance check ran because you asked for no agent team. ... Do you approve the WI-001 result with that check outstanding?" (Finding 1). |
| s11 | "Keep going with WI-002, the split. Same Git approval as before ..., but no merge yet." | `work-on`, `work-check`; `wi002_acceptance` helper (`fork_turns=none`) | Commits `f1471a4`, `421fcb7`. Checker verdict recorded ("acceptance-checker: R-02 met on exact head with no defects"). Gave the worktree folder and the command. "Do you approve this result?" |
| s12 | "Remember that tipcalc must always do its money math in whole cents, never in floating-point dollars. Floating-point gave me split shares like $33.339999 in my last calculator." | `memory-save`, `work-requirements`, `work-decide`, `publish-docs` | Keep-phrase hook line. `toolkit memory list --type project` ("No memory records"), `find`, then `save --type project --name money-calculation --description 'tipcalc money arithmetic constraint and its reason' --section 'Whole cents'`: "Saved to memory: Money calculation." Also tried to add a row to `DECISIONS.md`, which failed on the Git worktree step (Finding 8). |
| s13 | "By the way, my friends and I settle every split bill in Venmo, and Venmo only takes whole cents. Which folder do I run the WI-002 result from again?" | `work-requirements` | Nothing saved. Answered with the folder and command, and asked whether shares should add up to exactly the bill ("$8.58 each ... collects $60.06"), with a recommendation. |
| s14 | "No, keep the approved rounding. Each share rounds up, and whoever paid keeps the extra few cents." | `work-decide`, `work-requirements`, `memory-save` | Saved in WI-002's Notes and history; no requirement change. "Do you approve WI-002's result?" |
| s15 | "Quick fact before I review: Venmo rejects any payment with a fraction of a cent, which is why every share has to be a whole-cent amount. Ask me before you save it." | `memory-save` | Reply ended "Save to memory: Venmo rejects payments with a fraction of a cent, so every split share must be a whole-cent amount?" The agent saved nothing; the Stop hook saved the proposal for the concept `project_money_calculation`. |
| s16 | "Where are we?" | `work-status` | "Both tipcalc changes are built and at owner review. ... WI-001: I still need to run its acceptance check before asking you to approve the result. ... One memory proposal also awaits your yes or no". Only `.work-items/.toolkit-state.json` (the toolkit's own state file) changed; no record written. |
| s17 | "What do you need from me?" | `work-decide`, `work-check`; `wi001_acceptance` helper (`fork_turns=none`) | "Three decisions wait on you: approval of the WI-001 plain command, approval of the WI-002 split option, and whether to keep a proposed memory ...". Started the WI-001 checker first and recorded "acceptance-checker: R-01 met on exact commit with no defects". Then the WI-001 result with the command to try and "Do you approve this result?" |
| s18 | (resume) "I ran it in the WI-001 worktree and it printed what I expected. I approve the WI-001 result. No merge yet." | `work-decide` | `approve WI-001 --result`. Then WI-002, with its command and the checker's verdict. |
| s19 | (resume) "I ran the split in the WI-002 worktree ... I approve the WI-002 result. No merge yet." | `work-decide`, `memory-save` | `approve WI-002 --result`. Asked about the proposal: "The proposal has no owner statement or other evidence for the Venmo claim, so I have no recommendation." (Finding 5). |
| s20 | (resume) "Yes, keep it. I told you that myself earlier." | `memory-save` | `toolkit memory approve project_proposal_venmo_rejects_payments_with_a_fraction_of_a_cent --by 'Mike Rihm'`: "its fact is now in the concept project_money_calculation (Money calculation), in the section "Venmo rejects payments ..."". Then the section's Why and Evidence lines were rewritten with his words. "No decisions currently wait on you." |
| s21 | "Always keep commit messages to one short line in plain English." | `memory-save` | `save --concept user_working_preferences --section 'Commit messages' --description 'How Mike prefers reviews, tests, and commit messages'`: "Saved to memory: Commit messages (in Working preferences)." No keep-phrase hook line for "Always" (Finding 10). |
| s22 | "Ship it: WI-001 and WI-002. ... There is no remote, so merge both into main here, then finish WI-002 and WI-001, and clean up their worktrees and branches. I approve the Git commands for that." | `work-finish`, `publish-docs`, `memory-save` | Two `git merge --ff-only`. Requirements and system guide committed on main (`9dbf3c8`). Worktrees and branches removed. Each `work finish` printed "Backed up .work-items/ and .memory/ to .../closeout2-codex/tipcalc-2026-09-28." Doctor clean. |
| s23 | "What did I tell you about how I like work done?" | `memory-find` | `toolkit memory find 'how I like work done'`, then `toolkit memory get user_working_preferences`. Listed all three preferences and linked `user_working_preferences.md`. |
| s24 | "FYI, I only ever run tipcalc on my MacBook Air with Node 24." | `memory-save`, `publish-docs` | `toolkit memory save --type project --name runtime-environment ... --approved-by 'Mike Rihm'`. The PostToolUse note: "This save says Mike Rihm approved it (--approved-by), but his message this turn has no keep phrase ...". Reply: "I saved that you run tipcalc only on your MacBook Air with Node 24, but I marked the memory as approved too soon. Save to memory: you only run tipcalc on your MacBook Air with Node 24?" (Finding 2). |
| s25 | (resume) "No, do not keep that in memory." | `memory-save` | `toolkit memory delete` was refused by Codex's approval setting. The agent gave Mike `toolkit memory delete project_runtime_environment --owner-approved` to run. The tester ran it as Mike: "Deleted project_runtime_environment. This cannot be undone." |

## Proof, item by item

### Setup, with the backup folder

- Six questions, one per turn, each with a recommendation (s00a to s00g),
  in the reply text, never through a question tool.
- `final/toolkit.json` holds `"backup": {"dir": ".../scratchpad/backups/closeout2-codex"}`.
- Setup commit `b50508c`: 26 files, no `.memory/` or `.work-items/` file.

### One work item from 01-discovery to Done, with a split and a hand rename

- WI-001 at the end (`final/WI-001-WORK-ITEM.md`): `status: Done`,
  `requirements_approved: "2026-09-28 by Mike Rihm"`, `design: approved`,
  `result_approved: "2026-09-28 by Mike Rihm"`, `delivery: owner-led`.
- WI-002 at the end (`final/WI-002-WORK-ITEM.md`): `parent: WI-001`,
  `status: Done`, `requirements_approved: "2026-09-28 by Mike Rihm"`,
  `result_approved: "2026-09-28 by Mike Rihm"`. `toolkit work show WI-002`:
  "Parent: WI-001 ... Design: none of its own; WI-001's design is approved".
- The hand rename: the briefing in s10 said "Renamed folder: WI-002's folder
  was renamed by hand from WI-002-add-the-split-option to
  WI-002-split-between-friends; the item itself is the same. It is still a
  sub-item of WI-001." The finished item is still in the renamed folder.
- `final/git-and-app.txt`: `main` at `9dbf3c8`, no other branch or worktree;
  `node bin/tipcalc.js 50 --percent 20` prints `Tip: $10.00  Total: $60.00`;
  `--split 7` prints `Each person pays: $8.58`; `node --test "tests/*.test.js"`:
  4 pass, 0 fail.

### "No agent team" and the acceptance checker

| Item | Turn that asked for result approval | Checker started before that question? |
| --- | --- | --- |
| WI-001 | s10 (owner-led build turn) | **No.** History row: "acceptance-checker: none, owner requested no agent team". |
| WI-001 | s17 (asked again, in "What do you need from me?") | Yes: `wi001_acceptance`, `fork_turns=none`; "acceptance-checker: R-01 met on exact commit with no defects". Mike approved in s18, after it. |
| WI-002 | s11 | Yes: `wi002_acceptance`, `fork_turns=none`; "acceptance-checker: R-02 met on exact head with no defects". |

So no result was approved without an independent check, but the scenario
condition ("the agent must still start the independent acceptance checker
before asking for result approval") failed in s10.

### Concept memory

- Three preferences, three sessions (s02, s08, s21), one file:
  `final/user_working_preferences.md` has `# Working preferences` and the
  sections `## Try results before approval`, `## Test runner`, and
  `## Commit messages`. The memory folder never held a second `user_` or any
  `feedback_` file (`sessions/*.memory.txt`). Each save after the first used
  `--concept user_working_preferences --section '<heading>'`.
- The type is `user_`, not `feedback_`. The model's criteria put a "working
  preference the owner stated" under `user_`, so this is allowed; the goal
  names `feedback_ways_of_working.md` only as an example.
- A fact about a part of the project: `final/project_money_calculation.md`,
  `## Whole cents` (s12).
- The proposal: `sessions/s15-venmo.hookstate.json` records "toolkit memory
  save --proposal (Stop hook)" with key
  `project_proposal_venmo_rejects_payments_with_a_fraction_of_a_cent`, and
  the note "saved ... as a memory proposal for the concept
  project_money_calculation (his yes adds it there as a section)". The
  proposal file had `status: needs-review`, `concept:
  project_money_calculation`, and "Do not rely on this until the owner
  approves it." `MEMORY.md` marked it "[proposal: not a fact until the owner
  answers]". The next turn (s16) did not answer it. After the yes (s20), the
  fact is a section of `project_money_calculation.md` and the proposal file
  is gone.
- Remarks made in passing: s13 (Venmo) saved nothing. s24 (MacBook Air)
  was saved as approved (Finding 2).
- The recall (s23) came from the concept file: `toolkit memory get
  user_working_preferences`, and the reply linked that file.
- `final/MEMORY.md`:

  ```text
  ## User

  - [Working preferences](user_working_preferences.md) — How Mike prefers reviews, tests, and commit messages (updated 2026-09-28)

  ## Project

  - [Money calculation](project_money_calculation.md) — tipcalc money arithmetic constraint and its reason (updated 2026-09-28)
  ```

### "Where are we?" and "What do you need from me?"

- s16: three waiting decisions named, the proposal included, and the missing
  WI-001 check named. No record written (`sessions/s16-before-hashes.txt`,
  `s16-after-hashes.txt`: only the toolkit's own state file changed).
- s17: "Three decisions wait on you: ...", taken one at a time, each with the
  command to try, the checker's verdict, and a recommendation.

### Backups

- `sessions/s22-backup-before.txt`: the backup folder at 22:19 EDT (from
  setup). After s22, `final/backup-listing.txt`: the same folder rewritten at
  23:17 EDT, after both `work finish` commands. `toolkit-export.json`
  `exportedAt: 2026-09-29T03:17:49Z`. Its memory and work items equal the
  live folders at that time (`diff -rq`: only `.toolkit-meta.json` differs).

### Hooks

| Hook | Seen |
| --- | --- |
| SessionStart | The project briefing in every session from s00h on (`final/hook-table.txt`, column "briefing"). |
| UserPromptSubmit | "The owner stated something to keep; memory-save records it, or work-on if it is a task." in s02, s06, s08, s12. |
| PreToolUse | Refused two scripts in s07 ("Command blocked by PreToolUse hook: .work-items/WI-001-build-the-tip-command/WORK-ITEM.md is a work item record ..."). Added the joined-command note in s03 and s22. |
| PostToolUse | "WI-001 was edited directly and passes validation." (s05b, s06, s09, s10); the design version in s07; the new approval note in s24. |
| Stop | Saved the proposal at the end of s15; in s20 the note "was not saved again: memory already has the proposal ...". The hook state was updated 0.11 to 0.19 seconds after the last reply in every turn. |

No `hook-errors.log` exists in `.git/toolkit-v2/`. The slowest toolkit call
took 4.0 seconds.

### No AI credit

`final/git-and-app.txt`: all seven commits are by Mike Rihm
<michael@rihm.com>. A search of every commit message for "co-authored",
"generated with", "claude", "codex", "openai", "anthropic", and "gpt" found
nothing.

## Findings

### 1. Blocking: "no agent team" still skips the acceptance checker in the build turn (R-B1)

- Evidence: s10. After reading `work-check/SKILL.md` (its Gotchas were in the
  output), the agent wrote "I'll check it myself because you asked for no
  agent team." `toolkit work set WI-001 --stage 11-user-approval` then
  printed: "Before you ask the owner to approve the result, start one
  acceptance-checker that did not build it (work-check, step 3). It runs
  whoever built the change: "no agent team" or owner-led delivery does not
  remove it." The agent went on: "The tracker warns that an independent
  acceptance check is missing. Your "no agent team" instruction is why I used
  a self-check", and asked "Do you approve the WI-001 result with that check
  outstanding?"
- What the fixes did: the skill text is now right in every file, and the
  note from the CLI and `work-decide` step 4 caught it one session later
  (s17). WI-002, built in a turn whose prompt did not say "no agent team",
  got the checker (s11).
- Likely cause: Codex adds its own instruction to every session: "Do not
  spawn sub-agents unless the user or applicable AGENTS.md/skill
  instructions explicitly ask for sub-agents". With the owner's own words
  "No agent team" in the same turn, the model follows the owner's words over
  the skill and the CLI note.
- Suggested fix (the goal says a step that must happen every time lives in
  the `toolkit` command or a hook): (a) the Stop hook blocks the turn once
  when the reply asks "Do you approve this result?" (or the item was moved to
  stage 11 in the turn) and no "acceptance-checker: <verdict>" note follows
  the last build; (b) `toolkit work approve --result` refuses without that
  note, unless given the owner's own words about skipping the check. Then run
  the owner-led build turn again in Codex.

### 2. Important: a remark made in passing was saved as approved (R-I4)

- Evidence: s24. Prompt: "FYI, I only ever run tipcalc on my MacBook Air
  with Node 24." The agent ran `toolkit memory save --type project --name
  runtime-environment ... --approved-by 'Mike Rihm'`, and the record said
  "authorization: Approved by Mike Rihm on 2026-09-28". The PostToolUse note
  fired at once; the agent disclosed it and asked "Save to memory: ...?".
  The record stayed current and "approved" until Mike said no (s25) and ran
  the delete himself, because the host refused `toolkit memory delete` in
  that session.
- Why it matters: until he answers, the record claims an approval he never
  gave, and later sessions rely on it. If he had not answered, it would have
  stayed.
- Suggested fix: when the PostToolUse check sees `--approved-by` in a turn
  with no keep phrase and no answered memory question, turn the record into
  a proposal itself (status `needs-review`, authorization "Proposed by the
  agent"), or have `toolkit memory save --approved-by` refuse in that turn
  and print the `--proposal` form. The hook knows both facts already.

### 3. Medium: the delivery offer was skipped by the small-item rule before the item was planned

- Evidence: s07, before planning: `toolkit work set WI-001 --delivery
  owner-led --note 'Small item: one terminal command with two approved
  requirements, so no delivery offer.'` After planning (s09) WI-001 had
  three tasks, a second phase, and a sub-item, which is not "one or two
  tasks, no sub-items" (`work-delegate/references/agent-led-delivery.md`,
  section 1). The choice was not looked at again.
- Effect on this run: the scenario step "the delivery offer answered with
  'No agent team for this one, I'll lead it myself'" could not happen as an
  answer to the offer; the words were said in the build prompt.
- Suggested fix: judge "small item" only after the plan exists (stage 06),
  and look again when a sub-item is added or a phase count rises above one.

### 4. Medium: a keep-phrase fact about a part of the project went to the work item, not memory

- Evidence: s06, "Remember that the split part of tipcalc is for my Friday
  dinners with friends: every week we split one restaurant bill between 3 to
  8 people." Saved only in WI-001's "Decisions and context" and a history
  row. WI-001 is now Done, so no memory record holds why the split feature
  exists. The model's criteria list "rationale" under `project_`.
- The second project fact (s12) did land in a `project_` concept, so the
  scenario check passed, but through a fact with no active item attached.
- Suggested fix: in `memory-save` step 1, a keep-phrase fact that explains
  why a part of the project exists or how it is used is project memory even
  while an item for that part is open; the item may link to it.

### 5. Low: a proposal the Stop hook saved does not record that the owner stated the fact

- Evidence: in s15 Mike stated the Venmo fact himself and asked to be asked
  first. The hook's proposal says only "the agent asked the owner ... and the
  turn ended with no answer". In s19 `work-decide` said "The proposal has no
  owner statement or other evidence for the Venmo claim, so I have no
  recommendation." Mike had to correct it in s20.
- Suggested fix: when the turn's prompt held the fact, the Stop hook quotes
  the prompt on the Evidence line.

### 6. Low: an approved proposal's section heading is the whole sentence

- `project_money_calculation.md` now has the heading "## Venmo rejects
  payments with a fraction of a cent, so every split share must be a
  whole-cent amount". `memory-save` says a heading "names the sub-topic in a
  few words". The Stop hook uses the full summary as the section name.

### 7. Low: the PreToolUse hook refused two scripts that did not change a work item

- s07: a Python script that only read `WORK-ITEM.md` and wrote
  `/tmp/wi-001-active-requirements.txt`, and a script that edited a temporary
  design draft in which the work item's path appeared as text. Both were
  refused as "a script would change it". The agent worked around both. (The
  first also used a fixed `/tmp` file name, which the skills say not to do.)

### 8. Low: an extra, unrequested save attempt to DECISIONS.md

- s12: after the memory save, the agent also tried to add the whole-cents
  rule to `DECISIONS.md` through `publish-docs`; the Git worktree step was
  refused, and the reply said "I could not add the rule to the committed
  project decision log because Git worktree creation was denied." Mike did
  not ask for a project decision. No leftover worktree or file.

### 9. Low: a concept summary was left stale for one session

- s08 added "Test runner" to `user_working_preferences` but kept the summary
  "How Mike prefers to review and approve results". `memory-save` says to add
  `--description` when the summary no longer covers the concept. s21 fixed
  it ("How Mike prefers reviews, tests, and commit messages").

### 10. Low: "Always" gets no keep-phrase hook line

- s21 "Always keep commit messages ..." got no UserPromptSubmit line. The
  agent saved it correctly anyway. `memory-save`'s approval policy lists
  "always" and "never" as approval words; the hook's six phrases do not
  include them.

### 11. Low: the hook state counts `toolkit memory save --help` as a save

- `sessions/s24-remark2.hookstate.json`: two "toolkit memory save" records; the
  second (03:20:33Z) was `toolkit memory save --help`. A Stop check that looks
  for a save in the turn could be satisfied by it.

## Checks run for this rerun (before the first turn)

| Check | Result |
| --- | --- |
| `node --test "tests/**/*.test.mjs"` in `plugins/toolkit` | 979 tests: 976 pass, 0 fail, 3 skipped, 124 seconds (`checks/toolkit-tests.txt`). |
| `node dev/tools/check-skills.mjs --quiet` | 29 `SKILL.md` files, 205 reference files (159 generated copies), 7 agent files, 683 toolkit commands; 0 failures, 0 warnings, 16 notes. |
| `node dev/tools/sync-skill-references.mjs --check` | 159 copies, 0 problems. |
| `node dev/tools/import-model.mjs --check` | The copy matches the approved model folder (112 files, commit `648bf4e`). |
| `node --test "plugins/git-workflows/tests/*.test.mjs"` | 14 pass, 0 fail. |
| `claude plugin validate .` | Validation passed. |

No toolkit code was changed. Nothing was staged or committed in this
repository.

## Files

- `sessions/`: every turn's files, `index.txt`, the hand rename, Mike's
  commands, and the s16 hash snapshots.
- `final/`: the project's final `MEMORY.md`, both concept files, the current
  focus, the dashboard, both work items, the design, `toolkit.json`, the file
  tree, the backup listing, Git and the app, the tracker and doctor output,
  and the hook table.
- `checks/`: the output of the six checks above.
- `harness/`: the scripts that ran the turns and built the summaries.

# Final confirmation run codex-salesforce, round 2 (2026-09-28)

One Salesforce project was set up with Toolkit V2 in Codex. One work item,
"Add a Tier picklist field to Account" (WI-001), went from `01-discovery` to
Done in 31 real Codex sessions (codex-cli 0.157.0, reasoning effort medium).
Its sub-item WI-002 came from a split and also reached Done. The tester
played Mike and answered only what the agent asked. This round ran on the
versions that carry the round 1 fixes: toolkit 0.2.7, work 0.2.9, memory
0.2.7, session-skills 0.2.7, git-workflows 0.2.7, sf-architect-solutioning
0.2.1.

Round 1 is kept in [round-1/](round-1/).

**Result: passed.** Every step the task names worked, and no bug blocked the
work or left Mike with a wrong picture:

- setup through the `project-setup` interview, including the backup folder,
  in a brand-new folder with no command-line plugin switch;
- WI-001 from `01-discovery` to Done with requirements, design, and result
  approvals, each with Mike's words in an "Owner said:" row;
- a split into the sub-item WI-002, which inherited the requirements and
  design approval and got its own result approval;
- a hand move and rename between sessions, reported in the next session's
  briefing and final reply, and written into both items' history;
- "remember that I prefer ..." saved and found by a later session;
- a "Save to memory: ...?" question left unanswered, saved as a proposal by
  the Stop hook in a live session, listed by "what do you need from me?",
  then rejected; a second proposal (saved by the agent) approved;
- "where are we?" and "what do you need from me?" answered correctly and
  changed no record;
- a handoff at the end, with a backup;
- a backup in the backup folder after each `toolkit work finish`;
- every hook ran; no toolkit command stalled on a prompt Mike could not see;
- `git log`: 8 commits, all "Mike Rihm <michael@rihm.com>", no AI credit line
  and no trailer.

Nine findings are listed under "Findings". None stops the work. The two
largest are skill rules the agent did not follow: the setup interview used
Codex's question box six times, and the acceptance checker did not run
before the result approvals (the agent said so plainly each time).

## How the run was set up

| Setting | Value |
| --- | --- |
| Project folder | `scratchpad/runs/final-codex-salesforce-r2`: a new Git repository, one commit (`b8210ac Initial commit`, a three-line `README.md`), no remote |
| Setup answers | Acme CRM, key `acme-crm`, prefix `WI`, owner Mike Rihm, tracker local, memory built-in, Salesforce yes, sandbox `tkv2-sbx`, production `tkv2-prod`, hosts Claude Code and Codex, no `SOUL.md`, backup folder `scratchpad/backups/codex-salesforce` |
| Backup folder | Emptied before the run: round 1's `acme-crm-2026-09-28` was moved to `scratchpad/backups-archive/codex-salesforce-r1/`, so every backup in the folder comes from this run. |
| Installed copies | Each Codex cache copy (`~/.codex/plugins/cache/toolkit-v2/<plugin>/<version>`) equalled its source folder before the first session and after the last, apart from one test file (`tests/notion/final-confirm.test.mjs`) that is not used at run time ([owner/00-pre-run.txt](owner/00-pre-run.txt), [owner/00-post-run.txt](owner/00-post-run.txt)). |
| Codex config | `~/.codex/config.toml` was not changed (same SHA-1 before and after): `toolkit@toolkit-v2` `enabled = true`, the other five `enabled = false`, no entry for this folder. |
| Codex command | `codex exec --json --dangerously-bypass-hook-trust --sandbox workspace-write -c 'projects={"<project>"={trust_level="trusted"}}' -c 'model_reasoning_effort="medium"' -c 'notify=[]' -C <project> "<message>"` ([harness/run.sh](harness/run.sh)). The trust setting stands in for Mike trusting the folder when Codex asks. |
| Mike approving Git commands | `codex exec` has no one to click "approve". In sessions where Mike's message approved Git commands (s00h, s07, s10, s16, s18), the run used `--approve-for-me` instead of `--sandbox`: Codex's automatic reviewer stands in for his click. |
| Same chat, next message | The setup interview (s00a to s00h) and s12 to s15 and s20 to s21 used `codex exec resume <thread>`, so Mike's answer reached the chat that asked. Every other session was a new `codex exec`. |
| Fake Salesforce CLI | [harness/fake-sf.sh](harness/fake-sf.sh), round 1's fake with its paths changed. It logs every call to [harness/sf-calls.log](harness/sf-calls.log), prints success JSON, and keeps org state in [harness/org-state/](harness/org-state/). It is first on the `PATH` through [harness/zprofile-shim.txt](harness/zprofile-shim.txt), so the hooks use it too. Mike's first message said the orgs are practice orgs and `sf` simulates them. |

For each session, [sessions/](sessions/) holds Mike's message
(`.prompt.txt`), the final reply (`.final-message.txt`), a readable summary of
every tool call from the Codex session log (`.summary.txt`), the hook
messages Codex added (`.hooks.txt`), the toolkit hook state
(`.hookstate.json`), and the mode (`.mode`). [sessions/index.txt](sessions/index.txt)
has the start and end times. Commands Mike ran in a terminal, and the
tester's own checks, are in [owner/](owner/). [final/](final/) holds the end
state of the records.

## Timeline

"Skills" lists the `SKILL.md` files the agent read in that session.

| Session | Mike's message (short) | Skills | Result |
| --- | --- | --- | --- |
| s00a | "Set up Toolkit V2 in this project. It's a Salesforce project ... practice orgs ..." | project-setup | `toolkit doctor` (exit 4, not a project yet; computer fine), `toolkit hindsight health` (blocked by the sandbox, see finding 4), `sf org list`, `git config user.name`. Stated name, key, prefix, and owner "unless you correct them". Asked the tracker question through Codex's question box (finding 1); the final reply named it with the recommendation. |
| s00b | "Those names are right. Local folders." | - | Memory question through the question box; the reply said only "Please choose the memory backend in the question above". |
| s00c | "The built-in folder is fine." | - | Salesforce confirmed in one line; `SOUL.md` question (box), recommending skip. |
| s00d | "Skip it for now." | - | Backup folder question (box), recommending `~/Backups/toolkit`. |
| s00e | the backup folder path | - | Said first that Codex needs approval to write `.codex/` and `.agents/` and this session's setting may block it (round 1 finding 6). `toolkit init` stopped on the sandbox (`EPERM`), wrote nothing, and printed the full command; the agent gave Mike that command. |
| owner | ran it in a terminal | - | 112 files added, `.toolkit.json` last ([owner/01-owner-init.txt](owner/01-owner-init.txt)). |
| s00f | "I ran it in Terminal ... Keep going with the setup." | memory-save | Briefing arrived. `config set` both org aliases; API 62.0 into `sfdx-project.json` and the full `package.xml`; `toolkit handoff-backup` (first backup); focus with the two Codex trust steps; practice-org facts in `PROJECT.md`; doctor 0 problems. Asked the one-sentence outcome. |
| s00g | the outcome | - | Outcome written into `AGENTS.md`, `PROJECT.md`, `PROJECT-ROADMAP.md`. Asked the build and test command through the box, waited 30 seconds, then wrote "None verified yet" itself (finding 1). Last line: "Setup files are not committed. Commit them now?" |
| s00h | "Yes, commit the setup files. I approve the git commands for that commit." | - | Commit `65072e2`, staged by name, author Mike. "Tell me the first thing you want built." |
| s01 | "New work: add a Tier picklist field to Account ..." | work-on, work-requirements, memory-save | `toolkit work new ... --stage 01-discovery` -> WI-001; Starting request in Mike's words; stage 02; Q-01 with a recommendation. |
| s02 | goal, values, "remember that I prefer every new custom field to have a description and help text" | work-decide, work-requirements, memory-save | Keep line from UserPromptSubmit; `toolkit memory save --type user --name custom-field-guidance ... --approved-by 'Mike Rihm'` -> "Saved to memory: user_custom_field_guidance (new record)." Q-02 with a recommendation. |
| s03 | blank, no default, access, placement | work-requirements, work-on, memory-save | R-01 to R-04 and Acceptance; independent requirements helper (`fork_turns` none); "Do you approve these requirements?" |
| s04 | "Approved." | work-decide, solution-design, sf-architect-solutioning, work-delegate, memory-save | "Owner said: Approved." row, `approve WI-001 --requirements --by 'Mike Rihm'`. work-delegate step 1 recorded owner-led delivery: "Small item: one field, access, and page layout; no delivery offer." The reply ended without a question or words to continue (finding 3). |
| s05 | "Keep going." | work-on, solution-design, sf-architect-solutioning, memory-save | Stage 04; two helper agents, one of them the design critic (both `fork_turns` none); the save printed "Note: The design of WI-001 has no "## Diagrams" section; the template has it", and the agent added it before asking. Option A (profile field access) recommended, Option B (permission sets). "Please choose and approve Option A or Option B for WI-001." |
| s06 | "Yes, I approve Option A. Then split it ..." | work-decide, work-organize, work-requirements, memory-save | "Owner said:" row; Selected design filled, then `approve WI-001 --design`; stage 05; `toolkit work new --title 'Set Account Tier access and page layout' --type build --parent WI-001 --covers R-03,R-04` -> WI-002 at 06; WI-001 to 06. Reply ended without a question (finding 3). |
| owner | moved and renamed folders by hand | - | [owner/02-hand-move.txt](owner/02-hand-move.txt) |
| s07 | "Keep going. I approve the git commands the build needs ..." | work-on, sf-component-tracker, sf-deploy-check, work-check, memory-save | Briefing and final reply reported the move and the rename. Two worktrees; `Tier__c.field-meta.xml` with description and help text; layout with Tier below Rating; sandbox validates; commits `147aa3e`, `a0bb6ee`. "Do you approve deploying WI-001, then WI-002 to `tkv2-sbx` ...?" |
| s08 | "Yes, I approve deploying WI-001, then WI-002 to tkv2-sbx ..." | work-decide, sf-deploy-check, work-on, memory-save | "Owner said:" row; gave Mike the two ordered sandbox deploy commands and the manual profile steps (decision 3: in Codex the owner runs sandbox deploys). |
| owner | ran both sandbox deploys, set the grants in Setup | - | [owner/03-owner-sbx-deploys.txt](owner/03-owner-sbx-deploys.txt) |
| s09 | deploy results, pre-deploy checks, "Honestly, the short numbered manual steps file was more useful to me than a long check list in the chat." | work-on, work-decide, sf-component-tracker, work-check, memory-save | Recorded; stage 09; `FieldPermissions` query confirmed the grants. Noticed that the sandbox help text differed from the source (harness note 2) and asked Mike to check it in Setup. Git staging refused (no approval in this message); the reply said the records are uncommitted. No memory save and no question about the passing remark. |
| s10 | the four checks passed, "I approve the git commands to commit the records. By the way, I'm usually off on Fridays." | work-decide, work-check, memory-save, publish-docs, sf-component-tracker | Records committed (`ec5ebe1`, `af88cab`). Both items to 11 without the acceptance checker (finding 2); the reply said "no independent agent check ran". Friday note saved with `--proposal`. "Do you approve this result?" for WI-001. |
| s11 | "Where are we?" | work-status | Correct summary of both items and the Friday proposal; "Say 'what do you need from me' to go through the three decisions." No record changed. |
| s12 | "What do you need from me?" | work-decide | "Three decisions wait on you: approval of the WI-001 Tier field result, approval of the WI-002 access and page layout result, and whether to save a proposed note that you are usually off on Fridays." Then WI-001 alone, with a recommendation. No record changed. |
| s13 | same chat: "Yes, I approve the WI-001 result." | work-finish, memory-save | "Owner said:" row, `approve WI-001 --result`. The command printed the stale Next action note, and the agent fixed the line. Then the WI-002 question. |
| s14 | same chat: "Yes, I approve the WI-002 result." | - | Approved. Then "Save to memory: Mike Rihm is usually off on Fridays?" The Stop hook saw that a proposal already existed and did not save a second one. |
| s15 | same chat: "Yes, keep the Friday one. I usually do my design reviews first thing in the morning, with coffee." | - | `toolkit memory approve user_friday_availability --by 'Mike Rihm'`. Asked "Save to memory: Mike Rihm usually prefers design reviews first thing in the morning?" and saved nothing. The Stop hook saved it as a proposal (below). |
| s16 | "Ship it: merge both branches into main and get both packages to production ..." | work-finish, sf-deploy-check, sf-component-tracker, publish-docs, memory-save | Merged into `main` ("No remote: merged locally"); stages 12, 13; production left to Mike with two ordered commands and the manual steps. |
| s17 | guard test: the production dry-run once, then `--help` | - | "Command blocked by PreToolUse hook: Guarded 'deploy' command: 'tkv2-prod' is a PRODUCTION org. BLOCKED." `sf project deploy start --help` ran. |
| owner | ran both production deploys, set the grants | - | [owner/04-owner-prod-deploy.txt](owner/04-owner-prod-deploy.txt) |
| s18 | results, "Close both items out. I approve the git commands for the closeout." | work-finish, sf-component-tracker, publish-docs, memory-save | Stage 14; `requirements/account-ranking/ACCOUNT-RANKING.md` (one folder per area, decision 1) and `system-guide/account-ranking.md`; closeout commit `b28c640` through publish-docs (save folder in `.claude/worktrees/docsave-...`); `toolkit work finish WI-002`, then `WI-001`, each printing "Backed up ..."; worktrees and branches removed. |
| s19 | "Do you remember how I like new custom fields to be set up?" | memory-find | `toolkit memory find 'custom field'`, `toolkit memory get user_custom_field_guidance`: "Yes. You want every new custom field to include a description and help text. (Project memory `user_custom_field_guidance`, approved by you on 2026-09-28.)" |
| s20 | "What do you need from me?" | work-decide | "One decision waits on you: a proposed memory note says you usually prefer design reviews first thing in the morning." No record changed. |
| s21 | same chat: "Discard it. It was just a passing comment, not a rule." | - | `toolkit memory reject user_mike_rihm_usually_prefers_design_reviews_first`; "no decisions are waiting on you." |
| s22 | "Write a handoff. I'm going to clear context and start fresh tomorrow." | handoff, memory-save | Focus updated; memory review found nothing new; `handoff-verifier` helper; `toolkit handoff-backup`; the checked prompt. |

## Proof by requirement

### Setup (project-setup)

- The six answers were collected in the order of `references/interview.md`.
  Name and owner were stated in one line; Salesforce was confirmed in one
  line from Mike's first message. Each question carried a recommendation.
- Before running init, the agent said Codex needs approval to write
  `.codex/` and `.agents/` (round 1 finding 6 is fixed in part: it said so
  in a progress line, not as a separate question).
- Init inside Codex stopped on the sandbox before writing anything, and
  printed the full command with every answer kept. The agent did not change
  an answer or set up elsewhere.
- No setup work item. The outcome was asked, not made up. The commit came
  only after Mike's yes, staged by name, author Mike.
- The first backup ran at setup: "Backed up .work-items/ and .memory/ to
  .../backups/codex-salesforce/acme-crm-2026-09-28."

### Work item from 01-discovery to Done, with a sub-item

Final headers ([final/WI-001-WORK-ITEM.md](final/WI-001-WORK-ITEM.md),
[final/WI-002-WORK-ITEM.md](final/WI-002-WORK-ITEM.md)):

```yaml
id: WI-001                                        id: WI-002
stage: 14-spec-update                             stage: 14-spec-update
status: Done                                      status: Done
parent: none                                      parent: WI-001
delivery: owner-led                               delivery: owner-led
requirements_approved: "2026-09-28 by Mike Rihm"  requirements_approved: "2026-09-28 by Mike Rihm"
design: approved                                  design: none
result_approved: "2026-09-28 by Mike Rihm"        result_approved: "2026-09-28 by Mike Rihm"
```

WI-001: 01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07 -> 08 -> 09 -> 11 -> 12 -> 13 ->
14 -> Done. WI-002: 06 -> 07 -> 08 -> 09 -> 11 -> 12 -> 13 -> 14 -> Done.

The split (s06):

```text
$ toolkit work new --title 'Set Account Tier access and page layout' --type build --parent WI-001 --covers R-03,R-04
Created WI-002: Set Account Tier access and page layout (06 Implementation plan, In Progress, sub-item of WI-001) at .work-items/WI-001-add-a-tier-picklist-field-to-account/WI-002-set-account-tier-access-and-page-layout/WORK-ITEM.md.
It delivers WI-001 R-03, R-04 and inherits that requirements approval (2026-09-28 by Mike Rihm).
WI-001's approved design covers it, so it starts at planning with no design of its own.
```

Mike was not asked to approve R-03, R-04, or the design again. WI-002 got its
own result approval (s14). Every approval has an "Owner said:" row before the
approval row. Both Roadmaps show every phase Done; WI-001's P2 row names
WI-002 in its Sub-items column.

End state ([owner/99-final-state.txt](owner/99-final-state.txt)):

```text
$ toolkit work list --tree --all
account-tier/ (group)
  WI-001  Add a Tier picklist field to Account  (Done)
    WI-002  Set Account Tier access and page layout  (Done)
$ toolkit work validate
Checked 2 items: 2 clean, 0 errors, 0 approval gate problems. No open question waits on the owner.
$ toolkit work decisions
Nothing is waiting on the owner.
$ git worktree list  -> only the main checkout
$ git branch -a      -> * main
$ git status --short -> (empty)
$ toolkit doctor
Result: clean. No problems and no warnings here (3 for Codex only).   exit=0
```

The field ([final/Tier__c.field-meta.xml](final/Tier__c.field-meta.xml)) has
Gold, Silver, Bronze in order, no default, `restricted` true, a description,
and help text (the saved preference was applied). The layout
([final/Account-Account Layout.layout-meta.xml](final/Account-Account%20Layout.layout-meta.xml))
has `Tier__c` right after `Rating`.

### Hand move and rename (between s06 and s07)

[owner/02-hand-move.txt](owner/02-hand-move.txt):

```text
$ mkdir .work-items/account-tier
$ mv .work-items/WI-001-add-a-tier-picklist-field-to-account .work-items/account-tier/WI-001-tier-field
$ mv .work-items/account-tier/WI-001-tier-field/WI-002-set-account-tier-access-and-page-layout .work-items/account-tier/WI-001-tier-field/WI-002-tier-access-and-layout
```

s07's briefing ([sessions/s07-after-move-build.hooks.txt](sessions/s07-after-move-build.hooks.txt)):

```text
- Moved: WI-001 from WI-001-add-a-tier-picklist-field-to-account to account-tier/WI-001-tier-field (moved and renamed by hand). It is still a top-level item.
- Renamed folder: WI-002's folder was renamed by hand from WI-002-set-account-tier-access-and-page-layout to WI-002-tier-access-and-layout; the item itself is the same. It moved along with its parent WI-001's folder, and it is still a sub-item of WI-001.
```

s07's final reply repeated both lines word for word. History rows the CLI
wrote: WI-001 "Moved by hand: ... -> .work-items/account-tier/WI-001-tier-field/WORK-ITEM.md.
| It is still a top-level item. Group: account-tier." and WI-002 "Folder
renamed by hand: ... | Same item; the toolkit uses the new path. It moved
along with its parent WI-001's folder and is still its sub-item." Every later
session found both items by id.

### "Remember that I prefer ...": saved, then found

- s02: the UserPromptSubmit hook added "The owner stated something to keep;
  memory-save records it, or work-on if it is a task." (hook state
  `"keep": "remember that"`). The same turn ran `toolkit memory save --type
  user --name custom-field-guidance ... --source 'Mike Rihm, in chat,
  2026-09-28' --approved-by 'Mike Rihm'`.
- The record ([final/user_custom_field_guidance.md](final/user_custom_field_guidance.md)):
  `status: current`, `authorization: Approved by Mike Rihm on 2026-09-28`,
  bold labels, "**Why:** Not stated by the owner."
- It was applied in s07 (the field has both).
- s19, a new session, found it with `toolkit memory find` and
  `toolkit memory get` and cited the key and the approval.

### Memory proposals: unanswered, listed, approved and rejected

- **Saved by the Stop hook, live (s15).** The agent ended its reply with
  "Save to memory: Mike Rihm usually prefers design reviews first thing in
  the morning?" and saved nothing. The Stop hook saved it. Hook state
  ([sessions/s15-keep-friday-morning.hookstate.json](sessions/s15-keep-friday-morning.hookstate.json)):
  `{"kind": "memory", "what": "toolkit memory save --proposal (Stop hook)",
  "proposal": true, "key": "user_mike_rihm_usually_prefers_design_reviews_first"}`,
  written at 23:07:00.901Z, 0.2 seconds after the reply. The record
  ([final/stop-hook-proposal-user_mike_rihm_usually_prefers_design_reviews_first.md](final/stop-hook-proposal-user_mike_rihm_usually_prefers_design_reviews_first.md),
  copied from the backup) has `status: needs-review`, "Proposed by the agent
  on 2026-09-28; the owner has not answered", and "Do not rely on this until
  the owner approves it." The key does not repeat the type word (round 1
  cosmetic fix).
- **No duplicate (s14).** When the agent asked about Fridays again after the
  agent had already saved that proposal, the Stop hook did not save a second
  one and left the note "was not saved again: memory already has the
  proposal user_friday_availability like it".
- **Saved by the agent (s10).** "I'm usually off on Fridays" was saved with
  `--proposal` (`status: needs-review`).
- **Listed.** Before s12, `toolkit work decisions` listed 3 decisions, the
  Friday proposal included, and `toolkit work next` said "3 decisions wait on
  the owner (2 about work items, 1 memory proposal ...)" (round 1 fix to
  `work next`). s12's reply named all three with the count first. Before
  s20 the queue held only the Stop hook's proposal
  ([owner/decisions-before-s20.txt](owner/decisions-before-s20.txt)), and
  s20 named it.
- **Approved and rejected.** s15: `toolkit memory approve
  user_friday_availability --by 'Mike Rihm'` -> `status: current`,
  "Approved by Mike Rihm on 2026-09-28"
  ([final/user_friday_availability.md](final/user_friday_availability.md)).
  s21: `toolkit memory reject user_mike_rihm_usually_prefers_design_reviews_first`;
  the record is gone. `toolkit memory status`: "Records: 2 current, 0 needing
  review, 0 retired".

### "Where are we?" and "What do you need from me?"

- s11 "Where are we?": `work-status` ran `work list --tree`, `work next`,
  `work decisions`, `memory focus`, `work lifecycle`, and `work show` for
  both items. The answer matched the records and ended "Say 'what do you need
  from me' to go through the three decisions." Every file in `.work-items/`
  and `.memory/` had the same checksum before and after, except
  `.work-items/.toolkit-state.json` (the toolkit's own state file); `git
  status` in the main checkout and both worktrees was the same
  ([owner/md5-before-s11.txt](owner/md5-before-s11.txt),
  [owner/md5-after-s11.txt](owner/md5-after-s11.txt)).
- s12 and s20 "What do you need from me?": see above. Neither changed a
  record ([owner/md5-before-s12.txt](owner/md5-before-s12.txt),
  [owner/md5-after-s12.txt](owner/md5-after-s12.txt),
  [owner/md5-before-s20.txt](owner/md5-before-s20.txt),
  [owner/md5-after-s20.txt](owner/md5-after-s20.txt)).

### Handoff

s22 opened the `handoff` skill, updated the focus, ran the memory review
(nothing new), had the `handoff-verifier` helper check the prompt, and ran
`toolkit handoff-backup`. The prompt names the goal (Mike's outcome
sentence), the task (pick up his next request; WI-001 and WI-002 are Done),
what to read first, the open points (next request unknown; Codex trust), the
first action, and the repository state (clean `main`). Its first line is the
fixed notice the handoff skill always writes; it is chat text, not a commit.

### Backups

| When | Folder | `exportedAt` | Printed by |
| --- | --- | --- | --- |
| Setup (s00f, s00g) | `acme-crm-2026-09-28` | 2026-09-28T22:20:42Z | `toolkit handoff-backup` |
| Before s18 | same | 2026-09-28T22:20:42Z (unchanged) | [owner/backup-before-finish.txt](owner/backup-before-finish.txt): only the setup files, no work item |
| After s18 (`toolkit work finish` for WI-002, then WI-001) | same | 2026-09-28T23:17:48Z | Each finish printed "WI-00x is Done. Result approval: 2026-09-28 by Mike Rihm." then "Backed up .work-items/ and .memory/ to .../acme-crm-2026-09-28." |
| After s22 (handoff) | `acme-crm-2026-09-28-192035` | 2026-09-28T23:20:36Z | `toolkit handoff-backup` |

After the finish, the backup held the moved tree
(`work-items/account-tier/WI-001-tier-field/.../WORK-ITEM.md` with `status:
Done`), `DESIGN.md`, the memory records, and `CURRENT_FOCUS.md`
([owner/backup-after-finish.txt](owner/backup-after-finish.txt)). The
handoff backup went to a second folder with the time added, because the
day's folder was larger (it still held the proposal Mike rejected in s21);
the toolkit never replaces a larger backup of the same day, as documented
([owner/backup-after-handoff.txt](owner/backup-after-handoff.txt)).

### Salesforce guards

| Command | Where | Result |
| --- | --- | --- |
| `sf project deploy start -x delivery/deployment/WI-001-tier-field/package.xml -o tkv2-prod --dry-run --json` | s17, live | "Command blocked by PreToolUse hook: Guarded 'deploy' command: 'tkv2-prod' is a PRODUCTION org. BLOCKED. Ask the owner to run it, and do not rewrite the command to get around this.. Command: ..." Only the guard's `sf org list --json --skip-connection-status` reached the fake; no deploy line. |
| `sf project deploy start --help` | s17, live | Ran; the fake printed its help line. |
| `sf project deploy validate ... -o tkv2-sbx`, describes and queries against both orgs | s00a to s18, live | Allowed. |
| Sandbox and production deploys | - | Never run by an agent. The four `deploy start` lines in `sf-calls.log` (18:51:59 and 19:13:21 local time) came from Mike's terminal. |

### Every hook ran

[owner/hooktable.txt](owner/hooktable.txt) and
[owner/stop-hook-timing.txt](owner/stop-hook-timing.txt), over every session:

- **SessionStart:** the "Project briefing: Acme CRM (acme-crm), owner Mike
  Rihm ..." in all 25 sessions after init, including the resumed setup chat
  (s00f); none before init.
- **UserPromptSubmit:** the keep line in s02, the only message with a keep
  phrase; a turn record in every session after init; the next-turn proposal
  note in s15.
- **PreToolUse:** the production guard (s17); the "Run each toolkit command
  alone" note when a toolkit command was joined to others (s18).
- **PostToolUse:** the direct-edit notes for `DESIGN.md` (s06) and
  `WORK-ITEM.md` (s07, s09, s10).
- **Stop:** in all 25 sessions after init, the hook state file was written
  0.1 to 0.2 seconds after the final reply; only the Stop hook writes it
  then. `stopBlocked: false` everywhere. It saved the s15 proposal live and
  declined the s14 duplicate.
- No hook failure: `<git common dir>/toolkit-v2/` holds only `export.json`;
  there is no `hook-errors.log`.

### No toolkit command stalled on a prompt Mike could not see

[owner/toolkit-stall-scan.txt](owner/toolkit-stall-scan.txt) (from
[harness/tkscan3.py](harness/tkscan3.py)), [owner/toolkit-scan.txt](owner/toolkit-scan.txt),
and [owner/toolkit-nonzero.txt](owner/toolkit-nonzero.txt), over every
session's log:

- Every toolkit command in the logs finished; the longest took 1.9 seconds.
- Non-zero exits: `toolkit doctor` exit 4 before init and exit 1 with only
  the Codex trust warnings (both documented); `toolkit init` exit 1 in the
  sandbox (s00e: it wrote nothing and printed the command, which the agent
  showed Mike); `toolkit hindsight health` exit 1 in the sandbox (s00a,
  finding 4). None waited for input.
- No ask-first toolkit command (memory delete or import, `toolkit import`,
  machine-setup, Hindsight service) was needed in this scenario.
- The one Git write without Mike's approval (s09 `git add`) was refused by
  Codex ("approval required by policy, but AskForApproval is set to Never");
  the reply said the records were uncommitted, and they were committed in
  s10 after his yes.
- Six question-box calls (`request_user_input_async`) happened in the setup
  interview; they are finding 1. None was a toolkit command.

### Commits and AI credit

`git log`: 8 commits, every author and committer "Mike Rihm
<michael@rihm.com>" ([owner/git-log-full.txt](owner/git-log-full.txt)). A
search of every full commit message for `co-authored`, `generated`,
`claude`, `codex`, `openai`, `chatgpt`, `anthropic`, `gpt`, and the word AI
found nothing. No commit has a trailer.

### Checks on the toolkit repository

Run at the end of the run on the working tree
([owner/repo-checks.txt](owner/repo-checks.txt)): toolkit tests 928, 925
pass, 0 fail, 3 skipped by design; check-skills 0 failures, 0 warnings, 16
notes; sync-skill-references 159 copies, 0 problems; import-model `--check`
matches the approved model folder (commit `5e7d7a0`); git-workflows tests 14
of 14; `claude plugin validate .` passed.

### Round 1 fixes seen working

- Owner-led delivery kept the design critic (s05).
- A proposed design is checked for the template's sections at save (s05).
- `work next` counts memory proposals (before s12).
- The stale Next action note after an approval, and the agent fixed the line
  (s13).
- The Stop hook's proposal key leaves out the type word (s15).
- The Stop hook saves a proposal live and does not save a duplicate (s14,
  s15).
- A passing remark was not saved as approved (s09, s10); the Friday note was
  saved as a proposal, not as approved (round 1 finding 1).
- "Proposal" was said only for records saved with `--proposal` (s10, s11,
  s12, s20).
- The recommendation for the Friday proposal named Mike's own words (s14).
- publish-docs put its save folder in the ignored `.claude/worktrees/`
  (s18).
- The approver's full name in every `--approved-by` and `--by` ("Mike
  Rihm").
- Mike was told before init that Codex needs approval to write its folders
  (s00e).

## Findings

Ordered by how much they could affect a solo developer. None blocks the work
or leaves a wrong record that matters.

1. **The setup interview used Codex's question box (medium; the rule is in
   `interview.md`).** In s00a to s00g the agent asked five of the setup
   questions with `request_user_input_async`, slept 30 seconds, and then
   ended the turn. `project-setup`'s `references/interview.md` says "One
   question per message, in the reply text, never through a question tool."
   In the Codex app Mike would see the box, so the setup did not stall. In
   `codex exec` the box is not shown: the s00b reply said only "Please
   choose the memory backend in the question above so I can continue
   setup", with no options and no recommendation. In s00g the agent got no
   answer to the build and test command question within 30 seconds and
   wrote the recommended "None verified yet" itself. The reply said "There
   is no verified build or test command yet", which is true, but Mike did
   not choose it. Round 1 had no question-box call. This is the open audit
   proposal "block question boxes in Codex" (`dev/PROGRESS.md`, "For Mike in
   the final report"). A lighter fix: put the line "Ask in the reply text,
   never through a question tool" in `project-setup`'s `SKILL.md` Gotchas,
   as `memory-save` and `work-requirements` have it.
2. **The acceptance checker did not run before the result approvals
   (medium; disclosed).** In s10 the agent moved both items from 09 Testing
   to 11 User approval without briefing the `acceptance-checker`, although
   `spawn_agent` worked in this project (s03, s05, s22). `work-check` says
   owner-led delivery keeps the checker and only Mike's words about the check
   remove it. The agent said so plainly every time: the history row reads
   "gaps: no acceptance gap reported; no independent agent checker ran", and
   s10, s12, and s13 each said "no independent agent check ran" before
   asking. Mike's own org checks were the evidence, and they covered every
   requirement. The round 1 fix made owner-led delivery keep the design
   critic, which did run (s05).
3. **Replies without a question or words to continue (small; repeats round 1
   finding 5).** s04 ended "The next step is to prepare the design options
   for the Account Tier field." and s06 ended "The tracker validates cleanly,
   and no work decision is waiting on you." Mike had to guess "Keep going."
   In s20 the question was in the first paragraph and the Codex trust
   reminder came after it. The rule that every reply ends with the question
   or the words to continue already exists in these skills.
4. **`toolkit hindsight health` was blocked by the sandbox and not run again
   (small).** In s00a it ran inside one script with six other commands. The
   toolkit printed exactly what to do ("Run the toolkit command alone on its
   own line ... or ask the owner to approve running it outside the
   sandbox"), but the agent went on, and the memory question said
   "Hindsight's status could not be checked from this sandbox." It still
   offered Hindsight. Mike chose built-in memory, so nothing changed.
5. **Delivery offer skipped as a "small item", not mentioned in the reply
   (small; allowed by the skill).** s04 recorded `delivery: owner-led` with
   "Small item: one field, access, and page layout; no delivery offer."
   `work-delegate` step 1 allows this for "one or two tasks, no sub-items".
   The item had three parts and later got a sub-item, so the call was
   borderline, and the reply did not tell Mike that no offer would be made.
6. **"Owner said:" rows not word for word in three places (small; round 1
   finding 8 came back).** s18's row changed "can't edit it" to "cannot edit
   it", the same kind of change round 1 found ("she'll" to "she will"),
   although `recording-owner-answers.md` now says to keep apostrophes (as ’
   in Codex). s10's row reads "In Setup, Tier description is Sales team’s
   ranking tier for an Account." where Mike wrote "Tier's description is
   \"Sales team's ranking tier for an Account.\"" (the quotation marks and
   the numbering were dropped). s02's row starts "Owner confirmed Q-01 and
   said:" and leaves out his first sentence, "Yes, that's the goal." The
   rows in s04, s06, s08, s13, s14, and s16 are exact, and s08's keeps
   "I’ll" with the Codex apostrophe.
7. **Memory reply lines not word for word (small).** s10 said "Your Friday
   availability is saved as a proposal pending your yes or no." in place of
   "Saved as a proposal for your yes or no: <title>."; s21 said "Discarded.
   ..." in place of "Not saved: <title>. I will not suggest it again.", and
   ended without a next step. The meaning was right both times.
8. **A temporary folder was left in `/tmp` (low).** s05 made
   `/tmp/acme-design-lfiBs3` with `mktemp -d` for the design text and a
   retrieved profile, and did not delete it. The other temporary folders in
   this run (`/private/tmp/wi-001-org-check`, a `tmp.*` folder) were deleted.
9. **Two periods in the Salesforce guard's message in Codex (cosmetic; model
   file).** "... do not rewrite the command to get around this.. Command:
   ...". Codex adds ". Command: ..." after the reason. The round 1 fix
   removed the final period from the toolkit's own hooks; the Salesforce
   guard is the model's `.claude/hooks/guard-protected-orgs.cjs`, so the
   same change there is a model change and needs Mike's yes.

## Harness notes (not toolkit bugs)

1. The folder trust was passed on the command line and hook trust was
   skipped with `--dangerously-bypass-hook-trust`, so `toolkit doctor` and
   the briefing warned about Codex trust in every session. That is correct:
   Mike has not trusted this folder or its hooks in Codex.
2. The fake `sf` returned fixed help text for `Tier__c` that differed from
   the field the agent built. In s09 the agent noticed the difference and
   asked Mike to check the text in Setup, which is the right behavior. After
   s09 the fake was changed to return the built help text.
3. [harness/run.sh](harness/run.sh) was changed after s00c. It now counts the
   lines of the Codex session log before a resumed message, so each resumed
   session's `.rollout.jsonl` holds only that message's part of the chat.
   s00c's summary was rebuilt the same way.
4. In the plain folder before init (s00a), Codex also loaded the older
   claude-toolkit plugins, as the install report says it does outside V2
   projects; the agent read claude-toolkit's `work` skill once but followed
   `project-setup`. After init the project's `.codex/config.toml` turns them
   off, and no later session read a claude-toolkit file.
5. The fake returns the same job id and "1 component" for every deploy.
6. Round 1's evidence was moved into [round-1/](round-1/) unchanged; its
   links still work.

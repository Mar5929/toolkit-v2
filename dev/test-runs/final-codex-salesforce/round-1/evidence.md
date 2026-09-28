# Final confirmation run codex-salesforce, round 1 (2026-09-28)

One Salesforce project was set up with Toolkit V2 in Codex, and one work
item, "Add a Tier picklist field to Account" (WI-001), went from
`01-discovery` to Done in 37 real Codex sessions (codex-cli 0.157.0,
reasoning effort medium). Its sub-item WI-002 came from a split and also
reached Done. The tester played Mike and answered only what the agent asked.
This is the first run on the everyday install (decisions 10 and 11): the
`toolkit` plugin is on for every Codex folder, and the other five V2 plugins
are on only through the project's own `.codex/config.toml`.

**Result: passed.** Every step the task names worked, and no bug blocks or
misleads a solo developer:

- setup through the `project-setup` interview, one question per message,
  including the backup folder, in a brand-new folder with no command-line
  plugin switch (the machine-wide `toolkit` plugin was enough);
- WI-001 from `01-discovery` to Done with requirements, design, and result
  approvals, each with Mike's words in an "Owner said:" row;
- a split into the sub-item WI-002, which inherited the requirements and
  design approval;
- a hand move and rename between sessions, reported by the next session's
  briefing, repeated in that session's final reply, and written into both
  items' history;
- "remember that I prefer ..." saved and found by a later session;
- a memory proposal left unanswered, listed by "what do you need from me?"
  with the count first, then approved; a second proposal, saved by the Stop
  hook from an unanswered "Save to memory: ...?", then rejected;
- "where are we?" answered correctly and changed no record;
- a handoff at the end, with a backup;
- a backup in the backup folder after each `toolkit work finish`;
- every hook ran; no toolkit command stalled on a prompt Mike could not see;
- `git log`: 17 commits, all "Mike Rihm <michael@rihm.com>", no AI credit
  line and no trailer.

Eight small findings are listed under "Findings". None stops the work.

## How the run was set up

| Setting | Value |
| --- | --- |
| Project folder | `scratchpad/runs/final-codex-salesforce-r1`: a new Git repository, one commit (`cb7b2d6 Initial commit`, a three-line `README.md`), no remote |
| Setup answers | Acme CRM, key `acme-crm`, prefix `WI`, owner Mike Rihm, tracker local, memory built-in, Salesforce yes, sandbox `tkv2-sbx`, production `tkv2-prod`, hosts Claude Code and Codex, no `SOUL.md`, backup folder `scratchpad/backups/codex-salesforce` |
| Plugin versions | toolkit 0.2.6, work 0.2.8, memory 0.2.6, session-skills 0.2.6, git-workflows 0.2.6, sf-architect-solutioning 0.2.1. Each Codex cache copy (`~/.codex/plugins/cache/toolkit-v2/<plugin>/<version>`) equalled its source folder, file for file, before the first session and again after the last one. |
| Codex config | `~/.codex/config.toml` was not changed: `toolkit@toolkit-v2` `enabled = true`, the other five `enabled = false`, no entry for this folder. |
| Codex command | `codex exec --json --dangerously-bypass-hook-trust --sandbox workspace-write -c 'projects={"<project>"={trust_level="trusted"}}' -c 'model_reasoning_effort="medium"' -c 'notify=[]' -C <project> "<message>"` ([harness/run.sh](harness/run.sh)). The trust setting stands in for Mike trusting the folder when Codex asks; without it Codex ignores the project's `.codex/config.toml`, which turns the other five plugins on. |
| First session | No `-c plugins=...` switch was needed (earlier runs needed one). Codex listed `project-setup` in the new folder because the toolkit plugin is on machine-wide. |
| Mike approving Git commands | `codex exec` has no one to click "approve". In sessions where Mike had approved Git commands (s00j, s09, s11 to s14, s23, s25), the run used `--approve-for-me` instead of `--sandbox`: Codex's automatic reviewer stands in for his click. s12 to s14 used it under Mike's s09 approval of "the git commands the build needs (worktrees, branches, commits)". |
| Same chat, next message | The setup interview (s00a to s00j), s18, and s21 to s22 used `codex exec resume <thread>`, so Mike's answer reached the chat that asked. Every other session was a new `codex exec`. |
| Fake Salesforce CLI | [harness/fake-sf.sh](harness/fake-sf.sh), the earlier harness with its paths changed. It logs every call to [harness/sf-calls.log](harness/sf-calls.log), prints success JSON, and keeps org state in [harness/org-state/](harness/org-state/). It is first on the `PATH` through [harness/zprofile-shim.txt](harness/zprofile-shim.txt), so the hooks use it too. Mike's first message said the orgs are practice orgs and `sf` simulates them. |

For each session, [sessions/](sessions/) holds Mike's message
(`.prompt.txt`), the final reply (`.final-message.txt`), a readable summary
of every tool call from the Codex session log (`.summary.txt`), the hook
messages Codex added (`.hooks.txt`), the toolkit hook state
(`.hookstate.json`), and the mode (`.mode`). [sessions/index.txt](sessions/index.txt)
has the start and end times. Commands Mike ran in a terminal, and the
tester's own checks, are in [owner/](owner/). [final/](final/) holds the end
state of the records.

## Timeline

"Skills" lists the `SKILL.md` files the agent read.

| Session | Mike's message (short) | Skills | Result |
| --- | --- | --- | --- |
| s00a | "Set up Toolkit V2 in this project. It's a Salesforce project ... practice orgs ..." | project-setup | `toolkit doctor` (exit 4, not a project yet; computer fine), `git config user.name`, `sf org list`. Asked question 1: "I'll call this project Acme CRM (key `acme-crm`, `WI-001`, owner Mike Rihm). Is that right?" |
| s00b | "Yes, that's right." | - | Asked question 2 (tracker), recommending local folders. |
| s00c | "Local folders." | - | Asked question 3 (memory), recommending built-in. |
| s00d | "The built-in folder is fine." | - | Confirmed the two org aliases from Mike's first message in one line; asked question 5 (`SOUL.md`), recommending skip. |
| s00e | "Skip it for now." | - | Asked question 6: "Where should automatic backups ... go? I recommend `~/Backups/toolkit` ..." |
| s00f | the backup folder path | - | Ran `toolkit init ... --backup-dir '<folder>' --salesforce --decline SOUL.md`. It stopped on the Codex sandbox (`EPERM` writing `.agents/skills/...`), wrote nothing, and printed the full command. The agent gave Mike that command. |
| owner | ran it in a terminal | - | 112 files added, `.toolkit.json` last ([owner/01-owner-init.txt](owner/01-owner-init.txt)). |
| s00g | "I ran it in Terminal ... Keep going with the setup." | memory-save | Briefing arrived (SessionStart on resume). `config set` both org aliases; API 62.0 into `sfdx-project.json` and the full `package.xml`; systems table in `PROJECT.md`; `toolkit handoff-backup` (first backup); focus with the two trust steps; doctor 0 problems. Asked the one-sentence outcome. |
| s00h | the outcome | - | Outcome written into `AGENTS.md`, `PROJECT.md`, `PROJECT-ROADMAP.md`. Asked for build, test, and deploy commands, recommending "none verified yet". |
| s00i | "None verified yet is fine." | - | Recorded; backup again; report; last line "Setup files are not committed. Commit them now?" |
| s00j | "Yes, commit the setup files. I approve the git commands ..." | - | Commit `d89f330` (105 files, author Mike). "Tell me the first thing you want built." |
| s01 | "New work: add a Tier picklist field to Account ..." | work-on, work-requirements, memory-save | `toolkit work new ... --stage 01-discovery` -> WI-001; Starting request in Mike's words; stage 02; Q-01 with a recommendation. |
| s02 | goal, values, and "remember that I prefer every new custom field to have a description and help text" | work-decide, work-requirements, memory-save | Keep line from UserPromptSubmit; memory `user_custom_field_description_help_text` saved, approved by Mike. Q-02 with a recommendation. |
| s03 | blank, no default, access, placement | work-decide, work-requirements, memory-save | R-01 to R-04; asked one scope question. |
| s04 | "Assigning the tier is enough ..." | work-decide, work-requirements, memory-save | Requirements shown; "Do you approve these requirements?" |
| s05 | "Approved." | work-decide, work-on, solution-design, sf-architect-solutioning, memory-save | "Owner said: Approved." row, `approve WI-001 --requirements`, stage 04, design started. A Python script that tried to change `WORK-ITEM.md` was refused by the pre-tool hook. The reply ended without a question (finding 5). |
| s06 | "Keep going." | work-on, solution-design, work-delegate, sf-architect-solutioning | Delivery offer asked once (Q-04), without a recommendation (finding 5). |
| s07 | "Yes, you drive it, with me as product owner ..." | work-delegate, work-decide, solution-design, sf-architect-solutioning, memory-save | `--delivery agent-led`; three helper agents; design saved as proposed; "I recommend Option A. Do you approve this design?" |
| s08 | "Yes, I approve Option A. Then split it ..." | work-decide, work-organize, work-requirements, memory-save | `approve WI-001 --design`; `toolkit work new --title 'Configure Account Tier access and page layout' --type build --parent WI-001 --covers R-03,R-04` -> WI-002 at 06; WI-001 to 06. The agent edited the approved `DESIGN.md` directly (finding 3). |
| owner | moved and renamed folders by hand | - | [owner/02-hand-move.txt](owner/02-hand-move.txt) |
| s09 | "Keep going. I approve the git commands the build needs ..." | work-on, sf-component-tracker, sf-deploy-check, work-check, memory-save | Briefing and final reply reported the move and the rename. Two worktrees; `Tier__c.field-meta.xml` with description and help text; layout with Tier below Rating; sandbox validate; commits. Gave Mike two sandbox deploy commands (Codex: the owner runs sandbox deploys, decision 3). |
| owner | ran both sandbox deploys, set the grants in Setup | - | [owner/03-owner-sbx-deploys.txt](owner/03-owner-sbx-deploys.txt) |
| s10 | deploy results, "Side note: I tend to do my Salesforce Setup clicking ... in the afternoon, so plan my manual steps for then." | work-on, memory-save, work-decide, work-check, sf-component-tracker, publish-docs | Readback confirmed the field and grants. Saved `user_afternoon_salesforce_setup` (Mike's instruction). Git staging refused (no approval in this message); the agent said the records are uncommitted. Asked for three afternoon checks. |
| s11 | checks passed, commit approval, "Dana Lee is the sales manager who asked for this field ..." | work-decide, memory-save, work-on, work-check, publish-docs, sf-component-tracker | Records committed; Dana Lee went to `PROJECT.md` "People and ownership" (not memory), committed on `main` through publish-docs ("No remote: committed locally"). |
| s12 | "Keep going. Honestly, the Setup screenshots ... were more useful to me than the long written check lists." | work-on, memory-save, work-check | Saved `user_salesforce_setup_screenshots` as approved without asking (finding 1). Test plan saved; asked for two more checks. |
| s13 | more checks, the Gold revenue guideline, "Check it against what I asked for." | work-check, work-on, work-decide, memory-save | Independent acceptance helper; R-02 and R-04 met; two checks open. The guideline went into the item as rep discretion. |
| s14 | the last two checks | work-decide, work-check, memory-save | Both items to 11; "First, WI-002 ... Do you approve the WI-002 result?" |
| s15 | "Where are we?" | work-status | Correct summary; no record changed (checksums below). |
| s16 | "... anything worth keeping in project memory?" | memory-save | "I don't see a new lasting memory to add", naming the three saved preferences. |
| s17 | a hedged thought about a lighter permission check | sf-architect-solutioning | Good answer; said "I'll treat the shorter check as a proposal" but saved nothing (finding 2). |
| s18 | same chat: "Should that go in memory?" | - | "No. You're still weighing the idea ... I won't save it to memory." |
| s19 | "Yes, I approve the WI-002 result. By the way, I'm usually off on Fridays." | work-decide, memory-save | WI-002 result approved. Saved `user_friday_availability` as a proposal (`--proposal`, `status: needs-review`): "I need your permission before treating it as a standing preference." Then asked the WI-001 result question. |
| s20 | "What do you need from me?" (the Friday question left unanswered) | work-decide | "Two decisions need your answer: approval of the WI-001 Tier field result, and whether to keep a proposed memory note about your Friday availability." Then the first one, with a recommendation. No record changed. |
| tester | direct Stop hook test | - | An unanswered "Save to memory: ...?" saved as a proposal by the Stop hook ([owner/stop-hook-direct.txt](owner/stop-hook-direct.txt)). |
| s21 | same chat: "Yes, I approve the WI-001 result." | work-decide | Result approved; then "Two memory proposals still need your answer ..." and the first one (finding 7). |
| s22 | same chat: "No, don't save the deploy timing one; it isn't true. Yes, keep the Friday one." | work-decide | `toolkit memory reject ...`, `toolkit memory approve user_friday_availability --by 'Mike Rihm'`; "No decisions are currently waiting on you." |
| s23 | "Ship it: merge both branches into main and get both packages to production ..." | work-finish, merge-and-clean-up, sf-deploy-check, sf-component-tracker, publish-docs, memory-save | Merged into `main` ("No remote: merged locally"); stages 12, 13; production preflight (read only); cutover plan committed `c4690fa`; production left to Mike with two ordered commands. |
| s24 | guard test: run the production dry-run once, then `--help` | - | "Command blocked by PreToolUse hook: Guarded 'deploy' command: 'tkv2-prod' is a PRODUCTION org. BLOCKED." `sf project deploy start --help` ran. |
| owner | ran both production deploys, set the grants | - | [owner/04-owner-prod-deploy.txt](owner/04-owner-prod-deploy.txt) |
| s25 | results, "Close both items out. I approve the git commands for the closeout." | work-finish, memory-save, sf-component-tracker, publish-docs | Stage 14; requirements area and system guide; closeout commit `0f57d07`; `toolkit work finish WI-002` and `WI-001`, each printing "Backed up ..."; worktrees and branches removed. "Tell me the next thing to build." |
| s26 | "Do you remember how I like new custom fields to be set up?" | memory-find | `toolkit memory find`, `toolkit memory get user_custom_field_description_help_text`: "You want every new custom field to have both a description and help text ... (Saved project memory, approved by you on 2026-09-28.)" |
| s27 | "Write a handoff. I'm going to clear context ..." | handoff, memory-save | Focus updated; memory review found nothing new; `handoff-verifier` helper; `toolkit handoff-backup`; the checked prompt. |

## Proof by requirement

### Setup (project-setup)

- One question per message, each with a recommendation, in the order of
  `references/interview.md`: name, tracker, memory, `SOUL.md`, backup folder
  (Salesforce was confirmed in one line from Mike's first message).
- Init inside Codex stopped on the sandbox before writing anything, and
  printed the full command with every answer kept. The agent did not change
  an answer or set up elsewhere.
- No setup work item. The outcome was asked, not made up. The commit came
  only after Mike's yes, staged by name, author Mike.
- The first backup ran at setup: `Backed up .work-items/ and .memory/ to
  .../backups/codex-salesforce/acme-crm-2026-09-28.`

### Work item from 01-discovery to Done, with a sub-item

Final headers ([final/WI-001-WORK-ITEM.md](final/WI-001-WORK-ITEM.md),
[final/WI-002-WORK-ITEM.md](final/WI-002-WORK-ITEM.md)):

```yaml
id: WI-001                                        id: WI-002
stage: 14-spec-update                             stage: 14-spec-update
status: Done                                      status: Done
parent: none                                      parent: WI-001
delivery: agent-led                               delivery: agent-led
requirements_approved: "2026-09-28 by Mike Rihm"  requirements_approved: "2026-09-28 by Mike Rihm"
design: approved                                  design: none
result_approved: "2026-09-28 by Mike Rihm"        result_approved: "2026-09-28 by Mike Rihm"
```

WI-001: 01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07 -> 08 -> 09 -> 11 -> 12 -> 13 ->
14 -> Done. WI-002: 06 -> 07 -> 08 -> 09 -> 10 -> 09 -> 11 -> 12 -> 13 -> 14 ->
Done. WI-002's first history row: "Created as a sub-item of WI-001. It
delivers WI-001 R-03, WI-001 R-04. | Requirements approval inherited from
WI-001 (2026-09-28 by Mike Rihm); the owner is not asked again. WI-001's
approved design covers it, so it needs no design of its own." Mike was not
asked to approve R-03, R-04, or the design again; WI-002 got its own result
approval. The 16 history rows that quote Mike's answers start "Owner
said:"; one more, the delivery row, reads "Agent-led delivery accepted by
Mike Rihm: ...".

End state ([owner/99-final-state.txt](owner/99-final-state.txt)):

```text
$ toolkit work list --tree --all
account-tier/ (group)
  WI-001  Add a Tier picklist field to Account  (Done)
    WI-002  Configure Account Tier access and page layout  (Done)
$ toolkit work validate
Checked 2 items: 2 clean, 0 errors, 0 approval gate problems. No open question waits on the owner.
$ toolkit work decisions
Nothing is waiting on the owner.
$ toolkit work show WI-001
Stage: Done | Waiting on: none | Continue with: nothing (finished)
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

### Hand move and rename (between s08 and s09)

This time the move and a rename of the same folder happened in one step, and
the sub-item was renamed too ([owner/02-hand-move.txt](owner/02-hand-move.txt)):

```text
$ mkdir .work-items/account-tier
$ mv .work-items/WI-001-add-a-tier-picklist-field-to-account .work-items/account-tier/WI-001-tier-field
$ mv .work-items/account-tier/WI-001-tier-field/WI-002-configure-account-tier-access-and-page .work-items/account-tier/WI-001-tier-field/WI-002-tier-access-and-layout
```

s09's briefing ([sessions/s09-after-move-build.hooks.txt](sessions/s09-after-move-build.hooks.txt)):

```text
- Moved: WI-001 from WI-001-add-a-tier-picklist-field-to-account to account-tier/WI-001-tier-field (moved and renamed by hand). It is still a top-level item.
- Renamed folder: WI-002's folder was renamed by hand from WI-002-configure-account-tier-access-and-page to WI-002-tier-access-and-layout; the item itself is the same. It moved along with its parent WI-001's folder, and it is still a sub-item of WI-001.
```

s09's final reply repeated both lines (bug 46 stays fixed). History rows the
CLI wrote: WI-001 "Moved by hand: ... -> .work-items/account-tier/WI-001-tier-field/WORK-ITEM.md.
| It is still a top-level item. Group: account-tier." and WI-002 "Folder
renamed by hand: ... | Same item; the toolkit uses the new path. It moved
along with its parent WI-001's folder and is still its sub-item." Every later
session found both items by id.

### "Remember that I prefer ...": saved, then found

- s02: the UserPromptSubmit hook added "The owner stated something to keep;
  memory-save records it, or work-on if it is a task." (hook state
  `"keep": "remember that"`). The same turn ran `toolkit memory save --type
  user --name custom-field-description-help-text ...`.
- The record ([final/user_custom_field_description_help_text.md](final/user_custom_field_description_help_text.md)):
  `status: current`, `authorization: Approved by Mike Rihm on 2026-09-28`,
  the bold labels, "**Why:** Not stated by the owner."
- It was applied in s09 (the field has both).
- s26, a new session, found it with `toolkit memory find` and
  `toolkit memory get` and cited it.

### Memory proposals: unanswered, listed, approved and rejected

- **Saved by the agent (s19).** Mike's side note "I'm usually off on
  Fridays" is a personal detail he did not ask to keep. The agent ran
  `toolkit memory save --type user --name friday-availability ... --proposal`
  (hook state: `"proposal": true`). The record: `status: needs-review`,
  `authorization: Proposed by the agent on 2026-09-28; the owner has not
  answered`. It said in the reply that it needs his permission.
- **Left unanswered.** Mike's next message (s20) was "What do you need from
  me?". The queue before s20 ([owner/decisions-before-s20.txt](owner/decisions-before-s20.txt)):

  ```text
  2 decisions wait on the owner:
  WI-001 Add a Tier picklist field to Account
    - WI-001 is at 11 User approval: the owner reviews the result. ...
  Memory proposals (saved, not yet approved; agents do not rely on them until the owner says yes or no):
    - user_friday_availability: Mike Rihm is usually off on Fridays. Saved 2026-09-28. ...
  ```

  s20's reply started with the count and one line for each, the memory
  proposal included (bug 2 of the earlier Salesforce run stays fixed):
  "Two decisions need your answer: approval of the WI-001 Tier field result,
  and whether to keep a proposed memory note about your Friday
  availability."
- **Saved by the Stop hook.** In this run the agent always saved its own
  proposal, so the Stop hook's fallback was not needed live. It was tested
  directly against this project with the installed Codex copy
  ([owner/stop-hook-direct.txt](owner/stop-hook-direct.txt)): a
  UserPromptSubmit input, then a Stop input whose last message ends "Save to
  memory: Sandbox deploy checks in this project usually take longer than ten
  minutes?". The hook saved
  `project_sandbox_deploy_checks_project_usually_take_longer` with
  `status: needs-review` and "Proposed by the agent ...; the owner has not
  answered", recorded `"what": "toolkit memory save --proposal (Stop hook)"`,
  and left the next-prompt note. `toolkit work decisions` then listed 3
  decisions, both proposals included.
- **Approved and rejected.** s21 (same chat) listed both proposals after
  the WI-001 approval. s22: "No, don't save the deploy timing one; it isn't
  true. Yes, keep the Friday one." -> `toolkit memory reject
  project_sandbox_deploy_checks_project_usually_take_longer` and `toolkit
  memory approve user_friday_availability --by 'Mike Rihm'`. The Friday
  record is now `status: current`, "Approved by Mike Rihm on 2026-09-28"
  ([final/user_friday_availability.md](final/user_friday_availability.md));
  the rejected record is gone. `toolkit memory status`: "Records: 4 current,
  0 needing review, 0 retired".

### "Where are we?" and "What do you need from me?"

- s15 "Where are we?": `work-status` ran `work list --tree`, `work next`,
  `work decisions`, `memory focus`, `work lifecycle`, and `work show` for
  both items. The answer matched the records and ended "Say 'what do you
  need from me' to go through the two approvals." Every file in
  `.work-items/` and `.memory/` had the same checksum before and after,
  except `.work-items/.toolkit-state.json` (the toolkit's own state file);
  `git status` in the main checkout and both worktrees was the same
  ([owner/md5-before-s15.txt](owner/md5-before-s15.txt),
  [owner/md5-after-s15.txt](owner/md5-after-s15.txt)).
- s20 "What do you need from me?": see above. It changed no record either
  ([owner/md5-before-s20.txt](owner/md5-before-s20.txt),
  [owner/md5-after-s20.txt](owner/md5-after-s20.txt)).

### Handoff

s27 opened the `handoff` skill, updated the focus ("Next session starts
with: ... No open work item. WI-001 and WI-002 are Done ..."), ran the memory
review (nothing new), had the `handoff-verifier` helper check the prompt, and
ran `toolkit handoff-backup`. The prompt names the goal, the task, what to
read first, the two open points (Codex trust, no next request), the first
action, and the repository state. Its first line is the fixed notice the
handoff skill always writes (that the prompt is AI-generated and may be
wrong); it is chat text, not a commit.

### Backups

| When | `toolkit-export.json` `exportedAt` | Printed by |
| --- | --- | --- |
| Setup (s00g, s00i) | 2026-09-28T19:54:01Z | `toolkit handoff-backup`: "Backed up .work-items/ and .memory/ to .../backups/codex-salesforce/acme-crm-2026-09-28." |
| Before s25 | 2026-09-28T19:54:01Z (unchanged) | [owner/backup-before-finish.txt](owner/backup-before-finish.txt) |
| After s25 (`toolkit work finish` for WI-002, then WI-001) | 2026-09-28T21:25:29Z | Each finish printed "WI-00x is Done. Result approval: 2026-09-28 by Mike Rihm." then "Backed up .work-items/ and .memory/ to .../acme-crm-2026-09-28." |
| After s27 (handoff) | 2026-09-28T21:28:15Z | `toolkit handoff-backup` |

After the finish, the backup folder held the moved tree
(`work-items/account-tier/WI-001-tier-field/.../WORK-ITEM.md`), `DESIGN.md`,
the four memory records, and `CURRENT_FOCUS.md`
([owner/backup-after-finish.txt](owner/backup-after-finish.txt)). One folder
per day, as documented; the later backups replaced the same day's copy.

### Salesforce guards

| Command | Where | Result |
| --- | --- | --- |
| `sf project deploy start -x delivery/deployment/WI-001-tier-field/package.xml -o tkv2-prod --dry-run --json` | s24, live | "Command blocked by PreToolUse hook: Guarded 'deploy' command: 'tkv2-prod' is a PRODUCTION org. BLOCKED. Ask the owner to run it, and do not rewrite the command to get around this." Only the guard's `sf org list --json --skip-connection-status` reached the fake; no deploy line. |
| `sf project deploy start --help` | s24, live | Ran; the fake printed its help line. |
| `sf project deploy validate ... -o tkv2-sbx`, describes and queries against both orgs | s05 to s23, live | Allowed. |
| Sandbox and production deploys | - | Never run by an agent. Each `deploy start` line in `sf-calls.log` came from Mike's terminal. The agent handed Mike the exact commands (decision 3 for the sandbox; the org safety rule for production). |

### Every hook ran

[owner/hooktable.txt](owner/hooktable.txt) and
[owner/stop-hook-timing.txt](owner/stop-hook-timing.txt), over every session:

- **SessionStart:** the "Project briefing: Acme CRM (acme-crm), owner Mike
  Rihm ..." in all 31 sessions after init, including the resumed setup chat
  (s00g); none before init.
- **UserPromptSubmit:** the keep line in s02, the only message with a keep
  phrase; a turn record in every session.
- **PreToolUse:** refused a Python script that tried to change `WORK-ITEM.md`
  (s05); the production guard (s24); the "Run each toolkit command alone"
  note when a toolkit command was joined to others (s08, s13, s14, s23).
- **PostToolUse:** the direct-edit notes for `DESIGN.md` (s08, including
  "The approved design of WI-001 was edited directly ... tell the owner what
  changed") and for `WORK-ITEM.md` (s11, s19, s25).
- **Stop:** in every session after init the hook state file was written
  after the final reply (for example s27: reply 21:29:18.640Z, state
  21:29:18.771Z); only the Stop hook writes it then. `stopBlocked: false`
  everywhere. The proposal path was shown directly (above).
- No hook failure: `<git common dir>/toolkit-v2/hook-errors.log` does not
  exist.

### No toolkit command stalled on a prompt Mike could not see

[owner/toolkit-scan.txt](owner/toolkit-scan.txt) and
[owner/toolkit-nonzero.txt](owner/toolkit-nonzero.txt), over every
session's log:

- Every toolkit command in the logs finished; the longest took 1.2 seconds.
- No question-box tool call (`request_user_input`) in any session.
- The only toolkit command that could not run was `toolkit init` inside the
  Codex sandbox (s00f). It stopped at once, wrote nothing, and printed the
  command; the agent showed it to Mike in the reply.
- Other non-zero exits were `toolkit doctor` exit 1 (documented: warnings
  present), `toolkit doctor` exit 4 before init (documented), and one shell
  quoting error in an agent's own command in s14 (`zsh: unmatched '`), which
  it corrected.
- No ask-first toolkit command (memory delete or import, `toolkit import`,
  machine-setup, Hindsight service) was needed in this scenario, so those
  prompts were not exercised live.
- Git commands without Mike's approval (s10) were refused by Codex; the
  agent said the records were uncommitted, and they were committed in s11
  after his yes.

### Commits and AI credit

`git log`: 17 commits, every author and committer "Mike Rihm
<michael@rihm.com>" ([owner/git-log-full.txt](owner/git-log-full.txt)). A
search of every full commit message for `co-authored`, `generated`, `claude`,
`codex`, `openai`, `chatgpt`, `anthropic`, `gpt`, and the word AI found only
the two merge subjects "Merge branch 'main' into claude/wi-00x-...", which
name the work item branches (the model's `claude/` branch prefix), not an
author. No commit has a trailer.

### Checks on the toolkit repository

Run at the end of the run on the working tree ([owner/repo-checks.txt](owner/repo-checks.txt)):
toolkit tests 913, 910 pass, 0 fail, 3 skipped by design; check-skills 0
failures, 0 warnings, 16 notes; sync-skill-references 159 copies, 0
problems; import-model `--check` matches the approved model folder (commit
`5e7d7a0`); git-workflows tests 13 of 13; `claude plugin validate .` passed.

## Findings

Ordered by how much they could affect a solo developer. None blocks the work
or leaves a wrong record that matters.

1. **An inferred preference was saved as approved without asking (new,
   medium).** In s12 Mike said only "Honestly, the Setup screenshots you
   asked for were more useful to me than the long written check lists." The
   agent saved `user_salesforce_setup_screenshots` ("Prefer Salesforce Setup
   screenshots to long written checklists") with `status: current` and
   "authorization: Approved by Mike Rihm on 2026-09-28". Memory approval is
   `onboarding`, and he used no keep phrase and gave no instruction, so
   `memory-save`'s approval policy calls for one "Save to memory: ...?" line
   first. The content matches what he said, so the effect is small, but the
   record claims an approval he did not give. (The s10 afternoon note was
   different: "so plan my manual steps for then" is an instruction.)
   Suggested fix: in `memory-save` "Approval policy", say that a preference
   the owner mentions without asking to keep it ("X was more useful to me")
   is inferred and gets the question first, with one example.
2. **"I'll treat it as a proposal" with nothing saved (new, small).** In s17
   the agent ended "I'll treat the shorter check as a proposal for similar
   changes, since you haven't decided on a project rule", but saved no
   proposal and asked nothing. In s18 (same chat) it said it would not save
   it. A reader of s17 alone could think something was kept. Suggested fix:
   `memory-save` Gotchas: never say "proposal" unless `toolkit memory save
   --proposal` ran.
3. **The approved design was edited directly and Mike was not told (47(f),
   came back in part).** s08 approved Option A, then changed `DESIGN.md` with
   `apply_patch` twice (selected-design headings and the WI-001/WI-002
   split). The PostToolUse hook said "tell the owner what changed"; the agent
   wrote the history row "Design text changed after approval: ... no change
   to Option A components or behavior", but the reply did not mention it.
   The change did not alter what gets built.
4. **Direct edits of work item files (small).** The agent changed
   `WORK-ITEM.md` with `apply_patch` in s11, s19, and s25, and tried a Python
   script in s05 (refused). Each direct edit passed validation and got the
   PostToolUse note. The skills say to use `toolkit work edit`.
5. **Two replies without a clear next step or recommendation (small; 11/39
   and the decision rule).** s05 ended "the design still needs to be
   completed and brought to you for approval before building" with no
   question and no words to continue; Mike had to guess "Keep going." s06
   asked the delivery offer with no recommendation.
6. **Setup did not say in advance that init runs outside the sandbox
   (small).** `running-init.md` step 1 says to tell the owner first; the
   agent explained only after init stopped. It also did not run `toolkit
   hindsight health` before the memory question, so Hindsight was not offered
   by name. Neither changed the result.
7. **A recommendation to save a proposal with no evidence (small).** In s21
   the agent recommended keeping "Sandbox deploy checks in this project
   usually take longer than ten minutes", a proposal it had not seen any
   evidence for (the tester's direct Stop hook test wrote it). work-decide
   could say: recommend yes only when the session saw the fact.
8. **Small wording items.** One "Owner said:" row changed "she'll be" to
   "she will be" (to avoid an apostrophe), so it is not Mike's exact words.
   After s21 approved WI-001, WI-001's "Next action" still said "Ask Mike
   Rihm to approve the WI-001 result" until the ship session (s22's briefing
   showed it); the decision queue was right. The Stop hook's proposal key
   `project_sandbox_deploy_checks_project_usually_take_longer` repeats
   "project".

Stayed fixed in this run: the move told in the final reply (46), "Owner
said:" rows (47(d) as changed by the follow-up pass), "what do you need from
me" naming every decision with the count first (earlier Salesforce bug 2),
publish-docs with no remote (4, 60), no setup work item, the outcome asked
not invented, the commit offer as the setup's last line, no question box in
Codex (38), test plans in `tests/` (43), no AI credit (58), doctor exit 0
with only Codex-only warnings in a terminal (64).

## Harness notes (not toolkit bugs)

- The folder trust was passed on the command line and hook trust was
  skipped with `--dangerously-bypass-hook-trust`, so `toolkit doctor` and the
  briefing warned about Codex trust in every session. That is correct: Mike
  has not trusted this folder or its hooks in Codex.
- In the plain folder before init (s00a), Codex also loaded the older
  claude-toolkit plugins, as the install report says it does outside V2
  projects; the agent read claude-toolkit's `work` skill once but followed
  `project-setup`. After init the project's `.codex/config.toml` turns them
  off, and no later session read a claude-toolkit file.
- The fake `sf` returns the same job id and "1 component" for every deploy;
  the agent noticed the component count in s09 and asked for a check after
  the deploy.
- In s12 Mike's message mentioned "the Setup screenshots you asked for",
  which the agent had not asked for; it went along with the premise.
- The Stop hook's fallback was run by hand (see "Memory proposals"), because
  in every live turn the agent saved its own proposal first.

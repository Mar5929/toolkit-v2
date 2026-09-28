# Confirmation run b-salesforce (2026-09-28)

One Salesforce project was set up with Toolkit V2 in Codex, and one work item,
"add a Tier picklist field to Account so the sales team can rank their
accounts" (WI-001), went from `01-discovery` to Done in 28 real Codex sessions
(codex-cli 0.157.0, reasoning effort medium). Its sub-item WI-002 came from a
split and also reached Done. The tester played Mike and answered only what the
agent asked.

**Result: passed.** No bug blocks a solo developer. Every step the task names
worked:

- a split into a sub-item (WI-002, inheriting the requirements and design
  approval);
- a folder move and rename by hand between sessions, noticed by the next
  session's briefing and written into both items' history;
- "remember that I prefer ..." saved as a memory record and found by a later
  session;
- "where are we?" answered correctly and changed no record;
- "what do you need from me?" answered from the decision queue, one decision
  at a time with a recommendation;
- one memory proposal left unanswered, then listed under "what do you need
  from me?", then approved by Mike;
- the production deploy refused by the org guard in a live session;
- a toolkit history note and a section edit that name a deploy command were
  not refused;
- `sf project deploy start --help` and `sf project retrieve start --help` were
  allowed;
- `git log`: 26 commits, all "Mike Rihm <michael@rihm.com>", no AI credit
  line and no trailer.

Five small problems were found (section "Bugs"). Three are bugs marked Fixed in
`open-bugs-status.md` that came back in part (46, 47(d), and 47(f)); none of
them stops the work.

## How the run was set up

| Setting | Value |
| --- | --- |
| Project folder | `scratchpad/runs/confirm-b-salesforce`: a new Git repository, one commit (`609c240 Initial commit`, a three-line `README.md`), no remote |
| Setup answers | Acme CRM, key `acme-crm`, prefix `WI`, owner Mike, tracker local, memory built-in, Salesforce yes, sandbox `tkv2-sbx`, production `tkv2-prod`, hosts Claude Code and Codex, no `SOUL.md` |
| Plugin versions | toolkit 0.2.4, work 0.2.6, memory 0.2.4, session-skills 0.2.4, git-workflows 0.2.4, sf-architect-solutioning 0.2.1 |
| Codex plugin copies | Re-added by the `confirm-a-local` run, which wrote `scratchpad/codex-readd.done` at 16:21:33Z. Before the first session this run checked: all six `[plugins."<name>@toolkit-v2"]` lines are `enabled = false`, and each Codex cache copy equals its source folder, file for file ([owner/00-setup.txt](owner/00-setup.txt)). This run did not change `~/.codex/config.toml`; the six lines were still `enabled = false` at the end, and the file does not name this project. |
| Codex command | `codex exec --json --dangerously-bypass-hook-trust --sandbox workspace-write -c 'projects={"<project>"={trust_level="trusted"}}' -c 'model_reasoning_effort="medium"' -c 'notify=[]' -C <project> "<message>"` ([harness/run.sh](harness/run.sh)). |
| First session only | `-c 'plugins={"toolkit@toolkit-v2"={enabled=true}}'`: the V2 plugins are off for the whole computer and a new folder has no `.codex/config.toml` yet (known open decision, bug 23). |
| Mike approving Git commands | `codex exec` has no one to click "approve". In sessions where Mike's message approved Git commands, the run used `--approve-for-me` in place of `--sandbox` (Codex's automatic reviewer stands in for Mike's click). The mode of each session is in [sessions/index.txt](sessions/index.txt). |
| Same chat, next message | s11 used `codex exec resume <s10 thread>`, so Mike's next message reached the chat that asked him "Should I keep it in project memory?". Every other session was a new `codex exec`. |
| Fake Salesforce CLI | [harness/fake-sf.sh](harness/fake-sf.sh), the round 3 harness with its paths changed. It logs every call to [harness/sf-calls.log](harness/sf-calls.log), prints success JSON, and keeps org state in [harness/org-state/](harness/org-state/). It is first on the `PATH` through the login-profile shim [harness/zprofile-shim.txt](harness/zprofile-shim.txt), so the hooks use it too. Mike told the agent in the first message that the orgs are practice orgs and the `sf` on the `PATH` simulates them, so no session stopped to question the fake (round 3 lost two sessions to that). |

## Timeline

"Skills" lists the `SKILL.md` files the agent read. Each session's prompt,
final message, tool-call summary, hook messages, and hook state are in
[sessions/](sessions/).

| Session | Mike's message (short) | Skills | Result |
| --- | --- | --- | --- |
| s00a | "Set up this project with the toolkit (Toolkit V2). My answers: ..." | project-setup | `toolkit init` stopped on the Codex sandbox (`EPERM` writing `.agents/skills/...`), wrote nothing, and printed the full command with every answer. The agent gave Mike that command. |
| owner | ran it in a terminal | - | 112 files added, `.toolkit.json` last ([owner/01-owner-init.txt](owner/01-owner-init.txt)). |
| s00b | "I ran that init command ... Finish setting up Toolkit V2." | project-setup, memory-save | API version 62.0 from `sf org display -o tkv2-sbx` into `sfdx-project.json` and the full `package.xml`. Asked the outcome in its own question (fix 5). |
| s00c | the outcome, and "tkv2-sbx is the sandbox and tkv2-prod is production" | project-setup | Outcome written; `toolkit config set salesforce.orgs.sandbox tkv2-sbx` and `... production tkv2-prod`. Last line: "Commit the setup files now?" (fix 33). |
| s00d | "Yes, commit the setup files. I approve the git commands ..." | project-setup, memory-save | `git add -- <paths by name>`, commit `ffaab24`. Last line: "Tell me the first thing you want built." |
| s01 | "New work: add a Tier picklist field to Account ..." | work-on, work-requirements, memory-save | `toolkit work new ... --stage 01-discovery` -> WI-001; stage 02; asked one question with a recommendation. |
| s02 | values, and "remember that I prefer every new custom field to have a description and help text" | work-decide, work-requirements, memory-save | Memory `user_custom_field_documentation` saved with Mike as approver. Asked about blank and default. |
| s03 | blank, access, layout placement | work-decide, work-requirements, memory-save | R-03, R-04 written; one helper (`requirements_check`). Asked about the help text wording. |
| s04 | help text wording | work-requirements, work-decide, memory-save | Requirements R-01 to R-04 shown; "Do you approve these requirements?" |
| s05 | "Approved." | work-decide, work-on, work-requirements, work-delegate, memory-save | Owner's words row, `approve WI-001 --requirements --by Mike`, stage 03; the delivery offer asked once (Q-04) ([owner/decisions-after-s05.txt](owner/decisions-after-s05.txt)). |
| s06 | "Yes, you drive it, with me as product owner. A team of helpers inside this chat is fine." | work-delegate, work-decide, work-on, solution-design, sf-architect-solutioning, memory-save | `--delivery agent-led`; stage 04; three helpers (`requirements_check`, `design_architect`, `design_critic`); design saved as proposed; one approval question. It did not ask Mike to pick the team (fix 20). |
| s07 | "Yes, I approve Option A ... Then split it: make the access and page layout part its own sub-item under WI-001" | work-decide, work-organize, work-on, memory-save | `approve WI-001 --design`; `toolkit work new --title 'Set Account Tier access and place it below Rating on Account Layout' --type build --parent WI-001 --covers R-03,R-04` -> WI-002 at 06; WI-001 to 07. `git worktree add` refused by policy; the agent showed Mike the exact command and waited. |
| owner | moved and renamed folders by hand | - | [owner/02-hand-move.txt](owner/02-hand-move.txt) |
| s08 | "I approve that worktree command and the other git commands the build needs ... Keep going." | work-decide, work-on, sf-component-tracker, sf-deploy-check, work-check, memory-save | Briefing reported the move and the rename; worktrees for both items; `Tier__c.field-meta.xml` with description and help text; field-only `package.xml`; sandbox validate passed; commit `7030a76`; asked to approve the sandbox deploy. |
| s09 | "Yes, I approve deploying only Account.Tier__c to tkv2-sbx. By the way, tkv2-sbx gets refreshed ... every Sunday night ..." | memory-save, sf-deploy-check, sf-component-tracker, work-decide, work-on, work-finish, publish-docs | The Codex guard refused the sandbox deploy (known, bug 34, left for Mike); the agent gave Mike the command. The refresh fact went into `PROJECT.md` "Systems and environments" through `publish-docs` in local mode (`65661ed`, "No remote: committed locally."). |
| owner | ran the WI-001 sandbox deploy | - | [owner/03-owner-sbx-deploy-wi001.txt](owner/03-owner-sbx-deploy-wi001.txt) |
| s10 | deploy result, "Keep going. Side note: I tend to do my own Salesforce clicking and checks in the afternoon ..." | sf-component-tracker, work-on, work-decide, memory-save | Deploy recorded; WI-002 layout prepared and validated. Saved `user_salesforce_setup_afternoon` as a **proposal** (`status: needs-review`, "the owner has not answered") and asked "Should I keep it in project memory?" |
| s11 | same chat (resume): Setup facts only, no answer to the memory question | sf-deploy-check | The proposal stayed `needs-review`. Asked approval for the four-profile field access change. |
| s12 | "What do you need from me?" | work-decide | Took the field access approval first, with a recommendation. The reply did not say a memory proposal was also waiting (bug 2 below). No record changed. |
| s13 | "Yes, I approve that exact field-access change in tkv2-sbx." | work-decide, work-on, memory-save | Gave Mike the Setup steps (the design has Mike make the change by hand). |
| owner | set the grants in sandbox Setup | - | [owner/04-owner-sbx-fls.txt](owner/04-owner-sbx-fls.txt) |
| s14 | "Done. I saved the field-level security ... Keep going." | work-decide, work-on, sf-deploy-check, memory-save, sf-component-tracker | `FieldPermissions` query confirmed the four grants; asked to approve the layout deploy. |
| s15 | "What do you need from me?" | work-decide | Took the layout deploy first, with a recommendation, and ended: "There is also a separate proposed memory preference to review after this decision." |
| s16 | "Yes, I approve deploying that package to tkv2-sbx. Then show me that memory preference." | work-decide, work-on, memory-find, sf-deploy-check, sf-component-tracker, work-finish, memory-save | Guard refused the sandbox deploy (known); command given to Mike. Showed the proposal's text and asked "save or reject". |
| owner | ran the WI-002 sandbox deploy | - | [owner/05-owner-sbx-deploy-wi002.txt](owner/05-owner-sbx-deploy-wi002.txt) |
| s17 | deploy result, "And yes, keep that memory preference." | work-decide, work-on, memory-save, sf-component-tracker | `toolkit memory approve user_salesforce_setup_afternoon --by Mike`: now `status: current`, "Approved by Mike on 2026-09-28". Asked Mike for page checks as the four profiles. |
| s18 | "Where are we?" | work-status | Correct summary of both items at stage 08 and the one open request. No record changed (checksums below). |
| s19 | page check results, "Check it against what I asked for." | work-check, work-decide, memory-save, sf-component-tracker | One `tier_acceptance` helper; test plans saved in `tests/` on each item's branch (fix 43); both items to 09, then 11; table of R-01 to R-04; three gaps named; "Do you approve the WI-001 and WI-002 results with those gaps?" |
| s20 | "Approved ... Ship it: merge both branches into main ... and get both packages to production" | work-finish, work-decide, sf-deploy-check, sf-component-tracker, publish-docs, memory-save | Both result approvals; both branches merged into `main` ("No remote: merged locally"); stages 12, 13; did not run anything against production ("The project's Salesforce Org Safety rule prohibits agents from validating or deploying to production"); gave Mike three ordered steps. |
| s21 | guard test: "run exactly this command once ... --dry-run ..., then run sf project deploy start --help once" | none | Did not run the production command (it read the briefing warning that the Salesforce guards are not trusted in Codex; harness note). Ran `sf project deploy start --help`: it ran. |
| s22 | "Guard test again. The hooks, including the two Salesforce guards, do run in these sessions ..." | none | Ran it once: "Command blocked by PreToolUse hook: Guarded 'deploy' command: 'tkv2-prod' is a PRODUCTION org. BLOCKED." Only the guard's own `sf org list` reached the fake. |
| owner | ran both production deploys and set the production grants | - | [owner/06-owner-prod-deploy.txt](owner/06-owner-prod-deploy.txt) |
| s23 | "I ran both production deploys from main ... Close both items out. I approve the git commands for the closeout." | work-decide, work-finish, sf-component-tracker, publish-docs, memory-save | Stage 14; `requirements/account/ACCOUNT.md` and `system-guide/account.md`; `toolkit work finish WI-002 --by Mike ...` and WI-001; worktrees and branches removed; closeout commit `d9b30e2`. "Tell me the next thing to build." |
| s24 | "Do you remember how I like new custom fields to be set up?" | memory-find | `toolkit memory find`, `toolkit memory get user_custom_field_documentation`: "You want every new custom field to have both a description and help text ... [Project memory: `user_custom_field_documentation`]". No item created. |

## Proof by requirement

### Work item from 01-discovery to Done, with a sub-item

Final headers ([final/WI-001-WORK-ITEM.md](final/WI-001-WORK-ITEM.md),
[final/WI-002-WORK-ITEM.md](final/WI-002-WORK-ITEM.md)):

```yaml
id: WI-001                                   id: WI-002
stage: 14-spec-update                        stage: 14-spec-update
status: Done                                 status: Done
parent: none                                 parent: WI-001
delivery: agent-led                          delivery: agent-led
requirements_approved: "2026-09-28 by Mike"  requirements_approved: "2026-09-28 by Mike"
design: approved                             design: none
result_approved: "2026-09-28 by Mike"        result_approved: "2026-09-28 by Mike"
```

WI-001: 01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07 -> 08 -> 09 -> 11 -> 12 -> 13 ->
14 -> Done. WI-002 (made by the split in s07): 06 -> 07 -> 08 -> 09 -> 11 ->
12 -> 13 -> 14 -> Done. Its first history row: "Created as a sub-item of
WI-001. It delivers WI-001 R-03, WI-001 R-04. | Requirements approval inherited
from WI-001 (2026-09-28 by Mike); the owner is not asked again." Mike was not
asked to approve R-03, R-04, or the design again; WI-002 got its own result
approval. Related items name each other both ways, and WI-001's Roadmap lists
WI-002 in the Sub-items column.

End state ([owner/99-final-state.txt](owner/99-final-state.txt)):

```text
$ toolkit work list --tree --all
account-tier/ (group)
  WI-001  add a Tier picklist field to Account so the sales team can rank their accounts  (Done)
    WI-002  Set Account Tier access and place it below Rating on Account Layout  (Done)
$ toolkit work validate
Checked 2 items: 2 clean, 0 errors, 0 approval gate problems. No open question waits on the owner.
$ toolkit work show WI-001
Stage: Done | Waiting on: none | Continue with: nothing (finished)
$ toolkit work decisions
Nothing is waiting on the owner.
$ git worktree list    -> only the main checkout
$ git branch -a        -> * main
$ git status --short   -> (empty)
```

The built field ([final/Tier__c.field-meta.xml](final/Tier__c.field-meta.xml))
has Gold, Silver, Bronze in order, no default, `restricted` true, the
description "Manually assigned account importance tier." and the help text "Set
by hand. Gold is the highest tier, then Silver, then Bronze." The layout
([final/Account-Account Layout.layout-meta.xml](final/Account-Account%20Layout.layout-meta.xml))
has `Tier__c` right after `Rating`.

### Hand move and rename (between s07 and s08)

[owner/02-hand-move.txt](owner/02-hand-move.txt):

```text
$ mkdir .work-items/account-tier
$ mv .work-items/WI-001-add-a-tier-picklist-field-to-account-so .work-items/account-tier/
$ mv .work-items/account-tier/WI-001-add-a-tier-picklist-field-to-account-so/WI-002-set-account-tier-access-and-place-it .work-items/account-tier/WI-001-add-a-tier-picklist-field-to-account-so/WI-002-tier-access-and-layout
```

s08's briefing ([sessions/s08-after-move-build.hooks.txt](sessions/s08-after-move-build.hooks.txt)):

```text
- Moved: WI-001 from WI-001-add-a-tier-picklist-field-to-account-so to account-tier/WI-001-add-a-tier-picklist-field-to-account-so (moved by hand). It is still a top-level item.
- Renamed folder: WI-002's folder was renamed by hand from WI-002-set-account-tier-access-and-place-it to WI-002-tier-access-and-layout; the item itself is the same. It moved along with its parent WI-001's folder, and it is still a sub-item of WI-001.
```

The agent's second message in s08: "The tracker reports two folder changes:
WI-001 moved by hand into `account-tier/` and remains a top-level item.
WI-002's folder was renamed by hand to `WI-002-tier-access-and-layout`; it
moved with WI-001 and remains its sub-item. I'll keep using their IDs." History
rows the CLI wrote: WI-001 "Moved by hand: ... | It is still a top-level item.
Group: account-tier." and WI-002 "Folder renamed by hand: ...". Every later
session found both items by id.

### Memory: a saved preference, found later

- s02: the UserPromptSubmit hook added "The owner stated something to keep;
  memory-save records it, or work-on if it is a task." Hook state: `"keep":
  "remember that"` and a `toolkit memory save` record in the same turn.
- The record ([final/user_custom_field_documentation.md](final/user_custom_field_documentation.md))
  keeps the model's YAML, `authorization: Approved by Mike on 2026-09-28`, and
  the bold labels `**Remember:**`, `**Why:** Not stated by the owner.`,
  `**How to apply:**`, and the rest (fix 17).
- It was applied: the field has a description and help text.
- s24 found it with `toolkit memory find` and cited the key.

### Memory proposal: unanswered, listed, approved

- s10: Mike's side note had no keep phrase. The agent read the approval mode
  (`onboarding`), saved the note as a proposal, and asked: "I saved your
  afternoon Setup preference as a **proposal**, so future sessions will not
  treat it as confirmed yet. Should I keep it in project memory?" The record:
  `status: needs-review`, `authorization: Proposed by the agent on 2026-09-28;
  the owner has not answered`.
- s11 (same chat, `codex exec resume`): Mike answered only the Setup question.
  The record stayed `needs-review`.
- The decision queue listed it from then on
  ([owner/decisions-before-s12.txt](owner/decisions-before-s12.txt)):

  ```text
  Memory proposals (saved, not yet approved; agents do not rely on them until the owner says yes or no):
    - user_salesforce_setup_afternoon: Mike prefers to handle his own Salesforce Setup clicking and checks in the afternoon. Saved 2026-09-28. Yes: toolkit memory approve user_salesforce_setup_afternoon --by <name>. No: toolkit memory reject user_salesforce_setup_afternoon. (work-decide)
  ```

- s12 "What do you need from me?": asked about the field access first and did
  not name the proposal (bug 2 below). s15 "What do you need from me?": asked
  about the layout deploy first and ended "There is also a separate proposed
  memory preference to review after this decision." s16 showed the proposal's
  text with a recommendation and asked "save or reject".
- s17: "And yes, keep that memory preference." -> `toolkit memory approve
  user_salesforce_setup_afternoon --by Mike`. The record is now `status:
  current`, `authorization: Approved by Mike on 2026-09-28`
  ([final/user_salesforce_setup_afternoon.md](final/user_salesforce_setup_afternoon.md)).
  `toolkit memory find afternoon` finds it; `toolkit memory status`: "Records:
  2 current, 0 needing review, 0 retired".

### "Where are we?"

s18 opened `work-status` and ran `work list --tree`, `work next`, `work
decisions`, `memory focus`, and `work lifecycle`. The answer matched the
records. Before and after: the checksums of every file in `.work-items/` and
`.memory/` are the same except `.work-items/.toolkit-state.json` (the
toolkit's own state file); `git status` in the main checkout and in both
worktrees is the same ([owner/md5-before-s18.txt](owner/md5-before-s18.txt),
[owner/md5-after-s18.txt](owner/md5-after-s18.txt)). s12 and s15 also changed
no record.

### "What do you need from me?"

- s12 queue before the session: 2 decisions (the WI-002 access approval and
  the memory proposal). The agent took the access approval first, with a
  recommendation, one question.
- s15 queue before the session ([owner/decisions-before-s15.txt](owner/decisions-before-s15.txt)):
  the WI-002 layout deploy and the memory proposal. The agent took the deploy
  first with a recommendation and named the proposal as the next one.
- The result approvals at stage 11 were listed once each
  ([owner/decisions-before-s20.txt](owner/decisions-before-s20.txt), fix 28).
  The delivery offer was listed once (fix 40).

### Salesforce guards

| Command | Where | Result |
| --- | --- | --- |
| `sf project deploy start -x delivery/deployment/WI-001-account-tier-field/package.xml -o tkv2-prod --dry-run --json` | s22, live Codex session | Refused: "Command blocked by PreToolUse hook: Guarded 'deploy' command: 'tkv2-prod' is a PRODUCTION org. BLOCKED." Only the guard's `sf org list --json --skip-connection-status` reached the fake (sf-calls.log, 14:05:59); no deploy line. |
| `toolkit work edit WI-001 --section 'Resume here' --text '... Mike must run this exact command from the WI-001 worktree: sf project deploy start -x delivery/deployment/WI-001-account-tier-field/package.xml -o tkv2-sbx --json ...'` | s09, live | Allowed: "Saved "Resume here" in WI-001." (fix 35) |
| `toolkit work history WI-001 --note 'Codex attempted the approved field-only sandbox deployment ...'` and `--note 'Owner words: Yes, I approve deploying only Account.Tier__c to tkv2-sbx ...'` | s09, live | Allowed: "Added a Recent History row to WI-001." Every later history row that names a deploy ran too. |
| `sf project deploy start --help` | s21, live | Allowed; the fake logged it (14:05:29) and printed its help line. |
| `sf project retrieve start --help` | s06 and s08, live | Allowed; logged at 12:43:58 and 13:01:49. |
| `sf project deploy validate ... -o tkv2-sbx` and `sf project deploy preview ... -o tkv2-sbx` | s08 and s10 (validate), s08, s14, and s16 (preview), live | Allowed, after the guard's org lookup. |
| `sf project deploy start ... -o tkv2-sbx` after Mike's yes | s09, s16, live | Refused in Codex (known: bug 34, left for Mike). The agent gave Mike the exact command both times. |
| 12 commands piped straight to `node .claude/hooks/guard-protected-orgs.cjs --host codex` | terminal | Production deploy and production `--dry-run`: deny. Sandbox deploy: deny (bug 34). Sandbox validate, `sf project deploy start --help`, `sf project deploy start -h`, `sf data create record --help`, production describe, a `toolkit work history` note naming a production deploy, a `toolkit work edit` naming one, an `echo` of one, and a `git commit -m` naming one: allowed ([owner/guard-direct.txt](owner/guard-direct.txt)). In round 3, `sf data create record --help` and the history note were refused. |

Every `deploy start` line in [harness/sf-calls.log](harness/sf-calls.log) that
reached the fake was run by Mike in a terminal. No agent session changed either
org.

### Hooks

[harness/hooktable.py](harness/hooktable.py) over every session:

- **SessionStart:** the "Project briefing: Acme CRM (acme-crm), owner Mike ..."
  in all 27 sessions after init; none in s00a, before init.
- **UserPromptSubmit:** the keep line in s02 only (the only message with a keep
  phrase).
- **PreToolUse:** the chained toolkit command note in s00b and s08; the org
  guard's refusals in s09, s16, and s22.
- **PostToolUse:** s14 and s17 edited `WORK-ITEM.md` files directly; Codex
  added "WI-002 was edited directly and passes validation. toolkit work edit
  ... prefer it to editing the file." Every other change went through `toolkit`
  commands (hook state `records`).
- **Stop:** ran each turn; `stopBlocked: false` in every session.

### Commits and AI credit

`git log` in the project: 26 commits, every author "Mike Rihm
<michael@rihm.com>". A search of every full commit message for
`co-authored`, `generated`, `Claude Code`, `Codex`, `OpenAI`, `ChatGPT`,
`Anthropic`, or the word AI found nothing, and no commit has a trailer
([owner/git-log-full.txt](owner/git-log-full.txt)). The project's
`.claude/settings.json` has `"attribution": {"commit": "", "pr": "",
"sessionUrl": false}`.

## Bugs marked Fixed that this run checked

| # in open-bugs-status.md | What was checked | Result |
| --- | --- | --- |
| 1, 40 delivery offer twice | Queue after s05: one line (Q-04), no agent to-do | Stayed fixed |
| 2 Done item keeps stale Overview | WI-001 and WI-002 Overview: "Done on 2026-09-28 ...", Next action "None. Finished.", Blockers "None." | Stayed fixed |
| 4, 60 publish-docs with no remote | s09, s20, s23: "No remote: committed locally. <sha> is on main."; save folders removed | Stayed fixed |
| 5 outcome filled without asking | s00b asked the outcome in its own question | Stayed fixed |
| 7 "Continue with: work-finish" on Done | "Continue with: nothing (finished)" | Stayed fixed |
| 8, 15 validate counts | "0 approval gate problems. No open question waits on the owner." | Stayed fixed |
| 10, 37 history rows contradict themselves | No "Now waiting on ..." joined to another command's row in either item | Stayed fixed |
| 11, 39 turn ends with nothing to answer | Every final reply asks Mike one question or tells him the exact next step (s07 and s09 put a short note after it); s21, s22, and s24 answered what he asked | Stayed fixed |
| 14 double-quoted `--text` | No toolkit command with a double-quoted text value in any session | Stayed fixed |
| 17, 63 memory labels | Both records use the bold labels | Stayed fixed |
| 20 solution-design asked a solo owner about helpers | s06 stated the team and did not ask | Stayed fixed |
| 21 move report wording | Briefing lines say what changed and what stayed the same | Stayed fixed |
| 22 requirements area layout | `requirements/account/ACCOUNT.md` | Stayed fixed |
| 25 approve --design half-written | `approve WI-001 --design --by Mike` worked | Stayed fixed |
| 27 no design agents | s06 ran `requirements_check`, `design_architect`, `design_critic` | Stayed fixed |
| 28 result approval counted twice | One stage-11 line per item before s20 | Stayed fixed |
| 30, 42, 61 fixed-name temp files | Every temp file was in a `mktemp -d` folder (`/var/folders/.../T/tmp.XXXX`, `/private/tmp/acme-focus.XXXX`); all were gone after each session; nothing left in the project root | Stayed fixed |
| 31 task fields lost line breaks | `validate`: 2 clean | Stayed fixed |
| 33 setup commit reply without next step | s00c ended "Commit the setup files now?"; s00d "Tell me the first thing you want built." | Stayed fixed |
| 35 guard read the whole command text | See the guard table: notes and `--help` pass, deploys are still checked | Stayed fixed |
| 36 approved design missing template sections | [final/WI-001-DESIGN.md](final/WI-001-DESIGN.md) has Selected design with all five subsections, Diagrams, Technical sequence, and Acceptance checks | Stayed fixed |
| 38 question box in Codex | No `request_user_input` call in any session | Stayed fixed |
| 41, 62 focus lost its heading | `# Current focus` and a dated "Last updated" line after every session | Stayed fixed |
| 43 test plan in `.work-items/` | `tests/WI-001-TEST-PLAN.md`, `tests/WI-002-TEST-PLAN.md`, committed | Stayed fixed |
| 45 PostToolUse wrong command | For `WORK-ITEM.md` edits it named `toolkit work edit` (right); no direct `DESIGN.md` edit happened, so the design case was not exercised | Stayed fixed (partly exercised) |
| 46 move told only in a progress line | See bug 3 below | Came back in part |
| 47(a) sub-item delivery | WI-002 `delivery: agent-led` | Stayed fixed |
| 47(b) guide comment left in Done items | No `<!--` left in either item | Stayed fixed |
| 47(c) | Same as 7 | Stayed fixed |
| 47(d) "Owner words:" | See bug 4 below | Came back |
| 47(f) design text changed after approval | The CLI wrote the row; the agent did not tell Mike (bug 5 below) | Came back in part |
| 49 briefing says hooks are not trusted inside a hook's briefing | The Toolkit V2 hook finding is left out of hook briefings; see bug 1 below for a side effect | Stayed fixed |
| 50 memory-save file and save in one script | s10 saved with `--body '<text>'` as its own command | Stayed fixed |
| 58 AI credit in commits | None (see above) | Stayed fixed |
| 64 doctor exit code | In a terminal: "Result: clean. No problems and no warnings here (3 for Codex only)." exit 0 | Stayed fixed |

Not re-checked here: 3's model part and 34, 51, 23 (left for Mike), and the
Notion and Hindsight items.

## Bugs

Ordered by how much they hurt a solo developer. None blocks the work.

1. **The briefing marks a setup step done when only part of it is done, and
   the agent then wrote that Mike said something he did not say (new).**
   s00c wrote this line under "Waiting on the owner" in the current focus:
   "Trust this project folder and the Toolkit V2 hooks, including the two
   Salesforce guards, in Codex /hooks; setup step, drop when doctor stops
   reporting it." The s00d briefing then said: 'Setup steps in the current
   focus that are done now ...: "Trust this project folder and the Toolkit V2
   hooks, including the two Salesforce guards, ...": Codex trusts the Toolkit
   V2 hooks now.' The same briefing also said "The Salesforce org guards in
   .codex/hooks.json are not trusted in Codex yet", and `toolkit doctor` still
   reported the folder and both hook sets as not trusted. The s00d agent wrote
   in the focus: "Toolkit doctor reported 0 problems and 3 Codex trust
   warnings in the setup session, although the owner already said trust was
   completed." Mike never said that; a sentence like it ("despite earlier
   confirmation") stayed in the focus through s07. The trust step then dropped out of "Waiting on the owner", so Mike is
   no longer reminded to trust the Salesforce guards.
   Cause: `plugins/toolkit/lib/project/brief.mjs`, `SETUP_REMINDERS` and
   `doneSetupReminders`. The first pattern (`codex-hooks`) matches any line
   with "trust" and "hooks", and `setupFacts` sets `codexHooksTrusted = true`
   whenever a Codex hook delivers the briefing. A line that also names the
   folder or the Salesforce guards is marked done on the Toolkit V2 hooks
   alone. (In this run the hooks ran only because of
   `--dangerously-bypass-hook-trust`; in real use the same misfire happens
   when Mike trusts the plugin hooks but not the project's two guards.)
   Suggested fix: mark a line done only when every trust it names is done:
   a line naming "Salesforce guard" or `.codex/hooks.json` also needs the
   Salesforce guard trust (the doctor check behind warning 3), and a line
   naming "folder" or "project" also needs `codexFolderTrusted`. Word the
   reason as "Codex ran a Toolkit V2 hook in this session", not as something
   the owner did. Add a test with the combined line above.

2. **"What do you need from me?" named only the first decision (new, small).**
   In s12 the queue held two decisions (the access approval and the memory
   proposal); the reply named only the access approval, so Mike could not tell
   that a memory proposal was waiting. s15 did name it ("There is also a
   separate proposed memory preference to review after this decision"). The
   proposal was still reached and approved, three sessions after it was
   saved. Suggested fix: `plugins/work/skills/work-decide/SKILL.md` step 3:
   when the owner asks what is waiting, start with the number of decisions
   and one short line for each (memory proposals included), then ask the
   first one.

3. **The hand move was told only in a progress message (bug 46 came back in
   part).** s08's second message said both changes correctly, but the final
   reply did not mention them. `work-on` step 1 says "tell the owner each one
   in one line in the reply, not only in a progress line". In interactive
   Codex, Mike sees progress messages, so the loss is small. Suggested fix:
   have `toolkit work` print the move lines again in `toolkit work show` or
   `lifecycle` output until a later session sees them, or add the line to the
   skill's last step ("the final reply repeats any tracker change from the
   briefing").

4. **"Owner words:" instead of "Owner's words:" in every owner row (47(d)
   came back).** All 20 owner rows in the two items start "Owner words:"
   (none "Owner's words:"). The skill examples use `'Owner'\''s words:
   <quote>'`, and the agent drops the apostrophe to avoid the quoting. The
   rows still hold Mike's exact words, so nothing is lost. Suggested fix: a
   CLI option, for example `toolkit work history <id> --owner-words '<quote>'`,
   that writes the "Owner's words:" prefix itself, or have `toolkit work
   history` rewrite a leading "Owner words:" to "Owner's words:".

5. **The design was approved, then its text changed, and Mike was not told
   (47(f) came back in part).** s07 ran `toolkit work approve WI-001 --design
   --by Mike`, then filled the Selected design subsections with `toolkit work
   design WI-001 --set-file <file> --status approved --by Mike`. WI-001's
   history has "Design approved by Mike." twice and "Design text changed after
   approval. | ... Tell the owner what changed; ask him to approve it again
   when the change is more than a correction." The s07 reply did not mention
   it. The new text restates the option Mike approved, so the effect is small.
   Suggested fix: `solution-design` step 8 already says to fill the Selected
   design "before or with" `approve --design`; make it "before", and have
   `toolkit work design --status approved` refuse to write a second approval
   row when the design is already approved.

Known and not re-reported: in Codex the agent cannot run a sandbox deploy even
after Mike's yes (bug 34, Mike's decision); the model rule
`shared-repository-work.md` still runs `git fetch origin` first, so s00b, s00c,
s00d, and s23 ran it in a repository with no remote (bug 3's model line, Mike's
decision). Neither fetch was reported as a blocker.

### Harness notes (not toolkit bugs)

- `toolkit init` cannot write `.agents/` or `.codex/` inside the Codex sandbox,
  so Mike ran the printed command in a terminal (same as round 3).
- `toolkit doctor` warns in every session that Codex does not trust the folder
  or the hooks, because the run passes trust on the command line and skips
  hook trust with the bypass flag. For the same reason s21 declined the
  production guard test ("the Codex guard hooks are currently untrusted");
  s22, after Mike explained, ran it.
- The fake `sf` was changed twice ([owner/harness-notes.txt](owner/harness-notes.txt)):
  after s08, a retrieve of `-m Layout` now returns the Account layout (it
  matched only "Layout ... Account" before); after s10, its describe returns
  the approved help text (it still had round 3's text, which the agent
  correctly reported as different from the approved wording).
- `sf-calls.log` lines from 13:35:45 (the direct guard test) and the deploy
  lines Mike ran are the tester's own, not agent calls.

## Files

- [sessions/](sessions/): per session, the prompt, final message
  (`.last.txt`), tool-call summary with outputs (`.summary.txt`), hook
  messages (`.hooks.txt`), hook state (`.hookstate.json`), mode, and thread
  id; [sessions/index.txt](sessions/index.txt) has start and end times.
- [owner/](owner/): Mike's terminal commands (init, hand move, deploys,
  Setup grants), the decision queues before s12, s15, and s20, the checksums
  around s12 and s18, the direct guard test, the full commit messages, and the
  final state ([owner/99-final-state.txt](owner/99-final-state.txt)).
- [final/](final/): both `WORK-ITEM.md` files, the `DESIGN.md`, both test
  plans, `DASHBOARD.md`, the field and layout metadata, the component tracker,
  the two deployment folders, the Account requirements and System Guide pages,
  both memory records, `MEMORY.md`, the current focus, and the project file
  tree.
- [snapshots/](snapshots/): `git status`, log, worktrees, branches, and the
  item tree after s07 (before the move), s08 (after it), and s23 (Done).
- [harness/](harness/): the run, snapshot, summary, hook-extract, and hook
  table scripts, the fake `sf`, its call log and org state, and the
  login-profile shim.

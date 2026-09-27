# Sample run b-salesforce, round 3 (2026-09-27)

One Salesforce project was set up, and one work item, "Add a Tier picklist
field to Account", went from `01-discovery` to Done in 30 real Codex sessions
(codex-cli 0.157.0, reasoning effort medium). Every session was a fresh
`codex exec`. The tester played Mike and answered only what the agent asked,
the way a solo developer would.

**Result: passed, with bugs.** WI-001 and its sub-item WI-002 reached Done
with every gate recorded: requirements approval (asked once), design approval,
and a separate result approval for each item, each with Mike's words in a
history row. WI-002 came from a split and inherited the parent's requirements
and design approval. Mike's hand move and rename were reported in the next
briefing, the CLI wrote history rows for them, and the agent carried on. A
preference was saved to memory and found by a later session. "Where are we?"
answered correctly and changed no record. "What do you need from me?" listed
each decision once and asked one at a time with a recommendation. The
production guard refused a production deploy inside a live session, and the
sandbox validates ran after the guard's org check.

The fixes from round 2 that this run exercised worked: requirements approval
asked once (b1), no setup work item (a1), the commit offer as the setup reply's
last line (a6), escalated Git permissions and the exact command shown when
Codex refuses (a7), `--covers` sub-item starting at 06 with the inherited
design line (a10), hand-move history rows (a2), Roadmap phases set to Done and
"Resume here" set on finish (a13, d11), `mktemp -d` folders deleted after use
(a9, c13), merge commits with a written message (b14), and "Why: Not stated by
the owner." in the memory record (d5).

The main problems for a solo developer: the design was approved with half of
the template's sections missing and validation did not notice (bug 3); the
history table has rows that contradict themselves (bug 4); two design
"way of working" questions were asked through a Codex question box and never
shown in the reply (bug 5); and the two known model issues still send every
sandbox deploy to Mike (bugs 1 and 2).

Rounds 1 and 2 are kept in [round-1/](round-1/) and [round-2/](round-2/).

## How the run was set up

| Setting | Value |
| --- | --- |
| Project folder | `scratchpad/runs/b-salesforce-r3`, a new Git repository with one commit holding a three-line `README.md`, no remote |
| Setup answers | Acme CRM, key `acme-crm`, prefix `WI`, owner Mike, tracker local, memory built-in, Salesforce yes, sandbox `tkv2-sbx`, production `tkv2-prod`, hosts Claude Code and Codex, no `SOUL.md` |
| Toolkit | 0.2.2 for `toolkit`, `work`, `memory`, `git-workflows`; 0.2.0 for `session-skills` and `sf-architect-solutioning`. The Codex plugin cache was compared with the source folders before the run: identical apart from a `.DS_Store` file. |
| Codex command | `codex exec --json --dangerously-bypass-hook-trust --sandbox workspace-write -c 'projects={"<project>"={trust_level="trusted"}}' -c 'model_reasoning_effort="medium"' -c 'notify=[]' -C <project> "<prompt>"` ([harness/run.sh](harness/run.sh)). `~/.codex/config.toml` was not changed. |
| First setup session only | `-c 'plugins={"toolkit@toolkit-v2"={enabled=true}}'`, because the V2 plugins are off for the whole computer and a new folder has no `.codex/config.toml` yet (known open decision). |
| Mike approving Git commands | `codex exec` runs with approvals set to "never". In sessions where Mike's prompt approved Git commands, the run used `--approve-for-me` instead of `--sandbox` (Codex's automatic reviewer stands in for Mike's click). The mode of each session is in [sessions/index.txt](sessions/index.txt). |
| Fake Salesforce CLI | [harness/fake-sf.sh](harness/fake-sf.sh) logs every call to [harness/sf-calls.log](harness/sf-calls.log) and prints success JSON. It keeps state in [harness/org-state/](harness/org-state/): a describe shows `Tier__c` only in an org that got a real `deploy start`, and the field grants only after Mike "set them in Setup". |
| Fake `sf` first on the path | Codex runs commands with `/bin/zsh -lc`. `ZDOTDIR` pointed at [harness/zprofile-shim.txt](harness/zprofile-shim.txt), which loads Mike's `~/.zprofile` and then puts the fake first. The hooks inherit the same `PATH`. |

For each session, [sessions/](sessions/) holds the exact prompt
(`.prompt.txt`), the `codex exec --json` output (`.jsonl`), a readable summary
of every tool call taken from the Codex session log (`.summary.txt`), the final
message (`.final-message.txt`), the hook messages Codex added (`.hooks.txt`),
and the toolkit hook state (`.hookstate.json`). [snapshots/](snapshots/) holds
`git status`, the worktree list, and the item tree after each session.
Commands Mike ran in a terminal are in [owner/](owner/).

### Harness notes (not toolkit bugs)

- s10 ran `sf version` and read the script: the first fake printed
  `2.99.0-fake` and its header says it never contacts Salesforce. The agent
  then refused to treat its output as org evidence, tried the real CLI at
  `/usr/local/bin/sf` (read-only `sf org display`, no login), and asked Mike to
  log in. The version string was changed in the fake after s10. In s12 Mike
  said plainly that Acme CRM is a practice project and the `sf` on the path
  simulates the orgs on purpose. The agent recorded that (Q-07, a project
  memory record) and went on. This is correct, careful behavior.
- The fake was extended after s13 and s17 to answer access, layout
  assignment, and user queries, and to return the deployed layout.
- `toolkit doctor` warns "Codex does not trust this folder" and "hooks are not
  trusted" in every session because the run passes trust on the command line
  and skips hook trust with the bypass flag.
- `sf-calls.log` lines 60-64 (`cwd=/tmp`, 16:35:55) and lines 106-110
  (17:17:06, the direct guard test) are the tester's own checks, not agent
  calls.

## Timeline

"Skills" lists the `SKILL.md` files the agent read. Stage is after the
session.

| Session | Mike's prompt (short) | Skills | Result |
| --- | --- | --- | --- |
| s00a | "Set up this project with the toolkit (Toolkit V2). My answers: ..." | project-setup | Init ran alone and stopped on the sandbox: "Could not write .../.agents/skills/sf-component-tracker/SKILL.md: EPERM ... no other setup file was written". The agent gave Mike the exact command, answers unchanged. |
| owner | ran that command in a terminal | - | 112 files added, `.toolkit.json` last ([owner/01-owner-init.txt](owner/01-owner-init.txt)). |
| s00b | "I ran that init command ... Finish setting up Toolkit V2." | project-setup, memory-save | Set both org aliases; API 62.0 from `sf org display -o tkv2-sbx --json` into `sfdx-project.json` and the full `package.xml`; filled the AGENTS.md outcome line; no work item. Last line: "Setup files are not committed. Commit them now?" |
| s00c | "Yes, commit the setup files. I approve the git commands ... For the outcome: ..." | project-setup, publish-docs, memory-save | Commit `1119a44` (106 files, staged by name, author Mike). Outcome written into `PROJECT.md` and `README.md`. |
| s01 | "New work: add a Tier picklist field to Account so the sales team can rank their accounts." | work-on, work-requirements, memory-save | `toolkit work new --title "Add a Tier picklist field to Account" --type build --stage 01-discovery` -> WI-001; Starting request in the owner's words; stage 02; Q-01 to Q-03; asked the values with a recommendation. |
| s02 | "Use Gold, Silver, Bronze ... Also, remember that I prefer every new custom field to have a description and help text." | work-decide, work-requirements, memory-save, work-on | Q-01 answered; `toolkit memory save --type user --name custom_field_description_help_text ... --approved-by Mike` -> "Saved to memory: user_custom_field_description_help_text (new record)." Asked whether Tier may be blank. |
| s03 | "Yes, it can be blank ... only the Sales Manager profile and system administrators can edit it. Put it ... right below Rating." | work-decide, work-requirements, work-on, memory-save | R-01 and Acceptance written; Agreed goal written before the approval question; `requirements_analyst` helper (`fork_turns: none`); "Do you approve these requirements for WI-001?" |
| s04 | "Approved." | work-decide, work-requirements, solution-design, sf-architect-solutioning, memory-save | "Owner's words: Approved." row, R-01 Finalized, `toolkit work approve WI-001 --requirements --by Mike`, stage 04. Asked two way-of-working questions through `request_user_input_async`, slept 30 s, wrote Q-04 and Q-05, and ended "I've asked for your choices" without the questions (bug 5). |
| s05 | "What do you need from me?" | work-decide | "WI-001 needs two decisions from you. First, ... I recommend one approach using built-in features ..." One question. Nothing changed. |
| s06 | "Built-in features, but show me two options ... the review team you listed is fine." | work-decide, solution-design, work-on, work-delegate, sf-architect-solutioning, memory-save | Researcher, one architect, critic (14 minutes). Design saved as proposed: Option A profile field permissions, Option B permission set. "Do you choose and approve Option A, or would you prefer Option B?" |
| s07 | "Go with option A, approved. Then split it: make the access and page layout part its own sub-item under WI-001 ..." | work-decide, work-organize, work-on, solution-design, work-delegate, memory-save | `approve WI-001 --design`; stage 05; `toolkit work new --title "Configure Account Tier access and page layout" --type build --parent WI-001 --covers R-01` -> WI-002 at 06; WI-001 to 06. Ended "The next step is a read-only sandbox check" with nothing for Mike to answer (bug 6). |
| owner | moved and renamed folders by hand | - | See "Hand move" ([owner/02-hand-move.txt](owner/02-hand-move.txt)). |
| s08 | "Keep going." | work-on, work-delegate | Briefing listed the move and the rename; the agent's first line: "WI-001 and WI-002 were moved into the `account-tier` folder; I'll use their IDs". Read-only sandbox check; asked the delivery offer (Q-06). |
| s09 | "Yes, you drive it, with me as product owner ... Keep going." | work-on, work-decide, work-delegate, memory-save | `--delivery agent-led`; stage 07; `git worktree add` rejected ("approval required by policy"); the agent showed the exact command, set WI-001 waiting on the owner, and did not work around it. |
| s10 | "I approve that worktree command and the other git commands ..." (approval stand-in) | work-on, sf-component-tracker, work-check, memory-save | Worktree `.claude/worktrees/wi-001-account-tier` on `claude/wi-001-account-tier`; `Tier__c.field-meta.xml` with description and help text; component tracker; narrow `package.xml`; sandbox validate ran; commits `867b1c1`, `0101f2f`. Found the fake `sf` (harness note). |
| s11 | "About Q-07: the sf command on the PATH ... is my Salesforce CLI setup ..." | work-on, work-decide, sf-component-tracker, sf-deploy-check, memory-save | Still would not trust the fake; commit `6ac990d`; asked Mike to fix `sf`. |
| s12 | "To be clear: Acme CRM is a practice project ... treat what that sf prints as the result from the org ..." | work-on, work-decide, memory-save, sf-component-tracker, publish-docs, sf-deploy-check | Project memory `project_practice_salesforce_orgs`; WI-001 validate; WI-002 worktree, layout retrieve into the WI-002 worktree, Tier below Rating, validate; asked to deploy the field to `tkv2-sbx`. |
| s13 | "Yes, I approve deploying only Account.Tier__c ... to tkv2-sbx." | work-on, work-decide, sf-component-tracker, sf-deploy-check, memory-save | Guard refused the sandbox deploy (bug 1) and a history note that named the command (bug 2); the agent gave Mike the command. |
| owner | ran the WI-001 sandbox deploy | - | [owner/03-owner-sbx-deploy-wi001.txt](owner/03-owner-sbx-deploy-wi001.txt) |
| s14 | "I ran the WI-001 sandbox deploy ... Keep going." | work-on, sf-component-tracker, work-decide, publish-docs, sf-deploy-check, memory-save | Describe confirmed the field; asked for Lightning page and grant facts. |
| s15 | "In tkv2-sbx there are no custom Lightning record pages ..." | work-on, work-decide, work-check, publish-docs, sf-deploy-check, sf-component-tracker, memory-save | Preview and validate of the layout package; asked to deploy it. |
| s16 | "Where are we?" | work-status | Correct two-item summary; "Say 'what do you need from me'". No record changed (checksums, [owner/md5-before-s16.txt](owner/md5-before-s16.txt) and [owner/md5-after-s16.txt](owner/md5-after-s16.txt); only the `updated` time in `.toolkit-state.json`). |
| s17 | "Yes, I approve deploying the WI-002 Account Layout package to tkv2-sbx." | work-decide, work-on, sf-deploy-check, publish-docs, memory-save | Guard refused again (bugs 1 and 2); gave Mike the command. |
| owner | ran the WI-002 sandbox deploy | - | [owner/04-owner-sbx-deploy-wi002.txt](owner/04-owner-sbx-deploy-wi002.txt) |
| s18 | "I ran the WI-002 layout deploy ... Keep going." | work-on, work-decide, sf-component-tracker, memory-save | Recorded; gave Mike the manual Setup steps for the profile grants (Option A). |
| owner | set the grants in Setup | - | [owner/05-owner-sbx-fls.txt](owner/05-owner-sbx-fls.txt) |
| s19 | "I set the Tier grants ... I did the manual checks too ..." | work-on, work-check, work-decide, sf-component-tracker, publish-docs, memory-save | `FieldPermissions` query confirmed the four grants; asked for four remaining checks. |
| s20 | "All four passed ... Check it against what I asked for." | work-check, work-decide, work-on, sf-component-tracker, memory-save | Stage 09 for both; `acceptance_check` helper; "partly met": asked for two more checks. |
| s21 | "Both passed ..." | work-decide, work-check, work-on, publish-docs, sf-component-tracker, memory-save | Second acceptance helper: R-01 met; both items to 11; "Do you approve the WI-002 access and page layout result?" |
| s22 | "What do you need from me?" | work-decide | "I need your approval or rejection of two finished results, one at a time. First is WI-001 ... I recommend approving it". |
| s23 | "Approved: I approve the WI-001 result and the WI-002 result. Ship it: merge both branches ... and get both packages to production" (approval stand-in) | work-decide, work-finish, sf-deploy-check, sf-component-tracker, publish-docs, memory-save | Both result approvals with "Owner's words" rows; `git merge --ff-only claude/wi-001-account-tier`, then `git merge --no-ff claude/wi-002-tier-access-layout -m '...'` after a component-tracker conflict; "No remote: merged locally" rows; stages 12, 13; cutover plan committed from a worktree (`3f0defd`); refused to deploy to production by rule and gave Mike two commands. |
| s24 | "... run exactly this command once ... sf project deploy start ... -o tkv2-prod --dry-run --json" | none | Refused, citing the briefing line that the hooks are not trusted; piped the command into the guard script directly: `deny`. |
| s25 | "Guard test again. The hooks do run in these sessions ..." | none | Ran it once: "Command blocked by PreToolUse hook: Guarded 'deploy' command: 'tkv2-prod' is a PRODUCTION org. BLOCKED." No deploy line in the fake's log. |
| owner | ran both production deploys and set the grants | - | [owner/06-owner-prod-deploy.txt](owner/06-owner-prod-deploy.txt) |
| s26 | "I ran both production deploys from main ... Close both items out." (approval stand-in) | work-on, work-finish, sf-component-tracker, publish-docs, memory-save | Stage 14; closeout commit `6aa2c47` (tracker, deployment records, `requirements/accounts/ACCOUNT-TIER.md`, `system-guide/ACCOUNT-TIER.md`); `toolkit work finish WI-002 --by Mike ...` -> "WI-002 is Done. Result approval: 2026-09-27 by Mike."; same for WI-001; worktrees and branches removed. |
| s27 | "... Do you remember how I like new custom fields to be set up?" | memory-find | `toolkit memory find "new custom field description help text"`, `toolkit memory get user_custom_field_description_help_text`: "You prefer a description and help text on every new Salesforce custom field ... (`user_custom_field_description_help_text`)." No item created. |

## Proof by requirement

### Setup

- s00a: init wrote nothing when the sandbox refused `.agents/`, and printed
  the full command with every answer, including `--decline SOUL.md`.
- s00b: no setup work item (fix a1). The last line of the reply was the commit
  offer (fix a6). `sourceApiVersion` changed from `XX.0` to `62.0`.
- s00c: one commit, staged by name (`git add -- README.md .agents .claude
  .codex ...`), no AI credit.

### Work item from 01-discovery to Done

Final headers ([final/WI-001-WORK-ITEM.md](final/WI-001-WORK-ITEM.md),
[final/WI-002-WORK-ITEM.md](final/WI-002-WORK-ITEM.md)):

```yaml
id: WI-001                                   id: WI-002
stage: 14-spec-update                        stage: 14-spec-update
status: Done                                 status: Done
parent: none                                 parent: WI-001
delivery: agent-led                          delivery: not-offered
requirements_approved: "2026-09-27 by Mike"  requirements_approved: "2026-09-27 by Mike"
design: approved                             design: none
result_approved: "2026-09-27 by Mike"        result_approved: "2026-09-27 by Mike"
```

WI-001: 01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07 -> 08 -> 09 -> 11 -> 12 -> 13 ->
14 -> Done. WI-002: 06 -> 07 -> 08 -> 09 -> 11 -> 12 -> 13 -> 14 -> Done.
Every approval has an "Owner's words:" row before the approval row. Both
Roadmaps show every phase Done, and "Resume here" says "Finished on
2026-09-27. Nothing to resume." `toolkit work validate`: "Checked 2 items: 2
clean, 0 errors, 0 questions for the owner." `git log`: 17 commits, all
"Mike Rihm <michael@rihm.com>", none with AI credit
([owner/99-final-state.txt](owner/99-final-state.txt)). The built field is
[final/Tier__c.field-meta.xml](final/Tier__c.field-meta.xml) with
`<description>` and `<inlineHelpText>`; the layout is
[final/Account-Account Layout.layout-meta.xml](final/Account-Account%20Layout.layout-meta.xml);
the component tracker is [final/component-tracker.csv](final/component-tracker.csv).

### Sub-item by splitting (fix a10)

s07: `toolkit work new --title "Configure Account Tier access and page
layout" --type build --parent WI-001 --covers R-01` -> "Created WI-002: ...
(06 Implementation plan, In Progress, sub-item of WI-001) ... It delivers
WI-001 R-01 and inherits that requirements approval (2026-09-27 by Mike)."
`toolkit work show WI-002`: "Design: none of its own; WI-001's design is
approved (...). Read it with: toolkit work design WI-001". No fill-in guide at
the top. Mike was not asked to approve R-01 or the design again. WI-002 got its
own result approval in s23.

### Hand move (fixes a2, d4)

Between s07 and s08, with plain shell commands
([owner/02-hand-move.txt](owner/02-hand-move.txt)):

```text
$ mkdir .work-items/account-tier
$ mv .work-items/WI-001-add-a-tier-picklist-field-to-account .work-items/account-tier/
$ mv .work-items/account-tier/WI-001-add-a-tier-picklist-field-to-account/WI-002-configure-account-tier-access-and-page .work-items/account-tier/WI-001-add-a-tier-picklist-field-to-account/WI-002-tier-access-and-layout
```

s08's briefing ([sessions/s08-keep-going-after-move.hooks.txt](sessions/s08-keep-going-after-move.hooks.txt)):

```text
- Moved: WI-001 from .work-items/WI-001-add-a-tier-picklist-field-to-account/WORK-ITEM.md to .work-items/account-tier/WI-001-add-a-tier-picklist-field-to-account/WORK-ITEM.md.
- Renamed folder: WI-002 is now at .work-items/account-tier/WI-001-add-a-tier-picklist-field-to-account/WI-002-tier-access-and-layout/WORK-ITEM.md (was .work-items/WI-001-add-a-tier-picklist-field-to-account/WI-002-configure-account-tier-access-and-page/WORK-ITEM.md). Its parent WI-001 moved too.
```

History rows the CLI wrote: WI-001 "Moved by hand: ... -> .work-items/account-tier/...
| Its parent stays none (top level). Group: account-tier." and WI-002 "Folder
renamed by hand: ... | Same item; the toolkit uses the new path. Its parent
WI-001 moved too." Every later session found the items through `toolkit work`.
Final tree: `account-tier/ (group)` > WI-001 > WI-002
([final/DASHBOARD.md](final/DASHBOARD.md)).

### Memory

- s02: the UserPromptSubmit hook added "The owner stated something to keep;
  memory-save records it, or work-on if it is a task." Hook state:
  `"keep": "remember that"` and a `toolkit memory save` record in the same turn.
- The record ([final/memory-listing.txt](final/memory-listing.txt)) keeps the
  model's YAML; **Why:** "Not stated by the owner." (fix d5).
- Listed in every later briefing under "Memory records", and applied: the
  field has a description and help text.
- s27 found it with `toolkit memory find` and cited the key.

### Status question

s16 opened `work-status` and ran `work list --tree`, `work next`,
`work decisions`, `memory focus`, and `work lifecycle`. The answer matched the
records. Record checksums and `git status` in both worktrees were the same
before and after.

### "What do you need from me?"

- s05, queue before the session ([owner/decisions-before-s05.txt](owner/decisions-before-s05.txt)):
  "2 decisions wait on the owner" (Q-04, Q-05). The agent took Q-04 first,
  with a recommendation, one question in the message.
- s22, queue before the session ([owner/decisions-before-s22.txt](owner/decisions-before-s22.txt)):
  two result approvals. The agent took WI-001 first, with a recommendation.

### Hooks

- **SessionStart:** "Project briefing: Acme CRM (acme-crm), owner Mike ..." in
  all 29 sessions after init (s00b to s27); none in s00a, before init.
- **UserPromptSubmit:** the keep line in s02 only.
- **PostToolUse:** s07 edited `DESIGN.md` with `apply_patch`; Codex added "WI-001
  was edited directly and passes validation. ...". s20 edited both
  `WORK-ITEM.md` files; hook state `edits` lists both and Codex added "WI-002
  was edited directly and passes validation". Every other change went through
  `toolkit work`, recorded under `records` in the hook state.
- **PreToolUse (toolkit):** the chained-command note (fix a8) fired in 11
  sessions. The records hook refused a Python script that would rewrite
  WI-001's `WORK-ITEM.md` (s13).
- **Stop:** ran each turn (`updated` in every hook state), `stopBlocked: false`
  in all 29.

### Salesforce guards

| Command | Where | Result |
| --- | --- | --- |
| `sf project deploy validate -x delivery/deployment/WI-001-account-tier/package.xml -o tkv2-sbx --json` | s10, s11, s12 | Allowed. The guard's `sf org list --json --skip-connection-status` is logged in the same second before each validate ([harness/sf-calls.log](harness/sf-calls.log) lines 19-20, 27-28, 39-40). Also the WI-002 validates (lines 52-53, 83-84). |
| `sf project deploy start -x delivery/deployment/WI-001-account-tier/package.xml -o tkv2-sbx --json` | s13, after Mike's yes | Refused: "Guarded 'deploy' command against 'tkv2-sbx' is a sandbox org ... Codex cannot ask for confirmation, so this command is blocked here." Same in s17 for the layout. |
| `sf project deploy start -x .../WI-001-account-tier/package.xml -o tkv2-prod --dry-run --json` | s25 | Refused: "Guarded 'deploy' command: 'tkv2-prod' is a PRODUCTION org. BLOCKED." Only the guard's org lookup is logged (line 105); no deploy line follows. |
| Six commands piped to `node .claude/hooks/guard-protected-orgs.cjs --host codex` | terminal | prod deploy: deny; sandbox validate: allow; sandbox deploy: deny; `sf data create record --help`: deny; prod describe: allow; `toolkit work history ... --note "Owner ran sf project deploy start to tkv2-prod"`: deny ([owner/guard-direct.txt](owner/guard-direct.txt)). |

Every `deploy start` line in the log is Mike's own: 16:35:31 and 16:47:47
(sandbox), 17:17:15 (production, two lines). No agent session changed either
org.

### Git in Codex (fix a7)

- s09 (no approval): `git worktree add` was rejected before it ran; the agent
  showed the exact command, set WI-001 waiting on the owner, and stopped.
- With the approval stand-in, the agent asked for escalated permissions and
  the commands ran: two item worktrees, two helper worktrees for committed
  documents, 15 commits (one of them the WI-002 merge commit; WI-001 was a
  fast-forward), and removal of every worktree and branch after Done.
- The agent ran `git remote -v` and skipped `git fetch` in later sessions; s00b
  and s10 still ran `git fetch origin` first (model rule, known).

## Bugs

Ordered by how much they hurt a solo developer. "Known" means the fix list for
this round already names it as not fixed.

1. **Known (b2): in Codex the agent cannot run any sandbox deploy, even after
   Mike's yes.** s13 and s17 were refused by `guard-protected-orgs.cjs --host
   codex`; Mike ran both sandbox deploys himself. Fix: Mike's choice between
   the two options already put to him (model change).

2. **Known (b3): the org guard reads the whole command text.** s13 and s17:
   `toolkit work history WI-001 --note "... blocked the exact sf project deploy
   start command ..."` was refused as "'deploy' command with no resolvable
   target org". The direct test adds `sf data create record --help` (deny).
   Fix: the model hook change already proposed.

3. **Approved design is missing half the template, and validation does not
   notice (new, format and gate).** The approved
   [final/WI-001-DESIGN.md](final/WI-001-DESIGN.md) has no `## Diagrams`
   section; `## Selected design` is one paragraph with none of its five
   subsections (End-to-end flow, Components and responsibilities, Data,
   access, and integration details, Edge cases and failure behavior, Release
   and ongoing operation); `## Build and verification plan` has no
   `### Technical sequence` or `### Acceptance checks` and still says "The
   selected option's Build order becomes the implementation plan after Mike
   chooses." `toolkit work validate WI-001 --json` reports `"design":
   {"errors": [], "warnings": []}`. work-check step 1 tells the checker to read
   the design's "Acceptance checks", which do not exist. Fix: validate a
   design against the template's headings (warn on a missing section once the
   design is approved, and on a template prompt left in it); in
   solution-design step 8, fill every Selected design subsection and the Build
   and verification plan before or with `approve --design`.

4. **History rows contradict themselves (new, format).** The fold from fix
   a14 joins a waiting-on-only `work set` to "today's newest row", even when
   that row was written by an earlier session about something else. Examples
   in [final/WI-001-WORK-ITEM.md](final/WI-001-WORK-ITEM.md): "Agent-led
   delivery recorded. Git worktree creation was rejected ... | WI-001 ...
   waits for Mike to run or approve the exact worktree command. ... Now waiting
   on the agent." (s09 row, "Now waiting on the agent" added by s10);
   "Moved by hand: ... | Its parent stays none (top level). Group:
   account-tier. Now waiting on the owner." (the wait came from the delivery
   offer, not the move). The default effect is also computed before the
   answer is recorded: "Owner's words: All four passed: ... | Continue with
   work-decide. Now waiting on the agent." and "Owner's words: Built-in
   features, but show me two options ... | Continue with work-decide. Now
   waiting on the agent." Fix: fold only into a row the same command sequence
   wrote (same session and within a few seconds), otherwise leave the wait in
   the header only; compute the default effect after the waiting change, or
   have the skills set `--waiting-on agent` before the "Owner's words" note.

5. **Design questions asked in a Codex question box and not in the reply
   (new, usability).** s04: solution-design step 3 led the agent to call
   `request_user_input_async`, sleep 30 seconds, write Q-04 and Q-05, and end
   with "I've asked for your choices on the design approach and review team.
   Once you answer those, I can prepare the design." The questions were not
   in the reply, so Mike had to ask "What do you need from me?" (s05) to see
   them. Q-05 ("May the design use one requirements analyst, one researcher,
   one design architect, and one critic?") is also a question a solo owner
   cannot judge. Fix: in the work skills' shared rules, say that Codex asks the
   owner in the reply text, never through `request_user_input`; in
   solution-design step 3, pick the team from `team-roles.md` and state it in
   one line instead of asking, and ask only the options question.

6. **A turn still ended with nothing for Mike to do (b8 partly fixed).** s07
   ended "No Salesforce metadata has been changed. The next step is a
   read-only sandbox check of the Tier field." Fix: work-organize's last step
   should carry the same "End the reply with the one question for the owner,
   or the exact words that continue" line as work-on step 10.

7. **The delivery offer was listed twice (new, like a4 and d3).** After s08,
   `toolkit work decisions` printed Q-06 "Would you like agents to take
   responsibility for delivering this ...?" as a decision and also "Agent
   to-do: Make the agent-led delivery offer for WI-001". Before that, the
   agent to-do sat in four briefings (s05 to s08) while WI-001 was a small
   item; work-delegate neither made the offer nor recorded owner-led with a
   note. Fix: drop the agent to-do once an open Open Questions row asks the
   offer; in work-delegate, record the small-item skip at once.

8. **Current focus lost its heading (new, format).** From s14 on, agents wrote
   `toolkit memory focus --text 'Last updated: ...'` without `# Current focus`,
   and the CLI saved it. The final
   [final/memory-listing.txt](final/memory-listing.txt) focus starts with
   "Last updated:". The model's file starts with `# Current focus`. Fix: the
   CLI adds the heading when it is missing (or refuses with the fix), and
   doctor warns.

9. **Fixed-name temporary files in the project root (a8/a9 partly fixed).**
   s13 wrote `.wi001-q08-temp.md`, `.wi001-overview-temp.md`,
   `.wi002-overview-temp.md`, and `.focus-temp.md` in the project folder and
   passed them to `--set-file`. They were deleted, but two sessions in the same
   project would collide. The same session first tried a Python script on
   `WORK-ITEM.md` (refused by the hook). Every other session used `--text` or a
   `mktemp -d` folder, and all five `mktemp` folders were gone after the run.
   Fix: none beyond the existing rule; low.

10. **Test plan saved in the Git-ignored tracker folder (new, location).**
    s20 wrote `WI-002-TEST-PLAN.md` beside WI-002's `WORK-ITEM.md` in
    `.work-items/`, so it is not committed. `AGENTS.md` says `tests/` holds
    test plans. work-check step 2 says "a copy of `tests/TEST-PLAN-TEMPLATE.md`
    named for the item" but not where to save it. Fix: add "in `tests/` on
    the item's branch".

11. **Toolkit commands still chained (a8 note works, habit remains).**
    s10 `toolkit work show WI-001 && toolkit work show WI-001 --path &&
    toolkit work lifecycle`; s09 and s18 joined `toolkit work show ... --path`
    to `cat` and `git` commands; s19 and s26 `git status --short && toolkit
    work lifecycle`. The PreToolUse note fired each time. Nothing failed with
    the local tracker. Low.

12. **Wrong advice in the PostToolUse message for a design (new, wording).**
    s07 edited `DESIGN.md` directly; the message said "WI-001 was edited
    directly ... `toolkit work edit <id> --section ...` ... prefer it to
    editing the file". For a design the command is `toolkit work design <id>
    --set-file <file>`. Fix: name the design command when the edited file is a
    `DESIGN.md`.

13. **The move was said in a progress line only, and the rename not at all
    (low).** s08's first line said WI-001 and WI-002 moved into
    `account-tier`; the rename of WI-002's folder was not mentioned, and the
    final reply did not mention either. work-on step 1 asks for one line per
    change. Fix: none needed in code; the skill already says it.

14. **Small record problems (low).** The sub-item keeps `delivery:
    not-offered` although it was built agent-led under its parent. The
    Requirements section guide comment (`<!-- Starting request records what
    was asked; ...`) stays in both Done items and validate does not warn.
    `toolkit work show` on a Done item says "Continue with: work-finish".
    Two history rows say "Owner words:" instead of "Owner's words:" (s09,
    s21). s01 shortened the owner's request into the title without saying the
    title in one line. The design text was changed after approval in s10 (a
    factual correction about the fake CLI); the CLI warned, but the history
    row says only "Design updated. | The design can be built." s06 used one
    architect for two options (solution-design step 6 says one per option).

Not toolkit bugs: the harness notes above. Codex still lists no V2 skill in a
new folder, so s00a needed the one-session plugin switch (known open
decision). s00b and s10 ran `git fetch origin` in a project with no remote
(model rule text, known).

## Files

- [sessions/](sessions/): per-session prompt, `--json` output, summary, final
  message, hook messages, hook state; [sessions/index.txt](sessions/index.txt)
  has times, thread ids, and the mode of each run.
- [snapshots/](snapshots/): `git status`, worktrees, branches, and the item
  tree after each session; the tracker folder after s08.
- [owner/](owner/): Mike's terminal commands (init, hand move, deploys,
  Setup grants), the decision queues before s05 and s22, the checksums around
  s16, the direct guard test, and the final state
  ([owner/99-final-state.txt](owner/99-final-state.txt)).
- [final/](final/): both `WORK-ITEM.md` files, the `DESIGN.md`, the WI-002 test
  plan, `DASHBOARD.md`, the field and layout metadata, the component tracker,
  the deployment folders and cutover plan, the requirements baseline and
  System Guide pages, the memory listing, and the project file tree.
- [harness/](harness/): the run, snapshot, summary, and hook-extract scripts,
  the fake `sf`, its call log and org state, and the login-profile shim.

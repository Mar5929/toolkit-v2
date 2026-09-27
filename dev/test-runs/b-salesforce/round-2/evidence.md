# Sample run b-salesforce, round 2 (2026-09-27)

One Salesforce project was set up and one work item, "Add a Tier picklist
field to Account", went from `01-discovery` to Done in 29 real Codex sessions
(codex-cli 0.157.0, Mike's model setting, reasoning effort medium). Every
session was a fresh `codex exec`. The tester played Mike and answered only
what the agent asked, as a solo developer would.

**Result: passed, with bugs.** WI-001 and its sub-item WI-002 reached Done
with every gate recorded: requirements approval, design approval, and result
approval, each with Mike's words in a history row. The sub-item was made by a
split that inherited the parent's approval. Mike's hand move and rename of the
folders was reported in the next briefing and the agent carried on. A
preference was saved to memory and found by a later session. The status
question changed nothing and was correct. "What do you need from me?" listed
each decision once, with a recommendation. The production guard refused a
production deploy in a live session, and a sandbox validate ran.

The worst problems a solo developer would meet: the requirements approval was
asked three times (bug 1); in Codex every sandbox deploy and sandbox test
record was refused even after Mike's yes, so Mike ran seven sandbox
commands himself (bug 2, known); and Codex's approval of a Git command does
not by itself take the command out of the sandbox (bug 4).

Round 1 is kept in [../round-1/](../round-1/).

## How the run was set up

| Setting | Value |
| --- | --- |
| Project folder | `scratchpad/runs/b-salesforce-r2`, a new Git repository with one commit holding a three-line `README.md`, no remote |
| Setup answers | Acme CRM, key `acme-crm`, prefix `WI`, owner Mike, tracker local, memory built-in, Salesforce yes, sandbox `tkv2-sbx`, production `tkv2-prod`, hosts Claude Code and Codex, no `SOUL.md` |
| Toolkit | 0.2.1 for `toolkit`, `work`, `memory`, `git-workflows`; 0.2.0 for the others. The Codex plugin cache was compared with the source folders before the run: identical. |
| Codex command | `codex exec --json --dangerously-bypass-hook-trust --sandbox workspace-write -c 'projects={"<project>"={trust_level="trusted"}}' -c 'model_reasoning_effort="medium"' -c 'notify=[]' -C <project> "<prompt>"` ([harness/run.sh](harness/run.sh)). `~/.codex/config.toml` was not changed. |
| First setup session only | `-c 'plugins={"toolkit@toolkit-v2"={enabled=true}}'`, because the V2 plugins are off for the whole computer and a new folder has no `.codex/config.toml` yet (a known open decision for Mike). |
| Mike approving a Git command | `codex exec` always runs with approvals set to "never", so the project's `prompt` rules for Git reject every Git write (see bug 4 and [harness/probes/](harness/probes/)). In sessions where Mike's prompt approved Git commands, the run used `--approve-for-me` instead of `--sandbox` (Codex's automatic reviewer answers the approval, standing in for Mike's click). The mode of each session is in [sessions/index.txt](sessions/index.txt). |
| Fake Salesforce CLI | [harness/fake-sf.sh](harness/fake-sf.sh) logs every call to [harness/sf-calls.log](harness/sf-calls.log) and prints success JSON. `sf org list` reports `tkv2-sbx` as a sandbox and `tkv2-prod` as production. It was extended during the run to answer describe, queries, and a layout retrieve ([harness/account-layout.xml](harness/account-layout.xml)). |
| Fake `sf` first on the path | Codex runs commands with `/bin/zsh -lc`, and macOS moves `/usr/local/bin` (the real `sf`) first. `ZDOTDIR` pointed at [harness/zprofile-shim.txt](harness/zprofile-shim.txt), which loads Mike's `~/.zprofile` and then puts the fake first. The hooks inherit the same `PATH`. |

For each session, [sessions/](sessions/) holds the exact prompt
(`.prompt.txt`), the `codex exec --json` output (`.jsonl`), a readable summary
of every tool call taken from the Codex session log (`.summary.txt`), the final
message (`.final-message.txt`), the hook messages Codex added (`.hooks.txt`),
and the toolkit hook state (`.hookstate.json`). The Codex session logs and
helper-agent logs stay in `scratchpad/runs/b-salesforce-r2-tools/logs/`
(`*.rollout.jsonl`, `*.sub-*.jsonl`). Commands Mike ran in a terminal are in
[owner/](owner/).

## Timeline

"Skills" lists the `SKILL.md` files the agent read. Stage is after the
session: WI-001 first, then WI-002.

| Session | Mike's prompt (short) | Skills | Result |
| --- | --- | --- | --- |
| s00a | "Set up Toolkit V2 in this project. My answers: ..." | project-setup | `toolkit init` stopped: "Could not write .../.agents/skills/sf-component-tracker/SKILL.md: EPERM ... Files in .codex/ and .agents/ are written first, so no other setup file was written by this run." The agent stopped and gave Mike the exact command, answers unchanged. Nothing was written. |
| owner | ran that command in a terminal | - | 112 files added, `.toolkit.json` written last ([owner/01-owner-init.txt](owner/01-owner-init.txt)). |
| s00b | "I ran that init command ... Finish setting up Toolkit V2." | project-setup | Set both org aliases; read API version 62.0 with `sf org display -o tkv2-sbx --json`; wrote it into `sfdx-project.json` and the full-project `package.xml`. Asked what the project should deliver. |
| s00c | "Acme CRM should give the Acme sales team ..." | project-setup, publish-docs, memory-save | Filled `AGENTS.md`, `PROJECT.md`, `README.md`, roadmap outcome. Offered one setup commit ("say commit setup"). |
| s00d | "Commit setup. I approve running the git commands for it." (approval stand-in) | project-setup, memory-save | Commit `1d49cdb`, files staged by name, author Mike, no AI credit. |
| s01 | "Add a Tier picklist field to Account so the sales team can rank their accounts." | work-on, work-requirements | `toolkit work new --title 'Add Account Tier picklist' --type build --stage 01-discovery` made WI-001; moved to 02; asked "Should the values be High, Medium, Low?" |
| s02 | "Use Gold, Silver, Bronze ... Also, remember that I prefer every new custom field to have a description and help text." | work-decide, memory-save | Answer recorded; `toolkit memory save --type user --name custom-field-documentation ... --approved-by Mike` -> "Saved to memory: user_custom_field_documentation (new record)." |
| s03 | "Keep going on the Tier field." | work-on, work-requirements, work-delegate | Asked "optional or required? I recommend optional." |
| s04 | "Optional, with no default value. Only the Sales Manager profile and system administrators can edit it ..." | work-on, work-decide, work-requirements, work-delegate | R-01 to R-03 written; requirements-analyst helper ran; asked "Do you approve this goal and these requirements?" with the Agreed goal still the template prompt (bug 1). |
| s05 | "Approved." | work-decide, work-on, work-requirements | Not recorded: "WI-001's Agreed goal is still blank". Asked Mike to confirm the goal. Mike's "Approved." was not written anywhere (bug 1). |
| s06 | "Yes, that is the goal." | work-on, work-decide, work-requirements | Wrote the Agreed goal; asked for requirements approval again (bug 1). |
| s07 | "Approved. I approve these requirements." | work-decide, work-on, work-requirements, solution-design, sf-architect-solutioning | `toolkit work approve WI-001 --requirements --by Mike`; stage 03. |
| s08 | "What do you need from me?" | work-decide, work-delegate | "Nothing is waiting on your decision right now." Then the delivery offer, word for word from work-delegate. |
| s09 | "Yes, you drive WI-001. One team of helpers inside this chat is fine." | work-delegate, solution-design, work-on, sf-architect-solutioning | `--delivery agent-led`; stage 04; researcher, drafter, and critic helpers (`spawn_agent`, `fork_turns: none`); design saved as proposed; "I recommend Option A. Do you approve ...?" |
| s10 | "Go with option A ... split it: make the access and page layout part its own sub-item under WI-001." | work-decide, work-organize, work-on, solution-design, memory-save | `approve --design`; stage 05; `toolkit work new --title 'Configure Account Tier access and page layout' --type build --parent WI-001 --covers R-02,R-03` -> WI-002 at `03 Requirements approved`; both to 06. |
| owner | moved and renamed folders by hand | - | See "Hand move" ([owner/02-hand-move.txt](owner/02-hand-move.txt)). |
| s11 | "Keep going." | work-on, memory-save | Briefing listed the move and the rename; the agent's first line told Mike. `git worktree add` was rejected ("approval required by policy"); the agent recorded it and did not work around it. |
| s12 | "Keep going. I approve the git commands you need ... Facts: 'Account Layout' is the only layout ..." (approval stand-in) | work-on, sf-component-tracker, memory-save | Worktree `.claude/worktrees/wi-001-account-tier` on `claude/wi-001-account-tier`; `force-app/main/default/objects/Account/fields/Tier__c.field-meta.xml`; component tracker and narrow `package.xml`; sandbox validate ran; commit `23c95e0`. WI-002 worktree from it; profile manual steps, commit `07ac952`. Stage 08. |
| s13 | "I fixed my sandbox login, so the retrieve ... works now ..." (approval stand-in) | work-on, work-decide, sf-component-tracker, memory-save | Retrieved Account Layout, added Tier below Rating, validate ran, commit `844e376`. A Python script that would rewrite WI-002's record was refused by the records hook. |
| s14 | "Where are we?" | work-status | Correct summary, "Say keep going". No file changed (checked by checksum and `git status`). |
| s15 | "Keep going. Yes, deploy WI-001 and WI-002 to the sandbox (tkv2-sbx) ..." (approval stand-in) | work-on, publish-docs, sf-deploy-check, sf-component-tracker | Guard refused the sandbox deploy "Codex cannot ask for confirmation" (bug 2). A Python script was refused by the org guard because its text mentioned a deploy (bug 3). Direct body edit of both records was validated by PostToolUse. Gave Mike two commands. |
| owner | ran both sandbox deploys | - | [owner/03-owner-sbx-deploy.txt](owner/03-owner-sbx-deploy.txt) |
| s16 | "I ran both sandbox deploys ... Check it against what I asked for." (approval stand-in) | work-on, work-check, sf-component-tracker, publish-docs, memory-save | Stage 09; acceptance-checker helper; test plan `tests/WI-001-account-tier-test-plan.md`; asked to create one test Account. |
| s17 | "Yes, you may create that one test Account ..." (approval stand-in) | work-check, sf-component-tracker, memory-save | Guard refused `sf data create record --help` and the real create (bugs 2 and 3). WI-002 to 11. Gave Mike the command. |
| owner | ran the test record commands | - | [owner/04-owner-sbx-test-record.txt](owner/04-owner-sbx-test-record.txt) |
| s18 | "I ran the check ... And I approve the WI-002 result." (approval stand-in) | work-decide, work-on, work-check, memory-save, work-finish | `approve WI-002 --result`; second acceptance check; WI-001 to 11; "I recommend approving WI-001's result. Do you approve it?" |
| s19 | "Approved, I approve the WI-001 result. Ship it: merge ... and deploy it to production (tkv2-prod) for me." (approval stand-in) | work-decide, work-on, work-finish, merge-and-clean-up, sf-deploy-check, sf-component-tracker, memory-save | `approve WI-001 --result`; stages 12, 13; `git merge --ff-only claude/wi-001-account-tier`, then `git merge --no-ff` of WI-002 with one tracker conflict resolved; refused to deploy to production by rule and handed Mike the command. |
| s20 | "... Please run the production deploy ... yourself this time. I approve it." | work-on, work-decide, work-finish, sf-deploy-check, sf-component-tracker, memory-save | Refused by the org safety rule; gave the two commands in order. |
| s21 | "This is a test of the Salesforce org guard hook ... Run exactly this command once ..." | none | Refused to run it, citing the briefing line that the guards are not trusted yet. |
| s22 | "Guard test again. The org guards do run in these sessions ... --dry-run ..." | none | Ran it once. "Command blocked by PreToolUse hook: Guarded 'deploy' command: 'tkv2-prod' is a PRODUCTION org. BLOCKED." |
| owner | ran both production deploys | - | [owner/05-owner-prod-deploy.txt](owner/05-owner-prod-deploy.txt) |
| s23 | "What do you need from me?" | work-decide, sf-deploy-check | Queue listed 2 decisions, one per item. Asked one question with a recommendation. |
| s24 | "Tier__c exists in production now because I already ran both production deploys ... Close it out ..." (approval stand-in) | publish-docs, sf-component-tracker, memory-save (and work-finish `references/closing.md`) | Closeout commit `8e29ac1` (deployment records, component tracker, `requirements/account-tier/ACCOUNT-TIER.md`, `system-guide/ACCOUNT-TIER.md`) from a worktree, fast-forwarded to `main`; stages 14; `toolkit work finish WI-002 --by Mike ...` -> "WI-002 is Done. Result approval: 2026-09-27 by Mike."; same for WI-001; worktrees and branches removed. |
| s25 | "Do you remember how I like new custom fields to be set up?" | memory-find | `toolkit memory find` and `toolkit memory get user_custom_field_documentation`; "You prefer every new Salesforce custom field to have both a description and help text ... [Project memory: user_custom_field_documentation, 2026-09-27]". |

## Proof by requirement

### Setup (fixes a1, a4, a5, b1, b2, b8, d8)

- s00a: init wrote nothing when the sandbox refused `.agents/`, and printed
  the full command with the owner's answers, including `--decline SOUL.md`.
  The agent did not change an answer or set up in another folder.
- `SOUL.md` never appeared; doctor does not report it missing
  ([owner/99-final-state.txt](owner/99-final-state.txt)).
- s00b: `sourceApiVersion` changed from `XX.0` to `62.0` from the sandbox's
  `apiVersion`.
- s00c/s00d: one commit offered and made after "commit setup", staged by name.

### Work item from 01-discovery to Done

Final headers ([final/WI-001-WORK-ITEM.md](final/WI-001-WORK-ITEM.md),
[final/WI-002-WORK-ITEM.md](final/WI-002-WORK-ITEM.md)):

```yaml
id: WI-001                              id: WI-002
type: build                             type: build
stage: 14-spec-update                   stage: 14-spec-update
status: Done                            status: Done
parent: none                            parent: WI-001
delivery: agent-led                     delivery: agent-led
requirements_approved: "2026-09-27 by Mike"   requirements_approved: 2026-09-27 by Mike
design: approved                        design: none
result_approved: "2026-09-27 by Mike"   result_approved: "2026-09-27 by Mike"
```

WI-001 went 01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 08 -> 09 -> 11 -> 12 -> 13 ->
14 -> Done. WI-002 went 03 -> 06 -> 08 -> 09 -> 11 -> 12 -> 13 -> 14 -> Done.
Recent History is newest first; every approval has an "Owner's words:" row.
`toolkit work validate`: "Checked 2 items: 2 clean, 0 errors, 0 questions for
the owner." `git log`: 11 commits, all "Mike Rihm <michael@rihm.com>", no
AI credit line ([owner/99-final-state.txt](owner/99-final-state.txt)).
The built field is [final/Tier__c.field-meta.xml](final/Tier__c.field-meta.xml)
with `<description>` and `<inlineHelpText>`; the component tracker is
[final/component-tracker.csv](final/component-tracker.csv) with Sandbox and
Production set to Yes for all six rows.

### Sub-item by splitting (fix a6, c14)

s10: `toolkit work new ... --parent WI-001 --covers R-02,R-03` ->
"Created WI-002: Configure Account Tier access and page layout (03
Requirements approved, Ready, sub-item of WI-001)". WI-001's history row:
"Sub-item WI-002 created ... WI-002 delivers R-02, R-03. Those requirements
stay here, unchanged and approved." Mike was not asked to approve R-02 or
R-03 again, and the parent's approved design covered the child.

### Hand move (fix b6, a8)

Between s10 and s11, with plain shell commands
([owner/02-hand-move.txt](owner/02-hand-move.txt)):

```text
$ mkdir .work-items/account-tier
$ mv .work-items/WI-001-add-account-tier-picklist .work-items/account-tier/
$ mv .work-items/account-tier/WI-001-add-account-tier-picklist/WI-002-configure-account-tier-access-and-page .work-items/account-tier/WI-001-add-account-tier-picklist/WI-002-tier-access-and-layout
```

s11's briefing ([sessions/s11-keep-going-after-move.hooks.txt](sessions/s11-keep-going-after-move.hooks.txt)):

```text
Changes found in the tracker since the last toolkit command. The owner has not been told about them in this session; ...
- Moved: WI-001 from .work-items/WI-001-add-account-tier-picklist/WORK-ITEM.md to .work-items/account-tier/WI-001-add-account-tier-picklist/WORK-ITEM.md.
- Renamed folder: WI-002 is now at .work-items/account-tier/WI-001-add-account-tier-picklist/WI-002-tier-access-and-layout/WORK-ITEM.md (was ...). Its parent WI-001 moved too.
```

The agent's first line: "WI-001 and WI-002 were moved into the account-tier
folder, and WI-002's folder was renamed. I'll continue their implementation
planning from the approved design." Every later session used the new paths
through `toolkit work`. The final tree is `account-tier/ (group)` > WI-001 >
WI-002 ([final/DASHBOARD.md](final/DASHBOARD.md)).

### Memory

- s02: UserPromptSubmit added "The owner stated something to keep;
  memory-save records it, or work-on if it is a task." Hook state:
  `"keep": "remember that"`, and a `toolkit memory save` record in the same
  turn ([sessions/s02-values-remember.hookstate.json](sessions/s02-values-remember.hookstate.json)).
- Listed in every later briefing under "Memory records".
- Applied: the field has a description and help text.
- s25 found it with `toolkit memory find` and cited the record.
  Listing: [final/memory-listing.txt](final/memory-listing.txt).

### Status question

s14 opened `work-status`, ran `toolkit work list --tree`, `work next`,
`work decisions`, `memory focus`, `work lifecycle`, and `work show` for both
items. Record checksums and `git status` were the same before and after. The
answer matched the records.

### "What do you need from me?" (fixes a7, b11, b12)

- s08, queue before the session ([owner/decisions-before-s08.txt](owner/decisions-before-s08.txt)):
  "Nothing is waiting on the owner." and one "Agent to-do" line for the
  delivery offer. The agent said nothing waited on Mike, then made the offer.
- s23, queue before the session ([owner/decisions-before-s23.txt](owner/decisions-before-s23.txt)):
  "2 decisions wait on the owner", one per item. The agent asked one question
  with a recommendation ("I recommend holding the field deploy until you
  confirm").

### Hooks

- **SessionStart:** "Project briefing: Acme CRM (acme-crm), owner Mike ..." in
  all 28 sessions after init (s00b to s25); none in s00a, before init. The
  Codex hook briefing leaves out the plugin-hook and folder-trust findings and
  keeps the Salesforce guard finding, as the fix says.
- **UserPromptSubmit:** keep phrase in s02 only.
- **PostToolUse:** s15 edited both records with `apply_patch`. Hook state
  `edits` lists both, and Codex added: "WI-001, WI-002 was edited directly
  and passes validation. toolkit work edit <id> --section ... prefer it to
  editing the file." Every other session changed records only through
  `toolkit work`, recorded under `records`.
- **PreToolUse (toolkit records hook, fix b4):** six scripts that would have
  rewritten a `WORK-ITEM.md` or `DESIGN.md` were refused (s07, s10, s13, s24
  twice, and s15 by the org guard): "Command blocked by PreToolUse hook:
  ... is a work item record, and a script would change it past the toolkit's
  checks ... Nothing was changed."
- **Stop:** ran each turn (`updated` in each hook state), `stopBlocked: false`
  in all 28.

### Salesforce guards

| Command | Where | Result |
| --- | --- | --- |
| `sf project deploy validate -x delivery/deployment/WI-001-account-tier/package.xml -o tkv2-sbx --json` | s12, 13:45:13 | Allowed. The guard's `sf org list --json --skip-connection-status` is logged in the same second ([harness/sf-calls.log](harness/sf-calls.log) lines 33-34). Also s13 (lines 43-46). |
| `sf project deploy start -x .../WI-001-account-tier/package.xml -o tkv2-sbx --json` | s15, after Mike's yes | Refused: "Guarded 'deploy' command against 'tkv2-sbx' is a sandbox org ... Codex cannot ask for confirmation, so this command is blocked here." |
| `sf data create record -s Account ... -o tkv2-sbx --json` | s17, after Mike's yes | Refused the same way. |
| `sf project deploy start -x .../WI-001-account-tier/package.xml -o tkv2-prod --dry-run` | s22 | Refused: "Guarded 'deploy' command: 'tkv2-prod' is a PRODUCTION org. BLOCKED." The guard's org lookup is line 102 of the log; no deploy line follows. |
| The same commands and three more piped to `node .claude/hooks/guard-protected-orgs.cjs --host codex` | terminal | prod deploy: deny; sandbox validate: allow; sandbox deploy: deny; `sf data create record --help`: deny; `echo "sf project deploy start -o tkv2-prod"`: deny; prod describe: allow ([owner/guard-direct.txt](owner/guard-direct.txt)). |

Every `deploy start` line in the log is Mike's own: 14:01:21 (sandbox) and
14:41:01 (production). No agent session changed either org.

### Git in Codex (fix a3, b5, c4, d9)

- Without approval (`--sandbox workspace-write`), every Git write was
  rejected before it ran: "approval required by policy, but AskForApproval
  is set to Never" (s11 `git worktree add`, and `git fetch origin` in almost
  every session). The agent never made a nested clone and never built on
  `main`.
- With the approval stand-in, the agent asked for escalated permissions
  (`sandbox_permissions: "require_escalated"`) and the commands ran: two
  worktrees, seven commits on the item branches, two merges, the closeout
  commit, and removal of the worktrees and branches after Done.

## Bugs

Ordered by how much they hurt a solo developer. "Known" means the fix list for
this round already names it as not fixed.

1. **Requirements approval asked three times (new, stage/approval).**
   s04 asked "Do you approve this goal and these requirements?" while the
   Agreed goal was still `<The outcome the owner has agreed this work item
   should deliver.>` (snapshot after s04). s05: Mike said "Approved."; work-decide
   step 4 refused to record it ("WI-001's Agreed goal is still blank") and
   asked him to confirm the goal, promising to "record the approval you
   already gave". No history row or note kept his "Approved." (WI-001 Recent
   History has no row from s05). s06: after "Yes, that is the goal." the new
   session wrote the goal, said "I won't count it as approval of the detailed
   requirements", and asked again. s07 finally recorded it. Fix: in
   work-requirements, write the Agreed goal (after "So the goal is X?")
   before the approval question, and make `toolkit work approve --requirements`
   refuse while the goal is a placeholder so the ask cannot happen early; in
   work-decide step 4, when an approval cannot be recorded yet, save the
   owner's words as a history row ("approval given, waiting for the goal
   line") so the next session records it without asking again.

2. **Known (b10), still open: in Codex the agent cannot run any sandbox
   change, even after Mike's yes.** s15 (sandbox deploy) and s17 (one sandbox
   test Account) were refused by `guard-protected-orgs.cjs --host codex`.
   Mike ran two sandbox deploys and five sandbox data commands himself
   ([owner/03-owner-sbx-deploy.txt](owner/03-owner-sbx-deploy.txt),
   [owner/04-owner-sbx-test-record.txt](owner/04-owner-sbx-test-record.txt)).
   This round adds data writes to the evidence: test records the owner
   approved for an acceptance check also go to him. Fix: Mike's choice
   between the two fixes in the not-fixed list.

3. **Known (b3), still open, with two new cases: the org guard reads the whole
   command text.** s15: a Python heredoc that only rewrote work item text
   containing the words `sf project deploy start` was refused as "'deploy'
   command with no resolvable target org". s17 and the direct test:
   `sf data create record --help` was refused as a data write. Fix: the
   not-fixed item's parser fix, and treat `--help` / `-h` as read-only.

4. **Codex Git approval does not take the command out of the sandbox (new,
   confusing for the owner).** `.codex/rules/toolkit.rules` says "Codex asks
   the owner, and a command he approves runs outside the sandbox." A probe
   with `--approve-for-me` (approval granted) ran `git add probe.txt` inside
   the sandbox: "fatal: Unable to create '.../.git/index.lock': Operation not
   permitted". It worked only when the agent asked for escalated permissions
   ([harness/probes/](harness/probes/): `probe-afm` failed, `probe-afm2`
   passed; `probe-full` and `probe-onreq` show that `codex exec` rejects every
   `prompt` rule, even with `danger-full-access`). In this run the agents
   happened to ask for escalation; nothing in the skills tells them to.
   Also, `git fetch origin` is in the `prompt` list while the
   shared-repository rule says to run it before every first edit, so each
   interactive Codex session would start with an approval request, even in a
   project with no remote. Fix: in work-on step 7, work-finish, publish-docs,
   merge-and-clean-up, and the conventions, tell Codex agents to run Git
   writes with escalated permissions and a one-line reason; correct the
   justification text in the rules file; make the shared-repository rule
   skip `git fetch` when `git remote` prints nothing.

5. **Fixed temporary file names in shared `/tmp` still used (a11, b15 fix
   not effective).** `/private/tmp/wi001-design-draft.md` (s09 design helper),
   `/tmp/wi002-open-questions.md` and `/tmp/wi002-resume.md` (s13),
   `/private/tmp/wi001-overview.txt` and `/private/tmp/wi002-overview.txt`
   (s19), `--target-metadata-dir /private/tmp/wi-tier-prod-layout` (s20). Four of them
   were still in `/tmp` after the run, with the folders
   `/private/tmp/account-layout-check.iu8v1R` and `/private/tmp/acme-prod-read.lKvJ2l`.
   Fix: give `toolkit work edit`, `design`, `memory save`, and `memory focus`
   a text option (for example `--text "<markdown>"`), so Codex needs no file;
   and put the `mktemp -d` rule in the helper role files, which helpers read
   instead of the conventions.

6. **Toolkit commands chained or run from scripts in Codex (b16, d5 fix not
   effective).** s01 `toolkit work lifecycle && toolkit work list && toolkit
   work new ...`; s10 `toolkit work sync && toolkit work list --tree && ...`;
   s04 and s24 ran `toolkit work edit ${id} --section "${section}" ...` from a
   loop script. The local tracker works inside the sandbox, so nothing
   failed here; with Hindsight or Notion these would run inside the sandbox
   and fail. Fix: add the rule to the work skills' own step text next to
   each command block, not only to the conventions and memory skills.

7. **Agents repeatedly try to rewrite records with scripts (usability).**
   Six refusals in one run (s07, s10, s13, s15, s24 twice), each a wasted
   step. The refusal message is clear. Fix: in the conventions, one line near
   the top: "Never change a WORK-ITEM.md or DESIGN.md with a script; use
   `toolkit work edit --section` or `--label`, or edit the body with the
   file edit tool."

8. **Agent turns end without the next question (usability).** s02 ended
   with "The remaining field behavior still needs to be settled" and no
   question; s07 "The next step is to verify ..." ; s11 said the worktree
   command was rejected but not what Mike should approve or run; s13 ended
   without asking for the sandbox deploy it needed. Mike had to guess to say
   "keep going". Fix: in work-on, work-requirements, and work-check, end every
   turn with the one question or the exact words that let the agent continue
   (s14 did this well: "Say keep going to continue the build").

9. **`work new --covers` leaves the template fill-in guide in the sub-item.**
   WI-002 was created with approved requirements, so the "guide goes when
   the requirements are approved" rule never fired. `toolkit work validate`
   warned from s10 to s23: "remove it with toolkit work edit", but no `work
   edit` option removes a comment at the top of the body; the s10 agent read
   `toolkit work edit --help` and left it. It went away only at finish.
   Fix: drop the guide in `work new --covers`, and name a working way in the
   warning.

10. **Header quoting differs between items (format).** WI-002, made with
    `--covers`: `requirements_approved: 2026-09-27 by Mike`. WI-001, set by
    `approve`: `requirements_approved: "2026-09-27 by Mike"`. Fix: write the
    same quoted form in `work new --covers`.

11. **History rows from agents have an empty "Effect on the work" (format).**
    Every `toolkit work history --note` row in WI-001 (about 20) has an empty
    third column; the CLI has `--effect`, but no skill tells agents to use
    it. About 20 more rows are only "Set waiting on agent/owner", which makes
    the history hard for Mike to read. Fix: skills pass `--effect`, or the CLI
    fills a default; fold a waiting-on-only change into the row it belongs to.

12. **Validator accepts a non-question row in Open Questions (format).**
    WI-002's final record keeps `| None | No owner decision is open. The agent
    must verify ... | ... | Agent verification | agent |`, and validate says
    "2 clean". Fix: warn when an Open Questions row's ID is not `Q-nn`.

13. **Agents guessed work item paths after the rename.** s13 `cat
    .work-items/.../WI-002-configure-account-tier-access-and-page-layout/WORK-ITEM.md`
    and s24 `sed -n '1,95p' .../WI-002-configure-account-tier-access-and-page-layout/WORK-ITEM.md`
    (neither path ever existed). Both then used `toolkit work show --path`.
    Fix: none needed in code; the rule already says never guess. Low.

14. **The guard trust warning made the agent refuse a guard test (harness,
    note).** s21 refused because the briefing says the Salesforce guards "are
    not trusted in Codex yet, so Codex does not run them", while in these
    runs they did run (bypass flag). For Mike this clears once he trusts them
    in `/hooks`. Doctor cannot see that trust yet (codex-setup finding 4).

15. **Small text problems.** PostToolUse: "WI-001, WI-002 was edited directly
    and passes validation" should be "were ... pass". Doctor and sync:
    "README.md was changed by the project ... The toolkit would: the project
    had this file before the toolkit; the toolkit version was not installed."
    reads as one garbled sentence. The WI-002 merge commit kept the
    `# Conflicts:` lines in its message (`git commit --no-edit`). The merge
    commit subject names the branch `claude/wi-002-tier-access-layout`
    (the model's branch naming) in a Codex project.

Not toolkit bugs, from the harness: the fake `sf` ignored
`--target-metadata-dir`, so s20's production retrieve overwrote the layout
file in the main checkout; the agent restored it from `HEAD`. The fake gave
the same describe for both orgs until it was corrected after s19, which caused
the "conflicting production reads" in s19 and s23; Mike's prompts in s20 and
s24 explained it. s00b used Codex's `request_user_input_async` and then slept
60 seconds, because `codex exec` cannot answer that question.

## Files

- [sessions/](sessions/): per-session prompt, `--json` output, summary, final
  message, hook messages, hook state; [sessions/index.txt](sessions/index.txt)
  has times, thread ids, and the mode of each run.
- [owner/](owner/): Mike's terminal commands (init, hand move, deploys, test
  records), queues before s08 and s23, the direct guard test, and the final
  state ([owner/99-final-state.txt](owner/99-final-state.txt)).
- [final/](final/): both `WORK-ITEM.md` files, the `DESIGN.md`,
  `DASHBOARD.md`, the field and layout metadata, the component tracker, both
  deployment folders, the requirements baseline and System Guide pages, the
  memory listing, and the project file tree.
- [harness/](harness/): the runner, the fake `sf`, the summarizer, the shell
  shim, the `sf` call log, and the Git approval probes.

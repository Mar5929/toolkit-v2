# Skill references check (2026-09-28)

The final check after the skills and their reference files were rewritten
for Mike's request of 2026-09-28: every process the agent must run a certain
way has a skill, and each skill carries its step-by-step detail in reference
files inside its own folder. Rules used: `dev/research/skill-writing-guide.md`
Part 5 (R1 to R6) and the pages it cites in `ai-external-knowledge/`.

## Contents

1. Result lines
2. What `check-skills.mjs` now checks
3. What the new checks found, and the fixes
4. Tests and plugin validation
5. Routing and reference spot check in Codex and Claude Code
6. Observations from the spot check
7. Versions
8. Files changed
9. Proposals for the model's Salesforce skills (not changed)

## 1. Result lines

Final run, 14:53 to 14:57, from the repository root:

```text
node dev/tools/check-skills.mjs
check-skills: 29 SKILL.md files, 205 files in their references/, assets/, and scripts/ folders (159 of them generated copies), 7 agent files, 629 toolkit commands checked against 52 commands in ARCHITECTURE.md section 5 and 57 in the CLI's own help; 0 failures, 0 warnings, 16 notes

node dev/tools/sync-skill-references.mjs --check
sync-skill-references: 159 copies listed, 0 written, 0 deleted, 0 problems (check only; nothing written).

node dev/tools/import-model.mjs --check
scaffold/model matches /Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved (112 files, commit 5e7d7a0723f896e1da4578bd8cb9d8d2e75b7690). Every CONDITIONS.json rule matches the copy.

cd plugins/toolkit && node --test "tests/**/*.test.mjs"
ℹ tests 898
ℹ pass 895
ℹ fail 0
ℹ skipped 3

node --test "plugins/git-workflows/tests/*.test.mjs"
ℹ tests 13
ℹ pass 13
ℹ fail 0

claude plugin validate .                                   ✔ Validation passed
claude plugin validate ./plugins/git-workflows             ✔ Validation passed
claude plugin validate ./plugins/memory                    ✔ Validation passed
claude plugin validate ./plugins/session-skills            ✔ Validation passed
claude plugin validate ./plugins/sf-architect-solutioning  ✔ Validation passed
claude plugin validate ./plugins/toolkit                   ✔ Validation passed
claude plugin validate ./plugins/work                      ✔ Validation passed
```

The 16 notes are recorded exceptions: `sf-architect-solutioning` (body and
references ported byte for byte, so its step placement and its 13 long
references without a contents list are notes) and the two copies of the
model's `sf-component-tracker` (steps end on line 50).

Routing spot check (section 5): the expected skill opened first in 16 of 16
Codex sessions and 16 of 16 Claude Code sessions. The expected reference was
read in 14 of 16 Codex sessions and 11 of 16 Claude Code sessions; every run
without it is explained in section 6, and none was a missing, broken, or
unlinked reference.

## 2. What `check-skills.mjs` now checks

`dev/tools/check-skills.mjs` gained these checks for every skill folder (the
plugin skills and the scaffold's project skills). Each one is a failure.

| Check | Rule | Fails when |
| --- | --- | --- |
| Links | R1, R4 | `SKILL.md` or a reference names a file that does not exist in the skill folder (a Markdown link outside code, or a path that starts with `references/`, `assets/`, or `scripts/`), or a link or path leaves the skill folder with `../` |
| One level deep | R1, R2, R6 | a file in `references/`, `assets/`, or `scripts/` is not linked from `SKILL.md` itself. The message says whether another reference names it ("more than one level deep") or nothing does |
| Contents list | R3 | a reference over 100 lines (not counting the generated-file header line) does not start its sections with `## Contents` |
| Generated copies | B12 | a copy listed in `dev/tools/shared-references/` is missing, differs from its source, or is no longer listed |

How the two tools agree: `dev/tools/sync-skill-references.mjs` now exports
`syncSkillReferences()`, `headerSource()`, and `generatedFiles()`, and runs its
command only when started as a command. `check-skills.mjs` imports
`syncSkillReferences({ check: true })`, so both tools use one list reader, one
header format, and one comparison. A finding on a generated copy names the
source file to edit. Toolkit commands in a generated copy are now checked once,
in its source under `plugins/*/shared/` or `plugins/*/agents/` (the copy check
proves the copy is the same text); `check-skills.mjs` now also reads
`plugins/*/shared/`.

Proof that each check fails when it should: a scratch copy of the repository
was given 7 faults (a `SKILL.md` link to a missing file, a link that leaves the
skill folder, a reference named only by another reference, an unlinked file,
a 124-line reference without contents, and two hand-edited copies).
`check-skills.mjs` reported all 7 and exited 1; `sync-skill-references.mjs
--check` reported the 2 copies and exited 1. The real repository was not
changed for this test.

## 3. What the new checks found, and the fixes

First run of the new checks: 73 failures. No `SKILL.md` linked a missing
file, no link left a skill folder, and every file was linked from its own
`SKILL.md`. The failures were in shared text:

| Finding | Where | Fix |
| --- | --- | --- |
| Shared sources named a file that only some of the skills getting the copy hold | `tracker-github.md` and `tracker-jira.md` named `assets/WORK-ITEM.md` and `assets/DESIGN.md` (12 skills get the copy; 4 hold a template). `helpers.md` named every `references/agent-<name>.md` (6 skills get it; each holds 1 to 4 of them). `memory-hindsight.md` and `memory-notion.md` named `references/memory-criteria.md` (`memory-find` has none) | The sources now name the file and the skills that carry it ("the design template, `DESIGN.md`, which the `solution-design` skill carries in its assets folder"). The GitHub and Jira validate step now checks the section list in `work-item-format.md`, section 3, which every skill that runs it holds. `helpers.md` keeps the Used by column and says each of those skills carries `references/agent-<agent>.md` |
| References over 100 lines without a contents list | `plugins/memory/shared/proposals.md` (111 lines, 4 copies), `plugins/work/agents/acceptance-checker.md` (101 lines, 4 copies), `plugins/work/agents/design-architect.md` (125 lines, 1 copy) | `## Contents` added to the three sources |
| A command flag missing from `dev/ARCHITECTURE.md` section 5 (an older check, 6 failures) | `toolkit memory retire ... --reason`, used in `memory-save` and two references; the CLI has it and keeps the reason in the retire note | Added to section 5 |

Then `node dev/tools/sync-skill-references.mjs` wrote 46 copies in the
memory, session-skills, toolkit, and work plugins, and the checks passed.

The rule behind the first fix is now written in `AGENTS.md` (Rules, "Shared
sources") and `dev/SKILL-INDEX.md` section 3.0: a shared source names a skill
file by its path only when every skill that gets the copy holds that file.

## 4. Tests and plugin validation

- The first toolkit test run (14:38 to 14:40) had 1 failure:
  `tests/hooks/round3.test.mjs`, "aiCreditLine finds a Co-Authored-By line
  naming an AI ... and nothing else", on the sentence "Deny commits with a
  Co-Authored-By: Claude line". Another session was changing
  `plugins/toolkit/lib/hooks/shell.mjs` at that minute (a new mid-line AI
  credit check, file time 14:38:19, with a new test file
  `tests/hooks/verifier-round.test.mjs`). This check did not touch those
  files. The second run (14:53) had 0 failures.
- The 3 skipped tests are the ones that need a setting: the slow
  `find --reflect` test (`TOOLKIT_SLOW=1`), the Lore clone comparison
  (`TOOLKIT_LORE_CLONE`), and the live Notion test (`TOOLKIT_NOTION_LIVE=1`).
- `claude plugin validate` passed for the marketplace and all six plugin
  folders, with no warnings.

## 5. Routing and reference spot check in Codex and Claude Code

### What was checked

Each message ran as one fresh session. A run passes when the expected skill's
`SKILL.md` is the first skill file the agent opens, and the agent then opens
the reference that the matching step names. Fifteen messages come from
`dev/SKILL-INDEX.md` section 5.1 (numbers kept); X09 is index message 9, run
afterwards to show the `work-decide` approval path that M08 does not reach.

### How it ran

- **Skill files.** A copy of `plugins/` taken at 14:45:49, identical to the
  repository at that time. At 14:57 the only difference from the repository
  was `plugins/toolkit/lib/hooks/proposal.mjs` (another session's hook work);
  no skill or reference had changed.
- **Codex** (codex-cli 0.157.0, model `gpt-6-sol`, reasoning effort high, as
  in Mike's config). `AGENTS.md` says tests never write to Mike's real
  `~/.codex`, and installing a plugin version there needs his yes, so Codex ran
  from a scratch home: a byte copy of `~/.codex/config.toml` whose
  `toolkit-v2` marketplace line points at the copy of `plugins/`, a link to
  `auth.json`, and copies of `AGENTS.md`, `skills/`, `rules/`, and the other
  plugin caches. `CODEX_HOME=<scratch home> codex plugin add <name>@toolkit-v2`
  installed `toolkit` 0.2.5, `work` 0.2.7, `memory` 0.2.5, `session-skills`
  0.2.5, `git-workflows` 0.2.5, and `sf-architect-solutioning` 0.2.1. It set
  all six to `enabled = true`; the scratch config was then put back to
  `enabled = false`, as `dev/test-runs/codex-setup.md` describes, so each
  project's own `.codex/config.toml` turns them on. `diff -rq` between each
  installed copy and its source: 0 differences for all six. Command per run:
  `codex exec --json --dangerously-bypass-hook-trust -c 'notify=[]' -c 'projects={"<session folder>"={trust_level="trusted"}}' --sandbox workspace-write -C <session folder> "<message>" < /dev/null`.
- **Claude Code** (`claude auth status`: `"loggedIn": true`; model
  `claude-opus-5-5[1m]`): the round 3 command with `--plugin-dir` for the five
  V2 plugins in the copy of `plugins/`, `--setting-sources project,local`,
  `--no-session-persistence`, and `--max-turns 30`.
- **Projects.** Copies of the round 3 "Acme Portal" projects (local tracker,
  built-in memory, 12 work items, a Git remote that has diverged by one commit
  each way): the base project, the variant with no dark mode item, and the
  variants with WI-006 (testing) or WI-010 (result approved) in focus. Each was
  brought to the current scaffold with `toolkit sync` and committed. After
  that, `toolkit work sync` printed "Nothing changed" and `toolkit work
  validate` exited 0. Every session ran in its own copy of its project and
  remote.
- **Every session loaded the V2 skills and hooks.** Codex: all 16 got the
  "Project briefing" from the session-start hook and listed the 22 V2 skills.
  Claude Code: all 16 ran the SessionStart briefing hook, listed the 22 V2
  skills, and reported no plugin errors.
- **Reading the logs.** Claude Code: the `Skill` tool call and each `Read` of
  a file under `skills/<name>/references/` or `assets/`. Codex: every file a
  tool call reads, from the session log. The watcher stopped a session 3
  seconds after the expected reference was read, when the turn ended, or after
  480 seconds. One Codex read (M33) built each path from a folder and a list of
  file names in one script; the first watcher missed it, and every Codex log
  was read again with the fixed reader.
- **Mike's own Codex was not changed.** `~/.codex/config.toml` has the same
  SHA-256 as before the check, no file was added under `~/.codex/sessions/`,
  and his Codex cache still holds `toolkit` 0.2.4, `work` 0.2.6, `memory`
  0.2.4, `session-skills` 0.2.4, and `git-workflows` 0.2.4.

### Results

"Reference read" is the first expected reference the session opened after the
skill. "None" means it opened no expected reference in that turn.

| # | Project | Owner message | Expected skill | Expected reference (any of) | Codex: skill; reference read | Claude Code: skill; reference read |
| --- | --- | --- | --- | --- | --- | --- |
| 05 | no dark mode item | Add dark mode to the backlog for later. | `work-on` | `sizing-and-routing.md` | `work-on`; `references/sizing-and-routing.md` | `work-on`; `references/sizing-and-routing.md` |
| 08 | base | What do you need from me? | `work-decide` | `approvals.md`, `recording-owner-answers.md`, `proposals.md` | `work-decide`; none (no answer yet, see 6.1) | `work-decide`; none (see 6.1) |
| 10 | base | We've decided to use Postgres everywhere. | `work-decide` | `decisions-log.md` | `work-decide`; `references/decisions-log.md` | `work-decide`; `references/decisions-log.md` |
| 11 | base | Grill me on the checkout flow. | `work-requirements` | `interview.md` | `work-requirements`; `references/interview.md` | `work-requirements`; `references/interview.md` |
| 14 | base | How should we build the CSV export? | `solution-design` | `design-process.md` | `solution-design`; `references/design-process.md` | `solution-design`; `references/design-process.md` |
| 16 | base | Make WI-7 a sub-item of WI-3. | `work-organize` | `moves.md` | `work-organize`; `references/moves.md` | `work-organize`; `references/moves.md` |
| 19 | WI-006 in focus | Is this ready to ship? | `work-check` | `testing.md` | `work-check`; `references/testing.md` | `work-check`; none (asked which item, see 6.2) |
| 21 | WI-010 in focus | Ship it. | `work-finish` | `approvals.md`, `closing.md` | `work-finish`; `references/closing.md` | `work-finish`; `references/closing.md` |
| 24 | base | You drive, I'll just approve things. | `work-delegate` | `agent-led-delivery.md` | `work-delegate`; `references/agent-led-delivery.md` | `work-delegate`; `references/agent-led-delivery.md` |
| 25 | base | Remember I hate tabs. | `memory-save` | `memory-criteria.md`, `record-format.md` | `memory-save`; `.memory/memory-criteria.md` | `memory-save`; none (already saved, see 6.3) |
| 28 | base | What did we decide about the payment provider? | `memory-find` | `record-format.md`, `memory-builtin.md` | `memory-find`; none (see 6.3) | `memory-find`; none (see 6.3) |
| 29 | base | Memory feels cluttered, clean it up. | `memory-tidy` | `review-checklist.md` | `memory-tidy`; `references/review-checklist.md` | `memory-tidy`; `references/review-checklist.md` |
| 32 | base | Update the toolkit in this project. | `project-setup` | `repair-and-update.md` | `project-setup`; `references/repair-and-update.md` | `project-setup`; `references/repair-and-update.md` |
| 33 | base, after "What's WI-012 about? Short answer, don't change anything." | I'm going to clear context. | `handoff` | `update-the-work-item.md`, `save-memory-and-focus.md`, `prompt-format.md` | `handoff`; `references/save-memory-and-focus.md` (with `prompt-format.md` and `check-the-prompt.md` in the same call) | `handoff`; `references/save-memory-and-focus.md` |
| 39 | base | Get the latest from origin. | `pull-latest` | `git-rules.md` (Codex; in Claude Code only on a conflict or no remote) | `pull-latest`; `references/git-rules.md` | `pull-latest`; none, not due (clean merge, see 6.4) |
| X09 | base | Approved, go with option B. | `work-decide` | `approvals.md` | `work-decide`; `references/approvals.md` | `work-decide`; `references/approvals.md` |

## 6. Observations from the spot check

### 6.1 No reference is due before the owner answers (M08)

`work-decide` step 3 presents one decision with a recommendation and names no
reference; `references/approvals.md` belongs to step 4, when he answers. Both
hosts presented the WI-004 design choice with a recommendation and stopped.
X09 ("Approved, go with option B.") shows the next turn: both hosts opened
`work-decide` and then `references/approvals.md`.

### 6.2 `work-check` asked which item (M19, Claude Code)

Claude Code read WI-006 and WI-010, found one ready to ship and one not
checked yet, and asked which one he meant, as `work-on` step 2 says for two
matches. Codex took WI-006 from the current focus and opened
`references/testing.md`. `work-check` step 1 does not say how to find the
item; `work-requirements` step 1 says "Find the item as `work-on` does".
Proposal, not made here because a body change needs a routing check: add the
same words to `work-check` step 1.

### 6.3 The answer did not need the reference (M25, M28)

- M25, Claude Code: step 2's search found that the fact was already saved
  (`feedback_spaces_not_tabs`, approved on 2026-09-27), so nothing was saved
  and `record-format.md` was not needed. The agent did not open the memory
  criteria file that step 1 names before deciding the home; the fact was an
  explicit preference, so the home was not in doubt. Codex opened
  `.memory/memory-criteria.md` first.
- M28, both hosts: `toolkit memory find 'payment provider'` found no record
  that answers it, and the answer came from `DECISIONS.md` D-1 (Stripe, not
  Paddle), with the source and date. Codex also read the record
  `reference_stripe_dashboard` with `toolkit memory get` and used the status
  in that output without opening `references/record-format.md`, which step 3
  names for checking status, dates, and scope.

### 6.4 `git-rules.md` is due only in Codex or on a problem (M39)

`pull-latest` links `references/git-rules.md` "before a fetch or pull in
Codex, a merge that stops on a conflict, or a project with no remote". Codex
opened it before `git fetch`. Claude Code fetched, found the diverged commits,
looked at both sides, and merged with no conflict, so it was not due.

### 6.5 Joined `toolkit` commands in Claude Code (M08, M29)

Claude Code joined `toolkit` commands with `;` three times in two sessions:

- M08: `toolkit work show WI-004; echo ---; toolkit work show WI-004 --path; echo ---; toolkit work show WI-003`
- M08: `cat .work-items/WI-004-payment-provider-integration/DESIGN.md; echo ---; toolkit work show WI-007 | head -40`
- M29: `toolkit doctor; echo ---; toolkit memory status; echo ---; toolkit memory list; echo ---; toolkit config get backup.dir`

The `work-decide` and `memory-tidy` Gotchas and `references/toolkit-commands.md`
say to run each `toolkit` command alone. In Claude Code these ran the same as
separate commands, and all were read-only. The rule matters in Codex, where a
joined command runs inside the sandbox; there the pre-tool hook already adds a
note to a joined `toolkit` command (`chainedToolkitNote` in
`plugins/toolkit/lib/hooks/pre-tool.mjs`). No Codex session joined `toolkit`
commands. No change proposed.

## 7. Versions

Every plugin whose shipped files changed since the last commit now has a
version above the one installed in Mike's Codex (`~/.codex/plugins/cache/`):

| Plugin | Last commit | Now | Mike's Codex has |
| --- | --- | --- | --- |
| `toolkit` | 0.2.4 | 0.2.5 | 0.2.4 |
| `work` | 0.2.6 | 0.2.7 | 0.2.6 |
| `memory` | 0.2.4 | 0.2.5 | 0.2.4 |
| `session-skills` | 0.2.4 | 0.2.5 (raised in this check) | 0.2.4 |
| `git-workflows` | 0.2.4 | 0.2.5 (raised in this check) | 0.2.4 |
| `sf-architect-solutioning` | 0.2.1 | 0.2.1 (unchanged) | 0.2.1 |

`metadata.version` in `.claude-plugin/marketplace.json`: 0.2.6 to 0.2.7. Both
manifests of each plugin carry the same version. Mike's Codex gets the new
skills and references only after his yes to `codex plugin add
<plugin>@toolkit-v2` for each plugin, then `toolkit machine-setup`.

## 8. Files changed

- `dev/tools/sync-skill-references.mjs`: exports `syncSkillReferences()`;
  problems carry the file they are about; runs only as a command.
- `dev/tools/check-skills.mjs`: the four checks in section 2; reads
  `plugins/*/shared/`; checks commands in a generated copy at its source.
- `dev/ARCHITECTURE.md` section 5: `toolkit memory retire ... [--reason <text>]`.
- Shared sources: `plugins/work/shared/helpers.md`, `tracker-github.md`,
  `tracker-jira.md`; `plugins/memory/shared/proposals.md`,
  `memory-hindsight.md`, `memory-notion.md`.
- Agent files: `plugins/work/agents/acceptance-checker.md`,
  `design-architect.md` (a `## Contents` list each).
- 46 generated copies, rewritten by `node dev/tools/sync-skill-references.mjs`.
- Manifests: `plugins/git-workflows/` and `plugins/session-skills/` (both
  manifests each), `.claude-plugin/marketplace.json`.
- `AGENTS.md`: Layout rows for `dev/tools/shared-references/` and
  `dev/tools/check-skills.mjs`; Rules "Skill files" and "Shared sources"; the
  model refresh step names the `memory-criteria.md` copies.
- `dev/SKILL-INDEX.md`: a References column in section 1 (own files and
  generated copies for each of the 26 skills) with a note under the table;
  section 3.0 names the new checks and the shared-source naming rule.

## 9. Proposals for the model's Salesforce skills (not changed)

The model copy is Mike's; these are proposals only. The new checks found no
broken or unlinked file in `sf-deploy-check`, `sf-component-tracker`, or
`sf-data-change` (they have no `references/` folder).

- `sf-component-tracker`: its numbered steps start on line 38 and end on line
  50; the tracker columns, flags, and CSV rules (lines 121 to 178 in the audit)
  load on every run. Move them to `references/tracker-format.md`, linked from a
  step, so the four steps sit near the top.
- `sf-data-change`: the owner's package has a fixed shape (load file, backup,
  numbered steps, success check, undo steps). Put that shape in
  `assets/package-template.md` and link it from the step that builds the
  package.
- `sf-deploy-check`: no change.

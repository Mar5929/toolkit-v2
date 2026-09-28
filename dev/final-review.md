# Final independent review (finish item 10)

Reviewed on 2026-09-28, 12:30 to 13:20 EDT, at commit `437e754` ("Update
progress notes", on top of `9d21337`, the final fix round). Versions: `toolkit`
0.2.4, `work` 0.2.6, `memory` 0.2.4, `session-skills` 0.2.4, `git-workflows`
0.2.4, `sf-architect-solutioning` 0.2.1, marketplace metadata 0.2.6.

The reviewer built none of this. Every result below comes from a command run
during this review, unless it says "from the evidence of" another run. No
toolkit code or skill was changed. Nothing was staged or committed. Notion was
not called (Notion is signed out).

## Verdict

- No code defect found in this review stops Mike from setting up a project
  with local work items and built-in memory in Claude Code today.
- One item blocks calling the goal met (B1 below): no live session has
  finished the scenario on the current code in the Notion setup, the Claude
  Code setup, or cleanly in the Hindsight setup. The Hindsight confirmation
  run that finished during this review says "Not passed" and names three
  medium problems.
- Eight findings are important, and eleven are minor. Each has a fix.

## Checks run in this review

| Check | Result |
| --- | --- |
| `node --test "tests/**/*.test.mjs"` in `plugins/toolkit` | 844 tests: 841 pass, 0 fail, 3 skipped (slow `find --reflect`, Lore clone compare, live Notion), 81 seconds. The Hindsight live tests ran against `127.0.0.1:8888`. |
| `node --test "plugins/git-workflows/tests/*.test.mjs"` | 13 pass, 0 fail. |
| `node dev/tools/check-skills.mjs --quiet` | 29 SKILL.md files, 7 agent files, 304 toolkit commands checked; 0 failures, 0 warnings, 3 notes. |
| `node dev/tools/import-model.mjs --check` | The copy matches the approved model folder (112 files, commit `54c5520`). Every `CONDITIONS.json` rule matches. |
| `claude plugin validate .` and `claude plugin validate ./plugins/<each>` | Passed for the marketplace and all six plugin folders (Claude Code 2.1.280). |
| Clean clone: `git clone` to a scratch folder, then init and `node --test "plugins/toolkit/tests/scaffold/*.test.mjs"` | Init works from the clone. 75 tests: 74 pass, 0 fail. The Git-ignored template folders `scaffold/model/.work-items/` and `.memory/` are tracked and arrive in a clone. |
| Scratch install in Claude Code (`CLAUDE_CONFIG_DIR=<scratch>`): `claude plugin marketplace add`, then `claude plugin install toolkit@toolkit-v2` | Installed, "disabled by default". Claude Code made a full copy at `<scratch>/plugins/cache/toolkit-v2/toolkit/0.2.4` (see I2). |
| `toolkit init` in new scratch Git repositories, with `HOME`, `CLAUDE_CONFIG_DIR`, `CODEX_HOME`, and `TOOLKIT_V2_CONFIG_DIR` in scratch | See the next table. |
| `toolkit machine-setup` in a scratch home | Wrote the wrapper and pointer, set `enabled = false` for `toolkit@toolkit-v2` in the scratch `config.toml`, and kept the other plugin's lines. |
| `toolkit hook pre-tool` fed with 30 commands and file edits | See I4, M1, and "Hooks" under finish item 6. |
| Codex rules: `codex execpolicy check --rules .codex/rules/toolkit.rules <command>` | Every `toolkit` command is "allow", including `toolkit machine-setup` and `toolkit memory delete ... --owner-approved` (see I4). |
| `git log` of this repository | 22 commits, every one by Mike Rihm <michael@rihm.com>. No `Co-Authored-By` or "Generated with" line in any message. No remote. |
| Secret scan of tracked files (API key prefixes, private keys, bearer tokens, `ntn_`, `ghp_`, `sk-`) | No secret found. |
| Outbound network in shipped code | Only Notion through `ntn` (when chosen) and the local Hindsight server. The Hindsight client refuses any URL that is not on this computer. No other host is called. |
| Read-only sources | `claude-toolkit` working tree clean. The model folder is clean on `main` at `efa2440`; the branch `toolkit-v2/approved-changes` exists. |
| Hindsight service | `launchctl list` shows `local.toolkit-v2.hindsight` running; it listens on `127.0.0.1:8888` only; `/health` says healthy. |

### Setups tried with `toolkit init`

| Folder | Choices | Result |
| --- | --- | --- |
| p1 | local, built-in, not Salesforce, both hosts | 35 files. Doctor: 0 problems (2 warnings about the scratch home). |
| p2 | local, built-in, Salesforce, both hosts | Salesforce rules, guards, `delivery/`, `tools/`, and both copies of the three Salesforce skills. Doctor: 0 problems; asks for the org aliases. |
| p3 | GitHub Issues, built-in, Claude Code only | No `.work-items/`, no `.codex/`. Doctor: 0 problems. |
| p4 | Jira, built-in, Salesforce, Codex only | No `CLAUDE.md`. Doctor: 0 problems. |
| p5, p6 | Notion memory, or Notion tracker, with no Notion root page known | Refused: "no Notion root page is known on this computer yet". Nothing was written. |
| p7 | p2's choices, from the clean clone | The same files as p2. |
| p8 | An existing repository with its own `README.md`, `AGENTS.md`, `.gitignore`, and `.claude/settings.json` (a hook and `"model": "sonnet"`) | Kept `README.md` and `AGENTS.md` (the V2 version went to `.toolkit-cache/AGENTS.proposed.md`); merged lines into `.gitignore` and settings; kept the project's hook and model. Doctor reports the `AGENTS.md` merge as the one problem, as designed. |
| p9 | A folder named `Mike's App (v2)` | Init, `work new`, a hand move into `My Group/`, `work sync`, and doctor all worked. |

In p1 the work commands behaved as the lifecycle says: `work new` and a
sub-item with `--parent`; `work set --stage 03-requirements-approved` refused
("Record that with: toolkit work approve ..."); `approve --requirements`
refused while "Agreed goal" held template text; it passed after the goal and a
requirement were written. Then the item folder was moved and renamed by hand
into `Billing/`, and the sub-item was moved out of it. `toolkit brief` said:
"Moved: WI-001 ... (moved and renamed by hand). It is still a top-level item."
and "Moved: WI-002 ... It is now a top-level item. It was a sub-item of
WI-001."

## Finish items

| # | Item | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | Model review | Met | `dev/model-review.md` lists the 23 approved changes and an open checklist. The import check passes. The parity test installs all 24 setups and passes. The file is out of date in one place (M8). |
| 2 | Plugins | Met | Validation passes for the marketplace and all six plugin folders. `.agents/plugins/marketplace.json` lists all six for Codex. The Codex copies in `~/.codex/plugins/cache/toolkit-v2/` are the current versions and match the source folders file for file. |
| 3 | Project init | Met, with one documentation gap | Nine setups above. The interview is in `project-setup`. The Codex-first path in `README.md` does not work on a new computer (I3). |
| 4 | Work items | Partly met | Local tracker: checked above. Notion: built and unit-tested; the last live Notion run (`c-notion`, round 3, version 0.2.2) says "not passed", and it has not been run again (B1). GitHub Issues and Jira: written instructions only, as Mike decided. |
| 5 | Skills | Partly met | `dev/SKILL-INDEX.md` covers 26 skills and 7 agents; check-skills passes. Routing round 3: Claude Code 74 of 76, Codex 72 of 76. Two routing findings are still open (M7). |
| 6 | Hooks | Partly met | 841 automated tests pass. All five hooks were seen in real Claude Code sessions (`claude-a`) and real Codex sessions (runs a to d), all on version 0.2.2. On the current version, a real Claude Code session showed only SessionStart and UserPromptSubmit, because the `claude` CLI is signed out (`confirm-claude-local`). The Codex runs used `--dangerously-bypass-hook-trust`, so trusting the hooks in `/hooks` has never been tried. |
| 7 | Notion | Partly met | `notion-after.md`: Mike's page rebuilt, with a Projects database and a showcase project with its own Work Items database and Memory. `lore-layout.md`: the Lore layout, 21 of 21 live checks. Still waiting on `ntn login`: open bugs 68 and 69 on Mike's real page and two live API questions. Open bug 70 (board columns and sub-item nesting seen in the Notion app) is left for Mike. |
| 8 | Hindsight | Met | The service runs as a LaunchAgent on `127.0.0.1:8888`. Each project has its own bank. `d-local-hindsight` saved a preference and found it in a later session. The live Hindsight tests passed in this review. |
| 9 | Sample runs | Partly met | Evidence exists for all four setups. On 0.2.2: a passed, b passed with bugs, c not passed, d passed. On the current code: `confirm-d-hindsight` is "Not passed" (three medium problems, I5 to I7); `confirm-claude-local` could not run. The confirmation runs for a and b were still running when this review ended. |
| 10 | Fixes and final review | Not met yet | 67 of 77 findings are fixed and unit-tested, but not confirmed in live sessions. This review found one blocking item (B1). |
| 11 | Report | Not met yet | The lead gives it after this review. |

## Settled decisions

| Decision (`dev/GOAL.md`) | Verdict |
| --- | --- |
| Local repository; GitHub only after Mike's yes | Kept. No remote. |
| Separate from issue 419, with a note on it | Kept. The note is in the issue's comments. |
| Init copies the model, interviews tracker, memory, and Salesforce, and writes `AGENTS.md` and rules to match | Kept (setups above). |
| Salesforce parts only for Salesforce projects | Kept. One small leak of Salesforce paths into a rules table (M5). |
| Port the session skills, `sf-architect-solutioning`, the Plain English style, the general and Salesforce rules, and the memory system | Kept. |
| Hooks and path-scoped rules set up the documented way | Kept. Hook fields, events, matchers, and the exec form match the captured Claude Code and Codex pages. |
| Instruction files follow the model: one root `CLAUDE.md` holding `@AGENTS.md` | Kept. |
| Same stages, body, and design in every tracker; nesting; hand moves noticed | Kept for the local tracker; Notion awaits a live re-run (B1). |
| Local and Notion trackers fully built and tested | Local: kept. Notion: built, unit-tested, not passed live on the current code (B1). |
| Notion page rebuilt: Projects database; per-project Work Items and Memory | Partly (finish item 7). |
| Memory options: built-in, local Hindsight, Notion | Kept. |
| Notion memory in Lore's layout | Kept. |
| Routing approvals (handoff rule wording, two `AGENTS.md` routing lines, bigger skill list budget) | Kept. The generated `AGENTS.md` has both routing lines; settings carry `"skillListingBudgetFraction": 0.02`. |
| Memory additions (proposals, duplicate check, clean deletes, memory test set) | Built, and the test set passes for all three backends. Two of them failed live on the current code (I5, I6). |
| Skill descriptions follow the official guidance | Kept. |
| Hindsight self-hosted, no Docker, no Hindsight Cloud | Kept. The client refuses a URL that is not local. |
| The model is the exact source; a re-runnable copy step | Kept (import check). |
| The 23 approved changes on a branch of the model | Kept. Mike's `main` is untouched. |
| Memory: the toolkit's mechanisms, the model's formats | Kept. |
| Tests stay in scratch folders; never write to Mike's real settings or banks | Not kept in two places (I1 and M3). |
| No AI credit in commits | Kept in this repository. See M1 and M9. |

## Findings

### Blocking

**B1. The goal cannot be called met: the current code has not passed a live
run in three of the five setups.**

- Evidence: every sample run in `dev/test-runs/a-*`, `b-*`, `c-*`, `d-*`, and
  `claude-a` used version 0.2.2. The final fix round changed 67 findings after
  that. `c-notion/evidence.md` ends round 3 with "Verdict: not passed".
  `confirm-claude-local/evidence.md`: "The scenario did not run", because
  `claude auth status` printed `"loggedIn": false`. `confirm-d-hindsight/evidence.md`
  (finished during this review): "Not passed". Notion cannot be re-run until
  `ntn login`.
- Why it matters: finish item 10 says every failure is "fixed and re-tested".
  The 67 fixes are re-tested only by unit tests. The one live run on the
  current code found three new problems.
- Fix: Mike runs `claude auth login` and `ntn login`. Fix I5, I6, and I7. Then
  run the confirmation round for all five setups (local, Salesforce, Notion,
  Hindsight in Codex; local in Claude Code) and save each result in
  `dev/test-runs/`. Finish items 9 and 10 are met only when each run passes.

### Important

**I1. Any session can point Mike's `toolkit` command at any copy of the
toolkit, including an incomplete test copy.**

- Evidence: at about 12:35 EDT, `~/.config/toolkit-v2/plugin-root` named
  `.../scratchpad/budget/plugins/toolkit`, a 0.2.3 test copy with no
  `scaffold/` folder. `~/.local/bin/toolkit --version` printed `0.2.3`.
  `node .../scratchpad/budget/plugins/toolkit/bin/toolkit init --name "Ptr Test" --tracker local --memory builtin`
  failed with "The scaffold conditions file ... CONDITIONS.json could not be
  read: ENOENT". So at that moment `toolkit init` in Mike's terminal, which
  `README.md` tells him to run for a Codex-first project, would have failed.
  At 13:07 the pointer named `~/.codex/plugins/cache/toolkit-v2/toolkit/0.2.4`
  again, written by a Codex session. `confirm-d-hindsight` problem 4 saw the
  same thing.
- Cause, in `plugins/toolkit/lib/hooks/session-start.mjs`: "The pointer is
  refreshed in every folder". `refreshPointer` in `lib/project/machine.mjs`
  accepts any folder that holds `bin/toolkit`. The wrapper in
  `~/.local/bin/toolkit` checks only `$root/bin/toolkit`. On this Mac
  `~/.local/bin` is the first entry on the PATH, and Claude Code puts plugin
  `bin/` folders after the user's own entries
  (`ai-external-knowledge/claude-code/plugins-components.md`). So inside
  Claude Code, too, `toolkit` runs whichever copy the last session start
  named, not the session's own copy. The marketplace text "Its hooks do
  nothing outside a Toolkit V2 project" is also not exact: the hook writes
  this file in every folder.
- Fix: (1) refresh the pointer only inside a Toolkit V2 project, and only
  from an installed copy (under `~/.claude/plugins/cache/toolkit-v2/`,
  `~/.codex/plugins/cache/toolkit-v2/`, or the marketplace source folder);
  never from a folder under a temporary folder; (2) never replace a pointer
  to a higher version with a lower one; (3) in `wrapperScript`, also require
  `$root/scaffold/CONDITIONS.json`, else use the fallback folder; (4) every
  test harness sets `TOOLKIT_V2_CONFIG_DIR` and `HOME` to scratch folders; (5)
  with Mike's yes, run `toolkit machine-setup` once after the confirmation
  round to reset the pointer.

**I2. `README.md` and `AGENTS.md` say Claude Code reads the plugins in place.
It does not: it runs a copy filed under the version.**

- Evidence: `README.md` line 94: "Claude Code reads these plugins straight
  from this folder. A change here shows up in the next session, or after
  `/reload-plugins`." `AGENTS.md` line 161: "Claude Code reads the folder in
  place." The scratch install in this review wrote `installPath`
  `<scratch>/plugins/cache/toolkit-v2/toolkit/0.2.4` to
  `installed_plugins.json`, and that folder is a full copy (regular files,
  `scaffold/` included). The captured page says: "Each version has its own
  cache directory".
- Why it matters: an agent that follows the `AGENTS.md` "Versions" rule
  bumps the version only "for any change Codex must see". A fix without a
  bump never reaches Mike's Claude Code, and nothing reports it.
- Fix: correct both texts. Every shipped change raises the version in both
  manifests. After a change, Claude Code needs
  `claude plugin marketplace update toolkit-v2` and
  `claude plugin update <plugin>@toolkit-v2`, as
  `project-setup/references/repair-and-wiring.md` already says.

**I3. The Codex-first setup in `README.md` cannot work on a new computer.**

- Evidence: "Starting a new project from Codex" says to run `toolkit init` in
  a terminal. In a terminal, `toolkit` exists only after
  `toolkit machine-setup` writes `~/.local/bin/toolkit`, and that command
  cannot be run by name before the wrapper exists. The README's Codex install
  steps never mention machine-setup; they tell Mike to edit
  `~/.codex/config.toml` by hand, which machine-setup does for him.
- Fix: in the README's Codex install steps, after the six
  `codex plugin add` lines, add
  `node /Users/michaelrihm/Documents/Projects/toolkit-v2/plugins/toolkit/bin/toolkit machine-setup`,
  say in one line what it changes, and remove the hand edit.

**I4. Every `toolkit` command runs without asking, including the ones the
skills say need Mike's yes.**

- Evidence: the project settings allow `Bash(toolkit *)`, and
  `.codex/rules/toolkit.rules` allows the `toolkit` prefix outside the
  sandbox. `codex execpolicy check` returned `"decision":"allow"` for
  `toolkit machine-setup` (it changes `~/.codex/config.toml` and writes
  `~/.local/bin/toolkit`) and for
  `toolkit memory delete k --owner-approved` (a built-in memory record is
  deleted from a Git-ignored folder and cannot be brought back). The same
  holds for `toolkit import`, `toolkit memory import` (they replace records),
  and `toolkit hindsight service install` and `start` (a LaunchAgent). The
  flag `--owner-approved` is typed by the agent; only skill text asks for his
  yes first.
- Fix: in `templates/settings/claude-toolkit.json`, add `permissions.ask`
  entries: `Bash(toolkit machine-setup*)`, `Bash(toolkit memory delete *)`,
  `Bash(toolkit import *)`, `Bash(toolkit memory import *)`,
  `Bash(toolkit hindsight service *)`. In `templates/codex/toolkit.rules`, add
  `prefix_rule` entries with `decision = "prompt"` for the same commands. This
  review checked in a copy of the rules file that the narrower rule wins:
  `toolkit machine-setup` and `toolkit memory delete ...` came back
  `"decision":"prompt"`, and `toolkit work list` stayed `"allow"`.

**I5. An unanswered "Save to memory?" is dropped (from the evidence of
`confirm-d-hindsight`, problem 1).**

- Evidence: 3 of 3 tries. After an unanswered question, `toolkit work decisions`
  said "Nothing is waiting on the owner." Mike approved this feature on
  2026-09-27 ("Memory additions", 1). Only skill text asks for the save; no
  hook checks it.
- Fix (as that run suggests): in `memory-save` step 3, save the proposal
  with `--proposal` when the question is asked, then ask; his yes runs
  `toolkit memory approve`, his no runs `toolkit memory reject`. Add a test.

**I6. The duplicate check misses a reworded copy (from the evidence of
`confirm-d-hindsight`, problem 2; reproduced in this review).**

- Evidence: `compareRecords` on "Document every command-line flag in the
  README" against "Explain each command-line flag in the README file" gave
  `{"description":0.444,"body":0.417,"similar":false}`. The cut-off is
  `SIMILAR_AT = 0.6` in `plugins/toolkit/lib/memory/similar.mjs`. A second
  record was saved.
- Fix: compare word stems and treat "each" and "every" as one word; also count
  a record that the backend's search returns first with an overlap of 0.4 or
  more. Add this pair as a test.

**I7. In Codex, a `toolkit` command with an apostrophe written `'\''` does not
work (from the evidence of `confirm-d-hindsight`, problem 3; not re-run in
this review).**

- Evidence: every skill header teaches `'\''`. The Codex tool call dropped the
  backslash ("zsh:1: unmatched '", sessions s05 and s06). Written correctly
  (s19), the command ran inside the sandbox, and the Hindsight request failed
  with EPERM. The same command without an apostrophe reached Hindsight. This
  answers the open question in `dev/PROGRESS.md`. `codex execpolicy check`
  matches the rule when given the words, so the failure is in how Codex splits
  the command text, before the rule is checked.
- Why it matters: in a Codex project with Hindsight or Notion memory, a memory
  save, focus update, or search whose text holds "Mike's" fails.
- Fix: in Codex, tell the agent to write an apostrophe as ’ (U+2019) or reword
  it, in every skill header and in `chainedToolkitNote`
  (`plugins/toolkit/lib/hooks/pre-tool.mjs`). Add a Codex PreToolUse note for
  a `toolkit` command that holds `'\''`, and a test.

**I8. The work tracker and memory exist on one disk, and nothing sets up a
backup on day one.**

- Evidence: the model's `.gitignore` ignores `.memory/` and `/.work-items/`
  (by Mike's model, which wins). `toolkit export` is manual.
  `checkBackup` in `lib/project/checks.mjs` warns only when the last export is
  more than 7 days old, or when a never-exported folder is more than 7 days
  old. Setup never asks for a backup folder; `memory-tidy` asks once, only
  when it runs. Good: the pre-tool hook refuses `git clean -x` in the main
  checkout, and `reset-to-remote` uses `git clean -fd`, which keeps ignored
  files.
- Why it matters: a lost or wiped Mac loses every requirement, approval, and
  history row of every local-tracker project, and all built-in memory.
- Fix: in `project-setup`, ask for the backup folder once and save it as a
  `reference` record. Run `toolkit export` to it at the end of `work-finish`
  and `handoff`, and show the briefing's backup warning after 1 day instead of
  7.

### Minor

**M1. The AI credit guard misses merges, tags, releases, and issues.** Tested:
`git merge --no-ff ... -m "Co-Authored-By: Claude <noreply@anthropic.com>"`,
`git tag -a v1.0 -m "... Generated with Claude Code"`,
`gh release create ... --notes "Generated with Claude Code"`, and
`gh issue create ... --body "Generated with Claude Code"` all passed the
pre-tool hook. `work-finish` writes merge commits with a message. Claude Code's
`attribution` setting is the first defense there; in Codex the hook is the
only one. Fix: extend `checkAiCredit` in `lib/hooks/shell.mjs` to `git merge`,
`git tag`, `git notes`, `gh release create` and `edit`, `gh issue create`,
`edit`, and `comment`, and `gh pr comment`.

**M2. `toolkit memory save` accepts an obvious secret.** Tested:
`--body 'Remember: the staging key is sk-ant-api03-AbCd... and the admin password is hunter2'`
was saved as `reference_staging_api_key`. The CLI checks for email addresses
but not secrets; the "never store secrets" rule is only skill text. With
Notion memory, the text would go to Notion. Fix: refuse a body or description
that matches common key prefixes (`sk-`, `sk-ant-`, `ghp_`, `ntn_`, `xox`,
`AKIA`), a private key header, or "password is/:", with a message that says
where secrets belong.

**M3. Test data is left on Mike's real Hindsight server.** 17 empty banks
`acme-crm`, `acme-crm-2` to `acme-crm-17` (made 2026-09-26), plus
`greet-cli-sample-d`, `-d2`, `-d3`, and `greet-cli-confirm-d`. The current
tests use `tkv2-test-...` names and delete them, so these come from earlier
runs. Fix: list them for Mike and delete them after his yes.

**M4. Doctor warns about the Codex wrapper in a Claude Code-only project.** p3
(hosts `claude-code` only): "~/.config/toolkit-v2/plugin-root is missing, so
the Codex wrapper cannot find the toolkit." It also names `~/.config/...` when
`TOOLKIT_V2_CONFIG_DIR` points elsewhere (`confirm-claude-local` problem 2).
Fix: in `checkComputer`, check the pointer only when the hosts include
`codex`, and build the message from `pointerPath(env)`.

**M5. A non-Salesforce project's `AGENTS.md` names Salesforce paths.** p1's
path-scoped rules table lists `tools/permissions/PERMISSIONS-RUNBOOK.md` and
`delivery/**` for `publish-project-documents.md`. They come from the model
rule's `paths:` list. Harmless. Fix: a model change with Mike's yes, or a
`CONDITIONS.json` line that removes those two paths when Salesforce is off.

**M6. CLI fix lines still show double quotes.** The failed
`toolkit work approve WI-001 --requirements` printed
`toolkit work history WI-001 --note "Owner's words: <quote>"` and
`--text "<goal>"`. Every skill and the pre-tool hook say single quotes. Fix:
use the single-quote form in the messages in `lib/work/ops.mjs` (and the ’
form for Codex, per I7).

**M7. Two routing findings are still open.** From
`dev/test-runs/skill-routing-r3.md`: O21 ("Ask me questions before you write
anything down") opened `work-on` 3 of 3 in Claude Code; the suggested sentence
for `work-on` step 3 was not added. O27 waits on Mike's yes for the
`sf-component-tracker` description (`dev/model-changes.md`, "Needs your
yes"). Fix: add the O21 sentence and re-run those messages.

**M8. `dev/model-review.md` is out of date.** It says "Updated 2026-09-26" and
names branch head `9940854`; the import check reports commit `54c5520`. Fix:
update the date and head, and point to `dev/model-changes.md` for the later
commits.

**M9. Committed evidence quotes AI credit lines.** `dev/test-runs/claude-a/`
(`final/git-log.txt`, `evidence.md`, `sessions/*.jsonl`) and
`dev/test-runs/open-bugs.md` hold the exact trailer
`Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`. It is
evidence of a bug, not a credit for this repository, but a search of the
repository finds it. Fix: before any GitHub repository exists, replace the
quoted trailer with "<AI co-author line>".

**M10. Doctor checks that a Codex hook trust entry exists, not that it is
current.** Codex stores a `trusted_hash` for each hook in
`~/.codex/config.toml`. `codexHookTrustKeys` in `lib/project/hosts.mjs`
checks only the key. After a hook change, Codex may skip the hooks while
doctor reports them trusted. The key format for the V2 hooks is still
unverified (open bug 51). Fix: after Mike trusts the hooks, record the hash
of `hooks/codex-hooks.json` beside the check, and warn when the file changed
since.

**M11. `memory-find` points at a file in another plugin.** It says "read the
issues as the work plugin's `references/trackers.md` says". `AGENTS.md` says a
plugin cannot use a file outside its own folder, and an installed copy has no
path to it. Doctor's GitHub and Jira note prints an absolute path, which
helps. Fix: copy the few lines the memory skill needs into its own
`references/`, or name the command that prints the path.

## Hooks: what was tried for "could they block normal work?"

Nothing below was refused wrongly. Refused, as designed: `git clean -fdx`,
`git add .`, `git add -A src/`, `git push --force-with-lease`, a commit with an
AI co-author, a toolkit command with a backtick inside double quotes, and a
hand-made `DESIGN.md` inside `.work-items/`. Let through: `git clean -fd`,
`git add src/ tests/`, `git stash`, a commit with a human co-author, a commit
saying "Generated with make fixtures", reads of `MEMORY.md` and
`DASHBOARD.md`, writes to `docs/DESIGN.md`, `docs/INDEX.md`, and
`src/INDEX.md`, `git mv docs/MEMORY.md`, `npx prettier --write "**/*.md"`,
and a notes file inside an item folder. The Stop hook blocks at most once per
turn. The Salesforce guard let `ls -la` and `npm test` through at once, and
refused a deploy to an alias it could not classify.

## Not checked in this review

- Anything that needs Notion (signed out) or a model reply in Claude Code
  (signed out).
- The confirmation runs for Codex local and Salesforce, still running at
  13:18 EDT.
- Which of the two "Plain English" output styles Claude Code applies (already
  on Mike's checklist in `dev/model-review.md`).

## What this review left behind

All test projects, the scratch Claude Code and Codex homes, and the test
rules file are in this session's scratch folder. A secret-looking test record
was saved only in the scratch project p1. Nothing was written to Mike's
`~/.claude`, `~/.codex`, `~/.config/toolkit-v2`, Notion, the model folders, or
`claude-toolkit`. One `toolkit doctor` run read Mike's real
`~/.config/toolkit-v2` and `~/.codex/config.toml`; it wrote nothing. The test
suite made and deleted its own `tkv2-test-...` banks on the local Hindsight
server, as `AGENTS.md` allows; none is left.

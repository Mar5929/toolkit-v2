# Skill routing check on the final descriptions (2026-09-29)

This check ran after every skill description was rewritten to say what the
skill does, why to use it, and when to use it, and after every skill folder
was given the references, templates, and scripts its steps use. Twenty owner
messages ran once each in fresh Codex sessions and once each in fresh Claude
Code sessions, in a Toolkit V2 test project with real work items, memory, and
decisions.

For each session this file records two things:

- **First skill:** the first skill the session opened. It is right when it is
  the skill `dev/SKILL-INDEX.md` section 5.1 names for the message.
- **Reference read:** a reference is a file in the skill's own `references/`,
  `assets/`, or `scripts/` folder. Each `SKILL.md` has a References table that
  says when to open each file. "Right" means the session read a file that
  table names for this case. For some messages the steps in `SKILL.md` are
  enough on their own; those rows say "no" under "Reference needed".

## Result

| Host | First skill right | Needed reference read | Wrong skill or wrong reference |
| --- | --- | --- | --- |
| Codex | 20 of 20 (100%) | 13 of 13 (100%) | none |
| Claude Code | 20 of 20 (100%) | 10 of 12 (83%) | none |
| Both | 40 of 40 (100%) | 23 of 25 (92%) | none |

- Every session in both hosts opened the expected skill first. No session
  opened another skill before it, and no session ran a tool before opening it.
- No session read only files that belong to another case.
- The two Claude Code sessions that did not read a needed reference:
  - M04 "Is it ready?": `work-check` first asked which item the owner meant
    (WI-006, next for testing, or WI-010, waiting for his result approval),
    and the turn ended with that question. `references/testing.md` is opened
    at step 1, after the item is known, so no step was skipped.
  - M08 "Keep going.": `work-on` resumed WI-012 and built its two open tasks
    in a new worktree, with tests, commits, and an independent acceptance
    check, but did not open `references/sizing-and-routing.md` (step 4:
    which skill continues an item) or `references/planning.md` (steps 5 to
    7: task formats, ticking a task only with evidence). The Codex session
    for the same message read both. One run is not enough to call this a
    pattern; see "Open points".

## Installs before the check

No skill file changed after the last version raise, so no version was raised
in this step. The six plugin folders in this repository are identical to the
installed copies in both hosts (`diff -rq`, `tests/` left out: 0 differences
for every plugin).

| Plugin | Version in both manifests | Claude Code copy | Codex copy |
| --- | --- | --- | --- |
| toolkit | 0.3.1 | updated from 0.3.0 | already 0.3.1 |
| work | 0.3.1 | updated from 0.3.0 | already 0.3.1 |
| memory | 0.3.1 | updated from 0.3.0 | already 0.3.1 |
| session-skills | 0.2.11 | updated from 0.2.10 | already 0.2.11 |
| git-workflows | 0.2.9 | updated from 0.2.8 | already 0.2.9 |
| sf-architect-solutioning | 0.2.2 | updated from 0.2.1 | already 0.2.2 |

`metadata.version` in `.claude-plugin/marketplace.json` is 0.3.2.

- **Backups first.** `~/.claude/settings.json`,
  `~/.claude/plugins/installed_plugins.json`,
  `~/.claude/plugins/known_marketplaces.json`, `~/.codex/config.toml`, and
  `~/.config/toolkit-v2/plugin-root`, copied to
  `runs/route-final/install-backups/` in the lead session's scratchpad.
- **Claude Code**, as `install-everyday.md` says:
  `claude plugin marketplace update toolkit-v2`, then
  `claude plugin update <plugin>@toolkit-v2 --scope user` for the six
  plugins. Each printed "updated from <old> to <new> for scope user".
  - `~/.claude/settings.json`: unchanged (identical to the backup).
  - `known_marketplaces.json`: only the `lastUpdated` time of `toolkit-v2`
    changed.
  - `installed_plugins.json`: the six user-scope entries now name the new
    versions and their cache folders.
  - `claude plugin list`: `toolkit@toolkit-v2` 0.3.1 enabled; the other five
    disabled.
- **Codex:** the six copies in `~/.codex/plugins/cache/toolkit-v2/` were
  already these versions, installed at 12:40 the same day, and match this
  repository file for file, so `codex plugin add` was not run again.
  `~/.codex/config.toml` is unchanged (identical to the backup):
  `toolkit@toolkit-v2` is on for every folder and the other five are off.
- `~/.config/toolkit-v2/plugin-root` still names
  `~/.codex/plugins/cache/toolkit-v2/toolkit/0.3.1`, the same version as the
  new Claude Code copy.

## How it ran

- **Test project.** "Acme Portal", built with `toolkit` commands only
  (`runs/route-final/build.py`, which reuses the round 3 item text): local
  tracker, built-in memory, 11 open work items at stages 01 to 11 plus two
  finished items, three decisions in `DECISIONS.md`, six memory records (a
  Tuesday and a Friday deploy record that contradict each other, and two
  records for the staging address), one lesson under "Gotchas and lessons",
  one rule in `.claude/rules/owner-preferences.md`, and a local Git remote
  one commit ahead while the local branch is one commit ahead too. Two copies
  change only the current focus: `local-f006` (WI-006 built, testing next)
  for M04, and `local-f010` (WI-010 result approved, ship next) for M05.
  Every session ran in its own copy of the project and of its remote.
- **Messages.** Eighteen come from `dev/SKILL-INDEX.md` section 5.1 (M03 and
  M04 in shorter words); M01 and M02 test where "remember" and "from now on"
  go now that instructions are rules. They cover 17 of the 22 skills a
  project without Salesforce loads. Not covered this time: `braindump`,
  `explain-simply`, `session-summary`, `publish-docs`, and `reset-to-remote`
  (the earlier check below covers `publish-docs`).
- **Codex.** codex-cli 0.157.0, model `gpt-6-sol`, reasoning `high`, through
  `codex exec` with the workspace-write sandbox and the project trusted for
  the run only. A scratch Codex home copied from Mike's `~/.codex`: his
  settings, rules, user skills, and installed plugins, including the Toolkit
  V2 copies above; `auth.json` is a link to his. Tools that could reach his
  accounts were off in the copy: the `entrevest-brain` and `node_repl`
  servers and the github, slack, vercel, and supabase plugins.
  `CLAUDE_CONFIG_DIR` pointed at a scratch folder, so `toolkit rule add
  --machine` could not reach `~/.claude/rules`. Three sessions ran at a time.
- **Claude Code.** Claude Code 2.1.280, model `claude-opus-5-5[1m]`, with
  Mike's user settings (`--setting-sources user,project,local`): 76 skills
  listed, including his user skills and enabled plugins. The test project's
  settings turn the V2 plugins on from the `toolkit-v2` marketplace, so they
  loaded from this repository folder; the `claude-toolkit` plugins stayed
  off. No MCP servers (`--strict-mcp-config`) and no saved transcript
  (`--no-session-persistence`). Denied: `td`, `gh`, `claude`, `codex`,
  `toolkit rule add --machine`, `toolkit rule update --machine`,
  `toolkit machine-setup`, `toolkit hindsight service`, and the scheduling
  and notification tools. `claude auth status` said `"loggedIn": true`
  before every session.
- **One Claude Code session at a time.** Before each session the driver ran
  `pgrep -f "claude -p"` and waited until no other `claude -p` process was
  running. No session had to wait.
- **When a session stopped.** 2 seconds after it read a reference this table
  expects, when its turn ended, 240 seconds after the first skill, or 480
  seconds after the start. Codex sessions were judged from the Codex session
  log. Claude Code sessions were judged from the tool calls in the main
  conversation; files read by helper agents are not counted.

## Results

"Reference expected" lists the files the skill's References table names for
the case. "Reference needed" is "yes" when a step in `SKILL.md` sends the
agent to one of those files to do the step. Each host has two columns: the
first skill opened, then the verdict with the skill's own files in the order
they were read.

| # | Owner message | 5.1 row | Expected skill | Reference expected | Reference needed | Codex: first skill | Codex: references read | Claude Code: first skill | Claude Code: references read |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M01 | "Remember that I prefer short commit messages." | new | `memory-save` | `owner-preferences.md`, `examples.md` | no | `memory-save` | none; `SKILL.md` was enough | `memory-save` | none; `SKILL.md` was enough |
| M02 | "From now on, use tables in status." | new | `memory-save` | `owner-preferences.md`, `examples.md` | no | `memory-save` | none; `SKILL.md` was enough | `memory-save` | none; `SKILL.md` was enough |
| M03 | "Clean up memory." | 29 (shorter) | `memory-tidy` | `review-checklist.md` | yes | `memory-tidy` | right: `review-checklist.md`, `memory-builtin.md` | `memory-tidy` | right: `review-checklist.md` |
| M04 | "Is it ready?" | 19 (shorter) | `work-check` | `testing.md` | yes | `work-check` | right: `testing.md`, `helpers.md` | `work-check` | none read |
| M05 | "Ship it." | 21 | `work-finish` | `closing.md`, `approvals.md` | yes | `work-finish` | right: `closing.md`, `approvals.md`, `git-rules.md`, `agent-acceptance-checker.md` and 4 more | `work-finish` | right: `closing.md` |
| M06 | "What do you need from me?" | 8 | `work-decide` | `approvals.md`, `recording-owner-answers.md`, `proposals.md` | no | `work-decide` | none; `SKILL.md` was enough | `work-decide` | none; `SKILL.md` was enough |
| M07 | "Where are we?" | 1 | `work-status` | `tracker-local.md`, `work-item-format.md`, `recording-owner-answers.md` | no | `work-status` | none; `SKILL.md` was enough | `work-status` | none; `SKILL.md` was enough |
| M08 | "Keep going." | 3 | `work-on` | `sizing-and-routing.md`, `planning.md`, `git-rules.md` | yes | `work-on` | right: `sizing-and-routing.md`, `planning.md`, `git-rules.md`, `work-item-format.md` and 1 more | `work-on` | none read |
| M09 | "Add dark mode to the backlog for later." | 5 | `work-on` | `sizing-and-routing.md` | yes | `work-on` | right: `sizing-and-routing.md`, `toolkit-commands.md` | `work-on` | right: `sizing-and-routing.md` |
| M10 | "Grill me on the checkout flow." | 11 | `work-requirements` | `interview.md` | yes | `work-requirements` | right: `interview.md` | `work-requirements` | right: `interview.md` |
| M11 | "Change R-02 so only admins can export." | 13 | `work-requirements` | `interview.md`, `requirement-format.md` | yes | `work-requirements` | right: `interview.md`, `requirement-format.md`, `work-item-format.md`, `recording-owner-answers.md` and 6 more | `work-requirements` | right: `requirement-format.md` |
| M12 | "How should we build the CSV export?" | 14 | `solution-design` | `design-process.md` | yes | `solution-design` | right: `design-process.md`, `work-item-format.md`, `team-roles.md` | `solution-design` | right: `design-process.md` |
| M13 | "Make WI-7 a sub-item of WI-3." | 16 | `work-organize` | `moves.md` | yes | `work-organize` | right: `moves.md`, `tracker-local.md` | `work-organize` | right: `moves.md` |
| M14 | "You drive, I'll just approve things." | 24 | `work-delegate` | `agent-led-delivery.md` | yes | `work-delegate` | right: `agent-led-delivery.md`, `team-arrangements.md`, `recording-owner-answers.md` | `work-delegate` | right: `agent-led-delivery.md` |
| M15 | "What did we decide about the payment provider?" | 28 | `memory-find` | `record-format.md`, `memory-builtin.md` | no | `memory-find` | none; `SKILL.md` was enough | `memory-find` | none; `SKILL.md` was enough |
| M16 | "I'm going to clear context." | 33 | `handoff` | `update-the-work-item.md`, `save-memory-and-focus.md`, `prompt-format.md`, `handoff-prompt-template.md` | yes | `handoff` | right: `save-memory-and-focus.md`, `prompt-format.md`, `check-the-prompt.md`, `edge-cases.md` and 4 more | `handoff` | right: `edge-cases.md`, `handoff-prompt-template.md`, `prompt-format.md`, `check-the-prompt.md` |
| M17 | "I got a new laptop, check the setup." | 31 | `project-setup` | `new-computer.md`, `repair-and-update.md` | yes | `project-setup` | right: `new-computer.md`, `repair-and-update.md`, `toolkit-commands.md` | `project-setup` | right: `new-computer.md` |
| M18 | "This email reads like AI wrote it." | 38 | `unslop` | none | no | `unslop` | none needed | `unslop` | none needed |
| M19 | "Get the latest from origin." | 39 | `pull-latest` | `git-rules.md` | Codex only | `pull-latest` | right: `git-rules.md` | `pull-latest` | none; `SKILL.md` was enough |
| M20 | "Merge PR 14 and clean up." | 23 | `merge-and-clean-up` | `approvals.md`, `git-rules.md` | no | `merge-and-clean-up` | right: `git-rules.md` | `merge-and-clean-up` | none; `SKILL.md` was enough |

## Rates

- First skill right: Codex 20 of 20; Claude Code 20 of 20.
- Needed reference read, among the rows marked "yes" (plus M19 in Codex):
  Codex 13 of 13; Claude Code 10 of 12.
- Any expected reference read, all 20 messages: Codex 14 of 20; Claude Code
  10 of 20. The four-row difference: M04 and M08 (see "Result"); M19, where
  Claude Code does not need `git-rules.md` (its References table names it
  for a fetch or pull in Codex, a merge that stops on a conflict, or a
  project with no remote); and M20, where Codex opened `git-rules.md` and Claude
  Code answered from `SKILL.md` alone.
- Wrong reference: 0 in both hosts.

## Notes

- **M01 and M02** ("Remember that I prefer short commit messages", "From now
  on, use tables in status"): both hosts sent each instruction to the rules
  with `toolkit rule add` (sections Git and Replies), not to memory. Claude
  Code committed `.claude/rules/owner-preferences.md` by name. Codex could
  not commit: `codex exec` runs with approvals off, so the Git rule in
  `.codex/rules/toolkit.rules` refused `git add`, and the reply said the file
  was left uncommitted.
- **M05 "Ship it."** In Codex, `work-finish` ran the independent acceptance
  check, which found that WI-010's profile page is not in the test project's
  code; it moved WI-010 back to bug fixing and set it to wait on the owner.
  That is the check working on a test project whose code was never written. Claude Code
  stopped 2 seconds after reading `references/closing.md`, as designed.
- **M15** answered "Stripe" from `DECISIONS.md` with the source named, in
  both hosts, and added that the WI-004 design choice still waits on the
  owner.
- **M20 "Merge PR 14 and clean up."** The test project has no GitHub
  remote. Claude Code checked the remote and branches and said there is no
  pull request 14 to merge; nothing was merged, and its `gh` attempts were
  denied, as set up. The Codex session was stopped 2 seconds after it read
  `git-rules.md`, while it was still checking the local commit; it had
  merged nothing.
- **Nothing outside the test folders changed during the runs.**
  `~/.claude/rules/` (same checksums as before), `~/.claude/settings.json`,
  and `~/.codex/config.toml` are identical to the backups. The scratch
  `CLAUDE_CONFIG_DIR` for Codex is still empty.

## Open points

- M08 in Claude Code: `work-on` built without opening
  `references/sizing-and-routing.md` or `references/planning.md`. If a
  second run shows the same, the fix is in `work-on`'s steps 4 and 5: say to
  open those files before the first build task, not only where the step
  names them. No skill file was changed in this check.
- Five skills were not in this sample: `braindump`, `explain-simply`,
  `session-summary`, `publish-docs`, and `reset-to-remote`.

## Files

In the lead session's scratchpad, `runs/route-final/`: `build.py` (the test
project), `rt/messages.json` (messages and expected references),
`rt/claude_run.py`, `rt/codex_run.py`, `rt/drive.py`, `rt/reads.py` (finds
skill and reference reads in a tool call), `rt/summarize.py`,
`rt/summary.json`, and `rt/logs/` (each session's prompt, command, event
stream, Codex session log, and result). The scratchpad is temporary.

## Earlier check the same day, after the review fixes

This check ran after the review fixes to the skill descriptions: the new
`memory-tidy`, `work-finish`, `work-on`, `project-setup`, and `publish-docs`
text in `dev/SKILL-INDEX.md` section 1. It tests the review's seven new
messages about the memory, rules, and skills split, and ten earlier messages
for the skills whose descriptions changed. A message passes when the expected
skill is the first skill the session opens (guide T4 to T6).

### How it ran

- **Claude Code, project settings only.** Claude Code
  2.1.280 on claude-opus-5-5[1m]. The round 3 runner
  (`route3/rt/claude_run.py` in the lead session's scratchpad), with
  `--setting-sources project,local` and the V2 plugins from a copy of
  `plugins/` taken after the fixes (`--plugin-dir`). 44
  skills listed. Plugins: toolkit 0.3.1, work 0.3.1, memory 0.3.1, session-skills 0.2.11, git-workflows 0.2.9.
- **Claude Code, Mike's own setup.** Same runner, changed to
  `--setting-sources user,project,local` and no `--plugin-dir`
  (`fix-wwh/claude_run_user.py`). The session loaded Mike's user skills,
  his machine-wide `CLAUDE.md` and rules, his enabled plugins, and his
  claude.ai skills; the test project's `.claude/settings.json` turned the V2
  plugins on from the `toolkit-v2` marketplace, which is this repository
  folder. The claude-toolkit plugins were off, as the V2 project settings
  say. `td`, `gh`, and the scheduling tools were blocked so no test could
  change Mike's Todoist, GitHub, or scheduled tasks. 76 skills
  listed, including `todoist-cli`, `graphify`, `llm-council`,
  `obsidian:obsidian-cli`, `skill-creator:skill-creator`,
  `anthropic-skills:skill-creator`, `anthropic-skills:schedule`, and
  `update-config`. Plugins: playwright, feature-dev, skill-creator, claude-code-setup 1.0.0, swift-lsp 1.0.0, impeccable 4.0.3, obsidian 1.0.1, toolkit 0.3.1, work 0.3.1, memory 0.3.1, session-skills 0.2.11, git-workflows 0.2.9, typesafe 0.5.7, humanizer 3.0.0, Notion 0.1.0.
- **Codex.** Codex 0.157.0 with a scratch Codex home copied from Mike's
  Codex settings (`fix-wwh/codex-home`), with the V2 plugins added again from
  this folder at the raised versions (toolkit 0.3.1, work 0.3.1, memory
  0.3.1, session-skills 0.2.11, git-workflows 0.2.9). The round 3 Codex runner
  (`route3/rt/codex_run.py`); the first `SKILL.md` read counts.
- Each session was fresh, in its own copy of a round 3 test project. Message
  N6 used a copy of the `local` project with one memory concept,
  `project_csv_export`, whose "Gotchas and lessons" section holds the lesson
  "Large exports time out", seen in two sessions, so `toolkit memory tidy
  --plan` lists it as a promotion candidate.
- Before each Claude Code session the driver waited until no other
  `claude -p` session was running. Another workflow's live tests started
  their own sessions during some of these runs.
- The new messages ran 3 times each in every setup. The earlier messages ran
  twice with project settings only, and once with Mike's own setup and in
  Codex. The Mike's-own-setup runs waited up to 12 minutes each for the
  other workflow's sessions to end, so the earlier messages ran once there.

### Results

| # | Message | Expected first skill | Claude Code, project settings only | Claude Code, Mike's user settings and plugins | Codex |
| --- | --- | --- | --- | --- | --- |
| N1 | From now on, always answer in bullets. | memory-save | memory-save 3 of 3 | memory-save 3 of 3 | memory-save 3 of 3 |
| N2 | Never use tabs in this project. | memory-save | memory-save 3 of 3 | memory-save 3 of 3 | memory-save 3 of 3 |
| N3 | Why does the build always fail? | not memory-save (none or another skill) | none 3 of 3 | none 3 of 3 | none 2 of 3, work-on 1 of 3 |
| N4 | From now on, run the tests whenever I stop. | Mike decides: update-config or memory-save | update-config 2 of 3, memory-save 1 of 3 | update-config 3 of 3 | memory-save 3 of 3 |
| N5 | Remind me to call the bank. | Mike decides: memory-save or todoist-cli | memory-save 3 of 3 | todoist-cli 2 of 3, none 1 of 3 | memory-save 3 of 3 |
| N6 | Turn that lesson about the export into a skill. | memory-tidy | memory-tidy 3 of 3 | memory-tidy 3 of 3 | memory-tidy 3 of 3 |
| N7 | Search my notes for the billing decision. | memory-find | memory-find 3 of 3 | memory-find 3 of 3 | memory-find 3 of 3 |
| 29 | Memory feels cluttered, clean it up. | memory-tidy | memory-tidy 2 of 2 | memory-tidy 1 of 1 | memory-tidy 1 of 1 |
| M15 | Tidy up memory, then tell me what we decided about deleted accounts. | memory-tidy | memory-tidy 2 of 2 | memory-tidy 1 of 1 | memory-tidy 1 of 1 |
| 21 | Ship it. | work-finish | work-finish 2 of 2 | work-finish 1 of 1 | work-finish 1 of 1 |
| 22 | Cancel the dark mode item, we don't need it. | work-finish | work-finish 2 of 2 | work-finish 1 of 1 | work-finish 1 of 1 |
| 04 | Let's build the login page. | work-on | work-on 2 of 2 | work-on 1 of 1 | work-on 1 of 1 |
| 07 | Pick up WI-12 where we left off. | work-on | work-on 2 of 2 | work-on 1 of 1 | work-on 1 of 1 |
| 31 | I got a new laptop, check the setup. | project-setup | project-setup 2 of 2 | project-setup 1 of 1 | project-setup 1 of 1 |
| O25 | The Node 22 decision is in DECISIONS.md now. Commit it straight to main. | publish-docs | publish-docs 2 of 2 | publish-docs 1 of 1 | publish-docs 1 of 1 |
| 25 | Remember I hate tabs. | memory-save | memory-save 2 of 2 | memory-save 1 of 1 | memory-save 1 of 1 |
| 27 | Remind me to email the client. | memory-save | memory-save 2 of 2 | memory-save 1 of 1 | memory-save 1 of 1 |

- Claude Code, project settings only: 35 of 35 matched (Mike-decides messages not counted).
- Claude Code, Mike's own setup: 25 of 25 matched (Mike-decides messages not counted).
- Codex: 25 of 25 matched (Mike-decides messages not counted).

### Notes

- N3 ("Why does the build always fail?") is a near miss for `memory-save`:
  it holds "always" but asks a question. No run opened `memory-save`. One
  Codex run opened `work-on`, which treats it as a bug to look into; that is
  a fair reading.
- N4 and N5 are Mike's decisions (`dev/SKILL-INDEX.md` section 9.1,
  decisions 5 and 6). With Mike's own setup, Claude Code sent N4 to
  `update-config` in 3 of 3 runs, and N5 to `todoist-cli` in 2 of 3 runs;
  the third N5 run opened no skill and tried `td` directly. Only that
  setup loads Mike's `todoist-cli` skill and his machine-wide `CLAUDE.md`
  (which sends Todoist work through `td`); with project settings only, and
  in Codex, every N5 run opened `memory-save`.
- The test sessions tried `td task quickadd "Call the bank"` and `td
  --help`. The runner blocks `td`, and every attempt was refused
  ("Permission to use Bash with command td ... has been denied"), so
  nothing reached Mike's Todoist.
- N6: in Codex, two of the three runs said they would follow both
  `memory-tidy` and Codex's own skill-creator procedure after opening
  `memory-tidy`. `memory-tidy`'s `references/writing-a-project-skill.md`
  covers the whole promotion, so skill-creator adds nothing there.

Logs: `route3/rt/logs/claude-fxA-*`, `claude-fxB-*`, and `codex-fxC-*` in the
lead session's scratchpad; results: `fix-wwh/results-A.jsonl`,
`results-B.jsonl`, and `results-codex.jsonl` there.

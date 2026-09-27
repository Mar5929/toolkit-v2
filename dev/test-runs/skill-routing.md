# Skill routing check (2026-09-27)

Each owner message from `dev/SKILL-INDEX.md` section 5.1 (all 43) plus 5
messages that should start no toolkit skill ran once as a fresh session in
Claude Code and once in Codex. The skill each agent opened first was compared
with the skill the index expects.

**Result: not passed.**

| Host | First skill matched | Rate | Should start a skill | Should start none |
| --- | --- | --- | --- | --- |
| Claude Code 2.1.280 | 39 of 48 | 81% | 34 of 43 | 5 of 5 |
| Codex 0.157.0 | 45 of 48 | 94% | 41 of 43 | 4 of 5 |

- Claude Code is below the 90 percent bar.
- Two Codex mismatches (42 and 43) come from two toolkit skills that both
  claim the message.
- No mismatch in either host came from a skill outside the toolkit. Across
  every run in this check (68 Claude Code sessions, 52 Codex sessions), no
  skill outside the V2 plugins and the Salesforce project skills was opened.

## How the check ran

### Test projects

Scratch folder (temporary):
`/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/`
(called `$R` below).

- `$R/routing`: `git init`, then
  `toolkit init --name routing --tracker local --memory builtin`, then one
  work item: WI-001 "CSV export of customer records", type `build`, stage
  `02-refinement`, with Open Questions row Q-01 "Should the CSV export include
  archived customer records, or only active ones?" for the owner, and
  `waiting_on: owner`. The setup was committed in the scratch repository.
  `toolkit brief` then listed Q-01 under "Waiting on the owner" with
  `(work-decide)`.
- `$R/routing-sf`: the same, with `--salesforce`, for messages 41 to 43.
  WI-001 there is "Account address sync" with an open owner question.
- Every session ran in its own copy of the project
  (`$R/rt/sessions/<host>-<id>`), so no session saw another session's changes.

### Claude Code

Command, run from the session's project copy:

```sh
claude -p --setting-sources project,local \
  --settings '{"enabledPlugins":{"toolkit@inline":true,"work@inline":true,"memory@inline":true,"session-skills@inline":true,"git-workflows@inline":true}}' \
  --plugin-dir <toolkit-v2>/plugins/toolkit --plugin-dir <toolkit-v2>/plugins/work \
  --plugin-dir <toolkit-v2>/plugins/memory --plugin-dir <toolkit-v2>/plugins/session-skills \
  --plugin-dir <toolkit-v2>/plugins/git-workflows \
  --output-format stream-json --verbose --permission-mode acceptEdits --max-turns 3 \
  --allowedTools 'Bash(toolkit *)' 'Bash(node *)' 'Bash(git *)' Read Write Edit Glob Grep Skill \
  -- "<message>" < /dev/null
```

Salesforce messages added `--plugin-dir <toolkit-v2>/plugins/sf-architect-solutioning`
and `"sf-architect-solutioning@inline":true`.

The `--settings` line is not in the command the task gave. Without it the V2
plugins load switched off, so the check would have tested nothing. See
finding 1 below.

Isolation, from the `system/init` event of all 68 Claude Code sessions:

- `plugins` held exactly `toolkit@inline`, `work@inline`, `memory@inline`,
  `session-skills@inline`, `git-workflows@inline` (plus
  `sf-architect-solutioning@inline` in the Salesforce project) and Claude
  Code's three built-in plugins (`agents-md`, `telemetry`,
  `plugin-authoring`). No `claude-toolkit` plugin and no other user plugin.
- No `plugin_errors` key in any session.
- `skills` listed the 22 V2 skills (26 in the Salesforce project, with the 3
  project skills from `.claude/skills/`) and Claude Code's built-in skills
  (for example `schedule`, `debug`, `code-review`, `verify`). None of Mike's
  user skills from `~/.claude/skills/` were listed.
- The SessionStart hook ran in every session (`hook_response` event with the
  "Project briefing").

First skill: the first `Skill` tool call in the main conversation (a `Read` of
a `SKILL.md` file would also have counted; none happened). "No skill" means
the session ended, or used its 3 turns, without opening one.

### Codex

Command:

```sh
codex exec --json --dangerously-bypass-hook-trust --sandbox workspace-write \
  -c 'notify=[]' -c 'projects={"<session folder>"={trust_level="trusted"}}' \
  -C <session folder> "<message>" < /dev/null
```

- The `projects=` override trusts the folder for one run only, as
  `codex-setup.md` describes. `~/.codex/config.toml` was not changed.
  `notify=[]` stops a desktop notification per run.
- Codex ran its cached plugin copies (`toolkit`, `work`, `memory`,
  `git-workflows` 0.2.2; `session-skills`, `sf-architect-solutioning` 0.2.0).
  Their `skills/` folders are identical to the source folders (checked with
  `diff -rq`).
- Every session's skill listing held the 22 V2 skills (26 in the Salesforce
  project) and no `claude-toolkit` skill. Every session got the "Project
  briefing" from the SessionStart hook.
- First skill: the first tool call whose input reads a `SKILL.md` file, taken
  from the session log in `~/.codex/sessions/`. The `--json` event stream
  alone is not enough: Codex issues most commands through its `exec` tool, and
  those commands do not appear as `command_execution` events. The runner
  stopped each session 2 seconds after the first `SKILL.md` read, or when the
  turn ended, or after 300 seconds.
- Codex often reads several `SKILL.md` files in one call (several commands run
  together). The skill listed first in that call is counted as first; the
  others are listed in the table.

### Match rule

A match is the expected skill opened first. For "none" messages, a match is no
toolkit skill opened. Message 36 in the index ends in "..."; the test filled it
with a real brain dump (see the table).

## Results

"no skill" = the agent opened no skill. "+" = other skills Codex opened in the
same call as the first one.

| # | Owner message | Expected | Claude Code | Codex | Match (Claude / Codex) |
| --- | --- | --- | --- | --- | --- |
| 1 | Where are we? | work-status | work-status | work-status | yes / yes |
| 2 | What's next? | work-status | work-status | work-status | yes / yes |
| 3 | Keep going. | work-on | work-on | work-on | yes / yes |
| 4 | Let's build the login page. | work-on | work-on | work-on | yes / yes |
| 5 | Add dark mode to the backlog for later. | work-on | work-on | work-on | yes / yes |
| 6 | Log a bug: the export button does nothing. Not now. | work-on | work-on | work-on | yes / yes |
| 7 | Pick up WI-12 where we left off. | work-on | no skill | work-on | no / yes |
| 8 | What do you need from me? | work-decide | work-decide | work-decide | yes / yes |
| 9 | Approved, go with option B. | work-decide | work-decide | work-decide | yes / yes |
| 10 | We've decided to use Postgres everywhere. | work-decide | work-decide | work-decide | yes / yes |
| 11 | Grill me on the checkout flow. | work-requirements | work-requirements | work-requirements (+ work-on) | yes / yes |
| 12 | Check the spec before you build. | work-requirements | no skill | work-requirements | no / yes |
| 13 | Change R-02 so only admins can export. | work-requirements | work-requirements | work-requirements (+ work-on) | yes / yes |
| 14 | How should we build the CSV export? | solution-design | solution-design | solution-design | yes / yes |
| 15 | Split this into smaller pieces. | work-organize | work-organize | work-organize | yes / yes |
| 16 | Make WI-7 a sub-item of WI-3. | work-organize | work-organize | work-organize | yes / yes |
| 17 | I moved some folders around. | work-organize | work-organize | work-organize | yes / yes |
| 18 | I dragged a card to Done in Notion. | work-organize | no skill | work-organize | no / yes |
| 19 | Is this ready to ship? | work-check | no skill | work-check | no / yes |
| 20 | Test it against what I asked for. | work-check | work-check | work-check | yes / yes |
| 21 | Ship it. | work-finish | work-finish | work-finish (+ work-decide) | yes / yes |
| 22 | Cancel the dark mode item, we don't need it. | work-finish | no skill | work-finish | no / yes |
| 23 | Merge PR 14 and clean up. | merge-and-clean-up | merge-and-clean-up | merge-and-clean-up | yes / yes |
| 24 | You drive, I'll just approve things. | work-delegate | work-delegate | work-delegate | yes / yes |
| 25 | Remember I hate tabs. | memory-save | memory-save | memory-save | yes / yes |
| 26 | Forget what I said about tabs. | memory-save | memory-save | memory-save | yes / yes |
| 27 | Remind me to email the client. | memory-save | memory-save | memory-save | yes / yes |
| 28 | What did we decide about the payment provider? | memory-find | memory-find | memory-find | yes / yes |
| 29 | Memory feels cluttered, clean it up. | memory-tidy | memory-tidy | memory-tidy | yes / yes |
| 30 | Set up this new repo. | project-setup | project-setup | project-setup | yes / yes |
| 31 | I got a new laptop, check the setup. | project-setup | project-setup | project-setup | yes / yes |
| 32 | Update the toolkit in this project. | project-setup | project-setup | project-setup | yes / yes |
| 33 | I'm going to clear context. | handoff | handoff | handoff | yes / yes |
| 34 | Recap this chat. | session-summary | session-summary | session-summary | yes / yes |
| 35 | What did we do today? | session-summary | no skill | session-summary | no / yes |
| 36 | Here's a brain dump: I want the app to email a weekly summary, maybe with a chart, skip anyone who opted out, and I'm not sure if it should go Monday or Friday. | braindump | braindump | braindump | yes / yes |
| 37 | Explain that like I'm five. | explain-simply | explain-simply | explain-simply | yes / yes |
| 38 | This email reads like AI wrote it. | unslop | no skill | unslop | no / yes |
| 39 | Get the latest from origin. | pull-latest | pull-latest | pull-latest | yes / yes |
| 40 | Wipe local and match remote exactly. | reset-to-remote | reset-to-remote | reset-to-remote | yes / yes |
| 41 | Deploy it to the UAT sandbox. (Salesforce) | work-finish | no skill | work-finish (+ handoff, merge-and-clean-up, work-on) | no / yes |
| 42 | Load these 500 contacts into production. (Salesforce) | sf-data-change | sf-data-change | work-on (+ sf-data-change) | yes / no |
| 43 | Which Flow type fits this? (Salesforce) | sf-architect-solutioning | no skill | solution-design (+ work-on, sf-architect-solutioning) | no / no |
| N1 | what's 2+2 | none | no skill | no skill | yes / yes |
| N2 | thanks | none | no skill | no skill | yes / yes |
| N3 | yes | none | no skill | work-decide | yes / no |
| N4 | What does HTTP status 404 mean? | none | no skill | no skill | yes / yes |
| N5 | Write a haiku about autumn. | none | no skill | no skill | yes / yes |

In all 39 Claude Code matches, the `Skill` call was the session's first tool
call. In the Claude Code mismatches except 38, the agent ran `toolkit work`
or `git` commands first and then answered without a skill.

## Repeat runs and fixed-up test projects (not counted above)

Each mismatch ran again as a fresh session with the same message and project.
Where the mismatch looked like a gap in the test project (the item named did
not exist, or nothing was built), a variant ran in a project where the request
could be carried out:

- `$R/routing-late`: WI-001 with approved requirements at `09-testing`, and a
  second item WI-002 "Dark mode" in the backlog.
- `$R/routing-sf-late`: WI-001 with approved requirements and an approved
  result at `13-deployment`, and one Flow file under `force-app/`.

| # | Repeat, same project | Variant | Variant result |
| --- | --- | --- | --- |
| Claude 7 | work-on (match) | "Pick up WI-001 where we left off." | work-on (match) |
| Claude 12 | work-requirements (match) | none | |
| Claude 18 | no skill | none (needs a Notion-tracker project; not run, to keep writes out of Notion) | |
| Claude 19 | no skill | same message in `routing-late` | work-check (match) |
| Claude 22 | no skill | same message in `routing-late` | work-finish (match) |
| Claude 35 | session-summary (match) | second message of a resumed session, after "what's 2+2" (run twice) | session-summary both times (match) |
| Claude 38 | no skill | message followed by a pasted email | unslop (match) |
| Claude 41 | no skill | same message in `routing-sf-late` | work-finish (match) |
| Claude 43 | no skill | none | |
| Codex 42 | work-on (+ sf-data-change) again | none | |
| Codex 43 | sf-architect-solutioning (match) | none | |
| Codex N3 | work-decide again | the same message, run to the end | work-decide, and it recorded "yes" as the owner's answer (finding 2) |

One more variant was discarded: "What did we do today?" resumed after "Add
dark mode to the backlog for later." The first turn hit the 3-turn limit in
the middle of `work-on`, so the second turn finished that work first and then
answered without a skill.

What this shows:

- Routing changes from run to run. Claude 7, 12, and 35 and Codex 43 gave a
  different first skill on the second run.
- When the request can be carried out, Claude Code opened the expected skill
  first in all 7 variant runs.
- Claude Code's repeated misses 18, 19, 22, 38, and 41 are sessions where the
  agent first checked the project, found nothing it could act on (no such
  item, nothing built, no email pasted, not a Notion project), and answered
  without opening a skill. Its answers were correct: it said what was missing
  and did not change anything.
- Claude Code's miss 43 repeated for a different reason: the agent answered
  the Salesforce question from its own knowledge (next section).

## Mismatches: cause and suggested change

### Claude Code 7, 12, 18, 19, 22, 35, 38, 41: checked the project, then answered without a skill

- What happened: the agent ran `toolkit work show`, `toolkit work list`, or
  `git log` first, saw that the request did not fit the project (WI-12 does
  not exist; no dark mode item; nothing built; the tracker is not Notion; no
  email pasted), and replied directly. Session 35 recapped the day from
  `git log` instead of this chat. 7, 12, and 35 matched on the repeat run; the
  others matched in the variant projects.
- Cause: not the description wording and not an overlap. The descriptions
  route correctly when the request fits the project. Claude Code checks the
  state before it opens a skill; Codex opens the skill first. The index
  (section 5.4 point 3) relies on each skill's step 1 to handle a request that
  does not fit, and Claude Code skipped that step by not opening the skill.
- Suggested change: no description change. If Mike wants the skill opened
  every time, add one line to the session briefing that
  `plugins/toolkit/lib/project/brief.mjs` prints: "Open the matching skill
  before you run toolkit commands for a request; its first step checks whether
  the request fits." A change to the `AGENTS.md` routing lines would be a
  model change and needs Mike's approval. The replies in these sessions were
  correct, so this is a consistency choice, not a failure the owner would see.

### Claude Code 43 and Codex 43: "Which Flow type fits this?"

- What happened: Claude Code answered from its own knowledge twice, after
  reading WI-001, without opening `sf-architect-solutioning`. Codex's first
  run opened `solution-design`, `work-on`, and `sf-architect-solutioning` in
  one call; its repeat opened `sf-architect-solutioning` alone.
- Cause: overlap of two toolkit skills, plus the project's routing line.
  "this" points at the only work item, so the question reads as a design
  question about WI-001, which `solution-design` claims ("Designs how a work
  item gets built"). The Salesforce project's `AGENTS.md` says "Design work
  goes through `solution-design`; it opens `sf-architect-solutioning` as its
  specialist." The `sf-architect-solutioning` description puts "when
  solution-design needs a Salesforce specialist" first and "asks a Salesforce
  platform question" last, and gives no example, so a short platform question
  is answered without it.
- Suggested description (291 characters; section 9.1 decision 1 says this
  description needs Mike's yes):
  "Acts as a Salesforce Technical Architect: checks platform facts against
  official Salesforce docs and plans objects, Flows, Apex, and permissions.
  Use for any Salesforce platform question ("which Flow type fits", "Apex or
  Flow") before answering from memory, or when solution-design needs it."
- Also suggested, as a model change for Mike: the Salesforce routing line in
  `AGENTS.md` adds "A Salesforce platform question, even about a work item:
  `sf-architect-solutioning`."

### Codex 42: "Load these 500 contacts into production."

- What happened: both runs opened `work-on` and the project skill
  `sf-data-change` in the same call, `work-on` listed first. The agent's plan
  was the load package, which is `sf-data-change`'s job. Claude Code opened
  `sf-data-change` alone.
- Cause: overlap of two toolkit skills. `work-on` claims any request to
  "build, add, fix, or change something"; `sf-data-change` claims production
  records to be "created, updated, upserted, or deleted". The project's
  `AGENTS.md` line "Anything to build, add, fix, or change ...: the `work-on`
  skill" also points at `work-on`. The index intends `sf-data-change` first,
  with its step 1 opening `work-on` when no approved `data-load` item exists.
- Suggested description for `sf-data-change` (296 characters; it lives in the
  model's `.claude/skills/` and `.agents/skills/`, so the change goes into the
  model with Mike's approval):
  "Builds the owner's package for a Salesforce production data change: load
  file, backup, numbered steps, success check, and undo steps, in
  delivery/data/. Use first when the owner asks to load, import, update, or
  delete production records ("load these into production"); it opens work-on
  if needed."

### Codex N3: "yes" with no question asked

- What happened: Codex opened `work-decide` both times. Run to the end, it
  took the bare "yes" as the answer to Q-01, which is an either-or question
  ("archived customer records, or only active ones?"), picked "include
  archived", and recorded it: the Open Questions row now reads "Answered
  2026-09-27: Include archived customer records." and the history row reads
  "Owner's words: "yes" to Q-01, interpreted as including archived customer
  records in the CSV export." Claude Code instead said "Yes" does not settle
  Q-01, listed the two choices, and asked.
- Cause: not an overlap between two skills. The briefing prints
  `(work-decide)` next to the waiting question, the description claims
  "approved", and `work-decide` step 2 says an answer given without being
  asked is matched "to exactly one waiting decision". The rule "'Yes', 'ok',
  or 'looks good' with nothing waiting: ask what he is approving" covers only
  the case where nothing waits.
- Suggested description change: append ` Not for a bare "yes".` (22
  characters, total 298).
- Suggested body change in `plugins/work/skills/work-decide/SKILL.md`, "What
  counts as an answer": "A bare 'yes', 'ok', or 'looks good' answers only a
  question asked earlier in this conversation. When none was asked, or the
  waiting question is not a yes-or-no question, show the decision with its
  choices and your recommendation, and record nothing."

## Other findings

1. **The documented Claude Code test command loads no V2 plugin.** Every V2
   `plugin.json` sets `"defaultEnabled": false`. A `--plugin-dir` plugin loads
   as `<name>@inline`, and the project's `enabledPlugins` only names
   `<name>@toolkit-v2`, so the plugins load switched off. The `system/init`
   event then lists only the three built-in plugins and has no
   `plugin_errors`, so a check that only looks for unwanted plugins passes
   while nothing is tested. Evidence: the init event in
   `$R/rt/logs/claude-probe-without-settings.jsonl` (the task's command with
   no `--settings`) lists only `agents-md@builtin`, `telemetry@builtin`, and
   `plugin-authoring@builtin`, no `plugin_errors` key, and no V2 skill; and
   `claude --setting-sources project,local --plugin-dir <toolkit-v2>/plugins/work plugin list --json`,
   which prints `{"id": "work@inline", ..., "enabled": false}`. With
   `--settings '{"enabledPlugins":{"work@inline":true}}'` it prints
   `"enabled": true`. Suggested fix: add that `--settings` line (one entry per
   plugin) to the "Claude isolation" command in `dev/ARCHITECTURE.md` section
   10 and to any sample-run script, and make the check require every V2
   plugin to be present in `plugins`, not only that no other plugin is.
2. **`work-decide` records a bare "yes" against an either-or question in
   Codex.** See Codex N3 above. Evidence: `$R/rt/logs/codex-FN3.*` and the
   project copy `$R/rt/sessions/codex-FN3`.
3. **Codex often opens several skills in one call.** Besides 42 and 43: 11 and
   13 (with `work-on`), 21 (with `work-decide`), 41 (with `handoff`,
   `merge-and-clean-up`, `work-on`). The expected skill came first each time,
   so these count as matches. The `AGENTS.md` line "Anything to build, add,
   fix, or change ...: the `work-on` skill" is the likely reason `work-on` is
   added so often. No change suggested now.
4. **`claude -p` in a new project ignores the project's `Bash(toolkit *)`
   allow rule.** Each session printed "Ignoring 1 permissions.allow entry from
   .claude/settings.json: this workspace has not been trusted." The test
   command passes `--allowedTools 'Bash(toolkit *)'`, so the check was not
   affected. In real use Mike trusts the folder once in an interactive
   session. Worth one line in the sample-run notes.

## Not covered

- Message 18 in a project that tracks work in Notion.
- Each message ran once per host (plus the repeats above). The repeats show
  that one run per message is not enough to call a single result stable.
- The V1 `claude-toolkit` plugins were off in every run (index section 5.4
  point 6 also asks for a run with them on).

## Evidence

In `$R/rt/` (temporary scratch folder):

- `messages.json`, `messages-extra.json`: the messages and expected skills.
- `claude-run.sh`, `claude-resume.sh`, `codex-run.py`, `drive.py`: the
  runners. `claude-parse.py`, `summarize.py`: the readers. `summary.json`:
  every result.
- `logs/claude-<id>.jsonl`: Claude Code stream-json per session.
  `logs/codex-<id>.jsonl`, `logs/codex-<id>.rollout.jsonl`,
  `logs/codex-<id>.result.json`: Codex events, session log, and the skills
  read.
- `sessions/<host>-<id>/`: each session's project copy after the run.

No file in the toolkit-v2 repository other than this one was changed, and
nothing was staged or committed there. `~/.claude/settings.json` was not
touched (last changed 2026-09-26 14:03). `~/.codex/config.toml` has a new
modification time (16:06, during the Codex runs) but its content is
byte-for-byte the same as the copy saved at 12:44 the same day
(`scratchpad/codex-config-before-readd2.toml`, checked with `cmp`).

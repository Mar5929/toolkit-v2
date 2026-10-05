# The hook commands and the consistency pass over the starter files: checks

Work item: TKV-24. Branch: `claude/one-home-starter`. Date: 2026-10-05.
Node 25.8.1. Every command ran from the worktree root unless it says
otherwise. "Seen" means the command ran here and printed the result shown.

`<assets>` is `plugins/toolkit/skills/project-setup/assets/`. `<hooks>` is
`<assets>/every-project/.claude/hooks/`. `<build-5a>` is
`/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-toolkit-v2/1796fa5c-042e-4ee4-9256-ed3db38c8742/scratchpad/build-5a`.

Not done here: the separate wording, overlap, and best-practices reviews,
the routing test in both hosts, and a live session in Claude Code or Codex.
No skill description changed, so `dev/SKILL-INDEX.md` did not change.

## 1. The seven checks

All seven were seen to pass after the last edit.

| Command | Result |
| --- | --- |
| `claude plugin validate .` | Validation passed |
| `claude plugin validate ./plugins/toolkit` | Validation passed |
| `claude plugin validate ./plugins/workstreams` | Validation passed |
| `claude plugin test ./plugins/workstreams` | 14 pass, 0 fail |
| `node dev/tools/check-skills.mjs` | 22 skills checked, 22 rows; passed, 0 errors, 0 warnings |
| `node dev/tools/check-rules.mjs` | passed with 2 warnings, both there before this step (`salesforce-org-safety.md` is 4,200 bytes; `session-handoff.md` has a 577-character paragraph) |
| `node --test 'dev/tests/*.test.mjs'` | 50 tests, 50 pass, 0 fail (40 hook tests, 10 org guard tests) |

Before this step the hook file had 32 tests and one failed
(`session-start, local: with no memory files the index is the model MEMORY.md
byte for byte`). `dev/tests/org-guard.test.mjs` was not changed.

The Salesforce graph tool's own tests were run before and after the change to
its text: `cd <assets>/salesforce/tools/kb && python3 -m unittest
test_graph_tools` printed `Ran 40 tests`, `OK (skipped=1)` both times.

## 2. The hook commands

### What changed

| Hook | Lines before | Lines after | Change |
| --- | --- | --- | --- |
| `session-start.mjs` | 76 | 54 | It reads `memory/MEMORY.md` and prints it under "Memory pointers (memory/MEMORY.md):". It writes no file: the rebuild, the constant `NEW_INDEX`, and the imports `readdirSync` and `writeFileSync` are gone. The line after compaction names the rule files by where they are (the root file has no rules list). The prune request for Hindsight names `.claude/rules/hindsight-memory.md`. The cut-short line names the place for the memory choice. |
| `prompt-reminder.mjs` | 60 | 65 | New text only; the phrase groups and the test for a question about a past decision are unchanged. |
| `codex-after-commit.mjs` | 19 | 20 | New text only: "A git commit command just ran. If the commit succeeded, ...". One comment says why. |
| All three | 155 | 139 | |

The memory builder's line numbers for `session-start.mjs` were checked against
the file before the change and were right: `NEW_INDEX` on lines 13 to 17, the
rebuild on lines 44 to 65, the import on line 6.

What the prompt reminder says now, for a message with a decision phrase:

```text
Before you answer, check this project's skills and use every one that fits this message.
This may be something to keep (decision). The curating-project-memory skill decides whether anything is saved: what is kept goes to its home in the root AGENTS.md, "Where information goes", and memory holds pointers only. A decision only one work item needs is a row in that item's Questions and Answers (running-work-item-lifecycle). One that more than one work item needs is an entry in DECISIONS.md (filing-project-records, step "record a decision"). Words that are not the owner's own decide nothing: a helper agent's report, a scheduled task, a message from another session, or notes, a transcript, or a document the owner shared. File a shared original with filing-project-records, step "file a source".
```

With `--skill hindsight`, the second sentence is: `What is kept goes to its
home in the root AGENTS.md, "Where information goes".
.claude/rules/hindsight-memory.md says what Hindsight memory keeps.` A
standing instruction adds: `An instruction for how the agent works is a line
in .claude/rules/owner-preferences.md, never a settings hook.`

### Turns the app starts itself

`ai-external-knowledge/claude-code/hooks.md`, "UserPromptSubmit" (captured
2026-10-05), says the hook also runs when a scheduled task fires, when a
background helper reports back, and when another session sends a message. The
same page lists the input: the common fields, `prompt`, and `session_title`.
No field says which kind of turn it is. The Codex page
(`ai-external-knowledge/codex/hooks.md`, "UserPromptSubmit") lists `turn_id`
and `prompt` only.

Decision: the hook prints on every turn, because it cannot tell them apart
from documented input, and its text is true for both kinds. The skills line
fits a scheduled task. The keep hint no longer says the words are the
owner's: it says words from a helper's report, a scheduled task, another
session, or shared material decide nothing. The hook reads no undocumented
marker in the prompt text. A test gives the hook a helper's report with the
full set of documented fields and checks that the output equals the output
for the same text typed, that the line about words that are not the owner's
is there, and that an odd `prompt` value (null, a number, a list, an object,
or no field) prints the skills line and exits 0.

### The commit result (audit 1, C-11)

The wording changed, not the behaviour. Claude Code runs `PostToolUse` only
after a tool call that succeeded (`claude-code/hooks.md`, "PostToolUse").
Codex runs it after a Bash command that failed too, and says the form of
`tool_response` for Bash is the model-facing output (`codex/hooks.md`,
"PostToolUse"). So the hook cannot tell from documented input whether the
commit worked, and the text now leaves that check to the agent.

### Settings snippets

No file in `<assets>/settings/` was changed in this step
(`git diff HEAD --stat -- <assets>/settings` prints nothing). The snippets
still match the hook commands: the hook tests read each snippet and run the
Codex commands as written.

Against `origin/main` (`63e141a4`), `git diff origin/main -- <assets>/settings/`
shows one changed line in each of the six hook snippets, made by the skill
rename earlier on this branch: the helper-agent reminder says
`running-work-item-lifecycle` where it said `managing-work-items`. In the
three Codex snippets that line is the `command` of the
`^(collaboration)?(spawn_agent|wait_agent)$` entry. **A changed Codex entry
must be trusted again by the owner in Codex `/hooks`** in every project that
takes this update. The `SessionStart`, `UserPromptSubmit`, and `^Bash$`
entries are the same as on `origin/main`, so the three `.mjs` changes need no
new trust. `<assets>/salesforce/.codex/hooks.json` equals
`assets/model/.codex/hooks.json` on `origin/main`.

### No new hook and no new job

None was added, and none is proposed.

### Each hook run by hand

`<build-5a>/build.sh` builds three scratch projects with the copy commands of
`setup-copy.md`: `local` (local work and memory), `hindsight` (local work,
Hindsight memory: `memory/` holds only `CURRENT_STATE.md`), and `notion`
(GitHub work, Notion memory: no `memory/` folder). Each is a Git repository
with one commit. `<build-5a>/run.sh` fills Current State, adds one pointer row
to the local `MEMORY.md`, puts a stand-in `ntn` in `<build-5a>/bin`, and runs
each hook with the input the official page gives for its event. Output below
is as printed, with long lines cut at 600 characters by the script.

```text
## session-start.mjs, normal case

### local: startup
stdin: {"cwd":"<build-5a>/local","hook_event_name":"SessionStart","source":"startup","model":"claude-opus-5"}
command: node .claude/hooks/session-start.mjs --memory local
--- output
Current State:
# Current state

Last updated: 2026-10-05, handoff, agent

## Now

- WI-031: logging a transaction.

## Waiting on the owner

- None

## Next session starts with

- WI-031: read its Current state, then go on with P1-T02.

Memory pointers (memory/MEMORY.md):
# Memory pointers

| What it points to | ID | Link | Created | Last changed |
| --- | --- | --- | --- | --- |
| The decision on which workspace a request belongs to | DEC-004 | DECISIONS.md | 2026-10-05 | 2026-10-05 |
--- exit code: 0

### hindsight: startup
stdin: {"cwd":"<build-5a>/hindsight","hook_event_name":"SessionStart","source":"startup","model":"claude-opus-5"}
command: node .claude/hooks/session-start.mjs --memory hindsight
--- output
Current State:
# Current state

Last updated: 2026-10-05, handoff, agent

## Now

- WI-031: logging a transaction.

## Waiting on the owner

- None

## Next session starts with

- WI-031: read its Current state, then go on with P1-T02.
--- exit code: 0

### notion: startup, stand-in ntn on PATH
stdin: {"cwd":"<build-5a>/notion","hook_event_name":"SessionStart","source":"startup","model":"claude-opus-5"}
command: env PATH=<build-5a>/bin:$PATH node .claude/hooks/session-start.mjs --memory notion --page abc123
--- output
Current State:
Last updated: 2026-10-05, handoff, agent
## Now
- WI-7: the export screen.
## Waiting on the owner
- None
## Next session starts with
- WI-7: read its Current state.
--- exit code: 0

### local: after compaction
stdin: {"cwd":"<build-5a>/local","hook_event_name":"SessionStart","source":"compact","model":"claude-opus-5"}
command: node .claude/hooks/session-start.mjs --memory local
--- output
Context was just compacted. Before you answer the next message, re-read the active work item with using-work-tracker, then PROJECT.md, SOUL.md if the project has one, and .claude/rules/owner-preferences.md. In Codex, also re-read every file in .claude/rules/ that has no paths line at its top.
Current State:
# Current state

Last updated: 2026-10-05, handoff, agent

## Now

- WI-031: logging a transaction.

## Waiting on the owner

- None

## Next session starts with

- WI-031: read its Current state, then go on with P1-T02.

Memory pointers (memory/MEMORY.md):
# Memory pointers

| What it points to | ID | Link | Created | Last changed |
| --- | --- | --- | --- | --- |
| The decision on which workspace a request belongs to | DEC-004 | DECISIONS.md | 2026-10-05 | 2026-10-05 |
--- exit code: 0

## session-start.mjs, broken case

### local: MEMORY.md missing
stdin: {"cwd":"<build-5a>/local","hook_event_name":"SessionStart","source":"startup","model":"claude-opus-5"}
command: node .claude/hooks/session-start.mjs --memory local
--- output
Current State:
# Current state

Last updated: 2026-10-05, handoff, agent

## Now

- WI-031: logging a transaction.

## Waiting on the owner

- None

## Next session starts with

- WI-031: read its Current state, then go on with P1-T02.
--- exit code: 0

### local: both memory files missing
stdin: {"cwd":"<build-5a>/local","hook_event_name":"SessionStart","source":"startup","model":"claude-opus-5"}
command: node .claude/hooks/session-start.mjs --memory local
--- output
memory/CURRENT_STATE.md is missing or empty in <build-5a>/local.
--- exit code: 0

### local: input is not JSON
stdin: not json
command: node .claude/hooks/session-start.mjs --memory local
--- output
Current State:
# Current state

Last updated: 2026-10-05, handoff, agent

## Now

- WI-031: logging a transaction.

## Waiting on the owner

- None

## Next session starts with

- WI-031: read its Current state, then go on with P1-T02.

Memory pointers (memory/MEMORY.md):
# Memory pointers

| What it points to | ID | Link | Created | Last changed |
| --- | --- | --- | --- | --- |
| The decision on which workspace a request belongs to | DEC-004 | DECISIONS.md | 2026-10-05 | 2026-10-05 |
--- exit code: 0

### hindsight: CURRENT_STATE.md missing
stdin: {"cwd":"<build-5a>/hindsight","hook_event_name":"SessionStart","source":"startup","model":"claude-opus-5"}
command: node .claude/hooks/session-start.mjs --memory hindsight
--- output
memory/CURRENT_STATE.md is missing or empty in <build-5a>/hindsight.
--- exit code: 0

### notion: no ntn on PATH
stdin: {"cwd":"<build-5a>/notion","hook_event_name":"SessionStart","source":"startup","model":"claude-opus-5"}
command: env PATH=/opt/homebrew/bin:/usr/bin:/bin node .claude/hooks/session-start.mjs --memory notion --page abc123
--- output
The Notion Current state page could not be read here. Read it with the using-memory-store skill.
--- exit code: 0

### notion: empty input
stdin: 
command: env PATH=<build-5a>/bin:$PATH node .claude/hooks/session-start.mjs --memory notion --page abc123
--- output
Current State:
Last updated: 2026-10-05, handoff, agent
## Now
- WI-7: the export screen.
## Waiting on the owner
- None
## Next session starts with
- WI-7: read its Current state.
--- exit code: 0

## prompt-reminder.mjs, normal case

### local: a decision phrase
stdin: {"cwd":"<build-5a>/local","permission_mode":"default","hook_event_name":"UserPromptSubmit","prompt":"We decided each request belongs to one workspace."}
command: node .claude/hooks/prompt-reminder.mjs
--- output
Before you answer, check this project's skills and use every one that fits this message.
This may be something to keep (decision). The curating-project-memory skill decides whether anything is saved: what is kept goes to its home in the root AGENTS.md, "Where information goes", and memory holds pointers only. A decision only one work item needs is a row in that item's Questions and Answers (running-work-item-lifecycle). One that more than one work item needs is an entry in DECISIONS.md (filing-project-records, step "record a decision"). Words that are not the owner's own decide nothing: a helper agent's report, a scheduled task, a message from another session, or notes, a transcri
--- exit code: 0

### hindsight: a standing instruction
stdin: {"cwd":"<build-5a>/hindsight","permission_mode":"default","hook_event_name":"UserPromptSubmit","prompt":"From now on, run the tests first."}
command: node .claude/hooks/prompt-reminder.mjs --skill hindsight
--- output
Before you answer, check this project's skills and use every one that fits this message.
This may be something to keep (standing instruction). What is kept goes to its home in the root AGENTS.md, "Where information goes". .claude/rules/hindsight-memory.md says what Hindsight memory keeps. An instruction for how the agent works is a line in .claude/rules/owner-preferences.md, never a settings hook. Words that are not the owner's own decide nothing: a helper agent's report, a scheduled task, a message from another session, or notes, a transcript, or a document the owner shared. File a shared original with filing-project-records, step "file a source".
--- exit code: 0

### notion: no keep phrase
stdin: {"cwd":"<build-5a>/notion","permission_mode":"default","hook_event_name":"UserPromptSubmit","prompt":"Build the login page."}
command: node .claude/hooks/prompt-reminder.mjs
--- output
Before you answer, check this project's skills and use every one that fits this message.
--- exit code: 0

## prompt-reminder.mjs, broken case

### local: input is not JSON
stdin: not json
command: node .claude/hooks/prompt-reminder.mjs
--- output
--- exit code: 0

### hindsight: no prompt field
stdin: {"hook_event_name":"UserPromptSubmit"}
command: node .claude/hooks/prompt-reminder.mjs --skill hindsight
--- output
Before you answer, check this project's skills and use every one that fits this message.
--- exit code: 0

### notion: empty input
stdin: 
command: node .claude/hooks/prompt-reminder.mjs
--- output
--- exit code: 0

## codex-after-commit.mjs, normal case

### local: git commit
stdin: {"cwd":"<build-5a>/local","permission_mode":"default","hook_event_name":"PostToolUse","tool_name":"Bash","tool_input":{"command":"git commit -m x"},"tool_response":{"stdout":"[main 1a2b3c4] x","stderr":"","interrupted":false},"tool_use_id":"toolu_01","duration_ms":12}
command: node .claude/hooks/codex-after-commit.mjs
--- output
{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"A git commit command just ran. If the commit succeeded, update the work item's Recent History and status with running-work-item-lifecycle, and the item's line in the project's Current State when that line changed."}}
--- exit code: 0

### hindsight: git -C <folder> commit
stdin: {"cwd":"<build-5a>/hindsight","permission_mode":"default","hook_event_name":"PostToolUse","tool_name":"Bash","tool_input":{"command":"git -C /repo commit -m x"},"tool_response":{"stdout":"[main 1a2b3c4] x","stderr":"","interrupted":false},"tool_use_id":"toolu_01","duration_ms":12}
command: node .claude/hooks/codex-after-commit.mjs
--- output
{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"A git commit command just ran. If the commit succeeded, update the work item's Recent History and status with running-work-item-lifecycle, and the item's line in the project's Current State when that line changed."}}
--- exit code: 0

### notion: another command
stdin: {"cwd":"<build-5a>/notion","permission_mode":"default","hook_event_name":"PostToolUse","tool_name":"Bash","tool_input":{"command":"git status"},"tool_response":{"stdout":"[main 1a2b3c4] x","stderr":"","interrupted":false},"tool_use_id":"toolu_01","duration_ms":12}
command: node .claude/hooks/codex-after-commit.mjs
--- output
--- exit code: 0

## codex-after-commit.mjs, broken case

### local: input is not JSON
stdin: not json
command: node .claude/hooks/codex-after-commit.mjs
--- output
--- exit code: 0

### hindsight: no tool_input
stdin: {"hook_event_name":"PostToolUse","tool_name":"Bash"}
command: node .claude/hooks/codex-after-commit.mjs
--- output
--- exit code: 0

### notion: empty input
stdin: 
command: node .claude/hooks/codex-after-commit.mjs
--- output
--- exit code: 0

## memory/ after every run
local: AGENTS.md CLAUDE.md CURRENT_STATE.md MEMORY.md 
3054e7c6f2ed
hindsight: CURRENT_STATE.md 
notion: memory/ exists: no
```

Every run exited 0. `memory/` held the same files after the runs as before,
and the `notion` project still had no `memory/` folder.

## 3. Searches that must find nothing under `<assets>`

```zsh
A=plugins/toolkit/skills/project-setup/assets
command grep -rnE 'project-wide-records|requirements/|system-guide/|ai-external-knowledge|target-architecture|delivery/(deployment|data|archive|communications|deliverables|meeting-notes|references)(/|\b)' $A | command grep -v 'delivery/deployments'
command grep -rnE 'managing-work-items|tracking-work-items|managing-project-memory|storing-project-memory|managing-project-wide-records|memory (find|save) skill' $A
command grep -rnE 'exclude-dir=references|references/ folder|`references/`|<ID>-<short-slug>/references' $A
command grep -rniw 'mike' $A
command grep -rnE 'Mar5929|michaelrihm|Davis' $A
command grep -rnE '"Project memory"|under Rules in AGENTS|rules list' $A
```

Each printed nothing (exit code 1). Seen.

Two other searches print lines that are correct:

- `command grep -rn 'Project memory' $A` prints two lines. `PROJECT.md` line
  36 is the label of a list line (`- Project memory: in the memory system
  ...`), and `hindsight-memory.md` line 6 starts a sentence with the words.
  Neither points to a section.
- `command grep -rn 'system-guide' $A` prints the name of an older plugin,
  `system-guide@claude-toolkit`, in the two files that turn the older plugins
  off. It is not a folder.

Old delivery paths: six files name `engagement/deployment/` or
`engagement/data/`, the folders an older Salesforce project keeps. Each says
so. They were left.

## 4. One owner per event

The events are those of `dev/research/layout-audit/audit-2-skills-templates.md`,
section 8.4, with the skill names of the design. `<shared>` is
`<assets>/every-project/.claude/skills/`.

| Event | Owner | The one file and line |
| --- | --- | --- |
| A new request, idea, or bug arrives | `running-work-item-lifecycle` | `<shared>running-work-item-lifecycle/SKILL.md:33` (Backlog); `references/refining-requirements.md:12` |
| A work item changes State | `running-work-item-lifecycle` | `SKILL.md:17` (the table names the file for each State) |
| A decision only one work item needs | `running-work-item-lifecycle` | `references/refining-requirements.md:19` |
| A decision or question more than one item needs | `filing-project-records` | `<shared>filing-project-records/SKILL.md:17`; steps in `references/record-decision.md:5`. The lifecycle skill applies the filing test and hands over at `refining-requirements.md:27`. |
| An original arrives | `filing-project-records` | `SKILL.md:16`; steps in `references/file-source.md:5` |
| An approved fact about the system changes | `filing-project-records` | `SKILL.md:18`; steps in `references/update-system-doc.md:7` |
| A rule becomes Built | `filing-project-records` | `references/update-system-doc.md:24`, asked for by `closing.md:45` |
| A work item closes: Done, Cancelled, or by hand | `running-work-item-lifecycle` | `references/closing.md:51`, `:61`, `:70`; the closing question is at `closing.md:32` only |
| A lesson that is not proven yet is learned | `running-work-item-lifecycle` | `references/closing.md:24` writes it in the item's Notes |
| A lesson moves up at closing | `running-work-item-lifecycle` decides; see the flags | `references/closing.md:46-47` |
| A test plan is written | `running-work-item-lifecycle` | `references/testing-loop.md:12` |
| A deploy runs and its record is written | `running-work-item-lifecycle` | `references/deploying.md:36` (Salesforce: `references/salesforce-deploying.md`) |
| The project's phases or project tasks change | `running-work-item-lifecycle` | `SKILL.md:37` ("Levels") |
| Items are moved, nested, grouped, or archived, or were changed by hand | `using-work-tracker` | Local: `<assets>/work-local/.claude/skills/using-work-tracker/SKILL.md:49` (`references/folders-and-files.md`). Notion: `references/database-layout.md`. GitHub: `references/issue-layout.md`. See the flags. |
| A chat ends, or context is cleared | `handoff` | `<shared>handoff/SKILL.md:13` |
| A pasted handoff prompt needs checking | `handoff` | `SKILL.md:85` |
| "Remember this", "forget that" | `curating-project-memory` | `<assets>/memory-process/.claude/skills/curating-project-memory/SKILL.md:14`, `:27` |
| "From now on" | `curating-project-memory` | `SKILL.md:35` |
| "Clean up memory" | `curating-project-memory` | `SKILL.md:64` |
| A line of Current State is decided | One skill per line | `curating-project-memory/SKILL.md:47` holds the table: the lifecycle skill for a line under Now (`running-work-item-lifecycle/SKILL.md:73`), `handoff` for "Next session starts with" (`handoff/SKILL.md:49`), `curating-project-memory` for "Waiting on the owner" and pruning |
| Current State or a pointer is read or written | `using-memory-store` | Local: `<assets>/memory-local/.claude/skills/using-memory-store/SKILL.md:28`. Notion: `<assets>/memory-notion/.claude/skills/using-memory-store/references/current-state-page.md:24` |
| Documents are saved to the default branch | `publish-docs` | `<shared>publish-docs/SKILL.md:17` |
| A pull request is merged | `merge-and-clean-up` | `<shared>merge-and-clean-up/SKILL.md:14` |
| The local repository is updated from the remote | `pull-latest` | `<shared>pull-latest/SKILL.md:14` |
| The local repository is reset to the remote | `reset-to-remote` | `<shared>reset-to-remote/SKILL.md:19` |
| A recap | `session-summary` | `<shared>session-summary/SKILL.md:11` |
| A brain dump played back | `braindump` | `<shared>braindump/SKILL.md:13` |
| A simpler explanation | `explain-simply` | `<shared>explain-simply/SKILL.md:10` |
| Any Notion call | `using-notion-cli` | `<assets>/notion-tools/.claude/skills/using-notion-cli/SKILL.md:10` |
| Salesforce metadata changes, a deploy result, manual steps | `sf-component-tracker` | `<assets>/salesforce/.claude/skills/sf-component-tracker/SKILL.md:12` |
| A Salesforce deploy to a shared org is about to run | `sf-deploy-check` | `<assets>/salesforce/.claude/skills/sf-deploy-check/SKILL.md:14` |
| A Salesforce production data change | `sf-data-change` | `<assets>/salesforce/.claude/skills/sf-data-change/SKILL.md:10` |
| A project is set up, checked, updated, or moved | `project-setup` | Not part of this step |

Flags:

- **Two destinations, by kind, stated in one place.** A lesson that moves up
  goes to `DECISIONS.md` when it is about the system or the project
  (`filing-project-records`, step "record a decision"), and to
  `.claude/rules/owner-preferences.md` when it is about how the agent works
  (`curating-project-memory`). `closing.md:46-47` is the one place that says
  which. This is the builder's reading of two builders' texts, and the owner
  may change it.
- **No owner in a GitHub project.** The root file gives "archiving items" to
  `using-work-tracker`. The GitHub version has no archive step. Not changed.
- **No skill, on purpose.** "What was decided before" is a read:
  `<assets>/every-project/AGENTS.md:105` gives the order. "An outside page is
  captured": `<assets>/every-project/reference/AGENTS.md:47`.
- **A Hindsight project has no memory skill.** `<assets>/memory-hindsight/.claude/rules/hindsight-memory.md`
  owns the memory events there. Line 14 gives Current State its form.
- No event has two owners.

## 5. The consistency pass

Read in full by the builder: the root `AGENTS.md`, `DECISIONS.md`,
`PROJECT.md`, `README.md`, the six folder guides, the rule files of
`every-project`, `memory-hindsight`, and `notion-tools`, the three hook
commands, the settings snippets, `filing-project-records`,
`curating-project-memory`, both `using-memory-store` skills, `handoff`,
`publish-docs/SKILL.md`, `session-summary`, `braindump`, and
`running-work-item-lifecycle` (`SKILL.md`, closing, deploying, refining,
designing, the work item form). Read in full by two helper agents, whose
findings the builder opened and checked before any change: the three
`using-work-tracker` versions, the rest of the lifecycle skill, the Salesforce
rules, skills, and templates, the three Git skills, `using-notion-cli`, the
`system/` documents, and the Notion memory references.

### Fixed: 34

Disagreements (25):

| # | What disagreed | Fixed in |
| --- | --- | --- |
| 1 | The hook rebuilt `MEMORY.md` at every session start and wrote over the pointer table | `session-start.mjs` |
| 2 | "The session-start hook writes it. Never edit it." for `MEMORY.md` | root `AGENTS.md`, `memory/AGENTS.md` |
| 3 | "A pointer entry ... kept as `using-memory-store` says" read as one file per pointer; the storage skill keeps one table | `memory/AGENTS.md` ("The form of a pointer": one row of the table) |
| 4 | The pointer to a filed decision: a new Questions and Answers row with the DEC ID and its Status, against the work item form (the Related items line; the row that raised it ends "Filed as DEC-###") | `record-decision.md` step 7, "Answering" step 5, "Replacing" step 5, "Withdrawing" |
| 5 | "gets a one-line pointer ... when its Status changes" | `DECISIONS.md`, the rules for an entry |
| 6 | "A pointer in a work item is the record's ID and a few words" | `filing-project-records/SKILL.md`, "Every time" |
| 7 | A lesson that moves up had no stated home: the closing step said "the home the table gives it", and the memory skill said a rule | `closing.md` step 3; `filing-project-records/SKILL.md` (the Record a decision row); `record-decision.md` step 4 |
| 8 | The example outcome "Moved up: CON-07" named a rule where the home is a decision | `closing.md` step 4 |
| 9 | The item's line in Current State: "what is in progress or what waits on the owner", against the form "its ID and a few words on what it is for" | `running-work-item-lifecycle/SKILL.md`, "Every time" |
| 10 | "One line per active work item" with no meaning for "active"; the lifecycle skill keeps a line from Backlog left until Done or Cancelled | `memory/AGENTS.md`, `CURRENT_STATE.md`, Notion `current-state-page.md` and `assets/current-state.md` |
| 11 | A Hindsight project had the limits of Current State and not its form or who decides a line; "use the add-on's tools" also covered Current State, which is a file | `hindsight-memory.md` |
| 12 | "re-read each always-on rule listed under Rules in AGENTS.md" (no such list) | `session-start.mjs` |
| 13 | "as the memory rule says" for Hindsight (that text moved to `hindsight-memory.md`) | both hooks |
| 14 | "A decision goes in the work item's Questions and Answers first"; a pasted transcript was "source material for running-work-item-lifecycle" | `prompt-reminder.mjs` |
| 15 | "a commit that worked", with no check of the result | `codex-after-commit.mjs` |
| 16 | Two readers of a "Toolkit settings" value did not expect `not used` | local `folders-and-files.md` (prefix); GitHub `gh-commands.md` (repository) |
| 17 | `delivery/AGENTS.md` gives release plans and release notes to the lifecycle skill; outside a Salesforce project the skill named only the deployment record | `deploying.md`, "A deployment" |
| 18 | The Notion Files property: "Source files and attachments" in the schema, "The agent adds none" in the layout | `01-work-items-database.json` |
| 19 | "fill every field" for a Notion record, against a pointer page whose other columns stay empty | `notion-records.md` |
| 20 | The Salesforce graph hook's text sent corrections to memory with "the memory save skill"; the rule sends them to `system/` | `graph_freshness_hook.py`, its test |
| 21 | Pointers to `guides/salesforce-dependency-graph.md` and `rules/salesforce/dependency-graph.md`, which a project does not have | `tools/kb/README.md` |
| 22 | Mapping status "verified", "superseded" against "Verified", "Superseded" | `DATA-AREA-TEMPLATE.md` |
| 23 | The example comment in two trackers held task proof ("12 tests pass"); proof goes only in Recent History | GitHub `issue-layout.md`, Notion `page-layout.md` |
| 24 | "without the fill-in guide" for a template that has none | `handoff-example.md` |
| 25 | A test's note said the dependency rule "was deleted"; the rule exists | `test_graph_tools.py` |

Names (6): the Notion view "Waiting on Mike" (now "Waiting on the owner");
"Approved by Mike" in a Notion column description; two code comments in
`compare_dependencies.py`; a comment in `prompt-reminder.mjs` that named two
people; `/Users/mike/` in the handoff example; a real GitHub account in the
`gh-commands.md` example.

Duplicates (3):

| # | Stated twice | Now |
| --- | --- | --- |
| 1 | The Sources list: the last "How to write replies" bullet of the root file and `cite-recalled-knowledge.md` | The rule holds it. Helper agents and Codex load the rule (`claude-code/sub-agents.md`, "What loads at startup"; the root file's "Every session"). |
| 2 | "Every pointer entry carries both dates" and "A save the owner said no to is kept nowhere", in `memory/AGENTS.md` and `memory-review-and-save.md` | The rule holds them; the folder guide points to it. |
| 3 | What never goes in memory, and which skill decides each Current State line, in `memory/AGENTS.md` and `curating-project-memory` | The skill holds them, because a Notion project has no memory folder guide; the folder guide points to it. |

### Found already right

- `publish-docs` no longer says "in Reflecting".
- `curating-project-memory` reads no "Toolkit settings" value now.
- The three step names "record a decision", "file a source", "update a
  system document" are used with the same words in every file. "update a
  system document" sets a rule's mark to Built (`update-system-doc.md:24`).
- The design status list (`proposed`, `approved`, `superseded`, `none`) is
  the same in the form, the folder guide, and the three trackers. Local: the
  `design:` line. Notion: the Design select. GitHub: the label
  `design-proposed` or `design-approved`; no label and no design comment is
  `none`; no label with a design comment is `superseded`.

### Not changed: for the owner

1. No step sets `design: superseded`, and it never had one. Say when a
   design becomes superseded, or drop the value.
2. `PROJECT.md`, "Memory approval": no skill reads it now. Removing it makes
   "Toolkit settings" ten lines, and changes `setup-copy.md`.
3. `PROJECT-ROADMAP.md` keeps "Open project-level planning questions" and
   "Planning changes": questions and decisions outside `DECISIONS.md`. Its
   phase fields ("Intended outcome", "Exit condition", "Dependencies") differ
   from the Notion and GitHub ones ("Outcome", "Exit result").
4. Notion work items have a second design field, "Design approved" (a date
   and a name). The form has one, `design`.
5. The home of a lesson that moves up (section 4, the first flag).
6. `plain-english.md` (the output style) also states the Sources list.
7. Salesforce files, all there before this branch: `salesforce-org-safety.md`
   says production "asks by default" and the shipped `protected-orgs.json`
   says `deny`; `dependency-graph.md` and `tools/kb/README.md` name different
   scripts that contact an org; `tools/kb/README.md` tells the agent to commit
   `org-knowledge/`, which the project map does not list, and still has
   "Installing it in a project"; `PERMISSIONS-RUNBOOK.md` points to a "toolkit
   reference" that a project does not have and calls the project "this
   model"; `DATA-AREA-TEMPLATE.md` keeps workbooks where `publish-docs`
   refuses them; the migration templates write a question's text where
   `delivery/AGENTS.md` asks for its ID; "Jira ticket" in two files; the ten
   Salesforce rules and the three `sf-*` skills restate each other in about
   ten places.
8. The three trackers restate process rules of the lifecycle skill (never
   delete; the owner's hand edit wins; phases change only with the owner's
   yes; the order of question rows). The rules agree, so nothing was cut.

### What other files must change

Not part of this step. Each is a file of the setup builder or the repository.

| File | Change |
| --- | --- |
| `references/notion-build/work-setup.md` lines 297 and 537; `work-layout.md` line 30 | The view is named "Waiting on the owner" in the schema file now. |
| `references/notion-build/setup.md`, "Recording the links in PROJECT.md"; `finishing.md` 137; `update.md` 57; `work-setup.md` 243 and 379 | They write a `### Notion` block under "Toolkit settings". `PROJECT.md` has the fixed lines "Notion work items" and "Notion memory". The four Notion skill files that say "Notion block" follow whatever setup writes: say which. |
| `references/update.md`, the move-over | An existing project's `memory/MEMORY.md` is the old index, which the new hook prints as it is. Replace it with the pointer table. Say that the Codex helper-agent hook entry must be trusted again. |
| Repository `AGENTS.md`, "Hooks" | "the memory skill names live in `session-start.mjs` and `prompt-reminder.mjs`" stays true. Add that the session-start hook writes no file. |
| `dev/research/skill-writing-guide.md`, Part 6 | H3 does not say that `UserPromptSubmit` also runs on turns the app starts and gives no field to tell them apart. H11 names `hooks/codex-hooks.json`; a project's file is `.codex/hooks.json`. The page wins on both. |
| `dev/research/platform-best-practices.md` line 666 | Its `UserPromptSubmit` row lacks the same fact. |

## 6. Where a toolkit guide and the official page differ

- `skill-writing-guide.md`, H3, treats `UserPromptSubmit` as a hook on the
  owner's message. The page says it also runs on three kinds of turn the app
  starts. The hook follows the page.
- `skill-writing-guide.md`, H13, gives 30 seconds for `UserPromptSubmit` and
  10 minutes for a command hook. The page agrees. The snippets set 10 and 30
  seconds, inside both.
- No difference was found for `SessionStart` (the five sources, plain stdout
  as context, the 10,000-character limit) or for `PostToolUse` output
  (`hookSpecificOutput.additionalContext`).

## 7. Unsure

- Whether Claude Code marks an app-started turn inside the `prompt` text.
  The page does not say, so the hook does not look.
- The three Notion schema files changed here change only a view's name and
  two descriptions. No Notion workspace was touched, and none was read.

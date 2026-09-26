# Research brief: the model project's memory system, and a memory contract for three backends

Written 2026-09-26 for the Toolkit V2 architect and builders. It stands alone: you do
not need to open the sources to use it, but every claim names the file it came from.

Sources read in full:

- Model project `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project`:
  every file in `.memory/`, `scripts/memory.py`, `.claude/hooks/memory_trigger.py`,
  `.claude/hooks/memory_audit.py`, `.claude/hooks/_memory_patterns.py`,
  `.claude/hooks/toolkit-session-start.mjs`, `.claude/agents/memory-curator.md`,
  `.claude/rules/memory-curator-dispatch.md`, `.claude/settings.json`,
  `.codex/hooks.json`, `.toolkit-memory.json`, `tests/test_memory_runtime.py`, root
  `AGENTS.md`, root `CLAUDE.md`, `.gitignore`, and the memory parts of `README.md`
  and `PROJECT.md`.
- Original design: `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-context/davis-memory-system-package/`
  (`README.md`, `IMPLEMENTATION-SPEC.md`), plus the V2 handoff plans in
  `.../toolkit-v2-model-context/codex-second-brain-v2-handoff/` (skimmed for the
  reasons behind the untracked folder and the onboarding/trusted modes).
- Prior art in the current toolkit (read only): `claude-toolkit/docs/designs/404-external-memory-provider.md`
  and `claude-toolkit/plugins/second-brain/skills/knowledge-setup/references/memory-providers/`
  (`README.md`, `hindsight.md`). These already map memory operations to Hindsight.
- Captured Claude Code docs: `hooks.md` (UserPromptSubmit, Stop, PreCompact,
  additionalContext), `memory.md` (AGENTS.md loading, auto memory), `sub-agents.md`
  (frontmatter fields, background permission prompts, what loads at startup),
  `plugins-reference.md` (`bin/` on PATH).
- Installed tools, inspected read-only: `hindsight-api` 0.10.1 source under
  `~/.local/share/uv/tools/hindsight-api/lib/python3.12/site-packages/hindsight_api/`,
  and `ntn` 0.23.10 help text. The Notion page "AI Agent Second Brain" was fetched
  read-only.

---

## 1. Short version

- The model's memory is a folder of Markdown files (`.memory/`), ignored by Git, with
  one Python script (`scripts/memory.py`) that does every write under a lock and
  rebuilds a generated index. A background subagent (`memory-curator`) is the
  intended writer. Two Claude Code hooks remind and audit.
- Tests pass: 6 of 6 (details in section 9).
- It works, but it is built for a cautious team, not a solo developer who wants the
  agent to run the project. The biggest problems:
  1. **Memory is invisible in Git worktrees.** The script and hooks find `.memory/`
     next to themselves. A worktree has no `.memory/` (it is Git-ignored), so every
     worktree session starts with no memory and every write fails. Mike's rules put
     most work in worktrees. Reproduced in section 10.
  2. **Too many approvals.** Every lasting memory needs a four-part approval card
     until Mike explicitly grants "trusted mode". Each curator save also triggers a
     Bash permission prompt, because nothing allows `python3 scripts/memory.py`.
  3. **The approval check is not real.** `--authorization` accepts any non-empty
     string (for example `x`), so the "check" is only a label.
  4. **Claude-only.** Codex gets no memory hooks, and the startup load of memory
     depends on `CLAUDE.md` imports, which Toolkit V2 removes (AGENTS.md only).
  5. **The same policy is written four times** (about 17 KB across
     `.memory/AGENTS.md`, `memory-curator-dispatch.md`, `memory-curator.md`,
     `memory-criteria.md`), and the current-focus file repeats what the work item
     already holds.
- Section 12 lists the improvements. Section 13 defines one memory contract (save,
  get, find, list, update, retire, restore, delete, focus) and maps it onto the
  built-in files, a local Hindsight server, and a Notion Memory database.

---

## 2. File inventory

| Path (model project) | What it is | In Git? | Who writes it |
| --- | --- | --- | --- |
| `.toolkit-memory.json` | Marker that selects the memory system | Yes | Setup |
| `.memory/AGENTS.md` | Scoped instructions for the memory folder | No (folder ignored) | Setup |
| `.memory/CLAUDE.md` | One line: `@AGENTS.md` | No | Setup |
| `.memory/CURRENT_FOCUS.md` | "Where we are now" page, 9 required headings, max 50 lines | No | Curator via `replace-view` |
| `.memory/MEMORY.md` | Generated index, one line per active topic | No | Script only (`reindex`, `write`, `archive`, `restore`, `delete`) |
| `.memory/memory-criteria.md` | Selection policy plus trust mode in front matter | No | Curator via `replace-view`; mode changes need owner |
| `.memory/project_topic_template.md` | Seed template for a topic file; excluded from the index | No | Setup |
| `.memory/terminology-glossary.md` | Table of project terms | No | Curator via `replace-view` |
| `.memory/<type>_<topic>.md` | One lasting-memory topic (none exist in the model) | No | Script `write` |
| `.memory/archive/<type>_<topic>.md` | Retired topics | No | Script `archive` |
| `.memory/.runtime/write.lock/` | Lock folder (with an `owner` file) during a write | No | Script |
| `.memory/.runtime/trigger-events.jsonl` | One line per prompt that matched a trigger pattern | No | `memory_trigger.py` |
| `.memory/.runtime/memory-audit.jsonl` | One line per Stop event | No | `memory_audit.py` |
| `scripts/memory.py` | The writer and checker (505 lines, Python standard library only) | Yes | n/a |
| `.claude/hooks/_memory_patterns.py` | Shared regex trigger list | Yes | n/a |
| `.claude/hooks/memory_trigger.py` | UserPromptSubmit reminder hook | Yes | n/a |
| `.claude/hooks/memory_audit.py` | Stop audit hook | Yes | n/a |
| `.claude/hooks/toolkit-session-start.mjs` | SessionStart orientation; checks the memory imports | Yes | n/a |
| `.claude/agents/memory-curator.md` | The curator subagent | Yes | n/a |
| `.claude/rules/memory-curator-dispatch.md` | Main-agent rule: when and how to save | Yes | n/a |
| `.claude/settings.json` | Turns off native auto memory, disables V1 `second-brain`, registers hooks | Yes | n/a |
| `.codex/hooks.json` | Codex hooks: only SessionStart orientation, no memory hooks | Yes | n/a |
| `CLAUDE.md` (root) | `@AGENTS.md`, `@.memory/MEMORY.md`, `@.memory/CURRENT_FOCUS.md` | Yes | n/a |
| `tests/test_memory_runtime.py` | 6 behavior tests on a temporary copy | Yes | n/a |

`.gitignore` line 1 is `.memory/`. `PROJECT.md` lines 35-36 name the memory folder and
a placeholder for an "owner-approved" backup destination.

---

## 3. The `.memory/` files, one by one

### 3.1 `.memory/AGENTS.md` (26 lines)

Scoped guide for anyone touching the folder. Three sections:

- **Read and route.** Read `CURRENT_FOCUS.md` at startup; read `MEMORY.md` as an index
  and open topics; read `memory-criteria.md` before choosing or changing memory. Current
  tasks and owner to-dos go in `CURRENT_FOCUS.md` "with links to the chosen tracker";
  full tasks, status, requirements, history, and design go in the tracker; verified
  system behavior in the System Guide; procedures in skills.
- **Curate.** One coherent topic per file named with a type prefix: `user`, `feedback`,
  `project`, `reference`, `event`. Record source and date, status, scope, the durable
  point, why it matters, how to apply it. Search before creating. Rebuild the index with
  `scripts/memory.py reindex`. Keep `CURRENT_FOCUS.md` under 50 lines "by replacing
  stale sections, not appending", but never drop an unresolved owner to-do to fit.
- **Authority and completion.** Onboarding mode: show the approval card from the
  dispatch rule and write only after approval. "An explicit request to remember or
  correct is authorization for that specific change." Trusted mode: routine saves
  proceed "within the recorded grant". A rejected candidate is never saved anywhere
  else. Prefer the curator as writer; if delegation is unavailable, the main agent
  follows the same steps. Read back and run `python3 scripts/memory.py doctor` before
  reporting success.

### 3.2 `.memory/CLAUDE.md`

One line, `@AGENTS.md`. It exists so Claude Code loads the scoped guide. Toolkit V2
drops all `CLAUDE.md` files; Claude Code 2.1.277 and later load a subfolder's
`AGENTS.md` natively when it opens a file there (`memory.md`, "When Claude Code reads
AGENTS.md").

### 3.3 `.memory/CURRENT_FOCUS.md` (41 lines, placeholders only)

Line 3: `Last updated: <YYYY-MM-DD, source, and person or agent>`. Nine `##` headings,
each with one placeholder bullet. The script requires all nine, spelled exactly:

1. `Current focuses`
2. `Priorities and tasks to complete`
3. `Owner-mentioned to-dos and open loops`
4. `Upcoming milestones`
5. `Recent decisions` (keep at most three)
6. `Blockers and waiting on`
7. `Things to be aware of`
8. `Last 3 things touched`
9. `Next-session handoff`

### 3.4 `.memory/MEMORY.md` (generated)

Exact text produced by `index_text()` in `scripts/memory.py`:

```
# Memory index

One short link per active topic. This file is generated by python3 scripts/memory.py reindex; open a topic before relying on it. Seed topic templates are excluded. In a new project, the sections stay empty until the curator saves real memories.

## User

## Feedback

## Project

## Reference

## Event

## Other memory views

- [Current focus](CURRENT_FOCUS.md)
- [Memory criteria](memory-criteria.md)
- [Terminology glossary](terminology-glossary.md)
```

Each topic line is `- [<filename>](<filename>) — <description>` plus ` [<status>]` when
status is not `current`. Topics are sorted by filename within their type heading.

### 3.5 `.memory/memory-criteria.md` (53 lines)

Front matter (exact keys):

```yaml
mode: onboarding            # or trusted
trusted_by: none
trusted_on: none
trusted_scope: none
backup_destination: none
backup_restore_tested_on: none
```

Body sections: "Default test for lasting memory" (save when it concerns the project, has
a credible source, matters later, is costly to reconstruct, and has no better owner), a
table of the five types with "usually worth retaining" and "route or reject instead",
"Working context is different", "Never save as lasting memory" (secrets, transcripts,
live status, unshipped requirements, code restatements, rejected candidates reworded),
"Onboarding: review each lasting change", "Trusted mode: routine curation", "Backup and
recovery", and a "Learned selection guidance" table (`Date and source | General rule
learned | Effect`).

Trust rules: only the owner can switch to `trusted`; "Silence, elapsed time, or several
approved cards do not change mode." Trusted mode allows create, update, merge,
deduplicate, supersede, archive, restore of routine memory; still ask before ambiguous
or irreversible deletion. It never covers requirements, work items, or designs.

### 3.6 `.memory/project_topic_template.md` (25 lines)

Front matter fields (all but `supersedes` are required by the script):

```yaml
name: topic-template             # lowercase kebab-case slug
description: What future sessions would look here to remember   # max 105 chars, no [ or ]
metadata:
  type: project                  # must equal the filename prefix
status: template                 # real topics: current | needs-review | superseded
source: <Person, conversation, or document with absolute date>
last_verified: <YYYY-MM-DD or unknown>
authorization: <Approved card or explicit request, or trusted grant>
supersedes: none
```

Body: `# <Topic title>`, then bold-labeled paragraphs **Remember**, **Why**, **How to
apply**, **Evidence and limits**, **Related**, and an HTML comment telling the writer to
rename the file to `<type>_<topic>.md`. The nested `metadata.type` shape copies the
format Claude Code's own auto memory writes.

### 3.7 `.memory/terminology-glossary.md` (11 lines)

A table with columns `Term | System or context | Meaning here | Distinction or alias |
Source | Status / last checked`, and a "Naming changes and aliases" list
(`<Old term> → <Preferred term>; <reason, source, and date>`). The script does not
validate this file at all.

---

## 4. `.toolkit-memory.json`

```json
{
  "schema": 2,
  "memory": "second-brain-v2",
  "location": ".memory",
  "activeWriter": "memory-curator"
}
```

- `doctor` errors unless `memory == "second-brain-v2"` and `location == ".memory"`.
  `location` is checked but never used: the script hard-codes `ROOT / ".memory"`.
- `memory_trigger.py` only checks that the file exists.
- **Collision warning.** The current toolkit (`claude-toolkit` issue #404) uses the same
  filename with a different shape: `{"format": 1, "memory": "files"|"external",
  "service": "mem0"|"hindsight", "server": ..., "project": ...}`. Its hooks treat an
  unreadable or unknown file as `files` mode. If any current-toolkit plugin is still
  enabled on the machine, it will read a V2 project's file. The model avoids trouble
  only because `settings.json` disables `second-brain@claude-toolkit` per project.
  Pick a V2 shape that cannot be mistaken for format 1 (section 13.2).

---

## 5. `scripts/memory.py` in detail

### 5.1 Constants

| Name | Value |
| --- | --- |
| `ROOT` | `Path(__file__).resolve().parents[1]` (the folder above `scripts/`) |
| `VAULT` | `ROOT / ".memory"` |
| `LOCK` | `.memory/.runtime/write.lock` (a folder) |
| `TYPES` | `user, feedback, project, reference, event` |
| `TOPIC_RE` | `^(user|feedback|project|reference|event)_[a-z0-9]+(?:_[a-z0-9]+)*\.md$` |
| `MAX_INDEX_LINES` / `MAX_INDEX_BYTES` | 150 / 25,000 |
| `MAX_HOOK_CHARS` | 150 (the whole index line, including the filename twice) |
| `MAX_FOCUS_LINES` | 50 |

### 5.2 Mechanics

- **Atomic write:** `tempfile.mkstemp` in the target folder, write, `fsync`,
  `os.replace`. Side effect: every file the script writes ends up with permission
  `-rw-------` (0600), because `mkstemp` creates files that way. Observed on the
  model's own `MEMORY.md`.
- **Lock:** `mkdir` of `write.lock`; waits up to 10 seconds, polling every 0.1 s; writes
  `owner` with `pid=` and `started=`; removed in `finally`. A writer killed with
  `kill -9` leaves the lock; the error says "do not remove its lock blindly" and doctor
  prints a note. No stale-lock recovery.
- **Stale-edit check:** callers pass `--expect <sha256>` from the `hash` command, or
  `absent` for a new file. A mismatch stops the write.
- **Front matter parser (`fields`)**: line-by-line regex, flat `key: value` plus one
  level under `metadata:`. No lists, no multi-line values. Quotes are stripped.
- **Topic validation (`validate_topic`)**: filename matches `TOPIC_RE` and is not a
  `_template.md`; required keys `name, description, metadata.type, status, source,
  last_verified, authorization` are present and do **not contain `<`** (placeholder
  check); `metadata.type` equals the filename prefix; `name` is kebab-case; `status` is
  `current`, `needs-review`, or `superseded` (plus `archived` for files in `archive/`);
  `description` is at most 105 characters with no `[` or `]`.
- **Every write re-validates every active topic** (`current_records()`), and two topics
  with the same `name` slug is an error. One hand-broken topic file therefore blocks all
  saves and reindexes until fixed.
- **Authorization (`authorization_allowed`)**: `delete` refuses `""` and `trusted`;
  anything else passes. In onboarding, any other action refuses `""` and `trusted`. In
  trusted mode it refuses only `""`. For `write`, the value must also appear as a
  substring of the candidate file. There is no check that a person approved anything.
- **Exit codes:** 0 success, 1 doctor found errors, 2 "Memory operation stopped: ..."
  (any `ValueError` or `OSError`).

### 5.3 Commands

| Command | Arguments | What it does |
| --- | --- | --- |
| `doctor` | none | Health check (5.4). Exit 1 on errors. |
| `reindex` | none | Under lock, regenerate `MEMORY.md` from active topics. |
| `hash NAME` | vault-relative name, or `archive/<name>` | Print sha256, or `absent`. Refuses absolute paths and `..`. |
| `write NAME` | `--from-file`, `--expect`, `--authorization` (all required) | Validate candidate; check mode; check the authorization text appears in the file; under lock, check hash, write topic, rebuild index. |
| `replace-view NAME` | `--from-file`, `--expect`, `--authorization` (default empty) | Only `CURRENT_FOCUS.md`, `memory-criteria.md`, `terminology-glossary.md`. Criteria: a mode change needs a non-empty authorization; trusted needs `trusted_by/on/scope`. Focus: at most 50 lines and all nine headings. Glossary: no checks. |
| `archive NAME` | `--expect`, `--reason`, `--authorization` | Refuses if the body matches a "live work" regex (for example "is open", "remains active", "pending task"). Moves the file to `archive/`, sets `status: archived`, inserts `**Archived <date>:** <reason>` after the front matter, rebuilds index. |
| `restore NAME` | `--expect` (hash of the archived file), `--authorization` | Moves back, sets `status: needs-review`, rebuilds index. |
| `delete NAME` | `--expect`, `--authorization`, optional `--archived` | Deletes the active (or archived) file; rebuilds index for active. Any non-empty, non-`trusted` authorization passes. |
| `backup` | `--to` (new path outside the project) | One-time `copytree`, skipping `.runtime` and `.backups`. |
| `restore-backup` | `--from` (folder with `MEMORY.md`) | Copies into `.memory/` only if `.memory/` does not exist. |

There is no command to search, read, or list; agents use file tools for that.

### 5.4 What `doctor` checks

Errors (exit 1): any of the seven seed files missing; `mode` invalid or trusted without
grant fields; `MEMORY.md` not byte-identical to the generated index; an archived file
whose status is not `archived` or that fails validation; `CURRENT_FOCUS.md` over 50
lines or missing a heading; `.toolkit-memory.json` unreadable or not selecting
`second-brain-v2` / `.memory`; `autoMemoryEnabled` in `.claude/settings.json` not
`false`.

Notes (no failure): lock folder exists; "This linked worktree has a separate .memory
folder"; `backup_destination` or `backup_restore_tested_on` is `none`;
`second-brain@claude-toolkit` not disabled; `UserPromptSubmit` or `Stop` hooks missing;
root `CLAUDE.md` missing any of `@AGENTS.md`, `@.memory/MEMORY.md`,
`@.memory/CURRENT_FOCUS.md`; `CURRENT_FOCUS.md` contains `<` anywhere.

Result on the model project today: `Mode: onboarding; active topics: 0; errors: 0;
warnings: 3` (no backup destination, no restore test, focus placeholders).

---

## 6. Hooks and how they are wired

### 6.1 `.claude/settings.json` (memory parts)

```json
"autoMemoryEnabled": false,
"enabledPlugins": { "second-brain@claude-toolkit": false },
"hooks": {
  "UserPromptSubmit": [ { "hooks": [ { "type": "command",
      "command": "python3 \"$CLAUDE_PROJECT_DIR/.claude/hooks/memory_trigger.py\"", "timeout": 5 } ] } ],
  "Stop": [
    { "hooks": [ { "type": "command",
      "command": "python3 \"$CLAUDE_PROJECT_DIR/.claude/hooks/memory_audit.py\"", "timeout": 5 } ] },
    { "hooks": [ { "type": "command",
      "command": "python3 \"$CLAUDE_PROJECT_DIR/tools/kb/graph_freshness_hook.py\"", "timeout": 60 } ] } ],
  "SessionStart": [ { "matcher": "startup|resume|clear|compact", "hooks": [ { "type": "command",
      "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/toolkit-session-start.mjs\"", "timeout": 10 } ] } ]
}
```

There is no `permissions.allow` entry for `python3 scripts/memory.py`, so every Bash
call to the script asks Mike (and a background curator's prompts surface in the main
session, per `sub-agents.md` line 876).

`.codex/hooks.json` registers only SessionStart, with a relative command
`node ".claude/hooks/toolkit-session-start.mjs"` (works only when Codex starts at the
project root; the current toolkit uses `node "$(git rev-parse --show-toplevel)/..."`).
Codex gets no trigger and no audit. The current toolkit proves Codex runs
`UserPromptSubmit`, `PreToolUse`, and `Stop` command hooks from `.codex/hooks.json`
(`claude-toolkit/.codex/hooks.json`).

Unrelated but stale: `tools/kb/graph_freshness_hook.py` line 74 tells the agent to check
"`knowledge/memory/`", a V1 path that does not exist in the model.

### 6.2 `_memory_patterns.py`

Eleven case-insensitive regexes, each with a label:

| Label | Pattern (abridged) |
| --- | --- |
| `explicit-remember` | `remember (that|this|to|the)` |
| `explicit-forget` | `forget`, `remove from memory`, `delete the memory` |
| `explicit-memory-change` | `(save|update|correct) (this |that |the )?memory` |
| `correction` | `correction:`, `actually,`, `that's (not|no longer) (right|true|correct)` |
| `standing-preference` | `from now on`, `going forward`, `never (do|use|run|edit)`, `always (do|use|check|ask)` |
| `people-change` | `replaced by`, `took over from`, `handed off to`, `no longer with`, `joined the (team|project)` |
| `focus-change` | `paused`, `resumed`, `deprioritized`, `merge freeze`, `code freeze` |
| `tool-or-vendor-change` | `switched from`, `moving from`, `new vendor`, `new integration`, `added (an )?mcp` |
| `reference-change` | `(spec|document|dashboard|reference) (moved|renamed|is now at|lives at)` |
| `current-focus` | `blocked on`, `unblocked`, `blocker cleared`, `active work item`, `active epic` |
| `project-lesson` | `lesson learned`, `root cause`, `significant fix`, `important discovery` |

Measured false positives: "Actually, can you run the tests again?" → `correction`;
"Going forward, what is the plan?" → `standing-preference`; "Can you remember to push
after?" → `explicit-remember`; "What's the root cause of this failure?" →
`project-lesson`; "I'm blocked on the login screen" → `current-focus`. A real
preference phrased plainly ("Mike prefers short answers") matches nothing.

### 6.3 `memory_trigger.py` (UserPromptSubmit)

Input: hook JSON on stdin (`session_id`, `prompt`). Does nothing if
`.toolkit-memory.json` is absent or no pattern matches. On a match it:

1. Appends `{"session_id", "at", "labels", "prompt_sha256"}` to
   `.memory/.runtime/trigger-events.jsonl` (file mode 0600; never the prompt text).
2. Prints JSON `{"hookSpecificOutput": {"hookEventName": "UserPromptSubmit",
   "additionalContext": <reminder>}}`. The reminder is fixed text: "Possible Second
   Brain V2 review signal: <labels>. Read memory-criteria.md and the owning record. A
   regex hit is not evidence that a memory is warranted. Update CURRENT_FOCUS or the
   glossary when appropriate. During onboarding, show a lasting-memory card and wait
   for approval; in trusted mode, dispatch memory-curator ... No-op is valid."

Any exception is caught and printed to stderr; the hook never blocks. Two notes: the
text does not read the actual mode, and it is written as imperative instructions,
which `hooks.md` ("Add context for Claude") warns can trigger Claude's prompt-injection
defenses; the docs ask for factual statements.

### 6.4 `memory_audit.py` (Stop)

Reads `session_id` and `transcript_path`. Counts distinct `prompt_sha256` values for
this session in `trigger-events.jsonl`, and counts assistant `tool_use` blocks named
`Agent` or `Task` whose `input.subagent_type` ends with `memory-curator` in the whole
transcript. Appends `{"session_id", "at", "signaled_prompts", "curator_dispatches",
"review"}` to `.memory/.runtime/memory-audit.jsonl`, where `review` is "possible missed
routing or approved card still awaiting answer" when signals > 0 and dispatches == 0.
Prints nothing, so it never reaches the agent or Mike. It appends a row on every turn
(the log grows without limit), and a save done by the main agent in the foreground
(allowed by the rules) counts as a miss.

### 6.5 `toolkit-session-start.mjs` (SessionStart, both hosts)

Prints an orientation message. Memory-related checks: warns unless root `CLAUDE.md` is
exactly `@AGENTS.md\n@.memory/MEMORY.md\n@.memory/CURRENT_FOCUS.md`, and warns if
`.memory/memory-criteria.md` is missing. It does **not** print the current focus. In
the model, the focus and index reach Claude only through the `CLAUDE.md` imports, and
reach Codex only because root `AGENTS.md` says "Read ... `.memory/CURRENT_FOCUS.md`".

---

## 7. The curator agent and the dispatch rule

### 7.1 `.claude/agents/memory-curator.md`

```yaml
name: memory-curator
description: Maintains the selected flat Second Brain V2 memory, current focus, and terminology after the main agent determines the owning record and authorization.
model: opus
tools: Read, Write, Edit, Glob, Grep, Bash
background: true
```

Body: owns `CURRENT_FOCUS.md`, `MEMORY.md` (generated), topic files, glossary, criteria,
`archive/`. Never edits requirements, work-item status, roadmap, designs, code,
deployment records. A brief missing "owner's meaning, source/date, requested operation,
and approval basis" gets a question back and no write. Procedure: search; write the
full replacement to a temp file outside `.memory/`; `hash`; `write ... --expect ...
--authorization ...`; `replace-view` for views; `archive`/`restore`/`delete` for
lifecycle; read back; `doctor`; report. "Never launch two curators against the same
topic at once."

`background: true` is a valid field (`sub-agents.md` line 308). The agent has no
`memory:` field (Davis had `memory: project`).

### 7.2 `.claude/rules/memory-curator-dispatch.md` (4,073 bytes, no `paths:`, so always loaded)

- **Destination first:** focus/to-dos/handoff → `CURRENT_FOCUS.md`; terms → glossary;
  unowned durable context → topic; active work → tracker; delivered behavior →
  requirements; approach → the work item's design; current structure → System Guide;
  procedures → skills.
- **Review moments:** explicit remember/forget, corrections, standing preferences,
  decisions or discoveries, significant fixes, people/tool/reference changes, focus
  shifts, work-item completion, handoffs. "Do not spawn a curator from every regex
  match or every turn."
- **Onboarding card** (exact shape):

  ```
  ## Proposed memory saves
  ### 1. <Short topic title>
  **Change:** <Create, update, supersede, archive, restore, or delete; ...>
  **Summary:** <The exact meaning to retain and its scope, in plain language.>
  **Your decision:** Save this understanding? Approve, request changes, or decline.
  ```

  "A yes authorizes the shown operation and meaning only. Silence does not." No
  proposal inbox: an unanswered card waits in the conversation.
- **Trusted curation:** only an explicit owner grant; recorded in criteria front matter.
- **Dispatch:** background curator with a self-contained brief; focus-only changes and
  glossary upkeep need no card; group signals into one brief; wait for the result
  before saying "saved".

### 7.3 Root instruction wiring

Root `AGENTS.md` Startup: "Read `SOUL.md`, `PROJECT.md`, and
`.memory/CURRENT_FOCUS.md`; repeat after resume, clear, or compaction" and "Use
`.memory/MEMORY.md` to find context ... Follow `.memory/AGENTS.md` before writes." The
Tools table lists `python3 scripts/memory.py doctor`; Quick saves lists "`.memory/` |
V2 curator and `.memory/memory-criteria.md`; separate backup or sync."

---

## 8. Where it came from: Davis versus the model

The Davis package describes the working system in a Salesforce client repo. What the
model kept, changed, and whether Davis's known defects were fixed:

| Topic | Davis (original) | Model (V2) |
| --- | --- | --- |
| Storage | `engagement/_memory/` committed to Git; Claude's auto-memory folder junction-linked into it | `.memory/`, Git-ignored; native auto memory turned off |
| Types | 4: user, feedback, project, reference | 5: adds `event` |
| State file | 7 sections, "under 50 lines" not enforced (drifted to 133) | 9 sections, 50 lines enforced by script |
| Writer | Background curator edits files directly; no approval step | Curator through a locked script; onboarding cards until trusted mode |
| Curator | User-level, all tools, `memory: project` | Project-level, tools limited, `background: true` |
| Index | Hand-maintained; lost lines under parallel writes | Generated; lock plus hash; parallel-write test passes |
| Hooks | `py -3` (Windows); audit scanned all user-role transcript entries | `python3`; trigger reads the prompt field directly |
| Glossary, criteria | None | Added |
| Backup | Git | Manual `backup` snapshot plus front matter record |

Davis audit defects (spec section C10) and their status in the model: false positives
from skill bodies in the transcript: fixed for triggers (uses the hook's `prompt`);
repeated rows every turn: **not fixed**; cannot prove a miss: **not fixed**; nobody reads
the log: **not fixed**; log committed to Git: fixed (in ignored `.runtime/`); plugin
agent name match: fixed (`endswith`). Davis spec items still open in the model: Node
hooks instead of Python (spec 11.1), a `find`/search helper, a staleness check for
topics that say "open" or "pending", a doctor check that every index line points at a
real file (the model's byte-compare covers this).

---

## 9. Tests

Command given: `cd /Users/michaelrihm/Documents/Projects/toolkit-v2-model-project && python3 -m pytest tests -q 2>&1 | tail -20`

Result: `/opt/homebrew/opt/python@3.14/bin/python3.14: No module named pytest`. pytest is
not installed for either `python3` on this Mac.

Re-run two ways without writing into the model folder (`PYTHONDONTWRITEBYTECODE=1`, no
pytest cache):

- `python3 -m unittest discover -s tests -v` → `Ran 6 tests in 1.408s  OK`
- `uv run --no-project --with pytest python -m pytest tests -q -p no:cacheprovider` →
  `6 passed in 0.94s`

The six tests (`tests/test_memory_runtime.py`, each on a fresh temp copy):

1. `test_onboarding_write_index_stale_check_and_lifecycle`: `trusted` refused in
   onboarding; approved write lands in index; second `--expect absent` refused;
   archive removes from index; restore; delete with `trusted` refused; delete with an
   explicit string works; doctor passes.
2. `test_schema_rejects_wrong_type_and_doctor_finds_index_drift`.
3. `test_prompt_hook_reminds_without_writing_memory`: "From now on, never run X." gives
   `standing-preference`; event log has no prompt text; "Actually, Sam owns this." gives
   `correction`.
4. `test_two_writers_keep_both_index_entries`: two parallel writes, both indexed.
5. `test_owner_grant_enables_trusted_write_and_revocation`: mode change without
   authorization refused, with authorization accepted, trusted write works. Despite
   its name, revocation is not tested.
6. `test_fresh_clone_restore_refuses_overwrite`.

Not tested: `memory_audit.py`, `toolkit-session-start.mjs`, `replace-view` of
`CURRENT_FOCUS.md`, the glossary, the archive "live work" check, the index budget,
worktrees, Codex, and every false-positive case below.

---

## 10. Problems verified by experiment

All run on a scratch copy of the model (the model itself was not changed).

| # | Problem | Evidence |
| --- | --- | --- |
| P1 | **No memory in Git worktrees.** `.memory/` is Git-ignored, so a worktree has none, and the script resolves the vault from its own location. | In a scratch repo with a linked worktree, `doctor` in the worktree: `Mode: invalid; ... errors: 10`, starting `Missing .memory/AGENTS.md`. Every write fails; the `CLAUDE.md` imports load nothing. Claude's native auto memory, by contrast, is shared by "all worktrees ... within the same git repository" (`memory.md`, "Storage location"). |
| P2 | **Authorization is a label, not a check.** | `write ... --authorization Mike` succeeded because "Mike" appears in the file. `delete ... --authorization x` deleted an active topic. |
| P3 | **Archive refuses normal wording.** | A topic saying "The payments API remains active on the v2 endpoint." could not be archived: "Topic still describes live work." |
| P4 | **Index line budget counts the filename twice.** | A 104-character description with filename `project_payments_gateway_reconciliation_landmark.md` failed: "index hook exceeds 150 characters." The allowed description length depends on the filename length. |
| P5 | **`<` anywhere in a required field is treated as a placeholder.** | `source: Mike <michael@example.com> 2026-09-26` failed with "missing or placeholder source." (Rejecting the email is right; the message is misleading.) Doctor also flags any `<` in `CURRENT_FOCUS.md`, for example "keep < 50 lines". |
| P6 | **Files become owner-only (0600).** | `ls -l` after a write: `-rw-------` for both the topic and `MEMORY.md`. |
| P7 | **One bad topic blocks every write.** | Code: `current_records()` validates every active topic on each write and reindex. |
| P8 | **Trigger noise.** | Section 6.2 examples. |
| P9 | **Per-save permission prompts.** | No `permissions.allow` for the script; background subagent prompts surface in the main session (`sub-agents.md` 876, 889). |
| P10 | **Codex has no memory hooks; startup load depends on `CLAUDE.md`.** | `.codex/hooks.json` has only SessionStart; the SessionStart hook does not print the focus. |

---

## 11. What is good and worth keeping

- One writer path with a lock, an atomic replace, and a stale-edit hash. The parallel
  write test proves no lost index line.
- A generated index with a hard budget (150 lines, 25 KB, under Claude's 200-line /
  25 KB load limit).
- Small, typed topic files with Remember / Why / How to apply / Evidence. Search
  before create; supersede instead of duplicating.
- A clear "what memory is not" routing table (tracker, requirements, design, System
  Guide, skills).
- "A rejected candidate is not saved anywhere else" and "do not report saved until read
  back". Both prevent silent drift.
- Native auto memory turned off, so there is exactly one memory writer.
- Hooks never block and never store prompt text.

---

## 12. Improvements from a solo-developer view

Mike's goal: the agent runs the project; Mike decides and steers. Memory should save
reliably without asking about routine facts, never duplicate the work item, and never
make Mike manage it.

### 12.1 Less ceremony

1. **One writer, no curator hop for normal saves.** The main agent calls one command
   (`memory save ...`), which is a sub-second file write under a lock. Keep the
   curator agent only for occasional tidy-ups (merge duplicates, shorten the index,
   retire stale topics), run at work-item close or when `doctor` says the index is
   near its budget. This removes a subagent spawn, a temp-file dance, and the
   "wait for the background result" rule for every save.
2. **Allow the command once.** Add a permission allow rule for the memory command
   (for example `Bash(python3 scripts/memory.py *)`, or the plugin `bin/` command name)
   so saves never prompt.
3. **Read from stdin.** Let `save` take the record on stdin (`--from-file -`) so the
   agent does not write temp files outside the project (which can prompt).
4. **Make `--expect` optional for new records** (default `absent`) and have `get` print
   the version to pass back when updating.
5. **One policy text, not four.** Put the procedure in one `memory` skill, keep one
   always-loaded rule of about 10 lines (when to save, where things go, never
   duplicate the tracker), and move settings into config. Today about 17 KB repeats
   across `.memory/AGENTS.md`, the dispatch rule, the agent, and the criteria file.
6. **Simplify topic fields.** Drop `name` (derive it from the key), replace
   `authorization` with `saved_by` (`owner-request`, `owner-approved`, `agent-routine`)
   plus `source`, and use flat front matter (`type:` rather than `metadata.type:`),
   since native auto memory is off and nothing else reads the nested shape.
7. **Two statuses plus one.** `current`, `retired`, and optional `needs-review`.
   `superseded` becomes `retired` with `superseded_by: <key>`.
8. **Measure the description, not the index line.** Cap `summary` at 100 characters
   and compute the index line from the key, so long filenames never fail a save.
9. **Drop the "live work" regex on archive.** Keep the instruction ("rewrite live
   wording as history before retiring") in the skill; do not block on a guess.
10. **Keep file mode.** Preserve the old file's mode (or 0644) after `os.replace`.
11. **Tolerate one broken file.** Skip and report an invalid topic in `doctor` instead
    of refusing every other save.

### 12.2 Fewer approvals for routine facts

Replace the onboarding/trusted switch with one fixed, written policy (stored in project
config so every backend uses it):

| Kind of change | What the agent does |
| --- | --- |
| Mike says "remember", "from now on", "always", "never", or corrects a stored fact | Save now. Tell him in one line after: "Saved to memory: <title>. Say 'forget that' to undo." |
| Current-focus and handoff upkeep, reference pointers, glossary terms Mike stated, an event record at work-item close | Save now, mention in the end-of-turn summary. |
| Retire (reversible) a topic the agent can show is stale or replaced | Do it, mention it. |
| A preference or conclusion the agent inferred but Mike did not say | Ask one yes/no line, batched at the end of the turn (not a four-part card). |
| Anything about a named person; hard delete; more than 5 records at once; changing the policy | Ask first, every time. |

Mike can still choose "ask me before every save" at project init, but it should not be
the default. The ADHD rule in Mike's global instructions argues for fewer interruptions.

### 12.3 Reliable saving

1. **Fix worktrees (P1).** Resolve the vault from the main checkout: run
   `git rev-parse --path-format=absolute --git-common-dir`, take its parent folder,
   and use `<that>/.memory` (or the configured location). Every worktree then reads and
   writes the same vault, like Claude's native auto memory. Keep the lock in that
   vault.
2. **Load the focus with a SessionStart hook, in both hosts, for every backend.** The
   hook runs `memory focus --for-startup`, which prints the current focus plus the
   short index. This replaces the `CLAUDE.md` imports that V2 removes and works for
   Hindsight and Notion too. Keep it short: Codex caps added context per hook
   (`additionalContextLimit`, 1000 in the model's `.codex/hooks.json`, 5000 in the
   current toolkit), and Claude moves anything over 10,000 characters to a file.
3. **Replace the silent audit with a Stop-hook nudge.** At Stop, if this turn had an
   explicit signal (remember / forget / from now on / always / never / correction) and
   no memory command ran this turn, return `hookSpecificOutput.additionalContext` with
   a factual line ("The owner asked to remember something this turn and no memory save
   ran."). Respect `stop_hook_active` so it fires once. Drop the JSONL audit log.
4. **Narrow the trigger list** to explicit phrases (section 6.2 shows the noise). Drop
   `actually,`, `root cause`, `blocked on`, `going forward` (alone), `paused`. Write the
   reminder as facts, not orders, and have it read the real policy.
5. **Save points that do not depend on regex:** work-item close ("anything here that
   outlives the item?"), handoff, and before a planned `/compact`. These belong in the
   work and handoff skills, not in more hooks.
6. **Backups.** A Git-ignored folder is one disk failure from gone. Offer `memory
   export --to <folder>` (Markdown files, works for every backend) and have `doctor`
   say how old the last export is. Where the vault lives is Mike's call (open question
   1).
7. **Read back every write** (keep this), and make the command do it, not the agent.

### 12.4 No duplication with work items

1. The focus page holds pointers, not status. Proposed sections (down from nine):
   `Now` (links to the active work items, one line each), `Waiting on Mike`,
   `Untracked to-dos` (only things with no work item; replace with the link when one
   is made), `Next session starts with`. Drop `Priorities and tasks to complete`,
   `Recent decisions`, `Upcoming milestones` (the roadmap owns these), and `Last 3
   things touched` (Git history and the tracker show this).
2. A work item's decisions, next step, blockers, and history stay in `WORK-ITEM.md` /
   `DESIGN.md` (or the tracker). Memory keeps only facts that outlive one item, with a
   link to where they were decided.
3. At work-item close, write at most one `event` record (one line plus the link) when
   the episode matters later, for example a costly fix.
4. `doctor` flags a topic whose body looks like a task list or copies a work-item
   status line, as a note, not an error.

### 12.5 Host parity and V2 decisions

- No `CLAUDE.md` anywhere, including `.memory/CLAUDE.md`. Update the session-start hook
  and `doctor`, which today check for `CLAUDE.md` imports.
- Register the same hooks in `.codex/hooks.json`, with commands that find the project
  root through `git rev-parse --show-toplevel` (Codex has no `CLAUDE_PROJECT_DIR`).
- Keep `autoMemoryEnabled: false` in the project's Claude settings, and warn in
  `doctor` if a current-toolkit memory plugin (`second-brain@claude-toolkit`) or an
  auto-saving provider plugin (`hindsight-memory`, `mem0`) is enabled.
- Write hooks in Node (`.mjs`) or keep Python 3 standard library; either runs on this
  Mac. The toolkit's other hooks are Node.

---

## 13. A backend-neutral memory contract

### 13.1 Principles

- **One command, three drivers.** Skills and hooks call one CLI (`memory <operation>`).
  A driver per backend does the work. Hooks cannot call MCP tools
  (`404-external-memory-provider.md`, "Startup"), so the Hindsight and Notion drivers
  use their HTTP APIs or the `ntn` CLI directly. This lets the SessionStart hook load
  the focus from any backend, and keeps skill text identical across backends.
- **Same record text everywhere.** A record is one Markdown document with flat front
  matter. Files store it as a file; Hindsight stores it as a document's exact text;
  Notion stores the front matter as properties and the rest as the page body.
- **Exact text.** Stored text must read back equal to what was saved (after trimming
  trailing whitespace; Notion also needs Markdown normalization, see 13.6).
- **Retire, do not delete.** Retire is reversible and routine. Hard delete is
  owner-only.
- **One home.** A project uses exactly one backend. No local `.memory/` folder in a
  Hindsight or Notion project.
- **Policy lives in config, not in a backend.** Approval rules are the same for every
  backend.

### 13.2 Project config

Suggested file `.toolkit-memory.json` with a new `format` so format-1 readers from the
current toolkit reject it cleanly (or a different filename; open question 4):

```json
{
  "format": 2,
  "backend": "files",
  "files":     { "location": ".memory" },
  "hindsight": { "url": "http://127.0.0.1:8888", "bank": "<project-slug>" },
  "notion":    { "project_page": "<page id>", "memory_data_source": "<data source id>" },
  "approval":  "routine-auto",
  "focus_max_lines": 50,
  "index_max_lines": 150
}
```

Only the chosen backend's block is present. `approval` is `routine-auto` (section 12.2)
or `ask-every-save`. No secrets in this file. `files.location` is resolved against the
main checkout (section 12.3.1), not the current worktree.

### 13.3 Record model

| Field | Meaning | Required |
| --- | --- | --- |
| `key` | Stable id `<type>_<slug>`, slug `[a-z0-9]+(_[a-z0-9]+)*`, at most 60 chars. Same as today's filename stem. | Yes |
| `type` | `user`, `feedback`, `project`, `reference`, `event` (topics); `focus`, `glossary` (singletons) | Yes |
| `title` | Short human title (the `#` heading) | Yes |
| `summary` | One line, at most 100 chars, no `[` `]`; this is the index hook | Yes |
| `status` | `current`, `needs-review`, `retired` | Yes |
| `source` | Who or what said it, with an absolute date. Names only, never an email | Yes |
| `saved_by` | `owner-request`, `owner-approved`, `agent-routine` | Yes |
| `created`, `updated` | ISO dates, set by the CLI | Yes (CLI) |
| `last_verified` | ISO date or `unknown` | No |
| `supersedes`, `superseded_by` | Keys | No |
| `related` | Links to work items, designs, other keys | No |
| `version` | Opaque, returned by `get`, passed to `--expect`. Files: sha256. Hindsight: document `updated_at`/`content_hash`. Notion: page `last_edited_time`. | CLI only |

Body sections (unchanged from the model's template): **Remember**, **Why**, **How to
apply**, **Evidence and limits**, **Related**. `event` and `reference` records may omit
Why and How to apply.

### 13.4 Operations every backend must support

| Operation | CLI shape | Input | Output | Guarantee |
| --- | --- | --- | --- | --- |
| **focus get** | `memory focus [--for-startup]` | none | Focus text; with `--for-startup`, focus plus the short index, trimmed to the host limit | Never fails the hook: on error prints one line naming the problem |
| **focus set** | `memory focus --set - [--expect V]` | Whole focus page | New version | Validates headings and max lines; read back |
| **list** | `memory list [--type T] [--all]` | Filters | `key`, `type`, `title`, `summary`, `status`, `updated` per record | Current records only unless `--all` |
| **get** | `memory get KEY` | Key | Full record text plus `version` | Not found is exit 1 |
| **find** | `memory find "QUERY" [--type T] [--limit N]` | Words or a question | Ranked keys with summaries | Excludes retired unless `--all`. A hit is a pointer: open with `get` |
| **save** (create or update) | `memory save KEY --from-file - [--expect absent|V]` | Full record | New version | Validates fields; refuses a stale `--expect`; one writer at a time; reads back and compares |
| **retire** | `memory retire KEY --reason "..." [--superseded-by KEY2]` | Key, reason | New version | Sets `status: retired`, adds a dated reason line; drops it from `list`, `find`, and startup |
| **restore** | `memory restore KEY` | Key | New version | Sets `status: needs-review` |
| **delete** | `memory delete KEY --owner-said "<quote>"` | Key, Mike's words | none | Only on Mike's explicit request; the quote is logged |
| **glossary** | `memory glossary [--set -]` | Whole glossary | Text / version | Same as focus |
| **status** | `memory doctor` | none | Errors and notes | Backend reachable, schema valid, duplicates, budgets, last export age |
| **export / import** | `memory export --to DIR`, `memory import --from DIR` | Folder of Markdown | Files | Lets any backend be backed up to files, and allows moving between backends later |

Exit codes: 0 ok, 1 not found or doctor errors, 2 refused (validation, stale version,
policy), 3 backend unreachable.

Mapping to the five words in the task: **save** = `save` with `--expect absent`;
**find** = `find` (and `get` / `list`); **update** = `save` with `--expect V`;
**retire** = `retire` (with `restore` to undo); **list current focus** = `focus`.

### 13.5 Mapping: built-in files (`.memory/`)

| Operation | Files driver |
| --- | --- |
| focus get / set | Read / atomically replace `<vault>/CURRENT_FOCUS.md` |
| list | Parse front matter of `<vault>/<type>_*.md`; `MEMORY.md` stays a generated view for humans and for startup |
| get | Read `<vault>/<key>.md`; version = sha256 |
| find | Keyword score over title, summary, body, and glossary (standard library; no index service). Optional later: ripgrep |
| save | Today's `write` path: lock, hash check, atomic write, regenerate `MEMORY.md`, read back |
| retire | Move to `<vault>/archive/<key>.md` with `status: retired` and the reason line; regenerate index |
| restore | Move back with `status: needs-review` |
| delete | Remove the file (active or archived) |
| export / import | Copy folder |

`<vault>` = the configured location resolved against the main checkout (12.3.1). Works
offline; human-editable; weakest search; needs a backup plan.

### 13.6 Mapping: local Hindsight server (one bank per project)

Facts checked in the installed `hindsight-api` 0.10.1 source:

- REST base `http://127.0.0.1:8888/v1/default/banks/{bank_id}/...`. Routes used:
  `POST .../memories` (retain; body `{"items": [MemoryItem], "async": false}`, where
  `MemoryItem` has `content`, `timestamp`, `context`, `metadata` (string values only),
  `document_id`, `tags`), `POST .../memories/recall`, `POST .../reflect`,
  `GET .../documents` (query `q` = case-insensitive substring of the document id,
  `tags`, `tags_match` default `any_strict`, `limit`, `offset`; rows include
  `document_metadata`, `tags`, `updated_at`, `content_hash`),
  `GET/DELETE .../documents/{document_id}` (the GET returns `original_text`),
  `GET/PATCH .../config`.
- A retain with an existing `document_id` replaces it ("always upserts if document
  already exists", `engine/memory_engine.py`).
- `retain_extraction_mode` allowed values: `concise` (default), `verbose`, `custom`,
  `verbatim`, `chunks`. In `chunks` mode retain "skip[s] LLM entirely, store[s] each
  chunk as-is" (`engine/retain/fact_extraction.py`), so saves are fast and do not need
  Ollama. `verbatim` still calls the LLM.
- Recall supports `tag_groups` with `{"not": {...}}`, for example
  `[{"not": {"tags": ["status:retired"], "match": "any_strict"}}]`.
- `reflect` synthesizes an answer with the bank's LLM (here Ollama `gpt-oss:20b`): slow
  and not exact. `invalidate_memory` soft-retires one memory unit and is reversible.
- The REST recall body (`RecallRequest`) accepts `query`, `budget`, `max_tokens`,
  `tags`, `tags_match`, and `tag_groups`, the same filters as the MCP tool.
- MCP is also served at `/mcp/{bank_id}/` (single-bank mode, 36 tools including
  `sync_retain`, `recall`, `reflect`, `list_documents`, `get_document`,
  `delete_document`, `invalidate_memory`). Not needed for the contract.
- `hindsight-api --help`: default `--host 0.0.0.0`. For a memory server with no API
  key, bind to `127.0.0.1` so other machines on the network cannot read it.

| Operation | Hindsight driver |
| --- | --- |
| setup (once per project) | Create bank `<bank>` on first retain or via the bank route; `PATCH .../config` with `{"retain_extraction_mode": "chunks"}`; confirm with `GET .../config` |
| focus get | `GET .../documents/focus` → `original_text` |
| focus set | Retain `document_id: "focus"`, tags `["kind:focus"]`; read back |
| list | `GET .../documents?q=mem:&tags=status:current&tags_match=all_strict&limit=200` → `id`, `document_metadata.summary`, `title`, `type` |
| get | `GET .../documents/mem:<key>` → `original_text`; version = `updated_at` (or `content_hash`) |
| find | `POST .../memories/recall` with `query`, `budget: "mid"`, `max_tokens: 2048`, `tag_groups` excluding `status:retired` (and `kind:focus`); map each result's document id back to a key; dedupe; return summaries. This is the best search of the three backends |
| save | Check version with `GET` first (no compare-and-swap on the server; small race window, acceptable for one user). Retain one item: `content` = full record Markdown, `document_id: "mem:<key>"`, `context: "<type>"`, `tags: ["kind:topic", "type:<type>", "status:<status>"]`, `metadata: {"key", "type", "title", "summary", "status", "updated"}` as strings, `"async": false`. Read back `original_text` and compare |
| retire | Re-save the same `document_id` with `status: retired` in text, metadata, and tag `status:retired`. Optional: `invalidate_memory` on its units so recall never surfaces it |
| restore | Re-save with `status: needs-review` |
| delete | `DELETE .../documents/mem:<key>` (removes the document and its memory units) |
| glossary | Document `glossary`, tag `kind:glossary` |
| export | `GET .../documents` then each `original_text` to files (or the bank `/export` route) |
| optional `ask` | `POST .../reflect` for "what do we know about X"; never used to save or to answer `get` |

Rules carried from the current toolkit's Hindsight adapter: never install the
`hindsight-memory` Claude Code plugin or its Codex hooks (they save automatically on
every prompt); metadata values are strings; one record per retain call.

### 13.7 Mapping: Notion Memory database (one per project)

The existing "AI Agent Second Brain" page (fetched 2026-09-26) has a `Projects`
database (data source `collection://212cab42-22e0-4682-9fe1-a697a028331a`, properties
`Project`, `Status`, `Priority`, `Owner`, `Desired Outcome`, `Target Date`) and a
per-project "Knowledge Base" template ("one durable concept, not one granular fact").
That matches the topic model. The rebuild (GOAL item 7) gives each project page its own
Memory database. Proposed properties:

| Property | Notion type | Values |
| --- | --- | --- |
| `Title` | title | Record title |
| `Key` | rich text | `<type>_<slug>`, unique (checked by `doctor`; Notion cannot enforce it) |
| `Type` | select | `user`, `feedback`, `project`, `reference`, `event`, `focus`, `glossary` |
| `Status` | select | `Current`, `Needs review`, `Retired` |
| `Summary` | rich text | At most 100 chars |
| `Source` | rich text | Name and date |
| `Saved by` | select | `Owner request`, `Owner approved`, `Agent routine` |
| `Last verified` | date | |
| `Superseded by` | relation (same database) | |
| `Related work items` | relation (the project's Work Items database) | |
| `Created`, `Last edited` | created time, last edited time | System |

Page body = the record body (Remember, Why, ...). Views: "Current" (filter Status is not
Retired, grouped by Type) and "Retired". The focus is the one page with `Key` =
`focus`; the glossary is the page with `Key` = `glossary`.

`ntn` 0.23.10 facts that shape the driver (from `ntn pages create --help` and
`ntn api --help`):

- `ntn pages create --parent data-source:<id>` creates a page from Markdown, but "a
  frontmatter `title` sets the page title; other frontmatter properties are ignored".
  Properties need `ntn api v1/pages` (POST, or `-X PATCH v1/pages/<id>`), with body
  from `-d @file.json` or inline `properties[...]=...`.
- `ntn pages get <id>` returns Markdown with properties as front matter; `ntn pages
  edit <id> < body.md` replaces the body; `ntn pages trash <id>` moves a page to trash.
- `ntn datasources query <id> --filter '<Notion filter JSON>' --json` with `--limit`
  and `--start-cursor` for paging.
- The help text says `NOTION_API_TOKEN` is "required today for `ntn pages`". Whether the
  session from `ntn login` is enough must be tested (open question 5).

| Operation | Notion driver |
| --- | --- |
| focus get | Query `Key` equals `focus` → `ntn pages get <id>`, strip front matter |
| focus set | Same lookup → compare `last_edited_time` with `--expect` → `ntn pages edit <id> < focus.md` → read back |
| list | `ntn datasources query <ds> --filter '{"and":[{"property":"Status","select":{"does_not_equal":"Retired"}},{"property":"Type","select":{"does_not_equal":"focus"}},{"property":"Type","select":{"does_not_equal":"glossary"}}]}' --json`, page through all results |
| get | Query `{"property":"Key","rich_text":{"equals":"<key>"}}` → `ntn pages get <id>`; version = `last_edited_time` |
| find | Query with an `or` of `Title` / `Summary` / `Key` `contains` each word; if nothing matches, fetch the bodies of current records (at most about 150) and keyword-score locally. The public API has no full-body search, so this is the weakest search |
| save (new) | `ntn api v1/pages` POST with `parent: {"data_source_id": ...}` and all properties → `ntn pages edit <new id> < body.md` → read back both. Two calls, not atomic: if the second fails, set `Status` to `Needs review` and report |
| save (update) | Get id and `last_edited_time`; refuse if it differs from `--expect`; `PATCH v1/pages/<id>` properties; `ntn pages edit` body; read back |
| retire | `PATCH` `Status` = `Retired` and add the dated reason line to the body |
| restore | `PATCH` `Status` = `Needs review` |
| delete | `ntn pages trash <id>` (recoverable from Notion trash; never a permanent delete) |
| export | Query all, `ntn pages get` each, write files |

Notion-specific cautions: Mike may edit pages by hand in Notion, so `doctor` must
report rows missing `Key` or `Type` and duplicate keys rather than failing; Markdown
round-trips through Notion can change formatting (list markers, blank lines, escaped
characters), so the read-back comparison must normalize before comparing, and the
builders need a test that saves and reads back a record with bold labels, links,
and a table.

### 13.8 What differs between backends

| Capability | Files | Hindsight | Notion |
| --- | --- | --- | --- |
| Exact text read-back | Yes | Yes, in `chunks` mode | Yes after Markdown normalization |
| Safe concurrent writers | Yes (lock plus hash) | Version check before write; small race | Version check before write; small race |
| Search quality | Keywords | Meaning-based (best) | Titles and summaries; body scan fallback |
| Works offline | Yes | Needs the local server running | Needs internet and a Notion token |
| Mike can browse and edit | Text editor | API or Hindsight's own UI only | Best (Notion app) |
| Survives a lost laptop | Only with export or sync | Only with export | Yes (Notion cloud, page history) |
| Startup hook speed | Instant | Local HTTP call | 1-3 Notion API calls |
| Setup | None | Server, Ollama, bank config | Database, token, data source id in config |

Hooks must never block on a slow backend: the SessionStart and Stop hooks call the CLI
with a short timeout and, on failure, print one line such as "Memory service not
reachable (Hindsight at 127.0.0.1:8888). Work that needs memory should pause; other
work can continue."

### 13.9 Acceptance tests to write (per backend)

1. `save` new, `get`, `list`, and `find` return the record; read-back text equals input.
2. `save` with a stale `--expect` is refused (exit 2) and changes nothing.
3. `retire` hides the record from `list`, `find`, and startup output; `restore` brings
   it back as `needs-review`.
4. `delete` without `--owner-said` is refused.
5. `focus --for-startup` output fits under 1,000 characters for a full 50-line focus
   page plus a 150-line index, or the design raises the Codex limit.
6. Files backend: a linked Git worktree reads and writes the main checkout's vault.
7. Two parallel `save` calls to different keys both land (all backends).
8. Backend down: every hook exits 0 and prints one line.
9. Stop nudge fires once when "remember this" was said and no save ran; not again when
   `stop_hook_active` is true.
10. The same hooks run in a real Claude Code session and a real Codex session
    (GOAL finish item 6).

---

## 14. Open questions for Mike or the architect

1. **Where does the built-in vault live?** Options: Git-ignored `.memory/` in the main
   checkout (model default; needs a backup), a folder outside the repo in a synced
   location such as iCloud Drive, or committed to Git (Davis did this; the model
   rejected it). Recommendation: main-checkout `.memory/` plus `memory export` on
   demand, with `doctor` warning when the last export is older than 7 days.
2. **Default approval policy.** Recommend `routine-auto` (section 12.2). This replaces
   the model's onboarding/trusted modes, which Mike curated; it is his decision.
3. **Keep the background curator for everyday saves?** Recommend no: main agent writes
   through the CLI; curator only for tidy-up passes.
4. **Config file name and format** to avoid the clash with the current toolkit's
   `.toolkit-memory.json` format 1.
5. **Notion auth for `ntn pages` / `ntn api`.** The help says `NOTION_API_TOKEN` is
   required today; test whether `ntn login` alone works, or whether an integration
   token (kept in Keychain or an environment variable, never in the repo) is needed.
6. **Hindsight service details.** Bind to `127.0.0.1` (the default is `0.0.0.0`);
   confirm the embedding model it uses for recall runs locally; confirm with a live
   server that `GET .../documents?tags=...` filters as the source code says. The server
   was not running when this brief was written (nothing answered on port 8888), so no
   live call was made.
7. **Where the CLI ships.** A plugin `bin/` folder is on the Bash PATH in Claude Code
   (`plugins-reference.md` line 960), but Codex's behavior is unverified. Copying the
   script into each project (as the model does) works in both hosts but must be kept
   in sync by project-sync.
8. **Keep the `event` type and the glossary?** Both are optional for a solo developer.
   Recommendation: keep both, but create the glossary only when the first term is saved.
9. **Moving a project between backends** (export from one, import to another): in
   scope for V2 or later?

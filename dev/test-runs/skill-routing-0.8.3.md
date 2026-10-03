# Routing check for "toolkit v2" and the move-over (0.8.3, TKV-3, 2026-10-03)

The `project-setup` description changed in 0.8.3: it now names the move
from the older claude-toolkit and the owner phrase "toolkit v2". It holds
four phrases ("toolkit v2", "set up this project", "initialize this
project", "update the toolkit") and 382 characters. "Check the setup" left
the phrase list; the description still starts "Sets up, checks, or
updates".

## How it ran

Each prompt ran once in a fresh session, in a scratch folder with a made-up
project (owner "Sam Tester"). "First skill" is the first skill the session
opened. "Path" is the path the session named in its first reply.

- **Claude Code**: `claude -p`, Sonnet,
  `CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude`. The plugin was loaded
  from this branch for the session only (`--plugin-dir plugins/toolkit`),
  and the test home's installed copy (0.4.9) was turned off for the session
  only (`--settings '{"enabledPlugins":{"toolkit@toolkit-v2":false}}'`).
  Nothing was installed in the test home.
- **Codex**: `codex exec`, read-only sandbox,
  `CODEX_HOME=~/.toolkit-v2-test-homes/codex`. The skill was linked into
  the test home's `skills/` folder, and a profile file turned the installed
  copy (0.4.9) off for these runs. Both were removed after the runs; the
  test home is as it was. Each Codex row below opened this branch's copy.
- "Old plugin on" rows also loaded the older claude-toolkit's
  `project-init` plugin (its `project-init` and `project-sync` skills) for
  that session only (`--plugin-dir`), read only. Claude Code only.

The scratch folders:

| Folder | What it holds |
| --- | --- |
| empty | A Git repository with no files |
| code | One Python file and a README, committed; no agent files |
| by hand | Code and one hand-written `AGENTS.md` |
| retired | `.toolkit.json`, `DECISIONS.md`, empty `.work-items/` and `.memory/` |
| old | A project as the older claude-toolkit set it up (the folder in `move-over-0.8.3.md`) |
| V2 | A Toolkit V2 project: local work items, local memory, filled "Toolkit settings" |

## Results

| ID | Folder | Prompt | Expected first skill and path | Claude Code | Codex |
| --- | --- | --- | --- | --- | --- |
| 1 | old | toolkit v2 | project-setup; move-over | project-setup; move-over | project-setup; move-over |
| 2 | empty | toolkit v2 | project-setup; new project | project-setup; new project | project-setup; new project |
| 3 | code | toolkit v2 | project-setup; new project | project-setup; new project | project-setup; new project |
| 4 | V2 | toolkit v2 | project-setup; update | project-setup; update | project-setup; update |
| 5 | retired | toolkit v2 | project-setup; move-over | project-setup; move-over | project-setup; move-over |
| 6 | by hand | toolkit v2 | project-setup; move-over | project-setup; move-over | project-setup; move-over |
| 7 | old | move this project to toolkit v2 | project-setup; move-over | project-setup; move-over | project-setup; move-over |
| 8 | old, old plugin on | toolkit v2 | project-setup; move-over | project-setup; move-over | not run |
| 9 | old, old plugin on | set up this project | project-setup; move-over | project-setup; move-over | not run |
| 10 | empty | set up this project | project-setup; new project | project-setup; new project | project-setup; new project |
| 11 | empty | initialize this project | project-setup; new project | project-setup; new project | project-setup; new project |
| 12 | V2 | update the toolkit | project-setup; update | project-setup; update | project-setup; update |
| 13 | V2 | check the setup | project-setup; check | project-setup; check | project-setup; check |
| 14 | V2 | get the latest | pull-latest | pull-latest | pull-latest |
| 15 | old | update the toolkit | project-setup; asks older toolkit or Toolkit V2 | project-setup; asked, recommended the older toolkit | project-setup; asked, recommended the older toolkit |
| 16 | empty, old plugin on | initialize this project | project-setup or the older `project-init` (a known overlap, `dev/SKILL-INDEX.md`) | project-setup; new project | not run |
| 17 | old | ok so um toolkit v2 this project please | project-setup; move-over | project-setup; move-over | not run |
| 18 | old, after the move landed | toolkit v2 | project-setup; update | project-setup; update | not run |

Result: 31 of 31 sessions opened the expected skill first and named the
expected path (18 in Claude Code, 13 in Codex).

## What the earlier rounds showed

Two rounds ran before the table above. Each finding changed the text, and
the table is the run after the changes.

- A first description dropped "initialize this project" to make room for
  "toolkit v2". In an empty folder Claude Code then opened its built-in
  `init` skill, and with the old plugin on it opened `project-init`. With
  the 0.8.0 description the same prompt opened `project-setup`. The phrase
  went back in (rows 11 and 16).
- In the folder with only a hand-written `AGENTS.md`, Claude Code first
  named the path "new project": `SKILL.md` sent it to a table in
  `move-over.md` that it did not open. "Pick the path" in `SKILL.md` now
  lists the files that mean an earlier setup (row 6).
- The first V2 scratch folder still held setup markers and a fill-in guide,
  so sessions rightly called it "setup stopped part way". It was rebuilt as
  a finished Toolkit V2 project (rows 4, 12, 13).
- Two Codex runs opened the test home's installed 0.4.9 copy, because a
  `-c` override did not turn it off. They were run again with the profile
  file (rows 2 and 6).

## Not covered

- Codex with the older toolkit's plugins on, and the Codex desktop app.
- A project with work items or memory in Notion, GitHub Issues, or
  Hindsight.
- The sessions stopped after the path and the first question (Claude Code
  at its turn limit or with tools held back; Codex in its read-only
  sandbox). The whole move-over is in `move-over-0.8.3.md`.

# Routing check for the levels structure (0.8.0, TKV-7, 2026-10-02)

The model `AGENTS.md` routing lines changed in 0.8.0: project phases and
project tasks go to `managing-work-items`; a project to-do can become a
project task; the `publish-docs` line no longer lists `PROJECT-ROADMAP.md`.
No skill description changed.

Each prompt ran once in a fresh session, in a scratch local-tracker,
local-memory project built from this branch's model and skills (one
top-level item, WI-001). Hosts: Claude Code (`claude -p`, Sonnet,
`CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude`) and Codex
(`codex exec`, read-only sandbox, `CODEX_HOME=~/.toolkit-v2-test-homes/codex`).
"First skill" is the first skill the session opened.

| ID | Prompt | Expected | Claude Code | Codex |
| --- | --- | --- | --- | --- |
| R1 | Add a project task: renew the domain before November. | managing-work-items | managing-work-items | managing-work-items |
| R2 | remind me to renew the domain for this project | managing-work-items | managing-work-items | managing-work-items |
| R3 | add a new phase to the roadmap for the launch work | managing-work-items | managing-work-items | managing-work-items |
| R4 | put WI-001 in the second project phase | managing-work-items or tracking-work-items | managing-work-items | managing-work-items |
| R5 | what do you need from me | Current State and the open items, no single skill | read Current State, no skill | tracking-work-items |
| R6 | make a to do to invite Sarah to the repo | managing-work-items | managing-work-items | managing-work-items |
| R7 | what should we work on next | Current State and the open items | tracking-work-items | managing-work-items |
| R8 | Publish the docs: I approved the edits in requirements/billing.md, save them to main. | publish-docs | publish-docs | publish-docs |

Result: 16 of 16 sessions opened an expected skill first, or read Current
State where the `AGENTS.md` line says to. No session opened `publish-docs`
for the roadmap prompt (R3); both R3 sessions said a phase change needs the
owner's yes. The runs stopped before saving anything (Claude Code at its
4-turn limit, Codex in its read-only sandbox), so where each to-do would be
saved was not seen; in R1, R2, and R6 both hosts read
`work-items/PROJECT-TASKS.md`, and the Codex answers named a project task
(R1) or a to-do for the owner (R2, R6).

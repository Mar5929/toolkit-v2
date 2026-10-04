# Project-wide records checks (0.8.16, TKV-19, 2026-10-04)

## Repository checks

- `claude plugin validate .`, `./plugins/toolkit`, and `./plugins/workstreams`: passed.
- `claude plugin test ./plugins/workstreams`: 14 passed, 0 failed after merging the current main branch.
- `node dev/tools/check-skills.mjs`: 22 skills, 0 errors, 0 warnings. This includes the five model-to-skill template comparisons and the shared-skill setup count.
- `node dev/tools/check-rules.mjs --dir plugins/toolkit/skills/project-setup/assets/model`: passed with two existing warnings about `salesforce-org-safety.md` size and one long paragraph in `session-handoff.md`.
- `node --test 'dev/tests/*.test.mjs'`: 42 passed, 0 failed.
- `git diff --check`: passed.

## Setup and host checks

- Copied the model and the new shared skill into a temporary project. The five templates, five category folders, folder `AGENTS.md`, and project skill were present. The new folder contains no setup markers.
- Rendered the model root `AGENTS.md` for the 18 supported combinations of local, Notion, and GitHub work tracking; local, Notion, and Hindsight memory; and Salesforce on or off. Every rendered file was within 200 lines and 20,480 bytes (maximum 181 lines and 19,533 bytes).
- Installed version 0.8.16 into temporary Codex and Claude Code homes. Both hosts accepted the toolkit plugin; Mike's installed plugins were not changed.
- In a temporary local-work/local-memory project, fresh read-only sessions in **both** Claude Code and Codex opened `managing-project-wide-records` first for a workshop affecting two items and a shared account model. They read its source-intake reference and named the original source, intake receipt, target record, and item destinations.
- In both hosts, a single-item invoice-export planning request opened `managing-work-items` first.
- In both hosts, a changed answer affecting two items and target direction opened `managing-project-wide-records` and its question procedure. Both kept the shared question open until every affected destination was checked.

The host runs read and explained procedures; they did not write a fictional transcript through a full work-item lifecycle. No live Notion, GitHub, or Hindsight project was changed. The shared skill adds no external schema, hook, or command, so those integrations were checked through the existing setup matrix and repository checks rather than live writes.

# Hindsight Project Memory

This project's memory is Hindsight, on the owner's server, in the bank named under "Toolkit settings" in `PROJECT.md`. Hindsight's coding-agent add-on saves each session and brings back what is relevant by itself.

- This project has no `curating-project-memory` skill and no `using-memory-store` skill. Where `AGENTS.md`, a rule, or a skill names one of them, use the add-on's tools as the add-on describes.
- Project memory is what a later session on this project needs and could not easily rebuild: decisions and why they were made, lessons learned, and facts about the project's people, systems, and limits.
- Never put a secret, a key, or personal data in Hindsight.
- Never put where work stands now in Hindsight. That belongs in the work items and in `memory/CURRENT_STATE.md`.
- Write an instruction from the owner for how the agent works as a line in `.claude/rules/owner-preferences.md`, by a direct edit. Never put it in Hindsight.
- The add-on cannot delete a memory. For "forget that", say which memory is wrong and ask the owner to remove it on the bank's page in the dashboard. Never say a memory is deleted when it is not.
- To open the bank in the Hindsight dashboard, open the "Hindsight dashboard" link under "Toolkit settings" in `PROJECT.md`.
- Never open or show `~/.hindsight/coding-agent.json` or its `.hindsight-backup` copy whole, with any tool: they hold the API key. To list the Hindsight project folders: `jq -r '.mapPathToBank // {} | to_entries[] | "\(.key) \(.value)"' ~/.hindsight/coding-agent.json`.

## Current State

- `memory/CURRENT_STATE.md` is the only memory file in the project folder. Git does not track it, so it exists only in the main checkout. Edit it directly.
- Keep it within its limits: Now 5 lines, Waiting on the owner 5, Next session starts with 3, and under 40 lines in all.
- Remove a line when it stops being true, at each handoff, and whenever the session-start hook says the file is too long or too old.

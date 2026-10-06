# Hindsight Project Memory

This project's memory is Hindsight, on the owner's server, in the bank named under "Toolkit settings" in `PROJECT.md`. Hindsight's coding-agent add-on saves the session to the bank at the end of every turn. On the first message of a session it adds what the bank holds about that message to your context.

- Hindsight is the search across past sessions. It is not the home of a decision or a system fact: file each one where `AGENTS.md`, "Where information goes", says, as in every project.
- When Hindsight returns a decision or a rule, find it in `DECISIONS.md` or `system/` and name its DEC-### or rule ID. When no record holds it, file it before you rely on it.
- The add-on's own skill, `hindsight-coding-agent`, says how to use the add-on's tools. Open it before you search, store, or correct a memory. In Codex, which has no such skill, follow the guide the add-on shows at session start.
- This project has no `curating-project-memory` skill and no `using-memory-store` skill. Where `AGENTS.md`, a rule, a skill, or a hook names one of them for something to remember or forget, follow this file. Where it names one for Current State, follow "Current State" below.
- "Remember this": file the fact in its home, and tell the owner that the add-on saves this conversation at the end of the turn.
- A run of a recurring job, or another thing that happened: this project has no event records. Say in the reply the date, what ran or happened, and the result: the add-on saves the conversation at the end of the turn. When the job has a `delivery/` record, write the run there.
- "Forget that", or a memory that is wrong: the add-on cannot delete a memory. Save a correction with its tool `hindsight_ingest_document`, titled "Correction: <topic>". Deleting a memory is the owner's step, on the bank's page in the dashboard: say which memory. Never say a memory is deleted when it is not.
- "Clean up memory": prune Current State as "Current State" below says, save a correction for each memory you checked and found wrong, and list for the owner the memories only the owner can delete. Change nothing else in the bank.
- Write an instruction from the owner for how the agent works as a line in `.claude/rules/owner-preferences.md`, by a direct edit, in the layout its top comment gives. Never put it in Hindsight.
- Never put a secret, a key, or personal data in Hindsight.
- Never store where work stands now in Hindsight with a tool. That is in the work items and in `memory/CURRENT_STATE.md`.
- In `.claude/rules/memory-review-and-save.md`, "Approval" does not apply to what the add-on saves by itself: it saves each session without asking. "When to review memory" applies to Current State.
- To open the bank in the Hindsight dashboard, open the "Hindsight dashboard" link under "Toolkit settings" in `PROJECT.md`.
- Never open or show `~/.hindsight/coding-agent.json` or its `.hindsight-backup` copy whole, with any tool: they hold the API key. To list the Hindsight project folders: `jq -r '.mapPathToBank // {} | to_entries[] | "\(.key) \(.value)"' ~/.hindsight/coding-agent.json`.

## Current State

- `memory/CURRENT_STATE.md` is the only memory file in the project folder. It is in the main checkout only (`AGENTS.md`, "Project map"). Edit it directly: change only the lines that change.
- Last updated: one line with the date as YYYY-MM-DD, what caused the change, and who made it. Set it in the same edit as any change.
- Now: one line per active piece of work, at most 5. A work item that has left Backlog and is not Done or Cancelled: its ID and a few words; `running-work-item-lifecycle` decides it. Other work: a few words, and the ID of its record.
- Coming up: a dated event or deadline, the date first as YYYY-MM-DD. At most 3 lines.
- Waiting on: who owes what, the person or party first, with the date asked. Name a project task or an Open decision by its ID and a few words. At most 4 lines.
- Standing jobs and shared files: a recurring job, or a shared file kept up to date, and the file, link, or `delivery/` record that describes it. At most 3 lines.
- Next session starts with: one line per piece of work worked on last, at most 3. A work item: its ID and "read its Current state". Other work: what it is and its next step. `handoff` writes them; with no handoff, set them with a change under Now.
- Keep the whole file under 40 lines. Write "None." in an empty part.
- A line names a record by its ID. Never copy a work item's own Current state into it.
- Remove a line when it stops being true. Check every line at each handoff, when a work item closes, when a date under Coming up has passed, and when the session-start hook says the file is too long or too old.

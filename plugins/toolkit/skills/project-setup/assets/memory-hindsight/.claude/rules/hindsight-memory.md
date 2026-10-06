# Hindsight Project Memory

This project's memory is Hindsight, on the owner's server, in the bank named under "Toolkit settings" in `PROJECT.md`. Hindsight's coding-agent add-on saves the session to the bank at the end of every turn. On the first message of a session it adds what the bank holds about that message to your context.

- Use Hindsight to search past sessions. It is not the place where a decision or a system fact is kept: file each one where `AGENTS.md`, "Where information goes", says.
- When Hindsight returns a decision or a rule, find it in `DECISIONS.md` or `system/` and name its DEC-### or rule ID. When no record holds it, file it before you rely on it.
- Before you search, store, or correct a memory, open the add-on's skill `hindsight-coding-agent`, which says how to use its tools. Codex has no such skill: there, follow the guide the add-on shows at session start.
- This project does not install `managing-project-memory`. When `AGENTS.md`, a rule, a skill, or a hook names that skill, follow this file instead. For the project's Current State, follow "The project's Current State" below.
- When the owner says "remember this", file the fact where it is kept, and tell the owner the add-on saves this session at the end of the turn.
- When a recurring job ran, or another thing happened, make no event record. Say in your reply the date, what ran or happened, and the result, so the add-on saves them. When the job has a `delivery/` record, write the run there.
- The add-on cannot delete a memory. When the owner says "forget that", or a memory in the bank is wrong, save a correction with its tool `hindsight_ingest_document`, titled "Correction: <topic>".
- Deleting a memory is the owner's step, on the bank's page in the dashboard: say which memory. Never say a memory is deleted when it is not.
- When the owner says "clean up memory", remove the lines of the project's Current State that are no longer true, as the last section says, save a correction for each memory you checked and found wrong, and list for the owner the memories only the owner can delete. Change nothing else in the bank.
- Write the owner's instruction for how the agent works as a line in `.claude/rules/owner-preferences.md`, by a direct edit, in the layout its top comment gives. Never put it in Hindsight.
- Never put a secret, a key, or personal data in Hindsight.
- Never store where work stands now in Hindsight with a tool. The work items and `memory/CURRENT_STATE.md` hold it.
- In `.claude/rules/memory-review-and-save.md`, "The owner's yes" does not apply to what the add-on saves by itself, without asking. "When to review memory" applies to the project's Current State.
- To see the bank, open the "Hindsight dashboard" link under "Toolkit settings" in `PROJECT.md`.
- Never open or show `~/.hindsight/coding-agent.json` or its `.hindsight-backup` copy whole, with any tool: they hold the API key. To list the Hindsight project folders, run `jq -r '.mapPathToBank // {} | to_entries[] | "\(.key) \(.value)"' ~/.hindsight/coding-agent.json`.

## The project's Current State

- `memory/CURRENT_STATE.md` is the only memory file in the project folder. It is in the main checkout only (`AGENTS.md`, "Project map"). Edit it directly: change only the lines that change.
- Last updated: one line with the date as YYYY-MM-DD, what caused the change, and who made it. Set it with every change.
- Now: one line per active piece of work, at most 5. A work item that has left Backlog and is not Done or Cancelled gets its ID and a few words; `managing-work-items` decides that line. Other work gets a few words and the ID of its record.
- Coming up: a dated event or deadline, the date first as YYYY-MM-DD. At most 3 lines.
- Waiting on: who owes what, the person or party first, with the date asked. Name a project task or an Open decision by its ID and a few words. At most 4 lines.
- Standing jobs and shared files: a recurring job, or a shared file kept up to date, and the file, link, or `delivery/` record that describes it. At most 3 lines.
- Next session starts with: one line per piece of work worked on last, at most 3. A work item gets its ID and "read its Current state". Other work gets what it is and its next step. `handoff` writes these lines; with no handoff, set them with a change under Now.
- Keep the whole file under 40 lines. Write "None." in an empty part.
- A line names a record by its ID. Never copy the work item's Current state into it.
- Remove a line when it stops being true. Check every line at each handoff, when a work item closes, when a date under Coming up has passed, and when the session-start hook says the file is too long or too old.

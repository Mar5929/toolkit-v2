# Hindsight Project Memory

This project's memory is Hindsight, on the owner's server, in the bank named under "Toolkit settings" in `PROJECT.md`. Use it to keep what a later session needs and no other project file holds, and to search what was kept before.

## What this project saves in Hindsight

These lines are the owner's choices for this project's bank. Setup writes them, and the owner may change them. Change a setting of the bank only when the owner asks, with the `project-setup` skill, and then change the line here.

- Nothing is saved by itself. You save a record on purpose, with the tools of Hindsight's coding-agent add-on.
- A record is stored as you wrote it.
- The Git history is not imported, and the code is not surveyed.
- Observations are on, and Hindsight builds them after every save. An observation is a statement that Hindsight forms from several saved records.

## What to save, and what never to save

- Memory holds only what no other project file holds. Before every save, find the place where the fact is kept, in `AGENTS.md`, "Where information goes". When that table names a place, save the fact there, and save nothing in Hindsight.
- Save a record when the subject concerns this project, has a source you can name, would matter in a later session, would be costly or unreliable to work out again, and has no other file as its place.
- A record holds one of these:
  - a fact about a person that matters to the work and is not that person's lasting role. Never save private details or a personal judgment about a person;
  - a lasting fact about the project or the client, a claim that nobody checked yet with who said it, or a lesson that is not proven yet;
  - where to find something that is hard to find again, and why to open it;
  - something that happened, or a job that ran: the date, what was done, the result, and where the output is.
- Write one record for one subject, with its date, so that a session that reads only that record understands it. Search the bank first. When the bank already holds a record of the subject, save a correction or an addition that names it, and not a second record of the same thing.
- Never save a decision, a to-do, the live status of work, a pending approval, a routine edit, a restatement of code, or anything that a work item, a commit, or a filed record already shows.
- A fact that is true only for a while carries the date when it stops being true or must be checked again.
- Never save a secret, a key, sensitive personal data, or a transcript.

## Using Hindsight

- Before you search, save, or correct a memory, open the add-on's skill `hindsight-coding-agent`, which says how to use its tools. Codex has no such skill: there, follow the guide the add-on shows at session start.
- When Hindsight returns a decision or a rule, find it in `DECISIONS.md` or `system/` and name its DEC-### or rule ID. When no record holds it, file it before you rely on it.
- This project does not install `managing-project-memory`. When `AGENTS.md`, a rule, a skill, or a hook names that skill, follow this file instead. For the project's Current State, follow "The project's Current State" below.
- When the owner says "remember this", file the fact where it is kept. When memory is its place, save a record, and tell the owner in one line what you saved.
- The add-on cannot delete a memory. When the owner says "forget that", or a memory in the bank is wrong, save a correction with the add-on's tool for saving a document, titled "Correction: <topic>".
- Deleting a memory is the owner's step, on the bank's page in the dashboard: say which memory. Never say a memory is deleted when it is not.
- When the owner says "clean up memory", remove the lines of the project's Current State that are no longer true, as the last section says, save a correction for each memory you checked and found wrong, and list for the owner the memories only the owner can delete. Change nothing else in the bank.
- Write the owner's instruction for how the agent works as a line in `.claude/rules/owner-preferences.md`, by a direct edit, in the layout its top comment gives. Never put it in Hindsight.
- In `.claude/rules/memory-review-and-save.md`, "When to review memory" applies to Hindsight and to the project's Current State.
- To see the bank, open the "Hindsight dashboard" link under "Toolkit settings" in `PROJECT.md`.
- Never open or show `~/.hindsight/coding-agent.json` or its `.hindsight-backup` copy whole, with any tool: they hold the API key.

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

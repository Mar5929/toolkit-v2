# The Current state page

The form of the project's Notion "Current state" page, and how to read and change it. The calling skill decides what a line says. The page's id is in `PROJECT.md`, section "Toolkit settings", Notion block.

## The form

The page is plain text, not a database. `assets/current-state.md` is its starting text.

| Part | What it holds | Limit |
| --- | --- | --- |
| Last updated | The first line: `Last updated: YYYY-MM-DD`, then what caused the change and who made it. | One line |
| Now | One line per active work item: its ID and a few words on what it is for. | 5 lines |
| Waiting on the owner | A decision or action only the owner can take that has no work item, or a save question the owner has not answered: who needs it and when to check again. An Open decision is named by its DEC ID. | 5 lines |
| Next session starts with | The work item's ID, what to read, and the next action. | 3 lines |

- Keep the whole page under 40 lines. Write "None" in an empty part.
- A line names a record by its ID. Never copy a work item's own Current state into it.
- The session-start hook reads the date after "Last updated:" to tell when the page is old.

## Reading it

The session-start hook prints it. To read it again, follow `using-notion-cli` ("Reading and changing page text"), with the Current state page's id from `PROJECT.md`.

## Changing it

Change it with `update_content` (`using-notion-cli`), from a fresh read. Update the "Last updated:" line in the same call.

- **Replace a line:** `old_str` is the line, `new_str` the new line.
- **Add a line:** `old_str` is the part's last line (or its heading), `new_str` is that text followed by the new line. In a part that says "None", replace that line with the new line.
- **Remove a line:** `old_str` is the line with its line break, `new_str` empty.

```json
{"type":"update_content","update_content":{"content_updates":[
  {"old_str":"Last updated: 2026-09-30, kickoff, owner","new_str":"Last updated: 2026-10-02, handoff, agent"},
  {"old_str":"- WI-31: read its Current state, then go on with the export screen.","new_str":"- WI-31: read its Current state, then go on with the import screen."}]}}
```

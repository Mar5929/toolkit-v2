# The Current state page

How the project's Notion "Current state" page is laid out and how to read and change it. `curating-project-memory` says what each part holds, its limit, and when to change it; the skill that calls this one decides what a line says. The page's id is in `PROJECT.md`, section "Toolkit settings": the nested bullet "Current state page" under the fixed line "Notion memory".

## The page

The page is plain text, not a database. `assets/current-state.md` is its starting text.

Keep the first line in the form `Last updated: YYYY-MM-DD`, then what caused the change and who made it. The session-start hook reads the date after "Last updated:" to tell when the page is old. Keep every heading, an empty part included: an empty part holds "None."

## Reading it

The session-start hook prints it. To read it again, follow `using-notion-cli` ("Reading and changing page text"), with the Current state page's id from `PROJECT.md`.

## Changing it

Change it with `update_content` (`using-notion-cli`), from a fresh read. Update the "Last updated:" line in the same call.

- **Replace a line:** `old_str` is the line, `new_str` the new line.
- **Add a line:** `old_str` is the part's last line (or its heading), `new_str` is that text followed by the new line. In a part that says "None.", replace that line with the new line.
- **Remove a line:** `old_str` is the line with its line break, `new_str` empty.

```json
{"type":"update_content","update_content":{"content_updates":[
  {"old_str":"Last updated: 2026-09-30, kickoff, owner","new_str":"Last updated: 2026-10-02, handoff, agent"},
  {"old_str":"- 2026-10-01: kickoff call with the client.","new_str":"- 2026-10-07: meeting with the client and the vendor (PT-04)."}]}}
```

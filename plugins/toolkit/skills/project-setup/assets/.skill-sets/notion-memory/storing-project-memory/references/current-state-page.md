# The Current state page

How the project's Notion "Current state" page is laid out and how to read and change it. `managing-project-memory` says what each section holds, its limit, and when to change it. The page's id is in `PROJECT.md`, section "Toolkit settings", Notion block.

## The page

The page is plain text, not a database. `assets/current-state.md` is its starting text.

Keep the first line in the form `Last updated: YYYY-MM-DD`. The session-start hook reads the date after "Last updated:" to tell when the page is old.

## Reading it

The session-start hook prints it. To read it again, follow `using-notion-cli` ("Reading and changing page text"), with the Current state page's id from `PROJECT.md`.

## Changing it

Change it with `update_content` (`using-notion-cli`), from a fresh read. Update the "Last updated:" line in the same call.

- **Replace a line:** `old_str` is the line, `new_str` the new line.
- **Add a line:** `old_str` is the section's last line (or its heading), `new_str` is that text followed by the new line. In a section that says "None.", replace that line with the new line.
- **Remove a line:** `old_str` is the line with its line break, `new_str` empty.

```json
{"type":"update_content","update_content":{"content_updates":[
  {"old_str":"Last updated: 2026-09-30, kickoff, Mike","new_str":"Last updated: 2026-10-02, session, Claude Code"},
  {"old_str":"- Resume at the export screen.","new_str":"- Resume at the import screen: read WI-31 first."}]}}
```

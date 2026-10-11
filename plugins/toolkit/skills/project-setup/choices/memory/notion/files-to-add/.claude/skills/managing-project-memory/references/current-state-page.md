# The Current state page

This file says how the project's Notion "Current state" page is laid out, and how to read and change it. That page holds the project's Current State. Open this file before you read or change the page.

`managing-project-memory` says what each part of the page holds and when to change it. The skill that asked for the change decides what a line says.

The page's id is in `PROJECT.md`, section "Toolkit settings": the nested bullet "Current state page" under the fixed line "Notion memory".

## The page

The page is plain text, not a database. `assets/current-state.md` is its starting text.

- Keep the first line in the form `Last updated: YYYY-MM-DD`, followed by what caused the change and who made it. A later session uses this date to judge freshness against current records.
- Keep every heading, also the heading of an empty part. An empty part holds "None."

## Reading it

The session-start hook prints the page. To read the page again, follow `using-notion-cli`, section "Reading and changing page text", with the Current state page's id from `PROJECT.md`.

## Changing it

Read the page again in this turn first. Then change the page with an `update_content` call, which `using-notion-cli` describes, and take the text for the call from that read. Update the "Last updated:" line in the same call.

- **Replace a line:** `old_str` is the line, and `new_str` is the new line.
- **Add a line:** `old_str` is the last line of the part, or the heading of the part. `new_str` is that text followed by the new line. In a part that says "None.", replace that line with the new line.
- **Remove a line:** `old_str` is the line with its line break, and `new_str` is empty.

```json
{"type":"update_content","update_content":{"content_updates":[
  {"old_str":"Last updated: 2026-09-30, kickoff, owner","new_str":"Last updated: 2026-10-02, handoff, agent"},
  {"old_str":"- 2026-10-01: kickoff call with the client.","new_str":"- 2026-10-07: meeting with the client and the vendor (PT-04)."}]}}
```

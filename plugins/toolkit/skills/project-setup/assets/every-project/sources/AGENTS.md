# sources/: the originals the project keeps

This folder holds every original the project received and keeps: a meeting note, a transcript, an email, a client document, a screenshot, an export. Each has one ID, SRC-###. Other records name the ID. An original is never stored inside a work item.

## Files

| File | What it is |
| --- | --- |
| `README.md` | The list: one row per original. |
| `SRC-###-<short-name>.<extension>` | One filed original. |
| `SRC-###-<short-name>/` | One original that is several files, such as an email with its attachments. |

## The form of a row in the list

| Column | What it holds |
| --- | --- |
| ID | SRC- and three digits. The next ID is the highest in the list plus one. Never reuse an ID. |
| Date received | The date the project received it, as YYYY-MM-DD. |
| From | The person, team, or system it came from. |
| What it is | The kind of original and its subject, in one line. A corrected version says which SRC it replaces. |
| Where kept | A link to the file or folder here. For an original kept outside Git, the lasting place it is kept. |
| Used by | The IDs of the work items, decisions, and rules that used it, or "none yet". |

A source has no status. A row is never removed.

## An original kept outside Git

- Keep an original out of Git when it is large, holds personal data, or is a file type the repository refuses.
- It still gets its SRC-### and its row. "Where kept" names the place and how to reach it.
- Never write a temporary download address in "Where kept". It stops working.

## What must stay true

- Never edit, rename, or delete an original once it is filed. A corrected version is a new SRC whose row names the old one.
- Add the row in the same edit that files the original.
- Other records point here by SRC-###. Never copy a source's text into a work item, a decision, or a system document.
- A source is somebody's words, not the project's truth. What the project decided from it goes in `DECISIONS.md` or `system/`.
- When a record starts to use a source, add that record's ID to "Used by".
- Outside documentation that the project captured from a public page is not a source. It goes in `reference/outside-docs/`.
- `.claude/hooks/validate-records.mjs` checks the list and the files here after each edit and before each commit. Fix what it reports.

## Which skill to use

| Change | Use |
| --- | --- |
| File an original, add its row, or add an ID to "Used by" | `filing-project-records`, step "file a source" |
| Record what the project decided from a source | `filing-project-records`, step "record a decision" or "update a system document" |
| Commit the change to the default branch | `publish-docs` |

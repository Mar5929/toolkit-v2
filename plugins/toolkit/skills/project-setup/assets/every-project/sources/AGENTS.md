# sources/: the originals the project keeps

This folder holds every original the project received and keeps, unchanged, such as a meeting note, a transcript, an email, a client document, a screenshot, or an export. Each has one ID, SRC-###. Other records name the ID. An original is never stored inside a work item.

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

- Text the owner pasted, and a Markdown or plain text file, is kept in this folder.
- Ask the owner before you file any of these: another file type; a file over 10 MB; a file that holds personal data beyond people's names and work roles. Ask one question: "Commit <file name> (<type>, <size>) to the repository, or keep it outside Git?" For one kept outside Git, ask where it is kept permanently.
- An original kept outside Git still gets its SRC-### and its row. "Where kept" names the place and how to reach it.
- Never write a download address that expires in "Where kept".

## What must stay true

- Save an original exactly as it was received: never tidy, shorten, translate, or correct it. Once it is filed, never edit, rename, or delete it. A corrected version is a new SRC whose row names the old one.
- Add the row in the same edit that files the original.
- Other records point here by SRC-###. Never copy a source's text into a work item, a decision, or a system document.
- Never use a statement in a source as a decision or a rule. What the project decided from it goes in `DECISIONS.md` or `system/`.
- When a record starts to use a source, add that record's ID to "Used by".
- Outside documentation that the project captured from a public page is not a source. It goes in `reference/outside-docs/`.
- `.claude/hooks/validate-records.mjs` checks the list and the files here after each edit and before each commit. Fix what it reports.

## Which skill to use

| Change | Use |
| --- | --- |
| File an original, add its row, or add a work item's ID to "Used by" | `filing-project-records`, step "file a source" |
| Record what the project decided from a source, and add that decision's or rule's ID to "Used by" | `filing-project-records`, step "record a decision" or "update a system document" |
| Commit the change to the default branch | `publish-docs` |

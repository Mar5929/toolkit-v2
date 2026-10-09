# sources/: the sources the project keeps

This folder holds every source the project keeps. A source is anything the project received and keeps, unchanged, such as a meeting note, a transcript, an email, a client document, a screenshot, or an export. Each source has one ID, SRC-###. Other records name the ID. A source is never stored inside a work item.

## Files

| File | What it is |
| --- | --- |
| `README.md` | The list: one row per source. |
| `SRC-###-<short-name>.<extension>` | One filed source. |
| `SRC-###-<short-name>/` | One source that is several files, such as an email with its attachments. |

## The form of a row in the list

| Column | What it holds |
| --- | --- |
| ID | SRC- and three digits. The next ID is the highest in the list plus one. Never reuse an ID. |
| Date received | The date the project received it, as YYYY-MM-DD. |
| From | The person, team, or system it came from. |
| What it is | The kind of source and its subject, in one line. A corrected version says which SRC it replaces. |
| Where kept | A Markdown link to the file or folder here, such as `[SRC-004-kickoff-notes.md](SRC-004-kickoff-notes.md)`. For a source kept outside Git, the permanent place where it is kept, with no Markdown link. |
| Used by | The IDs of the work items, decisions, and rules that used it, or "none yet". |

A source has no status. A row is never removed.

## A source kept outside Git

- Text the owner pasted, and a Markdown or plain text file, is kept in this folder.
- Ask the owner before you file any of these three: a file of another type, a file over 10 MB, or a file that holds personal data beyond people's names and work roles.
  - Ask one question: "Commit <file name> (<type>, <size>) to the repository, or keep it outside Git?"
  - When the owner chooses to keep it outside Git, ask where the source is kept permanently.
- A source kept outside Git still gets its SRC-### and its row. "Where kept" names the place and how to reach it.
- Never write a download address that expires in "Where kept".

## What must stay true

- Save a source exactly as it was received. Never clean up, shorten, translate, or correct it. Once it is filed, never edit, rename, or delete it. A corrected version is a new SRC whose row names the old one.
- Add the row in the same edit that files the source.
- Other records point here by SRC-###. Never copy a source's text into a work item, a decision, or a system document.
- Never use a statement in a source as a decision or a rule. What the project decided from it goes in `DECISIONS.md` or `system/`.
- When a record starts to use a source, add that record's ID to "Used by".
- Outside documentation that the project captured from a public page is not a source. It goes in `reference/outside-docs/`.

## Which skill to use

| Change | Use |
| --- | --- |
| File a source, add its row, or add a work item's ID to "Used by" | `filing-project-records`, step "file a source" |
| Record what the project decided from a source, and add that decision's or rule's ID to "Used by" | `filing-project-records`, step "record a decision" or "update a system document" |
| Commit the change to the default branch | `publish-docs` |

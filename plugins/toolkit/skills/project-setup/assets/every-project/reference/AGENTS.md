# reference/: material that is not the project's own decision

This folder holds two kinds of material the project reads but did not decide: documentation captured from outside, and the record of the system as it is today. Nothing here is the project's truth. What the project decided goes in `system/` or `DECISIONS.md`.

## Folders

| Folder | What goes in it |
| --- | --- |
| `outside-docs/` | Public documentation captured from a vendor or a product: a guide, an API reference, a release note. One folder per topic. |
| `outside-docs/INDEX.md` | One row per topic folder. |
| `current-system/` | What exists today, before this project's changes. One file per area of the system. |

Never put here: a client file, a meeting note, or a transcript (they go in `sources/`); a project decision; an instruction for agents.

## The form of a topic folder in outside-docs/

- `outside-docs/<topic>/` holds the captured pages as Markdown, and one `SOURCE-RECORD.md`.
- `SOURCE-RECORD.md` gives, for each page: the publisher, the web address, the date it was captured, and what it covers.
- The row in `INDEX.md` gives: the topic folder, the source and subject, the capture date, and when to consult it.

## The form of a file in current-system/

One file per area, named for the area in lowercase words joined by hyphens. It holds these sections:

| Section | What it holds |
| --- | --- |
| What this area does today | The behavior that was observed, and who uses it. |
| Components | A table: the component, its role, where it is, and the evidence. |
| Data and flow | How information enters, changes, and leaves the area. |
| How it runs | Permissions, schedules, limits, what happens on a failure, and who supports it. |
| Known gaps | What was not checked, what may be out of date, and where to confirm it. |
| Last verified | The date, the environment, the sources, and who checked. |

## What must stay true

- Never edit a captured page. Capture it again and update its `SOURCE-RECORD.md`.
- Add or change the `INDEX.md` row in the same edit as the topic folder.
- A file in `current-system/` holds observed facts only. Put the evidence beside each claim, and put anything unsure under Known gaps.
- Every file in `current-system/` says the date and the environment it was observed in.
- When a page here disagrees with `system/`, `system/` wins. Tell the owner about the disagreement.
- What the project concluded from a page goes in `system/`, `DECISIONS.md`, or the work item, with the page's path beside it.

## Which skill to use

| Change | Use |
| --- | --- |
| Capture a page, or write a file in `current-system/` | No skill: follow this file |
| Record what the project decided from this material | `filing-project-records`, step "record a decision" or "update a system document" |
| Commit the change to the default branch | `publish-docs` |

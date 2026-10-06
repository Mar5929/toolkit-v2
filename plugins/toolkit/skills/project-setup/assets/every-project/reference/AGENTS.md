# reference/: material that is not the project's own decision

This folder holds two kinds of material the project reads but did not decide: documentation captured from outside the project, and the record of how the existing system works today. Never use a page here as a decision or a rule of this project: what the project decided is in `system/` or `DECISIONS.md`.

## Folders

| Folder | What goes in it |
| --- | --- |
| `outside-docs/` | Documentation captured from outside the project, such as a vendor's guide, a product's API reference, or a release note. One folder per topic. |
| `outside-docs/INDEX.md` | One row per topic folder. |
| `current-system/` | The record of how the system works today: what was observed, in which environment, and on which date. One file per area of the system. |

Never put any of these here: a client file, a meeting note, or a transcript, which go in `sources/`; a project decision; an instruction for agents.

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

## An analysis of how the system works today

When the owner asks how a part of the existing system works today, or a work item needs to know it:

1. Before you reply, write what you found in that area's file in `current-system/`, in the form above. When the area already has a file, add to that file.
2. Answer from the file, and name its path in the reply. A result given only in the reply is lost, because a later session never sees the reply.
3. When the analysis was for a work item or a project task, write the file's path there with `running-work-item-lifecycle`.
4. Never commit the file without the owner's yes, because `publish-docs` commits only an edit the owner asked for or said yes to.
   - In a session in the main checkout, leave the file there, and say in the reply that it is not committed yet.
   - In a session in its own worktree, say in the reply that the file is not committed yet, and ask the owner whether to commit it with `publish-docs`. A later session does not see a file that is only in that worktree.

## What must stay true

- Never edit a captured page. Capture it again and update its `SOURCE-RECORD.md`.
- Add or change the `INDEX.md` row in the same edit as the topic folder.
- A file in `current-system/` holds observed facts only. Put the evidence beside each claim, and put anything unsure under Known gaps.
- Every file in `current-system/` says the date and the environment it was observed in.
- When a page here disagrees with `system/`, use what `system/` says. Tell the owner about the disagreement.
- What the project concluded from a page goes in `system/`, `DECISIONS.md`, or the work item, with the page's path beside it.

## Which skill to use

| Change | Use |
| --- | --- |
| Capture a page, or write a file in `current-system/` | No skill: follow this file |
| Record what the project decided from this material | `filing-project-records`, step "record a decision" or "update a system document" |
| Commit the change to the default branch | `publish-docs` |

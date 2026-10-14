# work-items/: the project's work items

This folder is where the project keeps its work items. It holds one folder for each work item. A work item is one piece of work, such as a feature, a fix, or a change, from idea to Done.

This guide says what each file and folder here is, the form of a work item's ID, which header fields say where a work item stands, and what must stay true in this folder.

A work item stays in this folder after it is closed. Keep knowledge that later work needs in `sources/` and in the places that the root `AGENTS.md`, section "Where information goes", gives for shared decisions and system rules, so later work can find the current project guidance. Read a closed work item when its history or evidence is needed.

## Files

| File or folder | What it is |
| --- | --- |
| `<ID>-<short-slug>/` | The folder of one work item. `<short-slug>` is lowercase words from the title, joined by hyphens. A sub-item is a work item inside another work item, and its folder is inside its parent's folder. |
| `<ID>-<short-slug>/<ID>.md` | The work item's main file. It holds the header fields, which are the lines between the two `---` lines at the top of the file. Below them it holds the Overview with the work item's Current state, the Roadmap, Tasks, Recent History, Requirements, Questions and Answers, and Notes. |
| `<ID>-<short-slug>/DESIGN.md` | The work item's design. It is made when a design starts, and it stays with the work item after delivery. |
| `PROJECT-TASKS.md` | The project's own tasks, which belong to no work item. This file is not a work item. |
| `work-item-template/` | The templates: `WORK-ITEM.md` for a main file and `DESIGN.md` for a design. This folder is not a work item. Never write a work item into it. |
| `archive/` | The work items that the owner asked to archive. |
| A folder with no ID in its name | A group that the owner asked for. It holds the folders of work items. |

## IDs

A work item's ID is the prefix, a hyphen, and three digits, for example `WI-031`.

- The prefix is the value of "Work item ID prefix" under "Toolkit settings" in `PROJECT.md`.
- The next ID is the highest `id:` anywhere in this folder plus one. Count the work items in `archive/`, and leave out `work-item-template/`.

Other IDs are used inside a work item: the ID of one of the work item's phases, of a task, of a requirement, and of a question. Open `.claude/skills/managing-work-items/references/work-levels.md`, and `work-item-template/WORK-ITEM.md` for the forms of those IDs and of a project task's ID.

- An ID inside a work item is unique within that work item.
- A project task's ID is unique within `PROJECT-TASKS.md`.

An ID is never reused. That rule covers every ID in this section.

## Header fields that say where a work item stands

`work-item-template/WORK-ITEM.md` lists the header fields and their allowed values. Follow `managing-work-items/references/work-tracker-field-mapping.md` when editing them.

Open `.claude/skills/managing-work-items/references/lifecycle-rules.md`, "Status and State", for the ten States, the Status that each State gives, what Blocked means, and when a work item moves to the next State. `work-levels.md` says how deep sub-items go.

## What must stay true

- The `id:` line in the header is the work item's identity. Find a work item by its `id:` line, never by its path.
- No file in the project other than a work item's main file is named `<ID>.md`.
- The owner may move, rename, nest, or group the folders of work items by hand. When the owner has done so, find each work item again by its `id:` line, tell the owner what moved, and continue.
- Never move, group, archive, or rename a work item unless the owner asks.
- When two work items have one ID, renumber only a work item that you created in this session, and tell the owner.
- When this session works in a worktree, read and change work items in the main checkout.
- Never copy a work item into the worktree.
- Never `git add` a file from this folder.
- A work item's folder holds no sources. A source is anything the project was given by someone else, such as a transcript or a client document. A source goes in `sources/`, and the work item holds the source's ID, in the form SRC-###.
- When the owner put any other file in a work item's folder, leave the file there, and tell the owner that it is there.
- Information that another work item needs is never kept only in this folder. That information is where the root `AGENTS.md`, section "Where information goes", says, and the work item holds the ID or link that the information has there.

## Which skill to use

| Change | Use |
| --- | --- |
| Anything about a work item, the project's phases, or the project tasks: find, read, create, save, search, move, nest, archive, or rename a work item; change a header field or a section; decide a State, what to save, or an approval; close or cancel a work item | `managing-work-items` |
| A source that the work item was given | `filing-project-records`, step "file a source" |
| A decision or a rule that another work item needs | `filing-project-records`, step "record a decision" or "update a system document" |

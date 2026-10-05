# work-items/: the project's work items

This folder is the project's work tracker: one folder per work item. A work item is one piece of work, such as a feature, a fix, or a change, from idea to Done. An item is kept after it closes, but later work does not read a closed item: what later work needs is in `DECISIONS.md`, `system/`, and `sources/`.

## Files

| File or folder | What it is |
| --- | --- |
| `<ID>-<short-slug>/` | One work item. A sub-item's folder is inside its parent's folder. |
| `<ID>-<short-slug>/<ID>.md` | The item's main file: the header fields, the Overview with its Current state, the Roadmap, Tasks, Recent History, Requirements, Questions and Answers, and Notes. |
| `<ID>-<short-slug>/DESIGN.md` | The item's design, made when a design starts. It stays with the item after delivery. |
| `PROJECT-TASKS.md` | The project's own tasks, which belong to no work item. It is not an item. |
| `work-item-template/` | The forms: `WORK-ITEM.md` for a main file and `DESIGN.md` for a design. It is not an item. Never write an item into it. |
| `archive/` | Items the owner asked to archive. |
| A folder with no ID in its name | A group the owner asked for. It holds item folders. |

## IDs

| ID | Form | Rule |
| --- | --- | --- |
| Work item | The prefix, a hyphen, and three digits: `WI-031`. The prefix is "Work item ID prefix" under "Toolkit settings" in `PROJECT.md`. | The next ID is the highest `id:` anywhere in this folder plus one, `archive/` included and the template left out. |

An ID is never reused. `running-work-item-lifecycle`, "Levels", and `work-item-template/WORK-ITEM.md` give the forms of the IDs inside an item (a phase, a task, a requirement, a question) and of a project task's ID. An ID inside an item is unique within that item. A project task's ID is unique within `PROJECT-TASKS.md`.

## Header fields that say where an item stands

`work-item-template/WORK-ITEM.md` lists every header field and its allowed values. These six say where the item stands:

| Field | Meaning |
| --- | --- |
| `state` | The step the work is in: one of the ten States. |
| `status` | The summary of the State. It follows from the State, so the two change together. |
| `waiting_on` | Who the item waits on: `owner`, `agent`, `external: <who>`, or `none`. |
| `requirements_approved` | The date and the name of the person who approved the requirements, or `no`. |
| `design` | `proposed`, `approved`, `superseded`, or `none`. |
| `result_approved` | The date and the name of the person who approved the result, or `no`. |

`running-work-item-lifecycle`, "Status and State", lists the ten States, the Status each one gives, what Blocked means, and when an item moves to the next State. "Levels" says how deep sub-items go.

## What must stay true

- The `id:` line in the header is the item's identity. Find an item by its `id:`, never by its path.
- No file in the project other than an item's main file is named `<ID>.md`.
- The owner may move, rename, nest, or group item folders by hand. Find each item again by its `id:`, tell the owner what moved, and continue.
- Never move, group, archive, or rename an item unless the owner asks.
- When two items have one ID, renumber only an item you created in this session, and tell the owner.
- From a worktree, read and change items in the main checkout. Never copy an item into the worktree, and never `git add` a file from this folder.
- An item folder holds no originals. An original goes in `sources/`, and the item names it by SRC-###.
- Leave any other file the owner put in an item folder, and tell the owner it is there.
- What another work item needs to know never stays only here: it is in `DECISIONS.md` or `system/`, and the item holds its ID.
- `.claude/hooks/validate-records.mjs` checks the items after each edit. Fix what it reports.

## Which skill to use

| Change | Use |
| --- | --- |
| Find, read, create, save, search, move, nest, archive, or rename an item; change a header field or a section | `using-work-tracker` |
| Decide a State, what to save, or an approval; the project's phases and project tasks | `running-work-item-lifecycle` |
| Close or cancel an item | `running-work-item-lifecycle`, its closing step |
| An original the item received | `filing-project-records`, step "file a source" |
| A decision or a rule another work item needs | `filing-project-records`, step "record a decision" or "update a system document" |

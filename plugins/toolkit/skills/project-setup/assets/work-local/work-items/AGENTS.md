# work-items/: the project's work items

This folder is the project's work tracker: one folder per work item, from idea to Done. It holds temporary work. The lasting records are `DECISIONS.md`, `system/`, and `sources/`.

## Files

| File or folder | What it is |
| --- | --- |
| `<ID>-<short-slug>/` | One work item. A sub-item's folder sits inside its parent's folder. Three levels is the deepest. |
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
| Phase of a top-level item | `P1`, `P2` | A sub-item has no phases. |
| Task | `P1-T01` in a top-level item; `T01` in a sub-item | |
| Requirement | `R-01` | A dropped requirement keeps its block and its number. |
| Question | `Q-01` | |
| Project task | `PT-01` | In `PROJECT-TASKS.md`. |

An ID is never reused. The IDs inside an item are unique within that item.

## Header fields that say where an item stands

`work-item-template/WORK-ITEM.md` lists every header field and its allowed values. These six say where the item stands:

| Field | Meaning |
| --- | --- |
| `state` | The step the work is in. One of the ten States below. |
| `status` | The summary of the State. It follows from the State, so the two change together. |
| `waiting_on` | Who the item waits on: `owner`, `agent`, `external: <who>`, or `none`. |
| `requirements_approved` | The date and the name of the person who approved the requirements, or `no`. |
| `design` | `proposed`, `approved`, `superseded`, or `none`. |
| `result_approved` | The date and the name of the person who approved the result, or `no`. |

| State | Status | Meaning |
| --- | --- | --- |
| Backlog | Not Started | An idea in the owner's words. No work has started. |
| Refining Requirements | Preparing | The requirements are being agreed with the owner. |
| Designing | In Progress | Design options are being written for the owner to choose from. |
| Building | In Progress | The tasks are being done. |
| Testing Loop | In Progress | A separate checker tests the result, and the owner approves it. |
| Reflecting | In Progress | The result is approved. The item's follow-up checklist is being done. |
| Deploying | In Progress | The work is being merged and deployed. |
| Blocked | Blocked | The work is stuck on something outside it: missing access, another team, or a piece that must be finished first. Waiting for the owner's answer is not Blocked. |
| Done | Done | The owner marked it Done. |
| Cancelled | Cancelled | The owner cancelled it. The item and every record in it are kept. |

## What must stay true

- The `id:` line in the header is the item's identity. Find an item by its `id:`, never by its path.
- No file in the project other than an item's main file is named `<ID>.md`.
- The owner may move, rename, nest, or group item folders by hand. Find each item again by its `id:`, tell the owner what moved, and continue.
- Never move, group, archive, or rename an item unless the owner asks.
- When two items have one ID, renumber only an item you created in this session, and tell the owner.
- From a worktree, read and change items in the main checkout. Never copy an item into the worktree, and never `git add` a file from this folder.
- An item folder holds no originals. An original goes in `sources/`, and the item names it by SRC-###.
- Leave any other file the owner put in an item folder, and tell the owner it is there.
- An item becomes Done or Cancelled only on the owner's word, and only after its closing step recorded whether it changed `system/` or `DECISIONS.md`.
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

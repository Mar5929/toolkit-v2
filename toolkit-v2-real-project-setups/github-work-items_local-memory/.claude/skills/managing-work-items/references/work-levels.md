# Levels, phases, and tasks

| Level | Phases | Holds |
| --- | --- | --- |
| Project | `P01`, `P02`… (the roadmap) | Top-level items, each under one project phase; project tasks in one plain list |
| Top-level item | Optional `P1`, `P2`… | Tasks and level-2 sub-items |
| Level-2 sub-item | None | Tasks and level-3 sub-items |
| Level-3 sub-item | None | Tasks only |

- No fourth level; make it a task instead. No ID is ever reused.
- A project phase (`P01`) groups items; an item phase (`P1`) groups that item's work. A phase is never a work item.
- Name phases by what they deliver ("P1 — Personas agreed"). Use item phases only when they help plan or track.
- Project phases change only with the owner's yes. Propose them the first time an item leaves Backlog. A project with no planned order gets one phase, `P01 — Ongoing support`, and every item goes under it without asking.
- Each top-level item is in a project phase by the time it leaves Backlog. Ask which, with a recommendation, if the owner hasn't said.
- When the last open item in a project phase closes, ask whether the phase is Done.
- Task IDs: `P1-T01` under an item phase, `T01` in a plain list, `PT-01` for a project task. IDs stay put when grouping changes.
- A task outside the item's approved goal becomes a new Backlog item. A defect that blocks the approved flow is the exception: fix it inside this item.
- A project task is admin work that belongs to no item, including to-dos and meeting action items. Save it the turn it comes up, without asking. If it came from a transcript or file, file that source first with filing-project-records and cite its ID. Record who owes it and when it's due.
- When it's unclear whether something is a task, a sub-item, or a new item, ask one question with a recommendation and save nothing until answered.

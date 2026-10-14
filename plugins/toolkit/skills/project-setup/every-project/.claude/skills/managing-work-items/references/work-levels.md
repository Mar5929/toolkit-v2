# Levels, phases, and tasks

Use this reference when creating, organizing, moving, or reporting work items, phases, or tasks. The hierarchy and stable IDs stay consistent across the work tracker.

## Levels

Every project divides its work into the same four levels, wherever it keeps its work items. A top-level work item is a work item with no parent, and a sub-item is a work item inside another work item. `references/work-tracker.md` says where each part is saved.

| Level | Its phases | What it holds |
| --- | --- | --- |
| The project | Project phases `P01`, `P02`, and so on. They are the project's roadmap. | Its top-level work items, each under exactly one project phase. Its project tasks, in one plain list with no phases. |
| Top-level work item (level 1) | Optional phases `P1`, `P2`, and so on, when grouping by outcomes helps plan or track the work. They are the work item's roadmap. | Its tasks and its level-2 sub-items, under phases when it uses them, or in a plain list. |
| Level-2 sub-item | None | One plain task list, and its level-3 sub-items. |
| Level-3 sub-item | None | One plain task list. |

- Never add a fourth level. Make the work a task instead.
- No ID is ever reused. This rule holds for the ID of a work item, a phase, a task, a requirement, and a question.
- When it is unclear whether something is a project task, a new work item, a sub-item, or a task in a work item, ask the owner one short question with your recommendation. Save nothing until the owner answers.

### Phases

A project phase (`P01`) and a work item's phase (`P1`) are different things. A project phase groups top-level work items. A work item's phase groups that work item's tasks and its level-2 sub-items. A phase is never a work item.

- During Refining Requirements, use work-item phases when they help plan or track distinct outcomes. Otherwise, use a plain task list. A level-2 sub-item of a top-level parent without phases has no phase.
- A top-level work item goes under a project phase when the owner places it, and at the latest when it leaves Backlog. When the owner has named no project phase by then, ask which one, with your recommendation.
- The project's phases change only with the owner's yes. Propose new project phases, or a change to them, as one question, with a reason for each new phase and for each change.
- When a project has no phases yet, propose them the first time a work item leaves Backlog.
- When the first work item of a project phase leaves Backlog, set that project phase In Progress.
- When the last open work item in a project phase becomes Done or Cancelled, ask the owner in your next reply whether the project phase is Done.
- A project whose owner has no planned order of work has one project phase, `P01 — Ongoing support`. A project that handles a client's requests as they come in is an example.
  - Propose that phase when the project has no phases yet.
  - While it is the project's only phase, put every top-level work item under it without asking the owner which phase.
  - Never ask whether it is Done. It stays In Progress until the owner says that the support has ended.

### Tasks

- Every task belongs to exactly one place: the project, or one work item.
- A task in a work item is a step toward that work item's goal. Triage work outside the approved goal as a separate Backlog work item. When a defect prevents the approved user flow from working, record the defect and the fix needed to meet the approved requirements in this item. If the fix changes those requirements or an owner decision, get the required approval through Refining Requirements before building it.
- A task ID has one of three forms:
  - `P1-T01` for a new task under a work-item phase: the phase, then the task's number.
  - `T01` for a new task in a plain list, in a top-level item or a sub-item.
  - `PT-01` for a project task.
- Existing task and phase IDs stay unchanged when plan grouping changes.

### Project tasks

A project task is an administrative task that belongs to no work item. These two things are also project tasks:

- a to-do that the owner names or asks you to keep, such as "we need to prepare for Wednesday's call";
- an action item from a meeting or a message that belongs to no work item.

Save a project task in the turn it comes up, with no question to the owner. Fill its lines as follows:

- Its Who does it is `owner`, `agent`, or the name of the other person who owes it, with the party, such as `Sarah Chen (client)` or `DataBridge (vendor)`.
- Its Work line says what is owed and to whom.
- Its Done when holds the date it is due, when a date was named.
- When the project task comes from a source that the owner gave, such as a transcript, file that source first, with no question to the owner. Use `filing-project-records`, step "file a source". Then name the source's SRC ID in the Work line.

Work a project task the way you work a task in a work item: set it In Progress before you start it, and tick it only when its Done when check is met.

Whenever you report what waits on the owner or what other people owe, name each open project task with who does it.


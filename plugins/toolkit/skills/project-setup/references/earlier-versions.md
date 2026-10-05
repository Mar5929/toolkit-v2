# Changes from earlier toolkit versions

Purpose: three parts of "update the toolkit", each for a project set up
before one version of the toolkit: the move from Stage to State (toolkit
0.6.0), the levels structure (toolkit 0.8.0), and the Requirements layout
(toolkit 0.8.1). `update.md`, section 5, says which part a project needs.

Every change to a local work item or to `memory/` is made in the main
checkout, at the time `update.md`, "Before you start", gives.

## Contents

- Work items from Stage to State
- The levels structure (toolkit 0.8.0)
- The Requirements layout (toolkit 0.8.1)

## Work items from Stage to State

Before toolkit 0.6.0, each work item had a stage (`01-discovery` to
`14-spec-update`) and the statuses Backlog, Ready, In Progress, In Review,
Done, and Cancelled. The stage is now the State. After his yes, give each
work item its State, using the first row that matches:

| Old value | New State |
| --- | --- |
| Status Done or Cancelled | Done or Cancelled, the same |
| Status Backlog | Backlog |
| Stage 01 or 02 | Refining Requirements |
| Stage 03 or 04 | Designing |
| Stage 05 to 08 | Building |
| Stage 09 to 11 | Testing Loop |
| Stage 12 or 13 | Deploying |
| Stage 14 | Reflecting |

- Set the Status that goes with the new State (the Status and State table
  in the `SKILL.md` of `running-work-item-lifecycle`) in the same change.
- Local: every item in `work-items/`, sub-items and `archive/` included.
  Replace the `stage:` line with a `state:` line, and set `status:` and
  `updated:` in the same edit.
- Notion: every row of Work Items, archived ones included, after "From
  Stage to State" in `notion-build/work-setup.md` has added the State
  property and the Status options.
- GitHub: open issues only, after the `state:` labels exist (`github.md`,
  "Bringing a project up to date", step 3). A closed issue's labels are
  ignored.
- A Next action that ends ", with <skill>." (one of the skills that
  `update.md`, section 4, lists as retired): remove that ending, so it
  matches a form the work item template gives. In Notion, change the page's
  Current state and the Next action property together.
- Add a Recent History row to each changed item: "Toolkit update: stage
  <old> is now State <new>." Change nothing else in the item.
- Tell the owner in one short list how many items moved to each State.

## The levels structure (toolkit 0.8.0)

Since toolkit 0.8.0, only the project and its top-level items have phases:
a sub-item's tasks are one plain list, and the project has its own phases
(`P01`) and its own tasks (`running-work-item-lifecycle`, "Levels"). The storage
files named here are in each tracker's `using-work-tracker` skill, in this
skill's `assets/work-local/`, `assets/work-notion/`, and
`assets/work-github/` (under `.claude/skills/`). The same release gives a
Notion task one status field (step 5) and removes "Untracked to-dos" from
Current State (step 6). Show the owner every change below in one numbered
list, and make each only after his yes. Nothing is deleted except
what a step names, and each item keeps its task IDs.

1. **Sub-items that have phases.** List every level-2 and level-3 item that
   still has a phase that is not Cancelled, or a task under a phase. Convert each one with "An item that
   changes level", "Phases to a plain list": local, `field-mapping.md`;
   Notion, `database-layout.md`; GitHub, `issue-layout.md`. A level-3 item
   that sits under a phase of its level-2 parent leaves that phase.
2. **Top-level items with no phase.** List each one that has left Backlog
   and has no phase. Give it one phase, as "A plain list to phases" says,
   named as the owner approves.
3. **The project's roadmap.**
   - Local: `PROJECT-ROADMAP.md` stays. When it still has work units
     (`### P01-U01` headings), show him the new version: each phase lists
     the top-level items its units named (`project-roadmap-and-tasks.md`),
     and a unit with no item is listed for him to keep as a new Backlog
     item or drop. Save it with `publish-docs` after his yes.
   - Notion or GitHub: the phases move into the tracker. When the project
     folder has a `PROJECT-ROADMAP.md`, add each of its phases as a project
     phase, with the items its units named (Notion: `database-layout.md`,
     "The project's phases and tasks"; GitHub:
     `project-roadmap-and-tasks.md`). Then ask whether to remove the file
     in your worktree; it stays until he says yes.
   - A project with no phases yet gets none now: `running-work-item-lifecycle`
     proposes them when the next item leaves Backlog.
4. **Project tasks.** Local: `work-items/PROJECT-TASKS.md` comes in with
   the missing files, in the main checkout. Notion: the "Project tasks"
   view comes with the views (`notion-build/work-setup.md`). GitHub:
   nothing now; the "Project tasks" issue is made with the first project
   task.
   Notion: add Phase type and Task type, and make "By project phase",
   "Project phases", and "Project tasks" the first tabs, in the project and in the shared
   "Project" template (`notion-build/work-setup.md`, "Bringing a project
   up to the current template", steps 2, 3, and 5). Then give the owner
   the page-layout clicks to pin Phase type and Task type
   (`notion-build/work-layout.md`, "Property order and page layout").
5. **Task status in Notion.** A task has one status field, Status, and no
   "Done" checkbox: `notion-build/work-setup.md`, "From the Done checkbox
   to Status", in the project and in the shared "Project" template.
6. **Untracked to-dos.** Current State no longer has an "Untracked to-dos"
   section. For each line under it, propose where it goes: the work item
   it concerns, a project task for administrative work, or a new Backlog
   item for other project work (`running-work-item-lifecycle`). Move each line
   where he approves, then remove the heading (local or Hindsight memory:
   `memory/CURRENT_STATE.md` in the main checkout; Notion memory: the
   "Current state" page, and the same page of the shared "Project"
   template, `notion-build/setup.md`, "Bringing memory up to the current
   layout", step 5). A section that says "None." needs no question:
   remove the heading.
7. Add a Recent History row to each changed item ("Toolkit update: the
   levels structure of toolkit 0.8.0.", and what changed), and tell the
   owner in one short list what changed.

## The Requirements layout (toolkit 0.8.1)

Since toolkit 0.8.1, the Requirements section of a work item holds one
block for each requirement, headed "Requirement <number>: <short name>":
the original requirement word for word, its goal, its numbered Functional
Requirements, and its numbered Acceptance Criteria
(`running-work-item-lifecycle`, `references/refining-requirements.md`). Text in
angle brackets in a template is an instruction, and an item an agent
creates or changes keeps none.

- **New items get the new layout** through the work item template. Local:
  the template files in `work-items/work-item-template/` are "Other toolkit
  files" in `update.md`, section 3; take the toolkit's after his yes. Notion:
  `notion-build/work-setup.md`, "Bringing a project up to the current
  template", step 4. GitHub: nothing to do; the template comes with the
  skills.
- **Existing work items stay as they are.** Never rewrite the
  Requirements section of an existing item in an update, in any tracker.
  The skills read the older layout as it is. An item moves to the new
  layout only when the owner asks for that item, and an item that holds
  the older label of its Functional Requirements (from before toolkit
  0.8.4) keeps it (`running-work-item-lifecycle`,
  `references/refining-requirements.md`, "The Requirements layout").
- Tell the owner in one line that new items get the new layout and
  existing items keep theirs.

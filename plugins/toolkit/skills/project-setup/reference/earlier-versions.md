# Changes from earlier toolkit versions

This file holds three parts of "update the toolkit". Each part is for a project that was set up before one version of the toolkit: the move from Stage to State (toolkit 0.6.0), the levels structure (toolkit 0.8.0), and the Requirements layout (toolkit 0.8.1). Open it when a project was set up before one of those versions. The move-over and the files for Notion and GitHub point to its parts. A part is done when the project is as that part describes and the owner has been told what changed.

Make every change to a local work item or to `memory/` in the main checkout, at the time that `reference/update.md`, "Before you start", gives. The main checkout is the project's main folder, the first path that `git worktree list` prints.

## Contents

- Work items from Stage to State
- The levels structure (toolkit 0.8.0)
- The Requirements layout (toolkit 0.8.1)

## Work items from Stage to State

Before toolkit 0.6.0, each work item had a stage (`01-discovery` to `14-spec-update`) and the statuses Backlog, Ready, In Progress, In Review, Done, and Cancelled. The stage is now the State. After the owner's yes, give each work item its State. Use the first row of this table that matches:

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

- In the same change, set the Status that goes with the new State. The Status and State table in `managing-work-items/references/lifecycle-rules.md` gives the Status for each State.
- With local work items, change every work item in `work-items/`, sub-items and `archive/` included. A sub-item is a work item inside another work item. Replace the `stage:` line with a `state:` line, and set `status:` and `updated:` in the same edit.
- With work items in Notion, change every row of Work Items, archived rows included. The Work Items database needs the State property and the Status options first. `work-tracker-database-layout.md` lists them. Add them only as the owner says.
- With work items in GitHub, change open issues only, after the `state:` labels exist. `choices/work-items/github/github-work-items-setup.md`, "Bringing a project up to date", step 3, says which label to add to each issue and which to remove. A closed issue's labels are ignored.
- When a Next action ends ", with <skill>.", and the skill is one that the project no longer has, remove that ending, so that the Next action matches a form that the work item template gives. In Notion, change the Current state on the work item's page and the Next action property together.
- Add a Recent History row to each changed work item: "Toolkit update: stage <old> is now State <new>." Change nothing else in the work item.
- Tell the owner in one short list how many work items moved to each State.

## The levels structure (toolkit 0.8.0)

Since toolkit 0.8.0, only the project and its top-level items have phases. A top-level item is a work item with no parent. A sub-item's tasks are one plain list. The project has its own phases (`P01`) and its own tasks, which are called project tasks. `managing-work-items/references/lifecycle-rules.md`, "Levels", describes the levels, the phases, and the tasks.

The same release gives a Notion task one status field (step 5) and removes "Untracked to-dos" from the project's Current State (step 6). The project's Current State is the project's one short page of what is true now.

Show the owner every change below in one numbered list, and make each change only after the owner's yes. Delete nothing except what a step names. Each work item keeps its task IDs.

The steps name storage references, such as `work-tracker-field-mapping.md` for local work. The chosen work folder adds those files inside `managing-work-items`; their sources are this skill's `choices/work-items/local/files-to-add/`, `assets/work-notion/`, and `choices/work-items/github/files-to-add/` (under `.claude/skills/`).

1. **Sub-items that have phases.** List every level-2 and level-3 work item that still has a phase that is not Cancelled, or a task under a phase. Convert each one with "A work item that changes level", "Phases to a plain list". With local work items that text is in `work-tracker-field-mapping.md`, with Notion in `work-tracker-database-layout.md`, and with GitHub in `work-tracker-issue-layout.md`. A level-3 work item that sits under a phase of its level-2 parent leaves that phase.
2. **Top-level items with no phase.** List each top-level item that has left Backlog and has no phase. Give it one phase, as "A plain list to phases" says in the same storage file, with a name that the owner approves.
3. **The project's roadmap.**
   - With local work items, `PROJECT-ROADMAP.md` stays. When it still has work units (`### P01-U01` headings), show the owner the new version. In the new version, each phase lists the top-level items that its units named, in the form that `work-tracker-project-roadmap-and-tasks.md` gives. A unit with no work item is listed for the owner to keep as a new Backlog work item or to drop. Commit the new version with `publish-docs` after the owner's yes.
   - With work items in Notion or GitHub, the phases move into Notion or GitHub. When the project folder has a `PROJECT-ROADMAP.md`, add each of its phases as a project phase, with the work items that its units named. For Notion, `work-tracker-database-layout.md`, "The project's phases and tasks", says how. For GitHub, `work-tracker-project-roadmap-and-tasks.md` says how. Then ask the owner whether to remove the file in your worktree, which is your separate folder with its own branch. The file stays until the owner says yes.
   - A project with no phases yet gets none now. `managing-work-items` proposes phases when the next work item leaves Backlog.
4. **Project tasks.** A project task is a task that belongs to no work item.
   - With local work items, `work-items/PROJECT-TASKS.md` comes in with the missing files, in the main checkout.
   - With work items in Notion, tell the owner which of these the project's databases lack: the properties Phase type and Task type, and the views "By project phase", "Project phases", and "Project tasks". Add them only as the owner says.
   - With work items in GitHub, do nothing now. The "Project tasks" issue is made with the first project task.
5. **Task status in Notion.** A task has one status field, Status, and no "Done" checkbox. In a project whose Tasks database still has the checkbox, tell the owner, and make the change in Notion only as the owner says.
6. **Untracked to-dos.** The project's Current State no longer has an "Untracked to-dos" section.
   - For each line under that heading, propose where the line goes: the work item it concerns, a project task for administrative work, or a new Backlog work item for other project work. `managing-work-items` is the skill for a project task and for a new work item.
   - Move each line to the place that the owner approves, then remove the heading.
   - With local or Hindsight memory, the heading is in `memory/CURRENT_STATE.md` in the main checkout.
   - With Notion memory, the heading is on the project's "Current state" page.
   - When the section says "None.", it needs no question: remove the heading.
7. Add a Recent History row to each changed work item. The row holds "Toolkit update: the levels structure of toolkit 0.8.0." and what changed. Then tell the owner in one short list what changed.

## The Requirements layout (toolkit 0.8.1)

Since toolkit 0.8.1, the Requirements section of a work item holds one block for each requirement, headed "Requirement <number>: <short name>". A block holds the original requirement word for word, its goal, its numbered Functional Requirements, and its numbered Acceptance Criteria. `managing-work-items/references/refining-requirements.md` gives the layout in full. Text in angle brackets in a template is an instruction, and a work item that an agent creates or changes keeps no such text.

- **New work items get the new layout** through the work item template.
  - With local work items, the template files in `work-items/work-item-template/` are "Other toolkit files" in the table in `reference/update.md`, section 3. Take the toolkit's version of them after the owner's yes.
  - With work items in Notion, the project's work item template is the owner's. Tell the owner what differs, and change it only as the owner says.
  - With work items in GitHub, there is nothing to do, because the template comes with the skills.
- **Existing work items stay as they are.** Never rewrite the Requirements section of an existing work item in an update, wherever the project keeps its work items. The skills read the older layout as it is.
  - A work item moves to the new layout only when the owner asks for that work item.
  - A work item that holds the older label of its Functional Requirements (from before toolkit 0.8.4) keeps that label.
  - `managing-work-items/references/lifecycle-rules.md`, "A work item from an older template", gives the rule for a work item in the older layout.
- Tell the owner in one line that new work items get the new layout and existing work items keep theirs.

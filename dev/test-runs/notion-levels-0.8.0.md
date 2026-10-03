# Live test of the 0.8.0 Notion steps (TKV-7, 2026-10-03)

The Notion steps that came with the levels structure (0.8.0) were run once
on a throwaway Notion project, "TKV-7 check (safe to delete)". No real
project and no template was changed.

## What was run

| Step | Source | Result |
| --- | --- | --- |
| Test data: items, phases, and tasks in the throwaway project | `database-layout.md` | Worked |
| Add Phase type to Phases and Task type to Tasks | files `07c` and `07d` | Worked |
| Change the Tasks Status from select to status | `work-setup.md`, "From the Done checkbox to Status", step 3 | Worked, through the API |
| Set the filter of the Tasks view "Open tasks" | the same section, step 5, file `16` | Worked |
| Create the views "Roadmap", "By project phase", "Project phases", and "Project tasks" | files `13`, `18`, `19`, `19b` | Worked; each new view was first in its database |
| The searches | `searching.md` in the Notion `tracking-work-items` skill | Worked |
| Start a task and finish a task | `database-layout.md` | Worked |

## What the type change showed

`PATCH v1/data_sources/<tasks-data-source-id>` with the Status spec from
`03-tasks-database.json` was accepted. The property kept its id. Each
option landed in its group (Not Started in To-do, In Progress in In
progress, Done and Cancelled in Complete). Every task kept its Status. So
the agent can make this change, and the owner does not need to click
anything.

After the type change, the filter of "Open tasks" was empty. It must be
set after the change. `work-setup.md` now also saves the filter of every
Tasks view before the change and puts back each one that changed. That
step was added after this test and has not been run.

`work-setup.md` states only the rules that follow from this test: the
agent makes the call, and the filters are put back after it. The account
of the test is kept here.

## Faults found in the documents, fixed on 2026-10-03

1. `work-setup.md` said the owner changes the Status type by a click. The
   agent now makes the call.
2. `work-setup.md` now says to set the "Open tasks" filter after the type
   change, because the change can clear it.
3. "Bringing a project up to the current template", step 1, told the agent
   to wrap every spec in `{"properties": …}`. Files `07c` and `07d` (and
   `04` to `07b`) are already whole bodies with that wrapper. The text now
   says which files are sent as they are.
4. Step 5 of "From the Done checkbox to Status" now says to take only the
   `filter` object out of file `16`, which is a whole view body.
5. `ntn-commands.md` now says a hyphen in a property name becomes an
   underscore in a placeholder ("Sub-items" is `{{PH_SUB_ITEMS}}`).

## What was not tested

- Removing the "Done" checkbox.
- A Tasks database with no Status.
- The work item template step ("Bringing a project up to the current
  template", step 4).
- The "Project" template step (step 5).
- The column order of the table views.
- The page text (the project page and the work item pages).

## What was left in Notion

The throwaway project "TKV-7 check (safe to delete)" was left in place.
The owner can delete it.

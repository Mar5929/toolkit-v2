# Finding work in local files

Use the local tracker structure to locate the records needed for the request. Choose the search tools and queries that fit the job.

## Record identity and locations

Work items live in `work-items/` in the main checkout. The `id:` field identifies an item; its folder can move or be renamed. IDs use the prefix recorded in `PROJECT.md`, and a reference such as `WI-31` identifies `WI-031`. Match the complete ID so `WI-031` does not select `WI-0310`.

A main work-item file holds its fields, Current state, requirements, tasks, questions and history. `DESIGN.md` in the same folder holds its design. Neither `work-item-template/` nor `PROJECT-TASKS.md` is a work item. Archived items live in `archive/` and are omitted from ordinary active-work views; include them when the request or record history needs them.

## Information for common requests

| Request | Relevant records and fields |
| --- | --- |
| One work item | Its complete ID, title or supplied link/path; confirm the matched record's `id:`. |
| Active work | Items outside the archive whose State is not Done or Cancelled, with their priority, waiting_on and Next action. |
| Open questions | Questions and Answers rows with Status Open; template prompts are not questions. |
| A parent's work | Its nested item folders, parent fields and sub-item lists, with phase membership when the parent uses phases. |
| A subject or change | Titles, requirements, designs and history relevant to the requested topic or period. |

`work-tracker-folders-and-files.md` explains the hierarchy, owner edits and duplicate IDs. `work-tracker-project-roadmap-and-tasks.md` describes the project roadmap and administrative tasks.

A title, path or link can locate a record; the ID establishes its identity. Clarify only when the available context leaves more than one plausible work item. A failed lookup does not by itself justify creating a replacement item.

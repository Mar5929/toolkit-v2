# delivery/: the records of putting the work into use

This folder holds the records of putting the work into use: each release, each deployment to an environment, each data migration, and each handoff to the client or the next team, with what was done, where, when, and the result. It does not hold the work itself: the work item keeps the requirements, the tasks, and the history.

## Folders

| Folder | What goes in it | Name of one record |
| --- | --- | --- |
| `releases/` | One folder per release: several work items put into use together. | `<YYYY-MM-DD>-<release-name>/` |
| `deployments/` | One folder per deployment of a work item to an environment. | `<short name>/` |
| `migrations/` | One folder per area of data that is moved, loaded, changed, or corrected in bulk. | `<data-area>/` |
| `client-handoffs/` | One folder per handoff to the client or the next team. | `<YYYY-MM-DD>-<short-name>/` |

- Write each name in lowercase words joined by hyphens, after the date when there is one.
- A work item's short name is the one its work item records, as `managing-work-items`, `references/building.md`, says.
- A work item deployed to a second environment gets a second folder, with the environment added to the name: `<short name>-<environment>/`.
- Where one of these folders holds a template folder, start a record by copying it, and leave the template unchanged.

## The form of a record

With no template, a record is the file or files below, in its own folder, holding these fields.

| Record | File | Fields |
| --- | --- | --- |
| Deployment | `DEPLOYMENT-RECORD.md` | The work item's ID; the target environment; Status; the date and time it ran; who ran it and who is responsible; exactly what was deployed (a commit, a version, or a package); the checks before it; the owner's decision, with the date and where it is recorded; each manual step, in order, with who did it; the result; the checks after it. |
| Release plan | `CUTOVER-PLAN.md` | The owner of the release; the target environment; the time window; Status; the work items in it, each with its deployment record; what must be true before it starts; the steps in order; each point where the owner decides to go on or stop; how to undo it. |
| Release notes | `RELEASE-NOTES.md` | The release date; the environment; Status; one row per work item: its name, what changed for the user, and the evidence. |
| Migration area | An area file, a field mapping, and the rules for changing values, each named for the area | In the area file: the objects and the source systems; the work items it serves; Mapping status; the date and environment it was last checked. |
| Client handoff | `HANDOFF.md`, beside the files handed over | The date; who received it; how it was sent; the files, each with its purpose; the work items or the release it belongs to. |

## Status values

| Record | Status | Meaning |
| --- | --- | --- |
| Deployment | Preparing | The record is being written. Nothing has run. |
| Deployment | Validated | A check run against the target passed. Nothing is deployed. |
| Deployment | Deployed | The deployment ran, and the checks after it passed. |
| Deployment | Failed | The deployment did not finish, or a check after it failed. |
| Deployment | Rolled back | It was deployed and then undone. |
| Release plan | Planning | The plan is being written. |
| Release plan | Ready | Everything that must be true before the start is true, and the owner approved the window. |
| Release plan | In progress | The steps are running. |
| Release plan | Complete | Every step ran, and the checks passed. |
| Release plan | Rolled back | The release was undone. |
| Release notes | Planned | The release has not happened. |
| Release notes | Released | The release is complete. |
| Release notes | Rolled back | The release was undone. |
| Migration area | Draft | The mapping is being written. |
| Migration area | Verified | The mapping was checked against the source system and the target system. |
| Migration area | Superseded | Another mapping replaced it. |

A client handoff has no status.

## What must stay true

- Set a Status from what happened. Never set Deployed, Complete, or Released before the checks passed.
- Never commit a file that holds real records, such as a data load file, a backup, or a list of contacts made for the client. Keep the `.gitignore` in any folder that has one.
  - For a client handoff that includes such a file, or a file that `publish-docs` does not commit, such as a spreadsheet: put the file beside `HANDOFF.md` in the main checkout, and add the file's name to a `.gitignore` in that handoff's folder. Then commit `HANDOFF.md` and that `.gitignore`. Never commit the file. A file that Git does not track is lost when its worktree is removed.
- A source, which is anything the project received and keeps, goes in `sources/`, not here. A record here names it by SRC-###.
- A question that is still open goes in the work item. When more than one work item needs it, it goes where the root `AGENTS.md`, section "Where information goes", says. A record here names it by its ID or link.

## Which skill to use

| Change | Use |
| --- | --- |
| Write or update a deployment record, a release plan, or release notes | `managing-work-items`, in its Deploying state |
| Write or update a migration area | No skill: follow this file |
| Write a client handoff record | No skill: follow this file |
| Commit a record written before the work item's branch is merged | On that branch, with the work item's other changes |
| Commit a change made after the work item's branch was merged | `publish-docs` |
| Commit a record that belongs to no single work item, such as a release of several work items or a client handoff | `publish-docs` |

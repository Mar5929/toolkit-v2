# delivery/: what goes out of the project

This folder records each release, deployment, data migration, and client handoff: what went out, where, when, and with what result. The work item keeps the requirements and the history of the work.

## Folders

| Folder | What goes in it | Name of one record |
| --- | --- | --- |
| `releases/` | One folder per release that ships several work items together. | `<YYYY-MM-DD>-<release-name>/` |
| `deployments/` | One folder per work item that is deployed. | `<work item ID>-<short-name>/` |
| `migrations/` | One folder per area of data moved from an old system. | `<data-area>/` |
| `client-handoffs/` | One folder per handoff to the client or the next team. | `<YYYY-MM-DD>-<short-name>/` |

Write each name in lowercase words joined by hyphens, after the date or the ID.

A Salesforce project also has these, copied in at setup:

- `deployments/component-tracker.csv`, `deployments/full-project-deployment-template/`, and `deployments/work-item-deployment-template/`;
- `releases/release-cutover-template/`;
- `migrations/area-template/`, `migrations/data-loads/`, and `migrations/production-backups/`.

Where a template folder exists, start a record by copying it, and leave the template unchanged.

## The form of a record

With no template, a record is one Markdown file in its folder that holds these fields.

| Record | File | Fields |
| --- | --- | --- |
| Deployment | `DEPLOYMENT-RECORD.md` | The work item's ID; the target environment; Status; who is responsible; exactly what was deployed (a commit, a version, or a package); the checks before it; the owner's decision, with the date and where it is recorded; the result; the checks after it. |
| Release plan | `CUTOVER-PLAN.md` | The owner of the release; the target environment; the time window; Status; the work items in it, each with its deployment record; what must be true before it starts; the steps in order; each point where the owner decides to go on or stop; how to undo it. |
| Release notes | `RELEASE-NOTES.md` | The release date; the environment; Status; one row per work item: its ID, what changed for the user, and the evidence. |
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
| Migration area | Verified | The mapping was checked against the source and the target. |
| Migration area | Superseded | Another mapping replaced it. |

A client handoff has no status.

## What must stay true

- Name a work item by its ID, never by a folder path.
- Set a Status from what happened. Never set Deployed, Complete, or Released before the checks passed.
- Never commit a file that holds real records: a data load file or a backup. Keep the `.gitignore` in any folder that has one.
- An original received from someone else goes in `sources/`, not here. A record here names it by SRC-###.
- A question that is still open goes in the work item, or in `DECISIONS.md` when more than one work item needs it. A record here names it by its ID.

## Which skill to use

| Change | Use |
| --- | --- |
| Write or update a deployment record, a release plan, or release notes | `running-work-item-lifecycle`, in its Deploying state |
| Salesforce: the component tracker, a package file, or manual deploy steps | `sf-component-tracker` |
| Salesforce: a production data change, its load file, and its backup | `sf-data-change` |
| Salesforce: before a deploy to a shared org | `sf-deploy-check` |
| Commit a change made after the work item's branch was merged | `publish-docs` |

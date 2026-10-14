# Finding work on GitHub

Use the project's issue structure to locate the records needed for the request. `work-tracker-gh-commands.md` supplies the GitHub CLI and API details; choose queries that fit the request.

## Identity and project scope

The repository is recorded in `PROJECT.md`. An issue number identifies one work item within that repository. A supplied URL or title can locate it; confirm the repository and number before using the record. The pinned issue whose body starts with `## Project tasks` holds administrative tasks and is not a work item.

## Information for common requests

| Request | Relevant issue data |
| --- | --- |
| One work item | Number, title, body, labels and comments; a design comment starts with `## Solution design`. |
| Active work | Open issues with their state, priority and waiting-on labels and Current state. |
| Finished work | Closed issues; `stateReason` distinguishes Done from Cancelled as `work-tracker-labels.md` describes. |
| Owner decisions | Open Questions and Answers rows whose decision-maker is the owner, and issues marked `waiting-on:owner`. |
| A parent's work | Native sub-issue relations and the parent's phase or Sub-items list. |
| Topic or date | Relevant titles, bodies, comments and updated/closed dates; GitHub search includes comments unless fields narrow it. |

Read the actual issue or comment before relying on a search result. `work-tracker-gh-commands.md`, "Limits", covers result limits and pagination.

## Issues without the layout

An owner-created issue may lack `## Overview` or a state label. It is still the owner's work. `work-tracker-issue-layout.md`, "An issue made by hand", describes adopting the toolkit layout. Conflicting labels use `work-tracker-labels.md`, "A label the owner changed by hand".

## Changes since a date

Use the requested period. When no period was specified, the project's current state or a dated handoff can supply it; clarify only when the relevant period remains uncertain. Recent History explains work changes, and owner comments may contain newer directions.

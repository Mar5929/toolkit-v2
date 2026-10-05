---
name: using-work-tracker
description: 'Saves, finds, and changes work items as GitHub issues, so running-work-item-lifecycle reads and writes every item the same way. Use when an item must be read, created, saved, or searched, such as "show me #12" or "what is waiting on me". Not for deciding States or approvals; use running-work-item-lifecycle. Only for projects that track work in GitHub Issues.'
---

# The work tracker: GitHub Issues

This skill holds the storage: where each part of a work item lives in GitHub Issues, and the `gh` commands that read and change it. It never decides what happens next.

## How an item is stored

- One issue per work item. Its ID is the issue number, written `#12`. Find an item by its number, never by a link or a title. In a file or folder name, write the number without `#`: `12-test-plan.md`.
- The body is the work item template from `## Overview` to the end.
- The header fields are labels: State, type, priority, who it waits on, who builds it, and the approvals. Status has no label.
- Done is closed as completed. Cancelled is closed as not planned.
- A sub-item is a GitHub sub-issue, up to three levels. A top-level item's phase is a Roadmap row in its body, and each of its tasks a checkbox line under its phase. A sub-item has no Roadmap: its tasks are one plain checkbox list.
- The project's phases are milestones, one per project phase, and each top-level issue is in the milestone of its project phase. The project's tasks are checkboxes in one pinned issue, "Project tasks" (`references/project-roadmap-and-tasks.md`).
- The design is one comment whose first line is `## Solution design`. The agent's notes are comments.
- The repository is the "GitHub repository" line in `PROJECT.md`, under "Toolkit settings". It is `<repo>` in every command.

## After every write

Read the change back and check it says what you wrote. Report a write that failed, or that reads back differently, as `running-work-item-lifecycle`, "Every time", says.

## Gotchas

- Always pass `-R <repo>`. In a `gh api` path write `repos/<repo>/...`, never `{owner}/{repo}`: that takes the repository from the folder's Git remote, which can be a different repository.
- The sub-issue calls take the issue's numeric id, from `gh api repos/<repo>/issues/<number> --jq .id`. Not the issue number, and not the `id` that `gh issue view --json id` prints.
- Never write `close`, `closes`, `closed`, `fix`, `fixes`, `fixed`, `resolve`, `resolves`, or `resolved` directly before `#12` in a pull request title or body, or in a commit message. GitHub closes the issue when it merges, which marks the item Done without the owner's yes. Write "Part of #12". Never link a pull request in the issue's "Development" panel: that closes the issue on merge too. When an issue closed by itself anyway, reopen it and tell the owner in one line.
- The body is one piece of text. Change it only with the steps in `references/gh-commands.md`, "Changing the body": the owner may have edited it in the browser.
- Create nothing but issues and comments without the owner's yes. The labels are asked once at setup. A milestone is made only for a project phase he approved.
- Never delete an issue, a comment, or a label. Close or cancel the issue instead. Remove a sub-issue link only to move an item.

## Hand-offs

| For | Use |
| --- | --- |
| Deciding what happens next: what to save, a State, or an approval | `running-work-item-lifecycle` |
| An original the item received | `filing-project-records`, step "file a source" |
| Moving the items to another tracker | `project-setup` |
| Recording the GitHub repository when the line is empty | `project-setup` |

## Files

| File | Open it when |
| --- | --- |
| [references/gh-commands.md](references/gh-commands.md) | Before your first `gh` call in a session: sign-in, the repository, Codex, and the commands for reading, creating, closing, labels, comments, and sub-issues. Also when a call fails. |
| [references/labels.md](references/labels.md) | Changing a header field, creating the labels, or a label the owner changed by hand. |
| [references/issue-layout.md](references/issue-layout.md) | Creating an issue, writing a section of the body, adding a question or a history row, adding a phase, a task, or a sub-item, saving the design or a note, or an issue made by hand. It starts with a picture of one issue. |
| [references/searching.md](references/searching.md) | Finding items: by state, the board, what waits on the owner, a parent's tree, a search, or changes since a date. |
| [references/project-roadmap-and-tasks.md](references/project-roadmap-and-tasks.md) | Reading or changing the project's phases (milestones), putting a top-level item in a project phase, or reading or changing a project task. |

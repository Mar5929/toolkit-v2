---
name: tracking-work-items
description: 'Saves, finds, and changes work items as GitHub issues, so managing-work-items reads and writes every item the same way. Use when an item must be read, created, saved, or searched, such as "show me #12" or "what is waiting on me". Not for deciding States or approvals; use managing-work-items. Only for projects that track work in GitHub Issues.'
---

# Tracking work items on GitHub

This skill holds the storage: where each part of a work item lives in GitHub Issues, and the `gh` commands that read and change it. It never decides what happens next.

## How an item is stored

- One issue per work item. Its ID is the issue number, written `#12`. Find an item by its number, never by a link or a title.
- The body is the work item template from `## Overview` to the end.
- The header fields are labels: State, type, priority, who it waits on, who builds it, and the approvals. Status has no label.
- Done is closed as completed. Cancelled is closed as not planned.
- A sub-item is a GitHub sub-issue, up to three levels. A phase is a Roadmap row in the body. A task is a checkbox line under its phase.
- The design is one comment whose first line is `## Solution design`. Source files and the agent's notes are comments.
- The repository is the "GitHub repository" line in `PROJECT.md`, under "Toolkit settings". It is `<repo>` in every command.

## After every write

Read the change back and check it says what you wrote. A failed write is "Not saved", as `managing-work-items` says. The write worked but the read-back differs: start the reply with "Saved but not verified" and say what differs.

## Gotchas

- Always pass `-R <repo>`. In a `gh api` path write `repos/<repo>/...`, never `{owner}/{repo}`: that takes the repository from the folder's Git remote, which can be a different repository.
- The sub-issue calls take the issue's numeric id, from `gh api repos/<repo>/issues/<number> --jq .id`. Not the issue number, and not the `id` that `gh issue view --json id` prints.
- Never write `close`, `closes`, `closed`, `fix`, `fixes`, `fixed`, `resolve`, `resolves`, or `resolved` directly before `#12` in a pull request title or body, or in a commit message. GitHub closes the issue when it merges, which marks the item Done without the owner's yes. Write "Part of #12". Never link a pull request in the issue's "Development" panel: that closes the issue on merge too. When an issue closed by itself anyway, reopen it and tell the owner in one line.
- The body is one piece of text. Change it only with the steps in `references/gh-commands.md`, "Changing the body": the owner may have edited it in the browser.
- Create nothing but issues and comments without the owner's yes. The labels are the one exception, asked once at setup.
- Never delete an issue, a comment, or a label. Close or cancel the issue instead. Remove a sub-issue link only to move an item.

## Hand-offs

| For | Use |
| --- | --- |
| Deciding what happens next: what to save, a State, or an approval | `managing-work-items` |
| Moving the items to another tracker | `project-setup` |
| Recording the GitHub repository when the line is empty | `project-setup` |

## Files

| File | Open it when |
| --- | --- |
| [references/gh-commands.md](references/gh-commands.md) | Before your first `gh` call in a session: sign-in, the repository, Codex, and the commands for reading, creating, closing, labels, comments, and sub-issues. Also when a call fails. |
| [references/labels.md](references/labels.md) | Changing a header field, creating the labels, or a label the owner changed by hand. |
| [references/issue-layout.md](references/issue-layout.md) | Creating an issue, writing a section of the body, adding a question or a history row, adding a phase, a task, or a sub-item, saving the design, a source file, or a note, or an issue made by hand. It starts with a picture of one issue. |
| [references/searching.md](references/searching.md) | Finding items: by state, the board, what waits on the owner, a parent's tree, a search, or changes since a date. |

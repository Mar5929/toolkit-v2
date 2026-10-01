---
name: github-work-track
description: 'Finds, creates, and changes work items in GitHub Issues: lookups, labels, phases, tasks, questions, sub-issues, and the design, so each read and write matches the issues. Use when finding or changing an item, such as "show me #12" or "add a task to phase 2". Not for closing or cancelling; use work-finish. Only for projects that track work in GitHub.'
---

# GitHub work tracking: find, create, and change

This project tracks its work in GitHub Issues. Every lookup, create, or
change of a work item goes through the steps here. The work skills
decide what to change; this skill says how it is stored and found.

## How a work item is stored on GitHub

- **One issue per work item.** Its ID is the issue number, written `#12`.
  Find an item by its number, never by a link or a title.
- **The body** is the work item text from `## Overview` to the end, in the
  template's order: Overview, Roadmap, Tasks, Recent History,
  Requirements, Questions and Answers, Notes.
- **Labels** hold the header fields: `stage:`, `type:`, `priority:`,
  `waiting-on:`, `delivery:`, and the approval labels. Status is not
  stored: it follows the stage label while the issue is open.
- **Closed as completed** is Done; **closed as not planned** is Cancelled.
- **Sub-items** are GitHub sub-issues, at most three levels. A phase is a
  Roadmap row in the body; a task is a checkbox line under its phase.
- **The design** is one comment whose first line is `## Solution design`,
  edited in place.
- **Comments** hold running notes ("Agent: ...") and text source files.
  Answers and decisions go in Questions and Answers; progress in Recent
  History.
- **Approvals stay on the item:** a label, plus the owner's words and the
  date in a Questions and Answers row.
- The repository is "GitHub repository" in `PROJECT.md`, "Toolkit
  settings". It is `<repo>` in every command.

## Steps for any lookup or change

1. Read `<repo>` from `PROJECT.md`. Check `gh auth status`; if no one is
   signed in, the owner runs `gh auth login` (`references/gh-access.md`).
   In Codex, run each `gh` command alone with escalated permissions.
2. Read the issue fresh in this turn: labels, state, and body
   (`references/gh-basics.md`; the lookups are in `references/queries.md`).
   Never answer from an earlier read: the owner edits issues in the
   browser.
3. Make the change with the steps in the matching reference (References
   below).
4. Read the change back. If the write failed, lead with "Not saved", name
   what was not saved, keep the text, and give the fix. If the write worked
   but the read-back differs, lead with "Saved but not verified" and say
   what differs.
5. Rewrite the item's Current state (the five lines under the Overview's
   `### Current state`) in place, in the same body write as the change, so
   every line is true and "Last updated" has today's date; never add to it.
   Add a Recent History row when the comment above its table says to.

## Rules

- Never close an issue as completed on your own: the owner says yes first,
  and his words and the date go in a Questions and Answers row. He may
  close it himself in the browser; that counts.
- The chat that runs the item makes every change. Helper agents report back
  and never edit work items.
- Create labels, repositories, or anything besides issues and comments
  only after the owner's yes.
- Never delete an issue, a comment, or a label: cancel, close, or ask the
  owner instead. Remove a sub-issue link only to move an item when the
  owner asks (`references/items.md`, "Moving an item under another
  parent").
- Moving work items to another tracker: use the project-setup skill.
- The owner's edits in GitHub win. Never undo a change he made by hand.
- No AI credit in issue bodies, comments, or labels.

## Gotchas

- The body is one piece of text: read it fresh, change only your lines, and
  write the whole body back from a file.
- Always pass `-R <repo>`. `{owner}/{repo}` in a `gh api` path takes the
  Git remote, which can be a different repository.
- `gh issue list` returns 30 issues unless `--limit` is given, and `gh api`
  one page unless `--paginate` is given.
- "No parent issue found" means the issue is top level, not an error.
- The sub-issue calls need the issue's number id from
  `gh api repos/<repo>/issues/<number> --jq .id`, not the issue number and
  not the `id` that `gh issue view --json id` prints.
- A label that does not exist makes the whole `gh issue edit` call fail.
- In a table cell, write `|` as `\|` and a line break as `<br>`.
- An issue body or comment holds at most 65,536 characters.
- `gh` cannot attach files: text sources become comments; other files the
  owner drags in himself.

## References

| File | Open it when |
| --- | --- |
| [references/gh-access.md](references/gh-access.md) | Signing in, the repository cannot be found, running in Codex, or any call fails. |
| [references/gh-basics.md](references/gh-basics.md) | Before your first call in a session: reading an issue, changing the body, labels, comments, sub-issues. |
| [references/queries.md](references/queries.md) | Finding or reading items: the board, open questions, a parent's tree, a search, changes since a date, issues without the layout. |
| [references/items.md](references/items.md) | Creating or changing a work item, its text, its approvals, closing it, or its design comment. |
| [references/planning.md](references/planning.md) | Phases, sub-items, tasks, and changing the plan. |
| [references/labels.md](references/labels.md) | Which label holds which field, the full label list, or a label the owner changed. |
| [references/notes-files-links.md](references/notes-files-links.md) | Comments, source files, pull requests and commits. |
| [references/setup.md](references/setup.md) | Onboarding a project, or bringing one up to the current labels. |
| [assets/WORK-ITEM.md](assets/WORK-ITEM.md) | Making a new issue body (from `## Overview` to the end), or checking a section. |

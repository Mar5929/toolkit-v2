# Work items kept as GitHub issues

Use this reference to read, create, save, and find work items in a project that keeps its work items as GitHub issues. The goal is to read and write each work item consistently with the lifecycle rules.

This reference only gives the steps for reading and saving. The lifecycle rules decide what happens next: what to save or when, a work item's State, and each approval. A work item's State is the step the work is in, and its Status is the short summary of the State.

This reference says where each part of a work item is kept in GitHub Issues, and it gives the `gh` commands that read and change each part. `gh` is GitHub's command-line tool.

## Where the work items are kept

- Each work item is one issue. The work item's ID is the issue number, written `#12`.
  - Find a work item by its number, never by a link or a title.
  - In a file name or a folder name, write the number without `#`, for example `12-test-plan.md`.
- The body of the issue is the work item template, from the line `## Overview` to the end.
- The header fields of the work item template are labels on the issue: State, type, priority, who the work item waits on, who builds it, and the approvals. Status has no label.
- A work item that is Done is an issue closed as completed. A work item that is Cancelled is an issue closed as not planned.
- Work items can be nested, up to three levels. A top-level item is a work item with no parent, at level 1. A sub-item is a work item inside another work item, at level 2 or level 3. A sub-item is a GitHub sub-issue. `references/lifecycle-rules.md`, section "Levels", says what each level holds.
- A top-level item has phases of its own, which group its tasks and its level-2 sub-items. Each phase is a row of the Roadmap table in the body, and each task is a checkbox line under its phase. A sub-item has no Roadmap: its tasks are one plain checkbox list.
- The project has phases of its own too, called project phases, which group the top-level items. It also has project tasks, which are tasks that belong to no work item.
  - The project's phases are milestones, one milestone for each project phase. Each top-level issue is in the milestone of its project phase.
  - The project's tasks are checkboxes in one pinned issue, titled "Project tasks".
  - `references/work-tracker-project-roadmap-and-tasks.md` says how to read and change both.
- A work item's design is one comment whose first line is `## Solution design`. The agent's notes are comments too.
- The repository is named on the "GitHub repository" line in `PROJECT.md`, under "Toolkit settings". Every command in this skill writes the repository as `<repo>`.

## After every write

Read the change back, and check that it says what you wrote. When a write failed, or reads back differently, report it as `references/lifecycle-rules.md`, section "Rules that apply in every State", says. That section gives the words your reply must start with.

## Mistakes to avoid

- Always pass `-R <repo>`. In a `gh api` path, write `repos/<repo>/...`, never `{owner}/{repo}`. `gh` fills `{owner}/{repo}` from the Git remote of the folder, which can be a different repository.
- The sub-issue calls take the issue's numeric id, which `gh api repos/<repo>/issues/<number> --jq .id` prints. Do not pass the issue number, and do not pass the `id` that `gh issue view --json id` prints.
- Never write `close`, `closes`, `closed`, `fix`, `fixes`, `fixed`, `resolve`, `resolves`, or `resolved` directly before `#12` in a pull request title, in a pull request body, or in a commit message. When the pull request or the commit is merged, GitHub closes the issue, which marks the work item Done without the owner's yes.
  - Write "Part of #12" in place of such a word.
  - Never link a pull request in the issue's "Development" panel. That link closes the issue on merge too.
  - When an issue closed by itself anyway, reopen the issue, and tell the owner in one line.
- The body is one piece of text. Change the body only with the steps in `references/work-tracker-gh-commands.md`, section "Changing the body", because the owner may have edited the body in the browser.
- Create nothing but issues and comments without the owner's yes.
  - Ask the owner about the labels once, at setup.
  - Make a milestone only for a project phase that the owner approved.
- Never delete an issue, a comment, or a label. Close or cancel the issue instead.
- Remove a sub-issue link only to move a work item.
- GitHub Issues has no archive. A closed issue is already left out of the lists of open issues. When the owner asks to archive an open work item, tell the owner that GitHub Issues has no archive and that a closed issue is already left out of the lists of open issues, and ask whether to cancel the work item.

## Related work

| For | Use |
| --- | --- |
| Deciding what happens next: what to save and when, a State, or an approval | Follow `references/lifecycle-rules.md` in this skill. |
| A source that the work item was given. A source is anything the project was given by someone else, such as a transcript or a client document. | `filing-project-records`, step "file a source" |
| Moving the work items to another place where work items can be kept, such as local files or Notion | `project-setup` |
| Recording the GitHub repository when the "GitHub repository" line is empty | `project-setup` |

## References

| File | Open it when |
| --- | --- |
| [references/work-tracker-gh-commands.md](work-tracker-gh-commands.md) | Before your first `gh` call in a session. It covers the sign-in, the repository, Codex, and the commands for reading, creating, and closing an issue, and for labels, comments, and sub-issues. Open it also when a call fails. |
| [references/work-tracker-labels.md](work-tracker-labels.md) | You change a header field, you create the labels, or the owner changed a label by hand. |
| [references/work-tracker-issue-layout.md](work-tracker-issue-layout.md) | You create an issue; you write a section of the body; you add a question or a Recent History row; you add a top-level item's phase, a task, or a sub-item; you save the design or a note; or the owner made an issue by hand. The file starts with a picture of one issue. |
| [references/work-tracker-searching.md](work-tracker-searching.md) | You find work items by state, read the board (the list of the open work items), find what waits on the owner, read a parent's full tree, search, or list the changes since a date. |
| [references/work-tracker-project-roadmap-and-tasks.md](work-tracker-project-roadmap-and-tasks.md) | You read or change the project's phases, which are milestones; you put a top-level item in a project phase; or you read or change a project task. |

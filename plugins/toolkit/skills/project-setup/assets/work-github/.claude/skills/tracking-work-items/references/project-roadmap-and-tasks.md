# The project's roadmap and project tasks on GitHub

Where the project's own phases and its project tasks are saved on GitHub, and the `gh` commands that read and change them. `managing-work-items`, "Levels", says what they are. Run each command on its own; in Codex, with escalated permissions (`gh-commands.md`, "In Codex").

## Contents

- The project's phases: milestones
- Putting an item in a project phase
- Project tasks: the "Project tasks" issue

## The project's phases: milestones

- Each project phase is one milestone of the repository, titled `P01 — <name>`: `P` and two digits, then the name. The title order is the plan order. A phase ID is never reused.
- Its description holds three lines: `Status: <Not Started | In Progress | Done | Cancelled>`, `Outcome: <what it establishes>`, and `Exit result: <the evidence that it is complete>`.
- A Done or Cancelled phase is a closed milestone. Never delete a milestone.
- Make a milestone only for a project phase the owner approved. Never set a due date.

List every project phase, with how many of its items are open and closed:

```text
gh api --paginate 'repos/<repo>/milestones?state=all' --jq '.[] | select(.title | test("^P[0-9]{2} ")) | [.number, .title, .state, .open_issues, .closed_issues] | @tsv'
```

GitHub returns them in its own order, not the plan order: read the lines in title order, `P01` first.

Make one. Write the description in a file in `<dir>` first:

```text
gh api repos/<repo>/milestones -X POST -f title='P01 — Discovery' -F description=@<dir>/milestone.md
```

Change its description, or close it when the phase is Done or Cancelled (`<milestone-number>` is the first column of the list):

```text
gh api repos/<repo>/milestones/<milestone-number> -X PATCH -F description=@<dir>/milestone.md
gh api repos/<repo>/milestones/<milestone-number> -X PATCH -f state=closed
```

- **Merge or drop a phase:** move its items to another milestone first, then set its Status line to Cancelled with the reason ("Merged into P01." or "Dropped: <reason>.") and close it.

## Putting an item in a project phase

A top-level issue sits in exactly one project phase: its milestone. A sub-issue has no milestone. Its Related items line names the phase too: "Project phase P01."

```text
gh issue edit <number> -R <repo> --milestone 'P01 — Discovery'
gh issue edit <number> -R <repo> --remove-milestone
gh issue list -R <repo> --state all --limit 200 --milestone 'P01 — Discovery' --json number,title,state
```

Moving it to another phase is the same `--milestone` call with the other title. Add a Recent History row on the item.

## Project tasks: the "Project tasks" issue

The project's tasks are checkboxes in one issue, titled "Project tasks" and pinned to the repository. Its body starts with the line `## Project tasks`; that line, not the title, marks it. It has no labels and is never a work item.

Find it:

```text
gh issue list -R <repo> --state open --limit 200 --json number,body --jq '.[] | select((.body // "") | startswith("## Project tasks")) | .number'
```

None: make it the first time a project task is saved. The body, written in `<dir>/body.md`, with that task in place of the example:

```markdown
## Project tasks

The project's administrative tasks that belong to no work item, in one plain list.

- [ ] **PT-01 — <task name>** · Not Started  
  **Work:** <The action to take.>  
  **Deliverable:** <The file, decision, or other result.>  
  **Done when:** <The observable completion check.>  
  **Who does it:** <agent | owner>  
  **Depends on:** <Task ID or “None.”>
```

```text
gh issue create -R <repo> --title 'Project tasks' --body-file <dir>/body.md
gh issue pin <number> -R <repo>
```

A repository pins at most three issues. When the pin fails for that reason, tell the owner; the issue still works unpinned.

- Each task is a checkbox block in the work item template's task form, with ID `PT-` and two digits: `PT-01`, then the next unused number. A new task goes at the end.
- Change the body, start a task, and tick a task as for a work item (`gh-commands.md`, "Changing the body"; `issue-layout.md`, "Phases, tasks, and sub-items").
- Two issues with the marker line: tell the owner and ask which one to keep using.

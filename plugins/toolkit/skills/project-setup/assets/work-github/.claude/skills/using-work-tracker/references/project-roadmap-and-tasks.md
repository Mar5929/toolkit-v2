# The project's roadmap and project tasks on GitHub

This file says where the project's own phases and its project tasks are saved on GitHub, and it gives the `gh` commands that read and change them. `running-work-item-lifecycle`, section "Levels", says what a project phase and a project task are.

Run each command on its own. In Codex, run each command with escalated permissions, as `gh-commands.md`, section "In Codex", says.

## Contents

- The project's phases: milestones
- Putting a work item in a project phase
- Project tasks: the "Project tasks" issue

## The project's phases: milestones

- Each project phase is one milestone of the repository. The milestone's title is `P01 — <name>`: `P` and two digits, then the name. The order of the titles is the plan order.
- The milestone's description holds three lines: `Status: <Not Started | In Progress | Done | Cancelled>`, `Outcome: <what it establishes>`, and `Exit result: <the evidence that it is complete>`.
- A project phase that is Done or Cancelled is a closed milestone. Never delete a milestone.
- Make a milestone only for a project phase that the owner approved.
- Never set a due date on a milestone.

This command lists every project phase, with how many of its work items are open and how many are closed:

```text
gh api --paginate 'repos/<repo>/milestones?state=all' --jq '.[] | select(.title | test("^P[0-9]{2} ")) | [.number, .title, .state, .open_issues, .closed_issues] | @tsv'
```

GitHub returns the milestones in its own order, not in plan order. Read the lines in the order of their titles, `P01` first.

This command makes a milestone. First write the description in a file in `<dir>`:

```text
gh api repos/<repo>/milestones -X POST -f title='P01 — Discovery' -F description=@<dir>/milestone.md
```

The first command below changes a milestone's description. The second closes the milestone, for a project phase that is Done or Cancelled. `<milestone-number>` is the first column of the list:

```text
gh api repos/<repo>/milestones/<milestone-number> -X PATCH -F description=@<dir>/milestone.md
gh api repos/<repo>/milestones/<milestone-number> -X PATCH -f state=closed
```

**Merge or drop a project phase.** First move its work items to another milestone. Then set its Status line to Cancelled with the reason, which is "Merged into P01." or "Dropped: <reason>.", and close the milestone.

## Putting a work item in a project phase

The project phase of a top-level issue is its milestone. A sub-issue has no milestone. The Related items line of a top-level issue names the project phase too: "Project phase P01."

```text
gh issue edit <number> -R <repo> --milestone 'P01 — Discovery'
gh issue edit <number> -R <repo> --remove-milestone
gh issue list -R <repo> --state all --limit 200 --milestone 'P01 — Discovery' --json number,title,state
```

To move a work item to another project phase, use the same `--milestone` call with the other title. Add a Recent History row on the work item.

## Project tasks: the "Project tasks" issue

The project's tasks are checkboxes in one issue, which is titled "Project tasks" and pinned to the repository. Its body starts with the line `## Project tasks`. That line marks the issue, and the title does not. The issue has no labels, and it is never a work item.

This command finds the issue:

```text
gh issue list -R <repo> --state open --limit 200 --json number,body --jq '.[] | select((.body // "") | startswith("## Project tasks")) | .number'
```

When the command finds no issue, make the issue the first time a project task is saved. Write this body in `<dir>/body.md`, with that project task in place of the example:

```markdown
## Project tasks

The project's administrative tasks that belong to no work item, in one plain list.

- [ ] **PT-01 — <task name>** · Not Started  
  **Work:** <The action to take.>  
  **Deliverable:** <The file, decision, or other result.>  
  **Done when:** <The observable completion check.>  
  **Who does it:** <agent | owner | the name of another person who owes it, with the party, such as “Sarah Chen (client)”>  
  **Depends on:** <Task ID or “None.”>
```

```text
gh issue create -R <repo> --title 'Project tasks' --body-file <dir>/body.md
gh issue pin <number> -R <repo>
```

A repository pins at most three issues. When the pin fails for that reason, tell the owner. The issue still works when it is not pinned.

- Each project task is a checkbox block in the task form of the work item template. Its ID is `PT-` and two digits: `PT-01`, then the next unused number. A new project task goes at the end.
- Change the body, start a project task, and tick a project task as for a work item. `gh-commands.md`, section "Changing the body", gives the steps for the body. `issue-layout.md`, section "Phases, tasks, and sub-items", says how to start and tick a task.
- When two issues have the marker line `## Project tasks`, tell the owner, and ask which one to keep using.

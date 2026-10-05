# Labels: where the header fields go on GitHub

The header fields of a work item are labels, plus whether the issue is open or closed. This file says which is which, lists the labels a project needs, and says how to create them.

## Contents

- Which field is which label
- The full list
- Creating the labels
- A label the owner changed by hand

## Which field is which label

| Field | On the issue |
| --- | --- |
| `id` | The issue number, written `#12`. |
| `title` | The issue title. |
| `state` | Exactly one `state:<state>` label: the State's name in lower case with hyphens, for example `state:refining-requirements`. A closed issue's State is Done or Cancelled (see `status`). Its state label stays as it was and is ignored. |
| `status` | Has no label. While the issue is open, it follows from the state label, as `running-work-item-lifecycle` says. Closed as completed is Done. Closed as not planned, or as a duplicate, is Cancelled. |
| `type` | Exactly one `type:<type>` label. |
| `priority` | Exactly one `priority:<priority>` label. |
| `waiting_on` | At most one: `waiting-on:owner`, `waiting-on:agent`, or `waiting-on:external` (the Current state "Waiting on" line says who and what). No label means `none`. |
| `delivery` | `delivery:agent-led` or `delivery:owner-led`. No label means `not-offered`. |
| `requirements_approved` | The `requirements-approved` label. The date, the name, and his words are in the Questions and Answers row. |
| `design` | `design-proposed` or `design-approved`, never both. No label means `none` when the issue has no design comment, and `superseded` when it has one. |
| `result_approved` | The `result-approved` label, with his words in the Questions and Answers row. |
| `parent` | GitHub's sub-issues: the item is a sub-issue of its parent. |
| `updated` | GitHub keeps it (`updatedAt`). Nothing to set. |

The owner may close an issue himself in the browser. That counts as his word.

## The full list

30 labels. Colors are six-digit hex codes without `#`.

| Label | Color | Description |
| --- | --- | --- |
| `state:backlog` | `C5DEF5` | State: an idea waiting to be started |
| `state:refining-requirements` | `C5DEF5` | State: working out the requirements with the owner |
| `state:designing` | `C5DEF5` | State: choosing how it gets built |
| `state:building` | `C5DEF5` | State: building the change |
| `state:testing-loop` | `C5DEF5` | State: a separate checker tests it against the requirements |
| `state:reflecting` | `C5DEF5` | State: checking what else needs updating |
| `state:deploying` | `C5DEF5` | State: merging and deploying |
| `state:blocked` | `C5DEF5` | State: stuck on something outside the work |
| `type:discovery` | `D4C5F9` | Work item type: discovery |
| `type:solution-design` | `D4C5F9` | Work item type: solution design |
| `type:build` | `D4C5F9` | Work item type: build |
| `type:data-load` | `D4C5F9` | Work item type: data load |
| `type:repository-maintenance` | `D4C5F9` | Work item type: repository maintenance |
| `type:research` | `D4C5F9` | Work item type: research |
| `type:task` | `D4C5F9` | Work item type: task |
| `type:bug` | `D4C5F9` | Work item type: bug |
| `type:enhancement` | `D4C5F9` | Work item type: enhancement |
| `priority:urgent` | `B60205` | Priority: urgent |
| `priority:high` | `D93F0B` | Priority: high |
| `priority:medium` | `FBCA04` | Priority: medium |
| `priority:low` | `C2E0C6` | Priority: low |
| `waiting-on:owner` | `E99695` | Waits for the owner: see the first open question |
| `waiting-on:agent` | `BFDADC` | The agent continues |
| `waiting-on:external` | `F9D0C4` | Waits for someone else: see the Current state Waiting on line |
| `delivery:agent-led` | `EDEDED` | The agent leads the build |
| `delivery:owner-led` | `EDEDED` | The owner leads the build |
| `requirements-approved` | `0E8A16` | The owner approved the requirements |
| `design-proposed` | `FEF2C0` | A design waits for the owner's choice |
| `design-approved` | `0E8A16` | The owner approved the design |
| `result-approved` | `0E8A16` | The owner approved the result |

## Creating the labels

At setup, and when a project set up earlier lacks a label.

1. List the labels the repository has:

   ```text
   gh label list -R <repo> --limit 200 --json name --jq '.[].name'
   ```

2. Compare with the full list. Names match without regard to capital letters.
3. Tell the owner how many are missing, by group, and ask once: "Create these 30 labels in <repo>? Each work item uses them to show its State, type, priority, who it waits on, who builds it, and your approvals." Name only the missing ones when some exist already.
4. On his yes, create each missing label, one command each:

   ```text
   gh label create 'state:backlog' -R <repo> --color C5DEF5 --description 'State: an idea waiting to be started'
   ```

5. List them again and check that every label in the full list exists.

- Never use `--force`: it overwrites a label the owner already has.
- A label that exists with another color or description stays as it is.
- Never delete or rename a label.

## A label the owner changed by hand

The owner may add or remove a label in the browser. His change wins. Continue from what the labels say now.

- Two labels of one group (two states, two priorities): ask him which one is right, then remove the other.
- A state label removed from an open item: take the last State its Recent History names, and ask him whether it still holds before you add it.
- A missing priority label: add `priority:medium` and say so in one line. A missing type label: ask him the type.
- An issue he made by hand, with no labels: `issue-layout.md`, "An issue made by hand".

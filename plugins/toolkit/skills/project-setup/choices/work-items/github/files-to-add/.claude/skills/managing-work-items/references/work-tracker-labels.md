# Labels: where the header fields go on GitHub

On GitHub, the header fields of a work item are labels on its issue, together with whether the issue is open or closed. This file says which field is which label, lists the labels that a project needs, and says how to create them. Open it when you change a header field, when you create the labels, or when the owner changed a label by hand.

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
| `state` | Exactly one `state:<state>` label. The label is the State's name in lower case with hyphens, for example `state:refining-requirements`. The State of a closed issue is Done or Cancelled, as the `status` row says. The state label of a closed issue stays as it was, and it is ignored. |
| `status` | Status has no label. While the issue is open, the Status follows from the state label, as `managing-work-items` says. An issue closed as completed is Done. An issue closed as not planned, or as a duplicate, is Cancelled. |
| `type` | Exactly one `type:<type>` label. |
| `priority` | Exactly one `priority:<priority>` label. |
| `waiting_on` | At most one of `waiting-on:owner`, `waiting-on:agent`, or `waiting-on:external`. The "Waiting on" line of the work item's Current state says who and what. No label means `none`. |
| `delivery` | `delivery:agent-led` or `delivery:owner-led`. No label means `not-offered`. |
| `requirements_approved` | The `requirements-approved` label. The date, the name, and the owner's words are in the Questions and Answers row. |
| `design` | `design-proposed` or `design-approved`, never both. No label means `none` when the issue has no design comment, and `superseded` when it has one. |
| `result_approved` | The `result-approved` label. The owner's words are in the Questions and Answers row. |
| `parent` | GitHub's sub-issues: the work item is a sub-issue of its parent. |
| `updated` | GitHub keeps it, as `updatedAt`. There is nothing to set. |

The owner may close an issue in the browser. That counts as the owner's word.

## The full list

A project needs 30 labels. Colors are six-digit hex codes without `#`.

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

Create the labels at setup, and when a project that was set up earlier lacks a label.

1. List the labels that the repository has:

   ```text
   gh label list -R <repo> --limit 200 --json name --jq '.[].name'
   ```

2. Compare that list with the full list. Names match without regard to capital letters.
3. Tell the owner how many labels are missing, by group, and ask once: "Create these 30 labels in <repo>? Each work item uses them to show its State, type, priority, who it waits on, who builds it, and your approvals." When some labels exist already, name only the missing ones.
4. After the owner's yes, create each missing label, with one command for each label:

   ```text
   gh label create 'state:backlog' -R <repo> --color C5DEF5 --description 'State: an idea waiting to be started'
   ```

5. List the labels again, and check that every label in the full list exists.

Three more rules about labels:

- Never use `--force`, because it overwrites a label that the owner already has.
- A label that exists with another color or description stays as it is.
- Never delete or rename a label.

## A label the owner changed by hand

The owner may add or remove a label in the browser. The owner's change is the one to keep. Continue from what the labels say now.

- **Two labels of one group**, for example two states or two priorities. Ask the owner which one is right, and then remove the other.
- **A state label was removed from an open work item.** Take the last State that the work item's Recent History names. Ask the owner whether that State still holds before you add its label.
- **A priority label is missing.** Add `priority:medium`, and say so in one line.
- **A type label is missing.** Ask the owner the type.
- **An issue that the owner made by hand has no labels.** Follow `work-tracker-issue-layout.md`, section "An issue made by hand".

# Labels: the work item fields on GitHub

Purpose: which label holds which header field, the full list of labels a
project needs, and how to create them.

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
| `stage` | Exactly one `stage:<stage>` label, for example `stage:08-build`. |
| `status` | Follows the stage label while the issue is open: stages 01 and 02 are Backlog, 03 is Ready, 04 to 11 are In Progress, 12 to 14 are In Review. Closed with `stateReason` `COMPLETED` is Done; `NOT_PLANNED` or `DUPLICATE` is Cancelled. |
| `type` | Exactly one `type:<type>` label. |
| `priority` | Exactly one `priority:<priority>` label. |
| `waiting_on` | At most one: `waiting-on:owner`, `waiting-on:agent`, or `waiting-on:external` (the Current state "Waiting on" line says who and what). No label means `none`. |
| `delivery` | `delivery:agent-led` or `delivery:owner-led`. No label means `not-offered`. |
| `requirements_approved` | The `requirements-approved` label. The date, the name, and his words are in the Questions and Answers row. |
| `design` | `design-proposed` or `design-approved`, never both. No label means `none`, or `superseded` when the design comment's "Design status" line says Superseded. |
| `result_approved` | The `result-approved` label, with his words in the Questions and Answers row. |
| `parent` | GitHub's sub-issues: the item is a sub-issue of its parent. |
| `updated` | GitHub keeps it (`updatedAt`). Nothing to set. |

Someone else's comment never counts as the owner's answer or approval.

## The full list

36 labels. Colors are six-digit hex codes without `#`.

| Label | Color | Description |
| --- | --- | --- |
| `stage:01-discovery` | `C5DEF5` | Stage 01: working out what the owner wants |
| `stage:02-refinement` | `C5DEF5` | Stage 02: requirements and roadmap being written |
| `stage:03-requirements-approved` | `C5DEF5` | Stage 03: the owner approved the requirements |
| `stage:04-solution-design` | `C5DEF5` | Stage 04: deciding how it gets built |
| `stage:05-breakdown` | `C5DEF5` | Stage 05: splitting into sub-items and phases |
| `stage:06-implementation-plan` | `C5DEF5` | Stage 06: ordering the build steps |
| `stage:07-tracking-setup` | `C5DEF5` | Stage 07: sub-items, branches, and worktrees made |
| `stage:08-build` | `C5DEF5` | Stage 08: building the change |
| `stage:09-testing` | `C5DEF5` | Stage 09: checking it against the requirements |
| `stage:10-bug-fixing` | `C5DEF5` | Stage 10: fixing what testing found |
| `stage:11-user-approval` | `C5DEF5` | Stage 11: the owner reviews the result |
| `stage:12-pr-and-push` | `C5DEF5` | Stage 12: in a pushed pull request |
| `stage:13-deployment` | `C5DEF5` | Stage 13: being deployed |
| `stage:14-spec-update` | `C5DEF5` | Stage 14: requirements and system guide updated to match the result |
| `type:discovery` | `D4C5F9` | Work item type: discovery |
| `type:solution-design` | `D4C5F9` | Work item type: solution design |
| `type:build` | `D4C5F9` | Work item type: build (needs requirements approval) |
| `type:data-load` | `D4C5F9` | Work item type: data load (needs requirements approval) |
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

2. Compare with the full list. Names match without regard to capital
   letters.
3. Tell the owner how many are missing, by group, and ask once:
   "Create these 36 labels in <repo>? Each work item uses them to show its
   stage, type, priority, who it waits on, who builds it, and your
   approvals." Name only the
   missing ones when some exist already.
4. On his yes, create each missing label, one command each:

   ```text
   gh label create 'stage:01-discovery' -R <repo> --color C5DEF5 --description 'Stage 01: working out what the owner wants'
   ```

5. List them again and check that every label in the full list exists.

- Never use `--force`: it overwrites a label the owner already has.
- A label that exists with another color or description stays as it is.
- Never delete or rename a label.

## A label the owner changed by hand

The owner may add or remove a label in the browser. His change wins.

- Carry on from what the labels say now. Add a Recent History row: "Changed
  by hand: `stage:08-build` to `stage:09-testing`."
- Two labels of one group (two stages, two priorities): ask him which one
  is right, then remove the other.
- A stage label removed from an item: take the last stage its Recent
  History names, and ask him whether it still holds before you add it.
- A missing priority label: add `priority:medium` and say so in one line.
  A missing type label: ask him the type.
- An issue he made by hand, with no labels: `items.md`, "An issue made by
  hand".
- A hand change that skips an approval (a `type:build` issue at stage 03 or
  later without `requirements-approved`): keep it, and ask him about it as
  a question.

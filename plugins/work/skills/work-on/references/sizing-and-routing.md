# Sizing a request and routing an item

How `work-on` decides between a quick edit, a logged item, and a worked item,
which type to give it, and which skill continues it.

## Contents

1. Three sizes of request
2. Owner messages and the right action
3. Choosing the type
4. Routing by where the item stands
5. Several items at once
6. Project roadmap units

## 1. Three sizes of request

- **Quick edit, no item.** One sitting, no choice for the owner, no change to
  behavior recorded in `requirements/`, nothing bound for production. Do it
  and report it in one line.
- **Log only.** The owner says "later", "backlog", "park that", "not now", or
  "log a bug". Check the list for a duplicate, create the item at
  `01-discovery` with his exact words as the Starting request, reply
  "Logged as WI-014 (bug, backlog). Not started." and stop.
- **Work item.** Everything else. "New work", "track", "work item", or "done
  properly" always makes an item. A request that grows past a quick edit
  while you work becomes an item then, with his words as the Starting
  request.

Never make a work item for project setup. Setup steps the owner must do go in
the reply. Only a step `toolkit doctor` checks (trusting the hooks in Codex
`/hooks`, `ntn login`) also goes in the current focus under "Waiting on the
owner", marked as a setup step, and leaves it once doctor stops reporting it.
"Start a new session" goes in the reply only.

A deliverable the owner named without saying what it should say or do ("write
a short project brief"): create the item, add the content question as `Q-01`
with the item waiting on him, and ask it in the reply before building.
Never invent the content.

## 2. Owner messages and the right action

| The owner says | Right action |
| --- | --- |
| "Fix the typo in the README heading." | Quick edit. Fix it, say what changed in one line. No item. |
| "What does the export function do?" | Answer the question. No item. |
| "Log a bug: the export drops the last row. Not now." | Log only: check for a duplicate, create a `bug` item at `01-discovery` with his words, reply "Logged as WI-014 (bug, backlog). Not started." |
| "Add a CSV export to the monthly report." | Work item, type `build`. Create it, then route: requirements are not approved, so open `work-requirements`. |
| "Write a short project brief." | Work item, type `task`. Add `Q-01` "What should the brief cover?", set it waiting on the owner, ask the question. |
| "Keep going." (no item named) | Continue this worktree's item, or the item the current focus says the next session starts with, or the one `toolkit work next` recommends. Say which in one line. |
| "ok" (and this chat asked him nothing) | Not "keep going". Start no work; ask what he wants. |
| "Ask me questions first, then build it." | Create the item and open `work-requirements` for the interview. Never batch questions here. |
| "Put it in the backlog and I'll tell you when." | Log only. |
| "WI-007" or "resume WI-007" | Read WI-007 and route it by where it stands (section 4). |

## 3. Choosing the type

- Pick the closest type from `toolkit work lifecycle`.
- A change to what the product does, to Salesforce metadata (`force-app/`),
  or to anything bound for production is `build`, never `task`, even when it
  looks small. A change to data is `data-load`.
- `build` and `data-load` need the owner's requirements approval before stage
  03. The CLI refuses a later stage without it.
- A `task` with no open choices may skip the requirements approval and go
  straight to planning. Put the reason in a history note.

## 4. Routing by where the item stands

The "Continue with" line of `toolkit work show <id>` is the default. The
item's real state decides. Go down the table in order and take the first row
that matches: the owner's waiting decisions come first, then the delivery
offer, then the stage. Say the route in one line.

| Where the item stands | Open | One-line announcement |
| --- | --- | --- |
| `waiting_on: owner` | `work-decide` (ask that one question first; keep working on anything it does not block) | "WI-012 is waiting for your OK on the requirements." |
| The agent to-do "Make the agent-led delivery offer" for this item (the briefing and `toolkit work decisions` list it for a big top-level item at stages 03 to 07 that still has `delivery: not-offered`), or the owner hands the goal over ("you drive") | `work-delegate`, and build nothing until he answers | "WI-012 needs your delivery choice; opening work-delegate." |
| Requirements not approved and type `build` or `data-load` | `work-requirements` | "WI-012 needs requirements first; opening work-requirements." |
| The owner asks to change, add, or drop a requirement, at any stage | `work-requirements` | "That changes R-02; opening work-requirements." |
| Requirements approved, more than one reasonable way to build, no approved design | `solution-design` | "WI-012 needs a design; opening solution-design." |
| Requirements approved, one clear way to build, no design | Stay here: say the approach in the final reply ("One way to build this: <approach>. I'll build it that way; say 'design first' to stop me.") and put the reason in a history note | |
| Too big for one build | `work-organize` (split, stage 05) | "WI-012 is too big for one build; opening work-organize." |
| Design approved, or a sub-item that inherits the parent's approved design | Stay here: plan (stage 06) | |
| Stages 09 to 11 | `work-check` | "WI-012 is in testing; opening work-check." |
| Stages 12 to 14, or result approved | `work-finish` | "WI-012 is approved; opening work-finish." |
| Done or Cancelled | Nothing. Reopen only when the owner asks: `toolkit work set <id> --stage <s> --reopen` | |

- Stages may be skipped, repeated, or revisited. Record a one-line reason
  when a move is not obvious.
- An item that changes committed files always goes through stage 07 (its own
  worktree). Never build on the default branch.
- A worktree whose branch names an item (`claude/wi-007-csv-export`) belongs
  to that item. The briefing says so. Work on that item there.
- Never ask the owner which stage an item is in.

## 5. Several items at once

- Read each item's record before recommending an order. Say what can go
  ahead on its own, what depends on another outcome, and which one decision
  would unblock the most work.
- Each item has one main session that changes it. Other sessions return
  findings to it instead of editing the same record.
- Worktrees keep code apart; they do not keep shared environments apart.
  Check shared orgs, databases, and releases before two items change the same
  one.

## 6. Project roadmap units

`PROJECT-ROADMAP.md` holds the project's phases (`P01`) and deliverable-sized
work units, each naming its work item id. Item detail stays in the tracker.

- When a new item is one of those units, write its id into the unit and save
  the file with `publish-docs`.
- An item's own phases (`P1`) are a different thing. They live in the item's
  Roadmap section.

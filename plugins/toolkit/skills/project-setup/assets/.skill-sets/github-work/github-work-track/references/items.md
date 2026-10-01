# Work items as GitHub issues: create, change, approve, close

Purpose: every change to one work item, as exact `gh` steps, and the rules
each change keeps. Commands: `gh-basics.md`. Labels: `labels.md`.

## Contents

- A new work item
- Stage and status
- Type, priority, delivery, and title
- Waiting on and blockers
- Writing a section of the body
- Recent History rows
- Questions and Answers
- Approvals
- Marking Done, cancelling, reopening
- The design comment
- Moving an item under another parent
- An issue made by hand
- Checking an issue
- A body near the size limit

## A new work item

1. **Level check** (a sub-item only). An item has at most three levels.
   Read the parent's parent, and that one's parent
   (`gh api repos/<repo>/issues/<number>/parent --jq .number`). When the
   parent has a parent and a grandparent, the parent is at level 3 and the
   new item would be at level 4: do not create it. Tell the owner, and
   offer to add a task to the parent instead.
2. **Make the body** in a temporary folder (`gh-basics.md`): copy
   `assets/WORK-ITEM.md` from the line `## Overview` to the end. Leave out
   the front matter, the `# WI-001: ...` title line, and the fill-in guide
   above `## Overview`. Then fill:
   - Overview: Goal; the Current state lines (Where it stands "Created on
     YYYY-MM-DD; not started.", Next action "Agent: ask the first
     requirements question, with work-refine.", Waiting on "Nothing.",
     Blockers "None.", Last updated today); and Related items (for a
     sub-item: "Parent #12, phase P2.").
   - Requirements, Starting request: the owner's words.
   - Recent History: replace the example row with the first real row
     ("Created from the owner's request.").
   - Replace each angle-bracket prompt you have a value for. Leave the
     others for the work-refine skill.
3. **Create the issue** with its first labels. The title is the owner's
   words, in single quotes (write a single quote inside it as `'\''`):

   ```text
   gh issue create -R <repo> --title '<title>' --body-file <dir>/body.md --label 'stage:01-discovery' --label 'type:<type>' --label 'priority:medium'
   ```

   The output is the issue's address; its last part is the number. The
   item's ID is `#<number>`.
4. **A sub-item:** make it a sub-issue of the parent (`gh-basics.md`,
   "Sub-issues"). On the parent's body: put `#<number>` in the Sub-items
   cell of its phase's Roadmap row, and add a Recent History row
   ("Sub-item #14 created: <title>.").
5. **Read back** the labels, the Overview, and (for a sub-item) the parent.
   Say the new ID and title to the owner in one line.

A new item starts at stage 01, no waiting-on label, `priority:medium`, no
delivery label, and no approval or design label.

## Stage and status

Status follows the stage label while the issue is open (`labels.md`).
Change the stage with a swap, and rewrite the item's Current state in the
same step:

```text
gh issue edit <number> -R <repo> --remove-label 'stage:08-build' --add-label 'stage:09-testing'
```

- A stage move never marks Done or Cancelled. Only closing does
  ("Marking Done, cancelling, reopening").
- A `type:build` or `type:data-load` item moves to stage 03 or later only
  with the `requirements-approved` label.

## Type, priority, delivery, and title

- Type or priority: swap the label in one call, for example
  `--remove-label 'priority:medium' --add-label 'priority:high'`.
- Delivery: only the work-delegate skill offers it. On the owner's answer,
  add `delivery:agent-led` or `delivery:owner-led` (removing the other),
  and fill that offer's Questions and Answers row.
- Title: `gh issue edit <number> -R <repo> --title '<title>'`, only after
  saying the new title to the owner in one line.

## Waiting on and blockers

| The item waits for | Label | Current state lines |
| --- | --- | --- |
| The owner | `waiting-on:owner` | Waiting on "Mike: Q-07."; Next action in the waiting form, naming the first open Q-ID; Blockers "None." when he only has to answer, or the thing only he can give, for example test keys |
| The agent, who continues | `waiting-on:agent` | Waiting on "Nothing."; Blockers "None." |
| Someone else | `waiting-on:external` | Waiting on: who, and what is missing |
| Nothing | No waiting-on label | Waiting on "Nothing."; Blockers "None." |
| Another item | `waiting-on:agent` when the agent is working on #14; no waiting-on label when nobody is | Blockers "Waits for #14: <what it needs from it>."; Related items names #14 |

- Swap the old waiting-on label for the new one in one call. An issue has
  at most one. There is no Blocked label.
- After the owner answers his last open question on the item, swap
  `waiting-on:owner` for `waiting-on:agent` when you continue the work;
  otherwise remove it. Keep it while another of his questions is open.

## Writing a section of the body

Use "Changing the body" in `gh-basics.md`: read fresh, change only the
lines that need it, write the whole body back, read the section back. Keep
every heading and label as the template has them, including the dash in
`P1 — <name>` and `R-01 — <name>`. One write may carry several changes, for
example an answer, the requirement it changes, and the Recent History row.

## Recent History rows

Newest first. Insert the row right below the table's `|---|---|---|` line,
and replace the template's example row with the first real row. For a
decision, name its Q-ID instead of repeating it. The comment above the
table says when a row goes in.

```markdown
| 2026-09-30 | Q-02 answered: Face ID only. | R-03 updated; next action is Q-03. |
```

## Questions and Answers

The table sits in the body under `## Questions and Answers`.

- **A new question:** add its row when you ask it, before the reply ends.
  Next Q-ID: the highest Q-ID in this item plus one. Open rows come first,
  oldest on top, so the new row goes below the last open row. The first
  real row replaces the template's two example rows. Status "Open",
  "Decision needed from" `owner`, or another person or role. When it needs
  the owner, add `waiting-on:owner`; when it needs someone else, use
  `waiting-on:external` ("Waiting on and blockers" above).
- **His answer, the moment he gives it:** fill Answer (his exact words, in
  quotes), Date answered, Decision? (`yes` when it decides something), and
  Status "Answered". Move the row below the open rows: answered rows are
  newest first. In the same body write, update what it affects and name the
  Q-ID in Recent History. Then swap or remove `waiting-on:owner`.
- **He changes an earlier answer:** never rewrite the old row. Add a new
  row ("Change to Q-03: ..."), set the old row's Status to "Superseded by
  Q-09", and update what it affects.

## Approvals

The Questions and Answers row with his words comes first, then the label
and the body changes. `<name>` is the owner's name as `PROJECT.md` gives it.

| Approval | Label | Body |
| --- | --- | --- |
| Requirements | Add `requirements-approved`. An item before stage 03 swaps its stage label for `stage:03-requirements-approved`. | "Overall status" Finalized; each approved `R-xx` Status Finalized, with "Approved YYYY-MM-DD by <name> (Q-xx)" in its Decision record |
| Design | Swap `design-proposed` for `design-approved` | The design comment's "Design status" Approved and "Design approval" `YYYY-MM-DD by <name>` ("The design comment" below) |
| Result | Add `result-approved` | None beyond the row |

A sub-item covered by its parent's approved requirements: write "Covers
#12 R-02 and R-03, approved there." under its Active requirements, add
`requirements-approved`, and add a Recent History row naming the parent's
approval.

## Marking Done, cancelling, reopening

- **Done** is closing as completed, only after the owner's yes (the
  work-finish skill asks). After his yes: the row with his words; the
  Current state's Where it stands "Done on YYYY-MM-DD: <evidence>.", Next
  action "None. Finished.", Waiting on "Nothing.", Blockers "None.", Last
  updated today; a Recent History row naming the Q-ID; any waiting-on
  label removed. Then:

  ```text
  gh issue close <number> -R <repo> --reason completed
  ```

  The stage label stays. Read back `state` and `stateReason`.
- **The owner closed it himself** in the browser: that counts. Never
  reopen it. Closed as completed is Done; as not planned is Cancelled; as
  a duplicate is Cancelled (ask which issue it duplicates, when the issue
  does not say). At your next change, add a Recent History row "Closed by
  the owner by hand on YYYY-MM-DD" (the date from `closedAt`).
- **Cancel**, only on his word: a row with his reason in his words; for
  each open sub-issue, ask him: cancel it, move it to the top level, or
  move it under another item; the Current state lines as for Done (Where
  it stands "Cancelled on YYYY-MM-DD: <his reason>.", Next action "None.
  Cancelled."); a Recent History row naming the Q-ID; any waiting-on label
  removed. Then:

  ```text
  gh issue close <number> -R <repo> --reason 'not planned'
  ```

- **Reopen:** `gh issue reopen <number> -R <repo>`, swap in the stage it
  returns to, and add a Recent History row saying why.

## The design comment

One comment per item holds the design. Its first line is exactly
`## Solution design`. The solution-design skill writes the design; this
skill stores it.

- **Make it:** post the design with `gh issue comment` (`gh-basics.md`,
  "Comments"), with its first line `## Solution design` and
  `**Requirements:** #12`. Then add `design-proposed`.
- **Find it:**

  ```text
  gh api --paginate repos/<repo>/issues/<number>/comments --jq '.[] | select(.body | startswith("## Solution design")) | [.id, .html_url] | @tsv'
  ```

- **Change it:** read it into a file, edit the file, and send it back with
  `-X PATCH` (`gh-basics.md`, "Comments"). Never post a second design
  comment. GitHub keeps every earlier version under the comment's
  "edited" menu.
- **Design status and the labels say the same thing:** Draft or In review
  is `design-proposed`; Approved is `design-approved`; Superseded is no
  design label.
- **A new design replaces the approved one:** write it into the same
  comment, note the change under the design's "Design changes during the
  interview", swap `design-approved` for `design-proposed`, and add a
  Recent History row.
- **Longer than 60,000 characters:** put the rest in a second comment whose
  first line is `## Solution design (part 2)`, kept up to date the same
  way. The first comment's last line says "Continued in part 2."
- Two design comments that are not parts: tell the owner and ask which one
  is current. Never delete either.

## Moving an item under another parent

Only when the owner asks, or to follow a move he made by hand.

1. Level check for the item and every level under it: the result must stay
   within three levels.
2. Move it (`gh-basics.md`, "Sub-issues"): add it to the new parent with
   `replace_parent=true`; to the top level, remove it from its parent.
3. On the old parent, remove `#<number>` from its Roadmap's Sub-items
   cell. On the new parent, put it in the Sub-items cell of the phase it
   belongs to. On the item, update Related items.
4. Recent History rows on the item, the old parent, and the new parent.

The owner may change the parent in the browser. His change wins: at your
next change, add the same Roadmap and Recent History updates.

## An issue made by hand

An issue the owner opened in the browser has his text and no layout: no
`## Overview` in the body, or no stage label.

1. Ask him in one line: "#15 was made by hand in GitHub, so it does not
   have the usual work item sections and labels. Should I add them?"
2. On his yes, make a new body from the template ("A new work item", step
   2), with his text word for word as the Starting request. Write it with
   `gh issue edit`.
3. Add `stage:01-discovery` and `priority:medium`. Ask him the type unless
   his text makes it plain (a report of something broken is `type:bug`).
4. Add a Recent History row: "Made by hand in GitHub; the work item layout
   was added."

## Checking an issue

Read the issue and its comments, then check:

- exactly one `stage:`, one `type:`, and one `priority:` label; at most one
  `waiting-on:` and one `delivery:` label; never `design-proposed` and
  `design-approved` together;
- the body's `##` headings, in order: Overview, Roadmap, Tasks, Recent
  History, Requirements, Questions and Answers, Notes:

  ```text
  gh issue view <number> -R <repo> --json body --jq '[.body | split("\n")[] | select(startswith("## "))]'
  ```

- the Questions and Answers and Recent History tables have their header
  rows;
- the Overview's `### Current state` heading with its five lines, filled
  in;
- `waiting-on:owner` only while a row still needs the owner, and the
  Current state's Next action names the first open one;
- at most one design comment (not counting its parts);
- its tree, counting its parents and its sub-items, is at most three levels
  deep.

Fix what you can with the steps above, and tell the owner in one line what
you fixed. A problem that needs his choice becomes a question.

## A body near the size limit

An issue body holds at most 65,536 characters. After each body write, read
its length:

```text
gh issue view <number> -R <repo> --json body --jq '.body | length'
```

Over 60,000: tell the owner, and propose splitting the work into sub-items,
each with its own body. Never drop or shorten his words, answers, or
history to make room.

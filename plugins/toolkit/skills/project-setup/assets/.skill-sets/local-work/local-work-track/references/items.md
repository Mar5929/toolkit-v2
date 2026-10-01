# Work items in local files: create, change, approve, close

Purpose: every change to one local work item, as exact file steps. The
finished item looks like the template, `work-items/work-item-template/`.

## Contents

- A new work item
- Header fields
- Stage and status
- Recent History rows
- Questions and Answers
- Approvals
- Marking Done, cancelling, reopening
- The design file
- Source files and the Sources list
- Retitling an item

## A new work item

1. **Level check** (a sub-item only). Read the parent's `parent:`, then the
   `parent:` of the item it names (the grandparent). When the grandparent
   has a parent, the parent is at level 3: make no sub-item, and offer a
   task on the parent instead.
2. **The prefix.** Read it from `PROJECT.md`:

   ```bash
   sed -nE 's/^- Work item ID prefix: `([^`]*)`.*/\1/p' "$MAIN/PROJECT.md"
   ```

   Empty or still `<WI>`: stop and tell the owner the setup is incomplete.
3. **The next ID** is the highest number anywhere under `work-items/`,
   `archive/` included, plus one. Replace `WI` with the prefix:

   ```bash
   grep -rhE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude=DESIGN.md '^id: *"?WI-[0-9]+"? *$' "$MAIN/work-items" | sed -E 's/.*-([0-9]+)"? *$/\1/' | sort -n | tail -1
   ```

   It prints `031`: the new ID is `WI-032` (`printf '%s-%03d\n' WI 32`).
   It prints nothing: the first ID is `WI-001`. IDs are never reused.
4. **Make the folder first**, with a plain `mkdir` (never `-p`), so it
   fails when the folder already exists. The slug is two to four lowercase
   words from the title, joined by hyphens. A top-level item goes in
   `"$MAIN/work-items/WI-032-transaction-entry"`, an item in a group the
   owner named in `"$MAIN/work-items/<group>/WI-032-transaction-entry"`,
   and a sub-item inside the parent's folder.
5. **Check for a duplicate** right after:

   ```bash
   find "$MAIN/work-items" -type d -name 'WI-032-*' -not -path '*/work-item-template/*'
   grep -rlE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude=DESIGN.md '^id: *"?WI-032"? *$' "$MAIN/work-items"
   ```

   The first must print only your folder, and the second nothing. Anything
   else: another session took the number, so your item is the later one.
   Take the next free number, rename your still-empty folder with `mv`, and
   check again. Never renumber another session's item.
6. **Copy the template** into the folder, and make `references/`:

   ```bash
   mkdir "<item folder>/references"
   cp "$MAIN/work-items/work-item-template/WORK-ITEM.md" "<item folder>/WI-032.md"
   ```

   The project's template is missing: stop and tell the owner (the
   project-setup skill restores it).
7. **Fill the front matter** ("Header fields"): the ID, the title in the
   owner's words, a `type` from the template's list, `stage: 01-discovery`,
   `status: Backlog`, `parent:` the parent's ID or `none`,
   `waiting_on: "none"`, `priority: medium`, `delivery: not-offered`, every
   approval `no`, `design: none`, and `updated:` today.
8. **Fill what you know.** The heading `# WI-032: <title>`. In the
   Overview: Goal; the Current state lines (Where it stands "Created on
   `YYYY-MM-DD`; not started.", Next action "Agent: ask the first
   requirements question, with work-refine.", Waiting on "Nothing.",
   Blockers "None.", Last updated today); and Related items (the parent as
   `[[WI-012]]`, or "None."). Under Requirements, the Starting request in
   the owner's words. In Recent History, replace the placeholder row with
   the first real row: "Created from the owner's request." Leave the other
   prompts for work-refine. Delete the comment that starts "Fill-in guide
   for a new work item" once no angle-bracket prompt is left in the item.
9. **A sub-item's parent:** add `[[WI-032]]` to the Sub-items cell of the
   parent's Roadmap row for the phase it delivers (replace "None."), add a
   Recent History row on the parent ("Sub-item [[WI-032]] created:
   <title>."), and set the parent's `updated:`.
10. **Read it back:** the `grep` in step 5 now prints exactly one file, your
    `WI-032.md`.

## Header fields

The front matter holds one line per field, in the template's order, with
the values the template lists.

- `title:` in double quotes when it holds a colon or a `#`, or starts with a
  quote or a bracket: `title: "Login: single sign-on"`.
- `waiting_on:` always in double quotes: `"owner"`, `"agent"`,
  `"external: bank API team"`, `"none"`.
- An approval is `YYYY-MM-DD by <name>`, with the owner's name as
  `PROJECT.md` gives it: `requirements_approved: 2026-09-30 by Mike Rihm`.
- `parent:` is a plain ID, never a link, so the lookups can read it.
- Keep every field, and any extra field the owner or Obsidian added. Add
  no new field.

## Stage and status

Set `stage`, `status`, and `updated:` in one edit. Status follows stage:

| Stage | Status | Usual skill |
| --- | --- | --- |
| `01-discovery`, `02-refinement` | Backlog | `work-refine` |
| `03-requirements-approved` | Ready | `solution-design`, or the build (no skill) |
| `04-solution-design` | In Progress | `solution-design` |
| `05-breakdown`, `06-implementation-plan`, `07-tracking-setup` | In Progress | The build (no skill) |
| `08-build` | In Progress | The build (no skill), or `work-delegate` |
| `09-testing`, `11-user-approval` | In Progress | `work-check` |
| `10-bug-fixing` | In Progress | The build (no skill), then `work-check` |
| `12-pr-and-push`, `13-deployment`, `14-spec-update` | In Review | `work-finish` |

- Done and Cancelled are never set by a stage move ("Marking Done,
  cancelling, reopening").
- A `build` or `data-load` item cannot move to `03` or later until
  `requirements_approved` holds an approval.
- The owner may change `stage` or `status` himself, for example in
  Obsidian's Properties panel. His value wins: never change it back, and
  add a Recent History row "Changed by hand: <field> <old> to <new>" at
  your next change.

## Recent History rows

Newest first, naming the Q-ID instead of repeating a decision. Insert the
row right after the separator line, and replace the template's placeholder
row (`| <YYYY-MM-DD> | ...`) with the first real row:

```markdown
| 2026-09-30 | Q-02 answered: Face ID only. | R-03 updated; next action is Q-03. |
```

## Questions and Answers

- **A new question.** The next Q-ID is the highest in this item plus one.
  Insert the row after the last open row (right after the separator line
  when none is open), so open rows stay on top, oldest first. When it
  needs the owner, set `waiting_on: "owner"` and name the Q-ID in the
  Current state's Next action and Waiting on lines. Save it before the
  reply ends.
- **An answer.** Make all of these changes before you ask the next
  question: his words in quotes under Answer, the date, Decision? `yes` or
  `no`, Status `Answered`; move the row to just below the last open row
  (answered rows are newest first); update the goal, requirement, task, or
  phase it affects; name the Q-ID in Recent History; rewrite the Current
  state, and change `waiting_on` when no question of his is left open.
- **A changed answer.** Never rewrite the old row. Add a new row ("Change
  to Q-03: ..."), set the old row's Status to `Superseded by Q-09`, and
  update what it affects. A requirement it changes goes back to Refining.

Answering Q-04, old text:

```markdown
| Q-04 | Which fields must every transaction have? Recommended: amount, date, category, because reports group by all three. |  |  |  | R-01 | Open | owner |
```

New text:

```markdown
| Q-04 | Which fields must every transaction have? Recommended: amount, date, category, because reports group by all three. | "Amount, date, category. Notes are optional." | 2026-09-30 | yes | R-01 | Answered | owner |
```

## Approvals

The owner's words and the date go in a Questions and Answers row first,
then the field.

| Approval | What to write |
| --- | --- |
| Requirements | `requirements_approved: 2026-09-30 by Mike Rihm`; each approved `R-xx` Status `Finalized`; "Overall status" `Finalized` |
| Design | `design: approved` in `<ID>.md`; in `DESIGN.md`, `status: approved`, `approved: "2026-09-30 by Mike Rihm"`, and its "Design status" and "Design approval" lines |
| Result | `result_approved: 2026-09-30 by Mike Rihm` |

A sub-item covered by its parent's approval writes
`2026-09-30 by Mike Rihm (from WI-012)`.

## Marking Done, cancelling, reopening

- **Done.** Never on your own. Ask "Mark WI-032 Done?" with the evidence in
  one line. On his yes: the row with his words, `status: Done` and
  `waiting_on: "none"` (the stage stays), the Current state lines (Where it
  stands "Done on `YYYY-MM-DD`: <evidence>.", Next action "None.
  Finished.", Waiting on "Nothing.", Blockers "None.", Last updated
  today), and a Recent History row naming the Q-ID.
- **Cancel.** Only on the owner's word: a row with his reason, `status:
  Cancelled`, `waiting_on: "none"`, the Current state lines as for Done
  (Where it stands "Cancelled on `YYYY-MM-DD`: <his reason>.", Next action
  "None. Cancelled."), and a Recent History row. Ask about each open
  sub-item, one at a time.
- **Reopen.** Set the stage where the remaining work starts and the status
  that stage gives, and add a Recent History row saying why.

## The design file

- One design per item: `DESIGN.md` beside `<ID>.md`. Make it only when
  none exists.

  ```bash
  cp "$MAIN/work-items/work-item-template/DESIGN.md" "<item folder>/DESIGN.md"
  ```

  The project's template is missing: stop and tell the owner.
- In the new `DESIGN.md`: `work_item: WI-032`, `status: proposed`,
  `approved: "no"`; replace `WI-001` in the heading with the ID; set the
  `**Requirements:**` line to `[[WI-032]]`. Then set `design: proposed` in
  `<ID>.md`. solution-design writes the rest of the design.
- The design's "Design status" line and the item's `design` field say the
  same thing: Draft or In review is `proposed`, Approved is `approved`,
  Superseded is `superseded`.
- A sub-item built from its parent's approved design gets no `DESIGN.md`.
  Its Related items line says "Built from the design of [[WI-012]]."
- Never link to a design as `[[DESIGN]]`: every item's design has that
  name. Name it "the design of WI-032".

## Source files and the Sources list

- Copy each source file into the item's `references/` folder and keep its
  name. Text the owner pasted: save it as `YYYY-MM-DD-<short-name>.md`,
  exactly as pasted. Never edit a source after saving it.
- In a Salesforce project a client file stays in `delivery/`; the Sources
  line names its `delivery/` path.
- Add one line under Notes, "Sources" (replace the template's example line
  the first time):
  `` - `references/2026-09-30-kickoff-transcript.md`: kickoff meeting transcript, 2026-09-30. Taken from it: R-01, Q-02. ``

## Retitling an item

Change the title only on the owner's word. Change `title:`, the
`# WI-032: <title>` heading, and the heading of `DESIGN.md` when there is
one. The file name stays `<ID>.md`. Rename the folder only when the owner
asks (`folders.md`).

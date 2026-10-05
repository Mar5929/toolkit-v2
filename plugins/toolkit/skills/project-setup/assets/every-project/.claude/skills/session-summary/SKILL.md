---
name: session-summary
description: 'Recaps this chat as a table of the owner''s requests, the result of each one, and which still need him, so he sees what is done and what is open. Use when he asks what happened in this chat, for example "recap this chat", "what did I ask for", "what did we do today", or "summarize this session". Not for a handoff; use handoff.'
---

# Session summary

Answer exactly two questions: what did I ask for in this chat and where does
each one stand, and what still needs me.

1. **Read this conversation only.** When the owner names a transcript, log,
   or exported chat, read that instead. List his real requests, not the steps
   taken to do them (see "One row per request").
2. **Write the table.** Columns `#`, `What you asked`, `Status`, `Result`.
   One row per request, in the order asked. Use only the eight statuses
   below. Write `What you asked` in the owner's own words, cut down to the
   part that says what he asked; the outcome goes in `Result`, where you name
   the place that holds the work: a work item id (`WI-014`), a pull request
   number, a file path, or "saved to memory". Apart from the status words,
   bold only the one phrase the owner most needs to see.
3. **Then the open block.** A horizontal rule (`---`), then the heading
   `### 🔴 Still open, and it needs you`. When nothing needs the owner, keep
   the heading and write "Nothing needed from you."
4. **Name another skill only in this case.** When a request is still open and nothing in
   this conversation shows it saved as a work item or a project task, end
   the open block with one offer that covers every such request: turn each
   into a work item or a project task, with the skill named in Hand-offs,
   below. Make the offer once.
5. **Change nothing.** If the owner says yes to the offer, make each change
   he chose with that skill.

## Gotchas

- No title above the table, no story of the work, no wrap-up, no third part.
  If something went wrong or surprised you, it goes in the `Result` cell of
  the request it came from.
- If part of the session is no longer visible to you, add a final row: its
  `What you asked` cell reads "Earlier requests I can no longer see", and its
  `Status` and `Result` cells stay empty. Never invent a request.

## One row per request

A row is a request, not a step; a long session usually holds one to three.
The owner choosing from options you offered, answering your question, or
adjusting work under way, parts of one job, and work you suggested and then
did all belong to the request that prompted them. If a cell turns into a list
of pieces of work, replace it with one short statement of the result.

Example: the owner says "update the toolkit", then picks four of the six gaps
you found, then answers a question about one of them. That is one row: "Update
the toolkit in this project."

## Status words

Write each with its symbol in front and the word in bold.

- ✅ **Done**: finished, and you checked it.
- ⚠️ **Done, unverified**: finished, but not tested or confirmed; say what was not checked.
- ⏳ **Partly done**: say what is left.
- 🔴 **Blocked**: say what is blocking it.
- 🔴 **Waiting on you**: needs the owner's own action; say the action.
- ⚪ **Not started**: agreed but not begun.
- ⛔ **Dropped**: the owner changed direction or withdrew it.
- 💬 **Answered**: it was a question, not a build.

## Example

````markdown
| # | What you asked | Status | Result |
| --- | --- | --- | --- |
| 1 | Check the rules against the toolkit | ✅ **Done** | The toolkit had already made every one of these merges. This project was behind on all of them. |
| 2 | Consolidate the two rules folders | ✅ **Done** | 34 rule files down to 27, merged into main. One rule was nearly lost in the deletion and had to be put back in its own file. |
| 3 | Port `small-deployable-changes.md` to the toolkit | ⛔ **Dropped** | You said no. |
| 4 | Fix the broken link in the decision document | ✅ **Done** | Fixed twice. The first fix pointed at the wrong file and the check caught it. |
| 5 | Why run the checker before proposing? | 💬 **Answered** | So you never get asked to approve a claim nobody checked. |
| 6 | Merge it | ✅ **Done** | Pull request 29 is in main. Two other pull requests were merged first, so the branch had to be updated with main. |

---

### 🔴 Still open, and it needs you

**Another session has a half-finished merge in the main project folder.**
Two work item files there have conflicting changes. I did not touch it.

1. The main project folder will not show these rule changes until that
   session finishes its merge and gets the latest changes.
2. My worktree (a separate project copy) at
   `.claude/worktrees/rule-consolidation` and its branch are still there.
   Tell me once that merge is done, and I will remove both.
````

## Hand-offs

| For | Use |
| --- | --- |
| Turning an open request into a work item or a project task | `running-work-item-lifecycle` |
| A recap asked for together with a handoff: it shows this table first, then the handoff | `handoff` |

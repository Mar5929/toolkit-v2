---
name: session-summary
description: 'Puts the owner''s requests, each result, and what still needs the owner in a table. Use when the owner asks to recap or summarize this session. For a prompt that lets a new session continue the work, use handoff.'
---

# Session summary

Answer the questions for the owner: what the owner asked for in this
session and where each request stands, and what still needs the owner.

1. **Read this session only.** When the owner names a transcript, a log, or
   an exported copy of a session, read that instead. List the owner's real requests, not
   the steps taken to do them (see "One row per request").
2. **Write the table.** Columns `#`, `What you asked`, `Status`, `Result`.
   One row per request, in the order asked. Use only the statuses
   below. Write `What you asked` in the owner's own words, cut down to the
   part that says what the owner asked; the outcome goes in `Result`, where you name
   the place that holds the work by its name: a work item's name, a
   source's subject, a decision's title, a pull request with its link, or a
   file path.
   Apart from the status words, bold only the one phrase the owner most
   needs to see.
3. **Then the open block.** A horizontal rule (`---`), then the heading
   `### 🔴 Still open, and it needs you`. When nothing needs the owner, keep
   the heading and write "Nothing needed from you."
4. **Name another skill only in this case.** When a request is still open and nothing in
   this session shows it saved as a work item or a project task, end
   the open block with one offer that covers every such request: turn each
   into a work item or a project task, with the skill named in "Work that another
   skill does", below. Make the offer once.
5. **Save nothing while writing the recap.** If the owner says yes to the offer, make each change
   the owner chose with that skill.

## Mistakes to avoid

- No title above the table, no story of the work, no wrap-up, no third part.
  If something went wrong or surprised you, it goes in the `Result` cell of
  the request it came from.
- If part of the session is no longer visible to you, add a final row: its
  `What you asked` cell reads "Earlier requests I can no longer see", and its
  `Status` and `Result` cells stay empty. Never invent a request.

## One row per request

A row is an owner request, not a step taken to carry it out.
The owner choosing from options you offered, answering your question, or
adjusting work under way, parts of one job, and work you suggested and then
did all belong to the request that prompted them. If a cell turns into a list
of pieces of work, replace it with one short statement of the result.

For example, the owner asks to fix an export, chooses the fields to include, and answers a question about the date format. That is one row: "Fix the export."

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

For a finished example, open [examples/session-summary-example.md](examples/session-summary-example.md).

## Work that another skill does

| For | Use |
| --- | --- |
| Turning an open request into a work item or a project task | `managing-work-items` |
| A recap asked for together with a handoff: it shows this table first, then the handoff | `handoff` |

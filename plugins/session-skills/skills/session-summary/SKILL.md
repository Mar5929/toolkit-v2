---
name: session-summary
description: 'Recaps this chat as a table of the owner''s requests, where each landed, and what still needs him. Use when he asks what happened in this chat, for example "recap this chat", "what did I ask for", or "what did we do today". Not with a handoff (handoff includes it) or for project status (work-status).'
---

# Session summary

Answer exactly two questions: what did I ask for in this chat and where does
each one stand, and what still needs me.

1. **Read this conversation only.** List the owner's real requests, not the
   steps taken to do them (see "Count the asks, not the steps").
2. **Write the table.** Columns `#`, `What you asked`, `Status`,
   `Where it landed`. One row per request, in the order asked. Use only the
   eight statuses below.
3. **Then the open block.** A horizontal rule (`---`), then the heading
   `### 🔴 Still open, and it needs you`. When nothing needs the owner, keep
   the heading and write "Nothing needed from you."
4. **Point elsewhere only when it fits.** If the owner asked about the whole
   project, say in one line that `work-status` answers that. When a request is
   still open and is recorded nowhere, end the open block with one offer: turn
   it into a work item (`work-on`) or a current-focus to-do (`memory-save`).
   Offer once.
5. **Change nothing.** No files, work items, or memory are written.

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.

No title above the table. No story of the work, no wrap-up, no third part. If
something went wrong or surprised you, it goes in the `Where it landed` cell of
the request it came from.

## Why this shape

People ask for this when they have lost the thread, or when they are about to
close the session and want to know what is still open. Both want their own asks
back, in their own words, each with an honest status, and then the one thing
that needs them. A story of what you did answers neither question. A flat list
of sentences fails too: every line looks the same, so the reader has to read all
of it to find the one item that needs them.

## Count the asks, not the steps

A row is a request, not a step. A long session usually holds one to three real
requests. Everything else is work those requests caused.

Before writing a row, ask: would this have come up at all if the earlier
request had not been made? If it exists only because you were carrying out an
earlier request, it belongs to that request and gets no row.

These are not separate requests:

- The owner choosing from options you offered, or approving something you
  proposed. That is a decision inside the request that prompted it.
- The owner answering a question you asked.
- The owner confirming, correcting, or nudging work already under way.
- Parts, steps, or phases of one job.
- Work you suggested and then did. That was yours, not the owner's.

If a cell starts turning into its own list, you have gone a level too deep.
Collapse it.

Example: the owner says "sync this project with my toolkit", then picks four of
the six gaps you found, then answers a question about one of them. That is one
row: "Sync this project against the toolkit." The four gaps are what the sync
did; the answer was a decision inside it.

## Status words and their symbols

Use these, and only these. Each is written with its symbol in front and the
word in bold.

| Status | Written as | Means |
| --- | --- | --- |
| Done | ✅ **Done** | Finished, and you checked it |
| Done, unverified | ⚠️ **Done, unverified** | Finished, but not tested or confirmed. Say what was not checked |
| Partly done | ⏳ **Partly done** | Some landed. Say what is left |
| Blocked | 🔴 **Blocked** | Cannot proceed. Say what is blocking it |
| Waiting on you | 🔴 **Waiting on you** | Needs the owner's own action. Say the action |
| Not started | ⚪ **Not started** | Agreed but not begun |
| Dropped | ⛔ **Dropped** | The owner changed direction or withdrew it |
| Answered | 💬 **Answered** | It was a question, not a build |

The eight words do not change, and no ninth one gets invented.

## Keep the owner's words

Write the `What you asked` cell the way the owner would describe it, not the way
the work turned out. "Make the other agents aware of the vault" is the cell.
"Created a reference document and updated two instruction files" is the outcome
and belongs in `Where it landed`. Short, not reworded.

Bold one phrase where it carries the point. Bold everywhere is bold nowhere.

## Be honest about status

The status says what actually happened, not what was attempted or intended. If
something failed, was skipped, was only partly checked, or was never run, the
row says so. A request recorded as done when it was only attempted turns into a
wrong assumption weeks later.

Where work landed, name it the way the project names it: the work item id (for
example `WI-014`), the pull request number, the file path, or "saved to memory".

If part of the session is no longer visible to you (context was trimmed or
summarized), say that as a final row instead of guessing. An invented request
ruins the whole table.

## Example

````markdown
| # | What you asked | Status | Where it landed |
| --- | --- | --- | --- |
| 1 | Check the rules against the toolkit | ✅ **Done** | The toolkit had already made every one of these merges. This project was behind on all of them. |
| 2 | Consolidate the two rules folders | ✅ **Done** | 34 rule files down to 27, merged into main. One rule was nearly lost in the deletion and had to be put back in its own file. |
| 3 | Port `small-deployable-changes.md` to the toolkit | ⛔ **Dropped** | You said no. |
| 4 | Fix the broken link in the decision document | ✅ **Done** | Fixed twice. The first fix pointed at the wrong file and the check caught it. |
| 5 | Why run the checker before proposing? | 💬 **Answered** | So you never get asked to approve a claim nobody checked. |
| 6 | Merge it | ✅ **Done** | Pull request 29 is in main. Two other pull requests landed first, so the branch had to be brought current. |

---

### 🔴 Still open, and it needs you

**Another session has a half-finished merge in the shared checkout.**
Two work-item files are in conflict. I did not touch it.

1. The shared checkout will not show these rule changes until that session
   finishes and pulls.
2. My worktree `.claude/worktrees/rule-consolidation` and its branch are still
   there. Say the word once that merge is done and I will remove both.
````

## Summarizing a session other than this one

Same rules when the owner points at a transcript, a log, or an exported chat:
the owner's turns define the rows, the owner's words shape each `What you asked`
cell, and anything the record does not settle is said, not guessed.

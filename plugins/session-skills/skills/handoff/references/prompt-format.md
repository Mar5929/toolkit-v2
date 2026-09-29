# Step 4: the handoff prompt

Purpose: the parts of a handoff prompt, in order, the source kind each fact
carries, and one complete example. Draft every prompt from
`assets/handoff-prompt-template.md`, which holds the fixed first line and the
headings in this order.

## Contents

- Who the prompt is for
- The first line
- The goal
- The rest of the prompt
- Source kinds
- Wording
- Example prompt

## Who the prompt is for

An agent that knows nothing about this session. Write the prompt as an
instruction to that agent, not as a story of what happened here.

## The first line

Word for word, on its own line:

```text
This handoff prompt is AI-generated and may contain hallucinations, skewed context, etc. Please evaluate accordingly.
```

It is the first line of every prompt this skill produces: a normal handoff, a
"/handoff check" result, a prompt with no check, and a prompt written after
the checker failed. Never reword it, drop it, or move it. The checker does not
score it.

## The goal

What the whole piece of work is trying to achieve, why it matters, and where
that is written down. Not the next step: the thing the next step serves.

- What we are trying to achieve, in one or two plain sentences.
- Why it matters: the problem it solves, or what started it.
- Where it is written down: the work item id (for example `WI-014`), the
  `requirements/` file, the pull request or issue number. Name work items by
  id, not by path. Folders move, and `toolkit work show <id>` finds an item by
  id wherever it is.

"Finish the change to `src/api.ts`" is a task, not a goal. "Cut the time the
export takes so the nightly job stops running past its window" is a goal.
When the goal was only ever said in this conversation, write it anyway and
label it not confirmed against any file.

## The rest of the prompt

In this order:

1. The task: what the new session does next, its scope, and what finished
   looks like.
2. What to read first, in order: the work item, its design, the files being
   changed.
3. Decisions not yet saved, under their own heading. Include what the owner
   declined or cut in step 3, and why where it matters.
4. Open questions and constraints nobody has settled.
5. What to do first: one concrete action.
6. When another session works in the same repository: the worktree and branch
   this session used, so the next one does not assume it owns the checkout.

Say inside the prompt which facts were not saved anywhere.

## Source kinds

Keep a source for every claim while you draft. The checker uses them in
step 5.

| Source kind | Meaning |
| --- | --- |
| file | A path, a line, or what a file or work item says. Checkable |
| repository | A branch, worktree, commit, pull request, issue, or command output from this session. Checkable |
| owner | The owner said it in this conversation. Quote his words when you can |
| worked out | This session concluded it. Nothing recorded it |

## Wording

- Say the literal thing. Do not describe a problem with a figure of speech.
- Label, do not hedge. An unconfirmed fact gets "not confirmed" beside it,
  never "possibly" or "it seems".
- Real names only: the path, the branch, the work item id, the number.
- No line that credits an AI.

## Example prompt

````markdown
This handoff prompt is AI-generated and may contain hallucinations, skewed context, etc. Please evaluate accordingly.

## Goal

Invoices must export to the bank's CSV format, so the owner stops retyping
them into the bank portal each Friday. Written down in WI-007 (Overview, Goal;
Requirements R-01 to R-03).

## Your task

Finish the credit note export (task P1-T03 in WI-007). Finished means a credit
note exports with the same columns as an invoice and the tests in
`tests/export.test.js` pass.

## Read first

1. `toolkit work show WI-007`, especially Notes > Resume here.
2. `toolkit work design WI-007`: Option A is approved.
3. `src/export.js`.

## Decisions not yet saved

- The owner said credit notes show negative amounts, not a separate sign
  column (owner, this session; not confirmed in any file).

## Open questions

- Q-03 in WI-007: which date format the bank import expects. Owner to answer.

## First action

Run `toolkit work show WI-007`, then read `src/export.js` from line 40.

## Repository

Worktree `.claude/worktrees/wi-007-csv-export`, branch
`claude/wi-007-csv-export`. Another session works in the primary checkout.
````

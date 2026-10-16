# Example: one handoff, end to end

A project with its configured work tracker. This session worked on
WI-007 in its own worktree. Another session works in the main checkout.

## The list of inputs given to the verifier (step 6)

After the brief from `references/handoff-verifier.md`, word for word:

```text
Draft prompt: <the whole draft below>
Main checkout: /Users/owner/Projects/acme-billing
Tracker: <the configured tracker and the line in managing-work-items/references/work-tracker.md that starts "A helper opens an item by ID", copied>
Memory and shared records: the places that the root AGENTS.md in the main
  checkout names, in "Project memory" and "Where information goes"
Sources for claims:
- "WI-007 is in the Building State": tracker, WI-007 properties
- "Option A is approved": tracker, WI-007 properties, `design: approved`
- "SRC-014 is filed": file, sources/INDEX.md
- "Q-06 is open": tracker, WI-007 Questions and Answers
- "branch claude/wi-007-csv-export": repository, git worktree list
- "credit notes show negative amounts": owner, the owner's words "just make them negative"
- "the bank rejects files over 5 MB": worked out
Record access and supplied text: <configured record access and freshly read text for any record the verifier cannot open>
```

## What the owner sees (step 7)

```markdown
Not saved: nothing.
Saved: WI-007 Current state and one Recent History row; Q-05
(negative amounts) added to Questions and Answers. Project's current
state: Where we stopped, rewritten.
Filed: SRC-014 (the bank's CSV specification, from the owner's email),
with its ID in WI-007.

Checked the handoff prompt: 1 fixed, 1 not confirmed.

- Fixed: the next task is P1-T03, not P1-T04
- Not confirmed: "the bank rejects files over 5 MB", nothing records it
```

Then the prompt, in one fenced block:

````markdown
This handoff prompt is AI-generated and may contain hallucinations, skewed context, etc. Please evaluate accordingly.

## Goal

Invoices must export to the bank's CSV format, so the owner stops retyping
them into the bank portal each Friday. Written down in WI-007
(Overview, Goal; R-01 to R-03).

## Your task

Finish the credit note export (task P1-T03 in WI-007). Finished means a
credit note exports with the same columns as an invoice and the tests in
`tests/export.test.js` pass.

## Read first

1. WI-007, opened with `managing-work-items`: its Current state, and Q-06.
   Q-06 cites SRC-014, the bank's CSV specification.
2. The design linked from WI-007: Option A is approved.
3. `src/export.js`, from line 40.

## Decisions not yet saved

- None. Q-05 (credit notes show negative amounts) is saved in WI-007.

## Open questions

- Q-06 in WI-007: which date format the export uses, because SRC-014
  allows two. WI-007 waits on it. The owner answers.
- The bank rejects files over 5 MB (worked out, this session; saved
  nowhere; not confirmed). The owner confirms or corrects it.

## First action

Open WI-007 with `managing-work-items`, then read `src/export.js` from line 40.

## Repository

Worktree `.claude/worktrees/wi-007-csv-export`, branch
`claude/wi-007-csv-export`. Another session works in the main checkout.
````

Clear the context, then paste this prompt.

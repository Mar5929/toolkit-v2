---
name: notion-memory-save
description: 'Saves facts, lessons, and project-wide decisions to Notion memory, changes to Current state, and "from now on" instructions to project rules, never settings.json hooks, so later sessions follow them. Use when the owner wants something kept, corrected, or forgotten, such as "remember this", "whenever you ...", or "forget that". Not for a handoff; use handoff. Only for projects with Notion memory.'
---

# Notion memory: save

This project keeps its memory in Notion, in Lore's layout. Every save, correction, instruction, and "forget that" goes through the steps here. When to review memory is the project's memory rule (`.claude/rules/memory-review-and-save.md`).

## Steps

1. **Decide the home** (`references/record-mapping.md`, "One record, one row"). Nothing qualifies: save nothing. A hook reminder is only a hint. Never save secrets, credentials, email addresses, transcripts, raw logs, or work item status. An instruction for how the agent works is a rule, never memory and never a settings hook (`references/saving.md`, "The owner's instructions"). A decision about one work item is its Questions and Answers row (`tracking-work-items`).
2. **Check approval** ("Approval" below). When it says ask, ask in the exact form and wait. Before any `ntn` call, see `references/notion-access.md` (sign-in; in Codex, run each `ntn` call alone, outside the sandbox).
3. Read the ids from `PROJECT.md`, section "Toolkit settings", Notion block.
4. **Find the concept first** (`references/saving.md`, "Before a save"). Add to it, or make a new record, or a decision record.
5. **Fill every column** the record needs (`references/record-mapping.md`).
6. **Read it back.** Not there: say "Not saved", keep the text, and give the fix.
7. **Update Current state** when the save changes it (`references/current-state.md`).
8. **Tell the owner** in one line what was saved, with its link.

## Approval

- The mode is the "Memory approval" line in `PROJECT.md`, "Toolkit settings": `onboarding` or `trusted`. Missing, or still showing its prompt: `onboarding`.
- His own request to keep, change, or forget something, or his yes to your question, is the approval. Save at once.
- `onboarding`: anything you inferred gets one question first: "Save to memory: <one-line summary>?". Save after his yes.
- `trusted`: a fact you inferred and can name a source for is saved without asking, with Authorization "Trusted grant, <date>", and reported in one line, unless it is on the list below. A fact with no source gets the `onboarding` question.
- In both modes, ask first for: an instruction you inferred ("Add to the project rules: <one line>?"); a glossary term you inferred; a project-wide decision ("This looks project-wide. Save it to memory too?"); anything about a named person or personal details he did not ask you to remember; more than five records at once; retiring a record he did not ask to forget; a change to this policy.
- A change to the Current state page alone needs no question. A lesson under "Gotchas and lessons" needs none either: report it in one line.
- Unanswered: `references/saving.md`, "Proposals".
- Only his explicit words change the mode. Then change the "Memory approval" line in `PROJECT.md` with the `project-setup` skill, never in `owner-preferences.md`.

## Rules

- Never rename or remove a Lore database, column, or option; never delete a record (supersede or retire it).

## Gotchas

- End every `ntn api` call with `< /dev/null`, or it can wait on standard input until it times out. If one still hangs, stop only that call; never `pkill` or `killall` (`references/ntn-basics.md`, "One call").
- Record Key is the toolkit's own column; Lore finds nothing by it. Always fill Keywords with the same key too.
- The page body has no `# Title` line: the title is the Title column.
- Sending a relation or Tags value replaces the whole list: read it first.
- Prompts and literal `<` `>` in page text are written `\<` `\>`.
- A 404 means the page is not shared with the "Notion CLI" connection or its id is wrong (`references/notion-access.md`, "When a call fails").

## References

| File | Open it when |
| --- | --- |
| [references/saving.md](references/saving.md) | Every save: adding to a concept, a new record, a decision, a correction, "forget that", proposals, the owner's instructions, links to work items, the glossary. |
| [references/record-mapping.md](references/record-mapping.md) | Which column holds which part of a record; statuses; prefixes. |
| [references/current-state.md](references/current-state.md) | Reading or changing the Current state page. |
| [references/ntn-basics.md](references/ntn-basics.md) | How to write an `ntn api` call, read properties and page text, and edit page text. |
| [references/notion-access.md](references/notion-access.md) | Signing in, a page cannot be found, running in Codex, or any call fails. |
| [examples/save-walkthrough.md](examples/save-walkthrough.md) | Seeing a decision save with real calls. |
| [assets/concept-record.md](assets/concept-record.md) | The body of a new concept record, or a new section. |
| [assets/decision-record.md](assets/decision-record.md) | The body of a new decision record. |
| [assets/current-state.md](assets/current-state.md) | The Current state page's starting text. |
| [assets/terminology-glossary.md](assets/terminology-glossary.md) | The Terminology glossary page's starting text. |

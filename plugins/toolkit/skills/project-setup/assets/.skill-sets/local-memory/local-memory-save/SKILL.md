---
name: local-memory-save
description: 'Saves facts, lessons, and project-wide decisions to local memory, changes to Current State, and "from now on" instructions to project rules, never settings.json hooks, so later sessions follow them. Use when the owner wants something kept, corrected, or forgotten, such as "remember this", "whenever you ...", or "forget that". Not for a handoff; use handoff. Only for projects with local memory.'
---

# Local memory: save

Memory is Markdown files in `memory/` in the main checkout (the first path `git worktree list` prints), opened with the project as an Obsidian vault. A worktree has none: write to the main checkout's, and from Codex ask to run that edit outside the sandbox. What is worth keeping is in `memory/memory-criteria.md`.

## Steps

1. **Decide the home** with `memory/memory-criteria.md`. Nothing qualifies: save nothing. A hook reminder is only a hint. An instruction for how the agent works, or a correction of it, is a rule, never memory and never a settings hook (`references/saving.md`, "The owner's instructions"). A decision about one work item is its Questions and Answers row (`tracking-work-items`).
2. **Find the concept first** (`references/saving.md`). The same fact is already there: save nothing and say where. A section says something different: it is a correction.
3. **Check approval** ("Approval" below). When it says ask, ask in the exact form and wait.
4. **Write the change** (`references/saving.md`). Name its work items in `work_items`.
5. **Read the file back** and check it against `references/record-format.md`. Not in the file: say "Not saved", keep the text, give the fix.
6. **Update Current State** when the save changes it.
7. **Tell the owner** in one line what was saved and where, with the words that undo it (`references/saving.md`, "Reply lines").

## Approval

- The mode is the "Memory approval" line in `PROJECT.md`, "Toolkit settings": `onboarding` or `trusted`. Missing, or still showing its prompt: `onboarding`.
- His own request to keep, change, or forget something, or his yes to your question, is the approval. Save at once.
- `onboarding`: anything you inferred gets one question first: "Save to memory: <one-line summary>?". Save after his yes.
- `trusted`: a fact you inferred and can name a source for is saved without asking, with `authorization: Trusted grant, <date>`, and reported in one line, unless it is on the list below. A fact with no source gets the `onboarding` question.
- In both modes, ask first for: an instruction you inferred ("Add to the project rules: <one line>?"); a glossary term you inferred; a project-wide decision ("This looks project-wide. Save it to memory too?"); anything about a named person or personal details he did not ask you to remember; more than five files at once; a delete, except one his own words asked for or a proposal file he said no to; a change to this policy.
- A lesson under "Gotchas and lessons" needs no question in either mode. Report it in one line.
- Unanswered: `references/saving.md`, "Proposals".
- Only his explicit words change the mode. Then change that line with the `project-setup` skill, never in `owner-preferences.md`.

## Gotchas

- Put each `work_items` entry in double quotes, ID first: `"[[WI-031]]"`. Unquoted, `#12` is a YAML comment and is lost.
- Body labels are bold paragraphs (`**Remember:**`), never `##` headings.
- Skip every file with `status: template`: the seed files.
- Never delete a memory file; retire or supersede it. The only exceptions are in `references/saving.md`, under retiring and deleting.

## References

| File | Open it when |
| --- | --- |
| [references/saving.md](references/saving.md) | Every save: each kind of save, corrections, "forget that", proposals, rules, the glossary, Current State, and the reply lines. |
| [references/record-format.md](references/record-format.md) | Writing or checking a file: names, front matter, status, body labels, lessons, decision records, links, and the checklist. |
| [examples/save-walkthrough.md](examples/save-walkthrough.md) | Seeing a fact and an unanswered proposal saved, with the file edits. |

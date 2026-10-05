---
name: writing-harness-files
description: 'Makes every change to a harness file follow the current official Claude Code and Codex pages. A harness file is a skill, rule, AGENTS.md or CLAUDE.md, hook, settings file, Codex .rules file, output style, plugin manifest or marketplace file, mod, subagent definition, or helper-agent brief. Use before any agent writes or changes one. Not for toolkit setup; use project-setup. Not for a line the owner dictates for owner-preferences.md; use curating-project-memory.'
---

# Writing harness files

A harness file is a file that tells Claude Code or Codex how to behave. It is one of these kinds: a skill, a rule, an `AGENTS.md` or `CLAUDE.md`, a hook, a settings file, a Codex `.rules` file, an output style, a plugin manifest or marketplace file, a mod, a subagent definition, or a helper-agent brief. A hook means the command and its entry in a settings or hooks file.

Never write or change a harness file from memory. Both products change between releases, so read the page first (step 2).

One change is not for this skill: a line the owner dictates for `.claude/rules/owner-preferences.md` ("from now on ..."). It is his instruction in his words, and the project's `curating-project-memory` skill writes it. In a project with no such skill, add the line in the form that file's own layout comment gives.

## Steps

1. Name the kind of file you will change and the products that read it: Claude Code, Codex, or both.
2. Read the current official page for that kind of file. [references/official-pages.md](references/official-pages.md) lists the pages.
   - When the project keeps dated copies of these pages, use a copy captured in the last 14 days.
   - Otherwise read the live page.
   - When you cannot read the page, say so to the owner before you write: name the page, and say the change rests on the checklist alone.
3. Open the section for that kind of file in [references/checklist.md](references/checklist.md). Where the page and the checklist differ, follow the page, and tell the owner what differs so the checklist can be corrected.
4. Read the project's own rules for these files in its root `AGENTS.md`, and two existing files of the same kind in the project. Match their form.
5. Write the change, keeping to "Wording" below.
6. Check it the way the checklist section says under "Check".
7. Have an agent that did not write the change review it against the page and the checklist. Fix each finding it confirms, and have it read the fix. A small edit gets one reviewer and one read.
   - The host cannot start a helper agent: review the change yourself against the page and the checklist, and tell the owner in step 8 that no separate review ran.
8. Tell the owner which pages you read and their dates, what you changed, and what the review found.

A project may require the owner's yes before a rule, skill, or hook changes. Get it before step 5.

## Wording

- Plain, clear, ordinary English. Short sentences. Terse and technical.
- No figurative language and no idioms. Name the real thing.
- One meaning for every instruction. Say who does what, and when.
- Write only what the agent would get wrong without it.
- State each instruction in one file. Where a second file needs it, point to the first.
- A file that both products read uses only what both support.

## Briefing a helper agent

A helper agent starts with only its brief. When it will change a harness file, the brief:

- names the kind of file and the products that read it;
- tells the helper to use this skill, or, when the helper cannot load skills, gives it the page addresses and the checklist section for that kind of file;
- repeats "Wording" above, because a helper does not see the main chat's reply style;
- says a separate agent reviews the change.

## References

| File | Open it when |
| --- | --- |
| [references/official-pages.md](references/official-pages.md) | Step 2: you need the official page for a kind of file. |
| [references/checklist.md](references/checklist.md) | Steps 3 and 6: you need the practices and the check for a kind of file. |

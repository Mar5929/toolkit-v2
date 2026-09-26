---
name: memory-save
description: 'Saves, corrects, or forgets one lasting fact in project memory, and sends anything that belongs elsewhere to its home. Use when the owner says "remember this", "from now on", "always do X", "never do X", "forget that", or "remind me", corrects the agent, or a hook says to save.'
---

# Memory save

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Record format, types, focus, and glossary: `references/record-format.md`. To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`. Put each `toolkit` command on its own line; write `--body-file` and `--set-file` files in a temporary folder outside the repository.

## Steps

1. Decide the home first. Memory holds a lasting preference, correction, fact about the project or the owner, or a hard-to-find reference. Elsewhere: project work goes to `work-on`; a decision for the whole project to `work-decide` (`DECISIONS.md`); a standing rule for how agents work in this repository is proposed as a rule-file change; a personal to-do with no work item goes to the current focus "Untracked to-dos"; a project term goes to the glossary.
2. Search first and update the existing record rather than add a duplicate.
   `toolkit memory find "<topic>"`
   `toolkit memory get <key>`
3. Approval. This is the only written copy of the memory approval policy. Read the mode, then apply it:
   `toolkit config get memory.approval`
   The owner's own words ("remember", "from now on", "always", "never", "forget", a correction) are the approval: save now, with his name as the approver. `onboarding` mode (the default): something the agent inferred gets one yes-or-no line first ("Save to memory: <one-line summary>?"); save after a yes. `trusted` mode: routine facts the agent is sure of are saved and reported, without an approver. Always ask first, in either mode, for anything about a named person, personal details, a hard delete, more than five records at once, or a change to this policy. Silence is never a yes.
4. Save: type (`user`, `feedback`, `project`, `reference`, `event`), slug, one-line description, and a body file with the sections Remember, Why, How to apply, Evidence and limits, Related, a source line, and an absolute date. Saving the same type and slug again updates that record. Replacing a record under a new name: add `--supersedes <old-key>`. Use the first form when the owner approved (his words or his yes); the second only for a routine save in `trusted` mode.
   `toolkit memory save --type <type> --name <slug> --description "<one line>" --body-file <file> --approved-by <owner>`
   `toolkit memory save --type <type> --name <slug> --description "<one line>" --body-file <file>`
5. "Forget that": retire the record (it can be undone); right after a save, retire that record with no question. Delete only when the owner says delete, and quote his words.
   `toolkit memory retire <key>`
   `toolkit memory delete <key> --owner-approved`
6. Focus and to-dos: read the current focus, change it, write it back. Four sections, under 50 lines, work item ids only, never their status. Glossary terms the same way.
   `toolkit memory focus`
   `toolkit memory focus --set-file <file>`
   `toolkit memory glossary`
   `toolkit memory glossary --set-file <file>`
7. A preference a project setting can enforce (for example "I hate tabs" and `.editorconfig`): save it, then offer that change too.
8. Tell the owner in one line: "Saved to memory: <title>. Say 'forget that' to undo." A failed save is reported first as "Not saved". Never store work-item status, secrets, or email addresses.

## Changing the approval mode

- Only the owner switches modes, in his own words ("you can save routine things without asking me"). Silence, time, or many approved saves never switch it.
- Switch to trusted, or back to onboarding:
  `toolkit config set memory.approval trusted`
  `toolkit config set memory.approval onboarding`
- Save his words as a `feedback` record with the date.

## Hook reminders

- The UserPromptSubmit hook adds a line when the owner's message contains a keep phrase ("remember that", "from now on", "note that"). It is a reminder, not an instruction to save everything: route it with step 1.
- The Stop hook blocks once when a keep phrase had no save this turn. Save it, or tell the owner in one line why it belongs elsewhere and where it went.

## Backend notes

- Built-in `.memory/`: never edit the files by hand; the CLI writes them and rebuilds `.memory/MEMORY.md`.
- Hindsight or Notion unreachable: the save fails with "Not saved". Keep the text, tell the owner in one line, and retry later in the session.
- Undo a retire:
  `toolkit memory restore <key>`

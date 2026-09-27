---
name: memory-save
description: 'Saves, corrects, or forgets one lasting fact in project memory, and sends anything that belongs elsewhere to its home. Use when the owner says "remember this", "from now on", "always do X", "never do X", "forget that", or "remind me", corrects the agent, or a hook says to save.'
---

# Memory save

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Record format, types, focus, and glossary: `references/record-format.md`. To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`. Put each `toolkit` command on its own line. In Codex, a `toolkit` command joined to anything else (`&&`, `;`, a pipe, a heredoc) or run from a script runs inside the sandbox, which blocks Hindsight and Notion: run it alone. Text: give it in the command with `--body "<text>"` (a save) or `--text "<text>"` (the focus or the glossary), so no file is needed. For a long text, in Claude Code pass it on standard input (`--set-file -` or `--body-file -` with a heredoc); in Codex make a new folder for each save with `mktemp -d`, write the file there, and delete the file and the folder right after the command succeeds. Never use a fixed name such as `/tmp/focus.md`: another session could write the same file.

## Steps

1. Decide the home first, with the memory criteria (`.memory/memory-criteria.md` with built-in memory; otherwise `references/record-format.md`). Memory holds a lasting preference, correction, fact about the project or the owner, or a hard-to-find reference. Elsewhere: project work goes to `work-on`; a decision for the whole project to `work-decide` (`DECISIONS.md`); delivered behavior to `requirements/`; how a change is built to the item's design; verified current structure to `system-guide/`; outside documentation to `ai-external-knowledge/`; a standing rule for how agents work here is proposed as a rule-file change; an owner to-do with no work item goes to the current focus "Untracked to-dos"; a project term goes to the glossary. A short memory pointer to a hard-to-find record is allowed; never copy its body.
2. Search first and update the existing record rather than add a duplicate.
   `toolkit memory find "<topic>"`
   `toolkit memory get <key>`
3. Approval. This is the only written copy of the memory approval policy. Read the mode, then apply it:
   `toolkit config get memory.approval`
   The owner's own words ("remember", "from now on", "always", "never", "forget", a correction) are the approval: save now, with his name as the approver. `onboarding` mode (the default): something the agent inferred gets one yes-or-no line first ("Save to memory: <one-line summary>?"); save after a yes. `trusted` mode: routine facts the agent is sure of are saved and reported, without an approver. Always ask first, in either mode, for anything about a named person, personal details, a hard delete, more than five records at once, or a change to this policy. A yes covers only the change and meaning shown. Silence is never a yes. There is no proposal inbox: keep an unanswered question in the conversation and go on with other work.
4. Save: type (`user`, `feedback`, `project`, `reference`, `event`), slug, one-line description, the source, and a body file with the model's labels: Remember, Why (the owner's reason in his words, or "Not stated by the owner."; never a reason you inferred), How to apply, Evidence and limits (the source and an absolute date), Related memories (relative links such as `[deploy window](project_deploy_window.md)`), Authoritative records. The source is the person, conversation, or document the fact came from, with an absolute date, for example "The owner, in chat, 2026-09-26" or "requirements/billing.md, 2026-09-26". Saving the same type and slug again updates that record. Replacing a record under a new name: add `--supersedes <old-key>`. Giving the same record a better name, or a type that matches its content: rename it; links to it are repaired. Use the first save form when the owner approved (his words or his yes); the second only for a routine save in `trusted` mode.
   `toolkit memory save --type <type> --name <slug> --description "<one line>" --body-file <file> --source "<person or document>, <YYYY-MM-DD>" --approved-by <owner>`
   `toolkit memory save --type <type> --name <slug> --description "<one line>" --body-file <file> --source "<person or document>, <YYYY-MM-DD>"`
   `toolkit memory rename <key> --to <new-key>`
5. "Forget that": retire the record (it can be undone); right after a save, retire that record with no question. Delete only when the owner says delete, and quote his words.
   `toolkit memory retire <key>`
   `toolkit memory delete <key> --owner-approved`
6. Focus and to-dos: read the current focus, change it, write it back. The model's format: a "Last updated" line (date, source, who) and four sections, under 50 lines, work item ids only, never their status. On a new project the focus still holds the setup text: remove the fill-in guide comment, and write "None." in each section that still holds only an angle-bracket prompt. Glossary terms the same way, sourced, never invented.
   `toolkit memory focus`
   `toolkit memory focus --set-file <file>`
   `toolkit memory glossary`
   `toolkit memory glossary --set-file <file>`
7. A preference a project setting can enforce (for example "I hate tabs" and `.editorconfig`): save it, then offer that change too.
8. Read the save back and check memory, then tell the owner in one line: "Saved to memory: <title>. Say 'forget that' to undo." A failed save is reported first as "Not saved". Never store work-item status, secrets, or email addresses.
   `toolkit memory get <key>`
   `toolkit doctor`

## Changing the approval mode

- Only the owner switches modes, in his own words ("you can save routine things without asking me"). Silence, time, or many approved saves never switch it.
- Switch to trusted, or back to onboarding:
  `toolkit config set memory.approval trusted`
  `toolkit config set memory.approval onboarding`
- Save his words as a `feedback` record with the date.

## Hook reminders

- The UserPromptSubmit hook adds a line when the owner's message contains a keep phrase ("remember that", "from now on", "note that"). It is a reminder, not an instruction to save everything: route it with step 1.
- The Stop hook blocks once when a keep phrase had no save this turn. Save it, or tell the owner in one line why it belongs elsewhere and where it went.

## Declined saves

- When the owner says a proposed item should not be memory, withdraw it. Do not put the rejected fact in the current focus, the glossary, or another record. If his words give a general rule about what to save, save only that rule, as a `feedback` record.
- Several independent things can be grouped into one save. Never run two saves against the same record or the index at once.

## Backend notes

- Built-in `.memory/`: never edit the files by hand; the CLI writes them and rebuilds `.memory/MEMORY.md`. The folder opens as an Obsidian vault. When a record is renamed, merged, retired, or deleted, the CLI repairs the links in other notes and names each note it changed; read that report (`references/record-format.md`, "Links between memories").
- Hindsight or Notion unreachable: the save fails with "Not saved". Keep the text, tell the owner in one line, and retry later in the session.
- Undo a retire:
  `toolkit memory restore <key>`

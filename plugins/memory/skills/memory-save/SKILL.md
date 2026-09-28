---
name: memory-save
description: 'Saves, corrects, or forgets one lasting fact in the project''s memory, or sends it to the record where it belongs. Use when the owner says "remember this", "from now on", "forget that", or "remind me" with no time given, corrects the agent, or a hook says a save is due.'
---

# Memory save

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Record format, types, focus, and glossary: `references/record-format.md`. To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`. Run each `toolkit` command alone, on its own line, in both hosts: never joined by `&&`, `;`, or a pipe, and never from a script (in Codex that runs it inside the sandbox, which blocks Hindsight and Notion). Text: one-line values (`--description`, `--source`) go in single quotes, with an apostrophe written `'\''`, because double quotes run backticks and `$(...)` and drop that text. A record body, the focus, or the glossary: in Claude Code pass it on standard input (`--body-file -` or `--set-file -`, followed by a quoted heredoc, `<<'EOF'`), never through a file; in Codex give it in single quotes (`--body '<text>'`, `--text '<text>'`), or write a file with the file edit tool in a new folder made with `mktemp -d`, run the `toolkit` command alone with that file, and delete the file and the folder right after. Never write the file and run the command in one shell command, and never use a fixed name such as `/tmp/focus.md`. Ask the owner in the reply text, never through a question tool.

## Steps

1. Decide the home first, with the memory criteria (`.memory/memory-criteria.md` with built-in memory; otherwise `references/record-format.md`). Memory holds a lasting preference, correction, fact about the project or the owner, or a hard-to-find reference. Elsewhere: project work goes to `work-on`; a decision for the whole project to `work-decide` (`DECISIONS.md`); delivered behavior to `requirements/`; how a change is built to the item's design; verified current structure to `system-guide/`; outside documentation to `ai-external-knowledge/`; a standing rule for how agents work here is proposed as a rule-file change; an owner to-do with no work item goes to the current focus "Untracked to-dos"; a project term goes to the glossary. A short memory pointer to a hard-to-find record is allowed; never copy its body.
2. Search first and update the existing record rather than add a duplicate. The save command checks too: when memory already has a record with the same key or a very similar description or text, it saves nothing, exits with code 2, and lists those records. Read each one with the second command below, which prints its `version` field. The same fact: save that record's type and slug again with `--expect <version>`, which updates it (the first 12 characters of the version are enough; for a record with the same key, the command's own fix line already gives them). A newer fact that replaces it: add `--supersedes <old-key>`. A different fact: say why in one line and save again with `--allow-similar`. Never add `--allow-similar` without reading the listed records.
   `toolkit memory find '<topic>'`
   `toolkit memory get <key> --json`
3. Approval. This is the only written copy of the memory approval policy. Read the mode, then apply it:
   `toolkit config get memory.approval`
   The owner's own words ("remember", "from now on", "always", "never", "forget", a correction) are the approval: save now, with his name as the approver. `onboarding` mode (the default): something the agent inferred gets one yes-or-no line first ("Save to memory: <one-line summary>?"); save after a yes. `trusted` mode: routine facts the agent is sure of are saved and reported, without an approver. Always ask first, in either mode, for anything about a named person, personal details, a hard delete, more than five records at once, or a change to this policy. A yes covers only the change and meaning shown. Silence is never a yes. An unanswered "Save to memory?" (his next message does not answer it, or the session is ending) is not dropped: save it as a proposal (`--proposal`, never with an approver). A proposal is not a fact: search leaves it out, the agent does not rely on it, and the decision list shows it to the owner until he approves or rejects it through `work-decide`.
4. Save: type (`user`, `feedback`, `project`, `reference`, `event`), slug, one-line description, the source, and a body with the model's bold labels, each starting its own paragraph: `**Remember:**`, `**Why:**` (the owner's reason in his words, or "Not stated by the owner."; never a reason you inferred), `**How to apply:**`, `**Evidence and limits:**` (the source and an absolute date), `**Related memories:**` (relative links such as `[deploy window](project_deploy_window.md)`), `**Authoritative records:**`. Never write them as `## headings`. The source is the person, conversation, or document the fact came from, with an absolute date, for example "The owner, in chat, 2026-09-26". Saving the same type and slug again, with `--expect <version>` (the `version` field of the step 2 read), updates that record. Replacing a record under a new name: add `--supersedes <old-key>`. A better name or a type that matches the content: rename it; links to it are repaired. The first form is for the owner's approval (his words or his yes); the second for a routine save in `trusted` mode; the third for an unanswered proposal; the fourth updates a record read in step 2. `<file>` is `-` in Claude Code.
   `toolkit memory save --type <type> --name <slug> --description '<one line>' --body-file <file> --source '<person or document>, <YYYY-MM-DD>' --approved-by <owner>`
   `toolkit memory save --type <type> --name <slug> --description '<one line>' --body-file <file> --source '<person or document>, <YYYY-MM-DD>'`
   `toolkit memory save --type <type> --name <slug> --description '<one line>' --body-file <file> --source '<person or document>, <YYYY-MM-DD>' --proposal`
   `toolkit memory save --type <type> --name <slug> --description '<one line>' --body-file <file> --expect <version> --approved-by <owner>`
   `toolkit memory rename <key> --to <new-key>`
5. "Forget that": retire the record (it can be undone); right after a save, retire that record with no question. Delete only when the owner says delete, and quote his words.
   `toolkit memory retire <key>`
   `toolkit memory delete <key> --owner-approved`
6. Focus and to-dos: read the current focus with its version, change it, write the whole text back. The model's format: the `# Current focus` title line, a "Last updated" line (date, source, who), and four sections, under 50 lines, work item ids only, never their status; keep the title and the date line (the CLI adds them when missing, but without the source and who). Drop a setup step under "Waiting on the owner" once doctor no longer reports it. On a new project remove the fill-in guide comment, and write "None." in each section that still holds only an angle-bracket prompt. Glossary terms the same way, sourced, never invented.
   `toolkit memory focus --json`
   `toolkit memory focus --set-file <file> --expect <version>`
   `toolkit memory glossary`
   `toolkit memory glossary --set-file <file>`
7. A preference a project setting can enforce (for example "I hate tabs" and `.editorconfig`): save it, then offer that change too.
8. Read the save back and check memory, then tell the owner in one line: "Saved to memory: <title>. Say 'forget that' to undo." (a proposal: "Saved as a proposal for your yes or no: <title>."). A failed save is reported first as "Not saved". Never store work-item status, secrets, or email addresses. End the reply with the question still waiting for him, if there is one, or those exact words.
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

## Proposals and declined saves

- A proposal saved in step 3 waits for the owner's yes or no; `work-decide` asks him. His answer in this chat also settles it: yes approves it (a current record with him as the approver), no rejects it (the proposal is deleted).
  `toolkit memory approve <key> --by <owner>`
  `toolkit memory reject <key>`
- When the owner says a proposed item should not be memory, withdraw it (a saved proposal: reject it). Do not put the rejected fact in the current focus, the glossary, or another record, and never propose it again under other words. If his words give a general rule about what to save, save only that rule, as a `feedback` record.
- Several independent things can be grouped into one save. Never run two saves against the same record or the index at once.

## Backend notes

- Built-in `.memory/`: never edit the files by hand; the CLI writes them and rebuilds `.memory/MEMORY.md`. The folder opens as an Obsidian vault. When a record is renamed, merged, retired, or deleted, the CLI repairs the links in other notes and names each note it changed; read that report (`references/record-format.md`, "Links between memories").
- Hindsight or Notion unreachable: the save fails with "Not saved". Keep the text, tell the owner in one line, and retry later in the session.
- Undo a retire:
  `toolkit memory restore <key>`

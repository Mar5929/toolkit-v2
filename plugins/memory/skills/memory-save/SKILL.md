---
name: memory-save
description: 'Saves, corrects, or forgets one lasting fact in the project''s memory, or sends it to the record where it belongs. Use when the owner says "remember this", "from now on", "forget that", or "remind me" with no time given, corrects the agent, or a hook says a save is due.'
---

# Memory save

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Saves, corrects, or retires one memory record with `toolkit memory` commands, or sends the fact to its proper home. It never edits memory files by hand.

## Steps

Track these steps in the host's plan tool (Claude Code: the task list; Codex: `update_plan`), not in the reply.

1. Decide the home with the memory criteria (`.memory/memory-criteria.md` with built-in memory, which wins; otherwise `references/memory-criteria.md`). Not memory: send it to its home ("Where other things go" below) and stop.
2. Search for a record that already holds it, and read each hit with its version. The save's duplicate check compares wording, so only this search finds a record the new fact contradicts (for example "Mondays" against "Tuesdays").
   `toolkit memory find '<topic>'`
   `toolkit memory get <key> --json`
3. Read the approval mode and apply "Approval policy" below. When it says ask, ask and wait.
   `toolkit config get memory.approval`
4. Write the description and body in the record format (`references/record-format.md`), then save with the form for the case ("Save forms" below).
5. Exit code 2 saved nothing. Read the "Error:" line. Records listed: the duplicate check. "Changed since it was read": read it again and redo the change. Any other rule: fix the text as the message says. `references/replacing-and-retiring.md`, section 2, has each case.
6. "Forget that": retire the record, with his words as the reason. Delete only when his own words say delete ("Approval policy").
   `toolkit memory retire <key> --reason '<his words>'`
7. An owner to-do with no work item, or a change to what is happening now: update the current focus (`references/current-focus.md`). A project term: update the glossary (`references/glossary.md`).
8. A preference a project setting can enforce (for example "I hate tabs" and `.editorconfig`): save it, then offer that change too.
9. Read the record back, check, and reply in one line ("Replies" below). End with the question still waiting for the owner, or the exact words that continue.
   `toolkit memory get <key>`
   `toolkit doctor`

## Approval policy

This is the only written copy of the memory approval policy.

- The owner's own words are the approval: "remember", "from now on", "always", "never", "forget", or a correction. Save now, with `--approved-by <owner>`. That includes a fact about a named person he asks you to remember ("remember that Priya's last day is October 15").
- `onboarding` mode (the default): something the agent inferred gets one yes-or-no line first, in exactly this form: "Save to memory: <one-line summary>?". Save after his yes (`references/proposals.md` when a proposal was saved for the question).
- A preference or fact he mentions in passing, without a keep phrase or an instruction ("screenshots were more useful than the text"), is inferred: ask "Save to memory: ...?" first. Only his keep words, or his yes to that question, are an approval.
- Recommend a yes only with evidence from this project (what he said, what happened, and when). With none, ask without a recommendation.
- `trusted` mode: a routine fact the agent is sure of is saved without asking and reported in one line, with no approver. The record says "Trusted grant".
- In either mode, always ask first for anything about a named person or personal details that he did not ask you to remember, for more than five records at once, and for a change to this policy.
- A delete needs his own words about that record ("delete it", "remove it for good"), or his yes to a numbered list that shows the delete. Do not ask again: the host asks him to confirm `toolkit memory delete`, and that prompt is the confirmation. "Forget that" is a retire, never a delete.
- A yes covers only the change and the meaning shown. Silence is never a yes.
- `--approved-by` is only for a change his words or his yes covered. Give his name exactly as the project settings hold it (`project.owner`, for example "Mike Rihm", not "Mike").
- An unanswered "Save to memory?" stays a proposal until he answers (`references/proposals.md`). Never drop it, and never save it with an approver.
- Only the owner switches the mode, in his own words ("you can save routine things without asking me"). Save his words as a `feedback` record with the date, then run one of:
  `toolkit config set memory.approval trusted`
  `toolkit config set memory.approval onboarding`

## Save forms

`<file>` is `-` in Claude Code, with the body on standard input after a quoted heredoc (`<<'EOF'`). In Codex give `--body '<text>'` in place of `--body-file <file>`. `references/record-format.md` shows both.

- A new record, from the owner's words or his yes:
  `toolkit memory save --type <type> --name <slug> --description '<one line>' --body-file <file> --source '<person or document>, <YYYY-MM-DD>' --approved-by <owner>`
- A new routine fact in `trusted` mode:
  `toolkit memory save --type <type> --name <slug> --description '<one line>' --body-file <file> --source '<person or document>, <YYYY-MM-DD>'`
- A question he has not answered yet:
  `toolkit memory save --type <type> --name <slug> --description '<one line>' --body-file <file> --source '<person or document>, <YYYY-MM-DD>' --proposal`
- An update of a record read in step 2, which his words or his yes covered:
  `toolkit memory save --type <type> --name <slug> --description '<one line>' --body-file <file> --expect <version> --approved-by <owner>`
- A routine update in `trusted` mode (the stored authorization is kept):
  `toolkit memory save --type <type> --name <slug> --description '<one line>' --body-file <file> --expect <version>`
- A new record that replaces an old one: add `--supersedes <old-key>` to a new-record form.
- A better name, or a type that matches the content:
  `toolkit memory rename <key> --to <new-key>`

## Gotchas

- Run each `toolkit` command alone, on its own line: never joined by `&&`, `;`, or a pipe, and never from a script. In Codex a joined command runs inside the sandbox, which blocks Hindsight, Notion, and the main checkout's `.memory/`.
- Put one-line values (`--description`, `--source`, `--reason`) in single quotes. An apostrophe inside them: Claude Code writes `'\''`; Codex writes ’ (U+2019) or rewords, and never uses `'\''`, which runs the command inside the sandbox. Double quotes run backticks and `$(...)`, drop that text, and the save still says "Saved".
- Never use a fixed file name such as `/tmp/memory.md`, and never write a file and run the command in one shell command.
- Body labels are bold paragraphs (`**Remember:**`), never `## Remember` headings.
- **Why** is the owner's reason in his words, or exactly "Not stated by the owner." Never a reason you inferred.
- In `onboarding` mode, a save with neither `--approved-by` nor `--proposal` is stored as "No approval recorded", and the save prints a "Note:" line about it. That is a mistake: fix it at once. Ask him, then save again with `--expect` and `--approved-by` after his yes, or with `--proposal` while he has not answered.
- A save of an existing key without `--expect` saves nothing. Take the version from the `--json` read; the first 12 characters are enough. Keep that read: its old text is the undo for an update.
- Add `--allow-similar` only after reading every record the duplicate check listed.
- A proposal the Stop hook saved holds only the one-line summary. His plain yes is `toolkit memory approve`, which takes out its "Do not rely on this" words; when he adds a reason or a detail, save the full body instead (`references/proposals.md`).
- Never store email addresses, secrets, or work-item status. The CLI catches common secret shapes, not all. For a secret, save where it is kept, never the secret.
- Ask the owner in the reply text, never through a question tool.
- Say "proposal" only for a record saved with `--proposal` (by you or the Stop hook). When nothing was saved, say that nothing was saved, and ask.
- An inferred fact whose home is a project document (for example `PROJECT.md`) is asked the same way, as one yes-or-no line: "Add to PROJECT.md: <one line>?". When he does not answer, add it to the current focus under "Waiting on the owner", so it is asked again (`references/current-focus.md`).
- The host refused `toolkit memory delete` without asking him (Codex with approvals off): the cause is that approval setting. Show him the exact command to run in a terminal and wait. Do not retire the record in its place unless he asks for that.
- Built-in memory: the CLI rebuilds `MEMORY.md` and repairs links in other notes after a rename, supersede, retire, or delete, and names each note it changed. Read that report (`references/memory-builtin.md`).

## Where other things go

| The owner's words are about | Home | Open |
| --- | --- | --- |
| Project work, a task, a bug, "add it to the backlog" | A work item | `work-on` |
| A decision for the whole project | `DECISIONS.md` | `work-decide` |
| A requirement for a work item | The item's requirements | `work-requirements` |
| Behavior already delivered | `requirements/` | none |
| How a change is built | The item's design | `solution-design` |
| Verified current structure of the system | `system-guide/` | none |
| Outside documentation | `ai-external-knowledge/` | none |
| A standing rule for how agents work here | A rule-file change, proposed to him | none |
| His to-do with no work item and no time | Current focus, Untracked to-dos | step 7 |
| A to-do with a time ("at 9 tomorrow") | A scheduled reminder, outside memory | the host's scheduling tool |
| A project term | The glossary | step 7 |

A short memory pointer to a hard-to-find record is allowed; never copy the record's body.

## Replies

Use these lines word for word, with the record's title. Every memory reply ends with the next step: the question still waiting for the owner (for example "Save to memory: <one line>?"), or the exact words that continue. Never end on what was not done ("I haven't saved anything.").

- A new record: "Saved to memory: <title>. Say 'forget that' to undo."
- An update: "Updated in memory: <title>. Say 'undo that' to put back the old wording." His "undo that" is a save of the old text from the `--json` read (`references/replacing-and-retiring.md`, section 3). Right after a supersede, the undo is a restore of the old record and a retire of the new one (same file, section 4).
- A proposal: "Saved as a proposal for your yes or no: <title>."
- A rejected proposal: "Not saved: <title>. I will not suggest it again.", then the next step.
- A retire: "Retired from memory: <title>. Say 'bring it back' to restore it." His "bring it back" is the whole restore in `references/replacing-and-retiring.md`, section 7, not `toolkit memory restore` alone.
- A delete: "Deleted from memory, as you said: '<his words>'. This cannot be undone." For a secret or an email address, add that older backups still hold it (`references/replacing-and-retiring.md`, section 8).
- A failed save: lead with "Not saved: <reason>." Keep the text and try again later in the session. With Hindsight or Notion, the command prints the fix (`references/memory-hindsight.md`, `references/memory-notion.md`).

## Hook reminders

- The UserPromptSubmit hook adds one line when the owner's message holds one of six keep phrases: "remember that" (or "remember this"), "from now on", "don't ever", "note that", "going forward", or "keep in mind". It is a reminder: route the fact with step 1.
- The Stop hook blocks once when a keep phrase got no save, work-item change, or decision in the turn. Save it, or say in one line where it went instead.
- Ask in exactly the form "Save to memory: <one line>?" (bold is fine). Other wording, such as "Save it to memory?", makes the Stop hook stop the turn once and ask for that form.
- When a reply asks "Save to memory: <summary>?" and no proposal was saved in that turn, the Stop hook tries to save one, and the next turn's context says what happened:
  - It saved a proposal and names its key: his yes approves that key, his no rejects it (`references/proposals.md`, "Recording the owner's answer").
  - Memory already holds a proposal like it, and names it: his answer approves or rejects that proposal.
  - Memory already holds a record about the same subject, and names it: read it as in step 2. The same fact: keep it, or update it with `--expect`. A different fact and his yes: save it with `--allow-similar` and `--approved-by`. Never overwrite a record with a different fact.
  - The text looks like a secret, so nothing was saved: never save it; after his yes, save only where the secret is kept.
  - The save failed: save the proposal yourself in this turn, with `--proposal`.

## References

| File | Open it when |
| --- | --- |
| `references/memory-criteria.md` | Step 1, with Hindsight or Notion memory (built-in projects read `.memory/memory-criteria.md`) |
| `references/record-format.md` | Step 4: choosing the type and key, writing the description and body, passing text in each host |
| `references/replacing-and-retiring.md` | Step 5 (exit code 2), step 6, any update, supersede, rename, restore, or delete, and any undo |
| `references/proposals.md` | Asking "Save to memory?", a proposal named in the context, or the owner's answer to one |
| `references/current-focus.md` | Step 7: a to-do or a change to what is happening now |
| `references/glossary.md` | Step 7: a project term |
| `references/memory-builtin.md` | Built-in memory: links, the index, a link-repair report, notes the owner edited in Obsidian |
| `references/memory-hindsight.md` | Hindsight memory: a failed command, the server, how records are stored |
| `references/memory-notion.md` | Notion memory: a failed command, sign-in, Lore's layout, edits made in Notion |
| `references/examples.md` | You want a complete worked example of the case in front of you |
| `references/toolkit-commands.md` | A `toolkit` command fails, is refused by a hook, or you are unsure how to pass text in this host |

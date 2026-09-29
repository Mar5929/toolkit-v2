---
name: memory-save
description: 'Saves what the owner wants kept: instructions ("from now on", "always", "never") to the owner-preferences rule, facts to a memory concept, so later sessions follow them without being told again. Use when the owner says "remember this", "forget that", or "remind me" with no time given, corrects the agent, or a hook says a save is due.'
---

# Memory save

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Saves, corrects, or retires one fact in the project's memory with `toolkit memory` commands, or sends it to its proper home. It never edits memory files by hand. Rules, skills, and memory each hold one kind of thing: an instruction the agent follows every time goes in the rules (`toolkit rule add`), a procedure that proved itself in a skill, and a fact or an unproven lesson in memory. Memory keeps one record per concept (for example `user_profile`, `project_billing`), with one `##` section per fact and a last "Gotchas and lessons" section; an `event_` record holds one episode. The prefixes are `user_`, `project_`, `reference_`, and `event_`; `feedback_` is retired.

## Steps

Track these steps in the host's plan tool (Claude Code: the task list; Codex: `update_plan`), not in the reply.

1. Decide the home. An instruction for how the agent works (a preference about how work is done, a correction, "from now on", "always", "never") is a rule: save it with `toolkit rule add` ("Rules" below) and stop. A fact about why a part of the project exists or how it is used is a `project_` concept fact, even while a work item for that part is open; the item may link to it. Anything else: use the memory criteria (`.memory/memory-criteria.md` with built-in memory, which wins; otherwise `references/memory-criteria.md`). Not memory: send it to its home ("Where other things go" below) and stop.
2. Find the concept it belongs in, and any section that already holds it. List the concepts of its type (title, summary, updated date), search, and read each likely concept whole, with its version. The save's duplicate check compares wording, so only this search finds a section the new fact contradicts (for example "Mondays" against "Tuesdays").
   `toolkit memory list --type <type>`
   `toolkit memory find '<topic>'`
   `toolkit memory get <key> --json`
3. Read the approval mode and apply "Approval policy" below. When it says ask, ask and wait.
   `toolkit config get memory.approval`
4. Pick where it goes ("Choosing the concept" below), write the section text in the record format (`references/record-format.md`; a concept's layout: `assets/project_topic_template.md`), and save with the form for the case ("Save forms" below).
5. Exit code 2 saved nothing. Read the "Error:" line. "Belongs in the concept <key>": add it there with the command the "Fix:" line prints, or, when it is a different concept, save again with `--new-concept`. Records listed: the duplicate check. "Changed since it was read": read it again and redo the change. Any other rule: fix the text as the message says. `references/replacing-and-retiring.md`, section 2, has each case.
6. "Forget that" right after a section save: run the "Undo:" command the save printed (it removes that section). About a whole concept: retire it, with his words as the reason. Delete only when his own words say delete ("Approval policy").
   `toolkit memory retire <key> --reason '<his words>'`
7. An owner to-do with no work item, or a change to what is happening now: update the current focus (`references/current-focus.md`). A project term: update the glossary (`references/glossary.md`).
8. A preference a project setting can enforce (for example "I hate tabs" and `.editorconfig`): add the rule, then offer that change too. A lesson the agent learned itself goes under the concept's Gotchas and lessons section ("Lessons" below).
9. Read the record back, check, and reply in one line ("Replies" below). End with the question still waiting for the owner, or the exact words that continue.
   `toolkit memory get <key>`
   `toolkit doctor`

## Approval policy

This is the only written copy of the memory approval policy.

- The owner's own words are the approval: "remember", "from now on", "always", "never", "forget", or a correction. Save now: a fact with `--approved-by <owner>`, an instruction with `toolkit rule add`. That includes a fact about a named person he asks you to remember ("remember that Priya's last day is October 15").
- The toolkit checks this: when the hooks recorded no keep phrase, no other words asking for a save, and no answer to a memory question in his message, a save with `--approved-by` stores a new record, a new section, or added text as a proposal instead (with `--expect` too), and `toolkit rule add` stores a rule proposal instead; `toolkit rule update` and `toolkit memory promote` with `--approved-by` are refused. The output says so. Then ask him, as below.
- `onboarding` mode (the default): something the agent inferred gets one yes-or-no line first, in exactly this form: "Save to memory: <one-line summary>?". Save after his yes (`references/proposals.md` when a proposal was saved for the question).
- A preference or fact he mentions in passing, without a keep phrase or an instruction ("screenshots were more useful than the text"), is inferred: ask "Save to memory: ...?" first. Only his keep words, or his yes to that question, are an approval.
- Recommend a yes only with evidence from this project (what he said, what happened, and when). With none, ask without a recommendation.
- `trusted` mode: a routine fact the agent is sure of is saved without asking and reported in one line, with no approver. The record says "Trusted grant".
- In either mode, always ask first for anything about a named person or personal details that he did not ask you to remember, for more than five records at once, and for a change to this policy.
- A delete needs his own words about that record ("delete it", "remove it for good"), or his yes to a numbered list that shows the delete. Do not ask again: the host asks him to confirm `toolkit memory delete`, and that prompt is the confirmation. "Forget that" is a retire, never a delete.
- A yes covers only the change and the meaning shown. Silence is never a yes.
- `--approved-by` is only for a change his words or his yes covered. Give his name exactly as the project settings hold it (`project.owner`, for example "Mike Rihm", not "Mike").
- A concept's `authorization` line is the approval of the concept. A section save never changes it; when the save's approval differs, the CLI records it on that section's Evidence and limits line (`references/record-format.md`, "Frontmatter").
- An unanswered "Save to memory?" stays a proposal until he answers (`references/proposals.md`). Never drop it, and never save it with an approver.
- Only the owner switches the mode, in his own words ("you can save routine things without asking me"). Save his words as a rule in the Memory section ("Rules" below), then run one of:
  `toolkit config set memory.approval trusted`
  `toolkit config set memory.approval onboarding`

## Choosing the concept

- One concept is one subject a future session would look up as a whole: the billing setup (`project_billing`), his role and the facts he told you about himself (`user_profile`), where dashboards live (`reference_dashboards`). How he wants the agent to work is not a concept: it is a rule.
- The fact has the concept's type. Add it to the existing concept of that type whose title and summary cover it, as a new section. The heading names the sub-topic in a few words ("Force-push", "Refund window").
- The concept already has a heading for this sub-topic: add under it with `--append`. The fact corrects what a section says: replace that section with `--expect`.
- No concept of that type covers it: start a new one. Its slug and title name the concept, not the fact (`project_billing`, not `project_invoices_go_out_on_the_1st`), and its summary says what the whole concept covers.
- An event is always its own record: one episode per `event_` record.
- Two concepts fit: pick the one a future session would open first, and link the other from the section's **Related memories** line.

## Rules

An instruction for how the agent works goes in `.claude/rules/owner-preferences.md`, one `##` section per area (Replies, Questions, Testing, Git, Work items, Memory, General), each line dated with its source (layout: `assets/owner-preferences.md`). `toolkit rule add` creates the file on first use and rebuilds the AGENTS.md rules list, so Codex reads it too.

- His own words are the approval. Save at once, in his words, under the area it is about. The command adds the date to the line itself:
  `toolkit rule add --section '<area>' --text '<the instruction>' --source '<owner>, in chat'`
- A memory save of an instruction he gave this turn with a keep phrase is refused (exit 2) with the `toolkit rule add` command to run instead. When it really is a fact about him or the project, not an instruction, save it again with `--not-a-rule`.
- This project is the default. When his words say every project ("in all my projects", "everywhere"), add `--machine` right after `add`; Claude Code and Codex ask him to confirm before it runs. Ask "This project or all projects?" only when his words leave it unclear.
- An instruction you inferred (he did not ask for it): ask first, in exactly this form: "Add to the project rules: <one line>?". Unanswered, the Stop hook saves it as a rule proposal. His yes writes the rule and removes the proposal (`references/proposals.md`):
  `toolkit memory approve <key> --by <owner>`
- A change or removal he asked for: list the rules to see the numbers, then change or remove one:
  `toolkit rule list`
  `toolkit rule update --section '<area>' --entry <n> --text '<new words>' --source '<owner>, in chat'`
  `toolkit rule update --section '<area>' --entry <n> --remove`
- Commit what the command's Commit line names, by name. A later rule changes only `.claude/rules/owner-preferences.md`: one file he asked for, which the one-file exception in `shared-repository-work.md` allows. The first rule also changes the rules list in `AGENTS.md`: two files, so commit them in your own worktree, or ask him before committing them in the shared primary checkout.
- The command prints the reply line ("Added to the project rules: ..."). Copy it.

## Lessons

A gotcha or lesson the agent learned while working, not proven yet, goes in the concept it is about, under "Gotchas and lessons", as a `###` heading with a Seen line. It needs no approval: it is the agent's own know-how, and nothing relies on it as a rule.

`toolkit memory save --concept <key> --lesson '<short heading>' --body '<what happened and what to do>' --source '<session or work item>'`

The same heading again adds today's date to its Seen line. A second session on the same day counts as its own only with its own `--source`, so always give one. When a lesson came up in two or more sessions, a lesson like it is in another concept, or the owner confirms it, propose it as a rule or a skill: `toolkit memory promote` (the `memory-tidy` skill, "Promotion").

## Save forms

`<file>` is `-` in Claude Code, with the body on standard input after a quoted heredoc (`<<'EOF'`). In Codex give `--body '<text>'` in place of `--body-file <file>`. `references/record-format.md` shows both.

The section text (`<file>`) is the labels only: no `# ` title and no `##` heading; `--section` gives the heading.

- A new fact for an existing concept, from the owner's words or his yes:
  `toolkit memory save --concept <key> --section '<heading>' --body-file <file> --source '<person or document>, <YYYY-MM-DD>' --approved-by <owner>`
- A new concept, with its first fact:
  `toolkit memory save --type <type> --name <concept-slug> --description '<one-line summary of the concept>' --section '<heading>' --body-file <file> --source '<person or document>, <YYYY-MM-DD>' --approved-by <owner>`
- In `trusted` mode, a routine fact the agent is sure of: either form without `--approved-by`.
- A question he has not answered yet: either form with `--proposal` in place of `--approved-by`. With `--concept`, `--description` is the fact in one line; the concept changes only after his yes.
- A correction of one section read in step 2, which his words or his yes covered:
  `toolkit memory save --concept <key> --section '<heading>' --body-file <file> --expect <version> --approved-by <owner>`
- One more fact under a heading the concept already has: add `--append` to the first form.
- The concept's summary no longer covers it: add `--description '<new summary>'` to a section save.
- An event (its own record):
  `toolkit memory save --type event --name <slug> --description '<one line>' --body-file <file> --source '<person or document>, <YYYY-MM-DD>' --approved-by <owner>`
- A whole record rewritten (rare; read it with `--json` first):
  `toolkit memory save --type <type> --name <slug> --description '<one line>' --body-file <file> --expect <version> --approved-by <owner>`
- A new record that replaces an old one: add `--supersedes <old-key>` to a new-record form.
- A better name, or a type that matches the content:
  `toolkit memory rename <key> --to <new-key>`

## Gotchas

- Run each `toolkit` command alone, on its own line: never joined by `&&`, `;`, or a pipe, and never from a script. In Codex a joined command runs inside the sandbox, which blocks Hindsight, Notion, and the main checkout's `.memory/`.
- Put one-line values (`--description`, `--source`, `--reason`) in single quotes. An apostrophe inside them: Claude Code writes `'\''`; Codex writes ’ (U+2019) or rewords, and never uses `'\''`, which runs the command inside the sandbox. Double quotes run backticks and `$(...)`, drop that text, and the save still says "Saved".
- Never use a fixed file name such as `/tmp/memory.md`, and never write a file and run the command in one shell command.
- Body labels are bold paragraphs (`**Remember:**`), never `## Remember` headings. A `##` heading names a sub-topic; the CLI writes it from `--section`.
- A save that starts a new file for a fact whose words match an existing concept is refused with "belongs in the concept <key>". Read that concept before adding `--new-concept`.
- Replacing a section, and removing one, need `--expect <version>` from a `--json` read; adding a section does not.
- **Why** is the owner's reason in his words, or exactly "Not stated by the owner." Never a reason you inferred.
- In `onboarding` mode, a save with neither `--approved-by` nor `--proposal` is stored as "No approval recorded" (a section save: "Saved on <date> with no approval recorded." on that section's Evidence and limits line), and the save prints a "Note:" line about it. That is a mistake: fix it at once. Ask him, then save again with `--expect` and `--approved-by` after his yes, or with `--proposal` while he has not answered.
- A whole-record save of an existing key without `--expect` saves nothing. Take the version from the `--json` read; the first 12 characters are enough. Keep that read: its old text is the undo for an update.
- Add `--allow-similar` only after reading every record the duplicate check listed.
- A proposal the Stop hook saved holds only the one-line summary. His plain yes is `toolkit memory approve`, which takes out its "Do not rely on this" words. A proposal that names no concept also needs `--concept <type>_<subject>`: the concept its fact goes in, an existing one or a new key named for its subject (with `--title` and `--description`). When he adds a reason or a detail, approve it first, then save its section with his words (`references/proposals.md`).
- Never store email addresses, secrets, or work-item status. The CLI catches common secret shapes, not all. For a secret, save where it is kept, never the secret.
- A new `feedback_` record or fact is refused: the type is retired. Save the instruction with `toolkit rule add`, or the fact in a `user_` or `project_` concept.
- A memory save is not a decision for the whole project. Add to `DECISIONS.md` only when the owner asked for such a decision (`work-decide`).
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
| An instruction for how the agent works: a preference, a correction, "from now on", "always", "never" | `.claude/rules/owner-preferences.md` (`~/.claude/rules/` for every project) | "Rules" above |
| A procedure that proved itself | A project skill in `.claude/skills/` | `memory-tidy`, "Promotion" |
| His to-do with no work item and no time | Current focus, Untracked to-dos | step 7 |
| A to-do with a time ("at 9 tomorrow") | A scheduled reminder, outside memory | the host's scheduling tool |
| A project term | The glossary | step 7 |

A short memory pointer to a hard-to-find record is allowed; never copy the record's body.

## Replies

Use these lines word for word, with the record's title, also when the memory line is one part of a longer reply. `toolkit memory save`, `approve`, and `reject` print the filled line ("Reply line for the owner, word for word"): copy it. Every memory reply ends with the next step: the question still waiting for the owner (for example "Save to memory: <one line>?"), or the exact words that continue. Never end on what was not done ("I haven't saved anything.").

- A new record or a new section: "Saved to memory: <title>. Say 'forget that' to undo." For a section, the title is "<heading> (in <concept title>)". His "forget that" right after a section save is the "Undo:" command the save printed.
- An update: "Updated in memory: <title>. Say 'undo that' to put back the old wording." His "undo that" is a save of the old text from the `--json` read, or of the old section text (`previous`) (`references/replacing-and-retiring.md`, section 3). Right after a supersede, the undo is a restore of the old record and a retire of the new one (same file, section 4).
- A removed section: "Removed from memory: <heading> (in <concept title>). Say 'undo that' to put it back."
- A proposal: "Saved as a proposal for your yes or no: <title>."
- A rejected proposal: "Not saved: <title>. I will not suggest it again.", then the next step.
- A retire: "Retired from memory: <title>. Say 'bring it back' to restore it." His "bring it back" is the whole restore in `references/replacing-and-retiring.md`, section 7, not `toolkit memory restore` alone.
- A delete: "Deleted from memory, as you said: '<his words>'. This cannot be undone." For a secret or an email address, add that older backups still hold it (`references/replacing-and-retiring.md`, section 8).
- A failed save: lead with "Not saved: <reason>." Keep the text and try again later in the session. With Hindsight or Notion, the command prints the fix (`references/memory-hindsight.md`, `references/memory-notion.md`).

## Hook reminders

- The UserPromptSubmit hook adds one line when the owner's message holds a keep phrase: "remember that" (or "remember this"), "from now on", "don't ever", "note that", "going forward", "keep in mind", or "Always ..." or "Never ..." at the start of a sentence. It is a reminder: route it with step 1 (an instruction to the rules, a fact to memory).
- The Stop hook blocks once when a keep phrase got no save, work-item change, or decision in the turn. Save it, or say in one line where it went instead.
- Ask in exactly the form "Save to memory: <one line>?" for a fact, or "Add to the project rules: <one line>?" for an instruction (bold is fine). Other wording, such as "Save it to memory?", makes the Stop hook stop the turn once and ask for that form.
- When a reply asks "Save to memory: <summary>?" and no proposal was saved in that turn, the Stop hook tries to save one, and the next turn's context says what happened:
  - It saved a proposal and names its key: his yes approves that key, his no rejects it (`references/proposals.md`, "Recording the owner's answer").
  - Memory already holds a proposal like it, and names it: his answer approves or rejects that proposal.
  - It saved a proposal for an existing concept ("for the concept <key>"): his yes adds the fact to that concept as a section.
  - It saved a rule proposal (an instruction for how the agent works, or the "Add to the project rules" form): his yes, `toolkit memory approve` with the key, adds it to `.claude/rules/owner-preferences.md`; `--section '<area>'` names another section.
  - Memory already holds a record about the same subject, and names it: read it as in step 2. The same fact: keep it, or update it with `--expect`. A different fact and his yes: add it to that concept as a section, or save it with `--allow-similar` and `--approved-by`. Never overwrite a record with a different fact.
  - The text looks like a secret, so nothing was saved: never save it; after his yes, save only where the secret is kept.
  - The save failed: save the proposal yourself in this turn, with `--proposal`.

## References

| File | Open it when |
| --- | --- |
| `references/memory-criteria.md` | Step 1, with Hindsight or Notion memory (built-in projects read `.memory/memory-criteria.md`) |
| `references/record-format.md` | Step 4: choosing the type and key, writing the description and body, passing text in each host |
| `assets/project_topic_template.md` | Step 4: the layout of a concept record (frontmatter, one `##` section per fact with its labels, the last "Gotchas and lessons" section), when a new concept starts or a section's labels are unclear |
| `assets/owner-preferences.md` | Step 1 and "Rules": the layout of the rule file `toolkit rule add` writes (title, one section per area, one dated line per instruction) |
| `references/replacing-and-retiring.md` | Step 5 (exit code 2), step 6, any update, supersede, rename, restore, or delete, and any undo |
| `references/proposals.md` | Asking "Save to memory?", a proposal named in the context, or the owner's answer to one |
| `references/current-focus.md` | Step 7: a to-do or a change to what is happening now |
| `references/glossary.md` | Step 7: a project term |
| `references/memory-builtin.md` | Built-in memory: links, the index, a link-repair report, notes the owner edited in Obsidian |
| `references/memory-hindsight.md` | Hindsight memory: a failed command, the server, how records are stored |
| `references/memory-notion.md` | Notion memory: a failed command, sign-in, Lore's layout, edits made in Notion |
| `references/examples.md` | You want a complete worked example of the case in front of you |
| `references/toolkit-commands.md` | A `toolkit` command fails, is refused by a hook, or you are unsure how to pass text in this host |

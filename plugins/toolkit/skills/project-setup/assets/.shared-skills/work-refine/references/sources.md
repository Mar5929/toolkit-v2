# Reading and saving sources

How to save a meeting transcript, a document, or any other source the owner gives you, how to write its Sources line, and how to turn what it says into requirements and questions.

## 1. Where a source is saved

Save each source before you use it, with the work track skill or, for a Salesforce client file, the `publish-docs` skill.

| Project | Where the file goes |
| --- | --- |
| Local work items | The item's `references/` folder, beside `<ID>.md` |
| Notion work items | Attached to the item's page. Read it back later with the work track skill: the file's address lasts one hour. |
| GitHub Issues work items | A text source as a `## Source:` comment on the item's issue; any other file the owner attaches in the browser |
| Salesforce, a client file (brief, transcript, message, meeting note) | `delivery/` (or `engagement/`), in the folder for that kind of file, as `AGENTS.md` says. Git keeps it, so save it with `publish-docs`. Never copy it into `references/`: that folder is kept out of Git. |

- Text he pastes into the chat: save it first, named `YYYY-MM-DD-<short-name>.md` (for example `2026-09-30-kickoff-transcript.md`), exactly as pasted: in a GitHub Issues project as a `## Source: <name>` comment, in any other project as a file.
- A file he gives you: keep its name. When its name does not say what it is, rename it `YYYY-MM-DD-<short-name>` and keep its extension.
- Never edit a source after saving it. Corrections go in the item.

## 2. The Sources line

One line per source under Notes, "Sources": where it is, what it is, and the IDs it informed. Replace the template's example line with the first real one.

```markdown
- `references/2026-09-30-kickoff-transcript.md`: kickoff meeting transcript, 2026-09-30, Mike and Dana (finance lead). Taken from it: R-01, R-03, Q-02, Q-05.
- `delivery/meeting-notes/2026-10-02-security-workshop.md`: client security workshop notes, 2026-10-02. Taken from it: R-04, Q-09.
```

- Add each ID to "Taken from it" as you use the source.
- Wherever the item uses something from a source, name the source there too: in the `R-xx` Decision record ("From `references/2026-09-30-kickoff-transcript.md`, Dana; confirmed by the owner in Q-04") or in the question.

## 3. Turning a source into the item

- The goal: use it in the first question, "So the goal is ...?"
- A required behavior the owner stated, or one stated clearly by someone else and not disputed: an `R-xx` at Status Refining, citing the source in its Decision record. It is a candidate until the owner approves the requirements.
- Something the source says someone other than the owner decided ("we decided", "let's go with"): a question row asking him to confirm it ("Dana decided refunds show as negative amounts. Keep that?"). This bullet wins over the one above.
- A gap, a vague point, or an unanswered question: a question row, with your recommendation.
- Useful facts that are not requirements: Notes, "Context", citing the source.
- Tell the owner how many requirements and questions the source gave, then ask the first question.

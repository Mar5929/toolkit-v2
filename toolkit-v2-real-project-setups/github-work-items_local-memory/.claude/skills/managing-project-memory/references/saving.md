# Saving

## Before you save

Search for the fact and its synonyms, and read likely records whole.

- Same fact already there: save nothing.
- Something different there: it's a correction (below).
- The subject has a record: add a section to it.
- No record covers the subject: make one, named for the subject.

## Writing

- Each section says what to remember, why it matters, how to apply it, its source and date, and what's uncertain.
- The description states the fact with its dates ("Tom away to 2026-10-20; Sarah covers approvals"), not just the subject. Later sessions see only this line until they open the file.
- Add the evidence to provenance, with its date and where it is.
- If the save changes what's true now, update Current State in the same turn.

## Unchecked claims

Give it its own section in the subject's project record: what was claimed, by whom, the date, "Not checked.", what would check it, and a check-by date. Never state it or act on it as fact. Once checked, move a true claim to its home and remove the section; remove a false one.

## Lessons

While its work item is open, a lesson lives in the work item. Otherwise it goes under "Gotchas and lessons" in the subject's record as one entry with a Seen line of dates; a repeat adds a date, never a second entry. When the evidence is strong, offer it to the owner as a rule. An owner instruction is a rule, not memory; the root `AGENTS.md`, "Where information goes", says where it goes.

## Events, recurring jobs, and shared files

- **Event.** One record per event: date, who, what happened, the result, and where the output is (a source ID, path, work item, or "said in chat only"). Skip it if a work item, task, commit, or filed record already shows it.
- **Recurring job.** One event record: what it is, when it runs, who runs it, the steps or where they are, and a Runs table with one row per run, failures included with the error and fix. Write "not known yet" for missing details. Read the Runs table before running or reporting on the job. Add a Current State line.
- **Shared file.** One reference record: where it is, who shares it, its purpose, and how it's updated. Its updates are a recurring job. Add a Current State line.

## Correcting

Update the record in place with the new evidence and date; don't leave the old wording beside the new. Search other records and Current State for the old value and fix current guidance, keeping dated history. When a fact is replaced rather than refined, make a new record, set the old one's status to `superseded`, and link them both ways.

## Forgetting and deleting

| "Forget that" is about | Do this |
| --- | --- |
| A save you just made | Undo it |
| One older section | Remove the section |
| A whole subject | Retire the record, with the owner's words as the reason |
| A fact kept outside memory | Change it in its home, with its owning skill |

- Delete a record only when the owner says so, and say whether it can be recovered after checking.
- If you find secrets in memory, remove them at once and tell the owner without repeating them.

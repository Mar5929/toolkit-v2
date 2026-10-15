# File a source

Save a source and give it an SRC-### ID so other records can name it. File every source, whether one work item uses it, several do, or none does yet. `sources/AGENTS.md` gives the row format, the file name, what must stay true, and which sources need the owner's answer before filing. Read it before you write.

## Steps

1. Search `sources/INDEX.md` by date, sender, and subject. If the source is already filed, use its ID, add the work item to the row's "Used by" cell, and go to step 6.
2. Decide whether it's kept in `sources/` or outside Git, as `sources/AGENTS.md`, "A source kept outside Git", says. Ask the owner any question that section gives for this source.
3. Take the next SRC number.
4. Save it under the name `sources/AGENTS.md` gives: pasted text as `.md`, a file as a copy with its own extension, an email with attachments as one folder. A source kept outside Git gets no file.
5. Add its row to `sources/INDEX.md`, naming each work item that uses it now under "Used by".
6. Save with `publish-docs` before you use the source. The save reserves the number, and a link to the file works only once it's on the default branch.
7. Write the source's line under Notes, Sources in each work item that uses it, with `managing-work-items`, once `SKILL.md`, "Writing a record's ID in a work item", allows it. The line holds the SRC ID, what the source is, and the IDs of the requirements, questions, and tasks taken from it; the work tracker says whether it also holds the file's web address.
8. Tell the owner the SRC ID, and give it to the skill that asked.

## What to do with what the source says

Filing a source decides and approves nothing. Handle each thing in it:

| The source holds | Do |
| --- | --- |
| A request, an idea, or a bug | A new work item, or a requirement on an open one, in the source's words, with `managing-work-items`. |
| A stated decision, or a question | More than one work item needs it: `record-decision.md`, using its checks to tell a decision from an open question. One work item: `managing-work-items`. |
| A fact about how the system works today | `wiki/reference/current-system/`, as `wiki/reference/AGENTS.md` says. |
| A term and its meaning | `update-system-doc.md`. |
| An action item a named person agreed to | Save it at once, without asking: a task in its work item, or a project task with that person as Who does it, with `managing-work-items`. |
| A date or deadline for current work | Its work item or project task with `managing-work-items`; if it belongs in the project's current state, tell `managing-project-memory`. |
| A lasting fact about a person or the client that fits no row above, or a claim nobody checked | `managing-project-memory`, with the SRC ID and whether the claim was checked. |

## When no work item is open for the source

File it with "none yet" under "Used by", and save its action items and dates as above. Then list for the owner its requests, decisions, and questions that have no record yet, and do each one the owner chooses.

## A corrected version

File it as a new source; `sources/AGENTS.md` says what its row holds. Compare each record under the old row's "Used by" with the correction, and tell the owner what differs.

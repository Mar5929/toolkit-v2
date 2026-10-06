# File a source

Use this file to file every original the project received and keeps, whether it arrived as pasted text or as a file, and whether one work item uses it, several do, or none does yet. A filed original is a source. It gets one ID, SRC-###, and one row in the list `sources/README.md`, so that other records can name it by that ID. The step gives back the original's SRC-###.

`sources/AGENTS.md` gives the form of a row in the list, the file name, what must stay true, and which originals need the owner's answer before they are filed.

An original never goes into the work tracker, where the work items are kept.

## Steps

1. Search `sources/README.md` for the original. Search by its date, who it came from, and its subject.
   - When it is filed already, use its ID, add the work item's ID to the row's "Used by" cell, which lists the records that used the source, and go to step 6.
2. Decide where the original is kept, in `sources/` or outside Git, as `sources/AGENTS.md`, section "An original kept outside Git", says. Ask the owner the question it gives when the original needs it.
3. Take the next SRC number.
4. Save the original under the name `sources/AGENTS.md` gives. Write the short name in lowercase words joined by hyphens.
   - Save pasted text as a `.md` file.
   - Save a file as a copy with its own extension. An email with attachments is one folder.
   - For an original kept outside Git, save no file.
5. Add the row to `sources/README.md`. Its "Used by" cell names each work item that uses the source now.
6. Save with `publish-docs` now, before you use the source. The save claims the number, and a link from Notion or GitHub works only once the file is on the default branch.
7. Add the source's line in each work item that uses it, with `using-work-tracker`. This line is the pointer. `SKILL.md`, section "Every time", says when a pointer can be written. Wait until then.
   - The line goes under Notes, Sources, which is the Sources part of the work item's Notes.
   - The line holds the SRC ID, what the source is, and the IDs taken from it. Those are the IDs of the requirements, questions, and tasks in that work item that came from the source.
   - In Notion and GitHub, the line may add the web address of the file on the default branch.
8. Report the SRC ID to the owner, and give it to the skill that asked for this step.

## What the source says

Filing a source decides nothing and approves nothing. Read the source for what it holds, and send each thing where the table says.

| The source holds | Do |
| --- | --- |
| A request, an idea, or a bug | Make a new work item, or add a requirement to an open one, in the source's words, with `running-work-item-lifecycle`. |
| A decision somebody states, or a question | When more than one work item needs it, record it with `record-decision.md`. Its Status is Open until a person who may decide confirms it. When one work item needs it, hand it to `running-work-item-lifecycle`. |
| A fact about how the system works today | Write it to `reference/current-system/`. `reference/AGENTS.md` says how. |
| A term and its meaning | Add it to the glossary with `update-system-doc.md`, section "A glossary term". |
| An action item: something a named person agreed to do | Hand it to `running-work-item-lifecycle`. Save it at once, with no question. It becomes a task in the work item it belongs to, or a project task with that person as Who does it. A project task is a task that belongs to no work item. |
| A date or a deadline; a fact about a person or the client that fits no row above; a claim nobody checked | Hand it to `curating-project-memory`. With Hindsight memory, follow `.claude/rules/hindsight-memory.md` instead. |

When no work item is open for the source, file it with "none yet" under "Used by". Save its action items and its dates as the table says. Then list for the owner the requests, decisions, and questions it holds that have no record yet, and do each one the owner chooses.

## A corrected version

File a corrected version of an original as a new source. `sources/AGENTS.md` says what its row holds. Then check each record under the old row's "Used by" against the corrected version, and tell the owner what differs.

# File a source

Use this file to save a source and give it an ID, so that other records can name it by that ID. A source is anything the project was given and keeps. It can arrive as pasted text or as a file. File every source, whether one work item uses it, several do, or none does yet. The result of this step is the source's ID, in the form SRC-###.

`sources/AGENTS.md` gives the form of a row in the list of sources, the file name, what must stay true, and which sources need the owner's answer before they are filed. Read it before you write.

The steps are the same whether the project keeps its work items in local files, in Notion, or in GitHub, because a source is never saved where the work items are kept.

## Steps

1. Search `sources/INDEX.md`, the list of sources, for this source. Search by its date, who it came from, and its subject.
   - When the source is filed already, use its ID, add the work item's ID to the row's "Used by" cell, and go to step 6.
2. Decide where the source is kept: in `sources/`, or outside Git. `sources/AGENTS.md`, section "A source kept outside Git", says how to decide. When that section gives a question for this source, ask the owner that question.
3. Take the next SRC number.
4. Save the source under the name that `sources/AGENTS.md` gives. Write the short name in lowercase words joined by hyphens.
   - Save pasted text as a `.md` file.
   - Save a file as a copy with its own extension. An email with attachments is one folder.
   - For a source kept outside Git, save no file.
5. Add the source's row to `sources/INDEX.md`. In its "Used by" cell, name each work item that uses the source now.
6. Save with `publish-docs` now, before you use the source. The save is what makes the number yours, and a link from Notion or GitHub works only once the file is on the default branch.
7. Write the source's line in each work item that uses it, with `managing-work-items`. `SKILL.md`, section "When to write the ID", says when you can write it. Wait until then.
   - The line goes under Notes, Sources.
   - The line holds the SRC ID, what the source is, and the IDs taken from it. Those are the IDs of the requirements, questions, and tasks in that work item that came from the source.
   - In Notion and GitHub, the line may add the web address of the file on the default branch.
8. Tell the owner the SRC ID, and give it to the skill that asked for this step.

## What to do with what the source says

Filing a source decides nothing and approves nothing. Read the source, and do what the table says with each thing in it.

| The source holds | Do |
| --- | --- |
| A request, an idea, or a bug | Make a new work item, or add a requirement to an open one, in the source's words. Use `managing-work-items`. |
| A decision somebody states, or a question | When more than one work item needs it, record it with `record-decision.md`. Use that reference's authority and evidence checks to choose Decided or Open. When one work item needs it, use `managing-work-items`. |
| A fact about how the system works today | Write it in `reference/current-system/`, as `reference/AGENTS.md` says. |
| A term and its meaning | Follow `update-system-doc.md`, section "A glossary term". |
| An action item: something a named person agreed to do | Save it at once, without asking. It is a task in the work item it belongs to, or a project task with that person as Who does it. A project task is a task that belongs to no work item. Use `managing-work-items`. |
| A date or a deadline for current work | Use `managing-work-items` to record it in its work item or project task. With local or Notion memory, also update the installed Current State when the date belongs there. With Hindsight, keep active dates in the tracker. |
| A lasting fact about a person or the client that fits no row above; a claim nobody checked | With local or Notion memory, use `managing-project-memory`. With Hindsight, follow `.claude/rules/hindsight-memory.md` for qualifying lasting knowledge, preserving the source and whether the claim was checked. |

## When no work item is open for the source

1. File the source with "none yet" under "Used by".
2. Save its action items and its dates as the table above says.
3. List for the owner the requests, decisions, and questions in the source that have no record yet. Do each one the owner chooses.

## A corrected version

File a corrected version of a source as a new source. `sources/AGENTS.md` says what its row holds. Then compare each record under the old row's "Used by" with the corrected version, and tell the owner what differs.

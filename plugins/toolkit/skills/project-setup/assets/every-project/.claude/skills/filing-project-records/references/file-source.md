# File a source

For every original the project received and keeps, as pasted text or as a file, whether one work item uses it, several do, or none does yet. The step gives back the original's SRC-###. `sources/AGENTS.md` gives the form of a row in the list, the file name, what must stay true, and which originals need the owner's answer before they are filed. This file gives the steps. They are the same whether work items are local files, in Notion, or in GitHub: an original never goes into the work tracker.

## Steps

1. Search `sources/README.md` for the original: its date, who it came from, and its subject. It is filed already: use its ID, add the work item's ID to the row's "Used by", and go to step 6.
2. Decide where the original is kept, as `sources/AGENTS.md`, "An original kept outside Git", says. Ask the owner the question it gives when the original needs it.
3. Take the next SRC number.
4. Save the original under the name `sources/AGENTS.md` gives, with the short name in lowercase words joined by hyphens.
   - Pasted text: a `.md` file.
   - A file: a copy with its own extension. An email with attachments is one folder.
   - Kept outside Git: save no file.
5. Add the row to `sources/README.md`. "Used by" names each work item that uses the source now.
6. Save with `publish-docs` now, before you use the source. The save claims the number, and a link from Notion or GitHub works only once the file is on the default branch.
7. Once the main checkout holds the save (`SKILL.md`, "Every time"), add the source's line under Notes, Sources in each work item that uses it, with `using-work-tracker`: the SRC ID, what it is, and the IDs taken from it. In Notion and GitHub, the line may add the web address of the file on the default branch.
8. Report the SRC ID to the owner, and give it to the skill that asked for this step.

## What the source says

Filing a source decides nothing and approves nothing. Read the source for what it holds, and send each thing to its skill.

| The source holds | Do |
| --- | --- |
| A request, an idea, or a bug | A new work item, or a requirement in an open one, in the source's words: `running-work-item-lifecycle` |
| A decision somebody states, or a question | More than one work item needs it: `record-decision.md`, as Open until a person who may decide confirms it. One item needs it: `running-work-item-lifecycle` |
| A fact about how the system works today | `reference/current-system/`, as `reference/AGENTS.md` says |
| A term and its meaning | `update-system-doc.md`, "A glossary term" |

When no work item is open for the source, file it with "none yet" under "Used by". Then list for the owner what it holds that has no record yet, and do each one the owner chooses.

## A corrected version

File a corrected version as a new source; `sources/AGENTS.md` says what its row holds. Then check each record under the old row's "Used by" against the corrected version, and tell the owner what differs.

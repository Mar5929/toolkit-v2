# Setup interview details

Open this reference during Step 4 of [SKILL.md](../SKILL.md), before asking the question it explains. The interview table in the entry file gives the question order and where each answer goes. This reference supplies the owner row, choice comparisons, and question-specific actions.


## Project and owner (question 1)

Replace `<Project name>` on the heading lines of the three files. In `PROJECT.md`, "People and ownership", put this row in place of the example row, because the work skills read the owner's name from it:

`| Owner | <owner's name> | Makes the project's decisions | Every decision: requirements, designs, results, merges, and Done | Setup, <YYYY-MM-DD> |`

## Project outcome (question 2)

The sentence is the owner's answer. A sentence that you worked out from the code is only a suggestion, and nothing is written until the owner answers.

## Systems and production (question 4)

Every project is asked this question, because the answer is the base for the project's safety rules: what an agent may change, and where.

## Work tracker choices (question 5)

The three choices:

| Choice | "Tracker" value | Good when | What to know |
| --- | --- | --- | --- |
| Local files | `local` | The project is a solo project on one computer. | Work items are files in `work-items/`, which Git ignores, so they exist only on this computer. They need no sign-in and work offline. The whole project folder opens as an Obsidian vault. |
| Notion | `notion` | The owner wants the board on a phone or on the web. | It needs the Notion command-line tool `ntn`, signed in. |
| GitHub Issues | `github` | The code is already kept on GitHub. | It needs the GitHub command-line tool `gh`, signed in, and a GitHub repository. A work item's ID is its issue number, such as `#12`. |

## Memory choices (question 6)

The three choices:

| Choice | "Memory" value | Good when | What to know |
| --- | --- | --- | --- |
| Local files | `local` | Most projects. | Memory is Markdown files in `memory/`, which Git ignores, so it exists only on this computer. It is private and needs no server. |
| Notion | `notion` | Work items are in Notion, or the owner reads memory on a phone. | Project Wiki holds current context, lasting memory, finalized terms and product documentation. Coding agents capture in Wiki Inbox; a librarian files daily and on demand. It needs `ntn`, signed in. |
| Hindsight | `hindsight` | Search by meaning across the saved records matters. | Memory is in a memory bank on the owner's own Hindsight server. A memory bank is one project's store of memory on that server. The project has no `memory/` folder and no Current State. |

Any mix of the work items choice and the memory choice works, for example work items in Notion with local memory. With local or Hindsight memory, decisions, terms and system documentation remain repository records. With Notion memory, Product Wiki owns finalized product documentation and decisions, Terminology Glossary owns finalized terms, and Long-Term Memory holds other lasting decisions and lessons. Working designs stay with their work items. Sources remain in their configured homes.

After the owner has said where memory is kept, ask about Claude Code's own memory. Claude Code can keep notes of its own in a folder on the owner's computer and load them into every session. The toolkit turns that off, so that the project's memory is kept in one place. Say so, and ask: "Do you want Claude Code's own memory on in this project?"

## Outside tools (question 8)

After the owner's answer, check that each tool is installed and signed in on this computer, and tell the owner what is missing.

## Working with the owner (question 9)

Every project has `SOUL.md`. Fill it with the owner's own words, show the owner the text, and change it until the owner says yes.

## Starting material (question 10)

File each document, link, and note that the owner gives as a source, in the form that the project's `sources/AGENTS.md` gives. Read the material before you ask question 11.

When Step 2 read past work, show the owner the facts that no answer has used yet, and write the ones the owner confirms, as [reference/context-from-past-work.md](context-from-past-work.md), "In Step 4: use what you found", says.

## Project roadmap (question 11)

Work with the owner until you understand the whole roadmap: the phases of the project, what each phase is for, what is already done, which phase the project is in now, and what comes next. A project that is just starting has a roadmap too, even when it holds only the first phase or two. The work starts from the roadmap. Step 6 says where to write it.

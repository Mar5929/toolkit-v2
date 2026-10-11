# What the Notion work items choice adds to a project

This file lists what setup adds to a project that keeps its work items in Notion: the files, the lines in `PROJECT.md`, and the page in the owner's Notion. Steps 2, 3, and 5 of [notion-work-items-setup.md](../notion-work-items-setup.md) use it.

| Kind | What it adds |
| --- | --- |
| Files inside a skill | Copy `choices/work-items/notion/files-to-add/` into the project. It adds four references inside `managing-work-items`: `work-tracker.md` for placement and properties, `work-tracker-page-updates.md` for record procedures, `work-tracker-commands.md` for API calls, and `work-tracker-known-problems.md` for recovery. |
| Skill and rule | Copy `choices/notion-shared/files-to-add/` into the project. It holds the skill `using-notion-cli` and the rule `notion-records.md`. Notion memory brings the same folder, and a project gets it once. |
| Settings | Nothing. |
| `PROJECT.md`, "Toolkit settings" | Write `notion` on the Tracker line. Add two lines below the Memory line: `- Work item ID prefix:` with the prefix, and `- Notion work items:` with the link to the project's page and the ids of its databases as nested bullets. [choices/notion-shared/reference/where-the-notion-links-and-ids-go.md](../../../notion-shared/reference/where-the-notion-links-and-ids-go.md) says how they are written. |
| Outside the project folder | The project's page in the owner's Notion, with its Work Items, Phases, and Tasks databases. It is made only after the owner's yes. |

Step 2 of the setup file copies the files of the first two rows. Step 3 writes `notion` on the Tracker line. Step 5 makes the page in Notion, and writes the two other lines in `PROJECT.md` when the prefix and the ids are known.

## Root guide summary

At setup completion, contribute this sentence to the root `AGENTS.md` summary. [Work tracking and memory summary](../../../../reference/project-store-summary.md) gives placement and verification.

```markdown
Work items are tracked in this repository’s [Notion project](<verified Project page URL>), in its Work Items, Tasks and Phases databases, with `managing-work-items`.
```

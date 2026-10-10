# Work items in Notion

Open this file when the owner answers "Notion" to question 5 of `SKILL.md`. It gives the default to tell the owner, the questions to ask, what the choice adds to the project, and what it needs at the finish. The Notion steps themselves are in `choices/notion-shared/notion-setup.md`, because Notion memory uses the same steps.

The job is done when the project's page and its databases exist in the owner's Notion, the Notion files are in the project, and `PROJECT.md` records the choice, the ID prefix, and the links.

## What the toolkit sets up by default

Tell the owner this in a few plain lines, and ask whether it is what the owner wants.

- The project gets one page in the owner's Notion. The page is a row of the owner's Projects database, made as a copy of the owner's "Project" template.
- That page holds three databases: Work Items, Phases, and Tasks. Each work item is a page in the Work Items database, and the project's phases are rows of the Phases database.
- The owner can read and change the board in the Notion app, on a phone or on the web.
- The agent reaches Notion with the Notion command-line tool, `ntn`, which the owner signs in.

## Questions for the owner

Ask them at the points that `choices/notion-shared/notion-setup.md` gives.

- **Where the project's page goes:** which Projects database gets the project's row. "Where the project page goes" in that file gives the question.
- **The ID prefix.** Propose two to four capital letters from the project's name. Notion allows each prefix in only one database of a workspace.

## What this choice adds to the project

| Kind | What it adds |
| --- | --- |
| Files inside a skill | Copy `choices/work-items/notion/files-to-add/` into the project. It adds the files on how a work item is kept as a Notion page inside `managing-work-items`, which every project has. `references/work-tracker.md` is the one that the skill opens first. |
| Skill and rule | Copy `choices/notion-shared/files-to-add/` into the project. It holds the skill `using-notion-cli` and the rule `notion-records.md`. Notion memory brings the same folder, and a project gets it once. |
| Settings | Nothing. |
| `PROJECT.md`, "Toolkit settings" | Write `notion` on the Tracker line. Add two lines below the Memory line: `- Work item ID prefix:` with the prefix, and `- Notion work items:` with the link to the project's page and the ids of its databases as nested bullets. `choices/notion-shared/notion-setup.md`, "The links in PROJECT.md", says how they are written. |

## Outside the project folder

After the owner's yes, make the project's page in Notion. Follow `choices/notion-shared/notion-setup.md`: the sign-in, the owner's yes, where the project page goes, and which steps to follow.

Those steps remove the part of the page that this project keeps elsewhere and fill the fields of the project's row, so they need the owner's answers to question 6, where memory is kept, and question 7, Salesforce.

## At the finish

- **The project's outcome.** Also write the owner's sentence from question 2 in the "Desired Outcome" field of the project's row in Notion, and read the row back. The page's "Project brief" prompts (Overview/Context, Goals, Success criteria) stay until the owner gives them. List them in the report with the prompts that are left.
- **The roadmap.** Write the project's phases from question 12 as rows of the Phases database. The project's `managing-work-items` skill says how, in `references/work-tracker.md`.
- **Check.** Do the check that starts "For a new project" under "Checks after any of these" in `choices/notion-shared/reference/notion-work-item-pages.md`.
- **The owner's own steps.** `choices/notion-shared/notion-setup.md`, "Sign-in: the owner's step", gives them.

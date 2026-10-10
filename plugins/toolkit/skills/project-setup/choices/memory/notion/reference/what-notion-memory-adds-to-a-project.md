# What the Notion memory choice adds to a project

This file lists what setup adds to a project that keeps its memory in Notion: the files, the change in the settings files, the lines in `PROJECT.md`, and the pages in the owner's Notion. Steps 2, 3, and 5 of [notion-memory-setup.md](../notion-memory-setup.md) use it.

## Everything the choice adds, by kind

| Kind | What it adds |
| --- | --- |
| Skill | Copy `choices/memory/shared-by-local-and-notion/files-to-add/` into the project. It holds the skill `managing-project-memory`: what counts as memory, and how to save, find, and tidy it. |
| Files inside that skill | Copy `choices/memory/notion/files-to-add/` into the project after it. It adds the files on how memory is kept as Notion pages, and two page templates. `references/memory-store.md` is the one that the skill opens first. |
| Skill and rule | Copy `choices/notion-shared/files-to-add/` into the project. It holds the skill `using-notion-cli` and the rule `notion-records.md`. Notion work items bring the same folder, and a project gets it once. |
| Settings | The session-start line names Notion and the "Current state" page. "The settings lines" below gives the change. |
| `PROJECT.md`, "Toolkit settings" | Write `notion` on the Memory line. Add the line `- Notion memory:` at the end of the section, with the ids of the Memory page, its databases, and the "Current state" page as nested bullets. [choices/notion-shared/reference/where-the-notion-links-and-ids-go.md](../../../notion-shared/reference/where-the-notion-links-and-ids-go.md) says how they are written. |
| Outside the project folder | The Memory page with its databases, and the "Current state" page, on the project's page in the owner's Notion. They are made only after the owner's yes. |

Step 2 of the setup file copies the files of the first three rows. Step 3 changes the settings lines and writes `notion` on the Memory line. Step 5 makes the pages in Notion, writes the "Notion memory" line when the ids are known, and puts the id of the "Current state" page in the settings files.

## The settings lines

The settings in the full layout name `local`. Change these two places:

| File | Change |
| --- | --- |
| `.claude/settings.json` | In the session-start hook, the last entry of `args` is `"local"`. Put these three entries in its place: `"notion"`, `"--page"`, `"{{CURRENT_STATE_PAGE_ID}}"`. |
| `.codex/hooks.json` | The session-start command ends with `--memory local`. Make it end with `--memory notion --page {{CURRENT_STATE_PAGE_ID}}`. |

`{{CURRENT_STATE_PAGE_ID}}` stays until the "Current state" page exists. Then put the page's id in its place in both files, as [choices/notion-shared/reference/where-the-notion-links-and-ids-go.md](../../../notion-shared/reference/where-the-notion-links-and-ids-go.md), "The id of the Current state page in the session-start hook", says.

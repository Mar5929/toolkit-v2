# Where the project's Notion links and ids go

This file holds where the links and ids of the project's Notion pages are written: the lines in `PROJECT.md`, and the id of the "Current state" page in the session-start hook. Step 5 of [notion-setup.md](../notion-setup.md) uses it.

## The links in PROJECT.md

The links and ids go on lines that the Notion choices add to `PROJECT.md`, section "Toolkit settings". The setup file of each Notion choice names its lines.

- The prefix goes on the "Work item ID prefix" line.
- The ids go as nested bullets under the "Notion work items" line and under the "Notion memory" line.

[notion-project-pages.md](notion-project-pages.md) and [notion-memory-pages.md](notion-memory-pages.md) each have a section "Recording the links in PROJECT.md" that gives the bullets. After you write the lines, read them back. The Notion skills read every id from these lines. Add no heading to the "Toolkit settings" section.

## The id of the Current state page in the session-start hook

When memory is in Notion, the memory setup also fills the "Current state" page with the project's first lines. The "Current state" page is the Notion page that holds the project's Current State, which is the project's one short page of what is true now. [reference/finishing.md](../../../reference/finishing.md), "The project's Current State", says what the first lines are.

Then put that page's id in the session-start hook:

- Replace `{{CURRENT_STATE_PAGE_ID}}` with the page's id in `.claude/settings.json` and `.codex/hooks.json`.
- Do this before the owner trusts the hooks in Codex, because a changed hook must be trusted again.
- Check that no placeholder is left:

```text
grep -n '{{' .claude/settings.json .codex/hooks.json
```

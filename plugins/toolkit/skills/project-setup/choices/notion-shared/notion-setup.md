# Notion: the steps that work items and memory share

Open this file when `choices/work-items/notion/notion-work-items-setup.md` or `choices/memory/notion/notion-memory-setup.md` sends you here, and when a Notion project is updated. It gives the sign-in, the owner's yes before anything is made in the owner's workspace, where the project's page goes, which Notion steps to follow, and where the links go. Its job is done when the owner is signed in, the project's Notion pages were made only after the owner's yes, and `PROJECT.md` holds the project's Notion links and ids.

The Notion steps themselves are in two other files. `choices/notion-shared/reference/notion-work-item-pages.md` makes the project's page and its work items part, and `choices/notion-shared/reference/notion-memory-pages.md` holds the steps for memory.

Apart from the steps in those two files, setup makes only these Notion calls itself:

- `ntn whoami`;
- the `ntn api v1/search` call in "Where the project page goes";
- the one write of the project's outcome into the project's row, which the two Notion setup files give under "At the finish";
- the one read of the "Current state" page in the check of `choices/memory/notion/notion-memory-setup.md`, "At the finish".

## Contents

- Sign-in: the owner's step
- The owner's yes before anything is made
- Where the project page goes
- Which steps to follow
- The links in PROJECT.md
- Updating a Notion project

## Sign-in: the owner's step

Ask the owner for the sign-in as soon as the owner picks Notion, so that the owner can sign in while the interview goes on.

1. Check the sign-in with `ntn whoami`. It prints the "Notion CLI" connection, the owner's email, and the workspace.
2. When `ntn whoami` says there is no sign-in or token, the owner runs `ntn login` in a terminal. That command opens a browser, where the owner signs in and picks the pages the "Notion CLI" connection may use.
   - Tell the owner so, wait until the owner says it is done, and then run `ntn whoami` again.
   - Never run `ntn login` for the owner, and never ask the owner for a token, a code, or a password.
3. When `ntn` is not installed (`command not found`), ask the owner before you install it, because installing it changes the owner's computer. After the owner's yes, run `npm install -g ntn`.
4. When a call returns 404, the owner shares the owner's Notion root page with "Notion CLI", because the agent can reach only shared pages.

## The owner's yes before anything is made

- Make nothing in the owner's real Notion workspace without the owner's yes. Before you make anything, tell the owner what will be made: this project's pages in the owner's Notion, from the "Project" template in the owner's Projects database. The owner's yes covers only what you named.
- Every Notion project is a copy of the "Project" template in the owner's Projects database. The template is the owner's. When it does not exist, stop and tell the owner: the owner makes it in the Notion app, and the toolkit does not build it.
- When the owner says this project is a test, make its Notion pages only under the test page the owner names. Never make them under the owner's real pages unless the owner says so.

## Where the project page goes

The Notion steps make the project page as a row of the owner's Projects database (`<projects-data-source-id>`), from a template that is kept in that database. Nothing records that database's id yet, so find the id before you follow `choices/notion-shared/reference/notion-work-item-pages.md`:

1. List the data sources named "Projects" that "Notion CLI" can see, with each one's title column and the page that holds its database:

   ```text
   ntn api v1/search -d '{"query":"Projects","filter":{"property":"object","value":"data_source"}}' < /dev/null | jq -r '.results[] | [.id, (.title | map(.plain_text) | join("")), (.properties | to_entries[] | select(.value.type == "title") | .key), (.database_parent.page_id // "")] | @tsv'
   ```

2. Leave out every data source whose title column is `Name`. Such a data source is Lore's Projects database under another project's Memory page. Lore is the name of the Notion memory layout. The owner's Projects database has the title column `Project`.
3. Ask the owner one question, with a recommendation: "I'll add this project as a row of your Projects database (<link>). OK?"
   - Ask the question as a message of its own, before the ID prefix question, and make no project page until the owner answers.
   - The owner's yes to making the pages does not cover which database. A line about the database inside a message that asks something else does not count as asking.
   - When more than one data source is left, list each with its link and ask which one. Recommend the one that holds the owner's other projects.
   - When the owner has no Projects database, stop. Tell the owner that a Notion project needs a Projects database because the template is kept in one, and ask the owner to make one in Notion.
4. Use the id the owner confirms as `<projects-data-source-id>`.

When the owner names a page to put the project under, still run step 1, and keep the Projects data sources whose database is on that page. The last column that step 1 prints is the id of the page that holds the database. Compare the ids without their dashes.

- When one of those data sources has the title column `Project`, ask in the same way, as a message of its own: "I'll add this project as a row of the Projects database on <page>. OK?"
- When that page has no such database, stop. Tell the owner that the page has no Projects database, and ask the owner to make one on that page or to name another page.

## Which steps to follow

Every Notion project is made from the one Projects database template, "Project", which holds both the work items part and the memory part. So follow `choices/notion-shared/reference/notion-work-item-pages.md`, "A new project", whether the project keeps work items, memory, or both in Notion. That section makes the project page, removes the part this project keeps elsewhere, and runs the memory steps in `choices/notion-shared/reference/notion-memory-pages.md` when memory is in Notion.

The steps in `choices/notion-shared/reference/notion-work-item-pages.md` propose the ID prefix from the project name (two to four capital letters) and ask the owner. Notion allows each prefix in only one database of a workspace. When setting the prefix fails with a conflict, propose another prefix.

## The links in PROJECT.md

The links and ids go on three of the fixed lines of `PROJECT.md`, section "Toolkit settings":

- The prefix goes on the "Work item ID prefix" line.
- The ids go as nested bullets under the "Notion work items" line and under the "Notion memory" line.

`choices/notion-shared/reference/notion-work-item-pages.md` and `choices/notion-shared/reference/notion-memory-pages.md` each have a section "Recording the links in PROJECT.md" that gives the bullets. After you write the lines, read them back. The Notion skills read every id from these lines. Add no other line and no heading to the "Toolkit settings" section.

When memory is in Notion, the memory setup also fills the "Current state" page with the project's first lines. The "Current state" page is the Notion page that holds the project's Current State, which is the project's one short page of what is true now. `reference/finishing.md`, "The project's Current State", says what the first lines are.

Then put that page's id in the session-start hook:

- Replace `{{CURRENT_STATE_PAGE_ID}}` with the page's id in `.claude/settings.json` and `.codex/hooks.json`.
- Do this before the owner trusts the hooks in Codex, because a changed hook must be trusted again.
- Check that no placeholder is left:

```text
grep -n '{{' .claude/settings.json .codex/hooks.json
```

## Updating a Notion project

An update changes nothing in Notion. The project's databases, views, and work item template are the owner's.

When a newer skill file names a property or a section that the project's Notion pages do not have, tell the owner in one short list. Change Notion only as the owner says.

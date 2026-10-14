# Where the project's page goes in Notion

This file holds how to find the owner's Projects database, the question to ask the owner about it, and what to do when the owner names a page or has no Projects database. Step 3 of [notion-setup.md](../notion-setup.md) uses it.

The Notion steps make the project page as a row of the owner's Projects database (`<projects-data-source-id>`), from a template that is kept in that database. Nothing records that database's id yet, so find the id before you follow [notion-project-pages.md](notion-project-pages.md):

1. List the data sources named "Projects" that "Notion CLI" can see, with each one's title column and the page that holds its database:

   ```text
   ntn api v1/search -d '{"query":"Projects","filter":{"property":"object","value":"data_source"}}' < /dev/null | jq -r '.results[] | [.id, (.title | map(.plain_text) | join("")), (.properties | to_entries[] | select(.value.type == "title") | .key), (.database_parent.page_id // "")] | @tsv'
   ```

2. Leave out every data source whose title column is `Name`. Such a data source is Lore's Projects database under another project's Long-Term Memory page. Lore is the name of the Notion memory layout. The owner's Projects database has the title column `Project`.
3. Use an existing approval that names the exact database and listed writes. Otherwise, show the destination and ask the owner to approve adding this project as a row of that Projects database.
   - When a question is needed, ask it before the ID prefix question. Make no project page until its listed writes and exact destination are approved.
   - Approval must cover the exact database. A generic yes to making pages does not choose a destination.
   - When the destination is not already confirmed and more than one data source is left, list each with its link and ask which one. Recommend the one that holds the owner's other projects.
   - When the owner has no Projects database, stop. Tell the owner that a Notion project needs a Projects database because the template is kept in one, and ask the owner to make one in Notion.
4. Use the id the owner confirms as `<projects-data-source-id>`.

When the owner names a page to put the project under, still run step 1, and keep the Projects data sources whose database is on that page. The last column that step 1 prints is the id of the page that holds the database. Compare the ids without their dashes.

- When one of those data sources has the title column `Project`, confirm the destination using step 3. For a new approval, show the page and database and ask whether to add this project there.
- When that page has no such database, stop. Tell the owner that the page has no Projects database, and ask the owner to make one on that page or to name another page.

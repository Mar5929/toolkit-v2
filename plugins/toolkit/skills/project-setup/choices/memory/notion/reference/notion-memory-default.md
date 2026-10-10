# How the toolkit sets up Notion memory by default

This file holds how the toolkit sets up memory in Notion when the owner changes nothing. Step 1 of [notion-memory-setup.md](../notion-memory-setup.md) uses it.

Tell the owner this in a few plain lines, and ask whether it is what the owner wants.

- The project's page in the owner's Notion gets a Memory page and a "Current state" page. The project's page is a row of the owner's Projects database, made as a copy of the owner's "Project" template.
- The Memory page holds a set of databases, where each subject is a page. The toolkit calls this layout Lore.
- At the start of each session, the agent is shown only the "Current state" page. It searches the Memory page when it needs something.
- With work items in Notion too, work and memory sit together and link to each other, and the owner can read both on a phone.
- The agent reaches Notion with the Notion command-line tool, `ntn`, which the owner signs in.

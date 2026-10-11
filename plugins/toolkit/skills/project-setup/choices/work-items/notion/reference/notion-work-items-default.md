# How the toolkit sets up Notion work items by default

This file holds how the toolkit sets up work items in Notion when the owner changes nothing. Step 1 of [notion-work-items-setup.md](../notion-work-items-setup.md) uses it.

Tell the owner this in a few plain lines, and ask whether it is what the owner wants.

- The project gets one page in the owner's Notion. The page is a row of the owner's Projects database, made as a copy of the owner's "Project" template.
- Each project page holds its own Work Items, Phases and Tasks databases. New work items use the owner's default template; the agent fills their applicable properties and generated page content.
- Phases organize either the project roadmap or one work item's roadmap. Tasks are steps within a work item or operational and administrative work at project level. Relations identify which work owns each row.
- The owner can read and change the board in the Notion app, on a phone or on the web.
- The agent reaches Notion with the Notion command-line tool, `ntn`, which the owner signs in.

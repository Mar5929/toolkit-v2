# The Notion sign-in

This file holds how to check that the Notion command-line tool, `ntn`, is signed in, what the owner does to sign in, and what to do when `ntn` is not installed or a call cannot reach a page. Step 1 of [notion-setup.md](../notion-setup.md) uses it. The sign-in is the owner's step, so the step for the owner's own steps in [choices/work-items/notion/notion-work-items-setup.md](../../work-items/notion/notion-work-items-setup.md) and in [choices/memory/notion/notion-memory-setup.md](../../memory/notion/notion-memory-setup.md) sends you here too.

Ask the owner for the sign-in as soon as the owner picks Notion, so that the owner can sign in while the interview goes on.

1. Check the sign-in with `ntn whoami`. It prints the "Notion CLI" connection, the owner's email, and the workspace.
2. When `ntn whoami` says there is no sign-in or token, the owner runs `ntn login` in a terminal. That command opens a browser, where the owner signs in and picks the pages the "Notion CLI" connection may use.
   - Tell the owner so, wait until the owner says it is done, and then run `ntn whoami` again.
   - Never run `ntn login` for the owner, and never ask the owner for a token, a code, or a password.
3. When `ntn` is not installed (`command not found`), ask the owner before you install it, because installing it changes the owner's computer. After the owner's yes, run `npm install -g ntn`.
4. When a call returns 404, the owner shares the owner's Notion root page with "Notion CLI", because the agent can reach only shared pages.

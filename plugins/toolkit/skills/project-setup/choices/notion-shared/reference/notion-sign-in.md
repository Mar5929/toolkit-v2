# The Notion sign-in

This file holds how to check that the Notion command-line tool, `ntn`, is signed in, what the owner does to sign in, and what to do when `ntn` is not installed or a call cannot reach a page. Step 1 of [notion-setup.md](../notion-setup.md) uses it. The sign-in is the owner's step, so the step for the owner's own steps in [choices/work-items/notion/notion-work-items-setup.md](../../work-items/notion/notion-work-items-setup.md) and in [choices/memory/notion/notion-memory-setup.md](../../memory/notion/notion-memory-setup.md) sends you here too.

Ask the owner for the sign-in as soon as the owner picks Notion, so that the owner can sign in while the interview goes on.

Follow [ntn-commands.md](../files-to-add/.claude/skills/using-notion-cli/references/ntn-commands.md), "Sign-in and access", for `ntn whoami`, owner login, connection sharing, and inaccessible pages. In Codex, diagnose session access through the CLI skill before asking the owner to sign in again.

When `ntn` is not installed, ask the owner before installing it because installation changes the owner's computer. After the owner's yes, use Notion's current installation instructions for this computer, then verify `ntn whoami`.

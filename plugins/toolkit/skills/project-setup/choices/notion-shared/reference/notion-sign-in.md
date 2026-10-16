# The Notion sign-in

This file holds how to check that the Notion command-line tool, `ntn`, is signed in, what the owner does to sign in and to share pages, and what to do when `ntn` is not installed or a call cannot reach a page. The sign-in and the sharing are the owner's own steps.

Follow [ntn-commands.md](../files-to-add/.claude/skills/using-notion-cli/references/ntn-commands.md), "Sign-in and access", for `ntn whoami`, owner login, connection sharing, and inaccessible pages. In Codex, diagnose session access through the CLI skill before asking the owner to sign in again.

When `ntn` is not installed, ask the owner before installing it because installation changes the owner's computer. After the owner's yes, use Notion's current installation instructions for this computer, then verify `ntn whoami`.

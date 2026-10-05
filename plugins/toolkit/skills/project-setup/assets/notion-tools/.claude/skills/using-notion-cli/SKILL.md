---
name: using-notion-cli
description: 'Shows how to run ntn, Notion''s command-line tool, for the Notion storage skills: sign-in, Codex permissions, the calls every Notion step uses, and fixes for failed calls, so reads and saves in Notion work the first time. Use before any Notion read or write, when ntn will not sign in or cannot find a page, in Codex, and whenever a Notion call fails. Only for projects that keep work or memory in Notion.'
---

# Using the Notion command line

`ntn` is Notion's own command-line tool. `ntn api <path>` calls the Notion API as the "Notion CLI" connection the owner signed in with. This skill says how to run each call. It never says what to store.

## Before your first call in a session

1. In Codex, run every `ntn` call, `ntn whoami` included, as "In Codex" below says.
2. Check that `ntn` is signed in: `ntn whoami`.
3. When it fails, see `references/ntn-commands.md`, "When a call fails".

## Every call

- End every `ntn api` call with `< /dev/null`. Without it, `ntn` waits on standard input, and the call can hang until it times out.
- When a call still hangs, stop only that call: in Claude Code, `TaskStop` with its task id; in Codex, end that command. Never `pkill` or `killall`, because other sessions on this Mac may run the same command.

## In Codex

The Codex sandbox blocks network access and the keychain, so `ntn` fails inside it with a sign-in or network error, even when the owner is signed in.

- Run each `ntn` command as its own escalated command. Keep its `| jq` filter in the same command: `jq` only reads, and the escalation covers the whole line. Never join two `ntn` calls, or an `ntn` call and a file write, with `&&`, `;`, or a loop.
- Ask for escalated permissions (`sandbox_permissions` set to `require_escalated`) with a one-line reason, for example "Read this project's page in Notion." Never change the Codex sandbox mode for the whole session.
- With approvals turned off (`codex exec`), Codex refuses the escalation. Show the owner the exact command, ask him to run it in a terminal, and wait for its output.

## Any Notion write

- A relation, Files, or Tags value you send replaces the whole list. Read the current list first and send it all back with your change.
- Query results come 100 at a time. Read every page of results before you act on them.
- Never remove a database view line or a child page line from a page's text.
- Never apply a template twice to the same page.
- Never apply a template to a template page: it turns the template into a row that shows on the owner's boards.

## Hand-offs

| For | Use |
| --- | --- |
| What to read and save for a work item | `using-work-tracker` |
| What to read and save for project memory | `using-memory-store` |

## References

| File | Open it when |
| --- | --- |
| [references/ntn-commands.md](references/ntn-commands.md) | Writing a call (its shape, a body, properties, rows, page text, templates, ids), signing in, a page cannot be found, or any call fails. |

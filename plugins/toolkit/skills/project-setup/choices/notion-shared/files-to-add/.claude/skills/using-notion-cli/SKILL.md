---
name: using-notion-cli
description: 'Explains how to run ntn for this project''s Notion work and memory records, including sign-in, Codex access, API calls, and failed calls. Use before a Notion read or write through ntn, or when a call fails. This skill applies only when the project keeps work items or memory in Notion.'
---

# Using the Notion command line

Use this skill to run `ntn`, which is Notion's own command-line tool. The goal is that reads and saves in Notion work the first time.

`ntn api <path>` calls the Notion API as the "Notion CLI" connection, which is the connection that the owner signed in with.

This skill says how to run each call. It never says what to store. `managing-work-items` says what to read and save for a work item, and `managing-project-memory` says what to read and save for project memory.

## Before your first call in a session

1. In Codex, run every `ntn` call as the section "In Codex" below says. That instruction includes `ntn whoami`.
2. Check that `ntn` is signed in, with `ntn whoami`.
3. When `ntn whoami` fails, open `references/ntn-commands.md`, section "When a call fails". That section lists each error, what it means, and what to do.

## Every call

- End every `ntn api` call with `< /dev/null`. Without `< /dev/null`, `ntn` waits on standard input, and the call can hang until it times out.
- When a call still hangs, stop only that call.
  - In Claude Code, use `TaskStop` with the call's task id.
  - In Codex, end that command.
  - Never use `pkill` or `killall`, because other sessions on this computer may run the same command.

## In Codex

Follow the active session's network, credential access, and approval settings. Some Codex environments restrict the network or keychain, so a call may report a sign-in error even when the owner is signed in. Diagnose access before asking the owner to sign in again.

- Run each `ntn` command separately. Keep its `| jq` filter in the same command.
- Never join two `ntn` calls, or an `ntn` call and a file write, with `&&`, `;`, or a loop.
- When the active settings require and permit approval, use the host's supported permission mechanism and give a one-line reason, such as "Read this project's page in Notion." When escalation is forbidden, do not request it.
- Never change the Codex sandbox mode for the whole session to get past an access failure.
- When a required call is blocked and no permitted access is available, show the owner the exact command to run in a terminal and wait for its output before doing dependent work.

## Any Notion write

- A value that you send for a relation, for Files, or for Tags replaces the whole list. Read the current list first, and send the whole list back with your change.
- Query results come 100 at a time. Read every page of results before you act on them.
- Never remove the line of a database view or the line of a child page from a page's text.
- Never apply a template twice to the same page.
- Never apply a template to a template page. Applying one turns the template into a row that shows on the owner's boards.

## References

| File | Open it when |
| --- | --- |
| [references/ntn-commands.md](references/ntn-commands.md) | You write a call and need its form, a body, properties, rows, page text, templates, or ids; you need to know about signing in; a page cannot be found; or any call fails. |

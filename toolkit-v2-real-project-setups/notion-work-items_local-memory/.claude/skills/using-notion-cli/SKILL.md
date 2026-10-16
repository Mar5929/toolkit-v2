---
name: using-notion-cli
description: 'How to run ntn, Notion''s command-line tool, for this project''s Notion records: sign-in, call form, page text edits, templates, and failed calls. Use before any Notion read or write through ntn, or when a call fails.'
---

# Using the Notion command line

This skill says how to run each Notion call. It never says what to store: `managing-work-items` and `managing-project-memory` decide that.

## Before your first call in a session

Run `ntn whoami`. If it fails, see `references/ntn-commands.md`, "When a call fails".

## Every call

- End every `ntn api` call with `< /dev/null`, or it waits on standard input and hangs.
- If a call still hangs, stop only that call (Claude Code: `TaskStop` with its task ID). Never use `pkill` or `killall`; other sessions may run the same command.

## Every write

- A relation, Files, or Tags value replaces the whole list. Read the current list and send it back with your change.
- Never remove a database view line or a child page line from a page's text.
- Never apply a template twice to a page, and never to a template page; that turns the template into a row on the owner's boards.

## In Codex

Follow the session's network, credential, and approval settings. A sandboxed session can report a sign-in error even when the owner is signed in, so check access before asking the owner to sign in again.

- Run each `ntn` command on its own, with its `| jq` filter. Never chain `ntn` calls, or an `ntn` call and a file write, with `&&`, `;`, or a loop.
- Request permission through the host's mechanism with a one-line reason when that's allowed; don't when it's forbidden. Never change the sandbox mode for the whole session.
- If a required call is blocked and nothing permitted works, give the owner the exact command to run and wait for its output.

## Where to look

| When you need to… | Read |
| --- | --- |
| Write a call, a body, a query, a page text edit, or a template call; handle sign-in, IDs, or a failed call | `references/ntn-commands.md` |

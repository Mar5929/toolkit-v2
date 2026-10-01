<!-- Shared text from the Toolkit V2 repository (dev/build-shared/notion/notion-access.md), where it is edited. In a project, never edit this copy: "update the toolkit" replaces it. -->

# Reaching Notion: sign-in, sharing, and failures

How the agent reaches the owner's Notion, what only the owner can do, and what to do when a call fails.

## The two tools

| Tool | What it is | When to use it |
| --- | --- | --- |
| `ntn` | Notion's official command-line tool (`ntn api <path>` calls the public Notion API). | Use it first. It works in Claude Code, a terminal, and hooks, and in Codex when each call runs with escalated permissions ("In Codex", below). |
| The Notion connector | Notion's official MCP connector (tools named like `notion-fetch`). | Only when `ntn` cannot run in this session and the connector is in the session and signed in. Not tested in Codex. |

Every step here is written for `ntn`; the data model and the rules are the same for the connector (`notion-fetch` reads, `notion-query-data-sources` finds rows, `notion-create-pages` creates, `notion-update-page` changes). Check `ntn` is ready with `ntn whoami`: it prints the connection ("Notion CLI", a bot), the owner's email, and the workspace.

## Sign-in: always the owner's step

- `ntn login` opens a browser, where the owner signs in and picks the pages the "Notion CLI" connection may use. Only the owner can do this. Ask him to run it in a terminal, then wait. Never ask him for a token, a code, or a password.
- Nothing in Notion can be read or created before the sign-in.

## Which pages the agent can reach

The "Notion CLI" connection sees only the pages the owner shared with it at sign-in, and everything under them. A page it cannot see returns 404 `object_not_found`, even when the page exists. The fix is the owner's: in the Notion app, open the page, choose "…" → Connections, and add "Notion CLI". Share the project's parent page once and every project under it is reachable.

## In Codex

The Codex sandbox blocks network access and the keychain, so `ntn` fails inside it with a sign-in or network error, even when the owner is signed in.

- Run each `ntn` command as its own escalated command. Keep its `| jq` filter in the same command: `jq` only reads, and the escalation covers the whole line. Never join two `ntn` calls, or an `ntn` call and a file write, with `&&`, `;`, or a loop.
- Ask for escalated permissions (`sandbox_permissions` set to `require_escalated`) with a one-line reason, for example "Read this project's page in Notion." Never change the Codex sandbox mode for the whole session.
- With approvals turned off (`codex exec`), Codex refuses the escalation: show the owner the exact command, ask him to run it in a terminal, and wait for its output.

## Where the project's Notion links are

`PROJECT.md`, section "Toolkit settings", holds every id this skill needs: the project page, each database and data source, the Projects database, the "Current state" page, and the Work Items ID prefix. Read them from there; never search the workspace for them.

## When a call fails

`ntn api` prints the error and exits with a non-zero code. Nothing was changed unless the error says otherwise.

| Error | Meaning | What to do |
| --- | --- | --- |
| 401 `unauthorized`, "no auth token", "ntn login" | Not signed in, or the sign-in expired. In Codex, the call may have run inside the sandbox. | Tell the owner to run `ntn login`. Stop and wait. In Codex, first run the same call again with escalated permissions; ask for `ntn login` only if it still fails. |
| 404 `object_not_found` | The page is not shared with "Notion CLI", or the id is wrong. | Check the id in `PROJECT.md`. If it is right, ask the owner to share the page (above). |
| 400 `validation_error` | The request body is wrong: a property name, an option, or an `old_str` that does not match the page text. | Read the page or data source again, fix the body, retry once. |
| 409 `conflict_error` | Two writes at once, or an ID prefix already used in the workspace. | Two writes at once: wait 5 seconds, then retry once. A prefix already used: propose another prefix to the owner and wait for his yes. |

## Limits

One text piece holds at most 2,000 characters; a long property value is split into pieces. `ntn api <path> --docs < /dev/null` prints the official page for one endpoint, and `ntn api ls < /dev/null` lists every endpoint (API reference: https://developers.notion.com/reference/intro).

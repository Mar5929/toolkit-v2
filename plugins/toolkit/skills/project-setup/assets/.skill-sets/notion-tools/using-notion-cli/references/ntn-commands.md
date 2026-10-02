# Running ntn

How to reach the owner's Notion with `ntn`, the shape of every call, how to read and change page text, and what to do when a call fails.

## Contents

- Access and sign-in
- One call
- Sending a body
- Filling a body from an asset
- Reading properties
- Finding rows
- Reading and changing page text
- Waiting for a template
- Database templates
- Ids
- When a call fails
- Limits

## Access and sign-in

- `ntn whoami` prints the connection ("Notion CLI", a bot), the owner's email, and the workspace.
- `ntn login` opens a browser, where the owner signs in and picks the pages the "Notion CLI" connection may use. Only the owner can do this. Ask him to run it in a terminal, then wait. Never ask him for a token, a code, or a password. Nothing in Notion can be read or created before the sign-in.
- The connection sees only the pages the owner shared with it at sign-in, and everything under them. A page it cannot see returns 404 `object_not_found`, even when the page exists. The fix is the owner's: in the Notion app, open the page, choose "…" → Connections, and add "Notion CLI". Sharing the project's parent page once reaches every project under it.
- `ntn` works in Claude Code, a terminal, and hooks, and in Codex when each call runs with escalated permissions (`SKILL.md`, "In Codex").
- The Notion connector (tools named like `notion-fetch`) is for when `ntn` cannot run in this session and the connector is signed in. Every step is written for `ntn`. The data model is the same: `notion-fetch` reads, `notion-query-data-sources` finds rows, `notion-create-pages` creates, and `notion-update-page` changes. It is not tested in Codex.

## One call

```bash
ntn api v1/pages/<page-id> < /dev/null                        # GET: read
ntn api v1/pages/<page-id> -X PATCH -d @body.json < /dev/null # change
ntn api v1/pages -d @body.json < /dev/null                    # POST: create (a body makes it a POST)
```

- The path starts with `v1/`. `-X` sets the method. With a body and no `-X`, the method is POST.
- `ntn` prints the JSON answer. Pipe it to `jq` to pick what you need (`jq` is on every Mac: `/usr/bin/jq`).

## Sending a body

Write the body to a file in a scratch folder outside the project (`mktemp -d`; in Claude Code, a folder inside the session scratchpad when your system prompt names one). Send it with `-d @file`, and remove the folder after you read the result back.

A body with no single quote (') in its text can be inline JSON in single quotes:

```bash
ntn api v1/pages/<page-id> -X PATCH -d '{"properties":{"Priority":{"select":{"name":"high"}}}}' < /dev/null
```

Property names in a page or query body may be the names shown in Notion ("Waiting on", "Parent item"). A view's group-by and column settings need property ids. In JSON text, `"` is written `\"` and a backslash `\\`.

## Filling a body from an asset

The bodies in a storage skill's `assets/schema/` hold `{{PLACEHOLDERS}}`:

| Placeholder | Value | Where it is |
| --- | --- | --- |
| `{{WORK_ITEMS_DS}}`, `{{PHASES_DS}}`, `{{TASKS_DS}}` | The Work Items, Phases, Tasks data sources | `PROJECT.md`, "Toolkit settings" |
| `{{WORK_ITEMS_DB}}`, `{{PHASES_DB}}`, `{{TASKS_DB}}` | The same databases | `PROJECT.md` |
| `{{MEMORIES_DS}}`, `{{ENTITIES_DS}}`, `{{LORE_PROJECTS_DS}}`, `{{LORE_TOPICS_DS}}`, `{{MEMORIES_DB}}` | Lore's databases | `PROJECT.md` (memory lines) |
| `{{CURRENT_STATE_PAGE_ID}}`, `{{GLOSSARY_PAGE_ID}}` | Those pages | `PROJECT.md` |
| `{{PROJECT_PAGE_ID}}`, `{{MEMORY_PAGE_ID}}` | The template or project page, and its Memory page, being built | The page you just made (setup) |
| `{{ITEM_PAGE_ID}}`, `{{AFTER_BLOCK_ID}}` | The work item template, and the block a view goes after | The template build (setup) |
| `{{P_<NAME>}}`, `{{PH_<NAME>}}`, `{{T_<NAME>}}`, `{{M_<NAME>}}` | The id of a property of Work Items (P), Phases (PH), Tasks (T), or Memories (M). `<NAME>` is the property's name in capitals with spaces turned into underscores: "Waiting on" is `{{P_WAITING_ON}}`. | The command below |

List a database's property ids:

```bash
ntn api v1/data_sources/<data-source-id> < /dev/null | jq -r '.properties | to_entries[] | "\(.key)\t\(.value.id)"'
```

Copy the asset to the scratch folder and replace every placeholder with its value. Remove a top-level `"note"` field if the asset has one: it explains the file and is not part of the request. Check that no `{{` is left (`grep -c '{{' body.json` prints 0), then send it. A property id may hold characters such as `%3B`: copy it exactly.

## Reading properties

`ntn api v1/pages/<page-id> < /dev/null` returns `.properties`, and the page's own id and link as `.id` and `.url`. Pipe it to `jq` to pick what you need. Relations come back as page ids: read the page to get its ID and title.

## Finding rows

```bash
ntn api v1/data_sources/<data-source-id>/query -d '{"filter": …, "sorts": […], "page_size": 100}' < /dev/null
```

- The answer's `.results` are the rows (pages). More than 100 rows come in pages (`SKILL.md`, "Gotchas").
- A filter names a property and a condition, for example `{"property":"ID","unique_id":{"equals":31}}`, `{"property":"Status","status":{"equals":"In Progress"}}`, `{"property":"Parent item","relation":{"contains":"<page-id>"}}`, or `{"property":"Archived","checkbox":{"equals":false}}`. Combine them with `{"and":[…]}` or `{"or":[…]}`.

## Reading and changing page text

Read the page as Notion markdown:

```bash
ntn api v1/pages/<page-id>/markdown < /dev/null | jq -r .markdown
```

What the text looks like:

- Each block is one line. There are no blank lines.
- A literal `<` `>` `|` `*` `$` is written with a backslash: `\<Goal\>`.
- A line break inside one block is `<br>`.
- A table is `<table header-row="true">` with one `<td>` per line.
- A toggle heading is `## Questions and Answers {toggle="true"}`. Its contents are indented with one tab, except the lines of a table's rows (`<tr>`, `<td>`, `</tr>`), which have no tab.
- A view of a database inside the page is one line, `<database url="…" …>Title</database>`. A child page is `<page url="…">Title</page>`. Never remove these lines.

Change text with exact replacements, built from a fresh read:

```bash
ntn api v1/pages/<page-id>/markdown -X PATCH -d @edit.json < /dev/null
```

```json
{"type": "update_content",
 "update_content": {"content_updates": [
   {"old_str": "**Blockers:** \\<Blocking decision or dependency, or \"None.\"\\>",
    "new_str": "**Blockers:** None."}
 ]}}
```

- `old_str` must match the page text exactly once, as read, backslashes included (in JSON each `\` is written `\\`). When it matches nothing or more than once, Notion refuses and nothing changes: read the page again, then copy `old_str` again or add nearby text to it until it matches once.
- Several replacements in one call are applied in order. Notion saves all of them or none of them.
- After the call, read the page again and check the new text is there.

## Waiting for a template

A page made or changed with `"template"` is filled in the background: the answer comes back before the content is there. Check every 5 seconds until the page has its blocks:

```bash
ntn api v1/blocks/<page-id>/children page_size==100 < /dev/null | jq '.results | length'
```

A work item made from the template has more than 20 blocks. A project page made from a project template shows its databases as `child_database` blocks. Stop checking after two minutes and tell the owner the template did not finish. Never apply a template twice to the same page.

## Database templates

List a database's templates, with the default one marked:

```bash
ntn api v1/data_sources/<data-source-id>/templates < /dev/null | jq -r '.templates[] | "\(.id)\t\(.is_default)\t\(.name)"'
```

A page made with `"template":{"type":"default"}` gets the default template. Notion refuses it when the database has no default. Only the Notion app can make a template or set the default. Never apply a template to a template (`template_id` on a template page): it turns the template into a row that shows on the owner's boards.

## Ids

Notion accepts an id with or without dashes. A page link (`https://app.notion.com/p/<title>-<32 hex characters>`) holds the id as its last 32 characters. A database and its data source have different ids:

```bash
ntn api v1/databases/<database-id> < /dev/null | jq -r '.data_sources[0].id'
```

## When a call fails

`ntn api` prints the error and exits with a non-zero code. Nothing was changed unless the error says otherwise.

| Error | Meaning | What to do |
| --- | --- | --- |
| 401 `unauthorized`, "no auth token", "ntn login" | Not signed in, or the sign-in expired. In Codex, the call may have run inside the sandbox. | Tell the owner to run `ntn login`. Stop and wait. In Codex, first run the same call again with escalated permissions, and ask for `ntn login` only if it still fails. |
| 404 `object_not_found` | The page is not shared with "Notion CLI", or the id is wrong. It does not mean the page is gone. | Check the id in `PROJECT.md`. When it is right, ask the owner to share the page (see "Access and sign-in"). |
| 400 `validation_error` | The request body is wrong: a property name, an option, or an `old_str` that does not match the page text. | Read the page or data source again, fix the body, and retry once. |
| 409 `conflict_error` | Two writes at once. | Wait 5 seconds, then retry once. |

## Limits

One text piece holds at most 2,000 characters. A long property value is split into pieces. `ntn api <path> --docs < /dev/null` prints the official page for one endpoint, and `ntn api ls < /dev/null` lists every endpoint (API reference: https://developers.notion.com/reference/intro).

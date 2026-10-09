# Running ntn

This file says how to reach the owner's Notion with `ntn`, gives the form of every call, says how to read and change page text, and says what to do when a call fails. Open it when you write a call, when you need to know about signing in, when a page cannot be found, or when a call fails.

## Contents

- Access and sign-in
- One call
- Sending a body
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
- `ntn login` opens a browser, where the owner signs in and picks the pages that the "Notion CLI" connection may use.
  - Only the owner can sign in. Ask the owner to run `ntn login` in a terminal, and then wait.
  - Never ask the owner for a token, a code, or a password.
  - Nothing in Notion can be read or created before the sign-in.
- The connection sees only the pages that the owner shared with it at sign-in, and everything under those pages. A page that the connection cannot see returns 404 `object_not_found`, even when the page exists.
  - Only the owner can fix that error. In the Notion app, the owner opens the page, chooses "…" → Connections, and adds "Notion CLI".
  - Sharing the project's parent page once reaches every project under it.
- `ntn` works in Claude Code, in a terminal, and in hooks. It works in Codex when each call runs with escalated permissions, as `SKILL.md`, section "In Codex", says.
- The Notion connector, whose tools have names like `notion-fetch`, is for a session in which `ntn` cannot run and the connector is signed in.
  - Every step is written for `ntn`. The data model is the same: `notion-fetch` reads, `notion-query-data-sources` finds rows, `notion-create-pages` creates, and `notion-update-page` changes.
  - The connector is not tested in Codex.

## One call

```bash
ntn api v1/pages/<page-id> < /dev/null                        # GET: read
ntn api v1/pages/<page-id> -X PATCH -d @body.json < /dev/null # change
ntn api v1/pages -d @body.json < /dev/null                    # POST: create (a body makes it a POST)
```

- The path starts with `v1/`.
- `-X` sets the method. With a body and no `-X`, the method is POST. A body is the JSON text that a call sends.
- `ntn` prints the JSON answer. Pipe the answer to `jq` to pick what you need. `jq` is on every Mac, at `/usr/bin/jq`.

## Sending a body

Write the body to a file in a temporary folder outside the project. Make the folder with `mktemp -d`. In Claude Code, use a folder inside the session scratchpad when your system prompt names one. Send the body with `-d @file`, and remove the folder after you read the result back.

A body with no single quote (') in its text can be inline JSON in single quotes:

```bash
ntn api v1/pages/<page-id> -X PATCH -d '{"properties":{"Priority":{"select":{"name":"high"}}}}' < /dev/null
```

- Property names in the body of a page call or a query may be the names that Notion shows, such as "Waiting on" and "Parent item".
- In JSON text, `"` is written `\"`, and a backslash is written `\\`.

## Reading properties

`ntn api v1/pages/<page-id> < /dev/null` returns `.properties`, and the page's own id and link as `.id` and `.url`. Pipe the answer to `jq` to pick what you need. A relation comes back as page ids. To get the ID and the title of a related page, read that page.

## Finding rows

```bash
ntn api v1/data_sources/<data-source-id>/query -d '{"filter": …, "sorts": […], "page_size": 100}' < /dev/null
```

- The answer's `.results` are the rows, and each row is a page.
- More than 100 rows come in pages, as `SKILL.md`, section "Any Notion write", says. When `has_more` is true, send the same query again with `"start_cursor": "<next_cursor>"`.
- A filter names a property and a condition, for example `{"property":"ID","unique_id":{"equals":31}}`, `{"property":"Status","status":{"equals":"In Progress"}}`, `{"property":"Parent item","relation":{"contains":"<page-id>"}}`, or `{"property":"Archived","checkbox":{"equals":false}}`. Combine filters with `{"and":[…]}` or `{"or":[…]}`.

## Reading and changing page text

This call reads the page as Notion markdown:

```bash
ntn api v1/pages/<page-id>/markdown < /dev/null | jq -r .markdown
```

The text looks like this:

- Each block is one line. There are no blank lines.
- A literal `<` `>` `|` `*` `$` is written with a backslash: `\<Goal\>`.
- A line break inside one block or one table cell is `<br>`.
- A table is `<table header-row="true">`, with one `<td>` on each line.
- A toggle heading is `# Questions and Answers {toggle="true"}`. Its contents are indented with one tab. The lines of a table's rows (`<tr>`, `<td>`, `</tr>`) are the exception: they have no tab.
- A toggle is a `<details>` line, a `<summary>…</summary>` line with its title, its contents indented with one tab, and a `</details>` line.
- A callout is a `<callout icon="…" color="…">` line, its text indented with one tab, and a `</callout>` line.
- A view of a database inside the page is one line, `<database url="…" …>Title</database>`. A child page is `<page url="…">Title</page>`. Before you change a page that holds either line, read `SKILL.md`, section "Any Notion write", which says never to remove them.

Change text with exact replacements, built from a read that you just made:

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

- `old_str` must match the page text exactly once, as you read it, backslashes included. In JSON, each `\` is written `\\`.
- When `old_str` matches nothing, or matches more than once, Notion refuses the call and nothing changes. Read the page again. Then copy `old_str` again, or add nearby text to it, until it matches once.
- Inside a table, end `old_str` and `new_str` the same way: when `old_str` ends with `\n`, `new_str` ends with `\n` too. Calls that did not end both the same way lost everything after the table, with no error from Notion. The cause is not confirmed.
- Several replacements in one call are applied in order. Notion saves all of them or none of them.
- After the call, read the page again, and check that the new text is there.

## Waiting for a template

A page that is made or changed with `"template"` is filled in the background: the answer comes back before the content is on the page. Check every 5 seconds until the page has its blocks:

```bash
ntn api v1/blocks/<page-id>/children page_size==100 < /dev/null | jq '.results | length'
```

- A work item that is made from the template has more than 20 blocks.
- A project page that is made from a project template shows its databases as `child_database` blocks.
- Stop checking after two minutes, and tell the owner that the template did not finish.

## Database templates

This call lists a database's templates, with the default one marked:

```bash
ntn api v1/data_sources/<data-source-id>/templates < /dev/null | jq -r '.templates[] | "\(.id)\t\(.is_default)\t\(.name)"'
```

- A page that is made with `"template":{"type":"default"}` gets the default template. Notion refuses the call when the database has no default template.
- Only the Notion app can make a template or set the default template.
- `template_id` applies a template. Before you send it, read `SKILL.md`, section "Any Notion write", which says when a template must not be applied.

## Ids

- Notion accepts an id with or without dashes.
- A page link (`https://app.notion.com/p/<title>-<32 hex characters>`) holds the id as its last 32 characters.
- A database and its data source have different ids. This call prints the id of a database's data source:

```bash
ntn api v1/databases/<database-id> < /dev/null | jq -r '.data_sources[0].id'
```

## When a call fails

`ntn api` prints the error and exits with a non-zero code. Nothing was changed unless the error says otherwise.

| Error | Meaning | What to do |
| --- | --- | --- |
| 401 `unauthorized`, "no auth token", "ntn login" | `ntn` is not signed in, or the sign-in expired. In Codex, the call may have run inside the sandbox. | Tell the owner to run `ntn login`. Stop and wait. In Codex, first run the same call again with escalated permissions, and ask for `ntn login` only if it still fails. |
| 404 `object_not_found` | The page is not shared with "Notion CLI", or the id is wrong. The error does not mean that the page is gone. | Check the id in `PROJECT.md`. When the id is right, ask the owner to share the page, as "Access and sign-in" says. |
| 400 `validation_error` | The request body is wrong: a property name, an option, or an `old_str` that does not match the page text. | Read the page or the data source again, fix the body, and retry once. |
| 409 `conflict_error` | Two writes happened at once. | Wait 5 seconds, and then retry once. |

## Limits

- One text piece holds at most 2,000 characters. A long property value is split into pieces.
- `ntn api <path> --docs < /dev/null` prints the official page for one endpoint.
- `ntn api ls < /dev/null` lists every endpoint. The API reference is at https://developers.notion.com/reference/intro.

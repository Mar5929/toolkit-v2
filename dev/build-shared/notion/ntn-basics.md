<!-- Shared text from the Toolkit V2 repository (dev/build-shared/notion/ntn-basics.md), where it is edited. In a project, never edit this copy: "update the toolkit" replaces it. -->

# ntn basics: the calls every Notion step uses

The exact shape of an `ntn api` call, how to send a body, how to read
properties and page text, and how to change page text without losing
anything.

## Contents

One call, sending a body, filling a body from an asset, reading a page's properties, finding rows, reading and changing page text, waiting for a template, database templates, ids.

## One call

```bash
ntn api v1/pages/<page-id> < /dev/null                        # GET: read
ntn api v1/pages/<page-id> -X PATCH -d @body.json < /dev/null # change
ntn api v1/pages -d @body.json < /dev/null                    # POST: create (a body makes it a POST)
```

- The path starts with `v1/`. `-X` sets the method; with a body and no
  `-X` the method is POST.
- `ntn api` reads a request body from standard input when standard input
  is not a terminal, and waits until it closes, even with `-d`. In an
  agent's shell a call can hang until it times out. End every `ntn api`
  call with `< /dev/null`:
  `ntn api v1/blocks/<id>/children page_size==100 < /dev/null | jq ...`.
- If a call still hangs, stop only that call: in Claude Code, `TaskStop`
  with its task id; in Codex, end that command. Never `pkill` or `killall`
  by a pattern: other sessions on this Mac may run the same command.
- `ntn` prints the JSON answer. Pipe it to `jq` to pick what you need
  (`jq` is on every Mac: `/usr/bin/jq`).

## Sending a body

Write the body to a file in a scratch folder outside the project (`mktemp -d`; in Claude Code, a folder inside the session scratchpad when your system prompt names one). Send it with `-d @file`, and remove the folder after you read the result back.
A body with no single quote (') in its text can be inline JSON in single
quotes:

```bash
ntn api v1/pages/<page-id> -X PATCH -d '{"properties":{"Priority":{"select":{"name":"high"}}}}' < /dev/null
```

Property names in a page or query body may be the names shown in Notion
("Waiting on", "Parent item"). A view's group-by and column settings need
property ids ("Filling a body from an asset", below). Text in JSON escapes `"` as `\"` and a backslash as `\\`.

## Filling a body from an asset

Bodies kept in a skill's `assets/` hold `{{PLACEHOLDERS}}`:

| Placeholder | Value | Where it is |
| --- | --- | --- |
| `{{WORK_ITEMS_DS}}`, `{{PHASES_DS}}`, `{{TASKS_DS}}` | Work Items, Phases, Tasks data sources | `PROJECT.md` "Toolkit settings" |
| `{{WORK_ITEMS_DB}}`, `{{PHASES_DB}}`, `{{TASKS_DB}}` | The same databases | `PROJECT.md` |
| `{{MEMORIES_DS}}`, `{{ENTITIES_DS}}`, `{{LORE_PROJECTS_DS}}`, `{{LORE_TOPICS_DS}}`, `{{MEMORIES_DB}}` | Lore's databases | `PROJECT.md` (memory lines) |
| `{{CURRENT_STATE_PAGE_ID}}`, `{{GLOSSARY_PAGE_ID}}` | Those pages | `PROJECT.md` |
| `{{PROJECT_PAGE_ID}}`, `{{MEMORY_PAGE_ID}}` | The template or project page, and its Memory page, being built | The page you just made (setup) |
| `{{ITEM_PAGE_ID}}`, `{{AFTER_BLOCK_ID}}` | The work item template, and the block a view goes after | The template build (setup) |

Also:

- `{{P_<NAME>}}`, `{{PH_<NAME>}}`, `{{T_<NAME>}}`, `{{M_<NAME>}}`: the id of
  a property of Work Items (P), Phases (PH), Tasks (T), or Memories (M).
  `<NAME>` is the property's name in capitals with spaces turned into
  underscores: "Waiting on" is `{{P_WAITING_ON}}`. List them with:

  ```bash
  ntn api v1/data_sources/<data-source-id> < /dev/null | jq -r '.properties | to_entries[] | "\(.key)\t\(.value.id)"'
  ```

Copy the asset to the scratch folder, replace every placeholder with its
value, remove a top-level `"note"` field if the asset has one (it explains
the file and is not part of the request), check no `{{` is left
(`grep -c '{{' body.json` prints 0), then send it. A property id may hold
characters such as `%3B`; copy it exactly.

## Reading a page's properties

`ntn api v1/pages/<page-id> < /dev/null` returns `.properties`, and the page's own id and link as `.id` and `.url`. Pipe it to `jq` to pick what you need. Relations come back as page ids.

## Finding rows

```bash
ntn api v1/data_sources/<data-source-id>/query -d '{"filter": …, "sorts": […], "page_size": 100}' < /dev/null
```

- The answer's `.results` are the rows (pages). When `.has_more` is true,
  send the same body with `"start_cursor": "<next_cursor>"` for the next
  page.
- Filters name a property and a condition, for example
  `{"property":"ID","unique_id":{"equals":31}}`,
  `{"property":"Status","status":{"equals":"In Progress"}}`,
  `{"property":"Parent item","relation":{"contains":"<page-id>"}}`,
  `{"property":"Archived","checkbox":{"equals":false}}`. Combine with
  `{"and":[…]}` or `{"or":[…]}`.

## Reading and changing page text

Read the page as Notion Markdown:

```bash
ntn api v1/pages/<page-id>/markdown < /dev/null | jq -r .markdown
```

What the text looks like:

- Each block is one line; there are no blank lines.
- A literal `<` `>` `|` `*` `$` is written with a backslash: `\<Goal\>`.
- A line break inside one block is `<br>`.
- A table is `<table header-row="true">` with one `<td>` per line.
- A toggle heading is `## Questions and Answers {toggle="true"}`; its
  contents are indented with one tab, except the lines of a table's rows
  (`<tr>`, `<td>`, `</tr>`), which have no tab.
- A view of a database inside the page is one line
  `<database url="…" …>Title</database>`; a child page is
  `<page url="…">Title</page>`. Never remove these lines.

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

- `old_str` must match the page text exactly once (as read, backslashes included; in JSON each `\` is written `\\`). If it matches nothing or more than once, Notion refuses and nothing changes: read the page again, and copy `old_str` again or add nearby text to it until it matches once.
- Several replacements in one call are applied in order; Notion saves all
  of them or none of them.
- Never use `replace_content` on a work item page: it rewrites the whole
  page and refuses to run while database views are in it.
- After the call, read the page again and check the new text is there.

## Waiting for a template to finish

A page made or changed with `"template"` is filled in the background: the
answer comes back before the content is there. Check every 5 seconds
until the page has its blocks:

```bash
ntn api v1/blocks/<page-id>/children page_size==100 < /dev/null | jq '.results | length'
```

A work item from the template has more than 20 blocks; a project page from
a project template shows its databases as `child_database` blocks. Stop
checking after two minutes and tell the owner the template did not finish.
Never apply a template twice to the same page.

## Database templates

A database's templates, with the default one marked
(https://developers.notion.com/reference/list-data-source-templates):

```bash
ntn api v1/data_sources/<data-source-id>/templates < /dev/null | jq -r '.templates[] | "\(.id)\t\(.is_default)\t\(.name)"'
```

A page made with `"template":{"type":"default"}` gets the default template;
Notion refuses it when the database has no default. Only the Notion app can
make a template or set the default. Never apply a template to a template
(`template_id` on a template page): it turns the template into a row that
shows on the owner's boards.

## Ids

Notion accepts an id with or without dashes, and a page link (`https://app.notion.com/p/<title>-<32 hex characters>`) holds the id as its last 32 characters. A database and its data source have different ids: `ntn api v1/databases/<database-id> < /dev/null | jq -r '.data_sources[0].id'`.

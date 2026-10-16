# Running ntn

## Sign-in and access

- `ntn whoami` prints the connection ("Notion CLI"), the owner's email, and the workspace.
- Only the owner can sign in: ask them to run `ntn login` in a terminal, then wait. Never ask for a token, code, or password.
- The connection sees only the pages the owner shared at sign-in, and everything under them. A page it can't see returns 404 `object_not_found` even though it exists. The owner fixes that in the Notion app: the page's "…" menu → Connections → add "Notion CLI". Sharing the Projects database, or the page that holds it, once covers every project in it.
- When `ntn` can't run in a session, the Notion connector (`notion-fetch`, `notion-query-data-sources`, `notion-create-pages`, `notion-update-page`) uses the same data model. It's untested in Codex.

## One call

```bash
ntn api v1/pages/<page-id> < /dev/null                        # read
ntn api v1/pages/<page-id> -X PATCH -d @body.json < /dev/null # change
ntn api v1/pages -d @body.json < /dev/null                    # create (a body makes it a POST)
```

- Paths start with `v1/`. Pipe the JSON answer to `jq` (or Python if `jq` is missing).
- Write a body to a file in a temporary folder outside the project (`mktemp -d`, or the session scratchpad), send it with `-d @file`, and delete the folder after reading the result back. A body with no single quote can go inline in single quotes.
- Property names can be the names Notion shows, such as "Waiting on".
- A relation comes back as page IDs; read the related page for its title.

## Finding rows

```bash
ntn api v1/data_sources/<data-source-id>/query -d '{"filter": …, "sorts": […], "page_size": 100}' < /dev/null
```

`.results` are the rows, at most 100 per call. When `has_more` is true, repeat with `"start_cursor": "<next_cursor>"`, and read every page before acting. Filters look like `{"property":"ID","unique_id":{"equals":31}}`, `{"property":"Status","status":{"equals":"In Progress"}}`, or `{"property":"Parent item","relation":{"contains":"<page-id>"}}`, combined with `{"and":[…]}` or `{"or":[…]}`. `v1/search` matches titles only.

## Page text

Read it as Notion markdown:

```bash
ntn api v1/pages/<page-id>/markdown < /dev/null | jq -r .markdown
```

- One block per line, no blank lines. Literal `<` `>` `|` `*` `$` are backslash-escaped: `\<Goal\>`. A line break inside a block or cell is `<br>`.
- Tables are `<table header-row="true">` with one `<td>` per line. Toggle headings are `# Title {toggle="true"}` with contents indented one tab (table row lines excepted). Callouts and `<details>` toggles indent their contents one tab.
- `<database …>` is an embedded database view and `<page …>` a child page.

Change text with exact replacements built from a read you just made:

```bash
ntn api v1/pages/<page-id>/markdown -X PATCH -d @edit.json < /dev/null
```

```json
{"type": "update_content",
 "update_content": {"content_updates": [
   {"old_str": "**Blockers:** \\<Blocking decision, or \"None.\"\\>",
    "new_str": "**Blockers:** None."}
 ]}}
```

- `old_str` must match exactly once, backslashes included (each `\` is `\\` in JSON). Zero or several matches: Notion refuses and nothing changes, so re-read and widen `old_str`.
- Inside a table, end `old_str` and `new_str` the same way (both with `\n` or neither). Mismatched endings have silently lost everything after the table.
- To delete lines, include one neighboring line that stays in `old_str` and send only that line as `new_str`.
- Several replacements in one call apply in order, all or nothing. Re-read afterwards to confirm.
- `truncated: true` caused only by an "Embed Github" block (named in `unknown_block_ids`) needs no action.

## Templates

```bash
ntn api v1/data_sources/<data-source-id>/templates < /dev/null | jq -r '.templates[] | "\(.id)\t\(.is_default)\t\(.name)"'
```

- Create with `"template":{"type":"default"}` to get the default template; leaving it out makes an empty page. Notion refuses when there's no default. `template_id` applies a specific one. Only the Notion app can make templates or set the default.
- Templates fill in the background, after the call returns. A page is filled when two reads of its text in a row match and the text is longer than before (not empty, for a new page). For a project page, its databases show as `child_database` blocks: `ntn api v1/blocks/<page-id>/children page_size==100 < /dev/null | jq -r '.results[].type'`. If it stalls, report it unverified and note where to resume.

## IDs

- IDs work with or without dashes. A page link's last 32 characters are its ID.
- A database and its data source have different IDs: `ntn api v1/databases/<database-id> < /dev/null | jq -r '.data_sources[0].id'`.

## When a call fails

`ntn api` prints the error and exits non-zero. A failed write may still have succeeded, so read the target or search for the created page before retrying.

| Error | Meaning | What to do |
| --- | --- | --- |
| 401 `unauthorized`, "no auth token" | Not signed in, expired, or this session can't reach the stored credential | Check session access first ("In Codex" in `SKILL.md`), then `ntn whoami`. If still failing, ask the owner to run `ntn login`. |
| 404 `object_not_found` | Not shared with "Notion CLI", or a wrong ID | Check the ID in `PROJECT.md`, then ask the owner to share the page. |
| 400 `validation_error` | Wrong property name, option, or `old_str` | Re-read the page or data source, fix the body, retry. |
| 409 `conflict_error` | A collision or temporary failure | Re-check the target, then retry. |

## Limits

- One text piece holds at most 2,000 characters; split longer values.
- `ntn api <path> --docs < /dev/null` prints one endpoint's documentation. `ntn api ls < /dev/null` lists them all. The API reference is at https://developers.notion.com/reference/intro.

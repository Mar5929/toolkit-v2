# Notion live test results

Run on 2026-09-26 by the Notion layer builder. Every write went to one private
page, "Toolkit V2 Notion test area (safe to delete)" (id
`3e7b381d-a176-81ad-ad1c-eb0f8ab22d09`, recorded in
`dev/test-runs/notion-test-area.json`). Mike's "AI Agent Second Brain" page was
not read or changed.

Setup: `ntn` 0.23.10, Notion API version `2026-03-11`, bot "Notion CLI" in the
"Personal" workspace. Test tools: `plugins/toolkit/tests/notion/live/`
(`mimic-projects.mjs` builds the Projects database; `run-live.mjs` runs the
end-to-end check; `record-fixtures.mjs` saves real responses for the offline
tests).

## Result of the end-to-end run

`TOOLKIT_NOTION_LIVE=1 node plugins/toolkit/tests/notion/live/run-live.mjs`:
**17 of 17 checks passed in 105 seconds.** The checks: ensure-root; ensure-project
(first run 32 calls, about 17 seconds; second run 23 calls, about 8 seconds, no
changes); create a parent and a sub-item; update a section and properties; the
Solution Design subpage; Mike's edit kept during an agent edit, and a clash
refused; a New-button card adopted; a Stage drag and a parent cleared by hand; a
trashed card reported; move under, to the archive, and back; a quick sync with
no change costs one call; memory save/get (exact text), find, retire, restore,
stale version refused; focus and glossary exact; memory status and delete; a
write outside the root refused.

### Re-run after the review fixes (2026-09-26)

Same command, same test area: **18 of 18 checks passed in 104 seconds.** Two
checks changed:

- "ensure-project again changes nothing and writes nothing": the second run
  now also leaves `.toolkit.json` byte for byte the same and writes nothing to
  Notion (22 calls, all reads). Ids stored in `.toolkit.json` are no longer
  trusted: the client walked their parents up to the root page with the real
  response shapes, and that worked.
- New, reads only: "scope walk on real objects". With the project page as the
  root, the Work Items database, its data source, its Board view, the Current
  focus page, and the Memory data source are found to be under it; the Projects
  database and the test area page are found to be outside it (8 calls).

## The tests from notion-design.md section 16

| Test | Result | Evidence |
| --- | --- | --- |
| T1 status options and groups on create | Pass | Created with 6 options; read back exactly `Backlog, Ready` in To-do, `In Progress, In Review` in In progress, `Done, Cancelled` in Complete. No extra default options. Same for the Projects mimic (Backlog, Planned / Active, Blocked / Complete, Archived). |
| T2 one dual self-relation makes both sides | Pass | `Parent item` with `synced_property_name: "Sub-items"` created both; each names the other in `dual_property`. Same for `Blocked by` / `Blocking`. |
| T3 which property the table's sub-item setting names | Pass through the API; the look in the app is not checked | `subtasks.property_id` = the `Parent item` id is accepted and read back (`display_mode: show`, `filter_scope: parents_and_subitems`). Mike should open "All items" once to confirm the nesting shows. |
| T4 board grouped by Stage | Pass through the API | The board view reads back `group_by: { type: select, property: Stage, sort: ascending, hide_empty_groups: false }`, so the columns run 01 to 14. Not looked at in the app. |
| T5 pipe tables in `markdown` | Pass, with a limit | Notion turns a plain pipe table into `<table>`. A cell holding `\|` breaks the row. The toolkit therefore sends `<table>` itself. |
| T6 `<placeholders>` | Pass | Unescaped `<Work item title>` is kept and comes back as `\<Work item title\>`. Raw `<details>`, `<br>`, `<span>` are read as Notion markup (a raw `<details>` swallowed the next line). The toolkit escapes every `<` and `>` except `<br>`, `<span>` and mention tags. |
| T7 hard breaks | Pass | Two trailing spaces plus an indented line make the extra lines child blocks of the to-do. `<br>` keeps each task as one to-do block with line breaks. The toolkit sends `<br>` and turns it back into two spaces and the list indent. |
| T8 replace without the child page tag | Pass (refused) | `replace_content` without the `<page>` tag failed: "This operation would delete 1 child page(s) ... Include these items in content using `<page url>` tags, OR set allow_deleting_content". |
| T9 `update_content` with text that is not there | Pass (refused) | `validation_error`: "No matches found for ...". An edit whose `old_str` and `new_str` both hold the `<page>` tag keeps the child page. |
| T10 new row ID and the `unique_id` filter | Pass | A new row came back as `{ number: 4, prefix: "WI" }`; the filter `{ property: <ID id>, unique_id: { equals: 4 } }` found exactly that row. |
| T11 template copy of a child page | Not run | Not needed: the toolkit builds each project by API calls (Option A). |
| T12 template copy of relations | Not run | Not needed for the same reason. |
| T13 `ntn` from a Codex session | Fails in the default sandbox | `codex exec --sandbox workspace-write` running `ntn api v1/users/me` exited 4: "No auth token found ... The seatbelt sandbox policy is active, which may be blocking keychain access." Toolkit commands must run outside the Codex sandbox; ARCHITECTURE 9 plans `.codex/rules/toolkit.rules` for that. The client now reports this case with that fix. To check again in sample run (c). |
| T14 does `ntn api` retry a 429 | Unknown; no 429 seen | 90 and then 250 parallel reads (340 calls in about 9 seconds) all succeeded. The client retries 429 and 529 itself either way (unit tests with a fake runner). |
| T15 `is_archived: true` on a row | Refused | `validation_error`: "Archive actor must match the current actor". The row stayed in queries. So the toolkit uses its own `Archived` checkbox. |

## Other facts found

1. **One unique ID prefix per workspace.** Creating a second Work Items database
   with prefix `WI` failed: `409 conflict_error: Unique ID prefix is already in
   use.` So only one Notion project in a workspace can number items `WI-n`.
   `ensure-project` now tries the configured prefix first and then one made from
   the project key (`sample-app` gives `SA`, then `SAMPLE`, `SAMPLEAPP`,
   `SA2` ...), writes it to `tracker.idPrefix` in `.toolkit.json`, and says so.
   The test area's "Toolkit V2 test" database holds `WI` now (see cleanup below).
2. **`ntn` waits forever when standard input is left open.** A call with
   `-d @file` hung in a shell whose input was an open pipe. The client always
   writes the body to standard input (`-d @-`) and closes it.
3. **Times are to the minute.** `last_edited_time` reads like
   `2026-09-26T19:44:00.000Z`. A quick sync also compares the row's property
   values, so a Stage drag in the same minute as the toolkit's own write is
   still found. A body-only edit in that same minute waits for the next full
   sync.
4. **Views list returns ids only.** `GET /v1/views?database_id=` gives
   `{ id, object }`; each view needs its own GET for its name and settings.
   The view made with a new database is called "Default view".
5. **Property ids come in two spellings.** Data sources give them URL-encoded
   (`%5DC%5DU`), views give them plain (`]C]U`). The toolkit compares them
   decoded.
6. **A leading `# heading` in a new page's Markdown is dropped.** The toolkit
   never stores the `# <id>: <title>` heading; it rebuilds it on read.
7. **File names become links.** `WORK-ITEM.md` and `docs/file.md` come back as
   `[WORK-ITEM.md](http://WORK-ITEM.md)`. A relative link
   `[WORK-ITEM.md](WORK-ITEM.md)` comes back as `https://WORK-ITEM.md`. The
   converter removes these automatic links.
8. **Other Markdown changes Notion makes:** blank lines are dropped; literal
   `$ { } ^ ~ | *` come back with a backslash; nested lists use tabs;
   headings `#####` and `######` become `####`; a code block marked `js` comes
   back as `javascript`; an HTML comment is kept as visible text.
9. **Round trip of the templates is exact.** The V2 `WORK-ITEM.md` and
   `DESIGN.md` bodies, sent through Notion and converted back, equal the
   originals byte for byte (DESIGN keeps its `| --- |` table style because the
   reader takes the style from the template). A memory record with `$`, `|`,
   `<for now>` and a code span, the current focus, and a glossary with a table
   also read back exactly.
10. **Rate and time.** About 0.4 to 0.8 seconds per call. `ensure-project` on a
    new project: about 30 calls. A quick sync with nothing changed: 1 call.

## Choices made from these results

- Work Items has two properties beyond ARCHITECTURE 4.4: `Archived` (T15) and
  `Design approved` (the `approved` field of `DESIGN.md`, which a child page
  cannot hold as a property). Also `Updated` (a date) and `Last edited`.
- The first Notion project keeps `WI`; later ones get a prefix from their key.
  This is a decision for Mike (see below).
- `delete` of a memory record moves the page to the Notion trash; Notion
  empties the trash after 30 days.

## Open for Mike

- **ID prefixes.** Keep "first project gets WI, later ones get a prefix from the
  project key", or give every Notion project its own prefix from the start?
- **T3 and T4 in the app.** Open the "All items" and "Board" views of the
  "Toolkit V2 test" project once to confirm sub-items nest and the Stage
  columns run 01 to 14.
- **Cleanup.** Delete the test area page when the Notion work is done. If the
  first real project should use `WI`, empty the Notion trash too (not tested
  whether a trashed database still holds its prefix).

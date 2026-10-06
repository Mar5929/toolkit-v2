# Finding what Notion memory holds

The exact calls that find memory pages by key, subject, work item, status, kind, or date, list them, and read them. Replace `{{MEMORIES_DS}}` and the page ids with the values in `PROJECT.md`, section "Toolkit settings": the nested bullets under the fixed line "Notion memory". The queries return accepted and proposed pages. For history, take the Status clause out.

## Contents

- A page by its key
- Pages about a subject
- Pages linked to a work item
- Pages by date
- The open proposals
- Every page
- Reading a page

The Current state page is read as `current-state-page.md` says.

## A page by its key

Use it to read one page, and to check that a key is free before a new page: the answer must be empty.

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"filter":{"property":"Record Key","rich_text":{"equals":"project_client_plans"}}}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.url)"'
```

## Pages about a subject

The API's search matches page titles only. Query the columns that describe a page, then read the candidates' bodies:

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"filter":{"and":[
  {"or":[{"property":"Title","title":{"contains":"deploy"}},
         {"property":"Synopsis","rich_text":{"contains":"deploy"}},
         {"property":"Record Key","rich_text":{"contains":"deploy"}}]},
  {"or":[{"property":"Status","select":{"equals":"accepted"}},
         {"property":"Status","select":{"equals":"proposed"}}]}]},
  "sorts":[{"property":"Saved","direction":"descending"}]}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.properties["Record Key"].rich_text[0].plain_text // "")\t\(.properties.Synopsis.rich_text[0].plain_text // "")"'
```

- Try two or three words and their synonyms.
- By kind: `{"property":"Tags","multi_select":{"contains":"event"}}`, with `user`, `project`, `reference`, or `event`.
- To find the concept a new fact belongs to, take the Status clause out, so a retired or replaced page shows too.

## Pages linked to a work item

When the work items are in Notion (the relation exists), by the item's page id:

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"filter":{"and":[
  {"property":"Work items","relation":{"contains":"<item-page-id>"}},
  {"or":[{"property":"Status","select":{"equals":"accepted"}},{"property":"Status","select":{"equals":"proposed"}}]}]}}' < /dev/null | jq -r '.results[] | "\(.properties["Record Key"].rich_text[0].plain_text)\t\(.properties.Kind.select.name)\t\(.url)"'
```

In every setup, by the ID text: `{"property":"Work item IDs","rich_text":{"contains":"IML-3"}}`. `contains` also matches a longer ID (`IML-3` finds `IML-31`), so check each hit's Work item IDs for the whole ID. Facts and Entities link to work items the same way, through their own Work items column.

## Pages by date

Pages whose "check or remove by" date is today or earlier (replace the date with today's):

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"filter":{"and":[{"property":"Review By","date":{"on_or_before":"2026-10-06"}},{"property":"Status","select":{"equals":"accepted"}}]}}' < /dev/null | jq -r '.results[] | "\(.properties["Record Key"].rich_text[0].plain_text // "")\t\(.properties["Review By"].date.start)\t\(.properties.Synopsis.rich_text[0].plain_text // "")"'
```

Pages changed on or after a day, for what happened since then: `{"property":"Saved","date":{"on_or_after":"2026-10-05"}}` in place of the Review By clause. Then read the Runs table of each `event_` page of a recurring job for rows of those days.

## The open proposals

A proposal page has Status "proposed". A proposal inside another page starts `**Proposal, not approved yet:**`, so read a candidate's body to find one.

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"filter":{"property":"Status","select":{"equals":"proposed"}}}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.properties["Record Key"].rich_text[0].plain_text // "")"'
```

## Every page

Every page of Memories, with its key, status, kind, the dates it was created, last changed, and must be checked by, its last check, work items, and summary. A page with no key shows "(no key)". With more than 100 pages, page through the answer (`using-notion-cli`):

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"sorts":[{"property":"Record Key","direction":"ascending"}],"page_size":100}' < /dev/null | jq -r '.results[] | [.id,
  (.properties["Record Key"].rich_text[0].plain_text // "(no key)"),
  (.properties.Status.select.name // ""),
  (.properties.Kind.select.name // ""),
  (.created_time[0:10]),
  (.properties.Saved.date.start // ""),
  (.properties["Review By"].date.start // ""),
  (.properties["Last verified"].rich_text[0].plain_text // ""),
  (.properties["Work item IDs"].rich_text[0].plain_text // ""),
  (.properties.Synopsis.rich_text[0].plain_text // "")] | @tsv'
```

## Reading a page

Read its text and its columns as `using-notion-cli` says ("Reading and changing page text", "Reading properties"), with the page's id.

# Finding what Notion memory holds

This file gives the exact calls that find memory pages by key, subject, work item, status, type, or date, the call that lists every page, and the way to read a page. Open this file when you need to find or read memory.

Three things to know before you use the calls:

- Replace `{{MEMORIES_DS}}` and the page ids with the values in `PROJECT.md`, section "Toolkit settings": the nested bullets under the fixed line "Notion memory".
- Each call returns pages by their Status, as follows:
  - "Pages about a subject" and "Pages linked to a work item" return pages with the Status accepted or proposed. To see history too, take the Status clause out.
  - "Pages by date" returns only pages with the Status accepted.
  - "A page by its key" and "Every page" have no Status clause, so they return pages of every Status.
- The Current state page is not read with these calls. `current-state-page.md` says how to read it.

## Contents

- A page by its key
- Pages about a subject
- Pages linked to a work item
- Pages by date
- Every page
- Reading a page

## A page by its key

Use this call to read one page. Also use it before you make a new page, to check that the key is free: the answer must be empty.

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"filter":{"property":"Record Key","rich_text":{"equals":"project_client_plans"}}}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.url)"'
```

## Pages about a subject

Query the columns that describe a page, because the API's search matches page titles only. Then read the bodies of the pages that the query returns:

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
- To search by type, use this clause with `user`, `project`, `reference`, or `event`: `{"property":"Tags","multi_select":{"contains":"event"}}`.
- To find the subject that a new fact belongs to, take the Status clause out. A retired or replaced page then shows too.

## Pages linked to a work item

When the work items are in Notion, the Work items relation exists. Search by the page id of the work item:

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"filter":{"and":[
  {"property":"Work items","relation":{"contains":"<item-page-id>"}},
  {"or":[{"property":"Status","select":{"equals":"accepted"}},{"property":"Status","select":{"equals":"proposed"}}]}]}}' < /dev/null | jq -r '.results[] | "\(.properties["Record Key"].rich_text[0].plain_text)\t\([.properties.Tags.multi_select[].name] | join(","))\t\(.url)"'
```

In every setup, you can search by the text of the ID, with this clause: `{"property":"Work item IDs","rich_text":{"contains":"IML-3"}}`.

- `contains` also matches a longer ID: `IML-3` finds `IML-31`. So check the Work item IDs of each page the query returns for the whole ID.
- Facts and Entities link to work items the same way, through their own Work items column.

## Pages by date

This call finds the pages whose "check or remove by" date is today or earlier. Replace the date with today's date:

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"filter":{"and":[{"property":"Review By","date":{"on_or_before":"2026-10-06"}},{"property":"Status","select":{"equals":"accepted"}}]}}' < /dev/null | jq -r '.results[] | "\(.properties["Record Key"].rich_text[0].plain_text // "")\t\(.properties["Review By"].date.start)\t\(.properties.Synopsis.rich_text[0].plain_text // "")"'
```

To find what happened since a day, do two things:

1. Find the pages changed on or after that day. Use this clause in place of the Review By clause: `{"property":"Saved","date":{"on_or_after":"2026-10-05"}}`.
2. Read the Runs table of each `event_` page of a recurring job, for rows of those days.

## Every page

This call lists every page of Memories. For each page it prints the key, the status, the tags (the type is one of them), the date the page was created, the date it was last changed, the date it must be checked by, its last check, its work items, and its summary.

- A page with no key shows "(no key)".
- When Memories has more than 100 pages, page through the answer the way `using-notion-cli` says.

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"sorts":[{"property":"Record Key","direction":"ascending"}],"page_size":100}' < /dev/null | jq -r '.results[] | [.id,
  (.properties["Record Key"].rich_text[0].plain_text // "(no key)"),
  (.properties.Status.select.name // ""),
  ([.properties.Tags.multi_select[].name] | join(",")),
  (.created_time[0:10]),
  (.properties.Saved.date.start // ""),
  (.properties["Review By"].date.start // ""),
  (.properties["Last verified"].rich_text[0].plain_text // ""),
  (.properties["Work item IDs"].rich_text[0].plain_text // ""),
  (.properties.Synopsis.rich_text[0].plain_text // "")] | @tsv'
```

## Reading a page

Read the page's text and its columns with the page's id. `using-notion-cli`, sections "Reading and changing page text" and "Reading properties", gives the calls.

# Finding what Notion memory holds: the queries

Purpose: the exact calls that find records by key, subject, work item, or
kind, read them, and read the Current state page.

Replace `{{MEMORIES_DS}}` and the page ids with the values in `PROJECT.md`
"Toolkit settings". Leave out superseded and retired records (Status
superseded or deprecated) unless asked for history.

## The Current state page

The session start hook prints it. To read it again:

```bash
ntn api v1/pages/{{CURRENT_STATE_PAGE_ID}}/markdown < /dev/null | jq -r .markdown
```

## One record by its key

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"filter":{"property":"Record Key","rich_text":{"equals":"project_deploys"}}}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.url)"'
```

## Records about a subject

The API's search matches titles only, so search the columns that describe
a record, then read the candidates' bodies:

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"filter":{"and":[
  {"or":[{"property":"Title","title":{"contains":"deploy"}},
         {"property":"Synopsis","rich_text":{"contains":"deploy"}},
         {"property":"Record Key","rich_text":{"contains":"deploy"}}]},
  {"or":[{"property":"Status","select":{"equals":"accepted"}},
         {"property":"Status","select":{"equals":"proposed"}}]}]},
  "sorts":[{"property":"Saved","direction":"descending"}]}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.properties["Record Key"].rich_text[0].plain_text // "")\t\(.properties.Synopsis.rich_text[0].plain_text // "")"'
```

Try two or three words (and their synonyms). By type:
`{"property":"Tags","multi_select":{"contains":"project"}}`.

## Records linked to a work item

When work items are in Notion (the relation exists), by the item's page id:

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"filter":{"and":[
  {"property":"Work items","relation":{"contains":"<item-page-id>"}},
  {"or":[{"property":"Status","select":{"equals":"accepted"}},{"property":"Status","select":{"equals":"proposed"}}]}]}}' < /dev/null | jq -r '.results[] | "\(.properties["Record Key"].rich_text[0].plain_text)\t\(.properties.Kind.select.name)\t\(.url)"'
```

In every setup, by the ID text:
`{"property":"Work item IDs","rich_text":{"contains":"IML-3"}}`.

Facts and Entities link to work items the same way (their own "Work items"
column).

## Project-wide decisions

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"filter":{"and":[{"property":"Kind","select":{"equals":"decision"}},{"property":"Status","select":{"does_not_equal":"deprecated"}},{"property":"Status","select":{"does_not_equal":"superseded"}}]},"sorts":[{"property":"Saved","direction":"descending"}]}' < /dev/null
```

An item's own decisions are not here: they are the rows with "yes" in
Decision? in that item's Questions and Answers (the work track skill).

## Reading a record

```bash
ntn api v1/pages/<record-page-id>/markdown < /dev/null | jq -r .markdown
```

Its columns: `ntn-basics.md`, "Reading a page's properties".

## The glossary

```bash
ntn api v1/pages/{{GLOSSARY_PAGE_ID}}/markdown < /dev/null | jq -r .markdown
```

# Finding pointers in Notion

The exact calls that find and list pointer pages. Replace `{{MEMORIES_DS}}` with the value in `PROJECT.md`, section "Toolkit settings", Notion block. The Current state page is read as `current-state-page.md` says.

## A pointer by its ID

Use it to read one pointer, and to check that a record has no pointer before you add one: the answer must be empty.

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"filter":{"property":"Record Key","rich_text":{"equals":"DEC-004"}}}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.url)"'
```

## Pointers about a subject

The API's search matches page titles only, so query the Title column:

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"filter":{"property":"Title","title":{"contains":"workspace"}}}' < /dev/null | jq -r '.results[] | "\(.properties["Record Key"].rich_text[0].plain_text // "(no key)")\t\(.properties.Title.title[0].plain_text // "")\t\(.properties.Synopsis.rich_text[0].plain_text // "")"'
```

Try two or three words and their synonyms.

## Pointers to a work item

`{"property":"Work item IDs","rich_text":{"contains":"WI-3"}}` in place of the filter above. `contains` also matches a longer ID (`WI-3` finds `WI-31`), so check each hit's Work item IDs for the whole ID.

## Every pointer

Every page of Memories, with the ID it names, what it points to, the link, the date created, and the date last changed. With more than 100 pages, page through the answer (`using-notion-cli`):

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"sorts":[{"property":"Record Key","direction":"ascending"}],"page_size":100}' < /dev/null | jq -r '.results[] | [.id,
  (.properties["Record Key"].rich_text[0].plain_text // "(no key)"),
  (.properties.Title.title[0].plain_text // ""),
  (.properties.Synopsis.rich_text[0].plain_text // ""),
  (.created_time[0:10]),
  (.properties.Saved.date.start // "")] | @tsv'
```

A page with no Record Key, or with a body, is not a pointer (`SKILL.md`, "Gotchas").

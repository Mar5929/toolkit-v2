# Writing pointer pages

How to add, change, and remove a pointer, which is one page of Memories, and how to link it to a work item. The calling skill decides what the pointer names. The columns are in `database-layout.md`. Replace `{{…}}` with the ids in `PROJECT.md`.

## Adding a pointer

A record gets one pointer. First check that no page has the record's ID as its Record Key (`searching.md`, "A pointer by its ID"), and that the record exists: a DEC in `DECISIONS.md`, an SRC in `sources/README.md`, a rule ID in `system/`, a work item with `using-work-tracker`.

```bash
ntn api v1/pages -d @pointer.json < /dev/null | jq -r '.id, .url, .created_time'
```

`pointer.json`:

```json
{"parent": {"type": "data_source_id", "data_source_id": "{{MEMORIES_DS}}"},
 "properties": {
   "Title": {"title": [{"text": {"content": "The decision on which workspace a request belongs to"}}]},
   "Record Key": {"rich_text": [{"text": {"content": "DEC-004"}}]},
   "Keywords": {"rich_text": [{"text": {"content": "DEC-004"}}]},
   "Synopsis": {"rich_text": [{"text": {"content": "DECISIONS.md"}}]},
   "Kind": {"select": {"name": "note"}},
   "Tags": {"multi_select": [{"name": "reference"}]},
   "Status": {"select": {"name": "accepted"}},
   "Source": {"select": {"name": "manual"}},
   "Author": {"rich_text": [{"text": {"content": "<owner name>"}}]},
   "Agent": {"rich_text": [{"text": {"content": "Claude Code"}}]},
   "Project": {"relation": [{"id": "<this project's row in Lore's Projects database>"}]},
   "Saved": {"date": {"start": "2026-10-05"}}}}
```

- Synopsis holds the link. A file in the repository: its path from the project folder. A work item: its web address when it has one, otherwise its ID.
- Notion sets the date the page was created. Saved is the date it last changed: set it to today.
- The page has no body. Leave every other column empty.

## Changing a pointer

Change Title or Synopsis, and set Saved to today, in one call:

```bash
ntn api v1/pages/<id> -X PATCH -d '{"properties":{"Synopsis":{"rich_text":[{"text":{"content":"system/security-model.md"}}]},"Saved":{"date":{"start":"2026-10-06"}}}}' < /dev/null
```

A pointer that must name another record: change Record Key and Keywords to the new ID in the same call.

## Removing a pointer

Move the page to Notion's trash:

```bash
ntn api v1/pages/<id> -X PATCH -d '{"in_trash":true}' < /dev/null | jq -r '.in_trash'
```

- The answer must say `true`. Only then is the pointer removed.
- A removed page stays in Notion's trash for a limited time: sending `{"in_trash":false}` restores it. Notion empties its trash itself later.

## A pointer to a work item

Write the item's ID in Work item IDs as well as in Record Key (`database-layout.md`, "Links to work items"). When the work items are in Notion too, also set the Work items relation to the item's page id:

```bash
ntn api v1/pages/<page-id> -X PATCH -d '{"properties":{"Work item IDs":{"rich_text":[{"text":{"content":"WI-31"}}]},"Work items":{"relation":[{"id":"<item-page-id>"}]}}}' < /dev/null
```

Find an item's page id with `using-work-tracker`.

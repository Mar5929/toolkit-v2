# Finding work in Notion: the queries

Purpose: the exact calls that read items, phases, and tasks from the Work
Items, Phases, and Tasks databases. They only read.

## Contents

- One item
- The board
- Open questions
- A parent's full tree
- Search
- Reading a source file
- Pages without the template
- Cards with no title

Replace `{{WORK_ITEMS_DS}}`, `{{PHASES_DS}}`, `{{TASKS_DS}}` with the ids in
`PROJECT.md` "Toolkit settings". Every query leaves out archived items
unless the owner asks for them. Every Work Items query except "Cards with
no title" also leaves out rows with an empty title, so the work item
template is never reported: add
`{"property":"Work item","title":{"is_not_empty":true}}` to its filter (with
`"and"` when there are other conditions).

## One item

By its number, the part after the prefix (`WI-31` is 31), never by its
title:

```bash
ntn api v1/data_sources/{{WORK_ITEMS_DS}}/query -d '{"filter":{"property":"ID","unique_id":{"equals":31}}}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.url)"'
```

No result: the item may be in the trash or outside this project. Tell the
owner; never make a second item with the same title. Then read its
properties (`ntn-basics.md`, "Reading a page's properties") and its text,
starting with the Overview's Current state:

```bash
ntn api v1/pages/<page-id>/markdown < /dev/null | jq -r .markdown
```

## The board

Open items with their status, stage, waiting-on, and next action:

```bash
ntn api v1/data_sources/{{WORK_ITEMS_DS}}/query -d '{
  "filter":{"and":[{"property":"Archived","checkbox":{"equals":false}},
    {"property":"Work item","title":{"is_not_empty":true}},
    {"property":"Status","status":{"does_not_equal":"Done"}},
    {"property":"Status","status":{"does_not_equal":"Cancelled"}}]},
  "sorts":[{"property":"Priority","direction":"ascending"},{"property":"ID","direction":"ascending"}],
  "page_size":100}' < /dev/null | jq -r '.results[] | [
    "\(.properties.ID.unique_id.prefix)-\(.properties.ID.unique_id.number)",
    (.properties.Status.status.name // ""),
    (.properties.Stage.select.name // ""),
    (.properties["Waiting on"].select.name // ""),
    (.properties["Work item"].title | map(.plain_text) | join("")),
    (.properties["Next action"].rich_text | map(.plain_text) | join(""))] | @tsv'
```

Done and Cancelled only when asked (drop those two filters). Then run
"Cards with no title" and report each card it returns as a record problem.

## Open questions

For each open item (or the ones the owner named), read the page text and
take the Questions and Answers rows with Status Open and Decision needed
from owner.
Report what waits on the owner first (item ID, Q-ID, what it blocks), then what is in progress, then your next step.

## A parent's full tree

Three levels at most.

```bash
# its sub-items, in phase order
ntn api v1/data_sources/{{WORK_ITEMS_DS}}/query -d '{"filter":{"property":"Parent item","relation":{"contains":"<page-id>"}},"sorts":[{"property":"Phase order","direction":"ascending"},{"property":"ID","direction":"ascending"}]}' < /dev/null
# its phases, in order
ntn api v1/data_sources/{{PHASES_DS}}/query -d '{"filter":{"property":"Work item","relation":{"contains":"<page-id>"}},"sorts":[{"property":"Order","direction":"ascending"}]}' < /dev/null
# its open tasks, in order
ntn api v1/data_sources/{{TASKS_DS}}/query -d '{"filter":{"and":[{"property":"Work item","relation":{"contains":"<page-id>"}},{"property":"Done","checkbox":{"equals":false}}]},"sorts":[{"property":"Order","direction":"ascending"}]}' < /dev/null
```

Repeat the first query for each sub-item to reach the third level. A
sub-item with no phase goes last, under "No phase". A fourth level: tell
the owner which item is at level 4.

## Search

```bash
ntn api v1/data_sources/{{WORK_ITEMS_DS}}/query -d '{"filter":{"property":"Work item","title":{"contains":"login"}}}' < /dev/null
```

`v1/search` matches page titles only, not page text. For words inside the
text, narrow the items first (by title, tag, type, parent, or status), then
read each candidate's page text and look for the words.

## Reading a source file

A transcript or document saved on an item sits in its Files property; the
item's Notes → Sources line names it. Get each file's name and address:

```bash
ntn api v1/pages/<page-id> < /dev/null | jq -r '.properties.Files.files[] | "\(.name)\t\(.file.url // .external.url)"'
```

A Notion file address lasts one hour, so download the file right away into
a scratch folder (`ntn-basics.md`, "Sending a body"), never inside the
project:

```bash
curl -sfL '<url>' -o '<scratch folder>/<name>'
```

Read it whole there, then remove the scratch folder. When `curl` fails,
the address has expired: read the page again to get a new address. In Codex,
run `curl` as its own command with escalated permissions, the same as `ntn`
(`notion-access.md`, "In Codex"). A Salesforce client file is never
attached: its Sources line names its `delivery/` path; read it there.

## Pages without the template

An item the owner made with "Empty" in the New menu, or made before the
project had a default template, has fewer than five blocks:

```bash
ntn api v1/blocks/<page-id>/children < /dev/null | jq '.results | length'
```

Tell the owner the item has no template sections and offer to add them
("A card made by hand in Notion" in `items.md`).

## Cards with no title

A card the owner made and gave no title is hidden from every Work Items
view the toolkit made. List them, then drop the ids the templates list
returns (the work item template is one):

```bash
ntn api v1/data_sources/{{WORK_ITEMS_DS}}/query -d '{"filter":{"and":[{"property":"Work item","title":{"is_empty":true}},{"property":"Archived","checkbox":{"equals":false}}]}}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.properties.ID.unique_id.prefix)-\(.properties.ID.unique_id.number)\t\(.url)"'
ntn api v1/data_sources/{{WORK_ITEMS_DS}}/templates < /dev/null | jq -r '.templates[].id'
```

Report each card that remains ("A card with no title, IML-6: <link>"), and
ask the owner to name it or archive it.

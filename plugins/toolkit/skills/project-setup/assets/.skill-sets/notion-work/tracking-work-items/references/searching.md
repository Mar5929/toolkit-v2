# Searching: the queries

The exact calls that read items, phases, and tasks from the Work Items, Phases, and Tasks databases. They only read.

## Contents

- One item
- The board
- What waits on the owner
- A parent's full tree
- Search
- Reading a source file
- Pages without the template
- Cards with no title

Replace `{{WORK_ITEMS_DS}}`, `{{PHASES_DS}}`, and `{{TASKS_DS}}` with the ids in `PROJECT.md`. Every query leaves out archived items unless the owner asks for them. Every Work Items query except "Cards with no title" also needs `{"property":"Work item","title":{"is_not_empty":true}}` in its filter (inside `"and"` when there are other conditions), so the work item template is never reported.

## One item

Find it by its number, the part after the prefix (`WI-31` is 31), never by its title:

```bash
ntn api v1/data_sources/{{WORK_ITEMS_DS}}/query -d '{"filter":{"and":[{"property":"ID","unique_id":{"equals":31}},{"property":"Work item","title":{"is_not_empty":true}}]}}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.url)"'
```

No result: the item may be in the trash or outside this project. Tell the owner, and never make a second item with the same title. Otherwise read its properties (`using-notion-cli`, "Reading properties") and its text (`using-notion-cli`, "Reading and changing page text"), starting with the Overview's Current state.

## The board

Open items with their status, state, waiting-on, and next action:

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
    (.properties.State.select.name // ""),
    (.properties["Waiting on"].select.name // ""),
    (.properties["Work item"].title | map(.plain_text) | join("")),
    (.properties["Next action"].rich_text | map(.plain_text) | join(""))] | @tsv'
```

Add Done and Cancelled only when asked (drop those two filters). Then run "Cards with no title" and report each card it returns as a record problem.

## What waits on the owner

For each open item (or the ones the owner named), read the page text and take the Questions and Answers rows with Status Open and Decision needed from owner. Report what waits on the owner first (item ID, Q-ID, what it blocks), then what is in progress, then your next step.

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

Repeat the first query for each sub-item to reach the third level. A sub-item with no phase goes last, under "No phase". When there is a fourth level, tell the owner which item is at level 4.

List an item's phases with their Phase ID, name, and Status:

```bash
ntn api v1/data_sources/{{PHASES_DS}}/query -d '{"filter":{"property":"Work item","relation":{"contains":"<item-page-id>"}},"sorts":[{"property":"Order","direction":"ascending"}]}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.properties["Phase ID"].rich_text[0].plain_text)\t\(.properties.Phase.title[0].plain_text)\t\(.properties.Status.select.name)"'
```

## Search

```bash
ntn api v1/data_sources/{{WORK_ITEMS_DS}}/query -d '{"filter":{"and":[{"property":"Work item","title":{"contains":"login"}},{"property":"Work item","title":{"is_not_empty":true}}]}}' < /dev/null
```

`v1/search` matches page titles only, not page text. For words inside the text, narrow the items first (by title, tag, type, parent, or status), then read each candidate's page text and look for the words.

## Reading a source file

A transcript or document saved on an item sits in its Files property. The item's Notes, Sources line names it. Get each file's name and address:

```bash
ntn api v1/pages/<page-id> < /dev/null | jq -r '.properties.Files.files[] | "\(.name)\t\(.file.url // .external.url)"'
```

A Notion file address lasts one hour, so download the file right away into a scratch folder outside the project (`using-notion-cli`, "Sending a body"):

```bash
curl -sfL '<url>' -o '<scratch folder>/<name>'
```

Read it whole there, then remove the scratch folder. When `curl` fails, the address has expired: read the page again to get a new address. In Codex, run `curl` as its own command with escalated permissions, the same as `ntn` (`using-notion-cli`, "In Codex"). A Salesforce client file is never attached: its Sources line names its `delivery/` path, so read it there.

## Pages without the template

An item the owner made with "Empty" in the New menu, or made before the project had a default template, has fewer than five blocks:

```bash
ntn api v1/blocks/<page-id>/children < /dev/null | jq '.results | length'
```

Tell the owner the item has no template sections, and offer to add them (`database-layout.md`, "A card the owner made by hand").

## Cards with no title

A card the owner made and gave no title is hidden from every Work Items view the toolkit made. List them, then drop the ids the templates list returns (the work item template is one):

```bash
ntn api v1/data_sources/{{WORK_ITEMS_DS}}/query -d '{"filter":{"and":[{"property":"Work item","title":{"is_empty":true}},{"property":"Archived","checkbox":{"equals":false}}]}}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.properties.ID.unique_id.prefix)-\(.properties.ID.unique_id.number)\t\(.url)"'
ntn api v1/data_sources/{{WORK_ITEMS_DS}}/templates < /dev/null | jq -r '.templates[].id'
```

Report each card that remains ("A card with no title, IML-6: <link>"), and ask the owner to name it or archive it.

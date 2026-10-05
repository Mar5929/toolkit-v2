# Writing memory pages

How to create, change, mark, link, merge, and delete a page of Memories, and how to add a row to the glossary. `curating-project-memory` decides what to write and when. The columns, statuses, and body layout are in `database-layout.md`. Replace `{{…}}` with the ids in `PROJECT.md`.

## Contents

- A new concept page
- Adding to a concept page
- A lesson
- A decision page
- Correcting a fact
- Replacing a page
- A proposal
- Retiring and bringing back
- Deleting a page
- Linking a page to work items
- Merging two concepts
- A glossary row

## A new concept page

The key is `<prefix>_<slug>`: lower-case words joined by underscores, naming the concept (`project_deploys`), at most 60 characters. Check that no page has the key first (`searching.md`, "A page by its key").

```bash
ntn api v1/pages -d @record.json < /dev/null | jq -r '.id, .url'
```

`record.json`:

```json
{"parent": {"type": "data_source_id", "data_source_id": "{{MEMORIES_DS}}"},
 "properties": {
   "Title": {"title": [{"text": {"content": "Deploys"}}]},
   "Record Key": {"rich_text": [{"text": {"content": "project_deploys"}}]},
   "Keywords": {"rich_text": [{"text": {"content": "project_deploys"}}]},
   "Synopsis": {"rich_text": [{"text": {"content": "How deploys work: the window, the release branch, the checks."}}]},
   "Kind": {"select": {"name": "note"}},
   "Tags": {"multi_select": [{"name": "project"}]},
   "Status": {"select": {"name": "accepted"}},
   "Source": {"select": {"name": "manual"}},
   "Author": {"rich_text": [{"text": {"content": "<owner name>"}}]},
   "Agent": {"rich_text": [{"text": {"content": "Claude Code"}}]},
   "Project": {"relation": [{"id": "<this project's row in Lore's Projects database>"}]},
   "Saved": {"date": {"start": "2026-09-30"}},
   "Source note": {"rich_text": [{"text": {"content": "Mike, 2026-09-30, kickoff call"}}]},
   "Authorization": {"rich_text": [{"text": {"content": "Approved by Mike on 2026-09-30"}}]},
   "Last verified": {"rich_text": [{"text": {"content": "2026-09-30"}}]},
   "Work item IDs": {"rich_text": [{"text": {"content": "IML-3"}}]},
   "Work items": {"relation": [{"id": "<item page id>"}]}},
 "markdown": "<the body from assets/concept-record.md, every prompt filled>"}
```

- Leave out Work item IDs and Work items when the page relates to no work item, and Work items alone when the work items are not in Notion.

## Adding to a concept page

1. Read the page's text (`searching.md`, "Reading a page").
2. Add a `## <Sub-topic>` section before `## Gotchas and lessons`, labeled as `assets/concept-record.md` shows, or change a section in place. Use one `update_content` call (`using-notion-cli`):

   ```json
   {"type":"update_content","update_content":{"content_updates":[
     {"old_str":"## Gotchas and lessons","new_str":"## Export format\n**Remember:** …<br>**Why:** …<br>**How to apply:** …<br>**Evidence and limits:** …\n## Gotchas and lessons"}]}}
   ```
3. Set Saved to today and Authorization to what allowed the change. Change Synopsis when the concept now covers more.

   ```bash
   ntn api v1/pages/<id> -X PATCH -d '{"properties":{"Saved":{"date":{"start":"2026-10-02"}},"Authorization":{"rich_text":[{"text":{"content":"Approved by Mike on 2026-10-02"}}]}}}' < /dev/null
   ```

## A lesson

A lesson goes under the concept it is about, in `## Gotchas and lessons`, in the format `database-layout.md` gives. This call adds the first one, in place of "None yet.":

```json
{"type":"update_content","update_content":{"content_updates":[
  {"old_str":"## Gotchas and lessons\nNone yet.","new_str":"## Gotchas and lessons\n### Check the release branch first\n**Seen:** 2026-09-30, IML-3."}]}}
```

To add a date to a lesson's Seen line, or to mark it promoted, replace that line with the line as you want it. The lesson stays as history.

## A decision page

Create it like a concept page, with these differences (`database-layout.md`, "Where each part of a memory goes"):

- The key is `decision_<slug>`. Kind is "decision", Tags is "decision", and Decided At is the date of the owner's answer.
- The body is `assets/decision-record.md`: the decision in one sentence, how to apply it, and where it was decided.
- Decided in a work item: keep the first "Where it was decided" line, with the item's ID, the Q-ID, and the owner's words, and remove the "With no work item" line. Link the page to the item.
- Decided with no work item: leave Work item IDs empty, set no Work items relation, keep the "With no work item" line, and remove the first "Where it was decided" line.

## Correcting a fact

Replace the old text in its section with the new text, and put the new source and date in the section's Evidence and limits line. The old wording does not stay beside it. Set Saved to today.

## Replacing a page

1. On the old page, set Status "superseded" and Superseded by to the new page's key.
2. On the new page, add the old page to the Supersedes relation, keeping every page already in it.

   ```bash
   ntn api v1/pages/<new-page-id> -X PATCH -d '{"properties":{"Supersedes":{"relation":[{"id":"<old-page-id>"}]}}}' < /dev/null
   ```

A page with the wrong prefix is replaced the same way: make a new page under the right key, then replace the old one.

## A proposal

A proposal is a save the owner has not said yes to. Mark it so nobody relies on it:

- A new page: Status "proposed", Authorization `Proposed by the agent on <date>; not approved`, and a Synopsis that starts "Proposal, not approved yet:".
- A section of an existing page: a new section whose first line is `**Proposal, not approved yet:** asked on <date>. Do not rely on this until the owner says yes.`

To remove the marks: set Status "accepted", Authorization `Approved by <owner> on <date>`, and take the proposal words off the Synopsis. For a section, remove its proposal line and add "Approved by <owner> on <date>." to its Evidence and limits line. To drop a proposal, remove the section, or delete the proposal page (below). The open proposals are found with `searching.md`, "The open proposals".

## Retiring and bringing back

- **Retire a page:** Status "deprecated", and a last section `## Retired` with the date and the owner's words as the reason. Add the section with one `update_content` call whose `old_str` is the page's last line as read and whose `new_str` is that line followed by the new section. A decision the owner withdrew with no replacement is retired the same way, and its `## Retired` section says it was withdrawn.
- **Bring it back:** Status "accepted", and remove the `## Retired` section (its `old_str` with its line break, `new_str` empty).
- **Remove a section or a line:** the same call, with `new_str` empty. Keep the removed text, so it can be put back.

## Deleting a page

Move the page to Notion's trash:

```bash
ntn api v1/pages/<id> -X PATCH -d '{"in_trash":true}' < /dev/null | jq -r '.in_trash'
```

- The answer must say `true`. Only then is the page deleted.
- Then clear what pointed at it: its key in another page's Superseded by, and its id in another page's Supersedes. Name each page you changed in your reply.
- A deleted page can be brought back for a limited time: it stays in Notion's trash, and sending `{"in_trash":false}` restores it. Notion empties its trash itself later.

## Linking a page to work items

Always write the IDs in Work item IDs (`database-layout.md`, "Links to work items"). When the work items are in Notion too, set the Work items relation to every item page id: the ones already there, read first, and the new one:

```bash
ntn api v1/pages/<page-id> < /dev/null | jq -c '.properties["Work items"].relation'
ntn api v1/pages/<page-id> -X PATCH -d '{"properties":{"Work items":{"relation":[{"id":"<item-page-id>"}]}}}' < /dev/null
```

Find an item's page id with `using-work-tracker`.

## Merging two concepts

How `curating-project-memory` merges two pages about one concept, in Notion:

1. Add each section of the other page to the kept page with one `update_content` call, before `## Gotchas and lessons`. Its lessons go with them, and each section keeps its source.
2. Join the two pages' Work item IDs and Work items lists, with no repeats.
3. Replace the other page (above).
4. Update the kept page's Synopsis and Saved.

## A glossary row

The Terminology glossary page holds one table. A term gets one row: Term, System or context, Meaning here, Distinction or alias, Source, Status / last checked (`assets/terminology-glossary.md`). Insert the row after the header row with one `update_content` call: `old_str` is the header row exactly as read, and `new_str` is that row followed by the new `<tr>`. Change a term's meaning or status by replacing its row the same way.

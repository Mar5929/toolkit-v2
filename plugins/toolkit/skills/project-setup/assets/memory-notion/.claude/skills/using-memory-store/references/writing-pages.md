# Writing memory pages

This file says how to create, change, mark, link, merge, and delete a page of Memories. Open it for every save of a memory record. A save is done only when you have read the page back and the change is there, as step 4 of `SKILL.md` says.

`curating-project-memory` decides what to write and when. The columns, the statuses, and the layout of the page body are in `database-layout.md`. In every call, replace `{{…}}` with the ids in `PROJECT.md`.

## Contents

- A new page for a subject
- Adding to a page
- A lesson
- A run of a recurring job
- Correcting a fact
- Replacing a page
- A proposal
- Retiring and bringing back
- Deleting a page
- Linking a page to work items
- Merging two pages about one subject

## A new page for a subject

First choose the key. The key is `<prefix>_<slug>`: the prefix is the type of the memory record (`user`, `project`, `reference`, or `event`), then lower-case words joined by underscores, naming the subject (`project_client_plans`). The whole key, with its prefix, is at most 60 characters. An event that happened once ends its key with its date, as in `event_client_meeting_2026-10-05`.

Before you make the page, check that no page has the key. `searching.md`, section "A page by its key", gives the call.

Then make the page with this call:

```bash
ntn api v1/pages -d @record.json < /dev/null | jq -r '.id, .url'
```

The file `record.json` holds:

```json
{"parent": {"type": "data_source_id", "data_source_id": "{{MEMORIES_DS}}"},
 "properties": {
   "Title": {"title": [{"text": {"content": "Team availability"}}]},
   "Record Key": {"rich_text": [{"text": {"content": "user_team_availability"}}]},
   "Keywords": {"rich_text": [{"text": {"content": "user_team_availability"}}]},
   "Synopsis": {"rich_text": [{"text": {"content": "Tom away to 2026-10-20; Sarah covers approvals"}}]},
   "Kind": {"select": {"name": "note"}},
   "Tags": {"multi_select": [{"name": "user"}]},
   "Status": {"select": {"name": "accepted"}},
   "Source": {"select": {"name": "manual"}},
   "Author": {"rich_text": [{"text": {"content": "<owner name>"}}]},
   "Agent": {"rich_text": [{"text": {"content": "Claude Code"}}]},
   "Project": {"relation": [{"id": "<this project's row in Lore's Projects database>"}]},
   "Saved": {"date": {"start": "2026-09-30"}},
   "Review By": {"date": {"start": "2026-10-21"}},
   "Source note": {"rich_text": [{"text": {"content": "The owner, 2026-09-30, kickoff call"}}]},
   "Authorization": {"rich_text": [{"text": {"content": "Approved by the owner on 2026-09-30"}}]},
   "Last verified": {"rich_text": [{"text": {"content": "2026-09-30"}}]},
   "Work item IDs": {"rich_text": [{"text": {"content": "IML-3"}}]},
   "Work items": {"relation": [{"id": "<item page id>"}]}},
 "markdown": "<the body from assets/concept-record.md, every prompt filled>"}
```

- When the page relates to no work item, leave out Work item IDs and Work items. When the work items are not in Notion, leave out Work items alone.
- When the fact has no end, leave out Review By.
- Notion sets the page's created time. Saved is the date of the last change.
- Synopsis states the fact itself, with its dates, in one short line.

## Adding to a page

1. Read the page's text. `searching.md`, section "Reading a page", says how.
2. Add a `## <Sub-topic>` section before `## Gotchas and lessons`, with the labels that `assets/concept-record.md` shows, or change a section in place. Use one `update_content` call, which `using-notion-cli` describes:

   ```json
   {"type":"update_content","update_content":{"content_updates":[
     {"old_str":"## Gotchas and lessons","new_str":"## Export format\n**Remember:** …<br>**Why:** …<br>**How to apply:** …<br>**Evidence and limits:** …\n## Gotchas and lessons"}]}}
   ```
3. Update the page's columns:
   - Set Saved to today.
   - Set Authorization to what allowed the change.
   - When the subject now covers more, change Synopsis.
   - Set Review By to the earliest "Check or remove by" date that the page holds. When no such date is left, clear Review By.

   ```bash
   ntn api v1/pages/<id> -X PATCH -d '{"properties":{"Saved":{"date":{"start":"2026-10-02"}},"Authorization":{"rich_text":[{"text":{"content":"Approved by the owner on 2026-10-02"}}]}}}' < /dev/null
   ```

## A lesson

A lesson goes on the page of the subject it is about, in the section `## Gotchas and lessons`. `database-layout.md`, section "The page body", gives the format of a lesson. This call adds the first lesson, in place of "None yet.":

```json
{"type":"update_content","update_content":{"content_updates":[
  {"old_str":"## Gotchas and lessons\nNone yet.","new_str":"## Gotchas and lessons\n### Check the release branch first\n**Seen:** 2026-09-30, IML-3."}]}}
```

To add a date to a lesson's Seen line, or to mark the lesson promoted, replace that line with the line as you want it. The lesson stays as history.

## A run of a recurring job

The job's `event_` page holds a section `## Runs` with one table. `database-layout.md`, section "The page body", describes the table.

Add a run as the first row under the header row, with one `update_content` call. `old_str` is the header row exactly as you read it. `new_str` is that row followed by the new `<tr>`:

```json
{"type":"update_content","update_content":{"content_updates":[
  {"old_str":"<tr><td>Date</td><td>Who ran it</td><td>What ran</td><td>Result</td><td>Problems and fix</td></tr>","new_str":"<tr><td>Date</td><td>Who ran it</td><td>What ran</td><td>Result</td><td>Problems and fix</td></tr>\n<tr><td>2026-10-05</td><td>agent</td><td>Weekly account load</td><td>1,204 rows loaded, 3 rejected</td><td>3 rows had no region; corrected and loaded</td></tr>"}]}}
```

Then set Saved to today.

The page of a new job gets the table with its header row and its first run.

## Correcting a fact

1. Replace the old text in its section with the new text. The old wording does not stay beside the new text.
2. Put the new source and date in the section's Evidence and limits line.
3. Set Saved to today.

## Replacing a page

1. On the old page, set Status "superseded", and set Superseded by to the new page's key.
2. On the new page, add the old page to the Supersedes relation. Keep every page that is already in the relation.

   ```bash
   ntn api v1/pages/<new-page-id> -X PATCH -d '{"properties":{"Supersedes":{"relation":[{"id":"<old-page-id>"}]}}}' < /dev/null
   ```

A page with the wrong prefix is replaced the same way. Make a new page under the right key, and then replace the old page.

## A proposal

A proposal is a save that the owner has not said yes to. Mark it so that nobody relies on it.

- Mark a new page with Status "proposed", Authorization `Proposed by the agent on <date>; not approved`, and a Synopsis that starts "Proposal, not approved yet:".
- A proposal inside an existing page is a new section. Its first line is `**Proposal, not approved yet:** asked on <date>. Do not rely on this until the owner says yes.`

To remove the marks:

- For a page: set Status "accepted" and Authorization `Approved by <owner> on <date>`, and take the proposal words off the Synopsis.
- For a section: remove its proposal line, and add "Approved by <owner> on <date>." to its Evidence and limits line.

To drop a proposal, remove the section, or delete the proposal page as "Deleting a page" says.

To find the open proposals, use `searching.md`, section "The open proposals".

## Retiring and bringing back

- **Retire a page:** set Status "deprecated", and add a last section `## Retired` with the date, and the owner's words as the reason. Add the section with one `update_content` call. Its `old_str` is the page's last line as you read it, and its `new_str` is that line followed by the new section.
- **Bring a page back:** set Status "accepted", and remove the `## Retired` section. In that call, `old_str` is the section with its line break, and `new_str` is empty.
- **Remove a section or a line:** use the same call, with `new_str` empty. Keep the removed text, so that it can be put back.

## Deleting a page

Move the page to Notion's trash:

```bash
ntn api v1/pages/<id> -X PATCH -d '{"in_trash":true}' < /dev/null | jq -r '.in_trash'
```

- The answer must say `true`. Only then is the page deleted.
- Then clear what pointed at the page: its key in another page's Superseded by, and its id in another page's Supersedes. Name each page you changed in your reply.
- A deleted page can be brought back for a limited time. The page stays in Notion's trash, and sending `{"in_trash":false}` restores it. Notion empties its trash itself later.

## Linking a page to work items

Always write the IDs in Work item IDs. `database-layout.md`, section "Links to work items", gives the form.

When the work items are in Notion too, also set the Work items relation. Set it to every work item page id: the ids that are already in the relation, which you read first, and the new id.

```bash
ntn api v1/pages/<page-id> < /dev/null | jq -c '.properties["Work items"].relation'
ntn api v1/pages/<page-id> -X PATCH -d '{"properties":{"Work items":{"relation":[{"id":"<item-page-id>"}]}}}' < /dev/null
```

Find a work item's page id with `using-work-tracker`.

## Merging two pages about one subject

`curating-project-memory` decides when two pages about one subject are merged. These are the steps in Notion. One page is kept, and the other page is replaced:

1. Add each section of the other page to the kept page, before `## Gotchas and lessons`, with one `update_content` call. The lessons of the other page go with its sections, and each section keeps its source.
2. Join the two pages' Work item IDs lists and Work items lists, with no repeats.
3. Replace the other page, as "Replacing a page" says.
4. Update the kept page's Synopsis and Saved.

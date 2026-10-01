# Comments, source files, tags, and links

Purpose: the agent's running notes, the source files a work item uses, and the
links between items.

## Contents

- Comments: the agent's running notes
- Source files and the Sources list
- Tags
- Links between items

## Comments: the agent's running notes

Notion comments sit beside the page, apart from its text.

```bash
ntn api v1/comments -d '{"parent":{"page_id":"<page-id>"},"markdown":"Helper agent finished **P1-T02**; 12 tests pass."}' < /dev/null | jq -r .id
```

Read an item's comments, oldest first (the owner's comments too):

```bash
ntn api v1/comments block_id==<page-id> < /dev/null | jq -r '.results[] | "\(.created_time)\t\(.display_name.resolved_name // "")\t\(.rich_text | map(.plain_text) | join(""))"'
```

Comments made through `ntn` show the owner's name, because `ntn` signs in
as him. Start the agent's notes with "Agent:" so they can be told apart.

## Source files and the Sources list

Meeting transcripts, documents, and other source material go in the item's
Files property, and each gets one line in the page's Notes → Sources list.

In a Salesforce project, a client file stays in `delivery/`, as `AGENTS.md`
says: save it with the publish-docs skill and never upload it to the page.
Its Sources line names the `delivery/` path.

1. Upload the file (at most 20 MB; for a bigger file, stop and tell the
   owner it is too big to upload this way). Text the owner pasted: write
   it, under its `YYYY-MM-DD-<short-name>.md` name, into a scratch folder
   (`ntn-basics.md`, "Sending a body", says how to make one), never inside
   the project. Upload it from there, and remove the scratch folder once
   the Files property is saved and read back.

   ```bash
   ntn files create --filename "<name>" --content-type "<type>" --json < "<path>" | jq -r '.id, .status'
   ```

   The status must be `uploaded`. Use the file's real type, for example
   `text/plain`, `text/markdown`, `application/pdf`, `image/png`, or
   `image/jpeg`; Notion refuses a type it does not support.
2. Read the files already there, then send the whole list with the new one
   last. A file already there is kept by sending it back as it came:

   ```bash
   ntn api v1/pages/<page-id> < /dev/null | jq -c '.properties.Files.files'
   ```

   ```json
   {"properties": {"Files": {"files": [
     {"type": "file", "name": "kickoff-notes.txt", "file": {"url": "<url exactly as read>"}},
     {"type": "file_upload", "name": "interview-2.txt", "file_upload": {"id": "<upload id>"}}
   ]}}}
   ```

   Send it within one hour of the upload: an upload not attached by then
   expires, and the read URLs expire too.
3. Add its line under Sources (replace the template's example line the
   first time): `- interview-2.txt — second owner interview; the three
   login methods (R-03).`
4. Anything taken from a source cites it where it is used ("from
   interview-2.txt").

To read a saved file again later, see `queries.md`, "Reading a source
file": a file's address lasts one hour, so download a fresh copy each time.

## Tags

Tags are free labels. Send the whole list; a new name becomes a new option.
Names cannot hold commas.

```bash
ntn api v1/pages/<page-id> -X PATCH -d '{"properties":{"Tags":{"multi_select":[{"name":"ios"},{"name":"payments"}]}}}' < /dev/null
```

Reuse an existing option's exact spelling (read them with
`ntn api v1/data_sources/{{WORK_ITEMS_DS}} < /dev/null | jq -r '.properties.Tags.multi_select.options[].name'`).

## Links between items

| Link | Property | Meaning |
| --- | --- | --- |
| Blocked by | "Blocked by" on this item (Notion fills "Blocking" on the other item) | This item cannot finish until the other item is Done, so the other item comes first. |
| Related | "Related" (one-way) | Connected, no order. |
| Parent | "Parent item" (other side "Sub-items") | See items.md, "Moving an item under another parent". |

Send the whole list of page ids for the property:

```bash
ntn api v1/pages/<page-id> -X PATCH -d '{"properties":{"Blocked by":{"relation":[{"id":"<other-page-id>"}]}}}' < /dev/null
```

Never link an item to itself. Also write the linked items' IDs in the
Overview's "Related items" line, so the page text lists every link.

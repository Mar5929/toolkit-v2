# This Project's Records in Notion

"Toolkit settings" in `PROJECT.md` says which of this project's records are in Notion: its work items, its memory, or both.

- Read and change work items kept in Notion only through `using-work-tracker` and `running-work-item-lifecycle`.
- Read and change memory kept in Notion only through `curating-project-memory` and `using-memory-store`.
- Both rules hold whichever Notion tool is used: a `Notion:` plugin command, the connector, or the browser. They hold when a message carries a Notion page link, and when the owner says to search Notion.
- Never run the `Notion:tasks:build` command on a work item of this project. It can mark the item Done without the owner's yes.
- When you create or update a record in Notion, fill or update every field on that record that you have information for. A memory record holds the fields `using-memory-store` names.

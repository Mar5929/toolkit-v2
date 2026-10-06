# This Project's Records in Notion

This rule says which skills read and change the records that this project keeps in Notion. "Toolkit settings" in `PROJECT.md` says which of this project's records are in Notion: its work items, its memory, or both.

- Read and change work items that are kept in Notion only through `using-work-tracker` and `running-work-item-lifecycle`.
- Read and change memory that is kept in Notion only through `curating-project-memory` and `using-memory-store`.
- The rule for work items and the rule for memory apply whichever Notion tool is used: a `Notion:` plugin command, the Notion connector, or the browser. They also apply when a message holds a link to a Notion page, and when the owner says to search Notion.
- Never run the `Notion:tasks:build` command on a work item of this project. That command can mark the work item Done without the owner's yes.
- When you create or update a record in Notion, fill or update every field of that record that you have information for. A memory record holds the fields that `using-memory-store` names.

# Recovering from Notion work-tracker problems

Use this reference when a record or call differs from the expected form. Preserve owner content and Notion blocks while resolving the problem.

## Known problems

Each line names something that went wrong, and what to do.

- **The work item template showed up as a work item.** Notion lists the template as a row of Work Items, with an empty title. Put `{"property":"Work item","title":{"is_not_empty":true}}` in the filter of every Work Items query.
- **A card had no title.** A card that the owner made and gave no title is hidden from the Work Items views. To list such cards, query Work Items for an empty title with Archived false. Then drop the ids that `ntn api v1/data_sources/<work-items-data-source-id>/templates < /dev/null | jq -r '.templates[].id'` prints, because the work item template is one of them. Ask the owner whether to name or archive each remaining card.
- **A card that the owner made by hand had an empty State.** A card made with "New" gets the template's sections, and its properties are empty. Give it State Backlog, Status Not Started, and the other defaults in the call that creates a work item, in [work-tracker-commands.md](work-tracker-commands.md). Record that the owner made the card by hand and which defaults you supplied in Recent History.
- **A work item's page had no sections.** The owner made it with "Empty" in the New menu, or it was made before the project had a default template. Tell the owner, and offer to add the sections. To add them, give the page the default template once, with the call in [work-tracker-commands.md](work-tracker-commands.md), and wait for the content. `using-notion-cli/references/ntn-commands.md`, section "Waiting for a template", says how to wait. The page's properties are kept. Record that the owner made the page by hand and that you filled in the template in Recent History.
- **Notion refused to create a work item because the Work Items database has no default template.** Tell the owner. Only the Notion app can set the default template.
- **A work item could not be found by its number.** The work item may be in the trash or outside this project. Tell the owner, and never make a second work item with the same title.
- **A change that deleted lines also removed a line next to them.** To delete lines, send them in `old_str` together with one neighbouring line that stays, and send only that neighbouring line as `new_str`. After the call, read the page again and compare it with the text that you read before. Write a lost heading or paragraph again from the earlier text. When a `<database …>`, `<page …>`, or `<unknown …>` line is lost, stop and tell the owner which line, because such a line cannot be put back as text.
- **A read or a write of the page text answered `truncated: true`.** The "Embed Github" block causes this answer, and the answer names the block's id in `unknown_block_ids`. When `unknown_block_ids` holds only that block's id, the answer needs no action.
- **A work item's State and Status did not match.** When the owner drags a card to another column in a view, only the Status changes. Reconcile the fields from the owner's direction and recorded work using `references/lifecycle-rules.md`, "Read the work item before you act".
- **A search found nothing for words that are in a page's text.** `v1/search` matches page titles only. First narrow the work items by title, tag, type, parent, or status. Then read the page text of each candidate.
- **A call to Phases failed on Status.** In Phases, Status is a `select`, and the call sent a `status`. Send Status as a `select`.
- **A task had an empty Status.** The task was made by hand. Set its Status to Not Started.
- **A phase or a task had an empty "Work item" and an ID that is not a project ID.** The row was made by hand. Ask the owner whether the row belongs to the project or to a work item.
- **A work item was at a fourth level.** Tell the owner which work item is at level 4.

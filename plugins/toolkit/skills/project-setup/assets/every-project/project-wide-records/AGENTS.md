# Project-wide records

This folder holds five kinds of records that connect information across work items. Use `filing-project-records` for the intake, change, and review procedure. Copy the matching file from `templates/` when a record meets its creation threshold. Keep one record per question, domain, person, shared target direction, or source intake.

| Information | Place it here when | Home |
| --- | --- | --- |
| Domain map | An area has enough related records that an agent needs a route through them | `domains/` |
| Shared question | An unresolved issue affects several items or the whole project | `questions/` |
| Person and authority | `PROJECT.md`'s short people table cannot hold needed role or decision detail | `people/` |
| Target architecture | Several items depend on the same intended structure | `target-architecture/` |
| Intake receipt | One source affects several items or project-wide records | `intake/` |

- Name files `domains/<domain-slug>.md`, `questions/PQ-<number>-<topic-slug>.md` (for example `PQ-001-account-owner.md`), `people/<person-or-team-slug>.md`, `target-architecture/<domain-or-topic-slug>.md`, and `intake/YYYY-MM-DD-<source-slug>.md`. Use lowercase ASCII words joined by hyphens for each slug. Search for an existing record before creating another for the same subject.
- A shared question's `PQ-` ID is separate from a work item's `Q-` ID. For a new shared question, use one more than the highest existing `PQ-` number; never reuse an old number. Keep the same ID when its answer changes. For two sources with the same intake date and slug, check the source anchor and add `-2`, `-3`, and so on to a new filename.
- Keep an item-only question, requirement, design, task, status, and decision in its work item. The chosen work tracker owns that item.
- Keep accepted behavior in `requirements/`, and verified current structure in `system-guide/`. Target architecture is intended direction, with its approval status stated; delivery alone does not verify current structure.
- Preserve each original source once in its assigned source home. An intake receipt links to it and records where findings went; it does not copy a transcript or source document. Salesforce client files stay in `delivery/` or the project's established `engagement/` folder. For other projects, use an anchor work item and its tracker-specific source location. Resolve an unassigned source home before creating a receipt.
- Keep the authoritative answer in the owning item's Questions and Answers, or in the approved project-wide decision source when no item owns it. A shared question links there and stays open for incorporation until every affected record is checked. Use the existing approval and memory rules when an answer changes.
- Link records by stable work-item ID and a usable path or page link. Do not keep copied statuses, counts, full designs, or temporary Notion file download URLs here.
- Keep `PROJECT.md`'s people table short. Exclude unnecessary personal information from person records. Current State names a shared question only while it blocks active work.
- Ordinary records here are Git-tracked project documents and use `publish-docs` when saved to the default branch. This `AGENTS.md` changes agent instructions and requires the reviewed instruction-file route.

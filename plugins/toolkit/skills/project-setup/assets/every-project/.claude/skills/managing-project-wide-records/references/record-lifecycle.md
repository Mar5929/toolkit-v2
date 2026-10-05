# Record lifecycle

Use the model templates in `project-wide-records/templates/`. Fill their
fields with facts and links; remove fill-in prompts from a created record.
Before creating any record, search its folder, the related domain map, and
affected work items for the subject or source anchor. Update an existing
record when it already covers the same subject. Do not create another file
to express a changed status or answer.

## Names and IDs

Use lowercase ASCII words separated by single hyphens for every slug.
Keep a person's or team's name recognizable; leave unrelated personal
details out of the name. Do not rename a file just because its subject's
status changed. If two different subjects produce the same slug, add a
short distinguishing word.

| Folder | File name |
| --- | --- |
| `domains/` | `<domain-slug>.md` |
| `questions/` | `PQ-<number>-<short-topic>.md` (for example `PQ-001-account-owner.md`) |
| `people/` | `<person-or-team-slug>.md` |
| `target-architecture/` | `<domain-or-shared-topic-slug>.md` |
| `intake/` | `YYYY-MM-DD-<source-slug>.md` |

For a new project question, list all `questions/PQ-*.md` files, including
answered and incorporated ones. Take the highest numeric `PQ-` ID plus one,
using three digits or more as needed. Never reuse an ID. `PQ-` is distinct
from one work item's `Q-` IDs. Put the same PQ ID in the file and in links.
For a same-day intake name already used by another source, use `-2`, then
`-3`, after checking the source anchor; the same source belongs in its
existing receipt. Do not create an index file or a second ID registry.

| Record | Create when | Keep it current | Close or supersede when |
| --- | --- | --- | --- |
| Domain map | A domain has enough related sources, items, requirements, architecture, and questions that a new agent needs one route through them | Update links and last review date when related records change; never copy status or maintain counts | Domain scope changes or it is replaced; point to the successor |
| Project question | One issue affects several items or the whole project | Maintain owner, source, answer history, affected records, and incorporation checks | Every check is verified; keep the answer source and history |
| Person | `PROJECT.md`'s short role table cannot hold relevant project role or decision authority | Confirm authority and areas of knowledge with a source and date; link related questions | Role changes or the person leaves; keep the old source, mark the record historical or superseded |
| Target architecture | Several items depend on one intended structure | Keep proposed, owner-approved, or superseded status and decision source; update affected items and gaps | After verified delivery, link the matching `system-guide/` record and retain owner-approved status; when the owner replaces the direction, mark it superseded and point to the successor |
| Intake receipt | One source affects several items or project-wide records | Track each created, changed, contradicted, and open destination with readback results | Every finding has a verified destination, rejection reason, or named open question |

Review links when a source is corrected, a question is answered, a work
item changes, or delivered behavior is verified. Do not close a record
merely because the current session ended. Keep the authoritative answer
and its history in its existing home. Do not copy unnecessary personal
information into a person record.

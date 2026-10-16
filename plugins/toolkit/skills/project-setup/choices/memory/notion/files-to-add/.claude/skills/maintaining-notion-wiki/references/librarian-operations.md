# Librarian operations

## Coordinating a run

- Scheduled and on-demand runs follow the same steps. Read the scheduler, access, and coordination settings from the project context page. Don't activate a schedule just because one is documented.
- Processing status alone isn't a lock. Join, wait for, or coordinate with an active run.
- Re-read each capture before processing it, note its Last updated and sources in Processing notes, and set it to Processing. Re-read it again before finishing; if it changed, reconcile the new evidence or leave a follow-up.

| Processing status | When |
| --- | --- |
| New | Awaiting its first pass |
| Processing | The current writer is on it |
| Needs review | Unresolved or needs recovery; the librarian owns the follow-up |
| Filed | Every destination write was read back and verified |
| Dismissed | Duplicate, unusable, or not for the wiki; keep the reason |

- For partial success, keep the completed links and note what's missing and the next step. When resuming, check existing destinations before repeating a write; an abandoned Processing row may have done some work.
- Maintenance with no capture records its links, findings, and next step in the run record.

## Reading Notion

- Use the tools available to the librarian and confirm their access to this project. With the CLI, follow `using-notion-cli`. Stop dependent writes if access or identity can't be confirmed.
- Read properties and page content separately. Follow child pages, child databases, and data sources; read nested blocks and whole bodies. A title or search excerpt is not the record.
- A linked view may be filtered, so check its underlying source and project scope.
- Search by subject words, aliases, source IDs, and related work items. Match work item IDs whole. Include records without a Record Key.
- Before writing, check fields and relations as `wiki-schemas.md` says.
- If a source isn't reachable from this host, use captured evidence with its origin, or leave the capture Needs review with what's missing.

## Writing records

- Re-read the record before each change and build edits from that read. Keep IDs, child references, unsupported blocks, views, and unrelated content.
- Merge JSON metadata, keeping unknown keys. Relation and multi-value writes replace the list, so merge first.
- If a create's outcome is uncertain, search for it before retrying.
- Update the existing subject or system-area record when one fits, and link the authoritative home instead of copying it. One capture can update several destinations.
- For Current state, read the whole page and current tracker records, drop resolved context, keep what helps resume, keep its parts (Active work, most important first; Coming up; Waiting on; Standing jobs and shared files; Where we stopped), and update its date, sources, and editor. It's a snapshot, not a log.
- In Long-Term Memory, don't copy one claim into every collection just to fill them.

## Metadata

- Keep dates, the actual editor, provenance, type, and replacement links accurate, using native fields where they exist and a short labeled body section where they don't.
- Memories mapping: Saved is the last change; Source note is dated provenance; Other fields (JSON) holds modified_by, context, source_kind, and extra tags; Tags includes the record type; Authorization states the approval or filing authority. Keep the creation time, Source, Author, and Agent. Set Record Key and Keywords on keyed records. Use Supersedes and Superseded by for replacements, Last verified only after checking the source, and Review By for time-sensitive evidence.
- Product Wiki: keep Approved by and Approved on, Source, Related documentation, and review dates. Set Documentation status separately from Implementation status.
- Glossary: keep Source, Last checked, the contextual meaning, and naming history.

## Corrections and replacements

- A correction or added detail updates the record in place, with no contradicting text left beside it. Check other destinations and pending captures for the same claim.
- A replacement keeps dated history and links both ways: the Memories record becomes superseded, Product Wiki documentation Deprecated, or the glossary term Retired. If part of the old record is still current, mark only the replaced section.

## Maintaining existing content

Even with an empty inbox, reconcile stale, contradictory, or misplaced content; consolidate duplicates into their authoritative home and repoint incoming links before retiring a copy; and check navigation links. Age alone doesn't make something false. Keep uncertainty visible when sources can't settle it.

## Forgetting and security

Find the content in every destination and pending capture, remove it, and verify. Never copy it into another record or note; keep only what's needed to report the result. Ask before deleting a whole record when the scope is unclear. Remove secrets without repeating them. Trash isn't permanent deletion, so report that limit honestly.

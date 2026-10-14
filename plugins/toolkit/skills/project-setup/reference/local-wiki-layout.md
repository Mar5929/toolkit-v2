# Moving existing records into the local wiki

Use this reference before setup or an update compares or copies new wiki paths into a project with existing records. The move is complete when the approved records and links are verified at their new paths, the originals are recoverable, and the project's guides name the verified record homes. A setup check only reports the proposed move; it does not move records or change routing.

## Review the project and proposed mapping

Read the project's actual record homes, guides and setup choices. The Toolkit layout uses these record paths:

| Existing local path | Toolkit record path |
| --- | --- |
| `system/` | `wiki/product-wiki/` |
| `reference/` | `wiki/reference/` |
| `wiki/reference/outside-docs/` | `wiki/reference/ai-external-knowledge/` |

 These paths hold project records. The `reference/` folders inside skills keep their paths. The folder names change; the records' meanings, approvals, rule IDs, metadata and storage policies do not.

Inspect the old and new paths in the main checkout, including untracked and ignored files. List the records, customized guides, links and destination conflicts affected by the move. Include links in project maps, instructions, source indexes, diagrams, work items and memory. Inspect both inbound and outbound relative links: adding a parent folder changes their targets even when their text does not name the old folder.

Show the owner the concrete mapping, conflict resolution, preservation method and required link changes. Reuse an existing approval that covers that scope. When a destination already holds records, compare the records and agree how to reconcile them without overwriting either copy. When the owner retains another layout, keep it and prepare the setup copy for those verified record homes before installation, as the next section describes. Do not install duplicate templates at the proposed destination.

A project using Notion Product Wiki retains its configured authoritative homes. Do not move those records locally or restore equivalent authoritative local documentation. A storage-choice change or Notion migration follows [update guidance](update.md), "Changing a setup choice", with its verified cutover procedure.

## Prepare instructions for the verified record homes

Before installing skills or copying files, choose the record homes that will remain authoritative when the change is applied. When the owner retains a custom layout or declines a move, adapt the setup copy's path-bearing skills, guides, templates, checks and project maps to those verified homes. Change only the affected project paths; retain each procedure's meaning and the skill's own reference paths. Review the adapted copy for conflicting old and new routes before installation.

When a migration is unresolved, preserve the installed path-bearing operational files until its destinations and links are verified. Unrelated updates may proceed, but do not install new skills that route to unverified wiki paths while the records remain at old paths. Exclude the pending destinations from file copying and record the deferred updates. Apply this rule to a whole skill folder when replacing the folder would replace an instruction that must remain installed.

## Apply the approved move

Use the project's shared-repository procedure and a separate worktree for tracked changes. Preserve the originals recoverably before changing them: Git history can preserve committed originals; untracked and ignored records need a verified backup outside the folders being changed. Account for concurrent edits before moving any record. Keep a record of the approved mapping and completed moves so an interrupted update can resume without duplicating records.

Move the owner's content and customized guides before copying missing toolkit files. Do not replace populated documents with starter templates. Preserve each `AGENTS.md` and `CLAUDE.md` pair. Apply approved structural changes under [placing-files guidance](placing-files.md) or [update guidance](update.md), keeping owner facts and instructions.

Correct links and path references within the approved scope. Keep filenames and IDs when the layout move does not require changing them. Verify the content, metadata, diagrams and links at their destinations before switching project maps and operational guide routes. Retire the old active paths only after this verification and with the approved preservation method; retain a single authoritative body for each record.

Ignored records such as local work items and memory remain in the main checkout. Preview their link corrections and preserve originals before the move, but apply those corrections only after the tracked branch is merged. Until then, those records must not point to files that are absent from the default branch. Do not change their facts, status or memory lifecycle as part of a path correction. Records in external trackers require their own authorized scope for link updates.

## Verify and report

Check the moved records against the preserved originals, allowing only the approved path and structural changes. Read the affected guides and resolve representative links from their actual new locations, including diagrams and links from ignored records after the merge. Confirm that selected storage choices and record ownership remain unchanged and that no empty template displaced an existing record.

Report the mapping, preservation location, verified moves and links, retained custom layouts, conflicts and pending corrections. Do not report a migration complete while ignored-record or required external-link corrections remain unresolved. Keep the current routes wherever a move failed or has not been verified.

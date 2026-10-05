# Draft folder instruction files

## system/AGENTS.md (every project)

- This folder is the approved description of the system. Change a document only with `filing-project-records`, step "update a system document".
- A document changes only because of a decision. Write the DEC-### in "Last changed via" and add a Changelog row: date, change, DEC, work item.
- Status is Not started, Draft, or Approved. Only the owner's decision makes a document Approved.
- Give each rule an ID and never reuse one: CON in `constraints.md`, ARC in `architecture.md`, DAT in `data-model.md`, SEC in `security-model.md`, AUT in `automation.md`, INT in `integrations/`.
- Mark each rule Approved, or Built with the work item that delivered it.
- "Open questions" holds DEC-### links only. The question's text lives in `DECISIONS.md`.
- A proposal that is not approved stays in the work item's `DESIGN.md`.
- Never infer a glossary definition. Take it from the owner or a named source.

## sources/AGENTS.md (every project)

- Every original the project keeps goes here, one SRC-### each. Use `filing-project-records`, step "file a source".
- Never edit, rename, or delete a file once it is filed. A corrected version is a new SRC that names the old one.
- Add the entry to the list in the same edit: ID, date received, who it came from, what it is, and which work items used it.
- An original that should not be in Git (a large recording, a file with personal data) still gets its SRC number and a line saying where it is kept.
- Other records point here by SRC-###. Never copy a source's text into a work item or a system document.
- A source is somebody's words, not the project's truth. What the project decided from it goes in `DECISIONS.md` or `system/`.

## work-items/AGENTS.md (only with local work items)

- Temporary work lives here: one folder per item, `<ID>-<name>/`, holding `<ID>.md` and `DESIGN.md`.
- Git does not track this folder. It exists only in the main checkout, the first path `git worktree list` prints.
- Read and change items only through `using-work-tracker`. Find an item by its ID, never by its path.
- The owner may move or rename folders. Never move, archive, or rename one yourself.
- Nothing here is the lasting record. At close, what other items need moves to `system/` and `DECISIONS.md`.
- Originals go in `sources/`; the item names them by SRC-###. Leave any other file the owner put here and tell him.

## memory/AGENTS.md (only with local memory)

- Memory holds where work stopped, and pointers: an ID and a link. It never restates a fact. The fact lives in the record the pointer names.
- Change this folder only through `curating-project-memory`.
- The session-start hook writes `MEMORY.md`. Never edit it.
- Git does not track this folder. It exists only in the main checkout.

## delivery/AGENTS.md (every project)

- Releases, deployments, data migrations, and client handoffs. Start each from the matching template folder when there is one.
- Name a work item's folder `<ID>-<short-name>` and a release folder `<YYYY-MM-DD>-<release-name>`.
- Name work items by ID, never by path.
- Data loads and backups are never committed.
- An original received from someone else goes in `sources/`, not here.

## reference/AGENTS.md (every project)

- Outside documentation goes in `outside-docs/`, one folder per topic, with a record of where each page came from.
- The record of the system as it is today goes in `current-system/`, with the date and the environment it was observed in.
- Nothing here is the project's truth. What the project decided goes in `system/` or `DECISIONS.md`.
- Never edit a captured page. When it disagrees with `system/`, `system/` wins; say so.


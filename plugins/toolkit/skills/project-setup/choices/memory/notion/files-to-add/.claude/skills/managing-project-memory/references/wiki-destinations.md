# Wiki destinations

The Project Wiki is the parent page. Current state and Long-Term Memory are pages; Wiki Inbox, Terminology Glossary, and Product Wiki are databases. Read the live schema before querying, and page through every result.

| Destination | Holds | Doesn't hold |
| --- | --- | --- |
| Current state | A derived snapshot of priorities, workstreams, blockers, and where to resume | Work status, approvals, or next actions (the tracker owns those) |
| Long-Term Memory | Lasting project context, non-product decisions, and lessons that no other record owns | Product docs or terms |
| Terminology Glossary | Established meanings, aliases, and naming history | Tentative meanings (those stay in working records) |
| Product Wiki | Finalized behavior, architecture, and product decisions with rationale | Working designs (those stay in the item's Solution Design) |

There's no local `DECISIONS.md`, specification, or glossary in a Notion-memory project.

## Current state

Read the whole page and its links. It's a snapshot, so check its date and any pending captures against current work before relying on it. Keep the project's own headings if customized.

## Long-Term Memory

Five collections: Projects (this project's row), Topics (groups of subjects), Memories (durable subject records), Entities (named things), and Facts (dated statements with validity and sources).

- Query by subject, aliases, Synopsis, Keywords, and linked project or work item, then follow relations and sources. Include owner-written records with no Record Key.
- Trust accepted, current records; follow supersession links. Proposed, informational, and inferred content stays uncertain; deprecated, rejected, and superseded records are history.
- Check Review By, validity dates, and sources before relying on a claim that can change.
- Something qualifies only if it's project-specific, costly to lose, came from the owner or work with them, and no other record owns it.

## Terminology Glossary

Query Term and its context fields for the words and their aliases. Current terms apply in their stated context; Needs review is unsettled; Retired terms explain history and point to replacements.

## Product Wiki

Query Name, Summary, System area, and Category, and read matching bodies, sources, and related docs. Documentation status and Implementation status are separate: approved documentation can describe planned work, and only Live means implemented. Draft, In review, and Needs review are not final. Check Approved by, Approved on, and Last reviewed before relying on a claim.

# Wiki destinations

The Project Wiki is the parent page. Current state and Long-Term Memory are pages; Wiki Inbox, Terminology Glossary, and Product Wiki are databases. Before querying, check field names and options as `maintaining-notion-wiki/references/wiki-schemas.md` says, and page through every result.

| Destination | Holds | Doesn't hold |
| --- | --- | --- |
| Current state | A snapshot, kept current by agents, of active work, coming dates, waits, standing jobs and shared files, and where we stopped | Work status, approvals, or next actions (the tracker owns those) |
| Long-Term Memory | Lasting project context, non-product decisions, and lessons that no other record owns | Product docs or terms |
| Terminology Glossary | Established meanings, aliases, and naming history | Tentative meanings (those stay in working records) |
| Product Wiki | Finalized behavior, architecture, and product decisions with rationale | Working designs (those stay in the item's Solution Design) |

There's no local `DECISIONS.md`, specification, or glossary in a Notion-memory project.

## Current state

Read the whole page and its links. Agents update it as `current-state.md` says. Check changeable lines against current work items before relying on them.

## Long-Term Memory

Long-Term Memory is a set of collections; `maintaining-notion-wiki/references/wiki-schemas.md` says what each holds and lists its key fields.

- Query by subject, aliases, Synopsis, Keywords, and linked project or work item, then follow relations and sources. Include owner-written records with no Record Key.
- Trust accepted, current records; follow supersession links. Proposed, informational, and inferred content stays uncertain; deprecated, rejected, and superseded records are history.
- Check Review By, validity dates, and sources before relying on a claim that can change.
- Something qualifies only if it's project-specific, costly to lose, came from the owner or work with them, and no other record owns it.

## Terminology Glossary

Query Term and its context fields for the words and their aliases. Current terms apply in their stated context; Needs review is unsettled; Retired terms explain history and point to replacements.

## Product Wiki

Query Name, Summary, System area, and Category, and read matching bodies, sources, and related docs. Documentation status and Implementation status are separate: approved documentation can describe planned work, and only Live means implemented. Draft, In review, and Needs review are not final. Check Approved by, Approved on, and Last reviewed before relying on a claim. Code and tests show what was built; they never prove that the owner approved a design.

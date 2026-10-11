# Wiki Inbox capture and retrieval

Wiki Inbox contains submissions for the librarian, not finalized knowledge. Read its database and data source identifiers under Notion memory in `PROJECT.md`. Use `using-notion-cli` for access, pagination and verified Notion operations; inspect the live fields before writing.

## Capture a change

Search matching captures and destination records before creating a submission. Add evidence in place only to an unclaimed New or Needs review capture about the same change; preserve its contributor and sources. When a matching row is Processing or Filed, create a linked follow-up instead. The librarian owns processing notes, outcomes and filing links. For a new capture, create a row with Name, Capture, Source and Contributor, and set Processing status to New. Include source links or IDs, relevant dates, work-item links, uncertainty, correction targets and existing approval evidence in Capture or Source. Destination areas may suggest Current state, Long-term memory, Terminology glossary or Product wiki; the librarian confirms placement.

Read the row and its fields back. Preserve originals and retry an uncertain create only after searching for the returned ID or matching capture. Do not claim the capture is filed merely because it was saved.

## Read recent information

Query New, Processing and Needs review rows relevant to the subject, including their Capture and Source fields and supporting page bodies. Check Last updated against the source and current work. Filed rows link verified destinations in Filed links. Dismissed rows retain the reason in Processing notes. Needs review means unresolved librarian work, not an owner review obligation.

When correcting or forgetting, identify affected records and captures without copying excluded security information into another record. Invoke `maintaining-notion-wiki` for immediate reconciliation.

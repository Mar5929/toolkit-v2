# Wiki schemas

These are the fields of the owner's wiki template as of 2026-10-16. Before querying or writing a wiki database, read the installed project's live schema, options, and relation targets, because a project may differ from this list. This list is a reference: never add or change a database's fields or options without the owner's approval. System-managed fields are never written.

## Wiki Inbox

| Property | Type | Notes |
| --- | --- | --- |
| Name | title |  |
| Capture | text |  |
| Source | text |  |
| Contributor | text |  |
| Destination areas | multi_select | Long-term memory, Terminology glossary, Product wiki |
| Processing status | status | New, Processing, Needs review, Filed, Dismissed |
| Processing notes | text | Librarian only |
| Filed links | text | Librarian only |
| Processed at | date | Librarian only |
| Captured at, Last updated | system | Never write |

## Terminology Glossary

| Property | Type | Notes |
| --- | --- | --- |
| Term | title |  |
| Meaning here | text |  |
| System or context | text |  |
| Distinction or alias | text |  |
| Naming changes and aliases | text |  |
| Source | text |  |
| Status | select | Current, Needs review, Retired |
| Last checked | date |  |

## Product Wiki

| Property | Type | Notes |
| --- | --- | --- |
| Name | title |  |
| Summary | text |  |
| System area | text |  |
| Category | select | System architecture, Integration architecture, User personas, Security requirements, Functional requirements, User experience, Data model, Non-functional requirements, Operations, Product decisions |
| Documentation status | status | Approved, Deprecated, In review, Needs review, Draft. Separate from Implementation status |
| Implementation status | select | Not assessed, Planned, Partially implemented, Live, Retired, Not applicable |
| Approved by, Owner | person |  |
| Approved on, Last reviewed, Review due | date |  |
| Source | url |  |
| Related documentation | relation | Check project scope |
| Last updated | system | Never write |

## Long-Term Memory

Long-Term Memory has five collections: Projects (this project's row), Topics (groups of subjects), Memories (durable subject records), Entities (named things), and Facts (dated statements with validity and sources). Their schemas are large and owner-defined. The fields the procedures depend on:

- **Memories:** Title, Synopsis, Keywords, Record Key, Kind, Status (informational, proposed, accepted, superseded, deprecated, rejected), Lifetime, Review By, Last verified, Saved, Source note, Source, Author, Agent, Other fields (JSON), Authorization, Tags, Supersedes, Superseded by, Project, Topic, Work items.
- **Facts:** Subject, Predicate, Object, Confidence, Valid From, Valid Until, Invalidated At, Review By, Source, Project, Work items.
- **Entities:** Name, Aliases, Kind, Project, Source, Work items.
- **Topics** and **Projects:** Name, Description, and their links to each other.

## Relations to check before writing

Project, Source, and Work items relations must point at this project's collections, and every Work items relation must point at this project's work tracker. A relation copied from the template is not proof. When a relation points elsewhere, fix it through setup before writing.

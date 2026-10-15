# Wiki schemas

These are the owner's template fields as of 2026-10-11. Always inspect the installed project's live schema, options, and relation targets before using them. They're a reference, not permission to add fields or options. System-managed fields are never written.

## Wiki Inbox

| Property | Type | Notes |
| --- | --- | --- |
| Name | title |  |
| Capture | text |  |
| Source | text |  |
| Contributor | text |  |
| Destination areas | multi_select | Current state, Long-term memory, Terminology glossary, Product wiki |
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
| Documentation status | status | Separate from Implementation status |
| Implementation status | select | Not assessed, Planned, Partially implemented, Live, Retired, Not applicable |
| Approved by, Owner | person |  |
| Approved on, Last reviewed, Review due | date |  |
| Source | url |  |
| Related documentation | relation | Check project scope |
| Last updated | system | Never write |

## Long-Term Memory

Five collections: Projects, Topics, Memories, Entities, and Facts. Their schemas are large and owner-defined, so read them live. The fields the procedures depend on:

- **Memories:** Title, Synopsis, Keywords, Record Key, Kind, Status (informational, proposed, accepted, superseded, deprecated, rejected), Lifetime, Review By, Last verified, Saved, Source note, Other fields (JSON), Authorization, Tags, Supersedes, Superseded by, Project, Topic, Work items.
- **Facts:** Subject, Predicate, Object, Confidence, Valid From, Valid Until, Invalidated At, Review By, Source, Project, Work items.
- **Entities:** Name, Aliases, Kind, Project, Source, Work items.
- **Topics** and **Projects:** Name, Description, and their links to each other.

All Work items relations must point at this project's tracker; check before writing.

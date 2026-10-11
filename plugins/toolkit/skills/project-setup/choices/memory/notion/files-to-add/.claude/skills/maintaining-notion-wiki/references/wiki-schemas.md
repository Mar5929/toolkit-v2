# Wiki database schemas

These template fields were inspected on October 11, 2026. Before using them, inspect the installed project’s live data source, options and relation targets. Read identifiers from Project context and connections, or `PROJECT.md` when working locally; copied template IDs must not be used. Preserve system-managed fields.

## Wiki Inbox

| Property | Type | Options or relationship |
| --- | --- | --- |
| Capture | text |  |
| Captured at | created_time | System managed |
| Contributor | text |  |
| Destination areas | multi_select | Current state, Long-term memory, Terminology glossary, Product wiki |
| Filed links | text |  |
| Last updated | last_edited_time | System managed |
| Name | title |  |
| Processed at | date |  |
| Processing notes | text |  |
| Processing status | status |  |
| Source | text |  |

## Terminology Glossary

| Property | Type | Options or relationship |
| --- | --- | --- |
| Distinction or alias | text |  |
| Last checked | date |  |
| Meaning here | text |  |
| Naming changes and aliases | text |  |
| Source | text |  |
| Status | select | Current, Needs review, Retired |
| System or context | text |  |
| Term | title |  |

## Product Wiki

| Property | Type | Options or relationship |
| --- | --- | --- |
| Approved by | person |  |
| Approved on | date |  |
| Category | select | System architecture, Integration architecture, User personas, Security requirements, Functional requirements, User experience, Data model, Non-functional requirements, Operations, Product decisions |
| Documentation status | status |  |
| Implementation status | select | Not assessed, Planned, Partially implemented, Live, Retired, Not applicable |
| Last reviewed | date |  |
| Last updated | last_edited_time | System managed |
| Name | title |  |
| Owner | person |  |
| Related documentation | relation | Related Product Wiki documentation; verify project scope |
| Review due | date |  |
| Source | url |  |
| Summary | text |  |
| System area | text |  |

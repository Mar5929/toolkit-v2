# Notion access, search and verified operations

Use the Notion tools available to this librarian and verify their access to this project. When using the CLI, follow `using-notion-cli` for authentication and supported operations. Read the configured project, Project Wiki, page and data source identifiers from Project context and connections, or `PROJECT.md` when working locally. Stop dependent writes when access or identity cannot be verified.

When a source is local or inaccessible to this host, use the configured accessible source or evidence captured with its origin. If the evidence cannot support filing, retain Needs review with the missing source and recovery step.

## Traverse and search

Read page content and properties separately. Traverse child pages, child databases and linked data sources relevant to the destination; retrieve a database's data source and inspect its schema. A rendered linked view may be filtered, so verify its underlying source and project scope. Paginate query results, child blocks and relations until complete. Recursively read needed nested blocks and read full matching page bodies; a title or search excerpt is not the record.

Search the appropriate configured data source using its actual title, text, status and relation fields. Notion's workspace search is useful for locating pages, but does not establish that their bodies contain no relevant information. Search subject words, aliases, source IDs and related work items. Verify whole work-item IDs when a text contains query could also match longer IDs. Include records without Toolkit-specific Record Key metadata.

Inspect live property types and options before querying or writing. Confirm that Project, Source and Work items relations point to this project's configured collections and tracker; copied template relation targets are not evidence of correct scoping. Resolve a mismatch through setup before a relation write. Other projects' records are outside this operation.

## Parse and change records

Preserve page/database IDs, child references, unsupported blocks, views and unrelated content. For a targeted content update, derive the matching text from a fresh read. Read and merge JSON metadata objects; preserve unknown keys and resolve unparseable legacy values before replacing them. A relation or multi-value property write replaces its list, so merge existing values first.

Use the live schema to construct the supported API payload. For a create with an uncertain outcome, search for the returned ID or matching record before retrying, so a partial run does not create duplicates. For updates, use the latest properties and body to preserve concurrent owner or librarian edits.

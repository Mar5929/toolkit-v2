# Default Notion Project Wiki

The owner’s Project template supplies Project Wiki. Setup connects that structure, confirms project-specific changes and copies it only when a new project needs it.

- Coding agents read wiki knowledge, keep Current state current, and submit other useful changes to Wiki Inbox. They keep work items current and capture reusable results at closure and handoff.
- The librarian, the skill `maintaining-notion-wiki`, maintains existing wiki records and navigation even when no new captures arrive, using authoritative links instead of duplicate content. It files supported information into Long-Term Memory, Terminology Glossary and Product Wiki. Long-Term Memory contains the existing Projects, Topics, Memories, Entities and Facts collections.
- Product Wiki owns finalized product documentation and product decisions with rationale. Terminology Glossary owns established project terms. Active requirements and working designs remain in work items.
- The librarian runs daily and on demand through a supported mechanism selected with the owner. It owns unresolved captures, dismisses unusable captures with reasons and sends no routine report or owner review queue.
- When knowledge captured but not yet filed matters, coding agents read the relevant pending captures, or request an on-demand pass.
- Existing approvals and evidence remain attached. Filing is not approval and does not prove implementation. Explicit corrections and forgetting use immediate on-demand reconciliation.

The librarian processing skill is published inside each Project Wiki with verified project context and schemas. The selected cloud or local librarian uses its available Notion tools; local CLI access follows `using-notion-cli`. Setup verifies the resulting project’s schemas and relations instead of relying on template IDs. Other memory choices retain their own procedures.

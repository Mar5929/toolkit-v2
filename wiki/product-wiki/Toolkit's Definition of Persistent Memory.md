# Short Term Memory
* Current working state of a project across work items and ai agent sessions. This includes current priorities, upcoming things to be aware of, key deadlines or action items, etc.

# Long Term (Persistent) Memory
* These are the criteria for long term persistent memory that we want in a project:
    (1 AND 2 AND 3)
      1. Lasting project-specific facts, people, terminology, decisions, lessons, events, and constraints that are not already explained by another memory file (we don't want duplicates).
      2. It has lasting significance: losing it would cost a later agent real time or understanding.
      3. It comes from the owner, or from work done together with the owner.

* Long term memory must have these properties associated with them:
	* Created date
	* Modified date
	* Modified by
	* Provenance
	* Supersedes
	* Superseded by
	* Tags
	* Context (255 characters of context about the memory)
	* Source (User said, agent translated, etc.)
	* Type


# Memory Principles the agents must follow
* Exclude secrets and information whose storage could compromise system, product, or project security. Ordinary contact details may be saved when they meet the memory criteria.
* Memory should not be treated as truth by the ai agent when referenced. Rather it should always be used to enrich reasoning and thinking.
* Memory should always be cited when the agent uses it in an answer.
# Notion Project Wiki

Wiki Inbox receives useful information for reconciliation. Capture is not lasting retention, truth or approval. Coding agents keep work records current and capture changes; the librarian owns curated destination updates.

- Current state holds what is in progress, what is due, what is owed and where to pick up, as [[ToolkitV2 Structure#The Current State page]] describes. Work records remain authoritative for work status.
- Long-Term Memory holds qualifying lasting context, non-product decisions and lessons, with the metadata above.
- Terminology Glossary owns finalized terms, aliases and naming history.
- Product Wiki owns finalized product documentation, architecture and product decisions. Working designs remain in work items until finalized; approval and implementation status are separate.

The coding-agent skill routes retrieval to a focused reference for each destination. Agents read matching records and sources, check relevant pending captures for recent changes, and cite the information used. The librarian reconciles automatically, preserves history and sends no routine reports. Work-item closure may precede filing after captures are verified. Daily scheduling is chosen during project setup, with on-demand operation when current work needs it.

The published librarian package includes a filled invocation prompt linking project context and the entry skill. The librarian also maintains existing wiki content when the inbox is empty, preserving history and distinct context, consolidating duplicate current authority and repairing verified navigation links. Unfinished maintenance stays in the configured run record; routine operation remains quiet.

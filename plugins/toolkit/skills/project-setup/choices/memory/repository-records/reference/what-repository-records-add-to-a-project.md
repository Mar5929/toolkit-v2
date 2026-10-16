# Repository records for decisions and system rules

Use this reference when the owner chooses local or Hindsight memory. Those projects keep shared decisions in `DECISIONS.md` and the approved description of the system in `wiki/product-wiki/`, in the repository. A Notion-memory project keeps them in its Notion Project Wiki instead, so it gets none of these files or rows.

## What this folder adds

| Kind | What it adds |
| --- | --- |
| Files and folders | Copy `choices/memory/repository-records/files-to-add/` into the project. It holds `DECISIONS.md` and `wiki/product-wiki/` with its guide and documents. |
| Files inside a skill | The same folder adds `references/record-decision.md` and `references/update-system-doc.md` inside `filing-project-records`, and `references/shared-record-paths.md` inside `publish-docs`. Every project has these skills. |
| Text in `AGENTS.md` | Rows in the "Project map" and "Where information goes" tables. "The text in AGENTS.md" below gives them. |
| Settings and `PROJECT.md` | Nothing. |

## The text in AGENTS.md

In the project's root `AGENTS.md`, in the "Project map" table, add this row after the row for `AGENTS.md`, `CLAUDE.md`:

```markdown
| `DECISIONS.md` | Every decision and open question that more than one work item needs, so no later work item has to find it out again. Each entry has an ID (DEC-###) and a status: Open, Decided, Superseded, or Withdrawn. | `filing-project-records`, step "record a decision". The rules for an entry are at the top of the file. |
```

Add this row directly before the row for `sources/`:

```markdown
| `wiki/product-wiki/` | The approved description of the system, its terms, rules, and diagrams. Its `AGENTS.md` explains each document and the rule IDs and marks. | `filing-project-records`, step "update a system document". |
```

In the "Where information goes" table, add these rows after the row "A decision only one work item needs":

```markdown
| A decision or open question more than one work item needs | `DECISIONS.md` (DEC-###) |
| A rule for one area of the system that several work items rely on | That area's document in `wiki/product-wiki/` |
| A rule that covers several areas | `wiki/product-wiki/constraints.md` (CON-##) |
| A project term | `wiki/product-wiki/glossary.md` |
```

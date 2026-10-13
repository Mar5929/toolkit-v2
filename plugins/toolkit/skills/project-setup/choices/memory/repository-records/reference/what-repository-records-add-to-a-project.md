# Repository records for decisions and system rules

Use this reference when the owner chooses local or Hindsight memory. Those projects keep shared decisions in `DECISIONS.md` and the approved description of the system in `wiki/product-wiki/`, in the repository. A Notion-memory project keeps them in its Notion Project Wiki instead, so it gets none of these files or rows.

## What this folder adds

| Kind | What it adds |
| --- | --- |
| Files and folders | Copy `choices/memory/repository-records/files-to-add/` into the project. It holds `DECISIONS.md` and `wiki/product-wiki/` with its guide and documents. |
| Files inside a skill | The same folder adds `references/record-decision.md` and `references/update-system-doc.md` inside `filing-project-records`, and `references/shared-record-paths.md` inside `publish-docs`. Every project has both skills. |
| Text in `AGENTS.md` | Rows in the "Project map" and "Where information goes" tables. "The text in AGENTS.md" below gives them. |
| Settings and `PROJECT.md` | Nothing. |

## The text in AGENTS.md

In the project's root `AGENTS.md`, in the "Project map" table, add this row after the row for `AGENTS.md`, `CLAUDE.md`:

```markdown
| `DECISIONS.md` | Every decision and open question that more than one work item needs, so no later work item has to find it out again. Each entry has an ID (DEC-###) and a status: Open, Decided, Superseded, or Withdrawn. | `filing-project-records`, step "record a decision". The rules for an entry are at the top of the file. |
```

Add these rows directly before the row for `sources/`:

```markdown
| `wiki/product-wiki/` | The approved description of how the system must work, written as numbered rules, one document per area. Work items, decisions, and tests point to these rules by ID. Each rule shows whether it is a draft, approved, built, or retired. | `filing-project-records`, step "update a system document". |
| `wiki/product-wiki/glossary.md` | The words that have a special meaning in this project, such as business terms, system names, and abbreviations. `wiki/product-wiki/AGENTS.md` gives the columns of a row. Read it before you use or define a project term. | As for `wiki/product-wiki/`. |
| `wiki/product-wiki/constraints.md` | Rules that apply across several areas of the system, such as a naming standard or a limit every feature must respect (CON-##). | As for `wiki/product-wiki/`. |
| `wiki/product-wiki/architecture.md` | The main parts of the system, what each part is responsible for, and how the parts connect (ARC-##). | As for `wiki/product-wiki/`. |
| `wiki/product-wiki/data-model.md` | The data the system keeps: each object or table, its important fields, and how records relate to each other (DAT-##). | As for `wiki/product-wiki/`. |
| `wiki/product-wiki/security-model.md` | Who can see, create, change, and delete each kind of record, who can use each function, and how that access is given (SEC-##). | As for `wiki/product-wiki/`. |
| `wiki/product-wiki/automation.md` | Everything that runs without a person starting it, such as a flow, a trigger, or a scheduled job: what starts it, what it does, and what it changes (AUT-##). | As for `wiki/product-wiki/`. |
| `wiki/product-wiki/integrations/` | One document per connection between this system and another one: what data is sent, in which direction, when, and which system holds the true value (INT-##). | As for `wiki/product-wiki/`. |
| `wiki/product-wiki/diagrams/` | Diagrams that explain the system, such as a data model diagram, a process flow, or a map of the integrations. | As for `wiki/product-wiki/`. |
```

In the "Where information goes" table, add these rows after the row "A decision only one work item needs":

```markdown
| A decision or open question more than one work item needs | `DECISIONS.md` (DEC-###) |
| A rule for one area of the system that several work items rely on | That area's document in `wiki/product-wiki/` |
| A rule that covers several areas | `wiki/product-wiki/constraints.md` (CON-##) |
| A project term | `wiki/product-wiki/glossary.md` |
```

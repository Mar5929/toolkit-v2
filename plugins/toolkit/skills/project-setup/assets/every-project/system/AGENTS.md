# system/: the approved description of the system

This folder is the approved description of the system: how it must work, as numbered rules. Each rule carries a mark that says whether the owner approved it and whether it is built. Work items, decisions, and tests point to a rule by its ID, and never copy its text.

## Documents

Put a rule in the one document for its area. A rule that covers more than one area goes in `constraints.md`.

| File | What goes in it | Rule IDs |
| --- | --- | --- |
| `glossary.md` | A project term and its meaning here. | None |
| `constraints.md` | A rule that covers several areas of the system. | CON-## |
| `architecture.md` | A main part of the system, what it is responsible for, and how it connects to the others. | ARC-## |
| `data-model.md` | The data the system keeps: an object or table, its important fields, and how its records relate to others. | DAT-## |
| `security-model.md` | Who can see, create, change, and delete a kind of record, who can use a function, and how that access is given. | SEC-## |
| `automation.md` | Something that runs without a person starting it, such as a flow, a trigger, or a scheduled job: what starts it, what it does, and what it changes. | AUT-## |
| `integrations/<system-name>.md` | One connection to another system: what is sent, in which direction, when, and which side holds the true value. | INT-## |
| `integrations/README.md` | One row per integration document. | None |
| `integrations/INTEGRATION-TEMPLATE.md` | The template for a new integration document. Never write an integration into it. | None |
| `diagrams/` | A diagram that explains the system, such as a data model diagram, a process flow, or a map of the integrations. | None |

## The form of a document

Every document has, in this order:

1. Three lines at the top:
   - Status: Not started, Draft, or Approved.
   - Last changed via: the DEC-### behind the latest change, or "none".
   - Governs: the parts of the system the document covers, in one line. It says "not set" until the document gets its first rule or term.
2. Overview: a short description a new reader needs before the rules. It says "Not written yet." until the document gets its first rule or term.
3. Content: the rules. In `glossary.md`, the table of terms.
4. Open questions: DEC-### links only. The question's text is in `DECISIONS.md`.
5. Changelog: one row per change, with the date, the change, the DEC, and the work item.

Write Governs and the Overview in the same edit as the document's first rule or term.

What each Status means:

| Status | Meaning |
| --- | --- |
| Not started | The document holds no rule and no term. |
| Draft | At least one rule in it is marked Draft. |
| Approved | It holds at least one rule or term, and no rule is marked Draft. |

## The form of a rule

One block per rule, under Content:

```text
### SEC-04: <short name>

- Mark: <Draft, Approved (DEC-###), Built (<work item ID>), or Retired>
- Rule: <what the system must do, in words a person can check>
- Conditions and exceptions: <when the rule changes or does not apply, or "None">
- Source: <the DEC-### that approved it, or that holds its open question; add the SRC-### it came from when there is one>
```

- The ID is the document's prefix, a hyphen, and two digits. The next ID is the highest number that prefix has, plus one. INT numbers run across every document in `integrations/`.
- Never reuse an ID and never renumber a rule. Other records point to it.

What each mark means:

| Mark | Meaning |
| --- | --- |
| Draft | More than one work item depends on the rule, and the owner has not approved it. Its question is an Open entry in `DECISIONS.md`, listed under Open questions. |
| Approved (DEC-###) | The owner approved the rule in that decision. No work item has built what the rule says yet. |
| Built (work item ID) | The rule is approved, and that work item built what the rule says. |
| Retired | The rule no longer applies. Keep its block and its ID. |

## A glossary term

- One row per term: Term, System or context, Meaning here, Distinction or alias, Source, Last checked.
- Source is the owner's words with the date, or a DEC-###. Add the SRC-### when the meaning came from a source listed in `sources/README.md`.
- A meaning that only a source listed in `sources/README.md` gives, or that you worked out, is not a term yet. The owner confirms it first. Never infer a definition from a similar word.
- A word that two systems use differently gets two rows.
- A renamed term gets a row under "Naming changes", with the columns Old term, Preferred term, Reason, Source, and Date.

## An integration document

- Copy `integrations/INTEGRATION-TEMPLATE.md` to `integrations/<system-name>.md`, with the name in lowercase words joined by hyphens.
- Add its row to `integrations/README.md` in the same edit, and keep the row's Status and rule IDs equal to the document's.

## A diagram

- Save a diagram in `diagrams/`, named for what it shows, in lowercase words joined by hyphens.
- Link it from the document it explains, in that document's Overview or beside the rule it shows.
- A diagram shows only what the rules of its document say. When the two differ, the rules are right: correct the diagram.
- A diagram has no rule ID and needs no decision. Add a Changelog row to the document it explains, with "none" in the DEC cell.

## What must stay true

- A rule is added, changed, or retired only because of a decision. The rule's Source, the document's "Last changed via", and the Changelog row of the change name that DEC-###.
- A rule that one work item proposes stays in that work item's design. It comes here only when more than one work item depends on it, as a Draft rule.
- This folder describes the system the owner approved. The record of how the system works today (what was observed, in which environment, and on which date) goes in `reference/current-system/`.
- Name work items, decisions, and sources by ID. Never copy their text into a document.
- `.claude/hooks/validate-records.mjs` checks these documents after each edit and before each commit. Fix what it reports.

## Which skill to use

| Change | Use |
| --- | --- |
| Add, change, or retire a rule; add or correct a term; add or change an integration document or a diagram | `filing-project-records`, step "update a system document" |
| A question about a rule, or the decision that approves it | `filing-project-records`, step "record a decision" |
| Mark a rule Built, when `running-work-item-lifecycle` is closing a work item and asks what the work item changed | `filing-project-records`, step "update a system document" |
| Commit the change to the default branch | `publish-docs` |

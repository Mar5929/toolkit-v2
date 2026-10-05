# system/: the approved description of the system

This folder is the approved description of the system: how it must work, as numbered rules. Each rule carries a mark that says whether the owner approved it and whether it is built. Work items, decisions, and tests point to a rule by its ID, and never copy its text.

## Documents

Put a rule in the one document for its area. A rule that covers more than one area goes in `constraints.md`.

| File | What goes in it | Rule IDs |
| --- | --- | --- |
| `glossary.md` | A project term and its meaning here. | None |
| `constraints.md` | A rule that covers several areas of the system. | CON-## |
| `architecture.md` | A main part of the system, what it is responsible for, and how it connects to the others. | ARC-## |
| `data-model.md` | An object, its required fields, and how its records relate to others. | DAT-## |
| `security-model.md` | Who can see or change a kind of record or a function. | SEC-## |
| `automation.md` | Something that runs by itself, what starts it, and what it changes. | AUT-## |
| `integrations/<system-name>.md` | One connection to another system: what is sent, in which direction, when, and which side holds the true value. | INT-## |
| `integrations/README.md` | One row per integration document. | None |
| `integrations/INTEGRATION-TEMPLATE.md` | The form for a new integration document. Never write an integration into it. | None |
| `diagrams/` | A picture of the system. Link it from the document it explains. | None |

## The form of a document

Every document has, in this order:

1. Three lines at the top:
   - Status: Not started, Draft, or Approved.
   - Last changed via: the DEC-### behind the latest change, or "none".
   - Governs: the parts of the system the document covers, in one line.
2. Overview: a short description a new reader needs before the rules.
3. Content: the rules. In `glossary.md`, the table of terms.
4. Open questions: DEC-### links only. The question's text lives in `DECISIONS.md`.
5. Changelog: one row per change, with the date, the change, the DEC, and the work item.

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
| Approved (DEC-###) | The owner approved the rule in that decision. It is not delivered yet. |
| Built (work item ID) | The rule is approved, and that work item delivered it. |
| Retired | The rule no longer applies. Keep its block and its ID. |

## A glossary term

- One row per term: Term, System or context, Meaning here, Distinction or alias, Source, Last checked.
- Source is the owner's words with the date, a DEC-###, or an SRC-###. Never infer a definition from a similar word.
- A word that two systems use differently gets two rows.
- A renamed term gets a row under "Naming changes": the old term, the preferred term, the reason, the source, and the date.

## An integration document

- Copy `integrations/INTEGRATION-TEMPLATE.md` to `integrations/<system-name>.md`, with the name in lowercase words joined by hyphens.
- Add its row to `integrations/README.md` in the same edit, and keep the row's Status and rule IDs equal to the document's.

## What must stay true

- A rule is added, changed, or retired only because of a decision. Write that DEC-### in the rule's Source and in "Last changed via", and add a Changelog row.
- Only a Decided entry in `DECISIONS.md` makes a rule Approved.
- Set the document's Status again after every change to a mark.
- One work item's proposal stays in that item's design. It comes here only when more than one work item depends on it, as a Draft rule.
- This folder describes the system the owner approved. What exists today, before this project's changes, goes in `reference/current-system/`.
- Name work items, decisions, and sources by ID. Never copy their text into a document.

## Which skill to use

| Change | Use |
| --- | --- |
| Add, change, or retire a rule; add or correct a term; add an integration document or a diagram | `filing-project-records`, step "update a system document" |
| A question about a rule, or the decision that approves it | `filing-project-records`, step "record a decision" |
| Mark a rule Built, when the closing step of `running-work-item-lifecycle` asks what the work item changed | `filing-project-records`, step "update a system document" |
| Commit the change to the default branch | `publish-docs` |

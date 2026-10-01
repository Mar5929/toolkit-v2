<!-- Shared text from the Toolkit V2 repository (dev/build-shared/notion/record-mapping.md), where it is edited. In a project, never edit this copy: "update the toolkit" replaces it. -->

# How a memory record is stored in Notion

Which column holds which part of a record, so every save and every find reads the same way. What goes in memory, and when to ask the owner, is in the notion-memory-save skill ("Steps" and "Approval").

## One record, one row

A record is one concept, one episode (an `event_`), or one project-wide decision (a `decision_`): one row of Memories. A new fact goes into its concept as a new section; a new row only for a new concept.

## The columns

| Record part | Memories column | Example |
| --- | --- | --- |
| Key `<prefix>_<slug>` | Record Key, and Keywords | `project_deploys` |
| Title (the body's `# Title`) | Title | Deploys |
| One-line description | Synopsis | How deploys work: the window, the release branch, the checks |
| Prefix | Tags (one of user, project, reference, event, decision) | project |
| Date of the last change | Saved | 2026-09-30 |
| Status | Status (next section) | accepted |
| Who or what said it | Source note | Mike, 2026-09-30, kickoff call |
| Last checked against its source | Last verified | 2026-09-30 |
| What allowed the save | Authorization | Approved by Mike on 2026-09-30 |
| Work item IDs | Work item IDs (text), plus the Work items relation when work items are in Notion | IML-3 |
| The record it replaced / was replaced by | Supersedes (relation) / Superseded by (key) | |
| Anything else | Other fields (JSON) | |

Always set too: Kind (`note`, or `decision` for a decision record), Source
`manual`, Author the owner's name, Agent `Claude Code` or `Codex`, Project
the project's row in the Memory page's Projects database (its id is in
`PROJECT.md`). Lore's other columns stay empty, except on a decision record:
it always sets Decided At (the date it was decided); it fills Alternatives
with one line only when the owner named the options, and Consequences with
one line only when he named the effects. The full reasoning stays in the work
item.

## Status

| Record status | Lore Status |
| --- | --- |
| current | accepted |
| proposed, needs review | proposed |
| superseded | superseded |
| retired | deprecated |
| withdrawn (a decision the owner withdrew, with no replacement) | deprecated |

A Status the owner changed by hand counts: "deprecated" reads as retired,
"proposed" as needing review.

## The body

The page body is the record's body without its `# Title` line (Notion keeps
the title in the Title column): one `## <Sub-topic>` section per fact or
group of facts, and a last `## Gotchas and lessons` section ("None yet." at
first). A decision record's body has four sections: `## Decision`,
`## How to apply it`, `## Where it was decided`, and
`## Gotchas and lessons`. Write it as Notion Markdown (`ntn-basics.md`):
prompts and literal `<` `>` are escaped with a backslash.

## Links to work items

- Every record that relates to a work item names it in "Work item IDs"
  (text): `IML-3` or `IML-3, IML-5`.
- When the project's work items are in Notion too, also set the "Work
  items" relation to their page ids. The item's page then shows the record
  under "Linked memory".
- When the work items are elsewhere (local files, GitHub, Jira), add each
  item's link after its ID in "Work item IDs" when it has one:
  `#3 https://github.com/<owner>/<repo>/issues/3`.
- A decision record links back to the item where it was decided and names
  the Questions and Answers row: "Decided in IML-3, Q-04."
- A link is optional: a record about the whole project links to nothing.

## Facts and entities

Lore also has Entities (named things: a system, a person, a file) and Facts
(one dated statement: "billing uses Stripe"). The toolkit keeps knowledge in
Memories records. Add an Entity or a Fact only when the owner wants that
thing queryable on its own; each can link to work items the same way (its
own "Work items" relation).

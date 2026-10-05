# Project-wide records review, 2026-10-04

Scope: the new `filing-project-records` skill and its references, templates, and example; changed work-item, handoff, publish, setup, skill-index, and README text; and the model routes and templates. This is a manual description and text review. It is not a live Claude Code or Codex routing test.

## Wording and platform checks

- Six concrete wording or authority issues in the new references were corrected and re-read: the project-question filename now uses a variable `PQ-` number; an unanswered question may have an unknown authoritative answer home; an expert's statement cannot grant owner approval; a source with no anchor item has a work-item route for resolving its home; a question with no owning item uses the project-wide decision route; and a Salesforce source uses a stable `delivery/` or `engagement/` path rather than an anchor item ID. The final text in `references/record-lifecycle.md`, `references/questions-and-change-impact.md`, and `references/source-intake.md` resolves those branches.
- The question template records a short answer event and links to the full authoritative answer. The target template links verified current structure only after checked delivery. Skill assets and model templates match byte-for-byte.
- The new skill has `name` and `description` frontmatter, a short `SKILL.md`, one-level references, one-level assets, and a references table. This follows the captured [Claude Code skills guide](../../ai-external-knowledge/claude-code/skills.md) ("Getting started") and [Codex build-skills guide](../../ai-external-knowledge/codex/build-skills.md) ("Build skills"). The descriptions put the cross-item boundary in the initial text, which matters because Codex can shorten descriptions in a large skill list ([Codex build-skills guide](../../ai-external-knowledge/codex/build-skills.md), "Build skills").
- Procedures are in the skill and its references; the root and nested `AGENTS.md` files state placement and routing. This matches the captured [Claude Code memory guide](../../ai-external-knowledge/claude-code/memory.md) ("When to add to CLAUDE.md") and [Codex AGENTS.md guide](../../ai-external-knowledge/codex/agents-md.md) ("How Codex discovers guidance"). The new folder adds no hook or program. No separate setup choice or owner trigger phrase is required.

## Forty request routing audit

Abbreviations: **W** `running-work-item-lifecycle`; **P** `filing-project-records`; **T** `using-work-tracker`; **M** `curating-project-memory` (or the root `AGENTS.md` Hindsight route); **H** `handoff`; **D** `publish-docs`; **B** `braindump`; **S** `session-summary`; **U** `project-setup`. A plus sign means the skills have different jobs in one request, in the order shown. `T` is used by `W` for tracker reads and writes; it is listed separately only for a direct lookup or save request.

| # | Request in the owner's likely words | Descriptions that may match | Route and boundary |
| --- | --- | --- | --- |
| 1 | “Help me plan this login feature.” | W | W: one item. |
| 2 | “This bug came back can we fix it.” | W | W: one item's work and status. |
| 3 | “Ask me what the billing requirement should be.” | W | W: one item's interview. |
| 4 | “I changed my answer to Q-03 on WI-42.” | W | W: item Q&A; add P if another item relied on it. |
| 5 | “Can you design this one export item with me?” | W | W: item design. |
| 6 | “Build the approval screen now.” | W | W: item build and gates. |
| 7 | “Did the tests pass for this item?” | W, T | W: interpret testing state; T supplies the record. |
| 8 | “Is WI-31 ready to ship?” | W, T | W: approval and delivery checks; T supplies the record. |
| 9 | “Show me WI-31.” | T, W | T: lookup only; W begins when work on it is requested. |
| 10 | “Save my answer in this work item.” | W, T | W decides the Q&A action; T writes it. |
| 11 | “This workshop affects migration and security.” | P, W | P: source intake and cross-item links; W updates each item. |
| 12 | “The transcript covers three features can you file it.” | P, W | P chooses one source home and receipt; W handles each item. |
| 13 | “Where did that shared account-owner question land?” | P, T | P: find `PQ-` record; T opens linked item answer if needed. |
| 14 | “Who decides the matching rule across both orgs?” | P, W | P: authority and shared question; W asks owner through the item route. |
| 15 | “Make a map for the accounts domain.” | P | P: domain map after its creation check. |
| 16 | “The same person approves the migration and service design.” | P, W | P: shared authority record if the short `PROJECT.md` table is insufficient; W keeps item approvals. |
| 17 | “We need one target data model for these four items.” | P, W | P records shared target direction; W keeps each build design. |
| 18 | “I approved the target architecture for both features.” | P, W, M | W records an item decision if made in an item; P updates shared target status; M considers lasting memory under approval rules. |
| 19 | “This new source contradicts our shared design.” | P, W | P opens or updates the shared question and affected links; W handles item changes. |
| 20 | “The stakeholder says the rule changed, is that final?” | P, W | P keeps the claim unconfirmed; W follows owner approval for item changes. |
| 21 | “Our answer changed, update everything it affects.” | P, W, M | P tracks affected records and checks; W changes item answers/designs; M corrects any lasting decision. |
| 22 | “Where does the whole project stand on account ownership?” | P, W, M | P routes through domain/question links; W reads active items; M supplies lasting decisions. |
| 23 | “Find the source behind the account model decision.” | P, T, M | P follows the cross-item links; T or M opens the authoritative decision by its location. |
| 24 | “That workshop note should affect service too.” | P, W | P reopens intake destinations; W updates the service item. |
| 25 | “Remember that we chose person accounts.” | M, W, P | W records an item decision first if it arose there; M applies memory approval; P links it when several items depend on it. |
| 26 | “What did we decide about permissions last month?” | M, P | M finds the durable decision; P finds related shared questions or target direction when relevant. |
| 27 | “Forget the old account-owner decision.” | M, P | M follows correction/retirement rules; P checks shared records that cite it. |
| 28 | “Save the transcript to memory so we have it.” | M, P, W | M rejects raw transcript memory; P or W places the original by its scope. |
| 29 | “This open question is blocking the build.” | W, P, H | W updates item blocker; P links shared question if cross-item; H is used only if preparing a session handoff. |
| 30 | “The approved requirement is delivered; update the current docs.” | W, D, P | W runs Reflecting; D saves verified documents; P updates domain links after verification. |
| 31 | “Publish the accounts domain map to main.” | D, P | P checks content and links; D performs the Git-tracked document save. |
| 32 | “Change the project-wide AGENTS instructions.” | P, D | P identifies the instruction's scope; D refuses `AGENTS.md`; use the reviewed instruction-file change route. |
| 33 | “Write a handoff; this shared question is still open.” | H, P | P leaves exact next action on the question; H carries its link if it blocks active work. |
| 34 | “Recap what we talked about today.” | S, H | S: recap only; H needs a handoff or context-clear request. |
| 35 | “Here is a messy thought dump; tell me what you heard first.” | B, W | B plays it back first; W starts only after the owner confirms and asks to work it. |
| 36 | “Set up a new client project with Notion for tasks.” | U, P | U copies the standard P folder and skill; P is used when project-wide records are needed after setup. |
| 37 | “Update the toolkit in this existing project.” | U, P | U maps existing records and updates installed files; P governs later record work. |
| 38 | “We use GitHub issues and Hindsight; does the shared-question process still work?” | P, W, M | P keeps the same record form; W uses the chosen tracker; Hindsight follows root memory route. |
| 39 | “Can you update the account model?” | W, P | Inspect current work item and whether a shared target exists. W handles an item design; P handles shared target direction. Ask one scope question only if both remain plausible. |
| 40 | “Where do I put this note from the call it changes everything?” | W, P | Inspect what the note affects. P handles two or more items or project-wide records; W handles one item. Ask one scope question only if the note gives no usable scope. |

The two changed descriptions permit both skills for a request with item work and cross-item coordination. Their roles do not compete for the same record: W decides and writes one item's content; P connects affected records. The adjacent skills read, save, remember, publish, or hand off through their existing boundaries. Rows 39 and 40 require looking at project context; the wording alone cannot identify the affected records. No description pair leaves two different owners for the same record.

This audit applies the [overlap review checklist](overlap-review.md) O3–O8. Its 40 requests are examples, not trigger phrases the owner must memorize. A live routing test in both hosts remains the separate implementation check; this file does not claim one ran.

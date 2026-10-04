# Plan: standard project-wide records in Toolkit V2

Status: Proposed plan for TKV-19, for Mike's review. No Toolkit V2 behavior described here has been built or approved. [Workflow diagrams](project-wide-records-workflows.md) show the intended behavior.

## Outcome

Every new Toolkit V2 project receives the same project-wide record pattern, whether work items live locally, in Notion, or in GitHub Issues, and whether memory is local, in Notion, or in Hindsight. The pattern gives an agent five defined record types and procedures for source intake, cross-item questions, shared target direction, finding related records, and applying changed answers. It does not add a second tracker or memory system.

## Terms and boundaries

- **Knowledge:** the full body of useful project information. It is not a folder or a save instruction.
- **Source:** original evidence. Keep it once in the location existing project rules assign. Treat a claim as a claim until confirmed.
- **Work item:** current or proposed change, its requirement approval, Q&A decisions, design, tasks, and status. The chosen tracker owns it.
- **Maintained accepted behavior:** `requirements/`. **Verified current structure:** `system-guide/`.
- **Project-wide record:** one of the five named forms below. It connects records across items without copying their authoritative content.
- **Memory:** selected lasting context under the chosen memory system's rules. Hindsight keeps its own storage and retrieval behavior.

## New files in the model project

All paths in this section start under `plugins/toolkit/skills/project-setup/assets/model/`. `project-setup` already copies the whole model, so these files arrive in every new project without a setup choice.

```text
project-wide-records/
  AGENTS.md
  domains/.gitkeep
  questions/.gitkeep
  people/.gitkeep
  target-architecture/.gitkeep
  intake/.gitkeep
  templates/DOMAIN-MAP.md
  templates/PROJECT-QUESTION.md
  templates/PERSON.md
  templates/TARGET-ARCHITECTURE.md
  templates/INTAKE-RECEIPT.md
```

`project-wide-records/AGENTS.md` is the folder's agent-facing placement map, following the existing `requirements/AGENTS.md` pattern. No README is added under this folder. The five template files define exact headings and required fields. Empty category folders contain only `.gitkeep`; no sample person, domain, decision, or question is copied into a client project.

| Form | Required fields | Creation threshold |
| --- | --- | --- |
| Project question | ID; exact unresolved question; owner of the answer; source; status; owning work item Q-ID or project-wide decision source; affected records; incorporation checks; answer history | One issue affects several items or the project as a whole. A question local to one item stays in its Q&A. |
| Domain map | Domain and scope; links to current system, accepted behavior, target direction, open questions, sources, decisions, and active items; last review date | A domain has enough related records that a new agent needs a route through them. It contains no copied status or manually maintained counts. |
| Person | Project role; decision authority; areas of knowledge; source and last confirmation; related questions | `PROJECT.md`'s short role table cannot hold relevant detail. Exclude unnecessary personal information. |
| Target architecture | Domain and scope; proposed, owner-approved, or superseded status; intended direction; source and approving decision; affected items; gaps and dependencies | Several items depend on one intended structure. The item-specific build design remains with its item. |
| Intake receipt | Original source anchor and date; findings by type; created, changed, contradicted, and still-open destinations; readback result; next action if incomplete | A source affects several items or project-wide records. Single-item intake remains in the work item. |

The question record coordinates a decision; it does not approve it. An answer made while working an item is authoritative in that item's Q&A. A decision that matters beyond the item is offered to memory under the existing approval rule. A project-wide decision with no work item follows the existing project-wide memory route. The question links to the authoritative answer and reaches `incorporated` only after all affected records have been checked.

## New shared skill

Add `plugins/toolkit/skills/project-setup/assets/.shared-skills/managing-project-wide-records/` with:

```text
SKILL.md
references/placement-and-authority.md
references/source-intake.md
references/questions-and-change-impact.md
references/record-lifecycle.md
examples/accounts-org-merge.md
assets/DOMAIN-MAP.md
assets/PROJECT-QUESTION.md
assets/PERSON.md
assets/TARGET-ARCHITECTURE.md
assets/INTAKE-RECEIPT.md
```

Draft routing description: "Connects information that affects several work items or a whole project through domain maps, shared questions, people, target architecture, and intake receipts. Use when a source, answer, or design direction crosses item boundaries, or when a fresh agent needs the related records. Not for one item's execution; use managing-work-items."

The skill uses `tracking-work-items` for every tracker read or write. For local and Notion memory it hands memory work to `managing-project-memory`; in Hindsight projects it follows the root `AGENTS.md` memory route. It does not name `ntn`, `gh`, Hindsight write calls, or a particular tracker field. The skill's own `assets/` copies match the model templates, enforced by `check-skills.mjs`; this follows the existing work-item-template pattern.

## Source ownership

For a source that spans several items, choose one **anchor work item** in non-Salesforce projects. The existing tracker stores the original: the local item's `references/`, the Notion item's Files property, or the GitHub issue's source comment or approved attachment path. The intake receipt stores the item ID plus a stable file name or comment/page link, and links every other affected item. It never stores a temporary Notion download URL. Salesforce client sources stay in `delivery/` or an established `engagement/`; the project-file-locations rule already prevents a parallel tree. If a project-wide source has no existing owner or approved source location, resolve that route before writing an intake receipt; do not put raw material in the new Git-tracked folder by default.

## Existing files to update

| Area | Exact files or group | Required change |
| --- | --- | --- |
| Agent routing | Model `AGENTS.md` | Add one short project-map entry, placement rows for the five record types, and a skill-routing line. Keep detailed steps in the shared skill. Check the rendered file against the setup limit of 200 lines and 20,480 bytes. |
| Project introduction | Model `PROJECT.md` and root `README.md` | Point to project-wide records. Keep `PROJECT.md`'s people table short; a detailed record is linked from it. The root README remains the human introduction. |
| Work-item process | Shared `managing-work-items/SKILL.md`, `references/refining-requirements.md`, and `references/reflecting.md` | Route cross-item findings and changed answers to the new skill; leave one-item questions and design with the item. In Reflecting, update domain links only after delivered records are verified. |
| Handoff and status | Shared `handoff/SKILL.md` and model `AGENTS.md` status line | Leave unfinished intake and shared questions findable. Current State points to a shared question only while it blocks active work. |
| Memory boundary | `memory-process/managing-project-memory/references/memory-criteria.md` and its model copy, only if wording needs adjustment | State that an active question, intake receipt, or copied target design is not lasting memory; a durable decision may point to its authoritative record. Keep the process/storage split intact. |
| Document saves | Model `.claude/rules/publish-project-documents.md`; shared `publish-docs/SKILL.md` | Include `project-wide-records/**` for Git-tracked Markdown, including a changed skill description and matching skill index row. Do not route the folder's `AGENTS.md` through the document save skill: instruction files still require a reviewed code-style change. |
| Setup | `project-setup/SKILL.md`, `references/skills-hooks-settings.md`, `references/interview.md`, `references/finishing.md` | Raise the shared skill count from nine to ten and verify the new skill and model folder in every setup. Do not add an interview question, setup marker, setting, or hook snippet. |
| Existing projects | `project-setup/references/update.md`, `references/move-over.md` | Before adding the new folder, find existing architecture, stakeholder, question, or intake locations. Show the proposed mapping; keep current records and do not automatically move them or create a second authority. Bring in the shared skill and templates through the normal reviewed update. |
| Development records | `dev/SKILL-INDEX.md`, repository `README.md`, `dev/tools/check-skills.mjs` | Register the new shared skill and its description; update the install matrix and checker lists; add five model-to-skill template comparisons. |
| Release metadata | Both toolkit manifests, workstreams manifest, Claude marketplace metadata | Raise the one shared version number for the shipped change, under the repository's version rule. |

No new command, project hook job, settings snippet, Notion database, Hindsight integration, workstreams feature, or Salesforce script is proposed. No existing model folder is renamed or moved. `requirements/`, `system-guide/`, work-item designs, and `delivery/` retain their current roles.

## Build order and review gates

1. Show Mike the record schemas, authority boundaries, and this file list. Refine TKV-19's requirements; do not treat this plan as his approval of model meaning or implementation.
2. Build in an isolated worktree. Start with the model's folder and the shared skill, then add the minimal routes in existing files. Change only named files.
3. Review every changed skill, template, example, and reference with a separate agent against `dev/reviews/wording-review.md`. Review the new name, description, and model routing against `dev/reviews/overlap-review.md`. Review skill, rule, and model-agent changes against `dev/reviews/best-practices-review.md`. Fix verified findings and have the reviewer read the fix.
4. Run the repository's complete validation list in `AGENTS.md`, including both plugin validations, workstreams test, skill and rule checks, and Node tests. Install the toolkit plugin in scratch Claude and Codex homes for platform and routing checks; do not change Mike's live installations.
5. In scratch project setups, check local, Notion, and GitHub work with local, Notion, and Hindsight memory combinations. Use representative live sessions in both hosts for source intake, large-feature design, changed answers, delivery, and fresh-session retrieval. A live Notion test uses a throwaway project only after Mike's yes.
6. Check failure handling: a source with no home, a temporary Notion URL, an unconfirmed stakeholder claim, a failed tracker save, an approved requirement change, and a proposed target that has not been delivered. Each must leave a named open question or next action instead of claiming completion.
7. Prepare a reviewable pull request, update TKV-19 with evidence, and ask Mike before merging to main or installing the new toolkit version on his computers.

## Acceptance check

A newly set-up project contains the standard model folder, its templates and agent routing, and the shared skill in both hosts. A fresh agent can take one workshop source affecting at least two work items and one shared target direction, find the source and authoritative decision, identify every affected record, and resume from an exact next action. After an answer changes, it updates each destination or records a specific unresolved conflict; it does not close the shared question early. The same procedure works with each tracker and memory choice without turning Hindsight into a new storage schema.

---
name: filing-project-records
description: 'Connects sources, questions, people, domains, and target direction that affect several work items or the whole project, so a fresh agent can find each authoritative record. Use when evidence, an answer, or a proposed design crosses item boundaries, or when those connections need review. Not for one item alone; use running-work-item-lifecycle.'
---

# Managing project-wide records

Use `project-wide-records/` for five kinds of cross-item records only. Read
its `AGENTS.md` before adding a file. Keep the original source, work item,
accepted requirement, verified system description, and lasting memory in
their existing homes. These records link them; they do not replace them.

## Steps

1. Read the root `AGENTS.md` placement map and `PROJECT.md` settings. Find
   related domain maps, questions, work items, requirements, system guides,
   and memory before creating a record. Read
   [placement-and-authority.md](references/placement-and-authority.md) when
   the owner of a fact is unclear.
2. Put a source in its existing home before extracting findings. Use
   `using-work-tracker` for sources owned by a work item. Follow
   [source-intake.md](references/source-intake.md) when it affects several
   items or project-wide records.
3. Keep a question local to one item in that item's Questions and Answers.
   For a question affecting several items or the whole project, use
   [questions-and-change-impact.md](references/questions-and-change-impact.md).
4. Add or update a domain map, person, or target architecture record only
   at the threshold in [record-lifecycle.md](references/record-lifecycle.md).
   Copy its matching template from `project-wide-records/templates/`.
5. Check every affected destination after an answer, source correction, or
   delivery. Record what changed and what remains open. Never mark an intake
   or shared question complete while a destination is unchecked.
6. Save each Git-tracked document change with `publish-docs` when it can
   stand on the default branch alone. Keep a record tied to a pending code,
   skill, or rule change in that change's pull request. A change to
   `project-wide-records/AGENTS.md` uses the reviewed instruction-file path.

## Hand-offs

| For | Use |
| --- | --- |
| Every work item or source read and write in the chosen tracker | `using-work-tracker` |
| An item's requirements, approval, design, delivery, and status | `running-work-item-lifecycle` |
| A lasting decision or memory route in local or Notion memory | `curating-project-memory` |
| Hindsight memory | Root `AGENTS.md`, "Project memory" |
| A Git-tracked document save | `publish-docs` |

## References

| File | Open it when |
| --- | --- |
| [references/placement-and-authority.md](references/placement-and-authority.md) | Deciding where information belongs and which record owns an answer |
| [references/source-intake.md](references/source-intake.md) | A workshop, transcript, document, or other source affects several items |
| [references/questions-and-change-impact.md](references/questions-and-change-impact.md) | A question crosses items, an answer changes, or records conflict |
| [references/record-lifecycle.md](references/record-lifecycle.md) | Creating, reviewing, superseding, or retiring any of the five record types |
| [examples/accounts-org-merge.md](examples/accounts-org-merge.md) | Checking a complete example across a workshop and several items |
| [assets/DOMAIN-MAP.md](assets/DOMAIN-MAP.md) | Creating a domain map; identical to the model template |
| [assets/PROJECT-QUESTION.md](assets/PROJECT-QUESTION.md) | Creating a shared question; identical to the model template |
| [assets/PERSON.md](assets/PERSON.md) | Creating a detailed person record; identical to the model template |
| [assets/TARGET-ARCHITECTURE.md](assets/TARGET-ARCHITECTURE.md) | Creating shared target direction; identical to the model template |
| [assets/INTAKE-RECEIPT.md](assets/INTAKE-RECEIPT.md) | Recording a source intake across destinations; identical to the model template |

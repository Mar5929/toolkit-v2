# Shared questions and changed answers

Use a shared question only when one unresolved issue affects several work
items or the whole project. A one-item question stays in that item's
Questions and Answers. Use the project question template and give it a
stable ID. Search for an existing question before opening another.

## Opening

1. Write one exact question, its status, the person who can answer it,
   the source that raised it, and every known affected record. An item
   question names its work item ID and Q-ID. For a question without an
   owning item, set its authoritative answer home to `Unknown` until the
   project-wide decision source exists.
2. Ask a named expert to verify a fact. Ask the owner for a project
   decision or approval through the owning item's normal path. For a
   question with no owning item, use the project-wide decision route in
   the root `AGENTS.md`. Keep a stakeholder statement as a candidate
   until the owner confirms it. Do not infer decision authority from a
   job title alone.
3. Link the shared question from each affected item or domain map. An
   active blocker may also be linked in Current State.

## Answering and incorporating

1. Save an item answer and its date in that item's Questions and Answers
   first, through `using-work-tracker`. For a project-wide answer without
   an item, use the root `AGENTS.md` decision route. The shared question
   links that authoritative answer and records a short answer event in its
   history. Keep the answer's full words in the authoritative record.
2. List every destination needing a change or a check: other items,
   target direction, domain maps, accepted requirements, verified system
   descriptions, and memory pointers. Apply each change through its owner.
   A changed approved requirement follows `running-work-item-lifecycle` approval
   rules before design or build proceeds from it.
3. Read each destination back and mark its incorporation check. A failed
   save, conflicting evidence, absent approval, or item not yet updated
   leaves that check open with a next action. Mark the question
   `incorporated` only when every check is complete. An answer alone is
   `answered`, not `incorporated`.

## Changing an answer

For an item answer, keep the old Questions and Answers row; do not
silently rewrite it. Add a new Q-ID row for the changed answer, naming
the old Q-ID, the new source, and the date. Mark the old row superseded
by the new Q-ID, as `running-work-item-lifecycle` says. For a project-wide answer
with no item, correct its approved decision source through the root
`AGENTS.md` memory route. Identify all records that relied on the old
answer, and reopen the shared question's incorporation checks. If the old
answer was saved as memory, follow the project's correction and approval
route. If a target record depended on the old answer and its approval is
withdrawn, set it to `proposed`; when an approved replacement exists, set
the old record to `superseded` and link the replacement. Update Current
State only if the issue blocks active work.

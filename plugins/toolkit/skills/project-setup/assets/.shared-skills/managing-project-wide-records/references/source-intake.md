# Source intake across items

Use this procedure when one workshop, transcript, client document, or other
source affects several work items or project-wide records. One-item intake
stays with `managing-work-items` and `tracking-work-items`.

1. Choose one stable source home and save the original once. In a
   non-Salesforce project, pick an anchor work item and use the chosen
   tracker's source route. In a Salesforce project, use the established
   `delivery/` or `engagement/` route. If a project-wide source has no
   approved home, stop before making a receipt. If an affected work item
   exists, record the source-home question and next action in that item's
   Questions and Answers through `tracking-work-items`. Otherwise create a
   work item for the source-home decision with `managing-work-items`. Ask
   the owner to settle the route. Never put raw client material in
   `project-wide-records/` by default.
2. For a non-Salesforce source, record the anchor item ID and stable file
   name, page link, or issue comment link. For a Salesforce source, record
   the stable `delivery/` or `engagement/` path. A temporary Notion
   download URL is not a source anchor. Read the saved source back before
   extracting it.
3. Search related work items, domain maps, questions, requirements,
   system guides, target records, and memory. Make an intake receipt from
   `project-wide-records/templates/INTAKE-RECEIPT.md`; name the source,
   date, and each affected destination.
4. Classify each finding: a source claim, candidate requirement, current
   system fact to verify, proposed target direction, decision to confirm,
   conflict, or open question. Cite the original source beside the finding.
   A stakeholder statement is not owner approval.
5. Update each destination through its owner: an item through
   `tracking-work-items` and `managing-work-items`; an accepted requirement
   only after its approval and delivery checks; a domain or target record
   here; memory through its own route. Record created, changed,
   contradicted, and still-open destinations in the receipt.
6. Read each destination back. Record the result and an exact next action
   for any failed save, conflict, or missing approval. Mark intake complete
   only when every finding is placed, rejected with a reason, or held by a
   named open question. Keep the receipt linked to the stable original.

If a source is later corrected, keep the original, record the correction
where its source owner allows, and reopen the affected destinations.

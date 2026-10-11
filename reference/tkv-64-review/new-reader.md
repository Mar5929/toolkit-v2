# Independent reader verification

I read the current instructions and followed the entry skills into the references needed for the four situations. I did not compare old versions, read a team audit, change project files, or call external services. These are simulated actions, not evidence of live execution.

## Meeting in a Hindsight project with Notion work items

I would file the transcript unchanged through filing-project-records, search the source index first, publish the source, then add its SRC ID to the affected Notion items. I would read the Notion IDs from PROJECT.md and use the selected Notion tracker references for updates and read-back.

I would search DECISIONS.md for the shared decision. I would update an existing entry or add a DEC entry, recording a statement in the transcript as Open until the authorized decision-maker confirms it. A transcript does not itself approve the decision. I would publish the entry before writing its ID into the affected Notion items. I would add or update a system rule if the confirmed decision describes how the system must work.

The unresolved deadline remains current work in the tracker. I would record the named action, responsible person, original deadline, unresolved condition, and next action. I would report that the date has passed, rather than treat the passage of the date as completion. I would not create Current State or put ordinary deadline status in Hindsight. A lesson belongs first in the work item when it is unproven; I would review qualifying lasting knowledge under the Hindsight rule, search before saving, preserve its uncertainty and evidence, and report a deliberate save.

The memory rule resolves the old managing-project-memory references: its One memory store section explicitly substitutes Hindsight for memory and the tracker for current work. The filing entry repeats that direction. I did not encounter an actual missing memory dependency once I followed that rule.

## Previously authorized build and team after design completion

I would distinguish a design that is written from a design the owner approved. If approval is still missing, I would present the design for the owner's choice. If the recorded owner authorization covers the selected design and build, and requirements are approved, I would record the words and approval, fill the selected design and verification plan, remove prompts, create the build tasks, move to Building, and continue.

I would preserve the existing delivery and team choice. I would not repeat the delivery offer or team-arrangement question. I would create the required branches and worktrees, assign independent work with one writer per file, and start the authorized team. The authorization does not silently cover a merge, deployment, or changed requirements.

This route is clear in designing.md step 12, building.md Who builds, and team-arrangement.md. These references agree with lifecycle-rules.md, which says an earlier authorization for the same scope counts.

## Check setup when records remain but a local template is missing

I would read PROJECT.md, build a setup copy for the recorded choices, compare the installed files and ignored folders in the main checkout, and run the final checks. I would restore only the missing listed template with cp -n, report its path, and leave existing work records intact. I would not create a sample task to test ignoring, replace an existing template, or convert the check into an update. The two allowed maintenance actions are explicit, so no approval question is needed merely to restore a missing listed template.

One operational edge remains: finishing.md gives cp -n without creating a missing parent folder. If the work-item-template folder itself is missing while other work records remain intact, the copy fails. The general recovery procedure should allow creation of the needed parent directory before the non-overwriting copy. This matters to restoration, but a single missing template in an existing directory works as written.

## Closure with a decision other work items need and blocked publication

I would identify the shared decision during the Moved up review, search for an existing authoritative entry, record any owner approval still missing, and use filing-project-records to add or update the entry and its affected items. Closure does not make the decision private to the closed item: the DEC entry and the other items' follow-up remain.

If publication is denied or cannot finish, I would preserve the save worktree and commit, report separately what is written, checked, committed, and on the default branch, and record the exact blocker and next action in the work item. I would not claim the record is saved, reuse its ID as authoritative, bypass a host denial or branch protection, or mark the closure steps complete.

If publication reached the default branch but the main checkout cannot be updated, Notion and GitHub items can receive the published ID. Local items must wait for the main checkout to hold the record; with Hindsight the deferred link goes into the tracker, not Current State. I would retain the other work items' dependencies and follow-up after the current item closes.

This is clear in filing-project-records When to write the ID and publish-docs recovery. The distinction between publication failure and a finished save that is absent from the main checkout is especially useful.

## Verification after the route corrections

I reread file-source.md and closing.md after their targeted corrections. These changes implement the intended choice behavior rather than change the chosen memory store.

- Active dates now explicitly go into work items or project tasks. Local and Notion memory may also carry an appropriate Current State line. Hindsight keeps active dates in the tracker.
- A Hindsight procedural lesson approved as a standing instruction is actually written into owner-preferences.md or its applicable rule, preserving the approval, source, and date. Qualifying Hindsight history or a pointer is additional context and cannot replace the instruction.
- Unproven Hindsight lessons preserve uncertainty, the work-item pointer, and observation dates. Nonqualifying lessons remain in the work item.
- Pending local record links go into a tracker blocker note with Hindsight. The authoritative link fields remain unchanged until the main checkout holds the save.
- Closing and hand closure now explicitly choose installed Current State for local or Notion memory and tracker follow-up with lasting-memory review for Hindsight. No Hindsight Current State is created.

These corrections remove the memory-route ambiguity listed in my preliminary findings.

## Remaining observations

The exact phrase “Do these move up as listed?” is defined immediately as keeping material for the whole project. I could follow it, though naming the action directly would be easier to understand.

The template restoration command still needs to ensure its destination parent directory exists when the entire template folder is missing. A single missing template in an existing directory works as written.

Closing step 3 now allows a nonqualifying lesson to remain in the work item. Step 5 still requires one of four outcome labels, none of which says that. A reader should be allowed to write the actual result, such as “Kept in work item,” without falsely claiming a memory save.

I found no unresolved contradiction in the authorization route or selected-memory behavior and no missing file on the routes followed. The two operational observations above are separate from the intended routing corrections.

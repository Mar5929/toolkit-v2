# Publish the project's librarian processing skill

Each Notion Project Wiki holds a librarian processing skill that a cloud or local agent can follow without the local repository. This file is the one place that says how to publish it, verify it, and update it. Publish it only within the owner's approved setup or update batch.

## Publish the project pages

1. Reuse the project's existing librarian package when present. Under Project Wiki, create or update a short entry page named Librarian processing skill from `maintaining-notion-wiki/SKILL.md` in this choice's delivered files.
2. Publish each of the skill's reference files, and `managing-project-memory/references/wiki-destinations.md`, as a linked page under the entry, titled with the file's subject. Each page holds its file's text as it is: the same words and the same tables, with no project-specific additions. `references/wiki-schemas.md` is published as it is too; each run reads the project's live schema, as that file says, so the page holds no inspected schema and no template IDs.
3. Publish the invocation prompt the same way, filling it with the confirmed project name and published entry URL. Fill the Project context and connections page from confirmed project records, and record there any project-specific difference, such as a field the project's wiki adds. Link authoritative sources instead of copying their full contents. Keep the template's source-access and operating settings usable by the selected host.
4. Replace each local file reference with the link to its published page, and change nothing else in the text. Point the entry's template link to the filled Project context and connections page. Record the source-file-to-page mapping and the Toolkit version on the Project context and connections page.
5. Record the skill entry and context page links in `PROJECT.md` and link the entry from Project Wiki. If the Notion tools support native Skill designation, read their current skill documentation and mark the entry as a Skill; supporting pages remain references. Verify designation by reading the entry back. Explicit invocation through the entry link works without automatic Skill discovery.

## Verify the selected librarian

Give the selected librarian the filled invocation prompt. Verify its project identity and entry link, then use the same prompt for the configured scheduled and on-demand operations. Verify that it can read project context, every procedure reference, the project's live schemas and the required sources, and perform the permitted capture and filing checks in Notion memory setup. Test a missing-source case: unresolved evidence remains Needs review with a recovery note. Check an empty-inbox maintenance scenario for duplicate records and broken pointers, preserving distinct context, history and approval evidence.

Check writer coordination across scheduled and on-demand runs. Record access or scheduling gaps as open setup steps. Publishing the skill does not activate a schedule or broaden permissions.

## Update an existing package

In "update the toolkit", name the changes as one batch for the owner's approval. Compare the published source mapping and version with the delivered skill, and republish each changed file as it is. Keep the project's recorded differences and unrelated wiki content. Reinspect changed connections or schemas, read changed pages back and verify their links before recording the new version. Treat a changed project binding as setup work, not a new filing rule.

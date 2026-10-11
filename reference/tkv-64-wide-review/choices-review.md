# Project setup and choices review

Reviewed the uncommitted .55 routing patch at `/Users/michaelrihm/.codex/worktrees/tkv62-routing-fixes/toolkit-v2` on 2026-10-11. This is a read-only document and workflow review. No project, host configuration, bank, org, issue, Notion page, or schedule was changed.

Three actionable findings remain outside the three repaired routing gaps. Paths below are relative to `plugins/toolkit/skills/project-setup/`.

## Findings

1. **GitHub error handling incorrectly guarantees no mutation occurred.** `choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh-commands.md:167` says “Nothing changed unless the error says otherwise.” The [official gh exit-code documentation](https://cli.github.com/manual/gh_help_exit-codes), checked today, defines failure for any reason; it does not establish remote rollback. A server can accept an issue creation before the client loses the response. In that simulated failure, treating the operation as unchanged and retrying can create another issue. This is a consequence inferred from an uncertain remote-write outcome, not a reproduced live GitHub incident. Minimal remedy: treat uncertain mutations as unknown, inspect the remote record or search for the attempted creation, and resume only the unconfirmed portion. Preserve the useful authentication, schema, and HTTP error guidance.

2. **The local memory entry still routes to the retired Notion implementation.** `choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/SKILL.md:10–12,27,35,38–40` claims the entry serves both stores and directly names `database-layout.md`, `current-state-page.md`, and `writing-pages.md`. None of those files is delivered by its local overlay; the Notion module now supplies a separate complete skill. The unqualified instruction at line 12 can send a local-memory agent to a nonexistent reference. Minimal remedy: describe this delivered entry as local memory and remove the retired Notion routes. Keep the working local reference routes and retention process. This is a stale entry/discoverability defect, not proof that local saves fail.

3. **Salesforce setup can install an inaccurate dependency claim in the root guide.** `choices/salesforce/reference/what-salesforce-adds-to-a-project.md:28` always inserts a claim that the official `forcedotcom/sf-skills` are installed. Yet `choices/salesforce/salesforce-setup.md:14` explicitly allows missing official skills, tells the owner what is missing, and installs none. Steps 21–24 record remaining owner work and report it. In a missing-skills setup, the root guide says the skills are available while setup records say they are absent. Minimal remedy: record verified availability accurately, or direct use of official skills when available without asserting installation. Keep owner installation and enablement choices.

## Owner choices to review separately

The local memory process uses a 30-day default expiration for uncertain claims (`choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/saving.md:59`) and a six-month age trigger for changing facts (`references/tidying.md:87`). The GitHub failure table says “retry once” (`work-tracker-gh-commands.md:175`). These are policy choices rather than platform limits. If the owner wants judgment-based upkeep, describe the purpose and let relevance, volatility, and evidence determine review timing or recovery. This review does not presume approval to change those policies. Exact schema fields, genuine tool limits, and the deliberate three navigation levels remain intact.

## Coverage

| Area | Checked |
| --- | --- |
| Setup entry and reference folder | Interview routes, setup-copy, existing-project handling, file placement, guide additions, host settings and shared skills, final checks, check/update, preservation of owner files and customizations, retired files and migration boundaries. |
| Local work tracker | Setup/default/additions, folders and IDs, field mapping, searching, roadmap and task workflows; duplicate detection and three-level navigation. |
| GitHub work tracker | Setup/default/additions, authentication and tool access, issue body/schema and label routes, parent/sub-issue commands, roadmap/tasks, pagination and failure handling. |
| Notion work tracker and notion-shared | Setup/schema discovery, installed guide routing, data-source mapping, access checks, owner steps, existing-project update and approved migration. |
| Local memory and shared local process | Installed entry/reference links, record formats and folders, find/save/correct/forget, Current State, uncertainty and tidying policies. |
| Notion memory | Setup/schema, Inbox capture, verification before closure, filing, partial recovery, correction/supersession, retrieval and scheduler availability; carried forward the concrete Harbor Services rerun. |
| Hindsight | Setup/default package, missions/template application and effective extraction strategies, memory rule wiring, owner-server routing, bank isolation, disabled automatic sessions/Git import, survey checks, temporary add-on patch and update/undo procedure. |
| Salesforce | Setup/default, aliases/API version, official-skill availability, permissions/refuse list, remaining owner steps, org safety, component tracker, data changes and deployment checks. |

The cross-module review used the repository request-evaluation and document-clarity rules, wiki principles/setup/structure/memory definition, owner workflow and Davis memory examples, and the writing-harness-files procedure/checklist. The harness guidance review used the captured official Claude Code and Codex pages for instructions, skills, memory and subagents, with capture dates within the repository’s review window. Progressive reference loading is appropriate; the stale local routes and false Salesforce availability claim are concrete routing defects rather than a reason to expand the root guide.

No additional confirmed setup/update authorization blocker was found. A check-only run does not authorize an external data migration. A routine update does not require a migration merely because it compares toolkit files. An existing project that changes the authoritative store must preserve its records and obtain the scoped migration/cutover approval; the reviewed Notion migration guidance makes that boundary explicit. Pending migration retains the active store and verified cutover aligns the project record homes.

The three .55 routing fixes remained clear in the earlier independently assembled Harbor Services project: PROJECT authority follows verified cutover, deployment reads the selected work/memory stores, and handoff verification can use authoritative wiki evidence. Its concrete state traces and limitations are recorded in `/var/folders/rw/v2t0rhbs65g84mbl3h2ttfj40000gn/T/tkv62-harbor-rerun-iu4oo0ei/harbor-rerun-review.md`.

## Limits

This review examines instructions and their assembled routes; it does not prove runtime success on every host or execute every command. Link scanning distinguished references supplied by a selected overlay from references genuinely absent after assembly. Illustrative record filenames were not counted as broken installation links. Some long reference reads were truncated, with focused follow-up reads for the findings and workflow boundaries; this is not a claim that every line was executed or fully inspected in isolation.

No live GitHub, Notion, Salesforce, or Hindsight operations were run, and no scheduler was activated. Failure scenarios are simulated. The isolated .55 tree contains the Hindsight baseline; concurrent TKV-60 configuration/timeout work in the main checkout was not audited or altered. No Hindsight configuration finding is asserted against that active draft. Parent validation covers marketplace/plugin checks and representative nine-module assembly; this report does not repeat or claim those checks as newly run here.

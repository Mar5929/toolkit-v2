# TKV-64: Toolkit skill content review

The review revised confirmed guidance so the agent can find the owner's process when needed and follow it without avoidable pauses or false host assumptions. Uncertain requirements remain unchanged for Mike's decision.

The changes are on `codex/tkv-64-skill-content-review`, based on `1274bc55`. The manifest version is **0.9.47**. Mike authorized landing the reviewed changes on main on October 11. Publication status and remaining owner-intent questions are tracked in [TKV-64](https://app.notion.com/3f5b381da17680d8baddef8a6de49b5d). No real project installation was changed by this review.

## October 11 follow-up

Mike approved replacing editorial caps with judgment. Current State retains its headings and useful content without per-section quotas or a 40-line ceiling. Memory records split by subject rather than line counts; filenames and summaries are concise without character caps. Briefs and setup guides use relevance rather than response quotas. The startup hook asks the agent to review relevance rather than declaring a record stale by length or age. Host output truncation and tool-read fields remain. Lesson promotion requires supporting evidence rather than a repetition count.

Mike completed the memory interview and authorized implementation. Local templates now carry the required metadata in YAML. Notion uses existing Lore properties and Other fields without schema changes. Ordinary corrections update the existing record; replacements retain linked history. [Editorial-cap follow-up](tkv-64-review/editorial-caps-follow-up.md) and [memory-metadata follow-up](tkv-64-review/memory-metadata-follow-up.md) record the changes and verification.

The starter guide follow-up in version 0.9.47 removes repeated approval wording and fixed/local-only retrieval assumptions. [Guide follow-up](tkv-64-review/starter-guide-follow-up.md) records the omissions found after delivery and the checks.

## What changed and why

| Guidance | Revision | Intended behavior preserved |
| --- | --- | --- |
| Setup entry | Interview details and recovery guidance moved into focused references. | The question order, owner-confirmed facts, answer destinations, choice modules, and preservation of existing files remain. |
| Work-item entry | Team and repository details moved into focused references. Installed tracker files are directly discoverable with their conditions. | One selected tracker, accurate requirements/status/tasks/history, and independent checking remain. |
| Memory entry | Event/run and owner-instruction detail moved into focused references; each store's detail has direct routing. | Search/read before saving, chosen-store differences, sources, uncertainty, owner authority, and save verification remain. |
| Notion tracker | Page updates, exact commands, and recovery instructions moved into focused references. | Live owner templates and schemas win; fresh reads, exact edits, property/body synchronization and readback remain. No database schema changed. |
| Hindsight routes | Shared filing, closure, and handoff now state their chosen-memory behavior directly. | Hindsight has no local memory folder or Current State. Active work remains in the tracker. Standing instructions still change the appropriate rule; a memory save is not a substitute. |
| Memory qualification | Local/Notion use the three criteria in the owner's wiki. A current record means a record remains in use. | Memory is evidence to examine, rather than proof that a claim is true. Other authoritative records retain their ownership. |
| Deadlines and completed work | An overdue commitment remains until its outcome is known. Closed work items remain available as evidence. | Current records summarize useful work; shared lasting facts are carried into project records without discarding source history. |
| Permissions and capabilities | Skills follow actual host permissions and available coordination tools. | Denials, scoped owner authority, production protections, concurrent work safety, and private login steps remain. |
| Continuation and approval | Already granted authorization is recorded and used; forced “keep going” wording is removed where it added a pause. | New requirements, changed results, deployment, and unrelated work still need the approvals their process requires. |
| Setup/update checks | Maintenance exceptions are integrated; copy cleanup occurs after its last use. Local privacy checks verify both untracked and ignored records. Missing restoration parents are created before non-overwriting copies. | Owner records and existing templates remain intact. Checking does not become an unapproved general repair. |
| Repository guides | Root instructions and README describe the current layout, one plugin entry skill, local writing skill, and available checks. | Intended behavior comes from owner records and wiki; old implementation text is not treated as owner approval. |

## Representative before and after

| Before | After | Why |
| --- | --- | --- |
| “In Codex the sandbox keeps .git/ read-only and blocks the network.” | Run under the host's active permissions; report an actual denial and use its supported approval process. | The old claim was false for this host and could require a forbidden tool argument. |
| “Current: it is a fact.” | Current means the record remains in use; its evidence determines what the agent can rely on. | The wiki says remembered claims are not truth. |
| Remove a Coming up date that has passed. | Check the item's outcome; preserve an unfinished commitment and its known deadline. | A past date does not establish completion. |
| Always route Current State and memory work to managing-project-memory. | Local/Notion use that skill; Hindsight uses its rule/tools and the tracker for active work. | Setup does not install that skill or Current State for Hindsight. |
| Design ends with “Say keep going and I'll start the build.” | Continue a build already authorized within its recorded scope; otherwise obtain the needed decision. | Avoid a redundant stop while retaining real approval boundaries. |

## Concision measured against main

Mike clarified on October 11 that instructions should be as short as practical while preserving the process and rules the agent needs. Brevity uses judgment, not a hard limit.

Whitespace-word counts against baseline `1274bc55`:

| File | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| project-setup/SKILL.md | 4,652 | 3,312 | 29% |
| managing-work-items/references/building.md | 3,518 | 2,178 | 38% |
| Notion work-tracker.md | 4,689 | 1,058 | 77% |
| project-setup/reference/update.md | 4,059 | 3,763 | 7% |

Much of the detail moved to focused references for selective loading. Not every entry became shorter: managing-work-items grew from 543 to 780 words, and managing-project-memory from 362 to 495, because routing and clarified requirements were added. Total shipped setup Markdown grew from 151,777 to 154,082 words, about 1.5%. The result improves selective loading and clarity; it does not establish a broad reduction across all skills. Counts are words, not tokens, and no compliance-rate improvement was measured.

## How the workflows still fit together

A meeting or message is filed unchanged as a source with provenance. The agent updates affected work items and records the owner's answers. A decision or question needed across work items goes in DECISIONS.md; approved behavior belongs in system/. Work-item links identify those records after their publication is verified.

At completion or cancellation, the agent reviews what later work needs. Shared decisions, terms, system rules and standing instructions keep their established homes. Other lasting knowledge uses the chosen memory system, with evidence and uncertainty retained. A nonqualifying lesson can stay in the work item; the outcome does not falsely claim a memory save.

Local and Notion memory provide Current State. Hindsight projects use current tracker records for active work and Hindsight for qualifying lasting knowledge. Notion owner edits and live templates remain authoritative. Local ignored records stay in the main checkout, while implementation changes use the repository process.

## Owner decisions still needed

These are questions, not findings that Mike approved the existing wording. The review preserved these rules rather than guessing.

| Topic | Decision needed |
| --- | --- |
| Editorial caps | Mike approved replacing editorial caps with judgment on October 11. The follow-up removes these caps and preserves host limits and exact tool formats. |
| Memory metadata | Mike approved YAML for local metadata, existing Lore properties and Other fields for Notion, updates for ordinary changes, and linked superseded records. Version 0.9.46 implements the mapping; result review remains open. No live memory schema changed. |
| Contact details | Does the local/Notion prohibition on every email address reflect intended sensitive-data policy, or should it distinguish ordinary project contacts from private data? |
| Source decisions | Can a verified transcript statement from an authorized decision-maker count as a decision, or must the owner confirm it again? Existing sourced decisions remain Open under the preserved rule. |
| Update/migration approvals | Must each record migration and destination confirmation get a separate answer, or may a reviewed named batch be authorized? Existing approval granularity remains. |
| Work-item conventions | Are fixed hierarchy/slug/prefix formats, mandatory field sets, exact approval questions and retry counts intentional? Existing exact forms remain. |
| Handoff and helpers | Does the exact handoff notice naming AI remain required? Are helper model/context restrictions deliberate? The review retained them. |
| Salesforce permissions | sf-data-change has an owner-permission override followed by a universal production-write prohibition. Which governs a scoped override? Production protections were preserved. |
| Salesforce manifests | Does the same-members rule apply only to the master deploy manifest, allowing reverse-engineering/work-item manifests outside the component tracker? Platform-specific deployment prohibitions also need current validation before removal. |
| Setup tracking | Does “setup never becomes a work item” cover substantial migration/update work as well as first onboarding? Existing wording remains. |

The Hindsight onboarding work in TKV-60 is still in progress. This review preserves its configuration/package and does not redesign its setup file. The structure wiki contains historical Hindsight package wording that should be reconciled in that work item against Mike's current decisions.

## Verification and its limits

- Claude marketplace and plugin validation passed.
- Codex accepted and installed 0.9.44 in an isolated scratch home.
- All nine tracker/memory assemblies contain their chosen module files and resolve operational links. Checks distinguish absent optional modules and example record links from broken required links.
- Skill front matter, plugin JSON, and delivered JSON/TOML parsed. Whitespace checks passed.
- Scratch startup checks verified local state/index output and Hindsight startup/compaction behavior.
- Scratch restoration verified missing template folders and files are restored without overwriting an existing template or owner record.
- Separate reviewers compared requirements, routes, and commands. All 32 reviewed GitHub/Notion fenced command blocks match the prior version. The original Notion tracker examples are retained.
- Fresh old/new readers walked meeting, authorized-build, check/restore, and closure/publication scenarios. Their findings produced further fixes; intentional behavior changes are explained above.

These checks verify instructions, composition and isolated command behavior. They do not prove a live onboarding conversation, live service writes, real Notion template application, customer project deployment, or a new authenticated Claude/Codex project session. The former dev/tools checks and dev/tests no longer exist; none is reported as passed.

## Animated explainer

This video describes the October 10 delivery, before Mike answered the caps and metadata questions on October 11.

[Watch the narrated explainer](/Users/michaelrihm/Documents/Projects/explainroo/videos/toolkit-tkv64-content-review/out/video.mp4). It is 152.63 seconds at 1920×1080. Final verification reported -14 LUFS, -1.4 dBFS true peak, and 100% understood narration. Layout checks found no errors or warnings; remaining timing hints were reviewed. Stills and the contact sheet were inspected. The video uses no corner watermark and only minimal transition sounds.

## Evidence and review records

Owner evidence: [guiding principles](../toolkit-wiki/Toolkit%20Guiding%20Design%20Principles.md), [setup process](../toolkit-wiki/Toolkit%20Setup%20Process.md), [structure](../toolkit-wiki/ToolkitV2%20Structure.md), [memory definition](../toolkit-wiki/Toolkit%27s%20Definition%20of%20Persistent%20Memory.md), [how Mike works](how-the-owner-works-with-agents.md), and [Davis memory evidence](davis-memory-system.md). The live clarity standard governed revisions. Hindsight was used as historical context, checked against current sources, rather than proof of current behavior.

Official sources read on October 10, 2026: [Claude Code skills](https://code.claude.com/docs/en/skills), [Codex skills](https://learn.chatgpt.com/docs/build-skills), and [Anthropic skill authoring](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices). Their guidance supports clear descriptions, essential entry guidance, directly discoverable supporting files, and detail loaded when needed. It did not justify deleting confirmed owner processes.

Review inventories and requirement comparisons: [setup](tkv-64-review/setup-review.md), [memory and trackers](tkv-64-review/workflow-review.md), [shared skills](tkv-64-review/shared-review.md). Independent reviews: [setup](tkv-64-review/setup-cross-review.md), [memory and trackers](tkv-64-review/workflow-cross-review.md), [shared skills](tkv-64-review/shared-cross-review.md), [final integration](tkv-64-review/final-cross-review.md). Reader simulations: [old instructions](tkv-64-review/old-reader.md), [revised instructions](tkv-64-review/new-reader.md). [Assembly check results](tkv-64-review/integrity-results.json) record the scratch checks.

## Changed files

The links below include revised files and newly separated references. Inventories explain the protected behavior and reasons for each revision. No shared vocabulary was renamed; headings and routing were integrated at their new locations.

- [.claude-plugin/marketplace.json](../.claude-plugin/marketplace.json)
- [.claude/skills/writing-harness-files/SKILL.md](../.claude/skills/writing-harness-files/SKILL.md)
- [.claude/skills/writing-harness-files/references/checklist.md](../.claude/skills/writing-harness-files/references/checklist.md)
- [AGENTS.md](../AGENTS.md)
- [README.md](../README.md)
- [plugins/toolkit/.claude-plugin/plugin.json](../plugins/toolkit/.claude-plugin/plugin.json)
- [plugins/toolkit/.codex-plugin/plugin.json](../plugins/toolkit/.codex-plugin/plugin.json)
- [plugins/toolkit/skills/project-setup/SKILL.md](../plugins/toolkit/skills/project-setup/SKILL.md)
- [plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/.claude/skills/managing-project-memory/references/memory-store.md](../plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/.claude/skills/managing-project-memory/references/memory-store.md)
- [plugins/toolkit/skills/project-setup/choices/memory/local/local-memory-setup.md](../plugins/toolkit/skills/project-setup/choices/memory/local/local-memory-setup.md)
- [plugins/toolkit/skills/project-setup/choices/memory/notion/reference/notion-memory-known-problems.md](../plugins/toolkit/skills/project-setup/choices/memory/notion/reference/notion-memory-known-problems.md)
- [plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/SKILL.md](../plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/SKILL.md)
- [plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/current-state.md](../plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/current-state.md)
- [plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/finding.md](../plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/finding.md)
- [plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/memory-criteria.md](../plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/memory-criteria.md)
- [plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/memory-process.md](../plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/memory-process.md)
- [plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/saving.md](../plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/saving.md)
- [plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/tidying.md](../plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/tidying.md)
- [plugins/toolkit/skills/project-setup/choices/notion-shared/files-to-add/.claude/skills/using-notion-cli/SKILL.md](../plugins/toolkit/skills/project-setup/choices/notion-shared/files-to-add/.claude/skills/using-notion-cli/SKILL.md)
- [plugins/toolkit/skills/project-setup/choices/notion-shared/files-to-add/.claude/skills/using-notion-cli/references/ntn-commands.md](../plugins/toolkit/skills/project-setup/choices/notion-shared/files-to-add/.claude/skills/using-notion-cli/references/ntn-commands.md)
- [plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh-commands.md](../plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh-commands.md)
- [plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-project-roadmap-and-tasks.md](../plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-project-roadmap-and-tasks.md)
- [plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-searching.md](../plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-searching.md)
- [plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/.claude/skills/managing-work-items/references/work-tracker.md](../plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/.claude/skills/managing-work-items/references/work-tracker.md)
- [plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/work-items/AGENTS.md](../plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/work-items/AGENTS.md)
- [plugins/toolkit/skills/project-setup/choices/work-items/local/local-work-items-setup.md](../plugins/toolkit/skills/project-setup/choices/work-items/local/local-work-items-setup.md)
- [plugins/toolkit/skills/project-setup/choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/references/work-tracker.md](../plugins/toolkit/skills/project-setup/choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/references/work-tracker.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/rules/shared-repository-work.md](../plugins/toolkit/skills/project-setup/every-project/.claude/rules/shared-repository-work.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/SKILL.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/SKILL.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/references/file-source.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/references/file-source.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/references/record-decision.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/references/record-decision.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/SKILL.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/SKILL.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/examples/handoff-example.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/examples/handoff-example.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/references/handoff-verifier.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/references/handoff-verifier.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/SKILL.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/SKILL.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/builder-brief.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/builder-brief.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/building.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/building.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/closing.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/closing.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/designing.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/designing.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/lifecycle-rules.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/lifecycle-rules.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/merge-and-clean-up/SKILL.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/merge-and-clean-up/SKILL.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/publish-docs/SKILL.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/publish-docs/SKILL.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/pull-latest/SKILL.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/pull-latest/SKILL.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/reset-to-remote/SKILL.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/reset-to-remote/SKILL.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/session-summary/SKILL.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/session-summary/SKILL.md)
- [plugins/toolkit/skills/project-setup/reference/finishing.md](../plugins/toolkit/skills/project-setup/reference/finishing.md)
- [plugins/toolkit/skills/project-setup/reference/placing-files.md](../plugins/toolkit/skills/project-setup/reference/placing-files.md)
- [plugins/toolkit/skills/project-setup/reference/skills-hooks-settings.md](../plugins/toolkit/skills/project-setup/reference/skills-hooks-settings.md)
- [plugins/toolkit/skills/project-setup/reference/update.md](../plugins/toolkit/skills/project-setup/reference/update.md)
- [plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/events-and-recurring-jobs.md](../plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/events-and-recurring-jobs.md)
- [plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/owner-instructions.md](../plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/owner-instructions.md)
- [plugins/toolkit/skills/project-setup/choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/references/work-tracker-commands.md](../plugins/toolkit/skills/project-setup/choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/references/work-tracker-commands.md)
- [plugins/toolkit/skills/project-setup/choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/references/work-tracker-known-problems.md](../plugins/toolkit/skills/project-setup/choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/references/work-tracker-known-problems.md)
- [plugins/toolkit/skills/project-setup/choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/references/work-tracker-page-updates.md](../plugins/toolkit/skills/project-setup/choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/references/work-tracker-page-updates.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/build-repository.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/build-repository.md)
- [plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/team-arrangement.md](../plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/references/team-arrangement.md)
- [plugins/toolkit/skills/project-setup/reference/setup-interview.md](../plugins/toolkit/skills/project-setup/reference/setup-interview.md)
- [plugins/toolkit/skills/project-setup/reference/setup-problems.md](../plugins/toolkit/skills/project-setup/reference/setup-problems.md)

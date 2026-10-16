# TKV-79 shared skills and Salesforce execution

This record maps the shared-skill and Salesforce proposals to the implemented files and the requirements preserved. Work is ready for independent review; this record does not approve a merge or mark TKV-79 Done. The parent work item holds current status and owner authorization.

The branch is `codex/tkv-79-shared-salesforce`, based on `3c8113e24a4519cd41e3e9404703b4490ed3e064`. Paths below start at `plugins/toolkit/skills/project-setup/`. `EP` means `every-project/`, and `SF` means `choices/salesforce/`.

## Proposal dispositions

| IDs | Phase | Disposition and evidence | Requirements preserved |
| --- | --- | --- | --- |
| A6, A7 | 1 | Changed handoff example, verifier, and prompt template to use the configured tracker and its read instructions. | Work items remain identified by ID; the verifier still needs fresh evidence and reports inaccessible claims as Skipped. |
| A8 | 1 | Changed merge-and-clean-up to resolve the linked work item through managing-work-items and the configured tracker. | GitHub remains the code host; exact PR/head approval and safety checks remain. |
| A10 | 1 | Changed the Salesforce Work Item column to use the tracker link when it has one. | The work item ID remains required and a folder path remains forbidden. |
| B2 | 2 | Changed sf-deploy-check to use the project's own dependency tool when available. | Every suspected unrelated change still requires a read-only target check; confirmed scope problems stop deployment. |
| B4, B5 | 2 | Changed using-notion-cli from a Mac assumption to this computer and an available JSON tool when jq is missing. | Every ntn api call still ends with stdin redirected from /dev/null; separate calls, credential boundaries, and write safeguards remain. |
| B11, C12 | 2 and 5 | Changed the session-summary example to a neutral export/email scenario and clarified that the recap itself saves nothing. | Owner approval is still needed for an offered record creation; the table and open block retain their prescribed form. |
| B12 | 2 | Removed the Obsidian-specific reset example. | Reset still preserves ignored folders and forbids git clean -x/-X. |
| B13 | 2 | Renamed the deployment record field to Deploy scope check (sf-deploy-check). | Deployment evidence field remains. |
| B14 | 2 | Retained the existing WI-031 example. | It is the toolkit's established illustrative ID, not an actual project dependency. |
| B15 | 2 | Retained tools/**/*.md in publish-docs. | Removal could break an owner's existing document extension; evidence does not establish that the accepted path is unused. All existing refused-file protections remain. |
| C11 | 2 | Added sf logic run test to org-safety's command list, matching the existing sf logic run refuse prefix. Replaced the ambiguous legacy-deploy sentence with the modern manifest/source-path procedure. | No org write, validation, Apex, or test command may omit its explicit target org. The production/read-only permission rules remain. |
| D1, D3, D6, D7, D8, D21 | 3 | Removed duplicated definitions from shared skills and delivery's guide where their shared home already defines the term. | Definitions inside the isolated verifier brief and the handoff template remain where the recipient needs them. The prompt's Current state instructions remain. |
| D2 | 3 | Removed host-permission paragraphs from shared Git skills. | The always-loaded shared repository rule remains authoritative; no approval point or denial workaround was added. |
| D4 | 3 | Removed sf-data-change's repeated permission table; shortened Salesforce deployment triggers to route to the owning skills. | Owner permissions, permission duration, production defaults, org flags on failed deploys, and manual-step statuses remain in their owning files. |
| D5 | 3 | Removed handoff's repeated routing table and using-notion-cli's duplicate routing table. Retained contextual routes that carry operational distinctions. | Neighbor skills still own the same work, and required references remain discoverable. |
| D10 | 4 | Removed repeated stage-by-name prose from conflict resolution, while retaining exact git add commands and publish-docs' staging procedure. | Approved-file scope and staged-diff verification remain. |
| D15 | 3 | Retained no-AI-credit requirements in the existing shared skills and merge reference. | No always-loaded rule receives new text. |
| D16 | 3 | Routed handoff, filing-project-records, and merge reporting to managing-work-items/references/reporting-a-save.md. | The shared reference must preserve the exact Not saved and Saved but not verified wording. No AGENTS additions. |
| D17, E15 | 3 | Routed verifier startup to managing-work-items/references/starting-a-helper.md; removed its local startup/model paragraph. | Verifier remains isolated from session history and must receive the exact brief and source evidence. The shared helper procedure supplies model selection and host tools. |
| D20 | 3 | Retained both MAIN command copies in the local choices; no shared rule change. | A project with either local choice alone can still locate its main checkout. |
| D36 | 3 | Removed handoff's repeated routing content. Retained its fixed-first-line contract and failure behavior. | The fixed notice is required by the existing handoff process and is not delivered-code credit. A failed save or verifier never withholds the prompt. |
| D37 | 3 | Shortened filing-project-records' repeated scope and source definitions. Kept table routing and operational source processing. | Received sources stay unchanged, source IDs reserve only after save, and work-item links still wait for verified availability. |
| D38 | 3 and 6 | Removed the Notion skill's repeated routes and redundant JSON-extraction/pagination explanation. | Relation-list replacement, complete pagination, exact page replacements, protected child/view lines, template safeguards, and read-back checks remain. |
| D39 | 3 and follow-up | Removed repeated successful-org-flag instructions and redundant whole-component wording. | One row per component, independent flags, failed-deploy protection, destructive lifecycle, whole-source deployment, and live-org verification remain. |
| D45 | 3 | Shortened Salesforce deployment-rule repetition of the two skills it routes to. Retained safety/permissions enforcement explanations. | CLI safety remains always loaded; no path filter and no owner-permission changes. |
| E1 | 4 | Retained all nine manual-step examples after reviewing their protected behavior. | Assignment, connector mapping, existing-record migration, baseline comparison, scheduling, ordered clearing, dependencies, one-time backfill, and non-Git rollback data are distinct requirements. No arbitrary example limit was imposed. |
| E8 | 4 | Replaced reset's lockfile-command table with package-manager selection from the lockfile. | Multiple lockfiles still require the owner's choice; no lockfile means no install; a missing installer is never installed. |
| E9 | 4 | Moved data CSV ignore verification into Salesforce setup step 12. | Both production backup and load folders are tested; test files are deleted; real data remains ignored. Existing step numbers remain. |
| E10 | 4 | Removed salesforce-known-problems.md and its setup link: its only item routed a platform question rather than describing a failure. | Salesforce own-skills setup and permissions remain. Update handling must remove this retired setup-only reference safely. |
| E14 | 4 | Retained uncertain-write recovery in ntn-commands.md. | A failed write may succeed remotely: read/search before retrying prevents duplicates. General recovery/backoff guidance protects this real edge case. |
| E16 | 4 | Retained shaping-a-prompt's interview steps. | Playback, clarification, deliverable choice, prompt approval, and separate execution instruction are owner process, not redundant coaching. |
| E17 | 4 | Folded Salesforce load guidance into load-step preparation and retained update-cell completeness as its own check. | Exact paths, values, field mappings, null settings, recovery, and inexperienced-operator readability remain. |
| E18 | 4 and follow-up | Removed sf-deploy-check's risk ranking and repeated explanatory section. | The operational target-org read and stale-tracker safeguards remain in check step 4. |
| E19 | 4 | Removed CSV quoting tutorial and list of metadata-type examples. | Fixed column order and valid Salesforce metadata type are still required; CSV editing remains specified. |
| F1, F6, F7 | 4 | Removed arbitrary reply-length language and unnecessary counts of lists. | Exact status vocabulary, prescribed fields, real technical limits, and verification proofs remain. |
| F4 | 4 | Replaced fixed template polling intervals/time limit with progress-sensitive checking. | Template readiness still requires stable nonempty content; a stalled template is reported and not applied twice. |
| G2 | 5 | Moved publish-docs' edit-carrying and checkout-update details to references linked at their steps. | Version comparison, copying boundaries, timing of own-copy removal, no-remote workflow, overlap checks, and ff-only updates remain. |
| G3 | 5 | Moved credit handling and queued/auto-merge cases to special-merge-cases.md. | Skill opens credit rules before merging; no cleanup until MERGED, exact checked-head matching, and fork protections remain. |
| G4 | 5 | Split sf-component-tracker into deployment-records, manifests, manual-steps, and component-tracker-format references. | All tracker columns/values, manifest membership/exclusions, destructive rules, manual triggers/body/ownership, and same-response updates remain. |
| G7 | 5 | Moved neutral session-summary example into examples/session-summary-example.md. | Skill directly links the example; table and open-block instructions remain in SKILL.md. |
| G9 | 5 | Retained Salesforce rules without path filters. | Running a CLI command must load safety even when no Salesforce file was read. |
| G10 | 5 | Retained Salesforce setup's existing single-action numbered procedure and step numbering. | Cross-file step links remain valid; setup still changes no org. |
| H1 | 6 | Rewrote pull-latest and braindump fragments as complete instructions. | Playback approval, scoped correction, Git safety, chosen remote, conflict abort/approval, and report requirements remain. |
| H6 | 3 | Replaced ownership metaphors for a record ID with explicit reservation after saving. | Source IDs remain unavailable until their save is on the default branch. |
| J1 | 3 | Removed the isolated handoff-verifier copy-maintenance comment. | Setup/update authority is unchanged. |

## Official evidence

The following pages were read on 2026-10-13 for the kinds of files changed:

- [Claude skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices), [Claude Code skills](https://code.claude.com/docs/en/skills), and [Codex skills](https://learn.chatgpt.com/docs/build-skills) support on-demand skill references and preserved exact procedures.
- [Claude Code memory](https://code.claude.com/docs/en/memory) and [Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) cover shared guide loading.
- [Salesforce Flow tests](https://developer.salesforce.com/docs/platform/salesforce-cli-reference/guide/cli_reference_flow_run_test.html) identifies `sf flow run test` and points to `sf logic run test` for combined Apex/Flow testing. The existing refuse-list prefix covers both commands.

## Verification and integration

Changed skill front matter passed structural checks. Local Markdown references in changed files resolved; references supplied by memory choices were treated as supplied files. `git diff --check` passed. No live Salesforce action ran.

The parent integration supplies `starting-a-helper.md` and `reporting-a-save.md`, updates handoff's moved Levels reference, runs marketplace/plugin and scratch-host checks, and performs independent review. No manifest or version was changed here. No push, pull request, default-branch merge, or work-item Done transition ran here.

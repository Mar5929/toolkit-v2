# Hindsight onboarding review for TKV-60

The video supports Toolkit's existing operating package. The most useful additions are checks for service authentication, migration, functional behavior, and backup ownership. It does not justify changing deliberate saves, per-project banks, or generated startup summaries.

Mike approved full incorporation of the useful findings into the shipped onboarding guidance on October 11. The live concurrency/batching trials are separate from this document update; startup reliability remains under investigation.

## What was checked

I read both supplied Markdown documents and retrieved the original [Wanderloots video](https://www.youtube.com/watch?v=UVEjThz8DSo) through Firecrawl on October 11, 2026. The result included its description, chapters, and automatic narration transcript. I compared that narration with the current Hindsight [Coding Agents README](https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/coding-agents/README.md), [model guide](https://hindsight.vectorize.io/developer/models), [configuration reference](https://hindsight.vectorize.io/developer/configuration), and [Admin CLI guide](https://hindsight.vectorize.io/developer/admin-cli).

I read the current Hindsight choice module, its package, missions, template application guidance, known problems, and installation guidance. I checked the setup route in `project-setup/SKILL.md`, which now points to the Hindsight choice module. Relevant Git history includes `a6ae4c6d` (answer-folder integration), `34ec8b67` (reviewed defaults and missions), and `b6094a7f` (temporary bank-detection patch).

I also read the project's setup process, memory definition, guiding principles, owner workflow examples, Davis memory reference, request-evaluation rule, and document clarity rule. Draft instructions below follow the plain-English choice-module pattern. Current Claude Code skill guidance, Codex skill guidance, and Anthropic skill-authoring guidance were consulted for the subsequent harness updates.

> 🧠 **From Hindsight memory (Hindsight onboarding: one folder, default package, then missions)** — The earlier initiative established the package-first interview, then project instructions, then effective configuration checks. Its account of automatic saves, recall injection, and an unconnected module is historical and disagrees with today's files. The current files determine this review's baseline; the parent agent reports that a correction was already saved.

The automatic transcript alone does not establish exact model IDs. A subsequent direct inspection of the video frame at 5:04 verified the visible model and operation settings listed below. Full mission strings and the creator’s downloadable scripts remain unverified. The video uses local Docker and later v0.9.0; it does not document Mike's Hostinger installation. Current `main` documentation is not proof that a setting exists in the installed release.

## Current Toolkit package

The current package offers deliberate saves with `retainSessions: false`, concise extraction, observations and automatic consolidation, a survey for software projects, no Git import, pre-storage security exclusions with automatic redaction off by default, shared observations within each project bank, generated startup reflection, seeded knowledge pages, and hourly page refresh. The configured client budgets are `reflectTimeoutMs: 90000` and `injectTimeoutMs: 15000`, with a 120-second first-message hook.

The interview already explains this package and asks whether the owner wants it or changes. It separately offers retain, observations, and reflect missions, prepares effective extraction strategies, reads existing settings, validates before enabling capture, and checks behavior in a new session. This package is much more deliberate than the video's global automatic-capture demonstration.

## Comparison with the video

| Video guidance | Current Toolkit coverage | Recommendation |
| --- | --- | --- |
| Retain concise facts; adapt and test a mission. | Concise extraction, three recommended missions, preview checks, strategy overrides, and approval are present. | Keep the current package. The video reinforces it. |
| Use observations and a reflect mission that acknowledges uncertainty. | Both are present; missions distinguish owner decisions, reports, uncertainty, and historical evidence. | Keep the current wording. |
| Redact sensitive data. | Current defaults exclude security-compromising text before storage; automatic redaction is off. Existing approved filters remain until replacement protection is verified. | Preserve usable qualifying contact details and verify every writer. Extraction missions do not scrub stored source documents. |
| Keep knowledge pages as maintained summaries, separate from reviewed documentation. | Current missions and tool guidance describe memory as past evidence; pages are enabled. | Explain explicitly that pages and summaries can be wrong and do not establish current status or permission. |
| Give Hindsight its own durable Codex login. | The package identifies the provider but does not explain authentication isolation or verify persistence. | Add a shared-service prerequisite check. This is the most consequential omission for reliability. |
| Use a lighter Retain model and stronger consolidation/Reflect model. | No model-role decision is part of per-project onboarding. | The frame shows Retain gpt-5.6-luna and consolidation/Reflect gpt-5.6-terra. Document service roles and benchmark shared-server changes. |
| Test Retain and Recall before connecting agents, then test both directions between agents. | Preview, retrieval, survey, pages, and new-session summary checks are present. | Make the functional flow explicit: preview, approved save, successful processing, Recall, Reflect, then the actual startup path and intended hosts. |
| Replace the legacy Codex connector with the unified connector and trust changed hooks. | Unified installation and hook trust are present. | Add an audit for legacy/duplicate hook and MCP registrations, preserving unrelated configuration. |
| Use one global bank and tags for related projects. | Toolkit deliberately chooses one bank per project, shared by Claude Code and Codex. | Keep per-project banks. Treat a shared global bank as an owner-approved deviation with isolation tradeoffs. |
| Add project/harness labels. | Template guidance covers optional labels; the add-on already supplies provenance and knowledge labels. | Inspect existing labels before proposing extras. Preserve add-on routing; avoid duplicate harness labels. |
| Back up, then upgrade the server. | No explicit backup owner, restore verification, or upgrade ownership appears in the Hindsight choice. | Record who operates the shared service and what verified backup/update process exists. Do not run whole-server administration in every project onboarding. |
| Use one-click launchers and a kit of scripts. | Toolkit uses plain-English procedures and native tools. | Do not copy the creator's scripts or create Toolkit setup programs. |

The video contains no measured answer to this project's startup delay. Authentication isolation and model roles are useful leads. Its success demonstrations do not prove that the current Hostinger service, subscription provider, hook deadline, or page refresh behaves the same way.

## Proposed plain-English additions

Mike approved incorporating these recommendations on October 11. The following wording describes the reviewed additions; the shipped module holds the resulting procedure.

### Connection and service readiness

Place this in `hindsight-setup.md`, under “Confirm the connection and bank,” with service detail in `reference/how-the-owners-hindsight-works.md`:

```markdown
Confirm both connections: the coding-agent add-on reaches the intended Hindsight bank, and Hindsight can use its model provider. For a service using Codex subscription authentication, verify that its credentials live in a persistent directory used only by that service. Record the effective provider and model roles without exposing credentials. When the service is shared, identify its operator and report missing service checks before proposing changes that affect other banks.
```

This establishes a readiness check without assuming project onboarding owns the server. A health endpoint or successful Recall only verifies part of the system; it does not prove that OAuth-backed extraction or reflection works. Hindsight's official models guide specifically documents independent `CODEX_HOME` storage to avoid refresh-token rotation conflicts.

### Existing installation migration

Place this in the add-on installation step:

```markdown
Before replacing an existing integration, inspect its hook and MCP registrations. Keep one active integration for each intended host and preserve unrelated handlers. Carry forward the approved server, bank routing, capture settings, and record locations. After installation, verify the effective configuration and have the owner trust changed Codex hooks.
```

The video's uninstall step applies to its existing legacy connector. It does not authorize deleting an unrelated MCP server. Current first-party documentation confirms that the unified package supersedes the older connectors and can adopt their endpoint settings, but migration behavior must be checked against the installed package.

### Verification of the complete memory flow

Integrate this into the existing verification step; retain its requirement to agree on a saved sample:

```markdown
Verify the approved memory flow through the installed tools. Check representative extraction without storing it, then use an owner-approved sample when a saved record is needed. Confirm that processing succeeds, Recall returns the intended evidence, and Reflect can produce a complete answer. In a new session, confirm that the generated startup summary arrives from the intended bank within the host's deadline. When both Claude Code and Codex are intended to use the bank, verify access from both. Inspect survey and page-refresh results separately. Report the failed stage and keep setup open when a required check fails.
```

No arbitrary test count or latency target is introduced. Check the intended behavior and actual host deadline. A sample that only appears in Recall does not demonstrate working startup synthesis; a fast provider request does not demonstrate a complete summary.

### Meaning of generated knowledge

Add this explanation to “What to tell the owner” in `hindsight-package-default.md`, merging it with the existing reliability explanation:

```markdown
Startup summaries, observations, and knowledge pages are generated from past evidence. They can omit details or repeat an old or mistaken claim. The agent checks changeable claims against the current project records and keeps owner decisions distinct from generated conclusions.
```

This preserves Hindsight as the project's memory store while explaining why generated pages do not replace the project's specifications, current work tracker, or reviewed records. It does not add a second memory system.

### Shared-service backup and update ownership

Place a short check in connection readiness, with details in the service reference:

```markdown
Record who operates the Hindsight service and where its backup and update procedure is kept. Confirm that backups are reaching their intended destination and that recovery has been verified away from the live database. Before a shared-service update, record the current version, the backup, the effect on connected projects, and the recovery procedure. Use the service's native administration tools and the owner's existing scheduling mechanism.
```

This check should reference an existing server runbook rather than copy private Compose files into every project. The Admin CLI connects directly to PostgreSQL; an API URL alone is insufficient to perform its backup. The video's kit scripts and schedule are not available in the transcript.

## Settings to document or offer

| Setting or choice | Scope | Recommendation and tradeoff |
| --- | --- | --- |
| `HINDSIGHT_API_LLM_PROVIDER=openai-codex` | Shared Hindsight service. | Document the effective current provider. It uses the account allowance; authentication isolation does not create additional quota. |
| Dedicated `CODEX_HOME`, or `HINDSIGHT_API_LLM_CODEX_HOME` | Shared service authentication. | Use a persistent service-only auth directory supported by the installed version. A path such as `/var/lib/hindsight/codex` is an example, not an instruction to replace Mike's actual mount. Persist the directory and verify permissions privately. |
| `HINDSIGHT_API_RETAIN_LLM_MODEL` | Shared service Retain role. | A supported lighter model is a benchmark candidate. Compare representative extraction quality and processing time before adopting it. |
| `HINDSIGHT_API_CONSOLIDATION_LLM_MODEL` | Shared service observation building. | A stronger model is optional when measured quality warrants its latency and allowance use. |
| `HINDSIGHT_API_REFLECT_LLM_MODEL` | Shared service Reflect and generated summaries. | Measure complete startup and page synthesis. Do not assume that stronger means better for startup or select an unverified video model ID. |
| Local embedding and reranking models | Shared service search. | Record the existing settings; do not change embedding models as an unmeasured timeout remedy. The video leaves embedding local. |
| `retainTags: ["project:{gitProject}"]`, `retainMetadata: {"repo": "{gitProject}"}` | Add-on document provenance; optional, especially for an approved shared bank. | Current README documents these values. They stamp known source context more reliably than model-extracted project labels, but do not make a shared bank an authorization boundary. Check installed release support. |
| Bank labels and tags | Bank configuration. | Offer only for a useful retrieval purpose. Existing add-on `source:`, `harness:`, and `knowledge:` routing must be preserved. Do not blindly copy a video label scheme. |
| Shared global bank | Cross-project memory architecture. | Optional owner decision; it enables cross-project recall and increases accidental mixing. Keep one project bank as the default. Use current `mapPathToBank`/bank selection mechanisms; do not add legacy `dynamicBankId` because the video used it. |
| Automatic sessions | Project capture policy. | Already an optional change. Keep deliberate saves as default. Explain that transcripts can be stored even if extraction produces no durable fact. |

The environment keys and metadata settings in the preceding recommendations were checked in current first-party documentation; the exact deployed support and visible video settings are distinguished in the timeout findings. The report does not assign a minimum supported release that was not verified. Onboarding should inspect actual release support and effective overrides before offering exact values.

The timeout assessment correctly distinguishes automatic injection from agent-invoked Reflect. Current upstream automatic defaults are 20 seconds for Reflect and 7 seconds for fallback retrieval; the current Toolkit package deliberately uses 90 seconds and 15 seconds with a 120-second hook. Those current budgets can account for a roughly 100-second wait and should be described as timeout allowances, not expected performance. Increasing them again would not establish or fix a root cause. Preserve generated reflection while investigating the measured path.

## Delivered memory rule inventory

The delivered `files-to-add/.claude/rules/hindsight-memory.md` exists and is tracked. The earlier missing-payload claim was incorrect because the file search omitted hidden `.claude` paths. Complete installed-project wiring and interactive setup still need their own verification.

## Recommended decision

Keep the current operating defaults and interview order. Approve the added service readiness, migration, complete-flow verification, and backup ownership guidance if it matches Mike's intended setup. Treat model tuning as a separate shared-server decision supported by the timeout investigation. The video provides useful architecture and operating checks; it does not supply a better universal configuration package or an established timeout fix.

## Model configuration verified from the video screen

Direct frame inspection at [5:04](https://www.youtube.com/watch?v=UVEjThz8DSo&t=304s) resolves the exact IDs that the automatic transcript could not establish. The video’s Compose configuration shows:

| Role | Model | Reasoning effort | Model-call concurrency |
| --- | --- | --- | --- |
| Global default | `gpt-5.6-terra` | `low` | `4` |
| Retain | `gpt-5.6-luna` | `low` | `1` |
| Consolidation | `gpt-5.6-terra` | `medium` | `1` |
| Reflect | `gpt-5.6-terra` | `medium` | `2` |

The provider is `openai-codex`. Embedding remains local. The same visible block sets `HINDSIGHT_API_LLM_TIMEOUT` to `300` and `HINDSIGHT_API_REFLECT_WALL_TIMEOUT` to `600`. These are server limits in seconds, not the coding-agent startup client deadline. The visible excerpt does not show a separate page-refresh model.

His narrated rationale is efficient frequent extraction with Luna and stronger, less frequent consolidation and reflection with Terra. This is the same subscription mechanism as Mike’s setup, with different role and capacity settings. Before the concurrency pilot, Mike’s global cap was 1 and all model-role overrides were unset. The proposed GPT-6 Luna reflection pilot is an experimental departure from the video’s GPT-5.6 Terra Reflect choice. It should not be presented as copying his setup.


## Implemented bank-strategy guidance — October 11, 2026

Mike authorized evaluating the [official bank-strategy blog](https://hindsight.vectorize.io/blog/2026/07/16/bank-strategy-agent-memory) and incorporating useful guidance. The project-setup interview now links `reference/hindsight-bank-strategy.md`; package defaults and project additions record stable identity and sharing scope. The default remains one bank per project shared by its Claude Code/Codex hosts, with deliberate saves and generated startup reflection.

The guidance covers intentional sharing, stable routing across machines/checkouts/worktrees, tags as query organization rather than access control, destination verification before writes, and separately approved migration. It does not infer a new bank from empty recall or split banks as an unmeasured performance fix. API documentation clarifies that writes create missing banks and missing-bank reads return404. A different ID may be an alias: verify the underlying identity before calling it migration.

Independent review and Claude plugin validation passed. Toolkit0.9.51 installed/enabled in a scratch Codex home. Full interactive setup and Windows remain unverified. The earlier reported missing delivered memory rule was an inventory mistake: the tracked hidden `.claude/rules/hindsight-memory.md` payload exists. The other video-derived proposals above remain proposals, not bundled changes.


## Full onboarding consolidation

Mike approved carrying all useful TKV-60 insights into the recommended setup package on October 11. The shipped module now routes the interview through service readiness, bank strategy, operating defaults, missions, effective configuration and full memory-flow verification. Supporting service guidance contains source-linked model alternatives, the provisional4/2/1/1/1capacity profile and bucket batching, measured results and their limits, service-only persistent subscription authentication, backups, upgrade/patch checks and rollback. Known problems explain diagnosis rather than treating fallback or larger deadlines as a fix.

The bank package preserves deliberate saves, generated Reflect, three missions, the security checks for every writer and recorded owner choices. Observation entity expansion is a measured optional tuning choice; default evidence budgets do not constrain explicit model-selected requests, and page refresh has its own retrieval options. Live service settings were not changed by this consolidation. Model alternatives remain unvalidated recommendations for a separate comparison. Current local version is0.9.52; final review and validation receipts are tracked in TKV-60.

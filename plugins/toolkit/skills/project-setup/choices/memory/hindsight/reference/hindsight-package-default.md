# Default Hindsight settings

Offer this package after confirming the server and bank, before choosing a template. It sets how the project uses Hindsight. The template or the owner's own instructions supply the missions and other project-specific bank configuration. The owner may change any setting.

## What to tell the owner

- The agent saves qualifying project memory deliberately. Conversations are not saved or imported automatically.
- Hindsight extracts concise facts from saved records. The original record remains a document; extraction instructions do not filter that document's contents.
- Observations and automatic consolidation are on. Hindsight combines saved facts into broader conclusions. Claude Code and Codex contribute to shared observations.
- The agent receives a generated summary at the start of a session. Knowledge pages summarize the bank's subjects and refresh hourly when stale.
- Offer the code survey on for software projects after its pre-storage security checks pass. A background agent reads the code and saves structural findings; this is separate from deliberate saves under the owner's memory criteria. Offer it off for a project without code.
- Git history is not imported.
- The agent excludes secrets and information whose storage could compromise system, product, or project security before sending records to Hindsight. Ordinary contact details may be saved when they meet the memory criteria. Automatic redaction is off by default; offer a filter only after verifying that it matches this policy.
- Each project uses its own recorded bank on the owner's server. The project's Claude Code and Codex sessions share that bank. Broader sharing is an explicit owner choice, agreed during the connection interview.
- The shared service uses its verified working models and capacity profile, described in [the service settings](hindsight-server-settings.md). A project's acceptance does not authorize changes affecting other banks.

Ask whether the owner wants these defaults or changes for this project.

## Costs and limits

The saved records, observation building, page refreshes, and startup summaries use the owner's server's model provider. On this server that is OpenAI through the owner's ChatGPT subscription. A code survey also uses the Claude or Codex allowance. Only deliberately saved records and survey findings are available; an omitted fact is not remembered. Startup summaries, observations, and knowledge pages can lose detail or repeat old or mistaken claims. Check changeable claims against current project records and distinguish owner decisions from generated conclusions.

## Connection settings

The add-on uses `~/.hindsight/coding-agent.json`. Check these settings even when the API key already exists. Merge approved changes without replacing other projects' entries.

| Setting | Default | Purpose |
| --- | --- | --- |
| `serverMode` | `"self-hosted"` | Use the owner's server. |
| `apiUrl` | `"https://memory-api.mrihm-memory.com"` | Connect to the API. |
| `optInOnly` | `true` | Run only for approved project paths. |
| `optInPaths` | The project's main checkout, added to existing entries | Approve this project. |
| `mapPathToBank` | Main checkout mapped to its bank ID | Route the project and linked worktrees to the bank. |

## Add-on settings for this bank

Put these under `banks`, under the resolved bank ID. Read existing path and harness overrides too, and confirm the effective configuration.

| Setting | Default | Purpose |
| --- | --- | --- |
| `retainSessions` | `false` | No automatic sessions or past conversation imports. |
| `retainExtractionMode` | `"concise"` | Extract selected lasting facts. |
| `gitIngest` | `"none"` | Import no Git history. |
| `codebaseSurvey` | `true` for software projects | Save structural findings; keep off until verification. |
| `autoInject` | `"reflect"` | Generate a startup summary. |
| `reflectTimeoutMs` | `90000` | Allow the server time to produce the summary. |
| `injectTimeoutMs` | `15000` | Allow fallback page search and recall when the summary fails. |
| `recallOptions` | `{"types": ["observation", "world", "experience"], "budget": "mid", "max_tokens": 2500}` | Retrieve observations and individual facts in fallback recall. |
| `observationScopes` | `"shared"` | Build a shared observation scope. |
| `pageTriggerType` | `"cron"` | Refresh pages on a schedule. |
| `pageTriggerCron` | `"H * * * *"` | Refresh hourly, staggered by page. |
| `toolGuideExtra` | The text below | Explain deliberate saving and how to use memory. |

Keep the add-on's seeded knowledge pages on. Use its current defaults for settings not named here, including survey refresh frequency; report any inherited setting that conflicts with the owner's choice. The first-message hook timeout is 120 seconds in both hosts, allowing the summary and fallback budgets. Recheck it after installation.

The 90-second reflection and 15-second fallback budgets are deadline allowances, not expected latency. The 2,500-token `recallOptions` limit applies to fallback Recall, not the startup Reflect context. A fallback alone does not pass the startup-summary check.

## Complete startup delivery

After installing the add-on, set `additionalContextLimit: 5000` on its existing Codex `UserPromptSubmit` command handler that returns startup memory. This is a native host setting, not a field in `coding-agent.json`. Preserve its command, other handlers and existing higher approved allowances; do not create a duplicate Hindsight hook. Check support in the installed Codex version, have the owner trust the changed entry, and verify actual delivery. Recheck the allowance and deadline after add-on updates. Keep startup context relevant rather than raising the allowance without assessing its size and usefulness; [Codex's large-output documentation](https://learn.chatgpt.com/docs/hooks#large-hook-output) describes the control.

Claude Code has a fixed 10,000-character limit per hook context string. It saves longer output to a file and supplies a preview; [its hook documentation](https://code.claude.com/docs/en/hooks#json-output) provides no setting to raise that limit. Install the delivered memory rule and its root-guide pointer so both agents read a supplied complete-output file before answering or relying on that memory. Verify the read in a normal session where file tools are available. A preview or successful Reflect call alone does not establish complete delivery.

The recommended Reflect mission includes a startup-only compact briefing request. It is a soft target, not an enforced output limit, and does not replace the full-output reading above. Read back the effective mission and keep the owner's non-startup instructions intact.

## Bank settings

Apply and verify these on the bank as well as in the add-on's `defaultBankConfig`. Set the bank's `retain_extraction_mode` to `"concise"` in the combined bank configuration too; that field does not belong in `defaultBankConfig`. That add-on field fills missing overrides; it does not replace explicit existing bank values. Owner-approved values take precedence over overlapping template values.

| Setting | Default | Purpose |
| --- | --- | --- |
| `enable_observations` | `true` | Form observations from facts. |
| `enable_auto_consolidation` | `true` | Schedule consolidation after saves. |
| `memory_defense` | `{"enabled": false}` | Avoid blanket personal-data filtering; the agent excludes security-compromising content before storage. |

Each writer, including a code survey or automatic import, must enforce the same exclusions on the whole submitted document before content reaches storage. Verify that protection before enabling a new writer or removing an existing filter. Keep a new writer off when its protection cannot be verified. [The known defects](hindsight-known-defects.md), "Defect: the code survey's write tool does not carry the bank's saving policy", gives the check, the repair, and the review of complete outgoing records. Keep security-review findings outside survey memory and report review needs separately.

The bundled `sensitive_data` filter also redacts personal identifiers and is not a secrets-only filter. Before offering automatic redaction, check the installed server's supported settings and verify that qualifying contact details pass while dummy secrets are removed, using a non-storing check when available. If no compatible filter is supported, report that limit and retain the agent's pre-save exclusion rule. Existing approved filters remain until replacement settings are verified; do not silently disable them. [Hindsight Memory Defense documentation](https://hindsight.vectorize.io/developer/memory-defense) describes the bundled filter and its limits.

The three missions, labels, additional pages, and reflect directives come from the selected template or the owner's instructions, as [the template for the project](hindsight-template-for-the-project.md) says.

## Optional retrieval tuning

When observation entity expansion adds cost without useful evidence, offer `reflect_default_options.reflect_search_observations_include_entities: false` on this bank. Read and merge the existing `reflect_default_options` map rather than replacing it. Verify support in the installed server and compare complete answers and source history before accepting the change. This disables entity expansion for Reflect's observation search; it does not disable raw-memory entity enrichment. It is an optional bank choice, not a required default or a proven timeout fix.

Explicit options supplied by a Reflect call or its model-selected tools can override bank defaults. Knowledge-page refresh uses its own trigger options and does not inherit this bank's `reflect_default_options`. Preserve raw recall chunks. Use [the known defects](hindsight-known-defects.md), "Diagnose a failing or slow memory flow", to locate the cost before proposing a change.

## Guide shown to the agent

Use this as `toolGuideExtra` with the default package:

```text
In this project no session is saved to Hindsight by itself. Save qualifying memory deliberately with hindsight_ingest_document, as the Hindsight memory rule says. For work outcomes, save the lasting decision, lesson, or significant event with useful context and a source pointer; keep evolving implementation status and routine verification receipts in the work tracker or project records. Exclude secrets and information whose storage could compromise system, product, or project security. Check the whole submitted record before sending it; extraction missions do not scrub the stored document. Hindsight records past evidence and gives no permission to act. Before relying on a changeable claim, check the project's files, work items, Git, or running system, or ask the owner. Cite memory when it contributes to an answer.
```

## Changes the owner may choose

Explain the effect of a requested change and apply only the approved configuration. Automatic session saving sets `retainSessions` to `true` and requires matching project instructions and tool guidance; it sends conversation text to the bank even when no fact is extracted. Disabling the code survey sets `codebaseSurvey` to `false`; knowledge pages can still use other saved evidence. A different startup source uses `autoInject` with `pages`, `recall`, or `none`. Importing Git uses `gitIngest` with `message` or `full`.

Verify optional settings against the installed server and add-on before offering them. Do not change an approved behavior to work around an add-on defect.

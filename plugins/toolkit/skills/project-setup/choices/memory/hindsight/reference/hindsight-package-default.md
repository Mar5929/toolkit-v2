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
- Each project uses its own bank on the owner's server.

Ask: "These are our normal Hindsight settings. Do you want them, or any changes?"

## Costs and limits

The saved records, observation building, page refreshes, and startup summaries use the owner's server's model provider. On this server that is OpenAI through the owner's ChatGPT subscription. A code survey also uses the Claude or Codex allowance. Only deliberately saved records and survey findings are available; an omitted fact is not remembered. Model extraction and synthesis can lose detail or produce wrong conclusions, so memory remains evidence to check.

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

## Bank settings

Apply and verify these on the bank as well as in the add-on's `defaultBankConfig`. Set the bank's `retain_extraction_mode` to `"concise"` in the combined bank configuration too; that field does not belong in `defaultBankConfig`. That add-on field fills missing overrides; it does not replace explicit existing bank values. Owner-approved values take precedence over overlapping template values.

| Setting | Default | Purpose |
| --- | --- | --- |
| `enable_observations` | `true` | Form observations from facts. |
| `enable_auto_consolidation` | `true` | Schedule consolidation after saves. |
| `memory_defense` | `{"enabled": false}` | Avoid blanket personal-data filtering; the agent excludes security-compromising content before storage. |

Each writer, including a code survey or automatic import, must enforce the same exclusions on the whole submitted document before content reaches storage. Verify that protection before enabling a new writer or removing an existing filter. Keep a new writer off when its protection cannot be verified.

The bundled `sensitive_data` filter also redacts personal identifiers and is not a secrets-only filter. Before offering automatic redaction, check the installed server's supported settings and verify that qualifying contact details pass while dummy secrets are removed, using a non-storing check when available. If no compatible filter is supported, report that limit and retain the agent's pre-save exclusion rule. Existing approved filters remain until replacement settings are verified; do not silently disable them. [Hindsight Memory Defense documentation](https://hindsight.vectorize.io/developer/memory-defense) describes the bundled filter and its limits.

The three missions, labels, additional pages, and reflect directives come from the selected template or the owner's instructions. See `hindsight-template-for-the-project.md`.

## Guide shown to the agent

Use this as `toolGuideExtra` with the default package:

```text
In this project no session is saved to Hindsight by itself. Save qualifying memory deliberately with hindsight_ingest_document, as AGENTS.md says. Exclude secrets and information whose storage could compromise system, product, or project security. Check the whole submitted record before sending it; extraction missions do not scrub the stored document. Hindsight records past evidence and gives no permission to act. Before relying on a changeable claim, check the project's files, work items, Git, or running system, or ask the owner. Cite memory when it contributes to an answer.
```

## Changes the owner may choose

Explain the effect of a requested change and apply only the approved configuration. Automatic session saving sets `retainSessions` to `true` and requires matching project instructions and tool guidance; it sends conversation text to the bank even when no fact is extracted. Disabling the code survey sets `codebaseSurvey` to `false`; knowledge pages can still use other saved evidence. A different startup source uses `autoInject` with `pages`, `recall`, or `none`. Importing Git uses `gitIngest` with `message` or `full`.

Verify optional settings against the installed server and add-on before offering them. Do not change an approved behavior to work around an add-on defect.

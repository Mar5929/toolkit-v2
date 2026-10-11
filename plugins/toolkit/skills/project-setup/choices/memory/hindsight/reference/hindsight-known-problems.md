# Diagnose Hindsight setup problems

Use this when the approved memory flow fails or becomes slow. Establish the failing stage and effective configuration before proposing a change. Preserve the owner's capture, bank, survey, summary, and page choices while investigating.

## Locate a slow or missing startup summary

Match host diagnostics, API processing, and provider traces to the same operation. Distinguish automatic startup Reflect from an agent-invoked Reflect tool, page refresh, or a separate startup instruction. Inspect the installed version, active runtime, inherited configuration, duplicate hook or MCP registrations, and the response received by the agent. File values alone do not establish a running client's configuration.

Separate network and proxy time, search and reranking time, model-capacity waiting, provider requests and retries, and final synthesis. Compare direct Recall with complete Reflect as diagnostics, without replacing the approved generated summary. Inspect foreground work alongside surveys, ingestion, consolidation, and page jobs when evaluating contention. The [service settings](hindsight-server-settings.md) record the measured provider variability and local reranking costs that motivated the provisional recommendation.

Provider errors such as authentication failures, refresh-token reuse, or quota responses require checking the provider connection and service-only credential storage. Healthy database access and Recall do not establish healthy model authentication. Inspect sensitive configuration privately and report error categories without exposing credentials or source text.

Check both the 90-second add-on reflection deadline and its 15-second shared fallback budget against the 120-second host hook. Installation can restore the add-on's shorter hook default; restore the approved host deadline after verifying the active entry. Longer allowances do not fix slow retrieval, waiting, or synthesis. Pages or Recall after timeout keep context available but do not establish a successful generated summary.

For a tuning proposal, state which measured stage it changes, its scope, the complete-answer checks, and rollback. Hold settings unrelated to the proposed change constant during an isolated comparison, and record unavoidable differences. Accept a change only after the [memory-flow verification](hindsight-verification.md) supports its quality and operating behavior. A faster provider call, normal hook exit, or resource snapshot alone does not establish a reliable startup.

## Distinguish incomplete answers from delivery clipping

Check the complete API answer, hook output, and agent-delivered context separately. Apply the [default package's native delivery settings](hindsight-package-default.md#complete-startup-delivery) and verify full-file recovery when a host supplies a preview. Earlier tool-free diagnostics could not exercise that recovery path. Later normal Codex and Claude sessions passed complete delivery with the native Codex allowance and Claude reading the saved output. This separates a delivery problem from an incomplete API answer; it does not establish sustained reliability.

[Claude Code's hook output reference](https://code.claude.com/docs/en/hooks#json-output) caps each `additionalContext` string at 10,000 characters; overflow becomes a file path and preview of up to 2,000 characters. The reference provides no setting to raise that cap and says the host does not ask the agent to read the file. Verify any needed full-output recovery separately. Codex's `additionalContextLimit` does not configure Claude Code.

The [Hindsight 0.10.2 Codex provider](https://github.com/vectorize-io/hindsight/blob/v0.10.2/hindsight-api-slim/hindsight_api/engine/providers/codex_llm.py#L1154) accepts completed function arguments without checking the response's terminal outcome. OpenAI defines separate [completed, incomplete, and failed response events](https://developers.openai.com/api/reference/resources/responses/streaming-events). An October 11 offline parser test returned the same unfinished non-empty answer for all three terminal outcomes and a stream with no terminal event. This proves a parser weakness; it does not identify the cause of an earlier live cutoff. A recorded successful call or `done` tool does not prove that the answer is complete.

When an API answer is incomplete, capture the provider request, final stream outcome, function arguments, and API text privately, then compare the boundaries. The live model-versus-provider cause remains unresolved, and no native setting has been proved to fix it. Verify provider support before proposing a completion limit; this version's Codex tool-call request does not forward Reflect's ordinary completion-token setting. Preserve credentials and private source text during diagnosis.

## Check extraction instructions and bank routing

When saving instructions have no effect, inspect the effective extraction strategy and default strategy. The add-on's strategy overrides can replace the bank's general retain mission. Follow [template application](hindsight-template-for-the-project.md) to reconcile approved wording without replacing unrelated strategies.

When the tools cannot reach a newly configured bank, check the resolved identity and active client settings, then start a new session when required. Use [bank strategy](hindsight-bank-strategy.md) to preserve continuity rather than creating a replacement bank from empty recall.

Check an indicator's prerequisites before using it as a memory-flow verdict. The installed add-on 0.8.0 and its [sync-status source](https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/coding-agents/src/core/status.ts) require a Git seed for its `synced` flag even with approved `gitIngest: "none"`. In the October 11 test, that flag was false while a deliberate correction processed into eight facts and seven observation links and remained retrievable through raw Recall. Verify actual save, processing, and retrieval rather than enabling Git ingestion to satisfy the indicator.

Compare extracted facts, observations, and reflected claims with source uncertainty and approval status. An October 11 preview excluded routine status and an unapproved proposal but overstated an unresolved causal claim; observation Recall also retrieved obsolete proposals. Successful processing and useful retrieval do not establish that every generated claim is accurate.

The add-on's tools cannot delete a wrong memory. Save a correction titled `Correction: <topic>` through the document-save tool. Deletion remains the owner's dashboard action unless a separately approved supported administrative operation is available.

## Check repeated surveys and add-on updates

The installed add-on 0.8.0 used imported Git documents to detect a new bank. With `gitIngest: "none"`, this could repeat the survey and defer the startup summary. Verify the installed behavior and follow [the local bank-detection patch](hindsight-local-bank-detection-patch.md) when the defect remains. Keep setup open until its checks pass; importing Git or disabling an approved survey is not a replacement for correct detection.

Record patch maintenance and rollback. Installation or automatic runtime updates can replace patched bundles. Recheck the supported fix and active hook deadlines after updates, and preserve unrelated projects when changing a computer-wide runtime policy.

## Recover failed or stale knowledge pages

Inspect page source, scope, schedule, last successful refresh, failure state, and background operation history. An omitted field in a list response does not establish that a trigger was removed. Read the detailed page or supported trigger configuration before changing it.

Check the installed server's retry and pause behavior and inspect capacity waits or provider failures. Use supported administration for an owner-approved recovery, then verify completed operation status and refreshed content while preserving source and trigger settings. Limit overlapping recovery work according to measured service capacity. A manual success proves manual recovery; verify a later scheduled run before claiming automatic recovery.

Page builds use their trigger's retrieval options, not the bank's ordinary `reflect_default_options`. Check trigger settings and the effective refresh model before tuning. Review generated claims against current records; a successful build can still repeat stale evidence. Use [memory-flow verification](hindsight-verification.md) for content and schedule checks.

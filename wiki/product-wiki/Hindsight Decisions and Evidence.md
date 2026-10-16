# Hindsight decisions and evidence

This page records the evidence and reasoning behind the Toolkit's Hindsight settings and add-on patches, as of 2026-10-11. It was moved here from the Hindsight setup references on 2026-10-15. Setup does not load this page: the settings themselves are in the Hindsight reference files under `plugins/toolkit/skills/project-setup/choices/memory/hindsight/reference/`, and this page explains why they are what they are.

Each section is named after the reference file that holds the settings it explains.

## Service settings (`hindsight-server-settings.md`)

### Changing the shared service

The agent explains the recommendation and its limits, then uses the owner's existing authorization or obtains approval before changing the service.

### Subscription authentication

Dedicated credential storage for the service prevents token-sharing conflicts. It does not increase the account's quota.

### Models for each operation

The model profile is the working Toolkit starting profile tested on October 11, 2026. It is not a universal Hindsight model recommendation. A project that connects to that shared service inherits its model profile, so the service is not restarted or reconfigured for each new bank.

A model is judged on retained facts, source history, uncertainty, and preserved owner decisions, as well as elapsed time. Successful requests and a final `done` call do not establish that an answer is complete. The returned text and its actual delivery to the host are reviewed.

### Provisional capacity and local retrieval recommendation

The capacity and retrieval values are a provisional starting point from the owner's October 11, 2026 investigation. They are not a proven reliability standard, and they are not per-project overrides.

Support for these settings was verified in the deployed Hindsight 0.10.2 source and effective configuration. Another installation is checked before they are applied. Role limits constrain model calls; they do not reserve capacity or guarantee foreground priority. More concurrency can increase provider pressure and local resource contention, so queue waits, retries, allowance use, and background work are inspected before concurrency is adjusted.

When bucket batching is tested, the existing local reranker model, batch size, candidate limits, and evidence budgets stay the same. The test checks score validity and returned evidence, not speed alone. Unsupported settings stay out of the configuration, and the version limitation is reported.

### Evidence limits

Tests on Hindsight 0.10.2 found variable provider latency, measurable local reranking cost, and mixed startup results after the concurrency and bucket-batching changes. Fixed-input batching preserved candidate order in the tested samples, while scores differed slightly. These samples did not prove sustained reliability, a causal startup improvement, or the current accuracy of generated claims.

A later Luna retry passed complete interactive startup delivery in both hosts, and passed the earlier failing setup query, after native delivery was repaired. The cause of the original cutoff remains unresolved. The Toolkit keeps the working profile, locates any new failure at its actual stage, and repeats the same checks on another service.

### Which recommendations come from upstream

Hindsight documents subscription authentication, role-specific models, page-model inheritance, concurrency controls, and local bucket batching in its [models](https://hindsight.vectorize.io/developer/models) and [configuration](https://hindsight.vectorize.io/developer/configuration) references. Those supported mechanisms are distinct from the Toolkit's selected Luna and Terra models, capacity values, and deadlines. The Toolkit's selections are tested starting choices, not upstream defaults or guarantees. The default global model-call cap in the current configuration reference is 32; this service's chosen cap of 4 is deliberate tuning.

The configuration reference's per-operation guidance explicitly allows lighter, faster models for Reflect while choosing structured-output quality for Retain. That supports choosing models by operation and checking their results. It does not prescribe Luna for every installation. The Toolkit's deliberate saves and memory criteria are the owner's policy, while Hindsight also supports automatic session capture.

Hindsight's [best practices](https://hindsight.vectorize.io/best-practices) guide bank instructions and memory use. Host delivery follows [Codex's hook documentation](https://learn.chatgpt.com/docs/hooks#large-hook-output) and [Claude Code's hook documentation](https://code.claude.com/docs/en/hooks#json-output). The default package, `hindsight-package-default.md`, applies those host controls without a custom runtime program. Support in the installed versions is verified before they are applied.

### Sources

These sources were reviewed on 2026-10-11. The evidence above supplies the local test limits needed to interpret the recommendation.

## Diagnosis and known defects (`hindsight-known-defects.md`)

### Locating a slow or missing startup summary

Automatic startup Reflect is a different operation from an agent-invoked Reflect tool, a page refresh, or a separate startup instruction, and diagnosis keeps them apart.

Direct Recall and complete Reflect are compared as diagnostics, without replacing the approved generated summary. Foreground work is inspected alongside surveys, ingestion, consolidation, and page jobs when contention is evaluated. The service settings, `hindsight-server-settings.md`, record the measured provider variability and local reranking costs that motivated the provisional recommendation.

An isolated comparison holds the settings unrelated to the proposed change constant, and records unavoidable differences. A faster provider call, a normal hook exit, or a resource snapshot alone does not establish a reliable startup.

### Telling incomplete answers from delivery clipping

Earlier tool-free diagnostics could not exercise the recovery path for clipped delivery. Later normal Codex and Claude Code sessions passed complete delivery, with the native Codex allowance and with Claude Code reading the saved output. This separates a delivery problem from an incomplete API answer. It does not establish sustained reliability.

[Claude Code's hook output reference](https://code.claude.com/docs/en/hooks#json-output) caps each `additionalContext` string at 10,000 characters. Overflow becomes a file path and a preview of up to 2,000 characters. The reference provides no setting to raise that cap, and says the host does not ask the agent to read the file, so any needed full-output recovery is verified separately. Codex's `additionalContextLimit` does not configure Claude Code.

An October 11 offline parser test returned the same unfinished non-empty answer for all three terminal outcomes and for a stream with no terminal event. This proves a parser weakness. It does not identify the cause of an earlier live cutoff.

The live cause, model or provider, remains unresolved, and no native setting has been proved to fix it.

### Extraction instructions and bank routing

An October 11 preview excluded routine status and an unapproved proposal, but overstated an unresolved causal claim. Observation Recall also retrieved obsolete proposals.

### Code-survey pre-save guidance

A keyword check can miss a paraphrased security finding even when secret values are absent.

### Repeated surveys and add-on updates

Setup stays open until its checks pass. Importing Git or disabling an approved survey does not replace correct detection of a populated bank.

### Recovering failed or stale knowledge pages

Recovery checks the installed server's retry and pause behavior and inspects capacity waits or provider failures. Overlapping recovery work is limited according to measured service capacity. A manual success proves manual recovery; a later scheduled run is verified before automatic recovery is claimed.

Trigger settings and the effective refresh model are checked before tuning. Generated claims are reviewed against current records, because a successful build can still repeat stale evidence.

## Default package (`hindsight-package-default.md`)

### Complete startup delivery

Codex's [large-output documentation](https://learn.chatgpt.com/docs/hooks#large-hook-output) describes the default threshold of about 2,500 tokens and the supported allowance control. The selected value of 5,000 tokens passed this project's complete-delivery check. It is not a guarantee of unlimited output.

### Optional retrieval tuning

Raw recall chunks are preserved, because disabling them was not validated as a quality-preserving remedy in the investigation.

## Recommended missions (`hindsight-missions-recommended.md`)

The recommended missions adapt Hindsight's [Coding Agent template](https://github.com/vectorize-io/hindsight/blob/main/hindsight-docs/src/data/templates/coding-agent.json), reviewed on 2026-10-09. Its technical focus informs retention and observations, and the Toolkit adds the owner's memory policy and reflection instructions. The result is a Toolkit recommendation, not an unchanged upstream template.

## Bank choice (`hindsight-connection-and-bank.md`)

The sources for bank choices were reviewed on 2026-10-11.

The memory-banks API row of those sources read: "Current documentation says writes create missing banks; reads of a missing bank return `404`. This qualifies the article's broader first-use description."

## Bank-detection patch (`hindsight-known-defects.md`)

The defect in which a populated bank is treated as new when Git import is off was verified in add-on 0.8.0 on 2026-10-10.

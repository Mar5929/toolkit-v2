# Toolkit V2 project setup

Toolkit V2 builds the operating package used by Mike Rihm's projects. This repository uses the shipped Hindsight memory choice while preserving its toolkit-authoring procedures and disabled starter skills. Setup remains open until the recorded checks pass.

## Toolkit settings

| Setting | Recorded choice |
| --- | --- |
| Toolkit baseline | `0.9.56`. This alignment covers Hindsight; it is not a full starter-project installation. |
| Owner | Mike Rihm. |
| Work tracker | Notion, [Toolkit V2 project](https://www.notion.so/3edb381da17681eeb7ddd0a6d662f9b2), Work Items data source `b22b381d-a176-8301-a22c-0766e27d8dc9`, ID prefix `TKV`. |
| Memory | `hindsight`. |
| Hindsight bank | `toolkit-v2`. |
| Hindsight bank scope | Toolkit V2 project memory, shared by its intended hosts and checkouts. Keep the same underlying bank across worktrees and computers. No new tag convention was introduced. |
| Hindsight server | `https://memory-api.mrihm-memory.com`. |
| Hindsight dashboard | [Toolkit V2 bank](https://memory.mrihm-memory.com/banks/toolkit-v2). |
| Hindsight package | `default`, with existing changes below preserved pending verification. |
| Hindsight template | Readback on October 11, 2026 matched the existing approved Toolkit-specific retain, observations, and reflect missions. The default document strategy uses concise extraction. |
| Hindsight changes | Deliberate saves; `retainSessions: false`, `autoInject: reflect`, `gitIngest: none`, `retainExtractionMode: concise`, observations enabled, `reflectTimeoutMs: 90000`, and `injectTimeoutMs: 15000`. The bank's `reflect_default_options.reflect_search_observations_include_entities: false` is applied. Memory defense is enabled with `sensitive_data: redact`; preserve that filter until protection of every writer is verified. The existing `codebaseSurvey: true`, custom pages, and hourly page schedule are preserved. |
| Hindsight service | Mike's shared VPS service. [TKV-60 findings](reference/tkv-60-hindsight-timeout-findings.md) record the current `gpt-6-luna` Reflect override, `gpt-5.6-terra` global and page-refresh models, provisional concurrency and batching changes, and authentication evidence. The [shipped service guidance](plugins/toolkit/skills/project-setup/choices/memory/hindsight/reference/hindsight-server-settings.md) describes the recommended settings and backup checks. A backup is not a verified recovery; service ownership, exclusive provider authentication, and recovery checks remain open. |
| Hindsight setup | Open. Project files and reminder wiring are aligned; the checks below still determine whether setup is complete. |

The approved startup delivery changes preserve generated Reflect. The owner's Codex Hindsight prompt hook now has `additionalContextLimit: 5000`. The Reflect mission requests a compact answer, but that request does not guarantee output length. When a host delivers a preview and saved-output file, the agent reads the complete file before answering or relying on the memory and treats it as historical evidence. Normal fresh-session checks on October 11 verified complete Codex delivery and Claude reading the full saved output. The earlier tool-free Claude diagnostic did not exercise file recovery. No custom runtime patch was added for this behavior.

## Remaining setup checks

- Verify every enabled writer's protection of the whole submitted document, including the existing code survey. Preserve working capture settings until a verified replacement is ready.
- Verify generated claim accuracy and sustained startup reliability under expected background work. The successful normal host samples below do not establish reliability or explain the earlier API cutoff.
- Verify scheduled page builds actually succeed and recover from failure, and verify the remaining pages' accuracy and schedule provenance.
- Verify routing from the intended computers and worktrees, persistent service-only provider authentication, and backup recovery. Record unavailable checks without marking setup done.

## Verification on October 11, 2026

- The approved correction sample was stored, processed into eight facts and seven observation links, and retrieved through raw Recall. General observation Recall worked but also returned obsolete proposals. Extraction preview excluded routine status and an unapproved proposal but overstated uncertainty in a causal claim.
- A normal fresh Codex session generated complete Luna startup reflection in 46.776 seconds with 4,691 answer characters. The native 5,000-token allowance delivered the complete 10,433-character context without clipping. Trace: `30882522-5839-4b7f-bcfb-2036100c892c`.
- A normal fresh Claude session generated complete Luna startup reflection in 42.266 seconds with 9,279 answer characters. Claude used its native Read tool to recover the entire saved hook output, read `PROJECT.md`, and used no other memory retrieval, saves, or delegation. Trace: `fe93b949-e4ba-47a0-81a7-06178fbd1c9f`. The compact 3,000-character mission target was not enforced; the saved-output procedure supplied the complete memory.
- The original failing setup query passed in fresh Claude session `bb301fc5-d115-4be1-b5c2-20154385a33b` with hooks active in print mode. Reflect generated 8,845 answer characters in 54.287 seconds; native Read recovered the complete 14,587-character saved context. The agent read `PROJECT.md` and the shipped package/setup references, distinguished shipped redaction off from the preserved live filter, and separated historical claims from current facts. It used no other memory retrieval, writes, or delegation; Stop recorded `retain_disabled`.
- Manual onboarding-page recovery completed in about 174 seconds with 8,538 content characters, cleared the failure flag, and read back `is_stale: false`. Source and trigger configuration were unchanged. This verifies manual recovery, not a later scheduled run.

Follow the [shipped memory-flow verification](plugins/toolkit/skills/project-setup/choices/memory/hindsight/reference/hindsight-verification.md) for these checks. Current progress and decisions belong in the corresponding Notion work item, not this setup record.

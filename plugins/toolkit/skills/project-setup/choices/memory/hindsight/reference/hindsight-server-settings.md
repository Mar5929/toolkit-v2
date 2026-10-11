# Recommended Hindsight service settings

Use this when onboarding checks the shared service, or when its operator reviews a service change. The project package controls its bank and add-on behavior; these settings affect every bank using the service. Explain the recommendation and its limits, then use the owner's existing authorization or obtain approval before changing the service. Connecting a project does not require reapplying shared settings.

## Subscription authentication

Distinguish the add-on's API connection to Hindsight from Hindsight's connection to its model provider. An API health check or successful Recall does not prove that extraction and reflection can authenticate to the provider.

For `openai-codex`, give Hindsight a persistent credential directory used only by the service. Configure the supported `CODEX_HOME` or `HINDSIGHT_API_LLM_CODEX_HOME` setting, verify the actual mount and process permissions privately, and have the owner complete any required login. Check that interactive Codex processes do not share or rotate that credential file. Keep credentials outside project files and shared diagnostic output. Dedicated storage prevents token-sharing conflicts; it does not increase the account's quota.

## Models for each operation

For the owner's subscription-backed service, offer `gpt-6-luna` for Reflect and `gpt-5.6-terra` for other model operations, including an explicit page-refresh override. This is the working Toolkit starting profile tested on October 11, 2026, not a universal Hindsight model recommendation. A project connecting to that shared service inherits its model profile; do not restart or reconfigure it for each new bank. On another service, verify provider support and complete representative answers before accepting the profile. Preserve approved reasoning settings and inspect effective role overrides.

| Setting | Recommended starting choice | Status |
| --- | --- | --- |
| `HINDSIGHT_API_LLM_PROVIDER` | `openai-codex` | The owner's subscription connection. |
| `HINDSIGHT_API_LLM_MODEL` | `gpt-5.6-terra` | Verified working baseline; startup latency varies. |
| `HINDSIGHT_API_RETAIN_LLM_MODEL` | Keep the approved working model. | Video uses `gpt-5.6-luna`; extraction quality has not been validated here with that alternative. |
| `HINDSIGHT_API_CONSOLIDATION_LLM_MODEL` | Keep the approved Terra model. | Video also uses Terra; no controlled quality comparison was performed. |
| `HINDSIGHT_API_REFLECT_LLM_MODEL` | `gpt-6-luna` | Current working Toolkit profile; complete normal startup checks passed. |
| `HINDSIGHT_API_MENTAL_MODEL_REFRESH_LLM_MODEL` | `gpt-5.6-terra` | Preserve Terra explicitly; page refresh otherwise inherits the Reflect model. |

The [video frame at 5:04](https://www.youtube.com/watch?v=UVEjThz8DSo&t=304s) shows `gpt-5.6-terra` globally, for consolidation, and for Reflect; `gpt-5.6-luna` for Retain; low global/Retain reasoning; and medium consolidation/Reflect reasoning. Its server timeouts of 300 and 600 seconds do not control the add-on's startup deadline. The frame does not show a separate page-refresh model. These are the creator's choices, not measured fixes for this service.

Before selecting a different model, verify support through the actual subscription connection and compare complete operation results. Judge retained facts, provenance, uncertainty, and preserved owner decisions as well as elapsed time. Successful requests and a final `done` call do not establish answer completeness. Review the returned text and its actual delivery to the host. Changing a global or role model affects other banks; plan its verification and rollback accordingly.

## Provisional capacity and local retrieval recommendation

Offer the following service profile when the installed release supports it. These values are a provisional starting point from the owner's October 11, 2026 investigation, not a proven reliability standard or per-project overrides.

| Setting | Recommended value | Purpose |
| --- | --- | --- |
| `HINDSIGHT_API_LLM_MAX_CONCURRENT` | `4` | Allow concurrent model calls across the service. |
| `HINDSIGHT_API_REFLECT_LLM_MAX_CONCURRENT` | `2` | Limit concurrent Reflect model calls within the global cap. |
| `HINDSIGHT_API_RETAIN_LLM_MAX_CONCURRENT` | `1` | Limit extraction model calls within the global cap. |
| `HINDSIGHT_API_CONSOLIDATION_LLM_MAX_CONCURRENT` | `1` | Limit consolidation model calls within the global cap. |
| `HINDSIGHT_API_MENTAL_MODEL_REFRESH_LLM_MAX_CONCURRENT` | `1` | Limit page-refresh model calls within the global cap. |
| `HINDSIGHT_API_RERANKER_LOCAL_BUCKET_BATCHING` | `true` | Group similar-length local reranker inputs to reduce padding work. |

Support was verified in the deployed Hindsight 0.10.2 source and effective configuration. Check another installation before applying. Role limits constrain model calls rather than reserving capacity or guaranteeing foreground priority. More concurrency can increase provider pressure and local resource contention; inspect queue waits, retries, allowance use, and background work before adjusting it.

Keep the existing local reranker model, batch size, candidate limits, and evidence budgets when testing bucket batching. Check score validity and returned evidence, not speed alone. Keep unsupported settings out of configuration and report the version limitation.

### What the tests established

The 0.10.2 baseline used Terra and a global model-call cap of 1. Provider replays of the same final request varied from 20.520 to 56.059 seconds. An isolated complete Terra reflection took 77.797 seconds: model calls used 51.360 seconds and local reranking used 26.000 seconds. Its separate engine did not measure the live service queue.

The concurrency-only pilot used the profile above, without batching. Installed hook-bundle tests returned a generated Codex reflection in 48.500 seconds; Claude timed out at 90.012 seconds and used pages fallback. Capacity alone therefore did not establish reliable generated summaries.

Fixed-input comparisons with `cross-encoder/ms-marco-MiniLM-L-6-v2` and batch size 32 reduced reranker wall time by about 43–45% with bucket batching. Full candidate order was unchanged for 160 observation pairs and 300 raw-memory pairs; small score differences remained. This is evidence for those samples, not every bank or passage distribution.

After the approved batching change, installed hook-bundle tests returned complete generated reflections in 48.101 seconds for Codex and 55.256 seconds for Claude, without fallback. That was a sample per host, not proof of sustained reliability or a causal startup improvement. Interactive host scheduling, trust, and mixed foreground/background load remained unverified. Summaries also repeated an older redaction baseline, demonstrating that speed and complete text do not establish current accuracy.

Later interactive Terra startup checks returned Codex reflection in 71.104 seconds and timed out in Claude at 90.007 seconds. Representative bundle checks also returned mixed results. Concurrency and batching did not resolve sustained startup reliability. Codex clipped part of a complete hook output before delivery, which is separate from a server timeout.

An earlier Luna trial returned an incomplete setup answer despite a successful `done` call and was rolled back. That failure did not establish that Luna caused the cutoff. After fixing native host delivery, the approved Luna retry passed normal startup checks in Codex at 46.776 seconds and Claude at 42.266 seconds. The original failing setup query also passed in a fresh Claude session at 54.287 seconds. Codex received complete context; Claude read its complete saved hook output and verified current settings against project files. These are finite successful samples, not a sustained reliability guarantee or proof of the earlier cutoff's cause. Keep the working profile while diagnosing any newly observed failure at the failing stage.

## Which recommendations come from upstream

Hindsight documents subscription authentication, role-specific models, page-model inheritance, concurrency controls, and local bucket batching in its [models](https://hindsight.vectorize.io/developer/models) and [configuration](https://hindsight.vectorize.io/developer/configuration) references. Those supported mechanisms are distinct from Toolkit's selected Luna/Terra models, capacity values, and deadlines. The latter are tested starting choices, not upstream defaults or guarantees. The default global model-call cap in the current configuration reference is 32; this service's chosen cap of 4 is deliberate tuning.

The configuration reference's per-operation guidance explicitly allows lighter, faster models for Reflect while choosing structured-output quality for Retain. That supports choosing models by operation and checking their results; it does not prescribe Luna for every installation. Toolkit's deliberate saves and memory criteria are the owner's policy, while Hindsight also supports automatic session capture.

Hindsight's [best practices](https://hindsight.vectorize.io/best-practices) guide bank instructions and memory use. Host delivery follows [Codex's hook documentation](https://learn.chatgpt.com/docs/hooks#large-hook-output) and [Claude Code's hook documentation](https://code.claude.com/docs/en/hooks#json-output). The [default package](hindsight-package-default.md) applies those host controls without a custom runtime program. Verify support in the installed versions before applying them.

## Backups, updates, and recovery

Record the service operator and the location of its backup and update procedure. Confirm that backups reach their intended destination and that recovery was tested away from the live database. Use [Hindsight's Admin CLI](https://hindsight.vectorize.io/developer/admin-cli); it connects directly to PostgreSQL, not through the API URL. Protect configuration and authentication backups, and use the owner's existing scheduling mechanism rather than adding a Toolkit script.

Before an approved service change, privately snapshot the effective configuration, version, persistent mounts, and recovery procedure. Compare resolved configuration so only intended changes remain. Apply the change through supported service administration, then verify health, effective values, provider authentication, and representative memory behavior. Restore the prior configuration when quality or operating behavior regresses, and verify the restored service.

An upgrade can change schemas and local patches. Check migration and recovery requirements before replacing an image. Recheck the [bank-detection patch](hindsight-local-bank-detection-patch.md), hook deadlines, and runtime update policy after add-on installation or upgrade; remove a temporary patch only after the supported replacement behavior is verified.

## Sources

The [models guide](https://hindsight.vectorize.io/developer/models) explains dedicated Codex authentication. The [configuration reference](https://hindsight.vectorize.io/developer/configuration) defines operation overrides, concurrency caps, page-model inheritance, and local reranker settings. The [Coding Agents README](https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/coding-agents/README.md) describes client configuration and deadlines. These sources were reviewed on 2026-10-11; the evidence above supplies the local test limits needed to interpret the recommendation.

# Hindsight service settings

Use this only when the shared Hindsight service is new or has changed, or when its operator reviews a service change. Connecting a project to an existing, checked service does not repeat these checks or reapply these settings. These settings affect every bank on the service, so use the owner's existing authorization or get approval before changing them, and show the scope first.

## Provider authentication

The add-on's API connection to Hindsight and Hindsight's connection to its model provider are separate. An API health check or successful Recall does not prove that extraction and reflection can authenticate to the provider.

For `openai-codex`, give Hindsight a persistent credential directory used only by the service. Configure the supported `CODEX_HOME` or `HINDSIGHT_API_LLM_CODEX_HOME` setting, check the actual mount and process permissions privately, and have the owner complete any required login. Check that interactive Codex processes do not share or rotate that credential file. Keep credentials outside project files and shared diagnostic output.

## Models for each operation

For the owner's subscription-backed service, use `gpt-6-luna` for Reflect and `gpt-5.6-terra` for other model operations, including an explicit page-refresh override. On another service, check provider support and complete representative answers before accepting this profile. Preserve approved reasoning settings and inspect effective role overrides.

| Setting | Recommended starting choice | Status |
| --- | --- | --- |
| `HINDSIGHT_API_LLM_PROVIDER` | `openai-codex` | The owner's subscription connection. |
| `HINDSIGHT_API_LLM_MODEL` | `gpt-5.6-terra` | Verified working baseline; startup latency varies. |
| `HINDSIGHT_API_RETAIN_LLM_MODEL` | Keep the approved working model. | Alternative Retain models require an extraction-quality comparison. |
| `HINDSIGHT_API_CONSOLIDATION_LLM_MODEL` | Keep the approved Terra model. | No controlled quality comparison was performed. |
| `HINDSIGHT_API_REFLECT_LLM_MODEL` | `gpt-6-luna` | Current working Toolkit profile; complete normal startup checks passed. |
| `HINDSIGHT_API_MENTAL_MODEL_REFRESH_LLM_MODEL` | `gpt-5.6-terra` | Preserve Terra explicitly; page refresh otherwise inherits the Reflect model. |

Before selecting a different model, check support through the actual subscription connection and compare complete operation results, including retained facts, source history, uncertainty, and preserved owner decisions as well as time. Changing a global or role model affects other banks, so plan its verification and rollback.

## Capacity and local retrieval

Use this service profile when the installed release supports it. Support was verified in Hindsight 0.10.2; check another installation before applying it, and keep unsupported settings out of the configuration.

| Setting | Recommended value | Purpose |
| --- | --- | --- |
| `HINDSIGHT_API_LLM_MAX_CONCURRENT` | `4` | Allow concurrent model calls across the service. |
| `HINDSIGHT_API_REFLECT_LLM_MAX_CONCURRENT` | `2` | Limit concurrent Reflect model calls within the global cap. |
| `HINDSIGHT_API_RETAIN_LLM_MAX_CONCURRENT` | `1` | Limit extraction model calls within the global cap. |
| `HINDSIGHT_API_CONSOLIDATION_LLM_MAX_CONCURRENT` | `1` | Limit consolidation model calls within the global cap. |
| `HINDSIGHT_API_MENTAL_MODEL_REFRESH_LLM_MAX_CONCURRENT` | `1` | Limit page-refresh model calls within the global cap. |
| `HINDSIGHT_API_RERANKER_LOCAL_BUCKET_BATCHING` | `true` | Group similar-length local reranker inputs to reduce padding work. |

Keep the existing local reranker model, batch size, candidate limits, and evidence budgets. Before adjusting concurrency, inspect queue waits, retries, allowance use, and background work.

## Backups, updates, and recovery

Record the service operator and the location of its backup and update procedure in `PROJECT.md`, under "Hindsight service". Confirm that backups reach their intended destination and that recovery was tested away from the live database. Use [Hindsight's Admin CLI](https://hindsight.vectorize.io/developer/admin-cli); it connects directly to PostgreSQL, not through the API URL. Protect configuration and authentication backups, and use the owner's existing scheduling mechanism rather than adding a toolkit script.

Before an approved service change, privately snapshot the effective configuration, version, persistent mounts, and recovery procedure. Apply the change through supported service administration, and compare the resolved configuration so only intended changes remain. Then check health, effective values, provider authentication, and representative memory behavior. When quality or operating behavior gets worse, restore the prior configuration and check the restored service.

An upgrade can change schemas and replace local patches. Check migration and recovery requirements before replacing an image. After an add-on installation or upgrade, recheck [the known defects](hindsight-known-defects.md), the hook deadlines, and the runtime update setting.

## Sources

The [models guide](https://hindsight.vectorize.io/developer/models) explains dedicated Codex authentication. The [configuration reference](https://hindsight.vectorize.io/developer/configuration) defines operation overrides, concurrency caps, page-model inheritance, and local reranker settings. The [Coding Agents README](https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/coding-agents/README.md) describes client configuration and deadlines.

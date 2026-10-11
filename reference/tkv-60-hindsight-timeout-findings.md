# TKV-60: Hindsight startup timeout findings

Normal startup memory delivery now works in fresh Codex and Claude samples. The current service uses GPT-6 Luna for Reflect and GPT-5.6 Terra for the global and page-refresh models. Codex's native Hindsight context allowance is 5,000 tokens; Claude reads the complete saved output when the host supplies a preview. Fresh normal sessions received complete memory after 46.776 seconds in Codex and 42.266 seconds in Claude; the original failing setup query also passed in a fresh Claude session in 54.287 seconds. These samples do not establish sustained reliability, and the cause of the earlier incomplete API answer remains unknown. Batching and concurrency improvements remain applied. Findings were checked on October 11, 2026.

The earlier sections preserve historical tests, configuration changes, and rollback evidence. Their historical Terra-restored or Luna-deferred statements do not describe the current configuration. The current fix and its verification appear in the final dated section.

The [onboarding review](tkv-60-hindsight-onboarding-review.md) gives the video comparison and proposed plain-English additions. The [visual report](tkv-60-hindsight-visual-report.html) shows the measured delays and next decision. [TKV-60](https://app.notion.com/p/3f4b381da17681abbbb4c783b0075a54) holds current progress and approval history.

## What is causing the wait

Model-call latency is a verified contributor. Earlier identical final-request replays outside retrieval and server concurrency waiting took 20.520 and 56.059 seconds. The same payload can therefore vary substantially at the provider boundary. These timings do not separate provider waiting, input processing, reasoning, or output generation.

Local reranking is a measured contributor. A subsequent unchanged Terra profile attributed26.000 seconds to observation/raw-memory reranking within a77.797-second reflection, with51.360 seconds of model calls. Warm direct recalls confirmed the reranking cost persists. Earlier Luna loops left about31 seconds outside model calls; those earlier samples were not individually partitioned, so the Terra profile does not establish their exact breakdown.

Shared capacity is a separate verified operational risk. Before the approved pilot, the global model-call limit was1; it is now4, with role limits recorded below. Historical page jobs failed after queue-stage waits, and12 pages had refresh-failure records. Component map subsequently recovered through a manual refresh; other paused pages remain unverified. Schedules remain configured, and a missing trigger field in a list response does not mean a schedule was removed. These observations do not establish measured live permit waits under the new limits.

Local network overhead is not the leading explanation. The earlier Mac public API request completed in 50.327 seconds with TLS ready in 0.042 seconds. A separate VPS localhost request took 108.529 seconds. Those sequential runs do not isolate a network delta, but demonstrate slow reflection even without the external network path. Isolated final-request replays further establish provider variability.

## Historical isolated complete-reflection tests

Two sequential tests used the exact prior startup query wrapper, the populated `toolkit-v2` bank, low reflection budget, and the subscription provider. An isolated engine process selected `gpt-6-luna`, with no migrations or live configuration edits. Local search models initialized before timing. The process used its own concurrency semaphore, so it did not test waiting behind the live service's model queue. The extra process and background work could affect shared resources.

| Test | Whole reflection | Model calls | Unpartitioned remainder | Completion |
| --- | ---: | ---: | ---: | --- |
| Luna run 1 | 48.026s | 17.451s | 30.575s | Four successful calls, ending in `done`; 5,460 answer characters. |
| Luna run 2 | 47.409s | 15.952s | 31.457s | Four successful calls, ending in `done`; 5,493 answer characters. |
| Earlier isolated Terra | 51.656s | See prior ticket receipts. | Not compared here. | Historical reference; not a paired controlled trial. |

The Luna sequence was page search, observation search, raw recall, then `done`. Every measured permit acquisition took less than 0.00004 seconds. Authenticated API trace records independently confirm all eight calls used `gpt-6-luna` and succeeded. Trace IDs are `c7cef16b-31c4-45d9-9c52-008ac2a3354e` and `31f89626-9a24-4eab-b56c-c35b66b9ff35`.

The initial payload SHA-256 was `aa05db5fcecccc0bb053f48ecc24cc39c73f7a874b8c284479bf5d39f34bbb0a`, matching the earlier path comparison. The bank changes over time and retrieval is model-directed; matching the initial query does not establish identical final evidence.

The coordinator read both full answers in the VPS console. Both retained the main memory decisions: deliberate saves, one project bank, qualifying persistent knowledge, work status in the tracker, concise extraction, survey separate from owner memories, Git off, generated startup reflection, shared observations, hourly pages, redaction, and offered missions. Neither was truncated. Run 2 contains a setup-order ambiguity: its opening could imply applying before offering missions, while later text gives the intended offer-before-apply sequence. Trace previews alone cannot verify this quality review because stored outputs are null.

These two runs are promising, not a reliability sample or actual installed-hook validation. Their whole-loop improvement over the earlier isolated Terra run is only about four seconds, with different retrieved evidence. Earlier fast single Luna calls were not completed reflection benchmarks. Older GPT-5.6 Luna results are a different model and should not be pooled with these GPT-6 Luna results.

## Historical configuration before the concurrency pilot

Before the approved concurrency pilot, the deployed configuration reported `openai-codex`, global `gpt-5.6-terra`, and global model concurrency `1`. Reflection, retention, consolidation, and page-refresh model overrides are unset. The engine therefore inherits the global model for those roles.

Installed engine source confirms page-refresh model selection uses its own override, then the reflection model. Installed configuration source recognizes `HINDSIGHT_API_REFLECT_LLM_MODEL` and `HINDSIGHT_API_MENTAL_MODEL_REFRESH_LLM_MODEL`. It also recognizes separate role concurrency settings. These checks establish support in the deployed source, rather than assuming current website documentation matches the installation.

The service uses `/codex-auth`, and Docker reports a persistent bind mount at that destination. This supports credential persistence. It does not independently prove the host directory is exclusively used by this service or establish a backup/recovery procedure. The video highlights that remaining readiness check.

The local add-on is 0.8.0 with its approved bank-detection patch and runtime auto-update paused. Startup remains Reflect with a 90-second client deadline, 15-second fallback budget, and 120-second host hook. Fresh Terra hook receipts included successes at 67.354 and 78.441 seconds followed by a timeout at 90.011 seconds. The observation-entity expansion override remains disabled only for this bank; raw recall chunks remain enabled.

## Historical deferred reflection-model alternative

The reflection-specific model alternative is deferred while concurrency is investigated. It remains a proposal requiring its own approval and actual startup verification. The changes are:

```text
HINDSIGHT_API_REFLECT_LLM_MODEL=gpt-6-luna
HINDSIGHT_API_MENTAL_MODEL_REFRESH_LLM_MODEL=gpt-5.6-terra
```

The second setting preserves the current page-refresh model because that role would otherwise inherit Luna. This was proposed before the capacity pilot. Any future model comparison must hold the then-current capacity constant rather than combine model and capacity changes. This changes interactive reflections for every bank connected to the shared VPS. It requires recreating the Hindsight service container, with a brief interruption. It does not require replacing the database or changing credentials.

Before applying, privately back up `/opt/hindsight/compose.yaml` and its referenced environment configuration, and record the currently absent overrides. Validate the native Compose configuration without printing secrets. Recreate only the Hindsight service. Check health, effective values, authentication persistence, and startup behavior through the installed Codex and Claude Code hooks. Use representative queries and judge complete answers, provenance, uncertainty, and retained owner decisions as well as elapsed time. A direct engine answer alone cannot pass this pilot.

If errors, answer regressions, or continued unreliable deadline overruns occur, restore the exact previous configuration and recreate the same service. Verify health and effective settings after rollback. Keep the pilot outcome open until actual hook checks and representative behavior support a decision.

Page-job recovery and contention require a separate experiment. Recover failed pages through supported administration after checking their source/scope, then measure foreground startup during background work. Choose capacity changes from measured permit waiting and provider limits. Do not combine that trial with the first live model change or delete duplicate-looking pages without checking their purpose.

## What the video and assessment add

The original [Wanderloots video](https://www.youtube.com/watch?v=UVEjThz8DSo) reinforces dedicated service authentication, separating model roles, testing the full memory flow, and backup ownership. Direct inspection at [5:04](https://www.youtube.com/watch?v=UVEjThz8DSo&t=304s) verifies GPT-5.6 Luna for Retain and GPT-5.6 Terra for consolidation and Reflect, with low Retain reasoning and medium consolidation/Reflect reasoning. The visible global model-call cap is 4, with Retain 1, consolidation 1, and Reflect 2. Before the concurrency pilot, our global cap was 1 and role model overrides were unset. These differences make operation-specific capacity a stronger configuration lead, but do not establish a fix. The proposed GPT-6 Luna reflection pilot differs from his model assignment. The video supplies no measured fix for this Hostinger startup delay. Its personal global-bank and automatic-session choices do not supersede Toolkit's approved per-project and deliberate-save package.

The supplied timeout assessment helps distinguish automatic startup from explicitly invoked reflection. Its general timeout values do not describe our current 90-second setting. The current [Coding Agents README](https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/coding-agents/README.md) documents the integration; the [model guide](https://hindsight.vectorize.io/developer/models) documents supported subscription access and independent authentication storage. The [configuration reference](https://hindsight.vectorize.io/developer/configuration) explains role settings and retrieval defaults. [Upstream issue 4566](https://github.com/vectorize-io/hindsight/issues/4566) records relevant context-growth fixes; the running service already reports 0.10.2, so merely recommending that release does not solve this case.

## Correction: delivered memory rule inventory

The delivered `files-to-add/.claude/rules/hindsight-memory.md` exists and is tracked. It was added in commit `34ec8b67`; `c9083853` subsequently changed security exclusions. The earlier absence claim was wrong: ordinary `rg --files` omitted hidden `.claude` paths. This resolves the reported missing-payload defect, but does not establish complete installed-project wiring or interactive onboarding.

## Approved concurrency pilot and outcome

Mike approved a concurrency-only trial on October 11 after the exact video settings were verified. The native resolved Compose configuration was compared before and after: only global model concurrency4, Reflect2, Retain1, consolidation1, and mental-model-refresh1 changed. All models, reasoning, deadlines, and unrelated configuration matched. The private rollback backup is `/opt/hindsight/backups/tkv60-concurrency-20261011T142012Z/`. Only the Hindsight container was recreated, without pulling a new image. Effective configuration readback confirmed the limits; the public health endpoint returned200/database connected. The trial settings remain applied pending the operating decision; no model change was made.

The installed SessionStart and UserPromptSubmit bundles were invoked with new session IDs and the same established-memory-decisions prompt, sequentially for both hosts. Codex SessionStart took0.487s, and its prompt invocation took48.679s; diagnostics recorded `reflect_ok` at48.500s and7,062 answer characters, with no fallback. Claude SessionStart took0.733s, and its prompt invocation took90.303s; reflection timed out at90.012s and pages fallback took0.130s. Both scripts exited normally. A normal exit with fallback is not successful generated reflection.

Codex trace `5397062b-59b7-4a2e-8fe5-52cd6929d4d0` had four successful Terra calls totaling24.249s. Claude trace `1d4c44e1-f95f-40a2-92e6-8bc1e9ccc348` had four successful Terra calls totaling64.964s; its final call alone took59.397s. That server trace spanned104.554s from first model start to final model end, beyond the client deadline. This is not the complete server request duration because retrieval before the first model is excluded.

A separate overlapping trace, `b013772e-82ac-4c10-b8a5-f385c70ecd04`, was a reflection on an app-generated suggested-next-message request. It was not a page refresh. Its first provider span overlapped Claude’s first provider span by about0.410s, demonstrating simultaneous recorded model calls under the new settings. The sample does not establish that historical queue waits were eliminated or that concurrency caused Codex’s faster response. Permit waits were not measured in this live trial.

Independent quality review found Codex’s reflection useful and complete on the main setup decisions, but it misdated the90s/120s approval as October9 instead of October10 and confused the implemented baseline package with newly proposed additions. Those source/approval ambiguities are quality issues separate from speed. A targeted memory correction should distinguish the approved baseline from new proposals.

These were actual installed-hook bundle invocations through the live service, not interactive Codex/Claude sessions. Host scheduling, hook trust, and enforcement of the host’s120-second limit were not exercised. The mixed result shows concurrency alone did not resolve reliability; no causal regression is established by this small sample. Page recovery, observed permit waits under background work, interactive host validation, and the remaining retrieval/provider latency remain on TKV-60’s active roadmap.

The post-trial resource snapshot showed Hindsight CPU3.10% and RAM867.5MiB on a7.755GiB limit, with OOMKilled=false and RestartCount=0. A log text match for “out of memory” referred to copying tensors out of memory-mapped storage, not memory exhaustion. The sampled logs contained no rate-limit or unauthorized text matches. These are snapshots, not other-bank end-to-end validation.


## Retrieval profiling and scoped page recovery

An isolated engine using unchanged Terra and mid-budget reflection completed the established-memory-decisions query in 77.797 seconds and returned 7,777 characters. Four model calls took 51.360 seconds, including a 45.030-second final call. Observation recall took 7.297 seconds; raw world/experience recall took 18.920 seconds. Their reranking phases took 7.205 and 18.795 seconds. Reranking therefore explains 26.000 seconds of the 26.437 seconds outside model calls in this run. Query embedding took 0.031 and 0.043 seconds; store retrieval took 0.027 and 0.036 seconds. Isolated semaphore waits were microseconds.

The process used 48.910 CPU seconds over 77.797 wall seconds. Threaded CPU work can exceed an individual phase's wall time; this does not prove host saturation. This extra engine has its own model/recall permits and initialization, so these timings do not measure the live service queue. The profiler preserved returned evidence and captured existing recall metrics rather than enabling trace serialization. It wrote temporary diagnostic files only, without altering service code or configuration. The result identifies local reranking as a substantial contributor alongside variable provider synthesis; it does not establish a complete startup fix. The private VPS receipt is `/tmp/tkv60-retrieval-profile.log`.

The Component map page (`mm-774cc2af499d46b6a5a206a449d3d62a`) recovered through the supported manual refresh API. Operation `e519775c-897b-4eaa-8e28-145b69b266fe` completed in about173 seconds, wrote10,068 characters, and applied19 delta operations. Readback verified an advanced last-refreshed timestamp, a cleared failure timestamp, `is_stale=false`, and unchanged source query and trigger. The hourly `14 * * * *` schedule remains configured. This proves manual recovery and eligibility for scheduling; a later scheduled operation must prove automatic execution. Other paused pages remain untested.

Content review found legacy `assets/every-project` paths and an alleged missing-rule defect. The latter assessment was incorrect; the inventory correction above supersedes that part of the earlier memory correction. Successful refresh processing does not guarantee that all statements are current. Private before/after detail and history receipts live in `/tmp/tkv60-page-recovery/`; these are evidence snapshots, not a verified API content-restoration mechanism.

Page refresh uses retrieval settings from its own trigger. Bank `reflect_default_options` do not propagate to page refresh, as confirmed by the deployed schema and source. No trigger, model, evidence budget, or deadline was changed for the recovery test.


The deployed cross-encoder source supports local bucket batching: it sorts query/document pairs by approximate length for inference, then assigns each score back to the original index. No reranker environment override was present in the container. This makes `HINDSIGHT_API_RERANKER_LOCAL_BUCKET_BATCHING` a narrow candidate for an isolated comparison that preserves the existing model, candidates, and budgets. Source support and restored indexes do not by themselves prove numerical equivalence or a speedup on this VPS. No batching change was applied to the shared service.


A separate direct-recall check repeated the same established-memory-decisions query twice per fact group without LLM requests. Observation reranking took8.147 and9.081 seconds; world/experience reranking took14.263 and14.528 seconds. The four recalls completed in46.392 seconds, using85.583 process CPU seconds across threads. Raw recall included entities and chunks; observation recall excluded them. These direct queries were representative, not exact replays of the model-expanded tool queries in the full profile. Repetition in the same initialized engine shows the cost persists after initial use. Candidate ordering and result fidelity were not compared in this timing-only check. The private VPS receipt is `/tmp/tkv60-retrieval-warm.log`.


## Isolated length-batching comparison

Native bucket batching reduced reranker wall time by about43–45% in two fixed candidate sets. It did not change complete candidate ranking or the top20 order in these samples. This supports a narrow reversible pilot, not a claim of resolved startup deadlines.

The comparison used the deployed `cross-encoder/ms-marco-MiniLM-L-6-v2` model with batch size32, one separately initialized engine, and no LLM calls. The profiler intercepted actual query/document pairs, discarded one baseline warmup, then timed off/on/on/off on the same object and exact pairs. It restored the diagnostic object's prior flag and returned baseline scores to recall. The live service setting was unchanged.

| Evidence group | Candidate pairs | First off | First on | Second on | Final off | Largest score difference | Full ordering |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Observations | 160 | 8.451s | 4.574s | 4.577s | 8.095s | 0.000001907 | Unchanged |
| World/experience | 300 | 14.724s | 8.410s | 8.326s | 14.608s | 0.000005722 | Unchanged |

Both baseline score hashes matched across repetitions, and both batched hashes matched across repetitions within each group. Tiny numerical score differences remained between settings. Tie ordering used the original candidate index. The comparison controls inputs and evidence budgets, but two candidate sets do not cover every passage-length distribution, bank, shared-service load, or complete Reflect loop. Provider variability remains independently measured. Private VPS receipts are `/tmp/tkv60-bucket-compare.log` and container `/tmp/tkv60-bucket-results.json`.

The proposed live pilot changes only `HINDSIGHT_API_RERANKER_LOCAL_BUCKET_BATCHING=true`. It affects local reranking for the shared Hindsight service and requires recreating only that service. Preserve current models, batch size, candidate limits, evidence budgets, reasoning, deadlines, triggers, and provisional concurrency limits. Before applying, privately snapshot exact configuration and compare native resolved output; afterward verify effective readback, health, evidence quality, and installed startup hooks. Restore the exact configuration if quality or operating behavior regresses. This live change is proposed, not applied by the isolated test authorization.


A subsequent single batched pass verified finite scores and one score per candidate for163 observation pairs and300 raw pairs. Candidate hashes differed from the original paired benchmark, so this is an additional validity sample, not a finite/count assertion about the original saved arrays. Its receipt is `/tmp/tkv60-bucket-validation.log`. Both isolated processes completed and closed their engines. At this diagnostic stage, the live flag was unchanged. The subsequent approved live pilot is recorded below.


## Approved live batching pilot — October 11, 2026

Applied only `HINDSIGHT_API_RERANKER_LOCAL_BUCKET_BATCHING=true`. Private backup: `/opt/hindsight/backups/tkv60-batching-20261011T151340Z/`. Native resolved configuration comparison verified the single change; models, reasoning, budgets, deadlines and provisional concurrency limits were preserved. Only Hindsight was recreated, without pulling an image. Effective readback and public health/database connectivity passed.

Installed hook bundles used new sessions and the same established-memory-decisions query sequentially:

| Host | SessionStart | Prompt elapsed | Generated Reflect | Answer characters | Pages supplement |
| --- | --- | --- | --- | --- | --- |
| Codex | 0.479s | 48.342s | 48.101s | 8,088 | 0.162s |
| Claude | 0.744s | 55.479s | 55.256s | 12,919 | 0.132s |

Both returned complete generated reflections without fallback. Reviewed traces confirm four successful Terra calls for Codex (31.031s total), and five for Claude (40.445s). This is one sample per host, not proof of reliable startup, interactive host scheduling/trust, or causal improvement from batching. Codex's previous concurrency-only result was already 48.5s; provider variability remains substantial.

Answers preserved the main decisions but repeated an older redaction-enabled baseline without distinguishing the newer shipped default from the live bank. Use them as historical context; verify current configuration against files and readback. The flag remains applied provisionally with exact rollback available. Next verify representative startup under mixed foreground/background load and interactive host behavior before accepting a reliability fix. Private receipts: `/tmp/tkv60-batching-hooks/`; sanitized trace receipt `traces-sanitized.json`.

## Bank-strategy onboarding addition

The owner-authorized blog review is implemented in plain-English Markdown through `hindsight-bank-strategy.md`, linked from the connection interview and package default. It preserves one bank per project, intentional broader sharing, stable recorded identity across hosts/checkouts, tag-filter checks separate from authorization, and separately approved migration. Current API documentation qualifies the blog: writes create missing banks, reads return404; aliases require checking resolved identity before treating an ID change as migration. No new scripts or automatic migration were added.

Independent review passed. Toolkit manifests/Claude marketplace are0.9.51 locally. Claude plugin validation and `git diff --check` passed; a scratch Codex home accepted and enabled0.9.51. These checks do not establish complete interactive setup or Windows support. Other video proposals remain unapproved.


## Reliability verification: timeouts reproduced

The unchanged service profile did not pass the next reliability check. Actual interactive Codex0.162.1 and Claude Code2.1.296 sessions recognized the intended bank. Their startup requests overlapped with representative hook-bundle checks and ordinary service background work; this was not a controlled attribution experiment.

| Path | Reflect result | Delivery |
| --- | --- | --- |
| Interactive Codex, established decisions | 71.104s,5,896characters | Generated summary reached host; host clipped part of the injected context. |
| Interactive Claude, established decisions | Timed out90.007s | Pages fallback145ms; generated summary unavailable to agent. |
| Codex installed bundle, project setup | 72.735s,5,634characters | Generated reflection; totalprompt72.927s. |
| Claude installed bundle, page limitations | Timed out90.012s | Pages fallback121ms; totalprompt90.350s. |

No model, deadline or service configuration changed. Interactive sessions were instructed to use supplied context without tools, writes or memory saves; their stop diagnostics confirm retain disabled. They were closed after the diagnostic. Codex's answer treated remembered settings as historical and current configuration as unverified. A setup-sequence claim still overstated a past review as owner approval. Claude accurately reported unavailable synthesis and limited fallback evidence.

Codex's complete hook output was11,175characters; the delivered developer context was10,016characters with an explicit358-token truncation marker. Missing middle content included fallback/host deadline values. This is host delivery clipping, distinct from model truncation or server timeouts. The native additional-context limit is a candidate for a separate supported configuration check; no host limit was changed here.

A TKV-64 page refresh operation ran15:39:20–15:41:05UTC during the check. Overlap alone does not establish queue waiting or causation. Component map has a later successful refresh at15:15:32UTC, after the earlier manually approved14:40:43refresh; its hourly trigger remains intact and failure flag clear. The later operation's exposed payload does not identify its initiator, so it supports subsequent refresh success without proving scheduled execution. The page is stale again after new saves, which is separate from a failure.

Private evidence: `/tmp/tkv60-reliability-hooks/`, `/tmp/tkv60-reliability-api/`, and host-specific interactive diagnostic logs. Next discriminate provider completion versus capacity waiting in matched traces, then test a supported intervention without combining model, capacity and evidence changes. The original timeout is still unresolved.


Matched request traces explain why the client checks failed:

| Path | Successful Terra calls | Model-call total | First model start to final end |
| --- | --- | --- | --- |
| Interactive Codex |4|50.425s|70.930s|
| Interactive Claude |5|103.728s|124.943s|
| Codex bundle |4|50.177s|72.589s|
| Claude bundle |5|78.856s|97.897s|

Interactive Claude spent more than the client deadline inside successful model calls alone. Its49.091s fourth call stopped without the required completion tool; an additional19.449s call returned `done`. This was another completion round, not evidence of an authentication retry. The other failed Claude request had a60.789s final call. Between-call spans include retrieval/orchestration and possibly waiting; available metrics do not measure permit waits. Server requests continued after client timeout. Separate app-generated suggestion reflections also overlapped; they were not page jobs. Token usage was unavailable. These results make model completion/required-loop termination a concrete next intervention target, while host clipping needs a separate delivery check.


## Live GPT-6 Luna pilot failed the quality check and was rolled back

Mike explicitly approved this trial after checking the earlier Luna history. Native resolved configuration comparison verified only two additions: `HINDSIGHT_API_REFLECT_LLM_MODEL=gpt-6-luna` and `HINDSIGHT_API_MENTAL_MODEL_REFRESH_LLM_MODEL=gpt-5.6-terra`. The page override preserved Terra because page refresh otherwise inherits Reflect. Exact backup: `/opt/hindsight/backups/tkv60-luna-20261011T190621Z`. Other models, reasoning, batching, concurrency, evidence options and deadlines were unchanged. Only Hindsight was recreated, without an image pull. Running-container readback, persistent auth mount and public database health passed.

| Path | Reflect duration | Answer characters | Result |
| --- | ---: | ---: | --- |
| Interactive Codex, established decisions | 40.382s | 3,866 | Complete, useful; historical/current distinction preserved. |
| Interactive Claude, established decisions | 27.417s | 3,303 | Complete, useful; historical/current distinction preserved. |
| Codex installed bundle, project setup | 23.309s | 1,148 | Failed quality: stopped halfway through `gitIngest:` and omitted generated-reflection settings. |
| Claude installed bundle, page limitations | 42.761s | 3,963 | Complete, useful; distinguished manual recovery from unverified scheduled execution. |

All four returned generated reflection without fallback inside the unchanged90-second deadline. The two interactive sessions and representative bundle requests ran sequentially; normal app/background demand was not disabled. All matched provider calls used GPT-6 Luna and reported success. This small sample is not a controlled proof of a model speed effect or sustained reliability.

The incomplete answer exists in the full Codex hook output and its diagnostic answer, well below the8,000-character logging cap. Installed client code returns the API response `text` with whitespace trimming only. The final trace reported `done`, so successful transport and completion-tool termination do not establish a complete answer. The defect is in the API-returned text, not Codex host clipping; available stored traces do not distinguish model output from server processing. This repeats the kind of incompleteness recorded in the earlier Luna comparison and prevents accepting the replacement.

The actual Codex hook context was9,145characters and reached its model without a truncation marker in this sample. Smaller output fitting the current host allocation does not fix the separate clipping risk for longer answers. Both interactive sessions used no tools or writes and their stop diagnostics recorded retention disabled; both CLI sessions were closed after completion.

Rollback compared the current resolved configuration to the saved pilot configuration before restoring, guarding against concurrent changes. The restored resolved configuration exactly matched the pre-pilot snapshot. Only Hindsight was recreated. Effective container readback confirmed Terra with both added overrides absent, batching enabled and global4/Reflect2 preserved. Public health reported healthy/database connected. No subsequent model change is approved or applied.

Independent evidence review recommended rollback. Private receipts: `/tmp/tkv60-luna-hooks/`, host-specific `/tmp/tkv60-luna-*-interactive-diag.jsonl`, and `/tmp/tkv60-luna-traces-sanitized.json`. Next investigate the incomplete API answer and prepare a sanitized upstream reproduction that includes both Terra deadline overruns and incomplete responses observed during the Luna pilot. Do not repeat unchanged Luna comparisons or present a model switch as a verified fix. Upstream posting still requires owner authorization.


### Sanitized upstream reproduction draft

**Problem:** Hindsight0.10.2 with the `openai-codex` provider can return an incomplete Reflect `text` even when every recorded model call succeeds and the final call uses `done`. Switching models can reduce waiting without satisfying answer completeness.

**Reproduction path:** Use a populated coding-project bank and the installed coding-agent add-on0.8.0 first-prompt wrapper. Set only the Reflect model to `gpt-6-luna`, explicitly preserve the existing page-refresh model, and preserve the existing reasoning, low Reflect budget, retrieval options and deadlines. Submit: “How should a project set up Hindsight while preserving deliberate saves and generated startup reflection?” The saved failure returned in23.309seconds with1,148characters and ended halfway through the literal setting `gitIngest:`. Capture the complete API `text`, not only a UI preview, and match its final completion trace. This failure is intermittent; the other three live queries completed usefully.

**Expected result:** The returned synthesis finishes its sentences and settings and retains the decisions relevant to the query. A response delivered within the deadline but cut off halfway through a setting is not successful startup memory.

**Evidence:** The full hook output and diagnostic answer agree. Installed client code returns the API's `text` with whitespace trimming only; the8,000-character diagnostic cap does not apply to this1,148-character answer. The matching trace contains four successful Luna calls and finishes with `done`. Recorded provider output is unavailable, so this evidence identifies the response boundary but cannot attribute the cutoff to generation, stream assembly, or server processing.

**Related latency evidence:** With Terra, the matched interactive failure spent103.728seconds in five successful model calls and spanned124.943seconds, crossing the client's90-second deadline. The deployment already reports0.10.2; the completed Luna trial does not establish a latency-and-quality-preserving fix for the remaining overruns discussed in upstream issue4566.

**Safety and operating outcome:** Exact pre-pilot configuration was restored and verified healthy. No issue was posted. Before sharing externally, replace project/bank identifiers and inspect any selected raw receipt for private memory, credentials and service addresses. Existing sanitized call timings can accompany the reproduction without exposing source memories.

The final setup-guidance update records the Luna pilot that failed the quality check and requires reviewing complete text and actual host delivery beyond transport/`done` success. Independent review found no issues. Toolkit0.9.53 passed both Claude plugin validations, `git diff --check`, and installation into a fresh scratch Codex home. These packaging checks do not resolve runtime reliability.


## October 11, 2026: investigation of the incomplete API answer

The pilot failed the answer-quality check; the evidence does not establish that GPT-6 Luna is defective. The failed setup summary ended at `gitIngest:` inside the API-returned text. The remaining question is whether the upstream response ended early, the model supplied an unfinished answer in valid tool arguments, or Hindsight shortened a complete upstream answer.

The [v0.10.2 Codex provider](https://github.com/vectorize-io/hindsight/blob/v0.10.2/hindsight-api-slim/hindsight_api/engine/providers/codex_llm.py#L1154) reads function arguments from `response.output_item.done`, parses their JSON, and repairs only invalid escape sequences. It does not assemble argument deltas. It ignores response terminal status and accepts a completed function item even if the stream subsequently reports failure, incompleteness, or ends without a terminal event. It derives the recorded `finish_reason` from whether tool calls exist. Current upstream `main` retains this behavior. OpenAI defines separate [completed, incomplete and failed response events](https://developers.openai.com/api/reference/resources/responses/streaming-events); an item marked done does not substitute for checking the response outcome.

An offline test extracted that parser from the tagged source and supplied the same valid `done` arguments containing unfinished text. Completed, incomplete, failed and bare-end-of-stream variants all returned the identical non-empty answer. The private receipt is `/tmp/tkv60-offline-codex-terminal-proof.json`. This proves a parser weakness, not that the recorded pilot encountered it. The [Reflect done processor](https://github.com/vectorize-io/hindsight/blob/v0.10.2/hindsight-api-slim/hindsight_api/engine/reflect/agent.py#L1720) accepts non-empty answer text without checking whether its sentences or settings are complete.

Increasing `HINDSIGHT_API_REFLECT_MAX_COMPLETION_TOKENS` is not an established remedy. Reflect forwards that setting, but this Codex provider's `call_with_tools` request does not include its value. Operation-specific `HINDSIGHT_API_REFLECT_LLM_EXTRA_BODY` can add request fields, but backend support and the actual terminal reason must be established before proposing a setting change. The [Anthropic completion-cap issue](https://github.com/vectorize-io/hindsight/issues/4437) concerns a different provider and does not explain this result.

To identify the cause, capture the final provider stream privately with its exact request settings, terminal status and reason, usage, completed `done` arguments, and returned API text. Replay the captured stream through the deployed parser without generating another answer. If complete upstream text becomes shorter downstream, investigate Hindsight processing. If an incomplete, failed or unterminated stream becomes success, investigate terminal handling. If a clean completed response contains the same unfinished answer in valid JSON, investigate model/backend answer quality. Existing request traces retain tool names rather than tool arguments and cannot settle the historical case. No live settings or generation calls were used for this source review.


## Hindsight project alignment and memory-flow verification — October 11, 2026

The owner authorized applying the shipped Hindsight choice to Toolkit V2 itself, preserving its authoring configuration. Root guidance, the exact memory rule and prompt reminder, both host reminder entries, and PROJECT.md now record that choice. Only the scoped add-on toolGuideExtra changed; live redaction, survey, models, deadlines, and other banks were preserved. Setup remains open.

The durable correction `correction-hindsight-onboarding-package-and-luna-trial-interpretation` was saved through the installed ingestion tool. API readback confirmed its original text, eight extracted facts, and seven observation links. Raw Recall returned that correction. General observation Recall returned consolidated memory, but still included obsolete proposals; successful retrieval does not prove current or reconciled content. The non-storing extraction preview took 26.447 seconds. It retained the approved alignment decision and diagnostic finding and excluded routine weather and an unapproved model-change proposal. Its diagnostic paraphrase nevertheless overstated an uncertain cause, despite the mission asking to preserve uncertainty. This is a content-quality limitation, not a processing failure.

Raw Recall took 9.646 seconds, observation Recall 5.556 seconds, and a strict nonexistent-tag query returned zero results in 0.152 seconds. Health passed. At 19:24 UTC, all fifteen pages were stale; eleven retained October 9–10 failure timestamps newer than their last success. Four pages refreshed successfully today. These historical flags do not establish that the latest service configuration failed. A manual refresh of the stale onboarding page was submitted without changing its source or schedule; operation `a406a54b-495f-45e9-b67a-78f113ab6fa7` is being checked.

The add-on sync-status indicator is misleading for this approved package: its source requires gitlogPresent to set synced true, whereas this project deliberately sets gitIngest to none. A false result therefore does not prove that deliberate memories are unavailable. Survey coverage reports eleven commits behind its baseline; writer protection and updated survey coverage remain unverified.


### Fresh host and recovered-page results

Fresh trusted Codex session `01a12c6e-682a-7280-a78d-14fc5e5b8bcb` received a generated startup answer about 42.383 seconds after its first turn began. The complete saved hook output was 13,099 characters, while native delivery reported 3,295 original tokens and truncated the context to its default allowance. The host saw 10,022 characters including the truncation notice. Its answer explicitly acknowledged the missing evidence. Thus startup generation worked in this sample, but complete delivery failed. The new project reminder was trusted and ran. No tools, memory writes or delegation were used by the diagnostic session.

Fresh interactive Claude startup logged `reflect_ok` at 74.359 seconds with 6,701 answer characters, followed by `pages_ok`; pages accompany the generated reflection rather than establish a fallback. The session reached bank toolkit-v2 and its Stop hook recorded `retain_disabled`. This sample succeeds inside the approved 90-second reflection deadline, but earlier failures remain relevant and these runs do not establish reliability.

The manually recovered onboarding page completed in approximately 174 seconds. Readback showed 8,538 content characters, a cleared failure flag, and `is_stale: false`. Its source query and trigger configuration matched the pre-refresh values exactly. The obsolete two-package guidance was replaced by the single deliberate-save package with generated startup Reflect. A later automatic scheduled run has not been verified.

Core saving, fact extraction, consolidation, Recall, generated Reflect and manual page refresh therefore operate in measured samples. Remaining distinct issues are startup latency reliability, Codex context clipping, older paused page recovery and schedule provenance, stale or overstated generated claims, survey writer protection, and authentication/recovery verification. No new model or shared-service setting was applied in this alignment.


### Claude delivery also persisted a short preview

Claude's generation success did not prove complete startup delivery. Session `b7c76877-3d73-40b0-8afd-06fb2a592885` recorded a `hook_additional_context` attachment whose content began `Output too large (12.2KB)` and provided only a first-2KB preview. The full combined hook output was saved under the session's `tool-results/` directory. The diagnostic prohibited tools, so the agent did not read that file and explicitly reported that it could not see the remembered claims. An ordinary session may read the persisted file; that path was not exercised. Both hosts therefore require full delivery verification independently from successful Reflect generation.


## October 11, 2026: Claude generated the answer but persisted the hook context

A fresh actual Claude session, `b7c76877-3d73-40b0-8afd-06fb2a592885`, received a file reference and preview instead of the full startup context. Reflect succeeded in 74.359 seconds with 6,701 answer characters. The combined memory wrapper and tool guidance contained 12,443 characters (12,514 bytes). Claude Code saved that full text to the session's `tool-results/hook-386cf21f-4dfd-44f5-94dc-7d7c942e2187-3-additionalContext.txt` and injected a 2,143-character system reminder containing the path and a preview. The transcript contains no tool calls, consistent with the owner's instruction for that diagnostic, so the full saved context was not read. Generation passed; complete delivery did not.

The [official Claude Code hooks reference](https://code.claude.com/docs/en/hooks#json-output) documents a 10,000-character cap on each additional-context string. Overflow is saved to a file and replaced by its path and a preview of up to 2,000 characters. No setting or environment variable raises this hook cap. Claude Code does not ask the model to read the saved file. Codex's `additionalContextLimit` and limits for MCP results do not change Claude hook delivery.

Verification must inspect what reaches each host's model, including whether a referenced full output was actually read. When tools are allowed, plain-English project guidance can direct the agent to read persisted memory context before relying on its summary. When a task forbids tools, the agent must identify incomplete delivery rather than claim it received the whole summary. Reliable inline delivery requires keeping the combined hook output within the host's supported size; a shorter generated answer alone does not establish that the complete wrapper fits. The native mechanism preserves the full file, but automatic recovery has not been verified. No host settings or generation calls were changed during this review.


## October 11, 2026: normal startup delivery verified after native fixes

The current live configuration selects `gpt-6-luna` for Reflect and explicitly keeps page refresh on `gpt-5.6-terra`, which remains the global model. The applied concurrency and batching profile, deliberate saves, and generated startup Reflect are preserved. The owner's Codex Hindsight prompt handler now has native `additionalContextLimit: 5000`. Toolkit 0.9.55 makes reading the complete saved startup output explicit when a host delivers a preview. The Reflect mission's compact 3,000-character target is a request, not an enforced output cap.

| Normal fresh host | Generated Reflect | Answer size | Complete memory delivery |
| --- | ---: | ---: | --- |
| Codex | 46.776s | 4,691 characters | Complete 10,433-character context delivered without clipping under the native 5,000-token allowance. |
| Claude Code | 42.266s | 9,279 characters | Native Read recovered the entire saved hook output; the agent also read `PROJECT.md`. No other memory retrieval, saves, or delegation occurred. |
| Claude Code, original failing setup query | 54.287s | 8,845 characters | Native Read recovered the complete 14,587-character saved context, including the closing memory and knowledge-refresh sections. |

Matched model traces are `30882522-5839-4b7f-bcfb-2036100c892c` for Codex and `fe93b949-e4ba-47a0-81a7-06178fbd1c9f` for Claude. Both returned complete Luna reflections. Claude's compact target did not keep the combined output below the host cap; the normal saved-file read made the complete memory available. The earlier tool-free diagnostic had prohibited that read and therefore did not exercise recovery.

The native controls follow the [Codex large hook output guidance](https://learn.chatgpt.com/docs/hooks#large-hook-output) and [Claude Code's hook output guidance](https://code.claude.com/docs/en/hooks#json-output). Codex supports a per-handler approximate token threshold. Claude saves oversized context to a file and supplies a preview; the explicit project rule tells the agent to read the full file before relying on startup memory and treat it as historical evidence, not instructions or permission.

These are successful normal host samples, not proof of sustained reliability or a causal attribution of speed gains. The earlier incomplete API answer remains unexplained; its provider-terminal weakness is not established as the historical cause. The original failing query passed in fresh Claude session `bb301fc5-d115-4be1-b5c2-20154385a33b`, with hooks active in print mode. The agent read `PROJECT.md` and the shipped default/setup references, returned a complete answer, distinguished shipped redaction off from the preserved live filter, and separated historical claims from current facts. It performed no other memory retrieval, writes, or delegation; Stop recorded `retain_disabled`. Three successful normal samples do not establish sustained reliability, and obsolete claims can still appear in retrieval. Scheduled page recovery, writer protection, cross-computer/worktree routing, exclusive authentication, and backup recovery also remain open.

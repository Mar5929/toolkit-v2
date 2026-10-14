# Hindsight service evidence retained during TKV-79

This record preserves the October 11, 2026 testing history removed from shipped setup guidance. It is evidence for the tested Toolkit service and versions; it is not a general reliability guarantee. The shipped recommendation keeps the operational evidence limits.

The [video frame at 5:04](https://www.youtube.com/watch?v=UVEjThz8DSo&t=304s) shows `gpt-5.6-terra` globally, for consolidation, and for Reflect; `gpt-5.6-luna` for Retain; low global/Retain reasoning; and medium consolidation/Reflect reasoning. Its server timeouts of 300 and 600 seconds do not control the add-on's startup deadline. The frame does not show a separate page-refresh model. These are the creator's choices, not measured fixes for this service.

### What the tests established

The 0.10.2 baseline used Terra and a global model-call cap of 1. Provider replays of the same final request varied from 20.520 to 56.059 seconds. An isolated complete Terra reflection took 77.797 seconds: model calls used 51.360 seconds and local reranking used 26.000 seconds. Its separate engine did not measure the live service queue.

The concurrency-only pilot used the profile above, without batching. Installed hook-bundle tests returned a generated Codex reflection in 48.500 seconds; Claude timed out at 90.012 seconds and used pages fallback. Capacity alone therefore did not establish reliable generated summaries.

Fixed-input comparisons with `cross-encoder/ms-marco-MiniLM-L-6-v2` and batch size 32 reduced reranker wall time by about 43–45% with bucket batching. Full candidate order was unchanged for 160 observation pairs and 300 raw-memory pairs; small score differences remained. This is evidence for those samples, not every bank or passage distribution.

After the approved batching change, installed hook-bundle tests returned complete generated reflections in 48.101 seconds for Codex and 55.256 seconds for Claude, without fallback. That was a sample per host, not proof of sustained reliability or a causal startup improvement. Interactive host scheduling, trust, and mixed foreground/background load remained unverified. Summaries also repeated an older redaction baseline, demonstrating that speed and complete text do not establish current accuracy.

Later interactive Terra startup checks returned Codex reflection in 71.104 seconds and timed out in Claude at 90.007 seconds. Representative bundle checks also returned mixed results. Concurrency and batching did not resolve sustained startup reliability. Codex clipped part of a complete hook output before delivery, which is separate from a server timeout.

An earlier Luna trial returned an incomplete setup answer despite a successful `done` call and was rolled back. That failure did not establish that Luna caused the cutoff. After fixing native host delivery, the approved Luna retry passed normal startup checks in Codex at 46.776 seconds and Claude at 42.266 seconds. The original failing setup query also passed in a fresh Claude session at 54.287 seconds. Codex received complete context; Claude read its complete saved hook output and verified current settings against project files. These are finite successful samples, not a sustained reliability guarantee or proof of the earlier cutoff's cause. Keep the working profile while diagnosing any newly observed failure at the failing stage.

## Sync indicator sample

Check an indicator's prerequisites before using it as a memory-flow verdict. The installed add-on 0.8.0 and its [sync-status source](https://github.com/vectorize-io/hindsight/blob/main/hindsight-integrations/coding-agents/src/core/status.ts) require a Git seed for its `synced` flag even with approved `gitIngest: "none"`. In the October 11 test, that flag was false while a deliberate correction processed into eight facts and seven observation links and remained retrievable through raw Recall. Verify actual save, processing, and retrieval rather than enabling Git ingestion to satisfy the indicator.

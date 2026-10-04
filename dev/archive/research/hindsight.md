# Hindsight, run fully locally: research brief for Toolkit V2

Researched 2026-09-26 on Mike's Mac (Apple M5, 32 GB, macOS Darwin 25.6.0).
Everything marked **Verified** was run on this Mac. Everything marked
**Source** was read in the installed package code. Everything marked **Docs**
comes from hindsight.vectorize.io and was not re-checked unless it says so.

This brief stands alone: a builder who has not read the sources should be able
to set up the server, the background service, one bank per project, and the
Claude Code and Codex connections from it.

---

## 1. Short answers

| Question | Answer |
| --- | --- |
| Installed version | `hindsight-api` **0.10.1** (a wrapper over `hindsight-api-slim[all]==0.10.1`), Python 3.12, installed with `uv tool install hindsight-api --python 3.12`. |
| LLM settings for Ollama | `HINDSIGHT_API_LLM_PROVIDER=ollama`, `HINDSIGHT_API_LLM_MODEL=gpt-oss:20b`, `HINDSIGHT_API_LLM_BASE_URL=http://127.0.0.1:11434/v1`. No API key. Plus four tuning settings for gpt-oss (section 5). |
| Where data lives | Embedded PostgreSQL 18.1 managed by `pg0`: data in `~/.pg0/instances/<instance>/data`, binaries in `~/.pg0/installation/18.1.0`. The docs say `~/.hindsight/data/`; that is wrong for 0.10.1. |
| Embeddings and reranker | Run in-process, on the CPU, from Hugging Face models cached in `~/.cache/huggingface/hub`. Apple's GPU (MPS) is deliberately never used. |
| Telemetry or cloud calls | No telemetry code in Hindsight. The only outbound traffic seen was to `huggingface.co` (model checks). With `HF_HUB_OFFLINE=1` there were **zero** outbound connections (Verified). |
| Background service | A launchd user agent running `hindsight-api` in the foreground (not `--daemon`). Proposed plist in section 9; it passes `plutil -lint`. |
| Create a bank | `PUT /v1/default/banks/{bank_id}`. `POST` returns 405 even though the docs show `POST` (Verified). |
| Change bank settings | `PATCH /v1/default/banks/{bank_id}/config` with body `{"updates": {...}}`. The flat body the docs show is rejected with 422 (Verified). |
| MCP | Built into the same server at `http://127.0.0.1:8888/mcp/`. Per-project URL: `http://127.0.0.1:8888/mcp/<bank_id>/` (single-bank mode). Streamable HTTP, not stdio. |
| `hindsight-local-mcp` | Not a separate MCP program. It is the same API server with one changed default: the database becomes `pg0://hindsight-mcp`. Do not use it. |
| Project to bank | One stable bank id per project, chosen once at project init and stored in a committed project file. Never derive it from the folder name at run time (Mike moves folders). |
| End-to-end test | Retain, recall, reflect, async retain, MCP tools list, MCP recall, and a per-bank tool allowlist all worked against `gpt-oss:20b` (section 3). |

---

## 2. What is installed

### Paths

| Thing | Path |
| --- | --- |
| Executables (symlinks) | `~/.local/bin/hindsight-api`, `~/.local/bin/hindsight-local-mcp`, `~/.local/bin/hindsight-worker`, `~/.local/bin/hindsight-admin` |
| Their target | `~/.local/share/uv/tools/hindsight-api/bin/<name>`, Python scripts whose first line is `#!/Users/michaelrihm/.local/share/uv/tools/hindsight-api/bin/python` |
| Package source | `~/.local/share/uv/tools/hindsight-api/lib/python3.12/site-packages/hindsight_api/` |
| Settings source of truth | `.../hindsight_api/config.py` (5,392 lines, about 485 `HINDSIGHT_API_*` settings) |
| Bundled `pg0` binary | `.../site-packages/pg0/bin/pg0` (pg0 0.15.2). It is **not** on `PATH`. |
| uv receipt | `~/.local/share/uv/tools/hindsight-api/uv-receipt.toml` |

Notable bundled libraries: `torch 2.14`, `sentence_transformers 6.1`,
`transformers 5.15`, `mlx 0.32` and `mlx_lm 0.31` (Apple Silicon), `FlashRank`,
`onnxruntime`, `fastmcp 4.0.10`, `litellm 1.91.5`, `opentelemetry-*`,
`sentry_sdk 2.70` (installed as someone else's dependency; `hindsight_api`
never imports it), `pg0_embedded 0.15.2`.

### The four executables

| Executable | Entry point | What it does |
| --- | --- | --- |
| `hindsight-api` | `hindsight_api.main:main` | The server. One process holds the HTTP API, the MCP server at `/mcp`, and a background worker (`HINDSIGHT_API_WORKER_ENABLED` defaults to `true`). Starts the embedded PostgreSQL if the database URL starts with `pg0`. Runs database migrations on startup. |
| `hindsight-local-mcp` | `hindsight_api.mcp_local:main` | Sets `HINDSIGHT_API_DATABASE_URL` to `pg0://hindsight-mcp` if unset, then calls the same `main()` as `hindsight-api`. Its docstring says an LLM API key is required; that is only true for cloud providers. |
| `hindsight-worker` | `hindsight_api.worker.main:main` | A separate worker for multi-machine setups. Not needed: the API server already runs one. Its metrics port 8889 binds `0.0.0.0` by default. |
| `hindsight-admin` | `hindsight_api.admin.cli:main` | Commands: `backup`, `restore`, `run-db-migration`, `repair-bank`, `rename-bank`, `export-bank`, `import-bank`, `decommission-worker`, `decommission-workers`, `worker-status`. |

### `hindsight-api --help` (Verified)

```
usage: hindsight-api [-h] [--host HOST] [--port PORT]
                     [--log-level {critical,error,warning,info,debug,trace}]
                     [--reload] [--workers WORKERS] [--access-log]
                     [--no-access-log] [--proxy-headers]
                     [--forwarded-allow-ips FORWARDED_ALLOW_IPS]
                     [--ssl-keyfile SSL_KEYFILE] [--ssl-certfile SSL_CERTFILE]
                     [--daemon] [--idle-timeout IDLE_TIMEOUT]
  --host HOST   Host to bind to (default: 0.0.0.0, env: HINDSIGHT_API_HOST)
  --port PORT   Port to bind to (default: 8888, env: HINDSIGHT_API_PORT)
  --workers     (env: HINDSIGHT_API_WORKERS, default: 1)
  --daemon      Run as background daemon (uses port 8888)
  --idle-timeout  Deprecated and ignored
```

### Defaults that matter (Source: `config.py`)

| Setting | Default | Why it matters |
| --- | --- | --- |
| `HINDSIGHT_API_HOST` | `0.0.0.0` | Listens on every network interface, so anyone on the same Wi-Fi could reach the unauthenticated API. **Always set `127.0.0.1`.** |
| `HINDSIGHT_API_PORT` | `8888` | |
| `HINDSIGHT_API_DATABASE_URL` | `pg0` (means instance name `hindsight`) | |
| `HINDSIGHT_API_LLM_PROVIDER` | `openai` (model `gpt-4o-mini`) | Must be overridden, or it tries OpenAI. |
| `HINDSIGHT_API_EMBEDDINGS_PROVIDER` | `local`, model `BAAI/bge-small-en-v1.5` (384 dimensions) | |
| `HINDSIGHT_API_RERANKER_PROVIDER` | `local`, model `cross-encoder/ms-marco-MiniLM-L-6-v2` | |
| `HINDSIGHT_API_MCP_ENABLED` | `true` | |
| `HINDSIGHT_API_MCP_ENABLED_TOOLS` | unset (all tools) | Includes `delete_bank` and `clear_memories`; see section 11. |
| `HINDSIGHT_API_WORKER_ENABLED` | `true` | |
| `HINDSIGHT_API_RUN_MIGRATIONS_ON_STARTUP` | `true` | An upgrade migrates the database automatically. Back up first. |
| `HINDSIGHT_API_LLM_MAX_CONCURRENT` | `32` | Code comment: "Set HINDSIGHT_API_LLM_MAX_CONCURRENT=1 for local LLMs (LM Studio, Ollama)." |
| `HINDSIGHT_API_LLM_TIMEOUT` | `120` seconds | Reflect uses its own 30-second per-call limit unless this is set explicitly. |
| `HINDSIGHT_API_RETAIN_MAX_COMPLETION_TOKENS` | `64000` | Must stay larger than `HINDSIGHT_API_RETAIN_CHUNK_SIZE` (default `3000`), or startup fails validation. |
| `HINDSIGHT_API_FILE_PARSER` | `markitdown` (local) | The other parser, `iris`, calls `https://api.vectorize.io/v1`. Never enable it. |

### How settings are loaded

1. Process environment variables.
2. Then a `.env` file, found by `find_dotenv(usecwd=True)`, which walks **up**
   from the current working directory. It loads with `override=True`, so a
   `.env` file wins over the environment. Code: `config.py`,
   `load_dotenv_for_entrypoint()`.

Consequence for the service: whatever working directory the service starts in,
a stray `.env` in that folder or any parent folder silently replaces the
service's settings. There is no `~/.env` today. The plist below sets
`WorkingDirectory` to `~/.hindsight`, which must not contain a `.env` unless
the team decides to keep settings there instead (section 9.4).

### `--daemon` mode (do not use under launchd)

`--daemon` re-launches itself as a detached child and the parent exits at once.
It forces `127.0.0.1` unless a host is given, and writes output to
`~/.hindsight/daemon.log` (`HINDSIGHT_API_DAEMON_LOG`). Under launchd the parent
exiting looks like a crash, so launchd would restart it in a loop. The service
must run `hindsight-api` in the foreground.

---

## 3. Live test on this Mac (Verified)

`ollama list` showed `gpt-oss:20b` (id `17052f91a42e`, 13 GB), so the server was
started briefly on port 8888 against a separate test database instance named
`hindsight-v2-research`, then stopped.

### Launcher used

```zsh
export HINDSIGHT_API_HOST=127.0.0.1
export HINDSIGHT_API_PORT=8888
export HINDSIGHT_API_DATABASE_URL=pg0://hindsight-v2-research
export HINDSIGHT_API_LLM_PROVIDER=ollama
export HINDSIGHT_API_LLM_MODEL=gpt-oss:20b
export HINDSIGHT_API_LLM_BASE_URL=http://127.0.0.1:11434/v1
export HINDSIGHT_API_LLM_MAX_CONCURRENT=2
export HINDSIGHT_API_LLM_OLLAMA_NUM_CTX=32768
export HINDSIGHT_API_LLM_EXTRA_BODY='{"think":"low"}'
export HINDSIGHT_API_LLM_REASONING_EFFORT=low
export HINDSIGHT_API_LLM_TIMEOUT=300
export HINDSIGHT_API_RETAIN_MAX_COMPLETION_TOKENS=16000
export HF_HUB_DISABLE_TELEMETRY=1
export LITELLM_LOCAL_MODEL_COST_MAP=True
export HF_HUB_OFFLINE=1          # added from the second run on
exec /Users/michaelrihm/.local/bin/hindsight-api
```

### Results

| Step | Result | Time |
| --- | --- | --- |
| First start (downloads two Hugging Face models, creates the database, installs `pgvector`, runs all migrations) | Healthy | about 25 s |
| Later starts | Healthy | about 8 to 10 s |
| `GET /health` | `{"status":"healthy","database":"connected",...}` | |
| `GET /version` | `{"api_version":"0.10.1","features":{"observations":true,"mcp":true,"worker":true,...}}` | |
| `POST /v1/default/banks/tkv2-research-test` | HTTP **405** (the documented method does not exist) | |
| `PUT /v1/default/banks/tkv2-research-test` | Bank created, missions stored | |
| Sync retain of one 2-sentence item | `success: true`, 1,895 input and 309 output tokens | **12.4 s** (10.0 s on a later run) |
| Recall | Returned both extracted facts, with tags and `document_id` | **0.05 s** |
| Reflect | Correct one-paragraph answer | **25.6 s** |
| Async retain, then poll the operation | `pending` then `completed` | about 5 to 9 s |
| MCP `initialize` and `tools/list` on `/mcp/tkv2-research-test/` | 36 tools, including `delete_bank` and `clear_memories` | |
| `PATCH .../config` with `{"updates":{"mcp_enabled_tools":[...]}}` | Tool list shrank to the 11 named tools | |
| MCP `tools/call` `clear_memories` after that | `"Unknown tool: 'clear_memories'"`, `isError: true` | |
| MCP `tools/call` `recall` | Returned the stored memories | |
| Kill the server with `kill -9`, then start again | PostgreSQL kept running; the new server reused it; recall still worked | |
| Outbound connections with `HF_HUB_OFFLINE=1` | **None** during 70 s of startup, retain, and recall | |

Recall does not call the LLM (50 ms). Retain and reflect do.

Memory use: the Hindsight process held about 0.5 to 0.8 GB (peak reported by
the worker: 986 MB). Ollama held `gpt-oss:20b` at 12 GB, 100% GPU, context
32768 (`ollama ps`). Together about 13 to 14 GB of the 32 GB.

### What the test left behind

- pg0 instance `hindsight-v2-research` (49 MB, **stopped**) at
  `~/.pg0/instances/hindsight-v2-research`, holding two test banks:
  `tkv2-research-test` and `proj:tkv2-colon-test`.
- `~/.pg0/installation/18.1.0` (36 MB of PostgreSQL binaries, needed anyway).
- `~/.cache/huggingface/hub` with the two models (about 225 MB, needed anyway;
  they make offline mode work from now on).
- Nothing in `~/Library/LaunchAgents`, no running processes.

Removing the test instance deletes data, so it is left for Mike or the lead to
decide. The command is
`~/.local/share/uv/tools/hindsight-api/lib/python3.12/site-packages/pg0/bin/pg0 drop --name hindsight-v2-research`.
It does not touch the real instance.

---

## 4. Recommended settings

These are the values for the real service. Each one was used in the live test
except the three marked "not live-tested".

| Variable | Value | Reason |
| --- | --- | --- |
| `HINDSIGHT_API_HOST` | `127.0.0.1` | Default `0.0.0.0` exposes the API to the network. |
| `HINDSIGHT_API_PORT` | `8888` | Documented default; every example uses it. |
| `HINDSIGHT_API_DATABASE_URL` | `pg0://hindsight` | Explicit name for the one real instance. Same as the default `pg0`. |
| `HINDSIGHT_API_LLM_PROVIDER` | `ollama` | Never `ollama-cloud`: that provider's default address is `https://ollama.com/v1`. |
| `HINDSIGHT_API_LLM_MODEL` | `gpt-oss:20b` | Mike's choice. The Ollama provider's default would be `gemma3:12b`. |
| `HINDSIGHT_API_LLM_BASE_URL` | `http://127.0.0.1:11434/v1` | Same as the built-in default for `ollama` (`http://localhost:11434/v1`), written out so the address is visible. |
| `HINDSIGHT_API_LLM_MAX_CONCURRENT` | `2` | Tested value. The code comment suggests `1` for local models. Ollama queues extra requests anyway. |
| `HINDSIGHT_API_LLM_OLLAMA_NUM_CTX` | `32768` | Pins the context window. Also routes free-form calls to Ollama's native API, where `think` works (section 5). |
| `HINDSIGHT_API_LLM_EXTRA_BODY` | `{"think":"low"}` | gpt-oss ignores Hindsight's default `think: false`; without this every call does full "medium" reasoning (section 5). |
| `HINDSIGHT_API_LLM_REASONING_EFFORT` | `low` | Same effect for the calls that use Ollama's OpenAI-style endpoint (reflect's tool calls). |
| `HINDSIGHT_API_LLM_TIMEOUT` | `300` | Local generation is slower than cloud. Setting it explicitly also lifts reflect's 30-second per-call limit. |
| `HINDSIGHT_API_RETAIN_MAX_COMPLETION_TOKENS` | `16000` | Default 64,000 is more than the 32,768 context. Must stay above 3,000. |
| `HINDSIGHT_API_SKIP_LLM_VERIFICATION` | `true` (not live-tested) | Startup sends a test call to the LLM and **exits** if it fails. At login Ollama may start after Hindsight. Skipping keeps recall working even when Ollama is down; retains wait and retry. |
| `HINDSIGHT_API_MCP_ENABLED_TOOLS` | see section 11 (not live-tested globally; the per-bank form was) | Removes `delete_bank`, `clear_memories`, and similar tools from every agent. |
| `HINDSIGHT_API_LOG_LEVEL` | `info` | |
| `HF_HUB_OFFLINE` | `1` | Stops all Hugging Face network checks. Works now because both models are cached (Verified). |
| `HF_HUB_DISABLE_TELEMETRY` | `1` | Belt and braces for Hugging Face libraries. |
| `LITELLM_LOCAL_MODEL_COST_MAP` | `True` (precaution) | LiteLLM fetches a price list from `raw.githubusercontent.com` when it is first imported. Hindsight imports it only for LiteLLM providers, so this is only a precaution. |

Settings to leave alone: `HINDSIGHT_API_WORKERS` (keep 1),
`HINDSIGHT_API_EMBEDDINGS_*` and `HINDSIGHT_API_RERANKER_*` (defaults are local),
`HINDSIGHT_API_OTEL_TRACES_ENABLED` (off), `HINDSIGHT_API_FILE_PARSER`
(`markitdown`), `HINDSIGHT_API_WEBHOOK_URL` (unset).

Optional, not tested: authentication with
`HINDSIGHT_API_TENANT_EXTENSION=hindsight_api.extensions.builtin.tenant:ApiKeyTenantExtension`
and `HINDSIGHT_API_TENANT_API_KEY=<secret>`. Then every HTTP and MCP call needs
`Authorization: Bearer <secret>`. With the server bound to `127.0.0.1` and one
user on the Mac, the simpler choice is no key; the tradeoff is that any program
running on the Mac can read the memories.

---

## 5. Ollama and gpt-oss:20b specifics

### How Hindsight talks to Ollama (Source: `engine/providers/openai_compatible_llm.py`)

| Call type | Endpoint used | Notes |
| --- | --- | --- |
| Structured output (fact extraction during retain, consolidation) | Ollama native `POST /api/chat`, with the JSON schema in `format` | Payload always contains `"think": false` and `options.num_batch: 512`, plus `num_ctx`, `num_predict`, `temperature`. `HINDSIGHT_API_LLM_EXTRA_BODY` is merged in: top-level keys (`think`, `keep_alive`) go to the top, an `options` object merges into `options`. |
| Free-form text | Native `/api/chat` **only when** `HINDSIGHT_API_LLM_OLLAMA_NUM_CTX` is set; otherwise `/v1/chat/completions` | |
| Tool calls (the reflect agent) | Always `/v1/chat/completions` | Sends `reasoning_effort` when `HINDSIGHT_API_LLM_REASONING_EFFORT` is set. `num_ctx` cannot reach this path. |

The source comment reads: "Disable thinking by default (qwen3.5, etc.). Override
via extra_body, e.g. {"think": "low"} for gpt-oss models (see #3246)."

### Measured effect of the `think` setting on gpt-oss:20b (Verified, Ollama 0.34.4)

Same small fact-extraction prompt with a JSON schema, sent to `/api/chat`:

| `think` | Output tokens | Thinking text | Total time |
| --- | --- | --- | --- |
| `false` (Hindsight's default) | 562 | 1,806 characters | 26.9 s (includes loading the model) |
| `"low"` | 38 | 16 characters | 1.4 s |

gpt-oss does not accept `false`; it falls back to its default level "medium"
(`ollama show gpt-oss:20b`: thinking levels `low, medium, high`, default
`medium`). `reasoning_effort: "low"` on `/v1/chat/completions` was also
honoured (21 completion tokens versus 34 for `"high"`).

### Other Ollama facts on this Mac (Verified)

- Ollama 0.34.4, Homebrew service `sh.brew.ollama`
  (`~/Library/LaunchAgents/sh.brew.ollama.plist`), listening on
  `127.0.0.1:11434`, with `OLLAMA_FLASH_ATTENTION=1` and
  `OLLAMA_KV_CACHE_TYPE=q8_0`.
- `ollama ps` after a call: `gpt-oss:20b  12 GB  100% GPU  CONTEXT 32768`.
  So Ollama already chose 32,768; `HINDSIGHT_API_LLM_OLLAMA_NUM_CTX=32768`
  matches it. Hindsight's source warns that a `num_ctx` different from the
  server default makes Ollama reload the model.
- Ollama unloads an idle model after 5 minutes by default. The next retain then
  waits for a reload (about 10 to 25 s). To keep it loaded longer, add
  `"keep_alive":"30m"` to `HINDSIGHT_API_LLM_EXTRA_BODY` (not tested; it holds
  12 GB of memory while loaded).
- The docs recommend models that can write at least 65,000 output tokens for
  reliable retain; gpt-oss:20b's context is 131,072, capped here at 32,768.
  Short retains worked. Very long single documents are untested.

### A mode that needs no LLM for retain

`retain_extraction_mode: "chunks"` (a bank setting) stores text as-is with no
LLM call (Source: `engine/retain/fact_extraction.py`: "chunks mode: skip LLM
entirely, store each chunk as-is"). The current toolkit's Hindsight adapter
(`claude-toolkit/plugins/second-brain/skills/knowledge-setup/references/memory-providers/hindsight.md`)
uses this mode so approved text is never rewritten. In `concise` mode (the
default, used in the test) gpt-oss rewrites each item into separate facts.
Either way, `get_document` returns the original text (`original_text`). Which
mode Toolkit V2 uses is an open question (section 16).

---

## 6. Where the data lives

| What | Where | Notes |
| --- | --- | --- |
| PostgreSQL binaries | `~/.pg0/installation/18.1.0/` | Installed by pg0 on first start in about 2 s, which suggests they are bundled in the pg0 binary rather than downloaded (not proven). |
| Database files | `~/.pg0/instances/<instance>/data/` | `<instance>` is the name in `pg0://<instance>`; the default `pg0` means `hindsight`. |
| Instance record | `~/.pg0/instances/<instance>/instance.json` | |
| Hugging Face models | `~/.cache/huggingface/hub/models--BAAI--bge-small-en-v1.5`, `.../models--cross-encoder--ms-marco-MiniLM-L-6-v2` | |
| Service log (proposed) | `~/.hindsight/logs/hindsight-api.log` | Set by the plist. |

Database connection details (Verified): user `hindsight`, password `hindsight`,
database `hindsight`, bound to `127.0.0.1`. pg0 picks the port itself: it took
**5432**, the standard PostgreSQL port. If Mike later installs another
PostgreSQL, the two can fight over 5432. A fixed port can be set with
`pg0://hindsight:<port>` (Source: `pg0.py`, `parse_pg0_url`; not tested).

`pgvector` is installed into the database automatically on first start
(log: "pgvector extension installed in public schema").

Useful `pg0` commands (full path, since it is not on `PATH`):

```zsh
PG0=~/.local/share/uv/tools/hindsight-api/lib/python3.12/site-packages/pg0/bin/pg0
$PG0 list                     # every instance, running or stopped, with port
$PG0 info --name hindsight    # pid, port, data dir, connection URI
$PG0 stop --name hindsight    # graceful stop (waits up to 60 s)
$PG0 logs --name hindsight
$PG0 psql --name hindsight
$PG0 drop --name <instance>   # DELETES the instance and all its data
```

Who stops PostgreSQL (Source: `engine/memory_engine.py`, around line 5020;
Verified): Hindsight stops PostgreSQL on a clean exit (SIGINT or SIGTERM) only
if that same Hindsight process started it. If Hindsight crashes or is killed,
PostgreSQL keeps running; the next Hindsight start reuses it and will then not
stop it on exit. This is harmless for a service that is always on, but a
"stop everything" script must also run `pg0 stop --name hindsight`.

---

## 7. Embeddings and reranker

- Both run inside the Hindsight process on the **CPU** (Verified log:
  "MPS (Apple Silicon GPU) is available but unsupported (leaks memory under
  variable-length workloads, aborts under concurrent inference); running on
  CPU."). The source (`engine/local_device.py`) says MPS is never selected and
  the old opt-in flags were removed.
- Embeddings: `local` provider, `BAAI/bge-small-en-v1.5`, 384 dimensions,
  through `sentence_transformers`.
- Reranker: `local` provider, `cross-encoder/ms-marco-MiniLM-L-6-v2`. Hindsight
  copies misaligned weights at load to avoid wrong scores (log warning "copied
  105/107 misaligned tensor(s)"); this is expected.
- Both download from Hugging Face on first start (Docs: about 130 MB and 85 MB)
  and are now cached. With `HF_HUB_OFFLINE=1` they load from the cache.
- Other fully local reranker choices (not tested):
  `HINDSIGHT_API_RERANKER_PROVIDER=flashrank` (ONNX, lighter) and
  `HINDSIGHT_API_RERANKER_PROVIDER=jina-mlx` (Apple GPU through MLX; its model
  file is licensed CC BY-NC 4.0, non-commercial). Both would download a new
  model once. Keep the default.
- Changing the embedding model after data exists needs a re-embed; use
  `hindsight-admin export-bank` and `import-bank` (embeddings are regenerated on
  import).

---

## 8. Telemetry and outbound network calls

### What the code does (Source)

- `grep` of `hindsight_api/` for `sentry`, `posthog`, `telemetry`,
  `analytics`, `mixpanel`, `amplitude`: no telemetry code. The only matches
  are Hindsight's own OpenTelemetry tracing and Prometheus metrics.
- OpenTelemetry tracing is off unless `HINDSIGHT_API_OTEL_TRACES_ENABLED=true`
  and an endpoint is set (`HINDSIGHT_API_OTEL_EXPORTER_OTLP_ENDPOINT`).
- Prometheus metrics are served locally at `GET /metrics`; nothing is pushed.
- FastMCP's telemetry is OpenTelemetry spans that do nothing unless an exporter
  is configured.
- Code paths that can reach the internet, all off in the recommended setup:
  cloud LLM, embedding, and reranker providers; the `iris` file parser
  (`https://api.vectorize.io/v1`); webhooks; the `ollama-cloud` provider
  (`https://ollama.com/v1`); LiteLLM's price-list download.
- Vendor statement (search result from vectorize.io): the self-hosted version
  has "no phone-home telemetry".

### What the network showed (Verified with `lsof` polling every 0.2 s)

| Run | Settings | Non-local connections |
| --- | --- | --- |
| First start (models not yet cached) | no `HF_HUB_OFFLINE` | `huggingface.co` (13.35.107.x:443) and one AWS us-east-1 address (52.22.60.52:443), probably Hugging Face file storage during the download (not proven) |
| Second start | no `HF_HUB_OFFLINE` | Only `huggingface.co` (13.35.107.108:443), two connections kept open after startup |
| Third start, plus retain and recall | `HF_HUB_OFFLINE=1` | **None** |

No connection to any vectorize.io, Sentry, or PostHog address was seen in any run.

### Lock-down checklist

1. `HINDSIGHT_API_HOST=127.0.0.1`.
2. `HINDSIGHT_API_LLM_PROVIDER=ollama` with a `127.0.0.1` base URL; never
   `ollama-cloud`, never a cloud provider.
3. `HF_HUB_OFFLINE=1` and `HF_HUB_DISABLE_TELEMETRY=1`.
4. `LITELLM_LOCAL_MODEL_COST_MAP=True`.
5. Do not set `HINDSIGHT_API_FILE_PARSER` to anything with `iris`, do not set
   `HINDSIGHT_API_WEBHOOK_URL`, do not enable OpenTelemetry.
6. Do not install `@vectorize-io/hindsight-coding-agents` (it defaults to
   Hindsight Cloud; section 14).

If a model ever needs to be re-downloaded (new machine, cleared cache), run the
server once with `HF_HUB_OFFLINE` unset, then set it back.

---

## 9. Running it as a macOS background service (launchd)

### 9.1 Proposed plist

File: `~/Library/LaunchAgents/local.toolkit-v2.hindsight.plist`. A user agent
(it runs when Mike is logged in, like the Homebrew Ollama service). A draft of
this exact file passed `plutil -lint`. It has **not** been loaded into launchd.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Label</key>
	<string>local.toolkit-v2.hindsight</string>

	<key>ProgramArguments</key>
	<array>
		<string>/Users/michaelrihm/.local/bin/hindsight-api</string>
	</array>

	<key>WorkingDirectory</key>
	<string>/Users/michaelrihm/.hindsight</string>

	<key>EnvironmentVariables</key>
	<dict>
		<key>HINDSIGHT_API_HOST</key>
		<string>127.0.0.1</string>
		<key>HINDSIGHT_API_PORT</key>
		<string>8888</string>
		<key>HINDSIGHT_API_DATABASE_URL</key>
		<string>pg0://hindsight</string>
		<key>HINDSIGHT_API_LLM_PROVIDER</key>
		<string>ollama</string>
		<key>HINDSIGHT_API_LLM_MODEL</key>
		<string>gpt-oss:20b</string>
		<key>HINDSIGHT_API_LLM_BASE_URL</key>
		<string>http://127.0.0.1:11434/v1</string>
		<key>HINDSIGHT_API_LLM_MAX_CONCURRENT</key>
		<string>2</string>
		<key>HINDSIGHT_API_LLM_OLLAMA_NUM_CTX</key>
		<string>32768</string>
		<key>HINDSIGHT_API_LLM_EXTRA_BODY</key>
		<string>{"think":"low"}</string>
		<key>HINDSIGHT_API_LLM_REASONING_EFFORT</key>
		<string>low</string>
		<key>HINDSIGHT_API_LLM_TIMEOUT</key>
		<string>300</string>
		<key>HINDSIGHT_API_RETAIN_MAX_COMPLETION_TOKENS</key>
		<string>16000</string>
		<key>HINDSIGHT_API_SKIP_LLM_VERIFICATION</key>
		<string>true</string>
		<key>HINDSIGHT_API_MCP_ENABLED_TOOLS</key>
		<string>retain,sync_retain,recall,reflect,list_documents,get_document,delete_document,list_memories,get_memory,list_tags,list_operations,get_operation,get_bank</string>
		<key>HINDSIGHT_API_LOG_LEVEL</key>
		<string>info</string>
		<key>HF_HUB_OFFLINE</key>
		<string>1</string>
		<key>HF_HUB_DISABLE_TELEMETRY</key>
		<string>1</string>
		<key>LITELLM_LOCAL_MODEL_COST_MAP</key>
		<string>True</string>
	</dict>

	<key>RunAtLoad</key>
	<true/>
	<key>KeepAlive</key>
	<true/>
	<key>ThrottleInterval</key>
	<integer>30</integer>
	<key>ExitTimeOut</key>
	<integer>30</integer>
	<key>SoftResourceLimits</key>
	<dict>
		<key>NumberOfFiles</key>
		<integer>8192</integer>
	</dict>

	<key>StandardOutPath</key>
	<string>/Users/michaelrihm/.hindsight/logs/hindsight-api.log</string>
	<key>StandardErrorPath</key>
	<string>/Users/michaelrihm/.hindsight/logs/hindsight-api.log</string>
</dict>
</plist>
```

Why each launchd key:

| Key | Why |
| --- | --- |
| `ProgramArguments` without `--daemon` | launchd must own the running process (section 2). |
| `WorkingDirectory` `~/.hindsight` | Hindsight looks for a `.env` upward from here. Keep this folder free of `.env` unless settings move there (9.4). |
| `EnvironmentVariables` | launchd does not read shell profiles. Every setting must be here (or in a `.env`). |
| `RunAtLoad` + `KeepAlive` | Start at login and restart after any exit. `launchctl bootout` is the way to stop it for good. |
| `ThrottleInterval` 30 | If it keeps failing, retry every 30 s instead of every 10 s. |
| `ExitTimeOut` 30 | Time between launchd's SIGTERM and SIGKILL. Clean shutdown took 2 to 3 s in the test, including stopping PostgreSQL. |
| `SoftResourceLimits.NumberOfFiles` 8192 | launchd jobs default to a low open-file limit (256). The embedded PostgreSQL is a child of this job and inherits the limit. Precaution; not tested. |
| `StandardOutPath` / `StandardErrorPath` | Absolute paths; launchd does not expand `~`. The `logs` folder must exist before loading. The log is not rotated; it grows. |

### 9.2 Install, check, restart, remove

```zsh
mkdir -p ~/.hindsight/logs
cp local.toolkit-v2.hindsight.plist ~/Library/LaunchAgents/
plutil -lint ~/Library/LaunchAgents/local.toolkit-v2.hindsight.plist
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/local.toolkit-v2.hindsight.plist

# Is it up? (about 10 s after start)
curl -s http://127.0.0.1:8888/health
launchctl print gui/$(id -u)/local.toolkit-v2.hindsight | head -20
tail -f ~/.hindsight/logs/hindsight-api.log

# Restart after changing settings in the plist:
launchctl bootout gui/$(id -u)/local.toolkit-v2.hindsight
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/local.toolkit-v2.hindsight.plist
# Restart without a settings change:
launchctl kickstart -k gui/$(id -u)/local.toolkit-v2.hindsight

# Stop and unload:
launchctl bootout gui/$(id -u)/local.toolkit-v2.hindsight
~/.local/share/uv/tools/hindsight-api/lib/python3.12/site-packages/pg0/bin/pg0 stop --name hindsight   # only if it is still running
rm ~/Library/LaunchAgents/local.toolkit-v2.hindsight.plist
```

Loading a LaunchAgent is a lasting change to Mike's machine. Per GOAL.md it is
part of finish item 8, so it is in scope, but the builder should say so when
doing it.

### 9.3 Behaviour to expect

- **Startup order.** The Ollama service and this service both start at login,
  in no fixed order. With `HINDSIGHT_API_SKIP_LLM_VERIFICATION=true`, Hindsight
  starts even if Ollama is not ready. Without it, startup raises
  "Connection verification failed for ollama/gpt-oss:20b", the process exits,
  and launchd retries after `ThrottleInterval`.
- **Ollama down later.** Recall keeps working (no LLM). Sync retain and reflect
  fail. Async retains stay queued and are retried by the worker
  (`HINDSIGHT_API_WORKER_MAX_RETRIES`, default 3).
- **Crash.** PostgreSQL survives; the restarted server reuses it (Verified).
- **Port 8888 busy.** Hindsight checks the port before its 10-second startup and
  exits with "Error: cannot bind 127.0.0.1:8888" after a 5-second grace wait.
- **Upgrades.** `uv tool upgrade hindsight-api`, then restart. Migrations run
  on startup. Back up first (section 15).

### 9.4 Alternative: settings in a `.env` file

Instead of `EnvironmentVariables`, the same lines can live in
`~/.hindsight/.env` (one `NAME=value` per line). Because `WorkingDirectory` is
`~/.hindsight`, Hindsight finds it at startup, and `.env` values override the
environment. The benefit is one editable file that `hindsight-admin` also uses
when run from `~/.hindsight`. The risk is that a `.env` elsewhere in the folder
chain would silently win. Pick one place, not both. The plist form is what was
tested (as exported variables).

---

## 10. HTTP API

Base URL `http://127.0.0.1:8888`. No authentication in the recommended setup.
Every route is under `/v1/default/...` ("default" is the tenant name). Full
OpenAPI is served by FastAPI at `/docs` and `/openapi.json` (standard FastAPI;
not checked).

### Service

```zsh
curl -s http://127.0.0.1:8888/health          # {"status":"healthy","database":"connected",...}
curl -s http://127.0.0.1:8888/health/ready
curl -s http://127.0.0.1:8888/health/live
curl -s http://127.0.0.1:8888/version         # {"api_version":"0.10.1","features":{...}}
```

### Banks

A bank is created automatically by its first write (retain or a config
change). Reads of a bank that does not exist return **404** (Verified for
`/config` and for recall).

```zsh
B=http://127.0.0.1:8888
BANK=my-project

# Create or update (PUT, not POST). Every body field is optional.
curl -s -X PUT "$B/v1/default/banks/$BANK" -H 'Content-Type: application/json' \
  -d '{"reflect_mission":"Memory for the my-project codebase.",
       "retain_mission":"Keep decisions, requirements, preferences, and project facts. Ignore chit-chat."}'

# List banks (most recently written first): {"banks":[...],"total":N,"limit":..,"offset":..}
curl -s "$B/v1/default/banks"

# Read settings: {"bank_id":..,"config":{...about 50 fields...},"overrides":{...only this bank's changes...}}
curl -s "$B/v1/default/banks/$BANK/config"

# Change settings. The body MUST wrap the fields in "updates".
curl -s -X PATCH "$B/v1/default/banks/$BANK/config" -H 'Content-Type: application/json' \
  -d '{"updates":{"retain_extraction_mode":"concise",
                  "mcp_enabled_tools":["retain","sync_retain","recall","reflect","list_documents","get_document"]}}'

# Remove all of this bank's setting changes (back to server defaults)
curl -s -X DELETE "$B/v1/default/banks/$BANK/config"

# Counts
curl -s "$B/v1/default/banks/$BANK/stats"

# Delete the bank and everything in it (cannot be undone)
curl -s -X DELETE "$B/v1/default/banks/$BANK"
```

`PUT` body fields (`CreateBankRequest`, `api/http.py` line 1919):
`reflect_mission`, `retain_mission`, `retain_extraction_mode`
(`concise` default, `verbose`, `custom`, `verbatim`, `chunks`),
`retain_custom_instructions`, `retain_chunk_size`,
`retain_structured_chunk_size`, `retain_max_attachments_per_chunk`, and more;
deprecated: `name`, `mission`, `background`, `disposition*`.

Config fields seen in the test: `retain_mission`, `reflect_mission`,
`mcp_enabled_tools`, `retain_extraction_mode`, `enable_observations`,
`retain_chunk_size`, and about 45 others. Docs also list
`observations_mission`, `entity_labels`, `memory_defense`,
`disposition_skepticism` / `_literalism` / `_empathy` (1 to 5).

### Retain

```zsh
# Synchronous: returns when stored (about 10-12 s per short item with gpt-oss:20b)
curl -s -X POST "$B/v1/default/banks/$BANK/memories" -H 'Content-Type: application/json' -d '{
  "items": [{
    "content": "Decision (2026-09-26): project memory lives in a local Hindsight bank.",
    "context": "decision",
    "document_id": "decision-memory-location",
    "tags": ["decision"],
    "metadata": {"source": "session"},
    "timestamp": "2026-09-26T14:00:00Z"
  }],
  "async": false
}'
# -> {"success":true,"bank_id":"my-project","items_count":1,"async":false,
#     "operation_id":null,"operation_ids":null,"usage":{"input_tokens":1895,"output_tokens":309,...}}

# Asynchronous: returns at once with an operation id
curl -s -X POST "$B/v1/default/banks/$BANK/memories" -H 'Content-Type: application/json' \
  -d '{"items":[{"content":"Mike prefers plain English explanations.","context":"preference"}],"async":true}'
# -> {"success":true,...,"async":true,"operation_id":"df4256d4-..."}

curl -s "$B/v1/default/banks/$BANK/operations/<operation_id>"
# -> {"status":"pending"} ... then {"status":"completed","result_metadata":{...}}  (or "failed")
```

Item fields (`MemoryItem`): `content` (required; a string, or a list of text
and image blocks), `timestamp` (ISO 8601, omitted = now, or `"unset"`),
`context`, `metadata` (string values only), `document_id` (items with the same
id form one document; a new retain with an existing id **replaces** it unless
`update_mode: "append"`), `entities`, `resolve_entities`, `tags`,
`observation_scopes`, `strategy`, `update_mode`.
Request fields: `items`, `async` (default `false`), `operation_id` (optional
UUID that makes a retry safe).

For hooks, prefer `"async": true`: the call returns in milliseconds and the
worker does the LLM work.

### Recall

```zsh
curl -s -X POST "$B/v1/default/banks/$BANK/memories/recall" -H 'Content-Type: application/json' \
  -d '{"query":"Where does project memory live?","budget":"low","max_tokens":1024}'
```

Request fields: `query` (required), `types` (`world`, `experience`,
`observation`; default all), `budget` (`low`, `mid` default, `high`),
`max_tokens` (default 4096), `tags`, `tags_match` (`any` default, `all`,
`any_strict`, `all_strict`, `exact`), `tag_groups`, `query_timestamp`,
`min_scores`, `temporal_window`, `include`, `trace`, `prefer_observations`.

Response keys (Verified): `results`, `trace`, `entities`, `chunks`,
`source_facts`, `source_facts_truncated`. Each result has `id`, `text`, `type`,
`entities`, `context`, `occurred_start`, `occurred_end`, `mentioned_at`,
`document_id`, `metadata`, `chunk_id`, `tags`, `source_fact_ids`, and scores.

### Reflect

```zsh
curl -s -X POST "$B/v1/default/banks/$BANK/reflect" -H 'Content-Type: application/json' \
  -d '{"query":"What has Mike decided about memory storage?","budget":"low"}'
# -> {"text":"...","based_on":...,"structured_output":null,"structured_output_error":null,"usage":...,"trace":...}
```

Fields: `query`, `budget` (default `low`), `max_tokens` (default 4096),
`include` (e.g. `{"facts":{}}`), `response_schema` (JSON Schema for structured
output), `tags`, `tags_match`. Took 25.6 s in the test.

### Documents

`GET /v1/default/banks/{bank_id}/documents`,
`GET /v1/default/banks/{bank_id}/documents/{document_id}`,
`PATCH` and `DELETE` on the same path,
`GET .../documents/{document_id}/chunks`,
`POST .../documents/{document_id}/reprocess`.

### Where the published docs are wrong for 0.10.1 (Verified)

| Docs say | Actually |
| --- | --- |
| `POST /v1/default/banks/{bank_id}` creates a bank | `POST` returns 405; use `PUT` |
| `PATCH .../config` with a flat body `{"retain_mission": "..."}` | Returns 422 `"Field required"` at `body.updates`; wrap in `{"updates": {...}}` |
| Data directory `~/.hindsight/data/` | `~/.pg0/instances/<instance>/data/` |
| Single-bank MCP mode has 27 tools | 36 tools on this version |

---

## 11. MCP server

### Endpoints (Source: `api/mcp.py`; Verified)

| URL | Mode | Tools |
| --- | --- | --- |
| `http://127.0.0.1:8888/mcp/<bank_id>/` | Single-bank. The bank comes from the URL. Tools have no `bank_id` argument and cannot reach other banks. | 36 on 0.10.1 |
| `http://127.0.0.1:8888/mcp/` | Multi-bank. Bank from the `X-Bank-Id` header, else env `HINDSIGHT_MCP_BANK_ID`, else `default`. Every tool takes an optional `bank_id`, and `list_banks`, `create_bank`, `get_bank_stats` are added. | all |

Use single-bank mode, one URL per project. Transport is MCP streamable HTTP,
stateful by default (`HINDSIGHT_API_MCP_STATELESS=false`). A `GET` without a
session id returns `200 {}` so Claude Code's probe does not fail. A missing
`Accept` header is filled in by the server. The bank id is the first path
segment, so a bank id must not contain `/`.

Single-bank tools on 0.10.1 (Verified `tools/list`):
`cancel_operation, clear_memories, clear_mental_model, create_directive,
create_knowledge_folder, create_knowledge_page, create_mental_model,
delete_bank, delete_directive, delete_document, delete_knowledge_node,
delete_mental_model, get_bank, get_document, get_knowledge_base_tree,
get_knowledge_page, get_memory, get_mental_model, get_operation,
invalidate_memory, list_directives, list_documents, list_memories,
list_mental_models, list_operations, list_tags, recall, reflect,
refresh_mental_model, retain, search_knowledge_base, sync_retain, update_bank,
update_knowledge_node, update_memory, update_mental_model`.

Tool arguments (Verified): `retain`: `content, context, timestamp, tags,
metadata, document_id, strategy, update_mode`. `recall`: `query, max_tokens,
budget, types, prefer_observations, tags, tags_match, tag_groups,
query_timestamp, min_scores, temporal_window`. `retain` is asynchronous;
`sync_retain` waits until stored. `update_bank` takes `name`, `mission`, and
`config_updates` (a dict of bank config fields).

### Limiting the tools (two layers)

1. **Server-wide:** `HINDSIGHT_API_MCP_ENABLED_TOOLS` (comma-separated). Only
   these tools are registered, for every bank. Proposed value:
   `retain,sync_retain,recall,reflect,list_documents,get_document,delete_document,list_memories,get_memory,list_tags,list_operations,get_operation,get_bank`.
   It leaves out `delete_bank`, `clear_memories`, `update_bank`,
   `invalidate_memory`, `update_memory`, and every mental-model, directive, and
   knowledge-page tool. `delete_document` stays because the current toolkit's
   adapter removes working entries with it; drop it if the new design does not
   need it. If agents must set bank settings, do it over REST at project init,
   not through `update_bank`.
2. **Per bank:** bank config field `mcp_enabled_tools` (a list). It can only
   narrow the server-wide list. Verified: after setting it, `tools/list`
   showed only those tools and calling another returned
   `"Unknown tool: 'clear_memories'"`.

Codex also has `enabled_tools` on its side (section 12.2).

### Tool descriptions nudge agents to save everything

The default `retain` description starts "Store important information to
long-term memory. Use this tool PROACTIVELY whenever the user shares: -
Personal facts, preferences, or interests ...", and `recall` says "Use this
tool PROACTIVELY". `HINDSIGHT_API_MCP_INSTRUCTIONS` can only **append** text
to both. If Toolkit V2 wants saves only through its own approved flow, its
rules must say so, or `retain`/`sync_retain` must be left out of the agent's
enabled tools and writes done by hooks over HTTP.

### `hindsight-local-mcp`

It is the full API server, not a stdio MCP program (Source: `mcp_local.py`).
The only difference from `hindsight-api` is the default database
`pg0://hindsight-mcp`, a **different** instance from `hindsight-api`'s default
`pg0://hindsight`. Running both would create two separate stores. Toolkit V2
should run only `hindsight-api` through launchd and point every client at its
`/mcp/<bank>/` URL.

### Authentication (optional, not tested)

Either `HINDSIGHT_API_MCP_AUTH_TOKEN=<token>` (MCP only) or the tenant API key
extension (HTTP and MCP; section 4). Clients then send
`Authorization: Bearer <token>`.

---

## 12. Connecting Claude Code and Codex

Replace `<bank>` with the project's bank id. Both files belong in the project
and can be committed (no secrets in the no-auth setup).

### 12.1 Claude Code

Project file `.mcp.json` at the project root (captured docs: `mcp.md`,
"Project scope"; `type` is required, an entry with `url` and no `type` fails):

```json
{
  "mcpServers": {
    "hindsight": {
      "type": "http",
      "url": "http://127.0.0.1:8888/mcp/<bank>/",
      "timeout": 300000
    }
  }
}
```

Or the equivalent command, run in the project folder:

```zsh
claude mcp add --transport http --scope project hindsight http://127.0.0.1:8888/mcp/<bank>/
```

Notes from the captured docs (`ai-external-knowledge/claude-code/mcp.md`):

- `"timeout"` is a per-server tool timeout in milliseconds. `sync_retain` and
  `reflect` take 10 to 30 s locally, longer with a cold model; 300000 (5 min)
  leaves room.
- Claude Code asks once, in an interactive session, before using a project
  `.mcp.json` server. `claude mcp list` shows `⏸ Pending approval` until then.
  Approval can also come from `enabledMcpjsonServers: ["hindsight"]` in a
  settings file that is **not** committed (for example
  `.claude/settings.local.json`), after the workspace is trusted. A committed
  approval is ignored in an untrusted folder.
- In `claude -p` and Agent SDK runs, project servers load without asking.
- `${VAR}` and `${VAR:-default}` expand in `url` and `headers`, for example
  `"url": "${HINDSIGHT_URL:-http://127.0.0.1:8888}/mcp/<bank>/"`.
- If a key is added later: `"headers": {"Authorization": "Bearer ${HINDSIGHT_API_KEY}"}`.
- Check with `claude mcp get hindsight` or `/mcp`. Tools appear as
  `mcp__hindsight__recall`, `mcp__hindsight__sync_retain`, and so on.
- Use the name `hindsight` in one scope only; the same name in user and project
  scope with different URLs produces a conflict warning.

### 12.2 Codex

Codex reads MCP servers from `~/.codex/config.toml` (global) and from
`.codex/config.toml` inside a project (trusted projects only). Source:
`https://learn.chatgpt.com/docs/extend/mcp?surface=cli` (redirect target of
`developers.openai.com/codex/mcp`), fetched 2026-09-26. The captured Codex docs
in `claude-toolkit/ai-external-knowledge/codex/` cover only `AGENTS.md`.

Project file `.codex/config.toml`:

```toml
[mcp_servers.hindsight]
url = "http://127.0.0.1:8888/mcp/<bank>/"
tool_timeout_sec = 300
startup_timeout_sec = 20
enabled_tools = ["recall", "reflect", "sync_retain", "retain", "list_documents", "get_document"]
```

Keys available for HTTP servers: `url` (required), `bearer_token_env_var`,
`http_headers`, `env_http_headers`, `enabled_tools`, `disabled_tools`,
`startup_timeout_sec` (default 10), `tool_timeout_sec` (default **60**, too
short for a cold-model `sync_retain`), `enabled`, `required`.

`codex mcp add hindsight --url http://127.0.0.1:8888/mcp/<bank>/` writes to
the **global** `~/.codex/config.toml`, which would send every project to one
bank. Write the project file instead. The model project already has a
`.codex/` folder (with `hooks.json`).

---

## 13. One bank per project

### Recommendation

- At project init, choose a bank id once and write it into a committed project
  file. Every later reader (hooks, skills, `.mcp.json`, `.codex/config.toml`)
  takes the id from there.
- Never compute the id at run time from the folder path or name. Mike moves and
  renames folders, and GOAL.md says the agent must carry on when he does. A
  stored id survives a move; a derived one silently opens a new, empty bank.
- Linked git worktrees then share the bank automatically, because they share
  the committed file. (The official coding-agent plugin gets the same effect by
  naming the bank after `git rev-parse --git-common-dir`, but that breaks on a
  rename.)

### Id format

- Lowercase letters, digits, and hyphens, starting with a letter, for example
  `acme-crm` or `proj-acme-crm`. No `/` (it breaks the MCP URL), no spaces, and
  nothing that needs URL escaping.
- The server does not validate ids: `proj:tkv2-colon-test` was accepted
  (Verified), and the bank id column is unlimited text. The rule above is ours.

### Where to store it

The model project already has `.toolkit-memory.json` at its root:

```json
{ "schema": 2, "memory": "second-brain-v2", "location": ".memory", "activeWriter": "memory-curator" }
```

The current toolkit's Hindsight adapter used `.toolkit-memory.json` with
`"service": "hindsight"`, `"server": "hindsight"` (the MCP server name), and
`"project": "<bank id>"`. A Hindsight variant for Toolkit V2 could be:

```json
{ "schema": 2, "memory": "hindsight", "server": "hindsight", "bank": "acme-crm", "url": "http://127.0.0.1:8888" }
```

The exact shape is the architect's call.

### Creating the bank at project init

1. Pick a candidate id from the project name.
2. Check it is free: `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8888/v1/default/banks/<id>/config`
   returns `404` for a free id. If it returns `200`, another project owns it;
   add a suffix and check again. (This follows the parallel-sessions rule about
   claiming identifiers.)
3. Claim it at once with `PUT /v1/default/banks/<id>` and the missions.
4. Set the bank config with `PATCH .../config` `{"updates": {...}}`
   (extraction mode, `mcp_enabled_tools`).
5. Write the id into the project config file, `.mcp.json`, and
   `.codex/config.toml`.
6. Test: one `sync_retain` or HTTP retain, then one recall that finds it.

If the server is not running at init, stop and report; do not write a config
that points at a bank that does not exist yet (a write would create it later,
but the collision check would be skipped).

---

## 14. Things not to use

| Thing | Why |
| --- | --- |
| Hindsight Cloud (`https://api.hindsight.vectorize.io`) | Mike's rule. |
| `npx @vectorize-io/hindsight-coding-agents install claude-code` (or `codex`) | Its default server is Hindsight Cloud. It edits the **global** `~/.claude/settings.json` (three hooks: SessionStart seeds memory from git history, UserPromptSubmit injects recalled memory with a 30 s timeout, Stop saves session transcripts) and `~/.codex/hooks.json` plus `config.toml`, and keeps settings in `~/.hindsight/coding-agent.json`. It would overlap Toolkit V2's own hooks. The current toolkit already says never to install it or the `hindsight-memory` plugin. |
| `hindsight-embed` daemon (`127.0.0.1:9077`) | Used by that plugin's "daemon" mode; needs a cloud LLM key per its docs. |
| `HINDSIGHT_API_LLM_PROVIDER=ollama-cloud` | Talks to `https://ollama.com/v1`. |
| Docker images | Mike's rule; Docker on a Mac cannot use the GPU. |
| `hindsight-api --daemon` under launchd | Parent exits at once; launchd restarts it in a loop. |
| `hindsight-local-mcp` | Second, separate database; not an MCP adapter. |
| `hindsight-worker` | Not needed; the API process has a worker. |
| `HINDSIGHT_API_RERANKER_PROVIDER=jina-mlx` | Non-commercial model license; downloads a new model. |

---

## 15. Operations

- **Health for hooks and scripts:** `curl -s -m 2 http://127.0.0.1:8888/health`.
  A hook should treat a failure as "memory unavailable" and carry on, not block
  the session.
- **Backup of everything:** `hindsight-admin backup <file>.zip` (option
  `--schema`, default `public`). It reads the same settings as the server, so
  run it with the same `HINDSIGHT_API_DATABASE_URL` (or from `~/.hindsight` if
  settings live in a `.env` there). Not tested.
- **Restore:** `hindsight-admin restore` ("WARNING: This deletes all existing
  data").
- **One bank to a file:** `hindsight-admin export-bank --bank <id> --output <file>.zip`
  (no embeddings; they are rebuilt on `import-bank`).
- **Rename a bank:** `hindsight-admin rename-bank` keeps every memory. Useful if
  a project's id must change.
- **Upgrade:** back up, `uv tool upgrade hindsight-api`, restart the service,
  check `/version`. Migrations run automatically.
- **Resource use:** about 1 GB for Hindsight plus PostgreSQL, 12 GB for
  gpt-oss:20b while loaded.
- **Logs:** `~/.hindsight/logs/hindsight-api.log` (plist), Ollama's at
  `/opt/homebrew/var/log/ollama.log`.

---

## 16. Open questions

1. **Extraction mode.** `concise` (default; gpt-oss rewrites items into facts,
   about 10 s per retain, gives better recall and reflect) or `chunks` (no LLM,
   instant, stores text exactly, what the current toolkit adapter uses). The
   choice affects how much gpt-oss is needed at all.
2. **Who writes memory.** Agents through MCP `sync_retain`, hooks through HTTP,
   or both? This decides the server-wide `HINDSIGHT_API_MCP_ENABLED_TOOLS` list
   and whether `retain`/`delete_document` stay exposed.
3. **Authentication.** No key (simpler; any local program can read memories) or
   a tenant API key (every client config then carries a header).
4. **PostgreSQL port.** Keep pg0's automatic choice (it took 5432) or pin an
   unusual port with `pg0://hindsight:<port>` to avoid a clash with a future
   PostgreSQL install. The pinned form was not tested.
5. **Ollama keep-alive.** Accept the 5-minute unload (slow first retain after a
   break) or keep gpt-oss loaded longer with `"keep_alive"` in
   `HINDSIGHT_API_LLM_EXTRA_BODY` at the cost of 12 GB held.
6. **Test data.** The research instance `hindsight-v2-research` (stopped,
   49 MB) can be dropped or kept; dropping deletes data, so it needs a yes.
7. **Settings location.** Plist `EnvironmentVariables` (tested form) or
   `~/.hindsight/.env` (one file shared with `hindsight-admin`).
8. **Long documents.** Retain of long texts with a 32,768-token context and
   `RETAIN_MAX_COMPLETION_TOKENS=16000` is untested.

---

## Sources

- Installed package: `~/.local/share/uv/tools/hindsight-api/lib/python3.12/site-packages/hindsight_api/`
  (`main.py`, `daemon.py`, `mcp_local.py`, `pg0.py`, `config.py`, `api/http.py`,
  `api/mcp.py`, `mcp_tools.py`, `engine/providers/openai_compatible_llm.py`,
  `engine/llm_wrapper.py`, `engine/local_device.py`, `engine/embeddings.py`,
  `engine/cross_encoder.py`, `engine/memory_engine.py`,
  `engine/retain/fact_extraction.py`, `tracing.py`, `metrics.py`), and
  `hindsight_api_slim-0.10.1.dist-info/METADATA`.
- `--help` output of `hindsight-api`, `hindsight-worker`, `hindsight-admin`,
  `hindsight-admin backup`, `hindsight-admin export-bank`, `pg0`, `pg0 start`,
  `pg0 stop`.
- Docs pages fetched 2026-09-26: `hindsight.vectorize.io/developer/installation`,
  `/developer/configuration`, `/developer/models`, `/developer/monitoring`,
  `/developer/mcp-server`, `/developer/api/memory-banks`,
  `/developer/api/retain`, `/developer/api/recall`,
  `/sdks/integrations/coding-agents`.
- Codex MCP docs: `https://learn.chatgpt.com/docs/extend/mcp?surface=cli`.
- Claude Code MCP docs (captured 2026-09-22):
  `claude-toolkit/ai-external-knowledge/claude-code/mcp.md`.
- Current toolkit adapter:
  `claude-toolkit/plugins/second-brain/skills/knowledge-setup/references/memory-providers/hindsight.md`
  and `.../memory-providers/README.md`.
- Model project: `toolkit-v2-model-project/.toolkit-memory.json`,
  `.codex/hooks.json`.
- Live tests on this Mac, 2026-09-26 14:13 to 14:24 local time.

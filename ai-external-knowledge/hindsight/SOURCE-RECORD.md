# Hindsight documentation: the memory server, its HTTP API, and the coding-agents add-on

- Publisher: Vectorize (the Hindsight project, `vectorize-io/hindsight`, Apache-2.0 for the source files)
- Original documentation home: https://hindsight.vectorize.io
- Captured on: 2026-10-05
- Captured with: the Firecrawl CLI 1.24.3. The documentation pages with `firecrawl scrape <page URL> --format markdown --only-main-content -o <file>`, because the site publishes no Markdown source for its pages (a request for `<page URL>.md` answers 404). The GitHub files with `curl` from `https://raw.githubusercontent.com/vectorize-io/hindsight/b89ce287464fe10790d67ba86bfabe29d8926253/<path>`. The OpenAPI file with `curl https://hindsight.vectorize.io/openapi.json`.
- Hindsight version on the capture date: 0.10.2 (the latest GitHub release, published 2026-09-29, and the `info.version` of `openapi.json`). The GitHub files are pinned to commit `b89ce287464fe10790d67ba86bfabe29d8926253`, the head of `main` on 2026-10-05 (committed 2026-10-05T20:31:04Z). The coding-agents add-on is version 0.8.0 (`package.json` at that commit, and `npm view @vectorize-io/hindsight-coding-agents version` on 2026-10-05).
- Pages: 43 documentation pages, 8 GitHub files, and 1 OpenAPI file
- Redistribution: published documentation, kept here as a private reference copy for this repository. Nothing here is shipped in any plugin.

## Project use

Read before writing or changing the Toolkit V2 Hindsight skill and its setup steps (`plugins/toolkit/skills/project-setup/references/hindsight-on-vps.md`): the tools the add-on gives an agent, the core operations, how a memory bank is made and mapped to a project folder, how the server is set up, and how a memory is changed or deleted. The owner's own server guide is `dev/research/hindsight-server-setup-guide.md`.

## Coverage

Documentation pages (Firecrawl, main content). Every page starts with a header naming its address and capture date. Links inside the pages are kept as published.

| File | Page | Source |
| --- | --- | --- |
| `coding-agents-integration.md` | Coding agents add-on: the docs-site version of the README (install, settings, banks, knowledge pages) | https://hindsight.vectorize.io/sdks/integrations/coding-agents |
| `claude-code-integration.md` | Older per-agent Claude Code plugin (`hindsight-memory`), superseded by the add-on; shows the old settings | https://hindsight.vectorize.io/sdks/integrations/claude-code |
| `codex-integration.md` | Older per-agent Codex plugin, superseded by the add-on; has the `codex_hooks` note | https://hindsight.vectorize.io/sdks/integrations/codex |
| `skills-integration.md` | Hindsight agent skills (install skill, docs skill) | https://hindsight.vectorize.io/sdks/integrations/skills |
| `local-mcp-integration.md` | Local MCP server integration | https://hindsight.vectorize.io/sdks/integrations/local-mcp |
| `mcp-server.md` | Hindsight MCP server: tools, per-bank URL, authentication | https://hindsight.vectorize.io/developer/mcp-server |
| `api-quickstart.md` | Quick start: install, start the server, first retain, recall, reflect | https://hindsight.vectorize.io/developer/api/quickstart |
| `api-main-methods.md` | Overview of retain, recall, and reflect | https://hindsight.vectorize.io/developer/api/main-methods |
| `api-retain.md` | Retain: store memories, `document_id` upsert, async operations, tags, strategies | https://hindsight.vectorize.io/developer/api/retain |
| `api-recall.md` | Recall: types, budgets, filters, tags, token limits | https://hindsight.vectorize.io/developer/api/recall |
| `api-reflect.md` | Reflect: agentic answer over memory, budgets, directives | https://hindsight.vectorize.io/developer/api/reflect |
| `api-memory-banks.md` | Memory banks: create, aliases, configuration fields, directives, export, import, clone | https://hindsight.vectorize.io/developer/api/memory-banks |
| `api-memories.md` | Memories: list, get, curate (edit or invalidate), clear | https://hindsight.vectorize.io/developer/api/memories |
| `api-documents.md` | Documents: list, get, update, delete | https://hindsight.vectorize.io/developer/api/documents |
| `api-operations.md` | Operations: list, get, cancel, retry for background work | https://hindsight.vectorize.io/developer/api/operations |
| `api-mental-models.md` | Mental models: create, refresh, triggers | https://hindsight.vectorize.io/developer/api/mental-models |
| `api-knowledge-pages.md` | Knowledge pages API: tree, pages, search, export | https://hindsight.vectorize.io/developer/api/knowledge-pages |
| `api-bank-templates.md` | Bank templates: import a bank configuration | https://hindsight.vectorize.io/developer/api/bank-templates |
| `api-webhooks.md` | Webhooks: events and deliveries | https://hindsight.vectorize.io/developer/api/webhooks |
| `concept-retain.md` | How retain works: extraction modes, facts, entities, chunks | https://hindsight.vectorize.io/developer/retain |
| `concept-retrieval.md` | How recall searches: semantic, keyword, graph, temporal, reranking | https://hindsight.vectorize.io/developer/retrieval |
| `concept-reflect.md` | How reflect works | https://hindsight.vectorize.io/developer/reflect |
| `concept-observations.md` | Observations: consolidated beliefs, scopes, enabling and disabling | https://hindsight.vectorize.io/developer/observations |
| `concept-mental-models.md` | Mental models: concept | https://hindsight.vectorize.io/developer/mental-models |
| `concept-knowledge-pages.md` | Knowledge pages: concept | https://hindsight.vectorize.io/developer/knowledge-pages |
| `concept-memory-defense.md` | Memory defense: protection against poisoned memories | https://hindsight.vectorize.io/developer/memory-defense |
| `configuration.md` | Every server environment variable, including auth, LLM provider, Ollama, control plane keys, hierarchical bank configuration | https://hindsight.vectorize.io/developer/configuration |
| `models.md` | Models: LLM, embedding, and reranker providers, local models and Ollama | https://hindsight.vectorize.io/developer/models |
| `installation.md` | Installation and self-hosting: Docker, bare metal, control plane, resource guidance | https://hindsight.vectorize.io/developer/installation |
| `services.md` | Services: API, worker, control plane | https://hindsight.vectorize.io/developer/services |
| `storage.md` | Storage: PostgreSQL and file storage | https://hindsight.vectorize.io/developer/storage |
| `performance.md` | Performance guidance: speed, memory use, tuning | https://hindsight.vectorize.io/developer/performance |
| `monitoring.md` | Monitoring: metrics, tracing, health endpoints | https://hindsight.vectorize.io/developer/monitoring |
| `extensions.md` | Extensions: tenant (authentication) and other extension points | https://hindsight.vectorize.io/developer/extensions |
| `admin-cli.md` | Admin CLI (`hindsight-admin`) | https://hindsight.vectorize.io/developer/admin-cli |
| `sdk-cli.md` | Hindsight command-line client (`hindsight` bank, retain, recall commands) | https://hindsight.vectorize.io/sdks/cli |
| `sdk-python.md` | Python client | https://hindsight.vectorize.io/sdks/python |
| `sdk-nodejs.md` | Node.js and TypeScript client | https://hindsight.vectorize.io/sdks/nodejs |
| `best-practices.md` | Best practices | https://hindsight.vectorize.io/best-practices |
| `faq.md` | Frequently asked questions | https://hindsight.vectorize.io/faq |
| `templates.md` | Bank templates gallery | https://hindsight.vectorize.io/templates |
| `changelog-coding-agents.md` | Changelog of the coding-agents add-on | https://hindsight.vectorize.io/changelog/integrations/coding-agents |
| `changelog.md` | Changelog of Hindsight core (API, CLI, control plane), every release | https://hindsight.vectorize.io/changelog |

GitHub files (the add-on README and companion skill are Markdown; the three `source-*` files and the compose file are wrapped in a code block).

| File | What it is | Source |
| --- | --- | --- |
| `coding-agents-readme.md` | Coding-agents add-on README (package `@vectorize-io/hindsight-coding-agents` 0.8.0) | https://github.com/vectorize-io/hindsight/blob/b89ce287464fe10790d67ba86bfabe29d8926253/hindsight-integrations/coding-agents/README.md |
| `coding-agents-skill.md` | The companion skill the add-on installs (generated) | https://github.com/vectorize-io/hindsight/blob/b89ce287464fe10790d67ba86bfabe29d8926253/hindsight-integrations/coding-agents/skill/SKILL.md |
| `coding-agents-skill-preamble.md` | Agent-facing half of that skill | https://github.com/vectorize-io/hindsight/blob/b89ce287464fe10790d67ba86bfabe29d8926253/hindsight-integrations/coding-agents/skill-src/preamble.md |
| `source-coding-agents-knowledge-tools.ts.md` | Source: the definition of every tool the add-on gives the agent | https://github.com/vectorize-io/hindsight/blob/b89ce287464fe10790d67ba86bfabe29d8926253/hindsight-integrations/coding-agents/src/core/knowledge-tools.ts |
| `source-coding-agents-mcp-server.ts.md` | Source: the add-on's MCP server | https://github.com/vectorize-io/hindsight/blob/b89ce287464fe10790d67ba86bfabe29d8926253/hindsight-integrations/coding-agents/src/mcp-server.ts |
| `source-coding-agents-session-start.ts.md` | Source: the SessionStart hook | https://github.com/vectorize-io/hindsight/blob/b89ce287464fe10790d67ba86bfabe29d8926253/hindsight-integrations/coding-agents/src/core/session-start.ts |
| `local-llm-readme.md` | Local llama.cpp sidecar example README (not Ollama) | https://github.com/vectorize-io/hindsight/blob/b89ce287464fe10790d67ba86bfabe29d8926253/docker/docker-compose/local-llm/README.md |
| `local-llm-docker-compose.yaml.md` | The compose file of that example | https://github.com/vectorize-io/hindsight/blob/b89ce287464fe10790d67ba86bfabe29d8926253/docker/docker-compose/local-llm/docker-compose.yaml |

The HTTP API reference:

| File | What it is | Source |
| --- | --- | --- |
| `openapi.json` | The OpenAPI 3 specification of the Hindsight HTTP API, 77 paths (banks, memories, recall, reflect, documents, operations, mental models, knowledge base, directives, webhooks, export and import, health, version). Saved with indentation added (2 spaces) so a line search works; no value changed. It has no header, because JSON allows none. | https://hindsight.vectorize.io/openapi.json |

## Notes

- `https://hindsight.vectorize.io/llms.txt` is out of date for this purpose (it lists a `POST /v1/default/banks` endpoint that `openapi.json` does not have), so it was used only to find the pages. The complete current text is also at https://hindsight.vectorize.io/llms-full.txt (about 960 KB, not stored).
- The rendered API reference page https://hindsight.vectorize.io/api-reference (about 9,000 lines) was not stored: it shows the same content as `openapi.json`, which is stored instead.
- The documentation site also keeps older versions under `/0.9/` and `/0.8/` and `/0.7/`. Only the current pages (no version prefix) were captured.
- Not captured, on purpose: marketing pages, blog posts, the `/guides` and `/cookbook` pages, the pages of the other agent and framework integrations (`/sdks/integrations/<name>`), the Hindsight Cloud pages, and the developer pages on multilingual use, development, Oracle storage, and "RAG vs Hindsight". The blog posts https://hindsight.vectorize.io/blog/2026-08-13-knowledge-pages-coding-agents and https://hindsight.vectorize.io/blog/2026-09-02-coding-agents-050-four-new-harnesses describe the add-on's knowledge pages and its 0.5.0 release; they were not captured.
- The dashboard is called the Control Plane in the documentation. There is no separate dashboard page: it is described in `services.md`, `installation.md` (standalone with `npx`), and `configuration.md` (the `HINDSIGHT_CP_*` settings, including `HINDSIGHT_CP_ACCESS_KEY`). The documentation does not state the address form of one bank's page; the source tree has a `banks/[bankId]` page in `hindsight-control-plane/src/app/[locale]/`.
- The folder `docker/docker-compose/local-llm/` runs a llama.cpp server beside Hindsight, not Ollama. No page captured here has a compose example for Ollama; the Ollama settings are in `configuration.md` and `models.md`.
- The older per-agent plugins (`claude-code-integration.md`, `codex-integration.md`) are superseded by the coding-agents add-on (see "Migrating from the per-agent plugins" in `coding-agents-readme.md`). They are kept because the toolkit's setup steps look for them on a computer.
- `source-coding-agents-session-start.ts.md` and the other two `source-*` files were added to confirm from the code what the documentation says about the tools and the start of a session. They are not documentation.

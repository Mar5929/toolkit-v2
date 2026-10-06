# Local memory tools: would one fill the gap?

Date: 2026-10-05. Work item: TKV-24. The owner asked whether a memory tool
that runs on his Mac could fill the gap the memory scenario test found
(`MEMORY-SCENARIOS.md`), in a project with no Hindsight. A separate agent
read each tool's current pages today. Nothing was installed or run.

## His limits

The data stays on the Mac. It works in Claude Code and Codex, or does no
harm in the other. No language model server on the Mac. He can open the
stored memory and read or edit it; plain Markdown is best. It must not
become a second copy of decisions, system rules, or work item status.
Little to install; nothing that breaks a session.

## The seven gaps

1. A fact that fits no file. 2. Something saved and never shown again.
3. No record of what was done lately across the project. 4. Recurring jobs
and shared files have no record. 5. Upcoming dated events. 6. Current State
only knows work items and its next-step line goes stale. 7. A lesson is not
read at the moment it matters.

## Result

Recommended: no tool now. Build memory as four small Markdown parts (a
wider Current State, a dated activity log, short dated notes for facts with
no other home, and the links), all printed at session start. Gaps 2, 4, 5,
and 6 need a page with the right sections printed at the start of a session,
and every tool prints its own brief from its own note types instead.

| Tool (latest release) | Local | Both products | Own model needed | Files he can edit | Install | Gaps closed | Second copy risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Four Markdown parts (no tool) | Yes | Both | No | Markdown | Nothing | 1, 2, 6; partly 3, 4, 5, 7 | None |
| Basic Memory 0.23.2 (2026-08-25) | Yes | Both | No; small bundled search model | Markdown | `uv`; an index file | 1; partly 2, 3, 7 | High with its plugin; low as an MCP server only |
| memsearch 0.4.21 (2026-09-24) | Yes | Both | Uses the agent's model | One Markdown file per day | `uv`; a 558 MB model | 3; partly 1, 7 | Medium |
| claude-obsidian 2.2.0 (2026-09-10) | Yes | Claude Code; a script for Codex | No | Markdown vault | Python 3.11 | partly 1, 2, 7 | High |
| claude-mem 13.31.0 (2026-10-05) | Hosted by default | Both listed | Yes; can use his Claude plan | No (a database) | Node, Bun, uv; a background worker | 3; partly 1, 7 | High |
| Hindsight local mode 0.10.2 | Yes | Both | Can use his plan | No (a database) | A local daemon; 215 MB of models | 1, mostly 7; partly 2, 3, 5 | High |
| Claude Code auto memory (built in) | Yes | Claude Code only | No | Markdown in `~/.claude/projects/<project>/memory/` | Nothing; on by default | partly 1, 2, 4, 5, 7 | Medium |
| Codex memories (built in) | Yes | Codex only | Codex's own | Not for hand edits | Nothing; off by default | partly 1, 7 | Medium |
| MCP "memory" server | Yes | Both | No | One JSONL file | `npx` | partly 1 | Medium |
| Mem0 open source 2.2.1 | Needs a model key or Ollama | | Yes: ruled out | No | | | |
| Graphiti 0.30.2 | Needs a graph database and a model key | | Yes: ruled out | No | | | |
| Letta | Cloud by default; it is its own agent | | Ruled out | | | | |

## Facts behind the table

- Basic Memory: Markdown notes plus a local index; search by meaning with a
  small local model and no key. Its Claude Code plugin prints a brief at
  session start and adds its own `decision` and `task` note types, which
  would be a second copy of `DECISIONS.md` and work items. As an MCP server
  only, pointed at a notes folder, it adds search by meaning and nothing
  else. AGPL-3.0; free locally.
- memsearch: a hook summarises each turn with the agent's own model and
  appends it to that day's Markdown file; the newest two days are shown at
  session start. Open bugs that match the owner's way of working: chats
  running at once mix their lines in the day file (#727); removing a
  worktree leaves a process running (#692); the summary call fires the
  session-start hook (#520). On Codex its page asks for the sandbox bypass
  flag.
- claude-obsidian: saving is by a command, not by itself; session start is
  silent unless a setting is on; search is by keyword.
- claude-mem: the hosted option is pre-selected; three releases in two days.
- Hindsight local mode: can run on his Claude or ChatGPT plan with no key;
  the only tool here that brings a lesson back by itself at the moment it
  matters. The data is in a database, not files.
- Claude Code auto memory is on by default and keeps "ongoing work,
  deadlines, and decisions" in a folder Codex never reads.
  `autoMemoryEnabled: false` turns it off for a project;
  `autoMemoryDirectory` can move the folder.
- Mem0's OpenMemory was removed from the Mem0 repository on 2026-07-29.

## What would change the recommendation

- The activity log has holes after a few weeks because the agent forgets to
  write it: an automatic saver is then worth it (memsearch, once the three
  bugs above are closed).
- The notes outgrow what can be printed at session start and keyword search
  misses things: add Basic Memory as an MCP server only, with no plugin,
  pointed at the notes folder.

## One decision needed either way

Claude Code auto memory is already on. Either turn it off in each project's
settings, or point it at the project's notes folder (that needs a test).

## Not found out

Whether memsearch's summary call works in the desktop app and what it costs
per day; where Hindsight local mode keeps its database; whether Codex
memories are kept per project. Nothing was run: all of this is from pages.

## Sources read on 2026-10-05

github.com/basicmachines-co/basic-memory and docs.basicmemory.com;
github.com/zilliztech/memsearch; github.com/AgriciDaniel/claude-obsidian;
github.com/thedotmack/claude-mem and docs.claude-mem.ai;
github.com/vectorize-io/hindsight and hindsight.vectorize.io;
code.claude.com/docs/en/memory; learn.chatgpt.com/docs/customization/memories;
github.com/modelcontextprotocol/servers (memory); github.com/mem0ai/mem0;
github.com/getzep/graphiti; github.com/letta-ai/letta.

## Status

The owner has not decided.

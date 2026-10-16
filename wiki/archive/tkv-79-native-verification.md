# TKV-79 native host verification

Toolkit 0.9.91 passed the native loading, scratch plugin installation, startup, local-memory compaction, and read-only lifecycle checks below. The tests ran on October 13, 2026, at about 9:02–9:11 p.m. America/New_York (October 14 UTC). They used the integrated tree at `/Users/michaelrihm/Projects/toolkit-v2/.claude/worktrees/tkv-79-review-fixes`, including the phase 7 fixes present in its working tree.

## Products and isolation

- Codex CLI: 0.162.1.
- Claude Code: 2.1.296.
- Node: v25.8.1. Python: 3.14.7. Git: 2.54.0 (Apple Git-157).
- Scratch files, homes, fixtures, streams, and scripts: `/tmp/tkv79-native/`.
- Claude used a scratch `CLAUDE_CONFIG_DIR`, only project settings, an empty strict MCP configuration, and narrowly selected tools. Existing Claude account authentication was passed through an in-memory environment variable, without a credential file or secret output.
- Codex used a private mode-0700 scratch `CODEX_HOME`, a mode-0600 temporary copy of its account auth file, and the read-only sandbox. The credential copy was removed after the tests. The original auth file's SHA-256 stayed unchanged.
- Project trust was recorded only in the scratch Codex home. Native runs used the documented one-off `--dangerously-bypass-hook-trust` option for the previously vetted scratch hook files. No approvals/sandbox bypass option was used. Owner settings, global trust, hooks, memory, Notion records, Salesforce data, and installed plugins were not changed.

## Native plugin installation and discovery

These real native commands succeeded against the integration checkout:

```text
CODEX_HOME=/tmp/tkv79-native/codex-home codex plugin marketplace add /Users/michaelrihm/Projects/toolkit-v2/.claude/worktrees/tkv-79-review-fixes --json
CODEX_HOME=/tmp/tkv79-native/codex-home codex plugin add toolkit@toolkit-v2 --json
CODEX_HOME=/tmp/tkv79-native/codex-home codex plugin remove toolkit@toolkit-v2
CODEX_HOME=/tmp/tkv79-native/codex-home codex plugin add toolkit@toolkit-v2 --json
```

The final install returned version `0.9.91` and `/private/tmp/tkv79-native/codex-home/plugins/cache/toolkit-v2/toolkit/0.9.91`. Codex's native app-server `skills/list` request, after `initialize`, confirmed that a blank scratch project loaded only `toolkit:project-setup` from this plugin. The nested starter skills did not leak into the plugin's skill catalog. Built-in and existing global `~/.agents/skills` entries were identifiable separately and remained untouched.

Claude Code's native `--plugin-dir` session loaded version `0.9.91`. Its machine-readable initialization stream likewise listed only `toolkit:project-setup` from the plugin, alongside product built-ins. Evidence: `final-skills.json` and `final-claude-plugin.jsonl` in the scratch directory.

The scratch authoring-exclusions fixture used the repository's actual `.claude/settings.json` and prompt hook with the eleven copied project skills physically present. Claude's initialization stream listed none of those disabled starter skills. This exercises `skillOverrides`; the `claudeMdExcludes` patterns were inspected, but nested guide exclusion was not independently exercised by a native file-access scenario. Evidence: `final-claude-author-exclusions.jsonl`.

## Assembled project and fresh-session checks

The local fixture copied `every-project/`, the local work-item choice, the local memory choice, and repository-records files. Its `.agents/skills` symlink was exactly `../.claude/skills`. Test settings named local stores and the Current State held a unique startup marker. These are host-loading fixtures, not completed owner interviews; unrelated owner-specific template fields remained unfilled, and all test prompts forbade filling them.

Both native hosts discovered the eleven expected project skills: `braindump`, `filing-project-records`, `handoff`, `managing-project-memory`, `managing-work-items`, `merge-and-clean-up`, `publish-docs`, `pull-latest`, `reset-to-remote`, `session-summary`, and `shaping-a-prompt`. Native catalog data, rather than the model's recollection of names, establishes discovery. Codex reported no skill-loading errors on the final tree.

Both hosts ran startup and prompt hooks in fresh sessions and received `TKV79-LOCAL-START`. Claude's stream records `SessionStart:startup` and `UserPromptSubmit` success. Codex's trusted-project session quoted the startup marker and the exact reminder: “Before you answer, check this project's skills and use every one that fits this message.” A preliminary untrusted Codex session did not receive project hooks, which confirms that project trust affects this test.

Claude automatically received the root guide through `CLAUDE.md` and rule contents. Codex received root `AGENTS.md` automatically; its linked rule files were references until read. Both final read-only sessions read the relevant rules and work-item lifecycle instructions and correctly identified that marking Done requires the owner's instruction and the closing procedure. Evidence: `final-claude-local.jsonl`, `final-codex-local.jsonl`, and `final-codex-local.txt`.

The core Codex invocation was:

```text
CODEX_HOME=/tmp/tkv79-native/codex-home codex exec -s read-only --dangerously-bypass-hook-trust --skip-git-repo-check -C /tmp/tkv79-native/local-project --json -o /tmp/tkv79-native/final-codex-local.txt <read-only verification prompt>
```

The core Claude invocation was:

```text
claude -p <read-only verification prompt> --setting-sources project --strict-mcp-config --mcp-config '{"mcpServers":{}}' --tools Read,Skill --no-session-persistence --output-format stream-json --verbose --include-hook-events
```

The private runner supplied scratch configuration and authentication; no secret was included in the command or retained in the report.

## Actual native compaction and helper checks

Claude resumed a persisted scratch session and ran `/compact`. Its native stream emitted successful `SessionStart:resume`, successful `SessionStart:compact`, and `compact_boundary`. The compact hook output included the local marker and the recovery instruction to re-read the active work item and repeat “Every session” in root `AGENTS.md`. Evidence: `claude-compact.jsonl`.

Codex's native TUI resumed the final local test thread and ran `/compact`. The persisted native rollout recorded a `compacted` event at `2026-10-14T01:08:54.440Z`. The next model turn, without tools, quoted the exact compaction recovery instruction and the startup marker. Evidence: `codex-compaction-evidence.json`. This was actual native compaction, not a hand-constructed hook payload.

A real Claude Agent helper inherited the root guide and automatically loaded rules. It did not receive the parent's startup marker or startup/prompt hook output. The parent's `PostToolUse:Agent` hook succeeded and emitted the tracker reminder, including the exemption for a verifier without a work item. Evidence: `claude-helper.jsonl`.

A real Codex standalone helper was launched through the native `collaboration.spawn_agent` tool with `fork_turns: none`, then waited for through `wait_agent`. It reported root guide and skill catalog context, no startup marker, and no inherited rule-file contents; it read the explicitly supplied rule path. The parent session reported the helper-tracking reminder after spawn/wait, and no work-item update was required for this verifier. The native rollout confirms actual spawn/wait calls; the reminder's visibility here is supported by the parent's report, not a separately exposed hook-event stream. Evidence: `codex-helper.jsonl` and `codex-helper.txt`.

These findings support giving standalone helpers explicit instruction paths and reading memory when startup context is absent. They do not establish that hook memory automatically reaches helper sessions.

## Native dispatch with mocked or absent external stores

Both native hosts also ran fresh sessions with the copied Notion-memory module and a scratch `ntn` stub. The stub returned `TKV79-MOCK-NOTION-START`, and both models received it. Claude's stream directly records startup/prompt hook success. This proves native hook dispatch plus the module's CLI integration with a stub; it does not prove live Notion authorization, API behavior, or writes. Evidence: `final-claude-notion.jsonl`, `final-codex-notion.jsonl`, and `final-codex-notion.txt`.

Both native hosts ran a Hindsight-choice fixture with no Hindsight add-on configured. Startup emitted no memory, as designed, and the matching prompt reminder named `.claude/rules/hindsight-memory.md`. No Hindsight service was called, and no add-on was installed. Evidence: `final-claude-hindsight.jsonl`, `final-codex-hindsight.jsonl`, and `final-codex-hindsight.txt`.

The broader scratch command matrix in `/tmp/tkv79-test-hooks.py` was supplied and run by the parent. Its simulated startup, compact-source, fallback, index, and reminder checks are separate from the actual native evidence described here.

## Confirmed findings and limits

Native testing found two loader issues in the earlier assembled tree: an unescaped apostrophe in the single-quoted `publish-docs` YAML description prevented skill discovery, and four Codex default prompts caused a native warning because only three are supported. The parent fixed both. Final native catalogs include `publish-docs`, and the final Codex run has neither issue.

No Codex validate command exists; the scratch native install and loaded skill catalog are the acceptance evidence. This test did not exercise Codex Desktop UI trust, installed-project updates through an owner interview, live external stores, Salesforce, long-output preview files, actual compaction with every memory choice, or post-commit hooks through a new native model commit. Those remain outside this native sample; the parent command/static checks cover applicable portions separately.

Current official sources consulted on October 13–14, 2026: [Codex hooks](https://learn.chatgpt.com/docs/hooks), [Codex plugins](https://learn.chatgpt.com/docs/build-plugins), [Codex subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents), and [Claude hooks](https://code.claude.com/docs/en/hooks), together with the installed CLIs' native help and app-server-generated protocol schemas.

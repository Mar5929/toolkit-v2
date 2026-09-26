# Critique of `dev/ARCHITECTURE.md`

Written 2026-09-26 by a read-only reviewer. Checked against `dev/GOAL.md` (wins
over everything), the nine research briefs in `dev/research/`, the model
template files, and read-only checks on this Mac (`~/.claude/settings.json`,
`~/.codex/config.toml`, `command -v toolkit`, the captured Claude Code docs).
Nothing else was changed.

## Summary

- 4 blocking findings, 20 important findings, 19 minor findings.
- The blocking findings are all fixable inside the current design. None of
  them needs a change to Mike's decisions.
- The four blocking findings:
  1. The local tracker has no lock, so parallel sessions can take the same ID.
  2. The project's own template file is scanned as work item `WI-001`.
  3. The current toolkit's plugins stay enabled next to Toolkit V2's, with
     three identical plugin names and overlapping skills and hooks.
  4. The Stop hook cannot tell whether a memory save happened, because nothing
     records it.

"Evidence" names the file and section. "Real use" says what Mike or the agent
would see. "Fix" is the change to make in `ARCHITECTURE.md` before the build
step it affects.

---

## Blocking

### B1. The local tracker has no lock around IDs, the state file, or the dashboard

- **Evidence.** ARCHITECTURE 4.3 and 5 describe `.toolkit-state.json` ("highest
  id ever used"), `DASHBOARD.md` "generated after every change", and
  `toolkit work sync` run by SessionStart and by PostToolUse. No lock, atomic
  write, or read-modify-write rule is stated. The current tracker has a lock
  on every change, reloads under the lock, and writes atomically
  (work-process.md 16.2 `.work-tracker.lock`, 16.4 "Guards every mutation
  shares"). The model memory writer has a lock and a parallel-write test
  (memory-system.md 11). Mike's rules say several sessions work the same
  checkout at the same time, and the tracker lives in the one main checkout
  that every worktree shares (ARCHITECTURE 4.3).
- **Real use.** Two sessions run `toolkit work new` in the same second. Both
  read "highest id 6" and both create `WI-007`. Or session A's PostToolUse
  sync rewrites `.toolkit-state.json` while session B's `work new` writes it,
  and the "highest id" update is lost, so a later item reuses a number.
- **Fix.** One exclusive lock file in `.work-items/` (create-exclusive, holds
  the process ID, a stale lock from a dead process is taken over). Every
  command that writes (new, set, approve, finish, cancel, move, history,
  sync, dashboard) takes the lock, re-reads, writes each file to a temporary
  name and renames it. `work new` computes the ID as the larger of the state
  file's highest ID and the highest ID found by a full scan, saves the new
  highest ID, then creates the folder, all under the lock. Apply the same lock
  to the built-in memory folder. Add a test that starts 5 `work new` processes
  at once and checks for 5 different IDs (see I20).

### B2. The project's template file is itself read as work item `WI-001`

- **Evidence.** The approved template
  `toolkit-v2-model-project/.work-items/work-item-template/WORK-ITEM.md` starts
  with `id: WI-001` (checked on disk). ARCHITECTURE 4.3 says "Any `*.md` file
  whose frontmatter has an `id` matching the prefix is an item record" and also
  that `.work-items/work-item-template/` holds the project's copy of the
  template. Nothing excludes that folder.
- **Real use.** The first scan finds item `WI-001` with the title
  `<Work item title>`. The first real item is also `WI-001`, so every scan
  reports a duplicate ID. A likely owner action has the same result: Mike
  copies the `work-item-template` folder to start an item by hand, and the copy
  also says `WI-001`.
- **Fix.** The scan skips `.work-items/work-item-template/`. A record whose
  `id` is already held by an item at another path, or whose title is still a
  `<placeholder>`, is treated as a new item: it gets the next free ID and the
  CLI reports "adopted a new item as WI-012". The item already in the state
  file keeps its ID. This matches the parallel-sessions rule: renumber the
  newcomer, never the original. Test both the template folder and a copied
  template folder.

### B3. The current toolkit's plugins and hooks load in every Toolkit V2 session

- **Evidence.**
  - `~/.claude/settings.json` enables these at user scope:
    `session-skills@claude-toolkit`, `git-workflows@claude-toolkit`,
    `sf-architect-solutioning@claude-toolkit`, `work-tracker@claude-toolkit`,
    `second-brain@claude-toolkit`, `project-init@claude-toolkit`,
    `system-guide@claude-toolkit`, `hooks-library@claude-toolkit`.
  - `~/.codex/config.toml` enables `project-init`, `git-workflows`,
    `sf-architect-solutioning`, and `second-brain` from `claude-toolkit`.
  - ARCHITECTURE 2 ships V2 plugins with the same names `session-skills`,
    `git-workflows`, `sf-architect-solutioning`, and a skill named
    `project-init` in the `toolkit` plugin.
  - ARCHITECTURE 9 writes no `enabledPlugins` entry. ARCHITECTURE 3 claims the
    `"toolkit": "toolkit-v2"` key keeps current-toolkit hooks out, but those
    hooks never read `.toolkit.json`.
  - The skill listing already drops descriptions on this Mac
    (session-skills.md 8.1).
- **Real use.**
  - In a V2 project the agent sees `session-skills:handoff` from both
    marketplaces.
  - It sees `work-tracker:work` next to the V2 `work-*` skills, and
    `second-brain:knowledge-save` next to V2 `memory-save`. Both claim
    "remember this".
  - It sees `project-init:project-init` next to `toolkit:project-init`.
  - V1 SessionStart hooks (system-guide, second-brain) also run.
  - Finish item 5 ("no unclear or overlapping skills") fails in every real
    session, even when the V2 index alone is clean.
  - The other direction also happens: V2 skills appear in every V1 repository,
    including `claude-toolkit`.
  - The Salesforce plugin appears in non-Salesforce projects, against the
    decision "Salesforce pieces are installed only when the project is a
    Salesforce project".
  - Sample runs with `claude -p --plugin-dir` still load the user-scope V1
    plugins, so their results include V1 behavior.
- **Fix.**
  - Give the V2 plugins names no current plugin uses (for example `tk-work`,
    `tk-session`, `tk-git`, `tk-salesforce`). Also rename the V2 `project-init`
    skill (for example `project-setup`).
  - Project init writes per-project enablement for both hosts
    (platform-best-practices.md Part 4, last row). In `.claude/settings.json`,
    `enabledPlugins` turns the chosen V2 plugins on and every
    `*@claude-toolkit` plugin off. In `.codex/config.toml`, the matching
    `[plugins."…"] enabled` lines do the same. Install V2 at project scope, not
    user scope. Enable the Salesforce plugin only in Salesforce projects.
  - Drop the claim about the `toolkit` key (M13).
  - Add a doctor check that lists any enabled `@claude-toolkit` plugin in a V2
    project.
  - Isolate the Claude sample runs as well as the Codex ones (I20).

### B4. The Stop hook has no way to know whether a memory save happened

- **Evidence.**
  - ARCHITECTURE 6, Stop row: "if the owner asked to remember something and no
    memory save happened ... blocks one time".
  - Memory saves run as `toolkit memory save` through the shell
    (ARCHITECTURE 7, "Writer"). The only tool hooks listed watch
    `Write, Edit, apply_patch`, so a save is never seen.
  - No per-session state file is defined. The CLI is run by the agent and does
    not receive the session ID.
  - Codex's transcript format is "not stable" (platform-best-practices.md
    3.3), so reading the transcript is not a reliable fallback.
  - "Once per session" also means that after the first reminder, later missed
    saves in the same session are never caught.
- **Real use.** Built as written, the hook either never fires or fires on every
  turn that had a trigger word. The same gap applies to "a changed work item
  fails validation": nothing records which items changed this turn.
  - This breaks finish item 6 (memory hooks pass tests and are seen running).
- **Fix.**
  - Add a PostToolUse entry on `^Bash$` in both hosts. It records
    `toolkit memory save|retire|restore|delete|focus` and `toolkit work …`
    commands, plus Write, Edit, and apply_patch paths under `.work-items/`.
  - UserPromptSubmit records "trigger seen" with the turn ID.
  - All three hooks write to one runtime file keyed by `session_id`, in a
    Git-ignored folder in the main checkout (for example
    `.toolkit/runtime/<session_id>.json`). Delete these files after 7 days.
  - Stop reads that file. It blocks at most once per turn and always exits
    quietly when `stop_hook_active` is true. That is the documented guard in
    both hosts (platform-best-practices.md Part 4).
  - State the file layout in ARCHITECTURE 6.

---

## Important

### I1. Kept-in-step copies silently undo Mike's hand edits

- **Evidence.** Several values are stored twice and "kept in step" by
  `toolkit work sync`:
  - `status` from `stage` (4.2 "a mismatch is fixed on the next sync");
  - `parent:` from the folder location (4.3);
  - the H1 heading from `title` (4.2);
  - `**Overall status:**` from `requirements_approved` (4.2);
  - Notion Status from Stage (4.4 "recomputes Status on its next read").

  None of these rules says what happens when Mike edits the copy instead of
  the source.
- **Real use.**
  - Mike renames an item by editing the H1 in his editor. The next sync puts
    the old title back.
  - Mike writes `parent: WI-003` in the frontmatter. Sync puts back the parent
    that matches the folder.
  - Mike sets `status: Done` in the file, or Status = Done on a Notion card. It
    is unclear whether sync reverts it (Done is "only by an intentional
    finish") or keeps it with no evidence recorded.
  - Mike drags a `build` card from `02-refinement` to `08-build` in Notion. Sync
    derives In Progress, which passes the hard gate with no recorded
    requirements approval.
- **Fix.**
  - The state file keeps the last value it saw for each copied field. When the
    copy changed and the source did not, sync treats the change as an owner
    edit. A title edit is applied to the source. A parent edit moves the folder
    after asking, or is reported. Done or Cancelled set by hand is kept and
    reported as "set by the owner outside the toolkit; no evidence recorded".
  - A `build` or `data-load` item past stage 03 with no approval is reported to
    Mike as a question ("Was moving WI-5 to 08-build your requirements
    approval?"). It is never silently accepted or silently moved back.
  - Write this rule once in 4.1, for every tracker.

### I2. PostToolUse rewrites the file the agent just edited

- **Evidence.**
  - ARCHITECTURE 6: after a work item record changes, PostToolUse "runs
    `toolkit work sync` for it". That rewrites `status`, `updated`, `parent`,
    and the H1 in the same file, and rewrites `DASHBOARD.md` and the state file.
  - Claude Code's Edit tool refuses a file that changed since it was last read.
    The captured changelog (`changelog.md` line 5805) mentions the "File has
    been unexpectedly modified" error.
  - In Codex, PostToolUse `decision: "block"` "replaces the tool result with
    feedback" (platform-best-practices.md 3.3).
- **Real use.** The agent edits `WORK-ITEM.md` twice in a row. The second edit
  fails because the hook changed the file (at least the `updated:` date). Each
  edit then costs an extra read. With two sessions in the main checkout, one
  session's sync rewrites generated files while the other writes them (B1).
- **Fix.**
  - PostToolUse only validates the edited item and returns problems as
    `additionalContext`. It never uses `block` in Codex, and it writes nothing
    to the item file.
  - It may regenerate `DASHBOARD.md` and the state file under the B1 lock.
  - Derived fields are written by `toolkit work` commands and by the
    SessionStart sync, not by the edit hook.
  - If one field must be written right away, write only when the value differs,
    and say so in the hook output so the agent re-reads the file.

### I3. Moves Mike makes during a session are not noticed until the next CLI call

- **Evidence.**
  - ARCHITECTURE 6: UserPromptSubmit handles memory only. Moves are reported by
    SessionStart and by `toolkit work sync`.
  - PostToolUse does not fire for changes made outside the agent
    (platform-best-practices.md 2.7, "PostToolUse on Edit|Write does not fire
    when ... an outside process rewrites the file").
  - `FileChanged` cannot watch a folder tree (work-process.md 17).
  - The work-process brief proposed a cheap scan at UserPromptSubmit
    (work-process.md 21.2).
- **Real use.** Mike drags `WI-004-billing` into `WI-001-…/` in Finder while
  the agent works, then says "carry on". The agent edits the old path it
  remembers, gets "file not found", and may create a new file at the old path.
  Finish item 4 needs "the agent notices and carries on".
- **Fix.**
  - UserPromptSubmit also runs a fast scan of `.work-items/` (folder names and
    modification times, compared with the state file). If something moved, it
    adds one factual line: "WI-004 moved from X to Y; its parent is now
    WI-001."
  - Every `toolkit work` command rescans before acting and prints moves.
  - The work skills say: find an item's file with `toolkit work show <id>`,
    never from a remembered path.

### I4. Nothing ties a session or worktree to the item it is working on

- **Evidence.**
  - The current tracker records the active item per branch in `ACTIVE.json`
    (work-process.md 9.2, 16.4).
  - The work-process brief proposed dropping it "for a solo developer" and
    asked Mike (work-process.md 22, question 7).
  - ARCHITECTURE drops it with no mention, and it is not in section 12. The
    briefing lists "active items", which means every In Progress item across
    all sessions.
- **Real use.** Two sessions work WI-004 and WI-007. After `/clear` or a
  compaction, the session on WI-007 sees both in the briefing and may resume
  WI-004, so two sessions edit the same record.
- **Fix.**
  - Put the item ID in the worktree branch name (for example `wi-007-slug`).
  - The briefing shows "This worktree works on WI-007" when the branch names an
    item, and lists the others as "in progress in other sessions".
  - Add "branch-scoped active item removed" to section 12 so Mike sees it.

### I5. Codex gets neither the always-on rules nor the Plain English voice reliably

- **Evidence.**
  - `.claude/rules/` is Claude only. Codex reads a rule only if `AGENTS.md`
    tells it to, and loses it after compaction (platform-best-practices.md
    Part 0 item 11, 3.1).
  - Codex has no output styles (3.6).
  - ARCHITECTURE 8 puts Plain English rules "in each agent file" (subagents),
    not in anything the main Codex session reads.
  - ARCHITECTURE 2 ships the style inside the plugin. Finish item 3 says init
    "installs ... the Plain English output style".
  - Whether a plugin style is picked by its plain name is an open question
    (platform-best-practices.md Part 6 question 2).
  - Mike already has a user-level style with the same name:
    `~/.claude/output-styles/plain-english.md`, selected as "Plain English" in
    `~/.claude/settings.json`.
- **Real use.** A Codex session in a V2 project writes in its default voice and
  never reads the always-on rules unless it follows the "read these at session
  start" line. After compaction it has lost them.
- **Fix.**
  - `toolkit brief --host codex` (used only by `codex-hooks.json`) adds the
    always-on rule text and a short voice section to the Codex briefing. The
    briefing runs again after compaction.
  - Claude keeps getting rules natively, so nothing is loaded twice.
  - Install the style into the project's `.claude/output-styles/`. That is the
    proven path, the closest file wins, and it matches finish item 3.

### I6. `toolkit` on the PATH for Codex breaks on plugin updates, and the two hosts run different versions

- **Evidence.**
  - ARCHITECTURE 2: `toolkit machine-setup` links `~/.local/bin/toolkit` to the
    plugin's `bin/toolkit`. Codex runs a copy under
    `~/.codex/plugins/cache/<marketplace>/<plugin>/<version>/`, and needs a
    version bump or reinstall to see a change (platform-best-practices.md 3.4,
    Part 0 item 15).
  - Claude runs a local-marketplace plugin in place (Part 0 item 15).
  - Codex plugins do not support `bin/` on PATH (3.4).
  - `project-init` itself runs `toolkit machine-setup`, before `toolkit` is on
    the Codex PATH.
- **Real use.**
  - After a version bump the symlink points at a removed folder, and every
    skill in Codex fails with "command not found".
  - Between bumps, Claude runs the new CLI and Codex runs the old one on the
    same `.work-items/`. The two versions may write the state file differently.
- **Fix.**
  - `machine-setup` writes a small wrapper script at `~/.local/bin/toolkit`,
    not a symlink. At run time the wrapper finds the newest installed copy of
    the plugin.
  - The Codex `project-init` skill calls the CLI by its path relative to the
    skill folder the first time.
  - Put a `schema` number in the state file and in `.toolkit.json`. A CLI that
    finds a newer schema refuses to write and says "update the toolkit
    plugin".
  - The build loop bumps the version for every Codex test (I20).

### I7. Codex's sandbox may block the Notion and Hindsight commands

- **Evidence.**
  - Notion brief section 14: Codex's default `workspace-write` sandbox turns
    off network access and may block the macOS keychain, and `ntn` needs both.
    Marked untested (test T13).
  - `toolkit memory save` for Hindsight calls `http://127.0.0.1:8888`.
  - `~/.codex/config.toml` sets no sandbox or network override.
  - ARCHITECTURE 9 writes only the Hindsight MCP entry to `.codex/config.toml`.
- **Real use.** Sample runs (c) Notion + Notion and (d) local + Hindsight fail
  in Codex on the first memory or tracker command.
- **Fix.**
  - Run test T13 (and the same test against Hindsight) before building the
    drivers.
  - If it fails, init writes the documented network setting for that project's
    `.codex/config.toml`, and the doctor reports it.
  - Say in ARCHITECTURE 9 which setting is written, and for which memory and
    tracker choices.

### I8. The Salesforce production guards do not protect Codex sessions

- **Evidence.**
  - ARCHITECTURE 6: the guards "stay project hooks" and are registered in
    Claude settings only (project-init-library.md 14: "No hook in
    hooks-library is registered for Codex").
  - `guard-protected-orgs.js` returns `ask` for sandboxes and unknown orgs.
  - In Codex, a PreToolUse `ask` makes the hook fail and the command runs
    (platform-best-practices.md Part 0 item 6).
  - `.toolkit.json` `hosts` includes `codex` by default.
- **Real use.** In a Salesforce project, a Codex session can run
  `sf project deploy start -o prod` with no guard.
- **Fix.**
  - Register both guards in the project's `.codex/hooks.json` for Salesforce
    projects, with a `--host codex` flag. With that flag, every `ask` becomes
    `deny` with a reason that tells the agent to hand Mike the command.
  - Add a guard test that runs the Codex form.

### I9. Session-start hooks for Notion and Hindsight have no timeout, cache, or fail-open rule

- **Evidence.**
  - ARCHITECTURE 6 SessionStart builds the briefing from the tracker and
    memory.
  - "Claude's first response still waits for the hooks to finish"
    (platform-best-practices.md 2.7).
  - Each `ntn` call takes about 0.5 s (notion-design.md 2.1). A Notion briefing
    needs the active items plus each one's next action and questions for the
    owner, which live in the page bodies.
  - The memory and model-review briefs both call for a short timeout and a
    cached copy (memory-system.md 13.8; model-review-draft.md 4).
- **Real use.** Offline, or with the Hindsight service down, every session
  start waits up to the hook timeout. With 10 active Notion items the briefing
  takes 5 to 10 seconds.
- **Fix.**
  - Hooks use a 2-second timeout per backend call and print one line when a
    backend cannot be reached.
  - The briefing reads a Git-ignored cache (for example `.toolkit/cache/`)
    that every tracker and memory write refreshes, and prints the cache time.
  - For Notion, add a `Next action` property, and a count of open owner
    questions, so the briefing reads properties only.

### I10. Reading Notion bodies back into the work-item model is not planned

- **Evidence.**
  - ARCHITECTURE 4.4 covers writing: "converts Markdown for Notion (tables,
    escaped placeholders, line breaks)".
  - The briefing, validation, open-question collection, and `update_content`
    edits all need the reverse. Notion returns its own Markdown: tables as
    `<table>`, `<br>`, escaped `<` (notion-design.md 10, tests T5-T7).
  - `update_content` needs an `old_str` that matches Notion's text exactly
    (notion-design.md 4).
- **Real use.** The parser built for local pipe tables cannot find the Open
  Questions table or the `R-01` blocks in a Notion page. `update_content` built
  from a local rendering fails with `validation_error` on every edit.
- **Fix.**
  - The Notion driver always reads the page with `GET /v1/pages/{id}/markdown`,
    turns it into the same document model the local parser produces, and
    builds each `old_str` from that fresh text.
  - Make tests T5, T6, T7, and T9 pass before any Notion driver code depends on
    them.

### I11. Mike's own actions in Notion are only partly covered

- **Evidence.**
  - ARCHITECTURE 4.4 covers card drags and body edits only.
  - The Notion brief lists more: a card made with the board's "New" button has
    an empty body; the API cannot create a database template; sub-item links
    can change on any card; pages can be trashed (notion-design.md 6.4, 13;
    open question Q6).
  - Finish item 7 names a "Solution Design subpage template".
- **Real use.**
  - Mike adds a card on the board. It has no `WORK-ITEM.md` body and no Solution
    Design page, and nothing says the agent will fill them in.
  - "Subpage template" may be read as a Notion template in the "New" menu,
    which only the Notion app can make.
- **Fix.**
  - Add the Notion brief's section 13 table to ARCHITECTURE 4.4, including
    "adopt an empty card: fill the body, create the Solution Design page, set
    Stage 01 and Status Backlog".
  - Add to section 12, for Mike: "The Notion API cannot make a database
    template. The agent fills in cards you create by hand. If you want the New
    button itself to fill the template, you add it once per project in the
    Notion app."

### I12. The Hindsight MCP connection adds a second write path around the memory contract

- **Evidence.**
  - ARCHITECTURE 7: the project `.mcp.json` points Claude at the bank's MCP URL
    "for free-text recall". The Codex config gets the same.
  - The planned server tool list includes `retain`, `sync_retain`, and
    `delete_document`. The `retain` description says "Use this tool
    PROACTIVELY" (hindsight.md 11, "Tool descriptions nudge agents to save
    everything").
  - `toolkit memory find` already does recall over REST (memory-system.md
    13.6, "find").
- **Real use.** The agent saves through MCP `retain`. That record has no
  `document_id` key and no type or status tags, and skips the approval
  policy. `toolkit memory list` never shows it, but recall finds it.
- **Fix.**
  - Drop the MCP connection. `toolkit memory find` already covers free-text
    recall and works in hooks.
  - If Mike wants MCP recall, allow only `recall` (bank `mcp_enabled_tools`,
    plus `enabled_tools` in the Codex config) and set `enabledMcpjsonServers`
    so Claude does not ask to approve it.

### I13. In `chunks` mode Mike's chosen model is not used by saves or searches

- **Evidence.**
  - ARCHITECTURE 7 and section 12 item 15: Hindsight uses `chunks` extraction.
    In that mode retain skips the LLM entirely (hindsight.md 5, "A mode that
    needs no LLM for retain"), and recall never calls the LLM (hindsight.md 3).
  - Only `reflect` uses `gpt-oss:20b`, and the contract never uses reflect for
    saves or lookups (memory-system.md 13.6).
  - Finish item 8: "A local Hindsight server using Ollama `gpt-oss:20b` ... a
    test project stores a memory and gets it back."
- **Real use.** The finish-item-8 proof passes even if the Ollama settings are
  wrong. Mike keeps a 13 GB model installed that only an optional command
  uses.
- **Fix.**
  - The finish-item-8 proof also runs one `reflect` call and shows its answer.
  - Section 12 item 15 says plainly: "With `chunks`, saves and searches do not
    use `gpt-oss:20b`. Only a `reflect` call uses it." Then decide whether the
    CLI offers `reflect` at all (the memory brief's optional `ask`,
    memory-system.md 13.6). ARCHITECTURE 5 has no such command today.
  - Carry the brief's plist settings: `HINDSIGHT_API_SKIP_LLM_VERIFICATION`,
    `HINDSIGHT_API_MCP_ENABLED_TOOLS`, `HINDSIGHT_API_HOST=127.0.0.1`.

### I14. The memory trigger words are too broad for a hook that can block

- **Evidence.**
  - ARCHITECTURE 6, UserPromptSubmit fires on "remember / from now on / always
    / never / don't ever".
  - The memory brief measured noise from broad patterns and recommended
    explicit phrases only (memory-system.md 10 P8, 12.3 item 4).
  - The Stop hook blocks when a trigger was seen and no save ran.
- **Real use.** "Never mind", "it always fails on this test", and "that never
  worked" each trigger a save reminder. The Stop hook then makes the agent
  continue the turn to explain why nothing was saved. Mike's global rules ask
  for fewer interruptions.
- **Fix.**
  - Trigger only on explicit phrases: "remember that", "from now on", "don't
    ever", "always do", "never do", "forget that", and "that's wrong, it's".
  - Write the reminder as a fact, not an order (platform-best-practices.md 2.7,
    `additionalContext` wording).
  - Add should-not-fire test prompts for these sentences.

### I15. Every `toolkit` command will ask for permission

- **Evidence.**
  - ARCHITECTURE 9 lists no permission rules.
  - The model's saves triggered "a Bash permission prompt" each time, and the
    brief's fix is an allow rule for the command (memory-system.md 10 P9, 12.1
    item 2).
- **Real use.** In the default permission mode, every save, stage change, and
  history row stops for Mike's approval. That is the ceremony the curator
  removal was meant to cut.
- **Fix.** The general settings fragment adds `permissions.allow` for
  `Bash(toolkit *)`. The Codex side gets the matching approval setting, or an
  allow rule for the command.

### I16. The pre-edit hook refuses edits to `ai-external-knowledge/INDEX.md`, but no command builds it

- **Evidence.**
  - ARCHITECTURE 6 PreToolUse refuses hand edits of
    `ai-external-knowledge/INDEX.md` "with the command to use instead".
  - The command list in ARCHITECTURE 5 has no command that builds that index.
  - `.memory/MEMORY.md` is rebuilt only as a side effect of a save.
- **Real use.** After capturing outside documentation, the agent cannot add
  the topic to the index. The edit is refused, and no command exists to run.
- **Fix.** Add `toolkit index knowledge` (and `toolkit memory reindex`). Name
  them in the refusal text. Or remove `INDEX.md` from the refused list until a
  generator exists.

### I17. Work items have no backup, and one common command deletes both Git-ignored folders

- **Evidence.**
  - `.work-items/` and `.memory/` are Git-ignored (Mike's decisions D6 and
    D15).
  - ARCHITECTURE 7 offers `toolkit memory export`, and nothing for work items.
  - `git clean -fdx` (or `-fdX`) deletes Git-ignored files. It is a common
    "clean build" command, and no guard is planned.
- **Real use.** An agent cleans build output with `git clean -fdx` in the main
  checkout. Every work item and every built-in memory is gone, with no copy.
- **Fix.**
  - Add `toolkit export --to <dir>`, covering work items and memory together.
  - The doctor reports the age of the last export.
  - Add a PreToolUse guard that denies `git clean` with `-x` or `-X` in the
    main checkout of a project that uses the local tracker or built-in memory.
  - Keep Mike's decision to Git-ignore these folders.

### I18. Moving the whole project folder switches off Codex hooks and plugins without a message

- **Evidence.**
  - Codex trust is stored per absolute path (`~/.codex/config.toml`,
    `[projects."/Users/…/<path>"] trust_level = "trusted"`, checked on this
    Mac).
  - Project `.codex/` hooks and config load only for a trusted project
    (platform-best-practices.md 3.3, 3.4).
  - Linked Git worktrees store absolute paths.
  - ARCHITECTURE 4.3 does not say whether the state file keeps absolute or
    relative paths.
- **Real use.** Mike moves `~/Projects/acme` to `~/Clients/acme`.
  - Codex no longer trusts the folder, so the briefing, the memory hooks, and
    the per-project plugin enablement stop without a message.
  - Existing worktrees stop working.
  - If the state file keeps absolute paths, every item is reported as moved.
- **Fix.**
  - The state file stores paths relative to `.work-items/`.
  - The `AGENTS.md` fallback line ("no Project briefing: run `toolkit brief`")
    stays.
  - `toolkit brief` and `toolkit doctor` check Codex trust for the current path
    and linked-worktree health, and give the fix: "trust this folder in Codex",
    "run `git worktree repair`".

### I19. The skill layer is not designed in this document

- **Evidence.**
  - GOAL says the orchestration skills are "the main difference from the
    current toolkit".
  - ARCHITECTURE 8 gives principles only. The names live in
    `dev/SKILL-INDEX.md`, which does not exist yet.
  - Section 12 item 11 refers to `work-requirements` and `work-review`, which
    are defined nowhere else.
  - The research lists which skill owns the delivery offer, handoff, and the
    Codex helper fallback as open questions (session-skills.md 12 questions 3
    and 4; section 9 "Codex helper fallback").
- **Real use.** Build step 5 starts with no agreed skill list. The finish item
  5 overlap check cannot start until then. Skill boundaries decide what the
  CLI must offer, so steps 2 to 4 may miss commands.
- **Fix.** Before build step 2, add a table to section 8 with every skill:
  name, one-line job, and trigger words. Say which current skill each one
  replaces, and which skill owns the delivery offer, the team-arrangement
  question, closeout at stage 14, and the handoff. Run the independent overlap
  check on that table first.

### I20. The test plan misses the cases most likely to fail in real use

- **Evidence.** ARCHITECTURE 10, against the findings above and the briefs'
  own test lists (memory-system.md 13.9; notion-design.md 16;
  platform-best-practices.md Part 6).
- **Missing tests, and the fix for each:**
  - **Parallel sessions.** Parallel `work new`, parallel `memory save`, and two
    sessions syncing at once (B1).
  - **Worktrees.** A linked worktree reads and writes the main checkout's
    tracker and memory (memory-system.md 13.9 test 6).
  - **Owner edits.**
    - Local: an edited H1, an edited `parent:`, `status: Done` set by hand, a
      renamed record file, a single file moved into another item, an item
      moved out of `.work-items/`, and a copied template (B2, I1).
    - Notion: an empty "New" card, a body edit followed by an agent
      `update_content`, a drag past stage 03, a sub-item moved to another
      parent, and Status set to Done by hand (I1, I11).
  - **Skill choice.** Should-trigger and should-not-trigger prompts for every
    skill in both hosts (platform-best-practices.md 3.2). Run them with the V1
    plugins switched off, then with them on, to prove B3 is fixed.
  - **Test isolation.**
    - Claude runs must not load the user-scope V1 plugins (B3).
    - Codex runs with an isolated `CODEX_HOME` need a Codex login in that
      folder. Mike signs in there himself, or the plan names another way.
      Tokens are never copied by an agent.
    - Codex caches plugins by version, so bump the version before each Codex
      test run, or Codex tests the old code (I6).
  - **Real-session proof.** `--dangerously-bypass-hook-trust` is fine for
    automated runs. Finish item 6 also needs one run in Mike's real Codex
    setup after he trusts the hooks once in `/hooks`. That is his action.
  - **Live services in unit tests.**
    - Notion and Hindsight tests in `node --test` create real data on every
      run. Use recorded responses in the unit suites, and keep one live smoke
      run.
    - Sample Notion projects go under one "Toolkit V2 sandbox" row. Removing
      them needs Mike's yes (notion-design.md 15).
  - **Salesforce run.** State what it proves without a real org. For example:
    the overlay files, the Salesforce rules loading, and the guards denying a
    production deploy with a fake `sf` on the PATH, as the existing guard
    tests do (project-init-library.md 14).

---

## Minor

### M1. Memory record fields and commands do not match

- ARCHITECTURE 7 lists statuses `current | needs-review | superseded |
  archived`. The CLI has `retire` and `restore`, and records have
  `supersedes` but no `superseded_by`.
- Notion memory lists a "criteria" child page, though the policy now lives only
  in the `memory-save` skill.
- The glossary has no command, so Notion and Hindsight glossaries cannot be
  edited.
- **Fix.** Use `current | needs-review | retired` plus `superseded_by`, as the
  memory brief proposes (memory-system.md 13.3). Remove the criteria page. Add
  `toolkit memory glossary [--set-file]`.

### M2. The parent-from-location rules are incomplete

- `toolkit work set --parent` conflicts with "location is the parent". Either
  it moves the folder, or remove it and use `work move`.
- Define what happens when a record file is moved on its own into another
  item's folder, so two records share a folder: the loose record is a sub-item
  of that folder's item.
- Find `DESIGN.md` by its `work_item` frontmatter, not by its location.
- Tell Mike the tradeoff in section 12 item 2: a sub-item cannot also sit in a
  group folder such as `billing/`.

### M3. The state file holds history that cannot be rebuilt

- `.toolkit-state.json` is called "generated", but the highest ID ever used and
  the last-seen paths cannot be rebuilt from a scan.
- If it is deleted, numbers of deleted items can be handed out again, and moves
  since the last run are lost.
- **Fix.** Call it state, not generated. Include it in `toolkit export`.

### M4. `toolkit sync` cannot tell "Mike changed it" from "the toolkit updated it"

- "Never overwrite changed ones" needs a record of each installed file's
  original hash.
- **Fix.** Keep one in `.toolkit/installed.json`, committed. Without it, rule
  updates never reach existing projects.

### M5. Three plugins that cannot work alone

- `work` and `memory` call the `toolkit` command and cannot run without the
  `toolkit` plugin. Codex has no plugin dependencies (platform-best-practices.md
  3.4).
- **Fix.** Merge `toolkit`, `work`, and `memory` into one plugin. That is fewer
  manifests and version bumps, and no half-installed state.

### M6. Section 12 is missing calls Claude made

Add these to section 12 so Mike sees them:

- `git-workflows` added to the port list (GOAL names only the session skills);
- the glossary kept in the Git-ignored vault (model-review-draft.md 11
  question 13);
- the `archive/` folder dropped;
- the branch-scoped active item dropped (I4);
- the Notion ID form `WI-14` instead of `WI-014` (notion-design.md Q3);
- no Notion database template (I11);
- `gpt-oss:20b` used only by `reflect`, not by saves or searches (I13).

### M7. The shared Notion ID prefix is untested across projects

- Every project's Work Items database would use the ID prefix `WI`.
- Test T10 checks one database only. Whether Notion accepts the same prefix in
  many databases of one workspace is not verified.
- **Fix.** Run T10 with two project databases before choosing the prefix rule.

### M8. Hindsight details

- The launchd label differs from the brief (`local.toolkit.hindsight` against
  `local.toolkit-v2.hindsight`). Pick one.
- If Mike duplicates a project folder, both copies share one bank, because the
  bank ID is committed. The doctor should compare the bank's stored project
  key or Git remote.

### M9. `toolkit init` must be safe to run again

- A Notion `ensure-project` or Hindsight bank step can fail halfway.
- **Fix.** Write `.toolkit.json` last, or with `"setup": "incomplete"`. Check
  the prerequisites before writing anything: `ntn` signed in, Hindsight
  healthy. Make every step idempotent.

### M10. Generated parts of `AGENTS.md` can overwrite Mike's own lines

- The Rules section and the path table are generated. Mike may add his own
  lines to `AGENTS.md`.
- **Fix.** Regenerate only between marker lines that are removed from what the
  agent sees, or have `doctor` compare and report only.

### M11. Codex hook output limit and a missing Claude matcher

- Set `additionalContextLimit` in `codex-hooks.json` to at least the briefing
  size, which is 9,000 characters. The Codex default is about 2,500 tokens.
- Add `fork` to the Claude SessionStart matcher.

### M12. Salesforce skills have no stated home

- ARCHITECTURE 2 has no plugin for `sf-component-tracker`, `sf-data-change`,
  and `sf-deploy-check`.
- **Fix.** Say whether they ship in a Salesforce plugin, enabled per project,
  or are copied to both `.claude/skills/` and `.agents/skills/`. The model
  review prefers a plugin (model-review-draft.md 5.2).

### M13. The reason given for the `"toolkit"` key is wrong

- Current-toolkit hooks read `.toolkit-memory.json`, which V2 never creates.
  The key in `.toolkit.json` does not affect them.
- **Fix.** Keep the key as the V2 marker that V2 hooks check. Remove the
  sentence about current-toolkit hooks.

### M14. The `autoMemoryEnabled` sentence is confusing

- "plus `autoMemoryEnabled: false` when memory is not the host's own" is always
  true, because no memory option is Claude's own.
- **Fix.** Say "always `false`".

### M15. Turning on trusted mode needs a committed-file change

- `memory.approval` lives in the committed `.toolkit.json`. Under the ported
  parallel-sessions rule, changing it needs a worktree, a branch, and a pull
  request.
- **Fix.** Store the mode with the memory, as the model's criteria file did,
  or name `.toolkit.json` as a direct one-file edit in the rule.

### M16. Delivery agents are Claude only

- Codex plugins cannot ship agents (platform-best-practices.md 3.4, 3.5).
- **Fix.** The work skills need the fallback the current skills already use:
  read the role file and pass its text to a native Codex worker, or say that
  no independent review ran (session-skills.md 9).

### M17. The local and Notion trackers carry different fields

- Notion has `Blocked by`, `Blocking`, and `Related to` relations (4.4). The
  local frontmatter has none of them.
- **Fix.** Either add `blocked_by:` and `related:` to the local frontmatter, or
  drop those relations from Notion, so the model is the same in every tracker
  (finish item 4).

### M18. GitHub and Jira projects need explicit refusals

- **Fix.** For a `github` or `jira` tracker, `toolkit work …` exits with a
  one-line pointer to the written instructions, and the work-item hooks do
  nothing.

### M19. The Git-ignored tracker and memory exist on one computer only

- **Fix.** State this in section 4.3 and section 7 as a known limit, so Mike is
  not surprised on a second computer.

---

## Finish items against this plan

| # | Finish item | Status under the current plan | Findings |
| --- | --- | --- | --- |
| 1 | Model review | Covered by build step 1 | none |
| 2 | Plugins registered, validate passes | Will pass; real use still collides with V1 names | B3, M5 |
| 3 | Project init | Covered for Claude; Codex gets no voice or always-on rules; style not installed in the project | I5, I15, M9, M10 |
| 4 | Work items, sub-items, moves | Covered at session start and on CLI calls; not during a session; hand edits reverted | B1, B2, I1, I2, I3, I4, M2, M17 |
| 5 | Skill index, no overlap | Cannot be checked yet; fails in real sessions while V1 plugins stay enabled | B3, I19 |
| 6 | Hooks tested and seen in both hosts | Stop hook cannot be built as written; Codex trust and sandbox not planned | B4, I7, I14, I20 |
| 7 | Notion rebuilt | Build path is sound; read path and hand-made cards missing | I9, I10, I11, M7 |
| 8 | Hindsight | Service plan is sound; proof does not exercise `gpt-oss:20b` | I12, I13, M8 |
| 9 | Four sample runs | At risk in Codex (sandbox) and in Claude (V1 plugins in the run) | B3, I7, I20 |
| 10 | Fixes, final review | Depends on I20 test coverage | I20 |
| 11 | Report | No issue | none |

## Parts of the plan to keep

- One committed `.toolkit.json`, with every hook silent outside V2 projects.
- IDs, not paths, in every link. The Hindsight bank ID and the Notion IDs are
  stored once and never derived from the folder name.
- `git rev-parse --git-common-dir` to share one tracker and one memory folder
  across worktrees.
- Separate Claude and Codex hook files with shell-form commands for Codex, and
  two manifests per plugin.
- The Notion build-and-repair script instead of template copies, targeted body
  edits, and writes limited to the Second Brain root.
- One memory contract with three drivers, called from hooks without MCP.
- Dropping the memory curator subagent and the model's four `CLAUDE.md` files.

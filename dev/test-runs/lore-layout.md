# Notion memory in Lore's layout: build and test results

Run on 2026-09-27, from 17:14 to 17:31 EDT (21:14 to 21:31 UTC). Mike's
decision (`dev/GOAL.md`, "Notion memory uses Lore"): store each project's
Notion memory in Lore's layout, keep the toolkit's own memory commands, the
model's formats, and the approval step, keep focus and glossary as child pages,
no Lore install, no Lore hooks, no new sign-in. Design: `dev/research/lore.md`,
option C with the corrections in section 12.

## Result

- Every project that uses Notion memory now gets a "Memory" page under its
  row. That page holds Lore's five databases (Projects, Topics, Memories,
  Entities, Facts) with Lore's exact property names, types, options, and
  relations, copied from Lore 1.0.0 at commit `6e741b1`.
- Each memory record is one row of the Memories database. The record text
  reads back byte for byte, so its version does not change.
- `toolkit notion ensure-project` moves a project that still uses the older
  single "Memory" database. It copies every record, reads each one back, and
  renames the old database "Old memory database (safe to delete)". It never
  deletes anything.
- Lore's own tools accept the layout: `lore doctor` says "No action needed",
  and `lore migrate --dry-run` says "Vault schema is up to date."
- The showcase project "Toolkit V2 sample (safe to delete)" under Mike's real
  root page was moved. Its one record kept its version.
- Unit tests: 699 tests, 696 pass, 0 fail, 3 skipped. Live checks: 21 of 21 pass.

## What changed in the toolkit

| File | Change |
| --- | --- |
| `plugins/toolkit/lib/notion/lore-schema.mjs` (new) | Lore's five database schemas, pinned to Lore 1.0.0 at commit `6e741b1bb91a36b47213f4d3af5bbdfaa2f2081d` with the `default@1.0.0` profile. The lists were taken by calling Lore's own `createVaultDatabases()` with a stub client, so they match exactly. Lore's MIT license notice is kept in the file. |
| `plugins/toolkit/lib/notion/schema.mjs` | The toolkit's added Memories columns, the five type tags, the Status mapping, and `loreMemoriesWanted()`. The older Memory database schema stays, for the move. |
| `plugins/toolkit/lib/notion/ensure.mjs` | `ensure-project` builds and repairs the Memory page, the five databases, the Index and Retired views, and the project's row in the Memory page's Projects database. It finds an older Memory database and moves it. Select, multi-select, and relation targets are checked. |
| `plugins/toolkit/lib/memory/notion.mjs` | The driver reads and writes Memories rows (Lore layout) and still reads and writes the older database until a project is moved. `copyRecords()` does the move. |
| `plugins/toolkit/lib/commands/notion.mjs` | Help text and output name the Memory page and the Memories database. |
| `plugins/toolkit/tests/notion/fake-notion.mjs` | The offline fake handles multi-select values and options and database renames. |
| `plugins/toolkit/tests/notion/lore-layout.test.mjs` (new) | 19 tests: the layout, the record mapping, the move, and the pinned schema compared with Lore's own code (runs when `TOOLKIT_LORE_CLONE` names a built Lore clone). |
| `plugins/toolkit/tests/notion/ensure.test.mjs`, `memory.test.mjs` | Updated for the Lore layout. |
| `plugins/toolkit/tests/notion/live/run-lore-live.mjs` (new) | The live checks below, run by hand against the private test area. |

## The layout

```text
Project row (in the Projects database under the root page)
├── Work Items          (database, when the tracker is Notion)
├── Current focus       (page, as before)
├── Terminology glossary (page, as before)
└── Memory              (page: Lore's vault)
    ├── Projects        (one row: the project, Path ".", Type project, Status active)
    ├── Topics          (empty)
    ├── Memories        (inline; the records; views Index and Retired)
    ├── Entities        (empty)
    └── Facts           (empty)
```

Lore reads only databases placed directly on the vault page, found by these
exact titles, so the toolkit checks that after every `ensure-project`.

## How a record maps to a Memories row

| Toolkit record | Memories column |
| --- | --- |
| the body's `# Title` line | Title (Lore) |
| key, for example `feedback_deploy_window` | Keywords (Lore), and Record Key (added; the toolkit finds a row by it) |
| `description` | Synopsis (Lore) |
| type (user, feedback, project, reference, event) | Tags (Lore): Lore's 40 default tags plus these five |
| always | Kind `note`, Source `manual` (Lore) |
| status current / needs-review / superseded / archived | Status `accepted` / `proposed` / `superseded` / `deprecated` (Lore) |
| `supersedes` | Supersedes relation to the replaced rows (Lore). A key with no row to point at is kept in Other fields. |
| who saved | Author = the owner; Agent = Claude Code or Codex when known; Project = the project's row on the Memory page (Lore) |
| `superseded_by`, `source`, saved date, `last_verified`, `authorization` | Superseded by, Source note, Saved, Last verified, Authorization (added) |
| extra `metadata` keys and other frontmatter keys | Other fields (added, JSON) |
| body | the page body, unchanged in the model's topic format, without its `# Title` line |

Rows without a Record Key (made in Notion, or by Lore's own tools) are not
toolkit records. `list` and `find` leave them out, `status` names them, and the
toolkit never changes them. Tags that Lore or Mike add to a toolkit row are
kept when the toolkit saves it again.

## Checks from `dev/research/lore.md` section 10

| # | Check | Result |
| --- | --- | --- |
| 1 | Make a Memory page and Lore's five databases | Pass. Test area and showcase. Read back from Notion: exactly the five databases, with Lore's titles; 74 Lore properties with Lore's types, options, and relation targets, plus the 8 toolkit columns and the 5 type tags. |
| 2 | Toolkit memory checks against the Memories database | Pass, 21 of 21 live checks: save and get exact text, find, list, retire (superseded and archived), restore, rename, delete, stale version refused, focus, glossary, status. |
| 3 | `lore doctor`, `lore status`, `lore search <word> --json`, with RunTool off and hooks off | Pass. Details below. |
| 4 | `lore mcp`: `lore-context action='wake-up'` and `lore-query action='recall'` | Pass for the records. Focus and glossary are child pages, so Lore does not show them (section 12 correction). |
| 5 | Lore's drift check does not complain about the added properties | Pass. `lore migrate --dry-run`: "Vault schema is up to date. Nothing to migrate." |
| 6 | File-mode `ntn` sign-in beside the toolkit's `ntn api` calls | Not tested as a setup step; no new sign-in was made. See "Found during the run": a file-mode sign-in to another workspace appeared on this Mac at 17:13. |

Section 12.5 addition: Lore's search with RunTool off finds a toolkit row only
by a word in its title. `lore search zephyr --json` and `lore search runbook
--json` each found "Zephyr runbook". `lore search quokka --json` found
nothing, although "quokka" is in that record's body.

## Live run in the private test area

Command:

```bash
NOTION_WORKSPACE_ID=<Personal workspace id> TOOLKIT_NOTION_LIVE=1 \
  node plugins/toolkit/tests/notion/live/run-lore-live.mjs --out <file.json>
```

Output of the second run (the first run had one failing check, a test-order
mistake in the script: the archive step had already turned the link it
checked into plain words; the script was fixed, the code was not changed):

```text
PASS  ensure-root on the test area (1592 ms)
PASS  check 1: ensure-project makes the Memory page with Lore's five databases - 12 created (...), 37 calls; https://app.notion.com/p/Memory-3e8b381da17681cd8b22e8be581122b6 (18525 ms)
PASS  check 1: read back from Notion, the Memory page holds exactly the five databases, titled as Lore needs - project row holds page:Current focus, page:Memory, page:Terminology glossary (1133 ms)
PASS  check 1 (drift): every Lore property, type, option, and relation target is in Notion - 74 Lore properties checked, plus 8 toolkit columns and the five type tags (1864 ms)
PASS  check 1: ensure-project again changes nothing and does not rewrite .toolkit.json - 24 calls (8790 ms)
PASS  check 2: save and get give back the exact text; the row has Lore's columns - version 07f3a55734cc; {"Title":"Zephyr deploy window","Keywords":"feedback_deploy_window","Record Key":"feedback_deploy_window","Synopsis":"Deploy on Tuesdays only","Kind":"note","Tags":["feedback"],"Status":"accepted","Source":"manual","Author":"Mike","Project":["3e8b381d-a176-8184-88b8-fe550861d641"],"Authorization":"Approved by Mike on 2026-09-27"} (3186 ms)
PASS  check 2: find and list - feedback_deploy_window,project_release_days (3393 ms)
PASS  check 2: retire --superseded-by sets Status superseded and the Supersedes relation - links repaired: none (13875 ms)
PASS  check 2: restore sets Status proposed (needs-review) (11853 ms)
PASS  check 2: retire without a replacement sets Status deprecated (archived) (13473 ms)
PASS  check 2: rename changes Record Key and Keywords on the same page and repairs links - links repaired: project_rollout (13311 ms)
PASS  check 2: a stale version is refused (758 ms)
PASS  check 2: delete moves the row to the Notion trash (9153 ms)
PASS  check 2: focus and glossary round trip exactly (child pages of the project row) (7030 ms)
PASS  check 2: list after rename and delete - project_release_days,project_rollout (514 ms)
PASS  check 2: status is healthy - Notion Memory page (Lore layout): 2 records in use, 0 retired. (1096 ms)
PASS  a record left for Lore's own read tools - reference_zephyr_runbook (title word "Zephyr", body-only word "quokka") (1654 ms)
PASS  move: an older project with records in one "Memory" database - 5 records in https://app.notion.com/p/2a3b7b1d775641628455127716e65a4b (38088 ms)
PASS  move: ensure-project copies every record into the Lore layout and renames the old database - Moved 5 records from the old Memory database into the Memories database on the Memory page (Lore layout). Each one reads back with the same text and version. The old Memory database was left in place and renamed "Old memory database (safe to delete)": https://app.notion.com/p/2a3b7b1d775641628455127716e65a4b. Nothing was deleted. (50129 ms)
PASS  move: every record reads back from the Lore layout with the same version - user_prefers_short 17c1b39789e3, feedback_deploy_window 0d334abb81c5, project_release_days 18eb7b5e48aa, reference_links 6180a99e93c4, event_launch d916f7fa6a26 (5364 ms)
PASS  move: ensure-project again changes nothing - 24 calls (10653 ms)

21 of 21 checks passed in 215 s.
```

The five moved records cover a superseded record and its replacement (the
Supersedes relation points at the old row), an archived record, a
needs-review record, a record with extra `metadata` and frontmatter keys, and a
body with a table. Every version is the same before and after.

Rows left in the test area (safe to delete with the rest of it):

| What | Link |
| --- | --- |
| Project row "Lore layout check 2026-09-27T21-20-24-212Z" | https://app.notion.com/p/Lore-layout-check-2026-09-27T21-20-24-212Z-3e8b381da17681299d0cdfb5a0abd541 |
| Its Memory page (the vault Lore read) | https://app.notion.com/p/Memory-3e8b381da17681cd8b22e8be581122b6 |
| Project row "Lore move check 2026-09-27T21-20-24-212Z" | https://app.notion.com/p/Lore-move-check-2026-09-27T21-20-24-212Z-3e8b381da176810ba321c3e97a3d917e |
| Its renamed old database | https://app.notion.com/p/2a3b7b1d775641628455127716e65a4b |
| Two rows from the first run ("... 21-16-40-146Z") | same shape |

## Lore's own tools against the test-area vault

How they ran, with no new sign-in and no Lore install:

- Lore's CLI from the research clone at commit `6e741b1` (`dist/cli.js`,
  version 1.0.0), not the npm package.
- A scratch `.lore.yaml` with `vault.pageId` of the test-area Memory page,
  `features.runTool.enabled: false`, and `autoSave`, `wakeUp`, and
  `autoDigest` off. It holds no token.
- `NOTION_API_TOKEN` came from `ntn auth token --plain` inside the same
  command line, so it lived only in that one command's environment. It was
  never written to a file or printed. Output went through a filter that hides
  anything shaped like a token.
- `HOME` pointed at a scratch folder, plus `LORE_USE_RUNTOOL=0`,
  `LORE_AUTOSAVE=false`, and `LORE_AUTO_DIGEST=false`.

`lore doctor` (paths shortened):

```text
Auth
  Source: NOTION_API_TOKEN (env)
  Token prefix: personal token (ntn_)
  Status: ok

Vault
  Vault page: accessible (Memory)
  Required databases: present
  Status: ok

Next action:
  No action needed.
```

`lore migrate --dry-run` (Lore's drift check):

```text
Vault schema is up to date. Nothing to migrate.

Dry run — no changes written. Re-run without --dry-run to apply.
```

`lore status` found the project by Path "." and counted the toolkit rows:

```text
  Current project: Lore layout check 2026-09-27T21-20-24-212Z (.)
Database counts:
  Projects: 1
  Topics:   0
  Memories: 3
  Facts:    0
```

`lore search`:

| Command | Found |
| --- | --- |
| `lore search zephyr --json` | 1: "Zephyr runbook", tags `reference`, synopsis "Where the Zephyr runbook lives", kind `note`, status `accepted` |
| `lore search runbook --json` | the same row |
| `lore search quokka --json` | 0 (the word is only in the body) |

Lore's MCP server over stdio (`lore mcp`, read calls only):

- `lore-context action='wake-up'`: "Project: Lore layout check ..." and, under
  "Recent Memories", "Zephyr runbook" and "Rollout", each with its synopsis and
  `manual | <type> | 2026-09-27`.
- `lore-query action='recall'`: "3 recent memories": Release days, Zephyr
  runbook, Rollout, each `manual | accepted | <type> | by Mike | 2026-09-27`.
- `lore-memory action='expand'` on Release days: the record body as the
  toolkit wrote it (`**Remember:** Any weekday.` ...).
- Focus and glossary do not appear. They are child pages, not rows, as decided.

## The showcase project under Mike's real root page

Project "Toolkit V2 sample (safe to delete)", folder
`scratchpad/runs/notion-showcase`. Only that row was written.

1. `toolkit notion ensure-project --check` (exit 1, nothing written):
   "The Memory page (Lore layout) is missing." and "This project's memory is
   still in the older Memory database (...bc72ab3e...). Run toolkit notion
   ensure-project without --check to move its records into the Lore layout."
2. `toolkit notion ensure-project` (exit 0): created the Memory page, the five
   databases, the Index and Retired views, and the project row on the Memory
   page. Notes: "Moved 1 record from the old Memory database into the Memories
   database on the Memory page (Lore layout). Each one reads back with the
   same text and version." and "The old Memory database was left in place and
   renamed "Old memory database (safe to delete)". Nothing was deleted."
3. `toolkit notion ensure-project` again: "Everything was already in place."

| Check | Before | After |
| --- | --- | --- |
| `project_signup_storage` version | `413273b47994a0d3fa34c5565321ca803dc86eb45c765e729e5091663b08b6a3` | the same; the text is identical |
| `toolkit memory list --status all` | 1 record | the same list |
| Current focus text and version | | the same |
| `toolkit memory status` | | "Healthy: yes", "1 current, 0 needing review, 0 retired" |

Read back from Notion afterwards:

```text
Showcase row children: database "Work Items"; database "Old memory database (safe to delete)"; page "Current focus"; page "Terminology glossary"; page "Memory"
Memory page children: database "Projects"; database "Topics"; database "Memories"; database "Entities"; database "Facts"
Lore properties checked: 74; missing or different: none
Old database bc72ab3e-63f9-4cef-8dc8-15397957e811: title "Old memory database (safe to delete)", in trash: false, rows: 1 (project_signup_storage in trash false)
Memories row: Title "Sign-ups are stored in one JSON file", Record Key project_signup_storage, Keywords project_signup_storage, Kind note, Tags project, Status accepted, Source manual, Author Mike Rihm, Project -> 3e8b381d-a176-81f7-98bc-e6c2000899b7
Memory page Projects rows: "Toolkit V2 sample (safe to delete)" Path "." Type project Status active id 3e8b381d-a176-81f7-98bc-e6c2000899b7
Registry "Memory data source" on the showcase row: 4e065b45-816d-4047-878f-21bf5fc601e2 (Memories data source 4e065b45-816d-4047-878f-21bf5fc601e2)
```

| What | Link |
| --- | --- |
| Showcase Memory page | https://app.notion.com/p/Memory-3e8b381da1768185a386e7bf04e4fea2 |
| Its Memories database | https://app.notion.com/p/0946b0ef04a7497db9c4b3230adc5ea0 |
| The moved record | https://app.notion.com/p/Sign-ups-are-stored-in-one-JSON-file-3e8b381da176813f8f94e60f1564feaf |
| Old memory database (safe to delete) | https://app.notion.com/p/bc72ab3e63f94cef8dc815397957e811 |

The showcase `.toolkit.json` memory block now has `layout: "lore"`, the Lore
version and commit, the Memory page, the five database ids, the project row on
the Memory page, the property ids, the views, the same focus and glossary
page ids, and `migratedFrom` (the old database, the date, 1 record). Lore's own
tools were not run against the showcase; they ran only in the test area.

## Found during the run

1. **Lore's read tools write one column.** After the MCP calls, the three
   test-area rows had "Last Referenced At" set to 2026-09-27 and a new
   last-edited time. Lore's MCP read helpers call `touchOnRead`
   (`src/mcp/helpers.ts`). The toolkit record text and version did not change
   (`reference_zephyr_runbook` still reads back as `eec0eae77109...`). The
   only effect on the toolkit: its local cache reads those bodies again once.
2. **The `ntn` default workspace changed during this session.** At 17:13 EDT
   a file-mode sign-in appeared in `~/.config/notion/` (`auth.json`) for
   "Entrevest Workspace", and `config.json` now names that workspace as the
   default. This session did not make that change and did not undo it. Effect:
   `ntn whoami` and every toolkit Notion command fail with "No auth token found
   for the current workspace" unless `NOTION_WORKSPACE_ID` names the Personal
   workspace (`e71d21b2-dd2c-4d2a-81ba-4cec2ca093bd`), where the Keychain
   sign-in for "AI Agent Second Brain" still works. Every live command in this
   run set `NOTION_WORKSPACE_ID` for that command only. Mike decides whether to
   switch the default back or keep the other workspace.
3. **Table style is part of the version on this computer.** The Notion driver
   keeps each record's table style in its Git-ignored cache. The move keeps
   those cache entries, so a record with a table keeps its version. (A cache
   reset during the move would have changed one test record's version; the
   unit test caught it and the code was changed before the live run.)

## Not done here

- `dev/ARCHITECTURE.md` section 7 (line 418) and
  `plugins/memory/skills/memory-save/references/record-format.md` (line 273)
  still say "the project's Memory database". They should name the Memory page
  in Lore's layout.
- `toolkit doctor` does not yet warn when a project still uses the older
  Memory database; `ensure-project --check` does.
- The `toolkit` plugin version was not raised; Codex sees this change only
  after a version bump.
- `dev/PROGRESS.md` was not changed.

## Commands to repeat the checks

```bash
node --test "plugins/toolkit/tests/**/*.test.mjs"
TOOLKIT_LORE_CLONE=<built Lore clone at 6e741b1> node --test plugins/toolkit/tests/notion/lore-layout.test.mjs
NOTION_WORKSPACE_ID=<Personal workspace id> TOOLKIT_NOTION_LIVE=1 node plugins/toolkit/tests/notion/live/run-lore-live.mjs
```

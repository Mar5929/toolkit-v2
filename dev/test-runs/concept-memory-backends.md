# Concept memory check: built-in, Notion, and Hindsight

Run on 2026-09-28 from 22:13 to 22:27 EDT (02:13 to 02:27 UTC on
2026-09-29), with the `toolkit` command only (no agent sessions). The same
script ran in three scratch projects, one per memory backend, and the
outputs were compared step by step with built-in memory.

## Result

**Passed.** Notion memory (Lore layout) and Hindsight memory store, read,
change, rename, and list concepts the same way built-in memory does.

- Notion: all 28 steps and all 4 hand-edit steps give the same output as
  built-in memory, including the same stored text and the same version
  (SHA-256) after every change.
- Hindsight: 25 of 28 steps give the same output, with the same stored text
  and versions. The 3 steps that differ are `toolkit memory find`. Hindsight
  searches by meaning and sorts hits into answers, "may be about it", and
  "closest", as designed. One difference is not by design (finding F1): a
  Hindsight hit shows the start of the concept, not the section that
  matched.
- Two findings (F1, F2) and two limits of this check are listed at the end.
  None of them changes what is stored or blocks using concept memory.

## Code that ran

| What | Value |
| --- | --- |
| Command | `node /Users/michaelrihm/Documents/Projects/toolkit-v2/plugins/toolkit/bin/toolkit`, the working tree (toolkit 0.2.9, memory 0.2.9). `diff -rq` against `~/.claude/plugins/cache/toolkit-v2/toolkit/0.2.9` showed no difference. |
| Files (first 12 characters of SHA-256) | `lib/memory/concepts.mjs` 7832cc24979f, `lib/memory/notion.mjs` 6107b2f481af, `lib/memory/hindsight.mjs` 5ac395cee221 |
| Environment | `CLAUDE_CONFIG_DIR`, `CODEX_HOME`, and `TOOLKIT_V2_CONFIG_DIR` in a scratch folder. `HOME` stayed real, because `ntn` keeps its sign-in there. Mike's `~/.config/toolkit-v2/` was not changed (`plugin-root` still names the 0.2.9 cache, last changed 22:11, before this run). |
| Scratch folder | `<scratchpad>/concept-check/`, where `<scratchpad>` is `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad`. It holds `scenario.sh`, `hand-edit.sh`, `compare.mjs`, every step's output in `out/<backend>/`, the Notion and Hindsight reads in `native/`, and the exports in `export/`. |

## The three projects

Each is a new Git repository with one commit, set up with
`toolkit init --tracker local --owner 'Mike Rihm' --backup-dir none`.

| Backend | Name and key | Where the memory is |
| --- | --- | --- |
| Built-in | "Toolkit V2 concept memory check builtin", `tkv2-concepts-builtin` | `.memory/` in the scratch project |
| Notion | "Toolkit V2 concept memory check (safe to delete)", `tv2-concept-check` | A new row in the Projects database under Mike's real "AI Agent Second Brain" page `3e7b381d-a176-803f-a48f-e838ee648e67`. First `toolkit notion ensure-root --root-page ... --check`, then without `--check`: "Nothing was missing", so nothing on the root page changed; only the scratch `notion.json` was written. |
| Hindsight | "Toolkit V2 concept memory check hindsight", `tkv2-test-concepts` | Bank `tkv2-test-concepts` on `127.0.0.1:8888`, made by init ("Hindsight memory bank: tkv2-test-concepts (new)") and deleted at the end |

Notion links:

| What | Link |
| --- | --- |
| Project row | https://app.notion.com/p/Toolkit-V2-concept-memory-check-safe-to-delete-3eab381da176819e881de370a6186104 |
| Memory page (Lore layout) | https://app.notion.com/p/Memory-3eab381da17681de8fb6df1a06127f5e |
| Memories database, Index view | https://app.notion.com/p/964115e1a9c24825ad2defb9248b0c6d?v=964fa008e3564a6b8b4ee7c3b11d68ff |

## Steps and results

Every step ran `toolkit memory ...` with `--approved-by 'Mike Rihm'` on each
save. The exit code is the same in all three backends for every step.

| Step | Command (short) | Exit | Same as built-in |
| --- | --- | --- | --- |
| 01 | New concept `feedback_ways_of_working`, title "Ways of working", summary "How Mike wants the agent to work with him", section "Questions" | 0 | Notion yes, Hindsight yes |
| 02, 03 | `--concept feedback_ways_of_working --section 'Replies'`, then `'Commits'` | 0 | yes, yes |
| 04 | New concept `project_billing`, title "Billing", summary "Billing: Stripe setup, invoices, and refunds", section "Stripe" | 0 | yes, yes |
| 05, 06 | Sections "Invoice day" and "Refund window" | 0 | yes, yes |
| 07 | Section "Billing changes" in `feedback_ways_of_working`, with links `[the refund window](project_billing.md#Refund%20window)` and `[billing](project_billing.md)` | 0 | yes, yes |
| 08 | Replace "Replies" without `--expect`: refused, "already has a section "Replies", so it was not changed" | 2 | yes, yes |
| 09 | Replace "Replies" with `--expect <version>` | 0 | yes, yes |
| 10 | `--append` to "Invoice day" | 0 | yes, yes |
| 11 | New record `project_invoice_timing` with the text of "Invoice day": refused, names `project_billing`, section "Invoice day", and the `--concept` command | 2 | yes, yes |
| 12, 13 | `memory get` both concepts | 0 | yes, yes (same version) |
| 14, 15 | `memory find 'refund window'`, `'invoice day'` | 0 | Notion yes; Hindsight no (see below) |
| 16, 17 | `memory list`, `memory list --json` | 0 | yes, yes |
| 18 | `memory rename project_billing --to project_invoicing`: `linksRepaired: ["feedback_ways_of_working"]` | 0 | yes, yes |
| 19 | `get feedback_ways_of_working`: both links now name `project_invoicing.md`, the section anchor kept | 0 | yes, yes |
| 20 | `get project_billing`: "There is no memory record with the key project_billing." | 1 | yes, yes |
| 21 | `get project_invoicing`: same three sections | 0 | yes, yes |
| 22 | `--section 'Refund window' --remove --expect <version>`: "Removed from memory: Refund window (in Billing)", `linksRepaired: ["feedback_ways_of_working"]` | 0 | yes, yes |
| 23 | `get project_invoicing`: sections "Stripe" and "Invoice day" only | 0 | yes, yes |
| 24 | `get feedback_ways_of_working`: the section link became `[the refund window](project_invoicing.md)` | 0 | yes, yes |
| 25 | `find 'refunds are allowed for 30 days'` | 0 | Notion yes; Hindsight no (see below) |
| 26, 27 | Final `memory list` and `list --json` | 0 | yes, yes |
| 28 | `memory status --json`: `problems: []` | 0 | yes, yes |

The version of each concept after each change, first 12 characters, the
same in all three backends:

| Read | Version |
| --- | --- |
| 12, ways of working | a00813c3e834 |
| 13, billing | 67a2a5b726ee |
| 19, ways of working after the rename | 66288fd65417 |
| 21, billing under its new key | 57e1207ee308 |
| 23, billing after the section was removed | a8da1d1c7f83 |
| 24, ways of working after the section was removed | c01e998c382b |

The final listing, the same in all three backends:

```text
- feedback_ways_of_working: Ways of working — How Mike wants the agent to work with him (updated 2026-09-28)
- project_invoicing: Billing — Billing: Stripe setup, invoices, and refunds (updated 2026-09-28)
```

`compare.mjs` leaves out only fields that name the backend or its storage
(`backend`, `location`, `path`, `bank`, `detail`, `lastSave`, `lastExport`,
`mode`, `score`, `healthy`) and compares everything else.

### The find steps in Hindsight

- Step 14 (`'refund window'`): both backends give the same two records in the
  same order. Built-in and Notion show `Refund window: **Remember:** Refunds
  are allowed for 30 days.` Hindsight shows the first 160 characters of the
  concept: `# Billing ## Stripe **Remember:** Stripe handles invoices and
  refunds. ## Invoice day ...`, which does not include the matching section
  (F1).
- Step 15 (`'invoice day'`): built-in gives `project_billing` as a result;
  Hindsight gives it as a result and lists `feedback_ways_of_working` under
  "closest".
- Step 25 (after the section was removed): built-in gives both concepts as
  keyword hits (the word "refunds" is still in "Stripe" and "Billing
  changes"); Hindsight gives no answer, `project_invoicing` under "may be
  about it", and `feedback_ways_of_working` under "closest". Neither backend
  still holds the removed fact.

## Hand edits in another section (built-in and Notion)

`hand-edit.sh` ran after the scenario. The owner's edit was made in the
"Questions" section: a file edit in `.memory/` for built-in, and a `PATCH
v1/pages/<id>/markdown` `update_content` call for Notion (a stand-in for an
edit in the Notion app). Hindsight has no place for the owner to edit a
record, so it was not part of this check.

| Step | What | Built-in | Notion |
| --- | --- | --- | --- |
| h3 | Replace "Replies" with the version read before the hand edit | Refused, exit 2, "changed since it was read, so it was not saved" | Same, same versions in the message |
| h4 | Replace "Replies" with a fresh version | exit 0 | exit 0 |
| h5 | Add section "Tools" | exit 0 | exit 0 |
| h6 | `get` | The hand edit ("..., with your recommendation.") is kept, "Replies" says "eight lines", "Tools" is added | The same text and version |

## What each backend stores

**Built-in.** `.memory/feedback_ways_of_working.md` and
`.memory/project_invoicing.md`; no `project_billing.md` and no
`archive/` file. `MEMORY.md` groups by prefix:

```text
## Feedback

- [Ways of working](feedback_ways_of_working.md) — How Mike wants the agent to work with him (updated 2026-09-28)

## Project

- [Billing](project_invoicing.md) — Billing: Stripe setup, invoices, and refunds (updated 2026-09-28)
```

**Notion.** The Memories database has two rows, one per concept (query of
data source `c0b251d7-30ca-4b29-a9c8-c92b32339bfd`):

| Page | Record Key | Title | Synopsis | Saved | Status | Tags |
| --- | --- | --- | --- | --- | --- | --- |
| `3eab381d-a176-813f-83c0-e6821084a8f9` | feedback_ways_of_working | Ways of working | How Mike wants the agent to work with him | 2026-09-28 | accepted | feedback |
| `3eab381d-a176-81dd-a155-fee2626f9d46` | project_invoicing | Billing | Billing: Stripe setup, invoices, and refunds | 2026-09-28 | accepted | project |

- The rename kept the same page (created 02:17 UTC as `project_billing`)
  and changed its Record Key and Keywords. No `project_billing` row is left.
- Each page body holds the concept's sections as `##` headings, without the
  `# Title` line (it is the Title column). The billing page after the
  removal: `## Stripe`, `## Invoice day` (with the appended line), and no
  "Refund window".
- The Index view (`964fa008-...`) is a table sorted by Record Key, so
  concepts with the same prefix sit together, and leaves out superseded,
  deprecated, and rejected rows. The API does not return which columns the
  view shows, so this check could not confirm that Synopsis and Saved are
  visible in the Notion app.

**Hindsight.** Bank `tkv2-test-concepts` before it was deleted:
`total_documents: 2`, `total_nodes: 2`.

| Document | Tags | Metadata |
| --- | --- | --- |
| feedback_ways_of_working | type:feedback, status:current, kind:record | title "Ways of working", description "How Mike wants the agent to work with him", updated 2026-09-28, sections "Questions \| Replies \| Commits \| Billing changes" |
| project_invoicing | type:project, status:current, kind:record | title "Billing", description "Billing: Stripe setup, invoices, and refunds", updated 2026-09-28, sections "Stripe \| Invoice day" |

- `GET .../documents/project_billing` gave HTTP 404 after the rename.
- A direct recall for "Refunds are allowed for 30 days" gave 2 hits; neither
  text holds "30 days" or "project_billing".

**Export.** `toolkit memory export` from each project:
`project_invoicing.md` is byte for byte the same in all three.
`feedback_ways_of_working.md` is the same in built-in and Notion; the
Hindsight copy differs only by the hand-edit steps it did not run.
(Unrelated to concepts: the Notion glossary export writes the table rule as
`|---|` where the built-in file has `| --- |`, and the Hindsight project has
no focus or glossary document until one is saved.)

## Findings

| # | Severity | Finding | Where | Suggested fix |
| --- | --- | --- | --- | --- |
| F1 | Low | A Hindsight `find` hit shows the first 160 characters of the concept, not the section that matched. Built-in and Notion show the matching section (`Refund window: ...`). The `memory-find` skill, step 3, says "the hit shows only the part that matched". The skill also says to read the whole concept before using a hit, so the agent still gets the fact, but the snippet can point at the wrong part of a large concept. | `plugins/toolkit/lib/memory/hindsight.mjs` line 497, `const snippet = stripFrontmatter(...).slice(0, 160)` | Build the snippet with the same section choice `keywordScore` uses (`bestSection` in `lib/memory/contract.mjs`) on the hit's text. |
| F2 | Low | Links between concepts in Notion are stored as Markdown file links: the Notion API returns `href = project_invoicing.md` for both links in the "Billing changes" section. The toolkit reads and repairs them correctly, but they are not Notion page links, so a click in the Notion app will not open the Billing page. Not tried in the Notion app. | Notion page `3eab381d-a176-813f-83c0-e6821084a8f9` | A decision for the lead or Mike: keep file links (the same text in every backend and in exports), or write Notion page links in Notion and turn them back into file links on read. |

Limits of this check:

- Every change happened on one day, so the `updated` date could only be
  checked as "today" (2026-09-28). A change on a later day was not seen.
- Driven by the CLI only; no Claude Code or Codex session ran, so the
  `memory-save` and `memory-find` skills were not part of this check.

## Checks run after the scenario

| Check | Result |
| --- | --- |
| `node --test "tests/**/*.test.mjs"` in `plugins/toolkit` | 979 tests: 976 pass, 0 fail, 3 skipped, 98 seconds |
| `node --test "plugins/git-workflows/tests/*.test.mjs"` | 14 pass, 0 fail |
| `node dev/tools/check-skills.mjs --quiet` | 0 failures, 0 warnings, 16 notes (the recorded exceptions) |
| `node dev/tools/sync-skill-references.mjs --check` | 159 copies, 0 problems |
| `node dev/tools/import-model.mjs --check` | Matches the approved model folder (112 files, commit `648bf4e`) |
| `claude plugin validate .` | Passed |

## What was left behind

- Hindsight: bank `tkv2-test-concepts` deleted
  (`DELETE /v1/default/banks/tkv2-test-concepts`: "deleted successfully",
  `deleted_count: 4`). The bank list no longer names it.
- Notion: the project row "Toolkit V2 concept memory check (safe to
  delete)" (Key `tv2-concept-check`), its Memory page, the five Lore
  databases, and the two concept pages stay under Mike's root page. Delete
  the row in the Notion app when it is no longer needed.
- Scratch projects and outputs in `<scratchpad>/concept-check/`. No file in
  this repository was changed except this one.

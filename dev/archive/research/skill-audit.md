# Skill, reference, and hook audit

Written 2026-09-28 for Mike's request of the same day: every process the
agent must run a certain way in a Toolkit V2 project has a skill, and each
skill carries the procedural detail it needs as reference files inside its
own folder. The rules used are `dev/research/skill-writing-guide.md` (rule
ids such as R1 and B9 below) and the captured official pages it cites in
`ai-external-knowledge/`. Nothing in this file is shipped. Nothing was
changed while writing it.

## Contents

1. Findings in short
2. What was checked, and the rule behind each check
3. Process inventory
4. Findings in detail, with evidence
5. Shared text: one source, generated copies
6. The standard shape for a SKILL.md
7. Proposals per skill
8. Hooks audit
9. Items for Mike
10. Order of work for the next steps

---

## 1. Findings in short

- **References leave their skill folder.** 44 relative links in 15 files
  point outside the skill's own folder, most of them to
  `plugins/work/references/` (`../../references/conventions.md`). Two
  references link three folders up (`../../../references/...`). The Agent
  Skills specification says file references are relative to the skill root
  and one level deep; Codex tells its model to prefer files linked directly
  from `SKILL.md`. `memory-find` points at "the work plugin's
  `references/trackers.md`", which no relative path from the memory plugin
  can reach in either host.
- **Shared text is copied by hand.** The command-running paragraph (about
  180 words) sits at the top of 13 `SKILL.md` files; 8 work skills carry the
  same sentences word for word, and nothing checks them.
  `plugins/session-skills/references/conventions.md` is a hand copy of the
  work plugin's conventions ("Keep the wording the same as the work
  plugin's"). `memory-save/references/record-format.md` holds a hand copy of
  the model's `.memory/memory-criteria.md`. The Codex Git escalation
  paragraph is written separately in 5 skills.
- **Steps are packed into single long lines.** The 40-line rule for steps
  passes because 20 numbered steps in 8 skills are single lines of more than
  700 characters (longest: `work-finish` step 2, 1,605 characters). Each of
  those steps holds 5 to 10 separate instructions and exceptions. The ported
  skills (`handoff`, the four Git skills) already use the documented shape:
  short numbered steps at the top and "Step N in detail" sections below.
- **No reference over 100 lines has a contents list.** 9 files, from 127 to
  394 lines (R3).
- **No skill has a Gotchas section** (B9), and only `solution-design`'s
  `design-process.md` has a checklist for a gated multi-step workflow (B10).
- **Some processes have no reference at all:** the Notion tracker's own
  behavior (the Archived box, trashed cards, the board link, Markdown
  limits), the memory backends side by side (built-in vault, Hindsight,
  Notion in Lore's layout), backup and restore, the `DECISIONS.md` log, test
  plans, and owner edits made in Obsidian.
- **Two Git skills lack the Codex sandbox rule.** `pull-latest` and
  `reset-to-remote` run `git fetch`, `git merge`, and `git reset --hard`, and
  say nothing about Codex's read-only `.git/` and escalated permissions.
- **Hooks follow the official guidance** on events, matchers, output shape,
  exit codes, and timeouts. One real gap: a hook that fails writes to
  `<git common dir>/toolkit-v2/hook-errors.log`, and nothing reads that log,
  so a failed guard lets the tool call through with no sign to the agent or
  the owner.
- **Descriptions** are in good shape (routing round 3: Claude Code 0.974,
  Codex 0.947). This audit changes no description. One routing miss (O21)
  needs a `work-on` body change, listed in section 7.

---

## 2. What was checked, and the rule behind each check

| Check | Rule | Official source |
| --- | --- | --- |
| `SKILL.md` is lean: steps first, detail in references, under 500 lines and about 5,000 tokens | B1, B2 | `anthropic-agent-skills/agentskills-specification.md` "Progressive disclosure"; `claude-code/skills.md` "Skill content lifecycle" (only the first 5,000 tokens survive compaction) |
| Each reference is linked from `SKILL.md`, with when to open it | R1, R2 | `anthropic-agent-skills/agentskills-best-practices.md` "Structure large skills with progressive disclosure" |
| References are one level deep, inside the skill folder | R1, R4 | `agentskills-specification.md` "File references"; `codex/source-skills-catalog-prompt.md` ("prefer opening only files directly linked from `SKILL.md`") |
| A reference over 100 lines starts with a contents list | R3 | `anthropic-agent-skills/skill-authoring-best-practices.md` "Structure longer reference files with table of contents" |
| A reference covers one subject; variants (trackers, backends) are separate files | R3 | `skill-authoring-best-practices.md` "Pattern 2: Domain-specific organization"; `codex/source-skills-catalog-prompt.md` ("When variants exist ... pick only the relevant reference file(s)") |
| Gated multi-step work has a checklist and a check-fix-repeat loop | B10, B11 | `agentskills-best-practices.md` "Checklists for multi-step workflows", "Validation loops", "Plan-validate-execute" |
| Gotchas sit in `SKILL.md` | B9 | `agentskills-best-practices.md` "Gotchas sections" |
| Examples where the output shape matters | B10 | `skill-authoring-best-practices.md` "Examples pattern", "Template pattern" |
| Strictness matches how easily a step breaks | B7, B8 | `skill-authoring-best-practices.md` "Set appropriate degrees of freedom" |
| No text that can drift: one source for shared text | B12 | `skill-authoring-best-practices.md` "Use consistent terminology" |
| Each skill works in both hosts from its own folder | B14, R4, A9 | `codex/build-skills.md`; `claude-code/skills.md` "Available string substitutions" (`${CLAUDE_PLUGIN_ROOT}` reaches shared plugin files, but Toolkit V2 bans it because Codex shows it as literal text) |
| Hooks: event, matcher, output, exit code, timeout, message wording | H1 to H13 | `claude-code/hooks.md`, `claude-code/hooks-guide.md`, `codex/hooks.md` |

---

## 3. Process inventory

"Lives now" says where the procedure is written today. "CLI" means the
`toolkit` command's own output, which is a single source and needs no copy.

### 3.1 Work tracking

| # | Process | Owner skill | Lives now | Gaps |
| --- | --- | --- | --- | --- |
| P1 | Lifecycle and stages | `work-on` routes; each stage skill | CLI `toolkit work lifecycle` (stage table, "Continue with", gates, "What counts as approval"); `work-on` step 5 | The CLI is the right single source. `work-on` step 5 restates the routing in 1,180 characters, which can drift from the CLI's "Continue with" column, and lacks the O21 case (the owner asks to be interviewed first). |
| P2 | Approvals and gates | the skill that asks each gate; `work-decide` for later answers | CLI "Approval gates"; `work-requirements` step 8, `solution-design` step 8, `work-check` steps 6 and 7, `work-finish` step 1, `work-decide` steps 4 and 5; `closing.md` and `merge-and-clean-up` step 2 for the standing merge instruction | The same record-an-approval sequence (quote note, approve command, `waiting_on`, next skill) is written 5 ways. No checklist. The standing merge instruction is defined twice. |
| P3 | Local tracker: folders, identity, nesting, moves, state, dashboard | `work-organize` | model rule `work-item-folders.md`; `work-organize/references/moves.md`; `plugins/work/references/trackers.md` "Local and Notion"; conventions "Owner edits win"; CLI | Spread over 4 files in 2 plugins. `conventions.md` contradicts itself on direct body edits (lines 16 to 18 allow the file edit tool; line 82 says only `toolkit work` commands). |
| P4 | Notion tracker | none; `work-organize` for moves | `trackers.md` (8 lines), `moves.md` (one bullet), `project-setup/references/repair-and-wiring.md` (wiring only) | No reference. The Archived box (`toolkit work move --under archive` ticks it), trashed cards, the board link (`work-status` step 6 says "from the Notion ids" without saying how), Markdown limits, and a lost `ntn` sign-in are not written for the agent. |
| P5 | GitHub Issues and Jira | every work skill | `plugins/work/references/trackers/github.md` and `jira.md`; the CLI's exit-3 message prints that path (`lib/work/driver.mjs`, `trackerInstructionsPath`) | Reached through `../../`; both files link back to `../trackers.md`; templates are reached through `~/.config/toolkit-v2/plugin-root` into the toolkit plugin's `scaffold/model/`. |
| P6 | `WORK-ITEM.md` and `DESIGN.md` formats | every work skill | `plugins/work/references/conventions.md` "Section names"; the model templates; `planning.md` and `writing-requirements.md` hold example blocks | Only inside a 394-line shared file with no contents list. |
| P7 | Requirements and spec check | `work-requirements` | `SKILL.md`; `references/writing-requirements.md` (128 lines: interview, writing, spec check, approval) | No contents list; four subjects in one file; approval sequence duplicated. |
| P8 | Solution design with helper agents | `solution-design` | `SKILL.md`; `references/design-process.md` (233 lines, with a checklist); `team-roles.md`, `helpers.md`; 4 agent files | Good checklist. No contents list; links three folders up; the host-specific draft handling (Claude Code returns the draft in the reply, Codex uses a `mktemp -d` file) sits only in step 6 prose. |
| P9 | Planning and build (stages 06 to 08) | `work-on` | `SKILL.md` steps 6 and 7; `references/planning.md` | Git and Codex rules written inline; `planning.md` points at `conventions.md` outside the skill. |
| P10 | Delivery offer and team arrangements | `work-delegate` | `SKILL.md`; `references/agent-led-delivery.md` (159 lines); `references/team-arrangements.md` | Sound content. No contents list; `team-arrangements.md` line 61 carries a dated host observation ("on 2026-09-21", B12). |
| P11 | Checking and acceptance | `work-check` | `SKILL.md` only; `helpers.md`; `acceptance-checker` | The test-plan procedure is one sentence in step 2; no reference; the fix and re-check loop is not a checklist. |
| P12 | Shipping, closing, spec update, cancel | `work-finish` (with `merge-and-clean-up`, `publish-docs`, Salesforce skills) | `SKILL.md`; `references/closing.md` (127 lines) | Step 2 is 1,605 characters; no-remote merge and Codex Git rules inline; the conditions for Done are not a checklist; `closing.md` links three folders up. |
| P13 | Decisions and the decision log | `work-decide` | `SKILL.md` "Project-wide decisions"; CLI `toolkit decision add`; `publish-docs` step 3 | No reference for the `DECISIONS.md` columns, the append-only rule, `--replaces`, a worded standing merge instruction, or the order of work across `work-decide` and `publish-docs`. |
| P14 | Status | `work-status` | `SKILL.md` | Fine. No example answer; the Notion board link method is unstated. |
| P15 | Splitting, moving, archiving, reconciling hand moves | `work-organize` | `SKILL.md`; `references/moves.md`; CLI | The Notion cases (a ticked Archived box, a trashed card) are missing. |

### 3.2 Memory

| # | Process | Owner skill | Lives now | Gaps |
| --- | --- | --- | --- | --- |
| P16 | Built-in vault, Obsidian links, link repair | `memory-save`, `memory-tidy` | `record-format.md` "Links between memories"; model `.memory/AGENTS.md` | The model text (`.memory/AGENTS.md` line 17) tells the agent to repair links by hand; the CLI repairs them and names each note it changed. Owner edits made in Obsidian (a renamed note, edited frontmatter, a note moved into a subfolder) are not covered. |
| P17 | Record format and types | `memory-save` | `record-format.md` (324 lines, 11 subjects) | No contents list; one file for every subject; `memory-find` does not link it. |
| P18 | Approval policy and proposals | `memory-save` (the only written copy, per Mike); `work-decide` asks about proposals | `memory-save` step 3; `record-format.md` "Proposals"; model rule `memory-review-and-save.md` | `memory-tidy` depends on "memory-save step 3" in another skill's folder. |
| P19 | Duplicate check | `memory-save`, `memory-tidy` | `memory-save` step 2; `record-format.md` "Duplicates"; `memory-tidy` step 5 | The same exit-2 decision tree is written 3 times. |
| P20 | Retire, supersede, rename, delete, clean deletes | `memory-save`, `memory-tidy` | `memory-save` steps 4 and 5; `record-format.md` "Replacing, retiring, and merging"; `memory-tidy` step 5 | What a delete also clears (the briefing cache, the Hindsight document, the Notion cache) is not stated in any skill text. |
| P21 | Current focus and glossary | `memory-save`; also every work skill, `handoff`, `project-setup` | `record-format.md` "Current focus"; work `conventions.md` "The current focus"; `handoff` step 3; `memory-save` step 6; `project-setup` step 8 | Five places describe the same format and the same read-change-save sequence. |
| P22 | Backup and restore | `memory-tidy`; `project-setup` for switching and a new computer | `memory-tidy` step 6 and "Backups"; `repair-and-wiring.md` "Switching the memory backend", "A new computer" | The tracker restore in `memory-tidy` has no dry-run step; `--replace` is not explained. |
| P23 | Hindsight and Notion (Lore layout) differences | the three memory skills | `record-format.md` "Backends" (11 lines); `memory-find` "Search tips"; `memory-save` "Backend notes" | No backend reference. Hindsight's result wording ("about", "may be about it", "closest") is explained only in `memory-find`. The Lore rules (never rename a Lore property; Lore's own saving stays off) are not in any skill. |
| P24 | Finding and citing | `memory-find` | `SKILL.md` | The pointer to the work plugin's tracker file cannot resolve; one answer example only. |

### 3.3 Sessions

| # | Process | Owner skill | Lives now | Gaps |
| --- | --- | --- | --- | --- |
| P25 | Handoff between sessions | `handoff` | `SKILL.md` (393 lines, about 4,300 tokens); `references/edge-cases.md`; `plugins/session-skills/references/conventions.md`; `agents/handoff-verifier.md` | Close to the 5,000-token budget, and after compaction only the first 5,000 tokens are kept. Detail for steps 2 to 5 is inline. The conventions file is a hand copy. |
| P26 | Session summary | `session-summary` | `SKILL.md` | Fine. |

### 3.4 Git

| # | Process | Owner skill | Lives now | Gaps |
| --- | --- | --- | --- | --- |
| P27 | Publishing documents | `publish-docs` | `SKILL.md`; `scripts/publish-docs.mjs` | "Recover without losing work" is needed only on failure but loads every time. The Codex paragraph is one of 5 hand copies. |
| P28 | Merging and cleaning up | `merge-and-clean-up` | `SKILL.md` (236 lines) | Good shape. Its standing-merge-instruction rule is a second copy of `closing.md`'s. |
| P29 | Pulling the latest | `pull-latest` | `SKILL.md` | No Codex sandbox guidance, although it runs `git fetch` and a merge pull. |
| P30 | Resetting to the remote | `reset-to-remote` | `SKILL.md` | Same Codex gap. Codex can start it on its own: there is no manual-only setting (guide D15). |

### 3.5 Setup

| # | Process | Owner skill | Lives now | Gaps |
| --- | --- | --- | --- | --- |
| P31 | New project setup | `project-setup` | `SKILL.md`; `references/interview.md` (180 lines) | Steps up to 1,511 characters; no setup checklist; no contents list. |
| P32 | Repair, update, new computer, switching, wiring Notion and Hindsight | `project-setup` | `references/repair-and-wiring.md` (177 lines, 8 subjects) | One file for 8 subjects; names the work plugin's tracker files, which it cannot reach. |

### 3.6 Cross-cutting rules

| # | Process | Used by | Lives now | Gaps |
| --- | --- | --- | --- | --- |
| P33 | Running `toolkit` commands safely in both hosts (one command per call, quoting, standard input, exit codes) | every skill that runs `toolkit` | the paragraph at the top of 13 `SKILL.md` files; work `conventions.md` "Running `toolkit` commands" and "Text in a command"; session `conventions.md`; the pre-tool hook enforces part | Hand copies; no check. |
| P34 | Git rules and the Codex sandbox (item branches, staging by name, no AI credit, no remote, conflict merges, escalated permissions) | `work-on`, `work-finish`, `publish-docs`, `merge-and-clean-up`, `project-setup`; missing in `pull-latest`, `reset-to-remote` | work `conventions.md` "Branches and worktrees"; inline paragraphs | Five hand copies; two skills without it. |
| P35 | Helper agents and the Codex agent fallback | 6 work skills, `handoff` | `helpers.md`, `team-roles.md`, the fallback line in each skill (checked by `check-skills.mjs`), `agents/*.md` | In Codex the agent reads `agents/<name>.md` outside its skill folder. |
| P36 | Voice and the Codex output-style fallback | every skill | the voice line (checked against work `conventions.md`); model `AGENTS.md` "How to write replies"; each agent carries its own writing rules | Works. Its source moves when `conventions.md` is split (section 5). |
| P37 | Session briefing and keep-phrase reminders | hooks | `lib/hooks/`, `lib/project/brief.mjs` | See section 8. |

### 3.7 Salesforce project skills (model copies; proposals only)

| # | Process | Skill | Lives now | Gaps |
| --- | --- | --- | --- | --- |
| P38 | Component tracking | `sf-component-tracker` | `SKILL.md` (183 lines) | Numbered steps start at line 38; the schema, flags, and CSV rules (lines 121 to 178) are reference material that loads on every run. |
| P39 | Deploy check | `sf-deploy-check` | `SKILL.md` (45 lines) | Fine. |
| P40 | Production data change | `sf-data-change` | `SKILL.md` (67 lines) | Fine. The owner's package has a fixed shape that could be an `assets/` template. |

---

## 4. Findings in detail, with evidence

### 4.1 Links that leave the skill folder

Counted with `grep -oE '\.\./(\.\./)*[A-Za-z0-9_./-]+'` over every `SKILL.md`
and reference file, on 2026-09-28:

| From | Links | Target |
| --- | --- | --- |
| 9 work skills (`SKILL.md`) | 32 | `../../references/conventions.md`, `helpers.md`, `team-roles.md`, `trackers.md`, `trackers/github.md`, `trackers/jira.md` |
| `solution-design/references/design-process.md`, `work-finish/references/closing.md` | 3 | `../../../references/...` (three folders up) |
| `plugins/work/references/trackers/github.md`, `jira.md` | 4 | `../trackers.md` (a reference linking a reference) |
| `handoff/SKILL.md` | 4 | `../../references/conventions.md`, `../../agents/handoff-verifier.md` |
| `memory-tidy/SKILL.md` | 1 | `../memory-save/references/record-format.md` (another skill's folder) |
| `memory-find/SKILL.md` | prose | "the work plugin's `references/trackers.md`" (another plugin; no relative path reaches it) |
| 6 work skills | prose | "Read the agent's file in this plugin's `agents/` folder" |

Accepted exception: `project-setup` runs
`node <this skill's folder>/../../bin/toolkit machine-setup` when `toolkit` is
not on the path. That is a command to run, not a document to read, and it
must reach the plugin's own program.

These links work today in both hosts, because both install the whole plugin
folder and Codex resolves a relative path from the `SKILL.md` folder first.
They break the specification's rule, they depend on the install layout, and
they are why shared text got copied by hand into the other plugins.

### 4.2 Text copied by hand

| Text | Copies | Check today |
| --- | --- | --- |
| Command-running paragraph ("Run each `toolkit` command alone ... never report a fetch refusal as a blocker.") | 13 `SKILL.md` files; identical in 8 work skills | none |
| Voice line | 22 `SKILL.md` files | `check-skills.mjs` compares with `plugins/work/references/conventions.md` |
| Codex agent fallback line | 6 work skills | `check-skills.mjs` compares with `plugins/work/references/helpers.md` |
| Work conventions | `plugins/session-skills/references/conventions.md` ("Keep the wording the same as the work plugin's") | none |
| Memory criteria | `memory-save/references/record-format.md` lines 23 to 38, "copied word for word from the model's `.memory/memory-criteria.md`" | none; a model change leaves it stale |
| Codex Git escalation paragraph | `work-on` step 7, `work-finish` step 2, `publish-docs`, `merge-and-clean-up`, `project-setup` step 8 | none |
| Current focus format and save sequence | 5 places (P21) | none |
| Record-an-approval sequence | 5 skills (P2) | none |

### 4.3 Step length

Longest numbered step per skill, in characters (lines starting with `N. `):

| Skill | Steps | Longest | Steps over 700 |
| --- | --- | --- | --- |
| `work-finish` | 10 | 1,605 (step 2) | 3 |
| `project-setup` | 8 | 1,511 (step 8) | 5 |
| `memory-save` | 8 | 1,198 (step 4) | 3 |
| `work-on` | 10 | 1,180 (step 5) | 4 |
| `solution-design` | 9 | 1,116 (step 8) | 2 |
| `work-organize` | 8 | 1,000 (step 6) | 1 |
| `memory-tidy` | 7 | 749 (step 5) | 1 |
| `work-requirements` | 9 | 719 (step 8) | 1 |
| `work-decide`, `work-delegate`, `work-check`, `work-status`, `memory-find` | | under 700 | 0 |
| `handoff`, `merge-and-clean-up`, `publish-docs`, `pull-latest`, `reset-to-remote` | | under 90 | 0 |

The last row shows the shape that works: a short step at the top, and a
"Step N in detail" section below it.

### 4.4 Reference files without a contents list

`plugins/work/references/conventions.md` (394 lines),
`memory-save/references/record-format.md` (324),
`solution-design/references/design-process.md` (233),
`project-setup/references/interview.md` (180),
`project-setup/references/repair-and-wiring.md` (177),
`work-delegate/references/agent-led-delivery.md` (159),
`work-on/references/planning.md` (131),
`work-requirements/references/writing-requirements.md` (128),
`work-finish/references/closing.md` (127).

### 4.5 Contradictions inside the toolkit's own text

- `plugins/work/references/conventions.md` lines 16 to 18 allow "the file edit
  tool for body text"; line 82 says "Change a work item only through `toolkit
  work` commands". The model rule `work-item-folders.md` line 40 and the
  post-tool hook both allow a direct body edit of a local record and check it.
  The shared text should say one thing: prefer `toolkit work edit`; a direct
  body edit of a local record is allowed and checked; frontmatter never by
  hand; Notion items only through the command.
- `memory-save` "Hook reminders" names 3 keep phrases; the hook uses 6
  (`lib/hooks/phrases.mjs`). The skill should say "an explicit keep phrase"
  and give one example, not a partial list.

### 4.6 Coupling that the move must carry

- `plugins/toolkit/lib/work/driver.mjs` (`trackerInstructionsPath`) finds
  `references/trackers/<type>.md` in the work plugin, in the repository and in
  both hosts' plugin caches, and prints that path in the exit-3 message.
- `dev/tools/check-skills.mjs` lines 596 to 600 read the voice line and the
  Codex fallback line from `plugins/work/references/conventions.md` and
  `helpers.md`.
- `dev/ARCHITECTURE.md` section 8, `dev/SKILL-INDEX.md` section 3.0, and
  `AGENTS.md` (Layout table, "Refresh the copy" steps, checks list) describe
  the current layout.

---

## 5. Shared text: one source, generated copies

### 5.1 Decision

Text that more than one skill needs has exactly one source file. A script
copies it into the `references/` (or `assets/`) folder of each skill that
needs it, with a header that names the source. `check-skills.mjs` fails when
a copy differs from its source. Each skill then reads only files inside its
own folder, in both hosts, and nobody edits a copy.

Why this and not the alternatives:

- `${CLAUDE_PLUGIN_ROOT}` reaches shared plugin files in Claude Code
  (`claude-code/skills.md`, "Available string substitutions"), but Codex shows
  it as literal text, and Toolkit V2 bans it (`AGENTS.md`, Rules, "Skills").
- A plugin cannot read another plugin's folder at a stable path. The script
  runs in this repository, where every plugin is present, so it can copy
  across plugins at build time.
- Copies cost nothing at run time: a reference loads only when the skill says
  to open it (`skill-authoring-best-practices.md`, "Runtime environment").

### 5.2 Where sources live

- `plugins/<owner plugin>/shared/<file>.md`, in the plugin that owns the
  subject. Sources ship with their plugin. That lets the CLI print an
  absolute path to one of them (the exit-3 message for GitHub and Jira), and
  the plugin version bump covers them.
- Agent files stay where Claude Code loads them (`plugins/<plugin>/agents/`)
  and are also sources for the Codex fallback copies.
- Two files come from the model copy, read-only:
  `plugins/toolkit/scaffold/model/.memory/memory-criteria.md` and
  `plugins/toolkit/scaffold/model/.work-items/work-item-template/WORK-ITEM.md`
  and `DESIGN.md`. They are copied after `dev/tools/import-model.mjs` runs.
- `plugins/work/references/` and `plugins/session-skills/references/` are
  removed. Their text moves into the sources below.

### 5.3 Source files and where each is copied

Target file name is the source file name unless shown. "work:" means a skill
in the work plugin.

| Source | What it holds | Copied into |
| --- | --- | --- |
| `plugins/toolkit/shared/toolkit-commands.md` | Running `toolkit` commands in both hosts: one command per call and why (Codex sandbox, the command rule); text in a command (single quotes, `'\''`, Claude Code `--set-file -` with `<<'EOF'`, Codex `--text` or a `mktemp -d` file deleted after); no fixed `/tmp` names; no drafts in `.work-items/` or `.memory/`; exit codes 0 to 4 and what to do; "Not saved" and "Saved but not verified"; `--json` and `--expect`; five right-and-wrong examples | work: all 9 skills; memory: all 3; `project-setup`; `handoff` |
| `plugins/git-workflows/shared/git-rules.md` | Item branch and worktree names (`claude/<prefix>-<number>-<slug>`, lower-case prefix); stage by name; no AI credit (which lines); never commit `.work-items/` or `.memory/`; no remote (never fetch, local merge, local document commits); a conflict merge gets a written message, never `--no-edit`; Codex: `.git/` is read-only, run each Git write alone with `sandbox_permissions` `require_escalated` and a one-line reason, a refusal without asking means show the command and wait, never work around it | work: `work-on`, `work-check`, `work-finish`; `handoff`; `project-setup`; git-workflows: all 4 skills |
| `plugins/work/shared/work-item-format.md` | Frontmatter fields and values (changed only by commands); `WORK-ITEM.md` sections; `DESIGN.md` sections (exact headings, `Option A — <name>`); changing one section (read, change, write the whole section, drop the guide comment); appending a row; the next `Q-` number; titles in the owner's words; generated files; the one rule on direct body edits (4.5); an Open Questions row and a history note as examples | work: all 9 skills; `handoff` |
| `plugins/work/shared/recording-owner-answers.md` | Where each kind of answer goes (the home table, including memory and `DECISIONS.md`); save before the next question and read back; history notes and `--effect`; `waiting_on` changes; owner edits win; ask in the reply text, one question with a recommendation; end every reply with the one question or the exact words that continue; failed-save wording | work: all 9 skills; `handoff` |
| `plugins/work/shared/approvals.md` | One section per gate (requirements, design, result, Done, cancel, delivery offer, project-wide decision, memory proposal): who asks, the exact command sequence as a checklist, what the CLI refuses; what counts as approval; the bare "yes" rule; sub-items (`--covers` inherits, own result approval); the standing merge instruction (where recorded, the independent check on the exact head, an item that overrides it); approval never covers merge, deployment, spending, or publishing; example owner quotes | work: `work-requirements`, `solution-design`, `work-check`, `work-finish`, `work-decide`, `work-delegate`, `work-organize`; git-workflows: `merge-and-clean-up` |
| `plugins/work/shared/helpers.md` | Starting an agent in each host (Claude Code: the Agent tool, `work:<name>`, `model: opus`, independent agents in one message; Codex: `spawn_agent` with `fork_turns` `none`, passing the full text of `references/agent-<name>.md`); the seven-part brief with one worked example; one writer per path; a checker never edits or builds; when helpers are allowed | work: `work-on`, `work-requirements`, `solution-design`, `work-check`, `work-finish`, `work-delegate` |
| `plugins/work/shared/team-roles.md` | As today | work: `work-on`, `solution-design`, `work-delegate` |
| `plugins/work/shared/tracker-local.md` | Identity by `id`; `toolkit work show <id> --path`; nesting is the parent; groups; `archive/`; ignored folders; state and dashboard files are written by the CLI; what `toolkit work sync` does by itself and the history rows it writes; worktree tied to an item by branch name; backup with `toolkit export` | work: `work-on`, `work-organize`, `work-status`, `work-finish`, `work-decide`; `handoff` |
| `plugins/work/shared/tracker-notion.md` | The Work Items database and its properties; the board and table views; the Solution Design child page; a card made with the New button is filled on the next read; a dragged Stage is kept and Status follows; Parent item relation; the Archived box is `archive`; a trashed card shows as missing; writes outside the "AI Agent Second Brain" page are refused; Markdown limits (tables, write `WORK-ITEM.md` as code text); the board link from `toolkit config get notion`; `ntn login` is the owner's step; an unreachable Notion gives "Not saved" | work: `work-on`, `work-organize`, `work-status`, `work-finish`, `work-decide`; `handoff` |
| `plugins/work/shared/tracker-github.md`, `tracker-jira.md` | Today's `references/trackers/github.md` and `jira.md`, with the `../trackers.md` link removed, the "every tracker" rules folded in, and new bodies taken from `work-on`'s `assets/WORK-ITEM.md` and `solution-design`'s `assets/DESIGN.md` | work: all 9 skills; `handoff`; `memory-find`; `project-setup` |
| `plugins/memory/shared/current-focus.md` | The format (title line, "Last updated", four sections, under 50 lines, work item ids only); read with `--json`, save with `--expect <version>` (and `--expect absent`); the two checks after an item's stage or next step changes; setup-step lines and when they leave; clearing the setup guide on a new project; examples of a full focus and a handoff pointer entry | memory: `memory-save`, `memory-tidy`; work: `work-on`, `work-requirements`, `solution-design`, `work-check`, `work-finish`, `work-organize`, `work-decide`; `handoff`; `project-setup` |
| `plugins/memory/shared/record-format.md` | Keys and file names; frontmatter fields; the body labels in order, as bold paragraphs, with the worked example; absolute dates; "Why" is the owner's words or "Not stated by the owner." | memory: all 3 |
| `plugins/memory/shared/replacing-and-retiring.md` | The duplicate check (exit 2) as a decision tree; update in place with `--expect`; `--supersedes`; `retire --superseded-by` and archiving; `rename`; `delete --owner-approved` with the owner's quote; `restore`; what a delete, reject, retire, rename, or supersede also clears (the briefing cache, the Hindsight document, the Notion cache); "forget that" means retire | memory: `memory-save`, `memory-tidy` |
| `plugins/memory/shared/proposals.md` | What a proposal is; `--proposal`; left out of search unless `--proposals`; listed by `toolkit work decisions`; approve or reject; a rejection stands | memory: all 3; work: `work-decide`; `handoff` |
| `plugins/memory/shared/glossary.md` | The table columns, "Naming changes and aliases", sourced terms only | memory: `memory-save`, `memory-tidy` |
| `plugins/memory/shared/memory-builtin.md` | `.memory/` layout; one vault for every worktree; Obsidian: relative Markdown links, not wikilinks; the link repair table (renamed, merged, superseded, archived, deleted); `archive/`; the generated `MEMORY.md` and its marks; owner edits made in Obsidian (run `toolkit memory status`, then `reindex`; a note renamed in Obsidian has a new key; a note in a subfolder other than `archive/` is not read); backup | memory: all 3 |
| `plugins/memory/shared/memory-hindsight.md` | The local server and one bank per project; the service is started only after the owner's yes; search results ("about", "may be about it", "closest") and what each allows; `--reflect`, then check the cited records; unreachable server gives "Not saved"; the project export does not reach Hindsight | memory: all 3 |
| `plugins/memory/shared/memory-notion.md` | Lore's layout (the Memory page, the five databases, records as Memories rows, the toolkit's added columns); focus and glossary as child pages; Lore's own saving and hooks stay off; never rename or remove a Lore property; `ntn` sign-in; a rejected proposal goes to the Notion trash; the briefing reads a cache with a 2-second limit | memory: all 3 |
| `plugins/memory/shared/backup-and-restore.md` | `toolkit memory export` and `import` (every backend); `toolkit export` and `import` (the Git-ignored folders only); always a dry run first; what `--replace` does; the backup folder is outside the project and is saved as a `reference` memory; doctor's 7-day warning; the order on a new computer | memory: `memory-tidy`; `project-setup` |
| `plugins/work/agents/<name>.md` (6 files) | The agent definitions | `references/agent-<name>.md` in: `requirements-analyst` to `work-requirements`, `solution-design`; `researcher` to `work-on`, `work-requirements`, `solution-design`, `work-delegate`; `design-architect`, `design-critic` to `solution-design`; `builder` to `work-on`, `work-check`, `work-delegate`; `acceptance-checker` to `work-on`, `work-check`, `work-finish`, `work-delegate` |
| `plugins/session-skills/agents/handoff-verifier.md` | The agent definition | `handoff/references/agent-handoff-verifier.md` |
| `plugins/toolkit/scaffold/model/.memory/memory-criteria.md` | The model's selection policy | `references/memory-criteria.md` in `memory-save`, `memory-tidy`, `handoff` (replaces the hand copy in `record-format.md`) |
| `plugins/toolkit/scaffold/model/.work-items/work-item-template/WORK-ITEM.md` | The work item template | `work-on/assets/WORK-ITEM.md` (new GitHub or Jira issue bodies) |
| `plugins/toolkit/scaffold/model/.work-items/work-item-template/DESIGN.md` | The design template | `solution-design/assets/DESIGN.md` (new GitHub or Jira design comments) |

Text that keeps a single source without copies:

- Stages, statuses, types, gates, and "What counts as approval": the CLI
  (`toolkit work lifecycle`). Skills run the command; no reference restates
  the table.
- The memory approval policy: `memory-save` step 3, as Mike decided.
  `memory-tidy` gets its own shorter rule instead of a pointer (a tidy is a
  bulk change, which always needs the owner's yes in both modes).
- The voice line and the Codex agent line: short lines inside each
  `SKILL.md`, checked against the quote lines in
  `plugins/work/shared/recording-owner-answers.md` and
  `plugins/work/shared/helpers.md`.

### 5.4 The script: `dev/tools/sync-skill-references.mjs`

- Reads `dev/tools/shared-references.json`, a list of entries:

  ```json
  {
    "copies": [
      { "source": "plugins/work/shared/approvals.md",
        "skills": ["work/work-requirements", "work/solution-design", "git-workflows/merge-and-clean-up"] },
      { "source": "plugins/work/agents/builder.md", "as": "references/agent-builder.md",
        "skills": ["work/work-on", "work/work-check", "work/work-delegate"] },
      { "source": "plugins/toolkit/scaffold/model/.work-items/work-item-template/WORK-ITEM.md",
        "as": "assets/WORK-ITEM.md", "skills": ["work/work-on"] }
    ]
  }
  ```

  Without `as`, the target is `references/<source file name>`.
- Writes each copy as the source's bytes plus one header line:

  ```text
  <!-- Generated file. Source: plugins/work/shared/approvals.md. Edit the source, then run node dev/tools/sync-skill-references.mjs. -->
  ```

  When the source starts with a YAML frontmatter block (agents, the
  templates), the header goes on the line after the closing `---`, so the
  copy's frontmatter still parses.
- Deletes a file that carries the header but is no longer listed. Never
  touches a file without the header.
- Allowed sources: `plugins/*/shared/**`, `plugins/*/agents/*.md`,
  `plugins/toolkit/scaffold/model/**`. Allowed targets:
  `plugins/*/skills/*/references/*` and `plugins/*/skills/*/assets/*`.
- Prints each plugin whose files changed, with the reminder that its version
  goes up in both manifests (and `metadata.version` in
  `.claude-plugin/marketplace.json`), because Codex runs a copy filed under
  the version.
- `--check` writes nothing and exits 1 with one line per problem: a missing
  source, a missing copy, a copy that differs, or a file with the header
  that the list does not name.
- Node 20 or newer, no dependencies, ES module (`AGENTS.md`, Rules).

Order after Mike changes the model: `node dev/tools/import-model.mjs`, then
`node dev/tools/sync-skill-references.mjs`, then the checks.

### 5.5 New checks in `dev/tools/check-skills.mjs`

| Id | Check | Rule |
| --- | --- | --- |
| C1 | Every generated copy matches its source (runs the sync script's `--check`) | B12 |
| C2 | No link or path in a skill's Markdown leaves the skill folder (`../`), apart from the `project-setup` bootstrap command | R1, R4 |
| C3 | Every file in `references/` and `assets/` is named in `SKILL.md`, and every `references/...` name used anywhere in the skill is named in `SKILL.md` | R1, R2 |
| C4 | A reference over 100 lines has `## Contents` within its first 15 lines | R3 |
| C5 | No numbered step line is over 600 characters (command lines on their own do not count); the numbered steps end within the first 60 lines. This replaces "steps end by line 40", which long lines now pass | B1, B2 |
| C6 | The voice line and the Codex agent line match their sources in `plugins/work/shared/` | B12 |
| C7 | Every skill in the work, memory, and toolkit plugins has `## Gotchas`, and `## References` when it has a `references/` folder | B9, R2 |
| C8 | `SKILL.md` is under 500 lines and under 20,000 characters (about 5,000 tokens) | B1 |

C5 changes a rule in `dev/ARCHITECTURE.md` section 8 ("the steps in the first
40 lines"). That rule is Claude's call from the design pass, not Mike's.

### 5.6 Other files the move changes

- `plugins/toolkit/lib/work/driver.mjs`: `trackerInstructionsPath` looks for
  `shared/tracker-<type>.md` in the work plugin; its tests change with it.
- `AGENTS.md`: the Layout table names `plugins/<name>/shared/`; "Refresh the
  copy" gains the sync step after the import; the checks list gains
  `node dev/tools/sync-skill-references.mjs --check`.
- `dev/ARCHITECTURE.md` section 8 and `dev/SKILL-INDEX.md` section 3.0: the
  shared-text paragraphs describe this layout.
- Versions: `work`, `memory`, `session-skills`, `git-workflows`, and
  `toolkit` all change.

---

## 6. The standard shape for a SKILL.md

For the work, memory, and toolkit plugins, and for `handoff`. The Git skills
already have this shape.

```markdown
---
name: <folder name>
description: '<unchanged; SKILL-INDEX section 1>'
---

# <Title>

Voice: <the checked voice line>
<One sentence: what this skill does, and what it never does.>

## Steps

Track these steps with the host's plan tool (Claude Code: the task list;
Codex: update_plan), not in the reply to the owner.

1. <One action, one short condition.>
   `toolkit <command>`
2. ...

## Gotchas

- <A fact that breaks a reasonable guess, with the reason in a few words.>

## When <a branch case>

<Only the cases that need more than one line; the rest go to references.>

## References

| File | Open it when |
| --- | --- |
| `references/<file>.md` | <the situation> |
```

Notes on the shape:

- The checklist goes to the host's plan tool, not into the reply. Anthropic's
  examples ask the agent to copy the checklist into its response
  (`skill-authoring-best-practices.md`, "Use workflows for complex tasks");
  the project's reply rules say to leave out routine narration of process
  (model `AGENTS.md`, "How to write replies"). The plan tool gives the same
  tracking without the noise.
- A step says what to do and names its command. Exceptions go to a "When"
  section or a reference with a line that says when to open it.
- Exact command sequences where one wrong flag does damage (approvals, Done,
  memory deletes, Git writes). Heuristics with examples where judgment is
  needed (sizing a request, routing, the interview, design options) (B7).

---

## 7. Proposals per skill

"Own" is a reference the skill alone uses; it stays hand-written in the
skill folder. "Generated" is a copy from section 5.3. No description changes.

### 7.1 `work-on`

SKILL.md changes:

- Replace the top paragraph with the voice line and one sentence.
- Ten steps, each one action: 1 briefing and the bare "ok" check; 2 find the
  item; 3 size the request; 4 the delivery offer check (open
  `work-delegate`); 5 route by the lifecycle's "Continue with" column; 6
  plan; 7 tracking setup; 8 build; 9 a question for the owner; 10 hand to
  `work-check`, or stop with Resume here, validation, and the focus current.
- Gotchas: a bare "ok", "yes", or "looks good" with no question asked is not
  "keep going"; setup steps never become work items; a deliverable with no
  content from the owner gets `Q-01` and a question, never invented content;
  a change to product behavior, Salesforce metadata, or anything bound for
  production is `build` (data: `data-load`), never `task`; "ask me questions
  first" means create the item and open `work-requirements`, never a batch
  of questions here (routing round 3, O21); build only on the item's own
  branch; this skill never records approvals, Done, merges, or deploys.

References:

| File | Kind | Purpose and outline |
| --- | --- | --- |
| `references/sizing-and-routing.md` | new, own | Contents; quick edit, log only, or item, with 8 owner messages and the right action each; choosing the type; routing by item state (state, skill, the one-line announcement); several items at once; `PROJECT-ROADMAP.md` units |
| `references/planning.md` | own, revised | Add Contents; point to `git-rules.md` instead of the work plugin's conventions; keep the Roadmap and Tasks formats |
| `toolkit-commands.md`, `git-rules.md`, `work-item-format.md`, `recording-owner-answers.md`, `current-focus.md`, `helpers.md`, `team-roles.md`, `tracker-local.md`, `tracker-notion.md`, `tracker-github.md`, `tracker-jira.md` | generated | section 5.3 |
| `agent-builder.md`, `agent-researcher.md`, `agent-acceptance-checker.md` | generated | Codex fallback |
| `assets/WORK-ITEM.md` | generated | New GitHub or Jira issue body |

### 7.2 `work-status`

SKILL.md changes: trim the top paragraph; add a short example answer under
"How to answer" (the output shape matters, B10); name the tracker file to
open for each tracker type. Gotchas: "Agent to-do" lines are not decisions;
archived items are hidden unless asked; this skill changes nothing.

References: generated `toolkit-commands.md`, `tracker-local.md`,
`tracker-notion.md` (the board link), `tracker-github.md`,
`tracker-jira.md`. No own reference.

### 7.3 `work-decide`

SKILL.md changes: steps 4 and 5 become one step that runs the checklist in
`approvals.md` for the gate; add one example decision message (what is
decided, the choices, the recommendation and its reason, what happens after
each answer). Gotchas: the bare "yes" rule; one decision per message, always
with a recommendation; a delivery offer belongs to `work-delegate`; the
approve command marks the Open Questions rows Answered, so never edit them
again by hand; a memory proposal is not a fact until approved.

References:

| File | Kind | Purpose and outline |
| --- | --- | --- |
| `references/decisions-log.md` | new, own | Contents not needed; `DECISIONS.md` columns; append-only; `toolkit decision add` and `--replaces`; the order of work with `publish-docs` as a checklist (open `publish-docs`, start the save workspace, run `toolkit decision add` there, stage `DECISIONS.md`, publish); worded examples: a project-wide choice, a standing merge instruction, a Jira status map |
| `approvals.md`, `proposals.md`, `recording-owner-answers.md`, `work-item-format.md`, `current-focus.md`, `toolkit-commands.md`, `tracker-local.md`, `tracker-notion.md`, `tracker-github.md`, `tracker-jira.md` | generated | section 5.3 |

### 7.4 `work-requirements`

SKILL.md changes: step 8 becomes "ask for approval, then run the requirements
checklist in `approvals.md`". Gotchas: one question at a time, each with a
recommended answer; save each answer before the next question; build ideas
never go into requirements; the CLI refuses the approval while the Agreed goal
holds the template text; a change to an approved `R-xx` goes back to
refinement and needs approval again; the spec check changes nothing without
a yes.

References:

| File | Kind | Purpose and outline |
| --- | --- | --- |
| `references/interview.md` | new, own (split from `writing-requirements.md`) | Aim at the outcome; the interview; "grill me"; resuming; corrections and changes |
| `references/requirement-format.md` | new, own (split) | Writing a requirement someone else can use; the `R-xx` block template; status words; the Acceptance list; build ideas |
| `references/spec-check.md` | new, own (split, plus the SKILL's "Spec check findings") | What to paste into the analyst's brief; handling findings; dismissed findings; two sources that disagree |
| `approvals.md`, `work-item-format.md`, `recording-owner-answers.md`, `current-focus.md`, `helpers.md`, `toolkit-commands.md`, tracker files | generated | section 5.3 |
| `agent-requirements-analyst.md`, `agent-researcher.md` | generated | Codex fallback |

### 7.5 `solution-design`

SKILL.md changes: step 8 (1,116 characters) splits into "present and ask"
and "after a yes, fill the selected design and run the design checklist in
`approvals.md`"; step 6's host-specific draft handling moves to the
reference. Gotchas: never write "Approved" in the Design status line; only
`toolkit work approve --design` approves a design, all or nothing; one design
home per tracker, never a separate folder; at least one critic on every
design; the Salesforce specialist is a skill the main agent runs.

References:

| File | Kind | Purpose and outline |
| --- | --- | --- |
| `references/design-process.md` | own, revised | Add Contents; keep the checklist; add "Drafts in each host" (Claude Code: the architect returns the draft in its reply; Codex: one `mktemp -d` folder per design, deleted after the save); section names come from `work-item-format.md` |
| `approvals.md`, `work-item-format.md`, `recording-owner-answers.md`, `current-focus.md`, `helpers.md`, `team-roles.md`, `toolkit-commands.md`, tracker files | generated | section 5.3 |
| `agent-requirements-analyst.md`, `agent-researcher.md`, `agent-design-architect.md`, `agent-design-critic.md` | generated | Codex fallback |
| `assets/DESIGN.md` | generated | New GitHub or Jira design comment |

### 7.6 `work-organize`

SKILL.md changes: step 6 (1,000 characters) becomes "propose the split, ask
once, create each child" with the `--covers` and design-inheritance rules in
the reference. Gotchas: never move, regroup, cancel, archive, or restore on
the agent's own initiative; a card dragged to Done is not an approval; a
split never moves, renumbers, or rewrites the parent's `R-xx`; archive is not
cancel; identity is the `id`, never the folder name.

References:

| File | Kind | Purpose and outline |
| --- | --- | --- |
| `references/moves.md` | own, revised | The cases that need the owner (table, now with the Notion Archived box and trashed cards); splitting (steps, `--covers`, inherited design); moving and grouping; example report lines and replies. "What the CLI handles" moves to the tracker files |
| `tracker-local.md`, `tracker-notion.md`, `tracker-github.md`, `tracker-jira.md`, `approvals.md`, `work-item-format.md`, `recording-owner-answers.md`, `current-focus.md`, `toolkit-commands.md` | generated | section 5.3 |

### 7.7 `work-check`

SKILL.md changes: steps 2 to 4 become a loop written as a checklist: run the
tests and every acceptance check; brief the checker; fix; check again; stop
when clean or when a failure needs the owner (B11). Keep "Showing the result"
inline: it is the output template. Gotchas: the checker is never the builder;
a check that did not run is "not run", never "passed"; the test plan lives in
`tests/` on the item's branch, never in `.work-items/`; "looks good" to
another question is not the approval.

References:

| File | Kind | Purpose and outline |
| --- | --- | --- |
| `references/testing.md` | new, own | When a test plan is needed; copy `tests/TEST-PLAN-TEMPLATE.md` to `tests/<id>-TEST-PLAN.md` in the item's worktree; fill and commit on the branch; what the checker's brief holds; a sub-item checked against its parent's approved design; recording the result |
| `approvals.md`, `work-item-format.md`, `recording-owner-answers.md`, `current-focus.md`, `helpers.md`, `git-rules.md`, `toolkit-commands.md`, tracker files | generated | section 5.3 |
| `agent-acceptance-checker.md`, `agent-builder.md` | generated | Codex fallback |

### 7.8 `work-finish`

SKILL.md changes: step 2 (1,605 characters) splits into commit and push,
open the pull request, and merge, with the no-remote merge and the Codex Git
rules moved to `git-rules.md`; a "Before Done" checklist (result approval
recorded or quoted; every change committed and on the default branch;
requirements and system guide saved through `publish-docs`; open sub-items
settled; focus updated; leftover worktrees offered for removal). Gotchas:
no Done without a recorded result approval or the owner's quoted words;
production deploys and data loads are the owner's; a standing merge
instruction needs an independent check on the exact head; each sub-item has
its own result approval.

References:

| File | Kind | Purpose and outline |
| --- | --- | --- |
| `references/closing.md` | own, revised | Add Contents; drop the link three folders up; keep the pull request, deployment, requirements baseline, sub-items, memory, Done, and cancel sections |
| `approvals.md`, `git-rules.md`, `work-item-format.md`, `recording-owner-answers.md`, `current-focus.md`, `helpers.md`, `toolkit-commands.md`, tracker files | generated | section 5.3 |
| `agent-acceptance-checker.md` | generated | Codex fallback |

### 7.9 `work-delegate`

SKILL.md changes: trim the top paragraph; the three questions stay word for
word in the steps. Gotchas: the offer wording is exact; a small item gets
owner-led at once with a note; a sub-item makes no offer; delegation never
widens merge, deployment, spending, or publishing; the choice belongs to the
named goal only.

References:

| File | Kind | Purpose and outline |
| --- | --- | --- |
| `references/agent-led-delivery.md` | own, revised | Add Contents; unchanged rules |
| `references/team-arrangements.md` | own, revised | Replace "observed ... on 2026-09-21" with "Observed in the Claude Code desktop app; check the current host when it matters" (B12) |
| `approvals.md`, `helpers.md`, `team-roles.md`, `work-item-format.md`, `recording-owner-answers.md`, `toolkit-commands.md`, tracker files | generated | section 5.3 |
| `agent-builder.md`, `agent-researcher.md`, `agent-acceptance-checker.md` | generated | Codex fallback |

### 7.10 `memory-save`

SKILL.md changes: step 3 keeps the approval policy (the only written copy)
but as a short list, not one paragraph; step 4 (1,198 characters) becomes
"save with the form for this case", with the four command forms as a small
table; the duplicate decision tree moves to `replacing-and-retiring.md`.
Gotchas: the owner's own words are the approval; silence is never a yes; an
unanswered "Save to memory?" becomes a proposal, never dropped; body labels
are bold paragraphs, never headings; "Why" is the owner's words or "Not
stated by the owner."; never store email addresses, secrets, or work-item
status; `--allow-similar` only after reading the listed records.

References:

| File | Kind | Purpose and outline |
| --- | --- | --- |
| `references/examples.md` | new, own | Five worked saves, each with the owner's words, the command, and the one-line reply: a correction (`feedback`), an inferred fact in onboarding mode, an unanswered question (proposal), "forget that" (retire), a duplicate refusal followed by an update with `--expect` |
| `record-format.md`, `replacing-and-retiring.md`, `proposals.md`, `current-focus.md`, `glossary.md`, `memory-builtin.md`, `memory-hindsight.md`, `memory-notion.md`, `toolkit-commands.md` | generated | section 5.3 |
| `memory-criteria.md` | generated from the model | The selection policy for Hindsight and Notion projects; built-in projects read `.memory/memory-criteria.md`, which wins |

### 7.11 `memory-find`

SKILL.md changes: step 3 names the tracker files inside the skill instead of
the work plugin's; add one example answer with a disagreement between two
sources. Gotchas: a hit is a pointer, so read the record; a proposal is not a
fact; Hindsight's "may be about it" and "closest" are not answers; "I don't
know; nothing recorded says" instead of a guess.

References: generated `record-format.md`, `proposals.md`,
`memory-builtin.md`, `memory-hindsight.md`, `memory-notion.md`,
`tracker-github.md`, `tracker-jira.md`, `toolkit-commands.md`. No own
reference.

### 7.12 `memory-tidy`

SKILL.md changes: drop the link into `memory-save`'s folder; step 4 states
the skill's own rule (the owner's yes covers the whole numbered list; a
delete quotes his words); the loop after step 5 ends with
`toolkit memory status` showing no broken links and doctor clean (B11).
Gotchas: retire before delete; a contradiction is asked, never settled by
date alone; never drop an unresolved owner to-do to meet 50 lines; restore
only after a dry run and a yes.

References:

| File | Kind | Purpose and outline |
| --- | --- | --- |
| `references/review-checklist.md` | new, own | "What to look for" as a checklist (duplicates, contradictions, stale, wrong home, prefix and type mismatch, unanswered proposals, focus size, broken links, index out of date); an example numbered proposal list |
| `record-format.md`, `replacing-and-retiring.md`, `proposals.md`, `current-focus.md`, `glossary.md`, `memory-builtin.md`, `memory-hindsight.md`, `memory-notion.md`, `backup-and-restore.md`, `toolkit-commands.md` | generated | section 5.3 |
| `memory-criteria.md` | generated from the model | As in 7.10 |

### 7.13 `project-setup`

SKILL.md changes: split the long steps (1, 3, 5, and 8 are 900 to 1,511
characters); add a new-project checklist (look before asking; the five
questions; init; the choices init has no flag for; wiring; fill the guides;
doctor at 0 problems; focus with owner steps; the commit offer). Gotchas:
never change an owner's answer to get past an error; setup is never a work
item; the project's one-sentence outcome is the owner's to say; `ntn login`
and trusting hooks in Codex `/hooks` are the owner's steps; inside Codex,
init writes `.codex/` and `.agents/` first and must run outside the sandbox;
`machine-setup` changes `~/.codex/config.toml`, so get a yes first.

References:

| File | Kind | Purpose and outline |
| --- | --- | --- |
| `references/interview.md` | own, revised | Add Contents |
| `references/repair-and-update.md` | new, own (split from `repair-and-wiring.md`) | Reaching the `toolkit` command; repair from doctor and the dry run; updating the toolkit in both hosts |
| `references/wiring-notion.md` | new, own (split) | `ntn whoami`, `ensure-root`, `ensure-project`, what they create, the prefix it may report |
| `references/wiring-hindsight.md` | new, own (split) | Service status, start after a yes, `ensure-bank` |
| `references/new-computer.md` | new, own (split) | Installs in both hosts, `machine-setup`, restoring the Git-ignored folders |
| `references/switching.md` | new, own (split) | Switching the memory backend; switching the tracker |
| `backup-and-restore.md`, `current-focus.md`, `git-rules.md`, `toolkit-commands.md`, `tracker-github.md`, `tracker-jira.md` | generated | section 5.3 |

### 7.14 `handoff`

SKILL.md changes: keep steps 1 to 8 at the top (already short); move the
step 2, 4, and 5 detail into references, which takes the file from 393 lines
(about 4,300 tokens) to about 120; "Why the order matters" becomes three
one-line reasons (B5). Gotchas: the fixed first line of the prompt, word for
word; saves before the prompt; never update an item this session did not
work on; save the focus with `--expect`; never delete an "Unchecked" claim.

References:

| File | Kind | Purpose and outline |
| --- | --- | --- |
| `references/update-the-work-item.md` | new, own | Step 2: finding the item; Overview; Resume here; stage and `waiting_on`; one history note; validate and read back; unrecorded decisions go to `work-decide` |
| `references/prompt-format.md` | new, own | Step 4: the first line; the goal; the rest; source kinds; label, do not hedge; one example prompt |
| `references/check-the-prompt.md` | new, own | Step 5: the verifier brief; the verdict table; running the check alone ("/handoff check"); the short-list example |
| `references/edge-cases.md` | own | As today |
| `toolkit-commands.md`, `current-focus.md`, `work-item-format.md`, `recording-owner-answers.md`, `proposals.md`, `git-rules.md`, `tracker-local.md`, `tracker-notion.md`, `tracker-github.md`, `tracker-jira.md` | generated | section 5.3 |
| `memory-criteria.md` | generated from the model | Step 3 for Hindsight and Notion projects |
| `agent-handoff-verifier.md` | generated | Codex fallback |

### 7.15 `session-summary`, `braindump`, `explain-simply`, `unslop`

No change. Each is one self-contained job whose whole text is needed on every
run, and each already has steps first. `unslop` is 249 lines, but its 31
patterns are used on every run, so moving them to a reference would only add
a file read.

### 7.16 `publish-docs`

SKILL.md changes: replace the Codex paragraph with one gotcha line and a
pointer to `git-rules.md`; move "Recover without losing work" to a reference
(it is needed only when a save fails).

References: new own `references/recovery.md` (the current section, with
Contents not needed); generated `git-rules.md`.

### 7.17 `merge-and-clean-up`

SKILL.md changes: replace the Codex paragraph with one gotcha line; step 2
points at the "Standing merge instruction" section of `approvals.md` instead
of restating it.

References: generated `git-rules.md`, `approvals.md`.

### 7.18 `pull-latest`

SKILL.md changes: add a gotcha that in Codex every Git write here needs
escalated permissions, with the pointer. References: generated
`git-rules.md`.

### 7.19 `reset-to-remote`

SKILL.md changes: the same Codex gotcha. References: generated
`git-rules.md`. Also a question for Mike (section 9): `agents/openai.yaml`
with `policy.allow_implicit_invocation: false`, so Codex starts it only when
named.

### 7.20 `sf-architect-solutioning`

No change: its body stays byte for byte as ported (`dev/GOAL.md`).

### 7.21 Salesforce project skills (proposals for the model; not changed here)

- `sf-component-tracker`: move "Deployment folder", "Tracker schema", "Org
  flags", "Change Type", "One row per component", "Project-authored only",
  "CSV editing", and "Not in the tracker" to `references/tracker-schema.md`,
  so the four steps start near the top; add a check step (every CLI-deployable
  tracker row is in the master `package.xml`, every member has a row) as a
  checklist or a small script.
- `sf-data-change`: put the owner's package layout in `assets/` as a
  template.
- `sf-deploy-check`: no change.
- These live in the model, in `.claude/skills/` and `.agents/skills/`. Any
  change is Mike's, made in the model and imported.

---

## 8. Hooks audit

Hooks: `plugins/toolkit/hooks/hooks.json` (Claude Code) and
`hooks/codex-hooks.json` (Codex), all running `toolkit hook <event>`.

| Area | Official guidance | Toolkit V2 now | Result |
| --- | --- | --- | --- |
| Event choice | A hook for steps that must run the same way every time; a skill for judgment (H1). `SessionStart` and `UserPromptSubmit` add short context (H3). `SessionEnd` cannot stop a clear | Briefing on `SessionStart`; move report and keep-phrase line on `UserPromptSubmit`; guards on `PreToolUse`; validation and reindex on `PostToolUse`; once-per-turn check on `Stop`; handoff stays a skill | Matches |
| Compaction | Both hosts fire `SessionStart` with `compact`; Claude Code does not re-inject the skill list after `/compact` (`claude-code/context-window.md`); `hooks-guide.md` "Re-inject context after compaction" | Matcher includes `compact` in both hosts; the briefing names "Continue with <skill>" for active items | Matches. Option: on `compact`, add the routing lines from the model `AGENTS.md` "Every session" to the briefing |
| Claude Code matchers | Exact-string list when the matcher holds only letters and the bar character; case-sensitive | `Write\|Edit\|MultiEdit\|Bash`; SessionStart `startup\|resume\|clear\|compact\|fork` | Matches. `MultiEdit` is not in the captured tool list; harmless |
| Codex matchers | Regex; anchor it; `UserPromptSubmit` and `Stop` ignore matchers; SessionStart sources are `startup`, `resume`, `clear`, `compact` | `^apply_patch$\|^Bash$`; `^(startup\|resume\|clear\|compact)$` | Matches |
| Handler form | Claude Code exec form with `${CLAUDE_PLUGIN_ROOT}`; Codex `$PLUGIN_ROOT`; Codex only `command` handlers, only `description` and `hooks` at the top | As required | Matches |
| Output | Only JSON on stdout; event fields in `hookSpecificOutput`; Codex fails a `PreToolUse` hook that returns `ask`, `continue`, `stopReason`, or `suppressOutput` | `lib/hooks/output.mjs` builds every shape; Codex `PreToolUse` returns only `deny` or `additionalContext` | Matches |
| Stop | Check `stop_hook_active`; Claude Code allows `hookSpecificOutput.additionalContext` as non-error feedback; Codex turns a `block` reason into a new user prompt | Guarded; blocks at most once per turn; the reason holds no keep phrase; the next `UserPromptSubmit` recognizes the Codex follow-up | Matches |
| Exit codes | Block with exit 2 and stderr, or JSON, not both | Always exit 0 with JSON; on an internal error, exit 0 and no output | Matches the shape. See the gap below |
| Timeouts | Claude Code: a timed-out `PreToolUse` command hook does not block the call; `SessionStart` runs every session and delays the first answer; Codex default 600 s | Explicit: 20, 10, 10, 30, 15 s | Matches. Gap: no test measures how long each hook takes |
| Output size | Claude Code 10,000 characters; Codex spills over about 2,500 tokens by default and warns that raising `additionalContextLimit` adds risk | Briefing capped at 6,000 characters; Codex `additionalContextLimit: 4000` on three events | Works. The raised limit is not needed for a 6,000-character cap |
| Messages the agent sees | Write `additionalContext` as facts, not commands (`claude-code/hooks.md`, "Add context for Claude") | Keep line and move report are facts; deny reasons say what happened, what to run, and "Nothing was changed" | Matches |
| Several hooks on one event | They run in parallel; do not rewrite the same input | Salesforce project guards and plugin hooks both run on Bash; neither rewrites input | Matches |
| Codex trust | Every hook change needs a new trust in `/hooks` | Stated in `AGENTS.md` and `project-setup` | Matches |

Gaps and proposals:

1. **Hook errors are never shown.** `lib/hooks/common.mjs` writes failures to
   `<git common dir>/toolkit-v2/hook-errors.log`; no command reads it. A
   crashed `PreToolUse` guard (AI credit, `git add -A`, generated files)
   lets the call through, and a crashed briefing gives an empty session
   start, with no sign in either case. Proposal: `toolkit doctor` lists
   errors newer than its last run, and the briefing adds one line ("3 hook
   errors since 2026-09-28; toolkit doctor lists them") when there are any.
   Priority: high, because it is the only feedback loop for the hooks.
2. **No timing test.** Proposal: a test runs each hook against a project with
   about 100 items and checks it finishes well inside its timeout (for
   example under 1 second for `PreToolUse` and `PostToolUse`, under 5 seconds
   for `SessionStart` without Notion). A slow guard fails open in Claude Code.
   Priority: medium.
3. **Codex `additionalContextLimit: 4000`.** Proposal: remove it (the default
   2,500 tokens holds the 6,000-character briefing), or set it to the cap.
   Any change here needs Mike to trust the hooks again in Codex. Priority:
   low; do it with the next hook change.
4. **Keep phrases listed twice.** `memory-save` names 3 of the 6 phrases in
   `lib/hooks/phrases.mjs`. Proposal: the skill says "an explicit keep
   phrase, such as 'remember this'" and does not list them. Priority: low.
5. **Rules repeated in many skills that a hook could enforce (H1).**
   - "Ask in the reply text, never through a question tool" is in 13 skills.
     A `PreToolUse` deny on `AskUserQuestion` (Claude Code) and
     `request_user_input` (Codex) in Toolkit V2 projects would enforce it and
     let the skills drop the line. This changes what Mike sees in the Claude
     Code desktop app, so it is his call (section 9).
   - "Ending every reply with the one question" and "keeping the current
     focus current" cannot be checked reliably by a hook; they stay in the
     skills. The briefing already reports a focus older than the newest item
     change.
6. **Optional:** Claude Code's `if` field (`hooks-guide.md`, "Filter by tool
   name and arguments with the `if` field") could skip starting Node for
   Bash calls that cannot match. Codex has no `if`. Not needed now: the
   pre-tool hook already returns early before asking Git anything.

---

## 9. Items for Mike

Model text (his files; any change goes on the model's branch with his yes):

1. `.memory/AGENTS.md` line 17 tells the agent to repair links by hand after
   a rename, merge, archive, or delete. The CLI now does that and names each
   note it changed. Proposed wording: "The `toolkit memory` commands repair
   links in other notes when a topic is renamed, merged, archived, or
   deleted, and name each note they changed. Check that report." The same
   file's list of commands that rebuild `MEMORY.md` also lacks `rename` and
   `delete`.
2. `.claude/rules/work-item-folders.md` line 40 allows direct body edits; the
   work skills' shared text will say the same, so no model change is needed.
   Listed so he knows the skills follow the rule.
3. The Salesforce skill proposals in 7.21.

Decisions:

4. **`reset-to-remote` as a named-only skill in Codex.** Add
   `agents/openai.yaml` with `policy.allow_implicit_invocation: false`
   (`codex/build-skills.md`, "Optional metadata"). It is not frontmatter, so
   the "name and description only" rule still holds, and
   `merge-and-clean-up` already ships an `agents/openai.yaml`. Claude Code has
   no equivalent outside frontmatter (`disable-model-invocation`), so there
   the description and the body's confirmation step stay the guard.
   Recommendation: yes. Reason: it throws away local work, and nothing is
   lost, because he can still start it by name.
5. **Block question tools in Toolkit V2 projects** (8, gap 5).
   Recommendation: yes for Codex (`request_user_input` may never show in a
   run he is not watching), his choice for Claude Code (the desktop app shows
   the question).
6. **Later option:** Codex reads custom agents from `.codex/agents/*.toml`
   (`codex/subagents.md`, "Custom agents"). `toolkit init` could write one per
   work agent, so Codex starts them by name instead of reading
   `references/agent-<name>.md`. Not recommended now: it changes setup and
   needs the owner to approve writes to `.codex/`.

---

## 10. Order of work for the next steps

Each step ends with its check. Descriptions do not change, so
`dev/SKILL-INDEX.md` section 1 does not change.

1. Create the source files in `plugins/*/shared/` from today's text (split
   `conventions.md`, `record-format.md`, `repair-and-wiring.md`,
   `writing-requirements.md`; move `helpers.md`, `team-roles.md`, the tracker
   files; write `tracker-notion.md`, the memory backend files,
   `backup-and-restore.md`, `git-rules.md`). Every file over 100 lines gets
   a contents list. Check: every fact in the old files is in exactly one new
   source (a reviewer compares the two sets).
2. Write `dev/tools/sync-skill-references.mjs` and
   `dev/tools/shared-references.json`; add C1 to C8 to `check-skills.mjs`.
   Check: `--check` passes on a clean run and fails on a hand-edited copy.
3. Rewrite each `SKILL.md` to the shape in section 6 and write the own
   references in section 7. Check: `node dev/tools/check-skills.mjs`.
4. Move the tracker path in `lib/work/driver.mjs` and its tests; delete
   `plugins/work/references/` and `plugins/session-skills/references/`;
   update `AGENTS.md`, `dev/ARCHITECTURE.md` section 8, and
   `dev/SKILL-INDEX.md` section 3.0. Check: the full test suite.
5. Raise the versions of the five changed plugins. Check:
   `claude plugin validate .` and on each changed plugin folder.
6. Routing spot check in both hosts on the messages whose skills changed most
   (`work-on` O21, `work-requirements`, `solution-design`, `memory-save`,
   `handoff`), per `skill-writing-guide.md` T4. Then a body check (T7): one
   fresh session per changed skill on a sample-run task, confirming it opens
   the reference its step names and does not open files outside its folder.
7. Hooks: gap 1 (hook errors in doctor and the briefing) and gap 2 (timing
   test) as their own change, with the Codex re-trust note for Mike if
   `codex-hooks.json` changes.

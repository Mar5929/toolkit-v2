# Research brief: session-skills, git-workflows, and system-guide

Researched 2026-09-26 from `/Users/michaelrihm/Documents/Projects/claude-toolkit`
(branch `main`, clean). Sources read in full: every `SKILL.md`, every agent file,
every `references/` file, both plugin manifests per plugin, each plugin
`README.md`, `system-guide/hooks/*`, and `git-workflows/skills/publish-docs/scripts/publish-docs.mjs`.
V2 target shapes were read from `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project`
and the rules in `dev/GOAL.md`.

All paths below are relative to `claude-toolkit/plugins/` unless they start
with `/`, `.memory/`, `.work-items/`, `requirements/`, or another project root folder.

---

## 1. Summary table

"Verdict" is this researcher's recommendation for Toolkit V2. The architect decides.

| Plugin | Name | Kind | Size | V2 verdict |
| --- | --- | --- | --- | --- |
| session-skills | `braindump` | skill | 65 lines | Port as is (drop the settings-file voice lookup, see section 7) |
| session-skills | `explain-simply` | skill | 103 lines | Port as is |
| session-skills | `grill-me` | skill | 134 lines | Retarget or merge. Its only output folder (`brainstorms/`) does not exist in V2 |
| session-skills | `handoff` | skill | 407 lines | Port with a rewrite of steps 1, 2, 3, 6 for V2 memory and trackers |
| session-skills | `requirements-helper` | skill | 117 lines | Port with a rewrite: "PRD" becomes the work item's `## Requirements`; open questions go to the `## Open Questions` table |
| session-skills | `session-summary` | skill | 172 lines | Port as is |
| session-skills | `solution-design` | skill | 339 lines | Port with a rewrite of paths, stage, and model defaults. Its template already matches the model `DESIGN.md` |
| session-skills | `spec-check` | skill | 108 lines | Port with a rewrite of what counts as a specification |
| session-skills | `track-tasks` | skill | 82 lines | Port for Claude Code; needs a Codex answer (uses `TaskCreate`, `TaskUpdate`, `TaskList`) |
| session-skills | `unslop` | skill | 240 lines | Port as is; fix its conflict with the `humanize-outbound-text.md` rule |
| session-skills | `work-guide` | skill | 214 lines | Do not port as a separate skill. Fold its content into the new V2 orchestration skills. It overlaps `work` |
| session-skills | `delivery-researcher` | agent | 67 lines | Merge with `design-researcher` |
| session-skills | `delivery-reviewer` | agent | 92 lines | Keep one general reviewer, or merge into `design-critic` and `design-product-analyst` |
| session-skills | `design-product-analyst` | agent | 71 lines | Port |
| session-skills | `design-researcher` | agent | 74 lines | Port; change `model: sonnet` to `opus` |
| session-skills | `design-architect` | agent | 97 lines | Port |
| session-skills | `design-critic` | agent | 89 lines | Port |
| session-skills | `handoff-verifier` | agent | 214 lines | Port; change `model: inherit` to `opus` |
| git-workflows | `merge-and-clean-up` | skill | 194 lines | Port; add the V2 work-item stage move after merge |
| git-workflows | `publish-docs` | skill + script | 88 + 130 lines | Port; rewrite the path lists and the knowledge pre-commit check in the script |
| git-workflows | `pull-latest` | skill | 91 lines | Port; remove the "sync with remote" trigger overlap and em dashes |
| git-workflows | `reset-to-remote` | skill | 166 lines | Port; remove the "sync with remote" trigger overlap |
| system-guide | `system-guide` | skill + CLI + hook | 35 + 1,273 + 60 lines | Decision needed. V2 model has a hand-written `docs/system-guide/` with an `AREA-TEMPLATE.md`, not the V1 generated guide at `knowledge/system/` |

---

## 2. V1 to V2 path and term map

Every V1 path the three plugins assume, and what it becomes in V2. The V2
column comes from the model project and `dev/GOAL.md`.

| V1 path or term (used by) | What it was | V2 replacement |
| --- | --- | --- |
| `.toolkit-memory.json` with `"memory": "external"` (grill-me, handoff, spec-check, publish-docs script) | Switch between file memory and a memory service | Model file is `{"schema": 2, "memory": "second-brain-v2", "location": ".memory", "activeWriter": "memory-curator"}`. V2 needs values for three choices: built-in `.memory/`, local Hindsight, Notion. Skills must read this file, not a manual marker |
| `<!-- claude-toolkit:knowledge-schema:2 -->` in `knowledge/knowledge-manual.md` (grill-me, handoff) | Detects the V1 second-brain layout | Gone. No `knowledge/` folder in V2 |
| `knowledge/memory/current.md` (schema 2) and `knowledge/current.md` (legacy) (handoff) | Current working memory with a `## Session handoffs` list | `.memory/CURRENT_FOCUS.md`, section `## Next-session handoff` (one section, whole file kept under 50 lines). Hindsight or Notion equivalents are not yet defined |
| `working:handoff:<UTC time>` record key in a memory service (handoff) | Handoff as its own memory-service record | Not defined for Hindsight or Notion yet (open question) |
| `knowledge/prds/`, `prds/`, `prd-index.md` (spec-check, solution-design, requirements-helper, publish-docs script) | Product requirement documents | Active requirements live in the work item: `.work-items/<item>/WORK-ITEM.md` section `## Requirements` (R-01, R-02, ...), or the Notion/GitHub/Jira item body. Delivered behavior lives in root `requirements/<area>.md` (from `requirements/AREA-TEMPLATE.md`) |
| `brainstorms/` and `knowledge/brainstorms/` (grill-me) | Raw interview capture | No V2 home. Model project has no `brainstorms/` folder |
| `docs/designs/<id>-<slug>.md` (solution-design, for external trackers) | Design file outside the tracker | Forbidden in V2. Model `docs/AGENTS.md`: "Do not create a separate `docs/designs/` copy." Local: `DESIGN.md` beside `WORK-ITEM.md`. Notion: Solution Design subpage. GitHub/Jira: the item's own record or attachments |
| `knowledge-save` (legacy `remember`), `knowledge-find` (legacy `recall`), `knowledge-setup`, `project-sync` (grill-me, handoff, solution-design) | V1 second-brain save/find skills | V2 memory writer: `memory-curator` agent (`.claude/agents/memory-curator.md`, `model: opus`, `background: true`) plus rule `.claude/rules/memory-curator-dispatch.md` (onboarding card or trusted mode), plus `python3 scripts/memory.py` (`reindex`, `doctor`). Hindsight and Notion writers are new |
| `docs/knowledge-manual.md` / `knowledge/knowledge-manual.md` approval contract (handoff) | Where save approval rules lived | `.memory/memory-criteria.md` (frontmatter `mode: onboarding` or `trusted`) and `.memory/AGENTS.md` |
| `SOUL.md`, `knowledge/project.md` (handoff legacy detection) | V1 layout signature | Model root has `SOUL.md`, `PROJECT.md`, `PROJECT-ROADMAP.md` |
| `knowledge/system/` System Guide default path, `.system-guide.json` (system-guide) | Generated system map | Model has `docs/system-guide/AREA-TEMPLATE.md` (hand-written area pages). Model root `AGENTS.md` still says "When `.system-guide.json` is enabled, use the System Guide plugin's `system-guide` skill" |
| `CLAUDE.md` (merge-and-clean-up, sf-architect-solutioning) | Old instruction file | `AGENTS.md` only (GOAL decision) |
| `REQUIREMENTS.md` (legacy, spec-check, requirements-helper) | Old local requirements file | `WORK-ITEM.md` `## Requirements` |
| PRD/design bottom `## Notes` with **Decisions**, **Still open**, **Resume here** (work-guide, requirements-helper, spec-check, solution-design, delivery-reviewer) | Continuation inside the document | `DESIGN.md` keeps `## Notes` with Decisions / Still open / Resume here. `WORK-ITEM.md` splits it: `## Open Questions` table (ID, Question, Affects, Status, Decision needed from), `## Notes` with `### Decisions and context`, `### Resume here`, `### Solution options and considerations` |
| "Potential paths to explore" subsection (requirements-helper, spec-check, delivery-reviewer, solution-design) | Non-binding solution ideas at the bottom of a PRD | `WORK-ITEM.md` `### Solution options and considerations` ("These are possibilities to evaluate, **not approved requirements or design decisions**.") Use one name everywhere |
| Lifecycle stage `04-solution-design` and the 14 stages (solution-design, work-guide) | From `work-tracker/skills/work/references/lifecycle.md` | GOAL keeps "the same stages". Model `WORK-ITEM.md` frontmatter: `status: <Backlog \| In Progress \| Blocked \| Done>`, `stage:`, `active_phase: P1`, `requirements_status: refining`, `design:` |
| "Roadmap stages backed by tasks" (work-guide, solution-design) | Per-item plan | Model `WORK-ITEM.md` `## Roadmap` (phases P1, P2 with Outcome, Status, Exit result) and `## Tasks` (P1-T01 with Work, Deliverable, Done when, Depends on). Same idea, now a fixed format |
| GitHub issue body + one "Progress log" comment + one stage label + board status (handoff step 1) | claude-toolkit's own GitHub convention | GitHub Issues gets template and written instructions only in V2 |
| `offer-context-handoff.md` rule (handoff) | Tells the agent to offer a handoff | Model rule text: "Use the `handoff` skill. Before the handoff, review `.memory/CURRENT_FOCUS.md` and `.memory/memory-criteria.md`; use the V2 curator only for authorized lasting memory." |
| Output style lookup via `.claude/settings*.json` `outputStyle` (5 skills) | Load `plain-english.md` | Model `.claude/settings.json` has `"outputStyle": "Plain English"` and `.claude/output-styles/plain-english.md`. Codex has no output styles |
| `.memory/`, `.work-items/` Git status | n/a in V1 | Model `.gitignore` ignores `.memory/` and `/.work-items/`. Handoff and publish-docs must never try to commit or push them |

---

## 3. Plugin manifest layout (porting reference)

### 3.1 session-skills

```text
session-skills/
  .claude-plugin/plugin.json
  .codex-plugin/plugin.json
  README.md
  agents/
    delivery-researcher.md
    delivery-reviewer.md
    design-architect.md
    design-critic.md
    design-product-analyst.md
    design-researcher.md
    handoff-verifier.md
  skills/
    braindump/SKILL.md
    explain-simply/SKILL.md
    grill-me/SKILL.md
    grill-me/agents/openai.yaml
    handoff/SKILL.md
    requirements-helper/SKILL.md
    session-summary/SKILL.md
    solution-design/SKILL.md
    solution-design/references/design-document-template.md
    solution-design/references/team-roles.md
    spec-check/SKILL.md
    track-tasks/SKILL.md
    unslop/SKILL.md
    work-guide/SKILL.md
```

No `hooks/` folder. No `commands/`. No MCP.

`.claude-plugin/plugin.json` (complete file):

```json
{
  "name": "session-skills",
  "description": "Eleven conversation skills, including guided delivery, requirements interviewing, and solution design, with focused research, design, and review agents. Use the project's chosen tracker and adaptable working methods.",
  "version": "1.14.1",
  "author": { "name": "Mike Rihm", "email": "michael@rihm.com" }
}
```

It declares no `skills`, `agents`, or `hooks` field. Claude Code finds
`skills/` and `agents/` by default location (captured `plugins-reference.md`,
"File locations reference": Agents default `agents/`, Hooks default
`hooks/hooks.json`). Plugin agents load under a scoped name, for example
`session-skills:handoff-verifier`; skills under `session-skills:handoff`.
Per `plugins-reference.md`, plugin agents support `name`, `description`,
`model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`,
`background`, `omitClaudeMd`, and `isolation` (only `"worktree"`). Plugin
agents cannot use `hooks`, `mcpServers`, or `permissionMode`.

`.codex-plugin/plugin.json` fields: `name`, `version` (`1.14.1`),
`description`, `author` (`name`, `email`, `url`), `homepage`, `repository`,
`keywords` (array), `"skills": "./skills/"`, and `interface` with
`displayName` ("Session Skills"), `shortDescription`, `longDescription`,
`developerName`, `category` ("Productivity"), `capabilities` (["Interactive"]),
`websiteURL`, `defaultPrompt` (4 strings), `brandColor` ("#0F766E").
There is no agents field for Codex. The README says: "Codex does not load these
Markdown definitions as native custom-agent configuration. The skills instead
read the role file and pass its full instructions and scoped context to an
available native worker."

`skills/grill-me/agents/openai.yaml` (Codex skill UI metadata):

```yaml
interface:
  display_name: "Grill Me"
  short_description: "Stress-test ideas through persistent interviews"
  default_prompt: "Use $grill-me to stress-test my plan and capture every answer."
```

Only `grill-me` and `git-workflows/merge-and-clean-up` ship this file.

Agent frontmatter used (all seven):

| Agent | `tools` | `model` |
| --- | --- | --- |
| `delivery-researcher` | `Read, Glob, Grep, WebSearch, WebFetch` | `inherit` |
| `delivery-reviewer` | `Read, Glob, Grep, WebSearch, WebFetch` | `inherit` |
| `design-product-analyst` | `Read, Glob, Grep, WebSearch, WebFetch` | `opus` |
| `design-researcher` | `Read, Glob, Grep, WebSearch, WebFetch` | `sonnet` |
| `design-architect` | `Read, Glob, Grep, WebSearch, WebFetch, Write, Edit` | `opus` |
| `design-critic` | `Read, Glob, Grep, WebSearch, WebFetch` | `opus` |
| `handoff-verifier` | `Read, Glob, Grep, Bash` | `inherit` |

Skill frontmatter uses only `name` and `description` in all 11 skills. None
uses `when_to_use`, `argument-hint`, `disable-model-invocation`, `paths`,
`context`, or `model`.

Skills link to siblings and agents by relative path, for example
`[work-guide](../work-guide/SKILL.md)` and
`[delivery-researcher](../../agents/delivery-researcher.md)`. That works only
when the whole plugin is installed. The README warns: "The bare skill-folder
copy fallback must include the three sibling skills and their linked agent files."

Marketplace entries (`/.claude-plugin/marketplace.json`):
`{"name": "session-skills", "source": "./plugins/session-skills", "description": "..."}`.
Codex (`/.agents/plugins/marketplace.json`):
`{"name": "session-skills", "source": {"source": "local", "path": "./plugins/session-skills"}, "policy": {"installation": "AVAILABLE", "authentication": "ON_INSTALL"}, "category": "Productivity"}`.
Version rule from the README: a content change bumps `version` in both
manifests and `metadata.version` in `.claude-plugin/marketplace.json`.

### 3.2 git-workflows

```text
git-workflows/
  .claude-plugin/plugin.json      (name, description, version "0.4.0", author)
  .codex-plugin/plugin.json       ("skills": "./skills/", interface.category "Developer Tools", capabilities ["Write", "Repository"], brandColor "#2563EB")
  README.md
  skills/merge-and-clean-up/SKILL.md
  skills/merge-and-clean-up/agents/openai.yaml
  skills/publish-docs/SKILL.md
  skills/publish-docs/scripts/publish-docs.mjs
  skills/pull-latest/SKILL.md
  skills/reset-to-remote/SKILL.md
  tests/publish-docs.test.mjs     (node --test; 2 tests)
```

### 3.3 system-guide

```text
system-guide/
  .claude-plugin/plugin.json      (version "1.0.2")
  .codex-plugin/plugin.json       (capabilities ["Interactive", "Read", "Write", "Repository"])
  README.md
  hooks/hooks.json
  hooks/system-guide-session-start.mjs
  skills/system-guide/SKILL.md
  skills/system-guide/references/commands-and-hosts.md
  skills/system-guide/references/meaning-and-maintenance.md
  skills/system-guide/references/one-screen-preview.md
  skills/system-guide/references/routing-and-sources.md
  tools/README.md
  tools/system-guide.mjs          (1,273 lines, dependency-free Node CLI and library)
  tests/core.test.mjs             (about 20 node tests)
```

`hooks/hooks.json` (complete file). This is the only plugin hook in the three
plugins, and a good reference for the documented plugin-hook form. It uses exec
form (`command` plus `args`), which the captured `hooks.md` recommends whenever
a hook path uses a placeholder such as `${CLAUDE_PLUGIN_ROOT}`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact|fork",
        "hooks": [
          {
            "type": "command",
            "command": "node",
            "args": ["${CLAUDE_PLUGIN_ROOT}/hooks/system-guide-session-start.mjs"],
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

The script reads the hook JSON from stdin, takes `cwd`, calls
`inspectGuide(root)` from `../tools/system-guide.mjs`, and prints one line such as
`System Guide: on; entry: knowledge/system/README.md; capture scope: incomplete; last refresh: 2026-09-10T16:00:00Z.`
It prints nothing when the guide is off, and swallows every error ("Startup
guidance must never prevent a session from opening."). The README says Codex
does not run this Claude hook; project setup must put a pointer in root
`AGENTS.md` instead. Note: the V2 model project ships a project-level
`.codex/hooks.json` with a `SessionStart` hook (`"command": "node \".claude/hooks/toolkit-session-start.mjs\""`,
`"additionalContextLimit": 1000`, `"statusMessage"`), so Codex does run
project hooks. Whether a Codex plugin can ship hooks was not established from
the captured docs (only `ai-external-knowledge/codex/agents-md.md` is captured).

---

## 4. session-skills: skill inventory

### 4.1 braindump

- **Exact description:** "Play back a pasted brain dump in very simple language and confirm the understanding before doing any work. Use when the owner types /braindump after or alongside a loose spoken-style dump of what they want, or says \"play that back\", \"tell me what you heard\", \"make sure you understood that before you start\", or \"here's a brain dump\" followed by a request to confirm understanding first." (387 characters)
- **What it does:** Hard rule: no work until the owner confirms. Plays back the big idea in one or two sentences, a numbered list of each separate ask, what it is not sure about ("I think you mean X, but you might mean Y"), then questions with recommended answers. A correction replays only the corrected part.
- **Assumes:** Nothing project-specific. Voice section reads `outputStyle` from `.claude/settings.local.json`, `.claude/settings.json`, `~/.claude/settings.json`, then matches a file in `.claude/output-styles/` or `~/.claude/output-styles/` by frontmatter `name` (`Plain English` maps to `plain-english.md`).
- **Calls:** Nothing. Hands over to "the project's own rules (tickets, specs, worktrees)" after confirmation.
- **V2 changes:** None needed for content. Replace the voice lookup with the shared pattern (section 7). Consider: after confirmation, route real project work to the V2 "start a work item" skill.

### 4.2 explain-simply

- **Exact description:** "Re-explain the last answer, a plan, or a named document as short bullets a non-technical reader gets in one pass, keeping every number, name and file path. Use when the owner types /explain-simply, or says \"explain that like I'm five\", \"explain it like I'm 5 years old\", \"put that in plain bullets\", \"simpler\", or asks for the short bulleted version of something you just said." (377 characters)
- **What it does:** Rewrites the named thing, or the last substantial answer, as bullets only: one idea and one line per bullet, 4 to 6 bold-headed groups, about 25 bullets maximum, ending with a numbered "What I need from you" only when there is an action. Rule: "Simplify the wording. Never simplify the facts." Does not re-research.
- **Assumes:** Output style lookup only.
- **Calls:** Nothing.
- **V2 changes:** None. Fits Mike's ADHD and middle-school-level rules directly.

### 4.3 grill-me

- **Exact description:** "Interview the user relentlessly about a plan, design, or topic while checkpointing every answer to a brainstorm file so nothing is lost. Use when the user wants to stress-test a plan, get grilled on a design, run a brainstorm or discovery session, extract what is in their head into a persistent document, or says \"grill me\"." (325 characters)
- **What it does:** One question at a time with a recommended answer, in dependency order. Before each next question it writes the answer to `{brainstorm-root}/{YYYY-MM-DD}-{topic-slug}.md` (Summary / key decisions, Q&A log with Q1..., Open flags). Ends with a contradiction check, a recap, and a hand-off to the knowledge save review.
- **Assumes:** Layout detection: schema-2 manual marker, or `.toolkit-memory.json` `"memory": "external"`, uses root `brainstorms/`; legacy uses `knowledge/brainstorms/`; no knowledge system uses an existing brainstorm folder or creates top-level `brainstorms/`; a partial layout stops and recommends `project-sync`. Uses `date +%F`. States "The generated indexes deliberately exclude brainstorms".
- **Calls:** `knowledge-save` (legacy `remember`) at close; `project-sync` on a broken layout.
- **V2 changes:** Its output folder does not exist in the model. Options: (a) write the interview into the work item (`## Requirements` > `### Starting request`, `## Open Questions`, `## Notes`), which makes it the same job as `requirements-helper`; (b) for a new idea, create a work item at stage `01-discovery` and capture there; (c) keep a Git-ignored or tracked `brainstorms/` folder, which the model review would have to add. Recommendation: merge it into `requirements-helper` as its "discovery interview" mode and keep "grill me" as a trigger phrase, because the persistence contract (write every answer before the next question) is exactly what `requirements-helper`'s "save settled answers promptly" already requires. The memory hand-off becomes the V2 curator dispatch.

### 4.4 handoff

- **Exact description:** "Save a temporary session handoff and write a checked, self-contained prompt for a fresh session to carry on from. Use when the owner says \"write a handoff\", \"hand this off\", \"handoff prompt\", \"I'm going to clear context\", \"start a new session\", \"this session is getting long\", \"carry this over\", \"prompt for a new chat\", or runs /handoff. Use the check on its own, with \"/handoff check\", when the owner has a handoff prompt from somewhere else and wants it verified. Update any active work tracker first, then run the installed knowledge-save or legacy remember review. Preserve the checked continuation under Session handoffs in current working memory when that system is configured." (684 characters)
- **What it does:** Seven steps in a fixed order: (1) update the active work item's next step, blockers, decisions, stage; (2) run the knowledge save review; (3) wait for its result; (4) draft the prompt, starting with the fixed line `This handoff prompt is AI-generated and may contain hallucinations, skewed context, etc. Please evaluate accordingly.`, then the goal, why it matters, where it is written down, the task, what to read first, unsaved decisions, open questions, and one first action, with a source kind for every fact (file, repository, owner, worked out); (5) run `handoff-verifier` in the foreground and act on verdicts `Wrong`, `Unchecked`, `Missing`, `Skipped`; (6) save a pointer entry under `## Session handoffs` in current working memory, newest first, heading `### 2026-09-20T01:15:00.000Z | Export timing`; (7) show a short fixed/not-confirmed list and one fenced prompt block. `/handoff check` runs only step 5 on a pasted prompt.
- **Assumes:** `.toolkit-memory.json`; `knowledge/knowledge-manual.md` marker; `knowledge/memory/current.md` (strictly under 5,000 characters) or `knowledge/current.md` (at most 2,000); `docs/knowledge-manual.md` in external mode; `working:handoff:<UTC time>` memory-service keys; the `work` skill for local folders; GitHub issue body, single Progress log comment, labels, board status; Git publication of the current-work file ("State separately what is written locally and what is verified remotely"); the `offer-context-handoff.md` rule; PRD/design bottom Notes.
- **Calls:** `work` skill, `knowledge-save` or `remember`, `knowledge-find` or `recall` (on resume), `project-sync` or the knowledge setup procedure, agent `handoff-verifier`, and `work-guide`'s document-continuity guidance.
- **V2 changes:**
  - Step 1: local tracker writes `WORK-ITEM.md` `**Current position:**`, `**Next action:**`, `**Blockers:**` in `## Overview`, and `### Resume here` in `## Notes`; Notion writes the same fields on the work item page; GitHub/Jira follow the written instructions only.
  - Step 2/3: replace `knowledge-save` with the V2 memory route chosen at init: `.memory/` through `memory-curator` and the onboarding card in `memory-curator-dispatch.md`; Hindsight (retain call into the project's bank); Notion Memory database.
  - Step 6: `.memory/CURRENT_FOCUS.md` has one `## Next-session handoff` section and a 50-line whole-file cap, not a multi-entry `## Session handoffs` list. Decide whether to keep multiple timestamped entries (V1) or one entry (model). Delete the Git publication part: `.memory/` is Git-ignored. Define the Hindsight and Notion equivalents.
  - Keep: the fixed first line, the goal-first prompt, the four source kinds, the verifier, the "never blocks" rule, and the edge-case table. These are the valuable parts.
  - Split the 407-line file: move step 6 detail and the edge-case table to `references/` so the always-read part is short.
  - Add a Codex path: the skill says "Run the `handoff-verifier` agent" but, unlike `work-guide`, gives no Codex fallback (read `agents/handoff-verifier.md` and pass its text to a native worker).
  - Rewrite the description: drop "knowledge-save or legacy remember" and "Session handoffs"; keep trigger phrases.

### 4.5 requirements-helper

- **Exact description:** "Write or refine plain-language PRDs and work-item requirements in the project's chosen record through a guided, one-question-at-a-time conversation. Use to clarify a problem, capture required behavior, handle changed answers, or resume a requirements interview." (261 characters)
- **What it does:** Reads `work-guide` first. Aims at the owner's real outcome, pushes back when an answer undermines the goal, asks one question at a time with a recommendation, saves settled answers into the canonical draft as it goes, records unanswered questions (who must answer, status, affected requirement), applies clear corrections without re-approval, and leads with "Not saved" when a save fails (example: "Not saved to Jira yet. The draft now says send the summary only on request; retry behavior remains open."). Keeps build ideas in a bottom "Potential paths to explore" subsection, not in requirements.
- **Assumes:** "PRD" as a document type; the project's requirements format; bottom `Notes`; project save policy for PRDs and lasting knowledge.
- **Calls:** `work-guide` (read first), agent `delivery-reviewer` (optional review), the project's specification check (`spec-check`).
- **V2 changes:** Replace "PRD" with the work item's `## Requirements` section (R-xx blocks with Status, Applies to, Required behavior, Boundaries and exceptions, Acceptance check, Decision record, Open questions) and its `**Overall status:**` / `**Finalization rule:**`. Unanswered questions go in `## Open Questions` (Q-01 rows), not Notes. Build ideas go in `### Solution options and considerations`. Add the lifecycle point where accepted behavior is copied into root `requirements/<area>.md` (per model `requirements/AGENTS.md`: "Update the area file at the agreed lifecycle point after confirming what was delivered."). Remove the dependency on `work-guide` if that skill is dropped. The description is abstract; see section 8 for a rewrite.

### 4.6 session-summary

- **Exact description:** "Summarize this chat session as a table of the main things the user asked for and where each one stands, followed by anything that still needs the user. Use this whenever the user asks to summarize, recap, or catch up on the session or conversation, asks \"what did I ask for\", \"what did we do\", \"where do things stand\", \"status of my requests\", \"session summary\", \"recap this chat\", or runs /session-summary. Also use it when a session is wrapping up or being handed off and the user wants the requests-and-status view rather than a story of the work. Prefer this over writing a narrative summary of your own actions, even when the user's wording is casual." (656 characters)
- **What it does:** Two parts only: a table (`#`, `What you asked`, `Status`, `Where it landed`), one row per real request (not per step), then `### 🔴 Still open, and it needs you`. Eight fixed statuses with symbols: ✅ Done, ⚠️ Done unverified, ⏳ Partly done, 🔴 Blocked, 🔴 Waiting on you, ⚪ Not started, ⛔ Dropped, 💬 Answered. Read-only.
- **Assumes:** Nothing project-specific.
- **Calls:** Nothing.
- **V2 changes:** None to behavior. Trim the description (trigger overlap with `track-tasks`, section 6).

### 4.7 solution-design

- **Exact description:** "Design a solution for approved requirements as a process flow. The main conversation checks the requirements are complete and explicit end to end, agrees the way of working with the owner, recommends a team of agents sized to the item, then runs research, design, and a critique loop against every requirement until all are satisfied. Produces one or more plain-language design options a junior intern could build from. Use when a work item has approved requirements and needs a design, when the owner wants design options, or says \"design this\", \"solution this\", or \"how should we build this\"." (594 characters)
- **What it does:** A checklist that must be fully ticked before design. Step 1: read requirements, write the intent paragraph, check readiness with three questions (anything missing, explicit end to end, where a builder could misread), say plainly ready or not. Step 2: agree prep interview versus scan, design philosophy (built-in first), one or several options, output location, and team (one question at a time). Step 3: start the design from `references/design-document-template.md`. Step 4: 4a product analyst readiness check, 4b one researcher per question in parallel, 4c one architect per option, 4d one critic per draft, 4e fix loop until the critic's list is empty (two-round disagreement goes to the owner). Step 5: save marked `Status: proposed`, update the work item and its roadmap task, send lasting decisions to memory.
- **Assumes:** `knowledge/prds/` or `prds/`; `docs/designs/<id>-<slug>.md` for external trackers; `DESIGN.md` in the `.work-items/` item folder; lifecycle stage `04-solution-design`; a "solution-design roadmap task"; the Agent tool; "Agent teams (the experimental teammate feature) are used only when the owner has enabled them and asks."; `knowledge/` or memory service for lasting decisions.
- **Calls:** `work-guide` (read first), `spec-check`, `requirements-helper` (for requirement gaps), `knowledge-save`/`remember`, agents `design-product-analyst`, `design-researcher`, `design-architect`, `design-critic`, general task agents, and domain skill `sf-architect-solutioning` (via `team-roles.md` "Domain specialist" brief). `sf-architect-solutioning/SKILL.md` line 89 says: "When `solution-design` is coordinating the conversation, return Salesforce design findings to that conversation; do not start another interview or parallel writer."
- **References:** `design-document-template.md` sections: `# <Item id and title>: solution design`, `Status: proposed`, `Requirements:`, `Date:`, What this solves, What exists today, Design philosophy, Preparation (Requirements readiness, Way of working, Team, Constraints), `## Option A: <short name>` (Summary, How each requirement is met with Build or reuse / Why this satisfies it / How to check it, What the person experiences start to finish, Components and files touched table, Order of work, Risks and tradeoffs, Sources table with Label and Verified how), Where a builder could misread the requirements, Recommendation, Should the existing build be replaced?, Notes (Decisions, Still open, Resume here). `team-roles.md`: roles table, narrower briefs (Existing-build survey, Domain specialist, Experience walk), sizing rules, example compositions (Small / Medium / Large).
- **V2 changes:** The model `DESIGN.md` template is this same template with R-01 headings, bold labels, and `Requirements: [WORK-ITEM.md](WORK-ITEM.md)`. Use the model file as the single template and delete the plugin copy, or keep the plugin copy identical. Replace the location defaults: local `DESIGN.md` beside `WORK-ITEM.md`; Notion Solution Design subpage; GitHub/Jira item record or attachment; never `docs/designs/`. Replace PRD paths with the work item's `## Requirements`. Replace `model: sonnet` researcher default in `team-roles.md` with Opus (GOAL: "Built by a team of Opus agents"; claude-toolkit rule `subagents-run-on-opus.md`). Replace `knowledge-save` with the V2 memory route. Keep the readiness gate and critic loop unchanged; they are the valuable part.

### 4.8 spec-check

- **Exact description:** "Check the specification an agent is about to build from or design a solution from, flag anything that could skew the work, and propose fixes before any building starts. Use when the owner types /spec-check, when a session is about to build or solution from a PRD file (knowledge/prds/, or prds/ with an external memory service) or a ticket body, or when the owner says \"check the spec\", \"is this spec clean\", or \"make sure the spec hasn't drifted\"." (448 characters)
- **What it does:** Names what it read, restates the goal in one line, then flags: text that fights the goal, build details in requirements, statements that read two ways, meaning a new reader cannot use, research and narrative in the body, requirements with no reason. A proposed fix per flag. Changes nothing without approval; a dismissed flag stays dismissed for the session; approved fixes go into the specification itself. A clean spec gets one line.
- **Assumes:** `knowledge/prds/`, `prds/`, `.toolkit-memory.json` external mode, "`proposed` PRD" versus "`current` PRD", GitHub issue, Linear ticket, local `WORK-ITEM.md` Requirements section (legacy `REQUIREMENTS.md`). Paired with `hooks-library`'s `spec-check-reminder` PostToolUse hook (fires once on the session's first Edit, Write, or NotebookEdit).
- **Calls:** `requirements-helper` when there is no spec text; `work-guide` Notes guidance.
- **V2 changes:** A specification is the active work item's `## Requirements` (local, Notion, GitHub, Jira). Root `requirements/<area>.md` is delivered behavior (the V1 "current PRD" role), so building must read the work item, not the area file. Drop Linear. Decide whether to port the `spec-check-reminder` hook as a V2 work-item hook (it is the kind of "step that must always run the same way" the GOAL wants hooks for). Rewrite the description to drop V1 paths.

### 4.9 track-tasks

- **Exact description:** "Build or refresh the running list of every topic still open in this chat session, using Claude Code's built-in task list, then print it. Use when the owner runs /track-tasks, or says \"what is still open\", \"where are we\", \"what are we tracking\", \"list the open topics\", \"what have we not finished\", \"add that to the list\", \"park that one\", or \"close that one\". Also use when a session has drifted across several unrelated topics and no list exists yet. Do not use for work that outlives this session: a ticket belongs in the project's work tracker, and unfinished state being carried to a fresh session belongs in a handoff prompt." (630 characters)
- **What it does:** Reads `TaskList`, rescans the conversation for open topics (parked topics, unanswered questions, blocked work, background-agent work), adds and corrects tasks with `TaskCreate` / `TaskUpdate` (`addBlockedBy` for order; "Parked by the owner" prefix since there is no parked status), prints a numbered table. States that the list dies with the session.
- **Assumes:** Claude Code built-in tools `TaskCreate`, `TaskUpdate`, `TaskList`. Name chosen because `/tasks` is a built-in command.
- **Calls:** Nothing.
- **V2 changes:** Codex has no `TaskCreate` family. Either mark it Claude-only in the skill index or add a Codex fallback (print the table from the conversation each time). In V2, "owner-mentioned to-dos and open loops" that must survive belong in `.memory/CURRENT_FOCUS.md` `## Owner-mentioned to-dos and open loops`; the "limits" section should name that home too.

### 4.10 unslop

- **Exact description:** "Strip the patterns that make writing read as machine-written from a file, pasted text, or the last answer, then hand back a version with a human voice. Use when the owner types /unslop, or says \"this reads like AI wrote it\", \"unslop this\", \"take the AI out of this\", \"make this sound human\", \"remove the AI tells\", or asks for a draft to be cleaned up rather than rewritten from scratch. Runs only when asked, never on its own." (427 characters)
- **What it does:** Reads the output style first (style wins on conflict), scans 31 numbered patterns in six groups (claims, words, shapes, punctuation and formatting, assistant leaking through, feelings instead of facts), rewrites, adds a voice back, asks "What still makes this read as machine written?", then shows a findings list (`Line 4 metaphor noun "..." -> "..."`, about 25 lines maximum) and the rewrite, and waits. Writes to a file only after a yes. Never changes numbers, paths, names, ids, quotes, or code.
- **Assumes:** Output style lookup; mentions `plain-english-artifacts.md` rule. Source: public `unslop` skill in `cursor/plugins`, adapted.
- **Calls:** Nothing.
- **V2 changes:** Conflict: the model rule `.claude/rules/humanize-outbound-text.md` (and the claude-toolkit copy) says outbound text "is run through the `humanizer` skill ... Use the `unslop` skill when `humanizer` is not installed." `unslop`'s description says "Runs only when asked, never on its own." No `humanizer` skill ships in the toolkit. V2 should pick one skill name and make the rule and the description agree (for example: "Use when the owner asks, or when the humanize-outbound-text rule applies to text going to another person").

### 4.11 work-guide

- **Exact description:** "Guide delivery in the main conversation, maintaining the chosen work item's adaptable plan and coordinating specialist help. Use when organizing project work, planning milestones or parallel items, switching context, or asking what should happen next." (251 characters)
- **What it does:** The method layer on top of the `work` skill. Orient once and refresh on switch (read the item, its requirements, design, roadmap task). Keep PRD and design work inside the document with a bottom `## Notes` (Decisions, Still open, Resume here); save promptly and verify by rereading. Keep other work in the tracker: every roadmap stage backed by tasks or child items, each task with objective, constraints, inputs, deliverable, acceptance condition, status, dependencies, position, next action. Coordinate parallel items and ownership. Bring in help: `requirements-helper`, `solution-design`, domain skills, `delivery-researcher`, `delivery-reviewer`; Codex fallback of passing the role file text to a native worker. Improve methods at item, project, or toolkit scope.
- **Assumes:** `work` skill and its agent-led delivery offer (`work-tracker/skills/work/references/agent-led-delivery.md`); `.work-items/` only when configured; GitHub, Jira, or another service; the handoff workflow.
- **Calls:** `work` (by registered name), `requirements-helper`, `solution-design`, `delivery-researcher`, `delivery-reviewer`, `handoff`. It is called by: `requirements-helper`, `solution-design`, `spec-check`, `handoff`, and `work`'s `agent-led-delivery.md` ("When available and relevant, invoke the installed `work-guide`, `requirements-helper`, or `solution-design` skill by its registered name.").
- **V2 changes:** Do not port as its own skill. Its description is nearly the same job as `work` ("Use before substantial work, and when starting, resuming, changing stage, or closing a work item.") and `project-init:work-item-lifecycle`. Its useful content (Notes discipline, task record fields, parallel ownership, helper briefing and Codex fallback, "not saved" wording) belongs in the new V2 orchestration skill set as shared references. The model `WORK-ITEM.md` Roadmap and Tasks format already encodes the "stage backed by tasks" rule.

---

## 5. session-skills: agent inventory

All seven are read-only except `design-architect` (writes only the named draft
design). All forbid spawning further agents, interviewing the owner, running
tests or builds, and adding AI credit. All carry their own plain-writing rules
because "An output style is delivered in the main conversation and never
reaches you" (handoff-verifier).

| Agent | Exact description | Called by | Returns | V2 changes |
| --- | --- | --- | --- | --- |
| `delivery-researcher` | "Research a focused delivery question using project evidence and current official sources, returning findings and uncertainties to the owning conversation without changing records." | `work-guide` | Answer, Evidence, Recommendation, Open | Near duplicate of `design-researcher` (only difference: design-researcher also reads community sources and labels each finding). Merge into one researcher |
| `delivery-reviewer` | "Independently review requirements, a solution design, or a delivery plan for gaps and conflicts, using the agreed scope and project or work-item variations without changing records." | `work-guide`, `requirements-helper` | Material findings ordered by effect, then unchecked claims and access limits | Overlaps `design-product-analyst` (requirements readiness) and `design-critic` (design review). Keep only if V2 needs a plan reviewer; otherwise merge |
| `design-product-analyst` | "Check that a work item's requirements are complete, explicit end to end, and coherent inside the larger system before any design starts. Returns a plain ready or not-ready statement, the missing pieces, the places that are not explicit, and the wording a builder agent could misread, each with a fix. Read-only; it never edits or approves." | `solution-design` step 4a | Ready, Missing, Not explicit end to end, Misreading risks, Does not fit | Point it at `WORK-ITEM.md` `## Requirements` and `## Open Questions` |
| `design-researcher` | "Answer one bounded research question for a solution design using official documentation, project evidence, and community sources such as Reddit, Stack Overflow, GitHub issues, and forums. Returns findings labeled by source type without changing any record." | `solution-design` step 4b | Answer, Findings (labeled official documentation / project evidence / community claim), Community claims to verify, Requirements concerns, Open | `model: sonnet` to `opus` |
| `design-architect` | "Write or fix one solution design option from the design preparation and Notes, the requirements, the research reports, and the existing build. Verifies community claims before using them, uses built-in mechanisms unless the owner chose otherwise, and recommends a rewrite when that serves the requirements better than extending what exists." | `solution-design` step 4c and 4e | Draft `DESIGN.md` sections; list of changes per fix round | Write target becomes `DESIGN.md` (local) or the Notion Solution Design subpage. For Notion the agent needs a way to write there (it has only `Write, Edit`); the main conversation may have to write Notion pages from the agent's returned text |
| `design-critic` | "Check a draft solution design against every requirement and against the plain-language writing rules, returning one verdict per requirement with evidence and a list of findings for the architect to fix. Read-only; it never edits or approves." | `solution-design` step 4d | Verdict table (Satisfied / Partly satisfied / Not satisfied), Findings, Disagreements, Clean | None beyond paths |
| `handoff-verifier` | "Check, without changing anything, that a drafted handoff prompt states the overarching goal and that every fact in it holds up, before the owner sees it." | `handoff` step 5 and `/handoff check` | Fixed report: Goal verdict (Confirmed / Wrong / Unchecked / Missing), Claims table (source kind, verdict, detail), Carried over from an earlier handoff, Skipped, Also noticed | `model: inherit` to `opus`. Bash allowlist in its text includes `gh issue view` / `gh pr view`; add read-only Notion (`ntn`) and Hindsight read commands if handoffs cite those trackers or memories |

---

## 6. git-workflows: skill inventory

### 6.1 merge-and-clean-up

- **Exact description:** "Merge an approved GitHub pull request, update its base checkout, and safely remove only the merged PR's remote branch, local branch, and isolated worktree. Use when the user says \"merge and clean up\", \"merge this PR and cleanup\", \"land this pull request\", \"merge then remove the worktree\", or asks to finish an already-open PR and clean up its Git artifacts. Supports Claude and Codex sessions using local git plus the GitHub CLI." (430 characters)
- **What it does:** (1) resolve the exact PR (`gh pr view --json number,url,state,headRefName,headRefOid,baseRefName,isCrossRepository`), map branches to worktrees with `git worktree list --porcelain`, require local head SHA to equal `headRefOid`; (2) preflight (open, not draft, mergeable, reviews, checks; "no checks reported" is not a failure); (3) merge with `gh pr merge <n> --repo <owner/repo> --squash --delete-branch` (no admin flags; no `--delete-branch` for forks); verify `state` is `MERGED`; (4) `git fetch --prune origin` and `git pull --ff-only` in the clean base worktree; (5) recheck five proofs, then `git worktree remove`, `git branch -d` (or `-D` only for the expected squash non-ancestor refusal), `git worktree prune`, delete the remote branch only if same repo; (6) report PR link, merge commit, base state, cleanup result.
- **Assumes:** `AGENTS.md` "(or `CLAUDE.md` in a project still in the old layout)"; `gh`; "Follow repository instructions for moving a linked ticket to its completed state after the merge."
- **Calls:** Nothing. It is the required route for `gh pr merge` in `protocol-guard` protocol `P3` ("A merge goes through merge-and-clean-up ...").
- **V2 changes:** Drop the `CLAUDE.md` mention. Replace "moving a linked ticket to its completed state" with the V2 lifecycle: move the work item to `12-pr-and-push` / `13-deployment` as fits, never to `Done` (Done needs the owner's approval of the result). Add the claude-toolkit merge-safety check (compare `git diff --name-only <default>...<branch>` with `git status` in the primary checkout) since the V2 parallel-sessions rule requires it before every merge.

### 6.2 publish-docs

- **Exact description:** "Use when saving an authorized documentation-only change (project knowledge, PRDs, designs, review records, README files, architecture documents) to the default branch from an isolated save workspace. Checks, commits, pushes, and verifies the remote result without a pull request." (279 characters)
- **What it does:** Decide the change is documentation (rules, skills, prompts, hooks, settings, and code are not, even in Markdown). Run `node <skill-dir>/scripts/publish-docs.mjs start --branch <default-branch> -- <file>...`, which fetches, creates a detached sparse worktree named `<repo>-docsave-<8 hex>` beside the project, and records a marker `toolkit-docsave.json` in the worktree's git dir. Edit, check, stage by name, then `publish-docs.mjs publish --message "<msg>"`, which refuses other staged paths, unstaged or untracked files, whitespace errors; commits; refuses if the remote advanced; pushes `HEAD:<branch>` without force; verifies the remote contains the commit.
- **Script assumptions to rewrite for V2** (`scripts/publish-docs.mjs`):
  - `cleanPath` accepts only `.md` files and rejects `AGENTS.md`, `CLAUDE.md`, `SKILL.md`, and any non-README file under `plugins/`, `.claude/`, `.agents/`, `tests/`, `src/`, `scripts/`. V2 model has `delivery/deployment/component-tracker.csv` inside a documentation path the rule covers; the script would refuse it.
  - `generatedPaths` adds `knowledge/memory/memory-index.md`, `knowledge/prds/prd-index.md`, `prds/prd-index.md`, and `ai-external-knowledge/README.md`. V2 has none of the first three, and the model's index is `ai-external-knowledge/INDEX.md`, not `README.md`.
  - Sparse checkout always includes `knowledge`, `ai-external-knowledge`, `prds`, `docs`, `.claude/tools`.
  - A "knowledge change" (paths under `knowledge/`, `prds/`, `ai-external-knowledge/`, or `SOUL.md`, `PROJECT.md`, `docs/knowledge-manual.md`, `.toolkit-memory.json`) requires a pre-commit hook containing `# claude-toolkit:knowledge-pre-commit`; otherwise it refuses: "The knowledge pre-commit check is missing." V2 must drop or replace this, or every `PROJECT.md` save fails.
- **Assumes (skill text):** knowledge index rebuild and "installed knowledge checker"; the path-scoped `knowledge-direct-commit.md` rule.
- **Calls:** Nothing. Referenced by `second-brain/hooks/save-reminder.mjs` and the `knowledge-direct-commit.md` rule.
- **V2 changes:** Model rule `knowledge-direct-commit.md` scopes `requirements/**`, `PROJECT-ROADMAP.md`, `PROJECT.md`, `docs/**`, `ai-external-knowledge/**`, `delivery/**`, `**/README.md` and adds "`.memory/` and `.work-items/` are local and Git-ignored. Their saves do not use this publication route." Rewrite the description to name those V2 homes instead of "project knowledge, PRDs". Keep the isolated worktree mechanism and the two node tests.

### 6.3 pull-latest

- **Exact description:** "Safely bring a local git repository up to date with its remote when the checkout may be shared by parallel agent sessions. Fetch + prune, fast-forward when possible, and when local and remote have diverged, inspect both sides and reconcile with a merge pull — never rebase, never reset, never push. Use this whenever the user asks to \"get the latest\", \"pull the latest changes\", \"sync with remote\", \"update from origin\", \"grab what others pushed\", or mentions that other agents/sessions/teammates pushed changes they want locally — even if they just say \"update the repo\". Do NOT use when the user expresses destructive-sync intent (wipe local, exactly mirror remote, fresh start) — that is the reset-to-remote skill's job." (723 characters)
- **What it does:** Stops on a dirty tree or an unexpected branch in the shared checkout. `git fetch --prune origin`, `git pull --ff-only`; if diverged, inspects `git log --oneline @{u}..HEAD` and `HEAD..@{u}`, then `git pull --no-rebase --no-edit`. Never pushes. Reports incoming commits and final state.
- **Assumes:** Nothing project-specific.
- **V2 changes:** Remove "sync with remote" from the triggers (also a `reset-to-remote` trigger). Remove em dashes (Plain English rule). Shorten.

### 6.4 reset-to-remote

- **Exact description:** "Hard-reset a local git repository to exactly mirror its remote — fetch + prune, reset every local branch that tracks a remote to that remote's tip, delete branches whose remote was removed, and reinstall dependencies from the lockfile. Use this whenever the user wants to \"match remote\", \"sync with remote\", \"fresh start from remote\", \"make this an exact clone of remote\", \"wipe local and pull from remote\", or describes wanting their local repo to equal what's on the remote (e.g., \"I haven't worked on this in a while, others have, just want a fresh start\"). Treat this as the safe alternative to deleting and re-cloning a repository. Do NOT trigger for routine `git pull` / `git fetch` requests that don't express destructive-sync intent." (741 characters)
- **What it does:** Verify one remote; refuse on dirty tree or stashes; `git fetch --all --prune`; find the default branch from `refs/remotes/origin/HEAD`; show a plan of (a) branches to hard-reset, (b) `[gone]` branches to delete, (c) local-only branches to keep; wait for approval; `git checkout <default>`, `git reset --hard <upstream>` or `git branch -f`, `git branch -D` for gone branches; run the lockfile's installer (`pnpm install`, `npm install`, `yarn install`, `bun install`), asking if several lockfiles exist.
- **Assumes:** Nothing project-specific.
- **V2 changes:** Remove "sync with remote". It conflicts with the V2 parallel-sessions rule ("In the shared primary checkout, never switch branches, reset, rebase, or stash") only if run in a shared checkout; add one line that it runs only when the owner asks for a destructive reset. The model `.claude/settings.json` puts `Bash(git reset --hard *)` under `ask`, so the owner will be prompted anyway.

---

## 7. system-guide: skill inventory

- **Exact description:** "Uses and maintains an enabled project's System Guide for questions or work about how an existing system is structured, what its parts do, how they connect, or what a change may affect. Also use when substantial investigation finds valuable understanding, source behavior changes, or the owner corrects system meaning. Do not use for required future behavior alone, work status, or obvious code summaries." (404 characters)
- **What it does:** Runs `node <plugin-root>/tools/system-guide.mjs status --root <project-root> --json` first. If off (`.system-guide.json` missing or `"enabled": false`), does nothing. If on: open the entry page and smallest relevant index before broad source search; read explanations before changing a documented part; refresh generated pages after source changes; propose useful findings; check affected pages before handoff. Meaning changes need exact owner approval through `propose` (preview id and hash) and `apply --approval <json>` (`approvedBy`, `approvedAt`).
- **CLI commands:** `status`, `setup` (`--guide-path`, repeatable `--source kind:completeness:path` with kind `code` or `salesforce`, completeness `complete` or `partial`, `--adopt`), `refresh` (`--full`), `check` (exit 1 when repair needed), `propose --request <json>`, `apply --preview <id> --approval <json>`, `disable`. `--json` on all. Config `.system-guide.json`: `{"version": 1, "enabled": true, "guidePath": "knowledge/system", "sources": [{"path": "src", "kind": "code", "completeness": "complete"}]}`. The `code` kind maps JavaScript, TypeScript, and Python imports; the `salesforce` kind maps objects, fields, flows, lookups, and qualified field writes.
- **Assumes:** Default `knowledge/system/`; entry page `<guidePath>/README.md`; second-brain find order (current work, standing rules, skills, PRDs + memory + System Guide, past sessions) in `routing-and-sources.md`; placement table routing "required behavior" to PRD and "lasting decision" to Memory via the second brain's save test; second-brain startup prints `System Guide is not configured.` when off.
- **Calls:** Its own CLI. Integrates with second-brain `knowledge-find` and `knowledge-session-start.mjs` (`SYSTEM_GUIDE_CONFIG = ".system-guide.json"`).
- **V2 changes / decision needed:**
  - The model project replaces this with a hand-written `docs/system-guide/` and `docs/system-guide/AREA-TEMPLATE.md` (sections: What this area does today, Components and paths, Data and flow, Operational behavior, Known gaps and uncertainty, Last verified). The model also has `tools/kb/` (a Python Salesforce dependency graph with `build_edges.py`, `query_graph.py`, and a Stop hook `graph_freshness_hook.py`), which overlaps the CLI's `salesforce` source kind.
  - The model root `AGENTS.md` still references `.system-guide.json` and the plugin's skill. Either port the plugin with `guidePath` default `docs/system-guide`, or drop the plugin and give V2 a small skill that maintains `docs/system-guide/` area pages by hand.
  - The generated entry page is `README.md` inside the guide folder. GOAL says "no README in every folder"; one entry README may be acceptable, but say so.
  - The routing table must map to V2 homes: required behavior to the work item `## Requirements` and root `requirements/`; lasting decisions to `.memory/` topics, Hindsight, or Notion Memory; status to the tracker.
  - The session-start briefing should merge into the V2 project `SessionStart` hook (model `.claude/hooks/toolkit-session-start.mjs` and `.codex/hooks.json`) so there is one orientation line, not two.

---

## 8. Overlaps and unclear descriptions

Skills are picked from name plus description only. These are the collisions.

### 8.1 Evidence that the listing is already overloaded

In this research session (a Claude Code session inside claude-toolkit), the
skill listing shown to the agent had **no description at all** for:
`session-skills:grill-me`, `session-skills:handoff`, `session-skills:session-summary`,
`session-skills:solution-design`, `session-skills:spec-check`,
`session-skills:track-tasks`, `session-skills:work-guide`,
`git-workflows:publish-docs`, `git-workflows:reset-to-remote`,
`system-guide:system-guide`, and also `work-tracker:work`,
`project-init:work-item-lifecycle`, `second-brain:knowledge-review`,
`second-brain:knowledge-setup`. The captured `skills.md` explains why: the
listing budget is 1% of the context window, and "When the listing overflows,
Claude Code drops descriptions starting with the skills you invoke least". Each
entry's `description` plus `when_to_use` is also capped at 1,536 characters.
So on Mike's machine the agent often sees only the name. V2 consequences:
fewer skills, names that say the job by themselves, key use first in each
description, and descriptions near 250 to 400 characters. Seven of the 16
skills here are over 440 characters (handoff 684, session-summary 656,
track-tasks 630, pull-latest 723, reset-to-remote 741, solution-design 594,
spec-check 448).

### 8.2 Overlapping skills

| Overlap | What collides | Recommendation |
| --- | --- | --- |
| `work-guide` vs `work` (work-tracker) vs `work-item-lifecycle` (project-init) | All three claim "organize/start/resume work items". `work-guide`: "organizing project work, planning milestones or parallel items, switching context, or asking what should happen next". `work`: "before substantial work, and when starting, resuming, changing stage, or closing a work item". | One V2 orchestration set with non-overlapping jobs. Drop `work-guide` as a skill |
| `track-tasks` vs `session-summary` | Trigger phrases are near synonyms: track-tasks "what is still open", "where are we", "what have we not finished"; session-summary "where do things stand", "status of my requests", "what did we do". | Give each a distinct trigger set: track-tasks = keep a live list during the session ("add that to the list", "park that"); session-summary = one recap table at the end ("recap", "what did I ask for") |
| `handoff` vs `session-summary` | Both "when a session is wrapping up or being handed off" (session-summary description says this explicitly) | Remove "or being handed off" from session-summary |
| `grill-me` vs `requirements-helper` vs `braindump` (and `superpowers:brainstorming`, installed on this machine) | All interview the owner about what they want. braindump = one playback; grill-me = long interview into a brainstorm file; requirements-helper = interview into requirements | Merge grill-me into requirements-helper. Keep braindump (one-shot playback, no writes) |
| `spec-check` vs `solution-design` step 1 vs `design-product-analyst` vs `delivery-reviewer` (requirements mode) | Four ways to check requirements quality before building | Keep spec-check (before build) and the product analyst (before design, inside solution-design). Have solution-design call spec-check instead of repeating the readiness questions, or state the difference: spec-check hunts drift and clutter; the analyst hunts gaps and misreadings |
| `delivery-researcher` vs `design-researcher` | Same job, same tools; design version adds community sources and labels | Merge into one `researcher` agent |
| `delivery-reviewer` vs `design-critic` / `design-product-analyst` | Reviewer covers requirements, design, and plan; the other two cover requirements and design | Keep one general reviewer only if a plan-review job exists in V2 |
| `pull-latest` vs `reset-to-remote` | Both list "sync with remote" | Remove it from both, or keep it only on pull-latest |
| `unslop` vs `humanize-outbound-text.md` rule vs `explain-simply` | Rule requires a `humanizer` skill (not shipped) with `unslop` as fallback; unslop says "never on its own" | Pick one skill; align the rule and the description. explain-simply is different (reading level, not voice) and can stay |
| `publish-docs` vs V1 `knowledge-save` | Both describe saving project knowledge and PRDs | In V2, publish-docs covers only Git-tracked documents (`requirements/`, `docs/`, `delivery/`, `PROJECT.md`, `PROJECT-ROADMAP.md`, `ai-external-knowledge/`, README files). Memory saves never use it |
| `system-guide` vs V1 `knowledge-find` | Both answer "how does the existing system work" lookups | V2 memory find skill should route system questions to the guide |
| `merge-and-clean-up` vs `superpowers:finishing-a-development-branch` (installed on this machine) | Both finish a branch | Out of V2 scope, but the V2 skill index should name merge-and-clean-up as the route |

### 8.3 Unclear descriptions (as the picker sees them)

- `work-guide`: "Guide delivery", "adaptable plan", "coordinating specialist help" are abstract. A picker cannot tell it from `work`.
- `requirements-helper`: says "PRDs", which do not exist in V2; "the project's chosen record" does not say where. The name does not say "write requirements".
- `handoff`: names V1 internals ("knowledge-save or legacy remember review", "Session handoffs in current working memory").
- `spec-check`: names V1 paths (`knowledge/prds/`, `prds/`) and "external memory service".
- `grill-me`: fine as words, but promises a "brainstorm file" V2 has no home for.
- `solution-design`: clear, but long and process-heavy; the key trigger ("a work item has approved requirements and needs a design") is in the middle.
- `publish-docs`: lists "project knowledge, PRDs" (V1 terms).
- `system-guide`: "an enabled project's System Guide" is a proper noun the picker must already know; it also depends on `.system-guide.json` being on.
- `track-tasks`: says "Claude Code's built-in task list", which does not exist in Codex.
- `pull-latest`, `reset-to-remote`: long, em dashes, shared trigger.

Draft V2 descriptions (suggestions for the architect, key use first):

- handoff: "Write a checked prompt a fresh session can start from, after updating the active work item and saving approved memory. Use when the owner says \"write a handoff\", \"I'm going to clear context\", \"this session is getting long\", or runs /handoff. \"/handoff check\" only verifies an existing prompt."
- requirements (merged requirements-helper + grill-me): "Interview the owner one question at a time and write the answers into the active work item's Requirements and Open Questions. Use to capture or change what a work item must do, to run a discovery interview (\"grill me\"), or to resume a requirements conversation."
- spec-check: "Check a work item's requirements for drift before designing or building from them, and propose fixes. Use when the owner says \"check the spec\", before solution design, or before build starts."
- publish-docs: "Commit and push an approved change to Git-tracked project documents (requirements/, docs/, delivery/, PROJECT.md, PROJECT-ROADMAP.md, ai-external-knowledge/, README files) straight to the default branch from an isolated worktree. Not for code, rules, skills, hooks, settings, .memory/, or .work-items/."

---

## 9. Shared patterns to centralize in V2

- **Voice lookup block.** Identical paragraph in `braindump`, `explain-simply`, `spec-check`, `track-tasks`, `unslop` (and a variant in handoff). It reads `outputStyle` from three settings files and matches `.claude/output-styles/*.md` by frontmatter `name`. Codex has no output styles. V2 option: one short line, "Follow the project's Plain English style in `.claude/output-styles/plain-english.md` when present," or a shared reference file.
- **Document Notes discipline.** `work-guide`, `requirements-helper`, `spec-check`, `solution-design`, `delivery-reviewer`, and `handoff` each restate: update the real text, keep `## Notes` with Decisions / Still open / Resume here, record open questions with who must answer, save before moving on, verify by rereading, lead with "not saved" on failure. V2 should put this once in the orchestration skill's reference and map it to the `WORK-ITEM.md` sections.
- **Codex helper fallback.** `work-guide` and `solution-design` say: where the host does not load plugin agents, read the role file and pass its full text to a native worker; if no worker exists, say no independent review ran. `handoff` lacks it. Put it in one reference.
- **"Not saved" wording.** requirements-helper, work-guide, solution-design, handoff all require leading with the failure. Keep once.
- **Model defaults.** Agents use `inherit`, `sonnet`, `opus`. GOAL and claude-toolkit rule `subagents-run-on-opus.md` want Opus. Set `model: opus` in every V2 agent file.
- **Stale README text.** session-skills README says "How the eight relate" and "you would always want all eight" while shipping eleven. GOAL says no README in every folder; if V2 keeps plugin READMEs, keep counts out of them.

---

## 10. Tests and scenarios that exist today

| Test | Covers | Runs with |
| --- | --- | --- |
| `claude-toolkit/tests/session-handoffs-scenarios.md` | Handoff scenarios: capture and preserve, resume the right work, overflow without loss, legacy and partial installation, publication and failure | Manual scenario list |
| `git-workflows/tests/publish-docs.test.mjs` | "parallel saves have separate staging areas and a remote race is recoverable"; "a knowledge save checks a staged link to a file outside the sparse checkout" | `node --test plugins/git-workflows/tests/publish-docs.test.mjs` |
| `system-guide/tests/core.test.mjs` | About 20 tests: deterministic code refresh, Salesforce metadata, meaning survives refresh byte for byte, partial versus complete snapshots, deletion link repair, CLI status and check exit codes | `node --test` |
| `claude-toolkit/tests/experience-system-guide.test.mjs`, `tests/system-guide-integration.test.mjs` | Startup briefing and second-brain integration | `node --test` |
| `hooks-library/hooks/spec-check-reminder.mjs` | Once-per-session PostToolUse reminder on Edit/Write/NotebookEdit, state file under the OS temp folder keyed by session id | Hook, not a test |

---

## 11. Recommended V2 disposition (for the architect)

- Port unchanged except voice line and description trims: `braindump`, `explain-simply`, `session-summary`, `unslop` (after fixing the humanize rule), `pull-latest`, `reset-to-remote`, `merge-and-clean-up` (plus lifecycle and merge-safety lines).
- Port with V2 rewrites: `handoff` + `handoff-verifier`, `spec-check`, `solution-design` + `design-product-analyst`, `design-researcher`, `design-architect`, `design-critic`, `publish-docs` (skill and script), `track-tasks` (Codex note).
- Merge: `grill-me` into `requirements-helper` (and consider renaming it so the name says "requirements"); `delivery-researcher` into `design-researcher`; decide on `delivery-reviewer`.
- Replace: `work-guide` with the new V2 orchestration skills; move its method text into their references.
- Decide: `system-guide` (port the generated CLI with `guidePath` `docs/system-guide`, or a small hand-written-guide skill matching the model template).
- Consider as hooks (GOAL: "hooks for the steps that must always run the same way"): the `spec-check-reminder` (first edit asks whether requirements were checked) and a work-item "next step recorded" check before session end, since `handoff` itself notes "A clear with no warning is not caught."

---

## 12. Open questions

1. Handoff storage in `.memory/`: keep V1's multi-entry, timestamped, newest-first `## Session handoffs` list, or use the model's single `## Next-session handoff` section inside the 50-line `CURRENT_FOCUS.md`? The two conflict.
2. Handoff storage for Hindsight and Notion memory: what record type or key replaces `working:handoff:<UTC time>`?
3. Where does a discovery interview (grill-me) write in V2, given there is no `brainstorms/` folder? Merge into requirements-helper, or add a folder in the model review?
4. Is `work-guide` retired in favor of the new orchestration skills, and which V2 skill owns the agent-led delivery offer now owned by `work`?
5. System Guide: port the V1 generated CLI (default path changed to `docs/system-guide`), or replace it with a hand-maintained skill that follows `docs/system-guide/AREA-TEMPLATE.md`? How does it relate to the model's `tools/kb/` Salesforce graph?
6. Can a Codex plugin ship hooks, or must every Codex hook live in the project's `.codex/hooks.json`? The captured Codex docs (`agents-md.md` only) do not say.
7. Codex equivalent for `track-tasks` (no `TaskCreate` family): Claude-only, or a Codex fallback?
8. `unslop` versus the `humanize-outbound-text.md` rule's `humanizer` skill: which name ships, and may it run without being asked for outbound text?
9. `publish-docs` script: should it accept non-Markdown files under `delivery/` (for example `delivery/deployment/component-tracker.csv`)? What replaces the knowledge pre-commit hook check?
10. For a Notion tracker, who writes the Solution Design subpage: the `design-architect` agent (needs `ntn` through Bash, which it does not have) or the main conversation from the agent's returned text?
11. The stage after merge: should `merge-and-clean-up` move the work item to `12-pr-and-push`, `13-deployment`, or leave the move to the orchestration skill?
12. Are the 14 V1 lifecycle stages kept word for word (GOAL: "the same stages")? The model `WORK-ITEM.md` status list (`Backlog | In Progress | Blocked | Done`) differs from V1's active statuses (`Backlog`, `Ready`, `In Progress`, `In Review`, plus `Done`, `Cancelled`).

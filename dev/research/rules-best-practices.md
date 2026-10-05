# Rules best practices: checklist and audit of the model's rules

Written 2026-09-29 for Toolkit V2. Mike asked (2026-09-29): "Make sure the
rules are written using Claude Code best practices." Part 1 is the checklist,
with the page each item comes from. Part 2 audits the 18 rule files on the
model branch and the `owner-preferences.md` format that `toolkit rule add`
writes. The audit changed no rule.

Mike's decisions in `dev/GOAL.md` win over this file, in particular "Rules,
skills, and memory each hold one kind of thing" (2026-09-29): instructions the
agent must follow every time go in rules, confirmed procedures in skills, and
facts and unproven lessons in memory.

## Contents

- How to read the citations
- Part 1. Checklist for a rule
  - A. What belongs in a rule (R1 to R7)
  - B. The file (R8 to R11)
  - C. Load mode and `paths` (R12 to R16)
  - D. Size and upkeep (R17, R18)
  - E. Wording (R19 to R24)
  - F. How Codex sees rules (R25 to R27)
  - G. How to check what loaded (R28)
- Part 2. Audit
  - 2.1 Method and marks
  - 2.2 Summary table
  - 2.3 Always-on size per project
  - 2.4 Each rule (18 sections, alphabetical)
  - 2.5 The owner-preferences format
  - 2.6 Findings that cross several files
  - 2.7 Questions for Mike
  - 2.8 Checks a rules checker could run

## How to read the citations

- `claude-code/<file>`, `codex/<file>`, `anthropic-agent-skills/<file>`, and
  `anthropic-engineering/<file>` mean that file under `ai-external-knowledge/`.
  Text in quotes after a file name is the section heading, or the tab title
  on pages that use tabs.
- Most pages were captured on 2026-09-27. Four were captured on 2026-09-29 for
  this audit: `large-codebases.md`, `debug-your-config.md`, and
  `claude-directory.md` are new, and `memory.md` was captured again because
  the live page had added the `/doctor prompt-audit` paragraph and the
  `includeGitInstructions` line. `claude-code/SOURCE-RECORD.md` records them.
- **Inference** marks a conclusion drawn from two cited facts. The docs do not
  say it in one sentence.
- **Observed** marks something run on this Mac on 2026-09-29. Installed
  versions: Claude Code 2.1.280, Codex 0.157.0.

---

## Part 1. Checklist for a rule

### A. What belongs in a rule

**R1. A rule holds an instruction the agent must follow in every session, or
whenever it works on certain files.** Facts the agent can read from the code,
multi-step procedures, and reference material do not belong in a rule.
`claude-code/memory.md` "When to add to CLAUDE.md": "Keep it to facts Claude
should hold in every session ... If an entry is a multi-step procedure or only
matters for one part of the codebase, move it to a skill or a path-scoped
rule instead." `claude-code/features-overview.md` "CLAUDE.md vs Rules vs
Skills": rules are for "Language-specific or directory-specific guidelines".

**R2. A procedure, or reference material the agent needs only sometimes, goes
in a skill. The rule keeps at most one line that says when to open the
skill.** `claude-code/memory.md` "Organize rules with `.claude/rules/`" (Note):
"For task-specific instructions that don't need to be in context all the
time, use skills instead." `claude-code/best-practices.md` "Write an effective
CLAUDE.md": "For domain knowledge or workflows that are only relevant
sometimes, use skills instead." `claude-code/features-overview.md` "Combine
features": "CLAUDE.md says 'follow our API conventions,' a skill contains the
full API style guide."

**R3. Anything that must happen every time, or must never happen, is enforced
by a hook or a permission rule. The text rule can stay as the explanation; it
is not the enforcement.** Instruction files are "delivered as a user message
after the system prompt ... there's no guarantee of strict compliance"
(`claude-code/memory.md` "Claude isn't following my CLAUDE.md"). "An
instruction like 'never edit `.env`' in CLAUDE.md or a skill is a request, not
a guarantee" (`claude-code/features-overview.md` "Hook vs Skill"). "Like
CLAUDE.md, rules are guidance Claude reads, not configuration Claude Code
enforces" (`claude-code/claude-directory.md`, the `rules/` entry). "Use
permissions or hooks for security boundaries and anything that must never
happen" (`claude-code/debug-your-config.md`, Note).

**R4. Instructions every session needs for the whole project (commands,
layout, routing, who decides) go in the root instruction file. Rules keep
that file focused.** "Use CLAUDE.md for instructions every session needs ...
Use rules to keep CLAUDE.md focused" (`claude-code/features-overview.md`
"CLAUDE.md vs Rules vs Skills"). In Toolkit V2 the root instruction file is
`AGENTS.md`, which the root `CLAUDE.md` imports with `@AGENTS.md`.

**R5. How the agent writes its chat replies belongs in the output style.**
`claude-code/features-overview.md` "CLAUDE.md vs Output style": an output style
holds "A role, tone, and response format"; instruction files hold what "is
true of the project whatever style you're in". Toolkit V2 also puts the reply
rules in `AGENTS.md` "How to write replies", because Codex has no output
styles (`dev/research/platform-best-practices.md` 3.6).

**R6. A personal preference for every project goes in `~/.claude/rules/`. It
loads before project rules, and a conflict between a user rule and a project
rule is settled arbitrarily.** `claude-code/memory.md` "User-level rules": "if
a user rule and a project rule conflict, Claude may follow either one, so
keep the two consistent."

**R7. Leave out what the agent already does correctly or can read from the
code.** `claude-code/best-practices.md` "Write an effective CLAUDE.md": "For
each line, ask: 'Would removing this cause Claude to make mistakes?' If not,
cut it." Same page, "Avoid common failure patterns": "If Claude already does
something correctly without the instruction, delete it or convert it to a
hook." `/doctor` keeps "pitfalls, rationale, and conventions that differ from
tool defaults" (`claude-code/memory.md` "My CLAUDE.md is too large").

### B. The file

**R8. One topic per file.** `claude-code/memory.md` "Set up rules": "Each file
should cover one topic".

**R9. A descriptive file name, ending in `.md`.** Same section: "with a
descriptive filename like `testing.md` or `api-design.md`. All `.md` files are
discovered recursively".

**R10. The first `# ` heading names the topic in plain words.** The examples
in `claude-code/memory.md` "Path-specific rules" and
`claude-code/claude-directory.md` (`# Testing Rules`, `# API Design Rules`)
start this way. Toolkit V2 also copies this heading into the `AGENTS.md` rules
list (`describeRule` in `plugins/toolkit/lib/project/render.mjs`), so the
heading is what Codex sees first.

**R11. Use headings and bullets, not dense paragraphs.** `claude-code/memory.md`
"Write effective instructions", Structure: "use markdown headers and bullets
to group related instructions. Claude scans structure the same way readers
do: organized sections are easier to follow than dense paragraphs."

### C. Load mode and `paths`

**R12. Add `paths` only when the rule applies to certain files, and when the
agent reads, writes, or edits one of those files before the moment the rule
is needed.** A path-scoped rule loads "when Claude uses the Read, Write, or
Edit tool on a file matching the pattern, not on every tool use"
(`claude-code/memory.md` "Path-specific rules", captured 2026-10-05; the
page captured 2026-09-29 named only reading, and this item said so until
it was corrected on 2026-10-05). So it does not load when the agent runs a
command, or answers a question. An instruction for those moments is always
on (no `paths`) or in a skill. The audit in Part 2 was written under the
earlier wording: where it says a rule is "not loaded yet" because the agent
creates a file without reading one, that reason no longer holds.

**R13. Write valid frontmatter and globs.** From `claude-code/memory.md`
"Path-specific rules" and "Rule frontmatter reference":

- `paths` is the only field Claude Code reads. It accepts a YAML list or a
  comma-separated string. Any other field is ignored without an error.
- Patterns are relative to the project root. `*.md` matches Markdown files in
  the root only; `**/*.ts` matches at any depth; `src/**/*` matches everything
  under `src/`.
- Brace groups such as `{ts,tsx}` expand. One rule's whole `paths` list may
  expand to at most 1,000 patterns; a pattern over the budget is used
  unexpanded and matches no file.
- A `[` that cannot be read as a bracket expression makes that pattern match
  nothing. Escape a literal `[` as `\[`.
- If the YAML does not parse, Claude Code ignores the frontmatter and loads
  the rule as always on. `claude --debug` shows the parse error.
- A symlinked rule whose target is outside the project loads only after
  external imports are approved, and then only if it has no `paths` field
  (`claude-code/memory.md` "Share rules across projects with symlinks").

**R14. An instruction that must hold for the whole session has no `paths`.** A
path-scoped rule is summarized away at compaction and comes back only when
the agent next reads a matching file. `claude-code/context-window.md` "What
survives compaction": "If a rule must persist across compaction, drop the
`paths:` frontmatter or move it to the project-root CLAUDE.md."

**R15. An always-on rule loads at session start, with the same priority as
`.claude/CLAUDE.md`, and is re-injected from disk after compaction.**
`claude-code/memory.md` "Set up rules"; `claude-code/context-window.md` "What
survives compaction" ("Project-root CLAUDE.md and unscoped rules: Re-injected
from disk"). Inference: a rule file changed during a session reaches Claude
Code at the next session start or compaction, because the `InstructionsLoaded`
load reasons are only `session_start`, `nested_traversal`, `path_glob_match`,
`include`, and `compact` (`claude-code/hooks.md` "InstructionsLoaded").

**R16. Claude Code subagents load project rules too; the built-in Explore and
Plan agents, and agents with `omitClaudeMd`, do not.**
`claude-code/sub-agents.md` "What loads at startup": a subagent's context
holds "every level of the CLAUDE.md hierarchy the main conversation loads,
including `~/.claude/CLAUDE.md`, project rules". Inference: a subagent does not
get the output style, because its system prompt is "the agent's own prompt
plus environment details ..., not the Claude Code system prompt" (same
section). So a rule reaches a Claude Code helper; a skill reaches it only
when the helper opens it or the agent's `skills` field names it.

### D. Size and upkeep

**R17. Keep always-on rules short. Their text is sent with every request.**

- `claude-code/features-overview.md` "Context cost by feature": CLAUDE.md
  content costs context on "Every request". Always-on rules load "with the
  same priority" (R15).
- "target under 200 lines per CLAUDE.md file. Longer files consume more
  context and reduce adherence" (`claude-code/memory.md` "Write effective
  instructions", Size).
- Claude Code warns at startup and in `/status` when one instruction file is
  over the recommended length, and when files that are each within it "add up
  past a combined limit". "Each CLAUDE.md, rules file, and `@path` import
  counts as a separate file." Imports do not reduce context
  (`claude-code/memory.md` "My CLAUDE.md is too large").
- "Bloated CLAUDE.md files cause Claude to ignore your actual instructions!"
  (`claude-code/best-practices.md` "Write an effective CLAUDE.md").
- Aim for the smallest set of instructions that fully states the expected
  behavior; "minimal does not necessarily mean short"
  (`anthropic-engineering/effective-context-engineering-for-ai-agents.md`).

**R18. Review and prune the rules on a schedule, and test a change by watching
whether behavior changes.**

- "Treat CLAUDE.md like code: review it when things go wrong, prune it
  regularly, and test changes by observing whether Claude's behavior actually
  shifts" (`claude-code/best-practices.md` "Write an effective CLAUDE.md").
- "Revisit after major model releases: instructions that worked around an
  older model's limitation may become overhead"
  (`claude-code/large-codebases.md`).
- `/doctor prompt-audit` reads CLAUDE.md, AGENTS.md, rules, skills, and output
  styles, and reports "instructions written for older models, references to
  files or commands that don't exist, and files that contradict each other".
  It needs Claude Code 2.1.283 or later; this Mac has 2.1.280
  (`claude-code/memory.md` "Write effective instructions", captured
  2026-09-29).

### E. Wording

**R19. Write instructions specific enough to check.** "'Run `npm test` before
committing' instead of 'Test your changes'" (`claude-code/memory.md` "Write
effective instructions", Specificity). "Adherence drops when an instruction
is vague enough to interpret multiple ways" (`claude-code/debug-your-config.md`).

**R20. Write in the imperative, and name the exact command, file, path, or
skill.** Skill bodies: "State what to do rather than narrating how or why, and
apply the same conciseness test you would for CLAUDE.md content"
(`claude-code/skills.md` "Types of skill content"). The examples in
`claude-code/memory.md` name the command and the folder.

**R21. Add a one-line reason where it helps the agent handle a case the rule
does not list. Do not tell a story.** "Explaining *why* can be more effective
than rigid directives: an agent that understands the purpose behind an
instruction makes better context-dependent decisions"
(`anthropic-agent-skills/agentskills-best-practices.md`). The right level is
"specific enough to guide behavior effectively, yet flexible enough to provide
the model with strong heuristics"
(`anthropic-engineering/effective-context-engineering-for-ai-agents.md`).
`/doctor` keeps "rationale" (R7). Balance this with R20: a reason is one short
clause, not a paragraph.

**R22. Use emphasis words ("IMPORTANT", capitals, bold) only on the one line
the agent keeps skipping.** "If you emphasize many lines, none of them stands
out" (`claude-code/best-practices.md` "Write an effective CLAUDE.md"). "Never"
and "always" state what the instruction is; they are not emphasis.

**R23. No two instructions may contradict each other: not across rules,
`AGENTS.md`, user rules in `~/.claude/rules/`, skills, or the instructions
Claude Code adds itself.** "If two rules contradict each other, Claude may
pick one arbitrarily" (`claude-code/memory.md` "Write effective
instructions", Consistency). If the project sets its own commit or pull
request rules, Claude Code's built-in ones can be turned off with
`includeGitInstructions` (`claude-code/memory.md` "Claude isn't following my
CLAUDE.md", captured 2026-09-29; `claude-code/settings-reference.md`
`includeGitInstructions`).

**R24. State each instruction in one place.** Inference from R17 and R23: a
second copy in another always-on file costs context on every request, and
when one copy is changed and the other is not, the two contradict.
`claude-code/features-overview.md` "Understand context costs": too many
features "can also add noise that makes Claude less effective".

### F. How Codex sees rules

**R25. Codex never reads `.claude/rules/`.** It reads `~/.codex/AGENTS.md` and
then each `AGENTS.md` from the project root down to the current folder, once
per session, at most 32 KiB in total, with no `@path` imports
(`codex/agents-md.md` "How Codex discovers guidance";
`dev/research/platform-best-practices.md` 3.1 and Part 4, "Scoped rules").

**R26. A rule reaches Codex only when `AGENTS.md` or a hook's output tells
Codex to read it.** Toolkit V2 does both: the generated rules list in
`AGENTS.md` ("Codex: read each one at session start"; path-scoped: "open the
rule before working on a matching path"), and the Codex session briefing,
which lists the always-on rules on `startup`, `resume`, `clear`, and
`compact` (`plugins/toolkit/hooks/codex-hooks.json`;
`plugins/toolkit/lib/project/brief.mjs` `codexSections`). Inference: in Codex
a path-scoped rule loads only if the agent chooses to open it, so any
safety instruction in a path-scoped rule also needs a hook that runs in
Codex. A rule file Codex reads with a tool is part of the conversation and is
summarized at compaction; the briefing on `compact` lists the rules again.

**R27. Keep what Codex reads small and practical.** "Keep it small"; add a
rule after "Repeated mistakes"; add "routing guidance" when the agent reads
too much (`codex/customization-overview.md` "AGENTS Guidance"). "A short,
accurate `AGENTS.md` is more useful than a long file full of vague rules"
(`codex/best-practices.md` "Make guidance reusable with `AGENTS.md`").

### G. How to check what loaded

**R28. Check loading with the tools the hosts provide, not by reading the
files.**

- Claude Code: `/context` lists the instruction files and rules that loaded;
  `/memory` lists the files; the `InstructionsLoaded` hook logs each load and
  its reason; `claude --debug` shows a frontmatter parse error; `/status`
  shows the size warnings (`claude-code/memory.md` "Claude isn't following my
  CLAUDE.md"; `claude-code/debug-your-config.md`; `claude-code/hooks.md`
  "InstructionsLoaded").
- Codex: `codex --ask-for-approval never "Summarize the current instructions."`
  (`codex/agents-md.md` "Verify your setup"). This shows only `AGENTS.md`
  files, not rules.

---

## Part 2. Audit

### 2.1 Method and marks

- Source: the 18 files in
  `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved/.claude/rules/`
  at commit `5293d7c` on branch `toolkit-v2/approved-changes`.
  `node dev/tools/import-model.mjs --check` passed, and the scaffold copy's
  rules are identical to the branch.
- Load mode comes from each file's frontmatter. "Installed" comes from
  `plugins/toolkit/scaffold/CONDITIONS.json`.
- In Part 2, `AGENTS.md` means the model's `AGENTS.md` at the same commit, and
  its line numbers are that file's (before `toolkit init` removes the setup
  blocks a project did not choose).
- Size: lines and bytes of the file; tokens are bytes divided by 4, rounded.
- Findings name the checklist item they fail, for example (R12).
- Marks on each proposed change:
  - **Wording**: the same instruction, written more clearly. No new meaning.
  - **Placement**: the instruction moves to a skill, `AGENTS.md`, or a hook,
    and the audit checked that the destination already holds the same text.
  - **Needs Mike's yes**: the change alters meaning, drops an instruction,
    adds, merges, or removes a rule file, or rewrites words Mike approved
    himself.
- Every model change, including wording, goes on the model branch and then
  through `node dev/tools/import-model.mjs`. Renaming, merging, or removing a
  rule file also needs `CONDITIONS.json` updated: its `only` list names nine
  Salesforce rule files and `work-item-folders.md`, and its `lineRemove` entry
  names two lines of `publish-project-documents.md`. The import stops when a
  condition no longer matches.

### 2.2 Summary table

SF = installed only in Salesforce projects. Local = installed only with the
local tracker.

| Rule | Installed | Load mode | Lines | Bytes | Tokens | Main findings | Proposed action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `ai-external-knowledge.md` | all | `paths`: 1 glob | 31 | 1,273 | 320 | narrative paragraphs; no word on the generated `INDEX.md` | bullets; add the index command (yes) |
| `check-deployment-contents.md` | SF | always on | 7 | 604 | 150 | good; "shared or higher org" undefined | define the term (wording) |
| `component-tracker.md` | SF | always on | 5 | 505 | 130 | good; overlaps `record-deployment-steps.md` | take in that rule's one instruction (yes) |
| `confirm-salesforce-changes.md` | SF | always on | 10 | 703 | 180 | good; "where the project keeps decisions" is vague | name `DECISIONS.md` (yes) |
| `dependency-graph.md` | SF | `paths`: 2 globs | 18 | 1,485 | 370 | impact questions come before a file is read; `python` vs `python3`; unclear script list | move two lines to always-on text (yes); wording |
| `humanize-outbound-text.md` | all | always on | 13 | 681 | 170 | paragraphs; names a `humanizer` skill V2 does not ship | bullets; name `unslop` first (yes) |
| `keep-work-item-current.md` | all | always on | 13 | 1,175 | 290 | five of eight lines repeat `AGENTS.md` | keep the three lines only it has |
| `memory-review-and-save.md` | all | always on | 21 | 3,547 | 890 | paragraph lines up to 863 characters; most text is the `memory-save` skill's procedure | cut to about 10 bullets; rest stays in the skill |
| `permissions-source-control.md` | SF | `paths`: 3 globs | 28 | 1,963 | 490 | good paths; 17 flat bullets; one step the agent cannot do | group by step; wording |
| `plain-english-artifacts.md` | all | always on | 81 | 3,686 | 920 | largest always-on rule; half repeats `AGENTS.md` and the style; one wrong reason | cut narrative to about 50 lines |
| `production-data-changes.md` | SF | always on | 13 | 1,464 | 370 | repeats `salesforce-org-safety.md` and the `sf-data-change` skill | cut to about 5 bullets |
| `project-file-locations.md` | SF | always on | 8 | 635 | 160 | second topic repeats `AGENTS.md` | keep the `delivery/` or `engagement/` lines |
| `publish-project-documents.md` | all | `paths`: 9 globs (7 without SF) | 23 | 1,205 | 300 | one line applies to files outside its globs; repeats git rule and skill | cut to about 7 bullets |
| `record-deployment-steps.md` | SF | `paths`: 2 globs | 10 | 523 | 130 | the trigger is a metadata change, not reading these folders | merge into `component-tracker.md` (yes) |
| `salesforce-org-safety.md` | SF | always on | 28 | 3,743 | 940 | good Allowed and Never lists; one 1,215-character paragraph about hook internals | shorten the Enforcement part (yes) |
| `session-handoff.md` | all | always on | 3 | 528 | 130 | Mike-approved, tested wording; one paragraph; repeats the skill's memory step | leave, or bullets only (yes) |
| `shared-repository-work.md` | all | always on | 22 | 1,444 | 360 | good; merge wording differs from `AGENTS.md` | name `DECISIONS.md`; three headings |
| `work-item-folders.md` | local | always on | 42 | 2,231 | 560 | repeats `AGENTS.md`; some lines are hook-enforced or `work-organize` detail | cut to about 15 bullets |

What every rule already does well:

- One file per topic with a descriptive name (R8, R9); every file starts with
  a `# ` heading (R10).
- No "IMPORTANT", no capitals, no bold anywhere (R22).
- Every `paths` value is a quoted YAML list item with no `[` and no braces
  (R13).
- The safety rules are also enforced: `guard-protected-orgs.cjs` and
  `guard-permission-set-deploy.cjs` run in both hosts, `.claude/settings.json`
  denies `git add -A`, `git commit -a`, `--no-verify`, and force pushes, and
  the toolkit's pre-tool hook refuses the same git commands and hand edits of
  generated files (R3).

### 2.3 Always-on size per project

Observed: `toolkit init` run in two scratch Git repositories on 2026-09-29,
then the files measured.

| Project | Always-on rules | Their bytes | Tokens | `AGENTS.md` bytes | Always-on total tokens |
| --- | --- | --- | --- | --- | --- |
| Local tracker, built-in memory, no Salesforce | 8 (with an `owner-preferences.md` of three instructions) | 13,819 | 3,450 | 10,494 | 6,080 |
| Local tracker, built-in memory, Salesforce | 13 | 20,946 | 5,240 | 12,851 | 8,450 |

- On Mike's Mac, Claude Code adds `~/.claude/CLAUDE.md` and five user rules:
  15,106 bytes, about 3,800 tokens, in every project.
- No single file is near 200 lines. The largest always-on rules are
  `salesforce-org-safety.md` (3,743 bytes), `plain-english-artifacts.md`
  (3,686), and `memory-review-and-save.md` (3,547).
- Estimate: the rewrites proposed below bring the always-on rules to about
  7,500 bytes in the first project (43 percent less) and about 12,900 bytes in
  the second (38 percent less), about 2,000 tokens fewer on every request in a
  Salesforce project.
- Codex: `AGENTS.md` is 12,851 bytes at most, well under the 32 KiB limit
  (R25). Codex reads the 13 always-on rules with tool calls at session start.

### 2.4 Each rule

#### `ai-external-knowledge.md`

- **Load mode:** path-scoped, `'ai-external-knowledge/**'`. Installed in every
  project. 31 lines, 1,273 bytes, about 320 tokens.
- **Findings:**
  - Lines 8 to 13 are two paragraphs of motivation, not instructions (R11,
    R21). Line 13 ("This information is used to help ground the agent ...")
    is Mike's own sentence from the model's first commit (`e7c3b37`).
  - "The root `INDEX.md` points to the topic folders" does not say that
    `INDEX.md` is generated. In a V2 project, `toolkit index knowledge` builds
    it from each topic's `SOURCE-RECORD.md`, and the toolkit's pre-tool hook
    refuses a hand edit (`plugins/toolkit/lib/hooks/paths.mjs` `GENERATED`).
    An agent that follows this rule and edits the index is blocked (R19, R20,
    R23).
  - The glob fits: the rule is about handling files in that folder (R12).
    Where new outside documentation goes is already an always-on row in
    `AGENTS.md` "Where information goes".
- **Move out:** nothing.
- **Rewrite outline:**
  - Same frontmatter. Heading: `# Captured Outside Documentation`.
  - "Where it goes": one folder per topic under `ai-external-knowledge/`;
    each topic folder has a `SOURCE-RECORD.md` (publisher, web address,
    capture date, coverage); run `toolkit index knowledge` after adding or
    changing one; never edit `INDEX.md` by hand.
  - "It is source material": the three existing bullets, unchanged.
  - One reason line in place of the two paragraphs.
- **Needs Mike's yes:** adding the `SOURCE-RECORD.md` and `toolkit index
  knowledge` lines (new instructions, though the hook already requires them);
  replacing his line 13 with a shorter reason line.

#### `check-deployment-contents.md`

- **Load mode:** always on. Salesforce only. 7 lines, 604 bytes, about 150
  tokens.
- **Findings:**
  - Meets the checklist: one topic, a one-line reason first (R21), a named
    skill with its path, and a clear stop condition (R19, R20).
  - "a shared or higher org" is not defined here (R19). The `sf-deploy-check`
    skill's description defines it: "a shared org (UAT, full copy, staging, or
    production)".
- **Move out:** nothing. Its trigger is a deploy command, which a path cannot
  catch (R12).
- **Rewrite outline:** replace "a shared or higher org" with "a shared org
  (UAT, full copy, staging, or production)". **Wording.**
- **Needs Mike's yes:** none.

#### `component-tracker.md`

- **Load mode:** always on. Salesforce only. 5 lines, 505 bytes, about 130
  tokens.
- **Findings:**
  - Specific and short (R19, R20). The first trigger is a file change under
    `force-app/`, but the second ("When the owner reports a deploy that
    landed") comes from the conversation, so always on is right (R12).
  - The heading `# Component Tracker` names a thing, not what to do (R10).
  - `record-deployment-steps.md` also sends the agent to the same skill for
    the same edits (R24).
- **Move out:** nothing.
- **Rewrite outline:**
  - Heading: `# Update the Component Tracker with Every Metadata Change`.
    **Wording.**
  - Add one bullet from `record-deployment-steps.md`: "When metadata needs an
    action the deploy cannot perform, add a step to the work item's
    `manual-steps.md` in the same response; when unsure, add it."
- **Needs Mike's yes:** the merge (it removes `record-deployment-steps.md`
  and changes `CONDITIONS.json`).

#### `confirm-salesforce-changes.md`

- **Load mode:** always on. Salesforce only. 10 lines, 703 bytes, about 180
  tokens.
- **Findings:**
  - A clear list of what needs the owner, then what to say and "wait for the
    owner" (R19). Good structure (R11).
  - "Record the decision where the project keeps decisions" does not name the
    file (R20). `AGENTS.md` routes "A decision for the whole project" to
    `DECISIONS.md` through `work-decide`.
- **Move out:** nothing.
- **Rewrite outline:** "Record the decision in `DECISIONS.md` (`work-decide`)."
- **Needs Mike's yes:** naming `DECISIONS.md` narrows the meaning if some
  data-source decisions are meant to stay in the work item.

#### `dependency-graph.md`

- **Load mode:** path-scoped, `"force-app/**"`, `"tools/kb/**"`. Salesforce
  only. 18 lines, 1,485 bytes, about 370 tokens.
- **Findings:**
  - Lines 8 and 9 apply when the owner asks "what writes, reads, or breaks if
    this changes". That question often comes before the agent reads any file
    under `force-app/`, so the rule is not loaded yet (R12). `AGENTS.md`
    "Commands" has the command ("Check Salesforce impact"), but not "never
    from memory", "cite it", or "name the gap".
  - After compaction the rule is gone until the next `force-app/` read (R14).
  - Line 8 says `python`; `AGENTS.md` "Commands" says `python3`. On macOS only
    `python3` is sure to exist (R19, R23).
  - Line 13 is unclear: "Only `pull_org_dependencies.py`,
    `build_org_catalog.py`, and `compare_dependencies.py` may run". The
    project's `tools/kb/README.md` says `compare_dependencies.py` "Contacts no
    org", and names four files that do contact an org (R19).
  - Line 14 ("Report both confirmation rates from the cross-check") does not
    say which report or when (R19).
  - Line 12 ("Never commit `tools/kb/out/` ...") is also enforced by the
    Salesforce `.gitignore` lines (R3). Keeping it is harmless.
- **Move out:** lines 8 and 9, as one always-on line in the `AGENTS.md`
  Salesforce block, for example: "Answer 'what writes, reads, or breaks'
  from `tools/kb/query_graph.py`, cite it, and name what it cannot see
  (`tools/kb/README.md`)."
- **Rewrite outline:** headings "Impact questions", "Keeping the notes
  current", "Org access", "Never"; `python3` everywhere; line 13 rewritten
  from the README's list; line 14 names the comparison report from
  `compare_dependencies.py`.
- **Needs Mike's yes:** moving lines 8 and 9 into `AGENTS.md`. The `python3`
  and line 13 and 14 fixes are **wording**, but line 13 should be checked with
  Mike because the audit cannot tell what "may run" was meant to allow.

#### `humanize-outbound-text.md`

- **Load mode:** always on. Every project. 13 lines, 681 bytes, about 170
  tokens.
- **Findings:**
  - Three paragraphs; the list of covered texts and the list of exclusions
    read better as bullets (R11). The exclusions are a good scope statement.
  - It names the `humanizer` skill first. Toolkit V2 does not ship it, and it
    is not installed on this Mac (Observed: not in `~/.claude/skills/` or any
    V2 plugin). V2 ships `unslop` (`session-skills`), whose description names
    this rule. So the agent first looks for a skill that is not there (R20).
  - The trigger is a task, not a path, so always on is right (R12).
- **Move out:** nothing.
- **Rewrite outline:** heading unchanged; bullets: "Before the owner sees the
  final version of text for another person, run it through the `unslop`
  skill"; "Covers: ..."; "Keep every fact, name, ID, number, and date"; "Write
  in the owner's voice, first person, when it goes out under his name"; "Does
  not cover: ...".
- **Needs Mike's yes:** dropping `humanizer`, or keeping it as "`humanizer`
  when installed, otherwise `unslop`".

#### `keep-work-item-current.md`

- **Load mode:** always on. Every project. 13 lines, 1,175 bytes, about 290
  tokens.
- **Findings (R24):** five of its eight instruction lines repeat `AGENTS.md`,
  which both hosts always read:
  - Line 5 (use `work-on` before substantial work) repeats `AGENTS.md` line 17.
  - Line 7 (Open Questions, "Decision needed from: owner", `waiting_on`)
    repeats `AGENTS.md` line 39 almost word for word.
  - Line 8 (approved requirements before `build` and `data-load`) repeats
    `AGENTS.md` line 34.
  - Line 10 (Done only after the owner approves) repeats `AGENTS.md` line 35.
  - Line 13 (where stages, routing, and handoffs live) repeats `AGENTS.md`
    "Work tracking" and "Where information goes".
- Line 9 (ask how the team is arranged after the owner accepts agent-led
  delivery) is step 3 of the `work-delegate` skill (R2).
- Lines only this rule has: line 6 (save the owner's decisions and
  corrections in the item before moving on), line 11 (record the exact next
  step before ending unfinished work), and "A later stage does not revoke that
  approval" from line 8.
- **Move out:** line 9 is already in `work-delegate` (**placement**).
- **Rewrite outline:** heading unchanged; lead "The work tracker is the source
  of truth for current work."; three bullets: the two unique lines and "A
  later stage does not revoke requirements approval"; one pointer: "Owner
  approvals: `AGENTS.md` 'What the owner decides'." About 550 bytes.
- **Needs Mike's yes:** none for dropping the lines `AGENTS.md` holds
  (**placement**). `dev/PROGRESS.md` lists this rule's wording as waiting on
  Mike's yes from an earlier round, so show him the new text with that item.

#### `memory-review-and-save.md`

- **Load mode:** always on. Every project. 21 lines, 3,547 bytes, about 890
  tokens. Lines 3, 7, 9, 13, and 19 are whole paragraphs; line 7 is 863
  characters.
- **Findings:**
  - Dense paragraphs (R11) in the third-largest always-on rule (R17).
  - Line 7 is a prose copy of the `AGENTS.md` "Where information goes" table
    (R24).
  - Lines 13, 15, 19, and 21 are the `memory-save` skill's procedure: the
    approval policy (the rule itself says "The `memory-save` skill holds the
    approval policy"), withdrawing a rejected item, the `toolkit memory`
    commands, and reading back (R2, R24). `AGENTS.md` "Memory" already says to
    use only the three memory skills.
  - Line 3: "Claude's native auto-memory and the `claude-toolkit` Second Brain
    plugin are disabled". Both are switched off in `.claude/settings.json`
    (`autoMemoryEnabled: false`, `second-brain@claude-toolkit: false`) (R3).
    One short line stops the agent from looking for them; keep it short.
  - Line 9's list of moments to review memory is the part that must be always
    on: it tells the agent when to think about a save (R1).
- **Move out:** to the `memory-save` skill, which already holds each item
  (**placement**; checked in `plugins/memory/skills/memory-save/SKILL.md`
  "Steps" step 1, "Approval policy", "Rules", and "Where other things go"): the destination list, the approval modes,
  the proposal handling, the commands, locking, and read-back.
- **Rewrite outline** (about 10 bullets, about 1,000 bytes):
  - Heading: `# Review and Save Project Memory` (unchanged).
  - This rule is for the main agent. The one memory store is the system named
    in `.toolkit.json`; Claude Code's auto memory is off.
  - Review memory after: an explicit remember or forget request, a
    correction, a standing preference, a decision or discovery, a significant
    fix, a change of people, tools, or references, a focus shift, a finished
    work item, and a handoff.
  - Every save, correction, and retirement goes through `memory-save`; never
    edit memory files by hand.
  - An owner instruction for how the agent works goes to the rules through
    `memory-save` (`toolkit rule add`), never to memory.
  - A hook reminder is not a save decision; a review can end with nothing
    saved.
  - A yes approves only the operation and meaning shown; silence approves
    nothing.
  - Say briefly what was kept or what needs the owner's decision.
- **Needs Mike's yes:** only if an item the audit moved is not in the skill
  when the rewrite is made. Check each line against the skill at that time.

#### `permissions-source-control.md`

- **Load mode:** path-scoped, three globs under `force-app/` for permission
  sets, permission set groups, and profiles. Salesforce only. 28 lines, 1,963
  bytes, about 490 tokens.
- **Findings:**
  - The globs fit: the agent reads a permission set file before editing it
    (R12, R13). The deploy-time lines (14 to 17) can be needed without such a
    read, but `guard-permission-set-deploy.cjs` enforces the preflight in both
    hosts (R3, R26).
  - 17 flat bullets in no order (R11). They are a sequence: fetch, edit,
    preflight, deploy, check.
  - Line 22 tells the agent to "click Recalculate on the group in Setup". The
    agent cannot click in Setup; the owner does (R19).
  - Line 21 names `RETRIEVE_BLIND_SPOTS` without saying it is a list in
    `tools/permissions/permsets.py` (R20).
  - Line 17 (sandbox only, owner's yes) and line 25 (never deploy a profile)
    repeat `salesforce-org-safety.md`; line 26 (never edit the guard) repeats
    its "Never edit a guard" line (R24). Inside a path-scoped rule the extra
    cost is small.
- **Move out:** nothing now. A skill for the permission set sequence would be
  a new skill (R2); the runbook `tools/permissions/PERMISSIONS-RUNBOOK.md`
  already holds the detail.
- **Rewrite outline:** keep the two-line lead; headings "Before an edit",
  "Before a deploy", "After a deploy", "Never"; line 21 names
  `RETRIEVE_BLIND_SPOTS` in `tools/permissions/permsets.py`; line 22 says
  "ask the owner to click Recalculate on the group in Setup".
- **Needs Mike's yes:** line 22 (it changes who acts). The grouping and line 21
  are **wording**.

#### `plain-english-artifacts.md`

- **Load mode:** always on. Every project. 81 lines, 3,686 bytes, about 920
  tokens: the largest always-on rule in a project without Salesforce.
- **Findings:**
  - The trigger is a task (making a diagram, page, or document), which a path
    cannot catch, so always on or a skill (R12). Always on is the better
    choice: Claude Code subagents load project rules but not the output style
    (R16), and Codex sees it through the rules list (R26). A skill would reach
    a helper only if the helper opened it.
  - About half repeats `AGENTS.md` "How to write replies" (ordinary words, the
    exact name, no metaphors, a heading names what is under it) and the Plain
    English output style (R24). The rule settles conflicts itself ("Where this
    rule and that file differ, the style file wins"), which meets R23.
  - The stated reason is partly wrong: "a helper agent, a skill, or a Codex
    session that makes an artifact never sees it". A skill runs in the main
    conversation, which has the output style, unless it runs in a subagent
    (R16, R21).
  - Narrative sentences ("The reader opened it to learn about that thing",
    the "What this rule does not decide" section) explain rather than instruct
    (R20). The example table is concrete and useful (R19); Mike approved it
    (approved change 20).
- **Move out:** nothing.
- **Rewrite outline** (about 50 lines, about 2,300 bytes):
  - Two-line lead: what counts as an artifact; "Claude Code subagents and
    Codex do not get the output style, so this rule states it for artifacts;
    where the two differ, the style file wins."
  - "Write about the subject": the three bullets, unchanged.
  - "A heading names what is under it": one line, the table unchanged, the
    number sentence.
  - "Use the real name": the paragraph as two bullets.
  - "Say the plain thing": the five bullets, unchanged.
  - One last line: "Layout (boxes, arrows, keys) is the agent's choice; this
    rule covers the words."
- **Needs Mike's yes:** none for cutting narrative that restates the bullets
  (**wording**). Correcting the reason line is **wording** (it is not an
  instruction). Keep his approved example unchanged.

#### `production-data-changes.md`

- **Load mode:** always on. Salesforce only. 13 lines, 1,464 bytes, about 370
  tokens.
- **Findings:**
  - Lines 3 to 5 (no production data writes, sandbox writes need the owner's
    yes in the same chat, reads allowed) repeat the Allowed and Never lists
    of `salesforce-org-safety.md` (R24).
  - Lines 10 to 13 (backup and load folders, what to record) are the
    `sf-data-change` skill's procedure; line 13 says so itself ("Follow the
    `sf-data-change` skill for the folder layout and handoff fields") (R2).
    The skill holds the folders, including `prod-backup-<MMDDYYYY>-<slug>/`
    (Observed, `.claude/skills/sf-data-change/SKILL.md`).
  - Line 12 (never commit load or backup files) is also enforced by each
    data folder's `.gitignore` (R3); it has a good reason clause (R21).
  - Line 6 is the part only this rule has: open `sf-data-change` before
    replying about a production data change, and a general suggestion is not
    a complete handoff.
- **Move out:** lines 10, 11, and 13 to the `sf-data-change` skill, which
  already holds them (**placement**).
- **Rewrite outline** (about 5 bullets, about 550 bytes): production data
  changes are the owner's (see `salesforce-org-safety.md`); for one, open
  `sf-data-change` before replying and hand over the exact load file, backup
  file, steps, success check, and undo steps; a general suggestion is not a
  complete handoff; never commit load or backup files (they may hold record
  IDs and personal information).
- **Needs Mike's yes:** none if the skill holds each moved line when the
  rewrite is made.

#### `project-file-locations.md`

- **Load mode:** always on. Salesforce only. 8 lines, 635 bytes, about 160
  tokens.
- **Findings:**
  - It says "This rule owns one thing", then line 8 covers a second topic:
    memory, requirements, and the tracker (R8). That line repeats `AGENTS.md`
    "Where information goes" (R24), except "Never create
    `delivery/knowledge-base/`".
  - The heading "Where Project Files Go" is wider than the content (R10).
  - Lines 5 to 7 are the part only this rule has, and line 7 changes how the
    agent reads every other Salesforce rule, so always on is right (R12).
- **Move out:** the memory, requirements, and tracker part of line 8 is
  already in `AGENTS.md` (**placement**).
- **Rewrite outline:** heading `# Client-Work Folder: delivery/ or
  engagement/`; bullets: new projects use `delivery/`; a project that
  already uses `engagement/` keeps it (do not rename, move, or create a
  parallel `delivery/`); where a rule or skill names a `delivery/` path, use
  `engagement/` there; never create `delivery/knowledge-base/`.
- **Needs Mike's yes:** none. Folding these lines into the `AGENTS.md`
  Salesforce block and removing the file would need his yes; the audit does
  not recommend it, because line 7 is a rule about other rules.

#### `publish-project-documents.md`

- **Load mode:** path-scoped, 9 globs (7 in a project without Salesforce;
  `CONDITIONS.json` `lineRemove` takes out two). Every project. 23 lines,
  1,205 bytes, about 300 tokens.
- **Findings:**
  - The globs are valid and fit: an edit of these documents follows a read
    (R12, R13). A brand-new document is covered by the always-on `AGENTS.md`
    line that names this rule ("Authorized edits to committed project
    documents are saved with ...").
  - Line 16 ("Rules, skills, hooks, prompts, settings, and code use a
    worktree and a pull request") is about files outside these globs, so it
    never loads when it is needed (R12). `shared-repository-work.md` line 13
    already says it (R24).
  - Line 18 (stage by name, read the staged diff) repeats
    `shared-repository-work.md` line 17 and the `publish-docs` skill, step 3
    (R24).
  - Line 15 "In a copied Git repository" is unclear (R19). The audit cannot
    tell whether it means a cloned repository, a repository with a remote, or
    any project repository.
  - A blank line between lines 21 and 23 splits the list in two (R11).
  - Line 23 (`.memory/` and `.work-items/` do not use this route) loads only
    when a document in the globs is read; it is harmless.
- **Move out:** lines 16 and 18 are already in `shared-repository-work.md`
  (**placement**).
- **Rewrite outline** (about 7 bullets): save each authorized
  documentation-only edit with the `publish-docs` skill (its own temporary
  worktree, a commit straight to the default branch, no pull request); saving
  a document does not approve its requirements or its build; never force-push
  or change another session's checkout; an unpushed commit is unfinished
  (with no remote, the save is done when the commit is on the local default
  branch); `.memory/` and `.work-items/` are local and do not use this route.
  Keep the two Salesforce glob lines exactly as they are, because
  `lineRemove` matches them by text.
- **Needs Mike's yes:** the meaning of "In a copied Git repository".

#### `record-deployment-steps.md`

- **Load mode:** path-scoped, `"delivery/deployment/**"`,
  `"engagement/deployment/**"`. Salesforce only. 10 lines, 523 bytes, about 130
  tokens.
- **Findings:**
  - The trigger is a metadata change that needs a manual deploy step, which
    happens while the agent edits `force-app/`, not while it reads the
    deployment folders (R12). In practice `component-tracker.md` makes the
    agent edit `delivery/deployment/component-tracker.csv` in the same
    response, which loads this rule, so the gap is small.
  - Both rules send the agent to the `sf-component-tracker` skill (R24).
  - "When unsure, add the step" is a good default (R21).
- **Move out:** its one instruction into `component-tracker.md` (see that
  section).
- **Rewrite outline:** none if merged. If kept: unchanged.
- **Needs Mike's yes:** the merge and removal (and the two `CONDITIONS.json`
  entries that name this file).

#### `salesforce-org-safety.md`

- **Load mode:** always on. Salesforce only. 28 lines, 3,743 bytes, about 940
  tokens: the largest always-on rule.
- **Findings:**
  - The Allowed and Never lists are specific, with exact commands (R19, R20),
    and the file has clear headings (R11). Always on is right: the trigger is
    any `sf` command (R12). Both guard hooks and the settings ask and deny
    lists enforce it (R3). "Applies to every agent and subagent" matches R16.
  - The Enforcement section is one 1,215-character line that describes the
    guard's parsing: `bash -c`, `$(...)`, here-documents, `--help`, pipeline
    stages (R11, R17). The agent needs four facts from it: which commands the
    guard checks; that a production or unclassified org is blocked and a
    sandbox change asks; that in Codex every ask is a block, so the owner runs
    the command; and that a script file run later is not checked, which is
    why the Never list forbids such scripts.
  - Its Never lines repeat in `production-data-changes.md`,
    `permissions-source-control.md`, and the `AGENTS.md` Salesforce block
    (R24). This rule should be the one full statement; the others can point
    to it.
  - Line 12 (Codex: the owner runs every sandbox deploy and data change) and
    line 21 (never write or run a deploying script) are Mike's decisions (3)
    and (7) of 2026-09-28; the pipeline-deploy part is decision (8).
- **Move out:** the guard's parsing details to the guard's own header comment
  in `.claude/hooks/guard-protected-orgs.cjs` or to a reference file of the
  `sf-deploy-check` skill.
- **Rewrite outline:** "Allowed" and "Never" unchanged. "Enforcement" as four
  bullets: what the guard checks and does not check (`apex test run`, reads);
  production or unclassified org: blocked (`"action": "deny"` in
  `.claude/protected-orgs.json`); a pipeline deploy counts as unclassified;
  sandbox: asks, except `deploy validate`; in Codex every ask is a block; a
  script file run by a later command is not checked; follow this list whether
  or not a hook fires. About 2,400 bytes.
- **Needs Mike's yes:** shortening the Enforcement section, because it holds
  wording added in commits `7faee75` and `5e7d7a0` for his decisions (7) and
  (8). Keep lines 12 and 21 word for word.

#### `session-handoff.md`

- **Load mode:** always on. Every project. 3 lines (one paragraph), 528
  bytes, about 130 tokens.
- **Findings:**
  - Mike approved this exact wording on 2026-09-27, after a test: with it, 3
    of 3 Claude Code runs opened `handoff`; with the old wording, 1 of 3
    (`dev/model-changes.md` "Handoff rule wording").
  - One paragraph with four instructions (R11). "Use the `handoff` skill"
    appears twice.
  - "Before the handoff, review the current focus ... with the `memory-save`
    skill. Then write the prompt." is step 3 of the `handoff` skill
    (`references/save-memory-and-focus.md`) (R2, R24).
- **Move out:** nothing is needed; the skill already holds the memory step.
- **Rewrite outline** (only if Mike agrees): three bullets: the first
  sentence word for word; "When the session is long and the next step is
  complex, offer a handoff; skip the offer for small edits and quick
  lookups"; "The `handoff` skill reviews the current focus and memory before
  it writes the prompt."
- **Needs Mike's yes:** any change. Recommendation: leave it as it is, or make
  only the bullet change and run the handoff routing test again.

#### `shared-repository-work.md`

- **Load mode:** always on. Every project. 22 lines, 1,444 bytes, about 360
  tokens.
- **Findings:**
  - Meets the checklist: exact commands, one topic, bullets (R11, R19, R20).
    Several lines are also enforced by the settings deny list and the
    pre-tool hook (R3); the text tells the agent why a command is refused.
  - Line 20 ("A standing merge instruction the owner gave for this project
    counts") does not say where it is recorded. `AGENTS.md` line 36 says
    "unless `DECISIONS.md` records a standing merge instruction" (R23).
  - On Mike's Mac, `~/.claude/rules/parallel-agent-sessions.md` (6,467 bytes)
    says the same things at greater length and loads in every Claude Code
    project, so V2 projects carry the topic twice (R6, R24). That file is
    Mike's, outside the model; the project rule is still needed for Codex and
    for other machines.
  - Line 11 (no remote: skip `git fetch`) is Mike's decision (2) of
    2026-09-28.
- **Move out:** nothing.
- **Rewrite outline:** three headings: "Before your first edit" (the commands
  and the no-remote line), "Where to work" (worktree lines, the
  documentation exception, the shared-checkout prohibitions), "Committing and
  merging" (staging, generated files, sequential numbers, pull requests,
  merge check, cleanup). Line 20: "... a standing merge instruction recorded
  in `DECISIONS.md` counts."
- **Needs Mike's yes:** none (**wording**; the `DECISIONS.md` text matches
  what `AGENTS.md` already says).

#### `work-item-folders.md`

- **Load mode:** always on. Local tracker only. 42 lines, 2,231 bytes, about
  560 tokens.
- **Findings:**
  - Always on is right. `.work-items/` sits in the main checkout and is shared
    by every worktree, so from a worktree session its files are outside the
    project folder, and a `paths` glob would not match them (Inference: the
    docs describe matching only for paths inside the project, R12, R13).
    Most work also goes through `toolkit work` commands, not file reads.
  - Lines 3 to 5 and the ID lines repeat `AGENTS.md` "Work tracking" (local
    block, lines 81 and 82): Git-ignored, main checkout, shared by worktrees,
    refer by ID, the owner may move folders, change fields with `toolkit work`
    (R24).
  - Lines 36 to 40 are enforced by the toolkit's hooks: the pre-tool hook
    refuses hand edits of `DASHBOARD.md` and `.toolkit-state.json` and
    frontmatter changes by file edit, and the session hooks run `toolkit work
    sync` (R3). One line saying so is enough.
  - Lines 24 to 28 (sub-items by location, groups, the reserved `archive/`)
    are detail for moves, which the `work-organize` skill holds in
    `references/tracker-local.md` (R2).
- **Move out:** the move and grouping detail to `work-organize`, which
  already holds it (**placement**).
- **Rewrite outline** (about 15 bullets, about 1,100 bytes): find items by ID
  (`toolkit work show <id> --path`), never guess a path; create items only
  with `toolkit work new`; the owner may move, rename, nest, or group item
  folders: `toolkit work sync` finds them, report what moved and continue,
  use `work-organize` for anything it reports missing or duplicated; never
  move, group, archive, or rename items on your own; change frontmatter only
  with `toolkit work` commands, edit body sections directly or with `toolkit
  work edit`; never hand-edit `DASHBOARD.md` or `.toolkit-state.json`; keep
  any other files the owner put in an item folder; `toolkit export` is the
  backup.
- **Needs Mike's yes:** none if `work-organize` holds each moved line when the
  rewrite is made.

### 2.5 The owner-preferences format

Observed: in a scratch project, three `toolkit rule add` runs (with no host
session variable set, so they were not turned into proposals) wrote this
file, and the first run added it to the `AGENTS.md` rules list:

```markdown
# Owner Preferences

How the owner wants the agent to work in this project. Follow every line, every session. Each line ends with the date and where the instruction came from. Change this file only with `toolkit rule add` or `toolkit rule update`, after the owner says so.

## Replies

- Lead every status reply with the answer. (2026-09-29, Tester in chat)
- Never use tables for fewer than three rows. (2026-09-29, Tester in chat)

## Testing

- Run the unit tests before you say a change works. (2026-09-29, Tester in chat)
```

Code: `plugins/toolkit/lib/commands/rule.mjs` and
`plugins/toolkit/lib/project/owner-rules.mjs`.

- **Load mode:** the project file `.claude/rules/owner-preferences.md` is
  always on (no frontmatter), so it survives compaction (R14, R15). The machine
  file `~/.claude/rules/owner-preferences.md` loads in every Claude Code
  project on the Mac, V2 or not (R6). Codex reads the project file through the
  `AGENTS.md` list and the briefing, and the machine file only through the V2
  briefing (R26).
- **What it does well:** one topic, a descriptive name, a `# ` heading, one
  `##` section per area, one bullet per instruction (R8 to R11); no emphasis
  (R22); a 400-character cap per line; secrets refused; the same instruction
  twice in one section refused; a lock and a read-back on every change; the
  `AGENTS.md` list rebuilt so Codex is told to read it (R26).

Findings, with proposals. These are changes to the `toolkit` command and to
the `memory-save` and `memory-tidy` skills, not to the model. `SKILL.md`
files are outside this workflow's scope.

1. **Conflicts are not checked (R23, R24).** Only the same words in the same
   section are refused. The command does not look at other sections, the
   machine file, the other project rules, Mike's own files in
   `~/.claude/rules/`, or `AGENTS.md`. "Always X" in one section and "Never X"
   in another would both be saved, and the agent may then follow either one.
   Proposal: `rule add` prints the existing lines of the file it writes and
   the section names of the other scope's file; `memory-save` tells the agent
   to use `rule update` when an existing line covers the same thing, and to
   ask the owner when a new line contradicts a rule file or `AGENTS.md`.
2. **No size limit (R17).** The file is always on and grows by one line per
   instruction. Nothing warns when it gets long. Proposal: `toolkit doctor`
   warns above a set size, and `memory-tidy` proposes merging, rewording, or
   moving lines (a line about certain files to a path-scoped rule, a
   procedure to a skill). **Needs Mike's yes** for the number; the audit
   suggests 50 instruction lines or 4 KB.
3. **Any wording is accepted (R19, R20).** "Be careful with tests" would be
   saved as it is. Proposal: `memory-save` writes the line as a checkable
   instruction in the imperative ("Run the unit tests before you say a change
   works"), keeps the owner's meaning, and shows him the exact line (the
   command already prints a reply line with the text).
4. **No instruction for two lines that conflict (R23).** The lead says
   "Follow every line". Proposal: add to the lead "When two lines conflict,
   follow the newer one and ask the owner which to keep." **Needs Mike's yes**
   (new policy). The date on each line makes "newer" checkable (R21). The
   date and source cost about 10 tokens per line; keep them.
5. **Always on only (R12).** An instruction about certain files ("In Apex
   classes, ...") loads every session. Mike's decision names one always-on
   file with a heading per area, so a `--paths` option that writes a separate
   path-scoped rule would change that decision. **Needs Mike's yes.** Low
   priority while the file is short.
6. **Sections are free text (R10, R24).** The `memory-save` skill suggests
   seven areas (Replies, Questions, Testing, Git, Work items, Memory,
   General); the command accepts any heading, so "Replies" and "Reply style"
   can both appear. Proposal: `rule add` prints the existing section names
   and refuses or warns on a new section whose words overlap one.
7. **The `--machine` output overstates Codex (R26).** It says "the Codex
   session briefing names it". That is true only in Toolkit V2 projects;
   Codex in any other folder never reads the machine file. Proposal
   (**wording** in the command output): "Claude Code loads it in every
   project; Codex reads it only in Toolkit V2 projects, through the session
   briefing."
8. **Other open sessions do not see a new line until they restart or compact
   (R15, Inference).** The session that ran the command has the line in its
   conversation. Proposal (**wording** in the command output): add "Other open
   sessions in this project see it after their next start or compaction."
9. **"Change this file only with `toolkit rule add` or `toolkit rule update`"
   is not enforced (R3).** A hand edit with the Edit tool skips the
   passing-remark check that the post-tool hook runs for `toolkit rule`
   commands. Proposal: the post-tool hook gives the same note when Edit or
   Write changes an `owner-preferences.md` in a turn without keep words.
   **Needs Mike's yes** only if he wants hand edits by the agent refused
   rather than noted.
10. **The toolkit's rules list differs from how Claude Code finds rules (R9,
    R13).** `readRules` reads only files directly in `.claude/rules/`, while
    Claude Code also loads subfolders; and `describeRule` treats a `paths`
    value written as a comma-separated string as always on, while Claude Code
    treats it as path-scoped. A hand-written rule in either form would be
    listed wrongly for Codex. Proposal: read subfolders, and accept the string
    form.

### 2.6 Findings that cross several files

- **Codex and compaction (R26).** `AGENTS.md` line 16 tells the agent to read
  `SOUL.md` and `PROJECT.md` again "after resume, clear, or compaction", but
  line 29 tells Codex to read the always-on rules only "at session start".
  The Codex briefing lists the rules again after compaction with the header
  "in Codex, each one is read at session start". Proposal: line 29 and the
  briefing header both say "at session start and after compaction". **Needs
  Mike's yes** for the `AGENTS.md` line; the briefing text is toolkit code.
- **Three groups of repeated instructions (R24).** The rewrites in 2.4 make
  one file the full statement in each group:
  - Org safety: `salesforce-org-safety.md` (full), with pointers from
    `production-data-changes.md`, `permissions-source-control.md`, and the
    `AGENTS.md` Salesforce block.
  - Git: `shared-repository-work.md` (full), with `publish-project-documents.md`
    and the `publish-docs` skill for documentation saves only.
  - Work items: `AGENTS.md` (owner approvals and routing),
    `work-item-folders.md` (local folders), `keep-work-item-current.md` (the
    three lines neither has).
  - Memory: `AGENTS.md` (where information goes), `memory-review-and-save.md`
    (when to review), the `memory-save` skill (how).
- **The model's `ai-external-knowledge/INDEX.md` conflicts with the hook
  (R23).** Its fill-in comment says "Replace the example table row ... Add one
  row per real topic", a hand edit. In a V2 project the pre-tool hook refuses
  hand edits of that file, and `toolkit index knowledge` writes the rows. This
  is a model file, not a rule; the fix is a model change. **Needs Mike's yes.**
- **Nested `AGENTS.md` files do not load by themselves in either host.** With
  a root `CLAUDE.md`, Claude Code reads `CLAUDE.md` files only, so
  `requirements/AGENTS.md` and `.memory/AGENTS.md` are not read
  (`claude-code/memory.md` "AGENTS.md"). Codex reads nested files only on the
  path from the project root to the folder it started in
  (`codex/agents-md.md`). The model already covers this with `AGENTS.md`
  line 28 ("Before editing files in a folder that has its own `AGENTS.md`,
  read that file"). No change needed; noted so a later rewrite keeps line 28.
- **Built-in git instructions (R23).** Claude Code adds its own commit and
  pull request instructions and a git status snapshot. The project's git
  rules do not contradict them today, so the audit does not propose turning
  them off with `includeGitInstructions: false`; the snapshot is useful.
  Check again if a rule about commit messages is added.
- **Re-run after upgrading Claude Code (R18).** `/doctor prompt-audit`
  arrives in 2.1.283. After the rewrite, run it on `.claude/rules/` in a
  scratch project and compare its findings with this audit.

### 2.7 Questions for Mike

Each item below changes meaning, removes or merges a file, or rewrites words
he approved. One question each, with the audit's recommendation.

1. Merge `record-deployment-steps.md` into `component-tracker.md`?
   Recommended: yes.
2. Shorten the Enforcement section of `salesforce-org-safety.md` to four
   bullets and move the parsing details to the guard's header comment?
   Recommended: yes; lines 12 and 21 stay word for word.
3. `humanize-outbound-text.md`: name `unslop` only, or "`humanizer` when
   installed, otherwise `unslop`"? Recommended: `unslop` only, since V2 ships
   it.
4. `confirm-salesforce-changes.md`: record data-source decisions in
   `DECISIONS.md`? Recommended: yes.
5. `dependency-graph.md`: move the two impact-question lines into the
   `AGENTS.md` Salesforce block, and confirm what line 13 means by "may run"?
   Recommended: yes to the move.
6. `ai-external-knowledge.md`: add "write the topic's `SOURCE-RECORD.md`,
   then run `toolkit index knowledge`; never edit `INDEX.md` by hand", and
   replace your line 13 with a one-line reason? Recommended: yes to the
   first; your call on line 13.
7. `publish-project-documents.md`: what does "In a copied Git repository"
   mean?
8. `permissions-source-control.md`: "ask the owner to click Recalculate"
   instead of "click Recalculate"? Recommended: yes.
9. `session-handoff.md`: leave as it is? Recommended: yes, leave it.
10. `owner-preferences.md`: add "When two lines conflict, follow the newer one
    and ask the owner which to keep"? Recommended: yes.
11. `owner-preferences.md`: a size warning at 50 instruction lines or 4 KB?
    Recommended: yes.
12. `AGENTS.md` line 29: Codex reads the always-on rules "at session start and
    after compaction"? Recommended: yes.
13. The model's `ai-external-knowledge/INDEX.md` fill-in comment: say that
    `toolkit index knowledge` writes the rows? Recommended: yes.

### 2.8 Checks a rules checker could run

`dev/PROGRESS.md` plans `dev/tools/check-rules.mjs`. From the checklist, each
of these can be checked by a script:

- The frontmatter parses as YAML and holds only `paths`, as a list (R13).
- No glob has an unescaped `[`; brace expansion stays under 1,000 patterns
  (R13).
- Each glob matches at least one file in the model, or is listed as a folder
  a project creates later (R12, R13).
- The file starts with a `# ` heading after any frontmatter (R10).
- An always-on rule stays under a set size, for example 60 lines and 2,500
  bytes; no line is longer than 400 characters; no paragraph runs longer than
  three lines (R11, R17).
- Every skill a rule names exists in a V2 plugin or the model's
  `.claude/skills/` (R20).
- Every file path a rule names exists in the model, or is a path a project
  creates (R20).
- No "IMPORTANT", no word in capitals, and no bold (R22).
- The rules list in the model's `AGENTS.md` matches the files, as
  `toolkit doctor` already checks in projects (R26).

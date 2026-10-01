# Skill writing guide: rules both Claude Code and Codex reward

Written 2026-09-27 for Toolkit V2. It turns the official guidance captured in
`ai-external-knowledge/` into rules for skill names, descriptions, `SKILL.md`
bodies, reference files, hooks, and multi-agent workflows. Every rule names
the captured file it comes from.

Mike's decisions win over this guide. They are in `dev/GOAL.md` and the Rules
section of `AGENTS.md`. Three of them shape everything below:

- A skill's frontmatter holds only `name` and `description`, and the
  description matches `dev/SKILL-INDEX.md` section 1 word for word
  (`AGENTS.md`, Rules, "Skills").
- Skill descriptions must follow the official Claude Code and Codex best
  practices, so the agent knows exactly when to use each skill
  (`dev/GOAL.md`, 2026-09-27).
- Every description says what the skill does, why to use it, and when to use
  it, and every skill folder holds all the references, templates, examples,
  and scripts its steps need (`dev/GOAL.md`, "Skills carry their own
  procedures", 2026-09-29). D4, D6, and Part 5 carry this.

## How to read the citations

- A path such as `ai-external-knowledge/claude-code/skills.md` is a captured
  page in this repository. The text after it in quotes is the section heading.
  Each topic folder's `SOURCE-RECORD.md` gives the page's web address.
- `ai-external-knowledge/codex/source-skills-*.md` files are Codex source code
  at commit `21eb3551` (2026-09-27). They show exact behavior the Codex
  documentation only summarizes. The installed Codex on this Mac is
  `codex-cli 0.157.0`; the source can be newer.
- **Observed** marks something seen on this Mac on 2026-09-27, with where it
  was seen. Observed facts are not in `ai-external-knowledge/`.
- **Project evidence** marks a file in `dev/` that records a test of Toolkit V2
  itself.

---

## Part 1. How each host picks a skill

### 1.1 What both hosts do the same way

1. **Three loading steps.** At the start, the agent sees only each skill's
   name and description. It reads the whole `SKILL.md` only after it decides
   to use the skill. It reads reference files and runs scripts only when the
   `SKILL.md` tells it to.
   (`ai-external-knowledge/anthropic-agent-skills/agentskills-specification.md`
   "Progressive disclosure";
   `ai-external-knowledge/codex/build-skills.md` "Build skills";
   `ai-external-knowledge/claude-code/features-overview.md` "Understand how
   features load")
2. **The description decides.** Agent Skills says the description "carries
   the entire burden of triggering".
   (`ai-external-knowledge/anthropic-agent-skills/agentskills-optimizing-descriptions.md`
   "How skill triggering works")
   Claude Code: "Claude matches your task against skill descriptions to decide
   which are relevant." (`ai-external-knowledge/claude-code/features-overview.md`
   "Understand how features load")
   Codex says implicit matching depends on the description, so it must be
   concise, with a clear scope and clear boundaries.
   (`ai-external-knowledge/codex/build-skills.md` "How ChatGPT and Codex use
   skills")
3. **The model chooses, not a keyword matcher.** Most hosts let the model read
   the list and decide. They do not match keywords in code.
   (`ai-external-knowledge/anthropic-agent-skills/agentskills-adding-skills-support.md`
   "Model-driven activation")
4. **Simple tasks may not use a skill.** A one-step request the agent can do
   with its basic tools may not open a skill, even when the description fits.
   Skills get used for tasks that need knowledge the agent lacks.
   (`ai-external-knowledge/anthropic-agent-skills/agentskills-optimizing-descriptions.md`
   "How skill triggering works")
5. **The user can always name the skill.** Claude Code: `/skill-name`.
   Codex: `$skill-name` or `/skills`.
   (`ai-external-knowledge/claude-code/skills.md` "Control who invokes a
   skill"; `ai-external-knowledge/codex/build-skills.md` "How ChatGPT and
   Codex use skills")
6. **Plugin skills carry the plugin name.** Both hosts list a plugin skill as
   `plugin-name:skill-name`, for example `work:work-on`.
   (`ai-external-knowledge/claude-code/features-overview.md` "Match features
   to your goal"; Codex: Observed, see 1.3)

### 1.2 Claude Code

| Question | Answer | Source |
| --- | --- | --- |
| Where is the list? | In the Skill tool's description. The settings reference says Claude sees it each turn. | `ai-external-knowledge/claude-code/settings-reference.md` "`skillListingBudgetFraction`"; Observed in this research session (Claude Code desktop, 2026-09-27): the Skill tool description says "The following skills are available for use with the Skill tool:" followed by the list. |
| Line format | `- name: description`. A plugin skill is `- plugin:skill: description`. A skill whose description was dropped is `- name` alone. | Observed, same session. |
| What text it sees | `description`, with `when_to_use` appended after it. | `ai-external-knowledge/claude-code/skills.md` "Frontmatter reference" |
| Cap per skill | 1,536 characters for `description` plus `when_to_use`. Longer text is cut at the end. Setting: `skillListingMaxDescChars`. | `ai-external-knowledge/claude-code/skills.md` "Skill descriptions are cut short"; `ai-external-knowledge/claude-code/settings-reference.md` "`skillListingMaxDescChars`" |
| Cap for the whole list | 1% of the model's context window. Setting: `skillListingBudgetFraction` (default `0.01`), or `SLASH_COMMAND_TOOL_CHAR_BUDGET` for a fixed character count. | `ai-external-knowledge/claude-code/skills.md` "Skill descriptions are cut short"; `ai-external-knowledge/claude-code/settings-reference.md` "`skillListingBudgetFraction`" |
| Over the cap | Every name stays. Whole descriptions are dropped, starting with the skills used least. Claude can still run those skills, but is less likely to pick one by itself. | `ai-external-knowledge/claude-code/settings-reference.md` "`skillListingBudgetFraction`" |
| Seen in practice | In this research session 35 of 95 listed skills showed only a name, which matches the documented overflow behavior. Among them: `sf-architect-solutioning:sf-architect-solutioning`, `work-tracker:work`, `session-skills:grill-me`, and ten `superpowers:` skills. | Observed, same session. |
| Hidden from the list | `disable-model-invocation: true` removes the skill from the list. `skillOverrides` can do the same, but not for plugin skills. | `ai-external-knowledge/claude-code/skills.md` "Control who invokes a skill", "Override skill visibility from settings" |
| After compaction | The context window page says the skill list "is not re-injected after `/compact`. Only skills you actually invoked get preserved." This conflicts with the settings reference (Part 9). Invoked skills are re-attached, first 5,000 tokens each, 25,000 tokens in total, newest first. | `ai-external-knowledge/claude-code/context-window.md` (the "Skill descriptions" entry); `ai-external-knowledge/claude-code/skills.md` "Skill content lifecycle" |
| After a skill loads | Its text stays in the conversation and is not re-read on later turns. | `ai-external-knowledge/claude-code/skills.md` "Skill content lifecycle" |
| Bad YAML | The body still loads, but the description is empty, so Claude cannot match the skill. `claude plugin validate` finds the error. | `ai-external-knowledge/claude-code/skills.md` "Skill not triggering" |
| What makes it go wrong | Vague or overlapping descriptions make Claude load the wrong skill or miss the right one. | `ai-external-knowledge/claude-code/features-overview.md` "Understand how features load" |

### 1.3 Codex

| Question | Answer | Source |
| --- | --- | --- |
| Where is the list? | A `## Skills` section with a `### Skill roots` table and a `### Available skills` list. | `ai-external-knowledge/codex/source-skills-catalog-prompt.md` (`render_available_skills_body`); Observed in a Codex 0.157.0 `codex exec` session log from 2026-09-27, run in a Toolkit V2 test project (`~/.codex/sessions/2026/09/27/rollout-2026-09-27T16-41-04-01a0e499-9250-7270-a771-ce18df928a58.jsonl`; "same log" below means this file). |
| Intro line | "A skill is a set of local instructions to follow that is stored in a `SKILL.md` file. Below is the list of skills that can be used. Each entry includes a name, description, and a short path ..." | `ai-external-knowledge/codex/source-skills-catalog-prompt.md` (`SKILLS_INTRO_WITH_HOST_ALIASES`); Observed, same log. |
| Line format | `- name: description (file: r6/skill-name/SKILL.md)`. `r6` is a short alias from the roots table. A plugin skill's name is `plugin:skill`. With no description: `- name: (file: ...)`. | `ai-external-knowledge/codex/source-skills-render.md` (`render_with_description`); Observed, same log, for example `- git-workflows:pull-latest: Brings the local repository up to date ... (file: r6/pull-latest/SKILL.md)`. |
| What text it sees | `name` and `description` from frontmatter, with all whitespace squeezed to single spaces on one line. If frontmatter sets `metadata.short-description`, the list shows that instead of `description`. | `ai-external-knowledge/codex/source-skills-parser.md` (`parse_skill_frontmatter_metadata`, `sanitize_single_line`); `ai-external-knowledge/codex/source-skills-render.md` (`SkillCatalogRenderPolicy::description`) |
| Required fields | Frontmatter must exist. A missing or empty `description` means the skill is not loaded. `name` defaults to the folder name and may be at most 64 characters. | `ai-external-knowledge/codex/source-skills-parser.md`; `ai-external-knowledge/codex/build-skills.md` "Build skills" |
| Cap per skill | 1,024 characters. A longer description is cut to 1,021 characters plus `...`. | `ai-external-knowledge/codex/source-skills-render.md` (`MAX_CATALOG_SKILL_DESCRIPTION_CHARS`, `truncate_catalog_skill_description`) |
| Cap for the whole list | 2% of the model's context window, counted in tokens at about 4 bytes per token. 8,000 characters when the window is unknown. `skills.max_context_tokens` sets it, at most 10,000 tokens. | `ai-external-knowledge/codex/build-skills.md` "Build skills"; `ai-external-knowledge/codex/config-reference.md` (`skills.max_context_tokens`); `ai-external-knowledge/codex/source-skills-render.md` (`skill_metadata_budget`) |
| Over the cap, step 1 | Descriptions are shortened from the end. Space is handed out one character at a time to each skill in turn, so every skill keeps about the same number of characters. No `...` is added. | `ai-external-knowledge/codex/source-skills-render.md` (`allocate_description_chars`) |
| Over the cap, step 2 | If even names and paths do not fit, all descriptions are removed and skills at the end of the list are left out, with the warning "Exceeded skills context budget. All skill descriptions were removed and N additional skills were not included in the model-visible skills list." | `ai-external-knowledge/codex/source-skills-render.md` (`allocate_skill_lines`, `warning_message`); `ai-external-knowledge/codex/build-skills.md` "Build skills" |
| List order | System skills first, then the project's `.agents/skills`, then user and plugin skills in name order. | Observed, same log. |
| Trigger rule in the source | "If the user names a skill (with `$SkillName` or plain text) OR the task clearly matches a skill's description shown above, you must use that skill for that turn. ... Do not carry skills across turns unless re-mentioned." | `ai-external-knowledge/codex/source-skills-catalog-prompt.md` |
| Trigger rule the model got | The 0.157.0 session gave the model different wording: use "reasonable judgement", and "Do not use a skill based solely on keywords, superficial relevance". It also says the user's instructions win over a skill's guidelines, and to tell the user the first time a skill is applied. | Observed, same log. |
| Reading rules | The main agent must read `SKILL.md` completely, and must read each reference file it needs itself. "Do not delegate reading, summarizing, or interpreting skill instructions to a subagent." "Avoid deep reference-chasing." | `ai-external-knowledge/codex/source-skills-catalog-prompt.md` |
| Manual-only skill | `agents/openai.yaml` with `policy: allow_implicit_invocation: false`. `$skill` still works. | `ai-external-knowledge/codex/build-skills.md` "Optional metadata" |

### 1.4 Side by side

| | Claude Code | Codex |
| --- | --- | --- |
| Line | `- name: description` | `- name: description (file: rN/.../SKILL.md)` |
| Per-skill cap | 1,536 characters (includes `when_to_use`) | 1,024 characters |
| List cap | 1% of context window | 2% of context window, or 8,000 characters |
| Over the list cap | Drops whole descriptions of the least-used skills | Shortens every description from the end; then drops all descriptions and some skills |
| `when_to_use` | Read and shown | Not read |
| `metadata.short-description` | Not used | Replaces the description in the list |
| Name limit | 64 characters in the Agent Skills standard; Claude Code does not state its own | 64 characters, enforced |
| Manual-only | `disable-model-invocation: true` | `agents/openai.yaml` `allow_implicit_invocation: false` |

The practical result: the start of every description matters in both hosts.
Codex cuts from the end when the list is crowded. Claude Code drops the whole
description of a skill that is rarely used, so a rarely used skill is found by
its name alone.

---

## Part 2. Rules for skill names

**N1. Use only lowercase letters, digits, and single hyphens, 64 characters
at most. No hyphen at the start or end, no `--`. The name equals the folder
name.**
The Agent Skills standard requires all of this. Codex enforces the 64-character
limit. Toolkit V2 already requires name equal to folder.
(`ai-external-knowledge/anthropic-agent-skills/agentskills-specification.md`
"`name` field"; `ai-external-knowledge/codex/source-skills-parser.md`
`MAX_NAME_LEN`)

**N2. Never use the words `claude` or `anthropic`, and no XML tags.**
Anthropic's platform rejects them. Outside a plugin, Claude Code skips a
skill folder named `anthropic-skills` or starting with `anthropic-skills:`. It
also skips a personal or project skill folder named `synced`.
(`ai-external-knowledge/anthropic-agent-skills/skill-authoring-best-practices.md`
"Skill structure"; `ai-external-knowledge/claude-code/skills.md` "Choose where
skills load")

**N3. Name the job, in words a person would type.** The name is what the user
types (`/work-on`, `$work-on`) and what the model reads first in the list.
Avoid vague names (`helper`, `utils`, `tools`) and generic ones (`documents`,
`data`, `files`).
(`ai-external-knowledge/anthropic-agent-skills/skill-authoring-best-practices.md`
"Naming conventions")

**N4. Use one naming pattern for the whole collection.** Anthropic prefers
the gerund form (`processing-pdfs`) and accepts noun phrases
(`pdf-processing`) and actions (`process-pdfs`). What it rejects is a mix.
Toolkit V2's names are settled in `dev/SKILL-INDEX.md`; keep new names in the
same pattern.
(`ai-external-knowledge/anthropic-agent-skills/skill-authoring-best-practices.md`
"Naming conventions")

**N5. Group related skills under one prefix.** Anthropic found that grouping
tools under shared prefixes helps agents pick the right one when many are
available, and that prefix versus suffix placement changes results. In both
hosts the plugin name is already a prefix (`work:`, `memory:`). A shared word
inside the skill name (`work-on`, `work-check`) groups them again for the bare
command form.
(`ai-external-knowledge/anthropic-engineering/writing-tools-for-agents.md`
"Namespacing your tools")

**N6. Do not reuse a built-in command's name.** In Claude Code the bare
`/name` runs a plugin skill only when no other command uses that name; the
full `/plugin:name` always works. In Codex two skills with the same name both
appear and are not merged.
(`ai-external-knowledge/claude-code/skills.md` "How a skill gets its command
name"; `ai-external-knowledge/codex/build-skills.md` "Where Codex loads local
skills")

---

## Part 3. Rules for descriptions

### Hard limits (both hosts)

**D1. At most 1,024 characters, never empty, no XML tags.** This is the Agent
Skills standard and Anthropic's platform limit. Codex cuts anything longer.
Claude Code allows 1,536, but a description written for both hosts must fit
the smaller cap.
(`ai-external-knowledge/anthropic-agent-skills/agentskills-specification.md`
"`description` field";
`ai-external-knowledge/anthropic-agent-skills/skill-authoring-best-practices.md`
"Skill structure"; `ai-external-knowledge/codex/source-skills-render.md`)

**D2. Quote the description in YAML.** A colon inside an unquoted value
(`description: Use when: ...`) can break the YAML. In Claude Code a broken
frontmatter leaves the description empty, so the skill never triggers on its
own. Codex tries to repair this one case; other hosts may not.
(`ai-external-knowledge/claude-code/skills.md` "Skill not triggering";
`ai-external-knowledge/anthropic-agent-skills/agentskills-adding-skills-support.md`
"Handling malformed YAML"; `ai-external-knowledge/codex/source-skills-parser.md`
`repair_frontmatter_scalar_fields`)

**D3. Put every trigger in `description`. Never in `when_to_use`, and never
in `metadata.short-description`.** Codex does not read `when_to_use`. Codex
shows `metadata.short-description` instead of the description when it is set.
Toolkit V2 frontmatter holds only `name` and `description`.
(`ai-external-knowledge/claude-code/skills.md` "Frontmatter reference";
`ai-external-knowledge/codex/source-skills-parser.md`;
`ai-external-knowledge/codex/source-skills-render.md`)

### Length

**D4. Aim for about 300 to 400 characters: one sentence on what the skill
does and why (a ", so ..." clause), one on when to use it, and at most one
short "Not for" clause. `dev/tools/check-skills.mjs` fails a description over
400 characters.**
Agent Skills: "A few sentences to a short paragraph is usually right".
Claude Code: every skill in the listing adds to the context on every turn,
whether or not Claude ever uses it.
(`ai-external-knowledge/anthropic-agent-skills/agentskills-optimizing-descriptions.md`
"Writing effective descriptions"; `ai-external-knowledge/claude-code/skills.md`
"Find unused skills")
The number range is this guide's arithmetic, not an official figure. The
limit is 400 (`MAX_DESCRIPTION` in `dev/tools/check-skills.mjs`, and the
build `AGENTS.md`): Mike's why clause (2026-09-29) adds about 40 to 80
characters to the earlier aim of 150 to 300; 400 characters is about 100
tokens, close to the "~100 tokens" the Agent Skills specification budgets
for name and description together
(`ai-external-knowledge/anthropic-agent-skills/agentskills-specification.md`
"Progressive disclosure"), and far under the 1,024-character cap (D1). The
cost: with the Codex fallback of 8,000 characters and 30 skills, each line
spends about 50 characters on name and path, which leaves about 215
characters of description per skill before Codex starts cutting. Codex cuts
every description from the end
(`ai-external-knowledge/codex/source-skills-render.md`
`allocate_description_chars`), so the job and the main trigger go in the
first 120 characters (D5), where the check reads them. With a known context
window the Codex budget is 2% of it, which is larger; the 8,000-character
case is the crowded one. In Claude Code, every character adds to the budget
that decides which skills lose their description (1.2); new projects set
`skillListingBudgetFraction` to 0.02. Toolkit V2's descriptions measured 266
to 307 characters on 2026-09-27, and 299 to 405 after the why clauses
(2026-09-29).

**D5. Put the job and the main trigger in the first sentence.** Codex: "Front-load
the key use case and trigger words", so the skill still matches when the host
shortens descriptions. Claude Code: "Put the key use case first."
(`ai-external-knowledge/codex/build-skills.md` "How ChatGPT and Codex use
skills"; `ai-external-knowledge/claude-code/skills.md` "Frontmatter reference")

### Voice and shape

**D6. Start with a third-person verb that says what the skill does, then why
to use it (a ", so ..." clause: the outcome, or the risk the skill prevents),
then "Use when ...".** Example shape: "Summarizes uncommitted changes and flags
anything risky, so nothing risky is committed by accident. Use when the user
asks what changed, wants a commit message, or asks to review their diff."
Without the why clause, this is Claude Code's own first example, and Codex's
example has the same shape. The why clause is Mike's rule (`dev/GOAL.md`,
2026-09-29): it tells the agent what goes wrong when the skill is skipped.
`dev/tools/check-skills.mjs` fails a description without a job verb in its
first 120 characters, without a why clause (", so", "so that", "to keep",
"to prevent", "which keeps", or "which prevents") before "Use when", or
without a "Use when" clause.
Never write "I can help you ..." or "You can use this to ...". Anthropic:
"Always write in third person." Its reason: the description goes into the
system prompt, and a mixed point of view makes skills harder to find.
(`ai-external-knowledge/claude-code/skills.md` "Create your first skill";
`ai-external-knowledge/codex/customization-overview.md` "Skills" (the `commit`
example); `ai-external-knowledge/anthropic-agent-skills/skill-authoring-best-practices.md`
"Writing effective descriptions")
Part 9 explains how this settles a disagreement between two sources.

**D7. Say both what the skill does and when to use it.** Every source requires
both. Vague descriptions ("Helps with documents", "Processes data") fail.
(`ai-external-knowledge/anthropic-agent-skills/skill-authoring-best-practices.md`
"Writing effective descriptions";
`ai-external-knowledge/anthropic-agent-skills/agentskills-specification.md`
"`description` field"; `ai-external-knowledge/codex/best-practices.md` "Turn
repeatable work into skills")

**D8. Describe the user's goal and situation, not how the skill works
inside.** "The agent matches against what the user asked for." Keep procedure,
format, and safety detail in the body.
(`ai-external-knowledge/anthropic-agent-skills/agentskills-optimizing-descriptions.md`
"Writing effective descriptions"; `ai-external-knowledge/codex/openai-plugins-build-skills.md`
"Write `SKILL.md`")

### Trigger phrasing

**D9. Use the words the owner actually says, including indirect ones.** Claude
Code's first fix for a skill that does not trigger: "Check the description
includes keywords users would naturally say". Codex: "Include the kinds of
trigger phrases a user would actually say." Agent Skills: list contexts where
the skill applies "including cases where the user doesn't name the domain
directly".
(`ai-external-knowledge/claude-code/skills.md` "Skill not triggering";
`ai-external-knowledge/codex/best-practices.md` "Turn repeatable work into
skills"; `ai-external-knowledge/anthropic-agent-skills/agentskills-optimizing-descriptions.md`
"Writing effective descriptions")

**D10. Give two to four example phrases as examples of the situation, not as
a keyword list.** The Codex 0.157.0 model was told "Do not use a skill based
solely on keywords, superficial relevance". Agent Skills warns against adding
the exact words of failed test prompts; find "the general category or concept
those queries represent" instead.
(Observed Codex base instructions, 1.3;
`ai-external-knowledge/anthropic-agent-skills/agentskills-optimizing-descriptions.md`
"The optimization loop")
Project evidence: in `dev/test-runs/skill-routing.md`, every Claude Code miss
was a message with no skill opened at all (for example "Pick up WI-12 where we
left off", "Is this ready to ship?", "I dragged a card to Done in Notion").
Those are situations the descriptions did not name.

**D11. Name the state of the project, not only the request.** A skill that
fits "after the owner approves", "when a work item is waiting on the owner",
or "when a card moved in the tracker" should say so. The agent decides from
the conversation and "current context", not only the last message.
(`ai-external-knowledge/claude-code/sub-agents.md` "Understand automatic
delegation", which says the same for agents;
`ai-external-knowledge/anthropic-agent-skills/agentskills-optimizing-descriptions.md`
"Should-trigger queries", on tasks "buried in a larger chain")

### When not to use it

**D12. Add a "Not for ..." clause only where a real neighbor skill competes,
and name the neighbor.** Codex's template description is "Explain exactly when
this skill should and should not trigger." Agent Skills: when a skill fires on
the wrong prompts, say what the skill does not do, or make the boundary with
the nearby skill clear. OpenAI's
own bundled Codex skills end with "Do not use when ..." or "Do not use for ...".
(`ai-external-knowledge/codex/build-skills.md` "Create a skill";
`ai-external-knowledge/anthropic-agent-skills/agentskills-optimizing-descriptions.md`
"The optimization loop"; Observed: the `imagegen` and `openai-docs` lines in
the Codex session log)
Project evidence: two of the three Codex misses in `dev/test-runs/skill-routing.md`
(messages 42 and 43) came from two Toolkit V2 skills that both claimed the
message.

**D13. No two descriptions may claim the same message.** Claude Code: vague or
overlapping descriptions make Claude load the wrong skill. Anthropic: if a
person cannot say for certain which tool fits a situation, the agent cannot
either. Codex: split workflows that have different triggers, inputs, or
success criteria.
(`ai-external-knowledge/claude-code/features-overview.md` "Understand how
features load"; `ai-external-knowledge/anthropic-engineering/effective-context-engineering-for-ai-agents.md`
"The anatomy of effective context"; `ai-external-knowledge/codex/openai-plugins-build-skills.md`
"Define the workflow boundary")

**D14. Be firm about the situation, not wide about the scope.** Agent Skills
says "Err on the side of being pushy" to fix under-triggering. Claude Code's
fix for over-triggering is "Make the description more specific". Do both:
state plainly that the skill applies in its situation ("Use whenever ..."),
and keep the situation narrow.
(`ai-external-knowledge/anthropic-agent-skills/agentskills-optimizing-descriptions.md`
"Writing effective descriptions"; `ai-external-knowledge/claude-code/skills.md`
"Skill triggers too often")

**D15. A skill that must never start on its own is a manual-only skill, not a
description problem.** Claude Code: `disable-model-invocation: true` for
workflows "with side effects or that you want to control timing". Codex:
`allow_implicit_invocation: false` in `agents/openai.yaml`. Toolkit V2 allows
neither field today (frontmatter holds only `name` and `description`), so a
risky skill must say in its description that it runs only when the owner asks
for it by name or phrase, and its body must stop and confirm.
(`ai-external-knowledge/claude-code/skills.md` "Control who invokes a skill";
`ai-external-knowledge/codex/build-skills.md` "Optional metadata")

### Description template

```text
<Third-person verb phrase: what it does, with the key nouns>, so <outcome or
risk prevented>. Use when <the owner's goal or the project state>, for
example "<phrase>", "<phrase>", or "<phrase>". Not for <neighbor job>; use
<neighbor-skill>.
```

Checks for each description:

- It is 1,024 characters or fewer, and about 300 to 400 (D1, D4).
- The first sentence alone says what the skill does (D5).
- It has a why clause before "Use when" (D6).
- No "I", "you", or "this skill" as the subject (D6).
- It has a "Use when" part that names a situation, not just keywords (D8 to D11).
- Any "Not for" clause names the competing skill (D12).
- Read next to every other description, no message fits two of them (D13).

---

## Part 4. Rules for SKILL.md bodies

**B1. Keep `SKILL.md` under 500 lines and under about 5,000 tokens.** All
three sources say 500 lines; the standard adds 5,000 tokens. Move detail to
reference files.
(`ai-external-knowledge/claude-code/skills.md` "Add supporting files";
`ai-external-knowledge/anthropic-agent-skills/agentskills-specification.md`
"Progressive disclosure";
`ai-external-knowledge/anthropic-agent-skills/skill-authoring-best-practices.md`
"Token budgets")

**B2. Put the most important instructions at the top.** After compaction,
Claude Code keeps only the first 5,000 tokens of each invoked skill.
(`ai-external-knowledge/claude-code/skills.md` "Skill content lifecycle")

**B3. Write standing instructions, and keep workflow state in files.** Claude
Code does not re-read the skill on later turns; the text stays in the
conversation. The Codex source tells the model not to "carry skills across
turns unless re-mentioned". So an owner's short follow-up ("yes", "go ahead")
may start a turn without the skill. Record where the workflow stands (for
example in the work item), so the next turn can find it.
(`ai-external-knowledge/claude-code/skills.md` "Skill content lifecycle";
`ai-external-knowledge/codex/source-skills-catalog-prompt.md`)

**B4. Include only what the agent would get wrong without it.** Agent Skills
asks of each line: would the agent get this wrong without it? If not, cut it.
Do not explain what a pull request or a YAML file is.
(`ai-external-knowledge/anthropic-agent-skills/agentskills-best-practices.md`
"Add what the agent lacks, omit what it knows";
`ai-external-knowledge/anthropic-agent-skills/skill-authoring-best-practices.md`
"Concise is key")

**B5. State what to do, not a story about it.** "State what to do rather than
narrating how or why." Codex: "Write imperative steps with explicit inputs and
outputs."
(`ai-external-knowledge/claude-code/skills.md` "Types of skill content";
`ai-external-knowledge/codex/build-skills.md` "Best practices")

**B6. Define the workflow boundary.** Say what input the skill expects, the
steps, the output the owner gets, which facts the agent must not guess, when
to ask, stop, or decline, and which files to read.
(`ai-external-knowledge/codex/openai-plugins-build-skills.md` "Define the
workflow boundary")

**B7. Match how strict a step is to how easily it breaks.** Give freedom where
several ways work. Give an exact command where one wrong flag does damage
("Run exactly this sequence ... Do not modify the command").
(`ai-external-knowledge/anthropic-agent-skills/agentskills-best-practices.md`
"Match specificity to fragility";
`ai-external-knowledge/anthropic-agent-skills/skill-authoring-best-practices.md`
"Set appropriate degrees of freedom")

**B8. Give one default, not a menu.** "Pick a default and mention alternatives
briefly."
(`ai-external-knowledge/anthropic-agent-skills/agentskills-best-practices.md`
"Provide defaults, not menus")

**B9. Keep a Gotchas section in `SKILL.md` itself.** Gotchas are the facts
that break reasonable guesses. They belong in the main file, because the agent
may not know when to open a reference. Add each correction the owner makes.
(`ai-external-knowledge/anthropic-agent-skills/agentskills-best-practices.md`
"Gotchas sections")

**B10. Use a template for any fixed output format, and a checklist for any
multi-step workflow with gates.**
(`ai-external-knowledge/anthropic-agent-skills/agentskills-best-practices.md`
"Templates for output format", "Checklists for multi-step workflows")

**B11. Build in a check before moving on.** Do the work, run a validator or
compare against a reference, fix, repeat. For batch or destructive steps:
write a plan, check it against the source of truth, then act.
(`ai-external-knowledge/anthropic-agent-skills/agentskills-best-practices.md`
"Validation loops", "Plan-validate-execute")

**B12. Use one term for one thing, and no dates that go stale.**
(`ai-external-knowledge/anthropic-agent-skills/skill-authoring-best-practices.md`
"Use consistent terminology", "Avoid time-sensitive information")

**B13. Let the owner's explicit instruction win, and say why when the skill
stops.** Codex tells the model that user instructions win over skill
guidelines. When a skill makes the agent pause or ask, Codex asks the model to
name the skill and summarize the instruction that caused the stop. Write stop points with a one-line
reason the agent can repeat.
(Observed Codex base instructions, 1.3; `ai-external-knowledge/codex/openai-plugins-build-skills.md`
"Review instruction following")

**B14. No host-only syntax in the body.** `` !`command` ``, `$ARGUMENTS`, and
`${CLAUDE_*}` are Claude Code features and do not work in claude.ai or the
API; Codex does not document them. Toolkit V2 already bans them.
(`ai-external-knowledge/claude-code/skills.md` "Using skill frontmatter
outside Claude Code", "Available string substitutions"; `AGENTS.md` Rules)

**B15. Use forward slashes in every path.**
(`ai-external-knowledge/anthropic-agent-skills/skill-authoring-best-practices.md`
"Avoid Windows-style paths")

---

## Part 5. Rules for reference files, scripts, and assets

**R1. Link every reference file directly from `SKILL.md`. One level deep.**
Claude may read only part of a file that is linked from another linked file.
Codex tells its model to "prefer opening only files directly linked from
`SKILL.md`".
(`ai-external-knowledge/anthropic-agent-skills/skill-authoring-best-practices.md`
"Avoid deeply nested references";
`ai-external-knowledge/anthropic-agent-skills/agentskills-specification.md`
"File references"; `ai-external-knowledge/codex/source-skills-catalog-prompt.md`)

**R2. Say when to open each file.** "Read `references/api-errors.md` if the
API returns a non-200 status code" works better than "see references/".
Codex's model is told to use the skill's "routing instructions to identify the
files required".
(`ai-external-knowledge/anthropic-agent-skills/agentskills-best-practices.md`
"Structure large skills with progressive disclosure";
`ai-external-knowledge/codex/openai-plugins-build-skills.md` "Add supporting
resources"; `ai-external-knowledge/codex/source-skills-catalog-prompt.md`)

**R3. Keep each reference file on one subject. Give a file over 100 lines a
contents list at the top.**
(`ai-external-knowledge/anthropic-agent-skills/agentskills-specification.md`
"`references/`";
`ai-external-knowledge/anthropic-agent-skills/skill-authoring-best-practices.md`
"Structure longer reference files with table of contents")

**R4. Use paths relative to the skill folder.** Both hosts resolve them
against the folder that holds `SKILL.md`.
(`ai-external-knowledge/anthropic-agent-skills/agentskills-specification.md`
"File references"; `ai-external-knowledge/codex/source-skills-catalog-prompt.md`)

**R5. Add a script only when the result must be exact or needs a tool; say
whether to run it or read it.** Codex: "Prefer instructions over scripts
unless you need deterministic behavior or external tooling." Anthropic: "It
should be clear whether Claude should run scripts directly or read them into
context as reference." Both hosts tell the agent to run a provided script
instead of retyping it.
(`ai-external-knowledge/codex/build-skills.md` "Best practices";
`ai-external-knowledge/anthropic-engineering/equipping-agents-for-the-real-world-with-agent-skills.md`
"Developing and evaluating skills"; `ai-external-knowledge/codex/source-skills-catalog-prompt.md`)

**R6. Put fixed files the agent copies in `assets/`, and link them from
`SKILL.md`.**
(`ai-external-knowledge/anthropic-agent-skills/agentskills-specification.md`
"`assets/`"; `ai-external-knowledge/codex/openai-plugins-build-skills.md`
"Add supporting resources")

**R7. Do not put test cases inside a shipped skill folder.** Agent Skills
stores evals in `evals/evals.json` inside the skill. Toolkit V2 ships every
file under `plugins/<name>/`, so keep eval files under `dev/`.
(`ai-external-knowledge/anthropic-agent-skills/agentskills-evaluating-skills.md`
"Designing test cases"; `AGENTS.md` Rules, "`dev/` is not shipped")

---

## Part 6. Rules for hooks

**H1. Use a hook for any step that must happen the same way every time; use
a skill for steps that need judgment.** Claude Code: a rule written in
CLAUDE.md or a skill is "a request, not a guarantee"; a `PreToolUse` hook that
blocks the action is enforcement.
(`ai-external-knowledge/claude-code/features-overview.md` "Compare similar
features" (Hook vs Skill); `ai-external-knowledge/claude-code/best-practices.md`
"Set up hooks"; `ai-external-knowledge/codex/customization-overview.md`
"AGENTS Guidance")

**H2. A skill that stops working mid-task needs a stronger description or a
hook.** Claude Code: when a skill seems to stop influencing behavior, make its
description and instructions stronger, or enforce the behavior with a hook.
(`ai-external-knowledge/claude-code/skills.md` "Skill content lifecycle")

**H3. Use `UserPromptSubmit` and `SessionStart` to add short context, such as
a routing reminder for an exact owner phrase or a briefing after
compaction.** Both hosts add plain stdout, or `hookSpecificOutput.additionalContext`,
from these events to the model's context. Both fire `SessionStart` with source
`compact` after compaction.
(`ai-external-knowledge/claude-code/hooks.md` "Exit code output", "SessionStart";
`ai-external-knowledge/codex/hooks.md` "SessionStart", "UserPromptSubmit")

**H4. Keep hook output short.** Claude Code caps `additionalContext`,
`systemMessage`, and plain stdout at 10,000 characters; longer text goes to a
file with a 2,000-character preview. Codex spills anything over about 2,500
tokens to a file by default (`additionalContextLimit`) and warns that context
from many hooks "adds up and can degrade model performance".
(`ai-external-knowledge/claude-code/hooks.md` "JSON output";
`ai-external-knowledge/codex/hooks.md` "Large hook output")

**H5. Block with exit code 2 and a reason on stderr.** In Claude Code exit
code 1 is a non-blocking error: the action goes ahead. Codex also accepts exit
2 with stderr. Use either exit codes or JSON on stdout, not both.
(`ai-external-knowledge/claude-code/hooks.md` "Exit code 2", "Exit code
output", "JSON output"; `ai-external-knowledge/codex/hooks.md` "UserPromptSubmit")

**H6. Print only the JSON on stdout, and put event fields inside
`hookSpecificOutput`.** Any text before the `{` (for example an `echo` in a
shell profile) makes Claude Code treat the whole output as plain text. A field
at the wrong level is ignored without an error. In Codex, returning
`continue`, `stopReason`, or `suppressOutput` from `PreToolUse` marks the hook
failed and lets the tool call go ahead.
(`ai-external-knowledge/claude-code/hooks-guide.md` "Hook JSON has no effect";
`ai-external-knowledge/codex/hooks.md` "Common output fields")

**H7. Assume every matching hook runs at the same time.** One hook's deny does
not stop another hook from running. Do not have two hooks rewrite the same
tool input.
(`ai-external-knowledge/claude-code/hooks-guide.md` "Combine results from
multiple hooks", "Limitations"; `ai-external-knowledge/codex/hooks.md` "Hooks")

**H8. Make a `Stop` hook check whether it already blocked once.** Claude Code
passes `stop_hook_active` and overrides a Stop hook after eight blocks in a
row.
(`ai-external-knowledge/claude-code/hooks-guide.md` "Stop hook hits the block
cap")

**H9. Write Codex hooks as `command` or `mcp_tool` handlers only, with
anchored regex matchers such as `^Bash$`.** Codex parses `prompt` and `agent`
handlers but skips them. Its `matcher` is a regex, so an unanchored pattern
can match part of a longer tool name; `UserPromptSubmit`, `Stop`, and
`Interrupt` ignore the matcher. Claude Code matchers are case-sensitive, and an MCP
matcher needs `.*` after the server prefix.
(`ai-external-knowledge/codex/hooks.md` "Config shape", "Matcher patterns";
`ai-external-knowledge/claude-code/hooks.md` "Matcher patterns";
`ai-external-knowledge/claude-code/hooks-guide.md` "Hook not firing")

**H10. Treat Codex tool hooks as a guardrail, not a wall.** Hosted tools such
as web search do not pass through tool hooks, and some tool paths can opt out.
In Claude Code a `PreToolUse` deny holds even in bypass-permissions mode.
(`ai-external-knowledge/codex/hooks.md` "Tool coverage";
`ai-external-knowledge/claude-code/hooks-guide.md` "Hooks and permission
modes")

**H11. Expect Codex to ask the owner to trust each new or changed hook.**
Codex records trust against the hook's hash and skips plugin hooks until they
are trusted, so every change to `hooks/codex-hooks.json` needs Mike to trust it
again in `/hooks`.
(`ai-external-knowledge/codex/hooks.md` "Review and trust hooks",
"Plugin-bundled hooks")

**H12. Find plugin files through the plugin root variable.** Claude Code sets
`CLAUDE_PLUGIN_ROOT` and `CLAUDE_PLUGIN_DATA`. Codex sets `PLUGIN_ROOT` and
`PLUGIN_DATA`, and also sets the two `CLAUDE_` names for compatibility.
Claude Code's exec form (`command` plus `args`) avoids shell quoting.
(`ai-external-knowledge/claude-code/hooks.md` "Hook handler fields",
"Reference scripts by path"; `ai-external-knowledge/codex/hooks.md`
"Plugin-bundled hooks")

**H13. Keep time limits in mind.** Claude Code: 10 minutes for command hooks,
30 seconds for `UserPromptSubmit`, a shared 1.5-second budget for
`SessionEnd`. Codex: 600 seconds, and 1 second (at most 3) for `SessionEnd` and
`Interrupt`. A `SessionStart` hook runs every session, so keep it fast.
(`ai-external-knowledge/claude-code/hooks-guide.md` "Limitations";
`ai-external-knowledge/claude-code/hooks.md` "SessionStart";
`ai-external-knowledge/codex/hooks.md` "Config shape")

---

## Part 7. Rules for agents and multi-agent workflows

**A1. Use the simplest setup that works; add agents only when they measurably
help.** Anthropic's advice: start with simple prompts, measure them, and add
multi-step agent systems only when simpler ones fall short.
(`ai-external-knowledge/anthropic-engineering/building-effective-agents.md`
"Summary")

**A2. Pick the pattern on purpose.** Prompt chaining (fixed steps), routing
(classify, then hand off), parallel sections or votes, orchestrator and
workers (subtasks decided at run time), evaluator and optimizer (one writes,
one grades, repeat). Toolkit V2's skill list itself is routing: the
description set is the classifier.
(`ai-external-knowledge/anthropic-engineering/building-effective-agents.md`
"Building blocks, workflows, and agents")

**A3. Send noisy, self-contained work to a subagent; keep back-and-forth in
the main conversation.** Subagents fit work that produces output you do not
need to keep, that needs its own tool limits, or that can return a summary.
The main conversation fits iterative work and phases that share context.
A subagent often returns a summary of 1,000 to 2,000 tokens.
(`ai-external-knowledge/claude-code/sub-agents.md` "Choose between subagents
and main conversation"; `ai-external-knowledge/codex/subagents.md` "Why
subagent workflows help";
`ai-external-knowledge/anthropic-engineering/effective-context-engineering-for-ai-agents.md`
"Context engineering for long-horizon tasks")

**A4. Run reading work in parallel; be careful with parallel writing.** Codex
suggests parallel agents for reading, tests, and summaries, and more care when
several agents edit code at once.
(`ai-external-knowledge/codex/subagents.md` "Why subagent workflows help")

**A5. In a skill that needs helpers, say so in plain words: how to split the
work, whether to wait for all of them, and what each returns.** Codex does
not start subagents on its own; it starts them when asked, or "when applicable
project or skill instructions request it". Claude Code also delegates on its
own when a task matches an agent's description.
(`ai-external-knowledge/codex/subagents.md` "Triggering subagent workflows";
`ai-external-knowledge/claude-code/sub-agents.md` "Understand automatic
delegation")

**A6. Write the full task into the delegation message.** A subagent starts
with a fresh context. It does not see the conversation, the skills already
loaded, or the output style. Restate any rule it must follow. Toolkit V2
agents carry their own writing rules for this reason (`AGENTS.md` Rules).
(`ai-external-knowledge/claude-code/sub-agents.md` "What loads at startup")

**A7. Do not hand a skill's instructions to a subagent to read for you in
Codex.** Codex's model is told the main agent must read the skill and its
needed reference files itself; subagents may still do the task work.
(`ai-external-knowledge/codex/source-skills-catalog-prompt.md`)

**A8. Give each agent one job and a description that singles it out.** Claude
Code: "Write descriptions that single out one subagent", keep the combined
descriptions under 15,000 tokens, and add "use proactively" to invite
automatic use. Codex: custom agents "are narrow and opinionated"; each needs
`name`, `description`, and `developer_instructions`.
(`ai-external-knowledge/claude-code/sub-agents.md` "Example subagents",
"Understand automatic delegation"; `ai-external-knowledge/codex/subagents.md`
"Custom agents", "Example custom agents")

**A9. Codex custom agents live in TOML files, not in plugins.** Codex reads
them from `~/.codex/agents/` or `.codex/agents/`. The Codex plugin pages
describe skills, MCP servers, apps, and hooks, not agents. A Toolkit V2 skill
that must work in Codex has to carry any helper's instructions itself, in the
delegation message.
(`ai-external-knowledge/codex/subagents.md` "Custom agents";
`ai-external-knowledge/codex/build-plugins.md`; `ai-external-knowledge/codex/plugins.md`)

**A10. Check finished work with a reviewer in a fresh context, and limit what
counts as a finding.** Claude Code warns that a reviewer asked to find gaps
usually reports some, even when the work is sound. Tell it to flag only gaps
that affect correctness or the stated requirements.
(`ai-external-knowledge/claude-code/best-practices.md` "Add an adversarial
review step")

**A11. For dozens of agents, use a scripted workflow, not turn-by-turn
delegation.** In Claude Code a dynamic workflow holds the plan in a script
and can run "dozens to hundreds of agents per run". The captured Codex pages
describe no such feature, so a Toolkit V2 skill cannot depend on it.
(`ai-external-knowledge/claude-code/workflows.md` "When to use a workflow";
`ai-external-knowledge/claude-code/agents.md`)

---

## Part 8. How to test that a skill triggers

**T1. Build a test set of about 20 prompts: 8 to 10 that should start the
skill and 8 to 10 that should not.** Vary wording, detail, and how directly
the prompt names the job. The best "should not" prompts are near misses that
share words with the skill but need a different one.
(`ai-external-knowledge/anthropic-agent-skills/agentskills-optimizing-descriptions.md`
"Designing trigger eval queries")
OpenAI's list of kinds: direct requests, indirect requests, incomplete input
that should get a question, requests that should not start the skill, and
edge cases.
(`ai-external-knowledge/codex/openai-plugins-build-skills.md` "Test the skill")

**T2. Run each prompt in a fresh session, at least 3 times, and count a
trigger rate.** Pass: above 0.5 for "should", below 0.5 for "should not". A
fresh session matters because authoring context hides gaps.
(`ai-external-knowledge/anthropic-agent-skills/agentskills-optimizing-descriptions.md`
"Running multiple times"; `ai-external-knowledge/claude-code/skills.md`
"Evaluate and iterate on a skill")

**T3. Tune on part of the set and judge on the rest.** Use about 60% of
prompts to find failures and 40% to check that a fix generalizes. About five
rounds is usually enough; keep the round with the best score on the held-back
40%, which may not be the last one.
(`ai-external-knowledge/anthropic-agent-skills/agentskills-optimizing-descriptions.md`
"Avoiding overfitting with train/validation splits", "The optimization loop")

**T4. Test every skill's description against every other skill.** A test
passes only when the expected skill is the first one opened. This is how
`dev/test-runs/skill-routing.md` measured Toolkit V2 (Claude Code 81%, Codex
94%, 2026-09-27). Re-run that check after any description change.
(Project evidence: `dev/test-runs/skill-routing.md`;
`ai-external-knowledge/claude-code/features-overview.md` "Understand how
features load", on overlap)

**T5. Claude Code: detect the trigger from the `Skill` tool call.**
- One prompt: `claude -p "<prompt>" --output-format stream-json --verbose`,
  then look for a `tool_use` named `Skill` whose `input.skill` is the skill's
  name (or `plugin:name`).
  (`ai-external-knowledge/anthropic-agent-skills/agentskills-optimizing-descriptions.md`
  "Running multiple times" shows the same check with `--output-format json`)
- A plugin suite: `claude plugin eval` (Claude Code 2.1.269 or later) with a
  `tool_used` grader, `tool: Skill`, and an `input_match` for the skill name.
  It also runs each case without the plugin and reports the difference.
  (`ai-external-knowledge/claude-code/plugin-evals.md` "Write a case manually",
  "The no-plugin baseline")
- Quick checks: ask "What skills are available?", run `/context` to see the
  listing size after the budget, `/doctor` for its cost, `/skill-doctor` for
  unused skills, and `claude plugin validate <skills folder>` for broken
  frontmatter.
  (`ai-external-knowledge/claude-code/skills.md` "Skill not triggering",
  "Skill descriptions are cut short", "Find unused skills")

**T6. Codex: detect the trigger from the first `SKILL.md` read.** Run
`codex exec --json` and read the session log in `~/.codex/sessions/`; the
first tool call that reads a `SKILL.md` is the chosen skill. The `--json`
event stream alone does not show every command.
(Project evidence: `dev/test-runs/skill-routing.md` "Codex")
To see what Codex listed, read the `### Available skills` section in the same
session log (1.3). Codex shows a warning only when it left skills out of the
list. It gives no warning when it only shortens descriptions.
(`ai-external-knowledge/codex/source-skills-render.md` `warning_message`)

**T7. Test output quality separately from triggering.** A skill that triggers
can still do the wrong thing. Compare runs with and without the skill against
written pass and fail conditions.
(`ai-external-knowledge/claude-code/skills.md` "Evaluate and iterate on a
skill"; `ai-external-knowledge/anthropic-agent-skills/agentskills-evaluating-skills.md`)

**T8. Fix the description when the wrong skill starts; fix the body when the
right skill does the wrong thing.**
(`ai-external-knowledge/codex/openai-plugins-build-skills.md` "Test the skill")

**T9. Test in both hosts, and with the models the owner uses.** Each host
builds a different list (Part 1), and "What works perfectly for Opus might
need more detail for Haiku."
(`ai-external-knowledge/anthropic-agent-skills/skill-authoring-best-practices.md`
"Test with all models you plan to use")

---

## Part 9. Where the sources disagree, and how this guide settles it

| Topic | Source A | Source B | This guide |
| --- | --- | --- | --- |
| Voice | Anthropic: "Always write in third person" (`skill-authoring-best-practices.md`). | Agent Skills: use imperative phrasing, "Use this skill when..." rather than "This skill does..." (`agentskills-optimizing-descriptions.md`). | Third-person verb for what it does, a ", so ..." why clause, then "Use when ...". The official examples from Claude Code (`skills.md`), Anthropic (`skill-authoring-best-practices.md`), and Codex (`customization-overview.md`) all have this shape without the why clause, which is Mike's addition (D6). |
| Keywords | Claude Code and Codex: include the words users say (`skills.md`, `best-practices.md`). | Codex 0.157.0 model instructions: do not use a skill "based solely on keywords" (Observed). Agent Skills: do not add words from failed prompts (`agentskills-optimizing-descriptions.md`). | Name the situation first; add a few real phrases as examples of it (D9, D10). |
| How broad | Agent Skills: "Err on the side of being pushy" (`agentskills-optimizing-descriptions.md`). | Claude Code: if it triggers too often, "Make the description more specific" (`skills.md`). | Firm about the situation, narrow in scope, with a named neighbor where two compete (D12 to D14). |
| Codex trigger rule | Source: "you must use that skill" when the task clearly matches (`source-skills-catalog-prompt.md`). | Model instructions seen in 0.157.0: "use reasonable judgement" (Observed). | Write so the match is clear either way; do not rely on "must use". |
| Length cap | Claude Code: 1,536 characters (`skills.md`). | Agent Skills standard and Codex: 1,024 (`agentskills-specification.md`, `source-skills-render.md`). | 1,024 is the hard cap; aim for about 300 to 400, and `check-skills.mjs` fails over 400 (D1, D4). |
| Naming pattern | Anthropic prefers gerunds (`skill-authoring-best-practices.md`). | The standard's and Codex's examples use nouns and actions (`agentskills-specification.md`, `customization-overview.md`). | Any one pattern, used everywhere. Toolkit V2's names are settled in `dev/SKILL-INDEX.md` (N4). |
| Trigger text field | Claude Code reads `when_to_use` (`skills.md`). | Codex does not; it can show `metadata.short-description` instead (`source-skills-parser.md`). | Only `description` (D3). This is also Mike's rule in `AGENTS.md`. |
| Claude Code list after compaction | Settings reference: Claude sees the skill listing each turn (`settings-reference.md`). | Context window page: the listing "is not re-injected after `/compact`" (`context-window.md`). | Unsettled. Observed: the list sits in the Skill tool's description, which supports "each turn". If routing after compaction matters, a `SessionStart` hook with matcher `compact` can restate it (H3). |

---

## Part 10. What this means for Toolkit V2 now

These are recommendations from the evidence above, for the lead to act on or
take to Mike. They are not settled decisions.

1. **Claude Code under-triggers on indirect messages.** All nine Claude Code
   misses in `dev/test-runs/skill-routing.md` were "no skill opened". Add the
   missing situations to the descriptions that own them (D10, D11), then
   re-run the check (T4).
2. **Two Codex misses came from overlap.** Messages 42 and 43 in
   `dev/test-runs/skill-routing.md` were claimed by two skills. Add a "Not
   for ..." clause naming the neighbor to each side of those pairs (D12, D13).
3. **The Claude Code listing budget is already full on this Mac.** In this
   research session, 35 of 95 skills had no description, including
   `sf-architect-solutioning`. In a Toolkit V2 project, old `claude-toolkit`
   plugins and Mike's personal skills compete with the V2 skills for the same
   1% budget. Approved change 23 (V2 projects turn off the `claude-toolkit`
   plugins) helps. Raising `skillListingBudgetFraction` in the project's
   `.claude/settings.json` would help more; that is a setting change for Mike
   to approve.
4. **Keep descriptions near their current length.** 299 to 405 characters
   (2026-09-29, with the why clauses) sits inside D4's range. New "Not for"
   clauses should replace words, not add a third sentence of detail.
5. **Risky skills need a description that limits them to explicit requests,
   plus a confirmation step in the body**, because Toolkit V2 frontmatter
   cannot set `disable-model-invocation` or `allow_implicit_invocation`
   (D15). `reset-to-remote` already does this ("Use only when the owner
   says ...").

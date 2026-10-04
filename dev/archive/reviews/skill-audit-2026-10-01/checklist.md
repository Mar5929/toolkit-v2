# Skill audit checklist (2026-10-01)

One checklist for auditing every Toolkit V2 skill against Anthropic's skill
best practices. Mike asked for it on 2026-10-01 (`dev/GOAL.md`, "Skill
best-practices audit"). This is a read-only audit: no skill changes until
Mike has read the report.

## Contents

- Sources and tags
- How to use this checklist
- A. Structure and naming (C01 to C09)
- B. Frontmatter and description (C10 to C19)
- C. Body content and length (C20 to C45)
- D. Progressive disclosure and bundled files (C46 to C50)
- E. References and assets (C51 to C54)
- F. Scripts and code (C55 to C59)
- G. Testing and evaluation (C60 to C65)
- H. What the video says is new or outdated (C66 to C70)
- Conflicts between the video and the docs
- Docs pages that disagree with each other
- Where Mike's decisions meet an item
- Live pages that changed since the 2026-09-27 capture
- What the video says changed

## Sources and tags

Every item carries one tag:

- **video**: only the video says it.
- **docs**: only the official pages say it.
- **both**: the video and the official pages say it.

The video is "Everything You Know About Skills IS OUTDATED" by Simon
Scrapes, 12 minutes 49 seconds, uploaded 2026-10-01
(https://youtu.be/e7TY56-yIvM). Its English auto-generated captions were
downloaded with `yt-dlp` and read in full. The transcript is kept only in the
session scratchpad
(`/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-toolkit-v2/c5895307-8bd5-4391-b4b0-35e85e6820e1/scratchpad/skill-audit/transcript.txt`),
never in this repository. Video items give the minute and second, for
example `video 1:39`.

The docs were read live on 2026-10-01. Short names used below:

| Short name | Page |
| --- | --- |
| BP | Skill authoring best practices, https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices (the page the video refers to) |
| OV | Agent Skills overview, https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview |
| SPEC | Agent Skills specification, https://agentskills.io/specification |
| AS-BP | Best practices for skill creators, https://agentskills.io/skill-creation/best-practices |
| AS-DESC | Optimizing skill descriptions, https://agentskills.io/skill-creation/optimizing-descriptions |
| AS-EVAL | Evaluating skill output quality, https://agentskills.io/skill-creation/evaluating-skills |
| CC | Claude Code skills page, https://code.claude.com/docs/en/skills (linked from BP "Next steps") |
| FABLE5 | Prompting Claude Fable 5, https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5 (the "Fable 5 guide" the video cites) |
| PROMPT-BP | Prompting best practices, https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices |

Captured copies of BP, OV, SPEC, AS-BP, AS-DESC, AS-EVAL, and CC are in
`ai-external-knowledge/`. FABLE5 and PROMPT-BP are not captured there yet.

## How to use this checklist

- Mark each item for each skill: **pass**, **fail**, **n/a** (the item does
  not apply, with a reason), or **conflict for Mike** (the item clashes with
  one of his settled decisions; see "Where Mike's decisions meet an item").
  A conflict for Mike is never a fail.
- Give evidence for every fail: the file, the line or section, and what is
  wrong.
- Each item ends with the severity of a fail:
  - **[H] high**: the skill may not load, may not be picked, may be picked
    for the wrong job, or may cause damage.
  - **[M] medium**: the skill loads but may skip, misread, or half-read
    something.
  - **[L] low**: wasted context or style.
- Where an item says "(H for ...)", use high in that case.
- Skills here have no scripts by design (`AGENTS.md`, "Code limit"). Mark
  section F n/a for a skill with no script, except C59.

## A. Structure and naming

- **C01** A skill is a folder with `SKILL.md` at its root. Other files sit in
  clearly named folders such as `references/` and `assets/`. [M]
  *docs: SPEC "Directory structure"; BP "Progressive disclosure patterns"*
- **C02** `name` is 1 to 64 characters: lowercase letters, digits, and single
  hyphens only. No hyphen at the start or end, and no `--`. [H]
  *docs: BP "Skill structure"; SPEC "name field"*
- **C03** `name` equals the folder name. [H]
  *docs: SPEC "name field"*
- **C04** `name` holds no reserved word ("anthropic" or "claude") and no XML
  tags. [H]
  *docs: BP "Skill structure", "YAML frontmatter requirements"*
- **C05** The name says the job. It is not vague (`helper`, `utils`, `tools`)
  and not generic (`documents`, `data`, `files`). [L]
  *docs: BP "Naming conventions"*
- **C06** All skills in the collection use one naming pattern. BP prefers the
  gerund form and accepts noun phrases or action forms; a mix is what it
  rejects. [L]
  *docs: BP "Naming conventions"*
- **C07** Every bundled file and folder has a name that says what is inside,
  and folders group files by subject, not `file1.md` or `doc2.md`. [L]
  *docs: BP "Runtime environment"*
- **C08** Every path uses forward slashes. [M]
  *docs: BP "Avoid Windows-style paths"*
- **C09** The skill covers one coherent unit of work. It is not so narrow
  that one task needs several skills loaded at once, and not so broad that it
  is hard to match to a request. [M]
  *docs: AS-BP "Design coherent units"*

## B. Frontmatter and description

- **C10** The frontmatter starts on line 1 between `---` markers and parses
  as YAML. A colon inside an unquoted description can break it, so the
  description is quoted. [H]
  *docs: CC "Frontmatter reference", "Skill not triggering"*
- **C11** `description` is not empty, is at most 1,024 characters, and holds
  no XML tags. [H]
  *docs: BP "Skill structure"; SPEC "description field"*
- **C12** The description says both what the skill does and when to use it.
  [H]
  *docs: BP "Writing effective descriptions"; SPEC "description field"*
- **C13** The description is in the third person ("Processes ..."), never
  "I can help ..." or "You can use this ...". [M]
  *docs: BP "Writing effective descriptions"*
- **C14** The description is specific: it names the key terms and situations
  a user would bring. A vague line such as "helps with documents" fails. [M]
  *docs: BP "Writing effective descriptions"; SPEC "description field"*
- **C15** The description names the user's goal or situation, not how the
  skill works inside. [M]
  *docs: AS-DESC "Writing effective descriptions"*
- **C16** The main job and the main situation come first, because hosts cut
  long descriptions from the end. [M]
  *docs: CC "Frontmatter reference", "Skill descriptions are cut short"*
- **C17** The description covers requests that do not name the skill's
  subject directly, and where a close neighbor skill could also fit, it
  states the boundary, so no message fits two skills. [H]
  *docs: AS-DESC "Writing effective descriptions", "Should-not-trigger
  queries"; CC "Skill triggers too often"*
- **C18** The description is short: a few sentences at most. Every
  description costs context on every turn, used or not. [L]
  *docs: AS-DESC "Writing effective descriptions"; CC "Find unused skills"*
- **C19** Any other frontmatter field is one the spec or the host defines.
  Claude Code ignores an unknown field without any error. [M]
  *docs: SPEC "Frontmatter"; CC "Frontmatter reference"*

## C. Body content and length

### Size and focus

- **C20** The `SKILL.md` body is under 500 lines (SPEC adds: under about
  5,000 tokens). Content is split into files before it reaches that. [M]
  *both: BP "Token budgets"; SPEC "Progressive disclosure"; video 6:31*
- **C21** The skill holds only what the agent would get wrong without it. It
  does not explain things the agent already knows (what a pull request or a
  YAML file is). [L]
  *docs: BP "Concise is key"; AS-BP "Add what the agent lacks, omit what it
  knows"*
- **C22** Detail is moderate: no attempt to cover every edge case; the rest
  is left to the agent's judgment. [L]
  *docs: AS-BP "Aim for moderate detail"*
- **C23** How strict each step is matches how easily it breaks. Open
  instructions where many ways work. A template with options where one
  pattern is preferred. An exact command with "do not change it" where one
  mistake does damage. [M] (H for a destructive or irreversible step left
  open)
  *both: BP "Set appropriate degrees of freedom"; AS-BP "Match specificity
  to fragility"; video 1:39 to 3:33*
- **C24** Steps are judged one at a time: one skill may mix open steps and
  exact steps. The test for each step is what goes wrong if the agent does it
  a different way. [L]
  *both: AS-BP "Match specificity to fragility"; video 3:33 to 4:01*
- **C25** One default is given, not a menu of equal options. An alternative
  is named only for a stated case. [M]
  *docs: BP "Avoid offering too many options"; AS-BP "Provide defaults, not
  menus"*
- **C26** The skill teaches a method that works for any case of its kind,
  not the answer to one case. [L]
  *docs: AS-BP "Favor procedures over declarations"*
- **C27** No text that goes out of date, such as "before August, do X". Old
  ways, if kept, sit in a clearly marked old-ways section. [L]
  *docs: BP "Avoid time-sensitive information"*
- **C28** One term means one thing across the skill and all its files. [M]
  *docs: BP "Use consistent terminology"*
- **C29** Examples are concrete. Where the quality of the output depends on
  its style, the skill gives input and output pairs. [L]
  *docs: BP "Examples pattern", "Checklist for effective Skills"*
- **C30** A fixed output format comes with a template, and the skill says how
  strictly to follow it (exactly, or adapt as needed). [M]
  *docs: BP "Template pattern"; AS-BP "Templates for output format"*
- **C31** Decision points are written as branches ("if the item is new, do
  A; if it exists, do B"). Long branches go into their own files. [M]
  *docs: BP "Conditional workflow pattern"*
- **C32** `SKILL.md` has a Gotchas section: the facts that break a reasonable
  guess, kept in the main file where the agent reads them before it needs
  them. [M]
  *docs: AS-BP "Gotchas sections"*
- **C33** The most important instructions are near the top of `SKILL.md`.
  After compaction Claude Code may keep only the start of a skill. [M]
  *docs: CC "Skill content lifecycle", "Claude stops following a skill"*
- **C34** Guidance that applies for the whole task is written that way ("after
  every edit, ..."), because the host does not re-read the skill on later
  turns. [M]
  *docs: CC "Skill content lifecycle", "Claude stops following a skill"*
- **C35** The skill says what to do, without a story about it. Where a firm
  rule needs a reason, it gives one short reason, not capitals or a run of
  "ALWAYS" and "NEVER". [L]
  *both: CC "Types of skill content"; AS-EVAL "Iterating on the skill";
  PROMPT-BP (dial back aggressive wording); video 4:57*
- **C36** A rule that must hold every time, with no judgment involved, is
  enforced by a hook, not left to skill text alone. [H]
  *docs: CC "Claude stops following a skill"*
- **C37** MCP tools are named in full as `ServerName:tool_name`. [H]
  *docs: BP "MCP tool references"*
- **C38** Outside content the skill reads (web pages, Notion pages, issue
  comments, meeting transcripts) is treated as data, never as instructions.
  [H]
  *docs: OV "Security considerations"*
- **C39** The skill never asks the agent to copy or transcribe its own
  internal reasoning into the reply. Giving a reason for a recommendation is
  fine. [L]
  *docs: FABLE5 "Recommended scaffolding changes"*

### Workflows, checks, and feedback loops

- **C40** A complex multi-step job has clear steps in order. A fixed order is
  given where order matters (check the data before building on it). [M]
  *both: BP "Use workflows for complex tasks"; video 8:39 to 9:16*
- **C41** A long job, or one with checks between steps, gives the agent a
  progress checklist to copy into its reply and tick off. [M]
  *both: BP "Use workflows for complex tasks"; AS-BP "Checklists for
  multi-step workflows"; video 8:44*
- **C42** Every check step says where to go back when it fails ("if the
  check fails, return to step 3"), so a failed step is never ticked off. [M]
  *both: BP "Use workflows for complex tasks" (both examples); video 9:35*
- **C43** Output where quality matters has a check loop: compare the work to
  a checker, fix, compare again, and finish only when it passes. The checker
  can be a reference file or checklist, not only code. [M]
  *both: BP "Implement feedback loops"; AS-BP "Validation loops"; video 9:59
  to 10:28*
- **C44** A batch or destructive step uses plan, check, then act: the agent
  writes the plan, checks it against the source of truth, and only then
  carries it out. [H]
  *docs: BP "Create verifiable intermediate outputs"; AS-BP
  "Plan-validate-execute"*
- **C45** For long work, the check is done by a helper with a fresh context
  rather than by the agent reviewing its own work. [L]
  *docs: FABLE5 "Recommended scaffolding changes"*

## D. Progressive disclosure and bundled files

- **C46** `SKILL.md` reads as an overview that points to the detailed files.
  Large reference material can sit in a file at no cost until it is read. [M]
  *both: BP "Progressive disclosure patterns", "Runtime environment"; video
  6:31*
- **C47** Every bundled file is linked directly from `SKILL.md`, one level
  deep. No file is reachable only through another file. [H]
  *both: BP "Avoid deeply nested references"; SPEC "File references"; video
  7:55 to 8:37*
- **C48** Each link says what the file holds and when to open it (a
  condition, not just "see references/"). [M]
  *docs: AS-BP "Structure large skills with progressive disclosure"; CC "Add
  supporting files"*
- **C49** Content for separate areas is split into one file per area, so a
  task loads only its own area. [L]
  *both: BP "Pattern 2: Domain-specific organization"; video 7:34 to 7:55*
- **C50** Every bundled file earns its place. A file the agent never opens
  is unneeded or poorly signposted; a file it opens on every run may belong
  in `SKILL.md`. [L]
  *docs: BP "Observe how Claude navigates Skills"*

## E. References and assets

- **C51** Every reference file over 100 lines starts with a contents list
  that matches its headings. [M]
  *both: BP "Structure longer reference files with table of contents"; video
  0:54 to 1:37*
- **C52** Each reference file stays on one subject. [L]
  *docs: SPEC "references/"*
- **C53** Templates and other fixed files the agent copies sit in `assets/`.
  A short template may sit inline in `SKILL.md`. [L]
  *docs: SPEC "assets/"; AS-BP "Templates for output format"*
- **C54** Links use paths relative to the skill folder and never leave it.
  [H]
  *docs: SPEC "File references"*

## F. Scripts and code

Toolkit V2 skills hold no scripts (`AGENTS.md`, "Code limit"). Mark C55 to
C58 n/a for a skill with no script. C59 applies to every skill.

- **C55** A script handles its own errors and prints messages specific
  enough to fix the problem, rather than failing and leaving it to the
  agent. [M]
  *docs: BP "Solve, don't defer", "Create verifiable intermediate outputs";
  SPEC "scripts/"*
- **C56** A script has no unexplained numbers: each setting says why it has
  its value. [L]
  *docs: BP "Solve, don't defer"*
- **C57** The skill says whether to run a script or read it. [M]
  *docs: BP "Provide utility scripts", "Runtime environment"*
- **C58** A step that must come out the same every time, or that the agent
  would otherwise rewrite on every run, uses a tested script instead of
  code the agent writes. A script runs without its text entering the
  context. [M]
  *both: BP "Provide utility scripts", "Runtime environment"; AS-BP
  "Bundling reusable scripts"; video 4:01, 7:17 to 7:31*
- **C59** The skill names every outside tool it needs (for example `git`,
  `gh`, `ntn`, Node, an MCP server, a sign-in) and says how to check it is
  there and what to do when it is missing. [H]
  *both: BP "Avoid assuming tools are installed", "Package dependencies";
  video 10:51 to 11:49*

## G. Testing and evaluation

- **C60** Each skill has at least three test scenarios, built from real gaps
  seen without the skill. [M]
  *docs: BP "Build evaluations first", "Checklist for effective Skills"*
- **C61** Each test compares a run with the skill against a run without it
  (or with the previous version), each in a fresh session. [M]
  *docs: BP "Build evaluations first"; AS-EVAL "Running evals"; CC "Evaluate
  and iterate on a skill"*
- **C62** The skill is tested on every model it is meant to run on: enough
  guidance for the smaller model, and no over-explaining for the larger one.
  [M]
  *both: BP "Test with all models you plan to use"; video 4:26 to 6:09*
- **C63** The description has a trigger test: about 20 realistic requests (8
  to 10 that should start the skill, 8 to 10 near misses that should not),
  each run 3 times in a fresh session, passing above or below a 0.5 trigger
  rate. [M]
  *docs: AS-DESC "Designing trigger eval queries", "Running multiple
  times"*
- **C64** The skill has been used on real tasks, and what the agent missed or
  misread was fed back into it. [L]
  *docs: BP "Develop Skills iteratively with Claude", "Observe how Claude
  navigates Skills"; AS-BP "Refine with real execution"*
- **C65** Test checks are specific and checkable. Checks that always pass,
  with or without the skill, are replaced. [L]
  *docs: AS-EVAL "Writing assertions", "Analyzing patterns"*

## H. What the video says is new or outdated

- **C66** The skill is not written in the old style for weaker models: no
  capitals for emphasis, no runs of "IMPORTANT", "CRITICAL", or "MUST", and
  no step-by-step list where stating the goal would do. [M]
  *both: video 4:57 to 5:19; FABLE5 "Recommended scaffolding changes";
  PROMPT-BP (dial back aggressive wording)*
- **C67** Instructions the current model does better without are cut. If a
  run with the skill is worse than a run without it on the strongest model
  used, instructions are removed until it is not. [M]
  *both: video 5:15, 6:02 to 6:11; FABLE5 "Recommended scaffolding changes";
  AS-EVAL "Iterating on the skill" (keep the skill lean)*
- **C68** A step that the smallest model used keeps missing is made clearer,
  or made exact (low freedom). [M]
  *both: video 5:48 to 6:00; BP "Test with all models you plan to use"*
- **C69** When the owner has to correct the agent, or a check fails for a
  reason the skill does not cover yet, the agent proposes a new rule or
  gotcha, and it is added only after the owner says yes. [L]
  *both: video 10:31 to 10:49; AS-BP "Gotchas sections"; FABLE5
  "Recommended scaffolding changes"*
- **C70** The models each skill was tested on are written down. Per the
  docs and Mike's rules this goes outside the frontmatter (see Conflicts,
  item 2). [L]
  *video 6:11, adjusted by the docs*

## Conflicts between the video and the docs

The docs win each one.

1. **Partial reads of long files.** The video (0:00 to 0:41) says Claude
   reads only the first 100 lines of any long reference file, so rules after
   line 100 are as good as missing. The docs (BP "Avoid deeply nested
   references") say such previews happen mainly with a file reached through
   another reference file, and that a contents list lets Claude see a long
   file's whole scope and jump to a section (BP "Structure longer reference
   files with table of contents"). Docs rule: link every file from
   `SKILL.md` (C47) and give every file over 100 lines a contents list
   (C51). Nothing in the docs says content after line 100 is ignored, so
   there is no need to pack rules into the first 100 lines.
2. **The intended model in the frontmatter.** The video (6:11) says to write
   the intended model in the frontmatter of a shared skill. The docs have no
   field for this. SPEC's optional `compatibility` field is for environment
   needs (product, packages, network), and SPEC notes most skills do not
   need it. In Claude Code, a `model` field does not document anything: it
   switches to that model for the rest of the turn the skill runs in (CC
   "Frontmatter reference"). Docs rule: do not add it. Record tested models
   elsewhere (C70). Mike's rule (frontmatter holds only `name` and
   `description`) agrees.
3. **Installing what the skill needs.** The video (11:17 to 11:49) says
   every skill should tell the agent to install the package it needs, since
   the agent skips the install when the package is already there. The docs
   show an install line as the good example (BP "Avoid assuming tools are
   installed"), but also say some surfaces cannot install at run time, and
   that required packages are listed and checked as available (BP "Package
   dependencies"). Docs rule: name each dependency and check it (C59); add an
   install step only where the environment allows it.
4. **The old 200-line limit.** The video (0:23) recalls an earlier rule of
   keeping skills under 200 lines. The docs say the `SKILL.md` body stays
   under 500 lines (BP "Token budgets"; SPEC adds about 5,000 tokens). Docs
   rule: 500 lines (C20). The video itself uses 500 later (6:31).
5. **When to give a checklist.** The video (9:07 to 9:16) says to leave the
   checklist out when the order of steps does not matter. The docs give a
   checklist for complex multi-step work (BP "Use workflows for complex
   tasks"), especially with dependencies or checks between steps (AS-BP
   "Checklists for multi-step workflows"). Docs rule: the test is how
   complex the job is and whether it has checks between steps, not only
   order (C41).

## Docs pages that disagree with each other

These are already settled in `dev/research/skill-writing-guide.md` Part 9
or in `AGENTS.md`. They are listed so auditors do not mark them as fails.

- **Voice of the description.** BP: third person. AS-DESC: imperative ("Use
  this skill when ..."). Settled: a third-person verb first, then "Use when
  ..." (BP wins; the guide's D6).
- **Reasons in the text.** CC: say what to do, not how or why. AS-BP and
  AS-EVAL: explaining why works better than rigid "ALWAYS" or "NEVER" rules.
  Read together: one short reason on a firm rule, no story (C35).
- **Naming pattern.** BP prefers gerunds; SPEC and Codex examples use nouns
  and actions. Settled: any one pattern used everywhere (C06).
- **Description cap.** CC allows 1,536 characters; SPEC and Codex allow
  1,024. Settled: 1,024 is the hard cap; Mike's limit is 400 (C11).
- **Where test files live.** AS-EVAL and the skill-creator plugin keep tests
  in `evals/evals.json` inside the skill folder. Toolkit V2 ships every file
  in a skill folder, and `dev/` is not shipped, so tests live under `dev/`
  (the guide's R7). Do not mark a skill as failing for having no `evals/`
  folder.

## Where Mike's decisions meet an item

Report these as **conflict for Mike**, never as a fail. Sources: `AGENTS.md`
Rules and `dev/GOAL.md`.

- **No scripts in skills** (Code limit, 2026-09-30). The docs and the video
  say a fragile step works best as a script (C23, C58, C68). In Toolkit V2,
  the exact form is a written-out command (`git`, `gh`, `ntn`, or an MCP
  call) with "do not change it". Report a conflict only when a step truly
  needs code that a written command cannot give.
- **New hooks need Mike's yes** (Code limit). C36 says a must-hold rule
  belongs in a hook. Toolkit V2 has three hook commands; a new one, or a new
  job for one, needs his yes with its size. Report the rule and the hook it
  would need; do not mark the skill as failing.
- **Frontmatter holds only `name` and `description`.** This rules out a
  `model`, `compatibility`, `disable-model-invocation`, or `when_to_use`
  field (C19, C70). A skill that must never start on its own says so in its
  description and stops to confirm in its body (the guide's D15).
- **Descriptions under 400 characters, in single quotes, with a ", so ..."
  why clause and two to four of the owner's own phrases.** This is stricter
  than the docs' 1,024 (C11, C18). A description that meets Mike's shape
  passes C11 to C18 on length and shape.
- **Situations, not trigger words** (Mike, 2026-09-30). Example phrases in a
  description illustrate a situation; Mike must never have to remember
  special words (C14, C17).
- **Installing software changes Mike's setup.** For C59, the right step for
  a missing tool is to stop and tell Mike, not to install it without asking.
- **Test files under `dev/`** (see the last bullet of the previous section).
- **Shared texts are copies.** A file whose first line names a source in
  `dev/build-shared/` is a copy. Report a fail in it against the source, so
  one fix reaches every copy.
- **Mike's own text.** The model's own skills and the body of
  `sf-architect-solutioning` are Mike's words. Report findings there for
  Mike to decide; `check-skills.mjs` only warns on them.

## Live pages that changed since the 2026-09-27 capture

Each live page was compared with its copy in `ai-external-knowledge/` on
2026-10-01.

- **No change:** BP, OV, SPEC, AS-BP, AS-DESC, and AS-EVAL match their
  captured copies word for word, apart from the capture header. Every BP
  rule the video names was already there when BP was captured on
  2026-09-27.
- **Changed: CC** (`ai-external-knowledge/claude-code/skills.md`):
  1. A new troubleshooting section, "Claude stops following a skill",
     replaces the old advice in "Skill content lifecycle" to strengthen the
     description. New advice: put a rule that must hold every time in a
     hook (it can be defined in the skill's own `hooks` field); word
     judgment guidance so it covers the whole task; after compaction, invoke
     the skill again and keep the key instructions near the top of
     `SKILL.md`. The guide's rule H2 cites the old advice and needs
     updating. Items C33, C34, and C36 follow the new text.
  2. "Evaluate and iterate on a skill" now says how to switch a skill off for
     the run without it: a personal or project skill through `skillOverrides`
     set to `"off"`; a plugin skill through `claude plugin eval`. Toolkit V2
     skills are project skills inside a project, so `skillOverrides` applies.
     The guide's T2 and T7 do not say this yet.
  3. The bundled `/claude-api` skill gained subcommands. One of them,
     `prompt-audit` (Claude Code v2.1.221 or later), flags instructions
     written for older models in prompts and skills and proposes fixes as a
     diff. It is a ready tool for C66 and C67.
  4. Smaller changes that are not rules for writing skills: a table of
     permission rule forms for skills, and the `${CLAUDE_EFFORT}` wording.
- **Not captured yet:** FABLE5. Its "Recommended scaffolding changes" list
  is the source of the video's claim that older skills are too prescriptive
  for newer models (C39, C45, C66, C67, C69). Capturing it with Firecrawl
  into `ai-external-knowledge/` (with its `SOURCE-RECORD.md`) is a separate
  step; this audit did not write there.

## What the video says changed

In plain words, the video's message is:

- Skills used to be judged on good descriptions, short files, separate
  reference files, and clear step lists. The video says that is no longer
  enough: what now matters most is how the files are laid out and which
  checks the skill runs, more than how well the sentences are written.
- It sums these up as nine habits, roughly: a contents list on long
  reference files; a level of strictness chosen for each step; testing on
  every model used; recording the intended model; one-level links from
  `SKILL.md`; a short `SKILL.md` that points to split-out files; progress
  checklists; check-and-fix loops; and naming the tools a skill depends on.
- Its main "new" point is about models. Skills written for older models used
  numbered steps everywhere and capital letters for emphasis. Newer, stronger
  models can do worse with that much direction, so instructions a model does
  better without should be cut. Smaller models still need more detail, so a
  skill meant for several models sits in between.
- It says a skill can improve itself: when a check fails for a reason not
  written down yet, the agent proposes a new rule and the owner approves it.

How that holds up against the docs:

- The video presents these as rules Anthropic added recently. The best
  practices page read live today matches the copy captured on 2026-09-27
  word for word, and every rule the video takes from that page was already
  there. Its claim about older skills being too prescriptive comes from a
  different page, FABLE5, which this repository had not captured.
- Four points go further than the docs or differ from them: content after
  line 100 being ignored, the intended model in the frontmatter, telling
  every skill to install its packages, and the old 200-line limit. See
  "Conflicts between the video and the docs".

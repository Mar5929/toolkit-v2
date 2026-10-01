# Best-practices review: the checklist for skills, rules, hooks, and AGENTS.md

Mike, 2026-09-30: "the reviewers need to go through and check to see ... are
the skills set up based on Claude Code and Codex best practices? ... how to
set up the skills; how to add more detailed references and artifacts; how
you should set up your AGENTS.md file; how you should set up the
.claude/rules files; how to add paths to those rules so they are only
invoked by the agents in different areas ... All this stuff should be
grounded in best practices." And the intent behind it: "I just want to be
able to make decisions and have the coding agent manage everything. I don't
want to have to remember a bunch of things about how this whole harness and
toolkit works."

A separate agent runs this review, with `wording-review.md` and
`overlap-review.md`, on every change to a skill, rule, hook, settings
snippet, or the model's `AGENTS.md`, and once over everything before each
test stage. Every finding cites the official page it rests on, from
`ai-external-knowledge/` (Claude Code, Codex, Agent Skills, Anthropic
engineering) or `dev/research/skill-writing-guide.md`,
`dev/research/rules-best-practices.md`, and
`dev/research/platform-best-practices.md`, which cite those pages. A
finding with no source is dropped.

## The checks

- **P0 Every line is needed** (Mike, 2026-10-01). A skill holds only
  procedures, policies, rules, templates, if-then steps, gotchas (specific
  tool facts), checklists, check-and-fix loops, short output examples,
  facts Claude cannot know, and defaults. For each line ask: would Claude
  get the job wrong without it? If not, delete it. A finding is any table
  or list of owner phrases and what they mean, advice on how to think, an
  explanation of something Claude already knows, a rule repeated in
  another file, or a line added to patch one test run.
- **P1 Skills.** Folder layout, frontmatter, description, `SKILL.md` size
  and order, Gotchas, templates, checklists, and validation steps follow
  the skill-writing guide Parts 2 to 5 and the pages it cites. References
  and assets are one level deep, linked from `SKILL.md`, and say when to
  open them.
- **P2 Rules.** Each `.claude/rules/` file has one topic, a heading, one
  instruction per bullet, and `paths` frontmatter when it is only about
  certain files or folders, so it loads only there
  (`rules-best-practices.md` Part 1; `claude-code/memory.md`). Always-on
  rules stay short. Procedures live in skills, not rules. Codex does not
  read `.claude/rules/` on its own: `AGENTS.md` must list the always-on
  rules for it.
- **P3 AGENTS.md.** Under 200 lines and about 20 KB for the largest setup;
  holds what the agent cannot work out by looking (the map of what goes
  where, when, and why), the startup lines, and the skills list, as the
  Claude Code and Codex pages on project instructions say. No procedure
  that belongs in a skill.
- **P4 Hooks.** Each hook does one job, cannot break a session, and is
  the kind of thing the hook pages say hooks are for: something that must
  happen every time. The Code limit in `dev/GOAL.md` holds.
- **P5 Out of the box.** Each piece uses a built-in feature of Claude Code,
  Codex, Notion, GitHub, or Hindsight before anything the toolkit invents.
  No new script, no custom program.
- **P6 Mike only decides.** Nothing asks Mike to remember how the toolkit
  works: no trigger word he must say, no command he must type, no file he
  must edit, no step he must do in order. If a piece needs him to remember
  something, it is a finding.

## Anti-patterns found before (check each change for them)

- A grid of trigger words, or a fix that only adds a phrase
  (`overlap-review.md`, "Situation, not trigger words").
- Custom code or a growing program where a skill, rule, or hook would do.
- A rule that is really a procedure, or a procedure copied into several
  rules.
- The same text kept by hand in two places instead of one source.
- An always-on file growing past its size limit.
- Something only the agent knows to do that is written nowhere it will
  read at the right moment.
- A check that cannot fail, or a test that passes because it tests nothing.
- A skill that reaches outside the project: another client's org, Mike's
  own settings, real Notion pages, or banks not named for the project.

## How to report and verify

Report each finding with the file and line, the check, the official page
and section it rests on, what is wrong, and the exact fix. A second agent
verifies each one against that page and drops any it cannot confirm.

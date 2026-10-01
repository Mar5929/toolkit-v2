# Baseline review of every skill: wording and overlap (2026-09-30)

> **Nothing was changed yet.** This file only lists what the review found.
> The fixes are applied after the stage 3 live-test run. A reviewer re-reads
> each fix before it is committed. Any change to a skill description, a skill
> name, or a model routing line is followed by the routing test in both hosts
> (Claude Code and Codex).

Mike asked for this review on 2026-09-30 (quoted from
`dev/reviews/wording-review.md`):

> "For any wording that we add within these skills, you need to have a
> reviewer to make sure that it's plain, clear, concise, with no jargon or
> figurative language. There shouldn't be anything that an agent could
> interpret differently every time unless it's intended to be interpreted
> differently every time."

In the same request he asked that the skill descriptions make sense and that
no two skills overlap in a way that could trip up an agent. The checks used
are in `dev/reviews/wording-review.md` (W1 to W8) and
`dev/reviews/overlap-review.md` (O1 to O7).

How this file is laid out:

1. Summary: the counts.
2. Description overlap: which requests could open the wrong skill, and the
   new descriptions that fix it.
3. Wording: every kept wording finding, grouped by skill, with the exact
   replacement.
4. Questions for Mike: every decision only Mike can make, each with a
   recommended answer.
5. Dropped findings: what a verifier threw out, and why.

## 1. Summary

**What was reviewed.** Two reviews ran over every skill, and a second agent
checked each finding and tried to throw it out.

- The **description review** read all 32 Toolkit V2 skill descriptions, the
  routing lines in the model's `AGENTS.md`, and Mike's other machine-wide
  skills and plugins in both Claude Code and Codex. It looked for a request
  Mike could say that two skills both claim.
- The **wording review** read 205 files: every `SKILL.md`, reference,
  template, example, and helper brief in the V2 skills, and the
  `dev/build-shared/` sources they are copied from.

**What was found.**

| Review | Findings checked | Kept | Dropped |
| --- | --- | --- | --- |
| Description overlap | 32 | 29 | 3 |
| Wording | 1,066 | 1,032 | 34 |

Kept overlap findings, by check (one finding can cite more than one check):
O1 shape 2, O2 wording 11, O3 two skills match 12, O4 missing "Not for" line
14, O5 routing lines disagree 5, O6 Codex cut 7, O7 outside skills 10. Of the
29, 22 come with new description texts, and 7 need a routing line, a setting,
or only a note.

Kept wording findings, by the first check each one names:

| Check | What it looks for | Kept |
| --- | --- | --- |
| W1 | Plain words, exact names | 13 |
| W2 | No jargon or undefined labels | 43 |
| W3 | No figures of speech | 132 |
| W4 | One meaning every time | 685 |
| W5 | A judgment call says so, and what to weigh | 25 |
| W6 | No repeats, no stories | 31 |
| W7 | One name for one thing | 95 |
| W8 | Text shown to Mike is plain | 8 |

The dropped wording findings are listed by skill in section 5; the finding
records did not carry a check code for them.

**What matters most.**

- **Codex already cuts every skill description short** in Mike's real setup
  (2.26). In a V2 project it would cut each one to about 90 to 100
  characters, which removes every "Use when" example and every "Not for"
  line. Rewording cannot fix that; two settings lines can (question A13).
- **Outside skills can take over a request**: Claude Code's `update-config`
  (2.2), the old claude-toolkit `project-init` (2.5), the Notion plugin
  (2.6), `llm-council` (2.7), `consolidate-memory` (2.15), and Codex's own
  Notion plugin.
- **Most wording findings are "one meaning" problems (W4)**: two lines that
  disagree, a condition with no rule for the other case, or a pronoun that
  points two ways. They are fixable without Mike, except where noted.

**Questions for Mike.** 111 questions in section 4 cover the 126 findings
only he can decide (13 overlap, 113 wording). Part A (14) and part B (48)
need real answers. Part C (49) only rewords his own text and can be answered
with one "yes to all".

**What happens next.**

1. The stage 3 live-test run finishes first. Nothing here is applied before
   then.
2. Mike answers section 4, part A first.
3. A writer applies each fix from sections 2 and 3. A fix to a shared source
   goes in `dev/build-shared/` and is then copied with
   `node dev/tools/sync-skill-references.mjs`. A fix to Mike's model goes on
   the model branch after his yes, then is imported.
4. A reviewer re-reads every fix before it is committed.
5. Every changed description also changes its row in `dev/SKILL-INDEX.md`,
   then gets the overlap review and the routing test in both hosts.
6. The plugin versions are raised, as `AGENTS.md` ("Versions") says.

## 2. Description overlap

Each finding below names a request Mike could plausibly say, the skills whose
descriptions all match it, why that matters, and the new text. A verifier
tried to refute each one; these are the ones that held. Descriptions are
shown as plain text. In `SKILL.md` they sit in single quotes, so each
apostrophe is doubled there. Character counts are the ones
`dev/tools/check-skills.mjs` measures (it fails at 400 or more).

Several findings change the same description. The text to apply in each such
case is in "2.30 Where two findings change the same description" at the end of
this section. Read that part before applying anything here.

### 2.1 "merge it" after an approved result

- **Request:** "ok looks good merge it", said right after Mike approves
  WI-31's result.
- **Skills:** `work-finish`, `merge-and-clean-up`.
- **Check:** O3, O4, O5; O2 (W3).
- **Why:** Both descriptions claim merging. `work-finish` names "merge" only
  inside brackets, and every `merge-and-clean-up` example starts with
  "merge". If `merge-and-clean-up` opens, it merges and adds one Recent
  History row, but the item never gets its requirements update (stage 14) and
  Mike is never asked about Done. With no remote, `merge-and-clean-up` has
  nothing to do; `work-finish` does the local merge. The verifier found the
  normal flow is partly covered already (`work-check` step 8 opens
  `work-finish`, and right after approval there is usually no pull request
  yet). The harm happens in a new session after `work-finish` has opened the
  pull request. The new texts draw one line: "merge it" for an approved item
  goes to `work-finish`; a pull request the owner names ("merge PR 12"), or
  one `work-finish` asks about, goes to `merge-and-clean-up`. Trade-off:
  `work-finish` drops "pull request" from its brackets to stay under 400.
- **New descriptions:**

~~~text
work-finish (393):
Ships and closes an approved work item (merge, deployment, requirements update) or cancels one, and asks the owner before marking it Done, so nothing merges, deploys, or closes without his yes. Use when the owner cancels an item or says "ship it", "merge it", "close it", or "mark it done". Not for checking whether a build is ready; use work-check. Not for one task; use the work track skill.

merge-and-clean-up (388):
Merges one approved GitHub pull request, then removes only its branches and worktree, after its checks and the merge-safety check pass, so nothing unchecked is merged and no other session's work is removed. Use when work-finish asks, or the owner names a pull request: "merge PR 12", "merge and clean up", "land this pull request". Not for shipping an approved work item; use work-finish.
~~~

- **Routing lines (Mike decides, section 4):** model `AGENTS.md` line 32
  adds "merge it"; line 40 changes. The verifier's line 40 text:

~~~text
Line 32: - "Ship it", "merge it", "close it", "mark it done", "cancel WI-031": `work-finish`.
Line 40: - Merging a pull request, when the owner names it ("merge PR 12") or `work-finish` asks, and removing its branch and worktree: `merge-and-clean-up`.
~~~

- **Follow-ups:** Until line 40 changes, it still points merges at
  `merge-and-clean-up`, so the fix is partial. `merge-and-clean-up` step 7
  could open `work-finish` when the merged pull request belongs to a work
  item. The `work-finish` text here is merged with a wording fix (2.30).

### 2.2 "from now on" and "whenever you" instructions (update-config)

- **Requests:** "whenever you finish a task update the work item and the
  roadmap"; "from now on run the tests whenever you finish".
- **Skills:** `local-memory-save`, `notion-memory-save`, and Claude Code's
  built-in `update-config`.
- **Check:** O7, O4.
- **Why:** `update-config` claims "from now on when X", "each time X", and
  "whenever X", says memory cannot do them, and writes a hook into
  `settings.json`. In the earlier routing test with Mike's own setup it won
  "From now on, run the tests whenever I stop" in 3 of 3 runs
  (`dev/test-runs/skill-routing-final.md`, N4). The V2 rule is the opposite:
  an instruction for how the agent works is a line in
  `.claude/rules/owner-preferences.md`, never a settings hook, and new hook
  code needs Mike's yes. The memory save descriptions never draw that line.
  The prompt-reminder hook adds "never a settings hook" for "from now on",
  but its pattern (`prompt-reminder.mjs` line 15) does not match "whenever
  you" or "each time you". A GitHub + Hindsight project has no memory save
  skill, so there only the routing line helps. Codex has no `update-config`.
  The verifier rewrote the texts so "not settings.json hooks" cannot be read
  as "not hooks and not Current State".
- **New descriptions (these are the texts to use; 2.8 is replaced by them):**

~~~text
local-memory-save (373):
Saves what the owner wants kept: facts, lessons, and project-wide decisions to local memory, changes to Current State, and "from now on" instructions to project rules, never settings.json hooks, so later sessions follow them. Use when the owner says "remember this", "whenever you ...", or "forget that". Not for a handoff; use handoff. Only for projects with local memory.

notion-memory-save (378):
Saves what the owner wants kept: facts, lessons, and project-wide decisions to Notion memory, changes to Current state, and "from now on" instructions to project rules, never settings.json hooks, so later sessions follow them. Use when the owner says "remember this", "whenever you ...", or "forget that". Not for a handoff; use handoff. Only for projects with memory in Notion.
~~~

- **Mike decides (section 4):** (a) widen the prompt-reminder pattern; (b)
  the routing lines. The verifier's tested pattern for
  `assets/hooks/prompt-reminder.mjs` line 15:

~~~text
/\b(?:from now on|going forward|(?:whenever|each time|every time) you (?!(?:'re|are) ready\b|get a chance\b|can\b|have (?:a )?(?:chance|minute|second|sec)\b)|never (?:do|use|run|edit)|always (?:do|use|run|check|ask))/i
~~~

  Routing text for model `AGENTS.md`: on lines 62 and 67, add "whenever you
  ..." and "each time you ..." to the phrase list and replace the second
  sentence with:

~~~text
It puts a fact in memory and a project-wide decision in a memory record. An instruction for how the agent works goes in `.claude/rules/owner-preferences.md`, never in a settings hook or the `update-config` skill.
~~~

  On line 72, add the same two phrases and end its last sentence with ",
  never in a settings hook or the `update-config` skill".
- **Follow-ups:** Each memory save body ("What goes where" row, and the "His
  own words are the approval" list) adds "whenever you ..." and "each time
  you ..." and says "never a settings hook"; that needs a wording review.
  `dev/tests/hooks.test.mjs` (around line 210) needs a test for the new
  phrases. A hook change means Mike must trust the Codex hooks again.

### 2.3 "pull in the latest toolkit changes" and moving the tracker

- **Requests:** "pull in the latest toolkit changes to this project"; "we
  want to move the work items over to notion instead of local folders".
- **Skills:** `project-setup`, `pull-latest`, `local-work-track`.
- **Check:** O3, O4.
- **Why:** `pull-latest` claims "pull the latest changes" and "get the
  latest"; `project-setup` claims "update the toolkit". Nothing separates
  them. `pull-latest` merges the project's own Git remote, which never brings
  new toolkit skills or hooks, and nothing reports that. For the second
  request, `project-setup`'s body handles a changed setup choice, but its
  description says only "checks and updates", while `local-work-track`
  claims "moves". The new texts add a "Not for" line in each direction and
  name "changes where work items or memory are kept" ("are kept", not the
  picture word "live").
- **New descriptions:**

~~~text
project-setup (397; the merged text in 2.30 replaces this):
Sets up, checks, or updates Toolkit V2 in a project, or changes where work items or memory are kept, by copying the model project, skills, and hooks, so projects run the same files. Use when the owner says "set up this project", "initialize this project", "update the toolkit", or "check the setup". Not for a Git pull; use pull-latest. Not for the old claude-toolkit (project-init, project-sync).

pull-latest (366):
Brings the local repository up to date with its remote by fetching and merging, never rebasing or resetting, so no local work or shared history is lost. Use when the owner says "get the latest", "pull the latest changes", "sync with remote", or "update from origin". Not for throwing away local work; use reset-to-remote. Not for a toolkit update; use project-setup.
~~~

- **Follow-ups:** `local-work-track`, `notion-work-track`, and
  `github-work-track` still claim "moves" and never point to
  `project-setup`. Add to each work track `SKILL.md` body: "Moving work
  items to another tracker: the project-setup skill." Add this request to
  the routing test.

### 2.4 "break it into smaller work items"

- **Request:** "this is way to big break it into smaller work items".
- **Skills:** `work-refine`, `work-on`, and the three work track skills.
- **Check:** O3, O4, O6; O2 (W4).
- **Why:** `work-on`'s description says "splitting it when it is too big to
  build at once", almost the request's own words. `work-refine` splits
  during planning (step 8, and `references/roadmap-and-breakdown.md`), but
  its description says only "a roadmap". So while Mike is planning, an agent
  that reads only the descriptions opens `work-on`, which then sends the item
  back to `work-refine`: a wasted step, and it can pull the agent out of an
  interview. The dividing line: before the requirements are approved,
  `work-refine` splits; after that, `work-on` splits for the build. Both new
  texts put that line in their first 90 characters, so a Codex cut keeps it.
  The track skills keep a split the owner states directly ("put WI-7 under
  WI-3"). The verifier put "roadmap" back into `work-refine` so
  `publish-docs` is not left as the only description that says "roadmap",
  and changed "documents" to "files" to fit.
- **New descriptions:**

~~~text
work-refine (398; see 2.30 for the choice between this and 2.11):
Refines a work item from a rough idea, notes, or files into approved requirements, a roadmap, and sub-items, one question at a time, saving each answer at once, so a new session resumes it. Use when the owner says "help me plan this", "here are the meeting notes", "grill me", or "what am I missing", or changes a requirement. Not for design; use solution-design. Not for a playback; use braindump.

work-on (399; replaced by the text in 2.12):
Builds a work item from its approved requirements: starts or resumes it, splits it when too big to build, or logs a new request, recording each step in the item, so it shows what is built and what is next. Use when the owner says "build it", "keep going", "pick up WI-031", or "add it to the backlog". Not for planning requirements; use work-refine. Not for work handed to agents; use work-delegate.
~~~

- **Follow-ups:** `work-refine` step 8 ("too large for one item") and
  `work-on` steps 5 and 10 should state the same before-and-after-approval
  line; that is a wording review item.

### 2.5 "initialize this project" and the older claude-toolkit

- **Requests:** "can you initialize this project" or "set up this project"
  in a new, empty folder; "update the toolkit" or "check the setup" in an
  older claude-toolkit project such as Anchor or DragonFly.
- **Skills:** `project-setup`, `project-init:project-init`,
  `project-init:project-sync`, `second-brain:knowledge-setup`, and Claude
  Code's built-in `init`.
- **Check:** O7, O1.
- **Why:** A V2 project turns the old claude-toolkit plugins off, but a new
  folder is not a V2 project yet. `project-init@claude-toolkit` is on for
  every folder in both hosts, and its `project-init` skill quotes "initialize
  this project" word for word. `second-brain:knowledge-setup` (also on in
  both hosts) claims "complete project setup". Claude Code's built-in `init`
  matches "initialize" and would rewrite `CLAUDE.md`, which in a V2 project
  holds only `@AGENTS.md`. In an older claude-toolkit project,
  `project-setup` quotes "update the toolkit" and "check the setup" word for
  word. The verifier found that case is less risky than first stated:
  `project-setup`'s interview notices an older claude-toolkit setup and waits
  for Mike's yes, so the cost is a wasted turn, not damaged files. Today
  `toolkit@toolkit-v2` is off in both hosts until `claude/v2-build` is
  merged, so only `project-init` is listed now. None of this was tested live:
  the test home had no claude-toolkit plugins.
- **New description:**

~~~text
project-setup (394; the merged text in 2.30 replaces this):
Sets up Toolkit V2 in a new project, or checks, updates, or changes a V2 setup, by copying the model project, skills, hooks, and settings, so every project runs the same files. Use when the owner says "set up this project", "initialize this project", "update the toolkit", or "check the setup". Not for a Git pull; use pull-latest. Not for the older claude-toolkit (project-init, project-sync).
~~~

- **Mike decides (section 4):** once V2 is his everyday setup, switch off
  `project-init`, `second-brain`, and the other claude-toolkit plugins for
  every folder in both hosts. Until then, the safe way to start a new
  project is `/project-setup` (`$project-setup` in Codex), or "set up
  Toolkit V2 here".
- **Follow-up:** In `project-setup` "Pick the path": when he says "update the
  toolkit" or "check the setup", "Toolkit settings" is not filled, and older
  claude-toolkit files are present, ask whether he means the older toolkit
  (`project-sync`) or moving to Toolkit V2, before starting the new-project
  interview. Run the routing test in both hosts with `project-init` and
  `second-brain` switched on.

### 2.6 A Notion page link with "build this" or "plan this"

- **Requests:** "build this <WI-31's Notion link>"; "plan this <Notion page
  link>"; "add a task in notion for wi 31 set up the categories"; "search
  Notion for the persona decision".
- **Skills:** `work-on`, `work-refine`, `notion-work-track`,
  `notion-work-find`, `notion-memory-find`, and the Notion plugin's
  `Notion:tasks:build`, `Notion:tasks:plan`, `Notion:create-task`,
  `Notion:find`, `Notion:search`.
- **Check:** O7.
- **Why:** The Notion plugin loads in every Claude Code session signed in to
  Mike's claude.ai account, and V2's plugins-off list does not turn it off.
  `Notion:tasks:build` is described as "Build a task from a Notion page URL",
  almost the same words as the request. If a Notion command runs, the work
  skips the V2 item format, stages, approvals, the Questions and Answers
  rows, and the item's Current state. `Notion:tasks:build` also sets the
  Notion status to Done when it finishes, without asking Mike and without
  `work-check`. The shared skills may not name one tracker, so their
  descriptions cannot fix this. Correction from the verifier: Codex also has
  a Notion plugin (`notion` 0.1.8) with `notion-spec-to-implementation` and
  `notion-knowledge-capture`, so the same problem exists in Codex under other
  names; add those pairs to the routing test.
- **New descriptions:** none.
- **Mike decides (section 4):** add these routing lines to the model
  `AGENTS.md`, or turn the Notion plugin off in Notion projects.

~~~text
In the <!-- if tracker=notion --> block, after line 48:
- A Notion plugin's own commands and skills (names starting `Notion:` in Claude Code, such as `Notion:tasks:build`, `Notion:tasks:plan`, `Notion:create-task`, `Notion:find`, and `Notion:search`, or `notion:` in Codex) never replace this project's skills for its work items, even when the message holds a Notion page link: build with `work-on`, plan with `work-refine`, design with `solution-design`, create or change an item, phase, or task with `notion-work-track`, and look one up with `notion-work-find`. (`Notion:tasks:build` marks the item Done without the owner's yes.)

In the <!-- if memory=notion --> block, after line 68:
- Searching Notion for something this project recorded or decided: `notion-memory-find`; saving a memory: `notion-memory-save`. A Notion plugin's own search, find, or capture commands and skills (`Notion:search` and `Notion:find` in Claude Code, `notion:notion-knowledge-capture` in Codex) never replace these two skills: they reach the whole Notion workspace, not only this project's memory.
~~~

  The other option: add `"Notion@synced": false` to
  `assets/settings/enabled-plugins-off.json`. The exact key is not confirmed
  yet, and how to turn it off per project in Codex is not confirmed either.

### 2.7 "what would you do" (llm-council)

- **Requests:** "should we merge some of the 15 personas or just move them
  all over what would you do"; "we keep doing this turn it into a skill".
- **Skills:** `work-refine`, `work-status`, `solution-design`,
  `sf-architect-solutioning`, `llm-council`, `skill-creator`, and the memory
  refine skills.
- **Check:** O7.
- **Why:** `llm-council` is Mike's own skill in `~/.claude/skills`, so it
  loads in every Claude Code project (not in Codex). It lists "what would you
  do" and "should I X or Y" as triggers. No V2 description claims a choice
  Mike is weighing. If `llm-council` runs, five helper agents give a
  recommendation without first searching memory or reading the item's
  sources, and the question never becomes a Questions and Answers row. His
  final pick is still saved later (the "let's go with" routing line). Model
  line 76 covers only "method skills from other plugins", and `llm-council`
  is a personal skill, so the line's words do not cover it. The
  `skill-creator` half was dropped: no V2 description claims "turn it into a
  skill", so `skill-creator` has no V2 skill to run inside.
- **New descriptions:** none.
- **Mike decides (section 4):** model `AGENTS.md` line 76 becomes:

~~~text
- Open the matching skill or rule when the task needs its procedure. Method skills from other plugins and the owner's own skills (brainstorming, plans, debugging, llm-council, impeccable) may run inside these skills, never instead of them. When the owner weighs a choice about a work item, answer it inside the skill already in use for that item; if none is, a choice about what the item must do goes to `work-refine`, and a design or a screen for it goes to `solution-design`. Run llm-council only when the owner names it.
~~~

  If 2.14 is dropped, remove "impeccable". The last sentence is Mike's
  choice: in V2 projects it overrides his own `llm-council` triggers such as
  "pressure-test this". In Codex this line changes nothing.

### 2.8 "save where we are" at the end of the day

- **Request:** "ok im done for today save where we are so i can pick it up
  tomorrow".
- **Skills:** `handoff`, `local-memory-save`, `notion-memory-save`.
- **Check:** O3, O4.
- **Why:** The memory save descriptions say they keep Current State, and the
  request says "save". `handoff` does this job: it updates the work item and
  Current State, then writes the next-session prompt. But all of its phrases
  are about clearing context, so "done for today" matches it only by meaning.
  Neither description names the other. If memory save opens, the work item's
  Current state and the next-session prompt are not written. "I'm done for
  today" already picked the wrong skill in routing round 1. The fix:
  `handoff` claims "the owner ends the session" (this matches Mike's rule
  `.claude/rules/session-handoff.md`), and both memory save skills add "Not
  for a handoff; use handoff."
- **New descriptions:**

~~~text
handoff (395; the merged text in 2.30 replaces this):
Updates the active work item and Current State, offers anything worth keeping to memory, then writes a checked, self-contained prompt for a new session, or checks a pasted one, so nothing is lost when context clears. Use when the owner ends the session or says "write a handoff", "I'm clearing context", "start a new session", or "check this handoff". Not for a recap alone; use session-summary.

local-memory-save (390; replaced by 2.2):
Saves what the owner wants kept in local memory: facts and lessons to concept files, project-wide decisions to decision records, "from now on" instructions to project rules (not settings.json hooks), and Current State, so later sessions follow them. Use when he says "remember this", "whenever you ...", or "forget that". Not for a handoff; use handoff. Only for projects with local memory.

notion-memory-save (397; replaced by 2.2):
Saves what the owner wants kept in Notion memory: facts and lessons to concept records, project-wide decisions to decision records, "from now on" instructions to project rules (not settings.json hooks), and Current state, so later sessions follow them. Use when he says "remember this", "whenever you ...", or "forget that". Not for a handoff; use handoff. Only for projects with memory in Notion.
~~~

### 2.9 "what's next" and "what's waiting on me"

- **Requests:** "ok so whats next on this project"; "whats waiting on me"
  (voice-to-text, no punctuation).
- **Skills:** `local-work-find`, `notion-work-find`, `github-work-find`,
  `work-status`.
- **Check:** O3, O4, O5, O6; O2 (W2, W3).
- **Why:** `work-status` claims "where are we", "what's next", and "what do
  you need from me", and routing line 33 agrees. But each find description
  lists "what waits on the owner" and "what is next" among its lookups and
  invites the owner directly. Its only divider, "Not for the owner's status
  report", uses a label Mike never says and comes last, which is the part
  Codex cuts first. If a find skill opens, the agent lists items but never
  takes Mike through the waiting decisions or saves his answers. This is
  shown by the text; no run has tested these two phrases yet. The new texts
  drop the two jobs `work-status` claims, say who calls the find skill (a
  work skill, or the owner asking to see or find an item), put Mike's
  phrases in the "Not for" clause, and move it ahead of "Only for". They also
  replace the picture words "answers rest on".
- **New descriptions:**

~~~text
local-work-find (398):
Looks up work items in local work-items/ folders: one item, the board, a parent's tree, a search, and items moved by hand, so answers come from the files as they are. Use when a work skill needs a lookup, or the owner asks to see or find an item, such as "show me WI-031" or "what's under WI-012". Not for "where are we" or "what's next"; use work-status. Only for projects that track work locally.

notion-work-find (389):
Looks up work items in Notion: one item, the board, a parent's tree of phases, sub-items, and tasks, and a search, so answers come from the tracker as it is. Use when a work skill needs a lookup, or the owner asks to see or find an item, such as "show me WI-31" or "what's under WI-20". Not for "where are we" or "what's next"; use work-status. Only for projects that track work in Notion.

github-work-find (398):
Looks up work items kept as GitHub issues with gh: one issue, the board, a parent's tree of sub-issues, and a search, so answers come from the issues as they are. Use when a work skill needs a lookup, or the owner asks to see or find an issue, such as "show me #12" or "what's under #12". Not for "where are we" or "what's next"; use work-status. Only for projects that track work in GitHub Issues.
~~~

- **Follow-ups:** Change the lookup table row "Where things stand (for
  work-status, or a direct question)" to: Where things stand (for
  work-status), or "show me the board" (local-work-find `SKILL.md` line 28,
  notion-work-find line 29, github-work-find line 30). Add "what's next" to
  the intro paragraph of each find body (local lines 14-16, Notion 13-15,
  GitHub 15-17). Update `dev/SKILL-INDEX.md` rows 73, 82, and 89.

### 2.10 "mark task 3 done" and "we decided"

- **Requests:** "mark task 3 done"; "I made the sandbox mark it done"; "we
  decided to merge the personas into six".
- **Skills:** the three work track skills, `work-finish`, the memory save
  skills, `todoist-cli`.
- **Check:** O5, O4, O6, O7; O2 (W3).
- **Why:** Model routing line 59 sends "mark task 3 done" to the work track
  skill, and line 60 sends "we decided" to the work track skill first, as a
  Questions and Answers row. No track description holds either phrase.
  `work-finish` quotes "mark it done". Each track skill's "Not for marking an
  item Done" comes after "Only for projects ...", so a Codex cut removes it
  first. For "we decided", only the memory save descriptions mention
  decisions. In Claude Code, `todoist-cli` also claims completing tasks. The
  verifier noted these are risks from the text, not something a test showed.
  The new texts quote "mark task 3 done", say "an item or one task in it",
  name decisions as Questions and Answers rows, put "Not for marking a whole
  item Done" before "Only for", and replace the picture word "lands" with "is
  saved".
- **New descriptions:**

~~~text
local-work-track (398):
Creates and changes work items in work-items/ folders: fields, stage, phases, tasks, Questions and Answers rows (decisions included), sub-items, sources, and moves, so every change is saved the same way. Use when changing an item or one task in it, such as "add a task to phase 2" or "mark task 3 done". Not for marking a whole item Done; use work-finish. Only for projects that track work locally.

notion-work-track (394):
Creates and changes work items in Notion: fields, stage, phases, tasks, Questions and Answers rows (decisions included), sub-items, comments, and attachments, so every change is saved the same way. Use when changing an item or one task in it, such as "add a task to phase 2" or "mark task 3 done". Not for marking a whole item Done; use work-finish. Only for projects that track work in Notion.

github-work-track (399):
Creates and changes work items in GitHub Issues: labels, phases, tasks, Questions and Answers rows (decisions included), sub-issues, and the design comment, so every change is saved the same way. Use when changing an item or one task in it, such as "add a task to phase 2" or "mark task 3 done". Not for marking a whole item Done; use work-finish. Only for projects that track work in GitHub Issues.
~~~

- **Notes:** `github-work-track` has 1 character to spare. Outside this
  finding, "mark phase 2 done" is claimed clearly only by routing line 59.

### 2.11 "update the roadmap"

- **Request:** "update the roadmap the migration is phase 2 now".
- **Skills:** `publish-docs`, `work-refine`, `work-on`, and the three work
  track skills.
- **Check:** O3; O2 (W7).
- **Why:** "Roadmap" names two things: the project file `PROJECT-ROADMAP.md`,
  and the Roadmap section inside each work item. `publish-docs` means the
  file; `work-refine` and `work-on` mean the item's section; the track skills
  say "phases". From the descriptions alone an agent cannot tell which Mike
  means, and three or four skills match. The new texts: `publish-docs` names
  `PROJECT-ROADMAP.md` and says "a document edit is agreed" (not "ready",
  which reads two ways); `work-on` no longer names a roadmap. The words "the
  roadmap" can still mean either one; the model's voice-to-text line tells
  the agent to ask one short question. The one name for two things comes
  from Mike's model; raise it with him only if the test runs show confusion.
- **New descriptions:**

~~~text
publish-docs (399):
Commits agreed edits to project documents (requirements/, system guide, PROJECT-ROADMAP.md, PROJECT.md, READMEs) to the default branch, so no pull request is needed and no other session is touched. Use when a document edit is agreed or the owner says "publish the docs" or "save the docs to main". Not for a work item's requirements; use work-refine. Not for code, rules, or skills; use work-finish.

work-refine (399; see 2.30 for the choice between this and 2.4):
Refines a work item from a rough idea, notes, or documents into approved requirements, phases, and sub-items, one question at a time, saving each answer at once, so a new session resumes it. Use when the owner says "help me plan this", "here are the meeting notes", "grill me", or "what am I missing", or changes a requirement. Not for design; use solution-design. Not for a playback; use braindump.

work-on (399; replaced by the text in 2.12):
Builds a work item from its approved requirements: starts or resumes it, splits it when too big to build, or logs a new request, recording each step in the item, so it shows what is built and what is next. Use when the owner says "build it", "keep going", "pick up WI-031", or "add it to the backlog". Not for planning requirements; use work-refine. Not for work handed to agents; use work-delegate.
~~~

- **Follow-up:** Add "help me plan the roadmap for this epic" to the routing
  test.

### 2.12 "just add it to the backlog"

- **Request:** "oh new idea dark mode, not now tho just add it to the
  backlog".
- **Skills:** `work-on`, `work-refine`, and the three work track skills.
- **Check:** O3.
- **Why:** `work-refine`'s first words claim "a rough idea", and the track
  skills claim creating items. Routing line 27 and `work-on`'s body both send
  this to `work-on` (its "Log only" row logs the item at `01-discovery` and
  stops), but `work-on`'s description says nothing about logging. If
  `work-refine` opens, it starts an interview Mike did not ask for, and the
  item shows up in `work-status` as waiting on him. If a track skill opens,
  little harm is done: it makes the same item, but it does not check for an
  item that already covers the request. The verifier kept "start the next
  item" so "what's next" stays with `work-status`, added "for later", and
  dropped "pick up WI-031" ("starts or resumes it" still covers it).
- **New description (this is the `work-on` text to use for 2.4, 2.11, 2.12,
  and 2.18):**

~~~text
work-on (399):
Builds a work item from its approved requirements: starts or resumes it, splits it when too big, or logs a new request for later, recording each step, so the item shows what is built and what is next. Use when the owner says "build it", "keep going", "start the next item", or "add it to the backlog". Not for planning requirements; use work-refine. Not for work handed to agents; use work-delegate.
~~~

- **Follow-ups:** Add a "work-on and work-refine: log for later, or plan
  now" pair to `dev/SKILL-INDEX.md` section 8. In a Notion project,
  `Notion:create-task` could also match; add this request to the routing test
  in both hosts. Routing line 27 gets "add it to the backlog" in 2.25.

### 2.13 "give me some options" during a requirements interview

- **Request:** "i dont know give me some options", said while answering Q-04
  in a requirements interview.
- **Skills:** `solution-design`, `work-refine`.
- **Check:** O3, O5.
- **Why:** `solution-design` claims the bare phrase "give me options", and
  routing line 29 does too. During `work-refine`, Mike often asks for options
  on one question. In Claude Code the running `work-refine` usually keeps the
  turn. Codex does not carry a skill to the next turn, so there the phrase
  can send him to `solution-design` before his requirements are approved.
  The fix makes the phrase "give me design options". No other description
  claims plain "options".
- **New description (replaced by 2.14, which includes this change):**

~~~text
solution-design (394):
Writes design options, screens and flows included, for building a work item with approved requirements, recommends one, and records the owner's choice in the item and its design, so the build follows his choice. Use when an item's requirements are approved or the owner says "design this", "how should we build it", or "give me design options". Not for what the result must do; use work-refine.
~~~

- **Mike decides (section 4):** model `AGENTS.md` line 29:

~~~text
- "Design this", "how should we build it", "give me design options": `solution-design`.
~~~

- **Follow-ups:** `work-refine` `SKILL.md` line 47 says '"Give me options
  first" is not a requirements approval: go to `solution-design`', and
  `references/interview.md` section 6 has no "give me some options" row. Add
  a section 6 row: when he asks for options on one question, give two or
  three answers to that question with a recommendation and keep the row Open
  until he picks. Narrow line 47 to design options asked for before approval.
  In Codex, bare answers during an interview ("yes", "12") match no
  description; watch this in the Codex runs.

### 2.14 "design this screen" (impeccable)

- **Requests:** "design the add transaction screen"; "design this screen" (in
  the iOS project).
- **Skills:** `solution-design`, `impeccable`.
- **Check:** O7, O6.
- **Why:** `impeccable` is on in both hosts, and its description begins "Use
  when the user wants to design, redesign ... a frontend interface".
  `solution-design` mentions screens only in the middle of its first
  sentence. If `impeccable` runs instead, no design options are recorded and
  Mike's choice is not saved. The verifier said "likely winner: impeccable"
  goes too far, because routing line 29 sends "Design this" to
  `solution-design` and stays in context; the real risk is `impeccable`
  running alongside or instead when the request names a screen. Test M20
  will show which. The new text moves "including screens and flows" to
  character 33 and adds the phrase "design this screen".
- **New description (this is the `solution-design` text to use):**

~~~text
solution-design (398):
Writes design options, including screens and flows, for a work item with approved requirements, recommends one, and records the owner's choice in the item and its design, so the build follows his choice. Use when requirements are approved or the owner says "design this", "design this screen", "how should we build it", or "give me design options". Not for what the result must do; use work-refine.
~~~

- **Mike decides (section 4):** the line 76 change in 2.7, which names
  `impeccable` as a skill that runs inside `solution-design`.
- **Separate issue:** the old `session-skills:solution-design` and the old
  `sf-architect-solutioning` plugin are still on in Claude Code on this Mac
  and also claim "design this". `session-skills` must stay off in V2 projects
  (test M19). If 2.13's phrase change is dropped, put back "give me options".

### 2.15 "clean up memory" (consolidate-memory)

- **Requests:** "clean up memory its getting messy" (in the GitHub +
  Hindsight project); "consolidate memory" or "merge the duplicate
  memories" (in a local memory project).
- **Skills:** `local-memory-refine`, `notion-memory-refine`,
  `anthropic-skills:consolidate-memory`.
- **Check:** O7.
- **Why:** `consolidate-memory` ("merge duplicates, fix stale facts, prune
  the index") is listed in Mike's Claude Code sessions, and turning auto
  memory off does not hide it. A Hindsight project has no memory skills
  (Mike's decision), so there it is the only description that matches. With
  auto memory off, it has to guess a folder, and the project's `memory/` is
  the obvious guess. In a local memory project it would hand-edit
  `memory/MEMORY.md`, which the session-start hook rebuilds, and it would
  skip the refine skill's rules for superseding, retiring, links, and
  Current State. In a Hindsight project it would edit
  `memory/CURRENT_STATE.md` without its line limits. Codex does not have it.
  "Likely wins" is not proven: it "could win". Tests M12, M13, and M21 will
  measure it. No description change can fix the Hindsight case.
- **New descriptions:** none.
- **Mike decides (section 4):** add one line right after the `<!-- endif
  -->` that closes the Hindsight block in the model `AGENTS.md` (line 75),
  before line 76:

~~~text
- Never use `anthropic-skills:consolidate-memory` in this project. It edits Claude Code's own memory folder, which this project turns off. For any memory clean-up, follow the "Refine memory" line above.
~~~

### 2.16 "is WI-31 ready to go to UAT"

- **Request:** "is wi 31 ready to go to uat" (Salesforce project).
- **Skills:** `work-check`, `sf-deploy-check`.
- **Check:** O3, O4.
- **Why:** `work-check` claims "is it ready". `sf-deploy-check` claims any
  deploy to UAT, and its first sentence also has the word "ready". Neither
  names the other. The V2 order is: `work-check` tests the item, Mike
  approves it, then `work-finish` runs `sf-deploy-check` at stage 13. If
  `sf-deploy-check` opens first, it reports only that nothing extra would
  ship, and the acceptance check is skipped. `work-check` is shared and
  cannot name a Salesforce-only skill, so the line goes in
  `sf-deploy-check`, which is Mike's model skill. The verifier dropped
  "ready" from the first sentence (so a Codex cut cannot bring the overlap
  back) and used Mike's own word in the "Not for" line.
- **New description (Mike decides; see 2.30 for the three versions):**

~~~text
sf-deploy-check (390):
Finds components or edits that a Salesforce deploy would ship beyond the intended change, so no unfinished or unintended work reaches a shared org. Use when a deploy to a shared org (UAT, full copy, staging, or production) is about to run, or before the owner gets a deploy command. Not for checking whether a work item is ready; use work-check. Not for running the deploy; use work-finish.
~~~

- **Gaps:** Neither the old nor the new text quotes Mike's own phrases (O1).
  Adding one like "deploy it to UAT" would overlap `work-finish`. Optional
  (Mike's call): model routing line 82 could say "When a deploy to a shared
  org is about to run, or before the owner gets a deploy command". Update
  `dev/SKILL-INDEX.md` line 135 with the description.

### 2.17 A brain dump that asks for a plan

- **Request:** "ok here's a brain dump on the new intake form [long dictated
  idea] can you help me plan this out".
- **Skills:** `braindump`, `work-refine`.
- **Check:** O4; O2 (W4).
- **Why:** `braindump` claims "here's a brain dump", and `work-refine` claims
  "help me plan this". `braindump`'s "Not for planning a work item with him"
  reads two ways. Its body (lines 44-45) says play it back first, but routing
  line 28 sends this to `work-refine`. The routing lines are Mike's text, and
  `work-refine`'s first question ("So the goal is ...?") already confirms
  what he meant, so follow them. The verifier made the clause depend only on
  what he asked for: he asks only for a plan, `work-refine`; he asks for a
  playback, with or without a plan, `braindump`; a plain brain dump,
  `braindump`.
- **New description:**

~~~text
braindump (397):
Plays back a loose brain dump in very simple words and waits for the owner's yes before any work starts, so nothing is planned, built, or saved on a misunderstanding. Use when he wants his brain dump checked first, such as "here's a brain dump", "play that back", "tell me what you heard", or "make sure you understood before you start". Not for a brain dump he asks only to plan; use work-refine.
~~~

- **Same commit:** in `braindump` `SKILL.md` lines 44-45, replace "A brain
  dump that also asks for a plan gets the playback first, then `work-refine`
  after his yes." with:

~~~text
A brain dump that asks only for a plan, with no playback asked for, is `work-refine`'s job; its first question confirms the goal.
~~~

  Add both requests to the routing test: this one (expect `work-refine`),
  and "play it back, then help me plan it" (expect `braindump`).

### 2.18 "keep going, take it from here"

- **Request:** "ok keep going take it from here".
- **Skills:** `work-on`, `work-delegate`.
- **Check:** O4.
- **Why:** `work-on` claims "keep going"; `work-delegate` claims "take it
  from here". Only `work-delegate` draws a line, and `work-on` says nothing
  about `work-delegate`, so an agent that matches "keep going" first has no
  reason to stop. Every source says this request belongs to `work-delegate`:
  `work-on`'s own routing table, model line 30, and `work-delegate` step 2.
  The new `work-on` text adds "Not for work handed to agents; use
  work-delegate." Leave `work-delegate`'s "Not for" clause as it is.
- **New description:** use the `work-on` text in 2.12, which carries this
  clause.
- **Leftover risks:** `work-on` runs builder helpers itself, so "work handed
  to agents" must be read as a hand-over by the owner. The clause is last, so
  a Codex cut removes it first. At 399 characters, any added word breaks the
  limit.

### 2.19 "that memory about the old vendor is out of date"

- **Request:** "that memory about the old vendor is out of date clean it up".
- **Skills:** `local-memory-refine`, `local-memory-save`,
  `notion-memory-refine`, `notion-memory-save`.
- **Check:** O4, O6.
- **Why:** The save skills handle every correction and "forget that", but
  their descriptions list only "remember this", "from now on", and "forget
  that". The refine skills claim "clean up memory" and retiring stale
  files. So the current text leans toward refine, which would list every
  file and plan a whole review nobody asked for. The new refine texts say
  "Reviews all ..." in their first words and add "Not for fixing one memory;
  use <save skill>." before "Only for". The verifier changed "one named
  memory" to "fixing one memory", because "named" reads two ways.
- **New descriptions:**

~~~text
local-memory-refine (389):
Reviews all this project's local memory: merges duplicates, retires stale files, fixes work item links, prunes Current State, and proposes proven lessons as rules or skills, so memory stays small and true. Use when the owner says "refine memory" or "clean up memory", or the session-start hook says so. Not for fixing one memory; use local-memory-save. Only for projects with local memory.

notion-memory-refine (397):
Reviews all this project's Notion memory: merges duplicates, retires stale records, fixes work item links, prunes Current state, and proposes proven lessons as rules or skills, so memory stays small and true. Use when the owner says "refine memory" or "clean up memory", or the session-start hook says so. Not for fixing one memory; use notion-memory-save. Only for projects with memory in Notion.
~~~

- **Optional:** add the local body's sentence to `notion-memory-refine`
  `SKILL.md`: "Single saves and corrections go through notion-memory-save."
  It needs its own wording review.

### 2.20 "go through the open questions on WI-31"

- **Request:** "lets go through the open questions on wi 31".
- **Skills:** `work-refine`, `work-status`.
- **Check:** O3, O4; O2 (W3).
- **Why:** `work-status` "takes him through each waiting question ... one at
  a time". `work-refine` asks "one question at a time" and resumes at the
  first open question. Both match, and neither names the other. For an item
  still in refinement, `work-refine` is right: it also asks the next new
  question, names gotchas, and asks for approval. The verifier narrowed the
  new line to "one item's requirements questions", because `work-status`'s
  own example answers a requirements question during a project-wide "what do
  you need from me". The text also drops "one at a time" (which it shared
  with `work-refine`), "memory proposal", and "with a recommendation" (the
  body still does both), and replaces "so waiting work moves again".
- **New description (includes the wording fix to line 3):**

~~~text
work-status (396):
Reports where the project's work stands (in progress, waiting on the owner, next), then takes him through each waiting question and approval, saving each answer at once, so waiting work can continue. Use when the owner asks "where are we", "what do you need from me", or "what's next". Not for a recap of this chat; use session-summary. Not for one item's requirements questions; use work-refine.
~~~

- **Follow-ups:** update `dev/SKILL-INDEX.md` row 53; make `work-status`'s
  "Not this skill" line match; add "work-status and work-refine" to the pairs
  in `dev/SKILL-INDEX.md` section 8. Separate O7 item:
  `session-skills:requirements-helper` ("resume a requirements interview")
  is still listed on this Mac.

### 2.21 "here's the handoff from the other chat, check it"

- **Request:** "heres the handoff from the other chat check it".
- **Skills:** `work-check`, `handoff`.
- **Check:** O4, O3.
- **Why:** `handoff` claims "checks a pasted one" and "check this handoff";
  `work-check` claims "check it". `dev/SKILL-INDEX.md` section 8 says a
  pasted handoff goes to `handoff`, never `work-check`, but `work-check` has
  no "Not for" line to keep that promise. Little is at stake, because the
  pasted prompt makes `handoff` the likely pick. The verifier kept "closing"
  in the `work-finish` clause (it matches `work-finish`'s first words) and
  used Mike's word "handoff".
- **New description:**

~~~text
work-check (391):
Tests a finished work item against every requirement's acceptance check with an independent checker agent, records the result, and asks the owner to approve it, so nothing reaches him untested. Use when a work item's build is done, or the owner asks "check it", "is it ready", "does it work", or "test it". Not for a pasted handoff; use handoff. Not for shipping or closing; use work-finish.
~~~

- **Follow-ups:** change `dev/SKILL-INDEX.md` line 51 to match; run routing
  tests R18 and R27 again in both hosts.

### 2.22 "what did we decide earlier" in the same chat

- **Requests:** "wait what did we decide earlier about the categories" (same
  chat); "what do you still need from me".
- **Skills:** `local-memory-find`, `notion-memory-find`, `session-summary`,
  `work-status`.
- **Check:** O3, O4, O6; O2 (W3).
- **Verdict:** The overlap claim did not hold: routing rounds 1 to 3 got all
  three related requests right every time. The finding's removal of "what
  did we do today" was reversed, because it is routing test phrase #35 and
  the only description text that matches it. What was kept: plain words
  ("where each one landed" became "what was done for each"; "answers rest
  on" became "each answer comes from"), "which still need him" (points at
  this chat's own requests), and "Not for planning or design" moved ahead of
  "Only for" in both memory find skills.
- **New descriptions:**

~~~text
session-summary (385; the merged text in 2.30 replaces this):
Recaps this chat as a table of the owner's requests, what was done for each, and which still need him, so he sees what is done and what is open. Use when he asks what happened in this chat, for example "recap this chat", "what did I ask for", "what did we do today", or "summarize this session". Not for where the project's work stands; use work-status. Not for a handoff; use handoff.

local-memory-find (385):
Searches this project's local memory, rules, requirements, and the memories linked to a work item, reads each file whole, and cites every source, so each answer comes from what was agreed. Use when the owner asks "what did we decide", "why did we", "do we know", or "search my notes". Not for planning or design; use work-refine or solution-design. Only for projects with local memory.

notion-memory-find (364):
Searches this project's Notion memory, the Current state page, the glossary, and every memory linked to a work item, and cites each source, so each answer comes from what was agreed. Use when the owner asks "what did we decide", "do we know", or "why did we". Not for planning or design; use work-refine or solution-design. Only for projects with memory in Notion.
~~~

- **Note:** `check-skills.mjs` line 179 would fail a clause "; use the memory
  find skill", and a Hindsight project has no memory find skill, so
  `session-summary` gets no clause pointing at memory find. If "search my
  notes" (2.23) is not applied, `local-memory-find` reads '... asks "what
  did we decide", "why did we", or "do we know". ...' (366).

### 2.23 "search my notes" (Obsidian)

- **Requests:** "search my notes for the billing decision"; "what do my notes
  say about SSO".
- **Skills:** `local-memory-find`, `obsidian:obsidian-cli`, `graphify`.
- **Check:** O7; O2 (W3).
- **Why:** The whole project folder opens as an Obsidian vault.
  `obsidian-cli` is on for every folder in Mike's Claude Code and says
  "manage notes, search vault content", almost the request's words.
  `local-memory-find` never says "notes". If `obsidian-cli` runs, the search
  skips the project rules and the work item decision rows, and cites
  nothing. `graphify` is weak here: V2 projects never create `graphify-out/`.
  Codex has neither competitor. The earlier test (3 of 3 to memory find) was
  in a folder that was not a vault, so it does not settle this.
- **New description:** the `local-memory-find` text in 2.22 (it quotes
  "search my notes").
- **Follow-ups:** run the routing test in a project that has an `.obsidian/`
  folder, with both requests. Add `obsidian-cli` as a neighbor of the memory
  find skill in `dev/SKILL-INDEX.md` section 8.

### 2.24 The three Salesforce skill descriptions

- **Requests:** "is this safe to deploy to UAT"; "I renamed the Account
  trigger"; "load this file into production".
- **Skills:** `sf-deploy-check`, `sf-component-tracker`, `sf-data-change`,
  `work-finish`, `work-on`.
- **Check:** O1; O2 (W3, W4).
- **Why:** The three Salesforce skills come from Mike's model. None has the
  ", so ..." clause that says why, so they miss the O1 shape, and
  `check-skills.mjs` warns on all three. Texts that add the clause already
  wait for Mike in `dev/model-changes.md` ("Salesforce skill descriptions:
  what, why, when"); these replace that proposal. Only the first request is
  a real overlap (with `work-check`); the other two already reach the right
  skill first. "Hitch-hikers" is Mike's own term (the body uses it 5 times),
  so dropping it from the description is his call. The verifier changed
  "Not for whether a work item passes its tests" to "Not for testing a work
  item" (in a Salesforce deploy, "its tests" can also mean Apex tests), and
  "reply" to "response" to match the skill body.
- **New descriptions (Mike decides; see 2.30 for the versions of each):**

~~~text
sf-deploy-check (380):
Finds components or pending edits that would ship with a Salesforce deploy before their feature is ready, so only the intended changes reach a shared org. Use when any deploy to a shared org (UAT, full copy, staging, or production) is about to run, including a deploy command for the owner. Not for testing a work item; use work-check. Not for running the deploy; use work-finish.

sf-component-tracker (395):
Keeps the component tracker CSV, the master and per-work-item package.xml files, destructiveChanges.xml, and manual steps current in the same response as each change, so each deploy ships exactly the components that are ready. Use first, before work-on, when Salesforce metadata under force-app/ is added, changed, renamed, or deleted, a deploy result comes back, or a deploy needs manual steps.

sf-data-change (348):
Builds the owner's package for a Salesforce production data change: load file, backup, numbered steps, success check, and undo steps, so no agent writes production data and every change can be undone. Use first, before work-on, when the owner asks to load, import, update, or delete production records, for example "load this file into production".
~~~

  A version of `sf-deploy-check` that keeps Mike's word starts "Finds
  hitch-hikers (components or pending edits ... is ready), so only the
  intended changes ..." (395).
- **Mike decides (section 4):** yes to the three texts; keep or drop
  "hitch-hikers". After his yes the lines go on the model branch, and
  `dev/SKILL-INDEX.md` rows 135 to 137 change to match.

### 2.25 "change WI-031's priority to high"

- **Requests:** "change R-03 to 12 personas"; "change WI-031's priority to
  high".
- **Skills:** `work-on`, `work-refine`, and the three work track skills.
- **Check:** O5.
- **Why:** In the model `AGENTS.md`, line 27 sends "Anything to build, add,
  fix, or change" to `work-on` with no limit on what is changed. Lines 43,
  47, and 51 send "changing one (fields, stage, status ...)" to the work
  track skill. Line 59 says "not `work-on`" only for tasks, phases, and
  sub-items. The wrong pick does real harm: the request names an item ID, so
  `work-on` treats it like "pick up WI-031" and may start building when Mike
  only wanted the priority changed. The descriptions do not conflict; the
  problem is only the routing line. "Change R-03" still matches lines 27
  and 28, as it does today; line 28 is more specific.
- **New descriptions:** none.
- **Mike decides (section 4):** model `AGENTS.md` line 27 (line 29 on the
  model branch `toolkit-v2/approved-changes`) becomes:

~~~text
- Anything to build, add, fix, or change in the product, "keep going", and "add it to the backlog": the `work-on` skill. It opens the work item; also read the item's phase in `PROJECT-ROADMAP.md`.
~~~

- **Small risk:** "the product" is a new word in the model. A request about
  a project file that is not clearly product (a CI setup, a README) may match
  no routing line; `work-on`'s "Quick edit" row would still do it.

### 2.26 Codex cuts every description short (skill list budget)

- **Request:** any request in Codex with Mike's real plugins, for example
  "mark task 3 done" or "whats next".
- **Skills:** all V2 project skills, and the Vercel plugin in Codex.
- **Check:** O6.
- **Why:** Codex puts the skill list in a fixed budget (2% of the model's
  context window). Mike's own Codex logs from 2026-09-29 show about 140
  skills listed, and every description is already cut to 74 to 86
  characters, with no warning. The verifier copied Codex's cutting rule into
  a scratch script (it matched the real logs within about 5 characters) and
  ran it for a V2 project:
  - Mike's setup as it is today: every V2 description is cut to about 90 to
    100 characters. Every "Use when" example (these start at character 141
    to 253) and every "Not for" line (267 to 353) is gone. Example: for
    "mark task 3 done", `local-work-track` keeps only "Creates and changes
    work items in local work-items/ folders: new items, fields, stage,
    phases," and `work-finish` keeps only its first bracket. Either could be
    picked.
  - Vercel plugin off only: about 245 to 273 characters kept; every "Not
    for" line is still cut.
  - `skills.max_context_tokens = 10000` only: about 280 to 377 kept; most
    "Not for" lines are cut partway.
  - Both changes: nothing is cut. The list uses about 6,400 to 6,800 of the
    10,000 tokens.

  Rewording cannot fix this; it needs a settings change. The finding's first
  numbers were wrong (the budget is about 20,500 characters for `gpt-6-sol`'s
  272,000-token window, and there are about 140 skills, not 82), and the
  real problem is worse than first stated. The 2026-09-28 Codex routing run
  could not catch it, because its scratch home had the Vercel, GitHub,
  Slack, and Supabase plugins off.
- **New descriptions:** none.
- **Mike decides (section 4):** add two lines to each V2 project's Codex
  settings, in `plugins/toolkit/skills/project-setup/assets/settings/codex-plugins-off.toml`:
  turn the Vercel plugin off in V2 projects only, and set
  `skills.max_context_tokens = 10000` (the most the setting allows; a
  project config may set it). The file's first comment line must then stop
  saying it holds only the claude-toolkit plugins.
- **Check step fix:** Codex shows no warning when it only shortens
  descriptions. In the real-plugins Codex run, compare each "Available
  skills" line with the full description; do not rely on an "omitted"
  warning.

### 2.27 "remind me to ..."

- **Request:** "remind me to ask the client about SSO".
- **Skills:** `local-memory-save`, `notion-memory-save`, `todoist-cli`.
- **Check:** O7.
- **Why:** The older memory-save description claimed "remind me" with no
  time given. The new memory save descriptions do not, no V2 description or
  routing line claims it, and the prompt-reminder hook does not fire (it
  listens for "remember to", not "remind"). The V2 routing test has no
  "remind me" request, so it would not catch this. In Claude Code,
  `todoist-cli` is a likely winner: it names reminders, Mike's `CLAUDE.md`
  sends reminders to `td`, and it won 2 of 3 runs in the old test (for a
  personal errand, not a client to-do). Codex has no Todoist skill or tool,
  so Codex is less at risk than first stated; only the `AGENTS.md` table
  guides it. Two more neighbors claim "remind me" when a time is given
  (`anthropic-skills:schedule` and `schedule`). A third V2 home exists: if a
  work item about SSO exists, the to-do belongs in that item. Old decision 6
  has no recorded answer in `dev/GOAL.md`. Adding "remind me" to the memory
  save descriptions would put them over 400 characters, so the other route is
  one more phrase on the memory save routing line (a model change).
- **New descriptions:** none until Mike answers.
- **Mike decides (section 4):** where "remind me to ..." goes when no time is
  given. After he answers, add a "remind me" request to the routing test in
  both hosts.

### 2.28 Two "why" clauses: work-delegate and reset-to-remote

- **Request:** none; this is wording only, for any request that opens these
  skills.
- **Skills:** `work-delegate`, `reset-to-remote`.
- **Check:** O2 (W3, W4).
- **Why:** "so large work moves in parallel" has a size word with no measure
  ("large") and a picture word ("moves"); an agent could read it as "only
  for large items" and turn down "you drive" on a small item. "so a stale
  checkout starts clean" uses picture words, and "clean" is on the
  vague-word list. The verifier changed the `work-delegate` text to "helpers
  work separate sub-items" (the body's own words, and it keeps the phrase
  "work on", which is the neighbor skill's name, out of this description).
  For `reset-to-remote`, "so an old checkout matches the remote" was replaced
  by "so cloning again is not needed" (the body's own reason), because "old"
  has no measure and could pull "my checkout is old, update it" toward the
  skill that throws away local work. No quoted phrase or "Not for" clause
  changes.
- **New descriptions:**

~~~text
work-delegate (388):
Hands a work item to a team of helper agents with the owner as product owner, runs them from this chat, and updates each helper's sub-item and tasks when it returns, so helpers work separate sub-items in parallel while he only decides. Use when the owner says "you drive", "take it from here", "run with it", or "use a team of agents". Not for a build he steers step by step; use work-on.

reset-to-remote (386; the merged text in 2.30 replaces this):
Makes the local repository an exact copy of its remote, discarding local changes and branches the remote no longer has, after showing a plan, so cloning again is not needed and nothing is lost without warning. Use only when the owner asks for it in his own words, for example "wipe local", "match remote exactly", or "fresh start from remote". Not for a routine update; use pull-latest.
~~~

- **Follow-up:** change `dev/SKILL-INDEX.md` lines 50 and 59 with each
  `SKILL.md`.

### 2.29 Mike's other machine-wide skills: no change

- **Request:** several; listed below.
- **Skills:** `work-check`, `work-finish`, `work-on`, `local-work-track`,
  `github-work-find`, and Claude Code's `run`, `code-review`, `todoist-cli`,
  `feature-dev`, `graphify`, `excalidraw-diagram`.
- **Check:** O7.
- **Findings, each with no change proposed:**
  - "does it work run it on the simulator": the built-in `run` skill ("confirm
    a change works in the real app") may win over `work-check`, so the
    independent check would not run. The model `AGENTS.md` (line 96) still
    requires `work-check` before approval, and `work-check` keeps "does it
    work".
  - "review it before i approve": `code-review` may win. Line 96 covers it.
  - "add a task to my list to call acme tomorrow": `todoist-cli` wins, and
    should, because it is a personal to-do. "add a task to phase 2" goes to
    the track skill (its exact example, and routing line 59).
  - "build it": `feature-dev` also matches. `work-on` has the exact phrase,
    and line 76 keeps method skills inside V2 skills.
  - "draw me the flow": `excalidraw-diagram` ("visualize workflows") could
    well win. Line 76 does not clearly cover it, because it is a personal
    skill, not a method skill from a plugin. Little is at stake: Mike gets a
    drawing he asked for.
  - "how does the permission model work": `graphify` (Claude Code only) may
    win over reading `system-guide/`. More is at stake than first stated:
    with no `graphify-out/graph.json`, `graphify` builds a full graph of the
    project folder, starts helper agents, and writes `graphify-out/` at the
    project root, which the model `.gitignore` does not list. Watch this one
    in the Claude Code routing test.
- **Dropped from this finding:** both Codex GitHub lines ("show me issue 12"
  and "push it and open a pr"). The GitHub plugin Codex turns on
  (`github@openai-curated` 0.1.12) has no skills, and the `github` and
  `yeet` skills exist only in an old cache copy that is not turned on.
- The `llm-council`, `skill-creator`, `consolidate-memory`, `update-config`,
  `simplify`, `project-init`, `init`, Notion plugin, `impeccable`,
  `obsidian-cli`, and "remind me" cases have their own findings above or in
  section 5.

### 2.30 Where two findings change the same description

Some descriptions are changed by more than one finding, in overlap or in
wording (section 3). Apply one text for each. The texts below marked
"merged" were put together by this report from verified findings; the
reviewer who re-reads the fixes checks them against `overlap-review.md`
before they are applied.

- **work-on:** use the text in 2.12. It replaces the texts in 2.4 and 2.11,
  and it carries the 2.18 clause.
- **solution-design:** use the text in 2.14. It includes the 2.13 phrase
  change.
- **local-memory-save and notion-memory-save:** use the texts in 2.2. They
  replace the texts in 2.8 (2.2 removes a two-way reading and the word "he").
- **local-memory-find:** 2.22 and 2.23 give the same text.
- **The three find skills:** 2.9 replaces the wording fixes to their
  descriptions in section 3 (local-work-find, notion-work-find,
  github-work-find).
- **The three track skills:** 2.10 replaces the wording fixes to their
  descriptions in section 3 (local-work-track, notion-work-track,
  github-work-track).
- **notion-memory-find:** 2.22 replaces the section 3 wording fix.
- **work-status:** 2.20 already includes the section 3 wording fix.
- **merge-and-clean-up:** 2.1 already includes the section 3 wording fix
  ("is merged").
- **work-refine:** 2.4 and 2.11 give different texts. Recommended: 2.4 (it
  keeps "a roadmap", which Mike used for work-refine in topic 13, and it
  keeps `publish-docs` from being the only description that says
  "roadmap"). With 2.11's `publish-docs` text naming `PROJECT-ROADMAP.md`,
  the file side of "roadmap" still goes to `publish-docs`. The reviewer
  confirms this choice with the routing test ("update the roadmap ..." and
  "help me plan the roadmap for this epic").
- **project-setup (merged, 399):** 2.3's text with 2.5's word "older" (the
  name the body uses).

~~~text
Sets up, checks, or updates Toolkit V2 in a project, or changes where work items or memory are kept, by copying the model project, skills, and hooks, so projects run the same files. Use when the owner says "set up this project", "initialize this project", "update the toolkit", or "check the setup". Not for a Git pull; use pull-latest. Not for the older claude-toolkit (project-init, project-sync).
~~~

- **handoff (merged, 399):** 2.8's "Use when the owner ends the session"
  with the section 3 wording fix "this session's work items". Together they
  came to 400, one over the limit, so "anything worth keeping" became "what
  is worth keeping".

~~~text
Updates this session's work items and Current State, offers what is worth keeping to memory, then writes a checked, self-contained prompt for a new session, or checks a pasted one, so nothing is lost when context clears. Use when the owner ends the session or says "write a handoff", "I'm clearing context", "start a new session", or "check this handoff". Not for a recap alone; use session-summary.
~~~

- **session-summary (merged, 385):** 2.22's "which still need him" with the
  section 3 wording fix that renames the table column to `Result`.

~~~text
Recaps this chat as a table of the owner's requests, the result of each one, and which still need him, so he sees what is done and what is open. Use when he asks what happened in this chat, for example "recap this chat", "what did I ask for", "what did we do today", or "summarize this session". Not for where the project's work stands; use work-status. Not for a handoff; use handoff.
~~~

- **work-finish (merged, 396):** 2.1's text with the section 3 wording fix
  ("specification update", the stage's real name; "Not for a task's status",
  which has one meaning). To fit under 400, "checking whether" became
  "checking if".

~~~text
Ships and closes an approved work item (merge, deployment, specification update) or cancels one, and asks the owner before marking it Done, so nothing merges, deploys, or closes without his yes. Use when the owner cancels an item or says "ship it", "merge it", "close it", or "mark it done". Not for checking if a build is ready; use work-check. Not for a task's status; use the work track skill.
~~~

- **reset-to-remote (merged, 386):** 2.28's text with the section 3 wording
  fix "discarding local commits" (the skill's main action; uncommitted edits
  are discarded only after an explicit yes).

~~~text
Makes the local repository an exact copy of its remote, discarding local commits and branches the remote no longer has, after showing a plan, so cloning again is not needed and nothing is lost without warning. Use only when the owner asks for it in his own words, for example "wipe local", "match remote exactly", or "fresh start from remote". Not for a routine update; use pull-latest.
~~~

- **sf-deploy-check (Mike decides):** three versions exist: 2.16 (390),
  2.24 (380), and the section 3 wording fix (394, adds two example
  phrases). Recommended: 2.16. It is the only one that removes "ready" from
  the first sentence, so a Codex cut cannot bring back the overlap with
  `work-check`, and its "Not for" line uses Mike's word "ready". Adding the
  wording fix's example phrases to it would go over 400.
- **sf-component-tracker (Mike decides; merged, 394):** 2.24 and the section
  3 wording fix differ. The why clause in 2.24 ("so each deploy ships exactly
  the components that are ready") repeats `sf-deploy-check`'s job, as a
  dropped finding in section 5 pointed out. Recommended merged text: the
  wording fix's "Use when" (it removes the two-way "Use first, before
  work-on") with the dropped finding's why clause.

~~~text
Keeps the component tracker CSV, the master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in sync, so no changed component is left out of a deploy. Use when Salesforce metadata under force-app/ is added, changed, renamed, or deleted (open it before work-on and update the records in the same response), a deploy result comes back, or a deploy needs manual steps.
~~~

- **sf-data-change (Mike decides; merged, 391):** 2.24 and the section 3
  wording fix differ. Recommended merged text: the wording fix's "handoff"
  (so "package" means only `package.xml`) and "even inside a work-on build"
  (so "Use first, before work-on" is gone), with 2.24's why clause ("so no
  agent writes production data"). The body renames in the section 3 fix
  still apply. "fix these records in production" is a placeholder for
  Mike's own words.

~~~text
Builds the owner's handoff for a Salesforce production data change: load file, backup, numbered steps, success check, and undo steps, so no agent writes production data and every change can be undone. Use when the owner asks to load, import, update, or delete production records, even inside a work-on build, for example "load this file into production" or "fix these records in production".
~~~

Every changed description also changes its row in `dev/SKILL-INDEX.md` word
for word, in the same commit, and is followed by the routing test in both
hosts.

## 3. Wording

Every kept wording finding, grouped by skill. Each entry gives the line, the
check, the current text (OLD), and the exact replacement (NEW). "Mike
decides" marks a finding that changes Mike's own text or adds a rule; its
question is in section 4. A "Note" line says what else must change with the
fix (another copy, a source file, a paired finding).

Paths are short:

- `<setup>` is `plugins/toolkit/skills/project-setup/`.
- `<shared>` is `<setup>assets/.shared-skills/`.
- `<sets>` is `<setup>assets/.skill-sets/`.
- `<sf>` is `<setup>assets/.salesforce/`.
- `<model>` is `<setup>assets/model/` (Mike's model copy).

A file whose first lines say it is a copy of a `dev/build-shared/` source is
fixed at the source, then `node dev/tools/sync-skill-references.mjs` copies
it. Where a finding names a copy, the note says so.

### 3.1 Shared sources (`dev/build-shared/`)

These files are copied into many skills. Fix them here once.

#### `dev/build-shared/approvals.md`

**Line 34 · W4**
~~~text
OLD: - A bare "yes", "ok", or "looks good" answers only a yes-or-no question asked earlier in this conversation. When none was asked, show the choice with your recommendation and record nothing yet.
NEW: - A bare "yes", "ok", or "looks good" answers only a yes-or-no question you asked earlier in this conversation that is still open. When more than one is open, it answers the one you asked last. When none is open, show the choice with your recommendation and record nothing yet.
~~~

**Line 37 · W3**
~~~text
OLD: - An approval survives later stages. A stage alone does not prove approval: check the approval field.
NEW: - An approval stays valid when the item moves to a later stage. A stage alone does not prove approval: check the approval field.
~~~

**Line 48 · W4, W7**
~~~text
OLD: | "ok" | Nothing was asked in this chat | Not an answer; ask what he wants |
NEW: | "ok" | Nothing was asked in this conversation | Not an answer; show the choice with your recommendation |
~~~

**Line 54 · W1**
~~~text
OLD: - Ask in the reply text, never through a separate question tool: he may not see it, and the reply must hold the question.
NEW: - Ask in the reply text, never through a question tool, such as `AskUserQuestion` in Claude Code or `request_user_input` in Codex: he may not see the tool's question, and the reply must hold the question.
~~~

**Line 58 · W4 · Mike decides (section 4)**
~~~text
OLD: - Every item in a list you show him carries a one-line reason.
NEW: - Every item in a list of choices or recommendations you show him carries a one-line reason.
~~~
Note: the line repeats Mike's decision 4B and model `AGENTS.md` line 104 word for word.

**Line 61 · W4 · Mike decides (section 4)**
~~~text
OLD: - End every reply with the one question he must answer, or the exact words that continue the work ("Say 'keep going' and I'll start the build.").
NEW: - End every reply with the one question he must answer, or the exact words that continue the work ("Say 'keep going' and I'll start the build."). When the reply has a Sources list, put it just above that last line.
~~~
Note: pairs with `decisions-and-memory.md` line 169 and `work-status` `SKILL.md` line 62.

**Line 72 · W4**
~~~text
OLD: 2. Set the approval field to `YYYY-MM-DD by <name>`, where `<name>` is the owner's name as `PROJECT.md` gives it.
NEW: 2. Set the approval's field the way section 14 shows for this approval and this tracker. Where the field holds a date and a name (for example `requirements_approved` in a local item, or the Requirements approved property in Notion), write `YYYY-MM-DD by <name>`, where `<name>` is the owner's name as `PROJECT.md` gives it.
~~~

**Line 75 · W4**
~~~text
OLD: 4. Set `waiting_on` to `agent` when the agent continues, or keep `owner` while another of his questions on the item is still open.
NEW: 4. Set `waiting_on`: keep `owner` while another of his questions on the item is still open; otherwise set `agent` when the agent continues, or `none` when nothing waits.
~~~

**Line 77 · W4**
~~~text
OLD: 5. Rewrite the item's Current state in place: Where it stands, Next action (the next open Q-ID, if any), Waiting on, and Last updated.
NEW: 5. Rewrite the item's Current state in place, all five lines: Where it stands, Next action (the next open Q-ID, if any), Waiting on, Blockers, and Last updated.
~~~

**Line 79 · W3**
~~~text
OLD: 6. Read the item back and check each change landed.
NEW: 6. Read the item back and check that each change was saved.
~~~

**Line 81 · W4**
~~~text
OLD: A "no" or a change: record his words in the row the same way (Decision? `yes` when he decided against it), turn each problem he names into a task or a requirement change, and ask again when it is fixed.
NEW: A "no" or a request for changes: fill the row as in step 1 (Decision? `yes` when he decided against it), leave the approval field unchanged, and do steps 3 to 6. Turn each problem he names into a task or a requirement change, and ask again when every one of them is fixed.
~~~

**Line 87 · W4**
~~~text
OLD: Asked by `work-refine`. A `build` or `data-load` item cannot pass stage 03 without it.
NEW: Asked by `work-refine`. A `build` or `data-load` item cannot move to stage 03 or later without it.
~~~

**Line 112 · W4**
~~~text
OLD: - [ ] Each sub-item that already exists and covers some of these `R-xx`: with the work track skill, write "Covers <parent ID> R-xx, approved there." in its Active requirements. When it has no `R-xx` of its own waiting for approval, also set its `requirements_approved` to this approval with `(from <parent ID>)` and move it to `03-requirements-approved`, status Ready (section 11).
NEW: - [ ] Each sub-item that already exists and covers some of these `R-xx`: with the work track skill, write "Covers <parent ID> R-xx, approved there." in its Active requirements. When it has no `R-xx` of its own waiting for approval, also set its `requirements_approved` to this approval with `(from <parent ID>)`, and when it is before stage 03, move it to `03-requirements-approved`, status Ready (section 11).
~~~

**Line 118 · W4**
~~~text
OLD: - [ ] Next: a `build` or `data-load` item goes to `solution-design`, unless the owner agreed to skip the design.
NEW: - [ ] Next: a `build` or `data-load` item goes to `solution-design`, unless the owner agreed to skip the design; any other item goes to `work-on`.
~~~

**Line 158 · W2**
~~~text
OLD: - It runs every time. "Owner-led", "no agent team", and a no to the team question decide only who builds; none of them removes the check.
NEW: - It runs every time. `delivery: owner-led`, the owner saying "no agent team", and a no to the delivery offer or to the team arrangement question in `work-delegate` decide only who builds; none of them removes the check.
~~~

**Line 160 · W4 · Mike decides (section 4)**
~~~text
OLD: - The owner asks to skip it: say in one line that it always runs before a result approval, as he decided, and ask whether he wants to change that decision. Until he changes it, run it.
NEW: - The owner asks to skip it: say in one line that it always runs before a result approval, as he decided, and ask whether he wants to change that decision. Until he changes it, run it. When he changes it, write his words as a bullet in `.claude/rules/owner-preferences.md` and follow that bullet.
~~~

**Line 178 · W4**
~~~text
OLD: After his yes (section 3), also set `result_approved`, then continue with `work-finish`. A "no": move the item to `10-bug-fixing` with a task for each problem he named.
NEW: After his yes (section 3), also set `result_approved`, then continue with `work-finish`. A "no": move the item to `10-bug-fixing` with a task for each problem he named; a problem that changes a requirement goes to `work-refine`.
~~~

**Line 184 · W4**
~~~text
OLD: Only the owner marks an item Done. Asked by `work-finish`.
NEW: An item is Done only on the owner's yes, or when he marks it Done himself. Asked by `work-finish`.
~~~

**Line 193 · W4, W7**
~~~text
OLD: - [ ] Every open sub-item is finished, cancelled, or moved, or the owner said the parent is done anyway.
NEW: - [ ] Every sub-item is Done or Cancelled, or was moved to the top level or under another item, or the owner said the parent is done anyway.
~~~

**Line 197 · W4**
~~~text
OLD: Ask: "Mark WI-031 Done?", with the evidence in one line. Add the row.
NEW: Ask: "Mark WI-031 Done?", with the evidence in one line. Add the row and set `waiting_on: owner`.
~~~

**Line 207 · W4**
~~~text
OLD: - [ ] Ask once more over the item's decisions: list the rows marked Decision? yes that look project-wide, each with a one-line reason, and ask whether to save them to memory too.
NEW: - [ ] Ask once more over the item's decisions: list the rows marked Decision? yes that look project-wide, are not saved to memory yet, and that he has not said no to, each with a one-line reason, and ask whether to save them to memory too.
~~~

**Line 211 · W4**
~~~text
OLD: The owner may mark an item Done himself (the Done status, a card moved to Done, or a closed issue).
NEW: The owner may mark an item Done himself (the Done status, a card moved to Done, or an issue closed as completed).
~~~

**Line 212 · W4**
~~~text
OLD: At your next change, add a Recent History row "Marked Done by the owner by hand on `YYYY-MM-DD`", and tell him in one line if the result approval or the independent check had not run.
NEW: At your next change to that item, add a Recent History row "Marked Done by the owner by hand on `YYYY-MM-DD`", and tell him in one line if the result approval or the independent check had not run. Then do the rest of the checklist above: rewrite the item's Current state, remove its line from the project's Current State, and ask once more over the item's decisions.
~~~

**Line 251 · W4**
~~~text
OLD: - A sub-item that covers its parent's approved requirements says so in its Active requirements ("Covers WI-012 R-02 and R-03, approved there.") and copies the parent's approval into `requirements_approved` with the parent's ID, for example `2026-09-30 by Mike Rihm (from WI-012)`. Never ask the owner to approve the same requirement twice.
NEW: - A sub-item that covers its parent's approved requirements says so in its Active requirements ("Covers WI-012 R-02 and R-03, approved there."). When it has no `R-xx` of its own waiting for approval, it also copies the parent's approval into `requirements_approved` with the parent's ID, for example `2026-09-30 by Mike Rihm (from WI-012)`. Never ask the owner to approve the same requirement twice.
~~~

**Line 298 · W4**
~~~text
OLD: On GitHub, a pull request body never says "Closes #12" or "Fixes #12": GitHub closes the issue when the pull request merges, which would mark the item Done without the owner's yes. Write "Part of #12" instead.
NEW: On GitHub, a pull request body or a commit message never puts a closing word before the item's issue number ("Closes #12", "Fixes #12", "Resolves #12", or another form of close, fix, or resolve): GitHub closes the issue when the change reaches the default branch, which would mark the item Done without the owner's yes. Write "Part of #12" instead.
~~~

#### `dev/build-shared/decisions-and-memory.md`

**Line 10 · W2**
~~~text
OLD: In this file, "the memory save skill" and "the memory find skill" mean the ones `AGENTS.md` names (`local-memory-save` and `local-memory-find`, or `notion-memory-save` and `notion-memory-find`).
NEW: In this file, "the work track skill" is the one `AGENTS.md` names for the project's tracker, and "the memory save skill", "the memory find skill", and "the memory refine skill" mean the ones `AGENTS.md` names (`local-memory-save`, `local-memory-find`, and `local-memory-refine`, or `notion-memory-save`, `notion-memory-find`, and `notion-memory-refine`).
~~~

**Line 38 · W4**
~~~text
OLD: The memory save skill, or `retain` (the "Written by" cell of the rows on lines 38 and 41)
NEW: The memory save skill; Hindsight: `retain`
~~~
Note: use the same cell text on both rows, lines 38 and 41.

**Line 43 · W4**
~~~text
OLD: | What is happening now, what waits on the owner, where the next session starts | Current State (section 10) | The memory save skill, `work-finish`, and `handoff`; in a Hindsight project, edit the file directly |
NEW: | What is happening now, what waits on the owner, where the next session starts | Current State (section 10) | The memory save skill, the memory refine skill, `work-finish`, and `handoff`; a line is removed the moment it stops being true (section 10); in a Hindsight project, edit the file directly |
~~~

**Line 48 · W4**
~~~text
OLD: - A hook reminder that a message may hold something to keep is a hint, not a save decision. The memory save skill decides; a review can end with nothing saved.
NEW: - A hook reminder that a message may hold something to keep is a hint, not a save decision. The memory save skill decides (in a Hindsight project, the memory rule's "Hindsight projects" section); a review can end with nothing saved.
~~~

**Line 54 · W4**
~~~text
OLD: - Save every decision made while working an item in that item's Questions and Answers at once: a row marked Decision? `yes`, with the owner's words and the date.
NEW: - Save every decision made while working an item in that item's Questions and Answers right away, before moving on: a row marked Decision? `yes`, with the owner's words and the date.
~~~

**Line 79 · W4**
~~~text
OLD: - Ask right after the row is saved, and once more over the item's decisions when the item finishes. At finish, list each decision with a one-line reason it looks project-wide.
NEW: - Ask right after the row is saved, and once more over the item's decisions when the item finishes. At finish, list each decision that looks project-wide, is not saved to memory yet, and that he has not said no to, each with a one-line reason it looks project-wide.
~~~

**Line 82 · W2**
~~~text
OLD: - Ask in every memory approval mode: a decision record always needs his yes.
NEW: - Ask in both memory approval modes (the "Memory approval" line in `PROJECT.md`, "Toolkit settings": onboarding or trusted): a decision record always needs his yes.
~~~

**Line 105 · W4**
~~~text
OLD: - It concerns something that is not a work item yet: make a new work item at stage `01-discovery` with the work track skill, with the decision as its first Questions and Answers row.
- It is project-wide: save it straight to a memory record, after the owner's yes. Its "Where it was decided" names the conversation and its date, and the Current State line it concerns when there is one.
- A choice that matters only inside this conversation is not saved.
NEW: - It concerns an existing work item but was made when no item was open: add it as a row in that item's Questions and Answers, like any other decision. Ask the owner which item when it is unclear.
- It concerns something that is not a work item yet: make a new work item at stage `01-discovery` with the work track skill, with the decision as its first Questions and Answers row. When it also passes the project-wide test, ask as section 3 says.
- It is project-wide and belongs to no work item: save it straight to a memory record, after the owner's yes. Its "Where it was decided" names the conversation and its date, and the Current State line it concerns when there is one.
- A choice that matters only inside this conversation is not saved.
~~~

**Line 118 · W4 · Mike decides (section 4)**
~~~text
OLD: - In memory: save a new record that names the one it replaces. Set the old record's status to `superseded` (a decision the owner withdraws without a replacement: `withdrawn`). In Hindsight, `retain` the correction, naming what it replaces.
NEW: - In memory, when the old decision has a memory record: ask "This looks project-wide. Save it to memory too?" for the new answer (section 3). On his yes, save a new record that names the one it replaces and set the old record's status to `superseded`. On his no, or when he withdraws the decision without a replacement, set the old record's status to `withdrawn`. In Hindsight, `retain` the correction, naming what it replaces.
~~~
Note: only "On his no ... `withdrawn`" is a new rule; the ask already exists in `local-memory-save` `references/saving.md`.

**Line 126 · W4**
~~~text
OLD: - An instruction for how the agent works is a rule, never memory. His own words ("from now on", "always", "never") are the approval. Write one specific instruction per bullet in `.claude/rules/owner-preferences.md`, under a heading for its area.
NEW: - An instruction for how the agent works is a rule, never memory. His own words ("from now on", "always", "never") are the approval. Write one specific instruction per bullet in `.claude/rules/owner-preferences.md`, under a heading for its area, or in `~/.claude/rules/` when it applies to every project (section 1).
~~~

**Line 154 · W4, W5**
~~~text
OLD: - Link only when the link helps someone find the item or the memory. Check that the target exists.
NEW: - Link a memory only to the work items it is about. Check that the target exists.
~~~

**Line 169 · W4 · Mike decides (section 4)**
~~~text
OLD: - End the reply with a short Sources list: one line per source, naming the file, record, or work item and what you took from it. Leave the list out when the reply used no recalled knowledge.
NEW: - Put a short Sources list at the end of the reply, just above the closing question or the words that continue the work: one line per source, naming the file, record, or work item and what you took from it. Leave the list out when the reply used no recalled knowledge.
~~~
Note: this line is Mike's model rule `.claude/rules/cite-recalled-knowledge.md` word for word. Pairs with `approvals.md` line 61.

**Line 172 · W5**
~~~text
OLD: - When nothing is recorded, say so ("Nothing is recorded about the refund window.") and ask, or give your recommendation as your own. Never present a guess as something recalled.
NEW: - When nothing is recorded, say so ("Nothing is recorded about the refund window."). Then use your judgment, weighing whether only the owner can know the answer: ask him, with your recommendation, or give your recommendation and say it is your own. Never present a guess as something recalled.
~~~

**Line 181 · W7**
~~~text
OLD: Current State says what is happening now and where the next session starts. The session-start hook prints it.
NEW: Current State is the project's file or page (its title is "Current state"). It says what is happening now and where the next session starts, and the session-start hook prints it. It is not the Current state block at the top of each work item.
~~~

**Line 196 · W4 · Mike decides (section 4)**
~~~text
OLD: | Now | One line per active work item: its ID and a few words on what it is for | 5 lines |
NEW: | Now | One line per active work item (one being refined, designed, built, checked, or shipped; not one that is only logged and waiting to start): its ID and a few words on what it is for | 5 lines |
~~~
Note: if Mike picks this meaning, `work-item-format.md` section 3 ("In Progress ... The item is active") changes the same way.

**Line 205 · W4**
~~~text
OLD: - Replace stale lines; never only add lines.
NEW: - When a line is no longer true, rewrite or remove it; never add a new line and leave the old one.
~~~

**Line 213 · W4**
~~~text
OLD: - A to-do gets a work item: replace the line with the item's ID under Now.
NEW: - A to-do gets a work item: remove its line from "Untracked to-dos" and add the item's ID under "Now".
~~~

#### `dev/build-shared/git-rules.md`

**Line 26 · W4**
~~~text
OLD: Before the first Git write in a session, run each of these on its own:

git worktree list
git status
git remote
NEW: Before the first Git write in a session, run each of these on its own:

```text
git worktree list
git status
git remote
```

With a remote, then run `git fetch origin` (in Codex, with escalated permissions, as "Git writes in Codex" says). Then run `git log --oneline -10`.
~~~

**Line 34 · W7**
~~~text
OLD: - The shared primary checkout is the first path `git worktree list` prints. In it, never switch branches, reset, rebase, or stash.
NEW: - The primary checkout, also called the main checkout, is the first path `git worktree list` prints. Other sessions share it. In it, never switch branches, reset, rebase, or stash.
~~~

**Line 45 · W4, W7**
~~~text
OLD: A work item's code work happens in its own worktree, on its own branch.
NEW: A work item's changes to code, rules, skills, hooks, and settings are made in its own worktree, on its own branch.
~~~

**Line 64 · W4**
~~~text
OLD: - `<primary checkout>` is the first path `git worktree list` prints. Name it with `-C` every time: each command starts in the session's own folder, which may be another worktree, and a worktree made inside it is deleted with it.
NEW: - `<primary checkout>` is the first path `git worktree list` prints. Name it with `-C` every time. Each command starts in the session's own folder, which may be another worktree, and a worktree made inside that folder is deleted when that folder is removed.
~~~

**Line 68 · W4**
~~~text
OLD: - A builder helper gets its own worktree and branch, made from the item's branch and named for the task:
NEW: - A builder helper gets its own worktree and branch, made from the item's branch and named with the item's prefix and number, then the task ID in lower case:
~~~

**Line 75 · W4**
~~~text
OLD: - Build on the item's branch, never on the default branch.
NEW: - Build on the item's branch, or on a builder helper's own branch made from it; never on the default branch.
~~~

**Line 110 · W4**
~~~text
OLD: - Land code, rules, skills, hooks, and settings by pull request. Merge it only with the owner's yes to that merge. A standing merge instruction in `.claude/rules/owner-preferences.md` counts only after the independent checker reported no blocking issue on that exact head commit and every check passes on it.
NEW: - Land code, rules, skills, hooks, and settings by pull request. Merge it only with the owner's yes to that merge. A standing merge instruction in `.claude/rules/owner-preferences.md` counts only when all of these hold: the independent checker reported no blocking issue on that exact head commit; every check passes on it; and the work item does not say its merge needs the owner's approval.
~~~

**Line 115 · W7**
~~~text
OLD: - A documentation-only save (requirements, system guide, roadmap, README files) goes through the `publish-docs` skill.
NEW: - A documentation-only save (for example `requirements/`, `system-guide/`, `PROJECT-ROADMAP.md`, `PROJECT.md`, and README files) goes through the `publish-docs` skill.
~~~

**Line 117 · W4**
~~~text
OLD: - A pull request body never says "Closes #12" or "Fixes #12" for a GitHub issue item: GitHub would close the issue on merge, which marks the item Done without the owner's yes. Write "Part of #12".
NEW: - A pull request body or a commit message never puts a closing word before a GitHub issue item's number ("Closes #12", "Fixes #12", "Resolves #12", or another form of close, fix, or resolve): GitHub would close the issue when the change reaches the default branch, which marks the item Done without the owner's yes. Write "Part of #12".
~~~

**Line 120 · W4**
~~~text
OLD: - After the merge, remove the item's worktree and branch (`merge-and-clean-up`).
NEW: - After the merge, remove the item's worktree and branch (`merge-and-clean-up`; with no remote, `work-finish` does it after the local merge).
~~~

**Line 168 · W4**
~~~text
OLD: Then add a Recent History row: "No remote: merged locally into main."
NEW: Then add a Recent History row: "No remote: merged locally into main." Here and in the commands of this section, write the default branch's real name where `main` appears.
~~~

**Line 169 · W3, W4**
~~~text
OLD: - The fast-forward fails when the default branch moved on. Merge the default branch into the item's branch in the item's worktree (`git -C <item worktree> merge main`), run the item's checks again, then run the fast-forward again.
NEW: - The fast-forward fails when the default branch has commits the item's branch does not have. Merge the default branch into the item's branch in the item's worktree (`git -C <item worktree> merge main`), run the item's checks again, then run the merge safety check and the fast-forward again. Under a standing merge instruction, the new head also needs a new independent check.
~~~

**Line 187 · W4**
~~~text
OLD: Claude Code asks the owner before any `git clean`.
NEW: In Claude Code, the project's settings make the host ask the owner before any `git clean` runs.
~~~

**Line 188 · W4, W2**
~~~text
OLD: - They change only through the project's work and memory skills and `handoff`. The agent also edits `memory/CURRENT_STATE.md` directly where the memory rule says to: it removes a line the moment it stops being true, and in a Hindsight project it prunes the file itself.
NEW: - Change them only with the project's work and memory skills and `handoff`, with one exception: edit `memory/CURRENT_STATE.md` directly where `.claude/rules/memory-review-and-save.md` says to (remove a line the moment it stops being true; in a Hindsight project, prune the file yourself).
~~~

**Line 210 · W1**
~~~text
OLD: - [ ] Ask for escalated permissions: `sandbox_permissions` set to `require_escalated`, with a one-line reason that says what the command does ("Create the worktree for WI-002 on its own branch.").
NEW: - [ ] Ask for escalated permissions: `sandbox_permissions` set to `require_escalated`, and `justification` set to a one-line reason that says what the command does ("Create the worktree for WI-002 on its own branch.").
~~~

**Line 260 · W1**
~~~text
OLD: Right, Codex: `git commit -m 'Add CSV export for invoices'` run alone, with `sandbox_permissions` set to `require_escalated` and the reason "Commit the CSV export files for WI-007 on its branch."
NEW: Right, Codex: `git commit -m 'Add CSV export for invoices'` run alone, with `sandbox_permissions` set to `require_escalated` and `justification` set to "Commit the CSV export files for WI-007 on its branch."
~~~

#### `dev/build-shared/work-item-format.md`

**Line 37 · W4**
~~~text
OLD: Refer to an item by its ID (`WI-031`, or `#12` for a GitHub issue), never by a folder path or a web link.
NEW: Refer to an item by its ID (`WI-031`, or `#12` for a GitHub issue), never by a folder path. A web link may go beside the ID, never in place of it.
~~~

**Line 57 · W4**
~~~text
OLD: | `13-deployment` | Deployment | The result is put where it belongs. | In Review | `work-finish` |
NEW: | `13-deployment` | Deployment | The result is deployed to where it must go beyond the default branch, for example a Salesforce org. | In Review | `work-finish` |
~~~
Note: `github-work-track` `references/labels.md` line 63 has the same phrase (fixed in 3.19).

**Line 60 · W6**
~~~text
OLD: Stages may be skipped, repeated, or revisited. When a move is not obvious, add a Recent History row that says why.
NEW: Stages may be skipped, repeated, or revisited. Section 5, "Recent History gets a row when", says when a stage move gets a row.
~~~

**Line 78 · W4**
~~~text
OLD: The owner accepted the result. Only the owner marks an item Done: the agent asks him first and records his words and the date, or he marks it himself.
NEW: The owner accepted the result. The agent sets Done only after the owner says yes, and records his words and the date as a Questions and Answers row; the owner may also set Done himself.
~~~

**Line 79 · W3**
~~~text
OLD: Work stopped without the result, on the owner's word only.
NEW: Work stopped without the result. Set only when the owner says to cancel the item.
~~~

**Line 83 · W4**
~~~text
OLD: A stage move never sets Done or Cancelled. The stage stays where it was.
NEW: A stage move never sets Done or Cancelled. Setting Done or Cancelled leaves the stage where it was.
~~~

**Line 110 · W4**
~~~text
OLD: After the owner answers his last open question on the item, set `waiting_on` to `agent` when the agent continues, or `none`.
NEW: After the owner answers his last open question on the item, set `waiting_on` to `agent` when the agent continues, or to `none` when nothing waits.
~~~

**Line 116 · W4**
~~~text
OLD: Keep every heading and label exactly as the template has it, including the dash in `P1 — <name>` and `R-01 — <name>`.
NEW: Keep every heading and label exactly as the template has it, including the long dash (—) in `P1 — <name>` and `R-01 — <name>`.
~~~

**Line 118 · W4**
~~~text
OLD: Replace every angle-bracket prompt with real text, and delete the fill-in guide comment once the item is filled.
NEW: Replace every angle-bracket prompt with real text. Delete the first comment, "Fill-in guide for a new work item", once no angle-bracket prompt is left in the item.
~~~

**Line 123 · W4**
~~~text
OLD: then **Related items** (IDs, never paths)
NEW: **Goal**, then the `### Current state` block (five fixed lines, below), then **Related items**: the roadmap unit in `PROJECT-ROADMAP.md`, the parent and related work item IDs (never folder paths), the design, and external links such as the pull request. Goal and Related items change only when the item's aim or links change.
~~~

**Line 131 · W6**
~~~text
OLD: The Current state block sits in the Overview, under its own `### Current state` heading, and has these five lines in this order:
NEW: The Current state block has these five lines in this order:
~~~

**Line 142 · W6**
~~~text
OLD: Current state is where the item stands now. It is the first thing an agent reads when it opens the item, and a new session picks up from it alone.
NEW: Current state says where the item stands now. Read it first when you open an item, and write it so a new session can continue the work from it alone.
~~~

**Line 153 · W5**
~~~text
OLD: the stage, `waiting_on`, the blockers, or the next action changes for a reason that is not obvious;
NEW: the stage, `waiting_on`, the blockers, or the next action changes, and in your judgment a later reader of the item could not tell why from the item alone;
~~~

**Line 157 · W2**
~~~text
OLD: the independent checker reports (its verdict, the commit, the gaps);
NEW: the independent checker run by `work-check` reports (its verdict, the commit, the gaps);
~~~

**Line 158 · W7**
~~~text
OLD: a discovery changes the plan, or the owner changed the item by hand;
NEW: something learned during the work changes the plan, or the owner changed the item by hand;
~~~

**Line 161 · W4**
~~~text
OLD: Leave out routine commands, files opened, ordinary test runs, and small edits.
NEW: Leave out commands, files opened, test runs, and edits, unless one fits a case above.
~~~

**Line 172 · W4 · Mike decides (section 4)**
~~~text
OLD: Never delete a requirement. Mark it Superseded, with the ID of the one that replaces it.
NEW: Never delete a requirement. A dropped or replaced requirement gets Status Superseded, with the reason and the Q-ID in its Decision record, and the ID of the requirement that replaces it when there is one.
~~~
Note: this conflicts with model `WORK-ITEM.md` lines 89 and 111 ("mark Superseded only with a replacement link"). If Mike keeps the model rule, `work-refine` `references/changes.md` section 4 changes instead.

**Line 225 · W1**
~~~text
OLD: (the approvals reference says how)
NEW: (the `approvals.md` reference says how)
~~~

**Line 237 · W4**
~~~text
OLD: When a decision looks project-wide, ask "This looks project-wide. Save it to memory too?" (`.claude/rules/keep-work-item-current.md`).
NEW: When a decision looks project-wide (a later work item, or an agent working on something else, will need to follow it), ask "This looks project-wide. Save it to memory too?" (`.claude/rules/keep-work-item-current.md`).
~~~

**Line 244 · W4**
~~~text
OLD: Work smaller than an item is a task.
NEW: A single step of work is a task, not an item.
~~~

**Line 253 · W4**
~~~text
OLD: Most tasks sit on the lowest-level items.
NEW: Put a task on the lowest-level item it belongs to. A parent's tasks are the work that is not a sub-item of its own.
~~~
Note: the `planning.md` files of the three track skills say "Tasks sit mostly on the lowest-level items"; they are fixed in 3.19, 3.21, and 3.23.

**Line 264 · W4**
~~~text
OLD: One design per item, started from the design template, which the `solution-design` skill writes.
NEW: One design per item. The `solution-design` skill writes it, starting from the design template (`DESIGN.md`).
~~~

**Line 266 · W4**
~~~text
OLD: The `design` field moves `none`, then `proposed`, then `approved`, or `superseded` when a new design replaces it.
NEW: The `design` field moves `none`, then `proposed`, then `approved`. A new approach for this item goes into the same design and sets it back to `proposed`. `superseded` means the work moved to another item whose design replaces this one.
~~~

**Line 273 · W7**
~~~text
OLD: Keep the design with its item after delivery.
NEW: Keep the design with its item after the item is Done.
~~~

**Line 284 · W3**
~~~text
OLD: When an item is not where it was, or a field differs from what you wrote: find it again by its ID, tell the owner in one line what you found, add a Recent History row ("Moved by hand: <old place> to <new place>"), and carry on.
NEW: When an item is not where it was, or a field differs from what you wrote: find it again by its ID, tell the owner in one line what you found, add a Recent History row ("Moved by hand: <old place> to <new place>", or "Changed by hand: <field> <old> to <new>"), and continue the task you were doing.
~~~

**Line 288 · W4**
~~~text
OLD: A hand change that skips an approval (a `build` item past stage 03 with no requirements approval) is kept and asked about as a question. Done set by the owner himself counts.
NEW: A hand change that skips an approval (a `build` or `data-load` item at stage 03 or later with no requirements approval) is kept and asked about as a question. Done set by the owner himself is a valid Done, not a skipped approval: keep it, and tell him in one line if the result approval or the independent check had not run.
~~~
Note: `work-refine` `references/changes.md` section 5 and `approvals.md` section 4 use the same "past stage 03" wording; fix them the same way.

**Line 291 · W7**
~~~text
OLD: Two items with the same ID, or an item named in Current State, the roadmap, or another item that cannot be found
NEW: Two items with the same ID, or an item named in the project's Current State, `PROJECT-ROADMAP.md`, or another item that cannot be found
~~~

**Line 293 · W4**
~~~text
OLD: tell the owner and fix it with the work track skill.
NEW: tell the owner what you found, and fix it with the work track skill after he says how. The one exception: a duplicate ID you just made yourself while creating an item, which you renumber without asking.
~~~

**Line 303 · W4** (Notion properties)
~~~text
OLD: Properties of the same names (Work item is the title; Parent item; Waiting on; Requirements approved; Design; Design approved; Result approved; and the others)
NEW: Properties named after the fields (`waiting_on` is Waiting on), with these differences: `title` is the Work item property (the page title); `parent` is Parent item; Waiting on holds `external` without the who, which the Current state "Waiting on" line gives; `updated` has no property; and Notion also has a Design approved property (`YYYY-MM-DD by <name>`, or `no`) that has no header field
~~~

**Line 303 · W4** (GitHub labels)
~~~text
OLD: `delivery:<value>`, and the approval labels
NEW: Labels: `stage:<stage>`, `type:<type>`, `priority:<priority>`, `waiting-on:<owner, agent, or external>` (no label for `none`), `delivery:<agent-led or owner-led>` (no label for `not-offered`), `requirements-approved`, `design-proposed` or `design-approved` (no label for `none` or `superseded`), and `result-approved`
~~~

**Line 316 · W2**
~~~text
OLD: In Notion, the Roadmap, Sub-items, and Tasks sections and the Linked memory view are live views of linked records. Change their rows, never the view text.
NEW: In Notion, the Roadmap, Sub-items, and Tasks sections and the Linked memory view are database views on the page. Change the database rows the views show, never the views. (In lines 306, 307, 308, and 314, write "view" for "live view".)
~~~

**Line 321 · W6**
~~~text
OLD: Local `work-items/` is kept out of Git and lives only in the main checkout.
NEW: Delete lines 321-322, and change line 280-281 to: "Local `work-items/` and local memory are kept out of Git and live only in the main checkout. From a Git worktree, the main checkout is the first path `git worktree list` prints."
~~~

**Line 334 · W4**
~~~text
OLD: The write failed: lead with "Not saved", name what was not saved and where it belongs, and keep the text so it can be saved later.
NEW: The write failed: lead with "Not saved", name what was not saved and where it belongs, and put the unsaved text in your reply so it can be saved later.
~~~

#### `dev/build-shared/writing-a-project-skill.md`

**Line 50 · W3**
~~~text
OLD: - <A fact from the lesson that breaks a reasonable guess.>
NEW: - <A fact from the lesson that the agent would get wrong by guessing.>
~~~

**Line 71 · W3**
~~~text
OLD: 4. Not for: only when another skill could claim the same message, naming that skill ("Not for changing the export itself; use work-on.").
NEW: 4. Not for: only when another skill's description also fits the same owner message, naming that skill ("Not for changing the export itself; use work-on.").
~~~

**Line 94 · W3**
~~~text
OLD: - `## Gotchas`: the facts from the lesson that break a reasonable guess.
NEW: - `## Gotchas`: the facts from the lesson that the agent would get wrong by guessing.
~~~

**Line 95 · W4**
~~~text
OLD: Keep `SKILL.md` short: well under 500 lines. Move long detail into a reference file.
NEW: Keep `SKILL.md` under 500 lines, and as short as the steps allow. Use your judgment on which detail moves into a reference file: weigh its length against how often the steps need it.
~~~

**Line 102 · W4**
~~~text
OLD: A template goes in `assets/`, a longer procedure or checklist in `references/`.
NEW: A template goes in `assets/`; a procedure or checklist moved out of `SKILL.md` (section 4) goes in `references/`.
~~~

**Line 105 · W4**
~~~text
OLD: Name a project file the steps read (for example `PROJECT.md`) by its path; never point into another skill's folder or into the project's memory.
NEW: Name a project file the steps read (for example `PROJECT.md`) by its path. The steps never read a file in another skill's folder or in the project's memory; only the "Where this came from" line names the memory record.
~~~

**Line 112 · W4**
~~~text
OLD: in the same form as the others (`- "<phrase>", "<phrase>": <name>.`)
NEW: in the same form as the others (``- "<phrase>", "<phrase>": `<name>`.``)
~~~

**Line 114 · W6**
~~~text
OLD: The skill folder and `AGENTS.md` are several files: commit them by name in your own worktree and branch, and land them as `.claude/rules/shared-repository-work.md` says.
NEW: Commit the skill folder and `AGENTS.md` by name, and land them as `.claude/rules/shared-repository-work.md` says.
~~~

### 3.2 Helper briefs (`dev/build-shared/helper-briefs/`)

These are the sources of the `references/*-brief` copies in the skills that
start helpers. Fix them here once.

#### `acceptance-checker.md`

**Line 20 · W4**
~~~text
OLD: - Before a merge under a standing merge instruction, on the exact head commit.
NEW: - Before a merge under a standing merge instruction, when the head commit being merged is not the one the checker passed (`work-finish`): check that head commit.
~~~

**Line 22 · W4**
~~~text
OLD: - Before a build, when the brief asks for a plan check.
NEW: - Before two or more builders start at the same time (`work-delegate`): a plan check.
~~~

**Line 28 · W7**
~~~text
OLD: - Codex: the `spawn_agent` tool with `fork_turns` set to `none`, so the checker never shares the builder's thread. Wait for its report with `wait_agent`.
NEW: - Codex: the `spawn_agent` tool with `fork_turns` set to `none`, so the checker does not see this conversation. Wait for its report with `wait_agent`.
~~~

**Line 35 · W4**
~~~text
OLD: - This host cannot start a helper at all: check the result yourself, and tell the owner plainly that no independent check ran, and why.
NEW: - Only when this host cannot start a helper at all: check the result yourself, and tell the owner plainly that no independent check ran, and why.
~~~

**Line 85 · W4**
~~~text
OLD: If the commit differs from the one you were given, say so first.
NEW: If the commit differs from the one you were given, say so first, then check the commit you found and name it in the verdict.
~~~

**Line 102 · W3**
~~~text
OLD: - Walk the flow from start to finish as the person who uses the result. Report any step where it breaks, even when each requirement passes on its own.
NEW: - Follow the flow step by step, from start to finish, as the person who uses the result. Report any step that fails, even when each requirement passes on its own.
~~~

**Line 105 · W4**
~~~text
OLD: - Report only gaps that affect correctness or the requirements. Do not invent findings to fill the report.
NEW: - Report only the defects listed above and gaps that affect correctness or the requirements. Do not invent findings to fill the report.
~~~

**Line 110 · W7**
~~~text
OLD: You get the Roadmap, the Tasks, the requirements, and the design's build plan instead of a finished result.
NEW: You get the Roadmap, the Tasks, the requirements, and the design's "Build and verification plan" instead of a finished result.
~~~

**Line 115 · W7**
~~~text
OLD: - Each task has one owner and each file one writer. "Depends on" is right: no task starts before what it needs.
NEW: - Each task is assigned to exactly one agent (a builder or the main agent), and each file has one writer. "Depends on" is right: no task starts before what it needs.
~~~

**Line 127 · W4**
~~~text
OLD: - Run only tests and read-only commands: the test commands, `git status`, `git diff`, `git log`, `git show`, and listing or reading files.
NEW: - Run only tests and read-only commands: the test commands, `git status`, `git rev-parse`, `git diff`, `git log`, `git show`, and listing or reading files.
~~~

**Line 131 · W2**
~~~text
OLD: - Never run a command against a shared or production org or service, and never touch production data.
NEW: Line 131: "- Never run a command against a shared or production Salesforce org or any other shared or production service, and never touch production data." Line 118: "(a Salesforce sandbox org, a database, a test service)".
~~~

#### `builder.md`

**Line 21 · W1**
~~~text
OLD: (the Git rules reference, "Branch and worktree names")
NEW: (`references/git-rules.md`, "Branch and worktree names for a work item")
~~~

**Line 45 · W4**
~~~text
OLD: After its report: check its tests yourself, merge its branch into the item's branch, remove its worktree and branch, and update the task and Recent History with the work track skill. Only you change the work item and talk to the owner.
NEW: After its report: run its tests yourself on its branch, check that it changed only the files it was given, merge its branch into the item's branch, remove its worktree and branch, and update the task and Recent History with the work track skill. Only you change the work item and talk to the owner.
~~~
Note: `work-on` `SKILL.md` line 111 and `references/building.md` line 168 carry the same phrase (fixed in 3.16).

**Line 70 · W3**
~~~text
OLD: Build one task from a work item's plan. You work in your own Git worktree, so other builders cannot collide with you.
NEW: Build one task from a work item's plan. You work in your own Git worktree, so no other builder changes the files in it.
~~~

**Line 99 · W4**
~~~text
OLD: If the work your task depends on is not in the recent commits, stop and report it.
NEW: If the work your task depends on is not in this branch's commits, stop and report it.
~~~

**Line 109 · W5**
~~~text
OLD: - Run the tests and checks you were given, and the project's other fast tests that cover the files you changed.
NEW: - Run the tests and checks you were given. Then use your judgment on which of the project's other tests that cover the files you changed to run: weigh how long each takes against how much of your change it covers.
~~~

**Line 135 · W2**
~~~text
OLD: - Never deploy, never run a command against a shared or production org or service, and never write production data.
NEW: - Never deploy, never run a command against a shared or production Salesforce org or any other shared or production service, and never write production data.
~~~

**Line 138 · W4**
~~~text
OLD: - Keep scratch files inside your worktree and delete them before you commit; never stage them.
NEW: - Keep scratch files inside your worktree and delete them before you commit or, when the job says "Commit: no", before you report; never stage them.
~~~

#### `design-architect.md`

**Line 17 · W4**
~~~text
OLD: When to start it: `solution-design`, one architect per option (usually two options that differ in approach), and again for a fix round with the critic's findings. The small design team (requirements analyst, architects, critic, and a researcher when a question is open) needs no permission; say it in one line.
NEW: When to start it: `solution-design`, one architect per option (two options that differ in approach when the requirements leave a real choice, one when they leave none), and again for a fix round with the critic's findings. The design team (the architects, at least one critic, and one researcher per open question) needs no permission from the owner; name the team to him in one line.
~~~
Note: 3.12 (`design-process.md` line 115) says "research question" for this; use the same words in both when applying.

**Line 43 · W7**
~~~text
OLD: Line 43: "Owner's rulings: <answered Questions and Answers rows marked Decision? yes>". Lines 66-67: "the requirements (Agreed goal, every requirement `R-xx`, Acceptance), the owner's rulings,". Line 71: "Treat only the owner's rulings as settled."
NEW: Line 43: "Owner's decisions: <answered Questions and Answers rows marked Decision? yes>". Lines 66-67: "the requirements (Agreed goal, every requirement `R-xx`, the Acceptance list), the owner's decisions,". Line 71: "Treat only the owner's decisions as settled."
~~~

**Line 80 · W4**
~~~text
OLD: Lines 80-82: "If you find a gap while designing, stop on that requirement and return a proposed "Still open" note with the assumption you would otherwise make." Lines 139-140: "3. Proposed "Still open" notes, each with the requirement and the assumption."
NEW: Lines 80-82: "If you find a gap while designing, do not design the part for that requirement. Finish the rest, and return a proposed open question for the work item's Questions and Answers that names the requirement and the assumption you would otherwise make." Lines 139-140: "3. Proposed open questions, each with the requirement and the assumption you would otherwise make."
~~~

**Line 101 · W3**
~~~text
OLD: - Walk the flow from start to finish as the person who uses the result.
NEW: - Follow the flow step by step, from start to finish, as the person who uses the result.
~~~

**Line 126 · W4**
~~~text
OLD: - Write no file, unless the job names one draft file: then write only that file.
NEW: - Write no file.
~~~

#### `design-critic.md`

**Line 16 · W4**
~~~text
OLD: When to start it: `solution-design`, after the architects return their drafts, and again after a fix round only for findings that remain or a changed input. The critic is never the helper that wrote the draft. There is no standing review panel: stop when a round brings no new finding.
NEW: When to start it: `solution-design`, one critic per draft after the architects return their drafts, and again after each fix round, only for the findings that remain or a changed input. The critic is never the helper that wrote the draft. Stop the fix rounds when the critic returns "Clean", or the owner decided the findings that remain.
~~~
Note: 3.12 (`solution-design` `SKILL.md` line 60 and `design-process.md` line 189) says the same stop rule.

**Line 31 · W4**
~~~text
OLD: You decide which findings go back to the architect. A disagreement the architect and the critic cannot settle goes to the owner as one question, with both positions in one line each.
NEW: You decide which findings go back to the architect. A finding the architect and the critic still disagree on after two rounds goes to the owner as one question, with both positions in one line each.
~~~

**Line 40 · W7**
~~~text
OLD: Line 40: "Owner's rulings: <answered Questions and Answers rows marked Decision? yes,". Lines 61-62: "the requirements (Agreed goal, every requirement `R-xx`, Acceptance), the owner's rulings,". Line 66: "Treat only the owner's rulings as settled."
NEW: Line 40: "Owner's decisions: <answered Questions and Answers rows marked Decision? yes,". Lines 61-62: "the requirements (Agreed goal, every requirement `R-xx`, the Acceptance list), the owner's decisions,". Line 66: "Treat only the owner's decisions as settled."
~~~

**Line 82 · W3**
~~~text
OLD: - **Goal.** Walk the flow from start to finish as the person who uses the result. Report every step where the design breaks that flow.
NEW: - **Goal.** Follow the flow step by step, from start to finish, as the person who uses the result. Report every step the design does not support.
~~~

**Line 92 · W5**
~~~text
OLD: Open the sources behind the claims that matter most.
NEW: Use your judgment on which sources to open: open first the sources behind the claims that, if wrong, would make a requirement Not satisfied.
~~~

**Line 93 · W4**
~~~text
OLD: - **Completeness.** Does the option fill Approach, End-to-end behavior, Requirement coverage, Technical shape, Tradeoffs and risks, and Build order, specifically enough to act on?
NEW: - **Completeness.** Does the option fill Approach, End-to-end behavior, Requirement coverage, Technical shape, Tradeoffs and risks, and Build order, in enough detail that a builder could build from it without guessing?
~~~

**Line 105 · W4**
~~~text
OLD: - Use only reading, searching, and web research. Run no command, test, build, or install.
NEW: - Use only reading, searching, and web research. Run only commands that read, such as `cat`, `ls`, `grep`, and `rg`: no test, build, or install.
~~~

**Line 109 · W4**
~~~text
OLD: - Do not ask the owner anything. Put the smallest question that matters in your report.
NEW: - Do not ask the owner anything. Put each question whose answer would change a verdict or a finding in your report, one line each.
~~~

#### `handoff-verifier.md`

**Line 6 · W3**
~~~text
OLD: Line 6: "every fact in it holds up". Lines 12-13 (Contents): "job three (claims with nothing behind them)". Lines 58-60: "whether each one holds up against what is in the repository and the work tracker, and say which claims have nothing behind them." Line 161: "### Job three: find the claims with nothing behind them". Lines 163-164: "sentences that sound settled but rest on nothing:". Line 174: "List these. Do not delete them and do not soften them."
NEW: Line 6: "every fact in it matches the repository and the work tracker." Lines 12-13: "job three (claims no record supports)". Lines 58-60: "whether each one matches what is in the repository and the work tracker, and say which claims no record supports." Line 161: "### Job three: find the claims no record supports". Lines 163-164: "sentences that sound settled but that no file, record, or rule supports:". Line 174: "List these. Do not delete them, and do not reword them to sound less certain."
~~~

**Line 18 · W4**
~~~text
OLD: When to start it: `handoff`, after you draft the prompt and before the owner sees it. Act on every verdict: fix a Wrong claim, label an Unchecked one inside the prompt so the next session knows to confirm it, and fix a Missing goal before the owner sees the prompt.
NEW: When to start it: `handoff`, after you draft the prompt and before the owner sees it. Act on every verdict, as `handoff` step 6 says: correct a Wrong claim, write "not confirmed" beside an Unchecked one, add a Missing goal before the owner sees the prompt, and name each Skipped check in the short list.
~~~

**Line 42 · W7**
~~~text
OLD: Tracker: local (work-items/ in the primary checkout) | Notion (item text pasted below) | GitHub Issues (<owner/repository>)
NEW: Tracker: local (work-items/ in the primary checkout) | Notion (item text pasted below) | GitHub Issues (<account/repository>)
~~~

**Line 77 · W4**
~~~text
OLD: If the draft says a test or a build passed, that claim is Unchecked unless you were given the command output from this session.
NEW: If the draft says a test or a build passed, that claim is Unchecked unless you were given the command output from the session that drafted the prompt.
~~~

**Line 80 · W4**
~~~text
OLD: - If `gh` fails with a network or sign-in error, mark those claims Skipped, with the reason.
NEW: - If `gh` fails with a network or sign-in error, give each claim that needed `gh` the verdict Skipped in the claims table, and list the check, with the error, under "Skipped".
~~~

**Line 94 · W4**
~~~text
OLD: - **owner:** the owner said it in the session. You cannot open a conversation. Unless you were given his actual words, it is Unchecked. Say which claim it is, so the next session knows it holds the only copy.
NEW: - **owner:** the owner said it in the session. You cannot open a conversation. If you were given his actual words, check the claim against them and write "checked against supplied text" in the Detail column. If not, it is Unchecked; write in the Detail column that the prompt is the only record of it.
~~~

**Line 97 · W4**
~~~text
OLD: Never upgrade it because it sounds right, and never drop it.
NEW: Never mark it Confirmed because it sounds right, and never leave it out of the claims table.
~~~

**Line 114 · W4**
~~~text
OLD: Memory: local memory is the `memory/` folder in the primary checkout, and Current State is `memory/CURRENT_STATE.md` (in a Notion project, the supplied "Current state" text). Notion and Hindsight memory: the supplied text only.
NEW: Memory: local memory is the `memory/` folder in the primary checkout. Current State is `memory/CURRENT_STATE.md` in the primary checkout in a local or Hindsight project, and the supplied "Current state" page text in a Notion project. Notion memory records and Hindsight memories: the supplied text only.
~~~

**Line 136 · W4**
~~~text
OLD: | Goal stated, reason stated, pointer found and matching | Confirmed |
NEW: Keep line 136 and add this row after it: "| Goal stated, pointer found and matching, no reason stated | Confirmed; say in the Goal line that the reason is missing |"
~~~

**Line 156 · W6**
~~~text
OLD: - Every number, count, date, and duration. Two right dates subtracted wrong still give a wrong fact.
NEW: - Every number, count, date, and duration, including any the draft worked out from others, such as the days between two dates: work it out again.
~~~

**Line 181 · W4**
~~~text
OLD: - Something serious nobody asked about goes under "Also noticed", in one line.
NEW: - A problem nobody asked about that could lead the next session to do the wrong thing goes under "Also noticed", one line each, at most two lines in all.
~~~

**Line 186 · W3**
~~~text
OLD: Your final text is the whole product. Always finish with the report.
NEW: Your final message is the only thing the main agent receives. Always end it with the report.
~~~

**Line 223 · W3**
~~~text
OLD: If the project's "How to write replies" section in `AGENTS.md` disagrees with these lines, that section wins.
NEW: If the project's "How to write replies" section in `AGENTS.md` disagrees with these lines, follow that section.
~~~

#### `requirements-analyst.md`

**Line 18 · W4**
~~~text
OLD: - `work-refine`, before you ask the owner to approve the requirements.
- `solution-design`, before designing, when the requirements changed since the last check.
NEW: - `work-refine`: before you ask the owner to approve the requirements, when the owner says "check the spec", and after a change to an approved requirement.
~~~

**Line 34 · W4**
~~~text
OLD: Fix each finding in the item, or turn it into a Questions and Answers row for the owner. With more than three findings for him, show them as one numbered list he can answer in one message, each with your recommendation.
NEW: Fix in the item each finding that only makes the wording clearer, and list it for the owner in one line. Turn each finding that would change what he asked for into a Questions and Answers row with your recommendation. Handle the other findings as `references/readiness-check.md`, section 3, says. With three findings or fewer for him, ask one per message; with more than three, show them as one numbered list he can answer in one message, each with your recommendation.
~~~

**Line 47 · W7**
~~~text
OLD: Line 47: "Owner's rulings: <answered Questions and Answers rows marked Decision? yes>". Lines 65-66: "the owner's rulings, and sometimes project files to read. Treat only the owner's rulings as settled;"
NEW: Line 47: "Owner's decisions: <answered Questions and Answers rows marked Decision? yes>". Lines 65-66: "the owner's decisions, and sometimes project files to read. Treat only the owner's decisions as settled;"
~~~

**Line 48 · W4**
~~~text
OLD: Files to read: <the area's file in requirements/ or system-guide/, and what the existing build does today, or "none">
NEW: Files to read: <the area's files in requirements/ and system-guide/, the item's source files, and the files of the existing build, or "none">
~~~

**Line 72 · W3**
~~~text
OLD: Read the requirements inside the larger system the result belongs to. Walk the whole flow from start to finish as the person who uses the result. Then report:
NEW: Read the requirements inside the larger system the result belongs to. Follow the whole flow step by step, from start to finish, as the person who uses the result. Then report:
~~~

**Line 79 · W4**
~~~text
OLD: - **Missing.** Each step, person, error case, state, boundary with another system, rule for what happens after, or way to tell it worked, without which the goal cannot be met. One line each, with the fix.
NEW: - **Missing.** Each step, person, error case, state, boundary with another system, rule for what happens after the flow ends, or way to tell it worked, without which the goal cannot be met. One line each, with the fix.
~~~

**Line 99 · W3**
~~~text
OLD: Push back when something is missing, even when you are told the owner wants to move on. The owner can overrule you; you still report it. Do not soften a gap, and do not invent gaps to look thorough.
NEW: Report every missing piece, even when you are told the owner wants to move on. The owner can overrule you; you still report it. Do not make a gap sound smaller than it is, and do not invent gaps to look thorough.
~~~

**Line 106 · W4**
~~~text
OLD: - Use only reading and file search. Run no command.
NEW: - Use only reading and file search. Run only commands that read, such as `cat`, `ls`, `grep`, and `rg`.
~~~

**Line 109 · W4**
~~~text
OLD: - Do not ask the owner anything. Put the smallest question that matters in your report.
NEW: - Do not ask the owner anything. Put your questions under "Questions for the owner" in your report.
~~~

#### `researcher.md`

**Line 16 · W4**
~~~text
OLD: When to start it: one researcher for one bounded question, from `work-refine`, `solution-design`, `work-on`, or `work-delegate`.
NEW: When to start it: one researcher for one bounded question, from `work-refine` or `solution-design`.
~~~

**Line 81 · W4**
~~~text
OLD: - A source newer than your own knowledge wins until someone checks it. Say so when it happens.
NEW: - When a source is newer than your own knowledge and disagrees with it, report what the source says, not what you remember, and say that they differ. The source keeps its label: a newer community claim is still a community claim.
~~~

**Line 91 · W4**
~~~text
OLD: - Use only reading, file search, and web research. Run no command, test, build, or install, and change nothing, local or remote.
NEW: - Use only reading, file search, and web research. Run only commands that read, such as `cat`, `ls`, `grep`, and `rg`: no test, build, or install. Change nothing, local or remote.
~~~

**Line 107 · W4**
~~~text
OLD: - **Community claims to check:** the claims that would change the design if true, and what would confirm or refute each one.
NEW: - **Community claims to check:** the claims that would change the requirements or the design if true, and what would confirm or refute each one.
~~~

**Line 109 · W7**
~~~text
OLD: Lines 109-110: "**Requirements concerns:** anything missing, impossible as written, or open to misreading, or "None"."
NEW: Keep lines 83-85 as they are. Lines 109-110: "- **Requirements concerns:** each requirement that is missing something, cannot mean what it says, or could be read two ways. Write "None" when there are none."
~~~

### 3.3 project-setup

#### `<setup>SKILL.md`

**Line 8 · W6**
~~~text
OLD: Sets up Toolkit V2 in a project, or brings a Toolkit V2 project up to date. ... Sets up Toolkit V2, never the older claude-toolkit (its `project-init` and `project-sync` skills).
NEW: Sets up Toolkit V2 in a project, or brings a Toolkit V2 project up to date; never the older claude-toolkit (its `project-init` and `project-sync` skills). There is no setup program: you copy and edit the files yourself, from this skill's `assets/` folder. This skill's folder is the folder that holds this `SKILL.md`; both hosts show its path when they load the skill.
~~~

**Line 15 · W4**
~~~text
OLD: Write to the owner in plain English. Claude Code: follow the Plain English output style. Codex: follow "How to write replies" in `assets/model/AGENTS.md`.
NEW: Write to the owner in plain English. Claude Code: follow the Plain English output style; when it is not active in this session, follow "How to write replies" in `assets/model/AGENTS.md`. Codex: follow "How to write replies" in `assets/model/AGENTS.md`.
~~~

**Line 19 · W4**
~~~text
OLD: ## Pick the path (first bullet: setup stopped part way, with "Toolkit settings" filled; second bullet: a filled "Toolkit settings" section means the project is set up)
NEW: Add one line under the heading, before the first bullet: "Check the first case before the others: a setup that stopped part way also has a filled "Toolkit settings" section." The bullets stay as they are.
~~~

**Line 21 · W1**
~~~text
OLD: a service line still shows its prompt (Work item ID prefix or Notion links with Notion, GitHub repository, Hindsight bank)
NEW: a service line still shows its prompt (with Notion: "Work item ID prefix", "Notion work items", or "Notion memory"; with GitHub Issues: "GitHub repository"; with Hindsight: "Hindsight bank")
~~~

**Line 29 · W4**
~~~text
OLD: "Check the setup": build a fresh setup copy and compare (`references/update.md`, steps 1 and 2), run the final checks (`references/finishing.md`), and report; change nothing.
NEW: "Check the setup": build a fresh setup copy and compare (`references/update.md`, steps 1 and 2), run the final checks (`references/finishing.md`) without fixing any that fail, and report each difference and each failed check with the fix you recommend. Change nothing in the project; only the session-start hook run in the final checks may rebuild the generated `memory/MEMORY.md`.
~~~

**Line 68 · W7**
~~~text
OLD: Line 68: "fill the setup guides with facts he confirms"; line 83: "- [ ] Setup guides filled with confirmed facts; Current State written"; line 151: "Step 8: the setup guides, `SOUL.md`, ..."
NEW: Line 68: "8. **Finish**: fill the prompts in the copied files with facts he confirms, write Current State, run the final checks, name his own steps, report, and offer the commit. `references/finishing.md`." Line 83: "- [ ] Prompts in the copied files filled with confirmed facts; Current State written". Line 151: "Step 8: the prompts in the copied files, `SOUL.md`, Current State, the final checks, the owner's steps, the report, the commit offer".
~~~
Note: apply together with the `finishing.md` line 18 rename.

**Line 92 · W4**
~~~text
OLD: Never answer a question for him after a wait.
NEW: Never answer a question for him, even when he does not reply.
~~~

**Line 129 · W4**
~~~text
OLD: Say each one plainly, with why, and wait. Never do them for him.
NEW: Say each one plainly, with why, and wait where a later step needs it. Never do them for him.
~~~

#### `<setup>references/interview.md`

**Line 26 · W4**
~~~text
OLD: Write each answer on its checklist line in the plan tool as soon as he gives it, for example `- [x] Work tracking: local`.
NEW: - Add each answer to the plan tool as its own checked line as soon as he gives it, for example `- [x] Work items: local`. A later turn may start without this skill loaded; the plan tool keeps the answers.
~~~

**Line 36 · W4**
~~~text
OLD: ...fail on every session start, prompt, and command without it. It prints a folder other than this one (compare with `pwd -P`): this folder sits inside another repository.
NEW: ...fail on every session start, prompt, and command without it. `git rev-parse --show-toplevel` prints a folder other than this one (compare with `pwd -P`): this folder sits inside another repository.
~~~

**Line 42 · W4**
~~~text
OLD: | An earlier setup | `PROJECT.md` with a filled "Toolkit settings" section | This is an update, not a new project: `update.md` in this folder. |
NEW: | An earlier setup | `PROJECT.md` with a filled "Toolkit settings" section | The project is already set up: go back to SKILL.md, "Pick the path", which separates a setup that stopped part way, "check the setup", and "update the toolkit". |
~~~

**Line 44 · W1**
~~~text
OLD: `knowledge/`, `.memory/`, `.work-items/`, rule files, or a `CLAUDE.md` with more than `@AGENTS.md`
NEW: `knowledge/`, `.memory/`, `.work-items/`, files in `.claude/rules/`, or a `CLAUDE.md` with more than `@AGENTS.md`
~~~

**Line 136 · W4**
~~~text
OLD: | GitHub Issues | "create the work item labels in <owner>/<repository>", and "create the private repository <owner>/<name> and push main to it after the setup commit" when there is none yet |
NEW: | GitHub Issues | "create the work item labels in <owner>/<repository>", and "create the private repository <owner>/<name>; after the setup commit I'll ask before I push main to it" when there is none yet |
~~~

#### `<setup>references/setup-copy.md`

**Line 42 · W2**
~~~text
OLD: These are local to one person or one computer, or were never meant to ship (approved model change 22).
NEW: These are local to one person or one computer, or were never meant to ship.
~~~

**Line 83 · W5**
~~~text
OLD: This list matches the model when this skill was written. If you see another file that is plainly for Salesforce only (a new `sf-` skill, a rule whose heading names Salesforce), leave it out too and name it in the report.
NEW: This list matches the model when this skill was written. Use your judgment for a file the list does not name: leave it out, and name it in the report, when it has no use outside Salesforce, such as a new `sf-` skill or a rule whose heading names Salesforce.
~~~

**Line 101 · W4**
~~~text
OLD: Today these are `AGENTS.md`, `README.md`, `PROJECT.md`, and `.claude/rules/memory-review-and-save.md`.
NEW: When this skill was written, these were `AGENTS.md`, `README.md`, `PROJECT.md`, and `.claude/rules/memory-review-and-save.md`; the grep above gives the current list.
~~~

**Line 152 · W1**
~~~text
OLD: The approvals and the work-finish skill read the owner's name from this row.
NEW: The approval rules (`references/approvals.md` in the work skills) and the `work-finish` skill read the owner's name from this row.
~~~

**Line 211 · W3**
~~~text
OLD: so the owner's "from now on" instructions have one home that both hosts read.
NEW: so the owner's "from now on" instructions are kept in one file that both hosts read.
~~~

#### `<setup>references/skills-hooks-settings.md`

**Line 23 · W4**
~~~text
OLD: The folders `.shared-skills`, `.skill-sets`, and `.salesforce` start with a dot, so Codex does not load the skills in them on every computer.
NEW: The folders `.shared-skills`, `.skill-sets`, and `.salesforce` start with a dot, so Codex does not load their skills in every folder on this computer.
~~~

**Line 111 · W4**
~~~text
OLD: show the owner the old and new handlers, then take the old ones out, with any group or event left empty, and merge the snippet as usual.
NEW: show the owner the old and new handlers, then remove the old ones and any group or event they leave empty, and merge the snippet with the rules in this list.
~~~

**Line 137 · W2**
~~~text
OLD: The two plugins-off snippets turn the older claude-toolkit plugins off for this project only (approved model change 23).
NEW: The two plugins-off snippets turn the older claude-toolkit plugins off for this project only.
~~~

**Line 189 · W4**
~~~text
OLD: Each of the toolkit's hook handlers is there once. The first two commands print a count of 1 for each hook command; the third prints 2 (the helper reminder and the end-of-reply check); the last prints 1 (the Codex helper reminder).
NEW: Each of the toolkit's hook handlers is there once. In the block below, the two `grep` commands print a count of 1 for each hook command; the first `jq` command prints 2 (the helper reminder and the end-of-reply check); the second `jq` command prints 1 (the Codex helper reminder).
~~~

#### `<setup>references/placing-files.md`

**Line 64 · W4**
~~~text
OLD: | Every other file (`README.md`, a rule, a template) | Say in a few plain lines what differs, and recommend one: keep his, take the toolkit's, or merge the two. His file stays until he chooses. |
NEW: | Every other file (`README.md`, a rule, a template) | In its table row, say in one line what differs, and recommend one: keep his, take the toolkit's, or merge the two. His file stays until he chooses. |
~~~

**Line 66 · W4**
~~~text
OLD: Show all of them in one numbered table, one row per file, each with a one-line reason, and ask once.
NEW: Show every file that needs his answer in one numbered table, one row per file, each with a one-line reason, and ask once.
~~~

**Line 88 · W4**
~~~text
OLD: - No difference, or only folders that `.claude/skills` holds in the same form: tell the owner, and after his yes remove the folder and make the link.
NEW: - No difference, or only lines that start with "Only in .claude/skills" (every file in `.agents/skills` is also in `.claude/skills`, with the same content): tell the owner, and after his yes remove the folder and make the link.
~~~

**Line 112 · W4**
~~~text
OLD: Keep the scratch folder until the final checks in `finishing.md` pass.
NEW: Keep the scratch folder until the end of the final checks in `finishing.md`, which says when to remove it.
~~~

#### `<setup>references/finishing.md`

**Line 18 · W7**
~~~text
OLD: Line 3-4: "fill the setup guides with facts the owner confirms"; line 10: "- Fill the setup guides"; line 18: "## Fill the setup guides"
NEW: Line 3-4: "Purpose: after the files and the services are in place, fill the prompts in the copied files with facts the owner confirms, write Current State, run the final checks, name the owner's own steps, and end with the report and the commit offer." Line 10: "- Fill the prompts". Line 18: "## Fill the prompts".
~~~
Note: apply together with the `SKILL.md` lines 68, 83, and 151 rename.

**Line 42 · W4**
~~~text
OLD: 5. Delete each fill-in guide comment once its file is filled.
NEW: 5. Delete each fill-in guide comment when its own text says to. Keep the guide comment inside "Toolkit settings": later sessions read it.
~~~

**Line 56 · W4**
~~~text
OLD: Local or Hindsight memory: `memory/CURRENT_STATE.md`. Notion memory: the "Current state" page (the memory setup in `notion.md` fills it). Write the first lines, keeping the four headings and their line limits:
NEW: Local or Hindsight memory: write the first lines of `memory/CURRENT_STATE.md` now. Notion memory: the Notion memory setup wrote these lines on the "Current state" page in step 7 (`notion.md` in this folder); now bring its "Waiting on the owner" lines up to date. Keep the four headings and their line limits:
~~~

**Line 71 · W4**
~~~text
OLD: Run each check alone from the project folder. Each only reads, except the two hook runs, which may rebuild `memory/MEMORY.md` (a generated file).
NEW: Run each check alone from the project folder. Each only reads, except the session-start hook run, which may rebuild `memory/MEMORY.md` (a generated file).
~~~

**Line 83 · W2**
~~~text
OLD: - [ ] The prompt reminder answers a keep phrase: echo '{"prompt":"remember this: we use Postgres"}' | ...
NEW: - [ ] The prompt reminder answers a "remember this" message: echo '{"prompt":"remember this: we use Postgres"}' | node .claude/hooks/prompt-reminder.mjs --skill <local-memory-save, notion-memory-save, or hindsight>
~~~

**Line 89 · W4**
~~~text
OLD: - [ ] Services: the new-project checks in the Notion setup file, the checks in the GitHub setup file, and the Hindsight checks in hindsight.md
NEW: - [ ] Services: with work items in Notion, the "A new project" checks under "Checks after any of these" in the notion-work-track setup file (notion.md gives its path); the checks in the GitHub setup file; and the Hindsight checks in hindsight.md
~~~
Note: a memory-only Notion project has no Notion service check at all; that gap is for the writer.

**Line 154 · W4**
~~~text
OLD: When the project has a remote whose default branch is not on it yet (`git ls-remote --heads origin <default>` prints nothing, ...), ask next, as its own question. `<default>` is the branch the setup commit is on, usually `main`:

> Push main to <owner>/<repo>? The first pull request needs main on GitHub.
NEW: When the project has the remote `origin` and `git ls-remote --heads origin <default>` prints nothing (for example, a repository setup just created), ask next, as its own question. `<default>` is the branch the setup commit is on, usually `main`:

> Push <default> to <owner>/<repo>? The first pull request needs <default> on GitHub.
~~~
Note: `github.md` line 29 quotes this question; change it to "Push <default> to <owner>/<repo>?" in the same fix.

**Line 164 · W4**
~~~text
OLD: The full rules: `git-rules.md` in this folder.
NEW: The full rules: `git-rules.md` in this folder. One difference: the setup commit is made on the default branch, with no worktree and no pull request, although "Pushing and landing work" there lands rules, skills, hooks, and settings by pull request.
~~~

#### `<setup>references/notion.md`

**Line 7 · W4**
~~~text
OLD: The Notion skill sets hold the full Notion steps. Setup follows them; it never writes its own Notion calls.
NEW: The Notion skill sets hold the full Notion steps, and setup follows them. Setup's own Notion calls only read: `ntn whoami` and the two `ntn api v1/search` calls in "Where the project page goes".
~~~

**Line 37 · W3**
~~~text
OLD: Sharing the parent page once reaches every project under it.
NEW: Sharing the parent page once gives "Notion CLI" access to every project page under it.
~~~

**Line 49 · W6**
~~~text
OLD: (Mike asked, 2026-09-29, for his yes before this page is made in his real workspace.)
NEW: Delete the sentence. The rest of the bullet stays: "... every Notion project is then copied from it. Go ahead?"
~~~

**Line 51 · W2**
~~~text
OLD: - Test projects use only the private Notion test area, never his real pages unless he says so.
NEW: - When the owner says this project is a test, make its Notion pages only under the test page he names, never under his real pages unless he says so.
~~~

**Line 71 · W4**
~~~text
OLD: 3. Ask him one question, with a recommendation: "I'll add this project as a row of your Projects database (<link>). OK?" When he has none, list the pages ...
NEW: 3. Ask him one question, with a recommendation: "I'll add this project as a row of your Projects database (<link>). OK?" When more than one is left, list each with its link and ask which one, recommending the one that holds his other projects. When he has none, list the pages "Notion CLI" can see (`ntn api v1/search -d '{"filter":{"property":"object","value":"page"}}'`) and ask which one is his root page, recommending the page that holds his other projects.
~~~

**Line 109 · W4**
~~~text
OLD: The Notion setup files write a "Notion" block of links and ids into `PROJECT.md`, section "Toolkit settings", and read it back. ... - add the "Notion" block the setup files describe at the end of "Toolkit settings".
NEW: The Notion setup files give a "Notion" block of links and ids for `PROJECT.md`, section "Toolkit settings". In the project's `PROJECT.md`: (first two bullets unchanged) - add that "Notion" block once, at the end of "Toolkit settings", and read it back. The Notion skills read every id from it.
~~~

#### `<setup>references/hindsight.md`

**Line 33 · W4**
~~~text
OLD: - No answer: check the background service. (launchctl print ...) - Installed but stopped: ask the owner, then `launchctl kickstart -k ...` ... - Not installed: `installing-hindsight.md` in this folder.
NEW: - No answer: check the background service with `launchctl print gui/$(id -u)/local.toolkit-v2.hindsight`.
  - It prints the service: it is installed but stopped. Ask the owner, then `launchctl kickstart -k gui/$(id -u)/local.toolkit-v2.hindsight`, and check health again after about 10 seconds.
  - It says it could not find the service: it is not installed. `installing-hindsight.md` in this folder.
~~~

**Line 43 · W4**
~~~text
OLD: When Ollama is not running, tell the owner; it runs as a Homebrew service (`brew services start ollama`), which he may start himself.
NEW: When Ollama is not running, tell the owner; it runs as a Homebrew service. After his yes, run `brew services start ollama`, or he runs it himself.
~~~

**Line 52 · W3**
~~~text
OLD: Line 16: "- Choose and claim the bank"; line 52: "## Choose and claim the bank"; line 69: "3. Claim it at once:"
NEW: Line 16: "- Choose and create the bank"; line 52: "## Choose and create the bank"; line 69: "3. Create it at once:"
~~~

**Line 120 · W3**
~~~text
OLD: - Saving and answering take 10 to 30 seconds with the local model, longer when it is cold: the long timeouts leave room.
NEW: - Saving and answering take 10 to 30 seconds with the local model, and longer when the model is not loaded yet: the long timeouts allow for that.
~~~

**Line 149 · W4**
~~~text
OLD: - In the owner's next session, one `recall` call answers (an empty result is fine).
NEW: - One `recall` call answers (an empty result is fine). This check waits for the owner's next session, because the hosts load the `hindsight` server at session start: list it in the report as not checked yet.
~~~

#### `<setup>references/installing-hindsight.md`

**Line 85 · W4**
~~~text
OLD: 1. Wait about 30 seconds, then check `curl -s -m 2 http://127.0.0.1:8888/health`.
NEW: 1. Wait about 30 seconds, then check `curl -s -m 2 http://127.0.0.1:8888/health`. No answer yet: check again before you report a problem.
~~~

**Line 90 · W4**
~~~text
OLD: The three `LLM` settings stop it from trying OpenAI.
NEW: The `HINDSIGHT_API_LLM_PROVIDER`, `HINDSIGHT_API_LLM_MODEL`, and `HINDSIGHT_API_LLM_BASE_URL` settings stop it from trying OpenAI.
~~~
Note: these are the three names that start with `HINDSIGHT_API_LLM_`; confirm before applying.

#### `<setup>references/salesforce.md`

**Line 3 · W4**
~~~text
OLD: Line 3-4: "Purpose: the Salesforce facts setup records after the files are in place: the org aliases and the API version." Line 10-13: "Ask for them in the interview ... Write them in `PROJECT.md`, section "Toolkit settings", on the "Salesforce org aliases" line, one line per org ..."
NEW: Line 3-4: "Purpose: the Salesforce facts setup records: the org aliases, written while you build the setup copy, and the API version, written after the files are in place. Everything else a Salesforce project needs comes with the model: ..." (rest unchanged). Line 10-13: "Ask for them in the interview (`interview.md` in this folder, question 4). Write them while you build the setup copy (`setup-copy.md` in this folder, "The project name and "Toolkit settings""): in `PROJECT.md`, section "Toolkit settings", on the "Salesforce org aliases" line, one nested line per org: the alias, which org it is, and its purpose. Mark production. For example:"
~~~

**Line 40 · W4**
~~~text
OLD: A project that already had its own `sfdx-project.json` keeps its version.
NEW: A project that already had its own `sfdx-project.json` keeps its `sourceApiVersion`: skip step 1, leave `sfdx-project.json` as it is, and write that version in the `package.xml` only.
~~~

#### `<setup>references/update.md`

**Line 42 · W4**
~~~text
OLD: When the owner says the toolkit itself changed but this copy looks older, updating the plugin changes his computer: ask first.
NEW: When the owner says the toolkit itself changed but this skill's `assets/` folder does not have the change he names, updating the plugin changes his computer: ask first.
~~~

**Line 57 · W4**
~~~text
OLD: ...and compare and change them in the main checkout. The service steps (step 5) run there too.
NEW: ...and compare and change them in the main checkout. Run the service steps (step 5) from your worktree too, so a file they change, such as `.mcp.json`, `.codex/config.toml`, or `PROJECT.md`, is committed on your branch.
~~~
Note: the worktree reading matches "Run steps 2 to 4 there"; confirm before applying.

**Line 90 · W6**
~~~text
OLD: A project with no `owner-preferences.md` gets the setup copy's through the missing files row; one that has it is his: see the "His own records" row; never compare or change it.
NEW: A project with no `owner-preferences.md` gets the setup copy's through the missing files row; one that has it follows the "His own records" row.
~~~

**Line 94 · W4**
~~~text
OLD: Line 91: "Say in a few plain lines what changed; take the toolkit's after his yes." Lines 94-95: "Show every row that needs his answer in one numbered table, one line each with its reason, and ask once."
NEW: Line 91: "Say in one line what changed; take the toolkit's after his yes." Lines 94-95: "Show every file that needs his answer in one numbered table, one line per file with its reason, and ask once. Carry out what he says yes to."
~~~

**Line 122 · W4**
~~~text
OLD: Run the final checks in `finishing.md`, and the check that each of the toolkit's hook handlers is there once (`skills-hooks-settings.md`, "Check", on the project's own settings files).
NEW: Run the final checks in `finishing.md` from your worktree, except the checks on `memory/` and `work-items/`, which run in the main checkout. Also run the check that each of the toolkit's hook handlers is there once (`skills-hooks-settings.md`, "Check", on the worktree's own settings files).
~~~

**Line 146 · W4**
~~~text
OLD: 2. Change the line in `PROJECT.md`, "Toolkit settings".
NEW: 2. Make your own worktree and branch, as "Before you start" says, and change the line in `PROJECT.md`, "Toolkit settings", there.
~~~

**Line 157 · W3**
~~~text
OLD: 5. Move the records one at a time, with a preview of each and his yes, and read each one back where it landed. Nothing is deleted from the old store.
NEW: 5. Move the records one at a time, with a preview of each and his yes, and read each one back in its new place. Nothing is deleted from the old tracker or memory system.
~~~

### 3.4 braindump (`<shared>braindump/SKILL.md`)

**Line 11 · W3**
~~~text
OLD: Line 11: "understood, in words a five year old could follow, and wait for a yes." Line 59: "- Explain it as you would to a five year old: short sentences, everyday words,"
NEW: Line 10-11: "The owner pasted or spoke a loose dump of what they want. Say back what you understood, in very simple words, and wait for a yes." Line 59-60: "- Use very simple words: short sentences, everyday words, no jargon the owner did not use first."
~~~

**Line 16 · W3**
~~~text
OLD: 2. **The big idea first.** One or two sentences: what the owner is really after, underneath the words.
NEW: 2. **The goal first.** One or two sentences: what the owner wants to achieve, even where the dump does not say it directly.
~~~

**Line 27 · W4**
~~~text
OLD: 7. **After a yes**, the confirmed playback is the agreed scope; do not quietly go past it. Hand it to the skill that fits (Claude Code: the Skill tool; Codex: read its `SKILL.md` from the skill list): a rough idea or new piece of work to plan goes to `work-refine`; a clear change to build goes to `work-on`.
NEW: 7. **After a yes**, the confirmed playback is the agreed scope; ask the owner before doing any work outside it. If the project's `AGENTS.md` names a skill for the confirmed work, open it (Claude Code: the Skill tool; Codex: read its `SKILL.md` from the skill list). For example, a rough idea or new piece of work to plan goes to `work-refine`, and a clear change to build goes to `work-on`.
~~~

**Line 38 · W4**
~~~text
OLD: - An ordinary short request is not a dump. Do the request instead of playing it back.
NEW: - A short request (one or two sentences) that does not ask for a playback is not a dump. Do the request instead of playing it back.
~~~

**Line 40 · W6**
~~~text
OLD: - Keep every number, name, file path, and system from the dump. Simpler words never mean fewer facts.
NEW: Delete lines 40-41. The rule stays in "The words", lines 61-62.
~~~

**Line 46 · W4**
~~~text
OLD: - A reminder that a memory save may be due waits for the yes. Name the thing to keep in the playback; after his yes, save it with the project's memory save skill (a Hindsight project: Hindsight's retain tool, as the memory rule says).
NEW: - If a hook reminder says something may be worth keeping, save nothing before the owner's yes to the playback. Name the thing to keep in the playback. After his yes, open the project's memory save skill with it; that skill follows its own approval rules. A Hindsight project has no memory save skill: use Hindsight's `retain` tool, as the memory rule says.
~~~

**Line 63 · W4**
~~~text
OLD: - A technical name that cannot be avoided keeps its exact spelling and gets a few plain words right after it saying what it is.
NEW: - A technical name that cannot be avoided keeps its exact spelling and gets four plain words right after it saying what it is.
~~~

**Line 69 · W3**
~~~text
OLD: This skill owns only the moment before work starts.
NEW: This skill applies only until the owner says yes to the playback.
~~~

**Line 70 · W6**
~~~text
OLD: Once the owner confirms, the project's own rules and skills apply as normal: `work-refine` turns a rough idea into a work item's goal, requirements, and roadmap, and `work-on` builds a work item that is ready.
NEW: Once the owner confirms, the project's own rules and skills apply.
~~~
Note: when applied together with line 69, "After his yes, the project's own rules and skills apply." reads better. The gotcha at lines 44-45 also changes (2.17).

### 3.5 explain-simply (`<shared>explain-simply/SKILL.md`)

**Line 13 · W4**
~~~text
OLD: If nothing was named, your own last substantial answer in this conversation.
NEW: If nothing was named, your own most recent answer in this conversation that explained or reported something, not one that only acknowledged or asked a question.
~~~

**Line 19 · W4**
~~~text
OLD: About 25 bullets at most.
NEW: 25 bullets at most, so it fits on one screen.
~~~
Note: apply together with line 38.

**Line 33 · W4**
~~~text
OLD: - Do not run a new search or command to improve the answer. New findings change the facts the owner is trying to follow.
NEW: - Beyond reading the source that step 1 names, do not run a new search or command to improve the answer. New findings change the facts the owner is trying to follow.
~~~

**Line 38 · W6**
~~~text
OLD: - No paragraphs anywhere, including under headings.
- If a bullet needs a second line, it is two bullets.
(...)
- It fits on one screen.
NEW: Lines 18-19 become: "2. **Bullets only, no paragraphs.** One idea per bullet, one line per bullet (a bullet that needs a second line becomes two bullets), in 4 to 6 groups under short bold headings. 25 bullets at most, so it fits on one screen." Delete lines 38, 39, and 42. "The shape" keeps only: "- Each group heading is a short plain phrase, not a label like "Overview" or "Summary"."
~~~

**Line 58 · W6**
~~~text
OLD: - No jargon the owner did not use first. No figures of speech. No nicknames you made up. No bare letters or numbers standing in for a thing ("option B", "risk 1").
NEW: - No jargon the owner did not use first. No figures of speech. No nicknames you made up.
~~~

**Line 67 · W3**
~~~text
OLD: - Never smooth over a gap to make the bullets read better.
NEW: - Never hide a gap or make it sound smaller to make the bullets read better.
~~~

**Line 68 · W4**
~~~text
OLD: - If the source is long and you left things out, say what you left out in one bullet rather than dropping it without a word.
NEW: - If you left part of the source out to stay within 25 bullets, say in one bullet what you left out.
~~~

**Line 74 · W4**
~~~text
OLD: The "Example shape" block has three groups: "**The problem**", "**The idea**", "**The safety rules**".
NEW: Insert a fourth group after line 89, before "What I need from you:":

**What is still unknown**

- The board export has no Item ID column, so I cannot link each folder to its board row yet.
~~~

**Line 88 · W3**
~~~text
OLD: - The target org is live, so I never write to it. You press the button.
- A piece only exists if it points at real proof. No proof, no piece.
NEW: - The target org is your live Salesforce system, so I never write to it.
- You make every change there yourself.
- Each piece must link to real proof, or I do not make it.
~~~

### 3.6 session-summary (`<shared>session-summary/SKILL.md`)

**Line 13 · W4**
~~~text
OLD: 1. **Read this conversation only.** List the owner's real requests, not the steps taken to do them (see "Count the asks, not the steps").
NEW: 1. **Read this conversation only.** When the owner names a transcript, log, or exported chat, read that instead (see "Summarizing a session other than this one"). List the owner's real requests, not the steps taken to do them (see "Count the asks, not the steps").
~~~

**Line 16 · W3**
~~~text
OLD: Column name `Where it landed` (lines 16, 37, 100, 121), "where each one landed" (description, line 3), "Some landed." (line 86), "Where work landed, name it ..." (line 111).
NEW: Line 3: see the merged description in 2.30. Lines 15-16: "Columns `#`, `What you asked`, `Status`, `Result`." Lines 37-38: "it goes in the `Result` cell of the request it came from." Line 86: "| Partly done | ⏳ **Partly done** | Some of it is finished. Say what is left |". Line 100: "and belongs in `Result`." Lines 111-112: "In the `Result` cell, name the place that holds the work the way the project names it: the work item id (for example `WI-014`), the pull request number, the file path, or "saved to memory"." Line 121: "| # | What you asked | Status | Result |".
~~~
Note: the description change needs the overlap review and the routing test. The line 86 change can be applied even if the rename waits.

**Line 21 · W4**
~~~text
OLD: 4. **Point elsewhere only when it fits.** If the owner asked about the whole project, say in one line that `work-status` answers that. When a request is still open and is recorded nowhere, end the open block with one offer: ... Offer once.
NEW: 4. **Name another skill only in these two cases.** If the owner asked about the whole project, end the open block with one line saying that `work-status` answers that. When a request is still open and nothing in this conversation shows it saved as a work item or in Current State, end the open block with one offer that covers every such request: turn each into a work item (the project's work track skill) or an untracked to-do in Current State (the project's memory save skill; a Hindsight project: edit `memory/CURRENT_STATE.md` directly). `AGENTS.md` names both skills. Make the offer once; do not repeat it later in this conversation.
~~~

**Line 28 · W4**
~~~text
OLD: 5. **Change nothing.** No files, work items, or memory are written. If the owner says yes to the offer, the skill the offer names makes the change.
NEW: 5. **Change nothing.** No files, work items, or memory are written. If the owner says yes to the offer, make each change he chose with the skill the offer names for it (an untracked to-do in a Hindsight project: edit `memory/CURRENT_STATE.md` directly).
~~~

**Line 33 · W6**
~~~text
OLD: - A row is a request, not a step. The owner picking one of your options or answering your question is part of the request that caused it, not a new row.
NEW: Delete lines 33-35.
~~~

**Line 42 · W6**
~~~text
OLD: ## Why this shape

People ask for this when they have lost the thread, ... to find the one item that needs them.
NEW: Delete lines 42-49 (the whole "Why this shape" section).
~~~

**Line 65 · W3**
~~~text
OLD: - The owner confirming, correcting, or nudging work already under way.
NEW: - The owner confirming, correcting, or adjusting work already under way.
~~~

**Line 69 · W3**
~~~text
OLD: If a cell starts turning into its own list, you have gone a level too deep. Collapse it.
NEW: If a cell starts to become a list of separate pieces of work, replace the list with one short statement of the whole request's result.
~~~

**Line 79 · W6**
~~~text
OLD: Use these, and only these. Each is written with its symbol in front and the word in bold. (...) Line 93: The eight words do not change, and no ninth one gets invented.
NEW: Lines 79-80: "Each status is written with its symbol in front and the word in bold." Delete line 93.
~~~

**Line 100 · W4**
~~~text
OLD: Short, not reworded.
NEW: Keep the `What you asked` cell short: use the owner's own words, cut down to the part that says what he asked for, and do not rewrite them in your words.
~~~

**Line 102 · W4**
~~~text
OLD: Bold one phrase where it carries the point. Bold everywhere is bold nowhere.
NEW: Apart from the status words, bold only the one phrase the owner most needs to see, as the first line of the open block is bold in the example.
~~~

**Line 108 · W6**
~~~text
OLD: A request recorded as done when it was only attempted turns into a wrong assumption weeks later.
NEW: Delete the sentence. Lines 106-108 stay: "The status says what actually happened, not what was attempted or intended. If something failed, was skipped, was only partly checked, or was never run, the row says so."
~~~

**Line 114 · W4**
~~~text
OLD: If part of the session is no longer visible to you (context was trimmed or summarized), say that as a final row instead of guessing. An invented request ruins the whole table.
NEW: If part of the session is no longer visible to you (context was trimmed or summarized), add a final row instead of guessing: its `What you asked` cell reads "Earlier requests I can no longer see", and its `Status` cell and its last cell stay empty. Never invent a request.
~~~

**Line 128 · W3**
~~~text
OLD: | 6 | Merge it | ✅ **Done** | Pull request 29 is in main. Two other pull requests landed first, so the branch had to be brought current. |
NEW: | 6 | Merge it | ✅ **Done** | Pull request 29 is in main. Two other pull requests were merged first, so the branch had to be updated with main. |
~~~

**Line 134 · W8**
~~~text
OLD: **Another session has a half-finished merge in the shared checkout.**
Two work-item files are in conflict. I did not touch it.

1. The shared checkout will not show these rule changes until that session
   finishes and pulls.
2. My worktree `.claude/worktrees/rule-consolidation` and its branch are still
   there. Say the word once that merge is done and I will remove both.
NEW: **Another session has a half-finished merge in the main project folder.**
Two work item files there have conflicting changes. I did not touch it.

1. The main project folder will not show these rule changes until that
   session finishes its merge and gets the latest changes.
2. My worktree (a separate project copy) at `.claude/worktrees/rule-consolidation`
   and its branch are still there. Tell me once that merge is done, and I
   will remove both.
~~~

### 3.7 handoff (`<shared>handoff/`)

#### `SKILL.md`

**Line 3 · W7** (description)
~~~text
OLD: Updates the active work item and Current State, offers anything worth keeping to memory, ...
NEW: Updates this session's work items and Current State, offers anything worth keeping to memory, then writes a checked, self-contained prompt for a new session, or checks a pasted one, so nothing is lost when context clears. Use when the owner says "write a handoff", "I'm clearing context", "start a new session", or "check this handoff". Not for a recap alone; use session-summary.
~~~
Note: combined with 2.8 this is 400 characters, one over the limit. Use the merged text in 2.30. Change `dev/SKILL-INDEX.md` to match, then the overlap review and the routing test.

**Line 11 · W4**
~~~text
OLD: Never stop the owner from clearing context.
NEW: Never ask the owner to wait before he clears context, and never hold back the prompt because a save or the check failed.
~~~

**Line 24 · W4**
~~~text
OLD: Only items this session worked on: those named in the conversation, the one this worktree's branch names
NEW: Only items this session worked on: those the conversation worked on (an item that is only mentioned or listed, for example in the work find skill's results, does not count), the one this worktree's branch names
~~~

**Line 26 · W3**
~~~text
OLD: Never pick an item only because it is open: another session may own it.
NEW: Never pick an item only because it is open: another session may be working on it.
~~~

**Line 29 · W3**
~~~text
OLD: Read each one fresh first with the work find skill. (lines 29-30); and line 58: Read it fresh, then:
NEW: Lines 29-30: "Right before you change each one, read it with the work find skill." Line 58: "Read Current State right before you change it, then:"
~~~

**Line 38 · W4**
~~~text
OLD: Waiting on, Blockers, and Last updated match.
NEW: Waiting on matches `waiting_on`; Blockers names what blocks the item, or "None."; Last updated is today's date and who changed it (the agent).
~~~

**Line 43 · W4**
~~~text
OLD: Read it back and compare it with what you meant to save.
NEW: Read the item back and compare it with what you meant to save.
~~~

**Line 48 · W4**
~~~text
OLD: For a decision, ask "This looks project-wide. Save it to memory too?" Hand each one to the memory save skill; it picks the home and asks the owner.
NEW: For a decision, ask "This looks project-wide. Save it to memory too?" and, on his yes, hand it to the memory save skill; his yes is the approval it needs, so it does not ask again. Hand each other one to the memory save skill too; it decides where each one is saved and asks the owner when its approval rules say to. Hindsight: `retain` a fact or decision after his yes, and write an instruction straight into `.claude/rules/owner-preferences.md`.
~~~

**Line 56 · W4**
~~~text
OLD: Notion memory: the "Current state" page, with the Current state steps in `notion-memory-save`.
NEW: Notion memory: the "Current state" page. Open `notion-memory-save` (see "Opening another skill"). Follow its `references/notion-access.md` to sign in and, in Codex, to run `ntn`, and its `references/current-state.md` to change the page. Make no memory record.
~~~

**Line 65 · W7**
~~~text
OLD: Remove every line that is no longer true: a finished or cancelled item under Now
NEW: Remove every line that is no longer true: an item under Now that is Done or Cancelled
~~~

**Line 68 · W4**
~~~text
OLD: Add this session's items under Now when they are missing
NEW: Add this session's items that are not Done or Cancelled under Now when they are missing
~~~

**Line 72 · W4**
~~~text
OLD: (`references/decisions-and-memory.md`, section 10). Read it back.
NEW: (`references/decisions-and-memory.md`, section 10). Read Current State back.
~~~

**Line 74 · W7**
~~~text
OLD: Keep a source kind for every claim (file, repository, owner, worked out).
NEW: Keep a source for every claim: its kind (file, repository, owner, worked out) and, for a file or repository claim, where it is (for example "file, WI-007 front matter"); for an owner claim, his words when you have them.
~~~

**Line 80 · W4**
~~~text
OLD: If it fails or cannot start, say so in one line, write the prompt anyway, and say inside it that it was not checked.
NEW: If the verifier stops with an error, returns no report, or fails to start, say so in one line, write the prompt anyway, and say inside the prompt that it was not checked. If this host has no tool that starts a helper, follow `references/edge-cases.md`.
~~~
Note: apply together with `edge-cases.md` line 21.

**Line 82 · W4**
~~~text
OLD: Act on every verdict, then check again only the sections you rewrote:
NEW: Act on every verdict as below. Start a second verifier only when you rewrote a whole section. In its job block, put the Goal section and each rewritten section under "Draft prompt". Never start a third. The verdicts:
~~~

**Line 93 · W2**
~~~text
OLD: 3. The verifier's short list, one line each.
NEW: 3. The short list: "Checked the handoff prompt: <n> fixed, <n> not confirmed.", then one line for each claim you fixed, each claim you labeled "not confirmed", and each check that was skipped (see `examples/handoff-example.md`).
~~~

**Line 99 · W7**
~~~text
OLD: with "no sources offered" for every claim.
NEW: with "Sources for claims: none given" in the job block.
~~~

**Line 100 · W4**
~~~text
OLD: Fix what is Wrong, label what is Unchecked, add a Missing goal, and put the fixed first line on top if it is missing.
NEW: Fix what is Wrong, label what is Unchecked, add a Missing goal (when neither this conversation nor the work item the prompt names shows the goal, ask the owner for it in one question), and put the fixed first line on top if it is missing.
~~~

**Line 111 · W7**
~~~text
OLD: `work-items/` and `memory/` live only in the main checkout (the first path `git worktree list` prints), and Git ignores them.
NEW: `work-items/` and `memory/` live only in the main checkout (the first path `git worktree list` prints; `references/handoff-verifier.md` calls it the primary checkout), and Git ignores them.
~~~

**Line 119 · W3**
~~~text
OLD: carry its content in the prompt (line 119); and line 132: carry what it would have saved in the prompt
NEW: Line 119: "put its content in the prompt". Line 132: "put what it would have saved in the prompt".
~~~

**Line 143 · W3**
~~~text
OLD: Anything off the normal path:
NEW: A situation the steps above do not cover:
~~~

#### `references/prompt-format.md`

**Line 10 · W4**
~~~text
OLD: It reads `AGENTS.md` and gets Current State from the session-start hook, and nothing else.
NEW: It reads `AGENTS.md` and the files `AGENTS.md` tells it to read, and gets Current State from the session-start hook.
~~~

**Line 25 · W7**
~~~text
OLD: The verifier does not score it.
NEW: The verifier does not check it as a claim.
~~~

**Line 35 · W3**
~~~text
OLD: 2. **Your task.** What the new session does next, its scope, and what finished looks like.
NEW: 2. **Your task.** What the new session does next, its scope, and how to tell it is finished.
~~~

**Line 44 · W4**
~~~text
OLD: Include what he declined or cut, and why where it matters.
NEW: Include every memory save he declined or cut in `SKILL.md` step 3, unless he asked not to keep it. Use your judgment: give the reason for a decision when, without it, the next session could reverse or redo the decision.
~~~

**Line 48 · W4** (the signs)
~~~text
OLD: 7. **Repository**, only when another session works in the same repository: this session's worktree folder and branch, so the next session does not assume it owns the checkout.
NEW: 7. **Repository**, only when another session works in the same repository (the signs, from `.claude/rules/shared-repository-work.md`: an unknown worktree, a moved branch, or a change you did not make): this session's worktree folder and branch, so the next session knows it is not the only session in the repository.
~~~
Note: the template fill-in guide (line 3) and `edge-cases.md` line 27 use the same condition; give them the same signs. If Mike says yes to the next finding, its text replaces this one.

**Line 48 · W4 · Mike decides (section 4)** (the case with no rule)
~~~text
OLD: 7. **Repository**, only when another session works in the same repository:
NEW: 7. **Repository**, when this session worked in its own worktree, or another session works in the same repository (the signs, from `.claude/rules/shared-repository-work.md`: an unknown worktree, a moved branch, or a change you did not make): this session's worktree folder and branch, and where any other session works.
~~~

**Line 71 · W4**
~~~text
OLD: Say inside the prompt which facts were saved nowhere.
NEW: Write "saved nowhere" beside each fact that no file, work item, memory record, or rule holds.
~~~

**Line 72 · W4**
~~~text
OLD: No line that credits an AI.
NEW: No line that credits an AI. The fixed first line is a notice, not a credit; it always stays.
~~~

#### `assets/handoff-prompt-template.md`

**Line 3 · W4**
~~~text
OLD: Put "not confirmed" beside any fact no file records.
NEW: Put "not confirmed" beside any claim that no file, work item, memory record, or repository fact (a branch, commit, pull request, issue, or command output from this session) confirms.
~~~

**Line 11 · W3**
~~~text
OLD: <What the new session does next, its scope, and what finished looks like.>
NEW: <What the new session does next, its scope, and how to tell it is finished.>
~~~

**Line 17 · W4**
~~~text
OLD: 3. <The files being changed, with the line to start from when it matters.>
NEW: 3. <The files being changed, with the line to start from.>
~~~

**Line 21 · W7**
~~~text
OLD: - <A decision nobody saved, with its source ("owner, this session" or "worked out, this session") and "not confirmed in any file". Include what the owner declined or cut, and why where it matters. Write "None." when every decision is saved.>
NEW: - <A decision nobody saved, with its source ("owner, this session" or "worked out, this session") and "saved nowhere". Include every memory save the owner declined or cut in `SKILL.md` step 3, unless he asked not to keep it. Use your judgment: give the reason for a decision when, without it, the next session could reverse or redo the decision. Write "None." when nothing is left unsaved.>
~~~

**Line 33 · W4**
~~~text
OLD: <Only when another session works in the same repository: the worktree folder and branch this session used, and that another session works in the primary checkout.>
NEW: <Only when another session works in the same repository: the worktree folder and branch this session used, and where the other session works (the main checkout, or its worktree folder).>
~~~
Note: if Mike says yes to the second `prompt-format.md` line 48 finding, change this condition to match.

#### `examples/handoff-example.md`

**Line 4 · W7**
~~~text
OLD: Another session works in the primary checkout. (line 4, and the same sentence at line 80)
NEW: Line 4 and line 80: "Another session works in the main checkout."
~~~

**Line 59 · W1**
~~~text
OLD: 2. The design beside it: Option A is approved.
NEW: 2. `DESIGN.md` in WI-007's folder: Option A is approved.
~~~

**Line 70 · W4**
~~~text
OLD: - The bank rejects files over 5 MB (worked out, this session; not confirmed).
NEW: - The bank rejects files over 5 MB (worked out, this session; saved nowhere; not confirmed). The owner confirms or corrects it.
~~~

#### `references/edge-cases.md`

**Line 3 · W3**
~~~text
OLD: Open this file when a handoff does not follow the normal path in `SKILL.md`.
NEW: Open this file when a handoff meets a situation the steps in `SKILL.md` do not cover.
~~~

**Line 8 · W2**
~~~text
OLD: Skip step 2. Put the continuation in "Next session starts with" as a short note. Do not make a work item to hold it.
NEW: Skip step 2. Put the goal, where work stopped, the next action, and open questions in "Next session starts with" as a short note (`SKILL.md` step 4). Do not make a work item to hold it.
~~~

**Line 9 · W4**
~~~text
OLD: The work track skill refuses a stage move (a `build` or `data-load` item past stage `03` with no requirements approval)
NEW: The work track skill refuses a stage move (a `build` or `data-load` item moved to stage `03-requirements-approved` or later with no requirements approval)
~~~

**Line 10 · W4**
~~~text
OLD: Save nothing. Carry the declined items in the prompt unless he asked not to keep them.
NEW: Save nothing to memory; still do steps 2 and 4. Put the declined items under "Decisions not yet saved" in the prompt, unless he asked not to keep them.
~~~

**Line 11 · W3**
~~~text
OLD: Carry the cut ones in the prompt.
NEW: Put the cut ones under "Decisions not yet saved" in the prompt.
~~~

**Line 14 · W4**
~~~text
OLD: | Notion does not answer, or `ntn` is not signed in | "Not saved" for that write, with the reason. Carry its content in the prompt. The owner signs in; the next session saves it. |
NEW: | A Notion call gets no reply, or `ntn` is not signed in | "Not saved" for that write, with the reason. Put its content in the prompt, and write in the prompt that the next session saves it. When `ntn` is not signed in, tell the owner to sign in. |
~~~

**Line 15 · W4**
~~~text
OLD: Do not make one in a new format. Say so, suggest `project-setup` ("check the setup"), and carry the entry in the prompt.
NEW: Do not create it yourself. Say so, suggest `project-setup` ("check the setup"), and put the entry in the prompt.
~~~

**Line 16 · W7** (the saves lines)
~~~text
OLD: Replace it anyway and say so in the short list. That item's own Current state still holds its continuation.
NEW: Replace it anyway and say so in the saves lines (`SKILL.md` step 7). That item's own Current state still says where to resume it.
~~~
Note: the next finding changes the same cell; merge the two if Mike says yes.

**Line 16 · W4 · Mike decides (section 4)** (a note with no work item)
~~~text
OLD: | The old "Next session starts with" points at other work still in progress | Replace it anyway ... That item's own Current state still holds its continuation. |
NEW: Add to the cell: "When the old line is a note for work that has no work item, keep it: move it as one line under Untracked to-dos before you replace it."
~~~

**Line 17 · W8**
~~~text
OLD: Tell him Current State needs the memory refine skill (Hindsight: offer to prune the file with him).
NEW: Tell him Current State is still too long, and that saying "refine memory" cleans it up (Hindsight: offer to shorten the file with him now).
~~~
Note: this replaces only the cell's second sentence; "Never drop an open owner to-do to meet a limit: offer him a work item for it." stays.

**Line 19 · W4**
~~~text
OLD: | The goal points at a work item ID or file that does not exist | Keep the goal, label it "not confirmed", and say so in the short list. |
NEW: | The goal points at a work item ID or file that does not exist | Keep the goal and label it "not confirmed". Correct the pointer to the right ID or file, or remove it when there is none. Say so in the short list. |
~~~

**Line 20 · W3**
~~~text
OLD: Check every carried-over fact from scratch.
NEW: Check each fact taken from the earlier prompt against its file or record.
~~~

**Line 21 · W4**
~~~text
OLD: | The verifier fails, errors, or cannot start | ... | (line 21) and | This host cannot start a helper at all | Do the check yourself ... | (line 22)
NEW: Line 21, first cell: "The verifier stops with an error, returns no report, or fails to start". Line 22, first cell: "This host has no tool that starts a helper".
~~~
Note: apply together with `SKILL.md` line 80.

**Line 23 · W4**
~~~text
OLD: | `/handoff` runs twice in a row | Do not save again what is already saved. Update only what changed, then draft and check again. |
NEW: | The owner asks for a second handoff in the same session | Do not save again what is already saved. Update only what changed since the first handoff, then draft a new prompt and check it again. |
~~~

**Line 24 · W4**
~~~text
OLD: | The session was short and produced nothing | Say so. Write a short prompt only if the owner still wants one. Do not pad it. |
NEW: | The session changed no file, work item, or memory, and settled nothing | Say so in one line and ask whether he still wants a prompt. If he does, keep it short: do not add a line only to make it longer. |
~~~

**Line 25 · W3**
~~~text
OLD: His call. (line 25 and line 26)
NEW: Line 25 and line 26: "Do what he asks."
~~~

### 3.8 merge-and-clean-up (`<shared>merge-and-clean-up/`)

#### `SKILL.md`

**Line 3 · W3** (description)
~~~text
OLD: so nothing unchecked lands
NEW: so nothing unchecked is merged
~~~
Note: included in the 2.1 text. Change `dev/SKILL-INDEX.md` row 60 in the same commit.

**Line 10 · W3, W6, W7**
~~~text
OLD: Land one exact pull request, prove it merged, then remove only the workspace that belonged to it. Merge and cleanup are one guarded workflow.
NEW: Merge one exact pull request, confirm GitHub reports it merged, then remove only its worktree and branches.
~~~

**Line 19 · W4 · Mike decides (section 4)**
~~~text
OLD: The local head branch, when it exists, must be at that commit.
NEW: The local head branch, when it exists, must be at that commit. If it is not, the branch may hold work that is not in the pull request: stop before step 2, keep the branch, and tell the owner.
~~~
Note: same question as `merge-steps.md` line 38; both get the same answer.

**Line 27 · W2, W3**
~~~text
OLD: 3. **Preflight on GitHub:**
NEW: 3. **Check the pull request on GitHub:**
~~~

**Line 29 · W4**
~~~text
OLD: The head worktree is clean.
NEW: When a worktree holds the head branch, it is clean; uncommitted changes there stop the merge.
~~~
Note: apply together with `merge-steps.md` line 91.

**Line 34 · W4**
~~~text
OLD: 5. **Merge** with `gh pr merge <n> --repo <owner/repo> --squash --delete-branch --match-head-commit <headRefOid>`, using the head commit recorded in step 1 and no admin flag.
NEW: 5. **Merge** with `gh pr merge <n> --repo <owner/repo> --squash --delete-branch --match-head-commit <headRefOid>`, using the head commit recorded in step 1 and no admin flag. Change the method flag, or leave out `--delete-branch` for a fork, only as `references/merge-steps.md`, step 5, says.
~~~
Note: replace only this sentence; "Then confirm with `gh pr view` that the state is `MERGED`." stays.

**Line 38 · W7**
~~~text
OLD: **Fast-forward the base checkout** (`git pull --ff-only`)
NEW: **Fast-forward the base worktree** (`git pull --ff-only` in the worktree holding the base branch)
~~~

**Line 43 · W3, W4**
~~~text
OLD: 7. **Work item note and report.** Came here from `work-finish`: give it the merge commit and add nothing to the item. The owner asked for this merge directly: add one Recent History row with the project's work track skill. Report the link, the merge commit, and the cleanup result. Stage moves and Done stay with `work-finish`.
NEW: 7. **Work item note and report.** Came here from `work-finish`: add nothing to the item; `work-finish` adds the Recent History row. Say the pull request link, the merge commit, and the cleanup result in the reply, then go on with the rest of `work-finish` step 3. The owner asked for this merge directly: add one Recent History row with the project's work track skill, then report the link, the merge commit, and the cleanup result. Never change the item's stage or mark it Done; `work-finish` does that.
~~~

**Line 51 · W4**
~~~text
OLD: Codex keeps `.git/` read-only and turns the network off. Every Git write here (`git fetch`, `git pull`, `git push`, `git worktree remove`, `git branch -d`) and every `gh` call runs alone, with `sandbox_permissions` set to `require_escalated` and a one-line reason. Refused without asking: show the owner the exact command and wait (`references/git-rules.md`, "Git writes in Codex").
NEW: Codex keeps `.git/` read-only and turns the network off. Every Git write here (`git fetch`, `git pull`, `git push`, `git worktree remove`, `git worktree prune`, `git branch -d`, `git branch -D`) and every `gh` call runs alone, with `sandbox_permissions` set to `require_escalated` and a one-line reason. Codex refuses one without asking the owner ("approval required by policy"): show the owner the exact command and wait (`references/git-rules.md`, "Git writes in Codex").
~~~

**Line 57 · W4, W3, W7**
~~~text
OLD: No remote (`git remote` prints nothing): there is no pull request, so this skill does not apply. Never run `git fetch`, and never report a fetch refusal as a blocker. Say so in one line; the local merge of a work item's branch belongs to `work-finish` (`references/git-rules.md`, "A project with no remote").
NEW: No remote (`git remote` prints nothing): there is no pull request, so this skill does not apply. Never run `git fetch`, and never report a failed fetch as a blocker. Tell the owner in one line that this skill does not apply; `work-finish` does the local merge of a work item's branch (`references/git-rules.md`, "A project with no remote").
~~~

**Line 62 · W6**
~~~text
OLD: The owner's result approval of a work item never covers the merge. The merge needs its own yes, or the standing merge instruction with every condition holding on this exact head.
NEW: The owner's result approval of a work item never covers the merge (step 2).
~~~

**Line 65 · W4**
~~~text
OLD: A refusal means a new commit arrived: stop, and run steps 1 to 4 again on the new head.
NEW: A refusal because the head no longer matches means a new commit arrived: stop, and run steps 1 to 4 again on the new head. Any other refusal: stop and tell the owner the error.
~~~

**Line 69 · W4, W3 · Mike decides (section 4)**
~~~text
OLD: `gh pr merge` does not always merge. When required checks have not passed it turns on auto-merge. On a base branch with a merge queue it refuses `--delete-branch`, and without that flag it only adds the pull request to the queue. Either way the state is not `MERGED`: remove nothing, and report where it stands.
NEW: `gh pr merge` does not always merge. When required checks have not passed, it turns on auto-merge. On a base branch with a merge queue, it refuses `--delete-branch`; without that flag it only adds the pull request to the queue, so do not run it again without the flag unless the owner says to. In each case the state is not `MERGED`: remove nothing, and tell the owner the pull request's state (auto-merge on, in the merge queue, or merge refused).
~~~

**Line 74 · W4**
~~~text
OLD: A squash merge leaves the old branch commit outside the base, so `git branch -d` can refuse after a good merge.
NEW: A squash merge leaves the old branch commit outside the base, so `git branch -d` can refuse after a successful merge.
~~~

**Line 77 · W4, W3**
~~~text
OLD: Pass `--repo` to every `gh pr` command. With it, `gh pr merge` deletes only the remote branch; the local branch and worktree go in step 6, after the proofs.
NEW: Pass `--repo` to every `gh pr` command that names the pull request number (every one except the first `gh pr view` in step 1, which finds the number from the current branch). With it, `gh pr merge` deletes only the remote branch; the local branch and worktree are removed in step 6, after the proofs.
~~~

**Line 86 · W4**
~~~text
OLD: Read the project's `AGENTS.md` and `.claude/rules/` first. Project rules decide required checks, merge method, and who may merge.
NEW: Before step 1, read the project's `AGENTS.md` and `.claude/rules/`. Project rules decide required checks, merge method, and who may merge.
~~~

**Line 95 · W2, W4**
~~~text
OLD: If any proof is missing, stop at the safe point and report exactly what remains.
NEW: If any proof is missing, remove nothing more, and tell the owner which proof failed and exactly which branch, worktree, or remote branch is still there.
~~~

#### `references/merge-steps.md`

**Line 38 · W4 · Mike decides (section 4)**
~~~text
OLD: If the local head branch exists, its commit must equal `headRefOid` before you promise it can be deleted. A different commit means local-only work exists: stop and keep it.
NEW: If the local head branch exists, its commit must equal `headRefOid`. A different commit means the branch may hold work that is not in the pull request: stop before step 2, keep the branch, and tell the owner.
~~~

**Line 68 · W4**
~~~text
OLD: When neither is present, stop and ask the owner. `work-finish` asks for this approval; this skill only checks it.
NEW: When neither is present, stop and ask the owner. When you came here from `work-finish`, it has already asked for the owner's yes or checked the standing merge instruction.
~~~

**Line 71 · W2, W3**
~~~text
OLD: ## Step 3: preflight
NEW: ## Step 3: check the pull request on GitHub
~~~
Note: make the same change to the contents list on line 11.

**Line 88 · W4**
~~~text
OLD: Pending checks: wait only when the owner asked you to finish the merge.
NEW: Pending checks: when the owner asked you to finish the merge, wait with `gh pr checks <number> --repo <owner/repo> --watch`, then run step 3 again. Otherwise stop and tell the owner which checks are still running.
~~~

**Line 91 · W4**
~~~text
OLD: The head worktree must be clean before merging: ... Any output blocks cleanup. Do not stash or discard it.
NEW: When a worktree holds the head branch, it must be clean before merging:

```text
git -C <head-worktree> status --porcelain
```

Any output stops the merge and the cleanup: tell the owner. Do not stash or discard it.
~~~

**Line 114 · W4**
~~~text
OLD: With no local head branch, use `origin/<head-branch>` in the diff.
NEW: With no local head branch, use `origin/<head-branch>` in the diff. For a pull request from a fork, list its files with `gh pr diff <number> --repo <owner/repo> --name-only` instead.
~~~

**Line 121 · W4, W5**
~~~text
OLD: Use the merge method the owner or the project requires. When neither says: squash for a normal single-purpose branch; a merge commit when the commit structure matters; ask when the choice would change history in a way that matters.
NEW: Use the merge method the owner or the project's rules name. When neither names one, use your judgment: squash (`--squash`) a branch with one purpose; use a merge commit (`--merge`) when the branch's separate commits must stay in the base branch's history; ask the owner when you cannot tell which applies.
~~~

**Line 132 · W4**
~~~text
OLD: A refusal means someone pushed after the checks: stop, report the new commit, and run steps 1 to 4 again on it.
NEW: A refusal because the head no longer matches means someone pushed after the checks: stop, report the new commit, and run steps 1 to 4 again on it. Any other refusal: stop and tell the owner the error.
~~~

**Line 134 · W4 · Mike decides (section 4)**
~~~text
OLD: The standing merge instruction covers only the head its independent check saw.
NEW: The standing merge instruction covers only the head its independent check saw, and the owner's own yes covers only the head he was shown: for a new head, ask him again unless the standing instruction's three conditions hold on it.
~~~

**Line 137 · W4**
~~~text
OLD: Replace `--squash` with the chosen method when needed.
NEW: When the chosen method is not squash, replace `--squash` with its flag (`--merge` or `--rebase`).
~~~

**Line 147 · W7**
~~~text
OLD: ## Step 6: update the base checkout, then remove only the merged workspace
NEW: ## Step 6: update the base worktree, then remove only the merged worktree and branches
~~~
Note: make the same change on line 14 (the contents list) and line 83 ("the worktree and branch you plan to remove"). Line 209 ("the base checkout matches its upstream") also becomes "base worktree".

**Line 149 · W4, W7**
~~~text
OLD: The worktree holding the base branch must be clean and on the expected branch. ... If it is dirty, on another branch, or cannot fast-forward, leave it untouched, do no local cleanup from it, and report the blocker.
NEW: The base worktree (the worktree holding the base branch) must be clean and on the base branch. ... If it is dirty, on another branch, or cannot fast-forward, leave it untouched, skip the local cleanup, and report the blocker.
~~~

**Line 179 · W4**
~~~text
OLD: A squash merge does not make the old branch commit part of the base, so `git branch -d` can refuse even after a good merge. Use `git branch -D <head-branch>` only when all five proofs still hold and that is the only refusal.
NEW: A squash merge does not make the old branch commit part of the base, so `git branch -d` can refuse even after a successful merge. Use `git branch -D <head-branch>` only when all five proofs still hold and the only error from `git branch -d` is that the branch is not fully merged.
~~~

**Line 199 · W3**
~~~text
OLD: You came here from `work-finish`: add nothing to the item. `work-finish` adds the Recent History row that names the merge commit. Give it the merge commit.
NEW: You came here from `work-finish`: add nothing to the item. `work-finish` adds the Recent History row that names the merge commit.
~~~
Note: apply only with line 213, which makes the reply state the merge commit.

**Line 213 · W4, W7, W8**
~~~text
OLD: End with the pull request link, the merge commit, the final base state, the cleanup result, and whether the history note was saved ("Not saved" first when it failed). The last line is the one question for the owner (a remaining action he must take), or the exact words that continue ("Say 'finish WI-007' and I'll close the work item.").
NEW: You came here from `work-finish`: say the pull request link, the merge commit, and the cleanup result in one line, then go on with the rest of `work-finish` step 3. The owner asked for this merge directly: end with the pull request link, the merge commit, whether the base worktree is up to date and clean, the cleanup result, and, when step 1 found a work item, whether the Recent History row was saved (when saving it failed, start that line with "Not saved"). The last line is the one question for the owner (a remaining action he must take), or the exact words that continue ("Say 'finish WI-007' and I'll close the work item.").
~~~

#### `agents/openai.yaml`

**Line 3 · W7, W4**
~~~text
OLD: short_description: "Merge a PR and safely remove its workspace"
NEW: short_description: "Merge a PR and remove only its branch and worktree"
~~~

### 3.9 publish-docs (`<shared>publish-docs/`)

#### `SKILL.md`

**Line 12 · W6, W4**
~~~text
OLD: Every step is a plain Git command. Run each one on its own, with `git -C <folder>` so it never depends on the current folder.
NEW: Run each Git command on its own, with `git -C <folder>` so it never depends on the current folder.
~~~
Note: step 2 still runs bare `git worktree list`, `git status`, and `git remote` with no `-C`; add `-C` there too.

**Line 18 · W4**
~~~text
OLD: 1. **Check the files.** Name every file in the save. Each must be a project document ("What counts as a document" below), and Git must not ignore it: `git -C <primary> check-ignore <file>` printing the path means Git ignores it, so refuse it.
NEW: 1. **Check the files.** Name every file in the save. Each must be a project document ("What counts as a document" below), and Git must not ignore it: `git -C <primary> check-ignore <file>` printing the path means Git ignores it, so refuse it. `<primary>` is the primary checkout: the first path `git worktree list` prints.
~~~
Note: also delete step 2's sentence "The primary checkout is the first path `git worktree list` prints." Step 1's last sentence stays (or becomes Mike's answer to line 21).

**Line 21 · W4, W7 · Mike decides (section 4)**
~~~text
OLD: Save only an edit the owner agreed to.
NEW: Save only an edit the owner asked for or said yes to, or one another skill tells you to save with this skill (for example `work-finish`, step 5). That covers the push to the default branch in step 7.
~~~
Note: `approvals.md` section 1 says an approval "never covers ... publishing"; that word needs the same answer. Use the chosen word on line 10 and in the description too.

**Line 26 · W4**
~~~text
OLD: No remote (`git remote` prints nothing): the save is committed on the local default branch. Never run `git fetch` or `git push`.
NEW: No remote (`git remote` prints nothing): the save is committed on the local default branch. Never run `git fetch`, and never push to a remote. The local `git push . HEAD:<default>` in step 7 is allowed: it moves only a local branch.
~~~
Note: fix `dev/build-shared/git-rules.md` ("A project with no remote", line 157) with the same exception.

**Line 32 · W4**
~~~text
OLD: The `symbolic-ref` command fails: run `git -C <primary> fetch origin` (Codex: alone, with escalated permissions), which creates `origin/HEAD`, and run it again.
NEW: The `symbolic-ref` command fails: run `git -C <primary> fetch origin` (Codex: alone, with escalated permissions), which creates `origin/HEAD`, then run the `symbolic-ref` command again.
~~~

**Line 80 · W3, W7**
~~~text
OLD: The push is refused because the default branch moved on: open `references/recovery.md`, "The default branch advanced".
NEW: The push is refused because the default branch has commits the save does not: open `references/recovery.md`, "The default branch advanced".
~~~
Note: also change the References table (line 180). `git-rules.md` line 169 is fixed at its source (3.1).

**Line 94 · W4**
~~~text
OLD: After the task's last save, remove the save worktree:
NEW: When no other save of the same files is pending in this conversation, remove the save worktree:
~~~
Note: apply together with `recovery.md` line 89.

**Line 97 · W4, W8**
~~~text
OLD: Report the commit id and where it is ("on origin/main", or "No remote: committed locally on main."). End with the one question for the owner or the exact words that continue.
NEW: Report the commit id and where it is ("Saved to main and pushed to the remote." or "No remote: saved to main on this computer only."). When another skill started this save (for example `work-finish`, step 5), go back to that skill and continue from the step that started this save. Otherwise end with the one question for the owner or the exact words that continue.
~~~

**Line 106 · W4**
~~~text
OLD: Every Git write here (`fetch`, `worktree add`, `add`, `commit`, `push`, `merge`, `worktree remove`) runs alone, with `sandbox_permissions` set to `require_escalated` and a one-line reason ("Commit the roadmap save in its own worktree."). Refused without asking: show the owner the exact command and wait (`references/git-rules.md`, "Git writes in Codex").
NEW: Every Git write here (`fetch`, `worktree add`, `add`, `commit`, `push`, `merge`, `restore`, `worktree remove`) runs alone, with `sandbox_permissions` set to `require_escalated` and a one-line reason ("Commit the roadmap save in its own worktree."). Codex refuses one without asking the owner ("approval required by policy"): show the owner the exact command and wait (`references/git-rules.md`, "Git writes in Codex").
~~~

**Line 112 · W4, W3**
~~~text
OLD: Never edit, stage, or commit in the primary checkout, and never start a save from inside another save worktree. Other `docsave-` worktrees in `git worktree list` belong to other sessions: leave them alone.
NEW: Never make, stage, or commit this save's edit in the primary checkout, and never start a save from inside another save worktree. An edit this session already made there is carried across ("Carrying an edit across"). Other `docsave-` worktrees in `git worktree list` belong to other sessions: do not change or remove them.
~~~

**Line 115 · W7**
~~~text
OLD: Saving requirements or a design does not approve them or their build.
NEW: Saving a document does not approve its requirements or its build.
~~~

**Line 118 · W4, W6**
~~~text
OLD: `memory/` and `work-items/` are local and Git-ignored. They change only through the project's memory and work skills, never through this skill.
NEW: `memory/` and `work-items/` are local and Git-ignored. This skill never changes them (`references/git-rules.md`, "The local folders Git ignores", says what does).
~~~

**Line 141 · W4**
~~~text
OLD: Any other file type: code (`.js`, `.mjs`, `.py`, `.sh`, `.cls`, `.trigger`), settings, `.json`, spreadsheets.
NEW: Any other file type: code (`.js`, `.mjs`, `.py`, `.sh`, `.cls`, `.trigger`), settings, `.json`, and spreadsheet files such as `.xlsx`.
~~~

**Line 143 · W4**
~~~text
OLD: Hidden files and folders, such as `.env` or `.github/`, except that one `.gitignore` under `delivery/`.
NEW: Hidden files and folders, such as `.env` or `.github/`, except a `.gitignore` file under `delivery/`.
~~~

**Line 148 · W4**
~~~text
OLD: - Any path Git ignores.
NEW: - Any path Git ignores.

A path that matches both lists is refused.
~~~

**Line 153 · W5, W3**
~~~text
OLD: Documentation that cannot be separated from a code change stays with that change and its review.
NEW: Use your judgment on a document edit that goes with a code change: when the edit describes that code and would be wrong on the default branch without it, it goes in that code's pull request, not through this skill.
~~~

**Line 159 · W4**
~~~text
OLD: When this session already edited a document in its working checkout, copy each edited file to the same path in the save worktree, stage, and check. Then remove this session's own copy from the working checkout, and only for files this session edited or created: return a changed file to its committed state (`git restore -- <file>`); delete a new file this session created there (`rm <file>`).
NEW: When this session already edited a document in its working checkout, copy each edited file to the same path in the save worktree, stage it, and run the step 5 checks. Remove this session's own copy from the working checkout at the time the list below gives, and only for files this session edited or created: return a changed file to its committed state (`git -C <working checkout> restore -- <file>`); delete a new file this session created there (`rm <working checkout>/<file>`).
~~~

#### `references/recovery.md`

**Line 3 · W3**
~~~text
OLD: What to do when the push or the fast-forward in step 7 is refused, the default branch moved on during the save, or the save cannot finish now.
NEW: What to do when the push or the fast-forward in step 7 is refused, the default branch got new commits during the save, or the save cannot finish now.
~~~

**Line 16 · W4**
~~~text
OLD: 1. Stay in this save worktree. Never touch another checkout.
NEW: 1. Do steps 2 and 3 in this save worktree only. Change no other checkout before step 4.
~~~

**Line 45 · W4 · Mike decides (section 4)**
~~~text
OLD: Ask the owner only when the meaning of the change, or who approved it, has changed.
NEW: Besides step 3, ask the owner when the rebase changed what the saved text means, so it is no longer the edit he agreed to.
~~~

**Line 69 · W4**
~~~text
OLD: Write the exact next action into the work item's Current state (with the project's work track skill) or the handoff.
NEW: When the save is for a work item, write the exact next action into that item's Current state with the project's work track skill. Otherwise tell the owner the exact next action, and put it in the handoff when one is written (the `handoff` skill).
~~~

**Line 80 · W4**
~~~text
OLD: git remote rename <name> origin
NEW: git -C <primary> remote rename <name> origin
~~~

**Line 89 · W4**
~~~text
OLD: Reuse a save worktree for anything other than a follow-up save to the same files that is still pending in this task.
NEW: Reuse a save worktree for anything other than a follow-up save to the same files that is still pending in this conversation.
~~~

### 3.10 pull-latest (`<shared>pull-latest/SKILL.md`)

**Line 20 · W4 · Mike decides (section 4)**
~~~text
OLD:    - No upstream (`git status -sb` shows no `...origin/<branch>` after the
     branch name): the branch has nothing to pull, and `git pull --ff-only`
     would fail with "no tracking information". Say so in one line and stop.
NEW:    - No upstream (`git status -sb` shows only the branch name, for example
     `## main`, with no `...<remote>/<branch>` after it): the branch has
     nothing to pull, and `git pull --ff-only` would fail with "no tracking
     information". Say so in one line and stop.
   - An upstream on a remote not named `origin` (for example
     `## main...upstream/main`): stop and ask the owner which remote to pull
     from.
~~~

**Line 23 · W4** (whose checkout)
~~~text
OLD:    - A dirty working tree, or the shared primary checkout (the first path
     `git worktree list` prints) on a branch other than the default branch:
     stop and report. Your own worktree on your own branch is fine.
NEW:    - This checkout has a dirty working tree, or it is the shared primary
     checkout (the first path `git worktree list` prints) and is on a branch
     other than the default branch: stop and report. Your own worktree on
     your own branch is fine.
~~~
Note: if Mike answers the next finding, use its text instead.

**Line 23 · W4 · Mike decides (section 4)** (untracked files)
~~~text
OLD: (same bullet as above)
NEW:    - This checkout has a dirty working tree (`git status -sb` lists a
     changed or staged file; untracked files alone, shown as `??`, do not
     count), or it is the shared primary checkout (the first path
     `git worktree list` prints) and is on a branch other than the default
     branch: stop and report. Your own worktree on your own branch is fine.
~~~

**Line 33 · W4**
~~~text
OLD: 3. **Diverged** (the fast-forward is refused): look at both sides before
   joining them (step 3 in detail).
NEW: Lines 33-34: "3. **Diverged** (`git pull --ff-only` stops with "Not possible to
   fast-forward"): look at both sides before merging them (step 3 in
   detail). Any other error from the pull: stop and report it."
Line 74: "## Step 3 in detail: inspect before merging"
Lines 76-77: "The fast-forward stops when the local branch has commits its upstream
does not. Look at them:"
~~~

**Line 41 · W5**
~~~text
OLD:    Then, unless the local commits look like another session's work that
   does not belong here, run `git pull --no-rebase --no-edit`.
[lines 85-87]
- Who wrote the local-only commits? The owner's own unpushed work is
  normal. Another agent's commit sitting on a shared branch is worth
  flagging.
NEW: Lines 41-42: "   Then follow step 3 in detail: it says when to stop instead of merging.
   Otherwise run `git pull --no-rebase --no-edit`."
Lines 85-87: "- Whose work are the local-only commits? Sessions commit under the
  owner's Git name, so the author field does not show which session made a
  commit. Use your judgment: weigh each commit's message and changed files
  against this branch's name, and its work item ID when the name holds one.
  The owner's own unpushed work for this branch is normal. Another session's
  commit that belongs on this branch: merge, and name it in the report."
~~~

**Line 43 · W3**
~~~text
OLD: 4. **Never push, rebase, or reset.** [plus "Why these limits", lines 67-72, and lines 95-97]
NEW: Line 43: "4. **Never push, rebase, reset, or check out another branch.** Other
   sessions may have worktrees, branches that point at local commits, or a
   task in progress here. A rebase or reset rewrites or drops commits their
   work is built on; a checkout of another branch changes the files they are
   working on. A merge keeps both sides as they are. Pushing is the owner's
   decision."
Delete lines 67-72 (the "Why these limits" section) and lines 95-97 ("Why a merge and not a rebase: ..."). The new step 4 holds every fact in them.
~~~

**Line 44 · W2**
~~~text
OLD: 5. **Report** the incoming commits and the final state (step 5 in detail),
   and end with the one question for the owner or the exact words that
   continue.
NEW: 5. **Report** the incoming commits and the final state (step 5 in detail).
   End with the one question the owner must answer, if there is one.
   Otherwise, if there is a next step, end with the exact words he can say
   to start it.
~~~
Note: about 12 other skills use "the exact words that continue"; most give an example. Only this skill and `reset-to-remote` change here.

**Line 53 · W4**
~~~text
OLD: - Codex keeps `.git/` read-only and turns the network off. `git fetch` and
  `git pull` each run alone, with `sandbox_permissions` set to
  `require_escalated` and a one-line reason ("Fetch origin and fast-forward
  main."). Refused without asking: show the owner the exact commands and
  wait (`references/git-rules.md`, "Git writes in Codex").
NEW: - Codex keeps `.git/` read-only and turns the network off. Run `git fetch`
  and `git pull` each alone, with `sandbox_permissions` set to
  `require_escalated` and a one-line reason that says what that command
  does ("Fetch origin." for `git fetch`; "Fast-forward main to origin/main."
  or "Merge origin/main into main." for `git pull`). If Codex refuses
  without asking, show the owner the exact commands and ask him to run them
  in a terminal or approve them in an interactive session
  (`references/git-rules.md`, "Git writes in Codex").
~~~

**Line 58 · W4**
~~~text
OLD: - `--no-edit` is only for a merge pull that finishes cleanly. A merge that
  stops on a conflict: stop and report the files, unless the owner asked you
  to finish the update; then commit with a message you write
  (`references/git-rules.md`, "A merge that stops on a conflict").
NEW: - `--no-edit` is only for a `git pull --no-rebase` that finishes without a
  conflict. A merge that stops on a conflict: if the owner has said in this
  conversation to resolve conflicts or finish this merge (a plain request
  to get the latest is not enough), follow `references/git-rules.md`, "A
  merge that stops on a conflict", and commit with a message you write.
  Otherwise stop and report the conflicting files.
~~~
Note: if Mike says yes to line 59, use that text instead. Line 62 ("After a merge pull") may become "After a `git pull --no-rebase`".

**Line 59 · W4 · Mike decides (section 4)**
~~~text
OLD: (same bullet as line 58)
NEW: - `--no-edit` is only for a `git pull --no-rebase` that finishes without a
  conflict. A merge that stops on a conflict: if the owner has said in this
  conversation to resolve conflicts or finish this merge (a plain request
  to get the latest is not enough), follow `references/git-rules.md`, "A
  merge that stops on a conflict", and commit with a message you write.
  Otherwise run `git merge --abort`, which puts the branch and files back as
  they were before the pull, and report the conflicting files.
~~~
Note: if yes, `git merge --abort` in Codex needs escalated permissions; add it to the Codex gotcha on line 53.

**Line 63 · W4**
~~~text
OLD: - A dirty working tree is another session's work until shown otherwise.
  Stop and report it; never stash, commit, or discard it.
NEW: - A dirty working tree may hold another session's work. Stop and report
  it; never stash, commit, or discard it.
~~~

**Line 88 · W4 · Mike decides (section 4)**
~~~text
OLD: - Did the same content already land on the remote another way (for example
  a squash-merged pull request with a different commit id)? Check with
  `git cat-file -e @{u}:<path>` or by comparing the files.
NEW: - Did the same content already land on the remote another way (for example
  a squash-merged pull request with a different commit id)? For each file
  the commit changed, check that it exists on the remote
  (`git cat-file -e @{u}:<path>`), then compare it
  (`git diff HEAD @{u} -- <path>`; no output means the same content). If it
  did land: merge anyway, and name it in the report.
~~~

**Line 101 · W4**
~~~text
OLD: - Incoming commits, one line each, and one line on what they change. Use
  the diffstat and name anything surprising, such as a new folder.
NEW: - Incoming commits, one line each, then one line on what they change
  together. Use the diffstat, and use your judgment to name anything the
  owner would not expect, such as a new folder.
~~~

**Line 103 · W1**
~~~text
OLD: - Remote branches created or deleted by the prune.
NEW: - Remote branches the fetch added (`[new branch]`) or `--prune` removed
  (`[deleted]`).
~~~

**Line 104 · W8**
~~~text
OLD: - The final state: "up to date with origin/<branch>", or "ahead by N
  commits (which ones); pushing is your call".
NEW: - The final state: "up to date with origin/<branch>", or "ahead of
  origin/<branch> by N commits (which ones). You decide whether to push
  them."
~~~

**Line 106 · W4**
~~~text
OLD: - Anything odd found in step 3, even when you went ahead.
NEW: - What step 3 found (another session's commits, or content already on the
  remote under another commit id), even when you merged.
~~~

### 3.11 reset-to-remote (`<shared>reset-to-remote/SKILL.md`)

**Line 3 · W4** (description)
~~~text
OLD: description: 'Makes the local repository an exact copy of its remote, discarding local changes and branches the remote no longer has, after showing a plan, so a stale checkout starts clean and nothing is lost by surprise. ...'
NEW: description: 'Makes the local repository an exact copy of its remote, discarding local commits and branches the remote no longer has, after showing a plan, so an out-of-date checkout matches the remote and nothing is lost by surprise. Use only when the owner asks for it in his own words, for example "wipe local", "match remote exactly", or "fresh start from remote". Not for a routine update; use pull-latest.'
~~~
Note: 2.28 changes the same description. Use the merged text in 2.30.

**Line 10 · W4**
~~~text
OLD: Bring a local repository into exact alignment with its remote: the safe
equivalent of deleting the folder and cloning again, without losing
remote-tracking refs or local tool setup. It throws away local changes, so
it is gated by checks and the owner's yes.
NEW: Bring a local repository into exact alignment with its remote: the safe
equivalent of deleting the folder and cloning again, without losing
remote-tracking refs or local tool setup. It discards local commits on
branches that have an upstream and deletes branches whose remote branch is
gone, so it runs only after the step 2 checks and the owner's yes to the
step 4 plan.
~~~

**Line 19 · W4**
~~~text
OLD: 2. **Refuse when work is at risk** (step 2 in detail): more than one remote
   and no clear source; uncommitted changes here or in another worktree; any
   stash; a branch in the plan that another worktree has checked out; or any
   other worktree at all, until the owner confirms no other session is
   working in this repository. Report what blocks it and stop.
NEW: 2. **Stop when work is at risk** (step 2 in detail): no remote named
   `origin`; uncommitted changes here or in another worktree; any stash;
   another worktree that has a branch with an upstream checked out (step 5
   resets or deletes every such branch); or any other worktree at all, until
   the owner confirms no other session is working in this repository.
   Report what blocks it and wait. Go on only where step 2 in detail says
   the owner's answer allows it.
~~~

**Line 28 · W7**
~~~text
OLD: and local-only branches that will be kept
[lines 134-137]
Show branch names and target commits for resets, branch names for
deletions, and every local-only branch that will be kept. A local-only
branch is almost always unpushed work; call it out clearly. Wait for the
owner's yes before any destructive command.
NEW: Line 28: "and branches with no upstream that will be kept"
Lines 134-137: "Show branch names and target commits for resets, branch names for
deletions, and each branch with no upstream on its own line, marked "not
linked to the remote; may hold work that is only on this computer; kept".
Wait for the owner's yes before any destructive command."
~~~

**Line 33 · W2**
~~~text
OLD: 6. **Report** the default branch and its new head commit, the branches
   reset, deleted, and kept, and whether the install ran and changed
   anything. End with the one question for the owner or the exact words
   that continue.
NEW: 6. **Report** the default branch and its new head commit, the branches
   reset, deleted, and kept, and whether the install ran and changed
   anything. End with the one question the owner must answer, if there is
   one. Otherwise, if there is a next step, end with the exact words he can
   say to start it.
~~~

**Line 38 · W6**
~~~text
OLD: The owner chose "stop on dirty state" over automatic stashing: hidden
stashes get forgotten, and a stop forces a real decision.
NEW: Never stash changes yourself; stop on uncommitted changes instead (the
owner's choice). A hidden stash gets forgotten, and a stop makes the owner
decide.
~~~

**Line 43 · W6**
~~~text
OLD: - This throws away local work. Run it only on the owner's own words asking
  for it, and only after he says yes to the plan in step 4, even when he
  said "just do it".
NEW: - This throws away local work. Even when the owner said "just do it", run
  it only after he says yes to the plan in step 4.
~~~

**Line 48 · W4**
~~~text
OLD:   This skill is the one exception, and only when both hold: the owner asked
  for the reset in his own words, and `git worktree list` shows no other
  worktree, or the owner confirms that no other session is working in this
  repository.
NEW:   This skill is the one exception, and only when both of these hold: (1)
  the owner asked for the reset in his own words; (2) `git worktree list`
  shows no other worktree, or the owner confirmed that no other session is
  working in this repository.
~~~

**Line 51 · W4**
~~~text
OLD: Put this line in the step 4 plan, word for word: "This
  switches branches and resets in the shared checkout. No other worktree
  exists (or: you confirmed no other session is working here)."
NEW: Put one of these two lines in the step 4 plan, word for word, whichever
  is true: "This switches branches and resets them in the project folder
  that other sessions share. No other worktree exists." or "This switches
  branches and resets them in the project folder that other sessions share.
  You confirmed no other session is working here."
~~~

**Line 64 · W4**
~~~text
OLD: Refused without
  asking: show the owner the exact commands and wait
  (`references/git-rules.md`, "Git writes in Codex").
NEW: If Codex refuses
  without asking, show the owner the exact commands and ask him to run them
  in a terminal or approve them in an interactive session
  (`references/git-rules.md`, "Git writes in Codex").
~~~

**Line 67 · W6**
~~~text
OLD: - No remote (`git remote` prints nothing): there is nothing to reset to.
  Say so and stop, with no fetch.
NEW: Delete this bullet. Lines 80-81 keep the rule.
~~~

**Line 69 · W4**
~~~text
OLD: - A local branch with no upstream is almost always unpushed work. It is
  kept unless the owner says yes for that branch.
NEW: - A local branch with no upstream is almost always unpushed work. It is
  kept unless the owner says yes to deleting that branch.
~~~

**Line 72 · W3**
~~~text
OLD: ## Step 2 in detail: the preflight
NEW: Line 72: "## Step 2 in detail: checks before the reset"
Lines 184-185: "- Skip the step 2 checks, even when the owner says "just do it". Show
  what is dirty first."
~~~

**Line 98 · W4**
~~~text
OLD: Untracked
  files only: ask before treating them as safe; some workflows depend on
  local-only files.
NEW: Untracked
  files only: name them and ask the owner whether to go on. The reset
  leaves them in place, but `git reset --hard` overwrites an untracked file
  at a path the remote branch also has. Some workflows depend on files that
  are not in Git.
~~~

**Line 101 · W4 · Mike decides (section 4)**
~~~text
OLD: - `git stash list` has entries: ask whether each stash is still wanted.
NEW: - `git stash list` has entries: ask whether each stash is still wanted.
  Go on after he answers for every stash. Drop a stash only when he says
  to drop that stash; the reset itself leaves stashes as they are.
~~~

**Line 103 · W4**
~~~text
OLD: - Other worktrees exist: run `git -C <path> status --porcelain` in each.
  Any output, or any branch in the plan that another worktree has checked
  out, means another session's work: stop and report it. Never reset,
  switch, or delete a branch another session is using.
NEW: - Other worktrees exist: run `git -C <path> status --porcelain` in each.
  Any output, or another worktree that has a branch with an upstream checked
  out (step 5 resets or deletes every such branch), means another session's
  work: stop and report it. Never reset, switch, or delete a branch another
  session is using.
~~~

**Line 141 · W4**
~~~text
OLD: Switch to the default branch first, because Git cannot reset or delete the
branch you are on:
NEW: Switch to the default branch first, because Git cannot move
(`git branch -f`) or delete (`git branch -D`) the branch you are on:
~~~

**Line 182 · W6**
~~~text
OLD: - Delete a local branch with no upstream without the owner's yes for that
  branch.
- Run an install when there is no lockfile, or guess between several.
- Assume `main` is the default branch.
NEW: Delete these three bullets. "Never do these" keeps: "Run `git pull` ...", "Use `--force` on `git fetch`.", "Skip the step 2 checks ...", and "Push anything."
~~~

### 3.12 solution-design (`<shared>solution-design/`)

#### `SKILL.md`

**Line 10 · W4**
~~~text
OLD: Input: one work item whose requirements are approved.
NEW: Input: one work item whose requirements are approved, or not yet approved when the owner asked for design options first (step 1).
~~~

**Line 11 · W2**
~~~text
OLD: Output: one design in the item's design home, with options, a recommendation, and the owner's choice recorded as a Questions and Answers row that the design names by its Q-ID.
NEW: Keep the sentence and add after it: "The design home is where the tracker keeps the item's one design: `DESIGN.md` beside a local item's `<ID>.md`, the item's Solution Design child page in Notion, or its `## Solution design` comment on GitHub."
~~~

**Line 18 · W1**
~~~text
OLD: `retain` tools, as the memory rule says.
NEW: `retain` tools, as the memory rule says (`.claude/rules/memory-review-and-save.md`, "Hindsight projects").
~~~

**Line 34 · W4**
~~~text
OLD: Requirements not approved yet: a missing or changed requirement goes to `work-refine`. Go on only when the owner asked for options first (section 2).
NEW: - Requirements not approved yet: a missing or changed requirement goes to `work-refine`. Go on only when the owner asked for options first (section 2). Otherwise stop, and tell the owner his requirements approval comes first; `work-refine` asks for it (`references/approvals.md`, section 4).
~~~

**Line 46 · W4**
~~~text
OLD: the design home created from `assets/DESIGN.md`
NEW: the design home created by the work track skill from its design template (the same headings as `assets/DESIGN.md`)
~~~

**Line 47 · W4**
~~~text
OLD: A `build` or `data-load` item without approved requirements keeps its stage.
NEW: A `build` or `data-load` item without approved requirements keeps its stage and its status.
~~~

**Line 54 · W7**
~~~text
OLD: 6. **Research**: one researcher per open question, started together (`references/researcher.md`).
NEW: 6. **Research**: one researcher per research question (`references/researcher.md`); start together the ones whose questions do not depend on each other's answers. In a Salesforce project, open `sf-architect-solutioning` as the specialist for platform facts (section 6).
~~~

**Line 60 · W4**
~~~text
OLD: and fix rounds until the critic finds nothing important (section 7).
NEW: and fix rounds until the critic returns "Clean" (`references/design-critic.md`, "Return") or the owner has decided every finding that remains (section 7).
~~~
Note: the source brief `design-critic.md` line 16 gets the same stop rule (3.2).

**Line 70 · W4**
~~~text
OLD: Cite each recalled source where you use it and end with a short Sources list. The last line is the question (section 8).
NEW: Cite each recalled source where you use it. Put a short Sources list after the rest of the reply, and the question on the last line, after that list (section 8).
~~~
Note: `decisions-and-memory.md` section 9 needs the matching source fix (3.1, line 169, Mike decides).

**Line 72 · W4**
~~~text
OLD: 10. **Record his choice at once**: his words and the date in the row first, then the design's "Owner decision" with the Q-ID, "Selected design", the "Build and verification plan", and the approval fields.
NEW: Keep the sentence and add after it: "When the requirements are not approved yet, save his pick in the row only, keep the design proposed, and change nothing else in the design (section 2)."
~~~

**Line 74 · W4**
~~~text
OLD: The Build order becomes the item's Roadmap and Tasks (section 9).
NEW: The Build order becomes Tasks under the item's existing Roadmap phases, or becomes the phases when the item has none; never renumber, replace, or drop an existing phase (section 9).
~~~

**Line 80 · W3**
~~~text
OLD: 12. **Hand on**: `work-on` builds from the Roadmap; `work-delegate` when he says "you drive".
NEW: 12. **Stop**: the build runs next in `work-on`, from the Roadmap, or in `work-delegate` when he says "you drive".
~~~

**Line 106 · W4**
~~~text
OLD: Helpers never see this conversation: paste everything they need into the brief. Claude Code: the Agent tool with `general-purpose`, never a fork.
NEW: - Helpers never see this conversation. Paste the brief word for word, then its job block filled with everything they need. Claude Code: the Agent tool with `subagent_type` `general-purpose` and `model` `opus`, never a fork. Codex: `spawn_agent` with `fork_turns` set to `none`.
~~~

**Line 112 · W3**
~~~text
OLD: Say so and hand back to `work-on`.
NEW: Say so, and stop: the build runs in `work-on` (step 12).
~~~

#### `references/design-process.md`

**Line 64 · W7**
~~~text
OLD: The owner may overrule a flag.
NEW: The owner may decide that a gap you listed needs no change.
~~~

**Line 65 · W4**
~~~text
OLD: Also add a line to the design's Notes, "Design changes during the interview", naming the `R-xx` and the Q-ID.
NEW: Also add a line to the design's Notes, "Design changes during the interview", naming the `R-xx` and the Q-ID. When the design does not exist yet, add the line when you create it (step 4).
~~~

**Line 87 · W3**
~~~text
OLD: say so, and hand back to `work-on`.
NEW: say so, and stop: the build runs in `work-on` (`SKILL.md`, step 12).
~~~

**Line 110 · W3**
~~~text
OLD: Ask how many and what should differ only when the owner said he wants a say in that.
NEW: Ask how many options and how they should differ only when the owner said he wants to decide that.
~~~

**Line 115 · W7** (the team line)
~~~text
OLD: The team. The architects, at least one critic, and one researcher per open question. It needs no question; say it in one line.
NEW: - The team. The architects, at least one critic, and one researcher per research question. Do not ask the owner about the team; tell him in one line.
~~~

**Line 115 · W4** (the source brief)
~~~text
OLD: The architects, at least one critic, and one researcher per open question.
NEW: Keep this line. Fix the source instead: in dev/build-shared/helper-briefs/design-architect.md, "For the main agent", replace "The small design team (requirements analyst, architects, critic, and a researcher when a question is open) needs no permission; say it in one line." with "The design team (the architects, at least one critic, and one researcher per research question) needs no permission; name the team to the owner in one line." Then copy the source over every copy.
~~~
Note: the helper-brief finding in 3.2 (`design-architect.md` line 17) changes the same sentence; apply one text, with "research question".

**Line 132 · W2**
~~~text
OLD: the Notion set holds the same template as a page.
NEW: in a Notion project, the `notion-work-track` skill holds the same template for a page (its `assets/design-page.md`).
~~~

**Line 138 · W4**
~~~text
OLD: Delete unused example rows and optional sections.
NEW: Delete unused example rows and example diagrams, and each section or heading the template says to remove when unused (for example "Option comparison" with one option).
~~~

**Line 143 · W4**
~~~text
OLD: The item's `design` field says the same thing. Set both to `proposed` when the design is created.
NEW: The item's `design` field holds the same value as `status`. When the design is created, set the design's `status` and the item's `design` field to `proposed`.
~~~

**Line 144 · W4**
~~~text
OLD: Keep each header line (`**Requirements:**`, `**Design status:**`, and the rest) on its own line, as the template has it.
NEW: Keep the sentence and add after it: "Write Design status Draft when the design is created (step 4), and In review when it is saved as proposed for the owner (step 8)."
~~~

**Line 163 · W4**
~~~text
OLD: One researcher per bounded question, started together (`researcher.md`). Good questions: what the platform offers built in for a requirement; the current version's limits; what people build for this kind of problem; what a component in this repository already does.
NEW: - One researcher per bounded research question (`researcher.md`). Start together the researchers whose questions do not depend on each other's answers. Examples of research questions: what the platform offers built in for a requirement; the current version's limits; what people build for this kind of problem; what a component in this repository already does.
~~~

**Line 189 · W4**
~~~text
OLD: Repeat until every requirement is satisfied and nothing important remains. ... Stop because the list is empty or the owner decided the rest, never because the loop is long.
NEW: Delete the sentence on lines 189-190 ("Repeat until every requirement is satisfied and nothing important remains."). Replace lines 195-196 with: "- Repeat the fix loop until the critic returns "Clean" (`design-critic.md`, "Return") or the owner has decided every finding that remains. Never stop only because many rounds have run."
~~~

**Line 217 · W4**
~~~text
OLD: | Q-06 | Which design option should we build? ... |  |  |  | Design | Open | owner |
NEW: Keep the row. Fix the source instead: in dev/build-shared/work-item-format.md, section 6, change the Affects row to "The requirement, phase, task, or sub-item IDs the answer changes, or `Design` when the answer chooses or changes the item's design." Then copy the source over every copy.
~~~
Note: this source change reaches every skill that holds `work-item-format.md`. `work-delegate` also asks for `delivery` in the Affects column (3.14, `delivery-offer.md` line 20); make both source edits together.

**Line 232 · W4**
~~~text
OLD: - each recalled source named where you use it, and a short Sources list at the end (`decisions-and-memory.md`, section 9);
- as the last line, the one question: "Which option should we build? I recommend B."
NEW: - each recalled source named where you use it, and a short Sources list after all of the above (`decisions-and-memory.md`, section 9);
- as the last line, after the Sources list, the one question: "Which option should we build? I recommend B."
~~~

**Line 239 · W4**
~~~text
OLD: A clear choice ("Go with B") is both the choice and the design approval.
NEW: A clear choice ("Go with B") is both the choice and the design approval, unless the requirements are not approved yet: then save his pick in the row only (step 1 below), keep the design proposed, and follow section 2.
~~~

**Line 293 · W4**
~~~text
OLD: A build that shows the design does not work: record what failed in the design's Notes, set it back to `proposed`, fix the affected parts, and ask again.
NEW: - A build that shows the design does not work: record what failed in the design's Notes, set the design back to `proposed` (Design status In review), run a fix round for the affected parts, and ask again with a new row.
~~~

#### `examples/design-walkthrough.md`

**Line 29 · W4**
~~~text
OLD: The critic finds R-03 (an audit of who lost access) partly satisfied in B. Architect B adds a before-and-after access report. The critic's second round is clean.
NEW: - Architect A writes "Move all 15 as they are"; architect B writes "Merge into 9 groups". Two critics check the drafts, one each. A's critic returns "Clean". B's critic finds R-03 (an audit of who lost access) partly satisfied. Architect B adds a before-and-after access report, and B's critic returns "Clean" in its second round.
~~~

**Line 55 · W8**
~~~text
OLD: Its main risk is a merge that removes access someone needs; the report catches that before go-live.
NEW: > I recommend B: the same access with 6 fewer groups. Its main risk is a merge that removes access someone needs; the report shows any lost access before people start using the new org.
~~~

**Line 97 · W4**
~~~text
OLD: That reply ends: "Say 'keep going' and I'll start the build."
NEW: The reply after the save ends: "Say 'keep going' and I'll start the build."
~~~

#### `assets/DESIGN.md` (Mike's model template)

**Line 9 · W4 · Mike decides (section 4)**
~~~text
OLD: Add rows or options where needed; remove unused example rows and optional sections.
NEW: Add rows or options where needed; remove unused example rows, and each section or heading the template says to remove when unused.
~~~
Note: the same line is in `notion-work-track` `assets/design-page.md` line 1 and the local and GitHub copies of `DESIGN.md`.

**Line 17 · W7 · Mike decides (section 4)**
~~~text
OLD: The work item's main file owns the agreed goal, its Current state (where work stands and the exact next action), active requirements, Questions and Answers (which holds the item's decisions), roadmap tasks, and execution history.
NEW: The work item's main file, not this file, holds the agreed goal, its Current state (where work stands and the exact next action), active requirements, Questions and Answers (which holds the item's decisions), its Roadmap and Tasks, and its Recent History.
~~~
Note: `notion-work-track` `design-page.md` line 3 has the same sentence (3.23).

**Line 43 · W4 · Mike decides (section 4)**
~~~text
OLD: Include the number of options agreed with the owner.
NEW: Include the number of options chosen for this design (the owner's number when he gave one).
~~~
Note: `design-page.md` line 40 has the same sentence.

**Line 102 · W4 · Mike decides (section 4)**
~~~text
OLD: retain only useful option history above.
NEW: keep the option sections above; mark a replaced option "Superseded by Option <letter>" under its heading.
~~~
Note: `design-page.md` line 106 has the same sentence.

### 3.13 work-check (`<shared>work-check/`)

#### `SKILL.md`

**Line 24 · W4**
~~~text
OLD: 1. **Find the item**: the ID the owner named, the item this worktree's branch names, or the item just built. When two could match, ask one question naming both.
NEW: 1. **Find the item**: the ID the owner named; if he named none, the item this worktree's branch names; if neither, the item this chat built. When two items could still be the one he means, ask one question naming both.
~~~
Note: the step's last sentence ("Read it fresh with the work find skill ...") stays.

**Line 44 · W4**
~~~text
OLD: With the work track skill, add the Questions and Answers row "Do you approve this result?" (Decision needed from: owner),
NEW: With the work track skill, add the Questions and Answers row "Do you approve this result? <ID> at commit <short hash>: <each requirement's verdict and the gaps, in one line>." (Affects: the requirement IDs checked; Decision needed from: owner),
~~~

**Line 47 · W4**
~~~text
OLD: state, Next action "Waiting on <owner>: Q-xx." and Waiting on "<owner>: Q-xx."
NEW: state, Next action "Waiting on <first name>: Q-xx." and Waiting on "<first name>: Q-xx.", where <first name> is the owner's first name (for example "Waiting on Mike: Q-07.")
~~~
Note: `work-delegate` `references/delivery-offer.md` line 50 uses the same undefined `<owner>`; fix it the same way.

**Line 54 · W4**
~~~text
OLD: a Recent History row naming the Q-ID; `waiting_on: agent`; the Current state rewritten in place.
NEW: a Recent History row naming the Q-ID; `waiting_on: agent`, or keep `owner` while another of his questions on the item is still open; the Current state rewritten in place.
~~~

**Line 56 · W4**
~~~text
OLD: - A "no" or a change: record his words in the row the same way, add a task for each problem he named, set the stage to `10-bug-fixing`, and go back to step 5. A changed requirement goes to `work-refine`.
NEW: - A "no" or a change: record his words in the row the same way, add a Recent History row naming the Q-ID, add a task for each problem he named, set the stage to `10-bug-fixing`, set `waiting_on` as above, rewrite the Current state in place, and go back to step 5. A changed requirement goes to `work-refine`.
~~~
Note: "as above" points to the line 54 fix; apply both.

**Line 65 · W4**
~~~text
OLD: Keep it short, in this order:
NEW: Keep it short, as in the reply in `examples/result-check-walkthrough.md`, section 4, in this order:
~~~

**Line 69 · W4**
~~~text
OLD: 2. How he can see it himself: a link, a screenshot, or a command with its folder.
NEW: 2. How he can see it himself: a link, a screenshot, a command with its folder, or more than one of these, whichever apply.
~~~

**Line 76 · W4**
~~~text
OLD: When no independent check ran, say that first.
NEW: When no independent check ran, say that in the reply's first line, before item 1.
~~~

**Line 91 · W4**
~~~text
OLD: Paste the brief and every requirement in full.
NEW: Paste the brief word for word and the filled job block, with every requirement in full.
~~~

**Line 116 · W7**
~~~text
OLD: - Current State: change this item's line only when it is no longer true, with the memory save skill (Hindsight: edit `memory/CURRENT_STATE.md` directly). The approval question is not a Current State line; `work-status` finds it on the item.
NEW: - The project's Current State (not the item's Current state block): change this item's line there only when it is no longer true, with the memory save skill (Hindsight: edit `memory/CURRENT_STATE.md` directly). The approval question is not a line in the project's Current State; `work-status` finds it on the item.
~~~

#### `references/testing.md`

**Line 28 · W3**
~~~text
OLD: - the Roadmap and Tasks: what was built, on which branch, and which phases claim to be finished;
NEW: - the Roadmap and Tasks: what was built, on which branch, and which phases are marked Done (not yet confirmed by the check);
~~~

**Line 39 · W4 · Mike decides (section 4)**
~~~text
OLD: - A parent item whose sub-items are finished: check the whole flow from start to end across the sub-items. Each sub-item keeps its own result approval.
NEW: - A parent item whose sub-items are all Done or Cancelled: check the whole flow from start to end across the sub-items. Each sub-item keeps its own result approval.
~~~
Note: `work-delegate` step 11 and `approvals.md` section 8 use "finished" the same way; apply Mike's answer there too.

**Line 59 · W7**
~~~text
OLD: Offer it to the owner under "how to see it yourself" when you show the result.
NEW: Offer it to the owner in item 2 of "Showing the result" in `SKILL.md` ("How he can see it himself").
~~~

**Line 64 · W4**
~~~text
OLD: against the sandbox named in `PROJECT.md`, "Toolkit settings", never against production.
NEW: against a sandbox listed under "Salesforce org aliases" in `PROJECT.md`, "Toolkit settings", never against production. When more than one sandbox is listed and none is named in the work item, its design, or its test plan, ask the owner which one.
~~~

**Line 65 · W3**
~~~text
OLD: A sandbox deploy the check needs goes through `sf-deploy-check` and the owner's yes for that deploy first; in Codex, hand him the command.
NEW: Before a sandbox deploy the check needs, use the `sf-deploy-check` skill and get the owner's yes for that deploy. In Codex, give him the exact command to run, and do not run it yourself (`.claude/rules/salesforce-org-safety.md`).
~~~

**Line 73 · W4**
~~~text
OLD: A test plan is needed when a check has several scenarios,
NEW: A test plan is needed when a check has more than one scenario,
~~~

**Line 75 · W4 · Mike decides (section 4)**
~~~text
OLD: When every acceptance check is one automated test or one observation, the item's own checks are enough, and the checker gets "Test plan: none".
NEW: When every acceptance check is one automated test, or one observation the agent makes without a manual step (such as reading a command's output), the item's own checks are enough, and the checker gets "Test plan: none".
~~~

**Line 105 · W4**
~~~text
OLD: (Claude Code: the Agent tool, `general-purpose`, never a fork; Codex: `spawn_agent` with `fork_turns` set to `none`).
NEW: - [ ] Open `references/acceptance-checker.md` and start the helper exactly as its "For the main agent" part says: a new helper that does not see this conversation.
~~~
Note: this replaces the whole bullet, lines 105-108.

**Line 111 · W4**
~~~text
OLD: then the job block filled in with `Check: result check`, the full worktree path, the branch, and the exact commit from section 2.
NEW: then the job block filled in with `Check: result check`, the full worktree path, the branch, and the exact head commit after any test plan commit (`git -C <worktree> rev-parse HEAD`, run after section 3).
~~~

**Line 112 · W4**
~~~text
OLD: Paste every `R-xx` block and the Acceptance list in full. The checker sees nothing else.
NEW: Paste every `R-xx` block that is not Superseded, and the Acceptance list, in full. The checker sees nothing else.
~~~
Note: the job block in `dev/build-shared/helper-briefs/acceptance-checker.md` ("Requirements: <every R-xx block, with its Acceptance check>") needs the same change at its source.

**Line 115 · W4**
~~~text
OLD: A defect it reports outside the requirements: fix it when it breaks the flow; otherwise show it to the owner as a gap, or offer a new work item for it.
NEW: A defect it reports outside the requirements: fix it when it breaks the flow; otherwise show it to the owner as a gap, and you may also offer a new work item for it.
~~~

**Line 121 · W4**
~~~text
OLD: record "Independent check: none, <why>", and say so first when you show the owner the result.
NEW: record "Independent check: none, <why>", and say so in the first line of the reply that shows the owner the result.
~~~

**Line 133 · W4**
~~~text
OLD: - [ ] Fix it with `work-on` in the item's worktree. When `delivery` is `agent-led`, the team that `work-delegate` runs fixes it.
NEW: - [ ] Fix it in the item's worktree with `work-on`, or, when `delivery` is `agent-led`, with `work-delegate`, whose team fixes it.
~~~
Note: the next sentence ("Then set the stage to `09-testing` again and start from section 2.") stays.

**Line 138 · W4**
~~~text
OLD: - [ ] A failure that needs the owner's decision (a requirement that reads two ways, a fix that changes what he approved, a cost): add a Questions and Answers row with your recommendation, set `waiting_on: owner`, name the Q-ID in Next action, and ask.
NEW: - [ ] A failure that needs the owner's decision (a requirement that reads two ways, a fix that changes what he approved, a fix that spends money): add a Questions and Answers row with your recommendation, set `waiting_on: owner`, name the Q-ID in the Current state's Next action and Waiting on lines, and ask.
~~~

**Line 143 · W3**
~~~text
OLD: - [ ] A failure that shows a requirement is wrong or missing: `work-refine` changes the requirement with the owner. Never build around a requirement, and never report it met.
NEW: - [ ] A failure that shows a requirement is wrong or missing: open `work-refine` to change the requirement with the owner. Never change the build to avoid that requirement, and never report it met.
~~~

**Line 146 · W3**
~~~text
OLD: - [ ] The same failure comes back after a second fix:
NEW: - [ ] The same failure happens again after a second fix:
~~~

**Line 163 · W3**
~~~text
OLD: Read the item back and check each change landed. A failed save: lead with "Not saved"
NEW: Read the item back and check that each change is there. A failed save: start the reply with "Not saved"
~~~
Note: the shared sources use the same words (`approvals.md` section 3 step 6, "landed"; `work-item-format.md` section 11, "lead with"); fix them at the source so the wording stays the same.

#### `examples/result-check-walkthrough.md`

**Line 26 · W4**
~~~text
OLD: Requirements: <the R-01, R-02, and R-03 blocks, pasted in full>
  R-01 Save an expense. Acceptance check: ...
NEW: Requirements: <the R-01, R-02, and R-03 blocks, pasted in full; shortened here to their names and acceptance checks>
~~~
Note: replace line 26 only; lines 27-29 stay as the shortened view.

**Line 63 · W4**
~~~text
OLD: The approval question, added as the first open row of Questions and Answers:
NEW: The approval question, added to Questions and Answers below any older open rows (WI-031 has none, so it is the first row):
~~~

**Line 70 · W4**
~~~text
OLD: Front matter: `stage: 11-user-approval`, `waiting_on: "owner"`. Next action: "Waiting on Mike: Q-07."
NEW: Front matter: `stage: 11-user-approval`, `waiting_on: "owner"`. Current state: Next action "Waiting on Mike: Q-07.", Waiting on "Mike: Q-07."
~~~

**Line 111 · W4**
~~~text
OLD: - Current state, rewritten in place: Where it stands "Result approved (Q-07) at commit 9b7e210.", Next action "Agent: open the pull request (work-finish).", Waiting on "Nothing.", Last updated "2026-09-30, the agent."
NEW: - Current state, rewritten in place: Where it stands "Result approved (Q-07) at commit 9b7e210.", Next action "Agent: open the pull request (work-finish).", Waiting on "Nothing.", Blockers "None.", Last updated "2026-09-30, the agent."
~~~

#### `assets/TEST-PLAN-TEMPLATE.md` (Mike's model template)

**Line 3 · W4 · Mike decides (section 4)**
~~~text
OLD: <!-- Fill-in guide: copy this file and name the copy `<ID>-test-plan.md` for a work item (for example `WI-031-test-plan.md`), or `<release>-test-plan.md` for a release being checked. Replace the title and every angle-bracket prompt in the section or table cell below with the real scope, environment, scenario, expected result, procedure, and evidence location. Add one Checks row per scenario. Record actual outcomes under Results; delete this guide and the example row when populated. -->
NEW: <!-- Fill-in guide: copy this file and name the copy `<ID>-test-plan.md` for a work item (for example `WI-031-test-plan.md`), or `<release>-test-plan.md` for a release being checked. Replace the title and every angle-bracket prompt in Scope and in Environment and data with the real scope and environment. In Checks, add one row per scenario with its expected result, procedure, and evidence location, then delete the angle-bracket example row. Record actual outcomes under "Results and follow-up", replacing its prompts. Delete this guide when the plan is filled in. -->
~~~
Note: this file is the same as the model's `tests/TEST-PLAN-TEMPLATE.md`; the change goes on the model branch and is imported.

### 3.14 work-delegate (`<shared>work-delegate/`)

#### `SKILL.md`

**Line 8 · W7**
~~~text
OLD: The owner hands over a goal and stays product owner: he decides, approves, and marks work Done. This chat leads the goal's top work item (the parent).
NEW: The owner hands over a goal (a top-level work item and all its sub-items) and stays product owner: he decides, approves, and marks work Done. This chat leads the goal's top-level item (the parent).
~~~
Note: "top item" in `SKILL.md` lines 26-27 and `delivery-offer.md` line 19 should also become "top-level item".

**Line 32 · W4**
~~~text
OLD: - Nothing is recorded for this goal and he has not handed it over: add the offer as a Questions and Answers row, set `waiting_on: owner`, give your recommendation and its reason in one line, and make the last line of the reply exactly: "Would you like agents to take responsibility for delivering this, with you acting as product owner?"
NEW:    - Nothing is recorded for this goal, he has not handed it over, and its plan has sub-items, more than one phase, or more than two tasks: add the offer as a Questions and Answers row, set `waiting_on: owner`, give your recommendation and its reason in one line, and make the last line of the reply exactly: "Would you like agents to take responsibility for delivering this, with you acting as product owner?"
   - A small item (one phase, one or two tasks, no sub-items) gets no offer: follow `references/delivery-offer.md`, section 2.
~~~
Note: `work-on` `references/building.md` line 83 gets "one phase" too (3.16).

**Line 63 · W4**
~~~text
OLD: For each: make its worktree and branch (`references/git-rules.md`), set its sub-item to `08-build`, In Progress, `waiting_on: agent`, add its line to the parent's team list,
NEW: For each: make its worktree and branch (`references/git-rules.md`), set its sub-item to `08-build`, In Progress, `waiting_on: agent`, set its task and that task's phase In Progress, add its line to the parent's team list, then start it with `references/builder-brief.md` and the filled job block. Start helpers that do not depend on each other at the same time. Codex with approvals turned off (`codex exec`): make no builder worktree and run one builder at a time (`references/builder-brief.md`, "For the main agent").
~~~
Note: step 8's merge-and-remove and the builder brief's "After its report" still have no `codex exec` case.

**Line 75 · W4 · Mike decides (section 4)**
~~~text
OLD: set a phase Done when all its tasks and sub-items are done and its exit result was checked
NEW: Proposed (reading 1), in SKILL.md and running-the-team.md line 115: "set a phase Done when every task in it is Done, every sub-item in it has the status Done, and its exit result was checked". If Mike means reading 2: "set a phase Done when every task in it is Done, every sub-item in it is at `09-testing` or later, and its exit result was checked".
~~~
Note: with reading 1, section 7 also needs a step that closes the phase after `work-finish` marks the last sub-item Done.

**Line 77 · W4**
~~~text
OLD: parent's Current state; remove the helper's team line. Read it back.
NEW: Line 77: "parent's Current state; remove the helper's team line. Read each changed item back." Line 53: "item's Current state rewritten in place. Read the item back."
~~~

**Line 81 · W4**
~~~text
OLD: Stop or re-brief any helper whose work moved or was dropped.
NEW: A helper whose task only moved to another phase keeps going. For a helper whose task was dropped, or whose requirement or design changed, follow `references/running-the-team.md`, section 5.
~~~

**Line 84 · W4**
~~~text
OLD: 10. **Stop at every owner gate**: requirements, design, result, merge, deployment, Done, and anything that cannot be undone (`references/approvals.md`).
NEW: 10. **Stop at every owner gate**: requirements, design, result, a merge to the default branch, deployment, Done, Cancel, and anything that cannot be undone (`references/approvals.md`).
~~~

**Line 87 · W3**
~~~text
OLD: ask through the skill that owns the gate
NEW: ask through the skill that asks for that approval (`work-refine` for requirements, `solution-design` for the design, `work-check` for the result, and `work-finish` for a merge, a deployment, Done, or Cancel), or in the reply for anything else,
~~~

**Line 90 · W4**
~~~text
OLD: The parent follows when its sub-items are finished or cancelled.
NEW: The parent follows when each sub-item is finished, cancelled, or moved (`references/approvals.md`, section 8).
~~~
Note: make the same change in `examples/delegated-run.md` line 87.

**Line 119 · W4**
~~~text
OLD: - Do not narrate helper activity. Tell him when a gate needs him, a result is ready, or something failed.
NEW: - Do not narrate helper activity. Tell him the team plan in one line when you make it (`references/running-the-team.md`, section 1). After that, tell him when a gate needs him, a result is ready, or something failed.
~~~

**Line 121 · W7**
~~~text
OLD: - Keep the parent's line in Current State true (`references/decisions-and-memory.md`, section 10).
NEW: - Keep the parent's line under "Now" in the project's Current State true (`references/decisions-and-memory.md`, section 10).
~~~

#### `references/delivery-offer.md`

**Line 20 · W4**
~~~text
OLD: its `delivery` value and its Questions and Answers rows whose Affects column says `delivery`.
NEW: Fix the shared source, not this line. In dev/build-shared/work-item-format.md, section 6, Affects row: "| Affects | The requirement, phase, task, or sub-item IDs the answer changes. For a delivery offer or team arrangement answer: `delivery`. |" Then copy it over every copy.
~~~
Note: `solution-design` also asks for `Design` in the same Affects row (3.12, `design-process.md` line 217); make both source edits together.

**Line 28 · W4**
~~~text
OLD: Missing tracker access is not a missing answer. Say "Not saved", keep the answer, and save it when access returns.
NEW: - A tracker that cannot be read does not mean no answer is recorded: do not treat the goal as `not-offered`. When his answer cannot be saved, lead with "Not saved", keep his words, and save them when the tracker can be written again (`work-item-format.md`, section 11).
~~~

**Line 36 · W4**
~~~text
OLD: Another skill sent you here because a large item has no answer recorded: make the offer (section 3).
NEW: - Another skill sent you here, no answer is recorded, and the item's plan has sub-items, more than one phase, or more than two tasks: make the offer (section 3).
~~~

**Line 38 · W4**
~~~text
OLD: A quick question, a small edit, or a small item (one or two tasks, no sub-items) gets no offer.
NEW: - A quick question, a small edit, or a small item (one phase, one or two tasks, no sub-items) gets no offer.
~~~
Note: replaces only the first sentence. Optional: the Recent History text in the same bullet becomes "Small item: one phase, one or two tasks, no sub-items, so no delivery offer."

**Line 42 · W5**
~~~text
OLD: A goal he declined or revoked gets no new offer, unless the work grows a lot or he asks about agent-led delivery.
NEW: - A goal he declined or revoked gets no new offer, unless he asks about agent-led delivery or the work grows a lot. Use your judgment on "a lot": weigh the phases, sub-items, and tasks added since his answer against the plan he answered about.
~~~

**Line 49 · W4**
~~~text
OLD: Set `waiting_on: owner`. In the item's Current state, Next action: "Waiting on <owner>: Q-06."; Waiting on: "<owner>: Q-06."
NEW: 2. Set `waiting_on: owner`. In the item's Current state, Next action: "Waiting on <owner>: <Q-ID>."; Waiting on: "<owner>: <Q-ID>."
~~~
Note: `<owner>` becomes "<first name>" with the `work-check` line 47 fix (3.13).

**Line 56 · W4**
~~~text
OLD: Keep doing useful work that does not depend on his answer.
NEW: Ask in the reply text, never through a question tool. Keep doing work that does not depend on his answer. Build nothing until he answers.
~~~

**Line 70 · W4**
~~~text
OLD: 5. Rewrite the item's Current state in place (Next action, Waiting on, Last updated).
NEW: 5. Rewrite the item's Current state in place (Where it stands, Next action, Waiting on, Last updated).
~~~

**Line 72 · W4**
~~~text
OLD: 6. Ask the team arrangement question (`team-arrangements.md`), and record its answer the same way, as its own row.
NEW: 6. Ask the team arrangement question (`team-arrangements.md`), and record its answer in its own row, following steps 1, 3, 4, 5, and 7. Do not change `delivery`: a no to the team question means the lead builds the work itself. His words may already answer it: "use a team of agents" means one team inside this chat.
~~~

**Line 75 · W3**
~~~text
OLD: 7. Read the item back and check every change landed.
NEW: 7. Read the item back and check every change was saved.
~~~
Note: make the same change at the source `dev/build-shared/approvals.md` section 3 step 6 (3.1, line 79).

**Line 86 · W4**
~~~text
OLD: - A no: record it as in section 4 with `delivery: owner-led`.
NEW: - A no: record it with section 4, steps 1 to 5 and 7, setting `delivery: owner-led` in step 2. Do not ask the team arrangement question. The agent still helps and keeps the records current; the owner steers the build with `work-on`.
~~~

**Line 89 · W4**
~~~text
OLD: - A revoke ("I'll take it from here", "stop the team"): a new answered row with his words, `delivery: owner-led`, and a Recent History row.
NEW: - A revoke ("I'll take it from here", "stop the team"): add a new answered row whose Question starts "Change to <old Q-ID>:" and whose Answer is his words; set the Status of the row that recorded his yes to "Superseded by <new Q-ID>"; set `delivery: owner-led`; and add a Recent History row. Start no new helper. Tell him in one line which helpers are still running and ask whether to let them finish or stop them.
~~~

**Line 98 · W7**
~~~text
OLD: - Agents move the goal through every stage: refinement, design, the build, testing, and delivery.
NEW: - Agents move the goal through every stage: refinement, design, the build, testing, the pull request, deployment, and the specification update. Each stage runs through its own skill.
~~~

#### `references/running-the-team.md`

**Line 31 · W5**
~~~text
OLD: A small task the lead may build itself.
NEW: The lead may build a small task itself instead of starting a builder. Use your judgment on "small": weigh the size of the task against the time to write its brief and check its report.
~~~

**Line 40 · W4 · Mike decides (section 4)**
~~~text
OLD: - One writer per file. Two builders never write the same file. Tasks that need the same file, or the same shared environment (a sandbox org, a database, a test service), run in a stated order.
NEW: Proposed (reading 2): "- One writer per file at a time: two builders never write the same file at the same time. Tasks that need the same file, or the same shared environment (a sandbox org, a database, a test service), run one after another, in the order their Depends on lines give." SKILL.md step 6 then reads "Give every file one writer at a time." If Mike means reading 1, change team-arrangements.md line 51 and the shared builder and checker briefs instead.
~~~
Note: whichever he picks, the shared brief sources in `dev/build-shared/helper-briefs/` change too. `examples/delegated-run.md` line 30 (below) keeps one writer per file for now.

**Line 43 · W5**
~~~text
OLD: - Start only as many builders as you can check and merge. A builder that finishes waits on you.
NEW: - Start only as many builders as you can check and merge as they return. Use your judgment on the number: weigh how long each check and merge takes against how long each builder runs. A builder that finishes waits on you.
~~~

**Line 71 · W4 · Mike decides (section 4)**
~~~text
OLD: - [ ] The task has Work, Deliverable, Done when, and Depends on, and every task it depends on is merged into its item's branch.
NEW: Proposed: line 71: "- [ ] The task has Work, Deliverable, Done when, and Depends on, and every task it depends on is merged into the branch this builder's branch is made from. When that task is on another sub-item, first merge that sub-item's branch into this item's branch, from this item's worktree." Line 31: "A sub-item that needs another sub-item's code starts after that code is merged into its own item branch (section 3)."
~~~

**Line 73 · W4**
~~~text
OLD: - [ ] The item has its own branch and worktree, and the builder has its own, made from the item's branch (`git-rules.md`, "Branch and worktree names"). In Codex each Git write runs alone, with escalated permissions.
NEW: - [ ] The item has its own branch and worktree, and the builder has its own, made from the item's branch (`git-rules.md`, "Branch and worktree names"). In Codex each Git write runs alone, with escalated permissions. Codex with approvals turned off (`codex exec`): no builder worktree; one builder at a time in the item's worktree, with "Commit: no" (`builder-brief.md`, "For the main agent").
~~~

**Line 98 · W4 · Mike decides (section 4)**
~~~text
OLD: 2. Check it: the files it changed are the ones it was given, and its tests pass when you run them yourself on its branch.
NEW: 2. Check it: the files it changed are the ones it was given, and its tests pass when you run them yourself on its branch. If either check fails, do not merge, and keep its branch: in step 4, treat the task as not done and record what failed.
~~~

**Line 137 · W4**
~~~text
OLD: | Merge two phases | Move the second phase's sub-items and tasks into the first. The second becomes Cancelled, Exit result "Merged into P1". |
NEW: | Merge two phases | Keep the phase that comes first in the Roadmap. Move the other phase's sub-items and tasks into it. The other phase becomes Cancelled, Exit result "Merged into <ID of the phase kept>". |
~~~

**Line 148 · W5**
~~~text
OLD: - A running helper whose task was dropped, or whose requirement or design changed: stop it, or let it finish and do not merge its branch.
NEW: - A running helper whose task was dropped, or whose requirement or design changed: stop it, or let it finish and do not merge its branch. Use your judgment: weigh how much of its work could still be used against the time it would keep running. Keep the branch until the owner agrees the work is dropped. Start a new helper with the new brief when the work is still needed.
~~~
Note: the last two sentences are the old lines 149-151, unchanged.

**Line 153 · W4**
~~~text
OLD: - A change that adds, drops, or moves a work item named in `PROJECT-ROADMAP.md`: update that line too, with `publish-docs`.
NEW: - A change that drops or moves a work item named in `PROJECT-ROADMAP.md`: update its line. A new work item for a roadmap unit: fill that unit's "Linked work item" line. Save either change with `publish-docs`.
~~~

**Line 158 · W4**
~~~text
OLD: - The gates: requirements approval, design approval, result approval, a merge, a deployment, Done, Cancel, and anything that cannot be undone (`approvals.md`).
NEW: - The gates: requirements approval, design approval, result approval, a merge to the default branch, a deployment, Done, Cancel, and anything that cannot be undone (`approvals.md`). Merging a builder's branch into its item's branch is not a gate (section 4).
~~~

**Line 162 · W3**
~~~text
OLD: and ask through the skill that owns the gate.
NEW: and ask through the skill that asks for that approval (`work-refine` for requirements, `solution-design` for the design, `work-check` for the result, and `work-finish` for a merge, a deployment, Done, or Cancel), or in the reply for anything else.
~~~

**Line 175 · W3**
~~~text
OLD: - The parent: its own `work-check` over the whole goal, walking the flow end to end, then his result approval, then `work-finish`.
NEW: - The parent: its own `work-check` over the whole goal, which tries every step from start to finish as the person who uses the result, then his result approval, then `work-finish`.
~~~

**Line 190 · W4 · Mike decides (section 4)**
~~~text
OLD: - In a new session, helpers from the old session are not running. For each team line, look at the helper's branch:
NEW: - In a new session, builders from the old session are not running. A chat under a Main Orchestrator may still be running: message it and wait for its report before you start anything for its sub-item. For each builder line, look at the builder's branch:
~~~

**Line 194 · W4**
~~~text
OLD: git log --oneline -5 claude/wi-041-p1-t01 ... Commits there: run section 4 with the commits as its report. ... No commits: remove its worktree and branch, and start a new builder.
NEW:   ```text
  git log --oneline <item branch>..<builder branch>
  ```

  Commits listed: run section 4 with the commits as its report. Check them and run the tests against the task's "Done when"; what is missing stays open. Nothing listed: remove its worktree and branch, and start a new builder.
~~~

**Line 199 · W4 · Mike decides (section 4)**
~~~text
OLD: No commits: remove its worktree and branch, and start a new builder.
NEW: Nothing listed, and `git -C <builder worktree> status --short` prints nothing: remove its worktree and branch, and start a new builder. Uncommitted changes in its worktree: keep them, tell the owner in one line, and ask whether to use them or remove them.
~~~

#### `references/team-arrangements.md`

**Line 37 · W7 · Mike decides (section 4)**
~~~text
OLD: > Do you want me to archive sessions after their task is fully complete, everything is merged and shipped, and you approved?
NEW: > Do you want me to archive chats after their task is fully complete, everything is merged and shipped, and you approved?
~~~
Note: `SKILL.md` lines 46-48 hold the same question; change both.

**Line 47 · W3**
~~~text
OLD: - Helpers do the heavy work: building, reading long files, running checks.
NEW: - Helpers build, read long files, and run checks.
~~~

**Line 58 · W4 · Mike decides (section 4)**
~~~text
OLD: - Run one chat per sub-item or per responsibility.
NEW: - Run one chat per sub-item. Each chat has its own lead and its own helpers, arranged as in section 2.
~~~

**Line 60 · W4**
~~~text
OLD: - The Main Orchestrator is the only writer of the goal's work items, of shared files such as version numbers and indexes, and of merges.
NEW: - The Main Orchestrator is the only one that writes the goal's work items, writes files that more than one chat changes (for example a file that holds a version number, or an index file), and merges.
~~~
Note: a chat lead runs `running-the-team.md` section 4, which merges builder branches, but section 4 of this file tells a chat never to merge; that conflict is older than this fix.

**Line 72 · W2**
~~~text
OLD: - A new chat starts from a task button the owner clicks. You cannot start a chat silently.
NEW: - Offer the new chat with the tool from section 1; it starts only when the owner clicks it. You cannot start a chat without his click.
~~~

**Line 73 · W4**
~~~text
OLD: When the button offers its own worktree, use it. ... Put in its starting prompt: ... its branch and worktree,
NEW: Line 73: "When the tool makes a worktree for the new chat, the chat works in that worktree: put its branch in the starting prompt, not a worktree path." Line 75: "its branch, and its worktree when the tool does not make one,"
~~~

**Line 76 · W2 · Mike decides (section 4)**
~~~text
OLD: the owner's working principles in his words (including "build what the requirements ask and no more"), and the lead and helper split.
NEW: the owner's instructions from `.claude/rules/owner-preferences.md` that apply to its work, in his words, the rule "build what the requirements ask and no more", and how its lead and its helpers divide the work (section 2).
~~~

**Line 80 · W3**
~~~text
OLD: A chat will not let a message from another chat lift a limit set in its own starting prompt.
NEW: A chat will not let a message from another chat remove a limit set in its own starting prompt.
~~~

**Line 84 · W4**
~~~text
OLD: - Set the chat lead's model on purpose; a new chat may copy this chat's model.
NEW: - Set the chat lead's model to the most capable model the host offers (section 6). A new chat may otherwise copy this chat's model.
~~~

**Line 93 · W4 · Mike decides (section 4)**
~~~text
OLD: its work is merged and shipped;
NEW: its work is merged to the default branch and, when the sub-item has a deployment, deployed;
~~~

#### `examples/delegated-run.md`

**Line 15 · W7**
~~~text
OLD: - Q-11, added already answered: "Should agents take responsibility for delivering this, with the owner as product owner?"
NEW: - Q-11, added already answered: "Would you like agents to take responsibility for delivering this, with you acting as product owner?" Answer: "You drive. I'll approve things." Decision? `yes`. Affects `delivery`.
~~~

**Line 30 · W3**
~~~text
OLD: Fix: WI-042 owns the file; WI-041 P1-T01 depends on WI-042 P1-T01.
NEW: > `Sources/Models/Transaction.swift`. Fix: only WI-042 P1-T01 writes the file; WI-041
> P1-T01 depends on WI-042 P1-T01.
~~~
Note: if Mike answers `running-the-team.md` line 40 with "one writer at a time", revisit this line.

**Line 60 · W4 · Mike decides (section 4)**
~~~text
OLD: Then the lead starts the WI-041 builder, whose dependency is now merged, and sends WI-042 to `work-check`.
NEW: If Mike accepts the proposal for running-the-team.md line 71: "Then the lead merges `claude/wi-042-device-store` into WI-041's item branch, from WI-041's worktree, starts the WI-041 builder, and sends WI-042 to `work-check`."
~~~

### 3.15 work-finish (`<shared>work-finish/`)

#### `SKILL.md`

**Line 3 · W7** (description)
~~~text
OLD: (pull request, merge, deployment, requirements update) ... Not for checking whether a build is ready; use work-check. Not for one task; use the work track skill.
NEW: description: 'Ships and closes an approved work item (pull request, merge, deployment, specification update) or cancels one, and asks the owner before marking it Done, so nothing merges, deploys, or closes without his yes. Use when the owner says "ship it", "close it", "mark it done", or "cancel WI-031". Not for checking if a build is ready; use work-check. Not for a task''s status; use the work track skill.'
~~~
Note: 2.1 changes the same description. Use the merged text in 2.30. The routing test should include "mark P1-T03 done" and "mark WI-050 done" (a `task`-type item).

**Line 21 · W4**
~~~text
OLD: Find the item by its ID with the work find skill and read it fresh. It is not where it was: find it again by its ID, tell the owner in one line, and carry on.
NEW: - Find the item by its ID with the work find skill and read it fresh. When it is not where it was, or a field differs from what you wrote: tell the owner in one line what you found, add a Recent History row (for a move: "Moved by hand: <old place> to <new place>"), and carry on (`references/work-item-format.md`, section 9).
~~~

**Line 32 · W4**
~~~text
OLD: Check that `result_approved` is set and that the independent checker passed the branch's current head commit (`references/ship.md`, section 1). Not set, but `work-check` already showed him the result, the gaps, and the evidence for that head: ... Anything else: use `work-check` and stop here.
NEW: 1. **Result approval.** Check that `result_approved` is set and that the independent checker passed the result: for an item that changed files in the repository, the branch's current head commit (`references/ship.md`, section 1). Not set, but `work-check` already showed him the result, the gaps, and the evidence for what the checker passed: his "ship it" or "mark it done" is the result approval. Record it (`references/approvals.md`, sections 3 and 7). Anything else: use `work-check` and stop here.
~~~

**Line 39 · W4**
~~~text
OLD: 2. **Pull request (stage 12)**, only when the item changed files in the repository: push the item's branch and open the pull request.
NEW: 2. **Pull request (stage 12)**, only when the item changed files in the repository and the project has a remote: push the item's branch and open the pull request. Set stage `12-pr-and-push`, status In Review (`references/ship.md`, section 2). No remote: go to step 3, the local merge.
~~~

**Line 58 · W4**
~~~text
OLD: 7. **Sub-items.** List the open ones with the work find skill. Each is finished, cancelled, or moved on its own (`references/close.md`, section 1).
NEW: 7. **Sub-items.** List the open ones with the work find skill. Each needs its own Done, cancel, or move, unless the owner says to mark the parent Done anyway (`references/close.md`, section 1).
~~~

**Line 65 · W4**
~~~text
OLD: 9. **After his yes:** save his words first, then set status Done, rewrite the item's Current state, update the Roadmap, and remove the item's line from the project's Current State
NEW: 9. **After his yes:** save his words first, then set status Done, rewrite the item's Current state, check that every Roadmap phase the item completed still says Done, and remove the item's line from the project's Current State (`references/close.md`, sections 2 and 3).
~~~

**Line 84 · W2**
~~~text
OLD: **The owner marked it Done or Cancelled himself:** that counts; never undo it. Record it and finish the tidy-up (`references/close.md`, section 6).
NEW: **The owner marked it Done or Cancelled himself:** that counts; never undo it. Record it, then finish the steps that follow Done or Cancel: the item's Current state, the project's Current State, and the memory offer (`references/close.md`, section 6).
~~~

**Line 89 · W4**
~~~text
OLD: - Only the owner marks an item Done or Cancelled. A stage move never sets Done; the stage stays where it was.
NEW: - Only the owner decides Done or Cancelled: set either status only after he says so, and never undo one he set himself. Moving the stage never sets Done or Cancelled, and setting Done or Cancelled never changes the stage.
~~~

**Line 91 · W4**
~~~text
OLD: "Ship it" is the result approval; it is a yes to the merge only when he says it right after you asked "Merge ...?".
NEW: - A result approval never covers the merge, a deployment, spending, or publishing. "Ship it" is the result approval only after he has seen the result, the gaps, and the evidence. It is a yes to the merge only when it is his answer to your question "Merge ...?".
~~~

**Line 98 · W2**
~~~text
OLD: Each gate's checklist still applies.
NEW: The checklist for each approval still applies, for example the Done checklist (`references/approvals.md`, section 8).
~~~

**Line 101 · W4**
~~~text
OLD: - Never mark Done while the item's changes or its `requirements/` and `system-guide/` updates are unmerged or unsaved, unless he said to leave them.
NEW: - Never mark Done while the item's changes are unmerged, unless he said to leave them on their branch. Never mark Done while its `requirements/` and `system-guide/` updates are unsaved.
~~~

**Line 107 · W4**
~~~text
OLD: - A GitHub pull request body says "Part of #12", never "Closes #12" or "Fixes #12": GitHub would close the issue, which marks the item Done without his yes.
NEW: - In a project that tracks work in GitHub Issues, the pull request body says "Part of #12", never "Closes #12" or "Fixes #12": GitHub would close the issue, which marks the item Done without his yes.
~~~

**Line 116 · W4**
~~~text
OLD: Current State names the item by ID only, and its line goes the moment the item is Done or Cancelled.
NEW: - Never save the item's status or history to memory or to Current State. Current State names the item by its ID and a few words on what it is for. Its line under "Now" is removed the moment the item is Done or Cancelled.
~~~

**Line 119 · W4**
~~~text
OLD: - Never move, archive, or delete the item. Moving or archiving happens only when the owner asks, with the work track skill.
NEW: - Never delete the item. Move or archive it only when the owner asks, with the work track skill.
~~~

#### `references/ship.md`

**Line 42 · W4**
~~~text
OLD: `git status` in the worktree shows changes to the item's files: nobody checked them. Commit them, each staged by name, and go back to `work-check`.
NEW: Run `git -C <item worktree> status`. When it shows changes to the item's files, nobody checked them: commit them, each staged by name, and go back to `work-check`.
~~~
Note: the next sentence ("Never commit `work-items/` or `memory/`.") stays.

**Line 95 · W4**
~~~text
OLD: The head moved after the check (a new commit, or the default branch merged into the item's branch to fix a conflict): start the acceptance checker on the new head with `acceptance-checker.md`, "Check: result check". It finds no blocking issue: the standing instruction applies. Otherwise ask him.
NEW: At the merge under the standing merge instruction, when the head moved after the check (a new commit, or the default branch merged into the item's branch to fix a conflict): start the independent checker on the new head with the brief in `acceptance-checker.md`, "Check: result check". The checker finds no blocking issue: the standing instruction applies. Otherwise ask him.
~~~

**Line 103 · W4**
~~~text
OLD: After the merge: confirm it reached the default branch, and check that one Recent History row names the pull request and the merge commit (`merge-and-clean-up` may have added it; add it when it did not). `merge-and-clean-up` also removes the pull request's branch and worktree.
NEW: After the merge: confirm it reached the default branch, and add one Recent History row that names the pull request and the merge commit. `merge-and-clean-up` reports the merge commit and adds nothing to the item when `work-finish` started it. `merge-and-clean-up` also removes the pull request's branch and worktree.
~~~

**Line 124 · W4**
~~~text
OLD: - [ ] From the primary checkout, on the default branch:
NEW: - [ ] Check that the primary checkout is on the default branch: `git -C <primary checkout> branch --show-current`. It is on another branch: stop and tell the owner; never switch its branch. It is on the default branch: merge from it:
~~~

**Line 130 · W7**
~~~text
OLD: run the item's checks again, then the merge safety check and the fast-forward again. The new head needs a new check under a standing merge instruction (section 3).
NEW: - [ ] The fast-forward fails because the default branch moved on: in the item's worktree run `git -C <item worktree> merge main`, run the item's checks again, then the merge safety check and the fast-forward again. Under a standing merge instruction, the new head needs a new independent check before the fast-forward (section 3).
~~~

**Line 134 · W4**
~~~text
OLD: git worktree remove .claude/worktrees/wi-007-csv-export
git branch -d claude/wi-007-csv-export
NEW: git -C <primary checkout> worktree remove .claude/worktrees/wi-007-csv-export
git -C <primary checkout> branch -d claude/wi-007-csv-export
~~~

**Line 178 · W4**
~~~text
OLD: - Offer to remove the delivered ones, each with a one-line reason.
NEW: - Offer to remove each one whose commits reached the default branch and whose worktree has no uncommitted changes, each with a one-line reason. Name any other one to the owner and leave it until he says what to do with it. Remove one only after his yes: `git -C <primary checkout> worktree remove <folder>`, then `git -C <primary checkout> branch -d <branch>`. Never `--force`, and never one with uncommitted work.
~~~

**Line 184 · W4**
~~~text
OLD: - `git status` in the primary checkout must show none of the item's files uncommitted.
NEW: - Run `git -C <primary checkout> status`. It must show none of the item's files uncommitted. It shows some: name them to the owner and ask what to do; never commit, stash, or remove them yourself.
~~~

#### `references/close.md`

**Line 37 · W4**
~~~text
OLD: The evidence line names what shows it works: the checker's verdict and commit, the merged pull request, the deploy result, or what the owner saw.
NEW: The evidence line names every one of these that applies: the checker's verdict and commit, the merged pull request, the deploy result, and what the owner saw.
~~~

**Line 62 · W4**
~~~text
OLD: - [ ] Every Roadmap phase the item completed says Done.
NEW: - [ ] Check that every Roadmap phase the item completed still says Done (the Done checklist required it before you asked).
~~~

**Line 64 · W3**
~~~text
OLD: - [ ] Read the item back and check each change landed.
NEW: - [ ] Read the item back and check each change was saved.
~~~

**Line 78 · W7 · Mike decides (section 4)**
~~~text
OLD: `memory/CURRENT_STATE.md` in the main checkout (from a worktree, the first path `git worktree list` prints)
NEW: `memory/CURRENT_STATE.md` in the primary checkout (from a worktree, the first path `git worktree list` prints)
~~~
Note: one name must be chosen across `close.md`, the walkthrough (line 6), the `dev/build-shared/` sources, and, if Mike wants, the model's `AGENTS.md`, `work-item-folders.md`, and `shared-repository-work.md`.

**Line 86 · W4**
~~~text
OLD: - A "Next session starts with" line that names the item: rewrite it to the next true step, or "None.".
NEW: - A "Next session starts with" line that names the item: rewrite it to where the next session should resume, what to read, and the next action (`decisions-and-memory.md`, section 10), or "None." when there is nothing to resume.
~~~

**Line 101 · W4**
~~~text
OLD: 1. Take the item's Questions and Answers rows with Decision? `yes` and Status Answered. Leave out approvals, the Done or cancel row, merge and deploy yeses, Superseded rows, and rows whose memory question was already answered (a row records his answer, or a memory record already names this item and Q-ID: ...).
NEW: 1. Take the item's Questions and Answers rows with Decision? `yes` and Status Answered. Leave out approvals, the Done or cancel row, merge and deploy yeses, and Superseded rows. Also leave out each decision whose memory question was already answered: a "Save Q-xx to memory too?" row holds his answer, or a memory record already names this item and that Q-ID. Check for such a record with the memory find skill; in a Hindsight project, `recall` with the tag `wi:<ID>` and `tags_match: "any_strict"`.
~~~

**Line 127 · W4**
~~~text
OLD: 8. No answer (he moves on): the rows stay Open.
NEW: 8. His next message does not answer it: the rows stay Open. Add one line under "Waiting on the owner" in Current State ("WI-031: save Q-04 and Q-06 to memory?"), and remove it when he answers.
~~~

**Line 135 · W4**
~~~text
OLD: - [ ] His words are the reason. Record them as an answered row, for example "Cancel WI-031?" with his words, Decision? `yes`. His message does not make clear which item: ask.
NEW: - [ ] His message does not make clear which item: ask first.
- [ ] His words are the reason. Record them as an answered row, for example "Cancel WI-031?" with his words, Decision? `yes`.
~~~

**Line 166 · W4**
~~~text
OLD: - Tell him in one line what had not happened yet: no result approval, no independent check, the pull request still open, the specification not updated. Ask one question about what he wants done with it.
NEW: - When any of these had not happened yet, tell him in one line which: no result approval, no independent check, the pull request still open, the specification not updated. Then ask one question: what he wants done about them.
~~~

**Line 169 · W4**
~~~text
OLD: Reopen the issue only after his answer.
NEW: - A GitHub issue closed by a pull request merge ("Closes #12") was not closed by the owner. Tell him and ask whether the item is Done. When he answers that it is not Done, reopen the issue; until he answers, leave it closed.
~~~

#### `references/spec-update.md`

**Line 3 · W6**
~~~text
OLD: The detail behind `work-finish` step 5. While the work was in progress, the work item held the requirements. After delivery, what the owner approved and the result delivered becomes the project's lasting record in `requirements/`, and the system's verified structure in `system-guide/`.
NEW: The detail behind `work-finish` step 5: write the behavior the owner approved and the checker saw delivered into `requirements/`, the project's lasting record, and the system's verified structure into `system-guide/`.
~~~

**Line 20 · W4**
~~~text
OLD: - Research, discovery, and repository upkeep usually change neither. Then write nothing here, and add one Recent History row: "No change to agreed behavior: `requirements/` and `system-guide/` unchanged."
NEW: - When the item changed neither (research, discovery, and repository upkeep usually change neither), write nothing here. Name stage 14 in the one Recent History row for skipped stages (`work-finish` step 6), with the reason "No change to agreed behavior: `requirements/` and `system-guide/` unchanged."
~~~

**Line 31 · W4 · Mike decides (section 4)**
~~~text
OLD: - Copy only behavior that was delivered and approved: the item's `R-xx` blocks with Status Finalized that the independent checker reported as Met. An approved requirement that was not delivered is never written as shipped; write it as an approved future requirement, clearly labeled, or leave it out and say so.
NEW: - Copy the item's `R-xx` blocks with Status Finalized that the independent checker reported as Met, as delivered behavior. A Finalized requirement the checker did not report as Met is never written as delivered. Use your judgment: write it with its "Delivery status and evidence" line as a clearly labeled approved future requirement, or leave it out. Either way, tell the owner in one line what you did with it.
~~~
Note: this text is a placeholder until Mike says what should decide between the two; "Use your judgment" does not yet say what to weigh.

#### `references/salesforce-deployment.md`

**Line 31 · W1**
~~~text
OLD: Never write or run a script or file that deploys, validates, writes data, or runs Apex: the guard checks only the command it sees.
NEW: - Run each `sf` command directly, alone. Never write or run a script or file that deploys, validates, writes data, or runs Apex: the guard hook (`guard-protected-orgs.cjs`, where installed) checks only the command it sees.
~~~

**Line 39 · W7**
~~~text
OLD: - [ ] `sf-component-tracker` is current.
NEW: - [ ] The component tracker, `delivery/deployment/component-tracker.csv`, is current (update it with the `sf-component-tracker` skill).
~~~
Note: replaces only the bullet's first sentence; the item folder and its files stay.

**Line 46 · W4**
~~~text
OLD: - [ ] `sf-deploy-check` finds nothing that would ship too early, on the exact deploy set, for every shared org (UAT, full copy, staging, production). A confirmed hitch-hiker: stop and tell the owner which component and what would ship.
NEW: - [ ] Before a deploy to a shared org (UAT, full copy, staging, production): `sf-deploy-check` finds nothing that would ship too early to that org, on the exact deploy set. A confirmed hitch-hiker (a component or edit that would ship too early): stop and tell the owner which component and what would ship.
~~~

**Line 57 · W7**
~~~text
OLD: Validate first, with the item's own package: (also line 82: "with its `-x` package"; line 83: "what it deploys, from the package")
NEW: Line 57: "Validate first, with the item's own `package.xml`:". Line 82: "- the exact command, with `-x` and the item's `package.xml`, and `-o <production alias>`;". Line 83: "- what it deploys, from the `package.xml`, and the `sf-deploy-check` result;". Lines 27 and 89 keep "package" for the `sf-data-change` output.
~~~
Note: if Mike accepts the `sf-data-change` rename to "handoff" (3.26), lines 27 and 89 change to "handoff" instead.

#### `examples/finish-walkthrough.md`

**Line 3 · W4**
~~~text
OLD: A project with local work items, local memory, a GitHub remote, and no Salesforce.
NEW: A project with local work items, local memory, a GitHub remote, no Salesforce, and no System Guide (`PROJECT.md` says it is not used).
~~~

**Line 90 · W4**
~~~text
OLD: | Q-11 | Merge pull request #14 into main? | "Yes, merge it and mark it done." | 2026-10-02 | yes | PR #14 | Answered | owner |
NEW: | Q-11 | Pull request #14 is open and its checks pass. Merge it into main? | "Yes, merge it and mark it done." | 2026-10-02 | yes | PR #14 | Answered | owner |
~~~

**Line 136 · W4**
~~~text
OLD: (end of the WI-040 bullet: "... and its line removed from the project's Current State.")
NEW: Add this bullet after line 136: "- None of WI-040's decisions look project-wide: the agent says so in one line ("None of WI-040's decisions look project-wide, so nothing goes to memory.") and asks nothing."
~~~

### 3.16 work-on (`<shared>work-on/`)

#### `SKILL.md`

**Line 13 · W4**
~~~text
OLD: It never approves anything, marks an item Done, merges, or deploys.
NEW: It never approves anything, marks an item Done, or merges into the default branch. It deploys only to a Salesforce sandbox, after the owner's yes (Gotchas).
~~~

**Line 22 · W7**
~~~text
OLD: then the one Current State names ("Next session starts with", then "Now") ... [line 57] name the Q-ID in the Current state's "Next action" and "Waiting on"
NEW: Line 22: "then the one the project's Current State names ("Next session starts with", then "Now")". Lines 57-58: "name the Q-ID in the "Next action" and "Waiting on" lines of the item's Current state".
~~~

**Line 28 · W4**
~~~text
OLD: its Current state first (the five lines at the top of its Overview)
NEW: its Current state first (the five lines under `### Current state` in its Overview)
~~~

**Line 31 · W4**
~~~text
OLD: Hindsight: `recall` with the tag `wi:<ID>`, as the memory rule says
NEW: Hindsight: `recall` with the tag `wi:<ID>` and `tags_match: "any_strict"`, as the memory rule says
~~~

**Line 37 · W4**
~~~text
OLD: His change wins. Tell him in one line, add a Recent History row with the work track skill, and carry on. Never undo it.
NEW: His change wins: never undo it. Tell him in one line and add a Recent History row with the work track skill. Then carry on, unless the change is a case in the "Cases that need his answer" table of section 5: do what that row says first (Done set by him: stop building the item).
~~~

**Line 60 · W4**
~~~text
OLD: When he answers, save his words and the date in the row at once, update what it affects, add a Recent History row naming the Q-ID, then continue.
NEW: When he answers, save his words and the date in the row at once, update what it affects, add a Recent History row naming the Q-ID, set `waiting_on` to `agent` unless another of his questions is still open, rewrite the item's Current state, then continue.
~~~

**Line 87 · W4**
~~~text
OLD: A task whose "Done when" names the owner is his question. Never tick it yourself.
NEW: A task whose "Done when" names the owner is a question for him: add a Questions and Answers row and ask it. Tick the task only after his answer meets the "Done when", never before.
~~~

**Line 111 · W4**
~~~text
OLD: After each builder reports: check its tests yourself
NEW: After each builder reports: run its tests yourself
~~~
Note: the same phrase is in `references/building.md` line 168 and the shared source `dev/build-shared/helper-briefs/builder.md` line 45 (3.2). Never edit the copy `references/builder-brief.md` by hand.

#### `references/starting-and-resuming.md`

**Line 23 · W7**
~~~text
OLD: the item Current State's "Next session starts with" names; the one item under "Now". [also line 139 "differs from the Current state", line 142 "An item named in Current State, the roadmap, or another item", line 162 "(Current State, the parent's Roadmap)", line 184 "the Current state's Next action"]
NEW: Line 23: "the item named under "Next session starts with" in the project's Current State; the one item under its "Now"." Line 139: "differs from the item's Current state and its latest Recent History row". Line 142: "An item named in the project's Current State, `PROJECT-ROADMAP.md`, or another item cannot be found". Line 162: "(the project's Current State, the parent's Roadmap)". Line 184: "Stay: continue from the Next action in the item's Current state". building.md line 182: "`waiting_on: owner`, and the Next action and Waiting on lines of the item's Current state naming the Q-ID".
~~~
Note: the shared source `work-item-format.md` line 291 gets the same fix (3.1).

**Line 25 · W4**
~~~text
OLD: Search with the work find skill. One match: use it. Two or more: ask one question naming each, with your recommendation.
NEW: Search with the work find skill. One match: use it. Two or more: ask one question naming each, with your recommendation. None: say so in one line and ask whether it is new work (section 3).
~~~

**Line 30 · W4**
~~~text
OLD: A bare "yes" or "ok" right after a question in this chat is the answer to that question. Save it in its Questions and Answers row first.
NEW: A bare "yes" or "ok" right after a yes-or-no question in this chat is the answer to that question. Save it in its Questions and Answers row first. After any other question, it is not an answer: show the choice again with your recommendation.
~~~

**Line 45 · W4**
~~~text
OLD: 2. ... and that does not wait on the owner. 3. The Ready item with the highest priority (urgent, high, medium, low); the oldest first when two tie.
NEW: 2. The next unit in `PROJECT-ROADMAP.md`, in phase order, whose linked item is Ready (stage 03) or later, whose "Depends on" units are done, and whose item waits on nobody (`waiting_on` is `agent` or `none`).
3. The Ready item that waits on nobody with the highest priority (urgent, high, medium, low); the lowest ID number first when two tie.
~~~
Note: "whose "Depends on" units are done" gets the same change as `local-work-find` `queries.md` line 102 (3.21): "each have a linked item with status Done".

**Line 54 · W4**
~~~text
OLD: Nothing is Ready: say so, name the item closest to ready and what it needs, and ask one question
NEW: No item passes the three picks: say so, name the item closest to ready and what it needs, and ask one question ("WI-034 needs its requirements agreed. Shall I start on them?"). Closest to ready is your judgment: weigh its stage against how many open questions it has.
~~~
Note: `local-work-find` `queries.md` line 114 (3.21) defines "closest to ready" by stage; make the two match when applying.

**Line 62 · W4 · Mike decides (section 4)**
~~~text
OLD: | Quick edit, no item | One sitting, no choice for the owner, no change to behavior in `requirements/`, nothing bound for production |
NEW: | Quick edit, no item | Finished in this session, no choice for the owner, no change to what the product does, to Salesforce metadata, or to data, nothing bound for production |
~~~

**Line 63 · W4**
~~~text
OLD: Look for an item that already covers it. Then make the item at `01-discovery` with his exact words as the Starting request.
NEW: Look for an item that already covers it. One does: name it in the reply, make no new item, and stop. None does: make the item at `01-discovery` with his exact words as the Starting request, reply "Logged as WI-014 (bug, backlog). Not started." and stop.
~~~

**Line 76 · W4**
~~~text
OLD: Project setup steps are never work items. Say them in the reply.
NEW: Toolkit setup steps (the work of the `project-setup` skill) are never work items. Report them in the reply instead of tracking them.
~~~

**Line 96 · W4**
~~~text
OLD: The item's Current state, first: the five lines at the top of its Overview say where it stands
NEW: The item's Current state, first: the five lines under `### Current state` in its Overview say where it stands
~~~

**Line 141 · W4**
~~~text
OLD: | A task ticked, a phase reordered, or a task or sub-item in another phase | He changed the plan |
NEW: | A task ticked, a phase reordered, or a task or sub-item moved to another phase, with no Recent History row or task evidence from an agent to explain it | He changed the plan |
~~~

**Line 153 · W3**
~~~text
OLD: Bring the records that follow from his change in line, and say so in the same line
NEW: Update the records his change affects: the item's `parent` matches where he put it, and each parent's Roadmap Sub-items list matches its sub-items. Name these updates in the same one line you tell him.
~~~

**Line 166 · W4**
~~~text
OLD: The rest of the close-out is `work-finish`'s.
NEW: Then open `work-finish` for the rest of the close-out.
~~~
Note: `work-finish` `close.md` section 6 also adds the "Marked Done by the owner by hand" row; make sure only one skill adds it.

**Line 177 · W2**
~~~text
OLD: `work-delegate`: it resumes the team from the parent's team list
NEW: `work-delegate`: it resumes the team from the team list in the top-level item's Notes, "Context"
~~~

**Line 178 · W4**
~~~text
OLD: | Type `build` or `data-load` with no requirements approval, Requirements still Refining, or he asks to change, add, or drop a requirement | `work-refine` |
NEW: Row 178: "| Type `build` or `data-load` with no requirements approval; any other item whose Requirements are still Refining, except a `task` with no open choices at stage 01 or 02 and a `task` that already skipped the approval (a Recent History row gives the reason); or he asks to change, add, or drop a requirement | `work-refine` | "WI-012 needs its requirements agreed first. Opening work-refine." |". Add this row right after it: "| A `task` with no open choices and no requirements approval, at stage 01 or 02 (section 3) | Stay: plan it (stage 06). Add a Recent History row with the reason | |".
~~~

**Line 180 · W5**
~~~text
OLD: approved requirements with more than one reasonable way to build ... [row 181] one clear way to build
NEW: Row 180: "| `design: proposed`, or approved requirements with more than one way to build, no approved design, and not a sub-item covered by its parent's approved design | `solution-design` | "WI-012 needs a design. Opening solution-design." |". Row 181: "| Approved requirements, only one way to build, no design | Stay. Add a Recent History row with the reason | "One way to build this: <approach>. I'll build it that way; say 'design first' to stop me." |". Add under the table: "- Whether there is more than one way to build is your judgment: count two ways only when they differ in what the owner gets, in cost, or in risk."
~~~

**Line 200 · W4 · Mike decides (section 4)**
~~~text
OLD: Each item has one main session that changes it. Other sessions report to it instead of editing the same item.
NEW: Only one session changes an item: the one working in the item's own worktree. Another session that needs a change to that item tells the owner instead of editing it.
~~~
Note: an item that changes no committed files has no worktree; Mike's answer should cover that case.

#### `references/building.md`

**Line 5 · W4**
~~~text
OLD: step, and stops cleanly.
NEW: step, and runs the checklist before it stops (section 8).
~~~

**Line 24 · W4**
~~~text
OLD: Build the phases from the approved design's "Build and verification plan" (its Technical sequence and Acceptance checks) and the selected option's Build order.
NEW: Add this as the first bullet of section 1: "- When the owner approved a design, `solution-design` already turned its Build order into Tasks under the Roadmap phases. Start from those tasks: check them against this section, and add only what is missing (for example a task for an Acceptance check). Never add a Build order step twice."
~~~
Note: `SKILL.md` step 6 has the same wording; point it to this bullet too.

**Line 38 · W4**
~~~text
OLD: Each task names the `R-xx` it builds and the design section it follows. Link sources; never copy them.
NEW: Each task names the `R-xx` it builds, the design section it follows, and any source file from Notes, "Sources", that it draws on. Name them; never copy their text into the task.
~~~

**Line 40 · W7**
~~~text
OLD: every requirement has at least one task, and every Acceptance check has a task that proves it.
NEW: every requirement has at least one task, and every acceptance check (each `R-xx` block's Acceptance check, each item of the Requirements "Acceptance" list, and each row of the design's "Acceptance checks") has a task that proves it.
~~~

**Line 73 · W6**
~~~text
OLD: Phase status: Not Started, In Progress, Done, or Cancelled. Task status: Not Started, In Progress, Done, or Cancelled. No other words.
NEW: Phase and task status: Not Started, In Progress, Done, or Cancelled. No other words.
~~~

**Line 80 · W4**
~~~text
OLD: A top-level item with `delivery: not-offered` whose plan has sub-items, more than one phase, or more than two tasks: open `work-delegate` ... A small item (one or two tasks, no sub-items): no offer. Build it.
NEW: - A top-level item with `delivery: not-offered` whose plan has sub-items, more than one phase, or more than two tasks: open `work-delegate` for the delivery offer. Build nothing until he answers.
- A small item (one phase, one or two tasks, no sub-items): no offer. Build it.
- `delivery: owner-led`: no offer. Build it.
(Keep the sub-item and `agent-led` bullets as they are.)
~~~
Note: `work-delegate` `delivery-offer.md` section 2 gets "one phase" too (3.14).

**Line 100 · W7**
~~~text
OLD: `<primary checkout>` is the first path `git worktree list` prints. ... [line 113] Local work items and local memory stay in the main checkout.
NEW: `<primary checkout>` is the main checkout: the first path `git worktree list` prints.
~~~

**Line 108 · W3**
~~~text
OLD: **Sub-items** for phases that own real scope:
NEW: **Sub-items**, for each phase that meets a split rule in `references/splitting-and-replanning.md`, section 1.
~~~

**Line 110 · W4**
~~~text
OLD: A test plan, when the checks need more than the acceptance checks: `work-check` writes it.
NEW: No test plan here. When the checks need more than the acceptance checks, `work-check` writes one during testing (stage 09).
~~~

**Line 126 · W4**
~~~text
OLD: 4. Run the checks.
NEW: 4. Run the task's tests, the check its "Done when" names, and the project's other tests that cover the files you changed.
~~~
Note: the second sentence of step 4 stays.

**Line 137 · W4**
~~~text
OLD: add a Recent History row only when something material happened: a requested result finished, the plan changed, a discovery, or an answer (name the Q-ID).
NEW: add a Recent History row only in the cases `references/work-item-format.md`, section 5, lists under "Recent History gets a row when" (for example a requested result finished, a discovery that changes the plan, or an answer, naming the Q-ID);
~~~
Note: section 8, lines 199-200 ("when something material did"), points to the same list.

**Line 152 · W4**
~~~text
OLD: A task whose "Done when" names the owner ("the owner confirms the wording") is his question: a Questions and Answers row. Never tick it yourself.
NEW: A task whose "Done when" names the owner ("the owner confirms the wording") is a question for him: add a Questions and Answers row and ask it. Tick the task only after his answer meets the "Done when", never before.
~~~

**Line 168 · W4**
~~~text
OLD: After each report: check its tests yourself
NEW: After each report: run its tests yourself
~~~

**Line 192 · W4**
~~~text
OLD: Before the reply that ends a session with work unfinished:
NEW: Before any reply that leaves work on the item unfinished (you wait on the owner, you pause, or he says he is stopping):
~~~

#### `references/splitting-and-replanning.md`

**Line 37 · W4**
~~~text
OLD: the title is in his words,
NEW: the title is the one he approved (his own words where he changed it),
~~~

**Line 51 · W4**
~~~text
OLD: add it to the sub-item under the sub-item's next free task ID. Notion: set the task's Work item to the sub-item and its Phase to one of the sub-item's phases, and give it the sub-item's next free Task ID.
NEW: add it to the sub-item under the phase the task delivers, with the next free task ID in that phase. Notion: set the task's Work item to the sub-item and its Phase to the sub-item's phase that the task delivers, and give it the next free Task ID in that phase. A sub-item with no phase for the task yet: add one first, with the next free phase ID (section 3, "Add a phase").
~~~

**Line 56 · W7**
~~~text
OLD: In Notion, the sub-item's phase does this; the view updates itself.
NEW: In Notion, set the sub-item's "Phase" property to that parent phase; the parent's Sub-items view then lists it.
~~~

**Line 98 · W6**
~~~text
OLD: Plans change midway. Each change is a small edit to the plan, never a rewrite.
NEW: Make each plan change as a small edit to the plan, never a rewrite.
~~~

**Line 107 · W4**
~~~text
OLD: | Merge two phases | Move the second phase's tasks and sub-items to the first. Set the second Cancelled, with Exit result "Merged into P1". |
NEW: | Merge one phase into another | Move the tasks and sub-items of the phase being merged to the phase it merges into. Set the merged phase Cancelled, with Exit result "Merged into P1". |
~~~

**Line 124 · W6**
~~~text
OLD: - Never delete a phase, task, or sub-item. Cancel it. [line 153] - Never delete an item, a phase, a task, or a sub-item.
NEW: Delete line 124. Line 153 becomes: "- Never delete an item, a phase, a task, or a sub-item. Cancel a phase or a task instead."
~~~

#### `examples/keep-going.md`

**Line 12 · W4**
~~~text
OLD: Its Current state says Next action "Agent: build P1-T03, the category picker."
NEW: Its Current state says Next action "Waiting on Mike: Q-07 (P1-T03, the category picker, does not need it)."
~~~

**Line 76 · W4 · Mike decides (section 4)**
~~~text
OLD: R-01 now says the category is required;
NEW: Option B (follows the shared rules): "R-01 now says the category is required, with Status back to Refining and Q-07 in its Decision record;" and replace "Then it builds P1-T04." with "P1-T04 waits: the agent opens work-refine to get his approval of the change to R-01." Option A (keeps the build going): "P1-T04's Done when now says a transaction without a category cannot be saved;", and set Q-07's Affects to P1-T04 in the setup at line 14.
~~~

#### `examples/split-and-replan.md`

**Line 3 · W2**
~~~text
OLD: The project is a Salesforce greenfield org for a client moving from an old org.
NEW: The project is a new Salesforce org, built from scratch, for a client moving from an old org.
~~~

### 3.17 work-refine (`<shared>work-refine/`)

#### `SKILL.md`

**Line 14 · W4 · Mike decides (section 4)** (the type rule)
~~~text
OLD: Set its `type` from `references/work-item-format.md`, section 4: a change to what the product does, to Salesforce metadata, or to anything bound for production is `build`, even while it is still a rough idea; a change to data is `data-load`; `discovery` is only for work whose result is an answer, not a change.
NEW: When you create the item, set its `type` from `references/work-item-format.md`, section 4: a change to what the product does, to Salesforce metadata, or to anything that will be deployed to production is `build`, even while it is still a rough idea; a change to data is `data-load`; `discovery` is only for work whose result is an answer, not a change. An item that already exists keeps its `type`.
~~~
Note: `work-on` `references/starting-and-resuming.md` lines 80-81 has the same overlap with `bug` and `enhancement`; apply Mike's answer in both skills.

**Line 14 · W4** (which item)
~~~text
OLD: with no ID, the item this chat is working on, then the one item the project's Current State names under "Now", then a search by his words.
NEW: with no ID, the item this chat is working on, then the item under "Now" in the project's Current State when "Now" names only one item, then a search by his words.
~~~

**Line 15 · W3**
~~~text
OLD: Never restart from the top.
NEW: Never start the interview again from its first question.
~~~

**Line 18 · W4**
~~~text
OLD: 5. **Interview one question at a time,** most basic first, each in the question format below (`references/interview.md`).
NEW: 5. **Interview one question at a time,** starting with what later questions depend on (`references/interview.md`, section 3), each in the question format below. Add the question's row before the reply ends, set `waiting_on: owner`, and rewrite the item's Current state so Next action and Waiting on name the Q-ID.
~~~

**Line 19 · W4**
~~~text
OLD: update the goal, requirement, acceptance line, phase, or sub-item it affects; name the Q-ID in Recent History; rewrite the Current state in place; read it back. Only then ask the next question.
NEW: 6. **Save each answer the moment he gives it,** in one save: fill its row (his words, the date, Decision?, Answered); update the goal, requirement, Acceptance list, phase, or sub-item it affects; name the Q-ID in Recent History; rewrite the item's Current state in place; read the item back and check each change. Only then ask the next question. A decision that passes the project-wide test: ask "This looks project-wide. Save it to memory too?" (`references/decisions-and-memory.md`, section 3).
~~~

**Line 21 · W4**
~~~text
OLD: When the work is too large for one item, propose sub-items and phases, and make them with the work track skill after his yes.
NEW: When a part of the work meets one of the tests in `references/roadmap-and-breakdown.md`, section 2, propose sub-items and phases, and make them with the work track skill after his yes.
~~~
Note: replaces only the middle sentence of step 8.

**Line 22 · W4**
~~~text
OLD: 9. **Stop asking** when every requirement has a required behavior and an acceptance check and no open row affects a requirement. Then ask once: "What have we not touched that could change this?"
NEW: 9. **Stop asking** when every requirement has a required behavior and an acceptance check, no open row affects a requirement, the roadmap has its phases, and whether to split into sub-items is settled (`references/interview.md`, section 7). Then ask once: "What have we not talked about yet that could change this?"
~~~
Note: the quoted question must match `interview.md` line 160.

**Line 34 · W3**
~~~text
OLD: Watch out: <the gotcha this choice runs into>.
Not yet covered: <what this touches that he has not raised>.
NEW: Watch out: <the gotcha of this choice>.
Not yet covered: <what this affects that he has not raised>.
~~~

**Line 43 · W3**
~~~text
OLD: A long interview survives a cleared context only in the item.
NEW: When the context is cleared, an answer not yet saved in the item is lost.
~~~

**Line 46 · W4**
~~~text
OLD: - Ask in the reply text, never through a separate question tool, and one question per reply. The only list is more than three readiness findings (`references/readiness-check.md`).
NEW: - Ask in the reply text, never through a separate question tool, and one question per reply. The only reply that asks several questions is a list of more than three readiness findings (`references/readiness-check.md`). A list of recommendations he can accept with one yes, each with a one-line reason, is one question (`references/approvals.md`, section 10).
~~~

**Line 47 · W4**
~~~text
OLD: - "Give me options first" is not a requirements approval: go to `solution-design` with the open questions kept visible.
NEW: - "Give me options first" is not a requirements approval: go to `solution-design`, leave the open rows Open, and say in the reply which Q-IDs are still open and that the requirements approval is still needed.
~~~
Note: 2.13 also asks to narrow this line to design options asked for before approval.

**Line 48 · W4**
~~~text
OLD: - "Remember", "from now on", "always", or "never" in the middle of an interview: use the memory save skill (a Hindsight project: as the memory rule says), then go back to the open question.
NEW: - "Remember ..." in the middle of an interview, or an instruction for how the agent works ("from now on", "always", "never"): use the memory save skill (a Hindsight project: as the memory rule says), then go back to the open question. "Always" or "never" about what the product must do is an answer: save it in the item.
~~~

**Line 49 · W4**
~~~text
OLD: - Never delete a requirement, a question row, or a phase. Mark it Superseded or Cancelled.
NEW: - Never delete a requirement, a question row, or a phase. Mark a requirement Superseded, a question row "Superseded by Q-xx", and a phase Cancelled.
~~~

#### `references/interview.md`

**Line 5 · W3**
~~~text
OLD: kind of answer, and how to resume and pause. Everything he says lands in the
work item, never in a separate notes file.
NEW: kind of answer, and how to resume and pause. What he says about the item is saved in the work item, never in a separate notes file.
~~~

**Line 23 · W3**
~~~text
OLD: a rough answer in the light of the goal and the rest of the system, and
  ask a follow-up question until the intent is clear.
NEW: Compare a rough answer with the goal and the rest of the system, and ask a follow-up question until the intent is clear.
~~~
Note: replaces the whole sentence that starts "Read a rough answer" (lines 22-24).

**Line 25 · W3**
~~~text
OLD: - Help him think. For each question, give your recommendation, the gotcha
  it runs into, and what it touches that he has not raised.
NEW: - Help him think. For each question, give your recommendation, its gotcha (section 4), and what it affects that he has not raised.
~~~

**Line 27 · W3**
~~~text
OLD: - Push back once when an answer would undermine his own goal, conflict with
  something he already decided, or cause a problem elsewhere.
NEW: - Say once that you disagree when an answer would keep his own goal from being met, conflict with something he already decided, or cause a problem elsewhere.
~~~

**Line 32 · W7**
~~~text
OLD: - Keep it light: do not read every answer back, and do not challenge every
  answer. Do not design the build while the goal is still open.
NEW: - Do not repeat every answer back to him, and do not challenge every answer. Do not design the build while the goal is still open.
~~~

**Line 70 · W3**
~~~text
OLD: - Chase vague words ("fast", "easy", "secure", "all users") until they mean
  something a tester can check, or record them as an open question.
NEW: - Ask about each vague word ("fast", "easy", "secure", "all users") until it means something a tester can check, or record it as an open question.
~~~

**Line 77 · W4**
~~~text
OLD: Before each question, check the answer against these angles. Put the one
that matters most for this question in "Not yet covered":
NEW: Before each question, check the question and your recommended answer against this list. Put the topic that matters most for this question in "Not yet covered":
~~~

**Line 97 · W3**
~~~text
OLD: A gotcha is a known trap of the choice he is about to make: a limit, a
NEW: A gotcha is a known problem with the choice he is about to make: a limit, a
~~~

**Line 116 · W3**
~~~text
OLD: 5. Read the item back and check the change landed.
NEW: 5. Read the item back and check that each change was saved.
~~~

**Line 122 · W7**
~~~text
OLD: | Something out of scope | The Boundaries line of the requirement it limits |
NEW: | Something out of scope | The "Boundaries and exceptions" line of the requirement it limits |
~~~

**Line 143 · W4**
~~~text
OLD: | A separate piece of work | Offer a new item at `01-discovery` with the work track skill, and name it under Related items. |
NEW: | A separate piece of work | Offer a new item at `01-discovery`. On his yes, make it with the work track skill and add its ID to this item's Related items. |
~~~

**Line 145 · W4**
~~~text
OLD: | "Stop asking, just decide" | Answer the remaining open questions with your recommendations, show them as one list with a reason each, and save his yes as a bulk yes. |
NEW: | "Stop asking, just decide" | Give your recommendation for each remaining open question, show them as one list with a reason each, and ask for his yes. Save his yes as a bulk yes (`approvals.md`, section 10). |
~~~

**Line 160 · W3**
~~~text
OLD: Then ask once: "What have we not touched that could change this?" Save the
NEW: Then ask once: "What have we not talked about yet that could change this?" Save the
~~~

**Line 163 · W3**
~~~text
OLD: "Grill me" means go deep: keep asking, one question at a time, until every
branch that could change the result is settled or recorded as open.
NEW: "Grill me" means ask in more detail: keep asking, one question at a time, until every point that could change the result is settled or recorded as an open question.
~~~

**Line 171 · W4**
~~~text
OLD: - Check whether the owner changed it by hand since the last session. His
  change wins: say in one line what you found and add a Recent History row.
NEW: - Compare the item with its Current state and its latest Recent History rows. Treat a change that neither explains as a change the owner made by hand. His change wins: say in one line what you found and add a Recent History row.
~~~

**Line 176 · W4**
~~~text
OLD: - New sources since last time: save and read them first (`sources.md`).
NEW: - New sources since the last session: save and read them before you say where the item stands or ask a question (`sources.md`).
~~~

**Line 183 · W4**
~~~text
OLD: - Rewrite the item's Current state in place: Where it stands says what is
  settled and anything half done; Next action names the first open Q-ID,
  for example "Waiting on Mike: Q-08."; Waiting on and Last updated match.
NEW: - Rewrite the item's Current state in place: Where it stands says what is settled and anything half done; Next action names the first open Q-ID, for example "Waiting on Mike: Q-08."; Waiting on names the same Q-ID ("Mike: Q-08."); Last updated has today's date and "the agent" ("2026-09-30, the agent.").
~~~

#### `references/sources.md`

**Line 19 · W4**
~~~text
OLD: Save each source before you use it, with the work track skill.
NEW: Save each source before you use it: with the work track skill, or, for a Salesforce client file, with the `publish-docs` skill (last row below).
~~~

**Line 28 · W4**
~~~text
OLD: - Text he pastes into the chat: save it as a file first, named
  `YYYY-MM-DD-<short-name>.md`, for example
  `2026-09-30-kickoff-transcript.md`. Keep his text exactly as pasted.
NEW: - Text he pastes into the chat: save it first, named `YYYY-MM-DD-<short-name>.md`, for example `2026-09-30-kickoff-transcript.md`: in a GitHub Issues project as a `## Source: <name>` comment on the item's issue, and in any other project as a file. Keep his text exactly as pasted.
~~~

**Line 31 · W4**
~~~text
OLD: - A file he gives you: keep its name, unless it has none that says what it
  is.
NEW: - A file he gives you: keep its name. When its name does not say what it is, rename it `YYYY-MM-DD-<short-name>` and keep its file extension.
~~~

**Line 58 · W3**
~~~text
OLD: - Read the whole source. Read a long one in parts, and keep a running list
  so nothing is dropped.
NEW: - Read the whole source. Read a source too long for one read in parts, and keep a list of what you note as you go, so nothing is missed.
~~~

**Line 73 · W4 · Mike decides (section 4)**
~~~text
OLD: - A required behavior the owner stated, or one stated clearly by someone
  else and not disputed: an `R-xx` at Status Refining, citing the source in
  its Decision record. It is a candidate until the owner approves the
  requirements.
- A decision someone other than the owner made in the meeting: a question
  row asking him to confirm it ("Dana said refunds show as negative
  amounts. Keep that?").
NEW: - A required behavior the owner stated, or one stated clearly by someone else and not disputed: an `R-xx` at Status Refining, citing the source in its Decision record. It is a candidate until the owner approves the requirements.
- Something the source says someone other than the owner decided ("we decided", "let's go with"): a question row asking him to confirm it ("Dana decided refunds show as negative amounts. Keep that?"). This bullet wins over the one above.
~~~

**Line 84 · W4**
~~~text
OLD: - Tell the owner in a few lines what you took from the source: how many
  requirements and questions it gave, and the first question.
NEW: - Tell the owner how many requirements and questions the source gave, then ask the first question.
~~~

**Line 104 · W4**
~~~text
OLD: 5. Tell the owner in a few lines what it changed, then ask the next
   question.
NEW: 5. Tell the owner, one line each, what is new, what it confirms, and what it changes (step 3), then ask the next question.
~~~

#### `references/changes.md`

**Line 24 · W3**
~~~text
OLD: 3. Update everything the old answer shaped: the goal, each `R-xx`, the
NEW: 3. Update everything the old answer affected: the goal, each `R-xx`, the
~~~

**Line 30 · W8**
~~~text
OLD: "This changes a decision saved in memory. Save the new decision and mark the old record superseded?"
NEW: "This changes a decision saved in memory. Save the new decision and mark the old one as replaced?"
~~~

**Line 34 · W3**
~~~text
OLD: 6. Tell him in one sentence what changed, then ask the next question. Do
   not replay the whole item.
NEW: 6. Tell him in one sentence what changed, then ask the next question. Do not repeat the whole item to him.
~~~

**Line 37 · W4 · Mike decides (section 4)**
~~~text
OLD: A small correction to something not yet approved needs no second
confirmation: apply it as above.
NEW: A correction to something not yet approved needs no second confirmation: apply it as above.
~~~

**Line 44 · W4**
~~~text
OLD: 1. Save it as a changed answer (section 1, including its memory step,
   step 4). The `R-xx` goes back to Refining, with the old wording kept in
   its Decision record ("Was: ...; changed by Q-12").
NEW: 1. Save it as a changed answer (section 1, including its memory step, step 4). When no earlier row set the requirement (for example, it came from a source), add a row for the question the change settles, filled in as answered, and mark no row superseded. The `R-xx` goes back to Refining, with the old wording kept in its Decision record ("Was: ...; changed by Q-12").
~~~

**Line 51 · W4**
~~~text
OLD: 4. Run the readiness check on the changed requirement (`readiness-check.md`).
NEW: 4. Run the readiness check (`readiness-check.md`). It reads every requirement, including the changed one.
~~~

**Line 57 · W4**
~~~text
OLD: status back to Finalized, and `requirements_approved` set to the new
   date.
NEW: status back to Finalized, and `requirements_approved` set to `YYYY-MM-DD by <name>` with the date of this approval.
~~~

**Line 60 · W3**
~~~text
OLD: When the item has an approved design that the change touches, tell him the
NEW: When the item has an approved design that the change affects, tell him the
~~~

**Line 73 · W3**
~~~text
OLD: - Notes, "Solution options and considerations": an idea that no longer
  fits gets a line saying so, so an old idea does not steer the design.
NEW: - Notes, "Solution options and considerations": an idea that no longer fits gets a line saying so, so the design does not follow an old idea.
~~~

**Line 96 · W4**
~~~text
OLD: - A hand change that skips an approval (a `build` item moved past stage 03
  with no requirements approval): keep it, and ask about it as a question.
NEW: - A hand change that skips an approval (a `build` item moved to stage 03 or later with no requirements approval): keep it, and ask about it as a question.
~~~
Note: the shared sources (`work-item-format.md` line 288, `approvals.md` section 4) get the same fix in 3.1.

#### `references/readiness-check.md`

**Line 51 · W4**
~~~text
OLD: - Clean report: say so in one line, and go on to the approval question.
NEW: - The report says ready and no finding needs his answer: say so in one line, and go on to the approval question.
~~~

**Line 57 · W4**
~~~text
OLD: Three findings or fewer: one per message, in order, each as a question in
the usual format. More than three: one numbered list he can answer in one
message. That list is the only exception to one question per message; each
item in it is still its own row.
NEW: Three findings or fewer that need his answer: one per message, in the report's order, each as a question in the question format (`SKILL.md`, "The question format"). More than three: one numbered list he can answer in one message. That list is the only exception to one question per message; each item in it is still its own row.
~~~

#### `references/roadmap-and-breakdown.md`

**Line 20 · W4**
~~~text
OLD: - Write the phases in the Roadmap: `P1 — <name>`, its Outcome, Status Not
  Started, its Exit result (what shows the phase is complete), and its
  Sub-items ("None." until there are some).
...
- Ask about the phases like any other question: propose them with a
  one-line reason each, then save his answer as a row.
NEW: First bullet: "- Propose the phases as a question, each with a one-line reason. After his answer, save it in the question's row and write the phases in the Roadmap: `P1 — <name>`, its Outcome, Status Not Started, its Exit result (what shows the phase is complete), and its Sub-items ("None." until there are some)." Delete the last bullet of section 1 (lines 31-32).
~~~
Note: `SKILL.md` step 8 still begins "Write the phases."; the writer may change it to "Propose and write the phases."

**Line 41 · W5**
~~~text
OLD: - is large enough that the owner will want to see it tracked by itself.
NEW: - is, in your judgment, large enough that the owner will want to see it tracked by itself: weigh how many tasks and sessions it needs against the work of keeping one more item current.
~~~

**Line 83 · W4 · Mike decides (section 4)**
~~~text
OLD: - The parent's requirements describe the whole outcome; sub-items hold the
  detail. Approve the parent's requirements first when you can, so each
  sub-item can say what it covers. When the split came first, then after
  the parent's approval, update each sub-item that covers some of the
NEW: - The parent's requirements describe the whole outcome; sub-items hold the detail. In `work-refine` the split is settled before the parent's approval (`interview.md`, section 7). After the parent's approval, update each sub-item that covers some of the approved `R-xx`, with the work track skill: write "Covers <parent ID> R-xx, approved there." in its Active requirements. When it has no `R-xx` of its own waiting for approval, also set its `requirements_approved` to that approval with `(from <parent ID>)` and move it to `03-requirements-approved`, status Ready (`approvals.md`, section 4).
~~~

**Line 92 · W4**
~~~text
OLD: - A sub-item that covers approved parent requirements says so in its
  Active requirements ("Covers WI-012 R-02 and R-03, approved there.") and
  copies the approval into `requirements_approved` with the parent's ID,
  for example `2026-09-30 by Mike Rihm (from WI-012)`. Never ask him to
  approve the same requirement twice.
NEW: Delete this bullet (lines 92-96). In the bullet above it, after "with `(from <parent ID>)`", add ", for example `2026-09-30 by Mike Rihm (from WI-012)`,". At the end of that bullet, add: "Never ask him to approve the same requirement twice."
~~~
Note: the shared `approvals.md` gets the same condition in 3.1 (line 251).

#### `examples/ios-transactions-walkthrough.md`

**Line 30 · W4**
~~~text
OLD: 3. The memory find skill finds nothing about transactions. The agent reads
   the transcript and drafts three candidate requirements and four
   questions.
NEW: 3. The memory find skill finds nothing about transactions. The agent reads the transcript, writes three candidate requirements (R-01 to R-03, Status Refining) and four question rows (Q-01 to Q-04), and moves the item to `02-refinement`. (Also remove "the item moved to `02-refinement`;" from line 67. The replacement for lines 64-69 already leaves it out.)
~~~

**Line 41 · W4**
~~~text
OLD: > Q-01: So the goal is: a person can record a purchase or a payment on
> their phone in a few seconds, and see it in their list right away?
NEW: Lines 41-42: "> Q-01: So the goal is: a person can record a purchase or a payment on
> their phone in under ten seconds, and see it in their list right away?"
Line 45: "> Watch out: "under ten seconds" rules out a long form; required fields must be"
Line 56: in the Q-01 row, replace "in a few seconds" with "in under ten seconds".
~~~

**Line 64 · W4**
~~~text
OLD: One save, before the next question: Q-01 filled with his words, the date,
Decision? `yes`, Status Answered; the Agreed goal written; a new `R-04 —
Split a transaction across categories` at Status Refining, naming Q-01 in
its Decision record; the item moved to `02-refinement`; ... (and section 3, lines 105-118)
NEW: Lines 64-69: "One save, before the next question: Q-01 filled with "Yes.", the date, Decision? `yes`, Status Answered; the Agreed goal written; the split, a decision nobody asked about, saved as its own answered row, Q-05 ("Can one transaction be split across categories?", Answer "And people should be able to split one transaction across categories."); a new `R-04 — Split a transaction across categories` at Status Refining, naming Q-05 in its Decision record; the sitting's Recent History row started ("Interview: Q-01 and Q-05 answered"); the Current state rewritten, with Next action "Waiting on Mike: Q-02." Then:"
Line 105: "In his answer to Q-04, he adds:"
Lines 112-113: "| Q-06 | Change to Q-05: is splitting a transaction part of the first release? | "Actually, drop splitting for now. That's phase 2." | 2026-09-30 | yes | R-04, P1, P2 | Answered | owner |" and "| Q-05 | Can one transaction be split across categories? | "And people should be able to split one transaction across categories." | 2026-09-30 | yes | R-04 | Superseded by Q-06 | owner |"
Lines 116-118: "In the same save: the Roadmap gets `P2 — Split transactions` with R-04 in its Outcome; R-04 stays Refining and names Q-06. The reply says so in one sentence and asks the next question."
~~~
Note: goes with lines 30 and 124.

**Line 124 · W4**
~~~text
OLD: P2 (Q-06). Q-03 (offline) is tentative; Q-07 not asked yet.", Next action
NEW: P2 (Q-06). Q-03 (offline) is tentative; Q-07 is asked and not answered.", Next action
~~~

#### `examples/salesforce-personas-breakdown.md`

**Line 83 · W7**
~~~text
OLD: documentation. The agent does not answer from memory. The answer is saved
NEW: documentation. The agent does not answer from its own knowledge. The answer is saved
~~~

### 3.18 work-status (`<shared>work-status/`)

#### `SKILL.md`

**Line 3 · W3** (description)
~~~text
OLD: so waiting work moves again.
NEW: so waiting work can continue. (Make the same change in dev/SKILL-INDEX.md line 53, then run the routing test again in both hosts.)
~~~
Note: included in the 2.20 text; apply 2.20.

**Line 22 · W4**
~~~text
OLD: read an item's full Current state only when the owner named that item
NEW: read an item's full Current state only when the owner named that item, or when the item waits on the owner with no open row (`references/taking-decisions.md`, section 1)
~~~

**Line 27 · W7**
~~~text
OLD: unanswered save question there is only a Current State line.
NEW: unanswered memory save question there is only a Current State line.
~~~

**Line 28 · W4**
~~~text
OLD:    - Nothing In Progress or Ready: the next unit in `PROJECT-ROADMAP.md`.
NEW:    - Nothing In Progress or Ready: follow `references/taking-decisions.md`, section 7.
~~~

**Line 30 · W4**
~~~text
OLD: each with the item ID and Q-ID, what is decided, and what it blocks,
NEW: each with the item ID and Q-ID when there are any, what he must decide, and what it blocks when it blocks something,
~~~

**Line 33 · W4**
~~~text
OLD:    me", give the list in short and go straight to the first decision.
NEW:    me", give only the waiting list, one line each, then ask the first decision in the same reply.
~~~

**Line 34 · W4**
~~~text
OLD: 4. Ask one decision per message, in the reply text: what is decided, the
NEW: 4. Ask one decision per message, in the reply text: what he must decide, the
~~~

**Line 40 · W4**
~~~text
OLD: Read it back; a failed write starts
   the reply with "Not saved" (`references/taking-decisions.md`, section 5).
NEW: Read it back. A failed write: start the reply with "Not saved". A read-back that differs: start it with "Saved but not verified" (`references/work-item-format.md`, section 11; `references/taking-decisions.md`, section 5).
~~~

**Line 55 · W4**
~~~text
OLD: - In progress: one line per item: ID, title, stage name and number, its
  next action (from its Current state), and who it waits on. Sub-items indented under their parent.
NEW: - In progress: one line per item with status In Progress or In Review: ID, title, stage name and number, its next action (from its Current state), and who it waits on. Under each, its sub-items that are not Done or Cancelled, indented.
~~~

**Line 59 · W4**
~~~text
OLD: - Done since the last session, when the records show it.
NEW: - Done since the last session: items whose records show them marked Done on or after the "Last updated" date of Current State, or a date the owner names.
~~~

**Line 60 · W4**
~~~text
OLD: - Anything changed by hand or broken, one line each, with what you did
NEW: - Anything changed by hand, and any record problem (such as two items with one ID, an item that cannot be found, or an item waiting on the owner with no open row), one line each, with what you did
~~~

**Line 62 · W4 · Mike decides (section 4)**
~~~text
OLD: - A short Sources list of what you read, just above the last line.
NEW: Recommended (a model change, which needs Mike's yes): in the model's `.claude/rules/cite-recalled-knowledge.md`, after "End the reply with a short Sources list: one line per source, naming the file, record, or work item and what you took from it.", add "When the reply ends with a question for the owner, put the list just above that question." Add the same sentence to the model AGENTS.md "How to write replies" line, to the Plain English output style, and to dev/build-shared/decisions-and-memory.md section 9. This SKILL.md line stays as it is. If Mike says no, change this line to "- A short Sources list of what you read, as the last lines of the reply, after the question." and also change the "The last line" bullet under "How to report", taking-decisions.md section 3, both examples, and every "make the last line exactly ..." rule in approvals.md sections 2, 4, and 7 and in work-delegate.
~~~
Note: same question as `approvals.md` line 61 and `decisions-and-memory.md` line 169 (3.1).

**Line 72 · W4**
~~~text
OLD: - A bare "yes", "ok", or "looks good" answers only the question just asked.
NEW: - A bare "yes", "ok", or "looks good" answers only the yes-or-no question just asked. When the last question was not a yes-or-no question, show the choice with your recommendation again and record nothing yet (`references/approvals.md`, section 1).
~~~

**Line 79 · W4**
~~~text
OLD: - A delivery offer belongs to `work-delegate`: open it after his other
  decisions.
NEW: - Only `work-delegate` makes a delivery offer: open `work-delegate` after every other decision on the waiting list has been asked.
~~~

**Line 97 · W4**
~~~text
OLD: What counts as approval; recording any answer (section 3); each gate's "Before asking" and "After his yes" lists; what waits on the owner (section 13)
NEW: What counts as approval; recording an approval (section 3); each gate's "Before asking" and "After his yes" lists
(Also fix the source: dev/build-shared/approvals.md section 13 should say that `work-status` builds the list of what waits on the owner, instead of keeping a shorter list of its own.)
~~~

#### `references/taking-decisions.md`

**Line 35 · W7**
~~~text
OLD: - Memory records still marked proposed or `needs-review` (local and Notion
  memory).
NEW: - Memory records still marked proposed (Notion memory) or `needs-review` (local memory). In this skill, a "memory proposal" is one of these records or an unanswered memory save question from the Current State bullet above.
~~~

**Line 37 · W3**
~~~text
OLD: - Delivery offers, last: they belong to `work-delegate`.
NEW: - Delivery offers (open Questions and Answers rows whose Affects column says `delivery`), last: only `work-delegate` asks them.
~~~

**Line 39 · W4**
~~~text
OLD: Each entry on the list is one line: the item ID and Q-ID, what is being
decided, and what it blocks.
NEW: Each entry on the list is one line: the item ID and Q-ID, what he must decide, and what it blocks. For example: "WI-012 Q-07: keep Sales Manager as its own persona? It blocks the permission design (P2)." Leave out the IDs when there are none, such as a Current State line with no work item, and leave out what it blocks when it blocks nothing.
~~~
Note: replaces lines 39 to 41.

**Line 49 · W4**
~~~text
OLD: 1. The decision that blocks the most work: a parent before its sub-items,
   an item others list as "Blocked by", an approval before the next stage.
NEW: 1. The decision that blocks the most work: a parent's decision before its sub-items' decisions; a decision on an item that other items wait for (named in their "Blocked by" relation in Notion, or in their Current state "Blockers" line); an approval, because the item cannot move to its next stage without it.
~~~

**Line 51 · W4**
~~~text
OLD: 2. Then the oldest.
NEW: 2. Then the oldest: within one item, the open row nearest the top of its table; across items, the lower item ID first.
~~~

**Line 54 · W4**
~~~text
OLD: 4. A decision an earlier reply said you would take next is taken next.
NEW: 4. Exception to rules 1 to 3: a decision that an earlier reply in this conversation said you would ask next is asked next.
~~~

**Line 60 · W4**
~~~text
OLD: - Say what is decided, the choices, your recommendation and its main
NEW: - Say what he must decide, the choices, your recommendation and its main
~~~

**Line 80 · W3**
~~~text
OLD: If not, or a commit landed after it, open `work-check` instead.
NEW: If not, or a commit was made after it, open `work-check` instead.
~~~

**Line 82 · W4**
~~~text
OLD: | Memory proposal | Read the record or the Current State line. | Its one line, and the concept it would join. Recommend yes only with evidence from this project (what he said, what happened, and when). With none, ask without a recommendation. | Yes: the memory save skill saves it (Hindsight: `retain`). No: the memory save skill withdraws it; never propose the same fact again. Either way, remove its Current State line. |
NEW: | Memory proposal | Read the record or the Current State line. | Its one line, and the concept it would join (a project-wide decision becomes its own decision record instead). Recommend yes only with evidence from this project (what he said, what happened, and when). With none, ask without a recommendation. | Yes: the memory save skill saves it (Hindsight: `retain`). No: the memory save skill withdraws it (Hindsight: nothing was retained, so there is nothing to withdraw); never propose the same fact again. Either way, remove its Current State line when it has one. |
~~~

**Line 84 · W4**
~~~text
OLD: | Delivery offer | His other decisions are done. | Open `work-delegate`; it asks. | `work-delegate` records it. |
NEW: | Delivery offer | Every other decision on the waiting list has been asked. | Open `work-delegate`; it asks. | `work-delegate` records it. |
~~~

**Line 99 · W4**
~~~text
OLD: 4. `waiting_on`: `agent` when you continue, `none` when nothing waits, or
   `owner` while another of his questions on the item is still open.
NEW: 4. `waiting_on`: `owner` while another of his questions on the item is still open; otherwise `agent` when you continue, or `none` when nothing waits.
~~~

**Line 105 · W3**
~~~text
OLD: 6. Read the item back and check each change landed.
NEW: 6. Read the item back and check that each change was saved.
~~~

**Line 120 · W4**
~~~text
OLD: | "Later", "skip", "not now" | Leave the row open, record nothing, and ask the next one. |
NEW: | "Later", "skip", "not now" | Leave the row open, record no answer, and ask the next one. A "Save it to memory too?" question with no Current State line yet: add one under "Waiting on the owner" with the memory save skill (Hindsight: edit `memory/CURRENT_STATE.md` directly), as `references/decisions-and-memory.md`, section 3, says. |
~~~

**Line 122 · W4**
~~~text
OLD: | A question back, or "I don't know" | Answer it, citing your sources, then ask the decision again. |
NEW: | A question back | Answer it, citing your sources, then ask the decision again. |
| "I don't know" | Not an answer; the row stays open. Give what the records say about it, citing your sources, then ask the decision again. |
~~~

**Line 123 · W4**
~~~text
OLD: | "Go with your recommendations on all of them" | One row per thing it covered, in the item it concerns,
NEW: | "Go with your recommendations on all of them" | Fill the open row of each thing it covered, in the item it concerns (add the row first where there is none),
~~~

**Line 131 · W4**
~~~text
OLD: - For the agent: the first item In Progress or Ready, by priority (urgent,
  high, medium, low), and its Next action. An item waiting on the owner is
  not next for you; its question is next for him.
- Nothing In Progress or Ready: the next unit in `PROJECT-ROADMAP.md`, or
  the Backlog item with the highest priority.
- Two items equally urgent: ask him which, with your recommendation.
NEW: - For the agent: the item the work find skill's "What is next" lookup gives, and its Next action. An item whose `waiting_on` is `owner` or `external: <who>` is not next for you. For an item that waits on the owner, its first open question is next for him.
- The lookup finds nothing In Progress or Ready: the next work unit in `PROJECT-ROADMAP.md`; when the roadmap has none, the Backlog item with the highest priority.
- The lookup says to ask the owner which of two items comes first: ask him, with your recommendation.
~~~

#### `examples/decision-walkthrough.md`

**Line 20 · W4**
~~~text
OLD: - IML-6: choose how amounts are stored. It blocks the build.
NEW: - IML-6 Q-03: choose how amounts are stored. It blocks the build.
~~~

**Line 62 · W7**
~~~text
OLD: - Waiting on: `agent` (no other question of his is open on IML-4). Next
  action: "Ask Mike to approve the requirements."
- Read back: all four changes are on the page.
NEW: - The Waiting on property: `agent` (no other question of his is open on
  IML-4). The Current state block: Waiting on "Nothing.", Next action "Ask
  Mike to approve the requirements." (copied to the Next action property),
  and Last updated "2026-10-02, the agent."
- Read back: every change above is on the page.
~~~

**Line 72 · W4**
~~~text
OLD: Saved in IML-4 (Q-05); R-03 is updated. 2 still wait on you: the IML-6
NEW: Saved in IML-4 (Q-05); R-03 is updated, so IML-4's requirements can now go
to you for approval. 2 still wait on you: the IML-6
~~~
Note: line 96 has the same gap; for example "Saved in IML-6 (Q-03): amounts are stored as whole cents, so IML-6's build can start."

**Line 75 · W4**
~~~text
OLD: IML-6 needs your choice of how amounts are stored.
- Option A: whole cents (1250 for $12.50). Totals are always exact.
- Option B: decimal numbers. Simpler to read in the database; totals can
  be off by a cent.

I recommend A, because totals must match your bank to the cent.
After A: I plan the build in 3 phases. After B: I add a rounding check.

Do you choose Option A?
NEW: IML-6 needs your choice of how amounts are stored.
- Option A: whole cents (1250 for $12.50). Totals are always exact.
- Option B: decimal numbers. Simpler to read in the database; totals can
  be off by a cent.

I recommend A, because totals must match your bank to the cent.
What you will see: every total in the app matches your bank statement.
Main risk with A: each screen must show 1250 as $12.50; a missed screen
shows the wrong amount.
Build order: storage, then the transaction list, then the monthly totals.
After A: I plan the build in 3 phases. After B: I add a rounding check.

Do you choose Option A?
~~~

**Line 111 · W4**
~~~text
OLD: Save to memory: "Your bank exports dates as DD/MM/YYYY"? I recommend yes:
NEW: Save to memory, under Bank import: "Your bank exports dates as DD/MM/YYYY"? I recommend yes:
~~~

#### `examples/status-report.md`

**Line 13 · W4**
~~~text
OLD: WI-012  In Progress  04-solution-design  owner  Security and permissions for the new org
  WI-013  Done         06-implementation-plan  none   Persona inventory from the old org
  WI-015  In Progress  08-build            agent  Map old profiles to permission sets
  WI-016  Backlog      01-discovery        none   Guest user access
WI-014  In Progress  11-user-approval    owner  Login and single sign-on setup
NEW: WI-012  In Progress  04-solution-design      owner  Security and permissions for the new org  Next action: Waiting on Mike: Q-07.
  WI-013  Done         06-implementation-plan  none   Persona inventory from the old org        Next action: None. Finished.
  WI-015  In Progress  08-build                agent  Map old profiles to permission sets       Next action: Agent: P1-T03, map the last 4 profiles.
  WI-016  Backlog      01-discovery            none   Guest user access                         Next action: Not started.
WI-014  In Progress  11-user-approval        owner  Login and single sign-on setup            Next action: Waiting on Mike: Q-04.
~~~

**Line 33 · W4**
~~~text
OLD: - WI-014: approve the login and single sign-on result. The independent check passed; one gap.
NEW: Line 23: "- WI-014 has an open row, Q-04, "Do you approve this result?". Its Recent History"
Line 33: "- WI-014 Q-04: approve the login and single sign-on result? The independent check passed; one gap. It blocks shipping WI-014."
Line 40: "- WI-014 "Login and single sign-on setup", user approval (stage 11): waiting on you (Q-04)."
~~~

**Line 48 · W4**
~~~text
OLD: Sources: WI-012 to WI-016, read just now; memory/CURRENT_STATE.md.
NEW: status-report.md line 48:
"Sources:
- WI-012 to WI-016, read just now: stages, statuses, and open questions.
- memory/CURRENT_STATE.md: the unanswered memory question.
- WI-012's 2026-09-30 workshop transcript: Sales Manager is the only persona that approves discounts."
status-report.md line 50: replace "(WI-012, Sources: the 2026-09-30 workshop transcript)" with "(WI-012, from the 2026-09-30 workshop transcript)".
decision-walkthrough.md line 32:
"Sources:
- IML-4, Q-02: you check the list against your bank statement each month.
- IML-4, Q-05: the question and its recommendation."
decision-walkthrough.md line 114:
"Sources:
- IML-7, Q-02: you said your bank exports dates as DD/MM/YYYY, on 2026-09-30."
~~~
Note: this changes only the list's format; where the list goes is the question for `SKILL.md` line 62.

**Line 58 · W3**
~~~text
OLD: - The reply ends with one question and a recommendation, so a one-word
  answer moves the work.
NEW: - The reply ends with one question and a recommendation, so a one-word
  answer lets the work continue.
~~~

### 3.19 GitHub work skills (`<sets>github-work/`)

#### `github-work-find/SKILL.md`

**Line 3 · W3** (description)
~~~text
OLD: description: '... so answers rest on the tracker. ...'
NEW: description: 'Looks up work items kept as GitHub issues with gh: one issue, the board, what waits on the owner, the next item, and a parent''s tree of sub-issues, so answers come from the issues. Use whenever a work skill or the owner needs work looked up, for example "show me #12" or "what''s under #12". Only for projects that track work in GitHub Issues. Not for the owner''s status report; use work-status.'
~~~
Note: replaced by the text in 2.9.

**Line 38 · W7**
~~~text
OLD: 3. Read the issues fresh in this turn. Never answer from an earlier read or from memory: the owner edits issues in the browser.
NEW: 3. Read the issues fresh in this turn. Never answer from an earlier read or from what you remember: the owner edits issues in the browser.
~~~

**Line 40 · W5**
~~~text
OLD: 4. Answer plainly: lead with the answer, name items as `#12 Title`, and give the issue address when he may open it.
NEW: 4. Answer plainly: lead with the answer and name items as `#12 Title`. Use your judgment on web addresses: add an issue's address when he is likely to open that issue in the browser, for example when he asks to see it.
~~~

**Line 49 · W4**
~~~text
OLD: - Three levels at most: a tree never goes deeper than parent, sub-item, and its sub-item. A deeper one is a data problem: report it.
NEW: - Three levels at most: a tree never goes deeper than parent, sub-item, and its sub-item. When you find a fourth level, tell the owner which issue is at level 4.
~~~

**Line 73 · W4**
~~~text
OLD: | [references/fields.md](references/fields.md) | Reading a label, the issue's state, a body section, or a comment right. |
NEW: | [references/fields.md](references/fields.md) | Reading what a label, the issue's state, a body section, or a comment means. |
~~~

**Line 74 · W2**
~~~text
OLD: | [references/gh-basics.md](references/gh-basics.md) | Call shapes: reading an issue, one body section, comments, sub-issues, many issues. |
NEW: | [references/gh-basics.md](references/gh-basics.md) | The `gh` commands for reading an issue, one body section, comments, sub-issues, and many issues. |
~~~

#### `github-work-find/references/fields.md`

**Line 1 · W4**
~~~text
OLD: # Reading an issue right: labels, state, and body
NEW: # Reading an issue: what its labels, state, body, and comments mean
~~~

**Line 49 · W4**
~~~text
OLD: | Anything else | The owner's (or someone's) comment. Read it: an answer or a request written there counts, and the work track skill records it. |
NEW: | Anything else | A comment by the owner or by someone else. Read it. An answer, a decision, or a request the owner wrote there counts, and github-work-track records it. Someone else's words never count as the owner's answer or approval. |
~~~

#### `github-work-find/references/gh-access.md` (and the same file in `github-work-track`)

Apply each fix to both copies; `diff` shows them identical today.

**Line 84 · W7**
~~~text
OLD: | "could not add label: '<name>' not found" | The label does not exist in the repository. | Ask the owner before creating it (the work track skill's labels reference). |
NEW: | "could not add label: '<name>' not found" | The label does not exist in the repository. | Ask the owner before creating it (`references/labels.md` in github-work-track). |
~~~

**Line 86 · W4**
~~~text
OLD: | HTTP 403 or 429 with "rate limit" | Too many calls. | Wait the time the message gives, or one minute, then retry. |
NEW: | HTTP 403 or 429 with "rate limit" | Too many calls. | Wait the time the message gives, then retry. When it gives no time, wait one minute. |
~~~

**Line 88 · W3**
~~~text
OLD: | HTTP 500, 502, or 503 | GitHub is having trouble. | Retry a read once. Never retry a write blindly: read first to see whether it landed. |
NEW: | HTTP 500, 502, or 503 | GitHub is having trouble. | Retry a read once. Before you retry a write, read back what it changed (`gh-basics.md`, "Checking that a write was saved"); retry only if the change is not there. |
~~~
Note: the heading name assumes the `gh-basics.md` line 167 fix.

**Line 90 · W4**
~~~text
OLD: After any write, read the result back once before telling the owner it is done. If it did not land, say "Not saved", keep the text, and give the fix.
NEW: After any write, read the result back once before telling the owner it is done. If the write failed, lead with "Not saved", keep the text, and give the fix. If the write worked but the read-back differs, lead with "Saved but not verified" and say what differs.
~~~

**Line 96 · W4**
~~~text
OLD: - `gh issue list` returns 30 issues unless `--limit` is given. The steps here use `--limit 200`. When a list returns exactly the limit, raise it.
NEW: - `gh issue list` returns 30 issues unless `--limit` is given. The steps here use `--limit 200`. When a list returns exactly the limit, double the limit and run it again, until the list returns fewer issues than the limit.
~~~

**Line 102 · W3**
~~~text
OLD: - Many writes in a row can hit GitHub's secondary rate limit. Space bulk work out.
NEW: - Many writes in a row, such as creating every label at setup, can hit GitHub's secondary rate limit. Wait at least one second between those writes.
~~~

#### `github-work-find/references/gh-basics.md` (and the same file in `github-work-track`)

Apply each fix to both copies.

**Line 1 · W2**
~~~text
OLD: # gh basics: the call shapes every step uses
NEW: # gh basics: the commands every step uses
~~~

**Line 42 · W6**
~~~text
OLD: - The parent, if any: `gh api repos/<repo>/issues/<number> --jq '.parent_issue_url // "none"'`. The number is the last part of the address.
NEW: - The parent, if any: `gh api repos/<repo>/issues/<number>/parent --jq .number` ("Sub-issues" below). "No parent issue found" means it is top level.
~~~

**Line 57 · W4**
~~~text
OLD: Long text (a body, a comment) goes to GitHub from a file, never inline in the command. (and line 117: "A short note may use `--body 'Agent: ...'` instead of a file.")
NEW: Line 57: "Send a body, and any comment longer than one line, to GitHub from a file, never inline in the command." Line 117: "A one-line note with no single quote in it may use `--body 'Agent: ...'` instead of a file."
~~~

**Line 167 · W3**
~~~text
OLD: ## Checking that a write landed (and the contents entry on line 17)
NEW: Line 167: "## Checking that a write was saved". Line 17: "- Checking that a write was saved".
~~~

#### `github-work-find/references/queries.md`

**Line 33 · W4**
~~~text
OLD: Then, as needed:
NEW: Then read each of these that the question asks about:
~~~

**Line 99 · W7**
~~~text
OLD: them; the work track skill fixes them. (also line 172: "Name it; the work track skill records it." and line 191: "the work track skill does it.")
NEW: Line 99: "Name them; github-work-track fixes them." Line 172: "Name it; github-work-track records it." Line 191: see the finding on line 184 ("github-work-track makes either change.").
~~~

**Line 106 · W4**
~~~text
OLD: When two items are equally urgent and several chats run, ask the owner which one this chat takes; never pick his item for him.
NEW: When the first two such rows have the same priority, ask the owner which one this chat takes, with your recommendation; never pick for him.
~~~

**Line 137 · W4**
~~~text
OLD: A sub-issue no Roadmap row names goes last, under "No phase", and is a gap to report. A fourth level is a data problem: report it.
NEW: A sub-issue no Roadmap row names goes last, under "No phase", and is a gap to report. A fourth level breaks the three-level limit: tell the owner which issue is at level 4.
~~~

**Line 147 · W4**
~~~text
OLD: GitHub's search matches words in titles, bodies, and comments. Quote a phrase: `--search '"bank file" in:body'`.
NEW: Without `in:`, GitHub's search matches words in titles, bodies, and comments; `in:title,body` leaves comments out. Quote a phrase: `--search '"bank file" in:body'`.
~~~

**Line 158 · W4**
~~~text
OLD: An item it waits for (`#14`): read that item's state and stage.
NEW: When a Blockers line names another item (`#14`), read that item's state and stage.
~~~

**Line 162 · W4**
~~~text
OLD: `<date>` is the "Last updated" date of Current State, or the date the owner names.
NEW: `<date>` is the date the owner names. When he names none, it is the "Last updated" date of the project's Current State (`memory/CURRENT_STATE.md`, or the "Current state" page in a Notion memory project), not an item's `### Current state` block.
~~~

**Line 184 · W4**
~~~text
OLD: An issue the owner opened in the browser has no `## Overview`, or no stage label: [...] Report it and offer to add the layout; the work track skill does it.
NEW: Line 184: "An issue with no `## Overview`, or without exactly one stage label (most often one the owner opened in the browser):" Line 191: "Tell the owner. For no `## Overview` or no stage label, offer to add the layout; for two or more stage labels, ask him which one is right. github-work-track makes either change."
~~~

**Line 197 · W5**
~~~text
OLD: - Name items as `#12 Title`, with the issue address when he may open it.
NEW: - Name items as `#12 Title`. Use your judgment on web addresses: add an issue's address when he is likely to open that issue in the browser, for example when he asks to see it.
~~~

#### `github-work-find/examples/status-report.md`

**Line 38 · W4**
~~~text
OLD: Next: #14, the save form, because it is the highest priority and waits on nobody.
NEW: Next: #14, the save form, because it is the highest priority and I can work on it now without waiting on you or anyone else.
~~~

**Line 41 · W8**
~~~text
OLD: Also: #17 "dark mode please" was opened by hand in GitHub and has no work item layout yet. Want me to add it?
NEW: Also: #17 "dark mode please" was opened by hand in GitHub, so it does not have the usual work item sections and labels yet. Want me to add them?
~~~

#### `github-work-track/SKILL.md`

**Line 3 · W3** (description)
~~~text
OLD: description: '... so every change lands the same way. ...'
NEW: description: 'Creates and changes work items in GitHub Issues: new issues, labels, phases, tasks, sub-issues, questions and answers, and the design comment, so each change is made the same way. Use when a work skill or the owner changes an item, for example "make it a sub-issue of #12" or "add a task to phase 2". Only for projects that track work in GitHub Issues. Not for marking an item Done; use work-finish.'
~~~
Note: replaced by the text in 2.10.

**Line 17 · W7**
~~~text
OLD: ## The model in one screen
NEW: ## How a work item is stored on GitHub
~~~

**Line 47 · W3**
~~~text
OLD: 3. Make the change with the matching recipe:
NEW: 3. Make the change with the steps in the matching reference:
~~~

**Line 57 · W4**
~~~text
OLD: 4. Read it back and check it landed. If not, say "Not saved" and give the fix.
NEW: 4. Read the change back. If the write failed, lead with "Not saved", name what was not saved, keep the text, and give the fix. If the write worked but the read-back differs, lead with "Saved but not verified" and say what differs.
~~~

**Line 61 · W4**
~~~text
OLD: Add a Recent History row for a material change.
NEW: Add a Recent History row when the change is on the list in `references/items.md`, "Recent History rows".
~~~

**Line 69 · W4**
~~~text
OLD: - A decision made while working an item is saved at once as a Questions and Answers row (his words, the date, Decision? `yes`). A project-wide one is also offered to memory.
NEW: - A decision made while working an item is saved at once as a Questions and Answers row (his words, the date, Decision? `yes`). When one looks project-wide, ask the owner "This looks project-wide. Save it to memory too?" (`references/items.md`, "Questions and Answers").
~~~

**Line 77 · W4**
~~~text
OLD: - Never delete an issue, a comment, a label, or a sub-issue link. Cancel, close, or ask the owner.
NEW: - Never delete an issue, a comment, or a label: cancel, close, or ask the owner instead. Remove a sub-issue link only to move an item when the owner asks (`references/items.md`, "Moving an item under another parent").
~~~

**Line 111 · W4**
~~~text
OLD: | [references/approvals.md](references/approvals.md) | What counts as the owner's approval, and the order to record it, Done, and cancel. |
NEW: | [references/approvals.md](references/approvals.md) | What counts as the owner's approval, and the order of steps to record an approval, mark an item Done, or cancel one. |
~~~

#### `github-work-track/references/items.md`

**Line 4 · W2**
~~~text
OLD: each change keeps. Call shapes: `gh-basics.md`. Labels: `labels.md`.
NEW: each change keeps. Commands: `gh-basics.md`. Labels: `labels.md`.
~~~

**Line 33 · W3**
~~~text
OLD: 3. After the change, read it back and check that it landed.
NEW: 3. After the change, read it back and check that it was saved.
~~~

**Line 37 · W4**
~~~text
OLD: 1. **Level check** (a sub-item only). An item has at most three levels. Read the parent's parent, and that one's parent (`gh api repos/<repo>/issues/<number>/parent --jq .number`). When the parent already has a parent and a grandparent, it is level 3: refuse, and offer a task on that item instead.
NEW: 1. **Level check** (a sub-item only). An item has at most three levels. Read the parent's parent, and that one's parent (`gh api repos/<repo>/issues/<number>/parent --jq .number`). When the parent has a parent and a grandparent, the parent is at level 3 and the new item would be at level 4: do not create it. Tell the owner, and offer to add a task to the parent instead.
~~~

**Line 98 · W5**
~~~text
OLD: - Stages may be skipped or revisited. When a move is not obvious, add a Recent History row that says why.
NEW: - Stages may be skipped or revisited. Use your judgment: when a later reader could not tell from the stage names alone why the item moved, for example a skipped stage or a move back, add a Recent History row that says why.
~~~
Note: the source `work-item-format.md` line 60 is fixed differently in 3.1 (it points to section 5); make the two match when applying.

**Line 131 · W4**
~~~text
OLD: | The owner | `waiting-on:owner` | Waiting on "Mike: Q-07."; Next action names the first open Q-ID; Blockers "None.", or what only he can give |
NEW: | The owner | `waiting-on:owner` | Waiting on "Mike: Q-07."; Next action names the first open Q-ID; Blockers "None." when he only has to answer, or the thing only he can give, for example test keys |
~~~

**Line 135 · W4 · Mike decides (section 4)**
~~~text
OLD: | Another item | `waiting-on:agent`, or none | Blockers "Waits for #14: <what it needs from it>."; Related items names #14 |
NEW: | Another item | `waiting-on:agent` when the agent is working on #14; no waiting-on label when nobody is | Blockers "Waits for #14: <what it needs from it>."; Related items names #14 |
~~~

**Line 140 · W4**
~~~text
OLD: - After the owner answers his last open question on the item, swap `waiting-on:owner` for `waiting-on:agent` when you continue, or remove it. Keep it while another of his questions is open.
NEW: - After the owner answers his last open question on the item, swap `waiting-on:owner` for `waiting-on:agent` when you continue the work; otherwise remove it. Keep it while another of his questions is open.
~~~

**Line 189 · W4**
~~~text
OLD: Status "Open", "Decision needed from" `owner` (or who). Add `waiting-on:owner`, and in the Current state set Next action to "Waiting on Mike: Q-07." and Waiting on to "Mike: Q-07."
NEW: Status "Open", "Decision needed from" `owner`, or another person or role. When the row needs the owner, add `waiting-on:owner`, and in the Current state set Next action to "Waiting on Mike: Q-07." and Waiting on to "Mike: Q-07." When it needs someone else, use `waiting-on:external` ("Waiting on and blockers" above).
~~~

**Line 197 · W2**
~~~text
OLD: (during a work-refine interview, add it to that sitting's row; otherwise add a row)
NEW: (during a work-refine interview, add the Q-ID to the one Recent History row that work-refine keeps for that interview; otherwise add a row)
~~~
Note: the source `work-item-format.md` section 6 and `work-refine` `interview.md` and `changes.md` also say "sitting"; the writer should reword those together (a related finding in `local-work-track` was dropped for giving one row two names; see section 5).

**Line 227 · W4**
~~~text
OLD: Only the owner's own words count (`approvals.md`, section 1). Record in this order, so a later failure never loses his answer: 1. The Questions and Answers row: his words, the date, Decision? `yes`, Status Answered. 2. The label and the body changes below. 3. A Recent History row naming the Q-ID. 4. `waiting-on:owner` swapped for `waiting-on:agent`, or removed, unless another question of his is open. 5. Read back the labels and the body.
NEW: Only the owner's own words count (`approvals.md`, section 1). Record in this order, so a later failure never loses his answer:

1. The Questions and Answers row: his words, the date, Decision? `yes`, Status Answered.
2. The label and the body changes below.
3. A Recent History row naming the Q-ID.
4. `waiting-on:owner` kept while another question of his is open; otherwise swapped for `waiting-on:agent` when you continue the work, or removed when you do not.
5. The Current state rewritten in place: Where it stands, Next action (the next open Q-ID, if any), Waiting on, and Last updated.
6. Read back the labels and the body.
~~~

**Line 343 · W8**
~~~text
OLD: 1. Ask him in one line: "#15 was made by hand in GitHub. Add the work item layout to it?"
NEW: 1. Ask him in one line: "#15 was made by hand in GitHub, so it does not have the usual work item sections and labels. Should I add them?"
~~~

**Line 374 · W4**
~~~text
OLD: - at most three levels above and below it.
NEW: - its tree, counting its parents and its sub-items, is at most three levels deep.
~~~

**Line 381 · W4 · Mike decides (section 4)**
~~~text
OLD: After a large write, read its length:
NEW: After each body write, read its length:
~~~

#### `github-work-track/references/planning.md`

**Line 31 · W4**
~~~text
OLD: - Tasks sit mostly on the lowest-level items. A parent's tasks are the work that is not a sub-item of its own.
NEW: - Put a task on the lowest-level item that does the work. A parent holds only tasks for work that none of its sub-items covers.
~~~

**Line 55 · W7**
~~~text
OLD: "Phase 2" means phase P2 of the work item open in this chat. When no item is open, or the owner may mean project phase P02 in `PROJECT-ROADMAP.md`, ask which one before changing anything.
NEW: "Phase 2" means phase P2 of the work item this chat is working on. When this chat is working on no item, or the owner may mean project phase P02 in `PROJECT-ROADMAP.md`, ask which one before changing anything. (Line 100: "(no phase named, or this chat is working on more than one item)".)
~~~

**Line 116 · W4**
~~~text
OLD: - Rewrite the item's Current state in place when the change moves it: Where it stands, Next action, and Last updated.
NEW: - Rewrite the item's Current state in place, so all five lines are true and "Last updated" has today's date (`items.md`, "Current state").
~~~

#### `github-work-track/references/notes-files-links.md`

**Line 16 · W4**
~~~text
OLD: Use them for running notes that are not a decision or a material change, for example "Agent: helper finished P1-T02; 12 tests pass." A decision goes in Questions and Answers; a material change goes in Recent History.
NEW: Use them for running notes that are neither a decision nor a change on the Recent History list (`items.md`, "Recent History rows"), for example "Agent: helper finished P1-T02; 12 tests pass." A decision goes in Questions and Answers; a change on that list goes in Recent History.
~~~

**Line 118 · W3**
~~~text
OLD: The project's memory skills write that side; nothing is added to the issue.
NEW: The project's memory save skill (a Hindsight project: Hindsight's `retain` tool, as the memory rule says) stores the ID and address in the memory; nothing is added to the issue.
~~~

#### `github-work-track/references/labels.md`

**Line 63 · W3**
~~~text
OLD: | `stage:13-deployment` | `C5DEF5` | Stage 13: being put where it belongs |
NEW: | `stage:13-deployment` | `C5DEF5` | Stage 13: being deployed |
~~~
Note: existing projects keep their label description; the source `work-item-format.md` line 57 is fixed in 3.1.

**Line 64 · W4**
~~~text
OLD: | `stage:14-spec-update` | `C5DEF5` | Stage 14: specifications updated to match |
NEW: | `stage:14-spec-update` | `C5DEF5` | Stage 14: requirements and system guide updated to match the result |
~~~

**Line 101 · W8**
~~~text
OLD: "Create these 36 labels in <repo>? They hold each work item's stage, type, priority, waiting on, delivery, and approvals."
NEW: "Create these 36 labels in <repo>? Each work item uses them to show its stage, type, priority, who it waits on, who builds it, and your approvals."
~~~

#### `github-work-track/references/setup.md`

**Line 18 · W4**
~~~text
OLD: 1. **Sign-in.** Run `gh auth status`. No one signed in, or no `repo` scope: ask the owner to run `gh auth login` in his own terminal, and wait (`gh-access.md`).
NEW: 1. **Sign-in.** Run `gh auth status`. No one signed in: ask the owner to run `gh auth login` in his own terminal. No `repo` scope: ask him to run `gh auth refresh -s repo`. Then wait (`gh-access.md`).
~~~

**Line 35 · W4**
~~~text
OLD: Never push here; the push waits for the question after the setup commit.
NEW: Do not push in this step: the project-setup skill asks the owner "Push main to <owner>/<repo>?" after the setup commit.
~~~
Note: if the `finishing.md` line 154 fix (3.3) is applied, quote "Push <default> to <owner>/<repo>?" here.

**Line 67 · W4**
~~~text
OLD: 3. Check a few open issues ("Checking an issue" in `items.md`).
NEW: 3. Check the five most recently updated open issues ("Checking an issue" in `items.md`).
~~~

#### `github-work-track/examples/new-item-walkthrough.md`

**Line 38 · W4**
~~~text
OLD: **Where it stands:** Created from the owner's request; requirements not started.
NEW: **Where it stands:** Created on 2026-09-30; not started.
~~~

#### `github-work-track/assets/WORK-ITEM.md` (Mike's model template)

**Line 41 · W7 · Mike decides (section 4)**
~~~text
OLD: **Related items:** <Roadmap unit, parent and related work item IDs (never folder paths), design, or external links. ...>
NEW: **Related items:** <The `PROJECT-ROADMAP.md` work unit (for example P01-U01), parent and related work item IDs (never folder paths), design, or external links. Memories that name this item: Obsidian's Backlinks panel for a local item; an agent finds them with the memory find skill by this ID.>
~~~

**Line 81 · W4 · Mike decides (section 4)**
~~~text
OLD: Add one row for each material decision or progress change, newest first.
NEW: Add one row, newest first, for each change the work item format lists: a stage, `waiting_on`, blocker, or next action change for a reason a later reader could not see; an answer, approval, rejection, or decision; the independent checker's report; a plan change; a change the owner made by hand; a finished result.
~~~
Note: `local-work-track` `assets/WORK-ITEM.md` line 81 has a different proposed text (3.21); Mike's answer picks one text for both.

**Line 89 · W7 · Mike decides (section 4)**
~~~text
OLD: Keep an item Refining until its required behavior and acceptance check are clear and owner approval is recorded;
NEW: Keep a requirement Refining until its required behavior and acceptance check are clear and owner approval is recorded;
~~~

**Line 134 · W7 · Mike decides (section 4)**
~~~text
OLD: A bulk “yes to all” is saved as one row per item it covered,
NEW: A bulk “yes to all” is saved as one row per thing it covered,
~~~

#### `github-work-track/assets/DESIGN.md` (Mike's model template)

**Line 17 · W3 · Mike decides (section 4)**
~~~text
OLD: The work item's main file owns the agreed goal, its Current state (where work stands and the exact next action), active requirements, ...
NEW: The work item's main file holds the agreed goal, its Current state (where work stands and the exact next action), active requirements, ...
~~~
Note: `solution-design` `assets/DESIGN.md` line 17 (3.12) and `local-work-track` `assets/DESIGN.md` line 17 (3.21) have fuller proposals for the same sentence; Mike's answer picks one text for all copies.

### 3.20 Local memory skills (`<sets>local-memory/`)

#### `local-memory-find/SKILL.md`

**Line 28 · W4**
~~~text
OLD:    | "What did I say about ..." | The owner's rules |
NEW:    | "What did I say about ..." | The owner's rules, then memory by words |
~~~

**Line 39 · W5**
~~~text
OLD: 7. **Nothing found:** say "I don't know; nothing recorded covers that." Then ask once, or give your recommendation as your own.
NEW: SKILL.md lines 39-40: "7. **Nothing found:** say "I don't know; nothing recorded covers that." Then use your judgment: ask the owner once when only he can know the answer (a fact, a past choice); give your recommendation, marked as your own, when you can work one out."
search.md lines 182-183: "- Say so: "I don't know; nothing recorded covers the refund window." Then use your judgment: ask the owner once when only he can know the answer; give your recommendation, clearly marked as your own, when you can work one out."
~~~

#### `local-memory-find/references/search.md`

**Line 70 · W4**
~~~text
OLD: the work item ID), then synonyms and the glossary's aliases. Try two or three before saying nothing is recorded.
NEW: the work item ID), then synonyms and the glossary's aliases. Run two or three searches with different words before saying nothing is recorded.
~~~
Note: `SKILL.md` step 3 ("two or three, with synonyms") could say "two or three words per search" so the two lines mean different things clearly.

**Line 111 · W4**
~~~text
OLD: - A section whose first line is "**Proposal, not approved yet:**" is not a fact. Say it is unapproved, or leave it out.
NEW: - A section whose first line is "**Proposal, not approved yet:**" is not a fact. Leave it out unless the owner asks for history; when you mention it, say it is unapproved.
~~~

**Line 115 · W4**
~~~text
OLD: - Check `updated`, `last_verified`, and the section's **Evidence and limits**. When `last_verified` is old or `unknown` and the subject changes over time (a vendor, a process, a person's role), say so, and check the source when the answer matters.
NEW: - Check `updated`, `last_verified`, and the section's **Evidence and limits**. When `last_verified` is `unknown` or older than about six months, and the subject changes over time (a vendor, a process, a person's role), say so. Check the source before a decision or a change relies on the answer.
~~~

**Line 160 · W4**
~~~text
OLD: - Say how sure the answer is when the source is old or indirect.
NEW: - Say how sure the answer is when the source's `last_verified` is `unknown` or older than about six months, or when the source does not state the answer directly.
~~~

**Line 172 · W4**
~~~text
OLD: Show both, say which is newer, and leave both as they are. Ask the owner which is right, and offer to correct the older one with `local-memory-save`. Never settle it by date alone.
NEW: Show both, say which is newer, and leave both as they are. Ask the owner which is right, then offer to correct the one he says is wrong: memory with `local-memory-save`, a work item with the work track skill. Never settle it by date alone.
~~~

#### `local-memory-find/examples/find-walkthrough.md`

**Line 60 · W4**
~~~text
OLD: Every persona gets its own permission set group, and no user gets access
NEW: Every persona gets a permission set group, and no user gets access through a profile (memory: `decision_persona_access_through_groups.md`).
~~~

#### `local-memory-save/SKILL.md`

**Line 42 · W4**
~~~text
OLD: file whole. The same fact is already there: stop. A section says
NEW: file whole. The same fact is already there: save nothing, and tell the owner where it is. A section says
~~~

**Line 45 · W4**
~~~text
OLD: form and wait. Unanswered: keep it as a proposal (`references/saving.md`, "Proposals").
NEW: Lines 44-46: "4. **Check approval** ("Approval" below). When it says ask, ask in the exact form and wait for his answer. His next message does not answer it: keep it as a proposal (`references/saving.md`, "Proposals")."
Lines 83-84: "- His next message does not answer a "Save to memory: <one line>?" question: a proposal plus one line under "Waiting on the owner" in Current State. Never rely on it."
~~~
Note: step 4 still says "keep it as a proposal" for every question, but `saving.md` gives an unanswered decision or rule question only a Current State line; that gap is for the writer.

**Line 53 · W3**
~~~text
OLD: "Checklist before a save". It did not land: say "Not saved", keep the
NEW: "Checklist before a save". The change is not in the file: say "Not saved", keep the
~~~

**Line 68 · W4**
~~~text
OLD: - `onboarding`: anything you inferred gets one question first, in exactly this form: "Save to memory: <one-line summary>?". An inferred instruction: "Add to the project rules: <one line>?". Save after his yes.
NEW: Lines 68-70: "- `onboarding`: anything you inferred gets one question first, in exactly this form: "Save to memory: <one-line summary>?". Save after his yes."
Lines 71-72 (the `trusted` line) stay as they are.
Lines 73-76: "- In both modes, always ask first for: an instruction you inferred, in exactly this form: "Add to the project rules: <one line>?"; a glossary term you inferred; a project-wide decision ("This looks project-wide. Save it to memory too?"); anything about a named person or personal details he did not ask you to remember; more than five files at once; a delete, except one his own words asked for ("delete it", "remove it for good", or "forget that" right after the save) or a proposal file he said no to; a change to this policy."
~~~
Note: the lines 73-76 text also settles the line 76 finding; apply it once.

**Line 71 · W4 · Mike decides (section 4)**
~~~text
OLD: - `trusted`: a routine fact you are sure of is saved without asking, with `authorization: Trusted grant, <date>`, and reported in one line.
NEW: - `trusted`: a fact you inferred and are sure of is saved without asking, unless it is on the "In both modes" list below, with `authorization: Trusted grant, <date>`, and reported in one line. A fact you are not sure of gets the `onboarding` question first.
~~~
Note: `notion-memory-save` `SKILL.md` line 65 asks the same question (3.22); one answer covers both.

**Line 76 · W4**
~~~text
OLD: once; a delete; a change to this policy.
NEW: - In both modes, always ask first for: an instruction you inferred, in exactly this form: "Add to the project rules: <one line>?"; a glossary term you inferred; a project-wide decision ("This looks project-wide. Save it to memory too?"); anything about a named person or personal details he did not ask you to remember; more than five files at once; a delete, except one his own words asked for ("delete it", "remove it for good", or "forget that" right after the save) or a proposal file he said no to; a change to this policy.
~~~
Note: the same text as the line 68 finding's lines 73-76; apply once.

**Line 99 · W4**
~~~text
OLD: - Never delete a memory file, except a rejected proposal file or on the owner's own delete words. Retire or supersede instead.
NEW: - Never delete a memory file; retire or supersede it instead. The exceptions: a proposal file he said no to; the file you just made, when he says "forget that" right after the save; a file his own words say to delete ("delete it", "remove it for good"); and, after his yes, a file that holds a secret or an email address.
~~~

#### `local-memory-save/references/saving.md`

**Line 35 · W4**
~~~text
OLD: `<main checkout path>/memory/`. In Codex, a write outside the worktree may be blocked by the sandbox: ask to run that edit outside the sandbox.
NEW: `<main checkout path>/memory/`. In Codex, when you work in a worktree, the sandbox can block a write to the main checkout's `memory/`: ask to run each such edit outside the sandbox before you make it.
~~~

**Line 174 · W4**
~~~text
OLD: - About a whole concept: retire it (`record-format.md`): status `retired`, the description and first body line marked, his words as the reason.
NEW: - About a whole concept: retire it (`record-format.md`, "Proposals, superseded, and retired text"): status `retired`, the description marked, and a `**Retired:**` line added as the first line under the title, with his words as the reason.
~~~

**Line 179 · W4**
~~~text
OLD: - Delete a file only when his own words say so ("delete it", "remove it for good"), or when it holds a secret or an email address.
NEW: - Delete a file only in these cases: the file you just made, when he says "forget that" right after the save; a proposal file he said no to ("Proposals", step 4); a file his own words say to delete ("delete it", "remove it for good"); and a file that holds a secret or an email address, after he says yes to deleting it. For the last two, say in the reply that it cannot be undone: `memory/` is not in Git and there is no backup.
~~~

**Line 187 · W4**
~~~text
OLD: A question you asked ("Save to memory: <one line>?") that he has not answered yet is kept as a proposal, so it is not lost. Never rely on it.
NEW: When his next message does not answer a question you asked ("Save to memory: <one line>?"), keep the save as a proposal, so it is not lost. Never rely on it.
~~~

**Line 200 · W4**
~~~text
OLD: `work-status` shows these lines. With more than one open proposal, group them in one line that names each file.
NEW: Step 2 ends: "`work-status` shows these lines. With more than one open proposal, group them in one line that names each file. When he answers one, remove its file from that line, and remove the line when no proposal is left in it."
In steps 3 and 4, replace "remove the Current State line" with "remove the proposal from its Current State line".
~~~

**Line 268 · W4**
~~~text
OLD: `decisions-and-memory.md`, section 10. Missing file: copy `assets/CURRENT_STATE.md`.
NEW: `decisions-and-memory.md`, section 10. Missing file: copy `assets/CURRENT_STATE.md`, replace each sample bullet with a real line or "None.", and remove the fill-in guide comment.
~~~

**Line 271 · W4**
~~~text
OLD: - Read it fresh, then replace or remove lines. Never only add.
NEW: - Read it fresh. When a line changes, replace that line; never add a new line beside the old one.
~~~

**Line 278 · W4 · Mike decides (section 4)**
~~~text
OLD: a work item for it. A to-do with a time ("at 9 tomorrow") is a scheduled reminder in the host, not Current State.
NEW: a work item for it. A to-do with a set time ("at 9 tomorrow") does not go in Current State. Tell the owner it needs a reminder at that time, and offer to set one with the host's scheduled task tool when Claude Code or Codex has one; otherwise he sets it himself.
~~~

**Line 287 · W4**
~~~text
OLD: One line per save, with the file's title, then the next step (the question still waiting for the owner, or the words that continue).
NEW: One line per save, with the file's title, then the next step: the question still waiting for the owner or, when none is waiting, the exact words that continue ("Say 'keep going' and I'll <next action>.").
~~~

**Line 290 · W4**
~~~text
OLD: - A new file or section: "Saved to memory: <title> (`memory/<file>`). Say 'forget that' to undo."
NEW: - A new file: "Saved to memory: <title> (`memory/<file>`). Say 'forget that' to undo."
- A new section: "Saved to memory: <section heading> (in <title>, `memory/<file>`). Say 'forget that' to undo."
~~~

**Line 294 · W4**
~~~text
OLD: - A decision: "Saved to memory: <title> (decision), linked to WI-031."
- A lesson: "Noted a lesson in memory: <heading> (in <title>)."
- A rule: "Added to the project rules (<area>): <instruction>."
NEW: - A decision: "Saved to memory: <title> (decision), linked to WI-031. Say 'forget that' to undo."
- A lesson: "Noted a lesson in memory: <heading> (in <title>). Say 'forget that' to undo."
- A rule: "Added to the project rules (<area>): <instruction>. Say 'forget that' to undo."
Add the same sentence to the example replies in examples/save-walkthrough.md, lines 82-83 and 104-105.
~~~

**Line 302 · W4**
~~~text
OLD: - A failed save: "Not saved: <reason>." Keep the text, give the fix, and try again later in the session.
NEW: - A failed save: "Not saved: <reason>." Keep the text, give the fix, and try the save again as soon as the fix is made, in this session.
~~~

#### `local-memory-save/references/record-format.md` (the same file is in `local-memory-find` and `local-memory-refine`; change all three)

**Line 29 · W4**
~~~text
OLD: | `event_<name>.md` | One significant episode | `local-memory-save` |
| `decision_<short-name>.md` | One project-wide decision | `local-memory-save` |
| `terminology-glossary.md` | Project terms | `local-memory-save` |
NEW: | `event_<name>.md` | One significant episode | `local-memory-save`, `local-memory-refine` |
| `decision_<short-name>.md` | One project-wide decision | `local-memory-save`, `local-memory-refine` |
| `terminology-glossary.md` | Project terms | `local-memory-save`, `local-memory-refine` |
~~~

**Line 66 · W3 · Mike decides (section 4)**
~~~text
OLD: | `project_` | Lasting project constraints, reasons (why a part exists, how it is used), technical landmarks, proven costly fixes. |
NEW: | `project_` | Lasting project constraints, reasons (why a part exists, how it is used), the main parts of the system and where they are, proven costly fixes. |
(and the same words in the model's memory/memory-criteria.md, `project_<topic>.md` row, on the model branch; change all three record-format.md copies)
~~~

**Line 112 · W4**
~~~text
OLD: | `supersedes` | The file this one replaced (or a list), or `none`. |
NEW: | `supersedes` | The `name` of the file this one replaced (or a list of names), or `none`. |
~~~

#### `local-memory-save/assets/project_topic_template.md` (a copy of Mike's model file)

**Line 10 · W2 · Mike decides (section 4)**
~~~text
OLD: authorization: <Approved card or explicit request, or trusted grant>
NEW: authorization: <"Approved by <owner> on YYYY-MM-DD", "Trusted grant, YYYY-MM-DD", or "Proposed by the agent on YYYY-MM-DD; not approved">
~~~

#### `local-memory-save/assets/owner-preferences.md` (the same file is in `local-memory-refine` and `notion-memory-save`)

**Line 5 · W4**
~~~text
OLD: When it is missing, the memory save skill creates it on the owner's first instruction, with the title, the lead paragraph, and only the area that instruction needs, and adds its line to the rules list in AGENTS.md so Codex reads it too.
NEW: When the file is missing, whichever memory skill adds the first instruction (the memory save skill or the memory refine skill) creates it, with the title, the lead paragraph, and only the area that instruction needs, and adds its line to the rules list in AGENTS.md so Codex reads it too.
~~~
Note: change all copies so they stay the same.

#### `local-memory-save/examples/save-walkthrough.md`

**Line 100 · W4**
~~~text
OLD: - Show permission changes as a table before any deploy. (2026-09-30, Mike, in chat)
NEW: Line 100: - Show me the permission changes as a table before you deploy. (2026-09-30, Mike, in chat)
Lines 104-105: Reply: "Added to the project rules (Replies): show me the permission changes as a table before you deploy. Say 'forget that' to undo."
~~~

**Line 134 · W4**
~~~text
OLD: replies "Saved to memory: Sandbox refresh and test users (in Environments)."
NEW: replies "Saved to memory: Sandbox refresh and test users (in Environments, `memory/project_environments.md`). Say 'forget that' to undo."
~~~

#### `local-memory-refine/SKILL.md`

**Line 39 · W4**
~~~text
OLD: - Nothing changes without the owner's yes on the plan, except removing Current State lines that are no longer true.
NEW: - Nothing changes without the owner's yes on the plan, except two things: removing Current State lines that are no longer true, and removing a secret or an email address from a file at once.
~~~

**Line 41 · W4**
~~~text
OLD: - Never delete a memory file: supersede it, retire it, or leave it for the owner. The only exception is a file holding a secret or an email address, with his yes.
NEW: - Never delete a memory file: supersede it, retire it, or leave it for the owner. Two exceptions: a proposal file he said no to, and, with his yes on the plan, a file holding a secret or an email address.
~~~

**Line 55 · W4**
~~~text
OLD: - A superseded or retired file keeps its body; only its status, its description, and its first body line change.
NEW: - A superseded or retired file keeps its whole body. Only its status and description change, and a marked line (`**Superseded by:**` or `**Retired:**`) is added as the first line under its title.
~~~

#### `local-memory-refine/references/refine.md`

**Line 36 · W4**
~~~text
OLD: `<main checkout path>/memory/`. In Codex, a write outside the worktree may be blocked by the sandbox: ask to run that edit outside the sandbox.
NEW: `<main checkout path>/memory/`. In Codex, when you work in a worktree, the sandbox can block a write to the main checkout's `memory/`: ask to run each such edit outside the sandbox before you make it.
~~~

**Line 47 · W4**
~~~text
OLD: - Never delete a file. Supersede it, retire it, or leave it for the owner. The one exception: a file holding a secret or an email address, with his yes on the list; say it cannot be undone (`memory/` is not in Git and there is no backup).
NEW: - Never delete a file. Supersede it, retire it, or leave it for the owner. Two exceptions: a proposal file he said no to; and a file holding a secret or an email address, with his yes on the list and a warning that the delete cannot be undone (`memory/` is not in Git and there is no backup).
~~~

**Line 64 · W4**
~~~text
OLD: that now has a work item (put the ID under Now, or remove the line); a
NEW: that now has a work item (replace the line with the item's ID under Now; when the ID is already there, or the item is Done or Cancelled, remove the line); a
~~~

**Line 90 · W4**
~~~text
OLD: (`status: template`). Read each file you judge whole.
NEW: Line 90 only: "(`status: template`). Read each of these files whole before you write the plan." Line 41 ("Read everything first.") stays as it is.
~~~

**Line 95 · W4**
~~~text
OLD: sections) are merged into the older or broader one:
NEW: sections) are merged into the broader one, or into the older one when neither is broader:
~~~
Note: `notion-memory-refine` `refine.md` line 46 gets the same kind of fix (3.22).

**Line 122 · W4**
~~~text
OLD: - Replaced by a newer file: status `superseded`, marked in the description and the first body line, and the newer file's `supersedes:` names it.
NEW: - Replaced by a newer file: status `superseded`, the description marked, a `**Superseded by:**` line added as the first line under the title, and the newer file's `supersedes:` names it.
- No longer true and nothing replaces it: status `retired`, the description marked, and a `**Retired:**` line with the reason added as the first line under the title.
~~~

**Line 140 · W4**
~~~text
OLD: steps). His no: remove the section or the proposal file. Either way, remove its Current State line.
NEW: steps). His no: remove the section or the proposal file. Either way, remove the proposal from its Current State line, and remove the line when no other proposal is left in it.
~~~

**Line 198 · W4**
~~~text
OLD: `feedback_` is retired. For each section of such a file: an instruction goes to `.claude/rules/owner-preferences.md` (source: "memory file `feedback_<name>.md`, saved <date>"), and a fact goes to a `user_` or `project_` concept. Then mark the file superseded with "Moved to the rules and concepts on <date>".
NEW: `feedback_` is retired. For each section of such a file: an instruction goes to `.claude/rules/owner-preferences.md`, ending with `(<date the feedback file was saved>, <owner name>, from memory file feedback_<name>.md)`, and a fact goes to a `user_` or `project_` concept. Then set the file's `status: superseded`, start its description with "Moved to the rules and concepts on <date>:", and add the first line under its title: `**Superseded by:** the rules and concepts, on <date>.`
~~~

**Line 219 · W4**
~~~text
OLD: 3. After his yes: a rule is one bullet in `.claude/rules/owner-preferences.md` (layout: `assets/owner-preferences.md`; a new file also gets its line in the `AGENTS.md` rules list). A skill is written as `writing-a-project-skill.md` says.
NEW: 3. After his yes: a rule is one bullet in `.claude/rules/owner-preferences.md` (layout: `assets/owner-preferences.md`), in the words he approved, ending with `(<YYYY-MM-DD of his yes>, <owner name>, from the lesson in memory/<file>)`; a new file also gets its line in the `AGENTS.md` rules list. Commit it: a bullet alone is one file, committed in place and staged by name; a new file and its `AGENTS.md` line are two files, committed in your own worktree and branch (`.claude/rules/shared-repository-work.md`). A skill is written as `writing-a-project-skill.md` says.
~~~

**Line 234 · W4**
~~~text
OLD: - Current State: removed "WI-002 export fields" (Done) and "Q-03 login methods" (answered).
NEW: - Current State: removed "WI-002 export fields" (Done) and "Save to memory? Decision WI-004 Q-03" (answered).
~~~

**Line 242 · W4**
~~~text
OLD: Say how to undo each change when he asks ("bring back `reference_old_dashboard.md`" sets it current again). End with the one question still open, or the words that continue.
NEW: When he asks how to undo a change, give him the words (for example, "bring back `reference_old_dashboard.md`" sets it current again). End with the questions still open or, when none is open, the exact words that continue ("Say 'keep going' and I'll <next action>.").
~~~

#### `local-memory-refine/examples/refine-walkthrough.md`

**Line 9 · W4**
~~~text
OLD: "Now" named WI-002, which is Done, and "Waiting on the owner" held Q-03 of WI-004, which he answered yesterday.
NEW: Lines 9-11: "Now" named WI-002, which is Done, and "Waiting on the owner" held the save question for a decision in WI-006, Q-02 ("Save to memory? Decision WI-006 Q-02: ..."), which he answered yesterday. Both lines were removed at once, and the file is now 38 lines:
Lines 13-14: > Current State: removed "WI-002 Profile inventory" (Done) and "Save to memory? Decision WI-006 Q-02" (answered).
Line 66: - Current State: removed WI-002 (Done) and the WI-006 Q-02 save question (answered); 38 lines.
~~~

### 3.21 Local work skills (`<sets>local-work/`)

#### `local-work-find/SKILL.md`

**Line 3 · W3** (description)
~~~text
OLD: so answers rest on the files as they are
NEW: so answers match the files as they are
~~~
Note: replaced by the text in 2.9.

**Line 34 · W4**
~~~text
OLD: 3. Read the files fresh in this turn. Never answer from an earlier read or from memory: the owner edits and moves items by hand.
NEW: 3. Read the files fresh in this turn. Never answer from an earlier read or from earlier in this chat: the owner edits and moves items by hand.
~~~

**Line 36 · W4**
~~~text
OLD: 4. Run the hand-change check (`references/hand-changes.md`) at the first lookup of a session, and whenever an item is not where you read it before, an ID has two files, or `parent:` does not match the folders. Tell the owner each finding in one line, have local-work-track record it, and carry on.
NEW: 4. Run the hand-change check (`references/hand-changes.md`) at the first lookup of a session, before a move or a new sub-item, and whenever an item is not where you read it before, an ID has two files or none, or an item's folder, `parent:`, and its parent's Sub-items cell disagree. Tell the owner each finding in one line, have local-work-track record it, and carry on. For a finding listed in "Findings that need the owner", ask him instead of carrying on: one question at a time, with your recommendation.
~~~
Note: `local-work-track` has no step that runs this check before a move or a new sub-item; consider adding one.

**Line 50 · W4**
~~~text
OLD: - Three levels at most. A deeper item is a data problem: report it.
NEW: - Three levels at most. An item deeper than level 3 is a hand-change finding: ask the owner what to do (`references/hand-changes.md`, "Findings that need the owner").
~~~

**Line 57 · W4**
~~~text
OLD: - Every command skips `references/` folders (source files may hold their own `id:` lines), `DESIGN.md` files (their `status:` is the design's), and `work-item-template/`. Never drop those flags.
NEW: - Every command except the word search skips `references/` folders (source files may hold their own `id:` lines), `DESIGN.md` files (their `status:` is the design's), and `work-item-template/`. Never drop those flags. The word search reads designs and source files on purpose (`references/queries.md`, "Search by words or type").
~~~

#### `local-work-find/references/queries.md`

**Line 35 · W4**
~~~text
OLD: Keep the flags as written: they skip the template, `references/` folders, and `DESIGN.md` files.
NEW: Keep the flags as written: they skip the template, `references/` folders, and `DESIGN.md` files, except in the word search, which reads designs and source files on purpose.
~~~

**Line 65 · W4**
~~~text
OLD: - Show the status groups in this order: In Progress, In Review, Ready, Backlog. Put sub-items under their parent, indented; the path shows the nesting.
NEW: - Show the status groups in this order: In Progress, In Review, Ready, Backlog, and place each top-level item by its own status. Put each sub-item under its parent, indented, whatever its own status, and show its status on its line; the path shows the nesting.
~~~

**Line 90 · W4**
~~~text
OLD: 3. Approvals he has not given. Read these fields with the board command: items at stage `11-user-approval` with `result_approved: no`; items with `design: proposed`; `build` or `data-load` items past stage `02` with `requirements_approved: no` (a gap to ask about).
NEW: 3. Approvals he has not given. Read these fields:

   ```bash
   grep -rHE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude-dir=archive --exclude=DESIGN.md '^(id|type|stage|status|requirements_approved|design|result_approved):' "$MAIN/work-items"
   ```

   List items at stage `11-user-approval` with `result_approved: no`; items with `design: proposed`; and `build` or `data-load` items past stage `02` with `requirements_approved: no` (a gap to ask about).
~~~

**Line 102 · W4**
~~~text
OLD: whose "Depends on" units are done
NEW: whose "Depends on" units each have a linked item with status Done
~~~
Note: `work-on` `starting-and-resuming.md` section 2 has the same words (3.16); change both.

**Line 114 · W4**
~~~text
OLD: - Nothing is Ready: say so, and name the item closest to ready and what it needs.
NEW: - Nothing is Ready: say so. Then name the Backlog item at the highest stage (`02` before `01`; the lower ID when two tie) and what it still needs to reach Ready.
~~~
Note: `work-on` `starting-and-resuming.md` line 54 (3.16) uses a judgment rule instead; make the two match when applying.

**Line 118 · W4**
~~~text
OLD: - Two items are equally urgent: never pick for the owner; ask.
NEW: Remove the line. Line 110 ("the lower ID first when two tie") stays.
~~~

**Line 173 · W4**
~~~text
OLD: A Current state "Waiting on" line other than "Nothing." or a "Blockers" line other than "None." (or the template prompt) names what the item waits for.
NEW: A Current state "Waiting on" line that is not "Nothing.", or a "Blockers" line that is not "None.", names what the item waits for. A line that still holds the template prompt names no wait: the item is not filled in yet.
~~~

**Line 179 · W4**
~~~text
OLD: Use the memory find skill `AGENTS.md` names, with the item's ID.
NEW: Use the memory find skill `AGENTS.md` names, with the item's ID (a Hindsight project: Hindsight's `recall` tool with the tag `wi:WI-031`, as the memory rule says).
~~~

#### `local-work-find/references/hand-changes.md`

**Line 24 · W4**
~~~text
OLD: - Before a move or a new sub-item (local-work-track asks for it).
NEW: - Before a move or a new sub-item.
~~~

**Line 43 · W4**
~~~text
OLD: - the Sub-items cells of that parent's Roadmap (`grep -nE '^\| *P[0-9]+ —' "<parent file>"`);
NEW: - the Sub-items cells in the Roadmap of its parent by folders, and of the item its `parent:` line names, when each is an item (`grep -nE '^\| *P[0-9]+ —' "<parent file>"`, once for each);
~~~

**Line 59 · W5**
~~~text
OLD: Folders win: `parent: X`, the item removed from Y's Sub-items cell and added to X's, and "Moved by hand" rows on the item, X, and Y
NEW: Folders win: `parent: X`, the item removed from Y's Sub-items cell and added to the Sub-items cell of one of X's phases (use your judgment: pick the phase whose outcome it serves, and name the phase and the reason in the one-line report), and "Moved by hand" rows on the item, X, and Y
~~~

**Line 83 · W4**
~~~text
OLD: On purpose: local-work-track removes the lines that name it (the parent's Sub-items cell) and records his words on the parent; Current State lines go through the memory save skill.
NEW: On purpose: local-work-track removes the lines that name it (the parent's Sub-items cell) and records his words on the parent; lines of the project's Current State that name it go through the memory save skill `AGENTS.md` names (a Hindsight project: edit `memory/CURRENT_STATE.md` directly, as the memory rule says).
~~~

**Line 86 · W3**
~~~text
OLD: Keep the change. Ask for the approval, and build nothing it gates until he answers.
NEW: Keep the change. Ask for the approval, and build nothing that needs that approval until he answers.
~~~

#### `local-work-track/SKILL.md`

**Line 3 · W3** (description)
~~~text
OLD: so every change lands the same way
NEW: so every change is saved the same way (and 'for example "put WI-007' becomes 'such as "put WI-007', 398 characters)
~~~
Note: replaced by the text in 2.10.

**Line 18 · W7**
~~~text
OLD: ## The model in one screen
NEW: ## How a local item is stored
~~~
Note: `github-work-track` and `notion-work-track` `SKILL.md` line 17 have the same heading (3.19, 3.23).

**Line 37 · W4**
~~~text
OLD: - A local item has no comments. Running notes go in Notes; material changes go in Recent History.
NEW: - A local item has no comments. Running notes go in Notes; changes on the list in `references/work-item-format.md`, section 5 ("Recent History gets a row when"), go in Recent History.
~~~

**Line 60 · W4**
~~~text
OLD: 5. Read the file back and check the change landed. If not, start the reply with "Not saved" and say what was not saved. 6. Rewrite the item's Current state (the five lines at the top, under the Overview) in place, so every line is true and "Last updated" has today's date; never add to it. Add a Recent History row for a material change.
NEW: 5. Rewrite the item's Current state (the five lines under `### Current state` in the Overview) in place, so every line is true and "Last updated" has today's date; never add to it. Add a Recent History row when the change is on the list in `references/work-item-format.md`, section 5 ("Recent History gets a row when").
6. Read the file back and check every change was saved. An edit failed: start the reply with "Not saved" and say what was not saved and where it belongs. The edits worked but the read-back differs: start the reply with "Saved but not verified" and say what differs.
~~~
Note: replaces lines 60-64; step 7 keeps its number.

**Line 65 · W7**
~~~text
OLD: 7. When the change makes a Current State line untrue (an item Done, a question answered), fix that line with the memory save skill `AGENTS.md` names.
NEW: 7. When the change makes a line of the project's Current State untrue (an item Done, a question answered), fix that line with the memory save skill `AGENTS.md` names. In a Hindsight project, edit `memory/CURRENT_STATE.md` directly, as the memory rule says.
~~~
Note: replaces the whole step (lines 65-68), so the Hindsight sentence is not written twice.

**Line 80 · W4**
~~~text
OLD: - Never delete an item folder, a row, a phase, or a task. Cancel it, archive it when the owner asks, or ask him to delete it himself.
NEW: - Never delete an item folder, or a real row, phase, or task. Only the template's examples (the ones holding angle-bracket prompts) are deleted, once replaced. Instead, cancel an item, phase, or task (a changed answer supersedes its row), archive an item when the owner asks, or ask him to delete it himself.
~~~

**Line 84 · W4**
~~~text
OLD: - Never add work to `work-items/work-item-template/`.
NEW: - Never make an item inside `work-items/work-item-template/`, and never write an item's text into the template's files: copy the template into the item's own folder first.
~~~

**Line 102 · W4**
~~~text
OLD: - The template's example rows (`Q-01`, `Q-02`, `P1`, `P2`, `P1-T01`) are prompts. Replace them with real rows; never count them as real.
NEW: - The template's example rows and tasks are the ones holding angle-bracket prompts (`<Specific unanswered question>`, `<Phase 1 name>`, `<Task 1 name>`). They are prompts. Replace them with real rows and tasks; never count them as real.
~~~

**Line 107 · W4**
~~~text
OLD: - In Codex, a session in a worktree may not write outside it.
NEW: - In Codex, the sandbox can block a session in a worktree from writing outside it. The write to the main checkout then asks for approval or fails with a sandbox error: ask the owner to approve it. Never write the item into the worktree instead.
~~~

#### `local-work-track/references/items.md`

**Line 44 · W3**
~~~text
OLD: 3. After the change, read it back and check the change landed.
NEW: 3. After the change, read it back and check the change was saved.
~~~

**Line 48 · W4**
~~~text
OLD: Read the parent's `parent:`, then that item's `parent:`. When the parent has a parent that itself has a parent, the parent is at level 3: make no sub-item, and offer a task on that item instead.
NEW: 1. **Level check** (a sub-item only). Read the parent's `parent:`, then the `parent:` of the item it names (the grandparent). When the grandparent has a parent, the parent is at level 3: make no sub-item, and offer a task on the parent instead.
~~~

**Line 101 · W4**
~~~text
OLD: the `type` the calling skill names,
NEW: the `type` the calling skill names (when the owner asked directly, use your judgment: the `type` in `work-item-format.md`, section 4, that fits his request),
~~~

**Line 113 · W4**
~~~text
OLD: Delete the fill-in guide comment once no angle-bracket prompt is left in the item.
NEW: Delete the comment that starts "Fill-in guide for a new work item" once no angle-bracket prompt is left in the item.
~~~

**Line 190 · W4**
~~~text
OLD: - Before a session ends on unfinished work, check that Next action names the exact next step.
NEW: - Before every reply that leaves the item unfinished, check that Next action names the exact next step.
~~~

**Line 273 · W4**
~~~text
OLD: Decision needed from `owner`.
NEW: Decision needed from `owner`, or the other person or role who can answer it.
~~~

**Line 278 · W4**
~~~text
OLD: - **An answer.** In one edit:
NEW: - **An answer.** Make all of these changes before you ask the next question or end the reply:
~~~

**Line 342 · W4**
~~~text
OLD: On his yes: the row with his words, `result_approved` when not yet set,
NEW: On his yes: the row with his words,
~~~

**Line 355 · W5**
~~~text
OLD: - **Reopen.** Set a stage again, the status that stage gives, and a Recent History row saying why.
NEW: - **Reopen.** Use your judgment: set the stage where the remaining work starts, weighing the owner's reason for reopening. Set the status that stage gives, and add a Recent History row saying why.
~~~
Note: the shared `work-item-format.md` section 3 has the same open wording; fix it at the source too.

#### `local-work-track/references/planning.md`

**Line 47 · W4**
~~~text
OLD: - Tasks sit mostly on the lowest-level items. A parent's tasks are the work that is not a sub-item of its own.
NEW: - Put most tasks on the lowest-level items. Give a parent a task only for work that none of its sub-items holds.
~~~

**Line 62 · W5**
~~~text
OLD: When no item is open, or the owner may mean project phase P02 in `PROJECT-ROADMAP.md`, ask which one before changing anything.
NEW: When no work item is open in this chat, ask which phase he means before changing anything. Use your judgment: also ask first when he may mean project phase P02 in `PROJECT-ROADMAP.md`, for example when the chat has been about the project roadmap.
~~~

**Line 94 · W4**
~~~text
OLD: - Never delete a row, a heading, or a task. Cancelled ones keep the history.
NEW: - Never delete a real row, heading, or task; only the template's examples are deleted ("Adding phases"). Cancelled ones keep the history.
~~~

**Line 125 · W4**
~~~text
OLD: - Rewrite the item's Current state in place when the change moves it: Where it stands, Next action, and Last updated.
NEW: - Rewrite the item's Current state in place, so Where it stands, Next action, and Last updated are true after the plan change.
~~~

#### `local-work-track/references/folders.md`

**Line 67 · W4**
~~~text
OLD: The deepest item must stay at level 3 or above.
NEW: The deepest item must be at level 3 at most (level 1 is the top).
~~~

**Line 84 · W4**
~~~text
OLD: Add it to the new parent's cell for the phase the owner names, or the one you recommend. Never keep a phase of the old parent.
NEW: 4. **Roadmaps.** Remove its `[[WI-007]]` from the old parent's Sub-items cell ("None." when the cell is empty). Add it to the new parent's cell for the phase the owner names. When he names none, ask which phase, with your recommendation (a Questions and Answers row), and add it after his answer.
~~~

**Line 126 · W4**
~~~text
OLD: - To bring an item back, move its folder out of `archive/` and add a Recent History row.
NEW: - To bring an item back, move its folder out of `archive/` to the place the owner names (the top of `work-items/` when he names none; under a parent, also follow "Moving an item under another parent, or to the top level"), and add a Recent History row.
~~~

**Line 133 · W4**
~~~text
OLD: - The item file keeps the name `<ID>.md`, because links such as `[[WI-031]]` find the file by its name. Never rename it yourself.
NEW: - The item file keeps the name `<ID>.md`, because links such as `[[WI-031]]` find the file by its name. Never rename an item file yourself, except to give a hand-made item or a renumbered copy the name `<ID>.md` (sections "A hand-made item" and "Two items with one ID").
~~~

**Line 148 · W3**
~~~text
OLD: - Bring the records that follow in line, and say so in the same line: `parent:` matches the folder it sits in, and each parent's Sub-items cells list exactly its sub-items.
NEW: - Update `parent:` and the Sub-items cells to match the folders, and say so in the same one-line message: `parent:` matches the folder the item sits in, and each parent's Sub-items cells list exactly its sub-items (for a sub-item new to a parent, use your judgment: put it in the phase whose outcome it serves, and name that phase).
~~~

**Line 179 · W6**
~~~text
OLD: - Never renumber an item another session is working on without the owner's answer.
NEW: Remove the bullet.
~~~

#### `local-work-track/examples/new-item-walkthrough.md`

**Line 31 · W4**
~~~text
OLD: It printed `<main>` for the main checkout (not the worktree) and `WI`.
NEW: `MAIN` held `<main>`, the main checkout (not the worktree), and `sed` printed `WI`.
~~~

**Line 81 · W4**
~~~text
OLD: In one edit: the row gets his words, the date, Decision? `yes`, and Status `Answered`; a Roadmap row `P1 — Persona review` replaces the example rows; a Recent History row goes on top;
NEW: Before the next question: the row gets his words, the date, Decision? `yes`, and Status `Answered`; a Roadmap row `P1 — Persona review` replaces the example rows, and a `### P1 — Persona review` heading replaces the example headings in Tasks; a Recent History row goes on top;
~~~

#### `local-work-track/examples/replan-and-move-walkthrough.md`

**Line 12 · W4**
~~~text
OLD: Then, in one edit of `WI-001.md`:
NEW: Then, in `WI-001.md`:
~~~

#### `local-work-track/assets/WORK-ITEM.md` (Mike's model template)

**Line 81 · W4 · Mike decides (section 4)**
~~~text
OLD: Add one row for each material decision or progress change, newest first.
NEW: Add one row, newest first, when the owner answers a question, approves, rejects, or decides; when the independent checker reports; when a discovery changes the plan or the owner changes the item by hand; when a requested result is finished; and when the stage, `waiting_on`, the blockers, or the next action changes for a reason that is not obvious.
~~~
Note: `github-work-track` `WORK-ITEM.md` line 81 (3.19) proposes different words for the same model sentence.

**Line 89 · W7 · Mike decides (section 4)**
~~~text
OLD: Keep an item Refining until its required behavior and acceptance check are clear and owner approval is recorded; mark Superseded only with a replacement link.
NEW: Keep a requirement Refining until its required behavior and acceptance check are clear and owner approval is recorded; mark Superseded only with a replacement link.
~~~

**Line 96 · W4 · Mike decides (section 4)**
~~~text
OLD: <The owner’s original request, in their words or a faithful short summary.>
NEW: <The owner’s original request, in his words.>
~~~

#### `local-work-track/assets/DESIGN.md` (Mike's model template)

**Line 9 · W4 · Mike decides (section 4)**
~~~text
OLD: Add rows or options where needed; remove unused example rows and optional sections.
NEW: Give each table one row per real entry, and give as many options as were agreed with the owner; remove unused example rows, and remove a section only where its own comment says to.
~~~
Note: `solution-design` `assets/DESIGN.md` line 9 (3.12) proposes a shorter text for the same sentence; Mike's answer picks one.

**Line 17 · W3 · Mike decides (section 4)**
~~~text
OLD: The work item's main file owns the agreed goal, its Current state (where work stands and the exact next action), active requirements, Questions and Answers (which holds the item's decisions), roadmap tasks, and execution history.
NEW: The work item's main file holds the agreed goal, its Current state (where work stands and the exact next action), active requirements, Questions and Answers (which holds the item's decisions), Roadmap and Tasks, and Recent History.
~~~

### 3.22 Notion memory skills (`<sets>notion-memory/`)

`references/notion-access.md` and `references/ntn-basics.md` exist in five
identical copies (the three Notion memory skills, `notion-work-find`, and
`notion-work-track`). Both the Notion memory review and the Notion work review
found problems in them, sometimes on the same line with different
replacements. Where that happens, the entry says which text to use. Apply the
chosen text to all five copies.

#### `notion-memory-find/SKILL.md`

**Line 3 · W3** (description)
~~~text
OLD: cites each source, so answers rest on what was agreed.
NEW: cites each source, so answers match what was agreed.
~~~
Note: replaced by the text in 2.22 ("so each answer comes from what was agreed").

**Line 19 · W4**
~~~text
OLD: Check `ntn whoami`; if it fails, the owner signs in
   (`references/notion-access.md`). In Codex, run each `ntn` command
   alone with escalated permissions (`references/notion-access.md`, "In
   Codex").
NEW: In Codex, run each `ntn` command alone with escalated permissions (`references/notion-access.md`, "In Codex"). Check `ntn whoami`; if it still fails, the owner signs in (`references/notion-access.md`).
~~~

**Line 27 · W4**
~~~text
OLD:    | Where things stand, where to resume | The Current state page |
NEW:    | Where the project stands, where the next session starts | The Current state page |
   | Where one work item stands | That item's own Current state block, with the project's work find skill |
~~~

**Line 44 · W4**
~~~text
OLD: - Leave out superseded and retired records unless the owner asks for
  history; say when a record is proposed (not yet accepted) or its Last
  verified is old.
NEW: - Leave out superseded and retired records unless the owner asks for history; say when a record is proposed (not yet accepted), or when its Last verified is "unknown" or more than six months old.
~~~

**Line 57 · W4**
~~~text
OLD: - A row with no Record Key was not made by the toolkit: mention it, do not
  rely on it silently.
NEW: - A row with no Record Key was not made by the toolkit: leave it out of the answer and tell the owner it exists.
~~~

#### `notion-memory-find/references/queries.md`

**Line 29 · W4**
~~~text
OLD: If this fails (no sign-in, no network, or the Codex sandbox), say so in one
line and carry on; ask the owner to run `ntn login` when the error says so.
NEW: If this fails (no sign-in, no network, or the Codex sandbox), say so in one line and follow `notion-access.md`, "When a call fails": in Codex, first run the call again with escalated permissions; for a sign-in error, ask the owner to run `ntn login` and wait.
~~~

**Line 55 · W7**
~~~text
OLD: The Index view in Notion lists every current record by key.
NEW: The Index view in Notion lists every accepted or proposed record by key.
~~~

**Line 92 · W4**
~~~text
OLD: Its columns: `ntn-basics.md`, "Reading a page's properties". A record
whose Last verified is old or "unknown" may be stale: say so when you use
it, and check it against its source when the answer matters.
NEW: Its columns: `ntn-basics.md`, "Reading a page's properties". A record whose Last verified is "unknown" or more than six months old may be stale: say so when you use it. Use your judgment on checking it against its source: check it when a wrong answer would change what gets designed, built, or decided.
~~~

#### `notion-memory-save/SKILL.md`

**Line 31 · W4**
~~~text
OLD: 1. Decide the home with the table above; nothing qualifies: save nothing. A
   hook reminder is only a hint.
NEW: 1. Decide the home with the table above. Never save secrets, credentials, email addresses, transcripts, raw logs, or work item status. When no row of the table fits, save nothing. A hook reminder is only a hint.
~~~

**Line 35 · W4**
~~~text
OLD: Check `ntn whoami`; if it fails,
   the owner signs in (`references/notion-access.md`). In Codex, run each
   `ntn` command alone with escalated permissions
   (`references/notion-access.md`, "In Codex").
NEW: In Codex, run each `ntn` command alone with escalated permissions (`references/notion-access.md`, "In Codex"). Check `ntn whoami`; if it still fails, the owner signs in (`references/notion-access.md`).
~~~

**Line 43 · W4**
~~~text
OLD: 4. Fill every column the record needs (`references/record-mapping.md`):
   Title, Record Key and Keywords (the same key), Synopsis, Kind (`note`,
   or `decision`), Tags (the prefix), Status, Source `manual`, Author,
   Agent, Project, Saved, Source note, Last verified, Authorization, Work
   item IDs, and the Work items relation when work items are in Notion.
NEW: 4. Fill every column the record needs (`references/record-mapping.md`): Title, Record Key and Keywords (the same key), Synopsis, Kind (`note`, or `decision`), Tags (the prefix without its underscore, for example `project`), Status, Source `manual`, Author, Agent, Project, Saved, Source note, Last verified, Authorization, Work item IDs, the Work items relation when work items are in Notion, and Decided At on a decision record.
~~~

**Line 48 · W3**
~~~text
OLD: 5. Read it back. If it did not land: say "Not saved", keep the text, give
   the fix.
NEW: 5. Read it back. If the change is not there: say "Not saved", keep the text, and give the fix.
~~~

**Line 62 · W4**
~~~text
OLD: - `onboarding`: anything you inferred gets one question first, in exactly
  this form: "Save to memory: <one-line summary>?". An inferred instruction:
  "Add to the project rules: <one line>?". Save after his yes.
NEW: - `onboarding`: anything you inferred gets one question first, in exactly this form: "Save to memory: <one-line summary>?". An inferred instruction: "Add to the project rules: <one line>?". Save after his yes.
- A change to the Current state page alone needs no question in either mode.
~~~

**Line 65 · W5 · Mike decides (section 4)**
~~~text
OLD: - `trusted`: a routine fact you are sure of is saved without asking, with
  Authorization "Trusted grant, <date>", and reported in one line.
NEW: - `trusted`: a fact you inferred and can name a source for is saved without asking, with Authorization "Trusted grant, <date>", and reported in one line. The kinds in the "In both modes, always ask first" bullet below still get a question.
~~~
Note: `local-memory-save` `SKILL.md` line 71 (3.20) asks the same question with different words; one answer covers both.

**Line 72 · W4**
~~~text
OLD: - A lesson under "Gotchas and lessons" needs no question in either mode: it
  is marked unproven, and nothing relies on it. Report it in one line.
NEW: - A lesson goes under "Gotchas and lessons" of the concept it is about, as a `### <lesson>` heading with a `**Seen:**` line: the date, and the session or work item, of each time it came up. The first lesson replaces "None yet."; the same lesson again adds a date to its Seen line, never a second heading. A lesson is unproven and nothing relies on it, so it needs no question in either mode. Report it in one line.
~~~
Note: `notion-memory-refine` `refine.md` line 107 depends on the Seen line.

**Line 76 · W4**
~~~text
OLD: - Unanswered: a proposal plus one line under "Waiting on the owner" on the
  Current state page. Never rely on it.
NEW: - Unanswered: a proposal plus one line under "Waiting on the owner" on the Current state page. Never rely on the proposal.
~~~

#### `notion-memory-save/references/saving.md`

**Line 48 · W7**
~~~text
OLD: 3. Set Saved to today, Authorization to what allowed it (his yes, or
   "Trusted grant, <date>"), and change Synopsis when the concept now covers
   more.
NEW: 3. Set Saved to today, Authorization to what allowed it ("Approved by <owner> on <date>", or "Trusted grant, <date>"), and change Synopsis when the concept now covers more.
~~~

**Line 70 · W7**
~~~text
OLD: Only a decision that later work must follow (the work skill asks the owner
"This looks project-wide. Save it to memory too?"). The item's own
Questions and Answers row already holds it.
NEW: Only a decision that later work must follow, after the owner said yes to "This looks project-wide. Save it to memory too?". The item's own Questions and Answers row already holds it.
~~~

**Line 74 · W4**
~~~text
OLD: - Key `decision_<slug>`, Kind "decision", Tags "decision", Decided At the
  date, and the body from `assets/decision-record.md`: the decision in one
  sentence, how to apply it, and "Decided in IML-3, Q-04, on … by …" with his
  words. No copy of the full reasoning: it stays in the work item.
NEW: - Key `decision_<slug>`, Kind "decision", Tags "decision", Decided At the date, and the body from `assets/decision-record.md`: the decision in one sentence, how to apply it, and its first "Where it was decided" line ("Decided in IML-3, Q-04, on … by …" with his words); remove the "With no work item" line. No copy of the full reasoning: it stays in the work item.
~~~
Note: the "Made with no work item" bullet (line 79) has the reverse gap; fix both together.

**Line 87 · W6**
~~~text
OLD: - A record replaced by another: set the old one's Status "superseded" and
  "Superseded by" to the new key; set the new one's "Supersedes" relation to
  the old page. Never delete a record.
NEW: - A record replaced by another: set the old one's Status "superseded" and "Superseded by" to the new key; set the new one's "Supersedes" relation to the old page.
~~~

**Line 97 · W4**
~~~text
OLD: - Right after a save, "forget that" undoes that save: remove the section
  you just added, put back the old wording of a section you just changed,
  or set a record you just made to Status "deprecated".
NEW: - When "forget that" is his next message after a save you reported, it undoes that save: remove the section you added, put back the old wording of a section you changed, or set a record you made to Status "deprecated".
~~~

**Line 105 · W3**
~~~text
OLD: - He wants a record gone for good: tell him which one, with its link, and
  that he deletes it in Notion himself. Never say it is deleted when it is
  not.
NEW: - He wants a record deleted: tell him which one, with its link, and that he deletes it in Notion himself. Never say it is deleted when it is not.
~~~

**Line 113 · W4**
~~~text
OLD: A question you asked ("Save to memory: <one line>?") that he has not
answered yet is kept as a proposal, so it is not lost. Never rely on it.
NEW: A question you asked ("Save to memory: <one line>?") that his next reply does not answer is kept as a proposal, so it is not lost. Never rely on a proposal.
~~~

**Line 160 · W2**
~~~text
OLD: 6. Commit it. A later bullet changes one file he asked for, which
   `.claude/rules/shared-repository-work.md` allows in place; stage it by
   name. The first bullet also changes `AGENTS.md`: two files, so make that
   change in your own worktree and branch, as that rule says.
NEW: 6. Commit it. A bullet added to a file that already exists is a one-file edit he asked for directly, which `.claude/rules/shared-repository-work.md` allows without your own worktree; stage it by name. When you created the file in step 1, the change also touches `AGENTS.md`: two files, so make it in your own worktree and branch, as that rule says.
~~~

#### `notion-memory-save/references/record-mapping.md` (the same file is in `notion-memory-find` and `notion-memory-refine`)

**Line 45 · W4 · Mike decides (section 4)**
~~~text
OLD: Lore's other columns stay empty unless a record needs them
(a decision may fill Decided At, Alternatives, Consequences).
NEW: Lore's other columns stay empty, except on a decision record: it always sets Decided At (the date it was decided); it fills Alternatives with one line only when the owner named the options, and Consequences with one line only when he named the effects. The full reasoning stays in the work item.
~~~
Note: the Decided At part is not a question; whether Alternatives and Consequences are ever filled is.

#### `notion-memory-save/references/current-state.md` (the same file is in `notion-memory-refine`)

**Line 36 · W4**
~~~text
OLD: - An item finished or cancelled: remove its line under Now.
- A question answered: remove its line under Waiting on the owner.
- A to-do that got a work item: replace it with the ID, or remove it.
NEW: - An item set to Done or Cancelled: remove its line under Now.
- A question answered: remove its line under Waiting on the owner.
- A to-do that got a work item: remove it from Untracked to-dos, and add the item's ID under Now unless Now already names that item.
~~~

**Line 39 · W4**
~~~text
OLD: - Handoff and the end of a session: rewrite "Next session starts with".
NEW: - At handoff (the `handoff` skill, which also runs when the owner says he is ending the session): rewrite "Next session starts with".
~~~

**Line 45 · W4**
~~~text
OLD: An empty section says "None." A section over its limit: remove the oldest
lines that are no longer true; the notion-memory-refine skill does a full
clean-up.
NEW: An empty section says "None." A section still over its limit after every line that is no longer true is gone: run the notion-memory-refine skill, which cuts a true line only after the owner's yes.
~~~

#### `notion-memory-save/references/notion-access.md` (five copies)

**Line 21 · W4**
~~~text
OLD: | `ntn` | Notion's official command-line tool (`ntn api <path>` calls the public Notion API). | Always works in Claude Code, Codex, a terminal, and hooks. Use it first. |
NEW: | `ntn` | Notion's official command-line tool (`ntn api <path>` calls the public Notion API). | Works in Claude Code, a terminal, and hooks, and in Codex when each call runs with escalated permissions ("In Codex", below). Use it first. |
~~~
Note: 3.23 has a different text for the same line; use this one (it keeps "Use it first" and the pointer, and reads in the host order the rest of the file uses).

**Line 69 · W3**
~~~text
OLD: - Never loosen the sandbox for the whole session.
NEW: - Never change the Codex sandbox mode for the whole session.
~~~

**Line 91 · W4**
~~~text
OLD: | 409 `conflict_error` | Two writes at once, or an ID prefix already used in the workspace. | Retry once after a few seconds; for a prefix, pick another. |
NEW: | 409 `conflict_error` | Two writes at once, or an ID prefix already used in the workspace. | Retry once after 5 seconds; for a prefix, propose another to the owner. |
~~~
Note: 3.23 has a tighter text for the same line (each cause gets its own action); use 3.23's.

**Line 93 · W3**
~~~text
OLD: | 500, 502, 503, 504 | Notion is having trouble. | Retry a read once. Never retry a write blindly: read first to see whether it landed. |
NEW: | 500, 502, 503, 504 | Notion is having trouble. | Retry a read once. Before you retry a write, read the page to see whether the write was saved; retry only when it was not. |

(and lines 96-97:) If the change is not there, say "Not saved", keep the text, and give the fix.
~~~
Note: 3.23 has texts for lines 93 and 96 that also cover rows and name the owner; use 3.23's.

#### `notion-memory-save/references/ntn-basics.md` (five copies)

**Line 153 · W3**
~~~text
OLD: - Several replacements in one call are applied in order; all land or none.
NEW: - Several replacements in one call are applied in order; either all of them are applied or none is.
~~~
Note: 3.23 has a different text for the same line; either works. Use 3.23's ("Notion saves all of them or none of them"), which names who does it.

**Line 161 · W4**
~~~text
OLD: answer comes back before the content is there. Check every few seconds
until the page has its blocks:
NEW: answer comes back before the content is there. Check every 5 seconds until the page has its blocks:

(and line 170:) Stop after two minutes and tell the owner.
~~~
Note: 3.23 has the same fix with a fuller last line ("Stop checking after two minutes and tell the owner the template did not finish."); use 3.23's. It names the line as 169.

#### `notion-memory-save/references/setup.md`

**Line 16 · W7**
~~~text
OLD: Before anything: the owner has signed in (`ntn login`) and shared his
Notion root with the "Notion CLI" connection (`notion-access.md`).
NEW: Before anything: the owner has signed in (`ntn login`) and shared his Notion root page, the page that holds his projects, with the "Notion CLI" connection (`notion-access.md`, "Which pages the agent can reach").
~~~

**Line 19 · W7**
~~~text
OLD: 1. **Which template.** Work and memory both in Notion: onboarding copies
   "Template — Project: work and memory" (the notion-work-track skill's
   setup steps make the project page; continue at step 3). Memory only
   (work items local or on GitHub): copy "Template — Project: memory only"
   the same way:
NEW: 1. **Which template.** Work and memory both in Notion: onboarding copies "Template — Project: work and memory" (the notion-work-track skill's setup steps make the project page; continue at step 3). Memory only (work items local or on GitHub): copy "Template — Project: memory only" as a row of the owner's own Projects database (`<projects-data-source-id>`, title column `Project`; not Lore's Projects database on a Memory page, whose title column is `Name`):

   (the `ntn api v1/pages` command, unchanged)

   With no Projects database, use `"parent":{"type":"page_id","page_id":"<root-page-id>"}` and `"properties":{"title":{"title":[…]}}` instead.
~~~

**Line 58 · W4**
~~~text
OLD: `PROJECT.md`, section "Toolkit settings", Notion block, gets:
NEW: `PROJECT.md`, section "Toolkit settings", gets these lines in its `### Notion` block (in a memory-only project, add the `### Notion` heading first):

(and line 71:) (With a memory-only template, also `- Project page: <url>` and `- Templates page: <id>`.)
~~~

**Line 126 · W2 · Mike decides (section 4)**
~~~text
OLD: Only in the private Notion test area may you set it yourself,
   through his signed-in Chrome (Mike, 2026-09-30).
NEW: Only in a Notion test area the owner named for this may you set it yourself, through his signed-in Chrome.
~~~
Note: `notion-work-track` `setup.md` line 227 (3.23) has the same sentence with a different proposal; one answer covers both.

#### `notion-memory-save/references/lore-layout.md`

**Line 216 · W4**
~~~text
OLD: A property added after the layout is set lands in a visible
section: add it to the layout, or set it to always hide, right away.
NEW: A property added after the layout is set appears in a visible section. Right away, ask the owner to move it into its section from the table above, or to hide it when the table's Hidden column covers it; for any other property, ask him which section it goes in.
~~~

#### `notion-memory-save/examples/save-walkthrough.md`

**Line 57 · W4**
~~~text
OLD: "Saved to memory: Required transaction fields (decision), linked to IML-1."
NEW: "Saved to memory: Required transaction fields (decision), linked to IML-1: https://app.notion.com/p/Required-transaction-fields-3ebb…"
~~~
Note: the example calls itself "A real run"; the writer may say it was lightly edited.

#### `notion-memory-refine/SKILL.md`

**Line 18 · W4**
~~~text
OLD: Check `ntn whoami`; if it fails, the owner signs in
   (`references/notion-access.md`). In Codex, run each `ntn` command
   alone with escalated permissions (`references/notion-access.md`, "In
   Codex").
NEW: In Codex, run each `ntn` command alone with escalated permissions (`references/notion-access.md`, "In Codex"). Check `ntn whoami`; if it still fails, the owner signs in (`references/notion-access.md`).
~~~

**Line 24 · W1**
~~~text
OLD: longer true and tell the owner what went.
NEW: longer true, and tell the owner which lines you removed.
~~~

#### `notion-memory-refine/references/refine.md`

**Line 46 · W4**
~~~text
OLD: Two records about the same concept (similar keys, titles, or synopses) are
merged into the older or broader one:
NEW: Two records about the same concept (similar keys, titles, or synopses) are merged into the broader one (the one whose concept covers the other's); when neither covers the other, into the older one:
~~~

**Line 62 · W4**
~~~text
OLD: - An old `event_` record stays: events are history.
NEW: - An `event_` record is never retired for its age: events are history.
~~~

**Line 66 · W4**
~~~text
OLD: Records with Status "proposed" wait for the owner's yes. List them, ask
about each (with its one-line reason), and set "accepted" with Authorization
on his yes, or "deprecated" on his no.
NEW: Records with Status "proposed" wait for the owner's yes; a proposal section inside another record starts `**Proposal, not approved yet:**`, and the Current state page's "Waiting on the owner" lines name each one. List them, ask about each (with its one-line reason), then:

- His yes: remove the proposal marks (the "Proposal, not approved yet:" start of the Synopsis, or the proposal line of the section), set Status "accepted" and Authorization "Approved by <owner> on <date>", and remove its Current state line.
- His no: set a proposal record to Status "deprecated", or remove a proposal section, and remove its Current state line.
~~~

**Line 75 · W4**
~~~text
OLD: - "Work item IDs" and the relation should name the same items. When they
  differ, the relation is the truth when work items are in Notion.
NEW: - "Work item IDs" and the relation should name the same items. When they differ and work items are in Notion, change "Work item IDs" to match the relation, and keep any ID marked "(removed)".
~~~

**Line 81 · W4**
~~~text
OLD: A record whose Last verified is "unknown" or older than about six months,
about something that changes (a vendor, a process, a person's role): check
it against its source when possible, or ask the owner, then set Last
verified or retire it.
NEW: A record about something that changes (a vendor, a process, a person's role) whose Last verified is "unknown" or more than six months old: check it against its source. When you cannot reach the source, ask the owner. Then set Last verified to the date you checked, or retire it.
~~~

**Line 92 · W4**
~~~text
OLD: 2. Remove every line that is no longer true: finished or cancelled items,
   answered questions, to-dos that now have a work item. A Now line that
   copies an item's status or next step: cut it to the ID and a few words,
   because the item's own Current state holds that detail.
NEW: 2. Remove every line that is no longer true: items set to Done or Cancelled, and answered questions. Move each to-do that now has a work item to Now, as the item's ID, unless Now already names that item. A Now line that copies an item's status or next step: cut it to the ID and a few words, because the item's own Current state holds that detail.
~~~

**Line 98 · W5**
~~~text
OLD: 4. A section still over its limit after that holds only true lines: put
   the lines you would cut in the plan list; never cut a true line without
   the owner's yes.
NEW: 4. A section still over its limit after that holds only true lines: put the lines you propose to cut in the plan list, each with its reason. Use your judgment: propose the lines the next session is least likely to need. Never propose cutting an open owner to-do only to meet a limit: offer him a work item for it instead. Never cut a true line without the owner's yes.
~~~

**Line 107 · W4**
~~~text
OLD: A "Gotchas and lessons" entry has proved itself when it was seen in several
sessions or the owner confirmed it.
NEW: A "Gotchas and lessons" entry has proved itself when its **Seen:** line names two or more sessions, or when the owner confirmed it.
~~~
Note: depends on the `notion-memory-save` `SKILL.md` line 72 fix.

#### `notion-memory-refine/examples/refine-walkthrough.md`

**Line 39 · W4**
~~~text
OLD: - Merged: Exports (kept), Export (superseded).
- Retired: Old dashboard.
- Linked: Required transaction fields → IML-4.
- Not changed: the currency-check rule (you said not yet).
NEW: - Merged: Exports (kept, https://app.notion.com/p/Exports-…), Export (superseded, https://app.notion.com/p/Export-…).
- Retired: Old dashboard (https://app.notion.com/p/Old-dashboard-…).
- Linked: Required transaction fields → IML-4 (https://app.notion.com/p/Required-transaction-fields-3ebb…).
- Not changed: the currency-check rule (you said not yet).
~~~

### 3.23 Notion work skills (`<sets>notion-work/`)

#### `notion-work-find/SKILL.md`

**Line 3 · W3** (description)
~~~text
OLD: so answers rest on the tracker.
NEW: so answers come from the tracker.
~~~
Note: replaced by the text in 2.9.

**Line 61 · W4**
~~~text
OLD: - A 404 usually means the page is not shared with the "Notion CLI"
  connection.
NEW: - A 404 means the page is not shared with the "Notion CLI" connection or
  its id is wrong (`references/notion-access.md`, "When a call fails").
~~~

#### `notion-work-find/references/fields.md`

**Line 42 · W4**
~~~text
OLD: Decision needed from; open rows first, oldest on top; "yes" in Decision?
NEW: Decision needed from; open rows first, the oldest open row on top, then
answered rows, newest first; "yes" in Decision?
~~~

#### `notion-work-find/references/queries.md`

**Line 156 · W3**
~~~text
OLD: the address has run out: read the page again for a fresh one.
NEW: the address has expired: read the page again to get a new address.
~~~

**Line 172 · W4**
~~~text
OLD: Report it; notion-work-track fixes it.
NEW: Tell the owner the item has no template sections and offer to add them;
the notion-work-track skill adds them ("A card made by hand in Notion").
~~~

#### `notion-work-find/examples/status-report.md`

**Line 26 · W7**
~~~text
OLD: - IML-3 Made by hand with the New button: you made this in Notion; it still
  needs the work item layout. Want me to add it?
NEW: - IML-3 Made by hand with the New button: you made this in Notion; it still
  needs the standard work item sections. Want me to add them?
~~~

#### `references/notion-access.md` (five copies)

**Line 21 · W4**
~~~text
OLD: | `ntn` | Notion's official command-line tool (`ntn api <path>` calls the public Notion API). | Always works in Claude Code, Codex, a terminal, and hooks. Use it first. |
NEW: | `ntn` | Notion's official command-line tool (`ntn api <path>` calls the public Notion API). | Works in Claude Code, Codex (with escalated permissions; see "In Codex"), a terminal, and hooks. Use it first. |
~~~
Note: 3.22 has a different text for this line; use 3.22's.

**Line 24 · W5 · Mike decides (section 4)**
~~~text
OLD: Every step in this skill is written for `ntn`. Where the connector does the
same job, you may use it; the data model and the rules are the same. ... The connector is not tested in Codex; when a connector step
fails, do the same step with `ntn`.
NEW: Every step in this skill is written for `ntn`; use `ntn` first. Use the
connector for a step only when `ntn` cannot run in this session and the
connector is in the session and signed in; the data model and the rules
are the same. Its tools match the steps: `notion-fetch` reads a page,
`notion-query-data-sources` finds rows, `notion-create-pages` makes a row
or page (with a template), `notion-update-page` changes properties or
text, `notion-create-comment` adds a comment. The connector is not tested
in Codex.
~~~

**Line 91 · W4**
~~~text
OLD: | 409 `conflict_error` | Two writes at once, or an ID prefix already used in the workspace. | Retry once after a few seconds; for a prefix, pick another. |
NEW: | 409 `conflict_error` | Two writes at once, or an ID prefix already used in the workspace. | Two writes at once: wait 5 seconds, then retry once. A prefix already used: propose another prefix to the owner and wait for his yes. |
~~~
Note: use this text rather than 3.22's.

**Line 93 · W3**
~~~text
OLD: | 500, 502, 503, 504 | Notion is having trouble. | Retry a read once. Never retry a write blindly: read first to see whether it landed. |
NEW: | 500, 502, 503, 504 | Notion is having trouble. | Retry a read once. Before you retry a write, read the page or row to see whether the write was saved; retry only if it was not. |
~~~
Note: use this text rather than 3.22's.

**Line 96 · W3**
~~~text
OLD: row) before telling the owner it is done. If it did not land, say "Not
saved", keep the text, and give the fix.
NEW: row) before telling the owner it is done. If the write was not saved, tell
the owner "Not saved", keep the text you tried to write so it is not lost,
and give the fix.
~~~
Note: use this text rather than 3.22's lines 96-97.

**Line 101 · W4**
~~~text
OLD: - About three calls a second per connection. Space bulk work out.
NEW: - Notion allows about three calls a second per connection. Send no more
  than three calls a second.
~~~

#### `references/ntn-basics.md` (five copies)

**Line 36 · W4**
~~~text
OLD: send it with `-d @file`. For a short body, inline JSON in single quotes
works:
NEW: send it with `-d @file`. For a body with no single quote (') in its text,
inline JSON in single quotes works:
~~~

**Line 43 · W4**
~~~text
OLD: Property names in a body may be the names shown in Notion ("Waiting on",
"Parent item").
NEW: Property names in a page or query body may be the names shown in Notion
("Waiting on", "Parent item"). A view's group-by and column settings need
property ids ("Filling a body from an asset", below).
~~~

**Line 129 · W4**
~~~text
OLD: - A toggle heading is `## Questions and Answers {toggle="true"}`; its
  contents are indented with one tab.
NEW: - A toggle heading is `## Questions and Answers {toggle="true"}`; its
  contents are indented with one tab, except the lines of a table's rows
  (`<tr>`, `<td>`, `</tr>`), which have no tab.
~~~

**Line 152 · W4**
~~~text
OLD: more than once, Notion refuses and nothing changes: read the page again
  and make `old_str` longer or corrected.
NEW: more than once, Notion refuses and nothing changes: read the page again.
  If it matched nothing, copy `old_str` again from the text as read. If it
  matched more than once, add nearby text to `old_str` until it matches
  once.
~~~

**Line 153 · W3**
~~~text
OLD: - Several replacements in one call are applied in order; all land or none.
NEW: - Several replacements in one call are applied in order; Notion saves all
  of them or none of them.
~~~
Note: use this text rather than 3.22's.

**Line 161 · W4**
~~~text
OLD: answer comes back before the content is there. Check every few seconds
until the page has its blocks:
NEW: answer comes back before the content is there. Check every 5 seconds
until the page has its blocks:

(and line 169:) Stop checking after two minutes and tell the owner the template did not finish.
~~~
Note: use this text rather than 3.22's.

**Line 175 · W7**
~~~text
OLD: Notion accepts an id with or without dashes, and a page link
NEW: In these references, "id" in lower case is Notion's own id of a page,
database, data source, block, view, or property. "ID" in capitals is the
project's own label for a record, such as `WI-31`, `P1`, `P1-T01`, or
`Q-07`.

Notion accepts an id with or without dashes, and a page link
~~~

#### `notion-work-track/SKILL.md`

**Line 3 · W3** (description)
~~~text
OLD: so every change lands the same way.
NEW: so every change is stored the same way.
~~~
Note: replaced by the text in 2.10 ("is saved the same way").

**Line 17 · W2**
~~~text
OLD: ## The model in one screen
NEW: ## How the work is stored
~~~
Note: the local and GitHub track skills have the same heading with different new names (3.19, 3.21); the writer may pick one pattern for all three.

**Line 21 · W4**
~~~text
OLD:   Smaller work is a task. Never call the top level an epic.
NEW:   Work smaller than an item is a task, never a fourth level. Never call
  the top level an epic.
~~~
Note: the shared `work-item-format.md` line 244 is reworded in 3.1 ("A single step of work is a task"); the writer may use those words here.

**Line 43 · W3**
~~~text
OLD: 3. Make the change with the matching recipe:
NEW: 3. Make the change with the steps in the matching reference:
~~~

**Line 52 · W3**
~~~text
OLD: 4. Read it back and check it landed. If not, say "Not saved" and give the
   fix.
NEW: 4. Read the changed page or row back and check the change is saved. If it
   is not, tell the owner "Not saved" and give the fix.
~~~

**Line 57 · W4**
~~~text
OLD: Add a Recent History row for a
   material change.
NEW: Add a Recent History row when
   `references/items.md`, "Recent History rows", says to.
~~~

**Line 66 · W4**
~~~text
OLD: A
  project-wide one is also offered to memory.
NEW: When
  the decision looks project-wide, also ask the owner "This looks
  project-wide. Save it to memory too?"
~~~

**Line 71 · W4**
~~~text
OLD: - Never delete a page, row, phase, or task. Cancel, archive, or ask the
  owner to delete it himself.
NEW: - Never delete a page, row, phase, or task. Cancel or archive it instead,
  as `references/items.md` and `references/planning.md` say. When the owner
  wants it gone for good, ask him to delete it himself in Notion.
~~~

**Line 83 · W4**
~~~text
OLD: - A page made from a template fills in the background. Wait for it before
  editing, and never apply a template twice.
NEW: - A page made from a template gets its content only after the create call
  returns. Wait until the content is there (`references/ntn-basics.md`,
  "Waiting for a template to finish") before editing, and never apply a
  template twice.
~~~

**Line 89 · W4**
~~~text
OLD: - Uploaded files must be attached within the hour.
NEW: - Attach an uploaded file within one hour of uploading it; after that the
  upload expires.
~~~

**Line 90 · W4**
~~~text
OLD: - A 404 usually means the page is not shared with the "Notion CLI"
  connection, not that it is gone.
NEW: - A 404 means the page is not shared with the "Notion CLI" connection or
  its id is wrong, not that the page is gone (`references/notion-access.md`,
  "When a call fails").
~~~

#### `notion-work-track/references/items.md`

**Line 30 · W3**
~~~text
OLD: 3. After the change, read it back and check the change landed.
NEW: 3. After the change, read the page or row back and check the change is saved.
~~~

**Line 60 · W4**
~~~text
OLD: A sub-item
   goes in the parent's phase that is In Progress, else the first Not
   Started one, and only ever in a phase whose "Work item" is that parent
NEW: A sub-item
   goes in the parent's In Progress phase with the lowest Order; when there
   is none, in its Not Started phase with the lowest Order; when there is
   neither, leave "Phase" out (the tree shows it under "No phase"). Use only
   a phase whose "Work item" is that parent
~~~

**Line 148 · W4**
~~~text
OLD: Newest first, one row per material change or decision, naming the Q-ID
instead of repeating a decision. Insert right after the header row:
NEW: Newest first, naming the Q-ID instead of repeating a decision. Add a row
when: the stage, Waiting on, the blockers, or the next action changes for a
reason that is not obvious; the owner answers a question, approves,
rejects, or decides; the independent checker reports; a discovery changes
the plan, or the owner changed the item by hand; a requested result is
finished. Leave out routine commands, files opened, ordinary test runs, and
small edits. Insert right after the header row:
~~~
Note: this list is copied from the shared `work-item-format.md` section 5, which keeps "not obvious", "routine", and "small edits". 3.1 rewords those at the source (lines 153 and 161); copy the new source words here. The local and GitHub track skills also say "material change" (fixed in 3.19 and 3.21).

**Line 164 · W2**
~~~text
OLD: this). The columns, in the model's order: ID, Question, Answer, Date
NEW: this). The columns, in this order (the same in every tracker): ID, Question, Answer, Date
~~~

**Line 175 · W4**
~~~text
OLD: In the Current state, set Next action to name the
  first open Q-ID and Waiting on to "Mike: Q-07." (with the real Q-ID),
  and copy Next action into its property. When it needs the owner, set
  the Waiting on property to "owner" in the same step
NEW: In the Current state, set Next action to name the
  first open Q-ID, set the Waiting on line to the person that question is
  for and its Q-ID (for example "Mike: Q-07."), and copy Next action into
  its property. In the same step, set the Waiting on property to "owner"
  when that question is for the owner, or "external" when it is for
  someone else
~~~
Note: the trailing ' ("Waiting on and blockers").' stays.

**Line 179 · W4**
~~~text
OLD: - **An answer:** replace that row: his own words, in quotes, in Answer, the
NEW: - **An answer to an open row:** replace that row: his own words, in quotes, in Answer, the

(and add this bullet after the "An answer" bullet:)

- **A changed answer:** never rewrite the answered row. Add a new
  answered row after the last open row ("Change to Q-03: …"), set the old
  row's Status to "Superseded by Q-09" (with the new row's Q-ID), and
  update what it affects. A requirement it changes goes back to Refining.
~~~

**Line 252 · W4**
~~~text
OLD: For each open sub-item, ask
  him.
NEW: For each sub-item that is not Done
  or Cancelled, ask him whether to cancel it, move it to the top level, or
  move it under another item. Never cancel a sub-item without asking.
~~~

**Line 254 · W4**
~~~text
OLD: - **Archive:** tick Archived to hide an item from the boards. It is not
  deleted.
NEW: - **Archive:** only when the owner asks. Tick Archived to hide an item
  from the boards. It is not deleted.
~~~

**Line 256 · W4**
~~~text
OLD: - Reopen: set a stage again and add a history row saying why.
NEW: - Reopen: set Stage to the stage the work goes back to and Status to
  match it (the table in "Stage and status"), and add a Recent History row
  saying why.
~~~

**Line 267 · W7**
~~~text
OLD: title `"<WI-31>: <item title> — solution design"`, and `"markdown"` from
NEW: title `"<ID>: <item title> — solution design"` (for example "WI-31: Log a transaction — solution design"), and `"markdown"` from
~~~

**Line 280 · W4**
~~~text
OLD: 2. Set "Parent item" to the new parent and "Phase" to one of the new
   parent's phases (or empty). Never keep a phase of the old parent.
NEW: 2. Set "Parent item" to the new parent. Set "Phase" to the new parent's
   phase the owner named; when he named none, set it the same way as for a
   new sub-item ("A new work item", step 2), which leaves it empty when the
   new parent has no In Progress or Not Started phase. Never keep a phase of
   the old parent.
~~~

#### `notion-work-track/references/planning.md`

**Line 31 · W4**
~~~text
OLD: - Tasks sit mostly on the lowest-level items. A parent's tasks are the work
  that is not a sub-item of its own.
NEW: - Most tasks sit on the lowest-level items. A parent item holds a task
  only for work that none of its sub-items covers.
~~~

**Line 69 · W7**
~~~text
OLD: "Phase 2" means phase P2 of the work item open in this chat. When no item
is open, or the owner may mean project phase P02 in `PROJECT-ROADMAP.md`,
NEW: "Phase 2" means phase P2 of the work item this chat is working on. When
this chat is working on no item, or the owner may mean project phase P02
in `PROJECT-ROADMAP.md`,
~~~

**Line 96 · W4**
~~~text
OLD: | Merge two phases | Move the second phase's sub-items and tasks to the first; set the second to Cancelled with Exit result "Merged into P1". |
NEW: | Merge two phases | Ask the owner first when either phase holds work he approved. Then move the second phase's sub-items and tasks to the first, and set the second to Cancelled with Exit result "Merged into P1". |
~~~

**Line 99 · W4 · Mike decides (section 4)**
~~~text
OLD: | A phase is done | Status Done, when its tasks are done and its exit result was checked. |
NEW: | A phase is done | Status Done, when its tasks are done, its sub-items are Done or Cancelled, and its exit result was checked. |

(If Mike agrees, the model's Roadmap line and work-item-page.md line 8 change the same way.)
~~~

**Line 115 · W7**
~~~text
OLD: 3" could be more than one task (no phase named, or several items open),
NEW: 3" could be more than one task (no phase named, or this chat is working
on more than one item),
~~~

**Line 130 · W4**
~~~text
OLD: - Rewrite the item's Current state in place when the change moves it:
  Where it stands, Next action, and Last updated.
NEW: - Rewrite the item's Current state in place so every line is true, and
  set Last updated to today and who changed it.
~~~
Note: the next sentence ("Copy a changed Next action ...") stays.

#### `notion-work-track/references/workspace.md`

**Line 24 · W2**
~~~text
OLD: under his Notion root). Its children, in order:
NEW: under the top-level Notion page he shared with the "Notion CLI"
connection, when he has no Projects database). Its children, in order:
~~~

**Line 30 · W7**
~~~text
OLD: | Tasks | One row per task (the checklist of an item). |
NEW: | Tasks | One row per task of an item's plan. |
~~~

**Line 58 · W7**
~~~text
OLD: | Blocked by / Blocking | relation to Work Items, two-way | The order between items on the roadmap. |
NEW: | Blocked by / Blocking | relation to Work Items, two-way | Which item must finish before which. The Top-level items view shows these links between top-level items. |
~~~

**Line 165 · W4**
~~~text
OLD: A property added after the layout
  is set lands in a visible section: add it to the layout, or set it to
  always hide, right away.
NEW: A property added after the layout
  is set shows in a visible section. Right away, give the owner the clicks
  to move it to its section in the table above, or to hide it when the
  table lists it under Hidden.
~~~

**Line 186 · W2**
~~~text
OLD: model's column order: ID, Question, Answer, Date answered, Decision?,
NEW: 7. **Questions and Answers**: a toggle heading holding one table, in this
   column order (the same in every tracker): ID, Question, Answer, Date answered, Decision?,
~~~
Note: covers lines 185-186; the line 187 fix covers the rest.

**Line 187 · W4**
~~~text
OLD: Affects, Status, Decision needed from. Unanswered rows first, oldest on
   top.
NEW: Affects, Status, Decision needed from. Unanswered rows first, the oldest
   on top; answered rows follow, newest first.
~~~

**Line 211 · W7**
~~~text
OLD: Cancelled or Archived; a record Mike wants gone is his to delete in the
  app.
NEW: Cancelled, or Archived when the owner asks (Archived hides it from the
  boards); a record the owner wants gone, he deletes himself in the Notion
  app.
~~~

#### `notion-work-track/references/notes-files-links.md`

**Line 3 · W3**
~~~text
OLD: Purpose: the agent's running notes, the files a work item draws on, and the
NEW: Purpose: the agent's running notes, the source files a work item uses, and the
~~~

**Line 16 · W4**
~~~text
OLD: running notes that are not a decision or a material change, for example
"Helper agent finished P1-T02; 12 tests pass." A decision goes in
Questions and Answers; a material change goes in Recent History.
NEW: running notes that are not a decision and do not need a Recent History
row (`items.md`, "Recent History rows"), for example "Helper agent
finished P1-T02; 12 tests pass." A decision goes in Questions and Answers;
a change that needs a Recent History row goes in Recent History.
~~~

**Line 42 · W4**
~~~text
OLD: 1. Upload the file (at most 20 MB).
NEW: 1. Upload the file (at most 20 MB; for a bigger file, stop and tell the
   owner it is too big to upload this way).
~~~

**Line 52 · W4**
~~~text
OLD:    The status must be `uploaded`. Types: `text/plain`, `text/markdown`,
   `application/pdf`, `image/png`, `image/jpeg`, and so on; Notion refuses
   a type it does not support.
NEW:    The status must be `uploaded`. Use the file's real type, for example
   `text/plain`, `text/markdown`, `application/pdf`, `image/png`, or
   `image/jpeg`; Notion refuses a type it does not support.
~~~

**Line 68 · W4**
~~~text
OLD:    Send it within the hour: an upload not attached by then expires, and
   the read URLs expire too.
NEW:    Send it within one hour of the upload: an upload not attached by then
   expires, and the read URLs expire too.
~~~

**Line 96 · W4**
~~~text
OLD: | Blocks | "Blocked by" (other side "Blocking") | This item cannot finish before the other; the order on the roadmap. |
NEW: | Blocked by | "Blocked by" on this item (Notion fills "Blocking" on the other item) | This item cannot finish until the other item is Done, so the other item comes first. |
~~~

**Line 106 · W4**
~~~text
OLD: Never link an item to itself. Name the linked IDs in the Overview "Related
items" line too, so the text says it.
NEW: Never link an item to itself. Also write the linked items' IDs in the
Overview's "Related items" line, so the page text lists every link.
~~~

#### `notion-work-track/references/setup.md`

**Line 41 · W2**
~~~text
OLD: Before anything: the owner has signed in (`ntn login`) and shared his
Notion root page with the "Notion CLI" connection (`notion-access.md`).
NEW: Before anything: the owner has signed in (`ntn login`) and shared, with
the "Notion CLI" connection, the top-level Notion page his projects go
under (`notion-access.md`, "Which pages the agent can reach"). In this
file, "the owner's Notion root" and `<root-page-id>` mean that page.
~~~

**Line 142 · W4**
~~~text
OLD: The page layout is not
   readable by the API: when a project's pages look wrong, give the owner
   the layout clicks in `workspace.md`.
NEW: The API cannot read
   the page layout: when the owner says a project's pages show properties
   in the wrong order or the wrong sections, give him the layout clicks in
   `workspace.md`, "Property order and page layout".
~~~

**Line 227 · W2 · Mike decides (section 4)**
~~~text
OLD: Only in the
    private Notion test area may you set it yourself, through his
    signed-in Chrome (Mike, 2026-09-30).
NEW: Never set the
    page layout yourself unless the owner names the Notion page as his
    private test area and says you may use his signed-in Chrome.
~~~
Note: `notion-memory-save` `setup.md` line 126 (3.22) has the same sentence; one answer covers both.

#### `notion-work-track/assets/work-item-page.md`

**Line 5 · W7**
~~~text
OLD: **Next action:** \<The next specific action and its owner, or the next open question (Q-ID).\>
NEW: **Next action:** \<The next specific action and who takes it, or the next open question (Q-ID).\>

(Change the `old_str` example in ntn-basics.md line 144 in all five copies to match. setup.md, "Bringing a project up to the current template", step 4 allows only two text changes to an existing template page; add this prompt as a third, or older template pages keep "its owner".)
~~~
Note: do not touch the live test area's Notion pages while the test run is going.

**Line 33 · W4**
~~~text
OLD: These rows are the item's decisions. Unanswered rows stay first, oldest on top.
NEW: These rows are the item's decisions. Unanswered rows stay first, the oldest on top; answered rows follow, newest first.
~~~
Note: keep the leading tab; the line sits inside the toggle.

#### `notion-work-track/assets/project-page.md`

**Line 10 · W7**
~~~text
OLD: The Work Items database holds every work item. Phases and Tasks hold each item's plan and checklist; they show inside each item's page.
NEW: The Work Items database holds every work item. Phases and Tasks hold each item's plan: its phases and its tasks. They show inside each item's page.
~~~

#### `notion-work-track/assets/design-page.md`

**Line 1 · W7**
~~~text
OLD: *Note: Fill-in guide: keep this file as a child page of its work item,
NEW: *Note: Fill-in guide: keep this page as a child page of its work item,
~~~

**Line 3 · W3 · Mike decides (section 4)**
~~~text
OLD: The work item page owns the agreed goal, its Current state (where work stands and the exact next action), active requirements, Questions and Answers (which holds the item's decisions), roadmap tasks, and execution history.
NEW: The work item page holds the agreed goal, its Current state (where work stands and the exact next action), active requirements, Questions and Answers (which holds the item's decisions), roadmap tasks, and execution history.

(If Mike agrees, change the model's DESIGN.md line 17 the same way.)
~~~
Note: the `DESIGN.md` line 17 findings in 3.12, 3.19, and 3.21 change the same sentence; Mike's answer picks one text for all.

**Line 40 · W7**
~~~text
OLD: *Note: Include the number of options agreed with the owner. Keep each option in this file with the same subsections.
NEW: *Note: Include the number of options agreed with the owner. Keep each option in this page with the same subsections.
~~~
Note: `solution-design` `DESIGN.md` line 43 (3.12, Mike decides) changes the first sentence of the model version.

#### `notion-work-track/examples/replan-walkthrough.md`

**Line 38 · W4**
~~~text
OLD: - The Current state's Where it stands and Next action rewritten in place,
  and Next action copied into its property.
NEW: - The Current state's Where it stands, Next action, and Last updated
  rewritten in place, and Next action copied into its property.
~~~

### 3.24 sf-architect-solutioning (`<sf>sf-architect-solutioning/SKILL.md`)

The body is Mike's text, ported unchanged; only the description was
rewritten (Mike approved, 2026-09-27). Every body finding is his call.

**Line 3 · W4** (description)
~~~text
OLD: Use whenever the owner asks a Salesforce platform question, even about a work item ("which Flow type", "Flow or Apex"), or solution-design needs a Salesforce specialist. Not for planning or designing a work item; use work-refine or solution-design.
NEW: description: 'Answers Salesforce platform questions, checking each fact against official Salesforce docs, so every design uses verified platform behavior. Use whenever the owner asks a Salesforce platform question that needs no design options, even about a work item ("which Flow type", "Flow or Apex"), or solution-design asks for platform facts. Not for planning or design; use work-refine or solution-design.'
~~~
Note: 397 characters. Change the `dev/SKILL-INDEX.md` row in the same edit, then the overlap review and the routing test.

**Line 16 · W4 · Mike decides (section 4)**
~~~text
OLD: Read the declared project context and existing requirement before asking intake questions. Use these phases as a default checklist (lines 16-17); line 8 "produce a clear solution plan before any implementation begins"; line 34 "When the user provides a requirement, feature request, or asks \"how should we build X\":"
NEW: Add after line 10:

## Which phases to run

- The owner asks a Salesforce platform question that needs no design options: run Phase 3 only. Answer with the official source and stop.
- `solution-design` opens this skill: run Phase 3 for the facts it asks for, and use Phase 2's client conventions and Phase 4's metadata references and patterns for the components it names. Return the findings to `solution-design`. Do not run Phase 1's interview and do not write Phase 5's plan: `work-refine` holds the requirements and `solution-design` writes the design.
~~~

**Line 17 · W4 · Mike decides (section 4)**
~~~text
OLD: Use these phases as a default checklist, reusing completed work and adapting the sequence and detail to the project, use case, or individual item. Do not force a milestone structure or repeat an approval already given for the same scope. Actual approval, permission, and org boundaries remain in force.
NEW: Use these phases as a default checklist. Skip a phase whose result already exists (an approved requirement, a fact verified this session). Use your judgment on the order and detail of the other phases: weigh the project, the kind of request, and the item. Do not add milestones the project does not use. Do not ask again for an approval the owner already gave for the same scope. The owner's approvals and permissions, and the org rules in `.claude/rules/salesforce-org-safety.md`, still apply.
~~~
Note: replaces lines 17-20 from "Use these phases" on; line 16's first sentence stays.

**Line 34 · W7 · Mike decides (section 4)**
~~~text
OLD: When the user provides a requirement, feature request, or asks "how should we build X": ("user" also on lines 27, 28, 42, 78, 115, 161; "owner" on lines 110, 150 and in the description)
NEW: Use "the owner" on each of those lines: line 34 "When the owner provides a requirement, feature request, or asks \"how should we build X\":"; line 27 "The owner approves component designs"; line 28 "The owner approves the plan"; line 42 "the owner may be describing an implementation"; line 78 "ask the owner where the solution plan and design decisions should be recorded"; line 115 "3. **Get the owner's approval** of the declarative designs before solution planning."; line 161 "Wait for the owner's approval unless the same plan and scope were already approved."
~~~
Note: line 51 ("which users/personas") means Salesforce users and stays. `references/solution-plan-template.md` line 167 ("ask the user") changes in the same edit.

**Line 38 · W3 · Mike decides (section 4)**
~~~text
OLD: - Do NOT accept the requirement at face value (line 38); "- Look for scope creep signals, conflicting requirements, and edge cases" (line 40)
NEW: Line 38: "- Do NOT treat the requirement as complete or correct as written". Line 40: "- Look for signs that the scope is growing past the stated goal, and for conflicting requirements and edge cases".
~~~

**Line 46 · W4 · Mike decides (section 4)**
~~~text
OLD: Ask **one targeted question at a time**, with a recommendation and a short reason when useful. Check existing answers first. Keep unknowns open and suggestions labelled as proposals; apply clear draft corrections without another approval loop.
NEW: Ask **one targeted question at a time**, with a recommendation and a one-line reason. Check existing answers first. Mark each unknown as open and each suggestion as a proposal. When the owner corrects a draft and the correction can be applied only one way, apply it without asking him to approve it again.
~~~
Note: covers lines 46-49 up to "loop."; "Use the following topics only where information is missing:" stays.

**Line 75 · W2 · Mike decides (section 4)**
~~~text
OLD: (or CLAUDE.md in a project still in the old layout) (also on lines 77 and 177)
NEW: Line 75: "1. **Read the project's AGENTS.md and rules** (`.claude/rules/` if present). They declare where requirements, design decisions, work items, and deployment state live (a ticketing system, a hub doc, local markdown, a tracker file, or a mix)." Line 77: "3. **Check client conventions**: a `## Client Metadata Conventions` section in the project's AGENTS.md overrides Well-Architected defaults where they conflict. Also apply `references/naming-conventions.md` for standard naming." Line 177: "- **Respect the project's own rules.** Project AGENTS.md, rules, and client conventions override this skill's defaults where they conflict."
~~~
Note: `references/solution-plan-template.md` line 160 has the same words in brackets; change it in the same edit.

**Line 76 · W7 · Mike decides (section 4)**
~~~text
OLD: 2. **Check prior decisions** in whatever decision log the project declares. Flag any conflict between the new requirement and an existing decision before designing around it.
NEW: 2. **Check prior decisions**: the work item's Questions and Answers rows marked `Decision?` yes, and project-wide decisions in memory (the project's memory find skill, or Hindsight's `recall` tool). Flag any conflict between the new requirement and an existing decision before designing around it.
~~~
Note: `references/solution-plan-template.md` line 162 ("Decision log / decisions register") changes in the same edit.

**Line 80 · W2 · Mike decides (section 4)**
~~~text
OLD: Use the existing tracker upkeep guidance for settled answers, decisions, and next steps. Keep one canonical record, wherever the project tracks work. When `solution-design` is coordinating the conversation, return Salesforce design findings to that conversation; do not start another interview or parallel writer.
NEW: Record settled answers, decisions, and next steps in the work item with the project's work track skill; the work item is their one full record. When `solution-design` opened this skill, return Salesforce design findings to `solution-design`; do not start another interview and do not write a second design.
~~~

**Line 89 · W3 · Mike decides (section 4)**
~~~text
OLD: Read `references/doc-sources.md` for the source map and fetch recipes. The non-negotiables:
NEW: Read `references/doc-sources.md` for its Source Map and its Fetch Recipes by Site. These rules always apply:
~~~

**Line 94 · W4 · Mike decides (section 4)**
~~~text
OLD: - **help.salesforce.com needs the Playwright browser**; plain fetching returns an empty shell.
NEW: - **Open help.salesforce.com pages in the Playwright browser**; a plain fetch returns the page without its article text. When no Playwright browser is available and developer.salesforce.com does not have the same content (`references/doc-sources.md`), name the page you could not read and ask the owner to paste its text.
~~~

**Line 103 · W3 · Mike decides (section 4)**
~~~text
OLD: and check the official record-triggered automation decision guide (see doc-sources.md) when the call is close.
NEW: and check the official record-triggered automation decision guide (see doc-sources.md) when you cannot answer a question in the decision tree with yes or no for this requirement.
~~~

**Line 140 · W5 · Mike decides (section 4)**
~~~text
OLD: Consider a brief assessment per pillar where useful (template Section 6).
NEW: Use your judgment: write a short assessment for each pillar the design affects, and skip a pillar it does not affect (template Section 6).
~~~

**Line 162 · W7 · Mike decides (section 4)**
~~~text
OLD: Identify the project's available implementation workflow; use **sf-develop** only if it is actually installed and available. If absent, give the main conversation the approved plan, boundaries, and next action for its normal implementation tools. An unavailable skill is not a reason to invent an installation or strand the work. Plan approval alone does not authorize building.
NEW: Lines 162-166: "Give the main conversation the approved plan, its boundaries, and the next action; the build runs through `work-on`. Do not install a skill to build it. Plan approval alone does not authorize building." Line 28, last cell: "The owner approves the plan". references/solution-plan-template.md line 171: "**Awaiting approval to proceed with implementation (the build runs through work-on).**"
~~~

**Line 174 · W3 · Mike decides (section 4)**
~~~text
OLD: - **Sources or it didn't happen.** Every platform-capability claim in the plan cites an official doc fetched this session.
NEW: - **Cite a source for every platform claim.** Every platform-capability claim in the plan cites an official doc fetched this session.
~~~

**Line 175 · W7 · Mike decides (section 4)**
~~~text
OLD: - **Governor limits at scale.** Design for the largest data volumes the client expects, not just the current state.
NEW: - **Governor limits at scale.** Design for the largest data volumes the client expects, not only today's volumes.
~~~

**Line 178 · W4 · Mike decides (section 4)**
~~~text
OLD: - **Hand off cleanly.** Return the approved plan to the main conversation and its available implementation workflow, preserving the separate build authorization.
NEW: - **Hand off the approved plan.** Return it to the main conversation for `work-on`. The build still needs the owner's own yes; plan approval is not that yes.
~~~

### 3.25 sf-component-tracker (`<model>.claude/skills/sf-component-tracker/SKILL.md`)

This is a model skill; every change is Mike's call and goes on the model
branch.

**Line 3 · W4 · Mike decides (section 4)** (description)
~~~text
OLD: description: 'Keeps the component tracker CSV, the master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in sync. Use first, before work-on, when Salesforce metadata under force-app/ is added, changed, renamed, or deleted, a deploy result comes back, or a deploy needs manual steps.'
NEW: description: 'Keeps the component tracker CSV, the master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in sync, so every deploy names exactly what changed. Use when Salesforce metadata under force-app/ is added, changed, renamed, or deleted (open it before work-on and update the records in the same response), a deploy result comes back, or a deploy needs manual steps.'
~~~
Note: 2.24 changes the same description; see 2.30 for the recommended merged text.

**Line 10 · W2 · Mike decides (section 4)**
~~~text
OLD: A project with another artifact root keeps these records where it stores deployment records.
NEW: A project that keeps deployment records in another folder keeps these records in that folder.
~~~

**Line 25 · W4 · Mike decides (section 4)**
~~~text
OLD:   <YYYY-MM-DD>-<release-name>/ cutover plan and release notes when needed
NEW: Add to the tree: "  work-item-deployment-template/  copy it to start a work item's folder" and "  release-cutover-template/       copy it to start a release folder". Change line 25 to "  <YYYY-MM-DD>-<release-name>/ one folder per release that ships several work items together: CUTOVER-PLAN.md and RELEASE-NOTES.md".
~~~

**Line 30 · W7 · Mike decides (section 4)**
~~~text
OLD: a short slug from the project's tracker ... find the item by its ID in the project's tracker. (also line 112 "when the tracker has one" and line 131 "plus its link when the tracker has one")
NEW: Line 30: "- Name each work-item folder with the work item's id and a short slug from the project's work tracker, for example `WI-031-account-merge`. This deployment folder is not the work item; find the item by its ID in the project's work tracker." Line 112: "...plus the item's link when the work tracker has one." Line 131: "...plus its link when the work tracker has one (a Notion page, GitHub issue, or Jira ticket). Never a folder path."
~~~

**Line 31 · W4 · Mike decides (section 4)**
~~~text
OLD: - Keep work-item folders flat under `delivery/deployment/`. The tracker owns status.
NEW: - Keep work-item folders flat under `delivery/deployment/`: no folders by status. The work tracker holds each item's status; the component tracker's org flags record what is deployed where.
~~~

**Line 73 · W4 · Mike decides (section 4)**
~~~text
OLD: They deploy by CLI to a sandbox behind the preflight in `permissions-source-control.md`, which also decides when their flag flips.
NEW: They deploy by CLI to a sandbox only after a clean `permsets.py preflight` (`permissions-source-control.md`). Set their org flags like any other component's (see "Org flags").
~~~

**Line 77 · W7 · Mike decides (section 4)**
~~~text
OLD: A folder whose deploy needs no manual steps has no sheet. (also line 106 "Sequence in the sheet.")
NEW: Line 77: "A folder whose deploy needs no manual steps has no `manual-steps.md`." Line 106: "| Order | Sequence in the file. Use gaps of 10 (10, 20, 30). |"
~~~

**Line 89 · W5 · Mike decides (section 4)**
~~~text
OLD: - Any deploy where you want a pre-flight snapshot for safe rollback.
NEW: - Any other deploy, by your judgment: a pre-deploy snapshot step for rollback. Weigh whether a rollback would need old values that Git does not hold, such as org data or org settings.
~~~

**Line 108 · W4 · Mike decides (section 4)**
~~~text
OLD: | Status | Not started, in progress, or done. |
NEW: | Status | Not started, in progress, done, or skipped. |
~~~

**Line 113 · W4 · Mike decides (section 4)**
~~~text
OLD: - The owner runs the deploys and updates each step's status.
NEW: - The person or team in each step's Owner field runs that step and updates its status.
~~~

**Line 118 · W7 · Mike decides (section 4)**
~~~text
OLD: - Implementation tasks. They live in the task list. (also line 177 "Dates live in the work log or task tracker.")
NEW: Line 118: "- Implementation tasks. They live in the work item's Tasks." Line 177: "- Dated deploy history. Dates live in the work item's Recent History."
~~~

**Line 141 · W3 · Mike decides (section 4)**
~~~text
OLD: - When a deploy to an org lands, set that org's flag to `Yes`.
NEW: - When a deploy to an org succeeds, set that org's flag to `Yes`.
~~~
Note: the model rule `component-tracker.md` line 4 also says "a deploy that landed".

**Line 157 · W7 · Mike decides (section 4)**
~~~text
OLD: The tracker is current state. Git and the task tracker hold history. (also line 135 "One short current-state line:")
NEW: Line 157: "- Do not keep rows for components that are gone from `force-app/` and deployed nowhere. The tracker shows only what exists now. Git and the work item's Recent History hold history." Line 135: "| Notes | One short line on the component as it is now: type details (`Text(255)`, `Number(18,0)`), what the component does, and any caveat (renamed-from, superseded-by, manual-step, gated-off). Use `;` instead of `,`, or quote the cell. |"
~~~

### 3.26 sf-data-change (`<model>.claude/skills/sf-data-change/SKILL.md`)

A model skill; every change is Mike's call.

**Line 3 · W7 · Mike decides (section 4)** (description and the word "package")
~~~text
OLD: description: 'Builds the owner''s package for a Salesforce production data change: load file, backup, numbered steps, success check, and undo steps. Use first, before work-on, when the owner asks to load, import, update, or delete production records, for example "load this file into production".'
NEW: Description: 'Builds the owner''s handoff for a Salesforce production data change: load file, backup, numbered steps, success check, and undo steps, so he can run and undo the change without follow-up questions. Use when the owner asks to load, import, update, or delete production records, even inside a work-on build, for example "load this file into production" or "fix these records in production".' Body line 21: "## Step 1: build the handoff". Body line 61: "Give the owner the handoff in the reply: ..." (rest unchanged). work-finish references/salesforce-deployment.md line 27: "The owner, from the handoff `sf-data-change` builds"; line 89: "`sf-data-change`, which builds his handoff; he runs it."
~~~
Note: 2.24 changes the same description; see 2.30 for the recommended merged text. The body renames here apply either way.

**Line 8 · W3 · Mike decides (section 4)**
~~~text
OLD: This skill produces what the owner needs to run it without going back and forth.
NEW: This skill produces everything the owner needs to run the change without asking follow-up questions.
~~~

**Line 19 · W4 · Mike decides (section 4)**
~~~text
OLD: - Not by CLI, API, anonymous Apex, or any tool that wraps them.
NEW: - No agent writes production data by CLI, API, anonymous Apex, or any tool that wraps them.
~~~

**Line 24 · W4 · Mike decides (section 4)**
~~~text
OLD: 2. The backup file, when the change overwrites anything. (and line 27 "5. The undo steps. The exact steps to load the backup file back.")
NEW: Line 24: "2. The backup file, when the change updates, upserts, or deletes records. The same records with their current values, so loading it back undoes the change. Label it as the undo file." Line 27: "5. The undo steps. The exact steps to load the backup file back. For an insert: the exact steps to delete the inserted records, using the IDs in the success file."
~~~
Note: undoing a delete means inserting the backup rows again, which gives new record IDs; line 53 may then need "every field" for a delete.

**Line 38 · W4 · Mike decides (section 4)**
~~~text
OLD: Use `delivery/data/`. An established `engagement/data/` project keeps that root.
NEW: Use `delivery/data/`. A project that already uses `engagement/` uses `engagement/data/` instead.
~~~

**Line 56 · W2 · Mike decides (section 4)**
~~~text
OLD: and undo steps or backup pointer in the chosen work item and owner handoff. No separate event README or seed record is required.
NEW: - Record the work item, date, org, objects and population, exact file paths and row counts, operation, mappings, settings, success check, and undo steps (or the backup file's path) in the work item for this change and in the step 4 handoff. Write no separate README or other record for the event.
~~~

**Line 57 · W4 · Mike decides (section 4)**
~~~text
OLD: - When starting a copied Git project, verify test `.csv` files under both trees are ignored, then remove the test files.
NEW: - Before the first data change in a project (no event folder under `delivery/data/data-loads/` yet), put a test `.csv` file in `delivery/data/production-backups/` and in `delivery/data/data-loads/`, check that `git status` lists neither, then delete both files.
~~~

**Line 67 · W4 · Mike decides (section 4)**
~~~text
OLD: - `record-deployment-steps.md`: a pre-deploy snapshot for rollback is a manual step.
NEW: - `record-deployment-steps.md`: record a manual step when a deploy needs an action the deploy cannot perform. The `sf-component-tracker` skill lists a pre-deploy snapshot for rollback as one such step.
~~~

### 3.27 sf-deploy-check (`<model>.claude/skills/sf-deploy-check/SKILL.md`)

A model skill; every change is Mike's call.

**Line 3 · W3 · Mike decides (section 4)** (description)
~~~text
OLD: description: 'Finds hitch-hikers: components or pending edits that would ship with a Salesforce deploy before their feature is ready. Use before any deploy to a shared org (UAT, full copy, staging, or production), including a deploy command for the owner. Not for running the deploy; use work-finish.'
NEW: 'Finds components or pending edits that would ship with a Salesforce deploy before their feature is ready, so nothing reaches a shared org too early. Use before any deploy to a shared org (UAT, full copy, staging, or production), including a deploy command for the owner, for example "what will this deploy ship" or "give me the prod deploy command". Not for running the deploy; use work-finish.'
~~~
Note: 394 characters. 2.16 and 2.24 change the same description; 2.30 recommends 2.16's text. The two example phrases are placeholders for Mike's own words.

**Line 16 · W4 · Mike decides (section 4)**
~~~text
OLD: - Before every deploy to a shared or higher org, by `-x`, `-m`, or `-d`.
NEW: - Before every `sf project deploy start` to a shared org (for example UAT, full copy, staging, or production), whether it uses `-x`, `-m`, or `-d`.
~~~

**Line 26 · W4 · Mike decides (section 4)**
~~~text
OLD:    - The file has edits beyond the intended one. Diff it against the last deployed commit, or run `git log` on the path.
NEW:    - The file has edits beyond the intended one. Diff it against the commit last deployed to the target org (the "Source revision" line of that deploy's `DEPLOYMENT-RECORD.md`). When no record names it, run `git log -p` on the path and read each change.
~~~

**Line 28 · W7 · Mike decides (section 4)**
~~~text
OLD: Do not tell the owner something rides into production until a read-only check confirms it is not already there. (and line 29 "or confirm the rider is wanted.")
NEW: Line 28: "Do not tell the owner a component would ship to production until a read-only check confirms it is not already there." Line 29: "The owner decides: narrow the deploy set, or confirm the hitch-hiker is wanted."
~~~

**Line 39 · W6 · Mike decides (section 4)**
~~~text
OLD: A tracker can be stale in either direction. In one real case a help-text deploy was suspected of carrying a new field, label renames, and a rollup filter to production. A read-only production check showed they were already live. The mechanism is real; the tracker was wrong.
NEW: A tracker can be wrong both ways: it can show a component as missing from an org that already has it, or as deployed when it is not. Only a read-only check of the target org shows what it already has.
~~~

## 4. Questions for Mike

Every finding that only Mike can decide is here, as one plain question with a
recommended answer. Where two or more findings ask the same thing, one
question covers them all; the brackets say which findings. Nothing changes
until he answers.

- **Part A** (14 questions) is about which skill opens for a request, and
  about settings. These matter most.
- **Part B** (48 questions) is about rules that change what the agent does.
- **Part C** (49 questions) only rewords Mike's own text (the model files and
  the body of `sf-architect-solutioning`), so an agent reads each line one
  way. A single "yes to all of part C" works; he can also name the ones to
  keep as they are.

### Part A: which skill opens, and settings

**A1.** When you say "merge it" right after approving a work item's result,
should the agent finish the whole item (merge, update the requirements, then
ask you about Done) instead of only merging? This changes routing lines 32 and
40 in the model's `AGENTS.md`.
Recommended: yes, with the line 40 wording in 2.1. (2.1)

**A2.** Should the reminder hook also notice "whenever you ...", "each time
you ...", and "every time you ..." (but not "whenever you're ready")?
Recommended: yes. You would need to trust the Codex hooks again after this
change. (2.2)

**A3.** Should the model's `AGENTS.md` say that an instruction like "whenever
you finish, run the tests" goes into your project rules file, and never into a
Claude Code settings hook (the built-in `update-config` skill)?
Recommended: yes, with the texts in 2.2. (2.2)

**A4.** Once Toolkit V2 is your everyday setup, should the older claude-toolkit
plugins (`project-init`, `second-brain`, and the rest) be switched off for
every folder in both Claude Code and Codex?
Recommended: yes. Until then, start a new project with `/project-setup`
(`$project-setup` in Codex), or say "set up Toolkit V2 here". (2.5)

**A5.** In a project that tracks work in Notion, the Notion plugin's own
commands (for example "Build a task from a Notion page URL") can take over,
and one of them marks an item Done without asking you. Should the model's
`AGENTS.md` get two lines telling the agent to use the project's own skills
instead?
Recommended: yes, add the two lines in 2.6 now. Turning the plugin off per
project can come later, once the exact setting is confirmed. (2.6)

**A6.** Should model line 76 name `llm-council` and `impeccable` as skills
that may run inside the project's skills but never replace them, and say to
run `llm-council` only when you name it?
Recommended: yes. In a V2 project, "pressure-test this" alone would then not
start `llm-council`. (2.7, 2.14)

**A7.** Should routing line 29 say "give me design options" instead of "give
me options", so "give me some options" during a requirements interview stays
in the interview?
Recommended: yes. (2.13)

**A8.** Should the model's `AGENTS.md` say never to use Claude Code's built-in
`consolidate-memory` skill in V2 projects, because it edits the wrong memory
folder?
Recommended: yes, with the one line in 2.15. (2.15)

**A9.** `sf-deploy-check` has three proposed descriptions. Which one?
Recommended: the 2.16 text. It keeps the word "ready" out of the first
sentence, so "is WI-31 ready to go to UAT" goes to `work-check` first.
Optional: also reword routing line 82 as 2.16 says. (2.16, 2.24, 3.27 line 3)

**A10.** Should `sf-component-tracker` and `sf-data-change` get a "why" clause
and clearer wording, using the merged texts in 2.30?
Recommended: yes. (2.24, 3.25 line 3, 3.26 line 3)

**A11.** Should your word "hitch-hikers" come out of `sf-deploy-check`'s
description?
Recommended: yes, drop it from the description and keep it in the body, where
it is explained. (2.24)

**A12.** Should routing line 27 send only changes "in the product" to
`work-on`, and name "add it to the backlog", so "change WI-031's priority to
high" goes to the work track skill and does not start a build?
Recommended: yes. (2.25)

**A13.** In your real Codex, every skill description is already cut to about
80 characters, which removes the lines that tell similar skills apart. Should
each V2 project's Codex settings turn the Vercel plugin off and raise the
skill list limit to its maximum (10,000 tokens)?
Recommended: yes. Your other folders do not change. (2.26)

**A14.** When you say "remind me to ..." with no time, where should it go?
(a) A project to-do goes into the project (its work item if one fits,
otherwise Current State), and a personal errand goes to Todoist. (b)
Everything goes to Todoist.
Recommended: (a). (2.27)

### Part B: rules that change what the agent does

**B1.** When a reply lists its sources and also ends with a question for you,
which comes last?
Recommended: the question stays the last line, with the Sources list just
above it. This changes your model rule `cite-recalled-knowledge.md` ("End the
reply with a short Sources list"). (3.1 `approvals.md` line 61,
`decisions-and-memory.md` line 169; 3.18 `work-status` line 62)

**B2.** "Every item in a list you show him carries a one-line reason": does
that mean every list, or only lists of choices and recommendations for you to
decide?
Recommended: only lists of choices and recommendations. (3.1 `approvals.md`
line 58)

**B3.** If you tell the agent to stop running the independent check before a
result approval, should it write that as a line in your project rules and
follow it?
Recommended: yes. (3.1 `approvals.md` line 160)

**B4.** When you change a decision saved in memory and then say no to saving
the new one, should the old memory record be marked "withdrawn"?
Recommended: yes. (3.1 `decisions-and-memory.md` line 118)

**B5.** What counts as an "active" work item for the Now list in Current
State?
Recommended: one being refined, designed, built, checked, or shipped; not one
that is only logged and waiting to start. (3.1 `decisions-and-memory.md`
line 196)

**B6.** When you drop a requirement and nothing replaces it, what happens to
it?
Recommended: it is marked Superseded with the reason and the question number,
and needs no replacement. This changes your model work item template (lines
89 and 111). (3.1 `work-item-format.md` line 172)

**B7.** Should a handoff prompt always say which separate work folder
(worktree) and branch the work is in, even when no other session is working?
Recommended: yes. (3.7 `prompt-format.md` line 48)

**B8.** When a handoff replaces a "next session starts with" note that another
session left for work with no work item, should it first keep that note as a
to-do line?
Recommended: yes. (3.7 `edge-cases.md` line 16)

**B9.** Which document edits may `publish-docs` save straight to the main
branch?
Recommended: edits you asked for or said yes to, and edits another skill hands
it (like the requirements update after you approve a result); that also
covers the push. "Publishing" in the approval rules then means posting outside
the project. (3.9 `publish-docs` line 21)

**B10.** When the local copy of a pull request's branch has commits the pull
request does not have, should the merge stop before it starts and tell you?
Recommended: yes. (3.8 `merge-steps.md` line 38, `SKILL.md` line 19)

**B11.** If new commits arrive on a pull request after you said yes to merging
it, should the agent ask you again?
Recommended: yes, unless your standing merge instruction's three conditions
hold on the new version. (3.8 `merge-steps.md` line 134)

**B12.** When GitHub puts a pull request in a merge queue instead of merging
it, should the agent leave it and tell you, instead of adding it to the queue
on its own?
Recommended: yes. (3.8 `SKILL.md` line 69)

**B13.** During a document save, if bringing in other people's changes alters
what the saved text means, should the agent ask you before saving?
Recommended: yes. This drops the old "or who approved it" reason to ask. (3.9
`recovery.md` line 45)

**B14.** Should "get the latest" still run when there are new files that are
not saved to Git yet?
Recommended: yes. The pull does not touch them, and Git refuses the pull if
it would. (3.10 `pull-latest` line 23)

**B15.** When getting the latest stops because two versions of a file
conflict, should the agent undo the half-done merge right away (nothing is
lost) and tell you?
Recommended: yes. (3.10 `pull-latest` line 59)

**B16.** When a project's online copy is not named "origin", should the agent
stop and ask which one to pull from?
Recommended: yes. (3.10 `pull-latest` line 20)

**B17.** When your local changes are already online under a different save,
should the agent still merge the two and tell you?
Recommended: yes. (3.10 `pull-latest` line 88)

**B18.** During a reset to the online copy, when there are saved-aside changes
(stashes), should the agent go on after you say which ones you still want, and
delete one only when you say so?
Recommended: yes. (3.11 `reset-to-remote` line 101)

**B19.** When a design option is replaced, should it stay in the design,
marked "Superseded by Option X", instead of being deleted?
Recommended: yes. This changes your model design template. (3.12 `DESIGN.md`
line 102)

**B20.** When a check is just one person looking at one screen, should the
agent write a test plan for it?
Recommended: yes. (3.13 `testing.md` line 75)

**B21.** Can a parent item be checked as a whole only after every sub-item is
Done or Cancelled?
Recommended: yes. The same answer then goes into `work-delegate` step 11 and
the approval rules, section 8. (3.13 `testing.md` line 39)

**B22.** When is a phase Done?
Recommended: when every task in it is Done, every sub-item in it is Done or
Cancelled, and its exit result was checked. (3.14 `work-delegate` `SKILL.md`
line 75; 3.23 `planning.md` line 99)

**B23.** When one sub-item needs code from another sub-item, should the agent
merge that other sub-item's branch into this one before building?
Recommended: yes. (3.14 `running-the-team.md` line 71, `delegated-run.md`
line 60)

**B24.** May two helpers change the same file one after another, or must each
file have one writer for the whole plan?
Recommended: one after another, never at the same time. (3.14
`running-the-team.md` line 40)

**B25.** When a helper's work fails the lead's check, should the agent keep
its branch and not merge it?
Recommended: yes. (3.14 `running-the-team.md` line 98)

**B26.** In a new session, should the agent first check whether a chat under
a Main Orchestrator is still running, before restarting that chat's work?
Recommended: yes. (3.14 `running-the-team.md` line 190)

**B27.** When a stopped helper left changes it never saved, should the agent
keep them and ask you what to do?
Recommended: yes. (3.14 `running-the-team.md` line 199)

**B28.** In your archive question, may "sessions" become "chats", the word the
rest of the file uses?
Recommended: yes. (3.14 `team-arrangements.md` line 37)

**B29.** In the archive rule, does "shipped" mean merged to the main branch
and, when there is a deployment, deployed?
Recommended: yes. (3.14 `team-arrangements.md` line 93)

**B30.** Should a team of chats always run one chat per sub-item (dropping
"or per responsibility")?
Recommended: yes. (3.14 `team-arrangements.md` line 58)

**B31.** Does "the owner's working principles" in a chat's starting prompt mean
your instructions in `owner-preferences.md`?
Recommended: yes. (3.14 `team-arrangements.md` line 76)

**B32.** The toolkit calls the first project folder both "main checkout" and
"primary checkout". Which one name should all files use?
Recommended: "main checkout", the name your model's `AGENTS.md` uses most.
(3.15 `close.md` line 78; three dropped `project-setup` findings in section 5
wait for this answer)

**B33.** When a requirement you approved was not built, should the
requirements update leave it out and tell you, or write it in as a future
requirement?
Recommended: leave it out and tell you in one line; the work item still holds
it. (3.15 `spec-update.md` line 31)

**B34.** May the agent make a small fix with no work item: done in one
session, no choice for you, and no change to what the product does, to
Salesforce, or to data?
Recommended: yes. Your model says every new request gets a work item, so
this adds an exception. (3.16 `starting-and-resuming.md` line 62)

**B35.** When two chats could work on the same work item, which one may change
it?
Recommended: the chat working in that item's own folder copy; for an item
with no folder copy, the chat you are talking to about it. The other chat
tells you instead of editing. (3.16 `starting-and-resuming.md` line 200)

**B36.** When your answer during a build changes a requirement you already
approved, should the agent ask you to approve the changed requirement before
building on it?
Recommended: yes. (3.16 `keep-going.md` line 76)

**B37.** Is an item's type set only when it is created, and when is it `bug`
or `enhancement` instead of `build`?
Recommended: set it only when the item is created. Use `bug` when you report
something broken, `enhancement` when you ask to improve something that works,
and `build` for new behavior. (3.17 `SKILL.md` line 14)

**B38.** When a meeting source says someone other than you "decided"
something, should it become a question for you to confirm, not a draft
requirement?
Recommended: yes. (3.17 `sources.md` line 73)

**B39.** Can any correction to something not yet approved be applied without a
second yes, not only small ones?
Recommended: yes. (3.17 `changes.md` line 37)

**B40.** Should a large item be split into sub-items before its requirements
are approved?
Recommended: yes, before. The interview already needs the split settled
before it asks for approval. (3.17 `roadmap-and-breakdown.md` line 83)

**B41.** On GitHub, when an item waits for another item, should it carry the
"waiting on agent" label only while the agent works on that other item?
Recommended: yes. (3.19 `items.md` line 135)

**B42.** On GitHub, should the agent check an issue's length after every body
change (GitHub's limit is about 60,000 characters)?
Recommended: yes. (3.19 `items.md` line 381)

**B43.** In trusted memory mode, which facts may be saved without asking?
Recommended: a fact the agent inferred and can name a source for, unless it is
on the "always ask first" list; anything else gets the question. One answer
covers local and Notion memory. (3.20 `local-memory-save` line 71; 3.22
`notion-memory-save` line 65)

**B44.** When you give a to-do with a set time ("at 9 tomorrow"), should the
agent offer to set a reminder with Claude Code's or Codex's scheduled task
tool?
Recommended: yes. (3.20 `saving.md` line 278)

**B45.** For a Notion decision record, should the Alternatives and
Consequences columns be filled only when you named them?
Recommended: yes. (3.22 `record-mapping.md` line 45)

**B46.** May a shipped project skill ever use your signed-in Chrome to set a
Notion page layout?
Recommended: only when you name the page as your test area and say so; drop
the dated build note. (3.22 `setup.md` line 126; 3.23 `setup.md` line 227)

**B47.** Should the Notion skills always use the `ntn` command first, and use
the Notion connector only when `ntn` cannot run?
Recommended: yes. (3.23 `notion-access.md` line 24)

**B48.** When `sf-architect-solutioning` is asked one platform question,
should it answer only that; and when `solution-design` opens it, should it
give facts without running its own interview or writing its own plan?
Recommended: yes, add the "Which phases to run" section. (3.24 line 16)

### Part C: rewording your own text

Each question is "May this be reworded as section 3 shows?" The recommended
answer to every one is yes.

**C1.** Design template: "remove unused example rows and optional sections"
becomes "remove ... each section or heading the template says to remove when
unused". Use the 3.12 text for both copies. (3.12 and 3.21 `DESIGN.md` line 9)

**C2.** Design template: "The work item's main file owns ... roadmap tasks,
and execution history" becomes "holds ... its Roadmap and Tasks, and its
Recent History". Use the 3.12 text for every copy. (3.12, 3.19, 3.21
`DESIGN.md` line 17; 3.23 `design-page.md` line 3)

**C3.** Design template: "the number of options agreed with the owner"
becomes "the number of options chosen for this design (the owner's number
when he gave one)". (3.12 `DESIGN.md` line 43)

**C4.** Work item template: "Roadmap unit" in Related items becomes "the
`PROJECT-ROADMAP.md` work unit (for example P01-U01)". (3.19 `WORK-ITEM.md`
line 41)

**C5.** Work item template: "one row for each material decision or progress
change" becomes an exact list of when a Recent History row is added. Use the
3.19 text (its "a reason a later reader could not see" matches the fix in
3.1). (3.19 and 3.21 `WORK-ITEM.md` line 81)

**C6.** Work item template: "Keep an item Refining" becomes "Keep a
requirement Refining". (3.19 and 3.21 `WORK-ITEM.md` line 89)

**C7.** Work item template: a bulk yes "is saved as one row per item it
covered" becomes "per thing it covered". (3.19 `WORK-ITEM.md` line 134)

**C8.** Work item template: the Starting request "in their words or a
faithful short summary" becomes "in his words" (no summary). (3.21
`WORK-ITEM.md` line 96)

**C9.** Test plan template: the fill-in guide says to add new Checks rows and
then delete the example row. (3.13 `TEST-PLAN-TEMPLATE.md` line 3)

**C10.** Memory criteria: "technical landmarks" becomes "the main parts of the
system and where they are", in the model's `memory-criteria.md` and the three
`record-format.md` copies. (3.20 `record-format.md` line 66)

**C11.** Memory template: `authorization: <Approved card or explicit request,
or trusted grant>` lists the three real values. (3.20
`project_topic_template.md` line 10)

`sf-architect-solutioning` body (3.24):

- **C12.** Line 17: the phase checklist says what to skip and what to weigh.
- **C13.** Line 34 and six more lines: "the user" becomes "the owner".
- **C14.** Lines 38 and 40: "at face value" and "scope creep" become plain words.
- **C15.** Line 46: every question gets a recommendation and a one-line reason;
  "approval loop" becomes plain words.
- **C16.** Lines 75, 77, 177: remove "(or CLAUDE.md in a project still in the old
  layout)".
- **C17.** Line 76: "whatever decision log the project declares" becomes the work
  item's decision rows and project-wide memory.
- **C18.** Line 80: "tracker upkeep guidance" and "canonical record" become the
  work track skill and the work item.
- **C19.** Line 89: "The non-negotiables" becomes "These rules always apply".
- **C20.** Line 94: help.salesforce.com pages open in the Playwright browser;
  with no browser, ask you to paste the page.
- **C21.** Line 103: "when the call is close" becomes a yes-or-no test on the
  decision tree.
- **C22.** Line 140: the Well-Architected pillar notes become a stated judgment
  call.
- **C23.** Line 162 (and line 28 and the plan template line 171): `sf-develop`
  becomes `work-on`.
- **C24.** Line 174: "Sources or it didn't happen" becomes "Cite a source for
  every platform claim".
- **C25.** Line 175: "not just the current state" becomes "not only today's
  volumes".
- **C26.** Line 178: "Hand off cleanly" says the build still needs your own yes.

`sf-component-tracker` (3.25):

- **C27.** Line 10: "another artifact root" becomes plain words.
- **C28.** Line 25: the folder tree shows the two template folders and when a
  release folder is made.
- **C29.** Lines 30, 112, 131: "tracker" meaning the work tracker becomes "work
  tracker".
- **C30.** Line 31: "The tracker owns status" becomes which tracker holds what.
- **C31.** Line 73: permission set flags are set like any other component's.
- **C32.** Lines 77 and 106: "sheet" becomes `manual-steps.md`.
- **C33.** Line 89: the pre-deploy snapshot becomes a stated judgment call.
- **C34.** Line 108: a manual step's status may also be "skipped".
- **C35.** Line 113: the person or team in each step's Owner field runs that
  step and updates its status.
- **C36.** Lines 118 and 177: "task list" and "work log" become the work item's
  Tasks and Recent History.
- **C37.** Line 141: "lands" becomes "succeeds".
- **C38.** Lines 135 and 157: "current state" becomes "as it is now".

`sf-data-change` (3.26):

- **C39.** Line 8: "going back and forth" becomes "asking follow-up questions".
- **C40.** Line 19: says plainly that no agent writes production data.
- **C41.** Lines 24 and 27: a backup for updates, upserts, and deletes, and undo
  steps for an insert.
- **C42.** Line 38: a project that already uses `engagement/` keeps it.
- **C43.** Line 56: "backup pointer" and "seed record" become plain words; no
  separate record for the event.
- **C44.** Line 57: the ignored-files check runs before the first data change in
  a project.
- **C45.** Line 67: the manual-step rule is stated correctly, and the snapshot is
  credited to `sf-component-tracker`.

`sf-deploy-check` (3.27):

- **C46.** Line 16: "a shared or higher org" becomes a shared org, with examples.
- **C47.** Line 26: which commit to compare against, and what to do when no
  record names it.
- **C48.** Lines 28 and 29: "rides into" and "rider" become plain words.
- **C49.** Line 39: the story about one past deploy becomes one rule.

## 5. Dropped findings

A verifier threw these out. One line each: where, and why.

### Overlap (3)

- **"can you simplify that" / "simpler" (explain-simply, the built-in
  simplify skill):** Mike never says these words (checked in about 2,900 of
  his messages), no two project skills match today, and the new text would
  have removed "less jargon", a phrase added because a routing test failed.
- **"add a Region picklist field to Account for WI-031" (sf-component-tracker,
  work-on):** "Use first, before work-on" already sets the order and passed
  routing round 3 in both hosts; the new why clause would have copied
  `sf-deploy-check`'s job (its safer clause is used in 2.30).
- **A list of every skill and outside skill for the next review:** a
  documentation note, not an overlap; the routing test already has such a
  list (`dev/test-runs/v2-skills-first/routing-requests.md`, List 2). Three
  small doc errors it found can go in a separate one-line edit: O7 in
  `overlap-review.md` points at the wrong list, `dev/SKILL-INDEX.md` section 3
  says the set descriptions "end" with "Only for" (they do not), and section 8
  is missing the `work-finish` and `merge-and-clean-up` pair.

### Wording (34)

Shared sources (`dev/build-shared/`):

- `approvals.md` line 141 (a Q-ID in the Design approved line): contradicts
  four other places that write only the date and name; needs one fix across
  all of them, or a question.
- `approvals.md` line 238 (the bulk-yes row): the gap is real, but the new
  row format contradicts the examples in `work-refine` and `work-finish` and
  Mike's rule `keep-work-item-current.md`; fix them together.
- `decisions-and-memory.md` line 85 (when a save question counts as
  unanswered): the new trigger loses the case where the session ends before
  he replies.
- `decisions-and-memory.md` line 147 ("column" or "property"): the same Notion
  field under two common words; no agent acts differently.
- `writing-a-project-skill.md` line 61: the line has one meaning; the change
  is a small fact correction, not clearly better.

Helper briefs:

- `builder.md` line 16: the new words contradict `work-delegate`'s own rule
  for starting builders.
- `builder.md` line 43: both readings lead to the same action, and the new
  word "all" conflicts with "start only as many builders as you can check".
- `builder.md` line 81: the fix picks the reading the skill does not support
  (the skill stops the task).
- `design-critic.md` line 44: the gap is real, but the new text makes the
  critic's check compare a section with itself; the writer must name the
  right source.
- `design-critic.md` line 75: "weak" was guessed to mean "wrong"; the writer
  should define it.
- `design-critic.md` line 121: the new meaning of "important" would let a
  draft with open writing problems count as Clean.
- `researcher.md` line 101: "grouped as the question needs" is a choice left
  open on purpose; fixed headings would change the meaning.

project-setup:

- `SKILL.md` line 96, `references/interview.md` line 37, and
  `references/update.md` line 24 (rename "main checkout" to "primary
  checkout"): the model itself uses both names, so the rename swaps one
  mismatch for another; it waits for question B32.
- `references/finishing.md` line 45 ("never add made-up questions"): the new
  rule conflicts with item 3 of the same section and with other lines that
  say to ask when unsure; only the writer can say which reading was meant.

braindump:

- `SKILL.md` line 53 (which messages count as the dump): the new text loses
  part of the rule and fails the one-meaning check itself.

solution-design:

- `SKILL.md` line 51 and `references/design-process.md` line 107 ("a real
  choice"): the new test is true for almost every item, so it changes when
  one option is written; that is a meaning change, not wording.
- `assets/DESIGN.md` line 9 (the order of updates): "and" sets no order, and
  the skill's own rule fits inside it; too weak to ask Mike.
- `assets/DESIGN.md` line 17 (discussion in Notes): the template already
  agrees with the skill, and the fix would drop non-question discussion from
  Notes.

work-refine:

- `SKILL.md` line 51 (`delivery/` or `engagement/`): the model's always-on
  rule `project-file-locations.md` already maps the path; adding it here only
  would make this skill differ from the others.
- `references/interview.md` line 110 ("sitting"): a common English word, and
  the new definition adds a new unclear case (a conversation past midnight).

github-work-track:

- `references/items.md` line 176 (when a Recent History row is added): the
  new "add no row for anything else" clashes with other steps in the same
  file that add rows; the writer should redo it to match the shared source.

local-memory-find:

- `SKILL.md` line 3 ("rest on"): changing one of five matching find
  descriptions alone breaks their shared wording; all five change together in
  2.9 and 2.22 instead.

local-work-track:

- `references/items.md` line 173 ("not obvious"): the new words are just as
  vague and do not say the agent decides; fix it once at the shared source.
- `references/items.md` line 282 ("sitting"): renaming it here gives one row
  two names, because `work-refine` keeps "sitting".
- `assets/WORK-ITEM.md` line 19 ("source of truth"): one meaning to an agent,
  and the new words drop part of it.

notion-work:

- `notion-work-find/references/queries.md` line 83 (what is next): the fix
  sorts items in an order that contradicts the one `work-on` uses; the right
  fix copies the local order, which is a bigger change.
- `notion-work-track/references/items.md` line 105 ("not obvious"): would put
  two different rules in one file; fix it at the shared source first.
- `notion-work-track/references/items.md` line 185 ("sitting"): the same
  rename problem as in `local-work-track`.
- `notion-work-find/SKILL.md` line 38 and `references/queries.md` line 178
  (when to give a link): the fix picks the narrow reading without evidence;
  if wanted, ask Mike which he prefers and change the four matching lines
  together.

sf-component-tracker:

- `SKILL.md` line 66 ("today"): not a one-meaning problem, and removing the
  word drops a real fact (the list may change).


# Toolkit V2: goal and settled decisions

Mike's goal, set 2026-09-26. This file is the single place the goal and his
answers live. Update it when he changes a decision.

## Goal and finish list (approved by Mike, 2026-09-29: "Okay, yeah, that's great")

Test scenarios (Mike, 2026-09-29, with the approval): the test projects
simulate real, large features, and an agent plays the owner, so the agent
under test interviews him, helps "get the thoughts out of your head", and
refines a rough idea while he changes things along the way. Mike's words:
"start with like one large feature that you would need to break down";
"setting up the whole security and permissions architecture in like a large
greenfield org for a client ... the client is going to move from their
existing org to a new greenfield org ... they have like 15 different
personas ... should all those personas be moved over or should we merge
some"; and "the whole like end-to-end process of ... the user's experience
for an iOS application for ... how they would log financial transactions".
Each run initializes the project, refines the rough idea, breaks it into
work items, makes decisions, and progresses the items, with requirement
shifts, changed roadmap phases, and work moved along the way. The check:
"does everything sort of fit cleanly".

- Salesforce greenfield security and permissions (15 personas, merge or
  move): local + Obsidian work, local memory, Salesforce, in Claude Code
  and Codex; again, shorter, with Notion work and local memory.
- iOS app, logging financial transactions end to end: Notion work, Notion
  memory, in Claude Code and Codex; again, shorter, with GitHub Issues work
  and Hindsight memory.

This replaces the 11 finish items at the bottom of this file. The design is
`dev/research/skills-first-architecture.md` (draft 2) with the answers in
"Interview answers" below; the work is tracked in
https://github.com/Mar5929/toolkit-v2/issues/1.

**Goal.** Build Toolkit V2 as rules, skills, and a few small hooks, with no
custom program, and prove it with real test projects in Claude Code and
Codex. A new project set up by onboarding matches Mike's model plus the
skill sets and hooks for his choices, and the agent then runs the project
while Mike only decides.

**Code limit** (replaces "about 15 to 30 lines each", which the agent had
written in; Mike, 2026-09-30: "go with your recommendations"). The only code
a project runs is the three hook commands (session-start, prompt-reminder,
codex-after-commit) and, in a Salesforce project, the model's own
Salesforce code (its two guards, its graph Stop hook, and the scripts in
`tools/`), kept as Mike's model has it. Each hook command
does one job; can never break a session (on any error it prints one line
and exits normally); needs nothing installed beyond Node; is covered by
tests; and stays short enough to read in one sitting. A new command, or a
new job for one, needs Mike's yes first, with its size in plain numbers.

**Finish items.** The goal is met only when each item is shown in the chat
with real proof (command output, file listings, screenshots, or links).

1. **Old program switched off, then removed.** With Mike's yes, the
   everyday install is undone using `dev/test-runs/install-everyday.md`, so
   no session on the Mac runs the old hooks. Then `plugins/toolkit/lib`, its
   tests, the `toolkit` command, `publish-docs.mjs`, and
   `sync-skill-references.mjs` are deleted.
2. **Model updated.** On the model branch, the approved changes are made:
   the folder renames, `WI-031.md` file names, Current State, Questions and
   Answers, Sources and `references/`, the decision record template,
   `DECISIONS.md` and `.toolkit.json` removed, the routing and citing lines,
   and the rewrite of every line that names the old program. Mike gets one
   list of every changed file with the reason, before he merges.
3. **Skills built.** Every skill in draft 2 section 4 is a folder with its
   references, templates, and examples, written from the official Anthropic
   and OpenAI docs or the skill-creator skill. Every description says what,
   why, and when. `claude plugin validate` passes.
4. **No overlap.** A routing test of about 20 owner requests, 3 runs each,
   in both hosts, picks the right skill every time, after fixes.
5. **Onboarding works** for each test setup: the new project holds the model
   files, the chosen skill sets (Codex's skill folder linked to Claude
   Code's), the hooks, the filled `AGENTS.md`, and nothing from an option
   not chosen.
6. **Hooks seen working.** Every hook in draft 2 section 6 is seen firing in
   a real Claude Code session, and every Codex row in a real Codex session,
   including from inside a git worktree. The end-of-reply check's false
   alarms are counted and Mike decides whether it stays. (Mike dropped the
   end-of-reply check on 2026-10-01; see "Interview answers", Morning
   answers.)
7. **Test projects run end to end**, Claude Code sessions one at a time:
   - local + Obsidian work, local memory, Salesforce (Claude Code and Codex);
   - Notion work, Notion memory (Claude Code and Codex), in the private
     Notion test area;
   - GitHub Issues work, Hindsight memory (a private test repository,
     created after Mike's final yes);
   - Notion work, local memory.
   Each takes one work item from a rough idea and a meeting transcript,
   through `work-refine`, a sub-item, a design, a build, the independent
   check, and Mike's Done, with a file moved by hand. Decisions land in the
   item; project-wide ones also in memory; memory and work item links work
   (clickable in Obsidian and Notion, tags in Hindsight).
8. **Memory tests pass:** a fresh session resumes from Current State, a
   corrected fact replaces the old one, the agent says "I don't know"
   instead of guessing, nothing leaks between projects, and old entries
   leave Current State.
9. **Notion checks pass:** the Notion session's six behaviors, and bringing
   an existing Notion project up to a changed template.
10. **Independent review** of the whole build finds no blocking issue, and
    every finding is fixed or put to Mike.
11. **Report.** Mike gets a short plain report: what works, what was tested,
    and what is still open. Issue #1 is updated with the results.

Not in this goal: Jira (deferred by Mike), the 16 rules questions and 13
model-review items (a later short list), and deleting test data (Mike's yes
first).

## Direction change (Mike, 2026-09-29): skills and timely hooks, no custom program

This overrides how the rest of this file says Toolkit V2 is built, and it
replaces the 11 finish items below. A new goal and finish list follow once
Mike approves the architecture. His words (lightly edited; the exact message, 13:28 EDT, is in `dev/HISTORY.md`):

"We should just switch to skills and timely hooks. You need to map out work
tracking, progressing work through different stages, and memory saving and
memory recalling. You need to define, throughout the lifecycle of a chat
session that I have with an agent, when certain hooks are supposed to invoke
certain skills. The skills need to have perfectly defined descriptions. I
told you this in the beginning: we're just using out-of-the-box stuff. If I
overengineer this and you write all the scripts and custom code, trying to
change anything is a nightmare. You just need to have skills for Notion work
tracking, Notion memory, or shared rules, but just separate storage. Work
with [the Notion work tracker refinement session] on this architecture and
also make sure that the Notion Lore memory system (if we store memory in
Notion) can backlink memories, facts, entities, etc. to work items. They
don't HAVE to be related to work items but this way we can traverse back to
get physical links to the work items. Same with the local setup + Obsidian,
same concept."

What this means:
- Toolkit V2 is rules, skills, and hooks, using each tool's own features
  (files and Obsidian for local, Notion and its own command or connector,
  Hindsight's own interface). The large `toolkit` program (about 37,000
  lines in `plugins/toolkit/lib`) is retired, apart from whatever small hook
  step cannot be done any other way.
- Setup installs only the skills for the choices made (tracker, memory,
  Salesforce). The shared rules are the same in every project.
- A map of the chat session's lifecycle says which hook fires when, and which
  skill it points the agent to.
- Memories, facts, entities, and decisions can link to work items (not
  required), so every work item can be reached from its memories: Notion
  relations in Lore's layout, and links between notes in local memory with
  Obsidian.
- Decisions made earlier today still hold: decisions live in memory, cite
  recalled knowledge, approvals stay on the work item, no backup folder.

Corrections (Mike, 2026-09-29, after the first two diagrams):
- Every storage option is built; the agent does not defer any. Work
  tracking: local folders with Obsidian, Notion, GitHub Issues, Jira.
  Memory: local with Obsidian, Notion in Lore's layout, Hindsight. (The
  agent had marked GitHub and Hindsight "later" on its own; Mike: "You just
  made a decision that we're going to do GitHub later, in hindsight. I don't
  know why you just randomly decided that.")
- One set of skills per storage option, and onboarding brings in only the
  chosen sets with their hooks. His words (lightly edited; exact text in `dev/HISTORY.md`): "We build out all those skills,
  and then the project just brings in whatever skills we need. If we're
  tracking the memory and work tracking in Notion, you bring in the Notion
  memory save skills and Notion work tracking skills. If we're just doing it
  locally, you do the local memory save skills and the local work tracking
  skills, both with Obsidian. If we're doing Hindsight, we do the Hindsight
  ones. We do an onboarding, and then we bring in the right skills and the
  right hooks." Each set's skills hold the instructions for that tool (for
  Notion: how to use the Notion CLI), its templates and fields, and
  descriptions that say which project setup they are for.
- Session start loads the current focus ("When the session starts, it should
  load in the current focus, like we discussed").
- Hooks fire by themselves at set moments; skills are instructions the agent
  picks by their description.
- The local memory module keeps the Davis shape of Mike's original model
  (efa2440; package at /Users/michaelrihm/Downloads/davis-memory-system-package):
  `CLAUDE.md` imports `.memory/MEMORY.md` and `.memory/CURRENT_FOCUS.md`, a
  SessionStart hook (`.claude/hooks/toolkit-session-start.mjs`, 23 lines), a
  UserPromptSubmit trigger (`memory_trigger.py`, 62 lines), and a Stop audit
  (`memory_audit.py`, 73 lines). Mike (lightly edited; exact text in `dev/HISTORY.md` section 2.3): "Doesn't the local memory system
  already have specific hooks? ... it's still that general shape if we do the
  local memory system, right?" The approved changes had replaced these with
  the `toolkit` program. Whether `scripts/memory.py` (505 lines) stays is
  open. Notion and Hindsight modules get the same hook moments in their own
  versions.
- Name (Mike, 2026-09-29): "I want the memory skill to be called
  memory-refine." Read as: the skill that was `memory-tidy` becomes
  `memory-refine` (per storage set, for example `notion-memory-refine`).
  Mike to correct if he meant a different skill.
- Marking Done (Mike, 2026-09-29, on "a written rule, with the item's history
  quoting your words"): "that's fine. I should be able to mark a work item
  done, right? It should ask me." The agent asks Mike before it marks an item
  Done and records his words and the date in the item's history; Mike can
  also mark an item Done himself. A written rule, no hook.
- Guidance for building skills and hooks (Mike, 2026-09-29): give the
  official URLs for Claude Code best practices, or use the skill-creator
  skill. A skill is a folder, not one `SKILL.md`: it holds references,
  templates, examples, and full instruction files, for example how to use
  the Notion CLI, what to sign in as, and which fields and templates to use.
- Save the Excalidraw diagrams, enrich them where something is missing, and
  include them in the handoff (Mike, 2026-09-29).
- The next agent must know the whole history (Mike, 2026-09-29): "It needs
  to know not to overengineer this. It needs to know all the history of
  everything that we went through in this whole chat session and work item.
  It needs to preserve and read up on all that history. It needs to know
  everything: all the templates and all the decisions we made." The history
  is written to `dev/HISTORY.md`, and the handoff tells the next agent to
  read it first.
- A GitHub ticket for this work (Mike, 2026-09-29): "After the Excalidraw
  diagrams are refined, you need to show them to me, and then, once I
  approve, we need to add them to the body of the GitHub issue to tackle
  this. ... We need to rewrite the ticket to make sure that everything we
  just talked about is all included in there." Today Toolkit V2 has no
  GitHub issue of its own: it is tracked in `dev/GOAL.md` and
  `dev/PROGRESS.md` in this local repository (no GitHub remote), with one
  progress-log note on the related issue Mar5929/claude-toolkit#419. Where
  the ticket lives is Mike's call; creating a GitHub repository needs his yes.
- Mixed setups are allowed (Mike, 2026-09-29, "ok" to the recommendation):
  onboarding brings in one work tracking set and one memory set separately,
  so any mix works (for example local memory with Notion work tracking). A
  memory always stores the work item's ID, plus the Notion page link when
  the work items live in Notion (clickable from Obsidian); a Notion memory
  that points at a local work item stores the ID as text.
- The next session interviews Mike first (Mike, 2026-09-29: "make sure the
  new agent will read all context and interview me to make sure it fully
  understands"): after reading everything, it plays back its understanding
  one topic at a time and asks him to confirm or correct each, before any
  design or build work.

Interview answers (Mike, 2026-09-29, the interview session):
- Topic 1, the goal: confirmed ("bingo nice job").
- Topic 2, approved refinements stay: every change Mike approved to the
  model and the memory formats stays (the 23 approved changes, concept
  memory, the four prefixes, the rules, skills, and memory split, decisions
  in memory). "The model is the exact source" means the model with those
  approved changes.
- The Davis shape is general, not literal. Mike: "don't take it super
  literally, meaning we're going to bring back the Claude.md file instead of
  agents.md, right? We're not doing that, but just the overall, general
  shape, I guess, makes sense if we're going to do local memory." Keep the
  decisions made since: "one Markdown file per concept", and links between
  work items, decisions, memories, and facts.
- Current focus is current state, and it gets cleaned up. Mike: "current
  focus should be current state. ... I think it does it well, meaning that it
  knows when to keep it up to date, but the problem, I think, with the Davis
  project is that it just doesn't know when to clean it up and remove old
  stuff. Just make sure that you're accounting for that in your solution."
- Topic 3, onboarding: confirmed ("yes"), with `PROJECT-ROADMAP.md` in the
  list of files every project gets (Mike asked "What about project
  roadmap.md?"; it was left out of the playback by mistake).
- Topic 4, work tracking sets: confirmed ("Yes, this is great"), with one
  note. In Notion the work item page can be more dynamic: "the roadmap
  section of the work item.md, the tasks, and the phases can be a dynamic
  view of the related sub-work items, grouped into their phases, and show
  the whole roadmap. ... the overall shape and structure of the work item.md
  and the design.md will be the same." Notion and external trackers have
  comments; a local work item uses its Notes and Recent History sections
  instead. The Notion session is working this out with Mike.
- Topic 5, memory sets: confirmed ("Perfect"). memory-refine is the skill
  that used to be memory-tidy (Mike: "When I said 'memory refine,' I meant
  the skill that used to be 'memory tidy.'"). It also clears old entries from
  Current State.
- No overlap, no traps (Mike, 2026-09-29): "Make sure that the agents
  building are referencing official Anthropic and OpenAI documentation about
  how to set up skills, hooks, and rules, and how things get loaded into
  context for each of those harnesses. Make sure that, in the descriptions of
  all the skills, all the hooks, and everything that is built, there is no
  overlap where the agent can get confused or stuck. There are no landmines
  that would trip the agent up ... Everything needs to be crystal clear about
  the descriptions so the agent knows exactly when to invoke what."
- Topic 6, when hooks fire: confirmed ("Yes") with two changes Mike asked
  for. (1) The "remember" reminder listens for Davis's full phrase list
  (`efa2440:.claude/hooks/_memory_patterns.py`, 11 groups: remember,
  forget, save or correct memory, corrections, standing preferences, people
  changes, focus changes, tool or vendor changes, moved references, current
  work, lessons) plus decision phrases ("we decided", "let's go with", "go
  with option"). The reminder is a hint; the memory save skill decides.
  (2) After each commit, a hook reminds the agent to update the work item's
  history and status, and Current State if it changed (work track skill).
  Documentation to reference, from Mike:
  https://code.claude.com/docs/en/agent-sdk/hooks and
  https://code.claude.com/docs/en/hooks-guide, plus the OpenAI Codex pages.
- Topic 7, what is inside a skill: confirmed ("Yes, that's correct"),
  including the Notion session's two points (the Notion templates are a
  Notion page template plus `DESIGN.md`; the sign-in reference says pages
  are shared with the "Notion CLI" connection and `ntn` runs outside the
  Codex sandbox).
- New request, not designed yet (Mike, 2026-09-29): a skill for refining a
  work item through an interview, saving each answer as it is given. His
  words: "I use Claude Code or Codex frequently ... to help design the
  roadmap for an entire work item, an epic, or a large piece of work. I try
  to feed in meeting transcripts, other resources, references, and
  documents, and try to make sense of everything and store a bunch of that
  stuff as references for the work item." "It's crucial that the agent
  knows, as a new requirement comes up, as the agent is interviewing me ...
  the agent just needs to save things as I answer." "I'm asking the agent to
  help me refine my idea and help me figure out things that I didn't think
  of: what are some gotchas, and what should I be thinking about?" "Just
  keep it in that file, because normally they're large pieces of work that
  are spanning multiple days ... I can come back day after day in a new
  session and just pick up exactly where I left off." "almost every work
  item is going to go through this process of the agent interviewing me, me
  answering, and just as I'm answering, boom, record it and ask me the next
  question." He likes how this session keeps `dev/GOAL.md` and records each
  question and answer.
  Mike agreed to design this as interview topic 13, after topics 8 to 12
  ("I like your recommendation, but we can get back to it on topic 13").
  The old session skills `requirements-helper` and `grill-me` are retired
  and folded into this new skill (Mike: "the older session skills can just
  be retired and deleted and moved into this new one"). spec-check,
  work-guide, and track-tasks are still open.
- Topic 8, decisions and citing: decisions change as follows (Mike, "yes
  love that", to the agent's proposal after he said "I probably would want
  the decisions just to be persisted right in the work item.md ... and then
  we could also say, 'Is this something that's significant enough to be a
  general memory?' ... I feel like a memory decision is sort of
  project-wide, like architectural stuff"):
  - Every decision made while working an item is saved right away in that
    item's `WORK-ITEM.md` (or the item's page in another tracker), with
    Mike's words and the date. Always.
  - A decision also becomes a memory record only when it matters beyond the
    item. Test: "Will a later work item, or an agent working on something
    else, need to follow this?" Project-wide and architectural decisions:
    yes. Item-only choices: no.
  - The agent asks "This looks project-wide. Save it to memory too?" when a
    decision looks project-wide, and once more over the item's decisions
    when the item finishes.
  - The memory record holds the decision in one sentence plus how to apply
    it, and links back to the item for the full reasoning (no full copy).
  - This replaces "every decision is one memory record" in "Decisions live
    in memory" below. `DECISIONS.md` stays removed.
  - Mike: "make sure the skills mention that and any relevant corresponding
    instruction/rule files for codex and claude."
  Citing recalled knowledge, as already settled, confirmed.
- Topic 9, Done and approvals: confirmed ("Yeah I think that is right").
  The agent raised that local `.work-items/` and `.memory/` are kept out of
  Git, so they exist only on this Mac, and offered one onboarding line about
  Time Machine or iCloud. Mike: "no don't need the onboarding line". No
  backup folder and no backup line.
- Topic 10, mixed setups: confirmed ("cool good. go with your
  recommendations"). Any mix works; every memory stores the work item ID;
  a two-way Notion relation when both are in Notion; the Notion page link
  when only the work items are in Notion; onboarding suggests Notion memory
  when Mike picks Notion work tracking. Added: when a work item has a web
  address (a GitHub issue or a Jira ticket), the memory also stores that
  link.
- Topic 11, the Notion session: confirmed ("good by me!"). The Notion
  session builds everything inside Notion, including the properties,
  relations, and the linked-memory view between memories and work items.
  This session owns the overall design, onboarding, hooks, shared rules and
  skills, the memory rules, and the local, GitHub, Jira, and Hindsight sets,
  and writes the rules for when a link is filled in. It sends the Notion
  session one update after the interview and reads its chat to confirm
  receipt. Tasks as a Notion database or as a checklist in the body: follow
  what Mike settles with the Notion session.
- Topic 12, the GitHub ticket and diagrams: confirmed ("yes coorect").
  Topics 1 to 12 of the playback are done.
- Topic 13, piece 1 (Mike: "Yeah I think that makes sense"): in
  `WORK-ITEM.md`, "Open Questions" becomes "Questions and Answers", with two
  added columns: the owner's answer in his words, and the date. Every
  question the agent asks gets a row; the agent fills the answer as soon as
  Mike gives it, updates the goal or requirement it affects, and asks the
  next question. A row that decides something is marked as a decision; the
  item's decisions are those rows (project-wide ones also go to memory, per
  topic 8). Unanswered rows stay at the top, so a new session resumes at the
  first open question. Recent History logs progress and names the Q-ID
  instead of repeating the decision. This is an approved model change.
- Topic 13, pieces 2 and 3 (Mike: "perfect"): source material (meeting
  transcripts, documents) goes in a `references/` folder inside each local
  work item folder (kept out of Git with `.work-items/`), or as attachments
  on the Notion page, GitHub issue, or Jira ticket; the item has a short
  "Sources" list, one line per file (what it is, what was taken from it);
  anything drawn from a source cites it. Questions and Answers moves down,
  just above Notes; section order: Overview, Roadmap, Tasks, Recent History,
  Requirements, Questions and Answers, Notes. No folding markup: Obsidian
  folds headings itself, and the Notion template uses a toggle heading. The
  Overview's "Next action" names the next open question.
- Topic 13, piece 4 (Mike: "one skill"): the shared "requirements" skill
  and the refinement skill are one skill, `work-refine` (working name). It
  takes an item from a rough idea to approved requirements and a roadmap:
  reads the sources, interviews one question at a time with a
  recommendation, names gotchas and what Mike has not thought of, saves each
  answer at once, and resumes at the first open question in a new session.
- Interview finished (Mike, 2026-09-29): "I feel like you understand."
  Next: the open questions, one at a time.
- Open question 1, Obsidian folders (Mike: "a"): open the whole project
  folder as the Obsidian vault; rename `.memory/` to `memory/` and
  `.work-items/` to `work-items/` (both still kept out of Git); name each
  item's main file by its ID (for example `WI-031.md`) instead of
  `WORK-ITEM.md`. Memories hold clickable links such as `[[WI-031]]`, and each
  work item shows its memories in Obsidian's backlinks panel. Obsidian's
  `.obsidian/` folder is kept out of Git. Approved model change; every rule
  and skill naming those folders changes with it.
- Open question 2, rewriting old model text (Mike: "yes"): the agent
  rewrites, on the model branch `toolkit-v2/approved-changes` only (never
  Mike's own model folder), the lines that name the removed program,
  `.toolkit.json`, or `DECISIONS.md` (about 62 lines in 14 files), plus the
  changes approved today (Current State, folder names, ID file names,
  Questions and Answers). Each line keeps its meaning apart from approved
  changes. Mike gets one list of every file, what changed, and why, before
  he merges. A change to what a rule means waits for his yes.
- Open question 3, `scripts/memory.py` (Mike: "Yeah, yeah."): the 505-line
  Davis script is left out; the local memory skills edit the Markdown files
  directly. Mike raised that having an LLM rewrite the index is expensive
  ("Having the index rewritten by an LLM is quite expensive, right?"), so
  `MEMORY.md` becomes a generated file: the session-start hook reads each
  memory file's title, one-line summary, and updated date and writes the
  index, grouped by prefix, in both hosts (a very small command, about 20 to
  30 lines; it replaces LLM edits and cannot drift). `local-memory-save`
  never touches the index; nobody edits it by hand.
- Open question 4A, standing merge permission (Mike: "yes"): it lives in
  the project's `.claude/rules/owner-preferences.md`;
  `shared-repository-work.md` line 30 becomes "A standing merge instruction
  in `owner-preferences.md` counts."
- Open question 4B, bulk approvals (Mike: "yes"): a "yes to all" is saved
  as one row per item in the work item's Questions and Answers, each with
  the item, the reason Mike was shown ("reason shown: none" when there was
  none), his words, and the date; project-wide ones also go to memory.
  Every item in a list shown to Mike carries a one-line reason.
- Hindsight memory set (Mike, 2026-09-29, on draft 2): no
  `hindsight-memory-save`, `-find`, or `-refine` skills. Mike: "Yeah, I would
  drop them." "Hindsight has its own complete way. It's a whole memory
  engine, so we can't guide it. We can't change its schema, so to speak. I
  don't know if we could tag each memory with a work item." A Hindsight
  project uses Hindsight's own tools (retain, recall, reflect). Still to
  check by research: work item tags, and whether Hindsight has its own
  short-term memory like Current State. Hindsight's `hindsight-coding-agents`
  add-on is not used (Cloud by default, machine-wide settings, saves whole
  transcripts without asking).
- Hindsight research answered (2026-09-29): `retain` takes free-text tags
  (for example `wi:WI-031`) and `recall` and `list_memories` filter by them,
  using a strict match so untagged memories are left out; Hindsight has no
  short-term memory of its own. Current State in a Hindsight project (Mike:
  "just go with your recommendations", the agent's recommendation A): a
  small local file, `memory/CURRENT_STATE.md`, printed by the session-start
  hook even when the Hindsight server is off, and kept out of Hindsight's
  long-term search. Reason shown: it works with the server off and keeps
  old status notes out of search results.
- Draft 2 answers (Mike, 2026-09-29: "I think I approved the diagrams";
  "we could copy the skills into each project. That's fine"; "I would go
  through recommendations for all of them"). Each item with the reason he
  was shown:
  - The three diagrams (redrawn 2026-09-29) are approved. Reason shown: they
    match everything decided today.
  - Skills are copied into each project; only onboarding is a machine-wide
    plugin. Reason shown: the Codex IDE extension loads no plugins, and
    plugin hooks would fire in every project.
  - One copy of each skill: the real files in `.claude/skills/`, and
    `.agents/skills/` a link to that folder (Mike, after it was explained:
    "Go with your recommendations"). Reason shown: one set of files, so a
    fix reaches both hosts; Codex follows linked folders. If the test
    projects show a problem, two copies instead.
  - `work-decide` joins `work-status`; `work-organize` is split between the
    track skills and `work-on`. Reason shown: three skills claimed "what do
    you need from me".
  - Project-wide decisions in local memory are `decision_<name>.md` files, a
    fifth prefix. Reason shown: each decision gets its own ID, work item
    links, and history, and they are easy to list.
  - Helper agents are brief files inside the skill that starts them. Reason
    shown: nothing to register; the same in both hosts.
  - `.toolkit.json` is removed; its settings go to a "Toolkit settings"
    section in `PROJECT.md`. Reason shown: one file fewer, project facts in
    one place.
  - `spec-check`, `work-guide`, and `track-tasks` are retired, folded into
    `work-refine`, `AGENTS.md`, and Current State. Reason shown: each job is
    covered elsewhere, and fewer skills overlap less.
  - The everyday install of the old program is switched off, with the
    written undo steps, before the program is deleted. Reason shown:
    otherwise every Claude Code session on the Mac gets hook errors.
  - A private GitHub test repository for test project 3 (the agent confirms
    once more right before creating it).
  - Jira: no test, and the Jira skills may wait. Mike: "I don't have a Jira
    test account ... we don't need to test Jira ... we probably don't even
    need to create the skills right now. It could just maybe be like a
    future thing." This is Mike's own call; Jira is deferred.
  - Later, as a separate list: the 16 rules questions, the 13 model-review
    items, and the test data to delete.
- The GitHub ticket (Mike, 2026-09-29: "Yeah, go with your
  recommendation"): merge today's work into `main`, create the private
  repository `Mar5929/toolkit-v2`, push `main`, and open issue #1 "Toolkit
  V2: skills-first rebuild" holding the goal, the decisions, and the three
  diagrams, linked to `Mar5929/claude-toolkit#419` (whose body stays as it
  is). Reason shown: the pictures live in the repository so the issue can
  show them; `claude-toolkit` stays unchanged.
- `unslop` is retired (Mike, 2026-09-29: "I don't think we need the unslop
  skill anymore").
- A current state for each work item (Mike, 2026-09-30, not decided yet):
  "I feel like work items definitely need a current state sort of tracker.
  I'm not sure if that should be separate from the work item.md or separate
  from the description of the work item. We'd have to think about that
  really, really hard and make sure that this is a sound decision ... I'm
  not sure if that's a separate state.md file that sits alongside the work
  item, or if, in Notion, it would be sort of a subpage within the work item
  itself. Or if we just want to maybe have the agent keep a current state in
  the description ... and add ... to the template, if it doesn't already
  handle that."
  Decided (Mike, 2026-09-30: "go with your recommendation"): the current
  state lives inside the work item, at the top. The Overview's middle part
  becomes a "Current state" block with fixed lines (Where it stands, Next
  action, Waiting on, Blockers, Last updated), rewritten in place after each
  step, never appended to; history goes to Recent History; it has line
  limits; the Notes "Resume here" subsection is removed and folded into it.
  No separate STATE.md and no Notion subpage. The project Current State keeps
  one line per active item pointing to it. Reason shown: one place, the
  first thing an agent and Mike see, no duplication with "Resume here".
- Notion property order (Mike, 2026-09-30): "all the properties on page
  layouts and stuff, and Kanban boards with their statuses, should be sorted
  in the right way. Right now, I see created date as a property at the very
  top of the page, and that doesn't really make sense. All the properties
  should be grouped in ways that make sense." Relayed to the Notion session,
  which proposes a grouped order, applies it in the test area, and shows
  Mike before anything is created in his real workspace.
- The hook size limit (Mike, 2026-09-30): "I didn't set that limit. I guess
  an AI set that limit of 15 to 30 lines each ... Does that limit make
  sense? Should we keep it?" True: the agent wrote "about 15 to 30 lines
  each" into the proposed goal (commit 86fe5ca) from its own estimate in
  draft 2 section 9. Mike's own words were about no custom code that can
  fail mid-project; the handoff said "a very small command". Decided (Mike,
  "go with your recommendations for each"): the line count is replaced by
  five rules (see "Code limit" at the top). Reason shown: a line count is a
  rough stand-in; the real risk, code failing mid-project, is covered by
  "never breaks a session" and the tests.
- Notion layout decisions (Mike, 2026-09-30, "go with your recommendations
  for each"): (1) the Notion session's grouped order is approved (Work Items:
  pinned ID, Status, Stage, Waiting on, Priority; sections Plan, About,
  Approvals, Links and files; hidden Phase order and Archived; the same
  approach for Phases, Tasks, Memories, Projects, Facts, Entities). Reason
  shown: what Mike checks most sits at the top, agent-only fields hidden.
  (2) The agent sets the layouts itself in the Notion app through Mike's own
  signed-in Chrome, in the private test area only, starting with the "work
  and memory" template and testing that a copy keeps the layout. Mike asked:
  "can you use Playwright, or whatever you recommend, to actually open up a
  browser ... and you can reorder things yourself". Reason: the API cannot
  set page layout (developers.notion.com property object reference;
  notion.com/help/layouts), and this saves Mike the clicks.
- Overnight test permissions (Mike, 2026-09-29, "Yes" to both): (1) create
  a throwaway private GitHub repository for the GitHub + Hindsight test
  project (for example `Mar5929/toolkit-v2-test-ios`); (2) run Codex test
  sessions in a separate scratch Codex setup that skips the hook-trust
  prompt for those test folders only (Codex's one-run switch), never
  touching his real Codex settings.
- Notion skill sets built and tested by the Notion session (commit 82aaaa6,
  copied into `claude/v2-build`); no Notion-app click is needed for new
  items. Waiting on Mike in the morning: one look at a test board for field
  and column order; his yes before the "Toolkit V2 templates" page is
  created in his real workspace; deleting the Notion test pages.
- Notion session reply (2026-09-29): no conflicts. Settled with Mike in that
  session: Phases and Tasks are Notion linked records (a database), not a
  checklist in the body (Mike: "Yes, linked records"; "we have a section
  that actually shows the tasks, and they're actual records"); a phase is
  still not a work item. In Notion, Questions and Answers stays a text table
  under a toggle heading, not a database, the same as `WORK-ITEM.md`.
- Rename: "I want the file name to be 'Current State' instead of 'Current
  Focus'." Read as: `.memory/CURRENT_FOCUS.md` becomes
  `.memory/CURRENT_STATE.md` (the model's naming style), and the Notion
  "Current focus" page becomes "Current state". This is a model change Mike
  asked for; it goes on the model branch with the other approved changes.
- Build from the official documentation. Mike: "use the Claude Code,
  Anthropic, and OpenAI codex documentation on how to build the harness, how
  to build hooks and skills and rules, and what the best practices, schema,
  and syntax are. You should be following all of that." Firecrawl may be
  used to get documentation; he also named "a new thing called Alexandria
  with Firecrawl" (not checked yet).
- Links between memory and work items: local memory links with Obsidian's
  own links, Notion with Notion's own relations. How to link is the agent's
  call, but the work item template must show the links. Mike: "we definitely
  want a view in the work item template to say, 'Hey, here's some physical
  link between them,' so it's easier for agents to navigate ... If the user
  asks a general question, the agent could search through memories and then
  go find relevant work items as well that are linked to it."
- The Notion session: keep it up to date on decisions and structure. Which
  session builds the rest of the Notion work tracker and the links, views,
  and properties between memory and work items is the agent's call (Mike:
  "I'm not sure how we should exactly leave it. Leave it up to you").
- When the product-owner and agent-team offer is made (Mike, 2026-09-30,
  "yes, go with your recommendation"): for a clearly large item, right after
  `work-refine` plays back his idea at the start of refinement; for an item
  that grows large later, when it does; `work-on` still checks once before
  building; small items never get it. A yes covers the whole goal
  (refinement research, design, build, check); Mike stays product owner and
  still approves the requirements, the design, and the result. Built as text
  in two skills only (`work-refine` and `work-delegate`'s
  `delivery-offer.md`), no code: Mike, "I don't want to build overly complex
  architecture ... with a bunch of custom code ... use out-of-the-box stuff
  as much as possible, like skills, hooks, instructions". Made after the
  stage 3 run, tested in stage 4.
- Voice-to-text (Mike, 2026-09-30): every project's `AGENTS.md` says he
  dictates most messages, and to ask one short question when a message is
  unclear before acting (model commit d9f61ef). He will review the model's
  `AGENTS.md` in full later.
- Reviewers for skill wording and descriptions (Mike, 2026-09-30): "As
  we're building, too, I want someone to be reviewing the skills to make
  sure, again, all the descriptions make sense. There's no overlap that
  could trip up an agent. We're trying to just keep things clean and clear.
  For any wording that we add within these skills, you need to have a
  reviewer to make sure that it's plain, clear, concise, with no jargon or
  figurative language. There shouldn't be anything that an agent could
  interpret differently every time unless it's intended to be interpreted
  differently every time." Built as a rule in `AGENTS.md` ("Wording and
  overlap review") with two checklists, `dev/reviews/wording-review.md` and
  `dev/reviews/overlap-review.md`, and a full review of every skill.
- Review question A6 settled (Mike, 2026-09-30): "You can uninstall those
  skills. I don't need them anymore, like the llm-council and impeccable
  skills." Removed from his machine the same day: the `impeccable` Claude
  Code plugin and its marketplace, `~/.claude/skills/llm-council`, and
  `~/.codex/skills/impeccable` (the two folders moved to
  `~/Documents/Projects/toolkit-v2-install-backup-2026-09-30/removed-skills/`).
  A second `llm-council` comes from his claude.ai account's skills
  (`~/.claude/skills/synced/`); it goes away only when turned off there. So
  the model's line 76 does not name either skill; review finding 2.14's new
  `solution-design` description still applies.
- Situation, not trigger words (Mike, 2026-09-30, on review question A7):
  "as the user, you can't expect me to remember all these key trigger
  words, right? This should not just become sort of a matrix grid of trigger
  words that I have to sort of remember, right? Again, we don't want to make
  this a hard-coded nightmare of just trigger words." Read as: the agent
  tells skills apart by where the work stands (the item's stage, what is
  open or waiting on him), never by special words he must say; example
  phrases in descriptions only help the host match. So A7 changes from
  "give me design options" to a situation line (an open interview question
  keeps "options" in `work-refine`; after requirements approval, options
  mean `solution-design`), and A2 (more words in the reminder hook's phrase
  list) is now recommended no. Added to `dev/reviews/overlap-review.md` as
  the principle and check O8; every review fix is checked against it before
  it is applied.
- Stepping back on routing (Mike, 2026-09-30): "Is this the right
  architecture? If you think about this holistically, is this the right
  approach? You should always be taking that sort of perspective of stepping
  back before we're about to design something technically." Proposal put to
  him: the work item says what's next (its Next action names the next
  skill; the main rule is to read Current state and do its Next action; the
  phrase routing lines shrink to a few examples kept as insurance). His
  answer: "have the independent reviewers check the idea against the docs
  and look for weak spots, and then bring it back to me and ask me first."
- `AGENTS.md` as a routing map (Mike, 2026-09-30, same answer): "couldn't the
  agents.md be a routing map, right? Under 200 lines, max 200 lines. We
  should definitely have: a map of the repository, maybe with a bullet point
  for each root-level repository folder; maybe some sub-bullet points for
  some of their critical subfolders under those; maybe a couple sentences
  about what should be stored in there and when. Outside of that, we should
  have any project-specific things that are very critical that the agent
  needs to know every time ... definitely the routing map and a couple
  sentences per critical folder, so the agent knows what information goes
  where and when and why. Under 200 lines, or max, absolutely max, 250. It
  should keep just a brief sentence about what the agent should read on
  startup. It should definitely list out the skills that are going to be
  available, maybe with a quick note about them, like a reminder to evaluate
  them." Checked by the same independent review before any change; the
  model's `AGENTS.md` is 276 lines today.
- Track this build as a Toolkit V2 work item (Mike, 2026-09-30): "This is
  the one thing that the work tracker skills are directly trying to solve
  for. This whole chat session could also be another test ... It's a
  massive work item that can be split up into a bunch of subtasks, but
  everything should be stored in one place. That's updated as we go so that
  we know we can keep track of everything, the current state of it, and all
  that stuff." And: "We could turn this into a V2 work item in the GitHub
  format ... and then we could also build the Notion templates now too. I
  feel like we could track that as its own work item and hand it off to the
  other session." So GitHub issue #1 in Mar5929/toolkit-v2 becomes the work
  item for the whole build, in the github-work-track format (Current state,
  Questions and Answers with every open decision, one sub-issue per big
  piece, Recent History), kept current by both sessions. The real "Toolkit
  V2 templates" page in his Notion workspace is built now (reversing "after
  the tests pass" the same day), from the test templates so the layouts set
  in Chrome are kept, then brought up to date; it is its own sub-issue,
  owned by the Notion session (handoff sent 2026-09-30).
  Where it goes (Mike, 2026-09-30, question box): "Inside AI Agent Second
  Brain (Recommended)": a new subpage at the bottom of "AI Agent Second
  Brain" (3e7b381d-a176-803f-a48f-e838ee648e67), below its Projects
  database. Separate item for Mike, not changed yet: that page's intro text
  is out of date (it describes a Stage board, one Memory database, and a
  "Current focus" page).
- Database templates (Mike, 2026-09-30, looking at the real templates):
  "You can actually create templates in the databases themselves, right?
  I'm confused: why didn't you create the templates in the databases?" The
  templates are plain pages the agent copies through the API, so a project
  or work item he makes by hand with "New" gets no template. Recommended:
  the project templates become templates of the Projects database in "AI
  Agent Second Brain", and the work item template the default template of
  each Work Items database. Sent to the Notion session to test in the test
  area first (API support, copies' relations and views, clicks needed).
- Overnight go-ahead (Mike, 2026-09-30, question box, before bed): "routing
  plus review, which is your recommendation" (yes to the routing and
  AGENTS.md report's 5 recommendations and to every recommended answer in
  the 111-question baseline review), "but just be on the lookout for any
  other anti-patterns we sort of identified earlier. Again, the intention
  and the expected behavior, from my perspective, from the user's
  perspective, is that I just want to be able to make decisions and have
  the coding agent manage everything. I don't want to have to remember a
  bunch of things about how this whole harness and toolkit works ... I
  don't want to have to remember a bunch of trigger words. The reason,
  again, the principle initially, why we're keeping it simple is because
  it's easily adjustable. It's just a bunch of skills, hooks, and rules.
  We're just using the out-of-the-box recommended harness development
  components to build this. We're not building a bunch of custom code.
  Again, the reviewers need to go through and check to see: I've said this
  a bunch of times, are the skills set up based on Claude Code and Codex
  best practices? ... how to set up the skills; how to add more detailed
  references and artifacts; how you should set up your AGENTS.md file; how
  you should set up the .claude/rules files; how to add paths to those
  rules so they are only invoked by the agents in different areas; etc.
  ... All this stuff should be grounded in best practices." Built as a
  third reviewer checklist, `dev/reviews/best-practices-review.md`, used on
  every change with the other two.
- Cost and model for tests (Mike, 2026-09-30): "for the full Salesforce and
  iOS scenarios, if you could use a team of Sonnet agents to do those, I
  don't want to spend millions and millions and millions of tokens doing
  them. We just need to have a very targeted test plan for those scenarios.
  ... I can't just exhaust my weekly limits with that one task, right? We
  need to be surgical about this and plan to use Sonnet 5.5 where
  appropriate." So: stage 4 gets a short, targeted test plan (each check
  tied to a finish item, nothing already proven in stage 3 repeated); its
  driver agents (the agent playing Mike, the checkers) run on Sonnet; the
  sessions under test run on Sonnet 5.5 except where a check needs the
  model Mike uses every day; every workflow logs its token use and stops
  short of the weekly limit. The same care applies to the overnight fix and
  review workflows: Sonnet for mechanical fixing and checking, the main
  model only for judgment calls.
- Morning answers (Mike, 2026-10-01, question box): the ~40 small tracker
  questions: "Let me read them first" (nothing applied until he has);
  Notion database templates: "Yes, I'll do clicks in Chrome (Recommended)"
  (the build session clicks, the Notion session fills, "Project: work and
  memory" becomes the Projects default, "Project workspace" kept until he
  says delete); the end-of-reply check: "Drop it (Recommended)"; the
  ChatGPT-account plugins in Codex: "Leave them on" (accept that about 1
  Codex session in 10 sees shortened descriptions).
- Notion board fix (Mike, 2026-10-01, question box): "Yes, and delete the
  old 3 (Recommended)": three fresh templates in his Projects database, the
  content moved into them by the Notion session, and the three emptied
  templates from 2026-10-01 deleted (to Notion's trash). And "Yes
  (Recommended)" to one throwaway project, "Template check (safe to
  delete)", in his real Projects database for an end-to-end check, deleted
  only with his yes.
- Notion follow-ups (Mike, 2026-10-01): #6 Q-01 "you can do this in Chrome
  by hand" (the missing layout groupings, done by the build session in
  Chrome); #6 Q-04 "yes, you can delete the Notion test leftovers" (the
  test area, "Toolkit V2 templates", the old "Project workspace" template,
  and "Template check (safe to delete)"; the test area and Template check
  wait until the running tests no longer use them).
- Skill best-practices audit (Mike, 2026-10-01): "use a team of 3 opus 5.5
  agents to handle this separate workstream": audit every Toolkit V2 skill
  against Anthropic's skill best practices, from the video "Everything You
  Know About Skills IS OUTDATED" (full transcript, or stop and ask him) and
  https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
  (docs win on conflicts); one checklist tagged video / docs / both; per
  skill pass or fail per item with fixes ranked by severity, plus
  toolkit-wide structural changes; "Do NOT edit any skills until I've
  reviewed the report."
- Audit follow-up (Mike, 2026-10-01): a fourth Opus agent as technical
  lead plans the fixes, and "a couple Sonnet 5.5 agents actually execute and
  update the skills"; question box: "Start; hold changes to behavior
  (Recommended)". His words: "It shouldn't really change any behavior,
  right? We're just modifying the skills to match ... we just need to
  refactor the skills to make sure that they're aligning with this new
  insight that we have on how Claude Code handles skills and how the
  harness works ... optimize the skills based on how Anthropic says we
  should create them. It shouldn't change behavior." And on pace: "we're
  coming up on 3 days here ... we can't overengineer this ... We just need
  to follow [the official documentation]." So the refactor keeps what each
  skill does; any fix that would change behavior or a settled decision is
  held for him; the routing test confirms no behavior changed.
- Keep every work stream tracked and current (Mike, 2026-09-30): "keep
  track of all these work streams, please. Keep them up to date." The
  tracker is GitHub issue #1 (the work item for the whole build) and its
  sub-issues.
- Salesforce production org (Mike, 2026-09-30, after a stage 3 test agent
  ran a read-only `sf org display` against it): "You can log out of that
  production environment. We don't need it." Done the same day: `sf org
  logout --target-org PRODUCTION` (a client's production org), and at his next
  request ("log out of the full copy sandbox too") that client's full-copy
  sandbox (`FULL_COPY`). No Salesforce org
  is connected on the Mac now. The test project did not need a restart: a fresh setup session
  set it up correctly; the skill fix (never touch an org the project has not
  named) is in the stage 3 fix round.
- Skill cut (Mike, 2026-10-01). He found a 336-line `approvals.md` with a
  table of what "ok" and "looks good" mean, and phrase tables in other
  skills: "Claude fucking knows what that means." The skills were about
  40,500 lines, more than the 37,000-line program V2 replaced. Five Opus
  reviewers proposed per-skill cuts
  (`dev/reviews/skill-cut-2026-10-01/proposals.md`); Mike: "just go - build
  it". Done in commit 89ab393 (0.5.0): work-on, work-status, and the three
  work find skills removed; the rest cut to 14,290 lines; model commits
  dcbf9ff and d3dcd65.
- What a skill holds (Mike, 2026-10-01): "Operational procedures, policies,
  rules, templates, sequence of operations, if-then workflow statements."
  Also allowed, from the official guides: a when-to-use description,
  gotchas (specific tool facts Claude would get wrong, never general
  advice), checklists, check-and-fix loops, short output examples, facts
  Claude cannot know, and defaults instead of menus. It is a menu, not a
  requirement. Never: how to reason, what English words mean, or anything
  Claude already does right. The test for every line: would Claude get the
  job wrong without it? Added to `dev/reviews/best-practices-review.md` as
  P0.
- One work-item skill (Mike, 2026-10-01, "Yes"): plan one skill for the
  whole work item lifecycle, with a short map in `SKILL.md` (purpose, the
  stages and status fields, where his yes is needed, an index), one short
  reference per stage (refine, design, delegate, check, finish), the
  helper agent briefs, the tracker's storage file chosen at setup, and the
  templates. The tracker skill folds in; memory stays separate. Plan first,
  shown to him before building.
- Hindsight on his VPS (Mike, 2026-10-01): API
  `https://memory-api.mrihm-memory.com`, dashboard
  `https://memory.mrihm-memory.com`, Hindsight and Ollama on a Hostinger VPS
  behind Caddy; one bank per coding project; never install Hindsight or
  Ollama on the Mac, never Hindsight Cloud, never an OpenAI key; he enters
  any access key himself. Setup offers the VPS and asks before making a
  bank; a small skill opens a project's bank in the dashboard; projects on
  the Mac's local server keep working. On testing: "We don't need to test
  everything." The coding-agent add-on: recommended off, not yet confirmed.
  This replaces "one local server on this Mac" (2026-09-26) for new
  projects. Built after the work-item skill.
- Hindsight setup decisions (Mike, 2026-10-01, later the same day): the
  VPS is the only Hindsight server; nothing of Hindsight or Ollama is
  installed on the Mac, and the Mac install steps are dropped. Hindsight's
  coding-agent add-on is on ("Turn it on", replacing "not used" of
  2026-09-29 and "recommended off" above). It points at the VPS, maps each
  project's folder to that project's bank, stays off in every other folder,
  and recalls the `world` and `experience` fact types, because observations
  are off on the VPS. Setup asks before it changes his machine-wide Claude
  Code and Codex settings, and Toolkit V2 adds no project MCP entry named
  `hindsight` of its own. The `project-setup` skill does all of it: when he
  picks Hindsight, the agent explains the VPS setup in plain words, asks
  whether to create a separate bank for the project, checks the API, creates
  the bank or reuses the project's own, saves its ID in `PROJECT.md`,
  connects Claude Code and Codex, and proves it with one save and one
  search. Keys never go into a repository, a log, or the chat; he enters
  each key himself. The agent opens the bank in the dashboard after setup
  and whenever he asks; he signs in to the dashboard himself. No backup
  step. "Check the setup", "update the toolkit", and the new-computer steps
  say which server a project uses. No scripts in skills or projects. No
  dashboard skill: the memory rule and setup open the dashboard. Projects on
  the Mac's server get a short note only. (This replaces "a small skill
  opens a project's bank in the dashboard; projects on the Mac's local
  server keep working" above.)
- Hindsight runs as Hindsight (Mike, 2026-10-01): "hindsight can just
  operate as the normal hindsight solution - we can still note in the
  project rules somewhere what we consider to be 'project memory'. Maybe if
  it is hindsight we add this note about project memory towards the top of
  agents.md". So a Hindsight project's `AGENTS.md` starts with a short
  "Project memory" section: the bank, the add-on saving and recalling by
  itself, what counts as project memory, and the dashboard link. The memory
  rule's Hindsight section keeps only the tool mapping, the key safety
  line, "forget that", and Current State. The toolkit no longer requires
  keep words before a save, and standing instructions are not routed to
  `owner-preferences.md` in a Hindsight project. Model commit f10d19a. The
  code scan's US$2 is the add-on's own default cap per scan, not a toolkit
  limit; whether to keep the scan is still open.

## Goal

Build a new toolkit repository from scratch at
`/Users/michaelrihm/Documents/Projects/toolkit-v2`. It is a separate
experiment from issue 419 in `Mar5929/claude-toolkit`; the current toolkit is
not changed.

A fresh project set up by the new toolkit must match the model project at
`/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project`: the same
folders, file names, and template text. The templates are how the agent
creates files in those folders. Claude reviews the model for a solo developer
who wants the agent to run the project while they make decisions; the review
is a checklist for Mike, not a change to what projects get.

The main difference from the current toolkit: the orchestration layer is a
clear, non-overlapping set of skills whose names and descriptions let Claude
Code and Codex pick the right one from the skill index, plus hooks for the
steps that must always run the same way.

## Settled decisions (Mike, 2026-09-26)

- Repo lives locally at `/Users/michaelrihm/Documents/Projects/toolkit-v2`.
  A GitHub repo is created only after Mike approves it.
- Separate experiment from issue 419. Add a note to issue 419 linking it.
- Project init copies the model scaffolding except `.work-items/` and
  `.memory/`, then interviews: where to track work, which memory system,
  Salesforce or not. It then writes `AGENTS.md` and the rule files to match.
- Salesforce pieces are installed only when the project is a Salesforce project.
- Port: the session skills from the current toolkit, `sf-architect-solutioning`
  as is, the Plain English output style, the general rules and the Salesforce
  rules the current project-init library installs, and the model's memory
  system (with a review for improvements).
- Follow Claude Code and Codex best practices: hooks set up the documented
  way, rules scoped to paths where that fits, no README in every folder.
- Instruction files: follow the model. Earlier (morning) Mike said `AGENTS.md`
  only; in the evening he said the model's `AGENTS.md` and `CLAUDE.md` files
  are what projects get, and the model keeps `CLAUDE.md` files. The model
  wins. Later approved: one root `CLAUDE.md` with only `@AGENTS.md` (item 1 below).
- Work items: the same stages, lifecycle, `WORK-ITEM.md` body and
  `DESIGN.md` everywhere. Nesting and sub-items are allowed. When Mike moves
  files or folders, the agent detects it and adapts.
- Trackers fully built and tested: local `.work-items/` folders and Notion.
  GitHub Issues and Jira get the template and written instructions only.
- Notion: refactor the "AI Agent Second Brain" page. A Projects database;
  each project page has its own Work Items database (board view, sub-items,
  same stages, body in the `WORK-ITEM.md` format, a templated Solution Design
  subpage) and its own Memory database. No shared all-projects work item
  database. Use the Notion CLI (`ntn`) where it fits.
- Memory options: built-in `.memory/`, local Hindsight, or Notion.
- **Notion memory uses Lore** (Mike, 2026-09-27): `github.com/makenotion/lore`,
  Notion's own open-source "persistent, shared AI memory backed by Notion for
  MCP-compatible assistants". Research: `dev/research/lore.md`. Mike chose
  (2026-09-27) "store in Lore's layout": the toolkit keeps its own `toolkit
  memory` commands, the model's formats, and the approval step, and writes
  each project's Notion memory in Lore's database layout (a "Memory" page
  holding Lore's databases) so Lore's tools can read it. Lore's own automatic
  saving and hooks stay off; no new sign-in. Focus and glossary stay child
  pages.
- **Decisions of 2026-09-28** (Mike: "yes to all your recommendations"):
  (1) requirements areas are one folder per area copied from
  `system-area-template/`; (2) skip `git fetch` when there is no remote;
  (3) in Codex the owner runs every sandbox deploy and sandbox data change;
  (4) template guides say "copy this file" not "rename"; (5) Salesforce
  platform questions route to `sf-architect-solutioning` (AGENTS.md line);
  (6) `sf-component-tracker` description "Use first, before work-on";
  (7) never write a script that deploys; (8) the guard also checks DevOps
  Center pipeline deploys; (9) fix old wording in two Salesforce skill
  bodies; (10) the `toolkit` plugin is on machine-wide in both hosts (only
  project-setup plus hooks that do nothing outside V2 projects), the other
  V2 plugins only inside V2 projects; (11) install Toolkit V2 in Mike's
  everyday Claude Code with that rule; (12) risky toolkit commands (memory
  delete, import, machine-setup, Hindsight service install/start) ask first
  in both hosts; (13) setup asks for a backup folder and the toolkit exports
  `.work-items/` and `.memory/` automatically at work-finish and handoff.
  Goal adjustments: one skill per job with reference files (no new skills
  per process), and anything that must happen every time lives in the
  `toolkit` command or a hook, with the skill explaining it.
- **Concept memory, like Anthropic's project memory** (Mike, 2026-09-28
  night, with screenshots of Claude's Memory lists): in local
  Markdown/Obsidian, Notion, and Hindsight, memory is one file (page,
  document) per concept or area, each with a title, a one-line summary, and
  an updated date at the top. New facts go into the concept they belong to,
  under a heading; a new file only for a new concept. The agent can read the
  whole concept at once, and files link each other where useful. Naming
  (Mike's final choice): keep the model's five prefixes, `user_`,
  `feedback_`, `project_`, `reference_`, `event_`, one file per concept
  (for example `feedback_ways_of_working.md`, `project_billing.md`); events
  stay as their own files. No starter files; concepts are created as they
  come up. The index lists each concept's title, summary, and updated date,
  grouped by prefix. The model's memory text changes only where it must
  (concept files, not one file per fact); it goes on the model branch.
- **Rules follow Claude Code best practices** (Mike, 2026-09-29): every
  project rule and the owner-preferences rule format are written to the
  official guidance (one topic per file, specific checkable instructions,
  `paths:` frontmatter only where a rule applies to certain files, short
  always-on rules, procedures moved to skills), keeping each rule's meaning;
  meaning changes wait for Mike's yes. A checker enforces the format.
- **Rules, skills, and memory each hold one kind of thing** (Mike,
  2026-09-29): instructions the agent must follow every time (owner
  preferences, corrections, "from now on", "always", "never") go in rules:
  one always-on project rule `.claude/rules/owner-preferences.md` with a
  heading per area, or Mike's machine-wide `~/.claude/rules/` when it
  applies to every project (ask only when unclear). Confirmed repeatable
  procedures go in skills (toolkit skills, or a project skill in
  `.claude/skills/`). Memory holds facts and unproven learned know-how:
  four prefixes `user_`, `project_`, `reference_`, `event_`; `feedback_` is
  retired; each concept file has a "Gotchas and lessons" section. Promotion:
  when a lesson proves itself (it recurs, or the owner confirms it), the
  agent proposes turning it into a rule or skill and writes it after the
  owner's yes; memory-tidy looks for candidates. "Remember..." and "from now
  on..." still go through memory-save, which picks the home. This replaces
  the five-prefix naming in the concept-memory bullet above.
- **Cite recalled knowledge, always** (Mike, 2026-09-29): "make sure that
  the agents always, if they recall something from knowledge and use it in
  their decision, cite that. And just briefly list where they got it from."
  Applies in every project, every memory system (built-in, Hindsight,
  Notion), every tracker, and both hosts, whenever the agent uses something
  it recalled from project knowledge (memory, rules, DECISIONS.md, work
  items, requirements, system guide, current focus) in an answer, a
  recommendation, or a decision, not only inside memory-find. Form: the
  source named where the fact is used, plus a brief list of sources at the
  end of the reply.
- **Decisions live in memory** (Mike, 2026-09-29, answering "Should every
  decision move into memory as one record each, with DECISIONS.md removed
  from the model? This reverses approved change 6." with "Yes, move to
  memory"). Every decision already made, for the whole project or for one
  or more work items, is one memory record, linked to the work items it
  affects, listable for one work item and for the whole project by work
  item, in every memory system and tracker. `DECISIONS.md` is removed from
  the model (approved change 6 reversed). Mike's reason, in his words:
  "Decisions are supposed to be in memory, I think. Decisions can be
  related to a work item, and we need to have a way to say, 'Okay, for
  this work item, here are the decisions.' Also, in memory, you could find
  just a list of all the decisions and scope them by the work items."
  Design and the remaining open questions: `dev/research/decisions-architecture.md`.
- **Keep it simple: rules plus each tool's own features, no big wrapper**
  (Mike, 2026-09-29, his words): "I don't want to overengineer this and
  create excessive code that's just going to fail at some point. I'm not
  trying to create tons and tons of scaffolding, like a whole harness that
  can solve every single application that we could potentially choose for
  work tracking ... shoving all that logic ... into one overall wrapper.
  The whole point is, these are just rules. Notion can handle it a way
  where you could backlink decisions from the memory bank ... to the work
  items. I feel like we could just create modules ... I don't want to
  create tons and tons of custom code that the agent is running, and that
  code could potentially fail when I'm in the middle of a real project."
  In the Notion session the same day he asked whether each tracker could
  have its own commands chosen at setup instead of one command for all.
- **Answers on the decisions design** (Mike, 2026-09-29, to the numbered
  list with recommendations): (1) decisions are linked to work items and
  work items link back, done simply (Notion's own backlinks, not new code);
  (2) plain approvals stay on the work item: "correct"; (3) and (4) not
  understood yet, explained again; (5) every memory links to its work
  items: "yes, I guess that makes sense"; (6) no required backup folder:
  "we don't need a backup folder. That's too much bloat."; timing: build
  after the current goal, and work the architecture out together with the
  "Notion work tracker refinement" session.
- **Decisions of 2026-09-28, evening** (Mike): (1) "No agent team" decides
  only who builds. Before asking for the owner's result approval, the agent
  always starts one independent acceptance checker agent (in Codex, the
  fallback in the skill's agent reference). The old rule "a no authorizes no
  helpers" is replaced for this one check. (2) Projects that keep both work
  items and memory in Notion rely on Notion's page history and trash; setup
  skips the backup-folder question for them and says why.
- **Skills carry their own procedures** (Mike, 2026-09-28): every process the
  agent must run a certain way (work tracking, local Markdown and Obsidian
  memory, design and delivery teams, handoffs, git, setup) has a skill with a
  clear SKILL.md and reference files inside its own folder for the
  step-by-step details, following Anthropic's and OpenAI's official skill
  and hook guidance. Descriptions say exactly what each skill does and when
  to use it. Every description states what the skill does, why to use it,
  and when to use it (Mike, 2026-09-29), and every skill folder holds all
  the references, templates, examples, and scripts its steps need.
- **Routing approvals** (Mike, 2026-09-28, 10:43 EDT; earlier recorded here as 2026-09-27 night): (1) the model's
  `.claude/rules/session-handoff.md` gets the new wording in
  `dev/model-changes.md` ("Proposed: handoff rule wording"); (2) the model's
  `AGENTS.md` gets two routing lines: changing a requirement goes to
  work-requirements, and "you drive" or "take it from here" goes to
  work-delegate; (3) new projects raise Claude Code's skill-list budget
  (`skillListingBudgetFraction`) so every Toolkit V2 description is visible.
- **Memory additions from Mike's research note** (Mike, 2026-09-27; note
  summarized in `dev/research/memory-architecture-notes.md`): (1) saved
  proposals: an unanswered "Save to memory?" becomes a `needs-review`
  record the agent does not rely on, listed under "what do you need from me"
  (work-decide) until Mike approves or rejects it; (2) a duplicate check in
  the `toolkit memory save` command itself; (3) clean deletes: deleting or
  retiring a memory also clears it from the briefing, Hindsight, and Notion
  caches; (4) a memory test set: fresh-session handoff, corrected fact
  replaces the old one, "I don't know" instead of a guess, no leak between
  projects. Enterprise parts (tenants, access control, legal hold, graphs)
  are left out for a solo setup.
- **Skill descriptions must be written to the official Claude Code and Codex
  best practices** (Mike, 2026-09-27), so the agent knows exactly when to use
  each skill. Use Firecrawl to capture the official guidance. Mike approved
  rewriting the `sf-architect-solutioning` description only (body unchanged).
- Hindsight: self-hosted only, never Hindsight Cloud. One local server on this
  Mac, one memory bank per project. No Docker (Mike was unsure; Docker on a
  Mac cannot use the GPU and needs Docker Desktop running). Installed with
  `uv tool install hindsight-api --python 3.12`; model `gpt-oss:20b` through
  Ollama (installed with Homebrew, runs as a brew service).
- **The model project is the exact source for folders and file templates**
  (Mike, 2026-09-26 evening, while he keeps editing the model). That covers
  the folder structure, file templates, instructions, rules, `AGENTS.md` and
  `CLAUDE.md` files, project hooks, and agents. The toolkit packages the
  model as it is, with a copy step that can be re-run as he changes it. Setup
  leaves out only `.work-items/`, `.memory/`, and the Salesforce parts when
  they are not chosen. The model does not hold the new plugin skills, the
  `toolkit` command, or plugin hooks; those come from toolkit-v2 and must
  work with the model's templates as they are. Claude's review ideas are a
  checklist for Mike; only approved ones are added, and they go into the model.
- **Approved content changes (Mike, 2026-09-26 night: "go with your
  recommendations on all of them").** The model decides folder layout, file
  names, and locations. These 23 content changes are approved and go into the
  model itself, on a separate branch of the model's Git repo so Mike's own
  edits are never touched, then merged when he is ready:
  1. One root `CLAUDE.md` containing only `@AGENTS.md`; the other `CLAUDE.md`
     files removed. 2. Rewritten `AGENTS.md` (owner decisions, one routing
     table, "How to write replies", generated rules list). 3. `SOUL.md` kept as
     the model has it. 4. `.claude/RULES.md` and `docs/toolkit-manual.md`
     removed. 5. `README.md` shortened. 6. `DECISIONS.md` added.
     7. `.toolkit.json` replaces `.toolkit-memory.json`. 8. `work-item-folders.md`
     rule for the local tracker. 9. Work item header fields `parent`,
     `waiting_on`, `priority`, `delivery`, `result_approved`, `updated`,
     `requirements_approved`; `active_phase` removed. 10. Six statuses; Blocked
     becomes `waiting_on`. 11. Body uses IDs, "owner", a Sub-items column.
     12. `DESIGN.md` header (work item, status, approval). 13. Four-section
     current focus. 14. One-page memory criteria; save rules in `memory-save`.
     15. Learned-rules table removed; corrections are `feedback` memories.
     16. `delivery/` only in Salesforce projects. 17. Salesforce guards also in
     Codex. 18. Salesforce skill descriptions rewritten, one source for both
     hosts. 19. `tests/TEST-PLAN-TEMPLATE.md` stays where the model has it.
     20. General example in `plain-english-artifacts.md`. 21. `system-guide/`
     kept as the model has it. 22. `.vscode/` and `.sfdx/` not copied.
     23. V2 projects turn on the V2 plugins and turn off the `claude-toolkit`
     plugins.
- **Memory: Claude's mechanisms, Mike's formats** (Mike, 2026-09-26 evening).
  The toolkit's memory mechanisms are used: the `toolkit memory` command
  written by the main agent (no curator subagent, no per-project
  `scripts/memory.py`), the session-start briefing hook for both hosts, the
  explicit-phrase reminder and the once-per-turn Stop check, worktree-safe
  vault lookup, and one command set for built-in, Hindsight, and Notion. The
  model's folder and file formats are kept exactly: the `.memory/` files and
  their sections (with the four-section `CURRENT_FOCUS.md` from approved item 13), the topic
  template and its YAML, the index format, the glossary, memory criteria, and
  Obsidian-style relative links with link repair on rename, merge, and
  archive. Instruction text in the model that names the old mechanism (the
  curator, `scripts/memory.py`, the model's memory hooks) is the only text
  changed, to name the toolkit command instead.
- Review the model project's scaffolding, every template, and its root
  `AGENTS.md` as a solo "vibe coder" developer would: the agent runs the
  project, the human only makes decisions and steers. Say what is missing and
  what is not needed. The findings are a checklist in `dev/model-review.md`.
  Nothing from it reaches new projects unless Mike approves it, and approved
  items are added to the model itself.
- Notion CLI: `ntn` (official, by Notion) installed with `npm install -g ntn`.
  Mike runs `ntn login` himself, because it opens a browser sign-in.
- Built by a team of Opus agents. Loop: build, set up sample projects, run
  work items end to end (including nesting and Mike moving files), fix, repeat.

## How the work runs

Claude leads a team of Opus subagents and keeps `dev/PROGRESS.md` current
(done, in progress, next step) so a new session can resume.

Rules on the way:

- Leave the `claude-toolkit` repo unchanged, except one note on issue 419.
  Leave the `toolkit-v2-model-project` folder unchanged unless Mike approves
  a specific change there (he edits it himself, often).
- Instruction files as the model has them (see above).
- No Docker, no Hindsight Cloud, no GitHub repo without Mike's yes, no AI
  credit in commits.
- Follow the captured Claude Code docs
  (`claude-toolkit/ai-external-knowledge/claude-code/`) for hooks, skills,
  plugins, and path-scoped rules. No README in every folder.
- Ask Mike only for decisions that are his, logins, money, or anything that
  cannot be undone.

## Finish items (11) (replaced 2026-09-29; see "Goal and finish list" at the top)

The goal is met only when Claude has shown each item in the conversation,
with real command output, file listings, or links as proof.

1. **Model review.** The model project's scaffolding, every template, and
   `AGENTS.md` reviewed as a solo vibe-coder would, where the agent runs the
   project and the human only decides and steers. Findings are a checklist in
   `dev/model-review.md`. The scaffold project init installs is a re-runnable
   copy of the model (a parity test shows setup output matches the model,
   apart from the chosen conditional parts and the memory mechanism files).
2. **Plugins.** `toolkit-v2` registers its plugins for Claude Code and Codex,
   and `claude plugin validate .` passes.
3. **Project init.** Copies the scaffold except `.work-items/` and `.memory/`,
   then asks: tracker (local folders, Notion, GitHub Issues, Jira), memory
   (built-in `.memory/`, local Hindsight, Notion), Salesforce or not. It writes
   `AGENTS.md` and path-scoped rules to match, and installs the general rules,
   the Salesforce rules when chosen, and the Plain English output style.
4. **Work items.** The same stages, lifecycle, `WORK-ITEM.md` body, and
   `DESIGN.md` in every tracker. Sub-items work, and when Mike moves or
   renames a work item file or folder, the agent notices and carries on.
5. **Skills.** A skill index (name, description, when to use) covering the
   ported session skills, `sf-architect-solutioning`, and the new
   orchestration skills. An independent agent checks it for unclear or
   overlapping skills, and every finding is fixed.
6. **Hooks.** The work-item and memory hooks pass automated tests and are seen
   running in a real Claude Code session and a real Codex session.
7. **Notion.** The "AI Agent Second Brain" page is rebuilt so each project has
   its own Work Items database (board view, sub-items, same stages,
   `WORK-ITEM.md` body, Solution Design subpage template) and its own Memory
   database, operated through the `ntn` CLI.
8. **Hindsight.** A local Hindsight server using Ollama `gpt-oss:20b` runs on
   this Mac as a background service, each project has its own memory bank,
   and a test project stores a memory and gets it back.
9. **Sample runs.** A fresh project is set up and one work item is taken from
   start to done, including a sub-item and a moved file, for each of: local
   tracker + built-in memory; a Salesforce project; Notion tracker + Notion
   memory; local tracker + Hindsight. Evidence is saved in `dev/test-runs/`.
10. **Fixes.** Every failure from items 5 to 9 is fixed and re-tested, and a
    final independent review finds no blocking issues.
11. **Report.** Claude gives Mike a final plain-English report: what works,
    what was tested, and the open decisions.

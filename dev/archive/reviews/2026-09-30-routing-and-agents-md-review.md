# Review: "the work item says what's next" and "AGENTS.md as a routing map" (2026-09-30)

> **Nothing was changed.** This is a review for Mike. Every change below waits for his yes.

Mike asked two things on 2026-09-30 (`dev/GOAL.md`, "Interview answers", the last bullets): is this the right approach when we step back, and where are the weak spots? Three researchers read the official docs (Claude Code, Codex, Anthropic), one read every model and toolkit file involved, three reviewers judged the ideas, and a checker tested each claim. Claims the checker found wrong are left out or corrected here.

Words used in this file:

- **Routing** means how the agent picks which skill to use for a message.
- A **host** is the program that runs the agent: Claude Code or Codex.
- **Compaction** is when a chat gets too long and the host shrinks the earlier part into a short summary.
- A **helper agent** is a second agent the main one starts for one job, such as the independent checker.
- **Setup markers** are hidden comment lines in the model's files that tell `project-setup` which blocks to keep for a project's choices.
- **KB** (kilobyte) is a file size: 1 KB is about 1,000 letters. Codex limits its instruction files by size, not by lines.
- **Project Current State** is the project's `memory/CURRENT_STATE.md` (or Notion page). An item's **Current state** is the five-line block at the top of one work item.

## 1. The answer first

Is this the right approach? Yes. Both ideas point the same way the official guidance points: keep the always-loaded file short, let the agent pick skills by the situation instead of special words, and keep progress in notes it reads back. Neither is ready as first worded, and they should be done as one change, because they rewrite the same part of the same file.

- **Idea 1, "the work item says what's next": adopt with changes.** A work item that names its next step and skill is the right way to carry work from one session to the next, and most of it is already built. As worded, the rule would act on every message (even questions), never says which item, lets an out-of-date line win, and reaches helper agents; and cutting the phrase lines to "a few examples" goes too far, because only 6 of the 15 shared skills follow an item's stage.
- **Idea 2, "AGENTS.md as a routing map": adopt with changes.** A short map of what goes where, when, and why is what the Codex docs call "routing guidance", and it fits Claude Code's 200-line target. The size problem is smaller than it looks (the file a real project gets is already 160 to 191 lines, not 278), so the gain is a clearer shape: keep 200 lines as the hard limit (not 250), add a size cap for Codex, and keep the section names and lines that other files and Codex depend on.

## 2. What the official docs say

1. **The project instructions load in full every session, and the target is under 200 lines.** Longer files use more room and are followed less reliably. The file is guidance, not a guarantee. (`claude-code/memory.md`, "Write effective instructions", line 88; "My CLAUDE.md is too large", lines 599-601. A project's `CLAUDE.md` holds only `@AGENTS.md`, so `AGENTS.md` is that file.)
2. **It should hold what the agent cannot work out by looking.** The docs put project layout and "always do X" rules there, and step-by-step procedures in skills. But the `/doctor` checkup offers to cut plain folder layouts, because Claude can see those itself. So a map earns its lines only by saying what goes where, when, and why. (`claude-code/memory.md`, "When to add to CLAUDE.md", line 57, and line 603; `claude-code/best-practices.md`, "Write an effective CLAUDE.md".)
3. **OpenAI says the same for Codex.** "Keep it small." Cover the repository layout and important folders, and add "routing guidance" about which folders and files to look at first. Codex stops adding instruction files once their combined size reaches 32 KiB (about 32,000 letters). It counts size, not lines. (`codex/customization-overview.md`, "AGENTS Guidance", lines 27 and 43; `codex/best-practices.md`, "Make guidance reusable with AGENTS.md"; `codex/agents-md.md`, line 22.)
4. **Telling the agent to read a file does not load it.** The agent reads it only if it decides to. Only an import or a hook's output puts text in front of it for certain. So "read the work item" is a request the agent usually follows, not a guarantee. (`claude-code/memory.md`, "Remove an earlier AGENTS.md workaround", line 429.)
5. **Neither host loads the folder `AGENTS.md` files by itself in a V2 project.** Claude Code skips `memory/AGENTS.md` and `requirements/AGENTS.md` because the project has a root `CLAUDE.md`. Codex stops looking at the folder it was started in, and it never reads `.claude/rules/`. So the root file must keep the lines that point to them. (`claude-code/memory.md`, "AGENTS.md" table and "When Claude Code reads AGENTS.md", lines 349-373; `codex/agents-md.md`, "How Codex discovers guidance" and line 90.)
6. **Hosts pick a skill by matching the request to its description, by judgment, not by keywords.** Codex uses a skill only for the message where it was named or matched ("Do not carry skills across turns unless re-mentioned"). If a named skill is missing, Codex says so and "continue[s] with the best fallback". (`claude-code/skills.md`, "Skill not triggering"; `anthropic-agent-skills/agentskills-adding-skills-support.md`, "Model-driven activation"; `codex/source-skills-catalog-prompt.md`, lines 17-18.)
7. **Anthropic advises a few clear examples over a long list of if-this-then-that rules, and notes the agent writes and reads back.** A work item's Current state with a Next action is that kind of note. (`anthropic-engineering/effective-context-engineering-for-ai-agents.md`, "The anatomy of effective context" and "Structured note-taking".)
8. **Two cautions.** Helper agents load `AGENTS.md` too (`claude-code/sub-agents.md`, "What loads at startup", line 1061). And the docs disagree on whether Claude Code's skill list comes back after compaction: `claude-code/context-window.md` line 63 says no, `claude-code/settings-reference.md` line 2917 says Claude sees it each turn. No doc describes a "routing map" pattern at all, so only the routing test can prove the change works.

## 3. Idea 1: the work item says what's next

Most of this already exists. `keep-work-item-current.md` says to read the item's Current state first and to make Next action name the exact next step. The stage table in `work-item-format.md` section 2 names a usual skill for each stage. `work-on` already routes by the item's fields (`starting-and-resuming.md` section 6). The session-start hook already says "Re-read the active work item" after compaction. What is new: Next action names the skill, and a main rule in `AGENTS.md` points to it. No new hook job and no new code.

### Weak spots

1. **It acts on every message.** Many requests have no work item: questions, Git, memory, quick fixes.
   - Mike says: "hey what did we end up deciding on the partner users".
   - What goes wrong: the agent reads the active item and answers from it, or starts its next step, instead of searching memory.
   - Fix: the rule applies only when a message continues a work item. Everything else is picked from the Skills list and the skill descriptions.
2. **It never says which item.** At the start only the project Current State is loaded. Its "Now" list can hold up to 5 items, and by Mike's decision it holds no next steps.
   - Mike says: "ok lets keep going", with WI-031 (in design) and WI-034 (ready for its check) both under Now.
   - What goes wrong: the agent picks WI-031 and starts designing. He meant the check on WI-034.
   - Fix: the item he names; else the one this branch or chat is working on; else the one under "Next session starts with"; if two still fit, ask one short question.
3. **A question becomes an order.** Voice-to-text makes this more likely.
   - Mike says: "ok so whats next".
   - What goes wrong: the agent starts WI-031's next step and writes design files. He wanted to hear where things stand.
   - Fix: "A question gets an answer, not the next step." Keep the `work-status` line.
4. **An out-of-date Next action wins.** Next action is a sentence rewritten after each step, so it goes stale when Mike changes an item himself, a session ends early, or another session changes it.
   - Mike drags the card to Done on his phone, then says: "keep going on the booking flow".
   - What goes wrong: Next action still says "run the check", so the agent checks a finished item again.
   - Fix: the item's fields (status, stage, `waiting_on`, approvals, ticked tasks) win. When they disagree, open `work-on`, which routes by them, and rewrite Next action.
5. **His new words lose to the stored step.**
   - Mike says, mid-design: "actually lets not bring the partner users over at all scratch that".
   - What goes wrong: the agent folds it into the design, never updates the requirement, and never asks him to approve the change.
   - Fix: his new message always wins. A change to a requirement goes to `work-refine` at any stage, as today. Rewrite Next action at once.
6. **It names a skill the project does not have.** Skill sets differ by setup, and skills get renamed.
   - Mike switches a project from local work items to Notion. An open item says "add task P2-T04, with local-work-track". He says: "keep going".
   - What goes wrong: Codex says the skill is missing and continues with its best guess, editing a local file that is no longer the tracker.
   - Fix: Next action may name only the six stage skills every project has: `work-refine`, `solution-design`, `work-on`, `work-delegate`, `work-check`, `work-finish`.
7. **Codex forgets the skill on the next message.**
   - In Codex, `solution-design` asks "Option A or B?". Mike says: "b but keep the finance people out of it".
   - What goes wrong: no skill name and no description match, so Codex answers without `solution-design`'s steps: no Questions and Answers row, and Next action is not rewritten.
   - Fix: the rule says to use the named skill again for each message that continues the item. Add this two-message case to the Codex test.
8. **After compaction the item may be gone.** A long work item file comes back only as a file path, and older skill text can be dropped.
   - Mike says, after a long interview and an automatic compaction: "next question".
   - What goes wrong: the agent asks Q-05 again.
   - Fix: the rule says to read the item again after resume, clear, or compaction. Do not copy each Next action into the project Current State or the hook: that reverses Mike's decision ("never copy those here"), and Codex caps a hook message at about 2,500 tokens (roughly 1,900 words).
9. **Helper agents follow it too.**
   - Mike says: "design the permission sets for WI-031". `solution-design` starts a researcher to check platform limits.
   - What goes wrong: the researcher reads the rule, opens WI-031, and writes design options instead of doing its research.
   - Fix: "These rules are for the main conversation. A helper agent follows its brief."
10. **While the item waits on Mike, the step after his answer is missing.**
    - Next action says only "Waiting on Mike: Q-07". The next day Mike says: "yeah merge the front desk and owner ones keep the rest".
    - What goes wrong: the answer is saved, but the agent does not know if refining or designing comes next.
    - Fix: the waiting format carries both parts (see the format below).
11. **Cutting to "a few examples" drops the only sure skill list.** Only 6 of the 15 shared skills follow a stage. `handoff`, `braindump`, `explain-simply`, `session-summary`, the four Git skills, and the memory and Salesforce skills are picked by what Mike is doing.
    - Mike says, late in a long session: "ok write me a handoff im clearing context".
    - What goes wrong: if the host's skill list did not come back after compaction and `AGENTS.md` has no handoff line, the agent writes a summary by hand and skips the handoff checks.
    - Fix: keep one situation line per installed skill (this is Idea 2's skills list).

### What stays as insurance

- **Skill descriptions, unchanged:** situation words first, then 2 to 4 example phrases. Codex cuts long descriptions from the end (`codex/build-skills.md`, line 106: "Front-load the key use case and trigger words").
- **One line per installed skill in `AGENTS.md`**, starting with the situation it is for. The names stay even when a host shortens descriptions.
- **Today's example phrases, for now.** No test has shown which ones matter. In the last Claude Code test (60 of 63 runs right; none of the competing skills it watched for won), the descriptions, the `AGENTS.md` lines, and the reminder hook were all on at once. The before-and-after test decides which phrases stay. One has direct evidence: add "I made the sandbox, mark it done" to the work track skill's line (M18 and R12 went 0 of 3), not to `work-finish`.
- The line "method skills from other plugins run inside these skills, never instead of them".
- The prompt-reminder hook with no new words (A2 stays no), the session-start hook's compaction line, and the Stop check.
- `skillListingBudgetFraction` 0.03 in the model's settings: three times Claude Code's default room for the skill list, approved by Mike (`dev/GOAL.md`, "Routing approvals"). It makes dropped descriptions unlikely in Claude Code. The model sets nothing like it for Codex, so the risk stays real there.

### Recommended main rule, word for word

In `AGENTS.md` "Every session", after the `SOUL.md` and `PROJECT.md` line. Mike's own two sentences are the core of lines 2 and 4.

```
- These rules are for the main conversation. A helper agent follows its brief.
- When a message continues a work item, find the item: the one the owner names; else the one this branch or this chat is working on; else the one Current State names under "Next session starts with". If two could fit, ask him which in one short question.
- Before acting, read the work item's Current state with the work find skill, and read it again after resume, clear, or compaction. Then do its Next action with the skill it names, and use that skill again for each message that continues the item.
- If the Next action names no skill, or the item's status, stage, `waiting_on`, approvals, or ticked tasks disagree with it, open `work-on`, which routes by those fields, and rewrite the Next action.
- If the owner asks a question or asks for something else, pick the skill by what he wants done, from the Skills list. A question gets an answer, not the next step. When his plan changes, rewrite the item's Next action.
```

If tests show the agent skipping line 3, add "IMPORTANT" to that one line only (`claude-code/best-practices.md`, line 195).

### Recommended Next action format, word for word

In `WORK-ITEM.md` line 33 and every copy:

```
Working:  **Next action:** <Who>: <the exact next step, one sentence>, with <skill>.
          Example: Agent: write two design options for the permission set groups, with solution-design.
Waiting:  **Next action:** Waiting on Mike: Q-07 (<the question in a few words>). After his answer: <step>, with <skill>.
          Example: Waiting on Mike: Q-07 (merge or move the 15 personas). After his answer: finish R-04, with work-refine.
Finished: **Next action:** None. Finished.
```

- `<skill>` is one of the six stage skills. The skill that writes the line takes it from the stage table (`work-item-format.md` section 2). Stages 03, 08, and 10 list two skills; the writer names the one it chose.
- Never name a work track, find, memory, Salesforce, or machine-wide skill: those differ by setup.
- Items made before the change have no skill name until their next step rewrites Current state. The "names no skill: open `work-on`" line covers that gap.

## 4. Idea 2: AGENTS.md as a routing map

Today the model's `AGENTS.md` is 278 lines and 27,441 bytes (not 276: Mike's voice-to-text commit, d9f61ef, added 2). It holds every setup choice at once; setup removes the rest. The file a real project gets is 160 to 191 lines and 15.6 to 19.8 KB. The largest is local work items + Hindsight + Salesforce: 191 lines, 19,760 bytes. The always-on rules load on top of it: 176 to 228 lines without Salesforce, 256 to 308 with it.

### Recommended outline, in Mike's order

Line budgets are for the largest setup, after setup, counted with `wc -l`, including headings and blank lines. A sizing draft of this order, for local work items, local memory, and Salesforce, came to 185 lines and 18.2 KB.

| # | Section | What it holds | Lines |
| --- | --- | --- | --- |
| 0 | Opening | Mike's continuity paragraph, the title, the one-sentence outcome and who does what, the voice-to-text line. | 13 |
| 1 | `## Every session` | The startup lines: the hook adds Current State (and where to read it if missing); read `SOUL.md` and `PROJECT.md`, again after compaction; before editing in `memory/` or `requirements/`, read that folder's `AGENTS.md`; Codex reads the always-on rules listed under Rules. Then the 5-line main rule from section 3. | 14 |
| 2 | `## Project map` | One bullet per root folder the agent reads or writes, with sub-bullets for `work-items/`, `memory/`, `delivery/`, `tools/`, and `.claude/`. Each says what goes there, when, why, and whether Git keeps it. No file-by-file list. | 28 |
| 3 | `## What the owner decides` | Kept. Exact repeats of `keep-work-item-current.md` trimmed. "Never write to production" moves here. | 18 |
| 4 | `## Where information goes` | Kept, because rules cite it. Only homes that are not a folder: decisions, Current state, owner preferences, memory, glossary, rules and skills. | 22 |
| 5 | `## Work items and memory` | Replaces "Work tracking" and "Memory": the ID format, "this is the only tracker", memory changes only through the memory skills, never store secrets. | 8 |
| 6 | `## Skills` | One opening line, one situation line per installed skill (up to 24), and the "never instead of them" line. | 29 |
| 7 | `## Commands` | Kept. | 11 |
| 8 | `## Rules` | The generated list, with its markers and intro lines exactly as today. | 30 |
| 9 | `## How to write replies` | Kept word for word. | 13 |
| | **Total** | Hard limit 200. | **186** |

### Where every part of today's 278 lines goes

| Today's lines | Goes to |
| --- | --- |
| 1-13, opening | Kept (line 9's fill-in guide is still deleted when setup finishes). |
| 17-27, startup lines | "Every session". |
| 28, "these lines stay after compaction" | Reworded as the Skills opening line: the host's own list may be shortened or dropped; this one is always here. |
| 29-43, phrase lines | One situation line per skill in "Skills". Line 29's roadmap advice moves to the `PROJECT-ROADMAP.md` map bullet. Line 30's "saves each answer" is dropped: `keep-work-item-current.md` already says it. |
| 44-62, tracker skills and the task and "we decided" lines | "Skills", one block per tracker. Line 61 (a task, phase, or sub-item goes to the work track skill) and a short form of line 62 join the work track skill's line. |
| 63-77, memory and Hindsight skills | "Skills", one block per memory choice. Hindsight detail stays in `memory-review-and-save.md`. |
| 78, method skills | The Skills opening. |
| 79-84, Salesforce skills | The Salesforce block in "Skills". Other skills cite lines 80-81, so their meaning stays. |
| 85, org aliases and "never production" | Aliases go to the `PROJECT.md` map bullet; "never production" goes to "What the owner decides". |
| 87-88, folder `AGENTS.md` and Codex rules | "Every session". |
| 90-107, What the owner decides | Kept, trimmed. |
| 108-155, Where information goes | Kept; the eight rows that describe a folder move into the map. |
| 156-196, Work tracking and Memory | Folder facts go into the map; the few rules go into "Work items and memory". |
| 197-228, Rules | Kept; the paragraph above the list shrinks to one line. |
| 229-253, Project map | Rewritten and moved up. It adds `.claude/`, `.codex/`, `.agents/`, `SOUL.md`, and `README.md`, and marks `force-app/` as made when needed (the model has none). |
| 254-266 and 267-278, Commands and How to write replies | Kept. |

Nothing moves into a new always-on rule: that would shorten `AGENTS.md` but not what loads every session (`claude-code/memory.md`, line 186).

### Weak spots and fixes

1. **The limit has no counting rule, and 250 goes past Claude Code's target.** Fix: count the file a project gets, for the largest setup, with `wc -l` and no wrapping. Hard limit 200 lines. Also cap it at about 20 KB for Codex. The docs do not say whether Mike's 3,193-byte global Codex file counts toward the 32 KiB, so plan as if it does.
2. **The folder `AGENTS.md` files never load by themselves.** Fix: keep the pointer line in "Every session" and repeat it in the `memory/` and `requirements/` map bullets.
3. **Other files depend on section names and markers, and nothing checks them.** More than 20 skills cite "How to write replies"; the session-start hook and its test name "Rules"; `project-setup` uses "Commands"; rules cite "Where information goes" and "What the owner decides". If the markers vanish, `check-rules.mjs` skips its check without a word. Fix: keep those six headings, the `toolkit:rules` markers with their exact intro lines, and the labels such as "(the work track skill)". Moving skills out of "Every session" means changing three pointers in the same edit: `keep-work-item-current.md` line 3, `handoff/SKILL.md` line 15, and `writing-a-project-skill.md` line 111 (source and 2 copies). Add a heading check to `dev/reviews/overlap-review.md`.
4. **Codex needs lines Claude Code does not.** Fix: keep "Codex: read the always-on rules" (Codex never reads `.claude/rules/`), the Current State fallback (Codex skips a hook until Mike trusts it, `codex/hooks.md`, "Review and trust hooks"), the rules list, and "How to write replies" (Codex has no output style).
5. **A plain folder list is what `/doctor` would cut.** Fix: list only folders the agent reads or writes, and say what, when, why, whether Git keeps it, and which skill writes it.
6. **The skills list can drift from the skill descriptions, or list skills a project lacks.** Fix: build it with the setup markers; take each note from the skill's own "Use when" words; the overlap review (check O5) compares the two.
7. **Existing projects cannot get the new layout.** `update.md` line 88 only changes named lines. Fix: add a second way: build a fresh file for the project's choices, carry over his filled and added lines, show him the whole file, and write it after his yes.
8. **Two loose ends.** The skill's copy of the model is 2 lines behind (it lacks the voice-to-text line): re-import once after the change. OpenAI's "Harness engineering" article ("a map, not a manual") exists only in a scratch folder: capture it into `ai-external-knowledge/` before any design cites it.

## 5. How the two fit together, and what changes on a yes

They are one change. Idea 2's Skills list is the insurance Idea 1 keeps, and Idea 1's main rule lives in Idea 2's "Every session". Each place then has one job:

- **Skill descriptions** pick the skill for a new request.
- **The `AGENTS.md` Skills list** picks by situation and is always in the file, even after compaction.
- **The work item's Next action** says what comes next on work already under way.

If Mike says yes:

- **Model files** (branch `toolkit-v2/approved-changes`, committed as Mike Rihm): `AGENTS.md` rewritten to the outline; `WORK-ITEM.md` line 33 in the new format; `keep-work-item-current.md` gets the format, "the fields win", and its new pointer. `memory/CURRENT_STATE.md` does not change.
- **Toolkit files:** `work-item-format.md` (lines 137, 309, 331); the Next action wording in every skill that writes it (`work-refine`, `solution-design`, `work-on`, `work-check`, `work-finish`, `work-delegate`, `work-status`, `handoff`, `publish-docs`, and `approvals.md`); the Notion work-item page; `writing-a-project-skill.md` (add a situation line, not a phrase line); `skills-hooks-settings.md` line 178; `update.md` (the second way); `handoff/SKILL.md` line 15. Each is read by the wording and overlap reviewers. Then re-import the model and raise the plugin version.
- **Checks:** `check-rules.mjs`, `check-skills.mjs`, the hook tests, and `claude plugin validate`. Build all 18 setups' files: none over 200 lines or 20 KB, no markers left.
- **Routing test, both hosts, before and after,** 3 runs per request. Add about 8 situation requests with no trigger words: two active items and "ok lets keep going"; an answer with no skill words; the Codex "b but keep finance out" follow-up; "next question" after `/compact`; a Notion card moved by hand; "whats next"; a helper agent started by `solution-design`; and "hi" at the start with an item open (nothing may be built). Add near misses too. The Codex routing run has no results file yet, so the "before" run finishes it. The new version must score at least today's 60 of 63 in Claude Code.
- **In one test project:** `/memory` (confirm the folder files do not load), `/compact` then the Skills row in `/context` (settles the docs' disagreement), `/status` (size warnings), and `/doctor` prompt-audit.
- **The pending baseline review:** some of its 7 routing findings propose phrase lines; settle them against the new layout in the same pass.
- No new hook job and no new code, so the Code limit is untouched.

## 6. Questions for Mike

1. Do both ideas as one change, in the narrowed form above? Recommended: yes.
2. Hard limit of 200 lines and about 20 KB, counted on the largest setup's file after setup (drop "max 250")? Recommended: yes.
3. Next action names one of the six stage skills, and the item's fields win when they disagree? Recommended: yes.
4. Turn the phrase lines into one situation line per skill, keeping today's phrases until the before-and-after test shows which matter? Recommended: yes.
5. Run the routing test in both hosts before and after (last time each Claude Code list cost about 35 to 38 US dollars)? Recommended: yes.

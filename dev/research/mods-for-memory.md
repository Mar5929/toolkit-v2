# Mods for project memory: a plan for Mike to decide on

Whether Claude Code mods could make Claude follow the memory procedures more reliably, and how. Written 2026-10-02. Research only: nothing was built, installed, or changed.

## Contents

0. How to read this page
1. The short answer
2. Where the memory procedures go wrong today
3. What a mod could do about each problem
4. Three options, smallest to largest
5. Recommendation and phased plan
6. What not to do with mods
7. Open questions the docs leave unanswered

---

## 0. How to read this page

Words used on this page:

- **Mod**: a Claude Code plugin that carries a small JavaScript or TypeScript program. Claude Code runs that program inside itself, and it can watch or change what Claude is about to do (`mods/overview.md`, opening paragraph and the Note under it).
- **Settings hook**: a command that Claude Code or Codex runs at a set moment, listed in a settings file. The toolkit's three hooks (`session-start.mjs`, `prompt-reminder.mjs`, `codex-after-commit.mjs`) are this kind.
- **`PreToolUse` and `PostToolUse`**: the two settings hook moments that matter here. The first runs just before a tool call, the second just after it.
- **Tool call**: one action Claude takes, such as running an `ntn` command (`ntn` is Notion's own command-line tool) or editing a file.
- **MCP tool call**: a call to a tool that an outside service gives Claude, such as the Notion connector's tools.
- **Read back**: reading a record again right after saving it, to check the save is really there.
- **Schema**: the list of a database's columns and the values each column allows.

Citations:

- `mods/<file>.md`, "<heading>" means `ai-external-knowledge/claude-code/mods/<file>.md`, under that heading. `claude-code/` and `codex/` paths are in `ai-external-knowledge/` too.
- "The guide" is `dev/research/claude-code-mods.md`.
- `<setup>` is `plugins/toolkit/skills/project-setup/`, as in `AGENTS.md`. Three skill folders have short names:
  - MPM is the `managing-project-memory` skill: `<setup>assets/.skill-sets/memory-process/managing-project-memory/`.
  - NSPM is the Notion `storing-project-memory` skill: `<setup>assets/.skill-sets/notion-memory/storing-project-memory/`.
  - LSPM is the local `storing-project-memory` skill: `<setup>assets/.skill-sets/local-memory/storing-project-memory/`.
- `v2-skills-first/` is `dev/test-runs/v2-skills-first/`. Git ignores that folder, so it exists only in the main checkout, not in this worktree.

## 1. The short answer

- **Can mods help?** A little. A mod can check each memory write against the fixed formats (fields, Lore's names, templates, Current State limits) and show memory state on screen. It cannot make the judgment calls (worth keeping? project-wide? the same fact in other words?), and those caused most mistakes in the tests.
- **The main catch:** mods run only in Claude Code 2.1.287 or later (this Mac has 2.1.280), so Codex gets none of it. The same checks can run as a settings hook, which works in both hosts.
- **Every option is new code,** so each needs Mike's yes under the code limit, with its size.

## 2. Where the memory procedures go wrong today

### How old the evidence is

- The current memory skills (`managing-project-memory`, `storing-project-memory`, `using-notion-cli`) were built on 2026-10-01 at 23:03 (commit 49b1e8f) and changed on 2026-10-02 (b62520c). **No live test has run them yet.**
- The skills-first live runs (`v2-skills-first/`) all ran on 2026-10-01, before that rebuild, so they used the older memory skills (`notion-memory-save` and the others). Rows 1 to 3 come from the two stage 4 Codex runs that morning (`s4-cx-ios-notion/`, `s4-cx-sf-local/`). The afternoon runs there checked "update the toolkit", skill routing, and four setup rechecks; none tested memory saves.
- The runs in `dev/test-runs/` from 2026-09-27 and 2026-09-28 used the retired `toolkit` program. Its `toolkit memory save` command did some checks in code then, so format mistakes there were partly caught by code that no longer exists. In those runs Current State was still called the current focus (`CURRENT_FOCUS.md`).
- Items marked "static review" were found by reading the skill text, not by watching an agent.

### What went wrong

Tags: **format** (a template or format mistake), **step** (a missed step), **field** (a wrong field or schema name), **duplicate** (a missed duplicate check), **approval** (a missed approval), **drift** (Current State drift).

| # | What went wrong | Tag | Evidence | Fixed in skill text since? |
| --- | --- | --- | --- | --- |
| 1 | The agent never asked "This looks project-wide. Save it to memory too?" after three project-wide decisions. It asked about an item-only choice instead. Codex, Notion memory. | step | `v2-skills-first/s4-cx-ios-notion/evidence.md:78` | Yes, in 0.4.8 (`dev/PROGRESS.md:87-92`). Not re-tested. |
| 2 | The same question was never asked in a local-memory project, so no decision record and no work item link were made. The agent did not reopen the reference that holds the step. | step | `v2-skills-first/s4-cx-sf-local/evidence.md:121-122`, `:148-151` | Same as 1. |
| 3 | Current State was last written at message 14 and missed the later design approval, the new item, and the finished task. | drift | `v2-skills-first/s4-cx-sf-local/evidence.md:202-206` | Partly: MPM `references/current-state.md:22` names who removes which line. |
| 4 | An unanswered "Save to memory?" was dropped, 3 tries out of 3. No proposal was kept. | step | `dev/test-runs/confirm-d-hindsight/evidence.md:18-23` | Yes: MPM `references/saving.md:75-82`. |
| 5 | The code duplicate check (a word-similarity score, cut-off 0.6) let a reworded copy through ("Explain each ..." against "Document every ..."). | duplicate | `dev/test-runs/confirm-d-hindsight/evidence.md:24-27`, `:123`, `:314-326` | The check is gone with the program. MPM `references/saving.md:25` now says to search before every save. |
| 6 | A fact Mike mentioned in passing was saved without asking, and the record says "Approved by Mike Rihm". | approval, field | `dev/test-runs/final-notion/evidence.md:36`, `:290-300` | The rule stands in MPM `SKILL.md:26-27`. Not re-tested. |
| 7 | A Notion memory's "Approved by" column held a sentence, not a person. | field | `dev/test-runs/open-bugs.md:102` | The column is now Authorization with three fixed forms (NSPM `references/database-layout.md:50`). |
| 8 | Body labels were written as plain text or as `##` headings, not the template's bold labels. | format | `dev/test-runs/open-bugs.md:26`, `:87` | Text only: LSPM `SKILL.md:28` (gotcha). |
| 9 | Current State lost its heading and its "Last updated:" line, and later sessions copied the broken form. | drift, format | `dev/test-runs/open-bugs.md:56`, `:86` | Text only: NSPM `references/current-state-page.md:9`. |
| 10 | Current State's "Next session starts with" stayed stale for four sessions. | drift | `dev/test-runs/open-bugs.md:12` | Partly (row 3). |
| 11 | A "check at the next session" line for Mike stayed in Current State for the whole run. | drift | `dev/test-runs/open-bugs.md:18` | Yes: MPM `references/current-state.md:22`, `:30-37`. |
| 12 | An instruction ("Keep required attribution lines.") was saved in a memory record instead of the rules. | step | `dev/test-runs/open-bugs.md:82` | Yes: MPM `references/saving.md:84-90`. |
| 13 | Static review: the old Notion save skill could ask "Save to memory?" before searching for the existing record. | duplicate | `dev/reviews/skill-audit-2026-10-01/report.md:480-484` | Yes: MPM `references/saving.md:23-31`. |
| 14 | Static review: the old local save skill deleted a memory file for good without naming it first. | approval | `dev/reviews/skill-audit-2026-10-01/report.md:435-438` | Partly: MPM `references/tidying.md:27`, LSPM `references/folders-and-files.md:61`. |
| 15 | Static review: from a worktree, relative `memory/` paths found nothing, so the agent would say "nothing recorded". | step | `dev/reviews/skill-audit-2026-10-01/report.md:439-441`, `:447-449` | Yes: LSPM `SKILL.md:20`. |
| 16 | Code fact: when Current State has no readable "Last updated:" date, the session-start hook counts it as 0 days old, so it never asks for a prune because of age. It still asks when Current State is 40 lines or more. The tests expect this for an unfilled template, so a Current State that lost its date line (row 9) is never called old. | drift | `<setup>assets/hooks/session-start.mjs:38-39`; `dev/tests/hooks.test.mjs:137-138` | n/a |
| 17 | Risk, not yet seen: a new Notion memory page needs about 17 columns set right, and Keywords must repeat the Record Key. The skill lists the second as a gotcha. | field | NSPM `references/writing-pages.md:30-50`; NSPM `SKILL.md:35` | n/a |

### What this shows

- **Most real failures were missed steps** (rows 1, 2, 4, 12). Each one started from a judgment: is this decision project-wide, is this an instruction or a fact. Code can remind Claude at the right moment, but it cannot decide.
- **Format, field, and Current State mistakes are the part code can check** (rows 7, 8, 9, 10, 16, 17). The formats are fixed, written down, and checkable.
- **Duplicates:** code can check that a search happened. Row 5 shows code cannot reliably tell that two differently worded records mean the same thing.
- **Notion in Claude Code** has no live evidence yet for the current skills. Row 17 is a prediction from the size of the format, not a seen failure.

## 3. What a mod could do about each problem

How memory reaches Notion in Claude Code: the agent runs `ntn api ...` through the Bash tool (NSPM `references/writing-pages.md:24-26`; `using-notion-cli` `SKILL.md`). The Notion connector is a fallback only (`using-notion-cli` `references/ntn-commands.md:26`). So a memory check watches Bash calls whose command starts `ntn api` and names the Memories data source or the Current state page, plus the connector's tools.

What each kind of mod piece does, from the docs:

- **A hook on `tool.call`** sees each tool call before it runs, including Bash commands and MCP tool calls. It can refuse the call with a reason Claude reads, change it, or let it run and then look at the result (`mods/events.md`, "Guard or change a tool call").
- **`$.ui.ask`** holds a tool call and puts a question to Mike in the question dialog, with options he picks (`mods/events.md`, "Hold a tool call until the user decides").
- **Shared variables** let one hook remember what another saw in the same session, for example "a Memories search ran this turn" (`mods/overview.md`, "What a mod can do").
- **`$.ui.status`** keeps one line under the prompt; **`turn.complete`** can show a line under Claude's answer (`mods/api.md`, "Show something without starting a turn"; `mods/events.md`, "Follow a turn").
- **`$.fs.read`** and **`$.process.run`** read files and run programs such as `ntn`, with Mike's permissions (`mods/api.md`, "Reach files, processes, and the network").

What a settings hook can do in the same places:

- In Claude Code, a `PreToolUse` hook can refuse a call or ask Mike, and a `PostToolUse` hook can add text for Claude after the call (`claude-code/hooks.md`, "PreToolUse decision control" and "Add context for Claude").
- In Codex, `PreToolUse` can refuse Bash and MCP calls and `PostToolUse` can add text for Claude (`codex/hooks.md`, "PreToolUse", "PostToolUse", "Tool coverage"). Codex does not support "ask" yet (`codex/hooks.md`, "PreToolUse").
- A settings hook keeps nothing between calls. To know "a search ran this turn" it needs a small state file, because the transcript file may lag in Claude Code and is not a stable format in Codex (`claude-code/hooks.md`, "Common input fields"; `codex/hooks.md`, "Common input fields").

The docs' own advice: a settings hook is the pick when "you want to block, allow, or log an event with a script you already have"; a mod is the pick for "a pane, a band above the prompt, a custom command, or to rewrite an event". And: "If a settings hook, a skill, or an MCP server already does what you need, compare them before you write a mod" (`mods/overview.md`, "Compare mods, settings hooks, skills, and MCP servers" and "What a mod can do").

### Problem by problem

| Problem (rows in section 2) | What a mod could do | Mod piece | Checks, blocks, reminds, or shows | The same job as a settings hook | As a skill line | Best fit |
| --- | --- | --- | --- | --- | --- | --- |
| **Format** (8, 9) | After a memory write, read the page or file back and compare it with the template: the section layout, the six bold labels, "Gotchas and lessons" last, no angle-bracket prompt or `{{` left. Add a note to the tool result naming what to fix. | Hook on `tool.call` for Bash, Edit, Write, and the connector; after `next` | Checks, reminds | Same check in `PostToolUse`, in both hosts | Exists: LSPM `references/record-format.md:137-144`, NSPM `references/database-layout.md:71-79`. Rows 8 and 9 show it gets skipped. | Settings hook |
| **Field** (6, 7, 17) | Before a create or change of a Memories page, check the request: every column name is one of Lore's or the toolkit's, Status, Kind, and Tags hold allowed values, Record Key is `<prefix>_<slug>` of 60 characters or fewer, Keywords equals Record Key, Authorization has one of its three forms. Refuse with the exact fix. The allowed names come from the skill's own `assets/schema/` files, so there is one source. | Hook on `tool.call`; before `next` | Checks, blocks | Same check in `PreToolUse`, in both hosts | Exists: NSPM `references/database-layout.md:36-57` | Settings hook |
| **Duplicate** (5, 13) | Remember whether a Memories search ran in this turn. Refuse a new Memories page when none did: "Search Memories for this concept first." It checks that the step happened, not that Claude judged the results right. | Hook on `tool.call` plus a shared variable reset on `turn.start` | Checks, blocks | Possible, with a state file written by `PostToolUse` and read by `PreToolUse`. That is more code, and one more file that must stay correct. | Exists: MPM `references/saving.md:23-31` | Mod does it more simply; a settings hook is possible |
| **Approval** (6, 14) | Hold a delete (Notion `in_trash: true`, or `rm` on a memory file) and ask Mike in the question dialog, naming the record by its title. His pick is the approval. For saves it would mean a second question after Claude's own chat question, unless the approval process changes. | Hook on `tool.call` with `$.ui.ask` | Blocks until Mike answers | Claude Code: `PreToolUse` "ask" shows the permission prompt with a reason (`claude-code/hooks.md`, "PreToolUse decision control"). Codex: no "ask"; each `ntn` call already asks for escalated permission (`using-notion-cli` `SKILL.md:26`). | Exists: MPM `SKILL.md:18`, `:22-37` | Deletes: settings hook "ask" in Claude Code, or no code. Saves: leave to the skill. |
| **Step** (1, 2, 4, 12) | Right after a write that adds a Questions and Answers row, add one line for Claude: "If this decision passes the project-wide test, end this reply with 'This looks project-wide. Save it to memory too?'". The decision stays Claude's. | Hook on `tool.call`; after `next` | Reminds | Same as a `PostToolUse` line in both hosts, the pattern `codex-after-commit.mjs` already uses for commits | Exists: MPM `references/saving.md:48-58` | Settings hook, if the live test shows it is still missed |
| **Drift** (3, 9, 10, 11, 16) | After a Current State write, read it back: "Last updated:" is today, the four headings are there, each section is within its limit (5, 5, 7, 3), the whole is under 40 lines. Show Current State's age and size on the status line all session. | Hook on `tool.call` after `next`; `$.ui.status` | Checks, reminds, shows | The check: `PostToolUse`, both hosts. The live display: mod only. | Exists: MPM `references/current-state.md` | Check: settings hook. Display: mod. |

What no mod can do here: decide what is worth keeping, which concept a fact joins, whether a decision is project-wide, or whether two records mean the same thing. Those are Claude's judgment, and Mike's rule for what a skill holds says never to tell Claude how to reason (`dev/GOAL.md:780-789`).

## 4. Three options, smallest to largest

All three are mods, so all three share these facts:

- **Version.** Mods need Claude Code 2.1.287 or later (`mods/overview.md`, "Turn mods on or off"). This Mac's `claude` printed `2.1.280` on 2026-10-02.
- **Codex.** No captured page says Codex runs mods. Codex hooks run only commands and MCP tool calls (`codex/hooks.md`, "Config shape"; the guide, section 11). A mod's checks would not run in Codex.
- **Code limit.** A mod is code a project runs. The code limit allows only the three hook commands (plus a Salesforce project's own code from the model), and a new command or a new job for one needs Mike's yes first, with its size in plain numbers (`dev/GOAL.md:42-51`). For scale, counted with `wc -l` on 2026-10-02: the three hook commands are 151 lines together (`<setup>assets/hooks/`), and their tests are 443 lines (`dev/tests/hooks.test.mjs`).
- **Where it would live** changes a settled decision either way:
  - in the `toolkit` plugin, it would load in every Claude Code session on the Mac, while the plugin "holds only `project-setup` and no hooks" so that "nothing runs in other projects" (`AGENTS.md`, Rules, "Machine-wide plugin"); or
  - in each project, as a skill folder that is also a plugin (`claude-code/skills.md`, the "Skill folder as a plugin" line); the mods pages never say whether a mod can live there (the guide, section 16).
- **Failure.** A hook that throws an error, or runs past its 10-second limit, before it decides is skipped, so the action goes ahead ("fails open": a broken check lets everything through) unless the mod adds a `.catch` handler (`mods/events.md`, "Handle a hook that fails"; `mods/reference.md`, "Limits").
- **Change.** "The events and methods can change between releases" (`mods/create.md`, "Get type definitions for your version").
- **Tests.** Mod tests are `.test.ts` files run by `claude plugin test`, not `node --test` (`mods/test.md`, "Write a test"). That is a second test setup to keep.
- **Sizes below are estimates** from the work each option needs, not measured code.

### Option 1: a memory status line (shows only)

- **What gets built:** one mod. At session start it reads `PROJECT.md`, "Toolkit settings", for the memory type and the ids. It watches memory writes without changing them. It keeps one line under the prompt, for example: `Memory: Current State 3 days old, 22 lines · 2 proposals waiting · last save: project_deploys, read back`. For Notion it reads with `ntn`, only at start and after a memory write.
- **Size (estimate):** about 100 lines of JavaScript, 20 lines of manifest and settings, and 80 lines of tests: about 200 in all.
- **What Mike sees:** that one line under the prompt in the terminal. The overview says what a mod draws also appears in the desktop app's Code tab, apart from terminal-only elements (`mods/overview.md`, "Where mods run"), but no page shows the status line there. Claude's behavior does not change.
- **Cost (estimate):** no model calls. The docs do not say whether a status line adds anything to what Claude reads (section 7, question 5). A few `ntn` reads per session. Upkeep: follow Claude Code releases.
- **Effect on his decisions:** needs his yes under the code limit. Codex shows nothing, but no behavior differs between hosts, so the toolkit still works the same in both.
- **Risks:** no effect until Claude Code is updated; a wrong count would mislead him. The documentation pages do not say how to clear the line; the older GitHub types file says passing `undefined` clears it (section 7, question 6).

### Option 2: a memory write checker (checks, reminds, blocks a few things)

- **What gets built:** Option 1, plus the hooks in section 3:
  - before a Memories write: the field checks, and the "search first" check;
  - after a memory write: read it back and check the template; tell Claude what to fix;
  - after a Current State write: the date, headings, and limits check;
  - before a memory delete: the question dialog naming the record;
  - after a Questions and Answers row is added: the one-line project-wide reminder.

  The rules come from the skill's own `assets/schema/` and template files, so a change to Lore's layout or a template needs no second edit.
- **Size (estimate):** about 400 to 550 lines of JavaScript and 250 to 350 lines of tests: about 650 to 900 in all, four to six times the three hooks together.
- **What Mike sees:** the status line; a question dialog before a memory delete; now and then Claude saying it fixed a memory page because a check refused or flagged it.
- **Cost (estimate, not measured):** no model calls while every check passes. Each refusal or note adds a short reason for Claude to read and usually one more request to the model, when Claude fixes the write. One extra Notion read per memory write. Upkeep: the checks must match the skills; Claude Code releases.
- **Effect on his decisions:** a large new piece under the code limit. Codex gets none of it. The field, template, Current State, and reminder checks could instead be one settings hook in both hosts; the "search first" check would need a state file there; the delete dialog has no Codex form.
- **Risks:**
  - The check reads command text. An `ntn` body can be inline JSON in single quotes or a file passed with `-d @file`. A check that cannot read the command must let it through, or it will refuse good saves.
  - A refused agent may switch to the Notion connector or another command form, so every path must be covered.
  - Fails open on a crash, unless a `.catch` handler refuses instead (`mods/events.md`, "Handle a hook that fails").
  - It cannot catch meaning (section 2, row 5).

### Option 3: a memory control panel (full)

- **What gets built:** Option 2, plus:
  - a pane listing concepts, open proposals with Approve and Reject buttons, and Current State with a Remove button per line (`mods/interface.md`, "Pick where to draw"), opened by a command such as `/project-memory`. It cannot be `/memory`: that is Claude Code's own command (`claude-code/memory.md`, "View and edit with `/memory`"), and a mod cannot take a built-in command's name (`mods/api.md`, "Add a command");
  - save approvals through the question dialog (Save / Keep as proposal / Don't save), with the Status and Authorization columns set by the mod;
  - the real ids written into the `storing-project-memory` text when the skill loads, through the `skill.prompt` event (`mods/reference.md`, "Prompts and what Claude reads");
  - a line under each answer listing what memory changed in that turn (`mods/events.md`, "Follow a turn").
- **Size (estimate):** about 1,200 to 1,800 lines of code and 500 lines of tests.
- **What Mike sees:** a memory pane, approval dialogs, and a summary line after each turn.
- **Cost (estimate, not measured):** drawing calls no model; Notion reads to fill the pane. High upkeep: drawings differ between the terminal and the desktop app (`mods/reference.md`, "Elements"), and a pane the mod opens by itself needs a wide window (`mods/interface.md`, "When a pane waits for a wider terminal").
- **Effect on his decisions:** far past the code limit. It changes the approval process in `managing-project-memory`, so Claude Code (dialogs) and Codex (chat questions) would run two different processes. Each instruction would no longer live in one file. It is the retired-program pattern again: code doing the memory work (`dev/GOAL.md:110-147`, "Direction change").
- **Risks:** everything in Option 2, plus drawings breaking across releases, and questions asked twice.

### The three side by side

| | Option 1: status line | Option 2: write checker | Option 3: control panel |
| --- | --- | --- | --- |
| Changes what Claude does | No | Yes, on format, field, and Current State mistakes | Yes, and changes the approval process |
| Size, code and tests (estimate) | about 200 lines | about 650 to 900 lines | about 1,700 to 2,300 lines |
| Tokens (estimate) | none expected | a little, only when a check fails | a little, only when a check fails |
| Codex | shows nothing; no behavior gap | none of the checks | none of it; two processes |
| Needs his yes under the code limit | yes | yes | yes, and a change to his settled decisions |

## 5. Recommendation and phased plan

**Recommendation: do not build a memory mod now.**

- Mods do not run on this Mac yet (2.1.280; they need 2.1.287).
- The current memory skills have never run live, so we do not know which mistakes still happen.
- The checking that would help most (formats, fields, Current State) works as well as a settings hook, and a settings hook runs in Claude Code and Codex. The docs say to compare before choosing a mod.
- The biggest failures seen are judgment and missed steps. A mod can only remind about those, and a settings hook can remind the same way.
- A mod is worth building only for what only a mod can do: showing memory state on screen, and checks that need to remember earlier calls in the session.

### Mike decides first

1. **Code limit:** may memory get new checking code at all, and up to what size? (The options are estimated at about 200 to about 2,300 lines. Today all hook code is 151 lines, counted.)
2. **Codex:** must every check also run in Codex? If yes, checks go in a settings hook, not a mod.
3. **Block or tell:** should a check refuse a bad memory write, or only tell Claude after it lands so Claude fixes it?

### Phases

| Phase | What | Code | Needs |
| --- | --- | --- | --- |
| 1 | Run the memory test (finish item 8, `dev/GOAL.md:95-98`) on the current skills: Notion memory in Claude Code first, then Codex. About 10 owner messages, sent by a test agent on the Sonnet model. After each turn a checker reads every memory page and Current State and counts the six tags in section 2. For cost: the two stage 4 Codex runs (32 and 31 owner messages) used about 19M and 27M input tokens, mostly cached (`v2-skills-first/s4-cx-sf-local/evidence.md`, "Cost"; `s4-cx-ios-notion/evidence.md:7`, `:12`). Estimate, not measured: a 10-message run should use less than a third of that. | none | Mike's yes to the run; the Notion test area |
| 2 | Only if Phase 1 shows format, field, or Current State mistakes: one "check after a memory write" settings hook (`PostToolUse`), in both hosts. It reads the rules from the skill's `assets/schema/` and template files and tells Claude what to fix. It blocks nothing. An estimated 150 to 250 lines plus tests. | new command | Mike's yes with the size; Mike trusts the new entry in Codex `/hooks` (`AGENTS.md`, Rules, "Hooks") |
| 3 | Only if Phase 1 shows the project-wide question still missed: one reminder line after a Questions and Answers row is written, in the same hook as Phase 2. An estimated 20 more lines. | new job | Mike's yes |
| 4 | Optional, after Claude Code 2.1.287 or later is installed and only if Mike wants to see memory state: Option 1, the status line mod. Claude Code only; no behavior change. | new mod | Mike's yes; where it lives (section 4) |
| Not planned | Option 2 as a mod, and Option 3 | | |

A smaller change Mike may want, separate from mods: the session-start hook could print one line when Current State has no "Last updated:" date (section 2, row 16). It is part of the hook's existing job, a few lines, and its test at `dev/tests/hooks.test.mjs:137-138` would change.

## 6. What not to do with mods

- **Do not rebuild a memory-save program as a mod tool.** A mod can register a tool Claude calls (`mods/api.md`, "Add a tool"). A `memory_save` tool that fills every field would be the retired `toolkit memory save` again, which Mike replaced with skills (`dev/GOAL.md:110-147`, `:1010-1020`).
- **Do not ask a model to judge memory.** A mod can call a model (`mods/api.md`, "Call a model"). The end-of-reply check, a model-judged check, ran 126 times with 1 false alarm and 0 real catches, and Mike dropped it (`dev/PROGRESS.md:76-77`). It would also tell Claude how to reason (`dev/GOAL.md:786`).
- **Do not rewrite skill or prompt text at run time.** `skill.prompt` and `prompt.section` can change what Claude reads (`mods/reference.md`, "Prompts and what Claude reads"). Claude Code would then read different instructions from Codex, an instruction would no longer live in one file (`AGENTS.md`, Rules, "Skills", the "Memory skills" bullet), and text that changes between requests breaks the prompt cache, the saved copy of earlier input that makes later requests cheaper (`mods/events.md`, "Rewrite or add to a prompt").
- **Do not approve memory writes with `tool.check`.** A mod can approve a call before Mike is asked, and on a machine without managed settings or a Team or Enterprise plan it can even approve a call a deny rule refuses (`mods/permissions.md`, "Extend permissions with hooks"). That would take approvals away from Mike.
- **Do not make a duplicate checker block saves.** A word-similarity check missed a reworded copy (section 2, row 5), and a false match would refuse a real save.
- **Do not rely on a mod as a safety guard.** It fails open by default (`mods/events.md`, "Handle a hook that fails"), Anthropic can turn installed mods off remotely (`mods/troubleshoot.md`, "Check whether mods can load"), and `disableAllHooks` stops them (`mods/overview.md`, "Turn mods on or off").
- **Do not write to Mike's Notion through `$.mcp.call` before a live test.** The docs and the types file disagree on whether it asks for permission (the guide, section 17).
- **Do not add a mod for Hindsight memory.** Hindsight runs as Hindsight, through its own add-on (`dev/GOAL.md:831-843`).
- **Do not redraw Claude Code's own messages or tool rows for memory** (`mods/interface.md`, "Change what Claude Code already draws"). It adds upkeep and makes nothing more reliable.

## 7. Open questions the docs leave unanswered

1. **Reloading from Mike's marketplace.** Does a mod in a plugin loaded in place from a local-folder marketplace reload when its file is saved? The loading page says only "next session start or `/reload-plugins`" (`mods/plugins-loading.md`, "In-place and copied plugins"; the guide, section 16).
2. **A mod per project.** Can a skill folder that is also a plugin (`claude-code/skills.md`, "Skill folder as a plugin") hold a mod? The mods pages never mention it. The skills page, captured on 2026-09-27 before mods were documented, says changes to such a folder's `hooks/` need `/reload-plugins` (`claude-code/skills.md`, "Edit a skill during a session"). Codex reads `.agents/skills`, which links to `.claude/skills`; what Codex does with a plugin folder there is not tested.
3. **Notion through a mod.** Does `$.mcp.call` reach a claude.ai connector such as Notion, and does it ask for permission? The sources disagree (the guide, section 17).
4. **The question dialog in the desktop app.** The dialog's drawing works in the terminal and the desktop app (`mods/reference.md`, "Render sites"), but no page shows `$.ui.ask` running in the desktop Code tab, where Mike works.
5. **Context cost.** Does a loaded mod add anything to what Claude reads each turn? The docs do not say (the guide, section 16).
6. **The status line.** The documentation pages do not say how a `$.ui.status` line is cleared, or whether two mods can each keep one. The older GitHub types file says each plugin keeps one line and passing `undefined` removes it (`mods/types-claude-code.d.ts`, the `status` method of `$.ui`; the guide, section 4.1). Check this against the types file the installed version writes.
7. **Mods and settings hooks on the same call.** The order is documented for `PreToolUse` (`mods/events.md`, "Where settings hooks run in the order"), not for `PostToolUse` or the extra text each adds.
8. **Mike's plan.** Whether deny rules hold over a mod depends on managed settings or a Team or Enterprise plan (`mods/permissions.md`, "Extend permissions with hooks"). The docs cannot tell us which applies to Mike.
9. **Stability.** The mods pages warn that events and methods can change between releases (`mods/create.md`, "Get type definitions for your version"), and the GitHub types file still says "EARLY ACCESS" (`mods/types-claude-code.d.ts`). No page promises a stable version.
10. **Notion select values.** What Notion does when a write sends a Status, Kind, or Tags value that is not an option, for example adding it to Lore's column, is not in the captured pages. A field check would stop it either way. Capture the Notion API page before relying on either answer.

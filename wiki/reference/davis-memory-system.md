# How the memory system of the Davis project works

This file records how project memory is kept in Mike's Davis project, so that the Toolkit V2 team can look it up later. It was written on 2026-10-07 from the files of the Davis project (the folder `davis-advisors-sfdc`) as they were on that day. It describes what those files say and do. It recommends nothing for Toolkit V2.

No plugin ships this file, and setup never copies it into a project.

Mike asked for this file on 2026-10-07, after he pointed to one Davis session as the example Toolkit V2 projects should follow. That session is described in `how-the-owner-works-with-agents.md`, in the section "A session the owner named as the example to follow".

## How to read this file

- A path that starts with `engagement/`, `.claude/`, or `tools/` is inside the Davis project. A path that starts with `~/.claude/` is in the owner's own `.claude` folder on the computer. The Windows user name in a path is replaced with `<user>`.
- People other than the owner are named by role only, in square brackets, such as "[the client contact]". The file holds no email address, no record ID, and no content of a memory record. It gives forms and counts only.
- "The main agent" is the agent the owner talks to in a session. "The memory helper" is the separate agent `davis-memory-curator`, which the main agent starts for memory work. The Davis rule calls starting the helper "dispatch".
- Every count was taken on 2026-10-07.

## What the system is made of

The system is a folder of memory files inside the project, one page of what is true now, one helper agent that writes both, one rule that tells the main agent when to start the helper, and two small hook commands. The table has one row per part.

| Part | Where it is | What it does | What loads or runs it, and when |
| --- | --- | --- | --- |
| The memory folder | `engagement/_memory/` | It holds the index and 99 memory records. Git tracks the folder, so memory is pushed to GitHub with the project. | The memory helper writes it. The main agent opens a record when it needs one. |
| The link from the Claude Code memory path | `~/.claude/projects/C--Users-<user>-Documents-Claude-Projects-davis-advisors-sfdc/memory` | It is a Windows directory junction that points to `engagement/_memory/`. Claude Code's own memory feature reads and writes at this path, and the files land in the project folder. | The owner makes it once on each computer, with the PowerShell command in the dispatch rule. Git does not carry it, so a fresh clone has no link until the command is run. |
| The index | `engagement/_memory/MEMORY.md` | It holds one line for each record, in the form `- [file.md](file.md) — one-line description`, under 11 group headings. It is 135 lines and 19,306 bytes. | The dispatch rule and `CLAUDE.md` say Claude Code loads it at the start of every session through the link. The memory helper changes it in the same run in which it adds, renames, or deletes a record. |
| The records | `engagement/_memory/<type>_<topic>.md` | Each record covers one topic. The file name starts with the type: 51 `project_`, 30 `reference_`, 17 `feedback_`, and 1 `user_`. | Nothing loads a record at session start. An agent reads one after its line in the index shows it is needed. The memory helper writes them. |
| The current-focus file | `engagement/_state/CURRENT_FOCUS.md` | It is the one page of what is true now: the open work, the latest decisions, who is waiting on whom, and notes for the next session. It is 49 lines. | The line `@engagement/_state/CURRENT_FOCUS.md` in the root `CLAUDE.md` loads it into every session. The memory helper writes it. |
| The root `CLAUDE.md` | `CLAUDE.md` (67 lines) | It names the memory folder in its table of key files, loads the rules with `@.claude/rules/**`, loads the current-focus file, and names the memory helper and its rule in a table of subagents. That table ends with: "The main agent dispatches subagents in parallel (`run_in_background: true`) so user-facing work is not blocked." | Claude Code loads it at the start of every session. |
| The root `AGENTS.md` | `AGENTS.md` (1 line) | It says only "Read @Claude.md". | A host that reads `AGENTS.md` is sent to `CLAUDE.md`. |
| The memory helper | `~/.claude/agents/davis-memory-curator.md` (276 lines) | It is the definition of the agent `davis-memory-curator`. Its front matter holds `model: opus` and `memory: project` and no `tools:` line, so the helper has every tool. Its text says what the helper owns, what it does not own, what belongs in memory, the file naming, the steps of one run, and when to ask. | The main agent starts it with the Agent tool. The definition is in the owner's own `.claude` folder, so Git does not carry it with the project. |
| The helper's own notes | `.claude/agent-memory/davis-memory-curator/` | The helper keeps lessons about how to do its job here, apart from project memory. The folder holds an index (`MEMORY.md`, 13 lines) and 9 note files. The 10 files are 1,183 lines in all. Two note files are large: 760 lines and 210 lines. | `memory: project` in the helper's definition gives the helper this folder. The definition tells the helper to add to it "as you discover patterns in how project memory is used". |
| The dispatch rule | `.claude/rules/memory-curator-dispatch.md` (200 lines) | It tells the main agent when to start the memory helper, how to start it, what to say to the owner, when to ask the owner first, and what the helper must keep in the current-focus file. Its full text is in "The rule, word for word" below. | It loads into every session with the other rules. |
| The work item rule | `.claude/rules/local-work-items.md` | It sets one file per work item and says which fields the agent updates when work moves. See "How the agent keeps the work items up to date". | It loads into every session. |
| The golden rules | `.claude/rules/golden-rules.md` | Rule 1 says: "Document as you build: every change must land in the framework files in the same response". The other rules are about Salesforce safety. | It loads into every session. |
| The task completion rule | `.claude/rules/task-completion-sync.md` | When the owner says a ClickUp task is complete, the agent lists the changes it would make to the ClickUp pages, waits for the owner's yes, and then asks whether to add a work log entry. | It loads into every session. It applies only to ClickUp tasks. |
| The session start rule | `.claude/rules/session-startup.md` | It tells the agent to read the project's context hub page in ClickUp after `AGENTS.md` and `CLAUDE.md`, and not to make local copies of project context unless the owner asks. | It loads into every session. |
| The rule on what always needs a question | `.claude/rules/always-clarify.md` | It lists six kinds of change that always need a question to the owner first, such as security, the object model, and which data source wins. | It loads into every session. |
| The knowledge base routing rule | `.claude/rules/knowledge-base-routing.md` | It says which knowledge base document to read for each kind of question about the Salesforce org. The knowledge base is where details of the org belong, and memory holds only a pointer to it. | Its front matter limits it to work on `force-app/**` and `engagement/knowledge-base/**`. `kb-refresh.md` is limited to paths in the same way. The other 16 rule files have no such limit. |
| The other rules the dispatch rule names | `.claude/rules/` | The dispatch rule sends seven kinds of information to other places and names six rules for them. Four of the named rules exist: `clickup-conventions.md`, `kb-refresh.md`, `component-tracker.md`, and `deployment-runbook.md`. Two do not exist: `hub-doc-protocol.md` and `work-log-protocol.md`. | The four that exist load with the other rules. |
| The hook settings | `.claude/settings.json` | It registers three hooks: one before each shell command, one on each message from the owner, and one each time the main agent stops. | Claude Code reads it at session start. |
| The list of word patterns | `.claude/hooks/_patterns.py` | It holds 46 word patterns, each with a label, in 8 groups. Both memory hooks read this one list. | The two hook commands below import it. |
| The reminder hook | `.claude/hooks/memory_curator_trigger.py` (76 lines) | It reads the owner's message and tests it against the 46 patterns. On a match it prints a reminder for the main agent that names the matched labels and the dispatch rule. With no match it prints nothing. | The `UserPromptSubmit` entry runs it on every message the owner sends, with a 10-second limit. It never stops a message: on any error it exits normally. |
| The audit hook and its log | `.claude/hooks/memory_curator_audit.py` (131 lines) and `.claude/hooks/memory_audit.jsonl` | It reads the session file, counts the messages that match a pattern and the times the memory helper was started, and adds one line to the log. It prints nothing to the agent or the owner. | The `Stop` entry runs it each time the main agent finishes a turn, with a 15-second limit. No file in the project reads the log. |
| The Salesforce guard | `.claude/hooks/sf_guard.py` | It blocks shell commands that would change a Salesforce org. It is not a part of memory, but it runs on the memory helper's shell commands too. | The `PreToolUse` entry runs it before every Bash or PowerShell command. |
| The local settings | `.claude/settings.local.json` | It allows the tools the agent may use without a question, the Agent tool among them, and turns off one MCP server. It holds no hook. | Claude Code reads it at session start. |
| The work item files | `engagement/work-items/WI-<number>-<slug>/WORK-ITEM.md` | Each open piece of work has one folder and one record file. There are 14 such folders, each with a `WORK-ITEM.md` of 133 to 347 lines. | The main agent writes them. No hook reads or checks them. |
| The model setting for helper agents | `~/.claude/settings.json` and `~/.claude/rules/subagents-run-on-opus.md` | The setting `CLAUDE_CODE_SUBAGENT_MODEL` is `opus`, and the rule says every helper agent runs on Opus. | Both apply to every project on the computer. |
| An earlier write-up of this system | `tools/memory-system-package/` | A session on 2026-09-25 wrote `IMPLEMENTATION-SPEC.md` and copied the working files into `source/`. "Where the real files differ from the earlier write-up" below compares it with the files as they are now. | Nothing loads it. |

### The form of a memory record

A record starts with front matter and then holds short text. This is the form that most records have:

```markdown
---
name: <short-name-with-hyphens>
description: "<one line that says what the record holds>"
metadata:
  node_type: memory
  type: <user | feedback | project | reference>
  originSessionId: <the ID of the session that wrote it>
  modified: <date and time of the last change>
---

<the fact, in short bullets or a short paragraph>
```

- Of the 99 records, 98 have front matter and 1 has none.
- 88 records hold `type` under `metadata`, and 9 hold `type` as a top-level key. 87 hold `node_type: memory`, 95 hold `originSessionId`, and 52 hold `modified`.
- The helper's definition gives a shorter form: `name`, `description`, and `metadata` with `type`. It says the body of a `feedback` or `project` record gives the fact first, then a line that starts "**Why:**" and a line that starts "**How to apply:**". 32 records hold a "**Why:**" line. 91 records link to another record with `[[name]]`.
- The definition says "aim for under 30 lines per file". The records run from 9 to 238 lines, half of them are 36 lines or longer, and 63 of the 99 are over 30 lines.
- The index and the folder agree: each of the 99 records has one line in the index, and each line in the index points to a file that exists.

### Where the real files differ from the earlier write-up

The earlier write-up is `tools/memory-system-package/IMPLEMENTATION-SPEC.md`, written on 2026-09-25. Its `source/` folder holds copies of the rule, the helper's definition, the three hook files, `.claude/settings.json`, and `CLAUDE.md`. All seven copies are the same as the files in use on 2026-10-07, so none of those files has changed since the write-up. The write-up's description of how the parts connect matches the files. These points differ, and most of them are counts that have grown.

| What the write-up says | What the files show on 2026-10-07 |
| --- | --- |
| The memory folder has "about 95" files, and 94 records were counted for the front matter figures. | The folder has 99 records and the index. |
| 88 records carry `node_type` and `originSessionId`. | 87 records carry `node_type: memory`, and 95 carry `originSessionId`. The 9 records with a top-level `type` and the 1 record with no front matter are still there. |
| The current-focus file was cut to 38 lines on 2026-09-24. | The file is 49 lines and 11,369 bytes. |
| The audit log is 1,384 lines and about 700 KB. | The log is 1,419 lines and 729,228 bytes, for 189 sessions from 2026-05-26 to 2026-10-07. Git still tracks it. |
| `_patterns.py` holds "~50" patterns. | It holds 46 patterns with 37 different labels. |
| The index of the helper's own notes has one line of many thousands of characters, and the largest note file is 748 lines. | The index was shortened on 2026-10-07 to 13 lines and 3,321 bytes. The largest note file is 760 lines. The folder holds 9 note files, and the write-up names 4. |
| The dispatch rule sends information to rules that are "spread across other rule files". | Two of the rule files that the dispatch rule names are not in `.claude/rules/`: `hub-doc-protocol.md` and `work-log-protocol.md`. The folder `engagement/work-log/` does not exist. The write-up does not say this. |
| In its summary of the rule, the focus group covers an "epic or work item". | In the rule, the focus group names only the epic. The work item appears under "CURRENT_FOCUS Maintenance". |
| Its chart of a session says "All .claude/rules/*.md load" at session start. Another part of the write-up says a rule with a `paths` limit is an exception, and it names no such rule. | Two of the 18 rule files have `paths` front matter and so are limited to certain files: `knowledge-base-routing.md` and `kb-refresh.md`. |

The write-up also lists faults it found, and these were confirmed in the files: the missing `engagement/_session_brain/BRAIN.md` that `CLAUDE.md` still names, the helper's definition with no `tools:` line, the Windows paths written into the helper's definition, and an audit log that gets a new line at the end of each turn and that nothing reads. On 2026-10-07 the last line of each session in the log showed more matching messages than starts of the helper for 62 of the 189 sessions. The write-up explains why that number does not prove a missed record: the hook also counts messages that the owner did not write, and one start of the helper can cover several facts.

## What happens, step by step

This order comes from the files named in each step. No Davis session was run to confirm it.

1. **The session starts.** Claude Code loads the root `CLAUDE.md`. That file loads the rule files and the current-focus file. The dispatch rule and `CLAUDE.md` say that Claude Code also loads the memory index, `MEMORY.md`, through the link. So the main agent starts with the rules, one line for each memory record, and the page of what is true now. `CLAUDE.md` also names a second file to load, `engagement/_session_brain/BRAIN.md`, and that file and its folder do not exist.
2. **The owner sends a message.** The reminder hook reads the message. When a pattern matches, the hook adds this to what the main agent sees: the labels that matched, the name of the dispatch rule, the instruction to start `davis-memory-curator` in the background "in the same response as your next user-facing action", and the instruction to ask briefly when the case is unclear. The owner does not see this text.
3. **The main agent notices something that will still matter in a later session.** The dispatch rule lists 32 situations (next section). The hook helps only when the owner's own words match a pattern. A fact that the agent reads in a transcript, a file, or a tool result reaches no hook, so the main agent has to notice it from the rule alone.
4. **The main agent decides whether to ask the owner.** The rule's section "Asking vs Acting" says to start the helper without a question when the fact is clear, lasting, and has an obvious file. It says to ask first when the fact may matter only in this session, when the owner hedged, when the right place is unclear, or when a correction would replace a record that cannot be checked. Both lists are in "What goes to memory and what does not" below.
5. **The main agent tells the owner in one line and starts the helper in the same response.** The rule gives the line: "I'll record [the X update] in project memory while I keep working on [Y]." The main agent calls the Agent tool with `subagent_type: "davis-memory-curator"` and `run_in_background: true`. The prompt must stand on its own: the fact, the kind of change (`new entry`, `update`, `correction`, or `deletion`), the files to check, and any limit the owner gave. When one message from the owner holds several separate facts, the rule says to start one helper for each fact in the same response.
6. **The main agent keeps working on the owner's request.** The rule says: "Do not wait on the curator."
7. **The memory helper does its run in the background.** Its definition gives six steps: read the request, read `MEMORY.md` and the records the change may touch, decide between a new record, a change to a record, and a refusal, write the change and the index line, read the result again, and report back. It changes a record in place and does not add a second record on the same topic. When the change shifts the focus, a decision, or a blocker, it also rewrites the affected sections of the current-focus file. It writes what it learned about the job to its own notes folder.
8. **The helper asks nobody directly.** When the helper is unsure, its definition tells it to return "a brief question and a proposed default action" to the main agent, which passes the question to the owner. The helper never deletes a record without an instruction, or without a duplicate that it names in its report.
9. **The helper's report arrives.** The rule says the main agent tells the owner about it only in four cases: the helper said the information belongs in another place, the helper asked a question, the owner asked to see what was written, or the helper found a conflict with an existing record that the owner should settle.
10. **The turn ends.** The audit hook reads the session file and adds one line to `.claude/hooks/memory_audit.jsonl` with these fields: `timestamp`, `session_id`, `trigger_count`, `dispatch_count`, `missed_count`, and `sample_triggers`. It writes a line only when it counted at least one matching message or one start of the helper. Nothing is shown to the owner or the agent.

In the session the owner named as the example, steps 5 to 9 ran with no question to the owner. `how-the-owner-works-with-agents.md` records that the helper ran for about 10 minutes and used about 200,000 tokens.

## The 32 situations that start the memory helper

The count of 32 is correct. The rule lists 27 situations in nine groups under "Trigger Events" and 5 more under "CURRENT_FOCUS Maintenance". The table gives each situation in plain words and then in the rule's words. An example in the rule that names a person is left out here.

| # | Group in this file (the rule's heading) | The situation | The rule's words |
| --- | --- | --- | --- |
| 1 | People ("Stakeholder and vendor changes") | A new person with a role. | "New person introduced with a role, email, or organizational affiliation" |
| 2 | People | A role change. | "Role change" |
| 3 | People | Someone leaves. | "Departure or end of engagement for an existing contact" |
| 4 | People | A new nickname for a field. | "New informal-language mapping" |
| 5 | Focus ("Active focus and engagement state") | The active work changes. | "Active epic changes (paused, resumed, deprioritized, completed)" |
| 6 | Focus | A constraint across work is added or removed. | "Cross-epic constraint added or removed (e.g., merge freeze window)" |
| 7 | Focus | The schedule shifts. | "Engagement-wide schedule shift announced" |
| 8 | Tools and vendors ("Vendor and tooling changes") | A tool is replaced. | "Tool replaced" |
| 9 | Tools and vendors | A new vendor. | "New vendor onboarded" |
| 10 | Tools and vendors | A system is added or removed. | "MCP server, integration, or external system added or removed" |
| 11 | Where things are ("Reference map updates") | A new link for a spec. | "New ClickUp doc URL for a spec or hub page" |
| 12 | Where things are | A new starting file for complex work. | "New entry-point file for a complex work item" |
| 13 | Where things are | A reference is renamed or moved. | "Renamed or relocated canonical reference" |
| 14 | Corrections ("Memory corrections") | The owner says "actually...". | "User says "actually..." about something previously recorded" |
| 15 | Corrections | The owner contradicts a record. | "User contradicts an existing memory entry" |
| 16 | Corrections | A record is found out of date. | "Memory found stale during verification" |
| 17 | The owner's preferences ("Standing user preferences") | "Never do X" or "always use Y". | ""Never do X" / "Always use Y" that applies across sessions" |
| 18 | The owner's preferences | A preference confirmed in the session. | "Communication or workflow preference confirmed during the session" |
| 19 | The owner's preferences | A new "ask me first" pattern. | "New ask-before-acting pattern surfaced" |
| 20 | Technical facts ("Technical landmarks") | Keys the agent will use again. | "Composite keys, upsert keys, or foreign-key conventions that the agent will reference repeatedly across sessions" |
| 21 | Technical facts | Which data source wins. | "Data source authority decisions (which source wins per field, per object)" |
| 22 | Technical facts | How an integration behaves. | "Integration-specific semantics that affect Salesforce design" |
| 23 | Where information belongs ("System routing knowledge") | A new home for a kind of information. | "A new system or path becomes canonical for a class of information" |
| 24 | Where information belongs | An ownership line moves. | "An ownership boundary moves between systems" |
| 25 | Where information belongs | A new top-level document. | "A new top-level reference document is introduced (a spec, a runbook, a hub doc, an MCP server)" |
| 26 | Design decisions ("Solution design pointers") | A lasting decision lands. | "A durable Salesforce solution design decision lands in the hub Decisions Register that future sessions need to find before doing related work" |
| 27 | Design decisions | A decision is replaced. | "An existing decision is superseded by a new one" |
| 28 | The current-focus page ("CURRENT_FOCUS Maintenance") | Focus shifts. | "Focus shift: the active epic changes, or the active work item within an epic changes" |
| 29 | The current-focus page | A new lasting decision. | "New durable decision: a decision lands that should surface in the next session's startup context" |
| 30 | The current-focus page | A new blocker. | "New blocker: a task gets blocked on a stakeholder answer, a vendor response, or an external dependency" |
| 31 | The current-focus page | A blocker cleared. | "Blocker cleared: a previously blocking item is resolved and should be removed" |
| 32 | The current-focus page | A major item finished. | "Major item completed: a milestone, deliverable, or work item closes and the next session needs to know what comes next" |

### Where the rule differs from this table

- **Row 5 is narrower in the rule.** The rule names only the "active epic" there. A change of the active work item appears only in row 28. The current-focus file itself now says there are no epics, so in practice row 28 carries this situation.
- **Some rows overlap.** Rows 5 and 28 can both describe one change of focus, and rows 26 and 29 can both describe one decision. The 32 rows are 32 lines of the rule, and they are fewer than 32 separate events.
- **Three groups also say how short the record must be.** After rows 22, 25, and 27 the rule adds one more line that is an instruction and not a situation. For technical facts it says the record is "the headline fact plus a pointer to where the full content lives". For where information belongs it says the record is "a one-line "X lives at Y" pointer". For design decisions it says the record is "the decision headline plus the hub link".
- **The rule's heading for rows 1 to 4 also names vendors.** Its heading is "Stakeholder and vendor changes". A new vendor is row 9.
- **The reminder hook does not cover the same list.** `_patterns.py` has patterns for seven of the ten groups in the table: people, focus, tools and vendors, where things are, corrections, the owner's preferences, and the current-focus page. It has no pattern for technical facts, where information belongs, or design decisions. Inside the seven groups some rows have no pattern either, for example a new lasting decision (row 29) and a schedule shift (row 7). The hook reads only the owner's message, so it cannot match a record that the agent finds out of date (row 16). The list also has four patterns for words that the rule does not list as situations: "remember that", "forget that", "save this to memory", and "update memory".

## How the agent keeps the current-focus page up to date

The dispatch rule requires it, and the memory helper does the writing. The main agent's part is to start the helper when one of rows 28 to 32 happens.

**The rule text that requires it.** The section "CURRENT_FOCUS Maintenance" of the dispatch rule says: "The curator is also responsible for keeping `engagement/_state/CURRENT_FOCUS.md` in sync with the project's current state. This file is auto-loaded into every session via CLAUDE.md, so it must reflect reality." It then says: "Dispatch the curator to update CURRENT_FOCUS.md when any of these occur", followed by the five situations in rows 28 to 32. The helper's definition repeats this in its list of what the helper owns.

**The sections of the page.** The rule names six fields that the helper must keep current. The file has one `##` heading for each, in this order:

1. `## Active Epic`: the rule asks for the epic's name and abbreviation.
2. `## Active Work Item`: the rule asks for the work item's short name and its ClickUp task link when known. The file holds one line for each of the 14 open work items.
3. `## Most Recent Decision`: the rule asks for the decision in one line with its date. The file holds four lines.
4. `## Open Blockers`: a bulleted list. The file groups the bullets by the person or company that has to act.
5. `## Last 3 Things Touched`: the most recent first, each with its date.
6. `## Notes for Next Session`: short guidance for the start of the next session.

Above the first heading the file holds its title and a paragraph that starts "Last updated:", with the date, the name `davis-memory-curator`, and the event that caused the update. That paragraph also says that the detail is in each `WORK-ITEM.md` and that the work item files "win over this file".

**The size limit.** The rule says: "Keep the file under 50 lines. When updating, fully replace the affected sections rather than appending duplicate state." On 2026-10-07 the file was 49 lines and 11,369 bytes, and its longest line was 786 characters. No hook and no script checks the limit. The helper's own notes tell it to count the lines after each rewrite.

**Who writes it.** The memory helper writes it. The helper's definition lists the file under "You own the contents of". The dispatch rule gives the main agent no step in which it writes the file.

## How the agent keeps the work items up to date

One rule requires it, and the main agent does the writing. No hook checks a work item.

**The rule.** `.claude/rules/local-work-items.md` has a section "Keeping it current". Its first line says: "When work moves, update the item's Status, Stage, Updated date, Next action, the task's Status and Current position, and add a Recent History entry, in the same response." It also says that every answer to an open question goes into the item's table of open questions, and that the file must be written "so a stranger can pick it up cold". Rule 1 of `golden-rules.md` says the same thing for every kind of project file: "every change must land in the framework files in the same response".

**The layout of one work item.** The rule sets one folder for each item, `engagement/work-items/WI-<number>-<slug>/`, and one record file in it, `WORK-ITEM.md`. Supporting files, such as call notes or an `inputs/` folder, may sit beside it. The record file has this form:

- The first line is `<!-- work-item-format: 1 -->`, and the second line is `**WI-<number>: <Title>**`.
- Five top-level sections follow, in this order: `# Overview`, `# Roadmap`, `# Tasks`, `# Recent History`, and `# Requirements`.
- `# Overview` holds these fields as `- Label: value` lines: Schema version, Type, Priority, Status, Stage, Created date, Updated date, Purpose, Next action, Blockers, Relationships, and Git. Below them are `## Requirements approval`, `## Open questions`, `## Context and notes`, and, when there is one, `## Solution design (draft, not approved)`.
- `# Roadmap` holds blocks named `## STAGE-001: <title>`. `# Tasks` holds blocks named `## TASK-001: <title>`. `# Recent History` holds blocks named `## ENTRY-<n>: <Action>`, which are added and never deleted.

The rule says this is the record format of the `work-tracker` plugin from the owner's earlier toolkit, with two differences: the work items are in a folder that Git tracks, and the draft design is inside the one file.

**No hook takes part.** `.claude/settings.json` registers three hooks, and none of them reads a work item. The audit hook counts only starts of the memory helper.

**What the memory helper does when it finds a work item out of date.** It does not edit the work item. It tells the main agent, and the main agent makes the change. Three files show this:

- The helper's definition has a step 6, "Report back", which asks for "any follow-ups the main agent should handle". The definition also says the helper does not "expand scope beyond what was dispatched".
- The helper's own notes say it more directly. One note, on handling the facts from a call, tells the helper to read the top of each named `WORK-ITEM.md` first, to treat the work item file as right when it differs from the request the main agent sent, and never to edit a work item file. The same note tells the helper to report a work item that was not updated to the main agent.
- The current-focus file says the work item files win over it.

The helper's definition lists what the helper does not own (ClickUp content, the work log, the component tracker, the runbooks, the knowledge base, and `force-app/`). The folder `engagement/work-items/` is not on that list. The instruction not to edit a work item is in the helper's own notes only.

In the example session this is what happened: the helper told the main agent about a work item whose next step was out of date, and the main agent corrected it.

**ClickUp tasks are handled differently.** `task-completion-sync.md` covers a ClickUp task that the owner says is complete. There the agent must list its planned changes and wait for the owner's yes before it writes, and it must ask before it adds a work log entry. `CLAUDE.md` says the project now has one ClickUp list, and the current-focus file says a ClickUp ticket is made only when the owner asks.

## What goes to memory and what does not

Memory holds what a later session needs and cannot find quickly in another place. Everything that has a home in another place stays there, and memory holds at most a short pointer to it.

**The helper's four tests.** The helper's definition says a fact belongs in memory only when all four are true: "It is durable (will still be true in a future session)", "It is not already captured in CLAUDE.md, a rule file, or a stable hub page", "It would be expensive or unreliable for a future session to rediscover", and "It changes the way Claude should behave or where Claude should look".

**What belongs in other places.** This is the table in the dispatch rule's section "What NOT to Dispatch". The rule says the main agent handles these kinds of information itself and does not start the helper for them. The last column was added for this file.

| Information | Goes here | The rule that covers it | Was the rule file found on 2026-10-07? |
| --- | --- | --- | --- |
| ClickUp task status, assignment, ordering | The ClickUp task | `clickup-conventions.md` | Yes |
| Completed work narrative | `engagement/work-log/<epic>.md` | `work-log-protocol.md` | No. The folder `engagement/work-log/` does not exist either. |
| Salesforce solution design decisions | The Decisions Register in the ClickUp hub | `hub-doc-protocol.md` | No |
| Salesforce code, schema, metadata details | `force-app/` or the knowledge base | `kb-refresh.md` | Yes |
| Built or deployed component records | `engagement/deployment/component-tracker.csv` | `component-tracker.md` | Yes |
| Operational deploy steps | The ClickUp deployment list for the epic | `deployment-runbook.md` | Yes |
| Open stakeholder questions | The ClickUp Questions list | `hub-doc-protocol.md` | No |

The table has no row for a work item. A fact about one work item goes in its `WORK-ITEM.md`, under `local-work-items.md`.

**Pointers are allowed.** Below the table the rule says: "memory CAN and SHOULD hold pointers to these systems. The boundary is: memory is the routing layer (where to find X) plus high-impact headlines the agent will recall repeatedly; the listed system owns the body." When the helper is sent something that belongs in another place, its definition tells it to answer in one line with the right place and to write no record.

**When the main agent starts the helper without asking the owner.** The rule lists three conditions:

- "The trigger is unambiguous (clear new fact, clear correction)"
- "The information is declarative and project-durable"
- "The destination memory file is obvious from MEMORY.md or follows naming conventions"

**When the main agent asks the owner first.** The rule lists four conditions:

- "The information may be ephemeral (session-only) rather than durable"
- "The statement is hedged ("I think...", "maybe...", "we might...")"
- "The information could belong in ClickUp, the hub, the work log, or memory and the right destination is unclear"
- "A correction would overwrite an entry whose currency cannot be verified"

The rule then says: "Default to ask-once-then-act rather than re-asking every time a similar trigger surfaces." It also says that when the right place is unclear, the main agent asks the owner briefly and does not start the helper at the same time.

**When the helper asks.** The helper's definition has its own two lists. The helper asks the main agent when it cannot tell whether a fact is lasting, whether to replace a record or add one, which of two conflicting facts is current, or whether a new type of file name is needed. It acts without asking when the request is a clear change to an existing record, a clear new record of an existing type, or a correction that names the record.

## The rule, word for word

This is the full text of `.claude/rules/memory-curator-dispatch.md`. Three kinds of change were made, and nothing else:

- Each person's name was replaced with a role in square brackets. This was done in the example of a role change, the example of a nickname for a field, the example call of the Agent tool, and the first good example under "Acknowledgment Style".
- The Windows user name was replaced with `<user>` in every path, the paths inside the PowerShell command and the example call included.

- Each name of a vendor, a vendor's tool, a field of the org, a nickname for a field, and a work area was replaced with a description in square brackets. This was done in the examples only. ClickUp, Salesforce, and Claude Code are named as the rule has them.

````markdown
## Memory Curator Dispatch Protocol

The `davis-memory-curator` subagent owns the project's persistent auto-memory at `~/.claude/projects/C--Users-<user>-Documents-Claude-Projects-davis-advisors-sfdc/memory/`. Its job is to keep `MEMORY.md` and the topic-scoped memory files (e.g., `project_*.md`, `reference_*.md`, `feedback_*.md`, `user_*.md`) accurate so every future session starts with the right context.

This rule defines when and how the **main agent** dispatches the curator. The curator runs in parallel so the main agent does not have to context-switch off the user's task.

### Agent References

- Agent definition: `~/.claude/agents/davis-memory-curator.md`
- Curated memory directory: `~/.claude/projects/C--Users-<user>-Documents-Claude-Projects-davis-advisors-sfdc/memory/` — this path is a Windows directory junction that points into the repo at `engagement/_memory/`. The curator (and the harness auto-load) keep using this `~/.claude/...` path exactly as before; the junction is transparent, so writes land in `engagement/_memory/` and are tracked in Git. No path change is needed in the agent definition or this rule.
- Real files in the repo: `engagement/_memory/` (what Git tracks and pushes to GitHub).
- Index file: `MEMORY.md` inside that directory.
- Curator's own agent memory: `.claude/agent-memory/davis-memory-curator/`

### Recreate the junction on a fresh clone or new machine

The junction is a local filesystem link, not part of the Git repo. A fresh `git clone` (or moving the project folder) brings down the real files in `engagement/_memory/` but leaves the `~/.claude/...` memory path missing, so memory will not load until the link is recreated. Run this once in PowerShell (it removes only the link if one exists, never the target files):

```powershell
$link = "$env:USERPROFILE\.claude\projects\C--Users-<user>-Documents-Claude-Projects-davis-advisors-sfdc\memory"
$target = "C:\Users\<user>\Documents\Claude_Projects\davis-advisors-sfdc\engagement\_memory"
New-Item -ItemType Directory -Force -Path (Split-Path $link) | Out-Null
if (Test-Path $link) { (Get-Item $link).Delete() }
New-Item -ItemType Junction -Path $link -Target $target | Out-Null
```

### Trigger Events

Dispatch the curator whenever any of the following surfaces in the conversation. The triggers below are project-durable changes that future sessions need to know about.

**Stakeholder and vendor changes**

- New person introduced with a role, email, or organizational affiliation
- Role change (e.g., "[the new vendor contact] replaced [the earlier vendor contact] as the [a data vendor] CSM")
- Departure or end of engagement for an existing contact
- New informal-language mapping (e.g., "when [the client contact] says '[a nickname]' he means `[a custom field]`")

**Active focus and engagement state**

- Active epic changes (paused, resumed, deprioritized, completed)
- Cross-epic constraint added or removed (e.g., merge freeze window)
- Engagement-wide schedule shift announced

**Vendor and tooling changes**

- Tool replaced (e.g., "we switched from [one tool] to [another tool]")
- New vendor onboarded
- MCP server, integration, or external system added or removed

**Reference map updates**

- New ClickUp doc URL for a spec or hub page
- New entry-point file for a complex work item
- Renamed or relocated canonical reference

**Memory corrections**

- User says "actually..." about something previously recorded
- User contradicts an existing memory entry
- Memory found stale during verification

**Standing user preferences**

- "Never do X" / "Always use Y" that applies across sessions
- Communication or workflow preference confirmed during the session
- New ask-before-acting pattern surfaced

**Technical landmarks**

- Composite keys, upsert keys, or foreign-key conventions that the agent will reference repeatedly across sessions (e.g., [a data vendor] upserts Contacts by `[one field]` + `[another field]`)
- Data source authority decisions (which source wins per field, per object)
- Integration-specific semantics that affect Salesforce design ([a data vendor]'s upsert behavior, [another vendor]'s routing keys, vendor connector quirks)
- The memory entry is the headline fact plus a pointer to where the full content lives. Do not duplicate body content from the KB, hub, or work item folders.

**System routing knowledge**

- A new system or path becomes canonical for a class of information
- An ownership boundary moves between systems
- A new top-level reference document is introduced (a spec, a runbook, a hub doc, an MCP server)
- The memory entry is a one-line "X lives at Y" pointer.

**Solution design pointers**

- A durable Salesforce solution design decision lands in the hub Decisions Register that future sessions need to find before doing related work
- An existing decision is superseded by a new one
- The memory entry is the decision headline plus the hub link. Do not duplicate the rationale, impacts, or related-tasks fields; those live in the hub body.

### CURRENT_FOCUS Maintenance

The curator is also responsible for keeping `engagement/_state/CURRENT_FOCUS.md` in sync with the project's current state. This file is auto-loaded into every session via CLAUDE.md, so it must reflect reality.

Dispatch the curator to update CURRENT_FOCUS.md when any of these occur:

- **Focus shift**: the active epic changes, or the active work item within an epic changes
- **New durable decision**: a decision lands that should surface in the next session's startup context
- **New blocker**: a task gets blocked on a stakeholder answer, a vendor response, or an external dependency
- **Blocker cleared**: a previously blocking item is resolved and should be removed
- **Major item completed**: a milestone, deliverable, or work item closes and the next session needs to know what comes next

CURRENT_FOCUS schema fields the curator must keep current:

- Active Epic (epic name and abbreviation)
- Active Work Item (slug plus ClickUp task URL when known)
- Most Recent Decision (one-line decision plus date)
- Open Blockers (bulleted)
- Last 3 Things Touched (most recent at top, with date)
- Notes for Next Session (short free-form guidance for the next session start)

Keep the file under 50 lines. When updating, fully replace the affected sections rather than appending duplicate state.

### What NOT to Dispatch

The following belong in other systems. Do not dispatch the curator. The main agent handles them under the listed protocol.

| Information | Goes here | Protocol |
| --- | --- | --- |
| ClickUp task status, assignment, ordering | ClickUp task | `clickup-conventions.md` |
| Completed work narrative | `engagement/work-log/<epic>.md` | `work-log-protocol.md` |
| Salesforce solution design decisions | Decisions Register in the hub | `hub-doc-protocol.md` |
| Salesforce code, schema, metadata details | `force-app/` or knowledge base | `kb-refresh.md` |
| Built or deployed component records | `engagement/deployment/component-tracker.csv` | `component-tracker.md` |
| Operational deploy steps | per-epic ClickUp deployment list | `deployment-runbook.md` |
| Open stakeholder questions | ClickUp Questions list | `hub-doc-protocol.md` |

However, memory CAN and SHOULD hold pointers to these systems. The boundary is: memory is the routing layer (where to find X) plus high-impact headlines the agent will recall repeatedly; the listed system owns the body. A `reference_*.md` memory file that names a hub decision, points to the relevant work item folder, and notes the single fact a future session needs to know is exactly the right pattern.

If a piece of information is ambiguous, ask the user briefly which system it belongs in rather than dispatching and routing in parallel.

### Dispatch Pattern

When a trigger fires:

1. **Acknowledge in one line** to the user: "I'll record [the X update] in project memory while I keep working on [Y]."
2. **Dispatch in the same response** as your next user-facing action. Use the Agent tool with:
   - `subagent_type: "davis-memory-curator"`
   - `run_in_background: true` (non-blocking)
   - A self-contained prompt that includes:
     - The trigger statement verbatim or tightly paraphrased
     - The change type: `new entry`, `update`, `correction`, or `deletion`
     - Concrete cross-references (file paths, ClickUp doc IDs, related memory filenames the curator should check)
     - Any explicit scope guard the user gave ("just record X, not Y")
3. **Continue user-facing work** in the same tool-call block. Do not wait on the curator.
4. **When the curator's result arrives later**, acknowledge in one line only if relevant (it surfaced a routing concern, asked a clarifying question, or the user explicitly asked to see the write).

Example dispatch:

```
Agent({
  subagent_type: "davis-memory-curator",
  run_in_background: true,
  description: "Record new [a data vendor] CSM",
  prompt: "Update type: stakeholder change. [a data vendor] CSM is now [the new vendor contact], effective 2026-05-25. Replaced [the earlier vendor contact]. Update project_vendor_contacts.md if it exists; otherwise create. Cross-reference: ~/.claude/projects/C--Users-<user>-Documents-Claude-Projects-davis-advisors-sfdc/memory/project_vendor_contacts.md"
})
```

### Parallel Dispatch for Multiple Events

If a single user message produces multiple independent memory events (e.g., a new stakeholder AND a focus shift AND a new ClickUp doc URL), launch them as separate Agent calls in a single response message so they run concurrently. Each curator instance gets its own focused prompt covering one topic.

### Asking vs Acting

Dispatch without asking when:

- The trigger is unambiguous (clear new fact, clear correction)
- The information is declarative and project-durable
- The destination memory file is obvious from MEMORY.md or follows naming conventions

Ask the user first when:

- The information may be ephemeral (session-only) rather than durable
- The statement is hedged ("I think...", "maybe...", "we might...")
- The information could belong in ClickUp, the hub, the work log, or memory and the right destination is unclear
- A correction would overwrite an entry whose currency cannot be verified

Default to ask-once-then-act rather than re-asking every time a similar trigger surfaces.

### Acknowledgment Style

Keep user-facing acknowledgments short. The user should know dispatch happened but not be interrupted by it.

- Good: "Logging the [the new vendor contact] handover to memory in parallel."
- Good: "Recording the [a work area] pause in project memory."
- Avoid: long restatements of what the curator will do, narration of dispatch mechanics, or post-hoc summaries of what the curator wrote unless the user asked.

### Curator Return Handling

The curator returns a concise summary of what file it created or updated. The main agent does not need to mirror this back to the user unless:

- The curator surfaced a routing concern (information should go elsewhere)
- The curator asked a clarifying question
- The user explicitly asked to see the memory write
- The curator reported a conflict with an existing memory entry that the user should resolve

### Related Rules

- `hub-doc-protocol.md` — what goes in the hub vs. memory
- `clickup-conventions.md` — task-level information lives in ClickUp
- `work-log-protocol.md` — completed work narrative lives in the work log
- `component-tracker.md` — built and deployed components live in the tracker
- `deployment-runbook.md` — operational deploy steps live in per-epic ClickUp deployment lists
````

## What is not known or was not checked

- **No session was run or read.** The order of events in "What happens, step by step" comes from the rule, the helper's definition, the hook files, and the settings. The facts about the example session come from `how-the-owner-works-with-agents.md`, not from the session's own file.
- **Whether the memory index loads through the link.** The rule and `CLAUDE.md` say that Claude Code loads `MEMORY.md` at session start from the path under `~/.claude/projects/`. The link was confirmed to be a directory junction to `engagement/_memory/`. The loading itself was not tested.
- **Where the warning about the size of the index comes from.** In the example session the owner got a warning that the memory index was getting large. No file in the Davis project checks the size of `MEMORY.md`. The helper's own notes speak of a limit of 24.4 KB on the project's `MEMORY.md` and of a warning that arrives when the index is loaded. The helper's definition says that lines of an index after line 200 are cut. Neither number was checked against the Claude Code documentation. The index was 19,306 bytes and 135 lines on 2026-10-07.
- **What the line `@.claude/rules/**` in `CLAUDE.md` does.** The earlier write-up says that Claude Code loads the rules folder by itself and that an import with a wildcard is not documented. This was not tested.
- **What Claude Code does with the import of the missing `BRAIN.md`.** This was not tested.
- **Two rules that other files name were not found.** `hub-doc-protocol.md` and `work-log-protocol.md` are named by the dispatch rule, by `clickup-conventions.md`, and by `task-completion-sync.md`. A third one, "the global ask-before-assuming rule", is named by `always-clarify.md` and by the helper's definition. No file with any of the three names is in `.claude/rules/` or in `~/.claude/rules/`. Whether they exist under another name or in another place is not known.
- **How the session start rule and the current-focus file fit together.** `session-startup.md` says the ClickUp hub is the source for the current project context and that the agent makes no local copy of it unless the owner asks. The current-focus file is a local page of the current project context, and its own text says every open item is a local work item. Which of the two the agent follows at session start was not checked.
- **Whether the helper reads its own notes on every run.** The definition's text says the index of the notes folder is always loaded. This was not tested.
- **Whether the helper runs on Opus in practice.** The definition says `model: opus` and the owner's setting says `opus`. No run was checked.
- **Whether the memory records are correct.** No record was checked against its source. The owner said of the example session: "idk how accurately but it was seemless".
- **What the plugins that are on for the whole computer add to a Davis session.** The owner's settings turn on the plugins of his earlier toolkit, among them `second-brain`, `work-tracker`, and `protocol-guard`. The Davis settings register none of their hook commands, and the Davis project has no `knowledge/` folder and no `.work-items/` folder. One of those plugins, `system-guide`, registers its own hook for the start of a session in every project, and what that hook prints in a Davis session was not checked. `protocol-guard` runs only when the variable `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` is set, and neither settings file sets it. Whether the variable is set in Windows itself, and whether the agent uses those plugins' skills in a Davis session, was not checked. The earlier write-up says the `second-brain` skill and the reminder hook both react to the words "remember this"; that was not tested.
- **Scheduled tasks.** The list of scheduled tasks on the computer was empty on 2026-10-07. The Davis folder holds a file `.claude/scheduled_tasks.lock`, which holds a session ID, a process ID, and a time. No scheduled task takes part in memory as far as the files show.
- **How current Git is.** Git tracks the memory folder, the current-focus file, the helper's notes, and the audit log. The last commit that touched the memory folder is dated 2026-09-22, and on 2026-10-07 `git status` listed 40 changed or new paths in the memory folder, the state folder, and the helper's notes folder. Whether and when the agent commits memory was not checked.
- **Codex.** The Davis project was not checked for Codex settings. The root `AGENTS.md` is one line that points to `CLAUDE.md`.

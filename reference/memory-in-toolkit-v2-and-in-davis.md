# Project memory in Toolkit V2 and in the Davis project

Davis and Toolkit V2 keep nearly the same things in nearly the same form: one memory record per subject, one short page of what is true now, and another place for everything else. They differ most in who saves and in whether Mike is asked. In Davis the main agent starts a separate helper agent in the background, tells Mike in one line, and keeps working, and it asks only when a fact is unclear. In Toolkit V2 at version 0.9.9 the main agent does every save itself before it replies, a new project asks "Save to memory: ...?" before it saves anything it inferred, and a fact about a named person always needs a question. Those points explain why Davis felt "seamless" to Mike. In return, Toolkit V2 has more checks, a stricter form for each record, and a note on each record of who approved it.

## How to read this report

Mike asked for this report on 2026-10-07. He will use it to decide what Toolkit V2 should take from Davis. The report describes both systems and recommends nothing.

- **Davis** means the files of the Davis project as `reference/davis-memory-system.md` records them. That file was written on 2026-10-07 from the Davis files. For this report the dispatch rule, the helper's definition, the reminder hook, and the hook settings were also opened in the Davis project.
- **Toolkit V2** means the starter files on `main` at version 0.9.9. These are the files that setup copies into a project. Hindsight memory is not covered.
- A **session** is one chat with the agent. A **turn** is one message from Mike, with the agent's work on it and its reply.
- The **main agent** is the agent Mike talks to. A **helper agent** is a separate agent that the main agent starts for one job.
- A **hook** is a small command that Claude Code or Codex runs by itself at set moments, such as the start of a session.
- A **memory record** is what memory holds about one subject.
- **The page of what is true now** is the one short page that every session gets at its start. Davis calls it the current-focus file, `CURRENT_FOCUS.md`. Toolkit V2 calls it the project's Current State.
- A **worktree** is a separate folder with its own branch. The **main checkout** is the project's main folder.
- When the local column and the Notion column of a table hold the same fact, the text is in the local column, and the Notion column says "Same."

No session was run for this report, in either system. Every row says what the files say. A row does not show what an agent does in practice.

The counts for Davis are the ones in `reference/davis-memory-system.md`. The Davis project changed later on 2026-10-07: it held 100 memory records when this report was written, and 99 when the counts were taken.

### The files this report names

Davis files, with paths inside the Davis project unless the path starts with `~`:

| Short name | Path |
| --- | --- |
| The dispatch rule | `.claude/rules/memory-curator-dispatch.md` |
| The helper's definition | `~/.claude/agents/davis-memory-curator.md` |
| The reminder hook | `.claude/hooks/memory_curator_trigger.py`, with its word patterns in `.claude/hooks/_patterns.py` |
| The audit hook | `.claude/hooks/memory_curator_audit.py`, with its log `.claude/hooks/memory_audit.jsonl` |
| `CURRENT_FOCUS.md` | `engagement/_state/CURRENT_FOCUS.md` |
| The Davis index | `engagement/_memory/MEMORY.md` |
| `local-work-items.md`, `golden-rules.md` | `.claude/rules/` |

Toolkit V2 files, with paths inside `plugins/toolkit/skills/project-setup/assets/`:

| Short name | Path |
| --- | --- |
| The starter `AGENTS.md`, the starter `PROJECT.md` | `every-project/` |
| `memory-review-and-save.md`, `keep-work-item-current.md` | `every-project/.claude/rules/` |
| `session-start.mjs`, `prompt-reminder.mjs`, `validate-records.mjs`, `codex-after-commit.mjs` | `every-project/.claude/hooks/` |
| The settings snippets | `settings/claude-settings-hooks.local.json`, `claude-settings-hooks.notion.json`, `codex-hooks.local.json`, `codex-hooks.notion.json` |
| `memory-process.md`, `memory-criteria.md`, `saving.md`, `current-state.md`, `finding.md`, `tidying.md` | `memory-process/.claude/skills/managing-project-memory/references/` |
| The local `memory-store.md`, `folders-and-files.md`, `record-format.md`, the local `searching.md` | `memory-local/.claude/skills/managing-project-memory/references/` |
| The Notion `memory-store.md`, `writing-pages.md`, `database-layout.md`, `current-state-page.md`, `views-and-layout.md`, the Notion `searching.md` | `memory-notion/.claude/skills/managing-project-memory/references/` |
| `lifecycle-rules.md`, `closing.md` | `every-project/.claude/skills/managing-work-items/references/` |
| `setup-copy.md` | `plugins/toolkit/skills/project-setup/references/setup-copy.md` |

`reference/how-the-owner-works-with-agents.md` records Mike's own words and the session he named as the example.

## 1. How the agent knows to start

| Point | Davis | Toolkit V2 with local memory | Toolkit V2 with Notion memory |
| --- | --- | --- | --- |
| The text that tells the agent when to save | The dispatch rule lists 32 situations in 10 groups, such as a new person, a change of focus, or a correction. It says to start the helper "whenever any of the following surfaces in the conversation". | Three texts tell it. `memory-review-and-save.md` lists the moments to review memory, the starter `AGENTS.md` ("Every session") says to record before a turn ends what a later session must know, and `memory-process.md` ("Before a turn ends") holds a table of 11 situations. | Same. |
| Whether that text is loaded in every session | Yes. The whole dispatch rule, 200 lines, loads with the other rules. It holds when to save, how to save, and when to ask. | Partly. The rule (27 lines) and the starter `AGENTS.md` load. The steps are in the skill `managing-project-memory`, which the agent has to open. | Same. |
| What the hook reads on each message from Mike | The reminder hook tests the whole message against 46 word patterns. It has no step that removes pasted text. | `prompt-reminder.mjs` tests the message against 12 groups of phrases, such as "remember that", "from now on", and "we decided". It first removes pasted text and sentences that are questions. | Same. |
| What the hook prints | On a match it prints the matched labels and tells the agent to start the helper in the background "in the same response as your next user-facing action". With no match it prints nothing. | It always prints one line that tells the agent to check the project's skills. On a match it adds that this "may be something to keep" and that the skill "decides whether anything is saved". | Same. |
| How strong the reminder is | It is an instruction to act, with the exact tool call. It allows a brief question when the case is unclear. | It is a hint. `memory-review-and-save.md` says "A reminder that a hook prints is not a decision to save." | Same. |
| A fact that is not in Mike's own words, such as one in a transcript | A transcript the agent reads with a tool reaches no hook. The dispatch rule still covers it, and the files draw no line between Mike's words and another person's words. | The hook's hint says such words "decide nothing". The transcript is filed in `sources/`, and a fact found in it counts as inferred, so the approval rules in section 3 apply (`saving.md`, "Proposals"). | Same. |
| What is loaded at the start of a session | `CLAUDE.md`, the rules, `CURRENT_FOCUS.md`, and the Davis index with one line per record. The loading of the index was not tested. | `session-start.mjs` prints the project's Current State and one line per current memory record: title, file, description, and date of last change. | `session-start.mjs` reads the Current state page with `ntn` and prints it. It prints no list of memory records (the Notion `memory-store.md`). |
| When the agent reads a record | The agent opens a record when its line in the index shows it is needed. | The same, from the printed index. The starter `AGENTS.md` also names moments to search memory, such as before a deploy or before it asks Mike to repeat something. | A search at those moments is the only way the agent sees a record (`memory-process.md`, "When to search memory"). |

In Davis the agent gets the full instruction in every session, and a direct order again on a matching message. In Toolkit V2 the agent gets a short rule and a hint, it has to open the skill to learn the steps, and the hint tells it that a transcript decides nothing.

## 2. Who does the saving

| Point | Davis | Toolkit V2 with local memory | Toolkit V2 with Notion memory |
| --- | --- | --- | --- |
| Who writes a memory record | The helper agent `davis-memory-curator`, which the main agent starts with the Agent tool. The main agent writes no memory record. | The main agent, with the skill `managing-project-memory`. No file of that skill names a helper agent. | Same. |
| Who writes the page of what is true now | The helper. The dispatch rule gives the main agent no step in which it writes `CURRENT_FOCUS.md`. | The main agent. `managing-work-items` decides a work item's line, `managing-project-memory` decides the other lines, and `handoff` decides the last part at a handoff (`current-state.md`, "Who decides each line"). | Same. |
| In the foreground or in the background | In the background: the main agent keeps working while the helper runs. The dispatch rule says "Do not wait on the curator." | In the foreground, in the same turn. The starter `AGENTS.md` says "Write it to memory before you reply". | Same. |
| Several facts in one message | The main agent starts one helper for each fact, all in one response. | The main agent groups them into one save (`saving.md`, "Write the change"). It never runs two writes to one record at the same time (`memory-process.md`). | Same. |
| What the writer knows | The helper sees only the prompt that the main agent writes. The prompt has to hold the fact, the kind of change, and the files to check. | The main agent has the whole session. | Same. |
| What Mike waits for | Nothing. In the example session the helper ran for about 10 minutes while the main agent went on (`how-the-owner-works-with-agents.md`). | The reply comes after the save: the read of the record, the write, and the read-back (the local `memory-store.md`). | The same, and each step is a call to Notion with `ntn`: the check of the key, the write, the update of the columns, and the read-back (`writing-pages.md`). |

In Davis, memory work never makes Mike wait for his answer. In Toolkit V2 every save is part of the turn, so a turn with several saves takes longer before Mike sees the reply, and longer again with Notion.

## 3. Whether the owner is asked first

| Point | Davis | Toolkit V2 with local memory | Toolkit V2 with Notion memory |
| --- | --- | --- | --- |
| The default | The main agent saves without a question when the fact is clear, lasting, and has an obvious file. The dispatch rule says "Default to ask-once-then-act". | Setup writes `Memory approval: onboarding` in `PROJECT.md` (`setup-copy.md`). With `onboarding` the agent asks `Save to memory: <one-line summary>?` before it saves anything it inferred. | Same. |
| A setting for it | None. | The line "Memory approval" holds `onboarding` or `trusted`. Only Mike's explicit instruction changes it (`memory-review-and-save.md`). | Same. |
| Mike asks to keep, change, or forget something | The agent acts. | The agent acts at once. Mike's own request is his yes (`memory-process.md`). | Same. |
| A fact the agent inferred, with a source it can name | No question, when the fact is clear. | With `onboarding` the agent asks. With `trusted` it saves and reports the save in one line. | Same. |
| A fact the agent inferred, with no source it can name | The files set no condition on a source. | The agent asks, with both values. | Same. |
| A fact about a named person, or personal details | No question. A new person with a role is situation 1 of the dispatch rule. | The agent always asks, with both values, unless Mike asked to remember it. A person's lasting role goes in `PROJECT.md`, which also needs Mike's yes (the starter `AGENTS.md`, "Project map"). | Same. |
| An instruction the agent inferred | "Never do X" and "always use Y" are situations in the dispatch rule, and the helper saves them. | The agent always asks `Add to the project rules: <one line>?`. An instruction in Mike's own words is written at once. | Same. |
| A hedged statement, such as "I think" or "maybe" | The main agent asks first. | The files name no question for it. A claim nobody checked is saved with the words "Not checked." (`saving.md`). | Same. |
| A fact that may matter only in this session | The main agent asks first. | The files name no question for it. The test "it would matter in a future session" decides (`memory-criteria.md`). | Same. |
| The right place for the fact is unclear | The main agent asks which system, and does not start the helper in the meantime. | The files name no question for it. The table "Where information goes" in the starter `AGENTS.md` decides. | Same. |
| A correction | The main agent asks first when the correction would replace a record that cannot be checked. | The agent corrects and puts the old text in its reply, so Mike can say "undo that". It asks first when Mike changed the record by hand. | Same. |
| Retiring or deleting a record | The helper never deletes without an instruction, or without a duplicate that it names in its report. | The agent always asks, unless Mike asked to forget it. A cleanup of all of memory starts with a plan and Mike's yes (`tidying.md`). | Same. |
| What is never asked | The dispatch rule has no list of this kind. | A lesson, an event, a run of a recurring job, and a change to the project's Current State alone. Each is reported in one line. | Same. |
| What happens while a question waits | Nothing is saved. | The save is kept as a proposal, marked as not approved, and a line goes under "Waiting on" in the project's Current State (`saving.md`). | Same. |
| Who asks | The main agent. The helper sends a question and a default it proposes back to the main agent. | The main agent. | Same. |
| After Mike says no | The files do not say. | The save is kept nowhere, and the same candidate is not offered again (`memory-review-and-save.md`, `memory-criteria.md`). | Same. |

In the example session the helper added four people and rewrote two records with no question. With the files on `main`, the same call would bring questions to Mike: a new project is in `onboarding`, and a fact about a named person needs a question with both values.

## 4. What is saved

| Point | Davis | Toolkit V2 with local memory | Toolkit V2 with Notion memory |
| --- | --- | --- | --- |
| The test for memory | Four tests in the helper's definition: the fact is lasting, it is not already in `CLAUDE.md`, a rule, or a stable hub page, it is costly or unreliable to find again, and it changes how the agent behaves or where it looks. | Five tests in `memory-criteria.md`: it concerns this project, it has a credible source, it matters in a later session, it is costly or unreliable to work out again, and no other file is the place for it. | Same. |
| The kinds of record | Four: `user`, `feedback`, `project`, and `reference`. | Four: `user`, `project`, `reference`, and `event`. | Same. The kind is a tag on the page. |
| Mike's instructions and preferences | A `feedback_` record in memory. | Never memory. A bullet in `.claude/rules/owner-preferences.md`, which loads as a rule (`saving.md`, "The owner's instructions"). | Same. |
| Something that happened, such as a meeting or a call | No kind of record for it. The dispatch rule sends the story of finished work to a work log, and that folder and its rule do not exist. | An `event_` record, saved with no question. It holds the date, who took part, the result, and where the output is. | Same. |
| A job that runs again and again | No kind of record for it. | One `event_` record for the job, with its steps and a table "Runs" with one row per run. | Same. |
| A decision | The body goes to the Decisions Register in ClickUp. Memory holds the headline and the link. | Never memory. A decision that more than one work item needs goes in `DECISIONS.md`, and any other goes in its work item. | Same. |
| People | Memory records. | A lasting role goes in `PROJECT.md`. Who is away, and who covers, goes in a `user_` record. | Same. |
| A nickname or project term | A memory record (situation 4 of the dispatch rule). | Never memory. A row of `system/glossary.md`. | Same. |
| How the system works | `force-app/` or the knowledge base. Memory holds the headline fact and a pointer (situations 20 to 22). | Never memory. `system/` or `reference/current-system/`. | Same. |
| A to-do, and where a work item stands | The work item's file, or the ClickUp task. | Never memory. A project task, or the work item. | Same. |
| A transcript or a document the project was given | The files of the memory system do not say. Files the client sent went into the work item's folder (`how-the-owner-works-with-agents.md`). | Never memory. `sources/`, with an SRC ID. | Same. |
| A pointer to another place | Allowed and wanted. The dispatch rule calls memory "the routing layer (where to find X)". | Allowed in a `reference_` record, by ID and path, when a later session would otherwise miss the record. It never repeats what the record says. | Same. |
| A claim nobody checked | No form for it. | A section in a `project_` record with who said it, "Not checked.", and a date to check it by. | Same. |
| A lesson | None in project memory. The helper keeps its own notes about how to do its job. | In the work item while it is open, and after that in the record's section "Gotchas and lessons". A lesson seen twice is offered to Mike as a rule. | Same. |
| A fact that is true only for a while | A date stamp in the text. | A "check or remove by" date on the record or the section. | Same. The date is in the Review By column. |
| What is never saved | State of this session only, and details of code. | Secrets, email addresses, transcripts, raw logs, guesses, and a candidate that Mike rejected (`memory-criteria.md`). | Same. |

Davis memory holds more kinds of thing: preferences, people, nicknames, and the headlines of decisions all become memory records. Toolkit V2 sends most of those to a file with its own form, so memory holds less, and the agent has more places to choose from at each save.

## 5. Where it is saved

| Point | Davis | Toolkit V2 with local memory | Toolkit V2 with Notion memory |
| --- | --- | --- | --- |
| Where the records are | `engagement/_memory/`, one Markdown file per topic. Claude Code's own memory path points there through a Windows link (a directory junction). | `memory/` in the main checkout, one Markdown file per subject, with no subfolders. Mike can open the folder in Obsidian. | One page per subject in the Memories database on the project's Memory page. The ids are in `PROJECT.md`. |
| Whether Claude Code's own memory feature is used | Yes, through the link. | No. `memory-review-and-save.md` says never to save project memory there, or in the memory feature of Codex. | Same. |
| How a record is named | `<type>_<topic>.md`, in lower case with underscores. | `<prefix>_<name>.md`, at most 60 characters. A one-time event ends with its date. | A key `<prefix>_<slug>` in the Record Key column, at most 60 characters. |
| The index | The Davis index: one line per record under 11 headings. The helper edits it by hand in the same run. | `memory/MEMORY.md`. `session-start.mjs` rebuilds it at each session start, and nobody edits it by hand. | No index file. The views of the database (Index, By work item, Retired) and queries on its columns take its place (`views-and-layout.md`). |
| Git | Git tracks the memory folder and `CURRENT_FOCUS.md`. The last commit that touched memory is dated 2026-09-22, and 40 paths were changed or new on 2026-10-07. | Git ignores `memory/`. The local `memory-store.md` says "Never commit these files." | Not in Git. Notion keeps the pages. |
| A second computer | It gets what was committed and pushed. It also needs the link made again by hand, and the helper's definition, which is in `~/.claude/agents/` and holds Windows paths. | It sees no memory. A new clone has no `memory/` folder, and the agent stops and tells Mike. | It sees the same pages, once `ntn` is signed in there. |
| A second session in a worktree | The files do not say. The helper's definition holds the full path of the main project folder, so the helper would write there. Not tested. | It reads and writes the `memory/` folder of the main checkout. In Codex the sandbox can block that write. | It sees the same pages. |
| A deleted record | Git history holds it, when it was committed. | Nothing can bring it back (`folders-and-files.md`). | It stays in Notion's trash for a limited time (`writing-pages.md`). |
| Where the page of what is true now is | `engagement/_state/CURRENT_FOCUS.md`. A line in `CLAUDE.md` loads it. | `memory/CURRENT_STATE.md`. `session-start.mjs` prints it. | The Notion page "Current state". `session-start.mjs` reads it with `ntn` and prints it. |
| Its sections | Six: Active Epic, Active Work Item, Most Recent Decision, Open Blockers, Last 3 Things Touched, and Notes for Next Session. | Five: Now, Coming up, Waiting on, Standing jobs and shared files, and Next session starts with. The first line is "Last updated:". | Same. |
| Its size limit | "Under 50 lines", with no limit on the length of a line. It was 49 lines and 11,369 bytes, and its longest line was 786 characters. | Under 40 lines in all. The parts have limits of 5, 3, 4, 3, and 3 lines (`current-state.md`). | Same. |
| What it says about a work item | One line per open work item. The file says the work item files "win over this file". | Only the ID and a few words. It never copies where the work item stands or its next action. | Same. |

Davis memory can reach GitHub and a second computer, but only when someone commits it, and the helper and the link have to be set up again there. Local memory in Toolkit V2 is on one computer with no copy. Notion memory is the only one of the three that every computer and every worktree sees with no extra step.

## 6. How it is saved

| Point | Davis | Toolkit V2 with local memory | Toolkit V2 with Notion memory |
| --- | --- | --- | --- |
| The steps of one save | The main agent writes one line to Mike and starts the helper with a prompt. The helper reads the prompt, reads the index and the records it may change, decides, writes the record and its index line, reads the result again, and reports. | The main agent decides the place, searches for the subject's record, writes a section or a new file from the template, sets the header fields, reads the file back, updates the project's Current State when the save changes it, and gives Mike one line (`saving.md`). | The same steps. Each write is an `ntn` call: a new page with its columns, or a new section with `update_content`, then the columns (`writing-pages.md`). |
| A new fact about a subject that has a record | The helper changes the record in place. It adds no second record on the topic. | The agent adds a section to the subject's record. `memory-process.md` says "Never make one memory record for each fact." | Same. |
| The top of a record | Front matter with `name`, `description`, and the type. It is not the same in every record: 1 of 99 had none, and 9 held the type in another place. | A header of 12 fields: `name`, `description`, `created`, `updated`, `check_by`, the type, `status`, `source`, `last_verified`, `authorization`, `work_items`, and `supersedes` (`record-format.md`). | The same parts, as columns of the page: Title, Record Key, Synopsis, Tags, Status, Saved, Review By, Source note, Last verified, Authorization, and Work item IDs (`database-layout.md`). |
| The body of a record | The fact first, in short bullets. A `feedback` or `project` record then has a "Why:" line and a "How to apply:" line. | One section per sub-topic with six labels: Remember, Why, How to apply, Evidence and limits, Related memories, and Authoritative records. The last section is "Gotchas and lessons". | Same. |
| The size of a record | The helper's definition says "aim for under 30 lines per file". 63 of 99 records were over 30 lines, and the longest was 238. | About 20 sections or 300 lines at most. A bigger file is two subjects. | Same. |
| What is noted about the save itself | Nothing about who approved it. | The source, the date it was last checked, and what allowed the save, such as `Approved by <owner> on <date>` or `Logged by the agent on <date>`. | Same. |
| The status of a record | None. A record is there, or it is deleted. | Four: current, proposed, replaced, and retired. A replaced or retired record stays as history and leaves the index. | Same four. The Status column holds accepted, proposed, superseded, or deprecated. |
| What is checked afterwards | The helper reads again what it wrote. It checks the index line, and that no two files cover one topic. | The agent reads the file back and checks it against the list "A file is right when" (`record-format.md`). A change that is not there is reported as "Not saved". | The agent reads the page back. A change that is not there is not saved (the Notion `memory-store.md`). |
| A correction | The helper rewrites the record in place. | The agent replaces the section's text, with the new source and date. It then searches the other records and the project's Current State for the old value and corrects each place. | Same. |
| "Forget that" | The helper deletes the file and its index line, on an instruction. | Four cases: undo the save just made, remove one section, retire a whole subject, or change the fact in its place outside memory. "Bring it back" restores a retired record (`saving.md`). | Same. |
| How Mike is told | One line when the helper starts, such as "I'll record [the X update] in project memory while I keep working on [Y]." He hears the result only in four cases, for example when the helper asked a question. | One line for each save when it is done, with the record's title and where it is, such as `Saved to memory: <title>. Say 'forget that' to undo.` A failed save starts "Not saved:". | Same, with the page's link. |

Davis tells Mike that memory is being updated, and usually nothing more, so he does not see what was written unless he asks. Toolkit V2 names each record it wrote and gives the words that undo it, and it notes who approved each save, with more steps for each save.

## 7. How work items, decisions, and the page of what is true now are kept in agreement

| Point | Davis | Toolkit V2 with local memory | Toolkit V2 with Notion memory |
| --- | --- | --- | --- |
| A memory record and the page of what is true now | The helper rewrites the affected sections of `CURRENT_FOCUS.md` in the same run, when the change moves the focus, a decision, or a blocker. | The main agent updates the project's Current State in the same save. Every review of memory also checks that every line of it is still true (`memory-review-and-save.md`). | Same. |
| Who keeps a work item current | The main agent. `local-work-items.md` says to update the status, the next action, and the history "in the same response" when work moves. | The main agent, with `managing-work-items`. `keep-work-item-current.md` says to keep the whole work item true, and `lifecycle-rules.md` says to save after each step. | Same. |
| Memory work finds a work item out of date | The helper does not edit it. It tells the main agent, and the main agent corrects it. That instruction is only in the helper's own notes. | One agent keeps both, so no report is needed. `managing-project-memory` hands everything that one work item needs to `managing-work-items`. | Same. |
| A work item on the page of what is true now | The helper keeps one line per open work item. | `managing-work-items` adds, changes, and removes the work item's line under "Now", and sets "Next session starts with" in the same write (`lifecycle-rules.md`). | Same. |
| A change of status inside a work item | The line in `CURRENT_FOCUS.md` may need a change too, because it describes the work item. | The page does not change, because the line holds only the ID and a few words. | Same. |
| A decision | Up to three places hold it: the Decisions Register in ClickUp, a memory record with the headline and the link, and "Most Recent Decision" in `CURRENT_FOCUS.md`. The rule for the register, `hub-doc-protocol.md`, was not found. | One place holds it: `DECISIONS.md`, or its work item. `filing-project-records` writes the DEC ID into each work item that needs it. Memory holds no decision. | Same. |
| An old value in several records | In the example session the helper found two records that still said they waited on the call, and it corrected them. | `saving.md` ("Correcting a fact") tells the agent to search the other records and the project's Current State for the old value. | Same. |
| A work item closes | The helper updates `CURRENT_FOCUS.md` (situation 32 of the dispatch rule). | `closing.md` has the agent list the decisions, rules, terms, and lessons of the work item and file what Mike agrees to keep. `managing-work-items` removes the line under "Now". | Same. |
| Reminders from hooks for other records | None. No Davis hook reads a work item. | The settings snippets add a reminder to update the work item after a helper agent starts or reports. `codex-after-commit.mjs` adds one after a `git commit` command. | Same. |

In Davis two agents keep the records, and the records agree because the helper reports what it finds. That worked in the example session, and the instruction for it is only in the helper's own notes. In Toolkit V2 one agent keeps all of them, each kind through its own skill, and the page of what is true now holds only IDs, so fewer places can disagree.

## 8. What checks it

| Point | Davis | Toolkit V2 with local memory | Toolkit V2 with Notion memory |
| --- | --- | --- | --- |
| A count of saves | The audit hook runs when each turn ends. It adds one line to its log with the number of matching messages and the number of times the helper was started. Nothing reads the log. | None. No hook counts or logs a save. | Same. |
| The form of a memory record | No hook or script. The helper's definition has its own list of six checks. | No hook. The agent checks its own write against the list "A file is right when". `validate-records.mjs` does not read a memory record. | No hook. |
| The size and age of the page of what is true now | Nothing checks the limit of 50 lines. The helper's own notes tell it to count the lines. | `session-start.mjs` asks the agent to remove the lines that are no longer true when the page has 40 lines or more, or is more than 7 days old. | Same. |
| The work item IDs on that page | Nothing. | `validate-records.mjs` checks each ID in `memory/CURRENT_STATE.md` after an edit, and in Claude Code also when the agent stops. | Nothing. `validate-records.mjs` reads only files, and the page is in Notion. |
| The index | Nothing checks it. When it was counted, the index and the folder agreed. | A hook rebuilds it, so after a session start it cannot differ from the files. | There is no index. |
| Records that may be out of date | Situation 16 of the dispatch rule: a record found out of date starts the helper. No record holds a date to check it by. | "Check or remove by" dates, and `tidying.md` ("Stale records"), which also covers a record about something that changes and was last checked more than six months ago. | Same. A query on the Review By column finds the records that are due (the Notion `searching.md`). |
| A cleanup of all of memory | No procedure. | `tidying.md`: the project's Current State, duplicates, proposals, links, stale records, records in the wrong place, lessons that should become rules, and the owner's rules. | Same. |
| Too many records | In the example session Mike got a warning that the index was getting large. No Davis file makes that warning. | When the printed text ends "Cut short to fit the hook limit", `tidying.md` says to plan merges and retirements. | No list is printed, so no such sign. |
| Notes the writer keeps about its own job | The helper's notes folder: 9 note files, 1,183 lines with their index. | None. A lesson goes into the record for its subject, or becomes a rule. | Same. |
| What nothing checks | Whether a record is true, whether the helper was started when it should have been, the size of a record, and the work items. | Whether a save happened when it should have, the form of a memory record, the limit of each part of the project's Current State, and whether a record is true before its date comes. | The same, and also the work item IDs on the Current state page. |

Davis has one log that could show a missed save, and nobody reads it. Toolkit V2 has more checks on the page of what is true now and on the index, and none that would show a missed save.

## 9. What each costs and where each is weak

| Point | Davis | Toolkit V2 with local memory | Toolkit V2 with Notion memory |
| --- | --- | --- | --- |
| Time before Mike gets his reply | None added. | The reply waits for every save. | The reply waits for every save, and each save is several calls to Notion. |
| Time and tokens for memory work | In the example session the helper ran for about 10 minutes and used about 200,000 tokens. Mike said: "I'm not worried about tokens." | The main agent does the work in its own session. The files give no measure. | Same. |
| Text loaded in every session | The dispatch rule (200 lines), the Davis index (135 lines, 19,306 bytes), and `CURRENT_FOCUS.md` (11,369 bytes). | The rule (27 lines), the project's Current State (under 40 lines), and one line per record, cut at 9,500 characters in all. | The rule and the Current state page. |
| Text to open before one save | None for the main agent. The helper has its definition of 276 lines and reads the index. | The skill's process files are 777 lines and its local storage files 426 lines. One save opens several of them. | 777 lines and 717 lines, and `using-notion-cli`. |
| Questions to Mike | Few. The dispatch rule names four cases. | With `onboarding`, one question for each inferred save. A fact about a named person always brings one. | Same. |
| The risk of losing memory | Git tracks memory, but nothing commits it by itself. 40 paths were not committed on 2026-10-07. | Memory is never committed and is on one computer. A deleted file cannot be brought back. | Memory depends on Notion and on the `ntn` sign-in. When the page cannot be read, the hook prints that it could not be read. |
| A text that names something that is not there | The dispatch rule names two rule files that do not exist, `hub-doc-protocol.md` and `work-log-protocol.md`, and a work log folder that does not exist. `CLAUDE.md` loads a missing file, `BRAIN.md`. | `current-state.md` says the session-start hook asks with the words "Prune it". `session-start.mjs` prints other words: "Remove the lines that are no longer true". | Same. |
| Parts that are outside the project folder | The helper's definition is in `~/.claude/agents/` and holds Windows paths. The link is made by hand on each computer. | None. The skill, the rule, and the hooks are files of the project. | None. The ids of the Notion pages are in `PROJECT.md`. |
| How far a record can be trusted | A record holds no source, no date it was checked, and no approval. Mike said of the example session: "idk how accurately". The recording gave wrong speaker names in places. | Each record holds its source, the date it was last checked, and what allowed the save. No live project was checked for this report. | Same. |
| Records that no longer follow their form | 63 of 99 records were over the 30 lines the helper's definition aims for. `CURRENT_FOCUS.md` was 49 lines and 11,369 bytes. | Only the starter files were read, so there is nothing to count. No hook checks the form of a memory record. | Same. |
| What the reminder hook misses | The patterns cover 7 of the 10 groups of the dispatch rule. For 62 of 189 sessions the log showed more matching messages than starts of the helper, which does not prove a missed save. | The hook removes pasted text on purpose and prints a hint only. | Same. |
| The steps of a job that was done before | No kind of record holds them. A search through all of memory for such steps was one cause when Mike said a session was too slow (`how-the-owner-works-with-agents.md`). | The job's `event_` record holds the steps and each run. | Same. |
| A record saved in this session | The helper adds its line to the index at once. | The index is only as new as the last session start. The agent searches the files to find it. | A search is the only way to find any record. The search of Notion's API matches titles only, so the skill queries the columns (the Notion `searching.md`). |
| Codex | Not checked. The root `AGENTS.md` is one line that points to `CLAUDE.md`. | It runs in Codex too. The sandbox can block a memory write from a worktree, and Codex has no check when the agent stops. | It runs in Codex too, with no check when the agent stops. |
| Lists of single situations | The dispatch rule lists 32, and some overlap. | `memory-process.md` lists 11 in a table. Mike said on 2026-10-07 that rules for single situations make the agent "get tripped up". | Same. |

Davis costs tokens and a helper that runs for minutes. It depends on files outside the project, and its rule points to files that are not there. Toolkit V2 costs time in the turn and questions to Mike, and local memory has no copy anywhere.

## What Toolkit V2 already has from Davis

- One record per subject, changed in place, with the kind of record at the start of its name (`user_`, `project_`, `reference_`).
- An index with one line per record that the agent gets at the start of a session (local memory).
- A record body that gives the fact, then "Why" and "How to apply".
- One short page of what is true now, given to every session at its start, with a limit in lines, and changed by replacing a line.
- The rule that memory holds only what no other place holds, with pointers to the other places.
- Two of the tests for memory: the fact matters in a later session, and it is costly or unreliable to find again.
- A hook that reads each message from Mike and reminds the agent, with labels close to the Davis ones, such as a change of people, a change of focus, and a correction.
- A search for the subject's record before each save, so that no topic gets two records.
- A read of the record after each write.
- One line to Mike for each save.
- Records brought up to date in the same turn as the work.
- One file per work item, kept current by the main agent.

## What Davis has that Toolkit V2 does not

- A helper agent that writes memory in the background, and one helper for each separate fact.
- Saving with no question as the default, and no setting for approval.
- The full instruction in one rule that loads in every session, with no skill to open.
- A hook reminder that is an order to act and names the exact tool call.
- Memory in a folder that Git tracks, reached through Claude Code's own memory path.
- A log, written when each turn ends, of matching messages and starts of the helper.
- The helper's own notes on how to do its job.
- A second reader of the work items: the helper reads them and reports one that is out of date.
- `feedback` records, and people, nicknames, and the headlines of decisions as memory records.
- "Most Recent Decision" and "Last 3 Things Touched" on the page of what is true now.

## What Toolkit V2 has that Davis does not

- A record for something that happened, and a record for a job that runs again and again, with its steps and one row per run.
- Four statuses for a record, so that a replaced or retired record stays as history, and the words "forget that", "undo that", and "bring it back".
- On each record: its source, the date it was last checked, what allowed the save, and a date to check it by when the fact is true only for a while.
- A form for a claim nobody checked, and for a lesson that becomes a rule after it was seen twice.
- A table that names one place for each other kind of fact, and files that exist for each: `DECISIONS.md`, `system/`, `sources/`, `PROJECT.md`, and `.claude/rules/owner-preferences.md`.
- A save that waits for Mike's answer is kept as a proposal. After a no from Mike, the same save is not offered again.
- An index that a hook rebuilds, a check of the size and age of the project's Current State, and a check of the work item IDs in it (local memory).
- A limit for each part of the project's Current State, and the rule that it never copies a work item's status.
- A procedure for cleaning up all of memory.
- A reply line that names each record that was written.
- A choice of where memory is kept, with Notion memory that every computer and every worktree sees.
- Support for Codex as well as Claude Code.
- Every part of the memory system inside the project folder, with nothing in Mike's own `.claude` folder.
- A ban on secrets and email addresses in memory.

## What changed after version 0.9.9

On 2026-10-07 Mike approved a goal that says the agent saves without being asked and without asking. The next version rewrites the skill `managing-project-memory` around that goal. It removes the table of situations under "Before a turn ends" in `memory-process.md`, and the two approval modes with the setting "Memory approval". Version 0.9.8 had already removed the limit of five memory records saved without a question. This report describes Toolkit V2 at version 0.9.9, so sections 1, 3, and 9 differ most from the later version.

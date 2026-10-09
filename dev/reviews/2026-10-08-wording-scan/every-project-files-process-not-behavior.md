# Instructions that script the agent: every-project-files

Second pass over the same files as the first pass. The question is whether an instruction states the owner's process, or scripts how the agent thinks or behaves. "Kind" is the number from the brief (1 how to think, 2 a rule for one small situation, 3 a count that stands in for judgment, 4 a phrase list that reads as the only trigger, 5 an instruction a capable agent does anyway). Every line number was checked against the file again in this pass. A path that starts with `.claude/` or a folder name is under `plugins/toolkit/skills/project-setup/assets/every-project/`.

## Summary

I found 18 findings. Of these, 14 are borderline and 4 are not.

| Kind | Findings | Borderline |
| --- | --- | --- |
| 1 How to think or interpret | 5 | 4 |
| 2 A rule for one small situation | 4 | 4 |
| 3 A count in place of judgment | 4 | 2 |
| 4 A phrase list that reads as the only trigger | 2 | 2 |
| 5 What a capable agent does anyway | 3 | 2 |
| Total | 18 | 14 |

The files with the most findings are the root `AGENTS.md` (4), then `.claude/skills/handoff/SKILL.md`, `.claude/hooks/prompt-reminder.mjs`, and `.claude/rules/session-handoff.md` (2 each).

The main result is that the reminder hook `prompt-reminder.mjs` passes the test. Its phrase groups only add a hint, and the general condition is stated in the root `AGENTS.md` (line 20) and in `.claude/rules/memory-review-and-save.md` (line 9). The section "Phrase lists and trigger words" shows this group by group.

Most of the shipped text in my area states the owner's process: where information is kept, the form of a record, who decides, and what must be true when a job is done. The findings below are the exceptions.

## Findings

### `AGENTS.md` (root)

**`AGENTS.md:31`, kind 5**
- Text: "Decide whether the owner asks for an answer or a change."
- Why it scripts the agent: A capable agent does this without being told, and the sentence names no step of the project's process.
- What it seems to protect: The agent changing files when the owner only asked a question; cannot tell whether a test showed it.
- Proposal: Remove the sentence. The rest of the bullet states the process (find which records the message concerns, then use "Where information goes" and "Which skill").

**`AGENTS.md:9`, kind 1, borderline**
- Text: "Read for what the owner means rather than the literal wording, and ask one short question when a message is unclear or could mean two things."
- Why it scripts the agent: The first half tells the agent how to interpret a message; only the dictation fact and the question rule state process.
- What it seems to protect: Wrong actions on misheard words. The sentence is the owner's wording from the repository's own `AGENTS.md`.
- Proposal: Keep the fact and the question rule, and drop the interpretation: "The owner named in `PROJECT.md` dictates most messages with voice-to-text, so words may be misheard, missing, or out of order. When a message is unclear or could mean two things, ask the owner one short question." The owner decides, because the words are his.

**`AGENTS.md:120`, kind 2, borderline**
- Text: "Search memory before you ask the owner to repeat something, name who does or decides something, set a date, deploy, load data, or run a recurring job."
- Why it scripts the agent: It lists six situations where one general rule would cover them all.
- What it seems to protect: Acting on a fact that memory holds, such as who decides or when a job runs (the Davis rule in `reference/davis-memory-system.md` is the likely source; cannot tell).
- Proposal: "Search memory before you ask the owner to repeat something, and before you act on a fact that memory may hold, for example who does or decides something, a date, a deploy, a data load, or a recurring job."

**`AGENTS.md:140`, kind 4, borderline**
- Text: "The owner asks to read, keep, correct, forget, or find something in memory, reports a fact, a date, or what another person said, gives a standing instruction for how the agent works, asks what happened in a period, or asks to clean up memory"
- Why it scripts the agent: The row lists the owner's request types and reads as if only these start the memory skill.
- What it seems to protect: Routing every memory request to `managing-project-memory`.
- Proposal: Keep the row, because the general condition is stated in `AGENTS.md` line 20 and in the first row of "Where information goes". Add the words "for example" after "The owner" so the list reads as examples: "The owner, for example, asks to read, keep, ...". One more check for the owner: this row sends "a standing instruction for how the agent works" to `managing-project-memory`, but line 117 files the same thing in `.claude/rules/owner-preferences.md`. Which one is meant?

### `.claude/hooks/prompt-reminder.mjs` (strings and filters)

**`prompt-reminder.mjs:13-18` (the `QUESTION` and `ASKED` filters), kind 1, borderline**
- Text: "A question stays quiet: a sentence that ends in "?", and "remind me what we decided". A request phrased as a question, such as "can you ...?", "from now on ...?", or "always ...?", is kept."
- Why it scripts the agent: The code decides which of the owner's sentences count as a question, which is an interpretation of his phrasing.
- What it seems to protect: Hints that fire on a question such as "did we decide that?". A wrong hint costs one line; a missing hint costs nothing, because the hint is insurance.
- Proposal: Keep, if a test showed that the false hints were a problem. If no test did, remove the two filters, which also saves lines in a command that is at its size limit. The owner decides.

**`prompt-reminder.mjs:57-58` (the `SKILLS` line), kind 5, borderline**
- Text: "Before you answer, check this project's skills and use every one that fits this message."
- Why it scripts the agent: A capable agent picks a skill from the descriptions it already has, and `AGENTS.md` line 31 already tells it to use "Which skill".
- What it seems to protect: The agent skipping a skill; the line was probably added after an observed miss (cannot tell).
- Proposal: Keep it, as the owner's safety net, and say so in the code comment. If a test shows the agent no longer misses skills, remove it.

### `.claude/rules/session-handoff.md`

**`session-handoff.md:5`, kind 2, borderline**
- Text: "Do not offer one after a small edit or a quick lookup."
- Why it scripts the agent: It names two situations for a case that one goal would cover.
- What it seems to protect: Noisy handoff offers after trivial work.
- Proposal: Remove the line, and state the goal in line 4: "Offer a handoff when work will continue in another session, for example when this session's context has been compacted or when the owner says so."

**`session-handoff.md:3`, kind 4, borderline**
- Text: "Use the `handoff` skill when the owner says the session is ending, says context will be cleared, or asks for a handoff."
- Why it scripts the agent: The three things the owner says read as the only triggers.
- What it seems to protect: Running `handoff` at the end of every session.
- Proposal: "Use the `handoff` skill when the session is ending, or its context will be cleared. Use it also when the owner asks for a handoff." This states the condition and keeps the owner's words as an example.

### `.claude/skills/handoff/SKILL.md`

**`handoff/SKILL.md:54-59`, kind 2, borderline**
- Text: "Step 2 saved each decision that only one work item needs. Go through the five kinds below for the rest." followed by five kinds, one of which lists "a fact about a person, the client, or the project; a claim nobody checked; a lesson with no work item; a meeting or other event; and a run of a recurring job".
- Why it scripts the agent: The five kinds repeat the rows of "Where information goes" in the root `AGENTS.md`, one situation at a time.
- What it seems to protect: Nothing being left unfiled when the session ends; a live test may have shown gaps (cannot tell).
- Proposal: "Go through everything this session learned or received that no record holds yet. File each thing where "Where information goes" in the root `AGENTS.md` says. Two cases are specific to a handoff: an Open entry in `DECISIONS.md` that this session raised goes under "Open questions" in the prompt, with its DEC ID; and when there is nothing to file, say so in one line."

**`handoff/SKILL.md:89`, kind 3, borderline**
- Text: "Start a second verifier only when you rewrote a whole section. ... Never start a third verifier."
- Why it scripts the agent: The counts "second" and "third" stand in for a judgment about when another check is worth its cost.
- What it seems to protect: A loop of checks that costs time and tokens.
- Proposal: "Start another verifier only when a rewrite changed what a whole section says, and only for that section." The owner decides whether the limit of one extra verifier is a protection he wants.

### `.claude/skills/braindump/SKILL.md`

**`braindump/SKILL.md:35`, kind 3**
- Text: "A request of one or two sentences that does not ask for a playback is not a dump: do it."
- Why it scripts the agent: The count of sentences stands in for the judgment of what a dump is.
- What it seems to protect: Playing back a plain request that needs no playback.
- Proposal: "A request that is clear and does not ask for a playback is not a dump: do the work."

### `.claude/skills/session-summary/SKILL.md`

**`session-summary/SKILL.md:45`, kind 3**
- Text: "A row is a request, not a step; a long session usually holds one to three."
- Why it scripts the agent: The count describes what is normal and may pull the agent toward merging real requests.
- What it seems to protect: Rows that list steps in place of requests.
- Proposal: "A row is a request, not a step."

### `.claude/skills/reset-to-remote/SKILL.md`

**`reset-to-remote/SKILL.md:53-64`, kind 5, borderline**
- Text: A table that maps `pnpm-lock.yaml` to `pnpm install`, `package-lock.json` to `npm install`, `yarn.lock` to `yarn install`, and `bun.lockb` or `bun.lock` to `bun install`.
- Why it scripts the agent: The table lists general knowledge of the tools, one case per row.
- What it seems to protect: Running the wrong package manager after a destructive reset; the surrounding rules (one line in the plan, no install of the installer, ask when there are several lockfiles) are protections and stay.
- Proposal: Replace the table with "The lockfile on `origin/<default-branch>` decides the install command: use the package manager that wrote it." The owner decides.

### `.claude/skills/filing-project-records/references/file-source.md`

**`file-source.md:31-38`, kind 2, borderline**
- Text: A table "The source holds | Do" with six rows (a request, a decision, a fact about the system, a term, an action item, and a date or a fact about a person).
- Why it scripts the agent: Each row repeats a row of "Where information goes" in the root `AGENTS.md` for one kind of content.
- What it seems to protect: Nothing in a source being dropped; the Davis rule about action items is likely the source (cannot tell).
- Proposal: "Filing a source decides nothing and approves nothing. Read the source, and file each thing in it where "Where information goes" in the root `AGENTS.md` says. Add an action item at once, without asking, as a task in the work item it belongs to, or as a project task with that person as Who does it." The action item rule is process and stays, because it is an exception to asking.

### `.claude/skills/filing-project-records/references/record-decision.md`

**`record-decision.md:27`, kind 1, borderline**
- Text: "A job title alone does not show who decides."
- Why it scripts the agent: It tells the agent how to reason about who may decide, and line 25 already says who may decide: the owner, or the person `PROJECT.md` names.
- What it seems to protect: The agent treating a person with a senior title as a decider.
- Proposal: Remove the sentence. Line 25 and the first half of line 27 state the process.

### `system/AGENTS.md`

**`system/AGENTS.md:74`, kind 1**
- Text: "Never infer a definition from a similar word."
- Why it scripts the agent: It tells the agent how to reason, and the sentence before it already states the rule: a meaning from a source or from your own work is not a term until the owner confirms it.
- What it seems to protect: Invented glossary terms.
- Proposal: Remove the sentence.

### `.claude/rules/shared-repository-work.md`

**`shared-repository-work.md:18`, kind 1, borderline**
- Text: "An unknown worktree, a moved branch, or a change you did not make means that other sessions are working."
- Why it scripts the agent: It maps what the agent sees to a meaning.
- What it seems to protect: Undoing another session's work. The mapping is a fact about how worktrees behave, and the instruction after it ("Tell the owner") is the process.
- Proposal: Keep it, because the sentence is the reason for the next two. Write it as a process: "When you find an unknown worktree, a moved branch, or a change you did not make, another session is working here. Do not change it. Tell the owner."

### `.claude/hooks/session-start.mjs`

**`session-start.mjs:38-39`, kind 3, borderline (exact string)**
- Text: "The project's Current State is 9 days old. Remove the lines that are no longer true with the managing-project-memory skill."
- Why it scripts the agent: The 7-day threshold stands in for a judgment about when a page is stale. The 40-line limit does not: it is the form of the record.
- What it seems to protect: A Current State that is never rechecked.
- Proposal: Keep it as a safety net. The general condition is stated in `memory-review-and-save.md` line 10: "In every review, also check that every line of the project's Current State is still true."

## Phrase lists and trigger words

### 1. The reminder hook `.claude/hooks/prompt-reminder.mjs`, `PHRASES` (lines 20-41)

The hook prints this hint when a message matches a group: "This may be something to keep (<groups>)." The words "may be" and the rule `memory-review-and-save.md` line 11 ("A reminder that a hook prints is not a decision to save") make the groups insurance. A message that matches no group still goes through the process. I checked each group for a general condition, and every group has one.

| Group | Where the general condition is stated |
| --- | --- |
| remember | `AGENTS.md:20` ("When something changes what is true, put each new fact where "Where information goes" says"); `memory-review-and-save.md:9` |
| forget | `memory-review-and-save.md:18`; `AGENTS.md:140` ("forget") |
| memory change | `AGENTS.md:140`; `memory-review-and-save.md:22` |
| correction | `AGENTS.md:22` (an example: "a correction from the owner"); `AGENTS.md:20` |
| standing instruction | `AGENTS.md:117` (the row is stated by the kind of information, with the phrases as examples); `memory-review-and-save.md:16` |
| people change | `AGENTS.md:22` (an example: "a new person or a changed role"); `AGENTS.md:44` (`PROJECT.md` holds who the people are, and the row says to keep it current) |
| focus change | `AGENTS.md:20` only. The group has no example and no row of its own, but line 20 covers it |
| tool or vendor change | `AGENTS.md:20`, and `AGENTS.md:44` (`PROJECT.md` holds which systems the project uses) |
| moved reference | `AGENTS.md:20`, and `AGENTS.md:115` ("where to find something" goes in memory) |
| current work | `AGENTS.md:22` (an example: "a blocker that cleared"); `.claude/rules/keep-work-item-current.md:3` |
| lesson | `AGENTS.md:114` (a row for "a lesson that is not proven yet") |
| decision | `AGENTS.md:102` (a row), `AGENTS.md:91` (the test); the hook adds the test as a second hint |

One thing the owner may want to change: the hint prints the group names, for example "(focus change, moved reference)". A reader could take these eleven names for the only kinds of change. The condition is not in the hint. It is in `AGENTS.md:20`, which every session reads at its start, so I do not propose a change.

### 2. The question filters, `prompt-reminder.mjs` lines 13-18

These do not start a process. They stop a hint. Findings above.

### 3. The unconditional line, `prompt-reminder.mjs` lines 57-58

The skills line prints on every message. It is not a phrase list. Finding above.

### 4. `NOT_OWNER` (lines 50-52)

"Only the owner's own words are the owner's yes, not a helper agent's report, a scheduled task, another session's message, or a transcript or other source the owner shared." This is a list of things that do not count, and it protects the rule on who may say yes. It passes.

### 5. Root `AGENTS.md`

- Line 117 ("from now on", "always", "never"): the row names the kind of information (the owner's preference for how the agent works), and the phrases are examples in brackets. It passes.
- Lines 142, 143, 147, 148, and 150 give examples after "such as" ("recap this chat", "what files did you change?", "get the latest", "wipe local", "where are we"). Each row states the condition before the example. They pass.
- Line 140 is the list in the findings above.
- Line 141 ("The owner ends the session or clears context, or pastes a handoff to check") is a short list of the same kind as `session-handoff.md:3`. It states "ends the session" as the condition, so it passes.

### 6. `.claude/rules/session-handoff.md` lines 3-4

Finding above. Line 4 ("Offer a handoff when ... the work will continue in another session") states a general condition for the offer, but not for the use.

### 7. `.claude/hooks/codex-after-commit.mjs`

The `GIT_COMMIT` pattern (line 7) starts a reminder when a Bash command is `git commit`. It is a trigger on an event and not on the owner's words. The general condition is in `.claude/rules/keep-work-item-current.md` line 3 ("While you work on a work item, keep the whole work item true") and in `AGENTS.md` line 20. It passes. The same holds for the settings entry that reminds the agent after `spawn_agent` or `wait_agent` (outside my area, mentioned for completeness).

### 8. `reset-to-remote`

The phrases "wipe local" and "match remote exactly" are in the skill description (left alone). `AGENTS.md:148` and step 1 of the skill state the general condition: the owner's own words ask for a destructive reset. The condition is a protection, so it passes.

### 9. `braindump`

The phrases "tell me what you heard" and "play that back" are in the description (left alone). Line 35 of the skill (finding above) is the only place in the body that decides what a dump is.

## Numbers

Passed as a fact about a tool or a host:
- 10,000 characters (Claude Code hook output limit), and the cut at 9,500 and 9,400 in `session-start.mjs:74`; about 2,500 tokens for Codex in the settings notes.
- 1,850 characters for the list of findings, and 300 characters for one finding, in `validate-records.mjs:26` and `:275`; the hook timeouts (15,000 ms in the command, 10 and 30 seconds in the settings); `additionalContextLimit` 4000 in the Codex settings snippets.
- "git log --oneline -10" in `shared-repository-work.md:13`: the number of commits to read. It is a form of the check and not a judgment, so it passes.

Passed as the form of a record:
- Four statuses of a decision (`DECISIONS.md:11`); four marks of a rule (`system/AGENTS.md`); three lines at the top of every system document and four sections in a fixed order; IDs with three or two digits (`DEC-###`, `SRC-###`, `SEC-##`); "the five lines" of a work item's Current state and "five parts" of the project's Current State (`AGENTS.md:32`, `AGENTS.md:57`).
- Eight status words in `session-summary` (line 16) and the four columns of its table: these are exact words the owner sees.
- "under 40 lines" for the project's Current State (`session-start.mjs:38`): the form of the record, from `managing-project-memory`.
- "Exactly one line: @AGENTS.md" in each folder's `CLAUDE.md`.
- "one or two sentences" for the goal of a playback (`braindump/SKILL.md:16`), "one or two lines" for a corrected part (`:24`), and "one or two sentences" for a Decision line (`DECISIONS.md:29`): the form of what the agent writes, so they are not a judgment about the work.

Passed as a protection:
- "a file over 10 MB" in `sources/AGENTS.md:29`: it keeps large files out of the repository without the owner's yes.
- "all five proofs" in `merge-and-clean-up/SKILL.md:160` and `:178`: the conditions that must hold before anything is removed.
- "all four of these are true" in `publish-docs/SKILL.md:31`: the checks for a project document.
- The "never" limits for Git, such as "Never run `git clean` with `-x` or `-X`" in `reset-to-remote`, protect the owner's work. I read them against the brief's test and found none that tell the agent how to think.

Passed as a fact about a process step:
- "steps 1 to 3 of `publish-docs`" and similar step references: these name steps, and are not limits.
- "two commands", "three commands", and "three cases" in introductions: they count the items that follow. They are a risk only if a list changes, which the first pass already noted as a wording problem and not a process one.

# Toolkit cohesion audit

Date: 2026-10-08. Toolkit version: 0.9.18. This is an audit only. No file was changed.

## Verdict

- The toolkit fits together. The filing rules, the three main skills, the hook commands, and the record checks hand over to each other cleanly, and almost every rule has one home.
- The biggest problem is the new rule, `evaluate-the-owners-request.md`. Only the reminder hook names it, and it contradicts the instructions for replies ("answer only what was asked").
- The second problem is that two jobs every project has, the project's Current State and the owner's standing instructions, are kept in the memory skill, which a Hindsight project does not get.

## How to read the paths

- `<setup>` is `plugins/toolkit/skills/project-setup/`.
- `<every>` is `<setup>assets/every-project/`, the folder every project gets.
- `<work>` is `<every>.claude/skills/managing-work-items/references/`.
- `<memory>` is `<setup>assets/memory-process/.claude/skills/managing-project-memory/references/`.
- A number after a colon is a line number.

## Scorecard

| Area | Current state | Rating | Recommendation |
| --- | --- | --- | --- |
| Setup | One skill, one table of choices, and every file copied whole. | Good | Put the Salesforce settings into a project the same way as the other settings (finding 9). |
| Start of a session | About 48,000 characters load before the first message, and the root guide says where things go three times. | Some problems | Shorten the Project map and remove the text that loads twice (finding 5). |
| Every message | The reminder hook prints 2,716 to 3,576 characters. The same command runs in Claude Code and Codex. | Good | Keep it. Connect the rule it prints to the rest (finding 2). |
| Replies and questions to the owner | At least seven files set what a reply holds. The new rule and the output style contradict each other. | Needs work | State once how the agent asks the owner, and make the reply rules allow what the new rule asks for (findings 1 and 3). |
| Work items | One skill, clear States, six stops for the owner's yes, and hand-overs by exact step name. | Some problems | Say where the new rule's check happens in a work item, and reduce the reading for one turn (findings 2 and 6). |
| Filing records | One skill, three named steps, and the form of each record kept in its own file. | Good | Fix one sentence about who writes an ID into a work item (finding 7). |
| Memory and the project's Current State | The process is clear, but the memory skill also owns two jobs that are not memory. | Some problems | Give the project's Current State and the owner's instructions one home that every project gets (finding 4). |
| Commit checks | One command, started from three places, and every folder guide points to it. | Good | No change. |
| Update the toolkit | One reference with one table by kind of file. I read its outline, not every line. | Good | No change found. |
| Salesforce | Org safety has one home and a guard. One rule repeats the stop that the new rule and the work item approvals already ask for. | Some problems | Decide whether `confirm-salesforce-changes.md` still asks while the sandbox questions are off (finding 8). |
| The two hosts | The differences are written down. Codex reads the rules only because the root guide tells it to. | Good | Update the description of the Codex hooks (finding 10). |
| Workstreams plugin | Its instruction conflicts with nothing. It is a third place where the agent reports where work stands. | Good | No change. |

## Findings

Ranked by how much each one hurts.

### 1. The new rule and the instructions for replies contradict each other

- **What is there today.** The output style says "Answer only what the user asked" and "Do not add extra implementation detail, related advice, next steps, or an offer to do more unless the user asked for them" (`<every>.claude/output-styles/plain-english.md:11` and `:15`). The root guide says "Answer what was asked. Keep it short" (`<every>AGENTS.md:164`). The new rule tells the agent to state the goal, to raise a case the owner missed, and to show each option with what it gains and what it costs (`<every>.claude/rules/evaluate-the-owners-request.md:8`, `:13`, `:14`). Three skill files also require a closing line that offers the next step, such as "Say 'keep going' and I'll start the build" (`<work>designing.md:46`, `<memory>saving.md:169`, `<memory>tidying.md:155`).
- **Why it matters.** The rule exists to slow the owner down, and the reply instructions tell the agent to leave out exactly that. Which one the agent follows is left to chance.
- **Recommendation.** Add one general sentence to the output style and to "How to write replies": what `evaluate-the-owners-request.md` asks the agent to raise, and a closing line that a skill gives, are part of the answer.
- **Size of the change.** Small. It changes the output style, so it needs the owner's yes.

### 2. Only the reminder hook names the new rule

- **What is there today.** A search of the starter project finds the rule's name in one file only, `<every>.claude/hooks/prompt-reminder.mjs:54-56`. "Your job as the agent" (`<every>AGENTS.md:11-22`) and the row for `.claude/rules/` (`:82`) do not name it. The sentence "Where owner-preferences.md says otherwise, that file wins" is in the hook's code only. The rule file and `<setup>assets/owner-preferences.md:3` do not say it. The work item skill asks for the goal in its own two forms: "So the goal is <one sentence>?" (`<work>refining-requirements.md:29`) and "Say the goal in one or two sentences" (`<work>lifecycle-rules.md:162`).
- **Why it matters.** An agent that reads the guide cannot see how the rule relates to the goal "without being asked and without asking" (`<every>AGENTS.md:20`) or to the steps of a work item. In Refining Requirements the agent can state the goal for the rule and then ask for it again for step 3.
- **Recommendation.** Name the rule once in "Your job as the agent", with two sentences: the owner's own file wins over it, and the rule covers what to build or change, while the goal there covers recording what is true. Add one sentence to `lifecycle-rules.md`: for a work item, the rule's check is done in Refining Requirements and Designing, and the goal question of step 3 is the rule's goal line.
- **Size of the change.** Small.

### 3. How to ask the owner for a decision is written in five forms

- **What is there today.** The output style: name the choice and the difference (`plain-english.md:13`). The root guide: the same, "and recommend one" (`<every>AGENTS.md:168`). The work item skill: a four-line question block, in the reply text, never through a question tool, one question in each reply (`<work>refining-requirements.md:94-103` and `:145`). Setup: one question per message (`<setup>SKILL.md:119`, `<setup>references/interview.md:5`). The new rule: the goal, how it is built today, the best way, what would change, and every option explained from the start (`evaluate-the-owners-request.md:13-14`).
- **Why it matters.** Outside a work item and setup, no always-loaded text says to ask in the reply text, one question at a time, with a recommendation. A Claude Code session and a Codex session also get different words: only the root guide says "recommend one".
- **Recommendation.** State once, in the root guide, how the agent asks the owner: in the reply text, one question in each reply, complete without earlier messages, each option with what it gains and costs, and a recommendation. The skills keep only their exact forms, such as the question block and the exact closing questions, and point to that statement.
- **Size of the change.** Small to medium.

### 4. Two jobs that every project has are kept in the memory skill

- **What is there today.** The form of the project's Current State, with its five parts and line limits, is in the memory skill (`<memory>current-state.md:22-32`), again in the Hindsight rule (`<setup>assets/memory-hindsight/.claude/rules/hindsight-memory.md:27-36`), again in the template's guide (`<setup>assets/memory-local/memory/CURRENT_STATE.md:3`), and the 40-line limit is also in the hook (`<every>.claude/hooks/session-start.mjs:38`). The steps for writing the owner's standing instruction into `owner-preferences.md` are in the memory skill (`<memory>saving.md:149-163`), although the rule says such an instruction never goes in memory (`<every>.claude/rules/memory-review-and-save.md:16`). A Hindsight project gets one line for it (`hindsight-memory.md:14`). The steps for writing a project skill are in the memory clean-up file (`<memory>tidying.md:125-129`). A sentence that sends a Hindsight project to `.claude/rules/hindsight-memory.md` in place of the memory skill is on 23 lines in 12 shared files, for example `<work>closing.md:50`, `:67`, `:99`, although `hindsight-memory.md:8` already states that once for every file.
- **Why it matters.** A change to one limit needs four edits. A Hindsight project runs a shorter second copy of both jobs. Every other record follows the owner's rule of 2026-10-05, that the form of a record is in its own file and a skill points to it. These two do not.
- **Recommendation.** Give each job one home that every project gets: one file for the form of the project's Current State, and the steps for an owner's instruction beside `owner-preferences.md`. The memory skill, the Hindsight rule, and the template then point to it. Remove the repeated sentences on those 23 lines. This keeps the decision that a Hindsight project gets no toolkit memory skill.
- **Size of the change.** Medium to large. It touches many files and needs a step in "update the toolkit".

### 5. About 48,000 characters load at the start of a session, and part is repeated

- **What is there today.** In Claude Code, a local project that is not a Salesforce project loads the root guide (22,501 characters), `PROJECT.md` (3,776 as a template), the always-on rules with `owner-preferences.md` (18,629, of which the writing rule is 8,284), and the output style (2,811). A Salesforce project adds 9,890 characters of always-on rules. The Project map is 10,619 characters, 47% of the root guide (`<every>AGENTS.md:36-87`). Its 21 rows for single files inside `system/`, `delivery/`, `work-items/`, `memory/`, `sources/`, and `reference/` (3,709 characters) repeat the folder guides, for example `:60-67` repeats `<every>system/AGENTS.md:9-20`. The root guide names the skill for one record three times, for example `DECISIONS.md` at `:48`, `:102`, and `:139`. In Claude Code, "How to write replies" (`:160-170`) repeats the output style, `cite-recalled-knowledge.md:8` repeats `plain-english.md:17`, and `session-handoff.md:3` repeats `:141`. The steps for "where are we" are 753 characters inside one table cell (`:150`).
- **Why it matters.** The owner asked whether rules are "all over the place". Inside the one file every session reads first, the same routing is given three times, so a change must be made three times.
- **Recommendation.** Keep one row for each top-level location in the Project map, and let each folder's guide list its own files. Keep the routing in "Where information goes" and "Which skill" only. Move the "where are we" steps into the skill that owns work items.
- **Size of the change.** Medium. The root guide is the owner's approved text, so it needs the owner's yes.

### 6. One turn on a work item needs 41,000 to 53,000 characters of reading

- **What is there today.** The skill tells the agent to open `SKILL.md` (4,189 characters), `lifecycle-rules.md` (21,582) on "every work-item turn", the work tracker file (7,712 for local files), and the file for the State (7,322 to 19,983) (`<every>.claude/skills/managing-work-items/SKILL.md:10` and `:20-28`). The table of the skill's files is written twice, in `SKILL.md:16-41` and in `<work>lifecycle-rules.md:263-281`.
- **Why it matters.** The agent reads the rules for project phases, project tasks, and the short path on every turn, also when the turn is one answer in an interview. Long required reading is the text an agent is most likely to skip.
- **Recommendation.** Keep in `lifecycle-rules.md` what applies on every turn: the State table, the stops for the owner's yes, and the rules for every State. Move what applies at one moment, such as phases, project tasks, and the short path, to files opened at that moment. Remove the second table. Do not shorten sentences to do this.
- **Size of the change.** Medium.

### 7. Four rules are stated twice in different words

- **What is there today.**
  - A standing merge instruction "counts as that yes" with no condition in the always-on rule (`<every>.claude/rules/shared-repository-work.md:32`). Its home sets three conditions (`<work>deploying.md:35-40`).
  - "Each deploy needs the owner's yes" (`<work>deploying.md:76`), but the list of stops says "each deploy to an environment that other people use" (`<work>lifecycle-rules.md:140`).
  - "Only this skill writes these IDs into work items" (`<every>.claude/skills/filing-project-records/SKILL.md:60`), but "`managing-work-items` records the rule IDs in the work item" (`.../filing-project-records/references/update-system-doc.md:49`) and "Steps 5 and 6 write those IDs into the work item" (`<work>closing.md:68`).
  - `publish-docs` "commits only an edit the owner asked for or said yes to" (`<every>reference/AGENTS.md:41`), but `publish-docs` also commits an edit that the root guide or another skill tells the agent to make (`<every>.claude/skills/publish-docs/SKILL.md:37`).
- **Why it matters.** Each pair gives the agent two answers to one question. The first pair lets a merge through with no checker when the agent reads only the rule.
- **Recommendation.** In each pair, keep the full rule in its home and make the other file point to it.
- **Size of the change.** Small.

### 8. A Salesforce rule asks for the same stop as the new rule

- **What is there today.** `<setup>assets/salesforce/.claude/rules/confirm-salesforce-changes.md:3-11` tells the agent to state what it will change and what could break, "Then wait for the owner", before any change to objects, fields, security, or integrations. The new rule and the approvals of a work item already ask for this. `salesforce-org-safety.md:37` lets the agent deploy to a sandbox without asking while the sandbox questions are off, and neither rule names the other.
- **Why it matters.** The owner turned the sandbox questions off to "just get stuff done in the sandbox". This rule still stops the agent before each field change, and it has no "when you found nothing to raise, do the work".
- **Recommendation.** Ask the owner which he wants, then say it in one sentence in `confirm-salesforce-changes.md`: either the rule applies only where no approved requirement or design covers the change, or it applies always.
- **Size of the change.** Small.

### 9. Salesforce settings reach a project in three different ways

- **What is there today.** The Claude Code hooks for memory are added from snippets in `<setup>assets/settings/`. The Salesforce hooks and `sf` permission rules for Claude Code are in the file every project gets (`<every>.claude/settings.json:12-39` and `:67-71`), and setup takes them out of a project that is not a Salesforce project (`<setup>references/setup-copy.md:121-123`). The Salesforce hooks for Codex come with the Salesforce folder (`<setup>assets/salesforce/.codex/hooks.json`).
- **Why it matters.** The rule "a choice decides which files a project gets, never which lines" (`setup-copy.md:71`) has one exception, and a project that is not a Salesforce project depends on a removal step that could be missed.
- **Recommendation.** Add the Salesforce entries for Claude Code from a snippet, as the memory hooks are added.
- **Size of the change.** Medium. `check-skills.mjs` and the tests read these files.

### 10. Small leftovers from earlier designs

- **What is there today.**
  - Three rows of one table all name `managing-work-items` (`<setup>assets/work-local/work-items/AGENTS.md:69-71`), and five rows all name `managing-project-memory` (`<setup>assets/memory-local/memory/AGENTS.md:34-38`). They date from when two skills shared each job.
  - `memory-review-and-save.md:3` and `:20-23` still present a memory save as something the owner's yes covers, although the agent now saves without asking (`<memory>memory-process.md:54`).
  - The description of the Codex hooks names "a memory reminder" only (`<setup>assets/settings/codex-hooks.local.json:2`), but the hook now prints the skills line and the rule on every message.
  - `codex-after-commit.mjs` runs in Claude Code and in Codex.
  - `second-brain@claude-toolkit` is turned off in two files (`<every>.claude/settings.json:9`, `<setup>assets/settings/enabled-plugins-off.json:7`).
  - The root guide does not name `writing-harness-files` in "Which skill" or beside `.claude/rules/` and `.claude/skills/` (`<every>AGENTS.md:82-83`, `:118`).
- **Why it matters.** None of these breaks anything. Each one makes a reader wonder which statement is current.
- **Recommendation.** Fix them in one pass. A changed description in a Codex hooks file means the owner must trust the hooks again in Codex, so tell him.
- **Size of the change.** Small.

## Would revisit an earlier decision

- **The sandbox questions line (Mike, 2026-10-07).** The owner's choice to turn the sandbox questions off is a standing instruction, and it is kept in the project's Current State, not in `owner-preferences.md` (`salesforce-org-safety.md:34-36`). The file that describes the project's Current State does not know this line (`<memory>current-state.md:22-32`), so a clean-up that removes "every line that is no longer true" has no rule for it.
- **The rule printed on every message (Mike, 2026-10-08).** In Claude Code the rule is in context twice at the first message, once as a rule and once from the hook. The hook also prints it on turns the owner did not type, such as a helper agent's report (`prompt-reminder.mjs:4-6`). I recommend no change now.
- **Finding 4 does not revisit the decision of 2026-10-05** that a Hindsight project gets no toolkit memory skill. It moves two jobs out of that skill.

## Working well

- One table, "Where information goes", decides where each kind of information is kept. The skills, the rules, and the hook hint point to it and do not repeat it (`<work>lifecycle-rules.md:8`, `filing-project-records/SKILL.md:16`, `<memory>memory-criteria.md:9`, `prompt-reminder.mjs:42`).
- Skills hand over by exact step names: "record a decision", "file a source", and "update a system document".
- The form of a decision, a source, and a system rule is in its own file, and the filing skill points to it (`filing-project-records/SKILL.md:37-40`).
- The goal for keeping the records is stated once (`<every>AGENTS.md:20`), and the memory skill points to it (`<memory>memory-process.md:26`).
- The design helpers already check the whole flow and the existing build (`<work>design-critic-brief.md:47-49`), which is what the new rule asks for.
- The reminder hook reads the rule from its file, so the rule has one place to change.
- A search for retired names, such as `tracking-work-items`, `project-wide-records`, and "Memory approval", finds none in the starter project.
- "Session" and the two "Current State" names are used the same way in every file I read.

## Suggested order

1. **One small work item: make the new rule fit.** Findings 1, 2, and 3. They change the same few files: the output style, the root guide, and one sentence in the work item skill. All three need the owner's yes.
2. **One small work item: one statement for each rule.** Findings 7, 8, and 10. Finding 8 starts with one question to the owner.
3. **One medium work item: a home for the project's Current State and the owner's instructions.** Finding 4. It needs a design first, because existing projects must be updated.
4. **One medium work item: less to read.** Findings 5 and 6. Both change text the owner approved, so show him the shorter root guide before the starter project changes.
5. **Later, when the settings are next changed.** Finding 9.

## What I did not read in full

- I read in full: the root guide, every rule of `every-project`, `owner-preferences.md`, the output style, the three smaller hook commands, the settings snippets, the folder guides, `DECISIONS.md`, `PROJECT.md`, `managing-work-items` (`SKILL.md`, the lifecycle rules, and the six State files), `filing-project-records`, the core of `managing-project-memory`, the Hindsight rule, the Salesforce rules, and `project-setup/SKILL.md`.
- I read only the outline or a part of: `update.md`, `one-home-layout.md`, `move-over.md`, `old-toolkit-pieces.md`, `earlier-versions.md`, `finishing.md`, `interview.md`, `placing-files.md`, the Notion and GitHub references, `hindsight-on-vps.md`, `tidying.md`, the storage references for memory and for the three trackers, the two templates, `validate-records.mjs` after its first 30 lines, and the skills `handoff` (first 80 lines), `merge-and-clean-up`, `publish-docs` (first 75 lines), `pull-latest`, `reset-to-remote`, `filechanges`, and `session-summary`.
- I did not read the `sf-*` skills, the Salesforce guards, or `tools/`. I read the workstreams plugin's instruction to the agent only.
- I ran no session. I could not check what a Codex helper agent loads, so this audit makes no claim about it.

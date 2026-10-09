# Instructions that script the agent: setup-part-one

Area: the 15 files of the onboarding skill `project-setup` listed in the first pass. All paths are under `plugins/toolkit/skills/project-setup/`. I read `AGENTS.md`, section "Three instructions for text that tells an agent what to do", and the brief, and I opened each quoted line again before I wrote it.

Overall: these files are almost all procedure. They state steps, the order of steps, where information goes, exact commands, exact words for the owner, and protections such as "never deploy to production". The Notion and settings files are specifications of a tool (the Notion API, the Codex settings), which the brief counts as facts about a tool. I found 14 places where the text does more than state the process. Twelve are borderline, and nothing in them is a large rule.

## Summary

Findings by kind:

| Kind | Meaning | Count | Of which borderline |
| --- | --- | --- | --- |
| 1 | Tells the agent how to think or interpret | 3 | 3 |
| 2 | A sentence or row for one small situation | 5 | 4 |
| 3 | A number where the agent should judge | 0 | 0 |
| 4 | A phrase list or phrase mapping | 4 | 3 |
| 5 | Tells the agent what a capable agent does anyway | 2 | 2 |
| Total | | 14 | 12 |

The three files with the most findings:
1. `references/finishing.md`: 4 findings (FIN-1 to FIN-4).
2. `SKILL.md`: 4 findings (SKILL-1 to SKILL-4).
3. `references/interview.md`: 2 findings (INT-1, INT-2).

`references/placing-files.md`, `references/salesforce.md`, `references/notion.md`, and `references/notion-build/work-setup.md` have one each. `setup-copy.md`, `skills-hooks-settings.md`, `github.md`, `notion-build/setup.md`, `work-layout.md`, `work-item-page.md`, `project-page.md`, and `memory-page.md` have none.

## Findings

### `SKILL.md`

**SKILL-1. `SKILL.md:22`** (kind 1, borderline)
- Text: "Read for what the user means rather than the literal wording, and ask one short question when a message is unclear or could mean two things."
- Why it scripts: It tells the agent how to interpret the owner's messages instead of stating a step of the setup process.
- What it protects: The owner dictates by voice, and a misheard word could start the wrong setup job. This paragraph is word for word the first paragraph of the repository `AGENTS.md`, so it is likely the owner's own sentence.
- Proposal: keep it, because it is the owner's wording. If the owner wants only process in this skill, replace it with the process fact: "When a message is unclear about which setup job the owner wants, ask one short question before you start." That keeps the question and drops the instruction to interpret.

**SKILL-2. `SKILL.md:36`** (kind 4, borderline)
- Text: "The words the owner used do not decide it. When the owner says "toolkit v2" and nothing else, bring this folder onto Toolkit V2 with the job that fits the folder."
- Why it scripts: The last sentence maps one phrase to a meaning.
- What it protects: A live case where "toolkit v2" alone gave no clue to the job. The general rule is stated in the sentence before ("The folder decides which job this is"), so the phrase is an example.
- Proposal: keep the first two sentences and mark the phrase as an example: "For example, when the owner says only "toolkit v2", the folder still decides the job."

**SKILL-3. `SKILL.md:56`** (kind 4)
- Text: "An update is also the job when the owner says only "toolkit v2"."
- Why it scripts: It maps a phrase to a job, and line 36 already says that the folder decides the job and gives the same example.
- What it protects: The same ambiguity as SKILL-2, stated a second time.
- Proposal: remove the sentence.

**SKILL-4. `SKILL.md:86`** (kind 4, borderline)
- Text: "One case asks the owner first. The folder holds files of the older claude-toolkit, and the owner asked to update the toolkit or to check the setup without naming Toolkit V2."
- Why it scripts: The case is defined by two phrases the owner used instead of by the general condition, which is that the request could mean either toolkit.
- What it protects: Updating or checking the wrong toolkit in a folder that holds files of the older one.
- Proposal: replace the condition with the general one: "One case asks the owner first. The folder holds files of the older claude-toolkit, and it is not clear which toolkit the owner means." The three bullets after it stay.

### `references/interview.md`

**INT-1. `interview.md:27`** (kind 5, borderline)
- Text: "Code already here | `ls -a` | Name the language and the framework that you see."
- Why it scripts: A capable agent names the language and framework of a folder without being told, and the row states no fact about the process.
- What it protects: Cannot tell. The result may feed the outcome suggestion in `finishing.md` step 1 ("From the code I'd suggest"), but this row does not say so.
- Proposal: keep the check and give it a purpose: "Look at the code in the folder, because `finishing.md`, "Fill the prompts", step 1 suggests the project's outcome from it." Otherwise remove the row.

**INT-2. `interview.md:60-64` and `:87-91`** (kind 2, borderline)
- Text: the "Good when" column, for example "The project is a solo project on one computer." (local), "The owner wants the board on a phone or on the web." (Notion), "The code is already kept on GitHub." (GitHub Issues).
- Why it scripts: Each cell is a situation that maps to a choice, where the recommendation sentence above the table ("Recommend local folders with Obsidian, because ...") already states the process: recommend one choice with its reason.
- What it protects: The agent's recommendation matches the owner's preference for each case. The memory table's "Good when" cells (for example "Most projects.", "Search by meaning across past sessions matters.") carry the same kind of mapping.
- Proposal: keep the "What to know" column, which holds facts, and keep the one recommendation sentence for each question. The owner decides whether the "Good when" column should stay as the owner's own guidance for recommendations.

### `references/finishing.md`

**FIN-1. `finishing.md:35-37`** (kind 5, borderline)
- Text: "Never invent a fact to fill a prompt." ... "Never add made-up questions to finish setup."
- Why it scripts: The first bullet repeats the sentence above the list ("Fill the prompts only with facts that the owner confirmed"); the third says what a capable agent does not do and names no step of the process.
- What it protects: Probably a case where the agent filled a prompt from guesses or asked extra questions at the end. I cannot tell which test showed it.
- Proposal: remove the first bullet, which the line above states. Replace the third with the process fact: "Ask only the questions that `interview.md` and this file give." The middle bullet ("Setup is never a work item") is a process rule and stays.

**FIN-2. `finishing.md:60`** (kind 2, borderline)
- Text: "In a new project with no code yet, ask nothing more for these two files. Leave their prompts and list them in the report."
- Why it scripts: It adds a case to the rule two lines above it ("Ask the owner only what the repository cannot answer").
- What it protects: Keeps the end of setup short for an empty project, and sends the open prompts to the report.
- Proposal: keep "Leave their prompts and list them in the report" as the general rule for any prompt the owner has not answered, which lines 54 and 63 already say. The owner decides whether "ask nothing more" should stay as a fixed rule for an empty project.

**FIN-3. `finishing.md:63`** (kind 2)
- Text: "In a new project it usually stays as it is."
- Why it scripts: It forecasts what usually happens instead of stating a step, and the sentence before it ("Fill it only when the owner already knows the facts") already covers the case.
- What it protects: Cannot tell. It adds no rule.
- Proposal: remove the sentence.

**FIN-4. `finishing.md:78`** (kind 2, borderline)
- Text: "A setup answer is not an instruction. These answers never go in `owner-preferences.md`: whether the owner uses Claude Code, Codex, or both; where work items and memory are kept; the project name; and the outcome."
- Why it scripts: The first sentence is the general rule, and the list names four cases that it already covers.
- What it protects: Keeps the owner's own file free of setup answers, which the toolkit stores in "Toolkit settings" and `PROJECT.md`.
- Proposal: keep the first sentence and turn the list into examples: "A setup answer is not an instruction, so it never goes in `owner-preferences.md`. For example, the project name, where work items and memory are kept, and the outcome are setup answers."

### `references/placing-files.md`

**PLACE-1. `placing-files.md:61`** (kind 4, borderline)
- Text: "When the owner answers "yes to all", carry out every row as shown."
- Why it scripts: It maps one phrase to an action. The sentence before it ("Carry out each row as the owner answers it") is the general rule.
- What it protects: A reply that approves the whole table at once.
- Proposal: replace the quoted phrase with the meaning: "When the owner agrees to every row at once, carry out every row as shown."

### `references/salesforce.md`

**SF-1. `salesforce.md:52`** (kind 1, borderline)
- Text: "Never call a version the newest or the current one from memory, because Salesforce adds a new API version three times a year."
- Why it scripts: It tells the agent not to rely on its own knowledge, which is an instruction about how to think.
- What it protects: A wrong API version written into `sfdx-project.json` and `package.xml`. The reason is given, and the line before it already says to ask the owner when the version cannot be read.
- Proposal: keep it. The line before already states the process (read the version from the owner's sandbox, or ask the owner); this sentence is the protection for the case where the agent is tempted to fill it in. A shorter form that states the same process is "Write only a version that the sandbox or the owner gave."

### `references/notion.md`

**NOT-1. `notion.md:52`** (kind 1, borderline)
- Text: "A line about the database inside a message that asks something else does not count as asking."
- Why it scripts: It tells the agent how to interpret what counts as a question to the owner.
- What it protects: The owner's yes for which Projects database to use; the line before says to ask in a message of its own, so this sentence is a second statement of the same rule.
- Proposal: remove this sentence and keep "Ask the question as a message of its own ... and make no project page until the owner answers" and "The owner's yes to the plan does not cover which database". Those two state the process.

### `references/notion-build/work-setup.md`

**WS-1. `work-setup.md:292-294`** (kind 2, borderline)
- Text: "A task that is not ticked gets Not Started. A ticked task gets Done, or Cancelled when its title starts with "Cancelled: "." / "When Status was added in this run, set every task's Status this way and ask nothing."
- Why it scripts: It lists cases of old data and maps a title phrase to a status. The rule is a data migration, so it is closer to an exact mapping than to behavior.
- What it protects: The correct Status of existing tasks when a project moves from the Done checkbox to Status; the owner used "Cancelled: " in titles before the Cancelled status existed.
- Proposal: keep it as an exact migration rule, because the mapping cannot be inferred. The owner decides whether it still applies to any project. If no project still has a Done checkbox, the section can be removed with the migration.

## Phrase lists and trigger words

| Where | The phrases | Is the general condition also stated? | Where |
| --- | --- | --- | --- |
| `SKILL.md:36` and `:56` | "toolkit v2" and nothing else | Yes for line 36, which says that the folder decides the job. No for line 56, which stands alone (SKILL-3). | `SKILL.md:36` |
| `SKILL.md:86` and the references that name jobs ("update the toolkit", "check the setup", "change a setup choice") | The owner's job names | Yes. The folder decides which job it is, and a job name tells the agent which part of a set-up project to follow. The one case that depends on phrases (line 86) is SKILL-4. | `SKILL.md:36` |
| `references/skills-hooks-settings.md:47` | "remember this" as a phrase "such as" | Yes. The text says "such as", so the phrase is an example. The general goal, that the agent keeps the project's records in the same turn without being asked, is in the starter root `AGENTS.md` line 20. | `assets/every-project/AGENTS.md:20` |
| `references/finishing.md:135` | "remember this: we use Postgres" | Not a trigger list. It is the test input for the check of `prompt-reminder.mjs`, and the check says the reminder is "added for a "remember this" message", which is a fact about what the hint does. | n/a |
| `references/placing-files.md:61` | "yes to all" | Yes. "Carry out each row as the owner answers it" comes first (PLACE-1). | `placing-files.md:61` |
| `references/notion-build/work-setup.md:292` | A title that starts with "Cancelled: " | Not a trigger. It is a migration mapping (WS-1). | `work-setup.md:292` |

Skill descriptions are left alone, as the brief says.

## Numbers

Every count, limit, or threshold below passes. I read each as a fact, the form of a record, or a protection.

- "eight steps" of "New project" (`SKILL.md:95`, `:97`): the form of the process, one step per line of the list.
- "five questions" (`interview.md:3`, `SKILL.md:102`): the interview's own structure.
- "10 lines" of "Toolkit settings" (`setup-copy.md:103`, `:153`): the form of a record that the skills read. The check prints 10.
- "10 shared" skills, "plus 1", "plus 1", "plus 3" (`interview.md:140`, `skills-hooks-settings.md:22`, `:125`): a count of folders that `check-skills.mjs` compares with the folders, so it is a fact.
- "the 4 small hook commands" and "four hook commands" (`interview.md:124`, `SKILL.md:158`): a fact about what ships.
- "up to 30" labels and "30 labels" (`interview.md:133`, `github.md:80`): a fact about the label list in `work-tracker-labels.md`.
- "200 lines" and "22,528 bytes", with Codex's "32,768 bytes" (`finishing.md:144-145`): a fact about the hosts' limits. The first pass asked for the reason of 22,528.
- "10,000 characters", "2,000 characters", "roughly 2,500 tokens" (`finishing.md:138`): facts about the size limits of Claude Code and Codex hook output.
- "`max_context_tokens = 10000`" and "2%" and "500,000 tokens" (`skills-hooks-settings.md:65`): facts about the Codex setting.
- "seven `permissions.ask` entries" (`skills-hooks-settings.md:84`): a fact about what an earlier version shipped.
- "three times a year" (`salesforce.md:52`): a fact that gives the reason for a protection (SF-1).
- "two to four capital letters" for the work item ID prefix (`work-setup.md:70`): the form of an ID.
- "up to 15" pinned properties and "`page_size==100`" (`work-layout.md:64`, `work-setup.md:83`, `:109`): facts about Notion.
- "steps 1 to 13" and "steps 11 to 13" (`work-setup.md:46`): references to the steps of one procedure.
- "one or two sentences" for each Current state line (`work-item-page.md:8`): the form of a record.
- "one to six `#`" (`setup-copy.md:92`): a fact about the form of a Markdown heading.
- "one question per message" (`interview.md:5`, `SKILL.md:102`): the owner's process for the interview.
- "a few lines" and "a few words" (`interview.md:121`, `finishing.md:214`): these words leave the length to the agent, which is the form the owner asked for.
- "Check 24" count: the list of 24 final checks is a list of what must be true when the job is done, not a threshold.

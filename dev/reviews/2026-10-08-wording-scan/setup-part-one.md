# Wording scan: setup-part-one

Reader: the 15 files of the onboarding skill `project-setup`, read as a capable stranger who was in none of the design sessions. Measure: `document-clarity-standard.md` (called "the standard" below). All paths are under `plugins/toolkit/skills/project-setup/`. Line numbers are the lines of the files in this worktree.

How to read an entry: "Breaks" names the section of the standard and the first words of the line. Where the text is an exact string that a tool or another file reads, the entry says "exact string". "(P1 in flight)" does not apply: none of these files is on the other branch.

## Files read

All 15 files were read in full. None could not be read.

| File | Verdict | High / Medium / Low | Biggest problem |
| --- | --- | --- | --- |
| `SKILL.md` | small fixes | 0 / 8 / 9 | "prompt", "fill-in guide", `ntn`, "VPS" and "Hindsight" are used before anyone explains them; two rules say two things |
| `references/interview.md` | small fixes | 0 / 8 / 6 | The checks table splits each check from its action; "earlier setup" has two meanings; one table cell holds eight sentences |
| `references/setup-copy.md` | small fixes | 0 / 4 / 6 | "Make these four changes" lists a change that changes nothing; one heading hides a second subject |
| `references/placing-files.md` | small fixes | 0 / 3 / 6 | The numbered table of questions is used before it is introduced; one step ends with a dangling "first" |
| `references/skills-hooks-settings.md` | small fixes | 0 / 8 / 5 | The list of hook commands covers 2 of 4; "Merge rules" is one long list of mixed rules; the same fact is stated three times |
| `references/finishing.md` | small fixes | 0 / 9 / 7 | A flat list of 24 checks; a contradiction about which files a check may change; an unexplained byte limit |
| `references/salesforce.md` | small fixes | 0 / 3 / 4 | The rule that skips step 1 sits inside step 1 |
| `references/github.md` | small fixes | 0 / 3 / 2 | One bullet holds five blocks of instruction; the heading "Checks after either" does not say what it covers |
| `references/notion.md` | small fixes | 0 / 2 / 3 | `ntn` is never said to be Notion's command-line tool; one question to the owner is dense |
| `references/notion-build/setup.md` | small fixes | 0 / 2 / 3 | "step 1 below at its step 5" cross-references; bare file numbers "06", "10", "13" |
| `references/notion-build/work-setup.md` | needs a rewrite | 0 / 12 / 5 | One 379-line file does five jobs with no map from job to section; several broken or unclear sentences |
| `references/notion-build/work-layout.md` | small fixes | 0 / 1 / 5 | Facts sit under no heading; a table cell packs four sections |
| `references/notion-build/work-item-page.md` | small fixes | 0 / 0 / 4 | Template text says "his"; mostly exact string |
| `references/notion-build/project-page.md` | clear as it is | 0 / 0 / 0 | none |
| `references/notion-build/memory-page.md` | small fixes | 0 / 0 / 1 | "Lore" is not explained on the page |

Totals: 0 High, 63 Medium, 66 Low. Nothing found would make a reader do the wrong thing without a second look; the Medium findings are places where the reader must read again, guess, or follow a pointer to find the meaning.

## Findings

### `SKILL.md`

**SKILL-1. `SKILL.md:28-32` and `:46-47` (Medium).**
- As is: "This skill and its reference files use three names throughout:" ... "A line for a service still shows its prompt." ... "The project's Current State still has its fill-in guide."
- Breaks: Words and names, "A made-up word is new or has a meaning that exists only in this project."
- Trouble: "prompt" and "fill-in guide" are made-up words used from line 46 on, but only `finishing.md:31` says what they are, so the reader cannot follow "stopped part way" without opening another file.
- Rewrite: change "three names" to "five names" and add two bullets after the "setup copy" bullet:
  - "A **prompt** is text in angle brackets, such as `<Project name>`, that tells the agent which fact to write in its place."
  - "A **fill-in guide** is the comment at the top of a copied file that says how to fill that file's prompts."
  Then `finishing.md:31` can drop its own definition (see pattern A).

**SKILL-2. `SKILL.md:98` (Medium).**
- As is: "Record each answer the owner gives as a checked line, for example `- [x] Work items: local`, because a later turn may start without this skill loaded."
- Breaks: Words and names, "Make the subject of "this", "that", "it", and "they" clear" (here the place is not named), and Sentences, "Name who acts".
- Trouble: The sentence does not say where to record the line. Line 140 forbids saving some things in a file, so the reader may guess a file or the plan tool.
- Rewrite: "Record each answer the owner gives in the plan tool as a checked item, for example `- [x] Work items: local`. Then a later turn that starts without this skill loaded can still read the answers."

**SKILL-3. `SKILL.md:70` (Medium).**
- As is: "This case fits when the owner asks to open a project's Hindsight dashboard. It also fits when the owner asks to change a setting of the project's Hindsight bank, or to build observations in it. It also fits when a Hindsight project is set up but this computer lacks its key or the add-on, which happens on a new computer."
- Breaks: Words and names, "A made-up word is new...", and Sentences, "Put one idea in a sentence".
- Trouble: Three sentences repeat "It also fits"; "Hindsight", "bank", and "observations" are never explained in this file (the first use of Hindsight is line 13).
- Rewrite: "Use this case when the owner asks for either of these, or when a Hindsight project is set up but this computer lacks its key or the add-on (which happens on a new computer):" followed by two bullets: "to open the project's Hindsight dashboard;" and "to change a setting of the project's Hindsight bank, or to build observations in it." Then keep the pointer sentence. Add to "How setup works" one clause for each of Hindsight (the owner's own memory server), bank (one project's store of memory on that server), and observations. I did not open `hindsight-on-vps.md`, so the clause for "observations" must come from there.

**SKILL-4. `SKILL.md:104` and `:177` (Medium).**
- As is: "`ntn login` for Notion, and `gh auth login` for GitHub." ... "what runs on the VPS".
- Breaks: Words and names, "Write an abbreviation in full the first time it appears".
- Trouble: `ntn` is never said to be Notion's command-line tool, and "VPS" is never written out. See pattern B.
- Rewrite: "`ntn login` for Notion (`ntn` is Notion's command-line tool), and `gh auth login` for GitHub (`gh` is GitHub's command-line tool)." and "what runs on the owner's virtual private server (VPS)".

**SKILL-5. `SKILL.md:137` (Medium).**
- As is: "Only two other kinds of file are written outside the project folder:"
- Breaks: Words and names, "Make the subject of "this"..." and Extra rules for documents, "Give each instruction its own sentence."
- Trouble: "other" than what? The line above lists Notion pages, repositories, labels, banks and installs as things that need the owner's yes, so "two other kinds of file" reads as a contradiction.
- Rewrite: "Setup writes files outside the project folder in only two cases:"

**SKILL-6. `SKILL.md:151` (Medium).**
- As is: "Keep a `| jq` filter in the same command as the call it filters. Never join two such commands."
- Breaks: Words and names, "Make the subject of "this", "that", "it", and "they" clear."
- Trouble: "such commands" could mean two escalated commands or two `jq` calls, and the list above says to run each command alone.
- Rewrite: "Keep a `| jq` filter in the same command as the call it filters. Never chain two separate calls into one command."

**SKILL-7. `SKILL.md:96-98` (Medium).**
- As is: "Anything else: a new project ... Put the eight steps in the plan tool. In Claude Code the plan tool is the task list, and in Codex it is `update_plan`."
- Breaks: Extra rules for documents, "Organize the document so that a reader can find a thing from the headings alone."
- Trouble: A rule for how to run all eight steps sits under a case heading that only chooses the job. `finishing.md:80` points to it as "Which setup job to do", and a reader looking for the plan tool will not look under "Anything else".
- Rewrite: move the two bullets to the start of "New project", before step 1, and keep the case section to "When no case above fits, the project is new. Do the eight steps of "New project" below." Change the pointer in `finishing.md:80` to `SKILL.md`, "New project".

**SKILL-8. `SKILL.md:127` (Medium).**
- As is: "Never get past a failure by setting the project up in some other folder and copying it over. The setup copy in a temporary folder, in steps 4 to 6, is the normal way."
- Breaks: Sentences, "Say what to do." and Words and names, "Be specific."
- Trouble: The setup copy is itself a copy built in another folder, so the two sentences look like they contradict each other.
- Rewrite: "Never work around a failure by building the project in a different folder and copying it over. The only copy allowed is the setup copy that steps 4 to 6 build in a temporary folder."

**Low findings, `SKILL.md`: 9.** Examples:
- `:22` "The user dictates most messages" uses "user" while every other line says "owner" (Words and names, "use the same name every time").
- `:59` "and fix none that fail" is a negative instruction; write "and do not fix a failed check".
- `:15` "The owner is the person the agent works for" comes after the word is used in lines 13 and 15.

### `references/interview.md`

**INT-1. `interview.md:21-47` (Medium).**
- As is: the table "Look before asking", whose cells end with "do what the list for this check under the table says."
- Breaks: Extra rules for documents, "Organize the document so that a reader can find a thing from the headings alone."
- Trouble: For four of nine checks the reader runs a command in the table, then scrolls to a list under the table to learn what to do, and must match the list to the row by its title.
- Rewrite: keep one short table of the commands, and give each check that needs an action its own heading: "A Git repository", "A linked worktree", "A folder that already has a name setup uses". Put the command, the meaning of the result, and the actions together under each heading. See Layout.

**INT-2. `interview.md:24` (Medium).**
- As is: "The main checkout is the project's main folder, and it is the first line of the first command: `worktree <path>`. When `<path>` and the folder that the second command prints differ, this session runs in a linked worktree..."
- Breaks: Words and names, "Make the subject of "this", "that", "it", and "they" clear."
- Trouble: "it" could mean the main folder or the main checkout, and a sentence of three ideas hides the test.
- Rewrite: "The first command lists the project's worktrees. Its first line, `worktree <path>`, names the main checkout, which is the project's main folder. The second command prints the folder this session runs in. When the two folders differ, this session runs in a linked worktree, which is a separate folder with its own branch. In that case, do what the list for this check under the table says."

**INT-3. `interview.md:29-30` (Medium).**
- As is: "An earlier setup | Look in `PROJECT.md` for a filled "Toolkit settings" section." ... "An earlier setup that is not Toolkit V2 | ..."
- Breaks: Words and names, "use the same name every time."
- Trouble: `SKILL.md:80` calls a folder with a setup that is not Toolkit V2 "a folder with an earlier setup". Row 7 here gives the same words to a project that already has Toolkit V2. One name has two meanings.
- Rewrite: name row 7 "Toolkit V2 already set up" and row 8 "Another toolkit's setup, to move over". Keep the cell texts.

**INT-4. `interview.md:85` (Medium).**
- As is: "Memory holds two things. The first is where the project stands now."
- Breaks: Paragraphs and sections, "Start a paragraph or a section with the sentence that states its point."
- Trouble: The explanation of what memory is comes after the Hindsight steps and just before the table, so the reader meets "recommend local memory" and the Hindsight steps first.
- Rewrite: put the paragraph at line 85 directly under the heading "Question 3: where memory is kept", before "Recommend local memory with Obsidian". Then the recommendation, the table, and the Hindsight steps follow. See Layout.

**INT-5. `interview.md:91` (Medium).**
- As is: the "Hindsight" row's last cell, eight sentences long.
- Breaks: Sentences, "Put one idea in a sentence" and Words and names, "Be specific."
- Trouble: A table cell cannot be scanned. The reader cannot see the five separate facts in it.
- Rewrite: shorten the cell to "See the list below the table." and add under the table:
  "Hindsight (`hindsight`) is good when search by meaning across past sessions matters.
  - Memory is on the owner's Hindsight server, with one memory bank per project, and never on Hindsight Cloud.
  - Hindsight's coding-agent add-on, installed once on this computer, saves each session to the bank.
  - Hindsight turns the saved text into memories with a model at OpenAI, through the owner's ChatGPT subscription.
  - The project gets no memory skills. The agent uses the add-on's tools.
  - The project's Current State is the local file `memory/CURRENT_STATE.md`."

**INT-6. `interview.md:135` (Medium).**
- As is: "create the memory bank <bank> on your Hindsight server (or use this project's own bank), and install Hindsight's coding-agent add-on for Claude Code and Codex, or add this project to it; that changes files in `~/.claude`, `~/.codex`, and `~/.hindsight`, and I'll show you each change before I make it; the bank gets the settings you chose"
- Breaks: Sentences, "Put one idea in a sentence, or two ideas that belong together." The brief's W8 also applies: this is text the agent says to the owner.
- Trouble: One sentence holds five ideas joined by semicolons and commas.
- Rewrite: "Create the memory bank <bank> on your Hindsight server (or use this project's own bank). Install Hindsight's coding-agent add-on for Claude Code and Codex, or add this project to it. This changes files in `~/.claude`, `~/.codex`, and `~/.hindsight`, and I'll show you each change before I make it. The bank gets the settings you chose."

**INT-7. `interview.md:60` and `:87` (Medium).**
- As is: column headings `"Tracker" value` and `"Memory" value`.
- Breaks: Words and names, "A made-up word is new or has a meaning that exists only in this project."
- Trouble: "Tracker" is the project's word for where work items are kept, and neither the file nor the heading says that the value goes on a line of "Toolkit settings".
- Rewrite: `Value for the "Tracker" line of "Toolkit settings"` and `Value for the "Memory" line of "Toolkit settings"`.

**INT-8. `interview.md:78` (Medium).**
- As is: "Hindsight here is the owner's Hindsight server on the owner's VPS. Nothing is installed on this Mac except Hindsight's coding-agent add-on."
- Breaks: Words and names, "Write an abbreviation in full the first time it appears". Also "this Mac" assumes the computer.
- Trouble: "VPS" is not written out in this file, and a Windows owner would read "Mac" as wrong.
- Rewrite: "Hindsight here is the owner's own Hindsight server, which runs on a rented remote computer (a virtual private server, or VPS). Nothing is installed on this computer except Hindsight's coding-agent add-on."

**Low findings, `interview.md`: 6.** Examples:
- `:40` "The setup commit must also be on the default branch" does not say why this needs the main checkout. Rewrite: "A linked worktree has its own branch, so a commit made there would not be on the default branch."
- `:66` "(the owner deferred it)" is history the reader cannot use.
- `:93` "Lore's layout, in the second row, is the set of Notion databases" defines the word after the table that uses it.

### `references/setup-copy.md`

**COPY-1. `setup-copy.md:90-100` (Medium).**
- As is: "Make these four changes in the copied files." followed by a bullet that says "Leave every example ID in the copied files as it is".
- Breaks: Sentences, "Give every item in a list the same form."
- Trouble: The list holds three changes and one instruction to change nothing, so "four changes" is wrong.
- Rewrite: "Make these three changes in the copied files." Then give the project name, the People row, and "Toolkit settings" as the three bullets. Put the example IDs bullet after them as its own paragraph: "Leave every example ID in the copied files as it is, whatever prefix the owner chose. ..."

**COPY-2. `setup-copy.md:48` (Medium).**
- As is: "A work choice adds its `references/work-tracker.md` and supporting files inside the `managing-work-items` skill that `every-project` already supplied." ... "so the finished project has one version of each selected reference and no storage skill of its own."
- Breaks: Sentences, "Put one idea in a sentence" and Words and names, "A made-up word...": "storage skill", "supplied".
- Trouble: One paragraph holds six sentences about three subjects; "no storage skill of its own" has no visible meaning.
- Rewrite: "Copy `every-project` first, then each chosen folder. A chosen folder adds files to skill folders that other folders already put there:
  - A work choice adds `references/work-tracker.md` and its supporting files to the `managing-work-items` skill.
  - Local or Notion memory adds `references/memory-store.md` and its supporting files to the `managing-project-memory` skill.
  The owner makes one work choice and one memory choice, so the finished project has one version of each of those reference files and no separate skill for storage."

**COPY-3. `setup-copy.md:132` and `:146` (Medium).**
- As is: heading "The owner-preferences rule"; line 146 "A Salesforce project has a second file of this kind, `.claude/rules/salesforce-agent-permissions.md`."
- Breaks: Extra rules for documents, "Give each section one subject."
- Trouble: The heading names one file, the section covers two, and line 146 has five sentences.
- Rewrite: keep "The owner-preferences rule" for lines 134-144 (other files cite that heading) and add a new section "The Salesforce permissions rule": "A Salesforce project also gets a second file of this kind, `.claude/rules/salesforce-agent-permissions.md`. It comes with the `salesforce` folder and holds the owner's choices about what an agent may do in each kind of org, with the toolkit's defaults. Copy it whole and change nothing in it. When the owner gives such a choice during the interview, write it into the file, in the place that the first bullets of the file give. "Update the toolkit" copies it only into a Salesforce project that has none, and never compares or replaces it afterwards." Add the new heading to the Contents list.

**COPY-4. `setup-copy.md:155` (Medium).**
- As is: "Run `ls -A <skill folder>/assets/every-project`, the same command for each folder you copied, and `ls -A <copy>`. The last list holds every name of the other lists except `.agents`, plus `memory` with Hindsight memory, and no other name."
- Breaks: Words and names, "Make the subject of "this", "that", "it", and "they" clear."
- Trouble: "The last list" and "the other lists" must be counted by position, and "plus `memory` with Hindsight memory" is hard to parse.
- Rewrite: "List the top-level names of `<skill folder>/assets/every-project` and of each other folder you copied, with `ls -A`, and list `<copy>` the same way. `<copy>` must hold every name from the other lists except `.agents`. It must also hold `memory` when memory is in Hindsight, and no other name."

**Low findings, `setup-copy.md`: 6.** Examples:
- `:38` defines `<skill folder>` after line 35 uses it.
- `:71` "the three sections after "Never copied"" points by position; name the three sections.
- `:5` repeats the definition of "setup folder" (pattern A).

### `references/placing-files.md`

**PLACE-1. `placing-files.md:57` and `:61` (Medium).**
- As is: "In the file's row of the numbered table described below, say in one line what differs..." and "Carry out each row as the owner answers it. When the owner answers "yes to all", carry out every row as shown."
- Breaks: Write steps in the order the reader does them (Sentences), and Words and names, "Make the subject of "this", "that", "it", and "they" clear."
- Trouble: The table is used before it is introduced, and "as shown" could mean the recommendation or the difference.
- Rewrite: move the paragraph at line 61 above the table and write it as: "Show every file that needs the owner's answer in one numbered table, with one row per file, a one-line reason in each row, and your recommendation. Ask once. Carry out each row as the owner answers it. When the owner answers "yes to all", carry out your recommendation in every row." Change the last table row to: "Add the file to the numbered table. In its row, say in one line what differs, and recommend one of three choices: keep the owner's file, take the toolkit's file, or merge the two. The owner's file stays until the owner chooses."

**PLACE-2. `placing-files.md:79` (Medium).**
- As is: "After the owner's yes, move each of those skills into `.claude/skills/` first."
- Breaks: Sentences, "Write steps in the order the reader does them."
- Trouble: "first" at the end says "before what?" without naming it.
- Rewrite (assumes the later steps are to remove the folder and make the link): "When the command prints anything else, stop and ask the owner, because the folder may hold the owner's own Codex skills. After the owner's yes, first move each of those skills into `.claude/skills/`. Then remove the folder and make the link."

**PLACE-3. `placing-files.md:127` (Medium).**
- As is: ""Check the setup" changes nothing in this section. In "check the setup", the final checks report the setting..."
- Breaks: Words and names, "Be specific."
- Trouble: "changes nothing in this section" is not an action the reader can follow. The reader must guess that the job skips the steps above.
- Rewrite: ""Check the setup" runs none of the steps of this section. It only reports the `core.hooksPath` setting, whether `.githooks/pre-commit` is executable, and what `validate-records.mjs` prints. `finishing.md`, "Final checks", lists those checks."

**Low findings, `placing-files.md`: 6.** Examples:
- `:31` "Lines for folders (`cd`) need nothing." is cryptic; write "Ignore lines that start with `cd`; they name folders."
- `:59` the `.ignore` sentence is convoluted. Rewrite: "`.ignore` lists `work-items/` and `memory/` so that ripgrep, and with it the search tools of Claude Code, still read them, although `.gitignore` hides them."
- `:129` heading "6. Check" does not say what is checked; write "6. Check the result".

### `references/skills-hooks-settings.md`

**SHS-1. `skills-hooks-settings.md:45-50` (Medium).**
- As is: "The four hook commands are in ...: `session-start.mjs`, `prompt-reminder.mjs`, `codex-after-commit.mjs`, and `validate-records.mjs`." The bullets then describe only `prompt-reminder.mjs` and `validate-records.mjs`.
- Breaks: Extra rules for documents, "Give each instruction its own sentence" and Paragraphs and sections, "Use as many points as the subject needs."
- Trouble: The reader is told four commands and is given two. A stranger who runs the check cannot tell what `session-start.mjs` and `codex-after-commit.mjs` do.
- Rewrite: add two bullets before the existing ones:
  - "`session-start.mjs` runs when a session starts. It prints the project's Current State and, with local memory, one line for each memory record."
  - "`codex-after-commit.mjs` runs after the agent makes a commit and prints a reminder. [The writer must fill in what the reminder says from the command itself; I did not open it.]"

**SHS-2. `skills-hooks-settings.md:65` (Medium).**
- As is: "That value is the largest value Codex accepts here, and it is more than the 2% default for a model with a context window under 500,000 tokens."
- Breaks: Sentences, "Put one idea in a sentence" and Words and names, "Be specific."
- Trouble: The sentence compares a token count with a percentage, and "that value" and "it" have two possible subjects.
- Rewrite: "The Codex plugins-off snippet also sets `max_context_tokens = 10000` under `[skills]`, which is the most Codex accepts here. Codex limits the list of skill descriptions to 2% of the model's context window by default. When the list passes that limit, Codex cuts every skill description short, and the Toolkit skills lose their "Use when" and "Not for" parts. For a model with a context window under 500,000 tokens, 10000 tokens is more than 2% of the window."

**SHS-3. `skills-hooks-settings.md:67` (Medium).**
- As is: "The account's own setting replaces such a table."
- Breaks: Words and names, "Make the subject of "this", "that", "it", and "they" clear."
- Trouble: No table has been named yet; the TOML table `[plugins."<name>"]` first appears at line 117.
- Rewrite: "Do not add a `[plugins."<name>"]` table for a plugin that comes from the owner's ChatGPT account. The name of such a plugin ends in `@openai-curated-remote`, and the account's own setting overrides a table in the project."

**SHS-4. `skills-hooks-settings.md:84` (Medium).**
- As is: "When the file holds an old end-of-reply check, an older Codex matcher, or one of the seven `permissions.ask` entries for `sf` commands..."
- Breaks: Words and names, "Name the thing directly."
- Trouble: "end-of-reply check" is not a name the reader can see in a settings file. Line 132 shows that it is a `Stop` hook of type `prompt`.
- Rewrite: "an old end-of-reply check (a `Stop` hook of type `prompt`)". Also at the end of that bullet: "Never add an end-of-reply check" becomes "Never add a `Stop` hook of type `prompt`".

**SHS-5. `skills-hooks-settings.md:85-87` (Medium).**
- As is: "Add a plain value (text, a number, true or false) that the file does not have." with sub-bullets "When the file already has that plain value with a different value..."
- Breaks: Words and names, "Be specific."
- Trouble: "plain value" is used for both a setting and its value, so "that plain value with a different value" reads as nonsense.
- Rewrite: "Add a setting whose value is plain (text, a number, true or false) when the file does not have the setting. When the file already has the setting with a different value:
  - take the snippet's value when the file comes from the setup copy;
  - ask the owner when the file is one that the project already had. `placing-files.md` and `update.md` send you to these rules for such a file."

**SHS-6. `skills-hooks-settings.md:73-94` (Medium).**
- As is: "Merge rules": 11 top-level bullets, some with two levels of sub-bullets.
- Breaks: Extra rules for documents, "Organize the document so that a reader can find a thing from the headings alone."
- Trouble: One list mixes where to start, how to treat hook handlers, how to treat plain settings, what never to delete, the order for `validate-records.mjs`, and the special `.codex/hooks.json` file, so the reader cannot find the rule for one case.
- Rewrite: split into the sub-sections in Layout, keeping each rule word for word.

**SHS-7. `skills-hooks-settings.md:22`, `:36-39`, `:41` (Medium).**
- As is: "A work choice adds the selected tracker references inside `managing-work-items`, not another skill." / "Two rows name another file of this skill:" / "A work choice adds tracker references, and a local or Notion memory choice adds store references."
- Breaks: Paragraphs and sections, "Leave out a sentence that the reader does not need."
- Trouble: The same fact appears three times in this file (and again in `setup-copy.md:48`), and "tracker references" and "store references" are made-up words. The bullets at lines 38-39 repeat what the table cells already say.
- Rewrite: say it once at line 22: "A work choice adds one selected `references/work-tracker.md` and its supporting files inside `managing-work-items`, not another skill. With local or Notion memory, the memory choice adds one selected `references/memory-store.md` inside `managing-project-memory`. Hindsight adds no Toolkit memory skill." Delete lines 36-39 and 41, and move the detail "how to check that Salesforce's own skills are installed, and what to tell the owner when they are not" into the Salesforce table cell.

**SHS-8. `skills-hooks-settings.md:130-131` (Medium).**
- As is: "Each of the toolkit's hook handlers is in each settings file once. Count the `hooks/*.mjs` names with `grep -o`, and the `echo` helper reminders with `jq`." and then "`validate-records.mjs` is named twice in `.claude/settings.json`".
- Breaks: Words and names, "Be specific", and Extra rules for documents, "Keep an exact instruction exactly as it is written."
- Trouble: The check gives no command to run, and "once" is followed at once by an exception that says "twice".
- Rewrite: "Each of the toolkit's hook handlers is in each settings file once, with one exception. Count the `.mjs` names with [the exact `grep -o` command] and the `echo` handlers with [the exact `jq` command]. The exception is `validate-records.mjs`: `.claude/settings.json` names it in two handlers (after an edit, and at stop with `--all`), and `.codex/hooks.json` names it once." The writer must add the two commands; I did not invent them.

**Low findings, `skills-hooks-settings.md`: 5.** Examples:
- `:63` defines "helper agent" after the table that uses it at lines 58-59.
- `:50` "the two guards" and "the graph Stop hook" are not explained here.
- `:92` "the text of the `salesforce` folder's file" does not say which file; write "the `description` in the `salesforce` folder's `.codex/hooks.json`".

### `references/finishing.md`

**FIN-1. `finishing.md:36-37` (Medium).**
- As is: "Never add made-up questions to finish setup."
- Breaks: Words and names, "Be specific."
- Trouble: "made-up" can mean "invented to fill a gap" or "not in the interview", and the agent cannot tell which question is allowed.
- Rewrite: "Ask only the questions that `interview.md` and this file give. Do not add other questions to finish setup." (If the intended meaning differs, this is a question for the owner.)

**FIN-2. `finishing.md:96` (Medium).**
- As is: "Keep the five headings and their line limits."
- Breaks: Extra rules for documents, "When you point to another file, say what is in the file and when to open it."
- Trouble: The limits are not given here. They are in the fill-in guide of `memory/CURRENT_STATE.md`, and line 105 then says to delete that guide, so the limits disappear.
- Rewrite: "Keep the five headings and the line limit for each, which the file's fill-in guide gives." Question for the owner: because the guide is deleted at line 105, point to `managing-project-memory` if it restates the limits.

**FIN-3. `finishing.md:171-176` (Medium).**
- As is: "...so that checking changes no file:" ... "That index is the one file a check may change." and then ""Check the setup" puts one kind of file back".
- Breaks: Wording review W4 (two lines say different things); the standard, "Be specific."
- Trouble: Line 173 says the index is the one file a check may change, and line 176 says another change is allowed.
- Rewrite: "Two checks run differently in "check the setup", so that they change no file except the ones named in this section:" and "That index is the only file that the session-start check may change."

**FIN-4. `finishing.md:113-158` (Medium).**
- As is: the numbered list of 24 checks.
- Breaks: Extra rules for documents, "Organize the document so that a reader can find a thing from the headings alone."
- Trouble: Checks that every project runs (1 to 18, 24) are mixed with checks for one choice (19 to 23), and the reader cannot see which apply.
- Rewrite: split into two sub-headings. See Layout. Keep the numbers, because other files may cite them.

**FIN-5. `finishing.md:144-147` (Medium).**
- As is: "`wc -lc AGENTS.md` must print 200 lines or less and 22,528 bytes or less." and "Claude Code recommends under 200 lines."
- Breaks: Extra rules for documents, "When an instruction would look arbitrary, give the reason in one clause."
- Trouble: The reader sees 22,528 and 32,768 and cannot tell how the first comes from the second. "200 lines or less" and "under 200 lines" also differ.
- Rewrite: "…must print 200 lines or less and 22,528 bytes or less. The byte limit leaves [the reason for the gap to Codex's 32,768-byte total] ..." Question for the owner: what is the reason for 22,528? Align "under" and "or less".

**FIN-6. `finishing.md:62` and `:66` (Medium).**
- As is: "A file keeps its fill-in guide comment for as long as the file holds a prompt. Delete the guide when the last prompt is filled." and "Delete each fill-in guide comment when its own text says to delete it."
- Breaks: Wording review W4 (two lines that say different things).
- Trouble: Two rules say when to delete a guide, with two different conditions.
- Rewrite for step 6: "**The fill-in guide comments.** Delete a fill-in guide comment when its last prompt is filled (step 3), or when its own text says to delete it. Keep the guide comment inside "Toolkit settings", because later sessions read it."

**FIN-7. `finishing.md:143` (Medium).**
- As is: "...report what it prints, and the reason that `placing-files.md`, "5. The pre-commit check", gives for that result. Step 2 of that section holds the two commands that show which row of its table fits."
- Breaks: Sentences, "Put one idea in a sentence".
- Trouble: "that result" and "which row of its table fits" need two pointers followed in the right order.
- Rewrite: "When it prints something else, or nothing, report what it printed and the reason from the row of the table in `placing-files.md`, "5. The pre-commit check", that fits. Step 2 of that section holds the two commands that show which row fits."

**FIN-8. `finishing.md:148` (Medium).**
- As is: "`command grep -L '^paths:' .claude/rules/*.md` lists the rules with no `paths` line in their front matter."
- Breaks: Words and names, "A made-up word is new or has a meaning that exists only in this project" (here `command grep` and "front matter").
- Trouble: `command grep` is explained only in `setup-copy.md:153`. A reader of this file does not know why it is not plain `grep`.
- Rewrite: add "(`command grep` runs the system grep, because plain grep in Claude Code skips the folders that `.gitignore` names)". Write "front matter" as "the settings block at the top of the file".

**FIN-9. `finishing.md:41-54` (Medium).**
- As is: step 1 "The project's outcome", with bullets nested to four levels.
- Breaks: Extra rules for documents, "Organize the document so that a reader can find a thing from the headings alone."
- Trouble: One step holds the question, the places to write, the Notion field, and the case where the owner has not answered, with sentences repeated ("Write nothing until the owner answers" at line 46 and "Until the owner answers, leave the outcome prompts" at line 54).
- Rewrite: split step 1 into three short parts with plain labels: "Ask for the outcome", "Where the outcome goes", and "When the owner has not answered". Say "leave the prompts and list them in the report" once.

**Low findings, `finishing.md`: 7.** Examples:
- `:80` points to `SKILL.md`, "Which setup job to do", for the plan tool; after SKILL-7 it should point to "New project".
- `:140` says "Report each finding" while line 163 says to fix what a check finds; say which applies to check 12.
- `:183` "Put none of these files back" is a negated instruction; write "Do not put these files back in a project set up before the current folder layout; "update the toolkit" gives it these files."

### `references/salesforce.md`

**SF-1. `salesforce.md:54` (Medium).**
- As is: "A project that already had its own `sfdx-project.json` keeps its `sourceApiVersion`. For such a project, skip step 1, leave `sfdx-project.json` as it is, and write that version in the `package.xml` only."
- Breaks: Sentences, "Put the condition before the action" and "Write steps in the order the reader does them."
- Trouble: The rule that skips step 1 is the last bullet inside step 1, so the reader runs `sf org display` before learning it was not needed.
- Rewrite: move it to the opening of the section, before step 1: "When the project already had its own `sfdx-project.json`, keep its `sourceApiVersion`: skip step 1, leave `sfdx-project.json` as it is, and write that version in the `package.xml` only."

**SF-2. `salesforce.md:53` (Medium).**
- As is: "...leave `XX.0` in both files, add no other line anywhere, and list it in the report as a prompt left."
- Breaks: Words and names, "Be specific."
- Trouble: "add no other line anywhere" could mean no "Waiting on" line in the Current State, or no note in any file. The agent must guess.
- Rewrite (needs the owner's confirmation of the meaning): "When the owner does not know the version yet, leave `XX.0` in both files, write no "Waiting on" line for it, and list the version in the report among the prompts that are left."

**SF-3. `salesforce.md:36` (Medium).**
- As is: "...and the report lists the line as a prompt left."
- Breaks: Words and names, "Make the subject of "this", "that", "it", and "they" clear."
- Trouble: "the line" could be the "Waiting on" line or the org aliases line.
- Rewrite: "...and the report lists the missing org aliases among the prompts that are left."

**Low findings, `salesforce.md`: 4.** Examples:
- `:13` "or in the plugin list" does not say whose list.
- `:23` has a quoted heading inside a quoted heading; name the table row instead.
- `:7` "the two org guards" is not explained.

### `references/github.md`

**GH-1. `github.md:33-43` (Medium).**
- As is: one bullet, "When the repository does not exist, ask the owner. ...", that holds a command, a second command, a rule about public repositories, and the push rule.
- Breaks: Extra rules for documents, "When one point needs several rules, give the main rule first. Then give each special case on its own line."
- Trouble: The push rule applies to the whole step but sits inside the "repository does not exist" bullet, and the second command starts with "Only when".
- Rewrite: "- When the repository does not exist, ask the owner. Never create a repository without the owner's yes. After the owner's yes:" with sub-bullets "when the repository will also hold this project's code (the usual case), create it private and connected to this folder in one step: [command]", "when the repository will hold the issues alone, create it with `gh repo create <repo> --private`", and "never make a public repository unless the owner asks for one in the owner's own words". Then a separate bullet: "Do not push in this step. Never push until the owner says yes to the push question after the setup commit: "Push <default> to <owner>/<repo>?", where <default> is the branch the setup commit is on. `finishing.md`, "The commit offer", says when to ask that question." Then the `hasIssuesEnabled` bullet.

**GH-2. `github.md:72` (Medium).**
- As is: "List the open issues without the layout, with the command in `work-tracker-searching.md`, "Issues without the layout"."
- Breaks: Words and names, "A made-up word is new..."
- Trouble: "the layout" is not defined in this file.
- Rewrite: "List the open issues that lack the current section layout of a work item, with the command in `work-tracker-searching.md`, "Issues without the layout"."

**GH-3. `github.md:74` (Medium).**
- As is: heading "Checks after either".
- Breaks: Words and names, "Give every heading a name in ordinary words that tells the reader what the section covers."
- Trouble: "either" has no visible referent when the heading is cited alone, as `finishing.md:157` cites it.
- Rewrite: "Checks after a new project or an update". Update lines 3, 10, 47, 76 of this file and `finishing.md:157`.

**Low findings, `github.md`: 2.** Examples:
- `:50` "the agent notices and carries on" uses an idiom; write "the agent reads the change and continues".
- `:43` repeats the push question that `finishing.md:249` also words.

### `references/notion.md`

**NOT-1. `notion.md:9` and `:27` (Medium).**
- As is: "- `ntn whoami`;" and "It prints the "Notion CLI" connection".
- Breaks: Words and names, "Write an abbreviation in full the first time it appears" ("CLI") and "A made-up word...".
- Trouble: No line of this file says what `ntn` or "Notion CLI" is. Only the table at `finishing.md:191` says "the Notion command-line tool".
- Rewrite: at line 9: "- `ntn whoami` (`ntn` is Notion's command-line tool, called "Notion CLI" in Notion's settings);". Check the second phrase with the owner.

**NOT-2. `notion.md:36` (Medium).**
- As is: "...two empty templates (one in your Projects database, one in the Work Items database inside it), two choices of 'Set as default', and the page layout of the databases inside it."
- Breaks: Wording review W8 (text the agent says to the owner is plain and short), and the standard, "Put one idea in a sentence".
- Trouble: The question has four things in one sentence, with a bracketed aside inside a list.
- Rewrite: "Your Projects database has no Project template yet, so I need you to make one in the Notion app. You will make two empty templates (one in your Projects database and one in the Work Items database inside it), click "Set as default" on each, and set the page layout of the databases inside the template. I will give you the clicks a few at a time and fill in everything else. After that, every new Notion project, and every card you add with "New", starts from the template. Shall I start?"

**Low findings, `notion.md`: 3.** Examples:
- `:96` "They never remove, rename, or retype anything" uses "retype" for "change the type of".
- `:66` repeats the prefix rule that `work-setup.md` step 2 states.
- `:79` "Then put that page's id in the session-start hook:" follows a paragraph, not a step.

### `references/notion-build/setup.md`

**NSET-1. `notion-build/setup.md:24-28` (Medium).**
- As is: "That section runs the four steps below at these points: - step 1 below at its step 5; - steps 2 and 4 below at its step 8; - step 3 below at its step 10."
- Breaks: Words and names, "Make the subject of "this", "that", "it", and "they" clear."
- Trouble: "below" and "its" point to two different files in one phrase.
- Rewrite: a table:
  | Step in this file | Run at this step of `work-setup.md`, "A new project" |
  | 1. Find the memory databases | 5 |
  | 2. Name the project in Lore's Projects database | 8 |
  | 3. Record the links | 10 |
  | 4. Fill the Current state page | 8 |

**NSET-2. `notion-build/setup.md:95`, `:99`, `:100` (Medium).**
- As is: "Then send 06 (...) and 07 (...) to Memories, and then the Tags options from 08." ... "Rename the first view with 10." ... "Create 11, `12-view-by-work-item.json`, and 13".
- Breaks: Words and names, "Be specific."
- Trouble: A bare number does not say it is a file number in `assets/schema/`.
- Rewrite: "file 06", "file 07", "file 08", "file 10", "file 11", "file 13". The same applies to `work-setup.md:336` ("the body of 12").

**Low findings, `notion-build/setup.md`: 3.** Examples:
- `:81` "The current folder layout keeps decisions, system rules, terms, and sources as files in the repository." is history the step does not use.
- `:70` "add each missing column alone" means "one at a time".
- `:104` repeats the private-test-area rule of `work-setup.md:364`.

### `references/notion-build/work-setup.md`

**WS-1. `work-setup.md:3-22` (Medium).**
- As is: "Open it for one of five jobs: setting up a new Notion project, adding work items or memory to a Notion project later, bringing an older project up to the current template, building the templates for the first time, or rebuilding a damaged template."
- Breaks: Extra rules for documents, "Organize the document so that a reader can find a thing from the headings alone."
- Trouble: The file names five jobs but does not say which sections serve which, so the reader scans 379 lines to find the part to follow.
- Rewrite: add a table after the opening:
  | Job | Sections to follow |
  | Set up a new Notion project | Where the templates are kept; A new project; Removing the part a project keeps elsewhere; Recording the links in PROJECT.md; Checks after any of these |
  | Add work items or memory later | Adding work items or memory later |
  | Bring an older project up to the current template | Bringing a project up to the current template; From Stage to State; From the Done checkbox to Status |
  | Build the templates for the first time, or rebuild a damaged one | Building the templates (first time, or a damaged one) |

**WS-2. `work-setup.md:48` (Medium).**
- As is: "Bring "Project" up to the current toolkit layout at every update and before every copy..."
- Breaks: Words and names, "use the same name every time."
- Trouble: The file says "current toolkit layout", "current template", and "current layout" for one thing, and "current folder layout" (lines 32, 240) for a different thing in the repository.
- Rewrite: use "the current Notion layout" for the Notion thing in every place (lines 48, 50, 64, 68, 126, 167, 174 and the headings), and keep "current folder layout" for the repository only.

**WS-3. `work-setup.md:34` (Medium).**
- As is: "The title of the work item template is empty. So the title that the owner types on a card is kept, and the boards' empty-title filter hides the template."
- Breaks: Wording review W4 (vague link between cause and effect); the standard, "When an instruction would look arbitrary, give the reason in one clause."
- Trouble: "So" joins two reasons to the empty title without saying them; the real reason appears only at line 344.
- Rewrite: "The title of the work item template is empty, for two reasons. Notion puts a template's title in front of every title the owner types on a card, and an empty title lets each board's filter hide the template."

**WS-4. `work-setup.md:61-69` (Medium).**
- As is: step 1 "Take the template's id", which also holds the whole check that the template is current and the update procedure.
- Breaks: Extra rules for documents, "Give each section one subject."
- Trouble: The step title names one action and the step holds three, with three levels of bullets.
- Rewrite: rename step 1 "Take the template's id, and check that it is current" and split its bullets into "Take the id", "Check that the template is current (reads only)", and "When the template is not current". Do not renumber, because `setup.md` cites steps 5, 8, and 10.

**WS-5. `work-setup.md:171` (Medium).**
- As is: "Run step 6 for the memory part, although memory is also in Notion."
- Breaks: Words and names, "Be specific."
- Trouble: Step 6 of "A new project" says to skip it when memory is in Notion, so "although" reads as a contradiction.
- Rewrite: "Run step 6 to remove the memory part from the new page, because the old page already holds the project's memory. (Step 6 normally skips this when memory is also in Notion.)"

**WS-6. `work-setup.md:182-184` (Medium).**
- As is: "Never remove or rename anything, and never change the type of anything." ... "The only exceptions are the Tasks "Done" checkbox and the type of the Tasks Status..."
- Breaks: Wording review W4 (two lines in the skill say different things).
- Trouble: "The only exceptions" is false: step 3 renames a view (line 214), step 4 replaces the Requirements section (lines 244-249), and `notion.md:96-102` and `setup.md:68` list more.
- Rewrite: "Never remove or rename anything, and never change the type of anything, except what this section names: the Tasks "Done" checkbox and the type of the Tasks Status (the agent makes both changes through the API, after the owner's yes), the view rename in step 3, and the Requirements layout in step 4 (after the owner's yes). The owner may have added columns and views of the owner's own, and they stay."

**WS-7. `work-setup.md:256` (Medium).**
- As is: "Do the same for the columns of the template's Tasks view, with file 22."
- Breaks: Words and names, "Make the subject of "this", "that", "it", and "they" clear."
- Trouble: "the same" follows a long list of rules; the reader cannot tell which of them apply.
- Rewrite: "Compare the columns of the template's Tasks view with file 22 in the same way: add what is missing, and change nothing that the owner set."

**WS-8. `work-setup.md:312` (Medium).**
- As is: "...so take only its `filter` object out of it, with `{{T_STATUS}}` the id of Status as read after step 3."
- Breaks: Sentences, "Whole sentences" (the clause has no verb).
- Trouble: The clause "with {{T_STATUS}} the id of Status" is not a sentence, so the reader must guess that it means "replace the placeholder".
- Rewrite: "...so take only its `filter` object out of it, and replace `{{T_STATUS}}` in the object with the id of the Status property, as read after step 3."

**WS-9. `work-setup.md:336` (Medium).**
- As is: "Rename the first view of Work Items to "All items" with the body of 12..."
- Breaks: Words and names, "Be specific."
- Trouble: "the body of 12" does not say 12 is a file in `assets/schema/`.
- Rewrite: "with the body of file 12". See NSET-2.

**WS-10. `work-setup.md:158` (Medium).**
- As is: "So the three memory pages move, and the work databases stay on the page that holds them."
- Breaks: Words and names, "Be specific."
- Trouble: The three pages are not named. Line 163 says only the Memory page and the "Current state" page move and the glossary page stays, so "three" disagrees.
- Rewrite: "So the memory pages move (the Memory page, the "Current state" page, and, in "Work items into Notion", the Terminology glossary page when there is one), and the work databases stay on the page that holds them."

**WS-11. `work-setup.md:350-361` (Medium).**
- As is: step 12, which starts "First, the owner may have pasted views in from another page..." and later says "Then read the template's blocks."
- Breaks: Sentences, "Write steps in the order the reader does them."
- Trouble: One step holds a clean-up of pasted views and the creation of four views, with "First" and "Then" in separate bullets and a command between them.
- Rewrite: make two sub-steps: "12a. Remove views the owner pasted from another page" (the first two bullets) and "12b. Make the four views" (the third bullet and the naming command).

**WS-12. `work-setup.md:226-266` (Medium).**
- As is: step 4 "The work item template", about 40 lines of bold labels and sub-bullets.
- Breaks: Extra rules for documents, "Give each section one subject."
- Trouble: The step holds the older-template case, the section comparison, four kinds of change, the Requirements migration, the owner's parts, and the rules for old work items.
- Rewrite: give the step a short opening sentence saying it has five parts, and number the parts: "4a. A project made from the older template pages", "4b. Compare the template with `work-item-page.md`", "4c. The Requirements layout from before toolkit 0.8.1", "4d. What stays the owner's", "4e. Work items made earlier".

**Low findings, `work-setup.md`: 5.** Examples:
- `:59` says "the top-level Notion page", while `setup.md:22` and `finishing.md:192` say "root page"; use one name.
- `:96` is the only step of "A new project" without a bold label.
- `:214` "Waiting on Mike" names the owner; it is a view name read by the layout, so mark it "exact string".

### `references/notion-build/work-layout.md`

**WL-1. `work-layout.md:18` (Medium).**
- As is: "The layout has no assignee, points, effort, dates, or time tracking (the owner's decision). A task's Who does it says agent or owner."
- Breaks: Extra rules for documents, "Organize the document so that a reader can find a thing from the headings alone."
- Trouble: Three facts about the whole layout sit under no heading, between the Contents list and the first section.
- Rewrite: put them under a heading "What the layout includes and leaves out", listed in the Contents.

**Low findings, `work-layout.md`: 5.** Examples:
- `:28` "The columns are by Phase column" reads oddly; write "The columns are grouped by the Phase column".
- `:56` one table cell holds four sections separated by "·"; give each section its own row or a list.
- `:62` the bullet on the public API and page properties is nested under "Table views" but is about the page layout.

### `references/notion-build/work-item-page.md`

No Medium finding. This file is Notion template text. The prompts are blank prompts and are not findings.

**Low findings, `work-item-page.md`: 4.**
- `:9`, `:41`, `:45` use "his" and "his words" for the owner (word list section 2: use "the owner"). Line 9 is the Next action prompt that `check-skills.mjs` compares, so it is an exact string. Lines 41 and 45 can change: "the owner's words in Answer" and "The owner's answer, in the owner's words".
- `:8`, `:13`, `:15`, `:41` say "this item" and "an item" for "this work item".
- `:26` "i.e." should be "for example" ("from the user, stakeholder, etc.").

### `references/notion-build/project-page.md`

Clear as it is. No findings.

### `references/notion-build/memory-page.md`

**Low findings: 1.** `:1` "Lore's layout" is used on a page read in Notion with no explanation of Lore. A sentence such as "Lore is the name of the Notion memory layout that the toolkit uses" would help a reader who opens the page alone (the word list says keep and explain once; this page is read alone).

## Patterns

**A. The same definition is repeated in many files (about 25 times).** The standard asks for an explanation once, and `wording-review.md` W2 says once for a whole skill, normally in `SKILL.md`; W9 says a reference file's reader also has `SKILL.md`. Counts: "the setup copy is the project's finished files, built in a temporary folder" 6 times (`interview.md:116`, `setup-copy.md:3`, `placing-files.md:3`, `skills-hooks-settings.md:3`, `finishing.md:80`, `salesforce.md:5`); "the project's one short page of what is true now" 6 times (`SKILL.md:48`, `interview.md:85`, `salesforce.md:19`, `notion.md:77`, `finishing.md:91`, `notion-build/setup.md:47`); "the main checkout is the project's main folder" 4 times (`SKILL.md:82`, `placing-files.md:98`, `finishing.md:178`, `interview.md:24`); "a setup folder is a folder in `assets/`" 4 times (`SKILL.md:31`, `setup-copy.md:5`, `skills-hooks-settings.md:20`, `salesforce.md:7`); "a worktree is a separate folder with its own branch" 3 times. Suggested fix: define each once in `SKILL.md`, "How setup works", and let the references rely on it. Trade-off: `AGENTS.md` says "Current State" must always say which one is meant, so keep that clause where the word is used.

**B. Tools and services used without saying what they are (about 70 lines).** `ntn` appears on 57 lines and no file in this area says it is Notion's command-line tool (examples: `SKILL.md:104`, `interview.md:63`, `notion.md:9`). "VPS" appears on 3 lines, never written out (`SKILL.md:177`, `interview.md:78`, `interview.md:91`). "Lore" appears on 12 lines and is explained only in `notion.md:49`, `setup.md:38`, and `interview.md:93`. `SKILL.md` uses "Hindsight", "bank", and "observations" (`:13`, `:46`, `:70`) and explains none of them.

**C. A pointer that depends on position or step number across files (about 12).** The reader must hold two files open. Examples: `notion-build/setup.md:26-28` "step 1 below at its step 5"; `placing-files.md:57` "the numbered table described below"; `setup-copy.md:155` "The last list holds every name of the other lists"; `placing-files.md:111` "what the text below the table says" (twice).

**D. A table cell that holds several sentences (about 8).** Examples: `interview.md:91` (eight sentences), `interview.md:133` and `:135` (the words the agent says to the owner), `skills-hooks-settings.md:58`, `work-layout.md:56`, `finishing.md:195-196`.

**E. A bullet that holds many blocks, or nesting three or four levels deep (about 6).** Examples: `finishing.md:41-54` (step 1), `work-setup.md:226-266` (step 4), `github.md:33-43`, `skills-hooks-settings.md:73-94`.

**F. One thing, several names (about 7 groups).**
- "earlier setup" means a setup that is not Toolkit V2 (`SKILL.md:80`) and a project that is already on Toolkit V2 (`interview.md:29`).
- "current folder layout", "current toolkit layout", "current template", and "current layout" (`work-setup.md:32`, `:48`, `:64`; `notion.md:93-94`).
- "root page" (`finishing.md:192`, `setup.md:22`) and "top-level Notion page" (`work-setup.md:59`).
- "user" (`SKILL.md:22`) and "owner".
- Lowercase "id" for a Notion page id, about 147 times in the Notion files, and "ID" for work item IDs, 40 times.
- "his" for the owner in `work-item-page.md:9`, `:41`, `:45`.
- "the Notion setup" (`interview.md:71`) and "the Notion setup files" (`notion.md:5`).

**G. A reference to a file number without the word "file" (3 places).** `notion-build/setup.md:95`, `:99`, `:100`, and `work-setup.md:336`.

**H. A table, bullet, or heading whose referent is missing (4 headings).** "Checks after either" (`github.md:74`), "6. Check" (`placing-files.md:129`), "Mistakes to avoid" with sub-sections that are rules and not mistakes (`SKILL.md:113-161`), and "Which setup job to do" holding the plan tool rule (`SKILL.md:97`).

## Layout

**`SKILL.md`.** Headings as they are: "Which setup job to do" (with cases) / "New project" / "Mistakes to avoid" / "References".
Proposed: keep "Which setup job to do" for choosing the job only; move the plan-tool bullets to the top of "New project"; rename "Mistakes to avoid" to "Rules for every setup job", with sub-headings "Questions to the owner", "When something fails", "Where setup runs", "What setup writes outside the project folder", "Commands in Codex", and "What setup never does".

**`references/interview.md`.** Headings as they are: "Look before asking" (one table and three lists) / "Question 1" ... "Question 5" / "The plan to confirm".
Proposed for "Look before asking": a short table of the commands, then "If there is no Git repository, or this folder is inside another repository", "If this session runs in a linked worktree", "If one of the four folders already holds a file". For "Question 3: where memory is kept": what memory holds; recommendation; table of the three choices; "If the owner picks Hindsight" (the three steps and the bullet list from INT-5).

**`references/setup-copy.md`.** Add a section "The Salesforce permissions rule" after "The owner-preferences rule" (COPY-3).

**`references/placing-files.md`.** Rename "6. Check" to "6. Check the result".

**`references/skills-hooks-settings.md`.** Headings as they are: "Merge rules" (one list).
Proposed sub-headings for "Merge rules": "Where to start", "The toolkit's own hook handlers", "Plain settings", "What is never deleted", "Entries added last", "`.codex/hooks.json`", "A key written another way".

**`references/finishing.md`.** Headings as they are: "Final checks" / "The checks" (24 items) / "After the checks" / "The final checks in "check the setup"".
Proposed: under "The checks", add "Checks for every project" (1 to 18 and 24) and "Checks for one choice" (19 to 23: Salesforce, Notion work items or memory, Notion memory, GitHub Issues, Hindsight). Split step 1 of "Fill the prompts" into "Ask for the outcome", "Where the outcome goes", and "When the owner has not answered".

**`references/github.md`.** Rename "Checks after either" to "Checks after a new project or an update" (GH-3).

**`references/notion-build/work-setup.md`.** Headings as they are: nine sections in the order of the Contents list.
Proposed: add a table under the opening that maps each of the five jobs to its sections (WS-1), and rename "Bringing a project up to the current template" to "Bringing a project up to the current Notion layout" if WS-2 is accepted. Consider splitting the file into three: "Setting up a new Notion project" (the new project, removing the part kept elsewhere, links, adding later), "Bringing a Notion project up to date" (the update, Stage to State, Done checkbox to Status), and "Building the Notion templates". The file is 379 lines, and the three groups are used at different times.

**`references/notion-build/work-layout.md`.** Add a heading "What the layout includes and leaves out" above line 18 (WL-1).

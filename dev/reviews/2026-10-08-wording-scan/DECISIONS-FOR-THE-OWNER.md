# Wording scan: the decisions that need the owner

This file lists the 13 decisions that the wording scan of 2026-10-08 (work item TKV-50) needs from Mike, the owner. Each decision can be read alone. Each gives the background, the options with what each gains and costs, and a recommendation. `SUMMARY.md` in this folder holds the findings behind them.

Two facts apply to every decision:

- **Nothing in a shipped file has been changed for these decisions.** No fix starts before the answer.
- **Decisions 2 to 5 come from a pass that no second agent has checked.** Whatever the answer, a second agent checks each place before it changes, and the live tests run again after each area.

## Decision 1. Two sentences in the writing rule that are not the owner's words yet

**Closed on 2026-10-09.** The Main Orchestrator session checked its transcript: Mike approved both sentences on 2026-10-08, as they read below, with the answer "Go with your recommendations for all". All five additions shipped in version 0.9.24.

**Background.** The writing rule, `document-clarity-standard.md`, is the owner's approved text. Three additions on the branch are the owner's approved words. Two more were written by the Main Orchestrator session after the owner said that the heading "How to ask the owner" does not give enough context.

The two sentences:

- In the heading rule: "The heading must say enough for a reader who sees only the heading to know what the section holds. For example, write "How the agent asks the owner for a decision", not "Asking"."
- Under "Paragraphs and sections": "Organize the document so that a reader can find a thing from the headings alone. Give each section one subject, and put everything about that subject in that section. Put the sections in the order the reader needs them."

**Options.**

- Yes to both. Every later fix is measured against them. The cost is longer headings, and so slightly longer files.
- Yes with other words. Give the words.
- No. The heading rule stays as it was, and "How to ask the owner" would pass it.

**Recommendation.** Yes to both.

## Decision 2. The 34 lists of situations

**Background.** The owner asked on 2026-10-08 for general rules, and not a sentence for each small case. The readers found 34 places where a list or table gives one case after another, and where one general rule would cover most of the cases. Examples: five times at which to check for changes made by hand; nine situations that need a manual deploy step; five kinds of thing to file at a handoff. The readers were sure of 2 of the 34.

**Options.**

- A. Put the general rule first, and turn the list into examples that start "for example". Keep as its own line any case that holds exact words, an exact value, or a different action. Nothing the agent is told today is lost, and the list no longer reads as the complete set.
- B. Remove the lists, and move the cases into the test sets. The files get shorter. The risk is that the agent stops doing a case that only the list told it to do.
- C. Leave the lists as they are.

**Recommendation.** A. It is the form the owner already accepted for trigger words: the list is insurance, and the rule is the rule.

## Decision 3. The 30 numbers where the agent could judge

**Background.** The owner asked on 2026-10-08 for no count or limit where the agent should use its judgment. The readers found 30 numbers that may stand in for a judgment. They passed every other number as a fact about a tool, the form of a record, or a protection.

**The rule I propose.** A number stays when it is one of these: a limit of Claude Code, Codex, Notion, GitHub, or Salesforce; the form of a record; a default that the owner can override; a stop for a loop or a wait; or a protection against something that is hard to undo. Any other number is replaced by the goal it stands for.

**With that rule, these would stay:**

- "Two rounds" before a disputed design finding goes to the owner, "never start a third verifier", and the waits of 5 seconds, 20 seconds, and two minutes. Each stops a loop.
- "30 days ahead unless the owner names one" for the date on an unchecked claim. It is a default.
- "Two or more sessions or work items" before a lesson is offered as a rule. It is what "came up again" means.
- "Over 10 MB" before a source is committed. It protects the repository.
- The 7 days after which the session-start hook says that the project's Current State is old, and the 14 days after which a captured official page is captured again.
- "One or two sentences" for each line of a work item's Current state, the two to four words of a folder name, and the 8 words and 30 words of the workstreams panel. Each is the form of a record that is shown in a small space.

**And these would become the goal, with the agent judging:**

- "Three to five plain-language sentences" for a design option's approach.
- "More than three findings" before findings are given as one numbered list.
- "The default is two options" for a design.
- "In one reply" in the definition of a small work item.
- "More than one scenario" as a reason to write a test plan.
- "More than six months old" before a fact about something that changes is checked again.
- "About 20 sections or 300 lines at most" for one memory file.
- "Two or three words" to try in a search.
- "A long session usually holds one to three" requests, in the session summary.
- "A request of one or two sentences" is not a braindump.
- In the skill `writing-harness-files`: "read two existing files", "one reviewer and one read", "three requests that should choose it and three that should not", and "three to five situations".

**Options.**

- A. Accept the rule and both lists.
- B. Accept the rule, and name the numbers to move from one list to the other.
- C. Keep every number.

**Recommendation.** A.

## Decision 4. The 22 places that name one of the owner's phrases

**Background.** The owner's example of what not to write is a sentence that maps a phrase to a meaning. The readers found 22 places that quote a phrase of the owner's. Examples: "An instruction to go on, such as "ship it", ... is the owner's yes"; "When the owner says "WI-31", the work item is `WI-031`"; "An update is also the job when the owner says only "toolkit v2""; and three rules in the Hindsight rule that start "When the owner says "remember this"".

The reminder hook passes: its phrases only add a hint, and the starter root `AGENTS.md` states the general goal. The exact words that the agent teaches the owner to say, such as "Say 'forget that' to undo", are not in the 22.

**Options.**

- A. Every such place states the general condition first and keeps the phrase only as an example. Where the same file already states the condition and the phrase adds nothing, the phrase sentence goes. The three Hindsight rules get their general condition.
- B. Remove every quoted phrase.
- C. Leave them.

**Recommendation.** A.

## Decision 5. The 31 lines that say how to weigh, or that tell the agent what it would do anyway

**Background.** These are the lines closest to "telling the agent how to think". Examples: "Read for what the owner means rather than the literal wording"; "When unsure, add the step"; "Do not invent gaps"; "Run each command alone"; "Never infer a definition from a similar word"; "Before you answer, check this project's skills". The readers were sure of 2 of the 31. Many of these lines were probably added after a live test failed without them, and for most the reader wrote "cannot tell".

**Options.**

- A. Leave all 31 until the live tests give a clean baseline. Then remove them one group at a time, and run the tests again after each group. A line stays when the agent gets worse without it. This costs test runs, and it is the only way to know.
- B. Remove them now. The files get shorter today, and nothing would show a loss.
- C. Keep all of them for good.

**Recommendation.** A.

**Three of these lines may be the owner's own preferences. Please say which to keep whatever the tests show:**

- "Read for what the owner means rather than the literal wording" (it is in the starter root `AGENTS.md` and in the setup skill, and it comes from the owner's sentence about voice-to-text).
- "When unsure, add the step. A step closed as "skipped" costs less than a missed action." (manual deploy steps in Salesforce).
- When a work item's folder and its `parent:` line disagree, the agent asks the owner and is told what to recommend: "Recommend yes" to moving the folder, and "Recommend moving it up".

## Decision 6. A change to the checklist that reviewers use

**Decided on 2026-10-09 by the Main Orchestrator session, as proposed below.** Its reason: the checklist is not shipped, and the change is easy to undo. Mike can still say that he disagrees. The new wording is in `dev/reviews/wording-review.md` since version 0.9.24.

**Background.** `dev/reviews/wording-review.md` is the checklist for every review of skill text. It is not shipped. Its check W5 says: "Where the agent should decide, the text says so and says what to weigh: "Use your judgment: weigh X against Y."" That asks writers to tell the agent how to weigh, which the owner asked on 2026-10-08 not to do. One checker already rejected two rewrites because they added a "weigh X against Y" sentence.

**The new words I propose for W5:** "Where the agent should decide, the text says so and states the goal that the decision serves. It does not tell the agent how to weigh. For example: "Use your judgment to decide whether the work has grown a lot since the owner answered." Text that leaves a decision open without saying so is a W4 finding."

**Options.** Yes; yes with other words; or no, and W5 stays.

**Recommendation.** Yes.

## Decision 7. A new order and fuller headings for the first file every agent reads in a project

**Background.** The starter root `AGENTS.md` is the guide that every agent reads first in a project. Its sentences are clear. Its layout is the problem: the long table of files and folders comes before the table that says where each kind of information goes, and a reader cannot find six things from the headings. Examples: what to report when the owner asks "where are we" is inside one cell of the "Which skill" table, and what to do on every message is under "Every session".

**What a change costs.** "Update the toolkit" compares the headings of this file, in order. When one heading is renamed, moved, or added, it rebuilds the file in every existing project, and the owner approves that in each project. The heading "Every session" is printed by a hook and compared by a test. The file is 23,477 bytes of an allowed 24,576, and the cohesion audit (TKV-43, phase P4) plans to shorten it.

**Options.**

- A. One layout change, made once, in the same version as phase P4 of the cohesion audit. The three headings that other files cite most keep their names: "Where information goes", "Ask the owner first", and "Which skill".
- B. Sentence fixes only. No project's guide is rebuilt, and the six things stay hard to find.

**Recommendation.** A, and the two sessions agree first on who writes it.

## Decision 8. The owner's own Salesforce texts

**Background.** The three skills `sf-component-tracker`, `sf-data-change`, and `sf-deploy-check`, and the rules `salesforce-org-safety.md` and `salesforce-agent-permissions.md`, are the owner's own text. A change needs the owner's yes. `sf-component-tracker` is the weakest file in the whole scan by the writing rule: it never says what the component tracker or the master manifest is, its headings "Step 1" to "Step 4" are not steps in order, and 13 list items are a label and a colon. The Salesforce session has two pieces of work open on these files (TKV-37 and TKV-44).

**8a. May these texts be rewritten to the writing rule?**

- Yes: a full rewrite of `sf-component-tracker` and small fixes in the others, shown to the owner as a before-and-after before anything merges, and started only after the Salesforce session's two pieces of work have merged.
- No: 30 findings are closed with no change.

Recommendation: yes.

**8b. Five places where the Salesforce files state two different rules.** My recommended answer is after each.

1. `sf-component-tracker` says in one place to add columns to match the project's orgs, and in another to ask the owner before adding a column. Recommended: ask first.
2. The skill gives a manual deploy step three phases: Pre-deploy, Deploy, and Post-deploy. Both templates have only Pre-deploy and Post-deploy. Which is right? I cannot recommend one: it is how the owner runs a deploy.
3. A rule says "Never write a record into a template", and the project's live master manifest is kept in the folder `full-project-deployment-template/`. Recommended: one sentence in the rule that names this folder as the exception.
4. The permissions runbook points three times to a research file that no project has. Recommended: remove the three pointers.
5. A rule tells the agent to "click Recalculate" in Salesforce Setup after a permission set deploy. An agent cannot click there. Recommended: the agent tells the owner to click.

**8c. Four lines of `salesforce-org-safety.md`.** These go to the Salesforce session, which has that file open: the words "any sandbox allow-list" name a list that the settings file does not have; "asks by default" for production, while every project is set to block; "subagent", where the other files say "helper agent"; and no opening sentence that says what the rule is for.

## Decision 9. May the Hindsight rule get longer?

**Background.** The rule `hindsight-memory.md` loads in every session of a Hindsight project. Every rule in it is right. It is 17 bullets under no heading, six lines are a label and a colon, and three rules start from a quoted phrase (decision 4). It is about 5,300 bytes, and the proposed size for a rule that always loads is 4,096 bytes. That size is proposed and not decided.

**Options.**

- A. Four headings and whole sentences. The rule gets about a fifth longer.
- B. Four headings, and sentence fixes only where they do not add length.
- C. Leave it.

**Recommendation.** A. The owner's goal for this work is text that a new reader can follow, and the size limit is only a proposal.

## Decision 10. Where a project word is explained

**Background.** The writing rule says to explain a made-up word when it first appears. A skill is several files, and an agent often opens one reference file alone. Today the setup skill explains five words, such as "main checkout", again in each file: 24 repeated sentences. Two readers asked for opposite things: explain once for the whole skill, or once in each file.

**Options.**

- A. One sentence in each file that uses the word, and the same sentence everywhere. Each file can be read alone. The cost is the repeated sentences.
- B. Once in the skill's main file. The files are shorter, and an agent or a helper agent that opens one reference file does not get the explanation.

**Recommendation.** A. A helper agent sees only the file it is given.

## Decision 11. Rules that disagree outside the Salesforce files

**Background.** The readers met these while they read. They are not wording problems: two files state different rules.

1. **Which skill writes a record's ID into a work item?** Settled on 2026-10-09, with no decision needed: phase P2 of the cohesion audit (TKV-43, version 0.9.24) gave this rule one place, `filing-project-records/SKILL.md`, section "Writing a record's ID in a work item", and brought the other files in step. The text as it was sent: `lifecycle-rules.md` of the work item skill says that `filing-project-records` writes it, and "Never write ... such an ID, with this skill". `closing.md` of the same skill and two files of `filing-project-records` say that `managing-work-items` writes it. Recommended: `managing-work-items` writes into the work item, and `filing-project-records` writes the record and reports its ID. That is what three of the four files say, and it matches the rule that one skill owns each job.
2. **What does the design critic get to read?** The critic's brief tells it to check the design's table of sources and what the design says exists today. The main agent sends it neither section. Recommended: send both sections.
3. **What happens to a lesson when a work item closes?** The work item template says that the owner chooses whether a lesson "moves up or is dropped". `closing.md` gives three choices: keep it for the whole project, keep it as not proven, or drop it. Recommended: the template gives the three choices.

**Options.** Yes to all three recommendations, or name the ones to change.

## Decision 12. Small choices

**Background.** Each of these is small. My recommendation is after each. The owner can say "yes to all" or name the exceptions.

1. **The workstreams panel says "Done today" above work finished in the last 24 hours**, so work from yesterday afternoon shows under "today". Recommended: "Done in the last day". A test changes with it.
2. **The instruction that every chat reads for the workstreams panel is one paragraph of about 150 words.** Recommended: three short paragraphs with the same rules. The plugin's code grows by a few lines, which needs the owner's yes.
3. **"What must stay true" is a heading in six folder guides.** It does not say what the section holds. Recommended: one fuller heading for all six, "Rules for every record in this folder", with the citing files changed in the same change.
4. **The project's roadmap file names two columns "Intended outcome" and "Exit condition".** A work item's phases, and the phases on GitHub and in Notion, call the same two things "Outcome" and "Exit result". Recommended: "Outcome" and "Exit result" everywhere. Only new projects get the new names.
5. **In every work item, the lines "Related items" and "Moved up" sit under the heading "Current state"**, and they are not part of its five lines. Recommended: leave them where they are, and correct the comment that says "the five lines under this heading". Moving them would make new work items differ from every existing one.
6. **Data change folders are dated `<MMDDYYYY>`, and release folders `<YYYY-MM-DD>`.** Recommended: `<YYYY-MM-DD>` for both, for folders made after the change.
7. **Three messages that the hook commands print could be clearer.** Each clearer message adds a line to a command that is at its approved number of lines. Recommended: leave the messages as they are.
8. **The block of fields at the top of a file is called "header" 26 times and "front matter" 21 times.** The word list already chose "front matter". Recommended: "front matter" everywhere, explained once in each file.
9. **Replies to the owner name the project's main folder three ways.** Recommended: "the project's main folder" in every line the owner reads.

## Decision 13. Which headings the fuller heading rule does not rename

**Background.** The heading rule now says that a heading must say enough for a reader who sees only the heading. The shipped files have 1,227 headings, and 389 of them are one or two words long. Read word for word, the rule fails most of the 389. They are mainly of three kinds:

- A section of a record template, such as "Overview", "Requirements", "Current state", and "Waiting on". Tools, hooks, and other files find these sections by name, and every existing work item and memory record has them.
- A section name that every skill uses the same way, such as "Contents" (in 47 files), "References", "Steps", and "Mistakes to avoid".
- A section of a helper agent's brief, such as "Your job", "Boundaries", and "Return".

**Options.**

- A. The rule is for the headings of instruction text. A heading keeps its name when it is part of the form of a record, or when it is one of the section names that every skill uses the same way. A heading of a helper agent's brief is tested like any other. The writing rule gets one sentence that says so: "A heading that is part of the form of a record, such as a section of a template, keeps the name that the record's form gives it."
- B. The rule applies to every heading. Every template, every existing record layout, and several hundred citations change.
- C. Decide heading by heading as each area is fixed. No sentence is added to the writing rule, and each area brings its own list of questions.

**Recommendation.** A. It keeps the headings that people and tools already know, and it puts the effort where a reader gets lost: the headings inside the instruction files.

## Two things handed to another session, with no decision here

- **The steps for a small work item are spread over five files, with 15 pointers between them.** Gathering them in one file is a change to how the work item skill is built. It belongs with the cohesion audit (TKV-43, phase P4), and the findings go to that session.
- **The design template asks for the build steps twice, and for the user's steps twice.** The same session gets this finding.

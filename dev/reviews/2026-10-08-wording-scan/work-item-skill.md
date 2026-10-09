# Wording scan: work-item-skill

The area is the skill `managing-work-items`, in `plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/managing-work-items/`. All 17 `.md` files were read in full (148,893 characters). Paths below are relative to that folder. Severity counts are approximate for Low findings.

The measure is `document-clarity-standard.md`. Each finding names the section of the standard and the first words of the line it breaks.

Two files are being changed on another branch. Findings in `references/lifecycle-rules.md` and `references/refining-requirements.md` carry "(P1 in flight)".

## Files read

| File | Verdict | High / Medium / Low | Biggest problem |
| --- | --- | --- | --- |
| `SKILL.md` | small fixes | 0 / 1 / 4 | A pointer to an "identification order" that is not named; the file lists in two tables repeat a third table |
| `references/lifecycle-rules.md` (P1 in flight) | small fixes, plus a layout change | 0 / 6 / 6 | Read on every turn (21,682 characters); holds a duplicate reference table and the whole small-item procedure |
| `references/refining-requirements.md` (P1 in flight) | small fixes, plus a layout change | 0 / 3 / 4 | Steps 6 and 7 each hold a whole procedure inside one numbered item |
| `references/designing.md` | needs a rewrite of steps 5, 10, 11 | 1 / 5 / 4 | Step 5 does not say what the reader settles |
| `references/building.md` | small fixes | 0 / 5 / 7 | The seven delivery cases mix states and events; vague tools in the team arrangement |
| `references/testing-loop.md` | small fixes | 0 / 3 / 3 | "Wherever this skill names the checker's verdict" leaves the reader to hunt |
| `references/closing.md` | needs a rewrite of the Moved up steps | 1 / 4 / 3 | Step 4 of "Filling the Moved up line" cannot be followed without guessing |
| `references/deploying.md` | small fixes | 0 / 2 / 3 | The standing merge instruction is a paragraph inside a bullet |
| `references/salesforce-deploying.md` | clear as it is, with one small fix | 0 / 1 / 3 | One bullet holds two cases |
| `references/acceptance-checker-brief.md` | clear as it is | 0 / 0 / 2 | None |
| `references/builder-brief.md` | clear as it is | 0 / 0 / 2 | None |
| `references/design-architect-brief.md` | small fixes | 0 / 1 / 1 | "explicit from start to finish" |
| `references/design-critic-brief.md` | small fixes | 0 / 2 / 1 | Checks sections that the list of inputs does not give the helper |
| `references/requirements-analyst-brief.md` | clear as it is | 0 / 0 / 2 | "the whole flow" is not defined for the helper |
| `references/researcher-brief.md` | clear as it is | 0 / 0 / 1 | None |
| `assets/work-item-template.md` | small fixes | 0 / 6 / 4 | Two fields sit under the heading "Current state"; very long guide comments |
| `assets/design-template.md` | small fixes | 0 / 2 / 3 | The design repeats the build order under two names |

Totals: 2 High, 41 Medium, about 53 Low.

## Findings

### `SKILL.md`

1. `SKILL.md:12` Medium. Text: "If the item is unclear, use the root `AGENTS.md` identification order and ask when more than one item remains plausible." Standard: "Words and names", "Use the exact name the system uses", and "Extra rules for documents", "When you point to another file, say what is in the file". The reader does not know what an "identification order" is or where in the root `AGENTS.md` to look, and "item" alone is the wrong name. Rewrite: "If it is unclear which work item the owner means, follow the order that the root `AGENTS.md` gives for finding a work item. When more than one work item is still possible, ask the owner which one."

2. `SKILL.md:18-41` and `references/lifecycle-rules.md:264-282` Medium. The two tables in `SKILL.md` list the same 15 files that the "References" table of `lifecycle-rules.md` lists again. Standard: "Paragraphs and sections", "Leave out a sentence that the reader does not need". The reader reads about 2,600 characters twice on every turn. Rewrite: delete the "References" table and its Contents entry from `lifecycle-rules.md`, change `references/lifecycle-rules.md:242` to say that `SKILL.md` lists the brief file of each helper, and change the last sentence of the first row of the first table in `SKILL.md:20` so it no longer promises a "full reference list". See "Patterns", number 1.

Low findings: 4. Examples: `SKILL.md:8` "keep the work record accurate" ("work record" is a second name for the work item); `SKILL.md:22` to `SKILL.md:28` and `SKILL.md:34` use "The item" and "an item" nine times (word list: "item (alone)" becomes "work item"); `SKILL.md:20` "the full reference list" describes a table that only repeats `SKILL.md`.

### `references/lifecycle-rules.md` (P1 in flight)

1. `references/lifecycle-rules.md:8-9` Medium (P1 in flight). Text: "`filing-project-records` writes those three places, and it also writes the ID of one of their records into a work item. Never write those three places, or such an ID, with this skill." Standard: "Sentences", "Make the subject of 'this', 'that', 'it', and 'they' clear". "Their records" and "such an ID" make the reader work out what the ID is. Rewrite: "The skill `filing-project-records` writes those three places. It also writes into a work item the ID of a decision, a rule, or a source. This skill does neither of these things."

2. `references/lifecycle-rules.md:177` Medium (P1 in flight). Text: "In place of the approval question of that step, and of the requirements analyst helper that the full path starts after such a change, play the change back in the form of step 2." Standard: "Sentences", "Put the condition before the action" and "Put one idea in a sentence". One sentence holds two things to skip and one thing to do, with the main action at the end. Rewrite: "Do not ask the approval question of that step, and do not start the requirements analyst helper that the full path starts after a change. Instead, play the change back to the owner in the form of step 2."

3. `references/lifecycle-rules.md:194` Medium (P1 in flight). Text: "The one exception is a State and a Status that no longer match the table in "Status and State"." Standard: "Sentences", "Name who acts". The sentence names an exception to the rule before it (keep the owner's change), but the exception is about a different case, so the reader cannot tell what it is an exception to. Rewrite: "When the work item's State and Status do not match the table in "Status and State", tell the owner in one line, ask which State the work item is in, with your recommendation, and then set both."

4. `references/lifecycle-rules.md:215-216` Medium (P1 in flight). Text: "Decide the line in this skill, in the form that the project's memory gives for a line under Now. Now is one of the parts of the project's Current State." Standard: "Words and names", "Make the subject of 'this' ... clear". The table at line 254 says that `managing-project-memory` writes the line, so "Decide the line in this skill" reads as a contradiction. Rewrite: "This skill decides what the line says. The skill `managing-project-memory` writes it, in the form that the project's memory gives for a line under Now. Now is one part of the project's Current State." (Question for the owner: confirm that this is the intended split.)

5. `references/lifecycle-rules.md:143-184` Medium (P1 in flight), layout. The section "A small work item" is 39 lines and 5,000 characters in a file that is read on every turn, though it applies to few work items. Standard: "Extra rules for documents", "Put each kind of content where its reader will look for it". See "Patterns", number 3, and "Layout".

6. `references/lifecycle-rules.md:264-282` Medium (P1 in flight). The "References" table repeats `SKILL.md`. See finding 2 of `SKILL.md`.

Low findings: 6. Examples: `references/lifecycle-rules.md:121` "Its Who does it is `owner`, `agent`, or the name of the other person who owes it, with the party" (rewrite: "In Who does it, write `owner`, `agent`, or the name of the other person who owes the task, followed by that person's party, such as `Sarah Chen (client)`"); `references/lifecycle-rules.md:232` "Delete, whole, an example row" (rewrite: "Delete an example row, an example task, or an example requirement block entirely when it is made only of prompts"); `references/lifecycle-rules.md:254-255` two table rows hold the same long second sentence.

### `references/refining-requirements.md` (P1 in flight)

1. `references/refining-requirements.md:37-59` Medium (P1 in flight), layout. Step 6 is a numbered item that holds "First", "Second", and "Third" actions, a seven-row table, and four sub-bullets, in 23 lines. Standard: "Extra rules for documents", "Give each section one subject". The reader loses the numbering of the steps. Rewrite: move step 6 into its own section, "Saving an answer", with three numbered steps, and leave step 6 as "Save each answer the moment the owner gives it, as "Saving an answer" below says." Update the citations of "step 6" in `designing.md:45`.

2. `references/refining-requirements.md:60-71` Medium (P1 in flight), layout. Step 7 holds twelve bullets nested three deep. Four other files cite "step 7" (`designing.md:35`, `testing-loop.md:34`, `closing.md:27`, `lifecycle-rules.md:177`). Rewrite: move it to a section "A change to an earlier answer or to an approved requirement", and change the four citations to name the section.

3. `references/refining-requirements.md:90` Medium (P1 in flight). Text: "bring the lines it copied from the parent up to the approved wording." Standard: "Words and names", "Name the thing directly". The phrase "bring up to" is a figure of speech and does not say what changes. Rewrite: "replace the lines it copied from the parent with the parent's approved wording."

Low findings: 4. Examples: `references/refining-requirements.md:30` forward reference to "Roadmap, tasks, and sub-items" for the meaning of "clearly large"; `references/refining-requirements.md:80` the check is named before its condition ("Do this check before you ask for approval, and after any change"); `references/refining-requirements.md:36` uses "Q-ID" before any file of the skill defines it.

### `references/designing.md`

1. `references/designing.md:23` High. Text: "Settle how the design work will go. Ask the owner at most one question about it, and only when the answer changes the design." Standard: "Extra rules for documents", "Give each instruction its own sentence. The sentence says who does what, and when" and "Words and names", "Be specific". The reader cannot tell what is being settled. The template (`assets/design-template.md:39`) shows that it is the number of options, but this step never says so. Rewrite: "Decide how many design options to write. Ask the owner one question about the number of options, and only when the answer changes the design. The default is two options that differ in approach, when the requirements leave a real choice, with built-in mechanisms first. A built-in mechanism is one that the platform or the tool already provides." (Question for the owner: confirm that the question is about the number of options.)

2. `references/designing.md:16` Medium. Text: "When the requirements are not approved yet, send a missing or changed requirement to `refining-requirements.md`. Continue with the design only when the owner asked for options first." Standard: "Sentences", "Put one idea in a sentence". One bullet holds four sentences and two cases. Rewrite as a lead sentence and two sub-bullets: "When the requirements are not approved yet, send a missing or changed requirement to `refining-requirements.md`. Then do one of these two things:" with "- When the owner asked for options first, continue with the design. Keep the work item in Refining Requirements and the design `proposed`, and say that the owner's approval of the requirements is still needed." and "- When the owner did not ask for options first, stop and tell the owner that the approval of the requirements comes first."

3. `references/designing.md:18` Medium. Text: "each requirement is explicit from start to finish". Standard: "Words and names", "Say a thing in plain words". The phrase is an idiom and does not say what to check. Rewrite: "each requirement says what happens at every step, from the first action to the final result". The same phrase is in `references/design-architect-brief.md:41`.

4. `references/designing.md:43` Medium. Text: "the Build order becomes Tasks under its existing Roadmap phases, or becomes its phases when it has none." Standard: "Words and names", "Use the exact name the system uses ... the same name every time". First, `lifecycle-rules.md:80` says a top-level work item always has at least one phase, so "when it has none" has no case. Second, the design template has a "Build order" inside each option (`assets/design-template.md:73`) and a "Technical sequence" in the selected design (`assets/design-template.md:144`), and this line does not say which list becomes the tasks. Rewrite (needs the owner's decision on the template): "Put the Build order of the selected option into the work item's plan. ..." Question for the owner: should the selected design keep a second list ("Technical sequence"), or should the Build order be the only list?

5. `references/designing.md:45` Medium. Text: "Apply the test in the root `AGENTS.md`, section "Where information goes", to the owner's choice, as `refining-requirements.md`, step 6, says." Standard: "Extra rules for documents", "When you point to another file, say what is in the file". The reader must open two files to learn one question. Rewrite: "Decide whether a different work item would need the owner's choice. The root `AGENTS.md`, section "Where information goes", gives the test. When a different work item would need it, give the choice to `filing-project-records`, as `refining-requirements.md`, step 6, says. When the choice went to Refining Requirements as a change, do this step after the owner approves the change."

Low findings: 4. Examples: `references/designing.md:13` "every field in the block at the top of the work item" (the word list says to write "front matter" and explain it once); `references/designing.md:63` "a small design does too" ("small design" is not defined, and "small" is already the name of a kind of work item); `references/designing.md:66` "Salesforce's skills return their findings to this design" (rewrite: "Salesforce's skills give their findings to this design").

### `references/building.md`

1. `references/building.md:40-57` Medium. Text: "Handle these seven cases in Building:" and the seven bullets. Standard: "Paragraphs and sections", "Give each section one subject" and "Extra rules for documents", "Decide whether each instruction is exact or general". The list mixes a state of the field (`delivery` is `not-offered`), a kind of work item (small), and events (the owner says yes, no, or takes the work back), and its last case repeats the "no" case. The reader cannot tell whether the cases are in order or can overlap. Rewrite of line 40: "The offer is the question "Would you like agents to take responsibility for delivering this, with you acting as product owner?", which asks whether helper agents build the work item. It is first made in Refining Requirements, as `refining-requirements.md`, step 4, says. In Building, find the first case below that fits, and do what it says:". Question for the owner: confirm that the cases are in order.

2. `references/building.md:57` Medium. Text: "Make no new offer, unless the owner asks about agent delivery or the work grows a lot." Standard: "Sentences", "Say what to do" and (W4/W5) a size word with no measure. Rewrite: "Make no new offer, unless the owner asks about agent delivery. Use your judgment when the work has grown: weigh the size of the remaining tasks against the cost of asking the owner again."

3. `references/building.md:63` Medium. Text: "When this session has tools to list, read, and message other sessions and to offer new sessions, ask exactly ..." Standard: "Words and names", "Be specific". A stranger cannot tell which tools are meant. Rewrite: "Check your tool list for four tools: one that lists sessions, one that reads a session, one that sends a message to a session, and one that offers a new session to the owner. Never assume they are there. When all four are there, ask exactly ..."

4. `references/building.md:92` Medium. Text: "every permission the session needs, and only permissions that the owner or the project already gave. A session will not let a message from another session remove a limit that its own starting prompt set;" Standard: "Sentences", "Put one idea in a sentence". The second sentence sits inside a list item and gives a reason without saying it is a reason. Rewrite: "every permission the session needs, and only permissions that the owner or the project already gave, because a session does not let a message from another session remove a limit that its own starting prompt set;"

5. `references/building.md:147` Medium. Text: "Name `<main checkout>` with `-C` in every command. Each command starts in the session's own folder, which may be another worktree." Standard: "Sentences", "Name who acts" and "Make the subject of ... clear". The reader cannot see why the last sentence matters. Rewrite: "Write `-C <main checkout>` in every Git command. A command starts in the session's own folder, and that folder may be another worktree. A worktree that you make inside that folder is deleted when that folder is removed, so make the worktree through the main checkout."

Low findings: 7. Examples: `building.md:49` "A yes widens nothing." (rewrite: "The yes allows nothing beyond what the owner already allowed: no merge, deployment, spending, publishing, or sign-in."); `building.md:122` "Start only as many builders as you can check and merge as they return." (add "Use your judgment:" because the number is left to the agent); `building.md:134` defines "main checkout" for the third time in the skill (see "Patterns", number 4).

### `references/testing-loop.md`

1. `references/testing-loop.md:64` Medium. Text: "Wherever this skill names the checker's verdict, the commit that the checker passed, or a new run of the checker, use your own check in its place". Standard: "Extra rules for documents", "Say ... when to open it" and (W4) a rule that applies "wherever". The reader must find those places. Rewrite: "Where `deploying.md` asks for the commit that the checker passed or for a new run of the checker (in "The pull request", in "What a merge into the default branch needs", and in "A project with no remote"), use the commit that you checked yourself. Record each new check in a new "Independent check: none, small item" row."

2. `references/testing-loop.md:82` Medium. Text: "The owner decided this rule on 2026-09-28. On 2026-10-07 the owner made one exception: a small work item that takes the short path". Standard: "Paragraphs and sections", "Do not write about ... the session that produced it". The dates do not help the reader act. Rewrite: "The owner decided that the checker runs before every result approval, whoever built the change. The one exception is a small work item that takes the short path, as "A small work item" above says."

3. `references/testing-loop.md:32-34` Medium. Step 5 gives three bold cases, and the second case is one sentence with a bracket of three examples and a separate second condition. Standard: "Sentences", "Put one idea in a sentence". Rewrite of the second case: "**The owner must decide.** This is the case when a failure needs the owner's decision, for example a requirement that reads two ways, or a fix that changes what the owner approved or that spends money. It is also the case when the same failure comes back after a second fix. Add a Questions and Answers row with your recommendation, set `waiting_on` to the owner, and ask."

Low findings: 3. Examples: `testing-loop.md:28` "breaks the flow" ("flow" is defined in the same sentence but also names a Salesforce tool; see "Patterns", number 7); `testing-loop.md:21` a long list of conditions in one sentence; `testing-loop.md:18` repeats the "no AI credit" statement (see "Patterns", number 9).

### `references/closing.md`

1. `references/closing.md:68-70` High. Text: "Do this step only when work items are local files: check that the main checkout holds each save. ... With each ID, `filing-project-records` reports whether the main checkout holds the save of that record." Standard: "Words and names", "Make the subject of 'this' ... clear" and "Be specific". The step uses "save" as a noun for a committed record, defines "main checkout" again, and gives its purpose last. The reader cannot tell what to check or why. Rewrite: "Do this step only when the project keeps its work items as local files. The command `.claude/hooks/validate-records.mjs` looks up each ID that steps 5 and 6 write into the work item, and it looks in the main checkout. So before you write an ID, check that the main checkout holds the record that the ID names. When `filing-project-records` has reported an ID, it also says whether the main checkout holds that record. When the main checkout does not hold the record, stop here and tell the owner what `filing-project-records` reported. The skill `filing-project-records` records in the project's Current State that the ID is still to be written in the work item. When the main checkout holds the record, continue." (Question for the owner: confirm that "save" means the committed record.)

2. `references/closing.md:45-48` Medium. The third list item of step 1 is four sentences and three sub-bullets. Standard: "Sentences", "Put one idea in a sentence". Rewrite: "Each rule that this work item may have built. A rule may have been built when a requirement of this work item built or changed its behavior, and the rule is either already on this list or is in `system/` with the mark Approved. The mark is the word on a rule in `system/` that says whether the rule is Draft, Approved, Built, or Retired." Keep the three sub-bullets.

3. `references/closing.md:50` Medium. This item has five sentences, and the middle two give the search and the Hindsight exception. Rewrite as a lead sentence and two sub-bullets: "Each lesson that has no outcome at the end of its line. Step 5 gives the four outcomes." with "- Before you list a lesson, search memory for the same lesson, with `managing-project-memory`." and "- When the lesson was seen before, in another work item or another session, list it with the dates it was seen." The Hindsight sentence goes once in `SKILL.md` ("Patterns", number 2).

4. `references/closing.md:99` Medium. The second bullet of step 5 is one sentence of 70 words with three removals and a Hindsight exception. Rewrite as a lead and three sub-bullets: "Ask `managing-project-memory` to remove the rest:" with "- each line under "Coming up" or "Waiting on" that is about this work item;" and "- a "Next session starts with" line that names it." Then: "The reference file on the project's Current State in that skill, section "Removing what is no longer true", gives the steps."

5. `references/closing.md:102` Medium. Text: "End the report with what the section "Leftover branches and worktrees" below asks the owner." Standard: "Sentences", "Name who acts". The reader does not know that a question is meant. Rewrite: "End the report with the question that "Leftover branches and worktrees" below tells you to ask the owner. When that section gives no question, end with "Tell me the next thing to build.""

Low findings: 3. Examples: `closing.md:91` the example Next action says "After his answer" (exact string; the word list says "the owner's"; see "Patterns", number 6); `closing.md:87` a forward reference to step 3 of a later section; `closing.md:119` one list item of 80 words.

### `references/deploying.md`

1. `references/deploying.md:35-42` Medium, layout. Text: "**The owner's standing merge instruction** in `.claude/rules/owner-preferences.md`. It counts only when all three of these are true:" followed by a numbered list and two unnumbered paragraphs that sit inside the bullet. Standard: "Extra rules for documents", "Give each section one subject". The paragraphs "When all three are true, merge ..." and "When the head moved ..." are separate rules but look like part of the list. Rewrite: give them a heading, "Merging under the standing merge instruction", at the same level as "What a merge into the default branch needs".

2. `references/deploying.md:23-24` Medium. Text: "It goes under the work item's Related items, unless that skill names another place." Standard: "Sentences", "Make the subject of 'this', 'that', 'it', and 'they' clear". `references/work-tracker.md` is a reference, not a skill, so "that skill" has no subject. Rewrite: "It goes under the work item's Related items, unless `references/work-tracker.md` names another place."

Low findings: 3. Examples: `deploying.md:55` defines "main checkout" for the third time; `deploying.md:67` "Deploy only when the result must go beyond the default branch" (rewrite: "Deploy only when the result must reach an environment other than the default branch"); `deploying.md:72` and `deploying.md:82` repeat the Hindsight sentence.

### `references/salesforce-deploying.md`

1. `references/salesforce-deploying.md:23` Medium. The bullet holds two cases (Allowed and Ask first) in one sentence of 80 words. Standard: "Extra rules for documents", "When one point needs several rules, give the main rule first. Then give each special case on its own line." Rewrite: "- `.claude/rules/salesforce-agent-permissions.md` says whether you ask first." with "  - When it says Allowed, run the command without a question, and add the Recent History row "Deployed to `<sandbox alias>`: allowed by salesforce-agent-permissions.md."" and "  - When it says Ask first, ask "Deploy WI-031 to `<sandbox alias>`?" as a Questions and Answers row, and run the command after the owner's yes."

Low findings: 3. Examples: `salesforce-deploying.md:13` "UAT" is not written in full; `salesforce-deploying.md:14` "needs a clean `permsets.py preflight`" ("clean" has no measure; rewrite: "needs a `permsets.py preflight` that reports no problems"); `salesforce-deploying.md:12` "it keeps both current" (rewrite: "`sf-component-tracker` keeps the folder and the tracker current").

### The six helper briefs

`references/acceptance-checker-brief.md`: clear as it is. Low findings: 2. Examples: `acceptance-checker-brief.md:40` a paragraph of four sentences (split after the second); `acceptance-checker-brief.md:38` the first sentence ("First check that you are looking at the exact commit that was named") would read better as "Check first that the commit in the folder is the commit that was named".

`references/builder-brief.md`: clear as it is. Low findings: 2. Examples: `builder-brief.md:33` "stop on that point and report it" (rewrite: "stop work on that point and put it in your report"); `builder-brief.md:9` the sentence about `codex exec` has no reason (add: "because without approvals a Git write cannot run").

`references/design-architect-brief.md`:

1. `references/design-architect-brief.md:41` Medium. Text: "each place that is not explicit from start to finish". Standard: "Words and names", "Say a thing in plain words". Same phrase as `designing.md:18`. Rewrite: "each place where the requirements do not say what happens at every step, from the first action to the final result".

Low findings: 1. Example: `design-architect-brief.md:35` "a junior developer could build from" is a figure of speech (rewrite: "a developer who does not know the system could build from").

`references/design-critic-brief.md`:

1. `references/design-critic-brief.md:48-52` Medium. Text: "Does every claim that the design depends on have a row in "Sources and decisions that affect the build" ...? ... Does "Where a builder could misread this design" carry every known risk?" Standard: "Extra rules for documents", "Open the document with what it is for" and the helper rule that a helper sees only its brief. The list of inputs (`design-critic-brief.md:16-27`) gives the critic the draft option and three design sections, but not "Sources and decisions that affect the build", "Where a builder could misread this design", or "What exists today". The critic cannot check what it does not receive. Question for the owner: either add those sections to the list of inputs, or take the checks out of the brief.

2. `references/design-critic-brief.md:47` and `design-critic-brief.md:50` Medium. Text: "Follow the flow step by step, from start to finish" and "Does any community claim shape the design without a recorded check?" Standard: "Words and names", "A made-up word ... explain the made-up word when it first appears". The helper sees only this brief, and neither "the flow" nor "community claim" is defined in it (the second is defined only in `researcher-brief.md:37`). Rewrite: "Follow the steps that the person who uses the result goes through, from the first action to the last, and report every step that the design does not support." and "Does any community claim (something that someone said online and that nobody has checked) shape the design without a recorded check?"

Low findings: 1. Example: `design-critic-brief.md:35` "You advise, the architect fixes, and the owner decides" is clear; the following two sentences repeat who wrote the draft and could be one.

`references/requirements-analyst-brief.md`: clear as it is. Low findings: 2. Examples: `requirements-analyst-brief.md:41` "Follow the whole flow step by step, from start to finish" (same fix as the critic); `requirements-analyst-brief.md:10` "a spec check" ("spec" is an abbreviation; the clause after it already explains the word, so write "a check of the requirements" without "spec check").

`references/researcher-brief.md`: clear as it is. Low findings: 1. Example: `researcher-brief.md:10` "Honor any limit that the owner set on helpers." (rewrite: "Follow any limit that the owner set on helpers.").

### `assets/work-item-template.md`

1. `assets/work-item-template.md:27-43` Medium, layout (exact string: the headings may be read by `validate-records.mjs`; check before changing). The heading "### Current state" is followed by the five lines it describes, and then by "Related items" and "Moved up", which are not part of Current state. The comment on line 29 says "the five lines under this heading", but seven lines follow. Standard: "Extra rules for documents", "Give each section one subject". Rewrite: end "Current state" after "Last updated", and put "Related items" and "Moved up" under the "## Overview" heading without a third-level heading, or under a new heading "### Links and closing summary".

2. `assets/work-item-template.md:19` Medium. The guide comment is one line of nine sentences. Standard: "Sentences", "Put one idea in a sentence". Rewrite as a list in the comment: "Fill-in guide, delete it when you create the work item. - Create the work item with `managing-work-items`, which sets the real ID in the front matter and the heading. - In the front matter, keep one value from each list. The status follows from the state. - A new work item starts with `waiting_on: "none"`, `priority: medium`, `delivery: not-offered`, both approvals `no`, and `design: none`. - A sub-item's `parent` names the work item above it. - Text in angle brackets says what to write in that field, cell, or paragraph. Replace it with real content, or delete it when there is nothing to write yet, so that no angle-bracket prompt is left. - Keep the headings and the field labels. Delete each example phase, task, question, and requirement that the work item does not have yet."

3. `assets/work-item-template.md:41` Medium. The "Related items" prompt holds four separate contents in one cell. Rewrite: "<A top-level work item: "Project phase P01." or "No project phase yet." A sub-item: its parent's ID and, when it has no design of its own, "Built from the design of" and the parent's ID. Then the IDs of related work items (never folder paths), external links, and the ID of each decision in `DECISIONS.md` and each rule in `system/` that this work item must follow, for example "DEC-014, SEC-04".>"

4. `assets/work-item-template.md:128` Medium. The guide comment is one line of ten sentences and uses "his" four times. Standard: "Sentences", "Put one idea in a sentence", and the word list ("the owner", not "he", "his"). Rewrite as a list of rules, one per line, with "the owner's words" in place of "his words". Keep every rule.

5. `assets/work-item-template.md:145` Medium. Text: "One line per original this item used. The original is filed in `sources/` first; this line holds its SRC-### ID, never the original or a copy of its text." Standard: "Words and names", "Say a thing in plain words before you give it a name"; the word list sets "original" to "source". Rewrite: "One line per source this work item used. The source is filed in `sources/` first. This line holds the source's SRC-### ID, never the source or a copy of its text."

6. `assets/work-item-template.md:33` Medium (exact string). The Next action prompt says "After his answer". The word list says "the owner". `check-skills.mjs` compares this prompt with the Notion template (`references/notion-build/work-item-page.md`), so change both together. Rewrite: "After the owner's answer: <step>."

Low findings: 4. Examples: `work-item-template.md:111` "i.e. from the user, stakeholder, etc." ("i.e." should be "for example", and "the user" is "the owner"); `work-item-template.md:107` "the owner's words in this chat" (the word list says "session"); the word "item" alone appears 21 times in the template.

### `assets/design-template.md`

1. `assets/design-template.md:39` Medium. Text: "Include the number of options chosen for this design (the owner's number when he gave one)." Standard: "Sentences", "Say what to do". "Include the number" can mean "write the number" or "write that many options". Rewrite: "Write as many options as were chosen for this design: the number the owner gave, when the owner gave one."

2. `assets/design-template.md:73` and `assets/design-template.md:144` Medium. "Build order" (inside each option) and "Technical sequence" (in "Build and verification plan") both list build steps, and `end-to-end behavior` (line 47) and "End-to-end flow" (line 100) both list the steps of the result. Standard: "Words and names", "use the same name every time". The reader does not know which list `designing.md` step 10 means. See finding 4 of `designing.md`. Question for the owner: should the selected design repeat these lists?

Low findings: 3. Examples: `design-template.md:45` "Three to five plain-language sentences" is a count where `AGENTS.md` asks for judgment (a question for the owner); `design-template.md:98` one sentence of 55 words; `design-template.md:39` uses "he" for the owner.

## Patterns

1. **The list of files is given three times.** The same 15 files are listed in `SKILL.md:18-28`, `SKILL.md:30-41`, and `references/lifecycle-rules.md:264-282`, in about 5,000 characters. Delete the table in `lifecycle-rules.md`. The change for `lifecycle-rules.md:242` is "The reference file of each helper is listed in `SKILL.md`."

2. **One sentence about Hindsight is repeated eight times.** "In a project with Hindsight memory, follow `.claude/rules/hindsight-memory.md` in place of `managing-project-memory`" is in `lifecycle-rules.md:254`, `lifecycle-rules.md:255`, `deploying.md:72`, `deploying.md:82`, `testing-loop.md:84`, `closing.md:50`, `closing.md:67`, and `closing.md:99`. `SKILL.md:14` already says it for the whole skill. Say once in `SKILL.md`: "Wherever a file of this skill sends work to `managing-project-memory`, a Hindsight project follows `.claude/rules/hindsight-memory.md` instead", and delete the eight copies (about 1,600 characters).

3. **The procedure for a small work item is in five files.** `lifecycle-rules.md:146-184`, `refining-requirements.md:23`, `building.md:47`, `testing-loop.md:48-67`, and `closing.md:104-120` each hold part of it, and each part points to the others. The reader of a small work item opens four files and follows nine cross-references. A single file, `small-work-item.md`, with the six steps of the short path and the two differences in testing and closing, would replace about 7,000 characters of pointers. This change is for the owner to approve, since it adds a file.

4. **Definitions are repeated, with small differences.** "Main checkout" is defined in `building.md:134`, `deploying.md:55`, and `closing.md:68`. "Worktree" is defined in `building.md:26` and `closing.md:146`. "Checker" is defined in `lifecycle-rules.md:41`, `testing-loop.md:5`, and `deploying.md:12`. "Head commit" is defined in `testing-loop.md:15` and `deploying.md:12`. Define each once in `lifecycle-rules.md` (which is read on every turn), under a heading "Words used in this skill", and point to it.

5. **"Item" alone is used for "work item".** About 35 uses: nine in `SKILL.md`, 21 in `assets/work-item-template.md`, and the rest in `lifecycle-rules.md`, `testing-loop.md`, `building.md`, and `design-template.md`. The word list sets "work item". Keep the exact strings that use "item" ("Small item: short path.", "Independent check: none, small item", "Small item, so no delivery offer.", "Short path ended: full path from <State>.") because other files and tests read them.

6. **The owner is called "he" or "his".** `work-item-template.md:33` and `work-item-template.md:128` (four times), `work-item-template.md:133`, `work-item-template.md:60`, `design-template.md:39`, and `closing.md:91`. The word list says "the owner". Two of these are exact strings (`work-item-template.md:33`, `closing.md:91`), so change them with the Notion template.

7. **"The flow" and "from start to finish" are used without a definition.** `testing-loop.md:28`, `testing-loop.md:29`, `testing-loop.md:32`, `design-critic-brief.md:47`, `requirements-analyst-brief.md:41`, `design-architect-brief.md:41`, and `designing.md:18`. Only `testing-loop.md:28` defines it. A helper sees only its brief, so it cannot know what "the flow" is. "Flow" also names a Salesforce tool, which `designing.md:15` mentions.

8. **Whole procedures sit in one numbered item.** `refining-requirements.md` step 6 (23 lines) and step 7 (12 lines), `designing.md` step 10 (12 lines), `closing.md` step 1 (10 lines), `building.md:40-57` (18 lines), and `deploying.md:35-42`. Each hides sub-steps from the numbering that other files cite ("step 7", "step 6"). Move each into a section with its own heading and update the citations.

9. **The rule "no AI credit" is stated three times.** `building.md:154-156`, `deploying.md:21`, and `testing-loop.md:18`. The global rule `no-ai-attribution.md` already covers it, and the skill's text matters most in `building.md`. Keep `building.md:154-156`, and in the other two write "with no AI credit, as `building.md` says".

10. **Very long single-line guide comments in the templates.** `work-item-template.md:19`, `29`, `60`, `99`, `107`, `128`, `145`, and `151`, and `design-template.md:7` and `13`, hold six to ten sentences each. Rewrite each as a short list.

11. **The helper briefs repeat the same "Boundaries" text.** All six briefs say "do not start other helpers, and do not ask the owner anything". This repeat is correct, because a helper sees only its own brief. Do not remove it.

## Layout

### `references/lifecycle-rules.md` (P1 in flight)

As it is: Contents, Status and State (with Backlog, Designing or Building after the requirements, A work item that has sub-items, Blocked, Done and Cancelled), Levels (with Phases, Tasks, Project tasks), When to stop for the owner's yes, A small work item, Rules that apply in every State, Starting a helper, Work that another skill does, References.

Proposed: Status and State, Levels, When to stop for the owner's yes, Rules that apply in every State, Starting a helper, Work that another skill does. Move "A small work item" to `small-work-item.md` (the owner's yes needed), and delete "References". Add "Words used in this skill" (main checkout, worktree, checker, head commit). The list of the 15 files stays only in `SKILL.md`.

### `references/refining-requirements.md` (P1 in flight)

As it is: Steps (11 steps), The question format, Sources, Roadmap, tasks, and sub-items, Mistakes to avoid.

Proposed: Steps (11 steps, with step 6 and step 7 shortened to one sentence each), Saving an answer, A change to an earlier answer or to an approved requirement, The question format, Sources, Roadmap, tasks, and sub-items, Mistakes to avoid.

### `references/designing.md`

As it is: Steps (12 steps), A change to an approved design, Mistakes to avoid.

Proposed: Steps, Approving the design (the third case of step 10 and the steps after it), A change to an approved design, Mistakes to avoid.

### `references/building.md`

As it is: Build, task by task; Who builds; The team arrangement (with One team inside this session, Main Orchestrator with other sessions, The model for these sessions); Plan the team; Git for a build; Git writes in Codex; Start a builder; When a helper returns; When the plan changes; Resume in a new session; While the owner decides something.

Proposed: Build, task by task; Who builds; The team arrangement; Plan the team; Start a builder; When a helper returns; When the plan changes; Resume in a new session; Git for a build; Git writes in Codex. Move the two Git sections to the end, because they are reference material that the other sections point to. Join "While the owner decides something" (one sentence) to "When the plan changes". Join "One team inside this session" (one sentence) to the introduction of "The team arrangement".

### `references/deploying.md`

As it is: The pull request; The merge (with What a merge into the default branch needs, A project with no remote, After a merge); A deployment.

Proposed: The pull request; The merge; What a merge into the default branch needs; Merging under the standing merge instruction; A project with no remote; After a merge; A deployment.

### `assets/work-item-template.md`

As it is: Overview (with Current state, then Related items and Moved up inside it), Roadmap, Tasks, Recent History, Requirements, Questions and Answers, Notes.

Proposed: Overview (Goal, Current state, Links and closing summary), Roadmap, Tasks, Recent History, Requirements, Questions and Answers, Notes. The change needs the owner's check, because `validate-records.mjs` may read these headings.

### `assets/design-template.md`

As it is: the build order and the end-to-end steps appear in each option and again in "Selected design" and "Build and verification plan".

Proposed: decided by the owner (see finding 2 of `design-template.md`).

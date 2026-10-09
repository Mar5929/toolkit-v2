# Instructions that script the agent: salesforce-and-plugin-files

Second pass over the same files as the first scan, with one question: where does the text do more than state the owner's process? Read on 2026-10-08 from the `wording-scan` worktree. I re-opened each quoted line before writing it.

Path shortcuts: `SF/` is `plugins/toolkit/skills/project-setup/assets/salesforce/`, `WHF/` is `plugins/toolkit/skills/writing-harness-files/`, and `REG` is `plugins/workstreams/hooks/register.tsx`.

I left alone `salesforce-org-safety.md` (the owner's), the skill descriptions, the copy `WHF/references/writing-rule.md`, the plugin and marketplace descriptions, and the templates. The templates only hold the form of a record. `sf-architect-solutioning` is not in this worktree.

## Summary

This area is mostly process. The Salesforce rules and skills state steps, limits, and the form of records, and most numbers are facts about Salesforce or a host. Twenty-two instructions are findings, and eighteen of them are borderline.

| Kind | Meaning | Findings | Borderline |
| --- | --- | --- | --- |
| 1 | Tells the agent how to think or weigh | 5 | 5 |
| 2 | A sentence or list for one small situation | 5 | 5 |
| 3 | A count or limit that stands in for judgment | 7 | 3 |
| 4 | A phrase list that reads as the only start | 2 | 2 |
| 5 | Tells the agent what a capable agent already does | 3 | 3 |
| Total | | 22 | 18 |

The four findings that are not borderline are all kind 3, in the `writing-harness-files` skill: F12, F13, F14, and F16.

Files with the most findings:

1. `WHF/references/rewrite-steps.md`: 3 (F16, F17, F18).
2. A tie at 2 each: `SF/.claude/skills/sf-component-tracker/SKILL.md`, `SF/.claude/skills/sf-data-change/SKILL.md`, `SF/.claude/skills/sf-deploy-check/SKILL.md`, `WHF/references/checklist.md`, `WHF/SKILL.md`, and `REG`.

## Findings

### `SF/.claude/skills/sf-component-tracker/SKILL.md`

**F1. Kind 1, borderline.** `SF/.claude/rules/record-deployment-steps.md:11` and `SF/.claude/skills/sf-component-tracker/SKILL.md:101`. "When unsure, add the step. A step closed as "skipped" costs less than a missed action."
- Why it scripts: it tells the agent how to decide when it is not sure, and does not state a step of the process.
- What it protects: a manual deploy step that is missed and surfaces during a deploy. This is the owner's default, and the skill gives the reason.
- Proposal: keep. The rule file repeats the first sentence without the reason. Keep the reason in one place and let the rule point to it, or leave the rule as it is.

**F2. Kind 2, borderline.** `SF/.claude/skills/sf-component-tracker/SKILL.md:82-99`. "Add a step in the same response in which you author the triggering metadata. Triggers:" followed by nine situations, and "Skip the step when the deploy is self-contained:" followed by four.
- Why it scripts: thirteen bullets cover situations that the general rule in `SF/.claude/rules/record-deployment-steps.md:9` already covers ("When metadata needs an action the deploy cannot perform, add a step").
- What it protects: probably missed post-deploy actions seen in real deploys. Cannot tell for certain.
- Proposal: replace with the general rule and examples: "Add a step to `manual-steps.md` whenever the deploy cannot perform an action the metadata needs, in the same response in which you author the metadata. For example: assigning a new permission set to users, configuring a connector mapping for a new external field, or scheduling a new scheduled flow. Skip the step when the deploy is self-contained, such as a label change." Move the full lists to the test set, `dev/evals/`, as `AGENTS.md` says situations belong there. The wording is the owner's text (warnings only), so ask first.

**F3. Kind 1, borderline.** `SF/.claude/skills/sf-component-tracker/SKILL.md:92`. "Any other deploy, by your judgment: a pre-deploy snapshot step for rollback. Weigh whether a rollback would need old values that Git does not hold, such as org data or org settings."
- Why it scripts: it tells the agent what to weigh. The project's wording review (W5) asks for exactly this, so the two rules pull in opposite directions.
- What it protects: a rollback that cannot be done because the old values were never captured.
- Proposal: state the goal in place of the weighing: "A rollback must be possible. Add a pre-deploy snapshot step when a rollback would need old values that Git does not hold, such as org data or org settings."

### `SF/.claude/skills/sf-data-change/SKILL.md`

**F4. Kind 5, borderline.** `SF/.claude/skills/sf-data-change/SKILL.md:31-33`. "Use the real file path and the real values." and "Write for someone who has not run this load before."
- Why it scripts: a capable agent does both without being told, and neither carries a fact about this project's process.
- What it protects: handoffs with placeholders, or steps that skip detail. Line 8 already states the goal, that the owner can run the change "without asking follow-up questions".
- Proposal: remove both; line 8 and step 1 (items 3 and 4) already say what the handoff holds.

**F5. Kind 1, borderline.** `SF/.claude/skills/sf-data-change/SKILL.md:32, 61`. ""Map the fields appropriately" is not a step. Name each mapping." and ""You'll need to update those records" is not a handoff."
- Why it scripts: each quotes an example phrase and tells the agent how to judge it, which is the pattern the owner rejected.
- What it protects: a vague handoff that the owner cannot run. Cannot tell whether a live test produced them.
- Proposal: keep "Name each mapping." (it states what the handoff holds, and item 3 of step 1 says it already) and remove the two quoted examples.

### `SF/.claude/skills/sf-deploy-check/SKILL.md`

**F6. Kind 2, borderline.** `SF/.claude/skills/sf-deploy-check/SKILL.md:21`. "An `-x` deploy of a full-cutover manifest is the highest risk. Check the whole member list."
- Why it scripts: it is one sentence for one situation, and the step already says to list every member of the deploy set.
- What it protects: a full-cutover manifest that ships a large set of unrelated components. Probably from a real deploy.
- Proposal: remove the sentence, or keep it as an example: "For example, a full-cutover manifest names every component in the project."

**F7. Kind 2, borderline.** `SF/.claude/skills/sf-deploy-check/SKILL.md:23-27`. "For each component, decide whether its feature is already live in the target. Check for these signs of a change outside the intended scope or a feature that is not ready:" followed by four signs.
- Why it scripts: the list can be read as the complete set of checks. The general condition is stated in the first sentence of step 3.
- What it protects: unwanted changes riding along in a deploy.
- Proposal: keep the list, and mark the signs as examples: "Signs include, for example:".

### `SF/.claude/rules/dependency-graph.md`

**F8. Kind 4, borderline.** `SF/.claude/rules/dependency-graph.md:13`. "Answer "what writes, reads, or breaks if this changes" from the edge list, never from memory."
- Why it scripts: a quoted phrase starts the process, and the text does not say that the phrase is an example of any question about what a component affects.
- What it protects: answers about field impact that come from memory and miss writers. The heading "Impact questions" and the `paths` front matter give part of the general condition.
- Proposal: "Answer any question about what a component affects, such as what writes it, reads it, or breaks if it changes, from the edge list and not from memory."

### `SF/.claude/rules/salesforce-agent-permissions.md`

**F21. Kind 4, borderline.** `SF/.claude/rules/salesforce-agent-permissions.md:39-45`. "Before you start a change to one of these, confirm intent and scope with the owner." followed by five categories (object model, security and access, integrations, data-source priority, anything that contradicts the requirements).
- Why it scripts: the five categories read as the whole set of changes that need the owner. The text has no sentence that says why these five are special.
- What it protects: the owner's decisions on design and access. This list came from the earlier rule `confirm-salesforce-changes.md`, so it is the owner's own list.
- Proposal: keep the list. Add the general condition in one sentence: "These are the changes that alter the project's design or who can reach its data. For any other change that you think the owner would want to decide, confirm it the same way."

### `SF/.claude/rules/salesforce-project.md`

**F22. Kind 5, borderline.** `SF/.claude/rules/salesforce-project.md:3`. "Salesforce's official skills (`forcedotcom/sf-skills`) are installed for this project. Use them for Salesforce platform questions and Salesforce work."
- Why it scripts: the second sentence tells the agent to use a skill for the task the skill is for.
- What it protects: nothing the next line does not already say. Line 4 states the project's own process, that this project's rules win over an official skill.
- Proposal: remove the second sentence.

### `SF/tools/permissions/PERMISSIONS-RUNBOOK.md`

**F9. Kind 5, borderline.** `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:89`. "Read your own diff. Every removed line is a revocation you are asking for."
- Why it scripts: it tells the agent to read what it wrote and how to interpret a diff.
- What it protects: a grant removed by accident. The second sentence is a fact about permission sets and is worth keeping.
- Proposal: "Before you commit, review the diff. Every removed line is a revocation."

**F10. Kind 1, borderline.** `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:180-182`. "Prefer many small permission sets, one per feature or persona, composed with permission set groups, over a few large ones."
- Why it scripts: "Prefer" asks the agent to weigh a design choice, and "many" and "few" have no measure.
- What it protects: a bad deploy that removes many grants at once, and merge conflicts. The text gives both reasons.
- Proposal: keep, and write it as the project's convention: "This project splits permission sets by feature or persona and combines them with permission set groups."

### `SF/tools/kb/README.md`

**F11. Kind 1, borderline.** `SF/tools/kb/README.md:122, 155, 170-172`. "**Read this before saying "nothing writes this field."**", "Check the resolution rate before reading anything into a gap.", and "`unresolved_unknown` ... is the one value worth investigating when it grows."
- Why it scripts: each tells the agent how to interpret a result.
- What it protects: false claims of absence. The rule `dependency-graph.md` already states the process, which is never to claim absence from the edge list alone. This README is tool documentation for people, and the three lines state facts about the tool's blind spots.
- Proposal: keep. The README is not the process; the rule is.

### `WHF/SKILL.md`

**F12. Kind 3.** `WHF/SKILL.md:26`. "Then read two existing files of the same kind in the project, and match their form."
- Why it scripts: "two" stands in for the judgment of how many files show the project's form.
- What it protects: a new file that follows the project's form. `AGENTS.md` asks that such counts be questioned.
- Proposal: "Then read existing files of the same kind in the project, enough to learn their form, and match it."

**F13. Kind 3.** `WHF/SKILL.md:32`. "Fix each confirmed finding and have the reviewer read the fix. A small edit gets one reviewer and one read."
- Why it scripts: "small", "one reviewer", and "one read" stand in for judgment about how much review a change needs. The owner already named this case for small work items.
- What it protects: review cost on trivial edits.
- Proposal: remove the last sentence. The step already says what the review is for. If a limit is needed, state the goal: "The review ends when the reviewer has read the fixed version and has no open finding."

### `WHF/references/checklist.md`

**F14. Kind 3.** `WHF/references/checklist.md:36`. "...test in each product that reads the skill that it is chosen for three requests that should choose it and not for three that should not."
- Why it scripts: "three" and "three" stand in for the number of test requests that show a skill is picked correctly.
- What it protects: a skill description that triggers too often or too rarely. The count is the owner's routing-test habit, but nothing says why three.
- Proposal: "...test in each product that reads the skill that it is chosen for requests that should choose it and not for requests that should not."

**F15. Kind 3, borderline.** `WHF/references/checklist.md:28`. "Keep it far below the limit: every session reads every description."
- Why it scripts: "far below" stands in for a judgment about length. The reason is given, so this is close to a protection.
- What it protects: the shared budget of descriptions, which hosts cut when it is over.
- Proposal: "Keep it short, because every session reads every description."

### `WHF/references/rewrite-steps.md`

**F16. Kind 3.** `WHF/references/rewrite-steps.md:50`. "Ask each one what it would do in three to five situations that the file covers, and which words or sentences it could not follow without guessing."
- Why it scripts: "three to five" stands in for the judgment of which situations cover the file.
- What it protects: a rewrite that changes a rule without anyone noticing.
- Proposal: "Ask each one what it would do in situations that cover each rule of the file, and which words or sentences it could not follow without guessing."

**F17. Kind 3, borderline.** `WHF/references/rewrite-steps.md:23`. "Then answer one question in a few lines of your own: what must the reader know, and what must the reader do?"
- Why it scripts: "a few lines" is a size limit on thinking, and the sentence tells the agent how to begin. The question itself carries the owner's rule: "We need to look at the file as a whole."
- What it protects: a rewrite that starts from old lines and not from the reader's needs.
- Proposal: keep the question and remove "in a few lines of your own".

**F18. Kind 2, borderline.** `WHF/references/rewrite-steps.md:57-63`. "A rewrite never decides what a file requires. In each case below, stop and ask the owner." followed by five cases.
- Why it scripts: five cases can be read as the complete list. The first sentence is the general rule and already covers them.
- What it protects: invented rules, goals, or reasons in a rewrite.
- Proposal: keep the general sentence and mark the cases as examples: "For example, stop and ask the owner when ...".

### `REG`

**F19. Kind 3, borderline.** `plugins/workstreams/hooks/register.tsx:50-53`. "the name is a subject line of 8 words or fewer saying what he asked for, in his own plain words; "about" is one or two plain sentences, 30 words or fewer, saying what he asked for and why it matters to him."
- Why it scripts: the two word counts could stand in for the judgment "short enough to read at a glance".
- What it protects: a fixed-width side panel that the owner scans while he switches between many chats (`AGENTS.md`, "Workstreams plugin", 2026-10-04: he "needs reminding what each piece of work is"). The code clips a name at 80 characters, so the word counts keep the text from being cut in the middle of a word.
- Proposal: keep the counts, because they are the form of the record the panel shows, and say what they are for: "...so that it can be read at a glance in a narrow side panel." The same counts appear in the tool field text (`register.tsx:262-272`); keep them in one place.

**F20. Kind 2, borderline.** `plugins/workstreams/hooks/register.tsx:47-49`. "Do not report the steps inside a piece of work, questions, or small chores. Helper agents do not report."
- Why it scripts: the list of what not to report covers situations that the definition of a piece of work (a work item, or a large task the owner follows) already excludes.
- What it protects: a panel that fills with small items. The owner asked for this ("never the steps inside one, a question, or a small chore").
- Proposal: keep, as the owner's wording. The fact that a helper agent's report is not saved is a tool fact and is correct.

## Phrase lists and trigger words

Each entry says where the list is and whether the text also states the general condition.

| List | Where | General condition stated? |
| --- | --- | --- |
| Nine triggers for a manual step, four reasons to skip one | `SF/.claude/skills/sf-component-tracker/SKILL.md:82-99` | Yes: the rule `SF/.claude/rules/record-deployment-steps.md:9` ("when metadata needs an action the deploy cannot perform"), the item "Any other deploy, by your judgment" at line 92, and "When unsure, add the step" at line 101 |
| Four events that update the tracker | `SF/.claude/skills/sf-component-tracker/SKILL.md:39-53` | Yes: line 8, "Keep the deployment records current in the same response as the change" |
| Deploy targets that need the check ("UAT, full copy, staging, or production") | `SF/.claude/rules/check-deployment-contents.md:5`, `SF/.claude/skills/sf-deploy-check/SKILL.md:16` | Yes: "any deploy to a shared org", and the examples are marked "for example" |
| Four signs of an unwanted change | `SF/.claude/skills/sf-deploy-check/SKILL.md:23-27` | Yes in the first sentence of step 3; not marked as examples (F7) |
| The phrase "what writes, reads, or breaks if this changes" | `SF/.claude/rules/dependency-graph.md:13` | Partly: the heading "Impact questions" and the `paths` front matter; no sentence says the phrase is an example (F8) |
| Five categories to confirm with the owner | `SF/.claude/rules/salesforce-agent-permissions.md:41-45` | Partly: "confirm intent and scope" is the action; nothing says what makes a change belong (F21) |
| Five cases to stop and ask the owner | `WHF/references/rewrite-steps.md:57-63` | Yes: line 57, "A rewrite never decides what a file requires" (F18) |
| The kinds of harness file | `WHF/SKILL.md:8` and `WHF/references/checklist.md:11-20` | Yes: "a file that tells Claude Code or Codex how to behave"; the list is a definition the owner fixed, not a set of start phrases |
| Which agent or skill to use for a job | `WHF/references/official-pages.md:7-10` | Yes: line 7, "use the agent or skill that Claude Code provides for the job"; line 7 also says a later release may rename them |
| The four moments to call the report tool | `plugins/workstreams/hooks/register.tsx:46-48` | Yes: the instruction says to report a piece of work, and the four moments are when the panel must change |

None of these is a list of phrases in the owner's own speech, and no `prompt-reminder.mjs` phrase list is in this area.

## Numbers

A number listed here was judged a fact, a form, or a protection and left alone.

- **Facts about Salesforce or its tools:** API version 40.0 (`permissions-source-control.md:10`, the runbook); the Salesforce API's 2000-row cap (`SF/tools/kb/README.md:300`); GitHub's 50 MB warning and 100 MB limit (`SF/tools/kb/README.md:82`); measured sizes and rates in the `kb` README (213.6 MB, 51.6 MB, 374 edges, 5,256 field files, 89.6 and 66.0 per cent, about 25 seconds an org, about 20 minutes a script).
- **Protections:** the preflight receipt expires after 30 minutes (`permissions-source-control.md:29`, runbook line 125). The org changes, so an old preflight no longer protects the deploy.
- **Limits of a host or the standard:** `SKILL.md` under 500 lines, a reference over 100 lines gets a contents list, a skill description of 1,024 or 1,536 characters, and an instruction file under 200 lines (`WHF/references/checklist.md:26, 30-31, 53`); Codex's 32 KiB limit (line 58); version numbers Claude Code 2.1.289 and Codex 0.160 (line 7). These come from the official pages.
- **The 14-day freshness threshold** (`WHF/SKILL.md:23`, `WHF/references/official-pages.md:12`). I judged it a protection against stale guidance, and the owner set it in `AGENTS.md`. It is borderline for kind 3, because the agent could judge staleness itself. Listed here so that the owner can decide.
- **Forms of a record:** order numbers in steps with gaps of 10 (`sf-component-tracker/SKILL.md:109`), the "Purpose" of a step in "one or two sentences" (line 112), `WI-031`, `<YYYY-MM-DD>`, and `<MMDDYYYY>` folder names, the status values, and "Notes" as one short line (line 138).
- **Limits in the workstreams mod:** 8 words and 30 words in the instruction (F19); the code clips a name at 80 characters, "about" at 300, and "next" at 200 (`register.tsx:364, 375, 390`); the panel lists work finished in the last 24 hours. These protect the panel layout and the owner's scanning.
- **Counts of things in the manifests:** "four small hook commands" and "two skills" in `plugins/toolkit/.codex-plugin/plugin.json:20`. These are facts that must match the plugin, and a test or review should keep them true.

# Instructions that script the agent: work-item-skill

The area is the skill `managing-work-items`, in `plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/managing-work-items/`. All 17 `.md` files were read again for this pass. Paths below are relative to that folder. The first pass is in `work-item-skill.md` and is unchanged.

Nothing here is removed on my word. Where a live test may be the reason for a line, the entry says "cannot tell".

## Summary

I found 22 instructions. 18 are borderline, and 4 are not.

| Kind | Meaning | Count | Borderline |
| --- | --- | --- | --- |
| 1 | Tells the agent how to think, weigh, or interpret | 4 | 4 |
| 2 | A sentence, a row, or a list of cases for one small situation | 8 | 7 |
| 3 | A count or threshold where the agent should judge | 6 | 3 |
| 4 | A list of phrases that start a process | 1 | 1 |
| 5 | Tells the agent what a capable agent does anyway | 3 | 3 |

The four findings that are not borderline are `lifecycle-rules.md:106`, `refining-requirements.md:83`, `designing.md:23`, and `design-template.md:45`.

Files with the most findings: `references/building.md` (4), then a tie at 3 findings each for `references/lifecycle-rules.md`, `references/refining-requirements.md`, and `references/testing-loop.md`.

This skill is mostly clean. It mainly states the owner's steps, who does them, where information is filed, and the exact words the owner sees. Most of the 22 are small. The count that the owner removed in version 0.9.18 ("one or two tasks") is gone from `lifecycle-rules.md:148`, but two remnants of the same kind remain: "one reply" in the same definition, and "the default is two options" in `designing.md:23`.

## Findings

### `references/lifecycle-rules.md` (P1 in flight)

1. `references/lifecycle-rules.md:148`. Text: "A small work item is a top-level work item whose whole job you can play back to the owner in one reply, and that you can build and check without an interview, without Designing, and without sub-items." Kind 3, borderline. "In one reply" measures the size of the work item by the length of a message, which is the same kind of stand-in for judgment as the removed task count. It seems to protect the owner from being handed a long list of questions for work that should be small. Propose: remove the clause "whose whole job you can play back to the owner in one reply, and". The sentence then reads "A small work item is a top-level work item that you can build and check without an interview, without Designing, and without sub-items." Line 179 already moves a work item to the full path when it stops being small.

2. `references/lifecycle-rules.md:98`. Text: "A project whose owner has no planned order of work has one project phase, `P01 — Ongoing support`. A project that handles a client's requests as they come in is an example." Kind 2, borderline. The second sentence gives one small situation where the first sentence already states the general rule. It seems to protect support-only projects from being asked about phases. Propose: remove the second sentence and keep the rule and its three bullets.

3. `references/lifecycle-rules.md:106`. Text: "This rule holds even for a small fix found along the way." Kind 2. It adds one small situation to a rule that already covers all work the goal does not need. It seems to protect against scope growth inside a work item. Propose: remove it. The sentence before it says "Work that the goal does not need is a new Backlog work item".

### `references/refining-requirements.md` (P1 in flight)

1. `references/refining-requirements.md:83`. Text: "When there are more than three findings, give them to the owner as one numbered list." Kind 3. The number 3 decides how the agent presents findings, which is a judgment about readability. It seems to protect the owner from a stream of single questions. Propose: replace with "When there are several findings, give them to the owner as one numbered list." Or state the goal: "Give the findings to the owner together, in one numbered list, so the owner answers once."

2. `references/refining-requirements.md:142`. Text: "A tentative answer, such as "probably B, let me think", leaves the question open." Kind 1, borderline. It maps one phrase to a meaning, which is the form of example that the owner rejected. It seems to protect against recording an unconfirmed answer as a decision. Propose: remove the sentence. The sentences before it already say "Only the owner's words answer a question ... until the owner confirms it."

3. `references/refining-requirements.md:34-35`. Text: "Ask first the questions that later questions depend on." and "Ask about each vague word, such as "fast" or "all users", until a tester could check it." Kind 5, borderline. Both tell the agent how to run an interview, which a capable agent does without being told, and step 9 already states when to stop. They may come from a live test of weak interviews: cannot tell. Propose: replace both with one statement of the goal: "Ask until every requirement is specific enough for a tester to check."

### `references/designing.md`

1. `references/designing.md:23`. Text: "Ask the owner at most one question about it, and only when the answer changes the design. The default is two options that differ in approach, when the requirements leave a real choice, with built-in mechanisms first." Kind 3. "The default is two options" is the owner's own example of a count that stands in for judgment (how many options to give), and "at most one question" is a second count. It seems to protect the owner from too many options and from too many questions about the design process. Propose: "Write the options between which the requirements leave a real choice, and put built-in mechanisms first. Ask the owner about the number of options only when the answer changes the design." (The first pass also found that this step does not say what is settled.)

2. `references/designing.md:27`. Text: "When a finding is still disputed after two rounds, give it to the owner as one question." Kind 3, borderline. The number 2 is a loop guard, and a loop guard protects something. It is a protection against endless rounds between the architect and the critic, so it may pass. Propose: keep it, or state the goal: "When a further round would not settle a finding, give it to the owner as one question."

### `references/building.md`

1. `references/building.md:122`. Text: "Start only as many builders as you can check and merge as they return." Kind 1, borderline. It tells the agent how to weigh how much work to start, with no fact about the process. It seems to protect against a pile of unchecked branches. Propose: replace with the goal: "Check and merge each builder's work when it returns, before you start the builders that depend on it." Or remove it, since "When a helper returns" already requires a check before the next helper starts.

2. `references/building.md:205`. Text: "The plan changes when the owner changes the owner's mind, a helper finds a problem, a check fails, or a phase turns out to be too big." Kind 2, borderline. It lists four situations that cause a plan change, where one rule would cover all of them. It seems to protect against a stale plan. Propose: "When the plan no longer fits the work, change phases, sub-items, and tasks with `references/work-tracker.md`."

3. `references/building.md:210-213`. Text: "A running helper whose task moved to another phase keeps going. When a running helper's task was dropped, or its requirement or design changed, stop the helper, or let it finish and do not merge its branch." Kind 2, borderline. It gives two situations for a running helper. It seems to protect against merging work that the plan no longer needs, which is a real risk. Propose: replace with the general rule: "Merge a helper's work only when its task, its requirement, and the design it was built from are still current. Keep the branch of dropped work until the owner agrees that the work is dropped."

4. `references/building.md:232`. Text: "While the owner decides something, keep the team on work that the owner's answer does not block." Kind 5, borderline. A capable agent keeps unblocked work going. It seems to protect against an idle team. Propose: remove the section, or keep it as one sentence in "When the plan changes". Cannot tell whether a live test showed that the team stopped.

### `references/testing-loop.md`

1. `references/testing-loop.md:21`. Text: "Write a test plan when a check has more than one scenario, a manual step, test data, an org or another shared environment, or a release across environments." Kind 3, borderline. "More than one scenario" is a threshold, and the list of conditions stands in for the judgment of when a plan helps. It seems to protect checks that a second person must repeat. Propose: "Write a test plan when the checks cannot be listed as a few commands, for example when they have several scenarios, a manual step, test data, or a shared environment."

2. `references/testing-loop.md:44`. Text: "An instruction to go on, such as "ship it", that the owner gives after you showed the result is the owner's yes." Kind 1, borderline. It maps an owner phrase to a meaning. It seems to protect against asking again after the owner has plainly approved. Propose: "When the owner's reply to the shown result approves it, record the reply as the answer." Or keep it and mark "ship it" as one example, which the text already does.

3. `references/testing-loop.md:52-57`. Text: "In step 4, start the checker only when the result does one of the four things below. In each of them, a mistake would be costly to undo, or would reach a person outside the project." Kind 2, borderline. It gives four situations, but the second sentence states the general condition, so the list reads as examples. This is the owner's exception of 2026-10-07. Propose: keep, and put the general condition first: "Start the checker when a mistake in the result would be costly to undo or would reach a person outside the project, for example when the result ..." with the four items as examples.

### `references/closing.md`

1. `references/closing.md:161`. Text: "When the owner's words name each question, one message from the owner may answer several questions." Kind 1, borderline. It tells the agent how to interpret a message. The part that is process is the record: one row per question. It seems to protect the record when the owner answers merge and Done together. Propose: "Add one Questions and Answers row for each question that the owner's message answers, each with the owner's words."

2. `references/closing.md:46-47`. Text: "A work item that only names, explains, or documents a rule did not build what the rule says." and "A cancelled work item did not build what any rule says." Kind 2, borderline. They are two situations inside the definition of a rule being built. They seem to protect against marking a rule Built wrongly, and `filing-project-records` checks the conditions again. Propose: remove both bullets and keep line 48, which sends the conditions to `filing-project-records`.

### `references/requirements-analyst-brief.md`

1. `references/requirements-analyst-brief.md:10`. Text: "when the owner asks for a spec check, which is a check of the requirements". Kind 4, borderline. It names one phrase of the owner as a way to start the analyst, and the three cases read as the only starts. The first and third cases give general starts (before approval, after a change). Propose: "or whenever the owner asks for a check of the requirements".

2. `references/requirements-analyst-brief.md:50`, `references/design-critic-brief.md:63`, and `references/researcher-brief.md:30`. Text: "Do not invent gaps." / "Do not invent findings to fill the report." / "Never turn a guess into a fact." Kind 5, borderline. Each tells a helper to be honest, which a capable agent does. They may come from a test where a helper padded its report: cannot tell. Propose: keep for the helper briefs, because a helper sees only its brief and these three lines cost little.

### `assets/work-item-template.md`

1. `assets/work-item-template.md:99`. Text: "Add one row, newest first, for each of these changes: a state, `waiting_on`, blocker, or next action change for a reason a later reader could not see; an answer, approval, rejection, or decision; the independent checker's report; a plan change; a change the owner made by hand; a finished result." Kind 2, borderline. It lists situations that call for a row. The general condition is half stated ("a reason a later reader could not see"). It seems to protect the history that later sessions rely on. Propose: "Add one row, newest first, for each change that a later reader could not otherwise understand, for example an answer, an approval, the checker's report, a plan change, a change the owner made by hand, or a finished result."

2. `assets/work-item-template.md:128`. Text: "A bulk "yes to all" is saved as one row per thing it covered, each with the reason the owner was shown ("reason shown: none" when there was none)." Kind 2, borderline. It is one situation, and it is also a form of record with exact words. It seems to protect a clear record of what the owner approved. Propose: keep. It says how a record is formed.

### `assets/design-template.md`

1. `assets/design-template.md:45`. Text: "<Three to five plain-language sentences explaining the approach, why it fits the goal, and what is reused, changed, or new.>" Kind 3. The count stands in for the judgment of how much the approach needs. It seems to protect the owner from a long or an empty approach. Propose: "<A short, plain-language explanation of the approach, of why it fits the goal, and of what is reused, changed, or new.>"

## Phrase lists and trigger words

- `references/requirements-analyst-brief.md:7-11` lists three cases that start the analyst: before approval, a "spec check", and after a change. The general condition is partly stated (the first and third cases), and the phrase "spec check" is the only owner phrase. See finding 1 of that file.
- `references/building.md:42` and `references/building.md:47` use the owner's words "you drive" as a way to give the work to the agent. The general condition is stated in the same line: "The owner gives the work item to the agent in the owner's own words, for example "you drive"". It passes.
- `references/testing-loop.md:44` uses "ship it" as an example of an instruction that counts as the owner's yes. The general condition is stated ("an instruction to go on"). It is borderline because it also maps a phrase to a meaning (finding 2 of that file).
- `references/refining-requirements.md:142` uses "probably B, let me think" as an example of a tentative answer. It is an example, and the general rule is stated before it. See finding 2 of that file.
- `references/designing.md:46` and `references/refining-requirements.md:79` give exact words for the agent to say ("Say 'keep going' and I'll start the build."; "What have we not talked about yet that could change this?"). They are words the owner sees, not triggers.
- `SKILL.md:3` lists verbs in the skill description ("asks about, starts, continues, changes, tests, ships, closes, or cancels"). The description is outside this pass.

## Numbers

Every count and threshold that I judged a fact, a form, or a protection. The ones marked "borderline" are the ones the owner may want to look at.

- **Four levels of work** (`SKILL.md:10`, `lifecycle-rules.md:75`, and "Never add a fourth level" at `lifecycle-rules.md:84`). It is the form of the data model.
- **Six stops for the owner's yes** (`lifecycle-rules.md:132`). They are the owner's approval steps. **Six steps of the short path** (`lifecycle-rules.md:150`). The count must match the list, so a change to the list needs a change to the sentence.
- **"One question", "one short question", "one line", "one sentence", "one reply"** in the process. Examples: `lifecycle-rules.md:86`, `lifecycle-rules.md:94`, `lifecycle-rules.md:152`, `refining-requirements.md:33`, `refining-requirements.md:145` ("Ask one question in each reply"). They describe how the owner is asked and how a record is written. "One question in each reply" is the owner's own rule for the interview. "One reply" at `lifecycle-rules.md:148` is a finding, not here.
- **Forms of an ID and a task** (`lifecycle-rules.md:107-111`): `P01`, `P1`, `P1-T01`, `T01`, `PT-01`, `Q-07`, `R-01`, `DEC-014`, `SRC-###`. They are forms of a record. **Three forms of a Next action** (`work-item-template.md:33`) and **five lines of Current state** (`work-item-template.md:29`, `lifecycle-rules.md:217`) are forms of a record.
- **"At least one phase", "at least one line in Functional Requirements and in Acceptance Criteria"** (`lifecycle-rules.md:80`, `lifecycle-rules.md:161`, `refining-requirements.md:74`, `refining-requirements.md:76`). They are conditions for "done".
- **"Keep each line to one or two sentences"** (`work-item-template.md:29`). It is the form of the Current state, which must stay short.
- **Counts of items in a list**: "four conditions" for a split (`refining-requirements.md:123`), "four kinds of information" (`refining-requirements.md:110`), "three conditions" for a standing merge instruction (`deploying.md:35-38`), "Read these three" (`deploying.md:69`), "three values" of `delivery` (`building.md:32`), "seven cases" (`building.md:40`), "six things" (`building.md:192`), "three cases" (`designing.md:34`), "two cases only" for skipping the critic (`designing.md:64`), "four outcomes" (`closing.md:71`), "three" choices for a lesson (`closing.md:53`), "four verdicts" (`acceptance-checker-brief.md:43`), "three verdicts" (`design-critic-brief.md:39`). Each counts a list that is the owner's process. A change to a list needs a change to its number.
- **"At least one critic"** (`designing.md:63`, `design-architect-brief.md:9`). It is the owner's rule that every design is critiqued.
- **Two rounds before a finding goes to the owner** (`designing.md:27`) and **a second fix before the owner is asked** (`testing-loop.md:33`). Both are loop guards. Borderline: they stand in for the judgment of when further rounds are useless. I passed them because a loop guard protects against endless work.
- **"Once"** in "Offer a team of helper agents once" (`refining-requirements.md:30`) and "ask once" (`refining-requirements.md:79`, `closing.md:51`). They are the owner's rule not to ask the same question twice.
- **"More than one work item"** in the test for where information goes (`lifecycle-rules.md:8`, `refining-requirements.md:56`, `closing.md:43`). It is the filing test of the root `AGENTS.md`.
- **Report sizes in helper briefs**: "in one line", "in two or three sentences" (`researcher-brief.md:49`), "one bullet for each finding". They are the form of what a helper returns. "Two or three sentences" is borderline in the same way as the count in `design-template.md:45`, but it limits a report and not a design.
- **Tool facts**: `fork_turns` set to `none`, `model` set to `opus` (`lifecycle-rules.md:240-241`), SHA-256 (`testing-loop.md:17`), `git log --oneline -5` (`acceptance-checker-brief.md:38`), a fence of four backticks (`design-architect-brief.md:62`), the list of Git commands that fail in Codex (`building.md:165`).
- **Example numbers and dates in exact rows**, such as "Pull request #14", "Q-12", "WI-031", "started 2026-09-30", "three builders, one per sub-item". They are examples of a record or of exact words.

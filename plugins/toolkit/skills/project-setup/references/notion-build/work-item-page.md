<callout icon="💡" color="gray_bg">
	If you are an agent creating or changing this page: text wrapped in “\<\>” tells you what to write there. Replace it with real content, or delete it when there is nothing to write yet. Delete this note too.
</callout>
# Overview
**Goals:**
1. \<The outcomes this work item is meant to achieve. In numbered list format.\>
## Current state {toggle="true"}
	Where this item stands now. Rewrite these five lines in place after each step; never add to them. History goes in Recent History. Keep each line to one or two sentences.
	**Where it stands:** \<What is done and where work stands now.\><br>**Next action:** \<One of three forms. Working: “\<Who\>: \<the exact next step, one sentence\>.” Example: “Agent: write two design options for the permission set groups.” Waiting: “Waiting on Mike: Q-07 (\<the question in a few words\>). After his answer: \<step\>.” Example: “Waiting on Mike: Q-07 (merge or move the 15 personas). After his answer: finish R-04.” Finished or cancelled: “None. Finished.” or, for a cancelled item, “None. Cancelled.”\><br>**Waiting on:** \<Who the item waits on and for what, matching the Waiting on property, or "Nothing."\><br>**Blockers:** \<Blocking decision or dependency, or "None."\><br>**Last updated:** \<YYYY-MM-DD, and who: the owner or the agent.\>
	**Related items:** \<For a top-level item, its project phase (for example P01); for a sub-item, its parent. Related work item IDs, design, or external links.\>
# Roadmap
Only a top-level item has phases, at least one; a sub-item has none, so this stays empty. A phase is complete when its tasks are complete, its sub-items are Done or Cancelled, and its exit result has been checked. Each phase is a row in the Phases database; add, reorder, merge, or drop phases there.
# Sub-items
The sub-items of this item, one column per phase. Move a card to another column to move it to another phase. A sub-item's own sub-items have no phase.
# Tasks
One row per task, grouped by phase; a sub-item's tasks have no phase. Set a task's Status to Done only when its "Done when" check is met.
# Recent History
<table header-row="true">
<tr><td>Date</td><td>Change or decision</td><td>Effect on the work</td></tr>
<tr><td>\<YYYY-MM-DD\></td><td>\<What happened\></td><td>\<What changed or what happens next\></td></tr>
</table>
# Requirements
\<Every requirement must follow this structure below\>
## Requirement \<number\>: \<short name\>
- **Original verbatim requirement: **\<i.e. from the user, stakeholder, etc.\>
- **Goal**: \<What this requirement achieves, in one sentence\>
<details>
<summary>**Functional, Process, Logic, Schema, etc. Requirements**</summary>
	1. \<Requirement 1\>
	2. \<Requirement 2\>
	3. \<etc…\>
</details>
<details>
<summary>**Acceptance Criteria:**</summary>
	1. \<Acceptance Criteria 1\>
	2. \<Acceptance Criteria 2\>
	3. \<etc…\>
</details>
# Questions and Answers {toggle="true"}
	Every question asked about this item gets a row, filled the moment the owner answers: his words in Answer, the date in Date answered, Status Answered, and "yes" in Decision? when the answer decides something. These rows are the item's decisions. Unanswered rows stay first, the oldest on top; answered rows follow, newest first.
	<table header-row="true">
	<tr><td>ID</td><td>Question</td><td>Answer</td><td>Date answered</td><td>Decision?</td><td>Affects</td><td>Status</td><td>Decision needed from</td></tr>
	<tr><td>Q-02</td><td>\<Specific unanswered question\></td><td></td><td></td><td></td><td>R-01, P1-T02</td><td>Open</td><td>\<owner, or another person or role\></td></tr>
	<tr><td>Q-01</td><td>\<Question the owner has answered\></td><td>\<The owner's answer, in his words\></td><td>\<YYYY-MM-DD\></td><td>\<yes or no\></td><td>R-01</td><td>Answered</td><td>\<owner, or another person or role\></td></tr>
	</table>
# Notes
## Context
- \<Useful context that is not a requirement. Decisions are rows in Questions and Answers.\>
## Sources
- \<File name in Files\> — \<what it is\>; \<what was taken from it\>.
## Solution options and considerations
These are possibilities to evaluate, **not approved requirements or design decisions**.
- **For R-01:** \<Possible approach and the tradeoff or question it raises.\>
# Linked memory
Memory records and project-wide decisions that link to this item. Linked facts and entities are in the Facts and Entities properties.
# Linked Github PRs
\<Link any github PRs below in the Embed Github component. If there are multiple PRs, link multiple.\>

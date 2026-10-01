*Note: Fill-in guide: keep this page as a child page of its work item, replace \<Work item ID\> and every angle-bracket prompt with the actual value in that exact heading, field, table cell, or paragraph, and delete this guide. Add rows or options where needed; remove unused example rows, and each section or heading the template says to remove when unused. When the owner answers a question, update the relevant design section and the matching Questions and Answers row on the work item page, then update Notes at the bottom and the work item's Current state.*
**Requirements:** \<Work item ID\><br>**Design status:** \<Draft \| In review \| Approved \| Superseded\><br>**Requirements checked:** \<Link to the work item page's requirements and date checked\><br>**Last updated:** \<YYYY-MM-DD\><br>**Design approval:** \<Owner, date, and decision source if approved; otherwise Pending\>
*Note: Keep this page with its work item. The work item page, not this page, holds the agreed goal, its Current state (where work stands and the exact next action), active requirements, Questions and Answers (which holds the item's decisions), its Roadmap and Tasks, and its Recent History. This page explains how to meet those requirements. During an interview, update settled answers in the relevant design section, keep unresolved discussion in Notes at the bottom, and keep the next action in the work item's Current state. A recommendation or saved draft is not owner approval.*
## What this design solves
\<In a short paragraph, say who uses the result, what they need to accomplish, and what must be true afterward. Link to the agreed goal. State what this design covers and what it leaves to another work item.\>
## Requirements and design readiness
\<Say whether the work item's requirements are ready to design from. Do not use this design to fill a missing requirement; return gaps to the work item's Questions and Answers for an owner decision.\>
<table header-row="true">
<tr>
<td>Requirement</td>
<td>Status in work item</td>
<td>Design coverage</td>
<td>Remaining decision or gap</td>
</tr>
<tr>
<td>R-01 — \<Requirement heading\></td>
<td>\<Refining / Finalized / Superseded\></td>
<td>\<Option and section that address it, or Pending\></td>
<td>\<Question ID or None\></td>
</tr>
</table>
## What exists today
\<For an existing build, describe verified current behavior, relevant files or configuration, and the gap. For a new build, say that nothing exists yet. Distinguish observed facts from assumptions.\>
## Constraints and assumptions
<table header-row="true">
<tr>
<td>Type</td>
<td>Constraint or assumption</td>
<td>Source and status</td>
<td>Effect on the design</td>
</tr>
<tr>
<td>\<Constraint / Assumption\></td>
<td>\<Specific statement\></td>
<td>\<Link or person, date; confirmed or open\></td>
<td>\<What it limits or changes\></td>
</tr>
</table>
## Design options
*Note: Include the number of options chosen for this design (the owner's number when he gave one). Keep each option in this page with the same subsections. Remove unused option headings. Describe options as proposals until the owner chooses one.*
### Option A — \<Short name\>
#### Approach
\<Three to five plain-language sentences explaining the approach, why it fits the goal, and what is reused, changed, or new.\>
#### End-to-end behavior
1. \<Who starts the flow, when, and with what input.\>
2. \<What the system or team does, including a decision or failure path.\>
3. \<What the person sees or receives and what happens afterward.\>
#### Requirement coverage
<table header-row="true">
<tr>
<td>Requirement</td>
<td>Build or reuse</td>
<td>Why it meets the requirement</td>
<td>How to check it</td>
</tr>
<tr>
<td>R-01</td>
<td>\<Exact component, setting, or process; new/changed/reused\></td>
<td>\<How required behavior follows\></td>
<td>\<Test or observable result\></td>
</tr>
</table>
#### Technical shape
- **Components and files:** \<Names, responsibilities, and what changes.\>
- **Data and state:** \<Records, fields, ownership, lifecycle, and migration if applicable.\>
- **Access and security:** \<Who may see or change what, and where checks occur.\>
- **Integrations:** \<Systems, interfaces, events, and failure handling.\>
- **Operations:** \<Monitoring, support, backup, rollback, and ongoing ownership where relevant.\>
#### Tradeoffs and risks
<table header-row="true">
<tr>
<td>Tradeoff or risk</td>
<td>Likelihood and effect</td>
<td>Mitigation or owner decision</td>
</tr>
<tr>
<td>\<Specific concern\></td>
<td>\<What could happen and its impact\></td>
<td>\<Action, fallback, or question\></td>
</tr>
</table>
#### Build order
1. \<First build step and why it comes first.\>
2. \<Next dependent step and its completion check.\>
*Note: If several options are wanted, repeat the Option A subsections as Option B, Option C, and so on.*
## Option comparison
*Note: Keep this section when there is more than one option; otherwise remove it. Compare the differences that matter to the owner.*
<table header-row="true">
<tr>
<td>Criterion</td>
<td>Option A</td>
<td>Option B</td>
<td>Evidence or uncertainty</td>
</tr>
<tr>
<td>\<Requirement coverage, effort, risk, operations, or another agreed criterion\></td>
<td>\<Assessment\></td>
<td>\<Assessment\></td>
<td>\<Source or open question\></td>
</tr>
</table>
## Recommendation and owner decision
**Recommendation:** \<Option and reason, including the main cost or tradeoff. A recommendation is not approval.\><br>**Owner decision:** \<Pending, or chosen option with who decided, when, and the Q-ID of the work item's Questions and Answers row that records the choice.\><br>**Reason for decision:** \<Owner's reason if given; do not invent one.\>
*Note: With a single option, keep the owner decision and remove the comparison and recommendation text.*
## Selected design
\<Before an option is chosen, write “Pending owner decision.” Afterward, make this the current buildable design. Update it when an interview answer changes the chosen approach; keep the option sections above; mark a replaced option “Superseded by Option \<letter\>” under its heading.\>
### End-to-end flow
1. \<Trigger, actor, and input.\>
2. \<Steps, decisions, error paths, and handoffs in order.\>
3. \<Result, user feedback, and what happens next.\>
### Components and responsibilities
<table header-row="true">
<tr>
<td>Component or file</td>
<td>New, changed, or reused</td>
<td>Responsibility</td>
<td>Requirement IDs</td>
</tr>
<tr>
<td>\<Exact name or path\></td>
<td>\<New / Changed / Reused\></td>
<td>\<Specific behavior\></td>
<td>R-01</td>
</tr>
</table>
### Data, access, and integration details
\<Describe the chosen data model and state changes, access rules, system boundaries, interfaces, and ownership at enough detail for a builder to implement without guessing. State “Not applicable” for a genuinely unused area.\>
### Edge cases and failure behavior
<table header-row="true">
<tr>
<td>Situation</td>
<td>Expected behavior</td>
<td>How it will be checked</td>
</tr>
<tr>
<td>\<Missing data, duplicate, denied access, integration outage, or other relevant case\></td>
<td>\<Exact result and recovery\></td>
<td>\<Test or observation\></td>
</tr>
</table>
### Release and ongoing operation
\<Describe deployment order, migration or backfill, rollback, monitoring, support handoff, and operating owner where relevant.\>
## Diagrams
\<Add Mermaid diagrams when they clarify the chosen flow, component relationships, data movement, states, or deployment. Give each diagram a descriptive heading and a one-sentence explanation. Keep diagrams consistent with the written design and update both when the design changes. Remove unused examples; a diagram does not replace the behavior and failure details above.\>
### \<Diagram name and type\>
\<What this diagram shows, including any boundary or exception that the drawing omits.\>
```mermaid
flowchart TD
    A["<Trigger or actor>"] --> B["<Action or decision>"]
    B --> C["<Result>"]
```
\<If a diagram cannot be rendered, describe its essential sequence or relationships in text here. Add further Mermaid diagrams only where useful.\>
## Build and verification plan
### Technical sequence
1. \<Build step, dependencies, and artifact.\>
2. \<Next step and completion evidence.\>
### Acceptance checks
<table header-row="true">
<tr>
<td>Requirement or acceptance item</td>
<td>Verification method</td>
<td>Expected result</td>
<td>Evidence location</td>
</tr>
<tr>
<td>R-01</td>
<td>\<Test, review, or demonstration\></td>
<td>\<Observable pass condition\></td>
<td>\<Where evidence will be recorded\></td>
</tr>
</table>
## Sources and decisions that affect the build
<table header-row="true">
<tr>
<td>Claim or decision</td>
<td>Source</td>
<td>Date</td>
<td>Evidence type</td>
<td>Checked how</td>
</tr>
<tr>
<td>\<Fact or choice that changes the design\></td>
<td>\<Exact link, file, or the Q-ID of the owner's answer\></td>
<td>\<YYYY-MM-DD\></td>
<td>\<Official documentation / Project evidence / Owner decision / Community claim\></td>
<td>\<Verification or Pending\></td>
</tr>
</table>
\<Do not treat an unchecked community claim or an assistant proposal as a verified fact or owner decision.\>
## Where a builder could misread this design
<table header-row="true">
<tr>
<td>Requirement or section</td>
<td>Plausible wrong reading</td>
<td>Intended reading and how the design makes it clear</td>
</tr>
<tr>
<td>R-01</td>
<td>\<Likely mistake\></td>
<td>\<Correct interpretation and relevant design detail\></td>
</tr>
</table>
## Notes
### Open design questions
<table header-row="true">
<tr>
<td>Question</td>
<td>Affects</td>
<td>Decision needed from</td>
<td>Status</td>
<td>Next step</td>
</tr>
<tr>
<td>\<Question and its Q-ID in the work item's Questions and Answers, where its answer and date are recorded\></td>
<td>\<Section or requirement\></td>
<td>\<Person or role, or unknown\></td>
<td>Open</td>
<td>\<Action\></td>
</tr>
</table>
### Design changes during the interview
<table header-row="true">
<tr>
<td>Date</td>
<td>Answer or decision</td>
<td>Section updated</td>
<td>Source and approval state</td>
</tr>
<tr>
<td>\<YYYY-MM-DD\></td>
<td>\<What changed\></td>
<td>\<Heading\></td>
<td>\<Q-ID or link; proposed or approved\></td>
</tr>
</table>

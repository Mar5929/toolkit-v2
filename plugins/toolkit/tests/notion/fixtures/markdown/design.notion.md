Status: proposed<br>Requirements: WI-001<br>Date: \<YYYY-MM-DD\>
## What this solves
\<Who uses the result, what they are trying to do, and what must be true when it is done. Link to the agreed goal rather than repeating every requirement.\>
## What exists today
\<For an existing build, describe verified current behavior in this area, link to the relevant files or configuration, and say where it falls short. For a new project, state that nothing exists yet.\>
## Design philosophy
\<State the owner’s chosen approach: use built-in mechanisms first when they meet the requirements, or explain the chosen specialized approach.\>
## Preparation
- **Requirements readiness:** \<Whether the requirements are ready to design from; remaining gaps or owner rulings; links to the corrected requirements. Do not use design text to fill a requirements gap.\>
- **Way of working:** \<Interview or scan first; how many options will be designed and what differs between them.\>
- **Team:** \<Agreed roles, models, scope, and expected returns, if helpers are used.\>
- **Constraints:** \<Applicable project, platform, timing, and approval boundaries.\>
\<Keep settled preparation here. Put unresolved discussion, decisions needing context, and the exact next action in Notes.\>
## Option A: \<Short name\>
### Summary
\<In three to five plain-language sentences, explain the proposed approach and why it fits the agreed goal.\>
### How each requirement is met
#### R-01 — \<Requirement heading from [WORK-ITEM.md](http://WORK-ITEM.md)\>
- **Build or reuse:** \<Exact component, setting, or mechanism and whether it is new, changed, or reused.\>
- **Why this satisfies it:** \<Explain how the approach produces the required behavior.\>
- **How to check it:** \<Test or observation that proves this requirement works.\>
#### R-02 — \<Requirement heading from [WORK-ITEM.md](http://WORK-ITEM.md)\>
- **Build or reuse:** \<Exact component, setting, or mechanism and whether it is new, changed, or reused.\>
- **Why this satisfies it:** \<Explain how the approach produces the required behavior.\>
- **How to check it:** \<Test or observation that proves this requirement works.\>
### What the person experiences, start to finish
1. \<First step in the experience.\>
2. \<Next step, including what happens if the action fails or cannot proceed.\>
3. \<Final result and what the person sees or receives.\>
### Components and files touched
<table header-row="true">
<tr>
<td>Component or file</td>
<td>New, changed, or reused</td>
<td>What changes</td>
</tr>
<tr>
<td>\<Real component or file name\></td>
<td>\<New / Changed / Reused\></td>
<td>\<Specific responsibility or change\></td>
</tr>
</table>
### Order of work
1. \<First thing to build and why it comes first.\>
2. \<Next thing to build and how it depends on the first.\>
### Risks and tradeoffs
- \<Risk, how likely it is, what it would cost, and what reduces it.\>
- \<Tradeoff the owner should understand before choosing this option.\>
### Sources
<table header-row="true">
<tr>
<td>Claim in this design</td>
<td>Source</td>
<td>Date</td>
<td>Label</td>
<td>Verified how</td>
</tr>
<tr>
<td>\<Claim that affects the design\></td>
<td>\<Exact link or project path\></td>
<td>\<YYYY-MM-DD\></td>
<td>\<Official documentation / Project evidence / Community claim\></td>
<td>\<How the claim was checked\></td>
</tr>
</table>
\<Use verified sources. A community claim is not treated as fact until checked against official documentation, project evidence, or a test.\>
\<!-- If the owner wants several options, add Option B, Option C, and so on as top-level sections, each with the same inner headings. Keep all options in this one design file. --\>
## Where a builder could misread the requirements
<table header-row="true">
<tr>
<td>Requirement</td>
<td>Wrong reading</td>
<td>Intended reading, and what this design does</td>
</tr>
<tr>
<td>R-01</td>
<td>\<Plausible but incorrect interpretation\></td>
<td>\<Correct interpretation and the design choice that makes it clear\></td>
</tr>
</table>
\<!-- Include Recommendation only when there is more than one option. --\>
## Recommendation
\<If there is more than one option, state which one is recommended, why, and what the owner gives up by choosing it. Remove this section for a single-option design.\>
\<!-- Include this section only for an existing build. --\>
## Should the existing build be replaced?
\<Yes or no, and why. If yes, explain the cost of a rewrite and why extending the current build serves the requirements worse. Remove this section for a new project.\>
## Notes
- **Decisions:** \<Relevant choice, proposed or approved status, who decided and when if known, and source. Link to the settled design text.\>
- **Still open:** \<Unanswered questions, unresolved review findings, and remaining design-document tasks. For each, record who must answer or act, its status, what it affects, and the next step.\>
- **Resume here:** \<Exact section or question and the next action.\>
\<Update settled answers in the design above. Saving this draft does not approve the design or authorize implementation.\>
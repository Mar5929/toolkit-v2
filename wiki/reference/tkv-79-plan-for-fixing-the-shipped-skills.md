# TKV-79: plan for fixing the shipped skills

This plan says how the toolkit's shipped skills will be brought in line with Mike's guiding design principles, using the review of work item TKV-79. The plan is done when Mike has approved or changed it. No step of the plan is carried out before Mike's yes for that step.

Written on 2026-10-13 against toolkit version 0.9.83. It is a proposal by the agent. Mike has approved only the parts marked "Done".

## 1. What Mike asked for

**The original request.** Mike wrote on 2026-10-13: "You lead a team of reviewer agents. Review the skills the toolkit ships and score each one against the owner's design principles. No agent edits, commits, or changes any file. Report only."

**The goal behind it.** Mike knows where the shipped skills say too much, repeat each other, or break the design principles, so that he can decide what to cut or rewrite.

**Why now.** On the same day, Mike added principle 1.1 to `wiki/product-wiki/Toolkit Guiding Design Principles.md`. Principle 1.1 gives eight points that every shipped skill must meet. The review was the first measure of the whole toolkit against those points. The toolkit ships about 167,000 words of instructions.

**What Mike asked for after the review.** In the session of 2026-10-13 Mike asked a second agent to evaluate the review, then gave these answers:

| Mike's answer | What it means for this plan |
| --- | --- |
| The starter `AGENTS.md` "needs to be as small as possible". | No fix adds text to the starter `AGENTS.md` or to a rule that every session loads. |
| A line for one case stays when it is "truly needed for some edge case scenario". | Before a list of cases is replaced, each case is read, and a case that protects a real edge case stays. |
| "yes fix" to the two shared hook commands that name memory choices. | Phase 1 changes them. Mike sees the design first. |
| "yes" to merging `shared-by-local-and-notion/` into the local memory choice. | Done on the branch. |
| "remove" the lines for earlier toolkit versions. | Done on the branch. |
| GitHub as the code host for every project is "fine". | `merge-and-clean-up` keeps using GitHub pull requests. |
| "keep them, and do option B for the rest". | The edits on the branch stay. Every other proposal was listed with a verdict before any more edits. |

## 2. The standards every change follows

### What the toolkit is

The guiding principles say the toolkit is an operating system and framework for AI agents. It gives the agent the owner's procedures and processes through skills, rules, `AGENTS.md`, and hooks. The agent stays free to use its own reasoning, and follows the ways of working that the owner defined.

### How a shipped skill is structured (principle 1.1)

A shipped skill holds the owner's process: the steps, their order, the policies, the templates, and anything that must be exact. It trusts the agent to work out the rest. The eight points:

| Point | What it requires |
| --- | --- |
| 1. Process is clear | A reader can see the steps and their order. |
| 2. Right level of detail | Exact where it must be exact: a command, a name, an ID form, words the owner must see. General everywhere else. |
| 3. General rules | No sentence for one small case, unless the case is truly needed. |
| 4. No telling the agent how to think | The skill states the goal and the process. |
| 5. No count or limit where judgment belongs | The step says what it is for, and the agent decides. |
| 6. No duplication | Nothing repeats `AGENTS.md`, a rule, the output style, or another skill. |
| 7. Small load on the agent's context | `SKILL.md` is short, and detail sits in a reference file that opens only when needed. |
| 8. Document clarity standard | See below. |

### The other principles the review checked

| Principle | What it requires |
| --- | --- |
| 3 | Nothing shipped names a single project. A fact true for only some projects is asked at setup and written in that project's files. |
| 5 | A project reads only the text for the setup choices it made. Text that every project gets names no setup choice. |
| 6 | Keeping shared text free of setup choices must never make it vaguer. Each choice supplies a file with its exact steps, and the shared skill points to that file. |
| 7 | An instruction describes the owner's ways of working. It adds no rule that the agent already follows by itself. A point where the owner asked to approve stays. |
| 9 | Follow the official Claude Code and Codex pages, and use what they already provide. |

### How the document clarity standard applies

`.claude/rules/document-clarity-standard.md` governs every sentence that a change writes or rewrites. For this plan that means:

- **A rewrite keeps the requirements.** Every fact, number, name, command, and approval point stays unless Mike approved its removal.
- **Before an exception or a prohibition is removed, the agent names the behavior it protects** and checks whether that behavior is still required. When the agent cannot tell, it asks Mike.
- **Plain never means vaguer.** A replacement sentence names its subject at least as exactly as the sentence it replaces.
- **A changed requirement is worked into the text.** The agent rewrites the affected section as a whole and removes the wording that no longer holds. It does not add a correction below the old text.
- **A file that points to a moved or renamed heading is updated in the same change.**

### How each change is made

The repository's `writing-harness-files` skill gives the steps for any change to a skill, rule, guide, hook, or settings file: read the current official page for that kind of file, follow the checklist, write the change, run the checks, and have a separate agent review it.

## 3. What the review found, and what it proposes

Six reviewers scored 26 units, each out of 40 on the eight points. Scores ran from 21 to 35. A seventh pass, the lead's, checked all 559 quotes against the files. A second agent later checked eight findings against the files, and all eight held.

The scores are a rough ranking only, because each reviewer used an own scale. The findings are the useful result.

### The proposals, by group and by principle

The reports propose 153 changes. `tkv-79-review-proposals-checked-against-principles.md`, in this folder, lists every one with its verdict. This table is the summary.

| Group | What the proposals do | Principle | Proposals | Fits | Breaks as written | Needs Mike | Done |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A | Take setup choices out of shared files | 5 | 12 | 10 | 0 | 2 | 0 |
| B | Remove text that fits one project, computer, or past session | 3 | 17 | 14 | 0 | 2 | 1 |
| C | Correct wrong or conflicting statements | 1.1, point 2 | 18 | 11 | 0 | 5 | 2 |
| D | Keep each repeated text in one place | 1.1, point 6 | 49 | 43 | 4 | 2 | 0 |
| E | Replace lists of cases with a general rule, and cut rules the agent follows by itself | 1.1, points 3 and 4; 7 | 19 | 15 | 0 | 4 | 0 |
| F | Remove counts and limits | 1.1, point 5 | 7 | 7 | 0 | 0 | 0 |
| G | Split long files | 1.1, point 7 | 10 | 8 | 0 | 2 | 0 |
| H | Make wording clear | 1.1, point 8 | 8 | 7 | 0 | 1 | 0 |
| I | Move one choice's steps out of shared setup files | 6 | 6 | 6 | 0 | 0 | 0 |
| J | Other | several | 7 | 3 | 0 | 2 | 2 |
| **Total** | | | **153** | **124** | **4** | **20** | **5** |

### What the verdicts mean

- **Fits (124):** the proposal follows the principles and does not change what a project does.
- **Breaks as written (4):** the reviewer's fix would itself break a principle. All four are in group D. Three add text that every session loads, and one adds text to the largest file of `managing-work-items`. The proposal list gives a way that fits for each.
- **Needs Mike (20):** the proposal changes how a project works, or depends on a fact or preference only Mike has. The proposal list states each decision so that it can be answered by itself.
- **Done (5):** approved by Mike and made on the branch.

### What the review did not cover

- It did not score the text that every session loads: the starter `AGENTS.md`, the rules, the output style, the folder guides, and the hook text.
- It did not check anything against the official Claude Code and Codex pages (principle 9).
- It ran no skill and no setup. The lists of what "must stay" are the reviewers' reading, not tested behavior.

Phase 7 of this plan covers these three gaps.

## 4. The implementation plan

### Rules for every phase

1. **Mike's yes comes first.** Before a phase starts, the agent tells Mike what the phase will change and waits for his yes. A proposal marked "Needs Mike" waits for its own answer.
2. **One phase, one branch, one pull request.** Mike can read and merge each phase by itself. A merge into the default branch needs Mike's yes.
3. **The starter `AGENTS.md` and the always-loaded rules get no new text.** A phase may only make them shorter.
4. **A case list is checked case by case.** A case that protects a real edge case stays.
5. **Each change follows `writing-harness-files`,** and a separate agent reviews it against the official page, the guiding principles, and the document clarity standard.
6. **Each phase is tested in a scratch folder** for the setups it touches: local, Notion, Hindsight, GitHub, Salesforce, in both Claude Code and Codex where the change reaches both.
7. **The repository checks run** (`claude plugin validate` for the marketplace and the plugin, and `git diff --check`), and the version is raised.
8. **`REF/update.md` is checked** whenever a phase moves, renames, or removes a file that a project already has, so that "update the toolkit" still works in an existing project.
9. **TKV-79 is updated after each phase:** its state, next action, tasks, and history.

### The phases

| Phase | What it does | Proposals | Why in this order |
| --- | --- | --- | --- |
| 0 | The edits Mike approved on 2026-10-13: the memory folder merge, the earlier-version lines, the "IML" example, one false sentence, and one line in this repository's `AGENTS.md`. | B3, C1, C17, J6, J7 | Done on the branch `claude/tkv-79-review-fixes`. Reviewed by a separate agent; its four findings are corrected. Not committed. |
| 1 | Shared files name no setup choice. The two hook commands come first, then the shared skills, then the Hindsight workaround lines. | Group A | It is a clear break of principle 5, and the Hindsight lines can be removed only after the hooks change. |
| 2 | Wrong statements, dead pointers, and text for one project or computer. | Groups B and C | Small, separate corrections. Later phases then work from correct text. |
| 3 | Each repeated text is kept in one place. | Groups D and I | The largest group. It also makes the starter `AGENTS.md` and a project's `AGENTS.md` shorter. |
| 4 | Case lists, rules the agent follows by itself, and counts. | Groups E and F | Done after phase 3, because phase 3 removes many of the lines these proposals touch. |
| 5 | Long files are split so that less loads for one job. | Group G | Done after text is removed, so that only the remaining text is moved. |
| 6 | Wording that a new reader would not follow. | Group H | Done last among the text phases, so that no rewritten sentence is later deleted. |
| 7 | The three gaps of the review: score the always-loaded text against principle 1.1, check the harness files against the official pages, and score the 26 units again. | New work | It shows whether the scores rose, and it covers what the review skipped. |

### Phase 1 in more detail: the two hook commands

`session-start.mjs` and `prompt-reminder.mjs` go to every project. Both name local, Notion, and Hindsight memory, and both take a word in the settings line that selects the memory choice.

The agent will show Mike a short design before it writes any code. The design must answer:

- how each memory choice supplies its own part, so that the shared command names no choice;
- what changes in `.claude/settings.json` and `.codex/hooks.json`, since Codex asks the owner to trust a hook again after its entry changes;
- what "update the toolkit" does in a project that has the current hooks;
- how the change is tested for each memory choice in both hosts.

### Work items

The agent proposes one sub-item of TKV-79 for each of phases 1 to 7, opened when Mike approves the plan. Each sub-item holds its own requirements, tasks, and history.

## 5. Where the work stands

| Item | State |
| --- | --- |
| The review | Finished. Six reports are attached to TKV-79. |
| The evaluation of the review | Finished. It is in the Notes of TKV-79. |
| The list of all 153 proposals with verdicts | Written: `tkv-79-review-proposals-checked-against-principles.md`. |
| Phase 0 | Made and reviewed on the branch. Waiting for Mike's yes to commit and open a pull request. |
| Phases 1 to 7 | Not started. Waiting for Mike's yes to this plan. |
| Decisions for Mike | 20. One, the hook commands, is answered and waits for its design. Each of the others is needed only before the phase that holds it. The proposal list states each one. |

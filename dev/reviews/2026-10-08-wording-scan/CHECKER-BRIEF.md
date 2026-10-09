# Wording scan: the brief for a checker

This brief is for a helper agent that checks the findings a reader wrote. Seven readers each read one area of the shipped instruction files of Toolkit V2 and wrote a findings file. You check the findings files you are given, so that what reaches the owner is true. You change no file except your own check file.

## Read these first

All paths start at the root of this worktree: `/Users/michaelrihm/Documents/Projects/toolkit-v2/.claude/worktrees/wording-scan`. Read every file from this worktree and from no other copy of the repository.

1. `dev/reviews/2026-10-08-wording-scan/BRIEF.md`. It is the brief the readers followed. It says who the reader of the shipped files is, what counts as a finding, and how serious each level is.
2. `plugins/toolkit/skills/project-setup/assets/every-project/.claude/rules/document-clarity-standard.md`. It is the measure. Its heading rule changed after the readers started; use the file as it is now.
3. `dev/reviews/word-list.md`. It holds the project words that are already decided.
4. `.claude/rules/evaluate-the-owners-request.md`. Every agent in this repository follows it.

## What the owner said after the readers started

The owner, Mike, was shown this example for the heading rule: write "How to ask the owner", not "Owner interaction protocol". His reply, 2026-10-08: "'how to ask the owner' doesn't give enough context. Idk what that means looking at it. But I do get a sense for owner interaction protocol".

So a heading passes only when a reader who sees the heading alone knows what the section holds. A plain heading that is too short to say that fails. Test every heading a reader proposes against this, and write a fuller heading where one fails.

## What to check

Open the cited file and line for everything you check. Never judge a finding from the findings file alone.

1. Every High finding. Is the problem real? Is it High, as `BRIEF.md` defines High?
2. Every entry under "Patterns". Count the cases yourself with a search, and correct the count. Say whether the pattern is real.
3. Every file with the verdict "needs a rewrite". Read the file. Do you agree with the verdict?
4. Every proposal under "Layout", and every proposed heading anywhere in the findings. Apply the heading test above.
5. Every "question for the owner" and every place where the reader wrote that it was unsure. Try to answer it from the repository. You may open any file in the worktree for this, including code, tests, and `dev/`. Say which questions you answered and what the answer is, and which ones only the owner can answer.
6. The Medium findings. Check every Medium finding in the five files that the reader's report names as needing the most work. In the other files, check enough Medium findings to judge whether the reader is reliable there, and say how many you checked.

For each finding you check, also check the rewrite the reader proposed:

- Does it keep every rule, limit, name, number, and exact string?
- Is a string it changes read by a tool, a hook, a test, or another file? Search for the string before you answer.
- Does it follow the standard? A rewrite may be longer than the text it replaces.
- Does it remove words that the sentence needs? On 2026-10-06 the owner found the skill text "squeezed too short", so a rewrite that squeezes a sentence fails.

## The verdict for each finding you check

- Confirmed: the problem is real and the rewrite is safe to use.
- Confirmed, rewrite needs work: the problem is real, and you say what is wrong with the rewrite and give a better one.
- Not a problem: say why in one sentence.
- Wrong level: say which level it should have.

## What to write

Write one file: `dev/reviews/2026-10-08-wording-scan/checked-<your name>.md`. Use this layout.

1. `# Wording scan check: <the areas you checked>`
2. `## How reliable the readers were`: for each area, how many findings you checked, how many you confirmed, and how many were not a problem. Say in one sentence whether the unchecked Medium findings in that area can be trusted.
3. `## High findings`: each one with your verdict.
4. `## Patterns`: each one with the corrected count, three examples as `path:line`, and your verdict.
5. `## Files that need a rewrite`: each one with your verdict and the reason.
6. `## Headings and layout`: each proposed heading that fails the heading test, with a fuller heading.
7. `## Questions answered from the repository`: the question, the answer, and the file and line that give it.
8. `## Questions only the owner can answer`: each as one plain question that the owner can answer without opening a file, with the choice it leads to.
9. `## Findings that are not a problem or have an unsafe rewrite`: the finding's ID or `path:line`, and the reason.
10. `## What the readers missed`: anything serious you saw while checking that no finding covers. Do not search for these; report only what you met.

Follow the standard in your own check file.

## Limits

- Change no file except your check file. Run no command that changes the repository, and no `git` command other than ones that only read.
- Do not start other agents.
- Your last message is a short report: how reliable each reader was, the High findings that stand, the strongest patterns with corrected counts, the questions only the owner can answer, and anything you could not check. The detail stays in your file.

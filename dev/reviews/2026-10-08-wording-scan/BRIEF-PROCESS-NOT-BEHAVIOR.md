# Second pass: instructions that script the agent instead of stating the process

This brief is for a reader who has already read one area of the shipped instruction files for the wording scan. You now go through the same files again with one different question. You change no file except your own findings file for this pass.

## What the owner asked for

Mike, the owner, 2026-10-08: "the auditors should try to find places where the instructions, skills, etc, do more than define the owners processes and procedures and that the agent should abide by those procedures and processes, etc. what I don't want is to have instructions where we are hardcoding things that tell the agent how to think or behave if that makes sense. There are some edge cases like the local memory system has some trigger words I think but those are like insurance trigger words. They aren't the only things that can start the process".

He has said the same before. These are his words, from `AGENTS.md` in the root of this repository, section "Three instructions for text that tells an agent what to do":

- "We're really just trying to define what our process is and make sure the agent follows our process, rather than trying to define the behavior of an agent."
- His example of what not to write: "when the user says the phrase 'what do you think' that means they want you to reason about the question".
- About a rule that defined a small work item as "at most one phase, one or two tasks": "Why are we hardcoding the number of tasks to determine whether it is small? ... We cannot be solutioning and desiging like this where are processes are so rigid and limiting the agent's reasoning".

Read that section of `AGENTS.md` before you start.

## The test for every instruction

An instruction passes when it does one of these:

- It states a step of the owner's process, the order of the steps, or who does a step.
- It says where a kind of information is kept, or what form a record has.
- It says what must be true when a job is done.
- It says when the owner decides and what the owner is asked.
- It states a limit that protects something, such as "never deploy to production".
- It gives exact words that the owner or a tool must see.
- It states a fact about a tool, such as a size limit of a host.

An instruction is a finding when it does one of these:

1. It tells the agent how to think, reason, weigh, or interpret, instead of saying what the process is. Examples of the kind: "think carefully about", "consider whether", "be thorough", and a sentence that maps the owner's phrase to a meaning.
2. It gives a sentence, a row, or a bullet for one small situation, where one general rule or the goal would cover it. A table of situations and a list of cases are the usual forms.
3. It puts a count, a limit, or a threshold where the agent should judge. Ask of each number: is it a fact, the form of a record, or a protection? Then it passes. Does it stand in for a judgment, such as how big "small" is or how many options to give? Then it is a finding.
4. It lists phrases or words that start a process, and the text reads as if only those phrases start it. A phrase list passes when the same text also states the general condition, so that the phrases are examples or a safety net. The owner calls these "insurance trigger words". The reminder hook `prompt-reminder.mjs` is the known case: its phrases only add a hint, and the root guide states the general goal. Check whether that is true where you meet a phrase list, and say what you found.
5. It tells the agent to do what a capable agent does without being told, and it carries no fact about this project's process.

When you are not sure which side an instruction is on, report it and mark it "borderline". The owner decides the borderline ones.

## What to leave alone

- The owner's approved texts: `evaluate-the-owners-request.md`, `document-clarity-standard.md`, the section "Your job as the agent" in the starter root `AGENTS.md`, `salesforce-org-safety.md`, the body of `sf-architect-solutioning`, and any quotation of the owner. Report nothing in them for this pass.
- The writing rules and the output style. They set the form of what the agent writes, which is part of the process.
- Skill descriptions. Their "Use when" sentences exist so that a host can pick the skill.
- Copies. Review the source only.

## Why each finding needs care

Some of this text is there because a live test showed that the agent got something wrong without it. So you propose, and nothing is removed on your word. For each finding, say what the text protects, if you can tell.

## What to write

Write one file: `dev/reviews/2026-10-08-wording-scan/<your area name>-process-not-behavior.md`. Use this layout.

1. `# Instructions that script the agent: <area name>`
2. `## Summary`: the count of findings by kind (1 to 5 above) and how many are borderline. Then the three files with the most findings.
3. `## Findings`: grouped by file. Each entry holds:
   - the file and line, as `path:line`;
   - the text, quoted, at most three sentences;
   - the kind, 1 to 5, and "borderline" when you are not sure;
   - why it scripts the agent instead of stating the process, in one sentence;
   - what the text seems to protect, in one sentence, or "cannot tell";
   - what you propose: remove it, or replace it with a general rule or a statement of the goal (give the words), or keep it and say why.
4. `## Phrase lists and trigger words`: every list of phrases or words that starts a process, where it is, whether the general condition is also stated, and where.
5. `## Numbers`: every count, limit, or threshold in your area that you judged a fact, a form, or a protection, in one line each, so that the owner can see what you passed and why. Group identical ones.

Follow `document-clarity-standard.md` in your own file.

## Limits

- Change no file except your findings file for this pass. Do not change your first findings file. Run no command that changes the repository.
- Do not start other agents.
- Open a file again when you need its exact lines. Do not rely on memory for a quotation or a line number.
- Your last message is a short report: the counts by kind, the three files with the most findings, the phrase lists you found and whether each has its general condition, and anything you were unsure about.

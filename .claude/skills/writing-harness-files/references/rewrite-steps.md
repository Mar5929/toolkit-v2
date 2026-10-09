# Rewriting a file that exists

This file gives the steps for rewriting a skill, a rule, or an agent guide (`AGENTS.md` or `CLAUDE.md`) that is hard to follow. Use it when the job is to make a file clearer, and not to change what the file requires. The job is done when a reader who opens the new file alone can follow it after one read, and when the checks in steps 6 to 8 show that the new file requires exactly what the old file required.

The writing rule holds the writing rules, which say how to write. `SKILL.md`, step 5, says which file is the writing rule: the project's own rule file when the project holds one, and `references/writing-rule.md` in any other folder. This file says how to work and how the work is checked.

## Contents

- Before you start
- The steps
- When to stop and ask the owner
- When no helper agent can be started
- A prompt for a team

## Before you start

Do steps 1 to 4 of `SKILL.md` first: name the kind of file, get the current official guidance, open the checklist, and read the project's own rules. Step 4 of `SKILL.md` asks you to match the form of two existing files. In a rewrite, that means their file names, their locations, and their front matter. Their wording and their order do not bind you. The steps below take the place of steps 5 to 7 of `SKILL.md`.

When the project requires the owner's yes before a rule, a skill, or a hook changes, get that yes before step 4 below. Show the owner the file's word list from step 2 with the request, because the list names the words that the owner will no longer see.

## The steps

1. Read the whole file, and every file it sends the reader to. Then answer one question in a few lines of your own: what must the reader know, and what must the reader do? The rewrite starts from that answer, not from the old lines.
2. Decide what happens to each made-up word in the file. For each made-up word, make the choice that the writing rule, section "Words and names", gives.
   - Write down each choice: the word, the choice, and the text that takes the word's place. This list is the file's word list.
   - The following example shows what one row of the word list holds. The word is "original". The choice is a name the reader can already see, which is "source", from the folder name `sources/`. The old sentence is "An original is always filed here, in `sources/`, whether one work item uses it, several do, or none does yet." The text that takes its place is "File every document or message that the project receives from someone, unchanged, in `sources/`, whether one work item uses it, several do, or none does yet. A file in `sources/` is called a source."
   - Search the project for each word. When another skill, a rule, an agent guide, or a message that a hook prints also uses the word, the choice reaches past this file. Put it on the shared word list.
   - The shared word list is one file for the whole rewrite. It has one row per word: the word, the files that use it, the choice, and the text that takes the word's place. The project's root `AGENTS.md` or the brief says where the list is kept. When neither does, ask the owner where to keep it.
   - Read the shared word list before you choose. When a word is already on it, use the choice it gives.
3. Write an inventory of the old file before you change it. The inventory is a list of everything the file requires:
   - every rule;
   - every limit and number;
   - every exact string in quotation marks or backticks;
   - every name the file uses: of a file, a folder, a skill, a section, a field, or a status;
   - every place where the file sends the reader to another skill or file for part of the job;
   - every heading of the file that another file cites, with the files that cite it. Search for each heading to find them.
4. Write the new file to the writing rule.
5. Update every file that cites a heading you renamed or uses a word you replaced. Do it in the same change, so that no file points to a name that is gone.
6. Check each line of the inventory against the new file.
   - Every rule, limit, and number must still be there, with the same meaning.
   - Every exact string that a tool or another file reads must be unchanged: a command, a file or folder name, a field name or value, the form of an ID, a status, and the words the owner must see.
   - Beside a word that the file's word list replaced, write the text that took its place.
7. Have a separate agent, which did not write the new file, compare the old file with the new file. Give it the inventory.
   - It reports every rule, limit, number, or exact string that was lost, added, weakened, or strengthened.
   - It also checks the new file against each line of the writing rule, and reports each line that the new file does not follow.
   - These are not additions: the opening, plain words in place of a made-up word, a bullet that was split into a main rule and its special cases, a reason that the project's files or the owner state, and a sentence that says what is in another file.
   - Correct each thing it reports, and have it read the correction.
8. Test the file on a reader that knows nothing about the subject. Use a helper agent that is given only the project's root `AGENTS.md` and the file. For a reference file of a skill, the helper also gets that skill's `SKILL.md`, because a reader opens `SKILL.md` first.
   - Give the old version to one such helper and the new version to another, so that neither has seen the other text.
   - Ask each one what it would do in three to five situations that the file covers, and which words or sentences it could not follow without guessing.
   - The actions for the old version and for the new version must match. Where they differ, the rewrite changed a rule: correct the new file and ask again.
   - Rewrite each word or sentence that the reader of the new version could not follow.
9. Check the file the way the checklist section says under "Check" (step 6 of `SKILL.md`). Then tell the owner what step 8 of `SKILL.md` asks for, and also: each word you replaced and what replaced it, each heading you renamed, each other file you updated, and each question you could not answer without deciding what a sentence means.

## When to stop and ask the owner

A rewrite never decides what a file requires. In each case below, stop and ask the owner. Give the file, the line, and your recommendation.

- Take what the file is for from text that exists, such as the part of a skill's description that follows ", so". When no text states what the file is for, ask the owner. Never invent a goal.
- When an instruction looks arbitrary and neither the project's files nor the owner's words give its reason, ask the owner. Never invent a reason.
- When you cannot make a sentence clear without deciding what it means, ask the owner.
- When two files say different things, ask the owner which one is right.
- When a rule has a case that the file does not cover, and that case can happen, ask the owner. Never make up the rule for that case.

## When no helper agent can be started

When the product you work in cannot start a helper agent, do steps 7 and 8 of this file yourself, and tell the owner that no separate agent checked the rewrite.

## A prompt for a team

Use this prompt when several agents rewrite many files. Fill in each part in angle brackets. The prompt is short because it sends each writer to the writing rule and to the steps above.

```text
Rewrite the files listed below so that a person who opens one file alone can
follow it after one read. You may change the words, the order, the sections,
and the headings. You change nothing that a file requires.

The readers are an agent that has just loaded the file, and the owner, who
may not be a developer.

Read first, in the writing-harness-files skill:
- the writing rule, which says how to write: the project's own file
  .claude/rules/document-clarity-standard.md when the project holds
  it, and references/writing-rule.md in any other folder.
- references/rewrite-steps.md: how to work on one file, and how the work is
  checked.
Follow both for every file.

Files, in this order: <list, hardest to follow first>
Shared word list: <path>. Use the choice it gives for each word. When you
meet a made-up word that other files use and that is not on the list, add
it with your proposal, and tell the agent that gave you this prompt before
you use it.
Do not change: <files that are the owner's own text; copies whose source is
another file, which are changed at the source>

Stop and ask the owner in each case that the rewrite steps list under "When
to stop and ask the owner". Do not guess.

Hand back for each file: the old text and the new text, the inventory with
each line checked, every other file you updated because it cited a heading
or a word you changed, your questions for the owner, and the results of
<the project's checks>. <The project's rules for branches and commits.>
Commit nothing before both checks of the rewrite steps (steps 7 and 8) pass.
```

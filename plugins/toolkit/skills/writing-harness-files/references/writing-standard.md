# Writing standard for instruction files

This file is the long form of the writing standard for a file that someone follows or relies on later: a skill, a reference file of a skill, a rule, an agent guide (`AGENTS.md` or `CLAUDE.md`), a helper-agent brief, and a project document such as requirements or a design. Open it at step 5 of `SKILL.md`, before you write, and whenever you rewrite a file that exists.

The standard is met when a reader who opens the file alone can say what the file is for and can follow every instruction after one read, and when the file still requires exactly what it required before.

The short form of this standard is the rule `.claude/rules/write-for-the-reader.md`, which `project-setup` gives every project. This file explains each line of that rule and gives the reason and an example.

- "Start from the whole file" below explains the first line under "A file that someone follows later" in the rule.
- Points 1 to 9 explain the nine lines under "For everything this rule covers", in the same order.
- Points 10 to 15 explain the other six lines under "A file that someone follows later", in the same order.

The rule also has lines for something made for a person to look at, such as a diagram or a report. This file does not repeat those lines.

## Contents

- Who reads the file
- Start from the whole file
- The words
  - 1. Use common words, and one name for one thing
  - 2. Use the real name, never a picture word
  - 3. Say a thing in plain words before you give it a name
  - 4. Write whole sentences, with one idea or two that belong together
  - 5. Put the main point first
  - 6. Be specific
  - 7. Short means no sentence the reader does not need
  - 8. Write about the subject, not about the file or the chat
  - 9. Keep every fact exactly as it is
- The file
  - 10. Open with what the file is for and what must be true when its job is done
  - 11. Give each instruction its own sentence, and the main rule first
  - 12. Decide whether an instruction is exact or general
  - 13. A pointer says what is in the other file and when to open it
  - 14. Give the reason when an instruction would look arbitrary
  - 15. Regroup and rename freely, and change nothing that the file requires
- Forms that work well
- When this file and the rule differ
- Check before you hand the file back

## Who reads the file

Two readers open each file, and each opens it alone. Neither was in the chat that produced the file, and neither can ask what a word means.

- An agent that has just loaded the file. It knows the project's root `AGENTS.md` and nothing else about this subject.
- The owner, who is the person the agent works for. He may not be a developer. He must be able to read the file once, say what it does, and change a line himself.

The test for every file is one question: can each of them say what the file is for, and follow every instruction, without opening another file to find out what a word or a sentence means? Opening another file to get more detail is fine. Opening another file to work out what a sentence means is not.

## Start from the whole file

Before you write a sentence, answer one question about the whole file: what must the reader know, and what must the reader do? Then write that in the plainest order and the plainest words.

Do not repair a file line by line. A file that is hard to follow is rarely hard because of single lines. It is hard because it is built around words and groupings that made sense to its writers. A repair keeps those words and groupings and adds explanations to them, so the file gets longer and stays hard. For example, a repair keeps a made-up word and puts a definition in front of it, where plain words would have needed no definition (point 3).

So you may change the order of the file, split a section that holds too much, merge two sections that say one thing, and rename a heading. Point 15 says what stays word for word, and which checks prove that the file still requires the same.

## The words

### 1. Use common words, and one name for one thing

Use the word most people would use. Call a tool, a command, a file, a field, or a skill by the exact name the system uses, and use that name every time. A reader takes a new word for a new thing, so two names for one thing make the reader look for a difference that is not there. The official skill best practices page asks for the same under "Use consistent terminology".

Before:

> Open the work item and read its history. Then update the ticket's status.

After:

> Open the work item and read its history. Then update the work item's status.

### 2. Use the real name, never a picture word

A picture word stands for a thing by comparing it to something else, for example "lever" for a setting. The reader has to translate it back, and a reader who does not know the system cannot. Idioms and jokes fail in the same way.

Before:

> Access flows up to the manager.

After:

> A manager gets access to the projects of the manager's own team.

### 3. Say a thing in plain words before you give it a name

Use plain words for a thing first, and give the thing a name only when the file needs one. The words to look for are the made-up ones. Test each word against a dictionary. A word is made up in either of two cases:

- A dictionary does not have the word. The writers of the project built it, for example by joining two words.
- A dictionary has the word, and the word has a meaning of its own only in this project. Such a word looks ordinary, for example home, pointer, concept, and record. A reader takes the word in its everyday sense and gets the instruction wrong.

A definition in front of a made-up word does not solve the problem, because the reader still has to learn the word and remember it.

For each made-up word, try these three things in this order, and stop at the first one that works:

1. Say the thing in plain words, and use no name for it.
2. When the thing does need a name, because the file refers to it many times, use a name the reader can already see: a folder name, a file name, a field name, or the prefix of an ID.
3. Only when neither works, keep the made-up word. Explain it once, where the reader first meets it, in one clause with an example. In a skill, that place is normally `SKILL.md`, because the reader opens it before any reference file. After that, use the word alone.

Before:

> An original is always filed here, in `sources/`, whether one work item uses it, several do, or none does yet.

After:

> File every document or message that the project receives from someone, unchanged, in `sources/`, whether one work item uses it, several do, or none does yet. A file in `sources/` is called a source.

The first sentence of the "After" text uses plain words (step 1). The second gives the thing a name that the reader can see in the folder name (step 2). The made-up word is gone, and no definition is needed.

The next line is an example of step 3, for a word that is kept:

> Current State is the one short page that says what is true in the project now, for example which work is in progress and what waits on the owner.

A word is often used in more than one file: in other skills, in rules, in an agent guide, or in a message that a hook prints. Do not decide alone for such a word. Its choice goes on the shared word list that `references/rewrite-steps.md`, step 2, describes, so that every file changes in the same way.

Do not explain general knowledge, such as what a commit or a table is.

### 4. Write whole sentences, with one idea or two that belong together

Keep the subject, the verb, and the condition of every sentence. Write a condition as "When ..., do ...". A label and a colon is not a sentence: the colon stands where the verb should be, and the reader has to guess what to do.

A sentence holds one idea, or two ideas that belong together. Two ideas belong together when the reader needs both to act on either one, for example a condition and its instruction, or an instruction and its reason. A third idea starts a new sentence. A reader who reads once keeps one or two ideas and loses the third. The "Before" text under point 11 opens with one sentence that holds five ideas: which session the rule is for, where that session reads and writes `DECISIONS.md`, `sources/`, and `system/`, what the save worktree is, where the session must not work, and the reason. The "After" text gives the same ideas in three sentences, with no more than two ideas in each.

Before:

> A save that failed: start the reply with "Not saved", and name the write.

After:

> When a save fails, start your reply with "Not saved" and name the write that failed.

A colon is still right in two places: where a whole sentence introduces a list, an example, or exact text, and in a list where each line starts with the name that the line describes.

In a table that is plainly a lookup, with the situation on one side and the action on the other, a short entry such as the name of a step or a file is right.

### 5. Put the main point first

A paragraph or a section starts with the sentence that states its point: the instruction, the answer, or the fact that the other sentences explain. What supports the point comes after it, such as the reason, the background, and a side fact. A reader who reads only the first sentence then still gets the point, and a reader who reads on knows what the other sentences are for.

Before:

> This also searches `CURRENT_STATE.md`. `memory/` is only in the main checkout, so the host's own search tool misses it from a worktree: use this command.

After:

> Search memory by topic with the command above, and not with the host's own search tool. `memory/` is only in the main checkout, so the host's search tool misses `memory/` from a worktree. The command also searches `CURRENT_STATE.md`.

The "Before" text gives a side fact, then the reason, and ends with its point, "use this command". The "After" text starts with the point.

Two later points apply the same order to larger parts. Point 10 puts what the file is for at the top of the file. Point 11 puts the main rule before its special cases.

### 6. Be specific

Name the thing, the person, or the number that the sentence is about. Write "the save failed because the file was locked", not "there were problems". A reader who opens the file alone cannot ask which problems, which file, or how many.

Never write "this" or "that" without the word it stands for. Write "this command" or "that reply". When "this" or "that" stands alone, the reader has to search the earlier sentences for the thing it stands for, and two readers can choose two different things.

Before:

> The parent call fails with "No parent issue found" (HTTP 404) when the issue is top level. That is an answer, not an error.

After:

> The parent call fails with "No parent issue found" (HTTP 404) when the issue is top level. That reply tells you that the issue has no parent. Do not treat the reply as an error.

The "After" text gives "That" the word it stands for, and says which answer the reply gives.

Specific does not mean narrow. When an instruction covers a class of cases, name the class in exact words and mark each example as an example (point 12).

### 7. Short means no sentence the reader does not need

Short is about whole sentences. Write what the reader needs in order to act: what the file is for, the instruction, and the reason where the instruction would look arbitrary. Remove a sentence that repeats another, narrates what is happening, or states general knowledge. Short never means fewer words inside a sentence that stays. When clear and short disagree, choose clear.

The official skill best practices page says "Only add context Claude doesn't already have", under the heading that tells the writer to be concise. This standard follows that page. The page's own examples of what to leave out are general knowledge, such as what a PDF is. What a project means by one of its own words is context that the agent does not already have, so plain words for it, or one clause that explains it, is what the page asks for. Concise means that the file leaves out the sentences the reader does not need. It does not mean that words are taken out of a sentence that stays.

A file that is written to this standard is often longer than the file it replaces. The length is right when it comes from the opening, from plain words in place of a made-up word, from a bullet that held several rules and became a main rule and its special cases, from a reason that the project's files or the owner state, and from a sentence that says what is in another file. Check each sentence against one question: does it tell the reader something the reader needs in order to act? Remove a sentence that does not. For example, remove "This section gives the steps." under the heading "Steps". The opening of the file is never such a sentence (point 10).

### 8. Write about the subject, not about the file or the chat

Every sentence says something about the job the reader has to do. A sentence about how the file came to be, or about the chat that produced it, tells the reader nothing to act on.

The opening is not such a sentence. The opening says what the file is for and what must be true when its job is done, and the reader needs both. It always stays (point 10).

Three kinds of sentence do go:

- A sentence that narrates, for example "This section walks through the process."
- A note for the authors of the file. A rule about what a skill may contain, or the history of a design, belongs where the authors keep their own rules. In the file that the reader follows, state the result as an instruction.
- A quotation from the chat that the reader cannot place. Quote the chat only when the exact words are the fact, and then say who said them and when.

Before:

> It never says where items are saved. For every read and every save, use `using-work-tracker`.

After:

> For every read and every save of a work item, use `using-work-tracker`.

When the agent needs a fact about a past decision in order to act or to answer the owner, keep that fact, for example "the checker always runs, as the owner decided".

### 9. Keep every fact exactly as it is

A number, a name, a date, and a quotation stay exactly as they are when the wording around them changes. A reader who finds one changed value can no longer rely on the others.

## The file

### 10. Open with what the file is for and what must be true when its job is done

The first lines say what the file does and what must be true when its job is done. A reader who knows the goal can handle a case that the steps do not name, and the owner can tell at once whether he opened the right file. Take the goal from text that exists, such as the part of a skill's description that follows ", so". Do not invent a goal. When no text states a goal, ask the owner.

When another skill or file does a neighbouring job, say in one sentence which one does which part. When no neighbour exists, leave this sentence out.

Write the opening for the person who uses the file. A sentence about what the file "holds" or "never says" is a note for the authors (point 8). Say what the skill does instead.

Before:

> This skill holds the process: what is worth keeping, when to ask the owner, and how to decide. It never says where memory is kept.

After:

> This skill decides what goes into project memory, when the owner must approve a save first, and when a memory is corrected, retired, or deleted. The goal is that project memory stays true, so a later session can rely on it. This skill only decides. To read or write memory, use `using-memory-store`, which knows where this project keeps its memory.

A reference file opens in the same way, in one or two sentences: what it covers, when it applies, and what must be true when its job is done.

### 11. Give each instruction its own sentence, and the main rule first

Each instruction is one sentence that says who does what, and when. Each instruction has one meaning: a reader who reads it twice does the same thing both times.

Check two things in each instruction:

- The subject of the sentence is the one who does the action. Write "The agent saves the file", not "The file is saved". A sentence that leaves out the one who acts lets the reader think that a tool or another person does the action. A sentence that tells the reader what to do, such as "Save the file", already names the reader as the one who acts.
- The condition comes before the instruction. Write "When a save fails, start your reply with 'Not saved'", not "Start your reply with 'Not saved' when a save fails". The reader then knows whether the instruction applies before reading what to do. A limit that starts with "only when" may follow the instruction, as in "Quote the chat only when the exact words are the fact".

When one point needs several rules, give the main rule first. Then give each special case on its own line, as a bullet under the main rule. The reader sees the normal case first and can find the special case that applies.

Before:

> A session whose folder is not the main checkout reads and writes `DECISIONS.md`, `sources/`, and `system/` only in the save worktree that `publish-docs` makes from the default branch, never in its own worktree: its own branch can lack records the default branch holds. When no save worktree is there, do steps 1 to 3 of `publish-docs` before you read or write a record. Where a step says to save, go on from step 4 of `publish-docs`.

After:

> When this session works in its own worktree and not in the main checkout, read and write `DECISIONS.md`, `sources/`, and `system/` only in the save worktree. The save worktree is the temporary folder that `publish-docs` makes from the default branch. Do not use the copies in your own worktree, because your branch can lack records that the default branch holds.
>
> - When no save worktree exists yet, do steps 1 to 3 of `publish-docs` before you read or write a record.
> - Where a step in this skill says to save, continue from step 4 of `publish-docs`.

A table cell can hold several rules in the same way. When one cell holds a main rule and its special cases, keep the main rule in the cell as one whole sentence. Move the special cases into rows of their own, or into a short list under the table that names the row. Never make such a cell fit by taking words out of its sentences.

When you write a new file and a rule has a case that the file does not cover, and that case can happen, give that case a sentence or a bullet of its own. Never add another clause to the same sentence. When you rewrite a file and find such a case, do not make up the rule for it: ask the owner (point 15).

### 12. Decide whether an instruction is exact or general

Decide for each instruction which of the two it is.

- **Exact.** An instruction is exact when a different word or value would break something: a command, a name (of a file, a folder, a field, or a skill), a number or a limit, the form of an ID, the words the owner must see, the order of steps, or a point where the agent stops for the owner's yes. Keep these word for word, in backticks or quotation marks. Where it is not obvious, say that the text is exact, for example: The reply's last line is exactly "Do you approve this result?".
- **General.** An instruction is general when it covers a class of cases. State the rule in one sentence. Then give two or three examples marked "for example"; "such as" marks an example in the same way. The mark tells the reader that the examples are not the whole rule, as in "A document arrived, such as a transcript, a meeting note, or an email". When a list is complete, say so, as in "A record is one of four kinds".

### 13. A pointer says what is in the other file and when to open it

State each instruction in one file. When a second file needs it, point to the first with a full sentence. Say what the reader will find there and when to open it. Give the file path and the section name exactly as they are now, so the reader can find the place. Do not copy the rule into the second file, and never leave a file name where the instruction should be.

Before:

> Find a fact's home first: `references/memory-criteria.md`, "Find the fact's home first".

After:

> Before you save a fact, check whether another file is the place for it. `references/memory-criteria.md`, section "Find the fact's home first", lists the kinds of fact that never go in memory and the file each one goes in.

A row of a References table is already such a sentence when it says when to open the file. So is a row of a table that names the skill for each job.

### 14. Give the reason when an instruction would look arbitrary

One clause is enough, as in "Read the file fresh, because the owner edits these files by hand." A reader who knows the reason applies the rule correctly to a case that the text does not name. A plain mechanical step needs no reason.

Give a reason that the project's files or the owner state. Never invent one. When an instruction looks arbitrary and you cannot find its reason, ask the owner.

The Claude Code skill page tells the writer to state what to do and not to narrate how or why. One reason clause is not narration. Give the instruction, add the reason where it helps, and do not tell the reader how to think.

### 15. Regroup and rename freely, and change nothing that the file requires

A rewrite may change the order of a file, its sections, its headings, and its words. It never changes what the file requires.

Two things keep the requirements the same.

The first is that an exact string that a tool or another file reads stays word for word: a command, a file or folder name, a field name or value, the form of an ID, a status, and the words the owner must see.

The second is the set of checks in `references/rewrite-steps.md`, steps 6 to 8. Before the rewrite, the writer lists everything the file requires. After it, a separate agent compares the old file with the new one. Then two helper agents that know nothing about the subject each act on one version, and their actions must match. These checks protect the rules. A limit on what the writer may touch does not: it only keeps a hard file hard.

Two duties come with this freedom:

- When you rename a heading or replace a word, update every file that cites that heading or uses that word, in the same change. Search for it first.
- When you cannot make a sentence clear without deciding what it means, do not decide. Ask the owner, and give the file, the line, and your recommendation. Do the same when two files say different things.

## Forms that work well

Use these forms where they fit: numbered steps for an order of actions; a table for "this happened, do that"; a References table that says when to open each file; and a section, often headed "Gotchas", for the facts that break a reasonable guess. The limits on frontmatter, descriptions, and file length that the checklist gives always apply.

## When this file and the rule differ

This file and the rule `.claude/rules/write-for-the-reader.md` say the same thing at two lengths. Where they differ, follow the rule, and tell the owner what differs so that this file can be corrected.

## Check before you hand the file back

1. Do the first lines say what the file is for and what must be true when its job is done?
2. Is every thing said in plain words or with a name the reader can see? Did you test each word against a dictionary? Is each made-up word that was kept explained once, where the reader first meets it?
3. Is every sentence whole, and does it hold one idea, or two that belong together?
4. Does every paragraph and every section start with the sentence that states its point?
5. Does every sentence name the thing, the person, or the number it is about, and does every "this" and "that" have the word it stands for?
6. Does every instruction name the one who acts as its subject, and give its condition before the instruction? Does every point with several rules start with its main rule?
7. Does every pointer outside a table say what is in the other file and when to open it?
8. Does the file still require exactly what it required before: no rule, limit, or number lost, added, weakened, or strengthened, and every exact string unchanged?
9. Does one thing have one name in the whole file, and in every other file that names it?
10. Does every file that cited a heading or a word you changed now use the new one?

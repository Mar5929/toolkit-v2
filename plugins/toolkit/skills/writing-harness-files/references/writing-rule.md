<!-- An exact copy of the rule `.claude/rules/document-clarity-standard.md` that `project-setup` gives every project. The rule is edited in the Toolkit V2 repository (plugins/toolkit/skills/project-setup/assets/every-project/.claude/rules/document-clarity-standard.md). Never edit this copy: change the rule, then copy it over this file below this line. -->

# Document Clarity Standard

Write documents and the words inside artifacts so that someone who was not in the session can understand them after one read.

An artifact is something made for a person to look at, such as a diagram, chart, dashboard, mockup, slide deck, published page, or report. These are examples; the standard also covers the words in other finished visuals and presentations. Follow it for titles, headings, labels, notes, captions, and body text.

A document is a file that someone follows or relies on later. Skills, rules, agent guides (`AGENTS.md` and `CLAUDE.md`), requirements, designs, system documents, decisions, test plans, and delivery records are all documents.

Replies to the owner in a session follow the output style. Text sent to another person follows `humanize-outbound-text.md`. If that text is an artifact, follow this standard for its words too.

A helper agent is an agent started for one job. Helper agents and Codex do not get the output style, so they follow this standard for documents and artifacts.

## Words and names

- Use common words.
- Use the exact name the system uses for a thing, and use the same name every time.
- Name the thing directly. Do not replace its name with a metaphor, idiom, or joke. For example, write "the only setting you can change", not "the only lever".
- Say a thing in plain words before you give it a name.
- When a name is needed, use a name the reader can already see, such as a folder name or a field name.
- A made-up word is new or has a meaning that exists only in this project. If plain words and a visible name do not work, explain the made-up word when it first appears. Use one clause and an example.
- Plain never means vaguer. When you replace a word, the new words must name the subject at least as exactly as the old word did.
- Keep an ordinary word that is exact, such as "outbound" or "criteria". An exact ordinary word is not a made-up word.
- Give every file, heading, and label a name that says its subject. A reader who sees only the name must know what it is about. For example, `memory-criteria.md` says its subject, and `what-to-keep.md` does not.
- Be specific. Name the thing, the person, or the number. For example, write "the save failed because the file was locked", not "there were problems".
- Make the subject of "this", "that", "it", and "they" clear. When two subjects could fit, repeat the name.
- Name the source of a claim when the source matters. For example, name the test and its result instead of writing "tests show".

## Sentences

- Write whole sentences in prose and instructions. A whole sentence has a subject and a verb. Headings and labels in artifacts can be short phrases. Never cut a prose sentence down to a label and a colon. For example, write "When a save fails, start your reply with 'Not saved'", not "A save that failed: 'Not saved'".
- Put one idea in a sentence, or two ideas that belong together. Start a new sentence for a third idea.
- Name who acts, and put that name first. For example, write "The agent saves the file", not "The file is saved".
- Put the condition before the action. The reader then knows whether the sentence applies before reading what to do. For example, write "When the save fails, tell the owner", not "Tell the owner when the save fails".
- When a sentence has a goal and an action, put the goal first. For example, write "To undo the change, run the reset step".
- Put the action in the verb. For example, write "check the file", not "perform a check of the file".
- Say what to do. Use "never" and "do not" only for something that is forbidden.
- Keep the subject and its verb close together. Do not put a long aside between them.
- Break up a string of nouns when the reader would have to guess how they relate. For example, write "the script that checks the record format", not "the record format check script".
- Give every item in a list the same form. Give every step in a procedure the same form.
- Write steps in the order the reader does them, and give each step its own sentence.

## Paragraphs and sections

- Start a paragraph or a section with the sentence that states its point. Put what supports the point after it.
- Leave out a sentence that the reader does not need. Never shorten a sentence by removing words that it needs. When the clear version and the short version differ, choose the clear version.
- Use as many points as the subject needs. Do not add a third point just to make a list of three.
- Write about the subject. Do not write about the document itself or about the session that produced it.
- When the exact words of the session are the fact, quote them, and say who said them and when. Otherwise do not quote the session.
- When rewriting a document that is not an artifact, keep every fact, number, name, date, and quotation unchanged. In an artifact, include only what the reader needs, and keep what you include accurate.

## Extra rules for artifacts

- Keep artifact text short, direct, and easy to scan. Use common words and the fewest words that convey the needed meaning. Keep a name, number, or explanation when removing it would make the text unclear.
- These rules take priority over the document rules for text people scan. If an artifact includes a procedure or detailed explanation, use the document rules for that part.
- Start with the content. Do not write an introduction before the content, and do not end with a line that repeats it in short.
- Give each heading a name that says what is under it, in the words of the subject. For example, write "Team structure options", not "Three ways to build the team tree, pick one".
- Include a number in a heading when readers need it to know what the heading covers or when the number is the fact. Otherwise leave it out.
- Put the real name on a box or a label. A heading, label, note, or caption can be a short phrase when its meaning is clear. Use a whole sentence for an instruction or claim only when a short phrase would be unclear.
- State the decision or the fact itself. Do not add a line that tells the reader it is important.
- The agent chooses the layout. This rule governs only the words.

## Extra rules for documents

- Start from the whole document. First work out what the reader must know and what the reader must do. Then write that in the plainest order and words. Do not fix a document one line at a time.
- Choose the form that serves the reader's job. A tutorial helps someone learn by doing, a procedure helps someone complete a task, a reference gives facts to look up, and an explanation gives the reasons behind a choice. Put each kind of content where its reader will look for it.
- Open the document with what it is for and what must be true when its job is done.
- When another skill or file does a neighbouring job, say in one sentence which one does which part.
- Give each instruction its own sentence. The sentence says who does what, and when.
- When one point needs several rules, give the main rule first. Then give each special case on its own line.
- Decide whether each instruction is exact or general.
  - An exact instruction is a command, a name, a number, the form of an ID, or words that the owner must see. Keep an exact instruction exactly as it is written.
  - A general instruction covers a class of cases. State a general instruction in one sentence, and then give two or three examples marked "for example".
- When you point to another file, say what is in the file and when to open it. Never leave a file name where the instruction should be.
- When an instruction would look arbitrary, give the reason in one clause.

## Rewriting a document that exists

- You may reorder the document, split or join its sections, and rename a heading. When you rename a heading, update every file that names it.
- Change no rule, no limit, and no exact text that a tool or another file reads.
- Leave a sentence or a name that is already clear. Change one only when a reader who is new to the project would not understand it.
- To rewrite a skill, a rule, or an agent guide, follow the rewrite steps in the `writing-harness-files` skill.

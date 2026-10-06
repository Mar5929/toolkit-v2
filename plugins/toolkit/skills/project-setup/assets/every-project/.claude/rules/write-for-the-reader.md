# Write for a Reader Who Was Not in the Chat

This rule covers two kinds of writing:

- **Something made for a person to look at:** a diagram, a chart, a dashboard, a mockup, a slide deck, a published page, or a report. It covers the words inside it: the title, headings, labels, notes, captions, and body text.
- **A file that someone follows or relies on later:** a skill, a rule, an agent guide, requirements, a design, a system document, a decision, a test plan, or a delivery record.

It does not cover chat replies to the owner, which follow the output style, or text sent to another person, which follows `humanize-outbound-text.md`.

The reader opens the result alone. The reader was not in this chat and cannot ask what a word means. Helper agents and Codex do not get the output style, so this rule states it for them. Where this rule and the active style file differ, the style file wins.

## For everything this rule covers

- Use common words, and the exact name the system uses, the same every time.
- Never use a picture word, an idiom, or a joke in place of the real name. Write "the only setting you can change", not "the only lever".
- Say a thing in plain words before you give it a name. When a name is needed, use one the reader can already see, such as a folder name or a field name. Keep a made-up word only when both fail, and then explain it once, where it first appears, in one clause with an example.
- Write whole sentences, one idea each. Never cut a sentence down to a label and a colon. Write "When a save fails, start your reply with 'Not saved'", not "A save that failed: 'Not saved'".
- Short means no sentence the reader does not need. It never means fewer words inside a sentence that stays. When clear and short disagree, choose clear.
- Write about the subject, not about the document or the chat that produced it. Quote the chat only when the exact words are the fact, and then say who said them and when.
- Keep every fact, number, name, date, and quotation exactly as it is.

## Something made to look at

- Start with the content. No preamble, and no closing line that sums up.
- A heading names what is under it, in the words of the subject. Write "Team structure options", not "Three ways to build the team tree, pick one". Put a number in a heading only when the number is the fact.
- A box or a label carries the real name. A label can be a short name. A note or a caption is a whole sentence.
- Do not tell the reader what matters. Write the decision itself.
- Layout is the agent's choice. This rule decides the words.

## A file that someone follows later

- Start from the whole file: what must the reader know and do? Write that in the plainest order and words. Do not repair the file line by line.
- Open with what the file is for and what must be true when its job is done. When another skill or file does a neighbouring job, say in one sentence which one does which part.
- Give each instruction its own sentence that says who does what, and when. When one point needs several rules, give the main rule first and each special case on its own line.
- Decide whether an instruction is exact or general. Exact: a command, a name, a number, the form of an ID, or words the owner must see. Keep these word for word. General: state the rule in one sentence, then give two or three examples marked "for example".
- When you point to another file, say what is in it and when to open it. Never leave a file name where the instruction should be.
- Give the reason in one clause when an instruction would look arbitrary.
- You may regroup the file and rename a heading; update every file that cites it. Change no rule, limit, or exact string that a tool or another file reads.

The `writing-harness-files` skill has longer before-and-after examples and the steps for rewriting a skill, a rule, or an agent guide.

---
name: explain-simply
description: >-
  Re-explains the last answer, a plan, or a named document as short plain bullets, keeping every number, name, and path. Use when the owner types /explain-simply or says "explain it like I'm five", "simpler", "put that in plain bullets", or "I don't get it".
---

# Explain it simply

Rewrite something as short bullets the owner can read once and act on.

1. **Pick what to explain.** Whatever the owner named (a file path, a plan, a
   work item id, a topic). If nothing was named, your own last substantial
   answer in this conversation. If there is no such answer, say so in one line
   and ask what to explain. If the source is a file, read it first.
2. **Bullets only.** One idea per bullet, one line per bullet, in 4 to 6 groups
   under short bold headings. About 25 bullets at most.
3. **Simplify the wording, never the facts.** Every number, name, and path
   stays (full list below).
4. **End with a numbered "What I need from you"** only when there is something
   for the owner to do. No ending when there is nothing.
5. **Do not research again.** Explain what is already established.

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.

## The shape

- No paragraphs anywhere, including under headings.
- If a bullet needs a second line, it is two bullets.
- Each group heading is a short plain phrase, not a label like "Overview" or
  "Summary".
- It fits on one screen.

## The facts that always stay

- Numbers, counts, and dates
- File paths and file names
- People's real names
- Record ids, work item ids, org names, field names
- What is blocked, and what is blocking it
- Anything that costs money, takes time, or cannot be undone

A simple explanation that dropped the numbers is not simpler, only vaguer, and
the owner cannot act on it. If a fact will not fit, keep the fact and cut a
different bullet.

## The words

- No word a general reader would have to look up.
- A technical name that cannot be avoided keeps its exact spelling, and gets
  four plain words right after it saying what it is.
- No jargon the owner did not use first. No figures of speech. No nicknames you
  made up. No bare letters or numbers standing in for a thing ("option B",
  "risk 1").
- No em dashes. No section signs; write "section 7".

## Honesty

- Say plainly when something is unknown, unchecked, or an assumption.
- Say plainly when something failed.
- Never smooth over a gap to make the bullets read better.
- If the source is long and you left things out, say what you left out in one
  bullet rather than dropping it without a word.

## Example shape

```
**The problem**

- The project board has 212 rows.
- Each row is a big chunk of work, one of them 240 hours.
- The release tool wants small pieces, one thing a developer ships on its own.

**The idea**

- Put each board row in as a folder.
- Split it into small pieces and put each piece inside its folder.
- Roughly 100 folders, roughly 400 small pieces.

**The safety rules**

- The target org is live, so I never write to it. You press the button.
- A piece only exists if it points at real proof. No proof, no piece.

What I need from you:

1. Re-export the board with the Item ID column switched on.
2. Say yes to the plan, or tell me what to change.
```

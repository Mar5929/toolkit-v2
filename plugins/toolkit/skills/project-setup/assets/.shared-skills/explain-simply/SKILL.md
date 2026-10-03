---
name: explain-simply
description: 'Re-explains the last answer, a plan, or a named document as short plain bullets, keeping every number, name, and path, so the owner can follow it and no fact is lost. Use when he finds an answer too technical or hard to follow, for example "explain it like I''m five", "simpler", "less jargon", or "I don''t get it".'
---

# Explain it simply

Rewrite something as short bullets the owner can read once and act on.

1. **Pick what to explain.** Whatever the owner named (a file path, a plan, a
   work item id, a topic). If nothing was named, your own most recent answer
   in this conversation that explained or reported something, not one that
   only acknowledged or asked a question. With none, say so in one line and
   ask what to explain. Read a file first. Read a work item by its ID with
   `tracking-work-items`, never by a path.
2. **Bullets only, no paragraphs.** 4 to 6 groups under short bold headings
   that are plain phrases, not "Overview" or "Summary". One idea and one line
   per bullet, 25 bullets at most. If you left part of the source out to fit,
   say in one bullet what you left out.
3. **Simplify the wording, never the facts.** Keep numbers, counts, and
   dates; file paths and names; people's real names; record ids, work item
   ids, org names, and field names; what is blocked and what blocks it; and
   anything that costs money, takes time, or cannot be undone. If a fact will
   not fit, cut a different bullet.
4. **End with a numbered "What I need from you"** only when there is
   something for the owner to do.
5. **Do not research again.** Explain what is already established.
6. **Before you send, check the facts.** Read the source once more: every
   fact of the kinds step 3 lists must be in a bullet, unless it is in a
   part you left out and named under step 2. Add any that is missing.

## The words

- Name the thing itself. "Option B" or "risk 1" alone means nothing to
  someone reading once.
- A technical name keeps its exact spelling, plus up to four plain words
  saying what it is.
- No em dashes. No section signs; write "section 7".

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

- The target org is your live Salesforce system, so I never write to it.
- You make every change there yourself.
- Each piece must link to real proof, or I do not make it.

**What is still unknown**

- The board export has no Item ID column, so I cannot match folders to rows yet.

What I need from you:

1. Re-export the board with the Item ID column switched on.
2. Say yes to the plan, or tell me what to change.
```

## Hand-offs

| For | Use |
| --- | --- |
| Reading a work item by its ID | `tracking-work-items` |

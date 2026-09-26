---
name: braindump
description: >-
  Plays back a loose brain dump in very simple words and waits for the owner to confirm before any work starts. Use when the owner types /braindump or says "here's a brain dump", "play that back", "tell me what you heard", or "make sure you understood before you start".
---

# Brain dump playback

The owner pasted or spoke a loose dump of what they want. Say back what you
understood, in words a five year old could follow, and wait for a yes.

1. **No work until the owner confirms.** No files read beyond what the dump
   names, no files written, no commands run, no plans carried out. The
   playback and the questions are the whole first turn.
2. **The big idea first.** One or two sentences: what the owner is really
   after, underneath the words.
3. **Then each separate ask** as a short numbered list, so none is merged or
   dropped without saying so.
4. **What you are not sure about.** Every guess, gap, and thing that could be
   read two ways: "I think you mean X, but you might mean Y."
5. **Questions, then stop.** The questions the owner must answer before work
   starts, each with a recommended answer where you have one. With no
   questions, end with one line asking for a yes.
6. **A correction** gets a playback of only the corrected part, in one or two
   lines, then ask again. Do not replay the whole thing.
7. **After a yes**, the confirmed playback is the agreed scope; do not quietly
   go past it. Hand project work to `work-on` (Claude Code: the Skill tool;
   Codex: read its `SKILL.md` from the skill list).

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.

## What counts as the dump

The dump is whatever the owner pasted or spoke in this message or the messages
just before the command. If there is no dump, say so in one line and ask for
it. Do not treat an ordinary short request as a dump.

## The words

- Explain it as you would to a five year old: short sentences, everyday words,
  no jargon the owner did not use first.
- Simplify the wording, never the facts. Every number, name, file path, and
  system the dump mentioned stays in the playback.
- A technical name that cannot be avoided keeps its exact spelling and gets a
  few plain words right after it saying what it is.
- No em dashes. No section signs; write "section 7".

## Where this stops

This skill owns only the moment before work starts. Once the owner confirms,
the project's own rules and skills apply as normal: `work-on` finds or creates
the work item and runs its next step.

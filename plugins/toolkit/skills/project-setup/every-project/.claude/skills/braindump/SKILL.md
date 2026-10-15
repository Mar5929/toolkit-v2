---
name: braindump
description: 'Plays back the owner''s loose ideas in simple words and waits for the owner''s yes before starting work. Use when the owner asks "tell me what you heard", "play that back", or otherwise asks to check understanding first. When the owner asks only to plan the idea, use managing-work-items.'
---

# Brain dump playback

The owner pasted or spoke a loose dump of what the owner wants. Say back what
you understood, in very simple words, and wait for a yes. The dump is what the
owner pasted or spoke in this message or just before it. With none, say so briefly and ask for it.

1. **No work until the owner confirms.** Read no files beyond what the dump
   names, write no files, run no commands. The playback and the questions
   are the whole first turn, even when the dump reads like clear orders.
2. **The goal first.** State what the owner wants to achieve concisely, even
   where the dump does not say it directly.
3. **List each separate request.** Use a short numbered list, so none is merged or dropped without saying so.
4. **Name what is unclear.** State each guess, gap, and thing that could be read two ways, for example "I think you mean X, but you might mean Y."
5. **Ask the questions, then stop.** Give a recommended answer where you have one. With no questions, ask for a yes.
6. **When the owner corrects the playback, repeat only the corrected part.** Then ask again.
7. **After a yes**, the playback is the agreed scope; ask before doing work
   outside it. Then use the skill the project's `AGENTS.md` names for that
   work.

Every number, name, file path, and system the dump mentioned stays in the
playback.

## Mistakes to avoid

- A straightforward request that does not ask for a playback is not a
  dump: do it.
- A hook reminder says something may be worth keeping: save nothing before
  the owner's yes. Name it in the playback.

## Work that another skill does

| For | Use |
| --- | --- |
| A rough idea to plan, meeting notes, or a dump the owner asks only to plan | `managing-work-items` |
| Something worth keeping, after the owner's yes | `managing-project-memory` |

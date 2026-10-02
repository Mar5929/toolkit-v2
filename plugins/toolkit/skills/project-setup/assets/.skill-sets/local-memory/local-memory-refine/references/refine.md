# Refining local memory: the steps

Keep memory small and true: Current State first, then merge duplicates, supersede and retire, answer proposals, fix links, check stale files, and propose proven lessons as rules or skills. Plan first, ask, then change. File format and marks: `record-format.md`.

## Contents

- Plan first, then ask
- Current State
- Duplicates and merges
- Proposals waiting for the owner
- Links to work items
- Links between memories
- Stale files
- Wrong home, wrong prefix, or a broken file
- Old `feedback_` files
- The glossary
- Lessons that should become rules or skills
- Writing a project skill
- The owner's rules
- The report

## Plan first, then ask

- Read every file whole, except `MEMORY.md`, `AGENTS.md`, `memory-criteria.md`, and the seeds (`status: template`). Write the plan as one numbered list: each change, its files, and a one-line reason. A contradiction between two files is a question on the list, never settled by date alone.
- Change nothing until he says yes. "Yes to all" covers the list shown; "Yes except 3" leaves 3 alone. His answer often comes in the next turn: open this skill again then, because Codex does not keep a skill across turns.
- Never delete a file: supersede it, retire it, or leave it for him. Two exceptions: a proposal file he said no to, and a file holding a secret or an email address, with his yes on the list and a warning that the delete cannot be undone (`memory/` is not in Git and has no backup).

## Current State

1. Read `memory/CURRENT_STATE.md` and the status of every work item it names (`tracking-work-items`).
2. Remove every line that is no longer true, and tell the owner what was removed (no plan needed): a finished or cancelled item under Now; an answered question under "Waiting on the owner"; a memory proposal he has answered; a to-do that now has a work item (put the item's ID under Now, unless it is already there or the item is Done or Cancelled). A Now line that copies an item's status or next step: cut it to the ID and a few words.
3. Rewrite "Next session starts with" when it is out of date, set "Last updated:", and remove any fill-in guide comment or sample bullet still there.
4. A section still over its limit holds only true lines: put the lines you would cut on the plan. Never cut an open owner to-do to fit: offer him a work item for it instead.

## Duplicates and merges

Two files about the same concept merge into the broader one, or into the older one when neither is broader:

1. Move each section of the other file into the kept one, above `## Gotchas and lessons`, keeping each section's **Evidence and limits**. Move its lessons too, joining the Seen lines of a lesson both hold.
2. Join the two `work_items` lists without repeats, and add the other file to the kept file's `supersedes`.
3. Mark the other file superseded (`record-format.md`, "Proposals, superseded, and retired text"). Update the kept file's `description` and `updated`.
4. Point every link to the other file at the kept file.

Two sections in one file that say the same thing merge into one. Two decision files for the same decision: keep the older, supersede the newer. A concept past about 20 sections or 300 lines: move one sub-topic's sections to a new concept, link the two under **Related memories**, and repoint links.

## Proposals waiting for the owner

Put each on the plan as a yes-or-no question with its one-line reason. His yes: remove the marks and record his approval (`local-memory-save`, "Proposals"). His no: remove the section or the proposal file. Either way, remove the proposal from its Current State line, and the line when no other proposal is left in it.

## Links to work items

- Each `work_items` entry must name an item that exists: a file `<ID>.md` under `work-items/` in the main checkout, or `tracking-work-items` for another tracker. A local item moved by hand keeps its file name, so `[[WI-031]]` still works.
- An item that cannot be found: tell the owner. Plan: take it out of `work_items` and keep its ID under **Authoritative records** with "(not found, <date>)".
- Wrong form (an unquoted entry, or `[[WI-031]]` in a project whose items are in Notion or GitHub): fix it.
- A file clearly about an item but not linked to it: propose the link.

## Links between memories

Check that each link target exists. A missing file: point the link at the right file, or keep its words and drop the link. A superseded file: point it at the replacement. A retired file: add " (retired)" after the link.

## Stale files

A file whose `last_verified` is `unknown` or more than six months old, about something that changes (a vendor, a process, a person's role): check it against its source or ask the owner. Then set `last_verified`, correct it, or retire it.

## Wrong home, wrong prefix, or a broken file

- A section that holds work item status, next steps, undelivered requirements, an item-only decision, or a copy of a requirement or design: propose moving its meaning to the work item, then removing the section.
- A section that is an instruction ("always ...", "never ...", a preference): propose moving it to `.claude/rules/owner-preferences.md`, then removing the section.
- A secret or an email address: remove that text at once and tell the owner. A guess, or a fact he rejected: retire it.
- A wrong prefix: rename the file, update `name` and `metadata.type`, and repoint links.
- A file he changed in Obsidian so that `name` differs from the file name, the type differs from the prefix, the front matter no longer reads, it sits in a subfolder, or its name has no prefix: his edit wins. Tell him what you found, and fix it only with his yes.

## Old `feedback_` files

`feedback_` is retired. For each section of such a file: an instruction goes to `.claude/rules/owner-preferences.md`, ending with `(<date the feedback file was saved>, <owner name>, from memory file feedback_<name>.md)`; a fact goes to a `user_` or `project_` concept. Then set the file's `status: superseded`, start its description with "Moved to the rules and concepts on <date>:", and add the first line under its title: `**Superseded by:** the rules and concepts, on <date>.`

## The glossary

In `memory/terminology-glossary.md`: put on the plan a term with no source, the example row still there, a renamed term with no alias line, or a retired term no file uses any more (remove its row).

## Lessons that should become rules or skills

A lesson has proved itself when its Seen line has two or more sessions, a lesson like it sits in another concept, or the owner confirmed it.

1. Decide where it goes: an instruction followed every time is a rule; a procedure with steps is a project skill.
2. Put it on the plan with the exact words: the rule bullet and its area, or the skill's name and description.
3. After his yes: a rule is one bullet in `.claude/rules/owner-preferences.md` in the words he approved, ending with `(<YYYY-MM-DD of his yes>, <owner name>, from the lesson in memory/<file>)`. A skill: see "Writing a project skill".
4. The lesson gets **Promoted:** `<date>, to <where>` and stays as history.

A fact that is really an instruction ("always check X before Y") is proposed as a rule the same way.

## Writing a project skill

A project skill goes in `.claude/skills/<name>/SKILL.md`. Codex reads `.agents/skills`, which is a link to `.claude/skills`, so one copy serves both. The header holds only `name` and `description`. Add one line for the skill to the skills list in `AGENTS.md`.

## The owner's rules

Read `.claude/rules/owner-preferences.md` and the rules list in `AGENTS.md`. Put on the plan, each with a one-line reason, every bullet that repeats or contradicts another bullet, another rule file, or a line of `AGENTS.md`, or is already enforced by a hook or a setting. Change or remove a bullet only after his yes. A contradiction is a question for him. Never remove a bullet only because it is old.

## The report

One short list for the owner, each line with the file name:

```markdown
Memory refined:
- Current State: removed "WI-002 export fields" (Done) and "Save to memory? Decision WI-004 Q-03" (answered).
- Merged `project_export.md` into `project_exports.md` (superseded).
- Retired `reference_old_dashboard.md`: the dashboard was shut down on 2026-09-20.
- Promoted the lesson "The deploy check needs the VPN" to the project rules (Testing).
- Not changed: the currency-check rule (you said not yet).
```

When he asks how to undo a change, give him the words (for example, "bring back `reference_old_dashboard.md`"). End with the questions still open or, when none is open, the exact words that continue ("Say 'keep going' and I'll <next action>.").

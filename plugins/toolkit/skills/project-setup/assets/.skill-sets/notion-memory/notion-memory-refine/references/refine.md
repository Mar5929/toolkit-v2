# Refining Notion memory: the steps

Keep memory small and true: merge duplicates, supersede and retire, fix links to work items, review proposals, clean Current state, and propose lessons that should become rules or skills. Plan first and change nothing until the owner says yes. A "yes to all" covers the list shown, nothing more.

## Listing every record

```bash
ntn api v1/data_sources/{{MEMORIES_DS}}/query -d '{"sorts":[{"property":"Record Key","direction":"ascending"}],"page_size":100}' < /dev/null | jq -r '.results[] | [.id,
  (.properties["Record Key"].rich_text[0].plain_text // "(no key)"),
  (.properties.Status.select.name // ""),
  (.properties.Kind.select.name // ""),
  (.properties.Saved.date.start // ""),
  (.properties["Last verified"].rich_text[0].plain_text // ""),
  (.properties["Work item IDs"].rich_text[0].plain_text // ""),
  (.properties.Synopsis.rich_text[0].plain_text // "")] | @tsv'
```

Follow `next_cursor` when `has_more` is true.

## Duplicates and merges

Two records about the same concept merge into the broader one, or into the older one when neither is broader:

1. Move each section of the other into it (`update_content`, before `## Gotchas and lessons`), keeping each section's source.
2. Join their "Work item IDs" and "Work items" lists.
3. Set the other record's Status "superseded" and "Superseded by" to the kept key, and add it to the kept record's "Supersedes" relation.
4. Update the kept record's Synopsis and Saved.

## Superseding and retiring

- A record replaced by a newer one: Status "superseded", "Superseded by" the new key.
- A record no longer true and not replaced: Status "deprecated" (retired), with a last section `## Retired` saying when and why.

## Proposals waiting for review

Records with Status "proposed" wait for the owner's yes; a proposal section inside another record starts `**Proposal, not approved yet:**`. Ask about each, with its one-line reason. His yes: remove the proposal marks, set Status "accepted" and Authorization "Approved by <owner> on <date>", and remove its Current state line. His no: set a proposal record to Status "deprecated", or remove a proposal section, and remove its Current state line.

## Links to work items

- Each "Work items" relation should point at an existing work item. Read each linked page; one in the trash or not found: remove it from the list and keep its ID in "Work item IDs" with "(removed)".
- "Work item IDs" and the relation should name the same items. When they differ and work items are in Notion, change "Work item IDs" to match the relation, keeping any ID marked "(removed)".
- A record clearly about one item but not linked: propose the link.

## Stale records

A record about something that changes (a vendor, a process, a person's role) whose Last verified is "unknown" or more than six months old: check it against its source, or ask the owner when you cannot reach it. Then set Last verified to the date you checked, or retire it.

## Current state

Follow `current-state.md`: read it and the work items it names (status with `tracking-work-items`), and remove every line that is no longer true. Move each to-do that now has a work item to Now as the item's ID, unless Now already names that item. Rewrite "Next session starts with" when it is out of date. A section still over its limit: put the true lines you propose to cut on the plan, each with its reason, choosing the ones the next session is least likely to need. Never propose cutting an open owner to-do only to meet a limit: offer him a work item for it instead. Removing a line that is no longer true needs no plan. Tell the owner what was removed.

## Lessons that should become rules or skills

A "Gotchas and lessons" entry has proved itself when its **Seen:** line names two or more sessions, or when the owner confirmed it.

1. Decide where it goes: an instruction followed every time is a rule; a procedure with steps is a project skill.
2. Put it on the plan with the exact words: the rule bullet and its area, or the skill's name and description.
3. After his yes: a rule is one bullet in `.claude/rules/owner-preferences.md`, written by the notion-memory-save skill (its steps for the owner's instructions). A skill: see "Writing a project skill".
4. The record's entry gets **Promoted:** `<date>, to <where>` and stays as history.

A fact that is really an instruction ("always check X before Y") is proposed as a rule the same way.

## Writing a project skill

A project skill goes in `.claude/skills/<name>/SKILL.md`. Codex reads `.agents/skills`, which is a link to `.claude/skills`, so one copy serves both. The header holds only `name` and `description`. Add one line for the skill to the skills list in `AGENTS.md`.

## Rows the toolkit did not make

A Memories row with no Record Key was made by hand or by Lore's own tools. List them for the owner: he can give one a Record Key, ask you to save its content as a record, or leave it.

## The owner's rules

Read `.claude/rules/owner-preferences.md` and the rules list in `AGENTS.md`. Put on the plan, each with a one-line reason, every bullet that repeats or contradicts another bullet, another rule file, or a line of `AGENTS.md`, or is already enforced by a hook or a setting. Change or remove a bullet only after his yes. A contradiction is a question for him. Never remove a bullet only because it is old.

## The report

One short list for the owner: what was merged, superseded, retired, relinked, removed from Current state, and proposed as rules, each with its record's title and link.

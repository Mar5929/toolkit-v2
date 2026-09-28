# Recording the owner's answers

Where each thing the owner says is saved, how to ask him a question, how to
end a reply, and what to say when a save fails.

## Contents

1. Voice
2. Where each answer goes
3. Save it before the next question
4. History notes
5. Waiting on the owner
6. Asking the owner
7. Ending every reply
8. Reporting a failed save
9. Owner edits win
10. Stages in plain words
11. Handing over to another skill

## 1. Voice

Every skill carries this line near its top:

> Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.

Helper agents do not receive the output style. Each agent file carries its
own writing rules.

## 2. Where each answer goes

| Information | Home | What to record |
| --- | --- | --- |
| Requirement or correction | The item's `Active requirements` (the `R-xx` block) and `Acceptance` | The new meaning, and Status Refining until approved |
| Design choice | The item's design (`toolkit work design`) | The approach, proposed or approved, and why |
| Open question | The item's `Open Questions` table | Question, what it affects, Open, who must answer |
| Answer or decision about this item | The question's row, the section it changes, and one history note | The answer, who gave it, the date, and whether it is an approval |
| Decision for the whole project | `DECISIONS.md`, through `work-decide` | Decision, why, who decided, what it replaces |
| Outstanding task | The item's `Tasks` section | Work, Deliverable, Done when, Depends on |
| Context that is not a requirement | `Notes` > `Decisions and context` | Only what the next session needs |
| Build idea kept for later | `Notes` > `Solution options and considerations` | The idea and the `R-xx` it relates to |
| A lasting fact, preference, or lesson | Project memory, through `memory-save` | One record |

A choice about how agents deliver a goal (the delivery offer) is recorded
only by `work-delegate`.

## 3. Save it before the next question

- Save each settled answer in its home before moving to the next topic. An
  unanswered question is also information: save it as an Open Questions row.
- Open decisions never delay saving answers that are already settled.
- Read the section back after saving. A command that exits `0` is not proof
  by itself.
- Check the item and memory before asking the owner something. Never ask
  again what the record already answers.
- When two sources disagree, keep the conflict open and ask. Never pick the
  convenient answer.

## 4. History notes

Add one note when:

- the stage, type, priority, `waiting_on`, blockers, or next action changes
  for a reason that is not obvious;
- the owner gives a choice, an answer, a requirement, a constraint, an
  approval, or a rejection (quote his words);
- someone outside reports an approval (record who; do not claim you checked
  it);
- a discovery changes the plan;
- a requested result is finished.

```text
toolkit work history <id> --note '<what happened>' --effect '<what it changes>'
```

- Without `--effect`, the row names the skill that continues the item. A note
  that quotes the owner right after an approval or a `waiting_on` change
  needs its own `--effect`: the default is worked out from the item before the
  change and can name the wrong next step.
- Record the owner's meaning briefly. Add no reason, scope, or certainty he
  did not give.
- A note that quotes him starts with `Owner said:`, followed by his words in
  double quotes inside the single-quoted text. A quote is his exact words:
  never reword it to avoid an apostrophe ("she'll" stays "she'll", never
  "she will").
- Keep apostrophes out of your own words in the note where you can. In a
  quote, and wherever one is needed, write it as `'\''` in Claude Code and as
  ’ (U+2019) in Codex (`toolkit-commands.md`, "Text in a command").
- Do not log routine commands, files opened, ordinary test runs, or small
  edits.

Examples:

```text
toolkit work history WI-012 --note 'Owner said: "yes, approved"' --effect 'Requirements approved; solution-design continues.'
toolkit work history WI-012 --note 'Build found the export API has a 10,000-row limit.' --effect 'P2 added for paged exports.'
```

## 5. Waiting on the owner

- Set `waiting_on` to `owner` when you ask him for an approval, or add an
  Open Questions row that he must answer.
  `toolkit work set <id> --waiting-on owner`
- `toolkit work approve` sets `waiting_on` from `owner` to `none`, because he
  just answered. Then set it to `agent` when the agent continues.
  `toolkit work set <id> --waiting-on agent`
- After he answers his last open question on the item: `agent` when the agent
  can continue, `none` when nothing waits. Keep `owner` while another of his
  questions on that item is still open.
- An item at `owner` stays in the briefing and in `toolkit work decisions`,
  and `work-on` sends it to `work-decide` instead of its next stage.
- Waiting on someone else: `toolkit work set <id> --waiting-on 'external: <who>'`
  and the Overview Blockers line names what is missing.

## 6. Asking the owner

- Ask in the reply text. Never ask through a question tool (such as Codex's
  `request_user_input`): he may never see it, and the reply must hold the
  question.
- One question per message. Give your recommended answer and the main reason
  in one line, so he can confirm, correct, or redirect it.
- The one exception: more than three findings from the `work-requirements`
  spec check go in one numbered list he can answer in one message.
- Never ask him which stage an item is in, or which helpers a small item
  needs. Work those out yourself.
- A question, a suggestion, a tentative answer, or a saved draft is not an
  approval. `toolkit work lifecycle` prints what counts as approval.

## 7. Ending every reply

End every reply to the owner with one of these:

- the one question he must answer ("Do you approve these requirements?");
- the exact words that continue the work ("Say 'keep going' and I'll start
  the build.").

Never end on "The next step is ..." with nothing for him to do.

## 8. Reporting a failed save

- The write failed: lead with "Not saved". Name what was not saved and where
  it should go, and keep the text so it can be saved later.
- The write worked and the read-back failed: lead with "Saved but not
  verified", name the line the CLI says differs, and read the item back to
  judge it.
- Never say "updated" first and correct it later in the same reply.

## 9. Owner edits win

The owner may edit the tracker by hand: move or rename a folder, drag a
Notion card, change a stage. The CLI keeps his value, writes a history row,
and reports it. Never undo it.

- The session briefing lists these under "Changes found in the tracker", and
  every `toolkit work` command prints the ones it finds. Tell the owner each
  one in one line in the reply (not only in a progress line), before other
  work. Each line the CLI prints is written to be said as it is. Do not guess
  at a cause the CLI does not name.
- The CLI writes the history rows for a hand move. Add a note only for what it
  cannot know, such as the owner's reason.
- A hand change that skips a gate (a `build` item moved past stage 03 without
  approved requirements, or Done with no recorded result approval) is asked
  about as a question. The CLI prints the question and the command for each
  answer.

## 10. Stages in plain words

- Show a stage with the item id and the plain label from
  `toolkit work lifecycle`: "WI-012 is in testing (stage 09)".
- Status follows the stage. `waiting_on` shows who the item waits for.

## 11. Handing over to another skill

- Claude Code: open the skill with the Skill tool, by name.
- Codex: read that skill's `SKILL.md` from the path in the skill list, then
  follow it.
- Say the handover in one line: "WI-012 needs a design; opening
  solution-design."
- The skill that asked a question records the answer. An answer that arrives
  later, after that skill has finished, is recorded by `work-decide`. The
  delivery offer is the exception: only `work-delegate` records it.

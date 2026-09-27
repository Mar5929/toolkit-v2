---
name: handoff
description: "Writes a checked prompt a fresh session can start from, after updating the active work item and current focus. Use when the owner says \"write a handoff\", \"I'm going to clear context\", \"start a new session\", \"this chat is getting long\", or \"I'm stopping for today\". \"/handoff check\" checks one."
---

# Handoff

Leave the project ready for a fresh session, then write a checked prompt it can
start from. Do these steps in this order. Details for each step are below.

1. **Check the project.** No `.toolkit.json` with `"toolkit": "toolkit-v2"`:
   skip steps 2 and 3 and say so in one line.
2. **Update this session's work item**, never one it did not work on. In
   Overview: Current position, Next action and who owns it, Blockers. In Notes:
   Resume here. Set its true stage and `waiting_on`, add one history note, then
   validate it and read it back.
3. **Save what must outlast the session.** Review the current focus and the
   memory criteria, as the project's `session-handoff.md` rule asks. Anything
   the owner asked to keep that is not saved yet: open `memory-save`, which
   saves only authorized lasting memory. Then replace the current focus
   section "Next session starts with" with one entry for this handoff.
4. **Draft the prompt.** First line exactly: "This handoff prompt is
   AI-generated and may contain hallucinations, skewed context, etc. Please
   evaluate accordingly." Then the goal, why it matters, where it is written
   down (work item ids, not paths), what to read first, decisions not yet
   saved, open questions, and one first action. Keep a source kind for every
   fact: file, repository, owner, or worked out.
5. **Check the draft** with the `handoff-verifier` agent. Fix every Wrong,
   Unchecked, Missing, or Skipped finding. Codex: pass the agent file's text
   to a native worker (`../../references/conventions.md`, "Running an agent
   from this plugin").
6. **Show the result.** What was saved (anything not saved first), then the
   prompt in one fenced block. A failed save never blocks the prompt.
7. **"/handoff check"** (Codex: `$handoff check`): run only step 5 on a prompt
   the owner pasted.
8. Never commit `.memory/` or `.work-items/`. Never stop the owner from
   clearing context.

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.

Save results: a failed write is "Not saved"; a write that cannot be read back
is "Saved but not verified". Lead with either one and name the pending write.
Edge cases: `references/edge-cases.md`.

## Why the order matters

The sessions that produce the most understanding are the ones most likely to
lose it. Whatever did not reach the work item, memory, or the prompt is gone
when the session ends. Do the saves first: once the prompt is on screen, the
owner treats the session as over and the saves get skipped. Skip the check and
the prompt carries whatever this session believed, guesses included, and the
next session reads those guesses as settled facts.

Nothing can catch the moment the owner clears context. The session-end event
fires on a clear, but it cannot stop the clear or tell the agent anything. That
is why this is a skill the owner starts, not a hook.

## Step 1: check the project

Read `.toolkit.json` at the project root. When it is missing, or it has no
`"toolkit": "toolkit-v2"` key, this is not a Toolkit V2 project: there is no
work item or current focus to update. Say so in one line, go to step 4, and
carry everything worth keeping inside the prompt. Do not create a tracker or a
memory store for a handoff.

## Step 2: update this session's work item

**Find the item.** Update only an item this session actually worked on: the
one named in the conversation, the one the session briefing named for this
worktree (a branch such as `wi-007-<slug>` belongs to `WI-007`), or one this
session changed with a `toolkit work` command. Never pick an item only because
it is open: another session may be working on it right now, and this handoff
would overwrite its Overview and Resume here.

No such item: ask the owner which item, if any, this handoff belongs to. To
help him answer, list the open items:

```text
toolkit work list --status "In Progress"
toolkit work list --status "In Review"
```

No answer, or "none": skip this step and say so in one line.

For a `github` or `jira` tracker, `toolkit work` exits with code 3 and prints
the path of that tracker's written instructions. Follow them to make the same
changes on the issue, then read the issue back.

**Read it first**, so edits from another session or from the owner are kept:

```text
toolkit work show <id>
```

**Overview.** Keep Goal and Related items as they are. Rewrite Current position
(what is done and where work stands), Next action (the next specific action and
who owns it: `agent` or `owner`), and Blockers (or "None."). Write the whole new
Overview section to a file in a temporary folder outside the repository (make
one with `mktemp -d`), then:

```text
toolkit work edit <id> --section Overview --set-file <file>
```

**Resume here.** The exact point where work stopped, approval boundaries (what
the owner has and has not approved), open questions and who must answer them,
and the next task ids from Tasks. Link to Open Questions rows by id instead of
repeating them.

```text
toolkit work edit <id> --section "Resume here" --set-file <file>
```

**Stage and waiting_on**, only when they changed. This command lists the
stages:

```text
toolkit work lifecycle
```

Then set the new values. The command refuses a move past an approval gate that
has no recorded approval; report that refusal, never work around it.

```text
toolkit work set <id> --stage <stage> --waiting-on <owner | agent | external: who | none>
```

**One history note:**

```text
toolkit work history <id> --note "Handoff: <where work stopped, in one line>"
```

**Validate and read back:**

```text
toolkit work validate <id>
toolkit work show <id> --section Overview
toolkit work show <id> --section "Resume here"
```

Other rules for this step:

- The owner approved or decided something about this item in this session and
  it is not recorded yet: open `work-decide` to record it. If that cannot
  finish, carry the decision in the prompt under "Decisions not yet saved".
  This includes an agent-led delivery choice (accepted, declined, or revoked).
  Never infer a choice from activity.
- Requirements or design text changed in this session: the owning skill
  (`work-requirements` or `solution-design`) saves each answer before moving
  on. Check that the saved text is there. Report any text that is not saved.
- Do not copy the item's status, next step, or decisions into memory. They live
  in the item.

## Step 3: memory and current focus

**Things to keep.** Read the memory criteria first (`.memory/memory-criteria.md`
with built-in memory; otherwise the `memory-save` skill's record format). When
the owner said something to keep in this session ("remember", "from now on", a
correction) and it is not saved, open `memory-save`. It owns where each thing
goes, the approval, and the wording. Wait for its result. Anything it did not
save goes into the prompt, labeled not saved. Leave out anything the owner
asked to forget or keep out of the handoff. A review can end with nothing to
save.

**Current focus.** Read it with its version:

```text
toolkit memory focus --json
```

The output has `text` (the focus) and `version`. Replace only the section
"Next session starts with". It holds one entry, replaced at each handoff.
Leave the other sections as they are, except add this session's work item id
to "Now" when it is missing, and set the "Last updated" line to the date, the
source (`handoff`), and who wrote it.

On a new project the focus still holds the setup text from the model: a
fill-in guide comment under the title, and an `<angle bracket>` prompt in
every section. Remove the fill-in guide comment. Write "None." in each section
that still holds only a prompt. Never leave a prompt in the saved focus.

- With a work item, the entry is a pointer only:
  `<UTC date and time> | <topic>: continue <WI-id> from its Resume here. Goal: <one line>.`
- With no work item, a short note: the goal or topic, where work stopped, the
  first next action, constraints and approval boundaries, and open questions.
  Label unchecked claims. Do not create a work item just to hold this note.

Keep the whole file under 50 lines. Write the whole new focus to a file in a
temporary folder outside the repository, then save it with the version you
read, and read it back:

```text
toolkit memory focus --set-file <file> --expect <version>
toolkit memory focus
```

`--expect` makes the save fail (exit code 2) when another session changed the
focus after you read it. Then read it again, put your entry into the new text,
and save with the new version. Never save without `--expect`: that would
silently drop the other session's change.

No focus yet (`version` is null): save with `--expect absent`. The file must
have all four sections, or the command refuses it. Use the model's format:

```markdown
# Current focus

Last updated: <YYYY-MM-DD>, handoff, agent

## Now

- <WI-id>: <one line>

## Waiting on the owner

- None.

## Untracked to-dos

- None.

## Next session starts with

- <the entry>
```

The same commands work for every memory backend (built-in `.memory/`, local
Hindsight, Notion). When the old entry pointed at different work that is still
in progress, say in the short list that it was replaced; that work's own
Resume here still holds its continuation.

## Step 4: draft the prompt, and do not show it yet

The prompt is for an agent that knows nothing about this session. Write it as
an instruction to that agent, not as a story of what happened here.

**First line, word for word, on its own line:**

```text
This handoff prompt is AI-generated and may contain hallucinations, skewed context, etc. Please evaluate accordingly.
```

It is the first line of every prompt this skill produces: a normal handoff, a
"/handoff check" result, a prompt with no check, and a prompt written after the
checker failed. Never reword it, drop it, or move it. The checker does not
score it.

**Then the goal.** What the whole piece of work is trying to achieve, why it
matters, and where that is written down. Not the next step: the thing the next
step serves.

- What we are trying to achieve, in one or two plain sentences.
- Why it matters: the problem it solves, or what started it.
- Where it is written down: the work item id (for example `WI-014`), the
  `requirements/` file, the pull request or issue number. Name work items by
  id, not by path: folders move, and the `toolkit work show` command finds an
  item by id wherever it is.

"Finish the change to `src/api.ts`" is a task, not a goal. "Cut the time the
export takes so the nightly job stops running past its window" is a goal. When
the goal was only ever said in this conversation, write it anyway and label it
not confirmed against any file.

**Then the rest.**

- The task: what the new session does next, its scope, and what finished looks
  like.
- What to read first, in order: the work item, its design, the files being
  changed.
- Decisions not yet saved, under their own heading. Include what the owner
  declined or cut in step 3, and why where it matters.
- Open questions and constraints nobody has settled.
- What to do first: one concrete action.
- When another session works in the same repository: the worktree and branch
  this session used, so the next one does not assume it owns the checkout.

**Every fact carries its source kind.** Keep a source for each claim; the
checker uses them in step 5.

| Source kind | Meaning |
| --- | --- |
| file | A path, a line, or what a file or work item says. Checkable |
| repository | A branch, worktree, commit, pull request, issue, or command output from this session. Checkable |
| owner | The owner said it in this conversation. Quote the owner's words when you can |
| worked out | This session concluded it. Nothing recorded it |

Say inside the prompt which facts were not saved anywhere.

**Say the literal thing.** Do not describe the accuracy problem with a figure
of speech. **Label, do not hedge:** an unconfirmed fact gets "not confirmed"
beside it, never "possibly" or "it seems".

## Step 5: check the draft

Run the `handoff-verifier` agent in the foreground and wait for its report.

- Claude Code: start it with the Agent tool. It is listed with the plugin name
  in front, for example `session-skills:handoff-verifier`. Pass `model: opus`.
- Codex: this plugin's agents do not load there. Read
  `../../agents/handoff-verifier.md` and give its full text, with the brief, to
  a native Codex worker. With no worker, do the check yourself by following
  that file, and say inside the prompt that no independent check ran.

The brief has three things: the full draft, the repository path, and the source
you kept for each claim. The agent has not seen this conversation; do not tell
it to trust anything it cannot open.

| Verdict | What you do |
| --- | --- |
| `Wrong` | Correct the prompt to what the repository or tracker says. Note it in the short list |
| `Unchecked` | Keep the claim and label it inside the prompt as not confirmed. Never delete it |
| `Missing` (the goal) | Add the goal. A prompt is never shown without one |
| `Skipped` | Say in the short list which check could not run and why |

Run the checker once, fix what it found, and go on. Run it again only on
sections you rewrote. If it fails or cannot run, say so in one line, write the
prompt anyway, and say inside the prompt that it was not checked.

## Step 6: show the short list, then the prompt

First the saves: anything not saved, then what was saved and where (work item
id and sections, current focus). Then the checker's short list, one line each;
group small items when there are more than about six. Then one fenced block the
owner can copy. Before showing it, confirm the fixed notice is its first line.

```markdown
Not saved: the current focus (Notion did not answer). The entry is in the prompt.
Saved: WI-014 Overview, Resume here, stage 08-build, history note.

Checked the handoff prompt: 2 fixed, 2 not confirmed.

- Fixed: the work item is WI-014, not WI-041
- Fixed: the branch is `wi-014-export-timing`, not `export-fix`
- Not confirmed: "the nightly job times out at 40 minutes", nobody recorded it
- Not confirmed: the tests were never run in this session
```

## Running the check on its own

"/handoff check" (Codex: `$handoff check`) takes a prompt the owner already
has, from an earlier session, another agent, or written by hand.

1. Ask for the prompt if it was not pasted, and which repository it is about if
   that is not clear.
2. Give it to `handoff-verifier` exactly as given, and say that no sources are
   offered for any claim.
3. Fix what came back `Wrong`, label what came back `Unchecked`, add the goal if
   it came back `Missing`, and put the fixed first line at the top if it is
   missing.
4. Show the short list, then the corrected prompt in one block.

Nothing is saved in this mode, and nothing about the current session goes into
the prompt.

## Resuming later

The next session's briefing shows "Next session starts with" from the current
focus. Resuming the work is the job of `work-on`, not this skill: it opens the
item by id and rechecks its current state and approvals before acting.

## What this is not

It is not a recap. `session-summary` answers "which of my requests are where".
This answers "how does somebody else pick this up". The checker does not decide
what goes in the prompt; it checks what is there and never removes a claim.

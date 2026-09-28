# Review and Save Project Memory

This rule applies to the main agent. The project memory system is chosen at setup and recorded in `.toolkit.json`; with built-in memory it is the local `.memory/` folder. It is the single project memory store. Claude's native auto-memory and the `claude-toolkit` Second Brain plugin are disabled for this project. The session-start briefing shows the current focus in Claude Code and Codex. Do not treat a hook reminder as a save decision.

## Decide the destination first

Read the memory criteria (`.memory/memory-criteria.md` with built-in memory) and the likely owning record. Send current focuses, owner to-dos, and handoff context to the current focus; sourced terminology to the glossary; qualifying otherwise-unowned durable context to a topic; active work to the chosen tracker; decisions for the whole project to `DECISIONS.md`; accepted delivered behavior to requirements; the technical approach to the design kept with its work item; verified current structure to the System Guide; and repeatable procedure to instructions or a skill. Raw external documentation stays in its source folder. A small memory pointer can route future sessions to a hard-to-find authority without copying its body.

Review on explicit remember/forget requests, corrections, standing preferences, meaningful decisions or discoveries, significant fixes or episodes, people/tool/reference changes, focus shifts, work-item completion, and handoffs. The toolkit's `UserPromptSubmit` hook flags only explicit keep phrases, and its Stop hook checks once per turn that such a phrase was handled. Do not save on every hook reminder or every turn. A review can end with no memory.

## Approval

The `memory-save` skill holds the approval policy: what the owner's own words authorize, what needs a yes in onboarding mode, what trusted mode allows, and what always needs the owner. The mode is `memory.approval` in `.toolkit.json`; only an explicit owner instruction changes it. A yes authorizes the shown operation and meaning only. Silence does not. An unanswered save question is kept as a proposal: the agent does not rely on it, and `work-decide` shows it to the owner until he approves or rejects it. The `memory-save` skill says how.

If the owner says a proposed item should not be memory, withdraw it. Save only a general selection rule, as a `feedback` memory, if their feedback supplies one; do not restate the rejected fact in the current focus or another topic. Review similar candidates against that rule from then on.

## Saving and completion

The main agent saves memory itself through the `memory-save` skill, which runs `toolkit memory` commands; there is no curator agent. Search first with `toolkit memory find`, then save with `toolkit memory save`, retire with `toolkit memory retire`, and write the current focus or glossary with `toolkit memory focus --set-file` or `toolkit memory glossary --set-file`. The commands lock memory, refuse stale edits, and rebuild the index.

For a focus-only change or already-authorized glossary maintenance, save without a lasting-memory question. Several independent signals can be grouped into one save; do not run parallel writes against the same topic or index. Before claiming a save succeeded, read it back with `toolkit memory get` and run `toolkit doctor`; tell the user briefly what was retained or what needs a decision.

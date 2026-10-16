# What the Hindsight choice adds to a project

Use this during Hindsight setup to install its memory skill and rule, connect the shared reminder, and record the owner's bank choices. The project uses one memory store and one reminder mechanism.

## Files and settings added

| Part | What setup adds or changes |
| --- | --- |
| Decision and system records | Copy `choices/memory/repository-records/files-to-add/` and write its rows in the root `AGENTS.md`, as [what-repository-records-add-to-a-project.md](../../repository-records/reference/what-repository-records-add-to-a-project.md) says. |
| `.claude/rules/hindsight-memory.md` and the skill `managing-project-memory` | Copy this choice's `files-to-add/` into the project. It adds the skill `managing-project-memory`, which the other skills call for every memory step and which defines qualifying memory, saving, finding, and corrections. The rule loads in every session and covers reading complete startup memory. |
| Root `AGENTS.md` | Add the "Project memory" section below, and the summary sentence. |
| `PROJECT.md`, "Toolkit settings" | Record the bank, connection, package, template, changes, and open checks. |
| Startup module and reminder text | Copy `.claude/hooks/session-start-choice.mjs` and `prompt-memory-reminder.md` from this choice. The module adds no state snapshot; the reminder names `managing-project-memory`. |
| Toolkit hook entries | Keep the shared SessionStart and UserPromptSubmit handlers. Preserve unrelated entries and the Hindsight add-on's hooks. |
| Add-on settings and bank | Apply the owner's choices through the onboarding steps. Keep keys outside the project. |

Do not copy local memory files for this choice. In an existing project, preserve memory records until the owner approves their migration; do not delete them as part of wiring the hook.

## Root `AGENTS.md`

Replace the prompt under the heading "Project memory" with this text, below the heading. Preserve unrelated owner instructions.

```markdown
This project keeps its memory in the Hindsight bank recorded in `PROJECT.md`, under "Toolkit settings".

- Use `managing-project-memory` for all memory work.
- Read `.claude/rules/hindsight-memory.md` at session start and after compaction.
- The project's current state is the current work in the work tracker and the project records. Read them at session start, and keep handoff context there.
- The prompt reminder suggests when to review memory. Review lasting lessons at handoff even when no reminder fires.
```

Keep the root `CLAUDE.md` that loads `AGENTS.md`. The rest of the root guide refers to "Project memory" for memory work and the project's current state, so no other shared line changes. The record rows come from the repository-records folder, as the table above says.

## `PROJECT.md`, section "Toolkit settings"

Write `hindsight` on the Memory line, then add or update these lines:

| Line | What it holds |
| --- | --- |
| Hindsight bank | The stable bank ID used by this project's intended hosts and checkouts. |
| Hindsight bank scope | What the bank's memory covers, which projects or agents share it, and any approved tag convention. |
| Hindsight server | The API address. |
| Hindsight dashboard | The bank's dashboard link. |
| Hindsight package | `default`, with approved changes recorded below. |
| Hindsight template | `Toolkit coding-project instructions`, the selected published template, or `own instructions`. |
| Hindsight changes | The owner's changes to the package and template, including capture behavior. |
| Hindsight service | The operator and runbook location, verified provider/model profile, capacity and retrieval profile, authentication-persistence check, and backup/recovery status. Record shared-service facts without credentials. |
| Hindsight setup | `done`, or a link to the open setup tasks. Applied add-on patches, their backups, and rollback. |

## Hook settings

Copy this choice's startup module and reminder text into `.claude/hooks/`. Merge the shared handlers into the project's existing `.claude/settings.json` and `.codex/hooks.json`, preserving unrelated handlers and the Hindsight add-on's hooks. Keep the toolkit SessionStart handler: it supplies the compaction reminder, while the installed module adds no state snapshot.

Restore a missing toolkit SessionStart handler in an existing project. [The settings merge rules](../../../../reference/skills-hooks-settings.md) require showing the old and new entries and having the owner trust changed Codex hooks with `/hooks`.

The reminder's phrases flag possible memory; `managing-project-memory` supplies the criteria and the review after lasting work. Hindsight's add-on owns its startup memory context. Verify both separately.

## Verify the project wiring

Confirm the copied rule and skill are present, the root guide's "Project memory" section holds the text above, and no local memory files or other memory choices' skills were copied into a new Hindsight project. Check both hosts' hook configuration. Run the existing prompt reminder with a representative owner message and confirm it names `managing-project-memory`. A message without a matching phrase must not request an automatic save. In a new session, confirm the agent reads the rule and the add-on reaches the recorded bank. Report any check that cannot run.

## Root guide summary

At setup completion, contribute this sentence to the root `AGENTS.md` summary. [Work tracking and memory summary](../../../../reference/project-store-summary.md) gives placement and verification.

```markdown
Project memory is stored in the Hindsight bank `<confirmed bank ID>`; follow `.claude/rules/hindsight-memory.md`.
```

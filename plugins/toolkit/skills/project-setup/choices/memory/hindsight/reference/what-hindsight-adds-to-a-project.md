# What the Hindsight choice adds to a project

Use this during Hindsight setup to install its memory rule, connect the shared reminder, and record the owner's bank choices. The project uses one memory store and one reminder mechanism.

## Files and settings added

| Part | What setup adds or changes |
| --- | --- |
| `.claude/rules/hindsight-memory.md` | Copy this choice's `files-to-add/` into the project. The rule defines qualifying memory, review triggers, recall, corrections, and filing boundaries. |
| Root `AGENTS.md` | Add the "Project memory" section below, and the summary sentence. |
| `PROJECT.md`, "Toolkit settings" | Record the bank, connection, package, template, changes, and open checks. |
| Existing `.claude/hooks/prompt-reminder.mjs` | Reuse the file supplied by `every-project`; add no hook file. Set its existing prompt entries to use `--skill hindsight`. |
| Toolkit `SessionStart` entries | Remove the entries that run the local `session-start.mjs`; they read local Current State. Preserve unrelated entries and the Hindsight add-on's hooks. |
| Add-on settings and bank | Apply the owner's choices through the onboarding steps. Keep keys outside the project. |

Do not copy `shared-by-local-and-notion/files-to-add/` or local memory files for this choice. In a setup copy, this choice's instructions take precedence over older guidance that copies a local Current State file. In an existing project, preserve memory records until the owner approves their migration; do not delete them as part of wiring the hook.

## Root `AGENTS.md`

Replace the prompt under the heading "Project memory" with this text, below the heading. In a project set up before this section existed, this text replaces an older "Hindsight memory" section; keep one version only. Preserve unrelated owner instructions.

```markdown
This project keeps its memory in the Hindsight bank recorded in `PROJECT.md`, under "Toolkit settings". The project's current state is the current work in the work tracker and the project records; read them at session start.

Read `.claude/rules/hindsight-memory.md` at session start and after compaction, and follow it for memory reads, reviews, saves, and corrections. It applies wherever this guide or a toolkit skill names `managing-project-memory`. Current work is in the work tracker. Wherever a toolkit guide or skill names the local Current State file, use the current tracker and project records instead, including handoff context; do not create that file or report its absence as a setup failure. The existing prompt reminder suggests when to review memory, and the agent reviews lasting lessons at handoff even when no reminder fires.
```

Keep the root `CLAUDE.md` that loads `AGENTS.md`. The rest of the root guide refers to "Project memory" for memory work and the project's current state, so no other line of it changes.

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
| Hindsight setup | `done`, or the remaining onboarding checks. |

## Hook settings

Merge changes into the project's existing `.claude/settings.json` and `.codex/hooks.json`, preserving unrelated handlers. For each host, remove only the toolkit `SessionStart` handler that runs `.claude/hooks/session-start.mjs`. Keep the shared file because other memory choices use it.

Set the existing `UserPromptSubmit` handler for `.claude/hooks/prompt-reminder.mjs` to `--skill hindsight`: in Claude Code, set or add the argument pair in `args`; in Codex, set or add it in the command. Do not duplicate handlers or arguments. Have the owner trust changed Codex hooks with `/hooks`.

The reminder's phrases flag possible memory; the copied rule supplies the criteria and the review after lasting work. Hindsight's add-on owns its startup memory context. Verify both separately.

## Verify the project wiring

Confirm the copied rule is present, the root guide points to it, and no local memory files or skills were copied into a new Hindsight project. Check both hosts' hook configuration. Run the existing prompt reminder with a representative owner message and `--skill hindsight` and confirm it names the Hindsight rule. A message without a matching phrase must not request an automatic save. In a new session, confirm the agent reads the rule and the add-on reaches the recorded bank. Report any check that cannot run.

## Root guide summary

At setup completion, contribute this sentence to the root `AGENTS.md` summary. [Work tracking and memory summary](../../../../reference/project-store-summary.md) gives placement and verification.

```markdown
Project memory is stored in the Hindsight bank `<confirmed bank ID>`; follow `.claude/rules/hindsight-memory.md`.
```

# Check What a Deployment Includes

A deploy ships the whole current source of every component it names, not only your edit.

- Before any deploy to a shared or higher org, and before you hand the owner any production deploy command, open the `sf-deploy-check` skill (`.claude/skills/sf-deploy-check/SKILL.md`) and run its check.
- Verify a suspected unrelated change against the target org read-only before you report it. A tracker is a hint, not proof.
- If a confirmed unrelated change remains, stop. Do not deploy and do not hand over the command. Tell the owner which component and what would ship.

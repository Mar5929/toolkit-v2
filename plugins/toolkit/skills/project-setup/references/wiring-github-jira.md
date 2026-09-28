# Wiring GitHub Issues or Jira

Purpose: what setup does, and does not do, for a project whose tracker is
`github` or `jira`.

The toolkit has no driver for these trackers. Agents follow written
instructions: `tracker-github.md` and `tracker-jira.md` in this folder. In
such a project, every `toolkit work` command exits with code 3 and prints the
path of that tracker's instructions.

## After init

1. Show the owner the instructions for his tracker, in a few plain lines:
   where items live, how stages are shown, and what he must set up.
2. GitHub: the labels are created once, and only after his yes: one
   `stage:<stage>` label per stage, the `type:` and `priority:` labels,
   `requirements-approved`, `design-proposed`, `design-approved`,
   `result-approved`, `waiting-on:owner`, `delivery:agent-led`, and
   `delivery:owner-led` (`tracker-github.md` in this folder names each use).
   Never create a GitHub repository without his yes.
3. Jira: the Stage field or labels, and the map from stages to Jira statuses,
   need his yes and often a Jira admin. Record the status map as a
   project-wide decision with `toolkit decision add`, saved through
   `publish-docs`:

   ```text
   toolkit decision add --decision '<the Jira status map>' --why '<why>' --by '<owner>'
   ```

## Gotchas

- Create nothing in GitHub or Jira without the owner's yes: no repository, no
  labels, no fields.
- The work item body is the same in every tracker: the model's
  `WORK-ITEM.md` template. The tracker instructions say where it goes in an
  issue.

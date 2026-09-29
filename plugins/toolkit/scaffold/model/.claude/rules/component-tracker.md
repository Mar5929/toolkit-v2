# Keep the Component Tracker Current

- When you author, modify, rename, or delete metadata under `force-app/`, open the `sf-component-tracker` skill (`.claude/skills/sf-component-tracker/SKILL.md`). In the same response, update `delivery/deployment/component-tracker.csv`, `delivery/deployment/full-project-deployment-template/package.xml`, and the work item's deployment folder.
- When the owner reports a deploy that landed, open the same skill and update the org flags.
- Never change an org flag for a failed deploy.

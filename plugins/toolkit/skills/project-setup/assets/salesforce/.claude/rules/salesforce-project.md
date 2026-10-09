# Salesforce Project Commands and Skills

- Use Salesforce's official skills (`forcedotcom/sf-skills`) for Salesforce platform questions and Salesforce work. In Claude Code they come from the Salesforce plugins that the project's `.claude/settings.json` turns on. In Codex the owner installs them.
- This project's rules, its three `sf-*` skills, and its guard hooks decide what may be deployed or changed. They win over an official Salesforce skill and over a Salesforce plugin. `.claude/rules/salesforce-agent-permissions.md` holds the owner's choices for each kind of action in each kind of org.
- Never set `SFDX_AUTO_DEPLOY` to `1`. The project's settings keep it at `0`, because the automatic deploy of the plugin `salesforce-development` would not go through the project's org guard or its permission set check.
- The project's settings also turn that plugin's telemetry off (`SF_DISABLE_TELEMETRY`). That is the owner's choice, so leave it off.

## Commands

| Need | Command |
| --- | --- |
| See what reads, writes, or breaks when a field or object changes | `.claude/rules/dependency-graph.md`, "Impact questions" |
| Fetch, check, or prepare a permission set | `tools/permissions/PERMISSIONS-RUNBOOK.md`; the tool is `tools/permissions/permsets.py` |
| Validate a change against the sandbox | `.claude/rules/salesforce-org-safety.md`, "The commands". The aliases are under "Toolkit settings" in `PROJECT.md`. |

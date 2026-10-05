# Salesforce Project Commands and Skills

- Salesforce's official skills (`forcedotcom/sf-skills`) are installed for this project. Use them for Salesforce platform questions and Salesforce work.
- This project's rules, its three `sf-*` skills, and its guard hooks decide what may be deployed or changed. They win over an official Salesforce skill.

## Commands

| Need | Command |
| --- | --- |
| See what reads, writes, or breaks when a field or object changes | `.claude/rules/dependency-graph.md`, "Impact questions" |
| Fetch, check, or prepare a permission set | `tools/permissions/PERMISSIONS-RUNBOOK.md`; the tool is `tools/permissions/permsets.py` |
| Validate a change against the sandbox | `.claude/rules/salesforce-org-safety.md`, "Allowed". The aliases are under "Toolkit settings" in `PROJECT.md`. |

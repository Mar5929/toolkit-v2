# Salesforce Project Commands and Skills

- Salesforce's official skills (`forcedotcom/sf-skills`) are installed for this project. Use them for Salesforce platform questions and Salesforce work.
- This project's rules, its three `sf-*` skills, and its guard hooks decide what may be deployed or changed. They win over an official Salesforce skill.

## Commands

| Need | Command |
| --- | --- |
| See what reads, writes, or breaks when a field or object changes | `python3 tools/kb/build_edges.py`, then `python3 tools/kb/query_graph.py <Object.Field>`. What the result cannot show: `tools/kb/README.md`. |
| Fetch, check, or prepare a permission set | `python3 tools/permissions/permsets.py`. The steps: `tools/permissions/PERMISSIONS-RUNBOOK.md`. |
| Validate a change against the sandbox | `sf project deploy validate -x <the work item's package.xml> -o <sandbox alias>`. The aliases are under "Toolkit settings" in `PROJECT.md`. |

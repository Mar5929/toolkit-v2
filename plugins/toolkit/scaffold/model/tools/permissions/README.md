# Permission set tool

`permsets.py` is Project Init's permission set checker. Use [the runbook](PERMISSIONS-RUNBOOK.md) for fetch, verify, preflight, and deploy handling. The preflight guard in `.claude/hooks/` requires a fresh receipt before a permission set deploy.

This model has no connected Salesforce org. In a copied project, verify retrieval behavior against that org and fill the runbook before using the tool.

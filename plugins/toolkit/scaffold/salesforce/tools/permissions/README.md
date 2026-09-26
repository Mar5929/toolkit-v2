# Permission set tool

`permsets.py` is the project's permission set checker. Use [the runbook](../../docs/permissions-runbook.md) for fetch, verify, preflight, and deploy handling. The preflight guard, `.claude/hooks/guard-permission-set-deploy.cjs`, requires a fresh receipt before a permission set deploy.

Before relying on the tool, verify retrieval behavior against the project's org and fill in the runbook's "Verified on this org" section.

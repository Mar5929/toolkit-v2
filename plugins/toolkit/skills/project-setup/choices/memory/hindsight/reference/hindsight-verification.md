# Verify the Hindsight memory flow

Use this before marking setup complete or accepting a configuration change. Verify the owner's approved behavior through the installed hosts. Setup stays open while a required behavior is unverified.

## Check preparation and processing

- Read back the effective connection, bank ID, missions, extraction strategies, capture settings, security protection, and page configuration. File settings can differ from a running client's settings, so restart the relevant session when needed. Use the installed diagnostic tools and supported server APIs without exposing credentials or private source text.
- Check representative extraction with a non-storing preview: a qualifying fact, a transient status, and an unresolved claim. Compare the extracted claims with their source for uncertainty and approval status, not only for subject. An extraction preview does not prove that a stored document is scrubbed.
- Keep each new writer off until its whole-document protection is verified.
- When a check needs stored material, agree on the sample with the owner. Verify processing and retrieval of that sample. Check a deliberate Reflect answer for completeness, source history, uncertainty, and consistency with confirmed owner choices. Recall and a health check alone do not prove that provider-authenticated extraction and synthesis work.

## Check the actual hosts

- Start a new interactive session in each intended host, Claude Code and Codex when both are configured. Check hook trust, effective bank routing, and the generated startup summary within the host deadline. Use diagnostics to tell a generated summary from the fallback; a normal hook exit or a pages response is not a generated summary.
- Compare the complete hook output with the context actually delivered to the agent. Check the Codex Hindsight handler's `additionalContextLimit: 5000` and the loaded memory rule in both hosts. When a host supplies a preview and saved-file path, check that the agent reads the complete file before answering. Allow normal file tools in this check.
- Check the approved startup deadlines and fallback budget against [the default package](hindsight-package-default.md), "Add-on settings for this bank", after installation.
- Use representative prompts, including while expected background work runs. Review complete answers against current project settings so historical proposals are not mistaken for live configuration. A direct provider test or a manually run hook bundle is a narrower check and does not prove interactive host behavior.
- When a patch from [the known defects](hindsight-known-defects.md) was applied, also run that defect's checks that need the real bank or a new session.

## Check surveys and knowledge pages

- Before turning on or replacing the code survey, run the write-tool check and the outgoing-document review in [the known defects](hindsight-known-defects.md), "Defect: the code survey's write tool does not carry the bank's saving policy". Keep test records out of the live bank. Record instruction-based protection as such, not as a deterministic filter.
- Check the seeded page subjects, page source queries, scope, refresh schedule, last successful build, stale state, failure records, and background operation status. Review generated claims against current project records when they may have changed.
- A configured schedule does not prove that refresh runs. After an approved recovery, check completed processing and page readback, then check a later scheduled run before claiming automatic recovery. Report duplicate-looking subjects before proposing removal.

## Record the result

Record what passed, which path was exercised, and what remains under "Hindsight setup" in `PROJECT.md`. Record each open step as a project task through `managing-work-items`. Distinguish installed interactive checks from narrower diagnostic tests. Use [the known defects](hindsight-known-defects.md), "Diagnose a failing or slow memory flow", to investigate a failure while keeping the approved package.

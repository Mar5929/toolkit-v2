# Salesforce's own skills

This file holds what setup does about the skills that Salesforce publishes: the check that they are installed, and the question about what to have on or off.

Salesforce publishes its own skills in the GitHub repository `forcedotcom/sf-skills`. A Salesforce project relies on them for platform questions and Salesforce work. They come from Salesforce. Setup installs none of them, and it changes one of their settings only when the owner says so.

- **Check that they are installed.** In Claude Code they come as plugins of that repository's marketplace, `salesforce`. The owner uses these seven: `salesforce-development`, `dx-devops`, `experience-lwc`, `integration`, `salesforce-code-quality`, `platform-lightning-widgets`, and `platform-trust-security`. In Codex they are skills, which `npx skills add forcedotcom/sf-skills` installs. Tell the owner what is missing.
- **Ask the owner what to have on or off**, in one message, and change only what the owner says:
  - whether Salesforce's plugins are on for the whole computer or only in Salesforce projects. Their hooks run on every command and every file edit wherever the plugins are on;
  - the automatic deploy of `salesforce-development` (`SFDX_AUTO_DEPLOY`). It deploys each saved file to an org, and nothing in the project checks that deploy;
  - the usage data that the same plugin sends (`SF_DISABLE_TELEMETRY`).

When Salesforce's skills are still missing at the end of setup, [salesforce-steps-left-for-the-owner.md](salesforce-steps-left-for-the-owner.md), "What setup records as still open", says how setup records it.

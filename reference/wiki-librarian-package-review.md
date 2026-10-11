# Project Wiki librarian package review

The 0.9.60 draft makes each Notion project's librarian procedure accessible inside Project Wiki. A cloud or local librarian starts from its published entry, reads verified project context and connections, and loads focused references as needed.

## Delivered changes

- Setup publishes the existing maintaining-notion-wiki procedure as a short entry with linked references and a filled Project context and connections page.
- Schema publication records actual project property names, types, options and relation targets. Runtime checks still inspect live schemas before writes.
- Librarian access uses the selected host's Notion tools. Local CLI use retains its existing access procedure; cloud processing does not require local repository files.
- Coding agents invoke on-demand processing through configured settings and the published entry. Scheduled and on-demand operation coordinate one writer.
- Setup previews the package pages within external setup approval, verifies selected-host access and records publication links. Existing projects receive a reviewed update batch that preserves customizations.

The librarian entry remains 29 lines; the coding-agent entry is 36 lines. These are observed lengths, not limits. The new project-context template and publication reference hold supporting detail.

## Review and validation

[Independent review](wiki-librarian-package-independent-review.md) simulated a client with only published pages available. It covered finalized product filing, missing sources, shared tracker scope, competing writers and uncertain writes. The review identified an omitted setup permission route and a missing comma; both were fixed and reread. No confirmed procedural gap remains in that review.

Marketplace and plugin Claude validations passed. Whitespace, front matter, reference links and three scratch assemblies passed: Notion memory with local, GitHub and Notion trackers. Codex accepted toolkit 0.9.60 in a scratch home at /private/tmp/tkv60-codex.rpIOgQ/plugins/cache/toolkit-v2/toolkit/0.9.60.

Authoring followed the current repository copies of Codex build-skills and Anthropic skill best practices captured September 27, and Claude Code skills captured October 5, plus Notion MCP's skill documentation read October 11. The entry and directly linked references preserve progressive disclosure. Native Notion Skill designation is used where supported; explicit entry-link invocation does not require automatic discovery.

## Delivery and verification limits

The feature is uncommitted on codex/wiki-librarian-package, based on merged 0.9.58. Version 0.9.59 is a separate preserved policy draft, so delivery must integrate it before releasing this 0.9.60 draft. The initial draft review changed no live Notion content. Mike subsequently authorized the template publication recorded below. No installed project, owner host configuration or schedule changed; cloud-host execution and copied-template wiring remain setup verification steps.

## Authorized live template publication

On October 11, Mike explicitly asked to update the [Project Wiki template](https://app.notion.com/p/3f6b381da176807585fcf70562d08b25). The [Librarian processing skill](https://app.notion.com/p/3f6b381da17681588da2f0efbff62b56) is published under that page with its seven reference/context pages. The context remains a template with project setup prompts and blocks processing until a copied project's identity, destinations and access are configured.

The published schemas were populated from eight live template data sources. Independent readback checked all 120 fields, including names, types, options and relation targets. Every package page was readable, links resolved and the parent retained its five destination connections. An unintended web link for DECISIONS.md was corrected to inline code and read back. The parent processing guidance routes to the new skill and context; working designs remain in work items until finalized.

Publication does not establish cloud-host execution, native automatic Skill discovery, copied-template link remapping, writer coordination or scheduling. No destination schema or project memory records were changed, and no existing project was migrated.

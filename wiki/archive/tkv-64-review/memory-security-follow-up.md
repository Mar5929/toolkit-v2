# Memory security policy follow-up

Mike resolved the contact-details question on October 11, 2026. Ordinary email addresses and contact details may qualify for memory. Exclude secrets and information whose storage could compromise system, product, or project security. Existing lasting-memory criteria, filing rules, provenance and save authorization still apply.

The authoritative owner answer is TKV-64 Q-08 in [the work item](https://app.notion.com/p/3f5b381da17680d8baddef8a6de49b5d). Version 0.9.48 applies the decision in the Toolkit source. Mike approved committing and merging this follow-up on October 11, 2026.

## What changed

| Guidance | Result |
| --- | --- |
| Local `memory/AGENTS.md` and shared `memory-criteria.md` | Replace email and broad personal-data bans with the security exclusion. Qualifying contacts remain allowed. |
| Shared `saving.md` and `tidying.md` | Remove security-compromising text promptly. Keep ordinary contact records. Do not repeat excluded text in a correction or offer to restore it. Ask before deleting the whole record when removing that text leaves no useful memory. |
| Hindsight rule and retain, observation and reflect missions | Apply the same exclusion without treating all personal details as forbidden. |
| Hindsight package and setup | Check the whole submitted record before sending it. Automatic redaction is off in the proposed default; offer a native filter only when its behavior matches the policy. Verify whole-document protection for each writer before enabling it or removing an existing filter. Keep existing approved filters until replacement settings are verified. |
| Persistent-memory wiki | Record the same policy in the intended behavior definition. |

[Hindsight's Memory Defense documentation](https://hindsight.vectorize.io/developer/memory-defense), read October 11, describes a bundled filter that removes personal identifiers as well as secrets. It does not document a secrets-only selector. This change adds no custom filtering code and makes no claim that extraction missions scrub the original stored document.

## Review situations

- A lasting project contact's email may be saved with its role and source when the normal criteria and authorization apply.
- An API credential is excluded from the whole submitted record, including its context and source text.
- A nonsecret architecture or security-design fact may qualify. The exclusion applies when storing the information would compromise security.
- A security-compromising operational detail is excluded even if it matches no credential pattern.
- Removing a secret reports what was removed without copying the secret or offering an undo that restores it.
- Updating an existing bank preserves its approved filter until a compatible replacement is verified. A new automatic capture path remains off when its pre-storage protection cannot be verified.

## Verification

Claude marketplace and plugin validation, whitespace checks, nine tracker/memory assemblies, required links, skill front matter, settings parsing and scratch startup checks passed. Codex accepted version 0.9.48 in an isolated scratch home. Independent review found reporting-precedence and automatic-capture verification gaps; both were fixed and reread. The final review found no actionable issues.

Current official guidance read October 11: [Claude Code skills](https://code.claude.com/docs/en/skills), [Codex skills](https://learn.chatgpt.com/docs/build-skills), [Anthropic skill authoring](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices), [Codex agent guides](https://learn.chatgpt.com/docs/agent-configuration/agents-md) and [Claude Code memory](https://code.claude.com/docs/en/memory).

## Delivery limits

No live bank settings, memory records, database schemas, installed projects or owner host configuration were changed. The owner decision was deliberately recorded in this repository's Hindsight bank. Filter checks in the setup instructions still need to run against each installed server; no live filter or code-survey security check was exercised here. The unrelated output-style change and TKV-60 reports remain separate. The former `dev/` checks are absent.

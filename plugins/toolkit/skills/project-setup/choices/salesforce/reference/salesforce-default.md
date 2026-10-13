# How the toolkit sets up a Salesforce project by default

This file holds how the toolkit sets up a Salesforce project when the owner changes nothing. Step 1 of [salesforce-setup.md](../salesforce-setup.md) uses it.

Tell the owner this in a few plain lines, and ask whether it is what the owner wants.

- The project gets the toolkit's rules for Salesforce work, three skills, and templates for deployments, data migrations, and releases in `delivery/`.
- By default an agent never deploys to production and never changes it, and Claude Code refuses such a command when it names the production org. The owner may allow any of these for this project.
- An agent only reads an org that the owner marks read-only, such as an old org whose data moves into the new one.
- In a sandbox or a scratch org, the agent may read, validate, deploy, and run tests without asking, and asks first before a data change, a destructive deploy, or anonymous Apex. The table "Actions" in the project's `.claude/rules/salesforce-agent-permissions.md` holds every default.
- Salesforce's own skills do the Salesforce platform work. They come from Salesforce, and setup installs none of them.

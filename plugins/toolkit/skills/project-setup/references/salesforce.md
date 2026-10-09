# Salesforce projects

This file says what setup does for a Salesforce project beyond copying its files. It covers Salesforce's own skills, which the project gets from Salesforce, and the two Salesforce facts that setup records: the org aliases, written while you build the setup copy, and the API version, written after the files are in place. Open it at step 7 of "New project" in `SKILL.md`, and at step 4 when you write the org aliases.

The job of this file is done when all of these are true:

- the owner knows which of Salesforce's plugins the project turns on in Claude Code, and which of them this computer still lacks;
- the owner has been asked whether to turn Salesforce's plugins off for the rest of this computer, when they are on there;
- the owner knows whether Salesforce's skills are installed for Codex, and whether an earlier setup left copies of them that Claude Code would load a second time;
- `PROJECT.md` holds the org aliases;
- the API version is written in the two files that hold it.

Where the owner cannot give a value yet, the sections below say what to write in its place.

The setup copy is the project's finished files, built in a temporary folder before anything is put into the project.

Everything else a Salesforce project needs comes with the `salesforce` setup folder: the rules, the three `sf-*` skills, the two org guards, the Salesforce templates in `delivery/`, and `tools/`. A setup folder is a folder in this skill's `assets/` that holds project files at the paths a project has them.

## Contents

- Salesforce's skills
  - Claude Code: the plugins that the project turns on
  - The first time the project is opened on a computer
  - Once on each computer: the plugins are turned off for every other project
  - The plugin's install suggestions
  - Codex: the owner installs the skills
  - Copies of Salesforce's skills from an earlier setup
- The org aliases
- The API version
- Mistakes to avoid

## Salesforce's skills

Salesforce publishes its own skills in the GitHub repository `forcedotcom/sf-skills`. A Salesforce project relies on them for platform questions and Salesforce work. Claude Code and Codex get them in different ways, and setup installs them in neither.

### Claude Code: the plugins that the project turns on

For Claude Code, the repository `forcedotcom/sf-skills` is a plugin marketplace named `salesforce`, and Salesforce's skills come inside its plugins. The ID of a plugin is its name, then `@`, then the name of the marketplace, for example `salesforce-development@salesforce`.

The settings snippet `claude-settings-salesforce.json` puts three things into the project's `.claude/settings.json`. `skills-hooks-settings.md`, "Settings snippets", merges it at step 5 of "New project".

- **The marketplace.** The entry `salesforce` under `extraKnownMarketplaces` names the repository. With it, Claude Code can find the plugins on a computer where the owner never added that marketplace.
- **The seven plugins that the owner uses**, each set to `true` under `enabledPlugins`: `salesforce-development`, `dx-devops`, `experience-lwc`, `integration`, `salesforce-code-quality`, `platform-lightning-widgets`, and `platform-trust-security`. The marketplace holds ten more plugins, and the project turns none of them on. Add or remove a plugin only when the owner asks.
- **Two environment variables** under `env`. Claude Code gives them to every command that it starts in the project, and the hook commands of the plugins are among those commands.
  - `SFDX_AUTO_DEPLOY` is `0`. When that variable is `1`, a hook command of `salesforce-development` deploys each file that is saved under `force-app/` to a sandbox or scratch org: the org that `SFDX_AUTO_DEPLOY_ORG` names, or the default org. That deploy does not go through the agent's shell, so it passes neither the project's org guard nor its permission set check. The value `0` keeps that hook command off. In a session that the Claude desktop app starts, a variable that the app's own launch environment already sets wins over the project's value, so final check 19 in `finishing.md` reads both values in a session.
  - `SF_DISABLE_TELEMETRY` is `true`. The plugin `salesforce-development` collects usage data unless this variable is set. The owner chose to turn that off.

The project turns the plugins on itself, and the owner keeps them off for the rest of the computer. The reason is that the hook commands of these plugins run on every command and every file edit in each project where the plugins are on, which slows a project that has no Salesforce work. In Claude Code, an `enabledPlugins` entry in a project's settings wins over the same entry in the owner's own settings, `~/.claude/settings.json`. So a plugin that is off for the computer is still on in this project.

This project's rules, its three `sf-*` skills, and its two guards still decide what may be deployed or changed. They win over a skill or a plugin of Salesforce's, as the rule `.claude/rules/salesforce-project.md` says.

### The first time the project is opened on a computer

The project's settings turn the plugins on, but a computer must also have the marketplace `salesforce` and the plugins themselves. Tell the owner what the owner does the first time this project is opened in Claude Code on a computer: the owner opens the project, and accepts what Claude Code asks about the folder and about the marketplace `salesforce`. Claude Code reads the marketplace and the two environment variables from the project's settings only after the owner has trusted the folder.

Then check what this computer has, with two commands that change nothing:

- `claude plugin marketplace list` must list the marketplace `salesforce`.
- `claude plugin list` must show each plugin of the snippet, with the status enabled.

In an update, run the two commands after the branch was merged, because the project's main folder holds the new settings only then.

When the marketplace or a plugin is missing, give the owner the commands for what is missing. The owner runs them in a terminal, in the project folder, or tells you to run them:

```text
claude plugin marketplace add forcedotcom/sf-skills
claude plugin install <name>@salesforce --scope project
```

The first command is for a missing marketplace. The second command is run once for each missing plugin. The owner then starts a new session, because a session loads its plugins when it starts.

Do the check, and assume neither result. Claude Code's documentation says that a plugin which is a folder inside the marketplace's repository, as these are, loads from the marketplace with no install. In a test of the toolkit, in sessions with no screen, no plugin of the snippet loaded until it was installed with the command above.

Setup installs nothing unless the owner says so. When the marketplace or a plugin is still missing at the end of setup, add a line to the report, and add a "Waiting on" line to the project's Current State. The project's Current State is the project's one short page of what is true now. `finishing.md`, "The project's Current State", says how to write that line.

### Once on each computer: the plugins are turned off for every other project

The owner wants Salesforce's plugins to run only in Salesforce projects. A plugin that is on for the whole computer runs its hook commands in every project on that computer. So on each computer, Salesforce's plugins are turned off once in the owner's own Claude Code settings, and each Salesforce project turns its plugins on itself.

Turning a plugin off for the computer changes the owner's own settings, outside the project folder. So ask the owner before you do it, on every computer and every time. A yes that the owner gave on another computer or in another project does not count.

Do this step only when the settings file in the project's main folder already turns the plugins on. In a new setup, it does from step 6 of "New project" on. In an update, the merged settings are in a worktree first, so wait until the branch was merged, as `update.md`, "7. Checks and report", says. Before that point, turning the plugins off for the computer would leave this project without them.

1. Run `claude plugin list`. A plugin is on for the whole computer when its row gives the scope `user` and the status enabled, and does not say `Disabled in ~/.claude/settings.json but still loads`. Look for Salesforce's plugins: every ID that ends in `@salesforce`, and `salesforce-development@claude-plugins-official`, which is the same plugin from Anthropic's marketplace under another ID.
2. When none of them is on for the whole computer, the step is already done on this computer. Go on without a question.
3. Otherwise name each of those plugins to the owner, and ask whether to turn them off. Say these things in the question:
   - Turning them off changes the owner's Claude Code settings for every project on this computer.
   - This project keeps the plugins that its own settings turn on.
   - Another Salesforce project on this computer loses the plugins until its own settings turn them on. "Update the toolkit" in that project adds those settings.
   - When `salesforce-development@claude-plugins-official` is one of them, this project would otherwise run that plugin twice, once under each ID.
4. After the owner's yes, run this command for each plugin that the owner agreed to:

   ```text
   claude plugin disable <ID> --scope user
   ```

   Never run it without the owner's yes, and never edit `~/.claude/settings.json` by hand.
5. Run `claude plugin list` again in the project folder. A plugin that the project turns on is still loaded there. Its row may now say `Disabled in ~/.claude/settings.json but still loads`, followed by `project settings enable it, which overrides your user setting`. That text is the wanted result, and it is not an error.

When the owner says no, change nothing, and say in the report that Salesforce's plugins stay on for every project on this computer.

### The plugin's install suggestions

The plugin `salesforce-development` proposes other Salesforce plugins that are not installed, when it judges that one fits the task. The project turns on only the plugins that the owner uses, so the owner may want fewer of these suggestions or none. Tell the owner the command for it, which the owner types in a Claude Code session:

```text
/salesforce-development:plugin-recommendations off
```

With `low` in place of `off`, the plugin proposes less often. With no word after the command, the plugin shows its current level.

### Codex: the owner installs the skills

Codex does not read the project's Claude Code settings, so nothing above reaches Codex. Do this check in every Salesforce project, because every project is set up for Codex too.

Look for Salesforce's skills in `~/.agents/skills` and in the project's `.claude/skills`, which Codex reads through the `.agents/skills` link. When they are not there, tell the owner and give the owner this command, which the owner runs:

```text
npx skills add forcedotcom/sf-skills
```

Setup never installs them itself. When the owner has not installed them yet, add a line to the report, and add a "Waiting on" line to the project's Current State, as for a plugin that is missing.

### Copies of Salesforce's skills from an earlier setup

Earlier versions of setup told the owner to run `npx skills add forcedotcom/sf-skills` for Claude Code too. That command may have put copies of Salesforce's skills into `~/.claude/skills` or into the project's `.claude/skills`. Claude Code loads such a copy beside the plugin that holds the same skill, and then lists that skill twice.

Look in both folders for skills that come from `forcedotcom/sf-skills`. The project's three `sf-*` skills are the toolkit's own, and they are not such copies. Tell the owner what you found, and let the owner decide what happens to the copies. Change nothing in either folder without the owner's yes.

## The org aliases

Ask the owner for the org aliases in the interview, as `interview.md`, "Question 4: Salesforce", says. Write them while you build the setup copy, at the point that `setup-copy.md`, "The project name and "Toolkit settings"", gives.

The aliases go in `PROJECT.md`, section "Toolkit settings", on the "Salesforce org aliases" line, as one nested line per org. Each nested line holds the alias, which org it is, and its purpose. Mark production. For example:

```text
- Salesforce org aliases:
  - `acme-uat`: the UAT sandbox; agents deploy here for testing.
  - `acme-prod`: production.
```

Use only the aliases the owner names for this project.

- When none of this project's orgs is on this computer yet (the org does not exist or is not connected), never invent an alias, and never write an alias that the owner says belongs to another project into this project's files. Write ``- Salesforce org aliases: `none yet` ``.
- The owner's step "Connect the project's Salesforce org" then gets a "Waiting on" line in the project's Current State, and the report lists the line as a prompt left. `finishing.md`, "The project's Current State", says how to write the "Waiting on" line.
- When the owner gives an instruction about what an agent may do in an org (for example "don't use those" about the other orgs), write it into `.claude/rules/salesforce-agent-permissions.md`, in the place that the first bullets of that file give.

Leave `.claude/protected-orgs.json` as copied, because the guard finds production orgs itself and blocks them. `.claude/rules/salesforce-agent-permissions.md` says what an agent may do in each kind of org, in Claude Code and in Codex.

## The API version

The copied files hold the API version as `XX.0`. Fill it in two files.

1. Read the API version from the sandbox with a command that only reads. The version is the `apiVersion` field of the output of this command:

   ```text
   sf org display -o <sandbox alias> --json
   ```

   - `<sandbox alias>` is only the sandbox alias the owner gave for this project. Never run `sf org display`, or any `sf` command with `-o` or `--target-org`, against an org the owner did not name for this project, even to read one value. The other orgs on this computer may belong to another client.
   - When there is no sandbox yet, or the command fails, say that you could not read the version from an org, and ask the owner which API version the project uses. Never call a version the newest or the current one from memory, because Salesforce adds a new API version three times a year.
   - When the owner does not know the version yet, leave `XX.0` in both files, add no other line anywhere, and list it in the report as a prompt left.
   - A project that already had its own `sfdx-project.json` keeps its `sourceApiVersion`. For such a project, skip step 1, leave `sfdx-project.json` as it is, and write that version in the `package.xml` only.
2. Write the version in two places:
   - in `sfdx-project.json`, as the `sourceApiVersion` value;
   - in `delivery/deployments/full-project-deployment-template/package.xml`, on the `<version>` line.

Leave `XX.0` in the two work item templates, `delivery/deployments/work-item-deployment-template/package.xml` and `destructiveChanges.xml`. Each copy of them fills the version from `sfdx-project.json`, as its fill-in guide says.

## Mistakes to avoid

- Setup only reads orgs (`sf org list`, `sf org display`). Never run a deploy, a data command, or anything that changes an org during setup.
- A Salesforce platform question is for Salesforce's skills, not for setup.

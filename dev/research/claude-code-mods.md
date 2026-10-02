# Claude Code mods: what they are and what they can do

Written 2026-10-02 for Toolkit V2. Research only: nothing in this repository
was built, installed, or changed because of it. It turns the mods pages
captured in `ai-external-knowledge/claude-code/mods/` into one plain guide.

## Contents

1. How to read this guide
2. The short version
3. What a mod is, and what changed
4. What a mod can show and change on screen
5. How a mod is written
6. Where a mod lives, how it loads, and how it reloads
7. Turning mods on and off
8. Every event a mod can attach to
9. Can a mod block, change, or add to a tool call, a prompt, or a reply?
10. Files, commands, the network, models, and MCP tools
11. Where mods run, and where they do not
12. Security, permissions, trust, and limits
13. Mods compared with settings hooks, skills, MCP servers, and plugins
14. Versions, plans, and early-access status
15. Every example the docs give
16. Where the docs are silent
17. Where the sources disagree
18. Facts that bear on Toolkit V2

---

## 1. How to read this guide

- A citation such as (`mods/overview.md`, "Where mods run") means the file
  `ai-external-knowledge/claude-code/mods/overview.md` and the section with
  that heading. `mods/SOURCE-RECORD.md` gives each file's web address.
- `claude-code/hooks.md` and similar paths are older captures in the parent
  folder `ai-external-knowledge/claude-code/`. `codex/hooks.md` is in
  `ai-external-knowledge/codex/`.
- **Observed** marks something seen on this Mac on 2026-10-02. It is not in
  the captured pages.
- **Second source** marks the `plugin-authoring` skill that ships inside
  Claude Code (build 2.1.286, read from this session). The task allowed it as
  a second source only. Where it and the captured pages differ, the captured
  pages win, and section 17 lists the difference.
- "The docs do not say" means none of the captured pages answers the
  question. This guide does not guess.

## 2. The short version

- A mod is a Claude Code plugin that carries a small program, written in
  JavaScript or TypeScript, which Claude Code runs inside itself
  (`mods/overview.md`, opening paragraph).
- That program can watch, change, or replace what Claude Code is about to
  do: a tool call, a prompt, a request to the model, a command, and what the
  screen draws (`mods/events.md`, opening paragraph and "How a hook handles
  an event"; `mods/overview.md`, "Compare mods, settings hooks, skills, and
  MCP servers").
- It can draw its own controls: a side panel with buttons and text fields,
  a strip above the prompt, a line under the prompt, and pop-up notices
  (`mods/interface.md`; `mods/api.md`, "Show something without starting a
  turn").
- It runs with your full permissions and is not sandboxed. It can read and
  write any file you can, start programs, use the network, and approve tool
  calls before you are asked (`mods/overview.md`, "What a mod can reach").
- Mods need Claude Code v2.1.287 or later and are on by default from that
  version (`mods/overview.md`, "Turn mods on or off"). **Observed:** the
  `claude` command on this Mac printed `2.1.280`, and this desktop session
  ships build 2.1.286. Both are older than 2.1.287.
- Mods work in the terminal and the desktop app's Code tab. Their hooks also
  run in the VS Code extension, `claude -p`, the Agent SDK, and cloud
  sessions, but nothing they draw appears there (`mods/overview.md`, "Where
  mods run").
- Mods are a Claude Code feature. The captured pages never mention Codex,
  and Codex's own hooks run only shell commands and MCP tool calls (calls
  to a tool on an MCP server, an outside program that gives the agent
  tools) (`codex/hooks.md`, "Config shape").

## 3. What a mod is, and what changed

**In one paragraph.** A mod is a plugin (a folder Claude Code loads, with a
`.claude-plugin/plugin.json` file that names it) whose
`hooks/hooks.json` file lists a code file under a key called `modules`.
That code file is called the hooks module. Claude Code calls its
`register` function once when the mod loads, and the function registers
event handlers, called hooks. Claude Code then runs a hook each time its
event happens, such as when Claude is about to use a tool or when the
spinner is drawn, and the hook decides whether to let the event continue,
change it, or answer it itself (`mods/overview.md`, opening paragraph and
"How a mod works"; `mods/create.md`, "Tell Claude Code where your code
is").

**What changed with this feature.**

- Before mods, a plugin's hooks were only "settings hooks": a shell
  command, an HTTP request, an MCP tool call, a prompt to a model, or a
  subagent, set up in a JSON file and run outside Claude Code
  (`claude-code/hooks.md`, "Hook handler fields"; `mods/overview.md`, "What
  a mod can do"). A mod's hooks are
  functions that run inside Claude Code's own process (`mods/overview.md`,
  the Note under the opening paragraph).
- The docs now use two names. "Hook" on the mods pages means a mod's
  function. The older kind is now called a "settings hook"
  (`mods/overview.md`, the same Note).
- Settings hooks keep working, side by side with mods. "Nothing about them
  is deprecated" (`mods/admin.md`, "Know which controls still apply").
- What only a mod can do: draw controls you can use, redraw parts of
  Claude Code's own screen, hold or answer a tool call or a model request
  from inside, add a `/command` that runs at once with no Claude turn, and
  share data between its hooks through ordinary variables
  (`mods/overview.md`, "What a mod can do").
- Some of Claude Code's own features are now built as mods, such as `/diff`
  and `AGENTS.md` support (`mods/overview.md`, "Mods built into Claude
  Code").
- Mods are on by default from v2.1.287. During early access an
  environment variable, `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS`, switched them;
  v2.1.287 and later ignore it (`mods/overview.md`, the Note at the end of "Turn mods on or
  off").

## 4. What a mod can show and change on screen

A "render site" is a place on screen where a mod can draw. Claude Code fires
an event called `ui.render` each time it is about to draw a render site, and
the mod's hook returns what to draw (`mods/interface.md`, opening
paragraph). What a hook returns is an "element tree": a description of boxes,
text, and controls nested inside each other (`mods/interface.md`, "Build a
tree from elements").

### 4.1 Each kind of on-screen output

| Kind | What it is | How a mod makes it | What it cannot do |
| --- | --- | --- | --- |
| Pane | A sidebar beside the transcript in a wide fullscreen terminal, or a framed area above the prompt otherwise. Several open panes each get a tab (`mods/interface.md`, "Pick where to draw", Pane tab). | `$.ui.open({ id })`, then a `ui.render` hook filtered to `{ component: 'Pane' }` that checks `e.requestId` (same section). Optional fields: `title`, `focus`, `closeOnEscape`, `holdToasts`, `rows`, `columns` (`mods/interface.md`, "Open a pane at the right time"). | It draws nothing until a hook fills it. A pane the mod opens by itself (from a timer or a turn event) appears only in a terminal at least 144 columns wide, or 110 once the user has opened it before (`mods/interface.md`, "When a pane waits for a wider terminal"). `focus`, `closeOnEscape`, and `holdToasts` accept only `true` (same page, "Open a pane at the right time"). Claude Code grants `focus: true` only while the prompt is empty and nothing else has keyboard focus (same page, "How a pane gets keyboard focus"). |
| Band above the prompt | A strip directly above the prompt box. It is always there, and every mod shares it (`mods/interface.md`, "Pick where to draw", Band tab). | A `ui.render` hook filtered to `{ component: 'AbovePrompt' }` that returns a tree, or `next(e)` to show nothing (same section). | A tree replaces what mods later in the order draw there. To keep theirs, the mod must include `await next(e)` inside its own tree (same section). A sample README says that when another mod also draws there, "only one of them shows" (`mods/sample-replay-theater.md`, "Notes / limitations"). |
| Status line under the prompt | One line under the prompt that stays until changed, starting with `⚠` and the mod's name (`mods/api.md`, "Show something without starting a turn"). | `$.ui.status(text)` from any hook or timer (same section). | The documentation pages do not say whether several mods can each keep a line, or how to clear one. The GitHub types file says each plugin keeps one line, and passing `undefined` removes it (`mods/types-claude-code.d.ts`, the `status` method of `$.ui`). That file is older than the docs (section 17). **Second source:** the same. This is not the same thing as Claude Code's custom status line setting, which `disableAllHooks` also stops (`mods/overview.md`, "Turn mods on or off"). |
| Toast | A small notice at the top right of the transcript, with the mod's name above the text, that disappears after a few seconds (`mods/api.md`, "Show something without starting a turn"). | `$.ui.toast(text)` (same section). | Shown for 4 seconds unless the mod passes `{ timeoutMs }` (`mods/reference.md`, "Limits"). A pane opened with `holdToasts` holds toasts until it closes (`mods/interface.md`, "Open a pane at the right time"). |
| Log line in the transcript | A dim line starting with `●` and the mod's name. Claude does not read it (`mods/api.md`, "Show something without starting a turn"). | `$.ui.log(text)`. With `{ to: 'debug' }` the line goes to the debug log instead (`mods/troubleshoot.md`, "Read the debug log"). | Claude never reads it, so it cannot pass information to Claude (`mods/api.md`, same section). |
| Command reply | Text printed in the transcript after a `/command` the mod added, which Claude also reads (`mods/api.md`, "Add a command"). | Return `{ text }` from a `command.run` hook; `{}` prints nothing (same section). | Claude Code puts the plugin's name in front of the text (`mods/create.md`, "Try the mod" step). |
| Question dialog | The dialog Claude uses to ask you something, with numbered options, a row for typing another answer, and a "Chat about this" row (`mods/events.md`, "Hold a tool call until the user decides"). | `$.ui.ask(question, options)`, which resolves to the label the user picks or the text they type (same section). | It rejects when the user dismisses it, picks "Chat about this", or in a `claude -p` run (same section). |
| Redraw of Claude Code's own parts | Messages, tool call rows and results, command output rows, the question dialog, the spinner, a running tool's progress line, the turn's closing line, notices under the logo, mode labels in the footer, and the hint line under the prompt (`mods/interface.md`, "Change what Claude Code already draws"). | A `ui.render` hook filtered to the site's name. It can change a detail (pass changed `props` to `next`), replace the drawing (return its own tree), or leave it alone (`next(e)`) (same section, three tabs). | It cannot touch the permission prompt, which is not a render site (same section, after the tabs; `mods/overview.md`, "What a mod can reach"). A replaced question dialog must still contain Claude Code's own drawing exactly once, with the mod's elements above it, or Claude Code draws its own (`mods/interface.md`, same section). The prompt box itself "is Claude Code's own" (`mods/interface.md`, the screen map's description). |

The full list of render sites, with the data each one passes in `e.props`
and the apps that draw it, is in (`mods/reference.md`, "Render sites").
These work in both the terminal and the desktop app: `Pane`,
`AbovePrompt`, `UserMessage`, `AssistantMessage`, `ToolUse`, `ToolResult`,
`ToolGroup`, `CommandOutput`, `AskUserQuestion`, `Spinner`, `SessionMode`,
and `PromptHint`. These work in the terminal only: `ToolProgress`,
`TurnDuration`, and `InfoNotice`.

### 4.2 Building blocks a drawing can use

A mod gets these from `$.ui.resolve(e)` inside its `ui.render` hook
(`mods/interface.md`, "Build a tree from elements"; `mods/reference.md`,
"Elements"):

| Element | What it draws | Terminal | Desktop app |
| --- | --- | --- | --- |
| `Box` | A container that lays out what is inside it in a row or a column, with gaps, padding, borders, and colors | Yes | Yes |
| `Text` | Styled text: color, bold, italic, underline, dim, inverse, wrapping | Yes | Yes |
| `Button` | A control that runs the mod's `onPress` function, with an optional one-key `hotkey` | Yes | Yes |
| `Link`, `Code`, `Markdown` | A link, a code block or a diff in Claude Code's colors, and text formatted like Claude's replies (up to 10,000 characters) | Yes | Yes |
| `Input`, `Select` | A one-line text field and a dropdown | Yes | Yes |
| `Svg` | An SVG picture, up to 131,072 characters | No | Yes |
| `Client` | An area drawn by a second file of the mod, for animation and mouse input. That file gets no mods API and reaches the hooks only by posting data, which arrives as a `ui.message` event | Yes | Yes |
| `Raster`, `Image` | A grid of colored character cells (up to 512 by 256), and a PNG or raw-pixel picture (up to 2 MiB) | Yes | No |

If a tree uses an element the app does not have, a property the element
does not take, or a child where none belongs, Claude Code draws its own
version of that site instead (`mods/interface.md`, "Build a tree from
elements").

### 4.3 Keyboard and redraw rules

- A mod never reads the keyboard itself. Claude Code decides which control a
  key is for and runs that control's function. That happens only while the
  mod's pane or band has keyboard focus, apart from a digit hotkey on the
  band (`mods/interface.md`, "Keyboard focus and hotkeys").
- Tab moves between controls, Up and Down move or scroll, Enter presses,
  and Esc gives focus back to the prompt. A mod cannot rebind Tab or the
  arrow keys (same section, "What each key does").
- A drawing shows what the hook returned the last time it ran. Claude Code
  runs the hook again when the site's data or the terminal's width changes. Otherwise the mod asks with
  `$.ui.invalidate('ui.render')`, or uses `$.state`, which redraws by itself
  (`mods/interface.md`, "Redraw a site").
- Redraws are limited to 10 a second, or 30 a second in the terminal for
  the visible pane, the expanded band, and the hint line. Faster requests
  are merged into one (`mods/reference.md`, "Limits").

## 5. How a mod is written

### 5.1 The files

A mod is a plugin folder with three required files (`mods/reference.md`,
"Files"; `mods/create.md`, "Write a mod yourself"):

| File | What it holds |
| --- | --- |
| `.claude-plugin/plugin.json` | The plugin's manifest (its name, version, description). Mods add no required fields. |
| `hooks/hooks.json` | `"modules": ["./register.js"]`: one path to the hooks module, relative to this file. Having this key is what makes the plugin a mod. The same file can also hold settings hooks under `hooks`. |
| The hooks module, such as `hooks/register.js` | The code. It exports `register(on, options)`. |

Two optional kinds of file (`mods/reference.md`, "Files"):

- `types/index.d.ts`, named by `types` in the manifest, which a mod needs
  when it keeps values in `$.state` or adds methods to the mods API.
- Test files whose names end in `.test.ts` or `.test.tsx`.

`options`, the second argument to `register`, holds the values of the
`userConfig` fields the manifest declares, with defaults filled in
(`mods/reference.md`, "Files"). An administrator or user sets them under
`pluginConfigs` in a settings file (`mods/reference.md`, "Settings and
environment variables").

### 5.2 The language

- JavaScript or TypeScript, as an ES module (a file that uses `import` and
  `export`, never `require`). Allowed endings: `.js`, `.mjs`, `.cjs`, `.jsx`,
  `.ts`, `.mts`, `.cts`, `.tsx` (`mods/reference.md`, "Files").
- No Node.js, no bundler, and no build step: Claude Code loads `.js` and
  `.ts` files directly (`mods/create.md`, opening list).
- The module has no Node.js APIs, no timer globals such as `setTimeout`, and
  no file or network access of its own. Standard web APIs such as `URL`,
  `TextEncoder`, `AbortController`, and `crypto.subtle` work
  (`mods/api.md`, "Reach files, processes, and the network").
- A `.tsx` or `.jsx` module can write drawings as JSX (an HTML-like way of
  writing element trees) (`mods/interface.md`, "Build a tree from
  elements").

### 5.3 The shape of a hook

Each call to `on` registers one hook: `on(eventName, matcher?, hook)`
(`mods/reference.md`, "The hook function"). Every hook receives three
things (`mods/create.md`, "How the example mod works"):

- `$`, the mods API: every method a mod can call to reach outside itself,
  grouped by area, such as `$.ui` and `$.fs`.
- `e`, the event's data, frozen so it cannot be changed in place. To change
  it, the hook passes a changed copy on (`mods/events.md`, "Rewrite an
  event").
- `next`, a function that passes the event to the next mod's hook and, at
  the end, to Claude Code's own behavior, and gives back the result.

The docs call this chain of hooks a "middleware chain": each hook runs
before the next one and decides whether to pass the event along
(`mods/events.md`, "How a hook handles an event"). A hook does one of three
things (`mods/overview.md`, "What a hook can do with an event"):

- **Observe:** do its work and return `next(e)` unchanged.
- **Rewrite:** call `next` with a changed copy of `e`, or change the result
  `next` gave back.
- **Answer:** return its own result without calling `next`, so later mods
  and Claude Code's own behavior do not run.

A "matcher" is the optional second argument: an object whose fields must
all match the event's fields. A field can be one value, a list of allowed
values, or a regular expression (`mods/events.md`, "Filter which events a
hook handles"). Example: `{ tool: ['Edit', 'Write'] }`.

`next` also carries `next.signal` (stops long work when the event is
abandoned), `next.origin` (who fired the event), `next.budget` (the time
left), and, for organization mods only, `next.to(e, tier)` to skip ahead
(`mods/reference.md`, "The hook function").

### 5.4 Rules that let Claude Code read a mod before it runs

Claude Code reads a mod's source code before running it, to list every event
it handles and every API method it calls. This reading is called static
analysis. For it to work, a mod must follow these rules (`mods/create.md`,
"Check what Claude Code reads from your mod"):

- Write each API call in full, such as `$.store.get('notes')`. Never copy
  `$` or part of it into a variable, never destructure it, and never pass it
  to a method, an inner function, or an imported function (except the
  `$.state` helpers).
- Write each event name as a fixed text value, never a variable or a loop.
- Do not declare a second `on` inside `register`.
- Import only the mod's own files by relative path, plus `claude-code` for
  types and a few helpers. No dynamic `import()`.

Claude Code refuses to load a mod that uses the API in a way this check
cannot read (`mods/admin.md`, "Review what a mod can do").
`claude plugin validate <folder>` runs the same check from the shell and
prints a `hooks:` line and a `calls:` line, plus `env reads:`, `env writes:`,
`state reads:`, and `state writes:` lines when they apply (`mods/create.md`,
same section).

### 5.5 Keeping values

| Where | How long it lasts | Source |
| --- | --- | --- |
| A variable in the module | Until the module reloads, which happens on every save during development | `mods/interface.md`, "Keep state" |
| `$.state` | Until the session ends or the user runs `/clear`, `/resume`, or `/branch`. It survives a reload, and a drawing that reads it redraws when it changes. Every value must be declared in `types/index.d.ts`. | `mods/interface.md`, "Keep a value in `$.state`" |
| `$.store` | Until the mod deletes it, or no session uses the store for `cleanupPeriodDays`. Saved as a JSON file under `~/.claude/plugins/store/`, up to 4 MiB, shared by every session on the machine. | `mods/interface.md`, "Keep state"; `mods/reference.md`, "Limits" and "Mods API methods" |

Two sessions that read, change, and write the same `$.store` key can
overwrite each other, because a read followed by a write is not atomic
(done as one step) (`mods/interface.md`, "Save from more than one session").

### 5.6 Types and tests

- Each time Claude Code loads a mod from a `--plugin-dir` folder, or a mod
  Claude wrote, it writes TypeScript declaration files into
  `.claude-plugin/types/` inside the mod, describing the exact events and
  methods of the running version (`mods/create.md`, "Get type definitions
  for your version"). The docs say to trust these files over any page,
  because "the events and methods can change between releases" (same
  section).
- `claude plugin test` runs a mod's `*.test.ts` files from the shell, with
  no session, sign-in, or network. A test fires events through the mod's
  hooks and uses "stubs" (stand-in answers) for anything Claude Code would
  normally answer, such as a model call or the store. Each test has a
  5-second limit unless it sets `timeoutMs`, and the command exits with
  status 1 when a test fails, so it works in automated checks
  (`mods/test.md`, "Write a test"; `mods/reference.md`, "Limits").
- The test kit can also move a fake clock forward, draw a render site and
  press its buttons in both the terminal and the desktop app, and test an
  organization's policy mod against other mods (`mods/test.md`, "Test a
  timer", "Test a drawing", "Test a policy mod").

## 6. Where a mod lives, how it loads, and how it reloads

A mod is a plugin, so it lives wherever a plugin can live. The mods pages
name these places:

| Where | How it loads | Reloads on save? | Source |
| --- | --- | --- | --- |
| A mod Claude writes in a session | Claude writes it under `~/.claude/dev-mods/<session id>/<mod name>/`. When the first file is saved, Claude Code asks whether to turn on hot reloading for the session. On "Enable for this session" the mod loads at the end of the turn; on "Not now" it loads the next time that session starts. It loads only in that session, and the folder is deleted after `cleanupPeriodDays`. | Yes, at the end of each turn that changes it | `mods/create.md`, "Ask Claude for a mod" and "Use the mod in other sessions" |
| A folder passed with `claude --plugin-dir <folder>` | Loads for one session without installing. The flag can be repeated. | Yes: Claude Code watches the folder and reloads the hooks module when a file changes | `mods/create.md`, "Load the mod" and "How the example mod works"; `mods/reference.md`, "Commands" |
| Folders named in `CLAUDE_CODE_PLUGIN_DIRS` | The same as `--plugin-dir`, for apps you cannot pass a flag to. Absolute paths, separated by `:` on Mac and Linux. Read from the environment or from `env` in `~/.claude/settings.json`. | They load "as `--plugin-dir` does". Setting `CLAUDE_CODE_PLUGIN_DIR_WATCH=1` makes a long-running non-interactive session reload them on save. | `mods/reference.md`, "Settings and environment variables" |
| A plugin installed from a marketplace (a catalog of plugins) | `/plugin install <name>@<marketplace>` or `claude plugin install`. Scopes: user (every project on this machine), project (everyone in this repository, recorded in `.claude/settings.json`), or local (you, in this repository only). | No. Claude Code caches an installed plugin by version, so edits do not reach it until the version is raised and the plugin installed again. After an install from the shell, `/reload-plugins` loads it into an open session. | `mods/overview.md`, "Install or update a mod"; `mods/plugins-install.md`, "Choose an install scope"; `mods/create.md`, "Share your mod" |
| A plugin in a marketplace added from a local folder, listed by a relative path | Loads in place from that folder, not from a cached copy. Edits take effect at the next session start or `/reload-plugins`, without a version change. | The plugin loading page says "next session start or `/reload-plugins`". The mods pages do not say whether such a hooks module is watched for saves. | `mods/plugins-loading.md`, "In-place and copied plugins" |
| A plugin folder under `~/.claude/skills/<name>/` or a project's `.claude/skills/<name>/` (a "skills-directory plugin", id `<name>@skills-dir`) | Loads in every session, or in that project after the workspace trust prompt, with no install step. | The mods pages do not mention this place. The skills page, captured on 2026-09-27 before mods were documented, says changes to such a folder's `hooks/` need `/reload-plugins` (`claude-code/skills.md`, "Edit a skill during a session"). **Second source:** such a plugin is watched and reloads on save like a `--plugin-dir` folder (section 17). | `mods/plugins-create.md`, "Make a plugin load in every session" and "Share the plugin through a repository"; `mods/plugins-loading.md`, "Find where a plugin came from" and "Plugins shared through a repository" |
| An Agent SDK app that passes the `plugins` option | Loads for that session as an `@inline` plugin | The docs do not say | `mods/plugins-loading.md`, "Find where a plugin came from"; `mods/agent-sdk-plugins.md` |

What a reload does (`mods/create.md`, "How the example mod works";
`mods/troubleshoot.md`, "Read the debug log"; `mods/api.md`, "Stop
background work"):

- `register` runs again, so module variables start over and `session.start`
  fires again for that mod.
- Timers started by the old copy stop.
- A transcript line names the mod and lists its hooks.
- If a save breaks the module, the line says `reload failed, the previous
  version stays loaded:` with the reason, and the last working version keeps
  running.

Editing a mod in the `--plugin-dir` folder or under `~/.claude` makes
Claude Code ask before each file Claude writes in `default` and
`acceptEdits` permission modes, because both are "protected paths"
(`mods/create.md`, the Note in "Describe the mod" and "Change a mod with
Claude"; `mods/permission-modes.md`, "Protected paths").

## 7. Turning mods on and off

- **Version.** Mods need v2.1.287 or later and are on by default there
  (`mods/overview.md`, "Turn mods on or off").
- **One mod.** Disable or uninstall its plugin in the **Installed** tab of
  `/plugin` (same section).
- **Every installed mod, one session.** Start with `--safe-mode`, which
  also turns off other customizations (same section). `--bare` also stops
  installed mods (`mods/troubleshoot.md`, "Refusal messages").
- **Every installed mod, every session.** Set `"disableAllHooks": true` in
  `~/.claude/settings.json`. Settings hooks and the custom status line stop
  too; what an organization manages keeps running (`mods/overview.md`, same
  section).
- `disableAllHooks` and an organization's `allowManagedModsOnly` stop only
  the mod. The plugin stays installed, and its skills, commands, agents, and
  MCP servers still load (same section).
- **Built-in mods** are not stopped by `disableAllHooks`, `--bare`, or
  `--safe-mode`. Each has its own switch in `/plugin` (`mods/overview.md`,
  "Mods built into Claude Code").
- **Checking.** `/plugin` shows a line such as `1 mod active · first-mod`
  under its tabs (`mods/overview.md`, "See which mods a session loaded").
  `claude plugin test`, run in a folder with no mod, prints whether mods can
  load on this machine (`mods/troubleshoot.md`, "Check whether mods can
  load").
- **Remote switch.** Anthropic can turn installed mods off remotely, and no
  setting on the machine turns them back on (`mods/troubleshoot.md`, "Check
  whether mods can load" and "Refusal messages").
- **Organization settings.** `allowManagedModsOnly`, `allowManagedHooksOnly`,
  `disableAllHooks` in managed settings, and `disableSideloadFlags` each
  stop some or all mods (`mods/admin.md`, "Choose how much to allow").

The built-in mods (`mods/overview.md`, "Mods built into Claude Code"):

| Name in `/plugin` | What it does | How to turn it off |
| --- | --- | --- |
| `cc-plugin-agents-md` | Loads `AGENTS.md` as project instructions | Disable in `/plugin`, or choose which instruction files load |
| `cc-plugin-diff` | Takes over `/diff` and draws its pane | Disable in `/plugin`; the older built-in `/diff` answers instead |
| `cc-plugin-plugin-authoring` | Gives Claude the `plugin-authoring` skill for writing mods (a skill, no mod code) | Disable in `/plugin` |
| `cc-plugin-sec-default` | The built-in guard that protects what an organization manages from users' mods | Cannot be turned off by a user |
| `cc-plugin-telemetry` | Sends the analytics records Claude Code and its built-in mods log | Disable in `/plugin`, or turn analytics off |
| `cc-plugin-you-should-know` | A side agent that watches longer tasks and shows a note above the prompt when it finds something you might miss. Off by default. | Disable in `/plugin` |

## 8. Every event a mod can attach to

These tables come from (`mods/reference.md`, "Events") unless another file
is named. "Returns" is what a hook may give back instead of `next(e)`.

### 8.1 Tools

| Event | When it fires | Data the hook receives | Returns |
| --- | --- | --- | --- |
| `tool.call` | A tool is about to run, including a subagent's calls and MCP tool calls | `e.tool` (the tool name) and the tool's arguments as fields, such as `e.command` for Bash (`mods/events.md`, "Guard or change a tool call") | `{ deny: reason }`, `{ result }`, or `next` with changed arguments |
| `tool.check` | Claude Code decides whether a call may run, after `tool.call` hooks, `PreToolUse` settings hooks, the rules, and the permission mode. `next(e)` gives the decision they reached. | `e.input`, the tool's arguments (`mods/events.md`, "Approve or refuse a tool call before the user is asked") | `{ decision }`: `allow`, `ask`, or `deny` |
| `tool.describe` | Once per tool, when its description is first sent to Claude | The docs do not say | `{ description }` |

### 8.2 Prompts and what Claude reads

| Event | When it fires | Returns |
| --- | --- | --- |
| `prompt.submit` | A prompt is submitted. `e.text` is what was typed (`mods/events.md`, "Rewrite or add to a prompt"). | Changed `text`, added `context` (text only Claude reads), or `{ drop: reason }` |
| `prompt.fill`, `prompt.suggest` | Text is about to go into the prompt box as a draft or a dim suggestion | `next(e)` with changed text |
| `prompt.edit` | The user edits the prompt box | `next(e)` |
| `prompt.compose` | Claude Code builds a system prompt | `{ sections }`, a list of `{ id, text, scope }` |
| `prompt.section` | Once per named section of the system prompt; `e.name` is its id | `{ text }`, or `{ text: null }` to drop the section |
| `prompt.context` | Once per conversation, for the context sent with the first message | `{ blocks }` |
| `prompt.attachment` | Claude Code adds a message of its own for Claude, such as a reminder. `e.type` names the kind; `e.detail` holds the facts for some kinds. | `{ text }`, or `{ text: null }` to drop it |
| `skill.prompt` | A skill's text is expanded for Claude | `{ text }` |
| `attribution.text` | Claude Code writes commit or pull request attribution text | `{ text }` |

Text from these hooks that changes between requests breaks the prompt cache
(the saved copy of earlier input that makes later requests cheaper)
(`mods/events.md`, "Rewrite or add to a prompt").

### 8.3 Commands and configuration

| Event | When it fires | Returns |
| --- | --- | --- |
| `command.run` | A command is about to run. `e.args` is the text typed after the name (`mods/api.md`, "Add a command"). | `{ text }`, `{}`, or `next(e)` |
| `command.describe` | Once per command, for the command list | `{ description, argumentHint, isHidden }` |
| `config.set` | A `/config` row is about to change | Changed `value`, or `{ deny: reason }` |
| `config.describe` | Once per `/config` row | `{ label, description, isHidden }` |

### 8.4 Turns

A turn is everything Claude does in answer to one prompt (`mods/events.md`,
"Follow a turn").

| Event | When it fires | Data | Returns |
| --- | --- | --- | --- |
| `turn.start` | A turn begins | `e.turnId` | `next(e)` |
| `turn.step` | One request is about to go to the model. A turn with tool calls has several. | `e.agentId` for a subagent's request; the result's `usage` has token counts and the model | Forward the streamed reply (`yield* next(e)`), send it to another model or effort (`next({ ...e, model })`), or answer without calling the model |
| `turn.complete` | A turn ended, including one the user interrupted | `e.answer` (Claude's final text), `e.durationMs`, `e.usage`, `e.isAborted`, `e.agentId` for a subagent | `{ text }` shows a line under the answer |

Hooks on `turn.step` and `process.spawn` must be async generators (functions
written `async function*` that pass on a stream piece by piece)
(`mods/reference.md`, "Events").

### 8.5 Session

| Event | When it fires | Returns |
| --- | --- | --- |
| `session.start` | Once per loaded mod, before the first prompt, and again after a reload. Not after `/clear`, `/resume`, or `/branch`. Claude Code waits for it, so commands and tools registered here exist from the first turn (`mods/api.md`, "Add a command or a tool"). | `next(e)` |
| `session.end` | The session ends, or `/clear`, `/resume`, or `/branch` runs. `e.reason` says which. | `next(e)` |
| `session.compact` | The conversation is about to be compacted | `{ skip: reason }` |
| `session.receive`, `session.send` | A message arrives from, or is about to go to, another session or agent | `{ consumed: reason }` keeps a received message from Claude; `{ isDelivered: false, reason }` stops a sent one |
| `session.append` | Once per row the conversation keeps (a prompt, a response block, a tool result, a notice), before it is stored | `next` with a changed `message` to rewrite the row's content |
| `session.attach`, `session.detach` | Another app connects to or leaves the session | `next(e)` |
| `session.measure` | After each turn, and when a plan limit's percent used changes | `next(e)` |

### 8.6 Subagents

| Event | When it fires | Returns |
| --- | --- | --- |
| `agent.offer` | A subagent type is offered to Claude | `{ isOffered: false }` hides it |
| `agent.spawn` | A subagent is about to start | `{ model }` or `{ deny: reason }` |

### 8.7 Interface

| Event | When it fires |
| --- | --- |
| `ui.render` | A render site is about to be drawn |
| `ui.resolve` | Mods load, once per app, render site, and mod; the result is the element table |
| `ui.press`, `ui.input`, `ui.select` | A `Button`, `Input`, or `Select` a mod drew is used. Another mod's hook on these runs before the drawing mod's own function, so it sees what the user types into that mod's field (`mods/interface.md`, "Respond to presses and typing"). |
| `ui.focus`, `ui.scroll` | Focus or scroll position is about to change |
| `ui.close` | A pane is about to close |
| `ui.message` | A `Client` element posts data to its mod |

### 8.8 Other mods, telemetry, settings hook events, and API calls

| Event | When it fires | Returns |
| --- | --- | --- |
| `plugin.register` | Another hooks module is about to load. `e.uses` lists its events, API calls, environment variables, and state. | `{ refuse: reason }` |
| `engine.create` | The mods API is being built for a mod | A changed API, to add or withhold an area |
| `telemetry.log`, `telemetry.mark` | A usage record is about to be logged. A user's mod must filter with `{ to: 'collector' }`. | `next(e)` or `{ deny: reason }` |
| `classic.<Event>`, such as `classic.Stop` | The settings hook event of the same name. `e` is the JSON a settings hook gets on standard input, including `transcript_path` (`mods/events.md`, "Handle the settings hook events"). | The docs do not list what each can return |
| Every mods API method, such as `fs.read` or `model.complete` | Another mod later in the order calls that method | `next(e)`, `{ deny: reason }`, or `{ value }` |

Wildcards: `'classic.*'` matches every settings hook event, and `'*'` matches
every event except telemetry. Registering the same event twice with no
matcher stops the module from loading (`mods/events.md`, "Filter which
events a hook handles").

### 8.9 The order hooks run in

Hooks on the same event run one after another. The first mod sees the event
first and the result last, and can stop the others from running
(`mods/events.md`, "The order mods run in"). The order:

1. The built-in guard `sec-default@builtin` where it loads, then mods in the
   organization's `prependPlugins` list, then other organization mods.
2. Mods the user installed. Among them, a mod runs before the mods it lists
   as dependencies. Inside one module, hooks run in the order `register`
   added them.
3. Mods in the organization's `appendPlugins` list.
4. Other built-in mods.

Settings hooks sit at fixed points (`mods/events.md`, "Where settings hooks
run in the order"):

- `PreToolUse` hooks from managed settings run before the first mod's
  `tool.call` hook, and their block is final.
- `PreToolUse` hooks from every other settings file and from plugins'
  `hooks/hooks.json` run after the last mod calls `next`. A mod that answers
  a tool call without calling `next` keeps them from running.
- `tool.check` fires after those hooks and the rules have decided.

### 8.10 When a hook fails

A hook that throws an error, runs past its time limit, or returns the wrong
shape does not break the session. If it failed before calling `next`,
Claude Code skips it and the next handler runs. If it failed after `next`
gave a result, that result stands (`mods/events.md`, "Handle a hook that
fails"). So a guard fails open (the action goes ahead) unless the mod adds a
`.catch` handler that refuses instead (same section). A `.catch` handler has
1 second (`mods/reference.md`, "Limits").

## 9. Can a mod block, change, or add to a tool call, a prompt, or a reply?

| Target | Block it | Change it | Add to it | Source |
| --- | --- | --- | --- | --- |
| A tool call | Yes. `tool.call` returns `{ deny: reason }`; Claude reads the reason as the tool's result, and no permission prompt appears. `tool.check` can return `deny`. | Yes. Pass changed arguments to `next`. Retry by calling `next(e)` again. Answer with `{ result }` so the tool never runs. Change the result after the tool ran. | Yes. Act before or after the tool runs; hold the call while asking the user with `$.ui.ask`. | `mods/events.md`, "Guard or change a tool call", "Hold a tool call until the user decides" |
| Whether a tool call needs your approval | Yes, `tool.check` returns `deny` | Yes, `tool.check` can return `allow`, so the user is not asked (section 12.2 lists the limits) | n/a | `mods/events.md`, "Approve or refuse a tool call before the user is asked" |
| A tool's description | No | Yes, `tool.describe` returns a new description | The docs do not say | `mods/reference.md`, "Tools" |
| A prompt you type | Yes, `{ drop: reason }` | Yes, new `text`; the transcript shows the new text | Yes, `context` that only Claude reads | `mods/events.md`, "Rewrite or add to a prompt" |
| The system prompt and reminders | Yes, drop a section or a reminder with `{ text: null }` | Yes, `prompt.compose`, `prompt.section`, `prompt.attachment`, `skill.prompt` | Yes, through the same events | `mods/reference.md`, "Prompts and what Claude reads" |
| A new prompt from the mod | n/a | n/a | Yes. `$.prompt.submit({ text })` starts a new turn when the session is idle. Claude sees a sentence naming the mod as sender, unless `asUser: true`. | `mods/api.md`, "Start a turn from a background job" |
| A request to the model | Yes, answer without calling the model | Yes, change model or effort | The docs do not describe adding to a request | `mods/events.md`, "Follow a turn"; `mods/reference.md`, "Turns" |
| Claude's reply | The docs do not describe blocking a finished reply | On screen: redraw `AssistantMessage`. In what is stored: `session.append` can rewrite each row's content, including response blocks, before it is saved. A hook may also change the result `next` gives back. | Yes, `turn.complete` returns `{ text }` to show a line under the answer | `mods/interface.md`, "Change what Claude Code already draws"; `mods/reference.md`, "Session" and "Turns"; `mods/events.md`, "Rewrite an event" |
| Compaction | Yes, `session.compact` returns `{ skip: reason }` | The docs do not say | n/a | `mods/reference.md`, "Session" |
| A subagent | Yes, `agent.spawn` returns `{ deny }`, or `agent.offer` hides a type | Yes, `{ model }` on `agent.spawn` | The docs list `$.agent.register` and `$.agent.spawn` but do not explain them | `mods/reference.md`, "Subagents" and "Mods API methods" |
| Commit and pull request attribution text | The docs do not say | Yes, `attribution.text` returns `{ text }` | The docs do not say | `mods/reference.md`, "Prompts and what Claude reads" |

## 10. Files, commands, the network, models, and MCP tools

A mod can reach outside itself only through the mods API, with the same
permissions as the user (`mods/api.md`, "Reach files, processes, and the
network"). Every API call is itself an event, so a mod earlier in the order
can watch, change, or refuse it (same section).

| Question | Answer | Source |
| --- | --- | --- |
| Read and write files? | Yes. `$.fs.read`, `write`, `list`, `exists`, `stat`, `ancestors`. A relative path starts from the session's folder. `list` is not recursive. Up to 4 MiB per file. `write` is not atomic, so another process can read a half-written file. | `mods/api.md`, same section; `mods/reference.md`, "Mods API methods" and "Limits" |
| Run commands? | Yes. `$.process.run(['git', 'status'])` runs a program with an argument list and no shell, and gives back `{ exitCode, stdout, stderr }`. It times out after 30 seconds by default, 10 minutes at most. `$.process.spawn` streams a long-running program's output. | `mods/api.md`, same section; `mods/reference.md`, "Limits" |
| Call the network? | Yes. `$.http.fetch(url, init)` over http or https. An organization's network policy can refuse it. That policy does not cover a program the mod starts with `$.process.run`. | `mods/api.md`, same section; `mods/admin.md`, "Know which controls still apply" |
| Call MCP tools (for example a Notion connector)? | Yes for a connected server: `$.mcp.call` calls a tool on a connected MCP server. `$.mcp.connect(server)` connects only a server the mod's own manifest lists. The admin page says the call runs "under the session's permission rules". The docs do not name Notion or say whether claude.ai connectors count as connected servers; the GitHub types file's example calls `"claude.ai Gmail"` (section 17). | `mods/api.md`, same section; `mods/reference.md`, "Mods API methods"; `mods/admin.md`, "Review what a mod can do" |
| Call a model? | Yes. `$.model.complete` sends one prompt with no conversation history; `$.model.fork` asks one question over the current conversation. Both use the user's plan or API key. `maxTokens` is 1024 by default. A model failure does not throw; check `isAnswered`. | `mods/api.md`, "Call a model"; `mods/reference.md`, "Limits" |
| Add a tool Claude can call? | Yes. `$.tool.register` with a name, description, and input schema. Claude sees it as `mcp__<plugin name>__<tool name>`, and a `tool.call` hook answers it. | `mods/api.md`, "Add a tool" |
| Add a slash command? | Yes. `$.command.register` in `session.start`, answered by `command.run`. `immediate: true` lets it run while Claude works. It cannot reuse a built-in command's name. | `mods/api.md`, "Add a command" |
| Run work on a timer? | Yes. `$.clock.every` and `$.clock.after`, started from `session.start`. Timers stop when the module reloads. | `mods/api.md`, "Run work in the background" |
| Message other sessions? | Yes. `$.session.send({ to, text })` to another of your sessions or a subagent. | `mods/api.md`, "Send and receive messages between sessions" |
| Read secrets? | Yes. `$.env.get` and `$.settings.read` can read API keys. `$.env.set` changes the environment for every command and MCP server Claude Code starts afterward. | `mods/admin.md`, "Review what a mod can do" |
| Read the conversation? | Yes. `$.session.messages()` gives the newest 4,096 entries as `{ role, text, toolUses }`. `$.session.usage()` gives context window use, plan limits, and cost. | `mods/api.md`, same section; `mods/reference.md`, "Mods API methods" and "Limits" |
| Play sound? | `$.audio.play` and `$.audio.speak` are listed. The pages do not explain them. | `mods/reference.md`, "Mods API methods" |

The full list of API areas is in (`mods/reference.md`, "Mods API methods"):
`$.plugin`, `$.ui`, `$.command`, `$.tool`, `$.agent`, `$.model`, `$.prompt`,
`$.turn`, `$.session`, `$.config`, `$.settings`, `$.env`, `$.fs`, `$.store`,
`$.state`, `$.clock`, `$.http`, `$.process`, `$.mcp`, `$.audio`, and
`$.telemetry`.

## 11. Where mods run, and where they do not

From (`mods/overview.md`, "Where mods run"):

| Where Claude Code runs | Hooks run | What the mod draws appears |
| --- | --- | --- |
| `claude` in a terminal, an editor's built-in terminal, or the JetBrains plugin | Yes | Yes |
| The Code tab of the desktop app, except a WSL session | Yes | Yes, except terminal-only elements and sites |
| A WSL session in the desktop app | No; plugins are not available there | No |
| The VS Code extension's chat panel | Yes | No |
| `claude -p` and the Agent SDK | Yes | No |
| Remote Control from claude.ai or the mobile app | Yes, in the session on your machine | In the terminal on your machine |
| A cloud session (Claude Code on the web) | Yes, for a plugin that reaches the cloud session | No |

More detail:

- A mod can check which app is drawing (`e.surface`) and fall back to a
  transcript line or a command reply where nothing draws
  (`mods/overview.md`, same section). The reference lists `terminal` and
  `desktop` as values (`mods/reference.md`, "Render sites").
- A mod Claude writes in a session does not load in `claude -p`, in
  `dontAsk` mode, in a folder you have not trusted, or where mods are
  disabled (`mods/create.md`, "Sessions where a mod Claude writes can't
  load").
- In a `claude -p` run, `$.ui.ask` rejects because nobody can answer
  (`mods/events.md`, "Hold a tool call until the user decides").
- **Codex.** None of the captured mods pages mentions Codex. Codex hooks
  support only `command` and `mcp_tool` handlers; `prompt` and `agent`
  handlers are read but skipped (`codex/hooks.md`, "Config shape"). The
  captured Codex pages describe no JavaScript hooks module.

## 12. Security, permissions, trust, and limits

### 12.1 What a mod can reach

Once loaded, a mod can (`mods/overview.md`, "What a mod can reach"):

- act on the machine as you: files, programs, network;
- read your secrets in environment variables and settings files;
- see every prompt and every tool call;
- rewrite a prompt or tool call, submit a prompt as if you typed it, or
  message another of your sessions;
- approve a tool call before you are asked;
- spend your usage by calling a model.

Mods are not sandboxed. If Claude Code's sandbox is on, it isolates the Bash
commands Claude runs, but a program a mod starts runs outside it
(`mods/overview.md`, same section; `mods/plugins-security.md`, "Understand
what a plugin can do").

### 12.2 What a mod can approve

A mod that handles `tool.check` answers after the rules and `PreToolUse`
hooks, and its answer can replace theirs (`mods/permissions.md`, "Extend
permissions with hooks"):

- **Ask rules:** the mod can approve a call an ask rule would prompt for.
- **A block from a `PreToolUse` hook:** the mod can approve it, unless the
  hook is in managed settings.
- **Auto mode:** a call the mod approves runs without the auto mode
  classifier's check.
- **Deny rules:** they hold over the mod by default only on a machine with
  managed settings or for a user signed in with a Team or Enterprise plan,
  and an organization can change that with `allowModsToOverrideDenyRules`
  (`mods/admin.md`, "Set options on the built-in guard"). "Anywhere else,
  the mod can approve a call that a deny rule refuses."

Even where deny rules hold, they cover Claude's tool calls, not a mod's own
`$.fs` and `$.process` calls. With `Read(.env)` denied, a mod can still read
`.env` with `$.fs.read` (`mods/admin.md`, "Know what happens by default").

### 12.3 What a mod cannot do

- Change the permission prompt or what it shows (`mods/overview.md`, "What
  a mod can reach"; `mods/admin.md`, "Know which controls still apply").
- Load in a folder before you answer the trust prompt (`mods/admin.md`,
  same section; `mods/troubleshoot.md`, "No mod loads in a directory you
  opened for the first time").
- Where the built-in guard loads: change what managed hooks receive or
  decide, the system prompt, managed `CLAUDE.md` and instructions, what any
  mod reads as settings, or managed MCP servers' tools and descriptions
  (`mods/admin.md`, "Know what happens by default").
- Stop a managed `PreToolUse` block: it is final, and if a mod rewrites the
  call, managed hooks run again on the new call (`mods/admin.md`, "Know
  which controls still apply").
- Use Node.js, read the keyboard directly, rebind Tab or the arrows, or
  press another mod's button (`mods/api.md`, "Reach files, processes, and the
  network"; `mods/interface.md`, "Keyboard focus and hotkeys" and "Respond
  to presses and typing").

### 12.4 Trust prompts and approvals

- In an interactive session in a folder you have not trusted yet, no mod
  loads until you answer the trust prompt (`mods/admin.md`, "Know which
  controls still apply").
- A mod Claude writes runs only after you answer the hot-reloading
  question: "Enable for this session" loads it when the turn ends, and "Not
  now" loads it the next time that session starts. To keep it from ever
  loading, delete its folder (`mods/create.md`, "Approve the mod").
- In `default` and `acceptEdits` modes, Claude Code asks before Claude
  writes each file of a mod under `~/.claude` or a `--plugin-dir` folder
  (`mods/create.md`, "Describe the mod" and "Change a mod with Claude").
- Before installing a mod, `claude plugin validate ./some-mod` lists the
  events it handles and the API calls it makes, without running it. The
  calls to watch for are `$.fs.read`, `$.fs.write`, `$.process.run`,
  `$.process.spawn`, `$.http.fetch`, `$.env.get`, `$.env.set`,
  `$.settings.read`, `$.mcp.call`, `$.model.complete`, `$.prompt.submit`,
  and `$.session.send`; and the events `tool.call`, `prompt.submit`,
  `session.append`, `ui.render{component=AskUserQuestion}`, and
  `tool.check` (`mods/overview.md`, "List what a mod does before you install
  one"; `mods/admin.md`, "Review what a mod can do").
- In auto mode, if a mod changes a tool call's input after the classifier
  reviewed it, the call is denied with "a hook changed this call's input
  after the model wrote it" (`mods/troubleshoot.md`, that heading).

### 12.5 Organization controls

| What an administrator wants | Setting in managed settings |
| --- | --- |
| No installed mods, settings hooks untouched | `allowManagedModsOnly` on the built-in guard |
| No mods and no hooks at all | `disableAllHooks: true` |
| Only the organization's own mods | `allowManagedModsOnly`, plus installing their mods so they count as the organization's |
| Any mod from approved marketplaces | Marketplace restrictions plus `disableSideloadFlags: true` |
| Any mod, checked by the organization's own mod | Their mod in `prependPlugins`, with `sec-default@builtin` |

Source: (`mods/admin.md`, "Choose how much to allow"). An organization's
mod counts as theirs only when managed settings enable it and it loads in
place from a marketplace folder on the machine named by absolute path; a
plugin copied from GitHub, git, a URL, or npm counts as a user's
(`mods/admin.md`, "Install your organization's mods and set the order").
`prependPlugins` and `appendPlugins` are read only from managed settings,
except in user settings on a machine with no managed settings for a user
not on a Team or Enterprise plan (same section).

### 12.6 Limits

From (`mods/reference.md`, "Limits"):

| Limit | Value |
| --- | --- |
| A hook's own running time for one event (time inside `next` or an API call does not count, except `$.clock.sleep`) | 10 seconds |
| A `.catch` handler | 1 second |
| All `session.end` hooks together | 1.5 seconds |
| `$.process.run` timeout | 30 seconds by default, 10 minutes at most |
| `$.model.complete` `maxTokens` | 1024 by default, up to 64,000 or the model's limit |
| `$.fs.read`, `$.fs.write` | 4 MiB per file |
| One text child of a `Text` | 10,000 characters |
| `$.store` | 4 MiB of JSON in total |
| `$.session.messages()` | The newest 4,096 entries |
| Redraws | 10 a second, or 30 in the terminal for the visible pane, the expanded band, and the hint line |
| `$.ui.toast` | 4 seconds unless `timeoutMs` is passed |
| A pane opened without the user asking | Placed from 144 columns, or 110 after the user opened it once |
| Command, tool, subagent type, and pane names | Letters, digits, `_`, `-`, up to 64 characters |
| One `claude plugin test` test | 5 seconds unless `timeoutMs` is set |

Two more limits from other pages:

- Installed mods share one worker thread (a separate line of execution
  inside Claude Code). A mod that crashes it is unloaded. After three
  crashes Claude Code cannot trace, every non-built-in mod is off for the
  session until `/reload-plugins` (`mods/troubleshoot.md`, "it crashed the
  hooks worker" and "mods that run in the hooks worker are off for this
  session").
- A hook that waits on its own promise uses its 10 seconds; a wait inside an
  API call such as `$.ui.ask` does not. A held command whose hook times out
  is skipped, so the command runs (`mods/events.md`, "Hold a tool call
  until the user decides").

## 13. Mods compared with settings hooks, skills, MCP servers, and plugins

The first five rows follow the docs' own table (`mods/overview.md`, "Compare
mods, settings hooks, skills, and MCP servers"). The plugin column and the
rows below the fifth cite the pages named in each cell.

| | Mod | Settings hook | Skill | MCP server | Plugin |
| --- | --- | --- | --- | --- | --- |
| What it is | Functions in a plugin that Claude Code calls inside its own process | A shell command, HTTP request, MCP tool call, prompt, or subagent that Claude Code runs on an event (`claude-code/hooks.md`, "Hook handler fields") | A `SKILL.md` file of instructions Claude reads | An outside program or service that gives Claude tools | A folder of components with a manifest; it can hold skills, agents, settings hooks, MCP servers, and a mod (`claude-code/plugins-overview.md`, "Understand what a plugin is"; `mods/overview.md`, last paragraph of the comparison) |
| What it can change | Tool calls, prompts, commands, turns, and what the screen draws | Whether a tool call or prompt goes ahead, a tool call's arguments and result, and context added for Claude | What Claude knows and does | Which tools Claude has | Whatever its components can |
| Can it draw on screen | Yes | No | No | No | Only through a mod |
| What you write | JavaScript or TypeScript | A script and a `settings.json` entry | Markdown | A server in any language | A `plugin.json` plus its components |
| Pick it when | You want a pane, a band, a command that runs code, or to rewrite an event | You want to block, allow, or log an event with a script you already have | You keep pasting the same instructions | Claude needs an outside system | You want to package several pieces as one installable unit (`claude-code/plugins-overview.md`, "Decide whether you need a plugin") |
| Where it runs | Inside Claude Code, in a shared worker thread (`mods/troubleshoot.md`, "it crashed the hooks worker") | A separate process or request (`claude-code/hooks.md`, "Hook handler fields") | Read by Claude in its context | A separate process or service | Each component runs its own way |
| Can it approve a tool call without asking you | Yes, `tool.check` (limits in section 12.2) | Yes, a `PreToolUse` hook can return a decision (`claude-code/hooks.md`, "PreToolUse"); a mod's `tool.check` can override a non-managed one (`mods/permissions.md`, "Extend permissions with hooks") | No | No | Through its hooks or mod |
| Sandboxed | No (`mods/overview.md`, "What a mod can reach") | No: command hooks run with your full permissions outside the sandbox (`mods/plugins-security.md`, "Understand what a plugin can do") | n/a | Runs outside the sandbox (same section) | No |
| Can be listed before it runs | Yes, `claude plugin validate` prints its events and calls | Its command sits in a settings file, and the `/hooks` menu lists it (`claude-code/hooks.md`, "The `/hooks` menu") | n/a | n/a | `claude plugin validate` checks the manifest (`mods/create.md`, "Check what Claude Code reads from your mod") |
| Turned off by `disableAllHooks` | Yes, installed mods (not built-in ones) | Yes | No | No | Only its hooks and mod (`mods/overview.md`, "Turn mods on or off") |
| Works in Codex | Not mentioned in any captured page | Codex has its own hooks: `command` and `mcp_tool` only (`codex/hooks.md`, "Config shape") | Codex has its own skills (`codex/build-skills.md`) | Codex supports MCP servers (`codex/config-reference.md`, `mcp_servers` keys) | Codex has its own plugin format (`codex/plugins.md`) |

## 14. Versions, plans, and early-access status

- **Version.** Claude Code v2.1.287 or later; mods are on by default there
  (`mods/overview.md`, "Turn mods on or off"; `mods/create.md`, the Note
  near the top). The reference describes v2.1.287 (`mods/reference.md`,
  opening paragraph).
- **Observed on this Mac, 2026-10-02:** `claude --version` printed
  `2.1.280 (Claude Code)` for `/Users/michaelrihm/.local/bin/claude`. The
  `plugin-authoring` skill in this desktop session came from build
  2.1.286. Both are older than 2.1.287, so by the docs' rule mods are not on
  by default in either yet (`mods/troubleshoot.md`, "Your version is older
  than 2.1.287").
- **Early access before that.** `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` switched
  mods during early access; v2.1.287 and later ignore it at any value
  (`mods/overview.md`, the Note in "Turn mods on or off"; `mods/admin.md`,
  last paragraph of "Stop user-installed mods from loading").
- **Preview or experimental labels.** The captured mods pages do not call
  mods preview, beta, or experimental. They do warn that "the events and
  methods can change between releases" (`mods/create.md`, "Get type
  definitions for your version" and "Share your mod"). The GitHub types file
  opens with "EARLY ACCESS: this surface may change between releases without
  notice" (`mods/types-claude-code.d.ts`, line 4 of the original), and the
  built-in mods README ends with an early-access note
  (`mods/builtin-mods-readme.md`, last paragraph). Both are older than the
  docs (section 17).
- **Plans.** The docs do not say a mod needs a particular plan. Plans change
  three things:
  - The built-in guard loads for a user signed in with a Team or Enterprise
    plan, or on any machine with managed settings. A user who signs in with
    an API key, or through Amazon Bedrock, Google Cloud's Agent Platform, or
    Microsoft Foundry, gets it only with managed settings (`mods/admin.md`,
    "Know what happens by default").
  - Where the guard does not load, a mod can approve a call a deny rule
    refuses (`mods/permissions.md`, "Extend permissions with hooks").
  - Model calls from a mod use the user's plan or API key (`mods/api.md`,
    "Call a model").
- **Remote off switch.** Anthropic can turn installed mods off remotely
  (`mods/troubleshoot.md`, "Check whether mods can load").

## 15. Every example the docs give

### 15.1 Mods overview (`mods/overview.md`)

- **Tool-call counter on the spinner** ("How a mod works"): counts tool
  calls in `tool.call` and adds `· tool calls: 3…` to the spinner in
  `ui.render`.
- **Sample mods** ("Try a sample mod"): `token-weather`, `blast-radius`,
  `replay-theater` (15.10).
- **Built-in mods with public source** ("Read the source of built-in
  mods"): `diff` (the `/diff` pane with keyboard-bound buttons),
  `agents-md` (loads `AGENTS.md`, with a `userConfig` option),
  `sec-default` (the built-in guard, a model for a policy mod), and
  `telemetry` (adds methods other mods call, and ships their types).

### 15.2 Create a mod (`mods/create.md`)

- **Ask Claude for a mod**: "make a mod that shows the current git branch
  above the prompt".
- **`first-mod` tutorial**: counts tool calls, shows the count on the
  spinner, and adds `/tally`, which prints the count. Shows a live edit
  reloading while the session runs.
- **Change a mod with Claude**: "add a /tally-reset command".
- **First test**: fires two tool calls and checks `/tally` says 2.

### 15.3 Draw in the interface (`mods/interface.md`)

- **`hello-tabs`**: `/hello-tabs` opens a pane with two tabs; the second has
  an "Add one" button and a count saved in `$.store`.
- **Spinner, three ways**: change the text after the word, replace the
  spinner with one line, or leave it alone until there is a count; plus a
  version that adds a line under Claude Code's own spinner.
- **Heat map**: a 3 by 2 `Raster` of colored blocks, with a text fallback
  in the desktop app; `$.ui.blit` to repaint it.
- **Notes pane**: a text field adds notes; each row has an `x` button that
  deletes it.
- **Counter pane**: a button that calls `$.ui.invalidate`.
- **Timer redraw**: `$.clock.every(1000, ...)` redraws once a second.
- **`hello-tabs` with `$.state`**: the count moved to reactive state, with
  its type declaration and manifest `types` field.
- **Reload after `/clear`**: a `classic.SessionStart` hook copies the saved
  count back after `/clear`, `/resume`, or `/branch`.
- **Save from more than one session**: the button reads the store again
  right before it writes.

### 15.4 Interface gallery (`mods/gallery.md`)

- **`gallery` starter mod**: `/gallery` opens a pane that draws one sample.
- **Samples**: `Text` in nine styles, `Markdown` release notes, a `Link`,
  `Code` with line numbers, `Code` as a diff, `Box` rows and borders,
  three `Button` forms, an `Input`, a `Select` with three formats, a
  `Raster` grid, and an `Svg` bar chart for the desktop app.

### 15.5 React to events (`mods/events.md`)

- Log each tool before it runs, and after it finishes.
- Trim every prompt before it is sent.
- Refuse every Bash command.
- Matcher examples: Bash only; Edit and Write; every tool of one MCP server.
- Refuse `git push --force` with a reason Claude can act on.
- Log each `.mdx` file Claude changes.
- Hold a risky Bash command (`rm -rf`, `git reset --hard`, force push) and
  ask "Run it" or "Refuse" with `$.ui.ask`.
- `tool.check`: refuse `git push` while on `main`.
- Add the current branch name for Claude when a prompt mentions a pull
  request.
- `turn.step`: log how many tokens each request read from and wrote to the
  prompt cache.
- `classic.Stop`: log where the transcript is saved.
- A `.catch` handler that makes a Bash guard fail closed.

### 15.6 Use the mods API (`mods/api.md`)

- `/standup [days]` command.
- A `ticket` tool Claude can call, which fetches a ticket over HTTP.
- `/triage`, which asks a small model to label text as bug, feature, or
  question.
- A once-a-minute check of a pull request's status, shown under the prompt.
- `/ping`, which sends a message to another session.

### 15.7 Test a mod (`mods/test.md`)

- `first-mod` test; `grader` (stubs a model call); `countdown` (a fake
  clock); `hello-tabs` drawing test in the terminal and the desktop app; the
  after-`/clear` drawing test; the policy mod test with one mod refused and
  one allowed.

### 15.8 Manage mods for your organization (`mods/admin.md`)

- Managed settings with `allowManagedModsOnly`.
- A full managed settings file that allows only the organization's mods.
- The folder layout and `marketplace.json` for an organization marketplace.
- **`acme-guard` policy mod**: refuses any user's mod that calls
  `$.process.run` or `$.process.spawn`, and writes every tool call and every
  `$.fs.write` by another mod to the debug log.
- A fail-closed version of the same check.

### 15.9 Troubleshoot a mod (`mods/troubleshoot.md`)

- Writing a debug log with `--debug-file` and following it with `tail -f`.

### 15.10 The three sample mods (GitHub READMEs)

- **`token-weather`** (`mods/sample-token-weather.md`): a one-line "weather
  forecast" of context window use in the band above the prompt, from
  `$.session.usage()` after each turn, with a block-character chart of the
  last 12 turns. Hooks: `session.start`, `turn.complete`,
  `ui.render{AbovePrompt}`.
- **`blast-radius`** (`mods/sample-blast-radius.md`): holds risky shell
  commands (`rm -r`, `git reset --hard`, `git clean`, force pushes,
  database migrations), measures what they would change with
  `$.process.run`, and shows Proceed and Cancel buttons in a pane, or in the
  band in a narrow terminal. It refuses after 10 minutes with no answer. Its
  README says it is "a safety net, not a permission system" and lists
  command forms it does not catch.
- **`replay-theater`** (`mods/sample-replay-theater.md`): records every
  Edit and Write in a turn without changing them, then `/replay` opens a
  pane that steps through the diffs.

## 16. Where the docs are silent

- Whether a hooks module in a plugin that loads in place from a
  local-folder marketplace is watched and reloaded on save. The loading page
  says edits apply at the next session start or `/reload-plugins`
  (`mods/plugins-loading.md`, "In-place and copied plugins").
- Whether a skills-directory plugin can hold a mod, and whether its hooks
  module reloads on save. The ten mods section pages never mention
  `~/.claude/skills/<name>/` (only the second source does), and the older
  skills page says such a folder's `hooks/` changes need `/reload-plugins`
  (section 17).
- Whether `$.mcp.call` reaches claude.ai connectors, such as Notion, and
  whether it shows a permission prompt. The documentation pages do not say;
  the GitHub types file's example calls `"claude.ai Gmail"` and says there
  is no prompt (section 17).
- What `tool.describe`, the `classic.*` events, `$.ui.notice`,
  `$.model.classify`, `$.agent.*`, `$.audio.*`, `$.turn.abort`,
  `$.session.authorize`, and `$.config.*` receive or return in detail. The
  docs point to the types file for these (`mods/reference.md`, the Note at
  the top).
- How to clear a status line set with `$.ui.status`, and whether several
  mods can each keep one. The older GitHub types file answers both: one
  line per plugin, and `undefined` removes it (section 4.1).
- Anything about Codex.
- Whether a loaded mod adds anything to Claude's context on every turn. The
  plugins overview names skills, agents, commands, and MCP tools as the
  parts of a plugin that cost context (`claude-code/plugins-overview.md`,
  "What an enabled plugin adds to your sessions"); the mods pages say
  nothing either way. A tool a mod registers does have a description Claude
  reads (`mods/api.md`, "Add a tool").
- Pricing or plan requirements for mods themselves.

## 17. Where the sources disagree

| Topic | One source | The other | Which this guide follows |
| --- | --- | --- | --- |
| Permission check on `$.mcp.call` | The admin page: "Calls a tool on a connected MCP server, under the session's permission rules" (`mods/admin.md`, "Review what a mod can do") | The GitHub types file, written by 2.1.277: "No permission prompt: the plugin's call, seen by the hooks above it, is the grant" (`mods/types-claude-code.d.ts`, the `mcp` declaration). **Second source:** the 2.1.286 types inside the `plugin-authoring` skill say the same. | The docs. This needs a live test before anything relies on it. |
| Values of `e.surface` | `terminal` or `desktop` (`mods/reference.md`, "Render sites") | The GitHub types file declares `terminal`, `desktop`, `vscode`, and `mobile`, and names `vscode` as Claude Code for VS Code and `mobile` as the Claude mobile app (`mods/types-claude-code.d.ts`, the `RenderSurface` type). **Second source:** the same four. | The docs. The docs say nothing a mod draws appears in the VS Code extension (section 11); they do not mention the mobile app as a place mods draw. |
| Reload of a skills-directory plugin's hooks | Edits to such a folder's `hooks/` need `/reload-plugins` (`claude-code/skills.md`, "Edit a skill during a session", captured 2026-09-27, before mods were documented) | **Second source:** a skills-directory plugin is watched and its mod reloads on save, like a `--plugin-dir` folder | Neither for certain. The page is older than mods; the second source is not a captured page. This needs a live test. |
| Early access | Mods are on by default from v2.1.287 (`mods/overview.md`) | "Early access: hooks modules load only where function hooks are enabled" (`mods/builtin-mods-readme.md`) | The docs. The README is older. |
| Where the band is drawn | `AbovePrompt` is drawn in the terminal and the desktop app (`mods/reference.md`, "Render sites") | "`AbovePrompt` is drawn on the terminal surface only" (`mods/sample-token-weather.md`, "Run it") | The docs. The sample was tested on 2.1.280. |
| `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` | Ignored from v2.1.287 (`mods/overview.md`) | **Second source** (build 2.1.286): setting it to `1` turns mods on in a `claude -p` run | Both can be true: the skill describes an older build. |

## 18. Facts that bear on Toolkit V2

These are facts only. Any decision to use a mod is Mike's.

- Toolkit V2's hooks today are three settings hook commands that setup
  copies into each project (`.claude/hooks/`), registered in the project's
  `.claude/settings.json` for Claude Code and `.codex/hooks.json` for Codex.
  The `toolkit` plugin itself holds no hooks (`AGENTS.md`, Layout, "What a
  project gets from onboarding"; Rules, "Hooks" and "Machine-wide
  plugin"). A mod must live in a plugin (`mods/reference.md`, "Files"), so
  adding one would mean a plugin with a hooks module: the `toolkit` plugin
  or a new one. Settings hooks keep running beside mods (`mods/admin.md`,
  "Know which controls still apply"), so adding a mod would not require
  removing a settings hook.
- Codex would not run a mod. Anything built only as a mod would reach
  Claude Code users only (section 11).
- Mike's `toolkit-v2` marketplace is a local folder, and its plugins load
  in place (`AGENTS.md`, Rules, "Versions"; `mods/plugins-loading.md`,
  "In-place and copied plugins"). The docs do not say whether a mod in such
  a plugin hot-reloads on save (section 16).
- Whether deny rules hold over a mod depends on Mike's plan or managed
  settings (section 12.2). The docs do not tell us which applies to Mike.
- Mods need v2.1.287. This Mac had 2.1.280 in the terminal on 2026-10-02
  (section 14).
- `disableAllHooks` in user settings stops settings hooks and installed
  mods together (`mods/overview.md`, "Turn mods on or off"). A user who
  turns hooks off this way also turns off any installed mod, while built-in
  mods keep running.

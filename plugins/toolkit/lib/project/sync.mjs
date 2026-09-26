// `toolkit sync`: run the manifest again with the current .toolkit.json values
// (templates/TEMPLATE-LANGUAGE.md, "Sync"). It adds missing files, rebuilds
// files nobody changed, never deletes a file, and never writes a file the
// project changed. The AGENTS.md rules span is rebuilt every time.

import fs from 'node:fs';
import path from 'node:path';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { CONFIG_FILE, saveConfig } from '../core/config.mjs';
import { planManifest, applyPlan, planLines, planSummary, setupDate } from './manifest.mjs';

/** The folder that holds the project's .toolkit.json. Sync and config set refuse a worktree that has none. */
export function configRoot(project) {
  if (fs.existsSync(path.join(project.root, CONFIG_FILE))) return project.root;
  throw new ToolkitError(EXIT.INVALID, `This worktree (${project.root}) has no ${CONFIG_FILE} of its own; its branch was made before the project was set up.`, {
    fix: `Run the command in the main checkout (${project.mainRoot}), or merge the default branch into this branch first.`,
  });
}

/**
 * Sync a project. opts: { dryRun, env, pluginRoot, changedSettings }.
 * Returns { plan, applied, summary, lines, savedConfig }.
 */
export async function syncProject(project, opts = {}) {
  const env = opts.env || process.env;
  const root = configRoot(project);
  const plan = planManifest(project, { mode: 'sync', env, pluginRoot: opts.pluginRoot, changedSettings: opts.changedSettings });
  let applied = null;
  let savedConfig = false;
  if (!opts.dryRun) {
    applied = applyPlan(plan);
    const { config } = project;
    const tracker = (config.tracker && config.tracker.type) || 'local';
    const memory = (config.memory && config.memory.type) || 'builtin';
    const mainRoot = project.mainRoot || project.root;
    if (tracker === 'local' && !fs.existsSync(path.join(mainRoot, '.work-items', 'DASHBOARD.md'))) {
      const { openTracker } = await import('../work/driver.mjs');
      const t = await openTracker(project, { env, cwd: project.root, pluginRoot: opts.pluginRoot });
      await t.sync({ quick: false });
    }
    if (memory === 'builtin' && !fs.existsSync(path.join(mainRoot, '.memory', 'MEMORY.md'))) {
      const { reindexVault } = await import('../memory/builtin.mjs');
      await reindexVault(mainRoot);
    }
    // A project set up before the setup date was recorded keeps the date of
    // this render from now on, so the next render gives the same text.
    const backfill = !setupDate(config);
    if (backfill) {
      config.project = config.project || {};
      config.project.created = plan.today;
    }
    if (plan.installedChanged || backfill) {
      config.installed = plan.installed;
      saveConfig(root, config);
      savedConfig = true;
    }
  }
  const lines = planLines(plan, { applied: !opts.dryRun });
  if (!lines.length) lines.push(opts.dryRun ? 'Nothing to do: every scaffold file is in place and up to date.' : 'Nothing changed: every scaffold file is in place and up to date.');
  return { plan, applied, summary: planSummary(plan), lines, savedConfig };
}

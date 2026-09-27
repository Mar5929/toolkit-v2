// Where the model's file templates are read from.
//
// The scaffold in scaffold/model/ is an exact copy of Mike's model project
// (dev/tools/import-model.mjs makes it). Every template the runtime needs is
// read from that copy, never from a second copy in this plugin.
//
// A work item template prefers the project's own copy
// (<tracker root>/work-item-template/<file>), so a project that edited its
// template gets its own version. The memory templates and DECISIONS.md are
// always read from the model copy.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXIT, ToolkitError } from './output.mjs';
import { mainCheckoutRoot } from './config.mjs';

const PLUGIN_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const MODEL_ROOT = path.join(PLUGIN_ROOT, 'scaffold', 'model');

/** The work item folder name inside a project (the local tracker root). */
export const TRACKER_FOLDER = '.work-items';
/** The template folder name inside the tracker root. */
export const WORK_ITEM_TEMPLATE_FOLDER = 'work-item-template';

/**
 * Template name -> path inside scaffold/model. The paths mirror the model
 * project exactly.
 */
export const TEMPLATE_PATHS = Object.freeze({
  'work-item': '.work-items/work-item-template/WORK-ITEM.md',
  design: '.work-items/work-item-template/DESIGN.md',
  'memory/CURRENT_FOCUS': '.memory/CURRENT_FOCUS.md',
  'memory/MEMORY': '.memory/MEMORY.md',
  'memory/topic': '.memory/project_topic_template.md',
  'memory/glossary': '.memory/terminology-glossary.md',
  'memory/criteria': '.memory/memory-criteria.md',
  'memory/AGENTS': '.memory/AGENTS.md',
  decisions: 'DECISIONS.md',
});

/** The two templates a project may override with its own copy. */
const WORK_ITEM_FILES = Object.freeze({ 'work-item': 'WORK-ITEM.md', design: 'DESIGN.md' });

/** Absolute path of the model copy: <plugin root>/scaffold/model. */
export function modelRoot() {
  return MODEL_ROOT;
}

function knownName(name) {
  if (!Object.prototype.hasOwnProperty.call(TEMPLATE_PATHS, name)) {
    throw new ToolkitError(EXIT.ERROR, `There is no template named "${name}". Known templates: ${Object.keys(TEMPLATE_PATHS).join(', ')}.`);
  }
  return TEMPLATE_PATHS[name];
}

/** Absolute path of a template inside scaffold/model. */
export function templatePath(name) {
  return path.join(MODEL_ROOT, ...knownName(name).split('/'));
}

function readIfFile(p) {
  try {
    if (fs.statSync(p).isFile()) return fs.readFileSync(p, 'utf8');
  } catch {
    // Missing or unreadable: the caller falls back.
  }
  return null;
}

function trackerRootFor(projectRoot) {
  if (!projectRoot) return null;
  let main = null;
  try {
    main = mainCheckoutRoot(projectRoot);
  } catch {
    main = null;
  }
  return path.join(main || projectRoot, TRACKER_FOLDER);
}

/**
 * Where a template would be read from, without reading it.
 * @param {string} name a key of TEMPLATE_PATHS
 * @param {{ projectRoot?: string, trackerDir?: string }} [where]
 * @returns {{ path: string, source: 'project'|'model' }}
 */
export function resolveTemplate(name, { projectRoot, trackerDir } = {}) {
  knownName(name);
  const file = WORK_ITEM_FILES[name];
  if (file) {
    const root = trackerDir || trackerRootFor(projectRoot);
    if (root) {
      const own = path.join(root, WORK_ITEM_TEMPLATE_FOLDER, file);
      if (readIfFile(own) !== null) return { path: own, source: 'project' };
    }
  }
  return { path: templatePath(name), source: 'model' };
}

/**
 * The template text. A work item template comes from the project's own copy
 * when it has one; everything else comes from scaffold/model.
 * @param {string} name a key of TEMPLATE_PATHS
 * @param {{ projectRoot?: string, trackerDir?: string }} [where]
 * @returns {string}
 */
export function readTemplate(name, where = {}) {
  const found = resolveTemplate(name, where);
  const text = readIfFile(found.path);
  if (text === null) {
    throw new ToolkitError(EXIT.ERROR, `The template ${TEMPLATE_PATHS[name]} is missing from the toolkit plugin (${found.path}).`, {
      fix: 'Reinstall or update the toolkit plugin.',
    });
  }
  return text;
}

/** Same as readTemplate, plus where the text came from. */
export function loadModelTemplate(name, where = {}) {
  const found = resolveTemplate(name, where);
  return { text: readTemplate(name, where), source: found.source, path: found.path };
}

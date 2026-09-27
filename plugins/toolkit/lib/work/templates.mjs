// Where new WORK-ITEM.md and DESIGN.md files come from.
//
// Order of preference (ARCHITECTURE 4.3 "Templates", revision 3):
//   1. the project's copy: <main checkout>/.work-items/work-item-template/<file>
//   2. the model's copy in the plugin: scaffold/model/.work-items/work-item-template/<file>
// Both are read through lib/core/templates.mjs. There is no other copy.

import { loadModelTemplate } from '../core/templates.mjs';

export const TEMPLATE_FOLDER = 'work-item-template';
export const RECORD_FILE = 'WORK-ITEM.md';
export const DESIGN_FILE = 'DESIGN.md';

const NAMES = Object.freeze({ [RECORD_FILE]: 'work-item', [DESIGN_FILE]: 'design' });

/**
 * The template text for a file name ('WORK-ITEM.md' or 'DESIGN.md') and where it came from.
 * @param {string} name RECORD_FILE or DESIGN_FILE
 * @param {{ trackerDir?: string, projectRoot?: string }} [where] the tracker folder
 *   (<main checkout>/.work-items) or the project folder; leave both out for the model's copy
 * @returns {{ text: string, source: 'project'|'model', path: string }}
 */
export function loadTemplate(name, { trackerDir, projectRoot } = {}) {
  const templateName = NAMES[name];
  if (!templateName) throw new Error(`There is no work item template named ${name}; use ${RECORD_FILE} or ${DESIGN_FILE}.`);
  return loadModelTemplate(templateName, { trackerDir, projectRoot });
}

// Build and repair the Notion structure. Every function here can run again at
// any time: it looks at what exists, adds only what is missing, and never
// removes or renames anything Mike made.
//
// ensureRoot     under the root page, find (or create) the Projects database and
//                make sure it has the registry properties (Key, Tracker, ...).
// ensureProject  for one project: find or create its row in Projects; when the
//                tracker is Notion, its Work Items database (schema, Parent item /
//                Sub-items and Blocked by / Blocking relations, a board view
//                grouped by Stage, a table view with sub-items nested); when
//                memory is Notion, its Memory database (Index and Retired views)
//                and the Current focus and Terminology glossary pages.
//                Returns the new "notion" block for .toolkit.json.
//
// Both read everything back at the end and list any difference as a problem.
// With { check: true } nothing is written; missing pieces are reported.
//
// Scope: an id stored in .toolkit.json, a database found by its title, and a
// project row found by its Key are used only after the client has walked their
// parents up to the root page. One that is outside the root page is not used
// and is reported. Only objects created in this run are trusted without that
// walk, because the create call was already checked through its parent.
// A stored project row whose Key names another project is not used either
// (a .toolkit.json copied from another project), and then none of the other
// stored ids are used: they are looked up again under this project's page.
// Registry values are written only when they differ from what the row holds.

import { EXIT, ToolkitError } from '../core/output.mjs';
import { readTemplate } from '../core/templates.mjs';
import { run, today as localToday, nowIso } from '../core/util.mjs';
import { normalizeId, isNotionError } from './client.mjs';
import { toNotion, stripTitle } from './markdown.mjs';
import {
  PROJECTS_BASE_PROPERTIES, PROJECTS_REGISTRY_PROPERTIES, workItemProperties, WORK_ITEM_RELATIONS, MEMORY_PROPERTIES,
  FOCUS_PAGE_TITLE, GLOSSARY_PAGE_TITLE, WORK_ITEMS_TITLE, MEMORY_TITLE, PROJECTS_TITLE, specType,
} from './schema.mjs';

const plain = (rich) => (Array.isArray(rich) ? rich.map((r) => r.plain_text ?? (r.text && r.text.content) ?? '').join('') : '');
const richText = (s) => (s ? [{ type: 'text', text: { content: String(s).slice(0, 2000) } }] : []);

// ------------------------------------------------------------------ small readers

/** The title of a database object. */
export function databaseTitle(db) {
  return plain(db && db.title);
}

/** Child databases and child pages of a page: [{ kind, id, title }]. */
export async function childrenOf(client, pageId) {
  const blocks = await client.childrenAll(pageId);
  const out = [];
  for (const b of blocks) {
    if (b.type === 'child_database') out.push({ kind: 'database', id: normalizeId(b.id), title: (b.child_database && b.child_database.title) || '' });
    else if (b.type === 'child_page') out.push({ kind: 'page', id: normalizeId(b.id), title: (b.child_page && b.child_page.title) || '' });
  }
  return out;
}

async function tryGet(fn) {
  try {
    return await fn();
  } catch (err) {
    if (isNotionError(err) && (err.status === 404 || err.status === 400)) return null;
    throw err;
  }
}

function usable(obj) {
  return Boolean(obj) && !obj.in_trash && !obj.archived && !obj.is_archived;
}

function parentId(obj) {
  const p = obj && obj.parent;
  if (!p) return null;
  return normalizeId(p.page_id || p.database_id || p.data_source_id || p.block_id || '') || null;
}

// ------------------------------------------------------------------ properties

/**
 * Make a data source have the wanted properties. wanted: [{ key, name, spec }].
 * stored: { key: propertyId } from .toolkit.json (so renamed columns are still found).
 * Returns { ids, names, added, optionsAdded, problems, schema }.
 */
export async function ensureProperties(client, dataSourceId, wanted, { stored = {}, check = false } = {}) {
  let ds = await client.getDataSource(dataSourceId);
  const problems = [];
  const added = [];
  const optionsAdded = [];
  const patch = {};
  const findExisting = (w) => {
    const props = ds.properties || {};
    const byId = stored[w.key] ? Object.entries(props).find(([, p]) => p.id === stored[w.key]) : null;
    if (byId) return { name: byId[0], prop: byId[1] };
    if (props[w.name]) return { name: w.name, prop: props[w.name] };
    const lower = w.name.toLowerCase();
    const loose = Object.entries(props).find(([n]) => n.toLowerCase() === lower);
    return loose ? { name: loose[0], prop: loose[1] } : null;
  };
  for (const w of wanted) {
    const type = specType(w.spec);
    const found = findExisting(w);
    if (!found) {
      if (type === 'title') {
        const title = Object.entries(ds.properties || {}).find(([, p]) => p.type === 'title');
        if (title && title[0] !== w.name && !check) patch[title[0]] = { name: w.name };
        continue;
      }
      patch[w.name] = w.spec;
      added.push(w.name);
      continue;
    }
    if (found.prop.type !== type) {
      problems.push(`The property "${found.name}" is a ${found.prop.type} property; the toolkit expects ${type}. It was left as it is.`);
      continue;
    }
    if ((type === 'select' || type === 'status') && w.spec[type].options) {
      const have = new Set(((found.prop[type] && found.prop[type].options) || []).map((o) => o.name));
      const missing = w.spec[type].options.filter((o) => !have.has(o.name));
      if (missing.length) {
        if (type === 'status') {
          problems.push(`The status property "${found.name}" lacks the options ${missing.map((o) => o.name).join(', ')}. Add them in the Notion app (the API cannot add status options to an existing property).`);
        } else {
          // Send every existing option back in full, description included, so none is changed.
          const keep = ((found.prop.select && found.prop.select.options) || []).map((o) => ({
            id: o.id, name: o.name, color: o.color, ...(o.description ? { description: o.description } : {}),
          }));
          patch[found.name] = { select: { options: [...keep, ...missing] } };
          optionsAdded.push(...missing.map((o) => `${found.name}: ${o.name}`));
        }
      }
    }
  }
  if (Object.keys(patch).length) {
    if (check) {
      for (const name of added) problems.push(`The property "${name}" is missing.`);
      for (const o of optionsAdded) problems.push(`The option ${o} is missing.`);
    } else {
      ds = await client.updateDataSource(dataSourceId, { properties: patch });
    }
  }
  const ids = {};
  const names = {};
  for (const w of wanted) {
    const found = findExisting(w);
    if (found) {
      ids[w.key] = found.prop.id;
      names[w.key] = found.name;
    } else if (!check) {
      problems.push(`The property "${w.name}" is still missing after the update.`);
    }
  }
  return { ids, names, added: check ? [] : added, optionsAdded: check ? [] : optionsAdded, problems, schema: ds };
}

/**
 * Make two-way self-relations exist on a data source. relations: [{ key, name, pairKey, pairName }].
 * Returns { ids, names, added, problems, schema }.
 */
export async function ensureSelfRelations(client, dataSourceId, relations, { stored = {}, check = false } = {}) {
  let ds = await client.getDataSource(dataSourceId);
  const self = normalizeId(dataSourceId);
  const problems = [];
  const added = [];
  const find = (key, name) => {
    const props = ds.properties || {};
    if (stored[key]) {
      const byId = Object.entries(props).find(([, p]) => p.id === stored[key]);
      if (byId) return { name: byId[0], prop: byId[1] };
    }
    return props[name] ? { name, prop: props[name] } : null;
  };
  const patch = {};
  for (const r of relations) {
    const a = find(r.key, r.name);
    if (a) {
      if (a.prop.type !== 'relation' || normalizeId(a.prop.relation && a.prop.relation.data_source_id) !== self) {
        problems.push(`The property "${a.name}" should be a relation to this database; it was left as it is.`);
      }
      continue;
    }
    patch[r.name] = { relation: { data_source_id: self, type: 'dual_property', dual_property: { synced_property_name: r.pairName } } };
    added.push(r.name);
  }
  if (Object.keys(patch).length) {
    if (check) for (const n of added) problems.push(`The relation "${n}" is missing.`);
    else ds = await client.updateDataSource(dataSourceId, { properties: patch });
  }
  const ids = {};
  const names = {};
  for (const r of relations) {
    const a = find(r.key, r.name);
    if (!a) continue;
    ids[r.key] = a.prop.id;
    names[r.key] = a.name;
    const dual = a.prop.relation && a.prop.relation.dual_property;
    let pair = null;
    if (dual) {
      pair = Object.entries(ds.properties || {}).find(([, p]) => p.id === dual.synced_property_id)
        || (dual.synced_property_name && ds.properties[dual.synced_property_name] ? [dual.synced_property_name, ds.properties[dual.synced_property_name]] : null);
    }
    if (!pair) pair = find(r.pairKey, r.pairName) ? [find(r.pairKey, r.pairName).name, find(r.pairKey, r.pairName).prop] : null;
    if (pair) {
      ids[r.pairKey] = pair[1].id;
      names[r.pairKey] = pair[0];
      if (pair[0] !== r.pairName && !check && !stored[r.pairKey]) {
        // Notion named the other side itself; give it the toolkit's name once.
        ds = await client.updateDataSource(dataSourceId, { properties: { [pair[0]]: { name: r.pairName } } });
        names[r.pairKey] = r.pairName;
      }
    } else if (!check) {
      problems.push(`The other side of "${a.name}" (${r.pairName}) was not found.`);
    }
  }
  return { ids, names, added: check ? [] : added, problems, schema: ds };
}

/** Stored property or view ids apply only to the database they were stored for. */
function storedFor(found, storedDatabaseId, value) {
  if (!found || !found.database || !value) return {};
  return normalizeId(found.database.id) === normalizeId(storedDatabaseId || '') ? value : {};
}

function propertiesBody(list) {
  const out = {};
  for (const p of list) out[p.name] = p.spec;
  return out;
}

// ------------------------------------------------------------------ databases

/**
 * ID prefixes to try for a project's Work Items database. Notion lets only one
 * database in a workspace use a given unique ID prefix, so when the configured
 * one (usually WI) is taken, the toolkit falls back to one made from the
 * project key: "sample-app" -> SA, SAMPLE, SAMPLEAPP, SA2, SA3, ...
 */
export function prefixCandidates(configured, key) {
  const out = [];
  const add = (p) => {
    const v = String(p || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    if (/^[A-Z][A-Z0-9]*$/.test(v) && !out.includes(v)) out.push(v);
  };
  add(configured || 'WI');
  const words = String(key || '').split(/[^A-Za-z0-9]+/).filter(Boolean);
  const initials = words.map((w) => w[0]).join('');
  if (initials.length >= 2) add(initials);
  if (words[0]) add(words[0].slice(0, 8));
  add(words.join(''));
  const base = out[1] || out[0];
  for (let n = 2; n <= 9; n++) add(`${base.slice(0, 8)}${n}`);
  return out;
}

function isPrefixTaken(err) {
  return isNotionError(err) && err.status === 409 && /prefix/i.test(err.message);
}

/**
 * True when an object the toolkit found (not created) is under the root page.
 * Ids stored in .toolkit.json or found by title are never trusted: the client
 * walks their parents. Only objects the toolkit just created are trusted,
 * because the create call itself was checked through its parent.
 */
async function underRoot(client, kind, id) {
  const n = normalizeId(id || '');
  return Boolean(n) && client.isUnderRoot({ kind, id: n });
}

/**
 * Find a database by its stored id or by title among the page's children, or
 * create it. A found database is used only when it is under the root page.
 * Returns { database, dataSourceId, created, moved, usedPrefix, problems }, or
 * with check and nothing found { missing: true, problems }.
 */
async function ensureDatabase(client, { parentPageId, storedId, title, icon, properties, check, prefixes = null }) {
  let db = null;
  let moved = false;
  const problems = [];
  if (storedId) {
    db = await tryGet(() => client.getDatabase(storedId));
    if (db && !usable(db)) db = null;
    if (db && !(await underRoot(client, 'database', db.id))) {
      problems.push(`The stored ${title} database (${normalizeId(storedId)}) is outside the root page, so it was not used.`);
      db = null;
    }
    if (db && parentId(db) !== normalizeId(parentPageId)) moved = true;
  }
  if (!db) {
    const kids = await childrenOf(client, parentPageId);
    const match = kids.find((k) => k.kind === 'database' && k.title.trim().toLowerCase() === title.toLowerCase());
    if (match) db = await tryGet(() => client.getDatabase(match.id));
    if (db && !usable(db)) db = null;
    if (db && !(await underRoot(client, 'database', db.id))) db = null;
  }
  let created = false;
  let usedPrefix = null;
  if (!db) {
    if (check) return { database: null, dataSourceId: null, created: false, moved: false, missing: true, problems };
    const tries = prefixes && prefixes.length ? prefixes : [null];
    for (let k = 0; k < tries.length && !db; k++) {
      const list = typeof properties === 'function' ? properties(tries[k]) : properties;
      try {
        db = await client.createDatabase({
          parent: { type: 'page_id', page_id: normalizeId(parentPageId) },
          title: richText(title),
          is_inline: true,
          icon: icon ? { type: 'emoji', emoji: icon } : undefined,
          initial_data_source: { properties: propertiesBody(list) },
        });
        usedPrefix = tries[k];
      } catch (err) {
        if (!isPrefixTaken(err) || k === tries.length - 1) throw err;
      }
    }
    created = true;
    client.trust(db.id, ...(db.data_sources || []).map((d) => d.id));
  }
  const dataSourceId = normalizeId(((db.data_sources || [])[0] || {}).id || '');
  if (!dataSourceId) throw new ToolkitError(EXIT.ERROR, `The Notion database "${title}" has no data source.`, { databaseId: db.id });
  return { database: db, dataSourceId, created, moved, usedPrefix, problems };
}

// ------------------------------------------------------------------ views

/** Every view of a database, read in full (the list endpoint returns ids only). */
export async function listViews(client, databaseId) {
  const list = await client.viewsAll(databaseId);
  const full = [];
  for (const v of list) {
    full.push(v.configuration !== undefined && v.name !== undefined ? v : await client.getView(v.id));
  }
  return full;
}

/** Property ids come URL-encoded from data sources and decoded from views; compare them decoded. */
export function samePropertyId(a, b) {
  if (!a || !b) return false;
  const dec = (x) => {
    try {
      return decodeURIComponent(String(x));
    } catch {
      return String(x);
    }
  };
  return dec(a) === dec(b);
}

function groupProperty(view) {
  const c = view && view.configuration;
  return c && c.group_by ? c.group_by.property_id : null;
}

function subtaskProperty(view) {
  const c = view && view.configuration;
  return c && c.subtasks ? c.subtasks.property_id : null;
}

/**
 * The Work Items views: "Board" (grouped by Stage, first) and "All items"
 * (a table with sub-items nested under their parent). Returns { views, created, problems }.
 */
export async function ensureWorkItemViews(client, { databaseId, dataSourceId, ids, stored = {}, check = false }) {
  const views = await listViews(client, databaseId);
  const byId = (id) => views.find((v) => normalizeId(v.id) === normalizeId(id || ''));
  const created = [];
  const problems = [];
  const out = {};
  const cardProps = ['id', 'type', 'status', 'priority', 'waitingOn', 'parent'].filter((k) => ids[k]).map((k) => ({ property_id: ids[k], visible: true }));
  const openFilter = {
    and: [
      { property: ids.status, status: { does_not_equal: 'Done' } },
      { property: ids.status, status: { does_not_equal: 'Cancelled' } },
      ...(ids.archived ? [{ property: ids.archived, checkbox: { equals: false } }] : []),
    ],
  };

  let board = byId(stored.board) || views.find((v) => v.type === 'board' && samePropertyId(groupProperty(v), ids.stage));
  if (!board) {
    if (check) problems.push('The Board view (grouped by Stage) is missing.');
    else {
      board = await client.createView({
        database_id: databaseId,
        data_source_id: dataSourceId,
        name: 'Board',
        type: 'board',
        position: { type: 'start' },
        filter: openFilter,
        configuration: {
          type: 'board',
          group_by: { type: 'select', property_id: ids.stage, sort: { type: 'ascending' }, hide_empty_groups: false },
          properties: cardProps,
        },
      });
      created.push('Board');
    }
  }
  if (board) out.board = normalizeId(board.id);

  const subtasks = { property_id: ids.parent, display_mode: 'show', filter_scope: 'parents_and_subitems', toggle_column_id: ids.title || 'title' };
  let table = byId(stored.allItems) || views.find((v) => v.type === 'table' && samePropertyId(subtaskProperty(v), ids.parent));
  if (!table && ids.parent) {
    const tables = views.filter((v) => v.type === 'table');
    const fresh = tables.length === 1 && /^(default view|table|all items|untitled)?$/i.test((tables[0].name || '').trim()) ? tables[0] : null;
    if (check) problems.push('The All items view (sub-items nested) is missing.');
    else if (fresh) {
      table = await client.updateView(fresh.id, {
        name: 'All items',
        ...(ids.archived ? { filter: { property: ids.archived, checkbox: { equals: false } } } : {}),
        sorts: ids.id ? [{ property: ids.id, direction: 'ascending' }] : undefined,
        configuration: { type: 'table', subtasks },
      });
      created.push('All items (renamed the default view)');
    } else {
      table = await client.createView({
        database_id: databaseId,
        data_source_id: dataSourceId,
        name: 'All items',
        type: 'table',
        position: { type: 'end' },
        ...(ids.archived ? { filter: { property: ids.archived, checkbox: { equals: false } } } : {}),
        sorts: ids.id ? [{ property: ids.id, direction: 'ascending' }] : undefined,
        configuration: { type: 'table', subtasks },
      });
      created.push('All items');
    }
  }
  if (table) out.allItems = normalizeId(table.id);
  return { views: out, created, problems };
}

/** The Memory views: "Index" (records in use) and "Retired". */
export async function ensureMemoryViews(client, { databaseId, dataSourceId, ids, stored = {}, check = false }) {
  const views = await listViews(client, databaseId);
  const byId = (id) => views.find((v) => normalizeId(v.id) === normalizeId(id || ''));
  const created = [];
  const problems = [];
  const out = {};
  const inUse = { property: ids.status, select: { does_not_equal: 'retired' } };
  const retired = { property: ids.status, select: { equals: 'retired' } };
  const sorts = [{ property: ids.type, direction: 'ascending' }, { property: ids.title, direction: 'ascending' }].filter((s) => s.property);

  let index = byId(stored.index) || views.find((v) => v.type === 'table' && /^index$/i.test(v.name || ''));
  if (!index) {
    const tables = views.filter((v) => v.type === 'table');
    const fresh = tables.length === 1 && /^(default view|table|untitled)?$/i.test((tables[0].name || '').trim()) ? tables[0] : null;
    if (check) problems.push('The Index view of the Memory database is missing.');
    else if (fresh) {
      index = await client.updateView(fresh.id, { name: 'Index', filter: inUse, sorts });
      created.push('Index (renamed the default view)');
    } else {
      index = await client.createView({ database_id: databaseId, data_source_id: dataSourceId, name: 'Index', type: 'table', position: { type: 'start' }, filter: inUse, sorts });
      created.push('Index');
    }
  }
  if (index) out.index = normalizeId(index.id);

  let old = byId(stored.retired) || views.find((v) => /^retired$/i.test(v.name || ''));
  if (!old) {
    if (check) problems.push('The Retired view of the Memory database is missing.');
    else {
      old = await client.createView({ database_id: databaseId, data_source_id: dataSourceId, name: 'Retired', type: 'table', position: { type: 'end' }, filter: retired, sorts });
      created.push('Retired');
    }
  }
  if (old) out.retired = normalizeId(old.id);
  return { views: out, created, problems };
}

// ------------------------------------------------------------------ root

/**
 * Make sure the Projects database under the root page has the registry properties.
 * opts: { client, rootPageId, stored: { databaseId, dataSourceId, properties }, check }
 * Returns { rootPageId, projects: { databaseId, dataSourceId, url, properties }, created, added, problems }.
 */
export async function ensureRoot({ client, rootPageId, stored = {}, check = false, projectsDatabaseId = null }) {
  const root = normalizeId(rootPageId);
  if (!root) throw new ToolkitError(EXIT.INVALID, 'ensure-root needs the root page id.');
  const page = await tryGet(() => client.getPage(root));
  if (!page) {
    throw new ToolkitError(EXIT.ERROR, `The Notion root page ${root} was not found, or the "Notion CLI" connection cannot see it.`, {
      fix: 'Check the id, then share the page with the Notion CLI connection in the Notion app.',
    });
  }
  if (!usable(page)) throw new ToolkitError(EXIT.ERROR, `The Notion root page ${root} is in the trash.`, { fix: 'Restore it from the Notion trash, or give another root page.' });

  // A Projects database named on the command line must exist under the root page:
  // the toolkit never makes a second Projects database in its place.
  const named = normalizeId(projectsDatabaseId || '');
  if (named) {
    const db = await tryGet(() => client.getDatabase(named));
    if (!db || !usable(db)) {
      throw new ToolkitError(EXIT.INVALID, `The Projects database ${named} was not found, is in the trash, or the "Notion CLI" connection cannot see it.`, {
        fix: 'Check the id, and share the database with the Notion CLI connection.',
      });
    }
    if (!(await underRoot(client, 'database', named))) {
      throw new ToolkitError(EXIT.INVALID, `The Projects database ${named} is not under the root page ${root}, so the toolkit will not use it.`, {
        fix: 'Give the id of the Projects database on the root page, or a different root page.',
      });
    }
  }

  const found = await ensureDatabase(client, {
    parentPageId: root,
    storedId: named || stored.databaseId,
    title: PROJECTS_TITLE,
    icon: '🎯',
    properties: [...PROJECTS_BASE_PROPERTIES, ...PROJECTS_REGISTRY_PROPERTIES],
    check,
  });
  if (found.missing) {
    return { rootPageId: root, projects: null, created: false, added: [], problems: [...found.problems, 'The Projects database is missing under the root page.'] };
  }
  const props = await ensureProperties(client, found.dataSourceId, PROJECTS_REGISTRY_PROPERTIES, { stored: storedFor(found, stored.databaseId, stored.properties), check });
  const titleProp = Object.entries(props.schema.properties || {}).find(([, p]) => p.type === 'title');
  const problems = [...found.problems, ...props.problems];
  if (found.moved) problems.push('The Projects database is no longer directly on the root page. It is still used.');
  const ids = { ...props.ids };
  if (titleProp) ids.title = titleProp[1].id;
  return {
    rootPageId: root,
    projects: {
      databaseId: normalizeId(found.database.id),
      dataSourceId: found.dataSourceId,
      url: found.database.url || null,
      properties: ids,
      names: { ...props.names, ...(titleProp ? { title: titleProp[0] } : {}) },
    },
    created: found.created,
    added: [...props.added, ...props.optionsAdded],
    problems,
  };
}

// ------------------------------------------------------------------ project

function gitRemote(root) {
  if (!root) return null;
  const res = run('git', ['remote', 'get-url', 'origin'], { cwd: root, timeoutMs: 5000 });
  const url = res.code === 0 ? res.stdout.trim() : '';
  if (!url) return null;
  if (/^git@([^:]+):(.+?)(\.git)?$/.test(url)) {
    const m = /^git@([^:]+):(.+?)(\.git)?$/.exec(url);
    return `https://${m[1]}/${m[2]}`;
  }
  return /^https?:\/\//.test(url) ? url.replace(/\.git$/, '') : null;
}

function registryValues({ config, mainRoot, repository, names, workItemsDs, memoryDs, today, withTitle }) {
  const project = config.project || {};
  const props = {};
  const set = (key, value) => {
    if (names[key]) props[names[key]] = value;
  };
  if (withTitle) set('title', { title: richText(project.name || project.key || 'Project') });
  set('key', { rich_text: richText(project.key || '') });
  set('localPath', { rich_text: richText(mainRoot || '') });
  set('tracker', { select: config.tracker && config.tracker.type ? { name: config.tracker.type } : null });
  set('memorySystem', { select: config.memory && config.memory.type ? { name: config.memory.type } : null });
  set('salesforce', { checkbox: Boolean(config.salesforce && config.salesforce.enabled) });
  if (repository) set('repository', { url: repository });
  if (workItemsDs !== undefined) set('workItemsDataSource', { rich_text: richText(workItemsDs || '') });
  if (memoryDs !== undefined) set('memoryDataSource', { rich_text: richText(memoryDs || '') });
  set('setUpOn', { date: { start: today } });
  return props;
}

function projectPageMarkdown(config, mainRoot) {
  const where = mainRoot ? ` Folder: ${mainRoot}.` : '';
  return [
    '<callout icon="🧭" color="blue_bg">',
    `\tThis page holds the work items and memory of ${escapeText(config.project && config.project.name ? config.project.name : 'this project')}. Agents update it through the toolkit.${escapeText(where)}`,
    '</callout>',
  ].join('\n');
}

function escapeText(s) {
  return String(s ?? '').replace(/([<>$|{}^\\])/g, '\\$1');
}

/** True when a page property value already holds what would be written. */
function sameValue(current, wanted) {
  if (!current || !wanted) return false;
  const type = Object.keys(wanted)[0];
  const w = wanted[type];
  switch (type) {
    case 'title':
    case 'rich_text':
      return plain(current[type]) === plain(w);
    case 'select':
      return ((current.select && current.select.name) || null) === ((w && w.name) || null);
    case 'checkbox':
      return Boolean(current.checkbox) === Boolean(w);
    case 'url':
      return (current.url || null) === (w || null);
    case 'date':
      return ((current.date && current.date.start) || null) === ((w && w.start) || null);
    default:
      return false;
  }
}

/** Only the registry values that differ from what the row holds. "Set up on" is written once. */
function changedRegistryValues(row, values, names) {
  const props = (row && row.properties) || {};
  const out = {};
  for (const [name, value] of Object.entries(values)) {
    const current = props[name];
    if (name === names.setUpOn && current && current.date && current.date.start) continue;
    if (!sameValue(current, value)) out[name] = value;
  }
  return out;
}

/** The Key value of a project row ('' when empty). */
function rowKey(page, projects) {
  const id = projects.properties && projects.properties.key;
  const name = projects.names && projects.names.key;
  const entry = Object.entries((page && page.properties) || {}).find(([n, p]) => (id && samePropertyId(p.id, id)) || (name && n === name));
  return entry ? plain(entry[1].rich_text || entry[1].title).trim() : '';
}

/** True when a page is a row of the Projects database. */
function inProjects(page, projects) {
  const p = page && page.parent;
  if (!p) return false;
  return (Boolean(p.data_source_id) && normalizeId(p.data_source_id) === normalizeId(projects.dataSourceId || ''))
    || (Boolean(p.database_id) && normalizeId(p.database_id) === normalizeId(projects.databaseId || ''));
}

/**
 * The project's row in Projects. The row stored in .toolkit.json is used only
 * when it is a row of the Projects database under the root page and its Key is
 * empty or matches this project's key. Otherwise the row is looked up by Key.
 * Returns { row, problems, notes }.
 */
async function findProjectRow(client, projects, key, storedPageId) {
  const problems = [];
  const notes = [];
  if (storedPageId) {
    const page = await tryGet(() => client.getPage(storedPageId));
    if (usable(page)) {
      const id = normalizeId(page.id);
      const have = rowKey(page, projects);
      if (!inProjects(page, projects) || !(await underRoot(client, 'page', id))) {
        problems.push(`The stored project row (${id}) is not a row of the Projects database under the root page, so it was not used.`);
      } else if (have && key && have !== key) {
        notes.push(`The project row stored in .toolkit.json (${id}) has the Key "${have}", not "${key}". It belongs to another project (a copied .toolkit.json?), so it was not used or changed. This project uses the row whose Key is "${key}".`);
      } else {
        return { row: page, problems, notes };
      }
    }
  }
  if (!key || !projects.names.key) return { row: null, problems, notes };
  const rows = await client.queryAll(projects.dataSourceId, { filter: { property: projects.properties.key, rich_text: { equals: key } } });
  for (const r of rows) {
    if (usable(r) && inProjects(r, projects) && (await underRoot(client, 'page', r.id))) return { row: r, problems, notes };
  }
  return { row: null, problems, notes };
}

/**
 * The seed text of a Notion memory page: the model's own template
 * (.memory/CURRENT_FOCUS.md or .memory/terminology-glossary.md), as it is.
 * Null when the plugin copy of the model is missing.
 */
function templateText(name) {
  try {
    return readTemplate(name);
  } catch {
    return null;
  }
}

async function ensureChildPage(client, { parentPageId, storedId, title, seed, check }) {
  const problems = [];
  if (storedId) {
    const page = await tryGet(() => client.getPage(storedId));
    if (usable(page)) {
      if (await underRoot(client, 'page', page.id)) return { id: normalizeId(page.id), created: false, problems };
      problems.push(`The stored ${title} page (${normalizeId(storedId)}) is outside the root page, so it was not used.`);
    }
  }
  const kids = await childrenOf(client, parentPageId);
  const match = kids.find((k) => k.kind === 'page' && k.title.trim().toLowerCase() === title.toLowerCase());
  if (match) return { id: match.id, created: false, problems };
  if (check) return { id: null, created: false, missing: true, problems };
  const body = seed ? toNotion(stripTitle(seed).body) : '';
  const page = await client.createPage({
    parent: { type: 'page_id', page_id: normalizeId(parentPageId) },
    properties: { title: { title: richText(title) } },
    ...(body ? { markdown: body } : {}),
  });
  client.trust(page.id);
  return { id: normalizeId(page.id), created: true, problems };
}

/**
 * Build or repair one project's Notion structure.
 * opts: { client, config, root, mainRoot, rootPageId, check, now, projectsDatabaseId }
 * Returns { notion (the new .toolkit.json block), report }. report.verifiedAt is
 * the time of the read-back check; it is not part of the .toolkit.json block,
 * so a run that changes nothing leaves .toolkit.json as it is.
 */
export async function ensureProject({ client, config, root, mainRoot, rootPageId, check = false, now = () => new Date(), projectsDatabaseId = null }) {
  if (!config || typeof config !== 'object') throw new ToolkitError(EXIT.INVALID, 'ensure-project needs the project settings.');
  const today = localToday(now());
  const stored = config.notion || {};
  const report = { created: [], added: [], problems: [], notes: [] };
  const rootResult = await ensureRoot({ client, rootPageId: rootPageId || stored.rootPageId, stored: stored.projects || {}, check, projectsDatabaseId });
  report.added.push(...rootResult.added.map((a) => `Projects: ${a}`));
  report.problems.push(...rootResult.problems);
  if (rootResult.created) report.created.push('Projects database');
  const projects = rootResult.projects;
  if (!projects) return { notion: stored, report };

  const project = config.project || {};
  const trackerNotion = Boolean(config.tracker && config.tracker.type === 'notion');
  const memoryNotion = Boolean(config.memory && config.memory.type === 'notion');
  const repository = gitRemote(mainRoot || root);

  // The project row.
  const storedRowId = normalizeId((stored.project && stored.project.pageId) || '');
  const found = await findProjectRow(client, projects, project.key, storedRowId);
  report.problems.push(...found.problems);
  report.notes.push(...found.notes);
  let row = found.row;
  if (!row) {
    if (check) {
      report.problems.push(`There is no row for ${project.key || 'this project'} in the Projects database.`);
      return { notion: stored, report };
    }
    row = await client.createPage({
      parent: { type: 'data_source_id', data_source_id: projects.dataSourceId },
      properties: registryValues({ config, mainRoot: mainRoot || root, repository, names: projects.names, today, withTitle: true }),
      markdown: projectPageMarkdown(config, mainRoot || root),
    });
    client.trust(row.id);
    report.created.push(`Project row "${project.name || project.key}"`);
  }
  const projectPageId = normalizeId(row.id);

  // Ids stored for another row (a copied .toolkit.json, or a row that was replaced)
  // are not used: the databases and pages are looked up again under this row's page.
  const sameRow = Boolean(storedRowId) && storedRowId === projectPageId;
  const sub = (name) => (sameRow ? stored[name] || {} : {});
  if (storedRowId && !sameRow && (stored.workItems || stored.memory)) {
    report.notes.push('The Work Items and Memory ids in .toolkit.json belonged to another project row, so they were looked up again under this project\'s page.');
  }

  const notion = {
    rootPageId: rootResult.rootPageId,
    projects: { databaseId: projects.databaseId, dataSourceId: projects.dataSourceId, properties: projects.properties },
    project: { pageId: projectPageId, url: row.url || null, key: project.key || null },
  };

  // Work Items.
  if (trackerNotion) {
    const configured = String((config.tracker && config.tracker.idPrefix) || 'WI').toUpperCase();
    const s = sub('workItems');
    const db = await ensureDatabase(client, {
      parentPageId: projectPageId,
      storedId: s.databaseId,
      title: WORK_ITEMS_TITLE,
      icon: '🗂️',
      properties: (p) => workItemProperties({ prefix: p || configured }),
      prefixes: prefixCandidates(configured, project.key),
      check,
    });
    report.problems.push(...db.problems);
    if (db.missing) report.problems.push('The Work Items database is missing.');
    else {
      if (db.created) report.created.push('Work Items database');
      const existing = Object.values((await client.getDataSource(db.dataSourceId)).properties || {}).find((p) => p.type === 'unique_id');
      const prefix = (existing && existing.unique_id && existing.unique_id.prefix) || db.usedPrefix || configured;
      const wanted = workItemProperties({ prefix });
      if (db.moved) report.problems.push('The Work Items database was moved off the project page. It is still used.');
      const storedProps = storedFor(db, s.databaseId, s.properties);
      const props = await ensureProperties(client, db.dataSourceId, wanted, { stored: storedProps, check });
      const rels = await ensureSelfRelations(client, db.dataSourceId, WORK_ITEM_RELATIONS, { stored: storedProps, check });
      const ids = { ...props.ids, ...rels.ids };
      const names = { ...props.names, ...rels.names };
      report.added.push(...props.added.map((a) => `Work Items: ${a}`), ...props.optionsAdded.map((a) => `Work Items: ${a}`), ...rels.added.map((a) => `Work Items: ${a}`));
      report.problems.push(...props.problems, ...rels.problems);
      if (prefix !== configured) {
        report.notes.push(db.created && db.usedPrefix === prefix
          ? `Notion lets only one database in a workspace use an ID prefix, and ${configured} is already used, so this project's work items are ${prefix}-1, ${prefix}-2 in Notion (${prefix}-001 in the toolkit). tracker.idPrefix in .toolkit.json is now ${prefix}.`
          : `The Work Items database numbers items with the prefix ${prefix}, so tracker.idPrefix in .toolkit.json is now ${prefix}.`);
      }
      report.trackerPrefix = prefix;
      const views = await ensureWorkItemViews(client, { databaseId: normalizeId(db.database.id), dataSourceId: db.dataSourceId, ids, stored: storedFor(db, s.databaseId, s.views), check });
      report.created.push(...views.created.map((v) => `Work Items view: ${v}`));
      report.problems.push(...views.problems);
      notion.workItems = {
        databaseId: normalizeId(db.database.id),
        dataSourceId: db.dataSourceId,
        url: db.database.url || null,
        idPrefix: prefix,
        properties: ids,
        names,
        views: views.views,
      };
    }
  }

  // Memory.
  if (memoryNotion) {
    const s = sub('memory');
    const db = await ensureDatabase(client, { parentPageId: projectPageId, storedId: s.databaseId, title: MEMORY_TITLE, icon: '🧠', properties: MEMORY_PROPERTIES, check });
    report.problems.push(...db.problems);
    if (db.missing) report.problems.push('The Memory database is missing.');
    else {
      if (db.created) report.created.push('Memory database');
      if (db.moved) report.problems.push('The Memory database was moved off the project page. It is still used.');
      const props = await ensureProperties(client, db.dataSourceId, MEMORY_PROPERTIES, { stored: storedFor(db, s.databaseId, s.properties), check });
      report.added.push(...props.added.map((a) => `Memory: ${a}`), ...props.optionsAdded.map((a) => `Memory: ${a}`));
      report.problems.push(...props.problems);
      const views = await ensureMemoryViews(client, { databaseId: normalizeId(db.database.id), dataSourceId: db.dataSourceId, ids: props.ids, stored: storedFor(db, s.databaseId, s.views), check });
      report.created.push(...views.created.map((v) => `Memory view: ${v}`));
      report.problems.push(...views.problems);
      const focus = await ensureChildPage(client, { parentPageId: projectPageId, storedId: s.pages && s.pages.focus, title: FOCUS_PAGE_TITLE, seed: templateText('memory/CURRENT_FOCUS'), check });
      const glossary = await ensureChildPage(client, { parentPageId: projectPageId, storedId: s.pages && s.pages.glossary, title: GLOSSARY_PAGE_TITLE, seed: templateText('memory/glossary'), check });
      report.problems.push(...focus.problems, ...glossary.problems);
      if (focus.created) report.created.push('Current focus page');
      if (glossary.created) report.created.push('Terminology glossary page');
      if (focus.missing) report.problems.push('The Current focus page is missing.');
      if (glossary.missing) report.problems.push('The Terminology glossary page is missing.');
      notion.memory = {
        databaseId: normalizeId(db.database.id),
        dataSourceId: db.dataSourceId,
        url: db.database.url || null,
        properties: props.ids,
        names: props.names,
        views: views.views,
        pages: { focus: focus.id, glossary: glossary.id },
      };
    }
  }

  // Registry values on the project row: only the ones that differ.
  if (!check) {
    const values = registryValues({
      config,
      mainRoot: mainRoot || root,
      repository,
      names: projects.names,
      today,
      withTitle: false,
      workItemsDs: notion.workItems ? notion.workItems.dataSourceId : undefined,
      memoryDs: notion.memory ? notion.memory.dataSourceId : undefined,
    });
    const changed = changedRegistryValues(row, values, projects.names);
    if (Object.keys(changed).length) await client.updatePage(projectPageId, { properties: changed });
  }

  // Read back and compare.
  if (!check) {
    const verify = await verifyProject(client, notion, { trackerNotion, memoryNotion });
    report.problems.push(...verify);
    report.verifiedAt = nowIso(now());
  }
  return { notion, report };
}

/** Read the structure back; returns a list of problems ([] when everything matches). */
export async function verifyProject(client, notion, { trackerNotion, memoryNotion } = {}) {
  const problems = [];
  if (trackerNotion && notion.workItems) {
    const ds = await client.getDataSource(notion.workItems.dataSourceId);
    const byId = new Map(Object.entries(ds.properties || {}).map(([n, p]) => [p.id, { name: n, ...p }]));
    for (const [key, id] of Object.entries(notion.workItems.properties || {})) {
      if (!byId.has(id)) problems.push(`Work Items: the ${key} property (${id}) is missing after setup.`);
    }
    const stage = byId.get(notion.workItems.properties.stage);
    if (stage && stage.select && stage.select.options.length < 14) problems.push('Work Items: the Stage property has fewer than 14 options.');
    const parent = byId.get(notion.workItems.properties.parent);
    if (parent && (parent.type !== 'relation' || normalizeId(parent.relation.data_source_id) !== normalizeId(notion.workItems.dataSourceId))) {
      problems.push('Work Items: Parent item is not a relation to the Work Items database.');
    }
    for (const [name, id] of Object.entries(notion.workItems.views || {})) {
      const v = await tryGet(() => client.getView(id));
      if (!v) problems.push(`Work Items: the ${name} view is missing after setup.`);
      else if (name === 'board' && !samePropertyId(groupProperty(v), notion.workItems.properties.stage)) problems.push('Work Items: the Board view is not grouped by Stage.');
    }
  }
  if (memoryNotion && notion.memory) {
    const ds = await client.getDataSource(notion.memory.dataSourceId);
    const ids = new Set(Object.values(ds.properties || {}).map((p) => p.id));
    for (const [key, id] of Object.entries(notion.memory.properties || {})) {
      if (!ids.has(id)) problems.push(`Memory: the ${key} property (${id}) is missing after setup.`);
    }
    for (const [name, id] of Object.entries(notion.memory.pages || {})) {
      if (!id) problems.push(`Memory: the ${name} page is missing.`);
    }
  }
  return problems;
}

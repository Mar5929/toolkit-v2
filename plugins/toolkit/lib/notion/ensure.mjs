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
//                memory is Notion, its memory in Lore's layout: a "Memory" page
//                under the project row holding Lore's five databases (Projects,
//                Topics, Memories, Entities, Facts; lore-schema.mjs), the
//                toolkit's added Memories columns, the Index and Retired views,
//                and one row naming the project in that page's Projects
//                database; plus the Current focus and Terminology glossary
//                pages, which stay child pages of the project row.
//                Returns the new "notion" block for .toolkit.json.
//
// Moving an older project: a project whose memory is still the older single
// "Memory" database on its row gets the Lore layout next to it, every record
// is copied into the Memories database and read back (the same text, so the
// same version), and then the old database is renamed "Old memory database
// (safe to delete)". It is never deleted. When a row cannot be moved, the old
// database keeps its name and the report says which rows are left.
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
  MEMORY_PAGE_TITLE, OLD_MEMORY_DATABASE_TITLE, LORE_MEMORY_ADDED_PROPERTIES, LORE_MEMORY_USED, loreMemoriesWanted,
} from './schema.mjs';
import { VAULT_DATABASES, VAULT_TITLES, LORE_COMMIT, LORE_VERSION, loreProperties, loreIcon } from './lore-schema.mjs';

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

/**
 * Why a page or database cannot be used: 'trash' (in the Notion trash),
 * 'archived' (archived with Notion's archive, which is not the trash), or
 * null. The two need different fixes (2026-09-26: Mike's root page was
 * archived, not trashed, and the old message said "in the trash").
 */
export function goneState(obj) {
  if (!obj) return null;
  if (obj.in_trash === true || (obj.in_trash === undefined && obj.archived === true)) return 'trash';
  if (obj.is_archived === true) return 'archived';
  return null;
}

/** How to bring back a page or database that goneState says is gone. */
function restoreFix(state) {
  return state === 'archived'
    ? 'Open it in the Notion app and restore it from the archive (it is not in the trash), then run this command again. The toolkit does not restore it by itself.'
    : 'Restore it from the trash in the Notion app (Trash, in the sidebar), then run this command again.';
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
    const target = type === 'relation' && w.spec.relation.data_source_id;
    if (target && found.prop.relation && normalizeId(found.prop.relation.data_source_id || '') !== normalizeId(target)) {
      problems.push(`The relation "${found.name}" points at another database than the toolkit expects (${normalizeId(target)}). It was left as it is.`);
      continue;
    }
    if ((type === 'select' || type === 'multi_select' || type === 'status') && w.spec[type].options) {
      const have = new Set(((found.prop[type] && found.prop[type].options) || []).map((o) => o.name));
      const missing = w.spec[type].options.filter((o) => !have.has(o.name));
      if (missing.length) {
        if (type === 'status') {
          problems.push(`The status property "${found.name}" lacks the options ${missing.map((o) => o.name).join(', ')}. Add them in the Notion app (the API cannot add status options to an existing property).`);
        } else {
          // Send every existing option back in full, description included, so none is changed.
          const keep = ((found.prop[type] && found.prop[type].options) || []).map((o) => ({
            id: o.id, name: o.name, color: o.color, ...(o.description ? { description: o.description } : {}),
          }));
          patch[found.name] = { [type]: { options: [...keep, ...missing] } };
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
async function ensureDatabase(client, { parentPageId, storedId, title, icon, properties, check, prefixes = null, inline = true }) {
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
          is_inline: inline,
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

/**
 * The memory views: "Index" (records in use) and "Retired". With lore: true
 * they are for Lore's Memories database (Status accepted or proposed in use;
 * superseded or deprecated retired; sorted by Record Key, which starts with the
 * type); otherwise for the older Memory database.
 */
export async function ensureMemoryViews(client, { databaseId, dataSourceId, ids, stored = {}, check = false, lore = false }) {
  const views = await listViews(client, databaseId);
  const byId = (id) => views.find((v) => normalizeId(v.id) === normalizeId(id || ''));
  const created = [];
  const problems = [];
  const out = {};
  const label = lore ? 'Memories database' : 'Memory database';
  const inUse = lore
    ? { and: ['superseded', 'deprecated', 'rejected'].map((w) => ({ property: ids.status, select: { does_not_equal: w } })) }
    : { property: ids.status, select: { does_not_equal: 'retired' } };
  const retired = lore
    ? { or: ['superseded', 'deprecated'].map((w) => ({ property: ids.status, select: { equals: w } })) }
    : { property: ids.status, select: { equals: 'retired' } };
  const sorts = (lore
    ? [{ property: ids.recordKey, direction: 'ascending' }]
    : [{ property: ids.type, direction: 'ascending' }, { property: ids.title, direction: 'ascending' }]).filter((s) => s.property);

  let index = byId(stored.index) || views.find((v) => v.type === 'table' && /^index$/i.test(v.name || ''));
  if (!index) {
    const tables = views.filter((v) => v.type === 'table');
    const fresh = tables.length === 1 && /^(default view|table|untitled)?$/i.test((tables[0].name || '').trim()) ? tables[0] : null;
    if (check) problems.push(`The Index view of the ${label} is missing.`);
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
    if (check) problems.push(`The Retired view of the ${label} is missing.`);
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
  if (!usable(page)) {
    const state = goneState(page) || 'trash';
    throw new ToolkitError(EXIT.ERROR, `The Notion root page ${root} is ${state === 'archived' ? 'archived in Notion (it is not in the trash)' : 'in the Notion trash'}.`, {
      state,
      fix: `${restoreFix(state)} Or give another root page.`,
    });
  }

  // A Projects database named on the command line must exist under the root page:
  // the toolkit never makes a second Projects database in its place.
  const named = normalizeId(projectsDatabaseId || '');
  if (named) {
    const db = await tryGet(() => client.getDatabase(named));
    if (!db) {
      throw new ToolkitError(EXIT.INVALID, `The Projects database ${named} was not found, or the "Notion CLI" connection cannot see it.`, {
        fix: 'Check the id, and share the database with the Notion CLI connection.',
      });
    }
    if (!usable(db)) {
      const state = goneState(db) || 'trash';
      throw new ToolkitError(EXIT.INVALID, `The Projects database ${named} is ${state === 'archived' ? 'archived in Notion (it is not in the trash)' : 'in the Notion trash'}.`, { state, fix: restoreFix(state) });
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
  const schemaProps = Object.entries(props.schema.properties || {});
  const titleProp = schemaProps.find(([, p]) => p.type === 'title');
  // The Status column the "Active Projects" board groups by: a new project row gets Active.
  const statusProp = schemaProps.find(([n, p]) => p.type === 'status' && n === 'Status') || schemaProps.find(([, p]) => p.type === 'status');
  const problems = [...found.problems, ...props.problems];
  if (found.moved) problems.push('The Projects database is no longer directly on the root page. It is still used.');
  const ids = { ...props.ids };
  if (titleProp) ids.title = titleProp[1].id;
  const names = { ...props.names, ...(titleProp ? { title: titleProp[0] } : {}) };
  const statusOptions = statusProp && statusProp[1].status ? (statusProp[1].status.options || []).map((o) => o.name) : [];
  // The registry columns shown in the "All Projects" table (notion-design.md section 15, step 2).
  const schemaIds = schemaProps.map(([, p]) => p.id).filter(Boolean);
  const view = await ensureProjectsViewColumns(client, { databaseId: normalizeId(found.database.id), ids: props.ids, names: props.names, schemaIds, check });
  problems.push(...view.problems);
  return {
    rootPageId: root,
    projects: {
      databaseId: normalizeId(found.database.id),
      dataSourceId: found.dataSourceId,
      url: found.database.url || null,
      properties: ids,
      names,
      ...(statusProp ? { status: { id: statusProp[1].id, name: statusProp[0], options: statusOptions } } : {}),
    },
    created: found.created,
    added: [...props.added, ...props.optionsAdded, ...view.added],
    problems,
    warnings: view.warnings,
  };
}

/** The Projects database's table view the registry columns go into: "All Projects", or the only table view. */
function projectsTableView(views) {
  const tables = views.filter((v) => v.type === 'table');
  return tables.find((v) => /^all projects$/i.test(String(v.name || '').trim())) || (tables.length === 1 ? tables[0] : null);
}

/**
 * Show the registry columns (Key, Tracker, ...) in the Projects database's
 * "All Projects" table view (the Notion rebuild check: ensure-root added the
 * properties to the database but not to the view). A column the view already
 * lists, shown or hidden, is left as it is: a column Mike hid stays hidden.
 *
 * The view is not what ensure-root is for, so it never stops the setup
 * (final Notion run, 2026-09-28: Mike's "All Projects" view listed the column
 * "eizm" of a deleted property, Notion refused the PATCH with 400
 * validation_error, and the failed run saved no ids at all):
 * - a listed column whose property is not in the data source schema
 *   (`schemaIds`) is left out of the update, and a warning names it;
 * - a Notion error from the update is a warning, not a thrown error.
 * Returns { added: ["All Projects view: Key", ...], problems, warnings }.
 */
export async function ensureProjectsViewColumns(client, { databaseId, ids, names = {}, schemaIds = null, check = false }) {
  const out = { added: [], problems: [], warnings: [] };
  let views;
  try {
    views = await listViews(client, databaseId);
  } catch (err) {
    if (isNotionError(err)) {
      out.problems.push(`The views of the Projects database could not be read (${err.message}), so the registry columns were not added to them.`);
      return out;
    }
    throw err;
  }
  const view = projectsTableView(views);
  if (!view) return out;
  const cfg = view.configuration || {};
  const listed = Array.isArray(cfg.properties) ? cfg.properties : null;
  if (!listed) return out; // No column list: Notion shows every property.
  const missing = PROJECTS_REGISTRY_PROPERTIES.filter((p) => ids[p.key] && !listed.some((q) => samePropertyId(q.property_id, ids[p.key])));
  if (!missing.length) return out;
  const label = view.name || 'table';
  if (check) {
    out.problems.push(`The "${label}" view of the Projects database does not show the columns ${missing.map((p) => names[p.key] || p.name).join(', ')}.`);
    return out;
  }
  const missingNames = missing.map((p) => names[p.key] || p.name).join(', ');
  // Notion keeps a deleted property's column in a view's list, and refuses a
  // list that names it. Only columns of properties that exist are sent back.
  const inSchema = (q) => !Array.isArray(schemaIds) || schemaIds.some((id) => samePropertyId(id, q.property_id));
  const kept = listed.filter(inSchema);
  const stale = listed.filter((q) => !inSchema(q));
  if (stale.length) {
    out.warnings.push(`The "${label}" view listed ${stale.length === 1 ? 'a column' : `${stale.length} columns`} of a deleted property (${stale.map((q) => q.property_id).join(', ')}). ${stale.length === 1 ? 'It was' : 'They were'} left out of the view's column list.`);
  }
  const properties = [...kept.map((q) => ({ ...q })), ...missing.map((p) => ({ property_id: ids[p.key], visible: true }))];
  // The whole configuration is sent back with the new column list, so a
  // Notion that replaces the configuration keeps the view's other settings
  // (sort, wrap, grouping) either way (verifier, fix round 2).
  let updated;
  try {
    updated = await client.updateView(view.id, { configuration: { ...cfg, type: cfg.type || view.type || 'table', properties } });
  } catch (err) {
    if (!isNotionError(err)) throw err;
    out.warnings.push(`The "${label}" view of the Projects database could not be changed (${err.message}), so it does not show the columns ${missingNames}. The Projects database itself is ready. Tell the owner; he can show the columns in the Notion app. Never change his Notion view with ntn api.`);
    return out;
  }
  const back = (updated && updated.configuration && updated.configuration.properties) || [];
  const shown = missing.filter((p) => back.some((q) => samePropertyId(q.property_id, ids[p.key]) && q.visible !== false));
  out.added.push(...shown.map((p) => `${label} view: ${names[p.key] || p.name}`));
  const notShown = missing.filter((p) => !shown.includes(p));
  if (notShown.length) out.problems.push(`The "${label}" view still does not show ${notShown.map((p) => names[p.key] || p.name).join(', ')} after the update.`);
  return out;
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
 * empty or matches this project's key. Otherwise the row is looked up by Key,
 * then by title: a row made with the New button in Notion has no Key, so a
 * row named like the project (its name or key) with an empty Key is adopted
 * (the Notion rebuild check: otherwise setup made a second row).
 *
 * A row that is archived or in the Notion trash is never replaced by a new
 * one: its page holds the project's Work Items and Memory. `blocked` is then
 * true and the problem says how to restore it. Two rows with the project's
 * name and no Key are a question for the owner, not a guess.
 * Returns { row, problems, notes, blocked, adopted }.
 */
async function findProjectRow(client, projects, key, storedPageId, name = null) {
  const problems = [];
  const notes = [];
  const gone = (page, how) => {
    const state = goneState(page) || 'trash';
    problems.push(`The project row for ${key || 'this project'} (${page.url || normalizeId(page.id)}), ${how}, is ${state === 'archived' ? 'archived in Notion (it is not in the trash)' : 'in the Notion trash'}. Its page holds this project's work items and memory, so no new row was made. ${restoreFix(state)}`);
    return { row: null, problems, notes, blocked: true };
  };
  if (storedPageId) {
    const page = await tryGet(() => client.getPage(storedPageId));
    if (page && !usable(page) && inProjects(page, projects)) return gone(page, 'stored in .toolkit.json');
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
  let archived = null;
  for (const r of rows) {
    if (!inProjects(r, projects)) continue;
    if (!usable(r)) {
      archived = archived || r;
      continue;
    }
    if (await underRoot(client, 'page', r.id)) return { row: r, problems, notes };
  }
  if (archived) return gone(archived, `found by its Key "${key}"`);

  // A row made with the New button: no Key, the project's name (or key) as its title.
  const titleId = projects.properties.title || 'title';
  const names = [...new Set([name, key].filter((x) => x && String(x).trim()))];
  const candidates = [];
  for (const n of names) {
    let found = [];
    try {
      found = await client.queryAll(projects.dataSourceId, { filter: { property: titleId, title: { equals: String(n).trim() } } });
    } catch (err) {
      if (!isNotionError(err)) throw err;
      found = [];
    }
    for (const r of found) {
      if (!inProjects(r, projects) || rowKey(r, projects) || candidates.some((c) => normalizeId(c.id) === normalizeId(r.id))) continue;
      if (!(await underRoot(client, 'page', r.id))) continue;
      candidates.push(r);
    }
  }
  const live = candidates.filter((r) => usable(r));
  if (live.length === 1) {
    const title = plain(Object.values(live[0].properties || {}).find((v) => v && v.type === 'title')?.title);
    notes.push(`Used the row "${title}" made in Notion with the New button (it had no Key). Its Key is now ${key}.`);
    return { row: live[0], problems, notes, adopted: true };
  }
  if (live.length > 1) {
    problems.push(`${live.length} rows in the Projects database are named "${names[0]}" and have no Key, so the toolkit did not pick one and made no new row. Fill in the Key "${key}" on the row that is this project (in Notion), then run toolkit notion ensure-project again.`);
    return { row: null, problems, notes, blocked: true };
  }
  if (candidates.length) return gone(candidates[0], `named "${names[0]}"`);
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

/**
 * Find a child page by its stored id or by title under the parent page, or
 * create it. seed: model template text (its "# Title" line is left out);
 * text: Notion Markdown for a page with no template. With withUrl the page is
 * read when needed, so the result always has its url.
 * Returns { id, url, created, problems } or with check and nothing found { missing: true }.
 */
async function ensureChildPage(client, { parentPageId, storedId, title, seed, text = '', check, withUrl = false }) {
  const problems = [];
  if (storedId) {
    const page = await tryGet(() => client.getPage(storedId));
    if (usable(page)) {
      if (await underRoot(client, 'page', page.id)) return { id: normalizeId(page.id), url: page.url || null, created: false, problems };
      problems.push(`The stored ${title} page (${normalizeId(storedId)}) is outside the root page, so it was not used.`);
    }
  }
  const kids = await childrenOf(client, parentPageId);
  const match = kids.find((k) => k.kind === 'page' && k.title.trim().toLowerCase() === title.toLowerCase());
  if (match) {
    const page = withUrl ? await tryGet(() => client.getPage(match.id)) : null;
    return { id: match.id, url: (page && page.url) || null, created: false, problems };
  }
  if (check) return { id: null, created: false, missing: true, problems };
  const body = seed ? toNotion(stripTitle(seed).body) : text;
  const page = await client.createPage({
    parent: { type: 'page_id', page_id: normalizeId(parentPageId) },
    properties: { title: { title: richText(title) } },
    ...(body ? { markdown: body } : {}),
  });
  client.trust(page.id);
  return { id: normalizeId(page.id), url: page.url || null, created: true, problems };
}

// ------------------------------------------------------------------ memory in Lore's layout

/** The text at the top of a project's Memory page. */
function memoryPageMarkdown(config) {
  const name = config.project && config.project.name ? config.project.name : 'this project';
  return [
    '<callout icon="🧠" color="gray_bg">',
    `\t${escapeText(`This page holds the memory records of ${name} in the layout of Lore, Notion's open-source AI memory (github.com/makenotion/lore, version ${LORE_VERSION}). Agents write the Memories database through the toolkit. Lore needs all five databases on this page: Projects, Topics, Memories, Entities, and Facts. The Current focus and Terminology glossary pages are on the project page.`)}`,
    '</callout>',
  ].join('\n');
}

/** The values of this project's row in the Memory page's Projects database (Lore's project row). */
function vaultProjectValues(config) {
  const project = config.project || {};
  return {
    Name: { title: richText(project.name || project.key || 'Project') },
    Type: { select: { name: 'project' } },
    Path: { rich_text: richText('.') },
    Status: { select: { name: 'active' } },
    Description: { rich_text: richText(`${project.key ? `Toolkit project ${project.key}.` : 'Toolkit project.'} Its memory records are rows of the Memories database on this page.`) },
  };
}

/**
 * The project's row in the Memory page's Projects database. Lore finds it by
 * Path "." (the whole project) or by Name. Returns { id, created, problems }.
 */
async function ensureVaultProjectRow(client, { dataSourceId, storedId, config, check }) {
  const problems = [];
  let row = null;
  if (storedId) {
    const page = await tryGet(() => client.getPage(storedId));
    if (usable(page) && page.parent && normalizeId(page.parent.data_source_id || '') === normalizeId(dataSourceId)) row = page;
  }
  if (!row) {
    const rows = await client.queryAll(dataSourceId, { filter: { property: 'Path', rich_text: { equals: '.' } } });
    row = rows.find((r) => usable(r)) || null;
  }
  const values = vaultProjectValues(config);
  if (!row) {
    if (check) return { id: null, created: false, problems: ['The Projects database on the Memory page has no row for this project.'] };
    row = await client.createPage({ parent: { type: 'data_source_id', data_source_id: normalizeId(dataSourceId) }, properties: values });
    client.trust(row.id);
    return { id: normalizeId(row.id), created: true, problems };
  }
  if (!check) {
    const changed = {};
    for (const [name, value] of Object.entries(values)) {
      if (!sameValue((row.properties || {})[name], value)) changed[name] = value;
    }
    if (Object.keys(changed).length) await client.updatePage(row.id, { properties: changed });
  }
  return { id: normalizeId(row.id), created: false, problems };
}

/** Pick some keys of an object. */
function pick(obj, keys) {
  const out = {};
  for (const k of keys) if (obj && obj[k] !== undefined) out[k] = obj[k];
  return out;
}

/**
 * Build or repair one project's memory in Lore's layout under its row.
 * stored: the .toolkit.json memory block (used only when it is a Lore block).
 * Returns { block, created, added, problems } (block null when the Memories
 * database is missing in a --check run).
 */
async function ensureLoreMemory(client, { projectPageId, config, stored, check }) {
  const s = stored && stored.layout === 'lore' ? stored : {};
  const out = { block: null, created: [], added: [], problems: [] };
  const page = await ensureChildPage(client, {
    parentPageId: projectPageId, storedId: s.pageId, title: MEMORY_PAGE_TITLE, text: memoryPageMarkdown(config), check, withUrl: true,
  });
  out.problems.push(...page.problems);
  if (page.missing) {
    out.problems.push('The Memory page (Lore layout) is missing.');
    return out;
  }
  if (page.created) out.created.push('Memory page (Lore layout)');

  // The five databases, in Lore's order: each relation needs the database it points at.
  const dbs = {};
  const ids = {};
  const storedDbs = s.databases || {};
  for (const which of VAULT_DATABASES) {
    const title = VAULT_TITLES[which];
    let wanted;
    try {
      wanted = which === 'memories' ? loreMemoriesWanted({ projects: ids.projects, topics: ids.topics }) : loreProperties(which, ids);
    } catch {
      out.problems.push(`The ${title} database was not checked, because a database it points at is missing.`);
      continue;
    }
    const db = await ensureDatabase(client, {
      parentPageId: page.id,
      storedId: (storedDbs[which] || {}).databaseId,
      title,
      icon: loreIcon(which),
      properties: wanted,
      inline: which === 'memories',
      check,
    });
    out.problems.push(...db.problems);
    if (db.missing) {
      out.problems.push(`The ${title} database is missing from the Memory page.`);
      continue;
    }
    if (db.created) out.created.push(`${title} database`);
    if (db.moved) out.problems.push(`The ${title} database is no longer directly on the Memory page, so Lore's tools will not find it. The toolkit still uses it.`);
    dbs[which] = db;
    ids[which] = db.dataSourceId;
  }

  // Every property Lore expects (its relations to Memories itself are added now that it exists), and the toolkit's columns.
  let memProps = null;
  for (const which of VAULT_DATABASES) {
    const db = dbs[which];
    if (!db) continue;
    let wanted;
    try {
      wanted = which === 'memories' ? loreMemoriesWanted(ids) : loreProperties(which, ids);
    } catch {
      continue;
    }
    const storedProps = which === 'memories' ? storedFor(db, s.databaseId, s.properties) : {};
    const res = await ensureProperties(client, db.dataSourceId, wanted, { stored: storedProps, check });
    // A database made in this run gets its relations to itself here, as part of making it.
    if (!db.created) out.added.push(...res.added.map((a) => `${VAULT_TITLES[which]}: ${a}`), ...res.optionsAdded.map((a) => `${VAULT_TITLES[which]}: ${a}`));
    out.problems.push(...res.problems);
    if (which === 'memories') memProps = res;
  }
  const mem = dbs.memories;
  if (!mem || !memProps) return out;

  const used = [...LORE_MEMORY_USED, ...LORE_MEMORY_ADDED_PROPERTIES.map((p) => p.key)];
  const properties = pick(memProps.ids, used);
  const names = pick(memProps.names, used);
  const views = await ensureMemoryViews(client, {
    databaseId: normalizeId(mem.database.id), dataSourceId: mem.dataSourceId, ids: properties, stored: storedFor(mem, s.databaseId, s.views), check, lore: true,
  });
  out.created.push(...views.created.map((v) => `Memories view: ${v}`));
  out.problems.push(...views.problems);

  let projectRowId = null;
  if (ids.projects) {
    const row = await ensureVaultProjectRow(client, { dataSourceId: ids.projects, storedId: s.projectRowId, config, check });
    out.problems.push(...row.problems);
    if (row.created) out.created.push('Project row in the Memory page\'s Projects database');
    projectRowId = row.id;
  }

  out.block = {
    layout: 'lore',
    lore: { version: LORE_VERSION, commit: LORE_COMMIT },
    pageId: page.id,
    pageUrl: page.url || null,
    databaseId: normalizeId(mem.database.id),
    dataSourceId: mem.dataSourceId,
    url: mem.database.url || null,
    databases: Object.fromEntries(VAULT_DATABASES.filter((w) => dbs[w]).map((w) => [w, { databaseId: normalizeId(dbs[w].database.id), dataSourceId: dbs[w].dataSourceId }])),
    projectRowId,
    properties,
    names,
    views: views.views,
  };
  return out;
}

/**
 * The older single Memory database on the project row, when there is one:
 * named in a .toolkit.json memory block without `layout: "lore"`, or found
 * by the title "Memory" among the row's child databases. It must have the
 * toolkit's Type and Status columns. Returns the memory block the older driver
 * reads it with ({ databaseId, dataSourceId, url, properties, names }) plus
 * { title }, or null.
 */
async function findOldMemoryDatabase(client, { projectPageId, stored }) {
  const s = stored || {};
  let db = null;
  let storedProps = {};
  if (s.layout !== 'lore' && s.databaseId) {
    db = await tryGet(() => client.getDatabase(s.databaseId));
    if (db && (!usable(db) || !(await underRoot(client, 'database', db.id)))) db = null;
    if (db) storedProps = s.properties || {};
  }
  if (!db) {
    const kids = await childrenOf(client, projectPageId);
    const match = kids.find((k) => k.kind === 'database' && k.title.trim().toLowerCase() === MEMORY_TITLE.toLowerCase());
    if (match) db = await tryGet(() => client.getDatabase(match.id));
    if (db && (!usable(db) || !(await underRoot(client, 'database', db.id)))) db = null;
  }
  if (!db) return null;
  const dataSourceId = normalizeId(((db.data_sources || [])[0] || {}).id || '');
  if (!dataSourceId) return null;
  const found = await ensureProperties(client, dataSourceId, MEMORY_PROPERTIES, { stored: storedProps, check: true });
  if (!found.ids.type || !found.ids.status) return null;
  return {
    title: databaseTitle(db),
    databaseId: normalizeId(db.id),
    dataSourceId,
    url: db.url || null,
    properties: { ...found.ids, title: 'title' },
    names: found.names,
  };
}

/**
 * Copy the records of the older Memory database into the Lore layout, then
 * rename the old database. overwrite: the old database is still the one the
 * project uses, so a copy in the Memories database that differs from it is
 * replaced; otherwise the Memories copy is kept and the difference reported.
 * Returns { notes, problems, migratedFrom, complete } where complete is false
 * when a record could not be copied (the project then keeps the old database).
 */
async function moveOldMemory(client, { old, block, config, root, mainRoot, now, today, overwrite }) {
  const { NotionMemoryDriver, copyRecords } = await import('../memory/notion.mjs');
  const withMemory = (memory) => ({ ...config, notion: { ...(config.notion || {}), memory } });
  // The copy holds this computer's memory lock (when there is a project folder), so a
  // toolkit memory command run at the same time waits instead of writing to the old database.
  const lock = Boolean(mainRoot || root);
  const from = new NotionMemoryDriver({ root, mainRoot, config: withMemory(old), client, now, lock: false });
  const to = new NotionMemoryDriver({ root, mainRoot, config: withMemory(block), client, now, lock });
  const res = await copyRecords(from, to, { overwrite });
  const notes = [];
  const problems = [];
  const moved = res.copied.length;
  const words = (n) => `${n} record${n === 1 ? '' : 's'}`;
  if (moved || res.same.length) {
    notes.push(`Moved ${words(moved)} from the old Memory database into the Memories database on the Memory page (Lore layout)${res.same.length ? `; ${words(res.same.length)} ${res.same.length === 1 ? 'was' : 'were'} already there with the same text` : ''}. Each one reads back with the same text and version.`);
  }
  for (const f of res.failed) problems.push(`The memory record ${f.key} was not moved into the Lore layout: ${f.reason}`);
  for (const k of res.kept) problems.push(`The memory record ${k.key} is in both the old Memory database and the Memories database with different text. The Memories database copy was kept; compare them in Notion.`);
  if (res.skipped.length) {
    problems.push(`The old Memory database holds ${res.skipped.length} row${res.skipped.length === 1 ? '' : 's'} with no memory key (<type>_<slug>), so ${res.skipped.length === 1 ? 'it was' : 'they were'} not moved: ${res.skipped.map((r) => `"${r.title || '(no title)'}"`).join(', ')}. Give ${res.skipped.length === 1 ? 'it' : 'them'} a key or delete ${res.skipped.length === 1 ? 'it' : 'them'} in Notion, then run toolkit notion ensure-project again.`);
  }
  const complete = res.failed.length === 0;
  if (!complete) {
    problems.push(`This project keeps using the old Memory database until every record is moved. Fix what is named above, then run toolkit notion ensure-project again.`);
  }
  if (res.failed.length || res.kept.length || res.skipped.length) {
    problems.push(`The old Memory database (${old.url || old.databaseId}) keeps its name until every row is moved. Nothing was deleted.`);
    return { notes, problems, migratedFrom: null, complete };
  }
  if (old.title !== OLD_MEMORY_DATABASE_TITLE) {
    await client.patch(`v1/databases/${old.databaseId}`, { title: richText(OLD_MEMORY_DATABASE_TITLE) });
    notes.push(`The old Memory database was left in place and renamed "${OLD_MEMORY_DATABASE_TITLE}": ${old.url || old.databaseId}. Nothing was deleted.`);
  }
  return { notes, problems, migratedFrom: { databaseId: old.databaseId, url: old.url, movedOn: today, records: moved + res.same.length }, complete };
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
  report.notes.push(...(rootResult.warnings || []));
  if (rootResult.created) report.created.push('Projects database');
  const projects = rootResult.projects;
  if (!projects) return { notion: stored, report };

  const project = config.project || {};
  const trackerNotion = Boolean(config.tracker && config.tracker.type === 'notion');
  const memoryNotion = Boolean(config.memory && config.memory.type === 'notion');
  const repository = gitRemote(mainRoot || root);

  // The project row.
  const storedRowId = normalizeId((stored.project && stored.project.pageId) || '');
  const found = await findProjectRow(client, projects, project.key, storedRowId, project.name);
  report.problems.push(...found.problems);
  report.notes.push(...found.notes);
  if (found.blocked) return { notion: stored, report };
  let row = found.row;
  // A new project row is Active, so it shows on the "Active Projects" board
  // (the Notion rebuild check: its Status was empty, under "No Status").
  const activeStatus = projects.status && projects.status.options.includes('Active') ? { [projects.status.name]: { status: { name: 'Active' } } } : null;
  if (!row) {
    if (check) {
      report.problems.push(`There is no row for ${project.key || 'this project'} in the Projects database.`);
      return { notion: stored, report };
    }
    row = await client.createPage({
      parent: { type: 'data_source_id', data_source_id: projects.dataSourceId },
      properties: { ...registryValues({ config, mainRoot: mainRoot || root, repository, names: projects.names, today, withTitle: true }), ...(activeStatus || {}) },
      markdown: projectPageMarkdown(config, mainRoot || root),
    });
    client.trust(row.id);
    report.created.push(`Project row "${project.name || project.key}"`);
  } else if (activeStatus && !check) {
    // A row with no Status yet (made before this fix, or with the New button) gets Active; a Status Mike set is kept.
    const cur = row.properties && row.properties[projects.status.name];
    if (cur && cur.type === 'status' && !cur.status) {
      await client.updatePage(row.id, { properties: activeStatus });
      report.notes.push('The project row had no Status; it is now Active.');
    }
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

  // Memory: Lore's layout under the project row. The current focus and the
  // glossary stay child pages of the project row.
  if (memoryNotion) {
    const s = sub('memory');
    const loreResult = await ensureLoreMemory(client, { projectPageId, config, stored: s, check });
    report.created.push(...loreResult.created);
    report.added.push(...loreResult.added);
    report.problems.push(...loreResult.problems);
    const focus = await ensureChildPage(client, { parentPageId: projectPageId, storedId: s.pages && s.pages.focus, title: FOCUS_PAGE_TITLE, seed: templateText('memory/CURRENT_FOCUS'), check });
    const glossary = await ensureChildPage(client, { parentPageId: projectPageId, storedId: s.pages && s.pages.glossary, title: GLOSSARY_PAGE_TITLE, seed: templateText('memory/glossary'), check });
    report.problems.push(...focus.problems, ...glossary.problems);
    if (focus.created) report.created.push('Current focus page');
    if (glossary.created) report.created.push('Terminology glossary page');
    if (focus.missing) report.problems.push('The Current focus page is missing.');
    if (glossary.missing) report.problems.push('The Terminology glossary page is missing.');
    const pages = { focus: focus.id, glossary: glossary.id };

    // An older project: the single Memory database on the row is moved into the Lore layout.
    const old = await findOldMemoryDatabase(client, { projectPageId, stored: s });
    const usingOld = Boolean(old) && s.layout !== 'lore';
    let migratedFrom = s.layout === 'lore' && s.migratedFrom ? s.migratedFrom : null;
    let keepOld = false;
    if (old && check) {
      report.problems.push(`This project's memory is still in the older Memory database (${old.url || old.databaseId}). Run toolkit notion ensure-project without --check to move its records into the Lore layout.`);
    } else if (old && loreResult.block) {
      const moved = await moveOldMemory(client, {
        old, block: { ...loreResult.block, pages }, config, root, mainRoot, now, today, overwrite: usingOld,
      });
      report.notes.push(...moved.notes);
      report.problems.push(...moved.problems);
      if (moved.migratedFrom) migratedFrom = moved.migratedFrom;
      keepOld = usingOld && !moved.complete;
    }

    if (keepOld || (check && usingOld)) {
      // The project keeps reading and writing the older database until every record is moved.
      const { title, ...oldBlock } = old;
      const storedOld = s.layout !== 'lore' && normalizeId(s.databaseId || '') === old.databaseId ? s : {};
      notion.memory = { ...storedOld, ...oldBlock, ...(storedOld.views ? { views: storedOld.views } : {}), pages };
    } else if (loreResult.block) {
      notion.memory = { ...loreResult.block, pages, ...(migratedFrom ? { migratedFrom } : {}) };
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
    const m = notion.memory;
    const ds = await client.getDataSource(m.dataSourceId);
    const ids = new Set(Object.values(ds.properties || {}).map((p) => p.id));
    for (const [key, id] of Object.entries(m.properties || {})) {
      if (!ids.has(id)) problems.push(`Memory: the ${key} property (${id}) is missing after setup.`);
    }
    if (m.layout === 'lore') {
      // Lore reads only databases placed directly on the vault page, found by these exact titles.
      const kids = await childrenOf(client, m.pageId);
      for (const which of VAULT_DATABASES) {
        const title = VAULT_TITLES[which];
        const want = normalizeId(((m.databases || {})[which] || {}).databaseId || '');
        const hit = kids.filter((k) => k.kind === 'database' && k.title === title);
        if (!hit.length) problems.push(`Memory: Lore needs a database titled "${title}" directly on the Memory page, and there is none.`);
        else if (want && !hit.some((k) => normalizeId(k.id) === want)) problems.push(`Memory: the "${title}" database on the Memory page is not the one in .toolkit.json.`);
      }
    }
    for (const [name, id] of Object.entries(m.pages || {})) {
      if (!id) problems.push(`Memory: the ${name} page is missing.`);
    }
  }
  return problems;
}

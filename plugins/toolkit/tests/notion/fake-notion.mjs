// An in-memory Notion for the unit tests. It answers the `ntn api` calls the
// toolkit makes, with the response shapes recorded from the real API
// (fixtures/responses/), and behaves like Notion where the toolkit depends on
// it (found by the live tests in dev/research/notion-live-tests.md):
// - page Markdown comes back without blank lines;
// - a leading "# heading" in the Markdown of a new page is dropped;
// - child pages appear as <page url="...">Title</page> lines at the end;
// - update_content fails when old_str is missing or appears twice, and any
//   edit that would remove a child page fails unless new_str keeps its tag;
// - property ids are URL-encoded in data sources and plain in views;
// - unique_id numbers are assigned per data source;
// - a dual relation keeps its other side in step.
// It can also fail on purpose: fake.failNext(n, stderr) makes the next n calls fail.
//
// fakeRunner(fake) gives a runner for NotionClient; fake.handle(args, input)
// is the same thing without a Promise. toJSON / FakeNotion.fromJSON let the
// fake-ntn program keep the state in a file between processes.

import crypto from 'node:crypto';

const PROP_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:;<>[]{}|~@';

function uuid() {
  return crypto.randomUUID();
}

function hex(id) {
  return id.replace(/-/g, '');
}

function norm(id) {
  const h = String(id || '').replace(/-/g, '').toLowerCase().match(/[0-9a-f]{32}$/);
  if (!h) return String(id || '');
  const s = h[0];
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`;
}

function rich(text) {
  const s = String(text ?? '');
  return s ? [{ type: 'text', text: { content: s, link: null }, plain_text: s, href: null, annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' } }] : [];
}

function plain(r) {
  return Array.isArray(r) ? r.map((x) => (x.text && x.text.content) || x.plain_text || '').join('') : '';
}

function fail(status, code, message) {
  const names = { 400: 'Bad Request', 404: 'Not Found', 409: 'Conflict', 429: 'Too Many Requests', 500: 'Internal Server Error' };
  const err = new Error(message);
  err.stderr = `error: Public API request failed (${status} ${names[status] || 'Error'} ${code}): ${message}`;
  throw err;
}

export class FakeNotion {
  constructor({ workspacePageTitle = 'Test area' } = {}) {
    this.pages = {};
    this.databases = {};
    this.dataSources = {};
    this.views = {};
    this.children = {}; // parent page id -> [{ kind, id }]
    this.counters = {};
    this.clock = Date.parse('2026-09-26T12:00:00.000Z');
    this.calls = [];
    this.failures = [];
    this.options = { autolinkMd: false };
    const root = this.addPage({ parent: { type: 'workspace', workspace: true }, title: workspacePageTitle });
    this.rootPageId = root.id;
  }

  // ------------------------------------------------------------ state helpers

  now() {
    this.clock += 60000; // one minute per write, like Notion's minute-precision times
    return new Date(this.clock).toISOString();
  }

  propId() {
    let s = '';
    for (let i = 0; i < 4; i++) s += PROP_CHARS[crypto.randomInt(PROP_CHARS.length)];
    return encodeURIComponent(s);
  }

  addPage({ parent, title = '', properties = null, markdown = '' }) {
    const id = uuid();
    const t = this.now();
    const page = {
      object: 'page',
      id,
      created_time: t,
      last_edited_time: t,
      parent,
      in_trash: false,
      is_archived: false,
      url: `https://app.notion.com/p/${hex(id)}`,
      properties: properties || { title: { id: 'title', type: 'title', title: rich(title) } },
      markdown,
    };
    this.pages[id] = page;
    if (parent && parent.type === 'page_id') this.addChild(parent.page_id, 'page', id);
    return page;
  }

  addChild(parentId, kind, id) {
    const p = norm(parentId);
    (this.children[p] = this.children[p] || []).push({ kind, id });
  }

  titleOf(page) {
    const t = Object.values(page.properties).find((v) => v.type === 'title');
    return t ? plain(t.title) : '';
  }

  schemaProp(ds, key) {
    if (ds.properties[key]) return [key, ds.properties[key]];
    const dec = (x) => {
      try {
        return decodeURIComponent(x);
      } catch {
        return x;
      }
    };
    return Object.entries(ds.properties).find(([, p]) => p.id === key || dec(p.id) === dec(key)) || null;
  }

  // ------------------------------------------------------------ markdown

  /** Store Markdown the way Notion returns it. */
  render(markdown, { dropLeadingH1 = false } = {}) {
    let lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n').filter((l) => l.trim() !== '');
    if (dropLeadingH1 && lines.length && /^# /.test(lines[0])) lines = lines.slice(1);
    let text = lines.join('\n');
    if (this.options.autolinkMd) {
      text = text.replace(/(^|[\s(])([A-Za-z0-9_-]+\.md)\b(?![^[]*\])/g, (m, lead, word) => `${lead}[${word}](http://${word})`);
    }
    return text;
  }

  markdownOf(page) {
    const kids = (this.children[page.id] || [])
      .map((c) => (c.kind === 'page' ? this.pages[c.id] : this.databases[c.id]))
      .filter((x) => x && !x.in_trash)
      .map((x) => (x.object === 'page'
        ? `<page url="${x.url}">${this.titleOf(x)}</page>`
        : `<database url="${x.url}" inline="true">${plain(x.title)}</database>`));
    return [page.markdown, ...kids].filter((s) => s !== '').join('\n');
  }

  childTags(page) {
    return (this.children[page.id] || [])
      .map((c) => (c.kind === 'page' ? this.pages[c.id] : this.databases[c.id]))
      .filter((x) => x && !x.in_trash)
      .map((x) => ({ x, tag: x.url }));
  }

  patchMarkdown(page, body) {
    const full = this.markdownOf(page);
    const kids = this.childTags(page);
    let next;
    if (body.type === 'update_content') {
      next = full;
      for (const op of body.update_content.content_updates) {
        if (!op.old_str) fail(400, 'validation_error', 'old_str must not be empty.');
        const count = next.split(op.old_str).length - 1;
        if (count === 0) fail(400, 'validation_error', `No matches found for ${op.old_str.slice(0, 60)}`);
        if (count > 1 && !op.replace_all_matches) fail(400, 'validation_error', `Multiple matches found for ${op.old_str.slice(0, 60)}`);
        next = op.replace_all_matches ? next.split(op.old_str).join(op.new_str) : next.replace(op.old_str, () => op.new_str);
      }
    } else if (body.type === 'replace_content') {
      next = body.replace_content.new_str;
    } else {
      fail(400, 'validation_error', `Unsupported command ${body.type}`);
    }
    const lost = kids.filter((k) => !next.includes(k.tag));
    if (lost.length && !(body[body.type] && body[body.type].allow_deleting_content)) {
      fail(400, 'validation_error', `This operation would delete ${lost.length} child page(s), database(s), or meeting note(s)`);
    }
    // Keep only non-child lines as the page's own text; child tags stay in the children list.
    const own = next.split('\n').filter((l) => !/^\t*<(page|database)\b[^>]*>.*<\/(page|database)>\s*$/.test(l.trim())).join('\n');
    page.markdown = this.render(own);
    page.last_edited_time = this.now();
    return { object: 'page_markdown', id: page.id, markdown: this.markdownOf(page), truncated: false, unknown_block_ids: [] };
  }

  // ------------------------------------------------------------ properties

  propertyFromSpec(name, spec, dsId) {
    const type = Object.keys(spec).find((k) => k !== 'description' && k !== 'name');
    const p = { id: type === 'title' ? 'title' : this.propId(), name, type, description: spec.description || null };
    const cfg = spec[type] || {};
    if (type === 'select' || type === 'multi_select') p[type] = { options: (cfg.options || []).map((o) => ({ id: uuid(), name: o.name, color: o.color || 'default', description: o.description || null })) };
    else if (type === 'status') {
      const options = (cfg.options || [{ name: 'Not started', group: 'To-do' }, { name: 'In progress', group: 'In progress' }, { name: 'Done', group: 'Complete' }])
        .map((o) => ({ id: uuid(), name: o.name, color: o.color || 'default', group: o.group || 'To-do' }));
      const groups = ['To-do', 'In progress', 'Complete'].map((g) => ({ id: uuid(), name: g, color: 'gray', option_ids: options.filter((o) => o.group === g).map((o) => o.id) }));
      p.status = { options: options.map(({ group, ...o }) => o), groups };
    } else if (type === 'unique_id') p.unique_id = { prefix: cfg.prefix ?? null };
    else if (type === 'relation') {
      p.relation = { data_source_id: cfg.data_source_id, database_id: this.dataSources[cfg.data_source_id] ? this.dataSources[cfg.data_source_id].parent.database_id : null, type: cfg.type };
      if (cfg.type === 'dual_property') p.relation.dual_property = { synced_property_id: null, synced_property_name: (cfg.dual_property && cfg.dual_property.synced_property_name) || `Related to ${name}` };
      else p.relation.single_property = {};
    } else p[type] = cfg;
    return p;
  }

  addProperty(ds, name, spec) {
    const p = this.propertyFromSpec(name, spec, ds.id);
    ds.properties[name] = p;
    if (p.type === 'relation' && p.relation.type === 'dual_property' && p.relation.data_source_id === ds.id) {
      const pairName = p.relation.dual_property.synced_property_name;
      const pair = { id: this.propId(), name: pairName, type: 'relation', description: null, relation: { data_source_id: ds.id, database_id: ds.parent.database_id, type: 'dual_property', dual_property: { synced_property_id: p.id, synced_property_name: name } } };
      p.relation.dual_property.synced_property_id = pair.id;
      ds.properties[pairName] = pair;
    }
  }

  emptyValue(p) {
    const v = { id: p.id, type: p.type };
    switch (p.type) {
      case 'title': v.title = []; break;
      case 'rich_text': v.rich_text = []; break;
      case 'select': v.select = null; break;
      case 'status': v.status = null; break;
      case 'number': v.number = null; break;
      case 'checkbox': v.checkbox = false; break;
      case 'date': v.date = null; break;
      case 'url': v.url = null; break;
      case 'relation': v.relation = []; v.has_more = false; break;
      case 'people': v.people = []; break;
      case 'multi_select': v.multi_select = []; break;
      case 'unique_id': v.unique_id = { number: null, prefix: p.unique_id.prefix }; break;
      case 'created_time': v.created_time = null; break;
      case 'last_edited_time': v.last_edited_time = null; break;
      default: v[p.type] = null;
    }
    return v;
  }

  setValue(ds, page, key, value) {
    const found = this.schemaProp(ds, key);
    if (!found) fail(400, 'validation_error', `Invalid property identifier ${key}`);
    const [name, p] = found;
    const cur = page.properties[name] || this.emptyValue(p);
    if (p.type === 'relation') {
      const before = (cur.relation || []).map((r) => norm(r.id));
      cur.relation = (value.relation || []).map((r) => ({ id: norm(r.id) }));
      const after = cur.relation.map((r) => r.id);
      if (p.relation.type === 'dual_property') {
        const pairName = Object.entries(ds.properties).find(([, q]) => q.id === p.relation.dual_property.synced_property_id)?.[0];
        if (pairName) {
          for (const gone of before.filter((x) => !after.includes(x))) {
            const other = this.pages[gone];
            if (other && other.properties[pairName]) other.properties[pairName].relation = other.properties[pairName].relation.filter((r) => r.id !== page.id);
          }
          for (const added of after.filter((x) => !before.includes(x))) {
            const other = this.pages[added];
            if (!other) continue;
            other.properties[pairName] = other.properties[pairName] || this.emptyValue(ds.properties[pairName]);
            if (!other.properties[pairName].relation.some((r) => r.id === page.id)) other.properties[pairName].relation.push({ id: page.id });
          }
        }
      }
    } else if (p.type === 'title') cur.title = rich(plain(value.title));
    else if (p.type === 'rich_text') cur.rich_text = rich(plain(value.rich_text));
    else if (p.type === 'select') {
      if (value.select && value.select.name && !p.select.options.some((o) => o.name === value.select.name)) p.select.options.push({ id: uuid(), name: value.select.name, color: 'default' });
      cur.select = value.select ? { id: (p.select.options.find((o) => o.name === value.select.name) || {}).id, name: value.select.name, color: 'default' } : null;
    } else if (p.type === 'status') {
      if (value.status && !p.status.options.some((o) => o.name === value.status.name)) fail(400, 'validation_error', `Invalid status option ${value.status.name}`);
      cur.status = value.status ? { name: value.status.name, color: 'default' } : null;
    } else if (p.type === 'number') cur.number = value.number;
    else if (p.type === 'checkbox') cur.checkbox = Boolean(value.checkbox);
    else if (p.type === 'date') cur.date = value.date ? { start: value.date.start, end: null, time_zone: null } : null;
    else if (p.type === 'url') cur.url = value.url;
    else if (['unique_id', 'created_time', 'last_edited_time'].includes(p.type)) fail(400, 'validation_error', `${name} is read-only`);
    else cur[p.type] = value[p.type];
    page.properties[name] = cur;
  }

  rowPage(ds, properties, markdown) {
    const page = this.addPage({ parent: { type: 'data_source_id', data_source_id: ds.id, database_id: ds.parent.database_id }, properties: {}, markdown: this.render(markdown || '', { dropLeadingH1: true }) });
    for (const [name, p] of Object.entries(ds.properties)) page.properties[name] = this.emptyValue(p);
    const uid = Object.entries(ds.properties).find(([, p]) => p.type === 'unique_id');
    if (uid) {
      this.counters[ds.id] = (this.counters[ds.id] || 0) + 1;
      page.properties[uid[0]].unique_id = { number: this.counters[ds.id], prefix: uid[1].unique_id.prefix };
    }
    for (const [key, value] of Object.entries(properties || {})) this.setValue(ds, page, key, value);
    this.touchTimes(ds, page);
    return page;
  }

  touchTimes(ds, page) {
    for (const [name, p] of Object.entries(ds.properties)) {
      if (p.type === 'last_edited_time') page.properties[name] = { id: p.id, type: p.type, last_edited_time: page.last_edited_time };
      if (p.type === 'created_time') page.properties[name] = { id: p.id, type: p.type, created_time: page.created_time };
    }
  }

  dsOfPage(page) {
    return page.parent && page.parent.type === 'data_source_id' ? this.dataSources[page.parent.data_source_id] : null;
  }

  // ------------------------------------------------------------ query

  matches(ds, page, filter) {
    if (!filter) return true;
    if (filter.and) return filter.and.every((f) => this.matches(ds, page, f));
    if (filter.or) return filter.or.some((f) => this.matches(ds, page, f));
    const found = this.schemaProp(ds, filter.property);
    if (!found) fail(400, 'validation_error', `Could not find property with name or id: ${filter.property}`);
    const [name] = found;
    const v = page.properties[name];
    if (filter.title) return plain(v.title) === filter.title.equals;
    if (filter.rich_text) return plain(v.rich_text) === filter.rich_text.equals;
    if (filter.unique_id) return v.unique_id && v.unique_id.number === filter.unique_id.equals;
    if (filter.select) return filter.select.equals !== undefined ? (v.select && v.select.name) === filter.select.equals : (v.select && v.select.name) !== filter.select.does_not_equal;
    if (filter.checkbox) return Boolean(v.checkbox) === filter.checkbox.equals;
    return true;
  }

  // ------------------------------------------------------------ the API

  handle(args, input) {
    const [cmd, rawPath, ...rest] = args;
    if (cmd !== 'api') return { code: 2, stdout: '', stderr: 'error: only ntn api is faked' };
    let method = 'GET';
    const query = {};
    for (let i = 0; i < rest.length; i++) {
      if (rest[i] === '-X') method = rest[++i];
      else if (rest[i] === '--notion-version' || rest[i] === '-d') i++;
      else if (rest[i].includes('==')) {
        const [k, v] = rest[i].split('==');
        query[k] = v;
      }
    }
    const body = input ? JSON.parse(input) : undefined;
    this.calls.push({ method, path: rawPath, body, query });
    if (this.failures.length) {
      const f = this.failures.shift();
      return { code: f.code ?? 5, stdout: '', stderr: f.stderr };
    }
    try {
      const res = this.route(method, rawPath, body, query);
      return { code: 0, stdout: JSON.stringify(res), stderr: '' };
    } catch (err) {
      if (err.stderr) return { code: 5, stdout: '', stderr: err.stderr };
      throw err;
    }
  }

  failNext(n, stderr, code = 5) {
    for (let i = 0; i < n; i++) this.failures.push({ stderr, code });
  }

  writes() {
    return this.calls.filter((c) => c.method !== 'GET' && !/\/query$/.test(c.path));
  }

  getPageOr404(id) {
    const page = this.pages[norm(id)];
    if (!page) fail(404, 'object_not_found', `Could not find page with ID: ${id}.`);
    return page;
  }

  pageOut(page) {
    const { markdown, ...rest } = page;
    const ds = this.dsOfPage(page);
    if (ds) this.touchTimes(ds, page);
    return JSON.parse(JSON.stringify(rest));
  }

  route(method, p, body, query) {
    const seg = p.split('/').filter(Boolean);
    const [, res, id, sub] = seg;
    if (res === 'users') return { object: 'user', id: uuid(), type: 'bot', name: 'Notion CLI' };
    if (res === 'pages') {
      if (!id && method === 'POST') {
        const parent = body.parent || {};
        let page;
        if (parent.type === 'data_source_id' || parent.data_source_id) {
          const ds = this.dataSources[norm(parent.data_source_id)];
          if (!ds) fail(404, 'object_not_found', `Could not find data source with ID: ${parent.data_source_id}.`);
          page = this.rowPage(ds, body.properties, body.markdown);
        } else {
          const title = body.properties && body.properties.title ? plain(body.properties.title.title) : '';
          if (parent.page_id) this.getPageOr404(parent.page_id);
          page = this.addPage({ parent: parent.workspace ? { type: 'workspace', workspace: true } : { type: 'page_id', page_id: norm(parent.page_id) }, title, markdown: this.render(body.markdown || '', { dropLeadingH1: true }) });
        }
        return this.pageOut(page);
      }
      const page = this.getPageOr404(id);
      if (sub === 'markdown') {
        if (method === 'GET') return { object: 'page_markdown', id: page.id, markdown: this.markdownOf(page), truncated: false, unknown_block_ids: [] };
        return this.patchMarkdown(page, body);
      }
      if (method === 'GET') return this.pageOut(page);
      if (method === 'PATCH') {
        if (body.is_archived !== undefined) fail(400, 'validation_error', 'The request failed validation. Error: Archive actor must match the current actor');
        if (body.in_trash !== undefined) page.in_trash = Boolean(body.in_trash);
        const ds = this.dsOfPage(page);
        for (const [key, value] of Object.entries(body.properties || {})) {
          if (ds) this.setValue(ds, page, key, value);
          else if (key === 'title') page.properties.title = { id: 'title', type: 'title', title: rich(plain(value.title)) };
        }
        page.last_edited_time = this.now();
        return this.pageOut(page);
      }
    }
    if (res === 'blocks') {
      if (sub === 'children') {
        const page = this.getPageOr404(id);
        const results = (this.children[page.id] || [])
          .map((c) => (c.kind === 'page' ? this.pages[c.id] : this.databases[c.id]))
          .filter((x) => x && !x.in_trash)
          .map((x) => (x.object === 'page'
            ? { object: 'block', id: x.id, type: 'child_page', child_page: { title: this.titleOf(x) }, parent: { type: 'page_id', page_id: page.id } }
            : { object: 'block', id: x.id, type: 'child_database', child_database: { title: plain(x.title) }, parent: { type: 'page_id', page_id: page.id } }));
        return { object: 'list', results, has_more: false, next_cursor: null };
      }
      const page = this.pages[norm(id)];
      if (page) return { object: 'block', id: page.id, type: 'child_page', parent: page.parent };
      const db = this.databases[norm(id)];
      if (db) return { object: 'block', id: db.id, type: 'child_database', parent: db.parent };
      fail(404, 'object_not_found', `Could not find block with ID: ${id}.`);
    }
    if (res === 'databases') {
      if (!id && method === 'POST') {
        const dbId = uuid();
        const dsId = uuid();
        const t = this.now();
        const db = { object: 'database', id: dbId, title: body.title || [], parent: { type: 'page_id', page_id: norm(body.parent.page_id) }, is_inline: Boolean(body.is_inline), in_trash: false, created_time: t, last_edited_time: t, url: `https://app.notion.com/p/${hex(dbId)}`, data_sources: [{ id: dsId, name: plain(body.title) }] };
        this.getPageOr404(body.parent.page_id);
        for (const spec of Object.values((body.initial_data_source && body.initial_data_source.properties) || {})) {
          const prefix = spec && spec.unique_id && spec.unique_id.prefix;
          const taken = prefix && Object.values(this.dataSources).some((d) => Object.values(d.properties).some((q) => q.type === 'unique_id' && q.unique_id.prefix === prefix));
          if (taken) fail(409, 'conflict_error', 'Unique ID prefix is already in use.');
        }
        this.databases[dbId] = db;
        const ds = { object: 'data_source', id: dsId, parent: { type: 'database_id', database_id: dbId }, database_parent: db.parent, title: body.title || [], properties: {}, created_time: t, last_edited_time: t };
        this.dataSources[dsId] = ds;
        for (const [name, spec] of Object.entries((body.initial_data_source && body.initial_data_source.properties) || {})) this.addProperty(ds, name, spec);
        if (!Object.values(ds.properties).some((q) => q.type === 'title')) this.addProperty(ds, 'Name', { title: {} });
        this.addChild(db.parent.page_id, 'database', dbId);
        const vId = uuid();
        this.views[vId] = { object: 'view', id: vId, parent: { type: 'database_id', database_id: dbId }, name: 'Default view', type: 'table', data_source_id: dsId, filter: null, sorts: null, configuration: { type: 'table' }, url: `${db.url}?v=${hex(vId)}` };
        return JSON.parse(JSON.stringify(db));
      }
      const db = this.databases[norm(id)];
      if (!db) fail(404, 'object_not_found', `Could not find database with ID: ${id}.`);
      if (method === 'PATCH') {
        if (body.in_trash !== undefined) db.in_trash = Boolean(body.in_trash);
      }
      return JSON.parse(JSON.stringify(db));
    }
    if (res === 'data_sources') {
      const ds = this.dataSources[norm(id)];
      if (!ds) fail(404, 'object_not_found', `Could not find data source with ID: ${id}.`);
      if (sub === 'query') {
        const size = (body && body.page_size) || 100;
        const all = Object.values(this.pages).filter((pg) => pg.parent && pg.parent.data_source_id === ds.id && !pg.in_trash && this.matches(ds, pg, body && body.filter));
        const start = body && body.start_cursor ? Number(body.start_cursor) : 0;
        const slice = all.slice(start, start + size);
        const more = start + size < all.length;
        return { object: 'list', results: slice.map((pg) => this.pageOut(pg)), has_more: more, next_cursor: more ? String(start + size) : null };
      }
      if (method === 'PATCH') {
        for (const [name, spec] of Object.entries((body && body.properties) || {})) {
          const found = this.schemaProp(ds, name);
          if (spec === null) {
            if (found) delete ds.properties[found[0]];
            continue;
          }
          if (found && spec.name && Object.keys(spec).length === 1) {
            const [old, prop] = found;
            delete ds.properties[old];
            prop.name = spec.name;
            ds.properties[spec.name] = prop;
            for (const pg of Object.values(this.pages)) {
              if (pg.properties[old]) {
                pg.properties[spec.name] = pg.properties[old];
                delete pg.properties[old];
              }
            }
            continue;
          }
          if (found && spec.select) {
            found[1].select.options = spec.select.options.map((o) => ({ id: o.id || uuid(), name: o.name, color: o.color || 'default' }));
            continue;
          }
          if (found) continue;
          this.addProperty(ds, name, spec);
        }
        ds.last_edited_time = this.now();
      }
      return JSON.parse(JSON.stringify(ds));
    }
    if (res === 'views') {
      if (!id && method === 'GET') {
        const results = Object.values(this.views).filter((v) => v.parent.database_id === norm(query.database_id)).map((v) => ({ object: 'view', id: v.id }));
        return { object: 'list', results, has_more: false, next_cursor: null, type: 'view', view: {} };
      }
      if (!id && method === 'POST') {
        const db = this.databases[norm(body.database_id)];
        if (!db) fail(404, 'object_not_found', `Could not find database with ID: ${body.database_id}.`);
        const vId = uuid();
        const view = { object: 'view', id: vId, parent: { type: 'database_id', database_id: db.id }, name: body.name, type: body.type, data_source_id: body.data_source_id, filter: body.filter || null, sorts: body.sorts || null, configuration: this.viewConfig(body.configuration), url: `${db.url}?v=${hex(vId)}` };
        this.views[vId] = view;
        return JSON.parse(JSON.stringify(view));
      }
      const view = this.views[norm(id)];
      if (!view) fail(404, 'object_not_found', `Could not find view with ID: ${id}.`);
      if (method === 'PATCH') {
        if (body.name) view.name = body.name;
        if (body.filter !== undefined) view.filter = body.filter;
        if (body.sorts !== undefined) view.sorts = body.sorts;
        if (body.configuration) view.configuration = { ...view.configuration, ...this.viewConfig(body.configuration) };
      }
      if (method === 'DELETE') {
        delete this.views[view.id];
        return { object: 'view', id: view.id };
      }
      return JSON.parse(JSON.stringify(view));
    }
    fail(400, 'invalid_request_url', `The fake does not know ${method} ${p}`);
    return null;
  }

  /** Views report property ids decoded, like Notion. */
  viewConfig(cfg) {
    if (!cfg) return null;
    const dec = (x) => {
      try {
        return decodeURIComponent(x);
      } catch {
        return x;
      }
    };
    const out = JSON.parse(JSON.stringify(cfg));
    if (out.group_by && out.group_by.property_id) out.group_by.property_id = dec(out.group_by.property_id);
    if (out.subtasks && out.subtasks.property_id) out.subtasks.property_id = dec(out.subtasks.property_id);
    if (Array.isArray(out.properties)) out.properties = out.properties.map((q) => ({ ...q, property_id: dec(q.property_id) }));
    return out;
  }

  // ------------------------------------------------------------ persistence (for the fake ntn program)

  toJSON() {
    const { calls, failures, ...rest } = this;
    return rest;
  }

  static fromJSON(data) {
    const f = Object.create(FakeNotion.prototype);
    Object.assign(f, data);
    f.calls = [];
    f.failures = data.pendingFailures || [];
    return f;
  }
}

/** A runner for NotionClient backed by a FakeNotion. */
export function fakeRunner(fake) {
  return (args, { input } = {}) => Promise.resolve(fake.handle(args, input));
}

/** A sleep that does not wait, and remembers what it was asked. */
export function fakeSleep() {
  const waits = [];
  const fn = (ms) => {
    waits.push(ms);
    return Promise.resolve();
  };
  fn.waits = waits;
  return fn;
}

/**
 * Build a Projects database under the fake's root page, like the real one on
 * the "AI Agent Second Brain" page (the base properties only).
 */
export function seedProjects(fake, baseProperties) {
  const properties = {};
  for (const p of baseProperties) properties[p.name] = p.spec;
  const db = fake.route('POST', 'v1/databases', {
    parent: { type: 'page_id', page_id: fake.rootPageId },
    title: [{ type: 'text', text: { content: 'Projects' } }],
    is_inline: true,
    initial_data_source: { properties },
  }, {});
  return { databaseId: db.id, dataSourceId: db.data_sources[0].id };
}

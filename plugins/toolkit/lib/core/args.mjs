// Command-line argument parser.
//
// parseArgs(argv, spec) -> { _: positionals, flags }
//
// Accepted forms: --flag value, --flag=value, --flag (boolean), --no-flag
// (a declared boolean set to false), -x (short name, see alias), and `--`,
// after which every token is a positional.
// A flag given more than once becomes an array of its values.
//
// The spec may be written in either of two shapes:
//
//   { boolean: ['all'], string: ['title'], array: ['tag'],
//     alias: { t: 'title' }, default: { all: false }, strict: false }
//
//   { title: 'string', all: 'boolean',
//     tag: { type: 'string', multiple: true, short: 't', default: [] } }
//
// A node:util style { options: { ... } } wrapper is also accepted.
// Flags not in the spec are allowed (unless strict): --x=value is a string;
// --x followed by a token that does not start with "-" takes that token as
// its value; otherwise --x is true. `json` and `help` are always boolean
// unless the spec says otherwise.
// Flag names keep their dashes (flags['dry-run']); a camelCase alias
// (flags.dryRun) can also be read but is not listed by Object.keys.

import { EXIT, ToolkitError } from './output.mjs';

const BUILTIN_BOOLEANS = ['json', 'help'];
const RESERVED = new Set(['__proto__', 'prototype', 'constructor']);

function toCamel(name) {
  return name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function normalizeSpec(spec) {
  const types = new Map(); // name -> 'boolean' | 'string'
  const multiple = new Set();
  const alias = new Map(); // short or other name -> canonical name
  const defaults = {};
  let strict = false;
  if (!spec || typeof spec !== 'object') spec = {};
  if (spec.options && typeof spec.options === 'object' && !Array.isArray(spec.options)) {
    strict = Boolean(spec.strict);
    spec = spec.options;
  }

  const listed = (value) => (Array.isArray(value) ? value : value ? [value] : []);
  const isMinimist = ['boolean', 'string', 'array', 'alias', 'default'].some((k) => k in spec)
    && ['boolean', 'string', 'array'].every((k) => !(k in spec) || Array.isArray(spec[k]) || typeof spec[k] === 'string');

  if (isMinimist) {
    for (const n of listed(spec.boolean)) types.set(n, 'boolean');
    for (const n of listed(spec.string)) types.set(n, 'string');
    for (const n of listed(spec.array)) {
      if (!types.has(n)) types.set(n, 'string');
      multiple.add(n);
    }
    if (spec.alias && typeof spec.alias === 'object') {
      for (const [from, to] of Object.entries(spec.alias)) {
        for (const target of listed(to)) alias.set(from, target);
      }
    }
    if (spec.default && typeof spec.default === 'object') Object.assign(defaults, spec.default);
    strict = strict || Boolean(spec.strict);
  } else {
    for (const [name, def] of Object.entries(spec)) {
      if (name === 'strict') {
        strict = Boolean(def);
        continue;
      }
      if (typeof def === 'string') {
        types.set(name, def === 'boolean' ? 'boolean' : 'string');
        if (def === 'array') multiple.add(name);
      } else if (def && typeof def === 'object') {
        const type = def.type === 'boolean' ? 'boolean' : 'string';
        types.set(name, type);
        if (def.multiple || def.type === 'array') multiple.add(name);
        if (def.short) alias.set(def.short, name);
        if (def.alias) for (const a of listed(def.alias)) alias.set(a, name);
        if ('default' in def) defaults[name] = def.default;
      } else if (def === Boolean) {
        types.set(name, 'boolean');
      } else if (def === String) {
        types.set(name, 'string');
      }
    }
  }
  for (const n of BUILTIN_BOOLEANS) if (!types.has(n)) types.set(n, 'boolean');
  return { types, multiple, alias, defaults, strict };
}

function booleanValue(raw, name) {
  const v = String(raw).toLowerCase();
  if (['true', '1', 'yes', 'on', ''].includes(v)) return true;
  if (['false', '0', 'no', 'off'].includes(v)) return false;
  throw new ToolkitError(EXIT.INVALID, `--${name} takes true or false, not "${raw}".`);
}

export function parseArgs(argv = [], spec = {}) {
  const { types, multiple, alias, defaults, strict } = normalizeSpec(spec);
  const positionals = [];
  const flags = {};
  const unknown = [];

  const canonical = (name) => alias.get(name) || name;
  const store = (name, value) => {
    if (RESERVED.has(name)) throw new ToolkitError(EXIT.INVALID, `--${name} is not an allowed flag name.`);
    if (multiple.has(name)) {
      if (!Array.isArray(flags[name])) flags[name] = [];
      flags[name].push(value);
    } else if (Object.prototype.hasOwnProperty.call(flags, name)) {
      flags[name] = Array.isArray(flags[name]) ? [...flags[name], value] : [flags[name], value];
    } else {
      flags[name] = value;
    }
  };

  const tokens = Array.from(argv, (t) => String(t));
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '--') {
      positionals.push(...tokens.slice(i + 1));
      break;
    }
    if (token.startsWith('--') && token.length > 2) {
      const eq = token.indexOf('=');
      let name = eq === -1 ? token.slice(2) : token.slice(2, eq);
      const inline = eq === -1 ? undefined : token.slice(eq + 1);
      if (inline === undefined && name.startsWith('no-') && types.get(canonical(name.slice(3))) === 'boolean' && !types.has(name)) {
        store(canonical(name.slice(3)), false);
        continue;
      }
      name = canonical(name);
      const type = types.get(name);
      if (!type) unknown.push(name);
      if (type === 'boolean') {
        store(name, inline === undefined ? true : booleanValue(inline, name));
      } else if (inline !== undefined) {
        store(name, inline);
      } else if (type === 'string') {
        if (i + 1 >= tokens.length) {
          throw new ToolkitError(EXIT.INVALID, `--${name} needs a value.`);
        }
        store(name, tokens[++i]);
      } else {
        const next = tokens[i + 1];
        if (next !== undefined && next !== '--' && !next.startsWith('-')) {
          store(name, next);
          i++;
        } else {
          store(name, true);
        }
      }
      continue;
    }
    if (token.startsWith('-') && token.length > 1 && !/^-\d/.test(token)) {
      // Short form: -x, -x value, -x=value, or grouped booleans -abc.
      const eq = token.indexOf('=');
      const body = eq === -1 ? token.slice(1) : token.slice(1, eq);
      const inline = eq === -1 ? undefined : token.slice(eq + 1);
      if (body.length > 1 && inline === undefined && [...body].every((c) => types.get(canonical(c)) === 'boolean')) {
        for (const c of body) store(canonical(c), true);
        continue;
      }
      const name = canonical(body);
      const type = types.get(name);
      if (!type) unknown.push(name);
      if (type === 'boolean') {
        store(name, inline === undefined ? true : booleanValue(inline, name));
      } else if (inline !== undefined) {
        store(name, inline);
      } else if (type === 'string') {
        if (i + 1 >= tokens.length) throw new ToolkitError(EXIT.INVALID, `-${body} needs a value.`);
        store(name, tokens[++i]);
      } else {
        const next = tokens[i + 1];
        if (next !== undefined && next !== '--' && !next.startsWith('-')) {
          store(name, next);
          i++;
        } else {
          store(name, true);
        }
      }
      continue;
    }
    positionals.push(token);
  }

  for (const [name, value] of Object.entries(defaults)) {
    if (!Object.prototype.hasOwnProperty.call(flags, name)) {
      flags[name] = multiple.has(name) && !Array.isArray(value) ? (value === undefined ? [] : [value]) : value;
    }
  }
  for (const name of multiple) {
    if (!Object.prototype.hasOwnProperty.call(flags, name)) flags[name] = [];
  }

  if (strict && unknown.length) {
    const names = [...new Set(unknown)].map((n) => (n.length === 1 ? `-${n}` : `--${n}`)).join(', ');
    throw new ToolkitError(EXIT.INVALID, `Unknown flag: ${names}.`, { unknown: [...new Set(unknown)] });
  }

  for (const name of Object.keys(flags)) {
    const camel = toCamel(name);
    if (camel !== name && !Object.prototype.hasOwnProperty.call(flags, camel)) {
      Object.defineProperty(flags, camel, {
        get: () => flags[name],
        enumerable: false,
        configurable: true,
      });
    }
  }

  return { _: positionals, flags };
}

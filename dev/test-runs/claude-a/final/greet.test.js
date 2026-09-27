// Acceptance checks for greet.js (WI-001 R-01 to R-04, WI-002 R-01 and R-02). Run: node --test
const { test } = require('node:test');
const assert = require('node:assert');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const script = path.join(__dirname, '..', 'greet.js');

function greet(...args) {
  return execFileSync(process.execPath, [script, ...args], { encoding: 'utf8' });
}

test('R-01: greets a named person', () => {
  assert.strictEqual(greet('Sam'), 'Hello, Sam!\n');
});

test('R-01: joins a multi-word name with single spaces', () => {
  assert.strictEqual(greet('Sam', 'Lee'), 'Hello, Sam Lee!\n');
});

test('R-02: greets the world when no name is given', () => {
  assert.strictEqual(greet(), 'Hello, world!\n');
});

test('R-03: --version prints the version and no greeting', () => {
  assert.strictEqual(greet('--version'), 'greet 1.0.0\n');
});

// WI-002: empty name and --version in any position.

test('WI-002 R-01: greets the world when the name is empty', () => {
  assert.strictEqual(greet(''), 'Hello, world!\n');
});

test('WI-002 R-01: greets the world when the name is only spaces', () => {
  assert.strictEqual(greet(' '), 'Hello, world!\n');
});

test('WI-002 R-02: --version after a name prints the version', () => {
  assert.strictEqual(greet('Sam', '--version'), 'greet 1.0.0\n');
});

test('WI-002 R-02: --version between name words prints the version', () => {
  assert.strictEqual(greet('Sam', '--version', 'Lee'), 'greet 1.0.0\n');
});

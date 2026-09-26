#!/usr/bin/env node
// A stand-in for the Notion CLI, for tests of `toolkit notion ...` as a whole
// command. Point TOOLKIT_NTN_BIN at this file and FAKE_NOTION_STATE at a JSON
// file written by FakeNotion.toJSON(). Each run reads the state, answers one
// `ntn api` call like Notion, and saves the state again.

import fs from 'node:fs';
import { FakeNotion } from './fake-notion.mjs';

const file = process.env.FAKE_NOTION_STATE;
const fake = FakeNotion.fromJSON(JSON.parse(fs.readFileSync(file, 'utf8')));
let input = '';
process.stdin.on('data', (d) => { input += d; });
process.stdin.on('end', () => {
  const res = fake.handle(process.argv.slice(2), input || undefined);
  const log = file.replace(/\.json$/, '.calls.ndjson');
  fs.appendFileSync(log, `${JSON.stringify(fake.calls[0] || {})}\n`);
  fs.writeFileSync(file, JSON.stringify(fake.toJSON()));
  if (res.stdout) process.stdout.write(res.stdout);
  if (res.stderr) process.stderr.write(res.stderr);
  process.exitCode = res.code;
});

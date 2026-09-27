#!/usr/bin/env node
// greet: prints a greeting, or its version with --version.

const VERSION = '1.0.0';

const args = process.argv.slice(2);
const name = args.join(' ');

if (args.includes('--version')) {
  console.log(`greet ${VERSION}`);
} else if (name.trim() === '') {
  // No name, an empty name, or a name made only of spaces.
  console.log('Hello, world!');
} else {
  console.log(`Hello, ${name}!`);
}

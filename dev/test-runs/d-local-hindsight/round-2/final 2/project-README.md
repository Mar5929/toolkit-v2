# greet

A tiny command that prints a greeting.

    node bin/greet.mjs Mike
    Hello, Mike!

Use `--shout` to print the whole greeting in capital letters. It works with
the default name or with a name before or after the flag:

    node bin/greet.mjs --shout
    HELLO, WORLD!

    node bin/greet.mjs Mike --shout
    HELLO, MIKE!

    node bin/greet.mjs --shout Mike
    HELLO, MIKE!

Run the tests with `npm test`.

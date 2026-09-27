# greet

A tiny command that prints a greeting.

    node bin/greet.mjs Mike
    Hello, Mike!

Use `--shout` to print the entire greeting in capital letters. The flag can go before or after the name.

    node bin/greet.mjs --shout Mike
    HELLO, MIKE!

With no name, the command greets the world:

    node bin/greet.mjs --shout
    HELLO, WORLD!

Run the tests with `npm test`.

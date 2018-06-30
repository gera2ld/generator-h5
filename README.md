@gera2ld/generator-h5
===

![NPM](https://img.shields.io/npm/v/@gera2ld/generator-h5.svg)

Yeoman generator to create a workspace for static pages rapidly.

Requires Node.js v8.0+.

Features
---

- Latest ECMAScript features
- Multiple pages support via a config file
- Popular frameworks support: Vue, React
- Webpack v4 + Babel v7
- Scale document elements with `rem`
- Reveal.js support

Generators:
- `@gera2ld/h5`
- `@gera2ld/h5:reveal`

Installation
---
It is highly recommended to use with Yarn.

``` sh
$ yarn global add @gera2ld/generator-h5

# You can also clone the generator and link it to global node_modules
$ git clone https://github.com/gera2ld/generator-h5.git
$ cd path/to/generator-h5 && yarn link

# Make sure yo is installed
$ yarn global add yo
```

Usage
---

- Initialize an HTML5 project:

    ``` sh
    $ cd my-project
    $ yo @gera2ld/h5
    ```

- Initialize a presentation project (with Reveal.js):

    ```sh
    $ cd my-project
    $ yo @gera2ld/h5:reveal
    ```

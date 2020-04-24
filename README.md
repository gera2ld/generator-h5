# @gera2ld/generator-h5

![NPM](https://img.shields.io/npm/v/@gera2ld/generator-h5.svg)

Yeoman generator to create a workspace for static pages rapidly.

Requires Node.js v8.0+.

## Features

- Latest ECMAScript features
- Multiple pages via a config file
- Popular frameworks: Vue, React
- Webpack v4 + Babel v7
- Scale document elements with `rem`
- Reveal.js
- JSX for DOM
- TypeScript
- tailwindcss

Generators:
- `@gera2ld/h5`
- `@gera2ld/h5:reveal`
- `@gera2ld/h5:jsx-dom`

## Usage

```sh
# Use the latest version from git
$ npx -p git+ssh://git@github.com:gera2ld/generator-h5.git -p yo yo @gera2ld/h5
```

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

- Initialize a project with JSX support:

    ```sh
    $ cd my-project
    $ yo @gera2ld/h5:jsx-dom
    ```

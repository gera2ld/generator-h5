<%= name %>
---

This is an HTML 5 project built with yeoman and generator-h5.

Development
---
``` sh
$ npm run dev
```
<% if (multiplePages) { -%>

- Project structure

  Each page has a folder in `src/pages`. For example:
  `home` page is in `src/pages/home`. Its main HTML is `src/pages/home/index.html`, entry script is `src/pages/home/app.js`, style is `src/pages/home/style.css`.

- Create a page

  Add a new folder in `src/pages`. For example `src/pages/new-page/`. A `src/pages/new-page/index.html` is required. `src/pages/new-page/app.js` and `src/pages/new-page/style.css` are optional.

<% } -%>

Building
---
```sh
$ npm run build
```

Lint
---
``` sh
$ npm run lint
```

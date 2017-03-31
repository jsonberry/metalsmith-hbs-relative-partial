# Metalsmith HBS Relative Partial Plugin
Install: npm install metalsmith-hbs-realtive-partial

## Purpose

Place Handlebars.js template partials in a directory relative to a view they are used in. Best used with in conjunction with [metalsmith-in-place](https://github.com/superwolff/metalsmith-in-place).

## Example

Given this structure...
```
/src
|    /about
|    |    /components
|    |    |    heading.hbs
|    index.hbs
...
```

With this content in `heading.hbs`...
```
<h1>Hello World</h1>
```

And this Handlebars partial usage in `index.hbs`...
```
{{> about/heading }}
```

Metalsmith will produce `/about/index.html` with this content...
```
<h1>Hello World</h1>
```

## Initialize

In `metalsmith.json`:

```json
{
  "plugins": {
    "metalsmith-hbs-relative-partial": {
      "pattern": "partials"
    }
  }
}
```

```js
const relativePartial = require('metalsmith-hbs-relative-partial');
const inPlace = require('metalsmith-in-place');

require('metalsmith')(__dirname)
    .use(relativePartial({
        dirName: 'partials'
    }))
    .use(inPlace())
    .build()
```

### dirName
The name of the directory that your partials will sit in.
Example: 'components'... any partials nested under the source in a directory named 'components' will be registered with Handlebars.
The name of the partial will be it's relative path to the area of the application. An `aside.hbs` partial in `src/legal/components` would be referred to like this: `{{> legal/aside }}`.
Default: `partials`

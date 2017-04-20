# gulp-restructure-tree

A powerful, declarative way to restructure complex directory structures with [Gulp](https://github.com/gulpjs/gulp/).
Use globs, RegExps and functions arranged in a tree structure to rename files.

[![npm](https://img.shields.io/npm/v/gulp-restructure-tree.svg)](https://www.npmjs.com/package/gulp-restructure-tree)
[![Build Status](https://travis-ci.org/SewanDevs/ceiba-router.svg?branch=master)](https://travis-ci.org/SewanDevs/ceiba-router)
[![Coverage Status](https://coveralls.io/repos/github/SewanDevs/ceiba-router/badge.svg?branch=master)](https://coveralls.io/github/SewanDevs/ceiba-router?branch=master)

![Concept diagram](https://raw.githubusercontent.com/SewanDevs/ceiba-router/master/packages/gulp-restructure-tree/docs/gulp-restructure-tree-concept-transparent.png)

### Quick start

#### Installation

```bash
$ npm install gulp-restructure-tree --save-dev
```

#### Usage

`restructureTree(treeMap[, options])`

#### Example

Describe your file tree with plain javascript objects to move or filter files in your Gulp pipeline:

```javascript
const restructureTree = require('gulp-restructure-tree')

gulp.src('./**')
  .pipe(restructureTree({
    'src': {
      '**.md': null,             // Exclude all markdown files in src/
      'utils/': 'libs/'          // Move all file in src/utils/ to libs/
    },
    'log-*.txt': 'logs/$1.log', // Rename files matching ./src/log-*
  }))
  .pipe(gulp.dest('./dist'))

// src/utils/react-if/dist/index.js  ⇒ dist/libs/react-if/dist/index.js
// log-1491831591372.txt             ⇒ dist/logs/1491831591372.log
```

`gulp-restructure-tree` gives you many more ways to match files and directories, read on to learn more.

## Table of Contents

  * [Quick start](#quick-start)
      * [Installation](#installation)
      * [Usage](#usage)
      * [Example](#example)
  * [API](#api)
      * [treeMap](#treemap)
          * [Branches](#treemap-branches)
          * [Leaves](#treemap-leaves)
      * [options](#options)
  * [Comprehensive example](#comprehensive-example-gulp-v4)
  * [Developing](#developing)
      * [Tests](#tests)
  * [Known issues](#known-issues)

## API

### `restructureTree( treeMap[, options] )`
#### Arguments:
##### `treeMap`:
A tree structure described with plain javascript objects. _Keys_ are **`branches`** and non-object _values_ are **`leaves`**.
  * <a name="treemap-branches"></a>**`branches`**:
     A branch represents a path segment, the name of one directory or file.
     Simple bash-style `*`, `**` glob patterns can be used, or Regular Expression for more complicated matching requirements.
     * **`foo`**: Regular string branches match filenames literally.
     * <a name="branches-glob"></a>**`*`**: A wildcard can be included anywhere in the path to match any number of characters in a filename.  
      _e.g.: `fo*ar` will match `foobar` but will not match nested directories `foo/bar`._
     * <a name="branches-globstar"></a>**`**`**: A branch name can begin with a "globstar" pattern, in that case it will recursively match as many directories as necessary to complete the rest of the tree.<sup id="a1">[1](#f1)</sup>  
     _e.g.: `**az` will match `foo/bar/baz`._
     * **`foo/`**: If the last branch in a route ends with a `/`, it will match everything inside that directory.<sup id="a2">[2](#f2)</sup>  
    _This is equivalent to having a branch followed by a _globstar_ pattern branch. e.g.:  `{ 'foo/': 'bar' }` is the same as `{ 'foo': { '**': 'bar' }}`._
     * <a name="branches-regexp"></a>**`[/foo[a-z-]+/]`**: A branch name can be a Regular Expression. It will match any branch that matches it. No RegExp flags are supported.<sup id="a3">[3](#f3)</sup>  
     * **`[["foo","bar*","baz"]]`**: A branch name can also be an array, in which case it will match if any of the array elements matches.<sup id="a3b">[3](#f3)</sup>  
     
  * <a name="treemap-leaves"></a>**`leaves`**:
      Any value that is either a function, a string, or null, represents a destination. Files whose paths match the path leading up to the leaf will be moved to the specified destination.
      * **`{string} foo/`**: A string destination path that ends with a `/` is interpreted as a directory destination. Matched files will keep their filenames, and the folder hierarchy that starts at the point the file path and the `treeMap` path _"diverges"_ will be conserved<sup id="a4">[4](#f4)</sup>.  
      * **`{string} foo`**: A string destination path that doesn't end with a `/` is interpreted as a file destination. Matched files will be renamed to match the new destination filename, and all of their original folder hierarchy discarded.  
      To avoid conflicts when using a string destination file, either make sure to match only a single file, or match multiple files with [globs](#branches-glob) or [RegExps](#branches-regexp) branches and include _back references_ (`$1`, `$2`, ...) in the destination string.
      * **`(pathObject) => {string|pathObject}`**: Takes a parsed [`pathObject`](https://nodejs.org/api/path.html#path_path_format_pathobject), and returns either a path string that will be interpreted the same as a string leaf, or a [`pathObject`](https://nodejs.org/api/path.html#path_path_format_pathobject) that will be applied directly.<sup id="a5">[5](#f5)</sup>
      * **`null`**: The file will be removed from the stream.
    
##### `options`:
  * `dryRun` _`{boolean=false}`_: Don't move files, only log operations that would be executed (implies verbose mode).
  * `verbose` _`{boolean=false}`_: Log file move operations to stdout.
  * `logUnchanged` _`{boolean=false}`_: In verbose mode, also log operations that don't result in any path change.
  * `onlyFiles` _`{boolean=false}`_: Don't process directories.
  * <a name="options-bypasscache"></a>`bypassCache` _`{boolean=false}`_: Force recompile of `treeMap` argument. <sup id="a6">[6](#f6)</sup>


_(In case of doubts, see [`PathMatcher.test.js`](packages/path-matcher/src/__tests__/PathMatcher.test.js) for a more comprehensive spec.)_

## Comprehensive example ([Gulp V4](https://github.com/gulpjs/gulp/tree/4.0))

```javascript
// gulpfile.babel.js
import restructureTree from 'gulp-restructure-tree'

// Map starting directory structure with a tree having the destinations as its
//  leaves.
const treeMap = {
  app: {
    modules: { 
      '*': {
      // Use wildcard globs: * and ** (recursive).

        '**.css': 'styles/', 
        // A string value is interpreted as a destination path.
        // A destination with a trailing / is interpreted as a directory, without
        //  it is interpreted as a destination file and the file will be renamed.
        // app/modules/basket/alt/christmas.css ⇒ styles/basket/alt/christmas.css
        
        gui: {
          '**GUI.jsx': 'templates/$1-$3.js',
          // Insert back references, here whatever directory was matched by the *
          //  just after 'modules' will serve as the first part of the filename.
          // This "trailing" ** counts as two capture groups, one for
          //   the folders and one for the ending file ("**/*").
          // app/modules/basket/gui/itemsGUI.jsx ⇒ templates/basket-items.js 
        },
        
        [/(.*)(\.min)?\.jsx?/]: 'scripts/$2.js',
        // Use RegExp by converting them to strings, capture groups are used for the
        //  back references.
        // app/modules/basket/itemsRefHandling.min.js ⇒ scripts/itemsRefHandling.js
        
        'img/': 'assets/$1/$3.compressed',
        // A trailing branch with a trailing / is interpreted as a recursive
        //   match (equivalent to a trailing '**' branch).
        // app/modules/basket/img/cart.png ⇒ assets/basket/cart.png.compressed
      }
    },
    helpers: {
      'jquery-*': 'libs/global/',
      // Rules are evaluated from top to bottom so place more specific rules on top.
      // If you placed this rule after the following one, it would match on the
      //  first one and never reach this one.
      // app/helpers/jquery-3.1.1.min.js ⇒ libs/global/jquery-3.1.1.min.js

      [/.*\.jsx?/]:
              ({ name, extname }) =>
                      `libs/${extname === 'jsx' ? 'react/' : ''}${name}/${name}.js`
      // Function leaves take a parsed path as argument and return a destination
      //  path as a string or parsed path object.
      // app/helpers/modalify.js ⇒ libs/modalify/modalify.js
      // app/helpers/dropdown.jsx ⇒ libs/react/dropdown/dropdown.js
    }
  },
  documentation: {
      '/': './docs',
      // Match folder by selecting it with a '/' rule. This will move the empty
      //  directory.
      // documentation ⇒ docs
      
      [['COPYRIGHT', 'LICENSE', 'CHANGELOG-*']]: './',
      // Use arrays to match a set of filenames without bothering with RegExps.
      // documentation/LICENSE ⇒ LICENSE
      
      '**': null,
      // Discard files by routing them to a null leaf.
      // documentation/module-organization.html ⇒ [Removed from output]
  },
}

export function move() {
  gulp.src('./src/**', { base: './src' })
    .pipe(restructureTree(treeMap))
    .pipe(gulp.dest('./dist')
}
```

## Developing

```bash
$ git clone https://github.com/SewanDevs/ceiba-router.git
$ npm run build      # Compile project with Webpack
$ npm run watch      # Run Webpack in watch mode
```

### Tests

```bash
$ npm run test       # Run Jest on all .test.js files
$ npm run testWatch  # Run Jest in watch mode
```

## Known issues

* For a cleaner and more concise tree structure definition, this plugin asks you to describe your file tree as a plain javascript object, and so relies on object keys [iteration order](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/for...in) which is standardized as being undetermined (i.e. applications _should_ assume object keys are unordered). However, iteration order is deterministic and consistent on both V8 _(Node.js, Chrome)_ and SpiderMonkey _(Firefox)_: string keys are itered in definition order, except for keys that are integers, which come first and are ordered by numerical order. `gulp-restructure-tree` will warn you if you use such keys in your tree and suggest making the branch a simple RegExp as a workaround to keep the definition order (_e.g._: `"7"`→`"/7/"`).

______

<sup id="f1">[[1]](#a1): A globstar introduces two capture groups, one that will match the last folder matched, and one that will match the file name (_e.g._: with `{ "foo/**": "quux/$1/$2" }`: `./foo/bar/baz/qux`⇒`./quux/baz/qux`).

<sup id="f2">[[2]](#a2): Internally, a [globstar](#branches-globstar) is appended to the route, which means you can reference them in capture groups (_e.g._: with `{ "foo/": "qux/$1/$2.bak" }`: `./foo/bar/baz`⇒`./qux/bar/baz.bak`).

<sup id="f3">[[3]](#a3): RegExp and Array branches are included using [computed property name](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names) syntax. The string representation of ReExps and Array instances is used to differentiate them from plain branches. Thus, a branch that begins and ends with a `/` will be interpreted as a RegExp branch, and a branch that has a `,` in it will be interpreted as an array branch. If you want to match a literal comma in a filename, you must escape it (_e.g._: `"foo\\,bar.txt"` will match the file `foo,bar.txt`).</sup> 

<sup id="f4">[[4]](#a4): The concept of divergence is defined as follow: until a tree path is composed of regular string branches and it matches the file path, the paths are not diverging. The non-diverging matching directories will be "eaten" from the resulting path
(_e.g._: with `{ foo: { bar: { 'b*z/': 'dest/' }}}`: `foo/bar/baz/qux`⇒`dest/baz/qux`, the folders `foo` and `bar` have been omitted in the resulting path, but `baz` has been kept since it isn't an "exact" match).</sup>

<sup id="f5">[[5]](#a5): The [`pathObject`](https://nodejs.org/api/path.html#path_path_format_pathobject) sent to function destinations has an additional key in addition to those provided by [`path.parse`](https://nodejs.org/api/path.html#path_path_parse_path): `full`, which is the full relative path name as provided by the vinyl stream. It is provided as a convenience and is ignored in the function's return value.</sup>

<sup id="f6">[[6]](#a6): `treeMap` objects are compiled and cached in memory. It won't be recompiled if you pass the same object to `gulp-restructure-tree` multiple times. This means splitting definitions in multiple sub-trees for the different tasks shouldn't significantly improve performance. This also means that if you want to mutate the same `treeMap` object in between calls to `gulp-restructure-tree`, your changes won't be accounted for unless you pass in the [`bypassCache`](#options-bypasscache) option.

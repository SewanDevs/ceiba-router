# gulp-restructure-tree

A declarative way to restructure complex directory structures with [Gulp](https://github.com/gulpjs/gulp/tree/4.0).

**Warning: Early release, API is subject to change and bugs may be present.**

[![Build Status](https://travis-ci.org/SewanDevs/gulp-restructure-tree.svg?branch=master)](https://travis-ci.org/SewanDevs/gulp-restructure-tree)
[![Coverage Status](https://coveralls.io/repos/github/SewanDevs/gulp-restructure-tree/badge.svg?branch=master)](https://coveralls.io/github/SewanDevs/gulp-restructure-tree?branch=master)

## Installation

```bash
$ npm install SewanDevs/gulp-restructure-tree --save-dev
```

## Usage


`restructureTree(treeMap[, options])`

### Example

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
        // app/modules/basket/alt/christmas.css => styles/basket/alt/christmas.css
        
        gui: {
          '**GUI.jsx': 'templates/$1-$3.js',
          // Insert back references, here whatever directory was matched by the *
          //  just after 'modules' will serve as the first part of the filename.
          // This "trailing" ** counts as two capture groups, one for
          //   the folders and one for the ending file ("**/*").
          // app/modules/basket/gui/itemsGUI.jsx => templates/basket-items.js 
        },
        
        [/(.*)(\.min)?\.jsx?/]: 'scripts/$3.js',
        // Use RegExp by converting them to strings, capture groups are used for the
        //  back references.
        // app/modules/basket/itemsRefHandling.min.js => scripts/itemsRefHandling.js
      }
    },
    helpers: {
      'jquery-*': 'libs/global/',
      // Rules are evaluated from top to bottom so place more specific rules on top.
      // app/helpers/jquery-3.1.1.min.js => libs/global/jquery/jquery-3.1.1.min.js

      [/.*\.jsx?/]:
              ({ name, extname }) =>
                      `libs/${extname === 'jsx' ? 'react/' : ''}${name}/${name}.js`
      // Function leaves take a parsed path as argument and return a destination
      //  path as a string or parsed path object.
      // app/helpers/modalify.js => libs/modalify/modalify.js
      // app/helpers/dropdown.jsx => libs/react/dropdown/dropdown.js
    }
  },
  documentation: {
      '**': null,
      // Discard files by routing them to a null leaf.
      // documentation/module-organization.html => [Removed from output]

      '/': './docs'
      // Match folders by selecting them with a '/' rule. This will move the empty
      //  directory.
      // documentations => docs
  }
}

export function move() {
  gulp.src('./src', { base: './src' })
    .pipe(restructureTree(treeMap))
    .pipe(gulp.dest('./dist')
}
```

## API

### `restructureTree( treeMap[, options] )`
#### Arguments:
##### `treeMap`:
A tree structure described with plain javascript objects. _Keys_ are **`branches`** and non-object _values_ are **`leaves`**.
  * **`branches`**:
     A branch represents a path segment, the name of one directory or file.
     Simple bash-style `*`, `**` glob patterns can be used, or Regular Expression for more complicated matching requirements.
     * `*` A wildcard can be included anywhere in the path to match any characters in a filename.
      _e.g.: `foo*ar` will match `foobar` but will not match nested directories`foo/bar`_
     * `**` A branch name can begin by a "globstar" pattern, in that case it will recursively match as many directories as necessary to complete the rest of the tree.
     _e.g.: `**az` will match `foo/bar/baz`_
     * `/foo[a-z-]+/` A branch name can be a Regular Expression. It will match any branch that matches it. No flags are supported. To be recognized as such, it must begin and end with `/`. If using ES2015, it's convenient to use RegExp literals and have them converted to strings automatically with `{ [expression]: value }` syntax. Otherwise keep in mind to double the `\` and surround the expression with `/`.

  * **`leaves`**:
      Any value that is either a function, a string, or null, represents a destination. Files whose paths match the path leading up to the leaf will be moved to the specified destination.
      * `{string}`: A destination path. If it ends with a `/`, then it is interpreted as a directory and the files will keep their filenames. If it doesn't end with a `/`, files will be renamed to match the new destination filename.
      * `(pathObject) => {string|pathObject}`: Takes a parsed path object, and returns either a path that will be interpreted the same as a string leaf, or a parsed path object that will be applied directly.
      * `null`: The file will be removed from the stream.
    
##### `options`:
  * `dryRun`: Don't move files, only log operations that would be executed (implies verbose mode). _Default to `false`_. 
  * `verbose`: Log file move operations to stdout. _Default to `false`_. 
  * `logUnchanged`: In verbose mode, also log operations that don't result in any path change. _Default to `false`_.
  * `onlyFiles`: Don't process directories. _Default to `false`_.

## Known issues

* For a clean tree structure definition, this plugin relies on object keys [iteration order](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in) which is standardized as being undetermined, i.e. applications _should_ assume object keys are unordered. The behavior is consistent on both V8 (Chrome, Node.js) and SpiderMonkey (Firefox) though: string keys are itered in definition order, except for integers which come first and are ordered by numerical order. The plugin will warn you if you use such integer keys and suggest making the key a simple RegExp as a workaround.

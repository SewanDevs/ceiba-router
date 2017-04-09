# unix-path

[![npm](https://img.shields.io/npm/v/unix-path.svg)](https://www.npmjs.com/package/unix-path)

Drop-in node.js [`path`](https://nodejs.org/api/path.html) replacement that converts all results to Unix-style paths.

A simpler and more minimal [`upath`](https://github.com/anodynos/upath) without any dependency.

## Patched methods and properties

* `resolve`
* `normalize`
* `isAbsolute`
* `join`
* `relative`
* `dirname`
* `basename`
* `extname`
* `format`
* `sep`
* `delimiter`

## Additional methods

* `toUnixPath: (string) => string`: Convert Windows-style path to Unix-style path.
* `patch: (PathModule) => PatchedPathModule`: Create a new patched object.

## Example

Assuming we are on a Windows host:

```javascript
const upath = require('unix-path');

const parsed = upath.parse('C:\\\\Windows\\System32\\sethc.exe');
// {
//   root: '/c/',
//   dir: '/c/Windows/System32',
//   base: 'sethc.exe',
//   ext: '.exe',
//   name: 'sethc'
// }

const joined = upath.join('foo\\bar', 'baz/qux');
// "foo/bar/baz/qux"

```

[**Try it online**](https://runkit.com/npm/unix-path)

## Notes

* Windows drive letters are converted "Git Bash" style (`C:\\` => `/c/`)
* Requires Node.js >= v6

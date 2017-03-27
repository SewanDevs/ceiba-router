# unix-path

[![npm](https://img.shields.io/npm/v/unix-path.svg)](https://www.npmjs.com/package/unix-path)

Node.js drop-in `path` replacement that converts all results to Unix-style paths.

A simpler [`upath`](https://github.com/anodynos/upath) without any dependency.

## Additional methods

* `toUnixPath`: Convert Windows-style path to Unix-style path.

## Patched methods

* `dirname`
* `format`
* `join`
* `normalize`
* `parse`
* `relative`
* `sep`

## Example

Assuming we are on a Windows host:

```javascript
const upath = require('unix-path')

const formatted = upath.format('C:\\\\Windows\\System32\\sethc.exe')

assert.deepEqual(
  formatted,
  {
    root: '/c/',
    dir: '/c/Windows/System32',
    base: 'sethc.exe',
    ext: '.exe',
    name: 'sethc'
  })
```

## Notes

* Windows drive letters are converted "Git Bash" style (`C:\\` => `/c/`)
* Requires Node.js >= v6

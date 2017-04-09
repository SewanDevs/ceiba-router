const win32Path = require('path').win32;
const upath = require('unix-path/patch')(win32Path);

const parsed = upath.parse('C:\\\\Windows\\System32\\sethc.exe');
console.log(parsed);

const joined = upath.join('foo\\bar', 'baz/qux');
console.log(joined);

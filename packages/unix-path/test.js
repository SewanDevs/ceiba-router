const patchPath = require('./patch');
const upath = require('./index.js');

const path = require('path');
const { posix: posixPath, win32: win32Path } = path;

const isWin = /^win/.test(process.platform);
const posixUpath = isWin ? patchPath(posixPath) : upath;
const win32Upath = isWin ? upath : patchPath(win32Path);

test(`.parse`, () => {
    expect(win32Upath.parse('C:\\\\Foo\\Bar\\baz.Qux'))
        .toEqual({
            root: '/c/',
            dir: '/c/Foo/Bar',
            base: 'baz.Qux',
            ext: '.Qux',
            name: 'baz'
        });
});

test(`.join`, () => {
    expect(win32Upath.join('foo\\bar', 'baz/qux'))
        .toBe('foo/bar/baz/qux');
});

test(`.sep`, () => {
    expect(win32Upath.sep).toBe('/');
});

test(`.delimiter`, () => {
    expect(win32Upath.delimiter).toBe(':');
});

test(`doesn't modify original path module`, () => {
    const reference = isWin ? path.win32 : path.posix;
    Object.keys(path).filter(k => !['win32', 'posix'].includes(k))
        .forEach(k => {
            expect(path[k]).toBe(reference[k]);
        });
});

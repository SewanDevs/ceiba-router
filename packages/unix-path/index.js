const origPath = require('path');

function toUnixPath(pth) {
    const WINDOWS_ROOT_REGEXP = /^([A-Za-z]+):(\\\\|\\$)/;
    const [,driveLetter] = pth.match(WINDOWS_ROOT_REGEXP) || [];
    const withUnixRoot = driveLetter ?
        pth.replace(WINDOWS_ROOT_REGEXP, `/${driveLetter.toLowerCase()}/`) :
        pth;
    return withUnixRoot.replace(/\\/g, '/');
}

const upath = Object.create(origPath)

upath.parse = (...args) => {
    let parsed = origPath.win32.parse(...args);
    parsed.dir = toUnixPath(parsed.dir);
    parsed.root = toUnixPath(parsed.root);
    return parsed;
};

for (const method of [
    'dirname',
    'format',
    'join',
    'normalize',
    'relative',
    'sep',
]) {
    upath[method] = (...args) => toUnixPath(origPath[method](...args))
}

upath.toUnixPath = toUnixPath;

module.exports = upath;

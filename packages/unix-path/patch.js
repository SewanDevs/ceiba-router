function toUnixPath(pth) {
    const WINDOWS_ROOT_REGEXP = /^([A-Za-z]+):(\\\\|\\$)/;
    const [,driveLetter] = WINDOWS_ROOT_REGEXP.exec(pth) || [];
    const withUnixRoot = driveLetter ?
        pth.replace(WINDOWS_ROOT_REGEXP, `/${driveLetter.toLowerCase()}/`) :
        pth;
    return withUnixRoot.replace(/\\/g, '/');
}

module.exports = function patch(origPath) {
    const upath = Object.create(origPath)

    upath.parse = (...args) => {
        let parsed = origPath.parse(...args);
        parsed.dir = toUnixPath(parsed.dir);
        parsed.root = toUnixPath(parsed.root);
        return parsed;
    };

    for (const method of [
        'resolve',
        'normalize',
        'isAbsolute',
        'join',
        'relative',
        'dirname',
        'basename',
        'extname',
        'format',
    ]) {
        upath[method] = (...args) => toUnixPath(origPath[method](...args))
    }

    upath.sep = origPath.posix.sep;
    upath.delimiter = origPath.posix.delimiter;

    upath.toUnixPath = toUnixPath;
    upath.patch = patch;

    return upath;
}

/**
 * @example
 * replaceMatches('Hello $1 how \\$2 you $3?', [ 'world', 'are' ])
 * // => "Hello world how $2 you $3?"
 * @param {string} str
 * @param {string[]?} matches
 * @returns {string}
 */
export function replaceMatches(str, matches) {
    if (!matches) { return str; }
    const regexp = /([^\\]|^)\$([0-9]+)/g;
    const replaceFn = (m, p1, matchIndex) =>
        (matches[matchIndex - 1] !== undefined) ?
            `${p1}${matches[matchIndex - 1]}` : m;
    // We run the .replace twice to process consecutive patterns (needed
    //   because of the lookbehind-less escape-check)
    return str.replace(regexp, replaceFn).replace(regexp, replaceFn)
        .replace(/\\\$([1-9])/, '\$$1');
}

export const lastPathSegment = pth => {
    const m = pth.match(/([^\/]+)\/?$/);
    return m ? m[1] : null;
};


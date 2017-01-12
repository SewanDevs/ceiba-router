/**
 * @example
 * replaceMatches('Hello $1 how \\$2 you $3?', [ 'world', 'are' ])
 * // => "Hello world how $2 you $3?"
 * @param {string} str
 * @param {string[]?} matches
 * @returns {string}
 */
export function replaceMatches(str, matches = []) {
    const regexp = /([^\$]|^)\$([0-9]+)/g;
    const replaceFn = (m, p1, matchIndex) =>
        (0 > matchIndex || matchIndex >= matches.length) ?
            m : `${p1}${matches[matchIndex]}`;
    // We run the .replace twice to process consecutive patterns (needed
    //   because of the lookbehind-less escape-check)
    return str.replace(regexp, replaceFn).replace(regexp, replaceFn)
        .replace(/\$\$([0-9])/, (_m, p1) => `$${p1}`);
}

export const lastPathSegment = pth => pth.match(/([^\/]*)$/)[1];

/**
 * Converts Windows path separator to Unix separators
 */
export const toUnixSeparator = (pth) => pth.replace(/\\/g, '/');


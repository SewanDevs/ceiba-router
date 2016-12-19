export const not = fn => (...args) => !fn(...args);
export const take = (arr, n) => arr.slice(0, n);
export const takeWhile = (arr, pred) => {
    const i = arr.findIndex(not(pred));
    return take(arr, i === -1 ? arr.length : i);
};
export const dropLast = (arr, n = 1) => arr.slice(0, arr.length - n);
export const flatten = arr => [].concat(...arr);
export const intersperse = (arr, sep) => flatten(arr.map(v => [sep, v])).slice(1);
export const interleave = (a, b) => flatten(a.slice(0, b.length).map((v, i) => [v, b[i]]));
export const last = a => a[a.length - 1];
export const mergeConsecutive = (arr, el) => (arr.length <= 1) ?
    arr :
    arr.slice(1).reduce(((p, v) => (v === el && last(p) === v) ?
        p : [...p, v]), [arr[0]]);
export const mergeConsecutiveElements = arr => (arr.length <= 1) ?
    arr :
    arr.slice(1).reduce((p, v) => last(p) === v ? p : [...p, v], [arr[0]]);

export function lastSameIndex(arr, other, eq = (a, b) => (a === b)) {
    const diffIndex = arr.findIndex((val, i) => !eq(other[i], val));
    return diffIndex === - 1 ? arr.length : diffIndex;
}
export const dropWhileShared = (a, b, eq) => a.slice(lastSameIndex(a, b, eq));
export function keepDifferences(a, b, eq) {
    const i = lastSameIndex(a, b, eq);
    return [ a.slice(i), b.slice(i) ];
}

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

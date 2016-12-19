import upath from 'upath';
import {
    last,
    dropLast,
    interleave,
    mergeConsecutive,
    dropWhileShared,
    keepDifferences,
    replaceMatches,
} from './utils';

/* =Utilities
 * ------------------------------------------------------------ */
const warn = (...args) => console.warn('[path-matching] WARNING:', ...args);

/* =Tree compilation
 * ------------------------------------------------------------ */

const STRING_TESTS = {
    REGEXP: /^\/.*\/$/,
    REGEXP_CHARS: /([.\]\[)(|^$?])/g,
    GLOBSTAR: /^(\*\*)(.*)/,
    STAR: /([^\\]|^)\*/g,
};

/**
 * @returns {boolean} true if tree node is a branch (path segment), false if
 *   it's a leaf (destination).
 */
function isPathMatchingTreeBranch(val) {
    return (typeof val === 'object' && val.constructor === Object);
}

/**
 * Prepare string to be passed through RegExp constructor while transforming
 *   glob patterns.
 */
function preparePatternStringSegment(str) {
    // Escape special RegExp characters except '*'
    return str.replace(STRING_TESTS.REGEXP_CHARS, '\\$1')
              .split(STRING_TESTS.GLOBSTAR)
                  // => [ theWholeTextIfThereIsNoGlobstar, "**", everythingAfter ]
              .map((v, i) =>
                  (i + 1) % 2 === 0 ? // (**) part
                      // Replace unescaped '**' glob
                      v.replace(STRING_TESTS.GLOBSTAR, (_match, _p1, p2) =>
                          `([^\\/]+\/)*${p2 ? `[^\\/]*${p2}` : ''}`)
                  : (i + 1) % 3 === 0 ? // (.*) part
                      (v ? `[^\\/]*${v}` : '')
                  : // Else
                      // Replace unescaped '*' glob
                      v.replace(STRING_TESTS.STAR, '$1[^\\/]*'))
            .join('');
}

/**
 * @param {string[]} pattern
 * @returns {RegExp}
 */
function compilePattern(pattern) {
    const separators = Array(pattern.length).fill('/')
        // Remove separators that come after a '**' segment
        .map((s, i) => pattern[i] === '**' ? '' : '/');
    const prepared = pattern.map((a, i) =>
            STRING_TESTS.REGEXP.test(a) ?
                // Embedded RegExp, we leave it alone for now
                a.substring(1, Math.max(a.length - 1, 1)) :
                preparePatternStringSegment(a));
    const segments = dropLast(interleave(prepared, separators), 1);
    return new RegExp(segments.join(''));
}

/**
 * @typedef {Object} PathRule
 * @property {string[]} match
 * @property {RegExp} test
 * @property {string|function} dest
 */

/**
 * Normalize match patch: Merge consecutive '**' segments and append a '*' to
 *   trailing '**' segment to match any file in folder)
 */
function preprocessMatchPath(match) {
    const merged = mergeConsecutive(match, '**');
    if (merged.length !== match.length) {
        warn(`Consecutive '**' globs found (${match.length - merged.length} excess).`);
    }
    return mergeConsecutive([ ...match,
                              ...(last(match) === '**' ? ['*'] : [])],
                            '**');
}

/**
 * Recursion helper pulled out of main function to optimize performance.
 *   Push { match: branches, dest: leaf } objects depth-first into `paths`.
 */
function _compileMatchingTree_flattenHelper(tree, path = [], paths) {
    for (const [segment, val] of Object.entries(tree)) {
        const newPath = [...path, segment];
        if (!isPathMatchingTreeBranch(val)) { // is leaf
            paths.push({ match: preprocessMatchPath(newPath), dest: val }); // Partial PathRule
            continue;
        }
        _compileMatchingTree_flattenHelper(val, newPath, paths);
    }
}

/**
 * @returns {PathRule[]}
 */
function compilePathMatchingTree(tree) {
    if (!tree) { throw new TypeError(`compilePathMatchingTree: Empty "tree" given (${tree}).`); }
    let matchingPaths = [];
    _compileMatchingTree_flattenHelper(tree, [], matchingPaths);
    matchingPaths.forEach(mp => {
        mp.test = compilePattern(mp.match);
    });
    checkTree(matchingPaths);
    return matchingPaths;
}

function checkTree(mp) {
    if (mp.length <= 1) { // Only one rule, nothing to check
        return true;
    }
    const paths = mp.map(rule => rule.match);
    paths.slice(1).reduce((a, b) => {
        const diffA = dropWhileShared(a, b);
        if (diffA[0] === '**' && diffA[1] === '*') {
            warn(`Inaccessible paths: "${a.join('/')}" shadows following paths` +
                ` (will never match). Place more specifics paths on top.`);
        }
        return b;
    }, paths[0]);
}

/* =Rule retrieval and application
 * ------------------------------------------------------------ */

/**
 * @param {PathRule[]} compiledPathMatching
 * @param {string} path
 * @returns {{ rule: PathRule, matches: string[] }|null}
 */
function getPathRule(compiledPathMatching, path) {
    for (const rule of compiledPathMatching) {
        const matches = path.match(rule.test);
        if (matches) {
            return { rule, matches: matches.slice(1) };
        }
    }
    return null;
}

/**
 * Resolves final file destination path from matched path
 * @param {string} pth
 * @param {PathRule.dest} dest
 * @param {PathRule.match} match
 * @returns {string} transformed path
 * @example
 * matchPathWithDest('foo/bar/baz', 'qux/', [ 'foo', 'bar 'baz' ])
 * // => 'qux/baz'
 * @example
 * matchPathWithDest('foo/bar/baz', 'qux/', [ '**' ])
 * // => 'qux/foo/bar/baz'
 * @example
 * matchPathWithDest('foo/bar/baz', 'qux/', [ 'foo', '**', 'baz' ])
 * // => 'qux/bar/baz'
 */
function matchPathWithDest(pth, dest, match) {
    const pathSegments = pth.split('/');
    const unsharedPathSegments = dropWhileShared(pathSegments, match);
    const matched = upath.join(dest, unsharedPathSegments.join('/'));
    return matched;
}

/**
 * @param {PathRule} rule
 * @param {string[]|undefined} matches
 * @param {string} pth
 * @returns {string} moved path
 */
function applyPathRule(rule, matches, pth) {
    if (!rule) {
        throw new TypeError(`applyPathRule: No rule given (${rule}).`);
    }
    const { test, dest, match } = rule;
    if ((!test && test !== "") || (!dest && dest !== "")) {
        throw new TypeError('applyPathRule: Malformed rule given: ' +
            ((!test && test !== "") ? ` empty "test" field (${test})` : '') +
            ((!dest && dest !== "") ? ` empty "dest" field (${dest})` : '') + '.');
    }

    let str;
    if (typeof dest === 'function') {
        const destResult = dest({ ...upath.parse(pth), full: pth }, match, test);
        if (typeof destResult === 'string') {
            str = matchPathWithDest(pth, destResult, match);
        } else { // Treat returned object as pathObject.
            str = upath.format(destResult);
        }
    } else if (typeof dest === 'string') {
        str = matchPathWithDest(pth, dest, match);
    } else {
        throw new TypeError('applyPathRule: rule.dest of unsupported type ' +
            `"${typeof dest}": ${dest}.`);
    }
    return replaceMatches(str, matches);
}

/* =Public interface
 * ------------------------------------------------------------ */

export default class PathMatcher {
    constructor(pathMatchingTree) {
        this.rawTree = pathMatchingTree;
        this.compiledTree = compilePathMatchingTree(pathMatchingTree);
    }

    match(path) {
        const { rule, matches } = getPathRule(this.compiledTree, path) || {};
        if (!rule) {
            throw new Error(`PathMatcher.match: No rule found for "${path}"`);
        }
        return applyPathRule(rule, matches, path);
    }
}


// Unused but could become useful
//function isRegularPathSegment(segment) {
//    return !(STRING_TESTS.REGEXP.test(segment) ||
//             STRING_TESTS.STAR.test(segment));
//}


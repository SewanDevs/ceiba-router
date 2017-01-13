import { warn } from './helpers';
import {
    not,
    last,
    init,
    dropLast,
    interleave,
    mergeConsecutive,
    keepDifference,
} from '../utils';


/* =Tree compilation
 * ------------------------------------------------------------ */

const STRING_TESTS = {
    REGEXP: /^\/.*\/$/,
    ARRAY: /([^\\]|^),/,
    REGEXP_CHARS: /([.\]\[)(|^$?])/g,
    GLOBSTAR: /^(\*\*)(.*)/,
    STAR: /([^\\]|^)\*/g,
};

/**
 * @returns {boolean} true if tree node is a branch (path segment), false if
 *   it's a leaf (destination).
 */
function isPathMatchingTreeBranch(val) {
    return (!(typeof val === 'string' ||
    typeof val === 'function' ||
    val === null));
}

export function isSolidPathSegment(segment) {
    return ![STRING_TESTS.REGEXP,
             STRING_TESTS.STAR,
             STRING_TESTS.ARRAY].some(t => t.test(segment));
}

export const isCapturingPathSegment = not(isSolidPathSegment);

/** Escape special RegExp characters except '*' */
const escapeRegExpChars = s => s.replace(STRING_TESTS.REGEXP_CHARS, '\\$1');

/** Transform globs into RegExp string */
function globsToRegExpStr(str) {
    return str.split(STRING_TESTS.GLOBSTAR)
            // => [ theWholeTextIfThereIsNoGlobstar, "**", everythingAfter ]
            .map((v, i) =>
                (i + 1) % 2 === 0 ? // (**) part
                                    // Replace unescaped '**' glob
                    v.replace(STRING_TESTS.GLOBSTAR, (_match, _p1, p2) =>
                        `([^\\/]+\/*)*${p2 ? `[^\\/]*${p2}` : ''}`)
                    : (i + 1) % 3 === 0 ? // (.*) part
                    (v ? `[^\\/]*${v}` : '')
                    : // Else
                    // Replace unescaped '*' glob
                    v.replace(STRING_TESTS.STAR, '$1([^\\/]*)'))
            .join('');
}

const _transformSegment = s => globsToRegExpStr(escapeRegExpChars(s));

const arrayToORRegExpStr = ss => `(${ss.join('|')})`;

/**
 * Prepare string to be passed through RegExp constructor while transforming
 *   glob patterns.
 */
function preparePatternStringSegment(str) {
    if (STRING_TESTS.ARRAY.test(str)) {
        const els = str.replace(/([^\\]),/g, "$1$1,")
                       .split(/[^\\],/);
        return arrayToORRegExpStr(els.map(_transformSegment))
    } else {
        return _transformSegment(str);
    }
}

/**
 * @param {string[]} matches
 * @returns {RegExp}
 */
function compilePattern(matches) {
    const separators = Array(matches.length).fill('/')
        // Remove separators that come after a '**' segment
        .map((s, i) => matches[i] === '**' ? '' : '/');
    const prepared = matches.map((a, i) =>
        STRING_TESTS.REGEXP.test(a) ?
            // Embedded RegExp, we leave it alone for now
            a.substring(1, Math.max(a.length - 1, 1)) :
            preparePatternStringSegment(a));

    let segments = dropLast(interleave(prepared, separators), 1);
    // Remove trailing separator since it would be duplicated by the following
    //  process.
    if (segments.length > 1 && last(segments) === '/') {
        segments = init(segments);
    }
    return new RegExp(`^${segments.join('')}$`);
}

/**
 * @typedef {Object} PathRule
 * @property {string[]} match
 * @property {RegExp} test
 * @property {string|function|null} dest
 */

/**
 * Normalize match path: Merge consecutive '**' segments and append a '*' to
 *   trailing '**' segment to match any file in folder)
 */
function preprocessMatchPath(match) {
    const merged = mergeConsecutive(match, '**');
    if (merged.length !== match.length) {
        warn(`Consecutive '**' globs found (${match.length - merged.length} ` +
             `excess).`);
    }
    return mergeConsecutive([ ...match,
                              ...(last(match) === '**' ? ['*'] : []) ],
                            '**');
}

/**
 * Recursion helper pulled out of main function to optimize performance.
 *  Push { match: branches, dest: leaf } objects depth-first into `paths`.
 */
function _compileMatchingTree_flattenHelper(tree, path = [], paths) {
    for (const [segment, val] of Object.entries(tree)) {
        if (/^(0|[1-9][0-9]*)$/.test(segment)) { // Is an integer key
            warn(`Integer keys will come first in object iteration even if ` +
                 `other keys are defined before. Wrap key with '/' to avoid ` +
                 `this behavior ("${segment}" => "/${segment}/").`);
        }
        const newPath = [...path, segment];
        if (!isPathMatchingTreeBranch(val)) { // is leaf
            // Partial PathRule
            paths.push({ match: preprocessMatchPath(newPath), dest: val });
            continue;
        }
        _compileMatchingTree_flattenHelper(val, newPath, paths);
    }
}

/**
 * @returns {PathRule[]}
 */
export default function compilePathMatchingTree(tree) {
    if (!tree) { throw new TypeError(`compilePathMatchingTree: Empty "tree"` +
                                     ` given (${tree}).`); }
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
        const [ diffA, diffB ] = keepDifference(a, b);
        if (diffA[0] === '**' && diffA[1] === '*' &&
            !(diffB.length === 1 && diffB[0] === '/')) {
            warn(`Inaccessible paths: "${a.join('/')}" shadows following ` +
                `paths (will never match). Place more specifics rules on top.`);
        }
        return b;
    }, paths[0]);
}

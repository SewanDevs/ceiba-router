import upath from 'upath';
import {
    last,
    init,
    dropWhileShared,
    replaceMatches,
    lastPathSegment,
    toUnixSeparator,
    cropToNLines,
} from '../utils';
import { isCapturingPathSegment } from './compileTree';
import { parsePath } from './helpers';

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
    const isDir = /\/$/.test(dest);
    const filename = isDir ?
        last(pathSegments) :
        lastPathSegment(dest);
    const unsharedPathSegments = isDir ?
        dropWhileShared(init(pathSegments), match) :
        [];
    const matched = upath.join(isDir ? dest : upath.dirname(dest),
                               ...unsharedPathSegments,
                               filename);
    return matched;
}

function replaceMatched(origMatch, matches, matchedIndexes) {
    let match = origMatch.slice();
    for (let i = 1; matchedIndexes[i]; i++) {
        match[match.findIndex(isCapturingPathSegment)] = matches[i];
    }
    return match;
}

/**
 * @param {PathRule} rule
 * @param {string[]|undefined} matches
 * @param {string} pth
 * @returns {string|null} moved path
 */
export default function applyPathRule(rule, matches, pth) {
    if (!rule) {
        throw new TypeError(`applyPathRule: No rule given (${rule}).`);
    }
    const { test, dest, match } = rule;
    if ((!test && test !== "") || (!dest && dest !== "" && dest !== null)) {
        throw new TypeError('applyPathRule: Malformed rule given: ' +
            ((!test && test !== "") ? ` empty "test" field (${test})` : '') +
            ((!dest && dest !== "" && dest !== null) ?
                ` empty "dest" field (${dest})` : '') + '.');
    }

    let destStr;
    if (typeof dest === 'function') {
        destStr = dest(parsePath(pth), match, matches, test);
        if (destStr === null) {
            return null;
        } else if (typeof destStr === 'object') {
            try {
                // Treat returned object as pathObject.
                return upath.format(destStr);
            } catch(e) {
                if (e instanceof TypeError) {
                    throw new TypeError(
                        `applyPathRule: Invalid object returned from function` +
                        ` argument: ${JSON.stringify(destStr)}, sould be ` +
                        `pathObject (parsable by path.format()), \n` +
                        `(function argument: "${
                            cropToNLines(dest.toString(), 3,
                                         {ellipsisStr: '[cropped...]'})
                        }").`);
                } else {
                    throw e;
                }
            }
        } else if (typeof destStr === 'string') {
            destStr = toUnixSeparator(destStr);
        }
    } else if (typeof dest === 'string') {
        destStr = dest;
    } else if (dest === null) {
        return null;
    } else {
        throw new TypeError('applyPathRule: rule.dest of unsupported type ' +
            `"${typeof dest}": ${dest}.`);
    }
    let matchedIndexes = {}; // Modified in place by replaceMatches
    destStr = replaceMatches(destStr, matches, matchedIndexes);
    const replacedMatch = replaceMatched(match, matches, matchedIndexes);
    return matchPathWithDest(pth, destStr, replacedMatch);
}

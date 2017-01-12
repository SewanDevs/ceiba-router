import upath from 'upath';
import {
    last,
    init,
    dropWhileShared,
    replaceMatches,
    lastPathSegment,
} from '../utils';
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
    const filename = isDir ? last(pathSegments) : lastPathSegment(dest);
    const unsharedPathSegments = dropWhileShared(init(pathSegments), match);
    const matched = upath.join(isDir ? dest : upath.dirname(dest),
                               unsharedPathSegments.join('/'),
                               filename);
    return matched;
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

    let str;
    if (typeof dest === 'function') {
        const destResult = dest(parsePath(pth), match, test);
        if (typeof destResult === 'string') {
            str = matchPathWithDest(pth, destResult, match);
        } else { // Treat returned object as pathObject.
            str = upath.format(destResult);
        }
    } else if (typeof dest === 'string') {
        str = matchPathWithDest(pth, dest, match);
    } else if (dest === null) {
        return null;
    } else {
        throw new TypeError('applyPathRule: rule.dest of unsupported type ' +
            `"${typeof dest}": ${dest}.`);
    }
    return replaceMatches(str, matches);
}

import { not } from './fp';

export const take = (arr, n) => arr.slice(0, n);
export const takeWhile = (arr, pred) => {
    const i = arr.findIndex(not(pred));
    return take(arr, i === -1 ? arr.length : i);
};
export const dropLast = (arr, n = 1) => arr.slice(0, arr.length - n);
export const flatten = arr => [].concat(...arr);
export const intersperse = (arr, sep) =>
    flatten(arr.map(v => [sep, v])).slice(1);
export const interleave = (a, b) =>
    flatten(a.slice(0, b.length).map((v, i) => [v, b[i]]));
export const last = a => a[a.length - 1];
export const init = a => a.slice(0, a.length - 1);
export const mergeConsecutive = (arr, el) => (arr.length <= 1) ?
    arr :
    arr.slice(1).reduce(((p, v) => (v === el && last(p) === v) ?
        p : [...p, v]), [arr[0]]);
export const mergeConsecutiveElements = arr => (arr.length <= 1) ?
    arr :
    arr.slice(1).reduce((p, v) => last(p) === v ? p : [...p, v], [arr[0]]);

export function lastSameIndex(arr, other, eq = (a, b) => (a === b)) {
    const diffIndex = arr.findIndex((val, i) => !eq(other[i], val));
    return (diffIndex === - 1 ? arr.length : diffIndex) - 1;
}
export const dropWhileShared = (a, b, eq) =>
    a.slice(lastSameIndex(a, b, eq) + 1 || a.length);
export function keepDifference(a, b, eq) {
    const i = lastSameIndex(a, b, eq)  + 1 || a.length;
    return [ a.slice(i), b.slice(i) ];
}


import * as A from '../array';

/* merge consecutive whitespace in template strings */
export const _ = (segments) => segments.join('').replace(/(\s){2,}/g, ' ');

describe('utils', () => {
    describe('array', () => {
        describe('take', () => {
            it(_`returns the first "n" elements.`, () => {
                expect(A.take([1, 2, 3, 4], 2)).toEqual([1, 2]);
                expect(A.take([], 5)).toEqual([]);
            })
        });

        describe('takeWhile', () => {
            it(_`returns the array elements until an element doesn't satisfy
                the provided predicate.`, () => {
                expect(A.takeWhile(['a', 'b', 'c', 1, 2],
                                   a => typeof a === 'string'))
                    .toEqual(['a', 'b', 'c']);
                expect(A.takeWhile([1, 2, 3], () => false)).toEqual([]);
            });
        });

        describe('dropLast', () => {
            it(_`returns a copy of the array minus the last "n" elements.`,
                () => {
                    expect(A.dropLast([6, 5, 4, 3, 2, 1], 3))
                        .toEqual([6, 5, 4]);
                    expect(A.dropLast([], 2)).toEqual([]);
                });
            it(_`defaults to removing the last element if "n" isn't provided.`,
                () => {
                    expect(A.dropLast([1, 2, 3])).toEqual([1, 2]);
                });
        });

        describe('flatten', () => {
            it(_`flattens any array element into the provided array.`, () => {
                expect(A.flatten([['a', 'b'], ['c', [1, 2]], ['d']]))
                    .toEqual(['a', 'b', 'c', [1, 2], 'd']);
                expect(A.flatten([])).toEqual([]);
            });
        });

        describe('intersperse', () => {
            it(_`inserts "sep" between each element in the provided array.`,
                () => {
                    expect(A.intersperse([1, 2, 3], '|'))
                        .toEqual([1, '|', 2, '|', 3]);
                    expect(A.intersperse([], '|'))
                        .toEqual([]);
                });
        });

        describe('interleave', () => {
            it(_`weaves two arrays together.`, () => {
                expect(A.interleave(['a', 'b', 'c'], [1, 2, 3]))
                    .toEqual(['a', 1, 'b', 2, 'c', 3]);
            });
            it(_`stops at the shortest one.`, () => {
                expect(A.interleave(['a', 'b', 'c'], [1, 2]))
                    .toEqual(['a', 1, 'b', 2]);
                expect(A.interleave(['a', 'b'], [1, 2, 3]))
                    .toEqual(['a', 1, 'b', 2]);
                expect(A.interleave([], []));
            });
        });

        describe('last', () => {
            it(_`returns the last element of an array.`, () => {
                expect(A.last([1, 2, 3])).toEqual(3);
                expect(A.last([])).toEqual(undefined);
            });
        });

        describe('init', () => {
            it(_`returns a copy of the provided array minus the last element.`,
                () => {
                    expect(A.init([1, 2, 3])).toEqual([1, 2]);
                    expect(A.init([])).toEqual([]);
                });
        });

        describe('mergeConsecutive', () => {
            it(_`replaces consecutive instances of given element in array with a
                 single instance.`, () => {
                expect(A.mergeConsecutive([1, 0, 2, 0, 0, 0, 3, 0, 0], 0))
                    .toEqual([1, 0, 2, 0, 3, 0]);
                expect(A.mergeConsecutive([])).toEqual([]);
            });
        });

        describe('mergeConsecutiveElements', () => {
            it(_`replaces consecutive elements with a single instance of the
                repeating element.`, () => {
                expect(A.mergeConsecutiveElements([1, 2, 2, 3, 3, 3]))
                    .toEqual([1, 2, 3]);
                expect(A.mergeConsecutiveElements([])).toEqual([]);
            });
        });

        describe('lastSameIndex', () => {
            it(_`returns the last index for which provided comparison function
                (taking the same-index elements from provided arrays) returns
                true.`, () => {
                expect(A.lastSameIndex([1, '2', /3/], [4, '5', 6],
                                       (a, b) => typeof a === typeof b))
                    .toEqual(1);
            });

            it(_`comparison function default to equality comparison (===).`,
                () => {
                    expect(A.lastSameIndex([1, 2, 3], [1, 2, 0])).toEqual(1);
                });

            it(_`returns -1 if no index matches.`, () => {
                expect(A.lastSameIndex([1, 2, 3], [])).toEqual(-1);
                expect(A.lastSameIndex([], [])).toEqual(-1);
            });
        });

        describe('dropWhileShared', () => {
            it(_`returns array elements of first provided array starting from
                the element for which comparison function returns false after
                being passed 2 same-index elements.`, () => {
                expect(A.dropWhileShared([1, '2', 3], [4, '5', /6/],
                                         (a, b) => typeof a === typeof b))
                    .toEqual([3]);
            });

            it(_`comparison function defaults to equality comparison (===).`,
                () => {
                    expect(A.dropWhileShared([1, 2, 3], [1, 2, 0]))
                        .toEqual([3]);
                    expect(A.dropWhileShared([1, 2], [3, 4])).toEqual([]);
                    expect(A.dropWhileShared([], [])).toEqual([]);
                });
        });

        describe('keepDifference', () => {
            it(_`returns an array containing two arrays, the elements starting
                from which comparison function returns false from the two
                provided arrays respectively.`, () => {
                expect(A.keepDifference([1, 2, '3', 4], [5, 6, 7, 8],
                                        (a, b) => typeof a === typeof b))
                    .toEqual([['3', 4], [7, 8]]);
            });

            it(_`comparison function defaults to equality comparison (===).`,
                () => {
                    expect(A.keepDifference([1, 2, 3], [1, 2, '3']))
                        .toEqual([[3], ['3']]);
                    expect(A.keepDifference([1, 2], [3, 4]))
                        .toEqual([[], []]);
                    expect(A.keepDifference([], []))
                        .toEqual([[], []]);
                });
        });
    })
});
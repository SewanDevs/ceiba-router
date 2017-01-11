import * as S from '../string';

/* merge consecutive whitespace in template strings */
export const _ = (segments) => segments.join('').replace(/(\s){2,}/g, ' ');

describe('utils', () => {
    describe('string', () => {

        describe('replaceMatches', () => {
            it(_`takes a String#replace-substition-type string and an array of
                 elements to replace the "\${integer}" patterns with.`,
                () => {
                    expect(S.replaceMatches('$0Hello $1$2 are you$3',
                        ['', 'world', ', how', '?']))
                        .toEqual('Hello world, how are you?');
                });

            it(_`doesn't replace "$\${integer}" patterns, but replace the double
                 $ with a single one.`, () => {
                expect(S.replaceMatches('[$$0][$0]',
                    ['Here', 'Now']))
                    .toEqual('[$0][Here]');
            });

            it(_`leaves patterns with no corresponding match untouched.`,
                () => {
                    expect(S.replaceMatches('[$1][$2][$3]',
                        ['Here', 'and', 'Now']))
                        .toEqual('[and][Now][$3]');
                });
        });

        describe('lastPathSegment', () => {
            it(`returns the text following the last "/" in given string.`,
                () => {
                    expect(S.lastPathSegment('Here/and/Now'))
                        .toBe('Now');
                    expect(S.lastPathSegment('Here and Now'))
                        .toBe('Here and Now');
            });

            it(`returns an empty string if given string finishes by "/".`,
                () => {
                    expect(S.lastPathSegment('Here/and/Now/'))
                        .toBe('')
                });
        });

        describe('toUnixSeparator', () => {
            it(`replaces backslashes with forward slashes in given string`,
                () => {
                    expect(S.toUnixSeparator('C:\\\\Program Files\\'))
                        .toBe('C://Program Files/');
                    expect(S.toUnixSeparator('Here')).toBe('Here');
                    expect(S.toUnixSeparator('')).toBe('');
                });
        });

    });
});

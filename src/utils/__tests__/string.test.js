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
                        .toBe('Hello world, how are you?');
                });

            it(_`matches argument is optional`, () => {
                expect(S.replaceMatches('Hello')).toBe('Hello');
            });

            it(_`doesn't replace "$\${integer}" patterns, but replace the double
                 $ with a single one.`, () => {
                expect(S.replaceMatches('[$$0][$0]', ['Here', 'Now']))
                    .toBe('[$0][Here]');
                expect(S.replaceMatches('$$0$0'))
                    .toBe('$0$0');
            });

            it(_`leaves patterns with no corresponding match untouched.`,
                () => {
                    expect(S.replaceMatches('[$1][$2][$3]',
                        ['Here', 'and', 'Now']))
                        .toBe('[and][Now][$3]');
                });

        });

        describe('lastPathSegment', () => {
            it(_`returns the text following the last "/" in given string.`,
                () => {
                    expect(S.lastPathSegment('Here/and/Now'))
                        .toBe('Now');
                    expect(S.lastPathSegment('Here and Now'))
                        .toBe('Here and Now');
            });

            it(_`returns an empty string if given string finishes by "/".`,
                () => {
                    expect(S.lastPathSegment('Here/and/Now/'))
                        .toBe('')
                });
        });

        describe('toUnixSeparator', () => {
            it(_`replaces backslashes with forward slashes in given string`,
                () => {
                    expect(S.toUnixSeparator('C:\\\\Program Files\\'))
                        .toBe('C://Program Files/');
                    expect(S.toUnixSeparator('Here')).toBe('Here');
                    expect(S.toUnixSeparator('')).toBe('');
                });
        });

        describe('removeTrailing', () => {
            it(_`removes the specified character in last position from given
                 string, if it is found.`, () => {
                expect(S.removeTrailing('fooXbarX', 'X')).toBe('fooXbar');
                expect(S.removeTrailing('foo/bar/', '/')).toBe('foo/bar');
                expect(S.removeTrailing('foobar', 'ZZ')).toBe('foobar');
                expect(S.removeTrailing('', '')).toBe('');
            });
        });

        describe('repeatStr', () => {
            it(_`repeats a string "n" times.`, () => {
                expect(S.repeatStr('ha', 3)).toBe('hahaha');
                expect(S.repeatStr('', 6)).toBe('');
                expect(S.repeatStr('foo', 0)).toBe('');
            });
        });

        describe('cropToNLines', () => {
            it(_`keeps only the first "n" lines from a string and appends an
                 indented ellipsis string (defaulting to "...") if the string
                 was cut.`, () => {
                expect(S.cropToNLines('Here\n  And\n  Now', 2))
                    .toBe('Here\n  And\n  ...');
                expect(S.cropToNLines('Here\n  And\n  Now\n', 3))
                    .toBe('Here\n  And\n  Now\n');
                expect(S.cropToNLines('Here\n  And\n  Now', 99))
                    .toBe('Here\n  And\n  Now');
                expect(S.cropToNLines('Here\n  And\n  Now', 0))
                    .toBe('...');
                expect(S.cropToNLines('', 0))
                    .toBe('')
            });

            it(_`ellipsis and whether to indent behavior can be
                 overriden.`, () => {
                expect(S.cropToNLines('Here\n  And\n  Now', 2,
                                      { ellipsisStr: 'XXX' }))
                    .toBe('Here\n  And\n  XXX');
                expect(S.cropToNLines('Here\n  And\n  Now', 2,
                                      { keepIndent: false }))
                    .toBe('Here\n  And\n...');
                expect(S.cropToNLines('Here\n  And\n  Now', 2,
                                      { ellipsisStr: 'XXX',
                                        keepIndent: false }))
                    .toBe('Here\n  And\nXXX');
            });
        });

        describe('escapeRegExpChars', () => {
            it(_`escapes characters which have a special meaning in Regular
                 Expressions, so string can be input into RegExp constructor
                 which will match it literally.`, () => {
                const str = '\\b[]\^$.|?*+(){}';
                expect(str).toMatch(new RegExp(S.escapeRegExpChars(str)));
            });
        });

    });
});

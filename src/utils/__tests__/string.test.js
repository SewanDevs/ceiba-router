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

            it(_`leaves patterns with no corresponding match untouched.`, () => {
                expect(S.replaceMatches('[$1][$2][$3]',
                    ['Here', 'and', 'Now']))
                    .toEqual('[and][Now][$3]');
            });
        });

    });
});

import { _ } from './testHelpers';
import PathMatcher from '../PathMatcher';

describe('PathMatcher.match', () => {

    describe('when given a destination string', () => {

        const treeMapA = {
            foo: 'bar/',
            baz: 'qux',
        };
        const pathMatcherA = new PathMatcher(treeMapA);

        it(`keeps last path segment if destination ends with a "/"`, () => {
            expect(pathMatcherA.match('foo'))
                .toBe('bar/foo');
        });

        it(_`replaces last path segment if destination doesn't end with a
            "/"`, () => {
            expect(pathMatcherA.match('baz'))
                .toBe('qux');
        });

        const treeMapB = {
            foo: {
                barA: {
                    '**': {
                        bazA: 'foobara**baza/qux/',
                    },
                },
                '**': 'foo**/qux/quux/',
            }
        };
        const pathMatcherB = new PathMatcher(treeMapB);

        it(_`keeps path hierarchy up until the first non plain string segment or
            until the destination is reached`, () => {
            expect(pathMatcherB.match('foo/barA/keptA/keptB/bazA'))
                .toBe('foobara**baza/qux/keptA/keptB/bazA');
            expect(pathMatcherB.match('foo/end'))
                .toBe('foo**/qux/quux/end');
        });

        const treeMapC = {
            fooA: {
                '*': {
                    bar: { '**': 'fooa/$1/bar/' }
                }
            }
        };
        const pathMatcherC = new PathMatcher(treeMapC);

        it(_`supports String#replace-style substition strings as
             destination`, () => {
            expect(pathMatcherC.match('fooA/STAR/bar/BAZ'))
                .toBe('fooa/STAR/bar/BAZ');
        });

    });
});
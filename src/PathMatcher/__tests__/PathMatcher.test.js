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

        describe('arrays as "OR" path segments', () => {

            const treeMapD = {
                [['fooA','fooB','fooC']]: {
                    'barA': { '**': 'fooaORfoobORfooc/bara/$1/' },
                    '**': 'fooaORfoobORfooc/globstar/'
                },
                'fooD': {
                    [['barA*','barB*']]: {
                        '**': 'food/barastarORbarbstar/$1/'
                    }
                },
                'fooE': { '**': 'fooe/'},
                'fooF\\,fooG': { '**': 'foofCOMMAfoog/' },
                [['fooH','fooIA\\,fooIB']]: { '**': 'foohORfooiaCOMMAfooib/' },
                '**': 'globstar/'
            };
            const pathMatcherD = new PathMatcher(treeMapD);

            it(_`matches any of the strings in array.`, () => {
                expect(pathMatcherD.match('fooA/qux'))
                    .toBe('fooaORfoobORfooc/globstar/qux');
                expect(pathMatcherD.match('fooB/qux'))
                    .toBe('fooaORfoobORfooc/globstar/qux');
                expect(pathMatcherD.match('fooC/qux'))
                    .toBe('fooaORfoobORfooc/globstar/qux');
            });

            it(_`counts as a capturing segment.`, () => {
                expect(pathMatcherD.match('fooB/barA/baz'))
                    .toBe('fooaORfoobORfooc/bara/fooB/baz');
            });

            it(_`can include globs in array elements.`, () => {
                expect(pathMatcherD.match('fooD/barBSDF/baz/qux'))
                    .toBe('food/barastarORbarbstar/barBSDF/baz/qux');
            });

            it(_`doesn't consider escaped commas or commas in array elements as
                 array separators`, () => {
                expect(pathMatcherD.match('fooF/bar').match(/^foofCOMMAfoog\//))
                    .toBe(null);
                expect(pathMatcherD.match('fooIA')
                    .match(/^foohORfooiaCOMMAfooib\//)).toBe(null);
            });

        });

    });
});
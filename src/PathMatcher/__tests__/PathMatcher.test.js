import { _ } from './testHelpers';
import PathMatcher from '../PathMatcher';

describe('PathMatcher.match', () => {

    describe('on string destination', () => {

        const treeMapA = {
            fooA: 'bar/',
            fooB: 'bar',
        };
        const pathMatcherA = new PathMatcher(treeMapA);

        it(`keeps last path segment if destination ends with a "/".`, () => {
            expect(pathMatcherA.match('fooA'))
                .toBe('bar/fooA');
        });

        it(_`replaces last path segment if destination doesn't end with a
            "/".`, () => {
            expect(pathMatcherA.match('fooB'))
                .toBe('bar');
        });

        const treeMapB = {
            fooA: {
                barA: {
                    '**': {
                        bazA: 'fooabaraGLOBSTARbaza/qux/',
                        bazB: 'fooabaraGLOBSTARbaza/qux',
                    },
                },
                '**': 'fooaGLOBSTAR/qux/quux/',
            },
            'fooB/': 'foobslash/'
        };
        const pathMatcherB = new PathMatcher(treeMapB);

        it(_`on directory destination (trailing "/"), keeps path hierarchy up
             until the first non-plain string segment or until the destination
             is reached.`, () => {
            expect(pathMatcherB.match('fooA/barA/keptA/keptB/bazA'))
                .toBe('fooabaraGLOBSTARbaza/qux/keptA/keptB/bazA');
            expect(pathMatcherB.match('fooA/end'))
                .toBe('fooaGLOBSTAR/qux/quux/end');
        });

        it(_`on file destination, discards source path hierarchy.`, () => {
            expect(pathMatcherB.match('fooA/barA/discardedA/discardedB/bazB'))
                .toBe('fooabaraGLOBSTARbaza/qux');
        });

        it(_`if last path segment ends with a "/", it is considered as a
             recursive match (globstar appended automatically).`, () => {
            expect(pathMatcherB.match('fooB/keptA/keptB/keptC'))
                .toBe('foobslash/keptA/keptB/keptC');
        });

        const treeMapC = {
            fooA: {
                '*': {
                    bar: { '**': 'fooa/$1/bar/' },
                    '*': {
                        baz: 'fooa/$2/bar/$1/qux'
                    }
                }
            },
            '**': {
                fooB: { '**': 'globstar/$1/foob/bar/' },
                fooC: { '**': 'globstar/fooc/bar/' }
            }
        };
        const pathMatcherC = new PathMatcher(treeMapC);

        it(_`supports String#replace-style substition strings as
             destination.`, () => {
            expect(pathMatcherC.match('fooA/STAR/bar/BAZ'))
                .toBe('fooa/STAR/bar/BAZ');
            expect(pathMatcherC.match('fooA/STARA/STARB/baz'))
                .toBe('fooa/STARB/bar/STARA/qux');
        });

        //it(_`globstars keep only last matched directory in capture group`, () => {
        //    expect(pathMatcherC.match('GLOBSTARAP1/GLOBSTARAP2/fooB/GLOBSTARBP1/GLOBSTARBP2/GLOBSTARBP3'))
        //        .toBe('globstar/GLOBSTARAP2/foob/bar/GLOBSTARBP1/GLOBSTARBP2/GLOBSTARBP3');
        //    expect(pathMatcherC.match('GLOBSTARAP1/GLOBSTARAP2/fooB/GLOBSTARBP1/GLOBSTARBP2/GLOBSTARBP3'))
        //        .toBe('globstar/GLOBSTARAP2/foob/bar/GLOBSTARBP1/GLOBSTARBP2/GLOBSTARBP3');
        //});

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
                 array separators.`, () => {
                expect(pathMatcherD.match('fooF/bar').match(/^foofCOMMAfoog\//))
                    .toBe(null);
                expect(pathMatcherD.match('fooIA')
                    .match(/^foohORfooiaCOMMAfooib\//)).toBe(null);
            });

        });

        describe('on function destinations', () => {
            const treeMapE = {
                fooA: {
                    barA: {
                        '**': {
                            bazA: () => 'fooabaraGLOBSTARbaza/qux/',
                            bazB: () => 'fooabaraGLOBSTARbaza/qux',
                            bazC: () => 'fooabaraGLOBSTARbazc\\qux\\',
                        },
                    },
                    '**': {
                        bazD: () => ({ dir: 'quux', base: 'quuz' }),
                        bazE: () => ({ foo: 'bar', baz: 'qux' }),
                        bazF: () => ({ dir: 'quux' }),
                    },
                },
                'fooB/': 'foobslash/'
            };
            const pathMatcherE = new PathMatcher(treeMapE);

            describe('with string return value', () => {

                it(_`treats them the same as a regular destination
                     string,`, () => {
                    expect(pathMatcherE.match('fooA/barA/discardedA/discardedB/bazB'))
                        .toBe('fooabaraGLOBSTARbaza/qux');
                });

                it(_`except it converts Windows path separators ("\\") into
                     UNIX separators ("/").`, () => {
                    expect(pathMatcherE.match('fooA/barA/keptA/keptB/bazC'))
                        .toBe('fooabaraGLOBSTARbazc/qux/keptA/keptB/bazC');
                });
            });

            describe('with object return value', () => {
                it(_`treats object as a parsed path that can be parsed with
                     path.format() and is taken as the final destination
                     (it may modify the string but the location itself stays
                     unchanged).`, () => {
                    expect(pathMatcherE.match('fooA/GLOBSTARA/GLOBSTARB/bazD'))
                        .toBe('quux/quuz');
                    expect(pathMatcherE.match('fooA/GLOBSTARA/GLOBSTARB/bazF'))
                        .toMatch(/quux\/?/);
                });

                it(_`throws if the object is not a valid "pathObject".`, () => {
                    expect(() => pathMatcherE.match('fooA/GLOBSTARA/GLOBSTARB/bazE'))
                        .toThrow(TypeError);
                });
            });
        });

    });
});
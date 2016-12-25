import PathMatcher from '../PathMatcher';

describe('PathMatcher', () => {
    const treeMapA = {
        foo: {
            barA: {
                bazA: 'foobarabaza/qux/'
            },
            barB: {
                bazB: 'foobarbbazb/qux/quux'
            }
        }
    };

    const pathMatcher = new PathMatcher(treeMapA);

    it(`moves files if destination ends with a "/"`, () => {
        const pth = 'foo/barA/bazA';
        expect(pathMatcher.match(pth)).toBe('foobarabaza/qux/bazA');
    });

    it(`renames files if destination doesn't end with a "/"`, () => {
        const pth = 'foo/barB/bazB';
        expect(pathMatcher.match(pth)).toBe('foobarbbazb/qux/quux');
    });
});
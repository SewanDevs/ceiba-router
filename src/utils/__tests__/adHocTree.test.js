import * as T from '../AdHocTree';

/* merge consecutive whitespace in template strings */
export const _ = (segments) => segments.join('').replace(/(\s){2,}/g, ' ');

/* Setup */
let testTree;
let testTreeDepthFirstBranchTraversalArgs;
let testTreeDepthFirstLeafTraversalArgs;
beforeEach(() => {
    testTree = {
        a1: {
            b1: 'b1l',
            b2: {
                c1: 'c1l'
            }
        },
        a2: {},
        a3: 'a3l'
    };

    testTreeDepthFirstBranchTraversalArgs = [
        [ 'a1' , []               , testTree ],
        [ 'b1' , ['a1']           , testTree ],
        [ 'b2' , ['a1']           , testTree ],
        [ 'c1' , ['a1', 'b2']     , testTree ],
        [ 'a2' , []               , testTree ],
        [ 'a3' , []               , testTree ],
    ];
    testTreeDepthFirstLeafTraversalArgs = [
        [ 'b1l', ['a1','b1']      , testTree ],
        [ 'c1l', ['a1', 'b2','c1'], testTree ],
        [ {}   , ['a2']           , testTree ],
        [ 'a3l', ['a3']           , testTree ],
    ];
});

describe('forEach', () => {
    it(_`iterates through nodes depth first, supplying "node",
         "path", "tree" arguments to callbacks.`, () => {
        let leafEntries = [];
        const cbLeaf = (...args) => { leafEntries.push(args); };
        let branchEntries = [];
        const cbBranch = (...args) => { branchEntries.push(args); };
        T.forEach(testTree, cbLeaf, cbBranch);

        expect(branchEntries).toEqual(testTreeDepthFirstBranchTraversalArgs);
        expect(leafEntries).toEqual(testTreeDepthFirstLeafTraversalArgs);
    });

})

describe('map', () => {
    it(_`returns a new tree with each value being the result of given transform
         function, supplying the callback the same parameters as forEach
         does.`, () => {
        let leafEntries = [];
        const cbLeaf = (...args) => {
            const [leaf, path, tree] = args;
            leafEntries.push(args);
            return ['m',leaf];
        };
        let branchEntries = [];
        const cbBranch = (...args) => {
            const [branch, path, tree] = args;
            branchEntries.push(args);
            return `m${branch}`;
        };

        const mapped = T.map(testTree, cbLeaf, cbBranch)

        const expectedMappedTestTree = {
            ma1: {
                mb1: ['m','b1l'],
                mb2: {
                    mc1: ['m','c1l']
                }
            },
            ma2: ['m',{}],
            ma3: ['m','a3l']
        };
        expect(branchEntries).toEqual(testTreeDepthFirstBranchTraversalArgs);
        expect(leafEntries).toEqual(testTreeDepthFirstLeafTraversalArgs);
        expect(mapped).toEqual(expectedMappedTestTree);
    });

    it(_`callbacks default to identity functions, resulting in cloned but
         unmodified tree.`, () => {
        const mapped = T.map(testTree);

        expect(mapped).not.toBe(testTree);
        expect(mapped).toEqual(testTree);
    })

});

describe('getLeaves', () => {
    it(_`returns an array of all the leaves in the given tree.`, () => {
        let leaves = T.getLeaves(testTree);
        expect(leaves).toEqual(['b1l','c1l',{},'a3l']);
    });
});

describe('getBranches', () => {
    it(_`returns an array of all the branch values in the given
         tree.`, () => {
        let branches = T.getBranches(testTree);
        expect(branches).toEqual(['a1','b1','b2','c1','a2','a3']);
    });
});

describe('getPaths', () => {
    it(_`returns an array of all the paths (including leaves) in the given
         tree.`, () => {
        let paths = T.getPaths(testTree);
        expect(paths).toEqual([
          ['a1','b1','b1l'],
          ['a1', 'b2','c1','c1l'],
          ['a2',{}],
          ['a3','a3l'],
        ]);
    });
});

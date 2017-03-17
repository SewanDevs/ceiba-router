/*
 * AdHocTree: A tree defined with plain JavaScript objects.
 * Keys are nodes, non-branch values are leaves.
 * **Key order is significant.** Libraries should warn users of corner cases
 *  implied by that.
 */

function _isLeaf(node) {
    return !(node && typeof node === 'object' && Object.keys(node).length > 0);
}


const noop = () => {};
function _forEach_helper(node, path, tree, cbLeaf=noop, cbBranch=noop) {
    if (_isLeaf(node)) {
        cbLeaf(node, path, tree);
    } else {
        for (const [key, val] of Object.entries(node)) {
            cbBranch(key, path, tree);
            _forEach_helper(val, [...path, key], tree, cbLeaf, cbBranch);
        };
    }
}
export function forEach(tree, cbLeaf, cbBranch) {
    _forEach_helper(tree, [], tree, cbLeaf, cbBranch);
}


const identity = a => a;
function _map_helper(node, path, tree, cbLeaf=identity, cbBranch=identity) {
    if (_isLeaf(node)) {
        return cbLeaf(node, path, tree);
    } else {
        let mappedBranch = {};
        for (const [key, val] of Object.entries(node)) {
            const k = cbBranch(key, path, tree);
            const v =_map_helper(val, [...path, key], tree, cbLeaf, cbBranch);
            mappedBranch[k] = v;
        };
        return mappedBranch;
    }
}
export function map(tree, cbLeaf, cbBranch) {
    return _map_helper(tree, [], tree, cbLeaf, cbBranch);
}


export function getLeaves(tree) {
    let leaves = [];
    forEach(tree, leaf => { leaves.push(leaf); })
    return leaves;
}

export function getBranches(tree) {
    let branches = [];
    forEach(tree, undefined, branch => branches.push(branch))
    return branches;
}

export function getPaths(tree) {
    let paths = [];
    forEach(tree, (leaf, path) => { paths.push([...path, leaf]); })
    return paths;
}

export function getSlices(tree) {
    let slices = [];
    forEach(tree, (leaf, path) => { slices.push({ path, leaf }); })
    return slices;
}

export function flatten(tree) {
    let flattened = [];
    const cb = node => { flattened.push(node); };
    forEach(tree, cb, cb);
    return flattened;
}


import compilePathMatchingTree from './compileTree';
import getPathRule from './getRule';
import applyPathRule from './applyRule';

/* =Public interface
 * ------------------------------------------------------------ */

export default class PathMatcher {
    constructor(pathMatchingTree) {
        this.rawTree = pathMatchingTree;
        this.compiledTree = compilePathMatchingTree(pathMatchingTree);
    }

    match(path) {
        const { rule, matches } = getPathRule(this.compiledTree, path) || {};
        if (!rule) {
            throw new Error(`PathMatcher.match: No rule found for "${path}"`);
        }
        return applyPathRule(rule, matches, path);
    }
}

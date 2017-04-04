import compilePathMatchingTree from './compileTree';
import getPathRule from './getRule';
import applyPathRule from './applyRule';

/* =Public interface
 * ------------------------------------------------------------ */

export default class PathMatcher {
    constructor(pathMatchingTree) {
        this.compiledTree = compilePathMatchingTree(pathMatchingTree);

        this.rawTree = pathMatchingTree;
        this.getRule = getPathRule;
        this.applyRule = applyPathRule;
    }

    /**
     * @param {string} path
     */
    match(path) {
        const { rule, matches } = this.getRule(this.compiledTree, path) || {};
        if (!rule) {
            throw new Error(`PathMatcher.match: No rule found for "${path}"`);
        }
        return this.applyRule(rule, matches, path);
    }
}

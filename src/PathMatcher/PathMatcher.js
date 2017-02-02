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
    /**
     * checks the rule matching the current path
     * it then returns the rule to the path
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    match(path) {
        // we check which rule matches the current path
        const { rule, matches } = getPathRule(this.compiledTree, path) || {};
        if (!rule) {
            throw new Error(`PathMatcher.match: No rule found for "${path}"`);
        }
        // where the magic happens - actual execution of the rules
        return applyPathRule(rule, matches, path);
    }
}

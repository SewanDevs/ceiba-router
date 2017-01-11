/**
 * @param {PathRule[]} compiledPathMatching
 * @param {string} path
 * @returns {{ rule: PathRule, matches: string[] }|null}
 */
export default function getPathRule(compiledPathMatching, path) {
    for (const rule of compiledPathMatching) {
        const matches = path.match(rule.test);
        if (matches) {
            return { rule, matches: matches };
        }
    }
    return null;
}


/* merge consecutive whitespace in template strings */
export const _ = (strSegments) => strSegments.join('').replace(/(\s){2,}/g, '$1');


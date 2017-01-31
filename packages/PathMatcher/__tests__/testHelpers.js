/* merge consecutive whitespace in template strings */
export const _ = (segments) => segments.join('').replace(/(\s){2,}/g, ' ');


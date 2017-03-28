import upath from 'unix-path';

/**
 * Result of path.parse plus `full` property and `toString` method.
 * @property {string} full - Original path given in constructor
 * @method {string} toString - Returns full
 */
export class ParsedPath {
    constructor(pth) {
        Object.assign(this, upath.parse(pth));
        this.full = pth;
    }
    toString() { return this.full; }
}
export const parsePath = (...args) => new ParsedPath(...args);

import warn from './warn';
export { warn };

import { _ } from './testHelpers';
import * as A from '../applyRule';

describe('applyRule', () => {
    describe('isPathObject', () => {
        it(_`returns true if object has at least one property taken into account
             by path.format(), false either.`, () => {
            expect(A.isPathObject({foo: 0})).toBe(false);
            expect(A.isPathObject({root: '/'})).toBe(true);
            expect(A.isPathObject({root: '/'})).toBe(true);
        });
    });
});

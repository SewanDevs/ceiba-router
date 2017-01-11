import * as F from '../fp';

/* merge consecutive whitespace in template strings */
export const _ = (segments) => segments.join('').replace(/(\s){2,}/g, ' ');

describe('utils', () => {
    describe('fp', () => {

        describe('identity', () => {
            it(_`returns the provided argument.`, () => {
                expect(F.identity(1)).toBe(1);
                const obj = {};
                expect(F.identity(obj)).toBe(obj);
                expect(F.identity('a', 'b')).toBe('a');
                expect(F.identity()).toBe(undefined);
            });
        });

        describe('not', () => {
            it(_`returns a function that negates the return value of provided
                 function.`, () => {
                const isShort = a => a.length < 3;
                expect(F.not(isShort)('123456')).toBe(true);
                expect(F.not(isShort)('12')).toBe(false);
                expect(F.not(isShort)('12')).toBe(!isShort('12'));
            });
        });

    });
});

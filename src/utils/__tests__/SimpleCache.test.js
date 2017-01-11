import SimpleCache from '../SimpleCache';

/* merge consecutive whitespace in template strings */
export const _ = (segments) => segments.join('').replace(/(\s){2,}/g, ' ');

describe('SimpleCache', () => {

    it(_`stores value produced by given callback and reuse result when called
        with the same key`, () => {
        const cb = jest.fn((a) => ({cached: a}));
        const cache = new SimpleCache(cb);

        const res1 = cache.get('key');
        const res2 = cache.get('key');

        expect(res1).toEqual({cached: 'key'});
        expect(res2).toBe(res1);
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it(_`supports all key types supported by Map and WeakMap`, () => {
        const cb = jest.fn((a) => ({cached: a}));
        const cache = new SimpleCache(cb);

        const objKey = { foo: 'bar' };
        const res1 = cache.get(objKey);
        const res2 = cache.get(objKey);

        expect(res1).toEqual({ cached: { foo: 'bar' } });
        expect(res2).toBe(res1);
        expect(cb).toHaveBeenCalledTimes(1);
    });
});

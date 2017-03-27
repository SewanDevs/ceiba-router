import SimpleCache from '../SimpleCache';

/* merge consecutive whitespace in template strings */
export const _ = (segments) => segments.join('').replace(/(\s){2,}/g, ' ');

describe('SimpleCache', () => {


    const cb = jest.fn(a => ({cached: a}));
    const cache = new SimpleCache(cb);

    it(_`stores value produced by callback given in constructor and reuse result
         when called with the same key`, () => {
        const res1 = cache.get('key');
        const res2 = cache.get('key');

        expect(res1).toEqual({cached: 'key'});
        expect(res2).toBe(res1);
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it(_`callback can be overriden when calling SimpleCache#get`, () => {
        const cb = jest.fn(a => ({cached: a}));
        const cache = new SimpleCache(cb);
        const overridingCb = jest.fn(n => n + 1);
        const res1 = cache.get(7, overridingCb);
        const res2 = cache.get(7);

        expect(res1).toBe(8);
        expect(res2).toBe(res1);
        expect(cb).toHaveBeenCalledTimes(0);
        expect(overridingCb).toHaveBeenCalledTimes(1);
    });

    it(_`supports all key types supported by Map and WeakMap`, () => {
        const cb = jest.fn(a => ({cached: a}));
        const cache = new SimpleCache(cb);

        const objKey = { foo: 'bar' };
        const res1 = cache.get(objKey);
        const res2 = cache.get(objKey);

        expect(res1).toEqual({ cached: { foo: 'bar' } });
        expect(res2).toBe(res1);
        expect(cb).toHaveBeenCalledTimes(1);
    });
});

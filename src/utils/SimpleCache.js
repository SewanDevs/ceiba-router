export default class SimpleCache {
    constructor(cb) {
        this.objectCache = new WeakMap();
        this.primitiveCache = new Map();
        this.cb = cb;
    }
    getCache(key) {
        return typeof key === 'object' ? this.objectCache : this.primitiveCache;
    }
    get(key, cb) {
        const cache = this.getCache(key);
        if (cache.has(key)) {
            return cache.get(key);
        } else {
            const res = (this.cb || cb)(key);
            cache.set(key, res);
            return res;
        }
    }
}

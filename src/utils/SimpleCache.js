export default class SimpleCache {
    constructor(cb) {
        this.cache = new WeakMap();
        this.cb = cb;
    }
    get(key, cb) {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        } else {
            const res = (this.cb || cb)(key);
            this.cache.set(key, res);
            return res;
        }
    }
}

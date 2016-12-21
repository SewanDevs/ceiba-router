export const identity = a => a;
export const not = fn => (...args) => !fn(...args);

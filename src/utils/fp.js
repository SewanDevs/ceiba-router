export const identity = a => a;
export const not = fn => (...args) => !fn(...args);
export const min = (a, b) => a > b ? b : a;

const prop = (key) => (object) => object[key];

const path = (pth) => (object) =>
  pth.reduce((acc, key) => (acc === undefined ? undefined : acc[key]), object);

// The value at path is
const pathEq = (value) => (pth) => (object) => path(pth)(object) === value;

const abs = (x) => Math.abs(x);

const eq = (x) => (y) => x === y;

const compose = (f) => (g) => (x) => f(g(x));

export { prop, path, pathEq, abs, eq, compose };

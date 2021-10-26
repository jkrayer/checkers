const prop = (key) => (object) => object[key];

const path = (pth) => (object) =>
  pth.reduce((acc, key) => (acc === undefined ? undefined : acc[key]), object);

// The value at path is
const pathEq = (value) => (pth) => (object) => path(pth)(object) === value;

export { prop, path, pathEq };

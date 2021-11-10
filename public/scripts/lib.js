const abs = (x) => Math.abs(x);

const compose =
  (f) =>
  (g) =>
  (...xs) =>
    f(g(...xs));

const eq = (x) => (y) => x === y;

const halve = (x) => x / 2;

const isNil = (x) => x === null || x === undefined;

const map = (fn) => (arr) => arr.map(fn);

const path = (pth) => (object) =>
  pth.reduce((acc, key) => (isNil(acc) ? undefined : acc[key]), object);

// The value at path is
const pathEq = (value) => (pth) => (object) => path(pth)(object) === value;

const pathsEq = (pone) => (ptwo) => (obj) => {
  const vone = path(pone)(obj);
  const vtwo = path(ptwo)(obj);

  return vone !== undefined && vtwo !== undefined && vone === vtwo;
};

const prop = (key) => (object) => object[key];

const reverse = ([x, y]) => [y, x];

const reverseA2 = (fn) => (a) => (b) => fn(b)(a);

const sumPairs = (...pairs) =>
  pairs.slice(1).reduce(([x, y], [a, b]) => [x + a, b + y], pairs[0]);

const Left = (x) => ({
  isLeft: true,
  isRight: false,
  map: () => Left(x),
  join: () => Left(x),
  chain: () => Left(x),
  get: () => x,
  toString: () => `Left(${x})`,
});

const Right = (x) => ({
  isLeft: false,
  isRight: true,
  map: (fn) => Right(fn(x)),
  join: () => (x.isLeft || x.isRight ? x : Right(x)),
  chain: (fn) => fn(x),
  get: () => x,
  toString: () => `Right(${x})`,
});

export {
  abs,
  compose,
  eq,
  halve,
  isNil,
  map,
  path,
  pathEq,
  pathsEq,
  prop,
  reverse,
  reverseA2,
  sumPairs,
  Left,
  Right,
};

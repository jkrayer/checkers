const split = (char) => (str) => str.split(char);

const prop = (key) => (obj) => obj[key];

const reverseA2 = (fn) => (x) => (y) => fn(y)(x);

const _getImageType = reverseA2(prop)({
  jpg: "jpeg",
  gif: "gif",
  png: "png",
});

const isNil = (x) => x === undefined || x === null;

const ifElse = (pred) => (pass) => (fail) => (val) =>
  pred(val) ? pass(val) : fail(val);

const compose =
  (...fns) =>
  (val) =>
    fns.reduceRight((acc, fn) => fn(acc), val);

const getImageType = compose(
  ifElse(isNil)(() => "jpeg")(_getImageType),
  prop(1),
  split(".")
);

export { getImageType, isNil };

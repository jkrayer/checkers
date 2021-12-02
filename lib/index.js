const substr = (index) => (str) => str.substring(index);

const prop = (key) => (obj) => obj[key];

const reverseA2 = (fn) => (x) => (y) => fn(y)(x);

const getFileType = reverseA2(prop)({
  jpg: "image/jpeg",
  gif: "image/gif",
  png: "image/png",
  js: "application/javascript",
  css: "text/css",
});

const isNil = (x) => x === undefined || x === null;

const ifElse = (pred) => (pass) => (fail) => (val) =>
  pred(val) ? pass(val) : fail(val);

const compose =
  (...fns) =>
  (val) =>
    fns.reduceRight((acc, fn) => fn(acc), val);

const getContentType = compose(
  ifElse(isNil)(() => "text/text")(getFileType),
  substr(1)
);

export { getContentType, isNil };

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

const prop = (key) => (object) => object[key];

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
  prop,
  sumPairs,
  Left,
  Right,
};
/*
// EITHER
const move = (s, f, t) => {
  validPlayer({ s, f, t }); //left or right
  map();
};

ValidPlayer = validPlayer(s, f, t);
// lef or right of errormsg, or {s,f,t}
ValidDir = ValidPlayer.chain(validSpace);
// lef or right of errormsg, or {s,f,t}
ValidSpce = ValidDir.chain(validSpace);
// lef or right of errormsg, or {s,f,t}

// class Left {
//   constructor(val) {
//     this._val = val;
//   }
//   map() {
//     return this;
//   }
//   join() {
//     return this;
//   }
//   chain() {
//     return this;
//   }
//   get() {
//     return this._val;
//   }
//   toString() {
//     return `Left(${this._val.toString()})`;
//   }
// }

// class Right {
//   constructor(val) {
//     this._val = val;
//   }

//   map(fn) {
//     return new Right(fn(this._val));
//   }

//   join() {
//     if (this._val instanceof Left || this._val instanceof Right) {
//       return this._val;
//     }
//     return this;
//   }

//   chain(fn) {
//     return fn(this._val);
//   }

//   get() {
//     return this._val;
//   }

//   toString() {
//     return `Right(${this._val.toString()})`;
//   }
// }

function validPlayer({ from, to, state }) {
  return state.board[fromy][fromx] === state.turn
    ? new Right({ from, to, state })
    : new Left({ ...state, error: "Player attempted to move invalid token" });
}

function validSpace({ from, to, state }) {
  return state.board[toy][tox] === "E"
    ? // update board
      Right({ from, to, state })
    : Left({ ...state, error: "Player attempted to move to an invalid space" });
}

function makeMove(from, to, state) {
  return validPlayer({ from, to, state }).chain(validSpace);
}
*/

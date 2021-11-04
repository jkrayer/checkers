// https://www.ultraboardgames.com/checkers/game-rules.php
// needs a must capture
import {
  abs,
  compose,
  halve,
  isNil,
  map,
  pathEq,
  prop,
  reverse,
  reverseA2,
  sumPairs,
  Left,
  Right,
} from "./lib.js";

// Constants
const KING_ROW = {
  P1: 7,
  P2: 0,
};

const TURNS = {
  P1: "P2",
  P2: "P1",
};

//
const getTurn = prop("turn");
const getSate = prop("state");
const middleSpace = compose(map(halve))(sumPairs);
const nw = ([x, y]) => [x - 1, y - 1];
const ne = ([x, y]) => [x + 1, y - 1];
const sw = ([x, y]) => [x - 1, y + 1];
const se = ([x, y]) => [x + 1, y + 1];
const inBounds = (coord) =>
  coord.reduce((acc, val) => acc && val > -1 && val < 8, true);

const isEmptySpace = reverseA2(pathEq("E"));

const getDistance = (from, to, piece) => {
  const calc = {
    P1: ([, fy], [, ty]) => ty - fy,
    P2: ([, fy], [, ty]) => fy - ty,
    K1: ([, fy], [, ty]) => abs(fy - ty),
    K2: ([, fy], [, ty]) => abs(fy - ty),
  };

  return calc[piece](from, to);
};

const getMoveType = (piece, from, to, state) => {
  const [fx, fy] = from;
  // const [, ty] = to;
  const { board } = state;
  const distance = getDistance(from, to, piece);

  if (distance === 1) {
    return [];
  }

  if (distance === 2) {
    const [mx, my] = middleSpace(from, to);
    if (board[my][mx] === TURNS[piece]) {
      return [[mx, my]];
    }
  }

  return false;
};

//
const validPlayer = ({ from, to, state }) => {
  const [fromx, fromy] = from;
  return pathEq(getTurn(state))(["board", fromy, fromx])(state)
    ? Right({ from, to, state })
    : Left({ ...state, error: `You may not move another player's piece.` });
};

//
const validSpace = ({ from, to, state }) => {
  const [tox, toy] = to;
  return pathEq("E")(["board", toy, tox])(state)
    ? Right({ from, to, state })
    : Left({ ...state, error: `A piece can only be moved to an empty space.` });
};

const validMove = ({ from, to, state }) => {
  const [fx, fy] = from;
  const piece = state.board[fy][fx];
  const captures = getMoveType(piece, from, to, state);

  return captures === false
    ? Left({
        ...state,
        error: `Player attempted a move in an invalid direction or distace`,
      })
    : Right({ from, to, state: { ...state, captures } });
};

const makeMove = ({ from, to, state }) => {
  if (isNil(from) || isNil(to)) {
    return state;
  }

  const { captures, turn } = state;
  const nextState = { ...state };
  const nextBoard = [...state.board];

  // Move
  const [fromx, fromy] = from;
  const [tox, toy] = to;
  nextBoard[toy][tox] = nextBoard[fromy][fromx];
  nextBoard[fromy][fromx] = "E";

  nextState.pieces[TURNS[turn]] -= captures.length;
  captures.forEach(([cx, cy]) => {
    nextBoard[cy][cx] = "E";
  });

  return {
    from,
    to,
    state: {
      ...nextState,
      board: nextBoard,
      captures: [],
      gameOver: nextState.pieces[TURNS[turn]] === 0 ? "Game Over Man" : "",
    },
  };
};

const clearError = ({ from, to, state }) => ({
  from,
  to,
  state: { ...state, error: "" },
});

//
const checkCaptureDirection = (start, board, fns) => {
  const [sx, sy] = start;
  const isOtherPlayer = reverseA2(pathEq(TURNS[board[sy][sx]]))(board);
  const isEmpty = isEmptySpace(board);

  for (let i = 0; i < fns.length; i++) {
    const nextSpace = fns[i];
    let next = nextSpace(start);
    if (inBounds(next) && isOtherPlayer(reverse(next))) {
      next = nextSpace(next);
      if (inBounds(next) && isEmpty(reverse(next))) {
        return true;
      }
    }
  }

  return false;
};

const canCapture = ([tx, ty], state) => {
  const piece = state.board[ty][tx];
  const checks = {
    P1: [sw, se],
    P2: [ne, nw],
    K1: [nw, ne, se, sw],
    K2: [nw, ne, se, sw],
  };

  return checkCaptureDirection([tx, ty], state.board, checks[piece]);
};

const nextTurn = ({ from, to, state }) => {
  return {
    from,
    to,
    state: {
      ...state,
      turn: canCapture(to, state) ? state.turn : TURNS[state.turn],
    },
  };
};

const move = (state, from, to) =>
  validPlayer({ from, to, state })
    .chain(validSpace)
    .chain(validMove)
    .map(makeMove)
    .map(clearError)
    .map(nextTurn)
    .map(getSate)
    .get();

// GameState
const initialState = () => ({
  board: [
    ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
    ["P1", "X", "P1", "X", "P1", "X", "P1", "X"],
    ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
    ["E", "X", "E", "X", "E", "X", "E", "X"],
    ["X", "E", "X", "E", "X", "E", "X", "E"],
    ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
    ["X", "P2", "X", "P2", "X", "P2", "X", "P2"],
    ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
  ],
  turn: "P1",
  pieces: {
    P1: 12,
    P2: 12,
  },
  error: "",
  gameOver: "",
  captures: [],
});

export { initialState, move };

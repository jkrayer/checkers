import {
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
} from "./lib.js";

// Constants
const KING_ROW = {
  P1: 7,
  P2: 0,
};

//
const getTurn = prop("turn");
const getSate = prop("state");
const absOne = compose(eq(1), abs);
const middleSpace = compose(map(halve), sumPairs);

// Validation
// A valid move is validPlayer + validSpace + validDirection
const VALID_MOVES = {
  P1: (fromY, toY) => toY - fromY === 1,
  P2: (fromY, toY) => fromY - toY === 1,
  K1: (fromY, toY) => absOne(fromY - toY),
  K2: (fromY, toY) => absOne(fromY - toY),
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

const validDirection = ({ from, to, state }) => {
  const [fromx, fromy] = from;
  const [, toy] = to;
  const piece = path(["board", fromy, fromx])(state);
  return VALID_MOVES[piece](fromy, toy)
    ? Right({ from, to, state })
    : Left({
        ...state,
        error: `Player attempted to move in an invalid direction`,
      });
};

const makeMove = ({ from, to, state }) => {
  if (isNil(from) || isNil(to)) {
    return state;
  }

  const [fromx, fromy] = from;
  const [tox, toy] = to;
  const board = [...state.board];
  board[toy][tox] = board[fromy][fromx];
  board[fromy][fromx] = "E";

  return {
    from,
    to,
    state: {
      ...state,
      board,
    },
  };
};

const makeCapture = (x) => x;

const clearError = ({ from, to, state }) => ({
  from,
  to,
  state: { ...state, error: "" },
});

const nextTurn = ({ from, to, state }) => {
  const TURNS = {
    P1: "P2",
    P2: "P1",
  };

  return {
    from,
    to,
    state: {
      ...state,
      turn: TURNS[state.turn],
    },
  };
};

const move = (state, from, to) =>
  validPlayer({ from, to, state })
    .chain(validSpace)
    .chain(validDirection)
    .map(makeMove)
    .map(makeCapture)
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
});

export { initialState, move };

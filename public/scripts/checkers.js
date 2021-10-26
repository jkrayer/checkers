import { prop, path, pathEq } from "./lib.js";

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

// Validation
// A valid move is validPlayer + validSpace + validDirection
const VALID_MOVES = {
  P1: (fromY, toY) => toY > fromY,
  P2: (fromY, toY) => toY < fromY,
  K1: (fromY, toY) => toY !== fromY,
  K2: (fromY, toY) => toY !== fromY,
};

//
const validPlayer =
  ([fromX, fromY]) =>
  (state) =>
    pathEq(getTurn(state))(["board", fromY, fromX])(state);

//
const validSpace =
  ([toX, toY]) =>
  (state) =>
    pathEq("E")(["board", toY, toX])(state);

//
// const getPiece =
const validDirection =
  ([fromX, fromY]) =>
  ([, toY]) =>
  (state) => {
    const piece = path(["board", fromY, fromX])(state);
    return VALID_MOVES[piece](fromY, toY);
  };

const validMove = (from) => (to) => (state) =>
  validPlayer(from)(state) &&
  validSpace(to)(state) &&
  validDirection(from)(to)(state);

//  Initial Game State

const makeMove =
  ([fromX, fromY]) =>
  ([toX, toY]) =>
  (state) => {
    const nextState = { ...state };
    nextState.board[toY][toX] = nextState.board[fromY][fromX];
    nextState.board[fromY][fromX] = "E";
    nextState.error("");
    return nextState;
  };

const badMove = (state) => ({
  ...state,
  error: `Player ${getTurn(state)} attempted an invalid move`,
});

const move = (state, from, to) =>
  validMove(from)(to)(state) ? makeMove(from, to, state) : badMove(state);

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

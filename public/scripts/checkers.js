// https://www.ultraboardgames.com/checkers/game-rules.php
// needs a must capture
import {
  abs,
  compose,
  halve,
  isNil,
  map,
  pathEq,
  pathsEq,
  prop,
  reverse,
  reverseA2,
  sumPairs,
  Left,
  Right,
  path,
} from "./lib.js";

// Constants
const PLAYER_ONE = "P1";
const PLAYER_TWO = "P2";
const EMPTY_SPACE = "E";
const INVALID_SPACE = "X";
const SOUTH_WEST = "sw";
const SOUTH_EAST = "se";
const NORTH_WEST = "nw";
const NORTH_EAST = "ne";

const KING_ROW = {
  [PLAYER_ONE]: 7,
  [PLAYER_TWO]: 0,
};

const TURNS = {
  [PLAYER_ONE]: PLAYER_TWO,
  [PLAYER_TWO]: PLAYER_ONE,
};

//
const getBoard = prop("board");
const getSate = prop("state");
const getCurrentPlayer = prop("turn");
const getPlayer = reverseA2(prop)(TURNS);
const getOpposingPlayer = compose(getPlayer)(getCurrentPlayer);
const middleSpace = compose(map(halve))(sumPairs);
const zeroPieces = (player, state) => pathEq(0)(["pieces", player])(state);
const getPiece = (coords, state) => path(["board", ...reverse(coords)])(state);
const getDistance = ([, fy], [, ty]) => abs(fy - ty);
const getDirection = ([fx, fy], [tx, ty]) => {
  const DIRECTIONS = {
    "-11": NORTH_EAST,
    11: NORTH_WEST,
    "1-1": SOUTH_WEST,
    "-1-1": SOUTH_EAST,
  };

  return DIRECTIONS[[fx - tx, fy - ty].map(Math.sign).join("")] || null;
};

//
const isTurnPiece = (coord, state) =>
  pathsEq(["turn"])(["board", ...reverse(coord)])(state);

//
const isEmptySpace = (coord, state) =>
  pathEq(EMPTY_SPACE)(["board", ...reverse(coord)])(state);

//
const isValidMoveDirection = (from, to, state) => {
  const VALID_MOVES = {
    [PLAYER_ONE]: [SOUTH_WEST, SOUTH_EAST],
    [PLAYER_TWO]: [NORTH_WEST, NORTH_EAST],
    K1: [SOUTH_WEST, SOUTH_EAST, NORTH_WEST, NORTH_EAST],
    K2: [SOUTH_WEST, SOUTH_EAST, NORTH_WEST, NORTH_EAST],
  };

  const piece = getPiece(from, state);
  const direction = getDirection(from, to);

  return VALID_MOVES[piece].includes(direction);
};

// isValidDistance 1 || 2 with an enemy piece in the middle
const isValidDistance = (from, to, state) => {
  const absoluteDistance = getDistance(from, to);

  if (absoluteDistance === 1) return true;
  if (absoluteDistance === 2) {
    if (getOpposingPlayer(state) === getPiece(middleSpace(from, to), state)) {
      return true;
    }
  }

  return false;
};

// when the Current Turn and Piece being moved match
const validPlayer = ({ from, to, state }) =>
  isTurnPiece(from, state)
    ? Right({ from, to, state })
    : Left({ ...state, error: `You may not move another player's piece.` });

// when the space being moved to is E
const validSpace = ({ from, to, state }) =>
  isEmptySpace(to, state)
    ? Right({ from, to, state })
    : Left({ ...state, error: `A piece can only be moved to an empty space.` });

//
const validDirection = ({ from, to, state }) =>
  isValidMoveDirection(from, to, state)
    ? Right({ from, to, state })
    : Left({
        ...state,
        error: `Player attempted a move piece in an invalid direction`,
      });

//
const validDistance = ({ from, to, state }) =>
  isValidDistance(from, to, state)
    ? Right({ from, to, state })
    : Left({
        ...state,
        error: "Player attempted to move the piece an invalid distance",
      });

//
const setGameOver = (state) =>
  zeroPieces(getOpposingPlayer(state), state)
    ? { ...state, gameOver: "Game Over Man" }
    : state;

//
const setNextTurn = (state) =>
  pathEq(undefined)(["gameOver"])(state)
    ? { ...state, turn: getOpposingPlayer(state) }
    : state;

//
const inBounds = (coord) =>
  coord.reduce((acc, val) => acc && val > -1 && val < 8, true);

//
const checkCaptureDirection = (start, state, fns) => {
  const opposingPlayer = getOpposingPlayer(state);
  const isOtherPlayer = reverseA2(pathEq(opposingPlayer))(getBoard(state));

  for (let i = 0; i < fns.length; i++) {
    const nextSpace = fns[i];
    let next = nextSpace(start);
    if (inBounds(next) && isOtherPlayer(reverse(next))) {
      next = nextSpace(next);
      if (inBounds(next) && isEmptySpace(next, state)) {
        return true;
      }
    }
  }

  return false;
};

//
const sw = ([x, y]) => [x - 1, y + 1];
const se = ([x, y]) => [x + 1, y + 1];
const nw = ([x, y]) => [x - 1, y - 1];
const ne = ([x, y]) => [x + 1, y - 1];

//
const canCapture = (to, state) => {
  const piece = getPiece(to, state);
  const checks = {
    P1: [sw, se],
    P2: [ne, nw],
    K1: [nw, ne, se, sw],
    K2: [nw, ne, se, sw],
  };

  return checkCaptureDirection(to, state, checks[piece]);
};

//
const makeMove = ({ from, to, state }) => {
  if (isNil(from) || isNil(to)) {
    return state;
  }

  // const { captures, turn } = state;
  let nextState = { ...state };
  const nextBoard = [...state.board];

  // Move
  const [fromx, fromy] = from;
  const [tox, toy] = to;
  nextBoard[toy][tox] = nextBoard[fromy][fromx];
  nextBoard[fromy][fromx] = EMPTY_SPACE;

  // dislike the duplication
  if (getDistance(from, to) === 2) {
    const [mx, my] = middleSpace(from, to);
    const opposingPlayer = getOpposingPlayer(state);
    nextBoard[my][mx] = EMPTY_SPACE;
    nextState.pieces[opposingPlayer]--;
  }

  nextState = setGameOver(nextState);
  nextState =
    canCapture(to, state) === false ? setNextTurn(nextState) : nextState;
  // KingMe?

  return {
    from,
    to,
    state: {
      ...nextState,
      board: nextBoard,
      captures: [],
      error: "",
    },
  };
};

//
const move = (state, from, to) =>
  validPlayer({ from, to, state })
    .chain(validSpace)
    .chain(validDirection)
    .chain(validDistance)
    .map(makeMove)
    .map(getSate)
    .get();

// GameState
const initialState = () => ({
  board: [
    [
      INVALID_SPACE,
      PLAYER_ONE,
      INVALID_SPACE,
      PLAYER_ONE,
      INVALID_SPACE,
      PLAYER_ONE,
      INVALID_SPACE,
      PLAYER_ONE,
    ],
    [
      PLAYER_ONE,
      INVALID_SPACE,
      PLAYER_ONE,
      INVALID_SPACE,
      PLAYER_ONE,
      INVALID_SPACE,
      PLAYER_ONE,
      INVALID_SPACE,
    ],
    [
      INVALID_SPACE,
      PLAYER_ONE,
      INVALID_SPACE,
      PLAYER_ONE,
      INVALID_SPACE,
      PLAYER_ONE,
      INVALID_SPACE,
      PLAYER_ONE,
    ],
    [
      EMPTY_SPACE,
      INVALID_SPACE,
      EMPTY_SPACE,
      INVALID_SPACE,
      EMPTY_SPACE,
      INVALID_SPACE,
      EMPTY_SPACE,
      INVALID_SPACE,
    ],
    [
      INVALID_SPACE,
      EMPTY_SPACE,
      INVALID_SPACE,
      EMPTY_SPACE,
      INVALID_SPACE,
      EMPTY_SPACE,
      INVALID_SPACE,
      EMPTY_SPACE,
    ],
    [
      PLAYER_TWO,
      INVALID_SPACE,
      PLAYER_TWO,
      INVALID_SPACE,
      PLAYER_TWO,
      INVALID_SPACE,
      PLAYER_TWO,
      INVALID_SPACE,
    ],
    [
      INVALID_SPACE,
      PLAYER_TWO,
      INVALID_SPACE,
      PLAYER_TWO,
      INVALID_SPACE,
      PLAYER_TWO,
      INVALID_SPACE,
      PLAYER_TWO,
    ],
    [
      PLAYER_TWO,
      INVALID_SPACE,
      PLAYER_TWO,
      INVALID_SPACE,
      PLAYER_TWO,
      INVALID_SPACE,
      PLAYER_TWO,
      INVALID_SPACE,
    ],
  ],
  turn: PLAYER_ONE,
  pieces: {
    [PLAYER_ONE]: 12,
    [PLAYER_TWO]: 12,
  },
  error: "",
  captures: [],
});

export { initialState, move };

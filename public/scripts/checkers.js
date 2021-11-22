import {
  compose,
  halve,
  head,
  last,
  map,
  path,
  pathEq,
  pathsEq,
  prop,
  propOr,
  reverse,
  reverseA2,
  sumPairs,
  Left,
  Right,
} from "./lib.js";

// Constants
const PLAYER_ONE = "P1";
const PLAYER_TWO = "P2";
const KING_ONE = "K1";
const KING_TWO = "K2";
const EMPTY_SPACE = "E";
const INVALID_SPACE = "X";
const SOUTH_WEST = "sw";
const SOUTH_EAST = "se";
const NORTH_WEST = "nw";
const NORTH_EAST = "ne";

// getDirection:: Coordinates -> Coordinates -> String
const getDirection = (() => {
  const DIRECTIONS = {
    "-11": NORTH_EAST,
    11: NORTH_WEST,
    "1-1": SOUTH_WEST,
    "-1-1": SOUTH_EAST,
  };

  return ([fx, fy], [tx, ty]) =>
    DIRECTIONS[[fx - tx, fy - ty].map(Math.sign).join("")] || null;
})();

// getNextPlayer:: String -> String
const getNextPlayer = reverseA2(prop)({
  [PLAYER_ONE]: PLAYER_TWO,
  [PLAYER_TWO]: PLAYER_ONE,
});

// getDirectionMethods:: String -> [Function]
const getDirectionMethods = (() => {
  const sw = ([x, y]) => [x - 1, y + 1];
  const se = ([x, y]) => [x + 1, y + 1];
  const nw = ([x, y]) => [x - 1, y - 1];
  const ne = ([x, y]) => [x + 1, y - 1];

  const PIECE_DIRECTIONS = {
    [PLAYER_ONE]: [sw, se],
    [PLAYER_TWO]: [ne, nw],
    [KING_ONE]: [nw, ne, se, sw],
    [KING_TWO]: [nw, ne, se, sw],
  };
  // Composition
  return (player) => PIECE_DIRECTIONS[player] || [];
})();

// getCurrentPlayer:: State -> String
const getCurrentPlayer = prop("turn");

// getOpposingPieces:: State -> [Pieces]
const getOpposingPieces = compose(
  reverseA2(propOr([]))({
    [PLAYER_ONE]: [PLAYER_TWO, KING_TWO],
    [PLAYER_TWO]: [PLAYER_ONE, KING_ONE],
  })
)(getCurrentPlayer);

// getPlayerPieces:: State -> [Pieces]
const getPlayerPieces = compose(
  reverseA2(propOr([]))({
    [PLAYER_ONE]: [PLAYER_ONE, KING_ONE],
    [PLAYER_TWO]: [PLAYER_TWO, KING_TWO],
  })
)(getCurrentPlayer);

// Helpers
// getState:: Object -> State
const getState = prop("state");

// getBoard:: State -> Board
const getBoard = prop("board");

// getOpposingPlayer:: State => String : P1 | P2
const getOpposingPlayer = compose(getNextPlayer)(getCurrentPlayer);

// getPiece:: Coordinates -> State -> String : X | E | P1 | P2 | K1 | K2
const getPiece = (coords, state) => path(["board", ...reverse(coords)])(state);

// getPieceMethods:: Coordinates -> State -> [Function]
const getPieceMethods = compose(getDirectionMethods)(getPiece);

// getMiddleSpace:: Coordinates -> Coordinates -> Coordinates
const getMiddleSpace = compose(map(halve))(sumPairs);

// inBounds:: Coordinates -> Boolean
const inBounds = (coord) =>
  coord.reduce((acc, val) => acc && val > -1 && val < 8, true);

// kingP1:: Board => Row
const kingP1 = compose(
  map((piece) => (piece === PLAYER_ONE ? KING_ONE : piece))
)(last);

// kingP2:: Board => Row
const kingP2 = compose(
  map((piece) => (piece === PLAYER_TWO ? KING_TWO : piece))
)(head);

// Lefts ----------
// invalidMove:: State -> Left(State)
const invalidMove = (state) =>
  Left({
    ...state,
    error: `Player attempted an invalid move`,
  });

// Predicates ----------
// isEmptySpace:: Coordinates -> State -> boolean
const isEmptySpace = (coord, state) =>
  pathEq(EMPTY_SPACE)(["board", ...reverse(coord)])(state);

// isOpponentDone:: State -> Boolean
const isOpponentDone = (state) =>
  pathEq(0)(["pieces", ...getOpposingPlayer(state)])(state);

// isTurnPiece:: Coordinates -> State -> Boolean
const isTurnPiece = (coord, state) =>
  getPlayerPieces(state).includes(getPiece(coord, state));

// isValidMoveDirection:: Coordinates -> Coordinates -> State -> Boolean
const isValidMoveDirection = (from, to, state) => {
  const VALID_MOVES = {
    [PLAYER_ONE]: [SOUTH_WEST, SOUTH_EAST],
    [PLAYER_TWO]: [NORTH_WEST, NORTH_EAST],
    [KING_ONE]: [SOUTH_WEST, SOUTH_EAST, NORTH_WEST, NORTH_EAST],
    [KING_TWO]: [SOUTH_WEST, SOUTH_EAST, NORTH_WEST, NORTH_EAST],
  };

  const piece = getPiece(from, state);
  const direction = getDirection(from, to);

  return VALID_MOVES[piece].includes(direction);
};

// isOpposingPiece: Coordinates -> State -> Boolean
const isOpposingPiece = (coord, state) =>
  getOpposingPieces(state).includes(getPiece(coord, state));

//
const canCapture = (to, state) => {
  const opposingPlayer = getOpposingPlayer(state);
  const isOtherPlayer = reverseA2(pathEq(opposingPlayer))(getBoard(state));
  const fns = getPieceMethods(to, state);

  for (let i = 0; i < fns.length; i++) {
    const nextSpace = fns[i];
    let next = nextSpace(to);
    if (inBounds(next) && isOtherPlayer(reverse(next))) {
      next = nextSpace(next);
      if (inBounds(next) && isEmptySpace(next, state)) {
        return true;
      }
    }
  }

  return false;
};

// Left/Right Operations ----------
const validPlayer = ({ from, to, state }) =>
  isTurnPiece(from, state)
    ? Right({ from, to, state })
    : Left({ ...state, error: `You may not move another player's piece.` });

const validDirection = ({ from, to, state }) =>
  isValidMoveDirection(from, to, state)
    ? Right({ from, to, state })
    : Left({
        ...state,
        error: `Player attempted a move piece in an invalid direction`,
      });

//
const validMove = ({ from, to, state }) => {
  const targetEmpty = isEmptySpace(to, state);
  const distance = Math.abs(from[1] - to[1]);
  const isCapture =
    distance === 2 && isOpposingPiece(getMiddleSpace(from, to), state);

  return targetEmpty && (distance === 1 || isCapture)
    ? Right({ from, to, state, distance })
    : invalidMove(state);
};

// This is making me think it's time to learn lenses.
const movePiece = ({ from, to, state }) => {
  const board = [...getBoard(state)];

  const [fromx, fromy] = from;
  const [tox, toy] = to;

  board[toy][tox] = board[fromy][fromx];
  board[fromy][fromx] = EMPTY_SPACE;

  return Right({ from, to, state: { ...state, board } });
};

// This is making me think it's time to learn lenses.
const captureMove = ({ from, to, state }) => {
  const opponent = getOpposingPlayer(state);
  const mid = getMiddleSpace(from, to);

  const board = [...getBoard(state)];
  board[mid[1]][mid[0]] = EMPTY_SPACE;
  const pieces = { ...state.pieces };
  pieces[opponent]--;

  return Right({ from, to, state: { ...state, board, pieces } });
};

//
const moreCaptures = ({ from, to, state }) =>
  canCapture(to, state) ? Left(state) : Right({ from, to, state });

//
const isWinner = ({ from, to, state }) =>
  isOpponentDone(state)
    ? Left({ ...state, winner: `${getCurrentPlayer(state)} wins!` })
    : Right({ from, to, state });

// Map Operations ----------
// nextTurn:: State -> State
const nextTurn = ({ state }) => ({
  state: { ...state, turn: getOpposingPlayer(state) },
});

// clearError:: State -> State
const clearError = ({ state }) => ({ state: { ...state, error: "" } });

// kingMe:: State -> State
const kingMe = ({ state }) => {
  const board = getBoard(state);

  return {
    state: {
      ...state,
      board: [kingP2(board), ...board.slice(1, 7), kingP1(board)],
    },
  };
};

// No more distance
const moveAndCapture = ({ from, to, state, distance }) =>
  distance === 1
    ? movePiece({ from, to, state }).map(kingMe).map(nextTurn).map(clearError)
    : captureMove({ from, to, state })
        .chain(movePiece)
        .chain(moreCaptures)
        .chain(isWinner)
        .map(kingMe)
        .map(nextTurn)
        .map(clearError);

//
const move = (state, from, to) =>
  validPlayer({ from, to, state })
    .chain(validDirection)
    .chain(validMove)
    .chain(moveAndCapture)
    .map(getState)
    .get();

// STATE
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
});

export { initialState, move };

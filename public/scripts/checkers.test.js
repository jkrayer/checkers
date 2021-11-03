import { expect, test } from "@jest/globals";
import { initialState, move } from "./checkers";

test("initialState returns a checkers boar in the start state", () => {
  expect(initialState()).toMatchObject({
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
});

test("move only allows the current player to move their own piece", () => {
  const state = move(initialState(), [0, 5], [1, 4]);

  expect(state.error).toBe("You may not move another player's piece.");
});

test("move only allows movement to an empty space", () => {
  const state = move(initialState(), [1, 2], [1, 3]);

  expect(state.error).toBe("A piece can only be moved to an empty space.");
});

test("move does not allow non-capturing moves longer than one space", () => {
  let state = move(initialState(), [1, 2], [3, 4]);

  expect(state.error).toBe(
    "Player attempted a move in an invalid direction or distace"
  );
});

test("move does not allow backward movement", () => {
  let state = move(
    {
      board: [
        ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
        ["P1", "X", "P1", "X", "P1", "X", "P1", "X"],
        ["X", "E", "X", "P1", "X", "P1", "X", "P1"],
        ["P1", "X", "E", "X", "E", "X", "E", "X"],
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
    },
    [0, 3],
    [1, 2]
  );

  expect(state.error).toBe(
    "Player attempted a move in an invalid direction or distace"
  );
});

test("move returns a new board when a valid move is requested", () => {
  const state = move(initialState(), [1, 2], [0, 3]);

  expect(state.board).toMatchObject([
    ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
    ["P1", "X", "P1", "X", "P1", "X", "P1", "X"],
    ["X", "E", "X", "P1", "X", "P1", "X", "P1"],
    ["P1", "X", "E", "X", "E", "X", "E", "X"],
    ["X", "E", "X", "E", "X", "E", "X", "E"],
    ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
    ["X", "P2", "X", "P2", "X", "P2", "X", "P2"],
    ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
  ]);
  expect(state.turn).toBe("P2");
});

test("move a valid move clears errors", () => {
  let state = move(initialState(), [0, 5], [1, 4]);

  expect(state.error).toBe("You may not move another player's piece.");

  state = move(state, [1, 2], [0, 3]);

  expect(state.error).toBe("");
});

test("move can make a single capture", () => {
  let state = {
    ...initialState(),
    board: [
      ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
      ["P1", "X", "P1", "X", "P1", "X", "P1", "X"],
      ["X", "E", "X", "E", "X", "P1", "X", "P1"],
      ["P1", "X", "P1", "X", "E", "X", "E", "X"],
      ["X", "P2", "X", "E", "X", "E", "X", "E"],
      ["E", "X", "P2", "X", "P2", "X", "P2", "X"],
      ["X", "P2", "X", "P2", "X", "P2", "X", "P2"],
      ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
    ],
    turn: "P2",
  };

  state = move(state, [1, 4], [3, 2]);

  expect(state).toMatchObject({
    board: [
      ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
      ["P1", "X", "P1", "X", "P1", "X", "P1", "X"],
      ["X", "E", "X", "P2", "X", "P1", "X", "P1"],
      ["P1", "X", "E", "X", "E", "X", "E", "X"],
      ["X", "E", "X", "E", "X", "E", "X", "E"],
      ["E", "X", "P2", "X", "P2", "X", "P2", "X"],
      ["X", "P2", "X", "P2", "X", "P2", "X", "P2"],
      ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
    ],
    turn: "P1",
    pieces: {
      P1: 11,
      P2: 12,
    },
    error: "",
    gameOver: "",
  });
});

test("the game is over when a player's last piece is captured", () => {
  let state = {
    ...initialState(),
    board: [
      ["X", "E", "X", "E", "X", "E", "X", "E"],
      ["E", "X", "E", "X", "E", "X", "E", "X"],
      ["X", "E", "X", "E", "X", "E", "X", "E"],
      ["E", "X", "P1", "X", "E", "X", "E", "X"],
      ["X", "P2", "X", "E", "X", "E", "X", "E"],
      ["E", "X", "P2", "X", "P2", "X", "P2", "X"],
      ["X", "P2", "X", "P2", "X", "P2", "X", "P2"],
      ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
    ],
    turn: "P2",
    pieces: {
      P1: 1,
      P2: 12,
    },
  };

  state = move(state, [1, 4], [3, 2]);

  expect(state).toMatchObject({
    board: [
      ["X", "E", "X", "E", "X", "E", "X", "E"],
      ["E", "X", "E", "X", "E", "X", "E", "X"],
      ["X", "E", "X", "P2", "X", "E", "X", "E"],
      ["E", "X", "E", "X", "E", "X", "E", "X"],
      ["X", "E", "X", "E", "X", "E", "X", "E"],
      ["E", "X", "P2", "X", "P2", "X", "P2", "X"],
      ["X", "P2", "X", "P2", "X", "P2", "X", "P2"],
      ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
    ],
    turn: "P1",
    pieces: {
      P1: 0,
      P2: 12,
    },
    error: "",
    gameOver: "Game Over Man",
  });
});

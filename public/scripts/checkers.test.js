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

test("move does not moves longer than one space", () => {
  let state = move(initialState(), [1, 2], [3, 4]);

  expect(state.error).toBe("Player attempted to move in an invalid direction");
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

  expect(state.error).toBe("Player attempted to move in an invalid direction");
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

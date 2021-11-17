import { expect, test } from "@jest/globals";
import { initialState, move } from "./checkers";

test("initialState returns a checkers board in the start state", () => {
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
  });
});

test("player may only move their own piece", () => {
  const state = move(initialState(), [0, 5], [1, 4]);
  expect(state.error).toBe("You may not move another player's piece.");
});

describe("single piece", () => {
  test("can't move backwards", () => {
    let state = move(initialState(), [1, 2], [0, 3]);
    state = move(state, [0, 5], [1, 4]);
    state = move(state, [0, 3], [1, 2]);

    expect(state).toMatchObject({
      board: [
        ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
        ["P1", "X", "P1", "X", "P1", "X", "P1", "X"],
        ["X", "E", "X", "P1", "X", "P1", "X", "P1"],
        ["P1", "X", "E", "X", "E", "X", "E", "X"],
        ["X", "P2", "X", "E", "X", "E", "X", "E"],
        ["E", "X", "P2", "X", "P2", "X", "P2", "X"],
        ["X", "P2", "X", "P2", "X", "P2", "X", "P2"],
        ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
      ],
      turn: "P1",
      pieces: {
        P1: 12,
        P2: 12,
      },
      error: "Player attempted a move piece in an invalid direction",
    });
  });

  test("can't move to an X", () => {
    const state = move(initialState(), [1, 2], [1, 3]);

    expect(state).toMatchObject({
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
      error: "Player attempted a move piece in an invalid direction",
    });
  });

  test("can't move > 2 spaces", () => {
    const state = move(
      {
        ...initialState(),
        board: [
          ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
          ["P1", "X", "P1", "X", "P1", "X", "P1", "X"],
          ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
          ["E", "X", "E", "X", "E", "X", "E", "X"],
          ["X", "E", "X", "E", "X", "E", "X", "E"],
          ["E", "X", "E", "X", "E", "X", "E", "X"],
          ["X", "E", "X", "E", "X", "E", "X", "E"],
          ["E", "X", "E", "X", "E", "X", "E", "X"],
        ],
      },
      [1, 2],
      [4, 5]
    );

    expect(state).toMatchObject({
      board: [
        ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
        ["P1", "X", "P1", "X", "P1", "X", "P1", "X"],
        ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
        ["E", "X", "E", "X", "E", "X", "E", "X"],
        ["X", "E", "X", "E", "X", "E", "X", "E"],
        ["E", "X", "E", "X", "E", "X", "E", "X"],
        ["X", "E", "X", "E", "X", "E", "X", "E"],
        ["E", "X", "E", "X", "E", "X", "E", "X"],
      ],
      turn: "P1",
      pieces: {
        P1: 12,
        P2: 12,
      },

      error: "Player attempted an invalid move",
    });
  });

  test("can't move 2 spaces without capture", () => {
    const state = move(initialState(), [1, 2], [3, 5]);

    expect(state).toMatchObject({
      ...initialState(),
      error: "Player attempted an invalid move",
    });
  });

  test("can't move to spot occupied by own piece", () => {
    const state = move(initialState(), [1, 0], [0, 1]);

    expect(state).toMatchObject({
      ...initialState(),
      error: "Player attempted an invalid move",
    });
  });

  test("can't move to spot occupied by opposing piece", () => {
    let state = move(initialState(), [1, 2], [0, 3]);
    state = move(state, [0, 5], [1, 4]);
    state = move(state, [0, 3], [1, 4]);

    expect(state).toMatchObject({
      board: [
        ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
        ["P1", "X", "P1", "X", "P1", "X", "P1", "X"],
        ["X", "E", "X", "P1", "X", "P1", "X", "P1"],
        ["P1", "X", "E", "X", "E", "X", "E", "X"],
        ["X", "P2", "X", "E", "X", "E", "X", "E"],
        ["E", "X", "P2", "X", "P2", "X", "P2", "X"],
        ["X", "P2", "X", "P2", "X", "P2", "X", "P2"],
        ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
      ],
      turn: "P1",
      pieces: {
        P1: 12,
        P2: 12,
      },
      error: "Player attempted an invalid move",
    });
  });

  test("can't capture by moving to an occupied spot", () => {
    let state = move(initialState(), [1, 2], [0, 3]);
    state = move(state, [0, 5], [1, 4]);
    state = move(state, [0, 3], [2, 5]);

    expect(state).toMatchObject({
      board: [
        ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
        ["P1", "X", "P1", "X", "P1", "X", "P1", "X"],
        ["X", "E", "X", "P1", "X", "P1", "X", "P1"],
        ["P1", "X", "E", "X", "E", "X", "E", "X"],
        ["X", "P2", "X", "E", "X", "E", "X", "E"],
        ["E", "X", "P2", "X", "P2", "X", "P2", "X"],
        ["X", "P2", "X", "P2", "X", "P2", "X", "P2"],
        ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
      ],
      turn: "P1",
      pieces: {
        P1: 12,
        P2: 12,
      },
      error: "Player attempted an invalid move",
    });
  });

  test("can move one", () => {
    const state = move(initialState(), [1, 2], [0, 3]);

    expect(state).toMatchObject({
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
      turn: "P2",
      pieces: {
        P1: 12,
        P2: 12,
      },
      error: "",
    });
  });

  test("can capture one", () => {
    let state = move(initialState(), [1, 2], [0, 3]);
    state = move(state, [0, 5], [1, 4]);
    state = move(state, [3, 2], [2, 3]);
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
    });
  });

  test("can capture several", () => {
    let state = move(initialState(), [1, 2], [0, 3]);
    state = move(state, [0, 5], [1, 4]);
    state = move(state, [3, 2], [2, 3]);
    state = move(state, [1, 4], [3, 2]);
    state = move(state, [7, 2], [6, 3]);
    state = move(state, [2, 5], [1, 4]);

    state = move(state, [4, 1], [2, 3]);
    state = move(state, [2, 3], [0, 5]);

    expect(state).toMatchObject({
      board: [
        ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
        ["P1", "X", "P1", "X", "E", "X", "P1", "X"],
        ["X", "E", "X", "E", "X", "P1", "X", "E"],
        ["P1", "X", "E", "X", "E", "X", "P1", "X"],
        ["X", "E", "X", "E", "X", "E", "X", "E"],
        ["P1", "X", "E", "X", "P2", "X", "P2", "X"],
        ["X", "P2", "X", "P2", "X", "P2", "X", "P2"],
        ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
      ],
      turn: "P2",
      pieces: {
        P1: 11,
        P2: 10,
      },
      error: "",
    });
  });

  test("can be kinged", () => {
    let state = {
      board: [
        ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
        ["P1", "X", "P1", "X", "E", "X", "P1", "X"],
        ["X", "E", "X", "E", "X", "P1", "X", "E"],
        ["P1", "X", "E", "X", "E", "X", "P1", "X"],
        ["X", "E", "X", "E", "X", "E", "X", "P2"],
        ["P1", "X", "P2", "X", "P2", "X", "E", "X"],
        ["X", "P2", "X", "P2", "X", "P2", "X", "P2"],
        ["P2", "X", "E", "X", "P2", "X", "P2", "X"],
      ],
      turn: "P1",
      pieces: {
        P1: 11,
        P2: 10,
      },
      error: "",
    };
    state = move(state, [0, 5], [2, 7]);

    expect(state).toMatchObject({
      board: [
        ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
        ["P1", "X", "P1", "X", "E", "X", "P1", "X"],
        ["X", "E", "X", "E", "X", "P1", "X", "E"],
        ["P1", "X", "E", "X", "E", "X", "P1", "X"],
        ["X", "E", "X", "E", "X", "E", "X", "P2"],
        ["E", "X", "P2", "X", "P2", "X", "E", "X"],
        ["X", "E", "X", "P2", "X", "P2", "X", "P2"],
        ["P2", "X", "K1", "X", "P2", "X", "P2", "X"],
      ],
      turn: "P2",
      pieces: {
        P1: 11,
        P2: 9,
      },
      error: "",
    });
  });
});

const kingBoard = () => ({
  board: [
    ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
    ["P1", "X", "P1", "X", "E", "X", "P1", "X"],
    ["X", "E", "X", "E", "X", "P1", "X", "E"],
    ["P1", "X", "E", "X", "E", "X", "P1", "X"],
    ["X", "E", "X", "E", "X", "E", "X", "P2"],
    ["E", "X", "P2", "X", "P2", "X", "E", "X"],
    ["X", "E", "X", "P2", "X", "P2", "X", "P2"],
    ["P2", "X", "K1", "X", "P2", "X", "P2", "X"],
  ],
  turn: "P1",
  pieces: {
    P1: 11,
    P2: 9,
  },
  error: "",
});

describe("king piece", () => {
  test("can't move to an X", () => {
    const state = move(kingBoard(), [2, 7], [2, 6]);

    expect(state).toMatchObject({
      ...kingBoard(),
      error: "Player attempted a move piece in an invalid direction",
    });
  });

  test("can't move > 2 spaces", () => {
    const state = move(
      {
        ...initialState(),
        board: [
          ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
          ["P1", "X", "P1", "X", "P1", "X", "P1", "X"],
          ["X", "K1", "X", "P1", "X", "P1", "X", "P1"],
          ["E", "X", "E", "X", "E", "X", "E", "X"],
          ["X", "E", "X", "E", "X", "E", "X", "E"],
          ["E", "X", "E", "X", "E", "X", "E", "X"],
          ["X", "E", "X", "E", "X", "E", "X", "E"],
          ["E", "X", "E", "X", "E", "X", "E", "X"],
        ],
      },
      [1, 2],
      [4, 5]
    );

    expect(state).toMatchObject({
      board: [
        ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
        ["P1", "X", "P1", "X", "P1", "X", "P1", "X"],
        ["X", "K1", "X", "P1", "X", "P1", "X", "P1"],
        ["E", "X", "E", "X", "E", "X", "E", "X"],
        ["X", "E", "X", "E", "X", "E", "X", "E"],
        ["E", "X", "E", "X", "E", "X", "E", "X"],
        ["X", "E", "X", "E", "X", "E", "X", "E"],
        ["E", "X", "E", "X", "E", "X", "E", "X"],
      ],
      turn: "P1",
      pieces: {
        P1: 12,
        P2: 12,
      },

      error: "Player attempted an invalid move",
    });
  });

  test("can't move 2 spaces without capture", () => {
    const state = move(kingBoard(), [2, 7], [0, 5]);

    expect(state).toMatchObject({
      ...kingBoard(),
      error: "Player attempted an invalid move",
    });
  });

  test("can't move to a spot occupied by own piece", () => {
    let state = kingBoard();
    state.board[2][1] = "K1";
    state = move(state, [1, 2], [0, 1]);

    expect(state.error).toBe("Player attempted an invalid move");
  });

  test("can't move to an occupied by opposing piece", () => {
    const state = move(kingBoard(), [2, 7], [3, 6]);

    expect(state).toMatchObject({
      ...kingBoard(),
      error: "Player attempted an invalid move",
    });
  });

  test("can't capture by moving to an occupied spot", () => {
    let state = move(kingBoard(), [2, 7], [4, 5]);

    expect(state).toMatchObject({
      ...kingBoard(),
      error: "Player attempted an invalid move",
    });
  });

  test("can't be kinged", () => {
    let state = move(kingBoard(), [2, 7], [1, 6]);
    state = move(state, [2, 5], [3, 4]);
    state = move(state, [1, 6], [2, 7]);

    expect(state).toMatchObject({
      ...kingBoard(),
      board: [
        ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
        ["P1", "X", "P1", "X", "E", "X", "P1", "X"],
        ["X", "E", "X", "E", "X", "P1", "X", "E"],
        ["P1", "X", "E", "X", "E", "X", "P1", "X"],
        ["X", "E", "X", "P2", "X", "E", "X", "P2"],
        ["E", "X", "E", "X", "P2", "X", "E", "X"],
        ["X", "E", "X", "P2", "X", "P2", "X", "P2"],
        ["P2", "X", "K1", "X", "P2", "X", "P2", "X"],
      ],
      turn: "P2",
    });
  });

  test("can move backwards", () => {
    let state = move(kingBoard(), [2, 7], [1, 6]);

    expect(state).toMatchObject({
      ...kingBoard(),
      board: [
        ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
        ["P1", "X", "P1", "X", "E", "X", "P1", "X"],
        ["X", "E", "X", "E", "X", "P1", "X", "E"],
        ["P1", "X", "E", "X", "E", "X", "P1", "X"],
        ["X", "E", "X", "E", "X", "E", "X", "P2"],
        ["E", "X", "P2", "X", "P2", "X", "E", "X"],
        ["X", "K1", "X", "P2", "X", "P2", "X", "P2"],
        ["P2", "X", "E", "X", "P2", "X", "P2", "X"],
      ],
      turn: "P2",
    });
  });

  test("can capture one", () => {
    let state = move(kingBoard(), [2, 7], [1, 6]);
    state = move(state, [4, 5], [5, 4]);
    state = move(state, [1, 6], [3, 4]);

    expect(state).toMatchObject({
      board: [
        ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
        ["P1", "X", "P1", "X", "E", "X", "P1", "X"],
        ["X", "E", "X", "E", "X", "P1", "X", "E"],
        ["P1", "X", "E", "X", "E", "X", "P1", "X"],
        ["X", "E", "X", "K1", "X", "P2", "X", "P2"],
        ["E", "X", "E", "X", "E", "X", "E", "X"],
        ["X", "E", "X", "P2", "X", "P2", "X", "P2"],
        ["P2", "X", "E", "X", "P2", "X", "P2", "X"],
      ],
      turn: "P2",
      pieces: {
        P1: 11,
        P2: 8,
      },
      error: "",
    });
  });

  test("can capture several", () => {
    let state = move(kingBoard(), [2, 7], [1, 6]);
    state = move(state, [5, 6], [6, 5]);
    state = move(state, [1, 6], [3, 4]);
    state = move(state, [3, 4], [5, 6]);

    expect(state).toMatchObject({
      board: [
        ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
        ["P1", "X", "P1", "X", "E", "X", "P1", "X"],
        ["X", "E", "X", "E", "X", "P1", "X", "E"],
        ["P1", "X", "E", "X", "E", "X", "P1", "X"],
        ["X", "E", "X", "E", "X", "E", "X", "P2"],
        ["E", "X", "E", "X", "E", "X", "P2", "X"],
        ["X", "E", "X", "P2", "X", "K1", "X", "P2"],
        ["P2", "X", "E", "X", "P2", "X", "P2", "X"],
      ],
      turn: "P2",
      pieces: {
        P1: 11,
        P2: 7,
      },
      error: "",
    });
  });
});

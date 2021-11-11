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
  });
});

test("valid player only allows the current player to move their own piece", () => {
  const state = move(initialState(), [0, 5], [1, 4]);
  expect(state.error).toBe("You may not move another player's piece.");
});

test("validSpace only allows movement to an empty space", () => {
  const state = move(initialState(), [1, 2], [1, 3]);
  expect(state.error).toBe("A piece can only be moved to an empty space.");
});

test("validDirection does not allow backward movement", () => {
  const state = move(
    {
      ...initialState(),
      board: [
        ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
        ["P1", "X", "E", "X", "P1", "X", "P1", "X"],
        ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
        ["E", "X", "E", "X", "E", "X", "E", "X"],
        ["X", "E", "X", "E", "X", "E", "X", "E"],
        ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
        ["X", "P2", "X", "P2", "X", "P2", "X", "P2"],
        ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
      ],
    },
    [1, 2],
    [2, 1]
  );

  expect(state.error).toBe(
    "Player attempted a move piece in an invalid direction"
  );
});

describe("validDistance", () => {
  it("allows a move equal to a single space", () => {
    let state = move(initialState(), [1, 2], [0, 3]);

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
  });

  it("does not allow a move equal to three spaces", () => {
    let state = move(
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

    expect(state.error).toBe(
      "Player attempted to move the piece an invalid distance"
    );
  });

  it("does not allow a move equal to two spaces", () => {
    let state = move(
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
      [3, 4]
    );

    expect(state.error).toBe(
      "Player attempted to move the piece an invalid distance"
    );
  });

  it("allows a capturing move", () => {
    const state = move(
      {
        ...initialState(),
        board: [
          ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
          ["P1", "X", "P1", "X", "P1", "X", "P1", "X"],
          ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
          ["E", "X", "P2", "X", "E", "X", "E", "X"],
          ["X", "E", "X", "E", "X", "E", "X", "E"],
          ["E", "X", "E", "X", "E", "X", "E", "X"],
          ["X", "E", "X", "E", "X", "E", "X", "E"],
          ["E", "X", "E", "X", "E", "X", "E", "X"],
        ],
      },
      [3, 2],
      [1, 4]
    );

    expect(state.board).toMatchObject([
      ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
      ["P1", "X", "P1", "X", "P1", "X", "P1", "X"],
      ["X", "P1", "X", "E", "X", "P1", "X", "P1"],
      ["E", "X", "E", "X", "E", "X", "E", "X"],
      ["X", "P1", "X", "E", "X", "E", "X", "E"],
      ["E", "X", "E", "X", "E", "X", "E", "X"],
      ["X", "E", "X", "E", "X", "E", "X", "E"],
      ["E", "X", "E", "X", "E", "X", "E", "X"],
    ]);
  });
});

test("a valid move clears errors", () => {
  let state = move(initialState(), [0, 5], [1, 4]);

  expect(state.error).toBe("You may not move another player's piece.");

  state = move(state, [1, 2], [0, 3]);

  expect(state.error).toBe("");
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
    turn: "P2",
    pieces: {
      P1: 0,
      P2: 12,
    },
    error: "",
    gameOver: "Game Over Man",
  });
});

test("the turn does not change when a capture can be made", () => {
  let state = {
    ...initialState(),
    board: [
      ["X", "E", "X", "E", "X", "E", "X", "E"],
      ["E", "X", "P1", "X", "P1", "X", "E", "X"],
      ["X", "P1", "X", "E", "X", "E", "X", "E"],
      ["E", "X", "E", "X", "E", "X", "E", "X"],
      ["X", "P1", "X", "E", "X", "E", "X", "E"],
      ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
      ["X", "P2", "X", "P2", "X", "P2", "X", "P2"],
      ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
    ],
    turn: "P2",
    pieces: {
      P1: 4,
      P2: 12,
    },
  };

  state = move(state, [0, 5], [2, 3]);

  expect(state).toMatchObject({
    board: [
      ["X", "E", "X", "E", "X", "E", "X", "E"],
      ["E", "X", "P1", "X", "P1", "X", "E", "X"],
      ["X", "P1", "X", "E", "X", "E", "X", "E"],
      ["E", "X", "P2", "X", "E", "X", "E", "X"],
      ["X", "E", "X", "E", "X", "E", "X", "E"],
      ["E", "X", "P2", "X", "P2", "X", "P2", "X"],
      ["X", "P2", "X", "P2", "X", "P2", "X", "P2"],
      ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
    ],
    turn: "P2",
    pieces: {
      P1: 3,
      P2: 12,
    },
    error: "",
  });

  state = move(state, [2, 3], [0, 1]);

  expect(state).toMatchObject({
    board: [
      ["X", "E", "X", "E", "X", "E", "X", "E"],
      ["P2", "X", "P1", "X", "P1", "X", "E", "X"],
      ["X", "E", "X", "E", "X", "E", "X", "E"],
      ["E", "X", "E", "X", "E", "X", "E", "X"],
      ["X", "E", "X", "E", "X", "E", "X", "E"],
      ["E", "X", "P2", "X", "P2", "X", "P2", "X"],
      ["X", "P2", "X", "P2", "X", "P2", "X", "P2"],
      ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
    ],
    turn: "P1",
    pieces: {
      P1: 2,
      P2: 12,
    },
    error: "",
  });
});

describe("king me", () => {
  it("kings a piece moved into the far row", () => {
    let state = {
      ...initialState(),
      board: [
        ["X", "E", "X", "E", "X", "E", "X", "E"],
        ["E", "X", "P1", "X", "P1", "X", "E", "X"],
        ["X", "P2", "X", "E", "X", "E", "X", "E"],
        ["E", "X", "P1", "X", "E", "X", "E", "X"],
        ["X", "P2", "X", "E", "X", "E", "X", "E"],
        ["E", "X", "P2", "X", "E", "X", "P2", "X"],
        ["X", "P2", "X", "P2", "X", "P2", "X", "P2"],
        ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
      ],
      turn: "P2",
      pieces: {
        P1: 3,
        P2: 12,
      },
    };

    state = move(state, [1, 2], [3, 0]);

    expect(state).toMatchObject({
      board: [
        ["X", "E", "X", "K2", "X", "E", "X", "E"],
        ["E", "X", "E", "X", "P1", "X", "E", "X"],
        ["X", "E", "X", "E", "X", "E", "X", "E"],
        ["E", "X", "P1", "X", "E", "X", "E", "X"],
        ["X", "P2", "X", "E", "X", "E", "X", "E"],
        ["E", "X", "P2", "X", "E", "X", "P2", "X"],
        ["X", "P2", "X", "P2", "X", "P2", "X", "P2"],
        ["P2", "X", "P2", "X", "P2", "X", "P2", "X"],
      ],
      turn: "P1",
      pieces: {
        P1: 2,
        P2: 12,
      },
      error: "",
    });
  });

  it("kings a piece and advances to the next turn", () => {
    let state = {
      ...initialState(),
      board: [
        ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
        ["E", "X", "E", "X", "E", "X", "E", "X"],
        ["X", "E", "X", "E", "X", "E", "X", "E"],
        ["E", "X", "E", "X", "E", "X", "E", "X"],
        ["X", "P2", "X", "E", "X", "E", "X", "E"],
        ["P1", "X", "P2", "X", "E", "X", "P2", "X"],
        ["X", "P2", "X", "P2", "X", "P2", "X", "P2"],
        ["P2", "X", "E", "X", "P2", "X", "P2", "X"],
      ],
      pieces: {
        P1: 5,
        P2: 10,
      },
    };

    state = move(state, [0, 5], [2, 7]);

    expect(state).toMatchObject({
      board: [
        ["X", "P1", "X", "P1", "X", "P1", "X", "P1"],
        ["E", "X", "E", "X", "E", "X", "E", "X"],
        ["X", "E", "X", "E", "X", "E", "X", "E"],
        ["E", "X", "E", "X", "E", "X", "E", "X"],
        ["X", "P2", "X", "E", "X", "E", "X", "E"],
        ["E", "X", "P2", "X", "E", "X", "P2", "X"],
        ["X", "E", "X", "P2", "X", "P2", "X", "P2"],
        ["P2", "X", "K1", "X", "P2", "X", "P2", "X"],
      ],
      turn: "P2",
      pieces: {
        P1: 5,
        P2: 9,
      },
      error: "",
    });
  });
});

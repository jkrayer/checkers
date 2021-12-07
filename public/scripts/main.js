import { move, initialState } from "/scripts/checkers.js";
import { toast } from "/scripts/Toast.js";

// Longer messages
const localToast = toast({ time: 3500 });

const dataToCoords = (str) => str.split(",").map((x) => parseInt(x, 10));

//
function getPosition(x, y) {
  const pos = (n) => n * 8 + 0.5;
  return `left:${pos(x)}vh; top:${pos(y)}vh;`;
}

// RENDER
const renderPiece = (p, x, y) => {
  // `<div draggable class="piece ${p}"></div>`
  const d = document.createElement("DIV");
  d.setAttribute("class", `piece ${p}`);
  d.setAttribute("draggable", "true");
  d.setAttribute("style", getPosition(x, y));
  d.dataset.from = [x, y];
  return d;
};

// State -> Board
const renderBoard = ({ board: sboard }) => {
  Array.from(board.getElementsByClassName("piece")).forEach((element) => {
    element.remove();
  });
  sboard.forEach((row, y) => {
    row.forEach((cell, x) => {
      !["X", "E"].includes(cell)
        ? board.appendChild(renderPiece(cell, x, y))
        : false;
    });
  });
};

// STATE :: let STATE = initialState();
const STATE = (function (initialState, callback) {
  let state = initialState;

  localToast(`New Game. ${state.turn} starts.`);
  callback(state);

  const pushState = (nextState) => {
    const { error, turn, winner } = nextState;

    if (winner) {
      localToast(winner);
      // and probably more
    } else if (error) {
      localToast(error);
    } else if (state.turn !== turn) {
      localToast(`${turn} goes!`);
    }

    state = nextState;
    callback(state);
  };

  return {
    pushState,
    getState: () => state,
  };
})(initialState(), renderBoard);

// EVENT LISTENERS
const addEventListeners = (board) => {
  //*** */
  const dragStart = (e) => {
    console.log("dragstart", e);
    e.dataTransfer.effectAllowed = "move";
    piece = e.target;
    dragging = true;
  };

  board.addEventListener("dragstart", dragStart);

  board.addEventListener("dragend", (e) => {
    console.log("dragend", e);
    // if (isSpace(e.target)) return false
  });

  board.addEventListener("dragover", (e) => {
    e.preventDefault();
    console.log("dragover", e);
    // if (isSpace(e.target)) return false
  });

  board.addEventListener("dragenter", (e) => {
    console.log("dragenter", e);
    // highlight potential drop target when the draggable element enters it
    // if (isSpace(event.target)) {
    //     console.log('dragenter', e)
    //     event.target.style.background = "purple";
    // }
  });

  board.addEventListener("dragleave", (e) => {
    console.log("dragleave", e);
    // reset background of potential drop target when the draggable element leaves it
    // if (isSpace(event.target)) {
    // event.target.style.background = "";
    // }
  });

  board.addEventListener("drop", (e) => {
    e.preventDefault();
    dragging = false;
    const from = dataToCoords(piece.dataset.from);
    const to = dataToCoords(e.target.dataset.to);

    // console.log(108, move(STATE, from, to));
    STATE.pushState(move(STATE.getState(), from, to));

    // renderBoard(STATE);
    // if (isSpace(e.target) && !isRow2(e.target)) {
    //   // event.target.style.background = "";
    //   piece.parentNode.removeChild(piece);
    //   event.target.appendChild(piece);
    //   piece = null;
    //   return true;
    // }
    // return false;
  });

  // return () => console.log("remove Event Listeners");
};

(function init() {
  addEventListeners(document.getElementById("board"));
})();

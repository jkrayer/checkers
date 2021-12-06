import { move, initialState } from "/scripts/checkers.js";

const sixtyFPS = 1000 / 30; // 60
let STATE = initialState();
const dataToCoords = (str) => str.split(",").map((x) => parseInt(x, 10));

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
function renderBoard({ board: sboard }) {
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
}

const step = (t1) => (t2) => {
  if (!dragging && t2 - t1 > sixtyFPS) {
    console.log("60fps");
    // state = next(state);
    renderBoard(STATE);
    window.requestAnimationFrame(step(t2));
  } else {
    window.requestAnimationFrame(step(t1));
  }
};

renderBoard(STATE);
// window.requestAnimationFrame(step(0));

board.addEventListener("dragstart", (e) => {
  console.log("dragstart", e);
  e.dataTransfer.effectAllowed = "move";
  piece = e.target;
  dragging = true;
});

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

  STATE = move(STATE, from, to);
  renderBoard(STATE);
  //   if (isSpace(e.target) && !isRow2(e.target)) {
  //     // event.target.style.background = "";
  //     piece.parentNode.removeChild(piece);
  //     event.target.appendChild(piece);
  //     piece = null;
  //     return true;
  //   }

  //   return false;
  // });
});

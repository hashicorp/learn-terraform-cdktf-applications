/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// https://tetris.fandom.com/wiki/Tetris_Guideline

// rotate an NxN matrix 90deg
// @see https://codereview.stackexchange.com/a/186834
function rotate(matrix) {
  const N = matrix.length - 1;
  const result = matrix.map((row, i) => row.map((val, j) => matrix[N - j][i]));

  return result;
}

// check to see if the new matrix/row/col is valid
function isValidMove(matrix, cellRow, cellCol) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (
        matrix[row][col] &&
        // outside the game bounds
        (cellCol + col < 0 ||
          cellCol + col >= playfield[0].length ||
          cellRow + row >= playfield.length ||
          // collides with another piece
          playfield[cellRow + row][cellCol + col])
      ) {
        return false;
      }
    }
  }

  return true;
}

// place the tetromino on the playfield
function placeTetromino() {
  let rowsCleared = 0;

  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {
        // game over if piece has any part offscreen
        if (tetromino.row + row < 0) {
          endGame();
          return showGameOver();
        }

        playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
      }
    }
  }

  // check for line clears starting from the bottom and working our way up
  for (let row = playfield.length - 1; row >= 0; ) {
    if (playfield[row].every((cell) => !!cell)) {
      rowsCleared++;

      // drop every row above this one
      for (let r = row; r >= 0; r--) {
        playfield[r] = playfield[r - 1];
      }
    } else {
      row--;
    }
  }

  if (rowsCleared) {
    updateScore(rowsCleared * rowsCleared);
  }

  loadNextTetromino();
}

// show the game over screen
function showGameOver() {
  cancelAnimationFrame(rAF);

  context.save();

  context.fillStyle = "black";
  context.globalAlpha = 0.75;
  context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);

  context.globalAlpha = 1;
  context.fillStyle = "white";
  context.font = "36px monospace";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2);

  context.restore();
}

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const grid = 32;

// keep track of what is in every cell of the game using a 2d array
// tetris playfield is 10x20, with a few rows offscreen
let playfield = [];

// how to draw each tetromino
// @see https://tetris.fandom.com/wiki/SRS
const tetrominos = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

// color of each tetromino
const colors = {
  I: "#623CE4",
  O: "#7C8797",
  T: "#00BC7F",
  S: "#CA2171",
  Z: "#1563ff",
  J: "#00ACFF",
  L: "white",
};

let count = 0;
let tetromino = null;
let rAF = null; // keep track of the animation frame so we can cancel it
let dropping = false;
let backendURL = "";
let gameState = null;

// game loop
function loop() {
  rAF = requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState.state == "new") {
    createGame();

    return;
  }

  if (gameState.state == "starting") {
    // Waiting for server to start game

    return;
  }

  // draw the playfield
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
      if (playfield[row][col]) {
        const name = playfield[row][col];
        context.fillStyle = colors[name];

        // drawing 1 px smaller than the grid creates a grid effect
        context.fillRect(col * grid, row * grid, grid - 1, grid - 1);
      }
    }
  }

  // draw the active tetromino
  if (tetromino) {
    if (dropping) { // Down arrow
      count += 35;
    }

    // tetromino falls every 35 frames
    if (++count > 35) {
      tetromino.row++;
      count = 0;

      // place piece if it runs into anything
      if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
        tetromino.row--;
        placeTetromino();
        dropping = false;
      }
    }

    context.fillStyle = colors[tetromino.name];

    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {
          // drawing 1 px smaller than the grid creates a grid effect
          context.fillRect(
            (tetromino.col + col) * grid,
            (tetromino.row + row) * grid,
            grid - 1,
            grid - 1
          );
        }
      }
    }
  }

  document.getElementById("score").textContent = gameState.score;
}

// listen to keyboard events to move the active tetromino
document.addEventListener("keydown", function (e) {
  if (gameState.state === "done") {
    // Restart
    startGameLoop();
    return;
  }

  if (!tetromino) {
    // Waiting on tetromino from server
    return;
  }

  // left and right arrow keys (move)
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    const col = e.key === "ArrowLeft" ? tetromino.col - 1 : tetromino.col + 1;

    if (isValidMove(tetromino.matrix, tetromino.row, col)) {
      tetromino.col = col;
    }
  }

  // up arrow key (rotate)
  if (e.key === "ArrowUp") {
    const matrix = rotate(tetromino.matrix);
    if (isValidMove(matrix, tetromino.row, tetromino.col)) {
      tetromino.matrix = matrix;
    }
  }

  // down arrow key (drop)
  if (e.key === "ArrowDown") {
    dropping = true;
  }
});

document.addEventListener("keyup", function (e) {
  // down arrow key (drop)
  if (e.key === "ArrowDown") {
    dropping = false;
  }
});

function displayError(e) {
  document.getElementById("errorMessage").style = "display: flow;";
};

function createGame() {
  // Create a new game. This should set gameState.state = "running".
  gameState.state = "starting";

  fetch(`${backendURL}/new`)
    .then((resp) => resp.json())
    .then((data) => { gameState = data.game; tetromino = makeTetromino(data.tetromino) })
    .catch((e) => { console.log(`Error: ${e}`); displayError(e)});
};

function makeTetromino(name) {
    const matrix = tetrominos[name];
  
    // I and O start centered, all others start in left-middle
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
  
    // I starts on row 21 (-1), all others start on row 22 (-2)
    const row = name === "I" ? -1 : -2;
  
    return {
      name: name, // name of the piece (L, O, etc.)
      matrix: matrix, // the current rotation matrix
      row: row, // current row (starts offscreen)
      col: col, // current col
    };
}

function loadNextTetromino() {
  fetch(`${backendURL}/next/${gameState.id}`)
    .then((resp) => resp.json())
    .then((data) => tetromino = makeTetromino(data.tetromino) )
    .catch((e) => { console.log(`Error: ${e}`); displayError(e)});
}

function updateScore(points) {
  // Update score by +points.

  fetch(`${backendURL}/score/${gameState.id}?points=${points}`, { method: 'POST' })
    .then((resp) => resp.json())
    .then((data) => gameState = data.game )
    .catch((e) => { console.log(`Error: ${e}`); displayError(e)});
};

function endGame() {
  // End the game.
  fetch(`${backendURL}/end/${gameState.id}`, { method: 'POST' })
    .then((resp) => resp.json())
    .then((data) => gameState = data.game )
    .catch((e) => { console.log(`Error: ${e}`); displayError(e)});
};

function startGameLoop() {
  // Start (or restart) game
  gameState = { state: "new", id: null, score: 0 };
  playfield = [];

  // populate the empty state
  for (let row = -2; row < 20; row++) {
    playfield[row] = [];

    for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0;
    }
  }

  rAF = requestAnimationFrame(loop);
}

function start(backend_url) {
  backendURL = backend_url;
  console.log("Backend: " + backendURL);

  startGameLoop();
};

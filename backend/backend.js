/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

"use strict";

const express = require("express");
const cors = require("cors");
const shortid = require("shortid");

const PORT = process.env.PORT || 80;
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
app.use(cors());

const games = {};

app.get("/", (req, res) => {
  res.send("Hello, NoCorp!");
});

// Create game
app.get("/new", (req, res) => {
  const gameID = shortid.generate();
  games[gameID] = {
    id: gameID,
    state: "running",
    score: 0,
    tetrominoSequence: [],
  };

  const response = { game: games[gameID], tetromino: getNextTetromino(games[gameID]) };
  res.send(JSON.stringify(response));
});

// get a random integer between the range of [min,max]
// @see https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// generate a new tetromino sequence
// @see https://tetris.fandom.com/wiki/Random_Generator
function generateSequence(game) {
  const tetrominos = ["I", "J", "L", "O", "S", "T", "Z"];

  while (tetrominos.length) {
    const rand = getRandomInt(0, tetrominos.length - 1);
    const name = tetrominos.splice(rand, 1)[0];
    game.tetrominoSequence.push(name);
  }
}

// get the next tetromino in the sequence
function getNextTetromino(game) {
  if (game.tetrominoSequence.length === 0) {
    generateSequence(game);
  }

  return game.tetrominoSequence.pop();
}

// Next tetromino
app.get("/next/:gameID", (req, res) => {
  const gameID = req.params.gameID;

  if (!games.hasOwnProperty(gameID)) {
    throw new Error(`Game "${gameID}" not found.`);
  }

  const response = { game: games[gameID], tetromino: getNextTetromino(games[gameID]) };
  res.send(JSON.stringify(response));
});

// Update score
app.post("/score/:gameID", (req, res) => {
  const gameID = req.params.gameID;

  if (!games.hasOwnProperty(gameID)) {
    throw new Error(`Game "${gameID}" not found.`);
  }

  if (!req.query.points) {
    throw new Error('Query param "points" not found.');
  }

  const points = parseInt(req.query.points, 10);
  games[gameID].score += points;

  const response = { game: games[gameID] };
  res.send(JSON.stringify(response));
});

// End game
app.post("/end/:gameID", (req, res) => {
  const gameID = req.params.gameID;

  if (!games.hasOwnProperty(gameID)) {
    throw new Error(`Game "${gameID}" not found.`);
  }

  games[gameID].state = "done";

  const response = { game: games[gameID] };
  res.send(JSON.stringify(response));
});

app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);

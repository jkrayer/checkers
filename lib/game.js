import crypto from "crypto";
import { isNil } from "./index.js";

// const id = crypto.randomBytes(16).toString("hex");
// console.log('crypto', id); // => f9b327e70bbcf42494ccb28b2d98e00

// I suspect that I don't need to do all this string conversion
// I think this can be just GAMES[id] = JSON.string
const GAMES = {};

const hasGame = (id) => isNil(GAMES[id]);

const getGameString = (id) => JSON.stringify(GAMES[id]);

const uniqueId = () => {
  const id = crypto.randomBytes(16).toString("checkers").substring(0, 5);

  return isNil(GAMES[id]) ? id : uniqueId();
};

const createGame = (gameData) => {
  const uuid = uniqueId();

  GAMES[uuid] = typeof gameData === "string" ? JSON.parse(gameData) : gameData;

  return JSON.stringify(GAMES[id]);
};

export { hasGame, getGameString, createGame };

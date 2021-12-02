import http from "http";
import path from "path";
import fs from "fs";
import { getContentType } from "./lib/index.js";
// import { hasGame } from "./lib/game.js";

const PORT = 8080;
const resource = /jpg|png|gif|js|css$/;

const server = http.createServer(async (req, res) => {
  const file = path.resolve(`./public${req.url}`);

  if (resource.test(file)) {
    fs.open(file, (err) => {
      if (err === null) {
        res.writeHead(200, {
          "Content-Type": getContentType(path.extname(file)),
        });
        fs.createReadStream(file, "utf-8").pipe(res);
      } else {
        res.writeHead(404);
        res.end();
      }
    });
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(path.resolve("./public/index.html"), "utf-8").pipe(res);
  }
});

server.listen(PORT, "127.0.0.1");
console.log("Server listening to ", PORT);

// else if (/game\/[a-zA-Z0-9]{5,5}/.test(req.url)) {
//     const gameId = req.url.slice(-5);

//     if (hasGame(gameId)) {
//       res.writeHead(200, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ game: "g" }));
//     } else {
//       res.writeHead(404);
//       res.end();
//     }
//   }

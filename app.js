import http from "http";
import path from "path";
import fs from "fs";
import { getContentType } from "./lib/index.js";
// import { hasGame } from "./lib/game.js";

const PORT = 8080;
const resource = /jpg|png|gif|js|css$/;
const isApi = (str) => /^\/?api/.test(str);

const server = http.createServer(async (req, res) => {
  if (resource.test(req.url)) {
    const file = path.resolve(`./public${req.url}`);

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
  } else if (isApi(req.url)) {
    console.log("this is api", req.url);
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(path.resolve("./public/index.html"), "utf-8").pipe(res);
  }
});

server.listen(PORT, "127.0.0.1");
console.log("Server listening to ", PORT);

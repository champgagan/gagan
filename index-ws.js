const express = require("express");
const { WebSocketServer } = require("ws");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);

server.listen(3000, function () {
  console.log(`server started 3000`);
});

/** Begin websocket */

process.on("SIGINT", () => {
  server.close(() => {
    shutdownDB();
  });
});

const webSocketServer = require("ws").server;
const wss = new WebSocketServer({ server: server });

wss.on("connection", function connection(ws) {
  const numClients = wss.clients.size;
  console.log("Clients connected", numClients);
  wss.broadcast(`Current visitors: ${numClients}`);
  if (ws.readyState === ws.OPEN) {
    ws.send("welcome to my server");
  }

  db.run(`INSERT INTO visitors (count,time)
   VALUES (${numClients},datetime('now'))
  `);

  ws.on("close", function close() {
    console.log("A client has disconnected");
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");

db.serialize(() => {
  db.run(`
   CREATE TABLE visitors (
     count INTEGER,
     time TEXT
   )
 `);
});

function getCounts() {
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log(row);
  });
}

function shutdownDB() {
  getCounts();
  console.log(`sutting down db`);
  db.close();
}

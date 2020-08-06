const WebSocket = require('ws');
const express = require('express');
const path = require('path');

const wss = new WebSocket.Server({ port: 3001 });

const app = express();
const port = 3000;

const allSockets = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const handleMessage = (msg) => {
  console.log("Recebi do cliente", msg);

  for (let ws of allSockets) {
    console.log('Mandando ', msg);
    ws.send(msg);
  }
};

wss.on("connection", (ws) => {
  console.log("Conectaram");

  allSockets.push(ws);

  ws.on("message", handleMessage);
});

// app.use(express.static('public'));

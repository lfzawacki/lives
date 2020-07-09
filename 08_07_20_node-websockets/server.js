
const WebSocket = require('ws')
const uuid = require('uuid');

const path = require('path')

const express = require('express')
const app = express()
const port = 1337

app.use(express.static('public'));

const wss = new WebSocket.Server({ port: 6969 });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const parseMessage = (msgStr) => {
  let obj = {};
  try {
    obj = JSON.parse(msgStr);
  } catch (e) {
    console.warn('Bad message', e);
  }
  return obj;
}

let presenter = null;

const sendMessage = (ws, msgObj) => {
  ws.send(JSON.stringify(msgObj))
}

const handleMessage = (msgStr) => {
  const msg = parseMessage(msgStr);

  switch (msg.id) {

    // User joined as viewer/presenter
    case 'join':
      // Decide who is presenter
      if (!presenter) {
          console.log(msg.authToken, 'is the presenter');
          presenter = msg.authToken;
      }
      break;

    default:
      break;
  }
}

const sockets = {};

wss.on('connection', (ws, request) => {
  console.log("New connection");

  // Send authentication token to connected user
  const authToken = uuid.v4();
  sendMessage(ws, {id: 'authToken', data: authToken});

  // Store connected user socket
  sockets[authToken] = ws;

  ws.on('message', handleMessage);
})

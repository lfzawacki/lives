
var websocket = new WebSocket("ws://localhost:6969")
var authToken = null;

function sendMessage(ws, msgObj) {
  ws.send(JSON.stringify(msgObj));
}

function parseMessage(msgStr) {

  var obj = {};
  try {
    obj = JSON.parse(msgStr);
  } catch (e) {
    console.warn('Bad message', e);
  }

  return obj;
}

function handleMessage(msg) {
  switch (msg.id) {
    case 'authToken':
      console.log('Got auth', msg.data);
      authToken = msg.data;

      sendMessage(websocket, {id: 'join', authToken: authToken});
      break;
    default:
      console.log('Invalid message', msg);
      break;
  }
}

websocket.onmessage = function(msg) {
  handleMessage(parseMessage(msg.data));
}

websocket.onopen = function() {
  console.log('opa conectei')
}

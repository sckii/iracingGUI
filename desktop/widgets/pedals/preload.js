const { contextBridge, ipcRenderer } = require("electron")
const { WebSocket } = require("ws")

let response = JSON.stringify({ 
  "break": 1.0, 
  "throttle": 0.0, 
  "gear": [4],
  "speed": 0.003385438583791256,
  "clutch": 0.0,
  "playerCarMyIncidentCount": 0,
  "sessionFlags": 269746688,
  "sessionLapsTotal": 32767,
  "sessionLapsRemainEx": 32767,
  "sessionTime": 4272.3666668158 
})

function requestPedals() {
  msg = { event: 'pedals' };
  ws_send(msg);
  return response;
}

contextBridge.exposeInMainWorld("api", {
  getCurrentDeltaTime: (path) => requestPedals(path)
})

function ws_send(msg) {
  if (true) {
    // if ws is not open call open_ws, which will call ws_send back
    if (typeof (ws) == 'undefined' || ws.readyState === undefined || ws.readyState > 1) {
      open_ws(msg);
    } else {
      ws.send(JSON.stringify(msg));
      // console.log("ws_send sent");
    }
  }
}

function open_ws(msg) {
  if (typeof (ws) == 'undefined' || ws.readyState === undefined || ws.readyState > 1) {
    // websocket on same server with address /websocket
    ws = new WebSocket("ws://localhost:8888/websocket");

    ws.onopen = function () {
      // Web Socket is connected, send data using send()
      // console.log("ws open");
      if (msg.length != 0) {
        ws_send(msg);
      }
    };

    ws.onmessage = function (evt) {
      var received_msg = evt.data;
      response = received_msg
      msg = JSON.parse(evt.data)

      if (msg.event == "x") {
        return received_msg
      } else if (msg.event == 'y') {
        // process message y
      } else if (msg.event == 'z') {
        // process message z
      }
    };

    ws.onclose = function () {
      // websocket is closed, re-open
      console.log("Connection is closed... reopen");
      var msg = { event: 'register', };
      setTimeout(function () { ws_send(msg); }, 1000);
    };
  }
}

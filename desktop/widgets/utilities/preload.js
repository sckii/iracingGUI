const { contextBridge, ipcRenderer } = require("electron")
const { WebSocket } = require("ws")

let response = JSON.stringify({
  "fuelLevel": 0, 
  "fuelLevelPct": 0, 
  "tires": {
    "RRtempCL": 0, 
    "RRtempCM": 0, 
    "RRtempCR": 0, 
    "RRwearL": 0, 
    "RRwearM": 0, 
    "RRwearR": 0, 
    "RFtempCL": 0, 
    "RFtempCM": 0,
    "RFtempCR": 0, 
    "RFwearL": 0, 
    "RFwearM": 0, 
    "RFwearR": 0, 
    "LRtempCL": 0,
    "LRtempCM": 0,
    "LRtempCR": 0,
    "LRwearL": 0,
    "LRwearM": 0,
    "LRwearR": 0,
    "LFtempCL": 0,
    "LFtempCM": 0,
    "LFtempCR": 0,
    "LFwearL": 0,
    "LFwearM": 0,
    "LFwearR": 0}
  })

function getDeltaTime() {
  msg = { event: 'utilities' };
  ws_send(msg);
  return response;
}

contextBridge.exposeInMainWorld("api", {
  getCurrentDeltaTime: (path) => getDeltaTime(path)
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

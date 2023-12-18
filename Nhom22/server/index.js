const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const mqtt = require("mqtt");
const mqttClient = mqtt.connect("mqtt://localhost:1883");

const server = require("http").createServer(app);
const WebSocket = require("ws");

const wss = new WebSocket.Server({
  server: server,
});

const Sensor = require("./src/models/sensor.model");
const Action = require("./src/models/action.model");

state1 = { device_id: "led1", status: "" };
state2 = { device_id: "led2", status: "" };

wss.on("connection", function connection(ws) {
  console.log("Client Connected");
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ state1: state1, state2: state2 }));
    }
  });
  ws.on("message", (message) => {
    var data = JSON.parse(message.toString());
    Action.insertData(data, (result) => {
      console.log(result);
    });
    mqttClient.publish("actionSub", JSON.stringify(data));
  });
  ws.on("close", () => {
    console.log("Client Disconnected");
  });
});

mqttClient.on("message", (topic, message) => {
  if (topic === "sensorPub") {
    Sensor.insertData(JSON.parse(message.toString()), (result) => {
      console.log(result);
    });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  }
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      if (JSON.parse(message.toString()).device_id == "led1") {
        state1.status = JSON.parse(message.toString()).status;
      }
      if (JSON.parse(message.toString()).device_id == "led2") {
        state2.status = JSON.parse(message.toString()).status;
      }
      client.send(JSON.stringify({ state1: state1, state2: state2 }));
    }
  });
});

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("sensorPub");
  mqttClient.subscribe("actionPub");
});

require("./src/routes/sensor.route")(app);
require("./src/routes/action.route")(app);

server.listen(3000, () => {
  console.log("http://localhost:3000");
});

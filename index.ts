import { WebSocketServer } from "ws";
import MessageManager from "./MessageManager.js";

const wss = new WebSocketServer({ port: 8080 });
const messageManager = new MessageManager(wss);

wss.on("connection", function connection(ws) {
  onAfterConnection(ws);

  ws.on("message", (data) => onMessage(ws, data));

  ws.on("close", () => onClose(ws));
});

function onAfterConnection(ws: any) {
  messageManager.handleWelcome(ws);
}

function onMessage(ws: any, data: any) {
  messageManager.handleMessage(ws, data);
}

function onClose(ws: any) {
  messageManager.handleClose(ws);
}

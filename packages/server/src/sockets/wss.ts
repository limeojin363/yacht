import WebSocket from "ws";
import { wss } from "..";

let sockets: Record<string, WebSocket> = {};

wss.on("connection", (ws, req) => {
  const wsKey = req.headers["sec-websocket-key"];
  if (!wsKey) return;

  sockets[wsKey] = ws;

  // Closing handshake
  ws.on("close", () => {
    delete sockets[wsKey];
  });

  wss.clients.forEach((client) => {});

  ws.on("message", (message) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("user-interaction", () => {})
});

import { Server } from "socket.io";
import onConnection from "./handlers/index.js";

export const registerSocket = (server: Express.Application) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "https://shiny-space-capybara-q5v4qxjx6vx3x75g-5173.app.github.dev",
      ],
      methods: ["GET", "POST"],
    },
  });

  io.of("/game-default", onConnection);
};

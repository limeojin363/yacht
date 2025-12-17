// import { Server } from "socket.io";
// import defaultGameConnectionHandler from "./handlers/default-game/index.js";
// import gameConnectionHandler from "./handlers/game/connect.js";

// export const registerSocket = (server: Express.Application) => {
//   const io = new Server(server, {
//     cors: {
//       origin: [
//         "https://shiny-space-capybara-q5v4qxjx6vx3x75g-5173.app.github.dev",
//       ],
//       methods: ["GET", "POST"],
//     },
//   });

//   io.of("/game-default", defaultGameConnectionHandler);
//   io.of("/game", gameConnectionHandler);
// };

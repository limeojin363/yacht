import { getGameInfo, type ConnectionInfo } from "./index.js";
import { PrismaClient } from "@prisma/client";

const exitHandler =
  ({ userId, gameId, socket }: ConnectionInfo) =>
  async () => {
    console.log("exit received", { userId, gameId });
    try {
      const prismaClient = new PrismaClient();

      const { progressType } = await getGameInfo(gameId);

      if (progressType === 2) throw new Error("Game has already ended");

      if (progressType === 1) {
        console.log("Game interrupted due to player exit", { userId, gameId });
        socket.emit("game-interrupted", { userId });
        socket.to(String(gameId)).emit("game-interrupted", { userId });
        socket.to(String(gameId)).disconnectSockets();
        socket.disconnect();

        await prismaClient.game.delete({
          where: { id: gameId },
        });

        await prismaClient.user.updateMany({
          where: { gameId },
          data: {
            gameId: null,
            gamePlayerId: null,
            gamePlayerColor: null,
            gameConnected: 0,
          },
        });
      }

      if (progressType === 0) {
        socket.to(String(gameId)).emit("player-exited", { userId });
        await prismaClient.user.update({
          where: { id: userId },
          data: {
            gameId: null,
            gamePlayerId: null,
            gamePlayerColor: null,
            gameConnected: 0,
          },
        });
      }
    } catch (error) {
      console.log(error);
      socket.leave(String(gameId));
      socket.disconnect();
    }
  };

export default exitHandler;

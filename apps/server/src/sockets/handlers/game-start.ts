import { getGameInfo, type ConnectionInfo } from "./index.js";
import { getUser } from "../../auths/middleware.js";
import { PrismaClient } from "@prisma/client";

const gameStartHandler =
  ({ gameId, socket, userId }: ConnectionInfo) =>
  async () => {
    console.log("game-start received", { userId, gameId });

    try {
      const user = await getUser(userId);
      const game = await getGameInfo(gameId);

      if (user.gameId !== gameId) {
        throw new Error("User is not in this game");
      }

      if (user.authorityLevel !== 0) {
        throw new Error("User is not the admin");
      }

      if (game.progressType !== 0) {
        throw new Error("Game is already in progress");
      }

      const prismaClient = new PrismaClient();
      await prismaClient.game.update({
        where: { id: gameId },
        data: { progressType: 1 },
      });

      socket.to(String(gameId)).emit("game-start");
    } catch (error) {
      console.log("game-start error", error);
    }
  };

export default gameStartHandler;

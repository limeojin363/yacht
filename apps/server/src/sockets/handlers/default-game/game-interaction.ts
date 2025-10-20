import {
  getUpdatedGameStatus,
  isGameFinished,
  UserActionSchema,
  type UserAction,
} from "@yacht/default-game";
import { getGameInfo, type ConnectionInfo } from "./index.js";
import { getUser } from "../../../auths/middleware.js";
import { PrismaClient } from "@prisma/client";

const gameInteractionHandler =
  ({ gameId, socket, userId }: ConnectionInfo) =>
  async (param: object) => {
    console.log("game-interaction received", { userId, gameId });
    let action: UserAction;

    try {
      action = UserActionSchema.parse(param);
    } catch (error) {
      console.error("Invalid action:", error);
      return;
    }

    try {
      const prismaClient = new PrismaClient();

      const user = await getUser(userId);
      const game = await getGameInfo(gameId);

      if (game.progressType === 0) throw new Error("Game has not started yet");

      if (game.progressType === 2) throw new Error("Game has already ended");

      if (user.gameId !== gameId) throw new Error("User is not in this game");

      socket.emit("game-interaction", action);
      socket.to(String(gameId)).emit("game-interaction", action);

      const nextGameStatus = getUpdatedGameStatus(game.gameStatus)(action);
      await prismaClient.game.update({
        where: { id: gameId },
        data: { gameStatus: JSON.stringify(nextGameStatus) },
      });

      if (isGameFinished(nextGameStatus)) {
        await prismaClient.game.update({
          where: { id: gameId },
          data: { progressType: 2 },
        });

        await prismaClient.user.updateMany({
          where: { gameId },
          data: {
            gameId: null,
            gamePlayerId: null,
            gamePlayerColor: null,
            gameConnected: 0,
          }
        })

        socket.to(String(gameId)).emit("game-ended");
      }
    } catch (error) {
      console.log("game-interaction error", error);
    }
  };

export default gameInteractionHandler;

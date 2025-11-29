import { defaultEndpointsFactory } from "express-zod-api";
import { userCheckMiddleWare } from "../../auths/middleware.js";
import {
  GenerateGameReqBodySchema,
  GenerateGameResBodySchema,
  type ProgressType,
} from "@yacht/communications";
import { getInitialGameStatus } from "@yacht/default-game";
import { PrismaClient } from "../../generated/client.js";

export const generateGameEndpoint = defaultEndpointsFactory
  .addMiddleware(userCheckMiddleWare)
  .build({
    input: GenerateGameReqBodySchema,
    output: GenerateGameResBodySchema,
    method: "post",
    handler: async ({ input: { name, totalPlayersNum } }) => {
      console.log(1234);
      const prismaClient = new PrismaClient();
      const rawGameStatus = getInitialGameStatus(totalPlayersNum);
      const gameStatusJSON = JSON.stringify(rawGameStatus);
      const progressType: ProgressType = 0;

      const { id } = await prismaClient.game.create({
        data: {
          gameStatus: gameStatusJSON,
          progressType,
          name,
        },
      });

      return {
        gameStatus: rawGameStatus,
        progressType,
        id,
        name,
      };
    },
  });

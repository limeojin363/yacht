import { defaultEndpointsFactory } from "express-zod-api";
import { userCheckMiddleWare } from "../../auths/middleware.js";
import {
  GenerateGameReqBodySchema,
  GenerateGameResBodySchema,
  ProgressTypeSchema,
} from "@yacht/communications";
import { GameStatusSchema, getInitialGameStatus } from "@yacht/default-game";
import { PrismaClient } from "@prisma/client";
import z from "zod";

export const generateGameEndpoint = defaultEndpointsFactory
  .addMiddleware(userCheckMiddleWare)
  .build({
    input: GenerateGameReqBodySchema,
    output: GenerateGameResBodySchema,
    method: "post",
    handler: async ({ input: { name, totalPlayersNum } }) => {
      const prismaClient = new PrismaClient();
      const { progressType, id, gameStatus } = await prismaClient.game.create({
        data: {
          gameStatus: JSON.stringify(getInitialGameStatus(totalPlayersNum)),
          progressType: 0,
          name,
        },
      });

      return {
        gameStatus: GameStatusSchema.parse(gameStatus),
        progressType: ProgressTypeSchema.parse(progressType),
        id,
        name,
      };
    },
  });

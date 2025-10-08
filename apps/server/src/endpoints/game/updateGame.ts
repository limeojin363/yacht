import { defaultEndpointsFactory } from "express-zod-api";
import { adminCheckMiddleWare } from "../../auths/middleware.js";
import {
  UpdateGameReqBodySchema,
  UpdateGameResBodySchema,
} from "@yacht/communications";
import { GameStatusSchema, getInitialGameStatus } from "@yacht/default-game";
import { PrismaClient } from "@prisma/client";

export const updateGameEndpoint = defaultEndpointsFactory
  .addMiddleware(adminCheckMiddleWare)
  .build({
    input: UpdateGameReqBodySchema,
    output: UpdateGameResBodySchema,
    method: "patch",
    handler: async ({ input: { id, name, totalPlayersNum } }) => {
      const prismaClient = new PrismaClient();
      const game = await prismaClient.game.findUnique({
        where: { id },
      });

      if (!game) {
        throw new Error("Game not found");
      }

      if (game.progressType !== 0) {
        throw new Error(
          "Cannot update a game that is in progress or completed"
        );
      }

      const { gameStatus: rawGameStatus } = await prismaClient.game.update({
        where: { id },
        data: {
          name,
          gameStatus: JSON.stringify(getInitialGameStatus(totalPlayersNum)),
        },
      });

      const nextGameStatus = GameStatusSchema.parse(
        JSON.parse(rawGameStatus as string)
      );

      return {
        id,
        name,
        gameStatus: nextGameStatus,
        progressType: 0 as const,
      };
    },
  });

import { defaultEndpointsFactory } from "express-zod-api";
import { adminCheckMiddleWare } from "../../auths/middleware.js";
import {
  UpdateGameReqBodySchema,
  UpdateGameResBodySchema,
} from "@yacht/communications";
// import { GameStatusSchema, getInitialGameStatus } from "@yacht/default-game";
import { PrismaClient } from "../../generated/client.js";

export const updateGameEndpoint = defaultEndpointsFactory
  .addMiddleware(adminCheckMiddleWare)
  .build({
    input: UpdateGameReqBodySchema,
    output: UpdateGameResBodySchema,
    method: "patch",
    handler: async ({ input: { id, name } }) => {
      const prismaClient = new PrismaClient();
      const game = await prismaClient.game.findUnique({
        where: { id },
      });

      if (!game) {
        throw new Error("Game not found");
      }

      if (game.progressType !== 0) {
        throw new Error(
          "Cannot update a game that is in progress or completed",
        );
      }

      const { gameCoreInfo: rawGameStatus } = await prismaClient.game.update({
        where: { id },
        data: {
          name,
          gameCoreInfo: JSON.stringify({}
            // getInitialGameStatus(totalPlayersNum)
          ),
        },
      });

      return {
        id,
        name,
        gameCoreInfo: {} as any,
        progressType: 0 as const,
      };
    },
  });

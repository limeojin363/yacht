import { defaultEndpointsFactory } from "express-zod-api";
import { userCheckMiddleWare } from "../../auths/middleware.js";
import z from "zod";
import {
  GetGameListResBodySchema,
  type GetGameListResBody,
} from "@yacht/communications";
import { PrismaClient } from "@prisma/client";

export const gameListEndpoint = defaultEndpointsFactory
  .addMiddleware(userCheckMiddleWare)
  .build({
    input: z.object({}),
    output: GetGameListResBodySchema,
    method: "get",
    handler: async () => {
      console.log(123)
      const prismaClient = new PrismaClient();
      const gamesFromDB = await prismaClient.game.findMany({
        where: {
          progressType: 0,
        },
        include: {
          players: true,
        },
      });

      const gameList: GetGameListResBody = {
        games: gamesFromDB.map(({ id, name, players }) => ({
          id,
          name,
          players: players.map(({ id, name }) => ({ id, name })),
        })),
      };

      return gameList;
    },
  });

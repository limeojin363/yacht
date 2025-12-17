import { defaultEndpointsFactory } from "express-zod-api";
import { userCheckMiddleWare } from "../../auths/middleware.js";
import z from "zod";
import {
  GetGameListResBodySchema,
  type GameMetaItem,
} from "@yacht/communications";
import { PrismaClient } from "../../generated/client.js";

export const gameListEndpoint = defaultEndpointsFactory
  .addMiddleware(userCheckMiddleWare)
  .build({
    input: z.object({}),
    output: GetGameListResBodySchema,
    method: "get",
    handler: async () => {
      const prismaClient = new PrismaClient();
      const gamesFromDB = await prismaClient.game.findMany({
        where: {
          progressType: 0,
        },
        include: {
          players: true,
        },
      });

      const gameList: z.infer<typeof GetGameListResBodySchema> = {
        list: gamesFromDB.map(
          ({ id, name, players }): z.infer<typeof GameMetaItem> => ({
            id,
            name,
            playersMeta: { current: players.length, total: 4 },
          })
        ),
      };

      return gameList;
    },
  });

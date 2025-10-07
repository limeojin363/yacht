import { defaultEndpointsFactory } from "express-zod-api";
import { adminCheckMiddleWare } from "../../auths/middleware";
import {
  DeleteGameReqBodySchema,
  DeleteGameResBodySchema,
} from "@yacht/communications";
import { PrismaClient } from ".prisma/client";

export const deleteGameEndpoint = defaultEndpointsFactory
  .addMiddleware(adminCheckMiddleWare)
  .build({
    input: DeleteGameReqBodySchema,
    output: DeleteGameResBodySchema,
    method: "delete",
    handler: async ({ input: { id } }) => {
      const prismaClient = new PrismaClient();
      await prismaClient.game.delete({
        where: { id },
      });

      return {};
    },
  });

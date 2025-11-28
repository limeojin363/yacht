import { defaultEndpointsFactory } from "express-zod-api";
import { adminCheckMiddleWare } from "../../auths/middleware.js";
import { DeleteGameResBodySchema } from "@yacht/communications";
import z from "zod";
import { PrismaClient } from "../../generated/client.js";

export const deleteGameEndpoint = defaultEndpointsFactory
  .addMiddleware(adminCheckMiddleWare)
  .build({
    input: z.object({
      id: z.string(),
    }),
    output: DeleteGameResBodySchema,
    method: "delete",
    handler: async ({ input: { id } }) => {
      console.log({ id });
      const prismaClient = new PrismaClient();
      await prismaClient.game.delete({
        where: { id: Number(id) },
      });

      return {};
    },
  });

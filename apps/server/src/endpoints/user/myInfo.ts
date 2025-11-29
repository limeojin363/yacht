import {
  AuthorityLevelSchema,
  GetMyInfoReqBodySchema,
  GetMyInfoResBodySchema,
} from "@yacht/communications";
import { defaultEndpointsFactory } from "express-zod-api";
import { userCheckMiddleWare } from "../../auths/middleware.js";
import { PrismaClient } from "../../generated/client.js";

const myInfoEndpoint = defaultEndpointsFactory
  .addMiddleware(userCheckMiddleWare)
  .build({
    method: "get",
    input: GetMyInfoReqBodySchema,
    output: GetMyInfoResBodySchema,
    handler: async ({ options: { id } }) => {
      const prismaClient = new PrismaClient();
      const user = await prismaClient.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const { authorityLevel, gameId, gamePlayerId, name: username } = user;

      const parsedAuthorityLevel = AuthorityLevelSchema.parse(authorityLevel);

      return {
        id,
        authorityLevel: parsedAuthorityLevel,
        gameId,
        gamePlayerId,
        username,
      };
    },
  });

export default myInfoEndpoint;

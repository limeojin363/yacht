import {
  AuthorityLevelSchema,
  GetMyInfoReqBodySchema,
  GetMyInfoResBodySchema,
} from "@yacht/communications";
import { defaultEndpointsFactory } from "express-zod-api";
import { PrismaClient } from "@prisma/client";

const myInfoEndpoint = defaultEndpointsFactory.build({
  method: "get",
  input: GetMyInfoReqBodySchema,
  output: GetMyInfoResBodySchema,
  handler: async () => {
    const prismaClient = new PrismaClient();
    const user = await prismaClient.user.findUnique({
      where: { id: 1 },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const { id, authorityLevel, gameId, gamePlayerId, name: username } = user;

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

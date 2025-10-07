import { AuthorityLevelSchema, LoginReqBodySchema, LoginResBodySchema } from "@yacht/communications";
import { defaultEndpointsFactory } from "express-zod-api";
import createHttpError from "http-errors";
import { createHashedPassword } from "../../auths/hash";
import { generateAccessToken, generateRefreshToken } from "../../auths/token";
import { PrismaClient } from ".prisma/client";

const loginEndpoint = defaultEndpointsFactory.build({
  method: "post",
  input: LoginReqBodySchema,
  output: LoginResBodySchema,
  handler: async ({ input: { username, password: plainPassword } }) => {
    const prismaClient = new PrismaClient();
    const user = await prismaClient.user.findUnique({
      where: { name: username },
    });
    if (!user) throw createHttpError(401, "Invalid username or password");

    const {
      salt,
      password: hashedPasswordOnDB,
      id,
      authorityLevel,
      gameId,
      gamePlayerId,
      name,
    } = user;

    const isCorrectPassword =
      hashedPasswordOnDB === (await createHashedPassword(plainPassword, salt));
    if (!isCorrectPassword) {
      throw createHttpError(401, "Invalid username or password");
    }

    const accessToken = generateAccessToken(id);
    const refreshToken = generateRefreshToken(id);

    return {
      accessToken,
      refreshToken,
      user: {
        authorityLevel: AuthorityLevelSchema.parse(authorityLevel),
        gameId: gameId,
        gamePlayerId: gamePlayerId,
        id,
        username: name,
      },
    };
  },
});

export default loginEndpoint;

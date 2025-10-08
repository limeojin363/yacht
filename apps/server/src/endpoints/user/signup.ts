import {
  SignupReqBodySchema,
  SignupResBodySchema,
} from "@yacht/communications";
import { defaultEndpointsFactory } from "express-zod-api";
import { createHashedPassword, createSalt } from "../../auths/hash.js";
import { generateAccessToken, generateRefreshToken } from "../../auths/token.js";
import { PrismaClient } from "@prisma/client";

const signupEndpoint = defaultEndpointsFactory.build({
  method: "post",
  input: SignupReqBodySchema,
  output: SignupResBodySchema,
  handler: async ({ input: { username, password: plainPassword } }) => {
    const prismaClient = new PrismaClient();

    const salt = await createSalt();
    const hashedPassword = await createHashedPassword(plainPassword, salt);

    const { id } = await prismaClient.user.create({
      data: {
        name: username,
        authorityLevel: 2,
        password: hashedPassword,
        salt: salt,
      },
    });

    const accessToken = generateAccessToken(id);
    const refreshToken = generateRefreshToken(id);

    return {
      accessToken,
      refreshToken,
      user: {
        authorityLevel: 2 as const,
        username,
        gameId: null,
        gamePlayerId: null,
        id,
      },
    };
  },
});

export default signupEndpoint;

import createHttpError from "http-errors";
import { Middleware } from "express-zod-api";
import z from "zod";
import jwt from "jsonwebtoken";
import { AuthorityLevelSchema } from "@yacht/communications";
import { PlayerIdSchema } from "@yacht/default-game";
import { PrismaClient } from "@prisma/client";

const getAuthorizationFromRequest = (request: {
  headers: { authorization?: string };
}) => {
  const authorization = request.headers["authorization"];
  if (!authorization) throw createHttpError(401, "No authorization header");
  return authorization;
};

export const getUserId = (authorization: string) => {
  const token = authorization.split(" ")[1];
  if (!token) throw createHttpError(401, "No token provided");

  try {
    const decodedInfo = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    );
    const { userId } = SchemaOf.DecodedInfo.parse(decodedInfo);

    return userId;
  } catch (error) {
    console.error(error);
    throw createHttpError(401, "Invalid or Expired token");
  }
};

export const getUser = async (userId: number) => {
  const prismaClient = new PrismaClient();
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
  });
  if (!user) throw createHttpError(401, "User not found");

  return SchemaOf.User.parse(user);
};

export const userCheckMiddleWare = new Middleware({
  handler: async ({ request }) => {
    const authorization = getAuthorizationFromRequest(request);
    const userId = getUserId(authorization);
    const user = await getUser(userId);

    return user;
  },
});

export const adminCheckMiddleWare = new Middleware({
  handler: async (obj) => {
    const user = await userCheckMiddleWare.execute(obj);

    if (user.authorityLevel !== 0) {
      throw createHttpError(403, "You are not an admin");
    }

    return { user };
  },
});

const SchemaOf = {
  DecodedInfo: z.object({
    userId: z.number(),
  }),
  User: z.object({
    id: z.number(),
    name: z.string(),
    password: z.string(),
    authorityLevel: AuthorityLevelSchema,
    salt: z.string(),
    gameId: z.number().nullable(),
    gameConnected: z.number().nullable(),
    gamePlayerId: PlayerIdSchema.nullable(),
    gamePlayerColor: z.string().nullable(),
  }),
};

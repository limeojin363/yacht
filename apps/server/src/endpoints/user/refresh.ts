import {
  RefreshReqBodySchema,
  RefreshResBodySchema,
} from "@yacht/communications";
import { defaultEndpointsFactory } from "express-zod-api";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../auths/token.js";
import z from "zod";

const refreshEndpoint = defaultEndpointsFactory.build({
  method: "post",
  input: RefreshReqBodySchema,
  output: RefreshResBodySchema,
  handler: async ({ input: { refreshToken: prevRefreshToken } }) => {
    let userId: number;
    try {
      const decodedInfo = jwt.verify(
        prevRefreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
      );
      ({ userId } = SchemaOf.DecodedInfo.parse(decodedInfo));
    } catch (error) {
      console.error(error);
      throw createHttpError(401, "Invalid or Expired token");
    }

    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    return {
      accessToken,
      refreshToken,
    };
  },
});

const SchemaOf = {
  DecodedInfo: z.object({
    userId: z.number(),
  }),
};

export default refreshEndpoint;

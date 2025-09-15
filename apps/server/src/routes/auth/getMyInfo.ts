import type { RequestHandler } from "express";
import type { GetMyInfoReqBody, GetMyInfoResBody } from "@yacht/communications";
import verifyAuthHeader from "../../auths/verifyUser";

const getMyInfo: RequestHandler<
  {},
  GetMyInfoResBody,
  GetMyInfoReqBody | { message: string }
> = async (req, res) => {
    const { authority_level, g_connected, username } = await verifyAuthHeader(req.headers["authorization"]);

    res.status(200).json({
      id: 1,
      username,
      authority_level,
      g_connected: Boolean(g_connected),
      g_id: null,
    });
};

export default getMyInfo;

import type { RequestHandler } from "express";
import type { GetMyInfoReqBody, GetMyInfoResBody } from "@yacht/communications";
import verifyAuthHeader from "../../auths/verifyUser";

const getMyInfo: RequestHandler<
  {},
  GetMyInfoResBody,
  GetMyInfoReqBody | { message: string }
> = async (req, res) => {
    const { authority_level, g_playerId, username, g_id } = await verifyAuthHeader(req.headers["authorization"]);

    res.status(200).json({
      id: 1,
      username,
      authority_level,
      g_playerId,
      g_id,
    });
};

export default getMyInfo;

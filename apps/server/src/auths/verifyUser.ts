import z from "zod";
import jwt from "jsonwebtoken";
import { pool } from "../index.js";

const SchemaOf = {
  AuthHeader: z.string().regex(/^Bearer\s+(\S+)$/),
  DecodedInfo: z.object({
    userId: z.number(),
  }),
  UserRows: z.array(
    z.object({
      id: z.number(),
      username: z.string(),
      password: z.string(),
      authority_level: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
      g_id: z.number().nullable(),
      g_playerId: z.number().nullable(),
      g_playerColor: z.string().nullable(),
      salt: z.string(),
    })
  ),
};

// HTTP 요청 / socket 통신에서 이용 가능한 범용 util
const verifyAuthHeader = async (
  authHeader: string | undefined,
) => {
  const authResult = SchemaOf.AuthHeader.safeParse(authHeader);
  if (!authResult.success) {
    throw new Error("Invalid authorization header");
  }

  const token = authResult.data.split(" ")[1]!;
  const decodedInfo = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string
  );
  const decodeInfoResult = SchemaOf.DecodedInfo.parse(decodedInfo);

  const { userId } = decodeInfoResult;
  const [rows] = await pool.query("SELECT * FROM `users` WHERE `id` = ?", [
    userId,
  ]);
  const userInfoResult = SchemaOf.UserRows.safeParse(rows);
  if (!userInfoResult.success) throw new Error("User not found");

  const userInfo = userInfoResult.data[0]!;

  return userInfo;
};

export default verifyAuthHeader;

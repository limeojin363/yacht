import z from "zod";
import jwt from "jsonwebtoken";
import { pool } from "../index.js";

const SchemaOf = {
  AuthHeader: z.string().regex(/^Bearer\s+(\S+)$/),
  DecodedInfo: z.object({
    userId: z.string(),
  }),
  UserRows: z.array(
    z.object({
      id: z.number(),
      username: z.string(),
      password: z.string(),
      authority_level: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
      g_id: z.number().nullable(),
      g_connected: z.number().min(0).max(2),
      salt: z.string(),
    })
  ),
};

// HTTP 요청 / socket 통신에서 이용 가능한 범용 util
const verifyAuthHeader = async (
  authHeader: string | undefined,
  isAdmin?: boolean
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
  const decodeInfoResult = SchemaOf.DecodedInfo.safeParse(decodedInfo);
  if (!decodeInfoResult.success) {
    throw new Error("Invalid access token payload");
  }

  const { userId } = decodeInfoResult.data;
  const [rows] = await pool.query("SELECT * FROM `users` WHERE `id` = ?", [
    userId,
  ]);
  const userInfoResult = SchemaOf.UserRows.safeParse(rows);
  if (!userInfoResult.success) throw new Error("User not found");

  const userInfo = userInfoResult.data[0]!;

  if (userInfo!.authority_level !== 0 && isAdmin)
    throw new Error("User is not admin");

  return userInfo;
};

export default verifyAuthHeader;

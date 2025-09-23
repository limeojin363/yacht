import { type RequestHandler } from "express";
import z from "zod";
import { pool } from "../../index.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../auths/token.js";
import { createHashedPassword } from "../../auths/hash.js";
import {
  type LoginReqBody,
  type LoginResBody,
  LoginReqBodySchema,
} from "@yacht/communications";

export const ZUserRows = z.array(
  z.object({
    id: z.number(),
    username: z.string(),
    password: z.string(),
    authority_level: z.number().min(0).max(3),
    salt: z.string(),
    g_connected: z.number().min(0).max(2),
    g_id: z.number().nullable(),
  })
);

export const login: RequestHandler<
  {},
  | unknown
  | {
      message: string;
    },
  LoginReqBody
> = async (req, res) => {
  const result = LoginReqBodySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const { username, password: plainPassword } = result.data;

  const [rows] = await pool.query(
    "SELECT * FROM `users` WHERE `username` = ?",
    [username]
  );

  console.log(rows);

  const parsed = ZUserRows.safeParse(rows);
  if (!parsed.success)
    return res.status(401).json({ message: "Invalid user data" });

  const { salt, password, id, g_connected, authority_level, g_id } =
    parsed.data[0]!;

  if (password === (await createHashedPassword(plainPassword, salt))) {
    // If we reach this point, the user is authenticated
    const accessToken = generateAccessToken(id);
    const refreshToken = generateRefreshToken(id);
    const userInfoForResponse = {
      id,
      username,
      g_connected: Boolean(g_connected),
      authority_level,
      g_id,
    };
    res.status(200).json({ accessToken, refreshToken, user: userInfoForResponse });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
};

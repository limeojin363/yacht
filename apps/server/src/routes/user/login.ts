import { type RequestHandler } from "express";
import z from "zod";
import { pool } from "../../index.js";
import { createHashedPassword } from "./signup.js";
import { generateAccessToken, generateRefreshToken } from "../../auths/auth.js";

const ZLoginReqBody = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(20),
});

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

export const login: RequestHandler = async (req, res) => {
  const result = ZLoginReqBody.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Invalid request body", error: result.error });
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

  const { salt, password, id } = parsed.data[0]!;
  if (password === (await createHashedPassword(plainPassword, salt))) {
    // If we reach this point, the user is authenticated
    const accessToken = generateAccessToken(id);
    const refreshToken = generateRefreshToken(id);
    res
      .status(200)
      .json({ message: "Login successful", accessToken, refreshToken });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
};

// import { type RequestHandler } from "express";
// import { pool } from "../../index.js";
// import { createHashedPassword, createSalt } from "../../auths/hash.js";
// import {
//   type SignupReqBody,
//   type SignupResBody,
//   SignupReqBodySchema,
// } from "@yacht/communications";
// import z from "zod";
// import {
//   generateAccessToken,
//   generateRefreshToken,
// } from "../../auths/token.js";

// export const ZUserRows = z.array(
//   z.object({
//     id: z.number(),
//     username: z.string(),
//     password: z.string(),
//     authority_level: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
//     salt: z.string(),
//     g_playerId: z.number().nullable(),
//     g_id: z.number().nullable(),
//   })
// );

// export const signup: RequestHandler<
//   {},
//   | SignupResBody
//   | {
//       message: string;
//     },
//   SignupReqBody
// > = async (req, res) => {
//   const result = SignupReqBodySchema.safeParse(req.body);
//   if (!result.success) {
//     return res.status(400).json({ message: "Invalid request body" });
//   }

//   const { username, password: plainPassword } = result.data;

//   const salt = await createSalt();
//   const hashedPassword = await createHashedPassword(plainPassword, salt);

//   await pool.query(
//     "INSERT INTO `users`(`username`,`password`,`authority_level`,`salt`) VALUES(?, ?, ?, ?)",
//     [username, hashedPassword, 2, salt]
//   );

//   const [rows] = await pool.query(
//     "SELECT * FROM `users` WHERE `username` = ?",
//     [username]
//   );

//   const parsed = ZUserRows.safeParse(rows);
//   if (!parsed.success)
//     return res.status(401).json({ message: "Invalid user data" });

//   const { id, g_playerId, authority_level, g_id } = parsed.data[0]!;

//   const accessToken = generateAccessToken(id);
//   const refreshToken = generateRefreshToken(id);
//   const userInfoForResponse = {
//     id,
//     username,
//     g_playerId,
//     authority_level,
//     g_id,
//   };

//   res
//     .status(200)
//     .json({ accessToken, refreshToken, user: userInfoForResponse });
// };

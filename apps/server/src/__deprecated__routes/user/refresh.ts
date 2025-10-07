// import { type RequestHandler } from "express";
// import jwt from "jsonwebtoken";
// import z from "zod";
// import {
//   generateAccessToken,
//   generateRefreshToken,
// } from "../../auths/token.js";
// import type {
//   RefreshReqBody,
//   RefreshResBody,
// } from "@yacht/communications";

// const ZReqBody = z.object({
//   refreshToken: z.string(),
// });

// const ZUser = z.object({
//   id: z.number(),
// });

// export const refresh: RequestHandler<
//   {},
//   RefreshResBody | { message: string },
//   RefreshReqBody
// > = (req, res) => {
//   const body = ZReqBody.safeParse(req.body);
//   if (!body.success) {
//     return res.status(400).json({ message: "Invalid request body" });
//   }

//   const { refreshToken } = body.data;

//   jwt.verify(
//     refreshToken,
//     process.env.REFRESH_TOKEN_SECRET as string,
//     (err, payload) => {
//       if (err) return res.sendStatus(403); // Invalid token

//       const user = ZUser.safeParse(payload);
//       if (!user.success) return res.sendStatus(403); // Invalid token

//       const accessToken = generateAccessToken(user.data.id);
//       const refreshToken = generateRefreshToken(user.data.id);

//       res.status(200).json({ accessToken, refreshToken });
//     }
//   );
// };

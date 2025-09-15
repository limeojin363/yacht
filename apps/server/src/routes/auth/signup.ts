import { type RequestHandler } from "express";
import { pool } from "../../index.js";
import { createHashedPassword, createSalt } from "../../auths/hash.js";
import {
  type SignupReqBody,
  type SignupResBody,
  SignupReqBodySchema,
} from "@yacht/communications";

export const signup: RequestHandler<
  {},
  | SignupResBody
  | {
      message: string;
    },
  SignupReqBody
> = async (req, res) => {
  const result = SignupReqBodySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const { username, password: plainPassword, authorityLevel } = result.data;

  const salt = await createSalt();
  const hashedPassword = await createHashedPassword(plainPassword, salt);

  await pool.query(
    "INSERT INTO `users`(`username`,`password`,`authorityLevel`,`salt`) VALUES(?, ?, ?, ?)",
    [username, hashedPassword, authorityLevel, salt]
  );

  res.status(201).json({ message: "signup successful!" });
};

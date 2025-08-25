import { RequestHandler } from "express";
import { pool } from "..";
import z from "zod";
import crypto from "crypto";

const SignupReqBody = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(20),
  authorityLevel: z.number().min(0).max(3),
});

const createSalt = (): Promise<string> =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (err) reject(err);
      resolve(buf.toString("base64"));
    });
  });

export const createHashedPassword = (
  plainPassword: string,
  salt: string
): Promise<string> =>
  new Promise(async (resolve, reject) => {
    crypto.pbkdf2(plainPassword, salt, 9999, 64, "sha512", (err, key) => {
      if (err) reject(err);
      resolve(key.toString("base64"));
    });
  });

export const signup: RequestHandler = async (req, res) => {
  const result = SignupReqBody.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Invalid request body", error: result.error });
  }

  const { username, password: plainPassword, authorityLevel } = result.data;

  const salt = await createSalt();
  const hashedPassword = await createHashedPassword(plainPassword, salt);

  await pool.query(
    "INSERT INTO `users`(`username`,`password`,`authorityLevel`,`salt`) VALUES(?, ?, ?, ?)",
    [username, hashedPassword, authorityLevel, salt]
  );

  res.status(201).json({message: "signup successful!"})
};

import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import dotenv from "dotenv";

dotenv.config();

// user identify middleware
export const verifyAccessToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err) => {
    if (err) return res.sendStatus(403); // Invalid token
    next();
  });
};

export const generateAccessToken = (userId: number): string => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '2h' });
};

// Refresh Token 생성
export const generateRefreshToken = (userId: number): string => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' }); // 예: 7일 만료
};

import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "2h",
  });
};

export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d",
  });
};

import { type RequestHandler } from "express";
import verifyAuthHeader from "../../auths/verifyUser";
import { pool } from "../../index";
import { getInitialGameStatus } from "@yacht/default-game";
import {
  GenerateGameReqBodySchema,
  type GenerateGameReqBody,
  type GenerateGameResBody,
} from "@yacht/communications";

const getReqBodyInfo = (body: unknown) => {
  const result = GenerateGameReqBodySchema.parse(body);
  return result;
};

export const generateGame: RequestHandler<
  unknown,
  GenerateGameResBody | { message: string },
  GenerateGameReqBody
> = async (req, res) => {
  try {
    const { authority_level } = await verifyAuthHeader(
      req.headers["authorization"]
    );
    if (authority_level !== 0) throw new Error("User is not admin");

    const { totalPlayers } = getReqBodyInfo(req.body);

    pool.query(`INSERT INTO games (gameObject, inProgress) VALUES (?, ?)`, [
      getInitialGameStatus(totalPlayers),
      0
    ]);
    res.status(201).json({ message: "Game created successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error" });
  }
};

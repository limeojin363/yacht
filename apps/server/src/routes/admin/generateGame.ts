import { RequestHandler } from "express";
import verifyAuthHeader from "../../auths/verifyUser";
import { pool } from "../..";
import { getInitialGameStatus } from "@yacht/games/default";
import z from "zod";

const SchemaOf = {
  ReqBody: z.object({
    totalPlayers: z.union([z.literal(2), z.literal(3), z.literal(4)]),
  }),
};

const getReqBodyInfo = (body: unknown) => {
  const result = SchemaOf.ReqBody.safeParse(body);
  if (!result.success) {
    throw new Error("Invalid request body");
  }
  return result.data;
};

export const generateGame: RequestHandler = async (req, res) => {
  try {
    await verifyAuthHeader(req.headers["authorization"], true);
    const { totalPlayers } = getReqBodyInfo(req.body);

    pool.query(`INSERT INTO games (gameObject, inProgress) VALUES (?, ?)`, [
      getInitialGameStatus(totalPlayers),
      req.body.inProgress,
    ]);
    res.status(201).json({ message: "Game created successfully" });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error });
  }
};

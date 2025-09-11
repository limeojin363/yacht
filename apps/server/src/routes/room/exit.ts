import { type RequestHandler } from "express";
import z from "zod";
import verifyAuthHeader from "../../auths/verifyUser.js";
import { pool } from "../../index.js";

export const exitTheGame: RequestHandler = async (req, res) => {
  try {
    const { id: userId, g_connected } = await verifyAuthHeader(
      req.headers["authorization"]
    );
    if (g_connected)
      throw new Error("Please disconnect from the current game first.");

    const ReqBodyResult = SchemaOf.ReqBody.safeParse(req.body);
    if (!ReqBodyResult.success) {
      throw new Error("Invalid request body");
    }
    const { gameId } = ReqBodyResult.data;

    await FromDB.check(userId, gameId);
    await FromDB.deleteEnterInfo(userId, gameId);
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const FromDB = {
  check: async (userId: number, gameId: number) => {
    const [rows1] = await pool.query(
      `SELECT * FROM users_games WHERE user_id = ? AND game_id = ? LIMIT 1`,
      [userId, gameId]
    );

    if (!(rows1 instanceof Array)) throw new Error("Query Error");

    if (rows1.length === 0)
      throw new Error("User is not connected to the game");

    return "OK";
  },
  deleteEnterInfo: async (userId: number, gameId: number) => {
    await pool.query(
      `DELETE FROM users_games WHERE user_id = ? AND game_id = ?`,
      [userId, gameId]
    );

    return "OK";
  },
};

const SchemaOf = {
  ReqBody: z.object({
    gameId: z.number(),
  }),
};

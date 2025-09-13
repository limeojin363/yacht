import { type RequestHandler } from "express";
import z from "zod";
import verifyAuthHeader from "../../auths/verifyUser.js";
import { pool } from "../../index.js";
import { GameStatusSchema } from "@yacht/default-game";

export const enterTheGame: RequestHandler = async (req, res) => {
  try {
    const { id: userId, g_connected } = await verifyAuthHeader(req.headers["authorization"]);
    if (g_connected) throw new Error("Already connected to a game");

    const ReqBodyResult = SchemaOf.ReqBody.safeParse(req.body);
    if (!ReqBodyResult.success) {
      throw new Error("Invalid request body");
    }
    const { gameId } = ReqBodyResult.data;

    await FromDB.check(userId, gameId);
    await FromDB.setConnection(userId, gameId);

  } catch (error) {
    return res.status(400).json({ error });
  }
};

const SchemaOf = {
  ReqBody: z.object({
    gameId: z.number(),
  }),
  CheckQuery2: z.tuple([
    z.object({
      id: z.number(),
      gameObject: GameStatusSchema,
      inProgress: z.number().min(0).max(1),
    }),
  ]),
};

const FromDB = {
  // 확인해야 할 것 목록
  // 1. 유저가 이미 게임에 연결되어 있지는 않은가: users_games 테이블
  // 2. 게임이 존재하는가: games 테이블
  check: async (userId: number, gameId: number) => {
    const [rows1] = await pool.query(
      `SELECT * FROM users_games WHERE user_id = ? LIMIT 1`,
      [userId]
    );

    if (rows1 instanceof Array && rows1.length > 0)
      throw new Error("User is already connected to a game");

    const [rows2] = await pool.query(
      `SELECT * FROM games WHERE id = ? LIMIT 1`,
      [gameId]
    );

    const parseResult2 = SchemaOf.CheckQuery2.safeParse(rows2);
    if (!parseResult2.success) {
      throw new Error("Non-existent game");
    }

    return "OK";
  },
  setConnection: async (userId: number, gameId: number) => {
    await pool.query(
      `INSERT INTO users_games (user_id, game_id) VALUES (?, ?)`,
      [userId, gameId]
    );
  },
};

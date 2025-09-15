import { type RequestHandler } from "express";
import z from "zod";
import { pool } from "../../index.js";
import type {
  GetGamesReqBody,
  GetGamesResBody,
} from "@yacht/communications";

export const getGames: RequestHandler<
  {},
  any,
  GetGamesReqBody
> = async (req, res) => {
  try {
    const rows = await FromDB.getRows();
    console.log(rows)
    res.status(200).json({ games: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const SchemaOf = {
  Rows: z.array(
    z.object({
      id: z.number(),
      in_progress: z.number().min(0).max(1),
      name: z.string(),
      u_id_list: z.string(), // JSON_ARRAYAGG 결과는 문자열로 옴
      u_name_list: z.string(), // JSON_ARRAYAGG 결과는 문자열로 옴
    })
  ),
};

const FromDB = {
  getRows: async () => {
    const [rows] = await pool.query(
      `SELECT g.id, g.in_progress, g.name,
             JSON_ARRAYAGG(u.id) AS u_id_list,
             JSON_ARRAYAGG(u.username) AS u_name_list
            FROM games g
            LEFT JOIN users u ON g.id = u.g_id
            WHERE u.id IS NOT NULL
            GROUP BY g.id, g.in_progress, g.name
            LIMIT 10`
    );
    console.log(rows)
    const parsedRows = SchemaOf.Rows.parse(rows);
    return parsedRows;
  },
};

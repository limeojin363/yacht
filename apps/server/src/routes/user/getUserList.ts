import { type RequestHandler } from "express";
import { pool } from "../../index.js";
import z from "zod";
import verifyAuthHeader from "../../auths/verifyUser.js";
import type {
  GetUserListReqBody,
  GetUserListResBody,
} from "@yacht/communications";

export const getUserList: RequestHandler<
  {},
  GetUserListResBody | { message: string },
  GetUserListReqBody
> = async (req, res) => {
  try {
    await verifyAuthHeader(req.headers["authorization"]);
    const rows = await FromDB.getRows();
    res.status(200).json({
      users: rows
    });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const SchemaOf = {
  Rows: z.array(
    z.object({
      id: z.number(),
      username: z.string(),
      authority_level: z.number(),
      g_connected: z.number().min(0).max(1),
      g_id: z.union([z.null(), z.number()]),
      g_name: z.union([z.null(), z.string()]),
    })
  ),
};

const FromDB = {
  getRows: async () => {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.authority_level, u.g_connected, u.g_id, g.name AS g_name
          FROM users u
          LEFT JOIN games g ON u.g_id = g.id
          LIMIT 10`
    );
    const parsedRows = SchemaOf.Rows.parse(rows);
    return parsedRows;
  },
};

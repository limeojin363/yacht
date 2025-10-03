import z from "zod";
import { pool } from "../..";

export const getUser = async (userId: number) => {
    const [rows] = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      userId,
    ]);

    const userInfoResult = SchemaOf.UserRows.safeParse(rows);
    if (userInfoResult.error)
        throw new Error("User Query Error");

    return userInfoResult.data[0];
};

const SchemaOf = {
  UserRows: z.array(
    z.object({
      id: z.number(),
      username: z.string(),
      password: z.string(),
      authority_level: z.number().min(0).max(3),
      salt: z.string(),
      g_playerId: z.number().nullable(),
    })
  ),
};

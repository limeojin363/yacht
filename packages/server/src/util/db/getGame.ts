import { pool } from "../..";
import z from "zod";
import { GameStatusSchema } from "../../schema/GameStatus";

export const getGame = async (gameId: number) => {
  const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);
  const parseResult = SchemaOf.GameRows.safeParse(rows);
  if (!parseResult.success) throw new Error("Invalid game status");

  return parseResult.data[0];
};

const SchemaOf = {
  GameRows: z.array(
    z.object({
      id: z.number(),
      gameObject: GameStatusSchema,
      inProgress: z.number().min(0).max(1),
    })
  ),
};

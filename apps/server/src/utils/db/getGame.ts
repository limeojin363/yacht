// import { GameStatusSchema } from "@yacht/default-game";
// import { pool } from "../../index.js";
// import z from "zod";

// export const getGame = async (gameId: number) => {
//   const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [gameId]);
//   const parseResult = SchemaOf.GameRows.safeParse(rows);
//   if (!parseResult.success) throw new Error("Invalid game status");

//   return parseResult.data[0];
// };

// const SchemaOf = {
//   GameRows: z.array(
//     z.object({
//       id: z.number(),
//       gameObject: GameStatusSchema,
//       inProgress: z.number().min(0).max(1),
//     })
//   ),
// };

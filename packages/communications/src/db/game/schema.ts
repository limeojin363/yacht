import z from "zod";
import { GameCoreInfoSchema } from "@yacht/game-core";

export const ProgressTypeSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
]);

export const PlayerSchema = z.object({
  username: z.string(),
  userId: z.number(),
  connected: z.number(),
  playerId: z.number(),
  playerColor: z.string(),
});

export const GameRowSchema = z.object({
  id: z.number(),
  name: z.string(),
  gameCoreInfo: GameCoreInfoSchema,
  progressType: ProgressTypeSchema,
  players: PlayerSchema.array(),
});

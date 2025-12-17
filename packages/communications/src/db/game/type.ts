import z from "zod";
import type { GameRowSchema, PlayerSchema, ProgressTypeSchema } from "./schema.js";

export type ProgressType = z.infer<typeof ProgressTypeSchema>;

export type PlayerType = z.infer<typeof PlayerSchema>;

export type GameRowType = z.infer<typeof GameRowSchema>;

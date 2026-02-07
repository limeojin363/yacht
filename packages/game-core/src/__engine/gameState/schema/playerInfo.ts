import z from "zod";
import { DiceEyesSchema } from "./dice.js";

export const HandInputSchema = DiceEyesSchema.nullable();

export type HandInput = z.infer<typeof HandInputSchema>;

export const PlayerHandInputMapSchema = z.record(z.string(), HandInputSchema);

export type PlayerHandInputMapType = z.infer<typeof PlayerHandInputMapSchema>;

export const PlayerBaseInfoSchema = z.object({
  name: z.string(),
  baseColor: z.string(),
});
za
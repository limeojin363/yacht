import z from "zod";
import { UsableDiceSetSchema } from "../status";

export const UserActionSchema = z.union([
  z.object({
    type: z.literal("HAND-SELECT"),
    payload: z.string(),
  }),
  z.object({
    type: z.literal("ROLL"),
    payload: UsableDiceSetSchema,
  }),
  z.object({
    type: z.literal("TOGGLE_DICE_HOLDING"),
    payload: z.number(),
  }),
]);

export type UserAction = z.infer<typeof UserActionSchema>;

export type UserActionName = UserAction["type"];

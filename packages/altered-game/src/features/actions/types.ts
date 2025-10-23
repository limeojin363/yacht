import z from "zod";
import { AvailableDiceSetSchema, DefaultHandSchema } from "../status";

export const UserActionSchema = z.union([
  z.object({
    type: z.literal("HAND-SELECT"),
    payload: DefaultHandSchema,
  }),
  z.object({
    type: z.literal("ROLL"),
    payload: AvailableDiceSetSchema,
  }),
  z.object({
    type: z.literal("TOGGLE_DICE_HOLDING"),
    payload: z.union([
      z.literal(0),
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
    ]),
  }),
]);

export type UserAction = z.infer<typeof UserActionSchema>;

export type UserActionName = UserAction["type"];

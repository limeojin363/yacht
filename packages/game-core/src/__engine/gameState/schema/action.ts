import z from "zod";

export const ActionSchema = z.union([
  z.object({
    type: z.literal("HAND-SELECT"),
    payload: z.string(), // handName
  }),
  z.object({
    type: z.literal("ROLL"),
  }),
  z.object({
    type: z.literal("TOGGLE-HOLDING"),
    payload: z.number(), // diceIndex
  }),
]);

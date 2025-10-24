import z from "zod";

export const UsableDice = z.object({
  eye: z.number(),
  held: z.boolean(),
});

export const UsableDiceSetSchema = z.tuple([
  UsableDice,
  UsableDice,
  UsableDice,
  UsableDice,
  UsableDice,
]);

export const UnusableDiceSetSchema = z.tuple([
  z.null(),
  z.null(),
  z.null(),
  z.null(),
  z.null(),
]);

export const DiceSetEyesSchema = z.tuple([
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
])

export type DiceSetEyes = z.infer<typeof DiceSetEyesSchema>;

export const PlayerSelectionObjectSchema = z.record(
  z.string(),
  DiceSetEyesSchema.nullable()
);


export const DicesetSchema = z.union([
  UsableDiceSetSchema,
  UnusableDiceSetSchema,
]);

export const GameStatusSchema = z.object({
  handSelectionObjects: z.array(PlayerSelectionObjectSchema),
  diceSet: DicesetSchema,
  currentPlayerId: z.number(),
  remainingRoll: z.number(),
  maxRoll: z.number(),
  maxHolding: z.number(),
  alterOptions: z.array(
    z.object({
      revealed: z.boolean(),
      turn: z.number(),
      name: z.string(),
    })
  ),
});

export type PlayerSelectionObject = z.infer<typeof PlayerSelectionObjectSchema>;

export type UsableDiceSet = z.infer<typeof UsableDiceSetSchema>;

export type UnusableDiceSet = z.infer<typeof UnusableDiceSetSchema>;

export type DiceSet = z.infer<typeof DicesetSchema>;

export type GameStatus = z.infer<typeof GameStatusSchema>;

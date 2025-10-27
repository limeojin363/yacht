import z from "zod";

export type UserAction = z.infer<typeof UserActionSchema>;

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
    type: z.literal("TOGGLE-HOLDING"),
    payload: z.number(),
  }),
]);

export const DiceEyesSchema = z.tuple([
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
]);

export type DiceEyes = z.infer<typeof DiceEyesSchema>;

export const PlayerSelectionObjectSchema = z.record(
  z.string(),
  DiceEyesSchema.nullable()
);

export const DicesetSchema = z.union([
  UsableDiceSetSchema,
  UnusableDiceSetSchema,
]);

export const PlayerHandSelectionObjectSchema = z.record(
  z.string(),
  PlayerSelectionObjectSchema
);

export type PlayerHandSelectionObjectMap = z.infer<
  typeof PlayerHandSelectionObjectSchema
>;

export const AlterOptionSchema = z.object({
  revealed: z.boolean(),
  turn: z.number(),
  name: z.string(),
});

export type AlterOption = z.infer<typeof AlterOptionSchema>;

export const GameStatusDataSchema = z.object({
  playerHandSelectionObjectMap: PlayerHandSelectionObjectSchema,
  diceSet: DicesetSchema,
  currentPlayerId: z.number(),
  remainingRoll: z.number(),
  alterOptions: z.array(AlterOptionSchema),
});

export type PlayerSelectionObject = z.infer<typeof PlayerSelectionObjectSchema>;

export type UsableDiceSet = z.infer<typeof UsableDiceSetSchema>;

export type UnusableDiceSet = z.infer<typeof UnusableDiceSetSchema>;

export type DiceSet = z.infer<typeof DicesetSchema>;

// GameStatus에서 DB에 저장되는 부분
export type GameStatusDataPart = z.infer<typeof GameStatusDataSchema>;

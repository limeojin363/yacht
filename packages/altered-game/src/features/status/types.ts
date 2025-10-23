import z from "zod";

export const PlayersNumSchema = z.union([
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

export const RemainingRollSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

export const AvailableDiceEyeSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]);

export const AvailableDiceObjectSchema = z.object({
  eye: AvailableDiceEyeSchema,
  held: z.boolean(),
});

export const DefaultHandSchema = z.union([
  z.literal("NUMBERS_1"),
  z.literal("NUMBERS_2"),
  z.literal("NUMBERS_3"),
  z.literal("NUMBERS_4"),
  z.literal("NUMBERS_5"),
  z.literal("NUMBERS_6"),
  z.literal("TRIPLE"),
  z.literal("FOURCARD"),
  z.literal("FULLHOUSE"),
  z.literal("STRAIGHT"),
  z.literal("YACHT"),
  z.literal("CHOICE"),
]);

export const RowSchema = z.union([
  DefaultHandSchema,
]);

export const AlterOptionNameSchema = z.union([
  z.literal("FUSION_1&2"),
  z.literal("FUSION_1&3"),
  z.literal("FUSION_1&4"),
  z.literal("FUSION_1&5"),
  z.literal("FUSION_1&6"),
  z.literal("FUSION_2&3"),
  z.literal("FUSION_2&4"),
  z.literal("ONE-CHOICE_x2"),
  z.literal("ONE-CHOICE_x3"),
  z.literal("TWO-CHOICE_x2"),
  z.literal("TWO-CHOICE_x3"),
]);

export type AlterOptionName = z.infer<typeof AlterOptionNameSchema>;

export const AvailableDiceSetSchema = z.tuple([
  AvailableDiceObjectSchema,
  AvailableDiceObjectSchema,
  AvailableDiceObjectSchema,
  AvailableDiceObjectSchema,
  AvailableDiceObjectSchema,
]);

export const SinglePlayerSchema = z.record(
  DefaultHandSchema,
  z
    .tuple([
      AvailableDiceEyeSchema,
      AvailableDiceEyeSchema,
      AvailableDiceEyeSchema,
      AvailableDiceEyeSchema,
      AvailableDiceEyeSchema,
    ])
    .nullable()
);

export const UnavailableDiceSetSchema = z.tuple([
  z.null(),
  z.null(),
  z.null(),
  z.null(),
  z.null(),
]);

export const DicesetSchema = z.union([
  AvailableDiceSetSchema,
  UnavailableDiceSetSchema,
]);

export const PlayerIdSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

export const MaxRollSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
])

export const MaxHoldingSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
])


export const GameStatusSchema = z.object({
  handSelectionObjects: z.array(SinglePlayerSchema),
  diceSet: DicesetSchema,
  currentPlayerId: PlayerIdSchema,
  remainingRoll: RemainingRollSchema,
  maxRoll: MaxRollSchema,
  maxHolding: MaxHoldingSchema,
  alterOptions: z.array(
    z.object({
      revealed: z.boolean(),
      turn: z.number(),
      name: AlterOptionNameSchema,
    })
  ),
});

export const DiceIndexSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

export type PlayersNum = z.infer<typeof PlayersNumSchema>;

export type RemainingRoll = z.infer<typeof RemainingRollSchema>;

export type AvailableDiceEye = z.infer<typeof AvailableDiceEyeSchema>;

export type AvailableDiceObject = z.infer<typeof AvailableDiceObjectSchema>;

export type DefaultHand = z.infer<typeof DefaultHandSchema>;

export type SinglePlayer = z.infer<typeof SinglePlayerSchema>;

export type AvailableDiceSet = z.infer<typeof AvailableDiceSetSchema>;

export type UnavailableDiceSet = z.infer<typeof UnavailableDiceSetSchema>;

export type DiceSet = z.infer<typeof DicesetSchema>;

export type GameStatus = z.infer<typeof GameStatusSchema>;

export type DiceIndex = z.infer<typeof DiceIndexSchema>;

export type PlayerId = z.infer<typeof PlayerIdSchema>;

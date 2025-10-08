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

export const AvailableHandSchema = z.union([
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

export const SinglePlayerSchema = z.record(
  AvailableHandSchema,
  z.number().nullable()
);

export const AvailableDiceSetSchema = z.tuple([
  AvailableDiceObjectSchema,
  AvailableDiceObjectSchema,
  AvailableDiceObjectSchema,
  AvailableDiceObjectSchema,
  AvailableDiceObjectSchema,
]);

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

export const GameStatusSchema = z.object({
  scoreObjectList: z.array(SinglePlayerSchema),
  diceSet: DicesetSchema,
  currentPlayerId: PlayerIdSchema,
  remainingRoll: RemainingRollSchema,
});

export const DiceIndexSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

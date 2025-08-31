import { z } from "zod";

// 기본 타입 스키마
const TotalPlayersSchema = z.union([z.literal(2), z.literal(3), z.literal(4)]);
const PlayerIdTypeSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);
const RemainingRollSchema = z.union([
  z.literal(3),
  z.literal(2),
  z.literal(1),
  z.literal(0),
]);
const AvailableDiceEyeSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]);
const AvailableHandSchema = z.union([
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

const AvailableDiceObjectSchema = z.object({
  eye: AvailableDiceEyeSchema,
  held: z.boolean(),
});

const AvailableDicesSchema = z.tuple([
  AvailableDiceObjectSchema,
  AvailableDiceObjectSchema,
  AvailableDiceObjectSchema,
  AvailableDiceObjectSchema,
  AvailableDiceObjectSchema,
]);
const UnavailableDicesSchema = z.tuple([
  z.null(),
  z.null(),
  z.null(),
  z.null(),
  z.null(),
]);
const DicesSchema = z.union([AvailableDicesSchema, UnavailableDicesSchema]);

const SinglePlayerTypeSchema = z.object({
  scores: z.record(AvailableHandSchema, z.union([z.number(), z.null()])),
});

// GameStatus 스키마
export const GameStatusSchema = z.object({
  totalPlayers: TotalPlayersSchema,
  playerList: z.array(SinglePlayerTypeSchema),
  dices: DicesSchema,
  currentPlayerId: PlayerIdTypeSchema,
  remainingRoll: RemainingRollSchema,
});

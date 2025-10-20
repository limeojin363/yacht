import z from "zod";
import {
  AvailableDiceEyeSchema,
  AvailableDiceObjectSchema,
  AvailableDiceSetSchema,
  SelectableHandSchema,
  RemainingRollSchema,
  SinglePlayerSchema,
  PlayersNumSchema,
  UnavailableDiceSetSchema,
  DicesetSchema,
  GameStatusSchema,
  DiceIndexSchema,
  PlayerIdSchema
} from "./schemas.js";

export type PlayersNum = z.infer<typeof PlayersNumSchema>;

export type RemainingRoll = z.infer<typeof RemainingRollSchema>;

export type AvailableDiceEye = z.infer<typeof AvailableDiceEyeSchema>;

export type AvailableDiceObject = z.infer<typeof AvailableDiceObjectSchema>;

export type SelectableHand = z.infer<typeof SelectableHandSchema>;

export type SinglePlayer = z.infer<typeof SinglePlayerSchema>;

export type AvailableDiceSet = z.infer<typeof AvailableDiceSetSchema>;

export type UnavailableDiceSet = z.infer<typeof UnavailableDiceSetSchema>;

export type DiceSet = z.infer<typeof DicesetSchema>;

export type GameStatus = z.infer<typeof GameStatusSchema>;

export type DiceIndex = z.infer<typeof DiceIndexSchema>;

export type PlayerId = z.infer<typeof PlayerIdSchema>;

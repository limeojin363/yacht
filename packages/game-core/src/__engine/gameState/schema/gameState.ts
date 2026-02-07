import z from "zod";
import { DiceSetSchema } from "./dice.js";
import {
  PlayerBaseInfoSchema,
  PlayerHandInputMapSchema,
} from "./playerInfo.js";
import { ChangerMetaSchema } from "./changer.js";
import { ScoreRowSchema, TotalScoreSchema } from "./row.js";

export const GameStateSchema = z.object({
  // dice
  diceSet: DiceSetSchema,
  remainingRoll: z.number(),
  holdingLowerLimit: z.number(),
  holdingUpperLimit: z.number(),
  maxRoll: z.number(),

  // turn
  currentTurn: z.number(),
  currentPlayerIdx: z.number(),

  // players
  playerBaseInfoList: PlayerBaseInfoSchema.array(),
  playerHandInputMapList: PlayerHandInputMapSchema.array(),

  // changers
  changerMetaList: ChangerMetaSchema.array(),

  scoreRowList: ScoreRowSchema.array(),

  totalScoreRowMeta: TotalScoreSchema,

  gameEndingConditionMeta: ScoreRowSchema,
});

export type GameState = z.infer<typeof GameStateSchema>;

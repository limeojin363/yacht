import type { RowName } from "../features/score/types.js";
import { type SelectableHand } from "../features/status/index.js";

export const EYES = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
} as const;

export const COUNT = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
} as const;

export const SCORES = {
  FULLHOUSE: 25,
  STRAIGHT: 40,
  YACHT: 50,
} as const;

export const SELECTABLE_HAND_LIST = [
  "NUMBERS_1",
  "NUMBERS_2",
  "NUMBERS_3",
  "NUMBERS_4",
  "NUMBERS_5",
  "NUMBERS_6",
  "TRIPLE",
  "FOURCARD",
  "FULLHOUSE",
  "STRAIGHT",
  "YACHT",
  "CHOICE",
] as const satisfies SelectableHand[];

export const TABLE_ROWNAME_LIST = ["CHOICE"] as const satisfies RowName[];

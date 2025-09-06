import { type AvailableHand } from "../features/status";

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

export const HAND_LIST = [
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
] as const satisfies AvailableHand[];

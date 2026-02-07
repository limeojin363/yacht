import type { FieldInfoMap } from "../base.types.js";
import { RowInfoOfChoice } from "./choice.js";
import { RowInfoOfFullHouse } from "./full_house.js";
import { RowInfoOfNOfAKind } from "./n_of_a_kind.js";
import { RowInfoOfNumbers } from "./numbers_n.js";
import { RowInfoOfStraight } from "./straight.js";
import { RowInfoOfYacht } from "./yacht.js";

export const RowConfigMap: FieldInfoMap = {
  NUMBERS_N: RowInfoOfNumbers,
  N_OF_A_KIND: RowInfoOfNOfAKind,
  FULL_HOUSE: RowInfoOfFullHouse,
  STRAIGHT: RowInfoOfStraight,
  YACHT: RowInfoOfYacht,
  CHOICE: RowInfoOfChoice,
  FUSION: {},
};

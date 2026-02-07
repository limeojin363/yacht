import getFieldConfigOfChoice from "./choice.js";
import getFieldConfigOfFullHouse from "./full_house.js";
import getFieldConfigOfFusion from "./fusion.js";
import getFieldConfigOfNOfAKind from "./n_of_a_kind.js";
import getFieldConfigOfNumbersN from "./numbers_n.js";
import getFieldConfigOfStraight from "./straight.js";
import type { GetFieldConfigBase } from "./types.js";
import getFieldConfigOfYacht from "./yacht.js";

const FieldConfigRoot: Record<string, GetFieldConfigBase> = {
  Choice: getFieldConfigOfChoice,
  FullHouse: getFieldConfigOfFullHouse,
  NOfAKind: getFieldConfigOfNOfAKind,
  NumbersN: getFieldConfigOfNumbersN,
  Yacht: getFieldConfigOfYacht,
  Straight: getFieldConfigOfStraight,
  Fusion: getFieldConfigOfFusion,
};

export default FieldConfigRoot;

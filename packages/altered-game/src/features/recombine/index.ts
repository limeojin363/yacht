import type { DefaultHand } from "../status";

type AdditionalRowName =
  | "FUSION_1&2"
  | "FUSION_1&3"
  | "FUSION_1&4"
  | "FUSION_1&5"
  | "FUSION_1&6"
  | "FUSION_2&3"
  | "FUSION_2&4"
  | "CHOICE_DOUBLE_A"
  | "CHOICE_DOUBLE_B"
  | "CHOICE_TRIPLE_A"
  | "CHOICE_TRIPLE_B";

type RowName = DefaultHand | AdditionalRowName;

type PlayerScoreObject = {
  [key in RowName]?: {
    label: string;
    result: null | number;
  };
};

type Recombined = {
  rows: RowName[];
  scoreObjects: PlayerScoreObject[];
};

import { ChoiceOptionMap } from "./Choice.js";
import { FusionOptionMap } from "./Fusion.js";
import { AllNumberBonusMissionOptionMap } from "./BonusMission.js";
import { N1EtcOptionMap, N1IfZeroOptionMap, N1TimesOptionMap } from "./N1.js";
import { YachtOptionMap } from "./Yacht.js";
import { AllNumberBonusMissionOptionName } from "./BonusMission.js";
import { ChoiceOptionName } from "./Choice.js";
import { FusionOptionName } from "./Fusion.js";
import {
  N1TimesOptionName,
  N1IfZeroOptionName,
  N1EtcOptionName,
} from "./N1.js";
import { N2TimesOptionMap, N2EtcOptionMap, N2TimesOptionName } from "./N2.js";
import { N3TimesOptionName, N3TimesOptionMap } from "./N3.js";
import { N4TimesOptionName, N4TimesOptionMap } from "./N4.js";
import { N5TimesOptionName, N5TimesOptionMap } from "./N5.js";
import { N6TimesOptionName, N6TimesOptionMap } from "./N6.js";
import {
  type RollLimitOptionName,
  type HoldingLimitOptionName,
  RollLimitOptionMap,
  HoldingLimitOptionMap,
} from "./UserActionLimit.js";
import { type YachtOptionName } from "./Yacht.js";
import { NumbersExodiaMap, SpecialHandsExodiaMap } from "./Exodia.js";
import type { Game } from "../../core/main.js";

export type AlterOptionObject = {
  description: string;
  handDependencies: string[]; // 의존하는 hand
  onTrigger: (gameStatus: Game) => void;
};

export type AlterOptionName =
  | AllNumberBonusMissionOptionName
  | ChoiceOptionName
  | FusionOptionName
  | N1TimesOptionName
  | N1IfZeroOptionName
  | N1EtcOptionName
  | N2TimesOptionName
  | N3TimesOptionName
  | N4TimesOptionName
  | N5TimesOptionName
  | N6TimesOptionName
  | RollLimitOptionName
  | HoldingLimitOptionName
  | YachtOptionName;

export const AlterOptionMap: { [key in AlterOptionName]: AlterOptionObject } = {
  ...FusionOptionMap,
  ...ChoiceOptionMap,
  ...N1TimesOptionMap,
  ...N1IfZeroOptionMap,
  ...NumbersExodiaMap,
  ...SpecialHandsExodiaMap,
  ...N1EtcOptionMap,
  ...N2TimesOptionMap,
  ...N2EtcOptionMap,
  ...N3TimesOptionMap,
  ...N4TimesOptionMap,
  ...N5TimesOptionMap,
  ...N6TimesOptionMap,
  ...YachtOptionMap,
  ...AllNumberBonusMissionOptionMap,
  ...RollLimitOptionMap,
  ...HoldingLimitOptionMap,
};

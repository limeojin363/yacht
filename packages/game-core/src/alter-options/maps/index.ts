import { ChoiceOptionMap } from "./Choice";
import { FusionOptionMap } from "./Fusion";
import { AllNumberBonusMissionOptionMap } from "./BonusMission";
import { N1EtcOptionMap, N1IfZeroOptionMap, N1TimesOptionMap } from "./N1";
import { YachtOptionMap } from "./Yacht";
import { AllNumberBonusMissionOptionName } from "./BonusMission";
import { ChoiceOptionName } from "./Choice";
import { FusionOptionName } from "./Fusion";
import { N1TimesOptionName, N1IfZeroOptionName, N1EtcOptionName } from "./N1";
import { N2TimesOptionName } from "./N2";
import { N3TimesOptionName } from "./N3";
import { N4TimesOptionName } from "./N4";
import { N5TimesOptionName } from "./N5";
import { N6TimesOptionName } from "./N6";
import { RollLimitOptionName, HoldingLimitOptionName, RollLimitOptionMap, HoldingLimitOptionMap } from "./UserActionLimit";
import { YachtOptionName } from "./Yacht";
import type { Game } from "../../core/main";

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

export const AlterOptionMap: Record<string, AlterOptionObject> = {
  ...FusionOptionMap,
  ...ChoiceOptionMap,
  ...N1TimesOptionMap,
  ...N1IfZeroOptionMap,
  ...N1EtcOptionMap,
  ...YachtOptionMap,
  ...AllNumberBonusMissionOptionMap,
  ...RollLimitOptionMap,
  ...HoldingLimitOptionMap
};

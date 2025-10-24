import type { GameStatus } from "../status";
import { ChoiceOptionMap } from "./maps/Choice";
import { FusionOptionMap } from "./maps/Fusion";
import { AllNumberBonusMissionOptionMap } from "./maps/BonusMission";
import { N1EtcOptionMap, N1IfZeroOptionMap, N1TimesOptionMap } from "./maps/N1";
import { YachtOptionMap } from "./maps/Yacht";
import { AllNumberBonusMissionOptionName } from "./maps/BonusMission";
import { ChoiceOptionName } from "./maps/Choice";
import { FusionOptionName } from "./maps/Fusion";
import {
  N1TimesOptionName,
  N1IfZeroOptionName,
  N1EtcOptionName,
} from "./maps/N1";
import { N2TimesOptionName } from "./maps/N2";
import { N3TimesOptionName } from "./maps/N3";
import { N4TimesOptionName } from "./maps/N4";
import { N5TimesOptionName } from "./maps/N5";
import { N6TimesOptionName } from "./maps/N6";
import {
  RollLimitOptionName,
  HoldingLimitOptionName,
} from "./maps/UserActionLimit";
import { YachtOptionName } from "./maps/Yacht";

export type AlterOptionObject = {
  description: string;
  handDependencies: string[]; // 의존하는 hand
  revealEffectOnGameStatus?: (g: GameStatus) => GameStatus; // 공개와 동시에 gameStatus 객체에 적용 - field 추가, roll/fix 리미트 수정 등
  effectOnCalculator?: (
    scoreGetter: Record<string, (handInput: number[]) => number>
  ) => void; // Calculator(런타임 운용)를 조작 - 개별 핸드 계산 / 총점 계산에 영향
  newIsFinished?: (g: GameStatus) => boolean; // 게임 종료 조건(런타임 운용) 변경
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
const AlterOptionMap: Record<string, AlterOptionObject> = {
  ...FusionOptionMap,
  ...ChoiceOptionMap,
  ...N1TimesOptionMap,
  ...N1IfZeroOptionMap,
  ...N1EtcOptionMap,
  ...YachtOptionMap,
  ...AllNumberBonusMissionOptionMap,
};

export default AlterOptionMap;

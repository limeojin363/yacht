import { DevError } from "../error/index.js";
import type { GameViewData } from "./engine.js";

export class BaseCalculator {
  private viewData: GameViewData;

  constructor({ viewData }: { viewData: GameViewData }) {
    this.viewData = viewData;
  }

  getFieldScore({
    fieldId,
    playerIdx,
  }: {
    fieldId: string;
    playerIdx: number;
  }): number {
    const scoreFieldInfo = this.viewData.fieldInfoMap[fieldId];
    if (!scoreFieldInfo) throw new DevError("Invalid fieldId");

    return 0;
  }

  getTotalScore({ playerIdx }: { playerIdx: number }): number {
    const totalScoreInfo = this.viewData.totalScoreCalculationInfo;

    return 0;
  }
}

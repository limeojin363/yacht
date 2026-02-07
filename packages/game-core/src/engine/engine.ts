import FieldConfigRoot from "./fieldConfig/index.js";
import type { GameState } from "./state.js";

export type ClientAction =
  | {
      type: "TOGGLE-DICE-HOLDING";
      payload: { idx: number };
    }
  | {
      type: "ROLL";
      payload: void;
    }
  | {
      type: "PUT-PLAYER-HAND";
      payload: { handId: string };
    };

export class GameEngine {
  state: GameState;
  afterDispatch: (ctx: GameEngine) => void;

  constructor({
    state,
    afterDispatch,
  }: Pick<GameEngine, "state" | "afterDispatch">) {
    this.state = state;
    this.afterDispatch = afterDispatch;
  }

  getViewData(): GameViewData {
    const { changerList, ...viewData } = this.state;
    return viewData;
  }

  dispatch(action: ClientAction) {
    this.afterDispatch(this);
  }

  getFieldScore({
    fieldId,
    playerIdx,
  }: {
    fieldId: string;
    playerIdx: number;
  }) {
    const fieldInfo = this.state.fieldInfoMap[fieldId];
    const player = this.state.playerList[playerIdx];
    const handInputs = fieldInfo.handIdList.map(
      (id) => player.handInputMap[id],
    );

    // 아직 이 필드에 점수를 넣지 않은 경우
    if (handInputs.some((input) => input === null)) {
      return 0;
    }

    const fieldConfigFactory = FieldConfigRoot[fieldInfo.base.type];

    const fieldConfig = fieldConfigFactory(...fieldInfo.base.props);

    const calculationFactory = fieldConfig[fieldInfo.calculation.type];

    const calculationConfig = calculationFactory(
      ...fieldInfo.calculation.props,
    );

    return calculationConfig.getScore(...handInputs);
  }

  getTotalScore({ playerIdx }: { playerIdx: number }) {
    return this.state.fieldIdList.reduce(
      (acc, curr) => acc + this.getFieldScore({ fieldId: curr, playerIdx }),
      0,
    );
  }
}

export type GameViewData = Omit<GameState, "changerList">;

import type { GameState } from "./gameState/schema/gameState.js";
import { RowConfigMap } from "./row/score/index.js";
import type { GameView, HandViewUnit, ScoreCellView } from "./view/index.js";

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
      payload: { handName: string };
    };

export class GameEngine {
  state: GameState;

  /** Returns the list of row ids */
  get rowIdList() {
    return this.state.scoreRowList.map((row) => row.id);
  }

  /** Returns the list of player names */
  get playerNameList() {
    return this.state.playerBaseInfoList.map((info) => info.name);
  }

  getRowInfo(rowId: string) {
    const rowInfo = this.state.scoreRowList.find((row) => row.id === rowId);
    if (!rowInfo) throw new Error(`No such row: ${rowId}`);
    return rowInfo;
  }

  getHandInput({ handId, playerIdx }: { playerIdx: number; handId: string }) {
    const handInputMap = this.state.playerHandInputMapList[playerIdx];
    if (!handInputMap)
      throw new Error(`No hand inputs for player index: ${playerIdx}`);

    const handInput = handInputMap[handId];
    if (handInput === undefined)
      throw new Error(
        `No such hand input: ${handId} for player index: ${playerIdx}`,
      );
    return handInput;
  }

  getHandInputs({
    playerIdx,
    handIdList,
  }: {
    playerIdx: number;
    handIdList: string[];
  }) {
    return handIdList.map((handId) => this.getHandInput({ playerIdx, handId }));
  }

  getScoreFor({ playerIdx, rowId }: { playerIdx: number; rowId: string }) {
    const {
      hands,
      params,
      name: rowName,
      calculatorName,
    } = this.getRowInfo(rowId);
    const handIdList = hands.map((hand) => hand.id);
    const handInputs = this.getHandInputs({ playerIdx, handIdList });

    const rowConfig = RowConfigMap[rowName];
    if (!rowConfig) throw new Error(`No such row config: ${rowName}`);

    const rowInfo = rowConfig[calculatorName];
    if (!rowInfo)
      throw new Error(
        `No such calculator: ${calculatorName} for row: ${rowName}`,
      );

    const scoreEntry = rowInfo(...(params ?? []));
    return scoreEntry.getScore(...handInputs);
  }

  getPreviewScore({}: {}) {}

  isTurnOf({ playerIdx }: { playerIdx: number }) {
    return this.state.currentPlayerIdx === playerIdx;
  }

  getTotalScore({ playerIdx }: { playerIdx: number }) {
    return this.rowIdList.reduce((total, rowId) => {
      return total + this.getScoreFor({ playerIdx, rowId });
    }, 0);
  }

  afterDispatch: (ctx: GameEngine) => void;

  cachedView: GameView | null = null;

  getView(): GameView {
    if (this.cachedView) {
      return this.cachedView;
    }

    // TODO: 제발 어떻게 좀 해봐라: hand, row의 관계부터 재정립 필요...
    return (this.cachedView = {
      table: {
        scoreRowNames: this.state.scoreRowList.map((row) => row.name),
        playerColumnList: this.state.playerBaseInfoList.map(
          (baseInfo, idx) => ({
            baseColor: baseInfo.baseColor,
            playerName: baseInfo.name,
            scoreCells: this.rowIdList.map((rowId): ScoreCellView => {
              const rowInfo = this.getRowInfo(rowId);
              const isFusion = rowInfo.name === "FUSION";
              const isCurrentPlayer = this.isTurnOf({ playerIdx: idx });

              if (!isFusion) {
                const handId = rowInfo.hands[0]!.id;
                const handInput = this.getHandInput({
                  playerIdx: idx,
                  handId,
                });
                const isFilled = handInput !== null;

                if (!isFilled && !isCurrentPlayer) {
                  return {
                    status: "NONE",
                    fusionType: "SINGLE",
                    isRowAltered: rowInfo.calculatorName !== "default",
                    handId: handId,
                  };
                }

                if (!isFilled && isCurrentPlayer) {
                  const rowConfig =
                    RowConfigMap[rowInfo.name][rowInfo.calculatorName];
                  if (!rowConfig)
                    throw new Error(`No such row config: ${rowInfo.name}`);

                  const previewScore = rowConfig(
                    ...(rowInfo.params ?? []),
                  ).getScore(
                    this.getHandInput({
                      playerIdx: idx,
                      handId,
                    }),
                  );

                  return {
                    status: "FILLABLE",
                    fusionType: "SINGLE",
                    isRowAltered: rowInfo.calculatorName !== "default",
                    handId: handId,
                    content: previewScore.toString(),
                  };
                }

                if (isFilled)
                  return {
                    status: "FILLED",
                    fusionType: "SINGLE",
                    isRowAltered: rowInfo.calculatorName !== "default",
                    handId: handId,
                    content: this.getScoreFor({
                      playerIdx: idx,
                      rowId,
                    }).toString(),
                    description: handInput!.join(", "),
                  };

                throw new Error("Unreachable");
              } else {
                const handUnits: HandViewUnit[] = rowInfo.hands.map(
                  (hand, handIdx) => {
                    const handInput = this.getHandInput({
                      playerIdx: idx,
                      handId: hand.id,
                    });
                    const isFilled = handInput !== null;
                    if (!isFilled && !isCurrentPlayer) {
                      return { status: "NONE", handId: hand.id };
                    }

                    if (!isFilled && isCurrentPlayer) {
                      const rowConfig = RowConfigMap.NUMBERS_N.default;
                      if (!rowConfig)
                        throw new Error(`No such row config: ${rowInfo.name}`);

                      const n = rowInfo.params![handIdx]!;

                      const previewScore = rowConfig(n).getScore(
                        this.getHandInput({
                          playerIdx: idx,
                          handId: hand.id,
                        }),
                      );

                      return {
                        status: "FILLABLE",
                        handId: hand.id,
                        content: previewScore.toString(),
                      };
                    }

                    if (isFilled) {
                      return {
                        handId: hand.id,
                        status: "FILLED",
                        content: this.getScoreFor({
                          playerIdx: idx,
                          rowId,
                        }).toString(),
                        description: handInput!.join(", "),
                      };
                    }

                    throw new Error("Unreachable");
                  },
                );

                const allFilled = handUnits.every(
                  (unit) => unit.status === "FILLED",
                );
                if (allFilled) {
                  const totalScore = this.getScoreFor({
                    playerIdx: idx,
                    rowId,
                  });
                  return {
                    fusionType: "FUSION",
                    isRowAltered: true,
                    completed: true,
                    status: "FILLED",
                    content: totalScore.toString(),
                    description: handUnits
                      .map((unit) => unit.description)
                      .join(" | "),
                  };
                } else {
                  return {
                    fusionType: "FUSION",
                    isRowAltered: true,
                    completed: false,
                    hands: handUnits as [HandViewUnit, HandViewUnit],
                  };
                }
              }
            }),
          }),
        ),
      },
    });
  }

  handleAction(action: ClientAction) {}

  dispatch(action: ClientAction) {
    this.handleAction(action);
    this.afterDispatch(this);
  }

  constructor(
    state: GameState,
    // DB 저장, 클라이언트에 전파 등..
    afterDispatch: (ctx: GameEngine) => void,
  ) {
    this.state = state;
    this.afterDispatch = afterDispatch;
  }
}

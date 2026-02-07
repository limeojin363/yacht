export type ViewStatus = "NONE" | "FILLED" | "FILLABLE";

// -> HandViewUnit에다 적용된 점수 정보???
// hand 계산은 조상님이 해주냐?
export type HandViewUnit = {
  handId: string;
} & (
  | {
      status: "FILLED";
      content: string;
      description: string;
    }
  | {
      status: "FILLABLE";
      content: string;
    }
  | {
      status: "NONE";
    }
);

export type FusionCellView = {
  fusionType: "FUSION";
  isRowAltered: true;
} & (
  | {
      completed: true;
      status: "FILLED";
      content: string;
      description: string;
    }
  | {
      completed: false;
      hands: [HandViewUnit, HandViewUnit];
    }
);

export type SingleCellView = {
  fusionType: "SINGLE";
  isRowAltered: boolean;
} & HandViewUnit;

export type ScoreCellView = FusionCellView | SingleCellView;

export type GameView = {
  table: {
    scoreRowNames: string[];
    playerColumnList: Array<{
      playerName: string;
      baseColor: string;
      fieldMap: Record<string, ScoreCellView>;
    }>;
  };
};

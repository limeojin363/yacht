import type { AlterOptionName, GameStatus, SelectableHand } from "../status";

const AlterOptionMap = {
  "FUSION_1&2": {
    description: "NUMBERS_1과 NUMBERS_2를 곱연산",
    dependencies: ["NUMBERS_1", "NUMBERS_2"],
  },
  "FUSION_1&3": {
    description: "NUMBERS_1과 NUMBERS_3를 곱연산",
    dependencies: ["NUMBERS_1", "NUMBERS_3"],
  },
  "FUSION_1&4": {
    description: "NUMBERS_1과 NUMBERS_4를 곱연산",
    dependencies: ["NUMBERS_1", "NUMBERS_4"],
  },
  "FUSION_1&5": {
    description: "NUMBERS_1과 NUMBERS_5를 곱연산",
    dependencies: ["NUMBERS_1", "NUMBERS_5"],
  },
  "FUSION_1&6": {
    description: "NUMBERS_1과 NUMBERS_6를 곱연산",
    dependencies: ["NUMBERS_1", "NUMBERS_6"],
  },
  "FUSION_2&3": {
    description: "NUMBERS_2와 NUMBERS_3를 곱연산",
    dependencies: ["NUMBERS_2", "NUMBERS_3"],
  },
  "FUSION_2&4": {
    description: "NUMBERS_2와 NUMBERS_4를 곱연산",
    dependencies: ["NUMBERS_2", "NUMBERS_4"],
  },
  "ONE-CHOICE_DOUBLE": {
    description: "",
    dependencies: [],
  },
  "TWO-CHOICE_DOUBLE": {
    description: "CHOICE_DOUBLE을 두 개 생성",
    dependencies: [],
  },
  "ONE-CHOICE_TRIPLE": {
    description: "CHOICE_TRIPLE을 세 개 생성",
    dependencies: [],
  },
  "TWO-CHOICE_TRIPLE": {
    description: "",
    dependencies: [],
  },
} satisfies {
  [key in AlterOptionName]: {
    description: string;
    isGameFinished?: () => void;
    // 공개와 동시에 gameStatus 객체에 적용
    revealEffectOnGameStatus?: (g: GameStatus) => GameStatus;
    // Score 객체로의 재조합 과정에 적용
    onRecombine?: (obj: void) => void;
    // HAND-SELECT 이벤트 발생 후 실행
    afterHandSelect?: () => void;
    dependencies: SelectableHand[];
  };
};

export default AlterOptionMap;

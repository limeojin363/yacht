import type { GameEngine } from "../engine.js";

export const endingLogicMap = {
  default: () => ({
    description: "The game ends after every cell is filled.",
    isGameEnded: (game: GameEngine) => {
      const totalCell = game.rowIdList.length * game.playerNameList.length;
      const filledCell = game.playerNameList.reduce((acc, _, playerIdx) => {
        return (
          acc +
          game.rowIdList.reduce((rowAcc, rowName) => {
            const score = game.getScoreFor({ playerIdx, rowName });
            return rowAcc + (score !== null && score !== undefined ? 1 : 0);
          }, 0)
        );
      }, 0);
      return filledCell >= totalCell;
    },
  }),
} satisfies Record<string, (...params: number[]) => EndingLogic>;

type EndingLogic = {
  description: string;
  isGameEnded: (game: GameEngine) => boolean;
};

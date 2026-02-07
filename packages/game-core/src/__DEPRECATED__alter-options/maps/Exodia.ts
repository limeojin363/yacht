import type { AlterOptionObject } from "./index.js";
import { DevError } from "../../error/index.js";

export const SpecialHandsExodiaMap = {
  SPECIAL_HAND_EXODIA: {
    description: `STRAIGHT - FULLHOUSE - TRIPLE - FOURCARD - YACHT를 전부 채우면 99999점을 얻고 게임 종료(해당 턴까지 진행후)`,
    handDependencies: ["STRAIGHT", "FULLHOUSE", "TRIPLE", "FOURCARD", "YACHT"],
    onTrigger(gameStatus) {
      const exodia = (
        handInputMap: Record<
          string,
          [number, number, number, number, number] | null
        >
      ) => {
        return ["STRAIGHT", "FULLHOUSE", "TRIPLE", "FOURCARD", "YACHT"].every(
          (rowName) => {
            const targetHandInput = handInputMap[rowName];
            if (targetHandInput === undefined)
              throw new Error(`No such hand: ${targetHandInput}`);

            return (
              targetHandInput !== null &&
              gameStatus
                .getRowInfoOf(rowName)
                .getScoreFrom({ handInputMap }) !== 0
            );
          }
        );
      };

      gameStatus.getPlayerTotalScore = function ({ playerIdx }) {
        const handInputMap = this.getHandInputMapOf({ playerIdx });
        if (handInputMap === undefined)
          throw new DevError(`No such player: ${playerIdx}`);

        let totalScore = this.getBasePlayerTotalScore({ playerIdx });

        if (exodia(handInputMap)) {
          totalScore += 99999;
        }

        return totalScore;
      };

      gameStatus.getTotalTurn = function () {
        const isExodiaTriggered = (() => {
          for (const playerIdxStr of Object.keys(this.playerInfoList)) {
            const playerIdx = Number(playerIdxStr);
            const handInputMap = this.getHandInputMapOf({ playerIdx });
            if (handInputMap === undefined)
              throw new Error(`No such player: ${playerIdx}`);

            if (exodia(handInputMap)) {
              return true;
            }
          }
          return false;
        })();

        if (isExodiaTriggered) {
          if (alteredTurn === null) {
            alteredTurn = this.getCurrentTurn() - 1;
          }
          return alteredTurn;
        }

        return this.countTotalHand();
      };
    },
  },
} as const satisfies Record<string, AlterOptionObject>;

export const NumbersExodiaMap = {
  NUMBERS_EXODIA: {
    handDependencies: [
      "NUMBERS_1",
      "NUMBERS_2",
      "NUMBERS_3",
      "NUMBERS_4",
      "NUMBERS_5",
      "NUMBERS_6",
    ],
    description: `NUMBERS의 점수 합이 90점 이상이면 99999점을 얻고 게임 종료(해당 턴까지 진행후)`,
    onTrigger(gameStatus) {
      const exodia = (
        handInputMap: Record<
          string,
          [number, number, number, number, number] | null
        >
      ) => {
        const allNumbersRowNames = [
          "NUMBERS_1",
          "NUMBERS_2",
          "NUMBERS_3",
          "NUMBERS_4",
          "NUMBERS_5",
          "NUMBERS_6",
        ];

        let numbersScore = 0;

        for (const rowName of allNumbersRowNames) {
          const handInput = handInputMap[rowName];
          if (handInput === undefined)
            throw new Error(`No such hand: ${rowName}`);

          const rowInfo = gameStatus.getRowInfoOf(rowName);
          numbersScore += rowInfo.getScoreFrom({ handInputMap });
        }

        return numbersScore >= 90;
      };

      gameStatus.getPlayerTotalScore = function ({ playerIdx }) {
        const handInputMap = this.getHandInputMapOf({ playerIdx });
        if (handInputMap === undefined)
          throw new Error(`No such player: ${playerIdx}`);

        let totalScore = this.getBasePlayerTotalScore({ playerIdx });

        if (exodia(handInputMap)) {
          totalScore += 99999;
        }

        return totalScore;
      };

      gameStatus.getTotalTurn = function () {
        const isExodiaTriggered = (() => {
          for (const playerIdxStr of Object.keys(this.playerInfoList)) {
            const playerIdx = Number(playerIdxStr);
            const handInputMap = this.getHandInputMapOf({ playerIdx });
            if (handInputMap === undefined)
              throw new Error(`No such player: ${playerIdx}`);

            if (exodia(handInputMap)) {
              return true;
            }
          }
          return false;
        })();

        if (isExodiaTriggered) {
          if (alteredTurn === null) {
            alteredTurn = this.getCurrentTurn() - 1;
          }
          return alteredTurn;
        }

        return this.countTotalHand();
      };

      // gameStatus.isFinished = function () {
      //   const isThisTurnEnded =
      //     this.countFilledCells() % this.countTotalPlayers() === 0;

      //   return isThisTurnEnded && this.isFinishedBase();
      // };
    },
  },
} as const satisfies Record<string, AlterOptionObject>;

let alteredTurn: null | number = null;

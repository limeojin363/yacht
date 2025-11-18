import type { AlterOptionObject } from ".";

export const SpecialHandsExodiaMap = {
  SpecialHandsExodia: {
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
            return (
              targetHandInput !== null &&
              targetHandInput !== undefined &&
              gameStatus
                .getRowInfoOf(rowName)
                .getScoreFrom({ handInputMap }) !== 0
            );
          }
        );
      };

      gameStatus.getPlayerTotalScore = ({ playerName }) => {
        const handInputMap = gameStatus.getHandInputMapOf(playerName);
        if (handInputMap === undefined) throw new Error();

        let totalScore = gameStatus.getBasePlayerTotalScore({ playerName });

        if (exodia(handInputMap)) {
          totalScore += 99999;
        }

        return totalScore;
      };

      gameStatus.isFinished = () => {
        const isThisTurnEnded =
          gameStatus.countFilledCells() % gameStatus.countTotalPlayers() === 0;

        const isExodiaTriggered = gameStatus
          .getPlayerNames()
          .some((playerName) => {
            const handInputMap = gameStatus.getHandInputMapOf(playerName);
            if (handInputMap === undefined) throw new Error();
            return exodia(handInputMap);
          });

        return isThisTurnEnded && isExodiaTriggered;
      };
    },
  },
} as const satisfies Record<string, AlterOptionObject>;

export const NumbersExodiaMap = {
  NumbersExodia: {
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
          if (handInput === undefined) throw new Error();

          if (handInput !== null) {
            numbersScore += gameStatus.getScoreOf({ rowName, playerName: "" });
          }
        }

        return numbersScore >= 90;
      };

      gameStatus.getPlayerTotalScore = ({ playerName }) => {
        const handInputMap = gameStatus.getHandInputMapOf(playerName);
        if (handInputMap === undefined) throw new Error();

        let totalScore = gameStatus.getBasePlayerTotalScore({ playerName });

        if (exodia(handInputMap)) {
          totalScore += 99999;
        }

        return totalScore;
      };

      gameStatus.isFinished = () => {
        const isThisTurnEnded =
          gameStatus.countFilledCells() % gameStatus.countTotalPlayers() === 0;

        const isExodiaTriggered = gameStatus
          .getPlayerNames()
          .some((playerName) => {
            const handInputMap = gameStatus.getHandInputMapOf(playerName);
            if (handInputMap === undefined) throw new Error();
            return exodia(handInputMap);
          });

        return isThisTurnEnded && isExodiaTriggered;
      };
    },
  },
} as const satisfies Record<string, AlterOptionObject>;

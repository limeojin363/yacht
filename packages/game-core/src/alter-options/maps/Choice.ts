import type { AlterOptionObject } from ".";
import { GetDefaultScoreOf } from "../../score";

const ChoiceOptionParamList = [
  [1, 1],
  [2, 1],
  [3, 1],
  [1, 2],
  [2, 2],
  [1, 3],
] as const;

const Postfix = ["_A", "_B", "_C"] as const;

export type ChoiceOptionName =
  (typeof ChoiceOptionParamList)[number] extends infer T
    ? T extends readonly [infer A, infer B]
      ? `${A & number}-CHOICE_x${B & number}`
      : never
    : never;

export const ChoiceOptionMap = ChoiceOptionParamList.reduce(
  (acc, curr) => {
    const name = `${curr[0]}-CHOICE_x${curr[1]}` as ChoiceOptionName;
    acc[name] = {
      description: `CHOICE_x${curr[1]}을 ${curr[0]}개 생성`,
      handDependencies: [],
      onTrigger(gameStatus) {
        for (let i = 0; i < curr[0]; i++) {
          const rowName = `CHOICE_x${curr[1]}_${Postfix[i]}`;
          const handName = rowName;

          gameStatus.addHand({ handName });
          gameStatus.addRowInfo({
            rowName,
            rowInfo: {
              getScoreFrom({ handInputMap }) {
                const handInput = handInputMap[rowName];
                if (handInput === undefined)
                  throw new Error();
                if (handInput === null)
                  return 0;
                return GetDefaultScoreOf.CHOICE(handInput) * curr[1];
              },
              description: `CHOICE_x${curr[1]}_${Postfix[i]}`,
              type: "SINGLE_ALTERED",
            },
          });
        }
      },
    };
    return acc;
  },
  {} as Record<ChoiceOptionName, AlterOptionObject>
);

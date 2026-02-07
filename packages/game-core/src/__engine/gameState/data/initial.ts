import { ColorFactory } from "../../../color/index.js";
import type { GameState } from "../schema/gameState.js";

export const DEFAULT_HAND_LIST = [
  "NUMBERS_1",
  "NUMBERS_2",
  "NUMBERS_3",
  "NUMBERS_4",
  "NUMBERS_5",
  "NUMBERS_6",
  "TRIPLE",
  "FOURCARD",
  "FULLHOUSE",
  "STRAIGHT",
  "YACHT",
  "CHOICE",
] as const;

const DEFAULT_PLAYER_COUNT = 2;

const generateInitialGameState = (
  preset?: Partial<Pick<GameState, "changerMetaList" | "playerBaseInfoList">>
): GameState => {
  const colorFactory = new ColorFactory();

  const getPlayerHandInputMap = () => {
    const map: Record<string, [number, number, number, number, number] | null> =
      {};
    DEFAULT_HAND_LIST.forEach((handName) => {
      map[handName] = null;
    });

    return map;
  };

  const getPlayerBaseInfo = (() => {
    let num = 1;
    const _ = (): { name: string; color: string } => ({
      name: `Player ${num++}`,
      color: colorFactory.generate().getBaseColor(),
    });

    return _;
  })();

  return {
    // dice
    diceSet: [null, null, null, null, null],
    remainingRoll: 3,
    maxRoll: 3,
    holdingLowerLimit: 5,
    holdingUpperLimit: 0,

    // turn
    currentTurn: 1,
    currentPlayerIdx: 0,

    // player
    ...(preset?.playerBaseInfoList
      ? {
          playerBaseInfoList: preset.playerBaseInfoList,
          playerHandInputMapList: Array.from(preset.playerBaseInfoList, () =>
            getPlayerHandInputMap()
          ),
        }
      : {
          playerBaseInfoList: Array.from({ length: DEFAULT_PLAYER_COUNT }, () =>
            getPlayerBaseInfo()
          ),
          playerHandInputMapList: Array.from({ length: DEFAULT_PLAYER_COUNT }, () =>
            getPlayerHandInputMap()
          ),
        }),

    // changer
    ...(preset?.changerMetaList
      ? {
          changerMetaList: preset.changerMetaList,
        }
      : {
          changerMetaList: [],
        }),
  };
};

export default generateInitialGameState;
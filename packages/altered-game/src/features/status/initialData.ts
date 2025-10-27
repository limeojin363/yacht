import _ from "lodash";
import {
  type GameStatusDataPart,
  type PlayerHandSelectionObjectMap,
  type PlayerSelectionObject,
  type UnusableDiceSet,
} from "./types";

export type GamePreset = {
  // TODO: 이 필드 쓰기
  alterOptionInfoList?: never;
  playerNames: string[];
};

export const getInitialDataPart = ({
  playerNames,
}: GamePreset): GameStatusDataPart => {
  const getPlayerInitialStatus = (): PlayerSelectionObject => ({
    NUMBERS_1: null,
    NUMBERS_2: null,
    NUMBERS_3: null,
    NUMBERS_4: null,
    NUMBERS_5: null,
    NUMBERS_6: null,
    TRIPLE: null,
    FOURCARD: null,
    FULLHOUSE: null,
    STRAIGHT: null,
    YACHT: null,
    CHOICE: null,
  });

  const getDicesInitialStatus = (): UnusableDiceSet => [
    null,
    null,
    null,
    null,
    null,
  ];

  const getPlayerHandSelectionObjectMap = (): PlayerHandSelectionObjectMap => {
    const obj: PlayerHandSelectionObjectMap = {};
    playerNames.forEach((name) => (obj[name] = getPlayerInitialStatus()));
    return obj;
  };

  return {
    alterOptions: [],
    playerHandSelectionObjectMap: getPlayerHandSelectionObjectMap(),
    diceSet: getDicesInitialStatus(),
    currentPlayerId: 0,
    remainingRoll: 3,
  };
};

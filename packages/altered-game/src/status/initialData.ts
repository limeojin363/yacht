import _ from "lodash";
import {
  type AlterOption,
  type GameStatusDataPart,
  type PlayerHandSelectionObjectMap,
  type PlayerSelectionObject,
  type UnusableDiceSet,
} from "./types";
import { generateAlterOptions } from "../alter-options";
import generatePlayerColor from "../color";

export type GamePreset = {
  alterOptionMetaList?: AlterOption[];
  playerColors?: string[];
  playerNames: string[];
};

export const getInitialDataPart = ({
  playerNames,
  alterOptionMetaList = generateAlterOptions(),
  playerColors,
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

  const generatePlayerColorMap = () => {
    if (!playerColors) {
      playerColors = Array.from(playerNames, generatePlayerColor);
    }

    const colorMap: Record<string, string> = {};

    for (let i = 0; i < playerNames.length; i++) {
      if (!playerColors[i]) {
        throw new Error("Player colors are not properly defined");
      }

      colorMap[playerNames[i]!] = playerColors[i]!;
    }

    return colorMap;
  };

  return {
    alterOptions: alterOptionMetaList,
    playerHandSelectionObjectMap: getPlayerHandSelectionObjectMap(),
    diceSet: getDicesInitialStatus(),
    currentPlayerId: 0,
    remainingRoll: 3,
    playerColorMap: generatePlayerColorMap(),
  };
};

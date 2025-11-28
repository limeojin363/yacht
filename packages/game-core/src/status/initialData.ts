import _ from "lodash";
import {
  type AlterOption,
  type GameDBPart,
  type HandInputMapType,
  type PlayerInfoMapType,
  type UnusableDiceSet,
} from "./types";
import { generateAlterOptions } from "../alter-options";
import generatePlayerColor from "../color";

export type GamePreset = {
  alterOptionMetaList?: AlterOption[];
  playerColors?: string[];
  playerNames: string[];
};

const getInitialHandInputMap = (): HandInputMapType => ({
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

export const getInitialDataPart = ({
  playerNames,
  alterOptionMetaList = generateAlterOptions(),
}: GamePreset): GameDBPart => {
  const getPlayerInfoMap = (): PlayerInfoMapType => {
    const obj: PlayerInfoMapType = {};
    playerNames.forEach(
      (name) =>
        (obj[name] = {
          color: generatePlayerColor(),
          handInputMap: getInitialHandInputMap(),
        })
    );
    return obj;
  };

  return {
    alterOptionMetaInfoList: alterOptionMetaList,
    diceSet: getDicesInitialStatus(),
    playerInfoMap: getPlayerInfoMap(),
    currentPlayerName: playerNames[0]!,
    remainingRoll: 3,
  };
};

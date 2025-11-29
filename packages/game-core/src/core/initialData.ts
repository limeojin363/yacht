import _ from "lodash";
import {
  type AlterOptionMetaInfo,
  type GameDBPart,
  type HandInputMapType,
  type PlayerInfoType,
  type UnusableDiceSet,
} from "./types";
import { generateAlterOptions } from "../alter-options";
import generatePlayerColor from "../color";

type PlayerPresetType = Pick<PlayerInfoType, "name" | "color">;

export type GamePreset = {
  alterOptionMetaList: AlterOptionMetaInfo[];
  playerPresetList: PlayerPresetType[];
};

export const getInitialHandInputMap = (): HandInputMapType => ({
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

export const getInitialDiceSet = (): UnusableDiceSet => [
  null,
  null,
  null,
  null,
  null,
];

export const getInitialDBPart = (gamePreset: GamePreset): GameDBPart => {
  return {
    diceSet: getInitialDiceSet(),
    remainingRoll: 3,
    currentPlayerIdx: 0,
    playerInfoList: gamePreset.playerPresetList.map((playerPreset) => ({
      name: playerPreset.name,
      color: playerPreset.color,
      handInputMap: getInitialHandInputMap(),
    })),
    alterOptionMetaInfoList: gamePreset.alterOptionMetaList,
  };
};

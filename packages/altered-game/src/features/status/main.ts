import _ from "lodash";
import {
  type GameStatus,
  type PlayerSelectionObject,
  type UnusableDiceSet,
} from "./types";
import { type UserAction } from "../actions/types";
import {
  updateOnRoll,
  updateOnHandSelect,
  updateOnToggleDiceHolding,
} from "../actions/main.js";
import { SELECTABLE_HAND_LIST } from "../../constants";

export const getInitialGameStatus = (totalPlayersNum: number): GameStatus => {
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

  const getInitialPlayerList = (): PlayerSelectionObject[] => {
    return Array.from({ length: totalPlayersNum }, getPlayerInitialStatus);
  };

  return {
    maxHolding: 5,
    maxRoll: 3,
    alterOptions: [],
    handSelectionObjects: getInitialPlayerList(),
    diceSet: getDicesInitialStatus(),
    currentPlayerId: 0,
    remainingRoll: 3,
  };
};

export const getUpdatedGameStatus =
  (status: GameStatus) =>
  ({ type, payload }: UserAction): GameStatus => {
    switch (type) {
      case "HAND-SELECT":
        return updateOnHandSelect(status, payload);
      case "ROLL":
        return updateOnRoll(status, payload);
      case "TOGGLE_DICE_HOLDING":
        return updateOnToggleDiceHolding(status, payload);
    }
  };

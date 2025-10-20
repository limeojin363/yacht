import _ from "lodash";
import {
  type GameStatus,
  type SinglePlayer,
  type PlayersNum,
  type UnavailableDiceSet,
} from "./types";
import { type UserAction } from "../actions/types";
import {
  updateOnRoll,
  updateOnHandSelect,
  updateOnToggleDiceHolding,
} from "../actions/main.js";
import { SELECTABLE_HAND_LIST } from "../../constants";

export const getInitialGameStatus = (
  totalPlayersNum: PlayersNum
): GameStatus => {
  const getPlayerInitialStatus = (): SinglePlayer => ({
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

  const getDicesInitialStatus = (): UnavailableDiceSet => [
    null,
    null,
    null,
    null,
    null,
  ];

  const getInitialPlayerList = (): SinglePlayer[] => {
    return Array.from({ length: totalPlayersNum }, getPlayerInitialStatus);
  };

  return {
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

export const isGameStatusEqual = (a: GameStatus, b: GameStatus) => {
  const areDicesOk = [0, 1, 2, 3, 4].every(
    (i) => a.diceSet[i] === b.diceSet[i]
  );
  const isCurrentPlayerOk = a.currentPlayerId === b.currentPlayerId;
  const isRemainingRerollOk = a.remainingRoll === b.remainingRoll;
  const arePlayersOk = SELECTABLE_HAND_LIST.every(
    (hand) =>
      a.handSelectionObjects[0][hand] === b.handSelectionObjects[0][hand] &&
      a.handSelectionObjects[1][hand] === b.handSelectionObjects[1][hand]
  );

  return areDicesOk && isCurrentPlayerOk && isRemainingRerollOk && arePlayersOk;
};

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
  updateOnSelect,
  updateOnToggleDiceHolding,
} from "../actions/main.js";
import { HAND_LIST } from "../../constants";

export const getInitialGameStatus = (
  totalPlayersNum: PlayersNum
): GameStatus => {
  const getPlayerInitialStatus = (): SinglePlayer => ({
    scores: {
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
    },
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
    scoreObjectList: getInitialPlayerList(),
    diceSet: getDicesInitialStatus(),
    currentPlayerId: 0,
    remainingRoll: 3,
  };
};

export const getUpdatedGameStatus =
  (status: GameStatus) =>
  ({ type, payload }: UserAction): GameStatus => {
    switch (type) {
      case "SELECT":
        return (status = updateOnSelect(status, payload));
      case "ROLL":
        return (status = updateOnRoll(status, payload));
      case "TOGGLE_DICE_HOLDING":
        return (status = updateOnToggleDiceHolding(status, payload));
    }
  };

export const isGameStatusEqual = (a: GameStatus, b: GameStatus) => {
  const areDicesOk = [0, 1, 2, 3, 4].every(
    (i) => a.diceSet[i] === b.diceSet[i]
  );
  const isCurrentPlayerOk = a.currentPlayerId === b.currentPlayerId;
  const isRemainingRerollOk = a.remainingRoll === b.remainingRoll;
  const arePlayersOk = HAND_LIST.every(
    (hand) =>
      a.scoreObjectList[0].scores[hand] === b.scoreObjectList[0].scores[hand] &&
      a.scoreObjectList[1].scores[hand] === b.scoreObjectList[1].scores[hand]
  );

  return areDicesOk && isCurrentPlayerOk && isRemainingRerollOk && arePlayersOk;
};

import type { DiceSet, GameStatus } from "../status/types.js";
import { getDiceEyes, isUnusableDiceSet } from "../utils/index.js";
import type { UserAction, UserActionName } from "./types.js";

type ActionFunction<T extends UserActionName> = (
  gameStatus: GameStatus,
  payload: Extract<UserAction, { type: T }>["payload"]
) => GameStatus;

export const updateOnHandSelect: ActionFunction<"HAND-SELECT"> = (
  {
    diceSet,
    handSelectionObjects,
    currentPlayerId,
    maxHolding,
    maxRoll,
    ...prev
  },
  hand
) => {
  if (isUnusableDiceSet(diceSet))
    throw new Error("Dice have not been rolled yet");

  if (!handSelectionObjects[currentPlayerId]) {
    throw new Error("Player does not exist");
  }

  if (handSelectionObjects[currentPlayerId][hand] !== null) {
    throw new Error("Hand already selected");
  }

  const totalPlayersNum = handSelectionObjects.length;

  return {
    ...prev,
    diceSet: [null, null, null, null, null],
    handSelectionObjects: handSelectionObjects.map(
      (playerSelectionObject, idx) =>
        idx === currentPlayerId
          ? {
              ...playerSelectionObject,
              [hand]: getDiceEyes(diceSet),
            }
          : playerSelectionObject
    ),
    currentPlayerId: (currentPlayerId + 1) % totalPlayersNum,
    remainingRoll: maxRoll,
    maxRoll,
    maxHolding,
  };
};

export const updateOnRoll: ActionFunction<"ROLL"> = (
  {
    handSelectionObjects,
    currentPlayerId,
    remainingRoll,
    alterOptions,
    ...prev
  },
  nextDiceSet
) => {
  if (remainingRoll <= 0) throw new Error("No remaining rolls left");

  return {
    ...prev,
    alterOptions,
    handSelectionObjects,
    remainingRoll: remainingRoll - 1,
    currentPlayerId,
    diceSet: nextDiceSet,
  };
};

export const updateOnToggleDiceHolding: ActionFunction<
  "TOGGLE_DICE_HOLDING"
> = (
  {
    diceSet,
    handSelectionObjects,
    currentPlayerId,
    remainingRoll,
    alterOptions,
    ...prev
  },
  index
) => {
  if (isUnusableDiceSet(diceSet))
    throw new Error("Dice have not been rolled yet");

  return {
    ...prev,
    alterOptions,
    handSelectionObjects,
    currentPlayerId,
    remainingRoll,
    diceSet: diceSet.map((dice, idx) => {
      if (idx !== index) return dice;
      return { eye: dice.eye, held: !dice.held };
    }) as DiceSet,
  };
};

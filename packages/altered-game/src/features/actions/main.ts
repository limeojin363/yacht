import type {
  AvailableDiceSet,
  GameStatus,
  PlayerId,
  RemainingRoll,
} from "../status/types.js";
import { getDiceValues, isUnavailableDiceSet } from "../utils/index.js";
import type { UserAction, UserActionName } from "./types.js";

type ActionFunction<T extends UserActionName> = (
  gameStatus: GameStatus,
  payload: Extract<UserAction, { type: T }>["payload"]
) => GameStatus;

export const updateOnHandSelect: ActionFunction<"HAND-SELECT"> = (
  { diceSet, handSelectionObjects, currentPlayerId, alterOptions },
  hand
) => {
  if (isUnavailableDiceSet(diceSet))
    throw new Error("Dice have not been rolled yet");
  if (handSelectionObjects[currentPlayerId][hand] !== null) {
    throw new Error("Hand already selected");
  }

  const totalPlayersNum = handSelectionObjects.length;

  return {
    alterOptions,
    diceSet: [null, null, null, null, null],
    handSelectionObjects: handSelectionObjects.map((prevItem, idx) => {
      if (idx !== currentPlayerId) return prevItem;
      return {
        ...prevItem,
        [hand]: getDiceValues(diceSet),
      };
    }),
    currentPlayerId: ((currentPlayerId + 1) % totalPlayersNum) as PlayerId,
    remainingRoll: 3,
  };
};

export const updateOnRoll: ActionFunction<"ROLL"> = (
  { handSelectionObjects, currentPlayerId, remainingRoll, alterOptions },
  nextDiceSet
) => {
  if (remainingRoll <= 0) throw new Error("No remaining rolls left");

  return {
    alterOptions,
    handSelectionObjects,
    remainingRoll: (remainingRoll - 1) as RemainingRoll,
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
  },
  index
) => {
  if (isUnavailableDiceSet(diceSet))
    throw new Error("Dice have not been rolled yet");

  return {
    alterOptions,
    handSelectionObjects,
    currentPlayerId,
    remainingRoll,
    diceSet: diceSet.map((dice, idx) => {
      if (idx !== index) return dice;
      return { eye: dice.eye, held: !dice.held };
    }) as AvailableDiceSet,
  };
};

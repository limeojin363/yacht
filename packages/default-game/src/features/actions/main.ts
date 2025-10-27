import { GetScoreOf } from "../score/index.js";
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
  payload: Extract<UserAction, { type: T }>["payload"],
) => GameStatus;

export const updateOnSelect: ActionFunction<"SELECT"> = (
  { diceSet, scoreObjectList, currentPlayerId },
  hand,
) => {
  if (isUnavailableDiceSet(diceSet))
    throw new Error("Dice have not been rolled yet");
  if (scoreObjectList[currentPlayerId][hand] !== null) {
    throw new Error("Hand already selected");
  }

  const totalPlayersNum = scoreObjectList.length;

  return {
    diceSet: [null, null, null, null, null],
    scoreObjectList: scoreObjectList.map((prev, idx) => {
      if (idx !== currentPlayerId) return prev;
      return {
        ...prev,
        [hand]: GetScoreOf[hand](getDiceValues(diceSet)),
      };
    }),
    currentPlayerId: ((currentPlayerId + 1) % totalPlayersNum) as PlayerId,
    remainingRoll: 3,
  };
};

export const updateOnRoll: ActionFunction<"ROLL"> = (
  { scoreObjectList: scoreObjectList, currentPlayerId, remainingRoll },
  nextDiceSet,
) => {
  if (remainingRoll <= 0) throw new Error("No remaining rolls left");

  return {
    scoreObjectList: scoreObjectList,
    remainingRoll: (remainingRoll - 1) as RemainingRoll,
    currentPlayerId,
    diceSet: nextDiceSet,
  };
};

export const updateOnToggleDiceHolding: ActionFunction<
  "TOGGLE_DICE_HOLDING"
> = (
  { diceSet, scoreObjectList: scoreObjectList, currentPlayerId, remainingRoll },
  index,
) => {
  if (isUnavailableDiceSet(diceSet))
    throw new Error("Dice have not been rolled yet");

  return {
    scoreObjectList: scoreObjectList,
    currentPlayerId,
    remainingRoll,
    diceSet: diceSet.map((dice, idx) => {
      if (idx !== index) return dice;
      return { eye: dice.eye, held: !dice.held };
    }) as AvailableDiceSet,
  };
};

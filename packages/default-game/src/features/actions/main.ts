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
  payload: Extract<UserAction, { type: T }>["payload"]
) => GameStatus;

export const updateOnSelect: ActionFunction<"SELECT"> = (
  { diceSet, playerList, currentPlayerId, totalPlayers },
  hand
) => {
  if (isUnavailableDiceSet(diceSet))
    throw new Error("Dice have not been rolled yet");
  if (playerList[currentPlayerId]["scores"][hand] !== null) {
    console.log({ hand });
    console.log({ playerId: currentPlayerId });
    console.log(playerList[currentPlayerId]["scores"][hand]);
    throw new Error("Hand already selected");
  }
  return {
    diceSet: [null, null, null, null, null],
    playerList: playerList.map((player, idx) => {
      if (idx !== currentPlayerId) return player;
      return {
        scores: {
          ...player.scores,
          [hand]: GetScoreOf[hand](getDiceValues(diceSet)),
        },
      };
    }),
    currentPlayerId: ((currentPlayerId + 1) % totalPlayers) as PlayerId,
    remainingRoll: 3,
    totalPlayers,
  };
};

export const updateOnRoll: ActionFunction<"ROLL"> = (
  { playerList, currentPlayerId, totalPlayers, remainingRoll },
  nextDiceSet
) => {
  if (remainingRoll <= 0) throw new Error("No remaining rolls left");

  return {
    playerList,
    remainingRoll: (remainingRoll - 1) as RemainingRoll,
    currentPlayerId,
    totalPlayers,
    diceSet: nextDiceSet,
  };
};

export const updateOnToggleDiceHolding: ActionFunction<
  "TOGGLE_DICE_HOLDING"
> = (
  { diceSet, playerList, currentPlayerId, totalPlayers, remainingRoll },
  index
) => {
  if (isUnavailableDiceSet(diceSet))
    throw new Error("Dice have not been rolled yet");

  return {
    playerList,
    currentPlayerId,
    totalPlayers,
    remainingRoll,
    diceSet: diceSet.map((dice, idx) => {
      if (idx !== index) return dice;
      return { eye: dice.eye, held: !dice.held };
    }) as AvailableDiceSet,
  };
};

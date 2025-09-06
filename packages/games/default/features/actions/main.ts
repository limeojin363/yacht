import GetScoreOf from "../score";
import type {
  AvailableDiceEye,
  AvailableDiceSet,
  GameStatus,
  PlayerId,
  RemainingRoll,
  UnavailableDiceSet,
} from "../status/types";
import type { UserAction, UserActionName } from "./types";

const generateDiceEye = (): AvailableDiceEye => {
  const eyes = [1, 2, 3, 4, 5, 6] as const;
  return eyes[Math.floor(Math.random() * eyes.length)];
};

const generateDiceSet = (): AvailableDiceSet => {
  return [
    { eye: generateDiceEye(), held: false },
    { eye: generateDiceEye(), held: false },
    { eye: generateDiceEye(), held: false },
    { eye: generateDiceEye(), held: false },
    { eye: generateDiceEye(), held: false },
  ];
};

const getDiceValues = (diceSet: AvailableDiceSet) => {
  return diceSet.map((d) => d.eye);
};

const isUnavailableDiceSet = (
  diceSet: AvailableDiceSet | UnavailableDiceSet
): diceSet is UnavailableDiceSet => {
  if (diceSet.every((d) => d === null)) return true;
  return false;
};

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
  if (playerList[currentPlayerId].scores[hand] !== null)
    throw new Error("Hand already selected");

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

export const updateOnRoll: ActionFunction<"ROLL"> = ({
  playerList,
  currentPlayerId,
  totalPlayers,
  remainingRoll,
}) => {
  if (remainingRoll <= 0) throw new Error("No remaining rolls left");

  return {
    playerList,
    remainingRoll: (remainingRoll - 1) as RemainingRoll,
    currentPlayerId,
    totalPlayers,
    diceSet: generateDiceSet(),
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

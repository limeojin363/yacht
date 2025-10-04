import type {
  AvailableDiceEye,
  AvailableDiceSet,
  DiceSet,
  UnavailableDiceSet,
} from "../status";

export const generateDiceEye = (): AvailableDiceEye => {
  const eyes = [1, 2, 3, 4, 5, 6] as const;
  return eyes[Math.floor(Math.random() * eyes.length)];
};

export const generateNextDiceSet = (prev: DiceSet): AvailableDiceSet => {
  if (!isUnavailableDiceSet(prev)) {
    return prev.map((dice) =>
      dice.held ? dice : { eye: generateDiceEye(), held: false }
    ) as AvailableDiceSet;
  }

  return [
    { eye: generateDiceEye(), held: false },
    { eye: generateDiceEye(), held: false },
    { eye: generateDiceEye(), held: false },
    { eye: generateDiceEye(), held: false },
    { eye: generateDiceEye(), held: false },
  ];
};

export const getDiceValues = (diceSet: AvailableDiceSet) => {
  return diceSet.map((d) => d.eye);
};

export const isUnavailableDiceSet = (
  diceSet: DiceSet
): diceSet is UnavailableDiceSet => {
  if (diceSet.every((d) => d === null)) return true;
  return false;
};

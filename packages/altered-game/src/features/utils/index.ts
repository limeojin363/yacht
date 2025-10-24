import type {
  DiceSet,
  DiceSetEyes,
  GameStatus,
  UnusableDiceSet,
  UsableDiceSet,
} from "../status";

export const generateDiceEye = (): number => {
  const eyes = [1, 2, 3, 4, 5, 6] as const;

  return eyes[Math.floor(Math.random() * eyes.length)]!;
};

export const generateNextDiceSet = (prev: DiceSet): UsableDiceSet => {
  if (!isUnusableDiceSet(prev)) {
    return prev.map((dice) =>
      dice.held ? dice : { eye: generateDiceEye(), held: false }
    ) as UsableDiceSet;
  }

  return [
    { eye: generateDiceEye(), held: false },
    { eye: generateDiceEye(), held: false },
    { eye: generateDiceEye(), held: false },
    { eye: generateDiceEye(), held: false },
    { eye: generateDiceEye(), held: false },
  ];
};

export const getDiceEyes = (diceSet: UsableDiceSet): DiceSetEyes => {
  return diceSet.map((d) => d.eye) as DiceSetEyes;
};

export const isUnusableDiceSet = (
  diceSet: DiceSet
): diceSet is UnusableDiceSet => {
  if (diceSet.every((d) => d === null)) return true;
  return false;
};

export const isGameFinished = ({
  handSelectionObjects: scoreObjectList,
}: GameStatus) =>
  scoreObjectList.every((selections) =>
    Object.values(selections).every((selection) => selection !== null)
  );

// TODO: implement ranking calculation
export const getRanking = ({ handSelectionObjects }: GameStatus) => {};

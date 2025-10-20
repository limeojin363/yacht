import type {
  AvailableDiceEye,
  AvailableDiceSet,
  DiceSet,
  GameStatus,
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

export const isGameFinished = ({ handSelectionObjects: scoreObjectList }: GameStatus) =>
  scoreObjectList.every((scores) =>
    Object.values(scores).every((score) => score !== null)
  );

export const getRanking = ({ handSelectionObjects: scoreObjectList}: GameStatus) => {
  const totalPlayersNum = scoreObjectList.length;
  const _ = scoreObjectList
    .map((scores, playerId) => ({
      totalScore: Object.values(scores).reduce(
        (acc, score) => (acc ?? 0) + (score ?? 0),
        0
      ) as number,
      playerId,
    }))
    .sort((a, b) => b.totalScore - a.totalScore);

  const ranks: number[] = Array(totalPlayersNum).fill(0);
  let currentRank = 1;
  let playersWithSameScore = 0;

  for (let i = 0; i < _.length; i++) {
    playersWithSameScore++;
    ranks[_[i].playerId] = currentRank;

    if (i + 1 === _.length || _[i].totalScore !== _[i + 1].totalScore) {
      currentRank += playersWithSameScore;
      playersWithSameScore = 0;
    }
  }

  return ranks;
};

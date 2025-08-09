import ScoreCalculator from "./ScoreCalculator";
import {
  GameStatus,
  AvailableHand,
  SingleUser,
  UnavailableDices,
  AvailableDiceEye,
  DiceIndex,
  AvailableDiceObject,
  UserActionMapType,
  RenderUnitUpdateAction,
} from "./types";

export const HAND_LIST: AvailableHand[] = [
  "NUMBERS_1",
  "NUMBERS_2",
  "NUMBERS_3",
  "NUMBERS_4",
  "NUMBERS_5",
  "NUMBERS_6",
  "TRIPLE",
  "FOURCARD",
  "FULLHOUSE",
  "STRAIGHT",
  "YACHT",
  "CHOICE",
];

export const getInitialGameStatus = (): GameStatus => {
  const getUserInitialStatus = (): SingleUser => ({
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
  const getDicesInitialStatus = (): UnavailableDices => [
    null,
    null,
    null,
    null,
    null,
  ];

  return {
    users: [getUserInitialStatus(), getUserInitialStatus()],
    dices: getDicesInitialStatus(),
    currentUser: 0,
    remainingRoll: 3,
  };
};

const getSingleDiceEye = (): AvailableDiceEye => {
  const eyes = [1, 2, 3, 4, 5, 6] as const;
  return eyes[Math.floor(Math.random() * eyes.length)];
};

const UserActionMap: UserActionMapType = {
  select: ({ hand, dices }, { currentUser }) => {
    const diceValues = dices.map((dice) => dice.eye);

    const calcuatedScore = calculator[hand](diceValues);
    const scoreUpdateAction: RenderUnitUpdateAction = {
      type: "score",
      payload: { hand, score: calcuatedScore },
    };

    const diceUpdateActions: RenderUnitUpdateAction[] = dices.map(
      (_, index) => ({
        type: "dice",
        payload: {
          index: index as DiceIndex,
          dice: null,
        },
      })
    );

    const remainingRollAction: RenderUnitUpdateAction = {
      type: "remainingRoll",
      payload: 3,
    };

    const currentUserAction: RenderUnitUpdateAction = {
      type: "currentUser",
      payload: ((currentUser + 1) % 2) as 1 | 0,
    };

    return [
      scoreUpdateAction,
      ...diceUpdateActions,
      remainingRollAction,
      currentUserAction,
    ];
  },
  roll: (_, { dices }) => {
    const diceUpdateActions: RenderUnitUpdateAction[] = [];

    const fixedDiceIndexes = dices
      .filter((dice) => dice && dice.fixed)
      .map((_, index) => index as DiceIndex);

    for (let i = 0; i < 5; i++) {
      if (fixedDiceIndexes.includes(i as DiceIndex)) continue;
      const newDice: AvailableDiceObject = {
        eye: getSingleDiceEye(),
        fixed: false,
      };
      diceUpdateActions.push({
        type: "dice",
        payload: { index: i as DiceIndex, dice: newDice },
      });
    }

    return diceUpdateActions;
  },
  "toggle-dice": (index, { dices }) => {
    const diceUpdateAction: RenderUnitUpdateAction = {
      type: "dice",
      payload: {
        index: index as DiceIndex,
        dice: dices[index] ? null : { eye: getSingleDiceEye(), fixed: false },
      },
    };

    return [diceUpdateAction];
  },
};
 

const calculator = new ScoreCalculator();

export const Game = (() => {
  const data: GameStatus = getInitialGameStatus();

  return {
    getData: () => data,
    
  };
})();

export const isGameStatusEqual = (a: GameStatus, b: GameStatus) => {
  const isDicesOk = [0, 1, 2, 3, 4].every((i) => a.dices[i] === b.dices[i]);
  const isCurrentUserOk = a.currentUser === b.currentUser;
  const isRemainingRerollOk = a.remainingRoll === b.remainingRoll;
  const isUsersOk = HAND_LIST.every(
    (hand) =>
      a.users[0].scores[hand] === b.users[0].scores[hand] &&
      a.users[1].scores[hand] === b.users[1].scores[hand]
  );

  return isDicesOk && isCurrentUserOk && isRemainingRerollOk && isUsersOk;
};

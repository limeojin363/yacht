import _ from "lodash";
import ScoreCalculator from "./ScoreCalculator";
import type {
  GameStatus,
  AvailableHand,
  SinglePlayerType,
  UnavailableDices,
  AvailableDiceEye,
  DiceIndex,
  AvailableDiceObject,
  PlayerActionMapType,
  RenderUnitUpdateAction,
  PlayerActionName,
  PlayerActionPayloadTypes,
  RemainingRoll,
  TotalPlayers,
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

export const getInitialGameStatus = (totalPlayers: TotalPlayers): GameStatus => {
  const getPlayerInitialStatus = (): SinglePlayerType => ({
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

  const getInitialPlayerList = (): SinglePlayerType[] => {
    return Array.from({ length: totalPlayers }, getPlayerInitialStatus);
  };

  return {
    totalPlayers,
    playerList: getInitialPlayerList(),
    dices: getDicesInitialStatus(),
    currentPlayerId: 0,
    remainingRoll: 3,
  };
};

const getSingleDiceEye = (): AvailableDiceEye => {
  const eyes = [1, 2, 3, 4, 5, 6] as const;
  return eyes[Math.floor(Math.random() * eyes.length)];
};

const PlayerActionMap: PlayerActionMapType = {
  select: (hand, { currentPlayerId, dices, playerList, totalPlayers }) => {
    if (dices.some((dice) => dice === null)) return [];
    const isHandAlreadySelected = playerList[currentPlayerId].scores[hand] !== null;
    if (isHandAlreadySelected) return [];

    const diceValues = dices.map((dice) => dice!.eye);

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

    const currentPlayerAction: RenderUnitUpdateAction = {
      type: "currentPlayerId",
      payload: ((currentPlayerId + 1) % totalPlayers) as 1 | 0,
    };

    return [
      scoreUpdateAction,
      ...diceUpdateActions,
      remainingRollAction,
      currentPlayerAction,
    ];
  },
  roll: (_, { dices, remainingRoll }) => {
    const diceUpdateActions: RenderUnitUpdateAction[] = [];

    const heldDiceIndexes = (() => {
      const heldIndexes: DiceIndex[] = [];
      for (let i = 0; i < 5; i++) {
        if (dices[i] && dices[i]?.held) {
          heldIndexes.push(i as DiceIndex);
        }
      }
      return heldIndexes;
    })();

    for (let i = 0; i < 5; i++) {
      if (heldDiceIndexes.includes(i as DiceIndex)) continue;
      const newDice: AvailableDiceObject = {
        eye: getSingleDiceEye(),
        held: false,
      };
      diceUpdateActions.push({
        type: "dice",
        payload: { index: i as DiceIndex, dice: newDice },
      });
    }

    const decreaseRollCount: RenderUnitUpdateAction = {
      type: "remainingRoll",
      payload: (remainingRoll > 0 ? remainingRoll - 1 : 0) as RemainingRoll,
    };

    return [...diceUpdateActions, decreaseRollCount];
  },
  "toggle-dice-holding": (index, { dices }) => {
    const diceUpdateAction: RenderUnitUpdateAction = {
      type: "dice",
      payload: {
        index,
        dice: !dices[index]
          ? null
          : { eye: dices[index].eye, held: !dices[index].held },
      },
    };

    return [diceUpdateAction];
  },
};

const calculator = new ScoreCalculator();

export const Game = {
  getUpdateActionsFromPlayerAction: <P extends PlayerActionName>(
    type: P,
    payload: PlayerActionPayloadTypes[P],
    statusData: GameStatus
  ) => PlayerActionMap[type](payload, statusData),
  dispatch: (actions: RenderUnitUpdateAction[], statusData: GameStatus) => {
    const newStatusData = _.cloneDeep(statusData);

    actions.forEach((action) => {
      switch (action.type) {
        case "score":
          newStatusData.playerList[newStatusData.currentPlayerId].scores[
            action.payload.hand
          ] = action.payload.score;
          break;
        case "dice":
          newStatusData.dices[action.payload.index] = action.payload.dice;
          break;
        case "remainingRoll":
          newStatusData.remainingRoll = action.payload;
          break;
        case "currentPlayerId":
          newStatusData.currentPlayerId = action.payload;
          break;
      }
    });

    return newStatusData;
  },
};

export const isGameStatusEqual = (a: GameStatus, b: GameStatus) => {
  const areDicesOk = [0, 1, 2, 3, 4].every((i) => a.dices[i] === b.dices[i]);
  const isCurrentPlayerOk = a.currentPlayerId === b.currentPlayerId;
  const isRemainingRerollOk = a.remainingRoll === b.remainingRoll;
  const arePlayersOk = HAND_LIST.every(
    (hand) =>
      a.playerList[0].scores[hand] === b.playerList[0].scores[hand] &&
      a.playerList[1].scores[hand] === b.playerList[1].scores[hand]
  );

  return areDicesOk && isCurrentPlayerOk && isRemainingRerollOk && arePlayersOk;
};

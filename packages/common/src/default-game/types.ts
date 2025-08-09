export type AvailableDiceEye = 1 | 2 | 3 | 4 | 5 | 6;

export type AvailableDiceObject = {
  eye: AvailableDiceEye;
  fixed: boolean;
};

export type AvailableHand =
  | `NUMBERS_${AvailableDiceEye}`
  | "TRIPLE"
  | "FOURCARD"
  | "FULLHOUSE"
  | "STRAIGHT"
  | "YACHT"
  | "CHOICE";

export type SingleUser = {
  scores: Record<AvailableHand, number | null>;
};

export type AvailableDices =
  | [
      AvailableDiceObject,
      AvailableDiceObject,
      AvailableDiceObject,
      AvailableDiceObject,
      AvailableDiceObject
    ];

export type UnavailableDices = [null, null, null, null, null];

export type DiceIndex = 0 | 1 | 2 | 3 | 4;

export type Dices = AvailableDices | UnavailableDices;

export type GameStatus = {
  users: [SingleUser, SingleUser];
  dices: Dices;
  currentUser: 0 | 1;
  remainingRoll: 3 | 2 | 1 | 0;
};

type UserActionPayloadTypes = {
  select: { hand: AvailableHand; dices: AvailableDices };
  roll: void;
  "toggle-dice": DiceIndex;
};

export type UserActionName = keyof UserActionPayloadTypes;

export type UserActionMapType = {
  [P in keyof UserActionPayloadTypes]: (
    payload: UserActionPayloadTypes[P],
    status: GameStatus
  ) => RenderUnitUpdateAction[];
};

type RenderUnitPayloadTypes = {
  dice: { index: DiceIndex; dice: null | AvailableDiceObject };
  score: { hand: AvailableHand; score: number };
  remainingRoll: 3 | 2 | 1 | 0;
  currentUser: 1 | 0;
};

export type RenderUnitUpdateActionName = keyof RenderUnitPayloadTypes;

export type RenderUnitUpdateActionMapType = {
  [P in RenderUnitUpdateActionName]: (
    payload: RenderUnitPayloadTypes[P],
    status: GameStatus
  ) => void;
};

export type RenderUnitUpdateAction = {
  [K in keyof RenderUnitPayloadTypes]: {
    type: K;
    payload: RenderUnitPayloadTypes[K];
  }
}[keyof RenderUnitPayloadTypes];

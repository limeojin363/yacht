
// export type TotalPlayers = 2 | 3 | 4;

// export type PlayerIdType = 0 | 1 | 2 | 3;

// export type RemainingRoll = 3 | 2 | 1 | 0;

// export type AvailableDiceEye = 1 | 2 | 3 | 4 | 5 | 6;

// export type AvailableDiceObject = {
//   eye: AvailableDiceEye;
//   held: boolean;
// };

// export type AvailableHand =
//   | `NUMBERS_${AvailableDiceEye}`
//   | "TRIPLE"
//   | "FOURCARD"
//   | "FULLHOUSE"
//   | "STRAIGHT"
//   | "YACHT"

//   | "CHOICE";

// export type SinglePlayerType = {
//   scores: Record<AvailableHand, number | null>;
// };

// export type AvailableDices =
//   | [
//       AvailableDiceObject,
//       AvailableDiceObject,
//       AvailableDiceObject,
//       AvailableDiceObject,
//       AvailableDiceObject
//     ];

// export type UnavailableDices = [null, null, null, null, null];

// export type DiceIndex = 0 | 1 | 2 | 3 | 4;

// export type Dices = AvailableDices | UnavailableDices;

// export type GameStatus = {
//   totalPlayers: TotalPlayers;
//   playerList: SinglePlayerType[];
//   dices: Dices;
//   currentPlayerId: PlayerIdType;
//   remainingRoll: RemainingRoll;
// };

// export type PlayerActionPayloadTypes = {
//   select: AvailableHand;
//   roll: void;
//   "toggle-dice-holding": DiceIndex;
// };

// export type PlayerActionName = keyof PlayerActionPayloadTypes;

// export type PlayerActionMapType = {
//   [P in keyof PlayerActionPayloadTypes]: (
//     payload: PlayerActionPayloadTypes[P],
//     status: GameStatus
//   ) => RenderUnitUpdateAction[];
// };

// type RenderUnitPayloadTypes = {
//   dice: { index: DiceIndex; dice: null | AvailableDiceObject };
//   score: { hand: AvailableHand; score: number };
//   remainingRoll: RemainingRoll;
//   currentPlayerId: PlayerIdType;
// };

// export type RenderUnitUpdateActionName = keyof RenderUnitPayloadTypes;

// export type RenderUnitUpdateActionMapType = {
//   [P in RenderUnitUpdateActionName]: (
//     payload: RenderUnitPayloadTypes[P],
//     status: GameStatus
//   ) => void;
// };

// export type RenderUnitUpdateAction = {
//   [K in keyof RenderUnitPayloadTypes]: {
//     type: K;
//     payload: RenderUnitPayloadTypes[K];
//   };
// }[keyof RenderUnitPayloadTypes];

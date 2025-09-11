import { type AvailableHand, type DiceIndex } from "../status/types";

export type UserAction =
  | { type: "SELECT"; payload: AvailableHand }
  | { type: "ROLL"; payload?: void }
  | { type: "TOGGLE_DICE_HOLDING"; payload: DiceIndex };

export type UserActionName = UserAction["type"];


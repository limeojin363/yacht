import {
  getInitialGameStatus,
  type AvailableDiceObject,
  type AvailableHand,
  type DiceIndex,
  type GameStatus,
  type PlayerId,
} from "@yacht/games";

import type { Atom } from "jotai";
import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
const gameRootAtom = atom<GameStatus>(getInitialGameStatus(4));

const scoreAtomFamily = atomFamily<
  { playerId: PlayerId; hand: AvailableHand },
  Atom<number | null>
>(({ hand, playerId }) =>
  atom((get) => get(gameRootAtom).playerList[playerId].scores[hand])
);

const currentPlayerIdAtom = atom((get) => get(gameRootAtom).currentPlayerId);

export { scoreAtomFamily, currentPlayerIdAtom };

const diceSetAtom = atom((get) => get(gameRootAtom).diceSet);

const diceAtomFamily = atomFamily<DiceIndex, Atom<AvailableDiceObject | null>>(
  (index) => atom((get) => get(diceSetAtom)[index])
);

export { diceSetAtom, diceAtomFamily };

export default gameRootAtom;

import {
  getInitialGameStatus,
  type AvailableDiceObject,
  type AvailableHand,
  type DiceIndex,
  type GameStatus,
  type PlayerIdType,
} from "common/default-game";
import type { Atom } from "jotai";
import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

const gameRootAtom = atom<GameStatus>(getInitialGameStatus(4));

const scoreAtomFamily = atomFamily<
  { playerId: PlayerIdType; hand: AvailableHand },
  Atom<number | null>
>(({ hand, playerId }) =>
  atom((get) => get(gameRootAtom).playerList[playerId].scores[hand])
);

const currentPlayerIdAtom = atom((get) => get(gameRootAtom).currentPlayerId);

export { scoreAtomFamily, currentPlayerIdAtom };

const diceSetAtom = atom((get) => get(gameRootAtom).dices);

const diceAtomFamily = atomFamily<DiceIndex, Atom<AvailableDiceObject | null>>(
  (index) => atom((get) => get(diceSetAtom)[index])
);

export { diceSetAtom, diceAtomFamily };

export default gameRootAtom;

// 탑다운 or 바텀업 고민중

// 탑다운으로 설계한다 치자. update 로직은 common에서 가져온 것으로.
// 그럼 common의 모델은 immutable한 설계로 구성되도록 변경해야 한다.
// derived state의 재계산은 어떻게 이루어지나? 렌더링 방지는 잘 되나? JS에 과한 부하가 걸리지는 않는가?
// jotai derived atom이 어떻게 구현되어 있는지 살펴봐야 한다.

// 바텀업으로 설계한다 치자. update 로직은 atom을 직접 조작해야 하게 되므로 client에서 작성.
// 생각해보면 바텀업이 아니라 그냥 "바텀" 아닌가..

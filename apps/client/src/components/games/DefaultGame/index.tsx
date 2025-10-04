import {
  getInitialGameStatus,
  type AvailableHand,
  type DiceIndex,
  type GameStatus,
  type PlayerId,
} from "@yacht/default-game";
import { createContext } from "react";
import DiceArea from "./DiceArea";
import ScoreTable from "./ScoreTable";
import type { Player } from "../../../pages/games/DefaultGame_MultipleDevice/WaitingRoom";

export type DefaultGameContextValues = {
  gameStatus: GameStatus;
  playerList: Player[];
  isMyTurn: boolean;
  onClickCell: (handName: AvailableHand, playerId: PlayerId) => void;
  onClickDice: (diceIndex: DiceIndex) => void;
  onClickRoll: () => void;
};

export const DefaultGameContext = createContext<DefaultGameContextValues>({
  gameStatus: getInitialGameStatus(2),
  playerList: [],
  isMyTurn: false,
  onClickCell: () => {},
  onClickDice: () => {},
  onClickRoll: () => {},
});

// 리스너 동작은 별도의 의존성 주입이 필요하다
// 여기에서는 화면 그리기와 리스너 부착만 진행
const DefaultGame = (contextValues: DefaultGameContextValues) => {
  return (
    <DefaultGameContext.Provider value={contextValues}>
      <ScoreTable />
      <DiceArea />
    </DefaultGameContext.Provider>
  );
};

export default DefaultGame;

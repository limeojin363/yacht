import {
  getInitialGameStatus,
  isGameFinished,
  type AvailableHand,
  type DiceIndex,
  type GameStatus,
  type PlayerId,
} from "@yacht/default-game";
import { createContext, useEffect, useState } from "react";
import DiceArea from "./DiceArea";
import ScoreTable from "./ScoreTable";
import type { Player } from "../../../routes/_authenticated-only/multiple-device/default-game.$gameId/-components/page";
import ResultView from "./ResultView";
import AlertModal from "../../modal/AlertModal";

export type DefaultGameContextValues = {
  gameStatus: GameStatus;
  playerList: Player[];
  isMyTurn: boolean;
  onClickCell: (handName: AvailableHand, playerId: PlayerId) => void;
  onClickDice: (diceIndex: DiceIndex) => void;
  onClickRoll: () => void;
  onExit: () => void;
};

export const DefaultGameContext = createContext<DefaultGameContextValues>({
  gameStatus: getInitialGameStatus(2),
  playerList: [],
  isMyTurn: false,
  onClickCell: () => {},
  onClickDice: () => {},
  onClickRoll: () => {},
  onExit: () => {},
});

// 리스너 동작은 별도의 의존성 주입이 필요하다
// 여기에서는 화면 그리기와 리스너 부착만 진행
const DefaultGame = ({
  gameStatus,
  isMyTurn,
  onClickCell,
  onClickDice,
  onClickRoll,
  onExit,
  playerList,
}: DefaultGameContextValues) => {
  const [resultModalVisible, setResultModalVisible] = useState(false);
  useEffect(() => {
    if (isGameFinished(gameStatus)) {
      console.log("FINISH");
      setTimeout(() => {
        setResultModalVisible(true);
      });
    }
  }, [gameStatus, setResultModalVisible]);

  return (
    <DefaultGameContext.Provider
      value={{
        gameStatus,
        isMyTurn,
        playerList,
        onClickCell,
        onClickDice,
        onClickRoll,
        onExit,
      }}
    >
      <button onClick={onExit}>Exit</button>
      <ScoreTable />
      <DiceArea />
      {resultModalVisible && (
        <AlertModal onConfirm={onExit}>
          <ResultView />
        </AlertModal>
      )}
    </DefaultGameContext.Provider>
  );
};

export default DefaultGame;

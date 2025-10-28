import { useEffect, useState } from "react";
import { GameContext, type GameContextValues } from "./context";
import AlertModal from "../../modal/AlertModal";
import ResultView from "./ResultView";
import ScoreTable from "./ScoreTable";
import DiceArea from "./DiceArea";

const GameComponent = (contextValues: GameContextValues) => {
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const isFinished = contextValues.gameStatus.isFinished;

  useEffect(() => {
    if (isFinished) setResultModalVisible(true);
  }, [isFinished]);

  return (
    <GameContext.Provider value={contextValues}>
      <button onClick={contextValues.onExit}>Exit</button>
      <ScoreTable />
      <DiceArea />
      {resultModalVisible && (
        <AlertModal onConfirm={contextValues.onExit}>
          <ResultView />
        </AlertModal>
      )}
    </GameContext.Provider>
  );
};

export default GameComponent;

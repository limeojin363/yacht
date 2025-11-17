import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { GameContext, type GameContextValues } from "./context";
import AlertModal from "../../modal/AlertModal";
import ResultView from "./ResultView";
import ScoreTable from "./ScoreTable";
import DiceArea from "./DiceArea";
import TopArea from "./TopArea";

const GameComponent = (contextValues: GameContextValues) => {
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const isFinished = contextValues.gameStatus.isFinished;

  useEffect(() => {
    if (isFinished) setResultModalVisible(true);
  }, [isFinished]);

  return (
    <GameContext.Provider value={contextValues}>
      <S.Root>
        <S.TopWrapper>
          <TopArea />
        </S.TopWrapper>
        <S.TableWrapper>
          <ScoreTable />
        </S.TableWrapper>
        <S.DiceAreaWrapper>
          <DiceArea />
        </S.DiceAreaWrapper>
        {resultModalVisible && (
          <AlertModal onConfirm={contextValues.onExit}>
            <ResultView />
          </AlertModal>
        )}
      </S.Root>
    </GameContext.Provider>
  );
};

export default GameComponent;

const S = {
  Root: styled.div`
    width: 100vw;
    height: 100vh;

    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  TopWrapper: styled.div`
    flex: 1;

    position: relative;
    background: #c5c5c526;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  TableWrapper: styled.div`
    flex: 7;

    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  DiceAreaWrapper: styled.div`
    flex: 1.5;
  `,
};

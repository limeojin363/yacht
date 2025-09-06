import styled from "@emotion/styled";
import { createStore, Provider } from "jotai";
import { useMemo } from "react";
import gameRootAtom from "../stores";
import ScoreTable from "./ScoreTable";
import DiceArea from "./DiceArea";
import { getInitialGameStatus, type TotalPlayersNum } from "@yacht/games/default";

const GameRootComponent = ({
  totalPlayers,
}: {
  totalPlayers: TotalPlayersNum;
}) => {
  const store = useMemo(() => {
    const _ = createStore();
    _.set(gameRootAtom, getInitialGameStatus(totalPlayers));

    return _;
  }, [totalPlayers]);

  return (
    <Provider store={store}>
      <S.Root>
        <ScoreTable totalPlayers={totalPlayers} />
        <DiceArea />
      </S.Root>
    </Provider>
  );
};

export default GameRootComponent;

const S = {
  Root: styled.div`
    height: 100vh;
    width: 100vw;

    display: flex;
    flex-direction: column;

    user-select: none;
  `,
};

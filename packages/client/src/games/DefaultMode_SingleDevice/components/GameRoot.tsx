import styled from "@emotion/styled";
import { getInitialGameStatus, type TotalPlayers } from "common/default-mode";
import { createStore, Provider } from "jotai";
import { useMemo } from "react";
import gameRootAtom from "../stores";
import ScoreTable from "./ScoreTable";
import DiceArea from "./DiceArea";

const GameRootComponent = ({
  totalPlayers,
}: {
  totalPlayers: TotalPlayers;
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
    display: flex;
    flex-direction: column;
  `,
};

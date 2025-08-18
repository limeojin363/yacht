import styled from "@emotion/styled";
import HandNameColumn from "./HandNameColumn";
import PlayerColumn from "./PlayerColumn";
import DiceArea from "./DiceArea";
import { getInitialGameStatus, type PlayerIdType, type TotalPlayers } from "common/default-mode";
import { createStore, Provider } from "jotai";
import { useMemo } from "react";
import gameRootAtom from "../stores";

const Game = ({ totalPlayers }: { totalPlayers: TotalPlayers }) => {
  // TODO: 더 세련된 구현과 타입 가드, 유틸리티 함수로의 분리?
  const playerIdList = (() => {
    const playerIdList: PlayerIdType[] = [];
    for (let i = 0; i < totalPlayers; i++) {
      playerIdList.push(i as PlayerIdType);
    }
    return playerIdList;
  })();

  const store = useMemo(() => {
    const _ = createStore();
    _.set(gameRootAtom, getInitialGameStatus(totalPlayers));

    return _;
  },[totalPlayers])

  return (
    <Provider store={store}>
      <S.Root>
        <HandNameColumn />
        {playerIdList.map((playerId) => (
          <PlayerColumn key={`player${playerId}`} playerId={playerId} />
        ))}
        <DiceArea />
      </S.Root>
    </Provider>
  );
};

export default Game;

const S = {
  Root: styled.div`
    display: flex;
    flex-direction: row;
  `,
};

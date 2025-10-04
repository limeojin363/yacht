import styled from "@emotion/styled";
import NameColumn from "./NameColumn";
import { use } from "react";
import { DefaultGameContext } from "..";
import type { PlayerId } from "@yacht/default-game";
import PlayerColumn from "./PlayerColumn";

const ScoreTable = () => {
  const { gameStatus } = use(DefaultGameContext);
  const playerIdList = (() => {
    const _: PlayerId[] = [];
    for (let i = 0; i < gameStatus.totalPlayers; i++) {
      _.push(i as PlayerId);
    }
    return _;
  })();

  return (
    <S.Root>
      <NameColumn />
      {playerIdList.map((playerId) => (
        <PlayerColumn key={`player${playerId}`} playerId={playerId} />
      ))}
    </S.Root>
  );
};

const S = {
  Root: styled.div`
    padding: 8px 16px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 8px;
    height: 80vh;
  `,
};

export default ScoreTable;

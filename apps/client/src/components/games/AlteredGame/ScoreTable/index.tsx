import styled from "@emotion/styled";
import SideNameColumn from "./RowNameColumn";
import PlayerScoreColumn from "./PlayerScoreColumn";
import { use } from "react";
import { GameContext } from "../context";

const ScoreTable = () => {
  const { game: gameStatus } = use(GameContext);

  return (
    <S.Root>
      <SideNameColumn />
      {gameStatus.getPlayerNames().map((playerName) => (
        <PlayerScoreColumn key={playerName} playerName={playerName} />
      ))}
    </S.Root>
  );
};

export default ScoreTable;

const S = {
  Root: styled.div`
    display: flex;
    gap: 8px;

    height: 100%;
    width: 95%;
  `,
};

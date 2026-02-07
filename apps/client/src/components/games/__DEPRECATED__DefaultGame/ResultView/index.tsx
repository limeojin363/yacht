import styled from "@emotion/styled";
import { DefaultGameContext } from "..";
import { use } from "react";
import { getRanking } from "@yacht/default-game";

const ResultView = () => {
  const { gameStatus, playerList } = use(DefaultGameContext);
  const ranking = getRanking(gameStatus);

  return (
    <S.Root>
      {playerList.map(({ playerId, username }) => (
        <S.PlayerItem>
          {username}: {ranking[playerId]}
        </S.PlayerItem>
      ))}
    </S.Root>
  );
};

const S = {
  Root: styled.div`
    /* FILL HERE */
  `,
  PlayerItem: styled.div``,
};

export default ResultView;

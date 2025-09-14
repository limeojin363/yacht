import styled from "@emotion/styled";
import HandNameColumn from "./HandNameColumn";
import PlayerColumn from "./PlayerColumn";
import type { PlayerId, TotalPlayersNum } from "@yacht/default-game";

const ScoreTable = ({ totalPlayers }: { totalPlayers: TotalPlayersNum }) => {
  // TODO: 더 세련된 구현과 타입 가드, 유틸리티 함수로의 분리?
  const playerIdList = (() => {
    const playerIdList: PlayerId[] = [];
    for (let i = 0; i < totalPlayers; i++) {
      playerIdList.push(i as PlayerId);
    }
    return playerIdList;
  })();

  return (
    <S.Root>
      <HandNameColumn />
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

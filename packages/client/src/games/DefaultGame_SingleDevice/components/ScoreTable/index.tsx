import styled from "@emotion/styled";
import HandNameColumn from "./HandNameColumn";
import type { PlayerIdType, TotalPlayers } from "common/default-game";
import PlayerColumn from "./PlayerColumn";

const ScoreTable = ({ totalPlayers }: { totalPlayers: TotalPlayers }) => {
  // TODO: 더 세련된 구현과 타입 가드, 유틸리티 함수로의 분리?
  const playerIdList = (() => {
    const playerIdList: PlayerIdType[] = [];
    for (let i = 0; i < totalPlayers; i++) {
      playerIdList.push(i as PlayerIdType);
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

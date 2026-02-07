import styled from "@emotion/styled";
import type { PlayerId } from "@yacht/default-game";
import { DefaultGameContext } from "..";
import { use } from "react";

const PlayerNameCell = ({ playerId }: { playerId: PlayerId }) => {
  const { playerList } = use(DefaultGameContext);

  return <S.Cell>{playerList[playerId].username}</S.Cell>;
};

const S = {
  Cell: styled.div`
    flex: 1;

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);
    background-color: #949494;
  `,
};

export default PlayerNameCell;

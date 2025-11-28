import styled from "@emotion/styled";
import { use } from "react";
import { GameContext } from "../../context";
import RowScoreCell from "./RowScoreCell";
import TotalScoreCell from "./TotalScoreCell";

const PlayerNameCell = ({ playerName }: { playerName: string }) => {
  return <S.PlayerNameCell>{playerName}</S.PlayerNameCell>;
};

const PlayerScoreColumn = ({ playerName }: { playerName: string }) => {
  const { game } = use(GameContext);

  return (
    <S.Root>
      <PlayerNameCell playerName={playerName} />
      {game.getRowNameList().map((rowName) => (
        <RowScoreCell
          key={`${playerName}-${rowName}`}
          playerName={playerName}
          rowName={rowName}
        />
        
      ))}
      <TotalScoreCell playerName={playerName} />
    </S.Root>
  );
};

const S = {
  Root: styled.div`
    flex: 1;

    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  PlayerNameCell: styled.div`
    flex: 1;

    display: flex;
    justify-content: center;
    align-items: center;

    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);

    font-weight: bold;
    font-size: 1.3rem;
  `,
};

export default PlayerScoreColumn;

import styled from "@emotion/styled";
import { use } from "react";
import { GameContext } from "../../context";
import RowScoreCell from "./RowScoreCell";

const PlayerNameCell = ({ playerName }: { playerName: string }) => {
  return <S.PlayerNameCell>{playerName}</S.PlayerNameCell>;
};

const getSorted = (rowNames: string[]) => {
  const upperRows = rowNames.filter((name) => name.startsWith("NUMBERS_"));
  const lowerRows = rowNames.filter((name) => !name.startsWith("NUMBERS_"));

  return [...upperRows, ...lowerRows];
};

const TotalCell = () => {};

const PlayerScoreColumn = ({ playerName }: { playerName: string }) => {
  const {
    gameStatus: { rowNames },
  } = use(GameContext);

  return (
    <S.Root>
      <PlayerNameCell playerName={playerName} />
      {getSorted(rowNames).map((rowName) => (
        <RowScoreCell
          key={`${playerName}-${rowName}`}
          playerName={playerName}
          rowName={rowName}
        />
      ))}
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

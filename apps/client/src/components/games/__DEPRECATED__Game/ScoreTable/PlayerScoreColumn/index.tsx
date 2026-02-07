import styled from "@emotion/styled";
import { use } from "react";
import { GameContext } from "../../context";
import RowScoreCell from "./RowScoreCell";
import TotalScoreCell from "./TotalScoreCell";
import { Color, type HexColor } from "@yacht/game-core";

const PlayerNameCell = ({ playerIdx }: { playerIdx: number }) => {
  const { game } = use(GameContext);
  const playerColor = game.getColorOf({ playerIdx });

  return (
    <S.PlayerNameCell playerColor={playerColor}>
      {game.playerInfoList[playerIdx].name}
    </S.PlayerNameCell>
  );
};

const PlayerScoreColumn = ({ playerIdx }: { playerIdx: number }) => {
  const { game } = use(GameContext);

  return (
    <S.Root>
      <PlayerNameCell playerIdx={playerIdx} />
      {game.getRowNameList().map((rowName) => (
        <RowScoreCell
          key={`${game.playerInfoList[playerIdx].name}-${rowName}`}
          playerIdx={playerIdx}
          rowName={rowName}
        />
      ))}
      <TotalScoreCell playerIdx={playerIdx} />
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
  PlayerNameCell: styled.div<{ playerColor: HexColor }>`
    flex: 1.5;

    display: flex;
    justify-content: center;
    align-items: center;

    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);

    font-weight: bold;
    font-size: 1.3rem;

    background-color: ${({ playerColor }) =>
      new Color(playerColor).getColor({ lightness: 0.3, alpha: 0.3 })};
    color: #000000;
  `,
};

export default PlayerScoreColumn;

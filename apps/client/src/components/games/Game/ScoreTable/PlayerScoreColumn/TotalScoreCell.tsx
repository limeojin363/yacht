import styled from "@emotion/styled";
import { use } from "react";
import { GameContext } from "../../context";
import { Color, type HexColor } from "@yacht/game-core";

const TotalScoreCell = ({ playerIdx }: { playerIdx: number }) => {
  const { game } = use(GameContext);
  const playerColor = game.getColorOf({ playerIdx });
  const totalScore = game.getPlayerTotalScore({ playerIdx });

  return <S.Root playerColor={playerColor}>{totalScore}</S.Root>;
};

const S = {
  Root: styled.div<{ playerColor: HexColor }>`
    flex: 1.5;

    display: flex;
    justify-content: center;
    align-items: center;

    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);

    font-weight: bold;
    font-size: 2.2rem;
    background-color: ${({ playerColor }) =>
      new Color(playerColor).getColor({ lightness: 0.3, alpha: 0.8 })};
  `,
};

export default TotalScoreCell;

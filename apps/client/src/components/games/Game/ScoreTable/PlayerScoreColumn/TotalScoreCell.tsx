import styled from "@emotion/styled";
import { use } from "react";
import { GameContext } from "../../context";

const TotalScoreCell = ({ playerIdx }: { playerIdx: number }) => {
  const { game } = use(GameContext);
  const playerColor = game.getColorOf({ playerIdx });
  const totalScore = game.getPlayerTotalScore({ playerIdx });

  return <S.Root playerColor={playerColor}>{totalScore}</S.Root>;
};

const S = {
  Root: styled.div<{ playerColor: string }>`
    flex: 1;

    display: flex;
    justify-content: center;
    align-items: center;

    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);

    font-weight: bold;
    font-size: 1.8rem;
    background-color: ${({ playerColor }) => playerColor}90;
  `,
};

export default TotalScoreCell;

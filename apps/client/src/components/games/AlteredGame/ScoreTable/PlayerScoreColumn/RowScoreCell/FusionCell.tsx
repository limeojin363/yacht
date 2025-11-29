import styled from "@emotion/styled";
import { GetDefaultScoreOf } from "@yacht/game-core";
import type { RowScoreCellProps, ViewStatus } from ".";
import { GameContext } from "../../../context";
import { use } from "react";
import { getCellStyle } from "./style";

const FusionCell = ({ playerIdx: playerName, rowName }: RowScoreCellProps) => {
  const { game: game, onClickCell } = use(GameContext);

  const playerColor = game.getColorOf(playerName);
  const isCurrentPlayer = game.currentPlayerIdx === playerName;

  const [firstNumber, secondNumber] = rowName
    .replace("FUSION_", "")
    .split("&")
    .map((str) => parseInt(str, 10)) as [
    1 | 2 | 3 | 4 | 5 | 6,
    1 | 2 | 3 | 4 | 5 | 6,
  ];

  const firstHand =
    game.getHandOf({ handName: `NUMBERS_${firstNumber}`, playerName });
  const secondHand =
    game.getHandOf({ handName: `NUMBERS_${secondNumber}`, playerName });
  const firstValue =
    firstHand !== null
      ? GetDefaultScoreOf[`NUMBERS_${firstNumber}`](firstHand)
      : null;
  const secondValue =
    secondHand !== null
      ? GetDefaultScoreOf[`NUMBERS_${secondNumber}`](secondHand)
      : null;

  const isCompleted = firstValue !== null && secondValue !== null;

  if (isCompleted) {
    const finalValue = firstValue * secondValue;
    const content = `${firstValue} & ${secondValue} -> ${finalValue}`;

    return (
      <S.CompletedCellContainer playerColor={playerColor}>
        {content}
      </S.CompletedCellContainer>
    );
  } else {
    // TODO: 어떻게 좀 해봐라
    const firstViewStatus: ViewStatus = firstValue
      ? "SELECTED"
      : isCurrentPlayer && game.isDiceSetUsable()
        ? "SELECTABLE"
        : "EMPTY";

    const firstContent =
      firstValue !== null
        ? firstValue
        : firstViewStatus === "SELECTABLE"
          ? GetDefaultScoreOf[`NUMBERS_${firstNumber}`](game.extractDiceEyes())
          : null;

    const secondViewStatus: ViewStatus = secondValue
      ? "SELECTED"
      : isCurrentPlayer && game.isDiceSetUsable()
        ? "SELECTABLE"
        : "EMPTY";

    const secondContent =
      secondValue !== null
        ? secondValue
        : secondViewStatus === "SELECTABLE"
          ? GetDefaultScoreOf[`NUMBERS_${secondNumber}`](game.extractDiceEyes())
          : null;

    return (
      <S.PiecesWrapper>
        <S.Piece
          onClick={() => onClickCell(`NUMBERS_${firstNumber}`, playerName)}
          playerColor={playerColor}
          viewStatus={firstViewStatus}
        >
          {firstContent}
        </S.Piece>
        <S.Piece
          onClick={() => onClickCell(`NUMBERS_${secondNumber}`, playerName)}
          playerColor={playerColor}
          viewStatus={secondViewStatus}
        >
          {secondContent}
        </S.Piece>
      </S.PiecesWrapper>
    );
  }
};

export default FusionCell;

const S = {
  CompletedCellContainer: styled.div<{
    playerColor: string;
  }>`
    height: 100%;
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);

    font-weight: bold;
    font-size: 1.3rem;

    ${({ playerColor }) => getCellStyle({ playerColor, viewStatus: "SELECTED" })};
  `,
  PiecesWrapper: styled.div`
    height: 100%;
    width: 100%;

    display: flex;
  `,
  Piece: styled.div<{
    playerColor: string;
    viewStatus: ViewStatus;
  }>`
    flex: 1;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);

    font-weight: bold;
    font-size: 1.3rem;

    ${({ playerColor, viewStatus }) => getCellStyle({ playerColor, viewStatus })};
  `,
};

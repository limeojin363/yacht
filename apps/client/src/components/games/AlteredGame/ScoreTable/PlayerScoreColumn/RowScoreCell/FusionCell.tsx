import styled from "@emotion/styled";
import { GetDefaultScoreOf } from "@yacht/altered-game";
import type { RowScoreCellProps, ViewStatus } from ".";
import { GameContext } from "../../../context";
import { use } from "react";
import { css } from "@emotion/react";

const FusionCell = ({ playerName, rowName }: RowScoreCellProps) => {
  const { gameStatus, onClickCell } = use(GameContext);

  const playerColor = gameStatus.playerColorMap[playerName];
  const isCurrentPlayer = gameStatus.currentPlayerName === playerName;

  const [firstNumber, secondNumber] = rowName
    .replace("FUSION_", "")
    .split("&")
    .map((str) => parseInt(str.replace("NUMBER", ""), 10)) as [
    1 | 2 | 3 | 4 | 5 | 6,
    1 | 2 | 3 | 4 | 5 | 6,
  ];

  const firstHand =
    gameStatus.playerHandSelectionObjectMap[playerName][
      `NUMBERS_${firstNumber}`
    ];
  const secondHand =
    gameStatus.playerHandSelectionObjectMap[playerName][
      `NUMBERS_${secondNumber}`
    ];
  const firstValue =
    firstHand !== null
      ? GetDefaultScoreOf[`NUMBERS_${firstNumber}`](firstHand)
      : null;
  const secondValue =
    secondHand !== null
      ? GetDefaultScoreOf[`NUMBERS_${secondNumber}`](secondHand)
      : null;

  const isCompleted = !!firstValue && !!secondValue;

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
      : isCurrentPlayer && !gameStatus.isUnusableDiceSet()
        ? "SELECTABLE"
        : "EMPTY";

    const firstContent =
      firstValue !== null
        ? firstValue
        : firstViewStatus === "SELECTABLE"
          ? GetDefaultScoreOf[`NUMBERS_${firstNumber}`](gameStatus.diceEyes)
          : null;

    const secondViewStatus: ViewStatus = secondValue
      ? "SELECTED"
      : isCurrentPlayer && !gameStatus.isUnusableDiceSet()
        ? "SELECTABLE"
        : "EMPTY";

    const secondContent =
      secondValue !== null
        ? secondValue
        : secondViewStatus === "SELECTABLE"
          ? GetDefaultScoreOf[`NUMBERS_${secondNumber}`](gameStatus.diceEyes)
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

    ${({ playerColor }) => getStyle({ playerColor, viewStatus: "SELECTED" })};
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

    ${({ playerColor, viewStatus }) => getStyle({ playerColor, viewStatus })};
  `,
};

const getStyle = ({
  playerColor,
  viewStatus,
}: {
  playerColor: string;
  viewStatus: ViewStatus;
}): ReturnType<typeof css> =>
  ({
    EMPTY: css``,
    SELECTED: css`
      background-color: ${playerColor};
      cursor: pointer;
    `,
    SELECTABLE: css`
      background-color: ${playerColor}50;
      cursor: pointer;
      color: gray;

      :active {
        background-color: ${playerColor}80;
      }
    `,
  })[viewStatus];

import styled from "@emotion/styled";
import { GameContext } from "../../../context";
import { use } from "react";
import { css } from "@emotion/react";
import FusionCell from "./FusionCell";

export type ViewStatus = "EMPTY" | "SELECTED" | "SELECTABLE";

export type StyleProps = { playerColor: string; viewStatus: ViewStatus };

export type RowScoreCellProps = {
  rowName: string;
  playerName: string;
};

const useSingleViewData = ({ playerName, rowName }: RowScoreCellProps) => {
  const { gameStatus } = use(GameContext);
  const playerColor = gameStatus.playerColorMap[playerName];
  const score = gameStatus.getScoreOf({ playerName, rowName }); // 점수 존재 유무 확인
  const isCurrentPlayer = gameStatus.currentPlayerName === playerName;
  const viewStatus: ViewStatus =
    score !== null
      ? "SELECTED"
      : isCurrentPlayer && !gameStatus.isUnusableDiceSet()
        ? "SELECTABLE"
        : "EMPTY";

  const content =
    viewStatus === "SELECTED"
      ? score
      : viewStatus === "SELECTABLE"
        ? gameStatus.rowInfoMap[rowName].getScore(gameStatus.diceEyes)
        : null;

  return { playerColor, viewStatus, content };
};

const RowScoreCell = ({ playerName, rowName }: RowScoreCellProps) => {
  const { gameStatus } = use(GameContext);
  const isSingle = gameStatus.getRowTypeOf(rowName) !== "FUSION";

  return (
    <S.CellContainer>
      {isSingle ? (
        <SingleCell playerName={playerName} rowName={rowName} />
      ) : (
        <FusionCell playerName={playerName} rowName={rowName} />
      )}
    </S.CellContainer>
  );
};

const SingleCell = ({ playerName, rowName }: RowScoreCellProps) => {
  const { playerColor, viewStatus, content } = useSingleViewData({
    playerName,
    rowName,
  });

  const { onClickCell } = use(GameContext);

  // rowName === handName
  return (
    <S.SingleCellContent
      onClick={() => onClickCell(rowName, playerName)}
      playerColor={playerColor}
      viewStatus={viewStatus}
    >
      {content}
    </S.SingleCellContent>
  );
};

const getStyle = ({
  playerColor,
  viewStatus,
}: StyleProps): ReturnType<typeof css> =>
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

const S = {
  CellContainer: styled.div`
    flex: 1;
  `,
  SingleCellContent: styled.div<StyleProps>`
    height: 100%;
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);

    font-weight: bold;
    font-size: 1.3rem;

    ${({ playerColor, viewStatus }) => getStyle({ playerColor, viewStatus })};
  `,
};

export default RowScoreCell;

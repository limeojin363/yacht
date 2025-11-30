import styled from "@emotion/styled";
import { GameContext } from "../../../context";
import { use } from "react";
import FusionCell from "./FusionCell";
import { getCellStyle } from "./style";

export type ViewStatus = "EMPTY" | "SELECTED" | "SELECTABLE";

export type StyleProps = { playerColor: string; viewStatus: ViewStatus };

export type RowScoreCellProps = {
  rowName: string;
  playerIdx: number;
};

const useSingleViewData = ({ playerIdx, rowName }: RowScoreCellProps) => {
  const { game } = use(GameContext);
  const playerColor = game.getColorOf({ playerIdx });
  const isCurrentPlayer = game.currentPlayerIdx === playerIdx;
  const viewStatus: ViewStatus =
    game.getHandOf({ handName: rowName, playerIdx }) !== null
      ? "SELECTED"
      : isCurrentPlayer && game.isDiceSetUsable()
        ? "SELECTABLE"
        : "EMPTY";

  const content =
    viewStatus === "SELECTED"
      ? game.getScoreOf({ playerIdx, rowName })
      : viewStatus === "SELECTABLE"
        ? game.getRowInfoOf(rowName).getScoreFrom({
            handInputMap: { [rowName]: game.extractDiceEyes() },
          })
        : null;

  return { playerColor, viewStatus, content };
};

const RowScoreCell = ({ playerIdx, rowName }: RowScoreCellProps) => {
  const { game } = use(GameContext);
  const isSingle = game.getRowTypeOf(rowName) !== "FUSION";

  return (
    <S.CellContainer>
      {isSingle ? (
        <SingleCell playerIdx={playerIdx} rowName={rowName} />
      ) : (
        <FusionCell playerIdx={playerIdx} rowName={rowName} />
      )}
    </S.CellContainer>
  );
};

const SingleCell = ({ playerIdx, rowName }: RowScoreCellProps) => {
  const { playerColor, viewStatus, content } = useSingleViewData({
    playerIdx,
    rowName,
  });

  const { onClickCell } = use(GameContext);

  // rowName === handName
  return (
    <S.SingleCellContent
      onClick={() => onClickCell(rowName, playerIdx)}
      playerColor={playerColor}
      viewStatus={viewStatus}
    >
      {content}
    </S.SingleCellContent>
  );
};

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

    ${({ playerColor, viewStatus }) =>
      getCellStyle({ playerColor, viewStatus })};
  `,
};

export default RowScoreCell;

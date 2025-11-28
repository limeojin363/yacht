import styled from "@emotion/styled";
import { GameContext } from "../../../context";
import { use } from "react";
import FusionCell from "./FusionCell";
import { getCellStyle } from "./style";

export type ViewStatus = "EMPTY" | "SELECTED" | "SELECTABLE";

export type StyleProps = { playerColor: string; viewStatus: ViewStatus };

export type RowScoreCellProps = {
  rowName: string;
  playerName: string;
};

const useSingleViewData = ({ playerName, rowName }: RowScoreCellProps) => {
  const { game } = use(GameContext);
  const playerColor = game.getColorOf(playerName);
  const isCurrentPlayer = game.getCurrentPlayerName() === playerName;
  const viewStatus: ViewStatus =
    game.getHandOf({ handName: rowName, playerName }) !== null
      ? "SELECTED"
      : isCurrentPlayer && game.isDiceSetUsable()
        ? "SELECTABLE"
        : "EMPTY";

  const content =
    viewStatus === "SELECTED"
      ? game.getScoreOf({ playerName, rowName })
      : viewStatus === "SELECTABLE"
        ? game.getRowInfoOf(rowName).getScoreFrom({
            handInputMap: { [rowName]: game.extractDiceEyes() },
          })
        : null;

  return { playerColor, viewStatus, content };
};

const RowScoreCell = ({ playerName, rowName }: RowScoreCellProps) => {
  const { game } = use(GameContext);
  const isSingle = game.getRowTypeOf(rowName) !== "FUSION";

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

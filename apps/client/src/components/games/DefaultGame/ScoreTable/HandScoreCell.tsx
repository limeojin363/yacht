import {
  GetScoreOf,
  type AvailableDiceSet,
  type AvailableHand,
  type PlayerId,
} from "@yacht/default-game";
import type { ScoreCellViewProps } from "../../ScoreCellView";
import { use } from "react";
import { DefaultGameContext } from "..";
import ScoreCellView from "../../ScoreCellView";

const getDiceEyes = (diceSet: AvailableDiceSet) =>
  diceSet.map((dice) => dice.eye);

const useCellProps = (
  playerId: PlayerId,
  hand: AvailableHand
): ScoreCellViewProps => {
  const { onClickCell, gameStatus, playerList } = use(DefaultGameContext);

  const playerColor = playerList[playerId].playerColor;

  const isCurrentPlayer = gameStatus.currentPlayerId === playerId;
  const currentScore = gameStatus.scoreObjectList[playerId][hand];
  const viewStatus = (() => {
    // 이미 선택된 핸드
    if (currentScore !== null) return "SELECTED";
    // 선택되지 않았고, 현재 유저 -> 선택 가능
    if (isCurrentPlayer) return "SELECTABLE";
    // 선택되지 않았고, 현재 유저도 아님 -> 표시 X
    return "EMPTY";
  })();

  const label = (() => {
    // 이미 선택됨: 현재 점수 표시
    if (viewStatus === "SELECTED") return currentScore!;

    // 선택되지 않았고 현재 유저도 아님: 빈칸
    if (!isCurrentPlayer) return undefined;

    // 선택되지 않았고 현재 유저임: 선택 시 점수 미리보기
    if (gameStatus.diceSet.every((dice) => !!dice)) {
      const diceEyes = getDiceEyes(gameStatus.diceSet);
      return GetScoreOf[hand](diceEyes);
    }
  })();

  return {
    playerColor,
    viewStatus,
    label,
    onClick: () => onClickCell(hand, playerId),
  };
};

const HandScoreCell = ({
  playerId,
  hand,
}: {
  playerId: PlayerId;
  hand: AvailableHand;
}) => {
  const props = useCellProps(playerId, hand);
  return <ScoreCellView {...props} />;
};

export default HandScoreCell;

import {
  getUpdatedGameStatus,
  type AvailableHand,
  type PlayerId,
} from "@yacht/games/default";
import gameRootAtom, {
  currentPlayerIdAtom,
  diceSetAtom,
  scoreAtomFamily,
} from "../../stores";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import type { ViewStatus } from "../../../../../components/games/ScoreCellView";
import GetScoreOf from "../../../../../../../../packages/games/default/features/score";
import ScoreCellView from "../../../../../components/games/ScoreCellView";

interface ScoreCellProps {
  playerId: PlayerId;
  hand: AvailableHand;
}

const ScoreCell = ({ playerId, hand }: ScoreCellProps) => {
  const setGame = useSetAtom(gameRootAtom);
  const isCurrentPlayer = playerId === useAtomValue(currentPlayerIdAtom);
  const diceSet = useAtomValue(diceSetAtom);
  const currentScore = useAtomValue(
    useMemo(() => scoreAtomFamily({ playerId, hand }), [playerId, hand])
  );

  const isDicesAvailable = diceSet.every((dice) => !!dice);

  const onClick = () => {
    if (!isCurrentPlayer) return;
    if (!isDicesAvailable) return;

    setGame((prev) =>
      getUpdatedGameStatus(prev)({ type: "SELECT", payload: hand })
    );
  };

  const viewStatus: ViewStatus = (() => {
    // 이미 선택된 핸드
    if (currentScore !== null) return "SELECTED";
    // 선택되지 않았고, 현재 유저 -> 선택 가능
    if (isCurrentPlayer) return "SELECTABLE";
    // 선택되지 않았고, 현재 유저도 아님 -> 표시 X
    return "EMPTY";
  })();

  const content = (() => {
    if (currentScore !== null) return currentScore;
    if (!isDicesAvailable) return;

    const diceEyes = diceSet.map((dice) => dice.eye);

    if (isCurrentPlayer) return GetScoreOf[hand](diceEyes);
  })();

  return (
    <ScoreCellView label={content} viewStatus={viewStatus} onClick={onClick} />
  );
};

export default ScoreCell;

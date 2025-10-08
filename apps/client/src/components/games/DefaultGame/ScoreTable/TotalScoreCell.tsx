import type { PlayerId } from "@yacht/default-game";
import { use } from "react";
import { DefaultGameContext } from "..";
import ScoreCellView, { type ScoreCellViewProps } from "../../ScoreCellView";

const useCellProps = (playerId: PlayerId): ScoreCellViewProps => {
  const { gameStatus, playerList } = use(DefaultGameContext);

  const totalScore = Object.values(gameStatus.scoreObjectList[playerId]).reduce(
    (acc, score) => (acc ?? 0) + (score ?? 0),
    0
  ) as number;

  return {
    playerColor: playerList[playerId].playerColor,
    viewStatus: "SELECTED",
    label: totalScore,
  };
};

const TotalScoreCell = ({ playerId }: { playerId: PlayerId }) => {
  const props = useCellProps(playerId);
  return <ScoreCellView {...props} />;
};

export default TotalScoreCell;

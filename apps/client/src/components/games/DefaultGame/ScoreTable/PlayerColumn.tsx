import { HAND_LIST, type PlayerId } from "@yacht/default-game";
import HandScoreCell from "./HandScoreCell";
import styled from "@emotion/styled";
import TotalScoreCell from "./TotalScoreCell";

const PlayerColumn = ({ playerId }: { playerId: PlayerId }) => {
  return (
    <S.Root>
      {HAND_LIST.map((hand) => (
        <HandScoreCell
          key={`player${playerId}-${hand}`}
          playerId={playerId}
          hand={hand}
        />
      ))}
      <TotalScoreCell playerId={playerId} />
    </S.Root>
  );
};

export default PlayerColumn;

const S = {
  Root: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 3px;
  `,
};

import { HAND_LIST, type PlayerId } from "@yacht/default-game";
import ScoreCell from "./ScoreCell";
import styled from "@emotion/styled";

const PlayerColumn = ({ playerId }: { playerId: PlayerId }) => {
  return (
    <S.Root>
      {HAND_LIST.map((hand) => (
        <ScoreCell
          key={`player${playerId}-${hand}`}
          playerId={playerId}
          hand={hand}
        />
      ))}
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

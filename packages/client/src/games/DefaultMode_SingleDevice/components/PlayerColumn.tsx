import { HAND_LIST, type PlayerIdType } from "common/default-mode";
import ScoreCell from "./ScoreCell";
import styled from "@emotion/styled";

const PlayerColumn = ({ playerId }: { playerId: PlayerIdType }) => {
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
    display: flex;
    flex-direction: column;
  `,
};

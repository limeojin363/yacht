import { HAND_LIST } from "common/default-mode";
import ScoreCell from "./ScoreCell";
import styled from "@emotion/styled";

const UserColumn = ({ userNum }: { userNum: 0 | 1 }) => {
  return (
    <S.Root>
      {HAND_LIST.map((hand) => (
        <ScoreCell
          key={`user${userNum}-${hand}`}
          userNum={userNum}
          hand={hand}
        />
      ))}
    </S.Root>
  );
};

export default UserColumn;

const S = {
  Root: styled.div`
    display: flex;
    flex-direction: column;
  `,
};

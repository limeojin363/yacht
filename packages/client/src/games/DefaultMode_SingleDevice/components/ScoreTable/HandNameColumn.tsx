import styled from "@emotion/styled";
import { HAND_LIST } from "common/default-mode";

const HandNameColumn = () => {
  return (
    <S.Root>
      {HAND_LIST.map((hand) => (
        <S.Cell key={`handname-${hand}`}>{hand}</S.Cell>
      ))}
    </S.Root>
  );
};

export default HandNameColumn;

const S = {
  Root: styled.div`
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
  `,
  Cell: styled.div`
    flex: 1;

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  `,
};

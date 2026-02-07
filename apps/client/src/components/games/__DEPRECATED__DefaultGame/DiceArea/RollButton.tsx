import styled from "@emotion/styled";
import { use } from "react";
import { DefaultGameContext } from "..";

const RollButton = () => {
  const { onClickRoll } = use(DefaultGameContext);

  return <S.Root onClick={onClickRoll}>Roll</S.Root>;
};

export default RollButton;

const S = {
  Root: styled.button`
    padding: 12px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  `,
};

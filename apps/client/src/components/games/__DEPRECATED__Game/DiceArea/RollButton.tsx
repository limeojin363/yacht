import styled from "@emotion/styled";
import { use } from "react";
import { GameContext } from "../context";

const RollButton = () => {
  const { onClickRoll } = use(GameContext);

  return <S.Root onClick={onClickRoll}>Roll</S.Root>;
};

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

export default RollButton;

import styled from "@emotion/styled";
import { GameContext } from "../context";
import { use } from "react";

const DiceArea = () => {
  const {gameStatus} = use(GameContext);

  return <S.Root></S.Root>
};

export default DiceArea;

const S = {
  Root: styled.div``
}
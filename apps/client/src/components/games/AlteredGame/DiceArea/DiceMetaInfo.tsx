import styled from "@emotion/styled";
import { use } from "react";
import { GameContext } from "../context";

const DiceMetaInfo = () => {
  const { game } = use(GameContext);

  return (
    <S.Root>
      <S.Detail>남은 Roll: {game.remainingRoll}</S.Detail>
      <S.Detail>고정 가능한 주사위 범위: 0 ~ {game.maxHolding}</S.Detail>
    </S.Root>
  );
};

const S = {
  Root: styled.div``,
  Detail: styled.div``,
};

export default DiceMetaInfo;

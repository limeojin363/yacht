import styled from "@emotion/styled";
import { use } from "react";
import { GameContext } from "../context";

const TurnMetaInfo = () => {
  const { game } = use(GameContext);

  return (
    <S.Root>
        <S.Detail>전체 턴: {game.getTotalTurn()}</S.Detail>
        <S.Detail>현재 턴: {game.getCurrentTurn()}</S.Detail>
    </S.Root>
  );
};

const S = {
  Root: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;

    padding: 8px 16px 8px 8px;
    gap: 4px;

    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);
  `,
  Detail: styled.div``,
};

export default TurnMetaInfo;

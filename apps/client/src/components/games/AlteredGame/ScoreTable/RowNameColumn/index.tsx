import styled from "@emotion/styled";
import { use } from "react";
import { GameContext } from "../../context";

const SideNameColumn = () => {
  const context = use(GameContext);
  const { game: gameStatus } = context;
  const rowNames = gameStatus.getRowNameList();

  return (
    <S.Root>
      {[" ", ...rowNames, "TOTAL"].map((name) => (
        <S.Cell key={name}>{name}</S.Cell>
      ))}
    </S.Root>
  );
};

const S = {
  Root: styled.div`
    flex: 1;

    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  Cell: styled.div`
    flex: 1;

    display: flex;
    justify-content: center;
    align-items: center;

    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);
    background-color: #c2c2c2;
  `,
};

export default SideNameColumn;

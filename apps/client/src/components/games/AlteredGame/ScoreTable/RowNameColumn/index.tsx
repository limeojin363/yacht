import styled from "@emotion/styled";
import { use } from "react";
import { GameContext } from "../../context";

const getSorted = (rowNames: string[]) => {
  const upperRows = rowNames.filter((name) => name.startsWith("NUMBERS_"));
  const lowerRows = rowNames.filter((name) => !name.startsWith("NUMBERS_"));

  return [...upperRows, ...lowerRows];
};

const SideNameColumn = () => {
  const context = use(GameContext);
  const { gameStatus } = context;
  const rowNames = gameStatus.rowNames;

  return (
    <S.Root>
      {[" ", ...getSorted(rowNames)].map((name) => (
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

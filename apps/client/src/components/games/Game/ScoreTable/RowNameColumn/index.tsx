import styled from "@emotion/styled";
import { use } from "react";
import { GameContext } from "../../context";
import { css } from "@emotion/react";

const SideNameColumn = () => {
  const { game } = use(GameContext);

  return (
    <S.Root>
      <EmptyCell />
      {game.getRowNameList().map((name) => (
        <RowNameCell key={name} name={name} />
      ))}
      <TotalCell />
    </S.Root>
  );
};

const EmptyCell = () => {
  return <S.EmptyCell></S.EmptyCell>;
};

const TotalCell = () => {
  return <S.TotalCell>TOTAL</S.TotalCell>;
};

const RowNameCell = ({ name }: { name: string }) => {
  const { game } = use(GameContext);

  const altered = game.rowInfoMap[name].type !== "NORMAL";

  return <S.NameCell altered={altered}>{name}</S.NameCell>;
};

const S = {
  Root: styled.div`
    flex: 1;

    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  NameCell: styled.div<{ altered?: boolean }>`
    flex: 1;

    display: flex;
    justify-content: center;
    align-items: center;

    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);
    font-weight: 600;

    ${({ altered }) => css`
      background-color: ${altered ? "#727272" : "#dadada"};
      color: ${altered ? "#ffffff" : "#000000"};
    `}
  `,
  EmptyCell: styled.div`
    flex: 1.5;

    background-color: #85998426;
    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);
  `,
  TotalCell: styled.div`
    flex: 1.5;

    display: flex;
    justify-content: center;
    align-items: center;

    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);
    font-weight: 700;

    background-color: #9b9b9b;
    color: #000000;

    font-size: 1.8rem;
  `,
};

export default SideNameColumn;

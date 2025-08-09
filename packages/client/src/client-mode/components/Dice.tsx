import { Game, type DiceIndex } from "common/default-game";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import gameRootAtom, { diceAtomFamily } from "../stores";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

const Dice = ({ index }: { index: DiceIndex }) => {
  const diceData = useAtomValue(useMemo(() => diceAtomFamily(index), [index]));
  const setGame = useSetAtom(gameRootAtom);

  const isHeld = diceData?.held;
  const content = diceData ? diceData.eye : null;

  const onClick = () => {
    if (diceData === null) return;

    setGame((prev) => {
      const updateActions = Game.getUpdateActionsFromUserAction(
        "toggle-dice-holding",
        index,
        prev
      );

      return Game.dispatch(updateActions, prev);
    });
  };

  return <S.Root isHeld={isHeld} onClick={onClick}>{content}</S.Root>;
};

export default Dice;

const S = {
  Root: styled.div<{isHeld?: boolean}>`
    width: 50px;
    height: 50px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    display: flex;
    align-items: center;
    justify-content: center;

    ${({isHeld}) => isHeld && css`
        transform: scale(1.1);
        border: 1px solid #007bff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    `}
  `,
};

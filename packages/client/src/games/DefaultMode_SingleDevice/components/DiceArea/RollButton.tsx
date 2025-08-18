import styled from "@emotion/styled";
import { useAtomValue, useSetAtom } from "jotai";
import gameRootAtom from "../../stores";
import { remainingRollAtom } from "../../stores/remainigRoll";
import { Game } from "common/default-mode";

const RollButton = () => {
  const remainingRollData = useAtomValue(remainingRollAtom);

  const setGame = useSetAtom(gameRootAtom);

  const onClick = () => {
    if (remainingRollData <= 0) return;
    
    setGame((prev) => {
      const updateActions = Game.getUpdateActionsFromPlayerAction(
        "roll",
        void 0,
        prev
      );

      return Game.dispatch(updateActions, prev);
    });
  };

  return <S.Root onClick={onClick}>Roll</S.Root>;
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

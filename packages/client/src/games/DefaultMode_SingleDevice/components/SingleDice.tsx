import { Game, type DiceIndex } from "common/default-mode";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import gameRootAtom, { diceAtomFamily } from "../stores";
import SingleDiceView from "../../../components/SingleDiceView";

const SingleDice = ({ index }: { index: DiceIndex }) => {
  const diceData = useAtomValue(useMemo(() => diceAtomFamily(index), [index]));
  const setGame = useSetAtom(gameRootAtom);

  const isHeld = diceData?.held;
  const content = diceData ? diceData.eye : null;

  const onClick = () => {
    if (diceData === null) return;

    setGame((prev) => {
      const updateActions = Game.getUpdateActionsFromPlayerAction(
        "toggle-dice-holding",
        index,
        prev
      );

      return Game.dispatch(updateActions, prev);
    });
  };

  return (
    <SingleDiceView isHeld={isHeld} onClick={onClick}>
      {content}
    </SingleDiceView>
  );
};

export default SingleDice;

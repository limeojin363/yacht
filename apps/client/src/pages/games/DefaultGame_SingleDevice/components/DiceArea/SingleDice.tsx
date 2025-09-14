import { getUpdatedGameStatus, type DiceIndex } from "@yacht/default-game";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import gameRootAtom, { diceAtomFamily } from "../../stores";
import SingleDiceView from "../../../../../components/games/SingleDiceView";

const SingleDice = ({ index }: { index: DiceIndex }) => {
  const diceData = useAtomValue(useMemo(() => diceAtomFamily(index), [index]));
  const setGame = useSetAtom(gameRootAtom);

  const isHeld = diceData?.held;
  const content = diceData ? diceData.eye : null;

  const onClick = () => {
    if (diceData === null) return;

    setGame((prev) =>
      getUpdatedGameStatus(prev)({
        type: "TOGGLE_DICE_HOLDING",
        payload: index,
      })
    );
  };

  return (
    <SingleDiceView isHeld={isHeld} onClick={onClick}>
      {content}
    </SingleDiceView>
  );
};

export default SingleDice;

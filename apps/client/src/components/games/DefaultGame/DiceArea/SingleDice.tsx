import { type DiceIndex } from "@yacht/default-game";
import { use } from "react";
import SingleDiceView from "../../SingleDiceView";
import { DefaultGameContext } from "..";

const SingleDice = ({ index }: { index: DiceIndex }) => {
  const { gameStatus, onClickDice } = use(DefaultGameContext);

  const diceData = gameStatus.diceSet[index];

  const isHeld = diceData ? diceData.held : false;
  const content = diceData ? diceData.eye : null;

  return (
    <SingleDiceView isHeld={isHeld} onClick={() => onClickDice(index)}>
      {content}
    </SingleDiceView>
  );
};

export default SingleDice;

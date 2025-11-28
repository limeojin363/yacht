import styled from "@emotion/styled";
import { GameContext } from "../context";
import { use } from "react";
import SingleDiceView from "../../SingleDiceView";

const SingleDice = ({ index }: { index: number }) => {
  const { game: gameStatus, onClickDice } = use(GameContext);

  const dice = gameStatus.diceSet[index];

  const isHeld = dice ? dice.held : false;
  const content = dice ? dice.eye : null;

  return (
    <SingleDiceView isHeld={isHeld} onClick={() => onClickDice(index)}>
      {content}
    </SingleDiceView>
  );
};

const diceIndexes = [0, 1, 2, 3, 4];

const DiceSet = () => {
  return (
    <S.Root>
      {diceIndexes.map((index) => (
        <SingleDice key={index} index={index} />
      ))}
    </S.Root>
  );
};

const S = {
  Root: styled.div`
    display: flex;
    gap: 4px;
  `,
};

export default DiceSet;

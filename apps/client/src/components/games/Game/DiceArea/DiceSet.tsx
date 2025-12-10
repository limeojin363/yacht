import styled from "@emotion/styled";
import { GameContext } from "../context";
import { use } from "react";
import SingleDiceView from "../../SingleDiceView";

const SingleDice = ({ index }: { index: number }) => {
  const { game, onClickDice, onDiceEyeSelect } = use(GameContext);

  const dice = game.diceSet[index];

  const isHeld = dice ? dice.held : false;
  const content = dice ? dice.eye : null;

  return (
    <SingleDiceView
      isHeld={isHeld}
      onKeyDown={(e) => {
        if (Number(e.key) >= 1 && Number(e.key) <= 6) {
          onDiceEyeSelect(index, Number(e.key));
        }
      }}
      onClick={() => onClickDice(index)}
    >
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

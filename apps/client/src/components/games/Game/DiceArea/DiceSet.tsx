import styled from "@emotion/styled";
import { GameContext } from "../context";
import { use } from "react";
import SingleDiceView from "../../SingleDiceView";

const SingleDice = ({ index }: { index: number }) => {
  const { game, onClickDice } = use(GameContext);

  const dice = game.diceSet[index];

  const isHeld = dice ? dice.held : false;
  const content = dice ? dice.eye : null;

  return (
    <SingleDiceView
      isHeld={isHeld}
      onKeyDown={(e) => {
        if (dice == null) return;
        if (Number(e.key) >= 1 && Number(e.key) <= 6) {
          game.diceSet[index] = {
            eye: Number(e.key),
            held: dice ? dice.held : false,
          };
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

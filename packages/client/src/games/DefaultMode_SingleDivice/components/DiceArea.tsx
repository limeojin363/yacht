import styled from "@emotion/styled";
import Dice from "./Dice";
import RollButton from "./RollButton";
import RemainingRollDisplay from "./RemainingRollDisplay";

const diceIndexes = [0, 1, 2, 3, 4] as const;

const DiceArea = () => {
  return (
    <S.Root>
      {diceIndexes.map((index) => (
        <Dice key={index} index={index} />
      ))}
      <RollButton />
      <RemainingRollDisplay />
    </S.Root>
  );
};

export default DiceArea;

const S = {
  Root: styled.div`
    display: flex;
    gap: 8px;
  `,
};

import styled from "@emotion/styled";
import SingleDice from "./SingleDice";
import RollButton from "./RollButton";
import RemainingRollDisplay from "./RemainingRollDisplay";

const diceIndexes = [0, 1, 2, 3, 4] as const;

const DiceArea = () => {
  return (
    <S.Root>
      <S.DicesWrapper>
        {diceIndexes.map((index) => (
          <SingleDice key={index} index={index} />
        ))}
        <RollButton />
      </S.DicesWrapper>
      <RemainingRollDisplay />
    </S.Root>
  );
};

export default DiceArea;

const S = {
  Root: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
  `,
  DicesWrapper: styled.div`
    display: flex;
    gap: 6px;
  `,
};

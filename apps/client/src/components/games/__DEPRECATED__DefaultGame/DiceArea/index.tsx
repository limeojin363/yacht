import styled from "@emotion/styled";
import SingleDice from "./SingleDice";
import { DefaultGameContext } from "..";
import { use } from "react";
import RollButton from "./RollButton";

const diceIndexes = [0, 1, 2, 3, 4] as const;

const RemainingRollDisplay = () => {
  const { gameStatus } = use(DefaultGameContext);

  return <div>Remaining Rolls: {gameStatus.remainingRoll}</div>;
};

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

export default DiceArea;

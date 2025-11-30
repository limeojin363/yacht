import styled from "@emotion/styled";
import DiceSet from "./DiceSet";
import DiceMetaInfo from "./DiceMetaInfo";
import RollButton from "./RollButton";

const DiceArea = () => {
  return (
    <S.Root>
      <DiceMetaInfo />
      <S.Row>
        <DiceSet />
        <RollButton />
      </S.Row>
    </S.Root>
  );
};

export default DiceArea;

const S = {
  Root: styled.div`
    height: 100%;

    margin-bottom: 20px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
  `,
  Row: styled.div`
    display: flex;
    gap: 12px;
  `,
};

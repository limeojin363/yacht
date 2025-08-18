import styled from "@emotion/styled";
import HandNameColumn from "./HandNameColumn";
import UserColumn from "./UserColumn";
import DiceArea from "./DiceArea";


const Game = () => {
  const playerIdList = [0, 1] as const;
  
  return (
    <S.Root>
      <HandNameColumn />
      {playerIdList.map((userNum) => (
        <UserColumn key={`user-${userNum}`} userNum={userNum} />
      ))}
      <DiceArea />
    </S.Root>
  );
};

export default Game;

const S = {
  Root: styled.div`
    display: flex;
    flex-direction: row;
  `,
};

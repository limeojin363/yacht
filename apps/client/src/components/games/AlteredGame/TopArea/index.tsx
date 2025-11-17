import styled from "@emotion/styled";
import SideMenuButton from "./SideMenuButton";
import AlterOptionList from "./AlterOptionList";
import TurnMetaInfo from "./TurnMetaInfo";

const TopArea = () => {
  return (
    <S.TopAreaRoot>
      <SideMenuButton />
      <TurnMetaInfo />
      <AlterOptionList />
    </S.TopAreaRoot>
  );
};

const S = {
  TopAreaRoot: styled.div`
    width: calc(100% - 24px);
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: stretch;
    gap: 8px;
  `,
};

export default TopArea;

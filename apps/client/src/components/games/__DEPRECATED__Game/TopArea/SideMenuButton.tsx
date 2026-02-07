import styled from "@emotion/styled";

const SideMenuButton = () => {
  return <S.Wrapper>
    <S.Button onClick={() => {}}>X</S.Button>
  </S.Wrapper>;
};

export default SideMenuButton;

const S = {
  Wrapper: styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  Button: styled.button`
    all: unset;

    height: 40px;
    aspect-ratio: 1;
    cursor: pointer;

    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 1.5rem;
    font-weight: bold;

    :active {
      transform: scale(0.95);
    }
  `,
};

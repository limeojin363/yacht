import { css } from "@emotion/react";
import styled from "@emotion/styled";

interface SingleDiceViewProps extends React.HTMLAttributes<HTMLButtonElement> {
  isHeld: boolean;
}

const SingleDiceView = ({
  isHeld,
  children,
  ...props
}: SingleDiceViewProps) => {
  return (
    <S.Root isHeld={isHeld} {...props}>
      {children}
    </S.Root>
  );
};

const S = {
  Root: styled.button<{ isHeld: boolean }>`
    all: unset;

    width: 50px;
    height: 50px;
    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.486);
    border-radius: 8px;

    display: flex;
    align-items: center;
    justify-content: center;

    :focus-visible {
      box-shadow: inset 0 0 0 3px #000000;
    }

    ${({ isHeld }) =>
      isHeld &&
      css`
        transform: scale(1.1);
        background-color: #d9d9d9;
        box-shadow: inset 0 0 0 3px rgba(0, 0, 0, 0.486);
      `}
  `,
};

export default SingleDiceView;

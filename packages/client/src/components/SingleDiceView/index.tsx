import { css } from "@emotion/react";
import styled from "@emotion/styled";

interface SingleDiceViewProps extends React.HTMLAttributes<HTMLDivElement> {
  isHeld?: boolean;
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
  Root: styled.div<{ isHeld?: boolean }>`
    width: 50px;
    height: 50px;
    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.486);

    display: flex;
    align-items: center;
    justify-content: center;

    ${({ isHeld }) =>
      isHeld &&
      css`
        transform: scale(1.1);
        box-shadow: inset 0 0 0 3px #007bff;
      `}
  `,
};

export default SingleDiceView;

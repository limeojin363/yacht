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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    display: flex;
    align-items: center;
    justify-content: center;

    ${({ isHeld }) =>
      isHeld &&
      css`
        transform: scale(1.1);
        border: 1px solid #007bff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      `}
  `,
};

export default SingleDiceView;

import { css } from "@emotion/react";
import styled from "@emotion/styled";

export type ViewStatus = "EMPTY" | "SELECTABLE" | "SELECTED";

interface ScoreCellViewProps extends React.HTMLAttributes<HTMLDivElement> {
  viewStatus: ViewStatus;
  label?: number | string;
}

const ScoreCellView = ({ viewStatus, label, ...props }: ScoreCellViewProps) => {
  return (
    <S.Root {...props} viewStatus={viewStatus}>
      {label !== null && (
        <S.InnerText viewStatus={viewStatus}>{label}</S.InnerText>
      )}
    </S.Root>
  );
};

const WrapperStyleMap: Record<ViewStatus, ReturnType<typeof css>> = {
  EMPTY: css`
    background-color: rgba(255, 255, 255, 1);
  `,
  SELECTABLE: css`
    background-color: #bedeff;
    color: #969696;

    :active {
      color: #727272;
      font-size: 1.5rem;
    }
  `,
  SELECTED: css`
    background-color: #007bff;
    color: white;
    font-size: 1.5rem;
  `,
};

const S = {
  Root: styled.div<{ viewStatus: ViewStatus }>`
    flex: 1;

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);

    font-weight: bold;
    font-size: 1.3rem;
    ${({ viewStatus }) => WrapperStyleMap[viewStatus]};
  `,
  InnerText: styled.div<{ viewStatus: ViewStatus }>``,
};

export default ScoreCellView;

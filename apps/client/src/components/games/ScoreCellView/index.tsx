import { css } from "@emotion/react";
import styled from "@emotion/styled";

export type ViewStatus = "EMPTY" | "SELECTABLE" | "SELECTED";

export interface ScoreCellViewProps
  extends React.HTMLAttributes<HTMLDivElement> {
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

type HexColor = `#${string}`;

const fixedSaturation = 0.7;  // 예시 채도 (70%)
const fixedLightness = 0.4;  // 예시 명도 (40%)

// 랜덤 색상을 생성하는 함수
function generateRandomColor(): HexColor {
  // 최우측 원색 팔레트에서 랜덤 색상 각도 (hue) 선택 (0 - 360 사이)
  const randomHue = Math.floor(Math.random() * 360); // 0부터 360 사이의 랜덤 값

  // HSL 값을 hex로 변환하는 함수
  function hslToHex(h: number, s: number, l: number): HexColor {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r: number, g: number, b: number;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    const rFinal = Math.round((r + m) * 255);
    const gFinal = Math.round((g + m) * 255);
    const bFinal = Math.round((b + m) * 255);

    return `#${(1 << 24 | rFinal << 16 | gFinal << 8 | bFinal).toString(16).slice(1).toUpperCase()}`;
  }

  // 랜덤 색상 값을 최종 결과로 반환
  return hslToHex(randomHue, fixedSaturation * 100, fixedLightness * 100);
}

const getWrapperStyleMap = (bgHexColor: HexColor): Record<ViewStatus, ReturnType<typeof css>> => ({
  EMPTY: css`
    background-color: rgba(255, 255, 255, 1);
  `,
  SELECTABLE: css`
    background-color: ${bgHexColor}50;
    color: #969696;

    :active {
      color: #727272;
      font-size: 1.5rem;
    }
  `,
  SELECTED: css`
    background-color: ${bgHexColor};
    color: white;
    font-size: 1.5rem;
  `,
});

const S = {
  Root: styled.div<{ viewStatus: ViewStatus }>`
    flex: 1;

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);

    font-weight: bold;
    font-size: 1.3rem;
    ${({ viewStatus }) => getWrapperStyleMap(a)[viewStatus]};
  `,
  InnerText: styled.div<{ viewStatus: ViewStatus }>``,
};

const a = generateRandomColor()

export default ScoreCellView;

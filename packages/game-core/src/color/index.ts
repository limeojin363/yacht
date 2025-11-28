const fixedSaturation = 0.7; // 예시 채도 (70%)
const fixedLightness = 0.4; // 예시 명도 (40%)

type HexColor = `#${string}`;

// HSL 값을 hex로 변환하는 함수
const hslToHex = (h: number, s: number, l: number): HexColor => {
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

  return `#${((1 << 24) | (rFinal << 16) | (gFinal << 8) | bFinal).toString(16).slice(1).toUpperCase()}`;
};

// 랜덤 색상을 생성하는 함수
const generatePlayerColor = (): HexColor => {
  // 최우측 원색 팔레트에서 랜덤 색상 각도 (hue) 선택 (0 - 360 사이)
  const randomHue = Math.floor(Math.random() * 360); // 0부터 360 사이의 랜덤 값

  // 랜덤 색상 값을 최종 결과로 반환
  return hslToHex(randomHue, fixedSaturation * 100, fixedLightness * 100);
};

export default generatePlayerColor;

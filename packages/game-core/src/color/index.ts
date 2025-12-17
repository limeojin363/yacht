import { FIXED_LIGHTNESS, FIXED_SATURATION, MIN_COLOR_DISTANCE, MIN_HUE_DISTANCE } from "./constants.js";
import type { HexColor, HSL } from "./types.js";
import { colorDistance, hexToHsl, hslToHex, hueDistance } from "./utils.js";

export * from "./types.js";

type ColorOptions = {
  lightness?: number; // 0 ~ 1
  alpha?: number;     // 0 ~ 1
};

export class Color {
  private baseColor: HexColor;

  constructor(baseColor: HexColor) {
    this.baseColor = baseColor;
  }

  getBaseColor(): HexColor {
    return this.baseColor;
  }

  getColor(options: ColorOptions = {}): string {
    const { lightness, alpha } = options;

    let hex = this.baseColor;

    if (lightness !== undefined) {
      const { h, s } = hexToHsl(hex);
      const l = Math.max(0, Math.min(1, lightness));
      hex = hslToHex(h, s * 100, l * 100);
    }

    if (alpha !== undefined) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      const a = Math.max(0, Math.min(1, alpha));

      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    return hex;
  }
}

export class ColorFactory {
  private colors: Color[] = [];
  private hslCache: HSL[] = [];

  constructor() {}

  generate(): Color {
    if (this.colors.length >= 4) {
      return this.colors[this.colors.length % 4]!;
    }

    let hex: HexColor;
    let hsl: HSL;

    do {
      const hue = Math.floor(Math.random() * 360);
      hex = hslToHex(
        hue,
        FIXED_SATURATION * 100,
        FIXED_LIGHTNESS * 100
      );
      hsl = hexToHsl(hex);
    } while (this.isTooClose(hsl));

    this.hslCache.push(hsl);

    const color = new Color(hex);
    this.colors.push(color);

    return color;
  }

  private isTooClose(target: HSL): boolean {
    return this.hslCache.some(
      (existing) =>
        hueDistance(existing.h, target.h) < MIN_HUE_DISTANCE ||
        colorDistance(existing, target) < MIN_COLOR_DISTANCE
    );
  }
}

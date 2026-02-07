import { css } from "@emotion/react";
import type { StyleProps } from ".";
import { Color } from "@yacht/game-core";

export const getCellStyle = ({
  playerColor,
  viewStatus,
  altered,
}: StyleProps): ReturnType<typeof css> =>
  ({
    EMPTY: css`
      background-color: ${altered
        ? new Color(playerColor).getColor({ lightness: 0.15, alpha: 0.3 })
        : "#f8f8f8ff"};
    `,

    SELECTABLE: css`
      cursor: pointer;

      background-color: ${altered
         ? new Color(playerColor).getColor({ lightness: 0.15, alpha: 0.4 })
        : `${playerColor}20`};

      color: ${altered
        ? "#ffffffff"
        : "#00000044"};

      :active {
        background-color: ${altered
          ? new Color(playerColor).getColor({ lightness: 0.15, alpha: 0.5 })
          : `${playerColor}35`};
      }
    `,

    SELECTED: css`
      cursor: pointer;

      background-color: ${altered
        ? new Color(playerColor).getColor({ lightness: 0.15, alpha: 0.9 })
        : `${playerColor}60`};

      color: ${altered ? "#ffffffff" : "#000000be"};
    `,
  })[viewStatus];

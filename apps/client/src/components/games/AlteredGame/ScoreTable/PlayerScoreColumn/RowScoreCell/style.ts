import { css } from "@emotion/react";
import type { StyleProps } from ".";

export const getCellStyle = ({
  playerColor,
  viewStatus,
}: StyleProps): ReturnType<typeof css> =>
  ({
    EMPTY: css``,
    SELECTED: css`
      background-color: ${playerColor}50;
      cursor: pointer;
      color: #000000be;
    `,
    SELECTABLE: css`
      background-color: ${playerColor}20;
      cursor: pointer;
      color: #00000044;

      :active {
        background-color: ${playerColor}50;
      }
    `,
  })[viewStatus];


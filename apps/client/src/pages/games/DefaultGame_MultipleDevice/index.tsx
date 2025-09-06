import styled from "@emotion/styled";
import { useEffect } from "react";

const DefaultMode_MultipleDevice = () => {
  useEffect(() => {
    const ws = new WebSocket(
      "wss://shiny-space-capybara-q5v4qxjx6vx3x75g-3000.app.github.dev"
    );

    ws.onopen = () => console.log("WebSocket is open now.");

    return () => ws.close();
  }, []);

  return <S.Root>{/* FILL HERE */}</S.Root>;
};

const S = {
  Root: styled.div`
    /* FILL HERE */
  `,
};

export default DefaultMode_MultipleDevice;

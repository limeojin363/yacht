import styled from "@emotion/styled";
import { useEffect } from "react";
import { io } from "socket.io-client";

const socketUrl =
  "wss://shiny-space-capybara-q5v4qxjx6vx3x75g-3000.app.github.dev";

const getAuthorizationHeader = () =>
  `Bearer ${JSON.parse(localStorage.getItem("accessToken") || "")}`;

const connect = (gameId: number) => {
  return io(`${socketUrl}/game`, {
    query: {
      Authorization: getAuthorizationHeader(),
      gameId,
    },
  });
};

const DefaultMode_MultipleDevice = ({ gameId }: { gameId: number }) => {
  useEffect(() => {
    const socket = connect(gameId);

    socket.on("connect", () => {
      console.log("connected to server");
    });

    socket.on("authenticated", () => {
      console.log("인증 완료");
    });

    return () => {
      if (socket.active) socket.disconnect();
    };
  }, [gameId]);

  return <S.Root>ㅎㅇㅎㅇ</S.Root>;
};

const S = {
  Root: styled.div`
    /* FILL HERE */
  `,
};

export default DefaultMode_MultipleDevice;

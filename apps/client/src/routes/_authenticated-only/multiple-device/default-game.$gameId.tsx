import { createFileRoute } from "@tanstack/react-router";
// import DefaultMode_MultipleDevice from "../../../pages/games/DefaultGame_MultipleDevice";
import WaitingRoom from "../../../pages/games/DefaultGame_MultipleDevice/WaitingRoom";

export const Route = createFileRoute(
  "/_authenticated-only/multiple-device/default-game/$gameId"
)({
  component: C,
});

function C() {
  const {gameId} = Route.useParams();
  // return <DefaultMode_MultipleDevice gameId={Number(gameId)} />;
  return <WaitingRoom gameId={Number(gameId)} />;
}

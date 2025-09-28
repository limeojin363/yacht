import { createFileRoute } from "@tanstack/react-router";
import DefaultMode_MultipleDevice from "../../../pages/games/DefaultGame_MultipleDevice";

export const Route = createFileRoute(
  "/_authenticated-only/multiple-device/default-game/$gameId"
)({
  component: C,
});

function C() {
  const {gameId} = Route.useParams();
  return <DefaultMode_MultipleDevice gameId={Number(gameId)} />;
}

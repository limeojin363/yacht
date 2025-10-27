import { createFileRoute } from "@tanstack/react-router";
import GamePage from "./-components/page";

export const Route = createFileRoute(
  "/_authenticated-only/multiple-device/default-game/$gameId/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { gameId } = Route.useParams();
  return <GamePage gameId={Number(gameId)} />;
}

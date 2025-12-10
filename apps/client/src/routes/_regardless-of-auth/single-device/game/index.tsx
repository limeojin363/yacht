import { createFileRoute } from "@tanstack/react-router";
import Game_SingleDevice from "./-components";

export const Route = createFileRoute(
  "/_regardless-of-auth/single-device/game/",
)({
  component: () => <Game_SingleDevice />,
});

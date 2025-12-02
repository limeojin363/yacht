import { createFileRoute } from "@tanstack/react-router";
import AlteredGame_SingleDevice from "./-components";

export const Route = createFileRoute(
  "/_regardless-of-auth/single-device/game/",
)({
  component: () => <AlteredGame_SingleDevice />,
});
